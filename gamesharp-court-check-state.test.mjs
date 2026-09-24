import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url), state=require('./gamesharp-court-check-state.js');
const first='2026-09-14T10:00:00.000Z', later='2026-09-15T11:00:00.000Z', last='2026-09-16T12:00:00.000Z';
const defs=[{id:'return-check-v1',version:1,lessonId:'gold_return_position_v1'},{id:'mental-check-v1',version:1,lessonId:'gold_mental_reset_v1'},{id:'volley-check-v1',version:2,lessonId:'gold_approach_volley_v1'}];
const ids=defs.map(d=>d.id), blank={version:1,experiment:null};
const payload=(overrides={})=>({before:5,after:3,observation:'unsure',comparable:false,...overrides});
const validate=(id,value)=>ids.includes(id)&&!!value&&typeof value==='object'&&Object.keys(value).sort().join(',')==='after,before,comparable,observation'&&['before','after'].every(k=>Object.hasOwn(value,k)&&Number.isInteger(value[k])&&value[k]>=0&&value[k]<=10)&&['yes','no','unsure'].includes(value.observation)&&typeof value.comparable==='boolean';
const experiment=(id=ids[0],overrides={})=>({experimentId:id,lessonId:defs.find(d=>d.id===id).lessonId,definitionVersion:defs.find(d=>d.id===id).version,plannedAt:first,report:null,...overrides});
const stored=experiments=>({version:1,experiments});
const storage=initial=>{
  const m=new Map([['gamesharp_forehand_check_v1','forehand'],['gamesharp_sharpen_v2','sharpen'],['gs_gold_daily_loop_v1','daily'],['gs_gold_daily_main_v1','history'],['gamesharp_challenges_done','9']]);
  if(initial!==undefined)m.set(state.key,typeof initial==='string'?initial:JSON.stringify(initial));
  const calls=[];
  return {getItem(k){calls.push(['get',k]);return m.get(k)??null;},setItem(k,v){calls.push(['set',k]);m.set(k,v);},m,calls};
};
const create=(disk=storage(),definitions=defs,validator=validate)=>state.createStore(disk,definitions,validator);

test('each exact experiment independently requires a plan then an explicit report',()=>{
  const disk=storage(),a=create(disk);
  for(const id of ids){
    assert.deepEqual(a.read(id),blank);
    assert.equal(a.report(id,payload(),later),false);
    assert.deepEqual(a.plan(id,first),{version:1,experiment:experiment(id)});
    assert.equal(a.read(id).experiment.report,null);
    assert.equal(a.report(id,payload(),later),true);
    assert.deepEqual(a.read(id).experiment.report,{...payload(),reportedAt:later});
  }
  const saved=JSON.parse(disk.m.get(state.key));
  assert.equal(saved.version,1);assert.deepEqual(Object.keys(saved.experiments),ids);
  for(const id of ids)assert.deepEqual(create(disk).read(id),a.read(id));
});

test('separate store instances preserve other experiments when interleaving updates',()=>{
  const disk=storage(),a=create(disk),b=create(disk);
  a.plan(ids[0],first);b.plan(ids[1],later);a.plan(ids[2],last);
  b.report(ids[0],payload(),later);a.report(ids[1],payload({before:1}),last);
  const c=create(disk);
  assert.equal(c.read(ids[0]).experiment.report.before,5);
  assert.equal(c.read(ids[1]).experiment.report.before,1);
  assert.equal(c.read(ids[2]).experiment.report,null);
  assert.equal(c.read(ids[1]).experiment.plannedAt,later);
});

test('only the new exact storage key is accessed and forehand/Daily progress stay untouched',()=>{
  const disk=storage(),before=[...disk.m],a=create(disk);
  for(const id of ids){a.read(id);a.plan(id,first);a.report(id,payload(),later);}
  assert.equal(state.key,'gamesharp_court_checks_v1');
  assert.ok(disk.calls.every(([,key])=>key===state.key));
  for(const [key,value] of before)assert.equal(disk.m.get(key),value);
});

