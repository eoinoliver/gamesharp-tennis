/* GameSharp engine: shared by every lesson. Built from rally/lesson_body.html, core.js, figure.js. */
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
const PREM=()=>typeof LESSON!=="undefined"&&!!LESSON.premium;
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
        const sw=Math.sin(performance.now()/180)*0.35, fw=o.fwd||[0,1,0], back=[-fw[0],-fw[1],0];
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
  if(PREM()) drawLawn(frag,l2,d2,L,Dw); else {
  quad(frag,[[-Dw,-L,0],[Dw,-L,0],[Dw,L,0],[-Dw,L,0]],"var(--court)");
  quad(frag,[[-d2,-l2,0],[d2,-l2,0],[d2,l2,0],[-d2,l2,0]],"var(--court-in)");}
  const BW=4.4,BH=0.72;
  // painted to read from the camera's end of the court (seen from their end, it turns round)
  const FL=cam&&cam.az>0, pt=(y,op)=>FL?planeText(frag,"GAMESHARP",[BW/2,y+BH,0.005],[-1,0,0],[0,-1,0],BW,BH,BRAND,op):planeText(frag,"GAMESHARP",[-BW/2,y,0.005],[1,0,0],[0,1,0],BW,BH,BRAND,op);
  const low=cam&&cam.el<20;   // a low camera sits right over the logo at its own end: leave that one out
  if(!(low&&!FL)) pt(-l2-2.7,.34); if(!(low&&FL)) pt(l2+1.6,.42);
  const ln=(a,b)=>seg(frag,[a[0],a[1],0],[b[0],b[1],0],PREM()?"rgba(250,248,240,.92)":"var(--court-line)",PREM()?1.8:1.5);
  ln([-d2,-l2],[d2,-l2]);ln([-d2,l2],[d2,l2]);ln([-d2,-l2],[-d2,l2]);ln([d2,-l2],[d2,l2]);
  ln([-S,-l2],[-S,l2]);ln([S,-l2],[S,l2]);ln([-S,-V],[S,-V]);ln([-S,V],[S,V]);ln([0,-V],[0,V]);
  ln([0,-l2],[0,-l2+0.15]);ln([0,l2],[0,l2-0.15]);
}
/* premium lawn (8 Oct): mown stripes end to end, worn patches behind the baselines and down the middle where the
   serves and rallies are played, and a dark stadium round it with a gold rail */
function drawLawn(frag,l2,d2,L,Dw){
  const W2=Dw+2.4, L2=L+1.2, H=2.2;
  drawStadium(frag);
  for(const sy of [-1,1]){quad(frag,[[-W2,sy*L2,0],[W2,sy*L2,0],[W2,sy*L2,H],[-W2,sy*L2,H]],"#0c1f13");
    seg(frag,[-W2,sy*L2,H],[W2,sy*L2,H],"#c8a84b",1.6,.75); seg(frag,[-W2,sy*L2,0.9],[W2,sy*L2,0.9],"rgba(200,168,75,.25)",1,.6);}
  for(const sx of [-1,1]){quad(frag,[[sx*W2,-L2,0],[sx*W2,L2,0],[sx*W2,L2,1.0],[sx*W2,-L2,1.0]],"#0a1a10");
    seg(frag,[sx*W2,-L2,1.0],[sx*W2,L2,1.0],"#c8a84b",1.2,.5);}
  quad(frag,[[-W2,-L2,0],[W2,-L2,0],[W2,L2,0],[-W2,L2,0]],"#265a2c");
  const band=1.55; let k=0;
  for(let y=-L2;y<L2;y+=band,k++){const y1=Math.min(L2,y+band);
    quad(frag,[[-W2,y,0.0005],[W2,y,0.0005],[W2,y1,0.0005],[-W2,y1,0.0005]],k%2?"#2f6a34":"#296030");}
  for(const sy of [-1,1]){   // worn grass: the server's spot and the baseline rally zone
    for(const [rx,ry,dy,op] of [[2.4,0.8,0.9,.08],[1.4,0.5,0.7,.11],[0.7,0.3,0.55,.14]])   // soft, layered: worn, not painted
      ring(frag,[0,sy*(l2+dy),0.001],rx,ry,"none",0,op,"#8a8c4f");
    ring(frag,[0,sy*(l2-2.6),0.001],0.7,1.8,"none",0,.07,"#8a8c4f");}
}
/* the stadium (8 Oct, second pass): tiered stands behind the walls and along the sides, full of spectators in
   varied colours (drawn as a few paths, one per colour, so hundreds of people cost a handful of elements); they
   ripple when the crowd applauds. An umpire's chair at the net and ball kids at the posts. */
const CROWD=(()=>{let r=7;const rnd=()=>(r=(r*16807)%2147483647)/2147483647, out=[];
  const COLS=["#e9e4d6","#24324a","#7a2e2e","#3d5a40","#c8a84b","#5b6f8c","#d9d2c2","#2b2b2b","#8a6a4a","#a7b8c9"];
  const W2=CRT.dw/2+3.66+2.4, L2=CRT.L/2+6.4+1.2;
  const aisle=v=>((v%6)+6)%6<0.9;   // aisles every 6 m: blocks of seats, not a carpet of dots
  for(const sy of [-1,1]) for(let row=0;row<6;row++) for(let x=-W2-1;x<=W2+1;x+=0.78){
    const j=(rnd()-.5)*0.3; if(rnd()<0.08||aisle(x+3)) continue;
    out.push({p:[x+j,sy*(L2+0.9+row*0.95),2.5+row*0.62],c:COLS[Math.floor(rnd()*COLS.length)],ph:rnd()*6.28,row});}
  for(const sx of [-1,1]) for(let row=0;row<4;row++) for(let y=-L2;y<=L2;y+=0.8){
    if(rnd()<0.1||aisle(y+3)) continue;
    out.push({p:[sx*(W2+0.9+row*0.95),y+(rnd()-.5)*0.3,1.3+row*0.62],c:COLS[Math.floor(rnd()*COLS.length)],ph:rnd()*6.28,row});}
  return out;})();
