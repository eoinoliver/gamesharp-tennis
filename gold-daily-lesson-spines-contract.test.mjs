import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const lessonBank = require(path.join(here, 'gold-daily-lesson-spines.js'));
const prototypes = require(path.join(here, 'gold-daily-prototypes.js'));
const indexText = fs.readFileSync(path.join(here, 'index.html'), 'utf8');
const manifestText = fs.readFileSync(path.join(here, 'LAUNCH_MANIFEST.json'), 'utf8');
const reviewText = fs.readFileSync(path.join(here, 'GOLD_DAILY_LESSON_SPINE_REVIEW.md'), 'utf8');

const expectedThemes = new Map([
  ['mental_game', 'mindset'],
  ['forehand', 'forehand'],
  ['backhand', 'backhand'],
  ['serve', 'serve_return'],
  ['return', 'serve_return'],
  ['net_play', 'net'],
  ['movement_footwork', 'movement'],
  ['decision_making', 'decisions']
]);
const expectedPrototypeBindings = new Map([
  ['gold_return_time_v1','return_second_serve_steal_time'],['gold_serve_quality_v1','serve_safe_second_serve_risk'],['gold_pattern_clue_v1','decision_one_point_is_noise'],
  ['gold_protect_pattern_v1','mental_lead_shrinks_game'],['gold_forehand_bill_v1','forehand_inside_out_recovery_bill'],['gold_close_then_balance_v1','net_close_without_opening_pass'],
  ['gold_approach_volley_v1', 'net_volley_started_at_baseline'], ['gold_serve_adaptation_v1', 'serve_body_target_adapts'],
  ['gold_recovery_position_v1', 'movement_recovery_probability'],
  ['gold_short_ball_attack_v1', 'net_short_ball_permission'],
  ['gold_contact_point_v1', 'forehand_contact_upstream'],
  ['gold_direction_change_v1', 'backhand_line_must_be_earned'],
  ['gold_serve_plus_one_v1', 'serve_plus_one_is_unit'],
  ['gold_miss_two_points_v1', 'mental_miss_steals_next_point'],
  ['gold_return_position_v1', 'return_position_is_dial'],
  ['gold_split_step_timing_v1', 'movement_split_step_timing'],
  ['gold_winner_wrong_shot_v1', 'decision_winner_can_be_wrong'],
  ['gold_runaround_pattern_v1', 'backhand_runaround_is_pattern'], ['gold_middle_return_v1', 'return_middle_removes_plus_one'], ['gold_future_space_v1', 'decision_open_court_not_open'], ['gold_high_ball_v1','forehand_high_ball_opposites']
]);

