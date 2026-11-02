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
  source=source.replace('return {play(nk)',`window.__sharpenTest={async frame(nk,nf){show(nk);await load(nk);f=nf;draw(svg,k,c,f);return {ball:ballAt(k,c,f),point:P(ballAt(k,c,f)||[0,0,0]),frame:f};},inspect(){return {clip:c,range:range(c),camera:cam};},ball(nf){return ballAt(k,c,nf);},body(nf){return at(c,nf).pose.map(P);},project(nf){const b=ballAt(k,c,nf);return b&&P(b);}};return {play(nk)`);
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
   const {clip:c,range,camera}=api.inspect();
   const dist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
   let maxJump=0,missing=0,minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,bodyBottom=0;
   for(let f=range[0];f<=range[1];f+=.5){
    if(k==='serve')for(const p of api.body(f))if(p)bodyBottom=Math.max(bodyBottom,p.s[1]);
    const b=api.ball(f);if(!b){missing++;continue;}
    const next=api.ball(f+.5);if(next)maxJump=Math.max(maxJump,dist(b,next));
    if(k==='serve'&&f<=c.contactFrame){const p=api.project(f);if(p){minX=Math.min(minX,p.s[0]);maxX=Math.max(maxX,p.s[0]);minY=Math.min(minY,p.s[1]);maxY=Math.max(maxY,p.s[1]);}}
   }
   await api.frame(k,c.contactFrame);
   return {k,range,camera,maxJump,missing,bodyBottom,tossBounds:[minX,maxX,minY,maxY],contactGap:dist(api.ball(c.contactFrame),c.contactBall),overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.querySelectorAll('#shAthCard img')].length};
  },k);
  assert.equal(result.contactGap,0,k+' ball must reach the preserved contact');
  assert(result.maxJump<.3,k+' ball teleports');assert(!result.overflow,k+' page overflow');
  if(k==='serve'){
   assert.equal(result.missing,0,'serve ball disappears');assert(result.bodyBottom<346,'serve feet cropped');
   const [x0,x1,y0,y1]=result.tossBounds;assert(x0>4&&x1<516&&y0>4&&y1<356,'serve toss cropped');
  }
  await page.locator('#shAthCard img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
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
console.log(`PASS: ${results.length} responsive stroke views; continuous uncropped toss, contact anchors, chips, stills and normal motion`);
