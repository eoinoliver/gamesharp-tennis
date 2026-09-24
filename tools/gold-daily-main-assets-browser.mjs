import {execFileSync} from 'node:child_process';
const bin=process.env.GS_BROWSER_BIN||'agent-browser';
const base=process.argv[2]||'http://127.0.0.1:8766/index.html';
let session='gs-main-assets-'+process.pid;
const run=(...args)=>execFileSync(bin,['--session',session,...args],{encoding:'utf8',timeout:60000,maxBuffer:1024*1024});
for(const asset of ['gold-daily-prototypes.css','gold-daily-prototypes.js','gold-daily-main.js','gold-daily-loop.js','gold-daily-lesson-spines.js','gold-daily-high-ball.js','gold-daily-construction.js','gold-daily-tradeoffs.js','gold-daily-return-time.js','gold-daily-serve-quality.js','gold-daily-patterns.js']){
  session='gs-main-assets-'+process.pid+'-'+asset.replace(/[^a-z]/g,'');
  run('network','route','**/'+asset+'*','--abort');
  run('open',base);
  run('eval',`startDailyChallenge();if(document.querySelector('[data-gd-action="daily-start"]')||state.isDailyMode)throw Error('Missing asset opened an unsafe or legacy Daily');`);
  run('close');
  console.log(asset+' failure withheld PASS');
}
session='gs-main-audio-'+process.pid;
run('network','route','**/livepoint-audio/**','--abort');
run('open',base);
run('eval',`localStorage.setItem('gs_sound_on','1');`);
run('open',base);
run('eval',`(async()=>{startDailyChallenge();document.querySelector('[data-gd-action="daily-start"]').click();for(let i=0;i<3;i++){document.querySelector('[data-gd-action="answer"]').click();await new Promise(r=>setTimeout(r,5200));document.querySelector('[data-gd-action="next"]').click()}await new Promise(r=>setTimeout(r,200));if(!GameSharpMainDaily.completed(GameSharpGoldDailyLoop.dateKey()))throw Error('Optional audio prevented main completion')})()`);
console.log('Normal motion, sound on, failed optional audio: main completion PASS');
console.log('Runtime errors: '+run('errors'));
run('close');
