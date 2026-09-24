import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const paths=require('./gamesharp-sharpen-paths.js');
const lessons=require('./gold-daily-prototypes.js').challenges;
const spines=require('./gold-daily-lesson-spines.js');
const clone=value=>JSON.parse(JSON.stringify(value));

test('Sharpen has seven areas and nineteen concise, supported concern invitations',()=>{
 const before=JSON.stringify({lessons,spines:spines.spines});
 assert.deepEqual(paths.regions.map(r=>r.id),['mindset','forehand','backhand','serve_return','net','movement','decisions']);
 assert.equal(paths.paths.length,19);
 assert.equal(paths.regions.find(r=>r.id==='mindset').pathIds.length,2);
 assert.equal(paths.regions.find(r=>r.id==='backhand').pathIds.length,2);
 assert.equal(paths.audit(lessons,spines).ok,true);
 assert.equal(paths.audit({challenges:lessons},spines.spines).ok,true);
 assert.equal(JSON.stringify({lessons,spines:spines.spines}),before,'Routing must not alter existing lessons or spines');
 for(const p of paths.paths){assert.equal(p.previewStep,0);assert.equal(paths.byId[p.id],p);assert.ok(p.label.split(/\s+/).length<=8);assert.ok(p.invitation.split(/\s+/).length<=18);}
});

test('concerns preserve exact observable lesson identities without diagnosing another stroke',()=>{
 const expected={mindset_after_miss:'gold_miss_two_points_v1',mindset_protecting_lead:'gold_protect_pattern_v1',forehand_crowded_contact:'gold_contact_point_v1',forehand_high_bounce:'gold_high_ball_v1',forehand_runaround_exposure:'gold_forehand_bill_v1',backhand_stretched_line:'gold_direction_change_v1',backhand_runaround_choice:'gold_runaround_pattern_v1',serve_return_crowded:'gold_return_position_v1',serve_return_second_serve:'gold_serve_quality_v1',serve_return_first_ball:'gold_serve_plus_one_v1',net_short_ball_choice:'gold_short_ball_attack_v1',net_first_volley:'gold_approach_volley_v1',net_moving_at_pass:'gold_close_then_balance_v1',movement_recovery_default:'gold_recovery_position_v1',movement_split_timing:'gold_split_step_timing_v1',movement_runaround_recovery:'gold_forehand_bill_v1',decisions_short_ball:'gold_short_ball_attack_v1',decisions_open_court:'gold_future_space_v1',decisions_surprise_reply:'gold_pattern_clue_v1'};
 assert.deepEqual(Object.fromEntries(paths.paths.map(p=>[p.id,p.lessonId])),expected);
 assert.deepEqual(paths.paths.filter(p=>p.lessonId==='gold_contact_point_v1').map(p=>p.region),['forehand']);
 assert.match(paths.byId.backhand_runaround_choice.invitation,/slower backhand-side reply.*slice.*stronger forehand/);
 assert.match(paths.byId.serve_return_second_serve.invitation,/two legal second serves.*receiver/);
 assert.match(paths.byId.decisions_surprise_reply.invitation,/contact conditions.*lob/);
 for(const p of paths.paths){assert.deepEqual(Object.keys(p).filter(k=>['title','cue','takeItToCourt','visual','geometry','question','answers','module','sequenceId','fault','diagnosis','url'].includes(k)),[]);}
});

test('missing lessons, research spines and drifted court cues fail closed without substitution',()=>{
 assert.equal(paths.audit([],spines).ok,false);
 assert.equal(paths.audit(lessons,[]).ok,false);
 const missing=paths.audit(lessons.filter(l=>l.id!=='gold_contact_point_v1'),spines);
 assert.ok(missing.errors.some(e=>e.includes('forehand_crowded_contact: exact approved lesson unavailable')));
 const research=clone(spines.spines);research.find(s=>s.prototypeId==='gold_contact_point_v1').status='spine';
 assert.ok(paths.audit(lessons,research).errors.some(e=>e.includes('forehand_crowded_contact: missing exact built-spine binding')));
 const changed=clone(lessons);changed.find(l=>l.id==='gold_contact_point_v1').takeItToCourt='A different prescription';
 assert.ok(paths.audit(changed,spines).errors.some(e=>e.includes('court cue has drifted')));
 const source=clone(spines.spines);source.find(s=>s.prototypeId==='gold_contact_point_v1').proInsight.status='research_required';
 assert.ok(paths.audit(lessons,source).errors.some(e=>e.includes('source remains unapproved')));
});

test('missing canonical evidence and duplicate identities are rejected',()=>{
 const changed=clone(lessons);delete changed.find(l=>l.id==='gold_serve_quality_v1').steps[0].visual;
 assert.ok(paths.audit(changed,spines).errors.some(e=>e.includes('canonical three-decision evidence unavailable')));
 assert.ok(paths.audit([...lessons,lessons[0]],spines).errors.some(e=>e.includes('duplicate ID')));
 assert.ok(paths.audit(lessons,[...spines.spines,spines.spines[0]]).errors.some(e=>e.includes('duplicate ID')));
});

test('browser and CommonJS exports are immutable and do not start or save a journey',()=>{
 const context={};vm.createContext(context);
 vm.runInContext(fs.readFileSync(new URL('./gamesharp-sharpen-paths.js',import.meta.url),'utf8'),context);
 const browser=context.GameSharpSharpenPaths;
 assert.equal(browser.paths.length,19);
 assert.deepEqual(JSON.parse(JSON.stringify(browser.paths)),JSON.parse(JSON.stringify(paths.paths)));
 assert.equal(Object.getPrototypeOf(paths.byId),null);
 assert.equal(paths.byId.constructor,undefined);
 assert.ok(Object.isFrozen(paths));assert.ok(Object.isFrozen(paths.paths));assert.ok(Object.isFrozen(paths.regions[0].pathIds));
 assert.throws(()=>{paths.paths[0].lessonId='gold_contact_point_v1';},TypeError);
 assert.deepEqual(Object.keys(context),['GameSharpSharpenPaths']);
});

test('every surfaced concern has an exact mobile and desktop release approval',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('./LAUNCH_MANIFEST.json',import.meta.url),'utf8'));
 const review=manifest.sharpen;
 assert.equal(review.pathRegistry,paths.version);
 assert.equal(review.areas,paths.regions.length);
 assert.equal(review.concernCount,paths.paths.length);
 assert.equal(review.uniqueLessonDestinations,new Set(paths.paths.map(p=>p.lessonId)).size);
 assert.deepEqual(review.routes.map(r=>r.id),paths.paths.map(p=>p.id));
 for(const route of review.routes){
  const p=paths.byId[route.id],lesson=lessons.find(l=>l.id===p.lessonId);
  assert.equal(route.lessonId,p.lessonId);assert.equal(route.region,p.region);
  assert.equal(route.renderer,lesson.steps[0].visual.kind);
  assert.equal(route.mobileReview,'approved');assert.equal(route.desktopReview,'approved');
  assert.ok(route.version&&route.approvalDate&&route.reviewerNote);
 }
 assert.equal(manifest.daily.renderer,'gold-daily-prototypes.js@'+require('./gold-daily-prototypes.js').version);
});
