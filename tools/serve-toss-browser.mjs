// Verify the shared release in every lesson that uses a serve, in world space.
import {chromium} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const base=process.argv[2];assert(base?.endsWith('/'));
const catalog=JSON.parse(readFileSync('app/catalog.js','utf8').match(/GS_CATALOG=(.*);\n/)[1]);
const lessons=[...catalog.daily,...catalog.predict,...catalog.play].filter(l=>l.clips.some(k=>k.startsWith('serve')));
const b=await chromium.launch(),p=await b.newPage({viewport:{width:375,height:667}}),errors=[],results=[];
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
   const hand=add(actorAt(sc,who,release).pose[I.wristL],[0,0,.035]);
   const a=ballAt(sc,release),z=ballAt(sc,release+.01),contact=ballAt(sc,f0),before=ballAt(sc,f0-.01);
   let maxJump=0,maxHeight=0;
   for(let f=Math.max(0,release-3);f<f0;f+=.5){const A=ballAt(sc,f),B=ballAt(sc,Math.min(f+.5,f0));if(A&&B){maxJump=Math.max(maxJump,len(sub(A,B)));maxHeight=Math.max(maxHeight,A[2]);}}
   out.push({scene:key,clip:first.clip,releaseLocal:local,releaseHandGap:len(sub(a,hand)),releaseJump:len(sub(z,a)),contactJump:len(sub(before,contact)),maxJump,maxHeight});
  }
  return out;
 });
 assert(rows.length,l.slug+' had no checked serve');
 for(const r of rows){assert(r.releaseLocal<100,l.slug+' releases late');assert(r.releaseHandGap<.001&&r.releaseJump<.003,l.slug+' disconnects from the hand');assert(r.contactJump<.003&&r.maxJump<.15,l.slug+' toss teleports');}
 results.push({lesson:l.slug,scenes:rows});
}
await b.close();assert.deepEqual(errors,[]);
const dir='app_src/evidence/serve-toss';mkdirSync(dir,{recursive:true});writeFileSync(dir+'/report.json',JSON.stringify({results,errors},null,2));
console.log(`PASS: shared rising-hand toss in ${results.length} serve lessons / ${results.reduce((n,l)=>n+l.scenes.length,0)} scenes`);
