import type { Activity } from '../content/types';
import type { WorkspaceSnapshot } from './types';

export type CommandRecord = { command: string; failed: boolean };
export type GradeCheck = { id: string; label: string; passed: boolean; expected: string; actual: string };
export type GradeResult = { passed: boolean; checks: GradeCheck[] };

const commandNames = new Set<string>(['pwd', 'ls', 'dir', 'cd', 'mkdir', 'md', 'rmdir', 'rd', 'touch', 'cat', 'type', 'echo', 'cp', 'copy', 'mv', 'ren', 'rm', 'del', 'git', 'gh', 'npm']);
const stateChanging = new Set<string>(['mkdir', 'rmdir', 'touch', 'echo', 'cp', 'mv', 'rm', 'git add', 'git commit', 'git init', 'git switch', 'git checkout', 'git merge', 'git rebase', 'git reset', 'git restore', 'git revert', 'git cherry-pick', 'git stash', 'git clone', 'git tag']);

function linesFromSolution(activity: Activity) {
  const section = activity.sections?.find(item => /author answer|acceptable approach/i.test(item.title));
  return (section?.body ?? '').split('\n').map(line => line.trim().replace(/^[$>]\s*/, '')).filter(Boolean);
}

function solutionCommands(activity: Activity) {
  return linesFromSolution(activity).filter(line => commandNames.has(line.split(/\s+/)[0]?.toLowerCase() ?? ''));
}

function normalizeOperation(command: string) {
  const parts: string[] = command.match(/"[^"]*"|'[^']*'|\S+/g) ?? [];
  const name = parts[0]?.toLowerCase();
  if (!name || !commandNames.has(name)) return '';
  if (name !== 'git') return name === 'dir' ? 'ls' : name === 'type' ? 'cat' : name === 'copy' ? 'cp' : name === 'ren' ? 'mv' : name === 'del' ? 'rm' : name === 'md' ? 'mkdir' : name === 'rd' ? 'rmdir' : name;
  const sub = parts[1]?.toLowerCase();
  if (!sub) return '';
  if ((sub === 'switch' || sub === 'checkout') && (parts.includes('-c') || parts.includes('-b'))) return 'git switch -c';
  if (sub === 'commit' && parts.includes('--amend')) return 'git commit --amend';
  if (sub === 'reset' && parts.some(part => part.startsWith('--hard'))) return 'git reset --hard';
  if (sub === 'reset' && parts.some(part => part.startsWith('--soft'))) return 'git reset --soft';
  if (sub === 'restore' && parts.includes('--staged')) return 'git restore --staged';
  if (sub === 'diff' && (parts.includes('--staged') || parts.includes('--cached'))) return 'git diff --staged';
  return `git ${sub}`;
}

function expectedOperations(activity: Activity): string[] {
  return [...new Set<string>(linesFromSolution(activity).map(normalizeOperation).filter(operation => operation.length > 0))];
}

function criteriaText(activity: Activity) {
  return activity.sections?.find(item => /completion criteria/i.test(item.title))?.body ?? '';
}

function tagFromCommand(command: string) {
  const parts = command.match(/"[^"]*"|'[^']*'|\S+/g) ?? [];
  for (let index = 2; index < parts.length; index += 1) {
    if (parts[index] === '-m') { index += 1; continue; }
    if (!parts[index].startsWith('-')) return parts[index];
  }
  return undefined;
}

function ignoredBySnapshot(path: string, snapshot: WorkspaceSnapshot) {
  if (!snapshot.repo) return false;
  const rules = snapshot.files[`${snapshot.repo}/.gitignore`];
  if (!rules || path === `${snapshot.repo}/.gitignore`) return false;
  const relative = path.slice(snapshot.repo.length + 1);
  return rules.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#')).some(pattern => {
    const clean = pattern.replace(/^\//, '').replace(/\/$/, '');
    return relative === clean || relative.startsWith(`${clean}/`) || (!clean.includes('/') && relative.split('/').includes(clean));
  });
}

function hasWorkspaceChange(before: WorkspaceSnapshot, after: WorkspaceSnapshot) {
  return JSON.stringify(before.files) !== JSON.stringify(after.files) || before.cwd !== after.cwd || before.repo !== after.repo || before.branch !== after.branch || before.head !== after.head || before.commits.length !== after.commits.length || before.staged.length !== after.staged.length || before.stashCount !== after.stashCount || JSON.stringify(before.branches) !== JSON.stringify(after.branches) || JSON.stringify(before.remotes) !== JSON.stringify(after.remotes) || JSON.stringify(before.tags) !== JSON.stringify(after.tags);
}

function operationSatisfied(operation: string, commands: CommandRecord[], response: string) {
  const successful = commands.filter(item => !item.failed).map(item => normalizeOperation(item.command));
  if (successful.includes(operation)) return true;
  const words = operation.split(' ');
  return response.toLowerCase().includes(words.join(' '));
}

