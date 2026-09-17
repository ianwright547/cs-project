"""Bounded file access within the disposable learner workspace."""
import json
import os
from pathlib import Path
import stat
import sys

request = json.load(sys.stdin)
path = Path(request['path'])
if not path.is_absolute() or '..' in path.parts or not str(path).startswith('/workspace/'):
    raise ValueError('Choose a file inside /workspace')
for parent in [*reversed(path.parents), path]:
    if parent.is_symlink():
        raise ValueError('Symlinks cannot be opened in the file editor; use the terminal')
if request['action'] == 'write':
    content = request['content'].encode()
    if len(content) > 262144:
        raise ValueError('File exceeds the 256 KB editor limit')
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC | os.O_NOFOLLOW | os.O_NONBLOCK, 0o644)
    with os.fdopen(descriptor, 'wb') as stream:
        if not stat.S_ISREG(os.fstat(stream.fileno()).st_mode):
            raise ValueError('Only regular files can be edited')
        stream.write(content)
    print('{}')
else:
    descriptor = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    with os.fdopen(descriptor, 'rb') as stream:
        if not stat.S_ISREG(os.fstat(stream.fileno()).st_mode):
            raise ValueError('Only regular files can be read')
        content = stream.read(262145)
    if len(content) > 262144:
        raise ValueError('File exceeds the 256 KB editor limit')
    print(json.dumps({'content': content.decode('utf-8')}))
