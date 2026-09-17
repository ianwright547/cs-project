export type Hunk = { start: number; remove: string[]; insert: string[] };
const lines = (text: string) => text.match(/[^\n]*\n|[^\n]+$/g) ?? [];

// Bound the matrix so a large pasted file cannot freeze the page.
export function hunks(before: string, after: string): Hunk[] {
  if (before === after) return [];
  const a = lines(before), b = lines(after);
  if (a.length * b.length > 500_000) return [{ start: 0, remove: a, insert: b }];
  const table = Array.from({ length: a.length + 1 }, () => new Uint32Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
  const result: Hunk[] = [];
  let i = 0, j = 0, current: Hunk | undefined;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) { current = undefined; i++; j++; continue; }
    if (!current) { current = { start: i, remove: [], insert: [] }; result.push(current); }
    if (j < b.length && (i === a.length || table[i][j + 1] > table[i + 1][j])) current.insert.push(b[j++]);
    else current.remove.push(a[i++]);
  }
  return result;
}
export function applyHunks(before: string, selected: Hunk[]) {
  const result = lines(before);
  for (const hunk of [...selected].sort((a, b) => b.start - a.start)) result.splice(hunk.start, hunk.remove.length, ...hunk.insert);
  return result.join('');
}
export function diffText(path: string, before?: string | null, after?: string | null) {
  if (before == null && after == null || before === after) return '';
  return [`diff --git a/${path} b/${path}`, before == null ? '--- /dev/null' : `--- a/${path}`, after == null ? '+++ /dev/null' : `+++ b/${path}`,
    ...hunks(before ?? '', after ?? '').flatMap(hunk => [`@@ -${hunk.start + 1},${hunk.remove.length} +${hunk.start + 1},${hunk.insert.length} @@`, ...hunk.remove.map(line => `-${line.replace(/\n$/, '')}`), ...hunk.insert.map(line => `+${line.replace(/\n$/, '')}`)])].join('\n');
}
export function mergeText(base: string | undefined, ours: string | undefined, theirs: string | undefined): { text?: string; conflict: boolean } {
  if (ours === theirs || theirs === base) return { text: ours, conflict: false };
  if (ours === base) return { text: theirs, conflict: false };
  if (ours !== undefined && theirs !== undefined && base !== undefined) {
    const left = hunks(base, ours), right = hunks(base, theirs);
    const overlap = left.some(a => right.some(b => Math.max(a.start, b.start) <= Math.min(a.start + a.remove.length, b.start + b.remove.length)));
    if (!overlap) return { text: applyHunks(base, [...left, ...right]), conflict: false };
  }
  return { text: `<<<<<<< HEAD\n${ours ?? ''}${ours && !ours.endsWith('\n') ? '\n' : ''}=======\n${theirs ?? ''}${theirs && !theirs.endsWith('\n') ? '\n' : ''}>>>>>>> incoming\n`, conflict: true };
}
