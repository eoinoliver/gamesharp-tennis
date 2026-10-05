// End-to-end check of the app shell: node app_flow.mjs http://localhost:8765/ [lesson-slug]
import { chromium } from 'playwright';
const base=process.argv[2]||'http://localhost:8765/', slug=process.argv[3]||'serve-plus-one';
const out='/tmp/claude-0/shots/'; const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const log=[], errs=[], fails=[]; const ok=(c,m)=>{log.push((c?'ok   ':'FAIL ')+m); if(!c) fails.push(m);};

// 1. first visit, a full daily lesson, feedback, back home
{const ctx=await b.newContext({viewport:{width:390,height:844}}); const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(String(e)));
 await p.goto(base); for(let i=0;i<50&&!p.url().includes('play.html');i++) await p.waitForTimeout(100);
 ok(/play\.html\?l=serve-plus-one&auto=1&intro=1$/.test(p.url()),'first bare visit auto-starts lesson 1 with the intro ('+p.url()+')');
 await p.waitForFunction(()=>window.__test,null,{timeout:20000}); await p.waitForSelector('.gs-intro'); ok(true,'first-visit caption shown');
 await p.goto(base+'?home=1'); await p.waitForSelector('#main .today');
 ok(!(await p.textContent('#main')).includes("What's your game"),'no level picker before the first lesson');
 await p.screenshot({path:out+'app_home_first.png',fullPage:true});
 const start=await p.getAttribute('.today a.btn','href'); ok(start==='play.html?l=serve-plus-one','today = lesson 1 ('+start+')');
 await p.goto(base+'play.html?l='+slug); await p.waitForFunction(()=>window.__test,null,{timeout:20000}); await p.evaluate(()=>window.__speed=8);
 await p.waitForFunction(()=>!document.getElementById('loading'),null,{timeout:2000}).catch(()=>{}); ok(!(await p.$('#loading')),'loading overlay removed (it fades out over 0.4 s)');
 const t0=Date.now();
 while(Date.now()-t0<150000){
   if(await p.$eval('#wrapup',e=>!e.hidden)) break;
   if(await p.$('#verdict:not([hidden]) #next')){await p.click('#verdict #next'); await p.waitForTimeout(250); continue;}
   const on=await p.$('#ask.on #askOpts button:not([disabled])');
   if(on){const i=await p.evaluate(()=>{const s=__test.state().step;return LESSON.steps[s].correct;});
     const bs=await p.$$('#askOpts button'); await bs[i].click(); await p.waitForTimeout(250); continue;}
   await p.waitForTimeout(200);}
 ok(await p.$eval('#wrapup',e=>!e.hidden),'lesson reached the wrap-up');
 await p.waitForSelector('.appblk'); ok(true,'app block shown in wrap-up');
 ok((await p.textContent('.appblk')).includes('1 day'),'streak line says 1 day: '+(await p.textContent('.appblk .strk')));
 await p.screenshot({path:out+'app_wrap.png',fullPage:true});
 await p.click('[data-u=yes]'); await p.fill('.fbtx','Loved seeing the reply'); await p.click('#fbsend');
 ok((await p.textContent('.appblk')).includes('Thanks'),'feedback sent');
 const ev=await p.evaluate(()=>GSApp.log().map(e=>e[1]));
 for(const e of ['app_open','auto_start','lesson_start','read','lesson_complete','feedback','feedback_comment']) ok(ev.includes(e),'event '+e);
 ok(ev.filter(e=>e==='read').length===3,'three reads logged');
 ok((await p.getAttribute('a.home','href'))==='./?home=1','Back to home never auto-starts');
 await p.click('a.home'); await p.waitForSelector('#main .today');
 const home=await p.textContent('#main'); ok(home.includes('Done today'),'home shows done today'); ok(home.includes('Tomorrow'),'home names tomorrow');
 ok(home.includes("What's your game"),'level picker appears after the first lesson'); await p.click('[data-level=club]'); ok(!(await p.textContent('#main')).includes("What's your game"),'level saved');
 await p.goto(base); await p.waitForTimeout(800); ok(!p.url().includes('play.html'),'done today: a bare visit stays on Home'); await p.waitForSelector('#main .today');
 ok((await p.textContent('#streak')).includes('1'),'streak chip 1');
 await p.screenshot({path:out+'app_home_done.png',fullPage:true});
 await p.click('#more'); await p.waitForURL(/short-ball/); ok(true,'play next now opens lesson 2');
 const ev2=await p.evaluate(()=>GSApp.log().map(e=>e[1])); ok(ev2.includes('asked_more'),'asked_more logged');
 ok(ev2.filter(e=>e==='app_open').length===1,'one app_open per day');
 await ctx.close();}

// 2. an old-app streak from yesterday carries over
{const ctx=await b.newContext({viewport:{width:390,height:844}}); const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(String(e)));
 await p.addInitScript(()=>{if(!localStorage.getItem('gs6')){const d=new Date();d.setDate(d.getDate()-1);
   localStorage.setItem('gamesharp_streak','5');localStorage.setItem('gamesharp_last_day',`gamesharp_daily_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`);}});
 await p.goto(base); await p.waitForSelector('#main .today');
 ok((await p.textContent('#streak')).includes('5'),'legacy streak of 5 carried over');
 ok((await p.textContent('#main')).includes('5-day streak carries over'),'carry-over note shown');
 await ctx.close();}

// 3. a stale old-app streak (a week ago) does not
{const ctx=await b.newContext({viewport:{width:390,height:844}}); const p=await ctx.newPage();
 await p.addInitScript(()=>{if(!localStorage.getItem('gs6')){const d=new Date();d.setDate(d.getDate()-7);
   localStorage.setItem('gamesharp_streak','9');localStorage.setItem('gamesharp_last_day',`gamesharp_daily_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`);}});
 await p.goto(base+'?home=1'); await p.waitForSelector('#main .today');
 ok(!(await p.textContent('#streak')).includes('9'),'stale legacy streak not carried');
 await ctx.close();}

// 3b. an auto-started lesson: close and the browser's back both land on Home, and Home stays
{const ctx=await b.newContext({viewport:{width:390,height:844}}); const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(String(e)));
 for(const how of ['close','back']){
  await p.goto(base); for(let i=0;i<50&&!p.url().includes('play.html');i++) await p.waitForTimeout(100);
  await p.waitForFunction(()=>window.__test,null,{timeout:20000});
  if(how==='close') await p.click('#close'); else await p.goBack();
  for(let i=0;i<40&&!p.url().includes('home=1');i++) await p.waitForTimeout(100); await p.waitForTimeout(900);
  ok(p.url().endsWith('?home=1')&&!!(await p.$('#main .today')),how+' from an auto-started lesson lands on Home and stays ('+p.url()+')');}
 await ctx.close();}

// 4. unknown lesson goes home; desktop home renders
{const ctx=await b.newContext({viewport:{width:1280,height:900}}); const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(String(e)));
 await p.goto(base+'play.html?l=nope'); await p.waitForSelector('#main .today'); ok(true,'unknown lesson redirects home');
 await p.screenshot({path:out+'app_home_desk.png'}); await ctx.close();}

console.log(log.join('\n')); console.log('errors',JSON.stringify(errs)); console.log(fails.length?'APP FLOW FAILED':'APP FLOW PASSED'); await b.close();
