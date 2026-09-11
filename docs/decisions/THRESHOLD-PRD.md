# THRESHOLD — Product Definition

Author: Ian Wright
Created: 09/04/2026
Last updated: 09/11/2026

---

# 1. Product Summary

THRESHOLD is a free platform that teaches people to code through short lessons and practice problems, and then has them build one real project in their own GitHub repository. Season 1 covers Git, GitHub, and TypeScript.

---

# 2. What This Is

**It is a course.** The teaching is the product. Lessons come first, practice problems reinforce them immediately, a short quiz confirms it stuck.

**The story is a frame, not the content.** There is an intro when you sign up and a short animation when you finish the season. That's it. No characters interrupting lessons, no messages from coworkers, no in-fiction code review. The premise — a company in 2091 that tells underground bunkers when it's safe to go outside — gives the project a reason to exist and gets out of the way.

**The project is the proof.** After the courses, you build a real command-line tool in your own editor, in your own public repository. Tests run on GitHub Actions and the results come back inside the app.

---

# 3. Structure

## What a node is

**A node is one item on a course path.** One thing you open, do, and finish. It is the smallest unit of progress in the entire product.

Every node has:

- an **id** (stable, from the content files)
- a **type** (what kind of thing it is)
- an **order** (where it sits on the path)
- a **title** and a one-line summary
- a **status** for each user (locked, active, in progress, done, skipped)

There are only four node types:

| Type | What it is | Can it be skipped? |
| --- | --- | --- |
| `story` | A sequence of text frames. Exactly two in Season 1 — the intro and the ending. | Yes |
| `lesson` | A sequence of slides — text, code samples, images. | Yes |
| `practice` | A coding problem, auto-graded in the browser. | No |
| `quiz` | A short multiple-choice check at the end of a course. | No |

Anything that is not one of these four is not a node. The project is not a node — it lives in its own tab and is described in section 5.

## How nodes group

```
SEASON 1
│
├── COURSE 1 — Git
│     ├── node: lesson
│     ├── node: practice
│     ├── node: lesson
│     ├── node: practice
│     └── node: quiz          ← finishing this completes the course
│
├── COURSE 2 — GitHub
│     └── (same shape)
│
├── COURSE 3 — TypeScript
│     └── (same shape)
│
└── PROJECT                    ← unlocks when all three courses are done
```

A lesson and the practice problems that follow it are one idea, not two. You finish the slides and the problems that drill exactly what those slides covered are right there.

## Locking rules

**Inside a course, the path is linear.** A node unlocks when the node before it reaches `done` or `skipped`. This applies to story nodes too — the intro must be completed or skipped before anything after it opens.

**Courses unlock in order.** Git, then GitHub, then TypeScript. You cannot open Course 2 before Course 1 is complete.

**The quiz is the exception.** A course's quiz can be attempted at any time, including before doing any of that course's lessons. Pass it and the whole course is marked complete and the next one opens. Fail it and you're shown which lessons cover what you missed.

That is the entire skip mechanism. Someone who already knows Git can pass the Git quiz in ten minutes and move on. Someone who doesn't will fail it and get pointed back at the lessons. There is no placement test, no difficulty setting, and no second mode — the path stays one line for everybody.

**The project cannot be skipped.** Building it is the point.

---

# 4. Navigation

After sign-in, everything lives under a persistent top navigation bar.

```
THRESHOLD     Dashboard    Courses    Project          ▓▓▓▓▓░░░ 62%     [you]
```

| Item | What it shows |
| --- | --- |
| **Dashboard** | The default landing. All three courses as cards with their own progress bars, and one primary button: continue where you left off. |
| **Courses** | Every course, expandable to show every node inside it, with status. Anything already completed can be reopened and re-read. |
| **Project** | The season project — what to build, the acceptance criteria, the repo link, and the current check status. Locked until the courses are done, with a plain explanation of what unlocks it. |
| **Progress bar** | Season-level completion, always visible. |

