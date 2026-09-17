import { readFileSync, writeFileSync } from 'node:fs';
import { fixtureFor } from '../src/terminal/fixtures.ts';
const source = readFileSync(new URL('../../git-github-curriculum.md', import.meta.url), 'utf8');
const ids = [...source.matchAll(/<a id="((?:gp|hp|c)\d+)">/g)].map(match => match[1]);
writeFileSync(new URL('../dist/practice-fixtures.json', import.meta.url), JSON.stringify(Object.fromEntries(ids.map(id => [id, fixtureFor(id).fixture]))));
