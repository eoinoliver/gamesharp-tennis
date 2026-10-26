"""Author nine decision freezes from existing licensed incoming rallies.

The paired ball and opponent are byte-identical. Only your starting position and
arrival change. No outgoing shot or point result is invented. The setup pose is
adapted from the existing Tennis-MoCap clip, movement uses the shared footwork
renderer. This is an authored tactical illustration, not player motion analysis.
"""
import copy, json
from pathlib import Path
R = Path(__file__).parent

# Sourced examples; the next-point application is our coaching interpretation,
# not a quotation or a reconstruction of the player's motion.
PRO = {
    'ea': {
        'player': 'Roger Federer', 'label': 'Federer · Make room to attack',
        'moment': 'Dubai final, 2012. In Mike Crooks’s analysis of Federer against Murray, Federer stays inside the baseline after a forcing serve, then uses three shuffle steps to get around the reply. The attack starts with the space he makes before the swing.',
        'read': 'Your next point: an empty corner is only half the picture. Ask “Have I made room to use it?” If you are still chasing, buy time; if you have room, controlled pressure becomes an option.',
        'src': 'Mike Crooks · Tactical Movement, Part 2 · point 1',
        'url': 'https://tennis.is/wp-content/uploads/2014/01/Federer_Murray_footwork_movement.pdf'
    },
    'ed': {
        'player': 'Carlos Alcaraz', 'label': 'Alcaraz · Buy time to change the point',
        'moment': 'The spectacular counterattack is the part we remember. In his Winning on Defense overview, strategist Craig O’Shannessy includes Alcaraz among the players he analyses and highlights changes of speed, spin and height as ways to escape defence. There is more than one reply to being pushed wide.',
        'read': 'Your next point: choose the time you need. Still stretched? Height and depth can give you time to recover. Arrived with control and a real opening? Reassess the pressure shot. Defend the situation you are in, not the one you were in a moment ago.',
        'src': 'Craig O’Shannessy · Winning on Defense · public overview',
        'url': 'https://braingametennis.com/webinar-73-winning-on-defense/'
    },
    'en': {
        'player': 'Roger Federer', 'label': 'Federer · Earn the first volley',
        'moment': 'Dubai final, 2012. Crooks shows Federer approaching without pulling Murray wide: the shot keeps Murray behind the baseline. Federer follows its line with two running steps and reaches his first volley inside the service box. The approach earns him a better place to play the next ball.',
        'read': 'Your next point: do not ask only “Can I reach the net?” Ask “What first volley am I setting up?” Arrive with control, play an approach with purpose, then judge how far to follow from the reply you have earned.',
        'src': 'Mike Crooks · Tactical Movement, Part 2 · point 1',
        'url': 'https://tennis.is/wp-content/uploads/2014/01/Federer_Murray_footwork_movement.pdf'
    }
}

def scene(prefix, key, ready, start, evidence, opponent=None):
    d = json.loads((R/f'{prefix}_data.json').read_text())
    s = copy.deepcopy(d['scenes'][key]); freeze = s['info']['freeze']
    hit = next(a for a in s['actors']['you'] if not a.get('hold'))
    # Decision stays before the stroke. The same preparation pose anchors both
    # arrivals; the late player is still travelling when the ball gets here.
    setup = copy.deepcopy(hit)
    contact = hit['start'] + d['clips'][hit['clip']]['contactFrame'] - 1 - hit.get('poseFrameOffset',0)
    setup_frame = contact - 48
    end = freeze - 48 if ready else freeze + 42
    s['actors']['you'] = [copy.deepcopy(s['actors']['you'][0]), setup]
    s['actors']['opp'] = [a for a in s['actors']['opp'] if (a.get('hold') and a['start'] <= freeze) or (not a.get('hold') and a['start'] + d['clips'][a['clip']]['contactFrame'] - 1 <= freeze)]
    if opponent is not None:
        # Transfer changes the defender's position explicitly, after their shot.
        for a in s['actors']['opp']:
            if a.get('hold'): a['T'] = opponent
    s['ball'] = s['ball'][:freeze+1]; s['frames'] = freeze+1
    s['marks'] = [m for m in s['marks'] if m['frame'] <= freeze and m['kind']=='bounce']
    for m in s['marks']: m['label'] = None
    s['info'] = {'freeze':freeze, 'readiness': {'start':60, 'arrive':end,
        'from':start, 'setupFrame':setup_frame, 'evidence':evidence}, 'outcome':'unplayed'}
    return s, d['clips']

