import type { Fixture } from './types.ts';
const base = { 'README.md': '# Sample project\n' };
const repo = (extra: Partial<Fixture> = {}): Fixture => ({ cwd: '/workspace/practice', repo: '/workspace/practice', commits: [{ message: 'Initial project', files: base }], ...extra });
const changed = (before: Record<string,string>, working: Record<string,string>, staged?: Record<string,string>): Fixture => repo({ commits: [{ message: 'Initial project', files: before }], working, staged });

// Explicit starting states, never extracted from or executed from model solutions.
export const fixtures: Record<string, Fixture> = {
  gp001: { cwd: '/workspace', directories: ['/workspace/notes'], repo: '/workspace/sample-app', commits: [{ message: 'Initial project', files: { 'README.md': '# Sample app\n', 'sensors.json': '[]\n' } }] },
  gp002: { cwd: '/workspace/shop/docs', directories: ['/workspace/shop/api'] },
  gp003: { cwd: '/workspace/shop/api', repo: '/workspace/blog', commits: [{ message: 'Initial blog', files: { 'README.md': '# Blog\n' } }] },
  gp004: { cwd: '/workspace', directories: ['/workspace/archive'] },
  gp005: { cwd: '/workspace' }, gp006: { cwd: '/workspace' },
  gp007: { cwd: '/workspace/journal' },
  gp008: { cwd: '/workspace/practice', files: { '/workspace/practice/checklist.txt': 'Inspect the diff.\n' } },
  gp009: { cwd: '/workspace' },
  gp010: { cwd: '/workspace/practice', files: { '/workspace/practice/notes.txt': 'Review branches\n', '/workspace/practice/draft.txt': 'Installation guide\n', '/workspace/practice/scratch.txt': '' } },
  gp011: { cwd: '/workspace/practice', files: { '/workspace/practice/guide.txt': 'Setup notes\n' } },
  gp012: { cwd: '/workspace/practice', directories: ['/workspace/practice/temp'], files: { '/workspace/practice/notes.txt': 'Plan the change\n', '/workspace/practice/draft.tmp': '', '/workspace/practice/docs/guide.txt': 'Keep this guide\n' } },
  gp013: { cwd: '/workspace/sample-app', files: { '/workspace/sample-app/README.md': '# Sample app\n' } },
  gp014: { cwd: '/workspace' },
  gp015: { cwd: '/workspace', files: { '/workspace/library/README.md': '# Library\n', '/workspace/library/books.json': '[]\n' } },
  c01: { cwd: '/workspace', files: { '/workspace/archive/keep.txt': 'Keep this file unchanged.\n' } },
  gp016: changed({ 'README.md': 'Read the senor data.\n' }, { 'README.md': 'Read the sensor data.\n' }),
  gp017: changed({ 'notes.txt': 'Chek status\n' }, { 'notes.txt': 'Check status\n' }),
  gp018: repo(),
  gp019: changed({ 'README.md': 'Read the senor data.\n' }, {}, { 'README.md': 'Read the sensor data.\n' }),
  gp020: repo({ staged: { 'guide.txt': 'Install dependencies, then run tests.\n' } }),
  gp021: changed({ 'README.md': 'Read the senor data.\n', 'notes.txt': 'Notes\n' }, { 'notes.txt': 'Investigate settings\n' }, { 'README.md': 'Read the sensor data.\n' }),
  gp022: changed({ 'README.md': '' }, { 'README.md': 'Read the sensor data.\nCheck the timestamp first.\n' }, { 'README.md': 'Read the sensor data.\n' }),
  gp023: changed({ 'guide.txt': '' }, { 'guide.txt': 'Install dependencies.\nRun tests.\n' }, { 'guide.txt': 'Install dependencies.\n' }),
  gp024: changed({ 'notes.txt': '' }, { 'notes.txt': 'Review changes.\n' }, { 'notes.txt': 'Reveiw changes.\n' }),
  gp025: changed({ 'sensors.json': '{\n  "name": "North senor"\n}\n' }, { 'sensors.json': '{\n  "name": "North sensor"\n}\n' }),
  gp026: repo(), gp027: repo(),
  gp028: changed({ 'README.md': 'Instal dependencies.\n', 'settings.json': '{"timeout":30}\n' }, { 'README.md': 'Install dependencies.\n', 'settings.json': '{"timeout":45}\n' }),
  gp029: changed({ 'help.txt': 'Run the comamnd.\n', 'settings.json': '{"timeout":30}\n', 'notes.txt': 'Investigate.\n' }, { 'help.txt': 'Run the command.\n', 'settings.json': '{"timeout":45}\n', 'notes.txt': 'Investigate settings.\n' }),
  gp030: changed({ 'README.md': 'Install dependencies.\n', 'examples.json': '{"label":"senor"}\n' }, { 'README.md': 'Install dependencies with npm ci.\n', 'examples.json': '{"label":"sensor"}\n' }),
  gp031: changed({ 'README.md': '# Senor project\n\nExisting notes.\n' }, { 'README.md': '# Sensor project\n\nExisting notes.\n\n## Installation\nInstall dependencies with npm ci.\nRun tests with npm test.\n' }),
  gp032: changed({ 'README.md': '# Sample project\n\nSetup notes.\n' }, { 'README.md': '# Experimental sample project\n\nSetup notes.\n\nRun npm test.\n' }),
  gp033: changed({ 'README.md': 'Instal dependencies.\n\nProject notes.\n\nExisting notes.\n\nTesting: tesst.\n' }, { 'README.md': 'Install dependencies.\n\nProject notes.\n\n## Installation\nRun npm ci.\n\nExisting notes.\n\nTesting: test.\n' }),
  gp034: repo({ files: { '/workspace/practice/.env': 'SAMPLE_VALUE=placeholder\n', '/workspace/practice/node_modules/example/index.txt': 'Generated dependency\n' } }),
  gp035: repo({ commits: [{ message: 'Ignore local files', files: { '.gitignore': 'node_modules/\n.env\n', ...base } }], working: { 'cache/temp.txt': 'Temporary cache\n' } }),
  gp036: repo({ commits: [{ message: 'Initial project', files: { 'notes.txt': 'Notes\n' } }], working: { 'README.md': '# Project\n', '.env': 'SAMPLE_VALUE=placeholder\n', 'dist/bundle.js': '// generated example output\n' } }),
  c02: changed({ 'README.md': 'Instal dependencies.\n', 'notes.txt': 'Investigate settings.\n' }, { 'README.md': 'Install dependencies.\n', 'notes.txt': 'Investigate settings. Trial timeout 45.\n', '.env': 'SAMPLE_VALUE=placeholder\n', 'dist/bundle.js': '// generated example output\n' }),
  gp037: repo({ commits: [{ id: 'a10b111', message: 'Document five-minute readings', files: { 'README.md': 'Readings every 5 minutes.\n' } }, { id: 'b20c222', message: 'Increase observation interval', files: { 'README.md': 'Readings every 60 minutes.\n' } }] }),
  gp038: repo({ commits: [{ message: 'Document five-minute readings', files: { 'README.md': 'Readings every 5 minutes.\n', 'notes.txt': 'Notes\n' } }, { message: 'Document hourly readings', files: { 'README.md': 'Readings every 60 minutes.\n', 'notes.txt': 'Notes\n' } }], working: { 'notes.txt': 'Unfinished notes\n' }, note: 'Use the real commit IDs from git log.' }),
  gp039: changed({ 'README.md': 'Instal dependencies.\n', 'settings.json': '{"timeout":30}\n' }, {}, { 'README.md': 'Install dependencies.\n', 'settings.json': '{"timeout":45}\n' }),
  gp040: repo({ commits: [{ message: 'Initial README', files: base }, { message: 'stuff', files: { 'README.md': '# Sample project\nRun npm ci.\n' } }] }),
  gp041: repo({ commits: [{ message: 'Initial README', files: base }, { message: 'Add installation guide', files: { ...base, 'guide.txt': 'Install dependencies.\n' } }] }),
  gp042: repo({ commits: [
    { id: 'b20c222', message: 'Add interval setting', files: { 'settings.json': '{"interval":5}\n' } },
    { id: 'c30d333', message: 'Set incorrect sample interval', files: { 'settings.json': '{"interval":60}\n' } },
    { id: 'd40e444', message: 'Update docs', files: { 'settings.json': '{"interval":60}\n', 'README.md': '# Sample project\n' } },
  ] }),
  c03: repo({ commits: [
    { id: 'a10b111', message: 'Initial project', files: { 'settings.json': '{"timeout":30}\n', 'README.md': 'Instal dependencies.\n', 'notes.txt': 'Investigate.\n' } },
    { id: 'b20c222', message: 'Set incorrect timeout', files: { 'settings.json': '{"timeout":300}\n', 'README.md': 'Instal dependencies.\n', 'notes.txt': 'Investigate.\n' } },
    { id: 'c30d333', message: 'Add help', files: { 'settings.json': '{"timeout":300}\n', 'README.md': 'Instal dependencies.\n', 'notes.txt': 'Investigate.\n', 'help.txt': 'Use --help.\n' } },
  ], staged: { 'README.md': 'Install dependencies.\n', 'notes.txt': 'Investigate cache.\n' } }),
  gp043: repo(), gp057: repo(),
  gp044: documentationBranch('docs/setup', { 'README.md': '# Sample project\nRun npm test.\n' }),
  gp058: documentationBranch('docs/help', { ...base, 'help.txt': 'Run app --help.\n' }),
  gp053: repo({ setup: [['checkout', '-b', 'feature/report']], working: { 'README.md': '# Sample project\nUnfinished report\n', 'notes.txt': 'Report notes\n' } }),
  gp065: repo({ setup: [['checkout', '-b', 'feature/search']], working: { 'README.md': '# Sample project\nUnfinished search\n', 'notes.txt': 'Search notes\n', 'todo.txt': 'Finish search\n' } }),
  gp045: { ...documentationBranch('docs/setup', { 'README.md': '# Sample project\nRun npm test.\n' }), branch: 'main' },
  gp046: conflictScenario('README.md', true),
  gp059: conflictScenario('help.txt', true),
  c04: conflictScenario('README.md', false),
  gp047: { cwd: '/workspace', directories: ['/training'], note: '/training/sample-app.git is a prepared training remote.' },
  gp048: documentationBranch('docs/setup', { 'README.md': '# Sample project\nSetup documented.\n' }),
  gp060: documentationBranch('docs/help', { ...base, 'help.txt': 'Run app --help.\n' }),
  gp049: remoteScenario(false, true),
  gp061: remoteScenario(false),
  gp050: remoteScenario(true),
  gp062: remoteScenario(true),
  gp051: rebaseScenario('docs/setup', { 'README.md': '# Sample project\nSetup notes.\n' }),
  gp063: rebaseScenario('docs/help', { ...base, 'help.txt': 'Help text.\n' }),
  gp052: repo({ branch: 'docs/setup', branches: ['main', 'docs/setup'], branchTips: { main: 'a10b111', 'docs/setup': 'd40e444' }, commits: [{ id: 'a10b111', message: 'Base commit', files: base }, { id: 'b20c222', message: 'Draft README update', files: { 'README.md': '# Updated project\n' } }, { id: 'c30d333', message: 'Fix typo', files: { 'README.md': '# Updated sample project\n' } }, { id: 'd40e444', message: 'Improve wording', files: { 'README.md': '# Improved sample project\n' } }] }),
  gp064: repo({ branch: 'docs/help', branches: ['main', 'docs/help'], branchTips: { main: 'a10b111', 'docs/help': 'c30d333' }, commits: [{ id: 'a10b111', message: 'Base commit', files: base }, { id: 'b20c222', message: 'Add help text', files: { ...base, 'help.txt': 'Help.\n' } }, { id: 'c30d333', message: 'Correct help example', files: { ...base, 'help.txt': 'Run app --help.\n' } }] }),
  gp054: repo({ branch: 'feature/report', branches: ['main', 'feature/report'], branchTips: { main: 'a10b111', 'feature/report': 'c30d333' }, commits: [{ id: 'a10b111', message: 'Initial project', files: { 'README.md': 'Senor report.\n' } }, { id: 'c30d333', message: 'Correct README spelling', files: { 'README.md': 'Sensor report.\n' } }] }),
  gp055: repo({ branchTips: { main: 'a10b111' }, commits: [{ id: 'a10b111', message: 'Initial README', files: base }, { id: 'b20c222', message: 'Document setup', files: { 'README.md': '# Sample project\nRun npm ci.\n' } }], reflog: ['a10b111 reset: moving to HEAD~1', 'b20c222 commit: Document setup', 'a10b111 commit (initial): Initial README'] }),
  gp056: repo({ branch: '(detached at e50f555)', branches: ['main'], branchTips: { main: 'a10b111', '(detached at e50f555)': 'e50f555' }, commits: [{ id: 'a10b111', message: 'Initial README', files: base }, { id: 'e50f555', message: 'Explain sample data', files: { 'README.md': '# Sample project\nSample data explained.\n' } }] }),
  c05: repo({ branchTips: { main: 'a10b111' }, commits: [{ id: 'a10b111', message: 'Initial README', files: { 'README.md': '# Notes\n' } }, { id: 'b20c222', message: 'Add installation guide', files: { 'README.md': '# Notes\n', 'guide.txt': 'Install dependencies.\n' } }, { id: 'c30d333', message: 'Add testing instruction', files: { 'README.md': '# Notes\n', 'guide.txt': 'Install dependencies.\nRun tests.\n' } }], reflog: ['a10b111 reset: moving to A', 'c30d333 commit: Add testing instruction', 'b20c222 commit: Add installation guide'] }),
};

