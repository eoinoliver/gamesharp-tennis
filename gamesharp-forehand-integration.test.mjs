import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const gold=require('./gold-daily-prototypes.js');
const check=require('./gamesharp-forehand-check.js');
const checkState=require('./gamesharp-forehand-check-state.js');
const checks=require('./gamesharp-court-checks.js');
const sharpenState=require('./gamesharp-sharpen-state.js');
const paths=require('./gamesharp-sharpen-paths.js');
const clone=value=>JSON.parse(JSON.stringify(value));
const contact=gold.challenges.find(item=>item.id===check.definition.lessonId);
const initial={stage:'focus',playerRegion:'forehand',playerIssue:'forehand_crowded_contact',lessonId:contact.id,checkId:check.definition.id,source:'sharpen',contextualEntry:false};

import {runtime} from './tools/court-check-runtime-harness.mjs';

test('the explicitly released forehand beta is available without a query on public and local hosts',()=>{
  for(const hostname of ['www.gamesharptennis.com','gamesharptennis.com','gamesharp-tennis.vercel.app','127.0.0.1','localhost','[::1]']){
    const r=runtime({hostname,search:''});
    assert.deepEqual(clone(r.api.checkDefinition()),clone(checks.byId[check.definition.id]),hostname);
    r.api.renderFocus();
    assert.ok(r.html().includes(contact.takeItToCourt),'canonical lesson cue stays available');
    assert.match(r.html(),/data-court-check/);
    assert.equal(r.experiment(),null);
    assert.equal(r.writes.length,0);
  }
  for(const search of ['', '?forehandCheck=0','?forehandCheck=true','?forehandCheck=1','?sharpenChecks=1'])assert.deepEqual(clone(runtime({search}).api.checkDefinition()),clone(checks.byId[check.definition.id]));
});

test('missing runtime dependencies or canonical binding fail closed with no practice state',()=>{
  for(const key of ['GameSharpForehandCheck','GameSharpForehandCheckState','GameSharpCourtChecks','GameSharpGoldLessonSpines','GameSharpGoldDaily']){
    const r=runtime({omit:[key]});
    assert.equal(r.api.checkDefinition(),null,key);
    r.api.setState({...initial,stage:'check-plan'});r.api.renderCheck();
    assert.match(r.html(),/This court check is unavailable/);
    assert.equal(r.experiment(),null);assert.equal(r.writes.length,0);
  }
  for(const changeSpine of [s=>{delete s.courtExperimentId;},s=>{s.courtExperimentId='another-experiment';},s=>{s.mechanic='daily';}]){
    const r=runtime({changeSpine});
    assert.equal(r.api.checkDefinition(),null);
    r.api.setState({...initial,stage:'check-plan'});r.api.renderCheck();
    assert.match(r.html(),/This court check is unavailable/);
    assert.equal(r.writes.length,0);
  }
  const r=runtime();r.context.GS_GOLD_DAILY_CSS_READY=false;
  assert.equal(r.api.checkDefinition(),null);
});

test('actual render uses canonical lesson cue and exact experiment cue with honest source boundaries',()=>{
  const r=runtime();r.api.renderFocus();
  assert.ok(r.html().includes(contact.memory));
  assert.ok(r.html().includes(contact.takeItToCourt));
  assert.match(r.html(),/data-court-check/);
  r.click('[data-court-check]');
  assert.equal(r.api.getState().stage,'check-match');
  assert.match(r.html(),/does not diagnose your stroke/);
  r.chooseMatch('yes');
  assert.equal(r.api.getState().stage,'check-plan');
  for(const field of ['setup','usualBlock','cueBlock','cue','counting','disclosure','adaptation'])assert.ok(r.html().includes(check.definition[field]),field+' must be rendered from the definition');
  for(const limit of check.definition.limits)assert.ok(r.html().includes(limit));
  for(const item of check.definition.sources)assert.ok(r.html().includes(item.url));
  assert.match(r.html(),/Source-informed prototype · coach review pending/);
  assert.equal(r.experiment(),null);
  assert.equal(r.focus(),null);
});

