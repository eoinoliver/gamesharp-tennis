"""Authored connected points, released in reviewed batches of 3/3/3/1.

Reuse the licensed incoming action and shared repaired strokes. Subsequent balls
are declared illustrations, with continuous gravity/bounce arcs and explicit
contacts. They are not match capture or predictions of the opponent's response.
"""
import copy
import json
import math
from pathlib import Path

R = Path(__file__).parent
TA = 'https://www.tennis.com.au/wp-content/uploads/2014/11/Technical-and-Tactical-fundamentals-guidelines_low-res.pdf'
LTA = 'https://www.lta.org.uk/advantage-home/content/simple-steps-to-improving-your-return-of-serve/'

# Each row authors both branches: target, flight time, bounce-to-contact time,
# then the opponent's actual reply. A different first shot creates a new read.
POINTS = [
 dict(batch=1,prefix='tp',slug='live-point-return-pressure',title='Return Under Pressure',family='return-pressure',
      source=['rs','rs1A'],hit=262,followup='live-point-return-time',
      intro='A fast serve is coming into your backhand. Your preparation window is small.',
      q='What does this serve give you time for?',opts=['Compact return with depth through the middle','Aim close to the sideline'],good=0,
      lines=['Your deeper return keeps their next contact behind the baseline. Read the reply.', 'The narrow return lands shorter here. They step in and send you wide.'],
      branches=[dict(target=[0,10],time=1.30,post=.20,reply=[-1.8,-9.3],replyTime=1.30,replyPost=.20),
                dict(target=[-3.7,7.5],time=1.13,post=.15,reply=[3.25,-9.8],replyTime=1.10,replyPost=.20)],
      situations=['They reply to your backhand with depth. You have recovered into range.', 'Their earlier contact sends you wide to the forehand. You are still adjusting.'],
      secondQ='What fits the reply you actually receive?',secondOpts=['Height and depth through the middle','Force a narrow change of direction'],secondGood=[0,0],also=[[],[]],
      secondLines=[['You keep a broad target and time to recover. Still in play.', 'It lands in this illustration, but the narrow target gives away margin.'],
                   ['You buy recovery time from the wider contact. Still in play.', 'This one lands, but forcing the line while adjusting adds risk.']],
      secondTargets=[[[0,9.5],1.45], [[-3.7,10.4],1.12]],
      cue='Read the pace. Give your return room, then recover.',
      principle='The serve sets your preparation time. The next ball sets your next decision.',
      why='A fast serve rewards compact preparation and a generous target. These are two possible replies, not guaranteed outcomes. Read the depth and your balance again before changing direction.',
      pro='A compact block is useful when serve speed removes time; a fuller return becomes available when time permits.',url=LTA,
      drill='Alternate faster and slower serves to the same wing. Call “compact” or “time” before the return, then play one more ball.',
      signals=['serve-pace','reply-margin']),
 dict(batch=1,prefix='tt',slug='live-point-return-time',title='Return With Time',family='return-pressure',
      source=['mr','mr3A'],hit=280,transferOf='live-point-return-pressure',
      intro='This serve arrives more slowly. You can meet it inside the baseline with space to swing.',
      q='What can you do with the time available?',opts=['Guide the return short through the middle','Use controlled depth into the backhand side'],good=1,
      lines=['The short return lets them move in. Now read the pressure they create.', 'You use your time to move them back and across. Watch their reply.'],
      branches=[dict(target=[0,6.6],time=1.15,post=.18,reply=[-3.3,-9.8],replyTime=1.12,replyPost=.20),
                dict(target=[2.8,10.1],time=1.28,post=.20,reply=[.3,-7.5],replyTime=1.55,replyPost=.20)],
      situations=['Their reply is deep and wide to your backhand. The return gave them time.', 'Their reply lands shorter. You can move forward and organise the forehand.'],
      secondQ='What has your return created?',secondOpts=['Use controlled depth into the open side','Lift through the middle and recover'],secondGood=[1,0],also=[[],[1]],
      secondLines=[['The open side is tempting, but your wide contact makes it demanding.', 'You reset with margin from a pressured contact. Keep recovering.'],
                   ['You use the shorter reply without aiming for the line. The point continues.', 'A sound reset. This shorter ball also offered controlled pressure.']],
      secondTargets=[[[ -2.8,9.3],1.20], [[0,9.8],1.55]],
      cue='Use the time. Apply pressure, then read what comes back.',
      principle='Pressure comes from the serve you receive, not its first-or-second label.',
      why='More preparation time and an organised contact make controlled return pressure available. Depth changes where the server plays next. If the next ball pushes you wide, reset; if it sits shorter, pressure is an option. A safe reset remains defensible.',
      pro='Return preparation changes with available time. Compact blocking and a fuller swing are responses to the actual serve, not automatic rules for first and second serves.',url=LTA,
      drill='Have a partner vary serve pace without announcing it. Return to a large target and call the depth of the next ball before playing it.',signals=['return-opportunity','next-contact']),
 dict(batch=1,prefix='tl',slug='live-point-line-tempting',title='The Line Is Tempting',family='direction-change',
      source=['line','ln1B'],hit=189,followup='live-point-line-opens',
      intro='You are pulled wide and behind the baseline on your backhand. The opposite sideline looks inviting.',
      q='Does this contact support changing direction?',opts=['Lift crosscourt with room','Drive close to the line'],good=0,
      lines=['The higher crosscourt ball gives you time to cover. Read their next direction.', 'You change direction from a stretched contact. Their reply takes you across the court.'],
      branches=[dict(target=[2.8,9.9],time=1.70,post=.18,reply=[1.8,-9.2],replyTime=1.43,replyPost=.20),
                dict(target=[-3.7,10.3],time=1.24,post=.18,reply=[3.4,-9.6],replyTime=1.16,replyPost=.20)],
      situations=['You used the extra flight time. Their reply now comes to your forehand.', 'Their crosscourt reply sends you a long way to the forehand. You are hurried.'],
      secondQ='Choose from this contact, not the last one.',secondOpts=['Lift deep through the middle','Press into the open side'],secondGood=[0,0],also=[[1],[]],
      secondLines=[['You restore depth and cover the next angles. Still in play.', 'You have room for controlled pressure here. Recover again after contact.'],
                   ['The higher reply gives you another recovery window.', 'It lands here, but pressing while hurried leaves little margin.']],
      secondTargets=[[[0,9.7],1.55], [[-3.2,10.0],1.20]],
      cue='Balance before direction. Give yourself room to recover.',
      principle='An empty corner is only an opportunity if your contact supports the shot.',
      why='A wide, low contact behind the baseline makes a direction change more demanding and leaves court to cover. Higher crosscourt play can buy recovery time. Judge the next shot from the new ball and balance, not from whether the previous attempt happened to land.',
      pro='Technical and tactical fundamentals connect shot selection with balance, court position and recovery. The point applies those principles to a stretched direction change.',url=TA,
      drill='Alternate a wide deep feed and a shorter central feed. Call “hold” or “change” before contact; recover and play the next ball.',signals=['direction-margin','recovery-read']),
]

