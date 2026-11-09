// Capture each Daily's actual first decision or its lead-in, from the unchanged renderer.
// Regenerate deliberately after approved scene changes, then rebuild the app.
import {chromium} from 'playwright';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
const base=process.argv[2]||'http://127.0.0.1:8772/';
const catalog=JSON.parse(readFileSync('app/catalog.js','utf8').match(/GS_CATALOG=(.*);\n/)[1]);
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:1080,height:950},deviceScaleFactor:1,reducedMotion:'reduce'});
await context.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));
await context.addInitScript(()=>{localStorage.setItem('gs_sound','0');localStorage.setItem('gs_voice','0');});
const page=await context.newPage(),still=await context.newPage(),captures=[];
mkdirSync('app_src/home',{recursive:true});
try {
 for(const lesson of catalog.daily) {
  await page.goto(base+'play.html?l='+lesson.slug);
  await page.waitForFunction(()=>window.__test);
  // Capture the court only. No question, answer or score is embedded in a poster.
  const state=await page.evaluate(()=>{
   const range=questionRange(LESSON.steps[0]),key=range.scene;
   // Contact Clue's paused inspection crops the ball at poster size; its first
   // rally remains legible without changing the approved lesson camera.
   const frame=LESSON.closeUp&&key==='cp1A'?200:range.to;
   __test.go(key,frame);render();
   const preview=document.getElementById('svg').cloneNode(true);
   // The invitation shows the scene; readable instructional labels remain in
   // the lesson itself. Removing only text preserves players, ball and court.
   preview.querySelectorAll('text').forEach(label=>label.remove());
   return {scene:key,frame,svg:preview.outerHTML};
  });
  await still.setContent('<style>body{margin:0;background:#071810}svg{display:block;width:820px;height:470px}</style>'+state.svg);
  await still.locator('svg').screenshot({path:'app_src/home/'+lesson.slug+'.jpg',type:'jpeg',quality:86});
  captures.push({slug:lesson.slug,scene:state.scene,frame:state.frame});console.log('CAPTURED',lesson.slug);
 }
 writeFileSync('docs/features/home-preview-frames.json',JSON.stringify({source:'Live lesson renderer, first decision or lead-in; instructional text labels omitted from Home previews only; images contain no selected answer',captures},null,2)+'\n');
} finally {await browser.close();}
