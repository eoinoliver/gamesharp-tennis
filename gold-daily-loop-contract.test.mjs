import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const loop = require('./gold-daily-loop.js');
const gold = require('./gold-daily-prototypes.js');
const integration = require('./predict-live-integration.js');
const storage = () => { const data = new Map(); return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),data}; };
const record = (date, answers = [], step = 0, complete = false) => ({lessonId:loop.lessonFor(date),answers,step,complete});

test('dated expansion preserves all four published cycles before rotating twenty-one stable IDs', () => {
  assert.equal(new Set(loop.order).size, 21);
  assert.deepEqual([...loop.order].sort(), gold.challenges.filter(c=>!c.reviewOnly).map(c=>c.id).sort());
  assert.equal(loop.schedules[2].from,'2026-10-03');
  let date='2026-09-12';
  const seen=[];
  for(let i=0;i<9;i++){seen.push(loop.lessonFor(date));date=loop.nextDate(date);}
  assert.deepEqual(seen,loop.schedules[0].order);
  assert.equal(loop.lessonFor(date),loop.schedules[1].order[0]);
  assert.equal(loop.lessonFor('2026-09-11'),loop.schedules[0].order[8]);
  const expanded=[];
  for(let i=0;i<12;i++){expanded.push(loop.lessonFor(date));date=loop.nextDate(date);}
  assert.deepEqual(expanded,loop.schedules[1].order);
  assert.equal(loop.lessonFor(date),loop.schedules[2].order[0]);
  const fifteen=[];
  for(let i=0;i<15;i++){fifteen.push(loop.lessonFor(date));date=loop.nextDate(date);}
  assert.deepEqual(fifteen,loop.schedules[2].order);
  assert.equal(date,'2026-10-18');
  assert.equal(loop.schedules[3].from,date);
  const eighteen=[];
  for(let i=0;i<18;i++){eighteen.push(loop.lessonFor(date));date=loop.nextDate(date);}
  assert.deepEqual(eighteen,loop.schedules[3].order);
  assert.equal(date,'2026-11-05');
  assert.equal(loop.schedules[4].from,date);
  const twentyOne=[];
  for(let i=0;i<21;i++){twentyOne.push(loop.lessonFor(date));date=loop.nextDate(date);}
  assert.deepEqual(twentyOne,loop.order);
  assert.equal(loop.lessonFor(date),loop.order[0]);
});
test('calendar is civil local date; DST, leap day, year rollover and invalid dates', () => {
  assert.equal(loop.dateKey(new Date(2026,8,12,23,59)), '2026-09-12');
  assert.equal(loop.nextDate('2026-12-31'),'2027-01-01');
  assert.equal(loop.nextDate('2028-02-28'),'2028-02-29');
  assert.equal(loop.nextDate('2026-10-04'),'2026-10-05');
  assert.throws(()=>loop.lessonFor('2026-02-30'));
});
test('only four exact reviewed connections are offered; missing or drifting destinations withhold', () => {
  assert.equal(Object.keys(loop.connections).length,4);
  for(const id of loop.order){const c=loop.connection(id,integration);assert.equal(!!c,!!loop.connections[id]);}
  assert.equal(loop.connection(loop.order[0],null),null);
  assert.equal(loop.connection('gold_direction_change_v1',{isLaunchEligible:()=>true,connection:()=>({playbookId:'wrong'})}),null);
  assert.equal(loop.connection('unknown',integration),null);
});
test('refresh resumes each checkpoint; first answers and completed result cannot be rewritten', () => {
  const disk=storage(),store=loop.createStore(disk),date='2026-09-12';
  store.save(date,record(date,[1]));
  assert.deepEqual(loop.createStore(disk).get(date),record(date,[1]));
  store.save(date,record(date,[1],1));
  store.save(date,record(date,[1,2],1));
  store.save(date,record(date,[1,2],2));
  store.save(date,record(date,[1,2,3],2,true));
  store.save(date,record(date,[0,0,0],2,true));
  assert.deepEqual(store.get(date),record(date,[1,2,3],2,true));
  assert.equal(store.completed().length,1);
  assert.deepEqual([...disk.data.keys()],[loop.key]);
});
test('tabs cannot overwrite previous first answers or move progress backwards', () => {
  const disk=storage(),a=loop.createStore(disk),b=loop.createStore(disk),date='2026-09-12';
  a.save(date,record(date,[2],1));
  b.save(date,record(date,[0]));
  assert.deepEqual(b.get(date),record(date,[2],1));
  b.save(date,record(date,[2]));
  assert.equal(a.get(date).step,1);
});
test('blocked or malformed storage degrades to explicit in-memory progress without deleting other data', () => {
  for(const disk of [null,{getItem:()=>'{broken',setItem:()=>{throw Error('blocked');}},{getItem:()=>null,setItem:()=>{throw Error('quota');}}]){
    const store=loop.createStore(disk),date='2026-09-12';
    store.save(date,record(date,[0,1,2],2,true));
    assert.equal(store.get(date).complete,true);
    assert.equal(store.persistent(),false);
  }
});
test('unknown, corrupt and incomplete records cannot masquerade as completed lessons', () => {
  const disk=storage(),date='2026-09-12';
  disk.setItem(loop.key,JSON.stringify({days:{[date]:{...record(date,[0],0,true)},bad:{complete:true}}}));
  const store=loop.createStore(disk);
  assert.equal(store.get(date),null);
  assert.equal(store.completed().length,0);
  assert.throws(()=>store.save(date,{...record(date),lessonId:'invented'}));
});
