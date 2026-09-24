(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GameSharpSharpenPaths = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Concern routing only. The canonical lesson owns its title, visual, teaching,
  // source and court cue. A concern is an invitation, not a stroke diagnosis.
  const paths = [
    {id:'mindset_after_miss',region:'mindset',label:'One miss changes my next point',invitation:'Watch how a wide miss changes the target on the next neutral forehand.',lessonId:'gold_miss_two_points_v1',previewStep:0},
    {id:'mindset_protecting_lead',region:'mindset',label:'I play smaller when I lead',invitation:'Compare the rally ball that built a lead with the one chosen while protecting it.',lessonId:'gold_protect_pattern_v1',previewStep:0},
    {id:'forehand_crowded_contact',region:'forehand',label:'Contact feels crowded',invitation:'Freeze a forehand at contact and compare the visible space around the ball.',lessonId:'gold_contact_point_v1',previewStep:0,limits:'A forehand spacing observation, not a diagnosis of your stroke.'},
    {id:'forehand_high_bounce',region:'forehand',label:'High bounces push me backwards',invitation:'Compare a short, slower bounce with a deeper one before deciding where to meet each.',lessonId:'gold_high_ball_v1',previewStep:0,limits:'Forehand contact height and depth; not a backhand mechanics lesson.'},
    {id:'forehand_runaround_exposure',region:'forehand',label:'My runaround forehand leaves court exposed',invitation:'Watch the replies and recovery distance left by a runaround forehand.',lessonId:'gold_forehand_bill_v1',previewStep:0},
    {id:'backhand_stretched_line',region:'backhand',label:'I force the line from stretched backhands',invitation:'Watch a low ball pull you wide on the backhand before you choose the line.',lessonId:'gold_direction_change_v1',previewStep:0},
    {id:'backhand_runaround_choice',region:'backhand',label:'I keep running around my backhand',invitation:'Watch the slower backhand-side reply created by a slice, with time to use a stronger forehand.',lessonId:'gold_runaround_pattern_v1',previewStep:0,limits:'A choice around the backhand, not a repair to backhand technique.'},
    {id:'serve_return_crowded',region:'serve_return',label:'Fast serves crowd my return',invitation:'Compare a crowded return against a fast body serve with a deeper starting position.',lessonId:'gold_return_position_v1',previewStep:0},
    {id:'serve_return_second_serve',region:'serve_return',label:'My second serve invites an attack',invitation:'Compare two legal second serves by where the receiver meets them.',lessonId:'gold_serve_quality_v1',previewStep:0,limits:'Receiving contact, not a double-fault or serving-mechanics diagnosis.'},
    {id:'serve_return_first_ball',region:'serve_return',label:'I waste the ball after serving',invitation:'Watch the replies your wide serve produces before choosing your next ball.',lessonId:'gold_serve_plus_one_v1',previewStep:0},
    {id:'net_short_ball_choice',region:'net',label:'I attack the short ball too soon',invitation:'Compare a low, stretched short ball with one you can reach balanced.',lessonId:'gold_short_ball_attack_v1',previewStep:0},
    {id:'net_first_volley',region:'net',label:'My approach leaves a difficult first volley',invitation:'Follow a balanced short-ball approach through to the first volley it creates.',lessonId:'gold_approach_volley_v1',previewStep:0,limits:'Approach construction, not a diagnosis of your volley mechanics.'},
    {id:'net_moving_at_pass',region:'net',label:'I’m still moving when they pass',invitation:'Watch your feet at the opponent’s contact after a deep approach.',lessonId:'gold_close_then_balance_v1',previewStep:0},
    {id:'movement_recovery_default',region:'movement',label:'I recover to the centre automatically',invitation:'Watch the reply options after your deep crosscourt forehand pulls the opponent wide.',lessonId:'gold_recovery_position_v1',previewStep:0},
    {id:'movement_split_timing',region:'movement',label:'My split step leaves me late',invitation:'Compare the timing of your landing, their contact and your first move.',lessonId:'gold_split_step_timing_v1',previewStep:0},
    {id:'movement_runaround_recovery',region:'movement',label:'My runaround forehand leaves court exposed',invitation:'Follow the court you must cover after running around a backhand-side ball.',lessonId:'gold_forehand_bill_v1',previewStep:0},
    {id:'decisions_short_ball',region:'decisions',label:'I attack the short ball too soon',invitation:'Watch how height, balance and the opponent’s position change the short-ball decision.',lessonId:'gold_short_ball_attack_v1',previewStep:0},
    {id:'decisions_open_court',region:'decisions',label:'I chase the open court',invitation:'Watch the defender’s recovery direction as you reach a comfortable short forehand.',lessonId:'gold_future_space_v1',previewStep:0},
    {id:'decisions_surprise_reply',region:'decisions',label:'One surprise reply changes my whole plan',invitation:'Compare the contact conditions behind a surprising lob before treating it as a reliable pattern.',lessonId:'gold_pattern_clue_v1',previewStep:0}
  ];

  const regions = [
    {id:'mindset',label:'Mental Game'},
    {id:'forehand',label:'Forehand'},
    {id:'backhand',label:'Backhand'},
    {id:'serve_return',label:'Serve & Return'},
    {id:'net',label:'Net Play'},
    {id:'movement',label:'Movement'},
    {id:'decisions',label:'Decision Making'}
  ].map(function (region) {
    return Object.assign({}, region, {pathIds:paths.filter(function (path) { return path.region === region.id; }).map(function (path) { return path.id; })});
  });

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }
  function words(value) { return String(value || '').trim().split(/\s+/).filter(Boolean).length; }
  function list(value, key) { return Array.isArray(value) ? value : value && Array.isArray(value[key]) ? value[key] : []; }

  // Call with the host's approved lesson collection. Presence in a legacy bank
  // or a research spine never makes a path eligible; failures have no substitute.
  function audit(lessons, spineCollection) {
    const lessonList = list(lessons, 'challenges');
    const spineList = list(spineCollection, 'spines');
    const errors = [], ids = new Set(), regionIds = new Set(regions.map(function (region) { return region.id; }));
    const lessonMap = new Map(), spineMap = new Map();
    lessonList.forEach(function (lesson) {
      if (!lesson || !lesson.id || lessonMap.has(lesson.id)) errors.push('Approved lessons contain a missing or duplicate ID.');
      else lessonMap.set(lesson.id, lesson);
    });
    spineList.forEach(function (spine) {
      if (!spine || !spine.id || spineMap.has(spine.id)) errors.push('Spines contain a missing or duplicate ID.');
      else spineMap.set(spine.id, spine);
    });
    paths.forEach(function (path) {
      const prefix = path.id || 'unknown_path';
      if (!path.id || ids.has(path.id)) errors.push(prefix + ': missing or duplicate path ID.');
      ids.add(path.id);
      if (!regionIds.has(path.region)) errors.push(prefix + ': unknown player area.');
      if (!words(path.label) || words(path.label) > 8) errors.push(prefix + ': concern label must contain 1–8 words.');
      if (!words(path.invitation) || words(path.invitation) > 18) errors.push(prefix + ': invitation must contain 1–18 words.');
      if (path.previewStep !== 0) errors.push(prefix + ': preview must use the original first decision.');
      const allowed = ['id','region','label','invitation','lessonId','previewStep','limits'];
      if (Object.keys(path).some(function (key) { return allowed.indexOf(key) === -1; })) errors.push(prefix + ': path duplicates lesson content or routing.');
      const lesson = lessonMap.get(path.lessonId);
      if (!lesson) { errors.push(prefix + ': exact approved lesson unavailable: ' + path.lessonId + '.'); return; }
      const spine = spineMap.get(lesson.lessonSpineId);
      if (!spine || spine.status !== 'prototype' || spine.prototypeId !== lesson.id) errors.push(prefix + ': missing exact built-spine binding.');
      if (!Array.isArray(lesson.steps) || lesson.steps.length !== 3 || !lesson.steps[0] || !lesson.steps[0].visual || !lesson.steps[0].visual.kind) errors.push(prefix + ': canonical three-decision evidence unavailable.');
      if (!lesson.title || !lesson.takeItToCourt) errors.push(prefix + ': canonical title or court cue unavailable.');
      if (spine && lesson.takeItToCourt !== spine.tomorrowAction) errors.push(prefix + ': court cue has drifted from the canonical spine.');
      if (spine && (!spine.proInsight || spine.proInsight.status !== 'source_locked')) errors.push(prefix + ': lesson source remains unapproved.');
      if (lesson.id === 'gold_contact_point_v1' && path.region !== 'forehand') errors.push(prefix + ': forehand Contact cannot diagnose another stroke.');
    });
    regions.forEach(function (region) {
      const local = paths.filter(function (path) { return path.region === region.id; });
      if (local.length < 1 || local.length > 3) errors.push(region.id + ': needs 1–3 supported concerns, not filler.');
      if (new Set(local.map(function (path) { return path.lessonId; })).size !== local.length) errors.push(region.id + ': repeated destination within one area.');
      if (region.pathIds.join('|') !== local.map(function (path) { return path.id; }).join('|')) errors.push(region.id + ': path order does not match its collection.');
    });
    return deepFreeze({ok:errors.length === 0,errors:errors,counts:{regions:regions.length,paths:paths.length,lessons:new Set(paths.map(function (path) { return path.lessonId; })).size}});
  }

  deepFreeze(paths);
  deepFreeze(regions);
  const byId = Object.create(null);
  paths.forEach(function (path) { byId[path.id] = path; });
  return Object.freeze({version:'2026-09-14.sharpen-paths.1',regions:regions,paths:paths,byId:Object.freeze(byId),audit:audit});
});
