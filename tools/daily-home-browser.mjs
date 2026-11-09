import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2];assert(base?.endsWith('/'));
const browser=await chromium.launch(),out='app_src/evidence/daily-home';mkdirSync(out,{recursive:true});
const checks=[],errors=[];const check=(value,label)=>{assert(value,label);checks.push(label);};
async function page(width=390,height=844){const c=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});await c.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));await p.clock.setFixedTime('2026-11-09T01:00:00Z');return p;}
async function finish(p,slug){await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);await p.evaluate(()=>{window.__speed=24;const old=setTimeout;window.setTimeout=(f,t,...a)=>old(f,t/8,...a);});
 for(let i=0;i<3;i++){await p.waitForFunction(i=>step===i&&!!document.querySelector('#askOpts button:not(:disabled)'),i);const correct=await p.evaluate(()=>LESSON.steps[step].correct);await p.locator('#askOpts button').nth(correct).click();await p.locator('#verdict:not([hidden]) #next').waitFor();await p.locator('#verdict #next').click();}
 await p.locator('#progressStorage').waitFor();if(await p.locator('#skipRecap').isVisible())await p.locator('#skipRecap').click();}
try{
 for(const [width,height] of [[320,568],[375,667],[390,844],[1280,900],[1440,900]]){
  const p=await page(width,height);await p.goto(base);await p.locator('#todayChallenge').waitFor();
  check(!p.url().includes('play.html'),width+': first entry stays on the daily invitation');
  check(await p.locator('.today').getAttribute('data-featured')==='serve-plus-one',width+': same calendar challenge');
  check(await p.evaluate(()=>{const b=document.querySelector('#todayChallenge').getBoundingClientRect(),nav=document.querySelector('.gs-bottom-nav').getBoundingClientRect();return b.top>=0&&b.bottom<=Math.min(innerHeight,nav.height?nav.top:innerHeight)&&b.height>=44;}),width+': primary action visible above navigation');
  check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),width+': no horizontal overflow');
  await p.screenshot({path:`${out}/first-${width}.png`});
  await p.goto(base+'?all=1');check(await p.locator('.activity-group .card').count()===63,width+': all 63 activities retained once');check(await p.locator('.activity-group').count()===3,width+': three coherent groups');
  check(!(await p.locator('.activity-filters').innerText()).includes('Predict'),width+': no separate Predict mode');
  await p.goto(base+'?all=1&kind=predict');check(await p.locator('a[href="play.html?l=predict-the-point"]').count()===1,width+': old Predict filter retains access');
  await p.goto(base+'?all=1&kind=patterns');check(await p.locator('.activity-group .card').count()===23,width+': old longer-point filter retains access');
  await p.context().close();
 }
 const p=await page();await finish(p,'serve-plus-one');
 check(await p.locator('#dailyDone').isVisible(),'finishing the challenge is a clear stopping point');
 check(await p.locator('#wrapup>[data-k=pro]').isVisible(),'professional story is visible in the payoff');
 check((await p.locator('#relatedLivePoint').getAttribute('href')).includes('l=live-point-serve-see'),'serve lesson offers its actual related point');
 check(/optional/i.test(await p.locator('.daily-related').innerText()),'continuation is explicitly optional');
 await p.screenshot({path:out+'/completed-lesson.png',fullPage:true});const spokenCue=await p.evaluate(()=>GSSfx.voiceInfo().text);await p.locator('#dailyDone').click();check((await p.locator('.today').innerText()).includes(spokenCue),'Home repeats the coach’s approved spoken cue');
 check(/complete/i.test(await p.locator('.today').innerText()),'Home retains the completed daily');check(await p.locator('#todayChallenge').count()===0,'a live point does not replace today’s completion');
 check((await p.locator('#livePoint').getAttribute('href')).includes('l=live-point-serve-see'),'related Live Point follows completed daily on Home');
 await p.evaluate(()=>{Object.defineProperty(navigator,'share',{configurable:true,value:undefined});Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async t=>{window.__copied=t;}}});});
 await p.locator('#shareDaily').click();await p.locator('#copyDaily').click();const shared=await p.locator('#dailyShareLink').inputValue();
 check(shared==='https://www.gamesharptennis.com/play.html?l=serve-plus-one&challenge=daily','shared link fixes the activity and excludes answers');
 check((await p.locator('#dailyShareStatus').innerText()).includes('Link copied'),'successful copy acknowledged');
 await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Denied');}}}));await p.locator('#copyDaily').click();check((await p.locator('#dailyShareStatus').innerText()).includes('Select and copy'),'clipboard failure offers an honest fallback');
 await p.screenshot({path:out+'/done-home.png',fullPage:true});
 await p.clock.setFixedTime('2026-11-10T01:00:00Z');await p.evaluate(()=>window.dispatchEvent(new Event('focus')));await p.waitForFunction(()=>document.querySelector('.today').dataset.featured==='short-ball');
 check((await p.locator('#todayChallenge').getAttribute('href')).includes('l=short-ball'),'new date refreshes a foreground return');
 await p.goto(base+new URL(shared).pathname.slice(1)+new URL(shared).search);await p.waitForFunction(()=>window.__test);check(new URL(p.url()).searchParams.get('l')==='serve-plus-one','shared yesterday link opens the exact challenge');
 await p.goto(base+'?home=1');await p.clock.setFixedTime('2026-12-11T01:00:00Z');await p.reload();check(/revisit/i.test(await p.locator('.today').innerText()),'rotation repeats honestly');check((await p.locator('#todayChallenge').innerText()).includes('Read it again'),'old completion does not mark this date done');
 await p.screenshot({path:out+'/revisit.png'});await p.context().close();
 const q=await page();await finish(q,'the-winner');check(await q.locator('#relatedLivePoint').count()===0,'unmatched content has no generic substitute point');await q.context().close();
 const blocked=await page();await blocked.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Full','QuotaExceededError');};});await blocked.goto(base);check((await blocked.locator('.storage-warning').innerText()).includes('will not be saved'),'storage failure stays visible');await blocked.context().close();
 check(errors.length===0,errors.join('\n')||'no browser errors');
 writeFileSync(out+'/checks.json',JSON.stringify({base,checks,errors},null,2));console.log(`PASS ${checks.length} daily-led Home and real completion checks`);
}finally{await browser.close();}
