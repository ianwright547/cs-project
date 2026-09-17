"""Private, authenticated controller. Run on a dedicated Docker host, never App Runner.

Learner containers receive no credentials, host mounts, Docker socket, or network.
Only this control process can reach the Docker API. Requests come from the web API.
"""
import atexit
import base64
import fcntl
import hashlib
import hmac
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
import pty
import secrets
import select
import signal
import struct
import subprocess
import termios
import threading
import time

KEY = os.environ.get('SANDBOX_SECRET', '')
if len(KEY) < 32:
    raise RuntimeError('SANDBOX_SECRET must be set to a random value of at least 32 characters')
IMAGE = os.environ.get('SANDBOX_IMAGE', 'code-practice-shell:local')
RUNTIME = os.environ.get('SANDBOX_RUNTIME', '')
MAX_SESSIONS = int(os.environ.get('SANDBOX_MAX_SESSIONS', '4'))
TTL = 1800
MAX_AGE = 7200
sessions = {}
nonces = {}
lock = threading.RLock()

def docker(*args, data=None, timeout=20):
    result = subprocess.run(['docker', *args], input=data, capture_output=True, timeout=timeout)
    if result.returncode:
        raise RuntimeError('Sandbox operation failed. Reset the session and try again.')
    return result.stdout

def collect(session):
    with session['io_lock']:
        try:
            if session.get('input') and select.select([], [session['fd']], [], 0)[1]:
                count = os.write(session['fd'], session['input'])
                session['input'] = session['input'][count:]
            while select.select([session['fd']], [], [], 0)[0]:
                chunk = os.read(session['fd'], 65536)
                if not chunk:
                    session['closed'] = True
                    break
                session['output'] += chunk
                if len(session['output']) > 1_048_576:
                    excess = len(session['output']) - 1_048_576
                    session['offset'] += excess
                    session['output'] = session['output'][excess:]
        except OSError:
            session['closed'] = True

def remove(session_id):
    with lock:
        session = sessions.pop(session_id, None)
    if session:
        session['closed'] = True
        try:
            session['process'].terminate()
            session['process'].wait(timeout=3)
        except (ProcessLookupError, subprocess.TimeoutExpired):
            pass
        try:
            os.close(session['fd'])
        except OSError:
            pass
        docker('rm', '-f', session['container'])

def maintain():
    while True:
        time.sleep(1)
        with lock:
            active = list(sessions.items())
        for session_id, session in active:
            collect(session)
            if time.time() - session['touched'] > TTL or time.time() - session['created'] > MAX_AGE:
                try:
                    remove(session_id)
                except Exception:
                    pass

def snapshot(session):
    return json.loads(docker('exec', session['container'], '/usr/bin/python3', '-I', '/opt/practice/snapshot.py', timeout=20))

def create(owner, lesson, fixture):
    # Serialize reservations as well as container creation: simultaneous requests
    # cannot overrun capacity or create duplicates for the same browser lesson.
    with lock:
        for session_id, session in sessions.items():
            if session['owner'] == owner and session['lesson'] == lesson and not session['closed']:
                session['touched'] = time.time()
                return {'id':session_id, 'initial':session['initial'], 'snapshot':snapshot(session), 'reused':True}
        owned = [key for key, item in sessions.items() if item['owner'] == owner]
        if len(owned) >= 2:
            remove(owned[0])
        for key, item in list(sessions.items()):
            if item['closed']:
                remove(key)
        if len(sessions) >= MAX_SESSIONS:
            raise ValueError('All practice terminals are busy. Try again shortly or use browser practice.')
        session_id = secrets.token_hex(20)
        container = 'course-session-' + session_id
        flags = ['--runtime', RUNTIME] if RUNTIME else []
        docker('run', '-d', '--rm', '--name', container, '--label', 'code-practice.session=true', '--network', 'none', '--memory', '256m', '--memory-swap', '256m', '--cpus', '0.5', '--pids-limit', '96', '--read-only', '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges', '--user', '1001:1001', '--tmpfs', '/workspace:rw,nosuid,nodev,size=64m,uid=1001,gid=1001', '--tmpfs', '/training:rw,nosuid,nodev,size=64m,uid=1001,gid=1001', '--tmpfs', '/tmp:rw,nosuid,nodev,size=16m,uid=1001,gid=1001', '--tmpfs', '/home/learner:rw,nosuid,nodev,size=16m,uid=1001,gid=1001', *flags, IMAGE)
        try:
            docker('exec', '-i', container, '/usr/bin/python3', '-I', '/opt/practice/seed.py', data=json.dumps(fixture).encode(), timeout=40)
            master, slave = pty.openpty()
            fcntl.ioctl(master, termios.TIOCSWINSZ, struct.pack('HHHH', 24, 100, 0, 0))
            process = subprocess.Popen(['docker', 'exec', '-it', '-w', fixture['cwd'], container, '/bin/bash', '--noprofile', '--rcfile', '/opt/practice/bashrc', '-i'], stdin=slave, stdout=slave, stderr=slave, start_new_session=True)
            os.close(slave)
            os.set_blocking(master, False)
            session = {'owner':owner, 'lesson':lesson, 'container':container, 'fd':master, 'process':process, 'output':b'', 'offset':0, 'closed':False, 'created':time.time(), 'touched':time.time(), 'io_lock':threading.RLock()}
            session['initial'] = snapshot(session)
            sessions[session_id] = session
            return {'id':session_id, 'initial':session['initial'], 'snapshot':session['initial'], 'reused':False}
        except Exception:
            docker('rm', '-f', container)
            raise

