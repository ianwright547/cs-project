# THRESHOLD — 7 Day Build Plan

**Ian and Kyle. AI writes the code and the content. You two decide what it builds and check that it's right.**

---

## How each day works

| Part | What it is |
| --- | --- |
| **LEARN FIRST** | Done the night before. Only what tomorrow needs. |
| **SYSTEM DESIGN — IAN** | Ian decides how one part of the system works, and writes it down. |
| **IAN BUILDS** | Ian directs AI, then checks the result. |
| **KYLE BUILDS** | Same, on his own files. |
| **DELIVERABLES** | The exact things that exist at the end of the day. |
| **PROVE IT** | One thing you do to confirm it actually works. |

## Two rules

**Learn the night before you need it.** You can't design something you don't understand. If Ian designs login before learning how login works, he'll write something that looks finished and is wrong — and AI will build exactly that.

**Only design what's hard to change.** Database tables, where code runs, how login works — decide these carefully. Colors, error wording, retry counts — decide those when you get there.

---

# Who owns what

## IAN — the system

- System design: architecture, database, API, login, infrastructure
- The backend
- Docker, AWS, deployment, secrets, the domain
- The hard screens
- The story and characters

## KYLE — the data engine

Kyle is an ISE major. He gets the part of this product that is actually engineering in his field — everything about the sensor data.

- **The data pipeline** — pull live environmental data from a real public source, clean it, validate it
- **The scoring logic** — turn a set of readings into a single "is it safe" number. *This is the product's entire premise, written in Python.*
- **The sample data files** — including deliberately broken ones, so students have to handle real failure modes
- **All test suites** — the tests behind the practice problems, and the tests for the season project
- **QA**

**No frontend.** React and CSS won't show up anywhere in his degree and won't stick. Everything above is Python, time-series data, and validation, which is exactly what he'll actually use.

## The rule that keeps you out of each other's way

> **Kyle produces Python and data files. Ian consumes them.**

Nothing Kyle writes has to compile against Ian's app. He works in his own folder, on his own schedule, and can run ahead all week. No merge conflicts, no waiting.

Ian builds every screen and owns the design system, since AI makes screens cheap to generate anyway.

## What this product does NOT have

Say no to all of these, every time they come up:

| Not building | Why |
| --- | --- |
| **Any AI inside the product** | It's free. AI costs money per user. Hints are written in advance. |
| Running student code on our server | The browser does it. Free. |
| An in-browser code editor for the project | Students use their own editor. That's the point. |
| Payments | It's free. |
| Comments, forums, leaderboards | It's a job, not a game. |
| Redis, queues, background workers, Kubernetes | Nothing in this app needs them. |

---
---

# DAY 0 — Get ready

*Not a build day. Do it over a few evenings.*

## LEARN FIRST

**Ian**
- [ ] Git and GitHub
- [ ] How a website works — browser, server, request, response
- [ ] Docker and Docker Compose
- [ ] How databases store data — tables, columns, IDs, connecting tables together
- [ ] How "Sign in with Google" works

**Kyle** — all Python and data, no web

- [ ] **Git and GitHub** — the only thing both of you need
- [ ] **Python refresher** — functions, lists, dictionaries, loops
- [ ] **Reading and writing files** — CSV and JSON
- [ ] **Calling a public API in Python** — the `requests` library, and reading JSON responses
- [ ] **Cleaning messy data with pandas** — missing values, wrong types, duplicates
- [ ] **Working with timestamps and time-series data** — parsing dates, finding gaps, spotting outliers
- [ ] **Writing tests with pytest** — how to check that code does what it should

Kyle never touches Docker, AWS, login, React, or CSS. Skip all of it.

## SET UP — IAN

- [ ] AWS account
- [ ] Buy the domain
- [ ] Create a GitHub sign-in app
- [ ] Create a Google sign-in app
- [ ] Install Node and Docker

## SYSTEM DESIGN — IAN — pick the technology

**What you're producing: a one-page list of what you're using and why.**

Six choices. All of them are painful to change later. The *question* matters more than the answer — that's what you'll be asked about.

**1. Does the frontend and backend live together or apart?**
*Question: one thing to deploy, or two?*
→ **Together, in one container.** The Python server also serves the website files. No CORS to fight, one deploy, and login cookies just work because it's all one address.

