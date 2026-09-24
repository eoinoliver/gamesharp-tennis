import fs from 'node:fs';
import assert from 'node:assert/strict';

const host=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
const live=fs.readFileSync(new URL('./livepoint-prototype.html',import.meta.url),'utf8');

function block(source,name){
  const start=source.indexOf('function '+name+'(');
  assert.ok(start>=0,name+' is missing');
  const open=source.indexOf('{',start);let depth=0;
  for(let i=open;i<source.length;i++){
    if(source[i]==='{')depth++;
    else if(source[i]==='}'&&--depth===0)return source.slice(start,i+1);
  }
  throw new Error(name+' did not close');
}

const daily=block(host,'runStandardDaily');
const again=block(host,'playAgain');
const practicePlan=block(host,'gsPracticeVisualPlan');
const load=block(host,'loadQ');
const next=block(host,'nextQ');
const answer=block(host,'pickAnswer');
const sequence=block(host,'renderSeq');
const sequenceAnswer=block(host,'pickSeqAnswer');
const liveResult=block(live,'result');
const scroll=block(host,'gsScrollTop');

assert.match(daily,/return false;[\s\S]*const visualPlan/,'an invalid tactical cadence must fail before an anchor is mounted');
assert.match(daily,/state\.isDailyMode = !isPracticeSet/,'practice must not alter Daily completion truth');
assert.match(daily,/3 reads \+ 1 Live Point/,'the Daily does not tell the truth about its recovered format');
assert.match(again,/runStandardDaily\(\{practice:true, practiceIndex:index\}\)/,'Another Hit bypasses the trusted four-call builder');
assert.doesNotMatch(again,/startQuiz\(/,'Another Hit can fall into an unrestricted module quiz');
assert.match(practicePlan,/const type = 'live'/,'Another Hit must use the same validated Live Point anchor');
assert.doesNotMatch(practicePlan,/type\s*=\s*'fix'|daily\.type/,'Another Hit can still recover a quarantined Fix anchor');
assert.match(load,/gsScrollTop\('#qText'\)/,'question load does not use the single transition owner');
assert.match(scroll,/document\.body\.scrollTop = 0/,'the mobile BODY scroll root is not reset');
assert.doesNotMatch(next,/gsScrollTop/,'Next has a second competing scroll reset');
assert.doesNotMatch(answer,/scrollIntoView/,'answer reveal can still move the page under the player');
assert.equal((sequence.match(/gsScrollTop\(/g)||[]).length,1,'Predict the Point has more than one transition owner');
assert.doesNotMatch(sequence,/requestAnimationFrame\(gsScrollTop\)|setTimeout\(gsScrollTop/,'a browser timestamp can be misread as a focus target');
assert.doesNotMatch(sequenceAnswer,/buildSeqCourtAnim|scrollIntoView/,'Predict can still insert or jump to the quarantined tactical renderer');
assert.match(live,/function lpTransitionTop/,'Live Point lacks a single transition owner');
assert.doesNotMatch(live,/scrollIntoView/,'Live Point still has competing automatic scrolling');
assert.ok(liveResult.indexOf('id="lpOtherLine"')<liveResult.indexOf('id="lpComplete"'),'the alternate line is buried after completion');
assert.match(liveResult,/firstGuidedResult=isGuided&&!guidedScoredResult/,'first Daily or Predict Live Point score is not immutable');

console.log(JSON.stringify({contract:'flow-integrity-v2-recovery',dailyCalls:4,repeatCadence:'validated Live Point anchor',scrollOwners:2,livePointOtherLine:'before completion',status:'PASS'},null,2));
