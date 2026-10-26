"""Deterministic bounded repair of the existing Contact Clue authored data.

No clip or elbow/hand/racket rotation is changed. Fix two measured defects:
1. First/next active poses were one frame behind their own ball contact sample;
   the held replay was already aligned and is deliberately left untouched.
2. The first 'net' miss crossed the net at 0.22m then displayed LONG. Stop it at
   the near net face and show a damped drop on the same side. The faster-but-still
   crowded option uses the same net-miss evidence, not a new measured speed claim.

Run from any directory. Idempotent; all original scene times/counts are retained.
This records an authored visual repair, not independent biomechanics approval.
"""
import json, math
from pathlib import Path

path=Path(__file__).with_name('cp_data.json')
data=json.loads(path.read_text())
clips=data['clips']

def net_tail(scene, start, end):
    """Locate the first incoming crossing of the near net face, then dissipate it."""
    ball=scene['ball'];cross=None
    for i in range(start+1,end+1):
        a,b=ball[i-1],ball[i]
        if a and b and a[1]<-.04<=b[1]:
            u=(-.04-a[1])/(b[1]-a[1])
            hit=[round(a[k]+u*(b[k]-a[k]),4) for k in range(3)]
            assert .033<hit[2]<.85, 'Expected the documented low net strike'
            cross=(i,hit);break
    # Reruns already contain the exact near-side collision sample.
    if cross is None:
        for i in range(start+1,end+1):
            if ball[i] and abs(ball[i][1]+.04)<1e-6 and ball[i][2]>.033:
                cross=(i,ball[i]);break
    assert cross, 'Missing documented net collision'
    frame,hit=cross
    for i in range(frame,end+1):
        dt=(i-frame)/100
        ball[i]=[round(hit[0]-.04*(1-math.exp(-5*dt)),4),
                 round(-.04-.30*(1-math.exp(-5*dt)),4),
                 round(max(.033,hit[2]-.35*dt-4.905*dt*dt),4)]
    return frame,hit

for key,scene in data['scenes'].items():
    if not key.startswith(('cp1','cp2','cp3')):continue
    active=[s for s in scene['actors']['you'] if not s.get('hold')]
    assert len(active)==3, 'Expected initial shot, held replay and selected next ball'
    active[0]['poseFrameOffset']=1
    active[1].pop('poseFrameOffset',None)
    active[2]['poseFrameOffset']=1
    if not key.startswith('cp1'):continue
    frame,hit=net_tail(scene,195,317)
    scene['marks']=[m for m in scene['marks'] if not (195<m['frame']<318 and (m.get('label') in ('LONG','NET') or m['kind']=='net'))]
    scene['marks'].append({'frame':frame,'pos':hit[:2],'kind':'net','label':'NET'})
    if key=='cp1A': # raw A is displayed C after the existing option permutation.
        # Preserve the original authored response: the crowded next contact still nets.
        # Reuse the same actual collision trajectory with its own contact time.
        start=active[-1]['start']+clips[active[-1]['clip']]['contactFrame']-2
        shift=start-195
        for i in range(start,scene['frames']):
            scene['ball'][i]=list(scene['ball'][min(i-shift,317)])
        final_frame=frame+shift
        scene['marks']=[m for m in scene['marks'] if m['frame']<start]
        scene['marks'].append({'frame':final_frame,'pos':hit[:2],'kind':'net','label':'NET'})
        scene['info']['shown']=hit
    scene['marks'].sort(key=lambda m:m['frame'])

path.write_text(json.dumps(data,separators=(',',':'))+'\n')

# In the standard forehand lesson, the ball reaches the authored contact point
# one scene frame before the pose reaches its contactFrame. Shift only the
# forehand strokes in this lesson one frame earlier; other strokes and lessons
# retain their authored timing.
path=Path(__file__).with_name('fb_data.json')
data=json.loads(path.read_text())
aligned=0
for scene in data['scenes'].values():
    for actor in scene['actors']['you']:
        if not actor.get('hold') and actor.get('clip') in ('fh','fhlo','fhhi','fhCramped'):
            actor['poseFrameOffset']=1
            aligned+=1
path.write_text(json.dumps(data,separators=(',',':'))+'\n')
print(f'Contact truth repaired: 24 Contact Clue pose offsets; four initial net collisions; one selected net consequence; {aligned} normal forehand pose offsets')
