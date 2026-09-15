"""Database-backed session helpers for the Code Practice account surface."""

from datetime import datetime, timedelta, timezone
import hashlib
import secrets

from fastapi import Request, Response
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from backend.models import AuthIdentity, User, UserSession


# Keep existing sessions valid across the display-name change.
SESSION_COOKIE = "threshold_session"
SESSION_TTL = timedelta(days=30)


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def current_user(request: Request, db: Session) -> User | None:
    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        return None
    record = db.scalar(select(UserSession).where(UserSession.token_hash == _hash_token(token)))
    if not record:
        return None
    if record.expires_at <= datetime.now(timezone.utc):
        db.delete(record)
        db.commit()
        return None
    return db.get(User, record.user_id)


def user_payload(user: User, db: Session) -> dict:
    identities = db.scalars(select(AuthIdentity).where(AuthIdentity.user_id == user.id)).all()
    return {
        "id": str(user.id),
        "display_name": user.display_name,
        "email": user.email,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "identities": [
            {"provider": identity.provider, "github_username": identity.github_username}
            for identity in identities
        ],
    }


def start_session(db: Session, response: Response, user_id, *, secure: bool) -> None:
    token = secrets.token_urlsafe(32)
    db.add(UserSession(
        token_hash=_hash_token(token),
        user_id=user_id,
        expires_at=datetime.now(timezone.utc) + SESSION_TTL,
    ))
    db.commit()
    response.set_cookie(
        SESSION_COOKIE,
        token,
        max_age=int(SESSION_TTL.total_seconds()),
        httponly=True,
        secure=secure,
        samesite="lax",
        path="/",
    )


def end_session(request: Request, response: Response, db: Session) -> None:
    token = request.cookies.get(SESSION_COOKIE)
    if token:
        db.execute(delete(UserSession).where(UserSession.token_hash == _hash_token(token)))
        db.commit()
    response.delete_cookie(SESSION_COOKIE, path="/")
