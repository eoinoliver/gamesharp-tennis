// Complete → remember → Home → tomorrow. Synthetic history stays in isolated test browsers.
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_TAKEAWAY_BROWSER||'chromium';assert(base?.endsWith('/'));
const data=JSON.parse(readFileSync('app_src/takeaways.json','utf8'));
const plan=JSON.parse(readFileSync('app_src/daily_plan.json','utf8'));
const out=process.env.GS_TAKEAWAY_EVIDENCE||`app_src/evidence/takeaways-${engine}`;mkdirSync(out,{recursive:true});
const browser=await ({chromium,webkit}[engine]).launch(),checks=[],errors=[];
const check=(value,label)=>{assert(value,label);checks.push(label);};
async function page(width=390){const c=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});await c.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));await c.addInitScript(()=>{localStorage.setItem('gs_sound','0');localStorage.setItem('gs_voice','0');});const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));return p;}
async function finish(p,slug){await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);await p.evaluate(()=>{window.__speed=24;const delay=setTimeout;window.setTimeout=(fn,t,...a)=>delay(fn,t/8,...a);});
  for(let i=0;i<3;i++){await p.waitForFunction(i=>step===i&&!!document.querySelector('#askOpts button:not(:disabled)'),i);const correct=await p.evaluate(()=>LESSON.steps[step].correct);await p.locator('#askOpts button').nth(correct).click();await p.locator('#verdict:not([hidden]) #next').waitFor();await p.locator('#verdict #next').click();}
  if(await p.locator('#skipRecap').isVisible())await p.locator('#skipRecap').click();await p.locator('#wrapup .lesson-takeaway').waitFor();}
try{
  const p=await page(320);await p.clock.setFixedTime('2026-11-09T01:00:00Z');await p.goto(base+'?home=1');
  check(await p.locator('.lesson-takeaway').count()===0,'unplayed Daily does not expose its takeaway');
  for(let i=0;i<plan.rotation.length;i++){
    const slug=plan.rotation[i];await p.clock.setFixedTime(new Date(Date.UTC(2026,10,9+i,1)));await p.reload();await p.evaluate(slug=>GSApp.complete(slug,1,3),slug);await p.reload();
    const f=p.locator('.lesson-takeaway');check(await f.count()===1&&await f.getAttribute('data-takeaway')===slug,slug+': completion uses its own authored takeaway');
    check(await f.locator('h1').innerText()===data[slug].title&&await f.locator('figcaption').innerText()===data[slug].rule,slug+': authored title and decision rule rendered');
    check(await f.locator('.takeaway-panel').count()===2&&await f.locator('svg').count()===2,slug+': one visual comparison, two readable conditions');
    check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&[...document.querySelectorAll('.takeaway-panel')].every(e=>e.scrollWidth<=e.clientWidth)),slug+': small mobile has no horizontal overflow');
    check(await f.locator('a,button,video').count()===0,slug+': takeaway introduces no competing action or motion');
    check(await p.locator('#homeSingles b').innerText()==='Play singles'&&await p.locator('#homeDoubles b').innerText()==='Play doubles',slug+': Singles/Doubles remain unchanged');
    if(engine==='chromium'){await p.setViewportSize({width:390,height:844});await f.screenshot({path:out+'/'+slug+'.png'});await p.setViewportSize({width:320,height:844});}
  }
  await p.clock.setFixedTime('2026-12-11T01:00:00Z');await p.reload();check(await p.locator('.lesson-takeaway').count()===0&&await p.locator('#todayChallenge').isVisible(),'old completion does not reveal the next rotation’s takeaway');await p.context().close();
  for(const slug of ['short-ball','recovery','split-step','contact-clue','the-winner']){
    const q=await page();const i=plan.rotation.indexOf(slug);await q.clock.setFixedTime(new Date(Date.UTC(2026,10,9+i,1)));await finish(q,slug);
    check(await q.locator('#wrapup .lesson-takeaway').getAttribute('data-takeaway')===slug,slug+': real completion reveals the matching visual');
    check(await q.locator('#wrapup .mem').innerText()===await q.evaluate(()=>GSSfx.voiceInfo().text),slug+': existing spoken court cue remains coherent');
    check(await q.locator('#wrapup [data-k=pro]').isVisible()&&await q.locator('#saveCue').isVisible(),slug+': professional teaching and save cue remain available');
    if(slug==='short-ball'){
      await q.locator('#saveCue').click();await q.locator('#sharePointButton').click();check(await q.locator('#quickSharePanel').isVisible(),'completion sharing still opens the branded panel');await q.locator('#quickShareClose').click();
      await q.screenshot({path:out+'/short-ball-completion.png',fullPage:true});
    }
    await q.locator('#dailyDone').click();await q.waitForURL(/home=1/);check(await q.locator('.takeaway-rule').innerText()===data[slug].rule,slug+': Home recalls the same rule after real completion');
    if(slug==='short-ball'){
      check(await q.evaluate(()=>GSApp.cueSaved('short-ball')),'saving a cue survives the return to Home');
      for(const width of [320,390,1440]){await q.setViewportSize({width,height:width<500?844:1000});await q.screenshot({path:out+'/short-ball-home-'+width+'.png',fullPage:true});check(await q.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),width+': completed Home fits');}
    }
    await q.context().close();
  }
  const fallback=await page();await fallback.clock.setFixedTime('2026-11-10T01:00:00Z');await fallback.route('**/takeaways.js?*',r=>r.abort());await fallback.goto(base+'?home=1');await fallback.evaluate(()=>GSApp.complete('short-ball',1,3));await fallback.reload();check(await fallback.locator('.daily-cue').innerText()===await fallback.evaluate(()=>GSApp.bySlug('short-ball').cue),'missing visual module retains the authored plain-text cue');check(await fallback.locator('#livePoint').isVisible()&&await fallback.locator('#shareDaily').isVisible(),'missing module leaves continuation and sharing usable');await fallback.context().close();
  check(!errors.length,errors.join('\n')||'no browser errors');
}finally{writeFileSync(out+'/report.json',JSON.stringify({base,engine,checks,errors},null,2));await browser.close();}
console.log(`PASS ${checks.length} visual takeaway checks (${engine})`);
