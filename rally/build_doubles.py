"""Six authored doubles points. Existing licensed clips; explicit four-player routes.
Build batch 1 before 2. Ball flights are illustrations, not outcome predictions.
"""
import copy, json, math, sys
from pathlib import Path
from build_live_ten import placed, ready, append_flight, node
R=Path(__file__).resolve().parent
LTA='https://www.lta.org.uk/play/tennis-tips-and-techniques/essential-doubles-tactics-and-hand-signals/'
TI='https://www.tennisireland.ie/news/tennis-unlocked-doubles-communication-is-key'
ROWS=[
 dict(batch=1,p='dc',slug='doubles-cross-cover',title='They Cross. You Cover.',family='doubles-serve',kind='serve',variant=False,
  intro='You serve. Your partner crosses for the return. For a moment, their old side looks painfully open.',
  q='Your partner is crossing. Where do you move?',opts=['Cover the half they leave','Hold your serving side'],good=0,
  lines=['You cover behind your crossing partner. Both halves have an owner.','You stay on the same half as your partner. The reply sends you across late.'],
  cue='Partner crosses. Cover the space they leave.',plan='If you cross for the return, I cover behind you. Let’s agree the serve target first.',
  why='A crossing net partner changes the server’s coverage job. Move while the ball travels, then read the actual reply. The cover is an adjustment to this crossing movement, not an automatic switch after every serve.',
  insight='Coach Peter Farrell asks club players to practise telling their partner the intended serve location before each point. It gives the net player something concrete to work with.',source='Peter Farrell · Tennis Ireland',url=TI,
  drill='Agree a serve target and a crossing signal. Play the return and two more balls. After each point, both name the space they were covering.'),
 dict(batch=1,p='dr',slug='doubles-return-space',title='Return Past the Net Player',family='doubles-return',kind='return',variant=False,
  intro='The net player looks ready to pounce. You still have a crosscourt lane to the server. Don’t let their presence choose your return.',
  q='Which return uses the space they are giving you?',opts=['Return crosscourt toward the server','Return down their net player’s side'],good=0,
  lines=['You pass the net player. Both prepare for the server’s reply.','Their net player intercepts. Both of you have less time for the volley.'],
  cue='Read the net player. Return through the available space.',plan='Let’s read the net player before returning. Use the crosscourt lane when it is available, then get ready together.',
  why='A crosscourt return often gives a useful lane away from the opposing net player. Watch the actual position: a player moving across can change that choice. Your partner must also adjust for the next hitter.',
  insight='The LTA describes four active doubles roles. Even when only one player strikes the ball, the other three are adjusting to its direction and their partner’s position.',source='LTA · Doubles tactics',url=LTA,
  drill='Serve ten practice points. The net player sometimes holds and sometimes moves across. Returners name the lane they saw; both partners recover for the reply.'),
 dict(batch=1,p='dlb',slug='doubles-lob-switch',title='Who Takes the Deep Lob?',family='doubles-lob',kind='lob',variant=False,
  intro='A deep lob goes over you. Your partner is already deeper. Both of you chasing it would leave nobody organising the next ball.',
  q='Who takes this deep lob?',opts=['Call partner through and switch across','Turn and retrieve it yourself'],good=0,
  lines=['Your deeper partner retrieves. You cross and retreat into a supporting position.','You take the longer run. Your deeper partner could have retrieved sooner.'],
  cue='Call early. Cover while your partner retrieves.',plan='For a lob beyond the net player, call early: “Yours, switching.” The retriever calls “Mine”; the other player covers and retreats.',
  why='Here the deeper partner has the shorter route. An early call assigns the ball and the uncovered half. Turn to run; don’t backpedal under a ball already beyond comfortable overhead range.',
  insight='The LTA’s doubles guidance connects each player’s movement to their partner and the ball. On a deep lob, helping can mean covering the space rather than chasing the same ball.',source='LTA · Doubles tactics',url=LTA,
  drill='Start one up, one back. Feed a deep lob. Require an early ownership call, a switch and a recovery shot, then play out the next two balls.'),
 dict(batch=2,p='dh',slug='doubles-hold-cover',title='They Hold. So Do You.',family='doubles-serve',kind='serve',variant=True,transferOf='doubles-cross-cover',
  intro='Same serving pair. This time your partner holds position and the return comes to your half. The crossing plan no longer fits.',
  q='Your partner holds their side. Where do you recover?',opts=['Start crossing behind your partner','Keep covering your serving side'],good=1,
  lines=['You switch without your partner crossing, then reverse for the return.','You keep responsibility for your half and prepare for the return.'],
  cue='Partner holds. Keep covering your half.',plan='If you hold at the net, I keep my half. We switch when the movement calls for it, not automatically.',
  why='Switching is a response to your partner’s movement. Here they hold, so a blind switch leaves the return lane uncovered. Recover, split for the return and read the height you receive.',
  insight='Peter Farrell’s serve-location practice gives both partners a shared starting plan. The point still asks you to read what actually happens after that plan.',source='Peter Farrell · Tennis Ireland',url=TI,
  drill='Alternate agreed cross and hold signals before serving. Play the return. The server must cover the appropriate half without guessing from the previous point.'),
 dict(batch=2,p='drl',slug='doubles-return-line',title='Now the Line Is Open',family='doubles-return',kind='return',variant=True,transferOf='doubles-return-space',
  intro='The net player moves early toward the middle. This serve gives you enough time to see the lane they have left.',
  q='Their net player moves across early. What changes?',opts=['Keep returning crosscourt','Use the line they have left'],good=1,
  lines=['This time their crossing net player is in the crosscourt lane. They intercept.','You use the open line with margin. Their server can still retrieve.'],
  cue='When they leave the line, read the opening.',plan='If their net player crosses early and the serve gives us time, use the vacated line with margin. Keep covering the next ball.',
  why='The same return target is not right for every net position. The line is available here because the net player moves early and your contact is manageable. It is not a command to hit a low-percentage winner.',
  insight='The LTA links forward and sideways movement to pressure and coverage. A net player can close one lane while opening another; the returner has to see the trade-off.',source='LTA · Doubles tactics',url=LTA,
  drill='Repeat the return drill with an occasional early crossing move. Reward recognising the changed lane and recovering; do not award extra points for outright winners.'),
 dict(batch=2,p='dlo',slug='doubles-lob-overhead',title='This Lob Is Yours',family='doubles-lob',kind='lob',variant=True,transferOf='doubles-lob-switch',
  intro='This lob is shorter. You have time to turn and get under it. Calling your partner through would give away that comfortable overhead.',
  q='You can reach this lob in balance. Who takes it?',opts=['Call partner through and switch','Call “Mine” and take the overhead'],good=1,
  lines=['Your partner retrieves after the bounce. You gave up a reachable overhead.','You turn, set and take the overhead. Your partner covers the space behind you.'],
  cue='Reachable overhead? Call it. Your partner covers.',plan='Take a reachable overhead with an early “Mine.” The partner covers behind. If it carries beyond reach, call the switch early.',
  why='Lob depth and your balance decide ownership. A comfortable overhead need not trigger a switch. Place it with margin and prepare for another ball; an overhead is not a guaranteed finish.',
  insight='The LTA’s four-role framework keeps the non-hitter involved. When one player takes the overhead, the partner still has a coverage job.',source='LTA · Doubles tactics',url=LTA,
  drill='Mix short and deep lobs without announcing them. Call ownership early. After a reachable overhead, insist on playing the next defensive reply.')
]
CL={}
for p in ('sv','sr','tb','tv','sd','nr'):
 for k,v in json.loads((R/f'{p}_data.json').read_text())['clips'].items():
  if k in CL: assert CL[k]==v,k
  CL[k]=v
