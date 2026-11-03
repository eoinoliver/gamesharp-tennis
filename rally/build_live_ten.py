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
      secondQ='What fits the reply you actually receive?',secondOpts=['Height and depth through the middle','Change direction toward the sideline'],secondGood=[0,0],also=[[],[]],
      secondLines=[['You keep a broad target and time to recover. Still in play.', 'It lands in this illustration, but the narrow target gives away margin.'],
                   ['You buy recovery time from the wider contact. Still in play.', 'This one lands, but forcing the line while adjusting adds risk.']],
      secondTargets=[[[0,9.5],1.45], [[-3.7,10.4],1.12]],
      cue='Read the pace. Give your return room, then recover.',
      principle='Read the serve’s pace, then read the next ball afresh.',
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
      lines=['The higher crosscourt ball gives you time to cover. Read their next direction.', 'You change direction while stretched. Their reply takes you across the court.'],
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
 dict(batch=2,prefix='to',slug='live-point-line-opens',title='Now the Line Opens',family='direction-change',
      source=['line','ln2B'],hit=181,transferOf='live-point-line-tempting',
      intro='This ball is shorter. You have time to set on the backhand, and they are recovering toward the crosscourt side.',
      q='What has changed from the stretched wide ball?',opts=['Use controlled depth down the open line','Float short toward their recovery'],good=0,
      lines=['Your balanced contact lets you use the line with margin. Watch how they defend.', 'The shorter float gives them time to step in. Read their deeper reply.'],
      branches=[dict(target=[-3,10],time=1.40,post=.20,reply=[.3,-7.4],replyTime=1.60,replyPost=.18),
                dict(target=[1.5,6.5],time=1.45,post=.18,reply=[-3.2,-9.9],replyTime=1.20,replyPost=.20)],
      situations=['They stretch to the line and send a shorter reply toward the middle.', 'They step into your short ball and send you back out to the backhand.'],
      secondQ='What does their reply permit now?',secondOpts=['Use controlled depth into the space','Lift through the middle to regain time'],secondGood=[0,1],also=[[1],[]],
      secondLines=[['You move forward and use the space with a generous target.', 'A sound reset. You also had a shorter ball to work with.'],
                   ['The space is there, but the deeper contact makes pressing less comfortable.', 'You adapt to the deeper ball and regain recovery time.']],
      secondTargets=[[[2.8,9.6],1.20],[[0,9.6],1.55]],cue='Use the opening you earn. Cover the reply it creates.',
      principle='The line changes with your contact. Read what makes it available.',
      why='Compared with the stretched wide ball, this contact is closer, higher and better organised. The opponent is also away from the line. Controlled depth can use that opening; the next reply still needs a fresh read.',
      pro='Tennis Australia links positioning and balance to choosing and recovering from a shot. This changed situation applies the same principle without making “always crosscourt” a rule.',url=TA,
      drill='Alternate a deep wide backhand feed and a shorter one. Recover toward the crosscourt side as feeder. Let the receiver call the opening, then play your actual reply.',signals=['direction-opportunity','follow-up-read']),
 dict(batch=2,prefix='tv',slug='live-point-volley-build',title='First Volley: Build the Point',family='first-volley',
      source=['av','av3A'],hit=416,followup='live-point-volley-opening',net=True,
      intro='Your approach brings you in. Their passing shot dips below net height on your forehand side.',
      q='What does this low first volley need?',opts=['Bend and guide with depth through the middle','Float a short volley toward their side'],good=0,
      lines=['Your compact volley gives clearance and depth. Reset for their next hit.', 'The short float lets them move forward. Stay ready for a harder second volley.'],
      branches=[dict(target=[0,10],time=1.25,post=.18,reply=[-1.2,-7],replyTime=1.17,replyPost=0,replyIntercept=.86),
                dict(target=[-1.5,6.2],time=1.15,post=.18,reply=[-3,-7.5],replyTime=.98,replyPost=0,replyIntercept=.73)],
      situations=['Their next pass comes to your backhand. You have stayed balanced near the net.', 'Their earlier pass comes lower and farther to your backhand. You have to adjust.'],
      secondQ='How do you handle this next volley?',secondOpts=['Keep the action compact and place it deep','Place a short angled volley'],secondGood=[0,0],also=[[],[]],
      secondLines=[['You keep the racket in front and use depth. The point continues.', 'The angle lands here, but the moving contact makes that small target demanding.'],
                   ['You respect the lower contact and keep the ball playable.', 'A small target demands more while hurried. A landing does not prove the choice.']],
      secondTargets=[[[0,9.8],1.10],[[3.6,3.5],.90]],cue='Low volley, compact action. Build the point, then stay ready.',
      principle='A low first volley builds the point. Depth can earn the next ball.',
      why='Split around their hit, lower with the legs and use a compact forward action. A low contact needs clearance. A short floating volley gives the passer time and space; a deep volley can restrict those options without guaranteeing an easy finish.',
      pro='Tennis Australia’s volley fundamentals emphasise preparation, balance and contact in front. For a low volley, bend through the legs and use a compact forward action to give the ball clearance and depth.',url=TA,
      drill='Approach a deep feed. Have the passer alternate low forehand and backhand passes. Play two volleys, valuing balance and depth before a finish.',signals=['volley-height','second-volley']),
 dict(batch=2,prefix='th',slug='live-point-volley-opening',title='First Volley: Use the Opening',family='first-volley',
      source=['av','av1C'],hit=434,transferOf='live-point-volley-build',net=True,
      intro='Your approach moves them wide. This backhand volley is above the net, with the opposite side open.',
      q='What does the higher contact offer?',opts=['Place the volley back through the middle','Place the volley into the open side'],good=1,
      lines=['You send it toward their side. They get a more comfortable passing attempt.', 'You use the height and space. They still get a racket to your compact volley.'],
      branches=[dict(target=[2.5,9.5],time=1.15,post=.18,reply=[2.8,-7.2],replyTime=1.10,replyPost=0,replyIntercept=.81),
                dict(target=[-2.9,9],time=1.65,post=.18,reply=[.5,-6.8],replyTime=1.30,replyPost=0,replyIntercept=.94)],
      situations=['Their pass comes wider to your forehand. Recover into the next volley.', 'Their stretched reply comes higher through the middle. Stay organised for the forehand volley.'],
      secondQ='What has the first volley actually earned?',secondOpts=['Place the next volley with controlled depth','Try a sharp finishing angle'],secondGood=[0,1],also=[[],[0]],
      secondLines=[['You adjust and keep a generous target for the wider ball.', 'This angle lands, but the wider contact leaves less room to force it.'],
                   ['A sound controlled placement. The higher contact also offered the shorter angle.', 'You use the higher contact and open side. Stay ready until the point is over.']],
      secondTargets=[[[0,9.6],1.10],[[3.4,4.5],.95]],cue='Use the height and space. Place it, then stay ready.',
      principle='A higher volley offers options. Read the next pass before choosing again.',
      why='Compared with the low first volley, this ball arrives above the net and the opponent is displaced. A compact forward action can use the open side. Do not assume a winner: recover and split for the return they actually produce.',
      pro='Volley fundamentals combine a stable racket, coordinated footwork and contact in front. The opportunity changes with contact height and opponent position, not with a bigger backswing.',url=TA,
      drill='Have a partner feed one low volley and one above the net, while changing sides. Call “build” or “place” from the contact and court, then play a second volley.',signals=['volley-opportunity','next-volley-read']),
 dict(batch=3,prefix='tf',slug='live-point-pass-two',title='Pass in Two',family='passing-read',
      source=['nr','nr1C'],hit=188,followup='live-point-over-head',
      intro='They are coming in and covering the obvious passing lane. Your contact is low behind the baseline.',
      q='Can you make their first volley difficult?',opts=['Dip the ball toward their feet','Pass down the sideline'],good=0,
      lines=['They have to volley below the net. Read where that volley actually goes.', 'They reach your pass above the net and send the volley deeper. You must adjust.'],
      branches=[dict(target=[.5,4.04],time=.95,post=0,intercept=.80,opponentVolley=True,opponentRecovery=[.4,2.5],reply=[.4,-6.7],replyTime=1.25,replyPost=.23),
                dict(target=[3.9,9.8],time=1.15,post=0,intercept=.78,opponentVolley=True,opponentRecovery=[1.2,2.7],reply=[-3.1,-9.5],replyTime=1.20,replyPost=.20)],
      situations=['The low volley lands shorter through the middle. They are still near the centre of the net.', 'Their firmer volley is deep to your backhand. The passing opportunity has become harder.'],
      secondQ='Choose from the volley they actually play.',secondOpts=['Use the shorter contact to pass into space','Lift with depth to regain time'],secondGood=[0,1],also=[[1],[]],
      secondLines=[['You use the shorter ball to pass left of their coverage. Stay ready.', 'A sound way to reset. The shorter volley also offered a passing opportunity.'],
                   ['This pass lands, but the deeper contact gives you less room to force it.', 'You adapt to the deeper volley and buy time.']],
      secondTargets=[[[ -3.2,9.2],1.25], [[0,10],2.05]],cue='Make the first volley difficult. Read it before you pass.',
      principle='Build the pass in two balls. Read the volley before choosing again.',
      why='A dipping ball can force the net player to volley upward and create a more playable next ball. The sideline is not forbidden, but forcing it from low contact gives little margin. Neither reply is guaranteed: watch the actual volley before choosing again.',
      pro='Tennis Australia describes defending, neutralising and attacking as different tactical situations. This point uses a low first ball to try to improve the next passing opportunity.',url=TA,
      drill='Start with a partner approaching. Play a low first pass, then call the actual volley’s depth before selecting the second shot. Change the volley direction each time.',signals=['first-pass-height','volley-read']),
 dict(batch=3,prefix='tb',slug='live-point-over-head',title='Over Their Head',family='passing-read',
      source=['nr','nr2D'],hit=166,transferOf='live-point-pass-two',
      intro='They have closed much nearer the net and cover the passing angles. You have room to lift the ball.',
      q='Where is the larger space now?',opts=['Drive the pass crosscourt','Lift a deep lob over their reach'],good=1,
      lines=['They intercept above the net. Read their volley and find room for the next shot.', 'The lob clears their reach and sends them back. Recover while they chase it.'],
      branches=[dict(target=[3.8,9.5],time=1.16,post=0,intercept=.72,opponentVolley=True,opponentRecovery=[1.2,2.4],reply=[-3,-9.5],replyTime=1.18,replyPost=.20),
                dict(target=[-.5,10.1],time=2.40,post=.13,opponentRecovery=[-.3,11.6],reply=[.3,-7.2],replyTime=1.55,replyPost=.20)],
      situations=['Their volley is deeper to your backhand. They still cover the net.', 'They chase behind the baseline and send a shorter reply. You have recovered with time.'],
      secondQ='What does the next ball give you?',secondOpts=['Use controlled depth into the open court','Lift with depth and recover'],secondGood=[1,0],also=[[],[1]],
      secondLines=[['The space looks inviting, but the deep contact makes forcing it demanding.', 'You give yourself another recovery window from the deeper volley.'],
                   ['You use the shorter reply with a generous target. The point continues.', 'A sound reset. The shorter reply also gave you time to apply pressure.']],
      secondTargets=[[[ -2.8,9.5],1.25], [[0,10],2.05]],cue='Read how close they stand. Use the space above them.',
      principle='Their net position changes the space. Recover while the lob travels.',
      why='A player close to the net can cover many passing angles but leaves space behind. A deep lob is available when your contact supports lift. It is not an automatic winner: this opponent chases it down, and the next ball decides your next action.',
      pro='Tennis Australia’s tactical situations connect shot selection to opponent position and available space. This example contrasts a net player’s close position with the previous lower-volley situation.',url=TA,
      drill='Have a partner vary how close they stand to the net. Choose feet or lob from the position, then continue with whichever reply they reach.',signals=['net-distance','lob-follow-up']),
 dict(batch=3,prefix='td',slug='live-point-reach-drop',title='Reach the Drop',family='drop-arrival',
      source=['ad','ad1B'],hit=212,followup='live-point-arrive-options',net=True,
      incoming=dict(sourceHit=30,target=[1,-3],time=1.16,post=.66,move=118,arrive=195),
      intro='You read the drop late from behind the baseline. You reach it low, still moving forward.',
      q='What is realistic from this late pickup?',opts=['Lift deep through the middle and find balance','Place a short angled reply'],good=0,
      lines=['You lift the low ball and send them back. Find balance for their reply.', 'It lands here, but leaves a short ball and little margin. Watch them move in.'],
      branches=[dict(target=[0,10],time=1.35,post=.18,reply=[-1.2,-7],replyTime=1.23,replyPost=0,replyIntercept=.90),
                dict(target=[3.5,5.5],time=1.25,post=.20,opponentRecovery=[1.6,8.3],reply=[-4,-7.4],replyTime=1.03,replyPost=0,replyIntercept=.75)],
      situations=['They reply to your backhand as you regain a balanced net position.', 'They reach the shorter pickup and pass wider to your backhand. You are still correcting.'],
      secondQ='You reached it. What does this next contact need?',secondOpts=['Compact placement with depth','Place a short angled reply'],secondGood=[0,0],also=[[],[]],
      secondLines=[['You regain control with a compact volley and a generous target.', 'The small angle lands, but adds difficulty while you are finding balance.'],
                   ['You adjust to the wider pass and keep the next ball playable.', 'The wider contact makes that short target even more demanding.']],
      secondTargets=[[[0,9.5],1.12],[[3.6,3.5],.95]],cue='Reach the ball, then find balance. Keep the next shot playable.',
      principle='Reaching a drop shot is only the first job. Your balance shapes the reply.',
      why='A late pickup below the net needs clearance and a manageable target. The illustration shows a playable recovery, not a miracle winner. After the pickup, organise your feet and racket for the actual passing shot.',
      pro='Tennis Australia’s movement and tactical fundamentals connect balance and court position to shot selection. A low, moving contact changes what is sensible even when an empty corner is visible.',url=TA,
      drill='Begin deep. Have a partner disguise an occasional drop shot, then play a pass after your pickup. Judge the pickup height and how quickly you regain balance.',signals=['drop-pickup','balance-recovery']),
 dict(batch=4,prefix='te',slug='live-point-arrive-options',title='Arrive With Options',family='drop-arrival',
      source=['ad','ad1B'],hit=186,transferOf='live-point-reach-drop',net=True,
      incoming=dict(sourceHit=30,sourceContact=[.3,11.4,.78],opponentReady=[.3,11.5],target=[1,-3],time=1.20,post=.36,move=45,arrive=151),
      intro='You spot the drop early. You arrive higher and more balanced, while they remain deep near the middle.',
      q='What has arriving early made available?',opts=['Place it shorter and away from their position','Send it deep back toward them'],good=0,
      lines=['Your placement brings them forward and across. Stay ready for their pass.', 'They meet your deep pickup near their waiting position. Read the firmer pass.'],
      branches=[dict(target=[-2.6,5.5],time=1.35,post=.18,opponentRecovery=[-1.5,7],reply=[.2,-6.8],replyTime=1.30,replyPost=0,replyIntercept=.94),
                dict(target=[.3,10],time=1.15,post=.18,reply=[2.6,-7.5],replyTime=1.02,replyPost=0,replyIntercept=.75)],
      situations=['They move forward and stretch across. Their pass comes higher through the middle.', 'Their comfortable contact sends the pass wider to your forehand. Adjust before volleying.'],
      secondQ='What does the passing shot offer now?',secondOpts=['Keep a compact volley with controlled depth','Place a shorter volley into the open side'],secondGood=[1,0],also=[[0],[]],
      secondLines=[['A sound controlled volley. The higher ball also offered the shorter placement.', 'You use the higher ball and open side. Keep covering until the point ends.'],
                   ['You adjust to the wider contact and keep a generous target.', 'The placement lands here, but the wider contact makes it less forgiving.']],
      secondTargets=[[[0,9.5],1.10],[[3.4,4.5],.95]],cue='Early arrival creates options. Place the ball, then stay ready.',
      principle='Earlier arrival creates options. Placement still depends on their position.',
      why='Compared with the late pickup, earlier movement lets you contact the ball higher and closer to the net. With the opponent still deep, controlled shorter placement can make them move. It is not a winner by definition: organise for the pass they actually reach.',
      pro='Tennis Australia connects movement, balance and available space to tactical decisions. This changed drop-shot situation shows why the same pickup target is not right for every arrival.',url=TA,
      drill='Alternate a disguised drop with an obvious one. Let the receiver call “reach” or “options”, place the pickup, then play the real passing shot and next volley.',signals=['early-drop-read','placement-follow-up']),
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

