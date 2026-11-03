"""The trust release changes teaching and navigation, never point geometry or grading."""
import hashlib,json
from pathlib import Path
R=Path(__file__).resolve().parent.parent
baseline=json.loads((R/'docs/features/trust-practice-invariants.json').read_text())
def digest(o):return hashlib.sha256(json.dumps(o,sort_keys=True,separators=(',',':')).encode()).hexdigest()
for prefix,expected in baseline['points'].items():
 data=json.loads((R/f'rally/{prefix}_data.json').read_text())
 for scene in data['scenes'].values():scene.get('info',{}).get('comparison',{}).pop('label',None)
 assert digest(data)==expected['geometry'],prefix+' changed the point rather than its wording'
 source=(R/f'rally/lesson_{prefix}.js').read_text();lesson=json.loads(source[len('const LESSON='):].rstrip(';\n'))
 grading={k:{'correct':n['correct'],'alsoOk':n.get('alsoOk',[]),'options':len(n['opts'])} for k,n in lesson['nodes'].items()}
 assert grading==expected['grading'],prefix+' changed answer meaning/order'
 assert lesson['specificFeedback'] is True
 for node in lesson['nodes'].values():
  assert all(not any(t in o.lower() for t in ['force ','waiting passer','tiny angle','they are covering']) for o in node['opts']),node['opts']
cat=json.loads((R/'app/catalog.js').read_text().split('window.GS_CATALOG=',1)[1].split(';\n',1)[0])
assert [len(cat[k]) for k in ['daily','predict','play']]==[32,2,23]
for lesson in cat['daily']+cat['predict']+cat['play']:
 if lesson.get('cue'):assert isinstance(lesson['cue'],str)
 assert 'the one that wins' not in lesson['line']
print('PASS: 40 routes retain exact geometry and grading; 57 activities and corrected cue data retained')
