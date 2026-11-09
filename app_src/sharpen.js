/* Sharpen v1: your game map. Zones by symptom -> the decision lessons, then the strokes behind them.
   Built 4 Oct 2026 (Claude). Images: app/sharpen/*.jpg, freeze-frames rendered from the lesson engine's clips.
   Guardrail: Sharpen organises decision lessons by symptom; stroke cards show mainstream positions, not swing coaching. */
(function(){
const ZONES=[
 {k:'doubles',name:'Doubles',line:'Read four players. Agree the next job.',strokes:[],items:[
  ['We leave the same space open',['doubles-cross-cover','doubles-hold-cover']],
  ['Their net player gets in my head',['doubles-return-space','doubles-return-line']],
  ['Neither of us owns the lob',['doubles-lob-switch','doubles-lob-overhead']]]},
 {k:"forehand",name:"Forehand",line:"Misses, rushed contact, the line, the run-around.",strokes:["fh","drop"],spin:1,items:[
  ["My forehand misses when I'm rushed",["contact-clue","late-is-the-culprit"]],
  ["I go for the line too early",["the-line","live-point-line-tempting","live-point-line-opens"]],
  ["Running around leaves the court open",["forehand-bill"]],
  ["I go for too much on a good ball",["the-winner"]]]},
 {k:"backhand",name:"Backhand",line:"Hiding it, running around it, where it goes when late.",strokes:["bh","slice"],spin:1,items:[
  ["I keep running around my backhand",["running-around"]],
  ["My backhand pulls into the middle",["late-is-the-culprit","live-point-other-wing"]]]},
 {k:"serve",name:"Serve",line:"The second serve, and the shot after it.",strokes:["serve"],items:[
  ["My second serve gets attacked",["second-serve"]],
  ["I don't know what to do after my serve",["serve-plus-one","live-point-serve-see","live-point-return-deep"]],
  ["My first serve keeps coming back",["serve-away-from-the-lean"]]]},
 {k:"return",name:"Return",line:"Big serves, and the server's next shot.",strokes:[],items:[
  ["Big serves rush my return",["middle-return","find-your-return-spot","live-point-return-pressure","live-point-return-time"]]]},
 {k:"net",name:"Net",line:"Approaching, volleying, and facing a net player.",strokes:["fv","bv"],items:[
  ["My first volley is always hard",["approach-volley","earned-net","live-point-volley-build","live-point-volley-opening"]],
  ["They come in and I don't know where to hit",["net-rusher","live-point-over-head"]],
  ["I pass straight at the net player",["pass-where-they-arent","live-point-pass-two"]],
  ["Drop shots catch me out",["answer-the-drop","live-point-reach-drop","live-point-arrive-options"]]]},
 {k:"movement",name:"Movement",line:"Late off the mark, recovery, defending wide.",strokes:[],items:[
  ["I'm late off the mark",["split-step","live-point-make-room","live-point-short-low"]],
  ["I recover to the middle automatically",["recovery"]],
  ["Pulled wide, I go for too much",["pulled-wide","rushed-out-wide","earned-defence","live-point-buy-time"]],
  ["High balls push me back",["high-ball"]]]},
 {k:"match",name:"Match play",line:"Short balls, open courts, leads and awkward opponents.",strokes:[],items:[
  ["I attack every short ball",["short-ball","earned-attack"]],
  ["I chase the open court",["open-court"]],
  ["I never know when to go down the line",["down-the-line"]],
  ["I play smaller when I lead",["the-lead"]],
  ["Pushers and moonballers beat me",["the-pusher","the-moonballer"]],
  ["Big hitters rush me",["the-big-hitter"]],
  ["Lefties throw me",["the-lefty"]],
  ["Their weak side stops working",["attack-the-backhand"]]]}
];
const STROKES={
 fh:{name:"Forehand drive",cols:["Turn","Contact","Finish"],grip:"Eastern or semi-western",cues:[["Turn early.","Shoulders side-on before the bounce."],["Below, then up.","The racquet drops below the ball and brushes up: topspin buys net clearance."],["Finish across.","Over the opposite shoulder."]]},
 drop:{name:"Forehand drop shot",cols:["Turn","Contact","Finish"],grip:"Continental",cues:[["Same turn.","It looks like the drive until late. That's the disguise."],["Open face, high to low.","The racquet stays above the ball and slides under it."],["Short finish.","Out in front. Slow the racquet, don't stop it."]]},
 bh:{name:"Two-handed backhand",cols:["Turn","Contact","Finish"],grip:"Bottom hand continental, top hand eastern forehand",cues:[["Turn with both hands.","Shoulders side-on, racquet back early."],["Contact in front.","Hands together, face square."],["Finish high.","Keep both hands on the handle through the finish."]]},
 slice:{name:"Backhand slice",cols:["Take-back","Contact","Finish"],grip:"Continental",cues:[["High take-back.","Racquet above the ball before you swing."],["Down and through.","Face slightly open, a descending path."],["Finish forward.","Extend through the contact before recovering."]]},
 serve:{name:"Serve",cols:["Trophy","Contact","Finish"],grip:"Continental",cues:[["Trophy.","Side-on, hitting elbow near shoulder height."],["Full reach.","Contact high and in front, arm extended."],["Finish across.","The racquet comes down across the body."]]},
 fv:{name:"Forehand volley",cols:["Set","Contact","Punch"],grip:"Continental",cues:[["Small set.","Split, bend the knees and turn the shoulders."],["Contact in front.","Firm wrist, face slightly open."],["Short punch.","Step with the left foot and punch towards the target."]]},
 bv:{name:"Backhand volley",cols:["Set","Contact","Punch"],grip:"Continental",cues:[["Small set.","Split, load the legs and turn; support the racquet throat."],["Contact in front.","Meet it early, beside the front shoulder."],["Short punch.","Step with the right foot; extend towards the target, then recover."]]}
};
/* the athlete's stroke labels, in the order he plays them (5 Oct) */
const ATH=["fh","bh","slice","serve","fv","bv","drop"];
Object.assign(STROKES.fh,{label:"Forehand"});Object.assign(STROKES.bh,{label:"Backhand"});Object.assign(STROKES.slice,{label:"Slice"});
Object.assign(STROKES.serve,{label:"Serve"});Object.assign(STROKES.fv,{label:"Forehand volley"});Object.assign(STROKES.bv,{label:"Backhand volley"});Object.assign(STROKES.drop,{label:"Drop shot"});
let ath=null, trackFn=null;
function mount(A=window.GSApp,redraw=()=>{}){
  window.GS_RESET?.mount(A);
  wireFocus(A,redraw);
  window.GSPractice?.mount(A,redraw);
  ath?.stop();ath=null;
  const st=document.getElementById("shAth");if(!st)return;
  const chips=[...document.querySelectorAll("[data-ath]")],card=document.getElementById("shAthCard");
  const mark=k=>{st.setAttribute('role','img');st.setAttribute('aria-label',STROKES[k].name+' technique illustration');chips.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.ath===k)));document.getElementById('shStrokeName').textContent=STROKES[k].name;};
  let selected='fh',slow=false,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pause=document.getElementById('shPause');
  const paintPause=()=>{pause.textContent=paused?'Play':'Pause';pause.setAttribute('aria-pressed',String(paused));};paintPause();
  const go=()=>{if(!st.isConnected)return;ath=window.GSAthlete.mount(st,{order:ATH,start:selected,onStroke:mark,onError:()=>{document.getElementById('shStatus').textContent='Animation unavailable. The reference frames are below. Replay to retry.';}});ath.speed(slow?.5:1);};
  chips.forEach(b=>b.onclick=()=>{selected=b.dataset.ath;mark(selected);ath?.play(selected);paused=matchMedia('(prefers-reduced-motion: reduce)').matches;paintPause();
    card.innerHTML=strokeCard(selected).replace('<details','<details open');trackFn?.('sharpen_stroke',{stroke:selected});});
  document.getElementById('shReplay').onclick=()=>{document.getElementById('shStatus').textContent='';ath?.replay();paused=false;paintPause();};
  document.getElementById('shSlow').onclick=e=>{slow=!slow;ath?.speed(slow?.5:1);e.currentTarget.setAttribute('aria-pressed',String(slow));e.currentTarget.textContent=slow?'Normal speed':'Slow view';};
  pause.onclick=()=>{paused=!paused;ath?.pause(paused);paintPause();};
  if(window.GSAthlete)go();else {const sc=document.createElement('script');sc.src='athlete.js?v='+(window.GS_VERSION||'');sc.onload=go;document.head.appendChild(sc);}
}
// One enlarged reference frame at a time, in every context where a card appears.
document.addEventListener('click',e=>{const b=e.target.closest('[data-phase]');if(!b)return;const card=b.closest('.sh-card');
  card.querySelectorAll('[data-phase]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  card.querySelectorAll('[data-phase-panel]').forEach(x=>x.hidden=x.dataset.phasePanel!==b.dataset.phase);
});
const GRIPS=[[2,"Continental","Serve, volley, smash, slice, drop shot. The ready grip at the net."],[3,"Eastern forehand","A flatter forehand; comfortable on low balls."],[4,"Semi-western","The modern topspin forehand; comfortable on high balls."],[5,"Western","Heavy topspin; low balls get hard."],[1,"Eastern backhand","The one-handed backhand."]];
const SPIN=`<svg viewBox="0 0 640 230" role="img" aria-label="Side view: topspin clears the net higher and kicks up to about waist height; slice skims lower and stays near knee height." style="width:100%;height:auto;display:block"><line x1="0" y1="208.0" x2="640" y2="208.0" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/><line x1="17.2" y1="204.0" x2="17.2" y2="212.0" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/><line x1="589.1" y1="204.0" x2="589.1" y2="212.0" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/><line x1="457.1" y1="204.0" x2="457.1" y2="212.0" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/><line x1="149.2" y1="204.0" x2="149.2" y2="212.0" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/><line x1="303.2" y1="208.0" x2="303.2" y2="125.7" stroke="rgba(255,255,255,.8)" stroke-width="3"/><text x="308.2" y="128.7" font-size="10" fill="rgba(255,255,255,.6)">NET</text><text x="17.2" y="224.0" font-size="10" text-anchor="middle" fill="rgba(255,255,255,.5)">YOU</text><text x="589.1" y="224.0" font-size="10" text-anchor="middle" fill="rgba(255,255,255,.5)">THEIR BASELINE</text><path d="M26.5,122.5 L39.0,118.6 L51.5,115.1 L63.8,111.8 L76.1,108.7 L88.2,105.9 L100.2,103.4 L112.0,101.1 L123.8,99.0 L135.5,97.2 L147.1,95.7 L158.5,94.4 L169.9,93.3 L181.1,92.5 L192.3,92.0 L203.4,91.6 L214.4,91.6 L225.3,91.8 L236.1,92.2 L246.8,92.9 L257.4,93.8 L268.0,94.9 L278.4,96.3 L288.8,97.9 L299.1,99.7 L309.3,101.8 L319.5,104.1 L329.6,106.8 L339.5,109.5 L349.4,112.6 L359.3,115.8 L369.1,119.3 L378.8,123.0 L388.4,127.0 L398.0,131.2 L407.5,135.6 L416.9,140.3 L426.3,145.2 L435.6,150.3 L444.9,155.7 L454.1,161.2 L463.2,167.1 L472.3,173.1 L481.3,179.3 L490.2,185.8 L499.1,192.5 L508.0,199.4 L516.7,206.6 L522.3,201.8 L528.6,196.8 L534.9,192.1 L541.2,187.7 L547.4,183.6 L553.6,179.9 L559.8,176.6 L565.9,173.5 L572.0,170.8 L578.1,168.5 L584.1,166.4 L590.1,164.7 L596.1,163.3 L602.1,162.2 L608.0,161.5 L613.9,161.0 L619.8,160.9 L625.7,161.1 L631.5,161.7 L637.3,162.6 L643.1,163.7 L648.8,165.2 L654.6,167.0 L660.3,169.0" fill="none" stroke="#9fc7ff" stroke-width="2.6" stroke-linecap="round"/><path d="M26.5,122.5 L40.9,113.5 L55.1,105.1 L69.2,97.5 L83.2,90.4 L97.0,84.0 L110.7,78.2 L124.2,73.0 L137.6,68.4 L150.9,64.4 L164.1,61.0 L177.1,58.2 L190.0,56.0 L202.8,54.3 L215.4,53.1 L227.9,52.5 L240.4,52.4 L252.7,52.8 L264.9,53.8 L276.9,55.4 L288.9,57.3 L300.8,59.8 L312.5,62.8 L324.1,66.2 L335.7,70.2 L347.1,74.6 L358.4,79.6 L369.6,84.9 L380.8,90.7 L391.8,96.9 L402.7,103.7 L413.5,110.8 L424.2,118.5 L434.9,126.5 L445.4,134.9 L455.8,143.8 L466.2,153.1 L476.5,162.8 L486.6,172.9 L496.7,183.4 L506.7,194.4 L516.6,205.7 L522.2,199.9 L528.2,191.8 L534.2,184.1 L540.2,176.8 L546.2,170.0 L552.1,163.6 L558.0,157.6 L563.9,152.1 L569.7,147.0 L575.6,142.3 L581.4,138.0 L587.2,134.1 L593.0,130.7 L598.7,127.6 L604.4,125.0 L610.1,122.8 L615.8,121.0 L621.4,119.5 L627.1,118.5 L632.7,117.9 L638.2,117.7 L643.8,117.9 L649.3,118.5 L654.8,119.4 L660.3,120.8" fill="none" stroke="#d3e267" stroke-width="2.6" stroke-linecap="round"/><text x="240.4" y="42.4" font-size="12" font-weight="700" fill="#d3e267" text-anchor="middle">TOPSPIN</text><text x="203.4" y="107.6" font-size="12" font-weight="700" fill="#9fc7ff" text-anchor="middle">SLICE</text></svg>`;
const IMG=(k,i)=>`sharpen/${k}_${i}.jpg?v=${window.GS_VERSION||""}`;
function gripSVG(b){const R=27,c=40,P=i=>{const a=(-90+45*(i-1)-22.5)*Math.PI/180,a2=(-90+45*(i-1)+22.5)*Math.PI/180;return [[c+R*Math.cos(a),c+R*Math.sin(a)],[c+R*Math.cos(a2),c+R*Math.sin(a2)]];};
 let s=`<svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true">`;
 for(let i=1;i<=8;i++){const [p,q]=P(i),on=i===b,m=[(p[0]+q[0])/2,(p[1]+q[1])/2],t=[c+(m[0]-c)*1.32,c+(m[1]-c)*1.32];
  s+=`<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${on?"#c8a84b":"rgba(255,255,255,.35)"}" stroke-width="${on?5:2}" stroke-linecap="round"/>`;
  s+=`<text x="${t[0].toFixed(1)}" y="${(t[1]+3).toFixed(1)}" font-size="8" text-anchor="middle" fill="${on?"#c8a84b":"rgba(255,255,255,.45)"}">${i}</text>`;}
 return s+`</svg>`;}
function strokeCard(k){const s=STROKES[k];return `<details class="sh-card"><summary><span>${s.name}</span><span class="pl">+</span></summary><div class="sh-body">
  <div class="sh-phases" role="group" aria-label="${s.name} reference phases">${s.cols.map((c,i)=>`<button type="button" data-phase="${i}" aria-pressed="${i===0}">${c}</button>`).join('')}</div>
  <div class="sh-strip">${s.cols.map((c,i)=>`<figure data-phase-panel="${i}"${i?' hidden':''}><img src="${IMG(k,i)}" alt="${s.name}: ${c}" loading="lazy"><figcaption><b>${s.cues[i][0]}</b> ${s.cues[i][1]}</figcaption></figure>`).join('')}</div>
  <p class="sh-grip">Grip: <b>${s.grip}</b>. <a href="?review=1&z=grips">See the grips →</a></p></div></details>`;}
function spinCard(){return `<section class="supplement sh-sec"><div class="k">Spin: topspin vs slice</div><h2>Same target, two spins</h2>
  <div class="sh-spin">${SPIN}</div>
  <p><b style="color:#d3e267">Topspin</b> clears the net by about 0.7 m and still dips in, then kicks up to about waist height. Margin, and a high ball for them.</p>
  <p><b style="color:#9fc7ff">Slice</b> skims about 0.3 m over the net, floats a little longer, and stays down near knee height. A low ball for them, and time for you.</p>
  <p class="sh-note">Modelled with the lesson ball physics at typical club-to-advanced speeds: 110 km/h with 2,600 rpm topspin against 95 km/h with 1,600 rpm backspin, both from your baseline to just inside theirs. The bounce model is simplified, so read the heights as a guide.</p>
  ${strokeCard("fh")}${strokeCard("slice")}</section>`;}
function gripsCard(){return `<section class="supplement sh-sec"><div class="k">Grips</div><h2>Where your knuckle sits</h2>
  <p>Look at the end of the handle with the racquet on its edge: the top flat side is bevel 1, then count clockwise. Your grip is the bevel under the base knuckle of your index finger. (Right-handers. Left-handers count the other way.)</p>
  <div class="sh-grips">${GRIPS.map(([b,n,u])=>`<div class="sh-grip-row">${gripSVG(b)}<div><b>${n}</b> <span class="sh-bev">bevel ${b}</span><p>${u}</p></div></div>`).join("")}</div>
  <p><b>Why it matters for decisions:</b> the grip decides which shots are easy. Caught in a forehand grip at the net, the low volley is hard. That's why you wait at the net in continental.</p>
  <p class="sh-note">Bevel positions: <a href="https://www.head.com/en/rs/stories/how-to-hold-a-tennis-racquet" target="_blank" rel="noopener">HEAD</a>, <a href="https://ushsta.org/?p=449" target="_blank" rel="noopener">USHSTA</a>.</p></section>`;}
function zoneView(z,A,S,href,dots3,esc){
  const L=s=>A.bySlug(s); const row=s=>{const l=L(s);if(!l)return "";const d=S.done[s];return `<a class="card" href="${href(l)}"><div><div class="t">${esc(A.displayTitle(l))}</div><div class="d">${esc(l.line)}</div><div class="d">${esc(A.activityLabel(l))}</div></div><div class="go">${d?`Played${dots3(d)}`:"Play →"}</div></a>`;};
  return `<section class="supplement sh-sec"><a class="sh-back" href="?review=1">← Your game</a><div class="k">${z.name}</div><h1>What happens to you?</h1>
   ${z.items.map(([sym,ls])=>{const p=A.PRACTICE_PATHS.find(p=>p.zone===z.k&&p.slugs[0]===ls[0]);return `<div class="sh-sym"${p?` id="path-${p.id}"`:''}><h2 class="sh-symt">${esc(sym)}</h2>${p?pathView(A,p,href,esc)+`<div class="lib">${ls.filter(s=>!p.slugs.includes(s)).map(row).join('')}</div>`:`<div class="lib">${ls.map(row).join("")}</div>`}</div>`;}).join("")}
   ${z.strokes.length?`<div class="k" style="margin-top:22px">The strokes</div>${z.strokes.map(strokeCard).join("")}`:""}
   ${z.spin?`<p class="sh-more"><a href="?review=1&z=spin">Topspin vs slice →</a> · <a href="?review=1&z=grips">Grips →</a></p>`:""}</section>`;}
function pathView(A,p,href,esc){const progress=A.pathProgress(p.id);if(!progress)return '';
  const link=l=>`${href(l)}&path=${p.id}`,n=progress.next;
  return `<div class="sh-path"><p>Learn the decision, use it in a point, then return to a changed situation. Start wherever helps.</p>
  ${n?`<a class="sh-path-next" href="${link(n.lesson)}">${n.seen?'Return to':'Next'}: ${esc(n.lesson.title)} →</a>`:progress.waiting?'<p class="sh-note">The changed situation will be ready here on a later day. You can take a saved cue onto court meanwhile.</p>':'<p class="sh-note">All three activities played. Revisit one whenever useful.</p>'}
  <ol class="sh-path-steps">${progress.steps.map((s,i)=>`<li><div class="k">${i+1} · ${esc(s.purpose)}</div>${s.early?`<p class="sh-note">Return after playing the first Live Point on an earlier day.</p><details><summary>Try the variation now as practice</summary><a class="card" href="${link(s.lesson)}"><div class="t">${esc(s.lesson.title)}</div><span class="go">Practice →</span></a><p class="sh-note">An early look is practice, not a fresh later-day read.</p></details>`:`<a class="card" href="${link(s.lesson)}"><div><div class="t">${esc(s.lesson.title)}</div><div class="d">${esc(A.activityLabel(s.lesson))}</div></div><span class="go">${s.done?'Played · replay':s.seen?'Return →':'Play →'}</span></a>`}</li>`).join('')}</ol></div>`;
}
function focusView(A,href,esc){const {active:a,available,changed,current}=A.nextHit();
  if(!available)return '<p class="storage-warning" role="status">Your focus cannot be read from this browser. Existing data has not been replaced. You can still use your saved cues below.</p>';
  if(!a)return '<p class="sh-note">Choose one saved cue for your next hit. You can change it whenever you need.</p>';
  const button=(action,label,value='')=>`<button type="button" data-focus-action="${action}" data-value="${value}" data-focus-id="${esc(a.id)}">${label}</button>`;
  const f=a.reflection||{},yesNo=(action)=>button(action,'Yes','yes')+button(action,'No','no');
  let content='';
  if(a.phase==='ready')content=`<p>${a.reminderHidden?'Kept here until you are ready.':'Take this cue to your next match or practice.'}</p><div class="sh-focus-actions">${button('played','I’ve played since choosing this')}${!a.reminderHidden?button('defer','Not yet · remind me here only'):''}</div>`;
  if(a.phase==='reflecting'){
    const question=f.occurred==null?'Did this situation come up?':f.tried==null?'Did you try the cue?':'Was the cue useful?';
    const options=f.occurred==null?yesNo('occurred')+button('occurred','Not sure','unsure'):f.tried==null?yesNo('tried'):button('useful','Yes','yes')+button('useful','Partly','partly')+button('useful','Not really','no')+button('useful','Not sure','unsure');
    content=`<h3 id="focusQuestion" tabindex="-1">${question}</h3><div class="sh-focus-actions" role="group" aria-labelledby="focusQuestion">${options}</div>${button('cancel','Back to my focus')}`;
  }
  if(a.phase==='reflected'){
    const summary=f.occurred==='no'?'The situation did not come up.':f.occurred==='unsure'?'You were not sure whether the situation came up.':f.tried==='no'?'The situation came up; you did not try the cue.':`You tried the cue. ${f.useful==='yes'?'You found it useful.':f.useful==='partly'?'You found it partly useful.':f.useful==='no'?'You did not find it useful.':'You were not sure whether it helped.'}`;
    content=`<h3>Your reflection</h3><p>${summary}</p><p class="sh-note">Saved in this browser as your own report, not a score or a measure of improvement.</p><div class="sh-focus-actions">${!changed?button('keep','Keep for my next hit'):''}<a href="#saved-cues">Choose another cue</a>${button('finish','Finish this focus')}</div>`;
  }
  return `<article class="sh-focus" id="next-hit" aria-labelledby="focusTitle"><div class="k">Your next-hit focus</div><h2 id="focusTitle" tabindex="-1">${esc(a.cue)}</h2><p class="sh-note">From ${esc(a.lesson)}</p>${changed?`<p class="storage-warning">${current?'This lesson’s guidance has changed. This is the cue you chose earlier. Review the current lesson before using it again.':'This lesson is no longer available. This is the cue you saved earlier.'}</p>${current?`<a href="${href(current)}&from=my-game">Review the current lesson →</a>${A.cueSaved(a.slug)?`<button data-focus-select="${esc(a.slug)}" data-focus-id="${esc(a.id)}">Use the current cue instead</button>`:''}`:''}`:a.drill?`<details><summary>Take it to court · ${esc(a.drill.name||'Practice drill')}</summary><p>${esc(a.drill.how||'')}</p></details>`:''}${content}${a.phase!=='reflected'?`<div class="sh-focus-links"><a href="#saved-cues">Choose another cue</a>${button('finish','Finish this focus')}</div>`:''}</article>`;
}
function wireFocus(A,redraw){
  document.querySelectorAll('[data-focus-select],[data-focus-action]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.focusId||null,r=b.hasAttribute('data-focus-select')?A.selectFocus(b.dataset.focusSelect,id):A.focusAction(id,b.dataset.focusAction,b.dataset.value);
    if(r.ok){redraw();const target=document.getElementById('focusQuestion')||document.getElementById('focusTitle')||document.getElementById('saved-cues');target?.focus({preventScroll:true});target?.scrollIntoView({block:'nearest'});}
    const status=document.getElementById('focusStatus');if(status){status.textContent=r.ok?'Saved in this browser.':r.reason==='changed'?'Your focus changed in another tab. Reload to see it before making another change.':r.reason==='invalid'?'This action is no longer available. Reload to see your current focus.':'Could not verify that your focus was saved. Reload to check before continuing.';if(!r.ok)status.scrollIntoView({block:'nearest'});}
  });
}
function myGame(A,href,esc){const g=A.savedCues(),focus=A.nextHit();
  return `<section class="supplement sh-sec"><a class="sh-back" href="?review=1">← Sharpen</a><div class="k">Your practice</div><h1>My Game</h1><p class="sh-note">Your practice, your next read, and one cue for court. Saved on this browser, not synced between devices.</p>${window.GSPractice?.overview(A)||''}
  ${window.GS_RESET?.reminder()||''}${focusView(A,href,esc)}<p id="focusStatus" role="status" aria-live="polite"></p>${window.GSPractice?.history(A)||''}<h2 id="saved-cues" tabindex="-1">Saved cues</h2>
  ${g.length?g.map(c=>{const l=A.bySlug(c.slug);return `<article class="sh-practice"><div class="k">${esc(c.lesson||'Saved cue')}</div><h2>${esc(c.cue)}</h2>${c.updated?'<p class="sh-note">Updated coaching cue from your saved lesson.</p>':''}${c.drill?`<details><summary>Take it to court · ${esc(c.drill.name||'Practice drill')}</summary><p>${esc(c.drill.how||'')}</p></details>`:'<p>Bring this cue to your next hit. Notice when the situation calls for it.</p>'}${l?`<a class="sh-back" href="${href(l)}&from=my-game">Replay the point →</a>${focus.available?focus.active?.slug===c.slug?'<p class="sh-note">Your selected focus</p>':`<button type="button" data-focus-select="${esc(c.slug)}" data-focus-id="${esc(focus.active?.id||'')}">${focus.active?'Switch my focus to this':'Make this my next-hit focus'}</button>`:''}`:''}</article>`;}).join(''):'<p>After a lesson, save its court cue here. You can return to the point and take its drill to your next hit.</p><a class="btn" href="?review=1">Find a part of your game →</a>'}${window.GSPractice?.settings(A)||''}<p class="sh-note">Clearing this browser’s data removes practice history, goals and saved cues.</p></section>`;
}
function mapView(A,S){
  const slugs=z=>[...new Set(z.items.flatMap(([,ls])=>ls))],n=z=>slugs(z).length,done=z=>slugs(z).filter(s=>S.done[s]).length;
  return `<section class="supplement sh-sec sh-map"><section class="sh-reference" aria-label="Stroke reference"><div class="k">Sharpen · Stroke reference</div><h1 id="shStrokeName">Forehand drive</h1>
   <div class="sh-labels" role="group" aria-label="Strokes">${ATH.map(k=>`<button type="button" data-ath="${k}" aria-pressed="${k==='fh'}">${STROKES[k].label}</button>`).join('')}</div>
   <div class="sh-hero sh-ath" id="shAth"><img src="sharpen/hero.jpg?v=${window.GS_VERSION||''}" alt="A GameSharp player hitting a forehand"></div>
   <div class="sh-controls"><button type="button" id="shReplay">Replay</button><button type="button" id="shSlow" aria-pressed="false">Slow view</button><button type="button" id="shPause">Pause</button></div>
   <p id="shStatus" role="status"></p><div id="shAthCard">${strokeCard('fh')}</div></section>
   <div class="sh-tools"><a href="?review=1&z=spin">Topspin vs slice</a><a href="?review=1&z=grips">Grips</a></div>
   <section class="sh-work" aria-labelledby="shWorkTitle"><div class="k">Your game</div><h2 id="shWorkTitle">What needs work?</h2><p>Find the decision behind the shot. Counts show activities played, not mastery.</p><a class="sh-my-entry" href="?review=1&z=my-game"><b>My Game</b><span>Your practice history · your next on-court cue →</span></a>
   <a class="sh-my-entry reset-entry" href="?review=1&z=reset"><b>Reset</b><span>After a miss. Before a big point. When it gets tense between you. →</span></a>
   <div class="sh-zones">${ZONES.map(z=>`<a class="sh-zone" href="?review=1&z=${z.k}"><b>${z.name}</b><span>${z.line}</span><i>${done(z)}/${n(z)} played</i></a>`).join('')}</div></section></section>`;
}
window.GS_SHARPEN={mount,render(A,S,href,dots3,esc){trackFn=A.track; const k=new URLSearchParams(location.search).get("z");
  if(k==='reset'&&window.GS_RESET)return GS_RESET.render();
  if(!window.__shTracked&&(k==="spin"||k==="grips")){window.__shTracked=1; A.track&&A.track("sharpen_open",{zone:k});}
  if(k==="my-game")return myGame(A,href,esc);
  if(k==="spin")return `<a class="sh-back sh-top" href="?review=1">← Your game</a>`+spinCard();
  if(k==="grips")return `<a class="sh-back sh-top" href="?review=1">← Your game</a>`+gripsCard();
  const z=ZONES.find(z=>z.k===k); if(!window.__shTracked){window.__shTracked=1; A.track&&A.track("sharpen_open",{zone:k||"map"});}
  return z?zoneView(z,A,S,href,dots3,esc):mapView(A,S);},ZONES,STROKES};
})();
