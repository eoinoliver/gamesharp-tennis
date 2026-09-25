/* Short Ball review: original scene data/figure renderer, new lesson sequencing. */
const SVGNS="http://www.w3.org/2000/svg", svg=document.getElementById("svg");
let VW=820, VH=470; const ZNEAR=0.18;
const focalFor=f=>(520/2)/Math.tan(f*Math.PI/360);
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]], add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s], dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const len=a=>Math.hypot(a[0],a[1],a[2]), norm=a=>{const l=len(a)||1;return [a[0]/l,a[1]/l,a[2]/l];};
const lerp=(a,b,t)=>a+(b-a)*t, lerp3=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const smooth=(e0,e1,x)=>{const t=Math.max(0,Math.min(1,(x-e0)/(e1-e0)));return t*t*(3-2*t);};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));

let cam={az:-95,el:21,d:16,fov:30,tgt:[0,0,1.02]}, FOCAL=focalFor(30), basis=null;
function buildBasis(){
  const a=cam.az*Math.PI/180, e=cam.el*Math.PI/180, T=cam.tgt;
  const C=[T[0]+Math.cos(e)*Math.cos(a)*cam.d, T[1]+Math.cos(e)*Math.sin(a)*cam.d, T[2]+Math.sin(e)*cam.d];
  const f=norm(sub(T,C)); let r=norm(cross(f,[0,0,1])); if(!isFinite(r[0])) r=[1,0,0];
  basis={C,f,r,u:cross(r,f)}; FOCAL=focalFor(cam.fov); fitProjection();
}
function toCam(p){const d=sub(p,basis.C);return {x:dot(d,basis.r),y:dot(d,basis.u),z:dot(d,basis.f)};}
function proj(c){ if(c.z<ZNEAR) window.__nearViolations=(window.__nearViolations||0)+1;
  return [viewX+FOCAL*c.x/c.z, viewY-FOCAL*c.y/c.z];}
function P(p){const c=toCam(p);return c.z>ZNEAR?{s:proj(c),z:c.z}:null;}
function el_(t,a){const e=document.createElementNS(SVGNS,t);for(const k in a)e.setAttribute(k,a[k]);return e;}
function clipPoly(c){const out=[];for(let i=0;i<c.length;i++){const a=c[i],b=c[(i+1)%c.length];
  const ai=a.z>=ZNEAR,bi=b.z>=ZNEAR;if(ai)out.push(a);
  if(ai!==bi){const t=(ZNEAR-a.z)/(b.z-a.z);out.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:ZNEAR});}}return out;}
const pts=c=>c.map(p=>proj(p).map(v=>v.toFixed(1)).join(",")).join(" ");
function quad(frag,c3,fill,op){const c=clipPoly(c3.map(toCam));if(c.length<3)return;
  frag.appendChild(el_("polygon",{points:pts(c),fill,opacity:op==null?1:op}));}
function seg(frag,a,b,stroke,w,op){let ca=toCam(a),cb=toCam(b);if(ca.z<=ZNEAR&&cb.z<=ZNEAR)return;
  if(ca.z<ZNEAR||cb.z<ZNEAR){const t=(ZNEAR-ca.z)/(cb.z-ca.z);
    const m={x:ca.x+(cb.x-ca.x)*t,y:ca.y+(cb.y-ca.y)*t,z:ZNEAR};if(ca.z<ZNEAR)ca=m;else cb=m;}
  const A=proj(ca),B=proj(cb);
  frag.appendChild(el_("line",{x1:A[0].toFixed(1),y1:A[1].toFixed(1),x2:B[0].toFixed(1),y2:B[1].toFixed(1),
    stroke,"stroke-width":w,"stroke-linecap":"round",opacity:op==null?1:op}));}
// Text painted on a plane in 3D. Each letter gets its own affine map from three projected
// corners: an affine is exact only for a small patch, so one per letter keeps the
// perspective honest even when the word runs away from the camera.
// GAME in white, SHARP in gold, as the brand is set
const BRAND=[...'GAME'].map(()=>'#f0ece3').concat([...'SHARP'].map(()=>'#c8a84b'));
function planeText(frag,txt,origin,uDir,vDir,widthM,heightM,fill,op){
  const n=txt.length, lw=widthM/n, F=100, CAP=70;
  for(let i=0;i<n;i++){
    const o=add(origin,mul(uDir,lw*i)), a=P(o), b=P(add(o,mul(uDir,lw))), c=P(add(o,mul(vDir,heightM)));
    if(!a||!b||!c) continue;
    const ax=(b.s[0]-a.s[0])/F, ay=(b.s[1]-a.s[1])/F, cx=-(c.s[0]-a.s[0])/CAP, cy=-(c.s[1]-a.s[1])/CAP;
    if(ax*cy-ay*cx<=0) continue;              // looking at the back of it: skip
    const e=el_("text",{x:(F/2).toFixed(1),y:"0","text-anchor":"middle",fill:Array.isArray(fill)?fill[i]:fill,opacity:op,
      "font-family":"Bebas Neue, Impact, sans-serif","font-size":F,
      transform:`matrix(${ax.toFixed(4)},${ay.toFixed(4)},${cx.toFixed(4)},${cy.toFixed(4)},${a.s[0].toFixed(1)},${a.s[1].toFixed(1)})`});
    e.textContent=txt[i]; frag.appendChild(e);
  }
}
function ring(frag,c,rx,ry,stroke,w,op,fill){const q=[];for(let i=0;i<=28;i++){const a=i/28*Math.PI*2;
  q.push(toCam([c[0]+rx*Math.cos(a),c[1]+ry*Math.sin(a),c[2]]));}
  const k=clipPoly(q);if(k.length<3)return;
  frag.appendChild(el_("polygon",{points:pts(k),fill:fill||"none",stroke,"stroke-width":w,opacity:op}));}


/* ---------- the figure ---------- */
const KIT={skin:"#e9e3d7", skinDk:"#b9b1a2", shirt:"#c8a84b", shirtDk:"#8f7632", shorts:"#1e1e1e",
  shortsDk:"#000", shoe:"#f4f1ea", frame:"#1b1b1b", frameHi:"#c8a84b", strings:"rgba(240,236,227,.38)"};
