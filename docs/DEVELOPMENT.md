# React and PostgreSQL development

## What this change implements

The dashboard is a React/TypeScript application. Existing appearance and project expansion behavior are preserved. Repeated course cards and progress rings are reusable components with typed props.

The backend now has SQLAlchemy models, a PostgreSQL connection/session helper, an Alembic migration, and a database readiness endpoint. Local Docker Compose runs PostgreSQL, applies migrations, and serves the compiled React frontend from FastAPI.

This is the foundation, not a complete account system: the OAuth experiment is not integrated, sessions are not issued yet, and there are no user/progress API routes. The dashboard now shows actual Git/GitHub curriculum counts. No public endpoint creates or exposes users. Practice, quiz, and project-submission tables should be added when those features are implemented.

## Run everything

Install/start Docker Desktop, then from the repository root:

```bash
docker compose up --build -d
```

Open http://localhost:8000. The former http://localhost:8000/dashboard.html URL also works.

- `GET /health`: application liveness; does not require PostgreSQL.
- `GET /api/health/ready`: database connection readiness; returns 503 if unavailable. This is a connectivity check, not a schema-version check.
- PostgreSQL: localhost:5433, database/user/password `threshold` (local development only).
- Database data lives in a named Docker volume and survives container restarts.
- The migration service must succeed before the app starts.
- Compose uses explicit local database settings and does not load OAuth secrets from `.env`.

```bash
docker compose ps
docker compose logs app
docker compose stop
```

Stopping containers preserves data. `docker compose down -v` deletes the database volume: do not use it unless deliberately resetting local data.

## Develop with hot reload

Start PostgreSQL and apply migrations:

```bash
docker compose up -d db
docker compose run --rm migrate
```

Run the API in one terminal (stop the Compose app first if port 8000 is occupied):

```bash
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements-dev.txt
export DATABASE_URL=postgresql+psycopg://threshold:threshold@localhost:5433/threshold
.venv/bin/uvicorn backend.main:app --reload
```

Run the frontend in another:

```bash
cd frontend
npm ci
npm run dev
```

Open http://localhost:5173. Vite proxies API requests to FastAPI. Use a supported modern Node release; the Docker build uses Node 24.

The existing `.env` was preserved. If using it for local Python development, update only its `DATABASE_URL` to the port above, or use the explicit environment export. Environment variables take precedence over `.env`.

## Why React helps

HTML is still what the browser renders. React changes how the UI is authored and updated:

- **Components** are reusable pieces of UI: `CourseCard`, `ProgressRing`, `Navigation`.
- **Props** are inputs. `CourseCard` receives a typed course object, so one implementation renders Git, GitHub, and TypeScript.
- **State** is changing UI data. Later, loading saved progress into state will update the screen without manually selecting and rewriting DOM elements.
- **TypeScript** checks contracts while developing. A course status is `done`, `active`, or `locked`; misspelling it produces a type error.
- **Vite** provides the development server and bundles the application for production.

React adds a build step and client-side JavaScript. It does not create a backend, save data, provide authentication, or make a page automatically faster. Learn components, JSX, props, state, event handlers, effects for external synchronization, and async API requests in that order.

## The data flow to build next

```text
React UI -> authenticated FastAPI route -> SQLAlchemy -> PostgreSQL
React UI <- JSON response              <- Python data <- saved rows
```

The browser must never receive `DATABASE_URL` or database credentials. The backend derives `user_id` from the authenticated session, never a client-supplied user ID. The schema alone does not enforce application-level access isolation: upcoming API routes must scope every user-data query.

## Understand the four tables

| Table | One row represents | Key |
| --- | --- | --- |
| `users` | An account, including onboarding and signature | UUID `id` |
| `auth_identities` | A Google or GitHub identity linked to an account | UUID `id`; unique provider + provider subject |
| `sessions` | One future login session | SHA-256 token hash |
| `node_progress` | A user's saved state for a particular content node | Combined `user_id` + `node_id` |

Email is optional and is not an identity key. A Google provider subject or GitHub numeric account ID is the stable identity; an email address or GitHub username can change. Account linking should require an authenticated explicit flow, not a matching email alone.

Course and lesson definitions stay in files under `content/`. Node IDs must remain stable; they connect authored content to saved progress. Locked/available states should be computed from the course rules, not stored as permanent progress.

## Database concepts to learn

