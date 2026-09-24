import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const root=path.dirname(new URL(import.meta.url).pathname);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const prototype=fs.readFileSync(path.join(root,'livepoint-prototype.html'),'utf8');
const content=createRequire(import.meta.url)(path.join(root,'livepoint-content.js'));

function block(name){
  const start=html.indexOf('function '+name+'(');
  assert.ok(start>=0,name+' is missing');
  const open=html.indexOf('{',start);let depth=0;
  for(let i=open;i<html.length;i++){
    if(html[i]==='{')depth++;
    else if(html[i]==='}'&&--depth===0)return html.slice(start,i+1);
  }
  throw new Error(name+' did not close');
}

const daily=block('runStandardDaily');
const plan=block('gsDailyVisualPlan');
const answer=block('pickAnswer');
const score=block('showScore');
const completionReady=block('gsDailyCompletionReady');
const finalize=block('gsFinalizeDailyCompletion');
const next=block('nextQ');
const message=block('gsHandleLivePointMessage');
const frameUrl=block('gsLivePointFrameUrl');
const startLive=block('startDailyLivePoint');
const playbook=block('initPlaybook');

assert.match(plan,/const type = 'live'/,'the recovery Daily must use the validated Live Point anchor');
assert.doesNotMatch(plan,/\? 'live' : 'fix'|type\s*=\s*'fix'/,'quarantined Fix content can still alternate into the Daily');
assert.match(plan,/getTodayKey\(\) \+ '_visual_' \+ GS_DAILY_VISUAL_VERSION/,'today’s persisted plan key is missing');
assert.doesNotMatch(plan,/Math\.random/,'Daily visual type or ID must never reroll randomly');
assert.equal((daily.match(/bundle\.push\(visualAnchor\)/g)||[]).length,1,'Daily must append exactly one visual anchor');
assert.match(daily,/let bundle = tac\.slice\(\)/,'Daily must begin with the three supporting reads');
assert.match(daily,/if \(!visualAnchor\)[\s\S]*return false/,'a missing visual anchor must fail closed');
assert.match(next,/Quarantined Fix content reached the Daily[\s\S]*__dailyLivePoint/,'the final-step router must fail closed if legacy Fix content appears');
assert.doesNotMatch(answer,/markDailyDone\(|updateStreak\(/,'an individual answer must never complete the Daily');
assert.match(score,/gsFinalizeDailyCompletion\(\)/,'only the completed score flow may finalize the Daily');
assert.match(score,/if \(state\.isDailyMode && !gsDailyCompletionReady\(\)\)/,'an incomplete Daily must be unable to render a truthful score screen');
assert.match(completionReady,/total === 4/,'Daily completion must require all four scored calls');
assert.match(completionReady,/anchors\.length === 1/,'Daily completion must require exactly one approved visual anchor');
assert.match(completionReady,/!state\.quiz\.some\(q => q && q\.__dailyTech\)/,'Daily completion must reject every legacy Fix marker');
assert.match(completionReady,/state\.results\.every\(v => typeof v === 'boolean'\)/,'Daily completion must reject missing or malformed outcomes');
assert.match(finalize,/!gsDailyCompletionReady\(\)/,'streak finalization must fail closed unless the Daily contract is complete');
assert.match(message,/_gsDailyLiveOutcome\.scenarioId !== data\.scenarioId/,'Daily completion must match the same frame’s emitted outcome');
assert.match(message,/_gsDailyLiveOutcome\.ok !== !!data\.ok/,'a stale frame must not change the fourth score');
assert.match(message,/data\.type === 'gs-livepoint-result' && !_gsDailyLiveOutcome/,'the first Live Point result must be immutable while the other line is explored');
assert.match(frameUrl,/params\.set\('context', context\)/,'embedded Live Point context must be explicit');
assert.match(startLive,/state\.isDailyMode \? 'daily' : 'challenge'/,'Daily and shared challenges must not use contradictory completion language');
assert.match(html,/^<script src="livepoint-content\.js\?v=/m,'the app must load the shared Live Point bank');
assert.match(prototype,/^<script src="livepoint-content\.js\?v=[^"?]+"><\/script>$/m,'the original Live Point must load a cache-versioned bank');
assert.match(playbook,/gsLivePointPool\(\)/,'Playbook must render the canonical Live Point pool');
assert.match(playbook,/live\.map\(_pbLiveCardHTML\)/,'all validated Live Points must appear in the nested library');
assert.equal(content.scenarios.length,22,'the approved bank must contain all 22 original Live Points');
assert.equal(Object.keys(content.targets).length,content.scenarios.length,'every Live Point needs exactly one explicit Sharpen target');
assert.equal(content.targets.inside_out_forehand,'forehand','inside-out forehand routing regressed');
assert.match(prototype,/const hasNext=!EMBED_MODE&&cur<LIVE\.length-1/,'embedded points must not become an endless feed');
assert.match(prototype,/Whole-point replay first/,'the Daily must require its whole-point learning replay');
assert.match(prototype,/id="lpOtherLine">Play the other line/,'Daily Live Point must retain the original alternate-line learning path');
assert.match(prototype,/const firstGuidedResult=isGuided&&!guidedScoredResult/,'Daily and Predict must lock the first attempt before free exploration');
assert.match(prototype,/if\(!isGuided\|\|firstGuidedResult\)lpPost\('gs-livepoint-result'/,'guided exploration must never emit a replacement score');
assert.match(prototype,/function lpCompletionLabel\(\)/,'embedded completion copy must derive from the explicit host context');
assert.match(prototype,/Open this pattern in Playbook/,'Predict completion must name its actual next destination');
assert.match(prototype,/@media\(prefers-reduced-motion:reduce\)/,'Live Point must respect reduced-motion preferences');
assert.match(prototype,/canReplay&&!REDUCED_MOTION/,'reduced-motion users must never be trapped behind an animation gate');

console.log(JSON.stringify({contract:'daily-visual-anchor-v2-recovery',dailyCalls:4,anchor:'Live Point only',livePoints:content.scenarios.length,status:'PASS'},null,2));