const RSCALE=1.28;
function drawFigure(parts,pose,rq,opts){
  const o=opts||{}, op=o.op==null?1:o.op, ghost=!!o.ghost;
  const push=(n,z)=>parts.push({n,z});
  function limb(a,b,r0,r1,col,dk){
    // one tapered capsule per limb: a single outlined shape, not stacked discs
    const pa=P(a),pb=P(b); if(!pa||!pb) return;
    const ra=Math.max(0.9,FOCAL*r0*RSCALE/pa.z), rb=Math.max(0.9,FOCAL*r1*RSCALE/pb.z);
    const dx=pb.s[0]-pa.s[0], dy=pb.s[1]-pa.s[1], L=Math.hypot(dx,dy)||1e-6, ux=dx/L, uy=dy/L, nx=-uy, ny=ux;
    const q=[], N=7;
    for(let k=0;k<=N;k++){const th=Math.PI*k/N;            // from +n round the back to -n
      q.push([pa.s[0]+ra*(nx*Math.cos(th)-ux*Math.sin(th)), pa.s[1]+ra*(ny*Math.cos(th)-uy*Math.sin(th))]);}
    for(let k=0;k<=N;k++){const th=Math.PI*k/N;            // from -n round the front to +n
      q.push([pb.s[0]+rb*(-nx*Math.cos(th)+ux*Math.sin(th)), pb.s[1]+rb*(-ny*Math.cos(th)+uy*Math.sin(th))]);}
    push(el_("polygon",{points:q.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join(" "),fill:col,
      stroke:ghost?"none":dk,"stroke-width":1.3,"stroke-linejoin":"round",opacity:op}),(pa.z+pb.z)/2);
  }
  const J=k=>pose[I[k]];
  const S=ghost?{skin:o.col,skinDk:o.col,shirt:o.col,shirtDk:o.col,shorts:o.col,shortsDk:o.col,shoe:o.col}:(o.kit||KIT);
  // torso as a filled shape
  const sL=J("shoulderL"),sR=J("shoulderR"),hL=J("hipL"),hR=J("hipR");
  const tq=[sL,sR,hR,hL].map(p=>P(p));
  if(tq.every(Boolean)){
    const z=tq.reduce((a,q)=>a+q.z,0)/4;
    push(el_("polygon",{points:tq.map(q=>q.s.map(v=>v.toFixed(1)).join(",")).join(" "),fill:S.shirt,
      stroke:ghost?"none":S.shirtDk,"stroke-width":2,"stroke-linejoin":"round",opacity:op}),z);
  }
  limb(J("hips"),J("chest"),.10,.11,S.shirt,S.shirtDk);
  limb(sL,sR,.07,.07,S.shirt,S.shirtDk);
  limb(hL,hR,.075,.075,S.shorts,S.shortsDk);
  limb(J("chest"),J("neck"),.05,.045,S.skin,S.skinDk);
  // arms: short sleeve on the upper third
  for(const s of ["L","R"]){
    const sh=J("shoulder"+s),e=J("elbow"+s),w=J("wrist"+s),m=lerp3(sh,e,.38);
    limb(sh,m,.058,.052,S.shirt,S.shirtDk); limb(m,e,.047,.042,S.skin,S.skinDk); limb(e,w,.041,.032,S.skin,S.skinDk);
    const h=J("hip"+s),k=J("knee"+s),a=J("ankle"+s),mt=lerp3(h,k,.45);
    limb(h,mt,.075,.068,S.shorts,S.shortsDk); limb(mt,k,.064,.052,S.skin,S.skinDk); limb(k,a,.05,.036,S.skin,S.skinDk);
  }
  // head
  const hq=P(J("head")); if(hq){const r=Math.max(3,FOCAL*.115/hq.z);
    push(el_("circle",{cx:hq.s[0].toFixed(1),cy:hq.s[1].toFixed(1),r:(r+(ghost?0:1.1)).toFixed(1),fill:ghost?S.skin:S.skinDk,opacity:op}),hq.z+0.001);
    push(el_("circle",{cx:hq.s[0].toFixed(1),cy:hq.s[1].toFixed(1),r:r.toFixed(1),fill:S.skin,opacity:op}),hq.z);}
  // shoes
  for(const s of ["L","R"]){const a=J("ankle"+s),k=J("knee"+s);
    const fw=o.fwd||[0,1,0]; const toe=add(a,[fw[0]*0.14,fw[1]*0.14,-0.05]);
    limb(add(a,[0,0,-0.03]),toe,.04,.035,S.shoe,ghost?S.shoe:"#9c978c");}
  // racquet
  if(rq){
    const neck=add(rq.w,mul(rq.axis,.20)), fr=ghost?o.col:(o.kit||KIT).frame, hi=ghost?o.col:(o.kit||KIT).frameHi;
    limb(rq.grip||rq.w,neck,.016,.014,fr,fr);
    for(const s of [-1,1]) limb(neck,add(add(rq.w,mul(rq.axis,.29)),mul(rq.lateral,s*.10)),.008,.008,fr,fr);
    const rim=[];for(let i=0;i<=32;i++){const a=i/32*Math.PI*2;
      rim.push(add(rq.centre,add(mul(rq.axis,.175*Math.cos(a)),mul(rq.lateral,.13*Math.sin(a)))));}
    const rp=rim.map(p=>P(p));
    if(rp.every(Boolean)){const z=P(rq.centre).z;
      push(el_("polygon",{points:rp.map(q=>q.s.map(v=>v.toFixed(1)).join(",")).join(" "),
        fill:ghost?"none":"rgba(240,236,227,.16)",stroke:hi,"stroke-width":Math.max(1.3,FOCAL*.018/z).toFixed(1),opacity:op}),z);
      if(!ghost) for(let k=-3;k<=3;k++){
        const u=k/3.6, a=add(rq.centre,add(mul(rq.axis,.175*Math.sqrt(1-u*u)),mul(rq.lateral,.13*u))),
              b=add(rq.centre,add(mul(rq.axis,-.175*Math.sqrt(1-u*u)),mul(rq.lateral,.13*u)));
        const pa=P(a),pb=P(b); if(pa&&pb) push(el_("line",{x1:pa.s[0].toFixed(1),y1:pa.s[1].toFixed(1),x2:pb.s[0].toFixed(1),y2:pb.s[1].toFixed(1),stroke:KIT.strings,"stroke-width":.8}),z-0.001);
        const c=add(rq.centre,add(mul(rq.lateral,.13*Math.sqrt(1-u*u)),mul(rq.axis,.175*u))),
              d=add(rq.centre,add(mul(rq.lateral,-.13*Math.sqrt(1-u*u)),mul(rq.axis,.175*u)));
        const pc=P(c),pd=P(d); if(pc&&pd) push(el_("line",{x1:pc.s[0].toFixed(1),y1:pc.s[1].toFixed(1),x2:pd.s[0].toFixed(1),y2:pd.s[1].toFixed(1),stroke:KIT.strings,"stroke-width":.8}),z-0.001);
      }}
  }
}




