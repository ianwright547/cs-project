# THRESHOLD — Product Definition

Author: Ian Wright
Created: 09/04/2026
Last updated: 09/04/2026
Current version: MVP — Season 1

---

# 1. Product Summary

THRESHOLD is a free course platform that teaches people to code by putting them inside a fictional job at a company, where they take short lessons, solve practice problems, and build one real piece of software per season on their own GitHub account.

---

# 2. Product Overview

The user signs in with GitHub or Google and is hired as a junior engineer at THRESHOLD — a company in the year 2091 that runs the surface sensor network after a nuclear war and tells the underground bunkers when it is safe to go outside.

The system gives the user a single linear roadmap. Each node on that roadmap is a lesson, a practice problem, a message from a coworker, a work ticket, or a code review. The user never has to decide what to do next or organize anything.

Lessons and practice problems run entirely in the browser. The season project is written by the user in their own editor, on their own machine, in their own GitHub repository. Tests run on GitHub Actions and the results are shown back inside the app as a code review from a fictional coworker.

The result is useful because the user finishes with a real, deployed, working project and a real commit history they can show an employer — not a certificate.

---

# 3. The Problem

## What happens today?

1. A person decides they want to learn to code.
2. They buy or start an online course.
3. They watch videos and follow along, typing what the instructor types.
4. They complete the course.
5. They have a folder of tutorial projects identical to every other student's.
6. They apply for jobs with an empty or copied GitHub profile.
7. They cannot answer "tell me about something you built" in an interview.
8. They conclude they are not ready and start another course.

## What is frustrating about the current process?

- Nothing they build is theirs.
- Following along is not the same as building, but it feels the same while you do it.
- There is no reason to care about any of the work.
- Courses teach syntax, not the job — no tickets, no code review, no deploys, no ambiguity.
- The output is a certificate, which no employer values.
- Motivation dies around week three and nothing pulls them back.

## What mistakes or delays can happen?

- The learner gets stuck on setup and quits before writing code.
- The learner copies the solution and does not notice they learned nothing.
- The learner finishes and still has nothing to show.
- The learner never opens a pull request or writes a commit message.

## Why is this problem worth solving?

- Employability — the portfolio is the product, not the lessons.
- Retention — a story gives people a reason to come back tomorrow.
- Realism — reading a ticket, getting review comments, and fixing them is the actual job.
- Access — it is free, so the people who need it most can use it.

---

# 4. Target User

## Primary user

**User:** A self-directed learner who wants a software job and has nothing to show.

Three sub-types, all supported by the same product:

| Type | Where they are | What they need |
| --- | --- | --- |
| Complete beginner | Has never written code | Very small steps, no setup cliff, constant sense of progress |
| Self-taught plateau | Can write functions, cannot ship | A real project, real code review, real deploy |
| CS student | Understands theory | Practical tooling — Git, PRs, CI, deploys — and something to talk about in interviews |

## What is this user trying to accomplish?

Get to the point where they can honestly say "I built this, it's live, here's the repo."

## What does this user already know?

Varies widely. The product must not assume any prior knowledge, but must let people skip what they already know without penalty.

## What does this user not want to do manually?

- Decide what to learn next
- Set up a project from scratch before they know anything
- Search for a project idea
- Figure out what "good enough" means

## Secondary users

Supported later, not the initial focus.

- Bootcamps or teachers assigning it to a cohort
- Employers looking at a student's public profile
- [Other]

---

# 5. Product Goals

## Primary goal

A user with no prior experience finishes Season 1 with a working command-line tool, deployed to their own public GitHub repository, that reads real public sensor data.

## Supporting goals

- The user always knows exactly what to do next.
- The user gets feedback in under one second on practice problems.
- The user experiences a real pull request and a real code review.
- The user wants to come back tomorrow because of the story.
- The platform costs almost nothing to run per user.

## What should become faster?

Getting from "I want to learn to code" to "I have shipped something."

## What should become more accurate?

Self-assessment — the user knows whether their code is correct because tests told them, not because a video looked similar.

## What should become easier to understand?

Why professional practices exist: version control, types, tests, code review, CI.

---

# 6. Non-Goals

The first version will deliberately not do the following.

- The MVP will not include an AI assistant or chatbot.
- The MVP will not run user code on the server.
- The MVP will not include a full in-browser IDE for the season project.
- The MVP will not have payments, subscriptions, or a paywall.
- The MVP will not have comments, forums, or any social features.
- The MVP will not have streaks, points, badges, or leaderboards.
- The MVP will not support any season beyond Season 1.
- The MVP will not have a content management system.
- The MVP will not support languages other than English.

