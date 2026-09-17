"""Create authored exercise fixtures using Git itself, never a model solution."""
import json
import os
from pathlib import Path
import subprocess
import sys

fixture = json.load(sys.stdin)
os.environ.update(GIT_AUTHOR_NAME='Practice Learner', GIT_AUTHOR_EMAIL='learner@example.test', GIT_COMMITTER_NAME='Practice Learner', GIT_COMMITTER_EMAIL='learner@example.test', GIT_AUTHOR_DATE='2026-01-01T12:00:00Z', GIT_COMMITTER_DATE='2026-01-01T12:00:00Z')
cwd = Path(fixture['cwd'])
repo = Path(fixture['repo']) if fixture.get('repo') else None

def safe_path(value, base=cwd):
    path = Path(os.path.normpath(str(base / value)))
    if not str(path).startswith(('/workspace/', '/training/')) and str(path) not in ('/workspace', '/training'):
        raise ValueError('Fixture path outside practice folders')
    return path

def write(value, content, base=cwd):
    path = safe_path(value, base)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)

def git(*args, data=None, directory=None, env=None):
    return subprocess.run(['/usr/bin/git', '-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', *args], cwd=directory or repo, input=data, text=True, capture_output=True, check=True, timeout=10, env=env).stdout.strip()

cwd.mkdir(parents=True, exist_ok=True)
for directory in fixture.get('directories', []):
    safe_path(directory).mkdir(parents=True, exist_ok=True)
for name, text in fixture.get('files', {}).items():
    write(name, text)
aliases = {}
commits = fixture.get('commits', [])
branch_setup = next((args for args in fixture.get('setup', []) if args[0] in ('checkout', 'switch')), None)
branch = fixture.get('branch') or (branch_setup[2] if branch_setup else 'main')
tips = fixture.get('branchTips')
if repo:
    repo.mkdir(parents=True, exist_ok=True)
    git('init', '-b', 'main')
    git('config', 'user.name', 'Practice Learner')
    git('config', 'user.email', 'learner@example.test')
    git('config', 'init.defaultBranch', 'main')
    git('config', 'advice.detachedHead', 'false')
    for i, commit in enumerate(commits):
        alias = commit.get('id', f'{i+1:07x}')
        parents = commit.get('parents', [list(aliases)[-1]] if aliases else [])
        index_env = {**os.environ, 'GIT_INDEX_FILE': '/tmp/fixture-index'}
        git('read-tree', '--empty', env=index_env)
        for name, text in commit['files'].items():
            path = safe_path(name, repo).relative_to(repo)
            blob = git('hash-object', '-w', '--stdin', data=text)
            git('update-index', '--add', '--cacheinfo', '100644', blob, str(path), env=index_env)
        tree = git('write-tree', env=index_env)
        flags = [value for parent in parents for value in ['-p', aliases[parent]]]
        aliases[alias] = git('commit-tree', tree, *flags, data=commit['message'] + '\n')
    if not tips:
        tips = {name: list(aliases)[-1] if aliases else '' for name in set(fixture.get('branches', ['main', branch]) + [branch])}
    for name, alias in tips.items():
        if alias and not name.startswith('(detached'):
            git('update-ref', 'refs/heads/' + name, aliases[alias])
    if branch.startswith('(detached'):
        git('checkout', '--detach', aliases[tips[branch]])
    elif aliases:
        git('checkout', '--force', branch)
    else:
        git('symbolic-ref', 'HEAD', 'refs/heads/' + branch)
    # Retain real objects mentioned by the recovery lessons in the actual reflog.
    if fixture.get('reflog'):
        for line in reversed(fixture['reflog']):
            alias, _, description = line.partition(' ')
            if alias in aliases:
                git('update-ref', '--create-reflog', '-m', description, 'HEAD', aliases[alias])
        git('reset', '--hard', aliases[tips[branch]])
    for tag in fixture.get('tags', []):
        git('tag', tag)
    if fixture.get('merge'):
        source = aliases[fixture['merge']['source']]
        subprocess.run(['/usr/bin/git', 'merge', '--no-edit', source], cwd=repo, capture_output=True, timeout=10)
    for name, text in fixture.get('staged', {}).items():
        write(name, text, repo)
        git('add', '--', str(safe_path(name, repo).relative_to(repo)))
    for name, text in fixture.get('working', {}).items():
        write(name, text, repo)

# Every learner has a private, local bare training remote; fetch and push use Git.
remote = Path('/training/sample-app.git')
if repo and aliases:
    git('init', '--bare', str(remote))
    git('push', str(remote), '--all')
    for alias, oid in aliases.items():
        # Transfer dangling objects too without making extra branches visible locally.
        git('push', str(remote), f'{oid}:refs/heads/fixture-{alias}')
    remote_tips = fixture.get('remoteTips', {'origin/main': tips.get('main', tips.get(branch, ''))})
    for name, alias in remote_tips.items():
        if alias:
            git('update-ref', 'refs/heads/' + name.split('/', 1)[1], aliases[alias], directory=remote)
    for alias in aliases:
        git('update-ref', '-d', 'refs/heads/fixture-' + alias, directory=remote)
    git('symbolic-ref', 'HEAD', 'refs/heads/main', directory=remote)
    git('remote', 'add', 'origin', str(remote))
else:
    initial = Path('/tmp/remote-source')
    initial.mkdir(exist_ok=True)
    git('init', '-b', 'main', directory=initial)
    (initial / 'README.md').write_text('# Sample project\n')
    git('add', 'README.md', directory=initial)
    git('commit', '-m', 'Initial project', directory=initial)
    git('clone', '--bare', str(initial), str(remote), directory=initial)
Path('/home/learner/.practice-cwd').write_text(str(cwd))
Path('/home/learner/.practice-meta').write_text(json.dumps({'repo': str(repo) if repo else None, 'aliases': aliases}))
print(json.dumps({'cwd': str(cwd), 'aliases': aliases}))
