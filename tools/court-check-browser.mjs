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
const widths=(process.env.GS_COURT_WIDTHS||'320,430,1280').split(',').map(Number);
const selected=process.env.GS_COURT_CHECKS?new RegExp(process.env.GS_COURT_CHECKS):null;
const out=fs.mkdtempSync(path.join(os.tmpdir(),'gs-court-check-'));
const report={base,out,checks:[],failures:[]};
const experimentKey='gamesharp_court_checks_v1';
let session;
const run=(...args)=>execFileSync(bin,['--session',session,...args],{encoding:'utf8',timeout:60000,maxBuffer:1024*1024});
const ev=body=>run('eval',`(async()=>{const pause=ms=>new Promise(r=>setTimeout(r,ms)),q=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)],click=s=>{const e=q(s);if(!e)throw Error('Missing '+s);e.click()},check=(v,m)=>{if(!v)throw Error(m)},experiment=id=>JSON.parse(localStorage.getItem('${experimentKey}')||'null')?.experiments?.[id]||null;${body}})()`);
const shot=name=>run('screenshot',path.join(out,name+'.png'));
const save=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
function record(name,fn){
  if(selected&&!selected.test(name))return;
  try{fn();report.checks.push({name,status:'PASS'});console.log('PASS '+name);}
  catch(error){const message=String(error.stderr||error.message);report.failures.push({name,message});console.error('FAIL '+name+': '+message.split('\n')[0]);}
  save();
}
function own(name,width,fn){
  session='gs-court-'+process.pid+'-'+name;
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

const fixtures=[
  {id:'return-position-check-v1',lessonId:'gold_return_position_v1',region:'serve_return',pathId:'serve_return_crowded',label:'Fast serves rush my return',report:{contact:'more-time',cost:'none-noticed',comparable:'true'}},
  {id:'next-point-reset-check-v1',lessonId:'gold_miss_two_points_v1',region:'mindset',pathId:'mindset_after_miss',label:'One miss leads to another',report:{opportunity:'comparable-ball',routine:'used',intention:'clear'}},
  {id:'approach-volley-check-v1',lessonId:'gold_approach_volley_v1',region:'net',pathId:'net_first_volley',label:'My first volley is always difficult',report:{opponentContact:'deeper',volleyHeight:'higher',approachCost:'none-noticed',comparable:'true'}}
];
function open(url=base){
  run('open',url);run('snapshot','-i');
  ev(`for(let i=0;i<150&&(!window.GameSharpMainDaily||!window.GameSharpPainCoach);i++)await pause(100);check(window.GameSharpMainDaily&&window.GameSharpPainCoach,'App runtime unavailable');q('[aria-label^="GAMESHARP introduction"]')?.click();await pause(1200);all('[onclick="skipWelcomeOnboarding()"]') .find(e=>e.getClientRects().length)?.click();await pause(600);window.__daily=${dailySnapshot};check(GameSharpGoldDaily.challenges.filter(c=>!c.reviewOnly).length===21,'Original lesson inventory changed');`);
}
function enter(f){
  ev(`GameSharpPainCoach.openRegion(${JSON.stringify(f.region)},'sharpen');check(q('[data-path="${f.pathId}"] strong').textContent===${JSON.stringify(f.label)},'Wrong pain-first invitation');check(all('[data-path]').length<=3,'Area expanded into a catalogue');`);
  native('[data-path="'+f.pathId+'"]');
  ev(`await pause(100);check(!q('#gspcOverlay.open'),'Sharpen obscures its actual lesson');const c=GameSharpGoldDaily.challenges.find(c=>c.id==='${f.lessonId}');check(c&&q('[data-gd-action="answer"]'),'Exact approved lesson unavailable');`);
}
function complete(f){
  ev(`for(let i=0;i<3;i++){const c=GameSharpGoldDaily.challenges.find(c=>c.id==='${f.lessonId}');all('[data-gd-action="answer"]')[c.steps[i].correct].click();await pause(90);click('[data-gd-action="next"]');await pause(90);}check(q('.gs-gold-daily-pro-story'),'Actual lesson payoff missing');`);
}
function finish(f,{fresh=true}={}){
  complete(f);native('[data-gd-action="list"]');
  ev(`await pause(100);check(all('[data-check-match="yes"],[data-check-match="unsure"],[data-check-match="no"]').length===3,'Missing three-way recognition boundary');${fresh?`check(!experiment('${f.id}'),'Lesson completion recorded a court plan');check(!GameSharpPainCoach.getData().focus,'Lesson completion saved a cue automatically');`:''}check(${dailySnapshot}===__daily,'Unscored practice changed Daily');`);
}
function focus(f){
  ev(`GameSharpPainCoach.openLessonFocus('${f.lessonId}','sharpen');check(q('[data-court-check]'),'Local check entry missing');`);
  native('[data-court-check]');
}
function plan(f){
  native('[data-check-match="yes"]');ev(`check(q('[data-check-plan]'),'Matching observation has no plan');check(!experiment('${f.id}'),'Viewing a plan saved it automatically');check(q('#gspcOverlay').textContent.includes(GameSharpCourtChecks.byId['${f.id}'].plan.blocks.find(b=>b.cue).cue),'Exact practical cue absent');${layout}`);
  native('[data-check-plan]');
  ev(`const e=experiment('${f.id}'),f=GameSharpPainCoach.getData().focus;check(e?.plannedAt&&!e.report,'Planning fabricates a court report');check(e.experimentId==='${f.id}'&&e.lessonId==='${f.lessonId}','Wrong experiment binding');check(f?.lessonId==='${f.lessonId}'&&!f.practicedAt&&!f.feedback,'Plan marks practice or unrelated focus');check(q('[data-check-record]'),'Explicit report entry absent');check(${dailySnapshot}===__daily,'Plan changed Daily');`);
}
function fill(payload){for(const [key,value] of Object.entries(payload))native('[name="'+key+'"]','select',value);}
function submit(f,payload=f.report){fill(payload);native('[data-check-submit]');ev(`check(experiment('${f.id}')?.report,'Explicit observation not saved');check(!q('[data-check-submit]'),'Saved result remains editable');${layout}`);}

console.log('Evidence: '+out);
for(const width of widths)for(const f of fixtures){
  record(width+' '+f.id+' full lesson and explicit court report',()=>own('full-'+width+'-'+f.id,width,()=>{
    open();enter(f);shot(width+'-'+f.id+'-lesson');finish(f);ev(layout);shot(width+'-'+f.id+'-match');plan(f);shot(width+'-'+f.id+'-planned');
    native('[data-check-record]');ev(`check(all('select[required]').length===${Object.keys(f.report).length},'Required observations missing');check(all('select[required]').every(el=>el.value===''),'Report invents preselected observations');check(!experiment('${f.id}').report,'Entering form records practice');${layout}`);shot(width+'-'+f.id+'-empty-form');
    native('[data-check-submit]');ev(`check(!experiment('${f.id}').report&&q('[data-check-submit]'),'Empty report accepted');`);
    submit(f);ev(`const r=experiment('${f.id}').report;for(const [key,value] of Object.entries(${JSON.stringify(f.report)}))check(r[key]===(key==='comparable'?value==='true':value),'Report value/type differs: '+key);const focus=GameSharpPainCoach.getData().focus;check(focus.practicedAt&&!focus.feedback,'Explicit practice became inferred improvement');check(${dailySnapshot}===__daily,'Report changed Daily');window.__first=JSON.stringify(experiment('${f.id}'));`);shot(width+'-'+f.id+'-result');
    native('[data-check-plan-review]');ev(`check(q('#gspcOverlay').textContent.includes(GameSharpCourtChecks.byId['${f.id}'].plan.blocks.find(b=>b.cue).cue),'Read-only review lost original cue');check(!q('[data-check-plan]')&&!q('[data-check-record]')&&!q('[data-check-submit]'),'Instruction review permits overwrite');check(JSON.stringify(experiment('${f.id}'))===__first,'Review changed report');${layout}`);shot(width+'-'+f.id+'-readonly-plan');native('[data-check-result]');
    native('#gspcOverlay .gspc-back');ev(`check(q('.gspc-court-card blockquote').textContent===GameSharpGoldDaily.challenges.find(c=>c.id==='${f.lessonId}').memory,'Back lost exact canonical cue');`);native('[data-court-check]');ev(`check(JSON.stringify(experiment('${f.id}'))===__first&&!q('[data-check-submit]'),'Reopening changes first report');`);
    run('reload');ev(`for(let i=0;i<120&&!window.GameSharpPainCoach;i++)await pause(100);GameSharpPainCoach.open('sharpen');check(q('[data-saved-focus]'),'Saved cue unavailable after reload');`);native('[data-saved-focus]');native('[data-court-check]');ev(`check(experiment('${f.id}').report&&q('[data-check-plan-review]'),'Reload lost first observation');check(!q('[data-check-submit]'),'Reload makes report editable');${layout}`);shot(width+'-'+f.id+'-reload');
  }));
}

for(const f of fixtures){
  record(f.id+' uncertainty and no match withhold a prescription',()=>own('boundary-'+f.id,430,()=>{
    open();focus(f);native('[data-check-match="unsure"]');ev(`check(!q('[data-check-plan]')&&!q('[data-check-record]'),'Unsure prescribes a trial');check(!experiment('${f.id}'),'Unsure saved an experiment');${layout}`);shot(f.id+'-unsure');
    native('#gspcOverlay .gspc-back');native('[data-check-match="no"]');ev(`check(!q('[data-check-plan]')&&!q('[data-check-record]'),'No match prescribes a trial');check(!experiment('${f.id}'),'No match saved an experiment');${layout}`);shot(f.id+'-no-match');
    native('#gspcOverlay .gspc-back');native('#gspcOverlay .gspc-back');ev(`check(q('.gspc-court-card'),'Recognition Back lost canonical cue');check(${dailySnapshot}===__daily,'Boundary changes Daily');`);
  }));
}

record('mental no-miss opportunity stores observation without claiming the routine was tried',()=>own('mental-no-opportunity',430,()=>{
  const f=fixtures[1];open();focus(f);plan(f);native('[data-check-record]');submit(f,{opportunity:'no-miss',routine:'not-used',intention:'unsure'});
  ev(`check(experiment('${f.id}').report.opportunity==='no-miss','No-opportunity report discarded');const focus=GameSharpPainCoach.getData().focus;check(!focus.practicedAt&&!focus.feedback,'No opportunity became court practice');check(!/you improved|routine worked|fault solved/i.test(q('#gspcOverlay').textContent),'No opportunity interpreted as success');`);shot('mental-no-opportunity-result');
}));

for(const f of [fixtures[0],fixtures[2]]){
  record(f.id+' noncomparable conditions remain inconclusive',()=>own('inconclusive-'+f.id,430,()=>{
    open();focus(f);plan(f);native('[data-check-record]');submit(f,{...f.report,comparable:'false'});
    ev(`check(experiment('${f.id}').report.comparable===false,'Noncomparable report discarded');const interpretation=q('.gspc-region-head').textContent;check(/inconclusive/i.test(interpretation),'Changed conditions lack an inconclusive reading');check(!/you improved|fault solved|guaranteed improvement/i.test(interpretation),'Noncomparable interpretation overclaims');${layout}`);shot(f.id+'-inconclusive');
  }));
}

for(const f of [fixtures[0],fixtures[2]]){
  record(f.id+' known cost is not hidden by uncertain contact',()=>own('known-cost-'+f.id,430,()=>{
    open();focus(f);plan(f);native('[data-check-record]');
    const payload=f.id==='return-position-check-v1'?{contact:'unsure',cost:'more-misses',comparable:'true'}:{opponentContact:'unsure',volleyHeight:'no-volley',approachCost:'more-misses',comparable:'true'};
    submit(f,payload);
    ev(`const heading=q('.gspc-region-head').textContent;check(/cost/i.test(heading)&&/misses/i.test(heading),'Known misses disappeared behind an uncertain field');check(!/signal to recheck|better start|more comfortable volley/i.test(q('#gspcTitle').textContent),'Known cost becomes a success headline');check(${dailySnapshot}===__daily,'Cost report changed Daily');`);shot(f.id+'-known-cost-uncertain-contact');
  }));
}

record('same-session switching isolates drafts and each immutable report',()=>own('isolation',430,()=>{
  open();const first=fixtures[0];focus(first);plan(first);native('[data-check-record]');native('[name="contact"]','select','less-time');
  for(const f of fixtures.slice(1)){
    enter(f);finish(f,{fresh:false});plan(f);native('[data-check-record]');ev(`check(all('select[required]').every(el=>el.value===''),'Another journey imported a draft');`);submit(f);
  }
  ev(`window.__other=JSON.stringify(GameSharpPainCoach.getData().focus);window.__otherReports=JSON.stringify([experiment('${fixtures[1].id}'),experiment('${fixtures[2].id}')]);`);
  focus(first);ev(`check(q('[data-check-record]'),'Return did not resume its own planned check');`);native('[data-check-record]');submit(first);
  ev(`check(JSON.stringify(GameSharpPainCoach.getData().focus)===__other,'Reporting an older check marked another saved focus');check(JSON.stringify([experiment('${fixtures[1].id}'),experiment('${fixtures[2].id}')])===__otherReports,'Older report overwrote another result');check(!localStorage.getItem('gamesharp_forehand_check_v1'),'New checks wrote the original forehand key');check(${dailySnapshot}===__daily,'Switches changed Daily');`);shot('same-session-isolated-results');
}));

record('native early exit, Back, Exit and Escape preserve the actual origin',()=>own('native-navigation',430,()=>{
  open();for(const f of fixtures){
    enter(f);native('[data-gd-action="close"]');ev(`await pause(100);check(q('[data-path="${f.pathId}"]'),'Early lesson Exit lost exact concern area');check(!experiment('${f.id}'),'Early exit records a check');`);
    focus(f);native('#gspcOverlay .gspc-back');ev(`check(q('.gspc-court-card'),'Native Back lost cue');`);native('[data-court-check]');native('#gspcOverlay .gspc-close');ev(`check(!q('#gspcOverlay.open'),'Native Exit leaves overlay open');`);
    focus(f);run('snapshot','-i');run('press','Escape');ev(`check(!q('#gspcOverlay.open')&&!experiment('${f.id}'),'Escape fabricates progress or loses dismissal');`);
  }ev(`check(${dailySnapshot}===__daily,'Native navigation changed Daily');`);
}));

for(const [index,f] of fixtures.entries()){
  record(f.id+' native Daily-origin return',()=>own('daily-'+f.id,430,()=>{
    open();ev(`window.__RealDate=Date;let day;for(let i=0;i<100;i++){const d=new __RealDate(2026,8,14+i,12),s=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');if(GameSharpGoldDailyLoop.lessonFor(s)==='${f.lessonId}'){day=s;break;}}check(day,'Scheduled exact Daily fixture absent');window.Date=class extends __RealDate{constructor(...args){super(...(args.length?args:[day+'T12:00:00']))}};startDailyChallenge();click('[data-gd-action="daily-start"]');`);complete(f);
    ev(`window.__daily=${dailySnapshot};click('[data-gd-action="daily-sharpen"]');`);native('[data-court-check]');
    if(index===0){native('#gspcOverlay .gspc-back');native('#gspcOverlay .gspc-back');}
    else if(index===1)native('#gspcOverlay .gspc-close');
    else{run('snapshot','-i');run('press','Escape');}
    ev(`await pause(150);check(q('[data-gd-action="daily-start"]')?.getClientRects().length,'Native return lost exact Daily origin');check(!q('#gspcOverlay.open'),'Sharpen covers returned Daily');check(${dailySnapshot}===__daily,'Daily return changed its history');`);shot(f.id+'-daily-return');
  }));
}

record('saved partial Daily survives the complete new batch',()=>own('partial-daily',430,()=>{
  open();ev(`startDailyChallenge();click('[data-gd-action="daily-start"]');click('[data-gd-action="answer"]');await pause(90);click('[data-gd-action="list"]');window.__daily=${dailySnapshot};check(localStorage.getItem(GameSharpGoldDailyLoop.key),'Partial fixture absent');click('[data-gd-action="close"]');`);
  for(const f of fixtures){enter(f);finish(f,{fresh:false});plan(f);native('#gspcOverlay .gspc-close');}
  ev(`GameSharpGoldDaily.openDaily();check(q('[data-gd-action="daily-start"]').textContent.includes('Resume'),'Partial Daily cannot resume');check(${dailySnapshot}===__daily,'Court plans changed the saved Daily');`);shot('batch-partial-daily-preserved');
}));

for(const f of fixtures){
  record(f.id+' 200 percent text and native keyboard controls',()=>own('text-'+f.id,320,()=>{
    open();ev(`document.documentElement.style.fontSize='200%';`);focus(f);ev(layout);shot(f.id+'-320-match-large-text');plan(f);shot(f.id+'-320-plan-large-text');native('[data-check-record]');ev(layout);shot(f.id+'-320-form-large-text');
    ev(`all('select[required]').at(-1).focus();`);run('press','Tab');ev(`check(document.activeElement===q('[data-check-submit]'),'Keyboard order skips submit');`);
    run('press','Tab');ev(`check(document.activeElement===q('.gspc-back'),'Keyboard escapes dialog');`);run('press','Shift+Tab');ev(`check(document.activeElement===q('[data-check-submit]'),'Reverse keyboard escapes dialog');`);
  }));
}

for(const asset of ['gamesharp-court-checks.js','gamesharp-court-check-state.js']){
  record('missing '+asset+' withholds new checks without replacing lessons',()=>own('missing-'+asset.replace(/\W/g,''),430,()=>{
    run('network','route','**/'+asset+'*','--abort');open();for(const f of fixtures){
      ev(`GameSharpPainCoach.openRegion('${f.region}','sharpen');check(q('[data-path="${f.pathId}"] strong').textContent===GameSharpSharpenPaths.byId['${f.pathId}'].label,'Unavailable check still promises an intervention');`);native('[data-path="'+f.pathId+'"]');complete(f);native('[data-gd-action="list"]');
      ev(`await pause(100);check(q('.gspc-court-card')&&!q('[data-court-check]')&&!q('[data-check-match="yes"]'),'Missing required module bypassed withholding');check(!experiment('${f.id}'),'Missing module creates progress');`);
    }
  }));
}

record('normal public entry exposes exactly four authorized checks and no other lesson gains a check',()=>own('gate',430,()=>{
  for(const url of [normal.href,normal.href+'?forehandCheck=1']){
    open(url);ev(`check(GameSharpCourtChecks.release.status==='user_authorized_beta','Wrong release status');check(GameSharpCourtChecks.release.experimentIds.length===4,'Wrong released experiment count');check(GameSharpSharpenPaths.paths.length===19,'Concern inventory changed');const found=[];for(const c of GameSharpGoldDaily.challenges.filter(c=>!c.reviewOnly)){GameSharpPainCoach.openLessonFocus(c.id,'sharpen');const d=GameSharpCourtChecks.byLessonId[c.id];if(q('[data-court-check]')){check(d&&GameSharpCourtChecks.release.experimentIds.includes(d.id),'An unapproved lesson gained a court check');check(d.coachApproved===false,'Beta release became invented coaching approval');found.push(d.id)}else check(!d,'Authorized exact check unavailable')}check(found.length===4&&new Set(found).size===4,'Expected exactly four distinct checks');check(!localStorage.getItem('${experimentKey}')&&!localStorage.getItem('gamesharp_forehand_check_v1'),'Inventory inspection wrote practice state');`);
    for(const f of fixtures)ev(`GameSharpPainCoach.openRegion('${f.region}','sharpen');check(q('[data-path="${f.pathId}"] strong').textContent===${JSON.stringify(f.label)},'Authorized pain-first invitation missing');`);
  }
}));

record('missing or invalid beta release metadata withholds all four despite old flags',()=>own('release-missing',430,()=>{
  const flagged=new URL(normal);flagged.search='?sharpenChecks=1&forehandCheck=1';open(flagged.href);
  ev(`const original=GameSharpCourtChecks;for(const d of original.definitions){for(const release of [null,{status:'local_review',experimentIds:original.release.experimentIds},{status:'user_authorized_beta',experimentIds:original.release.experimentIds.filter(id=>id!==d.id)}]){window.GameSharpCourtChecks={...original,release};GameSharpPainCoach.openRegion(d.region,'sharpen');check(q('[data-path="'+d.pathId+'"] strong').textContent===GameSharpSharpenPaths.byId[d.pathId].label,'Withheld beta still promises a check');GameSharpPainCoach.openLessonFocus(d.lessonId,'sharpen');check(q('.gspc-court-card')&&!q('[data-court-check]'),'Unavailable release bypasses withholding')}}window.GameSharpCourtChecks=original;check(!localStorage.getItem('${experimentKey}')&&!localStorage.getItem('gamesharp_forehand_check_v1'),'Release failures recorded practice');check(${dailySnapshot}===__daily,'Release failure changes Daily');`);
}));

record('blocked shared storage keeps isolated visit-only results and warns honestly',()=>own('blocked-storage',430,()=>{
  open();ev(`const proto=Storage.prototype,get=proto.getItem,set=proto.setItem;proto.getItem=function(k){if(k==='${experimentKey}')throw Error('fixture blocked check read');return get.call(this,k)};proto.setItem=function(k,v){if(k==='${experimentKey}')throw Error('fixture blocked check write');return set.call(this,k,v)};`);
  for(const f of fixtures){focus(f);native('[data-check-match="yes"]');native('[data-check-plan]');ev(`check(/visit|page stays open|unavailable/i.test(q('#gspcOverlay').textContent),'Memory-only plan lacks warning');`);native('[data-check-record]');fill(f.report);native('[data-check-submit]');ev(`check(!q('[data-check-submit]')&&q('[data-check-plan-review]'),'Visit report was not accepted');check(/visit|page stays open|unavailable/i.test(q('#gspcOverlay').textContent),'Memory-only result lacks warning');`);}
  for(const f of fixtures){focus(f);ev(`check(q('[data-check-plan-review]')&&!q('[data-check-match="yes"]'),'Another visit result was lost');`);}ev(`check(${dailySnapshot}===__daily,'Storage failure changed Daily');`);shot('shared-visit-only-results');
}));

for(const width of [320,430])for(const f of fixtures){
  record(width+' '+f.id+' genuine coordinate wheel reaches source details',()=>own('wheel-'+width+'-'+f.id,width,()=>{
    open();focus(f);native('[data-check-match="yes"]');
    ev(layout);shot(width+'-'+f.id+'-plan-top');
    const before=JSON.parse(ev(`const s=q('.gspc-scroll'),r=s.getBoundingClientRect();check(s.scrollTop===0,'Wheel proof must start at top');window.__wheelBefore=s.scrollTop;window.__wheelEvents=[];document.addEventListener('wheel',e=>{const event={x:e.clientX,y:e.clientY,trusted:e.isTrusted};__wheelEvents.push(event);setTimeout(()=>event.prevented=e.defaultPrevented,0)},{capture:true,passive:true});return {x:Math.floor((r.left+r.right)/2),y:Math.floor((r.top+r.bottom)/2)};`));
    coordinateWheel(before.x,before.y,4000);
    ev(`await pause(400);const s=q('.gspc-scroll'),r=s.getBoundingClientRect(),t=q('.gspc-check-sources summary').getBoundingClientRect(),event=__wheelEvents.at(-1);check(s.scrollTop>__wheelBefore,'Coordinate wheel did not move nested content');check(event?.trusted&&event.x===${before.x}&&event.y===${before.y}&&!event.prevented,'Wheel did not reach supplied coordinates');check(t.top>=r.top&&t.bottom<=r.bottom,'Source summary not wheel-reachable');`);shot(width+'-'+f.id+'-wheel-summary');native('.gspc-check-sources summary');coordinateWheel(before.x,before.y,4000);
    ev(`await pause(400);const s=q('.gspc-scroll'),r=s.getBoundingClientRect(),details=q('.gspc-check-sources'),t=details.querySelector('a:last-child').getBoundingClientRect();check(details.open&&t.top>=r.top&&t.bottom<=r.bottom,'Last source is not genuinely wheel-reachable');`);shot(width+'-'+f.id+'-wheel-sources');
  }));
}

save();console.log(JSON.stringify({out,passed:report.checks.length,failed:report.failures.length}));
if(report.failures.length)process.exitCode=1;
