import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const code=readFileSync(new URL('./sfx.js',import.meta.url),'utf8');
function fixture({stored="1",blocked=false,unsupported=false,audioSession,storage={},durations={}}={}){
 const events={},sources=[],contexts=[],buttons=[];let reject=false,failFetch=false,hold=null;const requests=[];
 const param=()=>({value:0,setValueAtTime(v){this.value=v;},exponentialRampToValueAtTime(v){this.value=v;},cancelScheduledValues(){}});
 const node=()=>({gain:param(),frequency:param(),Q:param(),pan:param(),connect(){},disconnect(){this.disconnected=true;},start(){this.started=true;},stop(){this.stopped=true;},onended:null});
 class AC{
  constructor(){this.sessionAtBoot=audioSession?.type;this.state='suspended';this.sampleRate=48000;this.currentTime=0;this.destination={};contexts.push(this);}
  resume(){if(reject)return Promise.reject(Error('blocked'));this.state='running';this.onstatechange?.();return Promise.resolve();}
  createGain(){const n=node();this.master??=n;return n;}
  decodeAudioData(url){return Promise.resolve({length:4410,duration:durations[url.split("?")[0]]??.1,url});}
  createBuffer(c,n){return{getChannelData:()=>new Float32Array(n)};}
  createBufferSource(){const n=node();sources.push(n);return n;}
  createOscillator(){const n=node();sources.push(n);return n;}
  createBiquadFilter(){return node();}createStereoPanner(){return node();}
 }
 const document={hidden:false,querySelectorAll:()=>buttons,addEventListener:(n,f)=>events[n]=f};
 const window={navigator:{audioSession},AudioContext:unsupported?undefined:AC,addEventListener:(n,f)=>events[n]=f};
 vm.runInNewContext(code,{window,document,localStorage:{getItem(k){if(blocked)throw Error();return k==="gs_sound"?stored:storage[k]??null;},setItem(k,v){if(blocked)throw Error();if(k==="gs_sound")stored=v;else storage[k]=v;}},fetch:async url=>{requests.push(url);if(hold)await hold;if(failFetch)throw Error('network');return{ok:true,arrayBuffer:async()=>url};},AbortController,setTimeout,clearTimeout,performance:{now:()=>0},Math,Promise});
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

test('first visit defaults sound and voice on but creates no context before a gesture',async()=>{
 const audioSession={type:'auto'},f=fixture({stored:null,audioSession});
 assert.equal(f.contexts.length,0);assert.equal(audioSession.type,'auto');
 assert.equal(f.api.enabled(),true);assert.equal(f.api.voiceState().enabled,true);
 f.events.touchend({target:{}});await f.api.unlock();
 assert.equal(f.api.ready(),true);assert.equal(f.contexts[0].sessionAtBoot,'playback');
 assert.equal(f.sources.length,0,'unlock itself is silent');
});
test('explicit voice opt-out remains off after the default changes',()=>{
 const f=fixture({stored:null,storage:{gs_voice:'0'}});assert.equal(f.api.voiceState().enabled,false);
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
 assert.equal(f.requests.length,6);assert.ok(f.requests.every(u=>/^audio\/.+\.(wav|mp3)\?v=/.test(u)));
 f.api.hit();const first=f.sources[0].buffer;f.contexts[0].currentTime=1;f.api.hit();
 assert.notEqual(f.sources[1].buffer,first);assert.ok(f.sources.every(s=>s.buffer));
 await f.api.unlock();assert.equal(f.requests.length,6);f.api.net();assert.equal(f.sources.length,2);
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

test('freezing court action cancels contact tails but preserves completion applause',async()=>{
 const f=fixture();await f.api.unlock();f.api.hit();f.api.bounce();f.api.applause();
 assert.equal(f.sources.length,3);f.api.stopContacts();
 assert.ok(f.sources[0].stopped&&f.sources[1].stopped);
 assert.ok(!f.sources[2].stopped,'the end reward is independent of ball movement');
 f.api.stop();assert.ok(f.sources[2].stopped,'mute/navigation still stops everything');
});
test('sound activation and reactivation never invent a ball contact',async()=>{
 const f=fixture({stored:null}),b={setAttribute(){},dataset:{}};f.buttons.push(b);f.api.wire();
 b.onclick({stopPropagation(){}});await f.api.unlock();assert.equal(f.sources.length,0);
 await f.api.set(false);b.onclick({stopPropagation(){}});await f.api.unlock();
 assert.equal(f.sources.length,0);f.api.hit();assert.equal(f.sources.length,1);
});

// Rewards must feel complete without regressing gesture, mute or contact timing.
test('natural rewards over one second decode, while excessive reward/contact duration is rejected',async()=>{
 const good=fixture({durations:{'audio/applause-1.mp3':4.5,'audio/applause-2.mp3':4.5,'audio/applause-3.mp3':3.8}});
 assert.equal(await good.api.unlock(),true);good.api.applause();assert.equal(good.sources[0].buffer.duration,4.5);
 for(const durations of [{'audio/applause-1.mp3':6.1},{'audio/contact-1.wav':1.1}]){
  const f=fixture({durations});assert.equal(await f.api.unlock(),false);f.api.applause();assert.equal(f.sources.length,0);
 }
});
test('rewards rotate across navigation, cannot overlap, and muted calls do not consume a variation',async()=>{
 const storage={},f=fixture({storage});await f.api.unlock();
 f.api.applause();const first=f.sources[0];assert.match(first.buffer.url,/applause-1/);
 f.contexts[0].currentTime=10;f.api.applause();assert.equal(f.sources.length,1,'active reward cannot overlap');
 first.onended();f.api.applause();assert.match(f.sources[1].buffer.url,/applause-2/);
 await f.api.set(false);f.api.applause();assert.equal(storage.gs_reward_last,'applause-2');
 const next=fixture({storage});await next.api.unlock();next.api.applause();assert.match(next.sources[0].buffer.url,/applause-3/);
 next.sources[0].onended();next.contexts[0].currentTime=7;next.api.applause();assert.match(next.sources[1].buffer.url,/applause-1/);
});
test('blocked storage and malformed stored selection retain a valid rotation',async()=>{
 for(const opts of [{blocked:true},{storage:{gs_reward_last:'not-a-recording'}}]){
  const f=fixture(opts);await f.api.set(true);f.api.applause();const first=f.sources[0];
  first.onended();f.contexts[0].currentTime=7;f.api.applause();assert.notEqual(first.buffer.url,f.sources[1].buffer.url);
 }
});

test('saved voice opt-out permits a one-off listen without enabling automatic voice',async()=>{
 const f=fixture({storage:{gs_voice:'0'}});f.api.configureVoice('short-ball');await f.api.unlock();
 assert.equal(f.requests.length,6);assert.equal(f.api.completeVoice(),false);
 assert.equal(f.api.voiceInfo().text,'Check the height. Choose the shot.');
 assert.equal(await f.api.hearVoice(),true);assert.equal(f.requests.length,7);
 assert.match(f.sources.at(-1).buffer.url,/voice-short-ball/);
 assert.equal(f.api.voiceState().enabled,false,'a one-off listen does not opt into automatic voice');
});
test('manual court cue replaces applause and a second tap stops speech',async()=>{
 const f=fixture();f.api.configureVoice('recovery');await f.api.unlock();f.api.applause();const reward=f.sources[0];
 await f.api.hearVoice();assert.ok(reward.stopped);assert.equal(f.api.voiceState().playing,true);
 f.api.applause();assert.equal(f.sources.length,2);
 await f.api.hearVoice();assert.equal(f.api.voiceState().playing,false);
});
test('pending court cue cannot play after mute, navigation, or background',async()=>{
 for(const cancel of [f=>f.api.set(false),f=>f.api.stop(),f=>{f.document.hidden=true;f.events.visibilitychange();}]){
  const f=fixture({storage:{gs_voice:'0'}});f.api.configureVoice('earned-defence');await f.api.unlock();let release;
  f.holdFetch(new Promise(r=>release=r));const pending=f.api.hearVoice();await Promise.resolve();cancel(f);release();
  assert.equal(await pending,false);assert.equal(f.sources.length,0);
 }
});
test('automatic voice drops cold completions; cached next completion works only when allowed',async()=>{
 const f=fixture({storage:{gs_voice:'1'}});f.api.configureVoice('short-ball');let release;
 f.holdFetch(new Promise(r=>release=r));const pending=f.api.unlock();
 assert.equal(f.api.completeVoice(),false);release();await pending;await new Promise(r=>setTimeout(r,0));
 assert.equal(f.sources.length,0,'loading never replays a missed completion');
 assert.equal(f.api.completeVoice(),true);f.api.setVoice(false);assert.ok(f.sources[0].stopped);
 assert.equal(f.api.completeVoice(),false);assert.equal(f.api.enabled(),true,'voice off retains court sound');
});
test('failed voice remains retryable without breaking contact recordings',async()=>{
 const f=fixture({storage:{gs_voice:'0'}});f.api.configureVoice('recovery');await f.api.unlock();f.failFetch();
 assert.equal(await f.api.hearVoice(),false);assert.equal(f.api.voiceState().error,true);
 assert.equal(f.api.ready(),true);f.api.hit();assert.equal(f.sources.length,1);
 f.recoverFetch();assert.equal(await f.api.hearVoice(),true);
});
test('non-pilot lessons never load or offer a generic substitute',async()=>{
 const f=fixture({storage:{gs_voice:'1'}});f.api.configureVoice('serve-plus-one');await f.api.unlock();
 assert.equal(f.api.voiceInfo(),null);assert.equal(await f.api.hearVoice(),false);assert.equal(f.requests.length,6);
});
test('cross-tab voice opt-out stops speech but retains sound preference',async()=>{
 const f=fixture();f.api.configureVoice('short-ball');await f.api.hearVoice();
 f.events.storage({key:'gs_voice',newValue:'0'});assert.equal(f.api.voiceState().playing,false);
 assert.equal(f.api.voiceState().enabled,false);assert.equal(f.api.enabled(),true);
});
test('court contacts cannot cut across a manually replayed voice cue',async()=>{
 const f=fixture();f.api.configureVoice('short-ball');await f.api.hearVoice();
 f.api.hit();f.api.bounce();assert.equal(f.sources.length,1);
 f.sources[0].onended();f.api.hit();assert.equal(f.sources.length,2,'court sound returns after speech');
});