const CL=DATA.clips, SC=DATA.scenes;
let I={}; CL.fh.joints.forEach((n,i)=>I[n]=i);
const OPPKIT={skin:"#e3d9c8",skinDk:"#b0a58f",shirt:"#6c8db3",shirtDk:"#3e5878",shorts:"#e6e1d6",shortsDk:"#9f9b90",
  shoe:"#f4f1ea",frame:"#1b1b1b",frameHi:"#6c8db3",strings:"rgba(240,236,227,.38)"};
const $=id=>document.getElementById(id);
const angMix=(a,b,w)=>{let d=((b-a+Math.PI*3)%(Math.PI*2))-Math.PI;return a+d*w;};

/* ---------- court ---------- */
const CRT={L:23.77,dw:10.97,sw:8.23,sv:6.40};
function drawCourt(frag){
  const l2=CRT.L/2,d2=CRT.dw/2,S=CRT.sw/2,V=CRT.sv,L=l2+6.4,Dw=d2+3.66;
  quad(frag,[[-Dw,-L,0],[Dw,-L,0],[Dw,L,0],[-Dw,L,0]],"var(--court)");
  quad(frag,[[-d2,-l2,0],[d2,-l2,0],[d2,l2,0],[-d2,l2,0]],"var(--court-in)");
  const BW=4.4,BH=0.72;
  planeText(frag,"GAMESHARP",[-BW/2,-l2-2.7,0.005],[1,0,0],[0,1,0],BW,BH,BRAND,.34);
  planeText(frag,"GAMESHARP",[-BW/2,l2+1.6,0.005],[1,0,0],[0,1,0],BW,BH,BRAND,.42);
  const ln=(a,b)=>seg(frag,[a[0],a[1],0],[b[0],b[1],0],"var(--court-line)",1.5);
  ln([-d2,-l2],[d2,-l2]);ln([-d2,l2],[d2,l2]);ln([-d2,-l2],[-d2,l2]);ln([d2,-l2],[d2,l2]);
  ln([-S,-l2],[-S,l2]);ln([S,-l2],[S,l2]);ln([-S,-V],[S,-V]);ln([-S,V],[S,V]);ln([0,-V],[0,V]);
  ln([0,-l2],[0,-l2+0.15]);ln([0,l2],[0,l2-0.15]);
}
function netGroup(){
  const g=el_("g",{}), W=CRT.dw/2+0.914, hC=0.914, hP=1.07, N=24;
  const h=x=>hC+(hP-hC)*Math.min(1,Math.abs(x)/6.40)**2;
  const top=[];for(let i=0;i<=N;i++){const x=-W+2*W*i/N;top.push([x,0,h(x)]);}
  const poly=[[W,0,0],[-W,0,0]].concat(top);
  const c=clipPoly(poly.map(toCam)); if(c.length>=3) g.appendChild(el_("polygon",{points:pts(c),fill:"rgba(10,16,10,.38)"}));
  for(let i=0;i<=20;i++){const x=-W+2*W*i/20;seg(g,[x,0,0],[x,0,h(x)],"rgba(233,240,225,.07)",0.8);}
  seg(g,[-W,0,0],[-W,0,hP+0.02],"rgba(240,236,227,.55)",2.4); seg(g,[W,0,0],[W,0,hP+0.02],"rgba(240,236,227,.55)",2.4);
  planeText(g,"GAMESHARP",[-1.0,-0.01,0.70],[1,0,0],[0,0,1],2.0,0.17,BRAND,.5);
  planeText(g,"GAMESHARP",[1.0,0.01,0.70],[-1,0,0],[0,0,1],2.0,0.17,BRAND,.5);
  for(let i=0;i<N;i++) seg(g,top[i],top[i+1],"rgba(240,236,227,.85)",2.4);
  return g;
}
function label(frag,p,txt,col,size,op,dy){const q=P(p);if(!q)return; size=Math.max(size,11*VW/Math.max(1,stageWidth));
  const pad=5*VW/Math.max(1,stageWidth),half=labelWidth(txt,size)/2+2; const x=clamp(q.s[0],half+pad,VW-half-pad),y=clamp(q.s[1]-(dy||10),size+pad,VH-pad);
  const e=el_("text",{x:x.toFixed(1),y:y.toFixed(1),"text-anchor":"middle",fill:col,
    "font-family":"Bebas Neue, Impact, sans-serif","font-size":size||16,"letter-spacing":".05em",opacity:op==null?1:op,
    stroke:"#07130a","stroke-width":3.2,"paint-order":"stroke"});e.textContent=txt;frag.appendChild(e);}

/* ---------- actors: captured clips placed on court ---------- */
const PRE={fh:70,fhhi:70,fhret:70,lowfv:55,bh:34,serveW:0};
function prep(sc){
  if(sc._p) return sc._p; const out={};
  for(const [name,segs] of Object.entries(sc.actors)){
    const W=segs.map(s=>{const c=CL[s.clip];
      if(s.hold) return {s,c,a:s.start,b:s.start,fixed:s.hold};
      const cG=s.start+c.contactFrame-1;
      return {s,c,cG,a:Math.max(s.start,cG-(PRE[s.clip]??70)),b:Math.min(s.start+c.frameCount-1,cG+50)};});
    W.sort((x,y)=>x.a-y.a);
    if(!W[0].fixed) W[0].a=W[0].s.start;
    for(let i=0;i+1<W.length;i++) if(W[i+1].a<W[i].b) W[i].b=Math.max(W[i].a,W[i+1].a);
    // No teleporting: give every glide enough time to be covered at a sprint (about 5.5 m/s),
    // first by starting the next swing's preparation later, then by trimming the previous follow-through.
    for(let i=0;i+1<W.length;i++){const A=W[i],B=W[i+1];
      const ha=worldOf(localAt(A,A.b)).pose[I.hips], hb=worldOf(localAt(B,B.a)).pose[I.hips];
      const need=Math.ceil(Math.hypot(hb[0]-ha[0],hb[1]-ha[1])/5.5*100*1.3);
      if(B.a-A.b<need&&!B.fixed) B.a=Math.max(B.a,Math.min(B.cG-18,A.b+need));
      if(B.a-A.b<need&&!A.fixed) A.b=Math.max(A.a,A.cG!=null?Math.max(A.cG+12,B.a-need):B.a-need);}
    out[name]=W;
  }
  sc._p=out; return out;
}
function clipAt(c,f){f=clamp(f,1,c.frameCount);const i=Math.floor(f),u=f-i,j=Math.min(c.frameCount,i+1);
  const A=c.frames[i-1],B=c.frames[j-1],RA=c.racquetFrames[i-1],RB=c.racquetFrames[j-1];
  return {pose:A.map((p,k)=>lerp3(p,B[k],u)),
    rq:{axis:lerp3(RA.axis,RB.axis,u),lateral:lerp3(RA.lateral,RB.lateral,u),centre:lerp3(RA.centre,RB.centre,u)}};}
