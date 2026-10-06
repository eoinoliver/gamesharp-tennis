/* Sharpen v1: your game map. Zones by symptom -> the decision lessons, then the strokes behind them.
   Built 4 Oct 2026 (Claude). Images: app/sharpen/*.jpg, freeze-frames rendered from the lesson engine's clips.
   Guardrail: Sharpen organises decision lessons by symptom; stroke cards show mainstream positions, not swing coaching. */
(function(){
const ZONES=[
 {k:"forehand",name:"Forehand",line:"Misses, rushed contact, the line, the run-around.",strokes:["fh","drop"],spin:1,items:[
  ["My forehand misses when I'm rushed",["contact-clue","late-is-the-culprit"]],
  ["I go for the line too early",["the-line"]],
  ["Running around leaves the court open",["forehand-bill"]],
  ["I go for too much on a good ball",["the-winner"]]]},
 {k:"backhand",name:"Backhand",line:"Hiding it, running around it, where it goes when late.",strokes:["bh","slice"],spin:1,items:[
  ["I keep running around my backhand",["running-around"]],
  ["My backhand pulls into the middle",["late-is-the-culprit"]]]},
 {k:"serve",name:"Serve",line:"The second serve, and the shot after it.",strokes:["serve"],items:[
  ["My second serve gets attacked",["second-serve"]],
  ["I don't know what to do after my serve",["serve-plus-one"]],
  ["My first serve keeps coming back",["serve-away-from-the-lean"]]]},
 {k:"return",name:"Return",line:"Big serves, and the server's next shot.",strokes:[],items:[
  ["Big serves rush my return",["middle-return","find-your-return-spot"]]]},
 {k:"net",name:"Net",line:"Approaching, volleying, and facing a net player.",strokes:["fv","bv"],items:[
  ["My first volley is always hard",["approach-volley"]],
  ["They come in and I don't know where to hit",["net-rusher"]],
  ["I pass straight at the net player",["pass-where-they-arent"]],
  ["Drop shots catch me out",["answer-the-drop"]]]},
 {k:"movement",name:"Movement",line:"Late off the mark, recovery, defending wide.",strokes:[],items:[
  ["I'm late off the mark",["split-step"]],
  ["I recover to the middle automatically",["recovery"]],
  ["Pulled wide, I go for too much",["pulled-wide"]],
  ["High balls push me back",["high-ball"]]]},
 {k:"match",name:"Match play",line:"Short balls, open courts, leads and awkward opponents.",strokes:[],items:[
  ["I attack every short ball",["short-ball"]],
  ["I chase the open court",["open-court"]],
  ["I play smaller when I lead",["the-lead"]],
  ["Pushers and moonballers beat me",["the-pusher","the-moonballer"]],
  ["Big hitters rush me",["the-big-hitter"]],
  ["Lefties throw me",["the-lefty"]]]}
];
const STROKES={
 fh:{name:"Forehand drive",cols:["Turn","Contact","Finish"],grip:"Eastern or semi-western",cues:[["Turn early.","Shoulders side-on before the bounce."],["Below, then up.","The racquet drops below the ball and brushes up: topspin buys net clearance."],["Finish across.","Over the opposite shoulder."]]},
 drop:{name:"Forehand drop shot",cols:["Turn","Contact","Finish"],grip:"Continental",cues:[["Same turn.","It looks like the drive until late. That's the disguise."],["Open face, high to low.","The racquet stays above the ball and slides under it."],["Short finish.","Out in front. Slow the racquet, don't stop it."]]},
 bh:{name:"Two-handed backhand",cols:["Turn","Contact","Finish"],grip:"Bottom hand continental, top hand eastern forehand",cues:[["Turn with both hands.","Shoulders side-on, racquet back early."],["Contact in front.","Hands together, face square."],["Finish high.","Over the hitting-side shoulder."]]},
 slice:{name:"Backhand slice",cols:["Take-back","Contact","Finish"],grip:"Continental",cues:[["High take-back.","Racquet above the ball before you swing."],["Down and through.","Face slightly open, a descending path."],["Finish forward.","Long and low toward the target, not across."]]},
 serve:{name:"Serve",cols:["Trophy","Contact","Finish"],grip:"Continental",cues:[["Trophy.","Side-on, hitting elbow near shoulder height."],["Full reach.","Contact high and in front, arm extended."],["Finish across.","The racquet comes down across the body."]]},
 fv:{name:"Forehand volley",cols:["Set","Contact","Punch"],grip:"Continental",cues:[["Small set.","Racquet in front of you, almost no backswing."],["Contact in front.","Firm wrist, face slightly open."],["Short punch.","Then recover. No follow-through."]]},
 bv:{name:"Backhand volley",cols:["Set","Contact","Punch"],grip:"Continental",cues:[["Small set.","Racquet head above the wrist."],["Contact in front.","Meet it early, beside the front shoulder."],["Short punch.","Weight moves forward, the racquet doesn't swing."]]}
};
/* the athlete's stroke labels, in the order he plays them (5 Oct) */
const ATH=["fh","bh","slice","serve","fv","bv","drop"];
Object.assign(STROKES.fh,{label:"Forehand"});Object.assign(STROKES.bh,{label:"Backhand"});Object.assign(STROKES.slice,{label:"Slice"});
Object.assign(STROKES.serve,{label:"Serve"});Object.assign(STROKES.fv,{label:"Forehand volley"});Object.assign(STROKES.bv,{label:"Backhand volley"});Object.assign(STROKES.drop,{label:"Drop shot"});
let ath=null, trackFn=null;
function mount(){
  const st=document.getElementById("shAth"); if(!st) return;
  const chips=[...document.querySelectorAll("[data-ath]")], card=document.getElementById("shAthCard");
  const mark=k=>chips.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.ath===k)));
  const go=()=>{ath=window.GSAthlete.mount(st,{order:ATH,onStroke:mark});};
  chips.forEach(b=>b.onclick=()=>{const k=b.dataset.ath; mark(k); if(ath) ath.play(k);
    card.innerHTML=strokeCard(k).replace("<details","<details open"); trackFn&&trackFn("sharpen_stroke",{stroke:k});});
  if(window.GSAthlete) go(); else {const sc=document.createElement("script"); sc.src="athlete.js?v="+(window.GS_VERSION||""); sc.onload=go; document.head.appendChild(sc);}
}
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
  <div class="sh-strip">${s.cols.map((c,i)=>`<figure><img src="${IMG(k,i)}" alt="${s.name}: ${c}" loading="lazy"><figcaption>${c}</figcaption></figure>`).join("")}</div>
  ${s.cues.map(c=>`<p><b>${c[0]}</b> ${c[1]}</p>`).join("")}<p class="sh-grip">Grip: <b>${s.grip}</b>. <a href="?review=1&z=grips">See the grips →</a></p></div></details>`;}
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
  const L=s=>A.bySlug(s); const row=s=>{const l=L(s);if(!l)return "";const d=S.done[s];return `<a class="card" href="${href(l)}"><div><div class="t">${esc(l.title)}</div><div class="d">${esc(l.line)}</div></div><div class="go">${d?`✓${dots3(d)}`:"3 min →"}</div></a>`;};
  return `<section class="supplement sh-sec"><a class="sh-back" href="?review=1">← Your game</a><div class="k">${z.name}</div><h1>What happens to you?</h1>
   ${z.items.map(([sym,ls])=>`<div class="sh-sym"><div class="sh-symt">${esc(sym)}</div><div class="lib">${ls.map(row).join("")}</div></div>`).join("")}
   ${z.strokes.length?`<div class="k" style="margin-top:22px">The strokes</div>${z.strokes.map(strokeCard).join("")}`:""}
   ${z.spin?`<p class="sh-more"><a href="?review=1&z=spin">Topspin vs slice →</a> · <a href="?review=1&z=grips">Grips →</a></p>`:""}</section>`;}
function myGame(){let g=[];try{g=JSON.parse(localStorage.getItem("gs_my_game")||"[]");}catch(e){}
  if(!g.length)return "";const seen=new Set();g=g.filter(c=>!seen.has(c.cue)&&seen.add(c.cue));
  return `<div class="sh-my"><div class="k">My Game: your saved cues</div>${g.slice(-12).reverse().map(c=>`<div class="sh-cue"><b>${String(c.cue).replace(/[&<>"]/g,"")}</b><span>${String(c.lesson||"").replace(/[&<>"]/g,"")}</span></div>`).join("")}</div>`;}
function mapView(A,S){
  const n=z=>z.items.reduce((a,[,ls])=>a+ls.length,0), done=z=>z.items.reduce((a,[,ls])=>a+ls.filter(s=>S.done[s]).length,0);
  return `<section class="supplement sh-sec sh-map"><h1>Sharpen your game</h1><p>Pick the part of your game that lets you down. Each one leads to the decisions behind it, then the strokes.</p>
   <div class="sh-hero sh-ath" id="shAth"><img src="sharpen/hero.jpg?v=${window.GS_VERSION||""}" alt="A GameSharp player hitting a forehand"></div>
   <div class="sh-labels" role="group" aria-label="Strokes">${ATH.map(k=>`<button type="button" data-ath="${k}">${STROKES[k].label}</button>`).join("")}</div><div id="shAthCard"></div>
   <div class="sh-zones">${ZONES.map(z=>`<a class="sh-zone" href="?review=1&z=${z.k}"><b>${z.name}</b><span>${z.line}</span><i>${done(z)}/${n(z)}</i></a>`).join("")}</div>
   <div class="sh-tools"><a href="?review=1&z=spin">Topspin vs slice</a><a href="?review=1&z=grips">Grips</a></div>${myGame()}</section>`;}
window.GS_SHARPEN={mount,render(A,S,href,dots3,esc){trackFn=A.track; const k=new URLSearchParams(location.search).get("z");
  if(!window.__shTracked&&(k==="spin"||k==="grips")){window.__shTracked=1; A.track&&A.track("sharpen_open",{zone:k});}
  if(k==="spin")return `<a class="sh-back sh-top" href="?review=1">← Your game</a>`+spinCard();
  if(k==="grips")return `<a class="sh-back sh-top" href="?review=1">← Your game</a>`+gripsCard();
  const z=ZONES.find(z=>z.k===k); if(!window.__shTracked){window.__shTracked=1; A.track&&A.track("sharpen_open",{zone:k||"map"});}
  return z?zoneView(z,A,S,href,dots3,esc):mapView(A,S);},ZONES,STROKES};
})();
