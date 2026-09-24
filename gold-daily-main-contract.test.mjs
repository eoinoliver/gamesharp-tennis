import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),main=require('./gold-daily-main.js'),loop=require('./gold-daily-loop.js'),gold=require('./gold-daily-prototypes.js');
const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
function setup(entries={}) {
  const data=new Map(Object.entries(entries));
  const localStorage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,String(v))};
  const context={localStorage,Date,getTodayKey:()=> 'gamesharp_daily_2026_8_13',getStreak:()=>Number(data.get('gamesharp_streak')||0),gsShieldAvailable:()=>false,gsUseShield:()=>{},sessionStorage:{setItem(){}}};
  vm.createContext(context);
  vm.runInContext(html.slice(html.indexOf('function updateStreak('),html.indexOf('\nfunction gsWeekKey()')),context);
  const root={...context,GameSharpGoldDailyLoop:loop,GameSharpGoldDaily:gold};
  return {api:main.create(root),data,root};
}
const date='2026-09-13',id=loop.lessonFor(date);
test('main entry and repeat entry both select the promoted format without a preview competitor',()=>{
  assert.match(html,/window\.GS_GOLD_DAILY_MAIN = true/);
  assert.match(html,/function runStandardDaily\(options\) \{\s*if \(window.GS_GOLD_DAILY_MAIN\) return startDailyChallenge\(\)/);
  assert.doesNotMatch(html,/class="gs-daily-pilot-entry"/);
  const manifest=JSON.parse(fs.readFileSync(new URL('./LAUNCH_MANIFEST.json',import.meta.url)));
  assert.deepEqual(manifest.daily.lessonIds,loop.order);
});
test('new completion extends existing streak once and retains all earlier history',()=>{
  const {api,data}=setup({gamesharp_streak:'5',gamesharp_last_day:'gamesharp_daily_2026_8_12',gamesharp_challenges_done:'17',gamesharp_daily_2026_8_12:'done',gs_gold_daily_loop_v1:'untouched pilot history'});
  assert.equal(api.complete(date,id,[0,1,2]),true);
  api.complete(date,id,[3,3,3]);
  assert.equal(data.get('gamesharp_streak'),'6');
  assert.equal(data.get('gamesharp_challenges_done'),'18');
  assert.equal(data.get('gamesharp_daily_2026_8_12'),'done');
  assert.equal(data.get('gs_gold_daily_loop_v1'),'untouched pilot history');
  assert.deepEqual(JSON.parse(data.get(api.key)).days[date].answers,[0,1,2]);
});
test('same-day old Daily retains its credit without pretending it was a new lesson',()=>{
  const {api,data}=setup({gamesharp_streak:'6',gamesharp_last_day:'gamesharp_daily_2026_8_13',gamesharp_challenges_done:'18',gamesharp_daily_2026_8_13:'done'});
  assert.equal(api.completed(date),false);
  api.complete(date,id,[1,1,1]);
  assert.equal(api.completed(date),true);
  assert.equal(data.get('gamesharp_streak'),'6');
  assert.equal(data.get('gamesharp_challenges_done'),'18');
});
test('second store/tab and refresh do not award duplicate credit',()=>{
  const {api,root,data}=setup();
  const other=main.create(root);
  api.complete(date,id,[0,0,0]);other.complete(date,id,[1,1,1]);
  assert.equal(data.get('gamesharp_challenges_done'),'1');
  assert.deepEqual(JSON.parse(data.get(api.key)).days[date].answers,[0,0,0]);
});
test('partial or mismatched lessons cannot earn completion',()=>{
  const {api,data}=setup();
  assert.equal(api.complete(date,id,[0,1]),false);
  assert.equal(api.complete(date,'wrong',[0,1,2]),false);
  assert.equal(api.complete(date,id,[0,1,4]),false);
  assert.equal(data.size,0);
});
test('an earlier-day completion cannot move a newer streak date backwards',()=>{
  const {api,data}=setup({gamesharp_streak:'6',gamesharp_last_day:'gamesharp_daily_2026_8_14'});
  api.complete(date,id,[0,1,2]);
  assert.equal(data.get('gamesharp_last_day'),'gamesharp_daily_2026_8_14');
  assert.equal(data.get('gamesharp_streak'),'6');
  assert.equal(data.get('gamesharp_daily_2026_8_13'),'done');
});
test('blocked storage does not award durable credit and reports persistence unavailable',()=>{
  const {root,data}=setup();root.localStorage.setItem=()=>{throw Error('quota')};
  const api=main.create(root);
  assert.equal(api.complete(date,id,[0,1,2]),false);
  assert.equal(api.persistent(),false);
  assert.equal(data.size,0);
});
test('concurrent browser completions share one origin lock and credit only once',async()=>{
  const {root,data}=setup();let queue=Promise.resolve(),requests=0;
  root.navigator={locks:{request:(name,fn)=>{assert.equal(name,'gamesharp-main-daily-completion');requests++;const next=queue.then(fn);queue=next;return next;}}};
  const a=main.create(root),b=main.create(root);
  await Promise.all([a.complete(date,id,[0,0,0]),b.complete(date,id,[1,1,1])]);
  assert.equal(requests,2);assert.equal(data.get('gamesharp_challenges_done'),'1');
  assert.deepEqual(JSON.parse(data.get(a.key)).days[date].answers,[0,0,0]);
});
test('completion refreshes both the Daily and visible Home streak counters',()=>{
  const {root}=setup({gamesharp_streak:'7'}),nodes={streakCount:{},homeStreakBadge:{}};
  root.document={getElementById:id=>nodes[id]||null};
  main.create(root).refreshHome();
  assert.equal(nodes.streakCount.textContent,'7');assert.equal(nodes.homeStreakBadge.textContent,'🔥 7');
});
