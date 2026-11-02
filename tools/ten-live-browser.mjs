import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {openCompletionPanels} from './completion-panels.mjs';
const base=process.argv[2],engine=process.env.GS_LIVE_BROWSER||'chromium';
const rows=JSON.parse(readFileSync('docs/features/ten-live-voice.json')).filter(r=>!process.env.GS_BATCH||r.batch===+process.env.GS_BATCH);
const dir=`app_src/evidence/ten-live/${process.env.GS_STAGE||'local'}-${engine}`;mkdirSync(dir,{recursive:true});
const browser=await ({chromium,webkit}[engine]).launch(),errors=[],report=[],checks=[];
const check=(ok,label)=>{assert(ok,label);checks.push(label);};
try{
 for(const width of (process.env.GS_WIDTHS||'390,1280').split(',').map(Number)){
  const c=await browser.newContext({viewport:{width,height:width===390?844:900},hasTouch:width<1000});
  await c.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));
  await c.addInitScript(()=>{
   window.__heard=[];const assets=new WeakMap(),fetch=window.fetch.bind(window);
   window.fetch=async(...args)=>{const r=await fetch(...args),read=r.arrayBuffer.bind(r);r.arrayBuffer=async()=>{const b=await read();assets.set(b,String(args[0]));return b;};return r;};
   const AC=window.AudioContext||window.webkitAudioContext;
   window.AudioContext=class extends AC{
    async decodeAudioData(b){const v=await super.decodeAudioData(b);v.__asset=assets.get(b);return v;}
    createBufferSource(){const s=super.createBufferSource(),start=s.start.bind(s);s.start=(...a)=>{__heard.push({asset:s.buffer.__asset,moving:window.__test?.state().playing});return start(...a);};return s;}
   };
  });
  const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));
  for(const row of rows)for(const path of ['AA','AB','BA','BB']){
   const label=`${row.lesson}/${path}/${width}`;await p.goto(base+'play.html?l='+row.lesson);await p.waitForFunction(()=>window.__test);
   await p.waitForSelector('#loading',{state:'hidden'});
   if(!process.env.GS_NORMAL)await p.evaluate(()=>window.__speed=16);
   for(let i=0;i<2;i++){
    await p.waitForFunction(()=>document.querySelector('#askOpts button:not(:disabled)'));
    check(await p.evaluate(()=>!playing&&document.documentElement.scrollWidth<=innerWidth),label+' question fits and follows motion');
    if(width===390)await p.locator('#stage').screenshot({path:`${dir}/${row.lesson}-${path}-q${i+1}.png`});
    if(i===1)check(await p.evaluate(()=>t===SC[scene].info.freeze),label+' same next contact');
    await p.locator('#askOpts button').nth('AB'.indexOf(path[i])).click();await p.waitForSelector('#verdict:not([hidden]) #next');
    check(await p.evaluate(()=>!playing),label+' feedback follows consequence');await p.locator('#next').click();
   }
   await p.waitForSelector('#hearVoice');await p.waitForFunction(()=>__heard.some(h=>h.asset?.includes('/voice-')));
   await openCompletionPanels(p);
   const data=await p.evaluate(()=>({path:ans.join(''),saved:JSON.stringify(GSApp.S.done[new URL(location).searchParams.get('l')]),
    attempt:GSApp.S.liveAttempts[new URL(location).searchParams.get('l')].at(-1),voice:GSSfx.voiceInfo(),heard:__heard.filter(h=>h.asset?.includes('/voice-'))}));
   check(data.path===path&&data.attempt.reads.length===2,label+' committed path saved');
   check(data.voice.text===row.text&&data.heard.length===1&&!data.heard[0].moving&&data.heard[0].asset.includes('voice-'+row.lesson),label+' correct neutral voice once after motion');
   check((await p.locator('#liveEvidence').innerText()).includes('still in play'),label+' truthful ending');
   if(path==='AA'){
    const geometry=await p.evaluate(()=>{
     const fail=[],contacts=[];let maxSpeed=0;
     const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b),root=LESSON.branch;
     for(const X of 'AB')for(const Y of 'AB'){
      const s=SC[root+X+Y],r=s.info.authoredPoint;
      for(const who of ['you','opp'])for(const w of prep(s)[who])if(!w.fixed&&w.cG>=r.firstHit){
       const actual=actorAt(s,who,w.cG),b=ballAt(s,w.cG),distance=len(sub(actual.rq.centre,b));
       contacts.push({scene:root+X+Y,who,frame:w.cG,distance});if(distance>.035)fail.push('racket misses ball '+distance);
      }
      for(let f=0;f<r.firstHit-14;f+=5){
       if(!eq(actorAt(SC[root+'AA'],'you',f),actorAt(SC[root+'BA'],'you',f)))fail.push('first choice leaked into preparation');
      }
      const prefix=SC[root+X];
      for(let f=0;f<prefix.frames;f+=5)for(const who of ['you','opp'])if(!eq(actorAt(prefix,who,f),actorAt(s,who,f)))fail.push('prefix actor jump');
      for(let f=r.firstHit+2;f<r.nextHit;f+=4){const a=actorAt(s,'you',f).pose[I.hips],b=actorAt(s,'you',f-4).pose[I.hips];maxSpeed=Math.max(maxSpeed,Math.hypot(a[0]-b[0],a[1]-b[1])*25);}
     }
     return {fail:[...new Set(fail)],contacts,maxSpeed};
    });check(!geometry.fail.length,label+' geometry '+geometry.fail.join('; '));data.geometry=geometry;
   }
   for(const other of [false,true]){
    await p.locator(other?'#compareRecovery':'#replayTurningPoint').click();await p.waitForFunction(()=>!playing&&document.querySelector('#recoveryComparison').textContent);
    const v=await p.evaluate(()=>({scene,first:SC[scene].info.authoredPoint.firstHit,ball:SC[scene].ball.slice(0,SC[scene].info.authoredPoint.firstHit+1),camera:JSON.stringify(window.__camOverride)}));
    if(!other)data.compare=v;else check(v.scene!==data.compare.scene&&v.camera===data.compare.camera&&JSON.stringify(v.ball)===JSON.stringify(data.compare.ball),label+' same incoming controlled comparison');
   }
   await p.locator('#compareDone').click();check(await p.evaluate(saved=>JSON.stringify(GSApp.S.done[new URL(location).searchParams.get('l')])===saved,data.saved),label+' original score unchanged');
   await p.locator('#saveCue').click();check((await p.locator('#saveCue').innerText()).includes('Saved'),label+' cue saved');
   check(await p.evaluate(()=>__heard.filter(h=>h.asset?.includes('/voice-')).length)===1,label+' replay no extra voice');
   report.push({lesson:row.lesson,path,width,geometry:data.geometry});console.log('PASS',label);
  }
  await c.close();
 }
 check(!errors.length,errors.join('\n'));
}finally{writeFileSync(dir+`/batch-${process.env.GS_BATCH||'all'}-report.json`,JSON.stringify({checks:checks.length,report,errors},null,2));await browser.close();}
console.log('PASS',report.length,'routes;',checks.length,'checks');
