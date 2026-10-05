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
  window.GSSfx = {
    hit(v) { if (!ready()) return; const t = ctx.currentTime, k = vol(v);
      noise(t, 0.07, 1500, 1.4, 0.9 * k); tone(t, 260, 120, 0.09, 0.55 * k); noise(t, 0.025, 4200, 0.8, 0.35 * k); },
    bounce(v) { if (!ready()) return; const t = ctx.currentTime, k = vol(v);
      tone(t, 520, 150, 0.06, 0.7 * k); noise(t, 0.04, 900, 1.1, 0.5 * k); },
    net(v) { if (!ready()) return; const t = ctx.currentTime, k = vol(v);
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