// Holds are a neutral ready stance (the forehand's first frame), whatever clip the hold names.
function localAt(w,g){const r=w.fixed?clipAt(CL.fh,1):clipAt(w.c,g-w.s.start+1);r.T=w.s.T;r.yaw=w.s.yaw;return r;}
function worldOf(L){
  const c=Math.cos(L.yaw),s=Math.sin(L.yaw),R=p=>[c*p[0]-s*p[1],s*p[0]+c*p[1],p[2]],X=p=>{const r=R(p);return [r[0]+L.T[0],r[1]+L.T[1],r[2]];};
  return {pose:L.pose.map(X),axis:R(L.rq.axis),lateral:R(L.rq.lateral),centre:X(L.rq.centre),fwd:R([0,1,0])};
}
const facingOf=P=>{const l=P[I.shoulderL],r=P[I.shoulderR];return Math.atan2(r[0]-l[0],-(r[1]-l[1]));}
const wrapA=a=>{a=(a+Math.PI)%(2*Math.PI);if(a<0)a+=2*Math.PI;return a-Math.PI;};
function rotAbout(p,c,a){const co=Math.cos(a),si=Math.sin(a),x=p[0]-c[0],y=p[1]-c[1];return [c[0]+co*x-si*y,c[1]+si*x+co*y,p[2]];}
function rotV(v,a){const co=Math.cos(a),si=Math.sin(a);return [co*v[0]-si*v[1],si*v[0]+co*v[1],v[2]];}
// Between shots the body turns toward its next stance, always the way that keeps the chest toward
// the net: a player recovering from a serve turns through facing the court, never through facing the fence.
function blendWorld(A,B,u,away){
  const fa=facingOf(A.pose),fb=facingOf(B.pose);let d=wrapA(fb-fa);const t=wrapA(away-fa);
  if((d>0&&t>0&&t<d)||(d<0&&t<0&&t>d)) d=d>0?d-2*Math.PI:d+2*Math.PI;
  const ca=A.pose[I.hips],cb=B.pose[I.hips],ra=d*u,rb=-d*(1-u);
  const pose=A.pose.map((p,k)=>lerp3(rotAbout(p,ca,ra),rotAbout(B.pose[k],cb,rb),u));
  return {pose,axis:lerp3(rotV(A.axis,ra),rotV(B.axis,rb),u),lateral:lerp3(rotV(A.lateral,ra),rotV(B.lateral,rb),u),
    centre:lerp3(rotAbout(A.centre,ca,ra),rotAbout(B.centre,cb,rb),u),fwd:lerp3(rotV(A.fwd,ra),rotV(B.fwd,rb),u)};
}
function actorAt(sc,name,g){
  const W=prep(sc)[name]; if(!W) return null;
  const away=name==="you"?-Math.PI/2:Math.PI/2;
  let Wd=null;
  if(g<=W[0].a) Wd=worldOf(localAt(W[0],W[0].a));
  else if(g>=W[W.length-1].b) Wd=worldOf(localAt(W[W.length-1],W[W.length-1].b));
  else for(let i=0;i<W.length;i++){const w=W[i];
    if(g>=w.a&&g<=w.b){Wd=worldOf(localAt(w,g));break;}
    const n=W[i+1]; if(n&&g>w.b&&g<n.a){Wd=blendWorld(worldOf(localAt(w,w.b)),worldOf(localAt(n,n.a)),smooth(w.b,n.a,g),away);break;}}
  if(!Wd) Wd=worldOf(localAt(W[W.length-1],W[W.length-1].b));
  const axis=norm(Wd.axis), lateral=norm(sub(Wd.lateral,mul(axis,dot(Wd.lateral,axis))));
  return {pose:Wd.pose,rq:{w:Wd.pose[I.wristR],axis,lateral,centre:Wd.centre},fwd:norm(Wd.fwd)};
}
function contactsOf(sc,name){return (prep(sc)[name]||[]).filter(w=>!w.fixed).map(w=>w.cG);}

/* ---------- ball, including the serve toss the flight data starts after ---------- */
function firstBall(sc){if(sc._fb!=null)return sc._fb;let i=0;while(i<sc.ball.length&&!sc.ball[i])i++;return sc._fb=i;}
let TOSS=null;
function tossInfo(sc){
  if(TOSS) return TOSS; const c=CL.serveW; let best=1,bz=-1;
  for(let f=1;f<c.contactFrame-25;f++){const z=c.frames[f-1][I.wristL][2];if(z>bz){bz=z;best=f;}}
  return TOSS={releaseLocal:best};
}
function ballAt(sc,g){
  const n=sc.ball.length, f0=firstBall(sc);
  if(g>=f0){const i=Math.floor(g),u=g-i,a=sc.ball[Math.min(n-1,i)],b=sc.ball[Math.min(n-1,i+1)];
    if(!a) return null; return b?lerp3(a,b,u):a;}
  const serve=sc.actors.you&&sc.actors.you[0]; if(!serve||serve.clip!=="serveW") return null;
  const rel=serve.start+tossInfo(sc).releaseLocal-1, pc=sc.ball[f0];
  const hand=g2=>{const a=actorAt(sc,"you",g2);return add(a.pose[I.wristL],[0,0,0.07]);};
  if(g<=rel) return hand(g);
  const p0=hand(rel), T=(f0-rel)/100, tt=(g-rel)/100, vz=(pc[2]-p0[2]+4.905*T*T)/T;
  return [lerp(p0[0],pc[0],tt/T),lerp(p0[1],pc[1],tt/T),p0[2]+vz*tt-4.905*tt*tt];
}


