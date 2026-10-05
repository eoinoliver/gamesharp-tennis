// node payoff_check.mjs <base>: every daily lesson's wrap-up renders its payoff (Pro Lens open or take-home, Coach's Corner, cue) with no errors
import { chromium } from 'playwright';
const base=process.argv[2]||'http://localhost:8765/';
const cat=await (await fetch(base+'catalog.js')).text(); const C=JSON.parse(cat.match(/GS_CATALOG=(.*);\n/)[1]);
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0;
for(const l of C.daily){const p=await b.newPage({viewport:{width:390,height:844}}); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
 await p.goto(base+'play.html?l='+l.slug); await p.waitForFunction(()=>typeof LESSON!=='undefined'&&typeof finishLesson==='function',null,{timeout:20000}); await p.waitForTimeout(400);
 const r=await p.evaluate(()=>{ans=LESSON.steps.map(()=> 'A'); finishLesson(); const w=document.getElementById('wrapup');
   return {pro:!!LESSON.pro, proOpen:w.querySelectorAll('details.pay[data-k=pro][open]').length, take:/take it to court/i.test(w.innerText), drill:w.querySelectorAll('details.pay[data-k=drill]').length, cue:!!w.querySelector('#saveCue'), credit:/Tennis-MoCap/.test(w.innerText),
     links:[...w.querySelectorAll('.src a')].map(a=>a.href)};});
 const ok=(r.pro?r.proOpen===1&&!r.take:r.take)&&r.drill===1&&r.cue&&!r.credit&&!errs.length;
 if(!ok)fails++; console.log((ok?'ok   ':'FAIL ')+l.slug, JSON.stringify({pro:r.pro,take:r.take,drill:r.drill,cue:r.cue}), errs.join('|')); await p.close();}
await b.close(); console.log(fails?'PAYOFF FAILED':'PAYOFF PASSED'); process.exit(fails?1:0);
