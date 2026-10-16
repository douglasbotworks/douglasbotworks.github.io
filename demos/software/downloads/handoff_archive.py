"""Package/inspect repair evidence without executing or extracting supplied code."""
import hashlib
import io
import json
import os
from pathlib import Path
import stat
import sys
import zipfile

LIMITS = {'contract.json': 262144, 'before/module.mjs': 524288,
          'after/module.mjs': 524288, 'contract-review.js': 250000,
          'contract-worker.js': 250000, 'package.json': 1000,
          'report.json': 8000000, 'change.diff': 4000000,
          'DELIVERY.md': 25000, 'MANIFEST.json': 25000}
MAX_ARCHIVE = sum(LIMITS.values()) + 20000


def read_regular(path, limit):
    fd = os.open(path, os.O_RDONLY | os.O_NONBLOCK | os.O_NOFOLLOW)
    try:
        info = os.fstat(fd)
        if not stat.S_ISREG(info.st_mode) or info.st_size > limit:
            raise ValueError('Expected bounded regular file')
        chunks, size = [], 0
        while size <= limit:
            data = os.read(fd, min(65536, limit + 1 - size))
            if not data:
                break
            chunks.append(data)
            size += len(data)
        if size > limit:
            raise ValueError('File exceeds size limit')
        return b''.join(chunks)
    finally:
        os.close(fd)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def unique(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError('Duplicate manifest key')
        result[key] = value
    return result


def check_contents(contents):
    if set(contents) != set(LIMITS):
        raise ValueError('Handoff inventory mismatch')
    for name, data in contents.items():
        if len(data) > LIMITS[name]:
            raise ValueError('Member exceeds size limit: ' + name)
    manifest = json.loads(contents['MANIFEST.json'].decode('utf-8'), object_pairs_hook=unique)
    if (not isinstance(manifest, dict) or set(manifest) != {'version', 'fixtureVerified', 'files'}
            or type(manifest['version']) is not int or manifest['version'] != 1
            or manifest['fixtureVerified'] is not True):
        raise ValueError('Invalid handoff manifest')
    records = manifest['files']
    if not isinstance(records, dict) or set(records) != set(LIMITS) - {'MANIFEST.json'}:
        raise ValueError('Manifest inventory mismatch')
    for name, record in records.items():
        data = contents[name]
        if (not isinstance(record, dict) or set(record) != {'bytes', 'sha256'}
                or type(record['bytes']) is not int or record['bytes'] != len(data)
                or record['sha256'] != sha(data)):
            raise ValueError('Manifest content mismatch: ' + name)
    return {'manifestSha256': sha(contents['MANIFEST.json']), 'members': len(contents),
            'contentConsistent': True, 'executionPerformed': False}


def verify(path, expected):
    if len(expected) != 64 or any(c not in '0123456789abcdef' for c in expected):
        raise ValueError('Expected SHA256 must be lowercase hexadecimal')
    data = read_regular(path, MAX_ARCHIVE)
    if sha(data) != expected:
        raise ValueError('Archive SHA256 mismatch')
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        entries = archive.infolist()
        names = [entry.filename for entry in entries]
        if len(names) != len(set(names)) or set(names) != set(LIMITS):
            raise ValueError('Archive inventory mismatch')
        contents = {}
        for entry in entries:
            if (entry.orig_filename != entry.filename or entry.file_size > LIMITS[entry.filename]
                    or entry.compress_type != zipfile.ZIP_STORED or entry.flag_bits & 1
                    or stat.S_IFMT(entry.external_attr >> 16) not in (0, stat.S_IFREG)
                    or entry.external_attr & 0x10):
                raise ValueError('Unsupported archive member')
            contents[entry.filename] = archive.read(entry)
    return {**check_contents(contents), 'sha256': expected}


def pack(root, output):
    root = Path(root)
    if root.is_symlink() or not root.is_dir():
        raise ValueError('Handoff root must be a real directory')
    names = set()
    for directory, dirs, files in os.walk(root, followlinks=False):
        for name in dirs:
            path = Path(directory) / name
            if path.is_symlink() or path.relative_to(root).as_posix() not in {'before', 'after'}:
                raise ValueError('Unexpected handoff directory')
        names.update((Path(directory) / name).relative_to(root).as_posix() for name in files)
    if names != set(LIMITS):
        raise ValueError('Handoff inventory mismatch')
    contents = {name: read_regular(root / name, limit) for name, limit in LIMITS.items()}
    result = check_contents(contents)
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, 'w', compression=zipfile.ZIP_STORED) as archive:
        for name, data in sorted(contents.items()):
            info = zipfile.ZipInfo(name, (2026, 1, 1, 0, 0, 0))
            info.external_attr = 0o100644 << 16
            archive.writestr(info, data)
    data = buffer.getvalue()
    if len(data) > MAX_ARCHIVE:
        raise ValueError('Archive exceeds size limit')
    # Exported handoffs can contain client source. Restrict the new archive
    # from creation, including when it is outside the private release directory.
    fd = os.open(output, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, 'wb') as destination:
        destination.write(data)
    return {**result, 'sha256': sha(data), 'archive': str(output)}


if __name__ == '__main__':
    try:
        if len(sys.argv) != 4 or sys.argv[1] not in ('pack', 'verify'):
            raise ValueError('Usage: handoff_archive.py pack DIRECTORY NEW.zip | verify ARCHIVE SHA256')
        operation = pack if sys.argv[1] == 'pack' else verify
        print(json.dumps(operation(*sys.argv[2:]), sort_keys=True))
    except (ValueError, OSError, zipfile.BadZipFile, RuntimeError, RecursionError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