def step(scene, sit, opts, correct, take, why, lines, compare=None, also=None):
    out={'ph':'Read the point','short':'Read','name':'Choose your plan','scene':scene,
        'reveal':True,'noTargets':True,'sit':sit,'q':'Which plan fits this point?',
        'opts':opts,'correct':correct,'payoff':take,'principle':'Read your arrival as well as the ball and the opponent.',
        'why':why,'cues':None,'rail':['Watch the point','Choose your plan','Then inspect'],
        'unlock':'Read the whole situation','take':take,'lines':dict(zip('ABCD',lines))}
    if compare: out['compareArrival']=compare
    if also: out['alsoOk']=also
    return out

def write(p, title, hook, cue, tomorrow, specs, steps):
    clips, scenes = {}, {}
    for key,args in specs:
        s,c = scene(*args); scenes[key]=s
        for k,v in c.items():
            assert k not in clips or clips[k]==v
            clips[k]=v
    used = {'ready'} | {a['clip'] for s in scenes.values() for aa in s['actors'].values() for a in aa}
    data={'clips':{k:v for k,v in clips.items() if k in used},'scenes':scenes}
    lesson={'title':title,'hook':hook,'readinessLesson':True,
        'memHTML':cue.replace('. ','. <span>',1)+'</span>' if '. ' in cue else '<span>'+cue+'</span>',
        'tomorrow':tomorrow,'cue':cue,'pro':PRO[p],'callbackTags':['movement_read','time_space_balance'],
        'finaleScene':steps[-1]['scene'],'finaleFull':True,'steps':steps,
        'drill':{'name':'Call the plan','how':'With a partner, vary the feed and your starting position. Before contact, call “pressure” or “buy time”. Afterwards, compare the call with your arrival, the ball and their position. Keep a useful cue; a won or lost point alone does not settle the decision.'}}
    (R/f'{p}_data.json').write_text(json.dumps(data,separators=(',',':'))+'\n')
    (R/f'lesson_{p}.js').write_text('const LESSON='+json.dumps(lesson,indent=2,ensure_ascii=False)+';\n')

attack=['Drive into the open court, with margin','Lift deep and recover']
write('ea','Have You Earned the Attack?',
    'The same ball can offer a different opportunity. Read the whole situation before you choose.',
    'See the space. Check your arrival.',
    'Before attacking an opening, check whether you have arrived with room to swing. If you are still chasing the ball, favour margin and recovery.',
    [('ea1',('fb','fb2A',True,[-1.6,-10.4,0],'Arrived before the bounce; room to prepare.')),
     ('ea2',('fb','fb2A',False,[1.1,-11.5,0],'Still moving across as the ball arrives.')),
     ('ea3',('pw','pw1C',False,[-.2,-11.8,0],'Wide, still moving, with the opponent central.'))],
    [step('ea1','Their reply comes to your forehand. The far side is open.',attack,0,
        'Arrive with room, then use the opening.',
        'You have reached your preparation position while the opponent is still across the court. A controlled drive into the space can apply pressure. A deeper, higher reply is also reasonable; you do not have to force an attack.',
        ['Room to prepare and an opening: pressure is available.','A sound reset; you also had an opportunity to apply pressure.'],also=[1]),
     step('ea2','The same incoming ball. The same opening. Watch this point.',attack,1,
        'An opening is useful only if your arrival lets you use it.',
        'The ball and opponent have not changed. Your starting position has: you are still crossing to the ball. Lift with margin and recover instead of forcing a drive just because the far court is empty.',
        ['The space is tempting, but your arrival makes this harder to control.','Give yourself margin and time to recover.'],compare='ea1'),
     step('ea3','A new rally. What would you choose here?',list(reversed(attack)),0,
        'Read your arrival again; the previous answer is not a rule.',
        'Here you are being pulled wide and the opponent is central. Height and depth give you a better chance to recover. This is a different ball and court position, but the same readiness check.',
        ['Height and depth help you work your way back.','Still moving wide, with no clear opening: forcing pressure adds risk.'])])

