export function readPreference(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

export function writePreference(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* Preferences are optional when storage is unavailable. */ }
}

export function applyMotionPreference(reduced: boolean): void {
  document.documentElement.classList.toggle('reduced-motion', reduced);
}

// Keep saved work when upgrading from the previous app name.
export function migrateSavedWork(): void {
  try {
    const prefixes = [
      ['threshold-workspace:', 'code-practice-workspace:'],
      ['threshold-completed:', 'code-practice-completed:'],
      ['threshold-grade:', 'code-practice-grade:'],
      ['threshold-platform', 'code-practice-platform'],
      ['threshold.reduced-motion', 'code-practice.reduced-motion'],
    ];
    const keys = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index));
    for (const key of keys) {
      if (!key) continue;
      const pair = prefixes.find(([old]) => old.endsWith(':') ? key.startsWith(old) : key === old);
      if (!pair) continue;
      const value = localStorage.getItem(key);
      const nextKey = pair[1] + key.slice(pair[0].length);
      if (value !== null && localStorage.getItem(nextKey) === null) localStorage.setItem(nextKey, value);
      localStorage.removeItem(key);
    }
  } catch { /* Storage may be disabled or full. Leave the original data intact on failure. */ }
}