test('unknown, unsafe, coerced and schema-ambiguous IDs cannot read or write storage',()=>{
  const disk=storage(),a=create(disk);
  for(const id of [null,undefined,1,[],{},new String(ids[0]),'unknown','__proto__','constructor','prototype',ids[0]+' ']){
    assert.deepEqual(a.read(id),blank);assert.deepEqual(a.plan(id,first),blank);assert.equal(a.report(id,payload(),later),false);
  }
  assert.equal(disk.calls.length,0);
  for(const definitions of [null,[],[{...defs[0],version:'1'}],[{...defs[0],version:0}],[{...defs[0],version:Number.MAX_SAFE_INTEGER+1}],[{...defs[0],lessonId:1}],[Object.create(defs[0])],[defs[0],defs[0]],[defs[0],{...defs[0],version:2},defs[0]]]){
    const b=create(disk,definitions);assert.deepEqual(b.plan(ids[0],first),blank);assert.equal(b.report(ids[0],payload(),later),false);
  }
  assert.equal(disk.calls.length,0);
});

test('the first plan and court result stay immutable independently for every experiment',()=>{
  const disk=storage(),a=create(disk);
  for(const id of ids){a.plan(id,first);a.plan(id,later);a.report(id,payload(),later);}
  const snapshots=ids.map(id=>a.read(id)),writes=disk.calls.filter(([verb])=>verb==='set').length;
  const reopened=create(disk);
  for(const [i,id] of ids.entries()){
    a.plan(id,last);reopened.plan(id,last);
    assert.equal(a.report(id,payload({after:0}),last),false);
    assert.equal(reopened.report(id,payload({after:0}),last),false);
    assert.deepEqual(reopened.read(id),snapshots[i]);
  }
  assert.equal(disk.calls.filter(([verb])=>verb==='set').length,writes);
});

test('strict validation rejects missing, inherited, coerced and out-of-range fields without writes',()=>{
  const disk=storage(),a=create(disk);a.plan(ids[0],first);
  const bad=[null,undefined,[],{},Object.create(payload()),payload({comparable:1}),payload({comparable:'false'}),payload({observation:'better'})];
  for(const key of Object.keys(payload())){const value=payload();delete value[key];bad.push(value);}
  for(const key of ['before','after'])for(const value of [-1,11,0.5,NaN,Infinity,'3',true,null,undefined,{},[]])bad.push(payload({[key]:value}));
  for(const value of bad)assert.equal(a.report(ids[0],value,later),false);
  assert.equal(a.read(ids[0]).experiment.report,null);
  assert.equal(disk.calls.filter(([verb])=>verb==='set').length,1);
  assert.equal(a.report(ids[0],payload({before:0,after:10,comparable:true,observation:'no'}),later),true);
});

test('payload copying excludes executable, nested, unsafe or metadata fields before validation',()=>{
  let getterCalls=0,validatorCalls=0;
  const a=create(storage(),defs,()=>{validatorCalls++;return true;});a.plan(ids[0],first);
  const accessor=payload();Object.defineProperty(accessor,'extra',{enumerable:true,get(){getterCalls++;return 1;}});
  const hidden=payload();Object.defineProperty(hidden,'extra',{value:1});
  const symbol=payload();symbol[Symbol('extra')]=1;
  const values=[accessor,hidden,symbol];
  for(const value of [undefined,NaN,Infinity,{},[],()=>1,1n,Symbol('value')])values.push({...payload(),extra:value});
  for(const name of ['__proto__','constructor','prototype','experimentId','lessonId','definitionVersion','plannedAt','reportedAt']){
    const value=payload();Object.defineProperty(value,name,{value:'untrusted',enumerable:true});values.push(value);
  }
  for(const value of values)assert.equal(a.report(ids[0],value,later),false);
  assert.equal(getterCalls,0);assert.equal(validatorCalls,0);
  const b=create(storage(),defs,(_,p)=>p.nullable===null&&p.text==='ok'&&p.count===0&&p.flag===false);
  b.plan(ids[0],first);assert.equal(b.report(ids[0],{nullable:null,text:'ok',count:0,flag:false},later),true);
  assert.deepEqual(b.read(ids[0]).experiment.report,{nullable:null,text:'ok',count:0,flag:false,reportedAt:later});
  assert.equal({}.polluted,undefined);
});

