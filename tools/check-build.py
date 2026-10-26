"""Fail if rebuilding changes the committed app or imports drift during migration."""
import hashlib, json, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
manifest = json.loads((ROOT/'docs/migration/live-app-sha256.json').read_text())
source = json.loads((ROOT/'docs/migration/imported-source-sha256.json').read_text())
# Feature overlay: historical migration fingerprints stay intact. This review
# candidate changes the shared renderer plus the Contact Clue and Forehand Bill
# scene inputs and generated lessons, explicitly listed against original hashes.
overlay_path = ROOT/'docs/features/contact-focus-build.json'
if overlay_path.exists():
    overlay = json.loads(overlay_path.read_text())
    assert set(overlay['source']) == {'rally/lesson_body.html','rally/cp_data.json','rally/fb_data.json','rally/hb_data.json','rally/short_data.json'}
    assert set(overlay['release']) == {'app/engine/engine.js','app/play.html','app/catalog.js','app/index.html','app/lessons/contact-clue.json','app/lessons/forehand-bill.json','app/lessons/high-ball.json','app/lessons/short-ball.json'}
    for records, expected in [(overlay['source'], source), (overlay['release'], manifest)]:
        for name, hashes in records.items():
            assert expected[name] == hashes['baseline'], f'Feature baseline drift: {name}'
            expected[name] = hashes['candidate']
# Sensory/beta feature: a second explicit overlay preserves both older baselines.
sensory = json.loads((ROOT/'docs/features/sensory-beta-build.json').read_text())
assert set(sensory['source']) == {'rally/lesson_body.html','app_src/sfx.js','app_src/cine.js','app_src/play_host.html','app_src/index.html','gs/app_flow.mjs'}
assert set(sensory['release']) == {'app/engine/engine.js','app/play.html','app/catalog.js','app/index.html','app/sfx.js','app/cine.js'}
for records, expected in [(sensory['source'], source), (sensory['release'], manifest)]:
    for name, hashes in records.items():
        assert expected[name] == hashes['baseline'], f'Sensory baseline drift: {name}'
        expected[name] = hashes['candidate']
# Explicit iOS playback routing repair; previous release fingerprints stay frozen.
ios = json.loads((ROOT/'docs/features/ios-audio-build.json').read_text())
assert set(ios['source']) == {'app_src/sfx.js'}
assert set(ios['release']) == {'app/sfx.js','app/play.html','app/catalog.js','app/index.html'}
for records, expected in [(ios['source'], source), (ios['release'], manifest)]:
    for name, hashes in records.items():
        assert expected[name] == hashes['baseline'], f'iOS audio baseline drift: {name}'
        expected[name] = hashes['candidate']
# Three paired readiness lessons; new files have explicit null baselines.
readiness = json.loads((ROOT/'docs/features/readiness-build.json').read_text())
assert set(readiness['source']) == {'app_src/catalog.py','rally/lesson_body.html','rally/build_readiness.py'} | {f'rally/{n}' for p in ('ea','ed','en') for n in (f'lesson_{p}.js',f'{p}_data.json')}
assert set(readiness['release']) == {'app/catalog.js','app/index.html','app/play.html','app/engine/engine.js'} | {f'app/lessons/{s}.json' for s in ('earned-attack','earned-defence','earned-net')}
for records, expected in [(readiness['source'], source), (readiness['release'], manifest)]:
    for name, hashes in records.items():
        assert expected.get(name) == hashes['baseline'], f'Readiness baseline drift: {name}'
        expected[name] = hashes['candidate']
# Sourced professional payoff repair; preserve all previous release fingerprints.
pro = json.loads((ROOT/'docs/features/readiness-pro-build.json').read_text())
assert set(pro['source']) == {'rally/build_readiness.py'} | {f'rally/lesson_{p}.js' for p in ('ea','ed','en')}
assert set(pro['release']) == {'app/catalog.js','app/index.html','app/play.html'} | {f'app/lessons/{s}.json' for s in ('earned-attack','earned-defence','earned-net')}
for records, expected in [(pro['source'], source), (pro['release'], manifest)]:
    for name, hashes in records.items():
        assert expected[name] == hashes['baseline'], f'Professional payoff baseline drift: {name}'
        expected[name] = hashes['candidate']
# Real CC0 recordings replace synthesis; all historical fingerprints stay frozen.
audio = json.loads((ROOT/'docs/features/recorded-audio-build.json').read_text())
assets = {'contact-1.wav','contact-2.wav','bounce.wav','applause.wav'}
assert set(audio['source']) == {'app_src/sfx.js','app_src/build.py','app_src/sfx.test.mjs','tools/sensory-browser.mjs'} | {f'app_src/audio/{n}' for n in assets}
assert set(audio['release']) == {'app/sfx.js','app/catalog.js','app/index.html','app/play.html'} | {f'app/audio/{n}' for n in assets}
for records, expected in [(audio['source'], source), (audio['release'], manifest)]:
    for name, hashes in records.items():
        assert expected.get(name) == hashes['baseline'], f'Recorded audio baseline drift: {name}'
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
