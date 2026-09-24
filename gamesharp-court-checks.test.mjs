import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const checks = require('./gamesharp-court-checks.js');
const forehand = require('./gamesharp-forehand-check.js');
const lessons = require('./gold-daily-prototypes.js').challenges;
const spines = require('./gold-daily-lesson-spines.js');
const clone = value => JSON.parse(JSON.stringify(value));
const ids = ['forehand-space-check-v1','return-position-check-v1','next-point-reset-check-v1','approach-volley-check-v1'];
const d = id => checks.byId[id];
const bound = definition => ({...clone(spines.byId[definition.spineId]),courtExperimentId:definition.id});
const lesson = definition => clone(lessons.find(item => item.id === definition.lessonId));
const returns = changes => ({contact:'more-time',cost:'none-noticed',comparable:true,...changes});
const mental = changes => ({opportunity:'comparable-ball',routine:'used',intention:'clear',...changes});
const volley = changes => ({opponentContact:'deeper',volleyHeight:'higher',approachCost:'none-noticed',comparable:true,...changes});
const forehands = changes => ({beforeMisses:4,afterMisses:2,spacing:'more-room',comparable:true,...changes});
const examples = {[ids[0]]:forehands(),[ids[1]]:returns(),[ids[2]]:mental(),[ids[3]]:volley()};

test('public beta release is an explicit frozen four-ID authorisation, not coaching approval', () => {
  const manifest = require('./LAUNCH_MANIFEST.json');
  assert.equal(checks.release.status, 'user_authorized_beta');
  assert.deepEqual(checks.release.experimentIds, ids);
  assert.ok(Object.isFrozen(checks.release) && Object.isFrozen(checks.release.experimentIds));
  assert.equal(manifest.courtChecksBeta.status, checks.release.status);
  assert.equal(manifest.courtChecksBeta.registryVersion, checks.version);
  assert.deepEqual(manifest.courtChecksBeta.experiments.map(item => item.id), ids);
  for (const entry of manifest.courtChecksBeta.experiments) {
    assert.equal(entry.lessonId, checks.byId[entry.id].lessonId);
    assert.equal(entry.coachApproved, false);
    assert.equal(entry.coachReview, 'pending');
    assert.equal(entry.status, 'user_authorized_beta');
    assert.ok(!manifest.localReviewOnly.some(item => item.id === entry.id));
  }
});
const combos = fields => fields.reduce((all, field) => {
  const values = field.type === 'boolean' ? [true,false] : field.type === 'count' ? field.options.map(([value]) => Number(value)) : field.options.map(([value]) => value);
  return all.flatMap(part => values.map(value => ({...part,[field.name]:value})));
}, [{}]);

test('four frozen court checks reuse exact existing lessons with no coaching-approval claim', () => {
  assert.deepEqual(checks.definitions.map(item => item.id), ids);
  for (const definition of checks.definitions) {
    assert.equal(definition.version, 1);
    assert.equal(definition.status, 'provisional_beta');
    assert.equal(definition.coachReview, 'pending');
    assert.equal(definition.coachApproved, false);
    assert.equal(checks.byLessonId[definition.lessonId], definition);
    assert.equal(checks.byPathId[definition.pathId], definition);
    assert.equal(lessons.filter(item => item.id === definition.lessonId).length, 1);
    assert.match(definition.disclosure, /Independent coach review is pending/);
    assert.match(definition.adaptation, /original.*adaptation/);
    assert.ok(Object.isFrozen(definition) && Object.isFrozen(definition.plan.blocks));
    assert.ok(Object.isFrozen(definition.report.fields[0].options));
    assert.throws(() => { definition.coachApproved = true; }, TypeError);
    assert.ok(!('steps' in definition) && !('diagnosis' in definition) && !('takeItToCourt' in definition));
    for (const key of ['label','invitation','cta','lessonId','spineId','region','pathId']) assert.ok(definition[key]);
    assert.ok(definition.plan.boundary && definition.plan.setup && definition.plan.blocks.length === 2);
    assert.ok(definition.recognition.yes.label && definition.recognition.yes.detail);
    for (const choice of ['unsure','no']) for (const key of ['label','detail','title','lead','body']) assert.ok(definition.recognition[choice][key]);
    for (const source of definition.sources) {
      assert.equal(new URL(source.url).protocol, 'https:');
      for (const key of ['publisher','title','supports','boundary']) assert.ok(source[key]);
      assert.equal(source.verifiedOn, '2026-09-14');
    }
  }
  assert.equal(new Set(checks.definitions.map(item => item.lessonId)).size, 4);
  assert.equal(new Set(checks.definitions.map(item => item.region)).size, 4);
});

