(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GameSharpSharpenState = api;
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  const key = 'gamesharp_sharpen_v2';
  const feedbackValues = ['clearer', 'mixed', 'unclear'];
  const empty = () => ({version:2, focus:null, seen:{}});
  const record = value => !!value && typeof value === 'object' && !Array.isArray(value);

  // Eligibility belongs to the UI's approved registry, not this generic store.
  function validId(value) {
    return typeof value === 'string' && value.length > 0 && value.length <= 200 &&
      value.trim() === value && !/[\u0000-\u001f\u007f]/.test(value) &&
      !['__proto__','prototype','constructor'].includes(value);
  }
  function validAt(value) {
    if (typeof value !== 'string') return false;
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (!dateOnly && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)) return false;
    const time = Date.parse(dateOnly ? value + 'T00:00:00.000Z' : value);
    if (!Number.isFinite(time)) return false;
    const normalized = new Date(time).toISOString();
    if (dateOnly) return normalized.slice(0,10) === value;
    const expected = value.includes('.') ? value.replace(/\.(\d{1,3})Z$/, (_, digits) => '.' + digits.padEnd(3,'0') + 'Z') : value.replace(/Z$/, '.000Z');
    return normalized === expected;
  }
  function cleanFocus(value) {
    if (!record(value) || !validId(value.lessonId) || !validId(value.region) || !validAt(value.savedAt)) return null;
    if (value.pathId != null && !validId(value.pathId)) return null;
    const practicedAt = validAt(value.practicedAt) && Date.parse(value.practicedAt) >= Date.parse(value.savedAt) ? value.practicedAt : null;
    return {
      lessonId:value.lessonId, region:value.region, pathId:value.pathId || null,
      savedAt:value.savedAt, practicedAt:practicedAt,
      feedback:practicedAt && feedbackValues.includes(value.feedback) ? value.feedback : null
    };
  }
  function clean(value) {
    if (!record(value) || value.version !== 2) return empty();
    const seen = {};
    if (record(value.seen)) Object.keys(value.seen).forEach(id => {
      if (validId(id) && validAt(value.seen[id])) seen[id] = value.seen[id];
    });
    return {version:2, focus:cleanFocus(value.focus), seen:seen};
  }
  const snapshot = value => ({version:2, focus:value.focus ? {...value.focus} : null, seen:{...value.seen}});

  function createStore(storage) {
    let memory = empty(), persistent = true;
    function read() {
      // After any access/write failure, memory is authoritative for this instance.
      // A successful getItem after a quota failure must not restore stale disk.
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
      recordSeen(lessonId, at) {
        const value = read();
        if (!validId(lessonId) || !validAt(at) || Object.prototype.hasOwnProperty.call(value.seen, lessonId)) return value;
        value.seen[lessonId] = at;
        return write(value);
      },
      saveFocus(focus, at) {
        const value = read();
        if (!record(focus) || !validId(focus.lessonId) || !validId(focus.region) || !validAt(at) || (focus.pathId != null && !validId(focus.pathId))) return value;
        if (value.focus && value.focus.lessonId === focus.lessonId && value.focus.region === focus.region) return value;
        return write({...value, focus:{lessonId:focus.lessonId, region:focus.region, pathId:focus.pathId || null, savedAt:at, practicedAt:null, feedback:null}});
      },
      markPracticed(lessonId, at) {
        const value = read();
        if (!validId(lessonId) || !validAt(at) || !value.focus || value.focus.lessonId !== lessonId || Date.parse(at) < Date.parse(value.focus.savedAt)) return false;
        if (!value.focus.practicedAt) { value.focus.practicedAt = at; write(value); }
        return true;
      },
      feedback(lessonId, feedback) {
        const value = read();
        if (!validId(lessonId) || !value.focus || value.focus.lessonId !== lessonId || !value.focus.practicedAt || !feedbackValues.includes(feedback)) return false;
        if (value.focus.feedback !== feedback) { value.focus.feedback = feedback; write(value); }
        return true;
      }
    });
  }
  return Object.freeze({key:key, createStore:createStore});
});
