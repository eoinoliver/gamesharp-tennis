import {execFileSync} from 'node:child_process';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const bin=process.env.GS_BROWSER_BIN||'agent-browser',session='gs-second-'+process.pid,out=fs.mkdtempSync(path.join(os.tmpdir(),'gs-second-'));
const run=(...a)=>execFileSync(bin,['--session',session,...a],{encoding:'utf8',timeout:30000});
const ev=s=>run('eval',`(()=>{const check=(x,m)=>{if(!x)throw Error(m)};${s}})()`);
try{
 for(const width of [320,430,1280]){
  run('set','viewport',String(width),'844');run('set','media','dark',width===430?'reduced-motion':'no-preference');run('open','http://127.0.0.1:8766/.proofs/second-serve/');run('snapshot','-i');
  const storage=run('eval','JSON.stringify(localStorage)');
  for(let i=0;i<2;i++)for(let b=0;b<2;b++){
   ev(`proof.select(${i});proof.play(${b});proof.seek(SecondServeEvidence.model(${i},${b}).end+.35);check(proof.state.ended,'Not ended');check(document.documentElement.scrollWidth<=innerWidth,'Overflow');check([...document.querySelectorAll('button')].filter(b=>b.offsetParent).every(b=>b.getBoundingClientRect().height>=44),'Small tap target');check(!document.querySelector('#frame').innerHTML.match(/NaN|undefined/),'Invalid frame');`);
   run('screenshot',path.join(out,width+'-'+i+'-'+b+'.png'));
  }
  ev(`check(document.querySelectorAll('.result').length===2,'Comparison missing');document.querySelector('#labels').click();check(!document.querySelector('#frame text'),'Labels remain');document.querySelector('#expand').click();check(document.querySelector('#frame').innerHTML===document.querySelector('#focus-frame').innerHTML,'Different Focus');check(document.querySelector('#focus-clock').textContent===document.querySelector('#clock').textContent,'Focus clock missing');check(document.querySelector('#focus-title').textContent===document.querySelector('#title').textContent,'Focus title missing');check(document.querySelector('#focus-result').textContent.includes('2.15')&&document.querySelector('#focus-result').textContent.includes('2.36'),'Focus comparison missing');check(document.querySelector('#shell').inert,'Background not inert');`);
  run('screenshot',path.join(out,width+'-focus.png'));run('press','Tab');ev(`check(document.activeElement.id==='close','Focus escaped');`);run('press','Escape');ev(`check(document.querySelector('.focus').hidden,'Escape failed');check(document.activeElement.id==='expand','Focus not restored');check(!document.querySelector('#shell').inert,'Background stayed inert');`);
  if(storage!==run('eval','JSON.stringify(localStorage)'))throw Error('Proof changed stored Daily data');
  const errors=run('errors');if(errors.trim())throw Error(errors);console.log(width+' both cases / four branches / Focus / labels / storage PASS');
 }
 run('set','viewport','844','390');ev(`document.querySelector('#expand').click();for(const el of document.querySelector('.focus').children){const r=el.getBoundingClientRect();check(r.top>=0&&r.bottom<=innerHeight,'Landscape child clipped: '+el.id);}`);run('screenshot',path.join(out,'landscape-focus.png'));run('press','Escape');
 run('set','viewport','430','844');run('set','media','dark','no-preference');run('open','http://127.0.0.1:8766/.proofs/second-serve/');
 // Keep the wait in the page's clock domain. Separate CLI wait commands timed
 // out during this check; direct asynchronous observation verified actual RAF.
 const normal=JSON.parse(run('eval',`(async()=>{const rows=[];for(let i=0;i<2;i++)for(let b=0;b<2;b++){proof.select(i);proof.play(b);const before={ended:proof.state.ended,feedback:document.querySelector('.feedback').textContent};await new Promise(r=>setTimeout(r,650));const middle={ended:proof.state.ended,feedback:document.querySelector('.feedback').textContent};await new Promise(r=>setTimeout(r,5450));rows.push({i,b,before,middle,after:proof.state.ended,feedback:document.querySelector('.feedback').textContent});}return rows;})()`));
 for(const row of normal)if(row.before.ended||row.before.feedback||row.middle.ended||row.middle.feedback||!row.after||!row.feedback)throw Error('Normal-motion evidence failed: '+JSON.stringify(row));
 console.log('All four normal-motion runs and landscape PASS');console.log('Evidence '+out);
}finally{try{run('close');}catch(error){console.error('Browser cleanup did not complete for '+session);throw error;}}
