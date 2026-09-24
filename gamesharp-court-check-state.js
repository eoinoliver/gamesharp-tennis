(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GameSharpCourtCheckState = api;
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  const key = 'gamesharp_court_checks_v1';
  const own = (value, name) => Object.prototype.hasOwnProperty.call(value, name);
  const record = value => !!value && typeof value === 'object' && !Array.isArray(value);
  const reserved = new Set(['__proto__', 'prototype', 'constructor', 'experimentId', 'lessonId', 'definitionVersion', 'plannedAt', 'reportedAt']);
  const empty = () => ({version:1, experiments:Object.create(null)});
  const identity = value => typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(value) && !reserved.has(value);

  function validAt(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)) return false;
    const time = Date.parse(value);
    if (!Number.isFinite(time)) return false;
    const expected = value.includes('.') ? value.replace(/\.(\d{1,3})Z$/, (_, digits) => '.' + digits.padEnd(3, '0') + 'Z') : value.replace(/Z$/, '.000Z');
    return new Date(time).toISOString() === expected;
  }

  // Copy data, not object behaviour. Validators only see the caller's own,
  // serializable primitive fields and cannot rewrite what will be persisted.
  function copyPayload(value, stored) {
    if (!record(value)) return null;
    const result = {};
    try {
      for (const name of Reflect.ownKeys(value)) {
        if (stored && name === 'reportedAt') continue;
        if (typeof name !== 'string' || reserved.has(name)) return null;
        const descriptor = Object.getOwnPropertyDescriptor(value, name);
        if (!descriptor || !descriptor.enumerable || !own(descriptor, 'value')) return null;
        const field = descriptor.value;
        if (field !== null && typeof field !== 'string' && typeof field !== 'boolean' && !(typeof field === 'number' && Number.isFinite(field))) return null;
        result[name] = field;
      }
    } catch (error) { return null; }
    return Object.freeze(result);
  }

  function createStore(storage, definitions, validateReport) {
    const allowed = new Map(), duplicated = new Set();
    if (Array.isArray(definitions)) for (const value of definitions) {
      if (!record(value) || !['id', 'version', 'lessonId'].every(name => own(value, name)) || !identity(value.id) || !identity(value.lessonId) || !Number.isSafeInteger(value.version) || value.version < 1) continue;
      if (allowed.has(value.id) || duplicated.has(value.id)) { allowed.delete(value.id); duplicated.add(value.id); continue; }
      allowed.set(value.id, Object.freeze({id:value.id, version:value.version, lessonId:value.lessonId}));
    }
    let memory = empty(), persistent = true;
    const definition = id => typeof id === 'string' ? allowed.get(id) : undefined;
    function validPayload(id, payload) {
      if (!payload || typeof validateReport !== 'function') return false;
      try { return validateReport(id, payload) === true; }
      catch (error) { return false; }
    }
    function cleanExperiment(value, d) {
      if (!record(value) || !['experimentId', 'lessonId', 'definitionVersion', 'plannedAt'].every(name => own(value, name)) || value.experimentId !== d.id || value.lessonId !== d.lessonId || value.definitionVersion !== d.version || !validAt(value.plannedAt)) return null;
      let report = null;
      if (own(value, 'report') && record(value.report) && own(value.report, 'reportedAt') && validAt(value.report.reportedAt) && Date.parse(value.report.reportedAt) >= Date.parse(value.plannedAt)) {
        const payload = copyPayload(value.report, true);
        if (validPayload(d.id, payload)) report = {...payload, reportedAt:value.report.reportedAt};
      }
      return {experimentId:d.id, lessonId:d.lessonId, definitionVersion:d.version, plannedAt:value.plannedAt, report:report};
    }
    function clean(value) {
      const result = empty();
      if (!record(value) || !own(value, 'version') || value.version !== 1 || !own(value, 'experiments') || !record(value.experiments)) return result;
      // A damaged or obsolete record cannot discard another valid experiment.
      for (const [id, d] of allowed) if (own(value.experiments, id)) {
        const experiment = cleanExperiment(value.experiments[id], d);
        if (experiment) result.experiments[id] = experiment;
      }
      return result;
    }
    function snapshot(id) {
      const value = own(memory.experiments, id) ? memory.experiments[id] : null;
      return Object.freeze({version:1, experiment:value ? Object.freeze({
        experimentId:value.experimentId, lessonId:value.lessonId, definitionVersion:value.definitionVersion,
        plannedAt:value.plannedAt, report:value.report ? Object.freeze({...value.report}) : null
      }) : null});
    }
    function refresh() {
      // Once access fails, disk must never overwrite this visit's newer state.
      if (!persistent) return;
      let raw;
      try { raw = storage.getItem(key); }
      catch (error) { persistent = false; return; }
      try { memory = raw ? clean(JSON.parse(raw)) : empty(); }
      catch (error) { memory = empty(); }
    }
    function write() {
      if (persistent) {
        try { storage.setItem(key, JSON.stringify(memory)); }
        catch (error) { persistent = false; }
      }
    }
    function read(id) {
      if (!definition(id)) return Object.freeze({version:1, experiment:null});
      refresh();
      return snapshot(id);
    }
    return Object.freeze({
      key:key, read:read, persistent:() => persistent,
      plan(id, at) {
        const d = definition(id);
        if (!d) return Object.freeze({version:1, experiment:null});
        refresh();
        if (!validAt(at) || own(memory.experiments, id)) return snapshot(id);
        memory.experiments[id] = {experimentId:id, lessonId:d.lessonId, definitionVersion:d.version, plannedAt:at, report:null};
        write();
        return snapshot(id);
      },
      report(id, value, at) {
        if (!definition(id)) return false;
        const payload = copyPayload(value, false);
        if (!validPayload(id, payload) || !validAt(at)) return false;
        refresh();
        const experiment = memory.experiments[id];
        if (!experiment || experiment.report || Date.parse(at) < Date.parse(experiment.plannedAt)) return false;
        experiment.report = {...payload, reportedAt:at};
        write();
        return true;
      }
    });
  }
  return Object.freeze({key:key, createStore:createStore});
});
