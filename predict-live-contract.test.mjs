import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import vm from 'node:vm';
import {createHash} from 'node:crypto';

const require=createRequire(import.meta.url);
const engine=require('./livepoint-engine.js');
const integration=require('./predict-live-integration.js');
const index=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
const coach=fs.readFileSync(new URL('./gamesharp-pain-coach.js',import.meta.url),'utf8');
const linkedPrefix='const LINKED_SEQUENCES = ';
const linkedTail=index.slice(index.indexOf(linkedPrefix)+linkedPrefix.length);
const linkedSequences=vm.runInNewContext(linkedTail.slice(0,linkedTail.indexOf('\n];')+2));
// The authored bank is followed by explicit, ID-bound human review repairs.
// Apply that exact production layer before comparing decisions with replays;
// testing the embedded pre-review source would certify content users never see.
const repairsStart=index.indexOf('const GS_SEQUENCE_CONTENT_REPAIRS = ');
const repairsEnd=index.indexOf('// ── STATE ──',repairsStart);
vm.runInNewContext(index.slice(repairsStart,repairsEnd),{LINKED_SEQUENCES:linkedSequences,Object});
// Candidate change detector, not independent coaching or release approval.
// Native release evidence is recorded separately in the sectioned repair record.
const candidateReplayFingerprints=Object.freeze({
  seq_001:'6343195cf4875e1a',seq_002:'989ad55cb558a8e5',seq_003:'153e2ea000325e05',seq_004:'d671d52d06c207b6',
  seq_005:'b80bfbb71f050342',seq_006:'63a87926d1fa6e27',seq_007:'0fb47869667ada54',seq_008:'01d939c913f58c64',
  seq_009:'3506fc78376d354d',seq_010:'044000917f54ace9',seq_011:'8d2aa0ed26f03822',seq_012:'9e4d7431e082628a',
  seq_013:'2270e1a1ffa9d618',seq_014:'4b19992b790af1e6',seq_015:'cda31a29950f7beb',seq_016:'cdd2b0eda828f797',
  seq_017:'159548bb64e938ae',seq_018:'ec9963c1e801c083',seq_019:'959d253ed807aff9',seq_020:'00654a67b229d493'
});

test('every authored sequence has one canonical, valid learning contract',()=>{
  assert.deepEqual(integration.validateAll(),[]);
  const ids=Object.keys(integration.CONTRACTS);
  assert.deepEqual(ids,['seq_001','seq_002','seq_003','seq_004','seq_005','seq_006','seq_007','seq_008','seq_009','seq_010','seq_011','seq_012','seq_013','seq_014','seq_015','seq_016','seq_017','seq_018','seq_019','seq_020']);
  const c=integration.contract('seq_001');
  assert.equal(c.sequenceId,'seq_001');
  assert.ok(c.conceptId);
  assert.ok(c.tags.length>=3);
  assert.ok(c.primaryArea);
  assert.equal(c.primaryArea,c.sharpenRegion);
  const linkedSection=index.slice(index.indexOf('const LINKED_SEQUENCES = ['),index.indexOf('const SEQ_TELLS = {'));
  const linkedIds=[...linkedSection.matchAll(/id:\s*'(seq_\d{3})'/g)].map(m=>m[1]);
  assert.deepEqual(ids,linkedIds);
});

test('every replay is locked to the three decisions it is meant to illustrate',()=>{
  const byId=Object.fromEntries(linkedSequences.map(sequence=>[sequence.id,sequence]));
  for(const [id,contract] of Object.entries(integration.CONTRACTS)){
    const sequence=byId[id];
    assert.ok(sequence,id+' is absent from Predict the Point');
    assert.equal(sequence.steps.length,3,id+' must remain a three-decision learning sequence');
    const correctDecisions=Array.from(sequence.steps,step=>String(step.options[step.correct]));
    assert.deepEqual([...contract.decisionAnchors],correctDecisions,id+' replay decisions drifted from its live question content');
  }
});

test('explicit replay candidate cannot drift silently',()=>{
  for(const [id,contract] of Object.entries(integration.CONTRACTS)){
    const reviewed={
      decisionAnchors:contract.decisionAnchors,insight:contract.insight,replayCue:contract.replayCue,
      primaryArea:contract.primaryArea,secondaryArea:contract.secondaryArea||null,
      sharpenRegion:contract.sharpenRegion,tags:contract.tags,play:contract.play
    };
    const fingerprint=createHash('sha256').update(JSON.stringify(reviewed)).digest('hex').slice(0,16);
    assert.equal(fingerprint,candidateReplayFingerprints[id],id+' changed: re-audit decisions, geometry, labels, timing, sound and Sharpen route; a fingerprint is not coaching approval');
  }
});

test('intentional sequence variants share progress without inflating it',()=>{
  const canonical=integration.contract('seq_008');
  const variant=integration.contract('seq_017');
  assert.equal(variant.variantOf,canonical.sequenceId);
  assert.equal(variant.conceptId,canonical.conceptId);
  assert.equal(variant.primaryArea,canonical.primaryArea);
  assert.deepEqual([...variant.tags].sort(),[...canonical.tags].sort());
});

test('question evidence only routes when the content gives a defensible area signal',()=>{
  assert.equal(integration.areaFromQuestion({tags:'serve, return, positioning',pillar:'Win More'}),'serve_return');
  assert.equal(integration.areaFromQuestion({module:'Forehand',pillar:'Technique'}),'forehand');
  assert.equal(integration.areaFromQuestion({tags:'pressure, reset',pillar:'Mental'}),'mindset');
  assert.equal(integration.areaFromQuestion({tags:'court-geometry, anticipation',pillar:'Game IQ'}),'decisions');
  assert.equal(integration.areaFromQuestion({pillar:'Technique',module:'General'}),null);
});

