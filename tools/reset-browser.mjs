import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2]||'http://127.0.0.1:8766/',engine=process.env.GS_LIVE_BROWSER||'chromium';
const browser=await ({chromium,webkit}[engine]).launch(),checks=[],errors=[],dir=`app_src/evidence/reset/${process.env.GS_STAGE||'local'}-${engine}`;mkdirSync(dir,{recursive:true});
const check=(ok,name)=>{assert(ok,name);checks.push(name);};
try{
 for(const width of [390,1280]){
  const c=await browser.newContext({viewport:{width,height:width<500?844:900},reducedMotion:'reduce'});await c.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));
  await c.addInitScript(()=>{localStorage.setItem('gs_sound','0');localStorage.setItem('gs_voice','0');window.__spoken=[];const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){__spoken.push(this.src);return play.call(this);};});
  const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));
  await p.goto(base+'?review=1');await p.getByRole('link',{name:/^Reset After/}).click();await p.locator('.reset-list').waitFor();check(await p.locator('.reset-list a').count()===3,'three Reset situations');
  for(const id of ['mistake','pressure','partner']){
   await p.goto(base+'?review=1&z=reset&r='+id);const before=await p.evaluate(()=>JSON.stringify(GSApp.S.done));
   check(await p.locator('#resetIntention option').count()===3,id+' has usable intentions');
   await p.locator('#resetIntention').selectOption({index:1});const intention=await p.locator('#resetIntention').inputValue();await p.locator('#resetSave').click();check((await p.locator('#resetStatus').innerText()).includes('saved in this browser'),id+' save acknowledged');
   await p.reload();check(await p.locator('#resetIntention').inputValue()===intention,id+' reminder persists');
   await p.locator('#resetStart').click();check(await p.locator('#resetGuide').isVisible(),id+' guide begins');await p.locator('#resetPause').click();const value=await p.locator('progress').getAttribute('value');await p.waitForTimeout(250);check(await p.locator('progress').getAttribute('value')===value,id+' pause holds progress');
   await p.locator('#resetPause').click();await p.locator('#resetNext').click();check((await p.locator('#resetChosen').innerText()).includes(intention),id+' chosen intention appears');await p.locator('#resetNext').click();await p.locator('#resetNext').click();
   check(await p.locator('#resetFinish').isVisible(),id+' guide finishes');check(await p.evaluate(()=>JSON.parse(localStorage.getItem('gs_reset_v1')).lastRehearsal?.id)!==id,id+' watching guide never claims rehearsal');
   check(await p.evaluate(()=>__spoken.length)===0,id+' sound and voice opt-outs retained');await p.locator('#resetConfirm').click();check(await p.evaluate(()=>JSON.parse(localStorage.getItem('gs_reset_v1')).lastRehearsal.evidence)==='self_report',id+' rehearsal explicitly self-reported');
   check(await p.evaluate(()=>JSON.stringify(GSApp.S.done))===before,id+' no lesson score invented');check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),id+' fits '+width);
   await p.screenshot({path:`${dir}/${id}-${width}.png`,fullPage:true});await p.goto(base+'?review=1&z=my-game');check((await p.locator('.reset-reminder').innerText()).includes(intention),id+' reminder in My Game');
  }
  await p.goto(base+'?review=1&z=reset&r=mistake');await p.evaluate(()=>localStorage.setItem('gs_reset_v1','{"v":99,"private":"preserve"}'));await p.reload();await p.locator('#resetSave').click();check(await p.evaluate(()=>localStorage.getItem('gs_reset_v1'))==='{"v":99,"private":"preserve"}','unknown schema preserved');check((await p.locator('#resetStatus').innerText()).includes('Could not verify'),'no false save');
  await c.close();
 }
 // Real timed playback: the three recordings start once in the matching phases.
 const c=await browser.newContext({viewport:{width:390,height:844}}),p=await c.newPage();await c.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));
 await c.addInitScript(()=>{window.__spoken=[];const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){const result=play.call(this);result.then(()=>__spoken.push(this.src));return result;};});
 await p.goto(base+'?review=1&z=reset&r=pressure');await p.locator('#resetStart').click();await p.waitForSelector('#resetFinish:not([hidden])',{timeout:23000});
 const spoken=await p.evaluate(()=>__spoken);check(spoken.length===3&&['release','choose','commit'].every((x,i)=>spoken[i].includes('voice-reset-'+x)),'three real recordings follow the timed phases');
 check(await p.evaluate(()=>!localStorage.getItem('gs_reset_v1')),'timed routine never saves practice automatically');await c.close();
 check(!errors.length,errors.join('\n'));
}finally{writeFileSync(dir+'/report.json',JSON.stringify({checks,errors},null,2));await browser.close();}
console.log('PASS',checks.length,'Reset checks');