function drawStadium(frag){
  const W2=CRT.dw/2+3.66+2.4, L2=CRT.L/2+6.4+1.2, sx_=W2+1.6;
  for(const sy of [-1,1]) for(let row=0;row<6;row++){const y0=sy*(L2+0.45+row*0.95), y1=sy*(L2+1.4+row*0.95), z=2.2+row*0.62;
    quad(frag,[[-sx_-3,y0,z],[sx_+3,y0,z],[sx_+3,y1,z],[-sx_-3,y1,z]],row%2?"#0e2416":"#10281a");
    quad(frag,[[-sx_-3,y1,z],[sx_+3,y1,z],[sx_+3,y1,z+0.62],[-sx_-3,y1,z+0.62]],"#0a1c11");}
  for(const sx of [-1,1]) for(let row=0;row<4;row++){const x0=sx*(W2+0.45+row*0.95), x1=sx*(W2+1.4+row*0.95), z=1.0+row*0.62;
    quad(frag,[[x0,-L2,z],[x0,L2,z],[x1,L2,z],[x1,-L2,z]],row%2?"#0e2416":"#10281a");}
  // the roof: a canopy over each end stand, its leading edge catching the light (a show court, enclosed)
  for(const sy of [-1,1]){const yb=sy*(L2+6.6), yf=sy*(L2+2.2), z0=7.4, z1=6.6;
    quad(frag,[[-sx_-3,yb,z0],[sx_+3,yb,z0],[sx_+3,yf,z1],[-sx_-3,yf,z1]],"#081509");
    seg(frag,[-sx_-3,yf,z1],[sx_+3,yf,z1],"#d9c27a",1.4,.55);
    for(let x=-sx_;x<=sx_;x+=4.2) seg(frag,[x,yf,z1],[x,yb,z0],"#123020",1,.6);}
  // spectators: a body and a head each, grouped into one path per colour; off-screen and behind-camera people skipped
  const now=performance.now()/1000, cheer=window.__cheerT?Math.max(0,1-(now-window.__cheerT)/2.6):0;
  const paths={}, heads=[];
  for(const q of CROWD){const lift=cheer*0.18*Math.max(0,Math.sin(now*9+q.ph)), p=[q.p[0],q.p[1],q.p[2]+lift];
    const b=P(p), h=P([p[0],p[1],p[2]+0.42]); if(!b||!h) continue;
    if(b.s[0]<-40||b.s[0]>VW+40||b.s[1]<-40||b.s[1]>VH+40) continue;
    const rb=Math.max(0.7,FOCAL*0.24/b.z), rh=Math.max(0.5,FOCAL*0.12/h.z);
    const band=q.row>=3?1:0; (paths[q.c+"|"+band]=paths[q.c+"|"+band]||[]).push(`M${(b.s[0]-rb).toFixed(1)} ${b.s[1].toFixed(1)}a${rb.toFixed(1)} ${rb.toFixed(1)} 0 1 0 ${(2*rb).toFixed(1)} 0a${rb.toFixed(1)} ${rb.toFixed(1)} 0 1 0 ${(-2*rb).toFixed(1)} 0`);
    heads.push(`M${(h.s[0]-rh).toFixed(1)} ${h.s[1].toFixed(1)}a${rh.toFixed(1)} ${rh.toFixed(1)} 0 1 0 ${(2*rh).toFixed(1)} 0a${rh.toFixed(1)} ${rh.toFixed(1)} 0 1 0 ${(-2*rh).toFixed(1)} 0`);}
  for(const [k,d] of Object.entries(paths)){const [c,band]=k.split("|"); frag.appendChild(el_("path",{d:d.join(""),fill:c,opacity:band==="1"?.5:.72}));}
  if(heads.length) frag.appendChild(el_("path",{d:heads.join(""),fill:"#c99a74",opacity:.7}));
}
function drawCourtside(parts){   // umpire's chair at the net, ball kids crouched at the posts (drawn depth-sorted with the players)
  const W=CRT.dw/2+0.914, ux=-(W+1.1), push=(n,p)=>{const q=P(p);if(q)parts.push({n,z:q.z});};
  const g=el_("g",{}), leg=(a,b)=>seg(g,a,b,"#1a2a20",2.2);
  leg([ux-0.35,-0.35,0],[ux-0.3,-0.3,1.9]);leg([ux+0.35,-0.35,0],[ux+0.3,-0.3,1.9]);leg([ux-0.35,0.35,0],[ux-0.3,0.3,1.9]);leg([ux+0.35,0.35,0],[ux+0.3,0.3,1.9]);
  quad(g,[[ux-0.4,-0.4,1.9],[ux+0.4,-0.4,1.9],[ux+0.4,0.4,1.9],[ux-0.4,0.4,1.9]],"#173323");
  const bod=P([ux,0,2.3]), hd=P([ux,0,2.75]);
  if(bod&&hd){const rb=FOCAL*0.24/bod.z, rh=FOCAL*0.12/hd.z;
    g.appendChild(el_("ellipse",{cx:bod.s[0].toFixed(1),cy:bod.s[1].toFixed(1),rx:(rb*0.85).toFixed(1),ry:(rb*1.25).toFixed(1),fill:"#1f2c46"}));
    g.appendChild(el_("circle",{cx:hd.s[0].toFixed(1),cy:hd.s[1].toFixed(1),r:rh.toFixed(1),fill:"#d6a982"}));
    g.appendChild(el_("circle",{cx:hd.s[0].toFixed(1),cy:(hd.s[1]-rh*.3).toFixed(1),r:(rh*.9).toFixed(1),fill:"#e9e4d6"}));}   // a pale cap
  push(g,[ux,0,1.2]);
  for(const sx of [-1,1]){const k=el_("g",{}), x=sx*(W+0.55), b=P([x,0.35,0.42]), h=P([x,0.35,0.78]);
    if(b&&h){const rb=FOCAL*0.2/b.z, rh=FOCAL*0.1/h.z;
      k.appendChild(el_("ellipse",{cx:b.s[0].toFixed(1),cy:b.s[1].toFixed(1),rx:(rb*1.1).toFixed(1),ry:(rb*0.9).toFixed(1),fill:"#24324a"}));
      k.appendChild(el_("circle",{cx:h.s[0].toFixed(1),cy:h.s[1].toFixed(1),r:rh.toFixed(1),fill:"#c99a74"}));}
    push(k,[x,0.35,0.5]);}
}
/* warm late-afternoon light over the whole stage, falling off into a soft vignette */
function lightOverlay(frag){
  const d=el_("defs",{}), g=el_("radialGradient",{id:"gsLight",cx:"38%",cy:"30%",r:"85%"});
  for(const [o,c,a] of [["0%","#fff1c9",.13],["45%","#fff1c9",.03],["80%","#000",.18],["100%","#000",.42]])
    g.appendChild(el_("stop",{offset:o,"stop-color":c,"stop-opacity":a}));
  // haze: the far end of the stadium softens into warm afternoon air
  const hz=el_("linearGradient",{id:"gsHaze",x1:"0",y1:"0",x2:"0",y2:"1"});
  for(const [o,a] of [["0%",.22],["30%",.08],["55%",0]]) hz.appendChild(el_("stop",{offset:o,"stop-color":"#f4e7c4","stop-opacity":a}));
  d.appendChild(g); d.appendChild(hz); frag.appendChild(d);
  frag.appendChild(el_("rect",{x:0,y:0,width:VW,height:VH,fill:"url(#gsHaze)","pointer-events":"none"}));
  frag.appendChild(el_("rect",{x:-2000,y:-2000,width:6000,height:6000,fill:"url(#gsLight)","pointer-events":"none"}));
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
const LSC=()=>NARROW.matches?1.6:1;
function label(frag,p,txt,col,size,op,dy){const q=P(p);if(!q)return;
  const e=el_("text",{x:q.s[0].toFixed(1),y:(q.s[1]-(dy||10)).toFixed(1),"text-anchor":"middle",fill:col,
    "font-family":"Bebas Neue, Impact, sans-serif","font-size":(size||16)*LSC(),"letter-spacing":".05em",opacity:op==null?1:op,
    stroke:"#07130a","stroke-width":3.2*LSC(),"paint-order":"stroke"});e.textContent=txt;frag.appendChild(e);}

/* ---------- actors: captured clips placed on court ---------- */
const PRE={drop:70,bhChest:34,bhHigh:34,bhHigher:34,fh:70,fhhi:70,fhret:70,lowfv:55,bh:34,serveW:0,serveT:0,serveB:0,bv:60,sm:90,fvhi:55};
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
// Holds are a neutral ready stance (the ready clip, else the forehand's first frame), whatever clip the hold names.
function localAt(w,g){const r=w.fixed?clipAt(CL.ready||CL.fh,1):clipAt(w.c,g-w.s.start+1);r.T=w.s.T;r.yaw=w.s.yaw;r.mirror=w.s.mirror;return r;}
function worldOf(L){
  const dz=L.T[2]||0;
  // a left-handed player (segment marked mirror): the captured swing mirrored side to side before it is placed
  const Mi=L.mirror?p=>[-p[0],p[1],p[2]]:p=>p;
  const c=Math.cos(L.yaw),s=Math.sin(L.yaw),R=p=>{p=Mi(p);return [c*p[0]-s*p[1],s*p[0]+c*p[1],p[2]];},X=p=>{const r=R(p);return [r[0]+L.T[0],r[1]+L.T[1],r[2]+dz];};
  const pose=L.pose.map(X);
  if(L.mirror) for(const n of ["shoulder","elbow","wrist","hip","knee","ankle"]){const l=I[n+"L"],r=I[n+"R"],t=pose[l];pose[l]=pose[r];pose[r]=t;}   // keep left/right anatomical
  if(dz){for(const F of ["L","R"]){const H=pose[I["hip"+F]],K=pose[I["knee"+F]],A=pose[I["ankle"+F]],A0=[A[0],A[1],A[2]-dz];
      const l1=len(sub(K,H)),l2=len(sub(A,K)),mid=lerp3(H,A0,0.5),r=ik2(H,A0,l1,l2,sub(K,mid));pose[I["knee"+F]]=r.knee;pose[I["ankle"+F]]=r.ankle;}}
  return {pose,axis:R(L.rq.axis),lateral:R(L.rq.lateral),centre:X(L.rq.centre),fwd:R([0,1,0])};
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
    const n=W[i+1]; if(n&&g>w.b&&g<n.a){const A=worldOf(localAt(w,w.b)),B=worldOf(localAt(n,n.a)),u=smooth(w.b,n.a,g);
      Wd=footwork(blendWorld(A,B,u,away),A,B,u);break;}}
  if(!Wd) Wd=worldOf(localAt(W[W.length-1],W[W.length-1].b));
  // split step: a small two-footed hop that lands at a chosen moment, then a brief load
  if(name==="you"&&sc.info.splits) for(const [L,air] of sc.info.splits){
    let dz=0; if(g>L-air&&g<L) dz=0.11*(air/26)*Math.sin(Math.PI*(g-(L-air))/air);
    else if(g>=L&&g<L+10) dz=-0.035*Math.sin(Math.PI*(g-L)/10);
    if(dz){Wd={...Wd,pose:Wd.pose.map((p,k)=>dz<0&&(k===I.ankleL||k===I.ankleR)?p:[p[0],p[1],p[2]+dz]),centre:[Wd.centre[0],Wd.centre[1],Wd.centre[2]+dz]};}}
  const axis=norm(Wd.axis), lateral=norm(sub(Wd.lateral,mul(axis,dot(Wd.lateral,axis))));
  return {pose:Wd.pose,rq:{w:Wd.pose[W.some(w=>w.s.mirror)?I.wristL:I.wristR],axis,lateral,centre:Wd.centre},fwd:norm(Wd.fwd)};   // a lefty holds it in the left hand
}
/* ---------- footwork: run to the next spot instead of gliding in a ready stance ----------
   Between two shots the body travels from stance A to stance B. The feet step there: each step
   plants a foot on the court and it stays put while the body passes over it (no skating), the
   other foot swings through with a lift, the knees follow by two-bone IK, the hips drop into
   a running crouch and bob with each step, and on longer moves the body turns toward the run. */
