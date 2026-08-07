import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Adversarial gate for the Live Point prototype. Assume every scenario is wrong until
// its geometry, colour language, ball physics AND coaching text all agree. A hostile
// pro who wants the app to teach a lie has to beat all of these at once.
const root = process.argv[2] || path.dirname(fileURLToPath(import.meta.url));
const file = `${root}/livepoint-prototype.html`;
const html = fs.readFileSync(file, 'utf8');

const GOLD = '#c8a84b', RED = '#e07070', GREEN = '#5bba6f';

// ── Extract the SCENARIOS literal by balanced-bracket match, then eval as pure data ──
const anchor = html.indexOf('const SCENARIOS = [');
if (anchor < 0) { console.error('[LIVE POINT] SCENARIOS array not found'); process.exit(1); }
const from = html.indexOf('[', anchor);
let depth = 0, end = -1;
for (let i = from; i < html.length; i++) {
  const ch = html[i];
  if (ch === '[') depth++;
  else if (ch === ']') { depth--; if (depth === 0) { end = i; break; } }
}
let SCENARIOS;
try { SCENARIOS = eval(html.slice(from, end + 1)); }        // literal references GOLD/RED/GREEN, defined above
catch (e) { console.error('[LIVE POINT] SCENARIOS did not parse:', e.message); process.exit(1); }

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const inBounds = p => Array.isArray(p) && p.length === 2 && p[0] >= 12 && p[0] <= 188 && p[1] >= 8 && p[1] <= 292;

// intent → geometry it MUST satisfy (from the finish shot + that finish's opp positions)
const INTENT_GEO = {
  behind:   (s, c) => dist(s.to, c.oppStart) < dist(s.to, c.oppEnd),
  space:    (s, c) => dist(s.to, c.oppEnd) > 32,
  deep:     (s)    => s.to[1] < 95,
  jam:      (s, c) => dist(s.to, c.oppEnd) < 26,
  into_run: (s, c) => dist(s.to, c.oppEnd) < 34,
  angle:    (s)    => s.to[1] > 100 && Math.abs(s.to[0] - 100) > 46,
  reset:    (s)    => s.to[1] < 120 && Math.abs(s.to[0] - 100) < 46,
  risk:     ()     => true,        // greedy option — validated purely through the text
};
// intent → a word its coaching text MUST contain (text and tactic can't drift apart)
const INTENT_WORD = {
  behind: /behind|wrong.?foot/i, space: /open|space|behind|away/i, deep: /deep/i,
  jam: /body|jam|hip/i, into_run: /open|run|their run|space/i, angle: /angle/i,
  reset: /reset|neutral|deep|middle|rebuild|buy/i, risk: /margin|coin.?flip|low.?percentage|long|net|miss|gamble/i,
};
// content integrity — no fabricated certainty in any coaching prose (matches the app's trust gate)
const ABSOLUTES = /\b(always|never|every time|guaranteed|automatically|the only)\b/i;

