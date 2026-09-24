// Post-correction motion and landscape checks in a disposable profile.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const bin=process.env.GS_BROWSER_BIN||'agent-browser',out=fs.mkdtempSync(path.join(os.tmpdir(),'gs-tradeoffs-final-'));
const session='gs-tradeoffs-final-'+process.pid;
const run=(...a)=>execFileSync(bin,['--session',session,...a],{encoding:'utf8',timeout:60000,maxBuffer:1024*1024});
const ev=b=>run('eval',`(async()=>{const q=s=>document.querySelector(s),wait=ms=>new Promise(r=>setTimeout(r,ms)),click=s=>q(s).click(),check=(v,m)=>{if(!v)throw Error(m)};${b}})()`);
const shot=n=>run('screenshot',path.join(out,n+'.png'));
console.log(out);
try{
 run('set','viewport','320','844');run('set','media','dark','reduced-motion');
 run('open','http://127.0.0.1:8766/?goldDaily=1');
 ev(`for(let i=0;i<100&&!window.GameSharpGoldDaily;i++)await wait(100);`);
 const cases=process.env.GS_TRADEOFF_BRANCHES==='1'?[['gold_protect_pattern_v1',0,0],['gold_protect_pattern_v1',2,2],['gold_close_then_balance_v1',0,1],['gold_close_then_balance_v1',2,2]]:[['gold_forehand_bill_v1',2],['gold_close_then_balance_v1',1],['gold_protect_pattern_v1',2]];
 for(const [id,step,choice] of cases){
  run('set','viewport','320','844');run('set','media','dark','reduced-motion');
  ev(`GameSharpGoldDaily.open();window.__lesson=GameSharpGoldDaily.challenges.find(c=>c.id==='${id}');GameSharpGoldDaily.start(GameSharpGoldDaily.challenges.indexOf(__lesson));for(let i=0;i<${step};i++){click('[data-gd-action=answer]');await wait(60);click('[data-gd-action=next]');}localStorage.setItem('gs_sound_on','1');`);
  run('set','media','dark');
  ev(`check(!matchMedia('(prefers-reduced-motion: reduce)').matches,'Normal motion not restored');click('[data-gd-action=replay-evidence]');await wait(2650);`);shot(id+'-midflight');
  ev(`await wait(3200);`);shot(id+'-read');
  ev(`document.querySelectorAll('[data-gd-action=answer]')[${choice??'(__lesson.steps['+step+'].correct+1)%4'}].click();await wait(1000);`);shot(id+'-'+step+'-chosen-motion');
  ev(`await wait(7600);check(q('.gs-gold-daily-feedback'),'No comparison feedback');`);shot(id+'-'+step+'-compared');
  run('set','media','dark','reduced-motion');
  ev(`click('[data-gd-action=expand-evidence]');`);run('set','viewport','844','390');
  ev(`await wait(150);const b=q('.gs-gold-daily-focus-stage .gs-gold-daily-visual').getBoundingClientRect();check(b.top>=0&&b.bottom<=innerHeight+1,'Landscape clipping');check(q('.gs-gold-daily-focus-stage').querySelectorAll('svg').length===2,'Missing alternative');`);shot(id+'-landscape');
  ev(`click('[data-gd-action=close-focus]');`);console.log(id+' final motion + landscape PASS');
 }
 const errors=run('errors');if(errors.trim())throw Error(errors);
}finally{run('close');}
console.log('PASS '+out);
