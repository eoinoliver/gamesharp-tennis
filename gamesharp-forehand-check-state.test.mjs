import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url), state=require('./gamesharp-forehand-check-state.js');
const first='2026-09-14T10:00:00.000Z', later='2026-09-15T11:00:00.000Z', last='2026-09-16T12:00:00.000Z';
const payload=(overrides={})=>({beforeMisses:5,afterMisses:3,spacing:'more-room',comparable:true,...overrides});
const experiment=(overrides={})=>({experimentId:'forehand-space-check-v1',lessonId:'gold_contact_point_v1',plannedAt:first,report:null,...overrides});
const storage=initial=>{
  const m=new Map([['gamesharp_sharpen_v2','sharpen'],['gamesharp_pain_coach_v1','legacy'],['gamesharp_pain_coach_draft_v1','draft'],['gs_gold_daily_loop_v1','daily'],['gs_gold_daily_main_v1','history'],['gamesharp_challenges_done','9']]);
  if(initial!==undefined)m.set(state.key,typeof initial==='string'?initial:JSON.stringify(initial));
  const calls=[];
  return {getItem(k){calls.push(['get',k]);return m.get(k)??null;},setItem(k,v){calls.push(['set',k]);m.set(k,v);},m,calls};
};

test('planning is distinct from reporting an explicit court experiment',()=>{
  const disk=storage(),a=state.createStore(disk);
  assert.deepEqual(a.read(),{version:1,experiment:null});
  assert.equal(a.report(payload(),later),false);
  assert.deepEqual(a.plan(first),{version:1,experiment:experiment()});
  assert.equal(a.read().experiment.report,null);
  assert.equal(a.report(payload(),later),true);
  assert.deepEqual(a.read().experiment.report,{...payload(),reportedAt:later});
  assert.deepEqual(state.createStore(disk).read(),a.read());
  assert.deepEqual(Object.keys(a).sort(),['key','persistent','plan','read','report']);
});

test('only this exact experiment key is read or written; existing progress remains untouched',()=>{
  const disk=storage(),before=[...disk.m],a=state.createStore(disk);
  a.read();a.plan(first);a.report(payload(),later);a.read();
  assert.equal(state.key,'gamesharp_forehand_check_v1');
  assert.ok(disk.calls.length>0);assert.ok(disk.calls.every(([,key])=>key===state.key));
  for(const [key,value] of before)assert.equal(disk.m.get(key),value);
});

test('the first valid plan and result cannot be overwritten by repeats or improved scores',()=>{
  const disk=storage(),a=state.createStore(disk);
  a.plan(first);a.plan(later);assert.equal(a.read().experiment.plannedAt,first);
  assert.equal(a.report(payload({afterMisses:7,spacing:'same'}),later),true);
  const saved=a.read(),writes=disk.calls.filter(([method])=>method==='set').length;
  a.plan(last);assert.equal(a.report(payload({afterMisses:0}),last),false);
  assert.deepEqual(a.read(),saved);
  const reopened=state.createStore(disk);reopened.plan(last);
  assert.equal(reopened.report(payload({afterMisses:0}),last),false);
  assert.deepEqual(reopened.read(),saved);
  assert.equal(disk.calls.filter(([method])=>method==='set').length,writes);
});

test('explicit noncomparable and unsure observations remain data, not an improvement claim',()=>{
  const a=state.createStore(storage());a.plan(first);
  assert.equal(a.report(payload({beforeMisses:10,afterMisses:0,spacing:'unsure',comparable:false}),later),true);
  assert.deepEqual(a.read().experiment.report,{beforeMisses:10,afterMisses:0,spacing:'unsure',comparable:false,reportedAt:later});
  assert.deepEqual(Object.keys(a.read().experiment).sort(),['experimentId','lessonId','plannedAt','report']);
  assert.deepEqual(Object.keys(a.read().experiment.report).sort(),['afterMisses','beforeMisses','comparable','reportedAt','spacing']);
});

test('missing, inherited, coerced and out-of-range report inputs are rejected without writes',()=>{
  const disk=storage(),a=state.createStore(disk);a.plan(first);
  const bad=[null,undefined,[],{},Object.create(payload()),payload({spacing:'improved'}),payload({comparable:1}),payload({comparable:'true'})];
  for(const key of ['beforeMisses','afterMisses','spacing','comparable']){const value=payload();delete value[key];bad.push(value);}
  for(const key of ['beforeMisses','afterMisses'])for(const value of [-1,11,0.5,NaN,Infinity,'3',true,null,undefined,{},[]])bad.push(payload({[key]:value}));
  for(const value of bad)assert.equal(a.report(value,later),false,JSON.stringify(value));
  assert.equal(a.read().experiment.report,null);
  assert.equal(disk.calls.filter(([method])=>method==='set').length,1);
  assert.equal(a.report(payload({beforeMisses:0,afterMisses:10,spacing:'same'}),later),true);
});