const LESSON={
  memHTML:"The attack begins <span>one ball earlier.</span>",
  tomorrow:"Next time a ball lands short, check your balance and the opponent’s position before deciding to attack.",
  pro:{player:"Rafael Nadal",moment:"Nadal’s short-ball attack starts before he moves forward: the heavy forehand creates space, so the short reply arrives into a court already under pressure.",
    read:"The attack begins before the short ball.",
    src:"ATP Tour \u00b7 \u201cNadal Wins Historic 10th Monte-Carlo Title\u201d, 23 April 2017",
    url:"https://www.atptour.com/en/news/nadal-ramos-vinolas-monte-carlo-2017-final"},
  steps:[
   {ph:"See \u00b7 Decide",short:"Decide",name:"The waist-high ball",scene:"sb1",
    sit:"The ball sits waist-high; you are set and your opponent is stranded.",
    q:"What has this ball earned?",
    opts:["Drive firmly at them and close","Drive with margin into open court, then close","Flatten hard toward the nearest sideline","Loop deep through the middle and reset"],
    correct:1,payoff:"Attack: your height and balance let you control the open court.",
    principle:"The short bounce invited you forward; the full cue set earned aggression.",
    why:"Use a generous target and close behind the shot rather than demanding a winner. Short alone never made the decision.",
    cues:{ball:"WAIST-HIGH",you:"SET",opp:"STRANDED"},
    lines:{A:"Straight to them — they pass you as you come in.",B:"They scramble; you close in and put it away.",C:"Too much risk — a fraction off and it’s wide.",D:"Too safe — they recover and the point restarts."},unlock:"Attack earned",take:"High, balanced, opponent stranded: attack — with margin."},
   {ph:"Contrast",short:"Contrast",name:"The low, stretched ball",scene:"sb2",
    sit:"This one stays below your knee; you reach it stretched and late.",
    q:"What is the percentage response?",
    opts:["Flatten it hard down the line","Roll a short angle crosscourt","Lift softly through the middle and recover","Lift deep crosscourt and recover your base"],
    correct:3,payoff:"Rebuild: low contact and poor balance make acceleration unreliable.",
    principle:"Height and depth buy back the time your stretched position has taken away.",
    why:"A balanced opponent already covers both sides. Forcing a winner compounds your defensive position instead of solving it.",
    cues:{ball:"BELOW THE KNEE",you:"STRETCHED",opp:"SET"},
    lines:{A:"Flat from below the knee — into the net.",B:"It lands short — they step in and punish it.",C:"Soft and short — they attack the open court.",D:"High and deep buys time — you’re back in the rally."},unlock:"Rebuild first",take:"Low and stretched? Go high and deep, then recover."},
   {ph:"Transfer",short:"Transfer",name:"The short slice",scene:"sb3",
    sit:"Your heavy ball earns a short slice; you arrive balanced while they remain deep.",
    q:"What level of attack is earned?",
    opts:["Flatten hard into the open corner","Lift a controlled approach and close behind it","Reset high through the middle and retreat","Carve low crosscourt but remain behind"],
    correct:1,payoff:"Controlled attack: balance earns the approach, but low contact limits the finish.",
    principle:"You combined mixed cues instead of treating short as a binary command.",
    why:"The earlier heavy ball created territory. Low contact asks for lift and margin; their deep position still supports moving forward.",
    cues:{ball:"LOW",you:"BALANCED",opp:"DEEP"},
    lines:{A:"Flat from low contact — a fraction off and it’s long.",B:"Lift for margin, close in — their floater is yours.",C:"Too safe — they recover and your chance is gone.",D:"Skims the net, lands short — they push you back."},unlock:"Attack, not finish",take:"Balanced but low: approach with lift — don’t go for the winner."}
  ]
};
const cm=v=>Math.round(v)+" cm", m1=v=>v.toFixed(1)+" m", m2=v=>v.toFixed(2)+" m";
function reachVerdict(r){if(!r)return["—",""];if(r.speed<=3)return["Gets there","good-for-them"];if(r.speed<=5.2)return["Scramble","mid"];return["Out of reach","you"];}
function chip(txt,cls){return `<span class="oc ${cls||""}">${txt}</span>`;}
function reachChip(r){if(!r)return "";if(r.speed>5.2)return chip("They can’t reach it","good");if(r.speed>3)return chip("They scramble to it","mid");return chip("They get there easily","bad");}
function netChip(c){return c<20?chip("Barely clears the net","bad"):chip("Clears the net safely","good");}
function lineChip(m){return m<0.4?chip("Only just inside the line","bad"):chip("Lands safely inside","good");}
function roomChip(w){return w<3?chip("Almost no room for error","bad"):w<8?chip("Little room for error","mid"):chip("Lots of room for error","good");}
function reachChip2(r){if(!r)return "";if(r.metres<=2||r.speed<=3)return chip("They get there easily","bad");if(r.speed>5.2)return chip("They can’t reach it","good");return chip("They scramble to it","mid");}
function consequence(step,X){
  const S=LESSON.steps[step], inf=SC[S.scene+X].info, sh=inf.shot, c=[];
  if(step===0) c.push(reachChip2(sh.reach));
  if(sh.window) c.push(roomChip(sh.window[1]-sh.window[0]));
  if(sh.netMarginCm!=null&&inf.shown==null) c.push(netChip(sh.netMarginCm));
  if(inf.shown!=null) c.push(chip(step===1?"A fraction low and it’s in the net":"A fraction off and it’s out","bad"));
  else c.push(lineChip(sh.courtMargin));
  return {line:S.lines[X],chips:c.join("")};
}
function pick2(html,ok){const a=html.match(/<span class="oc[^"]*">.*?<\/span>/g)||[];
  const rank=s=>ok?(s.includes('oc good')?0:s.includes('oc mid')?1:2):(s.includes('oc bad')?0:s.includes('oc mid')?1:2);
  return a.sort((x,y)=>rank(x)-rank(y)).slice(0,2).join("");}

