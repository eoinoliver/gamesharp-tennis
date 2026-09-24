// Disposable review sessions. No production writes or Daily credit overrides.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const bin=process.env.GS_BROWSER_BIN||'agent-browser',out=fs.mkdtempSync(path.join(os.tmpdir(),'gs-construction-'));
let session;
const run=(...a)=>execFileSync(bin,['--session',session,...a],{encoding:'utf8',timeout:60000,maxBuffer:1024*1024});
const ev=b=>run('eval',`(async()=>{const pause=ms=>new Promise(r=>setTimeout(r,ms));const q=s=>document.querySelector(s);const click=s=>{if(!q(s))throw Error('Missing '+s);q(s).click()};const check=(v,m)=>{if(!v)throw Error(m)};${b}})()`);
const shot=n=>run('screenshot',path.join(out,n+'.png'));
console.log('Evidence: '+out);
for(const width of (process.env.GS_CONSTRUCTION_WIDTHS||'320,430,1280').split(',').map(Number)){
 session='gs-construction-'+process.pid+'-'+width;
 const reduced=width!==320;
 try{
  run('set','viewport',String(width),'844');
  if(reduced)run('set','media','dark','reduced-motion');
  if(width===430)run('network','route','**/livepoint-audio/**','--abort');
  run('open','http://127.0.0.1:8766/?goldDaily=1');
  ev(`for(let i=0;i<100&&!window.GameSharpMainDaily;i++)await pause(100);check(window.GameSharpMainDaily,'Main unavailable');window.__credit=localStorage.getItem('gamesharp_challenges_done');`);
  for(const id of (process.env.GS_CONSTRUCTION_IDS||'gold_high_ball_v1,gold_approach_volley_v1,gold_serve_adaptation_v1').split(',')){
   for(let pass=0;pass<(width===430?4:1);pass++){
    ev(`window.__challenge=GameSharpGoldDaily.challenges.find(c=>c.id==='${id}');GameSharpGoldDaily.open();GameSharpGoldDaily.start(GameSharpGoldDaily.challenges.indexOf(__challenge));`);
    for(let step=0;step<3;step++){
     const name=width+'-'+id+'-'+pass+'-'+step;
     ev(`await pause(${reduced?50:5800});check(q('.gs-gold-daily').scrollWidth<=q('.gs-gold-daily').clientWidth+1,'Horizontal overflow');`);
     if(!pass)shot(name+'-read');
     ev(`click('[data-gd-action="expand-evidence"]');await pause(${reduced?50:5800});check(q('.gs-gold-daily-shell').inert,'Focus background active');const box=q('.gs-gold-daily-focus-stage .gs-gold-daily-visual').getBoundingClientRect();check(box.top>=0&&box.bottom<=innerHeight+1,'Focus clipped');`);
     if(!pass)shot(name+'-focus');
     ev(`click('[data-gd-action="close-focus"]');click('[data-gd-action="answer"][data-gd-index="'+${width===430?pass:'((__challenge.steps['+step+'].correct+1)%4)'}+'"]');await pause(${reduced?50:9200});check(!/NaN|undefined/.test(q('.gs-gold-daily-visual-canvas').innerHTML),'Invalid visual');check(q('.gs-gold-daily-feedback'),'Missing feedback');`);
     shot(name+'-answer');
     ev(`click('[data-gd-action="expand-evidence"]');await pause(${reduced?50:9200});`);
     shot(name+'-answer-focus');
     ev(`click('[data-gd-action="close-focus"]');click('[data-gd-action="why"]');check(q('.gs-gold-daily-why').getAttribute('aria-expanded')==='true','Why failed');click('[data-gd-action="next"]');`);
    }
    ev(`check(q('.gs-gold-daily-pro-story'),'Missing professional payoff');check(!q('[data-gd-action="daily-practice"]'),'Invented Predict');check(localStorage.getItem('gamesharp_challenges_done')===__credit,'Review awarded credit');`);
    shot(width+'-'+id+'-'+pass+'-result');
   }
   console.log(width+' '+id+' complete review PASS');
  }
  const errors=run('errors');if(errors.trim())throw Error(errors);
 }finally{run('close');}
}
console.log('PASS '+out);
