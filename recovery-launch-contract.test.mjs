import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const root=new URL('.',import.meta.url);
const host=fs.readFileSync(new URL('./index.html',root),'utf8');
const live=fs.readFileSync(new URL('./livepoint-prototype.html',root),'utf8');
const integration=require(new URL('./predict-live-integration.js',root).pathname);
const liveContent=require(new URL('./livepoint-content.js',root).pathname);
const manifest=JSON.parse(fs.readFileSync(new URL('./LAUNCH_MANIFEST.json',root),'utf8'));

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

assert.equal(manifest.canonicalSource,'/Users/eoinlynn/Downloads/gamesharp-tennis-integration');
assert.equal(liveContent.version,manifest.version,'Live Point content and release manifest versions differ');
assert.equal(manifest.status,'candidate','a local recovery build must not masquerade as deployed or production-approved');
assert.deepEqual(manifest.predictJourneys.map(item=>item.id),integration.LAUNCH_SEQUENCE_IDS,'manifest and runtime launch order differ');
assert.deepEqual(manifest.quarantinedPredictIds,[...Object.keys(integration.CONTRACTS).filter(id=>!integration.LAUNCH_SEQUENCE_IDS.includes(id))],'quarantine list is incomplete');
assert.ok(manifest.predictJourneys.every(item=>item.mobileReview==='approved'),'a launch journey still lacks first-hand mobile review');
assert.ok(manifest.predictJourneys.every(item=>item.desktopReview==='approved'),'a launch journey still lacks first-hand desktop review');
assert.deepEqual(manifest.livePoints.map(item=>item.id),liveContent.launchIds,'Live Point manifest and runtime allowlists differ');
assert.ok(manifest.livePoints.every(item=>item.target===liveContent.targets[item.id]),'a Live Point Sharpen target drifted');
assert.ok(manifest.livePoints.every(item=>item.renderer==='live-point-timeline-v1'&&item.contentReview==='approved'),'a Live Point lacks approved content or renderer');
assert.ok(manifest.livePoints.every(item=>item.mobileReview==='approved'),'a Live Point still lacks first-hand mobile review');
assert.ok(manifest.livePoints.every(item=>item.desktopReview==='approved'),'a Live Point still lacks first-hand desktop review');
assert.match(manifest.livePointReviewerNote,/personally reviewed.+2026-09-01/,'Live Point review lacks a dated human note');

const dailyAllowlist=host.match(/const GS_RECOVERY_DAILY_READ_IDS = new Set\(\[([\s\S]*?)\]\);/)?.[1]
  .match(/'([^']+)'/g)?.map(id=>id.slice(1,-1))||[];
assert.deepEqual(dailyAllowlist,manifest.daily.approvedReadIds,'Daily runtime and manifest allowlists differ');
assert.equal(dailyAllowlist.length,20,'Daily recovery pool broadened beyond the personally reviewed batch');
assert.equal(manifest.daily.contentReview,'approved','Daily content lacks explicit human approval');
assert.match(manifest.daily.reviewerNote,/personally reviewed.+2026-09-01/,'Daily approval lacks a dated reviewer note');

for(const item of manifest.predictJourneys){
  const link=integration.connection(item.id);
  assert.ok(integration.isLaunchEligible(item.id),item.id+' is not end-to-end eligible');
  assert.equal(item.livePointId,link.livePointId,item.id+' Live Point drifted');
  assert.equal(item.playbookId,link.playbookId,item.id+' Playbook route drifted');
  assert.equal(item.renderer,'point-iq-timeline-v1',item.id+' uses an unapproved renderer');
}
assert.deepEqual(integration.validateAll(),[]);
assert.equal(new Set(integration.launchPlaybookIds()).size,8,'the recovery Playbook must contain eight connected patterns');
assert.ok(manifest.predictJourneys.every(item=>['direct','transfer'].includes(item.connectionType)),'every journey must declare whether Live Point is direct reinforcement or transfer');

