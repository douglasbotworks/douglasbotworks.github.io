"""Verify explicitly selected public deployment bytes against local site files."""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import subprocess
import urllib.parse

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://douglasbotworks.github.io/'
files = [ROOT / n for n in ('index.html', 'services.html', 'downloads.html', 'style.css', 'whispering-stones.html', 'sitemap.xml', 'robots.txt', '.nojekyll')]
files.extend(p for p in (ROOT / 'demos').rglob('*') if p.is_file())

def check(path):
    relative = path.relative_to(ROOT).as_posix()
    result = subprocess.run(['curl', '--fail', '--silent', '--show-error', '--location',
                             '--max-time', '30', BASE + urllib.parse.quote(relative)],
                            capture_output=True)
    expected = hashlib.sha256(path.read_bytes()).hexdigest()
    actual = hashlib.sha256(result.stdout).hexdigest()
    return {'path': relative, 'ok': result.returncode == 0 and expected == actual,
            'expected_sha256': expected, 'received_sha256': actual,
            'curl_exit_code': result.returncode}

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    results = list(pool.map(check, sorted(files)))
print(json.dumps({'url': BASE, 'checked': len(results),
                  'passed': sum(r['ok'] for r in results), 'files': results}, indent=2))
raise SystemExit(0 if all(r['ok'] for r in results) else 1)