test('real handlers separate planning, entering a report and explicit report submission',()=>{
  const r=runtime();
  r.api.setState({...initial,stage:'check-plan'});r.api.renderCheck();
  assert.equal(r.experiment(),null);
  assert.doesNotMatch(r.html(),/data-check-record/);
  r.click('[data-check-plan]');
  assert.ok(r.experiment().plannedAt);
  assert.equal(r.experiment().report,null);
  assert.equal(r.focus().practicedAt,null);
  const planned=JSON.stringify(r.experiment());
  r.click('[data-check-record]');
  assert.equal(r.api.getState().stage,'check-report');
  assert.equal(JSON.stringify(r.experiment()),planned,'entering the form is not practice');
  assert.match(r.html(),/No—or I’m not sure/);
  const form=r.stage.querySelector('form');
  form.dispatch('submit');
  assert.equal(r.experiment().report,null,'empty native-required fields do not record a trial');
  form.values={beforeMisses:'4',afterMisses:'2',spacing:'more-room',comparable:'true'};
  form.dispatch('change');
  assert.equal(r.experiment().report,null,'a draft is not a report');
  form.dispatch('submit');
  assert.equal(r.api.getState().stage,'check-result');
  assert.equal(r.experiment().report.beforeMisses,4);
  assert.equal(r.experiment().report.afterMisses,2);
  assert.ok(r.focus().practicedAt,'explicit court report can record self-reported practice');
  assert.match(r.html(),/A useful signal to recheck/);
  assert.match(r.html(),/does not establish the cause or predict match results/);
  assert.equal(r.data.get('gs_main_daily_history_v1'),'existing Daily credit');
  assert.equal(r.data.get('gs_gold_daily_checkpoint_v1'),'existing partial Daily');
  assert.ok(r.writes.every(key=>[checkState.key,sharpenState.key].includes(key)),'only the scoped stores may be written');
  const recorded=JSON.stringify(r.experiment());
  r.click('[data-check-plan-review]');
  assert.equal(r.api.getState().stage,'check-plan-review');
  assert.ok(r.html().includes(check.definition.cue));
  assert.doesNotMatch(r.html(),/data-check-plan(?:\s|>)|data-check-record|data-check-submit/);
  assert.equal(JSON.stringify(r.experiment()),recorded);
  r.click('[data-check-result]');
  assert.equal(r.api.getState().stage,'check-result');
  assert.equal(JSON.stringify(r.experiment()),recorded,'reviewing instructions never overwrites the first observation');
});

test('unsure or unmatched contact never writes a plan or prescribes extra distance',()=>{
  for(const value of ['unsure','no']){
    const r=runtime();r.api.setState({...initial,stage:'check-match'});r.api.renderCheck();
    r.chooseMatch(value);
    assert.equal(r.api.getState().stage,value==='unsure'?'check-observe':'check-boundary');
    assert.match(r.html(),/No stroke change is prescribed here/);
    assert.doesNotMatch(r.html(),/data-check-plan|data-check-record/);
    assert.equal(r.experiment(),null);assert.equal(r.writes.length,0);
  }
});

test('Contact detour cannot leak into another completed lesson after real Back handlers',()=>{
  const r=runtime();r.api.setState({...initial,stage:'check-match',checkJourney:true});r.api.renderCheck();
  r.api.back();assert.equal(r.api.getState().stage,'focus');
  r.api.back();assert.equal(r.api.getState().stage,'region');
  const other=paths.byId.forehand_high_bounce;
  assert.equal(r.api.launchPath(other.id),true);
  assert.equal(r.api.getState().checkJourney,false);
  const pending=r.opened.at(-1);
  assert.equal(pending.id,other.lessonId);
  pending.options.onReturn({lessonId:other.lessonId,completed:true});
  assert.equal(r.api.getState().stage,'focus');
  assert.equal(r.api.getState().lessonId,other.lessonId);
  assert.doesNotMatch(r.html(),/Does that contact feel familiar|data-court-check/);
  assert.equal(r.experiment(),null);
});
