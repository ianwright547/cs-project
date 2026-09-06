# THRESHOLD — Technology Choices

**Ian Wright**
Last updated: September 2026

> Paste this into a Google Doc with **Tools → Preferences → Enable Markdown** turned on, or the headers and tables come in as plain text.

---

## The constraint everything follows from

THRESHOLD is free. There is no revenue and no plan for revenue.

That gives us one rule that every decision below is downstream of:

> **Server cost must not grow with the number of users.**

Most of these choices look conservative in isolation. They make sense as a set once you know that's the rule.

---

## Summary

| Decision | Chose | Main alternative |
| --- | --- | --- |
| Architecture | One container serving both | Separate frontend and backend |
| Frontend | React + TypeScript, Vite | Next.js |
| Backend | Python + FastAPI | Node/Express, Django |
| Database | Postgres | MongoDB |
| Auth | Database sessions + cookie | JWT |
| Student code execution | The browser | Our server |
| Project grading | GitHub Actions | Our own CI |
| Course content | Files in the repo | A database or CMS |
| Hosting | AWS App Runner | EC2, Railway, Render |

---

# 1. One container, not two services

**We chose:** a single Docker container. FastAPI serves the API at `/api/*` and the built React files at `/*`.

**We also considered:** a separate frontend on Vercel with a separate API on AWS — the more common modern setup.

**Why:**

- **Login becomes simple.** Same origin means the session cookie just works. Split them across domains and you're handling CORS, cross-site cookie rules, and probably storing a token in the browser — which is both more work and less secure.
- **One deploy instead of two.** One pipeline, one set of secrets, one thing that can be broken.
- **A solo builder can hold it in their head.**

**What we gave up:** the frontend and backend can't scale independently, and the frontend isn't served from a CDN edge by default.

**When the other option wins:** if a mobile app shared the same API, if a separate team owned the frontend, or if the frontend needed global edge delivery. None of those are true here.

---

# 2. React + TypeScript with Vite, not Next.js

**We chose:** React with TypeScript, built by Vite.

**We also considered:** Next.js, Svelte, Vue, and plain HTML with no framework.

**Why:**

- **Most of what Next.js gives you is its server — and we already have one.** Adopting Next would mean running two servers, or abandoning FastAPI. Paying for a feature we can't use.
- **React has the ecosystem we need.** CodeMirror, the editor library the practice problems depend on, has first-class React support. Svelte and Vue are nice; the libraries aren't as reliably there.
- **TypeScript because we're teaching TypeScript.** The course's first season is TypeScript. Writing the platform in it means the codebase is reference material for the lessons.
- **Vite is fast.** Instant hot reload matters when you're building thirty screens in a week.

**What we gave up:** server-side rendering. The landing page isn't pre-rendered, which is mildly worse for search engines.

**When the other option wins:** if SEO on content pages were a primary channel, Next.js would be the right call. If we later need it, the landing page can be pre-rendered on its own without touching the rest of the app.

---

# 3. Python + FastAPI, not Node or Django

**We chose:** Python with FastAPI.

**We also considered:** Node with Express (would let us use TypeScript everywhere), Django, and Flask.

**Why:**

- **It's the stack the course teaches later.** Season 3 and beyond teach Python and FastAPI. Building the platform on it means our own codebase becomes the teaching material — we write lessons from things we actually hit rather than from a tutorial.
- **Pydantic validation.** Request and response shapes are declared as types and validated automatically. A whole category of bug never happens.
- **Async by default**, which matters because most of what our endpoints do is wait — for the database, or for GitHub.
- **Automatic API documentation**, free.

**What we gave up — honestly, two real things:**

- **One language across the stack.** Node would have meant TypeScript everywhere, with shared types between frontend and backend. That's a genuine advantage we chose not to take.
- **Django's built-in authentication.** Django ships with users, sessions, and an admin panel. We're building auth by hand instead. That's a day of work Django would have handed us.

**When the other option wins:** pick Node if a shared type system between frontend and backend matters more than anything else. Pick Django if you want auth and an admin panel on day one and don't care about async.

We took the cost knowingly, because the teaching-material argument outweighed a day of auth work.

