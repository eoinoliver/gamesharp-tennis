// Exercise the actual Sharpen mount/chips with deterministic frame inspection.
// Numeric continuity checks protect the illustration; screenshots assess its look.
import {chromium} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const base=process.argv[2];assert(base?.endsWith('/'),'Supply exact app URL');
const dir='app_src/evidence/sharpen-stroke';mkdirSync(dir,{recursive:true});
const browser=await chromium.launch(), errors=[],results=[];
for(const [width,height]of [[375,667],[430,932],[1280,900]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
 page.on('pageerror',e=>errors.push(String(e)));
 await page.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));
 await page.route('**/athlete.js?*',async route=>{
  const response=await route.fetch();let source=await response.text();
  source=source.replace('return {play(nk)',`window.__sharpenTest={async frame(nk,nf){show(nk);await load(nk);f=nf;draw(svg,k,c,f);return {ball:ballAt(k,c,f),point:P(ballAt(k,c,f)||[0,0,0]),frame:f};},inspect(){return {clip:c,range:range(c),camera:cam,court:{baseline:BL,net:NET,centre:DX},release:c.tossReleaseFrame};},ball(nf){return ballAt(k,c,nf);},body(nf){return at(c,nf).pose.map(P);},project(nf){const b=ballAt(k,c,nf);return b&&P(b);}};return {play(nk)`);
  await route.fulfill({response,body:source});
 });
 await page.goto(base+'?review=1');await page.waitForFunction(()=>window.__sharpenTest);
 for(const k of ['fh','bh','slice','serve','fv','bv','drop']){
  await page.locator(`[data-ath="${k}"]`).click();
  await page.waitForFunction(()=>document.querySelector('#shAth.ready [data-ball]'));
  const result=await page.evaluate(async k=>{
   const api=window.__sharpenTest;
   // Waiting for the selected clip also finishes the mount's camera update.
   await api.frame(k,1);
   const {clip:c,range,camera,court,release}=api.inspect();
   const dist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
   let maxJump=0,missing=0,minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,bodyBottom=0;
   for(let f=range[0];f<=range[1];f+=.5){
    if(k==='serve')for(const p of api.body(f))if(p)bodyBottom=Math.max(bodyBottom,p.s[1]);
    const b=api.ball(f);if(!b){missing++;continue;}
    const next=api.ball(f+.5);if(next)maxJump=Math.max(maxJump,dist(b,next));
    if(k==='serve'&&f<=c.contactFrame){const p=api.project(f);if(p){minX=Math.min(minX,p.s[0]);maxX=Math.max(maxX,p.s[0]);minY=Math.min(minY,p.s[1]);maxY=Math.max(maxY,p.s[1]);}}
   }
   let serve=null;
   if(k==='serve'){
    let lo=c.contactFrame,hi=range[1];
    for(let i=0;i<30;i++){const mid=(lo+hi)/2;if(api.ball(mid)[1]<court.net)lo=mid;else hi=mid;}
    const crossing=api.ball((lo+hi)/2),netHeight=.914+Math.abs(crossing[0]-court.centre)/(5.485+.9)*(.156);
    let bounceFrame=c.contactFrame+1,bounce=api.ball(bounceFrame);
    for(let f=c.contactFrame+1;f<=range[1];f+=.25){const p=api.ball(f);if(p[2]<bounce[2]){bounce=p;bounceFrame=f;}}
    const bouncePixel=api.project(bounceFrame).s;
    serve={releaseDelay:(release-range[0])/100,netClearance:crossing[2]-netHeight,crossing,bounce,bouncePixel,bounceAfterNet:bounce[1]-court.net,inServiceBox:bounce[1]>court.net&&bounce[1]<court.net+6.4&&bounce[0]<court.centre&&bounce[0]>court.centre-4.115,postBounceFrames:range[1]-bounceFrame};
   }
   await api.frame(k,c.contactFrame);
   return {k,range,camera,serve,maxJump,missing,bodyBottom,tossBounds:[minX,maxX,minY,maxY],contactGap:dist(api.ball(c.contactFrame),c.contactBall),overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.querySelectorAll('#shAthCard img')].length};
  },k);
  assert.equal(result.contactGap,0,k+' ball must reach the preserved contact');
  assert(result.maxJump<.3,k+' ball teleports');assert(!result.overflow,k+' page overflow');
  if(k==='serve'){
   assert(result.serve.releaseDelay<=.3,'serve waits before tossing');
   assert(result.serve.netClearance>.22,'serve has no readable net margin');
   assert(result.serve.inServiceBox&&result.serve.bounce[2]<.025,'serve must land in the opposite service box');
   assert(result.serve.postBounceFrames>=15,'serve ends before its landing can be read');
   assert(result.serve.bouncePixel[0]>4&&result.serve.bouncePixel[0]<516&&result.serve.bouncePixel[1]>4&&result.serve.bouncePixel[1]<356,'serve landing cropped');
   assert.equal(result.missing,0,'serve ball disappears');assert(result.bodyBottom<346,'serve feet cropped');
   const [x0,x1,y0,y1]=result.tossBounds;assert(x0>4&&x1<516&&y0>4&&y1<356,'serve toss cropped');
  }
  await page.locator('#shAthCard').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>[...document.querySelectorAll('#shAthCard img')].every(i=>i.complete&&i.naturalWidth>0));
  await page.locator('#shAth').screenshot({path:`${dir}/${width}-${k}-contact.png`});
  if(width===375&&['serve','slice','fv','bv','bh'].includes(k)){
   const frames=await page.evaluate(()=>{const {clip:c}=__sharpenTest.inspect();return [Math.max(1,c.contactFrame-35),c.contactFrame+25];});
   for(const f of frames){await page.evaluate(({k,f})=>__sharpenTest.frame(k,f),{k,f});await page.locator('#shAth').screenshot({path:`${dir}/${width}-${k}-${f}.png`});}
  }
  results.push({width,...result});
 }
 await page.close();
}
// Normal motion must actually advance and switching chips must retain the pick.
const page=await browser.newPage({viewport:{width:375,height:667}});
page.on('pageerror',e=>errors.push(String(e)));
await page.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));
await page.goto(base+'?review=1');await page.locator('#shAth.ready svg').waitFor();
await page.locator('[data-ath="serve"]').click();
const before=await page.locator('#shAth svg').innerHTML();
await page.waitForFunction(before=>document.querySelector('#shAth svg')?.innerHTML!==before,before);
await page.locator('[data-ath="slice"]').click();
assert.equal(await page.locator('[data-ath="slice"]').getAttribute('aria-pressed'),'true');
await page.close();await browser.close();assert.deepEqual(errors,[]);
writeFileSync(dir+'/report.json',JSON.stringify({results,errors},null,2));
console.log(`PASS: ${results.length} responsive stroke views; prompt toss, net clearance/service-box landing, contact anchors, chips, stills and normal motion`);