test('forehand adapter preserves the accepted source content, practice cue and all original interpretations', () => {
  const adapted = d(ids[0]), original = forehand.definition;
  for (const key of Object.keys(original)) assert.deepEqual(adapted[key], original[key]);
  assert.equal(adapted.storage, 'forehand');
  assert.equal(adapted.plan.setup, original.setup);
  assert.equal(adapted.plan.blocks[0].body, original.usualBlock);
  assert.equal(adapted.plan.blocks[1].body, original.cueBlock);
  assert.equal(adapted.plan.blocks[1].cue, original.cue);
  assert.deepEqual(adapted.plan.blocks.map(block => [block.number,block.label]), [['10','forehands'],['10','forehands']]);
  assert.equal(adapted.plan.counting, original.counting);
  assert.equal(adapted.plan.boundary, original.limits[0] + ' ' + original.limits[1]);
  assert.equal(adapted.report.countLegend, 'Misses out of ten');
  assert.equal(adapted.report.countHint, 'Count every net or out ball—not just your original miss.');
  assert.deepEqual(checks.interpret(ids[0], forehands()).summaries, [{label:'Usual approach',value:'4 / 10 misses'},{label:'With the cue',value:'2 / 10 misses'}]);
  for (const report of combos(adapted.report.fields)) {
    const originalReading = forehand.interpret(report), reading = checks.interpret(adapted.id, report);
    assert.deepEqual({title:reading.title,body:reading.body,next:reading.next}, originalReading);
  }
  assert.deepEqual(checks.audit(adapted, lesson(adapted), bound(adapted)), forehand.audit(lesson(adapted), bound(adapted)));
});

test('new practice protocols and reporting fit each lesson instead of cloning forehand counts', () => {
  for (const definition of checks.definitions.slice(1)) {
    assert.equal(definition.storage, 'shared');
    assert.ok(definition.report.fields.length >= 3 && definition.report.fields.length <= 4);
    assert.ok(definition.report.fields.every(field => field.type !== 'count'));
    assert.doesNotMatch(JSON.stringify(definition.report), /beforeMisses|afterMisses|pointWins|confidenceScore|mastery/);
    assert.equal(definition.plan.blocks[0].cue, spines.byId[definition.spineId].tomorrowAction);
  }
  assert.deepEqual(d(ids[1]).report.fields.map(field => field.name), ['contact','cost','comparable']);
  assert.deepEqual(d(ids[2]).report.fields.map(field => field.name), ['opportunity','routine','intention']);
  assert.deepEqual(d(ids[3]).report.fields.map(field => field.name), ['opponentContact','volleyHeight','approachCost','comparable']);
  assert.match(d(ids[1]).plan.blocks[1].body, /Repeat that pair twice more—three pairs in total.*six return attempts/);
  assert.equal(d(ids[1]).plan.blocks[1].label, 'pairs total');
  assert.match(d(ids[1]).plan.boundary, /slower serve can reverse/);
  assert.match(d(ids[1]).plan.counting, /extra misses or shorter returns/);
  assert.match(d(ids[2]).plan.setup, /natural miss.*do not deliberately miss/i);
  assert.match(d(ids[2]).plan.lead, /not whether you win/);
  assert.match(d(ids[2]).plan.boundary, /actual ball can change the job/);
  assert.match(d(ids[3]).plan.blocks[0].body, /do not stage a weak pass/);
  assert.match(d(ids[3]).plan.blocks[1].body, /Repeat that pair twice more—three pairs in total.*six approach attempts/);
  assert.equal(d(ids[3]).plan.blocks[1].label, 'pairs total');
  assert.match(d(ids[3]).plan.blocks[1].body, /every approach miss.*no volley/);
  assert.match(d(ids[3]).plan.counting, /volley stroke unchanged/);
  assert.match(d(ids[3]).plan.boundary, /does not guarantee an easier volley/);
});

