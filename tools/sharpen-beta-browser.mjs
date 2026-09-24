// Reusable browser verification. Every profile and all storage/date overrides
// are disposable test data; this never writes application or production files.
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const require=createRequire(import.meta.url),catalogue=require('../gamesharp-sharpen-paths.js');
const bin=process.env.GS_BROWSER_BIN||'agent-browser';
const base=process.argv[2]||'http://127.0.0.1:8766/';
const widths=(process.env.GS_SHARPEN_WIDTHS||'320,430,1280').split(',').map(Number);
const selectedChecks=process.env.GS_SHARPEN_CHECKS?new RegExp(process.env.GS_SHARPEN_CHECKS):null;
const out=fs.mkdtempSync(path.join(os.tmpdir(),'gs-sharpen-beta-'));
const report={base,out,checks:[],failures:[]};
let session;
const run=(...args)=>execFileSync(bin,['--session',session,...args],{encoding:'utf8',timeout:60000,maxBuffer:1024*1024});
const ev=body=>run('eval',`(async()=>{const pause=ms=>new Promise(r=>setTimeout(r,ms)),q=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)],click=s=>{const x=q(s);if(!x)throw Error('Missing '+s);x.click()},check=(v,m)=>{if(!v)throw Error(m)};${body}})()`);
const shot=name=>run('screenshot',path.join(out,name+'.png'));
const save=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
function record(name,fn){if(selectedChecks&&!selectedChecks.test(name))return;try{fn();report.checks.push({name,status:'PASS'});}catch(error){const message=error.stderr||error.message;report.failures.push({name,message:String(message)});console.log('FAIL '+name+': '+String(message).split('\n')[0]);}save();}
function own(name,width,fn){session='gs-sharpen-'+process.pid+'-'+name;try{run('set','viewport',String(width),width===320?'740':'844');run('set','media','dark','reduced-motion');fn();const errors=run('errors');if(errors.trim())throw Error(errors);}finally{run('close');}}
function open(){run('open',base);ev(`for(let i=0;i<150&&(!window.GameSharpMainDaily||!window.GameSharpPainCoach);i++)await pause(100);check(window.GameSharpMainDaily&&window.GameSharpPainCoach,'Runtime unavailable');q('[aria-label^="GAMESHARP introduction"]')?.click();await pause(1200);const welcome=all('[onclick="skipWelcomeOnboarding()"]') .find(e=>e.getClientRects().length);welcome?.click();await pause(700);window.__errors=[];addEventListener('error',e=>__errors.push(e.message));`);}
const dailySnapshot=`JSON.stringify([GameSharpGoldDailyLoop.key,GameSharpMainDaily.key,'gamesharp_challenges_done','gamesharp_streak'].map(k=>[k,localStorage.getItem(k)]))`;
const layout=`const scroll=q('#gspcOverlay .gspc-scroll');check(scroll.scrollWidth<=scroll.clientWidth+1,'Sharpen horizontal overflow');for(const card of all('.gspc-situation')){const r=card.getBoundingClientRect(),pic=card.querySelector('.gspc-situation-picture').getBoundingClientRect(),copy=card.querySelector('.gspc-situation-copy').getBoundingClientRect();check(r.height>=110,'Small situation target');check(pic.right<=copy.left+1,'Picture/copy overlap');check(copy.right<=r.right-5,'Copy outside card');check(card.scrollWidth<=card.clientWidth+1,'Card horizontal overflow');}for(const b of all('#gspcOverlay button').filter(x=>x.getClientRects().length)){check(b.getBoundingClientRect().height>=44,'Small touch target '+(b.textContent||b.ariaLabel).trim());}`;
const finish=`for(let i=0;i<3;i++){const c=GameSharpGoldDaily.challenges.find(c=>c.id===window.__lessonId);all('[data-gd-action="answer"]')[c.steps[i].correct].click();await pause(75);click('[data-gd-action="next"]');await pause(75);}check(q('.gs-gold-daily-pro-story'),'Missing professional payoff');check(q('.gs-gold-daily').textContent.includes('unscored practice'),'Practice not identified');check(!q('[data-gd-action="daily-sharpen"]'),'Duplicate practice detour');click('[data-gd-action="list"]');await pause(100);`;

