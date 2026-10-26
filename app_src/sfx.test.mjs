import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const code=readFileSync(new URL('./sfx.js',import.meta.url),'utf8');
function fixture({stored="1",blocked=false,unsupported=false,audioSession}={}){
 const events={},sources=[],contexts=[],buttons=[];let reject=false,failFetch=false,hold=null;const requests=[];
 const param=()=>({value:0,setValueAtTime(v){this.value=v;},exponentialRampToValueAtTime(v){this.value=v;},cancelScheduledValues(){}});
 const node=()=>({gain:param(),frequency:param(),Q:param(),pan:param(),connect(){},disconnect(){this.disconnected=true;},start(){this.started=true;},stop(){this.stopped=true;},onended:null});
 class AC{
  constructor(){this.sessionAtBoot=audioSession?.type;this.state='suspended';this.sampleRate=48000;this.currentTime=0;this.destination={};contexts.push(this);}
  resume(){if(reject)return Promise.reject(Error('blocked'));this.state='running';this.onstatechange?.();return Promise.resolve();}
  createGain(){const n=node();this.master??=n;return n;}
  decodeAudioData(){return Promise.resolve({length:4410,duration:.1});}
  createBuffer(c,n){return{getChannelData:()=>new Float32Array(n)};}
  createBufferSource(){const n=node();sources.push(n);return n;}
  createOscillator(){const n=node();sources.push(n);return n;}
  createBiquadFilter(){return node();}createStereoPanner(){return node();}
 }
 const document={hidden:false,querySelectorAll:()=>buttons,addEventListener:(n,f)=>events[n]=f};
 const window={navigator:{audioSession},AudioContext:unsupported?undefined:AC,addEventListener:(n,f)=>events[n]=f};
 vm.runInNewContext(code,{window,document,localStorage:{getItem(){if(blocked)throw Error();return stored;},setItem(k,v){if(blocked)throw Error();stored=v;}},fetch:async url=>{requests.push(url);if(hold)await hold;if(failFetch)throw Error('network');return{ok:true,arrayBuffer:async()=>new ArrayBuffer(8)};},AbortController,setTimeout,clearTimeout,performance:{now:()=>0},Math,Promise});
 return{api:window.GSSfx,requests,failFetch:()=>failFetch=true,recoverFetch:()=>failFetch=false,holdFetch:p=>hold=p,events,contexts,sources,document,buttons,reject:()=>reject=true,stored:()=>stored};
}
test('no autoplay/context at load; end of touch unlocks; one contact has sources',async()=>{
 const f=fixture();assert.equal(f.contexts.length,0);assert.equal(f.api.ready(),false);
 f.events.touchend({target:{}});await f.api.unlock();assert.equal(f.api.ready(),true);
 f.api.hit(.7);assert.equal(f.sources.length,1);
 f.api.hit(.7);assert.equal(f.sources.length,1,'duplicate contact is suppressed');
});
test('mute cancels already scheduled applause and holds master at zero',async()=>{
 const f=fixture();await f.api.unlock();f.api.applause();assert.equal(f.sources.length,1);
 await f.api.set(false);assert.ok(f.sources.every(s=>s.stopped&&s.disconnected));
 assert.equal(f.contexts[0].master.gain.value,0);f.api.hit();assert.equal(f.sources.length,1);
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
 f.api.hit();assert.equal(f.sources.length,1);f.document.hidden=false;f.events.visibilitychange();await Promise.resolve();
 assert.equal(f.sources.length,1);assert.equal(f.api.ready(),true);
 f.events.pagehide();assert.equal(f.contexts[0].master.gain.value,0);
});
test('mute works when storage is unavailable and stays muted on gestures',async()=>{
 const f=fixture({blocked:true});await f.api.set(true);await f.api.set(false);
 f.events.click({target:{}});await Promise.resolve();assert.equal(f.api.enabled(),false);
});
test('rejected resume is handled; unsupported browsers remain usable',async()=>{
 const f=fixture();f.reject();assert.equal(await f.api.unlock(),false);assert.equal(f.api.ready(),false);
 const no=fixture({unsupported:true});assert.equal(await no.api.unlock(),false);no.api.hit();no.api.stop();
});
test('pending button enables instead of accidentally muting; next tap mutes',async()=>{
 const f=fixture();const attrs={};const b={setAttribute(k,v){attrs[k]=v;},dataset:{}};f.buttons.push(b);f.api.wire();
 assert.equal(attrs['aria-label'],'Enable sound');b.onclick({stopPropagation(){}});await f.api.unlock();await Promise.resolve();
 assert.equal(attrs['aria-label'],'Mute sound');assert.equal(f.api.enabled(),true);
 b.onclick({stopPropagation(){}});await Promise.resolve();assert.equal(f.api.enabled(),false);
});
test('muted preference survives navigation and cross-tab mute stops active voices',async()=>{
 const f=fixture({stored:'0'});await f.api.unlock();assert.equal(f.contexts.length,0);
 await f.api.set(true);f.api.hit();f.events.storage({key:'gs_sound',newValue:'0'});
 assert.equal(f.api.enabled(),false);assert.ok(f.sources.every(s=>s.stopped));
});

