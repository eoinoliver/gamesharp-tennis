import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_DIRECTED_BROWSER||'chromium';
assert(base?.endsWith('/'));
const browser=await ({chromium,webkit}[engine]).launch();
const out=`app_src/evidence/directed-${engine}`;mkdirSync(out,{recursive:true});
const checks=[],errors=[];const check=(ok,label)=>{assert(ok,label);checks.push(label);};
async function page(slug,width=390,reduce=false,storageDenied=false){
 const p=await browser.newPage({viewport:{width,height:width===320?568:width<700?844:900},reducedMotion:reduce?'reduce':'no-preference'});
 p.on('pageerror',e=>errors.push(e.message));await p.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));
 await p.addInitScript(({storageDenied})=>{window.__speed=8;if(storageDenied){Storage.prototype.setItem=()=>{throw Error('Storage denied');};Storage.prototype.getItem=()=>{throw Error('Storage denied');};}},{storageDenied});
 await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);return p;
}
const ready=p=>p.waitForFunction(()=>!!document.querySelector('#askOpts button:not(:disabled)'));
const board=p=>p.locator('#directedReview').waitFor();
// Keyboard activation avoids racing Playwright's pointer-stability wait against
// deliberately accelerated short replays. Real-time pause/skip is checked below.
const skip=async p=>{const b=p.locator('#skipDirected');if(await b.isVisible()){await b.focus();await p.keyboard.press('Enter');}};
try{
 // Every option at the two directed decisions, on mobile and desktop. Do not skip
 // the new sequence: exercise actual callbacks, full consequences and comparisons.
 for(const width of [390,1280])for(const slug of ['short-ball','the-winner']){
  await Promise.all([0,1,2,3].map(async pick=>{
   const p=await page(slug,width);const seen=new Set();
   await p.exposeFunction('directedPhase',phase=>seen.add(phase));
   await p.evaluate(()=>{const el=document.querySelector('#viewer');new MutationObserver(()=>window.directedPhase(el.dataset.directedPhase)).observe(el,{attributes:true,attributeFilter:['data-directed-phase']});});
   await ready(p);
   check(await p.locator('.directed-option,.directed-note,.reveal-choice').count()===0,`${slug}/${width}/${pick}: no coaching cues or pulse before commitment`);
   if(slug==='the-winner'){await p.locator('#askOpts button').nth(2).click();await p.locator('#next').click();await ready(p);}
   const palette=slug==='short-ball'?['#f0a35e','#b9a3f0','#6fd6c4','#c8a84b']:['#6fd6c4','#f0a35e','#c8a84b','#b9a3f0'];
   const rgb=palette.map(c=>'rgb('+c.slice(1).match(/../g).map(v=>parseInt(v,16)).join(', ')+')');
   await p.waitForFunction(palette=>palette.every((c,j)=>[...document.querySelectorAll('#svg text')].some(e=>e.textContent==='ABCD'[j]&&e.getAttribute('fill')===c)),palette);
   check(await p.evaluate(({palette,rgb})=>[...document.querySelectorAll('#askOpts .l')].every((e,j)=>getComputedStyle(e).backgroundColor===rgb[j])&&palette.every((c,j)=>[...document.querySelectorAll('#svg text')].some(e=>e.textContent==='ABCD'[j]&&e.getAttribute('fill')===c)),{palette,rgb}),`${slug}/${width}/${pick}: tile badges match the four on-court letters`);
   if(pick===2)await p.screenshot({path:`${out}/${slug}-${width}-choices.png`,fullPage:true});
   const before=await p.evaluate(()=>ans.slice());await p.locator('#askOpts button').nth(pick).click();await board(p);await p.waitForTimeout(350);
   const state=await p.evaluate(()=>({ans,step,scene,t,contact:contactsOf(SC[scene],'you').find(f=>f>=SC[scene].info.freeze-2),state:GSDirected.state,tiles:[...document.querySelectorAll('#askOpts button')].map(e=>({visible:!e.classList.contains('hide'),enabled:!e.disabled,note:e.querySelector('.directed-note')?.textContent,first:!!e.querySelector('.directed-first')}))}));
   const label=`${slug}/${width}/${pick}`;
   check(seen.has('rewind')&&!seen.has('samples'),label+': full comparison without probability sequence');
   check(state.ans[state.step]==='ABCD'[pick]&&before.filter(Boolean).length===state.ans.filter(Boolean).length-1,label+': comparison preserves first answer');
   check(state.scene===(slug==='short-ball'?'sb3':'wn2')+'ABCD'[pick]&&state.t===state.contact-1,label+': board restored to original contact');
   check(await p.locator('#askOpts .l').evaluateAll((es,rgb)=>es.every((e,j)=>getComputedStyle(e).backgroundColor===rgb[j]),rgb),label+': choice identity colours survive feedback');
   check(state.tiles.length===4&&state.tiles.every(e=>e.visible&&e.enabled&&e.note)&&state.tiles.filter(e=>e.first).length===1&&state.tiles[pick].first,label+': four explorable choices with text cues and original choice');
   check(!/ten tries|\d+\s*\/\s*10/i.test(await p.locator('#directedReview').innerText()),label+': no probability board');
   check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+': no horizontal overflow');
   if(pick===2)await p.screenshot({path:`${out}/${slug}-${width}-board.png`,fullPage:true});
   // Observe this short route at real speed; at 8x it can finish during click settling.
   await p.evaluate(()=>window.__speed=1);await p.locator('#again').click();
   check(await p.evaluate(()=>GSDirected.state.active&&GSDirected.state.phase==='wide'),label+': existing Replay uses the directed route');await skip(p);await p.evaluate(()=>window.__speed=8);
   await p.locator('#directedOther').click();await skip(p);
   check(JSON.stringify(await p.evaluate(()=>ans))===JSON.stringify(state.ans),label+': skipping replay cannot rescore');
   for(let alternative=0;alternative<4;alternative++){
    await p.locator('#askOpts button').nth(alternative).focus();await p.keyboard.press('Enter');
    await skip(p);await board(p);
    check(await p.evaluate(({alternative,original})=>chosen==='ABCD'[alternative]&&JSON.stringify(ans)===JSON.stringify(original)&&!document.querySelector('.reveal-choice'),{alternative,original:state.ans}),label+': tile '+alternative+' replays without rescoring or repeated glow');
   }
   await p.close();
  }));
 }
 // Actual completions, persistence and repeat visits. Check small phone too.
 for(const width of [320,390,1280])for(const slug of ['short-ball','the-winner']){
  const p=await page(slug,width);await p.locator('#skipDirected').focus();await p.keyboard.press('Enter');await ready(p);
  check(!(await p.evaluate(()=>GSDirected.state.active)),`${slug}/${width}: keyboard skip reaches decision`);
  for(let i=0;i<3;i++){
   await ready(p);const answer=await p.evaluate(i=>i===(new URL(location).searchParams.get('l')==='short-ball'?0:1)?(LESSON.steps[i].correct+1)%4:LESSON.steps[i].correct,i);
   await p.locator('#askOpts button').nth(answer).click();
   if(await p.locator('#skipDirected').isVisible())await skip(p);
   await p.locator('#verdict:not([hidden]) #next').waitFor();
   if(await p.locator('#directedReview').count()){
    const original=await p.evaluate(()=>ans.slice());await p.locator('#askOpts button').nth('ABCD'.indexOf(original[await p.evaluate(()=>step)])).click();await skip(p);
    check(JSON.stringify(await p.evaluate(()=>ans))===JSON.stringify(original),`${slug}/${width}: replay scoring unchanged`);
    if(slug==='short-ball'){
     await p.locator('#inspectContact').click();check(await p.evaluate(()=>!!contactInspection&&!GSDirected.state.board),`${width}: contact inspection owns its camera`);
     await p.keyboard.press('Escape');
    }
   }
   await p.locator('#why').click();check(await p.locator('#whyp').isVisible(),`${slug}/${width}/${i}: coaching retained`);
   await p.locator('#next').click();
  }
  await p.locator('#progressStorage').waitFor();if(await p.locator('#skipRecap').isVisible())await p.locator('#skipRecap').click();
  check(await p.evaluate(slug=>GSApp.S.done[slug].best===2&&GSApp.S.done[slug].total===3,slug),`${slug}/${width}: actual 2/3 progress saved`);
  await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);await ready(p);
  check(await p.evaluate(()=>!GSDirected.state.active),`${slug}/${width}: repeat opening immediately ready`);
  check(await p.locator('#watchDirected').isVisible(),`${slug}/${width}: optional directed replay remains`);
  await p.locator('#watchDirected').click();await skip(p);await ready(p);
  await p.close();
 }
 // Pause a held deciding-detail frame; skip and navigate while callbacks are pending.
 const p=await page('short-ball');await p.evaluate(()=>window.__speed=1);await p.locator('#again').click();
 check(await p.evaluate(()=>GSDirected.state.active&&GSDirected.state.phase==='opening'&&t<100),'Replay restarts the opening without skipping the decision');await p.waitForFunction(()=>GSDirected.state.phase==='height');await p.waitForTimeout(1000);
 await p.locator('#playBtn').click();await p.evaluate(()=>window.__speed=1);const held=await p.evaluate(()=>({t,cam:JSON.stringify(cam)}));await p.waitForTimeout(600);
 check(await p.evaluate(()=>GSDirected.state.paused),'held detail can pause');check(await p.evaluate(f=>t===f,held.t),'paused evidence does not advance');
 check(await p.evaluate(()=>[...document.querySelectorAll('#svg text')].filter(e=>/^(CONTACT|TAPE) \d+ CM$/.test(e.textContent)).length===2),'both height measurements visible');
 check(await p.evaluate(()=>[...document.querySelectorAll('#svg text')].filter(e=>/^(CONTACT|TAPE) \d+ CM$/.test(e.textContent)).every(e=>{const r=e.getBBox();return r.x>=0&&r.y>=0&&r.x+r.width<=VW&&r.y+r.height<=VH;})),'height measurement labels fit the phone frame');
 await p.screenshot({path:`${out}/height-paused.png`});await skip(p);await ready(p);
 await p.locator('#askOpts button').nth(0).click();await p.locator('#back').click();await p.waitForURL(url=>!url.pathname.endsWith('play.html'));await p.waitForTimeout(300);await p.close();
 for(const slug of ['short-ball','the-winner']){
  const p=await page(slug,390,true);await ready(p);check(await p.evaluate(()=>!GSDirected.state.active),slug+': reduced-motion opening has no automatic sweep');
  if(slug==='short-ball'){
   await p.locator('#askOpts button').nth(0).click();await skip(p);await board(p);
   check(await p.locator('.directed-option').evaluateAll(es=>es.every(e=>getComputedStyle(e).animationName==='none')),slug+': reduced motion disables tile glow');
  }
  await p.close();
 }
 const denied=await page('short-ball',390,false,true);await skip(denied);await ready(denied);check(true,'storage denial retains usable skip');await denied.close();
 const other=await page('recovery');check(await other.evaluate(()=>GSDirected===null),'unrelated lesson has no director');await other.close();
 check(!errors.length,errors.join('\n')||'no browser errors');
}finally{await browser.close();writeFileSync(out+'/report.json',JSON.stringify({base,engine,checks,errors},null,2));}
console.log(`PASS ${checks.length} directed lesson checks (${engine})`);