console.log('Evidence: '+out);
for(const width of widths){
 record(width+' all concern routes',()=>own('routes-'+width,width,()=>{
  open();ev(`window.__daily=${dailySnapshot};GameSharpPainCoach.open('sharpen');await pause(200);check(document.querySelectorAll('.gspc-hotspot').length===7,'Seven hotspots required');check(getComputedStyle(document.body).touchAction==='auto','Body blocks native scroll');`);shot(width+'-player');
  const completed=new Set();
  for(const region of catalogue.regions){
   ev(`GameSharpPainCoach.open('sharpen');click('.gspc-hotspot[data-player-region="${region.id}"]');await pause(75);check(all('[data-path]').length===${region.pathIds.length},'Concern count ${region.id}');check(!q('.gspc-stage .gspc-player'),'Repeated player on region');${layout}window.__thumbs=all('.gspc-situation-picture').map(e=>e.innerHTML).join('');check(!q('.gspc-situation-picture animate,.gspc-situation-picture animateMotion,.gspc-situation-picture animateTransform,.gspc-situation-picture button'),'Live/interactive thumbnail');await pause(150);check(__thumbs===all('.gspc-situation-picture').map(e=>e.innerHTML).join(''),'Thumbnail changed');`);
   shot(width+'-region-'+region.id);
   for(const id of region.pathIds){
    const concern=catalogue.byId[id],complete=width===430&&!completed.has(concern.lessonId);
    ev(`GameSharpPainCoach.openRegion('${region.id}','sharpen');window.__lessonId='${concern.lessonId}';click('[data-path="${id}"]');await pause(100);const c=GameSharpGoldDaily.challenges.find(c=>c.id===__lessonId);check(q('.gs-gold-daily-step-copy').textContent.includes(c.screenTitle||c.title),'Wrong lesson for ${id}');check(q('#gspcOverlay').classList.contains('open')===false,'Sharpen not suspended');${concern.lessonId==='gold_contact_point_v1'?`check(q('#faspStage')&&q('#faspStage').children.length,'Actual Contact scene missing');`:''}`);
    if(concern.lessonId==='gold_contact_point_v1')shot(width+'-contact-actual');
    if(complete){
     ev(`${finish}const c=GameSharpGoldDaily.challenges.find(c=>c.id===__lessonId);check(q('.gspc-court-card blockquote').textContent===c.memory,'Memory drift');check(q('.gspc-court-card>p').textContent===c.takeItToCourt,'Court cue drift');check(GameSharpPainCoach.getData().seen[__lessonId],'Lesson not recorded as seen');check(!GameSharpPainCoach.getData().focus,'Practice automatically saved/tried a focus');check(${dailySnapshot}===__daily,'Practice altered Daily');${layout}`);
     shot(width+'-court-'+concern.lessonId);completed.add(concern.lessonId);
    }else{
     ev(`click('[data-gd-action="close"]');await pause(75);check(q('.gspc-region-head')&&q('[data-path="${id}"]'),'Early exit lost concern region');check(${dailySnapshot}===__daily,'Early exit altered Daily');`);
    }
   }
  }
  ev(`check(!__errors.length,__errors.join('|'));`);const errors=run('errors');if(errors.trim())throw Error(errors);
  console.log(width+' PASS: 19 exact routes; '+completed.size+' complete unique lessons');
 }));
}

record('static thumbnails without reduced motion',()=>own('static-normal',320,()=>{
 run('set','media','dark');open();
 for(const region of catalogue.regions){
  ev(`GameSharpPainCoach.openRegion('${region.id}','sharpen');window.__thumbs=all('.gspc-situation-picture').map(e=>e.innerHTML).join('');await pause(400);check(__thumbs===all('.gspc-situation-picture').map(e=>e.innerHTML).join(''),'Normal-motion thumbnail changed');for(const picture of all('.gspc-situation-picture'))check(picture.getAnimations({subtree:true}).length===0,'Thumbnail animation active');`);
 }
 shot('320-static-normal-decisions');console.log('PASS: all19 thumbnails remain static without reduced motion');
}));

