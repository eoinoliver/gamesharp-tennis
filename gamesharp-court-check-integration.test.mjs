import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {runtime} from './tools/court-check-runtime-harness.mjs';
const require=createRequire(import.meta.url);
const checks=require('./gamesharp-court-checks.js');
const checkState=require('./gamesharp-court-check-state.js');
const sharpenState=require('./gamesharp-sharpen-state.js');
const gold=require('./gold-daily-prototypes.js');
const fixtures=[
  {id:'return-position-check-v1',lessonId:'gold_return_position_v1',region:'serve_return',pathId:'serve_return_crowded',report:{contact:'more-time',cost:'none-noticed',comparable:true}},
  {id:'next-point-reset-check-v1',lessonId:'gold_miss_two_points_v1',region:'mindset',pathId:'mindset_after_miss',report:{opportunity:'comparable-ball',routine:'used',intention:'clear'}},
  {id:'approach-volley-check-v1',lessonId:'gold_approach_volley_v1',region:'net',pathId:'net_first_volley',report:{opponentContact:'deeper',volleyHeight:'higher',approachCost:'none-noticed',comparable:true}}
];
const stateFor=f=>({stage:'focus',playerRegion:f.region,playerIssue:f.pathId,lessonId:f.lessonId,checkId:f.id,source:'sharpen',contextualEntry:false});
const open=f=>runtime({initialState:stateFor(f)});
function submit(r,payload){
  const form=r.stage.querySelector('form');assert.ok(form,'Actual report form must exist');
  form.values=Object.fromEntries(Object.entries(payload).map(([key,value])=>[key,String(value)]));
  form.dispatch('change');form.dispatch('submit');
}

for(const f of fixtures){
  test(f.id+': actual lesson, matching observation, plan and explicit immutable report stay distinct',()=>{
    const r=open(f),d=checks.byId[f.id],lesson=gold.challenges.find(item=>item.id===f.lessonId);
    assert.deepEqual(JSON.parse(JSON.stringify(r.api.checkDefinition())),JSON.parse(JSON.stringify(d)));
    assert.equal(r.api.launchPath(f.pathId),true);
    assert.equal(r.opened.at(-1).id,f.lessonId,'Concern must use its exact existing lesson');
    r.opened.at(-1).options.onReturn({lessonId:f.lessonId,completed:true});
    assert.equal(r.api.getState().stage,'check-match');
    assert.equal(r.courtExperiment(f.id),null);assert.equal(r.focus(),null);
    r.chooseMatch('yes');assert.equal(r.api.getState().stage,'check-plan');
    for(const field of ['disclosure','adaptation'])assert.ok(r.html().includes(d[field]),field+' comes from this definition');
    const cue=d.plan.blocks.find(block=>block.cue).cue;
    assert.ok(r.html().includes(cue),'Exact practical cue is rendered');
    assert.ok(r.html().includes(d.plan.setup),'Setup comes from this definition');
    for(const item of d.sources)assert.ok(r.html().includes(item.url));
    assert.equal(r.courtExperiment(f.id),null,'Viewing instructions is not saving them');
    r.click('[data-check-plan]');
    const plan=r.courtExperiment(f.id);assert.ok(plan.plannedAt);assert.equal(plan.report,null);
    assert.equal(plan.experimentId,f.id);assert.equal(plan.lessonId,f.lessonId);
    assert.equal(r.focus().lessonId,f.lessonId);assert.equal(r.focus().practicedAt,null);assert.equal(r.focus().feedback,null);
    r.click('[data-check-record]');assert.equal(r.api.getState().stage,'check-report');
    r.stage.querySelector('form').dispatch('submit');
    assert.equal(r.courtExperiment(f.id).report,null,'Blank required fields must not become observations');
    const form=r.stage.querySelector('form');form.values=Object.fromEntries(Object.entries(f.report).map(([key,value])=>[key,String(value)]));form.dispatch('change');
    assert.equal(r.courtExperiment(f.id).report,null,'A draft is not a court trial');
    form.dispatch('submit');assert.equal(r.api.getState().stage,'check-result');
    for(const [key,value] of Object.entries(f.report))assert.equal(r.courtExperiment(f.id).report[key],value,key+' must preserve report type and value');
    assert.ok(r.focus().practicedAt);assert.equal(r.focus().feedback,null,'Report never invents the generic improvement feedback');
    assert.equal(r.data.get('gs_main_daily_history_v1'),'existing Daily credit');
    assert.equal(r.data.get('gs_gold_daily_checkpoint_v1'),'existing partial Daily');
    assert.ok(r.writes.every(key=>[checkState.key,sharpenState.key].includes(key)),'No unrelated storage writes');
    const first=JSON.stringify(r.courtExperiment(f.id));
    r.click('[data-check-plan-review]');assert.equal(r.api.getState().stage,'check-plan-review');
    assert.ok(r.html().includes(cue));assert.doesNotMatch(r.html(),/data-check-plan(?:\s|>)|data-check-record|data-check-submit/);
    r.click('[data-check-result]');assert.equal(JSON.stringify(r.courtExperiment(f.id)),first);
    r.click('[data-check-focus]');assert.ok(r.html().includes(lesson.takeItToCourt));
    r.click('[data-court-check]');assert.equal(r.api.getState().stage,'check-result');assert.equal(JSON.stringify(r.courtExperiment(f.id)),first);
  });

  test(f.id+': unsure, no match and missing exact spine cannot prescribe a trial',()=>{
    for(const match of ['unsure','no']){
      const r=open(f);r.api.renderFocus();r.click('[data-court-check]');r.chooseMatch(match);
      assert.equal(r.api.getState().stage,match==='unsure'?'check-observe':'check-boundary');
      assert.doesNotMatch(r.html(),/data-check-plan|data-check-record|data-check-submit/);
      assert.equal(r.courtExperiment(f.id),null);assert.equal(r.writes.length,0);
      r.api.back();assert.equal(r.api.getState().stage,'check-match');
      r.api.back();assert.equal(r.api.getState().stage,'focus');assert.equal(r.api.getState().lessonId,f.lessonId);
    }
    const r=runtime({search:'?sharpenChecks=1',initialState:stateFor(f),changeSpine:s=>{s.courtExperimentId='wrong-check';}});
    assert.equal(r.api.checkDefinition(),null);
    r.api.setState({...stateFor(f),stage:'check-plan'});r.api.renderCheck();
    assert.match(r.html(),/This court check is unavailable/);assert.equal(r.writes.length,0);
  });
}