The dashboard exists so nobody has to decide what to do next. One button, one active node. The Courses and Project tabs exist for people who want to look around, see what's coming, or jump back to something they already finished.

---

# 5. The Project

One project per season. In Season 1 it is a TypeScript command-line tool that reads real public environmental sensor data and reports whether conditions are safe.

**How it works:**

1. The Project tab unlocks when all three courses are complete.
2. The user clones a starter repository template — structure, config, a README written as a handoff, the real test suite, and a GitHub Actions workflow.
3. They write the code in their own editor, on their own machine, and push.
4. GitHub Actions runs the tests on their push.
5. The app reads the check result through the GitHub API and shows each acceptance criterion as pass or fail.
6. Failing tests map to pre-written explanations of what went wrong and why it matters.
7. They fix, push again, and when everything is green they open a pull request and merge it.

**The acceptance criteria shown in the app must be worded identically to what the tests check.** No surprises.

The repository lives on the user's account permanently. THRESHOLD never writes to it.

---

# 6. The Problem

## What happens today

Someone decides to learn to code. They start a course. They watch videos and type what the instructor types. They finish, knowing syntax, with no idea how to build a real project. They have a folder of tutorial projects identical to everyone else's and an empty GitHub profile. They can't answer "tell me about something you built." They conclude they aren't ready and start another course.

## Why it fails

- Following along feels identical to building while you're doing it. It isn't.
- Nothing they make is theirs.
- Courses teach syntax, not the job — no version control, no code review, no CI, no ambiguity.
- The output is a certificate, which no employer values.
- Motivation dies around week three and nothing pulls them back.

## Why it's worth solving

They learn what companies actually pay for. Reading requirements, pushing code, getting it checked, and fixing it *is* the job. And it's free, so the people who need it most can use it.

---

# 7. Target User

Someone who has been learning to code, knows some syntax, and has no idea how to build a real project.

| Type | Where they are | What they need |
| --- | --- | --- |
| Knows one language a bit | Can write basic code | Small steps, no setup cliff, constant sense of progress |
| Self-taught plateau | Can write functions, can't ship | Real concepts — structure, version control, tests |
| CS student | Knows theory and LeetCode | Has never used Git properly or built anything real |

**The default is the person doing it start to finish.** The product is built for them first. The quiz-to-skip path serves people who already know a course's material without adding a separate track.

**What they want to be able to say:** *"I understand more than syntax. I know how a project comes together."*

**What they don't want to do:** decide what to learn next, hunt for YouTube videos, or guess what "good enough" means.

The product should not assume prior knowledge, but it can start past the absolute basics someone would get in a first programming class.

---

# 8. Goals

## Primary

Someone finishes Season 1 genuinely competent in Git, GitHub, and TypeScript at a junior level, with a working tool in their own public repository.

## Supporting

- The user always knows exactly what to do next.
- Practice feedback returns in under one second.
- The user experiences a real pull request and real CI.
- Someone who already knows a course can prove it and move on in ten minutes.
- Cost per user stays effectively zero.

---

# 9. Non-Goals

- No AI or chatbot anywhere in the product
- No server-side execution of user code
- No in-browser IDE for the project
- No payments, subscriptions, or paywall
- No comments, forums, or social features
- No streaks, points, badges, or leaderboards
- No seasons past Season 1
- No CMS
- English only

**Why:** the product is free with no revenue, so anything that scales in cost per user is out. Anything not required to get someone from the landing page to a merged pull request is out.

---

# 10. MVP Scope

## The complete workflow

```
Landing page
   ↓
Sign in with GitHub or Google
   ↓
Intro — the war, the bunkers, THRESHOLD        ← story node 1
   ↓
Sign the offer letter with your own name
   ↓
Connect GitHub
   ↓
DASHBOARD — three courses, Course 1 active
   ↓
Course 1: Git
   lesson → practice → lesson → practice → quiz
   ↓
Course 2: GitHub
   lesson → practice → lesson → practice → quiz
   ↓
Course 3: TypeScript
   lesson → practice → lesson → practice → quiz
   ↓
PROJECT TAB UNLOCKS
   ↓
Clone starter repo, write code locally, push
   ↓
GitHub Actions runs the tests
   ↓
See criteria pass/fail in the app, fix what's broken
   ↓
Open a pull request, merge it
   ↓
Ending animation                                ← story node 2
   ↓
Summary — repo link, what you built, what you learned
```

