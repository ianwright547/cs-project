# Git & GitHub — Complete Learning Content

Version: 1.1 · Prepared 2026-09-12 · English · Content only

**110 ordered learning activities: 90 practice tasks, 12 short quizzes, and 8 practical checkpoints.** The 49 mini lessons are embedded teaching content attached to the practice tasks; they are not 49 additional activities. The quizzes contain 36 individual multiple-choice questions in total.

This file contains learner-facing explanations, command definitions, worked examples, developer use cases, exercise instructions, starting states, hints, suggested solutions, quiz questions and answer explanations, and checkpoint completion criteria. It specifies no website design and does not change the existing prototype.

## How to use this content

- Activity IDs from version 1.0 are preserved. The ten additional practices have new IDs placed at the relevant point in the ordered path.
- Follow the activity order below. Present each mini lesson before its first practice task; keep it available for the later tasks without requiring another full read.
- Use three immediate exercises for the terminal and basic commit/staging lessons. The checkpoints and later branch, remote, and PR tasks reuse those same skills. Redundant filename-only rounds from the larger prototype have been removed.
- Practice tasks are procedural or written-response exercises as labeled. The 12 quizzes are short checks of understanding; the 8 checkpoints require observable work across several skills.
- Suggested quiz completion: at least 2 of 3 correct, followed by reviewing every missed explanation. Offer unlimited retries. A quiz result alone is not evidence of command execution.
- Suggested checkpoint completion: all listed outcomes met. Hints and example solutions are available without penalty; if a learner relies on the full solution, use a later checkpoint to check independence.
- Question options are single-answer. Keep the author answer and explanation out of the initial question display, then show the explanation after an answer.
- Do not run commands from this document automatically. They are course content for a learner-facing practice environment.

### Author implementation notes

- Each practice task starts from its own prepared state unless it explicitly names phases. Reset the exercise fixture before retrying; do not carry a learner’s previous repository state into an unrelated exercise.
- Directory names and repository names are practice examples. /workspace is a proposed training-environment root; map it consistently to your implementation.
- Short commit identifiers such as a10b111 and b20c222 are illustrative fixture labels. Seed the stated graph and substitute the actual generated Git identifiers consistently in the starting state, hints, and solution. Never require Git to create a chosen hash.
- A solution containing `<actual-B-id>` or a similar token expects the learner to obtain the identifier from that exercise’s log or reflog. Use real generated identifiers in a runnable fixture.
- The starting-state text describes repository and file conditions. It is not an executable seeding script. Provision the stated branches, commits, staged edits, remotes, and permissions before presenting a task.
- Examples under “Mini lesson” demonstrate a different case from the exercise when practical. The exercise starting state and instructions are authoritative for that task.
- Normalize line endings when checking text files, and allow descriptive commit messages unless an exact message is explicitly required. Grade repository outcomes rather than one exact command string: file content, index state, working-tree state, branch relationships, commits, and remote results. Accept equivalent safe command sequences that preserve the stated requirements.
- For authored written responses, use the stated answer criteria and model response. They are not necessarily shell commands. Label a simulated GitHub activity honestly; a simulation is not a real pull request.
- Use a POSIX-like terminal for the shell examples. Explain the chosen shell if the real implementation supports different operating systems. The $ character in transcripts is a prompt marker, not text to type.
- Do not use actual credentials in fixtures. YOUR_USERNAME and example-team are placeholders; live GitHub tasks need a real permitted repository and supported authentication.
- Keep existing dependency and GitHub Action versions when a task says to preserve the job. Pin the actual implementation’s supported versions separately; the lesson objective is the workflow behavior.
- Validate command exercises against real Git when building the grader. This deliverable supplies authored content and expected results, not a terminal engine, fixture generator, or test suite.

## Course map

