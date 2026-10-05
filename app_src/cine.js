/* GameSharp Home: a cinematic court under the lights. A rally plays on its own: the ball crosses the net,
   pops off the court (with sound once the player has touched the page and sound is on), leaves a trail and a
   shadow, and every third shot time slows at the bounce: "see clearer". Canvas 2D, no assets, ~60 fps,
   paused when the tab is hidden; a single still frame under prefers-reduced-motion. Built 5 Oct 2026 (Claude). */
(function(){
const HALF_W = 4.115, DBL_W = 5.485, BASE = 11.885, SVC = 6.40, NET_C = 0.914, NET_P = 1.07;
function GSCine(canvas) {
  const g = canvas.getContext("2d"); let W = 0, H = 0, dpr = 1, raf = 0, last = 0, clock = 0, alive = true;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // camera: elevated, behind your baseline, looking down the court (court y: near < 0 < far)
  let cam;
  function setCam() {
    const narrow = W / H < 0.8;
    cam = { y: narrow ? -17 : -21, z: narrow ? 14 : 7.2, ty: narrow ? 1.5 : 2.4, tz: 0, f: narrow ? 1.28 * W : Math.min(1.25 * H, 0.95 * W), cx: W / 2, cy: H * (narrow ? 0.43 : 0.46) };
    const dy = cam.ty - cam.y, dz = cam.tz - cam.z, L = Math.hypot(dy, dz); cam.c = dy / L; cam.s = -dz / L;
  }
  function P(x, y, z) {   // world -> screen
    const ry = y - cam.y, rz = z - cam.z, depth = ry * cam.c - rz * cam.s, up = ry * cam.s + rz * cam.c;
    if (depth < 0.5) return null; const k = cam.f / depth; return [cam.cx + x * k, cam.cy - up * k, k];
  }
  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1); const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height); canvas.width = W * dpr; canvas.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); setCam();
  }
  // ---- the rally: shots alternate far -> near, near -> far. Each: hit point, landing point, flight time, apex
  const SHOTS = [];
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function nextShot(prev) {
    const fromFar = prev ? !prev.fromFar : true, sgn = fromFar ? -1 : 1;
    const hit = prev ? [prev.end[0], prev.end[1], 1.0] : [rnd(-2.5, 2.5), BASE + 0.8, 1.0];
    const land = [rnd(-3.2, 3.2), sgn * rnd(7.6, 10.6), 0.033];
    const T = rnd(0.95, 1.2), apex = rnd(2.1, 2.9);
    // after the bounce the ball rises and is met near the baseline
    const end = [land[0] + (land[0] - hit[0]) * 0.32, sgn * (BASE + rnd(0.3, 1.4)), 1.0];
    return { fromFar, hit, land, end, T, T2: rnd(0.42, 0.55), apex, slow: false };
  }
  function shotPos(s, u) {   // u in [0, T+T2]
    if (u <= s.T) { const k = u / s.T, x = s.hit[0] + (s.land[0] - s.hit[0]) * k, y = s.hit[1] + (s.land[1] - s.hit[1]) * Math.pow(k, 0.92);
      const base = s.hit[2] * (1 - k) + s.land[2] * k, z = base + 4 * (s.apex - Math.max(s.hit[2], 0.5) * 0.45) * k * (1 - k) * (1 - 0.18 * k);
      return [x, y, Math.max(0.033, z)]; }
    const k = (u - s.T) / s.T2, x = s.land[0] + (s.end[0] - s.land[0]) * k, y = s.land[1] + (s.end[1] - s.land[1]) * k;
    const z = 0.033 + (s.end[2] - 0.033) * k + 2.2 * k * (1 - k);
    return [x, y, z];
  }
  let shot = nextShot(null), u = 0, count = 0, trail = [], rings = [], flashes = [];
  let heard = 0;   // Home is a moment, not a soundtrack: the first few shots after the player taps, then silence
  const sfx = (k, v) => { try { if (!window.GSSfx || heard >= 6) return; const before = window.GSSfx.ready() ? 1 : 0; window.GSSfx[k](v * (1 - heard / 8)); if (before) heard++; } catch (e) {} };
  function step(dt) {
    // slow motion window around the bounce on every third shot
    const nearBounce = shot.slow && Math.abs(u - shot.T) < 0.22;
    const speed = nearBounce ? 0.22 : 1;
    const prevU = u; u += dt * speed;
    if (prevU < shot.T && u >= shot.T) {   // bounce
      rings.push({ x: shot.land[0], y: shot.land[1], t: 0 }); sfx("bounce", shot.land[1] < 0 ? 0.95 : 0.45);
    }
    if (u >= shot.T + shot.T2) {   // the reply is struck
      flashes.push({ p: shot.end.slice(), t: 0 }); sfx("hit", shot.end[1] < 0 ? 0.9 : 0.4);
      count++; shot = nextShot(shot); shot.slow = count % 3 === 2 && shot.land[1] < 0; u = 0;
    }
    const p = shotPos(shot, u); trail.push(p); if (trail.length > 16) trail.shift();
    rings.forEach(r => r.t += dt); rings = rings.filter(r => r.t < 0.9);
    flashes.forEach(f => f.t += dt); flashes = flashes.filter(f => f.t < 0.35);
    clock += dt;
  }
  // ---- drawing
  function poly(pts, fill, stroke, lw) { const q = pts.map(p => P(...p)); if (q.some(v => !v)) return;
    g.beginPath(); q.forEach((v, i) => i ? g.lineTo(v[0], v[1]) : g.moveTo(v[0], v[1])); g.closePath();
    if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw || 1; g.stroke(); } }
  function line(a, b, col, lw) { const p = P(...a), q = P(...b); if (!p || !q) return; g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.strokeStyle = col; g.lineWidth = lw; g.stroke(); }
  function draw() {
    // night sky and stadium glow
    const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#030806"); sky.addColorStop(0.45, "#071a0d"); sky.addColorStop(1, "#04100a");
    g.fillStyle = sky; g.fillRect(0, 0, W, H);
    for (const sx of [0.12, 0.88]) { const r = g.createRadialGradient(W * sx, H * 0.02, 0, W * sx, H * 0.02, H * 0.75);
      r.addColorStop(0, "rgba(255,246,214,.20)"); r.addColorStop(0.35, "rgba(200,220,160,.06)"); r.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = r; g.fillRect(0, 0, W, H); }
    // surround and court
    { const a = P(0, -BASE - 7, 0), z = P(0, BASE + 9, 0); const sg = g.createLinearGradient(0, a ? a[1] : H, 0, z ? z[1] : 0);
      sg.addColorStop(0, "#0e3d1c"); sg.addColorStop(0.75, "#0b3016"); sg.addColorStop(1, "rgba(8,26,13,0)");
      poly([[-30, -BASE - 7, 0], [30, -BASE - 7, 0], [30, BASE + 9, 0], [-30, BASE + 9, 0]], sg); }
    const court = P(0, 0, 0); const cg = g.createRadialGradient(court[0], court[1], 0, court[0], court[1], H * 0.9);
    cg.addColorStop(0, "#2b7a37"); cg.addColorStop(1, "#18521f");
    poly([[-DBL_W, -BASE, 0], [DBL_W, -BASE, 0], [DBL_W, BASE, 0], [-DBL_W, BASE, 0]], cg);
    for (const [px, py] of [[-6, -9], [6, -9], [-6, 9], [6, 9]]) { const c = P(px, py, 0); if (!c) continue;
      const r = g.createRadialGradient(c[0], c[1], 0, c[0], c[1], 9 * c[2]); r.addColorStop(0, "rgba(255,250,215,.10)"); r.addColorStop(1, "rgba(255,250,215,0)");
      g.fillStyle = r; g.fillRect(0, 0, W, H); }
    const L = "rgba(240,244,232,.86)", lw = Math.max(1, W / 420);
    for (const x of [-DBL_W, -HALF_W, HALF_W, DBL_W]) line([x, -BASE, 0], [x, BASE, 0], L, lw);
    for (const y of [-BASE, BASE]) line([-DBL_W, y, 0], [DBL_W, y, 0], L, lw * 1.4);
    for (const y of [-SVC, SVC]) line([-HALF_W, y, 0], [HALF_W, y, 0], L, lw);
    line([0, -SVC, 0], [0, SVC, 0], L, lw);
    // shadow of the ball
    const b = trail[trail.length - 1];
    if (b) { const s = P(b[0], b[1], 0.005); if (s) { const a = Math.max(0.08, 0.42 - b[2] * 0.12); g.fillStyle = `rgba(0,0,0,${a})`;
      g.beginPath(); g.ellipse(s[0], s[1], 0.09 * s[2], 0.035 * s[2], 0, 0, 7); g.fill(); } }
    // bounce rings
    for (const r of rings) { const c = P(r.x, r.y, 0.01); if (!c) continue; const k = r.t / 0.9;
      g.strokeStyle = `rgba(211,226,103,${0.55 * (1 - k)})`; g.lineWidth = 1.5; g.beginPath(); g.ellipse(c[0], c[1], (0.1 + 0.9 * k) * c[2], (0.035 + 0.3 * k) * c[2], 0, 0, 7); g.stroke(); }
    // net: posts, mesh band, tape; the cord shivers when the ball passes close
    const near = b && Math.abs(b[1]) < 0.6 ? Math.max(0, 1 - (b[2] - NET_C) / 0.6) : 0, wob = near * Math.sin(clock * 60) * 0.02;
    const top = x => NET_C + (NET_P - NET_C) * Math.pow(Math.abs(x) / DBL_W, 2) + wob * (1 - Math.abs(x) / DBL_W);
    const net = []; for (let i = 0; i <= 20; i++) { const x = -DBL_W - 0.9 + (2 * DBL_W + 1.8) * i / 20; net.push([x, 0, top(Math.min(DBL_W, Math.abs(x)))]); }
    poly([[-DBL_W - 0.9, 0, 0], ...net, [DBL_W + 0.9, 0, 0]], "rgba(8,14,10,.62)");
    for (let i = 0; i <= 40; i++) { const x = -DBL_W - 0.9 + (2 * DBL_W + 1.8) * i / 40; line([x, 0, 0], [x, 0, top(Math.min(DBL_W, Math.abs(x)))], "rgba(255,255,255,.07)", 1); }
    g.beginPath(); net.forEach((p, i) => { const v = P(...p); i ? g.lineTo(v[0], v[1]) : g.moveTo(v[0], v[1]); }); g.strokeStyle = "rgba(250,250,245,.95)"; g.lineWidth = lw * 2.2; g.stroke();
    for (const x of [-DBL_W - 0.9, DBL_W + 0.9]) line([x, 0, 0], [x, 0, NET_P + 0.02], "#c8c8c0", lw * 2.6);
    // hit flashes
    for (const f of flashes) { const c = P(...f.p); if (!c) continue; const k = f.t / 0.35, rad = (0.15 + 0.6 * k) * c[2];
      const r = g.createRadialGradient(c[0], c[1], 0, c[0], c[1], rad); r.addColorStop(0, `rgba(255,252,220,${0.55 * (1 - k)})`); r.addColorStop(1, "rgba(255,252,220,0)");
      g.fillStyle = r; g.beginPath(); g.arc(c[0], c[1], rad, 0, 7); g.fill(); }
    // trail and ball
    for (let i = 1; i < trail.length; i++) { const p = P(...trail[i - 1]), q = P(...trail[i]); if (!p || !q) continue;
      g.strokeStyle = `rgba(222,240,90,${0.38 * i / trail.length})`; g.lineWidth = Math.max(1.2, 0.07 * q[2] * i / trail.length); g.lineCap = "round";
      g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke(); }
    if (b) { const c = P(...b); if (c) { const rad = Math.max(2.6, 0.075 * c[2]);
      const glow = g.createRadialGradient(c[0], c[1], 0, c[0], c[1], rad * 3.2); glow.addColorStop(0, "rgba(230,250,120,.45)"); glow.addColorStop(1, "rgba(230,250,120,0)");
      g.fillStyle = glow; g.beginPath(); g.arc(c[0], c[1], rad * 3.2, 0, 7); g.fill();
      g.fillStyle = "#e3f25a"; g.beginPath(); g.arc(c[0], c[1], rad, 0, 7); g.fill(); } }
    // vignette
    const v = g.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.3, W / 2, H * 0.5, Math.max(W, H) * 0.8);
    v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.6)"); g.fillStyle = v; g.fillRect(0, 0, W, H);
    if (grain) { g.globalAlpha = 0.06; g.fillStyle = grain; g.save(); g.translate((clock * 37) % 64, (clock * 53) % 64); g.fillRect(-64, -64, W + 128, H + 128); g.restore(); g.globalAlpha = 1; }
  }
  function frame(ts) {
    if (!alive) return; const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0; last = ts;
    step(dt); draw(); raf = requestAnimationFrame(frame);
  }
  let grain = null; try { const n = document.createElement("canvas"); n.width = n.height = 64; const nx = n.getContext("2d"), id = nx.createImageData(64, 64);
    for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } nx.putImageData(id, 0, 0); grain = g.createPattern(n, "repeat"); } catch (e) {}
  resize(); addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => { if (document.hidden) { cancelAnimationFrame(raf); last = 0; } else if (!reduce && alive) raf = requestAnimationFrame(frame); });
  if (reduce) { for (let i = 0; i < 40; i++) step(1 / 60); u = shot.T * 0.7; trail = [shotPos(shot, u)]; draw(); }
  else raf = requestAnimationFrame(frame);
  return { stop() { alive = false; cancelAnimationFrame(raf); } };
}
window.GSCine = GSCine;
})();
