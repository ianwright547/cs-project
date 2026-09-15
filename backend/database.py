"""PostgreSQL connections. Importing this module does not connect or alter tables."""

import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.orm import DeclarativeBase, Session

load_dotenv(Path(__file__).resolve().parents[1] / '.env')


class Base(DeclarativeBase):
    pass


def database_url():
    value = os.environ.get('DATABASE_URL')
    if not value:
        raise RuntimeError('Set DATABASE_URL before using the database.')
    url = make_url(value)
    if url.drivername not in ('postgresql', 'postgresql+psycopg'):
        raise RuntimeError('DATABASE_URL must use PostgreSQL.')
    return url.set(drivername='postgresql+psycopg')


@lru_cache
def get_engine():
    return create_engine(
        database_url(), pool_pre_ping=True, pool_size=5, max_overflow=5,
        pool_timeout=5, connect_args={'connect_timeout': 5},
    )


def get_db():
    """One session per request. Mutations explicitly commit their transaction."""
    with Session(get_engine()) as session:
        yield session