function documentationBranch(branch: string, files: Record<string, string>): Fixture {
  return repo({ branch, branches: ['main', branch], branchTips: { main: 'a10b111', [branch]: 'b20c222' }, commits: [{ id: 'a10b111', message: 'Initial project', files: base }, { id: 'b20c222', message: 'Document usage', files }] });
}
function conflictScenario(path: string, paused: boolean): Fixture {
  const common = { 'notes.txt': 'Keep this note.\n' };
  return repo({ branches: ['main', 'docs/tests'], branchTips: { main: 'b20c222', 'docs/tests': 'c30d333' }, commits: [
    { id: 'a10b111', message: 'Setup instructions', files: { ...common, [path]: 'Setup instructions.\n' } },
    { id: 'b20c222', parents: ['a10b111'], message: 'Install dependencies', files: { ...common, [path]: 'Install dependencies.\n' } },
    { id: 'c30d333', parents: ['a10b111'], message: 'Run tests', files: { ...common, [path]: 'Run tests.\n' } },
  ], ...(paused ? { merge: { source: 'c30d333', conflicts: [path] }, working: { [path]: '<<<<<<< HEAD\nInstall dependencies.\n=======\nRun tests.\n>>>>>>> docs/tests\n' }, note: `Merge paused with a conflict in ${path}. Edit it, git add it, then commit.` } : {}) });
}
function remoteScenario(diverged: boolean, twoIncoming = false): Fixture {
  const incoming = { ...base, 'guide.txt': 'Install dependencies.\n', 'help.txt': 'Run app --help.\n' };
  return repo({ branchTips: { main: diverged ? 'b20c222' : 'a10b111' }, remoteTips: { 'origin/main': twoIncoming ? 'd40e444' : 'c30d333' }, commits: [
    { id: 'a10b111', message: 'Initial README', files: base },
    ...(diverged ? [{ id: 'b20c222', parents: ['a10b111'], message: 'Local README update', files: { 'README.md': '# Updated locally\n' } }] : []),
    { id: 'c30d333', parents: ['a10b111'], message: 'Add usage guide', files: incoming },
    ...(twoIncoming ? [{ id: 'd40e444', parents: ['c30d333'], message: 'Explain testing', files: { ...incoming, 'guide.txt': 'Install dependencies.\nRun tests.\n' } }] : []),
  ], note: 'Remote commits exist in the training remote. Fetch to update origin/main before integrating.' });
}
function rebaseScenario(branch: string, files: Record<string, string>): Fixture {
  return repo({ branch, branches: ['main', branch], branchTips: { main: 'b20c222', [branch]: 'c30d333' }, commits: [
    { id: 'a10b111', message: 'Initial project', files: base },
    { id: 'b20c222', parents: ['a10b111'], message: 'Add sensor example', files: { ...base, 'sensors.json': '[]\n' } },
    { id: 'c30d333', parents: ['a10b111'], message: 'Add documentation', files },
  ] });
}

export function fixtureFor(id: string): { fixture: Fixture; prepared: boolean } {
  const fixture = fixtures[id];
  const writtenGithubTask = id.startsWith('hp') || /^c0[6-8]$/.test(id);
  const fallback = writtenGithubTask
    ? repo({ files: { '/workspace/practice/RESPONSE.md': '' }, note: 'Use RESPONSE.md for GitHub decisions, issue text, pull-request descriptions, review comments, and verification notes. Use the terminal for any Git steps.' })
    : repo({ note: 'Free-practice repository. This advanced starting state is not preconfigured yet; the authored setup remains the source of truth.' });
  return { fixture: fixture ?? fallback, prepared: !!fixture || writtenGithubTask };
}
