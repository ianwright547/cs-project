"""Explicit Docker integration checks. Run after building code-practice-shell:local."""
import base64
import importlib.util
import json
import os
from pathlib import Path
import secrets
import time

import pytest

os.environ.setdefault('SANDBOX_SECRET', secrets.token_hex(32))
spec = importlib.util.spec_from_file_location('practice_controller', Path(__file__).with_name('server.py'))
controller = importlib.util.module_from_spec(spec)
spec.loader.exec_module(controller)
fixtures = json.loads((Path(__file__).resolve().parents[1] / 'frontend/dist/practice-fixtures.json').read_text())
owner = '1' * 48

def execute(session, command, timeout=20, last_command=None):
    current = controller.sessions[session['id']]
    before = len(controller.snapshot(current)['records'])
    controller.dispatch({'action':'io', 'id':session['id'], 'owner':owner, 'input':base64.b64encode((command + '\n').encode()).decode(), 'cursor':0})
    end = time.monotonic() + timeout
    while time.monotonic() < end:
        controller.collect(current)
        result = controller.snapshot(current)
        if len(result['records']) > before and result['records'][-1]['command'] == (last_command or command):
            return result
        time.sleep(.1)
    raise AssertionError(f'Command did not return to a prompt: {command}; records={result["records"][-5:]}; output={current["output"][-1500:]!r}')

@pytest.fixture
def session():
    created = []
    def start(lesson):
        result = controller.create(owner, lesson, fixtures[lesson])
        created.append(result['id'])
        time.sleep(.2)
        return result
    yield start
    for session_id in created:
        controller.remove(session_id)

def test_real_shell_pipes_exit_codes_files_and_isolation(session):
    active = session('gp005')
    state = execute(active, 'mkdir -p app/docs/guides')
    state = execute(active, 'printf "one\\ntwo\\n" | grep two > app/docs/guides/result.txt', last_command='grep two > app/docs/guides/result.txt')
    assert state['files']['/workspace/app/docs/guides/result.txt'] == 'two\n'
    assert not state['records'][-1]['failed']
    state = execute(active, 'false')
    assert state['records'][-1]['failed']
    state = execute(active, 'pwd')
    assert not state['records'][-1]['failed']
    container = controller.sessions[active['id']]['container']
    config = json.loads(controller.docker('inspect', container))[0]
    assert config['HostConfig']['NetworkMode'] == 'none'
    assert config['HostConfig']['ReadonlyRootfs']
    assert not config['Mounts']
    assert config['HostConfig']['Memory'] == 256 * 1024 * 1024
    assert config['Config']['User'] == '1001:1001'
    assert not any('SECRET=' in value or value.startswith('AWS_') for value in config['Config']['Env'])
    with pytest.raises(LookupError):
        controller.dispatch({'action':'snapshot','id':active['id'],'owner':'2'*48})

def test_real_git_restore_staged_snapshot_and_grader_evidence(session):
    active = session('gp039')
    state = execute(active, 'git restore --staged settings.json')
    assert list(state['index']) == ['/workspace/practice/README.md']
    assert state['files']['/workspace/practice/settings.json'] == '{"timeout":45}\n'
    for command in ['git diff --staged', 'git commit -m "Clarify README instructions"', 'git status', 'git diff -- settings.json']:
        state = execute(active, command)
        assert not state['records'][-1]['failed'], command
    head = next(commit for commit in state['commits'] if commit['id'] == state['head'])
    assert head['files']['/workspace/practice/settings.json'] == '{"timeout":30}\n'
    assert head['files']['/workspace/practice/README.md'] == 'Install dependencies.\n'
    Path('/tmp/practice-native-grade.json').write_text(json.dumps({'id':'gp039','before':active['initial'],'after':state,'commands':state['records']}))

def test_real_branch_conflict_resolution_and_recovery_objects(session):
    active = session('c04')
    state = execute(active, 'git merge docs/tests')
    assert state['conflicts'] == ['/workspace/practice/README.md']
    controller.dispatch({'action':'file', 'owner':owner, 'id':active['id'], 'path':'/workspace/practice/README.md', 'content':'Install dependencies, then run tests.\n'})
    execute(active, 'git add README.md')
    state = execute(active, 'git commit -m "Combine instructions"')
    head = next(commit for commit in state['commits'] if commit['id'] == state['head'])
    assert len(head['parents']) == 2
    assert not state['conflicts']
    recovered = session('c05')
    oid = recovered['initial']['aliases']['c30d333']
    state = execute(recovered, f'git switch -c recovered-guide {oid}')
    assert state['files']['/workspace/practice/guide.txt'] == 'Install dependencies.\nRun tests.\n'
    assert state['branchTips']['main'] == recovered['initial']['aliases']['a10b111']
