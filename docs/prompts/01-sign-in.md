# Build prompt: sign in

Paste this whole file into Codex. It covers the backend auth flow and the login page together, because a login page with nothing behind it isn't worth building.

---

## Context

I'm building THRESHOLD, a free course platform. This is the first real feature.

**Stack:**
- Backend: Python + FastAPI, SQLAlchemy 2.0 (async), Alembic, Postgres
- Frontend: React + TypeScript, built with Vite
- **One container.** FastAPI serves the API under `/api/*` and the built React files at `/*`. Same origin, no CORS.
- Runs locally with `docker compose up`. Deploys to AWS App Runner.

**Repo layout:**
```
frontend/    React + TypeScript
backend/     FastAPI
```

## Hard constraints

This product is free with no revenue. **Server cost must not scale with users.**

- **Sessions, not JWTs.** A session row in Postgres, referenced by an HttpOnly cookie.
- **No tokens in localStorage or sessionStorage.** Ever.
- **No AI, no Redis, no queues, no background workers.**
- **Every database query is scoped to the authenticated user.** No endpoint accepts a user id from the client.
- **Secrets come from environment variables only.**
- Request the minimum OAuth scopes and nothing more.

If something I've asked for conflicts with these, say so and propose an alternative instead of working around it silently.

---

## What to build

### 1. Database tables

SQLAlchemy models plus an Alembic migration.

**`users`**

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid, primary key | |
| email | text, unique, not null | |
| name | text, nullable | display name from the provider |
| github_username | text, nullable | set when they sign in with GitHub |
| github_skipped | boolean, default false | |
| signed_name | text, nullable | the offer letter signature — leave null for now |
| signed_at | timestamptz, nullable | |
| onboarding_stage | text, not null, default `'new'` | new, intro_done, signed, team_done, github_done, briefed, active |
| created_at | timestamptz, not null | |
| last_seen_at | timestamptz, not null | |

**`auth_identities`** — one row per provider per user, so a person can sign in with both

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid, primary key | |
| user_id | uuid, foreign key to users, not null | |
| provider | text, not null | `github` or `google` |
| provider_user_id | text, not null | |
| created_at | timestamptz, not null | |

Unique constraint on `(provider, provider_user_id)`.

**`sessions`**

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid, primary key | this value goes in the cookie |
| user_id | uuid, foreign key to users, not null | |
| created_at | timestamptz, not null | |
| expires_at | timestamptz, not null | 30 days out |
| last_used_at | timestamptz, not null | |

Index on `user_id`.

### 2. Backend routes

Use **Authlib** for the OAuth flow.

| Route | Does |
| --- | --- |
| `GET /api/auth/github/login` | Redirect to GitHub's authorize URL with a state parameter |
| `GET /api/auth/github/callback` | Handle the code, find or create the user, create a session, set the cookie, redirect into the app |
| `GET /api/auth/google/login` | Same, for Google |
| `GET /api/auth/google/callback` | Same, for Google |
| `POST /api/auth/logout` | Delete the session row, clear the cookie |
| `GET /api/me` | Return the signed-in user, or 401 |

**Scopes — exactly these, nothing more:**
- GitHub: `read:user`, `user:email`
- Google: `openid`, `email`, `profile`

**The cookie:**
- Name: `threshold_session`
- `HttpOnly`, `SameSite=Lax`, `Path=/`
- `Secure` in production, off in local development
- Max age 30 days

**Account linking:** if the email from the provider already exists in `users`, add a row to `auth_identities` pointing at that user. Do not create a duplicate account.

**After sign-in, redirect based on `onboarding_stage`:**
- `new` → `/intro`
- anything else → `/roadmap`

Neither route exists yet. Redirect to them anyway — I'm building them next.

**Also build a FastAPI dependency** — something like `get_current_user` — that reads the cookie, looks up the session, checks it hasn't expired, updates `last_used_at`, and returns the user. Every protected endpoint from here on uses it.

### 3. The login page

`frontend/src/routes/Login.tsx`, at `/login`.

**On the page:** the product name, one line of context, and two buttons — *Continue with GitHub* and *Continue with Google*. Nothing else. No email/password form, no "forgot password", no marketing.

Each button is a plain link to `/api/auth/github/login` or `/api/auth/google/login` — a real page navigation, not a fetch call. OAuth needs an actual redirect.

**States to handle:**
- Normal
- Redirecting, after a click
- **Error**, when the callback returns `?error=...` — plain-language message, easy retry. No error codes, no stack traces.

**Styling:** minimal, with every color and size in a CSS variable. My design system doesn't exist yet and I want this easy to restyle without touching the markup.

### 4. Environment variables

Read from `.env`, and add anything new to `.env.example` with a blank value:

```
DATABASE_URL
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
SESSION_SECRET
APP_URL
```

The app should fail loudly at startup if any are missing — not at 2am when someone tries to sign in.

---

## Things I specifically do not want

- JWTs anywhere
- Any token stored in the browser
- A password field
- A user id accepted from the client on any endpoint
- Extra OAuth scopes "in case we need them later"
- Any library not already in the stack above, unless you tell me why first

---

## When you're done, tell me

1. **What you built** — files created or changed
2. **What you assumed** — anything I left ambiguous that you decided for me
3. **What's wrong with my design** — anything above that turned out to be a bad idea once you built it

That third one matters most. Be direct about it.

---

## How I'll check it

- Sign in with GitHub. Sign out. Sign in with Google **using the same email.** One user row, two rows in `auth_identities`.
- Open developer tools → Application → Cookies. The session cookie is there, marked HttpOnly. Nothing in localStorage.
- Call `/api/me` while signed out. Get a 401, not a crash.
- Delete the session row from the database by hand. Refresh. I'm signed out.
