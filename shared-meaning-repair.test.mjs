import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url), integration=require('./predict-live-integration.js'), policy=require('./gamesharp-release-policy.js');
const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8'), clone=x=>JSON.parse(JSON.stringify(x));

test('all eight Playbook and share presentations reuse one accurate record without changing progress IDs',()=>{
  const shares=require('./share-data.json');
  for(const id of policy.playbookIds){
    const p=integration.playbookPresentation(id);assert.ok(p?.title&&p?.tagline,id);
    assert.equal(shares.play[id].t,p.title);assert.equal(shares.play[id].g,p.tagline);
  }
  assert.equal(integration.playbookPresentation('__proto__'),null);
  assert.equal(integration.playbookPresentation('drop_lob').title,'Bring Them Forward, Read the Reply');
  assert.match(html,/const presentation=window\.GSPredictLive[^\n]*playbookPresentation\(id\)/);
  const share=html.slice(html.indexOf('function buildPlayShareCanvas('),html.indexOf('\nfunction ',html.indexOf('function buildPlayShareCanvas(')+1));
  assert.match(share,/textOnly:\s*true/);assert.match(share,/summary:\s*p.tagline/);
  const clip=html.slice(html.indexOf('function playbookShareClip('),html.indexOf('\nfunction ',html.indexOf('function playbookShareClip(')+1));
  assert.match(clip,/return playbookShare\(id\)/);assert.doesNotMatch(clip,/recordPlayClip/);
});

test('decisive opponent movements drive actual rendered marker tracks and cannot be omitted or moved to YOU',()=>{
  const source=fs.readFileSync(new URL('./predict-live-integration.js',import.meta.url),'utf8');
  const ctx={module:{exports:{}},require};
  vm.runInNewContext(source.replace('return Object.freeze({CONTRACTS,','return Object.freeze({courtSvg,CONTRACTS,'),ctx);
  for(const id of ['seq_010','seq_020']){
    const c=integration.contract(id),t=integration.timelineFor(c),cue=c.play.motionCues[0];
    assert.deepEqual(integration.validateContract(c),[]);
    const track=integration.actorTrack(c,t,'opp',c.play.oppStart);
    assert.ok(track.some(p=>p.at===t.shots[cue.atShot].contactAt&&JSON.stringify(p.p)===JSON.stringify(cue.position)));
    const svg=ctx.module.exports.courtSvg(c,t,false);assert.ok(svg.includes(cue.position.join(' ')));
    for(const mutate of [x=>{delete x.play.motionCues;},x=>{x.play.motionCues[0].actor='you';},x=>{x.play.motionCues[0].atShot=0;},x=>{x.play.motionCues[0].position=[160,50];}]){
      const bad=clone(c);mutate(bad);assert.ok(integration.validateContract(bad).length,id);
    }
  }
});

test('the neutral direction-change contact is at the baseline before the shorter ball',()=>{
  const c=integration.contract('seq_015'),p=c.play;
  assert.ok(p.youStart[1]>=290);assert.deepEqual(p.shots[0].to,p.shots[1].from);
  assert.deepEqual(p.shots[1].from,p.youStart);assert.ok(p.shots[2].to[1]<290);
});

test('the court-check event evidence states its real capabilities, not contact quality',()=>{
  const daily=require('./gold-daily-prototypes.js');
  for(const s of daily.challenges.find(c=>c.slug==='return-position').steps){
    const e=daily.returnEvidence(s);assert.deepEqual(e.capabilities,['court-position','arrival-time']);
    assert.ok(e.contactAt>0&&e.referenceAt>0);assert.ok(Math.abs(e.speed-e.referenceSpeed)<.001);
  }
});

test('the two-breaks pace contrast uses explicit flight time, not a sound label',()=>{
  const c=require('./livepoint-content.js').scenarios.find(s=>s.id==='two_breaks_up'),e=require('./livepoint-engine.js');
  const a=e.compileTimeline(c.A.seq).shots[0],b=e.compileTimeline(c.B.seq).shots[0];
  assert.ok(b.flightDuration>a.flightDuration);
  const speed=x=>Math.hypot(x.shot.to[0]-x.shot.from[0],x.shot.to[1]-x.shot.from[1])/x.flightDuration;
  assert.ok(speed(a)>speed(b)*1.3);
  const bad=clone(c.B.seq);bad.shots[0].flightSeconds=-1;
  assert.ok(e.validateTimeline(e.compileTimeline(bad),bad).some(x=>/flight duration/.test(x)));
});

test('Live Point does not invent numerical odds or give away alternatives through ridicule',()=>{
  const scenes=require('./livepoint-content.js').scenarios;
  assert.doesNotMatch(JSON.stringify(scenes),/coin.flip|safe kill|no risk|jam already won/i);
  for(const s of scenes)for(const key of ['A','B'])for(const choice of s[key].d2.opts)
    assert.doesNotMatch(choice.lbl+' '+choice.sub,/panic|wildly|cute|spectacular|go for broke/i);
  assert.match(html,/CORRECTION · BEST-OPTION EXAMPLE/);
});

test('drop-shot opening copy describes the current low contact rather than the earlier baseline position',()=>{
  const s=require('./livepoint-content.js').scenarios.find(s=>s.id==='defend_drop');
  assert.match(s.opp,/have sprinted forward and reached the ball low/);
  assert.doesNotMatch(s.opp,/You're deep behind/);
  assert.ok(s.A.seq.youStart[1]<220&&s.B.seq.youStart[1]<220);
});