function ik2(H,A,l1,l2,poleDir){
  let d=sub(A,H), L=len(d); const mx=(l1+l2)*0.995, mn=Math.abs(l1-l2)+1e-3;
  if(L>mx){A=add(H,mul(d,mx/L));L=mx;} if(L<mn){A=add(H,mul(norm(d),mn));L=mn;}
  const e=mul(sub(A,H),1/L), a=(l1*l1-l2*l2+L*L)/(2*L), h=Math.sqrt(Math.max(0,l1*l1-a*a));
  let p=sub(poleDir,mul(e,dot(poleDir,e))); p=len(p)<1e-6?[0,0,1]:norm(p);
  return {knee:add(add(H,mul(e,a)),mul(p,h)),ankle:A};
}
function footwork(Wd,A,B,u){
  const ha=A.pose[I.hips], hb=B.pose[I.hips], dx=hb[0]-ha[0], dy=hb[1]-ha[1], D=Math.hypot(dx,dy);
  if(D<0.3) return Wd;
  const dir=[dx/D,dy/D,0], perp=[-dir[1],dir[0],0];
  const n=Math.max(2,Math.round(D/Math.min(0.7,0.4+0.1*D))), L=D/n, s=D*u;
  const env=Math.sin(Math.PI*u), k=Math.min(1,D/1.5);
  // turn toward the run on longer moves (never more than ~50 degrees off the stance facing)
  const f=facingOf(Wd.pose), dA=wrapA(Math.atan2(dy,dx)-f), maxT=0.9*clamp((D-1)/2,0,1);
  const turn=clamp(dA,-maxT,maxT)*smooth(0,0.28,u)*(1-smooth(0.72,1,u));
  const c=Wd.pose[I.hips], stepPh=s/L-Math.floor(s/L);
  const dz=-0.07*env*k+0.028*k*Math.sin(Math.PI*stepPh)*env;
  const R=p=>{const q=rotAbout(p,c,turn);return [q[0],q[1],q[2]+dz];};
  const pose=Wd.pose.map(R), out={pose,axis:rotV(Wd.axis,turn),lateral:rotV(Wd.lateral,turn),centre:R(Wd.centre),fwd:rotV(Wd.fwd,turn)};
  // feet
  const aL=A.pose[I.ankleL], aR=A.pose[I.ankleR];
  const proj=p=>(p[0]-ha[0])*dir[0]+(p[1]-ha[1])*dir[1];
  const lead=proj(aL)>=proj(aR)?"L":"R";
  const sL=Math.sign((aL[0]-aR[0])*perp[0]+(aL[1]-aR[1])*perp[1])||1, side={L:sL,R:-sL};
  const lift=(0.08+0.06*k);
  for(const F of ["L","R"]){
    const steps=[]; for(let j=1;j<=n;j++) if((j%2===1)===(F===lead)) steps.push(j);
    const plant=j=>j===steps[steps.length-1]?B.pose[I["ankle"+F]]:
      [ha[0]+dir[0]*(j*L+L/2)+perp[0]*side[F]*0.12, ha[1]+dir[1]*(j*L+L/2)+perp[1]*side[F]*0.12, 0.1];
    const cur=Math.min(n,Math.floor(s/L)+1), p=s/L-(cur-1);
    let prev=A.pose[I["ankle"+F]], pos=prev;
    for(const j of steps){
      if(j<cur){prev=plant(j);pos=prev;continue;}
      if(j===cur){const q=smooth(0,1,p); pos=lerp3(prev,plant(j),q); pos=[pos[0],pos[1],pos[2]+lift*Math.sin(Math.PI*p)];}
      break;}
    const H=pose[I["hip"+F]], K0=pose[I["knee"+F]];
    const l1=len(sub(Wd.pose[I["knee"+F]],Wd.pose[I["hip"+F]])), l2=len(sub(Wd.pose[I["ankle"+F]],Wd.pose[I["knee"+F]]));
    const mid=lerp3(H,pos,0.5), pole=add(norm(sub(K0,mid)),mul(out.fwd,0.6));
    const r=ik2(H,pos,l1,l2,pole); pose[I["knee"+F]]=r.knee; pose[I["ankle"+F]]=r.ankle;
  }
  return out;
}
function contactsOf(sc,name){return (prep(sc)[name]||[]).filter(w=>!w.fixed).map(w=>w.cG);}

/* ---------- ball, including the serve toss the flight data starts after ---------- */
function firstBall(sc){if(sc._fb!=null)return sc._fb;let i=0;while(i<sc.ball.length&&!sc.ball[i])i++;return sc._fb=i;}
const TOSS={};
function tossInfo(clip){   // toss release frame of this serve clip (was fixed to serveW, which a lesson may not ship)
  if(TOSS[clip]) return TOSS[clip]; const c=CL[clip]; let best=1,bz=-1;
  for(let f=1;f<c.contactFrame-25;f++){const z=c.frames[f-1][I.wristL][2];if(z>bz){bz=z;best=f;}}
  return TOSS[clip]={releaseLocal:best};
}
function ballAt(sc,g){
  const n=sc.ball.length, f0=firstBall(sc);
  if(g>=f0){const i=Math.floor(g),u=g-i,a=sc.ball[Math.min(n-1,i)],b=sc.ball[Math.min(n-1,i+1)];
    if(!a) return null; return b?lerp3(a,b,u):a;}
  // the server's toss: whoever's first segment is a serve (you or them)
  let who=null,serve=null;
  for(const w of ["you","opp"]){const s0=sc.actors[w]&&sc.actors[w].find(s=>!s.hold); if(s0&&s0.clip.startsWith("serve")&&(!serve||s0.start<serve.start)){who=w;serve=s0;}}
  if(!serve) return null;
  const rel=serve.start+tossInfo(serve.clip).releaseLocal-1, pc=sc.ball[f0];
  const hand=g2=>{const a=actorAt(sc,who,g2);return add(a.pose[I.wristL],[0,0,0.07]);};
  if(g<=rel) return hand(g);
  const p0=hand(rel), T=(f0-rel)/100, tt=(g-rel)/100, vz=(pc[2]-p0[2]+4.905*T*T)/T;
  return [lerp(p0[0],pc[0],tt/T),lerp(p0[1],pc[1],tt/T),p0[2]+vz*tt-4.905*tt*tt];
}

/* ---------- cameras ---------- */
const CAMS=[
  {n:"Broadcast",c:{az:-90,el:24,d:31,fov:31,tgt:[0,-1.7,0]},phone:{az:-90,el:26,d:42,fov:21.5,tgt:[0,-1.4,0]}},
  {n:"Behind you",follow:true},
  {n:"Side",c:{az:0,el:17,d:31,fov:44,tgt:[0,0,0.4]}},
  {n:"Overhead",c:{az:-90,el:79,d:38,fov:40,tgt:[0,0,0]}},
  {n:"Their view",c:{az:90,el:15,d:23,fov:44,tgt:[0,-3,0.4]}}
];
let camI=0;
const NARROW=matchMedia("(max-width:600px)"), PHONE_VH=540, PHONE_CYF=0.489, PHONE_FOV=0.8;
// Full screen on a phone: the stage takes the screen's shape, and fixed cameras zoom so the court fills it
function fitFull(){window.__pc=null; const tall=!isFull()&&TALL; if(!isFull()&&!tall) return; const C=camI===0&&LESSON.cam0?{...CAMS[0],...LESSON.cam0}:CAMS[camI];
  if(window.__camOverride&&!tall) return;
  const choosing=C.follow&&showTargets&&!answered;   // the lifted choosing view (and a lesson's own ask camera) fit the whole court instead
  if(tall&&(window.__camOverride||choosing)){/* court fit, below */}
  else if(camI===0&&LESSON.closeUp){const s=Math.min(VH/PHONE_VH,1.6); FOCAL*=s; window.__pc=[VW/2, VH/2]; return;}   // a close-up keeps its framing, just bigger
  else if(C.follow){const s=Math.min(VH/PHONE_VH,1.75); FOCAL*=s; window.__pc=[VW/2, VH-(PHONE_VH*(1-PHONE_CYF))*s*0.92]; return;}   // tall screen: zoom in, keep the lower part of the picture on screen
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
  for(const X of [-5.5,5.5]) for(const Y of [-14.2,14.2]) for(const Z of [0,2.0]){const q=toCam([X,Y,Z]); if(q.z<=ZNEAR) return;
    const u=q.x/q.z, v=q.y/q.z; x0=Math.min(x0,u);x1=Math.max(x1,u);y0=Math.min(y0,v);y1=Math.max(y1,v);}
  FOCAL=Math.min(VW*0.96/(x1-x0), VH*0.94/(y1-y0));
  window.__pc=[VW/2-FOCAL*(x0+x1)/2, VH/2+FOCAL*(y0+y1)/2];}
