import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const prototype = require(path.join(here, 'gold-daily-prototypes.js'));
const indexText = fs.readFileSync(path.join(here, 'index.html'), 'utf8');
const jsText = fs.readFileSync(path.join(here, 'gold-daily-prototypes.js'), 'utf8');
const cssText = fs.readFileSync(path.join(here, 'gold-daily-prototypes.css'), 'utf8');
const manifestText = fs.readFileSync(path.join(here, 'LAUNCH_MANIFEST.json'), 'utf8');

const expectedIds = [
  'gold_recovery_position_v1',
  'gold_short_ball_attack_v1',
  'gold_contact_point_v1',
  'gold_direction_change_v1',
  'gold_serve_plus_one_v1',
  'gold_miss_two_points_v1',
  'gold_return_position_v1',
  'gold_split_step_timing_v1',
  'gold_winner_wrong_shot_v1', 'gold_runaround_pattern_v1', 'gold_middle_return_v1', 'gold_future_space_v1', 'gold_high_ball_v1', 'gold_approach_volley_v1', 'gold_serve_adaptation_v1', 'gold_protect_pattern_v1', 'gold_forehand_bill_v1', 'gold_close_then_balance_v1', 'gold_return_time_v1', 'gold_serve_quality_v1', 'gold_pattern_clue_v1'
];
const expectedPros = new Map([
  ['gold_return_time_v1','Andre Agassi'],['gold_serve_quality_v1','Jannik Sinner'],['gold_pattern_clue_v1','Roger Federer'],
  ['gold_protect_pattern_v1','Roger Federer'],['gold_forehand_bill_v1','Jim Courier'],['gold_close_then_balance_v1','Martina Navratilova'],
  ['gold_approach_volley_v1', 'Roger Federer'], ['gold_serve_adaptation_v1', 'Andy Murray'],
  ['gold_high_ball_v1', 'Iga Swiatek'],
  ['gold_recovery_position_v1', 'Novak Djokovic'],
  ['gold_short_ball_attack_v1', 'Rafael Nadal'],
  ['gold_contact_point_v1', 'Andre Agassi'],
  ['gold_direction_change_v1', 'Roger Federer'],
  ['gold_serve_plus_one_v1', 'Pete Sampras'],
  ['gold_miss_two_points_v1', 'Andy Murray'],
  ['gold_return_position_v1', 'Daniil Medvedev'],
  ['gold_split_step_timing_v1', 'Bianca Andreescu'],
  ['gold_winner_wrong_shot_v1', 'Carlos Alcaraz'],
  ['gold_runaround_pattern_v1', 'Ashleigh Barty'], ['gold_middle_return_v1', 'Alex de Minaur'], ['gold_future_space_v1', 'Jelena Jankovic']
]);
const report = prototype.audit();

assert.equal(report.ok, true, report.errors.join('\n'));
assert.deepEqual(prototype.challenges.map((challenge) => challenge.id), expectedIds);
assert.equal(report.counts.challenges, 21);
assert.equal(report.counts.interactions, 63);
assert.equal(Object.isFrozen(prototype.challenges), true, 'Prototype bank must be immutable at runtime.');

function tokenSet(value) {
  return new Set(String(value).toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter((word) => word.length > 3));
}

function jaccard(a, b) {
  const left = tokenSet(a);
  const right = tokenSet(b);
  const intersection = [...left].filter((word) => right.has(word)).length;
  const union = new Set([...left, ...right]).size;
  return union ? intersection / union : 1;
}

