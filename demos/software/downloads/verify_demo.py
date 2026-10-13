"""Verify the fixed demo delivery without extracting or executing its contents."""
import hashlib
import json
import os
import stat
from pathlib import Path
import sys
import zipfile
from package_demo import FILES

MAX_ARCHIVE = 2_000_000
MAX_MEMBER = 250_000


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError('Duplicate manifest key: ' + key)
        result[key] = value
    return result


def verify(path, expected_digest):
    if len(expected_digest) != 64 or any(c not in '0123456789abcdef' for c in expected_digest):
        raise ValueError('Expected SHA256 must be 64 lowercase hexadecimal characters')
    fd = os.open(path, os.O_RDONLY | os.O_NONBLOCK)
    try:
        info = os.fstat(fd)
        if not stat.S_ISREG(info.st_mode):
            raise ValueError('Archive must be a regular file')
        with os.fdopen(fd, 'rb', closefd=False) as source:
            payload = source.read(MAX_ARCHIVE + 1)
    finally:
        os.close(fd)
    if len(payload) > MAX_ARCHIVE:
        raise ValueError('Archive exceeds 2 MB limit')
    actual = hashlib.sha256(payload).hexdigest()
    if actual != expected_digest:
        raise ValueError('Archive SHA256 mismatch')
    import io
    with zipfile.ZipFile(io.BytesIO(payload)) as archive:
        entries = archive.infolist()
        names = [entry.filename for entry in entries]
        if len(names) != len(set(names)) or set(names) != set(FILES) | {'MANIFEST.json'}:
            raise ValueError('Archive inventory mismatch or duplicate member')
        contents = {}
        for entry in entries:
            if entry.orig_filename != entry.filename or entry.file_size > MAX_MEMBER:
                raise ValueError('Invalid member name or size')
            if entry.compress_type != zipfile.ZIP_STORED or entry.flag_bits & 1:
                raise ValueError('Only unencrypted stored members are supported')
            contents[entry.filename] = archive.read(entry)
        manifest = json.loads(contents.pop('MANIFEST.json'), object_pairs_hook=unique_object)
        if not isinstance(manifest, dict) or set(manifest) != {'synthetic', 'files'} or manifest['synthetic'] is not True:
            raise ValueError('Invalid synthetic manifest')
        records = manifest['files']
        if not isinstance(records, dict) or set(records) != set(FILES):
            raise ValueError('Manifest inventory mismatch')
        for name, data in contents.items():
            record = records[name]
            if (not isinstance(record, dict) or set(record) != {'bytes', 'sha256'}
                    or type(record['bytes']) is not int or record['bytes'] != len(data)
                    or record['sha256'] != hashlib.sha256(data).hexdigest()):
                raise ValueError('Manifest content mismatch: ' + name)
    return {'verified': True, 'synthetic': True, 'sha256': actual, 'members': len(entries)}


def main():
    if len(sys.argv) != 3:
        raise ValueError('Usage: python3 verify_demo.py archive.zip expected-sha256')
    print(json.dumps(verify(Path(sys.argv[1]), sys.argv[2]), sort_keys=True))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, zipfile.BadZipFile, RuntimeError, RecursionError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
