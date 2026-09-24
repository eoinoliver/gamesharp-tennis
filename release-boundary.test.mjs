import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),policy=require('./gamesharp-release-policy.js'),share=require('./api/share.js');
const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
const bank=JSON.parse(html.match(/const QBANK = (\[[^\n]+\]);/)[1]);
const withheld=['Q065','Q145','Q148','Q149','Q150','Q259','Q267'];
test('the older Explore collection is withheld without deleting history or newer lesson insights',()=>{
  assert.equal(policy.proInsightIds.length,0);assert.equal(policy.questionIds.length,20);
  assert.match(html,/function gsProInsightFor\(q\).*GSReleasePolicy\?\.proInsightIds.includes\(q.id\)/);
  for(const id of ['Q001','Q003','Q005','Q010','Q011','Q019','Q462','Q543','Q546','Q472','Q476'])assert.equal(policy.isQuestionReleased(id),false);
  const lessons=require('./gold-daily-prototypes.js').challenges;
  assert.equal(lessons.length,21);assert.ok(lessons.every(c=>c.proInsight?.status==='source_locked'));
  assert.match(html,/const GS_PRO_INSIGHTS = Object.freeze/,'archived sources retained');
  assert.match(html,/GSReleasePolicy\?\.proInsightIds.length \? `<div class="hub-section-hdr/);
});
function block(name){const start=html.indexOf('function '+name+'('),end=html.indexOf('\nfunction ',start+1);assert.ok(start>=0);return html.slice(start,end);}
function context(){const ctx={window:{GSReleasePolicy:policy},QBANK:bank,gsQuestionIsSafeToSurface:q=>!withheld.includes(q.id),gsMakeDailyLiveMarker:()=>null,dtcAllFaults:()=>[],gsSyncSoundChips:()=>{},gsContentUnavailable:()=>{ctx.unavailable=true;}};vm.createContext(ctx);for(const name of ['gsResolveReleasedQuestion','gsResolveChallengeQuestion'])vm.runInContext(block(name),ctx);return ctx;}
test('every old bank ID is denied unless explicitly released, including all withheld IDs',()=>{
  const ctx=context();
  for(const q of bank)assert.equal(!!ctx.gsResolveChallengeQuestion(q.id),policy.questionIds.includes(q.id),q.id);
  for(const id of [...withheld,'Q999','DTCOLD','__proto__'])assert.equal(ctx.gsResolveChallengeQuestion(id),null,id);
  ctx.window.GSReleasePolicy=undefined;
  for(const id of policy.questionIds)assert.equal(ctx.gsResolveReleasedQuestion(id),null,'missing policy must fail closed');
});
test('shared and saved entry functions refuse withheld questions before rendering',()=>{
  const ctx=context();
  vm.runInContext(block('startSharedPoint'),ctx);
  for(const id of withheld){ctx.unavailable=false;ctx.startSharedPoint(bank.find(q=>q.id===id));assert.equal(ctx.unavailable,true);}
  // Exercise the real loadQ guard; no DOM is available, so reaching its render fails.
  vm.runInContext(block('loadQ'),ctx);
  for(const id of withheld){ctx.unavailable=false;ctx.state={quiz:[bank.find(q=>q.id===id)],qIdx:0};ctx.loadQ();assert.equal(ctx.unavailable,true);}
});
test('share API denies withheld, unknown and inherited-property IDs without teaching or redirect',()=>{
  for(const query of [...withheld.map(id=>({id})),{id:'Q999'},{play:'__proto__'},{play:'retired'},{id:'Q004',play:'retired'}]){
    const headers={};let status,body;const res={setHeader:(k,v)=>headers[k]=v,status:n=>(status=n,res),send:s=>body=s};
    share({query,url:'/s/test'},res);assert.equal(status,404);assert.equal(headers['Cache-Control'],'no-store');assert.doesNotMatch(body,/location.replace|http-equiv="refresh"/);assert.match(body,/unavailable/);
  }
});
test('released share API title comes from the current canonical question',()=>{
  let status,body;const res={setHeader:()=>{},status:n=>(status=n,res),send:s=>body=s};share({query:{id:'Q004'},url:'/s/Q004'},res);
  assert.equal(status,200);assert.match(body,/missed two early winners from neutral balls/);
});
test('all retired standalone pages and working sources are excluded from deployment',()=>{
  const ignore=fs.readFileSync(new URL('./.vercelignore',import.meta.url),'utf8').split(/\r?\n/);
  for(const page of [...policy.retiredPages,'.github/','Legacy Versions/','tools/','*.md','*.test.mjs'])assert.ok(ignore.includes(page),page);
  assert.ok(html.indexOf('gamesharp-release-policy.js')<html.indexOf('const QBANK ='));
  assert.match(block('checkFirstVisit'),/startSharedPoint\(gsResolveReleasedQuestion\(_pid\)\)/);
});
