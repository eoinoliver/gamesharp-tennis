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
# Action before every question and restrained sound; historical releases stay frozen.
action = json.loads((ROOT/'docs/features/question-action-build.json').read_text())
assert set(action['source']) == {'rally/lesson_body.html','app_src/sfx.js','app_src/sfx.test.mjs','tools/sensory-browser.mjs','tools/question-action-browser.mjs','tools/browser-checks.mjs','gs/gate.mjs'} | {f'rally/lesson_{p}.js' for p in ('sq','rs','bg','ma','se')}
assert set(action['release']) == {'app/engine/engine.js','app/sfx.js','app/catalog.js','app/index.html','app/play.html'} | {f'app/lessons/{s}.json' for s in ('second-serve','find-your-return-spot','the-big-hitter','midweek-point-1','saturday-point-5')}
for records, expected in [(action['source'], source), (action['release'], manifest)]:
    for name, hashes in records.items():
        assert expected.get(name) == hashes['baseline'], f'Question action baseline drift: {name}'
        expected[name] = hashes['candidate']
# Natural completion reward variants; preserve all earlier source fingerprints.
natural = json.loads((ROOT/'docs/features/natural-completion-build.json').read_text())
assert set(natural['source']) == {'app_src/sfx.js','app_src/sfx.test.mjs','tools/sensory-browser.mjs'} | {f'app_src/audio/applause-{n}.mp3' for n in range(1,4)}
assert set(natural['release']) == {'app/sfx.js','app/catalog.js','app/index.html','app/play.html'} | {f'app/audio/applause-{n}.mp3' for n in range(1,4)}
for records, expected in [(natural['source'], source), (natural['release'], manifest)]:
    for name, hashes in records.items():
        assert expected.get(name) == hashes['baseline'], f'Natural completion baseline drift: {name}'
        expected[name] = hashes['candidate']
# Watch first, read second, choose third; freeze the prior release fingerprints.
sequence = json.loads((ROOT/'docs/features/question-sequence-build.json').read_text())
assert set(sequence['source']) == {'rally/lesson_body.html','tools/question-action-browser.mjs'}
assert set(sequence['release']) == {'app/engine/engine.js','app/catalog.js','app/index.html','app/play.html'}
for records, expected in [(sequence['source'], source), (sequence['release'], manifest)]:
    for name, hashes in records.items():
        assert expected.get(name) == hashes['baseline'], f'Question sequence baseline drift: {name}'
        expected[name] = hashes['candidate']
# Three explicit recorded completion cues; previous release hashes stay frozen.
voice = json.loads((ROOT/'docs/features/completion-voice-build.json').read_text())
voice_assets = {f'voice-{s}.mp3' for s in ('short-ball','earned-defence','recovery')}
assert set(voice['source']) == {'rally/lesson_body.html','app_src/sfx.js','app_src/play_host.html','app_src/sfx.test.mjs','tools/voice-browser.mjs','tools/browser-checks.mjs'} | {f'app_src/audio/{n}' for n in voice_assets}
assert set(voice['release']) == {'app/engine/engine.js','app/sfx.js','app/catalog.js','app/index.html','app/play.html'} | {f'app/audio/{n}' for n in voice_assets}
for records, expected in [(voice['source'], source), (voice['release'], manifest)]:
    for name, hashes in records.items():
        assert expected.get(name) == hashes['baseline'], f'Completion voice baseline drift: {name}'
        expected[name] = hashes['candidate']
# Fresh-entry queue and default voice; preserve all prior feature fingerprints.
fresh = json.loads((ROOT/'docs/features/fresh-challenges-build.json').read_text())
assert set(fresh['source']) == {'app_src/app.js','app_src/index.html','app_src/play_host.html','app_src/sfx.js','app_src/analytics.test.mjs','app_src/sfx.test.mjs','tools/sensory-browser.mjs','tools/voice-browser.mjs','gs/app_flow.mjs'}
assert set(fresh['release']) == {'app/app.js','app/sfx.js','app/catalog.js','app/index.html','app/play.html'}
for records, expected in [(fresh['source'], source), (fresh['release'], manifest)]:
    for name, hashes in records.items():
        assert expected.get(name) == hashes['baseline'], f'Fresh challenge baseline drift: {name}'
        expected[name] = hashes['candidate']
