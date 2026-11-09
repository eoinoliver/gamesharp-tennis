// Actual first-decision scene plus its question; no answers, score or pro payoff.
import {chromium} from 'playwright';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
const base=process.argv[2]||'http://127.0.0.1:8772/';
const cat=JSON.parse(readFileSync('app/catalog.js','utf8').match(/GS_CATALOG=(.*);\n/)[1]);
const browser=await chromium.launch();const ctx=await browser.newContext({viewport:{width:1200,height:630},reducedMotion:'reduce'});
await ctx.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));
await ctx.addInitScript(()=>{localStorage.setItem('gs_sound','0');localStorage.setItem('gs_voice','0');});
const p=await ctx.newPage(),card=await ctx.newPage(),captures=[];mkdirSync('app_src/share',{recursive:true});
try{for(const l of [...cat.daily,...cat.predict,...cat.play]){
 await p.goto(base+'play.html?l='+l.slug);await p.waitForFunction(()=>window.__test);
 const shot=await p.evaluate(()=>{
  const first=LESSON.steps[0],range=questionRange(first),frame=LESSON.closeUp&&range.scene==='cp1A'?200:range.to;
  __test.go(range.scene,frame);render();const svg=document.getElementById('svg').cloneNode(true);svg.querySelectorAll('text').forEach(e=>e.remove());
  const clean=s=>{const d=document.createElement('div');d.innerHTML=s||'';return d.textContent.trim();};
  return {scene:range.scene,frame,question:clean(first.q),situation:clean(first.sit),svg:svg.outerHTML};
 });
 await card.setContent('<style>*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#071810;color:#f3f1e7;font-family:Arial,sans-serif}.mark{position:absolute;top:46px;left:52px;font-size:28px;font-weight:bold;letter-spacing:1px}.mark span{color:#d0b65b}.copy{position:absolute;left:52px;top:150px;width:460px}.type{color:#d6bd6a;font-size:16px;letter-spacing:2px;text-transform:uppercase}h1{font-size:44px;line-height:1.12;letter-spacing:-1px;margin:24px 0}p{font-size:21px;color:#becbc1;line-height:1.4}.court{position:absolute;right:0;top:92px;width:650px;height:440px}.court svg{width:100%;height:100%}.foot{position:absolute;bottom:44px;left:52px;font-size:19px;color:#d6bd6a}.site{position:absolute;right:40px;bottom:44px;color:#aabdb0;font-size:17px}</style><div class="mark">GAME<span>SHARP</span> TENNIS</div><div class="court"></div><div class="copy"><div class="type"></div><h1></h1><p>Watch the point.<br>Make your call.</p></div><div class="foot">PLAY THIS SITUATION →</div><div class="site">gamesharptennis.com</div>');
 await card.evaluate(({svg,q,type})=>{document.querySelector('.court').innerHTML=svg;document.querySelector('h1').textContent=q;document.querySelector('.type').textContent=type;}, {svg:shot.svg,q:shot.question,type:l.doubles?'Doubles · make a plan':cat.daily.some(d=>d.slug===l.slug)?'The daily challenge':'Play a point'});
 await card.screenshot({path:'app_src/share/'+l.slug+'.jpg',type:'jpeg',quality:88});delete shot.svg;captures.push({slug:l.slug,...shot});console.log('SHARE',l.slug);
}writeFileSync('docs/features/share-preview-frames.json',JSON.stringify({source:'Actual lesson renderer at first decision; text overlays removed from scene only. The first authored question is the invitation.',captures},null,2)+'\n');
}finally{await browser.close();}
