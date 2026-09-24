(function (root, factory) {
  const spines = typeof module === 'object' && module.exports ? require('./gold-daily-lesson-spines.js') : root && root.GameSharpGoldLessonSpines;
  const api = factory(spines);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GameSharpGoldDailyLoop = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (spines) {
  'use strict';
  const VERSION = '2026-09-14.daily-loop.5';
  const KEY = 'gs_gold_daily_loop_v1';
  // Published calendar: stable IDs, independent of catalogue order and elapsed
  // hours (DST). The nine-day pilot repeats; this is not an infinite curriculum.
  const ORIGINAL_ORDER = Object.freeze([
    'gold_direction_change_v1', 'gold_serve_plus_one_v1',
    'gold_miss_two_points_v1', 'gold_return_position_v1',
    'gold_short_ball_attack_v1', 'gold_split_step_timing_v1',
    'gold_contact_point_v1', 'gold_recovery_position_v1',
    'gold_winner_wrong_shot_v1'
  ]);
  // Preserve the entire published first cycle, including tomorrow promises.
  // New schedules append an effective date; they never rewrite old bindings.
  const TWELVE_ORDER = Object.freeze([
    'gold_runaround_pattern_v1', ORIGINAL_ORDER[0], 'gold_middle_return_v1',
    ORIGINAL_ORDER[1], 'gold_future_space_v1', ...ORIGINAL_ORDER.slice(2)
  ]);
  const FIFTEEN_ORDER = Object.freeze(['gold_high_ball_v1',TWELVE_ORDER[0],'gold_approach_volley_v1',TWELVE_ORDER[1],'gold_serve_adaptation_v1',...TWELVE_ORDER.slice(2)]);
  const EIGHTEEN_ORDER = Object.freeze(['gold_protect_pattern_v1',FIFTEEN_ORDER[0],'gold_forehand_bill_v1',FIFTEEN_ORDER[1],'gold_close_then_balance_v1',...FIFTEEN_ORDER.slice(2)]);
  const ORDER = Object.freeze(['gold_return_time_v1',EIGHTEEN_ORDER[0],'gold_serve_quality_v1',EIGHTEEN_ORDER[1],'gold_pattern_clue_v1',...EIGHTEEN_ORDER.slice(2)]);
  const SCHEDULES = Object.freeze([
    Object.freeze({from:'2026-09-12',id:'nine-v1',order:ORIGINAL_ORDER}),
    Object.freeze({from:'2026-09-21',id:'twelve-v2',order:TWELVE_ORDER}),
    Object.freeze({from:'2026-10-03',id:'fifteen-v3',order:FIFTEEN_ORDER}),
    Object.freeze({from:'2026-10-18',id:'eighteen-v4',order:EIGHTEEN_ORDER}),
    Object.freeze({from:'2026-11-05',id:'twenty-one-v5',order:ORDER})
  ]);
  // Explicit editorial connections, not title/tag matching. Unlisted lessons
  // intentionally have no Predict substitute. Each route keeps its own scene.
  const CONNECTIONS = Object.freeze((spines && spines.spines || []).reduce(function (map, spine) {
    if (spine.status === 'prototype' && spine.dailyConnection) map[spine.prototypeId] = spine.dailyConnection;
    return map;
  }, {}));
  function dateKey(date) {
    const d = date || new Date();
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  }
  function ordinal(key) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key || '')) throw Error('Invalid calendar date');
    const parts = key.split('-').map(Number), value = Date.UTC(parts[0], parts[1] - 1, parts[2]);
    if (new Date(value).toISOString().slice(0, 10) !== key) throw Error('Invalid calendar date');
    return value / 86400000;
  }
  function lessonFor(key) {
    const day=ordinal(key), schedule=scheduleFor(key);
    const offset=day-ordinal(schedule.from), order=schedule.order;
    return order[((offset % order.length) + order.length) % order.length];
  }
  function scheduleFor(key) { ordinal(key); return SCHEDULES.filter(s=>s.from<=key).slice(-1)[0] || SCHEDULES[0]; }
  function calendarNote(key) { const id=scheduleFor(key).id;return id==='nine-v1' ? 'Your current nine-day cycle is unchanged. Twelve lessons rotate from 21 September.' : id==='twelve-v2' ? 'Your twelve-day cycle is unchanged. Fifteen lessons rotate from 3 October.' : id==='fifteen-v3' ? 'Your fifteen-day cycle is unchanged. Eighteen lessons rotate from 18 October.' : id==='eighteen-v4' ? 'Your eighteen-day cycle is unchanged. Twenty-one lessons rotate from 5 November.' : 'Twenty-one lessons rotate every twenty-one days. Earlier lesson dates stay unchanged.'; }
  function nextDate(key) { return new Date((ordinal(key) + 1) * 86400000).toISOString().slice(0, 10); }
  function connection(id, integration) {
    const c = CONNECTIONS[id];
    if (!c || !integration || !integration.isLaunchEligible(c.sequenceId)) return null;
    const actual = integration.connection(c.sequenceId);
    return actual && actual.livePointId === c.livePointId && actual.playbookId === c.playbookId ? c : null;
  }
  function createStore(storage) {
    let memory = { days: {} }, persistent = true;
    function valid(record, key) {
      try {
        return record && record.lessonId === lessonFor(key) && Array.isArray(record.answers) && record.answers.length <= 3 &&
          record.answers.every(n => Number.isInteger(n) && n >= 0 && n < 4) &&
          Number.isInteger(record.step) && record.step >= 0 && record.step <= 2 &&
          record.answers.length >= record.step && record.answers.length <= record.step + 1 &&
          typeof record.complete === 'boolean' && (!record.complete || (record.step === 2 && record.answers.length === 3));
      } catch (_) { return false; }
    }
    function read() {
      if (!persistent) return memory;
      try {
        const raw = storage.getItem(KEY);
        const parsed = raw ? JSON.parse(raw) : { days: {} };
        if (!parsed || !parsed.days || typeof parsed.days !== 'object') throw Error('Invalid saved progress');
        const days = {};
        Object.keys(parsed.days).sort().slice(-90).forEach(key => { if (valid(parsed.days[key], key)) days[key] = parsed.days[key]; });
        memory = { days };
      } catch (_) { persistent = false; }
      return memory;
    }
    function get(key) { const record = read().days[key]; return record ? JSON.parse(JSON.stringify(record)) : null; }
    function save(key, record) {
      if (!valid(record, key)) throw Error('Invalid daily checkpoint');
      const data = read(), previous = data.days[key];
      // First answers and completed result are immutable, including another tab.
      if (previous && (previous.complete || previous.answers.length > record.answers.length || previous.step > record.step || previous.answers.some((n, i) => n !== record.answers[i]))) return get(key);
      data.days[key] = JSON.parse(JSON.stringify(record));
      const keys = Object.keys(data.days).sort();
      keys.slice(0, Math.max(0, keys.length - 90)).forEach(k => delete data.days[k]);
      memory = data;
      try { if (persistent) storage.setItem(KEY, JSON.stringify(data)); } catch (_) { persistent = false; }
      return get(key);
    }
    function completed() { return Object.entries(read().days).filter(([, r]) => r.complete).map(([date, record]) => ({ date, ...record })).sort((a, b) => b.date.localeCompare(a.date)); }
    return { get, save, completed, persistent: function () { read(); return persistent; } };
  }
  return Object.freeze({ version: VERSION, key: KEY, order: ORDER, schedules:SCHEDULES, scheduleFor, calendarNote, connections: CONNECTIONS, dateKey, lessonFor, nextDate, connection, createStore });
});
