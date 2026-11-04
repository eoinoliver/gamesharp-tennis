import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.argv[2],engine=process.env.GS_FOCUS_BROWSER||'chromium';assert(base?.endsWith('/'));
const browser=await ({chromium,webkit}[engine]).launch();const checks=[],errors=[];
const out=`app_src/evidence/next-hit-${engine}`;mkdirSync(out,{recursive:true});
const check=(ok,label)=>{assert(ok,label);checks.push(label);};
async function page(width=390){const p=await browser.newPage({viewport:{width,height:width<700?844:1000},hasTouch:width<700});p.on('pageerror',e=>errors.push(String(e)));await p.route(/posthog\.com\//,r=>r.fulfill({status:200,body:'{}'}));return p;}
async function seed(p){await p.goto(base+'?review=1&z=my-game');await p.evaluate(()=>{GSApp.saveCue('the-line');GSApp.saveCue('serve-plus-one');});await p.reload();}
async function finish(p){await p.waitForFunction(()=>window.__test);await p.evaluate(()=>window.__speed=20);for(let i=0;i<6&&!await p.evaluate(()=>done);i++){await p.waitForSelector('#askOpts button:not(:disabled)');const correct=await p.evaluate(()=>LESSON.steps[step].correct);await p.locator('#askOpts button').nth(correct).click();await p.locator('#verdict:not([hidden]) #next').waitFor();await p.locator('#next').click();}await p.locator('#progressStorage').waitFor();}
try{
 for(const width of [320,390,1440]){
  const p=await page(width);await seed(p);await p.locator('[data-focus-select="the-line"]').click();
  check(await p.locator('#next-hit').isVisible(),width+': selected focus visible');check((await p.locator('#focusStatus').innerText()).includes('Saved'),width+': verified save feedback');
  await p.reload();check((await p.locator('#focusTitle').innerText()).includes('Heavy crosscourt'),width+': focus survives reload');
  check(!await p.locator('#focusQuestion').count(),width+': no session invented on return');
  await p.goto(base+'?home=1');check(await p.locator('.sh-focus-reminder').isVisible(),width+': small Home reminder');await p.locator('.sh-focus-reminder').click();
  await p.getByRole('button',{name:/Not yet/}).click();await p.goto(base+'?home=1');check(!await p.locator('.sh-focus-reminder').count(),width+': defer removes Home reminder');
  await p.goto(base+'?review=1&z=my-game');check(await p.locator('#next-hit').isVisible(),width+': deferred focus remains available');
  await p.getByRole('button',{name:'I’ve played since choosing this'}).click();check((await p.locator('#focusQuestion').innerText()).includes('come up'),width+': confirmed session asks opportunity');
  await p.getByRole('button',{name:'Yes',exact:true}).click();await p.reload();check((await p.locator('#focusQuestion').innerText()).includes('try'),width+': partial reflection resumes');
  await p.getByRole('button',{name:'Yes',exact:true}).click();await p.getByRole('button',{name:'Partly',exact:true}).click();check((await p.locator('#next-hit').innerText()).includes('partly useful'),width+': accurate self-report summary');
  check((await p.locator('#next-hit').innerText()).includes('not a score'),width+': reflection is not efficacy');
  await p.screenshot({path:`${out}/reflection-${width}.png`,fullPage:true});
  await p.getByRole('button',{name:'Keep for my next hit'}).click();check(await p.locator('[data-focus-action="played"]').isVisible(),width+': fresh intention after keep');
  await p.locator('[data-focus-select="serve-plus-one"]').click();check(await p.locator('#next-hit').count()===1,width+': only one focus after switching');check((await p.locator('#focusTitle').innerText()).includes('Serve the question'),width+': selected cue changes');
  check(await p.locator('.sh-practice').count()===2,width+': both saved cues retained');
  check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),width+': no horizontal overflow');
  await p.screenshot({path:`${out}/focus-${width}.png`,fullPage:true});
  await p.getByRole('button',{name:'Finish this focus'}).click();check(!await p.locator('#next-hit').count(),width+': finishing removes only active focus');check(await p.locator('.sh-practice').count()===2,width+': finishing preserves saved cues');await p.close();
 }
 const p=await page();await seed(p);await p.locator('[data-focus-select="the-line"]').click();
 await p.evaluate(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='gs_next_hit_v1')throw new DOMException('Full','QuotaExceededError');original.call(this,k,v);};});
 await p.getByRole('button',{name:'I’ve played since choosing this'}).click();check((await p.locator('#focusStatus').innerText()).includes('Could not verify'),'failed save is not acknowledged');check(!await p.locator('#focusQuestion').count(),'failed session save does not advance UI');await p.close();
 const paths=await page();await paths.goto(base+'?review=1');const definitions=await paths.evaluate(()=>GSApp.PRACTICE_PATHS);
 for(const path of definitions){
  await paths.goto(base+`?review=1&z=${path.zone}#path-${path.id}`);const container=paths.locator('#path-'+path.id);check(await container.locator('ol>li').count()===3,path.id+': three purpose-labelled steps');
  check(await container.getByText('Try the variation now as practice',{exact:true}).isVisible(),path.id+': early variation honestly labelled');
  await container.locator('.sh-path-next').click();await finish(paths);check(await paths.locator('#practiceReturn').isVisible(),path.id+': completion has return path');check(!await paths.locator('.gs-continue').isVisible(),path.id+': unrelated continuation stays in optional details');
  await paths.locator('#practiceReturn').click();await paths.waitForURL(new RegExp('z='+path.zone));check(new URL(paths.url()).hash==='#path-'+path.id,path.id+': return preserves symptom position');
  await paths.locator('#path-'+path.id+' .sh-path-next').click();await finish(paths);await paths.locator('#practiceReturn').click();
  check(!await paths.locator('#path-'+path.id+' .sh-path-next').count(),path.id+': no forced early variation');
  check((await paths.locator('#path-'+path.id).innerText()).includes('later day'),path.id+': later-day continuation explained');
  await paths.evaluate(slug=>{const s=JSON.parse(localStorage.getItem('gs6'));s.done[slug].first='2020-01-01';localStorage.setItem('gs6',JSON.stringify(s));},path.slugs[1]);await paths.reload();
  check((await paths.locator('#path-'+path.id+' .sh-path-next').getAttribute('href')).includes(path.slugs[2]),path.id+': later-day variation becomes next');
  await paths.locator('#path-'+path.id+' .sh-path-next').click();await finish(paths);await paths.locator('#practiceReturn').click();check((await paths.locator('#path-'+path.id).innerText()).includes('All three activities played'),path.id+': complete path says played, not mastered');
  check(await paths.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path.id+': mobile path fits');await paths.screenshot({path:`${out}/path-${path.id}.png`,fullPage:true});
 }
 await paths.goto(base+'?review=1&z=net');check(await paths.getByRole('link',{name:/^A Net Position/}).count()===1||await paths.locator('a[href="play.html?l=earned-net"]').count()===1,'extra existing net activity remains reachable');
 await paths.goto(base+'play.html?l=the-line&path=serve');await paths.waitForFunction(()=>window.__test);check((await paths.locator('#close').getAttribute('href'))!=='./?review=1&z=serve#path-serve','unrelated path parameter cannot misroute close');
 await paths.goto(base+'play.html?l=the-line&path=direction');await paths.waitForFunction(()=>window.__test);await paths.locator('#back').click();await paths.waitForURL(/z=forehand/);check(new URL(paths.url()).hash==='#path-direction','first-step Back preserves the chosen path');
 await paths.close();check(!errors.length,'no browser page errors');
}finally{await browser.close();writeFileSync(out+'/report.json',JSON.stringify({checks,errors},null,2));}
console.log(`PASS ${checks.length} next-hit and Sharpen path checks (${engine})`);
