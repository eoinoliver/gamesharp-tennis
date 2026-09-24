import {execFileSync} from 'node:child_process';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const bin=process.env.GS_BROWSER_BIN||'agent-browser',base=process.argv[2]||'http://127.0.0.1:8766/';
const out=fs.mkdtempSync(path.join(os.tmpdir(),'gs-picker-'));let session;
const run=(...a)=>execFileSync(bin,['--session',session,...a],{encoding:'utf8',timeout:60000,maxBuffer:1024*1024});
const ev=b=>run('eval',`(async()=>{const wait=ms=>new Promise(r=>setTimeout(r,ms)),q=s=>document.querySelector(s),click=s=>q(s).click(),check=(v,m)=>{if(!v)throw Error(m)};${b}})()`);
console.log(out);
for(const width of (process.argv[3]||'320,430,1280').split(',').map(Number)){
 session='gs-picker-'+process.pid+'-'+width;
 try{
  run('set','viewport',String(width),'844');run('set','media','dark','reduced-motion');run('open',base);
  ev(`for(let i=0;i<100&&!window.GameSharpMainDaily;i++)await wait(100);q('[aria-label^="GAMESHARP introduction"]')?.click();await wait(1200);q('[onclick="skipWelcomeOnboarding()"]')?.click();await wait(700);const a=q('.gs-lesson-picker');check(a&&a.getBoundingClientRect().height>=44,'Chooser inaccessible');a.scrollIntoView({block:'center'});`);
  run('screenshot',path.join(out,width+'-home.png'));
  run('find','role','link','click','--name','Choose a lesson');
  ev(`for(let i=0;i<100&&!q('[data-gd-action="start"]');i++)await wait(100);check(document.querySelectorAll('[data-gd-action="start"]').length===21,'Missing lesson');check(q('.gs-gold-daily').scrollWidth<=q('.gs-gold-daily').clientWidth+1,'Overflow');`);
  run('screenshot',path.join(out,width+'-library.png'));
  ev(`const cards=[...document.querySelectorAll('[data-gd-action="start"]')].map(e=>Number(e.dataset.gdIndex));for(const index of cards){click('[data-gd-action="start"][data-gd-index="'+index+'"]');check(q('.gs-gold-daily-step-copy').textContent.includes((GameSharpGoldDaily.challenges[index].screenTitle||GameSharpGoldDaily.challenges[index].title)),'Wrong lesson');click('[data-gd-action="list"]');}click('[data-gd-action="close"]');startDailyChallenge();click('[data-gd-action="daily-start"]');click('[data-gd-action="answer"]');await wait(50);click('[data-gd-action="list"]');window.__saved=localStorage.getItem(GameSharpGoldDailyLoop.key);window.__main=localStorage.getItem(GameSharpMainDaily.key);window.__count=localStorage.getItem('gamesharp_challenges_done');click('[data-gd-action="browse-lessons"]');check(document.querySelectorAll('[data-gd-action="start"]').length===21,'Daily chooser missing');click('[data-gd-action="start"][data-gd-index="14"]');for(let i=0;i<3;i++){click('[data-gd-action="answer"]');await wait(50);click('[data-gd-action="next"]');}check(q('.gs-gold-daily-pro-story'),'Practice incomplete');check(localStorage.getItem(GameSharpGoldDailyLoop.key)===__saved,'Practice overwrote Daily checkpoint');check(localStorage.getItem(GameSharpMainDaily.key)===__main,'Practice altered history');check(localStorage.getItem('gamesharp_challenges_done')===__count,'Practice awarded credit');click('[data-gd-action="list"]');check(document.querySelectorAll('[data-gd-action="start"]').length===21,'Result lost chooser');`);
  run('screenshot',path.join(out,width+'-return.png'));
  const errors=run('errors');if(errors.trim())throw Error(errors);
  console.log(width+' PASS: all 21 selectable, practice complete, Daily preserved');
 }finally{run('close');}
}
