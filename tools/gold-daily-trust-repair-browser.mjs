// Disposable browser state; exercises the failure classes found by the three-lens audit.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const bin=process.env.GS_BROWSER_BIN||'agent-browser',base=process.argv[2]||'http://127.0.0.1:8766/',session='gs-trust-'+process.pid;
const out=fs.mkdtempSync(path.join(os.tmpdir(),'gs-trust-repair-'));
const run=(...a)=>execFileSync(bin,['--session',session,...a],{encoding:'utf8',timeout:60000,maxBuffer:2e6});
const ev=b=>run('eval',`(async()=>{const q=s=>document.querySelector(s),pause=ms=>new Promise(r=>setTimeout(r,ms)),check=(v,m)=>{if(!v)throw Error(m)},click=s=>{check(q(s),'Missing '+s);q(s).click()};${b}})()`);
const shot=n=>run('screenshot',path.join(out,n+'.png'));
console.log('Evidence: '+out);
try{
 run('set','viewport','390','844');run('open',base+'?goldDaily=1');run('snapshot','-i');
 ev(`for(let i=0;i<100&&!window.GameSharpMainDaily;i++)await pause(100);check(window.GameSharpMainDaily,'Missing engine');`);
 if (!process.env.GS_FOCUS_ONLY) {
 // Actual pointer event sequence inside one browser task, before evidence ends.
 ev(`GameSharpGoldDaily.start(4);await pause(100);q('.gs-gold-daily-coach-setup').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'touch'}));check(!q('.gs-gold-daily-visual').classList.contains('is-motion-finished'),'Incidental touch skipped evidence');`);
 ev(`click('[data-gd-action="answer"][data-gd-index="0"]');check(q('.gs-gold-daily-sr').textContent==='','Premature announcement');await pause(100);check(q('.gs-gold-daily-sr').textContent==='','Early announcement');const delay=parseFloat(q('.gs-gold-daily-step').style.getPropertyValue('--gd-payoff-delay'));await pause(delay*1000+250);check(q('.gs-gold-daily-sr').textContent.length>0,'Missing payoff announcement');click('[data-gd-action="replay-evidence"]');check(q('.gs-gold-daily-sr').textContent==='','Replay retained announcement');await pause(delay*1000+250);check(q('.gs-gold-daily-sr').textContent.length>0,'Replay announcement missing');`);
 console.log('Touch / timed announcements / replay PASS');
 // Every alternative of Return Position, normal motion. Arrival events and
 // settled evidence are checked separately from quiz success.
 for(let option=0;option<4;option++){
  ev(`GameSharpGoldDaily.start(6);`);
  for(let step=0;step<3;step++){
   ev(`await pause(3200);const s=GameSharpGoldDaily.challenges[6].steps[${step}];click('[data-gd-action="answer"][data-gd-index="${option}"]');const a=[...document.querySelectorAll('[data-arrival]')].map(e=>Number(e.dataset.arrival));check(a.length===2,'Missing compared arrivals');check((a[1]>a[0])===(s.visual.referenceContact[1]>s.visual.contact[1]),'Wrong arrival order');await pause(3300);`);
   if(option===0)shot('return-'+step);
   ev(`click('[data-gd-action="next"]');`);
  }
 }
 console.log('Return: all 12 answers / normal motion PASS');
 }
 run('set','media','dark','reduced-motion');
 for(const [w,h]of [[320,844],[430,844],[844,390]]){
  run('set','viewport',String(w),String(h));
  for(const id of [5,9,10,11]){
   ev(`GameSharpGoldDaily.start(${id});const c=GameSharpGoldDaily.challenges[${id}];click('[data-gd-action="answer"][data-gd-index="'+((c.steps[0].correct+1)%4)+'"]');click('[data-gd-action="expand-evidence"]');await pause(100);const host=q('.gs-gold-daily-focus-stage'),v=host.querySelector('.gs-gold-daily-visual'),r=v.getBoundingClientRect();check(r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight+1,'Focus outside viewport');for(const svg of host.querySelectorAll('svg')){const b=svg.getBoundingClientRect();check(b.width<=v.clientWidth+1&&b.left>=r.left-1&&b.right<=r.right+1,'Internal SVG clipped');}check(q('.gs-gold-daily-shell').inert,'Focus background active');`);
   shot(w+'-focus-'+id);ev(`click('[data-gd-action="close-focus"]');check(!q('.gs-gold-daily-shell').inert,'Focus return failed');`);
  }
 }
 console.log('Mental / Runaround / Middle / Future Focus portrait+landscape PASS');
 const errors=run('errors');if(errors.trim())throw Error(errors);
 console.log('PASS; '+out);
}finally{run('close');}
