(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GameSharpForehandCheck = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }

  // This is a bounded practice comparison, not another lesson, a diagnostic
  // engine, or approval of a player's technique. The existing Contact lesson
  // continues to own its evidence, memory and observation cue.
  const definition = deepFreeze({
    id:'forehand-space-check-v1',
    version:1,
    lessonId:'gold_contact_point_v1',
    spineId:'forehand_contact_upstream',
    status:'provisional_beta',
    coachReview:'pending',
    shortTitle:'Try one spacing check',
    setup:'Warm up first. Ask a partner to feed comfortable forehands to a similar bounce area. Choose a generous target safely inside the court.',
    usualBlock:'Hit 10 forehands as usual. Count every ball that hits the net or lands out.',
    cue:'Use small adjusting steps to leave comfortable room for your usual forehand.',
    cueBlock:'Hit 10 more using the cue below. Keep the feeds, target and intended hitting pace similar. Count all net or out misses again.',
    counting:'Count all misses, not just one kind: fewer net misses should not hide more balls going long or wide.',
    limits:[
      'Never deliberately crowd yourself in the first group. Do not force extra distance, reach farther, or change your grip or swing.',
      'Comfortable room is the aim, not the biggest possible gap. Stop the check if it feels uncomfortable.',
      'If the feeds, target or intended pace change, the groups cannot tell us whether this cue helped.',
      'A brief comparison cannot identify the cause of your match errors or prove lasting improvement.'
    ],
    disclosure:'Source-informed beta practice idea. Independent coach review is pending. This is a comparison, not a diagnosis or a guaranteed fix.',
    adaptation:'GameSharp combines the sourced spacing and adjustment-step principles with a two-group comparison. The exact cue, matched conditions, total-miss count and interpretation are an original beta adaptation, not a USTA or coach-validated protocol.',
    sources:[
      {
        id:'usta-contact-space',
        publisher:'USTA',
        author:'Leah Friedman',
        title:'Tennis for beginners: Find your optimal contact point',
        url:'https://www.usta.com/en/home/improve/tips-and-instruction/national/find-your-optimal-contact-point.html',
        verifiedOn:'2026-09-14',
        supports:'Getting too close at contact is one common beginner challenge; a spacing activity can help a player explore body-ball distance.',
        boundary:'The article does not diagnose an individual miss or validate this two-group practice comparison.'
      },
      {
        id:'usta-stroke-consistency',
        publisher:'USTA Southern High School Subcommittee',
        title:'How to use the Stroke Consistency Table',
        url:'https://www.usta.com/content/dam/usta/sections/southern/pdf/USTA_Southern_HS_Coaches_Stroke_Consistency.pdf',
        verifiedOn:'2026-09-14',
        supports:'Partner or coach feeds, targets suited to ability, and recording attempts, makes and notes; the table includes groups of ten forehands.',
        boundary:'This is a stroke-consistency assessment resource, not validation that spacing caused errors or that a before-and-after difference proves improvement.'
      },
      {
        id:'bollettieri-adjustment-steps',
        publisher:'Tennisplayer',
        author:'Nick Bollettieri',
        title:'The Killer Forehand: Part 1',
        url:'https://old.tennisplayer.net/members/famouscoach/nick_bollet/nick_bollet_killer_forehand_part1_images/nick_bollet_killer_forehand_part1.html',
        verifiedOn:'2026-09-14',
        supports:'Adjustment steps refine balance and positioning for the hitting stance.',
        boundary:'This supports the movement principle, not a universal contact distance or this exact practice cue and protocol.'
      }
    ]
  });

  function nonempty(value) { return typeof value === 'string' && value.trim().length > 0; }

  // Structural fit does not grant coaching approval. The host must additionally
  // check that the exact lesson is eligible and the beta disclosure is shown.
  // An absent binding has no fallback or nearest-match destination.
  function audit(lesson, spine) {
    const errors = [];
    if (!lesson || lesson.id !== definition.lessonId) errors.push('Exact approved Contact lesson is unavailable.');
    if (!spine || spine.id !== definition.spineId || !lesson || lesson.lessonSpineId !== spine.id || spine.prototypeId !== definition.lessonId || spine.status !== 'prototype') errors.push('Exact built Contact spine binding is unavailable.');
    if (!spine || spine.mechanic !== 'fix_the_culprit' || spine.theme !== 'forehand' || spine.sharpenTarget !== 'forehand') errors.push('This check requires the forehand Fix the Culprit spine.');
    if (!spine || spine.courtExperimentId !== definition.id) errors.push('The canonical spine does not bind this exact court experiment.');
    if (!lesson || !spine || !nonempty(lesson.takeItToCourt) || lesson.takeItToCourt !== spine.tomorrowAction || !nonempty(lesson.memory) || lesson.memory !== spine.memory) errors.push('The canonical Contact observation cue or memory has drifted.');
    if (!lesson || !spine || !lesson.proInsight || !spine.proInsight || lesson.proInsight.status !== 'source_locked' || spine.proInsight.status !== 'source_locked') errors.push('The existing Contact lesson source is not approved.');
    const steps = lesson && lesson.steps;
    const modes = ['miss','fix','miss'];
    if (!Array.isArray(steps) || steps.length !== 3 || modes.some(function (mode, index) {
      const step = steps[index];
      const visual = step && step.visual, motion = visual && visual.motion;
      return !visual || visual.kind !== 'contact' || !motion || motion.stroke !== 'forehand' || motion.fault !== 'jammed' || motion.previewMode !== mode || !Number.isFinite(motion.contactFrame) || motion.contactFrame <= 0 || motion.contactFrame >= 1 || motion.contactFrame !== steps[0].visual.motion.contactFrame;
    })) errors.push('The canonical three-step forehand contact contrast is unavailable.');
    if (!spine || !spine.visualContract || spine.visualContract.kind !== 'contact' || !Array.isArray(spine.visualContract.mustShow) || !spine.visualContract.mustShow.includes('same-camera crowded versus usable space')) errors.push('The same-camera spacing evidence contract is unavailable.');
    return deepFreeze({ok:errors.length === 0,errors:errors,coachReview:definition.coachReview,coachApproved:false});
  }

  function validReport(report) {
    if (!report || typeof report !== 'object' || Array.isArray(report)) return false;
    const fields = ['beforeMisses','afterMisses','spacing','comparable'];
    if (!fields.every(function (field) { return Object.prototype.hasOwnProperty.call(report, field); })) return false;
    return Number.isInteger(report.beforeMisses) && report.beforeMisses >= 0 && report.beforeMisses <= 10 &&
      Number.isInteger(report.afterMisses) && report.afterMisses >= 0 && report.afterMisses <= 10 &&
      ['more-room','same','unsure'].includes(report.spacing) && typeof report.comparable === 'boolean';
  }

  function result(title, body, next) { return deepFreeze({title:title,body:body,next:next}); }

  function interpret(report) {
    if (!validReport(report)) return result(
      'Comparison incomplete',
      'We need both miss counts, your spacing observation and whether the groups were comparable.',
      'Only enter what you observed after trying both groups. There is no result to infer yet.'
    );
    if (!report.comparable) return result(
      'The comparison is inconclusive',
      'Different feeds, targets or intended hitting pace could explain a different miss count.',
      'If comfortable, repeat another day with similar conditions. Do not force extra room.'
    );
    if (report.beforeMisses === 0 && report.afterMisses > 0) return result(
      'The cue group introduced misses',
      'Your usual group had no misses; the cue group did. That is a cost to notice, not proof that the cue caused it or that spacing was your original problem.',
      'Do not force extra room. Return to a comfortable stroke and ask a coach to observe the conditions in which your usual misses occur.'
    );
    if (report.beforeMisses === 0) return result(
      'The misses did not show up first',
      'Your usual group had no net or out misses, so this comparison did not recreate the problem.',
      'Do not make the task harder just to produce errors. Observe when the problem returns and discuss that context with a coach.'
    );
    if (report.afterMisses < report.beforeMisses && report.spacing === 'more-room') return result(
      'A useful signal to recheck',
      'You reported fewer misses and more room in this brief practice. That does not establish the cause or predict match results.',
      'Repeat on another day under similar conditions before deciding whether to keep the cue. Comfortable room, not extra reach.'
    );
    if (report.afterMisses < report.beforeMisses) return result(
      'Fewer misses; the reason is unclear',
      'The miss count fell, but your observation does not connect that change to more usable space.',
      'Do not assume spacing was the cause. Recheck on another day or ask a coach to watch comparable forehands.'
    );
    return result(
      'No reduction in misses this time',
      'This comparison does not support using extra room as the answer to these misses.',
      'Do not force more distance or rebuild your swing. Reconsider the clue with a coach who can watch the problem occur.'
    );
  }

  return Object.freeze({definition:definition,audit:audit,interpret:interpret});
});