test('first visit stays silent on ordinary interactions until explicit enable',async()=>{
 const audioSession={type:'auto'},f=fixture({stored:null,audioSession});
 for(const event of ['pointerdown','touchend','click','keydown'])f.events[event]({target:{}});
 await Promise.resolve();assert.equal(f.contexts.length,0);assert.equal(audioSession.type,'auto');
 assert.equal(f.api.enabled(),false);await f.api.set(true);
 assert.equal(f.contexts[0].sessionAtBoot,'playback','route selected before context creation');
 assert.equal(f.stored(),'1');assert.equal(f.api.ready(),true);
});
test('explicit sound owns playback only while enabled and visible',async()=>{
 const audioSession={type:'ambient'},f=fixture({audioSession});
 assert.equal(audioSession.type,'ambient','loading does not take device audio');
 await f.api.unlock();assert.equal(audioSession.type,'playback');
 f.document.hidden=true;f.events.visibilitychange();assert.equal(audioSession.type,'ambient');
 f.document.hidden=false;f.events.visibilitychange();await Promise.resolve();assert.equal(audioSession.type,'playback');
 await f.api.set(false);assert.equal(audioSession.type,'ambient');
 await f.api.set(true);f.events.pagehide();assert.equal(audioSession.type,'ambient');
 f.events.pageshow();await Promise.resolve();assert.equal(audioSession.type,'playback');
 f.events.storage({key:'gs_sound',newValue:'0'});assert.equal(audioSession.type,'ambient');
});
test('blocked resume releases playback and a throwing session API remains usable',async()=>{
 const audioSession={type:'auto'},f=fixture({audioSession});f.reject();
 assert.equal(await f.api.unlock(),false);assert.equal(audioSession.type,'auto');
 const denied={get type(){return 'auto';},set type(v){throw Error('unsupported');}};
 const fallback=fixture({audioSession:denied});assert.equal(await fallback.api.unlock(),true);fallback.api.hit();
 assert.equal(fallback.sources.length,1);
});
test('mute does not overwrite a session changed by another owner',async()=>{
 const audioSession={type:'auto'},f=fixture({audioSession});await f.api.unlock();
 audioSession.type='transient';await f.api.set(false);assert.equal(audioSession.type,'transient');
});

test('recordings load once only after opt-in, alternate contacts, and never synthesize',async()=>{
 const f=fixture({stored:null});assert.equal(f.requests.length,0);await f.api.set(true);
 assert.equal(f.requests.length,4);assert.ok(f.requests.every(u=>/^audio\/.+\.wav\?v=/.test(u)));
 f.api.hit();const first=f.sources[0].buffer;f.contexts[0].currentTime=1;f.api.hit();
 assert.notEqual(f.sources[1].buffer,first);assert.ok(f.sources.every(s=>s.buffer));
 await f.api.unlock();assert.equal(f.requests.length,4);f.api.net();assert.equal(f.sources.length,2);
});
test('cold-load contacts are dropped, loading can be muted, completion never plays late',async()=>{
 const f=fixture();let release;f.holdFetch(new Promise(r=>release=r));
 const pending=f.api.unlock();assert.equal(f.api.ready(),false);f.api.hit();assert.equal(f.sources.length,0);
 const attrs={},b={setAttribute(k,v){attrs[k]=v;},dataset:{}};f.buttons.push(b);f.api.wire();
 assert.equal(b.dataset.soundState,'loading');b.onclick({stopPropagation(){}});
 release();await pending;assert.equal(f.api.enabled(),false);assert.equal(f.api.ready(),false);
 assert.equal(f.sources.length,0);assert.equal(f.contexts[0].master.gain.value,0);
});
test('failed download stays silent, exposes retry and can recover',async()=>{
 const f=fixture();f.failFetch();assert.equal(await f.api.unlock(),false);assert.equal(f.api.ready(),false);
 const attrs={},b={setAttribute(k,v){attrs[k]=v;},dataset:{}};f.buttons.push(b);f.api.wire();
 assert.equal(attrs['aria-label'],'Retry sound');f.api.hit();assert.equal(f.sources.length,0);
 f.recoverFetch();assert.equal(await f.api.unlock(),true);f.api.hit();assert.equal(f.sources.length,1);
});
