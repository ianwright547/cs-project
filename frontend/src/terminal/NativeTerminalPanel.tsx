import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import type { Activity } from '../content/types';
import type { CommandRecord, WorkspaceSnapshot } from './types';
import { gradeActivity, type GradeResult } from './grader';
import { FeedbackToast } from './FeedbackToast';

type Snapshot = WorkspaceSnapshot & { records: CommandRecord[]; aliases: Record<string, string> };
type Session = { id: string; initial: Snapshot; snapshot: Snapshot; reused: boolean };
type Props = { activity: Activity; courseId: 'git' | 'github'; focused: boolean; onFocusChange: (value: boolean) => void; onComplete?: (id: string) => void; nextHref: string; nextLabel: string; onAliases: (aliases: Record<string,string>) => void; onFallback: () => void };
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/terminal${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...init.headers } });
  const data = await response.json();
  if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'The terminal could not complete that action. Try again.');
  return data;
}
const creations = new Map<string, Promise<Session>>();
function open(lesson: string) {
  let pending = creations.get(lesson);
  if (!pending) { pending = request<Session>('/sessions', { method:'POST', body:JSON.stringify({ lesson }) }); creations.set(lesson, pending); pending.finally(() => creations.delete(lesson)).catch(() => {}); }
  return pending;
}
const encode = (text: string) => btoa(String.fromCharCode(...new TextEncoder().encode(text)));

