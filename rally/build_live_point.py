"""Two authored movement points, using the licensed Pulled Wide ball/strike data.

The first choice changes flight time and the opponent's contact position.
The second changes recovery timing. Stop just after their contact: no invented
winner, loss, or claim that a particular reply is inevitable. Full source
sequences remain unchanged. Recovery is a tactical illustration, not mocap.
"""
import copy
import math
import json
from pathlib import Path

R = Path(__file__).parent
D = json.loads((R / 'pw_data.json').read_text())

def node(scene, sit, q, opts, correct, lines, take, why):
    return dict(scene=scene, ph='Live Point', short='Read', name=q, sit=sit, q=q,
                opts=opts, correct=correct, lines=dict(zip('AB', lines)),
                noTargets=True, rail=['Watch', 'Choose', 'See what changes'],
                unlock='Read the next situation', take=take, payoff=take,
                principle='Your reply buys time. Your movement puts it to work.', why=why)

def extend_point(scenes,nodes,root,keys):
    """The original gains a second pair: read this reply, choose the next ball.
    The incoming ball is the actual existing opponent reply, unchanged across
    recovery/read options. Outgoing arcs are illustrative, still in play.
    """
    for j,source in enumerate(keys):
        X='AB'[j];full=D['scenes'][source]
        last=copy.deepcopy(full['actors']['you'][-1]);last['poseFrameOffset']=1
        hit=last['start']+D['clips'][last['clip']]['contactFrame']-2
        left=last['T'][0]<0;read_good='A' if left else 'B'
        for Y in 'AB':
            prefix=root+X+Y;prior=scenes[prefix];read_at=prior['frames']-1;decision=hit-18
            nodes[prefix]=node(prefix,'Their reply is now coming back. Read this ball, not the gap you expected.',
                'Which side needs your first move?',
                ['Move towards the backhand side','Move towards the forehand side'],0 if left else 1,
                ['The ball is heading to your backhand.' if left else 'That first move takes you away from this ball.',
                 'The ball is heading to your forehand.' if not left else 'That first move takes you away from this ball.'],
                'Recover for the available angles. Then move to the ball you see.',
                'Recovery covers possibilities. Once the opponent hits, the visible ball gives you new evidence. '
                'A first step the wrong way spends time you may need at contact.')
            nodes[prefix]['opening']={'scene':prefix+'A','from':prior['info']['liveRecovery']['theirHit']-25,
                'to':read_at,'label':'Their reply · replay','after':'Read its direction','silent':True}
            for Z in 'AB':
                chosen=prefix+Z;correct=Z==read_good;next_scene=copy.deepcopy(prior)
                def hips(seg,g):
                    c=D['clips'][seg['clip']];i=max(0,min(c['frameCount']-1,g-seg['start']+seg.get('poseFrameOffset',0)))
                    p=c['frames'][i][c['joints'].index('hips')];a=seg['yaw']
                    return [math.cos(a)*p[0]-math.sin(a)*p[1]+seg['T'][0],math.sin(a)*p[0]+math.cos(a)*p[1]+seg['T'][1]]
                r=prior['info']['liveRecovery'];A=hips(prior['actors']['you'][1],r['start'])
                ready=D['clips']['ready'];rh=ready['frames'][0][ready['joints'].index('hips')]
                B=[rh[i]+r['target'][i] for i in [0,1]];u=max(0,min(1,(read_at-r['move'])/r['duration']));u=u*u*(3-2*u)
                start=[A[i]+(B[i]-A[i])*u for i in [0,1]]
                if not correct:start[0]+=-.45 if Z=='A' else .45
                goal=hips(last,decision);distance=math.hypot(goal[0]-start[0],goal[1]-start[1])
                arrival=read_at+(0 if correct else 25)+max(30,math.ceil(distance*1.5/9*100))
                missed=arrival>hit-12
                if not missed:arrival=min(arrival,hit-2)
                next_scene['actors']['you'].append(copy.deepcopy(last))
                next_scene['ball']=copy.deepcopy(full['ball'][:decision+1]);next_scene['frames']=decision+1
                next_scene['marks']=[dict(m,label=None)for m in full['marks'] if m['kind']=='bounce' and m['frame']<=decision]
                next_scene['info'].update(freeze=read_at,**{'from':prior['info']['liveRecovery']['theirHit']-25},
                    liveRead={'start':read_at,'arrival':arrival,'contact':hit,'correct':correct,'left':Z=='A','clipStart':last['start']})
                if missed:
                    # No invented rescue: carry the incoming ball beyond the
                    # unavailable contact, without adding a struck-ball sound.
                    next_scene['actors']['you'].pop()
                    next_scene['info']['liveRead'].update(noContact=True,target=[goal[0]-rh[0],goal[1]-rh[1],0])
                    next_scene['ball']=copy.deepcopy(full['ball'][:hit+1]);p0=next_scene['ball'][-1];prev=next_scene['ball'][-2]
                    velocity=[(p0[i]-prev[i])*100 for i in range(3)]
                    for f in range(1,26):
                        t=f/100;next_scene['ball'].append([round(p0[i]+velocity[i]*t-(4.905*t*t if i==2 else 0),4) for i in range(3)])
                    next_scene['frames']=len(next_scene['ball'])
                scenes[chosen]=next_scene
                if missed:continue
                # These choices concern a playable reply, not a promised winner.
                # A safe reset remains acceptable even when more time is available.
                settled=hit-arrival>=35
                nodes[chosen]=node(chosen,
                    'You have more time to organise this contact.' if settled else 'You are still moving as this contact approaches.',
                    'What reply fits the time you have?',
                    ['Lift with margin through the middle','Drive with controlled depth through the middle'],
                    1 if settled else 0,
                    ['Height gives you another recovery window. The point continues.',
                     'You use your time to play a firmer reply. Keep recovering.' if settled else 'The firmer reply leaves a shorter recovery window. Still in play.'],
                    'Choose again from this contact. Then recover again.',
                    'The earlier reply, recovery and first move affect your preparation time. '
                    'When time is tight, height gives margin and another recovery window. '
                    'With time to organise, a controlled deeper drive is an option; a higher reset is still valid.')
                if settled:nodes[chosen]['alsoOk']=[0]
                nodes[chosen]['opening']={'scene':chosen+'A','from':read_at,'to':decision,
                    'label':'Your movement to the next ball','after':'Choose from this contact','silent':True}
                for U in 'AB':
                    end=copy.deepcopy(next_scene);end['info']['freeze']=decision
                    end['info']['secondReply']={'kind':'higher' if U=='A' else 'firmer','organised':settled,'contact':hit}
                    end['ball']=copy.deepcopy(full['ball'][:hit+1]);p0=end['ball'][hit]
                    # Same broad middle target; different flight time/margin.
                    duration=1.75 if U=='A' else 1.30;target=[0,9.5,.033]
                    vz=(target[2]-p0[2]+4.905*duration*duration)/duration
                    for f in range(1,101):
                        t=f/100;u=t/duration
                        end['ball'].append([round(p0[0]+(target[0]-p0[0])*u,4),round(p0[1]+(target[1]-p0[1])*u,4),round(p0[2]+vz*t-4.905*t*t,4)])
                    end['frames']=len(end['ball']);end['info']['outcome']='in_play'
                    scenes[chosen+U]=end