def rot(v,yaw):
    c,s=math.cos(yaw),math.sin(yaw)
    return [c*v[0]-s*v[1],s*v[0]+c*v[1],v[2]]

def placed(clips,clip,point,hit,opp=False,yaw=None):
    yaw=math.pi if opp else 0 if yaw is None else yaw
    c=clips[clip];local=rot(c['racquetFrames'][c['contactFrame']-1]['centre'],yaw)
    return dict(clip=clip,yaw=yaw,T=[round(point[i]-local[i],5) for i in range(3)],
                start=hit-c['contactFrame']+1,ghost=opp)

def ready(point,frame,opp=False):
    return dict(clip='ready',yaw=math.pi if opp else 0,T=[*point[:2],0],start=frame,hold=1,ghost=opp)

def flight(p0,target,duration,post=.20):
    """Gravity flight to a chosen bounce, then a damped bounce (100 fps)."""
    n=round(duration*100);m=round(post*100);T=n/100
    goal=[*target,.033];v=[(goal[i]-p0[i])/T for i in range(3)];v[2]+=4.905*T
    out=[]
    for f in range(1,n+m+1):
        t=f/100
        if f<=n:pos=[p0[i]+v[i]*t-(4.905*t*t if i==2 else 0) for i in range(3)]
        else:
            u=t-T;up=-(v[2]-9.81*T)*.65
            pos=[goal[0]+v[0]*.7*u,goal[1]+v[1]*.7*u,goal[2]+up*u-4.905*u*u]
        out.append([round(x,5) for x in pos])
    return out,n

