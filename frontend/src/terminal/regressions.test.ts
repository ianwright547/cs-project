import { beforeEach, describe, expect, it } from 'vitest';
import { Workspace } from './workspace';
import { fixtureFor } from './fixtures';
import { parseShell } from './shell';
import type { Fixture, Platform } from './types';

const storage = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value), removeItem: (key: string) => storage.delete(key) } });
const fixture: Fixture = { cwd: '/workspace/project', repo: '/workspace/project', commits: [{ id: 'a10b111', message: 'Initial', files: { 'README.md': 'old\n', 'notes.txt': 'Keep\n' } }], working: { 'README.md': 'edited\n' } };
function run(workspace: Workspace, command: string, platform: Platform = 'linux') { const result = workspace.run(command, platform); expect(result.exitCode, `${command}: ${result.output}`).toBe(0); return result.output; }

describe('terminal regressions', () => {
  beforeEach(() => storage.clear());
  for (const platform of ['mac', 'linux', 'windows'] as Platform[]) it(`recovers after an error, preserves quoted text and handles chains on ${platform}`, () => {
    const w = new Workspace(platform, { cwd: '/workspace' }, true);
    expect(w.run('cd missing', platform).exitCode).not.toBe(0);
    run(w, 'mkdir -p "my project/docs" && cd "my project"', platform);
    run(w, 'echo "Use a > b; a && b" > "docs/my notes.txt"\necho "Done" >> "docs/my notes.txt"', platform);
    expect(w.file('docs/my notes.txt')).toBe('Use a > b; a && b\nDone\n');
    run(w, 'cd missing && touch wrong.txt; echo recovered > result.txt', platform);
    expect(w.hasFile('wrong.txt')).toBe(false);
    expect(w.commandRecords().find(record => record.command === 'touch wrong.txt')).toBeUndefined();
    expect(w.file('result.txt')).toBe('recovered\n');
  });
  it('parses comments and escaped quotes without splitting quoted operators', () => {
    expect(parseShell('echo "say \\"hi\\""; # comment\npwd').map(c => c.args)).toEqual([['echo', 'say "hi"'], ['pwd']]);
    expect(() => parseShell('echo "unfinished')).toThrow('quoted');
    expect(() => parseShell('pwd | cat')).toThrow('Pipes');
  });
  it('validates missing operands and parents without inventing files', () => {
    const w = new Workspace('paths', { cwd: '/workspace' }, true);
    for (const cmd of ['cp', 'mv', 'touch absent/a', 'echo a > absent/a', 'mkdir absent/a']) expect(w.run(cmd, 'linux').exitCode, cmd).not.toBe(0);
    run(w, 'mkdir -p a/b; echo keep > a/b/note; cp -r a backup; mv backup saved; rm -r a');
    expect(w.file('saved/b/note')).toBe('keep\n'); expect(w.hasFile('a/b/note')).toBe(false);
  });
  it('keeps absolute editor paths stable when cwd changes and reloads command evidence', () => {
    const w = new Workspace('editor', fixture, true);
    const file = w.view('linux').files.find(f => f.path === 'README.md')!;
    run(w, 'mkdir docs; cd docs'); w.saveFile(file.absolutePath, 'edited from docs\n');
    expect(w.file('../README.md')).toBe('edited from docs\n'); expect(w.hasFile('README.md')).toBe(false);
    expect(new Workspace('editor', fixture, true).commandRecords()).toEqual(w.commandRecords());
  });
  it('restores from the index and unstages without discarding working edits', () => {
    const w = new Workspace('restore', fixture, true);
    run(w, 'git add README.md'); w.saveFile('README.md', 'later\n');
    run(w, 'git restore README.md'); expect(w.file('README.md')).toBe('edited\n');
    run(w, 'git restore --staged README.md'); expect(w.snapshot().staged).toEqual([]); expect(w.file('README.md')).toBe('edited\n');
    run(w, 'git restore --source=HEAD -- README.md'); expect(w.file('README.md')).toBe('old\n');
  });
  it('ignores untracked files in diff, stages deletion once, and rejects empty commits', () => {
    const w = new Workspace('index', fixture, true);
    run(w, 'touch extra.txt'); expect(run(w, 'git diff')).not.toContain('extra.txt');
    run(w, 'git restore README.md; rm notes.txt; git add notes.txt');
    expect(run(w, 'git status --short')).toContain('D  notes.txt');
    expect(run(w, 'git status --short')).not.toContain(' M notes.txt');
    run(w, 'git commit -m "Remove note"; git add README.md');
    expect(w.run('git commit -m "Empty"', 'linux').exitCode).not.toBe(0);
    expect(w.run('git add absent.txt', 'linux').exitCode).not.toBe(0);
  });
  it('respects ignore wildcards and exceptions without ignoring tracked files', () => {
    const w = new Workspace('ignore', fixture, true);
    w.saveFile('.gitignore', '*.txt\n!keep.txt\nREADME.md\n');
    w.saveFile('draft.txt', 'draft'); w.saveFile('keep.txt', 'keep');
    run(w, 'git add .'); expect(w.snapshot().staged).toContain('/workspace/project/README.md');
    expect(w.snapshot().staged).toContain('/workspace/project/keep.txt'); expect(w.snapshot().staged).not.toContain('/workspace/project/draft.txt');
  });
  it('protects dirty files on branch switches and follows branch ancestry for HEAD~1', () => {
    const w = new Workspace('branches', fixture, true);
    run(w, 'git switch -c feature; git add README.md; git commit -m "Feature"; git switch main');
    w.saveFile('README.md', 'uncommitted');
    expect(w.run('git switch feature', 'linux').exitCode).not.toBe(0); expect(w.file('README.md')).toBe('uncommitted');
    run(w, 'git restore README.md; echo note >> notes.txt; git add notes.txt; git commit -m "Main note"');
    expect(run(w, 'git rev-parse HEAD~1')).toBe('a10b111');
    expect(run(w, 'git log --oneline')).not.toContain('Feature');
    expect(w.run('git branch -d feature', 'linux').exitCode).not.toBe(0);
  });
  it('keeps tags attached to their original commit and advances detached HEAD', () => {
    const w = new Workspace('tags', fixture, true);
    run(w, 'git tag start; git add README.md; git commit -m "Change"; git switch --detach start');
    expect(w.file('README.md')).toBe('old\n');
    run(w, 'echo detached > README.md; git add README.md; git commit -m "Detached"');
    expect(run(w, 'git show HEAD:README.md')).toBe('detached');
    expect(run(w, 'git show start:README.md')).toBe('old');
  });
  it('preserves existing staging through soft reset and leaves work intact on mixed reset', () => {
    const w = new Workspace('reset', fixture, true);
    run(w, 'git add README.md; git commit -m "Change"; echo newer > notes.txt; git add notes.txt; git reset --soft HEAD~1');
    expect(w.snapshot().staged).toHaveLength(2); expect(w.snapshot().index['/workspace/project/notes.txt']).toBe('newer\n');
    run(w, 'git reset'); expect(w.snapshot().staged).toEqual([]); expect(w.file('README.md')).toBe('edited\n');
  });
  it('stashes tracked changes by default and includes untracked files only with -u', () => {
    const w = new Workspace('stash', fixture, true);
    run(w, 'echo new > untracked.txt; rm notes.txt; git stash push -m "first"');
    expect(w.file('untracked.txt')).toBe('new\n'); expect(w.file('notes.txt')).toBe('Keep\n');
    run(w, 'git stash pop'); expect(w.hasFile('notes.txt')).toBe(false);
    run(w, 'git stash push -u'); expect(w.hasFile('untracked.txt')).toBe(false);
    run(w, 'git stash apply'); expect(w.file('untracked.txt')).toBe('new\n'); expect(w.hasFile('notes.txt')).toBe(false);
  });
  it('creates real conflict state, refuses unresolved commits, and can abort without losing the original tree', () => {
    const w = new Workspace('merge', fixtureFor('c04').fixture, true);
    const before = w.snapshot(); expect(w.run('git merge docs/tests', 'linux').exitCode).toBe(1);
    expect(run(w, 'git status --short')).toContain('UU README.md');
    expect(w.run('git commit -m "Not resolved"', 'linux').exitCode).toBe(1);
    run(w, 'git merge --abort'); expect(w.snapshot().files).toEqual(before.files); expect(w.snapshot().head).toBe(before.head);
  });
  it('does not pretend external programs ran and reports invalid revisions as failures', () => {
    const w = new Workspace('limits', fixture, true);
    for (const command of ['npm test', 'gh pr create', 'git show nope', 'git show HEAD:nope', 'git switch nope']) expect(w.run(command, 'linux').exitCode, command).not.toBe(0);
  });
});
