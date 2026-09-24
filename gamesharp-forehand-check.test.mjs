import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const check=require('./gamesharp-forehand-check.js');
const lesson=require('./gold-daily-prototypes.js').challenges.find(item=>item.id==='gold_contact_point_v1');
const existingSpine=require('./gold-daily-lesson-spines.js').byId.forehand_contact_upstream;
const clone=value=>JSON.parse(JSON.stringify(value));
// The host owns publishing this optional binding; these fixtures exercise the
// content module before or after that separate integration change.
const boundSpine=()=>Object.assign(clone(existingSpine),{courtExperimentId:check.definition.id});
const report=changes=>Object.assign({beforeMisses:4,afterMisses:2,spacing:'more-room',comparable:true},changes);

test('one frozen source-informed comparison is not coach approval or a new lesson',()=>{
  const d=check.definition;
  assert.equal(d.id,'forehand-space-check-v1');
  assert.equal(d.version,1);
  assert.equal(d.lessonId,'gold_contact_point_v1');
  assert.equal(d.coachReview,'pending');
  assert.equal(d.status,'provisional_beta');
  assert.match(d.disclosure,/Independent coach review is pending/);
  assert.match(d.adaptation,/original beta adaptation/);
  assert.match(d.usualBlock,/10.*every ball.*net.*out/);
  assert.match(d.cueBlock,/10.*feeds, target.*pace.*all net or out/);
  assert.match(d.counting,/more balls going long or wide/);
  assert.equal(d.cue,'Use small adjusting steps to leave comfortable room for your usual forehand.');
  assert.match(d.limits.join(' '),/Never deliberately crowd.*Do not force extra distance.*reach farther.*grip or swing/);
  assert.equal(d.sources.length,3);
  for(const source of d.sources){
    assert.equal(new URL(source.url).protocol,'https:');
    assert.ok(source.title&&source.publisher&&source.supports&&source.boundary);
    assert.equal(source.verifiedOn,'2026-09-14');
  }
  assert.ok(Object.isFrozen(d.sources[0]));
  assert.ok(Object.isFrozen(d.limits));
  assert.throws(()=>{d.coachReview='approved';},TypeError);
  assert.ok(!('steps' in d)&&!('diagnosis' in d)&&!('takeItToCourt' in d));
});

test('audit requires the exact source-bound Contact spine and preserves canonical data',()=>{
  const spine=boundSpine(),before=JSON.stringify({lesson,spine});
  assert.deepEqual(check.audit(lesson,spine),{ok:true,errors:[],coachReview:'pending',coachApproved:false});
  assert.equal(JSON.stringify({lesson,spine}),before);
  const unbound=boundSpine();delete unbound.courtExperimentId;
  assert.equal(check.audit(lesson,unbound).ok,false);
  for(const bad of [null,{},Object.assign(clone(lesson),{id:'gold_direction_change_v1'}),Object.assign(clone(lesson),{lessonSpineId:'other'})]) assert.equal(check.audit(bad,spine).ok,false);
  for(const change of [{id:'other'},{prototypeId:'other'},{status:'spine'},{mechanic:'daily'},{theme:'backhand'},{sharpenTarget:'backhand'},{courtExperimentId:'nearby-check'},{tomorrowAction:'Another prescription'},{memory:'Another lesson'}]) {
    const outcome=check.audit(lesson,Object.assign(boundSpine(),change));
    assert.equal(outcome.ok,false);
    assert.equal(outcome.coachApproved,false);
  }
});

