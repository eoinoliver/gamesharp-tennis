import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const source=fs.readFileSync(new URL('../gamesharp-pain-coach.js',import.meta.url),'utf8');
const registrySource=fs.readFileSync(new URL('../gamesharp-court-checks.js',import.meta.url),'utf8');
const gold=require('../gold-daily-prototypes.js');
const spines=require('../gold-daily-lesson-spines.js');
const check=require('../gamesharp-forehand-check.js');
const checkState=require('../gamesharp-forehand-check-state.js');
const checks=require('../gamesharp-court-checks.js');
const sharedState=require('../gamesharp-court-check-state.js');
const sharpenState=require('../gamesharp-sharpen-state.js');
const paths=require('../gamesharp-sharpen-paths.js');
const clone=value=>JSON.parse(JSON.stringify(value));
const contact=gold.challenges.find(item=>item.id===check.definition.lessonId);
const initial={stage:'focus',playerRegion:'forehand',playerIssue:'forehand_crowded_contact',lessonId:contact.id,checkId:check.definition.id,source:'sharpen',contextualEntry:false};

// Like the player-contract VM harness, this executes the real module handlers.
// The retained renderer writes its actual HTML and binds its real listeners.
// Shell layout/focus and native select/FormData plumbing are deliberately small
// stubs: these checks do not claim browser rendering or native-input coverage.
function runtime({hostname='127.0.0.1',search='',omit=[],changeSpine,changeRelease,initialState=initial}={}){
  const data=new Map([['gs_main_daily_history_v1','existing Daily credit'],['gs_gold_daily_checkpoint_v1','existing partial Daily']]);
  const writes=[],opened=[];
  const localStorage={getItem:key=>data.get(key)||null,setItem:(key,value)=>{writes.push(key);data.set(key,String(value));}};
  const spineCopy={spines:clone(spines.spines)};
  spineCopy.byId=Object.fromEntries(spineCopy.spines.map(item=>[item.id,item]));
  if(changeSpine)changeSpine(spineCopy.byId[gold.challenges.find(item=>item.id===initialState.lessonId).lessonSpineId]);
  let html='',nodes=new Map();
  function selectorPresent(selector){
    if(selector==='form')return /<form\b/.test(html);
    if(selector.startsWith('['))return html.includes(selector.slice(1,-1));
    if(selector.startsWith('#'))return html.includes('id="'+selector.slice(1)+'"');
    if(selector.startsWith('.'))return new RegExp('class="[^"]*\\b'+selector.slice(1)+'\\b').test(html);
    return false;
  }
  function node(selector,dataset={}){
    if(nodes.has(selector))return nodes.get(selector);
    const listeners={};
    const item={dataset,listeners,textContent:'',values:{},focus(){},
      addEventListener(name,fn){(listeners[name]??=[]).push(fn);},
      querySelector:selector=>stage.querySelector(selector),
      reportValidity(){return [...html.matchAll(/<select name="([^"]+)" required/g)].map(match=>match[1]).every(key=>typeof this.values[key]==='string'&&this.values[key]!=='');},
      dispatch(name){const event={preventDefault(){},target:item};for(const listener of listeners[name]||[])listener(event);if(name==='click'&&item.onclick)item.onclick(event);}
    };
    nodes.set(selector,item);return item;
  }
  const stage={
    get innerHTML(){return html;},set innerHTML(value){html=value;nodes=new Map();},
    querySelector(selector){return selectorPresent(selector)?node(selector):null;},
    querySelectorAll(selector){
      if(selector==='[data-check-match]')return [...html.matchAll(/data-check-match="([^"]+)"/g)].map(match=>node('[data-check-match="'+match[1]+'"]',{checkMatch:match[1]}));
      if(selector==='[data-path]')return [...html.matchAll(/data-path="([^"]+)"/g)].map(match=>node('[data-path="'+match[1]+'"]',{path:match[1]}));
      return [];
    }
  };
  const scroll={scrollTop:0},live={textContent:''};
  const overlay={querySelector:selector=>selector==='.gspc-scroll'?scroll:selector==='.gspc-sr'?live:null};
  const context={Date,URLSearchParams,location:{hostname,search},localStorage,
    GameSharpGoldLessonSpines:spineCopy,GameSharpSharpenPaths:paths,GameSharpSharpenState:sharpenState,
    GameSharpForehandCheck:check,GameSharpForehandCheckState:checkState,GameSharpCourtChecks:checks,GameSharpCourtCheckState:sharedState,GS_GOLD_DAILY_CSS_READY:true,
    GameSharpGoldDaily:{challenges:gold.challenges,returnEvidence:gold.returnEvidence,isAvailable:id=>gold.challenges.some(item=>item.id===id&&!item.reviewOnly),openPractice:(id,options)=>{opened.push({id,options});return true;},preview:()=>''},
    document:{readyState:'loading',addEventListener(){}},__stage:stage,__overlay:overlay,
    FormData:class{constructor(form){this.form=form;}[Symbol.iterator](){return Object.entries(this.form.values)[Symbol.iterator]();}}
  };
  context.window=context;
  for(const key of omit)delete context[key];
  // Load the actual browser registry after dependency failures, so its captured
  // Forehand adapter matches an aborted browser script rather than Node's cache.
  if(!omit.includes('GameSharpCourtChecks'))vm.runInNewContext(registrySource,context);
  if(changeRelease&&context.GameSharpCourtChecks){
    const registry={...context.GameSharpCourtChecks,release:clone(context.GameSharpCourtChecks.release)};
    changeRelease(registry);context.GameSharpCourtChecks=registry;
  }
  const expose=`stageEl=root.__stage;progressEl={textContent:''};overlay=root.__overlay;
    close=()=>{};show=()=>render();
    root.__courtCheckTest={render,renderFocus,renderCheck,renderRegion,checkDefinition,launchPath,back,
      getState:()=>({...state}),setState:value=>{state={...value};}};`;
  assert.ok(source.includes("if(document.readyState==='loading')"),'runtime injection anchor must remain explicit');
  vm.runInNewContext(source.replace("if(document.readyState==='loading')",expose+"\nif(document.readyState==='loading')"),context);
  const api=context.__courtCheckTest;
  api.setState(initialState);
  return {api,context,data,writes,opened,stage,
    click(selector){const target=stage.querySelector(selector);assert.ok(target,'Expected real rendered control '+selector);target.dispatch('click');},
    chooseMatch(value){const target=stage.querySelectorAll('[data-check-match]').find(item=>item.dataset.checkMatch===value);assert.ok(target);target.dispatch('click');},
    experiment:()=>checkState.createStore(localStorage).read().experiment,
    courtExperiment:id=>JSON.parse(data.get(sharedState.key)||'null')?.experiments?.[id]||null,
    focus:()=>sharpenState.createStore(localStorage).read().focus,
    html:()=>stage.innerHTML
  };
}

export {runtime};
