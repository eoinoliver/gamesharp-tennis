"""Two authored movement points, using the licensed Pulled Wide ball/strike data.

The first choice changes flight time and the opponent's contact position.
The second changes recovery timing. Stop just after their contact: no invented
winner, loss, or claim that a particular reply is inevitable. Full source
sequences remain unchanged. Recovery is a tactical illustration, not mocap.
"""
import copy
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
    lesson=dict(title=title,hook='Two decisions. Watch how your reply and recovery shape the next ball.',
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
    used={'ready'}|{a['clip'] for s in scenes.values() for aa in s['actors'].values() for a in aa}
    (R/f'{p}_data.json').write_text(json.dumps(dict(clips={k:v for k,v in D['clips'].items() if k in used},scenes=scenes),separators=(',',':'))+'\n')
    (R/f'lesson_{p}.js').write_text('const LESSON='+json.dumps(lesson,ensure_ascii=False,indent=2)+';\n')

write('lp','Buy Time. Use It.',['pw1B','pw1C'],1)
write('lt','Other Wing. Same Read?',['pw3D','pw3A'],0,True)
print('Authored two Live Points, four routes each; all end with the point in play.')
