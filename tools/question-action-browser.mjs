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
    const S=__questions[i];window.__trail=[];LESSON.steps=[S];
    // Accelerate waits, but exercise the actual Daily/Predict startStep and RAF.
    const nativeTimeout=window.setTimeout;
    window.setTimeout=(fn,delay,...args)=>nativeTimeout(fn,delay/12,...args);
    let samples=0,lastFrame=null,changes=0,earlyWords=false,earlyAsk=false,firstWord=null;
    const start=__sounds.length;
    try{
     startStep(0);
     const reserved=$('sitTx').getBoundingClientRect().height;
     const during={words:document.querySelectorAll('#sitTx .w.on').length,inert:zone.inert,
       hidden:getComputedStyle($('askQ')).visibility==='hidden',silentText:$('sitTx').getAttribute('aria-hidden')==='true'};
     await new Promise((resolve,reject)=>{
      const deadline=performance.now()+15000;
      function sample(){
       samples++;const f=$('stage').innerHTML;if(lastFrame&&f!==lastFrame)changes++;lastFrame=f;
       const words=document.querySelectorAll('#sitTx .w.on').length;
       if(words&&!firstWord)firstWord={frame:t,playing};
       if(words&&playing)earlyWords=true;
       const enabled=[...$('askOpts').children].some(b=>!b.disabled);
       if(enabled&&(playing||words!==document.querySelectorAll('#sitTx .w').length))earlyAsk=true;
       if(enabled){resolve();return;}
       if(performance.now()>deadline){reject(Error('Question never ready'));return;}
       requestAnimationFrame(sample);
      }requestAnimationFrame(sample);
     });
     const freeze=t,sounds=__sounds.length;await new Promise(r=>nativeTimeout(r,100));
     return{samples,changes,freeze,stopAt,playing,stable:t===freeze,quiet:__sounds.length===sounds,
       sounds:__sounds.slice(start),enabled:[...$('askOpts').children].every(b=>!b.disabled),
       caption:$('questionContext').textContent,during,earlyWords,earlyAsk,firstWord,
       stableTextHeight:Math.abs(reserved-$('sitTx').getBoundingClientRect().height)<1};
    }finally{window.setTimeout=nativeTimeout;}
   },i);
   check(live.changes>1&&live.samples>2,id+': rendered motion actually advances');
   check(!live.playing&&live.freeze===r.to&&live.stable&&live.quiet,id+': freeze is stable and silent');
   check(live.enabled,id+': choices available after playback and reading');
   check(live.during.words===0&&live.during.inert&&live.during.hidden&&live.during.silentText,id+': action begins without competing setup or choices');
   check(!live.earlyWords&&live.firstWord?.frame===r.to&&!live.firstWord.playing,id+': first word follows completed animation');
   check(!live.earlyAsk,id+': choices follow the complete sentence');
   check(live.stableTextHeight,id+': reserved text space prevents layout shift');
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
 // At normal reading speed, pause and replay must not leak a stale sentence.
 for(const slug of ['serve-plus-one','predict-the-point']){
  await p.goto(base+'play.html?l='+slug);await p.waitForFunction(()=>window.__test);
  await p.evaluate(()=>{window.__speed=4;startStep(0);setPlaying(false);});
  await p.waitForTimeout(500);
  check(await p.locator('#sitTx .w.on').count()===0,slug+': pausing the action does not start reading');
  await p.locator('#playBtn').click();
  await p.waitForFunction(()=>document.querySelectorAll('#sitTx .w.on').length>=2);
  check(await p.evaluate(()=>!playing&&zone.inert),slug+': reading follows action, before choices');
  await p.locator('#again').click();await p.evaluate(()=>setPlaying(false));
  await p.waitForTimeout(700);
  check(await p.locator('#sitTx .w.on').count()===0,slug+': replay cancels old typing');
  check(await p.evaluate(()=>zone.inert&&[...$('askOpts').children].every(b=>b.disabled)),slug+': replay cannot enable old choices');
  await p.evaluate(()=>{window.__speed=8;startStep(1);});
  await p.waitForFunction(()=>document.querySelectorAll('#sitTx .w.on').length>=2);
  await p.locator('#back').click();await p.evaluate(()=>setPlaying(false));
  await p.waitForTimeout(700);
  check(await p.evaluate(()=>step===0&&!document.querySelector('#sitTx .w.on')&&zone.inert),slug+': back cancels the next question reading');
 }
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
