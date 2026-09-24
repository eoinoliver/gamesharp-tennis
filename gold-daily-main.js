(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = {create: factory};
  else root.GameSharpMainDaily = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';
  const KEY = 'gs_main_daily_history_v1';
  let memory = {days:{}}, persistent = true;
  function legacyKey(date) {
    const [y,m,d] = date.split('-').map(Number);
    return 'gamesharp_daily_' + y + '_' + (m-1) + '_' + d;
  }
  function read() {
    if (!persistent) return memory;
    try {
      const raw = root.localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : {days:{}};
      if (!parsed || !parsed.days || typeof parsed.days !== 'object') throw Error('Invalid history');
      memory = parsed;
    } catch (_) { persistent = false; }
    return memory;
  }
  function completed(date) { const r=read().days[date]; return !!(r && r.lessonId===root.GameSharpGoldDailyLoop.lessonFor(date) && Array.isArray(r.answers) && r.answers.length===3 && r.answers.every(n=>Number.isInteger(n)&&n>=0&&n<4)); }
  function complete(date, lessonId, answers) {
    if (root.navigator && root.navigator.locks) {
      return root.navigator.locks.request('gamesharp-main-daily-completion',()=>completeNow(date,lessonId,answers)).catch(()=>{persistent=false;return false;});
    }
    return completeNow(date,lessonId,answers);
  }
  function completeNow(date, lessonId, answers) {
    const loop=root.GameSharpGoldDailyLoop, gold=root.GameSharpGoldDaily;
    if (loop.lessonFor(date)!==lessonId || !gold.challenges.some(c=>c.id===lessonId) || !Array.isArray(answers) || answers.length!==3 || !answers.every(n=>Number.isInteger(n)&&n>=0&&n<4)) return false;
    const data=read();
    if (completed(date)) return true;
    // Keep the first main-format result separate from earlier pilot answers.
    data.days[date]={lessonId,answers:answers.slice(),format:'three-connected-decisions'};
    memory=data;
    try {
      if (!persistent) return false;
      root.localStorage.setItem(KEY,JSON.stringify(data));
      const key=legacyKey(date);
      if(root.localStorage.getItem(key)!=='done') {
        root.updateStreak(true,date);
        const count=Number.parseInt(root.localStorage.getItem('gamesharp_challenges_done')||'0',10)||0;
        root.localStorage.setItem('gamesharp_challenges_done',String(count+1));
        root.localStorage.setItem(key,'done');
      }
      refreshHome();
      return true;
    } catch (_) { persistent=false; return false; }
  }
  function refreshHome() {
    if(!root.document || !root.GameSharpGoldDaily) return;
    const loop=root.GameSharpGoldDailyLoop,date=loop.dateKey();
    const c=root.GameSharpGoldDaily.challenges.find(c=>c.id===loop.lessonFor(date));
    if(!c)return;
    let saved=null;
    try{saved=loop.createStore(root.localStorage).get(date)}catch(_){}
    const done=completed(date),q=root.document.getElementById('dailyQ'),cta=root.document.getElementById('dailyCta');
    if(q){q.textContent=c.title;q.title=c.insight;}
    if(cta)cta.textContent=done?'✓ Completed today · replay':saved&&!saved.complete?'Resume Challenge →':'Start Challenge →';
    if(cta && root.GS_GOLD_DAILY_CSS_READY===false)cta.textContent='Daily is loading — refresh if unavailable';
    const card=root.document.getElementById('dailyCard');
    if(card)card.classList.toggle('gs-daily-complete',done);
    const dots=root.document.getElementById('dailyProgressDots');
    if(dots){const count=done?3:saved&&!saved.complete?saved.answers.length:0;dots.innerHTML=[0,1,2].map(i=>'<span class="daily-progress-dot'+(i<count?' is-complete':i===count?' is-current':'')+'" aria-hidden="true"></span>').join('');dots.setAttribute('aria-label',count+' of 3 decisions completed');}
    const situation=root.document.getElementById('dailySituation');
    if(situation)situation.textContent='One insight · three connected decisions';
    const streak=root.document.getElementById('streakCount');
    if(streak)streak.textContent=String(root.getStreak());
    const badge=root.document.getElementById('homeStreakBadge');
    if(badge)badge.textContent='🔥 '+root.getStreak();
  }
  if(root.document && root.document.addEventListener)root.document.addEventListener('visibilitychange',()=>{if(!root.document.hidden)refreshHome();});
  return {version:'2026-09-13.main-daily.1',key:KEY,complete,completed,refreshHome,persistent:()=>persistent,legacyKey};
});
