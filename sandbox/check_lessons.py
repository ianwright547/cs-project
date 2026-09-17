"""Exercise authored Git workflows against disposable real Bash/Git containers.

Run with the sandbox image built and frontend fixtures exported. This is an
integration check, not the code used to construct a student's starting state.
"""
import json
from pathlib import Path
import re
import sys
import time

from test_integration import controller, execute, fixtures, owner

root = Path(__file__).resolve().parents[1]
curriculum = (root / 'git-github-curriculum.md').read_text()
only = set(sys.argv[1:])
artifact = Path('/tmp/practice-all-native-grades.json')
results = [value for value in json.loads(artifact.read_text()) if value['activity']['id'] not in only] if only and artifact.exists() else []
failures = []
for match in re.finditer(r'<a id="((?:gp\d+|c0[1-5]))"></a>\s*### ([^\n]+)\n([\s\S]*?)(?=\n<a id=|$)', curriculum):
    lesson, title, body = match.groups()
    if only and lesson not in only:
        continue
    parts = re.split(r'^\*\*([^\n]+)\*\*\s*$', body, flags=re.M)
    sections = [{'title':parts[i], 'body':parts[i+1].strip()} for i in range(1, len(parts)-1, 2)]
    solution = next(section['body'] for section in sections if 'author answer' in section['title'].lower())
    active = None
    try:
        active = controller.create(owner, lesson, fixtures[lesson])
        container = controller.sessions[active['id']]['container']
        execute(active, 'export GIT_PAGER=cat GIT_EDITOR=true')
        # Accept default merge/revert messages without blocking in a text editor.
        controller.docker('exec', container, 'git', 'config', '--global', 'core.editor', 'true')
        controller.docker('exec', container, 'git', 'config', '--global', 'core.pager', 'cat')
        sequence_editor = '#!/bin/sh\nsed -i "2,$ s/^pick /squash /" "$1"\n'
        controller.docker('exec', '-i', container, 'sh', '-c', 'cat > /tmp/squash-editor; chmod +x /tmp/squash-editor', data=sequence_editor.encode())
        controller.docker('exec', container, 'git', 'config', '--global', 'sequence.editor', 'sh /tmp/squash-editor')
        def edit(path, content):
            controller.dispatch({'action':'file', 'owner':owner, 'id':active['id'], 'path':'/workspace/practice/' + path, 'content':content})
        if lesson == 'gp034': edit('.gitignore', 'node_modules/\n.env\n')
        if lesson == 'gp046': edit('README.md', 'Install dependencies, then run tests.\n')
        if lesson == 'gp059': edit('help.txt', 'Install dependencies.\nRun tests.\n')
        state = active['initial']
        for command in solution.splitlines():
            if not re.match(r'^(pwd|ls|cd|mkdir|rmdir|touch|echo|cat|cp|mv|rm|git)\s?', command):
                continue
            command = command.replace('<actual-B-id>', 'b20c222').replace('<actual-C-id>', 'c30d333')
            for alias, oid in active['initial']['aliases'].items():
                command = command.replace(alias, oid)
            if command.startswith('git add -p'):
                # Git initially combines nearby changes. Split the hunk before
                # selecting each logical change, just as a learner can with s.
                answers = {'gp031':'s\ny\nn\n', 'gp032':'s\nn\ny\n', 'gp033':'s\ny\nn\ny\n'}[lesson]
                state = execute(active, command + '\n' + answers.rstrip(), last_command=command)
            else:
                state = execute(active, command)
            if lesson == 'c04' and command == 'git merge docs/tests':
                assert state['records'][-1]['failed']
                edit('README.md', 'Install dependencies, then run tests.\n')
                continue
            assert not state['records'][-1]['failed'], command + ': ' + repr(controller.sessions[active['id']]['output'][-1800:])
            if lesson == 'gp043' and command.startswith('git switch'):
                edit('README.md', '# Sample project\nRun npm test before submitting changes.\n')
        results.append({'activity':{'id':lesson,'title':title,'type':'practice','sections':sections}, 'before':active['initial'], 'after':state, 'commands':state['records']})
        print(lesson + ' completed', flush=True)
    except Exception as exc:
        failures.append(lesson)
        print(lesson + ': ' + str(exc), flush=True)
    finally:
        if active:
            controller.remove(active['id'])
        Path('/tmp/practice-all-native-grades.json').write_text(json.dumps(results))
print(f'{len(results)} workflows completed; failures: {failures}', flush=True)
if failures:
    raise SystemExit(1)