test('explicit public beta release enables exactly four checks across every approved lesson without flags',()=>{
  const ids=checks.definitions.map(d=>d.id).sort();
  assert.equal(ids.length,4);
  assert.equal(checks.release.status,'user_authorized_beta');
  assert.deepEqual([...checks.release.experimentIds].sort(),ids);
  for(const hostname of ['www.gamesharptennis.com','gamesharptennis.com','127.0.0.1','localhost']){
    const enabled=[];
    for(const lesson of gold.challenges.filter(c=>!c.reviewOnly)){
      const r=runtime({hostname,search:'',initialState:{...stateFor(fixtures[0]),lessonId:lesson.id,checkId:null}});
      const d=r.api.checkDefinition();
      r.api.renderFocus();
      if(d){enabled.push(d.id);assert.match(r.html(),/data-court-check/);assert.equal(d.lessonId,lesson.id);assert.equal(d.coachApproved,false);}
      else assert.doesNotMatch(r.html(),/data-court-check/);
      assert.equal(r.writes.length,0);
    }
    assert.deepEqual(enabled.sort(),ids,hostname+' must expose only exact authorized bindings');
  }
  for(const f of fixtures){
    for(const search of ['', '?forehandCheck=1','?sharpenChecks=0','?sharpenChecks=true'])assert.equal(runtime({search,initialState:stateFor(f)}).api.checkDefinition()?.id,f.id);
    for(const key of ['GameSharpCourtChecks','GameSharpCourtCheckState','GameSharpGoldDaily','GameSharpGoldLessonSpines'])assert.equal(runtime({search:'?sharpenChecks=1',initialState:stateFor(f),omit:[key]}).api.checkDefinition(),null,key);
  }
});

