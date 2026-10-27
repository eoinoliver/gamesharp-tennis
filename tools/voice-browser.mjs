// Complete pilot journeys; audio routing assertions supplement physical listening.
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync,readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';
import {execFile} from 'node:child_process';import {promisify} from 'node:util';
const base=process.argv[2],engine=process.env.GS_READINESS_BROWSER||'chromium';
assert(base?.endsWith('/'));const version=readFileSync('app/catalog.js','utf8').match(/GS_VERSION="([^"]+)"/)[1];
const out=`app_src/evidence/voice-${process.env.GS_STAGE||'local'}-${engine}`;mkdirSync(out,{recursive:true});
const b=await ({chromium,webkit}[engine]).launch(),c=await b.newContext({viewport:{width:390,height:844},hasTouch:true});
const errors=[],results=[];let intercepted=0;
await c.route(/posthog\.com\//,r=>{intercepted++;return r.fulfill({status:200,body:'{}'});});
if(process.env.GS_AUTH_TRANSPORT){
 const cache=new Map(),run=promisify(execFile),origin=new URL(base).origin;
 const fetchPath=key=>{if(!cache.has(key))cache.set(key,(async()=>{const dir=mkdtempSync(join(tmpdir(),'gs-voice-'));try{
  const {stdout}=await run(process.execPath,[process.env.GS_VERCEL_CLI,'curl',key,'--deployment',origin,'--scope','eoinlynn-5978s-projects','--','--silent','--show-error','--max-time','30','--dump-header',join(dir,'headers'),'--output',join(dir,'body'),'--write-out','%{http_code}'],{timeout:50000});
  assert.equal(Number(stdout.trim()),200,key);return {status:200,contentType:readFileSync(join(dir,'headers'),'utf8').match(/content-type:\s*([^\r\n]+)/i)?.[1]||'application/octet-stream',body:readFileSync(join(dir,'body'))};
 }finally{rmSync(dir,{recursive:true,force:true});}})());return cache.get(key);};
 for(const name of ['contact-1.wav','contact-2.wav','bounce.wav','applause-1.mp3','applause-2.mp3','applause-3.mp3',...['short-ball','earned-defence','recovery'].map(s=>'voice-'+s+'.mp3')])await fetchPath('/audio/'+name+'?v='+version);
 await c.route(origin+'/**',async r=>{const u=new URL(r.request().url());await r.fulfill(await fetchPath(u.pathname+u.search));});
 await c.route('https://vercel.live/**',r=>r.abort());
}
await c.addInitScript(()=>{const AC=window.AudioContext||window.webkitAudioContext;window.__audio=[];
 window.AudioContext=class extends AC{createBufferSource(){const s=super.createBufferSource(),start=s.start.bind(s),stop=s.stop.bind(s);let entry;
 s.start=(...a)=>{entry={duration:s.buffer.duration,stopped:false};__audio.push(entry);return start(...a);};s.stop=(...a)=>{if(entry)entry.stopped=true;return stop(...a);};return s;}};
});
const p=await c.newPage();p.setDefaultTimeout(process.env.GS_AUTH_TRANSPORT?90000:30000);p.on('pageerror',e=>errors.push(String(e)));
const voiceCount=()=>p.evaluate(()=>__audio.filter(s=>s.duration>2&&s.duration<3.3).length);
try{
 for(const [index,slug] of ['short-ball','earned-defence','recovery'].entries()){
  await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);await p.waitForSelector('#loading',{state:'hidden'});
  assert.equal(await p.evaluate(()=>GS_VERSION),version);await p.evaluate(()=>window.__speed=4);
  if(index===0)await p.locator('[data-gs-sound]').tap();
  for(let i=0;i<3;i++){
   await p.waitForFunction(()=>document.querySelector('#askOpts button:not(:disabled)'));
   assert.equal(await voiceCount(),0,'no voice during a question');
   const pick=await p.evaluate(wrong=>wrong?(LESSON.steps[step].correct+1)%LESSON.steps[step].opts.length:LESSON.steps[step].correct,index===2&&i===0);
   await p.locator('#askOpts button').nth(pick).tap();await p.waitForSelector('#verdict:not([hidden]) #next');await p.locator('#next').tap();
  }
  await p.waitForSelector('#hearVoice');await p.waitForSelector('#nextDaily');
  assert.equal(await p.locator('#wrapup .mem').innerText(),await p.evaluate(()=>GSSfx.voiceInfo().text));
  if(index===0){
   assert.equal(await voiceCount(),0);assert.equal(await p.locator('#voicePreference').getAttribute('aria-pressed'),'false');
   await p.locator('#hearVoice').tap();await p.waitForFunction(()=>GSSfx.voiceState().playing);
   assert.ok(await p.evaluate(()=>__audio.filter(s=>s.duration>3.5).every(s=>s.stopped)),'manual voice stops applause');
  }else{
   await p.waitForFunction(()=>GSSfx.voiceState().playing);
   assert.equal(await p.evaluate(()=>__audio.filter(s=>s.duration>3.5).length),0,'voice replaces applause');
  }
  assert.equal(await voiceCount(),1);await p.locator('#hearVoice').tap();assert.equal(await p.evaluate(()=>GSSfx.voiceState().playing),false);
  if(index===0){await p.locator('#voicePreference').tap();assert.equal(await p.locator('#voicePreference').getAttribute('aria-pressed'),'true');assert.equal(await voiceCount(),1,'auto opt-in itself is silent');}
  await p.locator('#again').tap();await p.waitForFunction(()=>!playing&&t===stopAt);assert.equal(await voiceCount(),1,'point replay does not replay speech');
  await p.locator('#hearVoice').tap();await p.waitForFunction(()=>GSSfx.voiceState().playing);
  await p.locator('[data-gs-sound]').tap();assert.equal(await p.evaluate(()=>GSSfx.voiceState().playing),false);
  assert.equal(await p.evaluate(()=>GSSfx.enabled()),false);await p.locator('[data-gs-sound]').tap();await p.waitForFunction(()=>GSSfx.ready());
  assert.equal(await voiceCount(),2,'unmuting does not replay speech');
  await p.locator('#saveCue').tap();assert.equal(await p.locator('#saveCue').innerText(),'Saved to My Game ✓');
  const n=await p.evaluate(slug=>GSApp.S.done[slug].n,slug);assert.equal(n,index===2?2:3);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.screenshot({path:`${out}/${slug}-complete.png`,fullPage:true});
  results.push({slug,score:n,voicePlays:await voiceCount(),matchingTranscript:true,replayAndMute:true,cueSaved:true});
  const next=await p.locator('#nextDaily').getAttribute('href');await Promise.all([p.waitForURL(u=>u.href.endsWith(next)),p.locator('#nextDaily').tap()]);
 }
 await p.goto(base+'play.html?l=serve-plus-one');await p.waitForFunction(()=>window.__test);
 assert.equal(await p.evaluate(()=>GSSfx.voiceInfo()),null,'nonpilot gets no substitute');
 await p.goto(base+'?review=1');await p.waitForSelector('#main');assert.equal(errors.length,0,errors.join('\n'));
 writeFileSync(out+'/report.json',JSON.stringify({base,version,engine,results,errors,intercepted},null,2));console.log(JSON.stringify({version,engine,results,errors,intercepted}));
}catch(e){await p.screenshot({path:out+'/failure.png',fullPage:true}).catch(()=>{});throw e;}finally{await b.close();}
