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
  const browse=p.getByRole('link',{name:'Browse all 32 challenges'});
  check(await browse.evaluate(el=>el.getBoundingClientRect().bottom<=document.querySelector('.gs-bottom-nav').getBoundingClientRect().top),width+': Daily library visible on first screen');
  await browse.click();await p.locator('.activity-group .card').first().waitFor();check(await p.locator('.activity-group .card').count()===32,width+': exactly 32 Dailies available');await p.goBack();
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
 await p.screenshot({path:out+'/completed-lesson.png',fullPage:true});const spokenCue=await p.evaluate(()=>GSSfx.voiceInfo().text);check(await p.locator('#wrapup .mem').innerText()===spokenCue,'lesson ending retains the coach’s approved spoken cue');const visualRule=await p.locator('#wrapup .takeaway-rule').innerText();await p.locator('#dailyDone').click();check(await p.locator('.lesson-takeaway').count()===0,'return Home keeps the completed answer out of the page');await p.locator('#dailyRecap summary').click();check(await p.locator('.takeaway-rule').innerText()===visualRule,'explicit Daily review recalls the actual completed rule');await p.locator('#dailyRecap summary').click();
 check(!await p.locator('#shareDaily').isVisible(),'completed challenge actions stay with its review');await p.locator('#dailyRecap summary').click();
 check(/complete/i.test(await p.locator('.today').innerText()),'Home retains the completed daily');check(await p.locator('#todayChallenge').count()===0,'a live point does not replace today’s completion');
 check((await p.locator('#livePoint').getAttribute('href')).includes('l=live-point-serve-see'),'related Live Point follows completed daily on Home');
 await p.evaluate(()=>{window.__homeShare=null;Object.defineProperty(navigator,'share',{configurable:true,value:async payload=>{window.__homeShare=payload;}});});await p.locator('#shareDaily').click();check(await p.locator('#quickSharePanel').isVisible()&&await p.evaluate(()=>__homeShare===null),'Home first opens the branded panel, even with native sharing available');await p.locator('#quickShareNative').click();
 const nativeShare=await p.evaluate(()=>__homeShare);check(nativeShare.title==='GameSharp Tennis · Challenge'&&nativeShare.text.startsWith('GameSharp Tennis · Challenge\n')&&nativeShare.url==='https://www.gamesharptennis.com/s/serve-plus-one.html','Home native sharing carries the GameSharp brand and exact challenge');
 await p.evaluate(()=>{Object.defineProperty(navigator,'share',{configurable:true,value:undefined});Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async t=>{window.__copied=t;}}});});
 await p.locator('#shareDaily').click();await p.locator('#quickShareCopy').click();const shared=await p.evaluate(()=>__copied);
 check(shared==='https://www.gamesharptennis.com/s/serve-plus-one.html','shared link fixes the activity and excludes answers');
 check((await p.locator('#dailyShareStatus').innerText()).includes('Link copied'),'successful copy acknowledged');
 await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Denied');}}}));await p.locator('#quickShareCopy').click();check((await p.locator('#dailyShareStatus').innerText()).includes('Select and copy'),'clipboard failure offers an honest fallback');
 await p.locator('#quickShareClose').click();await p.screenshot({path:out+'/done-home.png',fullPage:true});
 await p.clock.setFixedTime('2026-11-10T01:00:00Z');await p.evaluate(()=>window.dispatchEvent(new Event('focus')));await p.waitForFunction(()=>document.querySelector('.today').dataset.featured==='short-ball');
 check((await p.locator('#todayChallenge').getAttribute('href')).includes('l=short-ball'),'new date refreshes a foreground return');
 await p.goto(base+new URL(shared).pathname.slice(1)+new URL(shared).search);await p.waitForFunction(()=>window.__test);check(new URL(p.url()).searchParams.get('l')==='serve-plus-one','shared yesterday link opens the exact challenge');
 await p.goto(base+'?home=1');await p.clock.setFixedTime('2026-12-11T01:00:00Z');await p.reload();check(/revisit/i.test(await p.locator('.today').innerText()),'rotation repeats honestly');check((await p.locator('#todayChallenge').innerText()).includes('Replay this challenge'),'old completion does not mark this date done');
 await p.screenshot({path:out+'/revisit.png'});await p.context().close();
 const returning=await page();await returning.goto(base+'?home=1');
 await returning.locator('#todayChallenge').click();await returning.waitForFunction(()=>window.GSApp?.S.seen?.['serve-plus-one']);await returning.goBack();
 check((await returning.locator('#todayChallenge').innerText()).includes('Continue'), 'return to an unfinished Daily');
 await returning.evaluate(()=>GSApp.complete('serve-plus-one',1,3));await returning.reload();
 const next=returning.locator('[data-home-next]');
 check(await next.getAttribute('data-home-next')==='live-point-serve-see','authored related challenge leads after Daily');
 await next.click();await returning.waitForFunction(()=>window.__test);await returning.goBack();
 check(await next.getAttribute('data-home-next')==='live-point-serve-see'&&(await next.innerText()).includes('Play from the start'),'returning to the same Live Point accurately describes its restart');
 await returning.evaluate(()=>GSApp.complete('live-point-serve-see',2,2));await returning.reload();
 check(await next.getAttribute('data-home-next')!=='live-point-serve-see','finishing advances the choice');
 await returning.context().close();
 const pair=await page();await pair.goto(base+'?home=1');await pair.evaluate(()=>GSApp.complete('doubles-return-line',2,2));await pair.reload();
 check((await pair.locator('[data-home-next]').getAttribute('data-home-next')).startsWith('doubles-')&&await pair.locator('#todayChallenge').isVisible(),'a direct doubles visit leads to more doubles and keeps the shared Daily available');await pair.context().close();
 const q=await page();await finish(q,'the-winner');check(await q.locator('#relatedLivePoint').count()===0,'unmatched content has no generic substitute point');await q.context().close();
 const report=await page();await report.clock.setFixedTime('2026-11-12T01:00:00Z');
 for(const slug of ['the-winner','forehand-bill']){
  await finish(report,slug);await report.locator('#dailyDone').click();
  const next=report.locator('[data-home-next]'),candidate=await next.getAttribute('data-home-next');
  check(await report.locator('#main h1').first().innerText()===await report.locator('#homeNextTitle').innerText()&&
    await report.evaluate(s=>!!GSApp.bySlug(s)&&!GSApp.S.done[s],candidate),slug+': Home leads with a playable unfinished challenge');
 }
 // A separate session must start with an invitation even after explicitly reviewing the Daily.
 const recap=report.locator('#dailyRecap summary');
 await recap.click();await report.locator('#dailyRecap [data-takeaway="the-winner"]').waitFor();
 check(await report.getByText('A result, not a verdict',{exact:true}).isVisible(),'the Nov 12 review opens the finished Daily');
 const restored=await browser.newContext({storageState:await report.context().storageState(),viewport:{width:390,height:844},reducedMotion:'reduce'});
 await restored.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));
 const again=await restored.newPage();await again.clock.setFixedTime('2026-11-12T01:00:00Z');await again.goto(base);
 check(await again.locator('[data-home-next]').isVisible() && !await again.locator('#dailyRecap').evaluate(d=>d.open) && await again.locator('.lesson-takeaway').count()===0,'a new session opens Home without the earlier answer');
 await restored.close();await report.context().close();
 const reset=await page();await reset.goto(base+'?review=1&z=reset&r=pressure');await reset.locator('#resetIntention').selectOption('Read the serve, then return with margin');await reset.locator('#resetStart').click();await reset.locator('#resetNext').click();await reset.clock.setFixedTime('2026-11-10T01:00:00Z');await reset.evaluate(()=>window.dispatchEvent(new Event('focus')));check(await reset.locator('#resetIntention').inputValue()==='Read the serve, then return with margin','daily rollover preserves an unfinished Reset intention');check(await reset.locator('#resetPause').isVisible(),'daily rollover preserves the active Reset rehearsal');await reset.context().close();
 const blocked=await page();await blocked.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Full','QuotaExceededError');};});await blocked.goto(base);check((await blocked.locator('.storage-warning').innerText()).includes('will not be saved'),'storage failure stays visible');await blocked.context().close();
 check(errors.length===0,errors.join('\n')||'no browser errors');
 writeFileSync(out+'/checks.json',JSON.stringify({base,checks,errors},null,2));console.log(`PASS ${checks.length} daily-led Home and real completion checks`);
}finally{await browser.close();}
