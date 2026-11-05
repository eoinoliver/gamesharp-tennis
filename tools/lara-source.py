"""Exact text, coverage and byte identity for the complete alternate coach."""
import hashlib,json,re
from pathlib import Path
root=Path(__file__).resolve().parent.parent
sfx=(root/'app_src/sfx.js').read_text()
expected=json.loads('{'+sfx.split('courtVoices={',1)[1].split('\n};',1)[0]+'}')
expected.update({r['lesson']:r['text'] for r in json.loads((root/'docs/features/doubles-reset-voice.json').read_text()) if r['lesson'].startswith('reset-')})
catalogue=json.loads((root/'docs/features/lara-voice-sources.json').read_text())
rows=catalogue['recordings']
assert len(rows)==len(expected)==74
assert len({r['taskId'] for r in rows})==catalogue['recordingCount']==73
assert {r['slug']:r['text'] for r in rows}==expected
assert {p.name for p in (root/'app_src/audio').glob('voice-lara-*.mp3')}=={'voice-lara-'+slug+'.mp3' for slug in expected}
for r in rows:
    assert r['asset']=='app_src/audio/voice-lara-'+r['slug']+'.mp3'
    assert 0<r['duration']<=5
    assert r['voice']=='Lara' and r['model']=='eleven_v3' and r['speed']==1.05
    assert r['direction']==('[encouraging]' if r['slug'].startswith('reset-') else '[excited]')
    assert hashlib.sha256((root/r['asset']).read_bytes()).hexdigest()==r['sha256'],r['slug']
assert (root/'app_src/audio/voice-lara-live-point-buy-time.mp3').read_bytes()==(root/'app_src/audio/voice-lara-live-point-other-wing.mp3').read_bytes()
print('PASS: 74 exact Lara scripts and MP3 fingerprints; 73 unique recording tasks; complete existing-cue coverage')
