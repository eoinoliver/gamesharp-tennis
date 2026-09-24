import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),state=require('./gamesharp-sharpen-state.js');
const first='2026-09-14T10:00:00.000Z',later='2026-09-15T11:00:00.000Z',last='2026-09-16T12:00:00.000Z';
const focus=(overrides={})=>({lessonId:'lesson',region:'net',pathId:'net_first_volley',savedAt:first,practicedAt:null,feedback:null,...overrides});
const storage=initial=>{
 const m=new Map([['gamesharp_pain_coach_v1','legacy'],['gamesharp_pain_coach_draft_v1','draft'],['gs_gold_daily_loop_v1','daily'],['gs_gold_daily_main_v1','history'],['gamesharp_challenges_done','9']]);
 if(initial!==undefined)m.set(state.key,typeof initial==='string'?initial:JSON.stringify(initial));
 const calls=[];
 return {getItem(k){calls.push(['get',k]);return m.get(k)??null;},setItem(k,v){calls.push(['set',k]);m.set(k,v);},m,calls};
};

test('exposure, saved focus, explicit court practice and self-report remain separate',()=>{
 const disk=storage(),a=state.createStore(disk);
 a.recordSeen('lesson',first);assert.equal(a.read().focus,null);
 a.saveFocus({lessonId:'lesson',region:'net'},first);
 assert.equal(a.read().focus.practicedAt,null);assert.equal(a.read().focus.feedback,null);
 assert.equal(a.feedback('lesson','clearer'),false);
 assert.equal(a.markPracticed('lesson',later),true);assert.equal(a.read().focus.feedback,null);
 assert.equal(a.feedback('lesson','clearer'),true);assert.equal(a.read().focus.feedback,'clearer');
 const reopened=state.createStore(disk);assert.deepEqual(reopened.read(),a.read());
});

test('every storage access stays within the new key; legacy and Daily records are untouched',()=>{
 const disk=storage(),before=[...disk.m],a=state.createStore(disk);
 a.read();a.recordSeen('lesson',first);a.saveFocus({lessonId:'lesson',region:'any-new-region'},first);a.markPracticed('lesson',later);a.feedback('lesson','mixed');
 assert.ok(disk.calls.length>0);assert.ok(disk.calls.every(([,key])=>key===state.key));
 for(const [key,value] of before)assert.equal(disk.m.get(key),value);
 assert.equal(state.key,'gamesharp_sharpen_v2');
});

test('first exposure, first save and first practice are immutable on repeats',()=>{
 const a=state.createStore(storage());
 a.recordSeen('lesson',first);a.recordSeen('lesson',later);assert.equal(a.read().seen.lesson,first);
 a.saveFocus({lessonId:'lesson',region:'net',pathId:'one'},first);
 assert.equal(a.markPracticed('another',later),false);assert.equal(a.feedback('lesson','clearer'),false);
 a.markPracticed('lesson',later);a.feedback('lesson','mixed');
 a.saveFocus({lessonId:'lesson',region:'net',pathId:'two'},last);a.markPracticed('lesson',last);
 assert.deepEqual(a.read().focus,focus({pathId:'one',practicedAt:later,feedback:'mixed'}));
});

test('blocked getItem remains explicit and usable in memory without storage retries',()=>{
 let reads=0,writes=0;
 const a=state.createStore({getItem(){reads++;throw Error('blocked');},setItem(){writes++;throw Error('blocked');}});
 a.saveFocus({lessonId:'lesson',region:'net'},first);
 assert.equal(a.read().focus.lessonId,'lesson');assert.equal(a.persistent(),false);
 assert.equal(a.markPracticed('lesson',later),true);assert.equal(a.feedback('lesson','mixed'),true);
 a.recordSeen('lesson',last);assert.equal(a.read().seen.lesson,last);
 assert.equal(reads,1);assert.equal(writes,0);
});

test('quota failure with working getItem never reloads older disk over new memory',()=>{
 const old={version:2,focus:focus({lessonId:'old',practicedAt:later,feedback:'clearer'}),seen:{old:first}};
 const disk=storage(old);let reads=0,writes=0;
 const a=state.createStore({getItem(k){reads++;return disk.getItem(k);},setItem(){writes++;throw Error('quota');}});
 const saved=a.saveFocus({lessonId:'new',region:'movement'},last);
 assert.equal(saved.focus.lessonId,'new');assert.equal(saved.focus.practicedAt,null);assert.equal(a.persistent(),false);
 const afterFailureReads=reads;
 a.recordSeen('new',last);a.markPracticed('new',last);a.feedback('new','mixed');
 for(let i=0;i<3;i++)assert.equal(a.read().focus.lessonId,'new');
 assert.equal(a.read().focus.feedback,'mixed');assert.equal(a.read().seen.new,last);
 assert.equal(reads,afterFailureReads);assert.equal(writes,1);
 assert.deepEqual(JSON.parse(disk.m.get(state.key)),old,'Failed persistence cannot rewrite disk');
});

