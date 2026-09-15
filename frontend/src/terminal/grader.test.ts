import { describe, expect, it } from 'vitest';
import type { Activity } from '../content/types';
import type { WorkspaceSnapshot } from './types';
import { gradeActivity, hasGradingPlan } from './grader';
import { fixtureFor, fixtures } from './fixtures';
import curriculum from '../../../git-github-curriculum.md?raw';

const before: WorkspaceSnapshot = { cwd: '/workspace/practice', files: { '/workspace/practice/README.md': 'old\n' }, directories: ['/workspace', '/workspace/practice'], repo: '/workspace/practice', tracked: ['/workspace/practice/README.md'], staged: [], index: {}, commits: [{ id: 'a1', message: 'Initial', files: { '/workspace/practice/README.md': 'old\n' } }], head: 'a1', branch: 'main', branches: ['main'], remotes: { origin: '/training/sample-app.git' }, tags: [], stashCount: 0 };
const gitActivity: Activity = { id: 'gp-test', title: 'Commit a change', type: 'practice', sections: [
  { title: 'Instructions', body: '1. Inspect the change.\n2. Commit it.' },
  { title: 'Completion criteria', body: 'The new commit is recorded.' },
  { title: 'Author answer / one acceptable approach', body: '```bash\ngit diff\ngit add README.md\ngit commit -m "Update README"\ngit status\n```' },
] };

const practicalRecords = [...curriculum.matchAll(/<a id="([^"]+)"><\/a>\s*### ([^\n]+)\n([\s\S]*?)(?=\n<a id=|$)/g)]
  .filter(match => /^(gp|hp|c\d)/.test(match[1] ?? '') && !/Mini lesson:/.test(match[2] ?? ''))
  .map(match => {
    const body = match[3] ?? '';
    const sections = [
      { title: 'Completion criteria', body: body.includes('**Completion criteria') ? 'Authored criteria' : '' },
      { title: 'Author answer / one acceptable approach', body: body.includes('**Author answer / one acceptable approach**') ? body : '' },
    ].filter(section => section.body);
    return { id: match[1] ?? '', title: match[2] ?? '', type: (match[1] ?? '').startsWith('c') ? 'checkpoint' as const : 'practice' as const, sections };
  });

describe('practice grader', () => {
  it('has a grading plan for every authored practice and checkpoint', () => {
    expect(practicalRecords).toHaveLength(98);
    expect(practicalRecords.filter(activity => !hasGradingPlan(activity))).toEqual([]);
  });

  it('provides a prepared workspace for every practical activity', () => {
    const gitIds = practicalRecords.filter(activity => activity.id.startsWith('gp') || /^c0[1-5]$/.test(activity.id)).map(activity => activity.id);
    expect(gitIds.filter(id => !fixtures[id])).toEqual([]);
    for (const activity of practicalRecords.filter(item => item.id.startsWith('hp') || /^c0[6-8]$/.test(item.id))) {
      const setup = fixtureFor(activity.id);
      expect(setup.prepared).toBe(true);
      expect(Object.keys(setup.fixture.files ?? {}).some(path => path.endsWith('RESPONSE.md'))).toBe(true);
    }
  });

  it('creates deterministic checks for authored practical work', () => {
    expect(hasGradingPlan(gitActivity)).toBe(true);
    expect(gradeActivity(gitActivity, 'git', before, before, [], '').passed).toBe(false);
  });

  it('passes successful commands backed by changed repository state', () => {
    const after: WorkspaceSnapshot = { ...before, files: { '/workspace/practice/README.md': 'new\n' }, commits: [...before.commits, { id: 'b2', message: 'Update README', files: { '/workspace/practice/README.md': 'new\n' } }] };
    const commands = ['git diff', 'git add README.md', 'git commit -m "Update README"', 'git status'].map(command => ({ command, failed: false }));
    const result = gradeActivity(gitActivity, 'git', before, after, commands, '');
    expect(result.passed).toBe(true);
    expect(result.checks.every(check => check.passed)).toBe(true);
  });

  it('requires a concrete written response for GitHub interface work', () => {
    const activity: Activity = { id: 'hp-test', title: 'Review a pull request', type: 'practice', sections: [
      { title: 'Completion criteria', body: 'The pull request review identifies the required check on main.' },
      { title: 'Author answer / one acceptable approach', body: 'Request the correction and wait for the check.' },
    ] };
    const response = 'The pull request targets main. I would request the correction, then wait for the required check before review approval.';
    expect(gradeActivity(activity, 'github', before, before, [], response).passed).toBe(true);
  });
});
