/* GameSharp app shell: player state, streak, anonymous analytics. Shared by Home and the player.
   Nothing personal is stored or sent: a random id, the day, the lesson, the answers and the feedback. */
(function(){
"use strict";
const CFG=window.GS_CONFIG||{}, CAT=window.GS_CATALOG, VER=window.GS_VERSION||"dev";
const KEY="gs6";
const ls={get(k){try{return localStorage.getItem(k);}catch(e){return null;}},
          set(k,v){try{localStorage.setItem(k,v);}catch(e){}}};
const pad=n=>String(n).padStart(2,"0");
const dayOf=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const today=()=>dayOf(new Date());
const addDays=(s,k)=>{const [y,m,d]=s.split("-").map(Number);return dayOf(new Date(y,m-1,d+k));};
const daysBetween=(a,b)=>{const p=s=>{const [y,m,d]=s.split("-").map(Number);return Date.UTC(y,m-1,d);};return Math.round((p(b)-p(a))/864e5);};
const rid=()=>(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2));

/* ---------- state ---------- */
function load(){
  let S=null; try{S=JSON.parse(ls.get(KEY));}catch(e){}
  if(!S||S.v!==1){S={v:1,id:rid(),first:today(),level:null,done:{},days:[],streak:0,last:null,fb:{},opens:[]};migrateLegacy(S);save(S);}
  return S;
}
function save(S){ls.set(KEY,JSON.stringify(S));}
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
  if(!CFG.posthogKey||!production) return;
  const p=Object.assign({app:VER,day_n:daysBetween(S.first,today()),level:S.level||"unset",streak:S.streak,$process_person_profile:false},props||{},{$host:host,environment:"production"});
  const body=JSON.stringify({api_key:CFG.posthogKey,event,distinct_id:S.id,properties:p,timestamp:new Date().toISOString()});
  const url=(CFG.posthogHost||"https://us.i.posthog.com")+"/capture/";
  try{fetch(url,{method:"POST",body,keepalive:true,headers:{"Content-Type":"application/json"}}).catch(()=>{});}
  catch(e){try{navigator.sendBeacon&&navigator.sendBeacon(url,body);}catch(_){}}
}
function track(event,props){log(event,props);capture(event,props);}
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
function streakNow(){ if(!S.last) return 0; const g=daysBetween(S.last,today()); return g<=1?S.streak:0; }
function doneToday(){ return S.days.includes(today()); }
// Reload before choosing or saving so another tab's progress is not overwritten.
function syncProgress(){
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
  const text=reply.ok?(recovery.ok?(blind&&prior?.[1]?.ok===false?'This time, you recovered while your ball travelled.':'You chose more time and recovered while the ball travelled.'):'You chose more time, then waited to recover.'):(recovery.ok?'You recovered promptly. A higher reply could have bought more time.':'The quicker reply and the wait left you less recovery time.');
  return {kind:blind?'first_later_day':'practice',reply:reply.ok,recovery:recovery.ok,text};
}
function challengeUrl(slug){return bySlug(slug)?.livePoint?'https://www.gamesharptennis.com/play.html?l='+encodeURIComponent(slug)+'&challenge=point':null;}
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
  if(isDaily(slug)&&firstTime&&!nextDaily()) track("content_exhausted",{});
}
function setLevel(v){syncProgress();S.level=v;save(S);track("level_set",{level:v});}
function feedback(slug,useful,comment){
  syncProgress();S.fb[slug]={useful,day:today()};save(S);
  track("feedback",Object.assign({lesson:slug,useful},comment?{comment:String(comment).slice(0,500)}:{}));
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

window.GSApp={S,CAT,VER,today,track,opened,bySlug,isDaily,streakNow,doneToday,nextDaily,nextLivePoint,recordLiveRead,beginLiveAttempt,previousEdition,transferEvidence,challengeUrl,todays,startLesson,complete,setLevel,feedback,emit,on,
  log:()=>{try{return JSON.parse(ls.get(LOGK)||"[]");}catch(e){return [];}}};
})();
