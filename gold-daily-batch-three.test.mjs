import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const file=new URL('./gold-daily-prototypes.js',import.meta.url),source=fs.readFileSync(file,'utf8');
let reduced=false;
const context={module:{exports:{}},require:createRequire(file),matchMedia:()=>({matches:reduced})};
vm.runInNewContext(source.replace('    version: VERSION,','    courtReadVisual, timelineFor, state, scheduleNaturalEvidence,\n    version: VERSION,'),context);
const api=context.module.exports,lessons=api.challenges.filter(c=>c.steps[0].visual.kind==='court_read'),clone=x=>JSON.parse(JSON.stringify(x));
const loop=createRequire(file)('./gold-daily-loop.js');
test('all nine new decisions validate and all 36 choice scenes render in both motion modes',()=>{
  assert.equal(lessons.length,3);
  for(const c of lessons)for(const step of c.steps){
    assert.equal(api.auditCourtRead(step.visual).length,0);
    for(const selected of [null,0,1,2,3])for(const reduce of [false,true]){
      reduced=reduce;api.state.selectedIndex=selected;
      const html=api.courtReadVisual(step,selected,api.timelineFor(step,selected!==null));
      assert.doesNotMatch(html,/NaN|undefined/);
      if(reduced)assert.doesNotMatch(html,/<animate|<set /);
      if(selected===null)assert.doesNotMatch(html,/gd-correct-consequence|BETTER READ|YOUR CHOICE/);
      else{assert.match(html,new RegExp('data-choice="'+selected+'"'));assert.match(html,new RegExp('data-choice="'+step.correct+'"'));}
    }
  }
  reduced=false;
});
test('new sound events coincide with the authored bounce and shot clocks, never a possible reply',()=>{
  for(const c of lessons)for(const step of c.steps)for(const selected of [null,0,1,2,3]){
    api.state.selectedIndex=selected;let schedule;
    api.state.audio={isReady:()=>true,isEnabled:()=>true,stop(){},schedule:s=>schedule=s};
    const t=api.timelineFor(step,selected!==null);
    assert.equal(api.scheduleNaturalEvidence(step,selected!==null),true);
    assert.equal(schedule.events.length,selected===null||selected===step.correct?2:4);
    assert.ok(schedule.events.every(e=>Number.isFinite(e.at)&&e.at>=0&&e.at<=t.total));
    assert.equal(schedule.events[1].at,selected===null&&!step.visual.priorShot?t.bounceAt:t.contactAt+t.flight);
    if(selected===null)assert.equal(schedule.events[0].audio,step.visual.mode==='middle-return'?'serve':'ground');
    reduced=true;assert.equal(api.scheduleNaturalEvidence(step,selected!==null),false);reduced=false;
  }
});
test('bad bounce, diagonal service box, missing consequence and reversed momentum fail closed',()=>{
  const v=clone(lessons[1].steps[0].visual);v.bounce=[70,110];assert.ok(api.auditCourtRead(v).length);
  const missing=clone(lessons[0].steps[0].visual);missing.choices.pop();assert.ok(api.auditCourtRead(missing).length);
  const target=clone(lessons[0].steps[0].visual);target.choices[0].target=[225,30];assert.ok(api.auditCourtRead(target).length);
  const moving=clone(lessons[2].steps[0].visual);moving.momentum=[55,24];assert.ok(api.auditCourtRead(moving).length);
  const kink=clone(lessons[2].steps[0].visual);kink.incoming[1]=[180,102];kink.bounce=[180,102];assert.ok(api.auditCourtRead(kink).some(e=>e.includes('sideways')));
});
test('contrast reversals and actual forehand/backhand sides remain authored',()=>{
  const [run,middle,future]=lessons;
  assert.ok(run.steps[1].visual.bounce[1]>run.steps[0].visual.bounce[1]);
  assert.ok(run.steps[0].visual.choices[1].player[0]<run.steps[0].visual.incoming.at(-1)[0]);
  assert.ok(run.steps[1].visual.choices[2].player[0]>run.steps[1].visual.incoming.at(-1)[0]);
  assert.ok(middle.steps[2].visual.player[1]<middle.steps[0].visual.player[1]);
  assert.ok(future.steps[0].visual.momentum[0]>future.steps[0].visual.opponent[0]);
  assert.equal(future.steps[1].visual.momentum[0],future.steps[1].visual.opponent[0]);
  assert.ok(future.steps[2].visual.momentum[0]<future.steps[2].visual.opponent[0]);
  for(const step of [future.steps[0],future.steps[2]]){
    const c=step.visual.choices[step.correct];
    assert.ok((c.opponentVia[0]-step.visual.opponent[0])*(c.receiver[0]-c.opponentVia[0])<0,'Playing behind must visibly brake and reverse');
  }
});
test('old dated checkpoints survive expansion and each new lesson receives one calendar slot',()=>{
  const data=new Map(),disk={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)},days={};
  loop.schedules[0].order.forEach((lessonId,i)=>days['2026-09-'+(12+i)]={lessonId,answers:[1,2,3],step:2,complete:true});
  disk.setItem(loop.key,JSON.stringify({days}));
  const store=loop.createStore(disk);assert.equal(store.completed().length,9);
  for(const [day,r]of Object.entries(days))assert.deepEqual(store.get(day),r);
  for(const [date,id]of [['2026-09-21','gold_runaround_pattern_v1'],['2026-09-23','gold_middle_return_v1'],['2026-09-25','gold_future_space_v1']])assert.equal(loop.lessonFor(date),id);
  assert.ok(Object.isFrozen(loop.schedules)&&loop.schedules.every(Object.isFrozen));
});