| Course / unit | Topic | Practice tasks | Assessment | Total activities |
| --- | --- | ---: | --- | ---: |
| Git 1 | Finding your way around a repository | 15 | [C01](#c01) | 16 |
| Git 2 | The everyday Git workflow | 12 | [Q01](#q01) | 13 |
| Git 3 | Making useful commits | 9 | [C02](#c02) | 10 |
| Git 4 | Understanding project history | 2 | [Q02](#q02) | 3 |
| Git 5 | Undoing changes deliberately | 4 | [C03](#c03) | 5 |
| Git 6 | Working with branches | 4 | [Q03](#q03) | 5 |
| Git 7 | Merging and resolving conflicts | 3 | [C04](#c04) | 4 |
| Git 8 | Working with remote repositories | 3 | [Q04](#q04) | 4 |
| Git 9 | Keeping shared work synchronized | 4 | [Q05](#q05) | 5 |
| Git 10 | Rebasing and cleaning up commits | 4 | [Q06](#q06) | 5 |
| Git 11 | Interruptions and moving changes | 3 | [Q07](#q07) | 4 |
| Git 12 | Recovering work | 2 | [C05](#c05) | 3 |
| GitHub 1 | Understanding a GitHub repository | 2 | [Q08](#q08) | 3 |
| GitHub 2 | Starting and connecting a project | 3 | [C06](#c06) | 4 |
| GitHub 3 | Issues and project documentation | 2 | [Q09](#q09) | 3 |
| GitHub 4 | Opening a useful pull request | 3 | [Q10](#q10) | 4 |
| GitHub 5 | Participating in code review | 3 | [Q11](#q11) | 4 |
| GitHub 6 | Automated checks and workflows | 4 | [C07](#c07) | 5 |
| GitHub 7 | Getting a change merged | 3 | [Q12](#q12) | 4 |
| GitHub 8 | Contributing and shipping versions | 3 | Practice-only unit | 3 |
| GitHub 9 | Independent contribution | 2 | [C08](#c08) | 3 |

Git: 65 practice tasks, 7 quizzes, 5 checkpoints. GitHub: 25 practice tasks, 5 quizzes, 3 checkpoints.

## Ordered activity index

1. [GP001 — Find the project folder](#gp001) · practice · Git unit 1
2. [GP002 — Move up and back down](#gp002) · practice · Git unit 1
3. [GP003 — Navigate without changing the project](#gp003) · practice · Git unit 1
4. [GP004 — Create folders and files](#gp004) · practice · Git unit 1
5. [GP005 — Create a nested structure](#gp005) · practice · Git unit 1
6. [GP006 — Build a folder from memory](#gp006) · practice · Git unit 1
7. [GP007 — Write and read file contents](#gp007) · practice · Git unit 1
8. [GP008 — Append without replacing](#gp008) · practice · Git unit 1
9. [GP009 — Create, enter, write, inspect](#gp009) · practice · Git unit 1
10. [GP010 — Copy, rename, and remove practice files](#gp010) · practice · Git unit 1
11. [GP011 — Move a document into a folder](#gp011) · practice · Git unit 1
12. [GP012 — Clean up named disposable files](#gp012) · practice · Git unit 1
13. [GP013 — Start tracking an existing folder](#gp013) · practice · Git unit 1
14. [GP014 — Initialize another project](#gp014) · practice · Git unit 1
15. [GP015 — Make a prepared folder trackable](#gp015) · practice · Git unit 1
16. [C01 — Build and inspect a small folder](#c01) · checkpoint · Git unit 1
17. [GP016 — Stage your first change](#gp016) · practice · Git unit 2
18. [GP017 — Stage a different file](#gp017) · practice · Git unit 2
19. [GP018 — Create and stage a new file](#gp018) · practice · Git unit 2
20. [GP019 — Commit the prepared change](#gp019) · practice · Git unit 2
21. [GP020 — Record a new document](#gp020) · practice · Git unit 2
22. [GP021 — Commit only what is already staged](#gp021) · practice · Git unit 2
23. [GP022 — Stage is a snapshot, not a live link](#gp022) · practice · Git unit 2
24. [GP023 — Keep the later edit out for now](#gp023) · practice · Git unit 2
25. [GP024 — Include the final correction](#gp024) · practice · Git unit 2
26. [GP025 — Save another finished change](#gp025) · practice · Git unit 2
27. [GP026 — Make two checkpoints](#gp026) · practice · Git unit 2
28. [GP027 — Run the complete workflow from memory](#gp027) · practice · Git unit 2
29. [Q01 — Check your understanding: editing, staging, and committing](#q01) · quiz · Git unit 2
30. [GP028 — Keep the unfinished work out](#gp028) · practice · Git unit 3
31. [GP029 — Choose from three edited files](#gp029) · practice · Git unit 3
32. [GP030 — Split two ready files](#gp030) · practice · Git unit 3
33. [GP031 — Separate two changes in one file](#gp031) · practice · Git unit 3
34. [GP032 — Select the second hunk](#gp032) · practice · Git unit 3
35. [GP033 — Make two commits from three hunks](#gp033) · practice · Git unit 3
36. [GP034 — Keep local files out of history](#gp034) · practice · Git unit 3
37. [GP035 — Add another ignored folder](#gp035) · practice · Git unit 3
38. [GP036 — Keep source, ignore generated output](#gp036) · practice · Git unit 3
39. [C02 — Make focused commits from a mixed working folder](#c02) · checkpoint · Git unit 3
40. [GP037 — Find the change that caused confusion](#gp037) · practice · Git unit 4
41. [GP038 — Inspect an older version without editing it](#gp038) · practice · Git unit 4
42. [Q02 — Check your understanding: reading history](#q02) · quiz · Git unit 4
43. [GP039 — Unstage without losing your edit](#gp039) · practice · Git unit 5
44. [GP040 — Improve the last local commit message](#gp040) · practice · Git unit 5
45. [GP041 — Undo a local commit boundary but keep the work](#gp041) · practice · Git unit 5
46. [GP042 — Reverse a shared mistake](#gp042) · practice · Git unit 5
47. [C03 — Unstage, commit, and reverse the right change](#c03) · checkpoint · Git unit 5
48. [GP043 — Start a documentation branch](#gp043) · practice · Git unit 6
49. [GP057 — Create a branch and a new document](#gp057) · practice · Git unit 6
50. [GP044 — Compare before you switch tasks](#gp044) · practice · Git unit 6
51. [GP058 — Compare a new document](#gp058) · practice · Git unit 6
52. [Q03 — Check your understanding: branches](#q03) · quiz · Git unit 6
53. [GP045 — Merge a completed branch](#gp045) · practice · Git unit 7
54. [GP046 — Resolve competing README instructions](#gp046) · practice · Git unit 7
55. [GP059 — Combine two useful lines](#gp059) · practice · Git unit 7
56. [C04 — Combine two branches and finish the merge](#c04) · checkpoint · Git unit 7
57. [GP047 — Clone a prepared remote](#gp047) · practice · Git unit 8
58. [GP048 — Publish a new branch](#gp048) · practice · Git unit 8
59. [GP060 — Publish another branch](#gp060) · practice · Git unit 8
60. [Q04 — Check your understanding: local and remote repositories](#q04) · quiz · Git unit 8
61. [GP049 — Inspect updates before integrating](#gp049) · practice · Git unit 9
62. [GP061 — Inspect one incoming commit](#gp061) · practice · Git unit 9
63. [GP050 — Handle a rejected push](#gp050) · practice · Git unit 9
64. [GP062 — Combine two documentation contributions](#gp062) · practice · Git unit 9
65. [Q05 — Check your understanding: synchronization](#q05) · quiz · Git unit 9
66. [GP051 — Rebase an unpublished branch](#gp051) · practice · Git unit 10
67. [GP063 — Rebase a second unpublished branch](#gp063) · practice · Git unit 10
68. [GP052 — Squash small unpublished corrections](#gp052) · practice · Git unit 10
69. [GP064 — Combine two drafting commits](#gp064) · practice · Git unit 10
70. [Q06 — Check your understanding: rebase and squash](#q06) · quiz · Git unit 10
71. [GP053 — Pause work for an urgent fix](#gp053) · practice · Git unit 11
72. [GP065 — Pause two new files](#gp065) · practice · Git unit 11
73. [GP054 — Bring across one specific fix](#gp054) · practice · Git unit 11
74. [Q07 — Check your understanding: stash and cherry-pick](#q07) · quiz · Git unit 11
75. [GP055 — Recover a commit after an accidental reset](#gp055) · practice · Git unit 12
76. [GP056 — Keep work made on a detached HEAD](#gp056) · practice · Git unit 12
77. [C05 — Recover a commit and return to useful work](#c05) · checkpoint · Git unit 12
78. [HP001 — Find your way around the repository](#hp001) · practice · GitHub unit 1
79. [HP002 — Read the pull request difference](#hp002) · practice · GitHub unit 1
80. [Q08 — Check your understanding: repository navigation](#q08) · quiz · GitHub unit 1
81. [HP003 — Create your project from the template](#hp003) · practice · GitHub unit 2
82. [HP004 — Start a notes repository](#hp004) · practice · GitHub unit 2
83. [HP005 — Diagnose a push permission problem](#hp005) · practice · GitHub unit 2
84. [C06 — Create, clone, and publish a first branch](#c06) · checkpoint · GitHub unit 2
85. [HP006 — Turn a vague bug into an issue](#hp006) · practice · GitHub unit 3
86. [HP007 — Put documentation where people can find it](#hp007) · practice · GitHub unit 3
87. [Q09 — Check your understanding: issues and documentation](#q09) · quiz · GitHub unit 3
88. [HP008 — Open a focused pull request](#hp008) · practice · GitHub unit 4
89. [HP009 — Propose the help documentation](#hp009) · practice · GitHub unit 4
90. [HP010 — Catch the wrong base branch](#hp010) · practice · GitHub unit 4
91. [Q10 — Check your understanding: pull requests](#q10) · quiz · GitHub unit 4
92. [HP011 — Respond to a requested change](#hp011) · practice · GitHub unit 5
93. [HP012 — Add a requested help example](#hp012) · practice · GitHub unit 5
94. [HP013 — Write a review someone can act on](#hp013) · practice · GitHub unit 5
95. [Q11 — Check your understanding: review and revision](#q11) · quiz · GitHub unit 5
96. [HP014 — Follow a failing check to the cause](#hp014) · practice · GitHub unit 6
97. [HP015 — Identify an installation failure](#hp015) · practice · GitHub unit 6
98. [HP016 — Run tests on pull requests too](#hp016) · practice · GitHub unit 6
99. [HP017 — Add PR checks to a second workflow](#hp017) · practice · GitHub unit 6
100. [C07 — Read a failure, update a workflow, and verify the new run](#c07) · checkpoint · GitHub unit 6
101. [HP018 — Understand why merging is blocked](#hp018) · practice · GitHub unit 7
102. [HP019 — Squash merge and synchronize locally](#hp019) · practice · GitHub unit 7
103. [HP020 — Finish another squash-merged PR](#hp020) · practice · GitHub unit 7
104. [Q12 — Check your understanding: completing the merge](#q12) · quiz · GitHub unit 7
105. [HP021 — Contribute through your fork](#hp021) · practice · GitHub unit 8
106. [HP025 — Set up another fork](#hp025) · practice · GitHub unit 8
107. [HP022 — Mark a tested version](#hp022) · practice · GitHub unit 8
108. [HP023 — Take an issue through the whole workflow](#hp023) · practice · GitHub unit 9
109. [HP024 — Finish a contribution with two obstacles](#hp024) · practice · GitHub unit 9
110. [C08 — Complete a reviewed contribution independently](#c08) · checkpoint · GitHub unit 9

# Course: Git

## Git unit 1: Finding your way around a repository

<a id="git-1-1"></a>

### Mini lesson: Where am I in the terminal?

Content ID: `git-1-1`

A terminal lets you work with files by typing commands. Every command starts in a particular folder, called your current directory. Before working on a project, you need to find that folder and move into it.

#### Commands and concepts

```text
pwd
```

Short for “print working directory.” It displays the full path of the folder you are in. It does not change anything.

```text
ls
```

Short for “list.” It shows the files and folders inside your current directory.

```text
cd website
```

Short for “change directory.” This moves you into a folder named website. Replace website with the folder you want to open.

```text
cd ..
```

Move to the parent directory: the folder containing your current folder. The two dots mean parent; one dot means the current directory.

```text
cd /workspace/website
```

An absolute path starts at the filesystem root /. A relative path, such as cd docs, starts from your current directory.

```text
git status
```

Asks Git which branch you are on and whether files have changed. Run it from inside a Git repository.

#### Worked example

```text
$ pwd
/workspace
$ ls
notes  website
$ cd website
$ pwd
/workspace/website

# $ represents the terminal prompt. Do not type the $ character.
```

#### When a developer uses this

A developer might have several projects on one computer. Checking the folder first helps them avoid running a command in the wrong project. If Git says “not a git repository,” checking pwd is a useful first step.

Reference: [Official documentation](https://git-scm.com/book/en/v2/Getting-Started-The-Command-Line)

<a id="gp001"></a>

### GP001 — Find the project folder

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Where am I in the terminal?](#git-1-1)

**Starting state**

```text
$ pwd
/workspace
$ ls
notes  sample-app

# sample-app is already a Git repository with a clean main branch.
```

**File contents or supporting context**

```text
sample-app/
  README.md
  sensors.json
```

**Instructions**

1. Print the current directory.
2. List the folders and enter sample-app.
3. Ask Git for the repository status.

**Completion criteria**

You are in /workspace/sample-app, on main, and can confirm there are no pending changes.

**Hint**

Use pwd, ls, cd, then git status.

**Author answer / one acceptable approach**

```text
pwd
ls
cd sample-app
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="gp002"></a>

### GP002 — Move up and back down

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Where am I in the terminal?](#git-1-1)

**Starting state**

```text
Current folder: /workspace/shop/docs
/workspace/shop contains docs/ and api/.
```

**Instructions**

1. Print your current location.
2. Move to the parent folder and list its contents.
3. Enter api and print your new location.

**Completion criteria**

Your final location is /workspace/shop/api.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
pwd
cd ..
ls
cd api
pwd
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="gp003"></a>

### GP003 — Navigate without changing the project

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Where am I in the terminal?](#git-1-1)

**Starting state**

```text
Current folder: /workspace/shop/api
/workspace/blog is an existing repository on main with no pending changes.
```

**Instructions**

1. Move from the current folder to /workspace/blog using an absolute path.
2. List its files and ask Git for its status.
3. Return to /workspace and verify your location.

**Completion criteria**

You inspected blog and ended in /workspace; no files changed.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
cd /workspace/blog
ls
git status
cd ..
pwd
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="git-1-files"></a>

### Mini lesson: Create folders and files

Content ID: `git-1-files`

A folder organizes files. A file stores content. In a terminal you can create both without opening a graphical file manager. These are shell commands, so they work before you initialize Git.

#### Commands and concepts

```text
mkdir docs
```

Make a directory named docs inside the current folder. mkdir means “make directory.”

```text
mkdir -p docs/guides
```

Create a nested path and any missing parent folders. -p also avoids an error when the directory already exists.

```text
touch README.md
```

Create an empty file if it does not exist. For an existing file, touch updates timestamps without erasing its contents.

```text
touch notes.txt todo.txt
```

Create more than one file by separating their names with spaces.

```text
ls docs
```

List the contents of a named folder without moving into it.

#### Worked example

```text
pwd
mkdir website
cd website
mkdir docs
touch README.md docs/setup.md
ls
ls docs
```

#### When a developer uses this

A developer can prepare a project’s folders and documentation files before writing code. Git tracks files, so an empty directory by itself does not appear in Git history.

Reference: [Official documentation](https://www.gnu.org/software/coreutils/manual/coreutils.html)

<a id="gp004"></a>

### GP004 — Create folders and files

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Create folders and files](#git-1-files)

**Starting state**

```text
Current folder: /workspace
Existing folders: archive
journal does not exist.
```

**File contents or supporting context**

```text
Target:
journal/
  README.md
  docs/
    setup.md
```

**Instructions**

1. Starting in /workspace, create a folder named journal.
2. Enter journal and create a docs folder.
3. Create an empty README.md and an empty docs/setup.md.
4. List the project folder and docs to verify both files.

**Completion criteria**

journal contains README.md and docs/setup.md, and your current folder is /workspace/journal.

**Hint**

Review the command explanations above, then compare each requested result with your commands.

**Author answer / one acceptable approach**

```text
mkdir journal
cd journal
mkdir docs
touch README.md docs/setup.md
ls
ls docs
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="gp005"></a>

### GP005 — Create a nested structure

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Create folders and files](#git-1-files)

**Starting state**

```text
Current folder: /workspace
app does not exist.
```

**Instructions**

1. Create app/docs/guides, including missing parents.
2. Create app/README.md and app/docs/guides/install.md.
3. Inspect the created files without changing directories.

**Completion criteria**

Both requested files exist at the specified paths.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
mkdir -p app/docs/guides
touch app/README.md app/docs/guides/install.md
ls app
ls app/docs/guides
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="gp006"></a>

### GP006 — Build a folder from memory

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Create folders and files](#git-1-files)

**Starting state**

```text
Current folder: /workspace
recipes does not exist.
```

**Instructions**

1. Create a folder named recipes and enter it.
2. Create a notes folder, an empty README.md, and empty notes/ideas.txt.
3. Verify the files and return to /workspace.

**Completion criteria**

The recipes structure is complete and your final folder is /workspace.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
mkdir recipes
cd recipes
mkdir notes
touch README.md notes/ideas.txt
ls
ls notes
cd ..
pwd
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="git-1-content"></a>

### Mini lesson: Write and read file contents

Content ID: `git-1-content`

Creating an empty file is different from writing content into it. You can edit a file in the editor or write a short line using the shell, then read it back to check your work.

#### Commands and concepts

```text
echo "Hello"
```

Print the supplied text. Quotes keep its words together.

```text
echo "Hello" > notes.txt
```

Write the text into notes.txt, creating the file or replacing its existing content. > redirects output to a file.

```text
echo "Another line" >> notes.txt
```

Append a line instead of replacing the file. The double >> matters.

```text
cat notes.txt
```

Display the file’s contents. cat is short for concatenate and can also combine multiple files.

#### Worked example

```text
echo "# Reading list" > README.md
echo "Books to read this month." >> README.md
cat README.md

# Output:
# Reading list
Books to read this month.
```

#### When a developer uses this

A developer can create a short README or append a test note without leaving the terminal. Reading the file afterward catches an accidental overwrite before the change is committed.

Reference: [Official documentation](https://www.gnu.org/software/coreutils/manual/coreutils.html)

<a id="gp007"></a>

### GP007 — Write and read file contents

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Write and read file contents](#git-1-content)

**Starting state**

```text
Current folder: /workspace/journal
README.md does not exist.
```

**File contents or supporting context**

```text
Target contents:
# Journal
Notes from daily practice.
```

**Instructions**

1. Create README.md containing the line “# Journal”.
2. Append “Notes from daily practice.” on a new line.
3. Display the file and confirm both lines remain.

**Completion criteria**

README.md has the heading followed by the description, with neither line lost.

**Hint**

Review the command explanations above, then compare each requested result with your commands.

**Author answer / one acceptable approach**

```text
echo "# Journal" > README.md
echo "Notes from daily practice." >> README.md
cat README.md
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="gp008"></a>

### GP008 — Append without replacing

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Write and read file contents](#git-1-content)

**Starting state**

```text
Current folder: /workspace/practice
checklist.txt contains one line: Inspect the diff.
```

**Instructions**

1. Add “Run tests before committing.” as a second line of checklist.txt.
2. Read the file and confirm the existing first line remains.

**Completion criteria**

checklist.txt contains both the original and appended lines.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
echo "Run tests before committing." >> checklist.txt
cat checklist.txt
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="gp009"></a>

### GP009 — Create, enter, write, inspect

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Write and read file contents](#git-1-content)

**Starting state**

```text
Current folder: /workspace
guide does not exist.
```

**Instructions**

1. Create a folder named guide and enter it.
2. Create an empty setup.txt using touch.
3. Write “Install dependencies.” to setup.txt, then append “Run tests.”
4. Display the file and verify your current folder.

**Completion criteria**

setup.txt has both instructions and you are in /workspace/guide.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
mkdir guide
cd guide
touch setup.txt
echo "Install dependencies." > setup.txt
echo "Run tests." >> setup.txt
cat setup.txt
pwd
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="git-1-organize"></a>

### Mini lesson: Copy, rename, and remove practice files

Content ID: `git-1-organize`

File organization is part of working in a repository. Copying keeps the source, moving relocates or renames it, and removing deletes it. These exercises use disposable files in a prepared practice folder.

#### Commands and concepts

```text
cp notes.txt backup.txt
```

Copy notes.txt to backup.txt and keep the original. An existing destination can be overwritten, so inspect names first.

```text
mv draft.txt docs/guide.txt
```

Move or rename a file. The source path disappears after a successful move.

```text
rm scratch.txt
```

Remove this file. This shell command does not put it in the system trash. Use it only for the named disposable exercise file.

```text
rmdir empty-folder
```

Remove an empty directory; it refuses to remove a directory containing files.

```text
ls
```

Inspect the result. Use cat when you also need to verify file contents.

#### Worked example

```text
cp notes.txt notes-backup.txt
mv draft.txt guide.txt
rm scratch.txt
ls

# notes.txt and notes-backup.txt both remain.
# guide.txt replaces the old name draft.txt.
```

#### When a developer uses this

A developer can rename an unclear document, preserve a useful copy, and remove a temporary scratch file. Reviewing the resulting Git diff later makes those file changes visible before committing.

Reference: [Official documentation](https://www.gnu.org/software/coreutils/manual/coreutils.html)

<a id="gp010"></a>

### GP010 — Copy, rename, and remove practice files

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Copy, rename, and remove practice files](#git-1-organize)

**Starting state**

```text
Current folder: /workspace/practice
Files: notes.txt, draft.txt, scratch.txt
notes.txt contains: Review branches
draft.txt contains: Installation guide
scratch.txt is empty and disposable.
```

**File contents or supporting context**

```text
Expected files: notes.txt, notes-backup.txt, guide.txt
```

**Instructions**

1. Copy notes.txt to notes-backup.txt.
2. Rename draft.txt to guide.txt.
3. Remove only scratch.txt, which is disposable.
4. List the remaining files and verify the backup contents match notes.txt.

**Completion criteria**

Both note files remain with the same content; guide.txt exists; draft.txt and scratch.txt do not.

**Hint**

Review the command explanations above, then compare each requested result with your commands.

**Author answer / one acceptable approach**

```text
cp notes.txt notes-backup.txt
mv draft.txt guide.txt
rm scratch.txt
ls
cat notes.txt notes-backup.txt
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="gp011"></a>

### GP011 — Move a document into a folder

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Copy, rename, and remove practice files](#git-1-organize)

**Starting state**

```text
Current folder: /workspace/practice
Only guide.txt exists; its contents are “Setup notes”.
```

**Instructions**

1. Create docs.
2. Move guide.txt into docs, preserving its name.
3. Copy docs/guide.txt to docs/guide-copy.txt.
4. Inspect both documents.

**Completion criteria**

docs contains two copies of the guide and the original root-level path is absent.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
mkdir docs
mv guide.txt docs/guide.txt
cp docs/guide.txt docs/guide-copy.txt
ls docs
cat docs/guide.txt docs/guide-copy.txt
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="gp012"></a>

### GP012 — Clean up named disposable files

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Copy, rename, and remove practice files](#git-1-organize)

**Starting state**

```text
Current folder: /workspace/practice
Files: notes.txt, draft.tmp
Folders: temp/ (empty), docs/ (contains guide.txt)
notes.txt contains “Plan the change”. Only draft.tmp and temp are disposable.
```

**Instructions**

1. Remove draft.tmp only.
2. Remove the empty temp folder.
3. Rename notes.txt to planning.txt and verify its contents.

**Completion criteria**

planning.txt is intact; docs/guide.txt is untouched; the two disposable items are gone.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
rm draft.tmp
rmdir temp
mv notes.txt planning.txt
ls
cat planning.txt
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="git-1-2"></a>

### Mini lesson: Turn a folder into a repository

Content ID: `git-1-2`

A Git repository stores a project’s version history. An ordinary folder becomes a repository when Git adds its tracking metadata. Creating the repository does not save the first version of your files—you will learn to do that with a commit.

#### Commands and concepts

```text
git init -b main
```

Initialize a repository in the current folder. -b names its first branch; here, that name is main. Git creates a hidden .git directory.

```text
git config user.name "Alex Developer"
```

Set the author name Git will use for commits in this repository.

```text
git config user.email "alex@example.com"
```

Set the author email. Without --global, these settings apply only to this repository.

```text
git status
```

Inspect the new repository. Untracked means Git has not yet included a file in its version history.

#### Worked example

```text
$ git init -b main
Initialized empty Git repository in /workspace/website/.git/

$ git status
On branch main
No commits yet
Untracked files:
  README.md
```

#### When a developer uses this

A developer starting a new website can initialize its existing folder and begin saving versions. If they clone an existing repository instead, Git has already initialized the clone.

Reference: [Official documentation](https://git-scm.com/docs/git-init)

<a id="gp013"></a>

### GP013 — Start tracking an existing folder

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Turn a folder into a repository](#git-1-2)

**Starting state**

```text
$ pwd
/workspace/sample-app
$ ls
README.md
# No repository exists here yet.
```

**File contents or supporting context**

```text
# Sensor notes
Observations from the sample dataset.
```

**Instructions**

1. Initialize this folder with main as its initial branch.
2. Configure a name and email for this repository only, using example values.
3. Inspect status and identify the untracked file.

**Completion criteria**

The folder is a repository on main with README.md untracked and no commits.

**Hint**

Use git init -b main. Omit --global to keep identity settings local.

**Author answer / one acceptable approach**

```text
git init -b main
git config user.name "Practice Learner"
git config user.email "learner@example.com"
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp014"></a>

### GP014 — Initialize another project

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Turn a folder into a repository](#git-1-2)

**Starting state**

```text
Current folder: /workspace
reading-list does not exist.
```

**Instructions**

1. Create a folder named reading-list and enter it.
2. Initialize Git on main and set repository-local example author details.
3. Create README.md and inspect its status.

**Completion criteria**

A new repository on main reports README.md as untracked; no commit exists.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
mkdir reading-list
cd reading-list
git init -b main
git config user.name "Practice Learner"
git config user.email "learner@example.com"
touch README.md
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp015"></a>

### GP015 — Make a prepared folder trackable

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Turn a folder into a repository](#git-1-2)

**Starting state**

```text
Current folder: /workspace
library/ contains README.md and books.json; it has no .git directory.
```

**Instructions**

1. Enter the existing library folder.
2. Initialize Git on main and configure a local example name and email.
3. Inspect status and name both untracked files.

**Completion criteria**

README.md and books.json are untracked in the new repository.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
cd library
git init -b main
git config user.name "Practice Learner"
git config user.email "learner@example.com"
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="c01"></a>

### C01 — Checkpoint: Build and inspect a small folder

Type: practical checkpoint · Completion: every listed outcome met · Unlimited retries.

**What this checks**

Use the terminal to locate, create, inspect, and organize files, then initialize a repository. Choose the commands yourself; the target structure tells you what to produce.

Reuses: [Where am I in the terminal?](#git-1-1), [Create folders and files](#git-1-files), [Write and read file contents](#git-1-content), [Copy, rename, and remove practice files](#git-1-organize), [Turn a folder into a repository](#git-1-2)

**Prepared starting state**

```text
Current directory: /workspace
Existing directory: archive/ containing keep.txt (must remain unchanged)
No journal directory exists. No Git repository exists in /workspace.
All files created within journal for this checkpoint are disposable practice data.
```

**Learner instructions**

1. Create journal inside /workspace and enter it.
2. Create docs/ and an empty temp/ folder.
3. Create README.md containing “# Journal”, followed by “Daily development notes.” on a second line.
4. Create docs/setup.txt containing “Install dependencies.” and copy it to docs/setup-backup.txt.
5. Rename docs/setup.txt to docs/start.txt. Remove the empty temp/ folder.
6. Initialize a Git repository on main and set repository-local example author details.
7. Inspect the file contents and repository status. Do not stage or commit yet.

**Completion criteria / author verification rubric**

- Current directory is /workspace/journal.
- README.md contains the exact two required lines.
- docs/start.txt and docs/setup-backup.txt both contain “Install dependencies.”
- docs/setup.txt and temp/ no longer exist.
- archive/keep.txt remains unchanged.
- journal is a Git repository on main with a local example identity, no commits, and the three requested files untracked.

**Progressive hints**

1. Work from the target structure: create the parent, enter it, then create its children.
2. Use > for a new file’s first line and >> to append the second; inspect with cat.
3. Use cp before mv, rmdir for the empty folder, and git init -b main only after entering journal.

**Author answer / one acceptable approach**

```text
pwd
mkdir journal
cd journal
mkdir docs temp
echo "# Journal" > README.md
echo "Daily development notes." >> README.md
echo "Install dependencies." > docs/setup.txt
cp docs/setup.txt docs/setup-backup.txt
mv docs/setup.txt docs/start.txt
rmdir temp
git init -b main
git config user.name "Practice Learner"
git config user.email "learner@example.com"
pwd
ls
ls docs
cat README.md docs/start.txt docs/setup-backup.txt
git status
```

**Targeted feedback**

- **README has only one line:** The second write replaced the first. Restore both lines and use >> when appending.
- **Repository initialized in /workspace:** Check pwd and enter journal before initializing. The repository belongs inside the project folder.
- **Backup is missing:** cp keeps the source and creates a second file; mv only relocates or renames it.

## Git unit 2: The everyday Git workflow

<a id="git-2-1"></a>

### Mini lesson: Choose changes with the staging area

Content ID: `git-2-1`

Git separates editing from recording history. Your working directory contains the files you are editing. The staging area holds the file contents selected for the next commit. A commit records that staged snapshot.

#### Commands and concepts

```text
git diff
```

Show edits that have not been staged. Lines beginning with - are removed; lines beginning with + are added. Those signs describe the difference and are not part of the file.

```text
git add README.md
```

Copy the current contents of README.md into the staging area. This selects the change; it does not create a commit.

```text
git diff --staged
```

Show how the staged contents differ from the last commit. Use this to review what the next commit will record.

#### Worked example

```text
$ git diff
-Install the depedencies.
+Install the dependencies.

$ git add README.md
$ git diff --staged
-Install the depedencies.
+Install the dependencies.
```

#### When a developer uses this

A developer may edit several files while investigating a bug. Staging lets them save the finished fix separately from an unfinished experiment.

Reference: [Official documentation](https://git-scm.com/docs/git-add)

<a id="gp016"></a>

### GP016 — Stage your first change

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Choose changes with the staging area](#git-2-1)

**Starting state**

```text
$ git status --short
 M README.md
$ git diff
-Read the senor data.
+Read the sensor data.
```

**File contents or supporting context**

```text
Read the sensor data.
```

**Instructions**

1. Inspect the README difference.
2. Stage README.md.
3. Inspect the staged difference and repository status.

**Completion criteria**

The spelling correction is staged, but no new commit exists.

**Hint**

git diff shows unstaged edits; git diff --staged shows the next commit’s staged changes.

**Author answer / one acceptable approach**

```text
git diff
git add README.md
git diff --staged
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp017"></a>

### GP017 — Stage a different file

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Choose changes with the staging area](#git-2-1)

**Starting state**

```text
Current folder: /workspace/practice (existing repository)
notes.txt changes “Chek status” to “Check status”. Nothing is staged.
```

**Instructions**

1. Inspect the changes to notes.txt.
2. Stage notes.txt and inspect the staged patch.
3. Stop before committing.

**Completion criteria**

The correction is staged and no commit was created.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git diff -- notes.txt
git add notes.txt
git diff --staged
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp018"></a>

### GP018 — Create and stage a new file

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Choose changes with the staging area](#git-2-1)

**Starting state**

```text
Existing repository on main, clean. todo.txt does not exist.
```

**Instructions**

1. Create todo.txt with the line “Review the README”.
2. Inspect status, then stage the new file.
3. Inspect the staged patch and stop before committing.

**Completion criteria**

The new todo.txt and its one line are staged.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
echo "Review the README" > todo.txt
git status
git add todo.txt
git diff --staged
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="git-2-2"></a>

### Mini lesson: Record a change with a commit

Content ID: `git-2-2`

A commit is a recorded snapshot of tracked project content, connected to earlier history. It includes information such as an author and message. With the usual workflow, Git records what is staged, not every edit in the folder.

#### Commands and concepts

```text
git commit -m "Fix installation spelling"
```

Create a commit from the staging area. -m supplies the message; quotes keep the words together as one argument.

```text
git log -1 --stat
```

Show the latest commit. -1 limits the output to one commit; --stat adds a summary of the files changed.

```text
git status
```

Check whether any staged, unstaged, or untracked work remains. A clean working tree means there are no pending tracked-file changes or untracked files reported by ordinary status.

#### Worked example

```text
$ git diff --staged
-Install the depedencies.
+Install the dependencies.
$ git commit -m "Fix installation spelling"
[main a1b2c3d] Fix installation spelling
```

#### When a developer uses this

A developer can commit a finished fix before starting another task. Later, the message helps them find the fix, and the commit gives them a specific version to inspect or reverse. Committing locally does not upload it to GitHub.

Reference: [Official documentation](https://git-scm.com/docs/git-commit)

<a id="gp019"></a>

### GP019 — Commit the prepared change

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Record a change with a commit](#git-2-2)

**Starting state**

```text
$ git status --short
M  README.md
$ git diff --staged
-Read the senor data.
+Read the sensor data.
```

**File contents or supporting context**

```text
Read the sensor data.
```

**Instructions**

1. Review the staged difference.
2. Create a commit with a message describing the typo fix.
3. Inspect the latest commit and confirm a clean working tree.

**Completion criteria**

The latest commit contains only the README typo fix; no edits remain.

**Hint**

Use git commit -m, then git log -1 and git status.

**Author answer / one acceptable approach**

```text
git diff --staged
git commit -m "Fix sensor typo in README"
git log -1 --stat
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp020"></a>

### GP020 — Record a new document

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Record a change with a commit](#git-2-2)

**Starting state**

```text
Existing repository. guide.txt is staged as a new file containing “Install dependencies, then run tests.” No other changes.
```

**Instructions**

1. Inspect the staged contents of guide.txt.
2. Commit with a message describing the new setup guide.
3. Inspect the latest commit and working tree.

**Completion criteria**

The new guide is in the latest commit and the working tree is clean.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git diff --staged
git commit -m "Add setup guide"
git log -1 --stat
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp021"></a>

### GP021 — Commit only what is already staged

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Record a change with a commit](#git-2-2)

**Starting state**

```text
README.md: spelling correction staged.
notes.txt: unfinished unstaged edit “Investigate settings”.
```

**Instructions**

1. Review the staged typo correction.
2. Commit it without staging any other files.
3. Inspect history and report which edit still remains.

**Completion criteria**

README correction is committed; notes.txt remains edited and unstaged.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git diff --staged
git commit -m "Fix README spelling"
git log -1 --stat
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="git-2-3"></a>

### Mini lesson: Editing after staging

Content ID: `git-2-3`

git add captures a file at the moment you run it. The staging area does not keep following the file as you edit. A file can therefore have one version staged and newer edits still unstaged.

#### Commands and concepts

```text
git diff --staged
```

Read the changes already selected for the next commit.

```text
git diff
```

Read the later edits that have not been selected yet.

```text
git add README.md
```

Stage the file again when you want the later edits included too.

```text
git status --short
```

Show compact status. The first column describes staged changes; the second describes working-directory changes. MM means both columns report a modification.

#### Worked example

```text
Edit 1: add an installation command.
Run git add README.md.
Edit 2: add a testing command.

Commit now → the installation addition is included.
Stage again, then commit → both additions are included.
```

#### When a developer uses this

A developer may review and stage a fix, then notice one more typo. Understanding this distinction prevents them from assuming that the final correction was included automatically.

Reference: [Official documentation](https://git-scm.com/docs/git-add)

<a id="gp022"></a>

### GP022 — Stage is a snapshot, not a live link

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Editing after staging](#git-2-3)

**Starting state**

```text
$ git status --short
MM README.md
$ git diff --staged
+Read the sensor data.
$ git diff
+Check the timestamp first.
```

**File contents or supporting context**

```text
Read the sensor data.
Check the timestamp first.
```

**Instructions**

1. Compare the staged and unstaged differences.
2. Explain which sentence a commit would include now.
3. Include both sentences in one commit, then verify the result.

**Completion criteria**

The commit includes both new sentences and the working tree is clean.

**Hint**

Stage README.md again to include the later edit.

**Author answer / one acceptable approach**

```text
git diff --staged
git diff
# Before restaging, only the first new sentence would be committed.
git add README.md
git diff --staged
git commit -m "Document sensor reading checks"
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp023"></a>

### GP023 — Keep the later edit out for now

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Editing after staging](#git-2-3)

**Starting state**

```text
guide.txt staged addition: “Install dependencies.”
guide.txt later unstaged addition: “Run tests.”
The requirement is to record only the installation instruction now.
```

**Instructions**

1. Inspect staged and unstaged versions of guide.txt.
2. Commit only the already-staged installation line.
3. Verify the testing line remains unstaged.

**Completion criteria**

The first addition is committed and the second remains unstaged.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git diff --staged
git diff
git commit -m "Document installation"
git status
git diff -- guide.txt
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp024"></a>

### GP024 — Include the final correction

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Editing after staging](#git-2-3)

**Starting state**

```text
notes.txt staged text: “Reveiw changes.”
notes.txt current working text: “Review changes.”
No other changes.
```

**Instructions**

1. Compare the staged and working-file changes.
2. Update staging to include the corrected spelling.
3. Commit and verify that the typo never enters the new commit.

**Completion criteria**

The commit contains “Review changes.” and the working tree is clean.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git diff --staged
git diff
git add notes.txt
git diff --staged
git commit -m "Add review reminder"
git show HEAD
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="git-2-4"></a>

### Mini lesson: Repeat the inspect → stage → commit routine

Content ID: `git-2-4`

The same small workflow works across different files. Read the change, select it, inspect the selection, record it, and verify the result. The file format changes; the Git routine stays the same.

#### Commands and concepts

```text
git diff
```

Read the unstaged changes before deciding to save them.

```text
git add products.json
```

Stage the selected file. Replace this example path with the file named in the instructions.

```text
git diff --staged
```

Confirm the staged change matches your intention.

```text
git commit -m "Correct product display name"
```

Record the change with a message describing its purpose.

```text
git show --stat HEAD
```

Inspect a summary of the current commit. HEAD normally points to the current branch’s latest commit.

#### Worked example

```text
git diff
git add products.json
git diff --staged
git commit -m "Correct product display name"
git show --stat HEAD
git status
```

#### When a developer uses this

A developer uses this routine for documentation, configuration, tests, and application code. Practicing it with simple files lets you focus on Git without needing to solve a programming problem first.

Reference: [Official documentation](https://git-scm.com/docs)

<a id="gp025"></a>

### GP025 — Save another finished change

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Repeat the inspect → stage → commit routine](#git-2-4)

**Starting state**

```text
$ git status --short
 M sensors.json
$ git diff
-  "name": "North senor"
+  "name": "North sensor"
```

**File contents or supporting context**

```text
{ "name": "North sensor" }
```

**Instructions**

1. Inspect the prepared change to sensors.json.
2. Commit only this correction with a descriptive message.
3. Verify the commit and working tree.

**Completion criteria**

History records the corrected name, and no edits remain.

**Hint**

Reuse the inspection → staging → commit → verification workflow.

**Author answer / one acceptable approach**

```text
git diff
git add sensors.json
git diff --staged
git commit -m "Correct north sensor display name"
git show --stat HEAD
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="gp026"></a>

### GP026 — Make two checkpoints

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Repeat the inspect → stage → commit routine](#git-2-4)

**Starting state**

```text
Existing repository on main, clean. todo.txt does not exist.
```

**Instructions**

1. Create todo.txt containing “Read the requirements.” and commit it.
2. Append “Inspect the diff.” and make a second commit.
3. Verify both commits and a clean working tree.

**Completion criteria**

Two distinct commits exist; todo.txt contains both lines.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
echo "Read the requirements." > todo.txt
git status
git add todo.txt
git diff --staged
git commit -m "Add requirements reminder"
echo "Inspect the diff." >> todo.txt
git diff
git add todo.txt
git diff --staged
git commit -m "Add diff review reminder"
git log -2 --stat
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp027"></a>

### GP027 — Run the complete workflow from memory

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Repeat the inspect → stage → commit routine](#git-2-4)

**Starting state**

```text
Existing repository on main, clean. docs does not exist.
```

**Instructions**

1. Create a docs folder and write “Start here.” to docs/intro.txt.
2. Record the new document with a focused commit.
3. Verify the commit contents and final status.

**Completion criteria**

The document is committed and there are no pending changes.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
mkdir docs
echo "Start here." > docs/intro.txt
git status
git add docs/intro.txt
git diff --staged
git commit -m "Add introductory guide"
git show --stat HEAD
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="q01"></a>

### Q01 — Check your understanding: editing, staging, and committing

Type: short quiz · 3 single-answer questions · Suggested completion: 2/3, with all missed explanations reviewed.

**Learner instructions:** Choose one answer for each question. You do not need to type commands in this check.

#### Q01.1

You stage README.md, then edit it again. Without staging again, what will an ordinary git commit record?

- **A.** Nothing, because editing clears staging.
- **B.** Every current file on the computer.
- **C.** The README contents captured when you staged it.
- **D.** Only the later edit.

**Author answer:** C.

**Explanation:** Staging captures contents at that moment. Later edits remain unstaged until you select them again.

**If missed, review:** [Editing after staging](#git-2-3)

#### Q01.2

Which command shows the changes selected for the next commit?

- **A.** git log -1
- **B.** pwd
- **C.** git diff --staged
- **D.** git push

**Author answer:** C.

**Explanation:** git diff --staged compares the staging area with HEAD. Ordinary git diff shows unstaged changes; history commands inspect existing commits.

**If missed, review:** [Choose changes with the staging area](#git-2-1)

#### Q01.3

You made a local commit. Which statement is correct?

- **A.** It exists on GitHub even without an internet connection.
- **B.** It erased the earlier history.
- **C.** It includes every file in the folder, including ignored files.
- **D.** It records a snapshot with metadata such as a message and author, and connects it to history.

**Author answer:** D.

**Explanation:** A commit records the selected snapshot and metadata. It does not automatically include ignored or unstaged content, erase earlier commits, or publish itself.

**If missed, review:** [Record a change with a commit](#git-2-2)

## Git unit 3: Making useful commits

<a id="git-3-1"></a>

### Mini lesson: Keep a commit focused

Content ID: `git-3-1`

A useful commit groups changes that belong together. You do not have to commit every edited file at once. Giving each finished change its own commit makes the history easier to review and reverse.

#### Commands and concepts

```text
git diff
```

Review all unstaged changes so you know which files belong to this task.

```text
git add README.md
```

Stage a specific file instead of the whole folder. git add . would stage matching changes under the current directory, which may include unrelated work.

```text
git diff --staged
```

Double-check the selection before committing.

```text
git show --stat HEAD
```

After committing, inspect which files the new commit changed.

#### Worked example

```text
Changed files:
  README.md      → finished spelling fix
  settings.json  → unfinished experiment

git add README.md
git commit -m "Fix README spelling"

The settings edit stays in your working directory.
```

#### When a developer uses this

If a documentation fix causes confusion later, a developer can reverse that focused commit without also undoing an unrelated settings change.

Reference: [Official documentation](https://git-scm.com/docs)

<a id="gp028"></a>

### GP028 — Keep the unfinished work out

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Keep a commit focused](#git-3-1)

**Starting state**

```text
$ git status --short
 M README.md
 M settings.json
```

**File contents or supporting context**

```text
README.md: senor → sensor
settings.json: trial sample-app 30 → 40
```

**Instructions**

1. Inspect both edits.
2. Commit only the README fix.
3. Leave the settings edit untouched and uncommitted.

**Completion criteria**

The commit changes README.md only; settings.json remains modified.

**Hint**

Avoid staging the whole directory when only one change is ready.

**Author answer / one acceptable approach**

```text
git diff
git add README.md
git diff --staged
git commit -m "Fix README spelling"
git show --stat HEAD
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp029"></a>

### GP029 — Choose from three edited files

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Keep a commit focused](#git-3-1)

**Starting state**

```text
help.txt: finished typo fix
settings.json: unfinished timeout experiment
notes.txt: unfinished investigation notes
Nothing is staged.
```

**Instructions**

1. Commit the completed help.txt correction only.
2. Preserve both unfinished file edits.
3. Verify the latest commit’s file list and remaining status.

**Completion criteria**

Only help.txt is committed; the other two edits remain.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git diff
git add help.txt
git diff --staged
git commit -m "Fix help text spelling"
git show --stat HEAD
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp030"></a>

### GP030 — Split two ready files

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Keep a commit focused](#git-3-1)

**Starting state**

```text
README.md: installation clarification
examples.json: corrected example label
Both edits are ready and unstaged.
```

**Instructions**

1. Inspect both finished changes.
2. Commit README.md first, then commit examples.json separately.
3. Verify that each commit contains exactly its intended file.

**Completion criteria**

Two focused commits exist and the working tree is clean.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git diff
git add README.md
git diff --staged
git commit -m "Clarify installation"
git add examples.json
git diff --staged
git commit -m "Correct example label"
git log -2 --stat
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="git-3-2"></a>

### Mini lesson: Select part of a file

Content ID: `git-3-2`

Two unrelated changes can live in the same file. Patch staging lets you choose smaller groups of changed lines, called hunks, rather than staging the whole file.

#### Commands and concepts

```text
git add -p README.md
```

-p means patch mode. Git presents each hunk and asks whether you want to stage it.

```text
y / n / s / ?
```

In the interactive prompt, y stages the hunk, n skips it, s splits it when possible, and ? explains the choices. These are prompt responses, not separate shell commands.

```text
git diff --staged
```

Check the selected hunks before creating a commit.

#### Worked example

```text
Hunk 1: fix a heading typo.
Stage this hunk? y

Hunk 2: add installation instructions.
Stage this hunk? n

The next commit includes only the heading correction.
```

#### When a developer uses this

A developer can separate a bug fix from nearby formatting cleanup even when both edits are in one file. Reviewers can then judge each change on its own.

Reference: [Official documentation](https://git-scm.com/docs/git-add)

<a id="gp031"></a>

### GP031 — Separate two changes in one file

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Select part of a file](#git-3-2)

**Starting state**

```text
$ git diff
@@ -1 +1 @@
-# Senor project
+# Sensor project
@@ -20,0 +21,3 @@
+## Installation
+Install dependencies with npm ci.
+Run tests with npm test.
```

**File contents or supporting context**

```text
# Sensor project

[unchanged content between the two hunks]

## Installation
Install dependencies with npm ci.
Run tests with npm test.
```

**Instructions**

1. Use patch staging to select the typo hunk only.
2. Review and commit that correction.
3. Stage and commit the installation section separately.

**Completion criteria**

Two commits exist: one spelling fix and one installation update.

**Hint**

git add -p lets you answer y or n for each hunk.

**Author answer / one acceptable approach**

```text
git add -p README.md
# y for the typo hunk; n for the installation hunk
git diff --staged
git commit -m "Fix README heading"
git add README.md
git commit -m "Document installation and tests"
git log -2 --stat
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp032"></a>

### GP032 — Select the second hunk

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Select part of a file](#git-3-2)

**Starting state**

```text
README.md has two separately selectable hunks.
First: experimental heading.
Second: add “Run npm test.”
Nothing is staged.
```

**Instructions**

1. Stage only the second README hunk.
2. Commit the new test instruction.
3. Leave the first hunk’s unfinished heading edit unstaged.

**Completion criteria**

Only the test instruction is committed.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git add -p README.md
# n for first hunk; y for second
git diff --staged
git commit -m "Document test command"
git diff
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp033"></a>

### GP033 — Make two commits from three hunks

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Select part of a file](#git-3-2)

**Starting state**

```text
README.md has three separately selectable hunks:
1. Fix “instal” → “install”.
2. Add installation instructions.
3. Fix “tesst” → “test”.
```

**Instructions**

1. Stage the first and third hunks together as one spelling-fix commit.
2. Commit the second hunk’s installation addition separately.
3. Verify the final history and status.

**Completion criteria**

Spelling fixes share one commit; installation instructions have their own.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git add -p README.md
# y, n, y
git diff --staged
git commit -m "Fix README spelling"
git add README.md
git diff --staged
git commit -m "Add installation instructions"
git log -2 --stat
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="git-3-3"></a>

### Mini lesson: Ignore files that do not belong in history

Content ID: `git-3-3`

A .gitignore file lists patterns Git should ignore when looking for untracked files to add. Generated dependencies and local environment files often belong on this list.

#### Commands and concepts

```text
node_modules/
```

An ignore pattern for the dependency folder. The trailing slash identifies a directory pattern.

```text
.env
```

An ignore pattern for a local environment file. Keep actual credentials out of practice examples and commits.

```text
git status --ignored
```

Show ignored files as well as the usual status, so you can check the rules.

```text
git add .gitignore
```

The ignore file itself normally belongs in history so everyone gets the same rules.

#### Worked example

```text
# .gitignore
node_modules/
.env

# Review and record the rules
git add .gitignore
git diff --staged
git commit -m "Ignore local environment and dependencies"
```

#### When a developer uses this

A developer installing dependencies should not have to review thousands of generated files. Ignore rules reduce that noise. They do not untrack existing files or erase secrets already committed.

Reference: [Official documentation](https://git-scm.com/docs/gitignore)

<a id="gp034"></a>

### GP034 — Keep local files out of history

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Ignore files that do not belong in history](#git-3-3)

**Starting state**

```text
$ git status --short
?? .env
?? node_modules/
# .gitignore does not exist yet.
```

**File contents or supporting context**

```text
# Write the new .gitignore here.
```

**Instructions**

1. Add ignore rules for node_modules/ and .env.
2. Commit .gitignore only.
3. Verify the ignored files are not staged.

**Completion criteria**

The commit includes .gitignore; local credentials and dependencies remain untracked and ignored.

**Hint**

Use one pattern per line. git status --ignored can confirm the result.

**Author answer / one acceptable approach**

```text
# Create .gitignore containing:
# node_modules/
# .env
git add .gitignore
git diff --staged
git commit -m "Ignore local environment and dependencies"
git status --ignored
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp035"></a>

### GP035 — Add another ignored folder

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Ignore files that do not belong in history](#git-3-3)

**Starting state**

```text
.gitignore already contains node_modules/ and .env.
cache/temp.txt is new and untracked. No other changes.
```

**Instructions**

1. Add cache/ to the existing ignore rules without removing them.
2. Commit only the updated .gitignore.
3. Verify that cache/temp.txt is ignored.

**Completion criteria**

The old rules remain; cache/ is now ignored; only .gitignore was committed.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
echo "cache/" >> .gitignore
git diff
git add .gitignore
git diff --staged
git commit -m "Ignore local cache"
git status --ignored
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp036"></a>

### GP036 — Keep source, ignore generated output

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Ignore files that do not belong in history](#git-3-3)

**Starting state**

```text
Existing repository with an initial commit. New untracked files: README.md, .env, dist/bundle.js. .gitignore does not exist.
```

**Instructions**

1. Create .gitignore with rules for dist/ and .env.
2. Stage and commit .gitignore and README.md.
3. Verify that generated output and the environment file are excluded.

**Completion criteria**

The commit contains only the README and ignore rules.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
echo "dist/" > .gitignore
echo ".env" >> .gitignore
git add .gitignore README.md
git diff --staged
git commit -m "Add README and ignore generated output"
git status --ignored
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="c02"></a>

### C02 — Checkpoint: Make focused commits from a mixed working folder

Type: practical checkpoint · Completion: every listed outcome met · Unlimited retries.

**What this checks**

Inspect the actual changes, choose what belongs in each commit, and verify the resulting history. A clean commit can coexist with unrelated unfinished work in the working directory.

Reuses: [Choose changes with the staging area](#git-2-1), [Record a change with a commit](#git-2-2), [Editing after staging](#git-2-3), [Repeat the inspect → stage → commit routine](#git-2-4), [Keep a commit focused](#git-3-1), [Select part of a file](#git-3-2), [Ignore files that do not belong in history](#git-3-3)

**Prepared starting state**

```text
Existing repository on main with one base commit and local author identity configured.
Tracked README.md in HEAD: “Instal dependencies.”
Working README.md: “Install dependencies.” (unstaged correction)
Tracked notes.txt in HEAD: “Investigate settings.”
Working notes.txt: “Investigate settings. Trial timeout 45.” (unfinished; preserve it)
Untracked .env: SAMPLE_VALUE=placeholder
Untracked dist/bundle.js: generated example output
.gitignore and docs/ do not exist. Nothing is staged.
```

**Learner instructions**

1. Inspect the changes and commit only the README spelling fix.
2. Create docs/setup.txt with “Install dependencies, then run tests.” and commit that guide separately.
3. Create .gitignore with dist/ and .env, then commit those rules separately.
4. Inspect the last three commits and final status. Keep notes.txt edited and uncommitted.

**Completion criteria / author verification rubric**

- Three new commits exist after the base commit.
- The first changes only README.md and contains the spelling correction.
- The second adds only docs/setup.txt with the required sentence.
- The third adds only .gitignore with both required patterns.
- No commit contains .env, dist/bundle.js, or the unfinished notes edit.
- notes.txt still has the unfinished working contents and is unstaged.
- The environment and build-output paths are ignored.

**Progressive hints**

1. Choose specific paths instead of staging the whole folder.
2. Review git diff --staged before every commit.
3. You need three separate staging-and-commit cycles; the unfinished notes file should remain outside all three.

**Author answer / one acceptable approach**

```text
git status
git diff
git add README.md
git diff --staged
git commit -m "Fix installation spelling"
mkdir docs
echo "Install dependencies, then run tests." > docs/setup.txt
git add docs/setup.txt
git diff --staged
git commit -m "Add setup guide"
echo "dist/" > .gitignore
echo ".env" >> .gitignore
git add .gitignore
git diff --staged
git commit -m "Ignore build output and local environment"
git log -3 --stat
git status --ignored
git diff -- notes.txt
```

**Targeted feedback**

- **Unfinished notes entered a commit:** The selected paths were too broad. Review staged content and separate the finished change from the experiment.
- **Only one combined commit exists:** The files are correct, but the history does not separate the three purposes. Repeat the exercise using a commit after each focused selection.
- **Ignored paths were committed:** Ignore patterns affect untracked files; they do not erase an already-recorded secret or generated file. Inspect the staged file list before committing.

## Git unit 4: Understanding project history

<a id="git-4-1"></a>

### Mini lesson: Read a file’s history

Content ID: `git-4-1`

A commit identifier lets you refer to one recorded version. You can narrow history to a particular file and ask Git to show the actual edits, rather than reading every commit in the project.

#### Commands and concepts

```text
git log --oneline -- README.md
```

Show compact commit summaries for README.md. -- separates options and revisions from file paths.

```text
git log -p -- README.md
```

Add each commit’s patch so you can see which lines changed.

```text
git show a1b2c3d -- README.md
```

Inspect the README change in one specific commit. Use a real identifier from the repository’s history.

#### Worked example

```text
$ git log --oneline -- README.md
b2c3d4e Update supported browser version
a1b2c3d Document browser requirements

$ git show b2c3d4e -- README.md
-Browser version 100 or later
+Browser version 120 or later
```

#### When a developer uses this

When an instruction changes unexpectedly, a developer can find when it changed and read the commit message for context before deciding whether it needs correction.

Reference: [Official documentation](https://git-scm.com/docs/git-log)

<a id="gp037"></a>

### GP037 — Find the change that caused confusion

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Read a file’s history](#git-4-1)

**Starting state**

```text
$ git log --oneline -- README.md
b20c222 Increase observation interval
a10b111 Document five-minute readings
# b20c222 changes “5 minutes” to “60 minutes”.
```

**File contents or supporting context**

```text
Current README: Wait 60 minutes between readings.
```

**Instructions**

1. Inspect README.md history with patches.
2. Identify the commit that changed 5 minutes to 60 minutes.
3. Write its identifier and a short description in the notes.

**Completion criteria**

You identify b20c222 as the change and explain what it changed.

**Hint**

git log -p -- README.md shows each relevant patch.

**Author answer / one acceptable approach**

```text
git log -p -- README.md
git show b20c222 -- README.md
# b20c222 changed the interval from 5 to 60 minutes.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="git-4-2"></a>

### Mini lesson: Read an older file without switching versions

Content ID: `git-4-2`

HEAD refers to your current commit. HEAD~1 follows its first parent to the previous commit. Git can read a file from that older snapshot without replacing the file you are editing.

#### Commands and concepts

```text
git show HEAD~1:README.md
```

Read README.md as it existed in the previous commit. The colon separates the revision from the file path.

```text
git diff HEAD~1 HEAD -- README.md
```

Compare the previous committed README with the current committed README.

```text
git status
```

Confirm your current branch and pending edits are unchanged after inspection.

#### Worked example

```text
git show HEAD~1:README.md

# Read-only inspection: your current files stay in place.
# No checkout or branch switch is needed.
```

#### When a developer uses this

A developer writing a fix may need to check an older configuration or instruction. Reading it with git show avoids disturbing their current unfinished work.

Reference: [Official documentation](https://git-scm.com/docs/git-show)

<a id="gp038"></a>

### GP038 — Inspect an older version without editing it

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Read an older file without switching versions](#git-4-2)

**Starting state**

```text
$ git status --short
 M notes.txt
$ git log --oneline -2
b20c222 Document hourly readings
a10b111 Document five-minute readings
```

**File contents or supporting context**

```text
notes.txt: unfinished observations
```

**Instructions**

1. Read README.md from HEAD~1.
2. Compare it with HEAD.
3. Explain why reading with git show leaves your local changes intact.

**Completion criteria**

You can describe the old text; your current branch and pending edits remain unchanged.

**Hint**

Use git show HEAD~1:README.md.

**Author answer / one acceptable approach**

```text
git show HEAD~1:README.md
git diff HEAD~1 HEAD -- README.md
git status
# show reads the stored file; it does not check it out.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="q02"></a>

### Q02 — Check your understanding: reading history

Type: short quiz · 3 single-answer questions · Suggested completion: 2/3, with all missed explanations reviewed.

**Learner instructions:** Choose one answer for each question. You do not need to type commands in this check.

#### Q02.1

What does git log -p -- README.md help you inspect?

- **A.** All ignored files.
- **B.** Only the latest remote branch name.
- **C.** Commit history and patches relevant to README.md.
- **D.** Only the current unstaged README edit.

**Author answer:** C.

**Explanation:** The file path narrows the history and -p includes patches. This lets you connect a changed line with its recorded commit.

**If missed, review:** [Read a file’s history](#git-4-1)

#### Q02.2

Which command reads the committed README from the previous first-parent revision without switching branches?

- **A.** git add README.md
- **B.** git commit HEAD~1
- **C.** git show HEAD~1:README.md
- **D.** git switch HEAD~1

**Author answer:** C.

**Explanation:** The revision:path form reads a stored file. It does not replace the working copy or switch the current branch.

**If missed, review:** [Read an older file without switching versions](#git-4-2)

#### Q02.3

What does HEAD normally identify when you are working on a branch?

- **A.** The current checked-out commit through the current branch.
- **B.** The remote server address.
- **C.** The first commit ever made by any contributor.
- **D.** Every untracked file.

**Author answer:** A.

**Explanation:** HEAD usually refers to the checked-out branch, which points to its current tip commit. It is a reference to history, not a server or file list.

**If missed, review:** [Read an older file without switching versions](#git-4-2)

## Git unit 5: Undoing changes deliberately

<a id="git-5-1"></a>

### Mini lesson: Unstage a file and keep its edits

Content ID: `git-5-1`

Unstaging and discarding are different actions. Unstaging removes a change from the next commit’s selection while leaving your edited working file available.

#### Commands and concepts

```text
git restore --staged settings.json
```

Restore this file’s staging-area entry from HEAD. Its working-directory edits remain.

```text
git diff --staged
```

Review what is still selected for the next commit.

```text
git diff -- settings.json
```

Inspect the settings edit that remains unstaged.

#### Worked example

```text
Before: settings.json is edited and staged.
git restore --staged settings.json
After: settings.json is still edited, but no longer staged.

Without --staged, git restore can replace working-file contents.
Use the option that matches the outcome you intend.
```

#### When a developer uses this

A developer who accidentally staged an unfinished change can correct the next commit’s contents without redoing that work.

Reference: [Official documentation](https://git-scm.com/docs/git-restore)

<a id="gp039"></a>

### GP039 — Unstage without losing your edit

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Unstage a file and keep its edits](#git-5-1)

**Starting state**

```text
$ git status --short
M  README.md
M  settings.json
```

**File contents or supporting context**

```text
settings.json: unfinished sample-app experiment
```

**Instructions**

1. Unstage settings.json while keeping its contents.
2. Review the remaining staged change.
3. Commit only the README fix.

**Completion criteria**

README.md is committed and settings.json still contains the unfinished edit.

**Hint**

Use git restore --staged for the file you want to keep out.

**Author answer / one acceptable approach**

```text
git restore --staged settings.json
git diff --staged
git commit -m "Clarify README instructions"
git status
git diff -- settings.json
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="git-5-local"></a>

### Mini lesson: Correct an unpublished local commit

Content ID: `git-5-local`

Sometimes the last local commit needs a better message or one missing file. Amend replaces that last commit. Sometimes you want to undo the commit boundary while keeping the work selected; a soft reset can do that. Practice these operations only on the explicitly unpublished history supplied here.

#### Commands and concepts

```text
git commit --amend -m "Clarify setup instructions"
```

Replace the latest commit using the current staging area and the supplied message. With no staged content changes, this can correct the message. The replacement commit has a different identity.

```text
git reset --soft HEAD~1
```

Move the current branch back one first-parent commit while keeping the staging area and working files unchanged. The undone commit’s changes remain staged relative to the new HEAD.

```text
git diff --staged
```

Inspect the selected changes after the soft reset before recording a replacement commit.

```text
reset modes
```

--soft keeps the index and working files. The usual --mixed mode resets the index but keeps working edits. --hard also replaces tracked working-file contents and can discard uncommitted changes; it is not needed in these tasks.

#### Worked example

```text
# Message correction, with clean unpublished work:
git commit --amend -m "Document the setup command"

# Undo the last unpublished commit boundary but keep its changes staged:
git reset --soft HEAD~1
git diff --staged
git commit -m "Describe the completed change"
```

#### When a developer uses this

A developer can correct a vague message or reorganize a local checkpoint before anyone depends on it. Once a change is shared, choose the agreed team workflow; use a new revert commit when the goal is to reverse a shared change without rewriting that history.

Reference: [Official documentation](https://git-scm.com/docs/git-reset)

<a id="gp040"></a>

### GP040 — Improve the last local commit message

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Correct an unpublished local commit](#git-5-local)

**Starting state**

```text
Existing history A → B. B is HEAD, unpublished, and changes only README.md to add the setup command. Its message is “stuff”. Nothing is staged or edited.
```

**Instructions**

1. Inspect the latest unpublished commit and confirm the working tree and staging area are clean.
2. Change its message from “stuff” to “Document setup command” without changing any file contents.
3. Inspect the replacement commit and confirm clean status.

**Completion criteria**

The latest commit has the useful message and the same tree and parent as B; B’s old identifier is replaced on this branch. Working tree remains clean.

**Hint**

With a clean staging area, amend can replace the latest commit’s message without adding content changes.

**Author answer / one acceptable approach**

```text
git log -1 --stat
git status
git commit --amend -m "Document setup command"
git log -1 --stat
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp041"></a>

### GP041 — Undo a local commit boundary but keep the work

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Correct an unpublished local commit](#git-5-local)

**Starting state**

```text
Existing history A → B on main. B is unpublished and adds only guide.txt containing “Install dependencies.” Both index and working tree match B. A already contains README.md.
```

**Instructions**

1. Inspect the latest unpublished commit.
2. Move back one commit while keeping its changes staged and its working-file contents intact.
3. Inspect the staged difference, record a replacement with a useful message, and verify status.

**Completion criteria**

After the soft reset, guide.txt is staged as a new file relative to A. After recommitting, a replacement child of A includes it and the working tree is clean.

**Hint**

Use --soft to preserve both the staging area and the working files while moving the branch pointer.

**Author answer / one acceptable approach**

```text
git show HEAD
git reset --soft HEAD~1
git status
git diff --staged
git commit -m "Add installation guide"
git log -2 --stat
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="git-5-2"></a>

### Mini lesson: Undo a commit with revert

Content ID: `git-5-2`

“Roll back” describes an outcome, not one universal Git command. To reverse a change that others already have, a revert normally adds a new commit applying the opposite change. The original commit stays in history.

#### Commands and concepts

```text
git show a1b2c3d
```

Read the target commit before deciding to reverse it.

```text
git revert --no-edit a1b2c3d
```

Reverse that commit and use Git’s generated message without opening an editor. A conflict may still require resolution.

```text
git log -3 --oneline
```

Inspect the latest three commits to confirm the new reversal appears.

#### Worked example

```text
Before: A → B (unwanted change) → C
Revert B: A → B → C → D (reverses B)

D records the correction; B and C remain in history.
```

#### When a developer uses this

A developer can reverse a faulty shared change while preserving the history teammates already have. Reset can instead move a branch pointer, so it is not interchangeable with reverting shared work.

Reference: [Official documentation](https://git-scm.com/docs/git-revert)

<a id="gp042"></a>

### GP042 — Reverse a shared mistake

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Undo a commit with revert](#git-5-2)

**Starting state**

```text
$ git log --oneline -3
d40e444 Update docs
c30d333 Set incorrect sample interval
b20c222 Add interval setting
# Working tree is clean; reverting c30d333 has no conflicts.
```

**File contents or supporting context**

```text
settings.json currently has the incorrect interval.
```

**Instructions**

1. Inspect c30d333.
2. Reverse its change while preserving the existing history.
3. Inspect the new commit and confirm a clean working tree.

**Completion criteria**

A new reversal commit exists; c30d333 is still in history.

**Hint**

Use revert rather than resetting the shared branch.

**Author answer / one acceptable approach**

```text
git show c30d333
git revert --no-edit c30d333
git log -3 --oneline
git show HEAD
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="c03"></a>

### C03 — Checkpoint: Unstage, commit, and reverse the right change

Type: practical checkpoint · Completion: every listed outcome met · Unlimited retries.

**What this checks**

Different states need different corrections. Preserve unfinished working edits, record a ready fix, and use a new reversal commit for a shared mistake.

Reuses: [Unstage a file and keep its edits](#git-5-1), [Undo a commit with revert](#git-5-2), [Read a file’s history](#git-4-1), [Read an older file without switching versions](#git-4-2)

**Prepared starting state**

```text
Existing main history: A → B → C. All three are already shared.
A: settings.json contains {"timeout":30}; README.md contains “Instal dependencies.”; notes.txt contains “Investigate.”
B: changes settings.json timeout to 300 (incorrect).
C: adds help.txt with “Use --help.” (valid).
Current staged edits: README spelling correction to “Install dependencies.”; notes.txt changes to “Investigate cache.”
Working files match those staged contents. The settings revert will apply without conflicts.
```

**Learner instructions**

1. Phase A: unstage notes.txt without losing its contents, then commit only the README correction.
2. Verify that notes.txt remains edited and unstaged. Record this result before continuing.
3. Phase B starts independently with clean history A → B → C → D, where D contains the completed README fix. Inspect B’s actual identifier and reverse B.
4. Verify the timeout, valid help document, README correction, and preserved history. No stash commands are required here.

**Completion criteria / author verification rubric**

- The README spelling fix is recorded in its own new commit.
- B and C remain in history.
- A newer reversal commit restores timeout 30.
- help.txt and the committed README correction remain intact.
- Phase A finishes with notes.txt modified to “Investigate cache.” and unstaged; Phase B starts from its separately seeded clean tree.

**Progressive hints**

1. Unstage and discard are different actions. Preserve the working notes.
2. Use git restore --staged notes.txt, then commit the README only.
3. For the reversal phase, start from the supplied clean-tree reset below and use git revert on B’s actual identifier.

**Author answer / one acceptable approach**

```text
Phase A:
git restore --staged notes.txt
git diff --staged
git commit -m "Fix README spelling"
git diff -- notes.txt

Phase B (independent prepared clean state; no stash knowledge required):
# Seed A → B → C → D, where D is the completed README fix.
# All tracked working files are clean in this phase.
git log --oneline
git show <actual-B-id>
git revert --no-edit <actual-B-id>
git log --oneline -5
git show HEAD
git status
```

**Targeted feedback**

- **notes.txt edit disappears in phase A:** Unstaging should preserve the file. Use restore --staged rather than replacing the working file.
- **B disappears from history:** A shared reversal should normally add a new commit. Moving the branch backward would also remove later work from that branch.
- **help.txt disappears:** The valid later contribution must remain. Reverse B’s change rather than returning the whole project to A.

## Git unit 6: Working with branches

<a id="git-6-1"></a>

### Mini lesson: Create a branch for a change

Content ID: `git-6-1`

A branch is a movable name pointing to a commit. Creating a branch gives your next commits a separate line of development. main does not move when you commit on another branch.

#### Commands and concepts

```text
git switch -c docs/install
```

Create a branch called docs/install at your current commit and switch to it. -c means create.

```text
git add README.md
```

Stage the edit you made on the branch.

```text
git commit -m "Document installation"
```

Record the edit on the branch currently checked out.

```text
git log --oneline --decorate -3
```

Show the last three commits with labels such as branch names and HEAD.

#### Worked example

```text
Before: main → A
Create docs/install, then commit B:
main → A
docs/install → B (whose parent is A)
```

#### When a developer uses this

A developer can prepare a fix for review while the main branch continues to represent the project’s accepted work.

Reference: [Official documentation](https://git-scm.com/docs/git-switch)

<a id="gp043"></a>

### GP043 — Start a documentation branch

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Create a branch for a change](#git-6-1)

**Starting state**

```text
$ git status
On branch main
nothing to commit, working tree clean
```

**File contents or supporting context**

```text
# Sample app
Read the sensor data.
```

**Instructions**

1. Create and switch to docs/setup from clean main.
2. Add “Run npm test before submitting changes.” to README.md.
3. Commit the change and verify which branch contains it.

**Completion criteria**

docs/setup contains your new commit and main has not moved.

**Hint**

git switch -c creates and switches to a branch.

**Author answer / one acceptable approach**

```text
git switch -c docs/setup
# Edit README.md as directed.
git diff
git add README.md
git commit -m "Document the test command"
git log --oneline --decorate -3
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp057"></a>

### GP057 — Create a branch and a new document

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Create a branch for a change](#git-6-1)

**Starting state**

```text
On clean main. help.txt does not exist.
```

**Instructions**

1. Create docs/help from main.
2. Create help.txt containing “Use --help for options.”
3. Inspect, stage, commit, and verify the branch label.

**Completion criteria**

docs/help has the new commit; main remains at its original commit.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git switch -c docs/help
echo "Use --help for options." > help.txt
git add help.txt
git diff --staged
git commit -m "Add help instructions"
git log --oneline --decorate -3
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="git-6-2"></a>

### Mini lesson: Compare branches before switching

Content ID: `git-6-2`

Branch names can be used anywhere Git expects a revision. A comparison shows the difference between the snapshots at those branch tips. Switching changes which branch new commits will extend.

#### Commands and concepts

```text
git diff main docs/install -- README.md
```

Compare the README on main with the README on docs/install.

```text
git log --oneline --graph --all
```

Draw a text graph of history. --all includes references beyond the current branch.

```text
git switch main
```

Switch to main. Start with a clean working tree here so unfinished work does not complicate the switch.

#### Worked example

```text
git diff main docs/install -- README.md
# A + line is present on docs/install but not on main.

git switch main
# Files now reflect main’s version.
```

#### When a developer uses this

A developer can check whether a branch contains the intended change before asking someone to review it or starting a different task.

Reference: [Official documentation](https://git-scm.com/docs/git-branch)

<a id="gp044"></a>

### GP044 — Compare before you switch tasks

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Compare branches before switching](#git-6-2)

**Starting state**

```text
$ git branch
* docs/setup
  main
# docs/setup adds the test-command sentence; main does not.
```

**File contents or supporting context**

```text
docs/setup README: Run npm test before submitting changes.
```

**Instructions**

1. Confirm you are on docs/setup and the working tree is clean.
2. Compare main with docs/setup.
3. Switch to main and verify the new sentence is absent there.

**Completion criteria**

You can explain the branch difference and are back on clean main.

**Hint**

Use git diff main docs/setup -- README.md, then git switch main.

**Author answer / one acceptable approach**

```text
git status
git diff main docs/setup -- README.md
git log --oneline --graph --all
git switch main
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="gp058"></a>

### GP058 — Compare a new document

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Compare branches before switching](#git-6-2)

**Starting state**

```text
On clean docs/help. It adds help.txt; main lacks that file.
```

**Instructions**

1. Compare main and docs/help for help.txt.
2. Inspect the graph and switch back to main.

**Completion criteria**

You identify the added help document and finish on clean main.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git diff main docs/help -- help.txt
git log --oneline --graph --all
git switch main
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="q03"></a>

### Q03 — Check your understanding: branches

Type: short quiz · 3 single-answer questions · Suggested completion: 2/3, with all missed explanations reviewed.

**Learner instructions:** Choose one answer for each question. You do not need to type commands in this check.

#### Q03.1

What does git switch -c docs/help do?

- **A.** Delete the remote docs/help branch.
- **B.** Publish all local commits.
- **C.** Create docs/help at the current commit and switch to it.
- **D.** Merge docs/help into main.

**Author answer:** C.

**Explanation:** The -c option creates a branch and switches to it. It does not merge or push.

**If missed, review:** [Create a branch for a change](#git-6-1)

#### Q03.2

You commit on docs/help after branching from main. Which branch moves to the new commit?

- **A.** docs/help.
- **B.** Both branches automatically.
- **C.** Only main.
- **D.** Neither branch.

**Author answer:** A.

**Explanation:** New commits advance the checked-out branch. main stays at its previous commit until you explicitly integrate or otherwise update it.

**If missed, review:** [Create a branch for a change](#git-6-1)

#### Q03.3

Which command compares the committed README on main with the committed README on docs/help?

- **A.** git status main README.md
- **B.** git init docs/help
- **C.** git diff main docs/help -- README.md
- **D.** git add main docs/help

**Author answer:** C.

**Explanation:** git diff can compare named revisions. The final path limits the comparison to README.md.

**If missed, review:** [Compare branches before switching](#git-6-2)

## Git unit 7: Merging and resolving conflicts

<a id="git-7-1"></a>

### Mini lesson: Merge a branch into another branch

Content ID: `git-7-1`

Merging brings another branch’s history into the branch you currently have checked out. If the destination has no separate new commits, Git can simply move its pointer forward. That is a fast-forward merge.

#### Commands and concepts

```text
git switch main
```

Select the destination branch first.

```text
git merge docs/install
```

Bring docs/install into the current branch.

```text
git branch -d docs/install
```

Delete the local branch name after its work is merged. -d checks whether Git considers the branch merged. The commits remain reachable through main.

#### Worked example

```text
Before: main → A; docs/install → B, after A
git switch main
git merge docs/install
After: main → B; docs/install → B
```

#### When a developer uses this

A developer can integrate a completed documentation branch and remove its old branch name to keep the list of active work manageable.

Reference: [Official documentation](https://git-scm.com/docs/git-merge)

<a id="gp045"></a>

### GP045 — Merge a completed branch

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Merge a branch into another branch](#git-7-1)

**Starting state**

```text
$ git log --oneline --all --decorate
b20c222 (docs/setup) Document test command
a10b111 (HEAD -> main) Initial README
```

**File contents or supporting context**

```text
README.md on main: # Sample app
```

**Instructions**

1. Switch to main.
2. Merge docs/setup.
3. Verify the README change and remove the merged local branch.

**Completion criteria**

main includes the setup instructions and the completed local branch is deleted.

**Hint**

Merge while checked out on the branch that should receive the work.

**Author answer / one acceptable approach**

```text
git switch main
git merge docs/setup
git show HEAD -- README.md
git branch -d docs/setup
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="git-7-2"></a>

### Mini lesson: Resolve a merge conflict

Content ID: `git-7-2`

A conflict happens when Git cannot automatically decide how to combine changes. In a conflicted file, markers separate the current branch’s version from the incoming version. Your job is to produce the correct final content.

#### Commands and concepts

```text
<<<<<<< HEAD / ======= / >>>>>>> branch
```

These markers surround the alternatives. Remove the markers and replace the block with the intended final text.

```text
git add README.md
```

After editing, stage the resolved file to tell Git you have handled its conflict.

```text
git commit -m "Merge documentation changes"
```

Finish the merge after all conflicts are resolved and staged.

```text
git merge --abort
```

Cancel an in-progress merge if you need to return to its starting point.

#### Worked example

```text
<<<<<<< HEAD
Install dependencies.
=======
Run the tests.
>>>>>>> docs/tests

If both instructions are required, resolve to:
Install dependencies, then run the tests.
```

#### When a developer uses this

Two developers can edit the same instruction for different reasons. Resolving correctly means understanding both changes, rather than automatically keeping “ours” or “theirs.”

Reference: [Official documentation](https://git-scm.com/docs/git-merge)

<a id="gp046"></a>

### GP046 — Resolve competing README instructions

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Resolve a merge conflict](#git-7-2)

**Starting state**

```text
$ git merge docs/tests
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result.
```

**File contents or supporting context**

```text
<<<<<<< HEAD
Run npm ci.
=======
Run npm test.
>>>>>>> docs/tests
```

**Instructions**

1. Replace the conflict with: “Run npm ci, then npm test.”
2. Inspect the result and stage README.md.
3. Complete the merge and verify a clean state.

**Completion criteria**

README.md contains the agreed sentence with no conflict markers; the merge is complete.

**Hint**

Do not keep either side blindly; the requirement needs both steps.

**Author answer / one acceptable approach**

```text
# Edit README.md to: Run npm ci, then npm test.
git diff
git add README.md
git diff --staged
git commit -m "Merge setup and testing instructions"
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="gp059"></a>

### GP059 — Combine two useful lines

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Resolve a merge conflict](#git-7-2)

**Starting state**

```text
Merge paused with one conflict in help.txt. Current branch says “Install dependencies.” Incoming branch says “Run tests.” Both instructions are required.
```

**File contents or supporting context**

```text
<<<<<<< HEAD
Install dependencies.
=======
Run tests.
>>>>>>> docs/testing
```

**Instructions**

1. Resolve help.txt to contain “Install dependencies.” then “Run tests.” on separate lines.
2. Stage the resolution and finish the merge.

**Completion criteria**

Both instructions remain, markers are gone, and the merge is complete.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
# Replace the conflict block with the two required lines.
git diff
git add help.txt
git commit -m "Combine setup and test instructions"
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="c04"></a>

### C04 — Checkpoint: Combine two branches and finish the merge

Type: practical checkpoint · Completion: every listed outcome met · Unlimited retries.

**What this checks**

Choose the receiving branch, integrate the work, and resolve content according to the requirement. Removing conflict markers is only part of producing a correct result.

Reuses: [Create a branch for a change](#git-6-1), [Compare branches before switching](#git-6-2), [Merge a branch into another branch](#git-7-1), [Resolve a merge conflict](#git-7-2)

**Prepared starting state**

```text
Base commit A: README.md contains “Setup instructions.”; notes.txt contains “Keep this note.”
main at B: replaces README sentence with “Install dependencies.”
docs/tests at C, branched from A: replaces it with “Run tests.”
Current branch: main. Working tree clean. No remote involved.
Accepted final sentence: “Install dependencies, then run tests.”
```

**Learner instructions**

1. Inspect the branch differences and history.
2. Merge docs/tests into main.
3. Resolve README.md to the accepted sentence and remove every conflict marker.
4. Stage the resolution, finish the merge, and verify the content and history.
5. Delete the merged local docs/tests branch.

**Completion criteria / author verification rubric**

- main contains a merge commit with the prior main and docs/tests tips as its parents.
- README.md contains exactly the accepted sentence.
- No conflict markers or unmerged paths remain.
- notes.txt remains unchanged.
- The working tree is clean and the local docs/tests branch is deleted.

**Progressive hints**

1. The current branch receives the merge; begin on main.
2. Both branch changes are needed in the final sentence.
3. After editing the conflict, stage README.md and commit to complete the merge.

**Author answer / one acceptable approach**

```text
git status
git diff main docs/tests -- README.md
git log --oneline --graph --all
git switch main
git merge docs/tests
# Resolve README.md to: Install dependencies, then run tests.
git diff
git add README.md
git diff --staged
git commit -m "Combine installation and testing instructions"
git log --oneline --graph --all
git status
git branch -d docs/tests
```

**Targeted feedback**

- **Only installation or only testing remains:** The requirement calls for both instructions. Resolve to the intended combined content instead of choosing one side automatically.
- **Git still reports an unmerged path:** After resolving the file, stage it to mark that conflict handled, then complete the merge.
- **A new commit exists on docs/tests but main is unchanged:** The receiving branch was wrong. Check the current branch before beginning the merge.

## Git unit 8: Working with remote repositories

<a id="git-8-1"></a>

### Mini lesson: Clone a repository

Content ID: `git-8-1`

Cloning makes a local repository from an existing one. It includes Git history as well as checked-out files. Git usually gives the source the remote name origin.

#### Commands and concepts

```text
git clone /training/website.git website
```

Copy the supplied repository into a new local folder named website. The source can be a local path or a remote URL.

```text
cd website
```

Enter the new working folder.

```text
git remote -v
```

Show remote names and the addresses used for fetching and pushing. -v means verbose.

```text
git branch -vv
```

Show branches with extra details, including tracking relationships when configured.

#### Worked example

```text
Source repository: /training/website.git
Local working copy: /workspace/website
Remote name: origin

Editing the local copy does not automatically edit the source.
```

#### When a developer uses this

A developer joining an existing codebase normally clones its repository rather than copying a downloaded folder and starting a new history.

Reference: [Official documentation](https://git-scm.com/docs/git-clone)

<a id="gp047"></a>

### GP047 — Clone a prepared remote

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Clone a repository](#git-8-1)

**Starting state**

```text
$ pwd
/workspace
# /training/sample-app.git exists; its default branch is main.
# /workspace/sample-app does not exist yet.
```

**File contents or supporting context**

```text
Write observations about the local copy and origin here.
```

**Instructions**

1. Clone /training/sample-app.git into a folder named sample-app.
2. Enter the new folder.
3. Inspect its remote and current branch.

**Completion criteria**

Your local clone has origin pointing to the supplied training repository.

**Hint**

git clone accepts a local repository path as well as a network URL.

**Author answer / one acceptable approach**

```text
git clone /training/sample-app.git sample-app
cd sample-app
git remote -v
git branch -vv
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="git-8-2"></a>

### Mini lesson: Push a branch to a remote

Content ID: `git-8-2`

Commits are local until you share them. A push sends the needed Git objects and asks the remote repository to update a branch. The remote must allow you to write there.

#### Commands and concepts

```text
git remote -v
```

Check the destination before pushing.

```text
git push -u origin docs/install
```

Push the local docs/install branch to origin. -u sets its upstream tracking branch.

```text
git branch -vv
```

Check the resulting association with origin/docs/install.

#### Worked example

```text
git push -u origin docs/install

Later, on this branch, a normal git push can use its configured
upstream relationship. origin is a conventional remote name,
not a special synonym for GitHub.
```

#### When a developer uses this

A developer pushes a feature branch so teammates can see it and so GitHub can offer a pull request for it.

Reference: [Official documentation](https://git-scm.com/docs/git-push)

<a id="gp048"></a>

### GP048 — Publish a new branch

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Push a branch to a remote](#git-8-2)

**Starting state**

```text
$ git branch -vv
* docs/setup b20c222 Document setup
  main       a10b111 Initial README
$ git remote -v
origin /training/sample-app.git (fetch)
origin /training/sample-app.git (push)
```

**File contents or supporting context**

```text
Working tree is clean; docs/setup has one unpublished commit.
```

**Instructions**

1. Inspect the configured origin.
2. Push docs/setup and set its upstream.
3. Verify the tracking relationship.

**Completion criteria**

origin/docs/setup exists and the local branch tracks it.

**Hint**

Use git push -u origin docs/setup.

**Author answer / one acceptable approach**

```text
git remote -v
git push -u origin docs/setup
git branch -vv
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="gp060"></a>

### GP060 — Publish another branch

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Push a branch to a remote](#git-8-2)

**Starting state**

```text
On clean docs/help with one unpublished commit. origin points to the writable training repository.
```

**Instructions**

1. Inspect origin, then publish docs/help with tracking.
2. Verify the association.

**Completion criteria**

docs/help tracks origin/docs/help and its commit is shared.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git remote -v
git push -u origin docs/help
git branch -vv
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="q04"></a>

### Q04 — Check your understanding: local and remote repositories

Type: short quiz · 3 single-answer questions · Suggested completion: 2/3, with all missed explanations reviewed.

**Learner instructions:** Choose one answer for each question. You do not need to type commands in this check.

#### Q04.1

What does cloning normally create?

- **A.** A new repository under your GitHub account automatically.
- **B.** A local repository with history and checked-out files.
- **C.** A pull request.
- **D.** Only an empty folder.

**Author answer:** B.

**Explanation:** A clone is a local Git repository based on an existing one. Creating your own hosted repository is a separate action.

**If missed, review:** [Clone a repository](#git-8-1)

#### Q04.2

What is origin?

- **A.** The only branch Git permits.
- **B.** A command that creates commits.
- **C.** A conventional name for a configured remote.
- **D.** A special name that always means GitHub.

**Author answer:** C.

**Explanation:** origin is a common remote name chosen by cloning. Its address may point to GitHub, another host, or a local repository path.

**If missed, review:** [Clone a repository](#git-8-1)

#### Q04.3

What does -u add to git push -u origin docs/help?

- **A.** It requires every later push to use a new branch.
- **B.** It undoes the latest commit.
- **C.** It uploads ignored credentials.
- **D.** It sets an upstream tracking relationship for the branch.

**Author answer:** D.

**Explanation:** The upstream relationship associates the local branch with its remote counterpart and supports convenient later pushes and status information.

**If missed, review:** [Push a branch to a remote](#git-8-2)

## Git unit 9: Keeping shared work synchronized

<a id="git-9-1"></a>

### Mini lesson: Fetch first, then integrate

Content ID: `git-9-1`

A remote-tracking branch such as origin/main records Git’s latest fetched view of the remote branch. Fetch refreshes that view without automatically changing your working branch.

#### Commands and concepts

```text
git fetch origin
```

Download updates from origin and update the remote-tracking references.

```text
git log main..origin/main --oneline
```

List commits reachable from origin/main that are not reachable from main. The two-dot notation selects this range.

```text
git merge --ff-only origin/main
```

Move the current branch forward only if a fast-forward is possible. Refuse rather than create a merge commit when histories diverge.

#### Worked example

```text
Before fetch: your view of origin/main may be old.
After fetch: you can inspect the new remote commits.
After a fast-forward merge: your local main includes them.
```

#### When a developer uses this

A developer can inspect a teammate’s update before incorporating it. This makes the difference between downloading changes and integrating changes explicit.

Reference: [Official documentation](https://git-scm.com/docs/git-fetch)

<a id="gp049"></a>

### GP049 — Inspect updates before integrating

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Fetch first, then integrate](#git-9-1)

**Starting state**

```text
$ git status
On branch main
nothing to commit, working tree clean
# Remote main is two commits ahead; local main has no unique commits.
```

**File contents or supporting context**

```text
No file edits are needed.
```

**Instructions**

1. Fetch origin.
2. Inspect commits on origin/main that local main lacks.
3. Fast-forward your clean main to origin/main.

**Completion criteria**

Local main includes the teammate’s commits without creating a merge commit.

**Hint**

Use git log main..origin/main after fetching.

**Author answer / one acceptable approach**

```text
git fetch origin
git log --oneline main..origin/main
git merge --ff-only origin/main
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp061"></a>

### GP061 — Inspect one incoming commit

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Fetch first, then integrate](#git-9-1)

**Starting state**

```text
Clean main has no unique commits. Remote main is one commit ahead adding guide.txt.
```

**Instructions**

1. Fetch origin and inspect the incoming commit.
2. Fast-forward your local main.

**Completion criteria**

Local main includes the guide addition without a merge commit.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git fetch origin
git log main..origin/main --oneline
git merge --ff-only origin/main
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="git-9-2"></a>

### Mini lesson: Integrate a diverged branch

Content ID: `git-9-2`

A branch has diverged when both sides contain commits the other lacks. Git may reject your push because replacing the remote tip would omit its newer history. Preserve both contributions by integrating them first.

#### Commands and concepts

```text
git fetch origin
```

Get the remote’s current history before deciding how to combine it.

```text
git log --graph --oneline --all
```

See where the two histories separated.

```text
git merge origin/main
```

Combine the fetched branch with your current branch. With divergence, this normally creates a merge commit.

```text
git push origin main
```

Publish the combined history after verifying it. git pull also fetches and integrates, using the selected merge or rebase behavior.

#### Worked example

```text
A → B (your main)
└ → C (remote main)

Merge result: B and C → D
Push D so both contributions remain in shared history.
```

#### When a developer uses this

A developer working on a shared branch may be a few minutes behind a teammate. A rejected push is often a signal to integrate that work, not an invitation to overwrite it.

Reference: [Official documentation](https://git-scm.com/docs/git-pull)

<a id="gp050"></a>

### GP050 — Handle a rejected push

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Integrate a diverged branch](#git-9-2)

**Starting state**

```text
$ git push
! [rejected] main -> main (non-fast-forward)
# Local main and remote main each have one unique commit.
# Working tree is clean.
```

**File contents or supporting context**

```text
Local commit updates README.md.
Remote commit adds examples.json.
```

**Instructions**

1. Fetch the new history and inspect the graph.
2. Merge origin/main into local main; assume there are no conflicts.
3. Push the combined result.

**Completion criteria**

The remote contains both contributions and the merge commit.

**Hint**

Bring both histories together with a merge before pushing.

**Author answer / one acceptable approach**

```text
git fetch origin
git log --oneline --graph --all
git merge origin/main
# Accept a meaningful merge message if an editor opens.
git push origin main
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp062"></a>

### GP062 — Combine two documentation contributions

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Integrate a diverged branch](#git-9-2)

**Starting state**

```text
Clean main has a unique README edit. Remote main has a unique help.txt addition. The changes merge without conflicts.
```

**Instructions**

1. Fetch, inspect divergence, and merge origin/main.
2. Verify and push the combined result.

**Completion criteria**

Both contributions are present in the shared history.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git fetch origin
git log --oneline --graph --all
git merge origin/main
git show --stat HEAD
git push origin main
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="q05"></a>

### Q05 — Check your understanding: synchronization

Type: short quiz · 3 single-answer questions · Suggested completion: 2/3, with all missed explanations reviewed.

**Learner instructions:** Choose one answer for each question. You do not need to type commands in this check.

#### Q05.1

What does git fetch origin do without a later merge or rebase?

- **A.** Replace your local main with the remote contents.
- **B.** Open a pull request.
- **C.** Commit your untracked files.
- **D.** Refresh remote-tracking information and download needed Git objects.

**Author answer:** D.

**Explanation:** Fetch obtains remote history and updates the corresponding references. It does not automatically integrate those changes into your checked-out branch.

**If missed, review:** [Fetch first, then integrate](#git-9-1)

#### Q05.2

Local main and origin/main each have a unique commit. What describes this state?

- **A.** Local files are necessarily deleted.
- **B.** Their histories have diverged.
- **C.** The remote must be broken.
- **D.** They are identical.

**Author answer:** B.

**Explanation:** Both histories contain work the other lacks. Inspect and integrate the contributions before trying to publish a combined result.

**If missed, review:** [Integrate a diverged branch](#git-9-2)

#### Q05.3

A push is rejected because a teammate pushed first. What is the appropriate next step?

- **A.** Repeat git add until the push works.
- **B.** Force-push immediately.
- **C.** Fetch and inspect the incoming work, then integrate it appropriately.
- **D.** Delete the teammate’s branch.

**Author answer:** C.

**Explanation:** A non-fast-forward rejection can protect remote work you do not yet have. Fetching and inspecting lets you preserve both contributions.

**If missed, review:** [Integrate a diverged branch](#git-9-2)

## Git unit 10: Rebasing and cleaning up commits

<a id="git-10-1"></a>

### Mini lesson: Replay commits with rebase

Content ID: `git-10-1`

Rebasing takes a branch’s changes and replays them on a different base. Replayed commits receive new identities because their history has changed. Start by practicing with unpublished work.

#### Commands and concepts

```text
git rebase main
```

While on your feature branch, replay its commits on main.

```text
git rebase --continue
```

After resolving a conflict and staging the result, continue replaying commits.

```text
git rebase --abort
```

Cancel the rebase and return to the branch’s pre-rebase position.

```text
git diff main..HEAD -- README.md
```

Compare your resulting branch tip with main for this file.

#### Worked example

```text
Before: A → B (main)
         └ → C (feature)
After:  A → B (main) → C′ (feature)

C′ has the intended change from C but a different parent.
```

#### When a developer uses this

A developer may update an unpublished feature to start from the latest main. Rewriting commits that teammates already use needs coordination, so do not treat rebase as a routine replacement for every merge.

Reference: [Official documentation](https://git-scm.com/docs/git-rebase)

<a id="gp051"></a>

### GP051 — Rebase an unpublished branch

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Replay commits with rebase](#git-10-1)

**Starting state**

```text
$ git log --graph --oneline --all
* c30d333 (docs/setup) Add setup notes
| * b20c222 (main) Add sensor example
|/
* a10b111 Initial project
# Currently on docs/setup; clean working tree.
```

**File contents or supporting context**

```text
The setup notes must remain after rebasing.
```

**Instructions**

1. Inspect the starting graph.
2. Rebase docs/setup onto main; assume no conflicts.
3. Inspect the resulting graph and README diff.

**Completion criteria**

Your documentation change follows the latest main commit and its content is preserved.

**Hint**

While on docs/setup, use git rebase main.

**Author answer / one acceptable approach**

```text
git log --graph --oneline --all
git rebase main
git log --graph --oneline --all
git diff main..HEAD -- README.md
# If a real rebase conflicts: resolve, add, rebase --continue; or rebase --abort.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp063"></a>

### GP063 — Rebase a second unpublished branch

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Replay commits with rebase](#git-10-1)

**Starting state**

```text
Clean docs/help has one unpublished help.txt commit. main gained a separate settings commit after the branches split. No conflicts.
```

**Instructions**

1. Inspect the graph and replay docs/help on main.
2. Verify the help addition remains after the updated base.

**Completion criteria**

The help change follows current main and remains unpublished.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git log --oneline --graph --all
git rebase main
git log --oneline --graph --all
git diff main..HEAD -- help.txt
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="git-10-2"></a>

### Mini lesson: Combine commits with squash

Content ID: `git-10-2`

Sometimes several small commits describe one finished change. Squashing combines them into a single commit. Interactive rebase gives you a list of operations to perform on your recent history.

#### Commands and concepts

```text
git rebase -i HEAD~3
```

Open the interactive todo for the last three commits. -i means interactive; HEAD~3 identifies the starting base before those commits.

```text
pick / squash
```

Keep the first commit as pick. Set later commits to squash to fold them into the preceding commit and edit the combined message.

```text
git log --oneline -2
```

Inspect the resulting commit and its parent.

#### Worked example

```text
pick a1b2c3d Add installation guide
squash b2c3d4e Fix spelling
squash c3d4e5f Clarify the test command

The todo is ordered oldest first. Preserve its commit identifiers.
```

#### When a developer uses this

A developer can turn three unpublished drafting commits into one understandable change before review. GitHub’s squash-merge option offers a related result when integrating a PR into its base branch.

Reference: [Official documentation](https://git-scm.com/docs/git-rebase)

<a id="gp052"></a>

### GP052 — Squash small unpublished corrections

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Combine commits with squash](#git-10-2)

**Starting state**

```text
$ git log --oneline -4
d40e444 Improve wording
c30d333 Fix typo
b20c222 Draft README update
a10b111 Base commit
```

**File contents or supporting context**

```text
pick b20c222 Draft README update
pick c30d333 Fix typo
pick d40e444 Improve wording
```

**Instructions**

1. Start an interactive rebase for the last three commits.
2. Keep the first as pick and mark the next two squash.
3. Use one clear message, then inspect the resulting history and content.

**Completion criteria**

One commit describes the README update and includes all three commits’ final changes.

**Hint**

The interactive todo is oldest first, unlike the usual log display.

**Author answer / one acceptable approach**

```text
git rebase -i HEAD~3
# Keep first line pick; change second and third to squash.
# Save and choose: Document sensor setup
git log --oneline -2
git diff a10b111 HEAD -- README.md
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="gp064"></a>

### GP064 — Combine two drafting commits

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Combine commits with squash](#git-10-2)

**Starting state**

```text
Clean branch. Last commits: a10b111 base, b20c222 add help text, c30d333 correct its example.
```

**Instructions**

1. Squash the last two unpublished commits into one.
2. Use “Document the help command” as the final message.
3. Verify the final contents.

**Completion criteria**

One commit includes the complete help documentation.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git rebase -i HEAD~2
# pick b20c222; squash c30d333
# Message: Document the help command
git log --oneline -2
git diff a10b111 HEAD
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="q06"></a>

### Q06 — Check your understanding: rebase and squash

Type: short quiz · 3 single-answer questions · Suggested completion: 2/3, with all missed explanations reviewed.

**Learner instructions:** Choose one answer for each question. You do not need to type commands in this check.

#### Q06.1

What does rebasing an unpublished feature branch onto current main usually do?

- **A.** Upload every file to GitHub.
- **B.** Delete main.
- **C.** Combine every commit into one automatically.
- **D.** Replay its changes on the new base, creating replacement commits.

**Author answer:** D.

**Explanation:** Rebase changes the parent history of replayed work, so commit identities can change. It does not necessarily squash commits.

**If missed, review:** [Replay commits with rebase](#git-10-1)

#### Q06.2

In an interactive rebase todo, how do you combine two adjacent commits?

- **A.** Mark the first squash with no preceding commit.
- **B.** Keep the first as pick and mark the next squash.
- **C.** Change both commit identifiers to HEAD.
- **D.** Mark both drop.

**Author answer:** B.

**Explanation:** squash folds a commit into the preceding retained commit. Preserve the todo’s commit identifiers and use the requested operations.

**If missed, review:** [Combine commits with squash](#git-10-2)

#### Q06.3

Why does rewriting already-shared commits need coordination?

- **A.** Git cannot identify any commits after a push.
- **B.** Other people may have based work on the original commit history.
- **C.** Rebase always removes file contents.
- **D.** Shared branches cannot have messages.

**Author answer:** B.

**Explanation:** Teammates may rely on the existing history. Rewriting it changes the references they need to reconcile; do not treat shared-history rewrites as an isolated local cleanup.

**If missed, review:** [Replay commits with rebase](#git-10-1)

## Git unit 11: Interruptions and moving changes

<a id="git-11-1"></a>

### Mini lesson: Set unfinished work aside with stash

Content ID: `git-11-1`

A stash temporarily stores unfinished changes so you can return to a clean working tree. By default it does not include untracked files. Stash entries are local working aids, not shared commits on a project branch.

#### Commands and concepts

```text
git stash push -u -m "Pause documentation"
```

Save tracked and untracked changes. -u includes untracked files; -m gives the stash a useful description.

```text
git stash apply stash@{0}
```

Apply the newest stash without deleting its saved entry. Applying can cause conflicts.

```text
git stash drop stash@{0}
```

Delete that saved entry after you have verified the restored work.

```text
git switch main
```

With work safely set aside, switch to the branch for another task.

#### Worked example

```text
git stash push -u -m "Pause documentation"
git switch main
# Handle another task.
git switch docs/install
git stash apply stash@{0}
# Verify all restored files before dropping the stash.
```

#### When a developer uses this

A developer can pause a half-written change to investigate an urgent bug, then return to the original work without making an artificial “finished” commit.

Reference: [Official documentation](https://git-scm.com/docs/git-stash)

<a id="gp053"></a>

### GP053 — Pause work for an urgent fix

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Set unfinished work aside with stash](#git-11-1)

**Starting state**

```text
$ git status --short
 M README.md
?? notes.txt
# On feature/report. No existing stashes.
```

**File contents or supporting context**

```text
README.md: unfinished report instructions
notes.txt: observations
```

**Instructions**

1. Stash the tracked and untracked work with a useful message.
2. Switch to main, then return to feature/report.
3. Apply the stash and inspect the restored work before dropping the stash.

**Completion criteria**

Both files are restored on feature/report; the verified stash entry is removed.

**Hint**

Use stash push -u, then apply, inspect, and drop.

**Author answer / one acceptable approach**

```text
git stash push -u -m "Pause report documentation"
git switch main
git switch feature/report
git stash apply stash@{0}
git status
git diff
# Check notes.txt too, then:
git stash drop stash@{0}
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="gp065"></a>

### GP065 — Pause two new files

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Set unfinished work aside with stash](#git-11-1)

**Starting state**

```text
On feature/search. README.md modified; notes.txt and todo.txt untracked. No existing stashes.
```

**Instructions**

1. Stash the unfinished tracked README edit and two new untracked notes.
2. Return to the work after switching to main and back.
3. Verify all files before dropping the stash.

**Completion criteria**

All three unfinished files are restored on feature/search.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git stash push -u -m "Pause search work"
git switch main
git switch feature/search
git stash apply stash@{0}
git status
cat notes.txt todo.txt
git diff
git stash drop stash@{0}
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="git-11-2"></a>

### Mini lesson: Apply one commit with cherry-pick

Content ID: `git-11-2`

Cherry-pick applies the change from a selected commit to your current branch. It usually creates a new commit there. It does not automatically bring all the other changes from the source branch.

#### Commands and concepts

```text
git show a1b2c3d
```

Inspect the selected change and check that it does not depend on other unfinished work.

```text
git switch main
```

Select the branch that should receive the change.

```text
git cherry-pick a1b2c3d
```

Apply the selected commit. If conflicts occur, resolve and stage them, then use git cherry-pick --continue; --abort cancels the operation.

#### Worked example

```text
feature branch: A → B (new feature) → C (standalone typo fix)
main:           A → C′ (the typo fix applied separately)

B is not automatically included in C′.
```

#### When a developer uses this

A developer may need one independent fix from an unfinished feature branch. Inspecting its dependencies first avoids bringing across a patch that cannot work on its own.

Reference: [Official documentation](https://git-scm.com/docs/git-cherry-pick)

<a id="gp054"></a>

### GP054 — Bring across one specific fix

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Apply one commit with cherry-pick](#git-11-2)

**Starting state**

```text
$ git status
On branch feature/report
nothing to commit, working tree clean
# c30d333 changes README spelling only; it applies cleanly to main.
```

**File contents or supporting context**

```text
Feature history also contains an unrelated report.json change.
```

**Instructions**

1. Inspect c30d333 to confirm its scope.
2. Switch to main and apply that commit.
3. Verify the typo fix is present and unrelated feature changes are absent.

**Completion criteria**

main contains the typo correction without the unfinished report feature.

**Hint**

Inspect first, then cherry-pick on the destination branch.

**Author answer / one acceptable approach**

```text
git show c30d333
git switch main
git cherry-pick c30d333
git show --stat HEAD
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="q07"></a>

### Q07 — Check your understanding: stash and cherry-pick

Type: short quiz · 3 single-answer questions · Suggested completion: 2/3, with all missed explanations reviewed.

**Learner instructions:** Choose one answer for each question. You do not need to type commands in this check.

#### Q07.1

Why include -u in git stash push -u?

- **A.** To include untracked files along with tracked changes.
- **B.** To replace every commit message.
- **C.** To erase the current branch.
- **D.** To upload the stash to GitHub.

**Author answer:** A.

**Explanation:** Untracked files are not included by default. -u includes them so new unfinished files can be set aside with tracked edits.

**If missed, review:** [Set unfinished work aside with stash](#git-11-1)

#### Q07.2

How does git stash apply differ from dropping a stash?

- **A.** apply restores changes while retaining the saved entry; drop removes the entry.
- **B.** apply deletes the saved work permanently.
- **C.** apply always commits the work.
- **D.** They are identical commands.

**Author answer:** A.

**Explanation:** Applying and then verifying before dropping keeps a recovery copy available during restoration. Application can still produce conflicts.

**If missed, review:** [Set unfinished work aside with stash](#git-11-1)

#### Q07.3

What does cherry-pick normally apply?

- **A.** The change from a selected commit onto the current branch.
- **B.** The entire remote repository into a new folder.
- **C.** Every branch in the repository.
- **D.** Only ignored files.

**Author answer:** A.

**Explanation:** Cherry-pick applies selected committed changes, usually creating a new commit. It does not automatically merge the source branch’s other commits.

**If missed, review:** [Apply one commit with cherry-pick](#git-11-2)

## Git unit 12: Recovering work

<a id="git-12-1"></a>

### Mini lesson: Find a lost commit with reflog

Content ID: `git-12-1`

Normal log output follows commit history from a reference. The reflog records recent local movements of references, such as a reset moving HEAD backward. A commit can be missing from the current branch’s log while still being recoverable.

#### Commands and concepts

```text
git reflog
```

Show recent local reference movements. HEAD@{0} is the latest recorded HEAD position; HEAD@{1} is the previous entry.

```text
git branch recovered-work a1b2c3d
```

Create a branch pointing to the still-available commit you found. This gives it a name before you do anything else.

```text
git switch recovered-work
```

Open the recovered branch and inspect its files.

#### Worked example

```text
git reflog
# Find the identifier before the accidental reset.
git branch recovered-work a1b2c3d
git switch recovered-work
git show HEAD
```

#### When a developer uses this

A developer who moved a branch pointer by mistake can often recover its earlier commits. Reflog expires and is local; it cannot guarantee recovery of uncommitted work or replace backups.

Reference: [Official documentation](https://git-scm.com/docs/git-reflog)

<a id="gp055"></a>

### GP055 — Recover a commit after an accidental reset

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Find a lost commit with reflog](#git-12-1)

**Starting state**

```text
$ git reflog -3
a10b111 HEAD@{0}: reset: moving to HEAD~1
b20c222 HEAD@{1}: commit: Document setup
a10b111 HEAD@{2}: commit (initial): Initial README
# Working tree is clean.
```

**File contents or supporting context**

```text
The missing commit is b20c222.
```

**Instructions**

1. Inspect the reflog and identify the previous tip.
2. Create recovered-work at b20c222.
3. Switch to that branch and inspect the recovered README change.

**Completion criteria**

The missing commit is reachable through recovered-work.

**Hint**

Create a branch at the recovered identifier before doing more history edits.

**Author answer / one acceptable approach**

```text
git reflog
git branch recovered-work b20c222
git switch recovered-work
git show HEAD -- README.md
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="git-12-2"></a>

### Mini lesson: Keep a commit made on a detached HEAD

Content ID: `git-12-2`

Normally HEAD refers to the current branch. In a detached HEAD state it refers directly to a commit instead. You can still make commits there, but creating a branch is the simple way to give that new work a stable name.

#### Commands and concepts

```text
git status
```

Read whether you are on a branch or in a detached HEAD state.

```text
git log -1 --oneline
```

Identify the commit you want to preserve.

```text
git switch -c docs/recovered
```

Create a branch at your current commit and attach HEAD to it.

#### Worked example

```text
Before: HEAD → C (no branch points here)
git switch -c docs/recovered
After: HEAD → docs/recovered → C
```

#### When a developer uses this

A developer experimenting with an older version might make a useful fix there. Creating a branch keeps the new commit easy to find and continue working on.

Reference: [Official documentation](https://git-scm.com/docs/git-switch)

<a id="gp056"></a>

### GP056 — Keep work made on a detached HEAD

Type: practice · Response: Terminal commands and file edits · Mini lesson: [Keep a commit made on a detached HEAD](#git-12-2)

**Starting state**

```text
$ git status
HEAD detached from a10b111
nothing to commit, working tree clean
$ git log -1 --oneline
e50f555 Explain sample data
```

**File contents or supporting context**

```text
The latest commit contains documentation you want to keep.
```

**Instructions**

1. Inspect status and the latest commit.
2. Create a branch named docs/recovered at the current position.
3. Verify that HEAD is attached to the new branch and the commit remains.

**Completion criteria**

docs/recovered points to your new commit and the working tree is clean.

**Hint**

git switch -c can attach a new branch at the current commit.

**Author answer / one acceptable approach**

```text
git status
git log -1 --oneline
git switch -c docs/recovered
git branch -vv
git status
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Check the staged content separately from working-file edits when a task involves a commit.

<a id="c05"></a>

### C05 — Checkpoint: Recover a commit and return to useful work

Type: practical checkpoint · Completion: every listed outcome met · Unlimited retries.

**What this checks**

Use local history evidence to preserve a recoverable commit. Once it has a branch name, make a small follow-up change and use the normal Git workflow again.

Reuses: [Find a lost commit with reflog](#git-12-1), [Keep a commit made on a detached HEAD](#git-12-2), [Set unfinished work aside with stash](#git-11-1), [Apply one commit with cherry-pick](#git-11-2)

**Prepared starting state**

```text
Available commit objects: A → B → C.
A: README.md contains “# Notes”.
B: adds guide.txt containing “Install dependencies.”
C: appends “Run tests.” to guide.txt.
main and HEAD now point to A after an accidental reset. Working tree clean.
Reflog newest first: A reset to A; C commit Add testing instruction; B commit Add installation guide.
No branch currently points to B or C, but both objects remain available.
```

**Learner instructions**

1. Inspect the reflog and find C’s actual identifier.
2. Create recovered-guide at C and switch to it.
3. Verify guide.txt contains both installation and testing lines.
4. Append “Inspect the result.” to guide.txt, then inspect, stage, and commit the follow-up.
5. Verify that the new branch preserves the recovered history and the new commit while main still points to A.

**Completion criteria / author verification rubric**

- recovered-guide contains C and its ancestors.
- Its new tip adds the follow-up as a child of C.
- guide.txt contains all three instructions in the required order.
- main remains at A.
- The working tree is clean.

**Progressive hints**

1. Look for the position before the accidental reset.
2. Create a branch at the actual recovered identifier before making more history changes.
3. Use git branch recovered-guide <actual-C-id>, switch to it, then use the familiar edit → stage → commit workflow.

**Author answer / one acceptable approach**

```text
git reflog
git branch recovered-guide <actual-C-id>
git switch recovered-guide
cat guide.txt
echo "Inspect the result." >> guide.txt
git diff
git add guide.txt
git diff --staged
git commit -m "Add result inspection reminder"
git log --oneline --graph --all
git status
```

**Targeted feedback**

- **Branch points to B instead of C:** You preserved only the installation version. Inspect reflog and choose the tip that also includes the testing instruction.
- **main moved during recovery:** The task asks you to preserve main and create a separate recovery branch. Naming the recovered commit avoids another reset.
- **Follow-up was made on detached HEAD:** Attach a branch to the recovered history before continuing, or create a branch at your new detached commit to preserve it.

# Course: GitHub

## GitHub unit 1: Understanding a GitHub repository

<a id="github-1-1"></a>

### Mini lesson: Find information in a GitHub repository

Content ID: `github-1-1`

Git tracks versions. GitHub hosts repositories and adds tools for discussing work, reviewing changes, and running automation. You do not need to memorize every tab; start with where each kind of information belongs.

#### Commands and concepts

```text
Code → README.md
```

The Code tab shows repository files. A README usually explains what the project does and how to run it.

```text
Issues
```

Find bug reports, feature requests, and acceptance criteria—the conditions that describe a completed task.

```text
Actions
```

Inspect automated workflow runs, such as tests. A run belongs to a particular event and revision.

```text
Branch selector
```

Choose which branch’s files to view. The default branch is the repository’s main starting point, often named main.

#### Worked example

```text
Need the installation command? → README
Need the expected behavior for a bug? → Issue
Need the failing test output? → Actions run logs
Need an unmerged change? → Its branch or pull request
```

#### When a developer uses this

A developer investigating an unfamiliar library can read its setup instructions, find an existing bug report, and check whether tests are passing before making a change.

Reference: [Official documentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories)

<a id="hp001"></a>

### HP001 — Find your way around the repository

Type: practice · Response: Written response or the corresponding GitHub interaction · Mini lesson: [Find information in a GitHub repository](#github-1-1)

**Starting state**

```text
GitHub repository: training-team/sample-app
Tabs: Code | Issues | Pull requests | Actions | Wiki
Default branch: main
README.md: setup and testing instructions
Issue #12: Clarify sample timestamps
Actions: Test suite — latest run passed
```

**File contents or supporting context**

```text
Write the four locations and what each tells you.
```

**Instructions**

1. Identify where to read setup instructions.
2. Locate issue #12 and its acceptance criteria.
3. Locate the latest automated test run and the default branch.

**Completion criteria**

Your notes correctly map README, Issues, Actions, and the main branch to their purposes.

**Hint**

Use the repository tabs; GitHub commits and your local commits are the same kind of Git history.

**Author answer / one acceptable approach**

```text
Code → README.md: setup and test commands.
Issues → #12: requirements for the change.
Actions → Test suite: latest automated run.
Code branch selector: main is the default branch.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="github-1-2"></a>

### Mini lesson: Read a pull request’s actual changes

Content ID: `github-1-2`

A pull request has a title and description, but its diff shows what it actually changes. Reviewing the complete diff helps you catch unrelated edits and compare the implementation with the stated purpose.

#### Commands and concepts

```text
Files changed
```

Open the PR’s file-by-file differences. Added and removed lines describe the proposed change.

```text
Base / compare
```

The base branch is the destination. The compare, or head, branch supplies the proposed work.

```text
Line comment
```

Attach a specific question or requested correction to the relevant changed line.

#### Worked example

```text
PR title: Fix spelling in installation guide
Changed files:
  README.md    → spelling correction
  pricing.json → monthly price change

The price change deserves a separate explanation and review.
```

#### When a developer uses this

A developer reviewing a small documentation PR can catch an accidental configuration edit before it reaches the main branch.

Reference: [Official documentation](https://docs.github.com/en/pull-requests/reviewing-changes-in-pull-requests)

<a id="hp002"></a>

### HP002 — Read the pull request difference

Type: practice · Response: Written response or the corresponding GitHub interaction · Mini lesson: [Read a pull request’s actual changes](#github-1-2)

**Starting state**

```text
PR #8: Fix README spelling
Base: main ← Compare: docs/spelling
Files changed: 2
README.md: senor → sensor
settings.json: intervalMinutes 5 → 60
```

**File contents or supporting context**

```text
Draft your review comment here.
```

**Instructions**

1. Read the two-file diff below.
2. Identify the change that does not match the PR’s purpose.
3. Write a specific review comment explaining what should be separated.

**Completion criteria**

You identify the interval change as unrelated to the documentation title.

**Hint**

Compare the stated purpose with every changed file.

**Author answer / one acceptable approach**

```text
The README fix matches the PR. settings.json also changes the interval from 5 to 60 minutes. Please move that behavior change into a separate PR with its own requirement and tests.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="q08"></a>

### Q08 — Check your understanding: repository navigation

Type: short quiz · 3 single-answer questions · Suggested completion: 2/3, with all missed explanations reviewed.

**Learner instructions:** Choose one answer for each question. You do not need to type commands in this check.

#### Q08.1

Where can you find a bug report’s expected behavior and acceptance criteria?

- **A.** A stash entry on another person’s machine.
- **B.** The browser download list.
- **C.** Only the local Git config.
- **D.** The relevant issue.

**Author answer:** D.

**Explanation:** Issues track tasks and their requirements. Read the specific issue rather than inferring expectations from an unrelated change.

**If missed, review:** [Find information in a GitHub repository](#github-1-1)

#### Q08.2

A PR title says “Fix spelling,” but the diff also changes a price. What should you do?

- **A.** Ignore the second file.
- **B.** Approve based on the title.
- **C.** Ask about the unrelated pricing change and its scope.
- **D.** Delete the repository.

**Author answer:** C.

**Explanation:** The diff is evidence of what the PR actually changes. A price update needs its own justification and review even when the title sounds harmless.

**If missed, review:** [Read a pull request’s actual changes](#github-1-2)

#### Q08.3

Where do you inspect the logs for an automated test run?

- **A.** The branch selector alone.
- **B.** Actions, then the relevant run and job.
- **C.** The Wiki page list alone.
- **D.** The README filename alone.

**Author answer:** B.

**Explanation:** Actions organizes workflow runs and their logs. Repository documentation and source views provide different information.

**If missed, review:** [Find information in a GitHub repository](#github-1-1)

## GitHub unit 2: Starting and connecting a project

<a id="github-2-1"></a>

### Mini lesson: Template, fork, or clone?

Content ID: `github-2-1`

These operations create different kinds of copies. A template starts a new project from prepared content. A fork creates a GitHub repository related to an original project. A clone creates a local Git repository on your computer.

#### Commands and concepts

```text
Use this template
```

Create a new GitHub repository from the starter content. Select the owner, name, and visibility.

```text
git clone https://github.com/YOUR_USERNAME/website.git
```

Copy your new repository to your computer. Replace YOUR_USERNAME with your account name.

```text
git remote -v
```

Verify that origin refers to the repository you intend to work with.

#### Worked example

```text
Template → your new repository on GitHub
Clone your repository → local working folder

Downloading or cloning someone else’s repository does not
automatically create a repository under your GitHub account.
```

#### When a developer uses this

A developer can use a company starter template for a new service, then clone their newly created repository to begin working locally.

Reference: [Official documentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)

<a id="hp003"></a>

### HP003 — Create your project from the template

Type: practice · Response: GitHub actions and/or terminal commands; written plan if running in a simulation · Mini lesson: [Template, fork, or clone?](#github-2-1)

**Starting state**

```text
GitHub: training-team/sample-app-starter
Template repository: yes
Contains README.md, package.json, tests/, .github/workflows/tests.yml
Exercise requirement: public repository owned by you
```

**File contents or supporting context**

```text
Write the GitHub steps, then the local command.
```

**Instructions**

1. Describe how to create your own repository from the template.
2. Choose public visibility for this practice repository and name it sample-app.
3. Write the clone command using YOUR_USERNAME as a placeholder.

**Completion criteria**

You have a clear create-from-template → own repository → local clone sequence.

**Hint**

Create your repository before cloning it; cloning the original does not create one on your account.

**Author answer / one acceptable approach**

```text
Open the template → Use this template → Create a new repository.
Select your account, name sample-app, choose Public, create.
git clone https://github.com/YOUR_USERNAME/sample-app.git
cd sample-app
git remote -v
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="hp004"></a>

### HP004 — Start a notes repository

Type: practice · Response: GitHub actions and/or terminal commands; written plan if running in a simulation · Mini lesson: [Template, fork, or clone?](#github-2-1)

**Starting state**

```text
Template: example-team/app-template. Desired repository: YOUR_USERNAME/notes-app; public for this exercise.
```

**Instructions**

1. Describe creating notes-app from example-team/app-template on your account.
2. Write the clone and verification commands.

**Completion criteria**

The cloned source is your newly created repository.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
Use this template → Create repository → YOUR_USERNAME/notes-app → Public.
git clone https://github.com/YOUR_USERNAME/notes-app.git
cd notes-app
git remote -v
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="github-2-2"></a>

### Mini lesson: Check where a push is going

Content ID: `github-2-2`

A remote URL identifies a repository. Authentication proves who you are; permissions determine whether that identity can write there. A push can fail because the URL points to the wrong project.

#### Commands and concepts

```text
git remote -v
```

Inspect origin’s fetch and push destinations.

```text
git remote set-url origin URL
```

Replace origin’s address with the correct repository URL. This does not move or erase your local commits.

```text
HTTPS authentication
```

Use a supported credential-manager sign-in or an appropriate personal access token when required. Your normal GitHub account password is not a Git-over-HTTPS password.

```text
git push -u origin docs/setup
```

Push the branch to the verified destination and establish upstream tracking.

#### Worked example

```text
Wrong destination: company/website-template
Intended destination: YOUR_USERNAME/website

git remote set-url origin https://github.com/YOUR_USERNAME/website.git
```

#### When a developer uses this

A developer who cloned a starter directly may accidentally try to push back to it. Checking the address first avoids repeatedly changing credentials for the wrong repository.

Reference: [Official documentation](https://docs.github.com/en/get-started/git-basics/about-remote-repositories)

<a id="hp005"></a>

### HP005 — Diagnose a push permission problem

Type: practice · Response: GitHub actions and/or terminal commands; written plan if running in a simulation · Mini lesson: [Check where a push is going](#github-2-2)

**Starting state**

```text
$ git remote -v
origin https://github.com/training-team/sample-app-starter.git (fetch)
origin https://github.com/training-team/sample-app-starter.git (push)
$ git push
Permission denied
# You own YOUR_USERNAME/sample-app and are on docs/setup.
```

**File contents or supporting context**

```text
Use placeholders only. Never enter a real token in this prototype.
```

**Instructions**

1. Inspect origin and compare it with the repository you own.
2. Update origin to YOUR_USERNAME/sample-app.
3. Describe how you would authenticate over HTTPS, then push docs/setup.

**Completion criteria**

The push targets your repository, with account-password authentication avoided.

**Hint**

Change the remote with git remote set-url. Use a credential manager/browser sign-in or an appropriately scoped token when required.

**Author answer / one acceptable approach**

```text
git remote -v
git remote set-url origin https://github.com/YOUR_USERNAME/sample-app.git
# Authenticate using a supported credential-manager flow.
git push -u origin docs/setup
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="c06"></a>

### C06 — Checkpoint: Create, clone, and publish a first branch

Type: practical checkpoint · Completion: every listed outcome met · Unlimited retries.

**What this checks**

Connect the browser practice to a real repository workflow. Distinguish creating a hosted repository, cloning locally, and pushing a branch.

Reuses: [Template, fork, or clone?](#github-2-1), [Check where a push is going](#github-2-2), [Clone a repository](#git-8-1), [Push a branch to a remote](#git-8-2), [Create a branch for a change](#git-6-1)

**Prepared starting state**

```text
Template: example-team/notes-starter. Contains README.md with “# Notes” and a base commit.
Required new repository: YOUR_USERNAME/notes-practice, public for this exercise.
Your account can create repositories and write to that new repository.
Current local directory: /workspace. notes-practice does not exist.
Use placeholder identifiers in authored text; a live implementation substitutes the learner’s actual account.
```

**Learner instructions**

1. Create notes-practice from the template under your account.
2. Clone your repository, enter the folder, configure local author details if needed, and verify origin.
3. Create docs/overview and append “A place for development notes.” to README.md.
4. Inspect, stage, and commit the README change.
5. Push docs/overview with upstream tracking and verify that GitHub shows the branch and commit.

**Completion criteria / author verification rubric**

- The new hosted repository is owned by the learner and was created from the template.
- The local clone’s origin points to that owned repository, not the starter.
- docs/overview contains a focused README commit.
- The pushed branch exists on GitHub and the local branch tracks it.
- Local working tree is clean.

**Progressive hints**

1. Create the owned repository before cloning; cloning the starter directly does not create a new hosted repository.
2. Inspect git remote -v before pushing.
3. Publish the new branch with git push -u origin docs/overview after configuring supported authentication.

**Author answer / one acceptable approach**

```text
GitHub: Use this template → Create repository → YOUR_USERNAME/notes-practice.

git clone https://github.com/YOUR_USERNAME/notes-practice.git
cd notes-practice
git config user.name "Practice Learner"
git config user.email "learner@example.com"
git remote -v
git switch -c docs/overview
echo "A place for development notes." >> README.md
git diff
git add README.md
git diff --staged
git commit -m "Describe the notes project"
git push -u origin docs/overview
git branch -vv
git status

GitHub: select docs/overview and inspect its README and latest commit.
```

**Targeted feedback**

- **Push targets the template repository:** Verify origin and correct its URL to the learner-owned repository before retrying.
- **Files are visible locally but no new GitHub branch exists:** A local commit is not a push. Publish the branch and inspect the remote result.
- **Sign-in succeeded but push is denied:** Check both repository destination and write permission. Authentication alone does not authorize a push to someone else’s repository.

## GitHub unit 3: Issues and project documentation

<a id="github-3-1"></a>

### Mini lesson: Write an issue that can be reproduced

Content ID: `github-3-1`

An issue tracks a bug, request, or task. A useful bug report lets another person reproduce what happened and understand what should have happened instead. Acceptance criteria turn that expectation into something testable.

#### Commands and concepts

```text
Title
```

Name the specific behavior that needs attention.

```text
Steps to reproduce
```

List the input, action, and relevant environment needed to see the problem.

```text
Expected / actual
```

State the intended result separately from the observed result.

```text
Acceptance criterion
```

Describe an observable condition that would demonstrate the fix.

#### Worked example

```text
Title: Shopping cart total omits delivery cost
Steps: Add a $20 item; choose $5 delivery; view total.
Expected: $25. Actual: $20.
Acceptance: This cart displays a $25 total before checkout.
```

#### When a developer uses this

A developer can investigate a precise report much faster than “checkout is broken.” Reproduction details also help them write a test that protects the fix.

Reference: [Official documentation](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue)

<a id="hp006"></a>

### HP006 — Turn a vague bug into an issue

Type: practice · Response: Written response or the corresponding GitHub interaction · Mini lesson: [Write an issue that can be reproduced](#github-3-1)

**Starting state**

```text
Sample input: 2026-09-11T14:00:00Z
Command: sample-app samples.json
Expected display: 14:00 UTC
Actual display: 10:00 with no time-zone label
Requirement: Display sample times in UTC
```

**File contents or supporting context**

```text
Title:
Steps to reproduce:
Expected:
Actual:
Acceptance criterion:
```

**Instructions**

1. Write a specific title.
2. Add reproduction steps, expected behavior, and actual behavior.
3. Add one observable acceptance criterion using the supplied example.

**Completion criteria**

A teammate can reproduce the mismatch and tell whether it is fixed.

**Hint**

Use the actual input and output instead of “wrong.”

**Author answer / one acceptable approach**

```text
Title: Display sample timestamps consistently in UTC
Steps: Put the supplied sample in samples.json; run sample-app samples.json.
Expected: 14:00 UTC. Actual: 10:00 without a zone.
Acceptance: That sample displays 14:00 UTC on machines in different local time zones.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="github-3-2"></a>

### Mini lesson: Use a README and wiki together

Content ID: `github-3-2`

A README is a project’s front door. A wiki can hold longer guides and reference pages when the repository supports it and the feature is enabled. Good documentation tells readers where to go next.

#### Commands and concepts

```text
README.md
```

Keep the project overview, essential setup, and important navigation links easy to find.

```text
Wiki → New page
```

Create a focused reference page, such as “Configuration options.”

```text
[Link text](URL)
```

Markdown link syntax: put the readable label in brackets and the destination in parentheses.

#### Worked example

```text
README: How to install and run the application.
Wiki: Detailed explanation of every configuration field.

[Configuration options](https://github.com/OWNER/REPO/wiki/Configuration-options)
```

#### When a developer uses this

A developer can document an input format once in a wiki and link to it from the README, instead of making the quick-start guide longer every time a field is added.

Reference: [Official documentation](https://docs.github.com/en/communities/documenting-your-project-with-wikis/about-wikis)

<a id="hp007"></a>

### HP007 — Put documentation where people can find it

Type: practice · Response: Written response or the corresponding GitHub interaction · Mini lesson: [Use a README and wiki together](#github-3-2)

**Starting state**

```text
Repository: YOUR_USERNAME/sample-app
Wiki enabled: yes
observedAt: UTC timestamp of the reading
value: numeric reading; units are specified by the dataset
```

**File contents or supporting context**

```text
## Sensor data fields

observedAt:
value:

README link sentence:
```

**Instructions**

1. Keep installation and the test command in the README.
2. Draft a wiki page titled Sensor data fields with descriptions of observedAt and value.
3. Write a README sentence linking to that wiki page.

**Completion criteria**

A newcomer can find setup quickly and follow a link to the field reference.

**Hint**

Use the wiki for the reference, and keep a clear link in README.md.

**Author answer / one acceptable approach**

```text
Wiki → New page → Sensor data fields.
observedAt: UTC timestamp when the reading was recorded.
value: numeric measurement in the dataset’s documented units.
README: See [Sensor data fields](https://github.com/YOUR_USERNAME/sample-app/wiki/Sensor-data-fields) for the input format.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="q09"></a>

### Q09 — Check your understanding: issues and documentation

Type: short quiz · 3 single-answer questions · Suggested completion: 2/3, with all missed explanations reviewed.

**Learner instructions:** Choose one answer for each question. You do not need to type commands in this check.

#### Q09.1

Which issue title is most actionable?

- **A.** Include the $5 delivery fee in the cart total.
- **B.** Help!!!
- **C.** Broken.
- **D.** Please fix things.

**Author answer:** A.

**Explanation:** The title names a specific behavior. Reproduction steps and expected-versus-actual results can then make the report testable.

**If missed, review:** [Write an issue that can be reproduced](#github-3-1)

#### Q09.2

Which is an observable acceptance criterion?

- **A.** Someone spent an hour investigating.
- **B.** The code feels better.
- **C.** The change is impressive.
- **D.** A cart with a $20 item and $5 delivery displays a $25 total.

**Author answer:** D.

**Explanation:** The stated input and output provide a concrete way to verify completion. Effort or subjective impressions do not establish the required behavior.

**If missed, review:** [Write an issue that can be reproduced](#github-3-1)

#### Q09.3

Where should a short install command and a long configuration reference go?

- **A.** Remove the setup command to keep every page short.
- **B.** Keep setup easy to find in the README and link to the longer reference, such as a wiki page.
- **C.** Put the reference only in a local file nobody else has.
- **D.** Hide both in unrelated closed issues.

**Author answer:** B.

**Explanation:** The README provides a quick entry point, while a linked reference can explain details without overwhelming setup instructions.

**If missed, review:** [Use a README and wiki together](#github-3-2)

## GitHub unit 4: Opening a useful pull request

<a id="github-4-1"></a>

### Mini lesson: Propose a merge with a pull request

Content ID: `github-4-1`

A pull request, or PR, asks to merge a branch into another branch and creates a place to discuss the change. Opening it does not perform the merge. GitLab uses the term merge request for its comparable collaboration feature.

#### Commands and concepts

```text
git push -u origin docs/install
```

Share your local branch before creating its PR on GitHub.

```text
Base: main / compare: docs/install
```

Choose main as the destination and your working branch as the source.

```text
PR description
```

Explain why the change is needed, what it changes, and how you checked it.

```text
Closes #12
```

Link an issue using a closing keyword. GitHub can close the linked issue when the PR is merged into the default branch.

#### Worked example

```text
Title: Document the installation command
Why: New contributors cannot find the setup steps.
Change: Add npm ci to the README.
Verification: Followed the documented steps in a fresh clone.
Closes #12
```

#### When a developer uses this

A developer can ask for review before a change reaches the shared main branch, while giving the reviewer enough context to evaluate it.

Reference: [Official documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)

<a id="hp008"></a>

### HP008 — Open a focused pull request

Type: practice · Response: GitHub actions and/or terminal commands; written plan if running in a simulation · Mini lesson: [Propose a merge with a pull request](#github-4-1)

**Starting state**

```text
$ git status
On branch docs/timestamps
nothing to commit, working tree clean
# One new commit documents UTC timestamps. Issue #12 requests this documentation.
```

**File contents or supporting context**

```text
Title:
Why:
What changed:
Verification:
Related issue:
```

**Instructions**

1. Push docs/timestamps with an upstream.
2. Choose main as base and docs/timestamps as compare.
3. Draft a title and description linking issue #12 and explaining how you checked the change.

**Completion criteria**

The proposed PR has the correct direction, scope, and verification notes.

**Hint**

The base receives the changes; the compare branch provides them.

**Author answer / one acceptable approach**

```text
git push -u origin docs/timestamps
GitHub → Pull requests → New pull request.
Base: main; compare: docs/timestamps.
Title: Document UTC sample timestamps.
Description: Explain the input format and add a UTC example. Checked the example against the sample file. Closes #12.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="hp009"></a>

### HP009 — Propose the help documentation

Type: practice · Response: GitHub actions and/or terminal commands; written plan if running in a simulation · Mini lesson: [Propose a merge with a pull request](#github-4-1)

**Starting state**

```text
docs/help has one ready help.txt commit. Issue #7 requests a help-command example. Working tree clean; origin is writable.
```

**Instructions**

1. Push docs/help with tracking.
2. Draft a PR into main with purpose, verification, and Closes #7.

**Completion criteria**

The PR direction, purpose, and verification are explicit.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
git push -u origin docs/help
Base main; compare docs/help.
Title: Add help command example.
Description: Add the example requested in #7; checked it against the CLI help output. Closes #7.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="github-4-2"></a>

### Mini lesson: Choose the correct base branch

Content ID: `github-4-2`

A PR’s comparison depends on its destination. If you choose an older release branch as the base, the diff may include work that already exists on main but not on that release.

#### Commands and concepts

```text
Base branch selector
```

Select the branch that should receive the proposed change. Check the issue or contribution guide for the intended target.

```text
Files changed
```

Review the diff again after changing the base. Confirm that only the intended work is proposed.

#### Worked example

```text
Feature based on current main → compare against main
Feature compared against last year’s release → may show
many unrelated changes accumulated since that release
```

#### When a developer uses this

A developer can correct an unexpectedly large PR by fixing its comparison. Deleting files just to shrink the diff could remove valid project content.

Reference: [Official documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/changing-the-base-branch-of-a-pull-request)

<a id="hp010"></a>

### HP010 — Catch the wrong base branch

Type: practice · Response: Written response or the corresponding GitHub interaction · Mini lesson: [Choose the correct base branch](#github-4-2)

**Starting state**

```text
Issue target: main
PR base: release/old
Compare: docs/timestamps
Diff against release/old: 6 files
Diff against main: README.md only
```

**File contents or supporting context**

```text
Write the correction and your reasoning.
```

**Instructions**

1. Compare the selected base with the issue’s target.
2. Choose the intended base.
3. Recheck the file list and explain why you should not immediately delete the other files.

**Completion criteria**

The PR targets main and the diff shows only the intended README change.

**Hint**

Changing the comparison can fix the scope without modifying source files.

**Author answer / one acceptable approach**

```text
Change base from release/old to main.
Review Files changed and confirm README.md is the only file.
The extra files came from the older comparison base; deleting them would damage the project.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="q10"></a>

### Q10 — Check your understanding: pull requests

Type: short quiz · 3 single-answer questions · Suggested completion: 2/3, with all missed explanations reviewed.

**Learner instructions:** Choose one answer for each question. You do not need to type commands in this check.

#### Q10.1

For a change on docs/help intended for main, which PR direction is correct?

- **A.** Base origin; compare GitHub.
- **B.** Base main; compare docs/help.
- **C.** Base docs/help; compare main.
- **D.** Both branches must be named main.

**Author answer:** B.

**Explanation:** The base receives the change, and the compare or head branch supplies it.

**If missed, review:** [Propose a merge with a pull request](#github-4-1)

#### Q10.2

What happens when you open a pull request?

- **A.** GitHub necessarily merges it immediately.
- **B.** Your local uncommitted files are uploaded.
- **C.** You propose a merge and create a place for review and discussion.
- **D.** The source branch is automatically deleted.

**Author answer:** C.

**Explanation:** Opening a PR and merging it are separate actions. GitLab calls its comparable feature a merge request.

**If missed, review:** [Propose a merge with a pull request](#github-4-1)

#### Q10.3

A PR unexpectedly shows many files because its base is an old release. What should you inspect first?

- **A.** Whether every contributor uses the same editor.
- **B.** Whether the selected base matches the task’s intended destination.
- **C.** Whether you can remove all commits.
- **D.** Whether deleting all extra files makes the count smaller.

**Author answer:** B.

**Explanation:** The comparison depends on the base. Correcting the destination can resolve an inflated diff without deleting legitimate work.

**If missed, review:** [Choose the correct base branch](#github-4-2)

## GitHub unit 5: Participating in code review

<a id="github-5-1"></a>

### Mini lesson: Update a PR after review

Content ID: `github-5-1`

A PR follows its source branch. When you commit and push more changes to that branch, the existing PR updates. You usually do not need a second PR for a correction requested during review.

#### Commands and concepts

```text
git diff
```

Inspect the requested edit before staging it.

```text
git add README.md
```

Select the changed file.

```text
git commit -m "Add installation example"
```

Record the review correction as a new commit.

```text
git push
```

Publish the update using the branch’s existing upstream.

```text
Reply to the review
```

Explain what you changed or ask for clarification when the request is unclear.

#### Worked example

```text
Reviewer: Please include an example command.
Edit → inspect → stage → commit → push to the same branch
Reply: Added the example beside the installation instructions.
```

#### When a developer uses this

A developer can keep the discussion and its resolution together, making it easier for the reviewer to verify the update.

Reference: [Official documentation](https://docs.github.com/en/get-started/using-github/github-flow)

<a id="hp011"></a>

### HP011 — Respond to a requested change

Type: practice · Response: GitHub actions and/or terminal commands; written plan if running in a simulation · Mini lesson: [Update a PR after review](#github-5-1)

**Starting state**

```text
PR #14: docs/timestamps → main
Review: Please include a concrete UTC timestamp example.
Local branch: docs/timestamps; clean and tracking origin/docs/timestamps
```

**File contents or supporting context**

```text
Sample timestamps use UTC.
```

**Instructions**

1. Add the supplied timestamp example to README.md.
2. Inspect, commit, and push to docs/timestamps.
3. Draft a reply explaining the update.

**Completion criteria**

The same PR contains the example and a specific response to the reviewer.

**Hint**

Stay on the existing PR branch rather than creating a second PR.

**Author answer / one acceptable approach**

```text
# Add: Example: 2026-09-11T14:00:00Z.
git diff
git add README.md
git commit -m "Add UTC timestamp example"
git push
Reply: Added a UTC timestamp example next to the format description.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="hp012"></a>

### HP012 — Add a requested help example

Type: practice · Response: GitHub actions and/or terminal commands; written plan if running in a simulation · Mini lesson: [Update a PR after review](#github-5-1)

**Starting state**

```text
Open PR from docs/help; branch clean and tracking origin/docs/help. Review requests a concrete help example.
```

**Instructions**

1. Edit help.txt to include “app --help”.
2. Inspect, commit, and push to the existing docs/help branch.
3. Draft a reply to the reviewer.

**Completion criteria**

The original PR contains the update and an explanatory response.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
echo "Example: app --help" >> help.txt
git diff
git add help.txt
git commit -m "Add help usage example"
git push
Reply: Added the command example beside the help instructions.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="github-5-2"></a>

### Mini lesson: Give specific review feedback

Content ID: `github-5-2`

A helpful review explains a concrete problem, why it matters, and what would resolve it. Check your claim against the repository rather than relying on what a command usually means elsewhere.

#### Commands and concepts

```text
package.json → scripts
```

For an npm project, this section defines what commands such as npm test and npm start run.

```text
npm test
```

Run the project’s configured test script.

```text
npm start
```

Run its configured start script. Starting the app is not automatically equivalent to running its tests.

#### Worked example

```text
Observation: The README says npm start runs tests.
Evidence: package.json maps start to the application.
Request: Change the instruction to npm test so contributors
run the test suite before submitting changes.
```

#### When a developer uses this

A developer reviewing documentation can prevent incorrect setup instructions without needing to rewrite the whole guide.

Reference: [Official documentation](https://docs.github.com/en/pull-requests/reviewing-changes-in-pull-requests)

<a id="hp013"></a>

### HP013 — Write a review someone can act on

Type: practice · Response: GitHub actions and/or terminal commands; written plan if running in a simulation · Mini lesson: [Give specific review feedback](#github-5-2)

**Starting state**

```text
PR diff: README.md
-Run npm test before opening a PR.
+Run npm start before opening a PR.
package.json scripts: test = node --test; start = node cli.js
```

**File contents or supporting context**

```text
Draft a review comment here.
```

**Instructions**

1. Compare the README edit with package.json.
2. Write a comment on the changed README line.
3. State whether the correction should happen before merge and why.

**Completion criteria**

Your review cites the actual scripts and requests the correct test command.

**Hint**

Explain what npm start actually does in this repository.

**Author answer / one acceptable approach**

```text
Please keep npm test here. package.json runs the test suite through the test script, while npm start launches the CLI. This should be corrected before merge so contributors actually validate their changes.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="q11"></a>

### Q11 — Check your understanding: review and revision

Type: short quiz · 3 single-answer questions · Suggested completion: 2/3, with all missed explanations reviewed.

**Learner instructions:** Choose one answer for each question. You do not need to type commands in this check.

#### Q11.1

A reviewer requests an example in your open PR. How do you normally update the PR?

- **A.** Create a new repository for every comment.
- **B.** Edit only an unrelated branch.
- **C.** Edit, commit, and push to that PR’s source branch.
- **D.** Close the PR before reading the comment.

**Author answer:** C.

**Explanation:** A PR follows its source branch, so new commits pushed there update the existing review.

**If missed, review:** [Update a PR after review](#github-5-1)

#### Q11.2

A reviewer says “Increase the timeout” without a value or requirement. What is useful next?

- **A.** Guess the largest possible value.
- **B.** Ask for the intended timeout and the behavior it needs to support.
- **C.** Delete timeout handling.
- **D.** Approve your own guessed requirement.

**Author answer:** B.

**Explanation:** A focused clarification gives you an actionable requirement and avoids changing behavior arbitrarily.

**If missed, review:** [Update a PR after review](#github-5-1)

#### Q11.3

The README says npm start runs tests, but package.json maps it to launching the CLI. What should your review say?

- **A.** Say nothing because documentation never matters.
- **B.** “I dislike this.”
- **C.** Identify the script mismatch and request npm test for the test instruction.
- **D.** “Bad.”

**Author answer:** C.

**Explanation:** Specific feedback names the evidence, practical consequence, and requested correction. It helps the author resolve the problem.

**If missed, review:** [Give specific review feedback](#github-5-2)

## GitHub unit 6: Automated checks and workflows

<a id="github-6-1"></a>

### Mini lesson: Read a failed GitHub Actions run

Content ID: `github-6-1`

GitHub Actions runs automated workflows. A workflow contains jobs, and jobs contain steps. Continuous integration, or CI, uses automation such as builds and tests to check new changes.

#### Commands and concepts

```text
Workflow → job → failed step
```

Follow this sequence to find the relevant logs rather than stopping at a red status icon.

```text
Expected / received
```

A test assertion compares the required result with the actual result. The difference is evidence for your investigation.

```text
Commit identifier
```

Check which commit the run tested. An older result may not describe the current PR.

#### Worked example

```text
Install dependencies: passed
Run tests: failed
Test: cart includes delivery
Expected: 25
Received: 20

The test ran; the calculation failed its assertion.
```

#### When a developer uses this

A developer can distinguish a code failure from a dependency-installation or infrastructure problem and investigate the correct part of the system.

Reference: [Official documentation](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/using-workflow-run-logs)

<a id="hp014"></a>

### HP014 — Follow a failing check to the cause

Type: practice · Response: Written response or the corresponding GitHub interaction · Mini lesson: [Read a failed GitHub Actions run](#github-6-1)

**Starting state**

```text
Workflow: Test suite
Job: test
Checkout: passed
Install dependencies: passed
Run tests: failed
Test: formats timestamps as UTC
Expected: 14:00 UTC
Received: 10:00
Commit: b20c222
```

**File contents or supporting context**

```text
Failure category:
Expected vs actual:
Next step:
```

**Instructions**

1. Identify which step failed.
2. Describe expected versus actual behavior.
3. Write the next investigation step without claiming the code is already fixed.

**Completion criteria**

You identify a UTC formatting assertion failure, with installation and test startup already successful.

**Hint**

Follow the failed step’s logs to the first relevant assertion.

**Author answer / one acceptable approach**

```text
Run tests failed on UTC timestamp formatting. Expected 14:00 UTC, received 10:00. Reproduce this test locally and inspect the formatter’s time-zone handling; this is not an installation failure.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="hp015"></a>

### HP015 — Identify an installation failure

Type: practice · Response: Written response or the corresponding GitHub interaction · Mini lesson: [Read a failed GitHub Actions run](#github-6-1)

**Starting state**

```text
Checkout passed. Install dependencies failed: lockfile out of sync with package.json. Run tests skipped.
```

**Instructions**

1. Identify the failed step and whether any test assertion ran.
2. Write the next investigation step.

**Completion criteria**

You do not misclassify this as an application test failure.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
Dependency installation failed; no test assertion ran. Check whether package.json and its lockfile were updated together, repair the mismatch, then rerun installation and tests.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="github-6-2"></a>

### Mini lesson: Choose when a workflow runs

Content ID: `github-6-2`

Workflow files use YAML under .github/workflows/. The on section selects events that trigger a run. Testing a pull request provides feedback before its changes are merged.

#### Commands and concepts

```text
on: push: branches: [main]
```

In properly indented YAML, this selects pushes to main.

```text
on: pull_request: branches: [main]
```

This selects relevant pull-request events for PRs targeting main. The branch filter refers to the PR’s base branch.

```text
jobs / steps / uses / run
```

Jobs group work. Steps execute it in order. uses invokes an action; run executes a shell command.

#### Worked example

```text
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# push and pull_request are siblings under on.
# Preserve indentation and the existing job.
```

#### When a developer uses this

A developer adding PR checks can catch failures before merge. Running tests only after a push to main discovers the problem later in the workflow.

Reference: [Official documentation](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows)

<a id="hp016"></a>

### HP016 — Run tests on pull requests too

Type: practice · Response: GitHub actions and/or terminal commands; written plan if running in a simulation · Mini lesson: [Choose when a workflow runs](#github-6-2)

**Starting state**

```text
File: .github/workflows/tests.yml
Current behavior: tests run only after pushes to main.
```

**File contents or supporting context**

```text
name: Test suite
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm test
```

**Instructions**

1. Add a pull_request trigger targeting main while preserving the existing push trigger.
2. Keep the current steps unchanged.
3. Describe how you would verify the new workflow with a PR.

**Completion criteria**

The YAML supports pushes to main and PRs targeting main; verification checks the run’s commit and result.

**Hint**

Add pull_request alongside push under on, at the same indentation.

**Author answer / one acceptable approach**

```text
# Update the trigger section:
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Then commit/push on a branch, open a PR to main, and inspect
# the Test suite run for that PR’s latest commit.
# Keep the existing job unchanged.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="hp017"></a>

### HP017 — Add PR checks to a second workflow

Type: practice · Response: GitHub actions and/or terminal commands; written plan if running in a simulation · Mini lesson: [Choose when a workflow runs](#github-6-2)

**Starting state**

```text
Workflow Build currently runs only on pushes to main. Keep all jobs unchanged.
```

**File contents or supporting context**

```text
name: Build
on:
  push:
    branches: [main]
```

**Instructions**

1. Add pull_request for main to the shown trigger section.
2. Preserve the existing push trigger and describe validation.

**Completion criteria**

Both push and PR triggers target main; existing job steps remain unchanged.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
# Commit on a branch, open a PR to main, and inspect the Build run for its latest commit.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="c07"></a>

### C07 — Checkpoint: Read a failure, update a workflow, and verify the new run

Type: practical checkpoint · Completion: every listed outcome met · Unlimited retries.

**What this checks**

Read the failed job step before choosing a fix. Then connect a small repository change to a new workflow run for that exact revision.

Reuses: [Read a failed GitHub Actions run](#github-6-1), [Choose when a workflow runs](#github-6-2), [Update a PR after review](#github-5-1), [Propose a merge with a pull request](#github-4-1)

**Prepared starting state**

```text
Owned repository: YOUR_USERNAME/notes-practice. Clean main with configured origin and authentication.
package.json includes a test script. package-lock.json is consistent with it.
A prepared documentation test requires README.md to contain “Run npm test.”
README.md currently contains only “# Notes”.
Existing workflow: push to main only; one test job with checkout, Node setup, npm ci, npm test.
Latest main run: checkout passed; npm ci passed; test assertion failed, expected README to include “Run npm test.”
Existing action versions and Node configuration are provided by the implementation; preserve them.
```

**Learner instructions**

1. Identify the failed step and explain why this is not an installation failure.
2. Create docs/test-instructions and add the exact required README sentence.
3. Add a pull_request trigger targeting main while preserving the push trigger and all job steps.
4. Run npm test locally, inspect the changes, then commit and push the branch.
5. Open a PR to main and inspect the new Test suite run for its latest revision. Do not merge as part of this checkpoint.

**Completion criteria / author verification rubric**

- The failure is identified as a documentation assertion after successful installation.
- README.md includes the required sentence.
- The workflow retains push-to-main and adds PRs-targeting-main triggers.
- Existing test-job steps remain intact.
- A new PR-triggered run for the current proposed revision passes the required test.
- The branch remains available for review; the PR is not merged by this checkpoint.

**Progressive hints**

1. Use the expected and actual values from the failed assertion to determine the README change.
2. Under on, push and pull_request are siblings. The PR branch filter names the destination main.
3. After pushing, inspect the new run’s event and revision; an older passing run is not enough.

**Author answer / one acceptable approach**

```text
git switch -c docs/test-instructions
echo "Run npm test." >> README.md

# Change only the trigger section of .github/workflows/tests.yml:
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Keep all existing job steps unchanged.
npm test
git diff
git add README.md .github/workflows/tests.yml
git diff --staged
git commit -m "Document testing and check pull requests"
git push -u origin docs/test-instructions

# Open a PR to main; inspect its new Test suite run, event, revision, and result.
```

**Targeted feedback**

- **Only pushes to main trigger runs:** The PR trigger is missing or incorrectly indented. Add pull_request alongside push under on.
- **The PR check still fails the README assertion:** Inspect the required sentence and the contents actually committed; a working-file edit may not have been staged or pushed.
- **The cited passing run belongs to an older revision:** Find the run associated with the current PR revision, including its head SHA or linked merge-test revision as GitHub reports it.

## GitHub unit 7: Getting a change merged

<a id="github-7-1"></a>

### Mini lesson: Understand merge requirements

Content ID: `github-7-1`

Green tests are one part of readiness. A repository can also require approval, resolved discussions, or other conditions before a PR can merge. Read each requirement separately.

#### Commands and concepts

```text
Required status checks
```

Automated checks that must pass under the repository’s rules.

```text
Required approvals
```

Reviews from eligible people that must be present before merge.

```text
Request review
```

Ask an eligible reviewer to evaluate the change and address any requested corrections.

#### Worked example

```text
Tests: passed
Conflicts: none
Required approvals: 1
Approvals received: 0

Next step: request review, not bypass the rule.
```

#### When a developer uses this

A developer can tell whether a PR is waiting on a code fix, an automated run, or another person’s review. That makes the next action clear.

Reference: [Official documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

<a id="hp018"></a>

### HP018 — Understand why merging is blocked

Type: practice · Response: Written response or the corresponding GitHub interaction · Mini lesson: [Understand merge requirements](#github-7-1)

**Starting state**

```text
PR #14
Test suite: passed
Merge conflicts: none
Required approvals: 1
Current approvals: 0
Merge: blocked
```

**File contents or supporting context**

```text
Write the next action and reasoning.
```

**Instructions**

1. Identify the unmet requirement.
2. Choose a next action consistent with the repository rules.
3. Explain why bypassing the rule is unnecessary here.

**Completion criteria**

You request the required review and leave the merge pending until the condition is met.

**Hint**

Check approvals separately from automated test results.

**Author answer / one acceptable approach**

```text
Request a review from an eligible teammate. Wait for approval and address requested changes. The repository requires one approval; green tests do not replace it.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="github-7-2"></a>

### Mini lesson: Squash merge and update your local copy

Content ID: `github-7-2`

GitHub’s squash merge combines a PR’s changes into one new commit on the base branch. Your local main does not update automatically when the remote merge finishes.

#### Commands and concepts

```text
Squash and merge
```

Choose a message describing the completed change. The new base-branch commit differs from the original feature-branch commits.

```text
git fetch --prune origin
```

Fetch current remote references and remove remote-tracking references for branches deleted on the remote.

```text
git switch main
```

Select the local branch you want to update.

```text
git merge --ff-only origin/main
```

Fast-forward clean local main to the remote result when possible.

#### Worked example

```text
GitHub: three PR commits → one new commit on main
Locally: switch to main → fetch → fast-forward → verify

Deleting a remote branch does not delete your local branch.
```

#### When a developer uses this

A developer finishes a PR by bringing their local workspace up to date before starting the next task. After a squash merge, git branch -d may refuse local cleanup because the old feature commits are not ancestors of main; verify before forcing deletion.

Reference: [Official documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges)

<a id="hp019"></a>

### HP019 — Squash merge and synchronize locally

Type: practice · Response: GitHub actions and/or terminal commands; written plan if running in a simulation · Mini lesson: [Squash merge and update your local copy](#github-7-2)

**Starting state**

```text
PR #14: approved; tests passed; no conflicts
Compare: docs/timestamps
Three commits: draft, typo fix, example
Local working tree: clean
```

**File contents or supporting context**

```text
Squash message:
GitHub steps:
Local commands:
```

**Instructions**

1. Describe the GitHub squash-merge action and choose a useful message.
2. Delete the remote feature branch after the merge.
3. Update clean local main and verify the README result before considering local branch cleanup.

**Completion criteria**

main matches the merged remote result and the final README change is present.

**Hint**

A local git branch -d may refuse after squash merging because the original commits are not ancestors of main. Verify before deleting anything forcibly.

**Author answer / one acceptable approach**

```text
GitHub → Squash and merge. Message: Document UTC sample timestamps.
Delete remote docs/timestamps after merge.
git switch main
git fetch --prune origin
git merge --ff-only origin/main
git show HEAD -- README.md
# Verify before optional local branch cleanup.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="hp020"></a>

### HP020 — Finish another squash-merged PR

Type: practice · Response: GitHub actions and/or terminal commands; written plan if running in a simulation · Mini lesson: [Squash merge and update your local copy](#github-7-2)

**Starting state**

```text
PR docs/help approved with passing checks. Local main clean, no unique commits. Team uses squash merge.
```

**Instructions**

1. Choose a squash message for a help-documentation change.
2. After GitHub merges it, update local main and inspect help.txt.

**Completion criteria**

Local main includes the verified squash result.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
Squash and merge: Document the help command. Delete the remote branch.
git switch main
git fetch --prune origin
git merge --ff-only origin/main
git show HEAD -- help.txt
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="q12"></a>

### Q12 — Check your understanding: completing the merge

Type: short quiz · 3 single-answer questions · Suggested completion: 2/3, with all missed explanations reviewed.

**Learner instructions:** Choose one answer for each question. You do not need to type commands in this check.

#### Q12.1

Tests passed, but the required approval is missing. What should happen next?

- **A.** Request the required review and wait for the condition to be satisfied.
- **B.** Force the merge without review.
- **C.** Delete the test workflow.
- **D.** Mark the issue complete without delivering the change.

**Author answer:** A.

**Explanation:** Checks and approvals are distinct requirements. Passing one does not satisfy the other.

**If missed, review:** [Understand merge requirements](#github-7-1)

#### Q12.2

What does a squash merge normally add to the base branch?

- **A.** Every original feature commit with unchanged identifiers.
- **B.** Only the PR comments, with no file changes.
- **C.** A new repository.
- **D.** One combined commit representing the PR’s changes.

**Author answer:** D.

**Explanation:** Squash merging creates a combined commit on the base branch. Its identity differs from the original feature commits.

**If missed, review:** [Squash merge and update your local copy](#github-7-2)

#### Q12.3

Why update local main after a PR merges on GitHub?

- **A.** To re-open every closed issue.
- **B.** So the next task starts from the accepted, merged project state.
- **C.** To rewrite everyone else’s commits.
- **D.** To remove the need for future tests.

**Author answer:** B.

**Explanation:** A remote merge does not automatically change your local branch. Synchronizing and verifying the result prepares the next contribution.

**If missed, review:** [Squash merge and update your local copy](#github-7-2)

## GitHub unit 8: Contributing and shipping versions

<a id="github-8-1"></a>

### Mini lesson: Contribute through a fork

Content ID: `github-8-1`

A fork is your GitHub-hosted copy of another repository, linked to the original. It lets you publish your branch even when you cannot push directly to the original repository.

#### Commands and concepts

```text
Fork
```

Create the related repository under your account in GitHub.

```text
git clone FORK_URL
```

Create your local working copy from your fork. origin usually points to the fork.

```text
git remote add upstream ORIGINAL_URL
```

Add the original repository as another remote. upstream is a convention you choose, distinct from a branch’s upstream tracking setting.

```text
Cross-repository PR
```

Propose merging your fork’s branch into the original repository’s target branch.

#### Worked example

```text
origin   → YOUR_USERNAME/library
upstream → original-team/library

Push your change to origin.
Open PR: your fork’s feature branch → original-team’s main.
```

#### When a developer uses this

A developer can fix documentation in an open-source library without receiving write access to the library’s repository.

Reference: [Official documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks)

<a id="hp021"></a>

### HP021 — Contribute through your fork

Type: practice · Response: GitHub actions and/or terminal commands; written plan if running in a simulation · Mini lesson: [Contribute through a fork](#github-8-1)

**Starting state**

```text
Original repository: training-team/sample-app
Your account placeholder: YOUR_USERNAME
Permission: read-only on original
```

**File contents or supporting context**

```text
Fork steps:
Clone and remote commands:
PR direction:
```

**Instructions**

1. Describe how to fork the repository to your account.
2. Write commands to clone your fork and add the original as upstream.
3. Describe the source and destination of a future contribution PR.

**Completion criteria**

Your plan distinguishes your fork from upstream and proposes changes back to the original main branch.

**Hint**

Push your contribution branch to your fork, then open the PR against the original.

**Author answer / one acceptable approach**

```text
GitHub → Fork → YOUR_USERNAME/sample-app.
git clone https://github.com/YOUR_USERNAME/sample-app.git
cd sample-app
git remote add upstream https://github.com/training-team/sample-app.git
git remote -v
PR: YOUR_USERNAME:feature-branch → training-team:main.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="hp025"></a>

### HP025 — Set up another fork

Type: practice · Response: GitHub actions and/or terminal commands; written plan if running in a simulation · Mini lesson: [Contribute through a fork](#github-8-1)

**Starting state**

```text
You can read original-team/library but cannot push there. No fork exists yet.
```

**Instructions**

1. Describe forking original-team/library.
2. Clone YOUR_USERNAME/library and add the original as upstream.

**Completion criteria**

origin identifies your fork and upstream identifies the original.

**Hint**

Choose commands from the mini lesson. Check your current state before making changes, then verify the requested result.

**Author answer / one acceptable approach**

```text
GitHub → Fork → YOUR_USERNAME/library.
git clone https://github.com/YOUR_USERNAME/library.git
cd library
git remote add upstream https://github.com/original-team/library.git
git remote -v
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="github-8-2"></a>

### Mini lesson: Name a version with a tag and release

Content ID: `github-8-2`

A Git tag names a particular revision. A GitHub release adds release notes and optional downloadable assets around a tag. Verify which commit you are naming before publishing a version.

#### Commands and concepts

```text
git tag -a v0.1.0 -m "First working version"
```

Create an annotated tag at the current commit. -a makes it annotated; -m supplies its message.

```text
git push origin v0.1.0
```

Share that specific tag with the remote.

```text
Releases → Draft a new release
```

Select the existing tag and describe what is available and what limitations remain.

#### Worked example

```text
Tested commit: a1b2c3d
Tag v0.1.0 → a1b2c3d
Release notes: Reads local JSON files; live fetching is not supported.
```

#### When a developer uses this

A developer can give users a stable version name instead of asking them to download whatever happens to be on main that day.

Reference: [Official documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases)

<a id="hp022"></a>

### HP022 — Mark a tested version

Type: practice · Response: GitHub actions and/or terminal commands; written plan if running in a simulation · Mini lesson: [Name a version with a tag and release](#github-8-2)

**Starting state**

```text
Current branch: main, clean and synchronized
HEAD: d40e444
Passing test run commit: d40e444
Feature: reads local JSON sensor samples
Limitation: no live data fetching
Tag v0.1.0 does not exist
```

**File contents or supporting context**

```text
Release title:
Feature:
Known limitation:
```

**Instructions**

1. Confirm main is current and its latest commit is the tested one.
2. Create and push annotated tag v0.1.0.
3. Draft release notes with one feature and one known limitation.

**Completion criteria**

v0.1.0 identifies the tested commit, and the release notes describe what users can expect.

**Hint**

Do not tag a different commit just because a previous test run was green.

**Author answer / one acceptable approach**

```text
git log -1 --oneline
git tag -a v0.1.0 -m "First sensor-reading version"
git push origin v0.1.0
GitHub → Releases → Draft a new release → existing tag v0.1.0.
Feature: Read local JSON sensor samples.
Limitation: Live data fetching is not supported.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

## GitHub unit 9: Independent contribution

<a id="github-9-1"></a>

### Mini lesson: Connect the whole contribution workflow

Content ID: `github-9-1`

You have practiced the pieces separately. A complete contribution connects a requirement to a verified, reviewed change. This exercise asks you to choose the commands rather than copying a full sequence.

#### Commands and concepts

```text
Inspect → branch → edit → verify
```

Read the requirement, start from the correct branch, make the change, and run the relevant checks.

```text
Stage → commit → push
```

Record a focused change and share its branch.

```text
PR → review → checks → merge
```

Explain the work, respond to feedback, verify the latest revision, and merge once requirements are met.

```text
Synchronize
```

Update your local main and inspect the result before starting another task.

#### Worked example

```text
Requirement: Document a configuration option.
Evidence: The README explains the option and its default.
Delivery: Focused commit, reviewed PR, passing required checks,
and the merged change present on main.
```

#### When a developer uses this

A developer uses this sequence for small fixes as well as larger features. The commands are useful because they support a complete, understandable contribution.

Reference: [Official documentation](https://docs.github.com/en/get-started/using-github/github-flow)

<a id="hp023"></a>

### HP023 — Take an issue through the whole workflow

Type: practice · Response: GitHub actions and/or terminal commands; written plan if running in a simulation · Mini lesson: [Connect the whole contribution workflow](#github-9-1)

**Starting state**

```text
Repository: YOUR_USERNAME/sample-app
Local main: clean and synchronized
Issue #21: Add a UTC example beside the timestamp format.
Acceptance: README includes 2026-09-11T14:00:00Z and identifies it as UTC.
Existing test command: npm test
```

**File contents or supporting context**

```text
Sample timestamp format: ISO 8601.
```

**Instructions**

1. Plan and perform the local branch/edit/commit/push sequence in the mock workspace.
2. Draft a PR that links #21 and explains verification.
3. Describe how you would handle review, confirm checks for the latest commit, merge, and update local main.

**Completion criteria**

Your plan covers the whole contribution, preserves unrelated work, and verifies the final merged result.

**Hint**

Use the daily Git routine, then add the collaboration and verification steps.

**Author answer / one acceptable approach**

```text
git switch -c docs/utc-example
# Edit README.md to satisfy #21.
git diff
npm test
git add README.md
git diff --staged
git commit -m "Add UTC timestamp example"
git push -u origin docs/utc-example
# Open PR to main; explain the change and verification; Closes #21.
# Address review with commits on this branch. Check the latest commit’s CI.
# After approval and passing checks, merge in GitHub.
git switch main
git fetch --prune origin
git merge --ff-only origin/main
git show HEAD -- README.md
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="github-9-2"></a>

### Mini lesson: Verify the final revision after corrections

Content ID: `github-9-2`

A conflict-free merge and a passing test are different checks. Resolving a conflict changes content, so the resulting revision needs validation. Results from an earlier commit do not prove that the new one works.

#### Commands and concepts

```text
git fetch origin
git merge origin/main
```

Run these as separate commands on the PR branch to bring in current main. Resolve any conflicts to the intended final content.

```text
git add / git commit
```

Record the resolved result after inspection.

```text
npm test
```

Run this project’s test suite locally. Correct failures and test again before pushing.

```text
Latest PR checks and approvals
```

After pushing, verify the checks correspond to the latest revision and required review is satisfied.

#### Worked example

```text
Old commit A: tests passed
New commit B: conflict resolution changes a file

B needs its own checks. A’s green result is not proof for B.
```

#### When a developer uses this

A developer updating a PR after main has moved needs to check the combined result, including interactions between their changes and the newly integrated work.

Reference: [Official documentation](https://docs.github.com/en/get-started/using-github/github-flow)

<a id="hp024"></a>

### HP024 — Finish a contribution with two obstacles

Type: practice · Response: GitHub actions and/or terminal commands; written plan if running in a simulation · Mini lesson: [Verify the final revision after corrections](#github-9-2)

**Starting state**

```text
Branch: docs/utc-example, clean, tracking origin/docs/utc-example
Latest check: expected 2026-09-11T14:00:00Z; found 2026-09-11 14:00
PR: conflict with main
Agreed README wording: “Sample timestamps use UTC.”
Required approvals: 1; currently 0
```

**File contents or supporting context**

```text
Sample timestamp format: ISO 8601.
Example: 2026-09-11 14:00
```

**Instructions**

1. Plan how to update your PR branch from origin/main and resolve the documented conflict.
2. Fix the example so the documentation check receives the required UTC string.
3. Commit and push, then specify the conditions you must verify before merge.

**Completion criteria**

The PR contains the agreed sentence and required example; the latest commit passes checks and receives approval.

**Hint**

Fetch and merge on the PR branch. Resolve the content requirement, then validate that exact new commit.

**Author answer / one acceptable approach**

```text
git fetch origin
git merge origin/main
# Resolve markers to “Sample timestamps use UTC.”
# Set the example to 2026-09-11T14:00:00Z.
git add README.md
git commit -m "Resolve timestamp documentation conflict"
npm test
# If a fix is needed, edit, inspect, stage, commit, and test again.
git push
# Confirm latest PR commit passes all required checks, request approval,
# then merge and synchronize local main.
```

**Feedback after review**

If the result differs, identify the unmet condition above and compare it with the actual repository state or written response. Use the mini lesson to explain the difference, then let the learner revise.

<a id="c08"></a>

### C08 — Checkpoint: Complete a reviewed contribution independently

Type: practical checkpoint · Completion: every listed outcome met · Unlimited retries.

**What this checks**

Bring the workflow together without a command-by-command prompt: requirements, branch, focused commits, PR, review, checks, correction, merge, and local synchronization.

Reuses: [Propose a merge with a pull request](#github-4-1), [Update a PR after review](#github-5-1), [Read a failed GitHub Actions run](#github-6-1), [Understand merge requirements](#github-7-1), [Squash merge and update your local copy](#github-7-2), [Connect the whole contribution workflow](#github-9-1), [Verify the final revision after corrections](#github-9-2)

**Prepared starting state**

```text
Owned practice repository with synchronized clean main, README.md, help.txt, package.json, and a working PR test workflow.
Issue #40: document the help command. Initial acceptance: help.txt includes “Run app --help.”
Repository rule: one eligible approval and passing Test suite required.
Team merge method: squash.
Prepared review after the first PR: “Please also state that --help lists available options.”
Prepared final check requires both “Run app --help.” and “The --help flag lists available options.” in help.txt.
The first revision lacks the second sentence and its check fails with that exact missing-text assertion. No competing remote update or merge conflict is introduced in this checkpoint.
```

**Learner instructions**

1. Create a focused branch and implement the initial issue requirement.
2. Inspect, test, commit, and push the change.
3. Open a PR to main with purpose, verification, and a link to #40.
4. Read the review and failing check, add the missing explanation, then inspect, test, commit, and push the correction on the same branch.
5. Reply to the review and obtain the required approval. Verify that required checks pass for the latest proposed revision.
6. Squash merge with a useful message, delete the remote working branch, and synchronize local main.
7. Inspect the final help document and summarize what changed, how it was checked, and where the merged work is recorded.

**Completion criteria / author verification rubric**

- The PR targets main and its content addresses issue #40.
- The final help document contains both exact required sentences.
- The update after feedback stays in the original PR.
- The learner identifies the check’s expected missing content and fixes the relevant file.
- The latest proposed revision has required passing checks and an eligible approval before merging.
- The squash-merged result on main contains only the intended help-documentation change.
- The remote working branch is deleted; local main matches origin/main and the working tree is clean.
- The final summary links the PR and records the test evidence without claiming an earlier run validated a later revision.

**Progressive hints**

1. Work in small phases: deliver the first change, handle feedback on the same branch, then verify readiness and finish.
2. If the check fails, compare its expected text with the version committed on your PR branch.
3. Use the familiar edit → inspect → stage → commit → push loop for the correction; only merge after the latest checks and review satisfy the repository rules.

**Author answer / one acceptable approach**

```text
git switch -c docs/help
echo "Run app --help." >> help.txt
git diff
npm test
# Inspect the prepared missing-explanation failure. The PR is allowed to remain failing during feedback.
git add help.txt
git diff --staged
git commit -m "Document help command"
git push -u origin docs/help

# Open PR to main; explain purpose and actual validation result; link #40.
# Read the prepared review and failed assertion.
echo "The --help flag lists available options." >> help.txt
git diff
npm test
git add help.txt
git diff --staged
git commit -m "Explain help output"
git push

# Reply to review, obtain approval, and verify latest required checks.
# GitHub: Squash and merge with message Document the help command.
# Delete the remote docs/help branch.
git switch main
git fetch --prune origin
git merge --ff-only origin/main
cat help.txt
git log -1 --stat
git status
```

**Targeted feedback**

- **The first PR description claims tests passed:** Report the actual failure and what remains. Verification notes must match the observed result.
- **The correction was pushed to a different branch:** The existing PR follows its own source branch. Commit and push the correction there so review and resolution stay together.
- **Merge occurred while approval or checks were missing:** The completion rule includes both conditions. A passing local command alone does not establish remote PR readiness.
- **Local main does not show the merged help text:** After the remote merge, fetch and fast-forward local main before checking the final file.

## Coverage and repetition audit

| Skill | First taught | Reused / checked later |
| --- | --- | --- |
| pwd, ls, cd, relative and absolute paths | [Where am I in the terminal?](#git-1-1) | C01; repository setup; cloning and local-workflow tasks |
| mkdir, touch, cat, echo, redirection | [Create folders and files](#git-1-files) | git-1-content; C01; repeated new-document and commit tasks |
| cp, mv, rm, rmdir | [Copy, rename, and remove practice files](#git-1-organize) | C01 |
| Repositories and configuration | [Turn a folder into a repository](#git-1-2) | C01; C06; template/clone tasks |
| Staging, commit contents, focused commits | [Choose changes with the staging area](#git-2-1) | Git units 2–3; Q01; C02; branch, remote, review, and final tasks |
| History and HEAD | [Read a file’s history](#git-4-1) | Q02; C03; rebase; reflog; C05 |
| Restore, amend, soft reset, revert | [Unstage a file and keep its edits](#git-5-1) | git-5-local; git-5-2; C03 |
| Branches, merging, conflicts | [Create a branch for a change](#git-6-1) | Q03; C04; synchronization; final contribution exercises |
| Remotes, clone, push, fetch, synchronization | [Clone a repository](#git-8-1) | Q04–Q05; C06; all PR delivery tasks |
| Rebase and squash | [Replay commits with rebase](#git-10-1) | git-10-2; Q06; GitHub squash merge; Q12; C08 |
| Stash and cherry-pick | [Set unfinished work aside with stash](#git-11-1) | git-11-2; Q07; targeted practice |
| Reflog and detached HEAD recovery | [Find a lost commit with reflog](#git-12-1) | git-12-2; C05 |
| GitHub repository views and diffs | [Find information in a GitHub repository](#github-1-1) | Q08; PR review and merge tasks |
| Issues, wiki, Markdown links | [Write an issue that can be reproduced](#github-3-1) | github-3-2; Q09; PR descriptions; C08 |
| Pull request / merge request terminology | [Propose a merge with a pull request](#github-4-1) | Q10; review; C07–C08 |
| Review and feedback | [Update a PR after review](#github-5-1) | Q11; C07–C08 |
| Actions, workflow triggers, test logs | [Read a failed GitHub Actions run](#github-6-1) | github-6-2; C07; Q12; C08 |
| Forks, upstream, tags, releases | [Contribute through a fork](#github-8-1) | github-8-2; authored contribution and release practice |

The count is a scope decision, not a claim that a fixed number of repetitions guarantees mastery. Keep the sequence compact; use checkpoint outcomes to identify where an individual learner needs another attempt.
