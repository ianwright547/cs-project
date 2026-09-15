import type { Fixture, Platform, WorkspaceSnapshot, WorkspaceView } from './types';

type WorkspaceState = {
  cwd: string;
  files: Record<string, string>;
  directories: Set<string>;
  repo?: string;
  tracked: Set<string>;
  staged: Set<string>;
  index: Record<string, string | null>;
  commits: { id: string; message: string; files: Record<string, string> }[];
  branch: string;
  branches: Set<string>;
  branchTips: Record<string, string>;
  remotes: Record<string, string>;
  tags: Set<string>;
  stashes: { files: Record<string, string>; staged: string[]; index: Record<string, string | null>; branch: string }[];
  reflog: string[];
  output: string;
  exitCode: number;
  saved: boolean;
  fixture: boolean;
};

const root = '/workspace';
const normalize = (path: string, cwd: string) => {
  const absolute = path.startsWith('/') ? path : `${cwd}/${path}`;
  const parts: string[] = [];
  for (const part of absolute.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') parts.pop(); else parts.push(part);
  }
  return `/${parts.join('/')}` || '/';
};
const displayPath = (path: string, platform: Platform) => platform === 'windows' ? `${path.startsWith('/') ? 'C:' : ''}${path.split('/').join('\\')}` : path;
const shortName = (path: string) => path.split('/')[path.split('/').length - 1] || '/';
const commandParts = (command: string) => [...command.matchAll(/"([^"]*)"|'([^']*)'|([^\s]+)/g)].map(match => match[1] ?? match[2] ?? match[3]);

function stateFor(id: string, fixture: Fixture, prepared: boolean): WorkspaceState {
  const files: Record<string, string> = {};
  for (const [path, content] of Object.entries(fixture.files ?? {})) files[normalize(path, fixture.cwd)] = content;
  const directories = new Set<string>([root, fixture.cwd]);
  for (const path of fixture.directories ?? []) directories.add(normalize(path, fixture.cwd));
  for (const path of Object.keys(files)) {
    let parent = path;
    while (parent.includes('/')) { parent = parent.slice(0, parent.lastIndexOf('/')) || '/'; directories.add(parent); if (parent === '/') break; }
  }
  const commits = (fixture.commits ?? []).map((commit, index) => ({ id: `${(index + 1).toString(16).padStart(7, '0')}${id.slice(-1)}`, ...commit, files: Object.fromEntries(Object.entries(commit.files).map(([p, c]) => [normalize(p, fixture.repo ?? fixture.cwd), c])) }));
  if (fixture.repo) for (const commit of commits) Object.assign(files, commit.files);
  const tracked = new Set(Object.keys(commits.length ? commits[commits.length - 1].files : {}));
  const staged = new Set<string>();
  const index: Record<string, string | null> = {};
  for (const [path, content] of Object.entries(fixture.staged ?? {})) { const full = normalize(path, fixture.repo ?? fixture.cwd); files[full] = content; staged.add(full); index[full] = content; tracked.add(full); }
  for (const [path, content] of Object.entries(fixture.working ?? {})) files[normalize(path, fixture.repo ?? fixture.cwd)] = content;
  const branchSetup = fixture.setup?.find(command => (command[0] === 'checkout' || command[0] === 'switch') && command.includes('-b'));
  const branch = fixture.branch ?? branchSetup?.[branchSetup.indexOf('-b') + 1] ?? 'main';
  const branches = new Set(fixture.branches ?? ['main', branch]);
  const tip = commits[commits.length - 1]?.id ?? '';
  return { cwd: fixture.cwd, files, directories, repo: fixture.repo, tracked, staged, index, commits, branch, branches, branchTips: Object.fromEntries([...branches].map(name => [name, tip])), remotes: fixture.remotes ?? (fixture.repo ? { origin: '/training/sample-app.git' } : {}), tags: new Set(fixture.tags ?? []), stashes: [], reflog: fixture.reflog ?? commits.map(commit => `${commit.id.slice(0, 7)} commit: ${commit.message}`), output: fixture.note ?? `Code Practice terminal ready for ${id.toUpperCase()}.`, exitCode: 0, saved: false, fixture: prepared };
}

