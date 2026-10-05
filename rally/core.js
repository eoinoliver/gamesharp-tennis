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

