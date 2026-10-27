// Every authored question, including all reachable branch nodes, must show action.
import {chromium,webkit} from 'playwright';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2]||'http://127.0.0.1:8772/';
const engine=process.env.GS_ACTION_BROWSER==='webkit'?webkit:chromium;
const out=`app_src/evidence/question-action/${engine.name()}`;mkdirSync(out,{recursive:true});
const browser=await engine.launch(),report=[],errors=[];let checks=0;
const check=(ok,msg)=>{assert.ok(ok,msg);checks++;};
try{
 const c=await browser.newContext({viewport:{width:390,height:844}});
 await c.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));
 const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));
 const cat=JSON.parse(readFileSync('app/catalog.js','utf8').match(/GS_CATALOG=(.*);\n/)[1]);
 for(const l of [...cat.daily,...cat.predict,...cat.play]){
  await p.goto(base+'play.html?l='+l.slug);await p.waitForFunction(()=>window.__test);
  const rows=await p.evaluate(()=>{
   window.__speed=12;window.__sounds=[];
   for(const k of ['hit','bounce','applause']){const fn=GSSfx[k].bind(GSSfx);GSSfx[k]=(...args)=>{__sounds.push({kind:k,frame:t,scene,playing});return fn(...args);};}
   window.__questions=LESSON.branch?Object.values(LESSON.nodes):LESSON.steps.slice();
   return __questions.map(S=>{
    const q=questionRange(S),sc=SC[q.scene];let first=null,ballTravel=0,jointTravel=0,prev=null,prevPose=null;
    for(let f=q.from;f<=q.to;f+=4){
     const b=ballAt(sc,f),pose=['you','opp'].flatMap(k=>actorAt(sc,k,f)?.pose||[]);
     if(b&&prev)ballTravel+=Math.hypot(...b.map((v,i)=>v-prev[i]));
     if(prevPose)jointTravel+=Math.max(...pose.map((p,i)=>Math.hypot(...p.map((v,j)=>v-prevPose[i][j]))));
     if(b&&!first)first=b;prev=b;prevPose=pose;
    }
    const held=Object.values(SC).filter(x=>endsOnYou(x));
    return{question:S.scene,...q,ballTravel,jointTravel,held:held.length,phantoms:held.filter(x=>audibleEvents(x).some(([f,k])=>k==='hit'&&f>=endsOnYou(x).L-2)).length};
   });
  });
  for(let i=0;i<rows.length;i++){
   const r=rows[i],id=l.slug+'/'+r.question;
   check(r.to-r.from>=30,id+': meaningful action interval');
   check(r.ballTravel>.2||r.jointTravel>.2,id+': observable ball or player movement');
   check(r.phantoms===0,id+': no racket sound for a held incoming ball');
   // Exercise the real RAF/run/stop path, not just the opening metadata.
   const live=await p.evaluate(async i=>{
    sitT.forEach(clearTimeout);clearTimeout(window.__flowT);window.__trail=[];
    const S=__questions[i];step=0;answered=false;chosen=null;showTargets=null;done=false;LESSON.steps=[S];
    paintAsk(S);$('sitTx').textContent=S.sit.replace(/<[^>]*>/g,'');
    let samples=0,lastFrame=null,changes=0,doneRun=false;
    const sample=()=>{if(doneRun)return;samples++;const f=$('stage').innerHTML;if(lastFrame&&f!==lastFrame)changes++;lastFrame=f;requestAnimationFrame(sample);};
    const start=__sounds.length;
    await new Promise(resolve=>{playQuestion(S,()=>{doneRun=true;enableAsk();resolve();});requestAnimationFrame(sample);});
    const freeze=t,sounds=__sounds.length;await new Promise(r=>setTimeout(r,100));
    return{samples,changes,freeze,stopAt,playing,stable:t===freeze,quiet:__sounds.length===sounds,sounds:__sounds.slice(start),enabled:[...$('askOpts').children].every(b=>!b.disabled),caption:$('questionContext').textContent};
   },i);
   check(live.changes>1&&live.samples>2,id+': rendered motion actually advances');
   check(!live.playing&&live.freeze===r.to&&live.stable&&live.quiet,id+': freeze is stable and silent');
   check(live.enabled,id+': choices available after playback');
   if(r.type==='lead-in')check(live.sounds.length===0,id+': repeated lead-in has no duplicated contacts');
   if(r.type!=='decision')await p.screenshot({path:`${out}/${l.slug}-${r.question}.png`,fullPage:true});
   report.push({lesson:l.slug,...r,live});
  }
 }
 if(report.length)writeFileSync(`${out}/catalogue.json`,JSON.stringify(report,null,2));
 // Deep return options must keep feet and racket inside the actual desktop view.
 const desktop=await c.newPage();await desktop.setViewportSize({width:1100,height:900});
 await desktop.goto(base+'play.html?l=find-your-return-spot');await desktop.waitForFunction(()=>window.__test);
 const margin=await desktop.evaluate(()=>{
  answered=true;showTargets=null;camI=0;window.__camOverride=null;let min=Infinity;
  for(const [key,sc]of Object.entries(SC))for(let f=0;f<sc.frames;f+=3){
   scene=key;t=f;const you=actorAt(sc,'you',f);setCamera(you);buildBasis();fitFull();
   for(const a of [you,actorAt(sc,'opp',f)])for(const pt of [...a.pose,a.rq.centre,add(a.pose[I.head],[0,0,.42])]){
    const q=P(pt);min=Math.min(min,q?Math.min(...q.s,VW-q.s[0],VH-q.s[1]):-Infinity);
   }
  }return min;
 });
 check(margin>=20,'deep return Broadcast keeps both full bodies and rackets inside the frame');await desktop.close();
 // Normal UI gates: ball return example must finish before a choice can be made.
 await p.goto(base+'play.html?l=second-serve');await p.waitForFunction(()=>window.__test);
 await p.evaluate(()=>startStep(1));
 check(await p.locator('#askOpts button:disabled').count()===await p.locator('#askOpts button').count(),'second serve: answers gated during action');
 await p.waitForFunction(()=>!playing&&document.querySelector('#askOpts button:not(:disabled)'));
 check(await p.evaluate(()=>t===420&&contactsOf(SC[scene],'opp').some(f=>f<t)),'second serve: receiver actually strikes before question opens');
 const caption=await p.locator('#questionContext').boundingBox(),sound=await p.locator('[data-gs-sound]').boundingBox();
 check(!caption||!sound||caption.x+caption.width<=sound.x||caption.y+caption.height<=sound.y,'context label clears sound button');
 await p.screenshot({path:`${out}/second-serve-real-time.png`,fullPage:true});
 // A wrong first answer remains wrong after watching the best option; no applause.
 await p.evaluate(()=>{window.__speed=16;window.__praise=0;const a=GSSfx.applause;GSSfx.applause=(...v)=>{__praise++;return a(...v);};ans=[null,null,null];startStep(0);});
 for(let i=0;i<3;i++){
  await p.waitForFunction(()=>document.querySelector('#askOpts button:not(:disabled)'));
  const index=await p.evaluate(i=>i===1?(LESSON.steps[step].correct+1)%LESSON.steps[step].opts.length:LESSON.steps[step].correct,i);
  await p.locator('#askOpts button').nth(index).click();await p.waitForSelector('#verdict:not([hidden]) #next');
  if(i===1){await p.locator('#tryOther').click();await p.waitForSelector('#verdict:not([hidden]) #next');check(await p.evaluate(()=>ans[1]!==LETTERS[LESSON.steps[1].correct]),'better-option demo preserves original miss');}
  await p.locator('#next').click();
 }
 await p.waitForSelector('#redo');check(await p.evaluate(()=>__praise===0),'2/3 completion does not applaud');
 check(errors.length===0,errors.join('\n'));
 writeFileSync(`${out}/report.json`,JSON.stringify({checks,questions:report.length,report,errors},null,2));
 console.log(`PASS ${engine.name()}: ${checks} action assertions, ${report.length} questions across ${cat.daily.length+cat.predict.length+cat.play.length} lessons`);
}finally{await browser.close();}