---

# 4. Postgres, and only one database

**We chose:** Postgres. One database, not two.

**We also considered:** MongoDB, SQLite, MySQL.

**Why:**

The decision comes from two questions about the data:

- **Is it the same shape every time?** Yes. Every user has the same fields. Every progress record has the same fields.
- **Do the pieces connect to each other?** Yes. Users have progress, progress refers to steps, submissions belong to users.

Both yes means relational.

- **Constraints prevent bugs before they're written.** A unique index means a step can't be completed twice, no matter what the application code does wrong. That guarantee lives in the database, not in code we have to remember to write.
- **Transactions.** When something touches several tables, either all of it happens or none of it does.
- **Postgres over MySQL** for stronger types, better JSON support when we do want flexibility, and better tooling.

**What we gave up:** schema flexibility. Adding a field means writing a migration.

**When the other option wins:** MongoDB when records genuinely have different shapes — event logs, analytics, user-generated documents. SQLite for a single-user or embedded app with no concurrency.

**Why not add MongoDB alongside for the flexible bits:** because "some of our data is flexible" is not worth a second database to operate, back up, and reason about. Postgres has a JSON column when we need one.

---

# 5. Database sessions, not JWTs

**We chose:** a session row in Postgres, referenced by an HttpOnly cookie.

**We also considered:** JWTs stored in localStorage, and JWTs stored in a cookie.

**Why:**

- **We can revoke a session.** Delete the row and that person is signed out immediately. A JWT is valid until it expires, and there's nothing you can do about it in between.
- **Same origin means cookies are free.** One container, one domain, so an HttpOnly cookie works with no handling at all.
- **HttpOnly means JavaScript can't read it.** A script on the page — ours, or one that shouldn't be there — cannot steal the session. Anything in localStorage can be read by any JavaScript on the page.
- **No refresh token machinery.** JWT-based auth almost always grows a refresh token flow, and that's real complexity for a problem we don't have.

**What we gave up:** statelessness. Every request looks up a session row. That's one indexed read on a small table — around a millisecond — and we're nowhere near the scale where it matters.

**When the other option wins:** JWTs make sense when several separate services need to verify identity without sharing a database, or when the client is a mobile app where cookies are awkward. We have one service and a browser.

---

# 6. Student code runs in the browser, never on our server

**We chose:** compile and execute student code in the browser, inside a Web Worker, with a hard timeout.

**We also considered:** running it on our server in a container per submission, the way Judge0 and most coding platforms do.

**Why — this is the most important decision in the system:**

- **Server-side execution is a per-action cost.** It scales with usage, not signups. At any real number of students it's the largest line on the bill, and the product is free.
- **It would need sandboxing.** Running untrusted code safely is a serious security problem, and getting it wrong is catastrophic rather than annoying.
- **The browser is compute we already have, and it's free.**
- **Feedback comes back in under a second**, because there's no network round trip.

**What we gave up:**

- **We cannot trust the results.** A determined student can fake a pass. That's fine — nothing here is a credential, and the person being cheated is them.
- **We're limited to languages that run in a browser.** JavaScript, TypeScript, and Python via WebAssembly. No Java, no C++, no Go.

**When the other option wins:** any time the grade is worth something — a certification, a graded course, a hiring assessment. Then you have to control execution.

**This one decision is why the product can be free at any number of users.**

---

# 7. GitHub Actions grades the project

**We chose:** the student's season project is tested by GitHub Actions, running on their own repository. Our app reads the result through the GitHub API.

**We also considered:** running the tests ourselves.

**Why:**

- **It's free and effectively unlimited on public repositories.** GitHub runs our test suite on their machines, for every student, at no cost to us.
- **Same reasoning as the browser** — push the work somewhere it doesn't cost us anything.
- **It teaches them CI as a side effect.** They see a pipeline run on every push, which is a professional practice most self-taught developers never encounter.
- **The artifact is real.** A public repo with real commits, real CI, and a merged pull request is what they can show an employer. That's the entire point of the product.

**What we gave up:** a dependency on GitHub, its rate limits, and the requirement that student repositories be public.

