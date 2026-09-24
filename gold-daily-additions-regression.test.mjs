import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const file = new URL('./gold-daily-prototypes.js', import.meta.url);
const source = fs.readFileSync(file, 'utf8');
let reduced = false;
const context = { module: { exports: {} }, require: createRequire(file), matchMedia: () => ({ matches: reduced }) };
vm.runInNewContext(source.replace('    version: VERSION,', '    splitStepScenes, splitStepVisual, twoPointVisual, outcomeDecisionVisual, timelineFor, state, scheduleNaturalEvidence,\n    version: VERSION,'), context);
const api = context.module.exports;
const split = api.challenges.find(c => c.slug === 'split-step');
const near = (a,b) => assert.ok(Math.abs(a-b)<1e-8, `${a} != ${b}`);
const reads = split.steps.map(s => api.splitStepScenes(s,null,api.timelineFor(s,false))[0]);
near(reads[1].contactAt - reads[2].contactAt, .38);
for (const key of ['landingAt','moveAt','takeoffAt']) near(reads[1][key], reads[2][key]);
for (const [stepIndex,step] of split.steps.entries()) {
  for (const selectedIndex of [null,0,1,2,3]) {
    const timeline = api.timelineFor(step,selectedIndex!==null);
    const scenes = api.splitStepScenes(step,selectedIndex,timeline);
    assert.equal(scenes.length, selectedIndex===null || selectedIndex===step.correct ? 1 : 2);
    for (const [i,scene] of scenes.entries()) {
      assert.ok(scene.contactAt>scene.loadAt && scene.bounceAt>scene.contactAt);
      assert.ok(scene.takeoffAt>=scene.startAt && scene.moveAt>=scene.landingAt);
      assert.ok(scene.endAt<=timeline.total);
      if(i) assert.ok(scenes[i-1].endAt<scene.startAt);
      if(scene.role==='reference') near(scene.landingAt-scene.contactAt,.15);
    }
    let schedule;
    api.state.stepIndex=stepIndex; api.state.selectedIndex=selectedIndex;
    api.state.audio={isReady:()=>true,isEnabled:()=>true,stop:()=>{},schedule:value=>{schedule=value;}};
    assert.equal(api.scheduleNaturalEvidence(step,selectedIndex!==null),true);
    for(const scene of scenes) {
      near(schedule.events.find(e=>e.kind===scene.role+'-opponent-contact').at,scene.contactAt);
      near(schedule.events.find(e=>e.kind===scene.role+'-landing').at,scene.landingAt);
    }
    assert.doesNotMatch(api.splitStepVisual(step,selectedIndex,timeline),/NaN|undefined|HIT \+ LAND/);
    reduced=true;
    assert.doesNotMatch(api.splitStepVisual(step,selectedIndex,timeline),/<animate|<set /);
    assert.equal(api.scheduleNaturalEvidence(step,selectedIndex!==null),false);
    reduced=false;
  }
}
const mental=api.challenges.find(c=>c.slug==='two-points');
for(const step of mental.steps) for(const selected of [null,0,1,2,3]) {
  const svg=api.twoPointVisual(step,selected,api.timelineFor(step,selected!==null));
  assert.doesNotMatch(svg,/NaN|undefined/);
  if(step.visual.mode==='serve') {
    assert.doesNotMatch(svg,/gd-second-point|gd-correct-consequence|RUSHED LONG/);
    if(selected!==null) assert.match(svg,/RESULT UNKNOWN/);
  }
}
const winner=api.challenges.find(c=>c.slug==='winner');
for(const step of winner.steps) {
  const svg=api.outcomeDecisionVisual(step,null,api.timelineFor(step,false));
  // Opponent identity stays red; decision paths/windows must not pre-grade answers.
  assert.doesNotMatch(svg, /stroke="#(?:e87171|59bd70)"/);
  if(step.visual.mode==='permission') assert.doesNotMatch(svg,/gd-decision-shot|gd-correct-consequence/);
}
assert.match(winner.steps[2].options[winner.steps[2].correct].text,/Attack/);
assert.equal(winner.steps[2].visual.choicePaths.length,4);
assert.ok(winner.steps[0].visual.riskyPath.at(-1)[0]-3.7 <= 40, 'The claimed line clip must actually touch the singles line.');
for(const step of api.challenges.find(c=>c.slug==='return-position').steps) {
  assert.ok(step.visual.server[1]<14 && step.visual.server[0]<125, 'Server starts behind the baseline on the diagonal side.');
  assert.ok(step.visual.serveBounce[0]>125, 'Serve lands in the diagonal service box.');
}
assert.ok(source.includes("faspScrub(authoredStep.visual.motion.contactFrame * 100)"), 'Skipping contact must cancel its animation loop before holding the evidence.');
assert.ok(source.includes("faspRender(contactPreviewMode(step), step.visual.motion.contactFrame)"), 'Completed read motion must return to the contact frame, not leave follow-through.');
assert.equal(api.audit().ok,true);
console.log('PASS additions regression: real split timing/audio; reset process without future result; neutral decision evidence and action transfer.');
