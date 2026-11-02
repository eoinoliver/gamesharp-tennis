"""Independent evidence checks for each newly authored connected route."""
import json,math,sys
from pathlib import Path
R=Path(__file__).resolve().parent.parent
rows=json.loads((R/'docs/features/ten-live-voice.json').read_text())
for row in rows:
 d=json.loads((R/f"rally/{row['prefix']}_data.json").read_text());sc=d['scenes'];root=row['prefix']+'1'
 for X in 'AB':
  a,b=sc[root+X+'A'],sc[root+X+'B'];info=a['info']['authoredPoint'];f=info['firstHit'];h=info['nextHit']
  assert a['ball'][:h+1]==b['ball'][:h+1],'second choice changes its incoming ball'
  assert a['actors']['you'][:3]==b['actors']['you'][:3]
  assert sc[root+X]['ball']==a['ball'][:sc[root+X]['frames']],'route resets before question two'
  assert a['ball'][h+30]!=b['ball'][h+30],'second choice has no consequence'
  for s in (a,b):
   assert s['frames']==len(s['ball'])
   assert s['info']['outcome']=='in_play','do not invent wins'
   assert all(v is None or all(math.isfinite(n) for n in v) for v in s['ball'])
   for j in range(f+1,s['frames']):
    p,q=s['ball'][j-1:j+1];assert q[2]>=.025,('underground',row['lesson'],j)
    if p[1]*q[1]<0:
     u=-p[1]/(q[1]-p[1]);x=p[0]+u*(q[0]-p[0]);z=p[2]+u*(q[2]-p[2]);net=.914+.156*min(1,abs(x)/6.4)**2
     assert z>net+.04,('net crossing',row['lesson'],X,z,net)
   for mark in s['marks']:
    assert mark['frame']<s['frames']
    if mark['frame']>f:
     x,y,z=s['ball'][mark['frame']];assert abs(x)<4.115 and abs(y)<11.885 and abs(z-.033)<.003,('bounce',row['lesson'],mark)
 a,b=sc[root+'AA'],sc[root+'BA'];f=a['info']['authoredPoint']['firstHit']
 assert a['ball'][:f+1]==b['ball'][:f+1],'comparison changes initial incoming'
 assert a['ball'][f+50]!=b['ball'][f+50],'first choice has no consequence'
 ha,hb=a['info']['authoredPoint']['nextHit'],b['info']['authoredPoint']['nextHit']
 assert math.dist(a['ball'][ha],b['ball'][hb])>.6,'first choices lead to the same read'
 if row['prefix']=='tf':
  low=a['ball'][a['info']['authoredPoint']['theirHit']][2];high=b['ball'][b['info']['authoredPoint']['theirHit']][2]
  assert low<.914 and high>1.25,'passing choices must create genuinely different volley heights'
 if row['prefix']=='tb':
  r=b['info']['authoredPoint'];lob=b['ball'][r['firstHit']:r['theirHit']]
  over=min(lob,key=lambda p:abs(p[1]-2));assert over[2]>3.5,'lob must clear the close net player'
  assert b['ball'][r['theirHit']][1]>10,'opponent must chase the deep lob'
 if row['prefix']=='td':
  assert a['ball'][f][2]<.75 and a['info']['liveSetup']['move']>100,'late pickup must be visibly low and late'
  assert a['actors']['opp'][0]['clip']=='drop','incoming action must be a drop stroke'
print(f'PASS: {len(rows)*4} routes; continuous choices, net clearance, legal bounces and changed next contacts')
