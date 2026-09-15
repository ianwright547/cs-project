import { beforeEach, describe, expect, it } from 'vitest';
import type { Fixture } from './types';
import { Workspace } from './workspace';

const values = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', { value: {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => values.set(key, value),
  removeItem: (key: string) => values.delete(key),
} });

const fixture: Fixture = { cwd: '/workspace/project', repo: '/workspace/project', commits: [{ message: 'Initial', files: { 'README.md': 'old\n' } }], working: { 'README.md': 'new\n' } };

describe('browser workspace', () => {
  beforeEach(() => values.clear());

  it('runs the inspect, stage, and commit workflow against repository state', () => {
    const workspace = new Workspace('test-commit', fixture, true);
    expect(workspace.run('git status --short', 'mac').output).toContain('README.md');
    expect(workspace.run('git add README.md', 'mac').exitCode).toBe(0);
    expect(workspace.run('git commit -m "Update README text"', 'mac').output).toContain('Update README text');
    expect(workspace.run('git status', 'mac').output).toContain('working tree clean');
    expect(workspace.snapshot().commits).toHaveLength(2);
  });

  it('supports branches, stashes, remotes, and tags used by advanced lessons', () => {
    const workspace = new Workspace('test-advanced', fixture, true);
    expect(workspace.run('git switch -c docs/setup', 'linux').exitCode).toBe(0);
    workspace.run('git stash push', 'linux');
    expect(workspace.snapshot().stashCount).toBe(1);
    expect(workspace.run('git stash pop', 'linux').exitCode).toBe(0);
    workspace.run('git remote set-url origin https://github.com/learner/project.git', 'linux');
    workspace.run('git tag -a v1.0.0 -m "First version"', 'linux');
    const state = workspace.snapshot();
    expect(state.branch).toBe('docs/setup');
    expect(state.remotes.origin).toContain('github.com/learner/project.git');
    expect(state.tags).toContain('v1.0.0');
  });

  it('persists file edits and restores the authored fixture on reset', () => {
    const workspace = new Workspace('test-save', fixture, true);
    workspace.saveFile('README.md', 'saved\n');
    expect(new Workspace('test-save', fixture, true).file('README.md')).toBe('saved\n');
    workspace.reset(fixture, true);
    expect(workspace.file('README.md')).toBe('new\n');
  });

  it('commits the staged snapshot while preserving later working changes', () => {
    const workspace = new Workspace('test-index', fixture, true);
    workspace.run('git add README.md', 'mac');
    workspace.saveFile('README.md', 'changed after staging\n');
    expect(workspace.run('git diff --staged', 'mac').output).toContain('+new');
    expect(workspace.run('git diff', 'mac').output).toContain('+changed after staging');
    workspace.run('git commit -m "Commit staged version"', 'mac');
    const state = workspace.snapshot();
    expect(state.commits[state.commits.length - 1]?.files['/workspace/project/README.md']).toBe('new\n');
    expect(workspace.run('git status --short', 'mac').output).toContain(' M README.md');
  });

  it('honors simple gitignore rules and reports ignored files on request', () => {
    const ignored: Fixture = { cwd: '/workspace/project', repo: '/workspace/project', commits: [{ message: 'Ignore generated files', files: { '.gitignore': '.env\ndist/\n' } }], working: { '.env': 'SECRET=example\n', 'dist/bundle.js': 'generated\n', 'README.md': '# Project\n' } };
    const workspace = new Workspace('test-ignore', ignored, true);
    const status = workspace.run('git status --short', 'mac').output;
    expect(status).toContain('?? README.md');
    expect(status).not.toContain('.env');
    expect(workspace.run('git status --short --ignored', 'mac').output).toContain('!! .env');
    workspace.run('git add .', 'mac');
    expect(workspace.snapshot().staged.some(path => path.endsWith('/.env'))).toBe(false);
  });

  it('keeps branch tips separate and merges a completed branch into main', () => {
    const workspace = new Workspace('test-branches', fixture, true);
    workspace.run('git switch -c docs/setup', 'mac');
    workspace.run('git add README.md', 'mac');
    workspace.run('git commit -m "Document setup"', 'mac');
    workspace.run('git switch main', 'mac');
    expect(workspace.file('README.md')).toBe('old\n');
    expect(workspace.run('git merge docs/setup', 'mac').exitCode).toBe(0);
    expect(workspace.file('README.md')).toBe('new\n');
  });

  it('supports the authored remote-update, stash-drop, and recovery flows', () => {
    const workspace = new Workspace('test-flows', fixture, true);
    expect(workspace.run('git fetch --prune origin', 'mac').exitCode).toBe(0);
    expect(workspace.run('git merge --ff-only origin/main', 'mac').exitCode).toBe(0);
    workspace.run('git stash push -u -m "Pause work"', 'mac');
    expect(workspace.run('git stash apply stash@{0}', 'mac').exitCode).toBe(0);
    expect(workspace.run('git stash drop stash@{0}', 'mac').exitCode).toBe(0);
    expect(workspace.snapshot().stashCount).toBe(0);
    const commit = workspace.snapshot().commits[0].id;
    expect(workspace.run(`git branch recovered-work ${commit}`, 'mac').exitCode).toBe(0);
    expect(workspace.run('git switch recovered-work', 'mac').exitCode).toBe(0);
  });

  it('runs the multi-file shell sequence used by the first checkpoint', () => {
    const workspace = new Workspace('test-shell', { cwd: '/workspace' }, true);
    workspace.run('mkdir journal', 'mac');
    workspace.run('cd journal', 'mac');
    workspace.run('mkdir docs temp', 'mac');
    workspace.run('echo "# Journal" > README.md', 'mac');
    workspace.run('echo "Install dependencies." > docs/setup.txt', 'mac');
    workspace.run('cp docs/setup.txt docs/setup-backup.txt', 'mac');
    workspace.run('mv docs/setup.txt docs/start.txt', 'mac');
    expect(workspace.run('rmdir temp', 'mac').exitCode).toBe(0);
    expect(workspace.run('cat README.md docs/start.txt docs/setup-backup.txt', 'mac').output).toContain('Install dependencies.');
    expect(workspace.snapshot().directories).not.toContain('/workspace/journal/temp');
  });
});
