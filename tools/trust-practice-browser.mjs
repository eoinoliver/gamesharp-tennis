import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_TRUST_BROWSER||'chromium';
assert(base?.endsWith('/'));const browser=await ({chromium,webkit}[engine]).launch();
const out=`app_src/evidence/trust-practice-${engine}`;mkdirSync(out,{recursive:true});
const checks=[],errors=[];const check=(ok,label)=>{assert(ok,label);checks.push(label);};
async function page(width=390){const p=await browser.newPage({viewport:{width,height:width<700?844:900},hasTouch:width<700});p.on('pageerror',e=>errors.push(String(e)));await p.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));return p;}
async function finish(p,slug){await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);await p.evaluate(()=>window.__speed=20);for(let i=0;i<6&&!await p.evaluate(()=>done);i++){await p.waitForSelector('#askOpts button:not(:disabled)');const correct=await p.evaluate(()=>LESSON.steps[step].correct);await p.locator('#askOpts button').nth(correct).click();await p.locator('#verdict:not([hidden]) #next').waitFor();await p.locator('#next').click();}await p.locator('#progressStorage').waitFor();}
try{
 for(const width of [320,390,1280]){
  const p=await page(width);await p.goto(base+'?all=1');check(await p.locator('.activity-group .card').count()===63,width+': 57 original activities plus six doubles points appear once');
  await p.getByRole('link',{name:'Live Points',exact:true}).click();await p.waitForURL(/kind=live/);await p.waitForFunction(()=>document.querySelectorAll('.activity-group .card').length===23);check(await p.locator('.activity-group .card').count()===23,width+': Live Point filter retains all 16 connected points and seven longer points');
  await p.goto(base+'?review=1');check(await p.locator('.sh-my-entry[href="?review=1&z=my-game"]').isVisible(),width+': My Game is prominent');
  const coverage=await p.evaluate(()=>{const mapped=new Set(GS_SHARPEN.ZONES.flatMap(z=>z.items.flatMap(([,ls])=>ls)));const expected=GSApp.CAT.daily.concat(GSApp.CAT.play.filter(l=>l.livePoint)).map(l=>l.slug);return {size:mapped.size,missing:expected.filter(s=>!mapped.has(s)),extra:[...mapped].filter(s=>!expected.includes(s))};});check(coverage.size===54&&!coverage.missing.length&&!coverage.extra.length,width+': all 32 Daily, 16 singles and six doubles points are mapped exactly');
  check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),width+': Sharpen fits');
  await p.screenshot({path:`${out}/sharpen-${width}.png`,fullPage:true});
  await p.getByRole('link',{name:/^Net Approaching/}).click();await p.waitForURL(/z=net/);await p.getByRole('link',{name:/^A dipping first volley/}).click();await p.waitForURL(/l=live-point-volley-build/);await p.waitForFunction(()=>window.__test);
  check(new URL(p.url()).searchParams.get('l')==='live-point-volley-build',width+': symptom leads to its Live Point');
  await finish(p,'live-point-volley-build');check(await p.locator('#saveCue').isVisible(),width+': save cue is outside collapsed panels');
  check(await p.locator('.gsfb').isVisible(),width+': useful question is visible');check(await p.locator('#returnRead').isVisible(),width+': paired read is visible');
  const variation=await p.evaluate(()=>GSApp.invitation(GSApp.bySlug(GSApp.bySlug('live-point-volley-build').followup)).setup);
  check(!(await p.locator('#returnRead').innerText()).includes(variation),width+': tomorrow’s changed situation is withheld until due');
  const detail=await p.evaluate(()=>LESSON.steps[0].lines[LETTERS[LESSON.steps[0].correct]]);check((await p.locator('#liveEvidence').innerText()).includes(detail),width+': completion describes the committed choice');
  await p.locator('#saveCue').click();check((await p.locator('#saveCue').innerText()).includes('Saved in this browser'),width+': save acknowledged accurately');
  await p.screenshot({path:`${out}/completion-${width}.png`,fullPage:true});
  await p.getByRole('link',{name:'My Game →',exact:true}).click();await p.waitForURL(/z=my-game/);await p.locator('.sh-practice').waitFor();check(await p.locator('.sh-practice').count()===1,width+': cue retrieved');
  await p.locator('.sh-practice summary').click();check((await p.locator('.sh-practice').innerText()).includes('Two-ball read'),width+': saved cue includes drill');
  await p.getByRole('link',{name:'Replay the point →'}).click();await p.waitForURL(/l=live-point-volley-build/);check(new URL(p.url()).searchParams.get('l')==='live-point-volley-build',width+': saved cue reopens original point');
  await p.goto(base+'?review=1&z=my-game');await p.evaluate(()=>{const ls=GSApp.CAT.daily.slice(0,14);localStorage.setItem('gs_my_game',JSON.stringify(ls.map(l=>({lesson:l.title,cue:l.slug==='answer-the-drop'?'Get there, look up, go deep.':l.cue,saved_at:1}))));});await p.reload();
  check(await p.locator('.sh-practice').count()===14,width+': fourteen legacy cues all remain available');check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),width+': saved practice fits');
  await p.screenshot({path:`${out}/my-game-${width}.png`,fullPage:true});await p.close();
 }
 const p=await page();await p.goto(base+'?home=1');await p.evaluate(()=>{for(const l of GSApp.CAT.daily.concat(GSApp.CAT.play.filter(l=>l.livePoint&&!l.transferOf)))GSApp.complete(l.slug,2,2);});await p.reload();
 check(/complete/i.test(await p.locator('.today').innerText()),'completed featured daily remains complete when the personal queue is exhausted');check(await p.locator('.home-play a').count()===2,'singles and doubles stay available after the daily collection is played');check(!(await p.locator('#main').innerText()).includes("played every lesson"),'no whole-app completion claim');await p.close();
 const fail=await page();await fail.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Full','QuotaExceededError');};});await finish(fail,'live-point-volley-build');
 check((await fail.locator('#progressStorage').innerText()).includes('could not be saved'),'failed progress write is disclosed');await fail.locator('#saveCue').click();check((await fail.locator('#cueSaveStatus').innerText()).includes('Could not save'),'failed cue write is disclosed');check(!(await fail.locator('#saveCue').innerText()).includes('Saved'),'failed cue does not claim success');
 await fail.locator('[data-u="no"]').click();await fail.locator('textarea').fill('The volley could be clearer.');await fail.locator('#fbsend').click();await fail.waitForFunction(()=>document.querySelector('#fbstatus')?.textContent.includes('Preview:'));check(await fail.locator('textarea').inputValue()==='The volley could be clearer.','preview feedback keeps comment and explains non-delivery');await fail.close();
 // Serve the built local artifact on an isolated production-origin test page.
 // No request reaches production and no QA feedback reaches analytics.
 const delivery=await page();let accept=false;
 await delivery.route('https://www.gamesharptennis.com/**',async r=>{const u=new URL(r.request().url());await r.fulfill({response:await r.fetch({url:base+u.pathname.slice(1)+u.search})});});
 await delivery.route(/posthog\.com\//,r=>r.fulfill({status:accept?200:503,body:'{}'}));
 await delivery.goto('https://www.gamesharptennis.com/?home=1');
 check(await delivery.evaluate(()=>GSApp.feedback('short-ball','no','Retain this'))===false,'HTTP rejection is not a feedback acknowledgement');check(await delivery.evaluate(()=>!GSApp.S.fb['short-ball']),'rejected feedback does not suppress another attempt');accept=true;
 check(await delivery.evaluate(()=>GSApp.feedback('short-ball','yes','Received'))===true,'successful HTTP acknowledgement marks feedback received');await delivery.close();
 check(!errors.length,'no page errors');
}finally{await browser.close();writeFileSync(out+'/report.json',JSON.stringify({checks,errors},null,2));}
console.log(`PASS ${checks.length} trust and practice checks (${engine})`);
