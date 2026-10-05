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
  foreground=true;
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
function nextDaily(){ return CAT.daily.find(l=>!S.done[l.slug])||null; }
/* today's lesson: the one finished today, else the next unplayed one */
function todays(){
  const t=today(), f=CAT.daily.find(l=>S.done[l.slug]&&S.done[l.slug].first===t);
  return f||nextDaily();
}
function complete(slug,n){
  const t=today(), d=S.done[slug], firstTime=!d;
  S.done[slug]=d?Object.assign(d,{last:t,times:d.times+1,best:Math.max(d.best,n)}):{first:t,last:t,times:1,best:n,n};
  if(!S.days.includes(t)){
    S.streak=(S.last&&daysBetween(S.last,t)===1)?S.streak+1:(S.last===t?S.streak:1);
    S.last=t; S.days.push(t); S.days=S.days.slice(-120);
  }
  save(S);
  track("lesson_complete",{lesson:slug,daily:isDaily(slug),first_time:firstTime,score:n,times:S.done[slug].times});
  if(isDaily(slug)&&firstTime&&!nextDaily()) track("content_exhausted",{});
}
function setLevel(v){S.level=v;save(S);track("level_set",{level:v});}
function feedback(slug,useful,comment){
  S.fb[slug]={useful,day:today()};save(S);
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

window.GSApp={S,CAT,VER,today,track,opened,bySlug,isDaily,streakNow,doneToday,nextDaily,todays,complete,setLevel,feedback,emit,on,
  log:()=>{try{return JSON.parse(ls.get(LOGK)||"[]");}catch(e){return [];}}};
})();
