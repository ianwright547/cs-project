# CS Course

A free course that teaches people to code by giving them a job.

Students are hired as a junior engineer at THRESHOLD — the company that runs the surface sensor network and tells the bunkers when it's safe to go outside. They take short lessons, solve practice problems in the browser, then build a real command-line tool on their own machine and open a real pull request on their own GitHub.

Season 1 teaches Git, GitHub, and TypeScript. It ends with the student owning a working tool that reads live public environmental sensor data.

---

## Who owns what

| Person | Owns |
| --- | --- |
| **Ian** | System design, backend, all screens, design system, infrastructure, story |
| **Kyle** | The data engine — pipeline, cleaning, scoring logic, sample files, all test suites |

**Neither person opens a file in the other's folders.** That's what keeps merge conflicts from happening.

## Layout

```
frontend/     Ian    — React + TypeScript (Vite)
backend/      Ian    — Python + FastAPI
content/      Ian    — lessons, practice problems, story (files, not database)
data/         Kyle   — the data engine
  pipeline/            Python scripts that pull and clean real sensor data
  samples/             clean and deliberately broken sample files
  tests/               test suites for practice problems and the season project
docs/         both   — design decisions and notes
```

## Stack

| Layer | Choice |
| --- | --- |
| Frontend | React + TypeScript, built with Vite |
| Backend | Python + FastAPI |
| Database | Postgres |
| Runs on | One Docker container, AWS App Runner |
| Database hosting | AWS RDS |
| Student code | Runs in the browser. Never on our server. |
| Project grading | GitHub Actions, on the student's own repo |

```
        Browser
           |  (runs student code here — free)
           v
   [ One container on AWS App Runner ]
        FastAPI
        ├── /api/*  -> the endpoints
        └── /*      -> the website files
           |
           v
      Postgres (AWS RDS)

   Also talks to: GitHub (runs the tests, free)
```

## Working on this

**Every morning, before anything:**
```bash
git pull origin main
```

**Then work on your own branch:**
```bash
git checkout -b ian/roadmap-screen
```

Name it `yourname/what-youre-doing`. Push it, open a pull request, get it merged the same day.

### Rules

1. `main` always works. If it's broken, fixing it is the only priority.
2. Pull before you start. Every time.
3. Small pull requests, merged daily. A branch that lives a week will hurt.
4. Never commit secrets. `.env` is already in `.gitignore`.
5. Never force push to `main`.

### If you hit a merge conflict

Message the other person before you resolve it. Ten seconds of "we both changed this — which one?" beats finding it broken two days later.

## Setup

**Ian** — needs Node, Docker, and Python.
**Kyle** — needs Python only. He never runs the app; he uses the live URL.

## Docs

- `docs/PRD.md` — what we're building and why
- `docs/SYSTEM-DESIGN.md` — architecture decisions
- `docs/decisions/` — one file per significant decision
- `CONSTRAINTS.md` — architectural rules, paste at the top of every AI session