**When the other option wins:** if students needed private repositories, or if a GitHub outage taking down grading were unacceptable.

---

# 8. Course content lives in files, not the database

**We chose:** lessons, practice problems, hints, story, and review comments are Markdown and JSON files in the repository, loaded into memory when the app starts.

**We also considered:** storing content in Postgres, or using a headless CMS.

**Why:**

- **Content is versioned with the code.** Every change to a lesson is a commit with an author and a reason.
- **Content changes go through pull requests**, so they get reviewed like code.
- **No database read per page view.** Content is in memory, shared by every user. Fixed cost regardless of traffic.
- **Adding a lesson, or a whole new season, needs no migration.** Add a file, deploy.

**What we gave up:** content can't be edited without a deploy, and a non-technical person can't edit it at all.

**When the other option wins:** when non-engineers need to edit content, or when it changes several times a day. Neither is true — the authors are the two of us, and a lesson changes once a month at most.

---

# 9. AWS App Runner for hosting

**We chose:** AWS App Runner for the app, RDS for Postgres.

**We also considered:** a bare EC2 instance, ECS Fargate, and the friendlier platforms — Railway, Render, Fly.io.

**Why:**

- **App Runner takes a container and runs it.** No cluster to define, no load balancer to configure, no task definitions. Managed HTTPS and scaling.
- **Compared to ECS**, it removes about a day of configuration we'd gain nothing from.
- **Compared to EC2**, we don't patch an operating system or manage a web server.

**Being honest about why AWS at all:** Railway or Render would have been *easier*. The reason is that AWS is what employers ask about, and it's what the course teaches in a later season. Learning it on a project we control is better than learning it under pressure.

That's a legitimate reason. It just isn't a technical one, and it's worth saying out loud rather than pretending App Runner beat Railway on merit.

**What we gave up:** some control, and slightly more cost at small scale than a bare EC2 box.

**When the other option wins:** Railway or Render if shipping speed is all that matters. EC2 if you need the absolute cheapest option and don't mind operating it. ECS or Kubernetes when you're running many services — we run one.

---

# 10. What we deliberately did not build

Every one of these solves a real problem. None of them are problems we have.

| Not using | Why not |
| --- | --- |
| **Any AI inside the product** | It's free. AI is a cost per user, forever. Every hint and review comment is written in advance, which is also more consistent — two students with the same mistake get the same explanation. |
| **Redis** | Sessions live in Postgres. Nothing is queried often enough to need a cache. Adding one means another service to run, monitor, and reason about. |
| **Queues and background workers** | Nothing in this product happens except in response to a click. There is no background work to do. |
| **A CDN** | The app is one container. If bandwidth ever becomes a real line on the bill, CloudFront can go in front of it in an afternoon. |
| **Kubernetes** | We run one container. |
| **A second database** | See section 4. |
| **A load balancer** | We have one server. |
| **A CMS** | See section 8. |

The pattern: **add infrastructure when something forces it, not in advance.** Every component you add is a thing that can break, needs monitoring, and has to be understood by whoever comes next.

---

# The system, in full

```
        Browser
           |
           |  compiles and runs student code here — free, and
           |  the reason this product can stay free at any scale
           v
   [ One Docker container on AWS App Runner ]
        FastAPI
        ├── /api/*  -> the endpoints
        └── /*      -> the built React files
           |
           v
      Postgres (AWS RDS)
        users, sessions, progress, submissions

   Also talks to:
      GitHub  -> runs the project tests on the student's own repo, free
```

Course content is not in this diagram, because it's files inside the container.

---

# The thirty-second version

> It's one Docker container on AWS running FastAPI, which serves both the API and a React frontend, backed by Postgres.
>
> The interesting constraint is that it's free with no revenue, so server cost can't scale with users. That drove the two decisions that matter: student code compiles and runs in the browser rather than on our server, and the project tests run on GitHub Actions in the student's own repository. Our server does almost nothing per user — it reads and writes small rows.
>
> Everything else follows from being one person deploying one thing: one container so login cookies work without CORS, database sessions instead of JWTs so they're revocable, and content in files instead of a database so adding a lesson doesn't need a migration.
