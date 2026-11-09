// Regression tests for defects found in the 6 November customer-journey audit.
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_UX_BROWSER||'chromium';assert(base?.endsWith('/'));
const browser=await ({chromium,webkit}[engine]).launch(),checks=[],errors=[],out=`app_src/evidence/ux-audit-${engine}`;mkdirSync(out,{recursive:true});
const check=(ok,name)=>{assert(ok,name);checks.push(name);};
async function context(width=390){const c=await browser.newContext({viewport:{width,height:844}});await c.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));return c;}
async function ready(p){await p.waitForFunction(()=>window.__test);await p.waitForSelector('#loading',{state:'hidden'});await p.evaluate(()=>window.__speed=16);}
async function finish(p){for(let i=0;i<6&&!await p.evaluate(()=>done);i++){await p.locator('#askOpts button:not(:disabled)').first().waitFor();const correct=await p.evaluate(()=>LESSON.steps[step].correct);await p.locator('#askOpts button').nth(correct).click();await p.locator('#verdict:not([hidden]) #next').click();}await p.locator('#progressStorage').waitFor();}
try{
 const c=await context(),p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));
 await p.goto(base+'?home=1');await p.evaluate(()=>localStorage.setItem('gs_sound','0'));
 for(const [i,slug] of ['doubles-cross-cover','doubles-hold-cover','doubles-return-space','doubles-return-line','doubles-lob-switch','doubles-lob-overhead'].entries()){
  await p.goto(base+'play.html?l='+slug+'&challenge=point');await ready(p);
  check(await p.locator('#lessonName').innerText()==='A point for you',slug+': shared recipient gets a neutral title');
  await p.locator('.lesson-coach summary').click();const selected=i%2?'frank':'lara';await p.locator('.lesson-coach [data-gs-coach]').selectOption(selected);
  check(await p.evaluate(()=>GSCoach.current())===selected,slug+': recipient can choose coach before answering');
  check(await p.evaluate(()=>localStorage.getItem('gs_sound'))==='0',slug+': choosing coach preserves explicit mute');
  await p.locator('.lesson-coach summary').click();await finish(p);
  check(await p.locator('.voice-controls [data-gs-coach]').inputValue()===selected,slug+': completion keeps chosen coach');
  check(await p.locator('#sharePointButton').isVisible(),slug+': partner sharing is outside disclosures');
  await p.evaluate(()=>{window.__shares=[];Object.defineProperty(navigator,'share',{configurable:true,value:async payload=>{__shares.push(payload);throw new DOMException('Cancelled','AbortError')}});});
  await p.locator('#sharePointButton').click();const payload=await p.evaluate(()=>__shares[0]);
  check(new URL(payload.url).pathname==='/s/'+slug+'.html'&&new URL(payload.url).search==='',slug+': share has no scores or chosen answers');
  check((await p.locator('#shareStatus').innerText()).includes('cancelled'),slug+': cancellation is not claimed as delivery');
  await p.locator('#pairPlan summary').click();await p.locator('#pairPlanText').fill('');await p.locator('#sharePairPlan').click();check((await p.locator('#pairPlanStatus').innerText()).includes('Add a plan'),slug+': empty plan rejected');
  await p.locator('#pairPlanText').fill('Agree who covers before the serve.');await p.locator('#sharePairPlan').click();check((await p.evaluate(()=>__shares.at(-1).text)).includes('Proposed plan'),slug+': draft is not claimed as agreement');
 }
 for(const id of ['mistake','pressure','partner']){
  await p.goto(base+'?review=1&z=reset&r='+id);await p.locator('#resetSave').click();check(await p.locator('#resetRemove').isVisible(),id+': new reminder is immediately removable');await p.locator('#resetRemove').click();
  check(await p.evaluate(()=>JSON.parse(localStorage.getItem('gs_reset_v1')).saved)===null,id+': removal persisted');
  await p.locator('#resetSave').click();check(await p.locator('#resetRemove').isVisible(),id+': save after removal restores control');
  await p.locator('#resetStart').click();await p.locator('#resetNext').click();await p.locator('#resetNext').click();await p.locator('#resetNext').click();
  await p.getByRole('link',{name:'Use a decision in a point →'}).click();await ready(p);await finish(p);
  check(await p.locator('#practiceReturn').innerText()==='Back to Reset →',id+': return label matches destination');await p.locator('#practiceReturn').click();
  check(await p.locator('[data-reset-id]').getAttribute('data-reset-id')===id,id+': return restores exact routine');
 }
 await p.goto(base+'?review=1&z=reset&r=pressure');check(!(await p.locator('#resetIntention').innerText()).includes('read the return'),'pressure intention keeps returner role coherent');
 await p.evaluate(()=>localStorage.setItem('gs_reset_v1',JSON.stringify({v:1,saved:{id:'pressure',intention:'Split for the serve, then read the return',savedAt:123}})));await p.reload();
 check(await p.locator('#resetIntention').inputValue()==='Read the serve, then return with margin','existing pressure reminder keeps the corrected return intention');
 check(await p.evaluate(()=>JSON.parse(localStorage.getItem('gs_reset_v1')).saved.savedAt)===123,'reading updated wording preserves the saved record');
 await p.goto(base+'?review=1&z=my-game');check((await p.locator('.reset-reminder').innerText()).includes('Read the serve, then return with margin'),'My Game shows corrected reminder too');
 await p.goto(base+'play.html?l=doubles-cross-cover&from=my-game');await ready(p);await finish(p);
 check(await p.locator('#practiceReturn').innerText()==='Back to My Game →','saved doubles cue names My Game as return destination');
 await p.locator('#practiceReturn').click();check(new URL(p.url()).searchParams.get('z')==='my-game','saved doubles cue returns to My Game');

 await p.goto(base+'play.html?l=doubles-lob-switch&from=reset&routine=invalid');await ready(p);check(await p.locator('#close').getAttribute('href')==='./?review=1&z=reset','invalid routine safely returns to hub');
 for(const width of [320,390,1280]){await p.setViewportSize({width,height:844});await p.locator('.lesson-coach summary').click();check(await p.locator('.lesson-coach [data-gs-coach]').isVisible(),'early choice visible '+width);check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'early coach fits '+width);await p.screenshot({path:`${out}/early-coach-${width}.png`,fullPage:true});await p.locator('.lesson-coach summary').click();}
 await c.close();check(!errors.length,'no page errors');
}finally{await browser.close();writeFileSync(out+'/report.json',JSON.stringify({base,engine,checks,errors},null,2));}
console.log('PASS',checks.length,'UX audit regression checks',engine);
