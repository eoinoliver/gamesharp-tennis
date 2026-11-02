/* Sharpen athlete: the lesson engine's own figure playing each stroke's real lesson swing (mocap clips).
   build.py wraps this file with rally/core.js + rally/figure.js into app/athlete.js (one closure, no globals but GSAthlete).
   Loaded on Home or when Sharpen opens. The selected stroke stays selected; normal speed and slow view are explicit. Reduced motion: the contact frame, still.
   Built 5 Oct 2026 (Claude). */
const CLIPS={fh:"fh",bh:"bh",slice:"bhSlice",serve:"serveT",fv:"fvhi",bv:"bv",drop:"drop"};
const LEAD={fh:70,bh:62,slice:60,serve:123,fv:65,bv:65,drop:70};   /* frames of preparation shown before contact */
const I={}, CL={}, V=window.GS_VERSION||"";
VW=520; VH=360; CYF=0.56;
cam={az:-128,el:13,d:7.6,fov:30,tgt:[0.15,0.9,1.0]}; buildBasis();
function load(k){
  return CL[k]||(CL[k]=fetch(`clips/${CLIPS[k]}.json?v=${V}`).then(r=>{if(!r.ok)throw new Error(r.status);return r.json();})
    .then(c=>{if(!("hips" in I))c.joints.forEach((n,i)=>I[n]=i);return c;})
    .catch(error=>{delete CL[k];throw error;}));
}
function at(c,f){
  f=clamp(f,1,c.frameCount); const i=Math.floor(f),u=f-i,j=Math.min(c.frameCount,i+1);
  const A=c.frames[i-1],B=c.frames[j-1],RA=c.racquetFrames[i-1],RB=c.racquetFrames[j-1];
  const pose=A.map((p,k)=>lerp3(p,B[k],u)), axis=norm(lerp3(RA.axis,RB.axis,u)), lat=lerp3(RA.lateral,RB.lateral,u);
  const feet=c.footFrames?Object.fromEntries(["L","R"].map((s,k)=>[s,norm(lerp3(c.footFrames[i-1][k],c.footFrames[j-1][k],u))])):undefined;
  return {pose,feet,rq:{w:pose[I.wristR],axis,lateral:norm(sub(lat,mul(axis,dot(lat,axis)))),centre:lerp3(RA.centre,RB.centre,u)}};
}
/* Continuous illustration ball, anchored to each shared clip's contact.
   Serve: held in the tossing hand, released as that hand rises, then a smooth
   arc onto contact. Other strokes show an incoming ball and its flight away.
   Adapted from the unshipped October PR #30; current feet/figure are retained. */
const G=9.81, GROUND=new Set(["fh","bh","slice","drop"]);
function fall(p,v,t){return [p[0]+v[0]*t,p[1]+v[1]*t,p[2]+v[2]*t-G/2*t*t];}
function bounced(p,v,t){
  // Continue the ball after its first bounce until it naturally leaves the frame.
  for(let i=0;i<5;i++){
    const tg=(v[2]+Math.sqrt(v[2]*v[2]+2*G*Math.max(0,p[2])))/G;
    if(t<=tg)return fall(p,v,t);
    p=fall(p,v,tg);p[2]=0;t-=tg;v=[v[0],v[1],.7*(G*tg-v[2])];
  }
  return [p[0]+v[0]*t,p[1]+v[1]*t,0];
}
const OUT={fh:[0,25,1.55],bh:[0,25,1.45],slice:[0,22,1.15],drop:[0,14,1.1],fv:[0,18,1.2],bv:[0,18,1.2]};   /* forward speed m/s, height crossing the net */
function ballAt(k,c,f){
  const C=c.contactBall, cf=c.contactFrame, t=(f-cf)/100;
  if(k==="serve"){
    if(f>=cf){const T=0.62, v=[-1.5/T,16.5/T,(-C[2]+G/2*T*T)/T]; return bounced(C,v,t);}   /* lands about 16.5 m on, inside the service line */
    const hand=add(at(c,Math.min(f,c.tossReleaseFrame)).pose[I.wristL],[0,0,.035]);
    if(f<c.tossReleaseFrame) return hand;
    const duration=(cf-c.tossReleaseFrame)/100, elapsed=(f-c.tossReleaseFrame)/100;
    return fall(hand,[(C[0]-hand[0])/duration,(C[1]-hand[1])/duration,(C[2]-hand[2]+G/2*duration*duration)/duration],elapsed);}
  if(f<cf){
    if(GROUND.has(k)){const tb=0.18, B=[C[0]-0.25,C[1]+4.5,0];
      if(-t<=tb){const vz=(C[2]+G/2*tb*tb)/tb, s=(t+tb)/tb; return [lerp(B[0],C[0],s),lerp(B[1],C[1],s),vz*(t+tb)-G/2*(t+tb)*(t+tb)];}
      const ta=0.4, u=(-t-tb); if(u>ta) return null;          /* before the bounce: down from 1.6 m over the net */
      const z0=1.6, vz0=(-z0+G/2*ta*ta)/ta, s=1-u/ta;
      return [B[0]-0.4*(u/ta),B[1]+25*u,z0+vz0*(ta-u)-G/2*(ta-u)*(ta-u)].map((x,i)=>i<2?x:Math.max(0,x));}
    const ta=0.45; if(-t>ta) return null;                    /* a volley: straight in, still in the air */
    return fall([C[0]-0.3,C[1]+18*ta,1.4],[0.3/ta,-18,(C[2]-1.4+G/2*ta*ta)/ta],t+ta);}
  const [vx,vy,hn]=OUT[k], T=Math.max(0.2,(NET-C[1])/vy);    /* over the net at height hn */
  return bounced(C,[vx+(k==="bh"||k==="slice"||k==="bv"?-0.6:0.6),vy,(hn-C[2]+G/2*T*T)/T],t);
}
const SL=4.115, DL=5.485;
/* the court around the player. Rallying strokes: the baseline just behind them. The serve: placed as the lesson places
   the captured serve (courtOffset [1.2, -11.95]): the baseline 6.5 cm in front of the clip's origin and the centre mark
   1.2 m to the left, so the feet start behind the line and cross it only in the air, after contact. No foot fault. */
