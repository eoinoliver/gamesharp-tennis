import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';import vm from 'node:vm';
const require=createRequire(import.meta.url),m=require('./gold-daily-construction.js');
const lessons=require('./gold-daily-prototypes.js').challenges.filter(c=>['approach-volley','serve-adaptation'].includes(c.slug));
const model=(step,i)=>step.visual.kind==='approach_to_volley'?m.approach(step.visual.scene,i):m.serve(step.visual.scene,i);
const samePoint=(a,b)=>assert.ok(a.every((n,i)=>Math.abs(n-b[i])<1e-9),`${a} != ${b}`);
test('all six decisions and 24 alternatives have legal finite, contact-bound evidence',()=>{
 assert.equal(lessons.length,2);
 for(const lesson of lessons)for(const step of lesson.steps){
  assert.deepEqual(m.audit(step),[]);
  for(let choice=0;choice<4;choice++){
   const a=model(step,choice),end=a.times.at(-1);
   for(let t=0;t<=end;t+=.02){const s=m.sample(a,t);assert.ok([...s.ball,...s.near,...s.far].every(Number.isFinite));assert.ok(s.ball[2]>=0);}
   samePoint(m.sample(a,a.times[1]).ball,a.bounce);
   samePoint(m.sample(a,a.times[2]).ball,a.receiver);
   if(a.volley){samePoint(m.sample(a,end).ball,a.volley);assert.ok(a.volley[2]>0);assert.equal(m.events(step,choice).filter(e=>e.audio==='bounce').length,choice===step.correct?1:2);}
   for(const reduced of [false,true])for(const t of [0,1,2,3,4,6,9]){const html=m.render(step,choice,t,reduced);assert.doesNotMatch(html,/NaN|undefined|<animate|<set /);assert.match(html,/viewBox="0 0 480 350"/);}
  }
 }
});
test('visual consequences precede explanation and sound shares the exact contact clock',()=>{
 const approach=m.approach(1,0),serve=m.serve(0,null);
 assert.ok(m.timelines.approach_to_volley.read.cueAt.every((t,i)=>t>=approach.times[i+1]));
 assert.ok(m.timelines.serve_adjustment.read.cueAt[0]>=serve.times[2]);
 assert.ok(m.timelines.serve_adjustment.read.cueAt[1]>=2.6+serve.times[1]);
 assert.ok(m.timelines.serve_adjustment.read.cueAt[2]>=2.6+serve.times[2]);
 for(const lesson of lessons)for(const step of lesson.steps){
  const timeline=m.timelines[step.visual.kind];
  for(let selected=0;selected<4;selected++){
   const a=model(step,selected),events=m.events(step,selected);
   assert.deepEqual(events.slice(0,a.times.length).map(e=>e.at),a.times);
   assert.ok(timeline.answer.inkAt>a.times.at(-1));
   if(selected!==step.correct){const best=model(step,step.correct);assert.deepEqual(events.slice(a.times.length).map(e=>e.at),best.times.map(t=>t+timeline.answer.correctionAt));assert.ok(timeline.answer.correctionInkAt>best.times.at(-1)+timeline.answer.correctionAt);}
  }
 }
});
test('serve transfer preserves right-handed geometry and changes only observed spacing',()=>{
 const first=m.serve(0,null),prior=m.serve(1,null,true),shift=m.serve(1,null),restore=m.serve(1,2),ad=m.serve(2,1);
 assert.deepEqual(prior.bounce,shift.bounce);assert.deepEqual(prior.receiver,shift.receiver);
 assert.ok(shift.spacing>prior.spacing+.5);assert.ok(restore.spacing<.35);
 assert.ok(first.receiver[0]<first.receiverFoot[0],'Far right-handed forehand is screen-left');
 assert.ok(ad.receiver[0]>ad.receiverFoot[0],'Ad-court cramped contact is backhand, not a mirrored forehand');
 assert.deepEqual(m.serve(2,null,true).far,m.serve(2,null).far);
 for(let scene=0;scene<3;scene++)for(let i=0;i<4;i++){const s=m.serve(scene,i);assert.ok(s.bounce[0]*s.start[0]<0&&s.bounce[1]>=-6.4&&s.bounce[1]<0);assert.ok(s.spacing<=1.051);}
});
test('approach contrasts change depth and movement without guaranteeing a point outcome',()=>{
 const short=m.approach(0,0),deep=m.approach(0,2),cross=m.approach(2,3),line=m.approach(2,0);
 assert.ok(short.receiver[1]>-11.885&&deep.receiver[1]<-11.885);
 assert.ok(short.volley[2]<.914&&deep.volley[2]>.914);
 assert.ok(cross.receiver[0]>0&&line.receiver[0]<0);
 assert.ok(Math.abs(cross.receiverFoot[0]-cross.far[0])>Math.abs(line.receiverFoot[0]-line.far[0]));
 for(let scene=0;scene<3;scene++)for(let choice=0;choice<4;choice++){
  const a=m.approach(scene,choice),u=(a.split[1]-a.start[1])/(a.bounce[1]-a.start[1]);
  const ballLine=a.start[0]+u*(a.bounce[0]-a.start[0]);
  assert.ok(Math.abs(a.split[0]-ballLine)<=.501,'Close along the approach before the pass is known');
  samePoint(m.sample(a,a.times[2]).near,a.split);
 }
});
test('wrong answer keys, action substitutions and illegal service landings fail closed',()=>{
 const step=lessons[1].steps[0];
 assert.ok(m.audit({...step,correct:1}).length);
 assert.ok(m.audit({...step,visual:{...step.visual,actions:['repeat','T','wide','made-up']}}).length);
 const source=fs.readFileSync(new URL('./gold-daily-construction.js',import.meta.url),'utf8');
 const context={module:{exports:{}}};vm.runInNewContext(source.replace('const bounceY=-5.2','const bounceY=2'),context);
 assert.ok(context.module.exports.audit(step).some(e=>/landing|service box/.test(e)));
});
