// Targeted trust regressions. Reading timers run at their real speed.
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_MOBILE_BROWSER||'chromium';
assert(base?.endsWith('/'));
const browser=await ({chromium,webkit}[engine]).launch(),checks=[],errors=[];
const out=`app_src/evidence/mobile-learning-${engine}`;mkdirSync(out,{recursive:true});
const check=(v,msg)=>{assert(v,msg);checks.push(msg);};
const ctx=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
await ctx.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));
const p=await ctx.newPage();p.setDefaultTimeout(60000);p.on('pageerror',e=>errors.push(String(e)));
async function open(slug){await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);}
async function answer(){await p.waitForSelector('#askOpts button:not(:disabled)');await p.locator('#askOpts button').nth(await p.evaluate(()=>LESSON.steps[step].correct)).tap();}
try{
 await open('predict-the-point');
 await p.evaluate(()=>{window.__chips=[];window.__overlap=[];const samples=()=>{if(document.getElementById('count').textContent==='Worked example'){
 const words=document.querySelectorAll('#sitTx .w.on').length;if(playing&&words)__overlap.push({t,words});
 if(!playing&&words&&(!__chips.length||__chips.at(-1).frame!==t))__chips.push({frame:t,text:document.getElementById('sitTx').textContent});
 }};window.__watchTimer=setInterval(samples,25);});
 for(let i=0;i<3;i++){await answer();await p.waitForFunction(i=>step!==i,i);}
 await p.waitForFunction(()=>done);await p.evaluate(()=>clearInterval(__watchTimer));
 const prediction=await p.evaluate(()=>({chips:__chips,overlap:__overlap,ends:[...LESSON.predict.reads.slice(1).map(r=>typeof r==='string'?SC[r].info.freeze:r),SC[LESSON.finaleScene].frames-1]}));
 check(prediction.overlap.length===0,'Predict never reveals explanation words during worked-example motion');
 check(prediction.chips.length===3,'Predict holds each of three explanations after its evidence');
 check(prediction.chips.every((c,i)=>c.frame===prediction.ends[i]),'Predict explanations use the next evidence endpoint, not a pre-shot freeze');
 await p.screenshot({path:out+'/predict-ending.png',fullPage:true});
 await open('saturday-point-1');await p.evaluate(()=>window.__speed=24);
 await answer();await p.waitForSelector('#verdict:not([hidden]) #next');const first=await p.evaluate(()=>step);
 await p.waitForTimeout(2600);check(await p.evaluate(()=>step)===first,'Correct Saturday feedback waits for the learner');
 await p.locator('#next').tap();
 await open('short-ball');await p.evaluate(()=>window.__speed=24);
 while(!await p.evaluate(()=>done)){await answer();await p.waitForSelector('#verdict:not([hidden]) #next');await p.locator('#next').tap();}
 await p.waitForFunction(()=>recapActive&&!!recapAdvance);
 const held=await p.locator('#questionContext').innerText();await p.waitForTimeout(1800);
 check(await p.locator('#questionContext').innerText()===held,'Recap teaching caption is still readable after 1.8 seconds');
 await p.locator('#pauseRecap').tap();const paused=await p.locator('#questionContext').innerText();await p.waitForTimeout(3500);
 check(await p.locator('#questionContext').innerText()===paused,'Paused recap holds its caption beyond the normal advance time');
 for(const size of [{width:320,height:568},{width:430,height:932},{width:820,height:1180}]){
  await p.setViewportSize(size);await p.evaluate(()=>window.scrollTo(0,0));
  check(await p.evaluate(()=>{const r=document.getElementById('skipRecap').getBoundingClientRect();return r.top>=document.getElementById('stage').getBoundingClientRect().bottom&&r.bottom<=innerHeight&&r.width>=44&&r.height>=44;}),`Recap skip is visible and touch-sized at ${size.width}`);
  check(await p.evaluate(()=>document.getElementById('tools').getBoundingClientRect().bottom<=document.getElementById('recapDock').getBoundingClientRect().top),`Playback tools do not overlap recap controls at ${size.width}`);
  check(await p.locator('#wrapup').isHidden(),`Payoff stays out of the recap's way at ${size.width}`);
  check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No horizontal overflow at ${size.width}`);
  await p.screenshot({path:`${out}/recap-${size.width}.png`});
 }
 await p.setViewportSize({width:375,height:667});await p.locator('#skipRecap').tap();
 check(await p.evaluate(()=>!playing&&!recapActive),'Skip cannot restart motion through the stage click handler');
 check(await p.evaluate(()=>document.querySelector('#wrapup').firstElementChild.nextElementSibling.classList.contains('gs-continue')),'Next challenge sits immediately after the court cue');
 await p.screenshot({path:out+'/daily-ending.png',fullPage:true});
 await p.locator('#nextDaily').tap();await p.waitForFunction(()=>window.__test);await p.locator('#close').tap();await p.waitForURL(/\?home=1/);
 check(!p.url().includes('play.html'),'Closing the next challenge returns Home, not the previous lesson');
 await p.evaluate(()=>{const s=GSApp.S,slug='live-point-buy-time';s.done[slug]={n:2,best:2,total:2,times:1,first:'2026-10-27',last:'2026-10-27'};s.seen||={};s.seen[slug]=1;localStorage.setItem('gs6',JSON.stringify(s));});
 await p.reload();await p.waitForFunction(()=>window.GSApp);
 check(await p.locator('body').innerText().then(s=>s.toLowerCase().includes('up to 4 decisions')&&s.includes('Earlier edition: 2 of 2 best · saved')),'Home labels the updated four-decision edition and preserves the old 2/2');
 check(await p.evaluate(()=>!GSApp.S.done['live-point-buy-time']&&GSApp.previousEdition('live-point-buy-time').done.total===2),'Earlier completion is archived without relabelling its denominator');
 await p.screenshot({path:out+'/updated-home.png',fullPage:true});
 await open('late-is-the-culprit');await p.evaluate(()=>{__speed=24;startStep(2)});await p.waitForSelector('#askOpts button:not(:disabled)');
 check(await p.evaluate(()=>cam.az===-140),'Backhand contact uses its reviewed side-rear camera by default');
 for(const size of [{width:375,height:667},{width:820,height:1180},{width:1200,height:900}]){await p.setViewportSize(size);await p.screenshot({path:`${out}/backhand-${size.width}.png`,fullPage:true});}
 check(errors.length===0,'No browser errors');
}finally{await browser.close();writeFileSync(out+'/report.json',JSON.stringify({base,engine,checks,errors},null,2));}
console.log(`PASS ${checks.length} mobile learning checks (${engine})`);
