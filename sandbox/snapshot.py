"""Read actual files, the index, refs, and commit objects for the course grader."""
import json
import os
from pathlib import Path
import re
import stat
import subprocess

root = Path('/workspace')
meta = json.loads(Path('/home/learner/.practice-meta').read_text())
cwd = Path('/home/learner/.practice-cwd').read_text()[:1024]
if not cwd.startswith('/'):
    cwd = '/workspace'
files = {}
directories = ['/workspace']
repositories = []
total = 0
for folder, children, names in os.walk(root, followlinks=False):
    if len(files) + len(directories) > 1500:
        raise ValueError('Workspace has too many files to grade (limit 1500)')
    if '.git' in children:
        repositories.append(folder)
    children[:] = [name for name in children if name not in ('.git', 'node_modules') and not Path(folder, name).is_symlink()]
    directories.extend(str(Path(folder, child)) for child in children)
    for name in names:
        path = Path(folder, name)
        if not stat.S_ISREG(path.lstat().st_mode):
            continue
        if path.stat().st_size > 262144:
            continue
        try:
            text = path.read_text()
        except (UnicodeError, OSError):
            continue
        total += len(text)
        if total > 2_000_000:
            raise ValueError('Workspace text exceeds the 2 MB grading limit')
        files[str(path)] = text
repo = next((path for path in repositories if cwd == path or cwd.startswith(path + '/')), None) or (meta.get('repo') if meta.get('repo') in repositories else next(iter(repositories), None))

def git(*args, directory=None, binary=False):
    result = subprocess.run(['/usr/bin/git', '-c', 'core.hooksPath=/dev/null', '-c', 'core.fsmonitor=false', '-c', 'diff.external=', '--no-pager', *args], cwd=directory or repo, capture_output=True, timeout=8, env={**os.environ, 'GIT_CONFIG_NOSYSTEM':'1', 'GIT_TERMINAL_PROMPT':'0', 'GIT_OPTIONAL_LOCKS':'0'})
    if result.returncode:
        return b'' if binary else ''
    return result.stdout if binary else result.stdout.decode('utf-8', errors='replace').strip()

blob_cache = {}
def blob(oid):
    if oid not in blob_cache:
        size = git('cat-file', '-s', oid)
        if not size or int(size) > 262144:
            return ''
        blob_cache[oid] = git('cat-file', 'blob', oid, binary=True).decode('utf-8', errors='replace')
    return blob_cache[oid]

def tree(oid):
    result = {}
    for entry in git('ls-tree', '-rz', oid, binary=True).split(b'\0'):
        if not entry:
            continue
        info, name = entry.split(b'\t', 1)
        mode, kind, object_id = info.decode().split()
        if kind == 'blob' and mode in ('100644', '100755'):
            result[repo + '/' + name.decode('utf-8', errors='replace')] = blob(object_id)
    return result

commits = []
head = branch = ''
tips = {}; remotes = {}; remote_tips = {}; tags = []; tracked = {}; index = {}; conflicts = []
if repo:
    head = git('rev-parse', '--verify', 'HEAD')
    branch = git('symbolic-ref', '--short', '-q', 'HEAD') or f'(detached at {head[:7]})'
    for line in git('rev-list', '--reverse', '--all', '--reflog', '--max-count=200').splitlines():
        commits.append({'id':line, 'message':git('log', '-1', '--format=%B', line), 'parents':git('log', '-1', '--format=%P', line).split(), 'files':tree(line)})
    head_tree = tree(head) if head else {}
    for entry in git('ls-files', '--stage', '-z', binary=True).split(b'\0'):
        if not entry:
            continue
        info, name = entry.split(b'\t', 1)
        mode, oid, stage = info.decode().split()
        path = repo + '/' + name.decode('utf-8', errors='replace')
        if stage != '0':
            conflicts.append(path)
        else:
            tracked[path] = blob(oid)
    index = {path:tracked.get(path) for path in set(head_tree) | set(tracked) if head_tree.get(path) != tracked.get(path)}
    for line in git('for-each-ref', '--format=%(refname:short) %(objectname)', 'refs/heads', 'refs/remotes').splitlines():
        name, oid = line.rsplit(' ', 1)
        tips[name] = oid
    for name in git('remote').splitlines():
        remotes[name] = git('remote', 'get-url', name)
    for line in git('for-each-ref', '--format=%(refname:short) %(objectname)', 'refs/heads', directory='/training/sample-app.git').splitlines():
        name, oid = line.rsplit(' ', 1)
        remote_tips['origin/' + name] = oid
    tags = git('tag', '--list').splitlines()
records = []
try:
    values = Path('/home/learner/.practice-records').read_bytes()[-524288:].decode('utf-8', errors='replace').split('\0')
    for i in range(0, len(values) - 2, 3):
        status, location, command = values[i:i+3]
        command = re.sub(r'^\s*\d+\s+', '', command).strip()
        if command:
            records.append({'command':command, 'cwd':location, 'failed':status != '0'})
except OSError:
    pass
print(json.dumps({'cwd':cwd, 'files':files, 'directories':directories, 'repo':repo, 'tracked':list(tracked), 'staged':list(index), 'index':index, 'commits':commits, 'head':head, 'branch':branch or 'main', 'branches':[name for name in tips if '/' not in name or not name.startswith(tuple(remote + '/' for remote in remotes))], 'branchTips':tips, 'remoteTips':remote_tips, 'remotes':remotes, 'tags':tags, 'stashCount':len(git('stash', 'list').splitlines()) if repo else 0, 'conflicts':list(set(conflicts)), 'aliases':meta['aliases'], 'records':records}))
