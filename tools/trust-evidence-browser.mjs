import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_TRUST_BROWSER||'chromium';
const cat=JSON.parse(readFileSync('app/catalog.js','utf8').match(/GS_CATALOG=(.*);\n/)[1]);
const rows=[...cat.daily,...cat.predict,...cat.play];
const out=`app_src/evidence/trust-evidence-${engine}`;mkdirSync(out,{recursive:true});
const browser=await ({chromium,webkit}[engine]).launch(),checks=[],descriptions=[],errors=[];
const check=(ok,msg)=>{assert(ok,msg);checks.push(msg);};
const ready=p=>p.waitForFunction(()=>!zone.inert&&document.querySelector('#askOpts button:not(:disabled)'));
async function load(p,slug){await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);await p.evaluate(()=>GSDirected.skip());await ready(p);}
async function answer(p,j){await p.locator('#askOpts button').nth(j).click();await p.evaluate(()=>GSDirected.skip());await p.locator('#verdict:not([hidden]) #next').waitFor();}
try{
 const p=await browser.newPage({viewport:{width:375,height:667}});p.on('pageerror',e=>errors.push(e.message));
 await p.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));
 await p.addInitScript(()=>{window.__speed=16;localStorage.setItem('gs_voice','off');});
 for(const l of rows){
  await load(p,l.slug);
  const found=await p.evaluate(()=>{
   const steps=LESSON.branch?Object.values(LESSON.nodes):LESSON.steps;
   return steps.map(S=>{
    const q=questionRange(S),text=GSSceneEvidence.describe(S);
    // Recommendations and outcomes must not influence pre-answer evidence.
    const altered={...S,correct:999,alsoOk:[999],lines:{},take:'SECRET',payoff:'SECRET',why:'SECRET',opts:['SECRET']};
    return {scene:S.scene,range:q,text,independent:GSSceneEvidence.describe(altered)===text};
   });
  });
  for(const d of found){
   check(d.independent,l.slug+'/'+d.scene+': description independent of grading and answer copy');
   check(d.text.includes('Your opponent is')&&d.text.includes('You are')&&!/undefined|NaN|SECRET/.test(d.text),l.slug+'/'+d.scene+': actual court description');
   descriptions.push({slug:l.slug,...d});
  }
  check(await p.locator('#sceneDescription').count()===1,l.slug+': one description control');
  check(!await p.locator('#sceneDescription').evaluate(e=>e.open),l.slug+': quiet collapsed default');
  const text=await p.locator('#sceneDescriptionText').textContent();
  check(await p.locator('#svg').getAttribute('aria-label')===text,l.slug+': evidence available without opening disclosure');
  await p.locator('#sceneDescription summary').focus();await p.keyboard.press('Enter');
  check(await p.locator('#sceneDescriptionText').isVisible(),l.slug+': keyboard opens description');
  check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),l.slug+': no expanded-description overflow');
  await p.keyboard.press('Enter');
  await p.locator('#watchDirected').click();
  check(!await p.locator('#sceneDescriptionText').count()||await p.evaluate(()=>!zone.inert),l.slug+': stale evidence removed during playback');
  await p.evaluate(()=>GSDirected.skip());await ready(p);
  check(await p.locator('#sceneDescription').count()===1,l.slug+': one description after replay');
  if(['contact-clue','split-step','short-ball','earned-attack','doubles-cross-cover','recovery','predict-the-point'].includes(l.slug)){
   await p.locator('#sceneDescription summary').click();await p.screenshot({path:`${out}/${l.slug}-description.png`,fullPage:true});
  }
 }
 // Non-grading evidence must not describe future timing or receiver contacts.
 const desc=(slug,scene)=>descriptions.find(d=>d.slug===slug&&d.scene===scene).text;
 check(desc('contact-clue','cp1').includes('tucked close')&&desc('contact-clue','cp2').includes('space away'), 'contact spacing is distinguished');
 check(desc('split-step','ss1').includes('before their hit')&&desc('split-step','ss2').includes('just after their hit')&&!desc('split-step','ss3').includes('In the replay'), 'only completed split-step evidence described');
 check(desc('second-serve','sq1').includes('two serves just shown')&&!desc('second-serve','sq2').includes('receiver meets'),'no future receiver comparison leaked');
 check(desc('earned-attack','ea1').includes('finished moving')&&desc('earned-attack','ea2').includes('still moving'),'arrival contrast preserved');
 check(desc('doubles-cross-cover','dcA').includes('Your partner is')&&desc('doubles-cross-cover','dcA').includes('Their partner is'),'held doubles continuation includes all four players');
 for(const width of [320,375,1280]){
  await p.setViewportSize({width,height:width<700?667:900});await load(p,'recovery');
  const first=await p.evaluate(()=> (LESSON.steps[0].correct+1)%LESSON.steps[0].opts.length);
  await answer(p,first);const original=await p.evaluate(()=>ans.slice()),correct=await p.evaluate(()=>LESSON.steps[0].correct);
  await answer(p,correct);
  check((await p.locator('#directedIdentity').textContent())===`Viewing ${'ABCD'[correct]} · First answer ${'ABCD'[first]}`,width+': explored answer distinguished beside feedback');
  check(await p.locator('#askOpts button:visible').count()===1,width+': original answer identity survives compact single tile');
  check(await p.evaluate(original=>JSON.stringify(ans)===JSON.stringify(original),original),width+': exploration does not rescore');
  check(!/saved|best:/i.test(await p.locator('#verdict').innerText()),width+': no durability or binary-best claim');
  check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),width+': feedback no overflow');
  await p.locator('#why').click();check(await p.locator('#whyp').isVisible(),width+': existing explanation accessible');await p.locator('#why').click();
  await p.locator('.fb').evaluate(async e=>{await Promise.all(e.getAnimations().map(a=>a.finished));});
  await p.screenshot({path:`${out}/recovery-feedback-${width}.png`,fullPage:true});
  await load(p,'short-ball');await answer(p,2);
  const next=await p.locator('#next').boundingBox();
  check(width!==375||next.y+next.height<=667,width+': compact phone feedback keeps Next in viewport');
  await p.locator('.fb').evaluate(async e=>{await Promise.all(e.getAnimations().map(a=>a.finished));});
  await p.screenshot({path:`${out}/short-ball-feedback-${width}.png`,fullPage:true});
 }
 await load(p,'short-ball');await answer(p,0);await answer(p,2);
 await p.locator('#inspectContact').click();
 check((await p.locator('[data-contact=first]').textContent())==='Option C','contact comparison identifies the explored option');
 check((await p.locator('[data-contact=first]').getAttribute('aria-label')).startsWith('Option C:'),'accessible contact label does not call an alternative the first choice');
 check((await p.locator('[data-contact=outcome]').textContent())==='Result · C →','contact result names the viewed option');
 check((await p.locator('#directedIdentity').textContent())==='Viewing C · First answer A','contact inspection retains original answer identity');
 await load(p,'high-ball');await answer(p,1);
 check((await p.locator('.fb .lab').textContent())==='Also works','accepted alternative keeps credit without conflicting best label');
 // Complete a real Predict attempt; exploration changes the viewed option only.
 await load(p,'predict-the-point');
 for(let i=0;i<3;i++){
  await ready(p);await p.locator('#askOpts button').first().click();
  await p.waitForFunction(i=>step>i,i);await p.evaluate(()=>GSDirected.skip());
 }
 await p.waitForFunction(()=>done,null,{timeout:60000});
 if(await p.locator('#skipRecap').isVisible())await p.locator('#skipRecap').click();
 const saved=await p.evaluate(()=>ans.slice());
 await p.locator('.review .directed-compare button').first().click();await p.locator('.review .opts button').nth(1).click();
 check((await p.locator('#directedCaption small').textContent()).includes('Alternative B'),'Predict caption identifies alternative');
 await p.evaluate(()=>GSDirected.skip());
 check((await p.locator('.review .directed-identity').first().textContent())==='Viewing B · First answer A','Predict review preserves identity');
 check(await p.evaluate(a=>JSON.stringify(ans)===JSON.stringify(a),saved),'Predict original scores retained');
 await p.close();
 // Blocked storage and an ordinary unfinished refresh must not promise persistence.
 for(const blocked of [false,true]){
  const c=await browser.newContext({viewport:{width:390,height:844}});
  if(blocked)await c.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Blocked','QuotaExceededError');};});
  const p=await c.newPage();await p.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));await load(p,'recovery');await answer(p,0);
  check(!/saved/i.test(await p.locator('#verdict').innerText()),`storage blocked ${blocked}: no false saved claim`);
  check(await p.evaluate(()=>ans[0]==='A'),`storage blocked ${blocked}: first answer counts in this attempt`);
  await p.reload();await p.waitForFunction(()=>window.__test);await p.evaluate(()=>GSDirected.skip());await ready(p);
  check(await p.evaluate(()=>ans.every(a=>a==null)),`storage blocked ${blocked}: existing unfinished-refresh semantics unchanged`);
  await c.close();
 }
 check(!errors.length,errors.join('\n')||'no browser errors');
}finally{await browser.close();writeFileSync(out+'/report.json',JSON.stringify({base,engine,checks,descriptions,errors},null,2));}
console.log(`PASS ${checks.length} trust/evidence checks; ${descriptions.length} decisions (${engine})`);
