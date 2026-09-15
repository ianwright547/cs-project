"""Run against migrated local PostgreSQL with TEST_DATABASE_URL explicitly set.

Every test rolls back its transaction; no sample accounts remain afterwards.
"""
import os
import uuid
from datetime import datetime, timedelta, timezone

import pytest
from sqlalchemy import create_engine, delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.models import AuthIdentity, NodeProgress, User, UserSession


@pytest.fixture
def db():
    url = os.environ.get('TEST_DATABASE_URL')
    if not url:
        pytest.skip('Set TEST_DATABASE_URL to a migrated local test database.')
    engine = create_engine(url)
    with engine.connect() as connection:
        transaction = connection.begin()
        with Session(connection, join_transaction_mode='create_savepoint') as session:
            yield session
        transaction.rollback()
    engine.dispose()


def new_user(db):
    user = User(display_name='Database test')
    db.add(user)
    db.flush()
    return user


def test_saved_progress_can_be_reloaded_and_is_scoped_by_user(db):
    first, second = new_user(db), new_user(db)
    first_id, second_id = first.id, second.id
    db.add_all([
        NodeProgress(user_id=first_id, node_id='git-intro', last_position=3),
        NodeProgress(user_id=second_id, node_id='git-intro', last_position=1),
    ])
    db.commit()
    db.expunge_all()
    assert db.get(NodeProgress, (first_id, 'git-intro')).last_position == 3
    assert db.get(NodeProgress, (second_id, 'git-intro')).last_position == 1


def test_one_provider_identity_cannot_belong_to_two_users(db):
    first, second = new_user(db), new_user(db)
    subject = str(uuid.uuid4())
    db.add(AuthIdentity(user_id=first.id, provider='google', provider_subject=subject))
    db.flush()
    with pytest.raises(IntegrityError), db.begin_nested():
        db.add(AuthIdentity(user_id=second.id, provider='google', provider_subject=subject))
        db.flush()


def test_user_can_have_google_and_github(db):
    user = new_user(db)
    for provider in ('google', 'github'):
        db.add(AuthIdentity(user_id=user.id, provider=provider, provider_subject=str(uuid.uuid4())))
    db.flush()
    assert len(db.scalars(select(AuthIdentity).where(AuthIdentity.user_id == user.id)).all()) == 2


@pytest.mark.parametrize('values', [
    {'status': 'invented'}, {'last_position': -1},
])
def test_invalid_progress_is_rejected(db, values):
    user = new_user(db)
    with pytest.raises(IntegrityError), db.begin_nested():
        db.add(NodeProgress(user_id=user.id, node_id='git-intro', **values))
        db.flush()


def test_duplicate_progress_is_rejected(db):
    user = new_user(db)
    db.add(NodeProgress(user_id=user.id, node_id='git-intro'))
    db.flush()
    with pytest.raises(IntegrityError), db.begin_nested():
        db.add(NodeProgress(user_id=user.id, node_id='git-intro'))
        db.flush()


def test_user_deletion_removes_owned_records(db):
    user_id = new_user(db).id
    db.add_all([
        AuthIdentity(user_id=user_id, provider='github', provider_subject=str(uuid.uuid4())),
        NodeProgress(user_id=user_id, node_id='git-intro'),
        UserSession(user_id=user_id, token_hash=uuid.uuid4().hex * 2,
                    expires_at=datetime.now(timezone.utc) + timedelta(days=1)),
    ])
    db.flush()
    db.execute(delete(User).where(User.id == user_id))
    for model in (AuthIdentity, NodeProgress, UserSession):
        assert db.scalar(select(model).where(model.user_id == user_id)) is None