## Required capabilities

### Accounts and onboarding
- Sign in with GitHub
- Sign in with Google
- Store the signed name and timestamp
- Connect a GitHub account and store the username
- Allow skipping the GitHub connection, with a persistent reminder
- Route first-time users to onboarding, returning users to the dashboard

### Navigation
- Persistent top nav: Dashboard, Courses, Project
- Season progress bar, always visible
- Dashboard with per-course progress and one continue button
- Courses view listing every node and its status
- Project tab, locked with a clear explanation until courses are complete

### Courses and nodes
- Load the course and node structure from content files
- Compute and display node status: locked, active, in progress, done, skipped
- Persist progress to the database
- Auto-scroll to the active node
- Present exactly one primary action at all times
- Reopen any completed node

### Lessons
- Render slides from a content file
- Back, next, position indicator
- Resume at the last slide viewed
- "I know this" — skip and mark skipped
- On complete, go straight into that lesson's practice problems

### Practice problems
- Render prompt, worked example, starter code
- Editor with TypeScript syntax highlighting
- Compile and run TypeScript in a Web Worker
- Hard 2-second timeout so an infinite loop can't hang the tab
- Run hidden tests, report expected vs actual per case
- Four-level hint ladder, always available, never penalized
- Autosave editor contents to local storage on every keystroke
- Unlimited attempts

### Quizzes
- Multiple-choice questions with an explanation after answering
- Auto-graded against a stated pass threshold
- Attemptable at any time within its course, including with zero lessons done
- On pass: course marked complete, next course unlocks
- On fail: show what was missed and link to the lessons covering it
- Unlimited retakes, no cooldown, no penalty

### Project
- Acceptance criteria worded identically to the tests
- Link to the starter repository template
- Accept a repository URL from the user
- Read the GitHub Actions check result through the GitHub API
- Show each criterion as pass or fail
- Map failing tests to pre-written explanations
- Accept a pull request URL as the submission
- Support the fix → push → recheck loop

### Season completion
- Ending animation, shown before the summary
- Summary of what was built with repository link
- Season 2 shown as locked

---

# 11. Information Flow

## Sign in
**Action:** User signs in with GitHub or Google.
**Input:** OAuth response — email, name, provider ID, GitHub username where applicable.
**Output:** User record, empty progress record, session. First-timers route to the intro; returning users to the dashboard.
**Failures:** OAuth denied, provider outage, callback URL mismatch, email already registered with the other provider.
**Data:** User and progress are permanent. Session is temporary.

## Intro (story node)
**Action:** Full-screen text frames establish the war, the bunkers, and what THRESHOLD does.
**Output:** Node marked `done` or `skipped`.
**Failures:** User closes the tab mid-sequence — must resume, not restart onboarding.
**Rules:** Skippable from the first frame. Never shown again once finished. Must be done or skipped before onboarding continues.

## Offer letter
**Action:** The user reads a short employment offer and signs it by typing their own name.
**Output:** `signed_name`, `signed_at`.
**Failures:** Empty or whitespace-only signature (button stays disabled), refresh mid-signature.
**Note:** The letter contains a confidentiality clause about surface data in ordinary legal language. It has no function in Season 1.

## Connect GitHub
**Action:** User connects GitHub, with a plain explanation of why.
**Output:** `github_username`, or `github_skipped`.
**Failures:** OAuth denied, insufficient scopes, user signed in with Google and declines a second provider.
**Note:** If skipped, a quiet reminder sits on the dashboard, and the Project tab blocks with an explanation and a connect button — not an error.