// Keep the lifted choosing view's players, contact and answer targets inside the frame.
function fitChoosing(you,opp){
  if(!showTargets||answered||window.__camOverride) return;
  const C=camI===0&&LESSON.cam0?{...CAMS[0],...LESSON.cam0}:CAMS[camI];
  if(!C.follow) return;
  const points=[];
  for(const a of [you,opp]) if(a){points.push(...a.pose,a.rq.centre,add(a.pose[I.head],[0,0,0.42]));}
  const nt=nT(showTargets), lands=[...LETTERS].slice(0,nt).map(X=>SC[showTargets+X].info.shot.land), dx=[0,0,0,0];
  for(let a=0;a<nt;a++) for(let b=a+1;b<nt;b++) if(Math.hypot(lands[a][0]-lands[b][0],lands[a][1]-lands[b][1])<1.0){const s=lands[a][0]<=lands[b][0]?1:-1;dx[a]-=0.45*s;dx[b]+=0.45*s;}
  lands.forEach((p,i)=>points.push([p[0],p[1],0.006],[p[0]+dx[i],p[1],0]));
  const ball=ballAt(SC[scene],t);if(ball)points.push(ball);
  const q=points.map(toCam);if(!q.length||q.some(p=>p.z<=ZNEAR||![p.x,p.y,p.z].every(Number.isFinite)))return;
  const us=q.map(p=>p.x/p.z),vs=q.map(p=>p.y/p.z),u0=Math.min(...us),u1=Math.max(...us),v0=Math.min(...vs),v1=Math.max(...vs);
  if(u1-u0<1e-6||v1-v0<1e-6)return;
  const left=48,right=48,top=isFull()?140:48,bottom=isFull()?48:110;
  const width=VW-left-right,height=VH-top-bottom;if(width<=0||height<=0)return;
  FOCAL=Math.min(FOCAL,width/(u1-u0),height/(v1-v0));
  window.__pc=[left+width/2-FOCAL*(u0+u1)/2,top+height/2+FOCAL*(v0+v1)/2];
}
function fullView(){ if(isFull()){TALL=false;const r=$("stage").getBoundingClientRect(); if(r.width>0){VH=Math.round(VW*r.height/r.width); svg2.setAttribute("viewBox",`0 0 ${VW} ${VH}`);}} else {fitView();tallView();}}
// Phone, not full screen: the stage grows into the height the decision zone doesn't need, so nothing is left empty under
// the options. Reserve = the answered zone (your pick, the feedback card, Next), so Next still fits without scrolling.
let TALL=false; const ZONE_RESERVE=252, TALL_MAX=1.7;
function tallView(){TALL=false; if(!NARROW.matches||isFull()) return;
  const st=$("stage").getBoundingClientRect(); if(!st.width) return;
  const ink=$("inkRow").getBoundingClientRect().height, sh=getComputedStyle(document.querySelector(".shell"));
  const reserve=Math.max(ZONE_RESERVE, $("verdict").hidden?0:$("ask").getBoundingClientRect().height+2);
  const base=st.width*PHONE_VH/VW, avail=innerHeight-(st.top+scrollY)-ink-reserve-parseFloat(sh.paddingBottom||0);
  const h=Math.max(base,Math.min(avail,base*TALL_MAX)); VH=Math.round(VW*h/st.width); TALL=VH>PHONE_VH+4;
  svg2.setAttribute("viewBox",`0 0 ${VW} ${VH}`);}
function fitView(){VH=NARROW.matches?PHONE_VH:470;CYF=NARROW.matches?PHONE_CYF:0.55;
  // phone: the cue rail moves into the ink strip (they take turns), the tools float on the stage
  const r=$("rail"); if(NARROW.matches){if(r.parentNode.id!=="inkRow")$("inkRow").prepend(r);} else if(r.parentNode.id==="inkRow") $("tools").prepend(r);svg2.setAttribute("viewBox",`0 0 ${VW} ${VH}`);}
function serveMix(){const sc=SC[scene]; if(!sc) return 0; const W=prep(sc)["you"]; if(!W) return 0;
  for(const w of W){if(w.fixed||!w.s.clip.startsWith("serve")) continue; const a=w.s.start+20, b=w.cG+35;
    if(t>a-40&&t<b+40) return smooth(a-40,a,t)*(1-smooth(b,b+40,t));}
  return 0;}
function setCamera(you){
  if(window.__camOverride){const O=window.__camOverride, c=NARROW.matches&&O.phone?O.phone:O.c; cam={...c,tgt:[...c.tgt]}; if(NARROW.matches&&!O.phone) cam.fov*=(window.__fovScale||PHONE_FOV); return;}
  const C=camI===0&&typeof LESSON!=="undefined"&&LESSON.cam0?{...CAMS[0],...LESSON.cam0}:CAMS[camI];   // a lesson played deep behind the baseline can widen the broadcast view
  if(C.follow&&showTargets&&!answered&&!window.__camOverride){const V=NARROW.matches?{az:-90,el:44,d:40,fov:24,tgt:[0,0.2,0]}:{az:-90,el:40,d:30,fov:36,tgt:[0,0.8,0]}; cam={...V,tgt:[...V.tgt]}; return;}   // choosing: lift up so the targets can be told apart
  if(C.follow&&you){const h=you.pose[I.hips], ph=NARROW.matches;cam={az:-90,el:ph?13:11,d:ph?11:12,fov:50,tgt:[h[0]*0.7,h[1]+(ph?3.3:4.5),0.9]};   // a phone is taller: keep you higher in the frame
    // while you serve, pull back and up so the toss and the whole body stay in view
    if(typeof isFull==='function'&&isFull()&&VH>VW){cam.el+=12;cam.d+=3;}   // tall full screen: look down more, so the court fills the height
    const s=serveMix(); if(s>0){cam.az+=16*s;cam.el+=13*s;cam.d+=1*s;cam.tgt=[cam.tgt[0]*(1-s)+h[0]*s,cam.tgt[1]-2.0*s,0.9+0.8*s];}}   // from behind and to the right, so the body doesn't hide the toss
  else if(NARROW.matches&&C.phone){cam={...C.phone,tgt:[...C.phone.tgt]};return;}
  else cam={...C.c,tgt:[...C.c.tgt]};
  if(NARROW.matches&&!C.follow) cam.fov*=(window.__fovScale||PHONE_FOV);   // the follow camera is already tight: keep its full view on a phone
}


/* ---------- lesson content ---------- */
/* LESSON is supplied by the page */
const LETTERS="ABCD", mode="daily";
const NS=()=>LESSON.steps.length;   // 3 for a lesson; a branching point has as many reads as the path you play; a weekend point has 5
const nT=k=>[...LETTERS].filter(X=>SC[k+X]).length;   // options with a scene (a branch node can have 2 or 3)
if(LESSON.branch) LESSON.steps=[LESSON.nodes[LESSON.branch]];
function dotsOf(key){return SC[key]&&SC[key].info.dots||null;}
function endLabel(key){const ms=SC[key].marks, m=ms[ms.length-1]; if(!m)return "";
  const t=m.kind==="net"?"INTO THE NET":m.kind==="out"?"OUT · "+m.label:m.label; return t.charAt(0)+t.slice(1).toLowerCase();}

/* ---------- state ---------- */
let showDots=false, step=0, scene=null, t=0, stopAt=0, onStop=null, playing=false, lastTs=null;
let ans=[null,null,null], chosen=null, answered=false, showTargets=null, revealPattern=false, railOn=-1, done=false;
const svg2=$("svg"), zone=$("ask");

let stopTimer=null, stopGeneration=0, pendingStop=null;
function run(key,from,stop,cb){
  clearTimeout(stopTimer);stopTimer=null;pendingStop=null;stopGeneration++;
  scene=key;t=from;stopAt=Math.min(stop,SC[key].frames-1);onStop=cb;setPlaying(true);
}
function setPlaying(p){playing=p;lastTs=null;$("paused").hidden=p||t>=stopAt;
  const i=$("playIcon"); if(i){const pl=p&&t<stopAt; i.innerHTML=pl?PAUSE_I:PLAY_I; $("playBtn").setAttribute("aria-label",pl?"Pause":"Play");}}
const PAUSE_I='<path d="M9 5.5v13M15 5.5v13"/>', PLAY_I='<path d="M8 5.5l11 6.5-11 6.5z"/>';
function rate(){const sc=SC[scene];let r=1;
  for(const c of contactsOf(sc,"you")) r=Math.min(r,0.3+0.7*smooth(6,28,Math.abs(t-c)));
  if(onStop) r*=0.45+0.55*smooth(0,45,stopAt-t);
  return r;}
/* sound (5 Oct): the app shell loads GSSfx; standalone pages have none and stay silent.
   Your hits are loud, theirs softer; every bounce pops; a ball into the net thuds. */
function sfxEvents(sc){if(sc._sfx)return sc._sfx;const ev=[];
  for(const f of contactsOf(sc,"you"))ev.push([f,"hit",1]); for(const f of contactsOf(sc,"opp"))ev.push([f,"hit",0.5]);
  const B=sc.ball;for(let i=1;i+1<B.length;i++){const a=B[i-1],b=B[i],c=B[i+1];if(a&&b&&c&&b[2]<0.08&&b[2]<=a[2]&&b[2]<c[2])ev.push([i,"bounce",b[1]<0?0.9:0.45]);}
  for(const m of sc.marks||[])if(m.kind==="net")ev.push([m.frame,"net",0.8]);
  return sc._sfx=ev;}
function sfxCross(a,b){if(!window.GSSfx||b<=a||b-a>40)return;const sc=SC[scene];if(!sc)return;
  for(const [f,k,v] of sfxEvents(sc))if(f>a&&f<=b){const q=sc.ball[f]||sc.ball[f-1];
    GSSfx[k](v,q?clamp(q[0]/7,-1,1)*(cam&&cam.az>0?-1:1):0,q?clamp((q[1]+12)/24,0,1):0.5);}}
/* premium payoff (8 Oct): after a right answer, the moment it's decided plays in slow motion: the last 0.5 s
   before the ending lands, at a third of the speed */
