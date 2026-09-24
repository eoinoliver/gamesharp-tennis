import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const root=new URL('.',import.meta.url);
const host=fs.readFileSync(new URL('./index.html',root),'utf8');
const prototype=fs.readFileSync(new URL('./livepoint-prototype.html',root),'utf8');
const vercel=JSON.parse(fs.readFileSync(new URL('./vercel.json',root),'utf8'));

const memory=new Map();
globalThis.localStorage={
  getItem:key=>memory.has(key)?memory.get(key):null,
  setItem:(key,value)=>memory.set(key,String(value)),
  removeItem:key=>memory.delete(key)
};
const content=require(new URL('./livepoint-content.js',root).pathname);
const integration=require(new URL('./predict-live-integration.js',root).pathname);
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

assert.deepEqual(integration.validateAll(),[],'the unified learning contract must validate before rendering');
assert.equal(Object.keys(integration.CONTRACTS).length,20,'all 20 Predict sequences need a canonical contract');
assert.equal(Object.keys(integration.CONNECTIONS).length,20,'every Predict sequence needs an explicit connection decision');
assert.deepEqual(integration.LAUNCH_SEQUENCE_IDS,manifest.predictJourneys.map(item=>item.id),'runtime launch set drifted from the reviewed manifest');
assert.equal(integration.LAUNCH_SEQUENCE_IDS.length,9,'recovery release must expose only complete golden journeys');
const liveIds=new Set(content.scenarios.map(item=>item.id));
for(const [sequenceId,link] of Object.entries(integration.CONNECTIONS)){
  assert.ok(typeof link.condition==='string'&&link.condition.length>35,sequenceId+' is missing the boundary that changes the call');
  if(link.livePointId)assert.ok(liveIds.has(link.livePointId),sequenceId+' points to a missing Live Point');
  if(link.playbookId)assert.ok(integration.PLAYBOOK_IDS.includes(link.playbookId),sequenceId+' points to a missing Playbook pattern');
}
assert.equal(integration.connection('seq_007').livePointId,null,'doubles must not borrow a singles Live Point');
assert.equal(integration.connection('seq_014').livePointId,null,'body serve must fail closed until a faithful two-branch point exists');

let progress=integration.playbookProgress('wide_serve');
assert.equal(progress.label,'Not started');
assert.equal(progress.nextSequenceId,'seq_001');
assert.equal(progress.nextLevel,0);
integration.recordCompletion('seq_001',2,3);
progress=integration.playbookProgress('wide_serve');
assert.equal(progress.label,'Read correctly');
assert.equal(progress.nextLevel,2);
assert.equal(integration.recordLivePoint('seq_001','short_ball',true),null,'a nearby but wrong Live Point must never advance evidence');
assert.equal(integration.playbookProgress('wide_serve').label,'Read correctly');
integration.recordLivePoint('seq_001','serve_plus_one',true);
assert.equal(integration.playbookProgress('wide_serve').label,'Counter solved');

const linkedMarkup=integration.resultMarkup('seq_001');
assert.match(linkedMarkup,/Continue to Live Point/);
assert.match(linkedMarkup,/What changes the call/);
assert.match(linkedMarkup,/<details class="gspl-replay">/,'whole-point replay should remain available without dominating mobile');
const heldBackMarkup=integration.resultMarkup('seq_007');
assert.doesNotMatch(heldBackMarkup,/Continue to Live Point/,'an unmatched Live Point must fail closed');
assert.match(heldBackMarkup,/being rebuilt/,'a quarantined journey must say it is unavailable rather than silently falling back');