test('a later read failure retains the last good snapshot and latches memory mode',()=>{
 const disk=storage(),a=state.createStore(disk);a.recordSeen('lesson',first);a.saveFocus({lessonId:'lesson',region:'net'},first);
 let reads=0;disk.getItem=()=>{reads++;throw Error('revoked');};
 assert.equal(a.read().focus.lessonId,'lesson');assert.equal(a.persistent(),false);
 a.markPracticed('lesson',later);a.feedback('lesson','unclear');assert.equal(a.read().focus.feedback,'unclear');assert.equal(reads,1);
});

test('new lesson or new region cannot inherit previous practice or feedback',()=>{
 const a=state.createStore(storage());a.saveFocus({lessonId:'lesson',region:'net'},first);a.markPracticed('lesson',later);a.feedback('lesson','clearer');
 a.saveFocus({lessonId:'lesson',region:'movement'},last);assert.equal(a.read().focus.practicedAt,null);assert.equal(a.read().focus.feedback,null);
 a.markPracticed('lesson',last);a.feedback('lesson','mixed');a.saveFocus({lessonId:'two',region:'net'},last);
 assert.equal(a.read().focus.practicedAt,null);assert.equal(a.read().focus.feedback,null);
});

test('corrupt practice schema and orphan feedback cannot create an on-court claim',()=>{
 for(const practicedAt of [true,1,{},[],'yes','2026-02-30','2026-09-13',null,undefined]){
  const a=state.createStore(storage({version:2,focus:focus({practicedAt,feedback:'clearer',practiced:true}),seen:{lesson:first}}));
  assert.equal(a.read().focus.practicedAt,null,JSON.stringify(practicedAt));assert.equal(a.read().focus.feedback,null);assert.equal(a.feedback('lesson','mixed'),false);
 }
 for(const feedback of [true,1,{},[],'improved','mastered']){
  const a=state.createStore(storage({version:2,focus:focus({practicedAt:later,feedback}),seen:{}}));
  assert.equal(a.read().focus.feedback,null);
 }
});

test('invalid identity, dates and schema versions are withheld rather than coerced',()=>{
 for(const invalid of [null,[],{}, {version:1,focus:focus()}, {version:'2',focus:focus()}, {version:2,focus:[]}, {version:2,focus:focus({lessonId:1})}, {version:2,focus:focus({region:''})}, {version:2,focus:focus({savedAt:'now'})}, {version:2,focus:focus({pathId:{}})}]){
  const a=state.createStore(storage(invalid));assert.equal(a.read().focus,null);
 }
 const a=state.createStore(storage('{broken'));assert.deepEqual(a.read(),{version:2,focus:null,seen:{}});assert.equal(a.persistent(),true);
 a.saveFocus({lessonId:'future-lesson',region:'future-region'},first);assert.equal(a.read().focus.lessonId,'future-lesson');
});

test('seen sanitization preserves only own safe IDs and real timestamps',()=>{
 const raw='{"version":2,"focus":null,"seen":{"lesson":"2026-09-14","bad":true,"empty":"","invalid":"2026-02-30","__proto__":"2026-09-14","constructor":"2026-09-14"}}';
 const a=state.createStore(storage(raw));assert.deepEqual(a.read().seen,{lesson:'2026-09-14'});
 a.recordSeen('__proto__',first);a.recordSeen('constructor',first);a.recordSeen('valid',first);
 assert.deepEqual(a.read().seen,{lesson:'2026-09-14',valid:first});assert.equal(Object.getPrototypeOf(a.read().seen),Object.prototype);
});

test('invalid caller inputs are no-ops and cannot inject practice or feedback',()=>{
 const a=state.createStore(storage());
 for(const input of [null,{},[],{lessonId:'',region:'net'},{lessonId:' lesson',region:'net'},{lessonId:'lesson',region:1},{lessonId:'lesson',region:'net',pathId:[] }])a.saveFocus(input,first);
 assert.equal(a.read().focus,null);a.recordSeen('lesson','now');assert.deepEqual(a.read().seen,{});
 a.saveFocus({...focus({practicedAt:later,feedback:'clearer'})},first);assert.equal(a.read().focus.practicedAt,null);assert.equal(a.read().focus.feedback,null);
 assert.equal(a.markPracticed('lesson','2026-09-13'),false);assert.equal(a.markPracticed('lesson',true),false);assert.equal(a.markPracticed('lesson','2026-09-14T24:00:00Z'),false);
});

test('returned snapshots are independent and browser module needs no structuredClone',()=>{
 const a=state.createStore(storage());a.recordSeen('lesson',first);const result=a.saveFocus({lessonId:'lesson',region:'net'},first);
 result.focus.practicedAt=later;result.focus.feedback='clearer';result.seen.lesson=last;
 assert.equal(a.read().focus.practicedAt,null);assert.equal(a.read().seen.lesson,first);
 const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(new URL('./gamesharp-sharpen-state.js',import.meta.url),'utf8'),context);
 const browser=context.window.GameSharpSharpenState;assert.equal(browser.key,state.key);assert.ok(Object.isFrozen(browser));
 const local=browser.createStore(null);local.saveFocus({lessonId:'lesson',region:'net'},first);assert.equal(local.read().focus.lessonId,'lesson');assert.equal(local.persistent(),false);
});
