"""Write a reviewable CloudFormation template; this does not create resources.

The separate host runs gVisor-isolated learner containers. App Runner keeps the
website and database credentials; only its VPC security group can call the host.
"""
import argparse
import base64
import gzip
import json
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--output', default='/tmp/code-practice-sandbox-stack.json')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
controller = base64.b64encode(gzip.compress((root / 'sandbox/server.py').read_bytes())).decode()
bootstrap = '''import json, os, subprocess
from pathlib import Path
config = json.loads(Path('/opt/code-practice/config.json').read_text())
def aws(*args):
    return subprocess.check_output(['aws', *args, '--region', config['region'], '--output', 'json'])
secret = json.loads(aws('secretsmanager', 'get-secret-value', '--secret-id', config['secret']))['SecretString']
image = config['image']
password = subprocess.check_output(['aws', 'ecr', 'get-login-password', '--region', config['region']])
subprocess.run(['docker', 'login', '--username', 'AWS', '--password-stdin', image.split('/')[0]], input=password, check=True, stdout=subprocess.DEVNULL)
subprocess.run(['docker', 'pull', image], check=True)
env = dict(os.environ, SANDBOX_SECRET=secret, SANDBOX_IMAGE=image, SANDBOX_RUNTIME='runsc', SANDBOX_BIND='0.0.0.0', SANDBOX_MAX_SESSIONS='4')
os.execve('/usr/bin/python3', ['python3', '/opt/code-practice/server.py'], env)
'''
launcher = base64.b64encode(gzip.compress(bootstrap.encode())).decode()
userdata = '''#!/bin/bash
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y docker.io awscli curl gnupg ca-certificates
curl -fsSL https://gvisor.dev/archive.key | gpg --dearmor -o /usr/share/keyrings/gvisor-archive-keyring.gpg
echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/gvisor-archive-keyring.gpg] https://storage.googleapis.com/gvisor/releases release main' > /etc/apt/sources.list.d/gvisor.list
apt-get update
apt-get install -y runsc
runsc install
systemctl restart docker
mkdir -p /opt/code-practice
python3 - <<'PY'
import base64, gzip, json
from pathlib import Path
folder = Path('/opt/code-practice')
(folder/'server.py').write_bytes(gzip.decompress(base64.b64decode('${Controller}')))
(folder/'start.py').write_bytes(gzip.decompress(base64.b64decode('${Launcher}')))
(folder/'config.json').write_text(json.dumps({'region':'${AWS::Region}', 'secret':'${SandboxSecret}', 'image':'${SandboxImage}'}))
PY
cat > /etc/systemd/system/code-practice-sandbox.service <<'UNIT'
[Unit]
Description=Code Practice isolated terminal controller
After=network-online.target docker.service
Wants=network-online.target
Requires=docker.service
[Service]
ExecStart=/usr/bin/python3 /opt/code-practice/start.py
Restart=on-failure
RestartSec=20
UMask=0077
LimitNOFILE=8192
[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable --now code-practice-sandbox
'''
template = {
    'AWSTemplateFormatVersion':'2010-09-09',
    'Description':'Dedicated Linux practice terminal host with gVisor and restricted VPC access',
    'Parameters':{
        'VpcId':{'Type':'AWS::EC2::VPC::Id'},
        'SubnetId':{'Type':'AWS::EC2::Subnet::Id', 'Description':'Existing public subnet for host package downloads; no public inbound ports'},
        'AppSecurityGroup':{'Type':'AWS::EC2::SecurityGroup::Id'},
        'AppInstanceRole':{'Type':'String'},
        'SandboxImage':{'Type':'String', 'AllowedPattern':r'\d+\.dkr\.ecr\.[a-z0-9-]+\.amazonaws\.com/[a-z0-9/_-]+@sha256:[a-f0-9]{64}'},
        'RepositoryArn':{'Type':'String'},
        'UbuntuImage':{'Type':'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>', 'Default':'/aws/service/canonical/ubuntu/server/24.04/stable/current/amd64/hvm/ebs-gp3/ami-id'},
    },
    'Resources':{
        'SandboxSecret':{'Type':'AWS::SecretsManager::Secret', 'Properties':{'Description':'Private web-to-sandbox request signing key', 'GenerateSecretString':{'PasswordLength':64, 'ExcludePunctuation':True}}},
        'WebSecretPermission':{'Type':'AWS::IAM::Policy', 'Properties':{'PolicyName':'ReadPracticeSandboxSecret', 'Roles':[{'Ref':'AppInstanceRole'}], 'PolicyDocument':{'Version':'2012-10-17', 'Statement':[{'Effect':'Allow', 'Action':'secretsmanager:GetSecretValue', 'Resource':{'Ref':'SandboxSecret'}}]}}},
        'HostRole':{'Type':'AWS::IAM::Role', 'Properties':{'AssumeRolePolicyDocument':{'Version':'2012-10-17', 'Statement':[{'Effect':'Allow','Principal':{'Service':'ec2.amazonaws.com'},'Action':'sts:AssumeRole'}]}, 'ManagedPolicyArns':['arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore'], 'Policies':[{'PolicyName':'ReadSandboxImageAndKey', 'PolicyDocument':{'Version':'2012-10-17', 'Statement':[
            {'Effect':'Allow','Action':'secretsmanager:GetSecretValue','Resource':{'Ref':'SandboxSecret'}},
            {'Effect':'Allow','Action':'ecr:GetAuthorizationToken','Resource':'*'},
            {'Effect':'Allow','Action':['ecr:BatchGetImage','ecr:GetDownloadUrlForLayer','ecr:BatchCheckLayerAvailability'],'Resource':{'Ref':'RepositoryArn'}},
        ]}}]}},
        'HostProfile':{'Type':'AWS::IAM::InstanceProfile', 'Properties':{'Roles':[{'Ref':'HostRole'}]}},
        'HostSecurityGroup':{'Type':'AWS::EC2::SecurityGroup', 'Properties':{'GroupDescription':'Practice controller reachable only by the App Runner connector', 'VpcId':{'Ref':'VpcId'}, 'SecurityGroupIngress':[{'IpProtocol':'tcp','FromPort':8787,'ToPort':8787,'SourceSecurityGroupId':{'Ref':'AppSecurityGroup'}}], 'SecurityGroupEgress':[{'IpProtocol':'-1','CidrIp':'0.0.0.0/0'}]}},
        'SandboxHost':{'Type':'AWS::EC2::Instance', 'DependsOn':'WebSecretPermission', 'Properties':{
            'ImageId':{'Ref':'UbuntuImage'},'InstanceType':'t3.small','CreditSpecification':{'CPUCredits':'standard'},
            'IamInstanceProfile':{'Ref':'HostProfile'},
            'MetadataOptions':{'HttpTokens':'required','HttpPutResponseHopLimit':1},
            'NetworkInterfaces':[{'DeviceIndex':'0','SubnetId':{'Ref':'SubnetId'},'AssociatePublicIpAddress':True,'GroupSet':[{'Ref':'HostSecurityGroup'}]}],
            'BlockDeviceMappings':[{'DeviceName':'/dev/sda1','Ebs':{'VolumeSize':20,'VolumeType':'gp3','Encrypted':True,'DeleteOnTermination':True}}],
            'UserData':{'Fn::Base64':{'Fn::Sub':[userdata,{'Controller':controller,'Launcher':launcher}]}},
            'Tags':[{'Key':'Name','Value':'cs-course-sandbox'},{'Key':'Project','Value':'cs-course'}],
        }},
    },
    'Outputs':{
        'InstanceId':{'Value':{'Ref':'SandboxHost'}},
        'SandboxUrl':{'Value':{'Fn::Sub':'http://${SandboxHost.PrivateIp}:8787'}},
        'SecretArn':{'Value':{'Ref':'SandboxSecret'}},
    },
}
Path(args.output).write_text(json.dumps(template, indent=2) + '\n')
print(f'Template written to {args.output}; no AWS resources changed.')
