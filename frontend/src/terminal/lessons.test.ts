import { beforeEach, describe, expect, it } from 'vitest';
import curriculum from '../../../git-github-curriculum.md?raw';
import type { Activity } from '../content/types';
import { fixtureFor } from './fixtures';
import { initialSnapshotFor, Workspace } from './workspace';
import { gradeActivity } from './grader';

const storage = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value), removeItem: (key: string) => storage.delete(key) } });
const activities: Activity[] = [...curriculum.matchAll(/<a id="([^"]+)"><\/a>\s*### ([^\n]+)\n([\s\S]*?)(?=\n<a id=|$)/g)]
  .filter(match => /^(gp\d+|c0[1-5])$/.test(match[1]))
  .map(match => {
    const parts = match[3].split(/^\*\*([^\n]+)\*\*\s*$/m);
    return { id: match[1], title: match[2], type: match[1].startsWith('c') ? 'checkpoint' : 'practice', sections: Array.from({ length: Math.floor(parts.length / 2) }, (_, i) => ({ title: parts[i * 2 + 1], body: parts[i * 2 + 2].trim() })) };
  });

describe('authored Git lesson workflows', () => {
  beforeEach(() => storage.clear());
  it('covers every Git practice problem and checkpoint', () => expect(activities).toHaveLength(70));
  for (const activity of activities) it(`${activity.id}: ${activity.title}`, () => {
    const setup = fixtureFor(activity.id), workspace = new Workspace(activity.id, setup.fixture, true);
    const before = initialSnapshotFor(activity.id, setup.fixture, true);
    const solution = activity.sections!.find(section => /author answer/i.test(section.title))!.body;
    const commands = solution.split('\n').filter(line => /^(pwd|ls|cd|mkdir|rmdir|touch|echo|cat|cp|mv|rm|git)\s?/.test(line));
    expect(gradeActivity(activity, 'git', before, before, [], '').passed).toBe(false);
    if (activity.id === 'gp034') workspace.saveFile('.gitignore', 'node_modules/\n.env\n');
    if (activity.id === 'gp046') workspace.saveFile('README.md', 'Install dependencies, then run tests.\n');
    if (activity.id === 'gp059') workspace.saveFile('help.txt', 'Install dependencies.\nRun tests.\n');
    for (let command of commands) {
      command = command.replace('<actual-B-id>', 'b20c222').replace('<actual-C-id>', 'c30d333');
      const result = workspace.run(command, 'linux');
      if (activity.id === 'c04' && command === 'git merge docs/tests') {
        expect(result.exitCode).toBe(1); expect(result.output).toContain('CONFLICT');
        workspace.saveFile('README.md', 'Install dependencies, then run tests.\n'); continue;
      }
      expect(result.exitCode, `${command}: ${result.output}`).toBe(0);
      if (activity.id === 'gp043' && command.startsWith('git switch')) workspace.saveFile('README.md', '# Sample project\nRun npm test before submitting changes.\n');
      if (command.startsWith('git add -p')) {
        const answers = activity.id === 'gp031' ? ['y', 'n'] : activity.id === 'gp032' ? ['n', 'y'] : ['y', 'n', 'y'];
        for (const answer of answers) expect(workspace.run(answer, 'linux').exitCode).toBe(0);
        expect(workspace.view('linux').pending).toBeUndefined();
      }
      if (command.startsWith('git rebase -i')) {
        const path = `${workspace.snapshot().repo}/.git/rebase-todo`;
        workspace.saveFile(path, workspace.file(path).split('\n').map((line, i) => i ? line.replace(/^pick /, 'squash ') : line).join('\n'));
        const result = workspace.run('git rebase --continue', 'linux');
        expect(result.exitCode, result.output).toBe(0);
      }
    }
    const grade = gradeActivity(activity, 'git', before, workspace.snapshot(), workspace.commandRecords(), '');
    expect(grade.checks.filter(check => !check.passed), JSON.stringify(grade.checks.filter(check => !check.passed))).toEqual([]);
  });
});
