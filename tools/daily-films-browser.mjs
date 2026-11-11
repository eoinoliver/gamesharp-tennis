import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {chromium,webkit} from 'playwright';

const base=process.argv[2]||'http://127.0.0.1:8799/';
const engine=process.env.GS_FILM_BROWSER||'chromium';
const width=Number(process.env.GS_FILM_WIDTH||390);
const output=process.env.GS_FILM_OUTPUT||'app_src/evidence/daily-films-'+engine+'-'+width;
mkdirSync(output,{recursive:true});
const catalogue=JSON.parse(readFileSync('app/catalog.js','utf8').match(/GS_CATALOG=(.*);\n/)[1]);
const lessons=catalogue.daily.filter(l=>!process.env.GS_FILM_SLUGS||process.env.GS_FILM_SLUGS.split(',').includes(l.slug));
const results=[],browser=await ({chromium,webkit}[engine]).launch();

async function inspect(lesson){
  const p=await browser.newPage({viewport:{width,height:width<700?844:900},reducedMotion:'no-preference'});
  try{
    const errors=[];p.on('pageerror',err=>errors.push(err.message));
    await p.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));
    await p.addInitScript(()=>{
      window.__speed=6;localStorage.setItem('gs_sound','0');
      window.filmPhases=[];window.holdForPhoto=true;window.backtracks=[];let previous=null;
      function observe(){
        if(window.GSDirected?.active){
          const phase=GSDirected.state.phase;
          if(previous?.scene===scene && t<previous.t)backtracks.push([previous.t,t]);
          previous={scene,t};
          const title=document.querySelector('#directedCaption strong').textContent;
          if(filmPhases.at(-1)?.title!==title||filmPhases.at(-1)?.phase!==phase)filmPhases.push({phase,title});
          if(holdForPhoto&&['dailyHold','line','height'].includes(phase)&&
              !(new URLSearchParams(location.search).get('l')==='second-serve'&&t===339)){
            // Let the camera settle before taking the photograph.
            if(++window.holdFrames===2){GSDirected.pause();window.holdForPhoto=false;}
          }
        }
        requestAnimationFrame(observe);
      }
      window.holdFrames=0;requestAnimationFrame(observe);
    });
    await p.goto(new URL('play.html?l='+lesson.slug,base).href);
    await p.waitForFunction(()=>window.GSDirected?.state.paused,null,{timeout:30000});
    const film=await p.evaluate(()=>({
      phases:filmPhases.slice(),frame:t,scene,az:cam.az,
      backtracks:backtracks.slice(),hold:document.querySelector('#directedCaption strong').textContent,
      overflow:document.documentElement.scrollWidth>innerWidth
    }));
    assert(!film.overflow,lesson.slug);
    const phases=film.phases.map(x=>x.phase);
    const expected=lesson.slug==='short-ball'?['opening','height']:
      lesson.slug==='the-winner'?['opening','line']:['sweep','dailyDetail','dailyHold'];
    for(const phase of expected)assert(phases.includes(phase),lesson.slug+' missing '+phase);
    assert.deepEqual(film.backtracks,[],lesson.slug+' opening doubled back');
    assert(!phases.includes('rewind'),lesson.slug);
    if(lesson.slug==='second-serve')assert(film.phases.some(p=>p.title==='Chest height.'));
    await p.locator('#stage').screenshot({path:output+'/'+lesson.slug+'.png'});
    await p.evaluate(()=>GSDirected.pause());
    await p.waitForFunction(()=>window.__test&&!zone.inert&&document.querySelector('#askOpts button:not(:disabled)'));
    const restored=await p.evaluate(()=>{const q=questionRange(LESSON.steps[0]);return !GSDirected.active&&scene===q.scene&&t===q.to;});
    assert(restored,lesson.slug+' must restore its exact decision');
    await p.reload();
    await p.waitForFunction(()=>window.__test&&!zone.inert&&document.querySelector('#watchDirected'));
    assert.equal(await p.evaluate(()=>filmPhases.length),0,lesson.slug+' repeat');
    await p.locator('#watchDirected').click();
    await p.locator('#skipDirected').click();
    await p.waitForFunction(()=>window.__test&&!zone.inert&&document.querySelector('#askOpts button:not(:disabled)'));
    assert.deepEqual(errors,[]);
    results.push({slug:lesson.slug,...film});console.log('PASS',lesson.slug,film.hold);
  }finally{await p.close();}
}

try{
  let next=0;const failures=[];
  await Promise.all(Array.from({length:3},async()=>{
    while(next<lessons.length){
      const lesson=lessons[next++];try{await inspect(lesson);}catch(err){failures.push(lesson.slug+': '+err.message);}
    }
  }));
  assert.deepEqual(failures,[]);
}finally{
  await browser.close();writeFileSync(output+'/report.json',JSON.stringify(results,null,2));
}