let BL=-0.35, DX=0, NET=BL+11.885;
function courtFor(k){NET=k==="serve"?11.95:(k==="fv"||k==="bv")?3.8:11.535; BL=NET-11.885; DX=k==="serve"?-1.2:0;}
function court(g){
  quad(g,[[-9,BL-3,0],[9,BL-3,0],[9,NET+15,0],[-9,NET+15,0]],"#0b3016");
  quad(g,[[-DL+DX,BL,0],[DL+DX,BL,0],[DL+DX,NET+11.885,0],[-DL+DX,NET+11.885,0]],"#215d27");
  for(let y=BL,i=0;y<NET+11.885;y+=1.55,i++){const top=Math.min(y+1.55,NET+11.885);
    quad(g,[[-DL+DX,y,.0005],[DL+DX,y,.0005],[DL+DX,top,.0005],[-DL+DX,top,.0005]],i%2?"#2c7232":"#215d27");}
  const ln=(a,b)=>seg(g,[a[0]+DX,a[1],0],[b[0]+DX,b[1],0],"rgba(240,236,227,.8)",1.6);
  ln([-DL,BL],[DL,BL]);ln([-DL,NET+11.885],[DL,NET+11.885]);ln([-DL,BL],[-DL,NET+11.885]);ln([DL,BL],[DL,NET+11.885]);ln([-SL,BL],[-SL,NET+11.885]);ln([SL,BL],[SL,NET+11.885]);
  ln([-SL,NET+6.4],[SL,NET+6.4]);ln([0,NET],[0,NET+6.4]);ln([-SL,NET-6.4],[SL,NET-6.4]);ln([0,NET-6.4],[0,NET]);ln([0,BL],[0,BL+.15]);
  const W=DL+.9,top=[[-W+DX,NET,1.07],[DX,NET,.914],[W+DX,NET,1.07]];
  quad(g,[[-W+DX,NET,0],[W+DX,NET,0],top[2],top[1],top[0]],"rgba(4,10,6,.45)");
  seg(g,top[0],top[1],"rgba(240,236,227,.85)",2);seg(g,top[1],top[2],"rgba(240,236,227,.85)",2);
}
function draw(svg,k,c,f,home=false){
  const g=document.createDocumentFragment(); courtFor(k); court(g);
  const s=at(c,f), A=s.pose[I.ankleL], B=s.pose[I.ankleR];
  ring(g,[(A[0]+B[0])/2,(A[1]+B[1])/2,.004],.42,.32,"none",0,1,"rgba(0,0,0,.35)");
  const parts=[]; drawFigure(parts,s.pose,s.rq,{kit:KIT_PREM,feet:s.feet,fwd:[0,1,0],band:"#d9b24a",bandDk:"#8f7632"});   // the premium kit, as in the lessons
  const b=ballAt(k,c,f), bq=b&&P(b);
  if(bq){const sh=P([b[0],b[1],.003]); if(sh) g.appendChild(el_("ellipse",{cx:sh.s[0].toFixed(1),cy:sh.s[1].toFixed(1),rx:(FOCAL*.05/sh.z).toFixed(1),ry:(FOCAL*.02/sh.z).toFixed(1),fill:"rgba(0,0,0,.3)"}));
    const r=Math.max(3.2,FOCAL*.034/bq.z);
    parts.push({n:el_("circle",{cx:bq.s[0].toFixed(1),cy:bq.s[1].toFixed(1),r:r.toFixed(1),fill:"#e3f25a",stroke:"#9fb02a","stroke-width":.8,"data-ball":"true"}),z:bq.z-(k==="serve"&&f<c.tossReleaseFrame?.09:.01)});}
  parts.sort((x,y)=>y.z-x.z).forEach(p=>g.appendChild(p.n));
  /* the racquet head's path into and through contact */
  if(!home&&Math.abs(f-c.contactFrame)<16) for(let i=Math.max(c.contactFrame-14,Math.floor(f)-12);i<=Math.floor(f);i++)
    seg(g,at(c,i-1).pose[I.racquetTip],at(c,i).pose[I.racquetTip],"#c8a84b",2,.12+.5*(1-(f-i)/12));
  svg.replaceChildren(g);
}
window.GSAthlete={mount(stage,o={}){
  const home=!!o.home, width=home?820:520, height=home?470:360;
  VW=width;VH=height;CYF=home?.50:.56;
  const svg=document.createElementNS(SVGNS,"svg");svg.setAttribute("viewBox",`0 0 ${width} ${height}`);svg.setAttribute("aria-hidden","true");
  stage.appendChild(svg);
  const order=o.order||Object.keys(CLIPS), still=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let k=o.start||order[0], f=0, hold=0, last=null, alive=true, c=null, speed=1, paused=still, visible=true, manual=false, raf;
  const range=c=>[Math.max(1,k==="serve"?c.tossReleaseFrame-25:c.contactFrame-LEAD[k]),home?c.contactFrame+240:Math.min(c.frameCount,c.contactFrame+(k==="serve"?85:65))];
  function paint(){if(c)draw(svg,k,c,f,home);}
  function show(nk){if(!CLIPS[nk])return;k=nk;c=null;hold=0;stage.classList.remove('load-error');svg.style.opacity='1';window.GSSfx?.stopContacts();o.onStroke?.(k);
    load(k).then(cl=>{if(!alive||k!==nk)return;c=cl;
      const h=cl.frames[cl.contactFrame-1][I.hips];
      cam=home?{az:-72,el:26,d:29,fov:24,tgt:[0,8.0,.7]}:{az:["bh","slice","bv"].includes(k)?-120:-65,el:13,d:k==="serve"?10:6.6,fov:35,tgt:[h[0],h[1]+.2,k==="serve"?1.5:(k==="fv"||k==="bv")?.9:1.05]};buildBasis();
      f=still&&!manual?cl.contactFrame:range(cl)[0];stage.classList.add("ready");paint();
    }).catch(()=>{stage.classList.add('load-error');o.onError?.();});}
  function sound(a,b){if(!c||!visible||document.hidden||!window.GSSfx||speed!==1||b<=a)return;
    const events=[[c.contactFrame,'hit',.65]],C=c.contactBall;
    if(GROUND.has(k))events.push([c.contactFrame-18,'bounce',.35]);
    if(k==='serve')events.push([c.contactFrame+62,'bounce',.3]);
    else {const [,vy,hn]=OUT[k],T=Math.max(.2,(NET-C[1])/vy),vz=(hn-C[2]+G/2*T*T)/T;
      events.push([c.contactFrame+100*(vz+Math.sqrt(vz*vz+2*G*C[2]))/G,'bounce',.3]);}
    for(const [frame,type,volume] of events)if(a<frame&&b>=frame){const ball=ballAt(k,c,frame),q=ball&&P(ball);
      if(q&&q.s[0]>0&&q.s[0]<width&&q.s[1]>0&&q.s[1]<height)GSSfx[type](home?volume*.6:volume,clamp(q.s[0]/width*2-1,-1,1),type==='bounce'?.7:.25);}
  }
  function tick(ts){
    if(!alive)return;if(!stage.isConnected){stop();return;}
    const dt=last==null?0:Math.min(50,ts-last);last=ts;
    if(c&&!paused&&!document.hidden&&visible){const [a,b]=range(c);
      if(f<b){const prev=f;f=Math.min(b,f+dt*.1*speed);sound(prev,f);if(home)svg.style.opacity=String(Math.min(1,(f-a)/20));paint();}
      else {hold+=dt;const rest=home?1900:900;
        if(home)svg.style.opacity=String(hold<rest-280?1:Math.max(0,(rest-hold)/280));
        if(hold>=rest){f=a;hold=0;paint();svg.style.opacity=home?'0':'1';}}
    }
    raf=requestAnimationFrame(tick);
  }
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=null;},{threshold:.15});observer.observe(stage);
  function stop(){alive=false;cancelAnimationFrame(raf);observer.disconnect();}
  show(k);raf=requestAnimationFrame(tick);
  return {play(nk){manual=false;paused=still;show(nk);},replay(){manual=true;paused=false;show(k);},speed(value){speed=value===.5?.5:1;},pause(value){paused=!!value;if(paused)window.GSSfx?.stopContacts();},stop};
}};
