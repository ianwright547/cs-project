"""Container entry point for local Compose and AWS App Runner."""

import os
import subprocess

from sqlalchemy import text

from backend.database import get_engine


MIGRATION_LOCK_ID = 846_273_915


def run_migrations() -> None:
    """Serialize Alembic across instances so scale-up cannot race migrations."""
    with get_engine().connect() as connection:
        connection.execute(text("SELECT pg_advisory_lock(:lock_id)"), {"lock_id": MIGRATION_LOCK_ID})
        try:
            subprocess.run(["alembic", "upgrade", "head"], check=True)
        finally:
            connection.execute(text("SELECT pg_advisory_unlock(:lock_id)"), {"lock_id": MIGRATION_LOCK_ID})


def main() -> None:
    if os.environ.get("RUN_MIGRATIONS", "0") == "1":
        run_migrations()

    port = os.environ.get("PORT", "8000")
    os.execvp(
        "uvicorn",
        ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", port],
    )


if __name__ == "__main__":
    main()