const CAMS=[
 {n:"Broadcast",c:{az:-90,el:24,d:31,fov:31,tgt:[0,-1.7,0]}},
 {n:"Behind you",follow:true},
 {n:"Side",c:{az:0,el:17,d:31,fov:44,tgt:[0,0,.4]}},
 {n:"Overhead",c:{az:-90,el:79,d:38,fov:40,tgt:[0,0,0]}},
 {n:"Their view",c:{az:90,el:15,d:23,fov:44,tgt:[0,-3,.4]}}
];
let camI=0, stageWidth=390, viewX=410,viewY=235;
const labelMeasure=document.createElement("canvas").getContext("2d"), labelSizes=new Map();
function labelWidth(text,size){
 const key=text+":"+size;if(labelSizes.has(key))return labelSizes.get(key);
 labelMeasure.font=size+"px Bebas Neue, Impact, sans-serif";
 const width=labelMeasure.measureText(text).width+text.length*size*.05;labelSizes.set(key,width);return width;
}
document.fonts.ready.then(()=>{labelSizes.clear();dirty=true;});
const svg2=$("svg"), experience=$("experience");
function fitView(){
 const r=$("stage").getBoundingClientRect();stageWidth=r.width;
 VH=VW*r.height/Math.max(1,r.width);svg2.setAttribute("viewBox",`0 0 ${VW} ${VH}`);dirty=true;
}
function fitProjection(){
 viewX=VW/2;viewY=VH*.55;
 // Frame the whole decision court at every aspect ratio, with space for players.
 // The close follow camera retains its original perspective.
 if(camI===1){FOCAL*=Math.min(VW/820,VH/470);return;}
 const corners=[];
 for(const x of [-5.1,5.1]) for(const y of [-12.7,12.7]) for(const z of [0,2.15]){
  const p=toCam([x,y,z]); if(p.z>ZNEAR)corners.push([p.x/p.z,-p.y/p.z]);
 }
 const xs=corners.map(p=>p[0]),ys=corners.map(p=>p[1]);
 const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
 const padX=VW*.07,padY=VH*.07;
 FOCAL=Math.min((VW-padX*2)/(x1-x0),(VH-padY*2)/(y1-y0));
 viewX=VW/2-FOCAL*(x0+x1)/2;viewY=VH/2-FOCAL*(y0+y1)/2;
}
function setCamera(you){
 const c=CAMS[camI];
 if(c.follow&&you){const h=you.pose[I.hips];cam={az:-90,el:11,d:12,fov:50,tgt:[h[0]*.7,h[1]+4.5,.9]};}
 else cam={...c.c,tgt:[...c.c.tgt]};
}
let mode="daily",step=0,scene="sb1A",t=0,stopAt=0,playing=false,slow=false,lastTs=null;
let chosen=null,showTargets=null,revealPattern=false,phase="intro",detail=null;
let firstAnswers=[null,null,null],attempts=[[],[],[]],generation=0,pending=null,onStop=null,dirty=true;
let detailWasPlaying=false;
const letters=["A","B","C","D"],LETTERS=letters;
function cancelRun(){generation++;clearTimeout(pending);pending=null;onStop=null;setPlaying(false);}
function setPlaying(value){playing=value;lastTs=null;dirty=true;paintControls();}
function run(key,from,stop,callback){
 cancelRun();scene=key;t=from;stopAt=Math.min(stop,SC[key].frames-1);onStop=callback;setPlaying(true);
}
function rate(){let r=1;for(const c of contactsOf(SC[scene],"you"))r=Math.min(r,.3+.7*smooth(6,28,Math.abs(t-c)));
 if(onStop)r*=.45+.55*smooth(0,45,stopAt-t);return r*(slow?.45:1);}
