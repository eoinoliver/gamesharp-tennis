import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),E=require('./gold-daily-high-ball.js');
let reduced=false;
const context={module:{exports:{}},require,matchMedia:()=>({matches:reduced})};
const source=fs.readFileSync(new URL('./gold-daily-prototypes.js',import.meta.url),'utf8');
vm.runInNewContext(source.replace('    version: VERSION,','    state, scheduleNaturalEvidence, timelineFor,\n    version: VERSION,'),context);
const api=context.module.exports,c=api.challenges.find(c=>c.id==='gold_high_ball_v1');
test('High Ball binds all twelve choices; wrong choices compare the same ball without inventing a stroke',()=>{
 assert.equal(c.reviewOnly,false);assert.deepEqual(Array.from(c.steps,s=>s.correct),[1,3,0]);
 for(const step of c.steps){
  assert.deepEqual(E.audit(step),[]);
  for(const selected of [null,0,1,2,3])for(const reduced of [false,true]){
   const html=E.render(step,selected,8.95,reduced);
   assert.doesNotMatch(html,/NaN|undefined|<animate/);
   if(selected===null)assert.doesNotMatch(html,/Your choice|Compare [A-D]|contact sample/);
   else if(selected!==step.correct){assert.match(html,new RegExp('Compare '+String.fromCharCode(65+step.correct)));if(reduced)assert.equal((html.match(/<svg /g)||[]).length,2);}
  }
  const bad=JSON.parse(JSON.stringify(step));bad.visual.actions[0]='unknown';assert.ok(E.audit(bad).length);
  const wrong=JSON.parse(JSON.stringify(step));wrong.correct=(wrong.correct+1)%4;assert.ok(E.audit(wrong).length);
 }
 assert.ok(E.contact(E.scenes[0],'midway').z>1.5);
 assert.ok(E.contact(E.scenes[2],'midway').z>E.contact(E.scenes[2],'hold').z);
 assert.match(E.render(c.steps[0],2,4.2,false),/second bounce, no contact/);
 assert.doesNotMatch(c.steps[2].situation,/comfortable|strike zone|hold|stay/i);
});
test('High Ball sound is bounce-only on the visual clock; reduced motion is silent',()=>{
 for(const step of c.steps)for(const selected of [null,0,1,2,3]){
  let scheduled;api.state.selectedIndex=selected;
  api.state.audio={isReady:()=>true,isEnabled:()=>true,stop(){},schedule:s=>scheduled=s};
  reduced=false;assert.equal(api.scheduleNaturalEvidence(step,selected!==null),true);
  const expected=[1.8];
  if(selected!==null&&!E.contact(E.scenes[step.visual.scene],step.visual.actions[selected]))expected.push(E.end*1.8);
  if(selected!==null&&selected!==step.correct)expected.push(6.2);
  assert.deepEqual(Array.from(scheduled.events,e=>e.at),expected);
  assert.ok(scheduled.events.every(e=>e.audio==='bounce'));
  reduced=true;assert.equal(api.scheduleNaturalEvidence(step,selected!==null),false);
 }
 reduced=false;
});