def append_flight(s,target,duration,post):
    start=len(s['ball'])-1;track,bounce=flight(s['ball'][-1],target,duration,post)
    s['ball'].extend(track);s['marks'].append(dict(frame=start+bounce,pos=target,kind='bounce',label=None))
    return len(s['ball'])-1,s['ball'][-1]

def node(p,key,sit,q,opts,good,lines):
    return dict(scene=key,ph='Live Point',short='Read',name=q,sit=sit,q=q,opts=opts,correct=good,
                lines=dict(zip('AB',lines)),noTargets=True,rail=['Watch','Choose','See what changes'],
                unlock='Read the next ball',take=p['principle'],payoff=p['principle'],principle=p['cue'],why=p['why'])

def build(p):
    d=json.loads((R/(p['source'][0]+'_data.json')).read_text());base=d['scenes'][p['source'][1]]
    # Pool contains the same captured clips as the rest of the app. No new rig.
    clips={}
    for name in [p['source'][0],'line','av','nr']:
        for k,v in json.loads((R/(name+'_data.json')).read_text())['clips'].items():
            assert k not in clips or clips[k]==v,k
            clips[k]=v
    root=p['prefix']+'1';scenes={};nodes={};hit=p['hit'];freeze=hit-14
    first=next(a for a in base['actors']['you'] if not a.get('hold') and a['start']+clips[a['clip']]['contactFrame']-1-a.get('poseFrameOffset',0)==hit)
    s0=copy.deepcopy(base);s0['ball']=s0['ball'][:hit+1]
    # Source grids put the first outgoing sample one frame before their nominal
    # clip contact. Ease only the final incoming 8 samples to the exact stringbed.
    local=rot(clips[first['clip']]['racquetFrames'][clips[first['clip']]['contactFrame']-1]['centre'],first['yaw'])
    centre=[local[i]+first['T'][i] for i in range(3)]
    delta=[centre[i]-s0['ball'][-1][i] for i in range(3)]
    for f in range(hit-7,hit+1):
        u=(f-(hit-8))/8
        s0['ball'][f]=[round(s0['ball'][f][i]+delta[i]*u*u,5) for i in range(3)]
    s0['actors']['you']=[copy.deepcopy(a) for a in base['actors']['you'] if a is first or a.get('hold') and a['start']<first['start']]
    s0['actors']['opp']=[copy.deepcopy(a) for a in base['actors']['opp'] if a['start']<hit and (a.get('hold') or a['start']+clips[a['clip']]['contactFrame']-1<=hit)]
    s0['marks']=[dict(m,label=None) for m in base['marks'] if m['frame']<hit and m['kind']=='bounce']
    for i,X in enumerate('AB'):
        b=p['branches'][i];s=copy.deepcopy(s0)
        theirHit,pc=append_flight(s,b['target'],b['time'],b['post'])
        oppClip='bh' if pc[0]>1 else 'fh'
        s['actors']['opp'].append(placed(clips,oppClip,pc,theirHit,True))
        nextHit,nc=append_flight(s,b['reply'],b['replyTime'],b['replyPost'])
        nextClip='bhlo' if nc[0]<-.5 and nc[2]<.85 else 'bh' if nc[0]<-.5 else 'fhhi' if nc[2]>1 else 'fh'
        s['actors']['you'].extend([ready([-.3,-11.3],theirHit-32),placed(clips,nextClip,nc,nextHit)])
        # Recover to neutral coverage before seeing our second shot. Otherwise a
        # later hold target would make them anticipate the unchosen final reply.
        s['actors']['opp'].append(ready([0,11.6],nextHit))
        decision=nextHit-14
        s['info']=dict(freeze=decision,**{'from':freeze},livePoint=True,outcome='in_play',
            authoredPoint=dict(firstHit=hit,theirHit=theirHit,nextHit=nextHit,branch=X,source=p['source'],illustrated=True),
            splits=[[theirHit+3,16]],
            comparison=dict(start=max(0,hit-55),end=theirHit+12,good=i==p['good'],label=p['opts'][i],
                explanation='Same incoming ball and starting positions. Only the first choice changes; the reply shown is one possible response.',event='opponent_reply'))
        for j,Y in enumerate('AB'):
            end=copy.deepcopy(s);target,duration=p['secondTargets'][j]
            last,_=append_flight(end,target,duration,.12)
            end['actors']['you'].append(ready([0,-10.8],nextHit+80))
            # Show recovery, never a frozen spectator while the final ball lands.
            end['actors']['opp'].append(ready([target[0]*.75,11.6],last))
            end['frames']=len(end['ball']);end['info']['shot']={'land':target,'illustrated':True}
            scenes[root+X+Y]=end
        prefix=copy.deepcopy(scenes[root+X+'A']);prefix['ball']=prefix['ball'][:decision+1];prefix['frames']=len(prefix['ball'])
        prefix['marks']=[m for m in prefix['marks'] if m['frame']<=decision]
        prefix['info'].update(freeze=freeze,**{'from':0})
        scenes[root+X]=prefix
        n=node(p,root+X,p['situations'][i],p['secondQ'],p['secondOpts'],p['secondGood'][i],p['secondLines'][i])
        if p['also'][i]:n['alsoOk']=p['also'][i]
        # This is the same held instant reached by the first consequence. No
        # duplicate rally or silent reset between the two committed decisions.
        n['opening']=dict(scene=root+X+'A',**{'from':decision},to=decision,label='Read the reply',after='Choose from this contact',silent=True)
        nodes[root+X]=n
    nodes[root]=node(p,root,p['intro'],p['q'],p['opts'],p['good'],p['lines'])
    lesson=dict(title=p['title'],decisionCount=2,hook='Two connected choices. Watch what your first shot creates.',liveIntro=p['intro'],
        livePoint=True,family=p['family'],edition='ten-live-v1',branch=root,nodes=nodes,steps=[],finaleScene=root+'AA',finaleFull=True,
        memHTML=p['cue'],cue=p['cue'],callbackTags=p['signals'],tomorrow=p['principle'],followup=p.get('followup'),transferOf=p.get('transferOf'),
        returnPrompt='A different ball changes the decision. Try the paired point.' if p.get('followup') else None,learningSignals=p['signals'],
        liveFeedback=dict(summaries={'11':'Both choices fitted the contact and court you had. Keep reading as the point changes.',
          '10':'The first choice fitted. The next ball needed a fresh decision.', '01':'You adapted on the second ball. Compare what the first choice cost.',
          '00':'Compare the first choice, then read the next contact again. A landing alone does not prove a sound decision.'}),
        comparison=dict(own='Watch your first choice',other='Change only the first choice',ownLabel='Your first choice',
            summary='Compare what your first choice creates.',intro='Hold the incoming situation fixed. Change the first shot and watch the reply.'),
        completionIntro='Your first choice changed the next ball. Read each contact afresh.',redoLabel='Try another route through this point',
        pro=dict(player='Coaching fundamentals',label='Read the contact and court',moment=p['pro'],read=p['why'],src='LTA · Return of serve' if p['url']==LTA else 'Tennis Australia · Technical and tactical fundamentals',url=p['url']),
        drill=dict(name='Two-ball read',how=p['drill']))
    used={'ready'}|{a['clip'] for s in scenes.values() for aa in s['actors'].values() for a in aa}
    (R/(p['prefix']+'_data.json')).write_text(json.dumps(dict(clips={k:clips[k] for k in sorted(used)},scenes=scenes),separators=(',',':'))+'\n')
    (R/('lesson_'+p['prefix']+'.js')).write_text('const LESSON='+json.dumps(lesson,ensure_ascii=False,indent=2)+';\n')

if __name__=='__main__':
    for p in POINTS:build(p)
    print(f'{len(POINTS)} connected Live Points, {len(POINTS)*4} routes.')
