import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const code=readFileSync(new URL('./sfx.js',import.meta.url),'utf8');
function fixture({stored,blocked=false,unsupported=false}={}){
 const events={},sources=[],contexts=[],buttons=[];let reject=false;
 const param=()=>({value:0,setValueAtTime(v){this.value=v;},exponentialRampToValueAtTime(v){this.value=v;},cancelScheduledValues(){}});
 const node=()=>({gain:param(),frequency:param(),Q:param(),pan:param(),connect(){},disconnect(){this.disconnected=true;},start(){this.started=true;},stop(){this.stopped=true;},onended:null});
 class AC{
  constructor(){this.state='suspended';this.sampleRate=48000;this.currentTime=0;this.destination={};contexts.push(this);}
  resume(){if(reject)return Promise.reject(Error('blocked'));this.state='running';this.onstatechange?.();return Promise.resolve();}
  createGain(){const n=node();this.master??=n;return n;}
  createBuffer(c,n){return{getChannelData:()=>new Float32Array(n)};}
  createBufferSource(){const n=node();sources.push(n);return n;}
  createOscillator(){const n=node();sources.push(n);return n;}
  createBiquadFilter(){return node();}createStereoPanner(){return node();}
 }
 const document={hidden:false,querySelectorAll:()=>buttons,addEventListener:(n,f)=>events[n]=f};
 const window={AudioContext:unsupported?undefined:AC,addEventListener:(n,f)=>events[n]=f};
 vm.runInNewContext(code,{window,document,localStorage:{getItem(){if(blocked)throw Error();return stored;},setItem(k,v){if(blocked)throw Error();stored=v;}},performance:{now:()=>0},Math,Promise});
 return{api:window.GSSfx,events,contexts,sources,document,buttons,reject:()=>reject=true,stored:()=>stored};
}
test('no autoplay/context at load; end of touch unlocks; one contact has sources',async()=>{
 const f=fixture();assert.equal(f.contexts.length,0);assert.equal(f.api.ready(),false);
 f.events.touchend({target:{}});await Promise.resolve();assert.equal(f.api.ready(),true);
 f.api.hit(.7);assert.equal(f.sources.length,3);
 f.api.hit(.7);assert.equal(f.sources.length,3,'duplicate contact is suppressed');
});
test('mute cancels already scheduled applause and holds master at zero',async()=>{
 const f=fixture();await f.api.unlock();f.api.applause();assert.equal(f.sources.length,36);
 await f.api.set(false);assert.ok(f.sources.every(s=>s.stopped&&s.disconnected));
 assert.equal(f.contexts[0].master.gain.value,0);f.api.hit();assert.equal(f.sources.length,36);
 assert.equal(f.stored(),'0');
});
test('interrupted and closed contexts recover on a fresh gesture',async()=>{
 const f=fixture();await f.api.unlock();const c=f.contexts[0];c.state='interrupted';c.onstatechange();
 assert.equal(f.api.ready(),false);await f.api.unlock();assert.equal(f.api.ready(),true);
 c.state='closed';await f.api.unlock();assert.equal(f.contexts.length,2);assert.equal(f.api.ready(),true);
});
test('background cancels audio; visible resume never replays scheduled voices',async()=>{
 const f=fixture();await f.api.unlock();f.api.applause();f.document.hidden=true;f.events.visibilitychange();
 assert.ok(f.sources.every(s=>s.stopped));assert.equal(f.api.ready(),false);
 f.api.hit();assert.equal(f.sources.length,36);f.document.hidden=false;f.events.visibilitychange();await Promise.resolve();
 assert.equal(f.sources.length,36);assert.equal(f.api.ready(),true);
 f.events.pagehide();assert.equal(f.contexts[0].master.gain.value,0);
});
test('mute works when storage is unavailable and stays muted on gestures',async()=>{
 const f=fixture({blocked:true});await f.api.unlock();await f.api.set(false);
 f.events.click({target:{}});await Promise.resolve();assert.equal(f.api.enabled(),false);
});
test('rejected resume is handled; unsupported browsers remain usable',async()=>{
 const f=fixture();f.reject();assert.equal(await f.api.unlock(),false);assert.equal(f.api.ready(),false);
 const no=fixture({unsupported:true});assert.equal(await no.api.unlock(),false);no.api.hit();no.api.stop();
});
test('pending button enables instead of accidentally muting; next tap mutes',async()=>{
 const f=fixture();const attrs={};const b={setAttribute(k,v){attrs[k]=v;},dataset:{}};f.buttons.push(b);f.api.wire();
 assert.equal(attrs['aria-label'],'Enable sound');b.onclick({stopPropagation(){}});await Promise.resolve();await Promise.resolve();
 assert.equal(attrs['aria-label'],'Mute sound');assert.equal(f.api.enabled(),true);
 b.onclick({stopPropagation(){}});await Promise.resolve();assert.equal(f.api.enabled(),false);
});
test('muted preference survives navigation and cross-tab mute stops active voices',async()=>{
 const f=fixture({stored:'0'});await f.api.unlock();assert.equal(f.contexts.length,0);
 await f.api.set(true);f.api.hit();f.events.storage({key:'gs_sound',newValue:'0'});
 assert.equal(f.api.enabled(),false);assert.ok(f.sources.every(s=>s.stopped));
});
