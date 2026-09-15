from fastapi.testclient import TestClient

from backend import main


def test_liveness_and_unknown_api():
    with TestClient(main.app) as client:
        assert client.get('/health').json() == {'status': 'ok'}
        response = client.get('/api/missing')
        assert response.status_code == 404
        assert response.headers['content-type'] == 'application/json'


def test_database_failure_does_not_leak_credentials(monkeypatch):
    def unavailable():
        raise RuntimeError('secret connection details')

    monkeypatch.setattr(main, 'get_engine', unavailable)
    with TestClient(main.app) as client:
        response = client.get('/api/health/ready')
        assert response.status_code == 503
        assert 'secret' not in response.text
