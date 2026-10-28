import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_RECAP_BROWSER||'chromium';
const b=await ({chromium,webkit}[engine]).launch(),checks=[],errors=[];
const check=(v,s)=>{assert(v,s);checks.push(s);};
const dir=`app_src/evidence/recap-${engine}`;mkdirSync(dir,{recursive:true});
try{
 for(const slug of ['late-is-the-culprit','approach-volley','earned-defence','down-the-line']){
  const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true});p.on('pageerror',e=>errors.push(String(e)));
  await p.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));
  await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);
  await p.evaluate(()=>{window.__speed=24;window.__recapSeen=[];window.__voiceEvents=[];window.__recapKeys=[];const originalRun=run;run=(key,...args)=>{if(recapActive)__recapKeys.push(key);return originalRun(key,...args);};
   const complete=GSSfx.completeVoice.bind(GSSfx);GSSfx.completeVoice=()=>{__voiceEvents.push({active:recapActive,playing});return complete();};
   const caption=questionCaption;questionCaption=text=>{if(text?.startsWith('Separate read'))__recapSeen.push(text);return caption(text);};});
  for(let i=0;i<3;i++){
   await p.waitForSelector('#askOpts button:not(:disabled)');
   const pick=await p.evaluate(i=>{const S=LESSON.steps[step];return S.alsoOk?.length?S.alsoOk[0]:i===0?(S.correct+1)%S.opts.length:S.correct;},i);
   await p.locator('#askOpts button').nth(pick).tap();await p.waitForSelector('#verdict:not([hidden]) #next');await p.locator('#next').tap();
  }
  await p.waitForFunction(()=>done&&!recapActive&&!playing&&__voiceEvents.length===1,null,{timeout:60000});
  check(await p.evaluate(()=>__recapSeen.length===3&&LESSON.steps.every((s,i)=>{const own=LETTERS[s.correct]===ans[i]||(s.alsoOk||[]).includes(LETTERS.indexOf(ans[i]));return __recapSeen[i].includes(s.reveal?'Situation replay':own?'Your choice':'Better option')&&__recapKeys[i]===(s.reveal?s.scene:s.scene+(own?ans[i]:LETTERS[s.correct]));})),slug+': three honest labels and scenes, including accepted alternatives');
  check(await p.evaluate(()=>__voiceEvents[0].active===false&&__voiceEvents[0].playing===false),slug+': speech follows recap');
  const score=await p.evaluate(()=>JSON.stringify(ans));
  await p.evaluate(()=>{GSSfx.hearVoice=()=>{window.__manualVoice=(window.__manualVoice||0)+1;};});
  await p.locator('#replayRecap').tap();await p.waitForFunction(()=>recapActive&&!playing);
  check(await p.locator('#wrapup').isHidden(),slug+': written payoff waits for recap');
  await p.locator('#pauseRecap').tap();const caption=await p.locator('#questionContext').innerText();await p.waitForTimeout(3500);
  check(await p.locator('#questionContext').innerText()===caption,slug+': pause holds the coaching caption');
  await p.locator('#skipRecap').tap();await p.locator('#hearVoice').tap();await p.waitForTimeout(800);
  check(await p.evaluate(()=>!recapActive&&!playing&&__manualVoice===1),slug+': skip reveals court cue and manual voice without restarting action');
  await p.locator('#replayRecap').tap();await p.waitForFunction(()=>recapActive);await p.locator('#skipRecap').tap();
  check(await p.evaluate(()=>!recapActive&&!playing&&__voiceEvents.length===1),slug+': replay and skip do not repeat speech');
  check(await p.evaluate(()=>JSON.stringify(ans))===score,slug+': score remains original');
  await p.locator('#replayRecap').tap();
  await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
  await p.waitForTimeout(800);
  check(await p.evaluate(()=>!recapActive&&!playing&&__voiceEvents.length===1),slug+': hiding cancels motion and pending speech');
  await p.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await p.locator('#replayRecap').tap();await p.locator('#skipRecap').tap();await p.locator('#redo').tap();await p.waitForTimeout(850);
  check(await p.evaluate(()=>!done&&!recapActive&&step===0),slug+': restart cancels pending recap');
  check(errors.length===0,slug+': no browser errors');await p.close();
 }
}finally{await b.close();writeFileSync(dir+'/report.json',JSON.stringify({checks,errors},null,2));}
console.log(`PASS ${checks.length} recap checks (${engine})`);