test('absent evidence, wrong stroke and source drift are withheld without fallback',()=>{
  for(const change of [
    candidate=>{candidate.steps=[];},
    candidate=>{candidate.steps=new Array(3);},
    candidate=>{delete candidate.steps[0].visual;},
    candidate=>{candidate.steps[1].visual.kind='court';},
    candidate=>{candidate.steps[1].visual.motion.stroke='backhand';},
    candidate=>{candidate.steps[1].visual.motion.previewMode='miss';},
    candidate=>{candidate.steps[1].visual.motion.contactFrame=NaN;},
    candidate=>{candidate.steps[1].visual.motion.contactFrame=0.75;},
    candidate=>{candidate.takeItToCourt='Move farther away';},
    candidate=>{candidate.proInsight.status='research_required';}
  ]){
    const candidate=clone(lesson);change(candidate);
    assert.equal(check.audit(candidate,boundSpine()).ok,false);
  }
  const missingContract=boundSpine();delete missingContract.visualContract;
  assert.equal(check.audit(lesson,missingContract).ok,false);
  const source=boundSpine();source.proInsight.status='research_required';
  assert.equal(check.audit(lesson,source).ok,false);
  assert.equal(check.audit(null,null).ok,false);
});

test('valid self-report interpretations distinguish inconclusive, absent problem and limited signals',()=>{
  assert.equal(check.interpret(report({comparable:false})).title,'The comparison is inconclusive');
  assert.equal(check.interpret(report({beforeMisses:0,afterMisses:0})).title,'The misses did not show up first');
  assert.equal(check.interpret(report({beforeMisses:0,afterMisses:5})).title,'The cue group introduced misses');
  assert.match(check.interpret(report({beforeMisses:0,afterMisses:5})).body,/not proof that the cue caused it/);
  const signal=check.interpret(report());
  assert.equal(signal.title,'A useful signal to recheck');
  assert.match(signal.body,/does not establish the cause or predict match results/);
  assert.match(signal.next,/another day/);
  for(const spacing of ['same','unsure']) assert.equal(check.interpret(report({spacing})).title,'Fewer misses; the reason is unclear');
  for(const afterMisses of [4,10]) assert.equal(check.interpret(report({afterMisses})).title,'No reduction in misses this time');
  assert.equal(check.interpret(report({beforeMisses:10,afterMisses:0})).title,'A useful signal to recheck');
  assert.equal(check.interpret(report({beforeMisses:0,comparable:false})).title,'The comparison is inconclusive');
});

test('malformed reports never coerce numbers or manufacture a positive result',()=>{
  const bad=[null,undefined,[],{},Object.create(report()),report({spacing:'better'}),report({comparable:'true'}),report({comparable:1})];
  for(const value of ['4','',null,undefined,true,NaN,Infinity,-Infinity,-1,11,1.5,{},[]]) {
    bad.push(report({beforeMisses:value}),report({afterMisses:value}));
  }
  for(const input of bad){
    const result=check.interpret(input);
    assert.equal(result.title,'Comparison incomplete');
    assert.match(result.next,/no result to infer/);
    assert.deepEqual(Object.keys(result),['title','body','next']);
  }
  for(let before=0;before<=10;before++)for(let after=0;after<=10;after++)for(const spacing of ['more-room','same','unsure'])for(const comparable of [true,false]){
    const input=report({beforeMisses:before,afterMisses:after,spacing,comparable}),snapshot=JSON.stringify(input);
    const result=check.interpret(input);
    assert.equal(JSON.stringify(input),snapshot);
    assert.ok(Object.isFrozen(result));
    assert.deepEqual(Object.keys(result),['title','body','next']);
    assert.doesNotMatch(JSON.stringify(result),/\b(fixed|mastery|diagnosed|guaranteed|approved|cured)\b/i);
    if(result.title==='A useful signal to recheck')assert.ok(comparable&&before>0&&after<before&&spacing==='more-room');
  }
});

test('browser UMD export performs no navigation, storage, measurement or lesson mutation',()=>{
  const context={};vm.createContext(context);
  vm.runInContext(fs.readFileSync(new URL('./gamesharp-forehand-check.js',import.meta.url),'utf8'),context);
  assert.deepEqual(Object.keys(context),['GameSharpForehandCheck']);
  assert.deepEqual(Object.keys(check),['definition','audit','interpret']);
  assert.deepEqual(JSON.parse(JSON.stringify(context.GameSharpForehandCheck.definition)),check.definition);
  assert.deepEqual(JSON.parse(JSON.stringify(context.GameSharpForehandCheck.interpret(report()))),check.interpret(report()));
  assert.ok(Object.isFrozen(context.GameSharpForehandCheck));
});
