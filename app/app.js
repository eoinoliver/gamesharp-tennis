/* GameSharp app shell: player state, streak, anonymous analytics. Shared by Home and the player.
   Nothing personal is stored or sent: a random id, the day, the lesson, the answers and the feedback. */
(function(){
"use strict";
const CFG=window.GS_CONFIG||{}, CAT=window.GS_CATALOG, VER=window.GS_VERSION||"dev";
const KEY="gs6";
const ls={get(k){try{return localStorage.getItem(k);}catch(e){return null;}},
          set(k,v){try{localStorage.setItem(k,v);return localStorage.getItem(k)===v;}catch(e){return false;}}};
const pad=n=>String(n).padStart(2,"0");
const dayOf=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const today=()=>dayOf(new Date());
const addDays=(s,k)=>{const [y,m,d]=s.split("-").map(Number);return dayOf(new Date(y,m-1,d+k));};
const daysBetween=(a,b)=>{const p=s=>{const [y,m,d]=s.split("-").map(Number);return Date.UTC(y,m-1,d);};return Math.round((p(b)-p(a))/864e5);};
const rid=()=>(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2));

/* ---------- state ---------- */
let progressSaved=true;
function load(){
  let S=null; try{S=JSON.parse(ls.get(KEY));}catch(e){}
  if(!S||S.v!==1){S={v:1,id:rid(),first:today(),level:null,done:{},days:[],streak:0,last:null,fb:{},opens:[]};migrateLegacy(S);save(S);}
  return S;
}
// After a failed write, keep this page's progress in memory. Do not overwrite
// another tab's newer saved state with a stale snapshot if storage returns.
function save(S){if(progressSaved)progressSaved=ls.set(KEY,JSON.stringify(S));return progressSaved;}
/* The old app kept a streak in gamesharp_streak / gamesharp_last_day (gamesharp_daily_Y_M_D, month from 0).
   Carry it over once if it is still alive (played today or yesterday). Nothing else is read from the old app. */
function migrateLegacy(S){
  const n=parseInt(ls.get("gamesharp_streak")||"0",10), last=ls.get("gamesharp_last_day");
  const m=last&&last.match(/^gamesharp_daily_(\d+)_(\d+)_(\d+)$/); if(!n||!m) return;
  const d=dayOf(new Date(+m[1],+m[2],+m[3])), gap=daysBetween(d,today());
  if(gap===0||gap===1){S.streak=n;S.last=d;S.days=[d];S.migrated=n;}
}
const S=load();

/* ---------- analytics (anonymous; production hosts only, local log everywhere) ---------- */
const LOGK="gs6_log";
function log(event,props){
  try{const L=JSON.parse(ls.get(LOGK)||"[]");L.push([new Date().toISOString(),event,props||{}]);ls.set(LOGK,JSON.stringify(L.slice(-300)));}catch(e){}
}
function capture(event,props){
  const host=location.hostname.toLowerCase();
  const production=location.protocol==="https:"&&(CFG.posthogAllowedHosts||[]).includes(host);
  if(!CFG.posthogKey||!production) return Promise.resolve(false);
  const p=Object.assign({app:VER,day_n:daysBetween(S.first,today()),level:S.level||"unset",streak:S.streak,$process_person_profile:false},props||{},{$host:host,environment:"production"});
  const body=JSON.stringify({api_key:CFG.posthogKey,event,distinct_id:S.id,properties:p,timestamp:new Date().toISOString()});
  const url=(CFG.posthogHost||"https://us.i.posthog.com")+"/capture/";
  try{return fetch(url,{method:"POST",body,keepalive:true,...(typeof AbortSignal!=="undefined"&&typeof AbortSignal.timeout==="function"?{signal:AbortSignal.timeout(8000)}:{}),headers:{"Content-Type":"application/json"}}).then(r=>r.ok).catch(()=>false);}
  catch(e){return Promise.resolve(false);}
}
function track(event,props){log(event,props);return capture(event,props);}
/* Keep the local history/log daily. Capture each visible page entry or foreground return:
   PostHog buckets unique users in its project timezone, independently of the local streak.
   No sent-day marker: an off/failed capture cannot suppress the next real app entry. */
let openWhere=null, foreground=!document.hidden;
function opened(where){
  openWhere=where||openWhere;
  if(!openWhere||document.hidden) return;
  foreground=true;syncProgress();
  const t=today(), newDay=!S.opens.includes(t);
  if(newDay){S.opens.push(t);S.opens=S.opens.slice(-60);save(S);}
  const props={where:openWhere,returning:t!==S.first,days_away:S.opens.length>1?daysBetween(S.opens[S.opens.length-2],t):0,migrated:S.migrated||0};
  if(newDay) log("app_open",props);
  capture("app_open",props);
}
function resume(){if(document.hidden||foreground) return;foreground=true;if(openWhere) opened(openWhere);}
document.addEventListener("visibilitychange",()=>{if(document.hidden) foreground=false;else resume();});
window.addEventListener("blur",()=>{foreground=false;});
window.addEventListener("focus",resume);
window.addEventListener("pagehide",()=>{foreground=false;});
window.addEventListener("pageshow",e=>{if(e.persisted) resume();});

/* ---------- lessons, streak ---------- */
const all=()=>CAT.daily.concat(CAT.predict,CAT.play||[]);
const bySlug=s=>all().find(l=>l.slug===s);
const isDaily=s=>CAT.daily.some(l=>l.slug===s);
const displayTitle=l=>l?.title?.replace(/^Predict the Point: /,'')||'';
const activityLabel=l=>`${l.doubles?'Doubles · Live Point':l.livePoint?'Live Point':isDaily(l.slug)?'Challenge':CAT.predict.some(p=>p.slug===l.slug)?'Anticipation challenge':'Live Point'}${l.decisionCount?` · ${l.decisionCount>2&&l.livePoint?'Up to ':''}${l.decisionCount} decisions`:''}`;
const remaining=()=>all().filter(l=>!S.done[l.slug]);
const CUES='gs_my_game';
function savedCues(){
  let rows;try{rows=JSON.parse(ls.get(CUES)||'[]');}catch(e){return [];}
  if(!Array.isArray(rows))return [];
  const seen=new Set();return rows.filter(c=>c&&typeof c.cue==='string').map(c=>{
    const l=bySlug(c.slug)||all().find(l=>l.title===c.lesson);
    return {...c,slug:l?.slug||null,lesson:l?.title||c.lesson,cue:l?.cue||c.cue,drill:l?.drill||c.drill,updated:!!(l?.cue&&l.cue!==c.cue)};
  }).reverse().filter(c=>{const k=c.slug||c.cue;if(seen.has(k))return false;seen.add(k);return true;});
}
function cueSaved(slug){return savedCues().some(c=>c.slug===slug);}
function saveCue(slug){
  const l=bySlug(slug);if(!l?.cue)return false;
  // Never replace unreadable data with an empty list.
  try{const raw=localStorage.getItem(CUES),rows=raw?JSON.parse(raw):[];if(!Array.isArray(rows))return false;
    const next=rows.filter(c=>c?.slug!==slug&&c?.lesson!==l.title);
    next.push({slug,lesson:l.title,cue:l.cue,drill:l.drill,saved_at:Date.now()});
    return ls.set(CUES,JSON.stringify(next));
  }catch(e){return false;}
}
/* A court focus is a player intention and self-report, never a learning score.
   Read before every write; an old tab cannot replace a newer focus silently. */
const FOCUS='gs_next_hit_v1';
function focusStore(){
  try{const raw=localStorage.getItem(FOCUS);if(!raw)return {v:1,active:null,history:[]};
    const s=JSON.parse(raw),a=s?.active;
    if(s?.v!==1||!Array.isArray(s.history)||!(a===null||(a&&typeof a.id==='string'&&typeof a.slug==='string'&&typeof a.cue==='string'&&['ready','reflecting','reflected'].includes(a.phase))))return null;
    return s;
  }catch(e){return null;}
}
function nextHit(){const s=focusStore(),a=s?.active,l=a&&bySlug(a.slug);
  return {available:!!s,active:a||null,changed:!!a&&(!l||l.cue!==a.cue||(l.edition||'original')!==a.edition||JSON.stringify(l.drill||null)!==JSON.stringify(a.drill||null)),current:l||null};
}
function editFocus(expectedId,edit){
  const s=focusStore();if(!s)return {ok:false,reason:'storage'};
  if((s.active?.id||null)!==expectedId)return {ok:false,reason:'changed'};
  if(!edit(s))return {ok:false,reason:'invalid'};
  s.history=s.history.slice(-30);
  return ls.set(FOCUS,JSON.stringify(s))?{ok:true}:{ok:false,reason:'storage'};
}
function archiveFocus(s,reason){if(s.active)s.history.push({...s.active,endedAt:Date.now(),endReason:reason});}
function selectFocus(slug,expectedId){
  const l=bySlug(slug);if(!l?.cue||!cueSaved(slug))return {ok:false,reason:'invalid'};
  const r=editFocus(expectedId,s=>{archiveFocus(s,'changed');s.active={id:rid(),slug,lesson:l.title,cue:l.cue,drill:l.drill||null,edition:l.edition||'original',selectedAt:Date.now(),phase:'ready',reflection:null,reminderHidden:false};return true;});
  if(r.ok)track('court_focus_selected',{lesson:slug,edition:l.edition||'original'});return r;
}
function focusAction(id,action,value){
  let reported=null;
  const r=editFocus(id,s=>{const a=s.active;if(!a)return false;
    if(action==='finish'){archiveFocus(s,'finished');s.active=null;return true;}
    if(action==='keep'&&a.phase==='reflected'&&!nextHit().changed){archiveFocus(s,'kept');s.active={...a,id:rid(),selectedAt:Date.now(),phase:'ready',reflection:null,reminderHidden:false};return true;}
    if(action==='defer'&&a.phase==='ready'){a.reminderHidden=true;return true;}
    if(action==='played'&&a.phase==='ready'){a.phase='reflecting';a.reflection={sessionConfirmedAt:Date.now(),occurred:null,tried:null,useful:null};return true;}
    if(action==='cancel'&&a.phase==='reflecting'){a.phase='ready';a.reflection=null;return true;}
    if(a.phase!=='reflecting'||!a.reflection)return false;
    const f=a.reflection;
    if(action==='occurred'&&f.occurred===null&&['yes','no','unsure'].includes(value))f.occurred=value;
    else if(action==='tried'&&f.occurred==='yes'&&f.tried===null&&['yes','no'].includes(value))f.tried=value;
    else if(action==='useful'&&f.tried==='yes'&&f.useful===null&&['yes','partly','no','unsure'].includes(value))f.useful=value;
    else return false;
    if(f.occurred!=='yes'||f.tried==='no'||f.useful!==null){a.phase='reflected';a.reminderHidden=true;f.recordedAt=Date.now();reported={lesson:a.slug,edition:a.edition,evidence:'self_report',occurred:f.occurred,tried:f.tried,useful:f.useful};}
    return true;
  });
  if(r.ok&&reported)track('court_focus_reflection',reported);return r;
}
/* Authored purposes reuse the existing catalogue. They do not grade mastery. */
const PRACTICE_PATHS=[
  {id:'direction',zone:'forehand',slugs:['the-line','live-point-line-tempting','live-point-line-opens'],purposes:['Learn the decision','Use it in a point','Read a changed situation']},
  {id:'serve',zone:'serve',slugs:['serve-plus-one','live-point-serve-see','live-point-return-deep'],purposes:['Learn the decision','Use it in a point','Read a changed situation']},
  {id:'volley',zone:'net',slugs:['approach-volley','live-point-volley-build','live-point-volley-opening'],purposes:['Learn the decision','Use it in a point','Read a changed situation']}
];
function practicePath(id){const p=PRACTICE_PATHS.find(p=>p.id===id);return p&&p.slugs.every(bySlug)&&new Set(p.slugs).size===p.slugs.length?p:null;}
function pathProgress(id){const p=practicePath(id);if(!p)return null;syncProgress();
  const steps=p.slugs.map((slug,i)=>{const l=bySlug(slug),done=!!S.done[slug],early=!!(l.transferOf&&!S.done[slug]&&!(S.done[l.transferOf]?.first<today()));
    return {lesson:l,purpose:p.purposes[i],done,early,seen:!!S.seen?.[slug]};});
  return {path:p,steps,next:steps.find(s=>!s.done&&!s.early)||null,waiting:steps.some(s=>!s.done&&s.early)};
}
function streakNow(){ if(!S.last) return 0; const g=daysBetween(S.last,today()); return g<=1?S.streak:0; }
function doneToday(){ return S.days.includes(today()); }
// Reload before choosing or saving so another tab's progress is not overwritten.
function syncProgress(){
  if(!progressSaved)return;
  try{const latest=JSON.parse(ls.get(KEY));if(latest&&latest.v===1&&latest.id===S.id)Object.assign(S,latest);}catch(e){}
  migrateEditions();
}
function migrateEditions(){
  let changed=false;
  for(const l of all().filter(l=>l.edition)){
    const d=S.done[l.slug],seen=S.seen?.[l.slug];
    if((!d||d.edition===l.edition)&&(!seen||S.seenEditions?.[l.slug]===l.edition))continue;
    S.editionHistory||={};S.editionHistory[l.slug]||=[];
    S.editionHistory[l.slug].push({edition:d?.edition||'earlier',done:d||null,seen:seen||null,reads:S.liveReads?.[l.slug]||[],attempts:S.liveAttempts?.[l.slug]||[]});
    delete S.done[l.slug];if(S.seen)delete S.seen[l.slug];if(S.liveReads)delete S.liveReads[l.slug];if(S.liveAttempts)delete S.liveAttempts[l.slug];
    if(S.liveFirstAttemptIds)delete S.liveFirstAttemptIds[l.slug];
    if(S.liveFirstSeen)delete S.liveFirstSeen[l.slug];
    changed=true;
  }
  if(changed)save(S);
}
function previousEdition(slug){return S.editionHistory?.[slug]?.at(-1)||null;}
function nextDaily(){
  syncProgress();const pending=CAT.daily.filter(l=>!S.done[l.slug]),seen=S.seen||{};
  return pending.find(l=>!seen[l.slug])||pending.sort((a,b)=>(seen[a.slug]||0)-(seen[b.slug]||0))[0]||null;
}
// Calendar-date selection is independent of personal progress. Keep old nextDaily
// as the personal practice queue; never silently replace an unfinished daily pick.
function featuredDaily(date=today()){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||addDays(date,0)!==date)return null;
  syncProgress();const plan=CAT.dailyPlan;
  const rotation=plan?.rotation||CAT.daily.map(l=>l.slug);if(!rotation.length)return null;
  const day=plan?Math.max(0,daysBetween(plan.startDate,date)):0;
  const lesson=bySlug(rotation[day%rotation.length]);if(!lesson)return null;
  const d=S.done[lesson.slug];
  return {lesson,date,edition:plan?.edition||'collection',done:d?.last===date,previouslyPlayed:!!d,seen:!!S.seen?.[lesson.slug]};
}
function relatedPoint(slug){
  const pair=CAT.dailyPlan?.related?.[slug],lesson=pair&&bySlug(pair.slug);
  return lesson?.livePoint&&!lesson.transferOf?{lesson,bridge:pair.bridge}:null;
}
function shareUrl(slug){return bySlug(slug)?'https://www.gamesharptennis.com/s/'+encodeURIComponent(slug)+'.html':null;}
function dailyShareUrl(slug){return isDaily(slug)?shareUrl(slug):null;}
function nextLivePoint(){
  syncProgress();
  const points=(CAT.play||[]).filter(l=>l.livePoint),seen=S.seen||{};
  const due=points.find(l=>l.transferOf&&S.done[l.transferOf]?.first<today()&&!S.done[l.slug]);
  return due||points.find(l=>!l.transferOf&&!S.done[l.slug])||null;
}
function startLesson(slug){
  if(!isDaily(slug)&&!bySlug(slug)?.livePoint)return;
  syncProgress();if(bySlug(slug)?.livePoint){S.liveFirstSeen||={};S.liveFirstSeen[slug]||=S.seen?.[slug]?'earlier':today();}S.seen||={};S.seen[slug]=Math.max(Date.now(),...Object.values(S.seen).map(Number).filter(Number.isFinite),0)+1;
  S.seenEditions||={};S.seenEditions[slug]=bySlug(slug)?.edition||'original';save(S);
}
const activeAttempts={};
function beginLiveAttempt(slug){
  if(!bySlug(slug)?.livePoint)return;
  activeAttempts[slug]={id:rid(),edition:bySlug(slug).edition||'original',day:today(),reads:[]};
}
function recordLiveRead(slug,d){
  const lesson=bySlug(slug);if(!lesson?.livePoint)return;
  syncProgress();if(!activeAttempts[slug])beginLiveAttempt(slug);
  const active=activeAttempts[slug];S.liveAttempts||={};S.liveAttempts[slug]||=[];
  const attempts=S.liveAttempts[slug],attempt=attempts.find(a=>a.id===active.id)||active;
  // A retry must never append its later decisions to an earlier route.
  if(d.i!==attempt.reads.length)return;
  const prior=lesson.transferOf&&S.done[lesson.transferOf];
  const delayed=!!(prior&&prior.first<today()&&(!S.liveFirstSeen?.[slug]||S.liveFirstSeen[slug]===attempt.day)&&attempt.day===today());
  const read={day:today(),pick:d.X,ok:!!d.ok,node:d.node,signal:d.signal||bySlug(slug)?.learningSignals?.[d.i]||null,delayed};
  if(!attempts.some(a=>a.id===attempt.id))attempts.push(attempt);
  attempt.reads.push(read);
  S.liveReads||={};S.liveFirstAttemptIds||={};
  S.liveFirstAttemptIds[slug]||=S.liveReads[slug]?.length?'legacy':attempt.id;
  if(S.liveFirstAttemptIds[slug]===attempt.id){S.liveReads[slug]||=[];S.liveReads[slug].push(read);}
  // Retain the first attempt permanently and the latest nineteen for review.
  if(attempts.length>20)S.liveAttempts[slug]=[attempts[0],...attempts.slice(-19)];
  save(S);
  track('live_point_read',{lesson:slug,edition:lesson.edition||'original',attempt:attempt.id,step:d.i+1,...read,transfer_of:lesson.transferOf||null,
    gap_days:prior?daysBetween(prior.first,today()):null});
}
// A transfer claim needs both decisions from the first, unexposed later-day attempt.
function transferEvidence(slug){
  const lesson=bySlug(slug);if(!lesson?.transferOf)return null;
  const attempt=S.liveAttempts?.[slug]?.find(a=>a.id===activeAttempts[slug]?.id)||S.liveAttempts?.[slug]?.at(-1);
  if(!attempt?.result||attempt.reads.length<2)return null;
  const [reply,recovery]=attempt.reads,prior=S.liveReads?.[lesson.transferOf];
  const blind=attempt.id===S.liveFirstAttemptIds?.[slug]&&reply.delayed&&recovery.delayed;
  const text=lesson.liveFeedback?.summaries[`${+reply.ok}${+recovery.ok}`]||(reply.ok?(recovery.ok?(blind&&prior?.[1]?.ok===false?'This time, you recovered while your ball travelled.':'You chose more time and recovered while the ball travelled.'):'You chose more time, then waited to recover.'):(recovery.ok?'You recovered promptly. A higher reply could have bought more time.':'The quicker reply and the wait left you less recovery time.'));
  return {kind:blind?'first_later_day':'practice',reply:reply.ok,recovery:recovery.ok,text};
}
function challengeUrl(slug){return bySlug(slug)?.livePoint?shareUrl(slug):null;}
/* Practice days reward showing up, including wrong answers. These summaries
   use saved completions, never page opens or an inferred tennis ability. */
