(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GameSharpForehandCheckState = api;
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  const key = 'gamesharp_forehand_check_v1';
  const experimentId = 'forehand-space-check-v1';
  const lessonId = 'gold_contact_point_v1';
  const spacingValues = ['more-room', 'same', 'unsure'];
  const empty = () => ({version:1, experiment:null});
  const record = value => !!value && typeof value === 'object' && !Array.isArray(value);
  const own = (value, name) => Object.prototype.hasOwnProperty.call(value, name);
  const misses = value => Number.isInteger(value) && value >= 0 && value <= 10;

  function validAt(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)) return false;
    const time = Date.parse(value);
    if (!Number.isFinite(time)) return false;
    const expected = value.includes('.') ? value.replace(/\.(\d{1,3})Z$/, (_, digits) => '.' + digits.padEnd(3, '0') + 'Z') : value.replace(/Z$/, '.000Z');
    return new Date(time).toISOString() === expected;
  }
  function validPayload(value) {
    return record(value) && ['beforeMisses', 'afterMisses', 'spacing', 'comparable'].every(name => own(value, name)) &&
      misses(value.beforeMisses) && misses(value.afterMisses) &&
      spacingValues.includes(value.spacing) && typeof value.comparable === 'boolean';
  }
  function cleanReport(value, plannedAt) {
    if (!validPayload(value) || !validAt(value.reportedAt) || Date.parse(value.reportedAt) < Date.parse(plannedAt)) return null;
    return {
      beforeMisses:value.beforeMisses, afterMisses:value.afterMisses,
      spacing:value.spacing, comparable:value.comparable, reportedAt:value.reportedAt
    };
  }
  function clean(value) {
    if (!record(value) || value.version !== 1) return empty();
    const experiment = value.experiment;
    if (!record(experiment) || experiment.experimentId !== experimentId || experiment.lessonId !== lessonId || !validAt(experiment.plannedAt)) return empty();
    return {version:1, experiment:{
      experimentId:experimentId, lessonId:lessonId, plannedAt:experiment.plannedAt,
      report:cleanReport(experiment.report, experiment.plannedAt)
    }};
  }
  const snapshot = value => ({version:1, experiment:value.experiment ? {
    experimentId:experimentId, lessonId:lessonId, plannedAt:value.experiment.plannedAt,
    report:value.experiment.report ? {...value.experiment.report} : null
  } : null});

  function createStore(storage) {
    let memory = empty(), persistent = true;
    function read() {
      // Once access fails, do not reload stale disk over this visit's new record.
      if (!persistent) return snapshot(memory);
      let raw;
      try { raw = storage.getItem(key); }
      catch (error) { persistent = false; return snapshot(memory); }
      try { memory = raw ? clean(JSON.parse(raw)) : empty(); }
      catch (error) { memory = empty(); }
      return snapshot(memory);
    }
    function write(value) {
      memory = clean(value);
      if (persistent) {
        try { storage.setItem(key, JSON.stringify(memory)); }
        catch (error) { persistent = false; }
      }
      return snapshot(memory);
    }
    return Object.freeze({
      key:key, read:read, persistent:() => persistent,
      plan(at) {
        const value = read();
        if (!validAt(at) || value.experiment) return value;
        return write({version:1, experiment:{experimentId:experimentId, lessonId:lessonId, plannedAt:at, report:null}});
      },
      report(payload, at) {
        const value = read();
        if (!value.experiment || value.experiment.report || !validPayload(payload) || !validAt(at) || Date.parse(at) < Date.parse(value.experiment.plannedAt)) return false;
        value.experiment.report = {
          beforeMisses:payload.beforeMisses, afterMisses:payload.afterMisses,
          spacing:payload.spacing, comparable:payload.comparable, reportedAt:at
        };
        write(value);
        return true;
      }
    });
  }
  return Object.freeze({key:key, createStore:createStore});
});
