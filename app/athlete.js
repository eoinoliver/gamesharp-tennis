/* GameSharp Sharpen athlete. Built from rally/core.js, figure.js and app_src/athlete.js. */
(function(){
/* ---------- math + projection ---------- */
const SVGNS="http://www.w3.org/2000/svg", svg=document.getElementById("svg");
let VW=820, VH=470, CYF=0.55; const ZNEAR=0.18;
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
  basis={C,f,r,u:cross(r,f)}; FOCAL=focalFor(cam.fov);
}
function toCam(p){const d=sub(p,basis.C);return {x:dot(d,basis.r),y:dot(d,basis.u),z:dot(d,basis.f)};}
function proj(c){ if(c.z<ZNEAR) window.__nearViolations=(window.__nearViolations||0)+1;
  return [(window.__pc?window.__pc[0]:VW/2)+FOCAL*c.x/c.z, (window.__pc?window.__pc[1]:VH*CYF)-FOCAL*c.y/c.z];}
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
/* premium look (8 Oct, Eoin: "premium"): a real kit, warm skin, hair under the headband; lessons opt in with LESSON.premium */
const KIT_PREM={skin:"#d9a67c", skinDk:"#8f6243", shirt:"#f4efe3", shirtDk:"#c8a84b", shorts:"#1b2740", shortsDk:"#0b1222",
  shoe:"#ffffff", frame:"#151515", frameHi:"#c8a84b", strings:"rgba(250,246,236,.45)", hair:"#2a1b11"};
const OPP_PREM={skin:"#e9c8a3", skinDk:"#a7805f", shirt:"#3b4757", shirtDk:"#1c2430", shorts:"#ebe6db", shortsDk:"#a8a397",
  shoe:"#f4f1ea", frame:"#1b1b1b", frameHi:"#9fb8d6", strings:"rgba(240,236,227,.4)", hair:"#6a4a2c"};
const PREM=()=>typeof LESSON==="undefined"||LESSON.premium!==false;   // the premium look everywhere (8 Oct, Eoin: "proceed in full")
const CALM_MOTION=typeof matchMedia!=="undefined"&&matchMedia("(prefers-reduced-motion: reduce)").matches;   // phone set to reduce motion
const LITE=typeof navigator!=="undefined"&&((navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=3);   // a slower phone
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
    const pts_=q.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join(" "), zz=(pa.z+pb.z)/2;
    if(seamless){   // premium: no seam at each joint; one dark outline round the whole figure, drawn behind it
      push(el_("polygon",{points:pts_,fill:"none",stroke:"#0d1a12","stroke-width":2.6,"stroke-linejoin":"round",opacity:op*.85}),zz+0.03);
      push(el_("polygon",{points:pts_,fill:col,stroke:col,"stroke-width":0.6,"stroke-linejoin":"round",opacity:op}),zz);}
    else push(el_("polygon",{points:pts_,fill:col,
      stroke:ghost?"none":dk,"stroke-width":1.3,"stroke-linejoin":"round",opacity:op}),zz);
  }
  const J=k=>pose[I[k]];
  const seamless=!ghost&&!!(o.kit&&o.kit.hair);
  const S=ghost?{skin:o.col,skinDk:o.col,shirt:o.col,shirtDk:o.col,shorts:o.col,shortsDk:o.col,shoe:o.col}:(o.kit||KIT);
  // torso: a slight V (shoulders a touch wider, a narrower waist), in a fitted shirt
  const sL=J("shoulderL"),sR=J("shoulderR"),hL=J("hipL"),hR=J("hipR");
  const sm=lerp3(sL,sR,.5), hm=lerp3(hL,hR,.5);
  const wide=(p,c,k)=>add(c,mul(sub(p,c),k));
  const sL2=wide(sL,sm,1.16), sR2=wide(sR,sm,1.16), wL=wide(lerp3(hL,sL,.3),lerp3(hm,sm,.3),.78), wR=wide(lerp3(hR,sR,.3),lerp3(hm,sm,.3),.78);
  const tq=[sL2,sR2,wR,wide(hR,hm,.95),wide(hL,hm,.95),wL].map(p=>P(p));
  if(tq.every(Boolean)){
    const z=tq.reduce((a,q)=>a+q.z,0)/tq.length;
    push(el_("polygon",{points:tq.map(q=>q.s.map(v=>v.toFixed(1)).join(",")).join(" "),fill:S.shirt,
      stroke:ghost?"none":S.shirtDk,"stroke-width":2,"stroke-linejoin":"round",opacity:op}),z);
  }
  limb(J("hips"),J("chest"),.078,.118,S.shirt,S.shirtDk);
  limb(sL,sR,.08,.08,S.shirt,S.shirtDk);
  limb(hL,hR,.078,.078,S.shorts,S.shortsDk);
  if(seamless) limb(lerp3(J("chest"),J("neck"),.6),J("neck"),.05,.043,S.skin,S.skinDk);   // just the neck, not a strip down the back
  else limb(J("chest"),J("neck"),.05,.043,S.skin,S.skinDk);
  // arms and legs taper like an athlete's: fuller at the top, slim at the wrist and ankle, a calf
  for(const s of ["L","R"]){
    const sh=J("shoulder"+s),e=J("elbow"+s),w=J("wrist"+s),m=lerp3(sh,e,.34),fa=lerp3(e,w,.3);
    limb(sh,m,.068,.056,S.shirt,S.shirtDk); limb(m,e,.053,.038,S.skin,S.skinDk);
    if(seamless) limb(lerp3(sh,m,.86),m,.06,.057,S.shirtDk,S.shirtDk);   // gold trim at the sleeve's end
    limb(e,fa,.04,.044,S.skin,S.skinDk); limb(fa,w,.044,.027,S.skin,S.skinDk);
    if(o.band&&s==="R") limb(lerp3(e,w,.8),lerp3(e,w,.97),.036,.034,o.band,o.bandDk||o.band);   // wristband
    const h=J("hip"+s),k=J("knee"+s),a=J("ankle"+s),mt=lerp3(h,k,.42),cf=lerp3(k,a,.3);
    limb(h,mt,.086,.074,S.shorts,S.shortsDk); limb(mt,k,.07,.044,S.skin,S.skinDk);
    limb(k,cf,.044,.058,S.skin,S.skinDk); limb(cf,a,.058,.027,S.skin,S.skinDk);
    if(seamless) limb(lerp3(cf,a,.55),a,.04,.034,"#fbfaf6","#fbfaf6");   // white socks
  }
  // head (and, for you, a headband)
  const hq=P(J("head")); if(hq){const r=Math.max(3,FOCAL*.115/hq.z);
    push(el_("circle",{cx:hq.s[0].toFixed(1),cy:hq.s[1].toFixed(1),r:(r+(ghost?0:1.1)).toFixed(1),fill:ghost?S.skin:S.skinDk,opacity:op}),hq.z+0.001);
    push(el_("circle",{cx:hq.s[0].toFixed(1),cy:hq.s[1].toFixed(1),r:r.toFixed(1),fill:S.skin,opacity:op}),hq.z);
    if(S.hair&&!ghost){   // hair: seen from behind, the head is hair; from the front, a face under a hairline
      const fw=o.fwd||[0,1,0], away=(fw[0]*basis.f[0]+fw[1]*basis.f[1])>0.15;
      if(away) push(el_("circle",{cx:hq.s[0].toFixed(1),cy:(hq.s[1]-r*.04).toFixed(1),r:(r*.98).toFixed(1),fill:S.hair,opacity:op}),hq.z-0.0002);
      else {push(el_("circle",{cx:hq.s[0].toFixed(1),cy:(hq.s[1]-r*.22).toFixed(1),r:(r*.93).toFixed(1),fill:S.hair,opacity:op}),hq.z+0.0006);
        push(el_("circle",{cx:hq.s[0].toFixed(1),cy:(hq.s[1]+r*.16).toFixed(1),r:(r*.8).toFixed(1),fill:S.skin,opacity:op}),hq.z-0.0002);}}
    if(o.band&&!ghost){const y=hq.s[1]-r*.34, half=Math.sqrt(Math.max(0,r*r-(r*.34)**2))+0.6;
      push(el_("line",{x1:(hq.s[0]-half).toFixed(1),y1:y.toFixed(1),x2:(hq.s[0]+half).toFixed(1),y2:y.toFixed(1),stroke:o.band,"stroke-width":Math.max(1.6,r*.34).toFixed(1),"stroke-linecap":"round",opacity:op}),hq.z-0.001);
      if(seamless){   // headband tails: two ribbons at the back of the head, swinging with the body
        const sw=CALM_MOTION?0:Math.sin(performance.now()/180)*0.35, fw=o.fwd||[0,1,0], back=[-fw[0],-fw[1],0];
        for(const k of [0,1]){const a0=add(J("head"),[back[0]*0.11,back[1]*0.11,0.03]), a1=add(a0,[back[0]*(0.2+0.04*k)+sw*0.06,back[1]*(0.2+0.04*k),-0.05-0.05*k]);
          const pa=P(a0),pb=P(a1); if(pa&&pb) push(el_("line",{x1:pa.s[0].toFixed(1),y1:pa.s[1].toFixed(1),x2:pb.s[0].toFixed(1),y2:pb.s[1].toFixed(1),stroke:o.band,"stroke-width":Math.max(1,r*.2).toFixed(1),"stroke-linecap":"round",opacity:op}),hq.z+0.002);}}}}
  // shoes
  for(const s of ["L","R"]){const a=J("ankle"+s),k=J("knee"+s);
    const fw=o.fwd||[0,1,0]; const toe=add(a,[fw[0]*0.14,fw[1]*0.14,-0.05]);
    limb(add(a,[0,0,-0.03]),toe,.043,.037,S.shoe,ghost?S.shoe:"#9c978c");}
  // racquet
  if(rq){
    const neck=add(rq.w,mul(rq.axis,.20)), fr=ghost?o.col:(o.kit||KIT).frame, hi=ghost?o.col:(o.kit||KIT).frameHi;
    limb(rq.grip||rq.w,neck,.016,.014,fr,fr);
    if(seamless) limb(lerp3(rq.grip||rq.w,neck,.78),neck,.017,.016,hi,hi);   // a gold throat on the racquet
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


/* the body's shadow cast across the court (premium): every joint dropped to the ground along the light,
   drawn as one flat dark figure under the players */
const SUN=[0.42,0.30];
function shadowPose(pose){return pose.map(p=>[p[0]+p[2]*SUN[0],p[1]+p[2]*SUN[1],0.003]);}

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
/* the ball (8 Oct, Eoin: "the serve omits the visible ball in the toss"; "the toss should mimic the gold standard,
   The Serve Writes the Next Question"). Metres and seconds, 100 frames a second.
   Serve: the lesson's own toss. TOSS is the captured serve's solved toss (the serve clip's ball, frames 73 to contact:
   released from the left hand at 1.34 m, up to 3.47 m, 1.08 s, onto the measured contact), copied from the lab clip so
   it matches the lesson ball for ball; before release the ball is in the tossing hand.
   Groundstrokes: their ball crosses the net, bounces 4.5 m in front of you and rises to the contact.
   Volleys: met in the air. After contact the ball flies on over the net (and the serve lands in the box) until the
   swing ends, so it never vanishes while the racquet is still moving. */
const TOSS_FROM=73, TOSS=[[0.209,0.13,1.34],[0.207,0.133,1.406],[0.204,0.136,1.47],[0.202,0.139,1.534],[0.199,0.142,1.596],[0.197,0.145,1.657],[0.194,0.148,1.717],[0.192,0.152,1.776],[0.189,0.155,1.834],[0.187,0.158,1.891],[0.184,0.161,1.947],[0.182,0.164,2.002],[0.179,0.167,2.056],[0.177,0.17,2.109],[0.174,0.173,2.161],[0.172,0.176,2.212],[0.169,0.179,2.261],[0.167,0.183,2.31],[0.164,0.186,2.358],[0.162,0.189,2.405],[0.159,0.192,2.45],[0.157,0.195,2.495],[0.154,0.198,2.539],[0.152,0.201,2.581],[0.149,0.204,2.623],[0.147,0.207,2.663],[0.144,0.21,2.703],[0.142,0.213,2.742],[0.14,0.216,2.779],[0.137,0.219,2.816],[0.135,0.223,2.851],[0.132,0.226,2.886],[0.13,0.229,2.92],[0.127,0.232,2.952],[0.125,0.235,2.984],[0.122,0.238,3.014],[0.12,0.241,3.044],[0.117,0.244,3.072],[0.115,0.247,3.1],[0.113,0.25,3.127],[0.11,0.253,3.152],[0.108,0.256,3.177],[0.105,0.259,3.2],[0.103,0.262,3.223],[0.1,0.265,3.245],[0.098,0.268,3.265],[0.096,0.271,3.285],[0.093,0.274,3.304],[0.091,0.277,3.321],[0.088,0.28,3.338],[0.086,0.283,3.354],[0.083,0.286,3.369],[0.081,0.289,3.382],[0.078,0.292,3.395],[0.076,0.295,3.407],[0.073,0.298,3.418],[0.071,0.301,3.428],[0.069,0.304,3.436],[0.066,0.307,3.444],[0.064,0.31,3.451],[0.061,0.314,3.457],[0.059,0.317,3.462],[0.057,0.32,3.466],[0.054,0.323,3.469],[0.052,0.326,3.471],[0.049,0.329,3.472],[0.047,0.332,3.472],[0.044,0.335,3.471],[0.042,0.338,3.469],[0.04,0.341,3.466],[0.037,0.344,3.462],[0.035,0.347,3.457],[0.032,0.35,3.451],[0.03,0.353,3.444],[0.027,0.356,3.437],[0.025,0.359,3.428],[0.022,0.362,3.418],[0.02,0.365,3.407],[0.018,0.368,3.395],[0.015,0.371,3.383],[0.013,0.374,3.369],[0.01,0.377,3.354],[0.008,0.38,3.339],[0.005,0.383,3.322],[0.003,0.386,3.304],[0.001,0.389,3.286],[-0.002,0.392,3.266],[-0.004,0.395,3.246],[-0.007,0.398,3.224],[-0.009,0.401,3.202],[-0.011,0.404,3.178],[-0.014,0.407,3.154],[-0.016,0.41,3.129],[-0.019,0.413,3.102],[-0.021,0.416,3.075],[-0.024,0.419,3.047],[-0.026,0.422,3.018],[-0.028,0.425,2.987],[-0.031,0.428,2.956],[-0.033,0.431,2.924],[-0.036,0.434,2.891],[-0.038,0.437,2.857],[-0.04,0.44,2.822],[-0.043,0.443,2.786],[-0.045,0.446,2.749],[-0.048,0.449,2.711],[-0.05,0.452,2.672],[-0.052,0.455,2.632],[-0.055,0.458,2.646]];
const G=9.81, GROUND=new Set(["fh","bh","slice","drop"]);
function fall(p,v,t){return [p[0]+v[0]*t,p[1]+v[1]*t,p[2]+v[2]*t-G/2*t*t];}
function bounced(p,v,t){   /* one bounce if it reaches the ground (70% of the vertical speed back) */
  const tg=(v[2]+Math.sqrt(v[2]*v[2]+2*G*p[2]))/G; if(t<=tg) return fall(p,v,t);
  const q=fall(p,v,tg); return fall([q[0],q[1],0],[v[0],v[1],0.7*(G*tg-v[2])],t-tg);}
const OUT={fh:[0,25,1.55],bh:[0,25,1.45],slice:[0,22,1.15],drop:[0,14,1.1],fv:[0,18,1.2],bv:[0,18,1.2]};   /* forward speed m/s, height crossing the net */
function ballAt(k,c,f){
  const C=c.contactBall, cf=c.contactFrame, t=(f-cf)/100;
  if(k==="serve"){
    if(f>=cf){const T=0.4, v=[0.3,16.5/T,(-C[2]+G/2*T*T)/T]; return bounced(C,v,t);}   /* lands about 16.5 m on, inside the service line */
    if(f<TOSS_FROM) return at(c,f).pose[I.wristL];                                     /* in the tossing hand */
    const i=Math.min(TOSS.length-1,Math.floor(f-TOSS_FROM)), u=f-TOSS_FROM-i, a=TOSS[i], b=TOSS[Math.min(TOSS.length-1,i+1)];
    return lerp3(a,b,u);}
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
const SL=4.115, DL=5.485;
/* the court around the player. Rallying strokes: the baseline just behind them. The serve: placed as the lesson places
   the captured serve (courtOffset [1.2, -11.95]): the baseline 6.5 cm in front of the clip's origin and the centre mark
   1.2 m to the left, so the feet start behind the line and cross it only in the air, after contact. No foot fault. */
let BL=-0.35, DX=0, NET=BL+11.885;
function courtFor(k){BL=k==="serve"?0.065:-0.35; DX=k==="serve"?-1.2:0; NET=BL+11.885;}
function court(g){
  quad(g,[[-9,-4,0],[9,-4,0],[9,NET+3,0],[-9,NET+3,0]],"#0b3016");
  quad(g,[[-DL+DX,BL,0],[DL+DX,BL,0],[DL+DX,NET,0],[-DL+DX,NET,0]],"#13502a");
  const ln=(a,b)=>seg(g,[a[0]+DX,a[1],0],[b[0]+DX,b[1],0],"rgba(240,236,227,.8)",1.6);
  ln([-DL,BL],[DL,BL]);ln([-DL,BL],[-DL,NET]);ln([DL,BL],[DL,NET]);ln([-SL,BL],[-SL,NET]);ln([SL,BL],[SL,NET]);
  ln([-SL,NET-6.4],[SL,NET-6.4]);ln([0,NET-6.4],[0,NET]);ln([0,BL],[0,BL+.15]);
  const W=DL+.9,top=[[-W+DX,NET,1.07],[DX,NET,.914],[W+DX,NET,1.07]];
  quad(g,[[-W+DX,NET,0],[W+DX,NET,0],top[2],top[1],top[0]],"rgba(4,10,6,.45)");
  seg(g,top[0],top[1],"rgba(240,236,227,.85)",2);seg(g,top[1],top[2],"rgba(240,236,227,.85)",2);
}
function draw(svg,k,c,f){
  const g=document.createDocumentFragment(); courtFor(k); court(g);
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

})();