export function NativeTerminalPanel(props: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState('');
  const [editor, setEditor] = useState('');
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [busy, setBusy] = useState(false);
  const [grade, setGrade] = useState<GradeResult | null>(null);
  const [feedback, setFeedback] = useState(false);
  const [explorer, setExplorer] = useState(true);
  const [connecting, setConnecting] = useState(true);
  const [closed, setClosed] = useState(false);
  const [shellReady, setShellReady] = useState(false);
  const [connection, setConnection] = useState(0);
  const mount = useRef<HTMLDivElement>(null);
  const terminal = useRef<Terminal | null>(null);
  const selectedRef = useRef('');
  const draft = useRef<{path: string; content: string; revision: number} | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const saveQueue = useRef(Promise.resolve());
  const alive = useRef(true);
  const revision = useRef(0);
  const currentSession = useRef<Session | null>(null);

  function acceptSnapshot(value: Snapshot) {
    if (!alive.current) return;
    setSnapshot(value);
    if (!draft.current && selectedRef.current) {
      if (selectedRef.current in value.files) setEditor(value.files[selectedRef.current]);
      else { selectedRef.current = ''; setSelected(''); setEditor(''); }
    }
  }
  async function start() {
    setConnecting(true); setError(''); setGrade(null); setClosed(false); setShellReady(false);
    try {
      await flushSave();
      const value = await open(props.activity.id);
      if (!alive.current) return;
      currentSession.current = value; setSession(value); setConnection(value => value + 1); acceptSnapshot(value.snapshot); props.onAliases(value.snapshot.aliases);
      const first = Object.keys(value.snapshot.files).filter(path => path.endsWith('/README.md') || path.endsWith('/RESPONSE.md'))[0] ?? Object.keys(value.snapshot.files)[0] ?? '';
      selectedRef.current = first; setSelected(first); setEditor(value.snapshot.files[first] ?? '');
    } catch (reason) { if (alive.current) setError(reason instanceof Error ? reason.message : 'Unable to start the terminal.'); }
    finally { if (alive.current) setConnecting(false); }
  }
  useEffect(() => {
    alive.current = true;
    void start();
    return () => { alive.current = false; clearTimeout(saveTimer.current); void flushSave().catch(() => {}); };
    // The parent keys this component by course and activity.
  }, []);

  function flushSave() {
    clearTimeout(saveTimer.current);
    const pending = draft.current, active = currentSession.current;
    if (!pending || !active) return saveQueue.current;
    saveQueue.current = saveQueue.current.catch(() => {}).then(async () => {
      await request(`/sessions/${active.id}/file`, { method:'PUT', body:JSON.stringify({ path:pending.path, content:pending.content }) });
      revision.current++;
      if (draft.current?.revision === pending.revision && draft.current.path === pending.path) { draft.current = null; if (alive.current) setSaveStatus('Saved'); }
    });
    return saveQueue.current;
  }
  async function selectFile(path: string) {
    try { await flushSave(); selectedRef.current = path; setSelected(path); setEditor(snapshot?.files[path] ?? ''); }
    catch (reason) { setError(String(reason)); }
  }
  function edit(text: string) {
    setEditor(text); setGrade(null); setFeedback(false); setSaveStatus('Saving…');
    draft.current = { path:selectedRef.current, content:text, revision:++revision.current };
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => { void flushSave().catch(reason => { if (alive.current) { setSaveStatus('Not saved'); setError(reason.message); } }); }, 400);
  }
  useEffect(() => {
    if (!session || !mount.current) return;
    let stopped = false, cursor = 0, outgoing = '', sending = false;
    let snapshotTimer: ReturnType<typeof setTimeout> | undefined;
    const term = new Terminal({ cursorBlink:true, fontFamily:'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize:13, lineHeight:1.35, scrollback:3000, theme:{ background:'#0d100f', foreground:'#d4d9d2', cursor:'#d4dfc5', selectionBackground:'#41563b' }, allowProposedApi:false });
    const fit = new FitAddon(); term.loadAddon(fit); term.open(mount.current); terminal.current = term;
    const resize = new ResizeObserver(() => { if (mount.current?.clientWidth && mount.current?.clientHeight) fit.fit(); });
    resize.observe(mount.current); if (mount.current.clientWidth && mount.current.clientHeight) fit.fit();
    const dimensions = () => ({ cols:Math.max(20, Math.min(300, term.cols)), rows:Math.max(5, Math.min(100, term.rows)) });
    const send = async () => {
      if (sending || stopped) return;
      sending = true;
      try {
        while (outgoing && !stopped) {
          const text = outgoing.slice(0, 2000); outgoing = outgoing.slice(text.length);
          await request(`/sessions/${session.id}/io`, { method:'POST', body:JSON.stringify({ input:encode(text), cursor, ...dimensions() }) });
        }
      } catch (reason) { if (!stopped) setError(reason instanceof Error ? reason.message : 'Input could not be sent.'); }
      finally { sending = false; }
    };
    const input = term.onData(text => { outgoing += text; if (/[\r\n]/.test(text)) setShellReady(false); setGrade(null); setFeedback(false); void send(); });
    const refresh = async () => { const version = revision.current; try { const value = await request<Snapshot>(`/sessions/${session.id}/snapshot`); if (!stopped && version === revision.current) acceptSnapshot(value); } catch (reason) { if (!stopped) setError(String(reason)); } };
    const prompt = term.parser.registerOscHandler(133, data => { if (data === 'A') { setShellReady(true); clearTimeout(snapshotTimer); snapshotTimer = setTimeout(() => void refresh(), 200); } return true; });
    const poll = async () => {
      try {
        while (!stopped) {
          const result = await request<{output:string; cursor:number; closed:boolean; trimmed:boolean}>(`/sessions/${session.id}/io`, { method:'POST', body:JSON.stringify({ cursor, ...dimensions() }) });
          if (stopped) break;
          if (result.trimmed) term.writeln('\r\n[Earlier output was trimmed.]');
          cursor = result.cursor;
          if (result.output) {
            term.write(Uint8Array.from(atob(result.output), char => char.charCodeAt(0)));
          }
          if (result.closed) { setClosed(true); break; }
        }
      } catch (reason) { if (!stopped) setError(reason instanceof Error ? reason.message : 'Connection lost. Reconnect to keep working.'); }
    };
    void poll();
    return () => { stopped = true; clearTimeout(snapshotTimer); resize.disconnect(); input.dispose(); prompt.dispose(); term.dispose(); terminal.current = null; };
  }, [session?.id, connection]);

  async function submit() {
    if (!session) return;
    setBusy(true); setError('');
    try {
      await flushSave();
      const value = await request<Snapshot>(`/sessions/${session.id}/snapshot`);
      acceptSnapshot(value);
      const result = gradeActivity(props.activity, props.courseId, session.initial, value, value.records, value.files[`${value.repo}/RESPONSE.md`] ?? '');
      setGrade(result); setFeedback(true);
      if (result.passed) props.onComplete?.(props.activity.id);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to check work.'); }
    finally { setBusy(false); }
  }
  async function reset() {
    if (!session) return;
    setBusy(true);
    try { clearTimeout(saveTimer.current); draft.current = null; await saveQueue.current.catch(() => {}); await request(`/sessions/${session.id}`, {method:'DELETE'}); currentSession.current = null; setSession(null); await start(); }
    catch (reason) { setError(String(reason)); }
    finally { setBusy(false); }
  }
  const visibleFiles = Object.keys(snapshot?.files ?? {}).filter(path => path.startsWith(`${snapshot?.cwd}/`)).sort();
  const selectedLabel = selected.split('/').pop() || 'Select a file';
  return <section className="code-workspace native-workspace" aria-label="Practice workspace">
    <header className="pane-header editor-heading"><span>Workspace <span className="workspace-mode">Real Linux shell</span></span><div className="editor-tools"><span className="native-platform">Linux · Bash</span><button className="icon-button" type="button" aria-label={explorer ? 'Hide file explorer' : 'Show file explorer'} onClick={() => setExplorer(!explorer)}><span className="panel-icon" /></button><button className="icon-button" type="button" aria-label={props.focused ? 'Restore split workspace' : 'Expand code workspace'} onClick={() => props.onFocusChange(!props.focused)}>{props.focused ? '↙' : '⤢'}</button></div></header>
    {grade && feedback && <FeedbackToast result={grade} onDismiss={() => setFeedback(false)} />}
    {error && <aside className="practice-feedback" role="alert"><strong>Terminal needs attention</strong><p>{error}</p><button type="button" className="practice-run" onClick={() => void start()}>Reconnect</button><button type="button" className="practice-run" onClick={props.onFallback}>Use browser practice</button><button className="feedback-dismiss" type="button" aria-label="Dismiss terminal error" onClick={() => setError('')}>×</button></aside>}
    <div className="ide">
      {explorer && <aside className="file-explorer" aria-label="Files"><div className="explorer-toggle">EXPLORER</div><div className="folder-label">{snapshot?.cwd.split('/').pop() || 'workspace'}</div><div className="file-tree">{visibleFiles.map(path => <button type="button" className={`file ${selected === path ? 'selected' : ''}`} key={path} onClick={() => void selectFile(path)}><span className="file-type">•</span>{path.slice((snapshot?.cwd.length ?? 0) + 1)}</button>)}{!visibleFiles.length && <p className="empty-files">Create a file with <code>touch README.md</code>.</p>}</div></aside>}
      <div className="editor-column"><div className="file-tabs"><button type="button">{selectedLabel}</button></div><div className="editor-breadcrumb">{selected || snapshot?.cwd}</div><div className="editor-panel"><div className="line-numbers" aria-hidden="true">{Array.from({length:editor.split('\n').length}, (_, i) => i + 1).join('\n')}</div><textarea aria-label={`File editor, ${selectedLabel}`} value={editor} disabled={!selected || connecting} onChange={event => edit(event.target.value)} spellCheck={false} /></div><div className="editor-status"><span>{saveStatus}</span><span>UTF-8</span></div></div>
    </div>
    <div className="practice-toolbar">{grade?.passed ? <a className="practice-submit" href={props.nextHref}>{props.nextLabel} →</a> : <button className="practice-submit" type="button" disabled={!session || busy || connecting || !shellReady || closed} onClick={() => void submit()}>{busy ? 'Checking…' : 'Submit'}</button>}<button className="practice-run" type="button" onClick={() => terminal.current?.focus()}>Focus terminal</button><a className="practice-skip" href={props.nextHref}>Skip for now</a></div>
    <section className="terminal" aria-label="Linux terminal"><header className="terminal-header"><div><span className="terminal-active">Terminal</span><span className="terminal-session">bash</span></div><div className="terminal-actions"><details className="terminal-help"><summary>Keyboard help</summary><div><p><kbd>Ctrl+C</kbd> stops a running command.</p><p><kbd>q</kbd> exits Git’s scrolling log or diff.</p><p>In nano: <kbd>Ctrl+O</kbd>, <kbd>Enter</kbd> to save; <kbd>Ctrl+X</kbd> to exit.</p><p>With <code>git add -p</code>, use <kbd>s</kbd> to split combined hunks, then <kbd>y</kbd> or <kbd>n</kbd>.</p></div></details><button type="button" disabled={busy || connecting} onClick={() => void reset()}>Reset</button></div></header><div className="native-terminal" ref={mount} />{connecting && <p className="native-connection" role="status">Starting your isolated terminal…</p>}{closed && <p className="native-connection" role="status">Shell exited. Reset to start a fresh session.</p>}</section>
    <div className="workspace-status"><span>{snapshot?.branch || 'main'}</span><span>Isolated Linux · no internet · expires after 30 min idle</span></div>
  </section>;
}