## Dashboard
**Action:** User sees three course cards with progress, and one continue button.
**Input:** Course and node structure from content files, merged with the user's node states.
**Output:** Rendered cards, computed active node, season progress percentage.
**Failures:** Content file missing or malformed, progress referencing a node that no longer exists, two tabs writing conflicting progress.

## Lesson node
**Action:** User reads slides, then lands directly on that lesson's practice problems.
**Input:** Lesson content file.
**Output:** Completion, and last slide position for resuming.
**Failures:** Content file missing, image fails to load, user leaves mid-lesson.

## Practice node
**Action:** User writes code, runs it, and checks it against hidden tests.
**Input:** Problem file — prompt, worked example, starter code, hidden tests, four hints. Plus current editor contents.
**Output:** Per-case results with expected vs actual, attempt count, highest hint revealed, final code.
**Failures:** Code doesn't compile; infinite loop (killed by timeout, not by closing the tab); Web Worker fails to start; code throws before output; browser lacks Web Worker support; work lost on refresh (must never happen — autosave).
**Rules:** Unlimited attempts, no penalty. Hints always available; revealing the solution still counts as solved. Never show a bare "incorrect" — always the failing case, expected, and actual.

## Quiz node
**Action:** User takes the course's auto-graded check.
**Input:** Quiz file — questions, answers, explanations, pass threshold, and a map from each question to the lesson that covers it.
**Output:** Score, pass/fail, per-question result, attempt count. On pass: every unfinished node in that course marked `passed_by_quiz`, next course unlocked.
**Failures:** User leaves mid-quiz (attempt discarded, not scored).
**Rules:** Attemptable at any time within its course. Unlimited retakes, no cooldown. On failure, show exactly which lessons to go read.

## Project
**Action:** User clones the starter repo, writes the tool on their own machine, and pushes.
**Input:** Starter repository template — structure, config, README, real test suite, GitHub Actions workflow.
**Output:** A repo on the user's account, commits, an Actions run, a check result.
**Failures:** Can't install Node or Git (help content must cover this in plain language); repo is private so the check can't be read; empty repo or no commits; Actions hasn't finished; workflow fails for infrastructure reasons rather than a test failure; GitHub API rate limit.
**Data:** The repository lives on the user's account permanently.

## Check results
**Action:** Failing tests are shown against the acceptance criteria.
**Input:** The Actions check result mapped to pre-written explanations.
**Output:** Criteria with pass/fail, explanations attached to failures, and either a needs-work or a complete state.
**Failures:** A failing test with no mapped explanation (fall back to a generic but still useful message), check result unavailable, user resubmits the same failing commit.
**Rules:** Fully deterministic — every explanation is pre-written, no AI. Direct about the code, never dismissive of the person, always says why it matters.

## Season complete
**Action:** Ending animation, then the summary.
**Output:** Season 1 complete, Season 2 shown as locked.
**Rule:** Animation before summary.

## Storage summary

**Temporary:** session tokens, editor contents before a passing submission (local storage), scroll position, Web Worker execution context, in-flight results, an abandoned quiz attempt.

**Permanent:** user record and provider identity, signed name and timestamp, GitHub username or skip flag, node states and completion times, practice attempt counts and hint levels, final submitted practice code, quiz scores and attempts, repo URL, PR URL, check status, season completion.

---

# 12. Automatic vs User-Controlled

## The system does automatically
- Unlock the next node when the current one finishes
- Unlock the next course when a quiz passes
- Unlock the Project tab when all courses are complete
- Save progress on every state change
- Autosave editor contents
- Poll GitHub for a check result after a push
- Map failing tests to explanations
- Resume the user where they left off

## The user always controls
- Whether to read or skip the intro and ending
- Whether to do the lessons or go straight at the quiz
- When to run their code
- When to open a pull request
- Whether to reveal a hint, and how far
- Whether to connect GitHub

## The system must never
- Mark something complete that the user did not complete or test out of
- Lose unsaved editor contents
- Block the user because of a story element
- Write to the user's GitHub repository
- Show a score, rank, or comparison to another user
- Let the project be skipped

---

# 13. Core Data Objects

