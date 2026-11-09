// Actual browser motion, settlement and lifecycle. Practice data stays in isolated contexts.
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_TAKEAWAY_BROWSER||'chromium';assert(base?.endsWith('/'));
const cards=JSON.parse(readFileSync('app_src/takeaways.json','utf8'));
const out=process.env.GS_TAKEAWAY_EVIDENCE||`app_src/evidence/takeaway-motion-${engine}`;mkdirSync(out,{recursive:true});
const browser=await ({chromium,webkit}[engine]).launch(),checks=[],errors=[];
const check=(v,label)=>{assert(v,label);checks.push(label);};
async function page(width=390,reducedMotion='no-preference'){
 const c=await browser.newContext({viewport:{width,height:844},reducedMotion});await c.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));
 await c.addInitScript(()=>{localStorage.setItem('gs_sound','0');localStorage.setItem('gs_voice','0');window.__motionFrames=[];window.__sampleMotion=false;
  setInterval(()=>{if(!window.__sampleMotion)return;const f=document.querySelector('[data-takeaway-motion]');if(!f)return;
   __motionFrames.push({state:f.dataset.motionState,time:performance.now(),actors:[...f.querySelectorAll('.tk-travel-ball,.tk-you')].map(e=>({x:+e.getAttribute('cx'),y:+e.getAttribute('cy'),opacity:e.style.opacity,transform:e.getAttribute('transform')})),text:[...f.querySelectorAll('h1,p,figcaption')].map(e=>({text:e.textContent,y:e.getBoundingClientRect().y,height:e.getBoundingClientRect().height}))});
   if(f.dataset.motionState==='settled'&&__motionFrames.some(x=>x.state==='playing'))window.__sampleMotion=false;
  },40);
 });
 const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));return p;
}
async function home(p,slug,extra){
 await p.clock.setFixedTime((slug==='short-ball'?'2026-11-10':'2026-11-13')+'T01:00:00Z');await p.goto(base+'?home=1');await p.evaluate(s=>GSApp.complete(s,2,3),slug);
 await p.addInitScript(()=>{window.__sampleMotion=true;});if(extra)await p.addInitScript(extra);await p.reload({waitUntil:'domcontentloaded'});
}
async function settled(p){await p.waitForFunction(()=>document.querySelector('[data-motion-state="settled"]'));}
async function finish(p,slug){await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);await p.evaluate(()=>{window.__sampleMotion=true;window.__speed=24;const delay=setTimeout;window.setTimeout=(fn,t,...a)=>delay(fn,t/8,...a);});
 for(let i=0;i<3;i++){await p.waitForFunction(i=>step===i&&!!document.querySelector('#askOpts button:not(:disabled)'),i);const correct=await p.evaluate(()=>LESSON.steps[step].correct);await p.locator('#askOpts button').nth(correct).click();await p.locator('#verdict:not([hidden]) #next').waitFor();await p.locator('#verdict #next').click();}
 if(await p.locator('#skipRecap').isVisible())await p.locator('#skipRecap').click();await p.locator('#wrapup .lesson-takeaway').waitFor();await p.locator('.takeaway-pair').scrollIntoViewIfNeeded();await settled(p);
}
try{
 for(const slug of ['short-ball','recovery'])for(const width of [320,390,1440]){
  const p=await page(width);await home(p,slug);const progress=await p.evaluate(()=>JSON.stringify(GSApp.S.done));await settled(p);
  const frames=await p.evaluate(()=>__motionFrames),playing=frames.filter(f=>f.state==='playing');check(playing.length>5,`${slug}/${width}: visible summary animates`);
  writeFileSync(`${out}/${slug}-${width}-frames.json`,JSON.stringify(frames,null,2));
  const duration=frames.at(-1).time-playing[0].time;check(duration>=2300&&duration<3800,`${slug}/${width}: one brief sequence settles`);
  check(playing.every(f=>JSON.stringify(f.text)===JSON.stringify(playing[0].text)),`${slug}/${width}: text stays still and readable`);
  if(slug==='short-ball'){
   check(playing.some(f=>f.actors[0]?.x>35&&f.actors[0]?.x<130&&f.actors[1]?.opacity==='0'),`${width}: lifted path plays before attacking path`);
   check(playing.some(f=>f.actors[0]?.opacity==='0'&&f.actors[1]?.x>35&&f.actors[1]?.opacity==='1'),`${width}: attacking path follows`);
  }else{
   check(new Set(playing.map(f=>f.actors[0]?.transform)).size>5&&new Set(playing.map(f=>f.actors[1]?.transform)).size>5,`${width}: both recovery positions move`);
   const actual=await p.locator('.tk-you').evaluateAll(es=>es.map(e=>[+e.getAttribute('cx'),+e.getAttribute('cy')]));check(JSON.stringify(actual)===JSON.stringify(cards.recovery.panels.map(p=>p.move)),`${width}: player remains at the recovery destination`);
  }
  check(await p.locator('.tk-travel-ball,.tk-travel-path,.tk-you[transform]').count()===0,`${slug}/${width}: no transient motion remains`);
  check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${slug}/${width}: viewport fits`);
  check(progress===await p.evaluate(()=>JSON.stringify(GSApp.S.done)),`${slug}/${width}: motion does not change practice history`);
  const still=await p.locator('.lesson-takeaway').innerHTML();await p.evaluate(()=>{scrollTo(0,document.body.scrollHeight);GSTakeaways.mount(document.getElementById('main'));scrollTo(0,0);});await p.waitForTimeout(400);
  check(still===await p.locator('.lesson-takeaway').innerHTML(),`${slug}/${width}: scrolling and remounting do not replay`);
  await p.screenshot({path:`${out}/${slug}-${width}-settled.png`,fullPage:true});await p.context().close();
 }
 for(const slug of ['short-ball','recovery']){
  const p=await page(390,'reduce');await home(p,slug);await settled(p);check(!(await p.evaluate(()=>__motionFrames)).some(f=>f.state==='playing')&&await p.locator('.tk-travel-ball,.tk-you[transform]').count()===0,`${slug}: reduced motion is immediately static`);await p.context().close();
 }
 const off=await page();await home(off,'short-ball',()=>document.addEventListener('DOMContentLoaded',()=>{const style=document.createElement('style');style.textContent='.daily-complete{padding-top:1000px!important}';document.head.append(style);}));
 await off.waitForTimeout(250);check(await off.locator('.lesson-takeaway').getAttribute('data-motion-state')==='waiting','offscreen summary waits');await off.locator('.takeaway-pair').scrollIntoViewIfNeeded();await off.waitForFunction(()=>document.querySelector('[data-motion-state="playing"]'));check(true,'scrolling the diagrams into view starts motion');await off.evaluate(()=>scrollTo(0,0));await settled(off);await off.locator('.takeaway-pair').scrollIntoViewIfNeeded();check(await off.locator('.lesson-takeaway').getAttribute('data-motion-state')==='settled','scrolling away settles; returning does not replay');await off.context().close();
 const pref=await page();await home(pref,'recovery');await pref.waitForFunction(()=>document.querySelector('[data-motion-state="playing"]'));await pref.emulateMedia({reducedMotion:'reduce'});await settled(pref);check(await pref.locator('.tk-you[transform]').count()===0,'changing reduced-motion preference settles immediately');await pref.emulateMedia({reducedMotion:'no-preference'});check(await pref.locator('.lesson-takeaway').getAttribute('data-motion-state')==='settled','restoring motion preference does not restart');await pref.context().close();
 const hidden=await page();await home(hidden,'short-ball');await hidden.waitForFunction(()=>document.querySelector('[data-motion-state="playing"]'));await hidden.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});await settled(hidden);await hidden.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});check(await hidden.locator('.tk-travel-ball').count()===0&&await hidden.locator('.lesson-takeaway').getAttribute('data-motion-state')==='settled','backgrounding settles without replay on return');await hidden.context().close();
 const fallback=await page();await home(fallback,'short-ball',()=>{delete window.IntersectionObserver;});await settled(fallback);check(await fallback.locator('.takeaway-panel').count()===2&&await fallback.locator('.tk-travel-ball').count()===0,'missing observer retains the complete static summary');await fallback.context().close();
 const scope=await page();await scope.goto(base);const eligible=await scope.evaluate(slugs=>slugs.filter(slug=>GSTakeaways.render(slug).includes('data-takeaway-motion')),Object.keys(cards));check(JSON.stringify(eligible.sort())===JSON.stringify(['recovery','short-ball']),'exactly two authored summaries animate; 30 remain static');await scope.context().close();
 for(const slug of ['short-ball','recovery']){const p=await page();await finish(p,slug);check((await p.evaluate(()=>__motionFrames)).some(f=>f.state==='playing'),slug+': actual completion can animate on entering view');check(await p.locator('#saveCue').isVisible()&&await p.locator('#wrapup [data-k=pro]').isVisible(),slug+': teaching and saving remain available');await p.locator('#dailyDone').click();await p.waitForURL(/home=1/);await p.locator('#todayChallenge,.daily-complete').waitFor();check(true,slug+': return Home remains usable');await p.context().close();}
 check(!errors.length,errors.join('\n')||'no browser errors');
}finally{writeFileSync(out+'/report.json',JSON.stringify({base,engine,checks,errors},null,2));await browser.close();}
console.log(`PASS ${checks.length} takeaway motion checks (${engine})`);