test('a missing, throwing, mutating or merely truthy validator cannot accept a report',()=>{
  for(const validator of [null,undefined,()=>1,()=>({ok:true}),()=>{throw Error('bad schema');},(_,p)=>{p.after=0;return true;}]){
    const a=state.createStore(storage(),defs,validator);a.plan(ids[0],first);
    assert.equal(a.report(ids[0],payload(),later),false);assert.equal(a.read(ids[0]).experiment.report,null);
  }
});

test('each report is validated under its own exact definition and never borrowed from another',()=>{
  const validator=(id,p)=>Object.keys(p).length===1&&p.observation===id;
  const disk=storage(),a=create(disk,defs,validator);
  for(const id of ids)a.plan(id,first);
  for(const id of ids)for(const other of ids)if(id!==other)assert.equal(a.report(id,{observation:other},later),false);
  for(const id of ids)assert.equal(a.report(id,{observation:id},later),true);
  const saved=JSON.parse(disk.m.get(state.key));
  saved.experiments[ids[0]].report.observation=ids[1];disk.m.set(state.key,JSON.stringify(saved));
  const reopened=create(disk,defs,validator);
  assert.equal(reopened.read(ids[0]).experiment.report,null);
  for(const id of ids.slice(1))assert.equal(reopened.read(id).experiment.report.observation,id);
});

test('full UTC timestamps are real, strict and ordered without Date or string coercion',()=>{
  const invalid=[null,undefined,true,1,NaN,{},[],new Date(first),'','now','2026-09-14','2026-02-30T10:00:00Z','2026-09-14T24:00:00Z','2026-09-14T10:00:00+00:00','2026-09-14T10:00:00.1234Z','2026-09-14T10:00:60Z'];
  const disk=storage(),a=create(disk);
  for(const at of invalid)assert.deepEqual(a.plan(ids[0],at),blank);
  a.plan(ids[0],first);
  for(const at of [...invalid,'2026-09-14T09:59:59.999Z'])assert.equal(a.report(ids[0],payload(),at),false);
  assert.equal(a.report(ids[0],payload(),first),true);
  for(const at of ['2026-09-14T10:00:00Z','2026-09-14T10:00:00.1Z','2026-09-14T10:00:00.12Z'])assert.equal(create().plan(ids[0],at).experiment.plannedAt,at);
});

test('corrupt top-level storage loads empty without treating parse failure as denied access',()=>{
  for(const invalid of ['{broken','null','[]','{}',stored([]),{version:'1',experiments:{}},{version:2,experiments:{[ids[0]]:experiment()}}]){
    const a=create(storage(invalid));assert.deepEqual(a.read(ids[0]),blank);assert.equal(a.persistent(),true);
    assert.equal(a.plan(ids[0],first).experiment.lessonId,defs[0].lessonId);
  }
});

test('malformed record identities and definition versions cannot erase other valid experiments',()=>{
  const invalid=[null,[],{},experiment(ids[0],{experimentId:ids[1]}),experiment(ids[0],{lessonId:defs[1].lessonId}),experiment(ids[0],{definitionVersion:'1'}),experiment(ids[0],{definitionVersion:2}),experiment(ids[0],{plannedAt:'now'})];
  for(const value of invalid){
    const disk=storage(stored({[ids[0]]:value,[ids[1]]:experiment(ids[1]),[ids[2]]:experiment(ids[2])})),a=create(disk);
    assert.deepEqual(a.read(ids[0]),blank);
    assert.deepEqual(a.read(ids[1]).experiment,experiment(ids[1]));
    a.plan(ids[0],later);
    assert.deepEqual(a.read(ids[2]).experiment,experiment(ids[2]));
    assert.equal(Object.keys(JSON.parse(disk.m.get(state.key)).experiments).length,3);
  }
});

test('invalid or orphan reports are stripped without inventing practice or losing plans',()=>{
  const reports=[true,[],{},payload(),{...payload(),reportedAt:'now'},{...payload(),reportedAt:'2026-09-13T10:00:00Z'},{...payload({before:'5'}),reportedAt:later},{...payload(),reportedAt:later,mastered:true}];
  for(const report of reports){
    const a=create(storage(stored({[ids[0]]:experiment(ids[0],{report}),[ids[1]]:experiment(ids[1],{report:{...payload(),reportedAt:later}})})));
    assert.deepEqual(a.read(ids[0]).experiment,experiment());
    assert.equal(a.read(ids[1]).experiment.report.after,3);
  }
  assert.deepEqual(create(storage(stored({[ids[0]]:{report:{...payload(),reportedAt:later}}}))).read(ids[0]),blank);
});