const openPredict=block(host,'gsOpenPredictLivePoint');
const message=block(host,'gsHandleLivePointMessage');
const continuePattern=block(host,'pbContinuePattern');
const playbookAction=block(host,'_pbAction');
assert.match(openPredict,/validateAll\(\)\.length/,'Predict → Live Point must fail closed when the global contract is invalid');
assert.doesNotMatch(openPredict,/state\.score|markDailyDone|updateStreak/,'the optional learning path must not mutate Daily truth');
assert.match(message,/link\.livePointId !== data\.scenarioId/,'the host must reject a mismatched scenario result');
assert.match(message,/!_gsPredictLiveOutcome/,'the first Predict Live Point outcome must be immutable');
assert.match(message,/initPlaybook\(playbookId, 'patterns', sequenceId\)/,'Live Point completion must open the exact connected Playbook pattern');
assert.match(continuePattern,/progress\.nextLevel===2[\s\S]*link\.livePointId/,'Playbook must open Live Point only after the read is established');
assert.match(continuePattern,/startLinkedSequence\(sequenceId\)/,'Playbook must return to Predict for first read and later recall');
assert.match(playbookAction,/progress\.level>=2\?'Read another variation':'Start pattern'/,'an established pattern must not misleadingly restart when it routes to a new read');
assert.match(playbookAction,/Test the read again/,'a solved counter must describe a repeat truthfully rather than claiming delayed recall');
assert.doesNotMatch(host,/Pattern learned|Patterns learned|gs_playbook_learned/,'the UI must not claim physical mastery from quiz evidence');
assert.match(host,/Decision evidence/,'Playbook must expose the shared truthful progression');
assert.match(host,/Browse every Live Point/,'the full library must remain available without becoming the primary route');
assert.match(host,/GSPredictLive\.launchPlaybookIds\(\)/,'the visible recovery Playbook must exclude unconnected legacy cards');
assert.match(host,/GSPredictLive\.playbookMarkup\(p\.id,validatedSequence\)/,'Playbook cards must use the validated Point IQ timeline');

assert.match(prototype,/const isGuided=isDaily\|\|isPredict/,'Daily and Predict must share the immutable two-line learning behavior');
assert.match(prototype,/guidedScoredResult/,'guided Live Point needs one canonical first outcome');
assert.match(prototype,/Play the other line/,'the counterfactual branch must remain visible');
assert.match(prototype,/function lpContextCopy\(\)/,'all embedded entry copy needs one context owner');
assert.match(prototype,/EMBED_MODE==='predict'\)return 'Play the consequence/,'Predict must never present itself as a Daily reward');
assert.doesNotMatch(prototype,/createOscillator|function\s+(?:tone|crowd|strike)\s*\(/,'synthetic game tones must not re-enter the engine');

const release=host.match(/const GS_POINT_IQ_RELEASE = '([^']+)'/)?.[1];
assert.ok(release,'the host must expose one Point IQ release token');
const hostVersions=[...host.matchAll(/(?:livepoint-engine|livepoint-content|predict-live-integration)\.js\?v=([^"']+)/g)].map(match=>match[1]);
const prototypeVersions=[...prototype.matchAll(/(?:livepoint-engine|livepoint-content)\.js\?v=([^"']+)/g)].map(match=>match[1]);
assert.deepEqual(new Set(hostVersions),new Set([release]),'host engine, content and integration must ship as one release');
assert.deepEqual(new Set(prototypeVersions),new Set([release]),'embedded Live Point must use the same release as its host');
assert.match(block(host,'gsLivePointFrameUrl'),/params\.set\('release', GS_POINT_IQ_RELEASE\)/,'every embedded document URL must carry the host release');
for(const route of ['/','/index.html','/livepoint-prototype.html']){
  const rule=vercel.headers?.find(item=>item.source===route);
  assert.ok(rule?.headers?.some(item=>item.key==='Cache-Control'&&/must-revalidate/.test(item.value)),route+' must revalidate so mixed HTML releases cannot persist');
}

const resultBuilder=block(host,'buildSeqResult');
assert.ok(resultBuilder.indexOf('${livePoint}')<resultBuilder.indexOf('What this teaches'),'the consequence must appear before secondary explanation on mobile');
assert.doesNotMatch(host,/<(?:button|a)[^>]*>[\s\S]{0,900}<button class="ptp-cta"/,'the tappable Predict region must not contain a second interactive control');
assert.match(host,/<span class="ptp-cta" id="ptpCta" aria-hidden="true">/,'the visual Predict CTA must defer interaction to the full tappable region');

console.log(JSON.stringify({
  contract:'point-iq-engine-v2-recovery',authoredPredictSequences:20,launchPredictSequences:integration.LAUNCH_SEQUENCE_IDS.length,livePoints:content.scenarios.length,
  launchPlaybookPatterns:integration.launchPlaybookIds().length,evidence:'Seen → Read → Counter → Recall',status:'PASS'
},null,2));