function slowMo(g){
  if(!PREM()||!answered||!chosen||mode!=="daily"||step>=NS()) return 1;
  const S=LESSON.steps[step]; if(!S||!scene.startsWith(S.scene)) return 1;
  const ok=LETTERS.indexOf(chosen)===S.correct||(S.alsoOk||[]).includes(LETTERS.indexOf(chosen)); if(!ok) return 1;
  const ms=SC[scene].marks, end=ms.length?ms[ms.length-1].frame:null; if(end==null) return 1;
  return g>end-50&&g<end+8?0.34:1;
}
function tick(ts){
  if(window.GSSfx){const pr=PREM(); if(GSSfx.premium!==pr) GSSfx.premium=pr; if(pr&&GSSfx.ready&&GSSfx.ready()&&!window.__gsBed){window.__gsBed=1;GSSfx.ambience(true);}}
  if(playing){if(lastTs!=null){const t0=t;t+=Math.min(50,ts-lastTs)*0.1*rate()*(window.__speed||1)*slowMo(t);
      if(t>=stopAt)t=stopAt; sfxCross(t0,t);
      if(t>=stopAt){t=stopAt;setPlaying(false);const cb=onStop;onStop=null;
        if(cb){pendingStop=cb;const generation=stopGeneration;
          stopTimer=setTimeout(()=>{if(generation!==stopGeneration)return;stopTimer=null;pendingStop=null;cb();},220);}}}
    lastTs=ts;}
  render(); requestAnimationFrame(tick);
}

/* ---------- the visual card ---------- */
function railFor(S){return S.rail||(S.cues?["1 "+S.cues.ball,"2 You "+S.cues.you,"3 Them "+S.cues.opp]:[S.name]);}
function paintRail(list){$("rail").innerHTML=list.map(c=>`<span>${c}</span>`).join("");railOn=-1;setRail(0);}
function setRail(n){if(n===railOn)return;railOn=n;[...$("rail").children].forEach((s,i)=>s.classList.toggle("on",i<n));}
function setInk(txt,miss){const s=$("ink");s.className="";s.textContent=txt||"";s.parentNode.classList.toggle("has",!!txt);if(!txt)return;void s.offsetWidth;s.className="on"+(miss?" miss":"");}
let toastT=0;
function toast(txt){const e=$("toast");e.textContent=txt;e.classList.add("on");clearTimeout(toastT);toastT=setTimeout(()=>e.classList.remove("on"),1300);}
function stageInView(){const r=$("viewer").getBoundingClientRect();
  if(r.top<0||r.top>innerHeight*0.45) window.scrollTo({top:scrollY+r.top-72,behavior:"smooth"});}

/* ---------- the decision zone ---------- */
function paintAsk(S){
  $("askQ").textContent=S.q; const box=$("askOpts"); box.replaceChildren();
  S.opts.forEach((txt,i)=>{const b=document.createElement("button");b.className="opt";b.disabled=true;
    b.innerHTML=`<span class="l">${LETTERS[i]}</span><span>${txt}</span>`;b.onclick=()=>pick(LETTERS[i]);box.appendChild(b);});
  zone.hidden=false; zone.classList.add("reading"); zone.classList.remove("on","ans");
  $("verdict").hidden=true; $("verdict").innerHTML="";
}
let sitT=[];
function typeSit(html,done,wps){sitT.forEach(clearTimeout);sitT=[]; const el=$("sitTx");
  const words=String(html).split(/\s+/).filter(Boolean); el.innerHTML=words.map(w=>`<span class="w">${w}</span>`).join(" ");
  const sp=[...el.querySelectorAll(".w")], dt=1000/(wps||5.5);
  sp.forEach((s,k)=>sitT.push(setTimeout(()=>s.classList.add("on"),k*dt)));
  if(done) sitT.push(setTimeout(done,sp.length*dt+150));}
function enableAsk(){
  if(isFull()) exitFull();
  zone.classList.remove("reading"); zone.classList.add("on");
  $("askOpts").querySelectorAll(".opt").forEach(b=>{b.disabled=false;b.className="opt";});
}
let pick=()=>{};
function optEl(X){return $("askOpts").children[LETTERS.indexOf(X)];}
function showOnly(list){$("askOpts").querySelectorAll(".opt").forEach((b,i)=>{b.disabled=true;b.classList.toggle("hide",!list.includes(LETTERS[i]));});}

