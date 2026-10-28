// Geometry gates and multi-angle evidence. These do not certify tennis technique.
import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2]||'http://127.0.0.1:8786/';
const dir='app_src/evidence/stroke-integrity';mkdirSync(dir,{recursive:true});
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900}}),errors=[];
p.on('pageerror',e=>errors.push(String(e)));await p.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));await p.goto(base+'play.html?l=late-is-the-culprit');await p.waitForFunction(()=>window.__test);
const result=await p.evaluate(async()=>{
 const clips=[...new Set(Object.values(GS_CATALOG).filter(Array.isArray).flat().flatMap(x=>x.clips||[]))];
 for(const k of clips)if(!CL[k])CL[k]=await(await fetch('clips/'+k+'.json?v='+GS_VERSION)).json();
 const checks=[],failures=[],measurements={};const check=(ok,message)=>{checks.push({ok,message});if(!ok)failures.push(message);};
 for(const [k,c]of Object.entries(CL)){
  let boneError=0,rigidError=0,unitError=0,groundError=0,gripGap=0;
  for(let f=1;f<=c.frameCount;f++){
   const L=clipAt(c,f);L.T=[0,0,.08];L.yaw=0;L.overhead=k.startsWith("serve")||k==="sm";const w=worldOf(L);
   unitError=Math.max(unitError,...['L','R'].map(s=>Math.abs(len(norm(w.feet[s]))-1)));
   for(const s of ['L','R']){
    groundError=Math.max(groundError,Math.abs(w.pose[I['ankle'+s]][2]-L.pose[I['ankle'+s]][2]));
    for(const [a,b]of [['hip','knee'],['knee','ankle'],['shoulder','elbow'],['elbow','wrist']])boneError=Math.max(boneError,Math.abs(len(sub(w.pose[I[a+s]],w.pose[I[b+s]]))-len(sub(L.pose[I[a+s]],L.pose[I[b+s]]))));
   }
   const r=c.racquetFrames[f-1];rigidError=Math.max(rigidError,Math.abs(len(sub(r.centre,L.pose[I.wristR]))-.38));
   if(Math.abs(f-c.contactFrame)<12)gripGap=Math.max(gripGap,len(sub(w.pose[I.wristR],sub(w.centre,mul(norm(w.axis),.38)))));
  }
  measurements[k]={boneError,rigidError,unitError,groundError,gripGap};
  check(boneError<.0002,k+': fixed arm/leg lengths under height adaptation');
  check(rigidError<.0003,k+': rigid racket-to-hand in clip');
  if(!k.startsWith('serve')&&k!=='sm')check(groundError<.003,k+': positive height adjustment keeps feet grounded');
  check(gripGap<.015,k+': contact hand remains on grip');
  if(['lowfv','bv','fvhi'].includes(k)){const r=c.racquetFrames[c.contactFrame-1],n=norm(cross(r.lateral,r.axis));check(n[1]>.97,k+': string bed faces the outgoing court at contact');}
 }
 return {checks,failures,measurements};
});
for(const k of ['bh','bhSlice','lowfv','bv','fvhi']){
 for(const az of [-40,-120])for(const off of [-25,0,25]){
  await p.evaluate(({k,az,off})=>{setPlaying(false);onStop=null;const c=CL[k];SC.audit={actors:{you:[{clip:k,start:0,T:[0,0,0],yaw:0}]},ball:Array(c.frameCount).fill(null),marks:[],frames:c.frameCount,info:{freeze:c.contactFrame-1}};scene='audit';t=c.contactFrame-1+off;answered=true;showTargets=null;window.__camOverride={c:{az,el:14,d:5.6,fov:38,tgt:[0,0,1]}};render();},{k,az,off});
  await p.locator('#stage').screenshot({path:`${dir}/${k}-${az}-${off}.png`});
 }
}
writeFileSync(dir+'/report.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify(result,null,2));await b.close();if(errors.length||result.failures.length)process.exitCode=1;
