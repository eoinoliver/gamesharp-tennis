// Exercise the real Contact Clue review flow; local/Preview only (never production analytics).
import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2]||'http://127.0.0.1:8771/';
if(new URL(base).hostname==='www.gamesharptennis.com'||new URL(base).hostname==='gamesharptennis.com')throw Error('Use local or Preview');
const out='app_src/evidence/contact-focus';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const checks=[],errors=[];const check=(v,m)=>{checks.push({ok:!!v,message:m});if(!v)throw Error(m);};
const ready=p=>p.waitForSelector('#ask.on #askOpts button:not([disabled])',{timeout:20000});
const verdict=p=>p.waitForSelector('#inspectContact',{timeout:20000});
try{
 for(const size of [{width:375,height:667},{width:430,height:932},{width:1280,height:900}]){
  const context=await browser.newContext({viewport:size,reducedMotion:size.width===430?'reduce':'no-preference'});
  const p=await context.newPage();p.on('pageerror',e=>errors.push(String(e)));
  await p.goto(base+'play.html?l=contact-clue&contactFocus=1');await p.waitForFunction(()=>window.__test);await p.evaluate(()=>window.__speed=25);
  for(let i=0;i<3;i++){
   await ready(p);check(await p.locator('[data-contact-evidence]').count()===0,`${size.width} step ${i+1}: no pre-answer highlight`);
   check(await p.locator('#contactControls').count()===0,`${size.width} step ${i+1}: no pre-answer comparison`);
   const before=await p.evaluate(()=>({frame:t,freeze:SC[scene].info.freeze,close:contactMix(),ans:[...ans]}));
   check(before.frame===before.freeze&&before.close===1,`${size.width} step ${i+1}: held at actual contact`);
   await p.screenshot({path:`${out}/${size.width}-step-${i+1}-question.png`});
   const pick=await p.evaluate(()=>{const S=LESSON.steps[step];return step===0?(S.correct+1)%4:S.correct;});
   await p.locator('#askOpts button').nth(pick).click();await verdict(p);
   const first=await p.evaluate(()=>JSON.stringify(ans));
   await p.locator('#inspectContact').click();
   await p.waitForSelector('[data-contact-evidence]');
   const a=await p.evaluate(()=>({t,playing,frame:contactInspection.frame,focus:document.activeElement.dataset.contact}));
   check(a.t===before.freeze&&!a.playing&&a.focus==='first',`${size.width} step ${i+1}: inspection holds evidence and focuses controls`);
   await p.screenshot({path:`${out}/${size.width}-step-${i+1}-first.png`});
   await p.locator('[data-contact=next]').click();
   check(await p.evaluate(()=>t===contactsOf(SC[scene],'you').at(-1)&&document.activeElement.dataset.contact==='next'),`${size.width} step ${i+1}: next sample is the actual selected contact`);
   check(await p.evaluate(()=>JSON.stringify(ans))===first,`${size.width} step ${i+1}: inspection cannot rewrite first answer`);
   await p.screenshot({path:`${out}/${size.width}-step-${i+1}-next.png`});
   await p.keyboard.press('Escape');check(await p.locator('#contactControls').count()===0,`${size.width} step ${i+1}: Escape closes inspection`);
   await p.locator('#inspectContact').click();await p.locator('[data-contact=outcome]').click();
   check(await p.locator('#contactControls').count()===0,`${size.width} step ${i+1}: result exits inspection`);
   await p.locator('#again').click();await p.waitForFunction(()=>!playing&&t===stopAt);
   check(await p.evaluate(()=>JSON.stringify(ans))===first,`${size.width} step ${i+1}: Replay preserves first answer`);
   const next=await p.locator('#next').boundingBox();check(next&&next.y+next.height<=size.height+2,`${size.width} step ${i+1}: Next stays on screen`);
   await p.locator('#next').click();
  }
  await p.waitForSelector('#wrapup:not([hidden]) #saveCue');await p.locator('#saveCue').click();
  check(await p.evaluate(()=>JSON.parse(localStorage.getItem('gs_my_game')).some(c=>c.cue===LESSON.cue)),`${size.width}: existing cue saves`);
  check(await p.evaluate(()=>GSApp.S.done['contact-clue'].n)===2,`${size.width}: first wrong answer still counts after comparison/replay`);
  check(await p.locator('#contactControls').count()===0,`${size.width}: completion clears comparison`);
  await context.close();
 }
 // All 12 authored options: inspect selected contact and preserve each first result.
 const p=await browser.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errors.push(String(e)));
 await p.goto(base+'play.html?l=contact-clue&contactFocus=1');await p.waitForFunction(()=>window.__test);await p.evaluate(()=>window.__speed=40);
 for(let i=0;i<3;i++)for(let j=0;j<4;j++){
  await p.evaluate(i=>{ans=[null,null,null];startStep(i);},i);await ready(p);await p.locator('#askOpts button').nth(j).click();await verdict(p);
  await p.locator('#inspectContact').click();await p.locator('[data-contact=next]').click();
  check(await p.evaluate(({i,j})=>ans[i]==='ABCD'[j]&&contactInspection.key===LESSON.steps[i].scene+'ABCD'[j]&&Number.isFinite(t),{i,j}),`branch ${i+1}${'ABCD'[j]}: correct selected sample and immutable answer`);
 }
 await p.close();
 // Explicit opt-in: default lesson and unrelated lessons do not mount the treatment.
 for(const suffix of ['play.html?l=contact-clue','play.html?l=the-line&contactFocus=1']){
  const p=await browser.newPage();await p.goto(base+suffix);await p.waitForFunction(()=>window.__test);
  check(await p.evaluate(()=>!CONTACT_FOCUS&&!document.querySelector('.contact-focus')&&!document.getElementById('contactMode')),suffix+': treatment absent');await p.close();
 }
 check(errors.length===0,'No page errors');
}finally{await browser.close();writeFileSync(`${out}/report.json`,JSON.stringify({checks,errors},null,2));}
console.log(`PASS ${checks.length} Contact Clue checks`);
