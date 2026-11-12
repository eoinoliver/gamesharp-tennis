// Run against a built app. Exercise close/reopen, refresh and a later calendar day
// through player controls so that a fresh read cannot replace a committed answer.
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {chromium,webkit} from 'playwright';
const base=process.argv[2], engine=process.env.GS_RETURN_BROWSER||'chromium';
const browser=await ({chromium,webkit}[engine]).launch();
const evidence='app_src/evidence/mobile-return-'+engine;
mkdirSync(evidence,{recursive:true});
try {
 const context=await browser.newContext({viewport:{width:375,height:667},hasTouch:true,reducedMotion:'reduce',timezoneId:'Australia/Sydney'});
 await context.route(/posthog\.com/,route=>route.abort());
 const errors=[];
 async function openPage(day=12){
   const page=await context.newPage();
   page.on('pageerror',error=>errors.push(String(error)));
   await page.clock.setFixedTime(new Date('2026-11-'+day+'T09:00:00+11:00'));
   return page;
 }
 let p=await openPage();
 const ready=async()=>{await p.waitForFunction(()=>window.__test);await p.locator('#loading').waitFor({state:'hidden'});};
 async function pick(index){await p.locator('#ask.on #askOpts button:not(:disabled)').nth(index).click();await p.locator('#verdict:not([hidden]) #next').waitFor();}
 await p.goto(base);await p.locator('#todayChallenge').click();await ready();
 await p.locator('#ask.on #askOpts button:not(:disabled)').first().click();
 await p.waitForFunction(()=>answered&&playing&&$('verdict').hidden);
 await p.reload();await ready();
 await p.locator('#verdict:not([hidden]) #next').waitFor();
 assert.equal(await p.locator('#count').innerText(),'1 of 3');
 assert.equal(await p.evaluate(()=>ans[0]),'A');
 const compare=await p.locator('#exploreDirected').boundingBox();
 assert(compare.y>=0&&compare.y+compare.height<=667,'Compare fits the short phone');
 await p.screenshot({path:evidence+'/compare.png'});
 await p.locator('#exploreDirected').click();await p.locator('#askOpts button').nth(2).click();
 await p.locator('#next').click();await p.close();
 p=await openPage();await p.goto(base);
 assert.match(await p.locator('#todayChallenge').innerText(),/decision 2 of 3/);
 await p.screenshot({path:evidence+'/resume.png'});
 await p.locator('#todayChallenge').click();await ready();
 assert.equal(await p.locator('#count').innerText(),'2 of 3');assert.equal(await p.locator('.gs-intro').count(),0);
 await p.reload();await ready();assert.equal(await p.locator('#count').innerText(),'2 of 3');
 await pick(0);await p.close();
 p=await openPage(13);await p.goto(base);
 assert.notEqual(await p.locator('.today').getAttribute('data-featured'),'the-winner');
 await p.goto(new URL('?all=1',base).href);
 await p.locator('a.card[href="play.html?l=the-winner"]').click();await ready();
 assert.equal(await p.locator('#count').innerText(),'3 of 3');
 await pick(2);await p.reload();await ready();
 await p.locator('#verdict:not([hidden]) #next').click();await p.locator('#dailyDone').waitFor();
 if(await p.locator('#skipRecap').isVisible())await p.locator('#skipRecap').click();
 const score=await p.evaluate(()=>GSApp.S.done['the-winner']);
 assert.equal(score.n,2);assert.equal(score.times,1);
 assert.equal(await p.evaluate(()=>GSApp.log().filter(e=>e[1]==='read').length),3);
 assert.equal(await p.locator('.daily-finish-actions #saveCue').count(),1);
 await p.locator('#saveCue').click();await p.locator('#dailyDone').click();
 // A deliberate restart must discard the earlier picks and consume the restart URL once.
 await p.locator('#todayChallenge').click();await ready();await pick(0);
 await p.goto(base);await p.getByRole('link',{name:'Start again'}).click();await ready();
 assert.equal(await p.locator('#count').innerText(),'1 of 3');assert(!p.url().includes('restart='));
 await pick(1);await p.reload();await ready();assert.equal(await p.locator('#count').innerText(),'2 of 3');
 for(const [slug,title] of Object.entries({'doubles-hold-cover':'After Your Serve','doubles-return-line':'The Early Move','doubles-lob-overhead':'A Lob Over the Net Player'})){
   await p.goto(new URL('play.html?l='+slug+'&from=my-game',base).href);await ready();
   assert.equal(await p.locator('#lessonName').innerText(),title);
   await p.locator('#ask.on').waitFor();await p.screenshot({path:evidence+'/'+slug+'.png'});
   await pick(1);
   assert.match(await p.locator('#verdict .prin').innerText(),/covering your half|read the opening|partner covers/i);
 }
 assert.deepEqual(errors,[]);await context.close();
 console.log('PASS: interrupted decisions, old first score, midnight return, explicit restart, three doubles reveals and short-phone actions ('+engine+')');
}finally{await browser.close();}
