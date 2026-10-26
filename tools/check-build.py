"""Fail if rebuilding changes the committed app or imports drift during migration."""
import hashlib, json, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
manifest = json.loads((ROOT/'docs/migration/live-app-sha256.json').read_text())
source = json.loads((ROOT/'docs/migration/imported-source-sha256.json').read_text())
# Feature overlay: historical migration fingerprints stay intact. This review-only
# treatment changes one source and its four generated outputs, explicitly listed
# against the original hashes; every other input/output retains the baseline gate.
overlay_path = ROOT/'docs/features/contact-focus-build.json'
if overlay_path.exists():
    overlay = json.loads(overlay_path.read_text())
    assert set(overlay['source']) == {'rally/lesson_body.html'}
    assert set(overlay['release']) == {'app/engine/engine.js','app/play.html','app/catalog.js','app/index.html'}
    for records, expected in [(overlay['source'], source), (overlay['release'], manifest)]:
        for name, hashes in records.items():
            assert expected[name] == hashes['baseline'], f'Feature baseline drift: {name}'
            expected[name] = hashes['candidate']
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
print(f'PASS: {len(actual)} exact release files; {len(source)} checked source/test inputs; identical runtime routes and headers')

subprocess.run(['python3','tools/build-hosted.py'],cwd=ROOT,check=True)
public = {str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest()
          for p in (ROOT/'app').rglob('*') if p.is_file()}
assert public == {k:v for k,v in manifest.items() if k != 'app/vercel.json'}, 'Hosted output changed'
subprocess.run(['python3','app_src/build.py'],cwd=ROOT,check=True)
print(f'PASS: hosted build includes exactly {len(public)} expected public files; committed artifact restored')
