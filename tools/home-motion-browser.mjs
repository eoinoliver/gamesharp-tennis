// Real media playback: no autoplay-policy override, isolated customer state.
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_HOME_BROWSER||'chromium';assert(base?.endsWith('/'));
const browser=await ({chromium,webkit}[engine]).launch(),checks=[],errors=[];
const out=`app_src/evidence/home-motion-${engine}`;mkdirSync(out,{recursive:true});
const check=(ok,message)=>{assert(ok,message);checks.push(message);};
async function page(motion='no-preference'){
 const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:motion});
 await c.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));
 await c.addInitScript(()=>{window.__audioStarts=0;const C=window.AudioContext;if(C)window.AudioContext=class extends C{constructor(...args){super(...args);window.__audioStarts++;}};});
 const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));await p.clock.setFixedTime('2026-11-09T01:00:00Z');return p;
}
const moving=p=>p.waitForFunction(()=>{const v=document.querySelector('#cineCourt video');return v&&!v.paused&&v.currentTime>.08;});
try{
 const p=await page();await p.goto(base+'?home=1');await moving(p);
 const rotation=await p.evaluate(()=>GSApp.CAT.dailyPlan.rotation);
 for(let i=0;i<rotation.length;i++){
  await p.clock.setFixedTime(new Date(Date.UTC(2026,10,9+i,1)));await p.reload();await moving(p);
  check(await p.locator('#cineCourt video').evaluate((v,slug)=>v.currentSrc.includes('/'+slug+'.mp4')&&v.videoWidth===820&&v.videoHeight===470&&v.muted&&v.playsInline&&!v.loop,rotation[i]),rotation[i]+': correct silent inline clip autoplays');
 }
 await p.clock.setFixedTime('2026-11-09T01:00:00Z');await p.reload();await moving(p);
 check(await p.evaluate(()=>window.__audioStarts===0),'autoplay creates no audio context');
 await p.getByRole('button',{name:'Pause court preview'}).click();const paused=await p.locator('video').evaluate(v=>v.currentTime);
 await p.waitForTimeout(250);check(await p.locator('video').evaluate((v,t)=>v.paused&&Math.abs(v.currentTime-t)<.02,paused),'manual pause holds the frame');
 await p.getByRole('button',{name:'Play court preview'}).click();await moving(p);
 await p.waitForFunction(()=>document.querySelector('#cineCourt video').ended);
 const end=await p.locator('video').evaluate(v=>v.currentTime);await p.waitForTimeout(250);
 check(await p.locator('video').evaluate((v,t)=>v.ended&&v.currentTime===t,end),'preview holds at the decision without looping');
 await p.screenshot({path:out+'/settled.png'});
 await p.getByRole('button',{name:'Replay court preview'}).click();await moving(p);
 check(await p.locator('video').evaluate(v=>v.currentTime<1),'replay starts from the beginning');
 // Real intersection: a temporary spacer allows scrolling on the short Home.
 await p.evaluate(()=>{document.querySelector('#main').style.paddingBottom='1500px';document.querySelector('.gs-main').scrollTo(0,900);});
 await p.waitForFunction(()=>document.querySelector('video').paused);
 check(await p.locator('video').evaluate(v=>!v.ended),'offscreen playback pauses before completion');
 await p.evaluate(()=>document.querySelector('.gs-main').scrollTo(0,0));await moving(p);
 await p.getByRole('button',{name:'Pause court preview'}).click();await p.evaluate(()=>document.querySelector('.gs-main').scrollTo(0,900));await p.waitForTimeout(100);await p.evaluate(()=>document.querySelector('.gs-main').scrollTo(0,0));await p.waitForTimeout(150);
 check(await p.locator('video').evaluate(v=>v.paused),'scrolling back does not undo a deliberate pause');
 await p.locator('#todayChallenge').click();await p.waitForFunction(()=>window.__test);
 check(new URL(p.url()).searchParams.get('l')==='serve-plus-one','primary action opens the matching interactive challenge');await p.context().close();

 const reduced=await page('reduce');const requests=[];reduced.on('request',r=>{if(r.url().includes('.mp4'))requests.push(r.url());});await reduced.goto(base);await reduced.locator('#cineCourt img').waitFor();await reduced.waitForTimeout(300);
 check(requests.length===0&&await reduced.locator('video').evaluate(v=>!v.getAttribute('src')&&v.paused),'reduced motion avoids autoplay and video download');
 await reduced.getByRole('button',{name:'Play court preview'}).click();await moving(reduced);check(true,'reduced-motion visitor can explicitly play');
 await reduced.emulateMedia({reducedMotion:'no-preference'});await reduced.emulateMedia({reducedMotion:'reduce'});await reduced.waitForFunction(()=>document.querySelector('video').paused);check(true,'enabling reduced motion pauses current playback');await reduced.context().close();

 const blocked=await page();await blocked.addInitScript(()=>{const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){return navigator.userActivation.isActive?play.call(this):Promise.reject(new DOMException('Blocked','NotAllowedError'));};});await blocked.goto(base);await blocked.getByRole('button',{name:'Play court preview'}).waitFor();
 check(await blocked.locator('video').evaluate(v=>v.paused),'autoplay rejection leaves an honest play control');await blocked.getByRole('button',{name:'Play court preview'}).click();await moving(blocked);check(true,'user gesture recovers browser-blocked autoplay');await blocked.context().close();

 const failed=await page();await failed.route('**/home/*.mp4?*',r=>r.abort());await failed.goto(base);await failed.waitForFunction(()=>document.querySelector('#cineCourt')?.dataset.preview==='unavailable');
 check(await failed.locator('#cineCourt img').evaluate(i=>i.naturalWidth>0)&&await failed.locator('#todayChallenge').isVisible(),'failed media retains the still and challenge action');
 check(!await failed.locator('.preview-control').isVisible(),'failed media does not advertise a broken control');await failed.context().close();
 check(errors.length===0,'no browser runtime errors');
 writeFileSync(out+'/checks.json',JSON.stringify({engine,checks,errors},null,2));console.log(JSON.stringify({engine,passed:checks.length}));
}finally{await browser.close();}
