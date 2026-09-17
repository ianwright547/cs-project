from pathlib import Path
from contextlib import asynccontextmanager
from datetime import datetime, timezone
import hmac
import os
import secrets

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import select, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from backend.database import get_engine
from backend.curriculum import parse_curriculum
from backend.auth import SESSION_COOKIE, current_user, end_session, start_session, user_payload
from backend.models import AuthIdentity, User
from backend.oauth_auth import authorization_url, exchange_code, sign_session, verify_session, PROVIDERS
from backend.terminal_api import router as terminal_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.courses, app.state.quiz_answers = parse_curriculum()
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(terminal_router)


def _session_secret() -> str:
    secret = os.getenv("SESSION_SECRET")
    if not secret:
        raise HTTPException(503, "Authentication is not configured.")
    return secret


def _app_url(request: Request) -> str:
    return os.getenv("APP_URL", str(request.base_url).rstrip("/"))


def _secure_cookie(request: Request) -> bool:
    return request.url.scheme == "https" or _app_url(request).startswith("https://")


def _db():
    return Session(get_engine())


@app.get('/auth/{provider}/start')
def auth_start(provider: str, request: Request):
    if provider not in PROVIDERS:
        raise HTTPException(404, 'Unsupported sign-in provider.')
    secret = _session_secret()
    state = sign_session({
        'provider': provider,
        'nonce': secrets.token_urlsafe(18),
        'exp': int(datetime.now(timezone.utc).timestamp()) + 600,
    }, secret)
    try:
        destination = authorization_url(provider, state, _app_url(request))
    except KeyError:
        raise HTTPException(503, 'Authentication is not configured for this provider.')
    response = RedirectResponse(destination, status_code=303)
    response.set_cookie('threshold_oauth_state', state, max_age=600, httponly=True, secure=_secure_cookie(request), samesite='lax', path='/')
    return response


@app.get('/auth/{provider}/callback')
def auth_callback(provider: str, request: Request, code: str | None = None, state: str | None = None, error: str | None = None):
    if provider not in PROVIDERS:
        raise HTTPException(404, 'Unsupported sign-in provider.')
    if error or not code or not state:
        return RedirectResponse('/login.html?error=cancelled', status_code=303)
    cookie_state = request.cookies.get('threshold_oauth_state')
    if not cookie_state or not hmac.compare_digest(cookie_state, state):
        raise HTTPException(400, 'The sign-in session expired. Try again.')
    state_data = verify_session(state, _session_secret())
    if not state_data or state_data.get('provider') != provider or int(state_data.get('exp', 0)) < int(datetime.now(timezone.utc).timestamp()):
        raise HTTPException(400, 'The sign-in session expired. Try again.')
    try:
        profile = exchange_code(provider, code, _app_url(request))
    except Exception as exc:
        raise HTTPException(502, 'The provider could not complete sign-in.') from exc
    if not profile.get('provider_subject'):
        raise HTTPException(502, 'The provider returned an incomplete profile.')
    with _db() as db:
        identity = db.scalar(select(AuthIdentity).where(AuthIdentity.provider == provider, AuthIdentity.provider_subject == profile['provider_subject']))
        if identity:
            user = db.get(User, identity.user_id)
        else:
            display_name = (profile.get('name') or profile.get('email') or 'Code Practice learner').strip()
            user = User(display_name=display_name[:200], email=profile.get('email') or None)
            db.add(user)
            db.flush()
            identity = AuthIdentity(user_id=user.id, provider=provider, provider_subject=profile['provider_subject'], github_username=profile.get('github_username'))
            db.add(identity)
        if profile.get('email') and not user.email:
            user.email = profile['email']
        db.commit()
        response = RedirectResponse('/profile.html', status_code=303)
        start_session(db, response, user.id, secure=_secure_cookie(request))
        response.delete_cookie('threshold_oauth_state', path='/')
        return response


@app.get('/api/me')
def me(request: Request):
    if not request.cookies.get(SESSION_COOKIE):
        raise HTTPException(401, 'Sign in required.')
    with _db() as db:
        user = current_user(request, db)
        if not user:
            raise HTTPException(401, 'Sign in required.')
        return user_payload(user, db)


class ProfileUpdate(BaseModel):
    display_name: str = Field(min_length=1, max_length=200)


@app.patch('/api/me')
def update_me(update: ProfileUpdate, request: Request):
    if not request.cookies.get(SESSION_COOKIE):
        raise HTTPException(401, 'Sign in required.')
    with _db() as db:
        user = current_user(request, db)
        if not user:
            raise HTTPException(401, 'Sign in required.')
        user.display_name = update.display_name.strip()
        if not user.display_name:
            raise HTTPException(422, 'Display name cannot be blank.')
        db.commit()
        db.refresh(user)
        return user_payload(user, db)


@app.post('/api/auth/logout')
def logout(request: Request):
    if not request.cookies.get(SESSION_COOKIE):
        response = JSONResponse({'ok': True})
        response.delete_cookie(SESSION_COOKIE, path='/')
        return response
    with _db() as db:
        response = JSONResponse({'ok': True})
        end_session(request, response, db)
        return response


@app.get('/api/curriculum')
def curriculum():
    return {'courses': app.state.courses}


class QuizAnswers(BaseModel):
    answers: dict[str, str] = Field(max_length=3)


@app.post('/api/curriculum/{course_id}/quizzes/{quiz_id}/check')
def check_quiz(course_id: str, quiz_id: str, submission: QuizAnswers):
    course = next((c for c in app.state.courses if c['id'] == course_id), None)
    quiz = next((a for u in course['units'] for a in u['activities'] if a['id'] == quiz_id and a['type'] == 'quiz'), None) if course else None
    if not quiz:
        raise HTTPException(404, 'Quiz not found.')
    expected = {q['id'] for q in quiz['questions']}
    if set(submission.answers) != expected or any(value not in 'ABCD' or len(value) != 1 for value in submission.answers.values()):
        raise HTTPException(422, 'Choose one answer for each question.')
    results = [{
        'id': q['id'], **app.state.quiz_answers[q['id']],
        'passed': submission.answers[q['id']] == app.state.quiz_answers[q['id']]['correct'],
    } for q in quiz['questions']]
    score = sum(result['passed'] for result in results)
    # Content preview assessment only; no account progress is written or unlocked.
    return {'score': score, 'total': len(results), 'passed': score >= 2, 'results': results}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get('/api/health/ready')
def ready():
    try:
        with get_engine().connect() as connection:
            # Constant query: no user data is exposed by this public readiness check.
            connection.execute(text('SELECT 1'))
        return {'status': 'ok', 'database': 'connected'}
    except (SQLAlchemyError, RuntimeError):
        return JSONResponse(status_code=503, content={'status': 'unavailable', 'message': 'Database is unavailable.'})


@app.api_route('/api/{path:path}', methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
def unknown_api(path: str):
    return JSONResponse(status_code=404, content={'message': 'API endpoint not found.'})


frontend_dist = Path(__file__).resolve().parents[1] / 'frontend' / 'dist'
if frontend_dist.is_dir():
    app.mount('/', StaticFiles(directory=frontend_dist, html=True), name='frontend')
