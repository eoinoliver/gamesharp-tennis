// One-time source migration. Emits an apply_patch patch; never repairs runtime data.
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),file=new URL('../livepoint-content.js',import.meta.url);
const original=fs.readFileSync(file,'utf8'),content=require('../livepoint-content.js'),engine=require('../livepoint-engine.js');
if(content.authoredIntegrityVersion)throw new Error('Migration already authored; edit canonical scenes directly now.');
const scenes=structuredClone(content.scenarios),by=Object.fromEntries(scenes.map(s=>[s.id,s]));
const setOpening=(id,you,opp)=>Object.assign(by[id].d1.court,{youStart:you,oppStart:opp,sitter:you});
setOpening('beat_moonballer',[64,240],[100,8]);
setOpening('big_server',[96,246],[100,115]);
setOpening('defending',[24,232],[130,40]);
setOpening('inside_out_forehand',[55,256],[100,40]);
setOpening('rally_tolerance',[100,276],[100,40]);
setOpening('defend_drop',[100,175],[100,140]);
setOpening('bring_them_in',[100,220],[100,8]);
setOpening('counter_net_rusher',[100,220],[100,138]);
setOpening('two_breaks_up',[100,220],[100,40]);
setOpening('tiebreak_first',[100,256],[100,40]);
setOpening('return_match_point',[100,264],[100,40]);
setOpening('break_point_down',[118,292],[58,12]);
setOpening('serving_for_set',[72,292],[140,12]);
setOpening('serving_to_stay',[72,292],[140,12]);
by.approach_selection.d1.court.oppStart=[64,40];
// Serve origin, bounce, return contact and recovery are separate authored facts.
function serve(id,key,to,bounce,recovery,returnTo,number=1){const b=by[id][key],shot=b.seq.shots[0];Object.assign(shot,{from:[...by[id].d1.court.youStart],to,bounce,contactType:'serve',serveNumber:number,snd:'serve'});b.seq.oppEnd=recovery;if(returnTo)b.seq.shots[1].to=returnTo;}
serve('break_point_down','A',[58,12],[70,104],[90,40]);
serve('break_point_down','B',[26,38],[40,108],[42,50]);
by.break_point_down.B.win.oppEnd=[112,44];by.break_point_down.B.mid.oppEnd=[150,50];
serve('serving_for_set','A',[154,18],[140,100],[140,30]);
serve('serving_for_set','B',[134,18],[128,100],[130,28],[108,292]);
by.serving_for_set.A.win.shots[0].to=[46,52];
by.serving_for_set.A.mid.shots[0].to=[34,80];
serve('serving_to_stay','A',[154,18],[140,100],[140,30],null,2);
serve('serving_to_stay','B',[122,54],[115,120],[115,50],[150,276],2);
by.serving_to_stay.A.win.shots[0].to=[46,52];
by.break_point_down.d1.sit='15–40, first serve. This returner has blocked your faster serves deep. Test placement, then judge the return you actually receive.';
by.serving_for_set.d1.sit='First serve, serving for the set. Your usual ad-court target has drawn short returns today. Keep that plan available, but let the next return decide your +1.';
by.serving_to_stay.d1.sit='Second serve at 4–5, love–15. Your usual spin serve reaches their backhand high; the softer central serve leaves a comfortable contact. Which intention do you take to the ad-court point?';
// The backhand crosscourt construction really crosses the court.
by.inside_out_forehand.B.seq.shots[0].to=[150,52];by.inside_out_forehand.B.seq.oppEnd=[130,50];
by.inside_out_forehand.B.win.shots[0].to=[46,52];
by.inside_out_forehand.A.win.oppEnd=[100,44];
by.inside_out_forehand.A.d2.opts[0].lbl='Play behind the recovery';
by.inside_out_forehand.A.winTxt='The inside-out forehand moved the opponent into the corner. Their recovery then opened the space <b>behind</b> them. Read that movement before choosing the next target; this central contact is not an inside-in forehand down the line.';
// Other established coordinate/state contradictions.
by.beat_moonballer.A.seq.oppEnd=[150,40];by.beat_moonballer.A.win.oppEnd=[150,40];by.beat_moonballer.A.mid.oppEnd=[150,40];
by.beat_moonballer.B.seq.oppEnd=[88,142];
by.beat_moonballer.A.seq.shots[1].noBounce=true;
by.beat_moonballer.A.win.shots[0].contactType='smash';by.beat_moonballer.A.mid.shots[0].contactType='smash';
by.big_server.B.win.youEnd=[112,178];by.passing_shot.B.win.youEnd=[112,176];
by.defending.B.seq.oppEnd=[100,40];
by.change_direction.B.seq.shots[0].to=[174,110];by.change_direction.B.seq.shots[0].bounce=[160,120];by.change_direction.B.seq.oppEnd=[174,110];
by.change_direction.B.win.oppEnd=[174,110];by.change_direction.B.mid.oppEnd=[174,110];
by.rally_tolerance.A.seq.shots[0].from=[100,276];by.rally_tolerance.B.seq.shots[0].from=[100,276];
by.rally_tolerance.A.seq.shots[1].to=[170,280];
by.return_match_point.A.seq.oppEnd=[100,40];
// Preserve source targets; make every authored contact and decision handoff exact.
for(const s of scenes){
  for(const key of ['A','B']){
    const b=s[key];b.seq.youStart=[...s.d1.court.youStart];b.seq.oppStart=[...s.d1.court.oppStart];
    b.seq.shots.forEach((shot,i)=>{if(i)shot.from=[...b.seq.shots[i-1].to];});
    const received=b.seq.shots.at(-1).to;b.seq.youEnd=[...received];
    for(const phase of ['win','mid']){
      const f=b[phase];f.youStart=[...received];f.oppStart=[...b.seq.oppEnd];f.shots[0].from=[...received];
      f.shots.forEach((shot,i)=>{if(i)shot.from=[...f.shots[i-1].to];});
    }
    for(const phase of ['seq','win','mid'])for(const shot of b[phase].shots){shot.contactType=shot.contactType||engine.classifyShot(shot);}
    b.d2.opts.forEach((o,i)=>o.id=s.id+':'+key+':'+(o.win?'preferred':'alternative'));
  }
}
// Do not retain false line/phase language around repaired states.
by.serve_plus_one.opp='<b>After the wide serve.</b> The returner has been pulled toward the sideline and their return is short.';
by.serve_plus_one.d1.sit='30–30. Earlier, the returner guarded the middle. Your wide serve has now pulled them toward the sideline; their stretched reply is short. Read this next ball.';
by.beat_moonballer.opp='<b>Moonballer</b> — loops the ball and starts behind the baseline. This time the ball lands short enough to move in.';
by.beat_moonballer.d1.sit='This high ball lands short enough to step inside the baseline before it reaches shoulder height. The opponent is behind the far baseline; compare taking time away with changing the length.';
by.beat_moonballer.d1.opts[1].sub='Use the space in front of their baseline position';
by.defending.d1.sit=by.defending.d1.sit.replace(/way outside the doubles alley/gi,'outside the singles sideline');
by.approach_selection.opp='<b>A short ball on your backhand side.</b> The opponent is recovering on that same side. Your approach target changes the passing lane you leave.';
const start=original.indexOf('const scenarios = ['),end=original.indexOf('\n  // Launch eligibility',start);
if(start<0||end<0)throw new Error('Canonical authoring boundaries missing');
let revised=original.slice(0,start)+'const scenarios = '+JSON.stringify(scenes,null,2)+';\n'+original.slice(end);
revised=revised.replace(/continuityReviewedIds:Object\.freeze\(\[[^\n]+\]\),/,'authoredIntegrityVersion:1,\n    continuityReviewedIds:launchIds,');
console.log('*** Begin Patch\n*** Update File: '+file.pathname+'\n@@\n'+original.trimEnd().split('\n').map(l=>'-'+l).join('\n')+'\n'+revised.trimEnd().split('\n').map(l=>'+'+l).join('\n')+'\n*** End Patch');
