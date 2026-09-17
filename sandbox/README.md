# Practice shell

The browser uses xterm.js with a real Bash PTY. FastAPI forwards signed requests
to a separate Docker host. Each session has its own Git repository and files.

## Local development

From the project root, with Docker running:

```bash
docker build -t code-practice-shell:local sandbox
cd frontend
npm install
npm run build
cd ..
.venv/bin/python scripts/start_local_terminal.py
```

In another terminal:

```bash
cd frontend
CODE_PRACTICE_API_URL=http://127.0.0.1:8002 npm run dev -- --port 5175
```

Open http://127.0.0.1:5175. The launcher creates a temporary signing key in memory.
Keep the controller on loopback for local development. It needs Docker access;
the web application and learner containers do not.

## Checks

```bash
.venv/bin/python -m pytest sandbox/test_integration.py -q
.venv/bin/python sandbox/check_lessons.py
cd frontend
NATIVE_GRADE_RESULT=/tmp/practice-native-grade.json NATIVE_WORKFLOW_RESULTS=/tmp/practice-all-native-grades.json npm test
```

The workflow check executes all 70 Git activities using real Git, records their
state in temporary files, and feeds those files to the normal frontend grader.
It accepts default commit messages automatically and splits interactive patches.
Learners can use nano and Git's normal interactive prompts in the browser.

## AWS

`scripts/build_sandbox_stack.py` generates a CloudFormation template for review.
It creates a t3.small host, a 20 GB encrypted disk, an outbound public IP,
gVisor, a request-signing secret, and scoped IAM permissions. These resources
have recurring charges. The host accepts port 8787 only from the existing
App Runner connector security group. There is no public SSH or terminal port.

Supply the existing VPC, a public subnet in that VPC, App Runner connector
security group, App Runner instance role name, ECR repository ARN, and sandbox
image pinned by digest. Build that image for linux/amd64 with `sandbox` as its
Docker build context. Inspect the template before deploying it with IAM capability.

After the host's systemd service is healthy, set App Runner's `SANDBOX_URL` to the
stack's private URL and reference its `SecretArn` as the `SANDBOX_SECRET` runtime
secret. Redeploy the web image. Preserve the database, OAuth, and session settings.
Check readiness, create a terminal, execute commands, and submit a lesson on the
deployed URL. Updating environment variables alone is not a successful test.

Use Systems Manager to inspect `code-practice-sandbox.service` and cloud-init
logs. Update and patch the host and shell image regularly. Changing controller
code requires updating the host; changing frontend code requires a web deployment.
To disable native terminals, remove both sandbox environment settings and
redeploy the web app. The browser simulator remains available as a fallback.

## Limits

Linux Bash is the environment on every client platform. Learner containers have
no network, secrets, host mounts, or Docker socket. Git remote exercises use an
individual local bare repository. Sessions have 256 MB RAM, half a CPU, 96
processes, bounded writable storage, 30 minutes idle time, and two hours maximum
lifetime. There are four simultaneous sessions, at most two per browser.

The host is a single point of failure, and sessions are disposable. This is a
small course deployment, not an unrestricted multi-user hosting service. The
browser grader is a learning aid, not a tamper-proof assessment system. GitHub
written tasks do not verify external GitHub actions.
