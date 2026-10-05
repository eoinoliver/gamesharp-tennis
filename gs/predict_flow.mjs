// node predict_flow.mjs <page>: answer B, A, A; watch; review; watch the wrong choice
import { chromium } from 'playwright';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto(/^https?:/.test(process.argv[2])?process.argv[2]:'file://'+process.argv[2]); await p.waitForFunction(()=>window.__test,null,{timeout:20000});await p.evaluate(()=>window.__speed=8);
const log=[]; const shot=n=>p.screenshot({path:`/tmp/claude-0/shots/pf_${n}.png`});
for(const [i,c] of [[0,1],[1,2],[2,4]]){await p.waitForSelector('#ask.on',{timeout:20000});
  log.push(`read ${i+1}: `+await p.$eval('#count',e=>e.textContent)+' | '+await p.$eval('#sitTx',e=>e.textContent)); if(i==0) await shot('q1');
  await p.click(`#askOpts button:nth-child(${c})`); await p.waitForTimeout(650); await shot('pick'+i); await p.waitForTimeout(600);}
await shot('watch0'); log.push('watch: '+await p.$eval('#count',e=>e.textContent));
for(let k=0;k<60;k++){await p.waitForTimeout(500); const ink=await p.$eval('#ink',e=>e.textContent); if(ink&&!log.includes('chip '+ink)){log.push('chip '+ink); await shot('chip'+log.length);} if(!(await p.$eval('#wrapup',e=>e.hidden))) break;}
log.push('review shown: '+!(await p.$eval('#wrapup',e=>e.hidden)));
await p.screenshot({path:'/tmp/claude-0/shots/pf_review.png',fullPage:true});
const w=await p.$$('[data-watch]'); log.push('watch buttons: '+w.length); if(w.length){await w[0].click(); await p.waitForTimeout(3000); log.push('after watch: '+await p.evaluate(()=>JSON.stringify(__test.state())));}
console.log(log.join('\n')); console.log('errors',JSON.stringify(errs)); await b.close();
