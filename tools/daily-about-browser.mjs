import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_ABOUT_BROWSER||'chromium';
assert(base?.endsWith('/'));
const browser=await ({chromium,webkit}[engine]).launch();
const out=`app_src/evidence/daily-about-${engine}`;mkdirSync(out,{recursive:true});
const checks=[],errors=[];const check=(ok,label)=>{assert(ok,label);checks.push(label);};
const explanation='GameSharp uses adapted motion-capture animations and modelled tennis scenarios to illustrate decisions and movement. These are educational representations, not exact predictions of real match outcomes.';
try{
 for(const [width,height] of [[320,568],[390,844],[1440,900]]){
  const p=await browser.newPage({viewport:{width,height},reducedMotion:'reduce',hasTouch:width<700});
  p.on('pageerror',e=>errors.push(String(e)));
  await p.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));
  await p.clock.setFixedTime('2026-11-10T01:00:00Z');
  for(const route of ['', '?all=1', '?review=1']){
   await p.goto(base+route);await p.locator('#main h1').first().waitFor();
   check(await p.locator('#about').getAttribute('open')===null,`${width}/${route}: About starts discreetly collapsed`);
   check(!(await p.locator('#main').innerText()).includes('Tennis-MoCap'),`${width}/${route}: credits do not interrupt main content`);
   if(route==='?all=1')check(await p.locator('.activity-group .card').count()===63,`${width}: all Explore activities retained`);
   const summary=p.locator('#about>summary');await summary.evaluate(el=>el.scrollIntoView({block:'center'}));
   check(await summary.evaluate(el=>{const r=el.getBoundingClientRect();const nav=document.querySelector('.gs-bottom-nav').getBoundingClientRect();return r.height>=44&&r.top>=0&&r.bottom<=Math.min(innerHeight,nav.height?nav.top:innerHeight);}),`${width}/${route}: About reachable above mobile navigation with 44px target`);
   await summary.focus();await p.keyboard.press('Enter');
   check(await p.locator('#about>p').innerText()===explanation,`${width}/${route}: exact explanation opens by keyboard`);
   check(await p.getByRole('heading',{name:'Credits & Licences'}).isVisible(),`${width}/${route}: separate credits subsection`);
   check((await p.locator('#about').innerText()).includes('Juan Diego Pulgarín-Giraldo'),`${width}/${route}: creator retained`);
   check((await p.locator('#about').innerText()).includes('edits, retimes, retargets'),`${width}/${route}: modifications retained`);
   check(await p.locator('#about a').nth(0).getAttribute('href')==='https://github.com/jdpulgarin/Tennis-MoCap',`${width}/${route}: source link retained`);
   check(await p.locator('#about a').nth(1).getAttribute('href')==='https://creativecommons.org/licenses/by-sa/3.0/',`${width}/${route}: exact licence retained`);
   check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}/${route}: no horizontal overflow`);
   await summary.evaluate(el=>el.scrollIntoView({block:'start'}));await p.screenshot({path:`${out}/about-${width}-${route===''?'home':route.includes('all')?'explore':'sharpen'}.png`});
   await summary.click();await p.locator('.privacy-note summary').click();
   check((await p.locator('.privacy-note').innerText()).includes('random browser ID'),`${width}/${route}: privacy notice retained`);
  }
  // Enter through the real Daily invitation; answer incorrectly once to prove actual scores survive.
  await p.goto(base);await p.locator('#todayChallenge').click();await p.waitForFunction(()=>window.__test);
  check(await p.evaluate(()=>LESSON.slug==='short-ball'||new URL(location.href).searchParams.get('l')==='short-ball'),`${width}: Daily opens the expected lesson`);
  await p.evaluate(()=>{window.__speed=24;const old=setTimeout;window.setTimeout=(f,t,...a)=>old(f,t/8,...a);});
  for(let i=0;i<3;i++){
   await p.waitForFunction(i=>step===i&&!!document.querySelector('#askOpts button:not(:disabled)'),i);
   const answer=await p.evaluate(i=>i===0?(LESSON.steps[step].correct+1)%LESSON.steps[step].opts.length:LESSON.steps[step].correct,i);
   await p.locator('#askOpts button').nth(answer).click();await p.locator('#verdict:not([hidden]) #next').waitFor();
   check(await p.locator('#verdict .tries,#verdict .illustration-note').count()===0,`${width}/${i}: no modelled count or qualification`);
   check((await p.locator('#verdict .copy').innerText()).length>20&&await p.locator('#verdict .prin').isVisible(),`${width}/${i}: coaching feedback retained`);
   await p.locator('#why').click();check(await p.locator('#whyp').isVisible(),`${width}/${i}: deeper explanation opens`);
   if(i===0)await p.screenshot({path:`${out}/daily-feedback-${width}.png`});
   await p.locator('#next').click();
  }
  await p.locator('#progressStorage').waitFor();
  if(await p.locator('#skipRecap').isVisible())await p.locator('#skipRecap').click();
  check(await p.evaluate(()=>GSApp.S.done['short-ball'].best===2&&GSApp.S.done['short-ball'].total===3),`${width}: actual 2/3 score saved`);
  check(await p.locator('#wrapup .mem').isVisible(),`${width}: completion coaching retained`);
  await p.locator('#dailyDone').click();check(/complete/i.test(await p.locator('.today').innerText()),`${width}: Home records completion`);
  check(await p.locator('#cineCd').isVisible(),`${width}: next challenge countdown retained`);
  await p.locator('#about>summary').click();check(await p.getByRole('heading',{name:'Credits & Licences'}).isVisible(),`${width}: About available after completion`);
  await p.close();
 }
 check(!errors.length,errors.join('\n')||'no browser errors');
}finally{await browser.close();writeFileSync(out+'/report.json',JSON.stringify({base,engine,checks,errors},null,2));}
console.log(`PASS ${checks.length} Daily, Explore and About checks (${engine})`);