## User

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | Unique ID | Yes | Identifier |
| email | Text | Yes | From OAuth |
| name | Text | No | Display name |
| provider | Enum | Yes | `github` or `google` |
| provider_id | Text | Yes | Provider's user ID |
| github_username | Text | No | Set on connect |
| github_skipped | Boolean | Yes | Declined to connect |
| signed_name | Text | No | Typed on the offer letter |
| signed_at | Datetime | No | When signed |
| onboarding_stage | Enum | Yes | `new`, `intro_done`, `signed`, `github_done`, `active` |
| created_at | Datetime | Yes | Account creation |
| last_seen_at | Datetime | Yes | Last activity |

## Progress

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | Unique ID | Yes | Identifier |
| user_id | Unique ID | Yes | Owning user |
| season | Number | Yes | 1 for MVP |
| current_course_id | Text | Yes | The active course |
| current_node_id | Text | Yes | The active node |
| completed_count | Number | Yes | Nodes completed this season |
| started_at | Datetime | Yes | Season start |
| completed_at | Datetime | No | Season completion |
| updated_at | Datetime | Yes | Last change |

## Node State

One row per node the user has reached.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | Unique ID | Yes | Identifier |
| user_id | Unique ID | Yes | Owning user |
| node_id | Text | Yes | From content files |
| course_id | Text | Yes | Owning course |
| node_type | Enum | Yes | `story`, `lesson`, `practice`, `quiz` |
| status | Enum | Yes | `locked`, `active`, `in_progress`, `done`, `skipped`, `passed_by_quiz` |
| attempts | Number | No | Practice or quiz attempts |
| hint_level | Number | No | Highest hint revealed (0–4) |
| score | Number | No | Quiz score |
| submitted_code | Text | No | Final practice code |
| slide_position | Number | No | Lesson resume point |
| completed_at | Datetime | No | Completion time |
| updated_at | Datetime | Yes | Last change |

## Submission

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | Unique ID | Yes | Identifier |
| user_id | Unique ID | Yes | Owning user |
| season | Number | Yes | Season number |
| repo_url | Text | Yes | The user's repository |
| pr_url | Text | No | The pull request |
| commit_sha | Text | No | Commit the checks ran against |
| check_status | Enum | Yes | See section 15 |
| failed_tests | List | No | Names of failing tests |
| attempt_number | Number | Yes | How many times submitted |
| created_at | Datetime | Yes | Submission time |
| updated_at | Datetime | Yes | Last status change |

## Content objects (files, not database rows)

Versioned with the code, loaded into memory at startup, never written at runtime.

| Object | Contains |
| --- | --- |
| Course | id, order, title, the ordered list of node ids inside it |
| Node | id, order, type, title, one-line summary, content file reference |
| Story | ordered frames of text |
| Lesson | slides — text, code samples, images |
| Practice problem | prompt, worked example, starter code, hidden tests, four hints |
| Quiz | questions, answers, explanations, pass threshold, question → lesson map |
| Project | acceptance criteria, starter repo link, help content |
| Check explanation | the test name it maps to, the explanation text |

---

# 14. Relationships

- A user has one progress record per season.
- A user has one node state per node, and one submission record per project attempt; the most recent submission is authoritative and older ones are kept, never deleted.
- Every node belongs to exactly one course.
- Every course has exactly one quiz, and it is the last node in that course.
- A node unlocks only when the node before it reaches `done`, `skipped`, or `passed_by_quiz`.
- A course unlocks only when the previous course is complete.
- Passing a quiz sets every unfinished node in that course to `passed_by_quiz`.
- The project unlocks only when all three courses are complete.

**Open:** can one user sign in with GitHub and Google and have them merge into one account?

---

# 15. States and Transitions

## Node states

