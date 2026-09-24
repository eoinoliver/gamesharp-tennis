import {execFileSync} from 'node:child_process';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const bin=process.env.GS_BROWSER_BIN||'agent-browser',session='gs-height-'+process.pid,out=fs.mkdtempSync(path.join(os.tmpdir(),'gs-high-ball-'));
const run=(...a)=>execFileSync(bin,['--session',session,...a],{encoding:'utf8',timeout:30000});
const ev=s=>run('eval',`(()=>{const check=(x,m)=>{if(!x)throw Error(m)};${s}})()`);
try{
 for(const width of [320,430,1280]){
  run('set','viewport',String(width),'844');run('set','media','dark',width===430?'reduced-motion':'no-preference');run('open','http://127.0.0.1:8766/.proofs/high-ball/');run('snapshot','-i');
  for(let i=0;i<3;i++)for(const action of [null,'forward','hold','back']){
   ev(`proof.select(${i});proof.play(${JSON.stringify(action)});const s=HighBallEvidence.scenes[${i}],a=${JSON.stringify(action)};proof.seek(a?(HighBallEvidence.contact(s,a)?.t||HighBallEvidence.end):HighBallEvidence.readEnd);
    check(document.querySelector('.gs-gold-daily').scrollWidth<=innerWidth,'Overflow');check([...document.querySelectorAll('button')].filter(b=>b.offsetParent).every(b=>b.getBoundingClientRect().height>=44),'Tap target');check(!document.querySelector('#frame').innerHTML.match(/NaN|undefined/),'Invalid frame');`);
   run('screenshot',path.join(out,width+'-'+i+'-'+(action||'read')+'.png'));
  }
  ev(`document.querySelector('#captions').click();check(!document.querySelector('#frame text'),'Labels remain');document.querySelector('#focus').click();check(document.querySelector('#frame').innerHTML===document.querySelector('#focus-frame').innerHTML,'Different Focus scene');`);
  run('screenshot',path.join(out,width+'-focus-unlabelled.png'));run('press','Escape');
  ev(`check(document.querySelector('.proof-focus').hidden,'Escape did not close');check(!document.querySelector('.gs-gold-daily-shell').inert,'Focus left app inert');`);
  const errors=run('errors');if(errors.trim())throw Error(errors);console.log(width+' all 3 cases / 9 movements / Focus PASS');
 }
 run('set','viewport','844','390');ev(`document.querySelector('#focus').click();const r=document.querySelector('#focus-frame').getBoundingClientRect();check(r.top>=0&&r.bottom<=innerHeight,'Landscape Focus clipped');`);run('screenshot',path.join(out,'landscape-focus.png'));run('press','Escape');
 console.log('Evidence '+out);
}finally{run('close');}