## Why am I excluding these features?

Cost, scope, and focus. The product is free with no revenue, so anything that scales in cost per user is out. Anything that is not required to get a user from landing page to merged pull request is out. Social features add moderation cost and being alone underground is on theme.

---

# 7. MVP Scope

## The smallest complete workflow

```
[Lands on landing page]
        ↓
[Signs in with GitHub or Google]
        ↓
[Watches intro — the war, the bunkers, THRESHOLD]
        ↓
[Signs the offer letter with their own name]
        ↓
[Meets Wren, Osei, and Vale]
        ↓
[Connects GitHub (optional, recommended)]
        ↓
[Reads the Season 1 brief]
        ↓
[Roadmap — sees node 1 active, everything else sealed]
        ↓
[Message from Wren]
        ↓
[Lesson → Practice problem → Lesson → Practice problem ...]
        ↓
[Ticket assigned by Wren]
        ↓
[Clones starter repo, writes code on their own machine]
        ↓
[Pushes — GitHub Actions runs the tests]
        ↓
[Submits pull request]
        ↓
[Osei's review — failing tests become his comments]
        ↓
[Fixes, pushes again, tests pass, merged]
        ↓
[Season 1 cutscene — the archive predates the war]
        ↓
[Your build — repo link, live tool, what they learned]
```

## Required MVP capabilities

### Accounts and onboarding
- [ ] Sign in with GitHub
- [ ] Sign in with Google
- [ ] Store the signed name and signature timestamp
- [ ] Connect a GitHub account and store the username
- [ ] Allow skipping the GitHub connection, with a persistent reminder
- [ ] Route a first-time user to onboarding and a returning user to the roadmap

### Roadmap
- [ ] Load the node list from content files
- [ ] Compute and display node states: sealed, active, completed, skipped
- [ ] Persist progress to the database
- [ ] Auto-scroll to the active node on load
- [ ] Show progress in job language ("3 lessons until your first ticket")
- [ ] Present exactly one primary action at all times

### Lessons
- [ ] Render a sequence of slides from a content file
- [ ] Back, next, and position indicator
- [ ] "I know this" — skip the whole lesson and mark it skipped
- [ ] Mark complete and unlock the next node

### Practice problems
- [ ] Render prompt, worked example, starter code
- [ ] Editor with TypeScript syntax highlighting
- [ ] Compile and run TypeScript in a Web Worker
- [ ] Hard timeout so an infinite loop cannot hang the tab
- [ ] Run hidden test cases and report expected vs actual
- [ ] Four-level hint ladder, always available, never penalized
- [ ] Autosave editor contents to local storage on every keystroke
- [ ] Unlimited attempts

### Ticket and project
- [ ] Render the ticket as a work item from Wren
- [ ] Acceptance criteria checklist, worded identically to the tests
- [ ] "Ask Wren" — pre-written questions with pre-written answers
- [ ] Link to the starter repository template
- [ ] Accept a repository URL from the user
- [ ] Read the GitHub Actions check result through the GitHub API
- [ ] Accept a pull request URL as the submission

### Review
- [ ] Map each failing test to a pre-written comment in Osei's voice
- [ ] Show criteria with pass/fail state
- [ ] Support the changes-requested → fix → resubmit loop
- [ ] Mark merged when all checks pass

### Season completion
- [ ] Cutscene, shown before the summary
- [ ] Summary of what was built with repository link
- [ ] Season 2 shown as sealed with a date

---

# 8. Information Flow

## Step 1: Sign in

**Action:** The user signs in with GitHub or Google.

**Input:** OAuth provider response — email, name, provider ID, and for GitHub, username.

**Output:** A user record, an empty progress record, and a session. First-time users route to the intro; returning users route to the roadmap.

**Possible failures:** OAuth denied by the user, provider outage, callback URL mismatch, email already registered with the other provider.

**Temporary or permanent data:** User record and progress record are permanent. Session is temporary.

---

## Step 2: Intro

**Action:** A full-screen sequence of text frames establishes the war, the bunkers, THRESHOLD, and the number everyone is waiting on.

**Input:** Static content from a file.

**Output:** `intro_completed` flag on the user record.

**Possible failures:** User closes the tab mid-sequence (must resume, not restart from the beginning of onboarding).

**Temporary or permanent data:** The completion flag is permanent. Skippable from the first frame; never shown again once completed.

---

## Step 3: Offer letter

**Action:** The user reads a formal employment offer from THRESHOLD and signs it by typing their own name.

**Input:** The user's account name as a default suggestion.

**Output:** `signed_name`, `signed_at`, and the user's employee number (#31).

