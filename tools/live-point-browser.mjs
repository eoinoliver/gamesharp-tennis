import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_LIVE_BROWSER||'chromium';
assert(base?.endsWith('/'));
const browser=await ({chromium,webkit}[engine]).launch(),checks=[],errors=[];
const out=`app_src/evidence/live-point/${engine}`;mkdirSync(out,{recursive:true});
const check=(ok,msg)=>{assert(ok,msg);checks.push(msg);};
try{
for(const width of [375,820,1280]){
 const c=await browser.newContext({viewport:{width,height:900},hasTouch:width<1000,reducedMotion:width===820?'reduce':'no-preference'});
 await c.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));
 const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));
 for(const slug of ['live-point-buy-time','live-point-other-wing']){
  const paths=slug==='live-point-buy-time'?[...Array.from({length:16},(_,n)=>n.toString(2).padStart(4,'0').replaceAll('0','A').replaceAll('1','B')).filter(p=>!p.startsWith('AB')),'ABA','ABB']:['AA','AB','BA','BB'];
  for(const path of paths){
   await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);await p.waitForSelector('#loading',{state:'hidden'});
   await p.evaluate(()=>{window.__speed=18;const timer=setTimeout;window.setTimeout=(fn,ms,...a)=>timer(fn,ms/10,...a);});
   for(let i=0;i<path.length;i++){
    await p.waitForFunction(()=>document.querySelector('#askOpts button:not(:disabled)'));
    check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${slug}/${path}/${width}/${i}: fits`);
    if(width===375&&path==='BA')await p.screenshot({path:`${out}/${slug}-${i}-question.png`,fullPage:true});
    if(i===1)check(await p.evaluate(()=>silentPlayback),`${slug}/${path}: repeated lead-in is silent`);
    await p.locator('#askOpts button').nth('AB'.indexOf(path[i])).click();
    await p.waitForSelector('#verdict:not([hidden]) #next');
    check(await p.evaluate(()=>!playing),`${slug}/${path}/${i}: consequence settles before feedback`);
    if(i===0&&width===375&&path==='AA'&&slug==='live-point-buy-time'){
     await p.locator('#tryOther').click();await p.waitForSelector('#verdict:not([hidden]) #next');
     check(await p.locator('#next').innerText()==='Continue your chosen route →','Alternative demo clearly continues original route');
     check(await p.evaluate(()=>ans[0]==='A'),'Alternative demo preserves first answer');
    }
    if(i===0)check(await p.evaluate(X=>LESSON.steps[1].scene===LESSON.branch+X,path[0]),`${slug}/${path}: first choice changes next situation`);
    if(width===375&&path==='BA')await p.screenshot({path:`${out}/${slug}-${i}-answer.png`,fullPage:true});
    await p.locator('#next').click();
   }
   await p.waitForSelector('#saveCue');await p.waitForFunction(()=>!playing);
   check(await p.evaluate(path=>LESSON.finaleScene===LESSON.branch+path,path),`${slug}/${path}: finale follows committed route`);
   check(await p.evaluate(()=>SC[LESSON.finaleScene].info.outcome==='in_play'),`${slug}/${path}: no manufactured win/loss`);
   check((await p.locator('#svg').textContent()).includes('AT THEIR HIT'),`${slug}/${path}: decisive position annotated`);
   check((await p.locator('#wrapup').innerText()).includes('The point is still in play'),`${slug}/${path}: outcome explained`);
   check(await p.evaluate(path=>{const slug=new URL(location).searchParams.get('l'),d=GSApp.S.done[slug],a=GSApp.S.liveAttempts[slug].at(-1);return (d.lastTotal||d.total)===path.length&&a.result.total===path.length&&a.reads.map(r=>r.pick).join('')===path;},path),`${slug}/${path}: complete attempt records its own connected decisions and denominator`);
   check(await p.evaluate(()=>{const slug=new URL(location).searchParams.get('l'),first=GSApp.S.liveAttempts[slug][0];return GSApp.S.done[slug].total===first.result.total&&JSON.stringify(GSApp.S.liveReads[slug])===JSON.stringify(first.reads);}),`${slug}/${path}: first route and score remain unchanged`);
   const before=await p.evaluate(()=>JSON.stringify(ans));
   await p.locator('#replayTurningPoint').click();await p.waitForFunction(()=>!playing);
   check(await p.evaluate(()=>JSON.stringify(ans))===before,`${slug}/${path}: replay preserves decisions`);
   check(await p.evaluate(()=>silentPlayback),`${slug}/${path}: inspection is silent`);
   await p.locator('#compareRecovery').click();await p.waitForFunction(()=>!playing);
   check((await p.locator('#questionContext').textContent()).startsWith('Alternative'),`${slug}/${path}: comparison labelled on court`);
   check(await p.evaluate(()=>scene!==LESSON.finaleScene),`${slug}/${path}: alternative movement shown`);
   check(await p.evaluate(()=>JSON.stringify(ans))===before,`${slug}/${path}: comparison cannot rescore`);
   await p.locator('#saveCue').click();
   check(await p.evaluate(()=>JSON.parse(localStorage.getItem('gs_my_game')).some(c=>c.cue===LESSON.cue)),`${slug}: cue saved`);
   if(path==='BA')await p.screenshot({path:`${out}/${slug}-${width}-ending.png`,fullPage:true});
  }
  const motion=await p.evaluate(()=>{
   const root=LESSON.branch,results=[];
   for(const X of 'AB'){
    const pair=['A','B'].map(Y=>SC[root+X+Y]);
    const hit=pair[0].info.liveRecovery.theirHit;
    results.push({sameBall:JSON.stringify(pair[0].ball)===JSON.stringify(pair[1].ball),sameOpponent:JSON.stringify(pair[0].actors.opp)===JSON.stringify(pair[1].actors.opp),
      gap:len(sub(actorAt(pair[0],'you',hit).pose[I.hips],actorAt(pair[1],'you',hit).pose[I.hips])),
      continuity:pair.map(s=>len(sub(actorAt(SC[root+X],'you',226).pose[I.hips],actorAt(s,'you',226).pose[I.hips])))});
   }return results;
  });
  for(const m of motion){check(m.sameBall&&m.sameOpponent,'Recovery comparison isolates movement');check(m.gap>1.5,'Recovery makes a visible positional difference');check(m.continuity.every(x=>x<.001),'No position jump at decision handoff');}
 }
 await c.close();
}
check(!errors.length,'No page errors');
}finally{await browser.close();writeFileSync(`${out}/report.json`,JSON.stringify({checks,errors},null,2));}
console.log(`PASS ${checks.length} Live Point checks (${engine})`);