export function gradeActivity(activity: Activity, courseId: 'git' | 'github', before: WorkspaceSnapshot, after: WorkspaceSnapshot, commands: CommandRecord[], response: string): GradeResult {
  const operations = expectedOperations(activity);
  const authoredCommands = solutionCommands(activity);
  const checks: GradeCheck[] = operations.map((operation, index) => {
    const passed = operationSatisfied(operation, commands, response);
    return { id: `operation-${index}`, label: `Use ${operation}`, passed, expected: `A successful ${operation} step`, actual: passed ? 'Completed' : 'Not completed yet' };
  });

  if (operations.some(operation => stateChanging.has(operation))) {
    const changed = hasWorkspaceChange(before, after);
    checks.push({ id: 'workspace-state', label: 'Produce the requested workspace change', passed: changed, expected: 'Files, repository history, branch, staging area, or location changes', actual: changed ? 'Workspace state changed' : 'Workspace still matches its starting state' });
  }
  if (operations.some(operation => operation.startsWith('git commit'))) {
    const committed = after.commits.length > before.commits.length || commands.some(item => !item.failed && normalizeOperation(item.command).startsWith('git commit'));
    checks.push({ id: 'commit-state', label: 'Record the requested commit', passed: committed, expected: 'A new or amended commit', actual: committed ? 'Commit recorded' : 'No completed commit found' });
  }
  if (operations.some(operation => operation === 'git switch -c')) {
    const branch = authoredCommands.map(command => command.match(/^git\s+(?:switch|checkout)\s+(?:-c|-b)\s+([^\s]+)/i)?.[1]).find(Boolean);
    const expectedBranch = branch && /^[\w./-]+$/.test(branch) ? branch : null;
    const branched = expectedBranch ? after.branch === expectedBranch : after.branch !== before.branch;
    checks.push({ id: 'branch-state', label: 'Work on the requested branch', passed: branched, expected: expectedBranch ? `Current branch is ${expectedBranch}` : 'Current branch differs from the starting branch', actual: `Current branch: ${after.branch}` });
  }
  if (operations.includes('git init') || operations.includes('git clone')) {
    const repositoryCreated = !!after.repo && after.repo !== before.repo;
    checks.push({ id: 'repository-state', label: 'Create the requested repository', passed: repositoryCreated, expected: 'A new repository in the browser workspace', actual: repositoryCreated ? `Repository: ${after.repo}` : 'No new repository found' });
  }
  if (operations.includes('git tag')) {
    const tag = authoredCommands.filter(command => /^git\s+tag\b/i.test(command)).map(tagFromCommand).find(Boolean);
    const tagged = tag ? after.tags.includes(tag) : after.tags.length > before.tags.length;
    checks.push({ id: 'tag-state', label: 'Create the requested tag', passed: tagged, expected: tag ? `Tag ${tag}` : 'A new tag', actual: after.tags.length ? after.tags.join(', ') : 'No tags found' });
  }
  if (operations.includes('git remote')) {
    const remote = authoredCommands.map(command => command.match(/^git\s+remote\s+add\s+([^\s]+)/i)?.[1]).find(Boolean);
    if (remote) checks.push({ id: 'remote-state', label: 'Configure the requested remote', passed: remote in after.remotes, expected: `Remote ${remote}`, actual: Object.keys(after.remotes).length ? Object.keys(after.remotes).join(', ') : 'No remotes configured' });
  }
  if (/working (?:tree|directory) (?:is )?clean/i.test(criteriaText(activity))) {
    const committed = after.commits.find(commit => commit.id === after.head)?.files ?? {};
    const relevant = new Set([...Object.keys(committed), ...Object.keys(after.files).filter(path => path.startsWith(`${after.repo}/`) && !ignoredBySnapshot(path, after))]);
    const clean = after.staged.length === 0 && Object.keys(after.index).length === 0 && [...relevant].every(path => after.tracked.includes(path) && committed[path] === after.files[path]);
    checks.push({ id: 'clean-state', label: 'Leave the working tree clean', passed: clean, expected: 'No staged, modified, or untracked files', actual: clean ? 'Working tree is clean' : 'Working tree still contains changes' });
  }

  if (courseId === 'github') {
    const criteria = criteriaText(activity).toLowerCase();
    const concepts = ['pull request', 'readme', 'issue', 'actions', 'main', 'origin', 'upstream', 'review', 'reviewer', 'check', 'workflow', 'fork', 'release', 'release notes', 'repository', 'clone', 'template', 'authentication', 'interval', 'documentation', 'reproduce', 'setup', 'field reference', 'direction', 'verification', 'scripts', 'test command', 'utc', 'assertion', 'installation', 'yaml', 'push', 'commit', 'merge', 'squash', 'approval'].filter(term => criteria.includes(term));
    const hasResponse = response.trim().length >= 40;
    checks.push({ id: 'written-response', label: 'Document your GitHub decision or result', passed: hasResponse, expected: 'A concrete response of at least 40 characters in RESPONSE.md', actual: hasResponse ? `${response.trim().length} characters written` : `${response.trim().length} characters written` });
    if (concepts.length) {
      const covered = concepts.filter(term => response.toLowerCase().includes(term) || commands.some(item => item.command.toLowerCase().includes(term)));
      checks.push({ id: 'criteria-concepts', label: 'Address the named completion criteria', passed: covered.length === concepts.length, expected: concepts.join(', '), actual: covered.length ? covered.join(', ') : 'No required concepts found yet' });
    }
  }

  if (!checks.length) {
    const attempted = commands.some(item => !item.failed) || response.trim().length >= 40;
    checks.push({ id: 'attempt', label: 'Complete the authored task', passed: attempted, expected: 'A successful terminal action or written response', actual: attempted ? 'Attempt recorded' : 'No completed work found' });
  }
  return { passed: checks.every(check => check.passed), checks };
}

export function hasGradingPlan(activity: Activity) {
  return activity.type !== 'quiz' && (expectedOperations(activity).length > 0 || activity.sections?.some(item => /completion criteria/i.test(item.title)) === true);
}
