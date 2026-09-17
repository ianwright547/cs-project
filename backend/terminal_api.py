"""Stateless proxy to a separate sandbox host. The web process never runs a shell."""
import hashlib
import hmac
import json
import os
from pathlib import Path
import secrets
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request as URLRequest, urlopen

from fastapi import APIRouter, HTTPException, Request, Response
from pydantic import BaseModel, Field

router = APIRouter(prefix='/api/terminal')
COOKIE = 'code_practice_terminal_owner'

def secret():
    key = os.getenv('SANDBOX_SECRET', '')
    if len(key) < 32 or not os.getenv('SANDBOX_URL'):
        raise HTTPException(503, 'The real terminal is not configured. Browser practice is available.')
    return key

def owner(request: Request, response: Response):
    key = secret()
    origin = request.headers.get('origin')
    if origin and urlsplit(origin).netloc not in {request.headers.get('host'), urlsplit(os.getenv('APP_URL', '')).netloc}:
        raise HTTPException(403, 'Use the terminal from this website.')
    value = request.cookies.get(COOKIE, '')
    identity, _, signature = value.partition('.')
    expected = hmac.new(key.encode(), identity.encode(), hashlib.sha256).hexdigest()
    if len(identity) != 48 or not hmac.compare_digest(signature, expected):
        identity = secrets.token_hex(24)
        signature = hmac.new(key.encode(), identity.encode(), hashlib.sha256).hexdigest()
        response.set_cookie(COOKIE, identity + '.' + signature, max_age=86400, httponly=True, secure=request.url.scheme == 'https' or os.getenv('APP_URL', '').startswith('https://'), samesite='strict', path='/api/terminal')
    response.headers['Cache-Control'] = 'no-store'
    return identity

def rpc(payload):
    key = secret()
    raw = json.dumps(payload).encode()
    stamp, nonce = str(time.time()), secrets.token_hex(16)
    signature = hmac.new(key.encode(), stamp.encode() + b'\n' + nonce.encode() + b'\n' + raw, hashlib.sha256).hexdigest()
    request = URLRequest(os.environ['SANDBOX_URL'].rstrip('/') + '/rpc', data=raw, headers={'Content-Type':'application/json', 'X-Practice-Time':stamp, 'X-Practice-Nonce':nonce, 'X-Practice-Signature':signature})
    try:
        with urlopen(request, timeout=50 if payload['action'] == 'create' else 25) as result:
            return json.loads(result.read(8_000_000))
    except HTTPError as exc:
        try:
            detail = json.loads(exc.read(4096)).get('detail', 'The terminal service could not complete that action.')
        except (ValueError, AttributeError):
            detail = 'The terminal service could not complete that action.'
        raise HTTPException(exc.code if exc.code in (400, 404, 429, 503) else 503, detail) from None
    except (URLError, TimeoutError, ValueError):
        raise HTTPException(503, 'The terminal service is unavailable. Your session may still be running; try reconnecting.') from None

@router.get('/config')
def config(response: Response):
    response.headers['Cache-Control'] = 'no-store'
    return {'enabled':bool(os.getenv('SANDBOX_URL')) and len(os.getenv('SANDBOX_SECRET', '')) >= 32, 'platform':'Linux · Bash', 'idle_minutes':30}

class SessionCreate(BaseModel):
    lesson: str = Field(pattern=r'^(gp|hp|c)\d{2,3}$', max_length=8)

@router.post('/sessions')
def create(body: SessionCreate, request: Request, response: Response):
    identity = owner(request, response)
    path = Path(__file__).resolve().parents[1] / 'frontend' / 'dist' / 'practice-fixtures.json'
    try:
        fixtures = json.loads(path.read_text())
    except (OSError, ValueError):
        raise HTTPException(503, 'The practice fixtures are missing from this build.') from None
    fixture = fixtures.get(body.lesson)
    if not fixture:
        raise HTTPException(404, 'Practice lesson not found.')
    return rpc({'action':'create', 'owner':identity, 'lesson':body.lesson, 'fixture':fixture})

class TerminalInput(BaseModel):
    input: str = Field(default='', max_length=12000)
    cursor: int = Field(default=0, ge=0)
    cols: int = Field(default=100, ge=20, le=300)
    rows: int = Field(default=24, ge=5, le=100)

@router.post('/sessions/{session_id}/io')
def terminal_io(session_id: str, body: TerminalInput, request: Request, response: Response):
    return rpc({'action':'io', 'id':session_id, 'owner':owner(request, response), **body.model_dump()})

@router.get('/sessions/{session_id}/snapshot')
def snapshot(session_id: str, request: Request, response: Response):
    return rpc({'action':'snapshot', 'id':session_id, 'owner':owner(request, response)})

class FileUpdate(BaseModel):
    path: str = Field(min_length=1, max_length=1024)
    content: str = Field(max_length=262144)

@router.put('/sessions/{session_id}/file')
def update_file(session_id: str, body: FileUpdate, request: Request, response: Response):
    return rpc({'action':'file', 'id':session_id, 'owner':owner(request, response), **body.model_dump()})

@router.delete('/sessions/{session_id}')
def close(session_id: str, request: Request, response: Response):
    return rpc({'action':'delete', 'id':session_id, 'owner':owner(request, response)})