**2. Frontend**
*Question: do I need a framework that comes with its own server?*
→ **React + TypeScript, built with Vite.** Not Next.js — most of what Next gives you is its server, and FastAPI already is one.

**3. Backend**
*Question: what do I want to get good at?*
→ **Python + FastAPI.** Same stack the course teaches later, so your own code becomes your teaching material.

**4. Database**
*Question: is my data the same shape every time, and do the pieces connect to each other?*
Users, progress, steps, submissions — yes and yes.
→ **Postgres. One database, not two.**

**5. Where it lives**

| Piece | Choice |
| --- | --- |
| The app | AWS App Runner — takes a container and runs it |
| The database | AWS RDS Postgres, smallest size |
| Container storage | AWS ECR |
| Secrets | App Runner environment variables |
| Domain and HTTPS | Route 53 + ACM |
| File uploads | Nothing. We have none. |

**6. Your whole system, drawn**

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

If the diagram ever gets bigger than this, know exactly what forced it.

## SYSTEM DESIGN — IAN — what the app is

**What you're producing: one page answering four questions.**

**1. What does this app do?** One sentence, then a paragraph.

**2. What rules can't I break?** *Example: "Our cost must not go up as we get more users."*

**3. What does the server do for each thing a user does?** Make a two-column list:

| A user... | The server... |
| --- | --- |
| Reads a lesson | Does nothing — it's already in the browser |
| Runs practice code | Does nothing — the browser runs it |
| Finishes a step | Saves one small row |
| Signs in | Creates an account |

Then circle any row where the server does real work *every single time*. Those are the rows that cost money as you grow. There should be very few.

**4. What runs in the browser vs on the server?** Two lists, one line each on why it's on that side.

**Skip the database and login questions for now.** Those come tomorrow, after you've actually built them.

## KYLE BUILDS

Nothing yet. Just the learning.

## DELIVERABLES

✓ A written page: what technology we're using and why
✓ A written page: what the app does, our rules, and what the server does per user action
✓ AWS account, domain, sign-in apps, tools installed
✓ Kyle can make a basic React component

---
---

# DAY 1 — Prove it works, then build the floor

## LEARN FIRST

Nothing new. Today's spikes are the learning.

## IAN BUILDS — first, prove three risky things

Throwaway code. Delete it after. You're about to spend three days designing screens — make sure the things those screens depend on actually work.

**1. Can the browser safely run student code?**
Ask AI for a page with a text box that compiles TypeScript, runs it, shows the output, and stops it after 2 seconds.

Then **you** type this and hit run:
```js
while (true) {}
```

**Passes if:** the tab doesn't freeze and you see a timeout message.

*If this fails, student code has to run on our server, which costs money per student and kills the free model. Find out now, not on Day 6.*

**2. Can we read test results from GitHub?**
A script that asks GitHub whether the tests passed on a repo.
**Passes if:** it prints `passed` for a repo where they passed.

**3. Does sign-in work with both GitHub and Google?**
**Passes if:** you sign in with GitHub, sign out, sign in with Google, and both show up in a database.

## IAN BUILDS — the empty app

Nothing users can see yet. This is the foundation everything else sits on.

- [ ] Project created, in GitHub, first commit
- [ ] **Sign in with GitHub and Google actually works** — you click a button, you're signed in
- [ ] **Database tables created** — users, progress, step status, submissions
- [ ] **One command runs everything locally** — `docker compose up` starts the app and the database together

## IAN BUILDS — put it on the internet

In this order. Each step needs the one before it.

- [ ] Create the database on AWS, save the connection details
- [ ] Create a place to store the container image
- [ ] Build the image and push it — *this is where Docker problems appear, and they always do*
- [ ] Create the App Runner service pointing at that image
- [ ] Set the environment variables — database, sign-in keys, secrets
- [ ] Point the domain at it and turn on HTTPS
- [ ] **Update the sign-in callback URLs to the real domain**

That last step is the one everyone forgets. It's why sign-in works on your laptop and breaks the moment it's live.

**Do this today, not on Day 7.** Deploy problems have no ceiling — they can eat an entire day. Have them now, while the app is empty and nothing is at stake.

## SYSTEM DESIGN — IAN — write down the database and how sign-in works

**Do this at the end of the day, after you've built them.** You'll understand them now in a way you didn't this morning.

**What you're producing: two written pages.**