**Possible failures:** Empty signature (button stays disabled), signature containing only whitespace, user refreshes mid-signature.

**Temporary or permanent data:** The signed name and timestamp are permanent and used throughout the app afterward.

**Note:** The letter includes a confidentiality clause about surface data written in ordinary legal language. It has no function in Season 1 and is referenced in a later season.

---

## Step 4: Meet the team

**Action:** Three personnel records are shown — Wren Adeyemi (manager), Osei (engineer), Marguerite Vale (founder).

**Input:** Static content.

**Output:** `team_viewed` flag.

**Possible failures:** None.

---

## Step 5: Connect GitHub

**Action:** The user is asked to connect a GitHub account, with a plain-language explanation of why.

**Input:** GitHub OAuth, or a skip action.

**Output:** `github_username` stored, or `github_skipped` flag set.

**Possible failures:** OAuth denied, insufficient scopes granted, user already signed in with Google and declines a second provider.

**Temporary or permanent data:** Username is permanent. If skipped, a quiet persistent reminder appears on the roadmap, and the project node blocks with an explanation rather than an error.

---

## Step 6: Season 1 brief

**Action:** The user is shown what they own this season, what they will learn, and what they will have at the end.

**Input:** Static content.

**Output:** `brief_viewed` flag. Onboarding is complete; the roadmap unlocks.

---

## Step 7: Roadmap

**Action:** The user sees the full Season 1 path with one active node.

**Input:** The node list from content files, and the user's `node_state` records.

**Output:** Rendered path, computed active node, progress sentence.

**Possible failures:** Content file missing or malformed, progress record referencing a node that no longer exists, two browser tabs writing conflicting progress.

**Temporary or permanent data:** Node states and progress are permanent. Scroll position is temporary.

---

## Step 8: Message node

**Action:** The user opens a short message from Wren or Osei.

**Input:** Static content.

**Output:** Node marked completed, next node unlocked.

**Possible failures:** None.

**Note:** All story content is skippable in one action. A user who ignores every message must still be able to finish Season 1.

---

## Step 9: Lesson node

**Action:** The user reads a sequence of slides.

**Input:** Lesson content file — slides of text, code samples, and images.

**Output:** Node marked `completed` or `skipped`; last slide position stored so a returning user resumes where they stopped.

**Possible failures:** Content file missing, image fails to load, user leaves mid-lesson.

**Temporary or permanent data:** Completion is permanent; slide position is permanent until completion, then discarded.

---

## Step 10: Practice problem node

**Action:** The user writes code, runs it, and checks it against hidden tests.

**Input:** Problem content file — prompt, worked example, starter code, hidden test cases, four hints. Plus the user's current editor contents.

**Output:** Test results (pass/fail per case, expected vs actual), attempt count, highest hint level revealed, final code, node status.

**Possible failures:**
- Code does not compile
- Infinite loop (must be killed by timeout, not by the user closing the tab)
- Web Worker fails to start
- Code throws before producing output
- Browser lacks Web Worker support
- User's work lost on refresh (must not happen — autosave)

**Temporary or permanent data:** Editor contents autosave to local storage continuously. Final submitted code, attempt count, and hint level are permanent.

**Rules:**
- Unlimited attempts, no penalty.
- Hints are always available. Revealing the solution still counts as solved.
- Never show a bare "incorrect" — always show which case failed, the expected value, and the actual value.

---

## Step 11: Ticket node

**Action:** Wren assigns the season's real work.

**Input:** Ticket content file — ticket ID, Wren's message, acceptance criteria, starter repository link, and the pre-written "Ask Wren" question and answer pairs.

**Output:** Node opened; the project node unlocks.

**Possible failures:** User has skipped the GitHub connection (block with an explanation and a connect button, not an error).

**Rule:** The acceptance criteria shown here must be worded identically to what the automated tests check. No surprises at review.

---

## Step 12: Project work

**Action:** The user clones the starter repository, writes the tool on their own machine, and pushes.

**Input:** The starter repository template — project structure, config, README written as a ticket handoff, the real test suite, and a GitHub Actions workflow.

**Output:** A repository on the user's account, commits, a GitHub Actions run, and a check result.

**Possible failures:**
- User cannot install Node or Git (help content must cover this in plain language)
- Repository is private and the app cannot read the check result
- User pushes with no commits or an empty repository
- GitHub Actions has not finished running yet
- Workflow fails for an infrastructure reason rather than a test failure
- GitHub API rate limit reached

**Temporary or permanent data:** The repository lives on the user's account permanently and is never owned by THRESHOLD. The submission record — repo URL, PR URL, check status — is permanent.

---

