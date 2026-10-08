/* Sharpen athlete: the lesson engine's own figure playing each stroke's real lesson swing (mocap clips).
   build.py wraps this file with rally/core.js + rally/figure.js into app/athlete.js (one closure, no globals but GSAthlete).
   Loaded only when Sharpen opens. Cycles through the strokes; a picked stroke loops. Reduced motion: the contact frame, still.
   Built 5 Oct 2026 (Claude). */
const CLIPS={fh:"fh",bh:"bh",slice:"bhSlice",serve:"serveT",fv:"lowfv",bv:"bv",drop:"drop"};
const LEAD={fh:70,bh:34,slice:60,serve:999,fv:55,bv:60,drop:70};   /* frames of preparation shown before contact */
const I={}, CL={}, V=window.GS_VERSION||"";
VW=520; VH=360; CYF=0.56;
cam={az:-128,el:13,d:7.6,fov:30,tgt:[0.15,0.9,1.0]}; buildBasis();
function load(k){
  return CL[k]||(CL[k]=fetch(`clips/${CLIPS[k]}.json?v=${V}`).then(r=>{if(!r.ok)throw new Error(r.status);return r.json();})
    .then(c=>{if(!("hips" in I))c.joints.forEach((n,i)=>I[n]=i);return c;}));
}
function at(c,f){
  f=clamp(f,1,c.frameCount); const i=Math.floor(f),u=f-i,j=Math.min(c.frameCount,i+1);
  const A=c.frames[i-1],B=c.frames[j-1],RA=c.racquetFrames[i-1],RB=c.racquetFrames[j-1];
  const pose=A.map((p,k)=>lerp3(p,B[k],u)), axis=norm(lerp3(RA.axis,RB.axis,u)), lat=lerp3(RA.lateral,RB.lateral,u);
  return {pose,rq:{w:pose[I.wristR],axis,lateral:norm(sub(lat,mul(axis,dot(lat,axis)))),centre:lerp3(RA.centre,RB.centre,u)}};
}
/* the ball (8 Oct, Eoin: "the serve omits the visible ball in the toss"): simple flights under gravity, metres and
   seconds, 100 frames a second.
   Serve: in the tossing hand from the first frame, released at the hand's highest point, up and down onto the contact.
   Groundstrokes: their ball crosses the net, bounces 4.5 m in front of you and rises to the contact.
   Volleys: met in the air. After contact the ball flies on over the net (and the serve lands in the box) until the
   swing ends, so it never vanishes while the racquet is still moving. */
const G=9.81, GROUND=new Set(["fh","bh","slice","drop"]), REL={};
function fall(p,v,t){return [p[0]+v[0]*t,p[1]+v[1]*t,p[2]+v[2]*t-G/2*t*t];}
function bounced(p,v,t){   /* one bounce if it reaches the ground (70% of the vertical speed back) */
  const tg=(v[2]+Math.sqrt(v[2]*v[2]+2*G*p[2]))/G; if(t<=tg) return fall(p,v,t);
  const q=fall(p,v,tg); return fall([q[0],q[1],0],[v[0],v[1],0.7*(G*tg-v[2])],t-tg);}
function release(c){   /* the tossing hand's highest point before contact */
  if(REL[c.contactFrame+"/"+c.frameCount]) return REL[c.contactFrame+"/"+c.frameCount];
  let best=1,bz=-1; for(let f=1;f<c.contactFrame-25;f++){const z=c.frames[f-1][I.wristL][2]; if(z>bz){bz=z;best=f;}}
  return REL[c.contactFrame+"/"+c.frameCount]=best;}
