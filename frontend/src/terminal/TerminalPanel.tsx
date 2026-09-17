import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import type { Activity } from '../content/types';
import type { Platform } from './types';
import { fixtureFor } from './fixtures';
import { gradeActivity, type GradeResult } from './grader';
import { initialSnapshotFor, Workspace } from './workspace';
import { readPreference, writePreference } from '../preferences';
import { FeedbackToast } from './FeedbackToast';

const platformInfo: Record<Platform, { label: string; prompt: string }> = {
  mac: { label: 'macOS', prompt: '$' },
  linux: { label: 'Linux', prompt: '$' },
  windows: { label: 'Windows · Git Bash', prompt: '$' },
};

type TranscriptEntry = { command: string; output?: string; failed: boolean; cwd?: string };

function savedGrade(courseId: string, activityId: string): GradeResult | null {
  try {
    const value = localStorage.getItem(`code-practice-grade:v2:${courseId}:${activityId}`);
    return value ? JSON.parse(value) as GradeResult : null;
  } catch {
    return null;
  }
}

export function TerminalPanel({ activity, courseId, focused, onFocusChange, onComplete, nextHref, nextLabel }: {
  activity: Activity; courseId: 'git' | 'github'; focused: boolean; onFocusChange: (focused: boolean) => void; onComplete?: (activityId: string) => void; nextHref: string; nextLabel: string;
}) {
  const activityId = activity.id;
  const [platform, setPlatform] = useState<Platform>(() => {
    const saved = readPreference('code-practice-platform');
    return saved === 'linux' || saved === 'windows' ? saved : 'mac';
  });
  const setup = useMemo(() => fixtureFor(activityId), [activityId]);
  const [workspace] = useState(() => new Workspace(activityId, setup.fixture, setup.prepared));
  const [startingSnapshot] = useState(() => initialSnapshotFor(activityId, setup.fixture, setup.prepared));
  const [view, setView] = useState(() => workspace.view(platform));
  const [command, setCommand] = useState('');
  const [selectedFile, setSelectedFile] = useState(() => workspace.view(platform).files[0]?.absolutePath ?? '');
  const [editor, setEditor] = useState(() => workspace.file(workspace.view(platform).files[0]?.absolutePath ?? ''));
  const [history, setHistory] = useState<string[]>(() => workspace.commandRecords().map(entry => entry.command));
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>(() => workspace.commandRecords());
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [grade, setGrade] = useState<GradeResult | null>(() => savedGrade(courseId, activityId));
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const terminalContent = useRef<HTMLDivElement>(null);
  const commandDraft = useRef('');
  const commandInput = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const content = terminalContent.current;
    if (content) content.scrollTop = content.scrollHeight;
  }, [transcript, terminalOpen, grade]);

  function selectPlatform(next: Platform) {
    setPlatform(next);
    writePreference('code-practice-platform', next);
    setView(workspace.view(next));
  }

  function selectFile(path: string) {
    setSelectedFile(path);
    setEditor(workspace.file(path));
  }

  function invalidateGrade() {
    setGrade(null);
    setFeedbackOpen(false);
    writePreference(`code-practice-grade:v2:${courseId}:${activityId}`, '');
  }

  function updateEditor(value: string) {
    setEditor(value);
    if (selectedFile) {
      workspace.saveFile(selectedFile, value);
      setView(workspace.view(platform));
      invalidateGrade();
    }
  }

  function run(event?: FormEvent) {
    event?.preventDefault();
    if (!command.trim()) return;
    const cwd = view.cwd;
    const next = workspace.run(command, platform);
    setView(next);
    setTranscript(entries => command.trim() === 'clear' || command.trim() === 'cls' ? [] : [...entries, { command, output: next.output, failed: next.exitCode !== 0, cwd }]);
    setHistory(entries => [...entries, command]);
    setHistoryIndex(-1);
    setCommand('');
    commandDraft.current = '';
    invalidateGrade();
    if (selectedFile) {
      if (workspace.hasFile(selectedFile)) setEditor(workspace.file(selectedFile));
      else { setSelectedFile(''); setEditor(''); }
    }
    commandInput.current?.focus();
  }

  function keyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); run(); return; }
    if (event.ctrlKey && event.key.toLowerCase() === 'c') {
      event.preventDefault(); workspace.cancel(); setCommand(''); setView(workspace.view(platform));
      setTranscript(entries => [...entries, { command: '^C', output: '', failed: false, cwd: view.cwd }]); return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (historyIndex < 0) commandDraft.current = command;
      const next = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setCommand(history[next] ?? '');
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex < 0) return;
      const next = historyIndex + 1;
      setHistoryIndex(next < history.length ? next : -1);
      setCommand(history[next] ?? commandDraft.current);
    }
  }

  function reset() {
    workspace.reset(setup.fixture, setup.prepared);
    setView(workspace.view(platform));
    setSelectedFile('');
    setEditor('');
    setHistory([]);
    setTranscript([]);
    invalidateGrade();
  }

  function checkWork() {
    const snapshot = workspace.snapshot();
    const response = snapshot.files[`${snapshot.repo}/RESPONSE.md`] ?? '';
    const result = gradeActivity(activity, courseId, startingSnapshot, snapshot, workspace.commandRecords(), response);
    setGrade(result);
    setFeedbackOpen(true);
    if (result.passed) {
      writePreference(`code-practice-grade:v2:${courseId}:${activityId}`, JSON.stringify(result));
      onComplete?.(activityId);
    }
  }

  const lineCount = Math.max(1, editor.split('\n').length);
  const language = selectedFile.endsWith('.md') ? 'Markdown' : selectedFile.endsWith('.json') ? 'JSON' : selectedFile.startsWith('.') ? 'Plain text' : 'Text';
  const selectedLabel = selectedFile.split('/').pop() || 'Select a file';

  return <section className="code-workspace" aria-label="Practice workspace">
    <header className="pane-header editor-heading">
      <span>Workspace <span className="workspace-mode">Browser practice</span></span>
      <div className="editor-tools">
        <label className="platform-select"><span className="sr-only">Operating system</span><select value={platform} onChange={event => selectPlatform(event.target.value as Platform)}>{(Object.keys(platformInfo) as Platform[]).map(option => <option key={option} value={option}>{platformInfo[option].label}</option>)}</select></label>
        <button className="files-toggle icon-button" type="button" aria-label={explorerOpen ? 'Hide file explorer' : 'Show file explorer'} aria-expanded={explorerOpen} onClick={() => setExplorerOpen(!explorerOpen)}><span className="panel-icon" aria-hidden="true" /></button>
        <button className="editor-focus icon-button" type="button" aria-label={focused ? 'Restore split workspace' : 'Expand code workspace'} aria-pressed={focused} onClick={() => onFocusChange(!focused)}>{focused ? '↙' : '⤢'}</button>
        <button className="open-tab icon-button" type="button" aria-label="Open this lesson in a new tab" onClick={() => window.open(window.location.href, '_blank', 'noopener,noreferrer')}>↗</button>
      </div>
    </header>

    {grade && feedbackOpen && <FeedbackToast result={grade} onDismiss={() => setFeedbackOpen(false)} />}

    <div className="ide">
      {explorerOpen && <aside className="file-explorer" aria-label="Files">
        <button className="explorer-toggle" type="button" aria-expanded="true" onClick={() => setExplorerOpen(false)}><span aria-hidden="true">⌄</span> EXPLORER</button>
        <div className="folder-label">⌄ {view.cwd.split(/[\\/]/).filter(Boolean).pop() || 'workspace'}</div>
        <div className="file-tree">{view.files.length || workspace.editorFiles().length ? [...view.files, ...workspace.editorFiles()].map(file => <button className={`file ${selectedFile === file.absolutePath ? 'selected' : ''}`} type="button" key={file.absolutePath} onClick={() => selectFile(file.absolutePath)}>
          <span className={`file-type ${file.path.endsWith('.md') ? 'md' : file.path.endsWith('.json') ? 'json' : ''}`}>{file.path.endsWith('.md') ? 'M↓' : file.path.endsWith('.json') ? '{ }' : '•'}</span>{file.path}
        </button>) : <p className="empty-files">No files yet.<br />Try <code>touch README.md</code>.</p>}</div>
      </aside>}

      <div className="editor-column">
        <div className="file-tabs" role="tablist" aria-label="Open files"><button role="tab" aria-selected="true" type="button"><span className={`file-type ${selectedFile.endsWith('.md') ? 'md' : selectedFile.endsWith('.json') ? 'json' : ''}`}>{selectedFile ? '•' : '—'}</span>{selectedLabel}</button></div>
        <div className="editor-breadcrumb">{selectedFile || view.cwd}</div>
        <div className="editor-panel" role="tabpanel">
          <div className="line-numbers" aria-hidden="true">{Array.from({ length: lineCount }, (_, index) => index + 1).join('\n')}</div>
          <textarea aria-label={`File editor, ${selectedLabel}`} disabled={!selectedFile} value={editor} onChange={event => updateEditor(event.target.value)} spellCheck={false} autoCapitalize="off" autoComplete="off" placeholder="Select a file in Explorer, or create one in the terminal." />
        </div>
        <div className="editor-status"><span>{view.saved ? 'Saved locally' : 'Practice fixture'}</span><span>{language}</span><span>UTF-8</span></div>
      </div>
    </div>

    <div className="practice-toolbar">
      {grade?.passed ? <a className="practice-submit" href={nextHref}>{nextLabel}<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg></a> : <button className="practice-submit" type="button" onClick={checkWork}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m9 5 10 7-10 7V5Z" /></svg>Submit</button>}
      <button className="practice-run" type="button" onClick={() => { if (command.trim()) run(); else { setTerminalOpen(true); commandInput.current?.focus(); } }}>Run command</button>
      <a className="practice-skip" href={nextHref}>Skip for now</a>
    </div>

    <section className={`terminal ${terminalOpen ? '' : 'collapsed'}`} aria-labelledby={`terminal-label-${activityId}`}>
      <header className="terminal-header">
        <div><span className="terminal-active" id={`terminal-label-${activityId}`}>Terminal</span><span className="terminal-session">{platformInfo[platform].label}</span></div>
        <div className="terminal-actions"><button type="button" onClick={reset}>Reset</button><button className="terminal-toggle icon-button" type="button" aria-expanded={terminalOpen} aria-label={terminalOpen ? 'Collapse terminal' : 'Expand terminal'} onClick={() => setTerminalOpen(!terminalOpen)}>{terminalOpen ? '−' : '+'}</button></div>
      </header>
      {terminalOpen && <div className="terminal-content" ref={terminalContent}>
        <p className="terminal-note">{setup.prepared ? `Prepared starting state for ${activityId.toUpperCase()}.` : 'Free-practice repository.'} Commands run only inside this browser workspace. Type <code>help</code> for supported commands.</p>
        {!transcript.length && view.output && <pre>{view.output}</pre>}
        {courseId === 'github' && <p className="terminal-note">GitHub tasks use RESPONSE.md for your explanation and external verification. Review checks cannot verify a real pull request or test run.</p>}
        {transcript.map((entry, index) => <div className="terminal-entry" key={`${entry.command}-${index}`}><p><span className="terminal-cwd">{entry.cwd}</span> <span className="prompt-symbol">{platformInfo[platform].prompt}</span> {entry.command}</p>{entry.output && <pre className={entry.failed ? 'terminal-error' : ''}>{entry.output}</pre>}</div>)}
        {view.pending && <p className="terminal-note" role="status">{view.pending}</p>}
        <form className="terminal-input" onSubmit={run}><label htmlFor={`terminal-command-${activityId}`}><span className="terminal-cwd">{view.cwd}</span><span className="prompt-symbol">{platformInfo[platform].prompt}</span><textarea ref={commandInput} rows={Math.min(5, command.split('\n').length)} id={`terminal-command-${activityId}`} value={command} onChange={event => setCommand(event.target.value)} onKeyDown={keyDown} autoComplete="off" spellCheck={false} aria-label="Terminal command" autoFocus /></label><button type="submit">Run</button></form>
      </div>}
    </section>
    <div className="workspace-status"><span><span className="branch-symbol" aria-hidden="true">⑂</span> {view.branch}</span><span>{platformInfo[platform].label} · Local workspace</span></div>
  </section>;
}
