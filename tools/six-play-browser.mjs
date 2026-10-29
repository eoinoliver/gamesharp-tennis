// The four added points: committed branches, controlled comparison and payoff.
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_LIVE_BROWSER||'chromium';assert(base?.endsWith('/'));
const rows=JSON.parse(readFileSync('docs/features/six-play-voice.json'));
const voices=JSON.parse(readFileSync('docs/features/six-play-voice-sources.json'));
const dir=`app_src/evidence/six-play/${process.env.GS_STAGE||'local'}-${engine}`;mkdirSync(dir,{recursive:true});
const browser=await ({chromium,webkit}[engine]).launch(),checks=[],errors=[],routes=[];
const check=(ok,msg)=>{assert(ok,msg);checks.push(msg);};
try{
 for(const width of (process.env.GS_PILOT_WIDTHS||'390,820,1280').split(',').map(Number)){
  const c=await browser.newContext({viewport:{width,height:width===390?844:900},hasTouch:width<1000,reducedMotion:width===820?'reduce':'no-preference'});
  await c.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));
  await c.addInitScript(()=>{
   const assets=new WeakMap(),fetch=window.fetch.bind(window);window.__pilotAudio=[];
   window.fetch=async(...args)=>{const r=await fetch(...args),read=r.arrayBuffer.bind(r);r.arrayBuffer=async()=>{const b=await read();assets.set(b,String(args[0]));return b;};return r;};
   const AC=window.AudioContext||window.webkitAudioContext;
   window.AudioContext=class extends AC{
    async decodeAudioData(bytes){const b=await super.decodeAudioData(bytes);b.__asset=assets.get(bytes);return b;}
    createBufferSource(){const s=super.createBufferSource(),start=s.start.bind(s);s.start=(...a)=>{__pilotAudio.push({asset:s.buffer.__asset,moving:window.__test?.state().playing});return start(...a);};return s;}
   };
  });
  const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));
  for(const row of rows)for(const path of ['AA','AB','BA','BB']){
   const label=`${row.lesson}/${path}/${width}`;
   await p.goto(base+'play.html?l='+row.lesson);await p.waitForFunction(()=>window.__test);await p.waitForSelector('#loading',{state:'hidden'});
   await p.evaluate(()=>{window.__speed=22;const timer=setTimeout;window.setTimeout=(fn,ms,...a)=>timer(fn,ms/8,...a);});
   if(width===390&&row.lesson==='live-point-return-deep'&&path==='BB')await p.evaluate(()=>{for(const l of GSApp.CAT.daily)GSApp.complete(l.slug,3,3);});
   if(path==='AA'){
    const invariants=await p.evaluate(()=>{
     const root=LESSON.branch,fail=[];const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
     for(const X of 'AB'){
      const prefix=SC[root+X],a=SC[root+X+'A'],b=SC[root+X+'B'],r=a.info.liveSetup;
      if(!eq(prefix.ball,a.ball.slice(0,prefix.frames)))fail.push('branch prefix ball');
      for(let f=0;f<=r.decision;f+=3){
       if(!eq(actorAt(a,'you',f),actorAt(b,'you',f)))fail.push('shot choice leaks into preparation');
       if(!eq(actorAt(prefix,'you',f),actorAt(a,'you',f)))fail.push('preparation prefix jump');
      }
      const hit=prep(a).you.find(w=>w.s.start===r.clipStart),contact=hit.cG;
      for(const scene of [a,b]){
       const strike=prep(scene).you.find(w=>w.s.start===r.clipStart);
       for(const f of [contact-1,contact,contact+1]){
        const actual=actorAt(scene,'you',f),source=worldOf(localAt(strike,f));
        if(len(sub(actual.rq.centre,source.centre))>.00001)fail.push('source racket contact changed');
       }
       if(['net','out'].includes(scene.info.outcome)&&!scene.marks.some(m=>m.kind===scene.info.outcome))fail.push('unobserved ending');
      }
     }
     const a=SC[root+'AA'],b=SC[root+'BA'],r=a.info.comparison;
     if(!eq(a.ball,b.ball)||!eq(a.actors.opp,b.actors.opp))fail.push('comparison changes ball or opponent');
     if(r.end!==b.info.comparison.end)fail.push('comparison freeze differs');
     const difference=len(sub(actorAt(a,'you',r.end).pose[I.hips],actorAt(b,'you',r.end).pose[I.hips]));
     if(difference<.35)fail.push('comparison has no visible positional difference');
     return {fail,difference};
    });check(!invariants.fail.length,label+': '+invariants.fail.join('; '));
   }
   for(let i=0;i<2;i++){
    await p.waitForFunction(()=>document.querySelector('#askOpts button:not(:disabled)'));
    check(await p.evaluate(()=>!playing&&document.documentElement.scrollWidth<=innerWidth),label+': question follows motion and fits');
    if(i===1)check(await p.evaluate(()=>silentPlayback),label+': repeated preparation is silent');
    if(width===390&&path==='BA')await p.screenshot({path:`${dir}/${row.lesson}-q${i+1}.png`,fullPage:true});
    await p.locator('#askOpts button').nth('AB'.indexOf(path[i])).click();
    await p.waitForSelector('#verdict:not([hidden]) #next');
    check(await p.evaluate(()=>!playing),label+': consequence stops before feedback');
    await p.locator('#next').click();
   }
   await p.waitForSelector('#wrapup:not([hidden]) #saveCue');await p.waitForFunction(()=>!playing);
   await p.waitForFunction(()=>__pilotAudio.some(a=>a.asset?.includes('/voice-')));
   const state=await p.evaluate(()=>{
    const good=i=>LETTERS.indexOf(ans[i])===LESSON.steps[i].correct||(LESSON.steps[i].alsoOk||[]).includes(LETTERS.indexOf(ans[i]));
    const slug=new URL(location).searchParams.get('l'),last=GSApp.S.liveAttempts[slug].at(-1);
    return {code:`${+good(0)}${+good(1)}`,score:last.result.n,path:ans.join(''),ending:SC[LESSON.finaleScene].info.outcome,
     voice:GSSfx.voiceInfo(),first:JSON.stringify(GSApp.S.done[slug]),intro:LESSON.liveIntro,readCount:last.reads.length};
   });
   const expected=voices.find(v=>v.asset==='live-'+(row.family==='contact-space'?'space':'serve')+'-'+state.code);
   const heard=await p.evaluate(()=>__pilotAudio.filter(a=>a.asset?.includes('/voice-')));
   check(heard.length===1&&heard[0].asset.includes('voice-'+expected.asset+'.mp3')&&!heard[0].moving,label+': actual recording plays once after motion');
   check(state.voice.asset===expected.asset&&state.voice.text===expected.text,label+': voice matches both decisions including valid alternatives');
   const nextPoint=await p.evaluate(()=>GSApp.nextLivePoint()?.slug);
   if(nextPoint)check((await p.locator('#nextLivePoint').getAttribute('href'))==='play.html?l='+nextPoint,label+': next unplayed point remains available even after all daily lessons');
   check(state.path===path&&state.readCount===2,label+': two connected reads saved');
   const ending=await p.locator('#liveEvidence').innerText();
   check(ending.includes(state.ending==='net'?'hit the net':state.ending==='out'?'went wide':'still in play'),label+': payoff agrees with ball');
   check(!ending.includes('bought time'),label+': own family feedback');
   check(await p.locator('details.pay[data-k="pro"] a').count()>0,label+': sourced professional payoff');
   for(const other of [false,true]){
    await p.locator(other?'#compareRecovery':'#replayTurningPoint').click();await p.waitForFunction(()=>!playing&&document.querySelector('#recoveryComparison').textContent.length>0);
    check(await p.evaluate(()=>silentPlayback),label+': comparison silent');
    const snap=await p.evaluate(()=>({t,ball:ballAt(SC[scene],t),camera:JSON.stringify(window.__camOverride),x:actorAt(SC[scene],'you',t).pose[I.hips],frame:SC[scene].info.comparison.end}));
    if(!other)state.comparison=snap;else{
     check(JSON.stringify(snap.ball)===JSON.stringify(state.comparison.ball)&&snap.t===state.comparison.t&&snap.camera===state.comparison.camera,label+': exact controlled comparison');
     check(Math.hypot(...snap.x.map((v,i)=>v-state.comparison.x[i]))>.35,label+': movement visibly differs');
    }
    check(snap.t===snap.frame,label+': reached comparison event');
    if(width===390&&path==='BA')await p.locator('#stage').screenshot({path:`${dir}/${row.lesson}-compare-${other?'other':'own'}.png`});
   }
   check(await p.evaluate(()=>__pilotAudio.filter(a=>a.asset?.includes('/voice-')).length)===1,label+': comparison never repeats narration');
   await p.locator('#compareDone').click();
   check(await p.evaluate(first=>JSON.stringify(GSApp.S.done[new URL(location).searchParams.get('l')])===first,state.first),label+': comparison cannot change original score');
   check(await p.locator('#sharePoint').count()===1,label+': blind challenge available');
   if(width===390&&path==='BA')await p.locator('#wrapup').screenshot({path:`${dir}/${row.lesson}-payoff.png`});
   routes.push({lesson:row.lesson,width,path,code:state.code,ending:state.ending});console.log('PASS',label);
  }
  await c.close();
 }
 check(errors.length===0,'No page errors: '+errors.join(';'));
}finally{writeFileSync(dir+'/report.json',JSON.stringify({checks:checks.length,routes,errors},null,2));await browser.close();}
console.log('PASS',routes.length,'routes;',checks.length,'checks');