test('every field schema has explicit choices and strict type validation without defaults or coercion', () => {
  for (const definition of checks.definitions) {
    const example = examples[definition.id];
    assert.equal(checks.validateReport(definition.id, example), true);
    assert.equal(checks.validateReport(definition.id, {...example,reportedAt:'2026-09-14T01:02:03.000Z'}), true);
    for (const bad of [undefined,null,[],{},Object.create(example),{...example,mastery:true}]) assert.equal(checks.validateReport(definition.id, bad), false);
    assert.equal(new Set(definition.report.fields.map(field => field.name)).size, definition.report.fields.length);
    for (const field of definition.report.fields) {
      assert.ok(['count','enum','boolean'].includes(field.type));
      assert.equal(new Set(field.options.map(([value]) => value)).size, field.options.length);
      for (const [value,label] of field.options) assert.ok(typeof value === 'string' && value && label);
      const without = {...example}; delete without[field.name];
      assert.equal(checks.validateReport(definition.id, without), false);
      const badValues = field.type === 'count' ? ['',String(example[field.name]),null,undefined,true,false,NaN,Infinity,-1,11,1.5,[],{}] : field.type === 'boolean' ? ['',null,undefined,'true','false',0,1,[],{}] : ['',null,undefined,true,0,'unrecognised',[],{}];
      for (const value of badValues) assert.equal(checks.validateReport(definition.id, {...example,[field.name]:value}), false, `${definition.id}.${field.name}=${String(value)}`);
    }
  }
  for (const id of [undefined,null,{},'unknown','__proto__','constructor','toString']) assert.equal(checks.validateReport(id, returns()), false);
});

test('all valid combinations stay neutral, immutable and distinct from proof of physical improvement', () => {
  let total = 0;
  for (const definition of checks.definitions) for (const payload of combos(definition.report.fields)) {
    total++;
    const before = JSON.stringify(payload), reading = checks.interpret(definition.id, payload);
    assert.equal(checks.validateReport(definition.id, payload), true);
    assert.equal(JSON.stringify(payload), before);
    assert.deepEqual(Object.keys(reading), ['title','body','next','summaries']);
    assert.equal(reading.summaries.length, definition.storage === 'forehand' ? 2 : definition.report.fields.length);
    assert.ok(Object.isFrozen(reading) && Object.isFrozen(reading.summaries));
    assert.ok(reading.title && reading.body && reading.next);
    for (const summary of reading.summaries) assert.ok(summary.label && typeof summary.value === 'string' && summary.value);
    assert.doesNotMatch(reading.title, /fixed|mastery|diagnosed|guaranteed|approved|cured|improved|success/i);
  }
  assert.equal(total, 922);
  for (const id of ids) {
    const reading = checks.interpret(id, {...examples[id],unapprovedField:true});
    assert.equal(reading.title, 'Observation incomplete');
    assert.deepEqual(reading.summaries, []);
  }
  assert.equal(checks.interpret('unknown', returns()).title, 'Observation incomplete');
});

test('return interpretation weighs cost and unknown conditions before a subjective time signal', () => {
  const interpret = changes => checks.interpret(ids[1], returns(changes));
  assert.equal(interpret({comparable:false}).title, 'The return comparison is inconclusive');
  for (const changes of [{contact:'unsure'},{cost:'unsure'}]) assert.equal(interpret(changes).title, 'The return trade is still unclear');
  for (const cost of ['more-misses','shorter-returns','both']) assert.equal(interpret({cost}).title, 'There was a cost to weigh');
  for (const cost of ['more-misses','shorter-returns','both']) {
    assert.equal(interpret({cost,contact:'unsure'}).title, 'There was a cost to weigh');
    assert.equal(interpret({cost,contact:'unsure',comparable:false}).title, 'The return comparison is inconclusive');
  }
  assert.equal(interpret({}).title, 'Less rushed is a signal to recheck');
  assert.match(interpret({}).body, /not proof.*better match results/);
  for (const contact of ['same','less-time']) assert.equal(interpret({contact}).title, 'Deeper did not feel less rushed');
});