function savedStateFor(id: string): WorkspaceState | null {
  try {
    const raw = localStorage.getItem(`code-practice-workspace:${id}`);
    if (!raw) return null;
    const saved = JSON.parse(raw) as Omit<WorkspaceState, 'directories' | 'tracked' | 'staged' | 'branches' | 'tags'> & { directories: string[]; tracked: string[]; staged: string[]; branches?: string[]; tags?: string[] };
    if (!saved.cwd || !saved.files || !Array.isArray(saved.directories) || !Array.isArray(saved.tracked) || !Array.isArray(saved.staged)) return null;
    const branches = new Set(saved.branches ?? ['main', saved.branch]);
    const tip = saved.commits[saved.commits.length - 1]?.id ?? '';
    return { ...saved, directories: new Set(saved.directories), tracked: new Set(saved.tracked), staged: new Set(saved.staged), index: saved.index ?? Object.fromEntries(saved.staged.map(path => [path, saved.files[path] ?? null])), branches, branchTips: saved.branchTips ?? Object.fromEntries([...branches].map(name => [name, tip])), remotes: saved.remotes ?? {}, tags: new Set(saved.tags ?? []), stashes: (saved.stashes ?? []).map(stash => ({ ...stash, index: stash.index ?? Object.fromEntries(stash.staged.map(path => [path, stash.files[path] ?? null])) })), reflog: saved.reflog ?? [], saved: true };
  } catch {
    return null;
  }
}

function snapshotOf(state: WorkspaceState): WorkspaceSnapshot {
  return { cwd: state.cwd, files: { ...state.files }, directories: [...state.directories], repo: state.repo, tracked: [...state.tracked], staged: [...state.staged], index: { ...state.index }, commits: state.commits.map(commit => ({ ...commit, files: { ...commit.files } })), head: state.branchTips[state.branch] ?? state.commits[state.commits.length - 1]?.id ?? '', branch: state.branch, branches: [...state.branches], remotes: { ...state.remotes }, tags: [...state.tags], stashCount: state.stashes.length };
}

export function initialSnapshotFor(id: string, fixture: Fixture, prepared: boolean): WorkspaceSnapshot {
  return snapshotOf(stateFor(id, fixture, prepared));
}

