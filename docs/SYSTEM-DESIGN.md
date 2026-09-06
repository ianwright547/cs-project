# System Design — Core

**Project:**
**Author:**
**Last updated:**

> The rule: **you own decisions that have tradeoffs. AI owns work that has a right answer.**
>
> Everything in Part 1 is a judgment call only you can make, and every one of them is something you'll be asked about. Everything in Part 2 has a correct answer that AI can produce faster and better than you can — you just have to review it.
>
> Part 1 should take about 90 minutes. Fill it in before you build.

---

# PART 1 — What you fill in

## 1. What it does

**One sentence:**


**One paragraph — what goes in, what happens, what comes out:**


---

## 2. Constraints

*[The rules the design must obey. Everything else is a consequence of these.]*

**Budget — what can I afford per month?**


**Who maintains this?**


**Hard rules I will not break:**

-
-
-

---

## 3. The Work Audit ⭐ *the most important section*

*[Every action a user can take, what your server has to do, and how that work grows.]*

**Cost classes:** Zero (client or third party does it) · Fixed (same at any scale) · Per user (grows with signups) · **Per action (grows with usage — this is what gets expensive)**

| User action | What my server must do | Cost class |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

**Which rows are "per action"?**


**Where did each of those move to — the client, a free third party, or a cache?**

| Expensive row | Moved to | Now costs |
| --- | --- | --- |
|  |  |  |
|  |  |  |

---

## 4. What Runs Where ⭐

**Diagram** *[browser, your server, your database, every external service. Label the arrows.]*

```

```

**Why this boundary?**

| Runs on the client | Why not the server |
| --- | --- |
|  |  |
|  |  |

| Runs on the server | Why not the client |
| --- | --- |
|  |  |
|  |  |

---

## 5. Data Model ⭐

**Tables** *[copy this block per table]*

### Table: [name]
**Represents:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id |  | Yes |  |
|  |  |  |  |
|  |  |  |  |

**Relationships**

| From | To | Type |
| --- | --- | --- |
|  |  |  |
|  |  |  |

**Anything with a lifecycle — list its states and legal transitions**

*[This is where most bugs come from. Ten minutes here saves hours later.]*

**Object:**
**States:**

| From | To | Trigger |
| --- | --- | --- |
|  |  |  |
|  |  |  |

**Transitions that must be impossible:**

-
-

**What is deliberately NOT in the database, and where does it live instead?**


---

## 6. Auth

**How does someone prove who they are?**


**The sign-in flow, step by step** *[if you can't write every step, you don't understand it yet]*

1.
2.
3.
4.
5.

**Sessions or tokens? Why?**


**What permissions do I request from third parties, and why is each one necessary?**


---

## 7. Capacity and Cost

| Resource | Per user | At 10,000 users | Verdict |
| --- | --- | --- | --- |
| Database storage |  |  |  |
| Bandwidth |  |  |  |
| Requests / CPU |  |  |  |
| Third-party rate limits |  |  |  |

**Show the math:**

```

```

**Which resource runs out first?**


**What breaks at 100,000 users, and what's the fix?**


---

## 8. Decision Records ⭐

*[Write one the moment you decide, not after. If you can't name an alternative, you didn't make a decision — you made an assumption.]*

### Decision 1
**Decision:**
**Why:**
**Alternative considered:**
**What I gave up to get it:**

### Decision 2
**Decision:**
**Why:**
**Alternative considered:**
**What I gave up to get it:**

### Decision 3
**Decision:**
**Why:**
**Alternative considered:**
**What I gave up to get it:**

---

## 9. The Three-Minute Explanation

> Fill this last. Then close the document and say it out loud. Wherever you stumble is the part you don't actually understand. This is also exactly what a systems interview asks for.

**What it does:**


**What runs where:**


**The data model in three sentences:**


**What happens on the most important user action, start to finish:**


**What breaks first, and at what scale:**


**The decision I'm least sure about:**


---

## 10. What I don't know yet

*[Be honest. "I don't know, here's how I'd find out" is a strong answer in an interview. Bluffing is what costs you the offer.]*

-
-
-

---
---

# PART 2 — What AI handles

These have correct answers. Hand them over, then review the output against Part 1.

| Area | What AI does | What I review |
| --- | --- | --- |
| **API routes** | Writes every endpoint, request/response models, validation | That the shapes match my data model, and that repeat requests are safe |
| **Migrations** | Alembic setup, migration files | That nothing destructive runs without me seeing it |
| **Error handling** | Try/except, error responses, retry logic | That messages are plain language a user can act on |
| **Caching headers** | Cache-Control, content hashing, immutable assets | That the biggest asset is cached and lazily loaded |
| **Docker** | Dockerfile, multi-stage build, compose file | That secrets come from the environment, never the image |
| **Deployment** | AWS config, health checks, CI pipeline | That I can roll back, and that I know how |
| **Logging & monitoring** | Structured logging, error reporting setup | That nothing sensitive is logged |
| **Security hardening** | Input validation, headers, rate limits | That every query is scoped to the signed-in user |
| **Tests** | Unit and integration tests | That the important rules from §5 are actually tested |

## The handoff

Paste this at the top of every build session, with Part 1 attached:

```
Here is my system design. Build against it exactly.

Rules:
- Do not add infrastructure that isn't in the design (no Redis,
  no queues, no background workers, no WebSockets).
- Do not add server-side work that scales per user.
- If a request I make conflicts with the constraints in Section 2,
  say so and propose an alternative instead of silently working
  around it.
- Every database query must be scoped to the authenticated user.
- Secrets come from environment variables, never from code.

When you finish a piece, tell me: what you built, what you assumed,
and anything in my design that turned out to be wrong.
```

That last line is the one that matters. It surfaces the gaps in Part 1 while they're still cheap to fix.

## What I check before merging AI's work

- [ ] Does it match my data model, or did it invent tables?
- [ ] Does every endpoint check who's signed in?
- [ ] Is every query scoped to that user?
- [ ] Did it add anything that costs money per user?
- [ ] Are secrets out of the code?
- [ ] Can I explain every file it created?

> The last box is the real one. If AI wrote something you can't explain, you don't own it — and you'll find that out in an interview or at 2am, whichever comes first.
