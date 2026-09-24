import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';

const file=new URL('./gold-daily-prototypes.js',import.meta.url),source=fs.readFileSync(file,'utf8'),require=createRequire(file);
function setup(){
  const data=new Map(),calls={writes:0,audio:0,timers:0,frames:0,contact:0,credit:0,home:0,events:[]},listeners={},registrations=[];
  const localStorage={getItem:key=>data.get(key)||null,setItem:(key,value)=>{calls.writes++;data.set(key,String(value));}};
  const shell={innerHTML:''},live={textContent:''},visual={classList:{contains:()=>false,add(){}},querySelectorAll:()=>[]};
  const overlay={hidden:true,isConnected:true,scrollTop:0,attributes:{},setAttribute(k,v){this.attributes[k]=v;},querySelector:s=>s==='.gs-gold-daily-shell'?shell:s==='.gs-gold-daily-sr'?live:s==='.gs-gold-daily-visual'?visual:null};
  const context={module:{exports:{}},require,Date,localStorage,performance:{now:()=>1000},location:{hostname:'127.0.0.1',search:''},matchMedia:()=>({matches:false}),GS_GOLD_DAILY_MAIN:true,GS_GOLD_DAILY_CSS_READY:true,
    document:{readyState:'loading',activeElement:null,body:{children:[],style:{overflow:''},dataset:{}},addEventListener:(name,fn,capture)=>{(listeners[name]??=[]).push(fn);registrations.push({name,fn,capture});},getElementById:()=>({classList:{contains:()=>true}})},
    setTimeout:()=>{calls.timers++;},requestAnimationFrame:()=>{calls.frames++;},queueMicrotask:fn=>fn(),
    faspScene:()=>{calls.contact++;},faspStart:()=>{calls.contact++;},faspRender:()=>{calls.contact++;},
    GSLivePointEngine:{createAudioEngine:()=>{calls.audio++;return{stop(){},isEnabled:()=>false,isReady:()=>false};}},
    GameSharpMainDaily:{complete:()=>{calls.credit++;},completed:()=>false,persistent:()=>true,refreshHome:()=>{calls.home++;}},isDailyDone:()=>false,
    trackEvent:(name,value)=>calls.events.push({name,value}),initHome(){calls.home++;},goHome(){calls.home++;}
  };
  vm.runInNewContext(source.replace('    version: VERSION,','    state, answer, next, onClick, renderSelector, dailySharpen, installDailyReturns,\n    version: VERSION,'),context);
  const api=context.module.exports;api.state.overlay=overlay;
  return {api,context,calls,data,localStorage,overlay,shell,live,listeners,registrations};
}
const id='gold_short_ball_attack_v1';
function click(api,action){api.onClick({target:{closest:()=>({dataset:{gdAction:action}})}});}

test('practice rejects unavailable IDs/resources before mutating the caller or Daily',()=>{
  for(const failure of ['unknown','slug','callback','styles','audio']){
    const {api,context,overlay,calls}=setup();api.state.daily=true;api.state.dailyOrigin='sharpen';
    if(failure==='styles')context.GS_GOLD_DAILY_CSS_READY=false;
    if(failure==='audio')context.GSLivePointEngine=null;
    const target=failure==='unknown'?'not-an-approved-lesson':failure==='slug'?'short-ball':id;
    assert.equal(api.openPractice(target,failure==='callback'?{}:{onReturn(){}}),false,failure);
    assert.equal(overlay.hidden,true);assert.equal(api.state.daily,true);assert.equal(api.state.dailyOrigin,'sharpen');
    assert.equal(calls.audio+calls.writes+calls.credit+calls.frames+calls.timers,0);
  }
});