const daily=block(host,'runStandardDaily');
const livePool=block(host,'gsLivePointPool');
const complete=block(host,'gsDailyCompletionReady');
const techFactory=block(host,'gsMakeDailyTechMarker');
const predictOpen=block(host,'gsOpenPredictLivePoint');
const message=block(host,'gsHandleLivePointMessage');
const library=block(host,'initLearnHub');
const continuePattern=block(host,'pbContinuePattern');
assert.match(daily,/3 reads \+ 1 Live Point/);
assert.match(host,/GS_RECOVERY_DAILY_READ_IDS\.has\(q\.id\)/,'Daily eligibility is still inferred instead of fail-closed by ID');
assert.match(livePool,/approved\.has\(sc\.id\)/,'new Live Points can surface without explicit launch approval');
assert.match(live,/LP_LAUNCH_IDS\.has\(scenario\.id\)/,'the standalone Live Point deck ignores the launch allowlist');
assert.doesNotMatch(daily,/gsMakeDailyTechMarker|dtcAllFaults/,'legacy fault content is reachable from the Daily builder');
assert.match(complete,/!state\.quiz\.some\(q => q && q\.__dailyTech\)/,'legacy Fix markers are not rejected at completion');
assert.match(techFactory,/return null/,'the legacy Daily Fix factory is not quarantined');
assert.match(predictOpen,/GSPredictLive\.isLaunchEligible\(sequenceId\)/,'Predict can open a non-manifest journey');
assert.match(message,/initPlaybook\(playbookId, 'patterns', sequenceId\)/,'the connected Playbook route lost its exact sequence context');
assert.match(live,/Open this pattern in Playbook/,'Live Point completion copy does not match its destination');
assert.doesNotMatch(library,/safeBank|The 5 Pillars|initPillarScreen|startQuiz/,'the recovery library exposes unreviewed broad-bank content');
assert.match(library,/The Playbook and your learning trail\. Sourced insights live inside each Daily lesson\./,'the recovery library does not state its current curated scope');
assert.match(continuePattern,/sequenceForPlaybook/,'a Playbook card is not driven by a validated launch journey');
assert.doesNotMatch(continuePattern,/playbookTry/,'a launch Playbook card can fall back to an unreviewed question bundle');

const focusSelectors=host.match(/const SELECTORS=\[([^\]]+)\]/)?.[1]||'';
assert.equal(focusSelectors,"'.gspl-stage'",'global Focus View can still magnify a legacy renderer');
assert.match(host,/const GS_FIX_A_SHOT_LAUNCH_ENABLED = false/,'Fix the Culprit launch entry is not quarantined');
assert.match(host,/Read the point\. Then play the consequence\./,'Home does not describe the recovered learning loop');
assert.match(host,/Predict & Play →/,'Home CTA does not set an accurate expectation');
assert.match(host,/\.ta-court-wrap svg \*,\.concept-motif svg/,'non-interactive animation layers can still intercept navigation taps');
assert.match(host,/\.seq-skip-observe\[hidden\]\{display:none!important;\}/,'answered warm-up still presents a contradictory skip action');
assert.equal((host.match(/buildSeqCourtAnim\(/g)||[]).length,1,'the retired Predict renderer is reachable again');

const release=host.match(/const GS_POINT_IQ_RELEASE = '([^']+)'/)?.[1];
assert.equal(release,manifest.version,'manifest and host release token differ');
for(const source of [host,live]){
  const versions=[...source.matchAll(/(?:livepoint-engine|livepoint-content|predict-live-integration)\.js\?v=([^"']+)/g)].map(match=>match[1]);
  assert.ok(versions.length>=2,'versioned learning scripts are missing');
  assert.ok(versions.every(version=>version===manifest.version),'mixed learning release detected');
}

console.log(JSON.stringify({
  contract:'recovery-launch-v1',goldenJourneys:manifest.predictJourneys.length,
  launchPlaybookPatterns:integration.launchPlaybookIds().length,globalFocusRenderers:1,status:'PASS'
},null,2));
