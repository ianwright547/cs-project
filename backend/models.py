"""User-owned state only: course content remains in files."""

import uuid
from datetime import datetime

from sqlalchemy import Boolean, CheckConstraint, DateTime, ForeignKey, Integer, String, UniqueConstraint, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column

from backend.database import Base


class User(Base):
    __tablename__ = 'users'
    __table_args__ = (
        CheckConstraint("onboarding_stage IN ('intro', 'signature', 'github', 'complete')", name='valid_onboarding_stage'),
        CheckConstraint("signed_name IS NULL OR length(trim(signed_name)) > 0", name='nonempty_signature'),
        CheckConstraint('(signed_name IS NULL) = (signed_at IS NULL)', name='signature_timestamp_pair'),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    display_name: Mapped[str] = mapped_column(String(200))
    email: Mapped[str | None] = mapped_column(String(320))
    signed_name: Mapped[str | None] = mapped_column(String(200))
    signed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    onboarding_stage: Mapped[str] = mapped_column(String(20), server_default='intro')
    github_skipped: Mapped[bool] = mapped_column(Boolean, server_default='false')
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class AuthIdentity(Base):
    __tablename__ = 'auth_identities'
    __table_args__ = (
        UniqueConstraint('provider', 'provider_subject', name='unique_provider_identity'),
        UniqueConstraint('user_id', 'provider', name='one_identity_per_provider'),
        CheckConstraint("provider IN ('google', 'github')", name='valid_provider'),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
    provider: Mapped[str] = mapped_column(String(20))
    provider_subject: Mapped[str] = mapped_column(String(255))
    github_username: Mapped[str | None] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class UserSession(Base):
    __tablename__ = 'sessions'

    # Store only a hash of a cryptographically random session token.
    token_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'), index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class NodeProgress(Base):
    __tablename__ = 'node_progress'
    __table_args__ = (
        CheckConstraint("status IN ('in_progress', 'done', 'skipped', 'passed_by_quiz')", name='valid_node_status'),
        CheckConstraint('last_position >= 0', name='nonnegative_position'),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    # Stable ID from content files; there is deliberately no course-content table.
    node_id: Mapped[str] = mapped_column(String(150), primary_key=True)
    status: Mapped[str] = mapped_column(String(20), server_default='in_progress')
    last_position: Mapped[int] = mapped_column(Integer, server_default='0')
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
