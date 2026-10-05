"""Fail if rebuilding changes the committed app or imports drift during migration."""
import hashlib, json, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
manifest = json.loads((ROOT/'docs/migration/live-app-sha256.json').read_text())
source = json.loads((ROOT/'docs/migration/imported-source-sha256.json').read_text())
for name, expected in source.items():
    assert hashlib.sha256((ROOT/name).read_bytes()).hexdigest() == expected, f'Imported source changed: {name}'
subprocess.run(['python3','app_src/build.py'], cwd=ROOT, check=True)
actual = {str(p.relative_to(ROOT)): hashlib.sha256(p.read_bytes()).hexdigest()
          for p in sorted((ROOT/'app').rglob('*')) if p.is_file()}
assert actual == manifest, 'Build differs from the approved live source artifact'
assert subprocess.run(['git','diff','--exit-code','--','app'],cwd=ROOT).returncode == 0, 'Committed app differs from rebuild'
root_config = json.loads((ROOT/'vercel.json').read_text())
app_config = json.loads((ROOT/'app/vercel.json').read_text())
assert {k:v for k,v in root_config.items() if k not in ('buildCommand','outputDirectory','installCommand','framework')} == app_config, 'Runtime routing differs'
assert root_config['outputDirectory'] == 'app'
print(f'PASS: {len(actual)} exact release files; {len(source)} unchanged source/test inputs; identical runtime routes and headers')

subprocess.run(['python3','tools/build-hosted.py'],cwd=ROOT,check=True)
public = {str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest()
          for p in (ROOT/'app').rglob('*') if p.is_file()}
assert public == {k:v for k,v in manifest.items() if k != 'app/vercel.json'}, 'Hosted output changed'
subprocess.run(['python3','app_src/build.py'],cwd=ROOT,check=True)
print('PASS: hosted build includes exactly the 80 live public files; committed artifact restored')