def hold(s,who,xy,f): s['actors'][who].append(ready(xy,f,who.startswith('opp')))
def hit(s,who,clip,f,p):
 s['actors'][who].append(placed(CL,clip,p,f,who.startswith('opp')))
 s['info']['contacts'].append([f,who,clip])
def arc(s,p,n):
 a=s['ball'][-1];T=n/100
 for i in range(1,n+1):
  u=i/n;s['ball'].append([round(a[j]+(p[j]-a[j])*u+(4.905*T*T*u*(1-u) if j==2 else 0),5) for j in range(3)])
 return len(s['ball'])-1,s['ball'][-1]
def bounce(s,target,time,post=.18):return append_flight(s,target,time,post)
def initial(kind,variant):
 pos={'you':[1.6,-11.8],'partner':[-2.4,-2.8],'opp':[-2.5,11.8],'oppPartner':[2.5,4.8]}
 if kind=='return':pos={'you':[-2.8,-11.5],'partner':[2.5,-5.2],'opp':[.6,12],'oppPartner':[-2.5,2.7]}
 if kind=='lob':pos={'you':[-2,-2.5],'partner':[2,-7.5],'opp':[-1,11],'oppPartner':[2.5,4.5]}
 return dict(ball=[],marks=[],actors={k:[ready(v,0,k.startswith('opp'))] for k,v in pos.items()},info=dict(doubles=True,livePoint=True,outcome='in_play',contacts=[],splitsByActor={}))