| From | To | Trigger | Must prevent |
| --- | --- | --- | --- |
| locked | active | Previous node done, skipped, or passed by quiz | Unlocking out of order |
| active | in_progress | User opens it | — |
| in_progress | done | Completion requirement met | Completing without meeting it |
| in_progress | skipped | User skips a story or lesson node | Skipping a practice or quiz node |
| locked / active / in_progress | passed_by_quiz | That course's quiz passed | Applying this to a node in another course |
| done | — | — | Un-completing |
| skipped or passed_by_quiz | in_progress | User reopens it | — |

## Submission states

`not_started → repo_connected → queued → running → passed | failed`
`failed → queued` (user pushes a fix)
`passed → submitted → needs_work | complete`
`needs_work → queued`
any state `→ unavailable` when the GitHub API can't be reached

## Invalid transitions the system must prevent

- Locked directly to done
- A practice or quiz node being skipped
- A quiz being attempted before the previous course is complete
- The Project tab opening before all three courses are complete
- A submission reaching complete with any check failing
- Reaching the project without a connected GitHub account
- Season 1 marked complete with the project incomplete

---

# 16. Application Actions

## Auth
- `POST /api/auth/{provider}` — sign in. Creates user and progress on first sign-in. Routes by `onboarding_stage`.
- Sign out — clears the session only.
- Connect GitHub — stores `github_username`. Requires a session.
- Skip GitHub — sets `github_skipped`. Reversible at any time.

## Onboarding
- `POST /api/onboarding/sign` — body `{ "signed_name": "..." }`. Rejects empty or whitespace-only. Idempotent; signing twice does not overwrite the original timestamp.
- `POST /api/onboarding/stage` — body `{ "stage": "..." }`. Rejects moving backward.

## Courses and nodes
- `GET /api/courses` — all courses and nodes merged with the user's node states, plus the computed active node and season progress.
- `POST /api/nodes/{node_id}/complete` — rejects if locked. Idempotent.
- `POST /api/nodes/{node_id}/skip` — rejects for practice and quiz types.

## Practice and quizzes
- `POST /api/practice/{node_id}/attempt` — body `{ "code": "...", "passed": true, "hint_level": 2 }`. Increments attempts. Never blocks on attempt count.
- `POST /api/quizzes/{quiz_id}/attempt` — body `{ "answers": [...], "score": 8, "passed": true }`. On pass, marks the course complete and unlocks the next. Rejects if the previous course isn't complete.
- All code execution happens in the browser and never touches the server.

## Project
- `POST /api/submissions` — body `{ "repo_url": "..." }`. Validates the URL is a public GitHub repo the user owns. Rejects if the project isn't unlocked.
- `GET /api/submissions/{id}/status` — reads the latest Actions run via the GitHub API. Cached 30 seconds against rate limits.
- `POST /api/submissions/{id}/submit` — body `{ "pr_url": "..." }`. Rejects if checks have not passed.

Every endpoint returns a plain-language message the user can act on. No stack traces, no bare error codes.

---

# 17. Failure Handling

| Failure | Behavior | User message | Logged | Retry |
| --- | --- | --- | --- | --- |
| OAuth denied | Return to login | Sign-in was cancelled. Try again when you're ready. | Yes | Yes |
| OAuth callback mismatch | Return to login | Something's wrong on our end with sign-in. | Yes | No |
| Content file missing | Skip the node, keep the path working | This step isn't available yet. | Yes | No |
| Web Worker won't start | Fall back to a message | Your browser can't run code here. Try Chrome or Firefox. | Yes | No |
| Infinite loop in user code | Kill the worker after 2 seconds | Your code ran too long. Check for a loop that never ends. | No | Yes |
| Code doesn't compile | Show the compiler error verbatim | The error itself, unmodified | No | Yes |
| Test fails | Show the case, expected, actual | Never "incorrect" — always specifics | No | Yes |
| Quiz failed | Show missed questions and link the lessons | Not yet. Here's what to go back over. | No | Yes |
| Quiz abandoned mid-attempt | Discard the attempt, don't score it | — | No | Yes |
| Progress write conflict (two tabs) | Last write wins | — | Yes | Yes |
| Repo is private | Reject the connection | We can only read public repositories. Make it public and try again. | Yes | Yes |
| Repo isn't the user's | Reject the connection | That repository isn't on your account. | Yes | Yes |
| Actions not finished | Show running state and poll | Tests are still running. | No | Yes |
| GitHub API rate limited | Show cached result, back off | We'll check again in a minute. | Yes | Yes |
| Failing test with no mapped explanation | Generic but useful fallback | This check failed: [test name]. See the test file for what it expects. | Yes | Yes |
| PR submitted with checks failing | Reject | Get the tests passing first. | No | Yes |
| Database unreachable | Full-page error, don't lose local editor state | We can't save your progress right now. Your code is safe in this browser. | Yes | Yes |

