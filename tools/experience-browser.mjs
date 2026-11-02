// The revised user journey: readable shell, explicit motion controls, every Saturday option,
// immediate completion, optional comparisons, and preserved first answers.
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_EXPERIENCE_BROWSER||'chromium';
assert(base?.endsWith('/'));const browser=await ({chromium,webkit}[engine]).launch(),checks=[],errors=[];
const out=`app_src/evidence/experience-${engine}`;mkdirSync(out,{recursive:true});
const check=(v,msg)=>{assert(v,msg);checks.push(msg);};
async function page(size={width:390,height:844},reducedMotion='no-preference'){
 const p=await browser.newPage({viewport:size,hasTouch:size.width<700,reducedMotion});p.setDefaultTimeout(30000);
 p.on('pageerror',e=>errors.push(String(e)));await p.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));return p;
}
try{
 for(const size of [{width:320,height:568},{width:390,height:844},{width:430,height:932},{width:1280,height:900},{width:1440,height:900}]){
  const p=await page(size,'reduce');await p.goto(base+'?home=1');await p.locator('#cineCourt.ready svg').waitFor();
  check(await p.evaluate(()=>{const a=document.querySelector('.gs-hero-wordmark').getBoundingClientRect(),b=document.querySelector('#profile').getBoundingClientRect();return a.right<=b.left&&b.width>=44&&b.height>=44;}),`${size.width}: profile has an unobstructed touch target`);
  await p.locator('#profile').click();await p.locator('#player-level').waitFor();
  await p.goto(base+'?home=1');check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${size.width}: Home fits without horizontal scroll`);
  check(await p.evaluate(()=>{const court=document.querySelector('#cineCourt').getBoundingClientRect(),card=document.querySelector('.cine-card').getBoundingClientRect();return court.bottom<=card.top||court.right<=card.left;}),`${size.width}: challenge never hides the ball flight`);
  await p.screenshot({path:`${out}/home-${size.width}.png`,fullPage:true});
  await p.goto(base+'?review=1');await p.locator('#shAth.ready svg').waitFor();
  check(await p.locator('.sh-zones a').count()===7,`${size.width}: all seven concern areas retained`);
  check(await p.evaluate(()=>[...document.querySelectorAll('.court-bg,.gs-real-home-court')].every(e=>getComputedStyle(e).display==='none')),`${size.width}: no background court behind Sharpen`);
  await p.locator('[data-ath="serve"]').click();await p.locator('#shAthCard').scrollIntoViewIfNeeded();
  for(let i=0;i<3;i++){await p.locator('#shAthCard [data-phase]').nth(i).click();await p.waitForFunction(()=>{const img=document.querySelector('#shAthCard figure:not([hidden]) img');return img?.complete&&img.naturalWidth>0;});
   check(await p.evaluate(()=>{const imgs=[...document.querySelectorAll('#shAthCard figure')].filter(e=>!e.hidden);return imgs.length===1&&imgs[0].getBoundingClientRect().width>innerWidth*.55||innerWidth>=700&&imgs.length===1&&imgs[0].getBoundingClientRect().width>400;}),`${size.width}: phase ${i+1} is enlarged and singular`);}
  await p.screenshot({path:`${out}/sharpen-${size.width}.png`,fullPage:true});await p.close();
 }
 const p=await page();await p.goto(base+'?review=1');await p.locator('#shAth.ready svg').waitFor();
 await p.locator('[data-ath="bv"]').click();await p.locator('#shAth').scrollIntoViewIfNeeded();
 await p.locator('#shPause').click();const stopped=await p.locator('#shAth svg').innerHTML();await p.waitForTimeout(500);
 check(stopped===await p.locator('#shAth svg').innerHTML(),'Sharpen pause freezes the player');
 await p.locator('#shSlow').click();check(await p.locator('#shSlow').getAttribute('aria-pressed')==='true','Slow view is explicit');
 await p.locator('#shReplay').click();await p.waitForFunction(before=>document.querySelector('#shAth svg').innerHTML!==before,stopped);
 await p.waitForTimeout(4500);check(await p.locator('[data-ath="bv"]').getAttribute('aria-pressed')==='true','Selected stroke stays selected across a complete loop');
 await p.goto(base+'play.html?l=saturday-point-1');await p.waitForFunction(()=>window.__test);await p.evaluate(()=>window.__speed=20);
 for(let step=0;step<5;step++)for(let choice=0;choice<2;choice++){
  await p.evaluate(i=>startStep(i),step);await p.waitForSelector('#askOpts button:not(:disabled)');await p.locator('#askOpts button').nth(choice).click();
  await p.locator('#verdict:not([hidden]) #next').waitFor();check(await p.locator('#verdict .copy').innerText().then(Boolean),`Saturday ${step+1}/${choice+1}: feedback and continuation survive`);
  if(step===0&&choice===0){check(await p.locator('.model-reset').isVisible(),'T-serve consequence explicitly discloses the model reset');check((await p.locator('#next').innerText()).includes('model pattern'),'Continuation button names the model pattern');}
 }
 for(const slug of ['short-ball','live-point-buy-time','live-point-make-room','live-point-serve-see']){
  await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);await p.evaluate(()=>window.__speed=20);
  for(let j=0;j<6&&!await p.evaluate(()=>done);j++){
   await p.waitForSelector('#askOpts button:not(:disabled)');const i=await p.evaluate(()=>LESSON.steps[step].correct);await p.locator('#askOpts button').nth(i).click();await p.locator('#verdict:not([hidden]) #next').waitFor();await p.locator('#next').click();
  }
  await p.locator('#wrapup:not([hidden]) .gs-continue').waitFor();
  check(await p.evaluate(()=>done&&!playing&&!recapActive),slug+': final cue arrives without a forced replay');
  await p.waitForFunction(()=>document.querySelector('#wrapup').getBoundingClientRect().top<80);
  check(await p.locator('#wrapup .mem').isVisible(),slug+': completion lands on the court cue');
  check(await p.locator('.completion-more').getAttribute('open')===null,slug+': supplementary coaching is available on demand');
  const answers=await p.evaluate(()=>JSON.stringify(ans));
  if(await p.locator('#replayTurningPoint').count()){
   await p.locator('#replayTurningPoint').click();await p.waitForFunction(()=>!playing);await p.locator('#compareOther').click();await p.waitForFunction(()=>!playing);await p.locator('#compareDone').click();
   check(await p.evaluate(()=>JSON.stringify(ans))===answers,slug+': comparison preserves original decisions');
  }
  await p.screenshot({path:`${out}/completion-${slug}.png`,fullPage:true});
 }
 await p.close();
 const cold=await page({width:390,height:844},'reduce');let failedOnce=false;
 await cold.route('**/clips/fh.json?*',route=>{if(!failedOnce){failedOnce=true;return route.fulfill({status:503,body:'Unavailable'});}return route.continue();});
 await cold.goto(base+'?review=1');await cold.locator('#shAth.load-error').waitFor();
 check((await cold.locator('#shStatus').innerText()).includes('reference frames'),'Unavailable animation retains an honest reference fallback');
 await cold.locator('#shReplay').click();await cold.locator('#shAth.ready:not(.load-error)').waitFor();
 check(await cold.locator('#shStatus').innerText()==='','Replay retries a failed clip request successfully');await cold.close();
 check(!errors.length,'No page errors throughout the experience');
}finally{await browser.close();writeFileSync(out+'/report.json',JSON.stringify({engine,checks,errors},null,2));}
console.log(`PASS ${checks.length} complete experience checks (${engine})`);