record('save reload explicit trial feedback and keyboard',()=>own('state',430,()=>{
 open();ev(`GameSharpPainCoach.openLessonFocus('gold_contact_point_v1','sharpen');window.__daily=${dailySnapshot};click('[data-save-focus]');check(GameSharpPainCoach.getData().focus.lessonId==='gold_contact_point_v1','Save missing');check(!GameSharpPainCoach.getData().focus.practicedAt&&!q('[data-feedback]'),'Automatic court trial');`);shot('430-saved-untried');
 run('reload');ev(`for(let i=0;i<100&&!window.GameSharpPainCoach;i++)await pause(100);GameSharpPainCoach.open('sharpen');click('[data-saved-focus]');check(q('.gspc-court-card blockquote').textContent===GameSharpGoldDaily.challenges.find(c=>c.id==='gold_contact_point_v1').memory,'Reload lost cue');check(!q('[data-feedback]'),'Feedback before explicit trial');click('[data-tried]');check(GameSharpPainCoach.getData().focus.practicedAt,'Explicit trial not recorded');click('[data-feedback="mixed"]');check(GameSharpPainCoach.getData().focus.feedback==='mixed','Feedback not saved');`);shot('430-explicit-feedback');
 run('reload');ev(`for(let i=0;i<100&&!window.GameSharpPainCoach;i++)await pause(100);GameSharpPainCoach.open('sharpen');click('[data-saved-focus]');check(q('[data-feedback="mixed"]').getAttribute('aria-pressed')==='true','Feedback lost on reload');const controls=all('#gspcOverlay button').filter(e=>e.getClientRects().length&&!e.disabled);controls.at(-1).focus();`);run('press','Tab');ev(`check(document.activeElement===q('.gspc-back'),'Tab escaped dialog');`);run('press','Shift+Tab');ev(`check(document.activeElement===all('#gspcOverlay button').filter(e=>e.getClientRects().length&&!e.disabled).at(-1),'Reverse Tab escaped dialog');`);run('press','Escape');ev(`check(!q('#gspcOverlay.open'),'Escape failed');`);
 console.log('PASS: saved focus, reload, explicit trial, feedback, keyboard');
}));

record('Daily exact cue replay and return',()=>own('daily',430,()=>{
 open();ev(`window.__RealDate=Date;window.Date=class extends __RealDate{constructor(...args){super(...(args.length?args:['2026-11-09T12:00:00']))}};GameSharpMainDaily.refreshHome();startDailyChallenge();click('[data-gd-action="daily-start"]');window.__lessonId=GameSharpGoldDailyLoop.lessonFor('2026-11-09');for(let i=0;i<3;i++){const c=GameSharpGoldDaily.challenges.find(c=>c.id===__lessonId);all('[data-gd-action="answer"]')[c.steps[i].correct].click();await pause(75);click('[data-gd-action="next"]');await pause(75);}check(GameSharpMainDaily.completed('2026-11-09'),'Daily not completed');window.__daily=${dailySnapshot};click('[data-gd-action="daily-sharpen"]');const c=GameSharpGoldDaily.challenges.find(c=>c.id===__lessonId);check(q('.gspc-court-card blockquote').textContent===c.memory,'Daily did not hand off exact cue');click('[data-replay]');await pause(75);click('[data-gd-action="close"]');await pause(100);check(q('.gspc-court-card'),'Early replay exit lost cue focus');check(${dailySnapshot}===__daily,'Replay changed Daily');click('#gspcOverlay .gspc-close');await pause(100);check(q('[data-gd-action="daily-start"]'),'Sharpen exit lost Daily');check(${dailySnapshot}===__daily,'Sharpen exit changed Daily');`);shot('430-daily-restored');console.log('PASS: exact Daily cue, replay and restored Daily');
}));

