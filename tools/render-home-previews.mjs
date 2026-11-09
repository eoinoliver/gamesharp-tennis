// Silent Home teasers from the actual first decision, at the lesson's 100 fps.
// No selected answer, instructional labels or substitute tennis animation.
import {chromium} from 'playwright';
import {readFileSync,writeFileSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
const base=process.argv[2]||'http://127.0.0.1:8772/';
const filter=process.argv[3];
const posters=JSON.parse(readFileSync('docs/features/home-preview-frames.json','utf8')).captures;
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:1080,height:950},reducedMotion:'reduce'});
await context.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));
await context.addInitScript(()=>{localStorage.setItem('gs_sound','0');localStorage.setItem('gs_voice','0');});
const page=await context.newPage(),captures=[];
try {
 for(const poster of posters.filter(p=>!filter||p.slug===filter)) {
  await page.goto(base+'play.html?l='+poster.slug);await page.waitForFunction(()=>window.__test);
  const range=await page.evaluate(()=>questionRange(LESSON.steps[0]));
  if(range.scene!==poster.scene)throw Error('Poster scene drift: '+poster.slug);
  const from=Math.max(0,Math.min(range.from,poster.frame-100),poster.frame-500),to=poster.frame;
  const frames=Math.max(2,Math.ceil((to-from)/100*30));
  const output='app_src/home/'+poster.slug+'.mp4';
  const ff=spawn(process.env.FFMPEG||'ffmpeg',['-loglevel','error','-f','image2pipe','-framerate','30','-vcodec','mjpeg','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart','-y',output],{stdio:['pipe','inherit','inherit']});
  const finished=once(ff,'exit');
  for(let i=0;i<frames;i++){
   const jpg=await page.evaluate(async({scene,frame})=>{
    __test.go(scene,frame);render();
    const svg=document.getElementById('svg').cloneNode(true);
    svg.querySelectorAll('text').forEach(e=>e.remove());
    svg.setAttribute('xmlns','http://www.w3.org/2000/svg');
    // Inline the few court colours whose CSS variables otherwise leave the SVG.
    const styles=getComputedStyle(document.documentElement);
    let source=svg.outerHTML.replace(/var\((--[\w-]+)\)/g,(_,key)=>styles.getPropertyValue(key).trim());
    const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(source);await img.decode();
    const canvas=document.createElement('canvas');canvas.width=820;canvas.height=470;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#071810';ctx.fillRect(0,0,820,470);ctx.drawImage(img,0,0,820,470);
    return canvas.toDataURL('image/jpeg',.9).split(',')[1];
   },{scene:poster.scene,frame:Math.round(from+(to-from)*i/(frames-1))});
   if(!ff.stdin.write(Buffer.from(jpg,'base64')))await once(ff.stdin,'drain');
  }
  ff.stdin.end();const [code]=await finished;if(code!==0)throw Error('ffmpeg failed: '+poster.slug);
  captures.push({slug:poster.slug,scene:poster.scene,from,to,sourceFps:100,outputFps:30,frames});
  console.log('RENDERED',poster.slug,from,to,frames+' frames');
 }
 if(!filter)writeFileSync('docs/features/home-motion-frames.json',JSON.stringify({source:'Actual first decision lead-in; silent; instructional text omitted; holds on the existing Home poster frame',captures},null,2)+'\n');
}finally{await browser.close();}