## Step 13: Review node

**Action:** Failing tests are presented as a code review from Osei.

**Input:** The GitHub Actions check result, mapped to pre-written review comments.

**Output:** Criteria list with pass/fail, Osei's comments attached to failures, and either a request-changes state or a merged state.

**Possible failures:** A test fails that has no mapped comment (must fall back to a generic but still useful message), check result unavailable, user resubmits the same failing commit.

**Rules:**
- Deterministic. Every comment is pre-written. No AI.
- Osei is direct and never soft about the code, but never dismissive of the person, and always explains why it matters.
- No celebration on pass. One short line from him.

---

## Step 14: Season complete

**Action:** The story beat lands, then the receipts.

**Input:** Cutscene content, the user's submission record, and the skills covered.

**Output:** Season 1 marked complete, Season 2 shown as sealed with a date.

**Rule:** Cutscene first, summary second. Reversing this kills the moment.

---

## Information Storage Summary

### Temporary information
- Session tokens
- Editor contents before a passing submission (local storage)
- Scroll position
- Web Worker execution context
- In-flight test results

### Permanent information
- User record and provider identity
- Signed name and timestamp
- GitHub username or skip flag
- Node states and completion timestamps
- Practice attempt counts and highest hint level
- Final submitted practice code
- Repository URL, pull request URL, check status
- Season completion

---

# 9. What Happens Automatically vs What the User Controls

## The system does automatically
- Unlock the next node when the current one completes
- Save progress on every state change
- Autosave editor contents
- Run tests when the user asks
- Poll GitHub for a check result after a submission
- Map failing tests to review comments
- Resume the user where they left off

## The user always controls
- Whether to read or skip any story content
- Whether to skip a lesson
- When to run their code
- When to submit a pull request
- Whether to reveal a hint, and how far
- Whether to connect GitHub

## The system must never
- Mark a node complete that the user did not complete
- Lose unsaved editor contents
- Block the user from continuing because of a story element
- Write to the user's GitHub repository
- Show a score, rank, or comparison to another user

---

# 10. Core Data Objects

## User

**Purpose:** One person using the platform.

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| id | Unique ID | Yes | Unique user identifier |
| email | Text | Yes | From the OAuth provider |
| name | Text | No | Display name from provider |
| provider | Text/Enum | Yes | `github` or `google` |
| provider_id | Text | Yes | Provider's user ID |
| github_username | Text | No | Set when GitHub is connected |
| github_skipped | Boolean | Yes | Whether the user declined to connect |
| signed_name | Text | No | The name typed on the offer letter |
| signed_at | Date and time | No | When the offer was signed |
| onboarding_stage | Text/Enum | Yes | Current onboarding position |
| created_at | Date and time | Yes | Account creation |
| last_seen_at | Date and time | Yes | Last activity |

**Possible onboarding stages:** `new`, `intro_done`, `signed`, `team_done`, `github_done`, `briefed`, `active`.

## Progress

**Purpose:** Where a user is within a season.

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| id | Unique ID | Yes | Identifier |
| user_id | Unique ID | Yes | Owning user |
| season | Number | Yes | Season number (1 for MVP) |
| current_node_id | Text | Yes | The active node |
| completed_count | Number | Yes | Nodes completed this season |
| started_at | Date and time | Yes | Season start |
| completed_at | Date and time | No | Season completion |
| updated_at | Date and time | Yes | Last change |

## Node State

**Purpose:** The user's status on one node of the roadmap.

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| id | Unique ID | Yes | Identifier |
| user_id | Unique ID | Yes | Owning user |
| node_id | Text | Yes | Node identifier from content files |
| node_type | Text/Enum | Yes | message, lesson, practice, ticket, project, review, cutscene |
| status | Text/Enum | Yes | Current state |
| attempts | Number | No | Practice attempts |
| hint_level | Number | No | Highest hint revealed (0–4) |
| submitted_code | Text | No | Final practice code |
| slide_position | Number | No | Resume point within a lesson |
| completed_at | Date and time | No | Completion time |
| updated_at | Date and time | Yes | Last change |

**Possible statuses:** `sealed`, `active`, `in_progress`, `completed`, `skipped`.

## Submission

**Purpose:** The user's season project work and its check results.

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| id | Unique ID | Yes | Identifier |
| user_id | Unique ID | Yes | Owning user |
| season | Number | Yes | Season number |
| repo_url | Text | Yes | The user's repository |
| pr_url | Text | No | The pull request |
| commit_sha | Text | No | Commit the checks ran against |
| check_status | Text/Enum | Yes | Result of the GitHub Actions run |
| failed_tests | List | No | Names of tests that failed |
| attempt_number | Number | Yes | How many times submitted |
| created_at | Date and time | Yes | Submission time |
| updated_at | Date and time | Yes | Last status change |

