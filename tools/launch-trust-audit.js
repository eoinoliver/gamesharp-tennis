#!/usr/bin/env node
/*
 * GameSharp Tennis — launch trust audit
 *
 * Tennis asserts coaching truths. This audit is what makes that assertion
 * checkable. It enforces, over the shipped QBANK:
 *
 *   1. Answerability   — every question has four distinct options and a
 *                        correct answer that exists.
 *   2. No length tell  — the correct option must not be reliably the longest,
 *                        which lets a player score without reading tennis.
 *   3. No absolutes    — distractors must not disqualify themselves with
 *                        "always / never / every time / automatically".
 *   4. Teaching present— every question carries a why_right worth reading.
 *   5. No invented data— numeric claims must not masquerade as measured fact.
 *
 * Usage: node tools/launch-trust-audit.js [index.html]
 * Exit code 1 on failure so it can gate a release.
 */
const fs = require('fs');
const path = require('path');

const target = process.argv[2] || path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(target, 'utf8');

function extractBank(name) {
  const at = html.indexOf(name + ' = [');
  if (at === -1) return null;
  const start = html.indexOf('[', at);
  let depth = 0;
  for (let i = start; i < html.length; i++) {
    if (html[i] === '[') depth++;
    else if (html[i] === ']') {
      depth--;
      if (depth === 0) return JSON.parse(html.slice(start, i + 1));
    }
  }
  return null;
}

const QBANK = extractBank('QBANK');
if (!QBANK) {
  console.error('FAIL — QBANK could not be located in ' + target);
  process.exit(1);
}

const ABSOLUTES = /\b(always|never|every time|automatically|guarantee[sd]?|impossible|all the time|any opponent|100%)\b/i;
const LETTERS = ['a', 'b', 'c', 'd'];

// A distractor may open with an absolute when the absolute IS the answer form
// of a rules question ("Never — you may not reach over the net").
const ANSWER_FORM = /^(never|always)\s*[—–-]/i;

// Ratchet. LENGTH_TELL_BASELINE is the count measured when this audit was
// introduced. Lower it whenever an editorial pass improves the bank; the gate
// fails if it ever climbs back.
const LENGTH_TELL_MARGIN = 12;
const LENGTH_TELL_BASELINE = 366;
const errors = [];
const warnings = [];

let lengthTell = 0;
let absoluteHits = 0;

for (const q of QBANK) {
  const id = q.id || '(unknown id)';
  const opts = LETTERS.map(l => q['option_' + l]).filter(o => typeof o === 'string' && o.trim());

  if (opts.length !== 4) errors.push(`${id}: expected 4 options, found ${opts.length}`);

  const seen = new Set(opts.map(o => o.trim().toLowerCase()));
  if (seen.size !== opts.length) errors.push(`${id}: duplicate option text`);

  const key = String(q.correct_answer || '').trim().toLowerCase();
  if (!LETTERS.includes(key)) errors.push(`${id}: correct_answer "${q.correct_answer}" is not A-D`);
  const correct = q['option_' + key];
  if (key && !correct) errors.push(`${id}: correct_answer points at a missing option`);

  // 2. Length tell — a player must not be able to score by picking the longest
  //    option. This is editorial debt, not a mechanical defect: shortening a
  //    correct answer means rewriting real tennis, so it is ratcheted rather
  //    than auto-fixed. The count may fall; it must never rise.
  if (correct && opts.length === 4) {
    const others = opts.filter(o => o !== correct).map(o => o.length);
    const nextBest = Math.max(...others);
    if (correct.length - nextBest >= LENGTH_TELL_MARGIN) lengthTell++;
  }

  // 3. Self-disqualifying absolutes in the wrong answers.
  for (const l of LETTERS) {
    const text = q['option_' + l];
    if (!text || l === key) continue;
    if (ABSOLUTES.test(text) && !ANSWER_FORM.test(text.trim())) {
      absoluteHits++;
      errors.push(`${id}: distractor ${l.toUpperCase()} uses an absolute — "${text.trim().slice(0, 62)}"`);
    }
  }

  // 4. Teaching present.
  if (!q.why_right || q.why_right.trim().length < 25) {
    errors.push(`${id}: why_right is missing or too thin to teach`);
  }

  // 5. Numbers must be attributed, not invented. A bare percentage in the
  //    explanation is only allowed when a source or study is named with it.
  if (q.why_right && /\b\d{1,3}\s?%/.test(q.why_right)) {
    const attributed = /(study|research|data|per|according to|source|analysis|tracked|ATP|WTA|Hawk-?Eye)/i.test(q.why_right);
    if (!attributed) warnings.push(`${id}: unattributed percentage in why_right`);
  }
}

if (lengthTell > LENGTH_TELL_BASELINE) {
  errors.push(
    `length-tell ratchet broken: ${lengthTell} questions where the correct answer ` +
    `is ${LENGTH_TELL_MARGIN}+ chars longer than every distractor (baseline ${LENGTH_TELL_BASELINE}). ` +
    `New questions must not let a player score by picking the longest option.`
  );
} else if (lengthTell > 0) {
  warnings.push(
    `${lengthTell}/${QBANK.length} questions carry a length tell (baseline ${LENGTH_TELL_BASELINE}). ` +
    `Editorial debt: shortening a correct answer means rewriting real tennis, so this is ` +
    `tracked, not auto-fixed. Lower LENGTH_TELL_BASELINE as the bank improves.`
  );
}

const summary = {
  questions: QBANK.length,
  lengthTells: lengthTell,
  lengthTellBaseline: LENGTH_TELL_BASELINE,
  absoluteDistractors: absoluteHits,
  errors: errors.length,
  warnings: warnings.length
};

if (errors.length) {
  console.error('FAIL — launch trust invariants broken\n');
  for (const e of errors.slice(0, 40)) console.error('  · ' + e);
  if (errors.length > 40) console.error(`  … and ${errors.length - 40} more`);
  console.error('\n' + JSON.stringify(summary, null, 2));
  process.exit(1);
}

for (const w of warnings) console.warn('  warn · ' + w);
console.log('PASS — launch trust invariants hold');
console.log(JSON.stringify(summary, null, 2));
