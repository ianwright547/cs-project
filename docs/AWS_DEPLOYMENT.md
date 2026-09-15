# Deploy Code Practice to AWS App Runner

The app is now called Code Practice. Existing database, ECR, security group, and secret names below keep their original identifiers so the current deployment continues to work.

Code Practice ships as one web image: the first Docker stage tests and builds React, and the final stage runs FastAPI and serves the generated frontend. Production uses Amazon ECR for that image, AWS App Runner for the public web service, and private Amazon RDS for PostgreSQL.

```text
Browser → App Runner HTTPS endpoint → Code Practice container → private RDS PostgreSQL
                    ↑                         ↑
                  ECR image          Secrets Manager DATABASE_URL
```

AWS resources cost money while they exist. Keep every resource in one Region, add cost alerts before launch, and delete unused test resources.

## 1. Verify the production image locally

From the repository root:

```bash
docker compose up --build -d
docker compose ps
curl --fail http://localhost:8000/health
curl --fail http://localhost:8000/api/health/ready
```

Both containers should be healthy. The readiness response must say `"database":"connected"`. The build runs the frontend terminal/grader tests before it creates the final image.

## 2. Install and sign in to AWS tooling

Install AWS CLI v2, then configure a named IAM identity or AWS IAM Identity Center session. Confirm the account before creating anything:

```bash
aws configure sso
aws sts get-caller-identity
```

Choose one Region. `us-east-2` is a reasonable example for a US deployment; replace it if your users or existing infrastructure are elsewhere.

```bash
export AWS_REGION=us-east-2
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/threshold"
export IMAGE_TAG=$(git rev-parse --short HEAD)
```

## 3. Create ECR and push the image

Create the private repository once:

```bash
aws ecr create-repository \
  --repository-name threshold \
  --image-scanning-configuration scanOnPush=true \
  --region "$AWS_REGION"
```

Authenticate Docker and push an immutable commit-tagged Linux image:

```bash
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

docker buildx build \
  --platform linux/amd64 \
  --tag "$ECR_URI:$IMAGE_TAG" \
  --push .
```

ECR authentication tokens last 12 hours. AWS documents the same login/tag/push sequence in [Pushing a Docker image to ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html). Review the image scan before deploying. Enhanced continuous scanning is available through Amazon Inspector if you need it later.

## 4. Create the VPC path and RDS database

Use the VPC console to create a VPC spanning at least two Availability Zones with private subnets. Create two security groups:

- `threshold-apprunner`: outbound PostgreSQL traffic to the database security group on TCP 5432.
- `threshold-rds`: inbound TCP 5432 with `threshold-apprunner` as the source. Do not allow `0.0.0.0/0`.

