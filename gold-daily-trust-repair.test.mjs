import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const file=new URL('./gold-daily-prototypes.js',import.meta.url),source=fs.readFileSync(file,'utf8');
let reduced=false;
const context={module:{exports:{}},require:createRequire(file),matchMedia:()=>({matches:reduced})};
vm.runInNewContext(source.replace('    version: VERSION,','    canReviewChallenge, returnArrival, returnPositionVisual, servePlusOneVisual, courtReadVisual, timelineFor, payoffAtFor, state, scheduleNaturalEvidence,\n    version: VERSION,'),context);
const api=context.module.exports,lesson=slug=>api.challenges.find(c=>c.slug===slug);
test('promoted lessons are public while future review-only content stays withheld',()=>{
  const high={...lesson('high-ball'),reviewOnly:true};
  context.location={hostname:'www.gamesharptennis.com',protocol:'https:'};
  assert.equal(api.canReviewChallenge(high),false);
  assert.equal(api.canReviewChallenge(lesson('high-ball')),true);
  assert.equal(api.canReviewChallenge(lesson('line')),true);
  context.location={hostname:'gamesharp-tennis-review123-eoinlynn-5978s-projects.vercel.app',protocol:'https:'};
  assert.equal(api.canReviewChallenge(high),false,'Git previews cannot release future review-only content');
  assert.equal(api.canReviewChallenge(lesson('high-ball')),true);
  context.location={hostname:'127.0.0.1',protocol:'http:'};assert.equal(api.canReviewChallenge(high),true);
});
test('shot wording agrees with the repaired sideline and short-middle targets',()=>{
  const short=lesson('short-ball').steps.find(s=>/sideline/.test(s.options[2].text)),line=lesson('line').steps[0];
  assert.match(short.options[2].text,/sideline/);
  assert.ok(Math.abs(short.visual.paths[2].at(-1)[0]-40)<=3);
  assert.match(line.options[2].text,/short.*middle/);
  assert.ok(line.visual.paths[2].at(-1)[1]>49&&line.visual.paths[2].at(-1)[1]<85);
  assert.equal(line.visual.paths[2].at(-1)[0],125);
  for(const s of lesson('line').steps) if(/outside the sideline/.test(s.situation)) assert.ok(s.visual.ball[0]<40||s.visual.ball[0]>210);
});
test('same-speed return arrivals and sound agree; no invented reference return outcome',()=>{
  for(const step of lesson('return-position').steps)for(const selected of [null,0,1,2,3]){
    const t=api.timelineFor(step,selected!==null),at=api.returnArrival(step,t,true);
    assert.ok(at>t.serveBounceAt&&at<t.total);
    assert.equal(at>t.contactAt,step.visual.referenceContact[1]>step.visual.contact[1]);
    const svg=api.returnPositionVisual(step,selected,t);
    assert.doesNotMatch(svg,/NaN|undefined|gd-correct-consequence/);
    if(selected!==null||step.visual.mode==='compare'){
      assert.match(svg,/data-return-role="reference"/);
      let schedule;api.state.selectedIndex=selected;
      api.state.audio={isReady:()=>true,isEnabled:()=>true,stop:()=>{},schedule:v=>schedule=v};
      api.scheduleNaturalEvidence(step,selected!==null);
      assert.equal(schedule.events.find(e=>e.kind==='reference-contact').at,at);
      assert.ok(!schedule.events.some(e=>e.kind==='return-bounce'));
    }
    reduced=true;assert.doesNotMatch(api.returnPositionVisual(step,selected,t),/<animate|<set /);reduced=false;
  }
});
test('incidental pointer contact cannot skip evidence; announcements use the payoff clock',()=>{
  assert.doesNotMatch(source.match(/function onPointerDown\(\) \{([\s\S]*?)\n  \}/)[1],/finishEvidenceMotion/);
  assert.match(source,/prefersReducedMotion\(\) \? 0 : payoffAtFor\(step, timelineFor\(step, true\)\) \* 1000/);
  assert.match(source,/renderedVisual === state.overlay.querySelector/);
  assert.doesNotMatch(source.match(/function answer\(index\) \{([\s\S]*?)\n  \}/)[1],/live.textContent/);
});

