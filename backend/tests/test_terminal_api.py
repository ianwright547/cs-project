import json
from pathlib import Path

from fastapi.testclient import TestClient
import pytest

from backend.main import app
from backend import terminal_api

@pytest.fixture
def client(monkeypatch):
    monkeypatch.setenv('SANDBOX_URL', 'http://sandbox.internal:8787')
    monkeypatch.setenv('SANDBOX_SECRET', 'test-only-key-32-characters-long-enough')
    monkeypatch.setenv('APP_URL', 'http://testserver')
    with TestClient(app) as client:
        yield client

def test_config_does_not_expose_connection_or_key(client):
    data = client.get('/api/terminal/config').json()
    assert data['enabled']
    assert 'sandbox.internal' not in json.dumps(data)
    assert 'test-only' not in json.dumps(data)

def test_disabled_terminal_is_explicit(client, monkeypatch):
    monkeypatch.delenv('SANDBOX_SECRET')
    assert not client.get('/api/terminal/config').json()['enabled']
    assert client.post('/api/terminal/sessions', json={'lesson':'gp039'}).status_code == 503

def test_reject_cross_site_request_before_contacting_runner(client, monkeypatch):
    monkeypatch.setattr(terminal_api, 'rpc', lambda _: pytest.fail('runner should not be contacted'))
    response = client.post('/api/terminal/sessions', headers={'origin':'https://unrelated.example'}, json={'lesson':'gp039'})
    assert response.status_code == 403

def test_create_uses_authored_fixture_and_stable_signed_owner(client, monkeypatch):
    calls = []
    monkeypatch.setattr(terminal_api, 'rpc', lambda payload: calls.append(payload) or {'id':'session'})
    fixture_path = Path(__file__).resolve().parents[2] / 'frontend/dist/practice-fixtures.json'
    if not fixture_path.exists():
        pytest.skip('Build frontend fixtures first')
    assert client.post('/api/terminal/sessions', json={'lesson':'gp039','fixture':{'repo':'/host'}}).status_code == 200
    client.get('/api/terminal/sessions/session/snapshot')
    assert calls[0]['fixture']['repo'] == '/workspace/practice'
    assert calls[0]['owner'] == calls[1]['owner']
    assert len(calls[0]['owner']) == 48

def test_reject_unknown_lesson_and_oversized_input(client, monkeypatch):
    monkeypatch.setattr(terminal_api, 'rpc', lambda _: pytest.fail('runner should not be contacted'))
    assert client.post('/api/terminal/sessions', json={'lesson':'../../etc'}).status_code == 422
    assert client.post('/api/terminal/sessions/session/io', json={'input':'a'*12001}).status_code == 422