def append_flight(s,target,duration,post,intercept=None):
    start=len(s['ball'])-1;track,bounce=flight(s['ball'][-1],target,duration,post)
    if intercept is not None:track=track[:round(intercept*100)]
    s['ball'].extend(track)
    if len(track)>=bounce:s['marks'].append(dict(frame=start+bounce,pos=target,kind='bounce',label=None))
    return len(s['ball'])-1,s['ball'][-1]

def node(p,key,sit,q,opts,good,lines):
    return dict(scene=key,ph='Live Point',short='Read',name=q,sit=sit,q=q,opts=opts,correct=good,
                lines=dict(zip('AB',lines)),noTargets=True,rail=['Watch','Choose','See what changes'],
                unlock='Read the next ball',take=p['principle'],payoff=p['principle'],principle=p['cue'],why=p['why'])

def build(p):
    assert len(p['principle'])<=75,p['slug']
    assert all(len(s)<=80 for s in p['lines']+[s for pair in p['secondLines'] for s in pair]),p['slug']
    d=json.loads((R/(p['source'][0]+'_data.json')).read_text());base=d['scenes'][p['source'][1]]
    # Pool contains the same captured clips as the rest of the app. No new rig.
    clips={}
    for name in [p['source'][0],'line','av','nr','sd']:
        for k,v in json.loads((R/(name+'_data.json')).read_text())['clips'].items():
            assert k not in clips or clips[k]==v,k
            clips[k]=v
    root=p['prefix']+'1';scenes={};nodes={};hit=p['hit'];freeze=hit-14
    incoming=p.get('incoming')
    if incoming:
        base=copy.deepcopy(base);r=incoming
        base['ball']=base['ball'][:r['sourceHit']+1];base['marks']=[]
        if r.get('sourceContact'):base['ball'][-1]=r['sourceContact']
        drop=placed(clips,'drop',base['ball'][-1],r['sourceHit'],True)
        contact,point=append_flight(base,r['target'],r['time'],r['post']);assert contact==hit
        first=placed(clips,'fh',point,hit)
        base['actors']['you']=[ready([.4,-11.4],0),first]
        base['actors']['opp']=[drop,ready(r.get('opponentReady',[.3,7]),r['sourceHit']+60,True)]
    else:first=next(a for a in base['actors']['you'] if not a.get('hold') and a['start']+clips[a['clip']]['contactFrame']-1-a.get('poseFrameOffset',0)==hit)
    s0=copy.deepcopy(base);s0['ball']=s0['ball'][:hit+1]
    # Source grids put the first outgoing sample one frame before their nominal
    # clip contact. Ease only the final incoming 8 samples to the exact stringbed.
    local=rot(clips[first['clip']]['racquetFrames'][clips[first['clip']]['contactFrame']-1]['centre'],first['yaw'])
    centre=[local[i]+first['T'][i] for i in range(3)]
    delta=[centre[i]-s0['ball'][-1][i] for i in range(3)]
    for f in range(hit-7,hit+1):
        u=(f-(hit-8))/8
        s0['ball'][f]=[round(s0['ball'][f][i]+delta[i]*u*u,5) for i in range(3)]
    s0['actors']['you']=[copy.deepcopy(a) for a in base['actors']['you'] if a['start']<=first['start']]
    s0['actors']['opp']=[copy.deepcopy(a) for a in base['actors']['opp'] if a['start']<hit and (a.get('hold') or a['start']+clips[a['clip']]['contactFrame']-1<=hit)]
    # A fixed ready anchor at our contact prevents the opponent's next strike
    # placement from leaking backwards into the shared incoming situation.
    s0['actors']['opp'].append(ready(s0['actors']['opp'][-1]['T'],hit,True))
    s0['marks']=[dict(m,label=None) for m in base['marks'] if m['frame']<hit and m['kind']=='bounce']
    for i,X in enumerate('AB'):
        b=p['branches'][i];s=copy.deepcopy(s0)
        theirHit,pc=append_flight(s,b['target'],b['time'],b['post'],b.get('intercept'))
        oppClip=('lowfv' if pc[2]<1.1 else 'fvhi') if b.get('opponentVolley') else 'bh' if pc[0]>1 else 'fh'
        s['actors']['opp'].append(placed(clips,oppClip,pc,theirHit,True))
        nextHit,nc=append_flight(s,b['reply'],b['replyTime'],b['replyPost'],b.get('replyIntercept'))
        nextClip=('bv' if nc[0]<-.5 else 'lowfv' if nc[2]<1.1 else 'fvhi') if p.get('net') else 'bhlo' if nc[0]<-.5 and nc[2]<.85 else 'bh' if nc[0]<-.5 else 'fhhi' if nc[2]>1 else 'fh'
        recoveryAt=theirHit+3 if b.get('opponentVolley') else theirHit-(25 if p.get('net') else 32)
        s['actors']['you'].extend([ready([-.3,-3.7 if p.get('net') else -11.3],recoveryAt),placed(clips,nextClip,nc,nextHit)])
        # Recover to neutral coverage before seeing our second shot. Otherwise a
        # later hold target would make them anticipate the unchosen final reply.
        oppReady=b.get('opponentRecovery',[0,11.6])
        s['actors']['opp'].append(ready(oppReady,nextHit,True))
        decision=nextHit-14
        s['info']=dict(freeze=decision,**{'from':freeze},livePoint=True,outcome='in_play',
            authoredPoint=dict(firstHit=hit,theirHit=theirHit,nextHit=nextHit,branch=X,source=p['source'],illustrated=True),
            splits=[v for v in base['info'].get('splits',[]) if v[0]<hit]+[[theirHit+3,16]],
            comparison=dict(start=max(0,hit-55),end=theirHit+12,good=i==p['good'],label=p['opts'][i],
                explanation='Same incoming ball and starting positions. Only the first choice changes; the reply shown is one possible response.',event='opponent_reply'))
        if incoming:
            s['info']['liveSetup']=dict(start=0,end=hit-1,move=incoming['move'],arrive=incoming['arrive'],origin=[.4,-11.4,0],decision=freeze,
                release=hit-2,setupFrame=hit-25,canonical=first,clipStart=first['start'],good=True)
        for j,Y in enumerate('AB'):
            end=copy.deepcopy(s);target,duration=p['secondTargets'][j]
            last,_=append_flight(end,target,duration,.12)
            end['actors']['you'].append(ready([0,-3.4 if p.get('net') else -10.8],nextHit+80))
            # Show recovery, never a frozen spectator while the final ball lands.
            end['actors']['opp'].append(ready([target[0]*.45,4] if b.get('opponentVolley') else [target[0]*.75,11.6],last,True))
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
        n['opening']=dict(scene=root+X+'A',**{'from':decision},to=decision,label='Read the reply',after='Choose from this contact',silent=True,continuous=True)
        nodes[root+X]=n
    nodes[root]=node(p,root,p['intro'],p['q'],p['opts'],p['good'],p['lines'])
    lesson=dict(title=p['title'],decisionCount=2,hook='Two connected choices. Watch what your first shot creates.',liveIntro=p['intro'],
        specificFeedback=True,livePoint=True,family=p['family'],edition='ten-live-v1',branch=root,nodes=nodes,steps=[],finaleScene=root+'AA',finaleFull=True,
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
    if p['prefix']=='tb':
        lesson['frameHeight']=8
        lesson['cam0']=dict(c=dict(az=-90,el=24,d=34,fov=40,tgt=[0,-2,1.7]),phone=dict(az=-90,el=27,d=42,fov=28,tgt=[0,-2,1.8]))
        lesson['comparison']['camera']=lesson['cam0']
    used={'ready'}|{a['clip'] for s in scenes.values() for aa in s['actors'].values() for a in aa}
    (R/(p['prefix']+'_data.json')).write_text(json.dumps(dict(clips={k:clips[k] for k in sorted(used)},scenes=scenes),separators=(',',':'))+'\n')
    (R/('lesson_'+p['prefix']+'.js')).write_text('const LESSON='+json.dumps(lesson,ensure_ascii=False,indent=2)+';\n')

if __name__=='__main__':
    for p in POINTS:build(p)
    print(f'{len(POINTS)} connected Live Points, {len(POINTS)*4} routes.')
