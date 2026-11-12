"""Protect the tennis decisions while professional context is edited separately."""
from pathlib import Path
from urllib.parse import urlparse
import hashlib, json, sys

ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'app_src'))
from catalog import DAILY,PREDICT,PLAY
cards=json.loads((ROOT/'app_src/pro_insights.json').read_text())
scope=json.loads((ROOT/'docs/features/pro-insight-scope.json').read_text())
slugs={r[0] for r in DAILY+PREDICT+PLAY}
assert set(cards)==set(scope['protectedLessonHashes'])==slugs
assert {k for k,v in cards.items() if v is None}==set(scope['withoutDedicatedInsight'])
kinds={'From the players','From the player','From the coach','From an opponent','Reported coaching','Match analysis','Research','Coaching insight'}
digest=lambda o:hashlib.sha256(json.dumps(o,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
# The mobile-return copy was reviewed separately from the professional cards.
updated=json.loads((ROOT/'docs/features/mobile-return-build.json').read_text())['lessonContracts']
assert set(updated)=={'doubles-hold-cover','doubles-return-line','doubles-lob-overhead'}
for slug,change in updated.items():
    assert scope['protectedLessonHashes'][slug]==change['baseline']
    scope['protectedLessonHashes'][slug]=change['candidate']
reveal=json.loads((ROOT/'docs/features/reveal-timing-build.json').read_text())['lessonContracts']
assert set(reveal)=={'doubles-cross-cover','doubles-lob-switch','doubles-return-space','live-point-over-head','live-point-return-time'}
for slug,change in reveal.items():
    assert scope['protectedLessonHashes'][slug]==change['baseline']
    scope['protectedLessonHashes'][slug]=change['candidate']
attack=json.loads((ROOT/'docs/features/earned-attack-playback-build.json').read_text())['lessonContracts']
assert set(attack)=={'earned-attack'}
change=attack['earned-attack']
assert scope['protectedLessonHashes']['earned-attack']==change['baseline']
scope['protectedLessonHashes']['earned-attack']=change['candidate']
court=json.loads((ROOT/'docs/features/court-consequences-build.json').read_text())['lessonContracts']
assert set(court)=={'earned-defence','earned-net','middle-return','second-serve','serve-plus-one','split-step','the-winner','saturday-point-2'}
for slug,change in court.items():
    assert scope['protectedLessonHashes'][slug]==change['baseline']
    scope['protectedLessonHashes'][slug]=change['candidate']
for slug,p in cards.items():
    data=json.loads((ROOT/'app/lessons'/f'{slug}.json').read_text())
    assert data['lesson'].get('pro')==p,('stale professional context',slug)
    if p:
        assert set(p) in [set('kind player label moment read src url'.split()),set('kind player label moment read src url note'.split())]
        assert p['kind'] in kinds
        assert all(isinstance(v,str) and v.strip() for v in p.values())
        assert urlparse(p['url']).scheme=='https' and urlparse(p['url']).netloc
        assert '<' not in ''.join(p.values()),('authored insight is plain text',slug)
        assert p['read'].startswith('Your next point:'),slug
    data['lesson'].pop('pro',None)
    # These are the only reviewed teaching edits outside the professional card.
    if slug=='split-step':
        assert data['lesson']['cue']=='Watch their hit. Time your landing.'
        assert data['lesson']['drill']['name']=='Time the landing'
        data['lesson'].pop('cue');data['lesson'].pop('drill')
        for step in data['lesson']['steps']:step.pop('why',None)
    assert digest(data)==scope['protectedLessonHashes'][slug],('scene, choices or unrelated teaching drift',slug)
assert '43%' not in cards['find-your-return-spot']['moment']
assert 'Where they stood decided it' not in cards['the-pusher']['read']
assert all(cards[s]['kind'] in {'From the players','From the coach'} for s in slugs if s.startswith('doubles-'))
assert 'Mattek-Sands' in (ROOT/'app_src/reset.js').read_text()
print(f'PASS: {len(slugs)} protected lesson/scene contracts; {sum(bool(v) for v in cards.values())} sourced cards; {sum(v is None for v in cards.values())} explicit fallbacks')
