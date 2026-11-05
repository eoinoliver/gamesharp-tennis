import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const code=readFileSync(new URL('./coach.js',import.meta.url),'utf8');
function fixture({value=null,blocked=false,discardWrites=false}={}){
 const events={},select={value:''},status={textContent:''},writes=[];
 const window={GS_VERSION:'test version',addEventListener:(name,fn)=>events[name]=fn};
 const document={querySelectorAll:q=>q==='[data-gs-coach]'?[select]:q==='[data-gs-coach-status]'?[status]:[]};
 vm.runInNewContext(code,{window,document,localStorage:{getItem(){if(blocked)throw Error('denied');return value;},setItem(k,v){if(blocked)throw Error('denied');writes.push([k,v]);if(!discardWrites)value=v;}}});
 return {api:window.GSCoach,events,select,status,writes};
}
test('existing players keep Frank until they choose Lara; invalid saved values are safe',()=>{
 for(const value of [null,'unknown','__proto__']){
  const f=fixture({value});assert.equal(f.api.current(),'frank');assert.equal(f.api.asset('short-ball'),'voice-short-ball');assert.equal(f.writes.length,0);
 }
 const f=fixture({value:'lara'});assert.equal(f.api.name(),'Lara');assert.equal(f.api.url('reset-commit'),'audio/voice-lara-reset-commit.mp3?v=test%20version');
});
test('choice is stored, reflected in every selector and only changes the coach preference',()=>{
 const f=fixture(),seen=[];const off=f.api.onChange(v=>seen.push(v));
 assert.equal(f.api.set('lara'),true);assert.equal(f.select.value,'lara');assert.deepEqual(f.writes,[['gs_coach','lara']]);assert.deepEqual(seen,['lara']);
 f.api.set('lara');assert.equal(seen.length,1);off();f.api.set('frank');assert.equal(seen.length,1);
 assert.equal(f.api.set('unknown'),false);assert.equal(f.api.current(),'frank');
});
test('blocked or silently discarded persistence still permits a truthful page-only choice',()=>{
 for(const options of [{blocked:true},{discardWrites:true}]){
  const f=fixture(options);assert.equal(f.api.set('lara'),false);assert.equal(f.api.current(),'lara');assert.match(f.status.textContent,/For this page only/);
 }
});
test('cross-tab changes, removal and storage clear update the active selection',()=>{
 const f=fixture({value:'lara'}),seen=[];f.api.onChange(v=>seen.push(v));
 f.events.storage({key:'gs_sound',newValue:'0'});assert.equal(f.api.current(),'lara');
 f.events.storage({key:'gs_coach',newValue:'frank'});assert.equal(f.select.value,'frank');
 f.events.storage({key:'gs_coach',newValue:'lara'});f.events.storage({key:null,newValue:null});
 assert.equal(f.api.current(),'frank');assert.deepEqual(seen,['frank','lara','frank']);
});
