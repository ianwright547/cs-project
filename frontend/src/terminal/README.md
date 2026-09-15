# Browser practice workspace

The course screen follows the existing Code Practice course-workspace design: instructions and lesson content occupy one pane, while the other contains a file explorer, editable files, terminal, and status bar. Desktop users can collapse the course outline, Explorer, or Instructions pane. Mobile users switch between Instructions and Workspace.

The terminal and filesystem stay inside the browser. `fixtures.ts` provides an authored starting state for every Git practical and checkpoint. GitHub activities receive a `RESPONSE.md` workspace for issue text, pull-request descriptions, review comments, and verification notes. Editor changes, command state, grades, and completion are saved to local storage. The platform selector changes paths and Windows command aliases while Git commands remain consistent.

`workspace.ts` implements the shell and Git behavior used by the curriculum, including a real working-tree/index distinction, commits, branches, remotes, merge/rebase/recovery workflows, stashes, tags, reflog, and basic ignore rules. `grader.ts` builds deterministic checks from the authored solution and completion criteria for all practical activities. It checks successful operations and resulting repository state; GitHub interface work also checks the learner's written evidence.

This is a teaching workspace rather than a host operating-system shell. It cannot read the learner's computer, start arbitrary programs, or contact real remotes. Remote and GitHub operations use controlled training state. Live GitHub integration will require the learner's client-side OAuth/token flow.
