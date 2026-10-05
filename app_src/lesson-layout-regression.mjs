// Regression checks for layout timing, choosing framing and Predict navigation.
import {chromium} from 'playwright';
import {writeFileSync} from 'node:fs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errors=[];p.on('pageerror',e=>errors.push(String(e)));
const base=process.argv[2]||'http://127.0.0.1:8765/';const results=[];
function check(name,pass,details){results.push({name,pass,details});if(!pass)throw Error(name+': '+JSON.stringify(details));}
try{
await p.goto(base+'play.html?l=serve-plus-one');await p.waitForFunction(()=>window.__test);
await p.evaluate(()=>{window.__speed=12;startStep(0)});
await p.waitForTimeout(250);
check('options wait for situation text',await p.$eval('#ask',e=>!e.classList.contains('on')));
await p.click('#again');await p.waitForTimeout(250);
check('Replay restarts both readiness gates',await p.$eval('#ask',e=>!e.classList.contains('on')));
await p.waitForSelector('#ask.on');
const frame=await p.evaluate(()=>{render();return {height:document.querySelector('#stage').getBoundingClientRect().height,words:[...document.querySelectorAll('#sitTx .w')].every(x=>x.classList.contains('on')),stopped:!playing};});
check('tall stage and both readiness gates complete',frame.height>390&&frame.words&&frame.stopped,frame);
await p.evaluate(()=>{camI=0;render()});
const margins=await p.evaluate(()=>{const sc=SC[scene];return ['you','opp'].flatMap(w=>{const a=actorAt(sc,w,t);return [a.pose[I.hips],add(a.pose[I.head],[0,0,.42])].map(pt=>{const q=P(pt);return Math.min(...q.s,VW-q.s[0],VH-q.s[1])})})});
check('v12 choosing players remain inside frame',margins.every(x=>x>0),margins);
await p.setViewportSize({width:375,height:667});const resized=await p.$eval('#stage',e=>e.getBoundingClientRect().height);check('stage recomputes on resize',resized<frame.height,resized);
await p.goto(base+'play.html?l=predict-the-point');await p.waitForFunction(()=>window.__test);await p.evaluate(()=>window.__speed=12);
await p.waitForSelector('#ask.on');await p.click('#askOpts button:first-child');await p.waitForFunction(()=>step===1);await p.waitForSelector('#ask.on');await p.click('#askOpts button:first-child');await p.click('#back');await p.waitForTimeout(2100);
check('Back cancels delayed Predict advance',await p.evaluate(()=>step===0));
for(let i=0;i<3;i++){await p.waitForSelector('#ask.on');await p.click('#askOpts button:first-child');await p.waitForFunction(i=>step===i+1,i);}
await p.waitForFunction(()=>step===3&&!playing&&t>0);await p.click('#again');await p.waitForTimeout(1900);
check('Replay retains one Predict playback flow',await p.evaluate(()=>step===3&&!done));
await p.waitForSelector('#wrapup:not([hidden])',{timeout:60000});await p.click('#redo');await p.waitForTimeout(2100);
check('Play again stays on first read',await p.evaluate(()=>step===0&&!done));check('no page errors',errors.length===0,errors);
}finally{writeFileSync('app_src/evidence/lesson-layout/regressions.json',JSON.stringify({results,errors},null,2)+'\n');await b.close();}
console.log('Layout and navigation regressions passed:',results.length);
