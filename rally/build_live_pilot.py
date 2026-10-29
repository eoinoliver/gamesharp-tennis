"""Four individually authored Live Points; no invented opponent replies.

Strikes and incoming balls come from existing licensed scenes. The contact-space
reset adds an explicitly modelled deep-middle arc; no opponent reply is invented. The player's
preparation path changes. Every comparison holds ball, opponent and camera
constant, and every changed-context return requires a fresh ball read.
"""
import copy
import json
from pathlib import Path

R = Path(__file__).parent
SOURCE = 'https://www.lta.org.uk/play/tennis-tips-and-techniques/improve-your-tennis-footwork-on-court-with-these-simple-tips/'
PLAYS = [
    dict(prefix='ls', slug='live-point-make-room', title='Make Room. Use It.', family='contact-space',
         data='fb', sources=['fb2A', 'fb2D'], contact=210, first=90, decision=199, compare=166,
         end=[315,350], outcomes=['in_play','in_play'], start=[-.6,-10.5,0], arrival=[155,198], delay=[90,137],
         followup='live-point-short-low', transferOf=None, good=0,
         sit='Their ball is coming to your backhand side. You have time to move around it.',
         q='When do you make room for the forehand?',
         opts=['Move now; adjust into contact space','Hold the middle a little longer'],
         lines=['You make room before the ball arrives. Now read the opening.', 'You still reach it, but leave less time to organise the forehand.'],
         secondSit=['You arrived early. They remain on the left; the right side is open.', 'You reach the ball late. The open side is there, but your preparation is hurried.'],
         secondQ='Which reply fits this preparation?', secondOpts=['Controlled forehand into the open side','Lift deep through the middle'],
         secondGood=[0,1], also=[[1],[]],
         secondLines=[['You use the space you earned. Keep recovering; the point continues.', 'A sound reset with margin. The open side was also available.'],
                      ['It lands in this example. The rushed attack is the risk.', 'You choose margin while hurried. Start recovering as it travels.']],
         cue='Make room early. Choose from the contact you have.',
         take='Your feet create preparation time. The open court does not create it.',
         why='Moving early leaves time for smaller adjustment steps and a balanced contact. A successful illustrated landing does not make a rushed attack the best decision. With time, the open side is available; a deeper middle reset remains valid.',
         returnPrompt='The next point is shorter and lower. Does early arrival still earn a drive?',
         summaries={'11':'You made room and chose a reply that fits your preparation.', '10':'You made room. Check the ball and your balance before choosing.', '01':'You left less preparation time, then chose a reply with margin.', '00':'The wait squeezed your preparation. The open side still carried risk.'}),
    dict(prefix='ll', slug='live-point-short-low', title='Short Can Be Low.', family='contact-space',
         data='short', sources=['sb2A','sb2B'], contact=203, first=90, decision=192, compare=150,
         end=[272,300], outcomes=['net','in_play'], start=[-.3,-9.0,0], arrival=[150,191], delay=[90,125],
         followup=None, transferOf='live-point-make-room', good=1,
         sit='A short ball is coming to your backhand. There is space ahead of you.',
         q='How do you prepare for the short ball?',
         opts=['Stay back a little longer','Move forward now; shorten the last steps'],
         lines=['You leave yourself a hurried approach to a low contact.', 'You close the distance early and leave time to adjust.'],
         secondSit=['You arrive hurried. The ball is still below net height.', 'You arrive with more time. The ball is still below net height.'],
         secondQ='Does short mean you can drive down?', secondOpts=['Drive flat and hard at the space','Lift with margin, then follow the ball'],
         secondGood=[1,1], also=[[],[]],
         secondLines=[['The flat attempt finds the net. Low contact needed clearance.', 'The lifted reply clears the net. Follow it and read their next ball.'],
                      ['Early arrival did not raise the ball. This flat attempt finds the net.', 'You read the low contact and leave clearance. The point continues.']],
         cue='Get there early. Low still needs lift.',
         take='Early arrival helps your balance. Contact height still shapes the shot.',
         why='Closing the distance early gives you time to adjust, but the ball remains below the net. The flat attempt shown hits the net; that is an illustration of the clearance problem, not a prediction that every hard shot misses. Lift first, then assess whether to follow.',
         returnPrompt=None,
         summaries={'11':'You moved early and respected the low contact.', '10':'You moved early, but the low ball still needed clearance.', '01':'You arrived hurried, then correctly gave the low ball clearance.', '00':'The wait cost preparation time. The flat attempt then found the net.'}),
    dict(prefix='sv', slug='live-point-serve-see', title='Serve. Then See.', family='serve-readiness',
         data='serve', sources=['daily2B','daily2C'], contact=407, first=230, decision=395, compare=282,
         end=[510,520], outcomes=['in_play','in_play'], arrival=[350,394], delay=[282,306],
         followup='live-point-return-deep', transferOf=None, good=0,
         sit='Your wide serve is on its way. The returner has not struck it yet.',
         q='Where do you get ready for the return?',
         opts=['Recover balanced; keep both wings available','Commit to the forehand before they hit'],
         lines=['You recover to read either wing. Now watch the actual return.', 'You commit before their hit. The return still has to be read.'],
         secondSit=['The return lands short. You have time to move in and organise.', 'The return lands short. Your early guess leaves you adjusting again.'],
         secondQ='What does this return offer?', secondOpts=['Controlled pressure into the open side','Depth through the middle with margin'],
         secondGood=[0,1], also=[[1],[]],
         secondLines=[['You step into the short reply and use the opening. Keep playing.', 'Depth through the middle is sound. You also had room to apply pressure.'],
                      ['It lands here, but you force a direction change while adjusting.', 'You choose a larger target while adjusting. The point continues.']],
         cue='Recover after the serve. Read the return before attacking.',
         take='The serve starts the pattern. The return decides your next shot.',
         why='Recover after the serve so you can respond to the return you see. A short reply and organised contact can offer controlled pressure. Guessing before the return adds a correction if the ball arrives elsewhere. A deep middle reply remains a sound option.',
         returnPrompt='The next return comes deeper. Read what it permits before using the same plan.',
         summaries={'11':'You recovered, read the short return and chose from an organised contact.', '10':'You recovered. Let the actual return guide the next shot.', '01':'You corrected the early guess and chose a larger target.', '00':'You guessed early, then pressed the angle while still adjusting.'}),
    dict(prefix='sr', slug='live-point-return-deep', title='The Return Pushes Back.', family='serve-readiness',
         data='serve', sources=['daily3A','daily3B'], contact=397, first=230, decision=385, compare=282,
         end=[498,540], outcomes=['out','in_play'], arrival=[344,384], delay=[282,306],
         followup=None, transferOf='live-point-serve-see', good=1,
         sit='Your wide serve is travelling. The returner can still change the next ball.',
         q='What do you do after serving?',
         opts=['Lean into the forehand plan before the return','Recover balanced, then respond to their hit'],
         lines=['You guess before seeing the return. Watch what comes back.', 'You recover with options available, then read the return.'],
         secondSit=['The return drives you behind the baseline. You are still adjusting.', 'You recover early, but their deeper return still pushes you back.'],
         secondQ='Does this return still invite the angle?', secondOpts=['Force a sharp angle from behind the baseline','Give yourself height and depth through the middle'],
         secondGood=[1,1], also=[[],[]],
         secondLines=[['The sharp angle goes wide in this example. The return removed the opening.', 'Depth and height give margin from this deeper contact. Keep recovering.'],
                      ['Getting ready early did not make this angle easy. It goes wide here.', 'You change the plan to fit the deeper return. The point continues.']],
         cue='Read the return you get. Change the plan when it changes.',
         take='Being ready helps you adapt. It does not make every return attackable.',
         why='This return is deeper than the short-return point and moves your contact behind the baseline. Being ready helps you respond; it does not make a low-margin angle the right choice. Height and depth through the middle offer space and time to recover.',
         returnPrompt=None,
         summaries={'11':'You recovered early and changed the plan for the deeper return.', '10':'You recovered, but forced the angle from a deeper contact.', '01':'You corrected your position and adapted to the deeper return.', '00':'The early guess cost preparation. The forced angle then went wide.'}),
]