test('timestamps require real full UTC ISO values, with no coercion or report before plan',()=>{
  const invalid=[null,undefined,true,1,NaN,{},[],'','now','2026-09-14','2026-02-30T10:00:00Z','2026-09-14T24:00:00Z','2026-09-14T10:00:00+00:00','2026-09-14T10:00:00.1234Z','2026-09-14T10:00:60Z'];
  const disk=storage(),a=state.createStore(disk);
  for(const at of invalid){a.plan(at);assert.equal(a.read().experiment,null);}
  a.plan(first);
  for(const at of [...invalid,'2026-09-14T09:59:59.999Z'])assert.equal(a.report(payload(),at),false);
  assert.equal(a.report(payload(),first),true,'Same timestamp is allowed; a quiz cannot invoke this API implicitly');
  for(const at of ['2026-09-14T10:00:00Z','2026-09-14T10:00:00.1Z','2026-09-14T10:00:00.12Z']){
    const b=state.createStore(storage());assert.equal(b.plan(at).experiment.plannedAt,at);
  }
});

test('corrupt schema, wrong identities and arbitrary dates cannot load an experiment',()=>{
  for(const invalid of [null,[],{}, {version:2,experiment:experiment()}, {version:'1',experiment:experiment()}, {version:1,experiment:[]}, {version:1,experiment:experiment({experimentId:'another'})}, {version:1,experiment:experiment({experimentId:1})}, {version:1,experiment:experiment({lessonId:'another'})}, {version:1,experiment:experiment({lessonId:[]})}, {version:1,experiment:experiment({plannedAt:'now'})}]){
    assert.deepEqual(state.createStore(storage(invalid)).read(),{version:1,experiment:null});
  }
  const a=state.createStore(storage('{broken'));assert.deepEqual(a.read(),{version:1,experiment:null});assert.equal(a.persistent(),true);
  assert.equal(a.plan(first).experiment.lessonId,'gold_contact_point_v1');
});

test('malformed or orphan results are stripped without inventing practice',()=>{
  for(const report of [true,[],{},payload(),{...payload(),reportedAt:'now'},{...payload(),reportedAt:'2026-09-13T10:00:00Z'},{...payload({beforeMisses:'5'}),reportedAt:later},{...payload({comparable:null}),reportedAt:later}]){
    const a=state.createStore(storage({version:1,experiment:experiment({report,tried:true,mastered:true})}));
    assert.deepEqual(a.read(),{version:1,experiment:experiment()});
  }
  const a=state.createStore(storage({version:1,experiment:null,report:{...payload(),reportedAt:later}}));
  assert.equal(a.read().experiment,null);
});

test('blocked reads latch to memory with no further storage calls',()=>{
  let reads=0,writes=0;
  const a=state.createStore({getItem(){reads++;throw Error('blocked');},setItem(){writes++;throw Error('blocked');}});
  a.plan(first);assert.equal(a.persistent(),false);assert.equal(a.report(payload(),later),true);
  for(let i=0;i<3;i++)assert.equal(a.read().experiment.report.afterMisses,3);
  assert.equal(reads,1);assert.equal(writes,0);
});

test('quota failure never restores an older disk plan over the new in-memory result',()=>{
  const old={version:1,experiment:experiment()},disk=storage(old);let reads=0,writes=0;
  const a=state.createStore({getItem(k){reads++;return disk.getItem(k);},setItem(){writes++;throw Error('quota');}});
  assert.equal(a.report(payload(),later),true);assert.equal(a.persistent(),false);
  const afterFailureReads=reads;
  for(let i=0;i<3;i++)assert.equal(a.read().experiment.report.afterMisses,3);
  a.plan(last);assert.equal(a.report(payload({afterMisses:0}),last),false);
  assert.equal(reads,afterFailureReads);assert.equal(writes,1);
  assert.deepEqual(JSON.parse(disk.m.get(state.key)),old);
});

test('a revoked storage permission preserves the most recent good snapshot',()=>{
  const disk=storage(),a=state.createStore(disk);a.plan(first);
  let reads=0;disk.getItem=()=>{reads++;throw Error('revoked');};
  assert.equal(a.read().experiment.plannedAt,first);assert.equal(a.persistent(),false);
  assert.equal(a.report(payload(),later),true);assert.equal(a.read().experiment.report.afterMisses,3);assert.equal(reads,1);
});

test('returned snapshots are deep-enough clones, and the standalone browser API is frozen',()=>{
  const a=state.createStore(storage());const planned=a.plan(first);
  planned.experiment.plannedAt=last;planned.experiment.report={...payload(),reportedAt:later};
  assert.deepEqual(a.read().experiment,experiment());
  const input=payload();a.report(input,later);input.afterMisses=0;
  const read=a.read();read.experiment.report.afterMisses=0;read.experiment.lessonId='other';
  assert.equal(a.read().experiment.report.afterMisses,3);assert.equal(a.read().experiment.lessonId,'gold_contact_point_v1');
  const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(new URL('./gamesharp-forehand-check-state.js',import.meta.url),'utf8'),context);
  const browser=context.window.GameSharpForehandCheckState;assert.equal(browser.key,state.key);assert.ok(Object.isFrozen(browser));
  const local=browser.createStore(null);assert.ok(Object.isFrozen(local));local.plan(first);assert.equal(local.report(payload(),later),true);
  assert.equal(local.read().experiment.report.afterMisses,3);assert.equal(local.persistent(),false);
});
