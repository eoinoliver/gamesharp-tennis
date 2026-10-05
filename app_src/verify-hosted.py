"""Verify the staged static artifact, redirects and exclusions without following redirects."""
import concurrent.futures, hashlib, json, os, re, subprocess, sys, tempfile, urllib.error, urllib.parse, urllib.request
from email.parser import Parser
from pathlib import Path

BASE = sys.argv[1].rstrip('/')
ROOT = Path(__file__).resolve().parent.parent
def option(name, default):
    return Path(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default
host = urllib.parse.urlsplit(BASE).hostname
production = host in ('gamesharptennis.com', 'www.gamesharptennis.com')
assert production or (host.startswith('gamesharp-tennis-') and host.endswith('.vercel.app'))

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None

def read(path):
    if '--authenticated' in sys.argv:
        cli = os.environ['GS_VERCEL_CLI']
        with tempfile.TemporaryDirectory(prefix='gs-stage-check-') as tmp:
            headers, body = Path(tmp) / 'headers', Path(tmp) / 'body'
            command = [os.environ.get('GS_NODE', 'node'), cli, 'curl', path,
                       '--deployment', BASE, '--scope', 'eoinlynn-5978s-projects', '--',
                       '--silent', '--show-error', '--max-time', '30',
                       '--dump-header', str(headers), '--output', str(body), '--write-out', '%{http_code}']
            result = subprocess.run(command, capture_output=True, timeout=50)
            if result.returncode:
                raise RuntimeError('Authenticated CLI request failed: exit ' + str(result.returncode))
            status = int(result.stdout.decode().strip())
            blocks = re.split(r'\r?\n\r?\n', headers.read_text().strip())
            fields = Parser().parsestr(blocks[-1].split('\n', 1)[1])
            return status, dict(fields.items()), body.read_bytes()
    opener = urllib.request.build_opener(NoRedirect)
    try:
        response = opener.open(BASE + path, timeout=30)
    except urllib.error.HTTPError as error:
        response = error
    return response.status, dict(response.headers), response.read()

cases = []
config = json.loads((ROOT / 'app/vercel.json').read_text())
for rule in config['redirects']:
    values = rule.get('has', [{}])[0].get('value')
    values = values[2:-2].split('|') if values else [None]
    for value in values:
        path = rule['source']
        if value is not None:
            path += '?' + urllib.parse.urlencode({'goldDaily': value})
        cases.append({'path': path, 'status': 307, 'destination': rule['destination']})

for path, dest in [('/beta/short-ball.html?l=serve-plus-one', '/play.html?l=short-ball'),
                   ('/?goldDaily=contact&l=serve-plus-one', '/play.html?l=contact-clue')]:
    cases.append({'path': path, 'status': 307, 'destination': dest})
for path in ['/daily.html', '/daily2.html', '/faultlab.html', '/faultmotion.html',
             '/fixashot.html', '/technique.html', '/beta/unknown.html',
             '/s/Q001', '/s/unknown', '/play/unknown', '/api/share?id=Q007',
             '/app_src/config.js', '/rally/core.js', '/bvh/', '/gs/gate.mjs',
             '/.git/config', '/WORKLOG.md', '/vercel.json']:
    cases.append({'path': path, 'status': 404})
for path in ['/?goldDaily=unknown', '/?goldDaily=serve-plus-one&challenge=daily',
             '/?p=Q007', '/?play=wide_serve', '/?ch=Q007~1~1', '/?legacy=1']:
    cases.append({'path': path, 'status': 200})
for name, sha in json.loads(option('--manifest', ROOT / 'app_src/evidence/build-sha256.json').read_text()).items():
    if name == 'app/vercel.json':
        continue
    cases.append({'path': '/' + name.removeprefix('app/'), 'status': 200, 'sha256': sha})

def check(case):
    try:
        status, headers, body = read(case['path'])
        lower = {k.lower(): v for k, v in headers.items()}
        ok = status == case['status']
        result = {**case, 'actualStatus': status}
        if 'destination' in case:
            location = lower.get('location', '')
            actual = urllib.parse.urlsplit(location)
            expected = urllib.parse.urlsplit(case['destination'])
            aq, eq = urllib.parse.parse_qs(actual.query), urllib.parse.parse_qs(expected.query)
            ok &= actual.path == expected.path and all(aq.get(k) == v for k, v in eq.items())
            ok &= not actual.netloc or actual.netloc == urllib.parse.urlsplit(BASE).netloc
            result['location'] = location
        if 'sha256' in case:
            result['actualSha256'] = hashlib.sha256(body).hexdigest()
            ok &= result['actualSha256'] == case['sha256']
            result['cacheControl'] = lower.get('cache-control')
            ok &= lower.get('cache-control') == 'public, max-age=0, must-revalidate'
            ok &= lower.get('x-content-type-options') == 'nosniff'
        result['passed'] = bool(ok)
        return result
    except Exception as error:
        return {**case, 'passed': False, 'error': str(error)}

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    results = list(pool.map(check, cases))
report = {'base': BASE, 'total': len(results), 'passed': sum(r['passed'] for r in results), 'results': results}
destination = option('--report', ROOT / ('app_src/evidence/production-http.json' if production else 'app_src/evidence/staged-http.json'))
destination.write_text(json.dumps(report, indent=2) + '\n')
print(f"Hosted checks: {report['passed']}/{report['total']}")
for result in results:
    if not result['passed']:
        print(json.dumps(result))
sys.exit(0 if report['passed'] == report['total'] else 1)
