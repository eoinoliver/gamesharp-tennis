import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_FLAGSHIP_BROWSER||'chromium';assert(base?.endsWith('/'));
const browser=await({chromium,webkit}[engine]).launch(),checks=[],errors=[];
const out=`app_src/evidence/flagship-${process.env.GS_STAGE||'local'}-${engine}`;mkdirSync(out,{recursive:true});
const check=(v,msg)=>{assert(v,msg);checks.push(msg);};
async function context(){const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});await c.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));return c;}
async function finish(p,picks){
 let i=0;while(!await p.evaluate(()=>done)){
  await p.waitForSelector('#askOpts button:not(:disabled)');const pick=picks[i]||await p.evaluate(()=>'AB'[LESSON.steps[step].correct]);
  await p.locator('#askOpts button').nth('AB'.indexOf(pick)).tap();await p.waitForSelector('#verdict:not([hidden]) #next');await p.locator('#next').tap();i++;
 }
 await p.waitForSelector('#wrapup:not([hidden]) #sharePointButton');await p.waitForFunction(()=>!playing);
}
try{
 for(const slug of ['live-point-buy-time','live-point-other-wing'])for(const picks of ['AA','AB','BA','BB']){
  const c=await context(),p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));
  await p.goto(base+'play.html?l='+slug+'&challenge=point');await p.waitForFunction(()=>window.__test);await p.waitForSelector('#loading',{state:'hidden'});
  check(await p.locator('#lessonName').innerText()==='A point for you','Challenge entry does not reveal the coaching title');
  check(await p.evaluate(()=>ans.every(a=>a==null)),'Recipient has an independent unanswered point');
  check(await p.locator('#sharePointButton').count()===0&&await p.locator('#compareRecovery').count()===0,'No payoff or comparison before commitment');
  await p.evaluate(()=>{__speed=24;window.__payoffOverlap=[];window.__watch=setInterval(()=>{if(done&&playing&&!document.getElementById('wrapup').hidden)__payoffOverlap.push(t);},20);});
  await finish(p,picks);await p.evaluate(()=>clearInterval(__watch));
  check(await p.evaluate(()=>__payoffOverlap.length===0),'Final replay precedes written payoff');
  const expected=slug==='live-point-buy-time'?(picks==='BA'?'time-used':picks==='BB'?'time-watched':picks==='AA'?'early-recovery':'recover-sooner'):(picks==='AB'?'time-used':picks==='AA'?'time-watched':picks==='BB'?'early-recovery':'recover-sooner');
  check(await p.evaluate(()=>GSSfx.voiceInfo().asset)==='live-'+expected,'Voice follows both original decisions: '+slug+'/'+picks);
  const before=await p.evaluate(()=>JSON.stringify({ans,done:GSApp.S.done}));
  await p.locator('#replayTurningPoint').tap();await p.waitForFunction(()=>!playing&&document.getElementById('recoveryComparison').textContent.startsWith('Your choice:'));
  const own=await p.evaluate(()=>({ball:SC[scene].ball[t],camera:cam,frame:t,hit:SC[scene].info.liveRecovery.theirHit,hips:actorAt(SC[scene],'you',t).pose[I.hips]}));
  check(own.frame===own.hit+18,'Own comparison holds at the declared opponent-contact event');
  await p.locator('#compareOther').tap();await p.waitForFunction(()=>!playing&&document.getElementById('recoveryComparison').textContent.startsWith('One change:'));
  const other=await p.evaluate(()=>({ball:SC[scene].ball[t],camera:cam,frame:t,hips:actorAt(SC[scene],'you',t).pose[I.hips],silent:silentPlayback}));
  check(JSON.stringify(own.ball)===JSON.stringify(other.ball)&&own.frame===other.frame,'Only recovery changes: identical ball and freeze');
  check(JSON.stringify(own.camera)===JSON.stringify(other.camera),'Comparison camera stays fixed');
  check(Math.hypot(...own.hips.map((v,i)=>v-other.hips[i]))>1.5,'Recovery creates a visible difference');
  check(other.silent&&!await p.evaluate(()=>GSSfx.voiceState().playing),'Comparison stays acoustically clear');
  check(await p.evaluate(()=>JSON.stringify({ans,done:GSApp.S.done}))===before,'Inspection cannot rescore or change the route');
  if(picks==='BA'&&slug==='live-point-buy-time'){
   for(const size of [{width:320,height:568},{width:820,height:1180},{width:1200,height:900}]){
    await p.setViewportSize(size);check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow at '+size.width);
    check(await p.locator('#compareOther').evaluate(e=>e.getBoundingClientRect().height>=44),'Comparison target stays touch sized');await p.screenshot({path:`${out}/comparison-${size.width}.png`,fullPage:true});
   }
   await p.setViewportSize({width:390,height:844});
  }
  await p.locator('#compareDone').tap();check(await p.locator('#liveCompareDock').isHidden(),'Exit restores the court cue');
  await p.evaluate(()=>Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw new DOMException('cancelled','AbortError');}}));
  await p.locator('#sharePointButton').tap();check(await p.locator('#shareStatus').innerText()==='Share cancelled.','Cancelling native share does not copy or announce success');
  check(await p.locator('#shareFallback').isHidden(),'Cancel does not force a fallback');
  await p.evaluate(()=>Object.defineProperty(navigator,'share',{configurable:true,value:undefined}));await p.locator('#sharePointButton').tap();
  const link=await p.locator('#challengeLink').inputValue(),url=new URL(link);
  check(url.origin==='https://www.gamesharptennis.com'&&url.search==='?l='+slug+'&challenge=point','Share contains only a point identifier');
  await p.screenshot({path:`${out}/${slug}-${picks}-ending.png`,fullPage:true});
  const exposures=await p.evaluate(()=>GSApp.log().filter(x=>x[1]==='live_point_comparison'));check(exposures.length===2,'Comparison exposure is recorded only at its evidence freeze: '+JSON.stringify(exposures));
  await c.close();
 }
 const c=await context(),p=await c.newPage();await p.goto(base+'?home=1');await p.waitForFunction(()=>window.GSApp);
 await p.evaluate(()=>{GSApp.startLesson('live-point-buy-time');});await p.reload();
 check(await p.locator('#livePoint').innerText().then(t=>t.includes('Return to the point')),'Unfinished point remains reachable from Home');
 await c.close();check(!errors.length,'No browser errors');
}finally{await browser.close();writeFileSync(out+'/report.json',JSON.stringify({base,engine,checks,errors},null,2));}
console.log(`PASS ${checks.length} flagship checks (${engine})`);