test('the slower second serve is slower across scenes, with cues and payoff after arrival',()=>{
  const steps=lesson('return-position').steps;
  for(const answered of [false,true]){
    const speed=step=>{const t=api.timelineFor(step,answered),v=step.visual;return Math.hypot(v.contact[0]-v.serveBounce[0],v.contact[1]-v.serveBounce[1])/(t.contactAt-t.serveBounceAt);};
    assert.ok(Math.abs(speed(steps[0])-speed(steps[1]))<.0001);
    assert.ok(speed(steps[2])<speed(steps[0])*.8);
    for(const step of steps){
      const t=api.timelineFor(step,answered),last=Math.max(t.contactAt,api.returnArrival(step,t,true));
      assert.ok((answered?t.inkAt:t.questionAt)>last+.3);
      if(!answered){assert.ok(t.cueAt[1]-t.cueAt[0]>=.5);assert.ok(t.cueAt[2]-t.cueAt[1]>=.5);}
      assert.ok(t.total>(answered?t.correctionInkAt:t.questionAt));
    }
  }
});

test('Serve +1 visible bounce, sound, correction and explanation use the same event clock',()=>{
  for(const step of lesson('serve-plus-one').steps)for(const selected of [null,0,1,2,3]){
    const answered=selected!==null,t=api.timelineFor(step,answered);
    const svg=api.servePlusOneVisual(step,selected,t);
    assert.doesNotMatch(svg,/NaN|undefined/);
    let schedule;api.state.selectedIndex=selected;
    api.state.audio={isReady:()=>true,isEnabled:()=>true,stop:()=>{},schedule:v=>schedule=v};
    api.scheduleNaturalEvidence(step,answered);
    assert.equal(schedule.events.find(e=>e.kind==='return-bounce').at,t.returnBounceAt);
    if(!answered||step.visual.choiceRole!=='return'){
      assert.match(svg,new RegExp('data-bounce-at="'+t.returnBounceAt+'"'));
      assert.match(svg,/class="gd-return-exit"/);
    }
    if(answered){
      const flight=step.visual.choiceRole==='return'?t.returnFlight:t.plusOneFlight;
      const end=step.visual.choiceRole==='return'?t.returnAt+flight:t.plusOneAt+flight;
      assert.ok(t.correctionAt>end);
      assert.ok(api.payoffAtFor(step,t)>end);
      if(selected!==step.correct){
        assert.equal(schedule.events.find(e=>e.kind==='correction-bounce').at,t.correctionAt+flight);
        assert.ok(t.correctionInkAt>t.correctionAt+flight);
      }
    }
    reduced=true;assert.doesNotMatch(api.servePlusOneVisual(step,selected,t),/<animate|<set /);reduced=false;
  }
});
test('reduced-motion court comparisons retain both full-width vertically stacked scenes',()=>{
  reduced=true;
  for(const c of api.challenges.filter(c=>c.steps[0].visual.kind==='court_read'))for(const step of c.steps){
    const svg=api.courtReadVisual(step,(step.correct+1)%4,api.timelineFor(step,true));
    assert.match(svg,/class="gd-court-panels"/);assert.equal((svg.match(/viewBox="0 0 250 188"/g)||[]).length,2);
  }
  reduced=false;
});
test('transfer cues do not prescribe the Serve or Mental answer',()=>{
  assert.doesNotMatch(lesson('serve-plus-one').steps[2].visual.cues.join(' '),/REBUILD|RESET/);
  assert.doesNotMatch(lesson('two-points').steps[2].situation,/target|breath|routine/);
  assert.doesNotMatch(lesson('two-points').steps[2].visual.cues.join(' '),/SKIPPED|RESTORE/);
  assert.equal(api.audit().ok,true);
});