1. **Tables, rows, columns:** structured collections, individual records, and their fields.
2. **Primary keys:** identify a row uniquely. Here a user uses a UUID; progress uses two columns together.
3. **Foreign keys:** connect rows. `node_progress.user_id` must reference an existing user. Deleting that user cascades to their owned state.
4. **Constraints:** database-level protection against invalid records. Duplicate login identities, negative slide positions, and unknown progress statuses are rejected.
5. **SQL basics:** `SELECT` reads, `INSERT` adds, `UPDATE` changes, `DELETE` removes. `WHERE` limits which rows are affected; `JOIN` combines related tables.
6. **Transactions:** related changes succeed together or roll back together. Completing a quiz and updating course progress should be one transaction.
7. **Indexes:** speed up lookups, with a storage/write cost. Primary and unique keys already provide indexes; session lookups also index `user_id` and expiry.
8. **Migrations:** version-controlled schema changes. Editing a Python model does not alter existing database tables.
9. **Persistence and backups:** container restarts preserve the volume; a volume is not a backup. Production needs separate credentials and a tested backup/restore process.

## Inspect local SQL

```bash
docker compose exec db psql -U threshold -d threshold
```

Inside psql:

```sql
\dt
\d users
\d node_progress
SELECT id, display_name, onboarding_stage FROM users;
SELECT node_id, status, last_position
FROM node_progress
WHERE user_id = 'replace-with-an-actual-user-uuid';
\q
```

Tables are initially empty. This is expected until account creation is connected. The example query's UUID must be replaced before running it. In application code, use SQLAlchemy bound values, never concatenate user input into SQL strings.

## Change the schema

Set `DATABASE_URL` to the local database, then:

```bash
.venv/bin/alembic current
# Edit backend/models.py, then generate and REVIEW the migration:
.venv/bin/alembic revision --autogenerate -m "Describe the schema change"
.venv/bin/alembic upgrade head
.venv/bin/alembic check
```

Commit both the model change and migration file. Review generated migrations before applying them; destructive changes can lose data. Run migrations as a deployment step before starting a new production version, rather than on every request.

## Verification

```bash
cd frontend
npm run build
```

From the repository root, after applying the initial migration:

```bash
.venv/bin/pip install -r backend/requirements-dev.txt
TEST_DATABASE_URL=postgresql+psycopg://threshold:threshold@localhost:5433/threshold .venv/bin/python -m pytest backend/tests -q
docker compose exec app alembic check
```

Database tests roll back their data. Without `TEST_DATABASE_URL`, integration tests skip explicitly. Tests cover saved progress, distinct users' records, duplicate identities/progress, invalid values, cascading deletion, and safe readiness errors. They do not test authentication or authorization, which is not implemented yet.

## Next feature

Integrate Google/GitHub OAuth into FastAPI using `auth_identities`, issue expiring sessions, add `/api/me`, and implement user-scoped onboarding/progress routes. Then connect saved user progress to the course dashboard.

The existing mismatch between staged project unlocking in the dashboard and all-courses-first unlocking in the PRD is preserved for a later product decision; this conversion does not implement progression rules.

## Git and GitHub curriculum

`git-github-curriculum.md` is the single source for course content. The backend parses it once at startup, and the Docker image includes it. Restart the backend after editing it; rebuild the image when running Compose.

- `/course.html?course=git`: 12 units, 77 activities.
- `/course.html?course=github`: 9 units, 33 activities.
- Activity anchors preserve the source IDs, for example `#gp057` and `#q08`.
- All 49 mini lessons are attached to their practices; they do not inflate the activity count.
- Hints, solutions, and feedback are expandable. Quiz answers/explanations are omitted from the initial curriculum response and returned after submitting answers to the server.
- The 12 short quizzes use the authored suggested 2/3 threshold and unlimited retries. Passing results update local course completion; they do not write database progress.
- All 98 practical tasks and checkpoints have prepared browser workspaces and deterministic grading. The terminal covers the shell and Git operations used in the curriculum, keeps the Git index separate from the working tree, and persists workspace state locally. GitHub interface activities use `RESPONSE.md` as reviewable evidence.
- Passing practical grades and completion counts persist in local storage. Syncing that progress to a user account remains part of the authentication/progress API work.
- Only Git and GitHub courses are included. Source examples that mention application filenames or npm remain unchanged because they teach Git/GitHub workflows, not a JavaScript/TypeScript course.
- The dashboard now lists real activity counts and links; previous fictional completion percentages are removed.

Content-only endpoints are `/api/curriculum` and `POST /api/curriculum/{course_id}/quizzes/{quiz_id}/check`. They never read or write user records. Account authentication/progress APIs remain separate future work.

Verify content order, counts, source preservation, links, and quiz scoring with:

```bash
.venv/bin/python -m pytest backend/tests/test_curriculum.py -q
```
