import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import type { Activity } from '../content/types';
import type { Platform } from './types';
import { fixtureFor } from './fixtures';
import { gradeActivity, type GradeResult } from './grader';
import { initialSnapshotFor, Workspace } from './workspace';
import { readPreference, writePreference } from '../preferences';

const platformInfo: Record<Platform, { label: string; prompt: string }> = {
  mac: { label: 'macOS', prompt: '$' },
  linux: { label: 'Linux', prompt: '$' },
  windows: { label: 'Windows · Git Bash', prompt: '$' },
};

type TranscriptEntry = { command: string; output: string; failed: boolean; cwd: string };

function savedGrade(courseId: string, activityId: string): GradeResult | null {
  try {
    const value = localStorage.getItem(`code-practice-grade:${courseId}:${activityId}`);
    return value ? JSON.parse(value) as GradeResult : null;
  } catch {
    return null;
  }
}

export function TerminalPanel({ activity, courseId, focused, onFocusChange, onComplete }: {
  activity: Activity; courseId: 'git' | 'github'; focused: boolean; onFocusChange: (focused: boolean) => void; onComplete?: (activityId: string) => void;
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
  const [selectedFile, setSelectedFile] = useState('');
  const [editor, setEditor] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [grade, setGrade] = useState<GradeResult | null>(() => savedGrade(courseId, activityId));
  const terminalContent = useRef<HTMLDivElement>(null);
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
    const normalized = path.replace(/^C:\\/, '/').split('\\').join('/');
    setSelectedFile(normalized);
    setEditor(workspace.file(normalized));
  }

  function updateEditor(value: string) {
    setEditor(value);
    if (selectedFile) {
      workspace.saveFile(selectedFile, value);
      setView(workspace.view(platform));
      setGrade(null);
    }
  }

  function run(event?: FormEvent) {
    event?.preventDefault();
    if (!command.trim()) return;
    const cwd = view.cwd;
    const next = workspace.run(command, platform);
    setView(next);
    setTranscript(entries => [...entries, { command, output: next.output, failed: next.exitCode !== 0, cwd }]);
    setHistory(entries => [...entries, command]);
    setHistoryIndex(-1);
    setCommand('');
    setGrade(null);
  }

  function keyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const next = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setCommand(history[next] ?? '');
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = historyIndex + 1;
      setHistoryIndex(next);
      setCommand(history[next] ?? '');
    }
  }

  function reset() {
    workspace.reset(setup.fixture, setup.prepared);
    setView(workspace.view(platform));
    setSelectedFile('');
    setEditor('');
    setHistory([]);
    setTranscript([]);
    setGrade(null);
  }

  function checkWork() {
    const snapshot = workspace.snapshot();
    const response = Object.entries(snapshot.files).find(([path]) => path.endsWith('/RESPONSE.md'))?.[1] ?? '';
    const result = gradeActivity(activity, courseId, startingSnapshot, snapshot, transcript, response);
    setGrade(result);
    if (result.passed) {
      writePreference(`code-practice-grade:${courseId}:${activityId}`, JSON.stringify(result));
      onComplete?.(activityId);
    }
  }

  const lineCount = Math.max(1, editor.split('\n').length);
  const language = selectedFile.endsWith('.md') ? 'Markdown' : selectedFile.endsWith('.json') ? 'JSON' : selectedFile.startsWith('.') ? 'Plain text' : 'Text';
  const selectedLabel = selectedFile.split('/').pop() || 'Select a file';

  return <section className="code-workspace" aria-label="Practice workspace">
    <header className="pane-header editor-heading">
      <span>Workspace <span className="workspace-mode">Local practice</span></span>
      <div className="editor-tools">
        <label className="platform-select"><span className="sr-only">Operating system</span><select value={platform} onChange={event => selectPlatform(event.target.value as Platform)}>{(Object.keys(platformInfo) as Platform[]).map(option => <option key={option} value={option}>{platformInfo[option].label}</option>)}</select></label>
        <button className="check-work" type="button" onClick={checkWork}>✓ Check work</button>
        <button className="files-toggle icon-button" type="button" aria-label={explorerOpen ? 'Hide file explorer' : 'Show file explorer'} aria-expanded={explorerOpen} onClick={() => setExplorerOpen(!explorerOpen)}><span className="panel-icon" aria-hidden="true" /></button>
        <button className="editor-focus icon-button" type="button" aria-label={focused ? 'Restore split workspace' : 'Expand code workspace'} aria-pressed={focused} onClick={() => onFocusChange(!focused)}>{focused ? '↙' : '⤢'}</button>
        <button className="open-tab icon-button" type="button" aria-label="Open this lesson in a new tab" onClick={() => window.open(window.location.href, '_blank', 'noopener,noreferrer')}>↗</button>
      </div>
    </header>

    {grade && <section className={`grader-panel ${grade.passed ? 'passed' : 'needs-work'}`} aria-live="polite">
      <header><strong>{grade.passed ? 'Problem complete' : 'Keep working'}</strong><span>{grade.checks.filter(check => check.passed).length} / {grade.checks.length} checks passed</span><button type="button" aria-label="Close grading results" onClick={() => setGrade(null)}>×</button></header>
      <ul>{grade.checks.map(check => <li key={check.id} className={check.passed ? 'passed' : ''}><span aria-hidden="true">{check.passed ? '✓' : '○'}</span><div><strong>{check.label}</strong><small>Expected: {check.expected}</small><small>Actual: {check.actual}</small></div></li>)}</ul>
    </section>}

    <div className="ide">
      {explorerOpen && <aside className="file-explorer" aria-label="Files">
        <button className="explorer-toggle" type="button" aria-expanded="true" onClick={() => setExplorerOpen(false)}><span aria-hidden="true">⌄</span> EXPLORER</button>
        <div className="folder-label">⌄ {view.cwd.split(/[\\/]/).filter(Boolean).pop() || 'workspace'}</div>
        <div className="file-tree">{view.files.length ? view.files.map(file => <button className={`file ${selectedFile === file.path.replace(/^C:\\/, '/').split('\\').join('/') ? 'selected' : ''}`} type="button" key={file.path} onClick={() => selectFile(file.path)}>
          <span className={`file-type ${file.path.endsWith('.md') ? 'md' : file.path.endsWith('.json') ? 'json' : ''}`}>{file.path.endsWith('.md') ? 'M↓' : file.path.endsWith('.json') ? '{ }' : '•'}</span>{file.path}
        </button>) : <p className="empty-files">No files yet.<br />Try <code>touch README.md</code>.</p>}</div>
      </aside>}

      <div className="editor-column">
        <div className="file-tabs" role="tablist" aria-label="Open files"><button role="tab" aria-selected="true" type="button"><span className={`file-type ${selectedFile.endsWith('.md') ? 'md' : selectedFile.endsWith('.json') ? 'json' : ''}`}>{selectedFile ? '•' : '—'}</span>{selectedLabel}</button></div>
        <div className="editor-breadcrumb">{view.cwd} {selectedFile && <><span>›</span> {selectedFile}</>}</div>
        <div className="editor-panel" role="tabpanel">
          <div className="line-numbers" aria-hidden="true">{Array.from({ length: lineCount }, (_, index) => index + 1).join('\n')}</div>
          <textarea aria-label={`File editor, ${selectedLabel}`} disabled={!selectedFile} value={editor} onChange={event => updateEditor(event.target.value)} spellCheck={false} autoCapitalize="off" autoComplete="off" placeholder="Select a file in Explorer, or create one in the terminal." />
        </div>
        <div className="editor-status"><span>{view.saved ? 'Saved locally' : 'Practice fixture'}</span><span>{language}</span><span>UTF-8</span></div>
      </div>
    </div>

    <section className={`terminal ${terminalOpen ? '' : 'collapsed'}`} aria-labelledby={`terminal-label-${activityId}`}>
      <header className="terminal-header">
        <div><span className="terminal-active" id={`terminal-label-${activityId}`}>Terminal</span><span className="terminal-session">{platformInfo[platform].label}</span></div>
        <div className="terminal-actions"><button type="button" onClick={reset}>Reset</button><button className="terminal-toggle icon-button" type="button" aria-expanded={terminalOpen} aria-label={terminalOpen ? 'Collapse terminal' : 'Expand terminal'} onClick={() => setTerminalOpen(!terminalOpen)}>{terminalOpen ? '−' : '+'}</button></div>
      </header>
      {terminalOpen && <div className="terminal-content" ref={terminalContent}>
        <p className="terminal-note">{setup.prepared ? `Prepared starting state for ${activityId.toUpperCase()}.` : 'Free-practice repository.'} Commands run only inside this browser workspace.</p>
        {transcript.map((entry, index) => <div className="terminal-entry" key={`${entry.command}-${index}`}><p><span className="terminal-cwd">{entry.cwd}</span> <span className="prompt-symbol">{platformInfo[platform].prompt}</span> {entry.command}</p>{entry.output && <pre className={entry.failed ? 'terminal-error' : ''}>{entry.output}</pre>}</div>)}
        <form className="terminal-input" onSubmit={run}><label htmlFor={`terminal-command-${activityId}`}><span className="terminal-cwd">{view.cwd}</span><span className="prompt-symbol">{platformInfo[platform].prompt}</span><input id={`terminal-command-${activityId}`} value={command} onChange={event => setCommand(event.target.value)} onKeyDown={keyDown} autoComplete="off" spellCheck={false} aria-label="Terminal command" autoFocus /></label><button type="submit">Run</button></form>
      </div>}
    </section>
    <div className="workspace-status"><span><span className="branch-symbol" aria-hidden="true">⑂</span> {view.branch}</span><span>{platformInfo[platform].label} · Local workspace</span></div>
  </section>;
}
