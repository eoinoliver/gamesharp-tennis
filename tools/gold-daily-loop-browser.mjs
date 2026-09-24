// Isolated browser-only test data; never modifies real user history.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const bin=process.env.GS_BROWSER_BIN||'agent-browser';
const base=process.argv[2]||'http://127.0.0.1:8766/index.html';
const widths=(process.argv[3]||'320,430').split(',').map(Number);
const out=fs.mkdtempSync(path.join(os.tmpdir(),'gs-daily-loop-'));
let session='gs-main-loop-'+process.pid;
const run=(...args)=>execFileSync(bin,['--session',session,...args],{encoding:'utf8',timeout:60000,maxBuffer:1024*1024});
const helpers=`const pause=ms=>new Promise(r=>setTimeout(r,ms));const click=s=>{const el=document.querySelector(s);if(!el)throw Error('Missing '+s);el.click()};const until=async(f,label)=>{for(let n=0;n<100;n++){if(f())return;await pause(100)}throw Error('Timed out '+label)};`;
const evaluate=body=>run('eval',`(async()=>{${helpers}${body}})()`);
const setDate=key=>evaluate(`const NativeDate=window.__dailyRealDate||Date;window.__dailyRealDate=NativeDate;window.Date=class extends NativeDate{constructor(...a){super(...(a.length?a:['${key}T12:00:00']))}};GameSharpGoldDaily.close();GameSharpMainDaily.refreshHome();document.querySelector('.gs-daily-card-hit').click();`);
const shot=name=>run('screenshot',path.join(out,name+'.png'));
const rows=[];
console.log('Evidence: '+out);
for(const width of widths){
  session='gs-main-loop-'+process.pid+'-'+width;
  run('set','viewport',String(width),'844');
  if(width!==320)run('set','media','dark','reduced-motion');
  run('open',base);
  evaluate(`await until(()=>window.GameSharpMainDaily,'loaded');localStorage.setItem('gs_sound_on','0');window.__dailyErrors=[];addEventListener('error',e=>__dailyErrors.push(e.message));`);
  const dates=['12','13','14','15','16','17','18','19','20','21','23','25'];
  for(let day=0;day<dates.length;day++){
    const date='2026-09-'+dates[day],name=width+'-'+date;
    setDate(date);
    shot(name+'-home');
    evaluate(`click('[data-gd-action="daily-start"]');`);
    shot(name+'-evidence');
    evaluate(`click('[data-gd-action="expand-evidence"]');`);
    shot(name+'-focus');
    evaluate(`click('[data-gd-action="close-focus"]');`);
    for(let step=0;step<3;step++){
      const layout=evaluate(`
        const main=document.querySelector('.is-guided-coaching');if(!main)throw Error('Missing coaching shell');
        const delay=parseFloat(main.style.getPropertyValue('--gd-question-delay'))||0;
        await pause(${width===320?'Math.ceil(delay*1000)+350':'100'});
        const setup=main.querySelector('.gs-gold-daily-coach-setup'),visual=main.querySelector('.gs-gold-daily-visual'),question=main.querySelector('h1'),options=[...main.querySelectorAll('.gs-gold-daily-option')];
        if(setup.getBoundingClientRect().bottom>visual.getBoundingClientRect().top+1||visual.getBoundingClientRect().bottom>question.getBoundingClientRect().top+1)throw Error('Reading order');
        if(main.querySelector('.gs-gold-daily-step-count').textContent!=='${step+1} of 3')throw Error('Progress');
        if(options.length!==4||options.some(e=>e.getBoundingClientRect().height<44))throw Error('Touch targets');
        if(main.scrollWidth>main.clientWidth+1)throw Error('Decision overflow');
        return JSON.stringify({lastChoiceBottom:options[3].getBoundingClientRect().bottom,viewport:innerHeight});
      `);
      shot(name+'-'+step+'-read');
      evaluate(`
        const id=GameSharpGoldDailyLoop.lessonFor('${date}'),c=GameSharpGoldDaily.challenges.find(c=>c.id===id);
        const selected=${width===430?'(c.steps['+step+'].correct+1)%4':'c.steps['+step+'].correct'};
        click('[data-gd-action="answer"][data-gd-index="'+selected+'"]');
        const delay=parseFloat(document.querySelector('.gs-gold-daily-step').style.getPropertyValue('--gd-payoff-delay'))||0;
        await pause(${width!==320?'100':'Math.ceil(delay*1000)+350'});
      `);
      shot(name+'-'+step+'-answer');
      evaluate(`click('[data-gd-action="next"]');`);
    }
    shot(name+'-result');
    const summary=evaluate(`
      const store=GameSharpGoldDailyLoop.createStore(localStorage),r=store.get('${date}');
      if(!r?.complete)throw Error('Completion not saved');
      if(!GameSharpMainDaily.completed('${date}'))throw Error('Main Daily history not saved');
      if(localStorage.getItem('gamesharp_challenges_done')!=='${day+1}')throw Error('Incorrect completion count');
      const id=GameSharpGoldDailyLoop.lessonFor('${date}'),spine=GameSharpGoldLessonSpines.byId[GameSharpGoldDaily.challenges.find(c=>c.id===id).lessonSpineId];
      const practice=!!document.querySelector('[data-gd-action="daily-practice"]');
      if(practice!==!!GameSharpGoldDailyLoop.connections[id])throw Error('Wrong practice availability');
      click('[data-gd-action="daily-sharpen"]');
      if(!document.querySelector('#gspcOverlay.open'))throw Error('Sharpen not opened');
      return JSON.stringify({date:'${date}',lessonId:id,practice,region:spine.sharpenTarget,sharpen:document.querySelector('#gspcTitle')?.textContent});
    `);
    shot(name+'-sharpen');
    evaluate(`click('#gspcOverlay .gspc-close');await pause(100);if(!document.querySelector('[data-gd-action="daily-start"]'))throw Error('Sharpen return lost Daily');`);
    const overflow=evaluate(`const el=document.querySelector('.gs-gold-daily');if(!el||el.scrollWidth>el.clientWidth+1||window.__dailyErrors.length)throw Error('Overflow or runtime error');return JSON.stringify({overflow:false,errors:window.__dailyErrors});`);
    rows.push({width,date,summary,overflow,status:'pass'});
    console.log(name+' PASS');
    fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(rows,null,2));
  }
  run('close');
}
console.log(JSON.stringify({out,passed:rows.length}));
