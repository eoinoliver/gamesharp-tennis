// Home decision hierarchy and relocated controls, using isolated browser state.
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_HOME_BROWSER||'chromium';assert(base?.endsWith('/'));
const browser=await ({chromium,webkit}[engine]).launch(),checks=[],errors=[];
const out=`app_src/evidence/home-clarity-${engine}`;mkdirSync(out,{recursive:true});
const check=(ok,msg)=>{assert(ok,msg);checks.push(msg);};
try{
 const c=await browser.newContext({viewport:{width:320,height:568},reducedMotion:'reduce'});
 await c.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));
 const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));
 await p.clock.setFixedTime('2026-11-09T01:00:00Z');await p.goto(base+'?home=1');
 const rotation=await p.evaluate(()=>GSApp.CAT.dailyPlan.rotation);
 for(let i=0;i<rotation.length;i++){
  await p.clock.setFixedTime(new Date(Date.UTC(2026,10,9+i,1)));await p.reload();
  await p.waitForFunction(()=>document.querySelector('#cineCourt img')?.naturalWidth>0);
  check(await p.locator('.today').getAttribute('data-featured')===rotation[i],rotation[i]+': calendar choice retained');
  check(await p.evaluate(()=>{const a=document.querySelector('#todayChallenge').getBoundingClientRect(),n=document.querySelector('.gs-bottom-nav').getBoundingClientRect();return a.bottom<=n.top&&a.height>=44&&document.documentElement.scrollWidth<=innerWidth;}),rotation[i]+': primary action fits the smallest supported phone');
  check(await p.locator('#cineCourt img').getAttribute('src').then(s=>s.includes('/'+rotation[i]+'.jpg')),rotation[i]+': preview belongs to the chosen lesson');
 }
 await p.clock.setFixedTime('2026-11-09T01:00:00Z');await p.reload();
 check(await p.locator('.today a.btn').count()===1,'one primary challenge action');
 check(await p.locator('.home-play a').count()===2,'two compact secondary choices');
 check(!await p.locator('[data-gs-coach]').isVisible(),'coach settings do not precede the daily invitation');
 await p.locator('#homeAudio>summary').focus();await p.keyboard.press('Enter');
 check(await p.locator('[data-gs-coach]').isVisible(),'keyboard opens coach settings');
 await p.locator('[data-gs-coach]').selectOption('lara');
 await p.locator('[data-gs-sound]').click();
 check(!await p.evaluate(()=>GSSfx.enabled()),'master mute works in the audio menu');
 await p.locator('#homeNarration').uncheck();await p.locator('#homeNarration').check();
 check(!await p.evaluate(()=>GSSfx.enabled()),'spoken-coaching preference cannot override master mute');
 await p.keyboard.press('Escape');
 check(await p.locator('#homeAudio>summary').evaluate(e=>document.activeElement===e),'Escape closes settings and restores keyboard focus');
 await p.reload();await p.locator('#homeAudio>summary').click();
 check(await p.locator('[data-gs-coach]').inputValue()==='lara'&&!await p.evaluate(()=>GSSfx.enabled()),'coach and mute survive reload');
 await p.keyboard.press('Escape');await p.locator('#homeSingles').click();await p.waitForURL(/kind=live/);await p.locator('.activity-group .card').first().waitFor();
 check(await p.locator('.activity-group .card').count()===23,'singles opens all singles points');
 check(await p.locator('#resumeLivePoint').isVisible(),'recommended or resumed point remains in singles');
 await p.goto(base+'?home=1');await p.locator('#homeDoubles').click();await p.waitForURL(/kind=doubles/);await p.locator('.activity-group .card').first().waitFor();
 check(await p.locator('.activity-group .card').count()===6,'doubles opens all six doubles scenarios');
 await p.goto(base+'?all=1&kind=daily');check(await p.locator('#more').isVisible(),'personal challenge queue remains in Explore');
 await p.goto(base+'?home=1');await p.locator('#profile').click();await p.locator('#levelSettings').click();
 await p.locator('[data-level=club]').click();check(await p.evaluate(()=>GSApp.S.level)==='club','player level remains editable in My Game');
 await p.goto(base+'?home=1');await p.route('**/home/*.jpg?*',r=>r.abort());await p.reload();
 await p.waitForFunction(()=>document.querySelector('#cineCourt').hidden);
 check(await p.locator('#todayChallenge').isVisible(),'failed preview image leaves a usable challenge');
 await p.unroute('**/home/*.jpg?*');await p.reload();
 // A past completion must not masquerade as completion today.
 await p.evaluate(()=>GSApp.complete('serve-plus-one',2));await p.reload();
 check(await p.locator('.today.is-done').count()===1&&await p.locator('#cineCourt').count()===0,'today’s completion collapses to its cue');
 await p.clock.setFixedTime('2026-12-11T01:00:00Z');await p.reload();
 check(await p.locator('#todayChallenge').innerText().then(t=>t.includes('Replay')),'historical result is offered as a revisit');
 check(await p.locator('.today.is-done').count()===0,'historical completion does not complete today');
 check(!errors.length,'no page errors');await c.close();
}finally{await browser.close();writeFileSync(out+'/report.json',JSON.stringify({base,engine,checks,errors},null,2));}
console.log(`PASS ${checks.length} Home clarity checks (${engine})`);