test('mental report distinguishes no opportunity, no attempt, changed ball and process observation', () => {
  const interpret = changes => checks.interpret(ids[2], mental(changes));
  assert.equal(interpret({opportunity:'no-miss'}).title, 'No natural opportunity this time');
  assert.equal(interpret({opportunity:'different-ball'}).title, 'The next ball changed the job');
  assert.equal(interpret({routine:'not-used'}).title, 'The routine was not tried this time');
  for (const opportunity of ['comparable-ball','different-ball','unsure']) for (const intention of ['clear','unclear','unsure']) {
    const report = mental({opportunity,routine:'not-used',intention});
    const reading = checks.interpret(ids[2], report);
    assert.equal(reading.title, 'The routine was not tried this time');
    assert.doesNotMatch(reading.next, /Keep the preparation/);
    assert.equal(checks.didPractice(ids[2], report), false);
  }
  assert.equal(interpret({opportunity:'no-miss',routine:'not-used'}).title, 'No natural opportunity this time');
  for (const changes of [{opportunity:'unsure'},{routine:'unsure'},{intention:'unsure'}]) assert.equal(interpret(changes).title, 'The reset observation is unclear');
  assert.equal(interpret({intention:'unclear'}).title, 'The job was still unclear');
  assert.equal(interpret({}).title, 'You reported a clear next-ball job');
  assert.match(interpret({}).body, /not proof.*prevented a miss/);
  for (const payload of combos(d(ids[2]).report.fields)) {
    const expected = payload.routine === 'used' && ['comparable-ball','different-ball'].includes(payload.opportunity);
    assert.equal(checks.didPractice(ids[2], payload), expected);
  }
  for (const id of [ids[0],ids[1],ids[3]]) assert.equal(checks.didPractice(id, examples[id]), true);
  for (const id of [...ids,'unknown']) assert.equal(checks.didPractice(id, {}), false);
});

test('volley interpretation requires both contacts and retains approach misses and absent volley evidence', () => {
  const interpret = changes => checks.interpret(ids[3], volley(changes));
  assert.equal(interpret({comparable:false}).title, 'The approach comparison is inconclusive');
  assert.equal(interpret({volleyHeight:'no-volley'}).title, 'There was no usable volley comparison');
  for (const changes of [{opponentContact:'unsure'},{volleyHeight:'unsure'},{approachCost:'unsure'}]) assert.equal(interpret(changes).title, 'The two contacts are still unclear');
  assert.equal(interpret({approachCost:'more-misses'}).title, 'The deeper target had a cost');
  for (const changes of [{opponentContact:'unsure'},{volleyHeight:'unsure'},{volleyHeight:'no-volley'}]) {
    assert.equal(interpret({...changes,approachCost:'more-misses'}).title, 'The deeper target had a cost');
    assert.equal(interpret({...changes,approachCost:'more-misses',comparable:false}).title, 'The approach comparison is inconclusive');
  }
  assert.equal(interpret({}).title, 'You noticed a connected change');
  assert.match(interpret({}).body, /does not prove cause.*every higher volley is easier/);
  for (const changes of [{opponentContact:'same'},{opponentContact:'further-forward'},{volleyHeight:'same'},{volleyHeight:'lower'}]) assert.equal(interpret(changes).title, 'The volley did not follow a simple rule');
});

