"""Protect existing lesson contact/timing and captured limbs during adaptation."""
import json, math
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
original={}
for path in (ROOT/'rally').glob('*_data.json'):
    for k,c in json.loads(path.read_text()).get('clips',{}).items():original.setdefault(k,c)
changed=[]
for k in ['bh','bhlo','bhChest','bhHigh','bhHigher','bhSlice','lowfv','bv','fvhi']:
    c=json.loads((ROOT/f'app/clips/{k}.json').read_text());old=original[k]
    J={n:i for i,n in enumerate(c['joints'])};ci=c['contactFrame']-1
    assert c['contactFrame']==old['contactFrame'] and c['frameCount']==old['frameCount'],k
    assert c['contactBall']==old['contactBall'],k
    assert math.dist(c['racquetFrames'][ci]['centre'],old['racquetFrames'][ci]['centre'])<.0003,(k,'contact centre moved')
    for P,O in zip(c['frames'],old['frames']):
        for side in ['L','R']:
            for a,b in [('shoulder','elbow'),('elbow','wrist'),('hip','knee'),('knee','ankle')]:
                assert abs(math.dist(P[J[a+side]],P[J[b+side]])-math.dist(O[J[a+side]],O[J[b+side]]))<.0004,(k,'limb stretched')
    if k.startswith('bh') and k!='bhSlice':
        for P,r in zip(c['frames'][max(0,ci-62):ci+46],c['racquetFrames'][max(0,ci-62):ci+46]):
            grip=[r['grip'][j]+.105*r['axis'][j] for j in range(3)]
            assert math.dist(P[J['wristL']],grip)<.06,(k,'supporting hand leaves handle')
    if k in ['lowfv','bv','fvhi']:
        # A compact follow-through should not grow into an overhead swing.
        for P in c['frames'][ci:ci+33]:
            assert P[J['wristR']][2]<P[J['head']][2]-.12,(k,'volley reaches above head')
    changed.append(k)
catalog=json.loads((ROOT/'app/catalog.js').read_text().split('window.GS_CATALOG=')[1].split(';\n')[0])
affected=[r['slug'] for group in ['daily','predict','play'] for r in catalog[group] if set(r['clips'])&set(changed)]
print(f'PASS: {len(changed)} shared clips retain contact, timing and limb lengths; {len(affected)} existing journeys use them')
print(', '.join(affected))
