import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import vm from 'node:vm';
const require=createRequire(import.meta.url);
const content=require('./livepoint-content.js');
const integration=require('./predict-live-integration.js');
const engine=require('./livepoint-engine.js');
const scene=require('./livepoint-scene.js');
const integrity=require('./livepoint-integrity.js');
const ids=content.launchIds;

test('a transition does not schedule scroll resets that steal a later tap target',()=>{
  const html=fs.readFileSync(new URL('./livepoint-prototype.html',import.meta.url),'utf8');
  const start=html.indexOf('function lpTransitionTop('),end=html.indexOf('// Pilot:',start);
  const jobs=[],doc={scrollingElement:{scrollTop:400},querySelector:()=>null};let resets=0;
  const c={flowEpoch:0,document:doc,window:{scrollTo:()=>resets++},requestAnimationFrame:f=>jobs.push(f),setTimeout:f=>jobs.push(f)};
  vm.createContext(c);vm.runInContext(html.slice(start,end),c);c.lpTransitionTop('.result-title');
  assert.equal(doc.scrollingElement.scrollTop,0);doc.scrollingElement.scrollTop=300;
  while(jobs.length)jobs.shift()();
  assert.equal(doc.scrollingElement.scrollTop,300);assert.equal(resets,1);
});

test('every released Live Point finish continues from the actual incoming contact',()=>{
  assert.deepEqual([...content.continuityReviewedIds].sort(),[...ids].sort());
  for(const id of ids){
    const sc=content.scenarios.find(s=>s.id===id);
    for(const key of ['A','B'])for(const phase of ['win','mid']){
      assert.deepEqual(sc[key][phase].shots[0].from,sc[key].seq.shots.at(-1).to,id+'/'+key+'/'+phase);
    }
  }
});

test('a broken authored state is rejected instead of repaired during replay',()=>{
  for(const id of ids){
    const original=content.scenarios.find(s=>s.id===id);
    assert.deepEqual(integrity.validate(original),[],id);
    for(const mutate of [s=>s.A.win.shots[0].from[0]+=12,s=>delete s.d1.court.oppStart,s=>delete s.B.seq.shots[0].contactType,s=>s.A.mid.oppStart[0]+=12]){
      const broken=structuredClone(original);mutate(broken);
      assert.ok(integrity.validate(broken).length,id);
      assert.throws(()=>integrity.assemble(broken,'A','win'),/Invalid Live Point/);
    }
    assert.deepEqual(integrity.assemble(original,'A','win').shots,[...original.A.seq.shots,...original.A.win.shots]);
  }
});

test('the actual browser validator admits all and only the released valid scenes',()=>{
  const html=fs.readFileSync(new URL('./livepoint-prototype.html',import.meta.url),'utf8');
  const c={window:{GSLivePointIntegrity:integrity},GSLivePointIntegrity:integrity,LP_ENGINE:engine,
    GOLD:'#c8a84b',RED:'#e07070',GREEN:'#5bba6f',assembleFullPoint:integrity.assemble};
  vm.createContext(c);vm.runInContext(html.slice(html.indexOf('const INTENT_GEO'),html.indexOf('function validateAll')),c);
  for(const s of content.scenarios)assert.equal(c.validateScenario(s).length,0,s.id+': '+c.validateScenario(s).join('; '));
  const bad=structuredClone(content.scenarios[0]);bad.A.win.shots[0].from[0]+=50;
  assert.ok(c.validateScenario(bad).length);
});

test('counter decisions retain stable identities without always placing the keyed answer first',()=>{
  for(const seed of ['2026-09-21','2026-09-22','review']){
    const positions=[];
    for(const s of content.scenarios)for(const branch of ['A','B']){
      const opts=s[branch].d2.opts,order=integrity.choiceOrder(opts,s.id+':'+branch,seed);
      assert.deepEqual([...order].sort(),[0,1]);
      assert.deepEqual(order,integrity.choiceOrder(opts,s.id+':'+branch,seed));
      positions.push(order.findIndex(i=>opts[i].win));
      assert.equal(new Set(opts.map(o=>o.id)).size,2);
    }
    assert.equal(positions.filter(p=>p===0).length,22);
    assert.equal(positions.filter(p=>p===1).length,22);
  }
});

test('explicit serve identity wins over descriptive labels and has a diagonal bounce',()=>{
  const sc=content.scenarios.find(s=>s.id==='second_serve_big');
  for(const key of ['A','B']){
    const play=sc[key].seq,shot=play.shots[0];
    assert.equal(engine.classifyShot({...shot,label:'FLAT + CHARGE'}),'serve');
    assert.equal(shot.serveNumber,2);
    assert.deepEqual(engine.validateTimeline(engine.compileTimeline(play),play),[]);
    const bad={...play,shots:[{...shot,bounce:[shot.from[0],100]},...play.shots.slice(1)]};
    assert.ok(engine.validateTimeline(engine.compileTimeline(bad),bad).some(x=>x.includes('diagonal')));
  }
});

test('projected actors meet every authored contact; winners do not summon a receiver',()=>{
  for(const id of ids)for(const branch of ['A','B'])for(const phase of ['seq','win','mid']){
    const p=content.scenarios.find(s=>s.id===id)[branch][phase],t=engine.compileTimeline(p);
    for(const side of ['you','opp'])for(const shot of t.shots.filter(s=>(s.shot.from[1]>150)===(side==='you'))){
      assert.ok(scene.track(p,t,side).some(x=>x.at===shot.contactAt&&JSON.stringify(x.p)===JSON.stringify(shot.shot.from)),id+'/'+branch+'/'+phase+'/'+side);
    }
  }
  const p={youStart:[100,200],oppStart:[150,40],oppEnd:[150,40],shots:[{from:[100,200],to:[45,50],payoff:true,snd:'drive'}]};
  assert.deepEqual(scene.track(p,engine.compileTimeline(p),'opp').at(-1).p,[150,40]);
});

test('reviewed down-the-line Predict shots remain in the same sideline corridor',()=>{
  for(const id of integration.LAUNCH_SEQUENCE_IDS)for(const shot of integration.contract(id).play.shots){
    if(/down.the.line/i.test(shot.label))assert.ok(Math.abs(shot.from[0]-shot.to[0])<=20,id+': '+shot.label);
    if(shot.snd==='volley'&&shot.actor==='you')assert.ok(shot.from[1]<220,id+': volley behind service line');
  }
  const moonball=integration.contract('seq_004').play.shots[1];
  assert.equal(moonball.direction,'crosscourt');
  assert.ok((moonball.from[0]-100)*(moonball.to[0]-100)<0);
  assert.deepEqual(integration.contract('seq_004').play.shots[2].from,moonball.to);
});

test('reduced-motion projected scenes contain no active animation elements',()=>{
  const p=content.scenarios.find(s=>s.id==='second_serve_big').A.seq,t=engine.compileTimeline(p);
  const normal=scene.render(p,t,false),reduced=scene.render(p,t,true);
  assert.match(normal,/data-lp-bounce="0"/);
  assert.match(normal,new RegExp('begin="'+t.shots[0].bounceAt+'s"'));
  assert.doesNotMatch(reduced,/<(?:animate|set)\b/);
});

test('an unavailable Predict ID cannot start a different available journey',()=>{
  const source=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
  const start=source.indexOf('function startLinkedSequence(id)'),end=source.indexOf('function renderSeq(',start);
  const context={VERIFIED_LINKED_SEQUENCES:[{id:'seq_001'}]};
  vm.createContext(context);vm.runInContext(source.slice(start,end),context);
  assert.equal(context.startLinkedSequence('unavailable'),false);
});