**Page 1 — the database.** For every table: what it holds, what its columns are, and how it connects to the others.

*Example:*
> **Table: users** — one row per person.
> Columns: id, email, name, github username, the name they typed on the offer letter, when they signed it.
> Connects to: progress (one user has one progress row per season), submissions (one user has many).

Then, for anything that changes over time, write the states it can be in and which changes are allowed:

> **A step** goes: `locked → active → in progress → done`
> Or: `active → skipped` (lessons only)
> **Must be impossible:** a locked step can never jump straight to done.

That last line is the important one. Write down what must never happen, and AI can enforce it.

**Page 2 — sign-in.** Write the steps in order, 1 through 5, from clicking the button to being signed in. If you can't write every step, you don't understand it yet — go back and watch the video again.

## IAN BUILDS — the design system

Since Ian owns every screen, he owns the pieces they're made of.

**Step 1 — Decide how it looks.** One page showing everything at once: the colors labeled with what each is for, the fonts at every size with real sentences, the spacing sizes, and every reusable piece in every state.

Seeing all four states of a roadmap step next to each other is the whole point. That's where you notice "active" doesn't actually look active.

**Step 2 — Turn it into CSS.** Give the page to AI and have it produce the color and font variables plus a `/styleguide` page that shows everything.

**Step 3 — Build the reusable pieces:** button, panel, card, status tag, checklist row, progress bar.

Keep `/styleguide` all week. It's how you check yourself.

## KYLE BUILDS — choose and understand the data

The story is about surface sensors. The reality is live public environmental data.

- [ ] **Pick the source.** Look at OpenAQ (air quality), USGS (earthquakes), and NOAA (weather). Compare them on: is it free, does it need a key, how often does it update, how far back does the history go, and how messy is it.
- [ ] **Pull real data with Python.** A script that calls the API and saves the response. Not a download button — actual code.
- [ ] **Write down what you found.** One page: what fields exist, what the units are, what a normal reading looks like, and — most importantly — **every way the data is broken.** Missing values, sensors that go offline, duplicate timestamps, impossible numbers.

**That last part is the real deliverable.** It decides what the entire product teaches students to handle. Clean data teaches nothing.

## DELIVERABLES

✓ Three risky things proven to work (code deleted)
✓ An app that runs on your laptop with one command
✓ **That same app live on the real domain, with working sign-in**
✓ The database and sign-in flow written down
✓ A `/styleguide` page with the full visual system and the first components
✓ A chosen data source, with real sample files and a written description

## PROVE IT

Open the real domain on your phone. Sign in with GitHub. See your own name on the screen.

---
---

# DAY 2 — The screens people see before they start

*Everything today looks finished but uses fake data. Nothing is saved yet.*

## LEARN FIRST

Nothing new.

## SYSTEM DESIGN — IAN — what each screen saves

**What you're producing: one table.**

Before either of you builds anything, decide what each screen is actually for and what it writes to the database.

| Screen | What the user gets | What we save |
| --- | --- | --- |
| Landing | Understands what this is | Nothing |
| Login | An account | The account |
| Intro | Understands the world | "They saw the intro" |
| Offer letter | Feels hired | **The name they typed, and when** |
| Meet the team | Knows who they work with | "They saw the team" |
| Connect GitHub | Understands why it matters | Their GitHub username, or "they skipped it" |
| Season brief | Knows what they'll build | "They saw the brief" |

Hand Kyle his two rows. Keep yours.

## IAN BUILDS

Each of these is a **complete, finished-looking screen** — the layout, all the words, and every button working (even if the button just goes to the next screen for now).

- [ ] **Landing** — one screenshot of the finished product, three lines of story, one button that says Apply
- [ ] **Login** — two buttons, GitHub and Google. Nothing else on the page.
- [ ] **Intro** — full screen, six to eight text frames you click through, skip button visible from the first one
- [ ] **Offer letter** ⭐ — **spend the most time here.** A real-looking document: letterhead, reference number, job title, Bunker 7, Level Four, employee #31. A signature line where they type their own name. The Accept button stays greyed out until they type something.
- [ ] **Connect GitHub** — plain English about why their work goes in a real repository, plus a real skip button that doesn't feel like a punishment

**Why the offer letter matters most:** it's the moment someone stops browsing and decides they're doing this. Everything after it works because of what happens there.

## IAN ALSO BUILDS