test('one timeline controls every visual shot and every natural contact',()=>{
  const c=integration.contract('seq_001');
  const timeline=integration.timelineFor(c);
  assert.deepEqual(engine.validateTimeline(timeline,c.play),[]);
  assert.equal(timeline.shots.length,c.play.shots.length);
  assert.equal(timeline.events.filter(e=>e.kind==='contact').length,c.play.shots.length);
  timeline.shots.forEach((shot,index)=>{
    const contact=timeline.events.filter(e=>e.kind==='contact'&&e.shotIndex===index);
    assert.equal(contact.length,1);
    assert.equal(contact[0].at,shot.contactAt);
    assert.ok(engine.AUDIO_LIBRARY[contact[0].audio]?.length);
  });
});

test('serve bounces, return contacts and volley interceptions are physically distinct',()=>{
  for(const contract of Object.values(integration.CONTRACTS)){
    const timeline=integration.timelineFor(contract);
    timeline.shots.forEach((compiled,index)=>{
      const shot=compiled.shot,next=timeline.shots[index+1];
      if(compiled.contactType==='serve'){
        assert.ok(Array.isArray(shot.bounce),contract.sequenceId+' serve needs an explicit service-box bounce');
        assert.ok(compiled.bounceAt>compiled.contactAt&&compiled.bounceAt<compiled.arrivalAt,contract.sequenceId+' serve bounce must occur before the return contact');
        assert.ok(shot.from[1]>220?shot.to[1]<80:shot.to[1]>220,contract.sequenceId+' serve must continue from the bounce to a credible return contact');
      }
      if(next&&['volley','smash'].includes(next.contactType)&&shot.forceBounce!==true){
        assert.equal(compiled.terminal,'air',contract.sequenceId+' ball intercepted in the air must not produce a court bounce');
        assert.equal(timeline.events.filter(event=>event.kind==='court'&&event.shotIndex===index).length,0);
      }
      if(shot.forceBounce===true){
        assert.equal(compiled.terminal,'bounce',contract.sequenceId+' authored bounce-smash must preserve its bounce');
        assert.equal(timeline.events.filter(event=>event.kind==='court'&&event.shotIndex===index).length,1);
      }
    });
  }
});

test('the doubles poach visibly crosses the lane instead of relabelling a static partner',()=>{
  const play=integration.contract('seq_007').play;
  const poach=play.shots.find(shot=>shot.actor==='partner');
  assert.ok(play.youStart[0]>100&&play.oppStart[0]<100,'deuce-side server and receiver orientation drifted');
  assert.ok(play.partnerStart[0]<100&&play.netOppStart[0]>100,'net-player starting sides drifted');
  assert.ok(poach.from[0]-play.partnerStart[0]>=40,'partner does not make a visible lateral poach');
  assert.ok(poach.from[1]>150&&poach.from[1]<205,'poach contact is not on the server’s net side');
});

test('the reveal, sound, progress and Sharpen route cannot drift apart',()=>{
  const c=integration.contract('seq_001');
  const html=integration.resultMarkup('seq_001');
  assert.match(html,/Watch the whole point/);
  assert.match(html,new RegExp(c.insight.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(html,/GSPredictLive\.play\('seq_001'\)/);
  assert.match(html,/GSPredictLive\.openSharpen\('seq_001'\)/);
  assert.doesNotMatch(html,/mastery\s*\d|\d+%\s*master/i);
});

test('host page loads the engine before integration and records once per result',()=>{
  const engineAt=index.search(/<script src="livepoint-engine\.js\?v=[^"?]+"><\/script>/);
  const integrationAt=index.search(/<script src="predict-live-integration\.js\?v=[^"?]+"><\/script>/);
  const mainAt=index.indexOf('<script>\n\n// ── COURTIQ');
  assert.ok(engineAt>0&&integrationAt>engineAt&&mainAt>integrationAt);
  const painJsVersion=index.match(/gamesharp-pain-coach\.js\?v=([\w-]+)/)?.[1];
  const painCssVersion=index.match(/gamesharp-pain-coach\.css\?v=([\w-]+)/)?.[1];
  assert.ok(painJsVersion,'Sharpen script must carry an explicit cache version');
  assert.equal(painCssVersion,painJsVersion,'Sharpen CSS and JS must ship as one synchronized release');
  assert.match(index,/if \(!seqState\._evidenceRecorded && window\.GSPredictLive\)/);
  assert.match(index,/GSPredictLive\.profileMarkup\(\)/);
  assert.match(index,/GSPredictLive\.recordQuestion\(q, ok, state\.isDailyMode \? 'daily' : 'module'\)/);
  assert.match(index,/\.gs-hero-wordmark\{[^}]*pointer-events:none;/,'decorative wordmark must never intercept header controls');
  assert.match(index,/\.gs-home-profile\{[^}]*z-index:24;/,'visible profile control must sit above decorative header layers');
});

test('the learning loop contains no synthesized success or failure tones',()=>{
  assert.doesNotMatch(index,/createOscillator\s*\(/);
  assert.doesNotMatch(index,/GSA\.tone\s*\(|GSA\.noise\s*\(/);
  assert.match(index,/Recorded tennis only/);
  for(const paths of Object.values(engine.AUDIO_LIBRARY))for(const path of paths)assert.ok(fs.existsSync(new URL('./'+path,import.meta.url)),path+' is missing');
});

test('contextual Sharpen routing is explicit and return-safe',()=>{
  assert.match(coach,/function openRegion\(id,source\)/);
  assert.match(coach,/window\.GameSharpPainCoach=\{open,openRegion,close/);
  assert.match(coach,/state\.stage='region'/);
});