def route(d,a,b):
 s=initial(d['kind'],d['variant']);v=d['variant'];kind=d['kind']
 if kind=='serve':
  s['ball']=[None]*180+[[1.5,-11.5,2.6455]];hit(s,'you','serveT',180,s['ball'][-1]);hold(s,'you',[1.3,-10.6],245)
  f,p=bounce(s,[-2.3,5.2],.78,.34);hit(s,'opp','fh',f,p);hold(s,'opp',[-2,10.8],f+70)
  freeze=f+12
  hold(s,'you',[1.3,-10.6],freeze+1)
  if not v:
   hold(s,'partner',[-2.4,-2.8],f-20);f,p=arc(s,[.7,-2.4,1.4],98);hit(s,'partner','fvhi',f,p);hold(s,'partner',[1.7,-2.8],f+65)
   f,p=arc(s,[1.5,4.2,1.3],85);hit(s,'oppPartner','bv',f,p);hold(s,'oppPartner',[1.5,3.3],f+65)
   their=f;hold(s,'you',[-2.1 if a==0 else 1.7,-9.4],f-15)
   f,p=bounce(s,[-2.8,-8.2],1.18,.20)
  else:
   hold(s,'partner',[-2,-2.4],f+80);their=f;hold(s,'you',[-.3 if a==0 else 1.6,-10.4],freeze+55)
   f,p=bounce(s,[2.5,-8.4],1.3,.20)
  first=their;hit(s,'you','bh' if p[0]<0 else 'fh',f,p)
 elif kind=='return':
  s['ball']=[None]*180+[[.6,11.5,2.6455]];hit(s,'opp','serveT',180,s['ball'][-1]);hold(s,'opp',[.5,11.7],245)
  f,p=bounce(s,[-2.5,-5.6],.86,.38);hit(s,'you','fh',f,p);freeze=f-14;first=f
  hold(s,'opp',[.5,11.7],freeze+1)
  hold(s,'partner',[2.5,-5.2],freeze+1)
  hold(s,'oppPartner',[1.7 if v else -2.5,2.8],freeze)
  intercept=(a!=int(v))
  if intercept:
   f,p=arc(s,[1.6 if a==0 else -2.5,3,1.4],91);hit(s,'oppPartner','bv' if a else 'fvhi',f,p)
  else:
   f,p=bounce(s,[2.8 if a==0 else -3.3,9.2],1.45,.18);hit(s,'opp','fh' if a==0 else 'bh',f,p)
  their=f;hold(s,'you',[-2.9,-10.8],f-10);hold(s,'partner',[1.8,-4.2 if not intercept else -5.5],f+40)
  hold(s,'oppPartner',[.7 if v else -1.8,3.5],f+70)
  f,p=bounce(s,[-2.2,-8.3],1.35,.20);hit(s,'you','fh',f,p)
 else:
  s['ball']=[None]*100+[[-1,10.5,1.05]];hit(s,'opp','fh',100,s['ball'][-1]);freeze=175;first=100
  if not (v and a==1):hold(s,'you',[-2,-2.5],freeze+1)
  hold(s,'partner',[2,-7.5],freeze+1);hold(s,'opp',[-1,11],freeze+1)
  # Identical rising ball until the chosen overhead intercept; otherwise it bounces.
  f,p=bounce(s,[-2,-5 if v else -9.2],1.75 if v else 2.35,.19)
  if v and a==1:
   s['info']['doublesBlend']=['you']
   f=244;s['ball']=s['ball'][:f+1];s['marks']=[];p=s['ball'][-1];hit(s,'you','sm',f,p);hold(s,'partner',[1,-6.5],f+20)
  elif a==0:
   hit(s,'partner','bh',f,p);hold(s,'you',[2,-6],f+45)
  else:
   hit(s,'you','bh',f,p);hold(s,'partner',[2,-7],f-30)
  first=f;f,p=bounce(s,[1.6,8.5],1.45,.18);hit(s,'opp','fh',f,p);their=f
  hold(s,'oppPartner',[2.3,3.7],f-10)
  if a==0:
   hold(s,'partner',[-2,-7.8],f);f,p=arc(s,[2,-5.8,1.22],125);hit(s,'you','lowfv',f,p)
  elif v:
   hold(s,'you',[-1.8,-3.8],f-25);f,p=arc(s,[-1.5,-3.6,1.35],115);hit(s,'you','bv',f,p)
  else:
   hold(s,'you',[-2,-10.2],f-30);f,p=bounce(s,[-2.4,-8.4],1.3,.20);hit(s,'you','bh',f,p)
 next_hit=f;decision=f-14
 if kind=='lob':s['info']['flashes']=[[freeze+16,'you','YOURS · SWITCH' if a==0 else 'MINE']]
 # Non-hitters cannot anticipate which final target the learner will choose.
 for who in ('opp','oppPartner'):
  last=s['actors'][who][-1];hold(s,who,last['T'][:2],f+16)
 target=[-.3,9.5] if b==0 else [3.7,5.8]
 bounce(s,target,1.48 if b==0 else 1.26,.14)
 hold(s,'you',[max(-2,min(2,p[0])),-6.5 if p[1]>-7 else -9.5],f+95)
 hold(s,'partner',[-2 if p[0]>0 else 2,-5.8],f+105)
 last_x=s['actors']['opp'][-1]['T'][0]
 hold(s,'opp',[last_x+max(-3,min(3,target[0]-last_x)),10.1],len(s['ball'])-1)
 hold(s,'oppPartner',[1 if target[0]<1 else 2.4,4.5],len(s['ball'])-1)
 for who in s['actors']:
  s['info']['splitsByActor'][who]=[[t+3,16] for t,w,_ in s['info']['contacts'] if w.startswith('opp')!=who.startswith('opp')]
 s['frames']=len(s['ball']);s['fps']=100
 s['info']['from']=freeze
 s['info'].update(freeze=decision,shot={'land':target},authoredPoint=dict(firstHit=first,theirHit=their,nextHit=next_hit,illustrated=True),
  comparison=dict(start=max(0,freeze-30),end=decision if kind=='serve' and v else min(decision,their+16),good=a==d['good'],label=d['opts'][a],explanation=d['lines'][a],event='pair_coverage'))
 return s,freeze,decision
