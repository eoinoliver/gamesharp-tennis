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
/* the ball: in from the far side (a toss on the serve), met at the clip's own contact point, then away toward the net */
function ballAt(k,c,f){
  const C=c.contactBall, cf=c.contactFrame, serve=k==="serve";
  if(f<cf){const n=serve?55:26,u=(f-(cf-n))/n; if(u<0)return null;
    if(serve){const e=1-(1-u)*(1-u);return [C[0],C[1],lerp(1.25,C[2]+.22,e)-(u>.8?(u-.8)/.2*.22:0)];}
    return [lerp(C[0]-.6,C[0],u),lerp(C[1]+8,C[1],u),C[2]+.35*Math.sin(Math.PI*u)*(1-u)];}
  const u=(f-cf)/24; if(u>1)return null;
  const up=k==="drop"?.5:k==="slice"?.1:serve?-.6:.3;
  return [C[0]+(serve?.4:-.4)*u,C[1]+(k==="drop"?4:8)*u,Math.max(.05,C[2]+up*Math.sin(Math.PI*u*.8)+(serve?up*u:0))];
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
  const parts=[]; drawFigure(parts,s.pose,s.rq,{fwd:[0,1,0],band:"#e2bd4f",bandDk:"#8f7632"});
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
