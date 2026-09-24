(function(root){
'use strict';
const VERSION='2026-09-14.sharpen-beta.4';
const PLAYER_IMAGE='GS-tennis-player-pose.png';
const PLAYER_REGIONS={
  "mindset": {
    "label": "Mindset",
    "description": "Pressure & confidence",
    "hotspots": [
      {
        "x": 50,
        "y": 6,
        "labelSide": "right",
        "displayLabel": "Mental Game",
        "ariaLabel": "Mental Game: Pressure & confidence",
        "lineAngle": 90
      }
    ]
  },
  "forehand": {
    "label": "Forehand",
    "description": "Contact, shape & timing",
    "hotspots": [
      {
        "x": 9,
        "y": 34,
        "labelSide": "below",
        "lineAngle": 0
      }
    ]
  },
  "backhand": {
    "label": "Backhand",
    "description": "Spacing, timing & shape",
    "hotspots": [
      {
        "x": 91,
        "y": 34,
        "labelSide": "below",
        "lineAngle": 180
      }
    ]
  },
  "serve_return": {
    "label": "Serve & Return",
    "description": "Start the point clearly",
    "hotspots": [
      {
        "x": 91,
        "y": 53,
        "labelSide": "below",
        "lineAngle": 180
      }
    ]
  },
  "net": {
    "label": "Net Play",
    "description": "Approach, position & volley",
    "hotspots": [
      {
        "x": 9,
        "y": 53,
        "labelSide": "below",
        "lineAngle": 0
      }
    ]
  },
  "movement": {
    "label": "Movement",
    "description": "Positioning, footwork & balance",
    "hotspots": [
      {
        "x": 50,
        "y": 88,
        "labelSide": "below",
        "displayLabel": "Movement",
        "ariaLabel": "Movement and Footwork: Balance, recovery and first-step speed",
        "motion": "footwork",
        "lineAngle": -90
      }
    ]
  },
  "decisions": {
    "label": "Decisions",
    "description": "Selection, patterns & reads",
    "hotspots": [
      {
        "x": 15,
        "y": 19,
        "labelSide": "below",
        "displayLabel": "Decision Making",
        "ariaLabel": "Decision Making: Selection, patterns & reads",
        "lineAngle": 0
      }
    ]
  }
};

function auditPlayerRegions(){
  const errors=[],names=new Set();
  for(const [id,r] of Object.entries(PLAYER_REGIONS)){
    for(const h of r.hotspots){
      if(!Number.isFinite(h.x)||!Number.isFinite(h.y)||h.x<0||h.x>100||h.y<0||h.y>100)errors.push(id+': invalid coordinates');
      const name=h.ariaLabel||r.label;
      if(names.has(name))errors.push('duplicate hotspot name');names.add(name);
      if(!Number.isFinite(h.lineAngle))errors.push('missing directional cue');
    }
  }
  const first=id=>PLAYER_REGIONS[id].hotspots[0];
  if(first('forehand').x>15)errors.push('forehand navigation must remain outside the viewer-left silhouette');
  if(first('backhand').x<85)errors.push('backhand navigation must remain outside the viewer-right silhouette');
  if(first('mindset').y>10)errors.push('mental game must remain above the head');
  if(first('serve_return').x<85||first('serve_return').y<45||first('serve_return').y>60)errors.push('serve & return navigation must remain outside the ready-position hands');
  if(first('net').x>15||first('net').y<45||first('net').y>60)errors.push('net-play navigation must remain outside the forehand silhouette');
  if(PLAYER_REGIONS.movement.hotspots.length!==1)errors.push('movement must have exactly one hotspot');
  if(first('movement').x!==50||first('movement').motion!=='footwork')errors.push('movement hotspot must shuttle visibly between the stance anchors');
  if(first('decisions').x>24||first('decisions').y<12||first('decisions').y>28)errors.push('decision-making navigation must remain offset from the upper chest');
  if(first('forehand').labelSide!=='below'||first('backhand').labelSide!=='below')errors.push('stroke-side labels must stack below their hotspots on narrow phones');
  if(first('net').y-first('forehand').y<15||first('forehand').y-first('decisions').y<12)errors.push('viewer-left labels require a clear vertical lane');
  if(first('serve_return').y-first('backhand').y<15)errors.push('viewer-right upper labels require a clear vertical lane');
  return errors;
}
if(typeof module==='object'&&module.exports){module.exports={version:VERSION,playerRegions:PLAYER_REGIONS,auditPlayerRegions};return;}
let state={stage:'categories',playerRegion:null,playerIssue:null,lessonId:null,source:'sharpen',contextualEntry:false};
let overlay,stageEl,backBtn,progressEl,lastFocus,labelLayoutFrame=0,priorNavState=null,store=null,launchBusy=false;
let notice='';
let forehandStore=null,courtStore=null;
const esc=s=>String(s||'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const now=()=>new Date().toISOString();
function analytics(name,data){try{if(typeof root.trackEvent==='function')root.trackEvent(name,data||{});}catch(e){}}
function getStore(){
  if(!store&&root.GameSharpSharpenState){
    let storage;try{storage=root.localStorage;}catch(e){storage={getItem(){throw e;},setItem(){throw e;}};}
    store=root.GameSharpSharpenState.createStore(storage);
  }
  return store;
}
function lesson(id){
  const engine=root.GameSharpGoldDaily;
  if(!engine||!root.GS_GOLD_DAILY_CSS_READY||!engine.openPractice||!engine.isAvailable?.(id))return null;
  const c=engine.challenges.find(c=>c.id===id&&!c.reviewOnly);
  if(!c||!root.GameSharpGoldLessonSpines?.byId[c.lessonSpineId])return null;
  return c;
}
function registry(){
  const p=root.GameSharpSharpenPaths,e=root.GameSharpGoldDaily,s=root.GameSharpGoldLessonSpines;
  if(!p||!e||!s||!getStore())return null;
  return p.audit(e,s).ok?p:null;
}
function pathFor(id){const p=registry();return p&&p.byId[id]||null;}
function pathsFor(region){const p=registry();return p?p.paths.filter(p=>p.region===region&&lesson(p.lessonId)):[];}
// User-authorised beta release; independent coach review is still pending.
function checkReleaseEnabled(d){
  const release=root.GameSharpCourtChecks?.release;
  return release?.status==='user_authorized_beta'&&Array.isArray(release.experimentIds)&&release.experimentIds.includes(d.id);
}
function checkDefinition(id=state.checkId||state.lessonId){
  const checks=root.GameSharpCourtChecks,d=checks&&(checks.byId[id]||checks.byLessonId[id]);
  if(!d||!checkReleaseEnabled(d))return null;
  if(d.storage==='forehand'?(!root.GameSharpForehandCheck||!root.GameSharpForehandCheckState):!root.GameSharpCourtCheckState)return null;
  const c=lesson(d.lessonId),s=c&&root.GameSharpGoldLessonSpines.byId[c.lessonSpineId];
  return c&&checks.audit(d,c,s).ok?d:null;
}
function getCheckStore(d){
  let storage;try{storage=root.localStorage;}catch(e){storage={getItem(){throw e;},setItem(){throw e;}};}
  // The first prototype's key and record stay intact. No migration or relabelling.
  if(d.storage==='forehand'){
    if(!forehandStore)forehandStore=root.GameSharpForehandCheckState.createStore(storage);
    return forehandStore;
  }
  if(!courtStore)courtStore=root.GameSharpCourtCheckState.createStore(storage,root.GameSharpCourtChecks.definitions.filter(x=>x.storage==='shared'),root.GameSharpCourtChecks.validateReport);
  return {read:()=>courtStore.read(d.id),plan:at=>courtStore.plan(d.id,at),report:(payload,at)=>courtStore.report(d.id,payload,at),persistent:()=>courtStore.persistent()};
}
function validSavedFocus(f){
  if(!f||!Object.hasOwn(PLAYER_REGIONS,f.region))return null;
  const c=lesson(f.lessonId);if(!c)return null;
  if(f.pathId){const p=pathFor(f.pathId);if(!p||p.region!==f.region||p.lessonId!==f.lessonId)return null;}
  else if(root.GameSharpGoldLessonSpines.byId[c.lessonSpineId].sharpenTarget!==f.region)return null;
  return f;
}
function storageNote(){
  const s=getStore();if(!s)return '<p class="gspc-storage-note">Saving is unavailable. You can still explore the lessons.</p>';
  s.read();return '<p class="gspc-storage-note">'+(s.persistent()?'Saves to this browser only.':'Saving is unavailable. Your focus lasts only while this page stays open.')+'</p>';
}
function playerMarkup(selected){const hotspots=Object.entries(PLAYER_REGIONS).flatMap(([id,r])=>r.hotspots.map((h,i)=>`<button class="gspc-hotspot${h.motion==='footwork'?' gspc-hotspot-footwork':''}${selected===id?' selected':selected?' dimmed':''}" type="button" data-player-region="${id}" style="--x:${h.x}%;--y:${h.y}%;--line-angle:${h.lineAngle}deg" aria-label="${esc(h.ariaLabel||`${h.displayLabel||r.label}: ${r.description}`)}"><span class="gspc-hotspot-line" aria-hidden="true"></span><span class="gspc-hotspot-dot" aria-hidden="true"></span><span class="gspc-hotspot-label ${h.labelSide||'right'}"><b>${esc(h.displayLabel||r.label)}</b><small>${esc(r.description)}</small></span></button>`)).join('');return `<div class="gspc-player${selected?' has-selection':''}" data-selected-region="${selected||''}"><img class="gspc-player-img" src="${PLAYER_IMAGE}" alt="Illustrated front-facing right-handed tennis player in a ready position" draggable="false">${hotspots}<div class="gspc-player-fallback" hidden><div class="gspc-player-fallback-title">Choose an area to sharpen</div>${Object.entries(PLAYER_REGIONS).map(([id,r])=>`<button type="button" data-player-region="${id}">${esc(r.label)}<span>${esc(r.description)}</span></button>`).join('')}</div></div>`}
function settleHotspotLabels(){if(labelLayoutFrame)cancelAnimationFrame(labelLayoutFrame);labelLayoutFrame=requestAnimationFrame(()=>{labelLayoutFrame=0;if(!stageEl)return;const player=stageEl.querySelector('.gspc-player');if(!player)return;const labels=[...player.querySelectorAll('.gspc-hotspot-label')].filter(label=>label.getClientRects().length);labels.forEach(label=>{label.style.removeProperty('--label-nudge-x');label.style.removeProperty('--label-nudge-y')});const safe=8,gap=7,viewportWidth=document.documentElement.clientWidth,placed=[];labels.sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top);labels.forEach(label=>{let rect=label.getBoundingClientRect(),dx=rect.left<safe?safe-rect.left:rect.right>viewportWidth-safe?(viewportWidth-safe)-rect.right:0;if(dx)label.style.setProperty('--label-nudge-x',`${dx}px`);rect=label.getBoundingClientRect();let dy=0;for(const prior of placed){if(rect.left<prior.right+gap&&rect.right>prior.left-gap&&rect.top<prior.bottom+gap&&rect.bottom>prior.top-gap){dy=Math.max(dy,prior.bottom+gap-rect.top);label.style.setProperty('--label-nudge-y',`${dy}px`);rect=label.getBoundingClientRect()}}placed.push(rect)})})}
function setBackgroundInert(inert){document.querySelectorAll('.screen').forEach(el=>{el.inert=!!inert;if(inert)el.setAttribute('aria-hidden','true');else el.removeAttribute('aria-hidden')})}
function setSharpenNav(open){const items=[...document.querySelectorAll('#gsBottomNav .gs-bnav-item,.gs-sidebar .gs-nav-item')];if(open){if(!priorNavState)priorNavState=items.map(el=>({el,bottom:el.classList.contains('gs-bnav-item'),active:el.classList.contains(el.classList.contains('gs-bnav-item')?'gs-bnav-active':'gs-nav-active')}));items.forEach(el=>{const cls=el.classList.contains('gs-bnav-item')?'gs-bnav-active':'gs-nav-active';el.classList.toggle(cls,/\bSharpen\b/i.test(el.textContent||''))})}else if(priorNavState){priorNavState.forEach(item=>{if(!item.el.isConnected)return;item.el.classList.toggle(item.bottom?'gs-bnav-active':'gs-nav-active',item.active)});priorNavState=null}}
function bindPlayer(){
  const img=stageEl.querySelector('.gspc-player-img'),fallback=stageEl.querySelector('.gspc-player-fallback');
  if(img){
    const failed=()=>{img.closest('.gspc-player').classList.add('image-failed');if(fallback)fallback.hidden=false;};
    img.addEventListener('error',failed,{once:true});
    if(img.complete&&!img.naturalWidth)failed();
    if(!img.complete)img.addEventListener('load',settleHotspotLabels,{once:true});
  }
  settleHotspotLabels();
  stageEl.querySelectorAll('[data-player-region]').forEach(b=>b.addEventListener('click',()=>selectPlayerRegion(b.dataset.playerRegion)));
}
function ensureOverlay(){
  if(overlay)return;
  overlay=document.createElement('div');overlay.id='gspcOverlay';overlay.className='gspc-overlay gspc-beta';
  overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','gspcTitle');
  overlay.innerHTML='<div class="gspc-shell"><header class="gspc-top"><button type="button" class="gspc-back" aria-label="Go back">←</button><div class="gspc-topcopy"><div class="gspc-brand">GAMESHARP · Sharpen</div><div class="gspc-progress"></div></div><button type="button" class="gspc-close" aria-label="Exit">×</button></header><div class="gspc-scroll"><main class="gspc-stage"></main></div><div class="gspc-sr" role="status" aria-live="polite"></div></div>';
  document.body.appendChild(overlay);stageEl=overlay.querySelector('.gspc-stage');backBtn=overlay.querySelector('.gspc-back');progressEl=overlay.querySelector('.gspc-progress');
  backBtn.addEventListener('click',back);overlay.querySelector('.gspc-close').addEventListener('click',close);
  document.addEventListener('keydown',e=>{
    if(!overlay.classList.contains('open'))return;
    if(e.key==='Escape'){e.preventDefault();close();return;}
    if(e.key!=='Tab')return;
    const controls=[...overlay.querySelectorAll('button:not([disabled]),select:not([disabled]),input:not([disabled]),textarea:not([disabled]),a[href],summary,[tabindex="0"]')].filter(x=>x.getClientRects().length);
    const first=controls[0],last=controls.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
}
function show(){
  ensureOverlay();setBackgroundInert(true);setSharpenNav(true);overlay.classList.add('open');document.body.classList.add('gspc-open');
  render();overlay.querySelector('.gspc-close').focus({preventScroll:true});
}
function open(source){
  ensureOverlay();lastFocus=document.activeElement;notice='';
  const directPlayer=source==='sharpen';
  state={stage:'categories',playerRegion:null,playerIssue:null,lessonId:null,source:source||'sharpen',contextualEntry:false};
  show();analytics('sharpen_opened',{source:state.source,directPlayer});return true;
}
function openRegion(id,source){
  if(!PLAYER_REGIONS[id])return false;
  open(source);state.stage='region';state.playerRegion=id;state.contextualEntry=!!source&&source!=='sharpen';render();return true;
}
function openLessonFocus(id,source){
  const c=lesson(id),spine=c&&root.GameSharpGoldLessonSpines.byId[c.lessonSpineId];
  if(!c||!PLAYER_REGIONS[spine.sharpenTarget])return false;
  open(source);state.stage='focus';state.playerRegion=spine.sharpenTarget;state.lessonId=id;state.contextualEntry=!!source&&source!=='sharpen';render();return true;
}
function close(){
  if(!overlay||!overlay.classList.contains('open'))return;
  overlay.classList.remove('open');document.body.classList.remove('gspc-open');setBackgroundInert(false);setSharpenNav(false);
  if(lastFocus&&lastFocus.isConnected)lastFocus.focus({preventScroll:true});
}
function back(){
  notice='';
  if(state.stage.startsWith('check-')){
    const parents={'check-match':'focus','check-plan':'check-match','check-plan-review':'check-result','check-observe':'check-match','check-boundary':'check-match','check-report':'check-plan','check-result':'focus'};
    state.stage=parents[state.stage]||'focus';render();return;
  }
  if(state.stage==='categories'||state.stage==='region'&&state.contextualEntry||state.stage==='focus'&&state.contextualEntry&&!state.playerIssue){close();return;}
  if(state.stage==='focus'||state.stage==='unsupported'){state.stage=state.playerRegion?'region':'categories';state.lessonId=null;state.playerIssue=null;}
  else{state.stage='categories';state.playerRegion=null;state.playerIssue=null;}
  render();
}
function selectPlayerRegion(id){
  if(!PLAYER_REGIONS[id])return;
  state.stage='region';state.playerRegion=id;state.playerIssue=null;state.lessonId=null;state.checkJourney=false;state.checkId=null;state.checkDraft=null;notice='';render();
  analytics('sharpen_region_selected',{region:id});
}
function render(){
  if(!stageEl)return;overlay.querySelector('.gspc-scroll').scrollTop=0;
  if(state.stage.startsWith('check-'))renderCheck();else if(state.stage==='region')renderRegion();else if(state.stage==='focus')renderFocus();else if(state.stage==='unsupported')renderUnsupported();else renderCategories();
  overlay.querySelector('.gspc-sr').textContent=notice;
  const h=stageEl.querySelector('#gspcTitle');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}
}
function renderCategories(){
  progressEl.textContent='Find one useful next step';
  const s=getStore(),f=validSavedFocus(s&&s.read().focus),c=f&&lesson(f.lessonId);
  stageEl.innerHTML='<div class="gspc-player-intro"><h1 class="gspc-title" id="gspcTitle">What do you want to sharpen?</h1><p class="gspc-lead">Start with what’s hurting your game most.</p></div>'+playerMarkup(null)+
    (c?'<button type="button" class="gspc-focus-summary" data-saved-focus><span>Your saved court cue</span><strong>'+esc(c.memory)+'</strong><small>Return to your focus →</small></button>':'')+
    '<button type="button" class="gspc-player-unsure" data-unsure>I’m not sure yet <span aria-hidden="true">→</span></button>';
  bindPlayer();
  stageEl.querySelector('[data-unsure]').addEventListener('click',()=>{state.stage='unsupported';render();});
  stageEl.querySelector('[data-saved-focus]')?.addEventListener('click',()=>{state.playerRegion=f.region;state.playerIssue=f.pathId||null;state.lessonId=f.lessonId;state.stage='focus';render();});
}
function thumb(path){
  let html='';try{html=root.GameSharpGoldDaily.preview(path.lessonId)||'';}catch(e){}
  return '<span class="gspc-situation-picture" aria-hidden="true">'+(html||'<span class="gspc-contact-tile">Contact<br>+ space</span>')+'</span>';
}
function renderRegion(){
  const r=PLAYER_REGIONS[state.playerRegion],paths=pathsFor(state.playerRegion);
  progressEl.textContent=r.label+' · one situation';
  stageEl.innerHTML='<header class="gspc-region-head"><div class="gspc-eyebrow">'+esc(r.label)+'</div><h1 class="gspc-title" id="gspcTitle">Which moment feels familiar?</h1><p>Pick one. See it more clearly.</p></header>'+
    (paths.length?'<div class="gspc-situations">'+paths.map(p=>{const candidate=checkDefinition(p.lessonId),check=candidate?.pathId===p.id?candidate:null;return '<button type="button" class="gspc-situation" data-path="'+esc(p.id)+'">'+thumb(p)+'<span class="gspc-situation-copy"><strong>'+esc(check?check.label:p.label)+'</strong><small>'+esc(check?check.invitation:p.invitation)+'</small></span><span class="gspc-situation-arrow" aria-hidden="true">↗</span></button>';}).join('')+'</div>':'<div class="gspc-empty">These lessons are not available right now. Nothing else will be substituted.</div>')+
    '<button type="button" class="gspc-player-reset" data-not-fit>None of these fits</button>'+
    (notice?'<p class="gspc-save-status" role="status">'+esc(notice)+'</p>':'');
  stageEl.querySelectorAll('[data-path]').forEach(b=>b.addEventListener('click',()=>launchPath(b.dataset.path)));
  stageEl.querySelector('[data-not-fit]').addEventListener('click',()=>{state.stage='unsupported';render();});
}
function renderUnsupported(){
  progressEl.textContent='No guesswork';
  stageEl.innerHTML='<div class="gspc-region-head"><div class="gspc-eyebrow">Find the right starting point</div><h1 class="gspc-title" id="gspcTitle">We don’t have to name a fault.</h1><p>A miss alone cannot tell us its cause. These lessons help you observe and make decisions—not diagnose your stroke.</p></div><div class="gspc-empty"><strong>Next time, notice one moment.</strong><p>Where was the ball relative to you at contact? Bring that observation back, or show the moment to your coach.</p></div><button type="button" class="gspc-primary" data-choose-area>Choose another area →</button>';
  stageEl.querySelector('[data-choose-area]').addEventListener('click',()=>{state.stage='categories';state.playerRegion=null;state.contextualEntry=false;render();});
}
function launchPath(id){
  const p=pathFor(id);if(!p||!lesson(p.lessonId)){notice='That lesson is unavailable. No other lesson has been substituted.';render();return false;}
  state.playerIssue=p.id;state.lessonId=p.lessonId;
  const d=checkDefinition(p.lessonId);
  state.checkJourney=!!d&&d.pathId===p.id;state.checkId=state.checkJourney?d.id:null;state.checkDraft=null;
  return launchLesson(p.lessonId);
}
function launchLesson(id){
  const c=lesson(id),engine=root.GameSharpGoldDaily;if(!c||launchBusy)return false;
  const origin={...state};launchBusy=true;close();
  let opened=false;
  try{
    opened=engine.openPractice(id,{returnLabel:'Take this to court →',onReturn:result=>{
      launchBusy=false;state={...origin};
      if(result&&result.lessonId===id&&result.completed){
        getStore()?.recordSeen(id,now());state.stage=origin.checkJourney&&checkDefinition(origin.checkId)?.lessonId===id?'check-match':'focus';state.lessonId=id;
      }else{state.stage=origin.stage;notice='Your Daily is unchanged. You can try this lesson again whenever you want.';}
      show();
    }});
  }catch(e){opened=false;}
  if(!opened){launchBusy=false;state=origin;notice='That lesson could not open. Your focus and Daily progress are unchanged.';show();return false;}
  analytics('sharpen_lesson_opened',{lessonId:id,pathId:state.playerIssue,region:state.playerRegion});return true;
}
function renderFocus(){
  const c=lesson(state.lessonId);if(!c){stageEl.innerHTML='<div class="gspc-empty"><h1 id="gspcTitle">This lesson is unavailable.</h1><p>Your saved focus has not been changed.</p></div>';return;}
  const s=getStore(),saved=validSavedFocus(s&&s.read().focus),isSaved=saved&&saved.lessonId===c.id&&saved.region===state.playerRegion,d=checkDefinition(c.id);
  progressEl.textContent='One idea for your next hit';
  stageEl.innerHTML='<article class="gspc-court-card"><div class="gspc-eyebrow">Take it to court</div><h1 class="gspc-title" id="gspcTitle">'+esc(c.title)+'</h1><blockquote>'+esc(c.memory)+'</blockquote><p>'+esc(c.takeItToCourt)+'</p></article>'+
    (d?'<button type="button" class="gspc-secondary gspc-check-full" data-court-check>'+esc(d.cta)+'</button><p class="gspc-storage-note">Beta practice check · not yet coach-reviewed.</p>':'')+
    '<button type="button" class="gspc-primary" data-save-focus'+(!s||isSaved?' disabled':'')+'>'+(!s?'Saving unavailable':isSaved?(s.persistent()?'Saved for next session':'Kept for this visit'):'Save this court cue')+'</button>'+
    '<p class="gspc-save-status" role="status">'+esc(notice)+'</p>'+storageNote()+
    (isSaved?'<section class="gspc-feedback-card"><strong>'+(saved.practicedAt?'What did you notice?':'Try it on court first.')+'</strong>'+
      (saved.practicedAt?'<p>This is your observation—not a technique score.</p><div class="gspc-feedback">'+[['clearer','The decision felt clearer'],['mixed','It depended on the ball'],['unclear','I’m still unsure']].map(([id,label])=>'<button type="button" data-feedback="'+id+'" aria-pressed="'+(saved.feedback===id)+'">'+label+'</button>').join('')+'</div>':'<p>Replaying a lesson is not on-court practice.</p><button type="button" class="gspc-secondary" data-tried>I have tried this on court</button>')+'</section>':'')+
    '<div class="gspc-actions"><button type="button" class="gspc-secondary" data-replay>Replay the lesson</button><button type="button" class="gspc-secondary" data-share>Share court cue</button></div><button type="button" class="gspc-player-reset" data-change>Choose another focus</button>';
  stageEl.querySelector('[data-save-focus]').addEventListener('click',saveFocus);
  stageEl.querySelector('[data-court-check]')?.addEventListener('click',()=>{
    state.checkJourney=true;state.checkId=d.id;
    const e=getCheckStore(d).read().experiment;
    state.stage=e?(e.report?'check-result':'check-plan'):'check-match';render();
  });
  stageEl.querySelector('[data-tried]')?.addEventListener('click',()=>{if(s.markPracticed(c.id,now())){notice='Your on-court trial is recorded as your own report.';renderFocus();}});
  stageEl.querySelectorAll('[data-feedback]').forEach(b=>b.addEventListener('click',()=>{if(s.feedback(c.id,b.dataset.feedback)){notice='Your observation is saved.';renderFocus();}}));
  stageEl.querySelector('[data-replay]').addEventListener('click',()=>launchLesson(c.id));
  stageEl.querySelector('[data-share]').addEventListener('click',shareFocus);
  stageEl.querySelector('[data-change]').addEventListener('click',()=>{state.stage='categories';state.playerRegion=null;state.playerIssue=null;state.lessonId=null;state.checkId=null;state.checkJourney=false;state.checkDraft=null;state.contextualEntry=false;notice='';render();});
}
function saveFocus(){const c=lesson(state.lessonId),s=getStore();if(!c||!s)return; s.saveFocus({lessonId:c.id,region:state.playerRegion,pathId:state.playerIssue},now());notice=s.persistent()?'Saved for next session':'Kept for this visit only';renderFocus();}
function checkHeading(d,title,lead){
  const area=d&&PLAYER_REGIONS[d.region]?.label||'Sharpen';
  return '<header class="gspc-region-head"><div class="gspc-eyebrow">'+esc(area)+' · one useful check</div><h1 class="gspc-title" id="gspcTitle">'+esc(title)+'</h1><p>'+esc(lead)+'</p></header>';
}
function checkSources(d){
  return '<details class="gspc-check-sources"><summary>Why this check—and its limits</summary><p>'+esc(d.disclosure)+'</p><ul>'+d.limits.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p>'+esc(d.adaptation)+'</p>'+d.sources.map(s=>'<a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a>').join('')+'</details>';
}
function checkSaveNote(s){return '<p class="gspc-storage-note">'+(s.persistent()?'This check stays in this browser.':'Saving is unavailable. This check lasts only while this page stays open.')+'</p>';}
function moveCheck(stage){state.stage='check-'+stage;render();}
function leaveCheck(){state.stage='focus';state.checkJourney=false;render();}
function checkField(f,draft){
  const values=f.type==='count'?Array.from({length:f.max-f.min+1},(_,i)=>[String(i+f.min),String(i+f.min)]):f.options;
  const options='<option value="">Choose…</option>'+values.map(([v,label])=>'<option value="'+esc(v)+'"'+(String(draft[f.name])===String(v)?' selected':'')+'>'+esc(label)+'</option>').join('');
  return '<label>'+esc(f.label)+'<select name="'+esc(f.name)+'" required>'+options+'</select></label>';
}
function checkPayload(d,fields){
  const payload={};
  for(const f of d.report.fields){
    const v=fields[f.name];
    if(typeof v!=='string'||v==='')return null;
    if(f.type==='count'){
      if(!/^\d+$/.test(v))return null;
      payload[f.name]=Number(v);
    }else if(f.type==='boolean'){
      if(v!=='true'&&v!=='false')return null;
      payload[f.name]=v==='true';
    }else payload[f.name]=v;
  }
  return root.GameSharpCourtChecks.validateReport(d.id,payload)?payload:null;
}
function renderCheck(){
  const d=checkDefinition();
  if(!d||d.lessonId!==state.lessonId){
    stageEl.innerHTML=checkHeading(null,'This court check is unavailable.','Your lesson and saved progress are unchanged.')+'<button type="button" class="gspc-secondary" data-check-focus>Back to the lesson cue</button>';
    stageEl.querySelector('[data-check-focus]').onclick=leaveCheck;return;
  }
  state.checkId=d.id;
  const s=getCheckStore(d),record=s.read().experiment;
  progressEl.textContent=PLAYER_REGIONS[d.region].label+' · beta practice check';
  if(state.stage==='check-match'){
    const r=d.recognition;
    stageEl.innerHTML=checkHeading(d,r.title,r.lead)+'<div class="gspc-check-choices">'+['yes','unsure','no'].map(id=>'<button type="button" class="gspc-secondary" data-check-match="'+id+'"><strong>'+esc(r[id].label)+'</strong><span>'+esc(r[id].detail)+'</span></button>').join('')+'</div><button type="button" class="gspc-tertiary" data-check-replay>See the comparison again</button>';
    stageEl.querySelectorAll('[data-check-match]').forEach(b=>b.onclick=()=>moveCheck({yes:'plan',unsure:'observe',no:'boundary'}[b.dataset.checkMatch]));
    stageEl.querySelector('[data-check-replay]').onclick=()=>launchLesson(d.lessonId);return;
  }
  if(state.stage==='check-observe'||state.stage==='check-boundary'){
    const r=d.recognition[state.stage==='check-observe'?'unsure':'no'];
    stageEl.innerHTML=checkHeading(d,r.title,r.lead)+'<div class="gspc-empty"><strong>One useful next step</strong><p>'+esc(r.body)+'</p></div><button type="button" class="gspc-primary" data-check-match>Return to the clue</button><button type="button" class="gspc-tertiary" data-check-focus>Keep the lesson cue</button>';
    stageEl.querySelector('[data-check-match]').onclick=()=>moveCheck('match');
    stageEl.querySelector('[data-check-focus]').onclick=leaveCheck;return;
  }
  if(state.stage==='check-plan'||state.stage==='check-plan-review'){
    const reviewing=state.stage==='check-plan-review'&&!!record?.report,p=d.plan;
    if(record?.report&&!reviewing){state.stage='check-result';renderCheck();return;}
    const blocks=p.blocks.map(b=>'<article><div class="gspc-check-ten" aria-hidden="true">'+esc(b.number)+(b.label?'<span>'+esc(b.label)+'</span>':'')+'</div><div><h2>'+esc(b.title)+'</h2><p>'+esc(b.body)+'</p>'+(b.cue?'<blockquote class="gspc-check-cue">'+esc(b.cue)+'</blockquote>':'')+'</div></article>').join('');
    stageEl.innerHTML=checkHeading(d,p.title,p.lead)+'<p class="gspc-check-setup">'+esc(p.setup)+'</p><div class="gspc-check-blocks">'+blocks+'</div>'+(p.counting?'<p class="gspc-check-counting">'+esc(p.counting)+'</p>':'')+'<p class="gspc-check-boundary">'+esc(p.boundary)+'</p><p class="gspc-storage-note">Source-informed prototype · coach review pending.</p>'+
      (reviewing?'<button type="button" class="gspc-primary" data-check-result>Back to my first observation</button><p class="gspc-storage-note">This prototype keeps one observation per check. Reviewing the instructions does not change your report.</p>':'<button type="button" class="gspc-primary" data-check-plan'+(record?' disabled':'')+'>'+(record?(s.persistent()?'Saved for your next hit':'Kept for this visit'):'Save this experiment for my next hit')+'</button>'+
      (record?'<p class="gspc-save-status">Planning it does not record court practice.</p><button type="button" class="gspc-secondary gspc-check-full" data-check-record>'+esc(d.report.cta||'I’ve tried this—record what happened')+'</button>':''))+checkSaveNote(s)+checkSources(d);
    stageEl.querySelector('[data-check-result]')?.addEventListener('click',()=>moveCheck('result'));
    stageEl.querySelector('[data-check-plan]')?.addEventListener('click',()=>{
      s.plan(now());
      const p=pathFor(state.playerIssue);
      getStore()?.saveFocus({lessonId:d.lessonId,region:d.region,pathId:p?.lessonId===d.lessonId&&p.region===d.region?p.id:null},now());
      renderCheck();
      stageEl.querySelector('[data-check-record]')?.focus({preventScroll:true});
    });
    stageEl.querySelector('[data-check-record]')?.addEventListener('click',()=>moveCheck('report'));return;
  }
  if(state.stage==='check-report'){
    if(!record){state.stage='check-plan';renderCheck();return;}
    if(record.report){state.stage='check-result';renderCheck();return;}
    const draft=state.checkDraft?.id===d.id?state.checkDraft.fields:{};
    const counts=d.report.fields.filter(f=>f.type==='count'),other=d.report.fields.filter(f=>f.type!=='count');
    const countGroup=counts.length?'<fieldset><legend>'+esc(d.report.countLegend||'Your counts')+'</legend>'+(d.report.countHint?'<p>'+esc(d.report.countHint)+'</p>':'')+'<div class="gspc-check-count-fields">'+counts.map(f=>checkField(f,draft)).join('')+'</div></fieldset>':'';
    stageEl.innerHTML=checkHeading(d,d.report.title,d.report.lead)+'<form class="gspc-check-form">'+countGroup+other.map(f=>checkField(f,draft)).join('')+'<p class="gspc-check-error" role="status"></p><button type="submit" class="gspc-primary" data-check-submit>Save my observation</button><p class="gspc-storage-note">'+esc(d.report.hint)+'</p></form>';
    const form=stageEl.querySelector('form');
    const readFields=()=>Object.fromEntries(new FormData(form));
    form.addEventListener('change',()=>{state.checkDraft={id:d.id,fields:readFields()};});
    form.addEventListener('submit',e=>{
      e.preventDefault();if(!form.reportValidity())return;
      const fields=readFields();state.checkDraft={id:d.id,fields};
      const payload=checkPayload(d,fields);
      if(!payload||!s.report(payload,now())){form.querySelector('.gspc-check-error').textContent='That observation could not be saved. Check the fields; an existing report is never overwritten.';return;}
      const focus=validSavedFocus(getStore()?.read().focus);
      if(focus?.lessonId===d.lessonId&&root.GameSharpCourtChecks.didPractice(d.id,payload))getStore().markPracticed(d.lessonId,now());
      state.checkDraft=null;moveCheck('result');
    });return;
  }
  if(state.stage==='check-result'){
    if(!record?.report){state.stage='check-plan';renderCheck();return;}
    const reading=root.GameSharpCourtChecks.interpret(d.id,record.report);
    const summaries=(reading.summaries||[]).map(item=>'<div><span>'+esc(item.label)+'</span><strong>'+esc(item.value)+'</strong></div>').join('');
    stageEl.innerHTML=checkHeading(d,reading.title,reading.body)+'<div class="gspc-check-result-counts">'+summaries+'</div><div class="gspc-empty"><strong>Your next useful step</strong><p>'+esc(reading.next)+'</p></div><p class="gspc-storage-note">Your first observation is kept as entered. This is not proof of a cause or a lasting improvement.</p>'+checkSaveNote(s)+'<button type="button" class="gspc-primary" data-check-focus>Back to my court cue</button><button type="button" class="gspc-secondary gspc-check-full" data-check-plan-review>Review this experiment</button>'+checkSources(d);
    stageEl.querySelector('[data-check-plan-review]').onclick=()=>moveCheck('plan-review');
    stageEl.querySelector('[data-check-focus]').onclick=leaveCheck;
  }
}
async function shareFocus(){
  const c=lesson(state.lessonId);if(!c)return;
  const text=c.memory+'\n\n'+c.takeItToCourt+'\nhttps://www.gamesharptennis.com/?goldDaily='+encodeURIComponent(c.slug);
  try{if(navigator.share)await navigator.share({title:'GAMESHARP · My court cue',text});else if(navigator.clipboard){await navigator.clipboard.writeText(text);notice='Court cue copied.';}else notice='Sharing is unavailable in this browser.';}catch(e){if(e.name!=='AbortError')notice='Could not share. Your court cue is still here.';}
  renderFocus();
}
function init(){
  ensureOverlay();
  const errors=auditPlayerRegions();
  document.documentElement.dataset.gspcPlayerIntegrity=errors.length?'fail':'ok';
  document.documentElement.dataset.gspcPlayerRegions=String(Object.keys(PLAYER_REGIONS).length);
  document.documentElement.dataset.gspcPlayerErrors=errors.join('|');
  document.documentElement.dataset.gspcReturnContract='ok';
  window.GameSharpPainCoach={open,openRegion,close,openLessonFocus,version:VERSION,playerRegions:PLAYER_REGIONS,playerImage:PLAYER_IMAGE,
    getData:()=>getStore()?.read(),pathFor,pathsFor,
    playerContract:()=>({status:errors.length?'fail':'ok',regions:Object.keys(PLAYER_REGIONS).length,errors:errors.join('|')}),
    returnContract:()=>document.documentElement.dataset.gspcReturnContract};
  window.addEventListener('resize',settleHotspotLabels,{passive:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})(typeof window==='object'?window:globalThis);
