// Local review only; disposable browser storage, no calendar overrides or credits.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const bin=process.env.GS_BROWSER_BIN||'agent-browser',out=fs.mkdtempSync(path.join(os.tmpdir(),'gs-high-lesson-'));
const base='http://127.0.0.1:8766/?goldDaily=high-ball';let session;
const run=(...a)=>execFileSync(bin,['--session',session,...a],{encoding:'utf8',timeout:60000,maxBuffer:1024*1024});
const ev=b=>run('eval',`(async()=>{const pause=ms=>new Promise(r=>setTimeout(r,ms));const q=s=>document.querySelector(s);const click=s=>{if(!q(s))throw Error('Missing '+s);q(s).click()};const check=(v,m)=>{if(!v)throw Error(m)};${b}})()`);
const shot=n=>run('screenshot',path.join(out,n+'.png'));
console.log('Evidence: '+out);
for(const width of (process.env.GS_HIGH_WIDTHS||'320,430,1280').split(',').map(Number)){
 session='gs-high-lesson-'+process.pid+'-'+width;
 try{
  run('set','viewport',String(width),'844');
  if(width!==320)run('set','media','dark','reduced-motion');
  if(width===430)run('network','route','**/livepoint-audio/**','--abort');
  run('open',base);
  ev(`for(let i=0;i<100&&!window.GameSharpMainDaily;i++)await pause(100);check(window.GameSharpMainDaily,'Main unavailable');window.__high=GameSharpGoldDaily.challenges.findIndex(c=>c.id==='gold_high_ball_v1');window.__before=localStorage.getItem('gamesharp_challenges_done');`);
  for(let pass=0;pass<(width===320?1:4);pass++){
   ev(`GameSharpGoldDaily.open();GameSharpGoldDaily.start(__high);`);
   for(let step=0;step<3;step++){
    ev(`await pause(${width===320?4600:50});check(q('.gs-gold-daily-option'),'Missing options');check(q('.gs-gold-daily').scrollWidth<=q('.gs-gold-daily').clientWidth+1,'Overflow');`);
    if(pass===0)shot(width+'-'+step+'-read');
    ev(`click('[data-gd-action="expand-evidence"]');await pause(${width===320?4600:50});check(q('.gs-gold-daily-shell').inert,'Focus background active');`);
    if(pass===0)shot(width+'-'+step+'-focus');
    ev(`click('[data-gd-action="close-focus"]');check(!q('.gs-gold-daily-shell').inert,'Focus trapped');click('[data-gd-action="answer"][data-gd-index="${width===320?2:pass}"]');await pause(${width===320?9100:50});`);
    shot(width+'-'+pass+'-'+step+'-answer');
    ev(`check(q('.gs-gold-daily-feedback'),'Missing payoff');check(!/NaN|undefined/.test(q('.gd-high-evidence').innerHTML),'Invalid evidence');click('[data-gd-action="replay-evidence"]');await pause(${width===320?9100:50});click('[data-gd-action="why"]');check(q('.gs-gold-daily-why').getAttribute('aria-expanded')==='true','Why failed');click('[data-gd-action="next"]');`);
   }
   ev(`check(q('.gs-gold-daily-pro-story').textContent.includes('Swiatek'),'Missing named payoff');check(localStorage.getItem('gamesharp_challenges_done')===__before,'Review changed Daily credit');check(!q('[data-gd-action="daily-practice"]'),'Invented Predict link');`);
   shot(width+'-'+pass+'-result');
  }
  if(width===430){
   ev(`GameSharpGoldDaily.start(__high);click('[data-gd-action="answer"][data-gd-index="2"]');click('[data-gd-action="expand-evidence"]');`);
   run('set','viewport','844','390');shot('landscape-comparison');
   ev(`const r=q('.gd-high-evidence').getBoundingClientRect();check(r.bottom<=innerHeight&&r.top>=0,'Landscape clipped');const frames=[...document.querySelectorAll('.gd-high-frame')];check(frames.length===2&&frames.every(f=>f.getBoundingClientRect().width>=250),'Landscape comparison unreadably small');`);
  }
  const errors=run('errors');if(errors.trim())throw Error(errors);
  console.log(width+' complete paths PASS');
 }finally{run('close');}
}
