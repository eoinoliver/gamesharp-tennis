// Verify the shared release in every lesson that uses a serve, in world space.
import {chromium} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const base=process.argv[2];assert(base?.endsWith('/'));
const catalog=JSON.parse(readFileSync('app/catalog.js','utf8').match(/GS_CATALOG=(.*);\n/)[1]);
const lessons=[...catalog.daily,...catalog.predict,...catalog.play].filter(l=>l.clips.some(k=>k.startsWith('serve')));
const b=await chromium.launch(),p=await b.newPage({viewport:{width:375,height:667}}),errors=[],results=[];
let mirroredProbe=null;
p.on('pageerror',e=>errors.push(String(e)));
await p.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));
for(const l of lessons){
 await p.goto(base+'play.html?l='+l.slug);await p.waitForFunction(()=>window.__test);
 const rows=await p.evaluate(()=>{
  const out=[];
  for(const [key,sc]of Object.entries(SC)){
   const shared=serveToss(sc);if(!shared)continue;
   const f0=shared.contact;if(f0>=sc.ball.length)continue;
   let first=null,who=null;
   for(const name of ['you','opp']){const s=sc.actors[name]?.find(s=>!s.hold);if(s?.clip.startsWith('serve')&&(!first||s.start<first.start)){first=s;who=name;}}
   if(!first)continue;
   const local=tossInfo(first.clip).releaseLocal,release=first.start-(first.poseFrameOffset||0)+local-1;
   if(release>=f0)continue; // Scene begins after this already-completed serve.
   const hand=add(actorAt(sc,who,release).pose[shared.handJoint],[0,0,.035]);
   const a=ballAt(sc,release),z=ballAt(sc,release+.01),contact=ballAt(sc,f0),before=ballAt(sc,f0-.01);
   const captured=prep(sc)[who].find(w=>!w.fixed);
   let sourceBodyGap=0;
   for(let f=release;f<=captured.cG;f+=5){
    const actual=actorAt(sc,who,f).pose,expected=worldOf(localAt(captured,f)).pose;
    sourceBodyGap=Math.max(sourceBodyGap,...actual.map((v,i)=>len(sub(v,expected[i]))));
   }
   let maxJump=0,maxHeight=0;
   for(let f=Math.max(0,release-3);f<f0;f+=.5){const A=ballAt(sc,f),B=ballAt(sc,Math.min(f+.5,f0));if(A&&B){maxJump=Math.max(maxJump,len(sub(A,B)));maxHeight=Math.max(maxHeight,A[2]);}}
   out.push({scene:key,clip:first.clip,releaseLocal:local,sourceBodyGap,mirrored:!!first.mirror,releaseHandGap:len(sub(a,hand)),releaseJump:len(sub(z,a)),contactJump:len(sub(before,contact)),maxJump,maxHeight});
  }
  return out;
 });
 assert(rows.length,l.slug+' had no checked serve');
 for(const r of rows){assert(r.sourceBodyGap<.02,l.slug+' skips captured serve preparation');assert(r.releaseLocal<100,l.slug+' releases late');assert(r.releaseHandGap<.001&&r.releaseJump<.003,l.slug+' disconnects from the hand');assert(r.contactJump<.003&&r.maxJump<.15,l.slug+' toss teleports');}
 results.push({lesson:l.slug,scenes:rows});
 if(!mirroredProbe){
  mirroredProbe=await p.evaluate(()=>{
   const clip=Object.keys(CL).find(k=>k.startsWith('serve')),c=CL[clip],T=[1.2,-11.95,0],hit=20+c.contactFrame-1;
   const segment={clip,start:20,T,yaw:0,mirror:true};
   const L=clipAt(c,c.contactFrame);Object.assign(L,{T,yaw:0,mirror:true,overhead:true});
   const sc={actors:{you:[{clip:'ready',start:0,T,yaw:0,hold:1},segment]},ball:Array(hit+2).fill(null),info:{}};
   sc.ball[hit]=worldOf(L).centre;
   const release=serveToss(sc).release,f=release-1,pose=actorAt(sc,'you',f).pose,ball=ballAt(sc,f);
   return {rightHandGap:len(sub(ball,add(pose[I.wristR],[0,0,.035]))),leftHandGap:len(sub(ball,add(pose[I.wristL],[0,0,.035])))};
  });
  assert(mirroredProbe.rightHandGap<.001&&mirroredProbe.leftHandGap>.2,'mirrored serve toss follows the hitting hand');
 }
}
await b.close();assert.deepEqual(errors,[]);
const dir='app_src/evidence/serve-toss';mkdirSync(dir,{recursive:true});writeFileSync(dir+'/report.json',JSON.stringify({results,mirroredProbe,errors},null,2));
console.log(`PASS: shared rising-hand toss in ${results.length} serve lessons / ${results.reduce((n,l)=>n+l.scenes.length,0)} scenes`);
