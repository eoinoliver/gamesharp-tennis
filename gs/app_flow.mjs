// End-to-end check of the app shell: node app_flow.mjs http://localhost:8765/ [lesson-slug]
import { chromium } from 'playwright';
const base=process.argv[2]||'http://localhost:8765/', slug=process.argv[3]||'serve-plus-one';
const out='/tmp/claude-0/shots/'; const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const log=[], errs=[], fails=[]; const ok=(c,m)=>{log.push((c?'ok   ':'FAIL ')+m); if(!c) fails.push(m);};

// 1. first visit, a full daily lesson, feedback, back home
{const ctx=await b.newContext({viewport:{width:390,height:844}}); const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(String(e)));
 await p.goto(base); for(let i=0;i<50&&!p.url().includes('play.html');i++) await p.waitForTimeout(100);
 ok(/play\.html\?l=serve-plus-one&auto=1&intro=1$/.test(p.url()),'first bare visit auto-starts lesson 1 with the intro ('+p.url()+')');
 await p.waitForFunction(()=>window.__test,null,{timeout:20000});
 await p.waitForFunction(()=>!document.getElementById('gsw'),null,{timeout:8000}); ok(true,'welcome overlay gone after the lesson loads');
 const w1=await p.evaluate(()=>GSApp.log().filter(e=>e[1]==='welcome_seen').map(e=>e[2]));
 ok(w1.length===1&&w1[0].full===true&&w1[0].skipped===false&&w1[0].ms+400<=2100,'full welcome once, lesson visible by 2.1 s ('+JSON.stringify(w1)+')');
 const cap=await p.waitForFunction(()=>document.querySelector('.gs-intro')&&{under:!!document.getElementById('gsw')}).then(h=>h.jsonValue());
 ok(!cap.under,'first-visit caption shown after the welcome, not under it');
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
 for(const e of ['app_open','auto_start','welcome_seen','lesson_start','read','lesson_complete','feedback','feedback_comment']) ok(ev.includes(e),'event '+e);
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
  await p.waitForFunction(()=>window.__test,null,{timeout:20000}); await p.waitForFunction(()=>!document.getElementById('gsw'),null,{timeout:8000});
  if(how==='close') await p.click('#close'); else await p.goBack();
  for(let i=0;i<40&&!p.url().includes('home=1');i++) await p.waitForTimeout(100); await p.waitForTimeout(900);
  ok(p.url().endsWith('?home=1')&&!!(await p.$('#main .today')),how+' from an auto-started lesson lands on Home and stays ('+p.url()+')');}
 const w3=await p.evaluate(()=>GSApp.log().filter(e=>e[1]==='welcome_seen').map(e=>e[2]));
 ok(w3.length===2&&w3[0].full&&!w3[1].full&&w3[1].ms+400<=700,'same-day reload shows the short welcome, lesson visible by 0.7 s ('+JSON.stringify(w3)+')');
 await ctx.close();}

// 3c. the welcome: a tap skips; reduced motion is still; a slow lesson holds the final frame (never blank)
{const ctx=await b.newContext({viewport:{width:375,height:667}}); const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(String(e)));
 await p.goto(base,{waitUntil:'commit'}); await p.waitForSelector('#gsw.full'); await p.waitForTimeout(300); await p.mouse.click(187,500);
 const gone=await p.evaluate(()=>{const w=document.getElementById('gsw');return !w||getComputedStyle(w).opacity==='0';});
 await p.waitForFunction(()=>window.__test&&!document.getElementById('gsw'),null,{timeout:20000});
 const ws=await p.evaluate(()=>GSApp.log().filter(e=>e[1]==='welcome_seen').map(e=>e[2]));
 ok(gone&&ws.length===1&&ws[0].skipped===true,'a tap skips the welcome at once ('+JSON.stringify(ws)+')');
 await ctx.close();}
{const ctx=await b.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}); const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(String(e)));
 await p.route(/engine\.js/,async r=>{await new Promise(f=>setTimeout(f,1200)); r.continue();});
 await p.goto(base,{waitUntil:'commit'}); await p.waitForSelector('#gsw.still'); await p.waitForTimeout(600);
 const st=await p.evaluate(()=>{const w=document.getElementById('gsw');return {ball:getComputedStyle(w.querySelector('.gsw-ball')).opacity,promise:getComputedStyle(w.querySelector('.gsw-promise')).opacity,anim:getComputedStyle(w.querySelector('.gsw-in')).animationName};});
 ok(st.ball==='0'&&st.promise==='1'&&st.anim==='none','reduced motion: static wordmark and promise, no motion ('+JSON.stringify(st)+')');
 await p.waitForFunction(()=>window.__test&&!document.getElementById('gsw'),null,{timeout:20000}); ok(true,'reduced-motion welcome leaves once the lesson is ready');
 await ctx.close();}
{const ctx=await b.newContext({viewport:{width:390,height:844}}); const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(String(e)));
 await p.route(/engine\.js/,async r=>{await new Promise(f=>setTimeout(f,3500)); r.continue();});
 await p.goto(base,{waitUntil:'commit'}); await p.waitForSelector('#gsw.full'); await p.waitForTimeout(2600);
 const h=await p.evaluate(()=>{const w=document.getElementById('gsw');return w&&{cls:w.className,op:getComputedStyle(w).opacity};});
 ok(!!h&&h.cls.includes('wait')&&h.cls.includes('hit')&&h.op==='1','slow lesson: the welcome holds its final frame with a pulse ('+JSON.stringify(h)+')');
 await p.waitForFunction(()=>window.__test&&!document.getElementById('gsw'),null,{timeout:20000});
 const wl=await p.evaluate(()=>GSApp.log().filter(e=>e[1]==='welcome_seen').map(e=>e[2]));
 ok(wl.length===1&&wl[0].ms>=3000,'slow lesson: welcome leaves once it is ready ('+JSON.stringify(wl)+')');
 await ctx.close();}

// 4. unknown lesson goes home; desktop home renders
{const ctx=await b.newContext({viewport:{width:1280,height:900}}); const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(String(e)));
 await p.goto(base+'play.html?l=nope'); await p.waitForSelector('#main .today'); ok(true,'unknown lesson redirects home');
 await p.screenshot({path:out+'app_home_desk.png'}); await ctx.close();}

console.log(log.join('\n')); console.log('errors',JSON.stringify(errs)); console.log(fails.length?'APP FLOW FAILED':'APP FLOW PASSED'); await b.close();