Create an App Runner VPC connector using the private subnets and `threshold-apprunner`. App Runner requires the connector to reach a private RDS instance. AWS recommends private connector subnets and explains the routing behavior in [App Runner VPC access](https://docs.aws.amazon.com/apprunner/latest/dg/network-vpc.html).

Create an RDS PostgreSQL instance with these settings:

- Database name: `threshold`
- Public access: **No**
- VPC/security group: the VPC above and `threshold-rds`
- Storage encryption: enabled
- Automated backups: at least 7 days
- Deletion protection: enabled for production
- Initial size: a small burstable instance is enough for development; choose production capacity from observed load

Record the RDS endpoint. Do not put the database password in Git, the Docker image, App Runner plain-text variables, or shell history. AWS covers private access, backups, and instance configuration in the [RDS setup guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_SettingUp.html).

## 5. Store `DATABASE_URL` in Secrets Manager

Build the value in this form, URL-encoding special characters in the username or password:

```text
postgresql+psycopg://threshold_app:URL_ENCODED_PASSWORD@RDS_ENDPOINT:5432/threshold?sslmode=require
```

Create a Secrets Manager secret named `threshold/production/database-url` whose entire secret value is that URL. The application expects one string, not a JSON credentials object.

RDS for PostgreSQL supports TLS and newer PostgreSQL versions require it by default; AWS describes the client modes in [Using SSL with RDS PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.SSL.html).

## 6. Create the two App Runner IAM roles

App Runner needs two different roles:

1. **ECR access role:** trust principal `build.apprunner.amazonaws.com`; attach the AWS-managed `AWSAppRunnerServicePolicyForECRAccess` policy. This lets App Runner pull the image.
2. **Instance role:** trust principal `tasks.apprunner.amazonaws.com`; grant only `secretsmanager:GetSecretValue` on the database secret ARN. This lets the running service resolve `DATABASE_URL`.

The App Runner console can create the ECR role. Keep the instance-role secret policy scoped to the one production secret. See [App Runner service roles](https://docs.aws.amazon.com/apprunner/latest/dg/security_iam_service-with-iam.html) and [App Runner secret permissions](https://docs.aws.amazon.com/apprunner/latest/dg/env-variable.html).

## 7. Create the App Runner service

The easiest first deployment is through the App Runner console:

1. Choose **Container registry → Amazon ECR** and select `threshold:$IMAGE_TAG`.
2. Select the ECR access role.
3. Set container port to `8000`.
4. Add plain environment variables `RUN_MIGRATIONS=1` and `APP_URL=https://your-eventual-domain`.
5. Add a Secrets Manager environment variable named `DATABASE_URL` pointing to the database URL secret.
6. Select the instance role that can read that secret.
7. Under networking, select **Custom VPC** and the connector created above. Leave incoming access public.
8. Set the HTTP health check path to `/health`.
9. Start with 1 vCPU and 2 GB memory, then change it from observed metrics.
10. Create and deploy the service.

For CLI creation, copy [the service template](../deploy/aws/apprunner-service.template.json), replace every `REPLACE_WITH_...` value, and run:

```bash
aws apprunner create-service \
  --cli-input-json file://deploy/aws/apprunner-service.json \
  --region "$AWS_REGION"
```

The container runs `alembic upgrade head` before starting the web process when `RUN_MIGRATIONS=1`. A PostgreSQL advisory lock serializes migrations if App Runner starts more than one instance. `/health` checks the process; `/api/health/ready` additionally checks the database.

App Runner reserves the `PORT` variable and injects it at runtime, so do not create your own `PORT` environment variable. Secret references are loaded during deployment; redeploy after rotating a secret. See [App Runner environment variables](https://docs.aws.amazon.com/apprunner/latest/dg/env-variable-manage.html) and [HTTP health checks](https://docs.aws.amazon.com/apprunner/latest/dg/manage-configure-healthcheck.html).

## 8. Verify production

Use the App Runner service URL:

```bash
export APP_URL=https://YOUR_SERVICE_ID.REGION.awsapprunner.com
curl --fail "$APP_URL/health"
curl --fail "$APP_URL/api/health/ready"
curl --fail "$APP_URL/api/curriculum"
```

Open these routes in a browser and complete one terminal exercise:

```text
/
/course.html?course=git#gp001
/course.html?course=github#hp001
```

Check App Runner deployment and application logs in CloudWatch if readiness fails. A healthy `/health` with a failing `/api/health/ready` usually means the RDS endpoint, secret, VPC connector, or security-group path is wrong.

## 9. Add the domain

In App Runner, open **Custom domains**, link the domain, and add the provided DNS records. Route 53 can configure the certificate validation and routing records automatically. App Runner manages the HTTPS certificate. AWS documents this in [Managing App Runner custom domains](https://docs.aws.amazon.com/apprunner/latest/dg/manage-custom-domains.html).

Set `APP_URL` to the final HTTPS origin and redeploy before enabling Google or GitHub OAuth callbacks.

## 10. Ship later versions and roll back

For each release, test, push a new commit tag, and deploy that exact image:

```bash
export IMAGE_TAG=$(git rev-parse --short HEAD)
docker buildx build --platform linux/amd64 --tag "$ECR_URI:$IMAGE_TAG" --push .
```

Update the App Runner service image to the new tag and deploy. Never overwrite an old release tag. To roll back application code, select the previous ECR tag and deploy it. Database rollbacks require a reviewed Alembic downgrade or an RDS restore; changing the image alone does not reverse a migration.

## Networking needed when OAuth is added

With a VPC connector, application outbound traffic goes into the VPC and does not automatically reach the public internet. The current app only needs RDS. When server-side Google or GitHub OAuth is integrated, add controlled internet egress through a NAT gateway or another supported network design. AWS explicitly documents this VPC-connector behavior in [App Runner VPC access](https://docs.aws.amazon.com/apprunner/latest/dg/network-vpc.html).

## What deployment does not finish

The current course terminal and practical grades persist in each browser's local storage. Deploying this image does not sync them to PostgreSQL. Account authentication plus user-scoped progress endpoints still need to be connected before learners can carry progress between browsers or devices.
