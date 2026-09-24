import {execFileSync} from 'node:child_process';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const bin=process.env.GS_BROWSER_BIN||'/Users/eoinlynn/.npm/_npx/6de2aa2fded2970c/node_modules/agent-browser/bin/agent-browser-darwin-arm64',session='gs-pattern-verify-'+process.pid,out=fs.mkdtempSync(path.join(os.tmpdir(),'gs-pattern-'));
let activeSession=session;const run=(...a)=>execFileSync(bin,['--session',activeSession,...a],{encoding:'utf8',timeout:30000,maxBuffer:2e6});
const ev=b=>run('eval',`(()=>{const check=(v,m)=>{if(!v)throw Error(m)};${b}})()`);
try{
 console.log(out);for(const width of process.env.GS_PATTERN_NORMAL_ONLY?[]:[320,430,1280]){
  run('set','viewport',String(width),'844');run('open','http://127.0.0.1:8766/.proofs/pattern-history/');run('snapshot','-i');
  const saved=run('eval','JSON.stringify(localStorage)');
  for(let scene=0;scene<3;scene++){
   ev(`proof.select(${scene});proof.seek(11);check(!document.querySelector('#feedback').textContent,'Premature feedback');check(document.querySelectorAll('#stage [data-active-ball]').length===1,'Multiple active balls');check(!document.querySelector('#stage [data-feature]'),'Read already graded');`);
   run('screenshot','--full',path.join(out,width+'-read-'+scene+'.png'));
   for(let choice=0;choice<4;choice++)ev(`proof.play(${choice});proof.seek(2.6);check(document.documentElement.scrollWidth<=innerWidth,'Overflow');check(!/NaN|undefined/.test(document.querySelector('#stage').innerHTML),'Invalid frame');check(document.querySelectorAll('#stage [data-active-ball]').length===1,'Multiple active balls');check(!document.querySelector('#feedback').textContent,'Payoff precedes evidence');proof.seek(6.85);check(document.querySelector('#feedback').textContent,'Missing payoff');`);
  }
  ev(`document.querySelector('#motion').click();proof.select(1);proof.play(0);check(document.querySelectorAll('#stage svg').length===2,'Reduced comparison missing');document.querySelector('#labels').click();check(!document.querySelector('#stage text'),'Labels remain');document.querySelector('#expand').click();check(document.querySelector('#focus-stage').innerHTML===document.querySelector('#stage').innerHTML,'Different Focus evidence');check(document.querySelector('#shell').inert,'Background not inert');`);
  run('screenshot','--full',path.join(out,width+'-reduced-focus.png'));run('press','Escape');
  if(saved!==run('eval','JSON.stringify(localStorage)'))throw Error('Storage mutated');console.log(width+' all12 choices/read/Focus/reduced/labels/storage PASS');
 }
 if(!process.env.GS_PATTERN_NORMAL_ONLY)run('close');activeSession=session+'-motion';run('open','http://127.0.0.1:8766/.proofs/pattern-history/');run('set','viewport','430','844');
 const normal=run('eval',`(async()=>{proof.select(1);await new Promise(r=>setTimeout(r,1350));const first={record:document.querySelector('#stage svg').dataset.patternRecord,replies:document.querySelectorAll('#stage [data-observed-reply]').length,t:proof.state.t};await new Promise(r=>setTimeout(r,9500));const end={record:document.querySelector('#stage svg').dataset.patternRecord,replies:document.querySelectorAll('#stage [data-observed-reply]').length,t:proof.state.t};return {first,end};})()`);
 const n=JSON.parse(normal);if(n.first.record!=='0'||n.first.replies!==0||n.end.record!=='3'||n.end.replies!==4)throw Error('Real clock sequence failed '+normal);
 run('screenshot','--full',path.join(out,'normal-history.png'));const errors=run('errors');if(errors.trim())throw Error(errors);console.log('Normal history chronology PASS');console.log(out);
}finally{run('close');}
