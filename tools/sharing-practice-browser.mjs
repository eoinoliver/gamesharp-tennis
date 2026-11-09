import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
const base=process.argv[2];assert(base?.endsWith('/'));const engine=process.env.GS_LIVE_BROWSER||'chromium';
const cat=JSON.parse(readFileSync('app/catalog.js','utf8').match(/GS_CATALOG=(.*);\n/)[1]),all=[...cat.daily,...cat.predict,...cat.play];
const cards=JSON.parse(readFileSync('docs/features/share-preview-frames.json','utf8')).captures;
const dir=process.env.GS_PRACTICE_EVIDENCE||'app_src/evidence/sharing-practice/'+engine;mkdirSync(dir,{recursive:true});
const browser=await ({chromium,webkit}[engine]).launch(),checks=[],errors=[];
const check=(v,label)=>{assert(v,label);checks.push(label);};
async function page(width=390){const c=await browser.newContext({viewport:{width,height:width<500?844:960},reducedMotion:'reduce',acceptDownloads:true,timezoneId:'Australia/Sydney'});await c.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));await c.addInitScript(()=>{localStorage.setItem('gs_voice','0');localStorage.setItem('gs_sound','0');});const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));await p.clock.setFixedTime('2026-11-09T01:00:00Z');return p;}
async function finish(p,slug){await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);await p.evaluate(()=>{window.__speed=24;const old=setTimeout;window.setTimeout=(f,t,...a)=>old(f,t/8,...a);});
 for(let i=0;i<8;i++){
  await p.waitForFunction(()=>!!document.querySelector('#askOpts button:not(:disabled)')||!document.querySelector('#wrapup').hidden);
  if(await p.locator('#wrapup').isVisible())break;
  const state=await p.evaluate(()=>({correct:LESSON.steps[step].correct,predict:!!LESSON.predict,step}));await p.locator('#askOpts button').nth(state.correct).click();if(state.predict){await p.waitForFunction(old=>step>old||done,state.step);}else{await p.locator('#verdict:not([hidden]) #next').waitFor();await p.locator('#verdict #next').click();}
 }
 await p.locator('#sharePointButton').waitFor();if(await p.locator('#skipRecap').isVisible())await p.locator('#skipRecap').click();}
