import type { CommandRecord, Commit, Fixture, Platform, WorkspaceSnapshot, WorkspaceView } from './types';
import { basename, ignoredPath, normalizePath, parentPath, parseShell, within } from './shell';
import { applyHunks, diffText, hunks, mergeText, type Hunk } from './diff';

type Tree = Record<string, string>;
type Stash = { files: Record<string, string | null>; index: Record<string, string | null>; base: Tree; branch: string; message: string };
type PendingOperation = { kind: 'merge' | 'rebase' | 'cherry-pick' | 'revert'; original: string; source: string; message: string; remaining?: string[] };
type Patch = { path: string; before: string; after?: string; hunks: Hunk[]; selected: Hunk[]; position: number };
type State = {
  version: number; cwd: string; previousCwd?: string; files: Tree; directories: string[]; repo?: string;
  index: Record<string, string | null>; commits: Commit[]; branch: string; branches: string[];
  branchTips: Record<string, string>; remotes: Record<string, string>; remoteTips: Record<string, string>;
  tagTips: Record<string, string>; upstreams: Record<string, string>; config: Record<string, string>;
  stashes: Stash[]; reflog: string[]; conflicts: string[]; operation?: PendingOperation;
  patches?: Patch[]; rebaseTodo?: { path: string; base: string; original: string; commits: string[] };
  output: string; exitCode: number; saved: boolean; fixture: boolean; records: CommandRecord[];
};
const root = '/workspace';
const keys = (...trees: (Record<string, unknown> | undefined)[]) => [...new Set(trees.flatMap(tree => Object.keys(tree ?? {})))];
const display = (path: string, platform: Platform) => platform === 'windows' ? `${path.startsWith('/') ? 'C:' : ''}${path.replace(/\//g, '\\')}` : path;
const same = (a: Tree, b: Tree) => keys(a, b).every(path => a[path] === b[path]);
const error = (message: string): never => { throw new Error(message); };

function ensureDirectories(state: State) {
  const paths = new Set(state.directories);
  for (const entry of [state.cwd, state.repo, ...state.directories, ...Object.keys(state.files).map(parentPath)]) {
    if (!entry) continue;
    let path = entry;
    while (true) { paths.add(path); if (path === '/') break; path = parentPath(path); }
  }
  state.directories = [...paths];
}
function stateFor(id: string, fixture: Fixture, prepared: boolean): State {
  const absolute = (tree: Tree = {}, cwd = fixture.repo ?? fixture.cwd) => Object.fromEntries(Object.entries(tree).map(([path, text]) => [normalizePath(path, cwd), text]));
  const commits: Commit[] = [];
  for (const [index, item] of (fixture.commits ?? []).entries()) commits.push({ ...item, id: item.id ?? (index + 1).toString(16).padStart(7, '0'), parents: item.parents ?? (index ? [commits[index - 1].id] : []), files: absolute(item.files) });
  const setup = fixture.setup?.find(args => ['checkout', 'switch'].includes(args[0]));
  const branch = fixture.branch ?? setup?.[2] ?? 'main';
  const branches = fixture.branches ?? [...new Set(['main', branch])];
  const branchTips = fixture.branchTips ?? Object.fromEntries([...new Set([...branches, branch])].map(name => [name, commits[commits.length - 1]?.id ?? '']));
  const head = commits.find(commit => commit.id === branchTips[branch]);
  const files = { ...absolute(fixture.files, fixture.cwd), ...(head?.files ?? {}), ...absolute(fixture.staged), ...absolute(fixture.working) };
  const state: State = { version: 2, cwd: normalizePath(fixture.cwd, '/'), repo: fixture.repo, files, directories: [root, ...(fixture.directories ?? []).map(path => normalizePath(path, fixture.cwd))], index: absolute(fixture.staged), commits, branch, branches, branchTips: { ...branchTips }, remotes: { ...(fixture.remotes ?? (fixture.repo ? { origin: '/training/sample-app.git' } : {})) }, remoteTips: { ...(fixture.remoteTips ?? { 'origin/main': branchTips.main ?? head?.id ?? '' }) }, tagTips: Object.fromEntries((fixture.tags ?? []).map(tag => [tag, head?.id ?? ''])), upstreams: {}, config: {}, stashes: [], reflog: fixture.reflog ?? [...commits].reverse().map(commit => `${commit.id} commit: ${commit.message}`), conflicts: (fixture.merge?.conflicts ?? []).map(path => normalizePath(path, fixture.repo ?? fixture.cwd)), output: fixture.note ?? `Ready for ${id.toUpperCase()}. Type help for supported commands.`, exitCode: 0, saved: false, fixture: prepared, records: [] };
  if (fixture.merge) state.operation = { kind: 'merge', original: head?.id ?? '', source: fixture.merge.source, message: 'Merge prepared branch' };
  for (const path of Object.keys(state.index)) if (state.index[path] === head?.files[path]) delete state.index[path];
  ensureDirectories(state);
  return state;
}

export function initialSnapshotFor(id: string, fixture: Fixture, prepared: boolean): WorkspaceSnapshot {
  return new Workspace(id, fixture, prepared, false).snapshot();
}