**Possible check statuses:** `not_started`, `repo_connected`, `queued`, `running`, `failed`, `passed`, `submitted`, `changes_requested`, `merged`, `unavailable`.

## Content Objects (files, not database rows)

These live as files in the repository and are versioned with the code. They are never written at runtime.

| Object | Contains |
| --- | --- |
| Node | id, order, type, title, one-line summary, content file reference |
| Lesson | slides — text, code samples, images |
| Practice problem | prompt, worked example, starter code, hidden tests, four hints |
| Ticket | ticket ID, Wren's message, acceptance criteria, repo link, Ask-Wren pairs |
| Review comment | test name it maps to, Osei's comment text |
| Message | speaker, text |
| Cutscene | ordered frames of text |

---

# 11. Relationships Between Data

## User relationships
- Can one user have multiple progress records? Yes — one per season.
- Can one user have multiple node states? Yes — one per node.
- Can one user have multiple submissions? Yes — one per attempt.
- Can one user sign in with both GitHub and Google? [Decide: merge by email, or treat as separate accounts]

## Node relationships
- Does every node state belong to exactly one user? Yes.
- Can a node be completed more than once? No — but a completed node can be reopened for reading.
- Can a node be unlocked out of order? No, except that lessons may be skipped.
- What unlocks a node? The previous node reaching `completed` or `skipped`.

## Submission relationships
- Does every submission belong to one user? Yes.
- Can one user have multiple submissions for the same season? Yes — each resubmission creates a new record.
- Which submission is authoritative? The most recent one.
- What happens to older submissions? Retained for history, never deleted.

## Content relationships
- Can one lesson be referenced by multiple nodes? [Decide — probably no, keep one-to-one for simplicity]
- Can one review comment map to multiple failing tests? [Decide]
- What happens to a user's progress if a node is removed from content? [Decide — likely: ignore missing nodes and recompute the active node]

---

# 12. Statuses and State Transitions

## Node states

```
sealed
active
in_progress
completed
skipped
```

| Current state | Allowed next state | Trigger | Must prevent |
| --- | --- | --- | --- |
| sealed | active | Previous node completed or skipped | Unlocking out of order |
| active | in_progress | User opens the node | — |
| in_progress | completed | Completion requirement met | Completing without meeting it |
| in_progress | skipped | User skips a lesson | Skipping a ticket, project, or review |
| completed | — | — | Un-completing a node |
| skipped | in_progress | User reopens it | — |

## Submission states

```
not_started
repo_connected
queued
running
failed
passed
submitted
changes_requested
merged
unavailable
```

| Current state | Allowed next state | Trigger |
| --- | --- | --- |
| not_started | repo_connected | User provides a repository URL |
| repo_connected | queued | User pushes and Actions is triggered |
| queued | running | Actions starts |
| running | passed / failed | Actions finishes |
| failed | queued | User pushes a fix |
| passed | submitted | User opens a pull request |
| submitted | changes_requested | Review has failing criteria |
| submitted | merged | All criteria pass |
| any | unavailable | GitHub API cannot be reached |

## Invalid transitions the system must prevent

- A node cannot go from `sealed` directly to `completed`.
- A ticket, project, or review node cannot be `skipped`.
- A submission cannot become `merged` while any check is failing.
- Season 1 cannot be marked complete while any required node is incomplete.
- A user cannot reach the project node without a connected GitHub account.

---

# 13. Application Actions

## Authentication
- **Sign in** — `POST /api/auth/[provider]`. Creates user and progress on first sign-in. Routes by `onboarding_stage`.
- **Sign out** — clears the session only.
- **Connect GitHub** — stores `github_username`. Requires an authenticated session.
- **Skip GitHub** — sets `github_skipped`. Reversible at any time.

## Onboarding
- **Sign offer letter** — `POST /api/onboarding/sign`. Body: `{ "signed_name": "..." }`. Rejects empty or whitespace-only names. Idempotent — signing twice does not overwrite the original timestamp.
- **Advance onboarding stage** — `POST /api/onboarding/stage`. Body: `{ "stage": "..." }`. Rejects moving backward.

## Roadmap
- **Get roadmap** — `GET /api/roadmap`. Returns the node list merged with the user's node states and the computed active node.
- **Complete node** — `POST /api/nodes/{node_id}/complete`. Rejects if the node is sealed. Idempotent.
- **Skip node** — `POST /api/nodes/{node_id}/skip`. Rejects for ticket, project, and review node types.

