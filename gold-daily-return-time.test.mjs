import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),e=require('./gold-daily-return-time.js'),C=require('./gold-daily-construction.js');
const spine={id:'return_second_serve_steal_time',prototypeId:'gold_return_time_v1',slug:'return-time',title:'The Second Serve You Let Escape',memory:'You can take time before you add pace.',painHook:'The second serve offers time.',tomorrowAction:'Compare a manageable earlier contact.',prototypeDecisionLenses:['opportunity','clock','boundary'],proInsight:{player:'Andre Agassi'}};
const lesson=e.lessons({byId:{return_second_serve_steal_time:spine}})[0];
const wc=s=>s.trim().split(/\s+/).length;
test('return-time binds three decisions, twelve alternatives and concise copy',()=>{
 assert.equal(lesson.steps.length,3);assert.equal(lesson.slug,'return-time');
 for(const step of lesson.steps){assert.deepEqual(e.audit(step),[]);assert.ok(wc(step.situation)<=14);assert.ok(wc(step.question)<=8);assert.ok(wc(step.payoff)<=16);assert.ok(wc(step.principle)<=18);assert.ok(wc(step.why)<=34);assert.ok(step.options.every(o=>wc(o.text)>=4&&wc(o.text)<=10));assert.ok(wc(step.situation)+wc(step.question)+wc(step.payoff)+wc(step.principle)+step.options.reduce((n,o)=>n+wc(o.text),0)<=78);}
});
test('the transfer first proves the low rising interception unreachable from this start',()=>{
 const m=e.model('return_time',2,2),early=e.model('return_time',2,3);
 assert.ok(early.receiver[2]>1.6);assert.ok(e.metrics(early).travelSpeed<=early.maxSpeed);
 for(let q=.001;q<7/9.81;q+=.002){const p=e.incoming(m,m.bounceAt+q);if(p[2]<=1.6)assert.ok(e.requiredSpeed(m,q)>m.maxSpeed,'A low rising contact is reachable, invalidating the lesson');}
 assert.ok(m.receiver[2]>1&&m.receiver[2]<1.6);assert.ok(e.sample(m,m.contactAt).descending);assert.ok(e.metrics(m).travelSpeed<m.maxSpeed);
 for(const c of [0,1,3])assert.ok(e.model('return_time',2,c).receiver[2]>1.6);
 const changed={...m,initial:[-1,-8.5,0]};assert.ok(e.requiredSpeed(changed,.2)<changed.maxSpeed,'Changing the starting position must be capable of reversing the boundary');
 const read=e.render(lesson.steps[2],null,3.4,true);assert.match(read,/without a return/);assert.doesNotMatch(read,/Your choice|Compare C/);assert.equal(e.events(lesson.steps[2],null).filter(x=>x.audio==='ground').length,0);
});
test('position comparison keeps serve, target and pace while all tactical alternatives change what they claim',()=>{
 const early=e.model('return_time',0,0),usual=e.model('return_time',0,null),wide=e.model('return_time',0,1),loop=e.model('return_time',0,2),short=e.model('return_time',0,3);
 assert.deepEqual(early.start,usual.start);assert.deepEqual(early.bounce,usual.bounce);assert.deepEqual(early.velocity,usual.velocity);assert.deepEqual(early.target,usual.target);assert.equal(e.metrics(early).horizontalReturnSpeed,e.metrics(usual).horizontalReturnSpeed);assert.ok(early.end<usual.end);assert.ok(early.receiver[1]>-11.885&&usual.receiver[1]<-11.885);
 assert.ok(wide.target[0]>usual.target[0]);assert.ok(loop.receiver[1]<usual.receiver[1]);assert.ok(loop.returnDuration>usual.returnDuration);assert.ok(short.target[1]<usual.target[1]);
});
test('faster later return remains genuinely faster but arrives later on the identical serve',()=>{
 const a=e.model('return_time',1,null,0),b=e.model('return_time',1,null,1);
 assert.deepEqual(a.start,b.start);assert.deepEqual(a.bounce,b.bounce);assert.deepEqual(a.velocity,b.velocity);assert.deepEqual(a.target,b.target);
 assert.ok(e.metrics(b).horizontalReturnSpeed>e.metrics(a).horizontalReturnSpeed);assert.ok(b.returnDuration<a.returnDuration);assert.ok(a.end<b.end);
 assert.ok(Math.abs(e.metrics(a).arrival-2.15)<1e-8);assert.ok(Math.abs(e.metrics(b).arrival-2.36)<1e-8);
 for(let choice=0;choice<4;choice++)for(const variant of [0,1]){const m=e.model('return_time',1,choice,variant),reference=variant?a:b;assert.deepEqual(m.bounce,reference.bounce);assert.equal(m.returnDuration,variant?b.returnDuration:a.returnDuration,'An explanation must not fabricate different evidence');}
});
test('all alternatives have finite continuous contacts, legal net crossings and visible court states',()=>{
 for(const step of lesson.steps)for(let choice=0;choice<4;choice++)for(const variant of step.visual.scene===1?[0,1]:[0]){
  const m=e.model('return_time',step.visual.scene,choice,variant);assert.deepEqual(e.sample(m,m.hit).ball,m.start);assert.deepEqual(e.sample(m,m.bounceAt).ball,m.bounce);assert.ok(e.sample(m,m.contactAt).ball.every((v,i)=>Math.abs(v-m.receiver[i])<1e-9));
  for(let t=0;t<=m.end;t+=.01){const s=e.sample(m,t);assert.ok([...s.ball,...s.far,...s.near].every(Number.isFinite));assert.ok(s.ball[2]>=-.001);const [x,y]=C.project(s.ball);assert.ok(x>=5&&x<=475&&y+70>=5&&y+70<=390,'Ball clipped from visual');}
  for(const reduced of [false,true])assert.doesNotMatch(e.render(step,choice,20,reduced),/NaN|undefined/);
 }
});
test('read and selected event clocks agree with the renderer and finish before payoff',()=>{
 for(const step of lesson.steps){for(const selected of [null,0,1,2,3]){const timeline=e.timelineFor(step,selected!==null),events=e.events(step,selected);assert.ok(events.every(v=>v.at>=0&&v.at<timeline.total));if(selected!==null){const boundary=selected===step.correct?timeline.inkAt:timeline.correctionInkAt;assert.ok(Math.max(...events.map(v=>v.at))<boundary);}}
 const wrong=(step.correct+1)%4;assert.match(e.render(step,wrong,e.timelineFor(step,true).correctionAt+.1,false),new RegExp('Compare '+String.fromCharCode(65+step.correct)));assert.ok(e.audit({...step,correct:wrong}).length);
 }
});