test('audit requires exact canonical bindings and source consistency without mutating lessons or declaring coaching approval', () => {
  for (const definition of checks.definitions) {
    const l = lesson(definition), s = bound(definition), before = JSON.stringify({l,s});
    assert.deepEqual(checks.audit(definition,l,s), {ok:true,errors:[],coachReview:'pending',coachApproved:false});
    assert.equal(JSON.stringify({l,s}), before);
    for (const badDefinition of [null,{},clone(definition),{...definition,id:'nearby-check'}]) assert.equal(checks.audit(badDefinition,l,s).ok, false);
    for (const changes of [{id:'other'},{prototypeId:'other'},{status:'spine'},{courtExperimentId:'other'},{theme:'other'},{sharpenTarget:'other'},{memory:'new memory'},{tomorrowAction:'new cue'}]) assert.equal(checks.audit(definition,l,{...s,...changes}).ok, false);
    for (const changes of [{id:'other'},{lessonSpineId:'other'},{memory:'new memory'},{takeItToCourt:'new cue'},{steps:[]},{steps:new Array(3)},{proInsight:null}]) assert.equal(checks.audit(definition,{...l,...changes},s).ok, false);
    const noBinding = {...s}; delete noBinding.courtExperimentId;
    assert.equal(checks.audit(definition,l,noBinding).ok, false);
    assert.equal(checks.audit(definition,null,s).ok, false);
    assert.equal(checks.audit(definition,l,null).ok, false);
    assert.equal(checks.audit(definition,l,{...s,visualContract:null}).ok, false);
    const unapproved = clone(l); unapproved.proInsight.status = 'research_required';
    assert.equal(checks.audit(definition,unapproved,s).ok, false);
    if (definition.storage !== 'forehand') {
      const drifted = clone(l); drifted.proInsight.source.url = 'https://example.com/unapproved';
      assert.equal(checks.audit(definition,drifted,s).ok, false);
    }
  }
});

test('concrete evidence failures withhold each new check instead of accepting a same-topic renderer', () => {
  const corruptions = {
    [ids[1]]:[l=>{l.steps[1].visual.serve[0][0] += 1;},l=>{l.steps[2].visual.referenceStart = l.steps[2].visual.start;},l=>{l.steps[1].visual.mode='choice';},l=>{delete l.steps[0].visual.contact;},l=>{l.steps[2].visual.servePaceRatio=1.5;},l=>{delete l.steps[2].visual.servePaceRatio;},l=>{l.steps[2].visual.servePaceRatio=0;},l=>{delete l.steps[2].visual.serveBounce;}],
    [ids[2]]:[l=>{l.steps[1].visual.secondOutcome='POINT WON';},l=>{l.steps[2].visual.resetOutcome='SERVE IN';},l=>{l.steps[2].visual.routineObserved=l.steps[2].visual.routineBefore;},l=>{delete l.steps[0].visual.responsePath;}],
    [ids[3]]:[l=>{l.steps[2].visual.scene=1;},l=>{l.steps[1].visual.actions=['close','pace','angle','deep-line'];},l=>{l.steps[2].correct=0;}]
  };
  for (const definition of checks.definitions.slice(1)) {
    for (const change of [l=>{delete l.steps[1].visual;},l=>{l.steps[1].visual.kind='court';},l=>{l.steps[2].decisionLens='guess';},...corruptions[definition.id]]) {
      const l = lesson(definition); change(l);
      const outcome = checks.audit(definition,l,bound(definition));
      assert.equal(outcome.ok, false);
      assert.equal(outcome.coachApproved, false);
    }
    const s = bound(definition); s.visualContract.mustShow.pop();
    assert.equal(checks.audit(definition,lesson(definition),s).ok, false);
  }
});

test('browser UMD export is inert and missing forehand dependency withholds only that experiment', () => {
  const code = fs.readFileSync(new URL('./gamesharp-court-checks.js', import.meta.url), 'utf8');
  const context = {GameSharpForehandCheck:forehand}; vm.createContext(context); vm.runInContext(code, context);
  assert.deepEqual(Object.keys(context), ['GameSharpForehandCheck','GameSharpCourtChecks']);
  assert.deepEqual(JSON.parse(JSON.stringify(context.GameSharpCourtChecks.definitions)), checks.definitions);
  assert.deepEqual(JSON.parse(JSON.stringify(context.GameSharpCourtChecks.interpret(ids[2], mental()))), checks.interpret(ids[2], mental()));
  const missing = {}; vm.createContext(missing); vm.runInContext(code, missing);
  assert.deepEqual(Object.keys(missing), ['GameSharpCourtChecks']);
  assert.equal(missing.GameSharpCourtChecks.definitions.length, 3);
  assert.equal(missing.GameSharpCourtChecks.byId[ids[0]], undefined);
  assert.equal(missing.GameSharpCourtChecks.validateReport(ids[0], forehands()), false);
  assert.equal(missing.GameSharpCourtChecks.interpret(ids[0], forehands()).title, 'Observation incomplete');
});