## Practice
- **Save attempt** — `POST /api/practice/{node_id}/attempt`. Body: `{ "code": "...", "passed": true, "hint_level": 2 }`. Increments attempt count. Never blocks on attempt count.
- Test execution itself happens entirely in the browser and never touches the server.

## Project and review
- **Connect repository** — `POST /api/submissions`. Body: `{ "repo_url": "..." }`. Validates the URL is a GitHub repository the user owns and that it is public.
- **Get check status** — `GET /api/submissions/{id}/status`. Reads the latest GitHub Actions run through the GitHub API. Cached for 30 seconds to avoid rate limits.
- **Submit pull request** — `POST /api/submissions/{id}/submit`. Body: `{ "pr_url": "..." }`. Rejects if checks have not passed.

## Failure responses

Every endpoint must return a plain-language message the user can act on. No stack traces, no error codes alone.

---

# 14. Failure Handling

| Failure | Expected behavior | User message | Logged? | Safe to retry? |
| --- | --- | --- | --- | --- |
| OAuth denied | Return to login | Sign-in was cancelled. Try again when you're ready. | Yes | Yes |
| OAuth callback mismatch | Return to login | Something's wrong on our end with sign-in. | Yes | No |
| Content file missing | Skip the node, keep the roadmap working | This step isn't available yet. | Yes | No |
| Web Worker fails to start | Fall back to a message | Your browser can't run code here. Try Chrome or Firefox. | Yes | No |
| Infinite loop in user code | Kill the worker after 2 seconds | Your code ran too long. Check for a loop that never ends. | No | Yes |
| Code does not compile | Show the compiler error verbatim | The error message itself, unmodified | No | Yes |
| Test fails | Show which case, expected, actual | Never "incorrect" — always specifics | No | Yes |
| Progress write conflict (two tabs) | Last write wins | — | Yes | Yes |
| Repo is private | Reject connection | We can only read public repositories. Make it public and try again. | Yes | Yes |
| Repo URL is not the user's | Reject connection | That repository isn't on your account. | Yes | Yes |
| GitHub Actions not finished | Show running state and poll | Tests are still running. | No | Yes |
| GitHub API rate limited | Show cached result and back off | We'll check again in a minute. | Yes | Yes |
| Failing test with no mapped comment | Show a generic but useful fallback | This check failed: [test name]. See the test file for what it expects. | Yes | Yes |
| PR submitted while checks failing | Reject | Get the tests passing first — Osei won't look at it otherwise. | No | Yes |
| Database unreachable | Show a full-page error, do not lose local editor state | We can't save your progress right now. Your code is safe in this browser. | Yes | Yes |
| [Failure] | [Behavior] | [Message] | [Yes/No] | [Yes/No] |

## Retry rules
- Which failures retry automatically? GitHub check polling, and only that.
- Maximum automatic retries: 10 polls, then stop and show a manual refresh.
- Delay between retries: 5 seconds, then exponential up to 60 seconds.
- Which failures require the user to act? Everything else.

---

# 15. Content and Determinism Boundaries

There is no AI in this product. This section replaces the usual AI-boundaries section.

## Everything the user sees is one of three things

| Kind | Source | Examples |
| --- | --- | --- |
| Authored content | Files written by hand | Lessons, problems, hints, story, Osei's comments |
| Computed state | Deterministic code | Node status, progress count, which node is active |
| External fact | An API | GitHub Actions check result, GitHub username |

Nothing is generated at runtime. Nothing is probabilistic. The same user actions always produce the same result.

## Why this matters
- Cost does not scale with users, so the product can stay free.
- Feedback is consistent — two students with the same bug get the same explanation.
- The product cannot say something wrong or strange to a beginner.
- Every piece of feedback can be improved permanently by editing one file.

## Deterministic code owns
- Node unlocking and state transitions
- Progress calculation
- Test pass/fail evaluation
- Which review comments appear
- All validation
- All routing

---

# 16. Security and Privacy

## What sensitive information is stored?
- Email address
- Display name
- GitHub username
- The name they typed on the offer letter
- Their code submissions

## What is never stored?
- Passwords (OAuth only, no password auth exists)
- GitHub tokens with write scope — read-only, public-repo scope only
- Payment information (there is none)

## What must never appear in logs?
- OAuth tokens
- Session tokens
- Email addresses in plain text
- [Other]

## How is one user's data kept separate from another's?
Every query is scoped by `user_id` from the session. There is no endpoint that accepts a `user_id` from the client.

## Which actions require authentication?
- Everything except the landing page, login, and the 404 page.

## Which actions require GitHub authorization?
- Connecting a repository
- Reading a check result