function tick(ts){
 const wasPlaying=playing;
 if(playing){
  if(lastTs!==null){t+=Math.min(50,ts-lastTs)*.1*rate();
   if(t>=stopAt){t=stopAt;setPlaying(false);const callback=onStop,token=generation;onStop=null;
    if(callback)pending=setTimeout(()=>{pending=null;if(token===generation)callback();},160);
   }
  }
  if(playing)lastTs=ts;
 }
 if(wasPlaying||dirty){render();dirty=false;}requestAnimationFrame(tick);
}
function progress(){
 $("journey").innerHTML=`<span>${step<3?`${step+1} / 3`:"Complete"}</span><div>${[0,1,2].map(i=>`<i class="${i===step?'current':firstAnswers[i]!==null?'done':''}"></i>`).join("")}</div>`;
}
function paintControls(){
 $("pause").disabled=!(phase==="watch"||phase==="outcome")||!!detail;
 $("pause").innerHTML=playing?'Ⅱ <span>Pause</span>':'▷ <span>Play</span>';
 $("pause").setAttribute("aria-label",playing?"Pause animation":"Play animation");
 $("replay").disabled=phase==="intro"||step===3||!!detail;
 $("courtState").textContent=(phase==="watch"||phase==="outcome")&&!playing&&!detail?"PAUSED":"";
}
const action=(id,label,cls="primary")=>`<button id="${id}" class="${cls}">${label}</button>`;
function display(kicker,title,body,actions=""){
 $("panel").innerHTML=`<div class="story-copy"><div class="eyebrow">${kicker}</div><h1 id="storyTitle" tabindex="-1">${title}</h1>${body?`<div class="body-copy">${body}</div>`:""}</div>${actions?`<div class="actions">${actions}</div>`:""}`;
 $("panel").dataset.phase=detail||phase;progress();paintControls();dirty=true;
}
function on(id,fn){$(id)?.addEventListener("click",fn);}
function focusTitle(){$("storyTitle").focus({preventScroll:true});}
function startStep(i){
 cancelRun();detail=null;step=i;chosen=null;showTargets=null;phase=i===3?"finish":"intro";
 if(i===3){showFinish();return;}
 scene=LESSON.steps[i].scene+"A";t=0;stopAt=0;drawPanel();
}
function watch(retry=false){
 if(step===3)return;
 const s=LESSON.steps[step],key=s.scene+"A";chosen=null;showTargets=null;phase="watch";detail=null;drawPanel();
 run(key,retry?Math.max(0,SC[key].info.freeze-65):0,SC[key].info.freeze,()=>{phase="decide";showTargets=s.scene;drawPanel();focusTitle();});
}
function choose(index){
 if(phase!=="decide"||detail)return;
 const s=LESSON.steps[step];chosen=letters[index];
 if(firstAnswers[step]===null)firstAnswers[step]=chosen;attempts[step].push(chosen);
 phase="outcome";showTargets=s.scene;drawPanel();
 const key=s.scene+chosen;run(key,SC[key].info.freeze,SC[key].frames-1,()=>{phase="insight";drawPanel();focusTitle();});
}
function replay(){
 if(step===3||phase==="intro"||detail)return;
 if(chosen===null){watch();return;}
 const key=LESSON.steps[step].scene+chosen;phase="outcome";drawPanel();
 run(key,0,SC[key].frames-1,()=>{phase="insight";drawPanel();focusTitle();});
}
function drawPanel(){
 if(detail){drawDetail();return;}
 if(step===3){showFinish();return;}
 const s=LESSON.steps[step];
 if(phase==="intro"){
  display(`READ ${step+1} · ${["Find the opportunity","Change the read","Put it together"][step]}`,s.name,`<p>${s.sit}</p>`,action("watch","Watch the point <span>→</span>"));on("watch",()=>watch());
 }else if(phase==="watch"){
  display(`READ ${step+1} · Watch`,"Read the ball. Read the space.","<p>Watch your contact height, your balance and where they are. The point will pause for your call.</p>");
 }else if(phase==="decide"){
  display("YOUR CALL",s.q,"",`<div class="options">${s.opts.map((o,i)=>`<button class="option" id="choice${i}" aria-label="${letters[i]}. ${o}"><b>${letters[i]}</b><span>${o}</span></button>`).join("")}</div>`);
  s.opts.forEach((_,i)=>on("choice"+i,()=>choose(i)));
 }else if(phase==="outcome"){
  display("YOUR CHOICE · "+chosen,"Let it play out.",`<p>${s.opts[letters.indexOf(chosen)]}</p><p class="muted">Watch what this leaves you next.</p>`);
 }else if(phase==="insight"){
  const ok=letters.indexOf(chosen)===s.correct;
  display(ok?"GOOD READ":"LOOK AT THE CONSEQUENCE",ok?s.unlock:["They pass you","Height before pace","Approach before finish"][step],`<p>${s.lines[chosen]}</p><p class="take">${s.take}</p>`,action("next",step<2?"Next ball <span>→</span>":"Take it to court <span>→</span>")+`<div class="secondary-row">${action("why","See why","text-btn")}${action("retry","Try another","text-btn")}</div>`);
  // The miss headline describes the actual branch, not a generic failure.
  if(!ok)$("storyTitle").textContent=chosen==="A"&&step===0?"They were waiting.":s.lines[chosen].split(" — ")[0].replace(/\.$/,"");
  on("next",()=>{startStep(step+1);focusTitle();});on("retry",()=>watch(true));on("why",showEvidence);
 }else if(phase==="evidence"){
  display("THE READ",s.unlock,`<p>${s.payoff}</p><p>${s.why}</p>`,action("backInsight","Back to the point <span>→</span>")+action("moreRead","A closer look","text-btn"));
  on("backInsight",()=>{t=SC[scene].frames-1;phase="insight";drawPanel();focusTitle();});on("moreRead",()=>openDetail("closer"));
 }
}
function showEvidence(){
 cancelRun();phase="evidence";t=SC[scene].info.freeze;showTargets=null;drawPanel();focusTitle();
}
function showFinish(){
 if(phase==="pro"){
  const p=LESSON.pro;display("PRO LENS · "+p.player,"One ball earlier.",`<p>${p.moment}</p><a class="source" href="${p.url}" target="_blank" rel="noopener noreferrer">ATP Tour · Monte-Carlo 2017 ↗</a>`,action("finishBack","Back to your takeaway"));
  on("finishBack",()=>{phase="finish";showFinish();focusTitle();});return;
 }
 const count=firstAnswers.filter((x,i)=>x===letters[LESSON.steps[i].correct]).length;
 display("THREE READS · "+count+" / 3 FIRST TIME","Short is an invitation.",`<p class="take">Your height, balance and their position decide what you do with it.</p><p>${LESSON.tomorrow}</p>`,action("restart","Read the three balls again <span>↺</span>")+action("pro","See it in the pro game","text-btn"));
 on("restart",()=>{firstAnswers=[null,null,null];attempts=[[],[],[]];startStep(0);focusTitle();});
 on("pro",()=>{phase="pro";showFinish();focusTitle();});
}
function openDetail(kind){
 if(detail){detail=kind;drawDetail();return;}
 detailWasPlaying=playing;setPlaying(false);detail=kind;drawDetail();focusTitle();
}
function closeDetail(){
 detail=null;drawPanel();if(detailWasPlaying)setPlaying(true);detailWasPlaying=false;focusTitle();
}
function drawDetail(){
 if(detail==="view"){
  display("COURT VIEW","Find your angle.","",`<div class="camera-grid">${CAMS.map((c,i)=>`<button id="camera${i}" class="camera" aria-pressed="${i===camI}">${c.n}</button>`).join("")}<button id="slowToggle" class="camera" aria-pressed="${slow}">Slow motion</button></div>`+action("closeDetail","Back to the point","text-btn"));
  CAMS.forEach((_,i)=>on("camera"+i,()=>{camI=i;dirty=true;drawDetail();$("camera"+i).focus({preventScroll:true});}));
  on("slowToggle",()=>{slow=!slow;drawDetail();$("slowToggle").focus({preventScroll:true});});
 }else if(detail==="closer"){
  const s=LESSON.steps[step],c=consequence(step,chosen),ok=letters.indexOf(chosen)===s.correct;
  display("A CLOSER LOOK",s.unlock,`<p>${s.principle}</p><div class="shot-details">${pick2(c.chips,ok)}</div>`,action("closeDetail","Back to the read"));
 }else{
  display("SHORT BALL · REVIEW","Three balls. Three reads.","<p>Read the situation, watch the point, then make your call. Try another shot to see the difference.</p><p class=\"muted\">These authored 3D points illustrate each choice. They are not predictions of every rally.</p>",action("closeDetail","Back to the point"));
 }
 on("closeDetail",closeDetail);
}
$("replay").onclick=replay;
$("pause").onclick=()=>{if(!detail&&(phase==="watch"||phase==="outcome")&&t<stopAt)setPlaying(!playing);};
$("view").onclick=()=>openDetail("view");$("about").onclick=()=>openDetail("about");
function isFull(){return !!document.fullscreenElement||experience.classList.contains("full");}
function paintFull(){
 const full=isFull();$("fullscreen").innerHTML=full?'⛶ <span>Exit full</span>':'⛶ <span>Full screen</span>';
 $("fullscreen").setAttribute("aria-label",full?"Exit fullscreen":"Enter fullscreen");fitView();
}
$("fullscreen").onclick=async()=>{
 if(document.fullscreenElement){await document.exitFullscreen();}
 else if(experience.classList.contains("full")){experience.classList.remove("full");}
 else {try{if(!experience.requestFullscreen)throw Error("unsupported");await experience.requestFullscreen();}catch{experience.classList.add("full");}}
 paintFull();
};
document.addEventListener("fullscreenchange",paintFull);
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(detail)closeDetail();else if(experience.classList.contains("full")){experience.classList.remove("full");paintFull();}}});
// Resize the stage itself; browser chrome, rotation and fullscreen all use this path.
new ResizeObserver(fitView).observe($("stage"));
window.visualViewport?.addEventListener("resize",()=>{document.documentElement.style.setProperty("--viewport-height",window.visualViewport.height+"px");fitView();});
document.addEventListener("visibilitychange",()=>{if(document.hidden)setPlaying(false);});
// Read-only diagnostics support review without a way to skip decisions or alter scores.
window.__review=Object.freeze({state:()=>({step,phase,detail,scene,t,stopAt,playing,chosen,camI,slow,firstAnswers:[...firstAnswers],attempts:attempts.map(a=>[...a])})});

