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
