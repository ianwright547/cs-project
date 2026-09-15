import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { migrateSavedWork } from './preferences';

let values: Map<string, string>;
beforeEach(() => {
  values = new Map();
  vi.stubGlobal('localStorage', {
    get length() { return values.size; },
    key: (index: number) => [...values.keys()][index] ?? null,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  });
});
afterEach(() => vi.unstubAllGlobals());

it('preserves saved exercises and settings across the rename', () => {
  values.set('threshold-workspace:gp001', '{"files":{"README.md":"my work"}}');
  values.set('threshold-completed:git', '["gp001"]');
  values.set('threshold-grade:git:gp001', '{"passed":true}');
  values.set('threshold-platform', 'linux');
  values.set('threshold.reduced-motion', '1');
  values.set('unrelated', 'keep');
  migrateSavedWork();
  expect(values.get('code-practice-workspace:gp001')).toContain('my work');
  expect(values.get('code-practice-completed:git')).toBe('["gp001"]');
  expect(values.get('code-practice-grade:git:gp001')).toBe('{"passed":true}');
  expect(values.get('code-practice-platform')).toBe('linux');
  expect(values.get('code-practice.reduced-motion')).toBe('1');
  expect(values.get('unrelated')).toBe('keep');
  expect([...values.keys()].some(key => key.startsWith('threshold'))).toBe(false);
  const migrated = new Map(values);
  migrateSavedWork();
  expect(values).toEqual(migrated);
});

it('keeps newer data and does not restore a reset workspace', () => {
  values.set('threshold-workspace:gp001', 'old');
  values.set('code-practice-workspace:gp001', 'new');
  migrateSavedWork();
  expect(values.get('code-practice-workspace:gp001')).toBe('new');
  values.delete('code-practice-workspace:gp001');
  migrateSavedWork();
  expect(values.has('code-practice-workspace:gp001')).toBe(false);
});

it('keeps old data if storage is full', () => {
  values.set('threshold-workspace:gp001', 'work');
  vi.spyOn(localStorage, 'setItem').mockImplementation(() => { throw new Error('Quota exceeded'); });
  expect(() => migrateSavedWork()).not.toThrow();
  expect(values.get('threshold-workspace:gp001')).toBe('work');
});