/* ---------- lesson flow ---------- */
const CUE_KEY="gs_my_game";   // saved cues: [{lesson, cue, saved_at, callback_tags}] for a later callback
function myGame(){try{return JSON.parse(localStorage.getItem(CUE_KEY)||"[]");}catch(e){return [];}}
function cueSaved(){return myGame().some(c=>c.cue===LESSON.cue);}
function saveCue(){try{const g=myGame(); g.push({lesson:LESSON.title,cue:LESSON.cue,saved_at:Date.now(),callback_tags:LESSON.callbackTags||[]}); localStorage.setItem(CUE_KEY,JSON.stringify(g));}catch(e){}}
const emit=(n,d)=>{try{window.GSApp&&GSApp.emit(n,d);}catch(e){}};   // the app shell listens; standalone pages ignore it
function startStep(i){emit('step',{i}); clearTimeout(window.__flowT);
  step=i; chosen=null; answered=false; showTargets=null; revealPattern=false; showDots=false; done=false;
  $("wrapup").hidden=true; setInk("");
  if(i>=NS()){finishLesson();return;}
  const S=LESSON.steps[i];
  $("count").textContent=LESSON.branch?`Shot ${i+1}`:`${i+1} of ${NS()}`;
  let ready=0; const go=()=>{if(step===i&&!answered&&++ready===2) enableAsk();};   // both: the situation read in, and the play at the decision
  typeSit(S.sit,go);
  paintRail(railFor(S)); paintAsk(S); tallView();
  pick=X=>choose(i,X,false);
  const key=S.reveal?S.scene:S.scene+"A", fr=SC[key].info.freeze;
  const fr0=LESSON.branch&&SC[S.scene]&&SC[S.scene].info.from!=null?SC[S.scene].info.from:SC[key].info.from||0;
  run(key,fr0,fr,()=>{ if(!S.reveal&&!S.noTargets) showTargets=S.scene; go(); });   // a later read in one point starts near its decision
}
// Play one option out. demo = watching the better option after a miss (the first answer still counts).
function choose(i,X,demo){
  const S=LESSON.steps[i];
  if(!demo&&ans[i]==null){ans[i]=X;emit('answer',{i,X,ok:LETTERS.indexOf(X)===LESSON.steps[i].correct||(LESSON.steps[i].alsoOk||[]).includes(LETTERS.indexOf(X))});
    if(LESSON.branch){const k=S.scene+X, nx=LESSON.nodes[k];   /* nodes are keyed by the pick that leads to them */ LESSON.steps.length=i+1; if(nx) LESSON.steps.push(nx); LESSON.finaleScene=k;}}   // your real pick decides where the point goes
  chosen=X; answered=true; zone.classList.remove("on"); showOnly([X]); setRail(3); setInk("");
  $("verdict").hidden=true;
  if(S.reveal){showDots=true;if(S.pattern)revealPattern=true;verdict(i,X,demo);return;}
  showDots=!!LESSON.tenTries;
  const key=S.scene+X, fr=SC[key].info.freeze;
  run(key,demo?Math.max(0,fr-45):t,SC[key].frames-1,()=>verdict(i,X,demo));
  stageInView();
}
function verdict(i,X,demo){
  const S=LESSON.steps[i], also=(S.alsoOk||[]).includes(LETTERS.indexOf(X)), ok=LETTERS.indexOf(X)===S.correct||also, corr=LETTERS[S.correct];
  const d=dotsOf(S.reveal?S.scene:S.scene+X), n=d?d.filter(x=>x[2]).length:0;
  if(PREM()&&!demo){if(ok) window.__cheerT=performance.now()/1000;
    if(window.GSSfx&&GSSfx.applause){const sk=SC[S.reveal?S.scene:S.scene+X]; GSSfx.applause(ok?(sk&&sk.info.outcome==="won"?1:0.6):0);}}
  showOnly(ok||demo?[X]:[X,corr]);
  optEl(X).classList.add(ok?"right":"wrong"); if(!ok&&!demo) optEl(corr).classList.add("right");
  setInk(ok||S.reveal?S.unlock:endLabel(S.scene+X),!ok&&!S.reveal);
  /* a point (LESSON.flow): a right answer flows on, one line and straight into the next shot; a miss still stops and explains */
  if(LESSON.flow&&ok&&!also&&!demo&&!S.reveal&&i<NS()-1){
    const v=$("verdict"); zone.classList.add("ans");
    v.innerHTML=`<div class="fb flow" role="status"><div class="copy">${S.lines[X]}</div></div>`; v.hidden=false; tallView();
    clearTimeout(window.__flowT); window.__flowT=setTimeout(()=>{if(step===i&&answered)startStep(i+1);},1800);
    return;}
  const lab=demo?`Option ${X}`:also?`Also works · best: ${corr}`:ok?"Good read":`Better: ${corr}`;
  const v=$("verdict");
  zone.classList.add("ans");
  v.innerHTML=`<div class="fb${ok?"":" miss"}"><div class="fbh"><div class="lab">${lab}</div>${d?`<div class="tries ${n>=9?"good":n>=7?"mid":"bad"}">In ${n} of 10 tries</div>`:""}<button class="why" id="why" aria-expanded="false" aria-controls="whyp">Why? <span aria-hidden="true">+</span></button></div>
      <div class="copy">${S.lines[X]}</div>
      <div class="prin">${S.take}</div>
      <div class="whyp" id="whyp" hidden><p>${S.payoff}</p><p>${S.principle}</p><p>${S.why}</p></div></div>
    <div class="acts">${S.reveal?"":`<button class="alt" id="tryOther">${ok||demo?"Try another":`Watch ${corr} play out`}</button>`}
    <button class="next" id="next">${i<NS()-1?"Next decision →":LESSON.branch?"Watch your point →":"Take it to court →"}</button></div>`;
  v.hidden=false; tallView();
  $("why").onclick=()=>{const p=$("whyp"),o=p.hidden;p.hidden=!o;$("why").setAttribute("aria-expanded",o);$("why").innerHTML=`Why? <span aria-hidden="true">${o?"–":"+"}</span>`;};
  $("next").onclick=()=>{startStep(i+1);window.scrollTo({top:0,behavior:"smooth"});};
  if(!S.reveal) $("tryOther").onclick=()=>{
    if(!ok&&!demo){choose(i,corr,true);return;}
    const key=S.reveal?S.scene:S.scene+"A", fr=SC[key].info.freeze;
    chosen=null; answered=false; showDots=false; setInk(""); paintAsk(S); pick=Y=>choose(i,Y,true);
    if(!S.reveal&&!S.noTargets) showTargets=S.scene;
    run(key,Math.max(0,fr-60),fr,enableAsk); stageInView();};
}
function payoffHTML(p){   // Pro Lens shows open; the stroke and the drill sit in toggles so the lesson ends light; with none to offer, the take-home stays readable
  const T=(k,label,body)=>`<details class="pay" data-k="${k}"${k==="pro"?" open":""}><summary><span class="k">${label}</span><span class="pl">+</span></summary><div class="pbody">${body}</div></details>`;
  let h="";
  const take=`<div class="blk"><div class="k">Take it to court</div><p><b>${LESSON.tomorrow}</b></p></div>`;
  if(!p) h+=take;   // no credible story: the take-home stays readable
  if(p) h+=T("pro",`Pro Lens · ${p.label||p.player}`,`<p>${p.moment}</p><p><b>${p.read}</b></p><p class="src">Source: <a href="${p.url}" target="_blank" rel="noopener">${p.src}</a></p>`);
  const st=LESSON.stroke;
  if(st) h+=T("stroke",`The stroke · ${st.title}`,`<div class="strip"><span></span>${st.cols.map(c=>`<span class="ch">${c}</span>`).join("")}
      ${st.rows.map(r=>`<span class="rh">${r.name}</span>${r.imgs.map((u,n)=>`<img src="${u}" alt="${r.name}: ${st.cols[n]}">`).join("")}`).join("")}</div>
      ${st.cues.map(c=>`<p><b>${c[0]}</b> ${c[1]}</p>`).join("")}${st.pro?`<p class="src">${st.pro}</p>`:""}`);
  if(LESSON.drill) h+=T("drill",`Coach's Corner · ${LESSON.drill.name}`,`<p>${LESSON.drill.how}</p>`);

  return `<div class="pays">${h}</div>`;
}
function finishLesson(){
  done=true; const okA=(a,i)=>a!=null&&(LETTERS.indexOf(a)===LESSON.steps[i].correct||(LESSON.steps[i].alsoOk||[]).includes(LETTERS.indexOf(a)));
  const A=ans.slice(0,NS()), n=A.filter(okA).length; emit('complete',{n});
  sitT.forEach(clearTimeout); $("count").textContent="Done"; $("sitTx").innerHTML=LESSON.hook;
  zone.hidden=true; paintRail([]); setInk(LESSON.branch?(SC[LESSON.finaleScene].info.outcome==="won"?"You built the winner":`${n} of ${A.length} read right`):`${n} of ${NS()} read right`,false);
  const w=$("wrapup"), p=LESSON.pro;
  w.innerHTML=`<div class="blk" style="border:0;margin:14px 0 0;padding:0"><div class="k">Remember</div><div class="mem">${LESSON.memHTML}</div>
      <div class="score3">${A.map((a,i)=>`<i class="${a==null?"":okA(a,i)?"ok":"no"}"></i>`).join("")}</div></div>
    ${payoffHTML(p)}
    ${LESSON.cue?`<div class="cuebox"><div class="k">Your cue</div><div class="cue">${LESSON.cue}</div>
      <button class="savecue" id="saveCue">${cueSaved()?"Saved to My Game ✓":"Save to My Game"}</button></div>`:""}
    <button class="next" id="redo">${LESSON.redoLabel||"Start the lesson again"}</button>`;
  w.hidden=false; w.querySelectorAll("details.pay").forEach(d=>{let first=d.open; d.addEventListener("toggle",()=>{if(first){first=false;return;} if(d.open)emit('payoff_open',{k:d.dataset.k});});});   // only opens the player makes: Pro Lens starts open
  const sc=$("saveCue"); if(sc){if(cueSaved())sc.classList.add("on");
    sc.onclick=()=>{if(cueSaved())return; saveCue(); sc.textContent="Saved to My Game ✓"; sc.classList.add("on"); emit('cue_save',{lesson:LESSON.title,cue:LESSON.cue});};}
  $("redo").onclick=()=>{ans=[null,null,null];if(LESSON.branch)LESSON.steps=[LESSON.nodes[LESSON.branch]];startStep(0);window.scrollTo({top:0,behavior:"smooth"});};
  {const k=LESSON.finaleScene;run(k,LESSON.finaleFull?0:Math.max(0,SC[k].info.freeze-40),SC[k].frames-1,null);}
}