**Retry rules:** only GitHub check polling retries automatically — 10 polls, 5 seconds apart backing off to 60, then stop and show a manual refresh. Everything else requires the user to act.

---

# 18. Determinism

There is no AI in this product.

| Kind | Source | Examples |
| --- | --- | --- |
| Authored content | Hand-written files | Lessons, problems, quizzes, hints, story, check explanations |
| Computed state | Deterministic code | Node status, progress, which node is active, quiz scoring |
| External fact | An API | The GitHub Actions check result, the GitHub username |

Nothing is generated at runtime. Nothing is probabilistic. The same actions always produce the same result.

**Why it matters:** cost doesn't scale with users, so the product stays free. Two students with the same bug get the same explanation. The product can never say something wrong to a beginner. And every piece of feedback improves permanently by editing one file.

---

# 19. Security and Privacy

**Stored:** email, display name, GitHub username, the name typed on the offer letter, code submissions, quiz scores.

**Never stored:** passwords (OAuth only — no password auth exists), GitHub tokens with write scope (read-only, public-repo scope only), payment information (there is none).

**Never logged:** OAuth tokens, session tokens, plain-text email addresses.

**Isolation:** every query is scoped by `user_id` from the session. No endpoint accepts a `user_id` from the client.

**Auth required** for everything except the landing page, login, and 404.

**GitHub authorization required** for connecting a repo and reading a check result.

The user's repository is public by their own choice, on their own account. THRESHOLD never writes to it.

---

# 20. Testing Plan

## Unit
- A locked node cannot be completed
- Completing a node unlocks exactly the next one
- A practice or quiz node cannot be skipped
- A story node can be skipped, and skipping it still unlocks the next node
- Passing a quiz marks the whole course complete and unlocks exactly the next course
- Failing a quiz changes no node state
- A later course's quiz cannot be attempted early
- The Project tab stays locked until all three courses are complete
- An empty signature is rejected
- An infinite loop is killed by the timeout
- A failing test with no mapped explanation falls back correctly

## API
- Unauthenticated requests are rejected
- A user cannot read another user's progress
- Completing a node twice is idempotent
- Onboarding stage cannot move backward
- A private repo URL is rejected with a clear message
- Someone else's repo is rejected

## Integration
- Sign in creates a user and an empty progress record
- Full onboarding lands on the dashboard
- Doing every node in a course, then the quiz, unlocks the next course
- Doing *only* the quiz unlocks the next course and marks the current one complete
- Completing all three courses unlocks the Project tab
- An Actions failure produces the right explanations

## Manual
- Complete Season 1 as a brand-new user with a fresh account
- Complete all three courses by quiz alone and confirm the project unlocks
- Refresh mid-practice-problem and confirm no code is lost
- Skip the intro and confirm the season still completes
- Skip GitHub, reach the Project tab, confirm the block is helpful
- Close the tab for two weeks, return, and know what to do in five seconds
- Use the whole app with a keyboard only
- Use the dashboard and a lesson on a phone

---

# 21. Success Metrics

## Product
- Someone with no experience finishes Season 1 without outside help
- More than [X]% of users who sign the offer letter reach the first practice problem
- More than [X]% of users who finish the courses connect a repository
- Users return on a second day with no reminder
- At least one user puts their repository on a job application