# All 41 authored completion endings; historical overlays remain immutable.
catalogue_voice = json.loads((ROOT/'docs/features/completion-voice-catalogue-build.json').read_text())
voice_rows = json.loads((ROOT/'docs/features/completion-voice-catalogue.json').read_text())['lessons']
new_voice_assets = {f"voice-{r['lesson']}.mp3" for r in voice_rows if r['status'] != 'existing_approved'}
assert len(voice_rows) == 41 and len(new_voice_assets) == 38
assert set(catalogue_voice['source']) == {'rally/lesson_body.html','app_src/sfx.js','app_src/sfx.test.mjs','tools/voice-browser.mjs','tools/sensory-browser.mjs','tools/browser-checks.mjs','tools/voice-catalogue-browser.mjs','docs/features/completion-voice-catalogue.json','docs/features/completion-voice-sources.json'} | {f'app_src/audio/{n}' for n in new_voice_assets}
assert set(catalogue_voice['release']) == {'app/engine/engine.js','app/sfx.js','app/catalog.js','app/index.html','app/play.html'} | {f'app/audio/{n}' for n in new_voice_assets}
for records, expected in [(catalogue_voice['source'], source), (catalogue_voice['release'], manifest)]:
    for name, hashes in records.items():
        assert expected.get(name) == hashes['baseline'], f'Catalogue voice baseline drift: {name}'
        expected[name] = hashes['candidate']
# Explicit movement-led point pilot: historical release fingerprints stay frozen.
live = json.loads((ROOT/'docs/features/live-point-build.json').read_text())
assert set(live['source']) == set(['app_src/app.js', 'app_src/build.py', 'app_src/catalog.py', 'app_src/index.html', 'app_src/play_host.html', 'app_src/sfx.js', 'app_src/analytics.test.mjs', 'app_src/sfx.test.mjs', 'rally/lesson_body.html', 'rally/build_live_point.py', 'rally/lesson_lp.js', 'rally/lesson_lt.js', 'rally/lp_data.json', 'rally/lt_data.json', 'tools/live-point-browser.mjs', 'tools/browser-checks.mjs', 'tools/voice-catalogue-browser.mjs', 'tools/voice-browser.mjs', 'gs/app_flow.mjs', 'gs/gate.mjs', 'docs/features/live-point-voice.json', 'docs/features/live-point.md', 'app_src/audio/voice-live-point-buy-time.mp3', 'app_src/audio/voice-live-point-other-wing.mp3'])
assert set(live['release']) == set(['app/play.html', 'app/sfx.js', 'app/index.html', 'app/catalog.js', 'app/app.js', 'app/audio/voice-live-point-other-wing.mp3', 'app/audio/voice-live-point-buy-time.mp3', 'app/lessons/live-point-other-wing.json', 'app/lessons/live-point-buy-time.json', 'app/engine/engine.js'])
for records, expected in [(live['source'], source), (live['release'], manifest)]:
    for name, hashes in records.items():
        assert expected.get(name) == hashes['baseline'], f'Live Point baseline drift: {name}'
        expected[name] = hashes['candidate']