def make_node(p,key,sit,q,opts,correct,lines):
    return dict(scene=key,ph='Live Point',short='Read',name=q,sit=sit,q=q,opts=opts,correct=correct,
                lines=dict(zip('AB',lines)),noTargets=True,rail=['Watch','Choose','See what changes'],
                unlock='Read the next ball',take=p['take'],payoff=p['take'],principle=p['cue'],why=p['why'])

def build(p):
    d=json.loads((R/(p['data']+'_data.json')).read_text());root=p['prefix']+'1';scenes={};nodes={}
    canonical=copy.deepcopy(d['scenes'][p['sources'][0]])
    strike=next(s for s in canonical['actors']['you'] if not s.get('hold') and s['start']+d['clips'][s['clip']]['contactFrame']-1-s.get('poseFrameOffset',0)==p['contact'])
    serve=p['family']=='serve-readiness'
    for i,X in enumerate('AB'):
        good=i==p['good']; timing=0 if good else 1
        for j,Y in enumerate('AB'):
            s=copy.deepcopy(d['scenes'][p['sources'][j]]);end=p['end'][j]
            s['actors']['you']=[a for a in s['actors']['you'] if a['start']<=strike['start']]
            s['actors']['opp']=[a for a in s['actors']['opp'] if a['start']<end and (a.get('hold') or a['start']+d['clips'][a['clip']]['contactFrame']-1-a.get('poseFrameOffset',0)<=end)]
            if p['prefix']=='ls' and j==1:
                # Explicit conservative reply: same contact and recorded strike,
                # new ballistic middle target, then one bounce; no fake return.
                hit=p['contact'];p0=s['ball'][hit];duration=1.25;target=[0,10,.033]
                velocity=[(target[0]-p0[0])/duration,(target[1]-p0[1])/duration,(target[2]-p0[2]+4.905*duration*duration)/duration]
                ball=copy.deepcopy(s['ball'][:hit+1])
                for f in range(hit+1,end+1):
                    t=(f-hit)/100
                    if t<=duration:position=[p0[0]+velocity[0]*t,p0[1]+velocity[1]*t,p0[2]+velocity[2]*t-4.905*t*t]
                    else:
                        after=t-duration;up=-(velocity[2]-9.81*duration)*.65
                        position=[target[0]+velocity[0]*.7*after,target[1]+velocity[1]*.7*after,target[2]+up*after-4.905*after*after]
                    ball.append([round(v,4) for v in position])
                s['ball']=ball;s['marks']=[m for m in s['marks'] if m['frame']<=hit]+[dict(frame=hit+125,pos=target[:2],kind='bounce',label=None)]
                s['actors']['opp']=copy.deepcopy(canonical['actors']['opp'])
                s['info']['shot']={'land':target[:2],'illustrated':True}
            s['ball']=s['ball'][:end+1];s['frames']=end+1
            s['marks']=[dict(m,label=None) for m in s['marks'] if m['frame']<=end and m['kind'] in ['bounce','net','out']]
            s['info']={k:v for k,v in s['info'].items() if k in ['youContact','shot','oppContact']}
            setup=dict(start=p['first'] if serve else 0,move=p['delay'][timing],arrive=p['arrival'][timing],
                       decision=p['decision'],release=p['contact']-2,setupFrame=p['contact']-25,
                       canonical=strike,good=good,clipStart=strike['start'])
            if serve:setup.update(serve=True,readyAt=282,target=[-.2,-11.6,0] if good else [2.2,-10.5,0])
            else:setup['origin']=p['start']
            s['info'].update(freeze=p['decision'],**{'from':p['first']},livePoint=True,outcome=p['outcomes'][j],liveSetup=setup,
                comparison=dict(start=p['first'],end=p['compare'],good=good,
                    label=('balanced recovery' if good else 'early forehand guess') if serve else ('move early and adjust' if good else 'wait, then hurry'),
                    explanation=('Both views show the same serve and return. Compare your starting position just after their hit.' if serve else 'Both views show the same incoming ball. Compare how early you reach preparation space.'),
                    event='return_contact' if serve else 'before_contact'))
            scenes[root+X+Y]=s
        first=copy.deepcopy(scenes[root+X+'A']);first['frames']=p['decision']+1;first['ball']=first['ball'][:first['frames']]
        first['marks']=[m for m in first['marks'] if m['frame']<first['frames']]
        first['info'].update(freeze=p['first'],**{'from':0},outcome='in_play')
        scenes[root+X]=first
        node=make_node(p,root+X,p['secondSit'][i],p['secondQ'],p['secondOpts'],p['secondGood'][i],p['secondLines'][i])
        if p['also'][i]:node['alsoOk']=p['also'][i]
        node['opening']=dict(scene=root+X+'A',**{'from':p['first']},to=p['decision'],label='Your preparation · replay',after='Read this contact',silent=True)
        nodes[root+X]=node
    nodes[root]=make_node(p,root,p['sit'],p['q'],p['opts'],p['good'],p['lines'])
    voiceFamily='live-serve' if serve else 'live-space'
    lesson=dict(title=p['title'],decisionCount=2,hook='Two connected decisions. Prepare, read the ball, choose.',liveIntro=p['sit'],
        livePoint=True,family=p['family'],edition='six-play-v1',branch=root,nodes=nodes,steps=[],finaleScene=root+'AA',finaleFull=True,
        memHTML=p['cue'],cue=p['cue'],callbackTags=['movement_read',p['family']],tomorrow=p['returnPrompt'] or p['cue'],
        followup=p['followup'],transferOf=p['transferOf'],returnPrompt=p['returnPrompt'],
        learningSignals=['serve-recovery' if serve else 'preparation','return-read' if serve else 'contact-read'],
        liveFeedback=dict(summaries=p['summaries']),liveVoices={k:voiceFamily+'-'+k for k in ['11','10','01','00']},
        comparison=dict(own='Watch your preparation',other='Change only preparation',intro='Watch the same ball twice. Change only your preparation.'),
        redoLabel='Try another route through this point',
        pro=dict(player='Matt Smith · LTA coach',label='Coach’s lens · Prepare, then decide',
            moment='LTA coach Matt Smith describes closing distance with larger steps, making smaller adjustments near contact, and recovering after a shot.',
            read=('Our application: recover after the serve with room to respond. Read the actual return before deciding how much pressure it permits.' if serve else 'Our application: move early enough to leave adjustment time. Then read the contact height and your balance; early arrival alone does not earn an attack.'),
            src='LTA · Improve your tennis footwork · Matt Smith',url=SOURCE),
        drill=dict(name='Prepare, then call it',how=('Have a partner alternate shorter and deeper returns. Recover after serving, then say “pressure” or “margin” from the return you see. Keep the rally going.' if serve else 'Ask a partner to vary the height of a comfortable short feed. Move early, adjust, then call “lift” or “drive” before contact. Judge the read and balance, not a winner.')))
    used={'ready'}|{a['clip'] for s in scenes.values() for aa in s['actors'].values() for a in aa}
    (R/(p['prefix']+'_data.json')).write_text(json.dumps(dict(clips={k:v for k,v in d['clips'].items() if k in used},scenes=scenes),separators=(',',':'))+'\n')
    (R/('lesson_'+p['prefix']+'.js')).write_text('const LESSON='+json.dumps(lesson,ensure_ascii=False,indent=2)+';\n')

if __name__=='__main__':
    for play in PLAYS:build(play)
    print('Four authored points; 16 routes; incoming balls and licensed strikes preserved; one declared deep-middle arc.')