let errors = [];
function scenarioErrors(s) {
  const e = [];
  const chk = (cond, msg) => { if (!cond) e.push(msg); };
  chk(s.id && s.title && s.opp, 'missing id/title/opp');
  chk(s.d1 && s.d1.q && Array.isArray(s.d1.opts) && s.d1.opts.length === 2, 'd1 needs a question and exactly two options');

  for (const bk of ['A', 'B']) {
    const b = s[bk];
    if (!b) { e.push('missing branch ' + bk); continue; }
    chk(s.d1.opts.some(o => o.br === bk), 'no d1 option routes to branch ' + bk);
    chk(b.seq && Array.isArray(b.seq.shots) && b.seq.shots.length >= 2, bk + ': seq needs at least 2 shots');
    chk((b.reveal || '').length >= 40, bk + ': reveal text too thin');
    chk(b.d2 && Array.isArray(b.d2.opts) && b.d2.opts.length === 2, bk + ': d2 needs two options');
    chk(b.d2 && b.d2.opts.filter(o => o.win).length === 1, bk + ': d2 needs exactly one winning option');
    chk((b.winTxt || '').length >= 40 && (b.midTxt || '').length >= 40, bk + ': coach reads too thin');
    chk(!ABSOLUTES.test([b.reveal, b.winTxt, b.midTxt].join(' ')), bk + ': coach read overstates certainty (absolute word)');

    // sequence: ball continuity, court bounds, colour language
    (b.seq.shots || []).forEach((sh, i) => {
      chk(inBounds(sh.from) && inBounds(sh.to), bk + ' seq shot ' + i + ': off court');
      if (i > 0) chk(dist(sh.from, b.seq.shots[i - 1].to) < 26, bk + ' seq shot ' + i + ': ball teleported (does not continue from the last landing)');
      if (i === 0) chk(sh.color === GOLD, bk + ' seq: your first shot must be gold');
      if (i === 1) chk(sh.color === RED, bk + ' seq: the opponent reply must be red');
    });

    // finishes: green-payoff-only on the win, intent ↔ geometry ↔ text on both
    for (const fk of ['win', 'mid']) {
      const f = b[fk];
      if (!f || !Array.isArray(f.shots) || !f.shots.length) { e.push(bk + ': missing ' + fk + ' shots'); continue; }
      const last = f.shots[f.shots.length - 1];
      chk(inBounds(last.from) && inBounds(last.to), bk + ' ' + fk + ': shot off court');
      if (fk === 'win') chk(last.payoff === true && last.color === GREEN, bk + ' win: the finish must be a green payoff shot');
      else chk(!f.shots.some(x => x.payoff) && !f.shots.some(x => x.color === GREEN), bk + ' mid: a neutral outcome must not use the green payoff');

      // Miss lock-step: if the outcome text says the ball MISSED (net/long/wide), the finish
      // MUST declare shot.miss so the animation shows the miss — otherwise it renders as a
      // clean in-court landing and the text contradicts the picture. And a declared miss must
      // be corroborated by BOTH the text and the geometry. This is the trust gate for losers.
      if (fk === 'mid') {
        const title = b.midTitle || '';
        const declared = last.miss;
        const titleMiss = /\bnet\b|netted|\blong\b|\bwide\b|missed|\bframe/i.test(title);
        if (titleMiss && !declared) e.push(bk + ' mid: outcome "' + title + '" says the shot missed but no shot.miss is set — the animation would show it landing in');
        if (declared) {
          if (!['net', 'long', 'wide'].includes(declared)) e.push(bk + ' mid: unknown miss type "' + declared + '"');
          else {
            const okText = declared === 'net' ? /net|netted/i.test(title) : /wide|long|missed|frame|off/i.test(title);
            if (!okText) e.push(bk + ' mid [' + declared + ']: the outcome text does not name this miss');
            if (declared === 'net') chk(last.from[1] > 150 && last.to[1] < 150, bk + ' mid: a net miss must be aimed across the net (from your side to theirs)');
            else chk(last.to[1] < 150, bk + ' mid: a long/wide miss must clear the net before landing out');
          }
        }
      }

      const intent = last.intent;
      chk(intent && INTENT_GEO[intent], bk + ' ' + fk + ': finish is missing a known intent tag');
      if (intent && INTENT_GEO[intent]) {
        const ctx = { oppStart: f.oppStart || [100, 30], oppEnd: f.oppEnd || f.oppStart || [100, 30] };
        chk(INTENT_GEO[intent](last, ctx), bk + ' ' + fk + ' [' + intent + ']: the coordinates contradict the intent');
        const wantWin = (fk === 'win');
        const txt = (wantWin ? b.winTxt : b.midTxt) + ' ' + ((b.d2.opts.find(o => !!o.win === wantWin) || {}).lbl || '');
        chk(INTENT_WORD[intent].test(txt), bk + ' ' + fk + ' [' + intent + ']: the coaching text does not name the intent');
      }
    }
  }
  return e;
}

const ids = new Set();
SCENARIOS.forEach(s => {
  if (ids.has(s.id)) errors.push(`${s.id}: duplicate scenario id`);
  ids.add(s.id);
  scenarioErrors(s).forEach(msg => errors.push(`${s.id || '?'}: ${msg}`));
});

const out = { scenarios: SCENARIOS.length, ids: [...ids], errors: errors.length, detail: errors };
console.log(JSON.stringify(out, null, 2));
if (errors.length) { console.error('\n[LIVE POINT] VALIDATION FAILED — ' + errors.length + ' problem(s). Nothing ships until these are zero.'); process.exit(1); }
console.log('\n[LIVE POINT] validation: PASS (' + SCENARIOS.length + ' scenario' + (SCENARIOS.length === 1 ? '' : 's') + ')');
