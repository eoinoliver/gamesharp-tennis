import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_LIVE_BROWSER||'chromium';assert(base?.endsWith('/'));
const dir=`app_src/evidence/coach/${process.env.GS_STAGE||'local'}-${engine}`;mkdirSync(dir,{recursive:true});
const browser=await ({chromium,webkit}[engine]).launch(),checks=[],errors=[];
const check=(ok,label)=>{assert(ok,label);checks.push(label);};
try{
 const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await c.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));
 await c.addInitScript(()=>{window.__spoken=[];window.__media=[];const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){if(!__media.includes(this))__media.push(this);const result=play.call(this);result.then(()=>__spoken.push(this.src)).catch(()=>{});return result;};});
 const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));
 await p.goto(base+'?home=1');await p.locator('[data-gs-coach]').waitFor();
 check(await p.locator('[data-gs-coach]').inputValue()==='frank','existing default remains Frank');
 await p.locator('[data-gs-coach]').selectOption('lara');
 check(await p.evaluate(()=>localStorage.getItem('gs_coach'))==='lara','Lara choice persisted');
 await p.reload();check(await p.locator('[data-gs-coach]').inputValue()==='lara','selection survives reload');
 // Decode every actual Lara recording with the browser audio decoder.
 const rows=JSON.parse(readFileSync('docs/features/lara-voice-sources.json')).recordings;
 const decoded=await p.evaluate(async rows=>{
  const ac=new (window.AudioContext||window.webkitAudioContext)(),results=[];
  try{for(const row of rows){const response=await fetch(GSCoach.url(row.slug));if(!response.ok)throw Error(row.slug+': '+response.status);const b=await ac.decodeAudioData(await response.arrayBuffer());results.push({slug:row.slug,duration:b.duration,channels:b.numberOfChannels});}}finally{await ac.close();}return results;
 },rows);
 check(decoded.length===74&&decoded.every(r=>r.duration>0&&r.duration<=5&&r.channels===1),'74 matching Lara recordings decode under five seconds');
 for(const width of [320,390,1280]){
  await p.setViewportSize({width,height:900});check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Home fits '+width);
  const box=await p.locator('[data-gs-coach]').boundingBox();check(box.height>=44,'coach touch target '+width);check(box.x>=0&&box.x+box.width<=width,'coach selector remains fully visible '+width);
  await p.screenshot({path:`${dir}/home-${width}.png`,fullPage:true});
 }
 await p.setViewportSize({width:390,height:844});
 for(const id of ['mistake','pressure','partner']){
  await p.goto(base+'?review=1&z=reset&r='+id);check(await p.locator('[data-gs-coach]').inputValue()==='lara',id+' carries selected coach');
  await p.locator('#resetStart').click();await p.waitForFunction(()=>__spoken.length===1);
  check((await p.evaluate(()=>__spoken[0])).includes('voice-lara-reset-release'),id+' uses Lara release');
  await p.locator('#resetNext').click();await p.waitForFunction(()=>__spoken.length===2);
  await p.locator('#resetNext').click();await p.waitForFunction(()=>__spoken.length===3);
  check((await p.evaluate(()=>__spoken)).every((url,i)=>url.includes('voice-lara-reset-'+['release','choose','commit'][i])),id+' all three steps use Lara');
  await p.locator('#resetNext').click();check(await p.locator('#resetFinish').isVisible(),id+' completes');
 }
 await p.goto(base+'?review=1&z=reset&r=pressure');await p.locator('#resetStart').click();await p.waitForFunction(()=>__spoken.length===1);
 await p.locator('[data-gs-coach]').selectOption('frank');
 check(await p.evaluate(()=>__media.every(a=>a.paused)),'coach switch stops the old Reset recording');
 check(await p.evaluate(()=>__spoken.length)===1,'coach change does not speak over the current phase');
 await p.locator('#resetNext').click();await p.waitForFunction(()=>__spoken.length===2);
 check((await p.evaluate(()=>__spoken[1])).includes('/voice-reset-choose.mp3'),'next Reset step uses Frank');
 await p.locator('[data-gs-sound]').click();
 check(await p.evaluate(()=>!GSSfx.enabled()&&__media.every(a=>a.paused)),'same-page master mute stops Reset');
 check(!await p.locator('#resetVoice').isChecked(),'master mute clears Reset voice toggle');
 const count=await p.evaluate(()=>__spoken.length);await p.locator('[data-gs-coach]').selectOption('lara');await p.locator('#resetNext').click();
 check(await p.evaluate(()=>__spoken.length)===count,'muted coach switch and next step stay silent');
 await p.locator('#resetVoice').check();await p.waitForFunction(n=>__spoken.length===n+1,count);
 check((await p.evaluate(()=>__spoken.at(-1))).includes('voice-lara-reset-commit'),'explicit voice opt-in restores selected coach');
 // A second tab changes the preference and cancels the first tab's speech.
 const other=await c.newPage();await other.goto(base+'?home=1');await other.locator('[data-gs-coach]').selectOption('frank');
 await p.waitForFunction(()=>GSCoach.current()==='frank');check(await p.evaluate(()=>__media.every(a=>a.paused)),'cross-tab coach switch stops old speech');await other.close();
 await p.locator('#resetVoice').uncheck();await p.locator('[data-gs-coach]').selectOption('lara');await p.reload();
 check(!await p.locator('#resetVoice').isChecked(),'saved voice opt-out survives coach changes and navigation');
 await p.screenshot({path:`${dir}/reset-selected.png`,fullPage:true});
 await c.close();
 // Storage denial: the interface must not promise a saved choice.
 const blocked=await browser.newContext({viewport:{width:390,height:844}});await blocked.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));
 await blocked.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Blocked','SecurityError');};});
 const b=await blocked.newPage();await b.goto(base+'?home=1');await b.locator('[data-gs-coach]').selectOption('lara');
 check(await b.locator('[data-gs-coach]').inputValue()==='lara','page-only coach works with storage blocked');
 check((await b.locator('[data-gs-coach-status]').innerText()).includes('For this page only'),'storage failure described truthfully');await blocked.close();
 check(!errors.length,errors.join('\n'));
 writeFileSync(dir+'/report.json',JSON.stringify({engine,base,checks,decoded,errors},null,2));
 console.log('PASS',checks.length,'coach integration checks and',decoded.length,'decoded Lara recordings');
}finally{await browser.close();}