function setPracticeGoal(value){
  if(![0,2,3,5,7].includes(value))return false;
  syncProgress();S.practiceGoal=value;const ok=save(S);
  if(ok)track('practice_goal_set',{days:value});return ok;
}
function practiceSummary(){
  syncProgress();
  const t=today(),now=new Date(),monday=addDays(t,-((now.getDay()+6)%7));
  const days=Array.from({length:7},(_,i)=>{const date=addDays(monday,i);return {date,done:S.days.includes(date),future:date>t};});
  const focus=focusStore(),reflections=[...(focus?.history||[]),...(focus?.active?[focus.active]:[])];
  const rows=all().filter(l=>S.done[l.slug]).map(lesson=>{
    const done=S.done[lesson.slug],attempt=S.liveAttempts?.[lesson.slug]?.find(a=>a.id===S.liveFirstAttemptIds?.[lesson.slug]);
    const later=!!(lesson.transferOf&&attempt?.result&&attempt.reads?.length>=2&&attempt.reads[0].delayed&&attempt.reads[1].delayed);
    const tried=reflections.filter(f=>f.slug===lesson.slug&&f.edition===(lesson.edition||'original')&&f.reflection?.tried==='yes');
    return {lesson,...done,later:later?{day:attempt.day,n:attempt.result.n,total:attempt.result.total}:null,tried:tried.length};
  }).sort((a,b)=>b.last.localeCompare(a.last)||b.first.localeCompare(a.first)||a.lesson.title.localeCompare(b.lesson.title));
  const pending=rows.map(r=>({source:r.lesson,lesson:bySlug(r.lesson.followup)})).filter(p=>p.lesson&&!S.done[p.lesson.slug]);
  const due=pending.find(p=>S.done[p.source.slug].first<t),waiting=pending[0];
  let next=due?{...due,kind:'later'}:waiting?{...waiting,kind:'tomorrow'}:null;
  if(!next)for(const r of rows){const pair=relatedPoint(r.lesson.slug);if(pair&&!S.done[pair.lesson.slug]){next={...pair,source:r.lesson,kind:'related'};break;}}
  const archived=all().flatMap(lesson=>(S.editionHistory?.[lesson.slug]||[]).filter(r=>r.done).map(r=>({lesson,edition:r.edition,...r.done}))).sort((a,b)=>b.last.localeCompare(a.last));
  return {archived,days,count:days.filter(d=>d.done).length,goal:[2,3,5,7].includes(S.practiceGoal)?S.practiceGoal:0,rows,next,saved:progressSaved};
}
/* Show exhaustion or an explicit unfinished revisit before today's completion. */
function todays(){
  syncProgress();
  const t=today(), f=CAT.daily.find(l=>S.done[l.slug]&&S.done[l.slug].first===t);
  const next=nextDaily();
  return !next||S.seen?.[next.slug]?next:f||next;
}
function complete(slug,n,total=3){
  syncProgress();
  const t=today(), d=S.done[slug], firstTime=!d;
  const bestTotal=d?.bestTotal||d?.total||3;
  const improves=!d||n/total>d.best/bestTotal||(n/total===d.best/bestTotal&&total>bestTotal);
  // n/total is the immutable first result; best/bestTotal always stay a pair.
  S.done[slug]=d?Object.assign(d,{last:t,times:d.times+1,best:improves?n:d.best,bestTotal:improves?total:bestTotal,lastScore:n,lastTotal:total}):{first:t,last:t,times:1,best:n,bestTotal:total,n,total,edition:bySlug(slug)?.edition||'original'};
  const attempt=S.liveAttempts?.[slug]?.find(a=>a.id===activeAttempts[slug]?.id);
  const firstCompletion=attempt&&!attempt.result;
  if(firstCompletion)attempt.result={n,total};
  if(!S.days.includes(t)){
    S.streak=(S.last&&daysBetween(S.last,t)===1)?S.streak+1:(S.last===t?S.streak:1);
    S.last=t; S.days.push(t); S.days=S.days.slice(-120);
  }
  save(S);
  const transfer=firstCompletion&&transferEvidence(slug);if(transfer)track('live_point_transfer',{lesson:slug,attempt:attempt.id,...transfer,text:undefined});
  track("lesson_complete",{lesson:slug,edition:bySlug(slug)?.edition||'original',daily:isDaily(slug),first_time:firstTime,score:n,total,times:S.done[slug].times});
  const featured=featuredDaily();
  if(featured?.lesson.slug===slug)track('featured_daily_complete',{lesson:slug,date:t,edition:featured.edition,revisit:!firstTime});
  if(isDaily(slug)&&firstTime&&!nextDaily()) track("content_exhausted",{});
}
function setLevel(v){syncProgress();S.level=v;save(S);track("level_set",{level:v});}
async function feedback(slug,useful,comment){
  const sent=await track("feedback",Object.assign({lesson:slug,useful},comment?{comment:String(comment).slice(0,500)}:{}));
  if(sent){syncProgress();S.fb[slug]={useful,day:today()};save(S);}return sent;
}

