// Coaching hierarchy edge regression; disposable browser profile, no user data.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const bin=process.env.GS_BROWSER_BIN||'agent-browser',base=process.argv[2]||'http://127.0.0.1:8766/index.html';
const session='gs-coaching-'+process.pid,out=fs.mkdtempSync(path.join(os.tmpdir(),'gs-coaching-'));
const run=(...a)=>execFileSync(bin,['--session',session,...a],{encoding:'utf8',timeout:60000});
const ev=s=>run('eval',`(async()=>{const check=(x,m)=>{if(!x)throw Error(m)};${s}})()`);
try{
  for(const [w,h] of (process.env.GS_COACH_DESKTOP_ONLY==='1'?[[1280,844]]:[[320,568],[390,844],[430,932],[1280,844]])){
    run('set','viewport',String(w),String(h));run('open',base+'?goldDaily=runaround');run('snapshot','-i');
    for(let i=0;i<3;i++){
      ev(`await new Promise(r=>setTimeout(r,3400));
        const main=document.querySelector('.is-guided-coaching'),setup=main.querySelector('.gs-gold-daily-coach-setup'),court=main.querySelector('.gs-gold-daily-visual'),q=main.querySelector('h1'),options=[...main.querySelectorAll('.gs-gold-daily-option')];
        check(setup.getBoundingClientRect().bottom<=court.getBoundingClientRect().top,'Setup must precede court');
        check(court.getBoundingClientRect().bottom<=q.getBoundingClientRect().top,'Question must follow court');
        check(!main.querySelector('.gs-gold-daily-step-copy strong'),'Authoring phase leaked');
        check(main.querySelector('.gs-gold-daily-step-count').textContent==='${i+1} of 3','Progress');
        check(document.querySelector('.gs-gold-daily').scrollWidth<=innerWidth,'Overflow');
        check(options.length===4&&options.every(e=>e.getBoundingClientRect().height>=44),'Touch targets');
        if(innerWidth>=390)check(options[3].getBoundingClientRect().bottom<=innerHeight,'Normal phone choices require scrolling');`);
      run('screenshot',path.join(out,w+'-'+i+'.png'));
      ev(`document.querySelector('.gs-gold-daily-option').click();await new Promise(r=>setTimeout(r,4400));document.querySelector('[data-gd-action="next"]').click();`);run('snapshot','-i');
    }
    console.log(w+'x'+h+' hierarchy / three decisions PASS');
  }
  run('set','viewport','320','568');run('open',base+'?goldDaily=runaround');
  ev(`await new Promise(r=>setTimeout(r,500));
    document.querySelectorAll('.is-guided-coaching *').forEach(e=>{if(e.children.length===0&&!e.closest('svg')){const s=getComputedStyle(e);e.style.fontSize=(parseFloat(s.fontSize)*2)+'px'}});
    check(document.querySelector('.gs-gold-daily').scrollWidth<=innerWidth,'Enlarged text overflow');
    const last=document.querySelectorAll('.gs-gold-daily-option')[3];last.scrollIntoView();check(last.getBoundingClientRect().bottom<=innerHeight,'Enlarged last choice unreachable');`);
  run('screenshot',path.join(out,'320-double-text.png'));
  run('open',base+'?goldDaily=middle-return');
  ev(`await new Promise(r=>setTimeout(r,500));check(document.querySelector('.is-guided-coaching'),'Shared coaching shell missing');check(!document.querySelector('.gs-gold-daily-scene-line'),'Duplicated setup');`);
  const errors=run('errors');if(errors.trim())throw Error(errors);
  console.log('Enlarged text / shared neighbour PASS; evidence '+out);
}finally{run('close');}