test('a changed definition is withheld rather than migrating old practice into a new schema',()=>{
  const disk=storage(stored(Object.fromEntries(ids.map(id=>[id,experiment(id)]))));
  const revised=defs.map((d,i)=>({...d,version:i===0?2:d.version})),a=create(disk,revised);
  assert.deepEqual(a.read(ids[0]),blank);assert.equal(a.read(ids[1]).experiment.definitionVersion,1);
  assert.equal(a.plan(ids[0],later).experiment.definitionVersion,2);
  assert.equal(a.read(ids[2]).experiment.definitionVersion,2);
  const mutable=defs.map(d=>({...d})),b=create(storage(),mutable);mutable[0].id='other';mutable[0].version=99;
  assert.equal(b.plan(ids[0],first).experiment.definitionVersion,1);
});

test('blocked reads latch to memory and all three experiments remain available for this visit',()=>{
  let reads=0,writes=0;
  const a=create({getItem(){reads++;throw Error('blocked');},setItem(){writes++;throw Error('blocked');}});
  for(const id of ids){a.plan(id,first);assert.equal(a.report(id,payload(),later),true);}
  for(const id of ids)assert.equal(a.read(id).experiment.report.after,3);
  assert.equal(a.persistent(),false);assert.equal(reads,1);assert.equal(writes,0);
});

test('quota failure never reloads stale disk or drops another in-memory experiment',()=>{
  const original=stored({[ids[0]]:experiment(),[ids[1]]:experiment(ids[1])}),disk=storage(original);let reads=0,writes=0;
  const a=create({getItem(k){reads++;return disk.getItem(k);},setItem(){writes++;throw Error('quota');}});
  assert.equal(a.report(ids[0],payload(),later),true);assert.equal(a.persistent(),false);
  const afterFailureReads=reads;
  a.plan(ids[2],last);a.report(ids[1],payload({after:8}),last);
  assert.equal(a.read(ids[0]).experiment.report.after,3);
  assert.equal(a.read(ids[1]).experiment.report.after,8);
  assert.equal(a.read(ids[2]).experiment.plannedAt,last);
  assert.equal(reads,afterFailureReads);assert.equal(writes,1);
  assert.deepEqual(JSON.parse(disk.m.get(state.key)),original);
});

test('revoked permission preserves the last valid multi-experiment snapshot',()=>{
  const disk=storage(),a=create(disk);a.plan(ids[0],first);a.plan(ids[1],later);
  let reads=0;disk.getItem=()=>{reads++;throw Error('revoked');};
  assert.equal(a.read(ids[0]).experiment.plannedAt,first);a.plan(ids[2],last);
  assert.equal(a.report(ids[1],payload(),last),true);
  assert.equal(a.read(ids[1]).experiment.report.after,3);assert.equal(reads,1);
});

test('snapshots and API are frozen, report inputs are copied, and browser/CommonJS APIs agree',()=>{
  const a=create(),planned=a.plan(ids[0],first);
  assert.ok(Object.isFrozen(planned));assert.ok(Object.isFrozen(planned.experiment));
  assert.throws(()=>{planned.experiment.plannedAt=last;},TypeError);
  const input=payload();a.report(ids[0],input,later);input.after=0;
  const read=a.read(ids[0]);assert.ok(Object.isFrozen(read.experiment.report));
  assert.equal(read.experiment.report.after,3);assert.notEqual(a.read(ids[0]).experiment.report,read.experiment.report);
  const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(new URL('./gamesharp-court-check-state.js',import.meta.url),'utf8'),context);
  const browser=context.window.GameSharpCourtCheckState;assert.equal(browser.key,state.key);assert.ok(Object.isFrozen(browser));
  const b=browser.createStore(null,defs,validate);assert.ok(Object.isFrozen(b));b.plan(ids[0],first);
  assert.equal(b.report(ids[0],payload(),later),true);assert.equal(b.read(ids[0]).experiment.report.after,3);assert.equal(b.persistent(),false);
});