/* ---------- the old app: no service worker ever installed (it registered a blob: URL, which browsers refuse),
   but clear any stray registration or cache from this origin once, to be safe ---------- */
function cleanup(){
  if(ls.get("gs6_clean")) return; ls.set("gs6_clean","1");
  try{navigator.serviceWorker&&navigator.serviceWorker.getRegistrations().then(r=>r.forEach(x=>x.unregister())).catch(()=>{});}catch(e){}
  try{window.caches&&caches.keys().then(k=>k.forEach(n=>caches.delete(n))).catch(()=>{});}catch(e){}
}
cleanup();

/* ---------- engine events (the player calls GSApp.emit) ---------- */
const listeners=[];
function emit(name,data){listeners.forEach(f=>{try{f(name,data);}catch(e){}});}
function on(f){listeners.push(f);}

window.GSApp={S,CAT,VER,today,track,opened,bySlug,isDaily,streakNow,doneToday,nextDaily,nextLivePoint,featuredDaily,relatedPoint,dailyShareUrl,shareUrl,practiceSummary,setPracticeGoal,displayTitle,recordLiveRead,beginLiveAttempt,previousEdition,transferEvidence,challengeUrl,todays,startLesson,complete,setLevel,feedback,emit,on,
  activityLabel,remaining,savedCues,cueSaved,saveCue,nextHit,selectFocus,focusAction,practicePath,pathProgress,PRACTICE_PATHS,progressSaved:()=>progressSaved,
  log:()=>{try{return JSON.parse(ls.get(LOGK)||"[]");}catch(e){return [];}}};
})();