function wordCount(value) {
  return String(value || '').replace(/[·—–]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
}

const answerKeys = new Set();
for (const challenge of prototype.challenges) {
  assert.equal(challenge.steps.length, 3, `${challenge.id} must have three connected interactions.`);
  assert.ok(challenge.memory && wordCount(challenge.memory) <= 6, `${challenge.id} needs a short, memorable final payoff.`);
  assert.equal(challenge.steps[2].transfer, true, `${challenge.id} must end in transfer.`);
  assert.ok(jaccard(challenge.steps[0].situation, challenge.steps[2].situation) < 0.58, `${challenge.id} transfer scenario is too similar to interaction one.`);
  assert.ok(jaccard(challenge.steps[0].question, challenge.steps[2].question) < 0.58, `${challenge.id} transfer question is a disguised repeat.`);
  assert.match(challenge.takeItToCourt, /^Next time/i);
  assert.equal(challenge.proInsight.player, expectedPros.get(challenge.id), `${challenge.id} has the wrong professional story.`);
  assert.equal(challenge.proInsight.claimType, 'sourced_paraphrase');
  assert.equal(challenge.proInsight.endorsement, false);
  assert.ok(wordCount(challenge.proInsight.documentedMoment) >= 16 && wordCount(challenge.proInsight.documentedMoment) <= 30, `${challenge.id} Pro story is not mobile concise.`);
  assert.ok(wordCount(challenge.proInsight.gameSharpRead) <= 12, `${challenge.id} GameSharp interpretation is too long.`);
  assert.doesNotMatch(challenge.proInsight.documentedMoment, /[“”"]/, `${challenge.id} contains an unverified direct quotation.`);
  assert.match(challenge.proInsight.source.url, /^https:\/\//);
  assert.ok(challenge.proInsight.source.publisher && challenge.proInsight.source.title && challenge.proInsight.source.published, `${challenge.id} source provenance is incomplete.`);
  const resultWords = wordCount(challenge.memory) + wordCount(challenge.proInsight.documentedMoment) + wordCount(challenge.proInsight.gameSharpRead) + wordCount(challenge.takeItToCourt);
  assert.ok(resultWords <= 60, `${challenge.id} final payoff has become a reading wall.`);
  for (const [stepIndex, step] of challenge.steps.entries()) {
    assert.equal(step.options.length, 4, `${challenge.id} interaction ${stepIndex + 1} must have four choices.`);
    const optionLengths = step.options.map((option) => wordCount(option.text));
    assert.ok(optionLengths.every((length) => length >= 4 && length <= 10), `${challenge.id} interaction ${stepIndex + 1} has a giveaway-short or unwieldy choice.`);
    assert.ok(Math.max(...optionLengths) - Math.min(...optionLengths) <= 4, `${challenge.id} interaction ${stepIndex + 1} has an answer-length tell.`);
    assert.doesNotMatch(step.options.map((option) => option.text).join(' '), /\b(?:always|never|definitely|regardless|anyway|simply)\b|much more|stop your feet/i, `${challenge.id} interaction ${stepIndex + 1} contains a telegraphed distractor.`);
    assert.ok(step.decisionLens, `${challenge.id} interaction ${stepIndex + 1} lacks a decision lens.`);
    assert.ok(step.unlock && wordCount(step.unlock) <= 6, `${challenge.id} interaction ${stepIndex + 1} needs a concise insight unlock.`);
    assert.ok(wordCount(step.situation) <= 14, `${challenge.id} interaction ${stepIndex + 1} context is too long.`);
    assert.ok(wordCount(step.question) <= 8, `${challenge.id} interaction ${stepIndex + 1} question is too long.`);
    assert.ok(wordCount(step.payoff) <= 16, `${challenge.id} interaction ${stepIndex + 1} visible payoff is too long.`);
    assert.ok(step.principle && wordCount(step.principle) <= 18, `${challenge.id} interaction ${stepIndex + 1} lost the causal learning muscle.`);
    assert.ok(wordCount(step.why) <= 34, `${challenge.id} interaction ${stepIndex + 1} optional Why is too long.`);
    const visibleWords = wordCount(step.situation) + wordCount(step.question) + optionLengths.reduce((sum, length) => sum + length, 0) + wordCount(step.payoff) + wordCount(step.principle);
    assert.ok(visibleWords <= 78, `${challenge.id} interaction ${stepIndex + 1} exceeds the muscle-without-bloat reading budget.`);
    assert.ok(step.visual?.description, `${challenge.id} interaction ${stepIndex + 1} lacks an authored visual description.`);
    assert.equal(step.visual?.cues?.length, 3, `${challenge.id} interaction ${stepIndex + 1} needs three visual cues.`);
    if (['direction_change', 'serve_plus_one', 'return_position', 'split_step_timeline', 'outcome_vs_decision', 'two_point_sequence'].includes(step.visual.kind)) {
      assert.ok(step.visual.cues.every((cue, cueIndex) => cue.startsWith(`${cueIndex + 1} `)), `${challenge.id} interaction ${stepIndex + 1} must reveal evidence in an explicit order.`);
      assert.doesNotMatch(step.visual.cues.join('|'), /contact height|your balance|court exposed|serve target|returner$|reply$/i, `${challenge.id} interaction ${stepIndex + 1} must show actual states rather than category labels.`);
      if (step.visual.answerCues) assert.equal(step.visual.answerCues.length, 3, 'Answered evidence must preserve the three-beat rail.');
    }
    answerKeys.add(step.correct);
    if (step.visual.kind === 'recovery') {
      assert.equal(step.visual.targets.length, 4, 'Every recovery choice needs an exact visual target.');
      step.options.forEach((option, optionIndex) => {
        const target = step.visual.targets[optionIndex];
        if (/behind the baseline|give ground/i.test(option.text)) assert.ok(target[1] > 156, `${challenge.id} interaction ${stepIndex + 1} says behind the baseline but renders inside it.`);
      });
    }
    if (step.visual.kind === 'shortBall') {
      assert.equal(step.visual.paths.length, 4, 'Every short-ball choice needs an exact visual path.');
      assert.ok(step.visual.ballLabel && step.visual.playerState && step.visual.opponentState, `${challenge.id} interaction ${stepIndex + 1} must visibly encode height and balance.`);
      step.options.forEach((option, optionIndex) => {
        const path = step.visual.paths[optionIndex];
        const start = path[0];
        const landing = path[path.length - 1];
        assert.ok(landing[0] >= 40 && landing[0] <= 210 && landing[1] >= 14 && landing[1] < 85, `${challenge.id} interaction ${stepIndex + 1} choice ${option.id} lands outside the far singles court.`);
        if (/through (the )?middle/i.test(option.text)) assert.ok(Math.abs(landing[0] - 125) <= 15, `${challenge.id} interaction ${stepIndex + 1} says middle but the path finishes elsewhere.`);
        if (/down the line/i.test(option.text) && start[0] < 70) assert.ok(landing[0] >= 40 && landing[0] <= 60, `${challenge.id} interaction ${stepIndex + 1} says down the line but the path leaves the singles lane.`);
      });
    }
    if (step.visual.kind === 'contact') {
      assert.ok(step.visual.focusCue, 'Contact motion must tell the player where to look.');
      assert.ok(step.visual.previewDescription && !/late|behind|correct|fix/i.test(step.visual.previewDescription), 'The accessible preview must orient without revealing the diagnosis.');
      assert.ok(step.evidence?.observed && step.evidence?.inference && step.evidence?.courtCheck, 'Contact teaching must distinguish observation, inference and the next court check.');
      assert.doesNotMatch(step.evidence.observed, /cause|culprit|because|proves?|definitely|late timing/i, 'Observed evidence must never make a causal claim the motion cannot prove.');
      assert.match(step.evidence.inference, /may|might|can|worth|hypothesis/i, 'The inference must preserve uncertainty.');
      assert.match(step.evidence.courtCheck, /watch|observe|check|notice|compare/i, 'The evidence must end in a concrete court observation.');
      assert.equal(step.visual.motion.stroke, 'forehand');
      assert.equal(step.visual.motion.fault, 'jammed', 'Every contact step must preserve the same observable crowded-spacing clue.');
      assert.ok(['wide', 'short'].includes(step.visual.motion.outcome), 'Contact motion must render the authored ball outcome.');
      assert.equal(step.visual.motion.reveal, 'fix-then-compare');
      assert.equal(step.visual.motion.contactFrame, 0.61);
      assert.ok(['miss', 'fix'].includes(step.visual.motion.previewMode), 'Every contact step must explicitly author the frame shown before the answer.');
      assert.equal(typeof step.visual.motion.showOutcome, 'boolean', 'Every contact step must explicitly author whether the outcome is visible.');
      assert.equal('observed' in step.visual || 'reference' in step.visual || 'body' in step.visual, false, 'Static contact diagrams must remain structurally forbidden.');
    }
    if (step.visual.kind === 'direction_change') {
      assert.equal(step.visual.paths.length, 4, 'Every direction-change choice needs an exact reply path.');
      assert.ok(step.visual.ballLabel && step.visual.playerState && step.visual.exposureLabel, 'Direction-change evidence must show contact, balance and recovery exposure.');
      for (const [optionIndex, option] of step.options.entries()) {
        const path = step.visual.paths[optionIndex];
        const start = path[0];
        const landing = path[path.length - 1];
        assert.deepEqual(start, step.visual.ball, `${challenge.id} interaction ${stepIndex + 1} choice ${option.id} is detached from contact.`);
        assert.ok(landing[0] >= 40 && landing[0] <= 210 && landing[1] >= 14 && landing[1] < 85, `${challenge.id} interaction ${stepIndex + 1} choice ${option.id} leaves the far singles court.`);
        if (/crosscourt/i.test(option.text)) assert.ok((start[0] < 125 && landing[0] > 125) || (start[0] > 125 && landing[0] < 125), `${challenge.id} interaction ${stepIndex + 1} says crosscourt but renders another direction.`);
      }
    }
    if (step.visual.kind === 'serve_plus_one') {
      assert.equal(step.visual.paths.length, 4, 'Every serve-plus-one choice needs an exact path.');
      assert.equal(step.visual.serve.length >= 4, true, 'The serve must show strike, bounce and returner contact.');
      assert.equal(step.visual.returnPath.length >= 4, true, 'The return must show strike, bounce and first-ball contact.');
      assert.deepEqual(
        {
          handedness: step.visual.serveContract?.handedness,
          courtSide: step.visual.serveContract?.courtSide,
          spin: step.visual.serveContract?.spin,
          camera: step.visual.serveContract?.camera,
          screenExit: step.visual.serveContract?.screenExit
        },
        { handedness: 'right', courtSide: 'deuce', spin: 'slice', camera: 'server-behind', screenExit: 'left' },
        'Serve orientation, handedness and spin must remain one indivisible contract.'
      );
      assert.deepEqual(step.visual.serve[0], step.visual.server, 'The serve path must begin at the server.');
      assert.deepEqual(step.visual.serve.at(-1), step.visual.returner, 'The serve path must finish at the returner.');
      assert.deepEqual(step.visual.returnPath[0], step.visual.returner, 'The return path must begin at the returner.');
      assert.deepEqual(step.visual.returnPath.at(-1), step.visual.contact, 'The return path must finish at the next contact.');
      assert.ok(step.visual.server[0] > 125, 'A near-baseline deuce-court server must render screen-right of centre.');
      assert.ok(step.visual.serveBounce[0] >= 40 && step.visual.serveBounce[0] < 125 && step.visual.serveBounce[1] > 50 && step.visual.serveBounce[1] < 85, 'The slice must bounce inside the far-left service box.');
      assert.ok(step.visual.returner[0] >= 25 && step.visual.returner[0] < 40, 'The wide slice must pull the returner just outside the screen-left singles sideline.');
      const serveBounceIndex = step.visual.serve.findIndex((point) => point[0] === step.visual.serveBounce[0] && point[1] === step.visual.serveBounce[1]);
      assert.ok(serveBounceIndex > 0 && serveBounceIndex < step.visual.serve.length - 1, 'The bounce must explicitly divide flight from skid.');
      const serveExit = step.visual.serve.slice(serveBounceIndex);
      assert.ok(step.visual.serve.at(-1)[0] <= step.visual.serveBounce[0] - 8, 'A right-handed deuce-court slice must exit the bounce visibly screen-left.');
      assert.ok(serveExit.every((point, index) => index === 0 || point[0] < serveExit[index - 1][0]), 'Post-bounce slice coordinates must never reverse toward screen-right.');
      assert.ok(step.visual.returnBounce[1] > 85 && step.visual.returnBounce[1] <= 156, 'The return must bounce inside the near singles court.');
    }
    if (step.visual.kind === 'return_position') {
      const visual = step.visual;
      const bounceIndex = visual.serve.findIndex((candidate) => candidate[0] === visual.serveBounce[0] && candidate[1] === visual.serveBounce[1]);
      const referenceBounceIndex = visual.referenceServe.findIndex((candidate) => candidate[0] === visual.serveBounce[0] && candidate[1] === visual.serveBounce[1]);
      assert.ok(['choice', 'compare'].includes(visual.mode), 'Return-position mode must be explicitly authored.');
      assert.ok(visual.serve.length >= 5 && visual.referenceServe.length >= 5, 'Return position needs current and reference serve paths.');
      assert.deepEqual(visual.serve[0], visual.server, 'Current return-position serve must begin at the server.');
      assert.deepEqual(visual.referenceServe[0], visual.server, 'Reference return-position serve must begin at the same server.');
      assert.deepEqual(visual.serve.at(-1), visual.contact, 'Current serve must finish at the current contact.');
      assert.deepEqual(visual.referenceServe.at(-1), visual.referenceContact, 'Reference serve must finish at the reference contact.');
      assert.ok(bounceIndex >= 2 && bounceIndex === referenceBounceIndex, 'Both return-position paths need one shared authored bounce.');
      assert.deepEqual(visual.serve.slice(0, bounceIndex + 1), visual.referenceServe.slice(0, referenceBounceIndex + 1), 'The return-position comparison must not change the serve before its bounce.');
      assert.ok(visual.serveBounce[0] >= 40 && visual.serveBounce[0] <= 210 && visual.serveBounce[1] > 85 && visual.serveBounce[1] < 120, 'Return-position serve must bounce in the near service box.');
      assert.deepEqual(visual.returnPath[0], visual.contact, 'Current return must begin at current contact.');
      assert.deepEqual(visual.referenceReturnPath[0], visual.referenceContact, 'Reference return must begin at reference contact.');
      if (visual.mode === 'choice') {
        assert.equal(visual.choiceStarts.length, 4, 'Every return-position choice needs an exact starting position.');
        assert.equal(visual.showChoiceMarkers, false, 'Overlapping A–D markers must stay off the evidence court; the text choices and answered reference carry the decision.');
      }
    }
    if (step.visual.kind === 'split_step_timeline') {
      const visual = step.visual;
      assert.ok(visual.ballPath.length >= 4, 'Split-step timing needs a complete incoming ball path.');
      assert.ok(Math.hypot(visual.ballPath[0][0] - visual.opponent[0], visual.ballPath[0][1] - visual.opponent[1]) <= 8, 'The ball must leave the opponent strike zone.');
      assert.ok(Number.isFinite(visual.landingOffset) && visual.landingOffset >= -.65 && visual.landingOffset <= .65, 'Split-step landing offset is outside the visible timing rail.');
      assert.ok(Number.isFinite(visual.firstStepDelay) && visual.firstStepDelay >= 0, 'Split-step first-move delay must be explicit.');
      assert.equal(visual.moveTarget[0] < 125, visual.ballPath.at(-1)[0] < 125, 'The first step must move toward the incoming ball.');
    }
    if (step.visual.kind === 'outcome_vs_decision') {
      const visual = step.visual;
      assert.ok(['result', 'compare', 'permission'].includes(visual.mode), 'Decision-quality mode must be explicit.');
      assert.deepEqual(visual.incoming.at(-1), visual.contact, 'The incoming ball must arrive at the decision contact.');
      assert.deepEqual(visual.riskyPath[0], visual.contact, 'The risky reply must begin at decision contact.');
      assert.deepEqual(visual.repeatablePath[0], visual.contact, 'The repeatable reply must begin at decision contact.');
      assert.deepEqual(visual.riskyPath.at(-1), visual.riskyTarget.slice(0, 2), 'The risky reply must finish in its authored window.');
      assert.deepEqual(visual.repeatablePath.at(-1), visual.repeatableTarget.slice(0, 2), 'The repeatable reply must finish in its authored window.');
      assert.equal(typeof visual.showOutcome, 'boolean', 'Result visibility must be deliberately authored.');
    }
    if (step.visual.kind === 'two_point_sequence') {
      const visual = step.visual;
      assert.ok(['rally', 'reset', 'serve'].includes(visual.mode), 'Mental sequence mode must be explicit.');
      assert.deepEqual(visual.firstPath.at(-1), visual.firstLanding, 'Point-one path and outcome must remain attached.');
      if (visual.mode !== 'serve') assert.deepEqual(visual.secondPath.at(-1), visual.secondLanding, 'Point-two ball or target plan must remain attached.');
      if (visual.responsePath) assert.deepEqual(visual.responsePath.at(-1), visual.responseLanding, 'Opponent response and outcome must remain attached.');
      if (visual.mode === 'serve') {
        const inServiceBox = (landing) => landing[0] >= 19 && landing[0] <= 101 && landing[1] >= 43 && landing[1] <= 80;
        assert.equal(inServiceBox(visual.firstLanding), false, 'A labelled double fault must not land in the service box.');
        assert.equal(visual.secondPath, undefined, 'The next serve result must remain unknown.');
        assert.equal(visual.resetPath, undefined, 'A reset must not manufacture a successful serve.');
        assert.equal(visual.resetLanding, undefined, 'No guaranteed future landing.');
        assert.deepEqual(visual.resetRoutine, ['TARGET', 'EXHALE', 'READY']);
        assert.match(visual.resetOutcome, /RESULT UNKNOWN/);
        const [x,y,w,h] = visual.resetTarget;
        assert.ok(visual.firstServer[1] >= 152 && visual.player[1] >= 152, 'Both initial serving stances are behind the baseline.');
        assert.ok((visual.firstServer[0]-60)*(visual.player[0]-60)<0, 'Consecutive points switch serving sides.');
        const [left,right] = visual.player[0]<60 ? [60,101] : [19,60];
        assert.ok(x-w/2 >= left && x+w/2 <= right && y-h/2 >= 43 && y+h/2 <= 80, 'Reset target fits the new diagonal service box.');
      }
      if (visual.mode === 'reset') assert.equal(visual.choiceTargets.length, 4, 'Each target decision needs an authored plan.');
    }
  }
}
assert.ok(answerKeys.size >= 4, 'Answer position must vary across the twenty-seven interactions.');
assert.equal(new Set(prototype.challenges.map((challenge) => challenge.proInsight.player+'|'+challenge.proInsight.documentedMoment)).size, 21, 'Each lesson must have a distinct professional story, not necessarily a different player.');
assert.equal(new Set(prototype.challenges.map((challenge) => challenge.proInsight.source.url)).size, 21, 'Each professional story needs its own directly relevant source.');

const recovery = prototype.challenges.find((challenge) => challenge.slug === 'recovery');
assert.deepEqual(recovery.steps.map((step) => step.decisionLens), ['geometry', 'balance', 'tendency']);
assert.ok(Array.isArray(recovery.steps[2].visual.tendency));
assert.match(recovery.steps[2].visual.tendencyLabel, /DOWN THE LINE/);

const shortBall = prototype.challenges.find((challenge) => challenge.slug === 'short-ball');
assert.deepEqual(shortBall.steps.map((step) => step.decisionLens), ['constraint', 'opportunity', 'transfer'], 'Short-ball learning must begin with the tempting mistake, then contrast the earned attack.');
assert.match(shortBall.steps[0].phase, /Resist the trap/);
assert.match(shortBall.steps[1].phase, /Earn the attack/);
assert.equal(shortBall.steps[2].visual.ballLabel, 'LOW', 'Short-ball transfer must not repeat the prior waist-high attack picture.');
assert.equal(shortBall.steps[2].visual.playerState, 'STABLE', 'Short-ball transfer must preserve the positive balance cue.');
assert.equal(shortBall.steps[2].visual.opponentState, 'DEEP', 'Short-ball transfer must add opponent depth as a new cue.');
assert.ok(jaccard(shortBall.steps[1].options[shortBall.steps[1].correct].text, shortBall.steps[2].options[shortBall.steps[2].correct].text) < 0.58, 'Short-ball transfer must not repeat the preceding solution.');

const contact = prototype.challenges.find((challenge) => challenge.slug === 'contact');
assert.doesNotMatch(contact.steps[2].situation, /late contact|crowded contact|contact is still/i, 'Contact transfer must not reveal its diagnosis in the setup.');
assert.equal(contact.title, 'Two Misses. One Clue.');
assert.equal(contact.memory, 'Two misses. One useful clue.');
assert.deepEqual(contact.steps.map((step) => step.decisionLens), ['observation', 'contrast', 'transfer'], 'Contact must move from observation to controlled contrast to transfer.');
assert.match(contact.steps[0].question, /actually visible/i, 'The first decision must ask what the player can genuinely observe.');
assert.match(contact.steps[0].options[contact.steps[0].correct].text, /close to the body/i, 'The first answer must name only the visible spacing clue.');
assert.match(contact.steps[2].question, /earlier clue appears again/i, 'Transfer must ask the player to recognize the same clue under a new outcome.');
assert.match(contact.steps[2].options[contact.steps[2].correct].text, /ball again crowds/i, 'Transfer must preserve the observable clue without inventing a diagnosis.');
assert.doesNotMatch(JSON.stringify(contact), /late contact|upstream cause/i, 'Unsupported late-contact certainty must not leak back into the prototype.');
assert.equal(contact.steps[0].visual.motion.outcome, 'wide', 'The first contact miss must visibly finish wide.');
assert.equal(contact.steps[2].visual.motion.outcome, 'short', 'The transfer miss must visibly finish short.');
assert.notEqual(contact.steps[0].visual.motion.outcome, contact.steps[2].visual.motion.outcome, 'Different stated outcomes must never share an undifferentiated visual outcome.');
assert.equal(contact.steps[0].visual.motion.previewMode, 'miss');
assert.equal(contact.steps[1].visual.motion.previewMode, 'fix', 'The contrast step must show the reference spacing before the answer.');
assert.equal(contact.steps[2].visual.motion.previewMode, 'miss');

const directionChange = prototype.challenges.find((challenge) => challenge.slug === 'line');
assert.deepEqual(directionChange.steps.map((step) => step.decisionLens), ['constraint', 'permission', 'transfer'], 'Direction change must teach constraint before permission, then transfer wings.');
assert.ok(directionChange.steps[0].visual.player[0] < 125, 'Direction change must begin on the backhand side.');
assert.ok(directionChange.steps[2].visual.player[0] > 125, 'Direction-change transfer must switch to the forehand side.');
assert.match(directionChange.steps[0].payoff, /contact was not/i, 'The beginner payoff must separate visible space from usable contact.');
assert.doesNotMatch(directionChange.steps[0].options.map((option) => option.text).join(' '), /float safely/i, 'A plausible middle-ball alternative must not be falsely labelled safe.');
assert.match(directionChange.steps[1].question, /newly available/i, 'The permission step must ask what changed, because crosscourt can remain a valid choice.');
assert.match(directionChange.steps[1].payoff, /available.not compulsory/i, 'The earned line must remain an option rather than a command.');

const servePlusOne = prototype.challenges.find((challenge) => challenge.slug === 'serve-plus-one');
assert.equal(servePlusOne.screenTitle, 'Serve + First Ball', 'The in-lesson title must name the sequence literally before using the memorable metaphor at payoff.');
assert.deepEqual(servePlusOne.steps.map((step) => step.decisionLens), ['prediction', 'confirmation', 'adaptation'], 'Serve plus one must read, confirm and then adapt.');
assert.equal(servePlusOne.steps[0].visual.choiceRole, 'return', 'The first serve decision must read the return before choosing the plus-one.');
assert.ok(servePlusOne.steps.slice(1).every((step) => step.visual.choiceRole === 'plusOne'), 'Only the final two decisions may choose the plus-one.');
assert.equal(servePlusOne.steps[0].visual.evidencePaths.length, 1, 'One live return plus one ghosted return must form the two-observation pattern.');
assert.equal(servePlusOne.steps[0].visual.hideTargetsBeforeAnswer, true, 'A return path must never disclose an answer target before selection.');
assert.ok(servePlusOne.steps.every((step) => JSON.stringify(step.visual.serve) === JSON.stringify(servePlusOne.steps[0].visual.serve)), 'The transfer must preserve the same serve geometry.');
assert.ok(servePlusOne.steps[2].visual.returnBounce[1] > servePlusOne.steps[1].visual.returnBounce[1] + 20, 'The transfer must visibly change a short return into a deep return.');
assert.match(servePlusOne.steps[2].principle, /ball received/i, 'The transfer must teach confirmation rather than blind pre-commitment.');
assert.equal(servePlusOne.memory, 'The serve asks. The return answers.', 'The payoff must preserve planning and adaptation in one memorable line.');
assert.match(servePlusOne.takeItToCourt, /real ball decide/i, 'The court cue must never teach blind serve-plus-one pre-commitment.');

const mentalReset = prototype.challenges.find((challenge) => challenge.slug === 'two-points');
assert.deepEqual(mentalReset.steps.map((step) => step.decisionLens), ['contamination', 'reset', 'transfer'], 'Mental reset must trace contamination, reset and cross-stroke transfer.');
assert.equal(mentalReset.steps[0].visual.mode, 'rally');
assert.equal(mentalReset.steps[2].visual.mode, 'serve', 'Mental transfer must change from rally error to serving pressure.');
assert.match(mentalReset.memory, /one point/i, 'The mental payoff must not dramatise one miss into more than it cost.');

const returnPosition = prototype.challenges.find((challenge) => challenge.slug === 'return-position');
assert.deepEqual(returnPosition.steps.map((step) => step.decisionLens), ['constraint', 'tradeoff', 'transfer'], 'Return position must teach a reversible trade, not one permanent stance.');
assert.ok(returnPosition.steps[0].visual.referenceStart[1] > 156, 'The first adjustment must visibly give ground.');
assert.ok(returnPosition.steps[2].visual.referenceStart[1] < 156, 'Transfer must visibly turn the position dial forward.');
assert.equal(returnPosition.memory, 'Return position is a dial.');

const splitStep = prototype.challenges.find((challenge) => challenge.slug === 'split-step');
assert.deepEqual(splitStep.steps.map((step) => step.decisionLens), ['observation', 'timing', 'transfer'], 'Split-step teaching must move from observation to timing to tempo transfer.');
assert.ok(splitStep.steps[0].visual.landingOffset < 0, 'The first split step must land early.');
assert.equal(splitStep.steps[1].visual.landingOffset, .15, 'The illustrative ready landing follows contact as early flight becomes readable.');
assert.ok(splitStep.steps[2].visual.landingOffset > 0, 'The transfer must show a late landing.');
assert.equal(splitStep.memory, 'Land for the hit.');

const decisionQuality = prototype.challenges.find((challenge) => challenge.slug === 'winner');
assert.deepEqual(decisionQuality.steps.map((step) => step.decisionLens), ['outcome', 'repeatability', 'transfer'], 'Decision quality must separate outcome, repeatability and earned risk.');
assert.equal(decisionQuality.steps[0].visual.showOutcome, true, 'The first decision needs the seductive winning result.');
assert.equal(decisionQuality.steps[1].visual.showOutcome, false, 'The repeatability decision must hide the result.');
assert.equal(decisionQuality.steps[2].visual.mode, 'permission', 'Transfer must show when aggression becomes earned.');
assert.equal(decisionQuality.memory, 'Judge the choice before the result.');

const renderStepSource = jsText.slice(jsText.indexOf('function renderStep('), jsText.indexOf('function answer('));
assert.ok(renderStepSource.indexOf('visualHtml(step)') < renderStepSource.indexOf('gs-gold-daily-question'), 'The visual must render before the decision prompt.');
assert.ok(renderStepSource.indexOf('gs-gold-daily-coach-setup') < renderStepSource.indexOf('visualHtml(step)'), 'Approved coaching hierarchy: setup precedes evidence.');
assert.ok(renderStepSource.includes('aria-describedby="gd-coach-setup"'), 'The focused question must retain accessible setup context.');
assert.ok(!renderStepSource.includes('gs-gold-daily-scene-line'), 'Do not duplicate the setup below the evidence.');
assert.ok(renderStepSource.includes('gs-gold-daily-step-count') && !renderStepSource.includes('step.phase'), 'Use readable numbered progress, not authoring phase labels.');
assert.ok(renderStepSource.includes('gs-gold-daily-decision-zone'), 'Every interaction needs one stable decision zone.');
assert.ok(renderStepSource.includes('preserveScroll') && renderStepSource.includes('scrollTop'), 'Answer rerenders must preserve the user’s exact reading position.');
assert.ok(renderStepSource.includes('gs-gold-daily-feedback-principle'), 'The causal learning sentence must remain visible after every answer.');
assert.equal(renderStepSource.includes("isCorrect ? 'Good read'"), false, 'Generic praise must not replace the actual insight payoff.');
assert.ok(renderStepSource.includes('data-gd-action="why"'), 'Nuance must remain available behind an optional Why control.');
assert.ok(cssText.includes('.gs-gold-daily-why-panel[hidden]'), 'Optional explanation must be collapsed by default.');
assert.ok(cssText.includes('.gs-gold-daily-options.is-answered .gs-gold-daily-option.is-muted{display:none}'), 'Answered states must remove dead reading weight and expose the payoff.');
assert.ok(cssText.includes('.gs-gold-daily-step.is-paced.is-reading .gs-gold-daily-options') && cssText.includes('var(--gd-question-delay)'), 'Choice weight must rise only after the last evidence beat has landed.');
assert.ok(cssText.includes('.gs-gold-daily-step.is-paced.is-answered .gs-gold-daily-feedback') && cssText.includes('var(--gd-payoff-delay)'), 'The written payoff must follow the visual consequence instead of competing with it.');
assert.ok(jsText.includes("typeof faspScene === 'function' && typeof faspStart === 'function' && typeof faspRender === 'function'"), 'The existing validated contact-motion runtime must be mandatory.');
assert.ok(jsText.includes("static fallback is forbidden"), 'Missing motion must fail closed rather than regress to a static diagram.');
assert.ok(jsText.includes('const EVIDENCE_TIMELINES = Object.freeze'), 'Visual cues and court audio need one immutable timing source.');
assert.ok(jsText.includes("const ATTENTION_POLICY = 'evidence-first'"), 'Every prototype needs one explicit attention-pacing policy.');
assert.equal(jsText.includes('PACED_EVIDENCE_KINDS'), false, 'No visual family may silently opt out of evidence-first pacing.');
assert.ok(jsText.includes('EVIDENCE_TIMELINES[step.visual.kind]'), 'Pacing eligibility must come from an authored timeline, not a partial allowlist.');
assert.ok(prototype.challenges.every((challenge) => challenge.attentionPolicy === 'evidence-first'), 'All nine prototypes must explicitly declare evidence-first pacing.');
assert.ok(jsText.includes('validateEvidenceTimelines()'), 'Every authored timing source must be checked before the preview opens.');
assert.ok(jsText.includes('evidence beats are too compressed to read separately') && jsText.includes('the decision arrives before the final evidence beat can land'), 'The timing audit must reject simultaneous cue and decision dumps.');
assert.ok(jsText.includes("root.GSLivePointEngine.createAudioEngine"), 'Only the shared recorded-court audio engine may drive prototype sound.');
assert.ok(jsText.includes("const NATURAL_AUDIO_TYPES = Object.freeze(['serve', 'ground', 'slice', 'bounce', 'shoe'])"), 'Prototype audio must be constrained to natural tennis recordings.');
for (const kind of ['direction_change', 'serve_plus_one', 'return_position', 'split_step_timeline', 'outcome_vs_decision', 'two_point_sequence']) {
  assert.ok(jsText.includes(`step.visual.kind === '${kind}'`), `${kind} must use the shared natural-audio timeline.`);
}
assert.ok(jsText.includes('const VISUAL_RENDERERS = Object.freeze({'), 'Visual families must use an explicit fail-closed renderer registry.');
assert.ok(jsText.includes("throw new Error('Withheld: no validated renderer for '"), 'Unknown visuals must be withheld rather than falling through to unrelated content.');
assert.ok(jsText.includes('if (!step || prefersReducedMotion()) return false;'), 'Reduced motion must also suppress timeline-bound court audio.');
assert.equal(/createOscillator|OscillatorNode/.test(jsText), false, 'Synthesized success/failure sounds are structurally forbidden.');
assert.ok(jsText.includes('synthesized fallback is forbidden'), 'The runtime contract must fail closed rather than invent a substitute tone.');
assert.ok(jsText.includes('data-gd-action="replay-evidence"'), 'Every evidence family needs the same replay control.');
assert.ok(jsText.includes("stepShell.classList.remove('is-motion-finished')"), 'Replay must restart decision and payoff staging instead of leaving the prior settled state behind.');
assert.ok(jsText.includes('function smoothPathData(') && jsText.includes('function splitPathAtBounce('), 'Smooth flight must preserve an explicit authored bounce boundary.');
assert.ok(jsText.includes('const serveFlightD = smoothPathData(serveSplit.flight), serveExitD = smoothPathData(serveSplit.exit)'), 'Serve flight and post-bounce skid must render as separate physical phases.');
assert.equal(jsText.includes('const serveD = smoothPathData(v.serve)'), false, 'A single smoothed path must never erase the serve bounce direction again.');
assert.ok(jsText.includes('function returnArrival(') && jsText.includes('const d = pathData([v.serveBounce,p])'), 'Return-position arrivals must share the authored bounce and a distance-derived clock.');
assert.ok(jsText.includes('gd-serve-flight') && jsText.includes('gd-serve-skid') && jsText.includes('bouncePulse(v.serveBounce'), 'The bounce must remain visually legible between flight and skid.');
assert.ok(jsText.includes('movingTokenUntil(serveFlightD') && jsText.includes('movingTokenUntil(serveExitD'), 'One moving ball must hand off cleanly at the bounce instead of teleporting or duplicating.');
assert.ok(jsText.includes('marker-mid="url(#gd-serve-arrow)"') && jsText.includes('marker-mid="url(#gd-return-arrow)"'), 'Settled serve and return paths must retain visible direction away from the endpoint markers.');
assert.ok(jsText.includes('if (!v.hideTargetsBeforeAnswer || answered)'), 'The shared renderer must withhold answer markers that overlap observed evidence.');
assert.equal(jsText.includes('data-gd-action="replay-contact"'), false, 'Contact-only replay branching must not return.');
assert.ok(jsText.includes('data-gd-action="expand-evidence"'), 'Every evidence family needs one shared full-screen affordance.');
assert.ok(jsText.includes('aria-label="Expand animation to full screen"') && jsText.includes('aria-haspopup="dialog"'), 'The full-screen affordance must be explicit to sighted and assistive-technology users.');
assert.ok(jsText.includes('role="dialog" aria-modal="true" aria-label="Animation Focus View"'), 'Expanded evidence must use one accessible modal Focus View.');
assert.ok(jsText.includes("else if (action === 'expand-evidence') openEvidenceFocus(control)"), 'The shared dispatcher must own every expansion path.');
assert.ok(jsText.includes("else if (action === 'close-focus') closeEvidenceFocus(true)"), 'Focus View must have one reversible close path.');
const openFocusSource = jsText.slice(jsText.indexOf('function openEvidenceFocus('), jsText.indexOf('function closeEvidenceFocus('));
const closeFocusSource = jsText.slice(jsText.indexOf('function closeEvidenceFocus('), jsText.indexOf('function trapFocus('));
assert.ok(openFocusSource.includes('stage.appendChild(visual)'), 'Focus View must move the live animation node rather than manufacture a divergent copy.');
assert.equal(openFocusSource.includes('cloneNode'), false, 'Cloned animation state is structurally forbidden.');
assert.ok(openFocusSource.includes('replayEvidence()'), 'Opening Focus View must restart the same authored timeline after the expand tap.');
assert.ok(closeFocusSource.includes('parent.insertBefore(active'), 'Closing Focus View must restore that same live node to its exact decision position.');
assert.equal((openFocusSource + closeFocusSource).includes('state.selectedIndex = '), false, 'Opening, rotating or closing Focus View must never alter the decision.');
assert.ok(jsText.includes("state.focusReturn = replacement.querySelector('[data-gd-action=\"expand-evidence\"]')"), 'A focused replay must retain a valid return target after its live node is rebuilt.');
assert.ok(jsText.includes("if (event.key === 'Escape')") && jsText.includes('trapFocus(event)'), 'Focus View must support Escape and retain keyboard focus.');
assert.equal(jsText.includes('requestFullscreen'), false, 'The pilot must not depend on iPhone-inconsistent native element fullscreen.');
assert.ok(cssText.includes('.gs-gold-daily-focus{') && cssText.includes('position:fixed;') && cssText.includes('inset:0;'), 'Focus View must occupy the visual viewport itself.');
assert.ok(cssText.includes('env(safe-area-inset-top)') && cssText.includes('env(safe-area-inset-bottom)'), 'Focus View must preserve mobile safe areas.');
assert.ok(cssText.includes('@media(orientation:portrait)') && cssText.includes('@media(orientation:landscape)'), 'Portrait and landscape layouts must both be explicitly governed.');
assert.ok(cssText.includes('100dvh'), 'Focus sizing must follow the live mobile viewport through orientation changes.');
assert.ok(cssText.includes('.gs-gold-daily-focus-stage .gs-gold-daily-visual-expand{display:none}'), 'The expand control must not recursively appear inside Focus View.');
assert.ok(jsText.includes("overlay.addEventListener('pointerdown', onPointerDown"), 'Any tap must be able to finish non-essential motion without blocking the decision.');
assert.ok(jsText.includes("svg.setCurrentTime((timeline && timeline.total || 0) + .05)"), 'Skipping must seek the whole SVG scene to its authored final state rather than erase partial evidence.');
assert.ok(jsText.includes("faspRender(answered ? 'compare' : contactPreviewMode(authoredStep), authoredStep.visual.motion.contactFrame)"), 'Skipping contact motion must settle on the authored evidence frame or comparison, never an arbitrary pose.');
const answerSource = jsText.slice(jsText.indexOf('function answer('), jsText.indexOf('function next('));
assert.equal(answerSource.includes('scrollIntoView'), false, 'Answering must never auto-scroll the player away from the evidence.');
assert.ok(jsText.includes('class="fasp-stage gs-gold-daily-contact-stage" aria-hidden="true"'), 'The motion engine’s diagnostic labels must not leak the answer to assistive technology before the choice.');
const contactRendererSource = jsText.slice(jsText.indexOf('function contactVisual('), jsText.indexOf('function visualHtml('));
assert.ok(contactRendererSource.includes("faspStart(answered ? 'fix' : contactPreviewMode(step))"), 'Contact must play the authored evidence frame before the answer and the correction after it.');
assert.ok(jsText.includes("return step && step.visual && step.visual.motion && step.visual.motion.previewMode === 'fix' ? 'fix' : 'miss';"), 'A single validated resolver must drive every pre-answer contact state.');
assert.ok(jsText.includes('moutcome: step.visual.motion.outcome'), 'The authored ball outcome must feed the shared motion timeline.');
assert.ok(jsText.includes('mshowoutcome: step.visual.motion.showOutcome !== false'), 'Outcome visibility must come from the same authored contact state as the motion.');
assert.ok(jsText.includes("left: 'CROWDED'") && jsText.includes("right: 'REFERENCE'"), 'Contact comparison labels must describe evidence rather than claim a miss and fix.');
assert.ok(jsText.includes('mshowfixoutcome: false'), 'The reference frame must not imply that one spacing change guarantees a controlled outcome.');
assert.ok(indexText.includes('faspEvidenceLabels.left') && indexText.includes('faspEvidenceLabels.right'), 'The shared contact renderer must consume the authored neutral evidence labels.');
assert.ok(indexText.includes("faspEvidenceLabels.missStatus") && indexText.includes("faspEvidenceLabels.fixStatus"), 'The rendered status line must use the same neutral evidence vocabulary.');
assert.ok(indexText.includes("faspShowOutcome&&(!correct||faspShowFixOutcome)"), 'Reference-outcome certainty must be independently suppressible.');
assert.ok(indexText.includes('faspShowOutcome&&(!correct||faspShowFixOutcome)?`<text'), 'The shared renderer must expose only the authored outcome states.');
assert.ok(indexText.includes("!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)&&Math.abs(t-contact)<.095"), 'Reduced motion must remove the repeating contact pulse, not merely freeze the swing.');
assert.ok(contactRendererSource.includes("if (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches)"), 'Answered contact comparisons must bypass the normal motion delay under reduced motion.');
assert.ok(contactRendererSource.includes("faspRender('compare'"), 'Contact must settle on a synchronized miss-versus-fix comparison.');
assert.equal(contactRendererSource.includes('<svg viewBox="0 0 250 150"'), false, 'The discarded static contact diagram must not return.');

const resultRendererSource = jsText.slice(jsText.indexOf('function renderResult()'), jsText.indexOf('function onClick('));
assert.ok(resultRendererSource.includes('gs-gold-daily-pro-insight'), 'The named professional story must be part of the final payoff.');
assert.ok(resultRendererSource.indexOf('gs-gold-daily-pro-insight') < resultRendererSource.indexOf('gs-gold-daily-court-cue'), 'Human proof must arrive before the personal court transfer.');
assert.ok(resultRendererSource.includes('Source · '), 'Every named-player payoff must expose its source.');
assert.ok(resultRendererSource.includes('rel="noopener noreferrer"'), 'External evidence links must be isolated safely.');
assert.ok(jsText.includes('Independent GameSharp analysis · no player endorsement or affiliation.'), 'The editorial and endorsement boundary must remain visible.');
assert.ok(cssText.includes('.gs-gold-daily-pro-source a{') && cssText.includes('min-height:44px'), 'The mobile source control must remain comfortably tappable.');
assert.ok(cssText.includes('@media(prefers-reduced-motion:reduce)'), 'The prototype needs an explicit reduced-motion presentation.');
assert.ok(jsText.includes("matchMedia('(prefers-reduced-motion: reduce)')"), 'Scripted scrolling and contact playback must consult reduced-motion preference.');
assert.ok(indexText.includes("if(reduced){faspRender(mode,.61);return;}"), 'The shared contact renderer must collapse to an evidence frame under reduced motion.');
assert.ok(indexText.includes('const GS_FASP_TIMING=Object.freeze'), 'The contact renderer must expose one immutable playback clock.');
assert.ok(jsText.includes('GS_FASP_TIMING.contactMs / 1000'), 'Prototype contact audio must inherit the renderer’s exact contact instant.');
assert.ok(cssText.includes('.gs-gold-daily-ink span{') && cssText.includes('gsGoldDailyInkWrite'), 'The payoff needs a fast coach-mark reveal inside the evidence stage.');
assert.ok(cssText.includes('.gs-gold-daily-visual.is-return_position .gs-gold-daily-ink') && cssText.includes('.gs-gold-daily-visual.is-split_step_timeline .gs-gold-daily-ink'), 'Payoff ink must not cover return depth or the split-step timing rail.');
assert.ok(cssText.includes('.gs-gold-daily-visual-canvas>svg{height:136px'), 'The smallest-phone layout must retain all four decisions without sacrificing tap targets.');

for (const eventName of prototype.requiredEvents) {
  assert.ok(jsText.includes(`'${eventName}'`), `Missing requested analytics event: ${eventName}`);
}
for (const metadataField of ['lesson_spine_id', 'editorial_theme', 'sharpen_target']) {
  assert.ok(jsText.includes(metadataField), `Prototype analytics must preserve canonical ${metadataField} metadata.`);
}
assert.equal(/\bsetItem\s*\(/.test(jsText), false, 'Lesson renderer must delegate pilot storage; no direct Daily, streak or learning writes.');
assert.ok(jsText.includes('if (!state.daily || state.dailyReplay) return;'), 'Catalogue review and practice replays must not change calendar progress.');

const loaderStart = indexText.indexOf('<script id="gs-gold-daily-preview-loader">');
const loaderEnd = indexText.indexOf('</script>', loaderStart);
assert.ok(loaderStart > -1 && loaderEnd > loaderStart, 'Missing prototype preview loader.');
const loader = indexText.slice(loaderStart, loaderEnd);
assert.ok(loader.includes('window.GS_GOLD_DAILY_MAIN = true;'), 'The new Daily must be the default main route.');
assert.equal((indexText.match(/gold-daily-prototypes\.js/g) || []).length, 1, 'Prototype must have only one isolated loader.');
assert.equal((indexText.match(/class="gs-daily-pilot-entry"/g) || []).length, 0, 'Home must not expose a competing pilot entry.');
assert.ok(indexText.includes('<button class="gs-daily-card-hit" type="button" aria-label="Start Today’s Challenge"'), 'The real Daily must retain one full-card semantic primary action beside the pilot link.');
assert.ok(indexText.includes('<div class="daily-card gs-daily-dominant gs-daily-v52" id="dailyCard">'), 'The pilot link must never be nested inside a clickable ARIA container.');
assert.ok(indexText.includes('#dailyCard>.daily-inner{pointer-events:none;') && indexText.includes('pointer-events:auto;'), 'The full-card Daily target and pilot link must remain independently operable.');
assert.ok(indexText.indexOf('id="dailyCard"') < indexText.indexOf('id="seqHomeCard"'), 'Daily must remain primary and Predict secondary.');
assert.ok(indexText.includes('.gs-daily-pilot-entry{') && indexText.includes('min-height:44px'), 'The pilot entry must remain comfortably tappable on mobile.');
assert.ok(cssText.includes('z-index:2147483646'), 'The isolated review must remain above every host-page intro and modal layer.');

for (const id of expectedIds) {
  const {goldDailyPilot, ...mainManifest} = JSON.parse(manifestText);
  if(prototype.challenges.find(c=>c.id===id).reviewOnly){
    assert.ok(mainManifest.localReviewOnly.some(c=>c.id===id));
    assert.ok(!mainManifest.daily.lessonIds.includes(id));
    continue;
  }
  assert.equal(goldDailyPilot.status, 'promoted-to-main-daily');
  assert.equal(goldDailyPilot.mainDailyPromotions, 21);
  assert.ok(mainManifest.daily.lessonIds.includes(id), `${id} requires explicit main-Daily approval.`);
  assert.ok(goldDailyPilot.lessonIds.includes(id), `${id} requires an explicit pilot review record.`);
}

const unsafeSelectors = cssText
  .split(/\n/)
  .map((line) => line.trim())
  .filter((line) => line && line.includes('{') && !line.startsWith('@') && !line.startsWith('.gs-gold-daily') && !line.startsWith('}'));
assert.deepEqual(unsafeSelectors, [], `Prototype CSS escaped its namespace:\n${unsafeSelectors.join('\n')}`);

console.log('PASS gold-daily prototype contract');
console.log('21 authored lessons · 63 visual-first interactions');
