// Integrated, normal-motion checks only. Every case gets a fresh owned browser
// session; screenshots happen after timing observations, never before another RAF run.
import {execFileSync} from 'node:child_process';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const bin=process.env.GS_BROWSER_BIN||'/Users/eoinlynn/.npm/_npx/6de2aa2fded2970c/node_modules/.bin/agent-browser',base=process.argv[2]||'http://127.0.0.1:8766/index.html',width=Number(process.argv[3]||320);
const out=fs.mkdtempSync(path.join(os.tmpdir(),'gs-batch-six-')),reports=[];
const lessons=[['gold_return_time_v1','GoldDailyReturnTime'],['gold_serve_quality_v1','GoldDailyServeQuality'],['gold_pattern_clue_v1','GoldDailyPatterns']];
let session;const run=(...args)=>execFileSync(bin,['--session',session,...args],{encoding:'utf8',timeout:45000,maxBuffer:3e6});
const ev=body=>run('eval',`(async()=>{const q=s=>document.querySelector(s),pause=ms=>new Promise(r=>setTimeout(r,ms)),check=(v,m)=>{if(!v)throw Error(m)},click=s=>{const e=q(s);check(e,'Missing '+s);e.click()};${body}})()`);
const save=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({width,base,reports},null,2));
const cases=[];for(const [id,module]of lessons)for(let scene=0;scene<3;scene++)for(const mode of ['read','correct','wrong'])cases.push({id,module,scene,mode});
const selected=process.env.GS_BATCH_SIX_FILTER?cases.filter(c=>(c.id+':'+c.scene+':'+c.mode).includes(process.env.GS_BATCH_SIX_FILTER)):cases;
console.log('Evidence: '+out);
for(const item of selected){
 const {id,module,scene,mode}=item,labelsOff=mode==='wrong',focus=mode==='read'&&(id==='gold_pattern_clue_v1'&&scene>0||['gold_return_time_v1','gold_serve_quality_v1'].includes(id)&&scene===1)||mode==='wrong'&&id==='gold_pattern_clue_v1'&&scene===2;
 session='gs-six-'+process.pid+'-'+reports.length+'-'+Date.now();let report={...item,labelsOff,focus};
 try{
  run('set','viewport',String(width),'844');run('set','media','dark','no-preference');run('open',base);run('snapshot','-i');
  ev(`window.__sixErrorStacks=[];addEventListener('error',e=>__sixErrorStacks.push(e.error?.stack||e.message));`);
  ev(`for(let i=0;i<150&&!window.GameSharpGoldDaily;i++)await pause(75);check(window.GameSharpGoldDaily,'Engine missing');check(window.${module},'Lesson module missing');check(!matchMedia('(prefers-reduced-motion: reduce)').matches,'Reduced motion active');localStorage.setItem('gs_sound_on','0');window.__sixErrors=[];addEventListener('error',e=>__sixErrors.push(e.message));window.__sixLesson=GameSharpGoldDaily.challenges.find(c=>c.id==='${id}');check(__sixLesson,'Lesson missing');window.__sixStep=__sixLesson.steps[${scene}];window.__sixModule=window.${module};GameSharpGoldDaily.open();GameSharpGoldDaily.start(GameSharpGoldDaily.challenges.indexOf(__sixLesson));for(let i=0;i<${scene};i++){click('[data-gd-action="answer"][data-gd-index="'+__sixLesson.steps[i].correct+'"]');click('[data-gd-action="next"]');}check(q('.gs-gold-daily-step-count').textContent==='${scene+1} of 3','Wrong decision');${labelsOff?`const style=document.createElement('style');style.id='six-labels-off';style.textContent='.gd-sequence-evidence svg text,.gd-sequence-caption,.gs-gold-daily-cue-rail{visibility:hidden!important}';document.head.appendChild(style);`:''}`);
  const observation=JSON.parse(ev(`
   addEventListener('error',e=>__sixErrors.push(e.error?.stack||e.message));
   const step=__sixStep,mod=__sixModule,answered=${mode!=='read'},choice=${mode==='read'?'null':mode==='correct'?'step.correct':'(step.correct+1)%4'},tl=mod.timelineFor(step,answered);
   if(answered)click('[data-gd-action="answer"][data-gd-index="'+choice+'"]');
   ${focus?`click('[data-gd-action="expand-evidence"]');check(!q('.gs-gold-daily-focus').hidden,'Focus missing');check(q('.gs-gold-daily-focus-title').textContent.includes(__sixLesson.screenTitle||__sixLesson.title),'Focus lost title');`:''}
   const host=q('.gd-sequence-evidence');check(host,'Evidence host missing');const started=performance.now();let mutations=0;const shapes=new Set(),records=new Set(),captions=new Set(),captionTimes=[];
   const observe=()=>{mutations++;shapes.add(JSON.stringify([...host.querySelectorAll('svg circle')].map(e=>[e.getAttribute('cx'),e.getAttribute('cy')])));host.querySelectorAll('[data-pattern-record]').forEach(e=>records.add(e.dataset.patternRecord));host.querySelectorAll('.gd-sequence-caption').forEach(e=>{if(!captions.has(e.textContent))captionTimes.push({at:(performance.now()-started)/1000,text:e.textContent});captions.add(e.textContent);});};
   const observer=new MutationObserver(observe);observer.observe(host,{childList:true,subtree:true});observe();
   const payoff=answered?(choice===step.correct?tl.inkAt:tl.correctionInkAt):null,total=answered?(choice===step.correct?tl.inkAt:tl.total):tl.total;
   await pause(200);check(!q('.gs-gold-daily-sr').textContent,'Payoff announced immediately');
   const earlyOpacity=q('.gs-gold-daily-feedback')?Number(getComputedStyle(q('.gs-gold-daily-feedback')).opacity):null;
   if(answered)check(earlyOpacity<=.3,'Payoff at full weight before evidence');else check(!q('.gs-gold-daily-feedback'),'Read has feedback');
   let beforePayoff=null;if(answered){await pause(Math.max(0,(payoff-.2)*1000-(performance.now()-started)));beforePayoff={time:(performance.now()-started)/1000,opacity:Number(getComputedStyle(q('.gs-gold-daily-feedback')).opacity),announcement:q('.gs-gold-daily-sr').textContent};check(beforePayoff.opacity<=.31,'Payoff gains weight too soon');check(!beforePayoff.announcement,'Payoff announced before authored boundary');}
   await pause(Math.max(0,(total+.55)*1000-(performance.now()-started)));observer.disconnect();
   check(mutations>12&&shapes.size>7,'RAF geometry did not advance: '+JSON.stringify({mutations,shapes:shapes.size}));check(!/NaN|undefined/.test(host.innerHTML),'Invalid rendered coordinates');
   if(answered){check(Number(getComputedStyle(q('.gs-gold-daily-feedback')).opacity)>.95,'Payoff did not reach full weight');check(q('.gs-gold-daily-sr').textContent.includes(step.payoff),'Final payoff announcement missing');if(choice!==step.correct){const correction=captionTimes.find(t=>/^compare|better|instead/i.test(t.text));check(correction,'Wrong choice never showed comparison');check(correction.at>=tl.correctionAt-.08&&correction.at<tl.correctionAt+.4,'Wrong comparison started off-clock: '+JSON.stringify(correction));}}
   else{check(!q('.gs-gold-daily-feedback'),'Read acquired feedback');if('${id}'==='gold_pattern_clue_v1'&&${scene}===1){check([...records].join(',')==='0,1,2,3','History not sequential');check(host.querySelectorAll('[data-observed-reply]').length===4,'History replies missing');}}
   check(!__sixErrors.length,__sixErrors.join('; '));const overlay=q('.gs-gold-daily');check(overlay.scrollWidth<=overlay.clientWidth+1,'Horizontal overflow');
   ${focus?`const r=q('.gs-gold-daily-focus-stage .gs-gold-daily-visual').getBoundingClientRect();check(r.left>=-1&&r.right<=innerWidth+1&&r.top>=-1&&r.bottom<=innerHeight+1,'Focus stage clipped: '+JSON.stringify(r.toJSON()));`:''}
   return {timelines:tl,total,mutations,distinctGeometry:shapes.size,records:[...records],captions:[...captions],captionTimes,earlyOpacity,beforePayoff,finalAnnouncement:q('.gs-gold-daily-sr').textContent};
  `));
  report={...report,status:'PASS',...observation};
  run('screenshot','--full',path.join(out,id+'-'+scene+'-'+mode+(focus?'-focus':'')+'.png'));
  if(focus){ev(`click('[data-gd-action="close-focus"]');check(q('.gs-gold-daily-focus').hidden,'Focus did not close');check(!q('.gs-gold-daily-shell').inert,'Shell stayed inert');check(q('.gs-gold-daily-step-count').textContent==='${scene+1} of 3','Focus changed decision');`);run('screenshot','--full',path.join(out,id+'-'+scene+'-'+mode+'-returned.png'));}
  const errors=run('errors');if(errors.trim())throw Error(errors);console.log(id+' '+(scene+1)+' '+mode+' PASS');
 }catch(error){let details;try{details=ev(`return {errors:window.__sixErrors||[],stacks:window.__sixErrorStacks||[],caption:q('.gd-sequence-caption')?.textContent};`);}catch{}report={...report,status:'FAIL',error:String(error),details};try{run('screenshot','--full',path.join(out,id+'-'+scene+'-'+mode+'-FAIL.png'));}catch{}console.log(id+' '+(scene+1)+' '+mode+' FAIL '+String(error).slice(0,220)+' '+details);}
 finally{reports.push(report);save();try{run('close');}catch(error){console.log('Cleanup issue '+session+': '+error.message);}}
}
console.log(JSON.stringify({out,passed:reports.filter(r=>r.status==='PASS').length,failed:reports.filter(r=>r.status==='FAIL').length}));if(reports.some(r=>r.status==='FAIL'))process.exitCode=1;
