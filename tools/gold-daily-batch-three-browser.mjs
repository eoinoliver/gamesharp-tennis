// Owned browser profiles only. Date overrides and storage belong to test data.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const bin=process.env.GS_BROWSER_BIN||'agent-browser',base=process.argv[2]||'http://127.0.0.1:8766/index.html';
const widths=(process.argv[3]||'320,430,1280').split(',').map(Number);
const compact=process.env.GS_BATCH_COMPACT==='1',audio=process.env.GS_BATCH_AUDIO||'off';
const dates=(process.env.GS_BATCH_DATES||'2026-09-21,2026-09-23,2026-09-25').split(',');
const out=fs.mkdtempSync(path.join(os.tmpdir(),'gs-batch-three-'));
let session;
const run=(...args)=>execFileSync(bin,['--session',session,...args],{encoding:'utf8',timeout:60000,maxBuffer:1024*1024});
const ev=body=>run('eval',`(async()=>{const pause=ms=>new Promise(r=>setTimeout(r,ms));const click=s=>{const e=document.querySelector(s);if(!e)throw Error('Missing '+s);e.click()};const check=(v,m)=>{if(!v)throw Error(m)};${body}})()`);
const shot=name=>run('screenshot',path.join(out,name+'.png'));
const rows=[];console.log('Evidence: '+out);
for(const width of widths){
  const reduced=width===430||process.env.GS_BATCH_REDUCED==='1';
  session='gs-batch-'+process.pid+'-'+width;
  try{
    run('set','viewport',String(width),'844');
    if(reduced)run('set','media','dark','reduced-motion');
    if(audio==='blocked')run('network','route','**/livepoint-audio/**','--abort');
    run('open',base);
    if(audio!=='off'){ev(`localStorage.setItem('gs_sound_on','1');`);run('open',base);}
    ev(`for(let i=0;i<100&&!window.GameSharpMainDaily;i++)await pause(100);check(window.GameSharpMainDaily,'Main unavailable');localStorage.setItem('gs_sound_on','${audio==='off'?'0':'1'}');window.__batchErrors=[];addEventListener('error',e=>__batchErrors.push(e.message));window.__batchRealDate=Date;`);
    for(const [n,date]of dates.entries()){
      ev(`window.Date=class extends __batchRealDate{constructor(...a){super(...(a.length?a:['${date}T12:00:00']))}};GameSharpGoldDaily.close();GameSharpMainDaily.refreshHome();click('.gs-daily-card-hit');click('[data-gd-action="daily-start"]');`);
      const id=ev(`return GameSharpGoldDailyLoop.lessonFor('${date}');`).trim();
      for(let step=0;step<3;step++){
        const label=width+'-'+n+'-'+step;
        if(!compact){ev(`await pause(${reduced?100:500});`);shot(label+'-motion');}
        ev(`await pause(${reduced?100:Number(process.env.GS_BATCH_READ_MS)||3300});`);shot(label+'-read');
        if(step===0){ev(`click('[data-gd-action="expand-evidence"]');`);shot(label+'-focus');ev(`click('[data-gd-action="close-focus"]');`);}
        ev(`const c=GameSharpGoldDaily.challenges.find(c=>c.id===GameSharpGoldDailyLoop.lessonFor('${date}')),best=c.steps[${step}].correct;click('[data-gd-action="answer"][data-gd-index="'+${width===320||process.env.GS_BATCH_WRONG==='1'?'((best+1)%4)':'best'}+'"]');await pause(${reduced?100:1200});`);
        if(!compact)shot(label+'-chosen');
        ev(`await pause(${reduced?100:Number(process.env.GS_BATCH_ANSWER_MS)||3200});`);shot(label+'-settled');
        if(step===2){ev(`click('[data-gd-action="expand-evidence"]');`);shot(label+'-answered-focus');ev(`click('[data-gd-action="close-focus"]');`);}
        ev(`const el=document.querySelector('.gs-gold-daily');check(el.scrollWidth<=el.clientWidth+1,'Horizontal overflow');click('[data-gd-action="next"]');`);
      }
      shot(width+'-'+n+'-result');
      ev(`for(let i=0;i<100&&!GameSharpMainDaily.completed('${date}');i++)await pause(50);check(GameSharpMainDaily.completed('${date}'),'Missing completion');check(!document.querySelector('[data-gd-action="daily-practice"]'),'Invented Predict route');check(localStorage.getItem('gamesharp_challenges_done')==='${n+1}','Duplicate credit');click('[data-gd-action="daily-sharpen"]');check(document.querySelector('#gspcOverlay.open'),'Missing Sharpen');`);
      shot(width+'-'+n+'-sharpen');
      ev(`click('#gspcOverlay .gspc-close');await pause(100);check(document.querySelector('[data-gd-action="daily-start"]'),'Lost origin');check(!__batchErrors.length,__batchErrors.join(','));`);
      rows.push({width,date,id,status:'PASS'});fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(rows,null,2));console.log(width+' '+date+' PASS');
    }
    const errors=run('errors');if(errors.trim())throw Error(errors);
  }finally{run('close');}
}
console.log(JSON.stringify({out,passed:rows.length}));
