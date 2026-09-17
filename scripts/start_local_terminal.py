"""Start the web API and isolated terminal controller for local development."""
from pathlib import Path
import os
import secrets
import signal
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
env = {**os.environ, 'SANDBOX_SECRET':secrets.token_hex(32), 'SANDBOX_URL':'http://127.0.0.1:8787', 'APP_URL':'http://127.0.0.1:5175'}
processes = []
def stop(*_):
    for process in reversed(processes):
        process.terminate()
    for process in reversed(processes):
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            process.kill()
    sys.exit(0)

signal.signal(signal.SIGINT, stop)
signal.signal(signal.SIGTERM, stop)
processes.append(subprocess.Popen([sys.executable, 'sandbox/server.py'], cwd=root, env=env))
processes.append(subprocess.Popen([sys.executable, '-m', 'uvicorn', 'backend.main:app', '--host', '127.0.0.1', '--port', '8002'], cwd=root, env=env))
print('API on 8002, sandbox controller on 8787. No credentials are printed.', flush=True)
try:
    processes[-1].wait()
finally:
    stop()
