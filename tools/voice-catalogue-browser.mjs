// Exercise real answers and completion in every mode; not a synthetic finishLesson call.
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';
import {execFile} from 'node:child_process';import {promisify} from 'node:util';
const base=process.argv[2],engine=process.env.GS_READINESS_BROWSER||'chromium';assert(base?.endsWith('/'));
const catalogue=JSON.parse(readFileSync('docs/features/completion-voice-catalogue.json')).lessons.concat(JSON.parse(readFileSync('docs/features/live-point-voice.json')));
const cat=JSON.parse(readFileSync('app/catalog.js','utf8').match(/GS_CATALOG=(.*);\n/)[1]);
assert.deepEqual(catalogue.map(r=>r.lesson).sort(),[...cat.daily,...cat.predict,...cat.play].map(r=>r.slug).sort());
const selected=process.env.GS_VOICE_SLUGS?.split(',');const rows=catalogue.filter(r=>!selected||selected.includes(r.lesson));
const out=`app_src/evidence/voice-catalogue-${process.env.GS_STAGE||'local'}-${engine}`;mkdirSync(out,{recursive:true});
const version=readFileSync('app/catalog.js','utf8').match(/GS_VERSION="([^"]+)"/)[1];
const browser=await ({chromium,webkit}[engine]).launch(),results=[],errors=[];
const cache=new Map(),run=promisify(execFile),origin=new URL(base).origin;
const fetchPath=key=>{if(!cache.has(key))cache.set(key,(async()=>{const dir=mkdtempSync(join(tmpdir(),'gs-catalogue-'));try{
 const {stdout}=await run(process.execPath,[process.env.GS_VERCEL_CLI,'curl',key,'--deployment',origin,'--scope','eoinlynn-5978s-projects','--','--silent','--show-error','--max-time','30','--dump-header',join(dir,'headers'),'--output',join(dir,'body'),'--write-out','%{http_code}'],{timeout:50000});
 assert.equal(Number(stdout.trim()),200,key);return{status:200,contentType:readFileSync(join(dir,'headers'),'utf8').match(/content-type:\s*([^\r\n]+)/i)?.[1]||'application/octet-stream',body:readFileSync(join(dir,'body'))};
 }finally{rmSync(dir,{recursive:true,force:true});}})());return cache.get(key);};
