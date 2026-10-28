// Shared sound + beta continuation contract. Real browser audio graph; no production analytics.
import {chromium,webkit,devices} from 'playwright';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2]||'http://127.0.0.1:8772/';
const engine=process.env.GS_SOUND_BROWSER==='webkit'?webkit:chromium;
const browser=await engine.launch({headless:true});
const out='app_src/evidence/sensory';mkdirSync(out,{recursive:true});
let checks=0;const check=(v,msg)=>{assert.ok(v,msg);checks++;};const errors=[];
try{
 const c=await browser.newContext({...devices['iPhone 13'],defaultBrowserType:undefined});
 await c.route(/https:\/\/[^/]*posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));
 await c.addInitScript(()=>{
  const AC=window.AudioContext||window.webkitAudioContext;
  window.__recorded=[];window.__oscillators=0;
  window.AudioContext=class extends AC{
   constructor(o){super(o);window.__audio=this;}
   createOscillator(){window.__oscillators++;return super.createOscillator();}
   createBufferSource(){const s=super.createBufferSource(),start=s.start.bind(s);s.start=(...a)=>{window.__recorded.push({duration:s.buffer?.duration,length:s.buffer?.length});return start(...a);};return s;}
  };
 });
 const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));
 await p.goto(base+'play.html?l=contact-clue');await p.waitForFunction(()=>window.__test);
 const sound=p.locator('[data-gs-sound]');
 check(await sound.getAttribute('aria-label')==='Enable sound','first sound control is honest about activation');
 await p.locator('#again').tap();
 await p.waitForFunction(()=>GSSfx.ready());
 check(await p.evaluate(()=>GSSfx.enabled()&&!!window.__audio),'first gesture unlocks default-on audio');
 check(await sound.getAttribute('aria-label')==='Mute sound','first touch enables, does not mute');
 await sound.tap();check(await p.evaluate(()=>!GSSfx.enabled()),'second touch mutes');
 await p.reload();await p.waitForFunction(()=>window.__test);check(await p.evaluate(()=>!GSSfx.enabled()),'mute persists across navigation');
 await sound.tap();await p.waitForFunction(()=>GSSfx.ready());
 await p.evaluate(()=>{GSSfx.setVoice(false);window.__calls=[];for(const k of ['hit','bounce','applause']){const fn=GSSfx[k].bind(GSSfx);GSSfx[k]=(...a)=>{__calls.push(k);return fn(...a);};}});
 // Voice-off path retains natural completion applause; default voice is covered separately.
 // Natural speed: do not let accelerated test playback mask the contact boundary.
 await p.locator('#again').tap();await p.waitForFunction(()=>!playing&&t===stopAt);
 check(await p.evaluate(()=>__calls.includes('hit')),'contact event occurs on real-time opening');
 check(await p.evaluate(()=>__recorded.some(s=>s.length>0&&s.duration<.2)&&__oscillators===0),'real-time contact uses decoded recordings, no oscillators');
 await p.evaluate(()=>window.__speed=12);
 const ready=()=>p.waitForFunction(()=>{const q=document.querySelector('#ask');return q&&!q.hidden&&q.classList.contains('on')&&[...document.querySelectorAll('#askOpts button')].every(b=>!b.disabled);});
 for(let i=0;i<3;i++){
  await ready();await p.locator('#askOpts button').nth(await p.evaluate(()=>LESSON.steps[step].correct)).tap();
  await p.waitForSelector('#verdict:not([hidden]) #next',{timeout:30000});
  check(await p.evaluate(()=>__calls.filter(k=>k==='applause').length)===0,`step ${i+1}: no applause before completion`);
  await p.locator('#again').tap();await p.waitForFunction(()=>!playing&&t===stopAt);
  check(await p.evaluate(()=>__calls.filter(k=>k==='applause').length)===0,'replay cannot add applause');
  await p.locator('#next').tap();
 }
 await p.waitForSelector('#nextDaily');await p.waitForFunction(()=>!recapActive&&!playing);
 check(await p.evaluate(()=>__calls.filter(k=>k==='applause').length)===1,'one applause for the completed perfect challenge');
 const next=await p.evaluate(()=>GSApp.nextDaily().slug);check(await p.locator('#nextDaily').getAttribute('href')===`play.html?l=${next}`,'completion points to real next unplayed lesson');
 check(await p.evaluate(()=>silentPlayback),'automatic wrap-up stays silent');
 await p.locator('#again').tap();check(await p.evaluate(()=>hasLessonRecap()?silentPlayback:!silentPlayback),'recap stays quiet; single-point replay can have contact cues');
 await p.locator('#saveCue').tap();check(await p.evaluate(()=>JSON.parse(localStorage.gs_my_game).length>0),'cue still saves');
 await p.screenshot({path:`${out}/${engine.name()}-completion.png`,fullPage:true});
 await Promise.all([p.waitForURL(u=>u.searchParams.get('l')===next),p.locator('#nextDaily').tap()]);await p.waitForFunction(()=>window.__test);
 check(new URL(p.url()).searchParams.get('l')===next,'next challenge actually loads');
 check(await p.evaluate(()=>GSApp.S.done['contact-clue'].n===3&&GSApp.streakNow()===1),'continuing preserves original score and one-day streak');
 // All-complete endpoint has a useful, non-circular exit.
 await p.evaluate(()=>{GSApp.CAT.daily.forEach(l=>GSApp.complete(l.slug,2));});
 // wrap requires a visible engine ending, create through actual finish path.
 await p.evaluate(()=>{finishLesson();});await p.waitForSelector('.appblk');
 check(await p.locator('#nextDaily').count()===0,'catalogue exhaustion does not repeat a next lesson');
 check(await p.getByRole('link',{name:'Explore challenges'}).count()===1,'catalogue exhaustion offers Explore');
 // Every shell surface stays quiet, including automatic welcome.
 for(const path of ['?home=1','?all=1','?review=1','play.html?l=contact-clue&auto=1']){
  await p.goto(base+path);await p.waitForTimeout(2200);
  check(await p.evaluate(()=>!window.__audio),'shell/welcome has no autonomous audio context: '+path);
  await p.screenshot({path:`${out}/${engine.name()}-${path.includes('all')?'explore':path.includes('review')?'sharpen':path.includes('auto')?'welcome':'home'}.png`,fullPage:true});
 }
 // Predict must not reveal correct choices through sound before all three reads.
 for(const slug of ['predict-the-point','predict-second-serve']){
  await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);
  await p.locator('[data-gs-sound]').tap();
  await p.evaluate(()=>{window.__speed=20;window.__praise=0;const a=GSSfx.applause;GSSfx.applause=(...args)=>{__praise++;return a(...args);};});
  for(let i=0;i<3;i++){
   await ready();check(await p.evaluate(()=>__praise===0),'Predict choices stay acoustically neutral');
   await p.locator('#askOpts button').nth(await p.evaluate(()=>LESSON.steps[step].correct)).tap();
   if(i<2)await p.waitForFunction(n=>step===n,i+1);
  }
  await p.waitForSelector('#wrapup:not([hidden]) .appblk',{timeout:45000});
  check(await p.evaluate(()=>__praise===1),slug+': one accent after the whole perfect point');
  await p.locator('#again').tap();await p.waitForSelector('#wrapup:not([hidden]) .appblk',{timeout:45000});
  check(await p.evaluate(()=>__praise===1),'Predict replay does not re-celebrate');
 }
 // Catalogue-wide schedule audit: events stay tied to authored contacts; no per-loop soundtrack.
 const cat=JSON.parse(readFileSync('app/catalog.js','utf8').match(/GS_CATALOG=(.*);\n/)[1]);const report=[];
 for(const l of [...cat.daily,...cat.predict,...cat.play]){
  await p.goto(base+'play.html?l='+l.slug);await p.waitForFunction(()=>window.__test);
  const rows=await p.evaluate(()=>Object.values(SC).map(sc=>({original:sfxEvents(sc).length,audible:audibleEvents(sc).length,valid:audibleEvents(sc).every(([f,k])=>sfxEvents(sc).some(e=>e[0]===f&&e[1]===k)),bounces:audibleEvents(sc).filter(e=>e[1]==='bounce').length})));
  check(rows.every(x=>x.valid&&x.bounces<=1&&x.audible<=x.original),l.slug+': sounds aligned and reduced across every scene');
  report.push({lesson:l.slug,scenes:rows.length,original:rows.reduce((n,x)=>n+x.original,0),selected:rows.reduce((n,x)=>n+x.audible,0)});
 }
 writeFileSync(`${out}/${engine.name()}-catalogue.json`,JSON.stringify(report,null,2));
 // Render the actual recordings offline: prove nonzero, bounded signal and finite tails.
 const code=readFileSync('app_src/sfx.js','utf8');const mix=await c.newPage();await mix.goto(base+'?all=1');
 const levels=[];
 for(const effect of ['hit','bounce','applause','applause-2','applause-3']){
  const level=await mix.evaluate(async({code,effect})=>{
   const reward=effect.startsWith('applause');
   const offline=new OfflineAudioContext(2,48000*(reward?7:2),48000);
   let decoded=0;
   const decode=offline.decodeAudioData.bind(offline);
   offline.decodeAudioData=async bytes=>{const buffer=await decode(bytes);decoded++;return buffer;};
   localStorage.removeItem('gs_reward_last');
   if(effect==='applause-2')localStorage.setItem('gs_reward_last','applause-1');
   if(effect==='applause-3')localStorage.setItem('gs_reward_last','applause-2');
   window.AudioContext=function(){return new Proxy(offline,{get(t,k){if(k==='state')return 'running';if(k==='resume')return ()=>Promise.resolve();const v=Reflect.get(t,k,t);return typeof v==='function'?v.bind(t):v;},set(t,k,v){t[k]=v;return true;}});};
   localStorage.setItem('gs_sound','1');(0,eval)(code);await GSSfx.unlock();
   // Core readiness intentionally does not wait for optional rewards. Waveform
   // inspection must wait for all six recordings, including the selected reward.
   const deadline=Date.now()+15000;
   while(decoded<6&&Date.now()<deadline)await new Promise(r=>setTimeout(r,20));
   if(decoded!==6)throw Error(`Waveform fixtures: decoded ${decoded}/6 recordings`);
   await new Promise(r=>setTimeout(r,0));
   GSSfx[reward?'applause':effect](.7);
   const b=await offline.startRendering(),d=b.getChannelData(0);let peak=0,sum=0,tail=0,body=0;
   for(let i=0;i<d.length;i++){peak=Math.max(peak,Math.abs(d[i]));sum+=d[i]*d[i];if(i>48000*(reward?6:1))tail=Math.max(tail,Math.abs(d[i]));if(i>48000&&i<48000*2)body=Math.max(body,Math.abs(d[i]));}
   return{peak,rms:Math.sqrt(sum/d.length),tail,body};
  },{code,effect});
  check(level.peak>.001&&level.peak<.9&&level.rms>0&&level.tail<.00001,effect+': nonzero audio, no clipping, finite tail');levels.push({effect,...level});
  if(effect.startsWith('applause'))check(level.body>.001,effect+': natural reaction continues beyond one second');
 }
 // A missing/cold asset must not turn into a late shot or falsely ready control.
 const cold=await c.newPage();let release;const held=new Promise(r=>release=r);
 await cold.route('**/audio/**',async r=>{await held;await r.continue();});
 await cold.goto(base+'play.html?l=contact-clue');await cold.waitForFunction(()=>window.__test);
 await cold.locator('[data-gs-sound]').tap();await cold.waitForFunction(()=>document.querySelector('[data-gs-sound]').dataset.soundState==='loading');
 check(await cold.evaluate(()=>!GSSfx.ready()&&__recorded.length===0),'cold assets do not claim readiness or play');
 await cold.evaluate(()=>GSSfx.hit());await cold.locator('[data-gs-sound]').tap();release();
 await cold.waitForFunction(()=>document.querySelector('[data-gs-sound]').dataset.soundState==='off');await cold.waitForTimeout(400);
 check(await cold.evaluate(()=>!GSSfx.enabled()&&__recorded.length===0),'cancel during download prevents delayed confirmation and contact');
 await cold.locator('[data-gs-sound]').tap();await cold.waitForFunction(()=>GSSfx.ready());
 check(await cold.evaluate(()=>__recorded.length===0),'re-enable never invents a ball contact');await cold.close();
 const failed=await c.newPage();await failed.route('**/audio/**',r=>r.fulfill({status:404,body:''}));
 await failed.goto(base+'play.html?l=contact-clue');await failed.waitForFunction(()=>window.__test);await failed.locator('[data-gs-sound]').tap();
 await failed.waitForFunction(()=>document.querySelector('[data-gs-sound]').dataset.soundState==='error');
 check(await failed.evaluate(()=>!GSSfx.ready()&&__recorded.length===0),'missing audio stays silent and offers retry');
 await failed.unroute('**/audio/**');await failed.locator('[data-gs-sound]').tap();await failed.waitForFunction(()=>GSSfx.ready());
 check(await failed.evaluate(()=>__recorded.length===0),'failed download recovers silently on retry');await failed.close();
 writeFileSync(`${out}/${engine.name()}-levels.json`,JSON.stringify(levels,null,2));
 check(errors.length===0,errors.join('\n'));console.log(`PASS ${engine.name()}: ${checks} sensory/navigation assertions, ${report.length} lessons, real offline audio waveforms.`);
}finally{await browser.close();}
