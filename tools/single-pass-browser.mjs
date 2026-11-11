// Exercise every selectable branch through the player. Record actual calls to the
// animation runner so an unlabelled replay or a switch of scene cannot pass.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium, webkit} from 'playwright';

const base=process.argv[2];
const browser=await ({chromium,webkit}[process.env.GS_PLAYBACK_BROWSER||'chromium']).launch();
const catalogue=JSON.parse(readFileSync('app/catalog.js','utf8').match(/GS_CATALOG=(.*);\n/)[1]);
const lessons=[...catalogue.daily,...catalogue.predict,...catalogue.play];
const letters='ABCD';
function paths(lesson){
  if(lesson.branch){
    const traverse=(node,prefix)=>node.opts.flatMap((_,i)=>{
      const next=lesson.nodes[node.scene+letters[i]],path=[...prefix,i];
      return next?traverse(next,path):[path];
    });
    return traverse(lesson.nodes[lesson.branch],[]);
  }
  // Independent decisions need every option, without multiplying equivalent routes.
  const count=Math.max(...lesson.steps.map(s=>s.opts.length));
  return Array.from({length:count},(_,n)=>lesson.steps.map(s=>n%s.opts.length));
}

async function journey(slug,path){
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'});
  try{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.route(/posthog\.com/,r=>r.fulfill({status:200,body:'{}'}));
    await page.addInitScript(()=>{
      window.__speed=24;localStorage.setItem('gs_voice','off');localStorage.setItem('gs_sound','0');
      window.openingBacktracks=[];let last;
      function sample(){
        if(window.GSDirected?.active&&step===0&&!answered){
          if(GSDirected.state.phase==='rewind'||(last?.key===scene&&t<last.frame))openingBacktracks.push([scene,t]);
          last={key:scene,frame:t};
        }
        requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
    });
    await page.goto(new URL('play.html?l='+slug,base).href);
    await page.waitForFunction(()=>window.__test);
    await page.evaluate(()=>{
      window.played=[];window.phases=[];
      const original=run;
      run=function(key,from,to,...args){played.push({key,from,to});return original(key,from,to,...args);};
      const viewer=document.getElementById('viewer');
      new MutationObserver(()=>phases.push(viewer.dataset.directedPhase)).observe(viewer,{attributes:true,attributeFilter:['data-directed-phase']});
    });
    const ready=index=>page.waitForFunction(i=>step===i&&!zone.inert&&document.querySelector('#askOpts button:not(:disabled)'),index);
    await ready(0);
    assert.deepEqual(await page.evaluate(()=>openingBacktracks),[],slug+' opening replayed');
    for(const [i,pick] of path.entries()){
      const label=slug+'/'+path.map(n=>letters[n]).join('')+' decision '+(i+1);
      const before=await page.evaluate(j=>{
        const s=LESSON.steps[step],q=questionRange(s),key=s.scene+LETTERS[j];
        played.length=phases.length=0;
        return {key,observe:!!s.reveal,predict:!!LESSON.predict,connected:!!(LESSON.branch||LESSON.flow),at:q.to};
      },pick);
      await page.locator('#askOpts button').nth(pick).dispatchEvent('click');
      if(before.predict){
        if(i+1===path.length)await page.waitForFunction(()=>done);else await ready(i+1);
        const runs=await page.evaluate(()=>played.slice());
        assert(runs.length<=1&&runs.every(r=>r.from>=before.at),label+' replayed a previous read: '+JSON.stringify(runs));
        continue;
      }
      await page.locator('#verdict:not([hidden]) #next').waitFor();
      const result=await page.evaluate(()=>({runs:played.slice(),phases:phases.slice(),held:t,answer:ans[step]}));
      assert.equal(result.answer,letters[pick],label);
      assert(!result.phases.includes('rewind')&&!result.phases.includes('evidence'),label+' auto-compared');
      assert.equal(result.runs.length,before.observe?0:1,label+' must show a single chosen outcome');
      for(const r of result.runs){
        assert.equal(r.key,before.key,label);
        assert(r.from>=before.at&&r.to>r.from,label+' restarted the setup: '+JSON.stringify(r));
        assert.equal(result.held,r.to,label+' jumped away from feedback');
      }
      if(slug==='doubles-return-line'&&i===0){
        await page.locator('#directedOther').dispatchEvent('click');
        await page.waitForFunction(()=>!GSDirected.active);
        assert(await page.evaluate(()=>phases.includes('rewind')&&played.length===3&&ans[step]===chosen),label+' explicit comparison');
      }
      await page.evaluate(()=>{played.length=phases.length=0;});
      await page.locator('#next').dispatchEvent('click');
      if(i+1===path.length)await page.waitForFunction(()=>done);else await ready(i+1);
      const next=await page.evaluate(()=>played.slice());
      if(i+1===path.length)assert.equal(next.length,0,label+' auto-replayed completion');
      else if(before.connected)assert(next.every(r=>r.from>=result.held),label+' Next repeated the previous shot: '+JSON.stringify(next));
    }
    assert.deepEqual(errors,[],slug);
  }finally{await page.close();}
}
const selected=lessons.filter(l=>!process.env.GS_PLAYBACK_SLUGS||process.env.GS_PLAYBACK_SLUGS.split(',').includes(l.slug));
let cursor=0,decisions=0,journeys=0;const failures=[];
try{
  await Promise.all(Array.from({length:3},async()=>{
    while(cursor<selected.length){
      const {slug}=selected[cursor++],lesson=JSON.parse(readFileSync('app/lessons/'+slug+'.json','utf8')).lesson;
      try{
        for(const path of paths(lesson)){await journey(slug,path);decisions+=path.length;journeys++;}
        console.log('PASS',slug);
      }catch(e){failures.push(slug+': '+e.message);console.error(failures.at(-1));}
    }
  }));
}finally{await browser.close();}
assert.deepEqual(failures,[]);
console.log('PASS',selected.length,'activities,',journeys,'journeys,',decisions,'decisions');
