/* GameSharp sound: tiny synthesised tennis sounds (no audio files).
   hit(v): the racquet "thock"; bounce(v): the ball's "pop" off the court; net(v): a dull cord thud.
   Browsers only allow sound after the player touches the page, so the context unlocks on the first tap or key.
   On by default; the player can mute (stored per browser in gs_sound). Built 5 Oct 2026 (Claude). */
(function(){
  const KEY = "gs_sound";
  let ctx = null, master = null, noiseBuf = null;
  const on = () => { try { return localStorage.getItem(KEY) !== "0"; } catch (e) { return true; } };
  function boot() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.55; master.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return ctx;
  }
  function unlock() { if (!on()) return; const c = boot(); if (c && c.state === "suspended") c.resume(); }
  ["pointerdown", "keydown", "touchstart"].forEach(e => window.addEventListener(e, unlock, { passive: true }));
  const ready = () => on() && ctx && ctx.state === "running";
  function noise(t, dur, freq, q, gain) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + dur + 0.02);
  }
  function tone(t, f0, f1, dur, gain, type) {
    const o = ctx.createOscillator(); o.type = type || "sine";
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  }
  const vol = v => Math.max(0.05, Math.min(1, v == null ? 1 : v));
  /* ---- premium voices (8 Oct, Eoin: "premium"): used when a lesson sets LESSON.premium (GSSfx.premium = true).
     Still synthesised (no audio files): a strike with a string ping and body, a soft grass bounce, a stadium
     echo, a quiet crowd bed and applause. Sounds sit left/right with the ball and drop away at the far end. */
  let verb = null, bed = null;
  function room() {   // a short stadium echo: decaying noise as an impulse response
    if (verb) return verb;
    const n = Math.floor(ctx.sampleRate * 1.4), ir = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3.2); }
    verb = ctx.createConvolver(); verb.buffer = ir; const wet = ctx.createGain(); wet.gain.value = 0.22;
    verb.connect(wet); wet.connect(master); return verb;
  }
  function out(pan, depth) {   // a voice's path: pan, distance (quieter, duller far away), dry + echo
    const pn = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
    if (pn.pan) pn.pan.value = Math.max(-1, Math.min(1, pan || 0)) * 0.75;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 9000 - 5500 * (depth || 0);
    const g = ctx.createGain(); g.gain.value = 1 - 0.45 * (depth || 0);
    pn.connect(lp); lp.connect(g); g.connect(master); g.connect(room()); return pn;
  }
  function nz(dst, t, dur, type, freq, q, gain, attack) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + (attack || 0.002));
    g.gain.exponentialRampToValueAtTime(0.0006, t + dur);
    s.connect(f); f.connect(g); g.connect(dst); s.start(t); s.stop(t + dur + 0.03);
  }
  function osc(dst, t, f0, f1, dur, gain, type) {
    const o = ctx.createOscillator(); o.type = type || "sine";
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0006, t + dur);
    o.connect(g); g.connect(dst); o.start(t); o.stop(t + dur + 0.03);
  }
  const PREM = {
    hit(v, pan, depth) { const t = ctx.currentTime, k = vol(v), o = out(pan, depth);
      nz(o, t, 0.012, "highpass", 3800, 0.7, 0.55 * k, 0.0008);          // the crack of the strings
      osc(o, t, 610, 520, 0.07, 0.30 * k, "triangle");                    // the string bed's ping
      osc(o, t, 190, 110, 0.06, 0.45 * k);                                // the body of the ball
      nz(o, t, 0.05, "bandpass", 1300, 1.6, 0.35 * k); },
    bounce(v, pan, depth) { const t = ctx.currentTime, k = vol(v) * 0.8, o = out(pan, depth);
      osc(o, t, 150, 85, 0.07, 0.42 * k);                                 // grass: a soft, low "thup"
      nz(o, t, 0.045, "lowpass", 700, 0.9, 0.38 * k); },
    net(v, pan, depth) { const t = ctx.currentTime, k = vol(v), o = out(pan, depth);
      osc(o, t, 120, 60, 0.2, 0.5 * k, "triangle"); nz(o, t, 0.16, "lowpass", 380, 0.8, 0.4 * k); }
  };
  function ambience(onOff) {   // a quiet crowd: soft, slow-moving noise, far below the play
    if (!ctx) return;
    if (!onOff) { if (bed) { bed.g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4); bed = null; } return; }
    if (bed) return;
    const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 520; f.Q.value = 0.55;
    const g = ctx.createGain(); g.gain.value = 0.0001; g.gain.setTargetAtTime(0.045, ctx.currentTime, 1.2);
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.13; lg.gain.value = 0.015;
    lfo.connect(lg); lg.connect(g.gain); s.connect(f); f.connect(g); g.connect(master); s.start(); lfo.start(); bed = { s, g };
  }
  function applause(k) {   // many single claps, swelling and dying away
    if (!k) return; const t0 = ctx.currentTime, n = Math.round(90 + 140 * k), dur = 1.6 + 1.4 * k;
    const g = ctx.createGain(); g.gain.value = 0.55 * k; g.connect(master); g.connect(room());
    for (let i = 0; i < n; i++) { const u = Math.random(), t = t0 + 0.08 + u * dur;
      const env = Math.min(1, u / 0.18) * Math.pow(1 - u, 1.6);
      const p = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain(); if (p.pan) p.pan.value = Math.random() * 1.6 - 0.8; p.connect(g);
      nz(p, t, 0.03 + Math.random() * 0.02, "bandpass", 1100 + Math.random() * 1700, 1.1, 0.05 + 0.1 * env * Math.random(), 0.001); }
  }
  window.GSSfx = {
    premium: false,
    ambience(onOff) { if (!ready()) return; ambience(onOff); },
    applause(k) { if (!ready()) return; applause(k); },
    hit(v, pan, depth) { if (!ready()) return; if (this.premium) return PREM.hit(v, pan, depth); const t = ctx.currentTime, k = vol(v);
      noise(t, 0.07, 1500, 1.4, 0.9 * k); tone(t, 260, 120, 0.09, 0.55 * k); noise(t, 0.025, 4200, 0.8, 0.35 * k); },
    bounce(v, pan, depth) { if (!ready()) return; if (this.premium) return PREM.bounce(v, pan, depth); const t = ctx.currentTime, k = vol(v);
      tone(t, 520, 150, 0.06, 0.7 * k); noise(t, 0.04, 900, 1.1, 0.5 * k); },
    net(v, pan, depth) { if (!ready()) return; if (this.premium) return PREM.net(v, pan, depth); const t = ctx.currentTime, k = vol(v);
      tone(t, 140, 70, 0.16, 0.6 * k, "triangle"); noise(t, 0.12, 300, 0.7, 0.4 * k); },
    enabled: on,
    ready,
    set(v) { try { localStorage.setItem(KEY, v ? "1" : "0"); } catch (e) {} if (v) unlock(); },
    unlock,
    /* a speaker toggle button: <button data-gs-sound></button> anywhere on the page */
    wire(root) {
      (root || document).querySelectorAll("[data-gs-sound]").forEach(b => {
        const paint = () => { const o = on(); b.setAttribute("aria-pressed", String(o)); b.setAttribute("aria-label", o ? "Sound on" : "Sound off");
          b.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/>${o ? '<path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/>' : '<path d="M17 9l5 6M22 9l-5 6"/>'}</svg>`; };
        paint(); b.onclick = e => { e.stopPropagation(); const o = !on(); window.GSSfx.set(o); paint(); if (o) setTimeout(() => window.GSSfx.bounce(0.8), 60); };
      });
    }
  };
})();
