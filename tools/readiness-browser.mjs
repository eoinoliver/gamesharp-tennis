// Readiness content, evidence and complete journeys on phone/tablet/desktop.
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_READINESS_BROWSER||'chromium';
assert(base?.endsWith('/'));const out=`app_src/evidence/readiness-${engine}`;mkdirSync(out,{recursive:true});
const browser=await ({chromium,webkit}[engine]).launch();const checks=[],errors=[];
const check=(ok,name)=>{assert(ok,name);checks.push(name);};
const ready=async p=>{await p.waitForFunction(()=>document.querySelector('#askOpts button:not(:disabled)'));};
try{
for(const size of [{width:375,height:812},{width:430,height:932},{width:820,height:1180},{width:1280,height:900}]){
 const c=await browser.newContext({viewport:size,reducedMotion:size.width===820?'reduce':'no-preference'});
 await c.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));
 const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));
 for(const slug of ['earned-attack','earned-defence','earned-net']){
  await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);await p.waitForSelector('#loading',{state:'hidden'});
  const truth=await p.evaluate(()=>{
   const keys=LESSON.steps.map(s=>s.scene),pair=keys.slice(0,2).map(k=>SC[k]);
   const speed=sc=>{const f=sc.info.freeze,a=actorAt(sc,'you',f).pose[I.hips],b=actorAt(sc,'you',f-1).pose[I.hips];return len(sub(a,b))*100;};
   const frameCounts=pair.map(s=>s.frames);
   const projections=pair.map(sc=>{scene=Object.keys(SC).find(k=>SC[k]===sc);t=sc.info.freeze;setCamera(actorAt(sc,'you',t));buildBasis();return P(ballAt(sc,t)).s;});
   return {sameBall:JSON.stringify(pair[0].ball)===JSON.stringify(pair[1].ball),sameOpponent:JSON.stringify(pair[0].actors.opp)===JSON.stringify(pair[1].actors.opp),sameProjection:JSON.stringify(projections[0])===JSON.stringify(projections[1]),speeds:pair.map(speed),frames:frameCounts,
    noOutcome:Object.values(SC).every(s=>s.info.outcome==='unplayed'&&s.frames===s.info.freeze+1&&s.marks.every(m=>m.kind==='bounce'&&!m.label)),
    noClues:LESSON.steps.every(s=>s.cues===null&&s.rail.join(' ')==='Watch the point Choose your plan Then inspect'),
    hasTransfer:LESSON.steps[2].sit.includes('new')||LESSON.steps[2].sit.includes('Another')};});
  check(truth.sameBall&&truth.sameOpponent,`${slug}: paired ball/opponent identical`);
  check(truth.sameProjection,`${slug}: comparison uses fixed identical camera`);
  check(Math.min(...truth.speeds)<.01&&Math.max(...truth.speeds)>2,`${slug}: visibly different arrival speeds`);
  check(truth.noOutcome&&truth.noClues&&truth.hasTransfer,`${slug}: no invented result or answer cues`);
  await p.evaluate(()=>startStep(0));
  for(let i=0;i<3;i++){
   await ready(p);
   check(await p.locator('[data-arrival-evidence]').count()===0,`${slug} ${i}: no evidence before answer`);
   check(await p.locator('#arrivalNote').count()===0,`${slug} ${i}: no diagnosis before answer`);
   check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${slug} ${i}: fits ${size.width}`);
   await p.screenshot({path:`${out}/${slug}-${size.width}-${i}-question.png`,fullPage:true});
   const correct=await p.evaluate(()=>LESSON.steps[step].correct);
   await p.locator('#askOpts button').nth(correct).click();await p.waitForSelector('[data-arrival-evidence]');
   check(await p.locator('#arrivalNote').isVisible(),`${slug} ${i}: explanation revealed`);
   const score=await p.evaluate(()=>JSON.stringify(ans));
   if(i===1){
    await p.locator('[data-arrival]').first().click();
    check(await p.evaluate(()=>scene===LESSON.steps[step].compareArrival&&silentPlayback),`${slug}: previous arrival replay is quiet`);
    check(await p.locator('[data-arrival]').first().getAttribute('aria-pressed')==='true',`${slug}: selected comparison announced`);
    await p.locator('[data-arrival]').last().click();
   }
   await p.locator('#again').click();
   check(await p.evaluate(()=>scene===LESSON.steps[step].scene&&silentPlayback),`${slug}: replay returns to current arrival`);
   check(await p.evaluate(()=>JSON.stringify(ans))===score,`${slug} ${i}: comparison/replay cannot rescore`);
   await p.locator('#why').click();check(await p.locator('#whyp').isVisible(),`${slug} ${i}: full reasoning available`);
   await p.screenshot({path:`${out}/${slug}-${size.width}-${i}-answer.png`,fullPage:true});
   await p.locator('#next').click();
  }
  await p.waitForSelector('#saveCue');await p.locator('#saveCue').click();
  check(await p.evaluate(slug=>GSApp.S.done[slug].n===3,slug),`${slug}: completion 3/3 recorded`);
  check(await p.evaluate(()=>JSON.parse(localStorage.getItem('gs_my_game')).some(c=>c.cue===LESSON.cue)),`${slug}: cue saved`);
  check(await p.locator('#nextDaily').isVisible(),`${slug}: next challenge offered`);
  // Every offered choice: inspect text and evidence, preserve first answer.
  if(size.width===375){for(let i=0;i<3;i++)for(let j=0;j<2;j++){
   await p.evaluate(i=>{ans=[null,null,null];startStep(i);},i);await ready(p);await p.locator('#askOpts button').nth(j).click();
   await p.waitForSelector('[data-arrival-evidence]');
   check(await p.evaluate(({i,j})=>ans[i]===LETTERS[j],{i,j}),`${slug} ${i}${j}: first answer retained`);
   check((await p.locator('#verdict .copy').innerText()).length>12,`${slug} ${i}${j}: authored feedback`);
  }}
 }
 await c.close();
}
check(errors.length===0,'No page errors');
}finally{await browser.close();writeFileSync(`${out}/report.json`,JSON.stringify({checks,errors},null,2));}
console.log(`PASS ${checks.length} readiness checks (${engine})`);