let lastCap="";
function render(){
  const sc=SC[scene], g=t, you=actorAt(sc,"you",g), opp=actorAt(sc,"opp",g);
  setCamera(you); buildBasis();
  const frag=document.createDocumentFragment(); drawCourt(frag);
  // last point's reply, as evidence
  if(scene==="daily1"){const E=sc.info.evidence;for(let i=1;i<E.length;i++){if(E[i][2]<0.02&&i<E.length-1)continue;
      seg(frag,E[i-1],E[i],"rgba(240,236,227,.5)",1.4,.55);}
    const e=E[E.length-1];ring(frag,[e[0],e[1],0.006],0.16,0.12,"rgba(240,236,227,.7)",1.4,.8);
    label(frag,[e[0],e[1],0],"LAST POINT","rgba(240,236,227,.8)",14,.9,-18);}
  const St0=mode==="daily"&&step<3?LESSON.steps[step]:null, fz0=St0&&scene.startsWith(St0.scene)?SC[scene].info.freeze:null;
  const cueOnEarly=fz0!=null&&g>=fz0-3&&g<=fz0+10;
  // bounces and landings
  for(const m of sc.marks){if(g<m.frame)continue;const age=g-m.frame, p=[m.pos[0],m.pos[1],0.006];
    const fin=m.kind==="land"||m.kind==="reply"||m.kind==="out"||m.kind==="rally";
    const col=m.kind==="net"||m.kind==="out"?"var(--warn)":m.kind==="reply"?"#9fb8d6":m.kind==="rally"?"#f0ece3":fin?"var(--accent)":"var(--ball)";
    const txtCol=m.kind==="out"?"#f08a8a":m.kind==="reply"?"#c9d8ea":m.kind==="rally"?"#f0ece3":fin?"#c8a84b":"#f0ece3";
    if(m.kind!=="net"){ring(frag,p,0.1+0.26*smooth(0,14,age),0.08+0.2*smooth(0,14,age),col,1.6,fin?0.95:0.35+0.4*(1-smooth(60,160,age)));
      if(fin) ring(frag,p,0.1,0.075,"none",0,.9,col);}
    const show=fin||age<130||(revealPattern&&m.label==="SHORT MIDDLE");
    const txt=revealPattern&&m.label==="SHORT MIDDLE"?"SHORT MIDDLE \u00d7"+"2":m.kind==="out"?"OUT \u00b7 "+m.label:m.label;
    if(show&&m.label&&m.kind!=="net"&&!(cueOnEarly&&!fin)) label(frag,[m.pos[0],m.pos[1],0],txt,txtCol,fin?18:15,fin?1:1-smooth(90,130,age)*(revealPattern?0:1));}
  // decision targets
  if(showTargets){for(let k=0;k<4;k++){const X=LETTERS[k], inf=SC[showTargets+X].info.shot, p=[inf.land[0],inf.land[1],0.006], on=chosen===X;
      if(chosen&&!on) continue;
      ring(frag,p,0.34,0.28,on?"var(--accent)":"rgba(240,236,227,.6)",on?2:1.3,on?.95:.75);
      label(frag,[p[0],p[1],0],X,on?"#c8a84b":"#f0ece3",19,1,6);}}
  // depth-sorted: net, bodies, ball
  const parts=[];
  parts.push({n:netGroup(),z:toCam([0,0,0.5]).z});
  const shadow=(a,op)=>{if(!a)return;const x=(a.pose[I.ankleL][0]+a.pose[I.ankleR][0])/2,y=(a.pose[I.ankleL][1]+a.pose[I.ankleR][1])/2;
    ring(frag,[x,y,0.004],0.38,0.3,"none",0,op,"rgba(0,0,0,.35)");};
  shadow(you,1);shadow(opp,.8);
  if(opp) drawFigure(parts,opp.pose,opp.rq,{kit:OPPKIT,op:.95,fwd:opp.fwd});
  if(you){drawFigure(parts,you.pose,you.rq,{fwd:you.fwd});
    for(const c of contactsOf(sc,"you")) if(Math.abs(g-c)<16){const W=prep(sc).you.find(w=>w.cG===c);
      for(let f=Math.max(c-14,Math.floor(g)-12);f<=Math.floor(g);f++){const a=actorAt(sc,"you",f-1),b=actorAt(sc,"you",f);
        seg(frag,a.pose[I.racquetTip],b.pose[I.racquetTip],"var(--accent)",2,0.12+0.5*(1-(g-f)/12));}}}
  const b=ballAt(sc,g);
  if(b){const gtrail=el_("g",{});let prev=null;
    for(let f=Math.max(firstBall(sc),Math.floor(g)-20);f<=Math.floor(g);f++){const q=sc.ball[f];if(!q){prev=null;continue;}
      if(prev) seg(gtrail,prev,q,"var(--ball)",1.6,0.08+0.5*(1-(g-f)/20));prev=q;}
    const qb=P(b);
    if(qb){parts.push({n:gtrail,z:qb.z+0.05});
      if(b[2]>0.05) ring(frag,[b[0],b[1],0.004],0.05,0.04,"none",0,.55,"rgba(0,0,0,.6)");
      const rr=Math.max(2.8,FOCAL*0.033/qb.z);
      parts.push({n:el_("circle",{cx:qb.s[0].toFixed(1),cy:qb.s[1].toFixed(1),r:(rr*2.6).toFixed(1),fill:"var(--ball)",opacity:.18}),z:qb.z+0.01});
      parts.push({n:el_("circle",{cx:qb.s[0].toFixed(1),cy:qb.s[1].toFixed(1),r:rr.toFixed(1),fill:"var(--ball)",stroke:"#6f7d10","stroke-width":.6}),z:qb.z-0.02});}}
  parts.sort((a,b)=>b.z-a.z); for(const {n} of parts) frag.appendChild(n);
  const St=mode==="daily"&&step<3?LESSON.steps[step]:null, fz=St&&scene.startsWith(St.scene)?SC[scene].info.freeze:null;
  const cueOn=fz!=null&&g>=fz-3&&g<=fz+10;
  if(cueOn){const bb=ballAt(sc,g);
    if(bb){seg(frag,[bb[0],bb[1],0.01],bb,"var(--ball)",2,.9);seg(frag,[bb[0]-0.12,bb[1],0.01],[bb[0]+0.12,bb[1],0.01],"var(--ball)",2,.9);
      label(frag,[bb[0]+1.0,bb[1]-0.3,0],St.cues.ball,"#e8f27a",15,1,0);}}
  if(cueOn||!playing||g<160){const hp=a=>a&&add(a.pose[I.head],[0,0,0.42]);
    if(you) label(frag,hp(you),cueOn?"YOU \u00b7 "+St.cues.you:"YOU","#c8a84b",15,.95,0);
    if(opp) label(frag,hp(opp),cueOn?"THEM \u00b7 "+St.cues.opp:"THEM","#9fb8d6",15,.95,0);}
  // net fault
  for(const m of sc.marks) if(m.kind==="net"&&g>=m.frame){const bp=sc.ball[m.frame]||b;if(bp){const q=P(bp);
    if(q)frag.appendChild(el_("circle",{cx:q.s[0].toFixed(1),cy:q.s[1].toFixed(1),r:(8+10*smooth(0,20,g-m.frame)).toFixed(1),fill:"none",stroke:"#e05252","stroke-width":2.2,opacity:1-0.5*smooth(0,30,g-m.frame)}));}}
  svg2.replaceChildren(frag);
}

startStep(0); fitView(); requestAnimationFrame(tick);
