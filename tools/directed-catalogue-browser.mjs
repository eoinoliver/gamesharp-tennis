import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_DIRECTED_BROWSER||'chromium';
const cat=JSON.parse(readFileSync('app/catalog.js','utf8').match(/GS_CATALOG=(.*);\n/)[1]);
const rows=[...cat.daily,...cat.predict,...cat.play].filter(l=>!process.env.GS_DIRECTED_SLUGS||process.env.GS_DIRECTED_SLUGS.split(',').includes(l.slug));
const out=`app_src/evidence/directed-catalogue-${engine}`;mkdirSync(out,{recursive:true});
const browser=await ({chromium,webkit}[engine]).launch(),checks=[],errors=[],coverage=[];
const check=(v,label)=>{assert(v,label);checks.push(label);};
async function skip(p){await p.evaluate(()=>GSDirected.skip());}
async function ready(p){await p.waitForFunction(()=>!zone.inert&&[...document.querySelectorAll('#askOpts button')].some(b=>!b.disabled));}
try{
 for(const width of (process.env.GS_DIRECTED_WIDTHS||'390,1280').split(',').map(Number))for(const l of rows){
  const p=await browser.newPage({viewport:{width,height:width<700?844:900}});
  p.on('pageerror',e=>errors.push(l.slug+': '+e.message));
  await p.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));
  await p.addInitScript(()=>{window.__speed=12;localStorage.setItem('gs_voice','off');});
  await p.goto(base+'play.html?l='+l.slug);await p.waitForFunction(()=>window.__test);await skip(p);await ready(p);
  const predict=await p.evaluate(()=>!!LESSON.predict);let decisions=0;
  const scenes=[];
  while(!await p.evaluate(()=>done)){
   await ready(p);
   const before=await p.evaluate(()=>({scene:LESSON.steps[step].scene,step,correct:LESSON.steps[step].correct,opts:LESSON.steps[step].opts.length,ans:ans.slice(),predict:!!LESSON.predict,branch:!!LESSON.branch}));
   const tag=`${l.slug}/${width}/${before.scene}`;scenes.push(before.scene);
   check(await p.locator('#askOpts button:visible').count()===before.opts,tag+': all original options at decision');
   check(await p.locator('#askOpts .directed-pick').count()===0,tag+': recommendation withheld before commitment');
   check(await p.locator('#askOpts .directed-choice').count()===before.opts,tag+': option identity colours available');
   // Mobile follows the model; desktop chooses another route, so connected paths differ.
   const chosen=width<700?before.correct:(before.correct+1)%before.opts;
   await p.locator('#askOpts button').nth(chosen).click();decisions++;
   if(predict){
    if(decisions<3)await p.waitForFunction(i=>step>i,before.step);
    else await p.waitForFunction(()=>done,null,{timeout:60000});
    await skip(p);continue;
   }
   // First decision plays the real sequence; subsequent ones exercise skip.
   if(decisions>1)await skip(p);
   await p.locator('#verdict:not([hidden]) #next').waitFor({timeout:60000});
   const original=await p.evaluate(()=>({ans:ans.slice(),route:LESSON.steps.map(s=>s.scene),finale:LESSON.finaleScene}));
   check(original.ans[before.step]==='ABCD'[chosen],tag+': first answer saved');
   check(await p.locator('#askOpts button:visible').count()===(chosen===before.correct?1:2),tag+': compact feedback');
   check(await p.locator('#askOpts .directed-pick').count()===1,tag+': exactly one GS tick');
   check((await p.locator('#askOpts .directed-pick').innerText()).replace(/\s+/g,' ').trim()==='GS ✓',tag+': correct brand label');
   check(await p.locator('#askOpts button').nth(before.correct).locator('.directed-pick').count()===1,tag+': tick follows authored recommendation');
   if(decisions===1){
    await p.screenshot({path:`${out}/${l.slug}-${width}.png`,fullPage:true});
    if(await p.locator('#exploreDirected').isVisible()){await p.locator('#exploreDirected').focus();await p.keyboard.press('Enter');}
    check(await p.locator('#askOpts button:visible').count()===before.opts,tag+': explore exposes all available answers');
    // Review each answer, including observation-only scenes, without altering the saved route.
    for(let j=0;j<before.opts;j++){
     if(!await p.locator('#askOpts button').nth(j).isVisible())await p.locator('#exploreDirected').click();
     await p.locator('#askOpts button').nth(j).focus();await p.keyboard.press('Enter');await skip(p);
     await p.locator('#verdict:not([hidden]) #next').waitFor();
     check(await p.evaluate(original=>JSON.stringify({ans:ans.slice(),route:LESSON.steps.map(s=>s.scene),finale:LESSON.finaleScene})===JSON.stringify(original),original),tag+': explore '+j+' preserves first answers and connected route');
    }
    if(await p.locator('#directedOther').isVisible()){await p.locator('#directedOther').click();await skip(p);}
   }
   check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),tag+': no horizontal overflow');
   await p.locator('#why').click();check(await p.locator('#whyp').isVisible(),tag+': coaching retained');
   await p.locator('#next').click();await skip(p);
   assert(decisions<8,tag+': journey terminates');
  }
  if(await p.locator('#skipRecap').isVisible())await p.locator('#skipRecap').click();
  await p.waitForFunction(slug=>!!GSApp.S.done[slug],l.slug,{timeout:60000});
  check(await p.evaluate(({slug,width})=>GSApp.S.done[slug].total>0&&(width>=700||GSApp.S.done[slug].best===GSApp.S.done[slug].total),{slug:l.slug,width}),l.slug+'/'+width+': real completion and score persisted');
  if(predict){
   check(await p.locator('.review .directed-pick').count()===3,l.slug+': Predict recommendations only in review');
   const saved=await p.evaluate(()=>ans.slice());
   await p.locator('.review .directed-compare button').first().click();
   await p.locator('.review .opts button').first().click();await skip(p);
   check(await p.evaluate(saved=>JSON.stringify(ans)===JSON.stringify(saved),saved),l.slug+': Predict exploration preserves score');
   await p.screenshot({path:`${out}/${l.slug}-${width}.png`,fullPage:true});
  }
  await p.reload();await p.waitForFunction(()=>window.__test);await ready(p);
  check(await p.evaluate(()=>!GSDirected.active),l.slug+'/'+width+': repeat opening skips film');
  check(await p.locator('#watchDirected').isVisible(),l.slug+'/'+width+': optional scene replay remains');
  coverage.push({slug:l.slug,width,decisions,scenes});await p.close();console.log('PASS',l.slug,width,decisions);
 }
 check(!errors.length,errors.join('\n')||'no browser errors');
}finally{await browser.close();writeFileSync(out+'/report.json',JSON.stringify({base,engine,checks,errors,coverage},null,2));}
console.log(`PASS ${checks.length} catalogue checks; ${coverage.length} complete journeys (${engine})`);