const OUT={fh:[0,25,1.55],bh:[0,25,1.45],slice:[0,22,1.15],drop:[0,14,1.1],fv:[0,18,1.2],bv:[0,18,1.2]};   /* forward speed m/s, height crossing the net */
function ballAt(k,c,f){
  const C=c.contactBall, cf=c.contactFrame, t=(f-cf)/100;
  if(k==="serve"){
    if(f>=cf){const T=0.4, v=[0.3,16.5/T,(-C[2]+G/2*T*T)/T]; return bounced(C,v,t);}   /* lands about 16.5 m on, inside the service line */
    const r=release(c), hand=g=>{const w=at(c,g).pose[I.wristL];return [w[0],w[1],w[2]+0.07];};
    if(f<=r) return hand(f);
    const p0=hand(r), T=(cf-r)/100, tt=(f-r)/100;
    return [lerp(p0[0],C[0],tt/T),lerp(p0[1],C[1],tt/T),p0[2]+((C[2]-p0[2]+G/2*T*T)/T)*tt-G/2*tt*tt];}
  if(f<cf){
    if(GROUND.has(k)){const tb=0.18, B=[C[0]-0.25,C[1]+4.5,0];
      if(-t<=tb){const vz=(C[2]+G/2*tb*tb)/tb, s=(t+tb)/tb; return [lerp(B[0],C[0],s),lerp(B[1],C[1],s),vz*(t+tb)-G/2*(t+tb)*(t+tb)];}
      const ta=0.4, u=(-t-tb); if(u>ta) return null;          /* before the bounce: down from 1.6 m over the net */
      const z0=1.6, vz0=(-z0+G/2*ta*ta)/ta, s=1-u/ta;
      return [B[0]-0.4*(u/ta),B[1]+25*u,z0+vz0*(ta-u)-G/2*(ta-u)*(ta-u)].map((x,i)=>i<2?x:Math.max(0,x));}
    const ta=0.45; if(-t>ta) return null;                    /* a volley: straight in, still in the air */
    return fall([C[0]-0.3,C[1]+18*ta,1.4],[0.3/ta,-18,(C[2]-1.4+G/2*ta*ta)/ta],t+ta);}
  const [vx,vy,hn]=OUT[k], T=Math.max(0.2,(11.5-C[1])/vy);    /* over the net at height hn */
  return bounced(C,[vx+(k==="bh"||k==="slice"||k==="bv"?-0.6:0.6),vy,(hn-C[2]+G/2*T*T)/T],t);
}
const BL=-0.35, SL=4.115, DL=5.485, NET=BL+11.885;   /* court around the player: baseline just behind them */
function court(g){
  quad(g,[[-9,-4,0],[9,-4,0],[9,NET+3,0],[-9,NET+3,0]],"#0b3016");
  quad(g,[[-DL,BL,0],[DL,BL,0],[DL,NET,0],[-DL,NET,0]],"#13502a");
  const ln=(a,b)=>seg(g,[a[0],a[1],0],[b[0],b[1],0],"rgba(240,236,227,.8)",1.6);
  ln([-DL,BL],[DL,BL]);ln([-DL,BL],[-DL,NET]);ln([DL,BL],[DL,NET]);ln([-SL,BL],[-SL,NET]);ln([SL,BL],[SL,NET]);
  ln([-SL,NET-6.4],[SL,NET-6.4]);ln([0,NET-6.4],[0,NET]);ln([0,BL],[0,BL+.15]);
  const W=DL+.9,top=[[-W,NET,1.07],[0,NET,.914],[W,NET,1.07]];
  quad(g,[[-W,NET,0],[W,NET,0],top[2],top[1],top[0]],"rgba(4,10,6,.45)");
  seg(g,top[0],top[1],"rgba(240,236,227,.85)",2);seg(g,top[1],top[2],"rgba(240,236,227,.85)",2);
}
function draw(svg,k,c,f){
  const g=document.createDocumentFragment(); court(g);
  const s=at(c,f), A=s.pose[I.ankleL], B=s.pose[I.ankleR];
  ring(g,[(A[0]+B[0])/2,(A[1]+B[1])/2,.004],.42,.32,"none",0,1,"rgba(0,0,0,.35)");
  const parts=[]; drawFigure(parts,s.pose,s.rq,{kit:KIT_PREM,fwd:[0,1,0],band:"#d9b24a",bandDk:"#8f7632"});   // the premium kit, as in the lessons
  const b=ballAt(k,c,f), bq=b&&P(b);
  if(bq){const sh=P([b[0],b[1],.003]); if(sh) g.appendChild(el_("ellipse",{cx:sh.s[0].toFixed(1),cy:sh.s[1].toFixed(1),rx:(FOCAL*.05/sh.z).toFixed(1),ry:(FOCAL*.02/sh.z).toFixed(1),fill:"rgba(0,0,0,.3)"}));
    const r=Math.max(2.2,FOCAL*.034/bq.z);
    parts.push({n:el_("circle",{cx:bq.s[0].toFixed(1),cy:bq.s[1].toFixed(1),r:r.toFixed(1),fill:"#e3f25a",stroke:"#9fb02a","stroke-width":.8}),z:bq.z-.01});}
  parts.sort((x,y)=>y.z-x.z).forEach(p=>g.appendChild(p.n));
  /* the racquet head's path into and through contact */
  if(Math.abs(f-c.contactFrame)<16) for(let i=Math.max(c.contactFrame-14,Math.floor(f)-12);i<=Math.floor(f);i++)
    seg(g,at(c,i-1).pose[I.racquetTip],at(c,i).pose[I.racquetTip],"#c8a84b",2,.12+.5*(1-(f-i)/12));
  svg.replaceChildren(g);
}
window.GSAthlete={mount(stage,o){
  const svg=document.createElementNS(SVGNS,"svg"); svg.setAttribute("viewBox",`0 0 ${VW} ${VH}`); svg.setAttribute("aria-hidden","true");
  stage.appendChild(svg);
  const order=o.order, still=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let k=o.start||order[0], loop=!!o.start, f=0, hold=0, last=null, alive=true, c=null;
  const range=c=>[Math.max(1,c.contactFrame-LEAD[k]),Math.min(c.frameCount,c.contactFrame+45)];
  const next=k=>order[(order.indexOf(k)+1)%order.length];
  function show(nk){k=nk;c=null;o.onStroke&&o.onStroke(k);
    if(!still)load(next(nk)).catch(()=>{});   /* the next stroke's clip, fetched while this one plays */
    load(k).then(cl=>{if(k!==nk)return;c=cl;
      const h=cl.frames[cl.contactFrame-1][I.hips]; cam.tgt=[h[0],h[1]+.4,1.0]; buildBasis();   /* frame each stroke on the player */
      f=still?cl.contactFrame:range(cl)[0];hold=0;stage.classList.add("ready");if(still)draw(svg,k,c,f);})
      .catch(()=>{});}
  function tick(ts){
    if(!alive)return; if(!stage.isConnected){alive=false;return;}
    const dt=last==null?16:Math.min(50,ts-last); last=ts;
    if(c&&!still&&!document.hidden){const [,b]=range(c);
      if(f<b){f=Math.min(b,f+dt*.1*(Math.abs(f-c.contactFrame)<12?.45:1)); draw(svg,k,c,f);}
      else if((hold+=dt)>650){ if(loop){f=range(c)[0];hold=0;} else show(next(k)); }}
    requestAnimationFrame(tick);
  }
  show(k); requestAnimationFrame(tick);
  return {play(nk){loop=true;show(nk);}};
}};