# Explicit stroke/recap extension; all historical release fingerprints stay frozen.
integrity = json.loads((ROOT/'docs/features/stroke-integrity-recaps-build.json').read_text())
assert set(integrity['source']) == set(['THIRD_PARTY_NOTICES.md', 'app_src/athlete.js', 'app_src/build.py', 'app_src/sharpen.js', 'app_src/sharpen/bh_0.jpg', 'app_src/sharpen/bh_1.jpg', 'app_src/sharpen/bh_2.jpg', 'app_src/sharpen/bv_0.jpg', 'app_src/sharpen/bv_1.jpg', 'app_src/sharpen/bv_2.jpg', 'app_src/sharpen/drop_0.jpg', 'app_src/sharpen/drop_1.jpg', 'app_src/sharpen/drop_2.jpg', 'app_src/sharpen/fh_0.jpg', 'app_src/sharpen/fh_1.jpg', 'app_src/sharpen/fh_2.jpg', 'app_src/sharpen/fv_0.jpg', 'app_src/sharpen/fv_1.jpg', 'app_src/sharpen/fv_2.jpg', 'app_src/sharpen/serve_0.jpg', 'app_src/sharpen/serve_1.jpg', 'app_src/sharpen/serve_2.jpg', 'app_src/sharpen/slice_0.jpg', 'app_src/sharpen/slice_1.jpg', 'app_src/sharpen/slice_2.jpg', 'docs/features/stroke-integrity-recaps.md', 'gs/gate.mjs', 'rally/build_live_point.py', 'rally/figure.js', 'rally/foot_directions.json', 'rally/lesson_body.html', 'rally/lesson_lc.js', 'rally/lesson_lp.js', 'rally/lesson_lt.js', 'rally/lp_data.json', 'rally/stroke_integrity.py', 'tools/browser-checks.mjs', 'tools/lesson-recap-browser.mjs', 'tools/live-point-browser.mjs', 'tools/mocap_kinematics.py', 'tools/recover_foot_directions.py', 'tools/render-sharpen-stills.mjs', 'tools/sensory-browser.mjs', 'tools/stroke-integrity-browser.mjs', 'tools/voice-catalogue-browser.mjs'])
assert set(integrity['release']) == set(['app/athlete.js', 'app/catalog.js', 'app/clips/bh.json', 'app/clips/bhChest.json', 'app/clips/bhHigh.json', 'app/clips/bhHigher.json', 'app/clips/bhSlice.json', 'app/clips/bhlo.json', 'app/clips/bv.json', 'app/clips/fh.json', 'app/clips/fhChest.json', 'app/clips/fhCramped.json', 'app/clips/fhHigh.json', 'app/clips/fhHigher.json', 'app/clips/fhhi.json', 'app/clips/fhlo.json', 'app/clips/fvhi.json', 'app/clips/lowfv.json', 'app/clips/ready.json', 'app/clips/serveB.json', 'app/clips/serveT.json', 'app/clips/serveW.json', 'app/clips/sm.json', 'app/engine/engine.js', 'app/index.html', 'app/lessons/late-is-the-culprit.json', 'app/lessons/live-point-buy-time.json', 'app/lessons/live-point-other-wing.json', 'app/play.html', 'app/sharpen.js', 'app/sharpen/bh_0.jpg', 'app/sharpen/bh_1.jpg', 'app/sharpen/bh_2.jpg', 'app/sharpen/bv_0.jpg', 'app/sharpen/bv_1.jpg', 'app/sharpen/bv_2.jpg', 'app/sharpen/drop_0.jpg', 'app/sharpen/drop_1.jpg', 'app/sharpen/drop_2.jpg', 'app/sharpen/fh_0.jpg', 'app/sharpen/fh_1.jpg', 'app/sharpen/fh_2.jpg', 'app/sharpen/fv_0.jpg', 'app/sharpen/fv_1.jpg', 'app/sharpen/fv_2.jpg', 'app/sharpen/serve_0.jpg', 'app/sharpen/serve_1.jpg', 'app/sharpen/serve_2.jpg', 'app/sharpen/slice_0.jpg', 'app/sharpen/slice_1.jpg', 'app/sharpen/slice_2.jpg'])
for records, expected in [(integrity['source'], source), (integrity['release'], manifest)]:
    for name, hashes in records.items():
        assert expected.get(name) == hashes['baseline'], f'Stroke integrity baseline drift: {name}'
        expected[name] = hashes['candidate']
# Explicit mobile learning/trust correction; all historical fingerprints remain frozen.
mobile = json.loads((ROOT/'docs/features/mobile-learning-trust-build.json').read_text())
assert set(mobile['source']) == set(['app_src/analytics.test.mjs', 'app_src/app.js', 'app_src/build.py', 'app_src/catalog.py', 'app_src/index.html', 'app_src/play_host.html', 'app_src/sfx.js', 'app_src/sfx.test.mjs', 'docs/features/mobile-learning-trust.md', 'rally/build_live_point.py', 'rally/lesson_bg.js', 'rally/lesson_body.html', 'rally/lesson_dl.js', 'rally/lesson_dm.js', 'rally/lesson_lc.js', 'rally/lesson_lf.js', 'rally/lesson_line.js', 'rally/lesson_lp.js', 'rally/lesson_ma.js', 'rally/lesson_pw.js', 'rally/lesson_ra.js', 'rally/lesson_sd.js', 'rally/lesson_short.js', 'rally/lesson_winner.js', 'tools/browser-checks.mjs', 'tools/lesson-recap-browser.mjs', 'tools/mobile-learning-browser.mjs', 'tools/sensory-browser.mjs', 'tools/live-point-browser.mjs', 'gs/app_flow.mjs', 'gs/payoff_check.mjs', '.github/workflows/checks.yml'])
assert set(mobile['release']) == set(['app/app.js', 'app/catalog.js', 'app/engine/engine.js', 'app/index.html', 'app/lessons/down-the-line.json', 'app/lessons/late-is-the-culprit.json', 'app/lessons/live-point-buy-time.json', 'app/lessons/midweek-point-1.json', 'app/lessons/pulled-wide.json', 'app/lessons/running-around.json', 'app/lessons/rushed-out-wide.json', 'app/lessons/saturday-point-4.json', 'app/lessons/short-ball.json', 'app/lessons/the-big-hitter.json', 'app/lessons/the-lefty.json', 'app/lessons/the-line.json', 'app/lessons/the-winner.json', 'app/play.html', 'app/sfx.js'])
for records, expected in [(mobile['source'], source), (mobile['release'], manifest)]:
    for name, hashes in records.items():
        assert expected.get(name) == hashes['baseline'], f'Mobile trust baseline drift: {name}'
        expected[name] = hashes['candidate']
