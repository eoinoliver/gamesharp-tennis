// Native dispatch matters: a microtask scheduled during capture can run before
// the target's close listener. DOM.click() setup alone cannot prove this return.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const bin=process.env.GS_BROWSER_BIN||'agent-browser';
const base=process.argv[2]||'http://127.0.0.1:8766/';
const width=Number(process.env.GS_SHARPEN_WIDTH||430);
const out=fs.mkdtempSync(path.join(os.tmpdir(),'gs-sharpen-native-'));
const session='gs-sharpen-native-'+process.pid+'-'+Date.now().toString(36);
const report={base,width,out,checks:[],status:'RUNNING'};
const run=(...args)=>execFileSync(bin,['--session',session,...args],{encoding:'utf8',timeout:60000,maxBuffer:1024*1024});
const ev=body=>run('eval',`(async()=>{const pause=ms=>new Promise(r=>setTimeout(r,ms)),q=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)],click=s=>{const el=q(s);if(!el)throw Error('Missing '+s);el.click()},check=(v,m)=>{if(!v)throw Error(m)};${body}})()`);
const shot=name=>run('screenshot',path.join(out,name+'.png'));
function nativeButton(name){
  const snapshot=run('snapshot','-i');
  const escaped=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const match=snapshot.match(new RegExp('button "'+escaped+'" \\[ref=(e\\d+)\\]'));
  if(!match)throw Error('Native button not found: '+name+'\n'+snapshot);
  run('click','@'+match[1]);
}
const finish=`for(let i=0;i<3;i++){const c=GameSharpGoldDaily.challenges.find(c=>c.id===__lessonId);all('[data-gd-action="answer"]')[c.steps[i].correct].click();await pause(60);click('[data-gd-action="next"]');await pause(60);}check(q('.gs-gold-daily-pro-story'),'Missing actual third-decision result');`;
function enterCue(){
  ev(`if(!q('[data-gd-action="daily-start"]')?.getClientRects().length)GameSharpGoldDaily.openDaily();click('[data-gd-action="daily-start"]');${finish}check(GameSharpMainDaily.completed('2026-11-05'),'Future Daily incomplete');window.__dailyBefore=__dailySnapshot();click('[data-gd-action="daily-sharpen"]');await pause(100);const c=GameSharpGoldDaily.challenges.find(c=>c.id===__lessonId);check(q('#gspcOverlay.open'),'Daily cue did not open');check(!q('#gspcOverlay').inert&&q('#gspcOverlay').getAttribute('aria-hidden')!=='true','Daily cue is inert/hidden');check(q('.gspc-court-card blockquote')?.textContent===c.memory,'Not the exact Daily cue');`);
}
function assertDaily(name){
  ev(`for(let i=0;i<40&&!q('[data-gd-action="daily-start"]')?.getClientRects().length;i++)await pause(25);check(q('[data-gd-action="daily-start"]')?.getClientRects().length,'Native return lost Daily');check(!q('#gspcOverlay.open'),'Sharpen remained open');check(__dailySnapshot()===__dailyBefore,'Native return changed Daily history/credit');`);
  shot(name);report.checks.push(name);console.log('PASS '+name);
}
function assertHome(name){
  ev(`check(q('#homeScreen.active'),'Persistent navigation did not reach Home');check(!q('#gspcOverlay.open'),'Sharpen remained open');check(!q('[data-gd-action="daily-start"]')?.getClientRects().length,'Stale Daily origin intercepted Home');check(__dailySnapshot()===__dailyBefore,'Navigation changed Daily history/credit');`);
  shot(name);report.checks.push(name);console.log('PASS '+name);
}
console.log('Evidence: '+out);
try{
  run('set','viewport',String(width),'844');run('set','media','dark','reduced-motion');run('open',base);
  ev(`for(let i=0;i<120&&(!window.GameSharpPainCoach||!window.GameSharpMainDaily);i++)await pause(100);check(window.GameSharpPainCoach&&window.GameSharpMainDaily,'Runtime unavailable');q('[aria-label^="GAMESHARP introduction"]')?.click();await pause(1200);all('[onclick="skipWelcomeOnboarding()"]') .find(e=>e.getClientRects().length)?.click();await pause(500);check(GameSharpGoldDaily.challenges.filter(c=>!c.reviewOnly).length===21,'Expected approved 21-lesson runtime');window.__NativeDate=Date;window.Date=class extends __NativeDate{constructor(...args){super(...(args.length?args:['2026-11-05T12:00:00']))}};window.__lessonId=GameSharpGoldDailyLoop.lessonFor('2026-11-05');window.__dailySnapshot=()=>JSON.stringify([GameSharpGoldDailyLoop.key,GameSharpMainDaily.key,'gamesharp_challenges_done','gamesharp_streak'].map(k=>[k,localStorage.getItem(k)]));`);
  for(const [name,button] of [['native-exit','Exit'],['native-back','Go back'],['native-escape',null]]){
    enterCue();if(button)nativeButton(button);else{run('snapshot','-i');run('press','Escape');}assertDaily(name);
  }
  enterCue();ev(`click('[data-replay]');${finish}click('[data-gd-action="list"]');await pause(50);check(q('.gspc-court-card'),'Completed replay lost cue');check(__dailySnapshot()===__dailyBefore,'Replay changed Daily');check(GameSharpPainCoach.getData().seen[__lessonId],'Completed replay not Seen');check(!GameSharpPainCoach.getData().focus,'Replay automatically saved or practised');`);
  nativeButton('Exit');assertDaily('completed-replay-native-exit');
  enterCue();nativeButton('Home');assertHome('native-home');
  enterCue();nativeButton('Explore');ev(`check(!q('#gspcOverlay.open'),'Explore did not dismiss cue');check(!q('#homeScreen.active'),'Explore stayed Home');`);nativeButton('Home');assertHome('native-explore-then-home');
  const errors=run('errors');if(errors.trim())throw Error(errors);
  report.status='PASS';
}catch(error){report.status='FAIL';report.error=String(error.stderr||error.message);process.exitCode=1;console.error(report.error);}
finally{try{run('close');}catch(error){report.cleanupError=error.message;process.exitCode=1;}fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