async function journey(row,index){
 const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
 await c.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));
 if(process.env.GS_AUTH_TRANSPORT){
  // Warm audio before the first gesture: CLI authentication latency is not app network latency.
  for(const name of ['contact-1.wav','contact-2.wav','bounce.wav','applause-1.mp3','applause-2.mp3','applause-3.mp3','voice-'+row.lesson+'.mp3',...['time-used','time-watched','early-recovery','recover-sooner'].map(k=>'voice-live-'+k+'.mp3')])await fetchPath('/audio/'+name+'?v='+version);
  await c.route(origin+'/**',async r=>{const u=new URL(r.request().url());await r.fulfill(await fetchPath(u.pathname+u.search));});
  await c.route('https://vercel.live/**',r=>r.abort());
 }
 await c.addInitScript(()=>{
  const sources=new WeakMap(),fetch=window.fetch.bind(window);window.__audio=[];
  window.fetch=async(...args)=>{const r=await fetch(...args),read=r.arrayBuffer.bind(r);r.arrayBuffer=async()=>{const bytes=await read();sources.set(bytes,String(args[0]));return bytes;};return r;};
  const AC=window.AudioContext||window.webkitAudioContext;
  window.AudioContext=class extends AC{
   async decodeAudioData(bytes){const b=await super.decodeAudioData(bytes);b.__asset=sources.get(bytes);return b;}
   createBufferSource(){const s=super.createBufferSource(),start=s.start.bind(s);s.start=(...args)=>{__audio.push({asset:s.buffer.__asset,duration:s.buffer.duration,moving:window.__test?.state().playing});return start(...args);};return s;}
  };
 });
 const p=await c.newPage();p.setDefaultTimeout(process.env.GS_AUTH_TRANSPORT?90000:30000);p.on('pageerror',e=>errors.push(row.lesson+': '+e));
 const voiceCount=()=>p.evaluate(()=>__audio.filter(a=>a.asset?.includes('/voice-')).length);
 try{
  await p.goto(base+'play.html?l='+row.lesson);await p.waitForFunction(()=>window.__test);await p.waitForSelector('#loading',{state:'hidden'});
  assert.equal(await p.evaluate(()=>GS_VERSION),version);
  await p.evaluate(()=>{window.__speed=24;const timer=window.setTimeout;window.setTimeout=(fn,ms,...a)=>timer(fn,ms/8,...a);});
  let questions=0,wrong=false;
  while(!await p.evaluate(()=>done)){
   await p.waitForFunction(()=>done||document.querySelector('#askOpts button:not(:disabled)'));
   if(await p.evaluate(()=>done))break;
   assert.equal(await voiceCount(),0,'no speech during questions: '+row.lesson);
   const current=await p.evaluate(()=>step);
   const miss=questions===0&&index%5===0;wrong||=miss;
   const choice=await p.evaluate(miss=>{const s=LESSON.steps[step];return miss?(s.correct+1)%s.opts.length:s.correct;},miss);
   await p.locator('#askOpts button').nth(choice).tap();questions++;
   assert.ok(questions<=6,'bounded branch');
   await p.waitForFunction(i=>done||step!==i||document.querySelector('#verdict:not([hidden]) #next'),current);
   if(await p.evaluate(i=>!done&&step===i&&!!document.querySelector('#verdict:not([hidden]) #next'),current))await p.locator('#next').tap();
  }
  await p.waitForSelector('#hearVoice');await p.waitForFunction(()=>__audio.some(a=>a.asset?.includes('/voice-')));
  assert.equal(await voiceCount(),1,'one automatic cue');
  const route=await p.evaluate(()=>LESSON.livePoint?{time:LETTERS.indexOf(ans[0])===LESSON.steps[0].correct,recovery:LETTERS.indexOf(ans[1])===LESSON.steps[1].correct}:null);
  const variant=route&&JSON.parse(readFileSync('docs/features/flagship-voice-sources.json')).find(r=>r.key===(route.time?(route.recovery?'time-used':'time-watched'):(route.recovery?'early-recovery':'recover-sooner')));
  const expectedText=variant?.text||row.text,expectedAsset=variant?.asset||row.lesson;
  assert.equal(await p.locator('#wrapup .mem').innerText(),expectedText);
  assert.equal(await p.locator('#voicePreference').getAttribute('aria-pressed'),'true');
  const audio=await p.evaluate(()=>__audio.filter(a=>a.asset?.includes('/voice-')));
  assert.ok(audio[0].asset.startsWith('audio/voice-'+expectedAsset+'.mp3?'),'lesson-specific asset');
  assert.equal(audio[0].moving,false,'voice follows completed motion');
  assert.equal(await p.evaluate(()=>__audio.some(a=>a.asset?.includes('/applause-'))),false,'no applause overlap');
  const evidence=await p.evaluate(()=>({score:GSApp.S.done[new URL(location).searchParams.get('l')]?.n,expected:ans.filter((a,i)=>a!=null&&(LETTERS.indexOf(a)===LESSON.steps[i].correct||(LESSON.steps[i].alsoOk||[]).includes(LETTERS.indexOf(a)))).length,predict:!!LESSON.predict,pro:!!LESSON.pro,drill:!!LESSON.drill,cue:!!LESSON.cue}));
  assert.equal(evidence.score,evidence.expected,'original answers preserved');
  if(evidence.pro)assert.ok(await p.locator('#wrapup details.pay[data-k="pro"]').count(),'professional payoff remains');
  if(evidence.drill)assert.ok(await p.locator('#wrapup details.pay[data-k="drill"]').count(),'drill remains');
  if(evidence.predict)assert.equal(await p.locator('#wrapup .review').count(),3,'all reads reviewed');
  if(evidence.cue){await p.locator('#saveCue').tap();assert.equal(await p.locator('#saveCue').innerText(),'Saved to My Game ✓');}
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  // A short cue can finish during the preceding hosted assertions. If the tap
  // starts it again, stop that manual playback before testing silent replay.
  await p.locator('#hearVoice').tap();if(await p.evaluate(()=>GSSfx.voiceState().playing))await p.locator('#hearVoice').tap();assert.equal(await p.evaluate(()=>GSSfx.voiceState().playing),false);
  const replayBaseline=await voiceCount();
  await p.locator('#wrapup').screenshot({path:`${out}/${row.lesson}-ending.png`});
  await p.locator('#again').tap();
  if(evidence.predict)await p.waitForSelector('#wrapup:not([hidden]) #hearVoice');else await p.waitForFunction(()=>!playing&&t===stopAt);
  assert.equal(await voiceCount(),replayBaseline,'point replay never repeats cue');
  await p.waitForSelector('#wrapup:not([hidden]) #nextDaily');
  assert.equal(await p.evaluate(()=>GSApp.S.done[new URL(location).searchParams.get('l')].n),evidence.score,'replay preserves score');
  await p.locator('#hearVoice').tap();await p.waitForFunction(()=>GSSfx.voiceState().playing);
  assert.equal(await voiceCount(),replayBaseline+1,'manual replay available');
  await p.locator('#voicePreference').tap();assert.equal(await p.evaluate(()=>GSSfx.voiceState().playing),false,'voice off stops speech');
  if(evidence.predict){await p.locator('#redo').tap();assert.equal(await p.evaluate(()=>done),false,'predict can restart');}
  for(const size of index===0?[{width:320,height:740},{width:1100,height:900}]:[]){await p.setViewportSize(size);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:`${out}/${row.lesson}-${size.width}.png`,fullPage:true});}
  results.push({lesson:row.lesson,questions,wrong,...evidence,duration:audio[0].duration,transcript:expectedText,automaticVoice:1,replayVoice:0});console.log('PASS',row.lesson,questions,'questions',audio[0].duration.toFixed(2)+'s');
 }catch(e){await p.screenshot({path:`${out}/${row.lesson}-failure.png`,fullPage:true}).catch(()=>{});throw e;}finally{await c.close();}
}
try{
 // Two isolated browsers' contexts bound CPU use while retaining actual DOM clicks and RAF playback.
 let index=0;await Promise.all(Array.from({length:2},async()=>{while(index<rows.length){const i=index++;await journey(rows[i],i);}}));
 assert.equal(errors.length,0,errors.join('\n'));assert.equal(results.length,rows.length);
 writeFileSync(out+'/report.json',JSON.stringify({base,version,engine,results,errors},null,2));console.log('PASS',results.length,'complete journeys');
}finally{await browser.close();}
