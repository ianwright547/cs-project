import { lazy, Suspense, useEffect, useState } from 'react';
import { TerminalPanel } from './TerminalPanel';
import type { Activity } from '../content/types';
const NativeTerminalPanel = lazy(() => import('./NativeTerminalPanel').then(module => ({ default:module.NativeTerminalPanel })));
export function PracticeWorkspace(props: { activity: Activity; courseId: 'git' | 'github'; focused: boolean; onFocusChange: (value: boolean) => void; onComplete?: (id: string) => void; nextHref: string; nextLabel: string; onAliases: (aliases:Record<string,string>) => void }) {
  const [native, setNative] = useState<boolean | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/terminal/config').then(response => response.ok ? response.json() : {enabled:false}).then(config => { if (!cancelled) setNative(config.enabled === true); }).catch(() => { if (!cancelled) setNative(false); });
    return () => { cancelled = true; };
  }, []);
  if (native === null) return <section className="code-workspace workspace-loading" role="status">Opening workspace…</section>;
  return native ? <Suspense fallback={<section className="code-workspace workspace-loading" role="status">Loading terminal…</section>}><NativeTerminalPanel {...props} onFallback={() => { props.onAliases({}); setNative(false); }} /></Suspense> : <TerminalPanel {...props} />;
}