## Technical
- The full workflow works from landing page to merged pull request
- Progress survives sign-out, refresh, and returning weeks later
- Invalid requests are rejected with plain-language messages
- No user code ever runs on the server
- Practice feedback returns in under one second
- Cost per active user is effectively zero

---

# 22. Assumptions

| Assumption | How to test it |
| --- | --- |
| A beginner can install Node and Git from written help alone | Watch three people do it and time them |
| TypeScript in a Web Worker is reliable across browsers | Day 1 spike, before designing anything |
| GitHub Actions on free public repos is fast enough not to frustrate | Time ten real runs on the starter repo |
| Quizzes are hard enough that nobody passes cold without knowing the material | Compare quiz scores against lessons completed |
| Three courses is the right split for Season 1 | Watch where people stall |
| ~15 pre-written check explanations cover most real failures | Log every unmapped test failure and review weekly |

---

# 23. Open Questions

- Can a user sign in with GitHub and Google and have them merge into one account?
- What is the right pass threshold for a quiz? 80%?
- Should a failed quiz attempt be visible in history, or vanish entirely?
- Should a node passed by quiz show as complete, or as available-but-unread?
- Should the project unlock after all three courses, or progressively as each one finishes?
- What happens to a user's progress if a node is edited or removed after they started?
- Should practice problems be reopenable after they pass?
- How do I handle a user who deletes their repository after finishing?
- Does a public profile page belong in the MVP?

---

# 24. Risks

**Product:** the difficulty curve is wrong — too slow for programmers, too fast for beginners. Setup friction kills users before they write code. Quizzes are too easy and let people skip material they don't know. Three courses before the project feels like a long wait with nothing tangible.

**Technical:** TypeScript in a Web Worker turns out slow or unreliable. GitHub API rate limits bite at scale. AI-generated screens each work but don't integrate. Progress writes conflict across tabs.

**Scope:** building an in-browser IDE instead of using the user's real editor. Designing later seasons before Season 1 has a single user. Adding an AI assistant because it looks easy, then finding the cost.

**Mitigation:** spike the technical unknowns before designing anything. Ship Season 1 only. Watch a real person use it before launch. Keep the story skippable so it can never block anyone.

---

# 25. Decisions Log

**No AI anywhere in the product.**
The product is free with no revenue and AI cost scales per user. A deterministic hint ladder also teaches better than a chatbot that hands over answers. Considered: an embedded free model, or a paid tier that unlocks AI help. Gave up flexible personalized help; gained unlimited free users, consistent feedback, and content that improves permanently when edited.

**The project is built in the user's own editor and their own repository.**
The point is a real portfolio and a real commit history. A simulated pull request builds nothing. Considered: a full in-browser IDE with a fake PR flow. Gave up a frictionless experience and visibility into how users work; gained a real artifact and far less to build.

**Quizzes are the only way to skip, and they only skip lessons — never the project.**
Gives an experienced user a way past material they know without a placement test, a second mode, or a difficulty setting. Considered: free navigation, self-declared skill level at signup, a one-time placement test. Gave up flexibility for people who want to jump around; gained a product that is impossible to get lost in.

**Story is two nodes: an intro and an ending.**
Earlier versions had characters delivering tickets, messages between lessons, and code review written in a coworker's voice. That put story in front of teaching on every screen and made the content expensive to write and maintain. Considered: keeping character messages as skippable nodes. Gave up atmosphere and some of the reason to come back tomorrow; gained a product where the lessons are the product and the content is half the size.

**Season 1 is three courses — Git, GitHub, TypeScript.**
Splitting by skill instead of running one long path means progress is visible, each course has a clean finish line, and someone who already knows Git can test out of exactly that and nothing else. Considered: one continuous course. Gave up a single uninterrupted narrative; gained three real milestones and a working skip mechanism.

---

# 26. Definition of Done

**THRESHOLD version one is complete when a person who has never met me can go to the live URL, sign in, work through the Git, GitHub, and TypeScript courses with no help, and end up with a working command-line tool in a public repository on their own GitHub account — with a real commit history, a merged pull request, and passing tests.**
