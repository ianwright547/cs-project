import type { CommandRecord, WorkspaceSnapshot } from './types';
import type { GradeCheck } from './grader';
import { ignoredPath } from './shell';

// Explicit outcomes supplement command evidence. Typing a command name is not a result.
export function checkLessonOutcome(id: string, before: WorkspaceSnapshot, after: WorkspaceSnapshot, commands: CommandRecord[]): GradeCheck[] {
  const checks: GradeCheck[] = [];
  const check = (label: string, passed: boolean, expected: string) => checks.push({ id: `outcome-${checks.length}`, label, passed, expected, actual: passed ? 'Verified in the workspace' : 'The workspace does not match this result yet' });
  const path = (name: string) => `${after.repo ?? before.cwd}/${name}`;
  const head = after.commits.find(commit => commit.id === after.head);
  const oldHead = before.commits.find(commit => commit.id === before.head);
  const newCommits = after.commits.filter(commit => !before.commits.some(old => old.id === commit.id));
  const file = (name: string) => after.files[path(name)];
  const committed = (name: string) => head?.files[path(name)];
  const ref = (id: string) => before.aliases?.[id] ?? id;
  const cwdTargets: Record<string, string> = { gp001: '/workspace/sample-app', gp002: '/workspace/shop/api', gp003: '/workspace', gp006: '/workspace', gp009: '/workspace/guide', gp015: '/workspace/library', gp047: '/workspace/sample-app' };
  if (cwdTargets[id]) check('Finish in the requested folder', after.cwd === cwdTargets[id], cwdTargets[id]);
  const requiredFiles: Record<string, string[]> = {
    gp004: ['/workspace/journal/README.md', '/workspace/journal/docs/setup.md'],
    gp005: ['/workspace/app/README.md', '/workspace/app/docs/guides/install.md'],
    gp006: ['/workspace/recipes/README.md', '/workspace/recipes/notes/ideas.txt'],
    gp014: ['/workspace/reading-list/README.md'],
  };
  if (requiredFiles[id]) check('Create the requested files', requiredFiles[id].every(path => path in after.files), requiredFiles[id].join(', '));
  const expectedText: Record<string, Record<string, string>> = {
    gp007: { '/workspace/journal/README.md': '# Journal\nNotes from daily practice.\n' },
    gp008: { '/workspace/practice/checklist.txt': 'Inspect the diff.\nRun tests before committing.\n' },
    gp009: { '/workspace/guide/setup.txt': 'Install dependencies.\nRun tests.\n' },
    gp010: { '/workspace/practice/notes.txt': 'Review branches\n', '/workspace/practice/notes-backup.txt': 'Review branches\n', '/workspace/practice/guide.txt': 'Installation guide\n' },
    gp011: { '/workspace/practice/docs/guide.txt': 'Setup notes\n', '/workspace/practice/docs/guide-copy.txt': 'Setup notes\n' },
    gp012: { '/workspace/practice/planning.txt': 'Plan the change\n', '/workspace/practice/docs/guide.txt': 'Keep this guide\n' },
    c01: { '/workspace/journal/README.md': '# Journal\nDaily development notes.\n', '/workspace/journal/docs/start.txt': 'Install dependencies.\n', '/workspace/journal/docs/setup-backup.txt': 'Install dependencies.\n', '/workspace/archive/keep.txt': 'Keep this file unchanged.\n' },
  };
  if (expectedText[id]) check('Keep the required file contents', Object.entries(expectedText[id]).every(([path, text]) => after.files[path] === text), 'The requested text, copies, and preserved files');
  const removed: Record<string, string[]> = { gp010: ['draft.txt', 'scratch.txt'], gp011: ['guide.txt'], gp012: ['draft.tmp', 'temp', 'notes.txt'], c01: ['/workspace/journal/docs/setup.txt', '/workspace/journal/temp'] };
  if (removed[id]) check('Remove only the named disposable paths', removed[id].every(name => { const target = name.startsWith('/') ? name : `${before.cwd}/${name}`; return !(target in after.files) && !after.directories.includes(target); }), removed[id].join(', '));
  if (['gp003', 'gp037', 'gp038'].includes(id)) check('Inspect without changing files', JSON.stringify(before.files) === JSON.stringify(after.files), 'All working files remain unchanged');
  if (['gp016', 'gp017', 'gp018'].includes(id)) {
    const name = id === 'gp016' ? 'README.md' : id === 'gp017' ? 'notes.txt' : 'todo.txt';
    check('Stage the requested content', after.index[path(name)] === (id === 'gp018' ? 'Review the README\n' : before.files[path(name)]) && after.staged.length === 1, `${name} is the only staged file, with the intended text`);
  }
  const commitTargets: Record<string, string> = { gp019: 'README.md', gp020: 'guide.txt', gp021: 'README.md', gp022: 'README.md', gp023: 'guide.txt', gp024: 'notes.txt', gp025: 'sensors.json', gp028: 'README.md', gp029: 'help.txt', gp039: 'README.md' };
  if (commitTargets[id]) {
    const name = commitTargets[id], stagedOnly = ['gp019', 'gp020', 'gp021', 'gp023', 'gp039'].includes(id);
    const expected = stagedOnly ? before.index[path(name)] : before.files[path(name)];
    check('Commit the intended file version', committed(name) === expected, `The intended snapshot of ${name}`);
    check('Preserve unrelated edits', Object.keys(before.files).filter(p => p !== path(name)).every(p => after.files[p] === before.files[p] && head?.files[p] === oldHead?.files[p]), 'Other working edits stay outside this commit');
    if (id === 'gp023') check('Keep the later edit unstaged', file(name) === before.files[path(name)] && after.staged.length === 0, 'Run tests remains in the working file, outside the commit');
  }
  const counts: Record<string, number> = { gp026: 2, gp030: 2, gp031: 2, gp032: 1, gp033: 2, c02: 3 };
  if (counts[id]) check('Record the intended commit boundaries', newCommits.length === counts[id], `${counts[id]} new commits`);
  if (['gp031', 'gp032', 'gp033'].includes(id)) {
    const partial: Record<string, string> = { gp031: '# Sensor project\n\nExisting notes.\n', gp032: '# Sample project\n\nSetup notes.\n\nRun npm test.\n', gp033: 'Install dependencies.\n\nProject notes.\n\nExisting notes.\n\nTesting: test.\n' };
    check('Select the correct hunks', newCommits[0]?.files[path('README.md')] === partial[id], 'The first commit contains only the requested changes');
    check('Preserve the remaining work', file('README.md') === before.files[path('README.md')], 'No working text is lost');
  }
  if (['gp034', 'gp035', 'gp036', 'c02'].includes(id)) {
    const unwanted = id === 'gp034' ? ['.env', 'node_modules/example/index.txt'] : id === 'gp035' ? ['cache/temp.txt'] : ['.env', 'dist/bundle.js'];
    check('Commit the ignore rules', !!committed('.gitignore'), '.gitignore appears in the current commit');
    check('Exclude generated and local files', unwanted.every(name => !after.tracked.includes(path(name)) && ignoredPath(path(name), after.repo, after.files)), unwanted.join(', '));
  }
  if (id === 'gp040') check('Amend the message without adding a parent', head?.message !== 'stuff' && head?.parents?.[0] === oldHead?.parents?.[0], 'The last commit is replaced with a descriptive message');
  if (id === 'gp041') check('Keep the guide after rebuilding the commit', committed('guide.txt') === before.files[path('guide.txt')] && committed('README.md') === before.files[path('README.md')], 'The guide and README are preserved');
  if (id === 'gp042' || id === 'c03') {
    const name = 'settings.json';
    check('Reverse only the incorrect setting', committed(name) === (id === 'gp042' ? '{"interval":5}\n' : '{"timeout":30}\n'), 'The original setting is restored in a new commit');
    check('Keep later useful work', id === 'gp042' ? committed('README.md') === before.files[path('README.md')] : committed('help.txt') === before.files[path('help.txt')] && file('notes.txt') === before.files[path('notes.txt')], 'Later documentation and unrelated edits remain');
  }
  if (['gp044', 'gp058', 'gp045', 'c04'].includes(id)) check('Return to main', after.branch === 'main', 'main is checked out');
  if (['gp046', 'gp059', 'c04'].includes(id)) {
    const name = id === 'gp059' ? 'help.txt' : 'README.md';
    const text = committed(name) ?? '';
    check('Resolve and record both contributions', !after.conflicts?.length && !/^(<{7}|={7}|>{7})/m.test(text) && /install/i.test(text) && /test/i.test(text) && head?.parents?.length === 2, 'A merge commit with both instructions and no conflict markers');
    if (id === 'c04') check('Meet the checkpoint wording and preserve the note', text === 'Install dependencies, then run tests.\n' && file('notes.txt') === 'Keep this note.\n' && !after.branches.includes('docs/tests'), 'The accepted README sentence, unchanged notes, and deleted merged branch');
  }
  if (['gp049', 'gp061', 'gp050', 'gp062'].includes(id)) {
    check('Integrate the incoming content', !!committed('guide.txt'), 'The fetched guide exists in local history');
    if (id === 'gp050' || id === 'gp062') check('Publish both contributions', committed('README.md') === '# Updated locally\n' && after.remoteTips?.['origin/main'] === after.head && head?.parents?.length === 2, 'The training remote points to the combined merge commit');
  }
  if (['gp048', 'gp060'].includes(id)) check('Publish the branch tip', after.remoteTips?.[`origin/${after.branch}`] === after.head, 'The training remote points to the local branch commit');
  if (['gp051', 'gp063'].includes(id)) check('Replay the documentation after main', after.head !== before.head && head?.parents?.[0] === before.branchTips?.main && !!committed('sensors.json'), 'The documentation commit follows the latest main and preserves its files');
  if (['gp052', 'gp064'].includes(id)) check('Squash the drafts', head?.parents?.[0] === ref('a10b111') && after.head !== before.head && Object.entries(oldHead?.files ?? {}).every(([path, text]) => head?.files[path] === text), 'One replacement commit after the base, with all final content');
  if (['gp053', 'gp065'].includes(id)) check('Restore the paused work and drop its stash', after.stashCount === 0 && Object.entries(before.files).every(([path, text]) => after.files[path] === text) && commands.some(item => !item.failed && /git stash (apply|pop)/.test(item.command)), 'The tracked and untracked work returns without losing files');
  if (id === 'gp054') check('Apply the selected fix to main', after.branch === 'main' && committed('README.md') === 'Sensor report.\n' && head?.parents?.[0] === ref('a10b111'), 'A new commit applies the spelling fix to main');
  if (id === 'gp055') check('Recover the missing commit', after.branch === 'recovered-work' && after.head === ref('b20c222') && after.branchTips?.main === ref('a10b111'), 'The recovery branch points to the missing commit; main stays at its original tip');
  if (id === 'gp056') check('Attach the detached work to a branch', after.branch === 'docs/recovered' && after.head === ref('e50f555'), 'docs/recovered preserves the detached commit');
  if (id === 'c05') check('Recover and extend the guide', committed('guide.txt') === 'Install dependencies.\nRun tests.\nInspect the result.\n' && head?.parents?.[0] === ref('c30d333') && after.branchTips?.main === ref('a10b111'), 'All three lines, a new child of C, and unchanged main');
  return checks;
}