# Complete flagship learning cycle; preserve every historical fingerprint.
flagship = json.loads((ROOT/'docs/features/live-point-flagship-build.json').read_text())
assert set(flagship['source']) == set(['app_src/analytics.test.mjs', 'app_src/app.js', 'app_src/audio/voice-live-early-recovery.mp3', 'app_src/audio/voice-live-recover-sooner.mp3', 'app_src/audio/voice-live-time-used.mp3', 'app_src/audio/voice-live-time-watched.mp3', 'app_src/build.py', 'app_src/index.html', 'app_src/play_host.html', 'app_src/sfx.js', 'app_src/sfx.test.mjs', 'docs/features/flagship-voice-sources.json', 'docs/features/live-point-flagship-cycle.md', 'rally/build_live_point.py', 'rally/lesson_body.html', 'rally/lesson_lp.js', 'rally/lesson_lt.js', 'rally/live_point_families.json', 'tools/browser-checks.mjs', 'tools/flagship-browser.mjs', 'tools/voice-catalogue-browser.mjs'])
assert set(flagship['release']) == set(['app/app.js', 'app/audio/voice-live-early-recovery.mp3', 'app/audio/voice-live-recover-sooner.mp3', 'app/audio/voice-live-time-used.mp3', 'app/audio/voice-live-time-watched.mp3', 'app/catalog.js', 'app/engine/engine.js', 'app/index.html', 'app/lessons/live-point-buy-time.json', 'app/lessons/live-point-other-wing.json', 'app/play.html', 'app/sfx.js'])
for records, expected in [(flagship['source'], source), (flagship['release'], manifest)]:
    for name, hashes in records.items():
        assert expected.get(name) == hashes['baseline'], f'Flagship cycle baseline drift: {name}'
        expected[name] = hashes['candidate']
# Six-play pilot: explicitly scoped additions preserve every earlier fingerprint.
pilot = json.loads((ROOT/'docs/features/six-play-build.json').read_text())
assert set(pilot['source']) == set(['app_src/analytics.test.mjs', 'app_src/app.js', 'app_src/audio/voice-live-serve-00.mp3', 'app_src/audio/voice-live-serve-01.mp3', 'app_src/audio/voice-live-serve-10.mp3', 'app_src/audio/voice-live-serve-11.mp3', 'app_src/audio/voice-live-space-00.mp3', 'app_src/audio/voice-live-space-01.mp3', 'app_src/audio/voice-live-space-10.mp3', 'app_src/audio/voice-live-space-11.mp3', 'app_src/build.py', 'app_src/catalog.py', 'app_src/index.html', 'app_src/play_host.html', 'app_src/sfx.js', 'app_src/sfx.test.mjs', 'docs/features/six-play-pilot.json', 'docs/features/six-play-voice-sources.json', 'docs/features/six-play-voice.json', 'gs/gate.mjs', 'rally/build_live_pilot.py', 'rally/build_live_point.py', 'rally/lesson_body.html', 'rally/lesson_ll.js', 'rally/lesson_ls.js', 'rally/lesson_sr.js', 'rally/lesson_sv.js', 'rally/live_point_families.json', 'rally/ll_data.json', 'rally/ls_data.json', 'rally/sr_data.json', 'rally/sv_data.json', 'tools/browser-checks.mjs', 'tools/six-play-browser.mjs', 'tools/six-play-source.py', 'tools/voice-catalogue-browser.mjs'])
assert set(pilot['release']) == set(['app/app.js', 'app/audio/voice-live-serve-00.mp3', 'app/audio/voice-live-serve-01.mp3', 'app/audio/voice-live-serve-10.mp3', 'app/audio/voice-live-serve-11.mp3', 'app/audio/voice-live-space-00.mp3', 'app/audio/voice-live-space-01.mp3', 'app/audio/voice-live-space-10.mp3', 'app/audio/voice-live-space-11.mp3', 'app/catalog.js', 'app/engine/engine.js', 'app/index.html', 'app/lessons/live-point-make-room.json', 'app/lessons/live-point-return-deep.json', 'app/lessons/live-point-serve-see.json', 'app/lessons/live-point-short-low.json', 'app/play.html', 'app/sfx.js'])
for records, expected in [(pilot['source'], source), (pilot['release'], manifest)]:
    for name, hashes in records.items():
        assert expected.get(name) == hashes['baseline'], f'Six-play baseline drift: {name}'
        expected[name] = hashes['candidate']
subprocess.run(['python3','tools/six-play-source.py'],cwd=ROOT,check=True)
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