/* ---------- render ---------- */
function render(){
  const sc=SC[scene], g=t, you=actorAt(sc,"you",g), opp=actorAt(sc,"opp",g);
  setCamera(you); buildBasis(); fitFull(); fitChoosing(you,opp);
  const frag=document.createDocumentFragment(); drawCourt(frag);
  // last point's reply, as evidence
  if(scene==="daily1"){const E=sc.info.evidence;for(let i=1;i<E.length;i++){if(E[i][2]<0.02&&i<E.length-1)continue;
      seg(frag,E[i-1],E[i],"rgba(240,236,227,.5)",1.4,.55);}
    const e=E[E.length-1];ring(frag,[e[0],e[1],0.006],0.16,0.12,"rgba(240,236,227,.7)",1.4,.8);
    label(frag,[e[0],e[1],0],"LAST POINT","rgba(240,236,227,.8)",14,.9,-18);}
  const St0=mode==="daily"&&step<NS()?LESSON.steps[step]:null, fz0=St0&&scene.startsWith(St0.scene)?SC[scene].info.freeze:null;
  const cueOnEarly=fz0!=null&&St0.cues&&g>=fz0-3&&g<=fz0+10;
  // a puff of grass and chalk where the ball lands (premium)
  if(PREM()) for(const [f,k] of sfxEvents(sc)) if(k==="bounce"&&g>=f&&g<f+28){const q=sc.ball[f]; if(!q) continue; const a=(g-f)/28;
    for(let i=0;i<7;i++){const an=i/7*6.283+f, rr=0.06+0.32*a, pz=0.02+0.22*a*(1-a)*(1+(i%3)*0.4);
      const pp=P([q[0]+Math.cos(an)*rr,q[1]+Math.sin(an)*rr*0.6,pz]); if(!pp) continue;
      frag.appendChild(el_("circle",{cx:pp.s[0].toFixed(1),cy:pp.s[1].toFixed(1),r:Math.max(0.6,FOCAL*0.018/pp.z).toFixed(1),fill:i%2?"#f3f0e2":"#b9c98a",opacity:(0.7*(1-a)).toFixed(2)}));}}
  // bounces and landings
  for(const m of sc.marks){if(g<m.frame)continue;const age=g-m.frame, p=[m.pos[0],m.pos[1],0.006];
    const fin=m.kind==="land"||m.kind==="reply"||m.kind==="out"||m.kind==="rally"||m.kind==="contact";
    const col=m.kind==="net"||m.kind==="out"?"var(--warn)":m.kind==="reply"?"#9fb8d6":(m.kind==="rally"||m.kind==="contact")?"#f0ece3":fin?"var(--accent)":"var(--ball)";
    const txtCol=m.kind==="out"?"#f08a8a":m.kind==="reply"?"#c9d8ea":(m.kind==="rally"||m.kind==="contact")?"#f0ece3":fin?"#c8a84b":"#f0ece3";
    if(m.kind!=="net"){ring(frag,p,0.1+0.26*smooth(0,14,age),0.08+0.2*smooth(0,14,age),col,1.6,fin?0.95:0.35+0.4*(1-smooth(60,160,age)));
      if(fin) ring(frag,p,0.1,0.075,"none",0,.9,col);}
    const show=fin||age<130||(revealPattern&&m.label==="SHORT MIDDLE");
    const txt=revealPattern&&m.label==="SHORT MIDDLE"?"SHORT MIDDLE \u00d7"+"2":m.kind==="out"?"OUT \u00b7 "+m.label:m.label;
    if(show&&m.label&&m.kind!=="net"&&!(cueOnEarly&&!fin)) label(frag,[m.pos[0],m.pos[1],0],txt,txtCol,fin?18:15,fin?1:1-smooth(90,130,age)*(revealPattern?0:1));}
  // evidence from earlier points: faint landing rings, one label
  if(sc.info.ghosts){let cx=0,cy=0;const G=sc.info.ghosts;
    for(const [x,y,l] of G){cx+=x/G.length;cy+=y/G.length;ring(frag,[x,y,0.006],0.22,0.17,sc.info.ghostCol||"rgba(240,236,227,.55)",1.4,.8);
      if(l&&g<=(sc.info.ghostUntil??sc.info.freeze+20)) label(frag,[x,y+(y<0?-1.0:-1.1),0],l,"rgba(240,236,227,.85)",13,.9,0);}
    if(sc.info.ghostLabel&&g<=(sc.info.ghostUntil??sc.info.freeze+20)) label(frag,[cx,cy+(cy<0?-1.4:-1.4),0],sc.info.ghostLabel,"rgba(240,236,227,.85)",14,.9,0);}
  // ten tries of the chosen plan: where they land
  const DT=sc.info.dots;
  if(showDots&&DT){const nx=sc.marks.find(m=>m.frame>sc.info.freeze), t0=nx?nx.frame:sc.info.freeze;
    if(g>=t0){const a=smooth(0,25,g-t0);
      let cx=0,cy=0;for(const [x,y,ok] of DT){cx+=x/DT.length;cy+=y/DT.length;
        ring(frag,[x,y,0.008],0.2,0.16,ok?"#7fbf7a":"#e05252",1.8,.95*a,ok?"rgba(127,191,122,.55)":"rgba(224,82,82,.55)");}
      const n=DT.filter(d=>d[2]).length; label(frag,[cx,cy-(cy>0?2.8:-2.8),0],`${n} OF 10 IN`,n>=9?"#9fd89a":n>=7?"#c8a84b":"#f08a8a",19,a,0);}}
  // decision targets
  if(showTargets){const nt=nT(showTargets), L=[...LETTERS].slice(0,nt).map(X=>SC[showTargets+X].info.shot.land), dx=[0,0,0,0];
    for(let a=0;a<nt;a++)for(let c=a+1;c<nt;c++)if(Math.hypot(L[a][0]-L[c][0],L[a][1]-L[c][1])<1.0){const s=L[a][0]<=L[c][0]?1:-1;dx[a]-=0.45*s;dx[c]+=0.45*s;}   // keep close letters apart
    for(let k=0;k<nt;k++){const X=LETTERS[k], p=[L[k][0],L[k][1],0.006], on=chosen===X;
      if(chosen&&!on) continue;
      ring(frag,p,0.34,0.28,on?"var(--accent)":"rgba(240,236,227,.6)",on?2:1.3,on?.95:.75);
      label(frag,[p[0]+dx[k],p[1],0],X,on?"#c8a84b":"#f0ece3",19,1,6);}}
  // Predict the Point: the picks so far, stitched on court as shot tracers
  if(window.__trail) for(const tr of window.__trail){const a=Math.min(1,(performance.now()-tr.t0)/1000), e=a*a*(3-2*a), n=40, pts=[];
    const at=u=>[lerp(tr.from[0],tr.to[0],u),lerp(tr.from[1],tr.to[1],u),lerp(tr.h,0.02,u)+1.6*u*(1-u)*tr.arc];
    for(let k=0;k<=Math.round(n*e);k++) pts.push(at(k/n));
    // a tracer: bright near its head, fading behind it; once it lands it settles to a steady line
    for(let k=1;k<pts.length;k++){const behind=(pts.length-1-k)/n, op=a<1?Math.max(0.18,1-behind*2.2):.85;
      seg(frag,pts[k-1],pts[k],tr.col,a<1?2.8:2.2,op);}
    if(a<1&&pts.length){const hd=P(pts[pts.length-1]); if(hd){frag.appendChild(el_("circle",{cx:hd.s[0].toFixed(1),cy:hd.s[1].toFixed(1),r:9,fill:tr.col,opacity:.25}));
      frag.appendChild(el_("circle",{cx:hd.s[0].toFixed(1),cy:hd.s[1].toFixed(1),r:3.6,fill:"#fff8dc"}));}}
    if(a>=1){ring(frag,[tr.to[0],tr.to[1],0.006],0.34,0.28,tr.col,2,.95);label(frag,[tr.to[0],tr.to[1],0],tr.X,tr.col,19,1,6);}}
  // depth-sorted: net, bodies, ball
  const parts=[];
  parts.push({n:netGroup(),z:toCam([0,0,0.5]).z});
  if(PREM()) drawCourtside(parts);
  const shadow=(a,op)=>{if(!a)return;const x=(a.pose[I.ankleL][0]+a.pose[I.ankleR][0])/2,y=(a.pose[I.ankleL][1]+a.pose[I.ankleR][1])/2;
    ring(frag,[x,y,0.004],0.38,0.3,"none",0,op,"rgba(0,0,0,.35)");};
  if(PREM()){   // the whole body's shadow on the grass, along the light
    for(const a of [opp,you]) if(a){const sh=[], g=el_("g",{opacity:a===you?.3:.24});
      drawFigure(sh,shadowPose(a.pose),null,{ghost:true,col:"#04100a",op:1,fwd:a.fwd}); for(const {n} of sh) g.appendChild(n); frag.appendChild(g);}}
  else {shadow(you,1);shadow(opp,.8);}
  if(opp) drawFigure(parts,opp.pose,opp.rq,{kit:PREM()?OPP_PREM:OPPKIT,op:.95,fwd:opp.fwd});
  if(you){drawFigure(parts,you.pose,you.rq,PREM()?{kit:KIT_PREM,fwd:you.fwd,band:"#d9b24a",bandDk:"#8f7632"}:{fwd:you.fwd,band:"#e2bd4f",bandDk:"#8f7632"});
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
      const toss=g<firstBall(sc), rr=Math.max(toss?3.6:2.8,FOCAL*0.033/qb.z), zb=toss?qb.z-3:qb.z;   // the toss is drawn in front of the server so it can always be seen
      parts.push({n:el_("circle",{cx:qb.s[0].toFixed(1),cy:qb.s[1].toFixed(1),r:(rr*2.6).toFixed(1),fill:"var(--ball)",opacity:toss?.28:.18}),z:zb+0.01});
      parts.push({n:el_("circle",{cx:qb.s[0].toFixed(1),cy:qb.s[1].toFixed(1),r:rr.toFixed(1),fill:"var(--ball)",stroke:"#6f7d10","stroke-width":.6}),z:zb-0.02});}}
  parts.sort((a,b)=>b.z-a.z); for(const {n} of parts) frag.appendChild(n);
  const St=mode==="daily"&&step<NS()?LESSON.steps[step]:null, fz=St&&scene.startsWith(St.scene)?SC[scene].info.freeze:null;
  const cueOn=fz!=null&&St.cues&&g>=fz-3&&g<=fz+10;
  if(cueOn){const bb=ballAt(sc,g);
    if(bb){seg(frag,[bb[0],bb[1],0.01],bb,"var(--ball)",2,.9);seg(frag,[bb[0]-0.12,bb[1],0.01],[bb[0]+0.12,bb[1],0.01],"var(--ball)",2,.9);
      label(frag,[bb[0]+1.0,bb[1]-0.3,0],St.cues.ball,"#e8f27a",15,1,0);}}
  if(cueOn||!playing||g<160){const hp=a=>a&&add(a.pose[I.head],[0,0,0.42]);
    if(you) label(frag,hp(you),cueOn?"YOU \u00b7 "+St.cues.you:"YOU","#c8a84b",15,.95,0);
    if(opp) label(frag,hp(opp),cueOn?"THEM \u00b7 "+St.cues.opp:"THEM","#9fb8d6",15,.95,0);}
  // timing flashes: THEIR HIT / LAND / GO
  if(sc.info.flashes) for(const [f,who,txt] of sc.info.flashes){if(g<f||g>f+45)continue;const a=who==="you"?you:opp;if(!a)continue;
    label(frag,add(a.pose[I.head],[0,0,1.25]),txt,who==="you"?"#e8f27a":"#c9d8ea",18,1-smooth(30,45,g-f),0);}
  // net fault
  for(const m of sc.marks) if(m.kind==="net"&&g>=m.frame){const bp=sc.ball[m.frame]||b;if(bp){const q=P(bp);
    if(q)frag.appendChild(el_("circle",{cx:q.s[0].toFixed(1),cy:q.s[1].toFixed(1),r:(8+10*smooth(0,20,g-m.frame)).toFixed(1),fill:"none",stroke:"#e05252","stroke-width":2.2,opacity:1-0.5*smooth(0,30,g-m.frame)}));}}
  if(PREM()) lightOverlay(frag);
  svg2.replaceChildren(frag);
  {const sc2=$("scorechip"), v=sc.info.score||""; if(sc2.dataset.v!==v){sc2.dataset.v=v;sc2.hidden=!v;sc2.innerHTML=v?"YOU <b>"+v+"</b>":"";}}
  if(St&&fz!=null){const n=answered?3:[0,1,2].filter(k=>g>=fz-80+30*k).length;setRail(n);}
}