function wordCount(value) {
  return String(value || '').replace(/[·—–]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
}

const report = lessonBank.audit();
assert.equal(report.ok, true, report.errors.join('\n'));
assert.equal(report.counts.themes, 8);
assert.equal(report.counts.spines, 24);
assert.equal(report.counts.prototypes, 21);
assert.equal(report.counts.sourceLocked, 21);
assert.equal(report.counts.researchRequired, 3);
assert.equal(Object.isFrozen(lessonBank.themes), true, 'Editorial themes must be immutable.');
assert.equal(Object.isFrozen(lessonBank.spines), true, 'Lesson spines must be immutable.');

assert.deepEqual(new Map(lessonBank.themes.map((theme) => [theme.id, theme.sharpenTarget])), expectedThemes);
for (const [themeId, sharpenTarget] of expectedThemes) {
  const themedSpines = lessonBank.spines.filter((spine) => spine.theme === themeId);
  assert.equal(themedSpines.length, 3, `${themeId} must contain exactly three lesson spines.`);
  assert.ok(themedSpines.every((spine) => spine.sharpenTarget === sharpenTarget), `${themeId} drifted from its existing Sharpen destination.`);
}

const seenTitles = new Set();
const seenPlaybookTargets = new Set();
for (const spine of lessonBank.spines) {
  assert.ok(spine.painHook, `${spine.id} has no player pain.`);
  assert.ok(spine.beforeBelief && spine.afterSight && spine.tomorrowAction, `${spine.id} fails the Aha Gate.`);
  assert.notEqual(spine.beforeBelief, spine.afterSight, `${spine.id} does not reverse or deepen a belief.`);
  assert.match(spine.tomorrowAction, /^Next time/i, `${spine.id} has no tomorrow transfer.`);
  assert.ok(spine.coreTruth && spine.boundary, `${spine.id} lacks tennis principle or contextual boundary.`);
  assert.equal(spine.decisionCues.length, 3, `${spine.id} needs three observable decision cues.`);
  assert.equal(new Set(spine.decisionCues).size, 3, `${spine.id} repeats a decision cue.`);
  assert.equal(spine.visualContract.mustShow.length, 3, `${spine.id} needs three visual proof obligations.`);
  assert.ok(wordCount(spine.title) <= 8, `${spine.id} title is too long for mobile.`);
  assert.ok(wordCount(spine.painHook) <= 18, `${spine.id} pain hook is too long for mobile.`);
  assert.equal(seenTitles.has(spine.title), false, `${spine.id} duplicates another lesson title.`);
  seenTitles.add(spine.title);
  assert.ok(reviewText.includes(spine.title), `${spine.id} is missing from the human review sheet.`);
  assert.equal(seenPlaybookTargets.has(spine.playbookTarget), false, `${spine.id} reuses another Playbook destination.`);
  seenPlaybookTargets.add(spine.playbookTarget);

  if (spine.status === 'prototype') {
    assert.equal(spine.proInsight.status, 'source_locked');
    assert.equal(spine.proInsight.claimType, 'sourced_paraphrase');
    assert.equal(spine.proInsight.endorsement, false);
    assert.equal(spine.prototypeDecisionLenses.length, 3, `${spine.id} needs three canonical decision lenses.`);
    assert.doesNotMatch(spine.proInsight.documentedMoment, /[“”"]/, `${spine.id} contains an unverified quotation.`);
    assert.match(spine.proInsight.source.url, /^https:\/\//);
    assert.ok(reviewText.includes(spine.proInsight.documentedMoment), `${spine.id} payoff copy drifted from the review sheet.`);
    const {goldDailyPilot, ...mainManifest} = JSON.parse(manifestText);
    assert.equal(goldDailyPilot.mainDailyPromotions, 21);
    assert.ok(mainManifest.daily.lessonIds.includes(spine.prototypeId) || mainManifest.localReviewOnly.some(c=>c.id===spine.prototypeId), `${spine.prototypeId} requires explicit approval or local-only status.`);
  } else {
    assert.equal(spine.proInsight.status, 'research_required');
    assert.ok(spine.proInsight.playerCandidate.split(/\s+/).length >= 2, `${spine.id} needs a specific named-player research target.`);
    assert.ok(spine.proInsight.evidenceQuestion, `${spine.id} needs a source-research question.`);
    assert.equal('documentedMoment' in spine.proInsight, false, `${spine.id} exposes an unverified player story.`);
    assert.equal('source' in spine.proInsight, false, `${spine.id} invents source completeness.`);
  }
}

for (const challenge of prototypes.challenges) {
  const expectedSpineId = expectedPrototypeBindings.get(challenge.id);
  assert.equal(challenge.lessonSpineId, expectedSpineId, `${challenge.id} uses the wrong lesson spine.`);
  const spine = lessonBank.byId[expectedSpineId];
  assert.ok(spine, `${challenge.id} lesson spine is missing.`);
  assert.equal(challenge.title, spine.title, `${challenge.id} title drifted.`);
  assert.equal(challenge.memory, spine.memory, `${challenge.id} memory line drifted.`);
  assert.equal(challenge.insight, spine.painHook, `${challenge.id} pain hook drifted.`);
  assert.equal(challenge.takeItToCourt, spine.tomorrowAction, `${challenge.id} court transfer drifted.`);
  assert.equal(challenge.proInsight, spine.proInsight, `${challenge.id} Pro Insight is no longer canonical.`);
  assert.ok(challenge.steps.every((step) => step.visual.kind === spine.visualContract.kind), `${challenge.id} visual family contradicts its lesson spine.`);
  assert.deepEqual(challenge.steps.map((step) => step.decisionLens), spine.prototypeDecisionLenses, `${challenge.id} decision order drifted.`);
}

const loaderStart = indexText.indexOf('<script id="gs-gold-daily-preview-loader">');
const loaderEnd = indexText.indexOf('</script>', loaderStart);
const loader = indexText.slice(loaderStart, loaderEnd);
assert.ok(loader.includes('window.GS_GOLD_DAILY_MAIN = true;'), 'Approved lesson assets must be available to the main Daily.');
assert.ok(loader.includes('gold-daily-lesson-spines.js'), 'Canonical lesson spine must load in the browser preview.');
assert.ok(loader.indexOf('gold-daily-lesson-spines.js') < loader.indexOf('gold-daily-prototypes.js'), 'Lesson spine must be requested before its renderer.');
assert.ok(loader.includes('spineScript.onload'), 'Prototype renderer must wait for the canonical spine.');
assert.ok(loader.includes("goldDailyIntegrity = 'withheld-missing-spines'"), 'Missing spine data must fail closed.');

console.log('PASS gold-daily lesson-spine contract');
console.log('8 editorial themes · 24 spines · 21 authored lessons · 3 research briefs');