## Public data
The user's repository is public by their own choice and hosted on their own account. THRESHOLD never writes to it.

---

# 17. Testing Plan

## Unit tests
- [ ] A sealed node cannot be completed
- [ ] Completing a node unlocks exactly the next one
- [ ] A ticket, project, or review node cannot be skipped
- [ ] Progress count is correct after skips
- [ ] An empty signature is rejected
- [ ] Practice code with an infinite loop is killed by the timeout
- [ ] A failing test with no mapped comment falls back correctly
- [ ] A submission cannot be submitted while checks are failing

## API tests
- [ ] Unauthenticated requests are rejected
- [ ] A user cannot read another user's progress
- [ ] Completing a node twice is idempotent
- [ ] Onboarding stage cannot move backward
- [ ] A private repository URL is rejected with a clear message
- [ ] A repository belonging to someone else is rejected

## Integration tests
- [ ] Sign in creates a user and an empty progress record
- [ ] Full onboarding sequence lands on the roadmap
- [ ] Completing all nodes marks the season complete
- [ ] A GitHub Actions failure produces the right review comments

## Manual tests
- [ ] Complete Season 1 as a brand-new user with a fresh account
- [ ] Refresh the page mid-practice-problem and confirm no code is lost
- [ ] Skip every story element and confirm the season still completes
- [ ] Skip GitHub, then reach the project node, and confirm the block is helpful
- [ ] Close the tab for two weeks, return, and confirm you know what to do in five seconds
- [ ] Use the whole app with a keyboard only
- [ ] Use the roadmap and a lesson on a phone

---

# 18. Success Metrics

## Product success
- A user with no prior experience finishes Season 1 without outside help.
- More than [X]% of users who sign the offer letter reach the first practice problem.
- More than [X]% of users who reach the ticket open a pull request.
- Users return on a second day without a reminder.
- At least one user puts their repository on a job application.

## Technical success
- [ ] The full workflow works from landing page to merged pull request
- [ ] Progress survives sign-out, refresh, and returning weeks later
- [ ] Invalid requests are rejected with plain-language messages
- [ ] No user code ever runs on the server
- [ ] Practice feedback returns in under one second
- [ ] Cost per active user is effectively zero
- [ ] Tests pass
- [ ] The app can be run by following the README

---

# 19. Assumptions

- I assume a beginner can install Node and Git with written help and no video.
- I assume compiling and running TypeScript in a Web Worker is reliable across browsers.
- I assume GitHub Actions on free public repositories is fast enough that waiting for a result is not frustrating.
- I assume the GitHub API rate limit is sufficient at expected volume.
- I assume the story increases retention rather than annoying people.
- I assume about 15 pre-written review comments cover most real failures.
- I assume [assumption].

## How can I test these assumptions?

| Assumption | How I will test it |
| --- | --- |
| Beginners can complete setup | Watch three people do it and time them |
| Web Worker approach works | Day 1 spike, before designing anything |
| GitHub Actions is fast enough | Time ten real runs on the starter repo |
| The story helps retention | Track how many users skip story nodes |
| 15 comments cover most failures | Log every unmapped test failure and review weekly |

---

# 20. Open Questions

- Should a user be able to sign in with GitHub and Google and have them merge into one account?
- What happens to a user's progress if I edit or remove a node after they started?
- Should practice problems be reopenable after they pass?
- Should the season project have a "give up and see the solution" path?
- Should there be an email when Season 2 releases, and does that mean storing email preferences?
- How do I handle a user who deletes their repository after finishing?
- Should skipped lessons show differently from completed ones on the roadmap?
- Does the public profile page belong in the MVP at all?
- [Your question]

---

# 21. Risks

## Product risks
- The story is a gimmick people skip, and then it's just another course.
- The difficulty curve is wrong — too slow for programmers, too fast for beginners.
- Setup friction kills users before they write any code.
- People finish Season 1 and there is no Season 2 waiting.

## Technical risks
- TypeScript in a Web Worker turns out to be slow or unreliable.
- GitHub API rate limits become a problem at scale.
- AI-generated code produces screens that each work but do not integrate.
- Progress writes conflict across tabs and lose data.

## Scope risks
- Building a full in-browser IDE instead of using the user's real editor.
- Designing seasons 2–6 before Season 1 has a single user.
- Spending the week on the story instead of the product.
- Adding an AI assistant because it seems easy, then discovering the cost.

## How will I reduce these risks?
Spike the two technical unknowns on Day 1 before designing anything. Ship Season 1 only. Watch a real person use it before launch. Keep the story skippable so it can never block anyone.

---

# 22. Build Order

