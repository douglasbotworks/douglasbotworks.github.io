"""Package the explicit synthetic sample inventory; never scan arbitrary inputs."""
import hashlib
import json
from pathlib import Path
import sys
import zipfile

FILES = (
    'LICENSE.txt',
    'README.md', 'package.json', 'order-total.js', 'before/order-total.js',
    'demo.js', 'acceptance.js', 'tests/order-total.test.js',
    'tests/acceptance.test.js', 'package_demo.py', 'verify_demo.py',
    'tests/test_delivery.py',
    'contract-review.js', 'contract-worker.js', 'contracts/order-total.json',
    'CONTRACT-REVIEW.md', 'tests/contract-review.test.js',
    'deliver_repair.py', 'tests/test_repair_delivery.py',
    'handoff_archive.py', 'tests/test_handoff_archive.py',
    'samples/request-state/before.js', 'samples/request-state/after.js',
    'samples/request-state/contract.json', 'samples/request-state/README.md',
    'tests/request-state.test.js',
    'release_repair.py', 'tests/test_release_repair.py',
    'tools/ci_e2e.py', 'build-proof.js', 'build-request-proof.js',
)


def main():
    if len(sys.argv) != 2:
        raise ValueError('Usage: python3 package_demo.py /path/to/new-demo.zip')
    root = Path(__file__).resolve().parent
    payload = {name: (root / name).read_bytes() for name in FILES}
    manifest = {
        'synthetic': True,
        'files': {name: {'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
                  for name, data in payload.items()},
    }
    payload['MANIFEST.json'] = (json.dumps(manifest, indent=2, sort_keys=True) + '\n').encode()
    # Exclusive creation prevents accidentally replacing an existing delivery.
    with open(sys.argv[1], 'xb') as destination:
        with zipfile.ZipFile(destination, 'w', compression=zipfile.ZIP_STORED) as archive:
            for name, data in sorted(payload.items()):
                info = zipfile.ZipInfo(name, (2026, 1, 1, 0, 0, 0))
                info.external_attr = 0o100644 << 16
                archive.writestr(info, data)
    digest = hashlib.sha256(Path(sys.argv[1]).read_bytes()).hexdigest()
    print(json.dumps({'archive': sys.argv[1], 'sha256': digest, 'members': len(payload)}))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, zipfile.BadZipFile) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
