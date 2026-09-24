import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),e=require('./gold-daily-tradeoffs.js'),s=require('./gold-daily-lesson-spines.js');
const lessons=e.lessons(s);
test('three trade-offs bind nine decisions and all 36 finite, legal alternatives',()=>{
 assert.equal(lessons.length,3);
 for(const l of lessons)for(const step of l.steps){assert.deepEqual(e.audit(step),[]);for(let c=0;c<4;c++){
  for(const reduced of [true,false]){const html=e.render(step,c,8.4,reduced);assert.doesNotMatch(html,/NaN|undefined/);assert.match(html,/<svg/);assert.equal((html.match(/<svg/g)||[]).length,reduced&&c!==step.correct?2:1);}
  const m=e.model(step.visual.kind,step.visual.scene,c);assert.equal(e.sample(m,m.bounceAt).ball[2],0);assert.deepEqual(e.sample(m,m.hit).ball,m.start);
  for(let t=0;t<=m.end;t+=.02){const p=e.sample(m,t);assert.ok([...p.ball,...p.near,...p.far].every(Number.isFinite));assert.ok(p.ball[2]>=0);const [x,y]=require('./gold-daily-construction.js').project(p.ball);assert.ok(x>=4&&x<=476&&y>=4&&y<=346,'Ball clipped from evidence');}
 }}
});
test('pressure preserves depth, reverses for the opponent, and buys time on a deep arrival',()=>{
 const earlier=e.model('score_pressure',0,null,true),latest=e.model('score_pressure',0,null);
 assert.deepEqual(earlier.start,latest.start);assert.ok(earlier.receiver[1]<latest.receiver[1]);
 const faster=e.model('score_pressure',0,0);assert.deepEqual(faster.bounce,latest.bounce);assert.ok(faster.receive<latest.receive,'Adding pace must change the flight clock');
 const change=e.model('score_pressure',1,2);assert.ok(change.receiver[0]*change.far[0]<0);
 assert.ok(e.model('score_pressure',2,3).receive>e.model('score_pressure',2,0).receive);
 assert.match(e.render(lessons[0].steps[2],null,5.7,true),/Incoming ball/);
 assert.doesNotMatch(e.render(lessons[0].steps[2],null,5.7,true),/Their contact/);
 assert.deepEqual(e.events(lessons[0].steps[2],null).map(x=>x.audio),['bounce']);
});
test('runaround changes real body position and recovery distance, not the ball handedness label',()=>{
 const fh=e.model('inside_out_consequence',0,0),bh=e.model('inside_out_consequence',0,1);
 assert.deepEqual(fh.start,bh.start);assert.ok(fh.near[0]<fh.start[0]);assert.ok(bh.near[0]>bh.start[0]);
 assert.ok(Math.abs(fh.near[0]-fh.recover[0])>Math.abs(bh.near[0]-bh.recover[0]));
 const earned=e.model('inside_out_consequence',1,0);assert.ok(earned.start[1]<11.885);assert.ok(earned.far[0]*earned.receiver[0]<0);
 assert.equal(fh.replyEnds.length,2);assert.match(e.render(lessons[1].steps[1],0,3.6,true),/START/);
});
test('net alternatives alter the movement clock, with a real float reversal and earlier contact',()=>{
 const late=e.model('net_close_timing',0,0),timed=e.model('net_close_timing',0,3),early=e.model('net_close_timing',0,2);
 assert.ok(late.stopAt>late.receive);assert.equal(timed.splitAt,timed.receive);assert.ok(early.splitAt<early.receive);
 assert.notDeepEqual(e.sample(late,2.3).near,e.sample(timed,2.3).near);
 const guess=e.model('net_close_timing',0,1);assert.ok(e.sample(guess,guess.receive-.1).near[0]>3,'Early direction commitment must happen before contact');
 assert.ok(e.sample(e.model('net_close_timing',1,1),3.6).near[1]<e.sample(e.model('net_close_timing',1,0),3.6).near[1]);
 assert.ok(e.model('net_close_timing',2,0).receive<timed.receive);
 assert.match(e.render(lessons[2].steps[0],0,8.4,true),/Your split lands/);
});
test('payoff waits for comparison and audio never strikes a merely possible reply',()=>{
 for(const l of lessons)for(const step of l.steps){const timeline=e.timelines[step.visual.kind],wrong=(step.correct+1)%4;
  assert.ok(timeline.answer.inkAt>=3.6);assert.ok(timeline.answer.correctionInkAt>=timeline.answer.correctionAt+3.6);
  const events=e.events(step,wrong);assert.ok(events.every(v=>Number.isFinite(v.at)&&v.at<timeline.answer.total));
  if(step.visual.kind!=='net_close_timing')assert.equal(events.filter(v=>v.kind==='contact').length,2);
  assert.ok(e.audit({...step,correct:wrong}).length);
 }
});
