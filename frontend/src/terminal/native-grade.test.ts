import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import curriculum from '../../../git-github-curriculum.md?raw';
import { gradeActivity } from './grader';
import type { Activity } from '../content/types';

// Produced by the Docker integration test, never a fabricated Git result.
const artifact = process.env.NATIVE_GRADE_RESULT;
const workflows = process.env.NATIVE_WORKFLOW_RESULTS;
describe.skipIf(!workflows || !existsSync(workflows))('authored workflows with real Git', () => {
  const values = workflows && existsSync(workflows) ? JSON.parse(readFileSync(workflows, 'utf8')) : [];
  for (const value of values) it(value.activity.id, () => {
    const result = gradeActivity(value.activity, 'git', value.before, value.after, value.commands, '');
    expect(result.checks.filter(check => !check.passed)).toEqual([]);
    expect(gradeActivity(value.activity, 'git', value.before, value.before, [], '').passed).toBe(false);
  });
});
describe.skipIf(!artifact || !existsSync(artifact))('grading actual Git state', () => {
  it('accepts the real unstage-and-commit exercise and rejects command-only claims', () => {
    const value = JSON.parse(readFileSync(artifact!, 'utf8'));
    const body = curriculum.split(`<a id="${value.id}"></a>`)[1].split('\n<a id=')[0];
    const sections = body.split(/^\*\*([^\n]+)\*\*\s*$/m);
    const activity: Activity = { id:value.id, title:'Unstage without losing your edit', type:'practice', sections:Array.from({length:Math.floor(sections.length/2)}, (_, i) => ({title:sections[i*2+1],body:sections[i*2+2].trim()})) };
    const result = gradeActivity(activity, 'git', value.before, value.after, value.commands, '');
    expect(result.checks.filter(check => !check.passed)).toEqual([]);
    expect(gradeActivity(activity, 'git', value.before, value.before, [], 'git restore --staged git diff git commit git status').passed).toBe(false);
    expect(gradeActivity(activity, 'git', value.before, value.before, value.commands, '').passed).toBe(false);
  });
});