def build(d):
 assert len(d['cue'])<=75 and all(len(x)<=80 for x in d['lines']),d['slug']
 root=d['p'];scenes={};nodes={}
 for a,X in enumerate('AB'):
  for b,Y in enumerate('AB'):
   s,freeze,decision=route(d,a,b);s['info']['doublesParent']={'scene':root+X,'through':decision}
   scenes[root+X+Y]=s
  prefix=copy.deepcopy(scenes[root+X+'A']);prefix['info']['doublesParent']={'scene':root,'through':freeze};prefix['ball']=prefix['ball'][:decision+1];prefix['marks']=[m for m in prefix['marks'] if m['frame']<=decision];prefix['frames']=decision+1;prefix['info']['freeze']=freeze;prefix['info']['from']=0;scenes[root+X]=prefix
  nodes[root+X]=node(dict(d,principle=d['cue']),root+X,'Your pair has reorganised. Read this contact before trying to finish.','What does this next ball call for?',
   ['Use controlled depth through the middle','Try the shorter outside angle'],0,
   ['You give the ball room and prepare together for another reply.','It lands here, but the smaller target leaves less margin. Keep covering.'])
  nodes[root+X]['opening']=dict(scene=root+X+'A',**{'from':decision,'to':decision},label='Read the next ball',after='Choose from this contact',silent=True,continuous=True)
 opening=copy.deepcopy(scenes[root+'A']);opening['info'].pop('doublesParent');scenes[root]=opening
 nodes[root]=node(dict(d,principle=d['cue']),root,d['intro'],d['q'],d['opts'],d['good'],d['lines'])
 cam={'c':{'az':-90,'el':32,'d':31,'fov':32,'tgt':[0,0,1.6]},'phone':{'az':-90,'el':34,'d':42,'fov':24,'tgt':[0,0,1.6]}}
 lesson=dict(title=d['title'],hook=d['intro'],liveIntro=d['intro'],livePoint=True,doubles=True,decisionCount=2,specificFeedback=True,edition='doubles-v1',family=d['family'],
  branch=root,nodes=nodes,steps=[],finaleScene=root+'AA',finaleFull=True,memHTML=d['cue'],cue=d['cue'],tomorrow=d['cue'],pairPlan=d['plan'],
  followup=next((x['slug'] for x in ROWS if x.get('transferOf')==d['slug']),None),transferOf=d.get('transferOf'),returnPrompt='Same partnership. Read what has changed.',
  learningSignals=['pair-coverage','next-contact'],comparison=dict(own='Your first call',other='Change that call',ownLabel='Your first call',summary='All four players stay involved. This is one illustrated continuation, not a predicted result.',intro='Same incoming ball. Compare how the first call changes the pair’s next job.',camera=cam),
  liveFeedback={'summaries':{'11':'You read the pair’s coverage and gave the next ball room.','10':'The pair’s first move fitted. The next contact still needed margin.','01':'Your next shot had margin. Review the first coverage call together.','00':'Review the first call, then choose a target that fits the next contact.'}},
  completionIntro='One call. Two responsibilities. Take the plan to your next match.',redoLabel='Play the point again',frameHeight=8 if d['kind']=='lob' else 5,
  cam0=cam,pro=dict(player=d['source'],label='From the coaching court',moment=d['insight'],read=d['why'],src=d['source'],url=d['url']),drill=dict(name='Rehearse as a pair',how=d['drill']))
 used={a['clip'] for s in scenes.values() for acts in s['actors'].values() for a in acts}
 (R/f'{root}_data.json').write_text(json.dumps(dict(fps=100,clips={k:CL[k] for k in sorted(used)},scenes=scenes),separators=(',',':')))
 (R/f'lesson_{root}.js').write_text('const LESSON='+json.dumps(lesson,ensure_ascii=False,separators=(',',':'))+';\n')
 print(d['batch'],d['slug'],len(scenes),'scenes')
if __name__=='__main__':
 for d in ROWS:
  if len(sys.argv)<2 or d['batch']<=int(sys.argv[1]):build(d)