def dispatch(body):
    action = body['action']
    owner = body.get('owner', '')
    if action == 'health':
        return {'ready':True, 'capacity':MAX_SESSIONS, 'active':len(sessions)}
    if not isinstance(owner, str) or len(owner) != 48:
        raise ValueError('Invalid session owner')
    if action == 'create':
        return create(owner, body['lesson'], body['fixture'])
    with lock:
        session = sessions.get(body.get('id'))
    if not session or not hmac.compare_digest(session['owner'], owner):
        raise LookupError('This practice session has expired. Start a new terminal.')
    if action == 'delete':
        remove(body['id'])
        return {'closed':True}
    if action == 'snapshot':
        return snapshot(session)
    if action == 'file':
        session['touched'] = time.time()
        request = {'action': 'write' if 'content' in body else 'read', 'path':body['path']}
        if 'content' in body:
            request['content'] = body['content']
        return json.loads(docker('exec', '-i', session['container'], '/usr/bin/python3', '-I', '/opt/practice/files.py', data=json.dumps(request).encode()))
    if action == 'io':
        with session['io_lock']:
            if 'cols' in body and 'rows' in body:
                columns = max(20, min(300, int(body['cols'])))
                rows = max(5, min(100, int(body['rows'])))
                if session.get('size') != (rows, columns):
                    session['size'] = (rows, columns)
                    fcntl.ioctl(session['fd'], termios.TIOCSWINSZ, struct.pack('HHHH', rows, columns, 0, 0))
                    session['process'].send_signal(signal.SIGWINCH)
            incoming = base64.b64decode(body.get('input', ''), validate=True)
            if len(incoming) > 8192:
                raise ValueError('Input too large. Paste smaller blocks.')
            if incoming and not session['closed']:
                if len(session.get('input', b'')) + len(incoming) > 32768:
                    raise ValueError('The terminal input queue is full. Wait for the command to finish.')
                session['touched'] = time.time()
                session['input'] = session.get('input', b'') + incoming
        cursor = max(0, int(body.get('cursor', 0)))
        deadline = time.monotonic() + (0.1 if incoming else 1.0)
        while time.monotonic() < deadline:
            collect(session)
            if session['offset'] + len(session['output']) > cursor or session['closed']:
                break
            time.sleep(0.02)
        with session['io_lock']:
            start = max(0, cursor - session['offset'])
            output = session['output'][start:start + 131072]
            return {'output':base64.b64encode(output).decode(), 'cursor':session['offset'] + start + len(output), 'closed':session['closed'], 'trimmed':cursor < session['offset']}
    raise ValueError('Unknown sandbox action')

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass  # Never log requests, terminal input, cookies, or shared credentials.

    def do_POST(self):
        try:
            if self.path != '/rpc':
                self.send_error(404); return
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 < length <= 524288:
                self.send_error(413); return
            raw = self.rfile.read(length)
            stamp = self.headers.get('X-Practice-Time', '')
            nonce = self.headers.get('X-Practice-Nonce', '')
            signature = self.headers.get('X-Practice-Signature', '')
            expected = hmac.new(KEY.encode(), stamp.encode() + b'\n' + nonce.encode() + b'\n' + raw, hashlib.sha256).hexdigest()
            if abs(time.time() - float(stamp or 0)) > 45 or not hmac.compare_digest(signature, expected) or len(nonce) != 32:
                self.send_error(403); return
            with lock:
                for key, expiry in list(nonces.items()):
                    if expiry < time.time():
                        del nonces[key]
                if nonce in nonces:
                    self.send_error(403); return
                nonces[nonce] = time.time() + 60
            response = dispatch(json.loads(raw))
            status = 200
        except LookupError as exc:
            response, status = {'detail':str(exc)}, 404
        except ValueError as exc:
            response, status = {'detail':str(exc)}, 400
        except Exception:
            response, status = {'detail':'The terminal service could not complete that action. Reset the session or try again.'}, 503
        data = json.dumps(response).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(data)

if __name__ == '__main__':
    # Remove only this service's expired containers after a controller restart.
    for name in docker('ps', '-aq', '--filter', 'label=code-practice.session=true').decode().split():
        docker('rm', '-f', name)
    threading.Thread(target=maintain, daemon=True).start()
    atexit.register(lambda: [remove(key) for key in list(sessions)])
    server = ThreadingHTTPServer((os.getenv('SANDBOX_BIND', '127.0.0.1'), int(os.getenv('SANDBOX_PORT', '8787'))), Handler)
    server.timeout = 30
    print('Practice sandbox controller ready', flush=True)
    server.serve_forever()