- [ ] **Meet the team** — three staff records: Wren, Osei, Vale. Name, job, years here, one line each. Leave the photo boxes empty and label them "ON FILE" — better than photos.
- [ ] **Season brief** — what you're responsible for, what you'll learn, what you'll have at the end. Future seasons listed but locked.

## KYLE BUILDS — the cleaning pipeline

Raw sensor data is unusable. Turn it into something a student's tool could actually read.

- [ ] **A Python script that cleans a raw file** — handles missing values, wrong types, duplicate timestamps, and readings that are physically impossible
- [ ] **Decide what each broken case should become.** Dropped? Marked? Left in with a flag? Write down the rule and why.
- [ ] **Produce clean sample files** in a simple format Ian's app can ship to students

**Write down every decision.** "We drop readings above 500 because the sensor's maximum is 500" is a sentence you'll need later — it goes straight into a lesson.

## CONTENT

Have AI draft the words for every screen built today, in the story's voice. Read all of it before it goes in. The offer letter is the one to actually rewrite by hand if anything feels off.

## DELIVERABLES

✓ Seven finished-looking screens you can click through in order
✓ An offer letter that feels like a real document
✓ Enough components in the styleguide that new screens go fast now
✓ All the words for those screens written

## PROVE IT

Click from the landing page all the way to the season brief without touching code. Does it feel like getting hired?

---
---

# DAY 3 — The screens people live in

*The most important build day. These are the screens someone sees a hundred times.*

## LEARN FIRST

Nothing new.

## SYSTEM DESIGN — IAN — how the roadmap works

**What you're producing: one page of rules.**

First, plain English: **the roadmap is the home screen. It's a list of steps going down the page. Only one step is open at a time. Everything below it is locked until you finish the one you're on.**

Now write down these five things:

**1. What kinds of steps are there?**
A step is one of:
- A **message** from Wren or Osei
- A **lesson**
- A **practice problem**
- The **ticket** (the assignment)
- The **project** (their own build)
- The **review** (Osei's feedback)
- A **story scene**

**2. What can a step look like at any moment?**
- **Locked** — greyed out, can't click it
- **Active** — the one thing you're supposed to do right now
- **Done** — finished, still clickable to reread
- **Skipped** — they said "I know this" (lessons only)

**3. What unlocks the next step?**
Finishing or skipping the one before it.

**4. What must never happen?**
- A locked step can't become done without passing through active
- The ticket, project, and review can never be skipped
- Two steps can't be active at the same time

**5. Someone comes back after two weeks. What do they see?**
Answer must be: the step they stopped on, highlighted, with one obvious button. No "welcome back" popup, no explaining.

Those five answers *are* the roadmap. The visual is just a way to show them.

## IAN BUILDS

- [ ] **The roadmap** ⭐ — **the biggest thing you'll build all week.** A vertical list of the season's steps. Every step type looks different. Every state looks different. It scrolls to the active step when it loads. There's a line at the top that says something like *"3 lessons until your first ticket."* Build both looks — the plain vertical list, and the version drawn like a cross-section of the bunker climbing toward the surface — then compare them honestly. **If the fancy one is even slightly harder to read, ship the plain one.**
- [ ] **The practice problem screen** — just the shell today. Problem on the left, code editor and output area on the right, hints collapsed at the bottom. Nothing runs yet. You're deciding the layout, not the logic.
- [ ] **The ticket** — reads like a real work request from Wren, not an assignment. Ticket number, who filed it, two or three sentences, and a checklist of what "done" means.

**One rule for the ticket:** the checklist has to use the exact same words as the tests Kyle writes later. If the checklist says "sorts by timestamp," the test is named the same thing. No surprises when they get reviewed.

## IAN ALSO BUILDS

- [ ] **The lesson player** — slides you click through. Back, next, a position indicator like `3 / 9`, and an "I know this" button that skips the whole lesson. Has to work for a lesson with 3 slides or 15.

## KYLE BUILDS — the safety score

**The most interesting engineering problem in the project, and it's his.**

The company's entire product is one number: is the surface safe. Kyle writes the code that produces it.

- [ ] **Decide what goes into the score.** Which readings matter? Over what time window? How much does one bad sensor count against the whole thing?
- [ ] **Write it in Python.** Input: a set of readings. Output: one number between 0 and 1, plus a plain-English reason.
- [ ] **Handle the hard cases.** What if half the sensors are offline? What if a reading is wildly out of range — is that danger, or a broken sensor? How do you tell the difference?
- [ ] **Test it against real data** and check that the answers are sensible.

**Write down your reasoning.** This becomes the story's logic *and* the thing students eventually rebuild themselves.

## TOGETHER — decide the practice problem format

You two work out what a practice problem is made of and how a student moves through one. Write the format down, then make one complete example, so you agree before making eleven more.

Ian owns the screen. Kyle owns the tests behind it.

## CONTENT

AI drafts Wren's messages, the ticket, and the acceptance criteria. Ian reads and fixes the voice.

## DELIVERABLES

✓ A working roadmap showing all the season's steps in the right states
✓ Two versions of it to choose between
✓ The practice problem screen laid out
✓ A ticket that reads like real work
✓ A working lesson player
✓ A written page of rules for how steps unlock
✓ An agreed format for practice problems, with one example

## PROVE IT

Look at the roadmap. Can you tell in one second what to do next? If not, fix it before tomorrow.

---
---

# DAY 4 — The last screens, and the whole thing end to end

## LEARN FIRST

Nothing new.

## SYSTEM DESIGN — IAN — how grading works

**What you're producing: one drawing and three answers.**

Draw the path from a student pushing code to Osei's review appearing:

```
Student pushes their code to GitHub
        ↓
GitHub runs the tests (on their machines, free)
        ↓
Our app asks GitHub: did it pass?
        ↓
For each test that failed, look up a comment we wrote in advance
        ↓
Show those comments as a code review
```

Then answer three questions:
- What do they see while the tests are still running?
- What do they see if a test fails and we never wrote a comment for it?
- What do they see if GitHub doesn't answer at all?

Those three answers are the states the review screen needs.

## IAN BUILDS

- [ ] **Project status** — a checklist showing which requirements pass, their repo link, and a submit button. **This is not a code editor.** The student writes code in their own editor on their own computer. This screen just shows them how they're doing.
- [ ] **Review** — the checklist with pass or fail on each item, and Osei's comments attached to the ones that failed. Two clear endings: "changes requested" or "merged."

## IAN ALSO BUILDS

- [ ] **Season complete** — the story scene first, then what they built with a link to their repo
- [ ] **Settings** — account, GitHub connection, light/dark, reset progress. One page, no tabs.
- [ ] **Help** — plain English troubleshooting for installing things and getting unstuck. Not in the story voice.
- [ ] **404** — in the story. *"This level is sealed."* One link back to the roadmap.

## KYLE BUILDS — the practice problem test cases

Now that the format is agreed, write the tests that decide whether a student's answer is right.

- [ ] **A test file per problem.** Each one checks a specific behavior and has a name that says what it checks.
- [ ] **Include the nasty cases.** A file with a missing value. A file with timestamps out of order. An empty file. A sensor that reports the same reading a thousand times.
- [ ] **Make failures explain themselves** — the message should say what was expected and what it got, never just "failed."

This is where your Day 1 list of "every way the data is broken" pays off. Each broken case becomes a test.

## TOGETHER — walk the whole thing

Click through **every screen in the app, in order, start to finish.** Both of you, at the same computer.

It's all fake, but it's whole. This is the first time you see the entire product. Fix anything that looks inconsistent right now, while you can still see it all at once.

## CONTENT

AI drafts the lessons and Osei's review comments. **Read every one of Osei's comments carefully before accepting it** — they're the thing students will remember, and generic ones are worse than none. He should be blunt about the code, never mean about the person, and always say why it matters:

> *"Your output is in file order. That's fine until a sensor uploads late, then the report is wrong. Sort on the timestamp, not the line number."*

## DELIVERABLES

✓ **Every screen in the app now exists**
✓ A written plan for how grading works
✓ All lessons drafted and reviewed
✓ Osei's review comments written
✓ The whole story written
✓ A list of anything inconsistent, found during the walkthrough

## PROVE IT

Show the click-through to someone who's never seen it. Can they tell you what the product does, without you explaining?

---
---

# DAY 5 — Make it remember things

*Every screen exists. Right now they all forget everything the moment you refresh.*

## LEARN FIRST

**Ian**
- [ ] How APIs work — requests, responses, status codes
- [ ] **What happens if the same request arrives twice** (called idempotency)

## SYSTEM DESIGN — IAN — the requests

**What you're producing: one table listing every request the app makes.**

| What it does | What it sends | What comes back | What if it arrives twice? |
| --- | --- | --- | --- |
| Get my roadmap | nothing | the steps and my progress | Fine, it's just reading |
| Finish a step | which step | its new state | **Must not count twice** |
| Save a practice attempt | the code, pass/fail, hint level | saved | Fine, it overwrites |
| Sign the offer letter | my name | saved | **Must not replace the first signature** |

That last column is why you learned idempotency last night. Every "must not" in it is a bug you just prevented before it existed.

## IAN BUILDS

- [ ] **Content loads from files** — lessons, problems, and story live as files in the project, not in the database
- [ ] **The roadmap shows real progress** — reads from the database instead of fake data
- [ ] **Finishing a step saves it and unlocks the next one**
- [ ] **Sign-in sends people to the right place** — new users into the intro, returning users straight to the roadmap
- [ ] **Onboarding saves as you go** — the signed name and the GitHub username are actually stored
- [ ] **The lesson player reads real lesson files and remembers your place**

## KYLE BUILDS — the season project test suite

**His most important deliverable.** This is what decides whether a student's finished tool is correct.

- [ ] Ian gives you the checklist from the ticket. Turn each line into a test that passes or fails.
- [ ] **Test names must match the checklist wording exactly.** If the ticket says "sorts by timestamp," the test is named the same thing. A student should never be surprised by what's checked.
- [ ] Include the broken-data cases from your Day 1 list
- [ ] Run it against a deliberately wrong solution and make sure it actually catches the problem

## DELIVERABLES

✓ An app that knows who you are and what you've done
✓ Progress that survives closing the browser
✓ A real test suite for the season project

## PROVE IT

Sign in. Sign the offer letter. Finish a lesson. Close the tab completely. Come back. You land exactly where you stopped.

---
---

# DAY 6 — The two hard features

## LEARN FIRST

**Ian**
- [ ] How the browser runs code in the background, properly this time
- [ ] How to load a big file only when it's actually needed

## SYSTEM DESIGN — IAN — running student code safely

**What you're producing: a short list of rules for the code runner.**

- Where does their code live while they're typing? *(saved in their browser, constantly, so a refresh never loses it)*
- What happens when they press Run?
- What happens when they press Check?
- What if their code never finishes? *(killed after 2 seconds, with a message that explains what happened)*
- What do they see when a test fails? *(which test, what we expected, what they got — never just "wrong")*

## IAN BUILDS — the practice runner

The hardest thing in the whole product.

- [ ] Code editor with proper syntax colors
- [ ] Their code compiles and runs **in the browser**, never on our server
- [ ] **A hard 2-second stop** — test it again with an infinite loop and make sure the tab survives
- [ ] Runs the hidden tests and shows what was expected vs what they got
- [ ] The hints work, in the format you two agreed on
- [ ] Saves what they typed constantly, so refreshing never loses work
- [ ] The compiler only downloads when they reach their first practice problem — not on every page load

## IAN BUILDS — the project pipeline

- [ ] **The starter repository** — a GitHub template with the folder structure, config, Kyle's test suite, and a README written as a handoff from Wren rather than a tutorial
- [ ] **The GitHub Actions file** — runs the tests automatically when a student pushes
- [ ] **Our app reads the result** and shows it on the project screen
- [ ] **The review screen turns failures into Osei's comments**
- [ ] **The fix-and-push-again loop works**

## KYLE BUILDS

- [ ] **Finish the remaining test cases** for every practice problem
- [ ] **Write a wrong solution on purpose and check the tests catch it.** Tests that pass everything are worse than no tests.
- [ ] **QA round one** — go through the whole app on a laptop and a phone. Write down every bug and every moment you were confused. One line each: what you did, what happened, what you expected.

## DELIVERABLES

✓ A practice problem that runs code and grades it instantly, costing nothing
✓ A real pipeline: push code → GitHub tests it → Osei reviews it → merged
✓ All practice problems finished
✓ A written bug list

## PROVE IT

Push deliberately broken code to the starter repo. Watch the tests fail. Watch Osei's comment appear. Fix it. Watch it merge.

---
---

# DAY 7 — Make it solid, then ship

## LEARN FIRST

**Ian**
- [ ] Where secrets go so they're never sitting in your code
- [ ] How to find out your app broke before a user tells you

## SYSTEM DESIGN — IAN — what happens when things break

**What you're producing: one table.** This is the last design work of the week.

| What breaks | What the app does | What the user sees |
| --- | --- | --- |
| GitHub is down | Show the last known status, try again shortly | "We'll check again in a minute." |
| Their code loops forever | Stop it after 2 seconds | "Your code ran too long. Check for a loop that never ends." |
| Database unreachable | Show an error, don't lose what they typed | "We can't save right now. Your code is safe in this browser." |
| A test fails with no comment written | Fall back to something still useful | "This check failed: [name]. Look at the test file to see what it expects." |
| They skipped GitHub, then reach the project | Block them with a way forward | "You'll need GitHub for this part. Connect it here." |

Every message says what happened and what to do about it. No error codes. No apologies.

## BOTH — be new users

Both of you go through the entire product from a brand-new account. Then do it again with another new account.

Fix everything that annoys you. There will be more than you expect.

## IAN BUILDS

- [ ] Production build working
- [ ] Secrets stored properly, never in the code
- [ ] Sign-in callback URLs pointing at the real domain
- [ ] Error alerts set up so you find out when something breaks
- [ ] Database backups turned on
- [ ] A health check so the server can report it's alive

## IAN ALSO BUILDS

- [ ] Every screen: what does it look like empty? loading? broken? with no internet?
- [ ] The roadmap, lessons, and messages work properly on a phone
- [ ] The whole app is usable with only a keyboard
- [ ] The text is actually readable — check the contrast
- [ ] Light mode doesn't look broken

## KYLE BUILDS

- [ ] **Make sure the live data still works.** Run the pipeline against the real API one more time. APIs change, rate limits appear, and finding out on launch day is the worst version of that.
- [ ] **Write the data document** — one page explaining where the data comes from, what the fields mean, how it's cleaned, and how the safety score is calculated. This goes in the repo and it's a real engineering deliverable he can show people.
- [ ] **QA round two** as a brand-new user

## THE REAL TEST

**Sit one person down who has never seen this. Watch them do Season 1. Say nothing.**

Kyle runs this — he's had less exposure to Ian's assumptions, so he'll notice things Ian can't. Write down every place the person pauses, squints, or asks a question.

That list is worth more than everything else you tested today.

## SYSTEM DESIGN — IAN — write down what you decided

**What you're producing: three short pages.**

**1. What this costs.** How much storage does one user take? How much do they download? What runs out first if 100,000 people sign up?

**2. Three decisions.** For each: what you chose, why, what else you considered, and what you gave up to get it. *These three paragraphs are what you'll say in an interview.*

**3. The three-minute explanation.** Write out how you'd explain the whole system to someone. Then close the document and say it out loud. Wherever you stumble is something you don't actually understand yet — and that's exactly where an interviewer will find you.

## DELIVERABLES

✓ A live product on a real domain
✓ Someone other than you two has finished Season 1
✓ Error alerts, backups, and failures that don't look broken
✓ Every important decision written down
✓ **A project you can talk about for twenty minutes without notes**

## PROVE IT

Send the link to someone who has never heard of it. Explain nothing. See if they get through it.

---
---

# If you fall behind

Cut in this order. Stop as soon as you're back on track.

1. Light mode
2. The intro — make it one static page instead of a sequence
3. Fewer practice problems
4. The "Ask Wren" questions on the ticket
5. Fewer lessons, but make each one denser

**Never cut these. They are the product:**
- The roadmap
- The practice runner
- The ticket
- GitHub running the tests
- Osei's review
- The offer letter

# The four things most likely to go wrong

**1. AI builds screens that each work but don't fit together.** Mismatched data, progress that doesn't save, sign-in loops. Day 5 exists for this. Deploy at the end of every day so you catch it early instead of all at once.

**2. Deploying eats an entire day if you leave it to the end.** That's why Day 1 finishes with the app already live and empty.

**3. Ian spends the week explaining instead of building.** The fix is the ownership rule: Kyle works in Python, in his own folder, producing files. He never touches Ian's code, so he can't block it and Ian never has to unblock him.

**4. AI-written content is fine but forgettable.** Read Osei's review comments and the offer letter especially closely. Those two are the difference between a product people remember and a course they finish and forget.