/* ---------- controls ---------- */
$("camBtn").onclick=()=>{camI=(camI+1)%CAMS.length;toast(CAMS[camI].n);};
$("stage").onclick=()=>{if(t<stopAt){setPlaying(!playing);}};
$("playBtn").onclick=()=>{if(t<stopAt) setPlaying(!playing); else $("again").click();};
$("again").onclick=()=>{
  if(done){const k=LESSON.finaleScene;run(k,LESSON.finaleFull?0:Math.max(0,SC[k].info.freeze-40),SC[k].frames-1,null);return;}
  const S=LESSON.steps[step];
  if(!answered){startStep(step);return;}   // restart both reading and playback gates together
  if(S.reveal) return;
  // Preserve feedback when Replay interrupts a choice, including the completion delay.
  const resume=onStop||pendingStop;
  const key=S.scene+chosen, fr=SC[key].info.freeze; run(key,Math.max(0,fr-60),SC[key].frames-1,resume);};
$("back").onclick=()=>{if(step>0&&!done){startStep(step-1);} else if(done){startStep(NS()-1);} else location.href=window.GS_HOME_URL||"./";};
if(window.GS_HOME_URL){const c=$("close");if(c)c.href=window.GS_HOME_URL;}
const FS_IN='<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
      FS_OUT='<path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5"/>';
const viewer=$("viewer");
function isFull(){return !!(document.fullscreenElement||document.webkitFullscreenElement||viewer.classList.contains("full"));}
function paintFs(){$("fsIcon").innerHTML=isFull()?FS_OUT:FS_IN;document.body.classList.toggle("noscroll",isFull());requestAnimationFrame(fullView);}
async function exitFull(){if(document.fullscreenElement)await document.exitFullscreen().catch(()=>{});viewer.classList.remove("full");paintFs();}
$("fsBtn").onclick=async()=>{
  if(isFull()){exitFull();return;}
  try{if(viewer.requestFullscreen)await viewer.requestFullscreen();else throw 0;}catch(e){viewer.classList.add("full");}
  paintFs();};
document.addEventListener("fullscreenchange",paintFs);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&viewer.classList.contains("full")){viewer.classList.remove("full");paintFs();}});
paintFs();
fitView();tallView();NARROW.addEventListener?.("change",()=>{fitView();tallView();});addEventListener("resize",()=>{if(isFull())fullView();else{fitView();tallView();}});

/* ---------- Predict the Point: answer every read first, then watch the whole point ---------- */
function setupPredict(){
  const P=LESSON.predict, K=P.scene; let savedTrail=null, typeT=[];
  let flowGeneration=0; const flowTimers=new Set();
  function later(fn,delay){const generation=flowGeneration;
    const timer=setTimeout(()=>{flowTimers.delete(timer);if(generation===flowGeneration)fn();},delay);
    flowTimers.add(timer);}
  function cancelFlow(){flowGeneration++;flowTimers.forEach(clearTimeout);flowTimers.clear();
    typeT.forEach(clearTimeout);typeT=[];
    clearTimeout(stopTimer);stopTimer=null;pendingStop=null;onStop=null;stopGeneration++;}
  // read the sentence in, a word at a time, so the eye follows it
  function typeIn(el,html,done,wps){typeT.forEach(clearTimeout);typeT=[];
    const words=html.split(/\s+/).filter(Boolean); el.innerHTML=words.map(w=>`<span class="w">${w}</span>`).join(" ");
    const spans=[...el.querySelectorAll(".w")], dt=1000/(wps||5.5);
    spans.forEach((s,k)=>typeT.push(setTimeout(()=>{s.classList.add("on");},k*dt)));
    if(done) typeT.push(setTimeout(done,spans.length*dt+150));}
  const readAt=P.reads.map(r=>typeof r==="string"?SC[r].info.freeze:r);
  // where you strike each of the three shots, on the best line
  const hitFrom=(()=>{const sc=SC[K], segs=(sc.actors.you||[]).filter(s=>!s.hold).map(s=>s.start+CL[s.clip].contactFrame-1);
    return segs.slice(0,3).map(f=>{const q=sc.ball[f]||sc.ball[f+1];return q?[q[0],q[1],q[2]]:[0,-11,1];});})();
  const okAt=i=>ans[i]!=null&&(LETTERS.indexOf(ans[i])===LESSON.steps[i].correct||(LESSON.steps[i].alsoOk||[]).includes(LETTERS.indexOf(ans[i])));
  startStep=function(i){
    cancelFlow();
    step=i; chosen=null; answered=false; showTargets=null; showDots=false; done=false;
    $("wrapup").hidden=true;
    if(i===3){watchPoint();return;}
    const S=LESSON.steps[i];
    $("count").textContent=`Read ${i+1} of 3`;
    paintRail(i===0?[P.intro||"Picture the point"]:LESSON.steps.slice(0,i).map((s,j)=>`${j+1} ${s.short}: ${ans[j]||"–"}`)); setInk(i===0?"Answer all three, then watch":"");
    paintAsk(S); zone.hidden=false; tallView();
    scene=K; t=readAt[0]; stopAt=t; setPlaying(false);
    window.__camOverride=P.askCam||null; if(i===0) savedTrail=null; window.__trail=(window.__trail||[]).slice(0,i); showTargets=S.scene;
    pick=X=>{ans[i]=X;emit('answer',{i,X,ok:okAt(i)}); optEl(X).classList.add("picked"); showOnly([X]); showTargets=null;
      const land=SC[S.scene+X].info.shot.land;
      window.__trail.push({from:hitFrom[i],to:land,h:hitFrom[i][2],arc:i===0?0.4:1,X,col:"#c8a84b",t0:performance.now()});
      later(()=>startStep(i+1),1700);};
    typeIn($("sitTx"),S.sit,enableAsk);   // the options open once the situation has been read in
  };
  function chip(k){const S=LESSON.steps[k],ok=okAt(k); typeIn($("sitTx"),(P.says&&P.says[k])||S.payoff,null,6);   // say what just happened const tr=savedTrail[k]; if(tr){window.__trail.push({...tr,col:ok?"#7fbf7a":"#e05252",t0:performance.now()});}
    setInk(ok?`Read ${k+1} · ${S.short}: you had it`:`Read ${k+1} · ${S.short}: you said ${ans[k]}, best is ${LETTERS[S.correct]}`,!ok);}
  function watchPoint(){
    window.__camOverride=null; savedTrail=(savedTrail&&savedTrail.length===3?savedTrail:(window.__trail||[])).map(x=>({...x})); window.__trail=[];   // redrawn read by read as the point plays
    zone.hidden=true; $("count").textContent="The point"; typeIn($("sitTx"),P.watch||"Now watch the point you pictured.");
    paintRail(LESSON.steps.map((s,j)=>`${j+1} ${s.short}`)); setInk(""); stageInView();
    let k=0;
    const next=()=>{
      if(k<readAt.length){const from=k?readAt[k-1]:0; run(K,from,readAt[k],()=>{chip(k);setRail(k+1);k++;later(next,1700);});}
      else run(K,readAt[readAt.length-1],SC[K].frames-1,()=>later(review,600));};
    next();
  }
  function review(){
    done=true; const n=[0,1,2].filter(okAt).length; typeT.forEach(clearTimeout); emit('complete',{n});
    sitT.forEach(clearTimeout); $("count").textContent="Done"; $("sitTx").innerHTML=LESSON.hook; setInk(`${n} of 3 read right`,false);
    const w=$("wrapup");
    w.innerHTML=`<div class="blk" style="border:0;margin:14px 0 0;padding:0"><div class="k">Remember</div><div class="mem">${LESSON.memHTML}</div>
      <div class="score3">${ans.map((a,i)=>`<i class="${okAt(i)?"ok":"no"}"></i>`).join("")}</div></div>
      ${LESSON.steps.map((S,i)=>{const X=ans[i],ok=okAt(i);return `<div class="review"><p class="rq">Read ${i+1} · ${S.q}</p>
        <p class="ra ${ok?"ok":"no"}">${ok?"✓":"✗"} You: ${S.opts[LETTERS.indexOf(X)]}</p><p>${S.lines[X]}</p>
        ${ok?"":`<p><b>Best: ${S.opts[S.correct]}.</b> ${S.payoff}</p><button class="alt" data-watch="${i}">Watch your choice play out</button>`}</div>`;}).join("")}
      <div class="blk"><div class="k">Take it to court</div><p><b>${LESSON.tomorrow}</b></p></div>
      <button class="next" id="redo">${LESSON.redoLabel||"Play again"}</button>`;
    w.hidden=false;
    w.querySelectorAll("[data-watch]").forEach(bt=>bt.onclick=()=>{const i=+bt.dataset.watch,key=LESSON.steps[i].scene+ans[i],fr=SC[key].info.freeze;
      stageInView(); setInk(`Read ${i+1}: your choice`,true); run(key,Math.max(0,(SC[key].info.from||fr-60)),SC[key].frames-1,null);});
    $("redo").onclick=()=>{ans=[null,null,null];window.__trail=[];startStep(0);window.scrollTo({top:0,behavior:"smooth"});};
  }
  $("again").onclick=()=>{if(done||step===3){startStep(3);} };
}
if(LESSON.predict) setupPredict();

if(!LESSON.cam0||LESSON.startBehind) camI=1;   // Behind you is the default view; a lesson that needs another sets cam0 (startBehind: cam0 only widens Broadcast)
window.__camDefault=camI;
$("lessonName").textContent=LESSON.title;
startStep(0);
requestAnimationFrame(tick);
window.__test={SC,go:(k,f)=>{scene=k;t=f;setPlaying(false);},setCam:i=>{camI=i;},state:()=>({mode,step,scene,t,stopAt,playing})};