test('unfinished practice navigation never advertises the completed court payoff',()=>{
  const {api,shell}=setup();api.openPractice(id,{returnLabel:'Take this to court →',onReturn(){}});
  assert.equal((shell.innerHTML.match(/aria-label="Back to Sharpen"/g)||[]).length,2);
  assert.doesNotMatch(shell.innerHTML,/aria-label="Take this to court|data-gd-action="list">Take this to court/);
  const lesson=api.challenges.find(c=>c.id===id);
  lesson.steps.forEach(step=>{api.answer(step.correct);api.next();});
  assert.match(shell.innerHTML,/data-gd-action="list">Take this to court →/);
});

test('every practice exit returns once to the caller and restores the suspended Daily origin',()=>{
  for(const exit of ['close','button','back','escape','home','selector']){
    const {api,context,overlay,listeners}=setup(),returned=[];
    api.state.daily=true;api.state.dailyDate='2026-09-13';api.state.dailyAnswers=[2];api.state.dailyOrigin='sharpen';
    assert.equal(api.openPractice(id,{returnLabel:'Back to my exact focus',onReturn:value=>{assert.equal(overlay.hidden,true);assert.equal(api.state.dailyOrigin,null);returned.push(value);}}),true);
    assert.equal(api.state.daily,false);assert.equal(api.state.dailyOrigin,null);assert.equal(api.openDaily(),false);
    assert.equal(api.start(api.challenges.findIndex(c=>c.id!==id)),false,'No unrelated library jump inside this detour');
    if(exit==='close')api.close();
    if(exit==='button')click(api,'close');
    if(exit==='back')click(api,'list');
    if(exit==='escape')listeners.keydown.forEach(fn=>fn({key:'Escape'}));
    if(exit==='home')context.goHome();
    if(exit==='selector')api.renderSelector();
    api.close();
    assert.equal(returned.length,1,exit);assert.equal(returned[0].lessonId,id);assert.equal(returned[0].completed,false);
    assert.equal(api.state.daily,true);assert.equal(api.state.dailyDate,'2026-09-13');assert.equal(JSON.stringify(api.state.dailyAnswers),'[2]');assert.equal(api.state.dailyOrigin,'sharpen');
  }
});

test('three finished practice decisions return completion without score, Daily writes or credit',()=>{
  const {api,localStorage,data,calls,shell}=setup(),loop=require('./gold-daily-loop.js'),returned=[];
  const date='2026-09-13',scheduled=loop.lessonFor(date);
  loop.createStore(localStorage).save(date,{lessonId:scheduled,answers:[2],step:0,complete:false});
  data.set('gs_main_daily_history_v1','{"days":{}}');data.set('gamesharp_challenges_done','17');data.set('gamesharp_streak','6');
  const before=JSON.stringify([...data]);calls.writes=0;
  api.state.daily=true;api.state.dailyDate=date;api.state.dailyAnswers=[2];
  assert.equal(api.openPractice(scheduled,{onReturn:value=>returned.push(value)}),true);
  const lesson=api.challenges.find(c=>c.id===scheduled);
  lesson.steps.forEach((step,i)=>{api.answer(step.correct);assert.equal(api.state.practice.completed,false);api.next();if(i<2)assert.equal(api.state.practice.completed,false);});
  assert.match(shell.innerHTML,/Three decisions explored · unscored practice/);assert.doesNotMatch(shell.innerHTML,/\d\/3 calls|daily-sharpen|daily-practice/);
  assert.match(shell.innerHTML,/Take this to court →/);assert.match(shell.innerHTML,/Pro Insight/);assert.match(shell.innerHTML,/Source · /);
  assert.equal(api.state.score,0);assert.equal(calls.credit,0);assert.equal(calls.writes,0);assert.equal(JSON.stringify([...data]),before);
  click(api,'list');assert.equal(returned.length,1);assert.equal(returned[0].completed,true);
  assert.equal(JSON.stringify([...data]),before);assert.equal(JSON.stringify(api.state.dailyAnswers),'[2]');
});

test('completion waits for finished transfer and a later replay does not erase that fact',()=>{
  for(const restart of [false,true]){
    const {api}=setup(),returned=[];api.openPractice(id,{onReturn:value=>returned.push(value)});
    const lesson=api.challenges.find(c=>c.id===id);
    lesson.steps.forEach((step,i)=>{api.answer(step.correct);if(i<2||restart)api.next();});
    if(restart)click(api,'restart');
    api.close();assert.equal(returned[0].completed,restart);
  }
});

test('previews are decorative, unanswered, static and side-effect-free; Contact is withheld',()=>{
  const {api,calls,data}=setup();api.state.daily=true;api.state.selectedIndex=2;api.state.dailyOrigin='sharpen';
  const before=JSON.stringify(api.state),counts=JSON.stringify(calls),storage=JSON.stringify([...data]);
  for(const lesson of api.challenges){
    assert.equal(api.isAvailable(lesson.id),true);
    const html=api.preview(lesson.id);
    if(lesson.steps[0].visual.kind==='contact'){assert.equal(html,'');continue;}
    assert.match(html,/<svg aria-hidden="true" focusable="false"/);
    assert.doesNotMatch(html,/<(?:animate|set|text|button|script)|\s(?:id|class|style|aria-label)=|url\(#|data-gd-action|NaN|undefined/);
    assert.ok(!html.includes(lesson.steps[0].payoff));assert.ok(!html.includes(lesson.steps[0].unlock));
  }
  assert.equal(api.preview('not-approved'),'');assert.equal(api.preview('contact'),'');
  assert.equal(JSON.stringify(api.state),before);assert.equal(JSON.stringify(calls),counts);assert.equal(JSON.stringify([...data]),storage);
});

test('Daily hands off the exact lesson cue, not a broad or substitute region',()=>{
  const {api,context}=setup(),opened=[];
  context.GameSharpPainCoach={playerRegions:{forehand:{},decisions:{},movement:{}},openLessonFocus:(...args)=>opened.push(args)};
  const target=api.challenges.find(c=>c.id===id),spines=require('./gold-daily-lesson-spines.js');
  context.GameSharpPainCoach.playerRegions[spines.byId[target.lessonSpineId].sharpenTarget]={};
  assert.equal(api.dailySharpen(id),true);assert.equal(opened.length,1);assert.equal(opened[0][0],id);assert.equal(opened[0][1],'gold-daily');
  assert.equal(api.state.dailyOrigin,'sharpen');
});

test('persistent mobile/sidebar tabs release a Daily→Sharpen detour before navigation handlers run',()=>{
  for(const surface of ['#gsBottomNav .gs-bnav-item','.gs-sidebar .gs-nav-item'])for(const route of ['direct-home','explore-then-home','fresh-sharpen-then-home']){
    const {api,context,calls,data,overlay,listeners,registrations}=setup();
    data.set('gs_main_daily_history_v1','existing completed Daily');data.set('gamesharp_challenges_done','17');
    const before=JSON.stringify([...data]);
    api.installDailyReturns();api.state.dailyOrigin='sharpen';
    assert.ok(registrations.some(r=>r.name==='click'&&r.capture===true),'persistent navigation release must be registered in capture phase');
    const event={type:'click',target:{closest:selector=>selector.split(',').map(s=>s.trim()).includes(surface)?{surface}:null}};
    listeners.click.forEach(fn=>fn(event));
    assert.equal(api.state.dailyOrigin,null,`${surface} ${route}: capture must release the origin before target navigation`);
    if(route!=='direct-home'){
      // Explore/fresh Sharpen has finished its own handler. A later Home tap
      // must not resurrect the abandoned Daily return hook.
      listeners.click.forEach(fn=>fn(event));
    }
    const homeCalls=calls.home;context.initHome();
    assert.equal(calls.home,homeCalls+1,'the original Home handler must run');assert.equal(overlay.hidden,true,'an explicit tab exit must not reopen the Daily overlay');
    assert.equal(calls.credit,0);assert.equal(JSON.stringify([...data]),before);
  }
});

test('native Sharpen Back, Close and Escape wait past capture microtasks for the target close handler',()=>{
  for(const control of ['.gspc-back','.gspc-close','Escape']){
    const {api,context,overlay,listeners}=setup(),microtasks=[],tasks=[];let sharpenOpen=true;
    context.queueMicrotask=fn=>microtasks.push(fn);
    context.setTimeout=(fn,delay)=>{assert.equal(delay,0,'return must wait one task, without an arbitrary delay');tasks.push(fn);};
    context.document.getElementById=()=>({classList:{contains:()=>sharpenOpen}});
    context.GameSharpMainDaily.completed=()=>true;
    api.installDailyReturns();api.state.dailyOrigin='sharpen';
    const event={type:control==='Escape'?'keydown':'click',key:control==='Escape'?'Escape':undefined,target:{closest:selector=>selector.includes('#gspcOverlay '+control)?{}:null}};
    listeners[event.type].forEach(fn=>fn(event));
    assert.equal(api.state.dailyOrigin,'sharpen','cue return must not be mistaken for a persistent navigation tab');
    // Real native dispatch can flush microtasks here, before the target runs.
    // DOM.click-only checkers used to miss this lost-return failure.
    microtasks.splice(0).forEach(fn=>fn());
    assert.equal(overlay.hidden,true);assert.equal(sharpenOpen,true);assert.equal(tasks.length,1,'capture must schedule a post-event task, not a microtask');
    sharpenOpen=false;tasks.splice(0).forEach(fn=>fn());
    assert.equal(overlay.hidden,false,`${control}: closed cue must return to Daily`);assert.equal(api.state.daily,true);assert.equal(api.state.dailyOrigin,null);
  }
});

test('a queued Sharpen return is cancelled when an explicit persistent tab wins before the task runs',()=>{
  const {api,context,overlay,listeners}=setup(),tasks=[];
  context.setTimeout=fn=>tasks.push(fn);
  context.document.getElementById=()=>({classList:{contains:()=>false}});
  api.installDailyReturns();api.state.dailyOrigin='sharpen';
  listeners.click.forEach(fn=>fn({type:'click',target:{closest:s=>s.includes('#gspcOverlay .gspc-close')?{}:null}}));
  assert.equal(tasks.length,1);
  listeners.click.forEach(fn=>fn({type:'click',target:{closest:s=>s.includes('#gsBottomNav .gs-bnav-item')?{}:null}}));
  assert.equal(api.state.dailyOrigin,null);
  tasks.splice(0).forEach(fn=>fn());
  assert.equal(overlay.hidden,true,'the deferred cue return must not resurrect Daily after a top-level tab exit');
});