try{
 const p=await page();await p.goto(base+'?home=1');
 for(const l of all){
  // Fetch raw HTML: social metadata must be present before JavaScript executes.
  const html=await p.evaluate(async slug=>(await fetch('s/'+slug+'.html')).text(),l.slug);
  const raw=await p.evaluate(html=>{const d=new DOMParser().parseFromString(html,'text/html');return {title:d.querySelector('[property="og:title"]')?.content,image:d.querySelector('[property="og:image"]')?.content,description:d.querySelector('[property="og:description"]')?.content,twitter:d.querySelector('[name="twitter:card"]')?.content,link:d.querySelector('a')?.getAttribute('href')};},html);
  check(raw.title===cards.find(c=>c.slug===l.slug).question&&raw.twitter==='summary_large_image',l.slug+': server-visible question and social card');
  check(raw.image==='https://www.gamesharptennis.com/share/'+l.slug+'.jpg',l.slug+': specific actual-scene image');
  check(new URL(raw.link,base).searchParams.get('l')===l.slug&&!/score|answer=/.test(raw.link),l.slug+': fallback is exact and private');
 }
 // A recipient with no progress follows every invitation, including the nine older formats.
 for(const l of all){
  await p.goto(base+'s/'+l.slug+'.html');await p.waitForFunction(()=>window.__test);await p.locator('#quickShare').waitFor();
  check(new URL(p.url()).searchParams.get('l')===l.slug&&await p.evaluate(()=>Object.keys(GSApp.S.done).length===0),l.slug+': fresh recipient lands directly without inherited progress');
  await p.evaluate(()=>Object.defineProperty(navigator,'share',{configurable:true,value:async x=>{window.__shared=x;}}));await p.locator('#quickShare').click();
  const payload=await p.evaluate(()=>__shared);check(payload.url==='https://www.gamesharptennis.com/s/'+l.slug+'.html',l.slug+': in-play share targets exact activity');
  await p.goto(base+'?home=1');
 }
 for(const slug of ['serve-plus-one','live-point-buy-time','doubles-cross-cover','predict-the-point','saturday-point-1','midweek-point-1','play-the-point']){
  console.log('COMPLETE',slug);await finish(p,slug);check(await p.locator('#sharePointButton').isVisible()&&!await p.locator('#sharePointButton').evaluate(e=>!!e.closest('details')),slug+': visible completion sharing without disclosure');
  await p.evaluate(()=>Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw new DOMException('Cancel','AbortError');}}));await p.locator('#sharePointButton').click();check((await p.locator('#shareStatus').innerText())==='Share cancelled.'&&await p.locator('#shareFallback').isHidden(),slug+': cancellation never claims success');
  if(slug==='serve-plus-one')await p.screenshot({path:dir+'/completed-daily.png',fullPage:true});
 }
 await p.evaluate(()=>Object.defineProperty(navigator,'share',{configurable:true,value:undefined}));await p.locator('#quickShare').click();await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Denied');}}}));await p.locator('#quickShareCopy').click();check((await p.locator('#quickShareStatus').innerText()).includes('Select and copy'),'in-play clipboard denial has a manual fallback');
 await p.goto(base+'?review=1&z=my-game');check(await p.locator('.practice-entry').count()===7,'all completed formats appear automatically with no saved cues');check(await p.locator('.sh-practice').count()===0,'automatic history does not pretend cues were intentionally saved');
 check((await p.locator('#practiceWeekTitle').innerText()).includes('1 practice day'),'seven completions on one date count as one practice day');
 check((await p.locator('.practice-next').innerText()).includes('Tomorrow'),'authored variation waits until another calendar day');
 await p.locator('.practice-settings>summary').click();await p.locator('#practiceGoal').selectOption('3');check((await p.locator('#practiceWeekTitle').innerText()).includes('1 practice day of 3'),'optional goal updates without losing history');
 await p.reload();check((await p.locator('#practiceWeekTitle').innerText()).includes('of 3'),'goal survives reload');
 if(!await p.locator('[data-practice-save="serve-plus-one"]').isVisible())await p.locator('.practice-history>details>summary').click();await p.locator('[data-practice-save="serve-plus-one"]').click();check(await p.locator('.sh-practice').count()===1,'previous completion can supply a saved cue');
 await p.locator('[data-focus-select="serve-plus-one"]').click();check(await p.locator('#next-hit').isVisible(),'saved historical cue can become the next-hit focus');
 await p.locator('[data-focus-action="played"]').click();await p.locator('[data-focus-action="occurred"][data-value="yes"]').click();await p.locator('[data-focus-action="tried"][data-value="yes"]').click();await p.locator('[data-focus-action="useful"][data-value="partly"]').click();
 if(!await p.locator('.practice-history').innerText().then(t=>t.includes('Tried on court · your own report')))await p.locator('.practice-history>details>summary').click();
 check((await p.locator('.practice-history').innerText()).includes('Tried on court · your own report'),'court reflection is distinguished from quiz evidence');
 await p.clock.setFixedTime('2026-11-10T01:00:00Z');await p.reload();check(await p.locator('#practiceNextLink').isVisible(),'authored changed situation becomes available on a later local date');
 await p.locator('#practiceNextLink').click();check(new URL(p.url()).searchParams.get('from')==='my-game','next read returns to the personal practice context');
 await p.goto(base+'?review=1&z=my-game');await p.locator('.practice-settings>summary').click();await p.locator('.practice-reminder>summary').click();
 const download=p.waitForEvent('download');await p.locator('#practiceCalendar').click();const d=await download;await d.saveAs(dir+'/practice.ics');const ics=readFileSync(dir+'/practice.ics','utf8');check(ics.includes('RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR')&&ics.includes('BEGIN:VALARM'),'calendar reminder is an actual importable recurrence');check((await p.locator('#practiceCalendarStatus').innerText()).includes('save the event'),'calendar creation does not claim notifications are already enabled');
 for(const width of [320,390,1440]){await p.setViewportSize({width,height:width<500?844:960});await p.reload();await p.locator('#practiceOverview').waitFor();check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),width+': personal practice fits without overflow');await p.screenshot({path:dir+'/my-game-'+width+'.png',fullPage:true});}
 await p.context().close();
 const fresh=await page(320);await fresh.goto(base+'?review=1&z=my-game');check(await fresh.locator('.practice-entry').count()===0&&(await fresh.locator('#practiceWeekTitle').innerText()).includes('0 practice days'),'fresh browser shows a truthful empty state');await fresh.screenshot({path:dir+'/empty-320.png',fullPage:true});await fresh.context().close();
 check(errors.length===0,'no browser runtime errors');
}finally{writeFileSync(dir+'/report.json',JSON.stringify({engine,checks,errors},null,2));await browser.close();}
console.log('PASS',checks.length,'sharing and practice checks',engine);
