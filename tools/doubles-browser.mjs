import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
import {openCompletionPanels} from './completion-panels.mjs';
const base=process.argv[2]||'http://127.0.0.1:8766/',engine=process.env.GS_LIVE_BROWSER||'chromium';
const rows=['doubles-cross-cover','doubles-return-space','doubles-lob-switch',...(+process.env.GS_BATCH===1?[]:['doubles-hold-cover','doubles-return-line','doubles-lob-overhead'])].filter(s=>!process.env.GS_SLUGS||process.env.GS_SLUGS.split(',').includes(s));
const dir=`app_src/evidence/doubles/${process.env.GS_STAGE||'local'}-${engine}`;mkdirSync(dir,{recursive:true});
const browser=await ({chromium,webkit}[engine]).launch(),report=[],errors=[];
try{
 for(const width of (process.env.GS_WIDTHS||'390,1280').split(',').map(Number)){
  const c=await browser.newContext({viewport:{width,height:width<500?844:900}});await c.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));
  const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));
  for(const slug of rows)for(const route of ['AA','AB','BA','BB']){
   await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);await p.waitForSelector('#loading',{state:'hidden'});
   if(!process.env.GS_NORMAL)await p.evaluate(()=>window.__speed=16);
   const geometry=route==='AA'?await p.evaluate(()=>{
    const fail=[],contacts=[],fast=[];let maxSpeed=0,maxJump=0,minClearance=20;
    const root=LESSON.branch,oldScene=scene,oldT=t;
    for(const X of 'AB')for(const Y of 'AB'){
     const s=SC[root+X+Y];
     for(const [f,who] of s.info.contacts){const a=actorAt(s,who,f),b=ballAt(s,f),dist=len(sub(a.rq.centre,b));contacts.push({f,who,dist});if(dist>.04)fail.push('miss '+who+' '+f+' '+dist.toFixed(3));}
     for(const who of Object.keys(s.actors)){
      for(let f=1;f<s.frames;f+=4){const a=actorAt(s,who,f).pose[I.hips],b=actorAt(s,who,Math.max(0,f-4)).pose[I.hips];const v=Math.hypot(a[0]-b[0],a[1]-b[1])*25;maxSpeed=Math.max(maxSpeed,v);if(v>8)fast.push([X+Y,who,f,+v.toFixed(1)]);}
      for(const boundary of [SC[root].info.freeze,SC[root+X].frames-1]){const a=actorAt(s,who,boundary),b=actorAt(s,who,boundary+1);maxJump=Math.max(maxJump,len(sub(a.pose[I.hips],b.pose[I.hips])));}
     }
     for(let f=1;f<s.ball.length;f++){const a=s.ball[f-1],b=s.ball[f];if(a&&b&&a[1]*b[1]<0){const u=-a[1]/(b[1]-a[1]),h=lerp(a[2],b[2],u);minClearance=Math.min(minClearance,h-.914);if(h<.97)fail.push('net clearance '+h.toFixed(3));}}
     for(let f=0;f<s.frames;f+=6){scene=root+X+Y;t=f;setCamera(actorAt(s,'you',f));buildBasis();fitFull();
      const points=Object.keys(s.actors).flatMap(w=>{const a=actorAt(s,w,f);return [a.pose[I.ankleL],add(a.pose[I.head],[0,0,.42])];});const ball=ballAt(s,f);if(ball)points.push(ball);
      for(const point of points){const q=P(point);if(!q||q.s[0]<5||q.s[0]>VW-5||q.s[1]<5||q.s[1]>VH-5)fail.push('court framing '+root+X+Y+' '+f);}
     }
    }
    scene=oldScene;t=oldT;
    return {fail:[...new Set(fail)],contacts,maxSpeed,maxJump,minClearance,fast:fast.sort((a,b)=>b[3]-a[3]).slice(0,12)};
   }):null;
   if(geometry){console.log(slug,JSON.stringify(geometry));assert(!geometry.fail.length,geometry.fail.join('; '));assert(geometry.maxJump<.16,'decision discontinuity');assert(geometry.maxSpeed<8,'implausible movement speed');}
   for(let i=0;i<2;i++){
    await p.waitForFunction(()=>document.querySelector('#askOpts button:not(:disabled)'));
    assert(await p.evaluate(()=>!playing&&document.documentElement.scrollWidth<=innerWidth),'question waits and fits');
    if(route==='AA')await p.locator('#stage').screenshot({path:`${dir}/${slug}-${width}-q${i+1}.png`});
    await p.locator('#askOpts button').nth('AB'.indexOf(route[i])).click();await p.waitForSelector('#verdict:not([hidden]) #next');await p.locator('#next').click();
   }
   await p.waitForSelector('#wrapup:not([hidden])');await openCompletionPanels(p);
   const saved=await p.evaluate(()=>JSON.stringify(GSApp.S.done[new URL(location).searchParams.get('l')]));
   assert((await p.locator('#liveEvidence').innerText()).includes('still in play'),'truthful outcome');
   for(const id of ['replayTurningPoint','compareOther']){await p.locator('#'+id).click();await p.waitForFunction(()=>!playing&&document.querySelector('#recoveryComparison').textContent);}
   await p.locator('#compareDone').click();assert.equal(await p.evaluate(()=>JSON.stringify(GSApp.S.done[new URL(location).searchParams.get('l')])),saved);
   await p.locator('#saveCue').click();assert((await p.locator('#saveCue').innerText()).includes('Saved'));
   if(route==='AA'){
    await p.evaluate(()=>{window.__shares=[];Object.defineProperty(navigator,'share',{configurable:true,value:async x=>{__shares.push(x);throw new DOMException('Cancelled','AbortError');}});});
    await p.locator('#sharePointButton').click();assert((await p.locator('#shareStatus').innerText()).includes('cancelled'));
    const shared=await p.evaluate(()=>__shares[0]);assert.equal(new URL(shared.url).pathname,'/s/'+slug+'.html');assert.equal(new URL(shared.url).search,'');assert(!/score|correct|cover|switch/i.test(shared.text),'blind share has no answers');
    await p.locator('#pairPlan summary').click();await p.locator('#pairPlanText').fill('I cover behind you when you cross. Agree before we serve.');await p.locator('#sharePairPlan').click();assert((await p.locator('#pairPlanStatus').innerText()).includes('cancelled'));
    assert((await p.evaluate(()=>__shares[1].text)).includes('Proposed plan'));assert((await p.locator('#practiceReturn').innerText()).includes('doubles'));
   }
   report.push({slug,route,width,geometry});console.log('PASS',slug,route,width);
  }
  await c.close();
 }
 assert.deepEqual(errors,[]);
}finally{writeFileSync(dir+'/report.json',JSON.stringify({report,errors},null,2));await browser.close();}
console.log('PASS',report.length,'complete doubles routes');
