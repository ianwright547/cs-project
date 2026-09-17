export type ShellCommand = { args: string[]; raw: string; condition: ';' | '&&' | '||'; redirect?: { path: string; append: boolean } };

// Parse data, never evaluate JavaScript or invoke a shell on the host machine.
export function parseShell(input: string): ShellCommand[] {
  const commands: ShellCommand[] = [];
  let args: string[] = [], word = '', started = false, quote = '', start = 0;
  let condition: ShellCommand['condition'] = ';';
  let redirect: ShellCommand['redirect'], expectingRedirect: boolean | undefined;
  const flush = () => {
    if (!started) return;
    if (expectingRedirect !== undefined) { redirect = { path: word, append: expectingRedirect }; expectingRedirect = undefined; }
    else args.push(word);
    word = ''; started = false;
  };
  const finish = (end: number) => {
    flush();
    if (expectingRedirect !== undefined) throw new Error('syntax error: redirection needs a filename');
    if (args.length) commands.push({ args, raw: input.slice(start, end).trim(), condition, redirect });
    else if (redirect) throw new Error('syntax error: missing command before redirection');
    args = []; redirect = undefined;
  };
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '\\' && quote !== "'") {
      const next = input[i + 1];
      if (next === '\n') { i++; continue; }
      // Accept Windows paths as well as the escapes used in Git Bash examples.
      if (next && (quote === '"' ? ['"', '\\', '$', '`'].includes(next) : /[\s"'\\;&|>#]/.test(next))) { word += next; started = true; i++; continue; }
    }
    if (quote) { if (char === quote) quote = ''; else word += char; continue; }
    if (char === '"' || char === "'") { quote = char; started = true; continue; }
    if (char === '#' && !started) { while (i < input.length && input[i] !== '\n') i++; if (i === input.length) break; }
    if (input[i] === '\n' || char === ';' || char === '&' || char === '|') {
      const separator = char === '&' || char === '|' ? input.slice(i, i + 2) : ';';
      if ((char === '&' && separator !== '&&') || (char === '|' && separator !== '||')) throw new Error('Pipes and background jobs are not supported in this practice terminal. Run each command separately.');
      finish(i);
      if (separator !== ';' && !commands.length) throw new Error('syntax error: missing command');
      if (separator === '&&' || separator === '||') i++;
      condition = separator as ShellCommand['condition']; start = i + 1; continue;
    }
    if (char === '>') {
      flush();
      if (redirect || expectingRedirect !== undefined) throw new Error('Use one output redirection per command.');
      expectingRedirect = input[i + 1] === '>'; if (expectingRedirect) i++;
      continue;
    }
    if (char === '<' || char === '`' || (char === '$' && input[i + 1] === '(')) throw new Error('Input redirection and command substitution are not supported in this practice terminal.');
    if (/\s/.test(char)) { flush(); continue; }
    word += char; started = true;
  }
  if (quote) throw new Error('syntax error: close the quoted text before running the command');
  finish(input.length);
  if (condition !== ';' && !input.slice(start).trim()) throw new Error('syntax error: missing command after operator');
  return commands;
}

export function normalizePath(path: string, cwd: string) {
  const cleaned = path.replace(/^C:/i, '').replace(/\\/g, '/');
  const absolute = cleaned.startsWith('/') ? cleaned : `${cwd}/${cleaned}`;
  const parts: string[] = [];
  for (const part of absolute.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') parts.pop(); else parts.push(part);
  }
  return `/${parts.join('/')}`;
}
export const parentPath = (path: string) => path.slice(0, path.lastIndexOf('/')) || '/';
export const basename = (path: string) => path.split('/').pop() || '/';
export const within = (path: string, directory: string) => path === directory || path.startsWith(directory === '/' ? '/' : `${directory}/`);

export function ignoredPath(path: string, repo: string | undefined, files: Record<string, string>) {
  if (!repo || path === `${repo}/.gitignore`) return false;
  const relative = path.slice(repo.length + 1);
  let ignored = false;
  for (const raw of (files[`${repo}/.gitignore`] ?? '').split('\n')) {
    let rule = raw.trim();
    if (!rule || rule.startsWith('#')) continue;
    const negate = rule.startsWith('!'); if (negate) rule = rule.slice(1);
    const anchored = rule.startsWith('/'); rule = rule.replace(/^\//, '').replace(/\/$/, '');
    const pattern = rule.split('**').map(part => part.split('*').map(piece => piece.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*')).join('.*');
    if (new RegExp(`${anchored || rule.includes('/') ? '^' : '(^|/)'}${pattern}($|/)`).test(relative)) ignored = !negate;
  }
  return ignored;
}