test('missing or invalid release metadata and omitted exact IDs withhold even when old local flags are supplied',()=>{
  for(const d of checks.definitions){
    const initialState={stage:'focus',playerRegion:d.region,playerIssue:d.pathId,lessonId:d.lessonId,checkId:d.id,source:'sharpen',contextualEntry:false};
    for(const changeRelease of [
      r=>{delete r.release;},r=>{r.release=null;},r=>{r.release.status='local_review';},
      r=>{r.release.status=true;},r=>{r.release.experimentIds=[];},r=>{delete r.release.experimentIds;},
      r=>{r.release.experimentIds=d.id;},r=>{r.release.experimentIds=r.release.experimentIds.filter(id=>id!==d.id);}
    ]){
      const r=runtime({hostname:'www.gamesharptennis.com',search:'?sharpenChecks=1&forehandCheck=1',initialState,changeRelease});
      assert.equal(r.api.checkDefinition(),null,d.id);r.api.renderFocus();assert.doesNotMatch(r.html(),/data-court-check/);
      r.api.setState({...initialState,stage:'check-plan'});r.api.renderCheck();
      assert.match(r.html(),/This court check is unavailable/);assert.doesNotMatch(r.html(),/data-check-plan|data-check-record/);assert.equal(r.writes.length,0);
    }
  }
});

test('mental practice requires both a known opportunity and an explicitly used routine',()=>{
  for(const payload of [
    {opportunity:'no-miss',routine:'not-used',intention:'unsure'},
    {opportunity:'comparable-ball',routine:'not-used',intention:'clear'},
    {opportunity:'comparable-ball',routine:'unsure',intention:'unsure'},
    {opportunity:'unsure',routine:'used',intention:'clear'}
  ]){
    const f=fixtures[1],r=open(f);r.api.renderFocus();r.click('[data-court-check]');r.chooseMatch('yes');r.click('[data-check-plan]');r.click('[data-check-record]');
    submit(r,payload);
    assert.equal(r.api.getState().stage,'check-result');assert.equal(r.courtExperiment(f.id).report.opportunity,payload.opportunity);
    assert.equal(r.focus().practicedAt,null,'No confirmed opportunity plus execution means the focus stays untried');assert.equal(r.focus().feedback,null);
    assert.doesNotMatch(r.html(),/you improved|fault solved|routine worked/i);
  }
  const f=fixtures[1],r=open(f);r.api.renderFocus();r.click('[data-court-check]');r.chooseMatch('yes');r.click('[data-check-plan]');r.click('[data-check-record]');
  submit(r,{opportunity:'different-ball',routine:'used',intention:'clear'});
  assert.ok(r.focus().practicedAt,'A real reported routine can be tried even when the next ball changes the job');assert.equal(r.focus().feedback,null);
});

test('switching check journeys preserves separate first reports and never leaks a pending form draft',()=>{
  const r=open(fixtures[0]);r.api.renderFocus();r.click('[data-court-check]');r.chooseMatch('yes');r.click('[data-check-plan]');r.click('[data-check-record]');
  const unfinished=r.stage.querySelector('form');unfinished.values={contact:'less-time',cost:'both',comparable:'false'};unfinished.dispatch('change');
  assert.equal(r.courtExperiment(fixtures[0].id).report,null);
  for(const f of [fixtures[1],fixtures[2],fixtures[0]]){
    const alreadyPlanned=!!r.courtExperiment(f.id),priorFocus=JSON.stringify(r.focus());
    r.api.launchPath(f.pathId);r.opened.at(-1).options.onReturn({lessonId:f.lessonId,completed:true});
    if(r.api.getState().stage==='check-match')r.chooseMatch('yes');
    if(!r.courtExperiment(f.id))r.click('[data-check-plan]');
    r.click('[data-check-record]');submit(r,f.report);assert.equal(r.api.getState().stage,'check-result');
    if(alreadyPlanned)assert.equal(JSON.stringify(r.focus()),priorFocus,'A resumed older report cannot change or mark another saved focus');
    else assert.equal(r.focus().lessonId,f.lessonId,'Only the explicitly planned focus changes');
  }
  for(const f of fixtures)for(const [key,value] of Object.entries(f.report))assert.equal(r.courtExperiment(f.id).report[key],value,f.id+' reports remain separate');
  assert.equal(r.experiment(),null,'The original forehand record is untouched');
});