## Phase 1: Foundation (Day 1)
- [ ] PRD
- [ ] Node list for Season 1
- [ ] Three spikes: Web Worker TypeScript, GitHub Actions API, both auth providers
- [ ] Design system visually, then coded as CSS tokens
- [ ] `/styleguide` route
- [ ] Next.js app, auth, database schema
- [ ] Docker, deployed empty to AWS

## Phase 2: Design every screen (Days 2–3)
- [ ] Landing, login, intro, offer letter, meet the team, connect GitHub, brief
- [ ] Roadmap, including the cross-section variant
- [ ] Lesson, practice, ticket
- [ ] Project status, review, season complete
- [ ] Settings, help, 404
- [ ] Click through the entire app as static screens

## Phase 3: Content (Day 4)
- [ ] 5 lessons
- [ ] 12 practice problems with tests and hints
- [ ] Ticket, acceptance criteria, Ask-Wren pairs
- [ ] ~15 of Osei's review comments
- [ ] All story copy
- [ ] Landing page copy

## Phase 4: Make it work — data (Day 5)
- [ ] Content loader
- [ ] Roadmap wired to real progress
- [ ] Auth routing and onboarding persistence
- [ ] Lesson player wired

## Phase 5: Make it work — the hard parts (Day 6)
- [ ] Practice runner: Web Worker, tests, hints, autosave
- [ ] Starter repository template with GitHub Actions
- [ ] Submit flow and check reading
- [ ] Review screen with comment mapping

## Phase 6: Ship (Day 7)
- [ ] Full run as a new user, twice
- [ ] Every state: empty, loading, error, offline
- [ ] Responsive, keyboard, focus, contrast, light theme
- [ ] Production Docker, secrets, domain, HTTPS, error logging, backups
- [ ] Watch one real person complete Season 1

---

# 23. Decisions Log

## Decision 1
Date: [Date]
Decision: No AI anywhere in the product.
Reason: The product is free with no revenue, and AI cost scales per user. A deterministic hint ladder also teaches better than a chatbot that hands over answers.
Alternatives considered: An embedded free model; a paid tier that unlocks AI help.
Tradeoff: Gave up flexible, personalized help. Gained unlimited free users, consistent feedback, and content that improves permanently when edited.

## Decision 2
Date: [Date]
Decision: The season project is written in the user's own editor, in their own GitHub repository.
Reason: The entire point is a real portfolio and a real commit history. A simulated pull request builds nothing.
Alternatives considered: A full in-browser IDE with a simulated PR flow.
Tradeoff: Gave up a frictionless experience and lost visibility into how users work. Gained a real artifact and far less to build.

## Decision 3
Date: [Date]
Decision: [What did you decide?]
Reason: [Why?]
Alternatives considered: [What else?]
Tradeoff: [What did you gain and give up?]

---

# 24. Daily Progress Log

## [Date]

**What I planned**
-
-

**What I completed**
-
-

**What I learned**


**What confused me**


**Bugs or problems I found**
-

**Decisions I made**
-

**What I will do next**
-

---

# 25. Final MVP Definition

## Version-one user
A person with little or no coding experience who wants a software job and has nothing to show for their learning so far.

## Version-one problem
They finish courses without producing anything real, so they cannot demonstrate ability to an employer or to themselves.

## Version-one input
An account, a browser, and a GitHub account.

## Version-one output
A public GitHub repository containing a working TypeScript command-line tool that reads real public sensor data, with a real commit history, a merged pull request, and passing CI.

## Version-one workflow
1. Sign in and get hired.
2. Follow a single roadmap with one clear next step at all times.
3. Take short lessons and solve practice problems in the browser.
4. Receive a ticket from a manager.
5. Build the tool in their own editor and push it.
6. Get a code review from a coworker and fix what's wrong.
7. Get merged, and watch the season end on a cliffhanger.

## Version-one required features
- GitHub and Google sign-in
- Onboarding with a signable offer letter
- A single linear roadmap with persistent progress
- Lessons with a skip option
- Practice problems running in the browser with a four-level hint ladder
- A ticket with acceptance criteria matching the tests
- A starter repository with GitHub Actions
- Automated review presented as a coworker's comments
- Season completion with a cutscene and a summary

## Version-one excluded features
- AI assistance of any kind
- Server-side code execution
- Payments
- Social features
- Seasons 2 and beyond
- Public profile page (decide before Day 2)

## Definition of done

**THRESHOLD version one is complete when a person who has never met me can go to the live URL, sign in, complete Season 1 with no help, and end up with a working tool in a public repository on their own GitHub account with a merged pull request and passing tests.**
