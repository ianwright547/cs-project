import type { GradeResult } from './grader';

export function FeedbackToast({ result, onDismiss }: { result: GradeResult; onDismiss: () => void }) {
  const failed = result.checks.filter(check => !check.passed);
  const first = failed[0];
  const hint = first?.id.startsWith('operation-') ? `Try ${first.label.replace(/^Use /, '')}, then submit again.` : first?.expected;
  return <aside className={`practice-feedback ${result.passed ? 'success' : ''}`} aria-label="Submission feedback">
    <div role={result.passed ? 'status' : 'alert'}>
      <strong>{result.passed ? 'You got it.' : first?.label ?? 'One more step'}</strong>
      <p>{result.passed ? 'Your work passed. Continue when you’re ready.' : hint}</p>
    </div>
    <button className="feedback-dismiss" type="button" aria-label="Dismiss feedback" onClick={onDismiss}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg></button>
    {failed.length > 1 && <details><summary>{failed.length - 1} more things to check</summary><ul>{failed.slice(1).map(check => <li key={check.id}><strong>{check.label}</strong><span>{check.expected}</span></li>)}</ul></details>}
  </aside>;
}