defend=['Drive down the line, with margin','High and deep crosscourt, then recover']
write('ed','Defence Can Change Before You Hit',
    'A wide ball does not decide your answer on its own. Your arrival can change the options.',
    'Need time? Buy it with height and depth.',
    'When pulled wide, check how much time you need to recover. If you arrive early and see a real opening, a controlled change of direction may be available.',
    [('ed1',('pw','pw2C',False,[-.8,-12,0],'Still travelling outward; recovery will take time.')),
     ('ed2',('pw','pw2C',True,[2.1,-11.6,0],'Arrived earlier; the line remains open.')),
     ('ed3',('pw','pw3D',False,[.3,-11.7,0],'Other wing, still moving away from the court.'))],
    [step('ed1','Their ball takes you towards the sideline. Watch both players.',defend,1,
        'Still travelling out? Give yourself time to get back.',
        'The line is open, but you are still travelling to the ball. A higher, deeper crosscourt reply gives you more margin and flight time for recovery. It does not guarantee that they cannot attack.',
        ['An opening alone does not make the change of direction easy.','The extra flight time can help you recover.']),
     step('ed2','The same ball and opponent. Watch your arrival this time.',defend,0,
        'Earlier arrival can open a choice; it does not require an attack.',
        'You have reached the preparation position sooner and they are still across the court. The line can apply pressure with margin. High and deep is also a sound choice; the useful change is that you now have an option.',
        ['Earlier arrival makes the open line a reasonable pressure shot.','Also sound: keep the margin and recover.'],compare='ed1',also=[1]),
     step('ed3','Another rally. Choose your plan.',list(reversed(defend)),0,
        'Other wing, same question: how much time do you need?',
        'You are still moving wide on the backhand side. The opponent is central. Choose height and depth to help your recovery instead of treating the sideline as an invitation to redirect.',
        ['Use the ball’s flight to help your recovery.','A forced change of direction gives you less margin.'])])

approach=['Lift a deep approach and follow it in','Lift deep, regain position before committing']
write('en','Have You Earned the Net?',
    'A short ball invites you forward. Read your arrival before committing to the next shot.',
    'Arrive first. Then decide whether to follow.',
    'On a short ball, read your arrival and their position together. From a controlled position, an approach may fit. If you are still chasing, prioritise a manageable reply before committing forward.',
    [('en1',('av','av1B',True,[1,-8.6,0],'Prepared inside the court; opponent still deep.')),
     ('en2',('av','av1B',False,[-.7,-11.6,0],'Still chasing forward as the ball arrives.')),
     ('en3',('short','sb2B',True,[-1.2,-8.4,0],'Prepared on the backhand; low ball, opponent deep.'))],
    [step('en1','Their reply lands inside the service line. They remain deep.',approach,0,
        'Controlled arrival and a deep opponent can support an approach.',
        'You are prepared inside the court and the opponent is still deep. Lift the low ball with margin and follow a purposeful approach. Getting to the net is a plan, not a promise of an easy volley.',
        ['Lift with depth; the controlled arrival supports following it in.','A reset is possible, but you can use this forward position.'],also=[1]),
     step('en2','The same short ball. They are still deep. Watch your arrival.',approach,1,
        'Reaching a short ball does not automatically earn the net.',
        'This time you started farther away and are still chasing forward. Prioritise a reply you can control. Judge whether to keep coming from the quality of that shot, rather than committing to the net before you have made it.',
        ['Committing now asks too much of an arrival still in progress.','Make a manageable reply, then judge the next position.'],compare='en1'),
     step('en3','A new point on the other wing. Choose your plan.',
        ['Drive flat for the open corner','Lift a deep approach and follow it in'],1,
        'Being prepared does not remove the need to read the ball.',
        'You have arrived, but the backhand contact will be low. Preparation makes a controlled approach available; it does not make a flat finish from below net height the better plan. Use lift and margin against the deep opponent.',
        ['Your arrival is good, but the low ball still needs lift.','Prepared, low ball, opponent deep: lift the approach with margin.'])])
print('Authored 3 readiness lessons / 9 decision freezes; no simulated point outcomes.')