def write(p, title, keys, higher, followup=False):
    scenes, nodes = {}, {}
    root=p+'1'
    for j, source in enumerate(keys):
        X='AB'[j]; full=copy.deepcopy(D['scenes'][source]); high=j==higher
        # Preserve the actual captured stroke through its follow-through.
        contact=176; handoff=226
        opp=next(a for a in full['actors']['opp'] if not a.get('hold') and a['start']>100)
        their_hit=opp['start']+D['clips'][opp['clip']]['contactFrame']-1
        end=their_hit+18
        full['actors']['you']=full['actors']['you'][:2]
        full['marks']=[m for m in full['marks'] if m['kind']=='bounce' and m['frame']<=end]
        for m in full['marks']: m['label']=None
        # The full point keeps exactly the authored ball trajectory; only its
        # playback window and our recovery are different.
        full['ball']=full['ball'][:end+1];full['frames']=end+1
        full['info']={k:v for k,v in full['info'].items() if k in ['youContact','shot','oppContact']}
        full['info'].update({'freeze':handoff,'from':contact-12,'outcome':'in_play','livePoint':True})
        side=1 if full['info']['youContact'][0]>0 else -1
        target=[side*(.7 if high else .1),-11.4,0]
        for z,Y in enumerate('AB'):
            # Reversed option order on tomorrow's variation; test the principle,
            # not memory of an answer button.
            recover=(z== (1 if followup else 0))
            s=copy.deepcopy(full)
            s['info']['liveRecovery']={'start':handoff,'move':handoff if recover else their_hit,
                'duration':112,'target':target,'theirHit':their_hit,'recover':recover}
            s['info']['splits']=[[their_hit+4,18]] if recover else []
            scenes[root+X+Y]=s
        first=copy.deepcopy(full);first['ball']=first['ball'][:handoff+1];first['frames']=handoff+1
        first['marks']=[m for m in first['marks'] if m['frame']<=handoff]
        first['info'].update({'freeze':164,'from':0})
        scenes[root+X]=first
        options=['Recover now; split as they hit','Watch their direction, then recover']
        feedback=['You used the flight time to move back towards coverage.',
                  'You watched the shot. They hit while you were still wide.']
        if followup:options.reverse();feedback.reverse()
        nodes[root+X]=node(root+X,'Your '+('higher crosscourt reply' if high else 'flatter reply through the middle')+' is on its way.',
            'When do you recover?',options,1 if followup else 0,feedback,
            'Start recovering during your shot. Read their hit to adjust.',
            'Move towards a position that covers their available angles while your ball travels. '
            'Time your split around their contact, then respond to what they actually hit. '
            +('The higher reply gives you more time to do this.' if high else 'This quicker reply leaves less recovery time; starting promptly still helps.'))
        nodes[root+X]['continuation']=True
    opts=['Drive flatter through the middle','Lift high and deep crosscourt']
    lines=['It stays in play, but gets there sooner. Your recovery time is tighter.',
           'More flight time. Now decide how to use it.']
    if followup:opts.reverse();lines.reverse()
    nodes[root]=node(root,'Their ball pulls you wide'+(' on the backhand side.' if followup else ' on the forehand side.'),
        'Which reply fits your position?',opts,higher,lines,
        'When stretched, choose a reply that gives you time to recover.',
        'Here you are wide with a low contact. Height and depth crosscourt offer margin and extra flight time. '
        'The flatter middle reply remains playable in this example, but leaves less time to regain position. '
        'The useful comparison is time and position, not whether one illustrated shot wins.')
    if not followup:extend_point(scenes,nodes,root,keys)
    lesson=dict(title=title,decisionCount=2 if followup else 4,hook='Two decisions. Watch how your reply and recovery shape the next ball.' if followup else 'Up to four connected decisions. Reply, recover, read the next ball, choose again.',
        livePoint=True,branch=root,nodes=nodes,steps=[],finaleScene=root+'AA',finaleFull=True,
        memHTML='Buy yourself time. <span>Use it to recover.</span>',
        cue='Buy yourself time. Use it to recover.',callbackTags=['movement_read','recovery_time'],
        tomorrow='On your next wide ball, choose the time you need, then start recovering while your reply travels.',
        redoLabel='Try another route through this point',
        followup='live-point-other-wing' if not followup else None,
        transferOf='live-point-buy-time' if followup else None,
        pro=dict(player='Carlos Alcaraz',label='Alcaraz · Defence creates options',
            moment='Craig O’Shannessy’s Winning on Defense overview highlights changes of speed, spin and height, with Alcaraz among the players analysed.',
            read='Your next point: judge the reply and the recovery together. A higher ball can buy time; moving while it travels turns that time into a better starting position. Keep reading the opponent—neither choice guarantees the next reply.',
            src='Craig O’Shannessy · Winning on Defense · public overview',url='https://braingametennis.com/webinar-73-winning-on-defense/'),
        drill=dict(name='Use the flight',how='With a partner, start from a comfortable wide feed. Try a higher reply and a flatter one, then notice where you are when they hit. Judge your available time and position, not just the point result.'))
    if not followup:lesson['edition']='connected-four-v2'
    used={'ready'}|{a['clip'] for s in scenes.values() for aa in s['actors'].values() for a in aa}
    (R/f'{p}_data.json').write_text(json.dumps(dict(clips={k:v for k,v in D['clips'].items() if k in used},scenes=scenes),separators=(',',':'))+'\n')
    (R/f'lesson_{p}.js').write_text('const LESSON='+json.dumps(lesson,ensure_ascii=False,indent=2)+';\n')

write('lp','Buy Time. Use It.',['pw1B','pw1C'],1)
write('lt','Other Wing. Same Read?',['pw3D','pw3A'],0,True)
print('Authored up to four connected decisions; unreachable contacts end honestly without a fabricated return.')