export class Workspace {
  private state: State;
  readonly id: string;
  constructor(id: string, fixture: Fixture, prepared: boolean, loadSaved = true) {
    this.id = id; this.state = stateFor(id, fixture, prepared);
    if (loadSaved) try {
      const raw = localStorage.getItem(`code-practice-workspace:${id}`);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.version === 2 && typeof saved.cwd === 'string' && saved.files && Array.isArray(saved.commits) && Array.isArray(saved.records)) {
          this.state = { ...this.state, ...saved, saved: true }; ensureDirectories(this.state);
        } else if (saved.files && saved.cwd) {
          // Keep a recoverable copy of old, inconsistent simulator state before starting the corrected fixture.
          localStorage.setItem(`code-practice-workspace-backup:${id}`, raw);
          this.state.output += '\nThis lesson has an updated starting state. Your previous workspace is backed up locally.';
        }
      }
    } catch { /* Missing, corrupt, or blocked storage must not prevent practice. */ }
  }
  private persist() {
    try { localStorage.setItem(`code-practice-workspace:${this.id}`, JSON.stringify(this.state)); this.state.saved = true; }
    catch { this.state.saved = false; }
  }
  private head() { return this.state.commits.find(commit => commit.id === this.state.branchTips[this.state.branch]); }
  private committed() { return this.head()?.files ?? {}; }
  private parentFiles(commit: Commit) { return commit.parents[0] ? this.requireCommit(commit.parents[0]).files : {}; }
  private indexTree(): Tree {
    const tree = { ...this.committed() };
    for (const [path, text] of Object.entries(this.state.index)) { if (text === null) delete tree[path]; else tree[path] = text; }
    return tree;
  }
  private stage(path: string, text: string | undefined) {
    if (this.committed()[path] === text) delete this.state.index[path]; else this.state.index[path] = text ?? null;
  }
  private setFile(path: string, text: string | undefined) { if (text === undefined) delete this.state.files[path]; else this.state.files[path] = text; }
  private ignored(path: string) { return ignoredPath(path, this.state.repo, this.state.files); }
  private dirty() { const tree = this.indexTree(); return !!Object.keys(this.state.index).length || Object.keys(tree).some(path => tree[path] !== this.state.files[path]); }
  private relative(path: string) { return path.slice((this.state.repo ?? this.state.cwd).length + 1); }
  private resolve(ref = 'HEAD'): Commit | undefined {
    const reflog = ref.match(/^HEAD@\{(\d+)\}$/);
    if (reflog) return this.resolve(this.state.reflog[Number(reflog[1])]?.split(' ')[0] ?? 'invalid');
    const ancestor = ref.match(/^(.*?)([~^])(\d*)$/);
    if (ancestor) {
      let commit = this.resolve(ancestor[1]);
      const n = Number(ancestor[3] || 1);
      if (ancestor[2] === '^') return n === 0 ? commit : this.state.commits.find(item => item.id === commit?.parents[n - 1]);
      for (let i = 0; i < n; i++) commit = this.state.commits.find(item => item.id === commit?.parents[0]);
      return commit;
    }
    const id = ref === 'HEAD' ? this.state.branchTips[this.state.branch] : this.state.branchTips[ref] ?? this.state.tagTips[ref];
    if (id !== undefined) return this.state.commits.find(commit => commit.id === id);
    const matches = this.state.commits.filter(commit => commit.id.startsWith(ref));
    return matches.length === 1 ? matches[0] : undefined;
  }
  private requireCommit(ref = 'HEAD') { return this.resolve(ref) ?? error(`fatal: unknown or ambiguous revision '${ref}'`); }
  private ancestors(id: string): Set<string> {
    const visited = new Set<string>(), queue = [id];
    while (queue.length) { const next = queue.pop()!; if (visited.has(next)) continue; visited.add(next); queue.push(...(this.state.commits.find(commit => commit.id === next)?.parents ?? [])); }
    return visited;
  }
  private moveHead(id: string, message: string) { this.state.branchTips[this.state.branch] = id; this.state.reflog.unshift(`${id} ${message}`); }
  private checkoutTree(tree: Tree, force = false) {
    const old = this.committed(), index = this.indexTree();
    if (!force) for (const path of keys(old, tree)) {
      if (old[path] !== tree[path] && (this.state.files[path] !== old[path] || index[path] !== old[path])) error(`error: local changes to '${this.relative(path)}' would be overwritten. Commit or stash them first.`);
    }
    for (const path of keys(old, index, tree)) if (force || old[path] !== tree[path]) this.setFile(path, tree[path]);
    if (force) this.state.index = {};
    ensureDirectories(this.state);
  }
  private commit(message: string, amend = false, extraParents: string[] = []) {
    if (this.state.conflicts.length) error('error: resolve each conflict and git add the resolved files before committing');
    const previous = this.head();
    const files = this.indexTree();
    if (!amend && !extraParents.length && same(files, previous?.files ?? {})) error('nothing to commit, working tree clean');
    if (amend && !previous) error('fatal: You have nothing to amend.');
    let number = this.state.commits.length + 1;
    while (this.state.commits.some(item => item.id === number.toString(16).padStart(7, '0'))) number++;
    const commit: Commit = { id: number.toString(16).padStart(7, '0'), message, files, parents: amend ? previous!.parents : [...(previous ? [previous.id] : []), ...extraParents] };
    this.state.commits.push(commit); this.moveHead(commit.id, `commit${amend ? ' (amend)' : ''}: ${message}`); this.state.index = {};
    return `[${this.state.branch} ${commit.id}] ${message}`;
  }
  private applyTree(base: Tree, incoming: Tree) {
    const ours = this.committed(); this.state.conflicts = [];
    for (const path of keys(base, incoming)) if (base[path] !== incoming[path] && this.state.files[path] !== ours[path]) error(`Local changes to '${this.relative(path)}' would be overwritten. Commit or stash them first.`);
    for (const path of keys(base, incoming)) {
      if (base[path] === incoming[path]) continue;
      const merged = mergeText(base[path], ours[path], incoming[path]);
      this.setFile(path, merged.text);
      if (merged.conflict) this.state.conflicts.push(path); else this.stage(path, merged.text);
    }
    ensureDirectories(this.state);
  }
  private finishOperation() {
    const operation = this.state.operation ?? error('error: no operation is in progress');
    if (this.state.conflicts.length) error('error: resolve the conflicts, git add the files, then continue');
    const output = this.commit(operation.message, false, operation.kind === 'merge' ? [operation.source] : []);
    this.state.operation = undefined;
    if (operation.kind === 'rebase' && operation.remaining?.length) return `${output}\n${this.replay(operation.remaining, operation.original)}`;
    return output;
  }
  private replay(ids: string[], original: string): string {
    const output: string[] = [];
    for (let i = 0; i < ids.length; i++) {
      const commit = this.requireCommit(ids[i]);
      this.state.operation = { kind: 'rebase', original, source: commit.id, message: commit.message, remaining: ids.slice(i + 1) };
      this.applyTree(this.parentFiles(commit), commit.files);
      if (this.state.conflicts.length) error('CONFLICT: resolve files in the editor, git add them, then git rebase --continue (or --abort).');
      if (Object.keys(this.state.index).length) output.push(this.commit(commit.message));
      this.state.operation = undefined;
    }
    return `${output.join('\n')}\nSuccessfully rebased ${this.state.branch}.`;
  }
  private selectedPaths(operands: string[], candidates: string[]) {
    const selected = new Set<string>();
    for (const operand of operands) {
      const target = normalizePath(operand, this.state.cwd);
      if (this.state.repo && !within(target, this.state.repo)) error(`fatal: '${operand}' is outside the repository`);
      const matches = candidates.filter(path => within(path, target));
      if (!matches.length && !this.state.directories.includes(target)) error(`fatal: pathspec '${operand}' did not match any files`);
      matches.forEach(path => selected.add(path));
    }
    return [...selected];
  }
  view(platform: Platform): WorkspaceView {
    const prefix = this.state.cwd === '/' ? '/' : `${this.state.cwd}/`;
    return { cwd: display(this.state.cwd, platform), files: Object.keys(this.state.files).filter(path => path.startsWith(prefix) && !path.includes('/.git/')).sort().map(path => ({ path: display(path.slice(prefix.length), platform), absolutePath: path, directory: false })), saved: this.state.saved, output: this.state.output, exitCode: this.state.exitCode, fixture: this.state.fixture, branch: this.state.branch, pending: this.state.patches?.length ? 'Stage this change? y / n / a / d / q' : this.state.rebaseTodo ? 'Edit .git/rebase-todo in the editor, then git rebase --continue' : undefined };
  }
  editorFiles() { return this.state.rebaseTodo ? [{ path: '.git/rebase-todo', absolutePath: this.state.rebaseTodo.path, directory: false }] : []; }
  file(path: string) { return this.state.files[normalizePath(path, this.state.cwd)] ?? ''; }
  hasFile(path: string) { return normalizePath(path, this.state.cwd) in this.state.files; }
  commandRecords() { return this.state.records.map(record => ({ ...record })); }
  snapshot(): WorkspaceSnapshot {
    return { cwd: this.state.cwd, files: { ...this.state.files }, directories: [...this.state.directories], repo: this.state.repo, tracked: Object.keys(this.indexTree()), staged: Object.keys(this.state.index), index: { ...this.state.index }, commits: this.state.commits.map(commit => ({ ...commit, parents: [...commit.parents], files: { ...commit.files } })), head: this.head()?.id ?? '', branch: this.state.branch, branches: [...this.state.branches], branchTips: { ...this.state.branchTips }, remoteTips: { ...this.state.remoteTips }, remotes: { ...this.state.remotes }, tags: Object.keys(this.state.tagTips), stashCount: this.state.stashes.length, conflicts: [...this.state.conflicts] };
  }
  saveFile(path: string, content: string) { this.state.files[normalizePath(path, this.state.cwd)] = content; ensureDirectories(this.state); this.persist(); }
  reset(fixture: Fixture, prepared: boolean) { this.state = stateFor(this.id, fixture, prepared); this.persist(); }
  cancel() { this.state.patches = undefined; this.state.output = '^C'; this.state.exitCode = 130; this.persist(); return this.state.output; }
  run(raw: string, platform: Platform): WorkspaceView {
    if (!raw.trim()) return this.view(platform);
    this.state.exitCode = 0;
    const output: string[] = [];
    try {
      if (this.state.patches?.length) { this.state.output = this.answerPatch(raw.trim()); this.persist(); return this.view(platform); }
      const commands = parseShell(raw);
      for (const command of commands) {
        if (command.condition === '&&' && this.state.exitCode !== 0 || command.condition === '||' && this.state.exitCode === 0) continue;
        const cwd = this.state.cwd;
        this.state.exitCode = 0;
        let text = '';
        try {
          let target: string | undefined;
          if (command.redirect) {
            target = normalizePath(command.redirect.path, cwd);
            if (!this.state.directories.includes(parentPath(target)) || this.state.directories.includes(target)) error(`cannot write '${command.redirect.path}': missing parent folder or path is a directory`);
            if (!command.redirect.append) this.state.files[target] = '';
          }
          text = this.execute(command.args, platform);
          if (target) { this.state.files[target] = (command.redirect!.append ? this.state.files[target] ?? '' : '') + text; text = ''; }
        } catch (caught) { this.state.exitCode = 1; text = caught instanceof Error ? caught.message : 'Command failed.'; }
        if (text) output.push(text.replace(/\n$/, ''));
        this.state.records.push({ command: command.raw, cwd: display(cwd, platform), failed: this.state.exitCode !== 0, output: text.replace(/\n$/, '') });
        if (this.state.patches?.length || this.state.rebaseTodo) break;
      }
    } catch (caught) { this.state.exitCode = 2; output.push(caught instanceof Error ? caught.message : 'Invalid command.'); this.state.records.push({ command: raw, cwd: display(this.state.cwd, platform), failed: true, output: output[output.length - 1] }); }
    this.state.output = output.join('\n'); this.persist(); return this.view(platform);
  }
  private execute(parts: string[], platform: Platform): string {
    const [name, ...args] = parts;
    const aliases: Record<string, string> = { dir: 'ls', type: 'cat', cls: 'clear', md: 'mkdir', rd: 'rmdir', copy: 'cp', ren: 'mv', del: 'rm' };
    const cmd = platform === 'windows' ? aliases[name.toLowerCase()] ?? name : name;
    const operands = args.filter(arg => !arg.startsWith('-'));
    const pathOf = (path: string) => normalizePath(path, this.state.cwd);
    const exists = (path: string) => path in this.state.files || this.state.directories.includes(path);
    const requireOperands = (count = 1) => { if (operands.length < count) error(`${cmd}: missing operand${count > 1 ? ' (source and destination required)' : ''}`); };
    if (cmd === 'help') return 'Browser practice terminal\nShell: pwd, ls, cd, mkdir, touch, echo, cat, cp, mv, rm, rmdir, clear\nGit: init, config, status, add (including -p), commit, diff, log, show, restore, reset, switch, checkout, branch, merge, rebase, revert, cherry-pick, stash, reflog, remote, fetch, pull, push, tag\nQuotes, >, >>, &&, ||, semicolons and pasted lines are supported.\nGit remotes are local training data. This terminal does not run programs, npm tests, or contact GitHub.\n';
    if (cmd === 'pwd') return `${display(this.state.cwd, platform)}\n`;
    if (cmd === 'clear') return '';
    if (cmd === 'cd') {
      if (args.length > 1) error('cd: too many arguments');
      const target = args[0] === '-' ? this.state.previousCwd ?? error('cd: no previous directory') : pathOf(args[0] === '~' || !args.length ? root : args[0]);
      if (!this.state.directories.includes(target)) error(`cd: no such directory: ${args[0]}`);
      this.state.previousCwd = this.state.cwd; this.state.cwd = target; return '';
    }
    if (cmd === 'ls') {
      const showHidden = args.some(arg => /^-[a-zA-Z]*[aA]/.test(arg));
      return (operands.length ? operands : ['.']).map(operand => {
        const target = pathOf(operand);
        if (!exists(target)) error(`ls: ${operand}: No such file or directory`);
        if (target in this.state.files) return operand;
        const names = new Set([...Object.keys(this.state.files), ...this.state.directories].filter(path => path !== target && parentPath(path) === target).map(basename));
        if (showHidden && this.state.repo === target) names.add('.git');
        return [...names].filter(name => showHidden || !name.startsWith('.')).sort().join('  ');
      }).join('\n') + '\n';
    }
    if (cmd === 'echo') return `${(args[0] === '-n' ? args.slice(1) : args).join(' ')}${args[0] === '-n' ? '' : '\n'}`;
    if (cmd === 'cat') { requireOperands(); return operands.map(operand => this.state.files[pathOf(operand)] ?? error(`cat: ${operand}: No such file`)).join(''); }
    if (cmd === 'mkdir') {
      requireOperands();
      for (const operand of operands) {
        const target = pathOf(operand), parents = args.includes('-p');
        if (target in this.state.files || !parents && exists(target)) error(`mkdir: ${operand}: File exists`);
        if (!parents && !this.state.directories.includes(parentPath(target))) error(`mkdir: ${operand}: No such parent directory (use mkdir -p)`);
        let ancestor = parentPath(target);
        while (ancestor !== '/') { if (ancestor in this.state.files) error(`mkdir: ${operand}: Not a directory`); ancestor = parentPath(ancestor); }
        this.state.directories.push(target); ensureDirectories(this.state);
      }
      return '';
    }
    if (cmd === 'touch') {
      requireOperands();
      for (const operand of operands) { const target = pathOf(operand); if (!this.state.directories.includes(parentPath(target))) error(`touch: ${operand}: No such parent directory`); if (!this.state.directories.includes(target)) this.state.files[target] ??= ''; }
      return '';
    }
    if (cmd === 'rm' || cmd === 'rmdir') {
      requireOperands();
      const recursive = args.some(arg => /^-[a-zA-Z]*[rR]/.test(arg)), force = args.some(arg => /^-[a-zA-Z]*f/.test(arg));
      for (const operand of operands) {
        const target = pathOf(operand), directory = this.state.directories.includes(target);
        if (!exists(target)) { if (force && cmd === 'rm') continue; error(`${cmd}: ${operand}: No such file or directory`); }
        if (target === '/' || within(this.state.cwd, target) || this.state.repo && within(this.state.repo, target)) error(`${cmd}: cannot remove the current folder or repository root in practice`);
        if (cmd === 'rmdir' && !directory) error(`rmdir: ${operand}: Not a directory`);
        if (directory && cmd === 'rm' && !recursive) error(`rm: ${operand}: Is a directory (use -r)`);
        if (cmd === 'rmdir' && [...Object.keys(this.state.files), ...this.state.directories].some(path => path !== target && within(path, target))) error(`rmdir: ${operand}: Directory not empty`);
        for (const path of Object.keys(this.state.files)) if (within(path, target)) delete this.state.files[path];
        this.state.directories = this.state.directories.filter(path => !within(path, target));
      }
      return '';
    }
    if (cmd === 'cp' || cmd === 'mv') {
      requireOperands(2);
      const destination = pathOf(operands[operands.length - 1]);
      if (operands.length > 2 && !this.state.directories.includes(destination)) error(`${cmd}: destination must be a directory`);
      for (const operand of operands.slice(0, -1)) {
        const source = pathOf(operand), directory = this.state.directories.includes(source);
        const target = this.state.directories.includes(destination) ? `${destination}/${basename(source)}` : destination;
        if (!exists(source)) error(`${cmd}: ${operand}: No such file or directory`);
        if (source === target || directory && within(target, source)) error(`${cmd}: source and destination overlap`);
        if (!this.state.directories.includes(parentPath(target))) error(`${cmd}: destination parent does not exist`);
        if (directory && cmd === 'cp' && !args.some(arg => /^-[a-zA-Z]*[rR]/.test(arg))) error(`cp: ${operand}: Is a directory (use -r)`);
        if (directory && target in this.state.files || !directory && this.state.directories.includes(target)) error(`${cmd}: file and directory types do not match`);
        if (cmd === 'mv' && directory && (within(this.state.cwd, source) || this.state.repo && within(this.state.repo, source))) error('mv: moving the current folder or repository root is not supported in practice');
        for (const [path, text] of Object.entries(this.state.files)) if (within(path, source)) { this.state.files[target + path.slice(source.length)] = text; if (cmd === 'mv') delete this.state.files[path]; }
        for (const path of [...this.state.directories]) if (within(path, source)) this.state.directories.push(target + path.slice(source.length));
        if (cmd === 'mv') this.state.directories = this.state.directories.filter(path => !within(path, source));
        ensureDirectories(this.state);
      }
      return '';
    }
    if (cmd === 'git') return this.git(args);
    if (cmd === 'npm' || cmd === 'gh') return error(`${cmd} requires a real runtime${cmd === 'gh' ? ' and GitHub authentication' : ''}. This browser terminal cannot execute it. For GitHub exercises, record the external result and reasoning in RESPONSE.md.`);
    return error(`${name}: command not found. Type help for supported practice commands.`);
  }

  private patchPrompt() {
    const patch = this.state.patches?.[0];
    if (!patch) return 'Patch selection finished.';
    const hunk = patch.hunks[patch.position];
    return `${this.relative(patch.path)} (${patch.position + 1}/${patch.hunks.length})\n${hunk.remove.map(line => `-${line}`).join('')}${hunk.insert.map(line => `+${line}`).join('')}\nStage this change [y,n,a,d,q]? (Changes are already split into individual hunks.)`;
  }
  private answerPatch(answer: string) {
    const patch = this.state.patches![0];
    if (!['y', 'n', 'a', 'd', 'q', 's', '?'].includes(answer)) return 'Enter y to stage, n to skip, a to stage the rest, d to skip the rest, or q to quit.';
    if (answer === '?' || answer === 's') return this.patchPrompt();
    if (answer === 'y') patch.selected.push(patch.hunks[patch.position]);
    if (answer === 'a') patch.selected.push(...patch.hunks.slice(patch.position));
    if (patch.selected.length) this.stage(patch.path, patch.after === undefined && patch.selected.length === patch.hunks.length ? undefined : applyHunks(patch.before, patch.selected));
    patch.position++;
    if (answer === 'q') this.state.patches = undefined;
    else if (['a', 'd'].includes(answer) || patch.position === patch.hunks.length) this.state.patches!.shift();
    return this.patchPrompt();
  }

  private git(args: string[]): string {
    const [sub, ...rest] = args;
    if (sub === '--version') return 'git practice simulator (browser)\n';
    if (sub === 'help' || sub === '--help' || !sub) return this.execute(['help'], 'linux');
    if (!['init', 'clone', 'config'].includes(sub) && (!this.state.repo || !within(this.state.cwd, this.state.repo))) error('fatal: not a git repository (or any of the parent directories): .git');
    const operands = rest.filter(arg => !arg.startsWith('-'));
    const tracked = this.indexTree();
    const current = this.committed();
    const repoFiles = () => Object.keys(this.state.files).filter(path => within(path, this.state.repo!) && !path.includes('/.git/'));
    const available = () => [...new Set([...repoFiles(), ...keys(current, tracked)])];
    const messageFlag = rest.indexOf('-m');
    const message = messageFlag >= 0 ? rest[messageFlag + 1] : undefined;

    if (sub === 'init') {
      if (this.state.repo === this.state.cwd) return `Reinitialized existing Git repository in ${this.state.cwd}/.git/\n`;
      if (this.state.repo) error('This practice workspace supports one repository. Reset the exercise before initializing another.');
      const flag = rest.findIndex(arg => arg === '-b' || arg === '--initial-branch');
      const branch = flag >= 0 ? rest[flag + 1] ?? error('git init: a branch name is required') : 'main';
      this.state.repo = this.state.cwd; this.state.branch = branch; this.state.branches = [branch]; this.state.branchTips = { [branch]: '' }; this.state.remotes = {}; this.state.remoteTips = {}; return `Initialized empty Git repository in ${this.state.cwd}/.git/\n`;
    }
    if (sub === 'config') {
      const values = rest.filter(arg => !arg.startsWith('-'));
      if (rest.includes('--list') || rest.includes('-l')) return Object.entries(this.state.config).map(([key, value]) => `${key}=${value}`).join('\n');
      if (values.length === 2) { this.state.config[values[0]] = values[1]; return ''; }
      if (values.length === 1) return this.state.config[values[0]] ?? error(`No value configured for ${values[0]}`);
      return error('usage: git config [--global] <key> [value]');
    }
    if (sub === 'status') {
      const statuses = available().map(path => {
        if (this.state.conflicts.includes(path)) return { path, xy: 'UU' };
        if (!(path in tracked) && !(path in current)) return { path, xy: this.ignored(path) ? '!!' : '??' };
        const x = current[path] === tracked[path] ? ' ' : current[path] === undefined ? 'A' : tracked[path] === undefined ? 'D' : 'M';
        const y = tracked[path] === this.state.files[path] ? ' ' : tracked[path] === undefined ? '?' : this.state.files[path] === undefined ? 'D' : 'M';
        return { path, xy: x + y };
      }).filter(item => item.xy !== '  ' && (item.xy !== '!!' || rest.includes('--ignored')));
      if (rest.includes('-s') || rest.includes('--short') || rest.includes('--porcelain')) return statuses.map(({ path, xy }) => `${xy} ${this.relative(path)}`).join('\n');
      const groups = [this.state.branches.includes(this.state.branch) ? `On branch ${this.state.branch}` : `HEAD detached at ${this.head()?.id ?? ''}`];
      if (this.state.operation) groups.push(`${this.state.operation.kind} in progress.`);
      const staged = statuses.filter(item => /[AMD]/.test(item.xy[0]));
      const changed = statuses.filter(item => /[MD]/.test(item.xy[1]));
      const untracked = statuses.filter(item => item.xy === '??');
      if (staged.length) groups.push('Changes to be committed:\n' + staged.map(item => `  ${item.xy[0] === 'A' ? 'new file' : item.xy[0] === 'D' ? 'deleted' : 'modified'}: ${this.relative(item.path)}`).join('\n'));
      if (changed.length) groups.push('Changes not staged for commit:\n' + changed.map(item => `  ${item.xy[1] === 'D' ? 'deleted' : 'modified'}: ${this.relative(item.path)}`).join('\n'));
      if (untracked.length) groups.push('Untracked files:\n' + untracked.map(item => `  ${this.relative(item.path)}`).join('\n'));
      if (this.state.conflicts.length) groups.push('Unmerged paths:\n' + this.state.conflicts.map(path => `  both modified: ${this.relative(path)}`).join('\n'));
      if (rest.includes('--ignored')) groups.push(...statuses.filter(item => item.xy === '!!').map(item => `Ignored: ${this.relative(item.path)}`));
      if (!statuses.some(item => item.xy !== '!!')) groups.push('nothing to commit, working tree clean');
      return groups.join('\n');
    }
    if (sub === 'add') {
      const all = rest.includes('-A') || rest.includes('--all'), update = rest.includes('-u') || rest.includes('--update'), patch = rest.includes('-p') || rest.includes('--patch');
      if (!operands.length && !all && !update && !patch) return 'Nothing specified, nothing added.\n';
      const candidates = update ? Object.keys(tracked) : available();
      const paths = this.selectedPaths(operands.length ? operands : [all || update ? this.state.repo! : '.'], candidates);
      const eligible = paths.filter(path => path in tracked || path in current || rest.includes('-f') || !this.ignored(path));
      if (operands.some(operand => this.ignored(normalizePath(operand, this.state.cwd)) && !(normalizePath(operand, this.state.cwd) in tracked)) && !rest.includes('-f')) error('The requested file is ignored. Use -f only if you intend to track it.');
      if (patch) {
        this.state.patches = eligible.filter(path => path in tracked && tracked[path] !== this.state.files[path]).map(path => ({ path, before: tracked[path] ?? '', after: this.state.files[path], hunks: hunks(tracked[path] ?? '', this.state.files[path] ?? ''), selected: [], position: 0 }));
        return this.state.patches.length ? this.patchPrompt() : 'No changes.';
      }
      for (const path of eligible) { this.stage(path, this.state.files[path]); this.state.conflicts = this.state.conflicts.filter(item => item !== path); }
      return '';
    }
    if (sub === 'commit') {
      if (rest.includes('-a') || rest.includes('-am')) { for (const path of Object.keys(tracked)) this.stage(path, this.state.files[path]); }
      const text = message ?? (rest.includes('-am') ? rest[rest.indexOf('-am') + 1] : undefined) ?? (rest.includes('--amend') && rest.includes('--no-edit') ? this.head()?.message : this.state.operation?.message);
      if (!text || !text.trim()) return error('Provide a commit message with git commit -m "Describe the change".');
      if (this.state.operation?.kind === 'merge') { this.state.operation.message = text; return this.finishOperation(); }
      return this.commit(text, rest.includes('--amend'));
    }
    if (sub === 'diff' || sub === 'show' || sub === 'log') return this.inspect(sub, rest);
    if (sub === 'restore' || sub === 'checkout' && rest.includes('--')) {
      const staged = rest.includes('--staged') || rest.includes('-S');
      const sourceOption = rest.find(arg => arg.startsWith('--source='));
      const sourceIndex = rest.findIndex(arg => arg === '--source' || arg === '-s');
      const ref = sourceOption?.slice(9) ?? (sourceIndex >= 0 ? rest[sourceIndex + 1] ?? error('restore: missing source') : undefined);
      const source = ref ? this.requireCommit(ref).files : staged ? current : tracked;
      const requested = rest.filter((arg, i) => !arg.startsWith('-') && i !== sourceIndex + 1);
      // No source flag means index zero is a path, not an option value.
      if (sourceIndex < 0) requested.splice(0, requested.length, ...rest.filter(arg => !arg.startsWith('-')));
      if (!requested.length) error('fatal: you must specify paths to restore');
      const paths = this.selectedPaths(requested, keys(tracked, current, source));
      for (const path of paths) { if (staged) this.stage(path, source[path]); if (!staged || rest.includes('--worktree') || rest.includes('-W')) this.setFile(path, source[path]); }
      ensureDirectories(this.state); return '';
    }
    if (sub === 'reset') {
      const mode = rest.find(arg => ['--soft', '--hard', '--mixed'].includes(arg)) ?? '--mixed';
      const separator = rest.indexOf('--');
      const candidate = separator === 0 ? undefined : operands[0];
      const resolved = candidate ? this.resolve(candidate) : this.head();
      const pathArgs = separator >= 0 ? rest.slice(separator + 1) : candidate && !resolved ? operands : operands.slice(1);
      if (pathArgs.length) {
        if (mode !== '--mixed') error('Cannot use --soft or --hard with paths.');
        const source = resolved?.files ?? current;
        for (const path of this.selectedPaths(pathArgs, keys(tracked, current, source))) this.stage(path, source[path]);
        return 'Unstaged changes after reset.';
      }
      const target = resolved ?? error(`fatal: unknown revision '${candidate ?? 'HEAD'}'`);
      if (mode === '--soft' && this.state.operation) error('Cannot soft reset during an unfinished operation.');
      if (mode === '--hard') this.checkoutTree(target.files, true);
      this.moveHead(target.id, `reset: moving to ${candidate ?? 'HEAD'}`);
      this.state.index = {};
      if (mode === '--soft') for (const path of keys(tracked, target.files)) this.stage(path, tracked[path]);
      this.state.operation = undefined; this.state.conflicts = [];
      return `HEAD is now at ${target.id} ${target.message}`;
    }
    if (sub === 'switch' || sub === 'checkout') {
      if (this.state.operation) error('Finish or abort the current operation before switching branches.');
      const create = rest.includes('-c') || rest.includes('-b');
      const name = operands[0] ?? error('A branch name is required.');
      if (create && this.state.branches.includes(name)) error(`fatal: a branch named '${name}' already exists`);
      const detached = rest.includes('--detach') || sub === 'checkout' && !create && !this.state.branches.includes(name);
      const target = create ? operands[1] ? this.requireCommit(operands[1]) : this.head() : this.requireCommit(name);
      if (!create && !detached && !this.state.branches.includes(name)) error(`fatal: '${name}' is not a local branch`);
      this.checkoutTree(target?.files ?? {});
      if (create) this.state.branches.push(name);
      this.state.branch = detached ? `(detached at ${target!.id})` : name;
      this.moveHead(target?.id ?? '', `checkout: moving to ${name}`);
      return detached ? `HEAD is now at ${target!.id}` : `Switched to ${create ? 'a new ' : ''}branch '${name}'`;
    }
    if (sub === 'branch') {
      const name = operands[0];
      if (!name) return Object.keys(this.state.branchTips).filter(name => rest.includes('-a') || rest.includes('-r') ? !name.startsWith('(detached') : this.state.branches.includes(name)).filter(name => !rest.includes('-r') || !this.state.branches.includes(name)).map(name => `${name === this.state.branch ? '*' : ' '} ${name}${rest.includes('-v') || rest.includes('-vv') ? ` ${this.resolve(name)?.id ?? ''} ${this.state.upstreams[name] ? `[${this.state.upstreams[name]}] ` : ''}${this.resolve(name)?.message ?? ''}` : ''}`).join('\n');
      if (rest.includes('-d') || rest.includes('-D')) {
        if (name === this.state.branch) error('Cannot delete the current branch.');
        if (!this.state.branches.includes(name)) error(`Branch '${name}' not found.`);
        if (!rest.includes('-D') && !this.ancestors(this.head()?.id ?? '').has(this.state.branchTips[name])) error(`Branch '${name}' is not fully merged. Use -D only to discard the branch.`);
        this.state.branches = this.state.branches.filter(item => item !== name); delete this.state.branchTips[name]; return `Deleted branch ${name}.`;
      }
      if (this.state.branches.includes(name)) error(`Branch '${name}' already exists.`);
      const target = operands[1] ? this.requireCommit(operands[1]) : this.head() ?? error('No commit to branch from.');
      this.state.branches.push(name); this.state.branchTips[name] = target.id; return '';
    }
    if (sub === 'rev-parse') return rest.includes('--show-toplevel') ? this.state.repo! : this.requireCommit(operands[0] ?? 'HEAD').id;
    if (sub === 'ls-files') return Object.keys(tracked).map(path => this.relative(path)).join('\n');
    if (sub === 'clone') {
      const source = operands[0] ?? error('usage: git clone <training-url> [directory]');
      const folder = operands[1] ?? source.replace(/\.git$/, '').split('/').pop()!;
      const target = normalizePath(folder, this.state.cwd);
      if (Object.keys(this.state.files).some(path => within(path, target)) || target === this.state.repo) error(`fatal: destination '${folder}' already exists and is not empty`);
      const response = Object.entries(this.state.files).find(([path]) => path.endsWith('/RESPONSE.md'))?.[1];
      const files = { [`${target}/README.md`]: '# Sample project\n', ...(response !== undefined ? { [`${target}/RESPONSE.md`]: response } : {}) };
      this.state.repo = target; Object.assign(this.state.files, files); this.state.commits = [{ id: 'a10b111', parents: [], message: 'Initial project', files: { [`${target}/README.md`]: '# Sample project\n' } }]; this.state.branch = 'main'; this.state.branches = ['main']; this.state.branchTips = { main: 'a10b111', 'origin/main': 'a10b111' }; this.state.remoteTips = { 'origin/main': 'a10b111' }; this.state.remotes = { origin: source }; this.state.upstreams = { main: 'origin/main' }; this.state.index = {}; this.state.tagTips = {}; this.state.stashes = []; this.state.reflog = ['a10b111 clone: from training fixture']; ensureDirectories(this.state);
      return `Cloning into '${folder}'...\nLoaded a local training copy. No network request was made.\nUse cd ${folder} to enter the repository.`;
    }
    if (sub === 'remote') {
      const [action, name, value] = rest;
      if (!action || action === '-v') return Object.entries(this.state.remotes).map(([name, url]) => action ? `${name}\t${url} (fetch)\n${name}\t${url} (push)` : name).join('\n');
      if (!name) error('A remote name is required.');
      if (action === 'add') { if (this.state.remotes[name]) error(`remote ${name} already exists`); if (!value) error('A remote URL is required.'); this.state.remotes[name] = value; return ''; }
      if (!this.state.remotes[name]) error(`No such remote: ${name}`);
      if (action === 'get-url') return this.state.remotes[name];
      if (action === 'set-url') { if (!value) error('A remote URL is required.'); this.state.remotes[name] = value; return ''; }
      if (action === 'remove' || action === 'rm') { delete this.state.remotes[name]; return ''; }
      if (action === 'rename') { if (!value || this.state.remotes[value]) error('Supply an unused remote name.'); this.state.remotes[value] = this.state.remotes[name]; delete this.state.remotes[name]; for (const refs of [this.state.branchTips, this.state.remoteTips]) for (const key of Object.keys(refs)) if (key.startsWith(`${name}/`)) { refs[value + key.slice(name.length)] = refs[key]; delete refs[key]; } return ''; }
      error(`git remote: unsupported action '${action}'`);
    }
    if (sub === 'fetch' || sub === 'pull' || sub === 'push') {
      const remote = operands[0] ?? this.state.upstreams[this.state.branch]?.split('/')[0] ?? 'origin';
      if (!this.state.remotes[remote]) error(`fatal: '${remote}' does not appear to be a git repository`);
      if (sub === 'fetch' || sub === 'pull') {
        for (const [ref, tip] of Object.entries(this.state.remoteTips)) if (ref.startsWith(`${remote}/`)) this.state.branchTips[ref] = tip;
        if (rest.includes('--prune')) for (const ref of Object.keys(this.state.branchTips)) if (ref.startsWith(`${remote}/`) && !this.state.remoteTips[ref]) delete this.state.branchTips[ref];
        if (sub === 'fetch') return `From ${this.state.remotes[remote]} (local training remote)\nRemote-tracking branches updated; working files unchanged.`;
        const branch = operands[1] ?? this.state.branch;
        return this.git([rest.includes('--rebase') ? 'rebase' : 'merge', ...(rest.includes('--ff-only') ? ['--ff-only'] : []), `${remote}/${branch}`]);
      }
      const branch = operands[1] ?? this.state.branch;
      const target = this.requireCommit(branch);
      const previous = this.state.remoteTips[`${remote}/${branch}`];
      if (previous && !this.ancestors(target.id).has(previous) && !rest.includes('--force-with-lease') && !rest.includes('--force')) error('Push rejected (non-fast-forward). Fetch and integrate the remote changes first.');
      if (rest.includes('--force-with-lease') && previous !== this.state.branchTips[`${remote}/${branch}`]) error('Push rejected: stale remote information. Fetch first.');
      this.state.remoteTips[`${remote}/${branch}`] = target.id; this.state.branchTips[`${remote}/${branch}`] = target.id;
      if (rest.includes('-u') || rest.includes('--set-upstream')) this.state.upstreams[branch] = `${remote}/${branch}`;
      return `Updated ${remote}/${branch} in the local training remote.${this.state.upstreams[branch] ? `\nbranch '${branch}' tracks '${this.state.upstreams[branch]}'.` : ''}`;
    }
    if (['merge', 'rebase', 'cherry-pick', 'revert'].includes(sub)) return this.integrate(sub, rest);
    if (sub === 'stash') return this.stash(rest);
    if (sub === 'tag') {
      const name = rest.filter((arg, i) => !arg.startsWith('-') && (messageFlag < 0 || i !== messageFlag + 1))[0];
      if (!name || rest.includes('-l') || rest.includes('--list')) return Object.keys(this.state.tagTips).join('\n');
      if (rest.includes('-d')) { if (!this.state.tagTips[name]) error(`Tag '${name}' not found.`); delete this.state.tagTips[name]; return `Deleted tag ${name}.`; }
      if (this.state.tagTips[name] && !rest.includes('-f')) error(`Tag '${name}' already exists.`);
      const position = rest.indexOf(name), reference = rest[position + 1];
      this.state.tagTips[name] = this.requireCommit(reference && !reference.startsWith('-') ? reference : 'HEAD').id; return '';
    }
    if (sub === 'reflog') return this.state.reflog.slice(0, Number(rest.find(arg => /^-\d+$/.test(arg))?.slice(1) ?? this.state.reflog.length)).map((item, index) => `${item.split(' ')[0]} HEAD@{${index}}: ${item.split(' ').slice(1).join(' ')}`).join('\n');
    return error(`git: '${sub}' is not supported in this practice terminal. Type help.`);
  }

  private inspect(sub: string, args: string[]) {
    const separator = args.indexOf('--');
    const options = separator >= 0 ? args.slice(0, separator) : args;
    let paths = separator >= 0 ? args.slice(separator + 1).map(path => normalizePath(path, this.state.cwd)) : [];
    const refs = options.filter((arg, i) => !arg.startsWith('-') && options[i - 1] !== '-n');
    const selected = (path: string) => !paths.length || paths.some(target => within(path, target));
    const diff = (a: Tree, b: Tree) => keys(a, b).filter(selected).filter(path => a[path] !== b[path]).map(path => options.includes('--stat') ? ` ${this.relative(path)} | ${hunks(a[path] ?? '', b[path] ?? '').reduce((n, h) => n + h.insert.length + h.remove.length, 0)} lines changed` : options.includes('--name-only') ? this.relative(path) : diffText(this.relative(path), a[path], b[path])).join('\n');
    if (sub === 'show') {
      const spec = refs[0] ?? 'HEAD';
      const colon = spec.indexOf(':');
      if (colon >= 0) { const commit = this.requireCommit(spec.slice(0, colon)); const path = normalizePath(spec.slice(colon + 1), this.state.repo!); return commit.files[path] ?? error(`fatal: path '${spec.slice(colon + 1)}' does not exist in '${spec.slice(0, colon)}'`); }
      const commit = this.requireCommit(spec);
      return `${commit.id} ${commit.message}\n${diff(this.parentFiles(commit), commit.files)}`;
    }
    if (sub === 'diff') {
      const range = refs[0]?.split('..');
      if (range?.length === 2) return diff(this.requireCommit(range[0] || 'HEAD').files, this.requireCommit(range[1] || 'HEAD').files);
      if (refs.length >= 2) return diff(this.requireCommit(refs[0]).files, this.requireCommit(refs[1]).files);
      let ref: Commit | undefined;
      if (refs.length) { ref = this.resolve(refs[0]); if (!ref) { const target = normalizePath(refs[0], this.state.cwd); if (!(target in this.state.files) && !this.state.directories.includes(target)) error(`fatal: unknown revision or path '${refs[0]}'`); paths = [target]; } }
      if (options.includes('--staged') || options.includes('--cached')) return diff(ref?.files ?? this.committed(), this.indexTree());
      const index = this.indexTree();
      const worktree = Object.fromEntries(keys(ref?.files, index).filter(path => path in this.state.files).map(path => [path, this.state.files[path]]));
      return diff(ref?.files ?? index, worktree);
    }
    const range = refs[0]?.split('..');
    const excluded = range?.length === 2 ? this.ancestors(this.requireCommit(range[0] || 'HEAD').id) : new Set<string>();
    const starts = options.includes('--all') ? Object.values(this.state.branchTips) : [this.requireCommit(range?.length === 2 ? range[1] || 'HEAD' : refs[0] ?? 'HEAD').id];
    const reachable = new Set(starts.flatMap(id => [...this.ancestors(id)]));
    const limit = Number(options.find(arg => /^-\d+$/.test(arg))?.slice(1) ?? (options.includes('-n') ? options[options.indexOf('-n') + 1] : Infinity));
    return [...this.state.commits].reverse().filter(commit => reachable.has(commit.id) && !excluded.has(commit.id)).filter(commit => !paths.length || keys(commit.files, this.parentFiles(commit)).some(path => selected(path) && commit.files[path] !== this.parentFiles(commit)[path])).slice(0, limit).map(commit => {
      const labels = Object.entries(this.state.branchTips).filter(([, id]) => id === commit.id).map(([name]) => name === this.state.branch ? `HEAD -> ${name}` : name);
      return `${options.includes('--graph') ? '* ' : ''}${commit.id}${options.includes('--decorate') && labels.length ? ` (${labels.join(', ')})` : ''} ${commit.message}${options.includes('-p') || options.includes('--stat') ? '\n' + diff(this.parentFiles(commit), commit.files) : ''}`;
    }).join('\n');
  }

  private integrate(kind: string, args: string[]): string {
    if (args.includes('--abort')) {
      const original = this.state.rebaseTodo?.original ?? this.state.operation?.original ?? error(`No ${kind} in progress.`);
      if (this.state.rebaseTodo) delete this.state.files[this.state.rebaseTodo.path];
      this.checkoutTree(this.requireCommit(original).files, true); this.moveHead(original, `${kind}: abort`); this.state.operation = undefined; this.state.rebaseTodo = undefined; this.state.conflicts = []; return `${kind} aborted.`;
    }
    if (args.includes('--continue')) {
      if (kind === 'rebase' && this.state.rebaseTodo) return this.continueInteractiveRebase();
      if (this.state.operation?.kind !== kind) error(`No ${kind} in progress.`);
      return this.finishOperation();
    }
    if (this.state.operation || this.state.rebaseTodo) error('Finish or abort the current operation first.');
    const name = args.find(arg => !arg.startsWith('-')) ?? error(`git ${kind}: a revision is required`);
    const source = this.requireCommit(name), head = this.head() ?? error('No current commit.');
    if (kind === 'rebase' && this.dirty() || Object.keys(this.state.index).length) error('Commit or stash staged changes before starting this operation.');
    if (kind === 'merge') {
      if (this.ancestors(head.id).has(source.id)) return 'Already up to date.';
      if (this.ancestors(source.id).has(head.id) && !args.includes('--no-ff')) { this.checkoutTree(source.files); this.moveHead(source.id, `merge: fast-forward ${name}`); return 'Fast-forward'; }
      if (args.includes('--ff-only')) error('fatal: Not possible to fast-forward, aborting.');
      const ours = this.ancestors(head.id);
      const baseId = [...this.ancestors(source.id)].find(id => ours.has(id));
      if (!baseId) error('fatal: refusing to merge unrelated histories');
      this.state.operation = { kind: 'merge', original: head.id, source: source.id, message: `Merge ${name}` };
      this.applyTree(this.requireCommit(baseId).files, source.files);
    } else if (kind === 'rebase') {
      const excluded = this.ancestors(source.id);
      const replay = [...this.ancestors(head.id)].reverse().filter(id => !excluded.has(id));
      if (args.includes('-i') || args.includes('--interactive')) {
        if (!replay.length) return 'Nothing to rebase.';
        const path = `${this.state.repo}/.git/rebase-todo`;
        this.state.rebaseTodo = { path, base: source.id, original: head.id, commits: replay };
        this.state.files[path] = replay.map(id => `pick ${id} ${this.requireCommit(id).message}`).join('\n') + '\n';
        return 'Open .git/rebase-todo in the file explorer. Keep the first pick; change later lines to squash, fixup, or drop as needed. Save, then run git rebase --continue. Use git rebase --abort to cancel.';
      }
      if (excluded.has(head.id)) { this.checkoutTree(source.files); this.moveHead(source.id, `rebase: ${name}`); return 'Fast-forward'; }
      if (this.ancestors(head.id).has(source.id)) return 'Current branch is up to date.';
      this.checkoutTree(source.files); this.moveHead(source.id, `rebase: onto ${name}`);
      return this.replay(replay, head.id);
    } else {
      const parent = this.parentFiles(source);
      this.state.operation = { kind: kind as 'cherry-pick' | 'revert', original: head.id, source: source.id, message: kind === 'revert' ? `Revert "${source.message}"` : source.message };
      this.applyTree(kind === 'revert' ? source.files : parent, kind === 'revert' ? parent : source.files);
    }
    if (this.state.conflicts.length) error(`CONFLICT in ${this.state.conflicts.map(path => this.relative(path)).join(', ')}. Resolve in the editor, git add, then git ${kind} --continue (or --abort).`);
    return this.finishOperation();
  }
  private continueInteractiveRebase() {
    const todo = this.state.rebaseTodo!;
    const rows = this.file(todo.path).split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#')).map(line => line.split(/\s+/));
    const seen = new Set<string>(); let picks = 0;
    for (const [action, id] of rows) {
      if (!['pick', 'p', 'squash', 's', 'fixup', 'f', 'drop', 'd'].includes(action) || !todo.commits.includes(id) || seen.has(id)) error('Invalid rebase todo. Use pick, squash, fixup, or drop with each original commit ID once.');
      if (['squash', 's', 'fixup', 'f'].includes(action) && !picks) error('Cannot squash or fixup without a preceding pick.');
      if (action === 'pick' || action === 'p') picks++;
      seen.add(id);
    }
    if (seen.size !== todo.commits.length) error('Keep every original commit in the todo; use drop to remove one explicitly.');
    // Validate the complete plan before changing history.
    let tree = { ...this.requireCommit(todo.base).files };
    const planned: { message: string; files: Tree }[] = [];
    for (const [action, id] of rows) {
      if (action === 'drop' || action === 'd') continue;
      const commit = this.requireCommit(id), base = this.parentFiles(commit);
      for (const path of keys(base, commit.files)) {
        if (base[path] === commit.files[path]) continue;
        const merged = mergeText(base[path], tree[path], commit.files[path]);
        if (merged.conflict) error('This reordered plan conflicts. Restore the original order or abort; interactive conflict editing is not supported.');
        if (merged.text === undefined) delete tree[path]; else tree[path] = merged.text;
      }
      if (action === 'pick' || action === 'p') planned.push({ message: commit.message, files: { ...tree } });
      else { const previous = planned[planned.length - 1]; previous.files = { ...tree }; if (action === 'squash' || action === 's') previous.message += `\n\n${commit.message}`; }
    }
    this.checkoutTree(this.requireCommit(todo.base).files, true); this.moveHead(todo.base, 'rebase: start');
    for (const step of planned) { const current = this.committed(); for (const path of keys(current, step.files)) { this.setFile(path, step.files[path]); this.stage(path, step.files[path]); } if (Object.keys(this.state.index).length) this.commit(step.message); }
    delete this.state.files[todo.path]; this.state.rebaseTodo = undefined; ensureDirectories(this.state); return 'Successfully rebased and updated the current branch.';
  }
  private stash(args: string[]) {
    const action = args[0] && !args[0].startsWith('-') ? args[0] : 'push';
    const number = Number(args.find(arg => /^stash@\{\d+\}$/.test(arg))?.match(/\d+/)?.[0] ?? 0);
    if (action === 'list') return this.state.stashes.map((stash, i) => `stash@{${i}}: On ${stash.branch}: ${stash.message}`).join('\n');
    if (action === 'clear') { this.state.stashes = []; return ''; }
    if (['apply', 'pop', 'drop', 'show'].includes(action)) {
      const stash = this.state.stashes[number] ?? error('No stash entry found.');
      if (action === 'drop') { this.state.stashes.splice(number, 1); return `Dropped stash@{${number}}.`; }
      if (action === 'show') return Object.entries(stash.files).map(([path, text]) => diffText(this.relative(path), stash.base[path], text)).join('\n');
      if (this.dirty()) error('Commit or stash current changes before applying a stash.');
      const merged: Record<string, string | undefined> = {};
      for (const [path, text] of Object.entries(stash.files)) {
        const result = mergeText(stash.base[path], this.state.files[path], text ?? undefined);
        if (result.conflict) error(`Stash conflicts with '${this.relative(path)}'. Your stash is preserved.`);
        merged[path] = result.text;
      }
      for (const [path, text] of Object.entries(merged)) this.setFile(path, text);
      if (args.includes('--index')) for (const [path, text] of Object.entries(stash.index)) this.stage(path, text ?? undefined);
      if (action === 'pop') this.state.stashes.splice(number, 1);
      ensureDirectories(this.state); return `Applied stash@{${number}}.`;
    }
    if (!['push', 'save'].includes(action)) error(`Unsupported stash action '${action}'`);
    const includeUntracked = args.includes('-u') || args.includes('--include-untracked'), base = this.committed(), tracked = this.indexTree();
    const candidates = [...new Set([...keys(base, tracked), ...(includeUntracked ? Object.keys(this.state.files).filter(path => this.state.repo && within(path, this.state.repo) && !path.includes('/.git/') && !this.ignored(path)) : [])])];
    const files: Record<string, string | null> = {};
    for (const path of candidates) if (this.state.files[path] !== base[path]) files[path] = this.state.files[path] ?? null;
    if (!Object.keys(files).length && !Object.keys(this.state.index).length) return 'No local changes to save';
    const messageIndex = args.indexOf('-m');
    this.state.stashes.unshift({ files, base: { ...base }, index: { ...this.state.index }, branch: this.state.branch, message: messageIndex >= 0 ? args[messageIndex + 1] ?? 'WIP' : 'WIP' });
    this.checkoutTree(base, true);
    if (includeUntracked) for (const path of Object.keys(files)) if (!(path in base)) delete this.state.files[path];
    return 'Saved working directory and index state';
  }
}
