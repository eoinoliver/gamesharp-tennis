// Exercise every professional card/fallback in the shared completion renderer.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2];assert(base?.endsWith('/'));
const catalogText=await (await fetch(base+'catalog.js')).text();
const C=JSON.parse(catalogText.match(/GS_CATALOG=(.*);\n/)[1]);
const all=[...C.daily,...C.predict,...C.play];
const browser=await chromium.launch(),out='app_src/evidence/pro-insights';mkdirSync(out,{recursive:true});
const checks=[],errors=[];
try{
 for(const width of [390,1280]){
  const c=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  await c.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));
  await c.addInitScript(()=>{localStorage.setItem('gs_sound','0');localStorage.setItem('gs_voice','0');});
  const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));
  for(const {slug} of all){
   await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);await p.waitForSelector('#loading',{state:'hidden'});
   // Renderer fixture, not a claim that this fast-forward is a completed user journey.
   await p.evaluate(()=>{ans=LESSON.steps.map(()=> 'A');finishLesson();if(recapActive)document.getElementById('skipRecap').click();});
   await p.locator('.completion-more>summary').click();
   const expected=await p.evaluate(()=>LESSON.pro),card=p.locator('[data-k=pro]');
   if(expected){
    assert.equal(await card.count(),1);assert.equal(await card.getAttribute('open'),'');
    assert((await card.locator('summary').textContent()).includes(expected.kind),slug+' attribution');
    assert((await card.innerText()).includes(expected.moment));
    assert.equal(await card.locator('.src a').getAttribute('href'),expected.url);
    await card.scrollIntoViewIfNeeded();await p.waitForTimeout(200);
    await card.screenshot({path:`${out}/${slug}-${width}.png`});
   }else{
    assert.equal(await card.count(),0);assert((await p.locator('.completion-more').textContent()).includes('Take it to court'),slug+' take-home fallback');
   }
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),slug+' fits '+width);
   const hasCue=await p.evaluate(()=>Boolean(LESSON.cue));
   assert.equal(await p.locator('#saveCue').count(),hasCue?1:0,slug+' preserves existing cue eligibility');
   if(hasCue)assert(await p.locator('#saveCue').isVisible(),slug+' retains saved cue');
   checks.push({slug,width,kind:expected?.kind||'Take it to court',source:expected?.url||null});
  }
  await c.close();
 }
 assert.equal(errors.length,0,errors.join('\n'));
 writeFileSync(out+'/checks.json',JSON.stringify({checks,errors},null,2));
 console.log(`PASS: ${checks.length} rendered completion cards/fallbacks on mobile and desktop; sources, attribution and saved-cue controls`);
}finally{await browser.close();}
