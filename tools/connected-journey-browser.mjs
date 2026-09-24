// Reusable UI walk. Run against the canonical local preview or an explicit URL.
// Uses visible controls after selecting each exact, allowlisted Predict journey.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),integration=require('../predict-live-integration.js');
const base=process.argv[2]||'http://127.0.0.1:8766/';
const widths=(process.argv[3]||'320,430').split(',').map(Number);
const journeyIds=process.argv[4]?process.argv[4].split(','):integration.LAUNCH_SEQUENCE_IDS;
const dailyMode=['daily','daily-full'].includes(process.argv[5]);
const fullDaily=process.argv[5]==='daily-full';
const daily=require('../gold-daily-loop.js');
if(journeyIds.some(id=>!integration.LAUNCH_SEQUENCE_IDS.includes(id)))throw Error('Unapproved journey ID');
const out=fs.mkdtempSync(path.join(os.tmpdir(),'gs-connected-review-'));
const session='gs-audit-'+process.pid;
const run=(...args)=>execFileSync(process.env.GS_BROWSER_BIN||'npx',[...(process.env.GS_BROWSER_BIN?[]:['--yes','agent-browser']),'--session',session,...args],{encoding:'utf8',timeout:60000,maxBuffer:1024*1024});
const helpers=`const pause=ms=>new Promise(r=>setTimeout(r,ms));
const until=async(f,label)=>{for(let n=0;n<160;n++){if(f())return;await pause(100)}throw Error('Timed out: '+label)};
const click=(d,s)=>{const el=d.querySelector(s);if(!el||el.disabled)throw Error('Unavailable control '+s);el.click()};`;
const evaluate=body=>run('eval',`(async()=>{${helpers}${body}})()`);
const screenshot=name=>run('screenshot',path.join(out,name+'.png'));
const rows=[];
console.log('Evidence directory: '+out);
for(const width of widths){
  run('set','viewport',String(width),'844');
  run('open',base);
  evaluate(`localStorage.setItem('gs_sound_on','0');`);
  evaluate(`document.querySelector('[aria-label^="GAMESHARP introduction"]')?.click();
    await pause(500);
    document.querySelector('[onclick="skipWelcomeOnboarding()"]')?.click();
    document.querySelector('[onclick="skipOnboarding()"]')?.click();`);
  for(const id of journeyIds){
    const name=width+'-'+id,first=width===320?0:1;
    try{
      let dailySetup=`startLinkedSequence('${id}');`;
      if(dailyMode){
        const lessonId=Object.keys(daily.connections).find(key=>daily.connections[key].sequenceId===id);
        if(!lessonId)throw Error('No exact Daily connection');
        let date=daily.schedules[0].from;
        for(let n=0;daily.lessonFor(date)!==lessonId;n++){
          if(n>90)throw Error('Lesson absent from published schedules');
          date=daily.nextDate(date);
        }
        dailySetup=`
          const NativeDate=window.__dailyRealDate||Date;window.__dailyRealDate=NativeDate;
          window.Date=class extends NativeDate{constructor(...a){super(...(a.length?a:['${date}T12:00:00']))}};
          const c=GameSharpGoldDaily.challenges.find(c=>c.id==='${lessonId}');
          ${fullDaily ? '' : `GameSharpGoldDailyLoop.createStore(localStorage).save('${date}',{lessonId:c.id,answers:c.steps.map(s=>s.correct),step:2,complete:true});`}
          ${fullDaily ? `GameSharpGoldDaily.close();GameSharpMainDaily.refreshHome();click(document,'.gs-daily-card-hit');` : 'GameSharpGoldDaily.openDaily();'}
          ${fullDaily ? `click(document,'[data-gd-action="daily-start"]');
          for(let i=0;i<3;i++){
            click(document,'[data-gd-action="answer"][data-gd-index="'+c.steps[i].correct+'"]');
            await pause(5200);click(document,'[data-gd-action="next"]');
          }
          await pause(200);
          if(!GameSharpGoldDailyLoop.createStore(localStorage).get('${date}')?.complete || !GameSharpMainDaily.completed('${date}'))throw Error('Live Daily completion missing');` : ''}
          document.querySelector('[data-gd-action="daily-practice"]').closest('details').open=true;
          click(document,'[data-gd-action="daily-practice"]');
          if(seqState.seq.id!=='${id}')throw Error('Wrong Daily continuation');`;
      }
      const intro=evaluate(`
        document.querySelector('[aria-label^="GAMESHARP introduction"]')?.click();
        ${dailySetup}click(document,'.seq-start-btn');
        document.querySelector('#seqTellSkip')?.click();
        for(let k=0;k<3;k++){
          await until(()=>document.querySelector('#seqOpt0'),'Predict option');
          click(document,'#seqOpt'+seqState.seq.steps[seqState.stepIdx].correct);
          await until(()=>document.querySelector('#seqNextBtn.snb-show'),'Predict next');
          click(document,'#seqNextBtn');
        }
        await until(()=>document.querySelector('.gspl-live'),'Predict result');
        return JSON.stringify({id:seqState.seq.id,score:seqState.score,overflow:document.documentElement.scrollWidth>innerWidth+1});
      `);
      screenshot(name+'-predict');
      evaluate(`click(document,'.gspl-replay summary');click(document,'.gspl-play');`);
      screenshot(name+'-replay');
      evaluate(`
        click(document,'.gspl-live');
        await until(()=>document.querySelector('#gsPredictLiveFrame')?.contentDocument?.querySelector('.opt'),'Live Point');
        const f=document.querySelector('#gsPredictLiveFrame'),d=f.contentDocument;
        if(!f.src.includes('scenario=${integration.connection(id).livePointId}'))throw Error('Wrong Live Point');
        click(d,'.opt[data-i="${first}"]');
        await until(()=>Array.from(d.querySelectorAll('.btn')).some(b=>b.textContent.includes('Read their reply')),'reply');
        Array.from(d.querySelectorAll('.btn')).find(b=>b.textContent.includes('Read their reply')).click();
        await until(()=>!d.querySelector('.btn'),'decision two');
        return d.querySelector('.sit').innerText;
      `);
      screenshot(name+'-live-decision');
      evaluate(`const d=document.querySelector('#gsPredictLiveFrame').contentDocument;click(d,'#lpExpand');`);
      screenshot(name+'-focus');
      const result=evaluate(`
        const f=document.querySelector('#gsPredictLiveFrame'),w=f.contentWindow,d=f.contentDocument;
        click(d,'#lpfsClose');
        click(d,'.opt[data-i="${width===320?1:0}"]');
        await until(()=>d.querySelector('#lpOtherLine'),'first result');
        const original=JSON.stringify(_gsPredictLiveOutcome);
        click(d,'#lpOtherLine');
        await until(()=>d.querySelector('.opt:not([disabled])'),'alternative');
        click(d,'.opt:not([disabled])');
        await until(()=>Array.from(d.querySelectorAll('.btn')).some(b=>b.textContent.includes('Read their reply')),'alternative reply');
        Array.from(d.querySelectorAll('.btn')).find(b=>b.textContent.includes('Read their reply')).click();
        await until(()=>!d.querySelector('.btn'),'alternative decision two');
        click(d,'.opt[data-i="${width===320?0:1}"]');
        await until(()=>d.querySelector('#lpComplete'),'alternative result');
        if(JSON.stringify(_gsPredictLiveOutcome)!==original)throw Error('Alternative overwrote first result');
        click(d,'#lpComplete');
        await until(()=>!document.querySelector('#gsPredictLiveFrame'),'Playbook handoff');
        const expected='${integration.connection(id).playbookId}';
        if(!document.querySelector('[id^="gsplCourt-pb-'+expected+'-${id}"]'))throw Error('Wrong Playbook replay');
        await until(()=>document.querySelector('#pbcard-'+expected+'.pb-card-flash'),'Playbook focus');
        await pause(800);
        if(!document.elementFromPoint(innerWidth/2,innerHeight/2)?.closest('#pbcard-'+expected))throw Error('Playbook destination not visible');
        return JSON.stringify({firstResult:JSON.parse(original),playbook:expected,overflow:document.documentElement.scrollWidth>innerWidth+1});
      `);
      screenshot(name+'-playbook');
      if(dailyMode)evaluate(`initHome();await pause(100);if(!document.querySelector('[data-gd-action="daily-start"]'))throw Error('Daily return lost after Playbook');`);
      rows.push({width,id,intro,result,status:'pass'});
      console.log(name+' PASS');
    }catch(e){
      rows.push({width,id,status:'fail',error:String(e.message).slice(0,500)});
      screenshot(name+'-failure');
      console.log(name+' FAIL '+String(e.message).slice(0,160));
      run('open',base);
    }
    fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(rows,null,2));
  }
}
console.log(JSON.stringify({out,passed:rows.filter(r=>r.status==='pass').length,failed:rows.filter(r=>r.status==='fail').length}));
if(rows.some(r=>r.status==='fail'))process.exitCode=1;