record('saved partial Daily survives concern practice',()=>own('partial-daily',430,()=>{
 open();ev(`startDailyChallenge();click('[data-gd-action="daily-start"]');click('[data-gd-action="answer"]');await pause(75);click('[data-gd-action="list"]');window.__daily=${dailySnapshot};check(localStorage.getItem(GameSharpGoldDailyLoop.key),'No partial Daily fixture');click('[data-gd-action="close"]');GameSharpPainCoach.openRegion('forehand','sharpen');window.__lessonId='gold_contact_point_v1';click('[data-path="forehand_crowded_contact"]');await pause(100);${finish}check(${dailySnapshot}===__daily,'Concern practice overwrote partial Daily');click('#gspcOverlay .gspc-close');GameSharpGoldDaily.openDaily();check(q('[data-gd-action="daily-start"]').textContent.includes('Resume'),'Partial Daily no longer resumable');check(${dailySnapshot}===__daily,'Return altered partial Daily');`);shot('430-partial-daily-preserved');console.log('PASS: saved partial Daily survives full concern practice');
}));

record('200 percent text reflow',()=>own('large-text',320,()=>{
 open();ev(`document.documentElement.style.fontSize='200%';GameSharpPainCoach.openRegion('serve_return','sharpen');${layout}`);shot('320-region-200percent');ev(`GameSharpPainCoach.openLessonFocus('gold_serve_quality_v1','sharpen');${layout}`);shot('320-court-200percent');console.log('PASS: 200 percent text');
}));

for(const asset of ['gamesharp-sharpen-paths.js','gamesharp-sharpen-state.js']){
 record('missing '+asset,()=>own('missing-'+asset.replace(/\W/g,''),430,()=>{
  run('network','route','**/'+asset+'*','--abort');open();ev(`GameSharpPainCoach.openRegion('forehand','sharpen');check(!q('[data-path]'),'Missing asset allowed a substitute path');check(q('.gspc-empty')?.textContent.includes('not available'),'Missing asset not explained');check(!__errors.length,__errors.join('|'));`);shot('missing-'+asset);console.log('PASS: honest withholding '+asset);
 }));
}
record('illustration failure fallback',()=>own('image-failure',320,()=>{
 run('network','route','**/GS-tennis-player-pose.png*','--abort');open();ev(`GameSharpPainCoach.open('sharpen');for(let i=0;i<50&&q('.gspc-player-fallback').hidden;i++)await pause(100);check(!q('.gspc-player-fallback').hidden,'Image failure has no fallback');check(all('.gspc-player-fallback [data-player-region]').length===7,'Missing fallback area');const fallback=q('.gspc-player-fallback').getBoundingClientRect();check(q('.gspc-player-intro').getBoundingClientRect().bottom<=fallback.top,'Fallback overlaps intro');for(const el of all('.gspc-player-fallback>*')){const r=el.getBoundingClientRect();check(r.top>=fallback.top&&r.bottom<=fallback.bottom,'Fallback content exceeds its card');}${layout}`);shot('320-image-fallback');ev(`click('.gspc-player-fallback [data-player-region="forehand"]');check(all('[data-path]').length===3,'Fallback navigation failed');`);console.log('PASS: seven-area image fallback');
}));
record('unavailable storage is explicit',()=>own('storage-failure',430,()=>{
 open();ev(`Object.defineProperty(window,'localStorage',{value:{getItem(){throw Error('fixture storage blocked')},setItem(){throw Error('fixture storage blocked')}}});GameSharpPainCoach.openLessonFocus('gold_contact_point_v1','sharpen');click('[data-save-focus]');check(q('.gspc-storage-note').textContent.includes('only while this page stays open'),'Ephemeral saving not explained');check(!GameSharpPainCoach.getData().focus.practicedAt,'Save became a trial');`);shot('430-storage-unavailable');console.log('PASS: unavailable storage explained');
}));
save();console.log(JSON.stringify({out,passed:report.checks.length,failed:report.failures.length}));
if(report.failures.length)process.exitCode=1;
