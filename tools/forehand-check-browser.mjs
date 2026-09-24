// Released beta verifier. Every browser profile and storage fixture is
// disposable. Native dispatch is mandatory for the navigation/form checks.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {reviewTarget} from './review-target.mjs';

const bin=process.env.GS_BROWSER_BIN||'agent-browser';
const supplied=reviewTarget(process.argv[2]||'http://127.0.0.1:8766/index.html');
const base=supplied.href,normal=new URL(base);normal.search='';
const widths=(process.env.GS_FOREHAND_WIDTHS||'320,430,1280').split(',').map(Number);
const selected=process.env.GS_FOREHAND_CHECKS?new RegExp(process.env.GS_FOREHAND_CHECKS):null;
const out=fs.mkdtempSync(path.join(os.tmpdir(),'gs-forehand-check-'));
const report={base,out,checks:[],failures:[]};
const experimentKey='gamesharp_forehand_check_v1';
let session;
const run=(...args)=>execFileSync(bin,['--session',session,...args],{encoding:'utf8',timeout:60000,maxBuffer:1024*1024});
const ev=body=>run('eval',`(async()=>{const pause=ms=>new Promise(r=>setTimeout(r,ms)),q=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)],click=s=>{const e=q(s);if(!e)throw Error('Missing '+s);e.click()},check=(v,m)=>{if(!v)throw Error(m)},experiment=()=>JSON.parse(localStorage.getItem('${experimentKey}')||'null')?.experiment;${body}})()`);
const shot=name=>run('screenshot',path.join(out,name+'.png'));
const save=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
function record(name,fn){
  if(selected&&!selected.test(name))return;
  try{fn();report.checks.push({name,status:'PASS'});console.log('PASS '+name);}
  catch(error){const message=String(error.stderr||error.message);report.failures.push({name,message});console.error('FAIL '+name+': '+message.split('\n')[0]);}
  save();
}
function own(name,width,fn){
  session='gs-forehand-'+process.pid+'-'+name;
  try{run('set','viewport',String(width),width===320?'740':'844');run('set','media','dark','reduced-motion');fn();const errors=run('errors');if(errors.trim())throw Error(errors);}
  finally{try{run('close');}catch(error){throw Error('Browser cleanup failed: '+error.message);}}
}
function native(selector,action='click',value){
  ev(`const el=q(${JSON.stringify(selector)});check(el&&el.getClientRects().length,'Native target absent: '+${JSON.stringify(selector)});el.scrollIntoView({block:'center'});`);
  const snapshot=run('snapshot','-i','-s',selector),ref=snapshot.match(/\bref=(e\d+)\]/)?.[1];
  // Chromium's scoped interactive snapshot does not expose this native summary
  // as a ref. The CLI's selector click still dispatches real mouse input.
  if(!ref&&selector==='.gspc-check-sources summary'&&action==='click'){run('click',selector);return;}
  if(!ref)throw Error('Native target has no reference: '+selector+'\n'+snapshot);
  run(action,'@'+ref,...(value===undefined?[]:[String(value)]));
}
function coordinateWheel(x,y,deltaY){
  // agent-browser's mouse wheel currently dispatches at (0,0), even after mouse
  // move. Use the owned browser's CDP endpoint to send one genuinely positioned
  // native event; never substitute scrollTop/scrollIntoView as wheel evidence.
  const cdpUrl=run('get','cdp-url').trim();
  if(!/^ws:\/\/127\.0\.0\.1:\d+\/devtools\/browser\//.test(cdpUrl))throw Error('Expected the owned local browser CDP endpoint');
  const code=`
    const config=JSON.parse(process.argv[1]),ws=new WebSocket(config.cdpUrl),pending=new Map();let id=0;
    const timer=setTimeout(()=>{console.error('Coordinate wheel timed out');ws.close();process.exit(1)},10000);
    try{
      await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
      ws.onmessage=e=>{const m=JSON.parse(e.data),p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result)}};
      const call=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params,...(sessionId?{sessionId}:{})}))});
      const targets=await call('Target.getTargets'),target=targets.targetInfos.find(t=>t.type==='page'&&t.url===config.base);
      if(!target)throw Error('Exact owned local page is unavailable');
      const {sessionId}=await call('Target.attachToTarget',{targetId:target.targetId,flatten:true});
      await call('Input.dispatchMouseEvent',{type:'mouseWheel',x:config.x,y:config.y,deltaX:0,deltaY:config.deltaY},sessionId);
      await call('Target.detachFromTarget',{sessionId});
    }finally{clearTimeout(timer);ws.close()}
  `;
  execFileSync(process.execPath,['--input-type=module','-e',code,JSON.stringify({cdpUrl,base,x,y,deltaY})],{encoding:'utf8',timeout:15000,maxBuffer:1024*1024});
}
const dailySnapshot=`JSON.stringify([GameSharpGoldDailyLoop.key,GameSharpMainDaily.key,'gamesharp_challenges_done','gamesharp_streak'].map(k=>[k,localStorage.getItem(k)]))`;
const layout=`const scroll=q('#gspcOverlay .gspc-scroll');check(scroll.scrollWidth<=scroll.clientWidth+1,'Sharpen horizontal overflow');for(const el of all('.gspc-stage article,.gspc-stage form,.gspc-stage section,.gspc-stage button,.gspc-stage select')){check(el.scrollWidth<=el.clientWidth+1,'Content overflows '+el.className);if(el.matches('button,select')&&el.getClientRects().length)check(el.getBoundingClientRect().height>=44,'Touch target under 44px: '+el.textContent.trim());}`;
const complete=`for(let i=0;i<3;i++){const c=GameSharpGoldDaily.challenges.find(c=>c.id==='gold_contact_point_v1');all('[data-gd-action="answer"]')[c.steps[i].correct].click();await pause(90);click('[data-gd-action="next"]');await pause(90);}check(q('.gs-gold-daily-pro-story'),'Actual Contact payoff missing');`;
function open(url=base){
  run('open',url);
  ev(`for(let i=0;i<150&&(!window.GameSharpMainDaily||!window.GameSharpPainCoach);i++)await pause(100);check(window.GameSharpMainDaily&&window.GameSharpPainCoach,'App runtime unavailable');q('[aria-label^="GAMESHARP introduction"]')?.click();await pause(1200);all('[onclick="skipWelcomeOnboarding()"]') .find(e=>e.getClientRects().length)?.click();await pause(600);window.__daily=${dailySnapshot};check(GameSharpGoldDaily.challenges.filter(c=>!c.reviewOnly).length===21,'Original lesson inventory changed');`);
}
function enterContact(){
  ev(`GameSharpPainCoach.openRegion('forehand','sharpen');check(q('[data-path="forehand_crowded_contact"] strong').textContent==='My forehand keeps missing','Pain-first entry unavailable');check(all('[data-path]').length===3,'Forehand expanded into catalogue');`);
  native('[data-path="forehand_crowded_contact"]');
  ev(`await pause(100);check(q('#faspStage')?.children.length,'Approved Contact visual absent');check(!q('#gspcOverlay.open'),'Sharpen remained over actual lesson');`);
}
function finishContact(){ev(complete);native('[data-gd-action="list"]');ev(`await pause(100);check(all('[data-check-match]').length===3,'Missing yes/unsure/no boundary');check(!experiment(),'Lesson completion recorded a court plan/report');check(!GameSharpPainCoach.getData().focus,'Lesson completion saved an unsolicited cue');check(${dailySnapshot}===__daily,'Contact practice changed Daily');`);}
function enterMatchFromFocus(){
  ev(`GameSharpPainCoach.openLessonFocus('gold_contact_point_v1','sharpen');check(q('[data-court-check]'),'Local review entry missing');`);
  native('[data-court-check]');ev(`check(q('[data-check-match="yes"]'),'Match choice missing');`);
}
function plan(){
  native('[data-check-match="yes"]');ev(`check(q('[data-check-plan]'),'Matched spacing has no practical plan');check(!experiment(),'Showing the plan saved it automatically');${layout}`);
  native('[data-check-plan]');ev(`check(experiment()?.plannedAt&&!experiment().report,'Planning must not imply a reported trial');const f=GameSharpPainCoach.getData().focus;check(f?.lessonId==='gold_contact_point_v1'&&!f.practicedAt&&!f.feedback,'Plan mutated practice or saved a different cue');check(q('#gspcOverlay').textContent.includes(GameSharpForehandCheck.definition.cue),'Actual experiment cue absent from plan');check(q('[data-check-record]'),'Explicit report entry missing');check(${dailySnapshot}===__daily,'Plan changed Daily');`);
}
function fillReport(comparable='true',spacing='more-room'){
  native('[name="beforeMisses"]','select','5');native('[name="afterMisses"]','select','3');native('[name="spacing"]','select',spacing);native('[name="comparable"]','select',comparable);
}

console.log('Evidence: '+out);
for(const width of widths){
  record(width+' pain-to-lesson-to-explicit-experiment',()=>own('full-'+width,width,()=>{
    open();enterContact();shot(width+'-contact');finishContact();ev(layout);shot(width+'-match');plan();shot(width+'-planned-untried');
    native('[data-check-record]');ev(`check(all('select[required]').length===4,'All four observations need explicit selection');check(!experiment().report,'Opening a report counted as a trial');${layout}`);shot(width+'-report-empty');
    native('[data-check-submit]');ev(`check(!experiment().report,'An incomplete report was accepted');check(q('[name="beforeMisses"]'),'Incomplete submission left form');`);
    fillReport();native('[data-check-submit]');
    ev(`const e=experiment();check(e.report.beforeMisses===5&&e.report.afterMisses===3&&e.report.spacing==='more-room'&&e.report.comparable===true,'Explicit report payload differs');check(!q('[data-check-submit]'),'Saved report remains editable');check(GameSharpPainCoach.getData().focus.practicedAt&&!GameSharpPainCoach.getData().focus.feedback,'Explicit court report was not distinguished from inferred improvement');check(${dailySnapshot}===__daily,'Report changed Daily');window.__firstReport=JSON.stringify(e);${layout}`);shot(width+'-reported');
    native('[data-check-plan-review]');ev(`check(q('#gspcOverlay').textContent.includes(GameSharpForehandCheck.definition.cue),'Read-only review lost original cue');check(!q('[data-check-plan]')&&!q('[data-check-record]')&&!q('[data-check-submit]'),'Plan review can overwrite experiment');check(JSON.stringify(experiment())===__firstReport,'Plan review changed first result');${layout}`);shot(width+'-readonly-plan');native('[data-check-result]');
    native('#gspcOverlay .gspc-back');ev(`check(q('.gspc-court-card'),'Result Back lost canonical focus');`);native('[data-court-check]');ev(`check(JSON.stringify(experiment())===__firstReport,'Reopening changed first report');check(!q('[data-check-submit]'),'Reopening allows result overwrite');`);
    run('reload');ev(`for(let i=0;i<120&&!window.GameSharpPainCoach;i++)await pause(100);GameSharpPainCoach.open('sharpen');check(q('[data-saved-focus]'),'Saved focus unavailable after reload');`);native('[data-saved-focus]');native('[data-court-check]');ev(`check(experiment().report.afterMisses===3&&!q('[data-check-submit]'),'Reload lost immutable result');${layout}`);shot(width+'-result-after-reload');
  }));
}

record('uncertain and nonmatching observations do not prescribe a correction',()=>own('boundaries',430,()=>{
  open();enterMatchFromFocus();native('[data-check-match="unsure"]');ev(`check(!q('[data-check-plan]')&&!q('[data-check-record]'),'Unsure observation prescribes intervention');check(!experiment(),'Unsure wrote an experiment');${layout}`);shot('430-unsure');
  native('#gspcOverlay .gspc-back');ev(`check(q('[data-check-match="no"]'),'Unsure Back lost recognition choice');`);native('[data-check-match="no"]');ev(`check(!q('[data-check-plan]')&&!q('[data-check-record]'),'Nonmatching concern prescribes spacing');check(!experiment(),'Nonmatch wrote experiment');${layout}`);shot('430-not-a-match');
  native('#gspcOverlay .gspc-back');native('#gspcOverlay .gspc-back');ev(`check(q('.gspc-court-card'),'Match Back lost exact cue');check(${dailySnapshot}===__daily,'Boundary navigation changed Daily');`);
}));

record('noncomparable report is recorded without an improvement conclusion',()=>own('noncomparable',430,()=>{
  open();enterMatchFromFocus();plan();native('[data-check-record]');fillReport('false','unsure');native('[data-check-submit]');
  ev(`check(experiment().report.comparable===false&&experiment().report.spacing==='unsure','Noncomparable or unsure data discarded');const text=q('#gspcOverlay').textContent;check(/compar|different|cannot|can’t|can't/i.test(text),'Noncomparable result omits its boundary');check(!/fixed your|you improved|spacing caused|fault solved/i.test(text),'Noncomparable result claims correction');${layout}`);shot('430-noncomparable-result');
}));

record('native early exit, Back and Escape leave no false progress',()=>own('native',430,()=>{
  open();enterContact();native('[data-gd-action="close"]');ev(`await pause(100);check(q('[data-path="forehand_crowded_contact"]'),'Early lesson exit lost Forehand region');check(!experiment()&&!GameSharpPainCoach.getData().focus,'Early exit wrote court state');`);
  enterMatchFromFocus();native('#gspcOverlay .gspc-back');ev(`check(q('.gspc-court-card'),'Native Back did not return to cue');`);native('[data-court-check]');native('#gspcOverlay .gspc-close');ev(`check(!q('#gspcOverlay.open'),'Native Exit left overlay open');check(!experiment(),'Native Exit created progress');`);
  enterMatchFromFocus();run('snapshot','-i');run('press','Escape');ev(`check(!q('#gspcOverlay.open'),'Native Escape left overlay open');check(!experiment()&&${dailySnapshot}===__daily,'Native exits changed progress');`);shot('430-native-home');
}));

record('same-session switch cannot attach the forehand experiment to another lesson',()=>own('switch-lesson',430,()=>{
  open();enterContact();finishContact();native('#gspcOverlay .gspc-back');native('#gspcOverlay .gspc-back');
  ev(`check(q('[data-path]'),'Back did not return to Forehand concerns');const p=GameSharpSharpenPaths.paths.find(p=>p.region==='forehand'&&p.lessonId!=='gold_contact_point_v1');check(p,'No different approved Forehand path');click('[data-path="'+p.id+'"]');await pause(100);for(let i=0;i<3;i++){const c=GameSharpGoldDaily.challenges.find(c=>c.id===p.lessonId);all('[data-gd-action="answer"]')[c.steps[i].correct].click();await pause(90);click('[data-gd-action="next"]');await pause(90);}click('[data-gd-action="list"]');await pause(100);const c=GameSharpGoldDaily.challenges.find(c=>c.id===p.lessonId);check(q('.gspc-court-card blockquote')?.textContent===c.memory,'Different lesson lost its canonical cue');check(!q('[data-check-match]')&&!q('[data-court-check]'),'Contact experiment leaked onto another lesson');check(!experiment()&&${dailySnapshot}===__daily,'Lesson switch changed unrelated state');`);shot('430-no-cross-lesson-leak');
}));

record('native Daily-origin experiment returns to exact Daily',()=>own('daily-return',430,()=>{
  open();ev(`window.__RealDate=Date;let day;for(let i=0;i<30;i++){const d=new __RealDate(2026,8,14+i,12),s=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');if(GameSharpGoldDailyLoop.lessonFor(s)==='gold_contact_point_v1'){day=s;break;}}check(day,'No scheduled Contact fixture');window.__contactDay=day;window.Date=class extends __RealDate{constructor(...args){super(...(args.length?args:[day+'T12:00:00']))}};startDailyChallenge();click('[data-gd-action="daily-start"]');${complete}check(GameSharpMainDaily.completed(day),'Contact Daily not completed');window.__daily=${dailySnapshot};click('[data-gd-action="daily-sharpen"]');`);
  native('[data-court-check]');native('#gspcOverlay .gspc-close');ev(`await pause(120);check(q('[data-gd-action="daily-start"]')?.getClientRects().length,'Native experiment Exit lost Daily origin');check(!q('#gspcOverlay.open'),'Sharpen still open after Daily return');check(${dailySnapshot}===__daily,'Daily return changed credit/history');`);shot('430-experiment-daily-return');
}));

record('saved partial Daily survives complete court-check planning',()=>own('partial',430,()=>{
  open();ev(`startDailyChallenge();click('[data-gd-action="daily-start"]');click('[data-gd-action="answer"]');await pause(90);click('[data-gd-action="list"]');window.__daily=${dailySnapshot};check(localStorage.getItem(GameSharpGoldDailyLoop.key),'Partial Daily fixture absent');click('[data-gd-action="close"]');`);
  enterContact();finishContact();plan();native('#gspcOverlay .gspc-close');ev(`GameSharpGoldDaily.openDaily();check(q('[data-gd-action="daily-start"]').textContent.includes('Resume'),'Partial Daily cannot resume');check(${dailySnapshot}===__daily,'Court check changed partial Daily');`);shot('430-partial-preserved');
}));

record('200 percent text, form controls and keyboard remain usable',()=>own('large-text',320,()=>{
  open();ev(`document.documentElement.style.fontSize='200%';`);enterMatchFromFocus();ev(layout);shot('320-match-200percent');plan();ev(layout);shot('320-plan-200percent');native('[data-check-record]');ev(layout);shot('320-form-200percent');
  ev(`q('[name="comparable"]').focus();`);run('press','Tab');ev(`check(document.activeElement===q('[data-check-submit]'),'Form keyboard order skips submit');`);
  ev(`const controls=all('#gspcOverlay button:not([disabled]),#gspcOverlay a[href],#gspcOverlay select:not([disabled]),#gspcOverlay input:not([disabled]),#gspcOverlay textarea:not([disabled]),#gspcOverlay [tabindex="0"]').filter(e=>e.getClientRects().length);controls.at(-1).focus();`);run('press','Tab');ev(`check(document.activeElement===q('.gspc-back'),'Keyboard escaped dialog');`);run('press','Shift+Tab');ev(`check(q('#gspcOverlay').contains(document.activeElement),'Reverse keyboard escaped dialog');`);
}));

for(const asset of ['gamesharp-forehand-check.js','gamesharp-forehand-check-state.js']){
  record('missing '+asset+' leaves only approved baseline lesson',()=>own('missing-'+asset.replace(/\W/g,''),430,()=>{
    run('network','route','**/'+asset+'*','--abort');open();ev(`GameSharpPainCoach.openRegion('forehand','sharpen');check(q('[data-path="forehand_crowded_contact"] strong').textContent==='Contact feels crowded','Unavailable prototype promises unsupported experiment');check(all('[data-path]').length===3,'Missing prototype changed approved routes');click('[data-path="forehand_crowded_contact"]');await pause(100);${complete}click('[data-gd-action="list"]');await pause(100);check(q('.gspc-court-card')&&!q('[data-court-check]')&&!q('[data-check-match]'),'Missing prototype bypassed withholding');check(!experiment(),'Missing module created an experiment');`);shot('missing-'+asset);
  }));
}

record('normal URL retains nineteen concerns and opens the authorized forehand beta by default',()=>own('baseline',430,()=>{
  open(normal.href);ev(`check(GameSharpSharpenPaths.paths.length===19,'Baseline concern inventory changed');check(GameSharpCourtChecks.release.status==='user_authorized_beta'&&GameSharpCourtChecks.release.experimentIds.includes('forehand-space-check-v1'),'Forehand lacks explicit beta authorization');`);enterContact();finishContact();ev(`check(q('[data-check-match="yes"]'),'Normal URL does not expose the authorized experiment');check(!experiment(),'Normal lesson wrote experiment');`);shot('430-default-beta');
}));

record('blocked experiment persistence is explicit and retains this visit result',()=>own('storage',430,()=>{
  open();ev(`const proto=Storage.prototype,get=proto.getItem,set=proto.setItem;proto.getItem=function(k){if(k==='${experimentKey}')throw Error('fixture blocked experiment read');return get.call(this,k)};proto.setItem=function(k,v){if(k==='${experimentKey}')throw Error('fixture blocked experiment write');return set.call(this,k,v)};`);
  enterMatchFromFocus();native('[data-check-match="yes"]');native('[data-check-plan]');ev(`check(/visit|page stays open|unavailable/i.test(q('#gspcOverlay').textContent),'Memory-only experiment has no persistence warning');`);shot('430-experiment-storage-unavailable');native('[data-check-record]');fillReport();native('[data-check-submit]');ev(`check(!q('[data-check-submit]'),'Memory report was not accepted');check(/visit|page stays open|unavailable/i.test(q('#gspcOverlay').textContent),'Memory result has no persistence warning');check(${dailySnapshot}===__daily,'Blocked experiment storage changed Daily');`);shot('430-experiment-memory-result');native('#gspcOverlay .gspc-back');native('[data-court-check]');ev(`check(!q('[data-check-match]')&&!q('[data-check-submit]'),'Memory result lost on reopening');`);
}));

for(const width of [320,430]){
  record(width+' coordinate wheel reaches original source details',()=>own('wheel-'+width,width,()=>{
    open();enterMatchFromFocus();native('[data-check-match="yes"]');
    const before=JSON.parse(ev(`const s=q('.gspc-scroll'),r=s.getBoundingClientRect();check(s.scrollTop===0,'Wheel proof must start at top');window.__wheelBefore=s.scrollTop;window.__wheelEvents=[];document.addEventListener('wheel',e=>{const event={x:e.clientX,y:e.clientY,trusted:e.isTrusted,target:e.target.className};__wheelEvents.push(event);setTimeout(()=>event.prevented=e.defaultPrevented,0)},{capture:true,passive:true});return {x:Math.floor((r.left+r.right)/2),y:Math.floor((r.top+r.bottom)/2),scrollTop:s.scrollTop,max:s.scrollHeight-s.clientHeight};`));
    coordinateWheel(before.x,before.y,3000);
    const after=JSON.parse(ev(`await pause(400);const s=q('.gspc-scroll'),r=s.getBoundingClientRect(),summary=q('.gspc-check-sources summary'),t=summary.getBoundingClientRect(),event=__wheelEvents.at(-1);check(s.scrollTop>__wheelBefore,'Coordinate wheel did not move nested scroll');check(event?.trusted&&event.x===${before.x}&&event.y===${before.y}&&!event.prevented,'Wheel did not reach actual supplied coordinates');check(t.top>=r.top&&t.bottom<=r.bottom,'Source summary not genuinely wheel-reachable');return {scrollTop:s.scrollTop,max:s.scrollHeight-s.clientHeight,event,sourceSummary:{top:t.top,bottom:t.bottom},scrollViewport:{top:r.top,bottom:r.bottom}};`));
    shot(width+'-wheel-source-summary');native('.gspc-check-sources summary');
    coordinateWheel(before.x,before.y,3000);
    const expanded=JSON.parse(ev(`await pause(400);const s=q('.gspc-scroll'),r=s.getBoundingClientRect(),details=q('.gspc-check-sources'),last=details.querySelector('a:last-child'),t=last.getBoundingClientRect();check(details.open,'Native source summary did not expand');check(t.top>=r.top&&t.bottom<=r.bottom,'Last original source is not wheel-reachable');return {scrollTop:s.scrollTop,lastSource:{top:t.top,bottom:t.bottom,text:last.textContent}};`));
    shot(width+'-wheel-expanded-sources');(report.wheelMeasurements??=[]).push({width,before,after,expanded});
  }));
}

save();console.log(JSON.stringify({out,passed:report.checks.length,failed:report.failures.length}));
if(report.failures.length)process.exitCode=1;