export class Workspace {
  private state: WorkspaceState;
  readonly id: string;
  constructor(id: string, fixture: Fixture, prepared: boolean) { this.id = id; this.state = savedStateFor(id) ?? stateFor(id, fixture, prepared); }
  private writeLocal() { try { localStorage.setItem(`code-practice-workspace:${this.id}`, JSON.stringify({ ...this.state, directories: [...this.state.directories], tracked: [...this.state.tracked], staged: [...this.state.staged], branches: [...this.state.branches], tags: [...this.state.tags] })); this.state.saved = true; } catch { /* storage is optional */ } }
  view(platform: Platform): WorkspaceView {
    const prefix = this.state.cwd.endsWith('/') ? this.state.cwd : `${this.state.cwd}/`;
    const files = Object.keys(this.state.files).filter(path => path.startsWith(prefix)).map(path => path.slice(prefix.length)).filter(Boolean).map(path => ({ path: displayPath(path, platform), directory: false }));
    return { cwd: displayPath(this.state.cwd, platform), files, saved: this.state.saved, output: this.state.output, exitCode: this.state.exitCode, fixture: this.state.fixture, branch: this.state.branch };
  }
  file(path: string) { return this.state.files[normalize(path, this.state.cwd)] ?? ''; }
  snapshot(): WorkspaceSnapshot { return snapshotOf(this.state); }
  saveFile(path: string, content: string) { this.state.files[normalize(path, this.state.cwd)] = content; this.writeLocal(); }
  reset(fixture: Fixture, prepared: boolean) { localStorage.removeItem(`code-practice-workspace:${this.id}`); this.state = stateFor(this.id, fixture, prepared); }
  run(raw: string, platform: Platform): WorkspaceView {
    const command = raw.trim();
    if (!command) return this.view(platform);
    const [name, ...args] = commandParts(command);
    const alias: Record<string, string> = platform === 'windows' ? { dir: 'ls', type: 'cat', cls: 'clear' } : {};
    const cmd = alias[name.toLowerCase()] ?? name.toLowerCase();
    const out: string[] = [];
    const fail = (message: string) => { this.state.exitCode = 1; out.push(message); };
    const pathArg = (value = '.') => {
      const cleaned = value.replace(/^['"]|['"]$/g, '').replace(/^C:/i, '').split('\\').join('/');
      return normalize(cleaned || '/', this.state.cwd);
    };
    if (cmd.startsWith('#')) out.push('');
    else if (cmd === 'pwd' || cmd === 'cd' && !args.length) out.push(displayPath(this.state.cwd, platform));
    else if (cmd === 'clear' || cmd === 'cls') this.state.output = '';
    else if (cmd === 'cd') { const target = pathArg(args[0]); if (!this.state.directories.has(target)) fail(`cd: no such directory: ${args[0]}`); else this.state.cwd = target; }
    else if (cmd === 'ls') { const operand = args.find(arg => !arg.startsWith('-')); const target = pathArg(operand); if (!this.state.directories.has(target)) fail(`ls: cannot access '${operand ?? target}': No such file or directory`); else { const prefix = target.endsWith('/') ? target : `${target}/`; const names = new Set<string>(); for (const path of [...Object.keys(this.state.files), ...this.state.directories]) if (path.startsWith(prefix)) { const rest = path.slice(prefix.length); if (rest && !rest.includes('/')) names.add(rest); } out.push([...names].sort().join('  ')); } }
    else if (cmd === 'mkdir' || cmd === 'md') { const operands = args.filter(arg => !arg.startsWith('-')); if (!operands.length) fail('mkdir: missing operand'); else for (const operand of operands) { const target = pathArg(operand); this.state.directories.add(target); out.push(`created ${displayPath(target, platform)}`); } }
    else if (cmd === 'rmdir' || cmd === 'rd') { const operands = args.filter(arg => !arg.startsWith('-')); if (!operands.length) fail('rmdir: missing operand'); else for (const operand of operands) { const target = pathArg(operand); const occupied = Object.keys(this.state.files).some(path => path.startsWith(`${target}/`)) || [...this.state.directories].some(path => path !== target && path.startsWith(`${target}/`)); if (!this.state.directories.has(target)) fail(`rmdir: ${operand}: No such directory`); else if (occupied) fail(`rmdir: ${operand}: Directory not empty`); else this.state.directories.delete(target); } }
    else if (cmd === 'touch') { const operands = args.filter(arg => !arg.startsWith('-')); if (!operands.length) fail('touch: missing file operand'); else for (const operand of operands) { const target = pathArg(operand); this.state.files[target] ??= ''; this.state.directories.add(target.slice(0, target.lastIndexOf('/')) || '/'); } }
    else if (cmd === 'cat' || cmd === 'type') { const operands = args.filter(arg => !arg.startsWith('-')); if (!operands.length) fail('cat: missing file operand'); else for (const operand of operands) { const target = pathArg(operand); if (!(target in this.state.files)) fail(`cat: ${operand}: No such file`); else out.push(this.state.files[target]); } }
    else if (cmd === 'rm' || cmd === 'del') { const operands = args.filter(arg => !arg.startsWith('-')); if (!operands.length) fail('rm: missing operand'); else for (const operand of operands) { const target = pathArg(operand); if (!(target in this.state.files)) fail(`rm: ${operand}: No such file`); else delete this.state.files[target]; } }
    else if (cmd === 'mv' || cmd === 'ren') { const from = pathArg(args[0]); const to = pathArg(args[1]); if (!(from in this.state.files)) fail(`mv: ${args[0]}: No such file`); else { this.state.files[to] = this.state.files[from]; delete this.state.files[from]; } }
    else if (cmd === 'cp' || cmd === 'copy') { const from = pathArg(args[0]); const to = pathArg(args[1]); if (!(from in this.state.files)) fail(`cp: ${args[0]}: No such file`); else this.state.files[to] = this.state.files[from]; }
    else if (cmd === 'echo') { const text = raw.replace(/^echo\s+/i, '').replace(/^['"]|['"]$/g, ''); const redirection = text.match(/^(.*?)\s*(>>?)\s*(\S+)$/); if (redirection) { const target = pathArg(redirection[3]); this.state.files[target] = (redirection[2] === '>>' ? `${this.state.files[target] ?? ''}` : '') + redirection[1].replace(/^['"]|['"]$/g, '') + '\n'; this.state.directories.add(target.slice(0, target.lastIndexOf('/')) || '/'); } else out.push(text); }
    else if (cmd === 'git') this.git(args, out, fail);
    else if (cmd === 'npm' && args[0] === 'test') out.push('Tests passed in the training workspace.');
    else if (cmd === 'gh') out.push(`GitHub CLI simulation completed: gh ${args.join(' ')}`);
    else fail(`${name}: command not found in the Code Practice workspace`);
    this.state.output = out.join('\n'); this.writeLocal(); return this.view(platform);
  }
  private git(args: string[], out: string[], fail: (message: string) => void) {
    const sub = args[0];
    const inRepository = !!this.state.repo && (this.state.cwd === this.state.repo || this.state.cwd.startsWith(`${this.state.repo}/`));
    if (!['init', 'clone', 'config'].includes(sub) && !inRepository) return fail('fatal: not a git repository (or any of the parent directories): .git');
    const head = () => {
      const tip = this.state.branchTips[this.state.branch];
      return this.state.commits.find(commit => commit.id === tip) ?? this.state.commits[this.state.commits.length - 1];
    };
    const isIgnored = (path: string) => {
      if (!this.state.repo) return false;
      const ignoreFile = this.state.files[`${this.state.repo}/.gitignore`];
      if (!ignoreFile || path === `${this.state.repo}/.gitignore`) return false;
      const relative = path.slice(this.state.repo.length + 1);
      return ignoreFile.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#')).some(pattern => {
        const clean = pattern.replace(/^\//, '').replace(/\/$/, '');
        if (!clean) return false;
        return relative === clean || relative.startsWith(`${clean}/`) || (!clean.includes('/') && relative.split('/').includes(clean));
      });
    };
    const contentAtIndex = (path: string, committed: Record<string, string>) => path in this.state.index ? this.state.index[path] : committed[path];
    const simpleDiff = (path: string, before: string | null | undefined, after: string | null | undefined) => {
      if (before === after) return '';
      const name = path.slice((this.state.repo?.length ?? 0) + 1);
      const oldLines = (before ?? '').replace(/\n$/, '').split('\n').filter((line, index, all) => line || index < all.length - 1);
      const newLines = (after ?? '').replace(/\n$/, '').split('\n').filter((line, index, all) => line || index < all.length - 1);
      return [`diff --git a/${name} b/${name}`, before == null ? '--- /dev/null' : `--- a/${name}`, after == null ? '+++ /dev/null' : `+++ b/${name}`, '@@ -1 +1 @@', ...oldLines.map(line => `-${line}`), ...newLines.map(line => `+${line}`)].join('\n');
    };
    const resolveCommit = (ref = 'HEAD') => {
      const previous = ref.match(/^HEAD~(\d+)$/);
      if (previous) return this.state.commits[this.state.commits.length - 1 - Number(previous[1])];
      if (ref === 'HEAD' || ref === this.state.branch || this.state.tags.has(ref)) return head();
      if (this.state.branches.has(ref)) return this.state.commits.find(commit => commit.id === this.state.branchTips[ref]);
      return this.state.commits.find(commit => commit.id.startsWith(ref));
    };
    const recordCommit = (message: string, amend = false) => {
      const amendedFiles = amend ? { ...(head()?.files ?? {}) } : null;
      const committedFiles = { ...(amendedFiles ?? head()?.files ?? {}) };
      for (const [path, content] of Object.entries(this.state.index)) {
        if (content === null) delete committedFiles[path]; else committedFiles[path] = content;
      }
      this.state.tracked = new Set(Object.keys(committedFiles));
      const id = `${(this.state.commits.length + 1).toString(16).padStart(7, '0')}${this.id.slice(-1)}`;
      const commit = { id, message, files: committedFiles };
      this.state.commits.push(commit);
      if (this.state.branches.has(this.state.branch)) this.state.branchTips[this.state.branch] = id;
      this.state.staged.clear();
      this.state.index = {};
      this.state.reflog.unshift(`${id.slice(0, 7)} ${amend ? 'commit (amend)' : 'commit'}: ${message}`);
      return commit;
    };
    if (sub === 'init') { const branchFlag = args.findIndex(arg => arg === '-b' || arg === '--initial-branch'); this.state.branch = branchFlag >= 0 ? args[branchFlag + 1] ?? 'main' : 'main'; this.state.branches = new Set([this.state.branch]); this.state.branchTips = { [this.state.branch]: '' }; this.state.repo = this.state.cwd; this.state.tracked.clear(); this.state.staged.clear(); this.state.index = {}; this.state.commits = []; this.state.reflog = []; out.push(`Initialized empty Git repository in ${this.state.cwd}/.git/`); }
    else if (sub === 'status') {
      if (!this.state.repo) return fail('fatal: not a git repository');
      const committed = head()?.files ?? {};
      const currentPaths = Object.keys(this.state.files).filter(path => path.startsWith(`${this.state.repo}/`));
      const stagedPaths = Object.keys(this.state.index).filter(path => committed[path] !== (this.state.index[path] ?? undefined));
      const changed = [...new Set([...Object.keys(committed), ...currentPaths, ...Object.keys(this.state.index)])].filter(path => this.state.tracked.has(path) && contentAtIndex(path, committed) !== this.state.files[path]);
      const ignored = currentPaths.filter(path => !this.state.tracked.has(path) && isIgnored(path));
      const untracked = currentPaths.filter(path => !this.state.tracked.has(path) && !path.includes('/.git/') && !isIgnored(path));
      const short = args.includes('--short');
      if (short) {
        out.push(...stagedPaths.map(path => `${committed[path] === undefined ? 'A' : this.state.index[path] === null ? 'D' : 'M'}  ${shortName(path)}`), ...changed.map(path => ` M ${shortName(path)}`), ...untracked.map(path => `?? ${shortName(path)}`));
        if (args.includes('--ignored')) out.push(...ignored.map(path => `!! ${shortName(path)}`));
        if (!out.length) out.push('');
        return;
      }
      out.push(`On branch ${this.state.branch}`);
      if (stagedPaths.length) out.push(`Changes to be committed:\n  ${stagedPaths.map(path => `${committed[path] === undefined ? 'new file' : this.state.index[path] === null ? 'deleted' : 'modified'}: ${shortName(path)}`).join('\n  ')}`);
      if (changed.length) out.push(`Changes not staged for commit:\n  ${changed.map(path => `${this.state.files[path] === undefined ? 'deleted' : 'modified'}: ${shortName(path)}`).join('\n  ')}`);
      if (untracked.length) out.push(`Untracked files:\n  ${untracked.map(shortName).join('\n  ')}`);
      if (args.includes('--ignored') && ignored.length) out.push(`Ignored files:\n  ${ignored.map(shortName).join('\n  ')}`);
      if (!changed.length && !untracked.length && !stagedPaths.length) out.push('nothing to commit, working tree clean');
    }
    else if (sub === 'add') { if (!this.state.repo) return fail('fatal: not a git repository'); const operands = args.slice(1).filter(arg => !arg.startsWith('-')); const requested = operands.length && !operands.includes('.') ? operands : ['.']; const force = args.includes('-f') || args.includes('--force'); for (const operand of requested) { const target = operand === '.' ? this.state.cwd : normalize(operand, this.state.cwd); for (const path of new Set([...Object.keys(this.state.files), ...this.state.tracked])) if ((path === target || path.startsWith(`${target}/`)) && (force || !isIgnored(path))) { this.state.staged.add(path); this.state.index[path] = path in this.state.files ? this.state.files[path] : null; if (path in this.state.files) this.state.tracked.add(path); } } out.push(args.includes('-p') ? 'Staged selected changes from the requested patch.' : 'Changes staged.'); }
    else if (sub === 'commit') { const amend = args.includes('--amend'); if (!this.state.staged.size && !amend) return fail('nothing to commit, working tree clean'); const messageIndex = args.indexOf('-m'); const message = messageIndex >= 0 ? args[messageIndex + 1] ?? 'Update files' : amend ? head()?.message ?? 'Update files' : 'Update files'; const commit = recordCommit(message, amend); out.push(`[${this.state.branch} ${commit.id.slice(0, 7)}] ${message}`); }
    else if (sub === 'log') { const maxArg = args.find(arg => /^-\d+$/.test(arg)); const limit = maxArg ? Number(maxArg.slice(1)) : this.state.commits.length; const entries = [...this.state.commits].reverse().slice(0, limit).map(commit => `${commit.id.slice(0, 7)} ${commit.message}`); out.push(entries.join('\n') || 'No commits yet.'); }
    else if (sub === 'diff') { const committed = head()?.files ?? {}; const staged = args.includes('--staged') || args.includes('--cached'); const separator = args.indexOf('--'); const refs = args.slice(1, separator >= 0 ? separator : undefined).filter(arg => !arg.startsWith('-')); const left = refs.length >= 2 ? resolveCommit(refs[0])?.files : null; const right = refs.length >= 2 ? resolveCommit(refs[1])?.files : null; const pathFilter = separator >= 0 && args[separator + 1] ? normalize(args[separator + 1], this.state.repo ?? this.state.cwd) : null; const candidates = new Set([...(left ? Object.keys(left) : Object.keys(committed)), ...(right ? Object.keys(right) : Object.keys(this.state.index)), ...Object.keys(this.state.files)]); const diffs = [...candidates].filter(path => !pathFilter || path === pathFilter).map(path => left && right ? simpleDiff(path, left[path], right[path]) : staged ? simpleDiff(path, committed[path], path in this.state.index ? this.state.index[path] : committed[path]) : simpleDiff(path, contentAtIndex(path, committed), this.state.files[path])).filter(Boolean); out.push(diffs.join('\n') || ''); }
    else if (sub === 'restore') { const committed = head()?.files ?? {}; const targetArg = args.find(arg => !arg.startsWith('-')); if (!targetArg) return fail('fatal: you must specify path(s) to restore'); const target = normalize(targetArg, this.state.cwd); if (args.includes('--staged')) { this.state.staged.delete(target); delete this.state.index[target]; } else { const source = contentAtIndex(target, committed); if (source === undefined || source === null) return fail(`error: pathspec '${targetArg}' did not match any tracked file`); this.state.files[target] = source; } }
    else if (sub === 'reset') {
      const mode = args.find(arg => ['--soft', '--mixed', '--hard'].includes(arg)) ?? '--mixed';
      const targetArg = args.find((arg, index) => index > 0 && !arg.startsWith('-'));
      if (targetArg && targetArg !== 'HEAD' && !targetArg.startsWith('HEAD~') && !resolveCommit(targetArg)) { const path = normalize(targetArg, this.state.cwd); this.state.staged.delete(path); delete this.state.index[path]; out.push('Unstaged changes after reset.'); }
      else {
        const previousHead = { ...(head()?.files ?? {}) };
        const target = resolveCommit(targetArg ?? 'HEAD');
        if (!target) return fail(`fatal: ambiguous argument '${targetArg ?? 'HEAD'}'`);
        if (this.state.branches.has(this.state.branch)) this.state.branchTips[this.state.branch] = target.id;
        if (mode === '--hard') { for (const path of [...this.state.tracked]) delete this.state.files[path]; Object.assign(this.state.files, target.files); this.state.tracked = new Set(Object.keys(target.files)); this.state.staged.clear(); this.state.index = {}; }
        else if (mode === '--soft') { this.state.index = {}; for (const path of new Set([...Object.keys(target.files), ...Object.keys(previousHead)])) if (target.files[path] !== previousHead[path]) { this.state.staged.add(path); this.state.index[path] = previousHead[path] ?? null; } }
        else { this.state.staged.clear(); this.state.index = {}; }
        this.state.reflog.unshift(`${target.id.slice(0, 7)} reset: moving to ${targetArg ?? 'HEAD'}`);
        out.push(mode === '--hard' ? `HEAD is now at ${target.id.slice(0, 7)} ${target.message}` : 'Unstaged changes after reset.');
      }
    }
    else if (sub === 'switch' || sub === 'checkout') {
      const create = args.includes('-b') || args.includes('-c');
      const branchName = args.find((arg, index) => index > 0 && !arg.startsWith('-'));
      if (!branchName) return fail('fatal: a branch name is required');
      if (args.includes('--detach')) { const commit = resolveCommit(branchName); if (!commit) return fail(`fatal: invalid reference: ${branchName}`); this.state.branch = `(detached at ${commit.id.slice(0, 7)})`; this.state.branchTips[this.state.branch] = commit.id; for (const path of [...this.state.tracked]) delete this.state.files[path]; Object.assign(this.state.files, commit.files); this.state.tracked = new Set(Object.keys(commit.files)); out.push(`HEAD is now at ${commit.id.slice(0, 7)} ${commit.message}`); }
      else { if (create) { this.state.branches.add(branchName); this.state.branchTips[branchName] = head()?.id ?? ''; this.state.branch = branchName; } else { if (!this.state.branches.has(branchName)) return fail(`fatal: invalid reference: ${branchName}`); this.state.branch = branchName; const commit = head(); if (commit) { for (const path of [...this.state.tracked]) delete this.state.files[path]; Object.assign(this.state.files, commit.files); this.state.tracked = new Set(Object.keys(commit.files)); } } out.push(`Switched to ${create ? 'a new ' : ''}branch '${this.state.branch}'`); }
      this.state.reflog.unshift(`${head()?.id.slice(0, 7) ?? '0000000'} checkout: moving to ${branchName}`);
    }
    else if (sub === 'branch') {
      const deleteFlag = args.find(arg => arg === '-d' || arg === '-D');
      const branchName = args.find((arg, index) => index > 0 && !arg.startsWith('-'));
      if (deleteFlag && branchName) { if (branchName === this.state.branch) return fail(`error: Cannot delete branch '${branchName}' checked out`); this.state.branches.delete(branchName); delete this.state.branchTips[branchName]; out.push(`Deleted branch ${branchName}.`); }
      else if (branchName && !args.includes('-v') && !args.includes('-vv')) { const startPoint = args[args.indexOf(branchName) + 1]; const start = startPoint ? resolveCommit(startPoint) : head(); if (startPoint && !start) return fail(`fatal: not a valid object name: '${startPoint}'`); this.state.branches.add(branchName); this.state.branchTips[branchName] = start?.id ?? ''; out.push(`Created branch ${branchName}.`); }
      else out.push([...this.state.branches].map(branch => `${branch === this.state.branch ? '*' : ' '} ${branch}${args.some(arg => arg.startsWith('-v')) ? ` ${head()?.id.slice(0, 7) ?? ''} ${head()?.message ?? ''}` : ''}`).join('\n'));
    }
    else if (sub === 'show') { const spec = args.find((arg, index) => index > 0 && !arg.startsWith('-')) ?? 'HEAD'; const fileSpec = spec.match(/^([^:]+):(.+)$/); const separator = args.indexOf('--'); const separatedPath = separator >= 0 ? args[separator + 1] : undefined; if (fileSpec || separatedPath) { const ref = fileSpec?.[1] ?? spec; const requested = fileSpec?.[2] ?? separatedPath ?? ''; const commit = resolveCommit(ref); const path = normalize(requested, this.state.repo ?? this.state.cwd); out.push(commit?.files[path] ?? `fatal: path '${requested}' does not exist in '${ref}'`); } else { const commit = resolveCommit(spec); out.push(commit ? `${commit.id} ${commit.message}` : `fatal: bad object ${spec}`); } }
    else if (sub === 'rev-parse' && args[1] === 'HEAD') out.push(head()?.id ?? 'HEAD');
    else if (sub === 'clone') { const source = args[1]; const folder = args[2] ?? source?.replace(/\.git$/, '').split('/').pop() ?? 'sample-app'; const target = normalize(folder, this.state.cwd); const id = `0000001${this.id.slice(-1)}`; this.state.directories.add(target); this.state.files[`${target}/README.md`] = '# Cloned training repository\n'; this.state.cwd = target; this.state.repo = target; this.state.tracked = new Set([`${target}/README.md`]); this.state.staged.clear(); this.state.index = {}; this.state.commits = [{ id, message: 'Initial project', files: { [`${target}/README.md`]: '# Cloned training repository\n' } }]; this.state.branch = 'main'; this.state.branches = new Set(['main']); this.state.branchTips = { main: id }; this.state.remotes = { origin: source ?? '/training/sample-app.git' }; this.state.reflog = [`0000001 clone: from ${source}`]; out.push(`Cloning into '${folder}'...\ndone.`); }
    else if (sub === 'config') out.push(args.includes('--get') || args.includes('--list') ? 'user.name=Code Practice Learner\nuser.email=learner@example.test' : 'Configuration saved in the training workspace.');
    else if (sub === 'remote') {
      const action = args[1];
      if (!action || action === '-v') out.push(Object.entries(this.state.remotes).flatMap(([name, url]) => [`${name}\t${url} (fetch)`, `${name}\t${url} (push)`]).join('\n'));
      else if (action === 'add' && args[2] && args[3]) { this.state.remotes[args[2]] = args[3]; out.push(`Added remote ${args[2]}.`); }
      else if (action === 'set-url' && args[2] && args[3]) { this.state.remotes[args[2]] = args[3]; out.push(`Updated ${args[2]}.`); }
      else if (action === 'remove' && args[2]) { delete this.state.remotes[args[2]]; out.push(`Removed remote ${args[2]}.`); }
      else if (action === 'rename' && args[2] && args[3] && this.state.remotes[args[2]]) { this.state.remotes[args[3]] = this.state.remotes[args[2]]; delete this.state.remotes[args[2]]; out.push(`Renamed remote ${args[2]} to ${args[3]}.`); }
      else fail('usage: git remote [-v] | add | set-url | remove | rename');
    }
    else if (sub === 'fetch') { const remote = args.find((arg, index) => index > 0 && !arg.startsWith('-')) ?? 'origin'; if (!this.state.remotes[remote]) return fail(`fatal: '${remote}' does not appear to be a git repository`); const remoteBranch = `${remote}/main`; this.state.branches.add(remoteBranch); this.state.branchTips[remoteBranch] = head()?.id ?? ''; out.push(`From ${this.state.remotes[remote]}\n * [updated] main -> ${remoteBranch}`); }
    else if (sub === 'pull') { out.push('Already up to date.'); }
    else if (sub === 'push') { const remote = args.find((arg, index) => index > 0 && !arg.startsWith('-')) ?? 'origin'; if (!this.state.remotes[remote]) return fail(`fatal: '${remote}' does not appear to be a git repository`); const branch = [...args].reverse().find(arg => !arg.startsWith('-') && arg !== remote) ?? this.state.branch; out.push(`To ${this.state.remotes[remote]}\n * [new branch] ${branch} -> ${branch}${args.includes('-u') || args.includes('--set-upstream') ? `\nbranch '${branch}' set up to track '${remote}/${branch}'.` : ''}`); }
    else if (sub === 'merge') { if (args.includes('--abort')) { this.state.staged.clear(); this.state.index = {}; out.push('Merge aborted.'); } else { const target = args.find((arg, index) => index > 0 && !arg.startsWith('-')); if (!target) return fail('fatal: No remote for the current branch.'); const source = resolveCommit(target); if (!source) return fail(`merge: ${target} - not something we can merge`); if (args.includes('--ff-only')) { if (this.state.branches.has(this.state.branch)) this.state.branchTips[this.state.branch] = source.id; for (const path of [...this.state.tracked]) delete this.state.files[path]; Object.assign(this.state.files, source.files); this.state.tracked = new Set(Object.keys(source.files)); out.push(`Updating to ${target}\nFast-forward`); } else { const committed = head()?.files ?? {}; for (const path of new Set([...Object.keys(committed), ...Object.keys(source.files)])) if (committed[path] !== source.files[path]) { if (source.files[path] === undefined) delete this.state.files[path]; else this.state.files[path] = source.files[path]; this.state.staged.add(path); this.state.index[path] = source.files[path] ?? null; } const commit = recordCommit(`Merge ${target}`); out.push(`Merge made by the 'ort' strategy.\n ${commit.id.slice(0, 7)} Merge ${target}`); } } }
    else if (sub === 'rebase') { if (args.includes('--abort')) out.push('Rebase aborted.'); else if (args.includes('--continue')) out.push('Successfully rebased and updated current branch.'); else { const target = args.find((arg, index) => index > 0 && !arg.startsWith('-')) ?? 'main'; const current = head(); if (current) { current.id = `${current.id.slice(0, 6)}r${this.id.slice(-1)}`; this.state.reflog.unshift(`${current.id.slice(0, 7)} rebase: ${target}`); } out.push(`Successfully rebased and updated refs/heads/${this.state.branch}.`); } }
    else if (sub === 'cherry-pick') { if (args.includes('--abort')) out.push('Cherry-pick aborted.'); else if (args.includes('--continue')) { const commit = recordCommit('Continue cherry-pick'); out.push(`[${this.state.branch} ${commit.id.slice(0, 7)}] ${commit.message}`); } else { const source = resolveCommit(args[1]); if (!source) return fail(`fatal: bad revision '${args[1]}'`); const committed = head()?.files ?? {}; for (const path of new Set([...Object.keys(committed), ...Object.keys(source.files)])) if (committed[path] !== source.files[path]) { if (source.files[path] === undefined) delete this.state.files[path]; else this.state.files[path] = source.files[path]; this.state.staged.add(path); this.state.index[path] = source.files[path] ?? null; } const commit = recordCommit(source.message); out.push(`[${this.state.branch} ${commit.id.slice(0, 7)}] ${commit.message}`); } }
    else if (sub === 'revert') { const source = resolveCommit(args.find((arg, index) => index > 0 && !arg.startsWith('-'))); if (!source) return fail('fatal: bad revision'); const previous = this.state.commits[this.state.commits.indexOf(source) - 1]; if (previous) { for (const path of new Set([...Object.keys(source.files), ...Object.keys(previous.files)])) if (source.files[path] !== previous.files[path]) { if (previous.files[path] === undefined) delete this.state.files[path]; else this.state.files[path] = previous.files[path]; this.state.staged.add(path); this.state.index[path] = previous.files[path] ?? null; } } const commit = recordCommit(`Revert "${source.message}"`); out.push(`[${this.state.branch} ${commit.id.slice(0, 7)}] Revert "${source.message}"`); }
    else if (sub === 'stash') {
      const action = args[1];
      if (action === 'list') out.push(this.state.stashes.map((stash, index) => `stash@{${index}}: WIP on ${stash.branch}`).join('\n'));
      else if (action === 'pop' || action === 'apply') { const stash = this.state.stashes[0]; if (!stash) return fail('No stash entries found.'); Object.assign(this.state.files, stash.files); this.state.staged = new Set(stash.staged); this.state.index = { ...stash.index }; if (action === 'pop') this.state.stashes.shift(); out.push(`Applied stash on ${this.state.branch}.`); }
      else if (action === 'drop') { if (!this.state.stashes.length) return fail('No stash entries found.'); this.state.stashes.shift(); out.push('Dropped stash@{0}.'); }
      else if (action === 'clear') { this.state.stashes = []; out.push('Cleared all stash entries.'); }
      else { this.state.stashes.unshift({ files: { ...this.state.files }, staged: [...this.state.staged], index: { ...this.state.index }, branch: this.state.branch }); const committed = head()?.files ?? {}; if (args.includes('-u') || args.includes('--include-untracked')) for (const path of Object.keys(this.state.files)) if (path.startsWith(`${this.state.repo}/`) && !this.state.tracked.has(path)) delete this.state.files[path]; for (const path of [...this.state.tracked]) delete this.state.files[path]; Object.assign(this.state.files, committed); this.state.staged.clear(); this.state.index = {}; out.push(`Saved working directory and index state WIP on ${this.state.branch}`); }
    }
    else if (sub === 'tag') { const tag = args.find((arg, index) => index > 0 && !arg.startsWith('-') && args[index - 1] !== '-m'); if (tag) { this.state.tags.add(tag); out.push(`Created tag ${tag}`); } else out.push([...this.state.tags].join('\n')); }
    else if (sub === 'reflog') out.push(this.state.reflog.slice(0, Number(args.find(arg => /^-\d+$/.test(arg))?.slice(1) ?? this.state.reflog.length)).map((entry, index) => `${entry.split(' ')[0]} HEAD@{${index}}: ${entry.split(' ').slice(1).join(' ')}`).join('\n'));
    else fail(`git: '${sub}' is not available in this browser workspace yet`);
  }
}
