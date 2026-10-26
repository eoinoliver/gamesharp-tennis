# Contact Clue truth and visual-focus review — 26 October 2026

Release batch: Contact Clue, High Ball and Short Ball, enabled in normal play.
Comparison: append `&contactFocus=0` to the same lesson URL.

Three existing lessons, no new catalogue entries. Contact Clue uses its close
contact view and original/next-ball comparison. High Ball and Short Ball keep
their court decision view and add post-answer contact-height inspection with
an explicitly labelled alternative option. Backhand inspection uses the
opposite camera side so the body does not hide the strings. The selected shot is the first
contact at/after the decision, never a later reply or volley. High Ball's double
bounce has no contact; it is shown without a fabricated contact marker.

Questions, choices, explanations, outcomes, cues, scoring and persistence are
unchanged except the Contact Clue data correction described below. All three
inspectors preserve the first answer and return to the selected result.

Eoin authorized building more and deploying the batch live on 26 October 2026.
This supersedes the earlier opt-in-only scope and exact-preview approval rule
for this batch; required technical release checks still apply. Coaching review
and learning measurements remain recommendations and are not claimed complete.

## Findings and corrections

- Contact Clue says the first forehand goes into the net, but its original ball
  path crossed the net and ended long. The candidate now stops at the near net
  face and drops on the hitter's side. The selected crowded/faster consequence
  uses the same net result. The second, separate example remains the long miss.
- Contact Clue's moving forehand pose reached the authored contact sample one
  scene frame after the ball. The standard *Your Forehand Leaves a Bill* scenes
  have the same 10 ms offset: in `fb1A`, the ball reaches the authored contact
  at frame 208 and the pose reached its contact sample at frame 209. The
  candidate shifts only the opening selected forehand one frame earlier in the
  nine Forehand Bill branches where forehand is the shot. Contact Clue's initial
  and selected-next forehand swings are aligned the same way. Later reply
  animations and other motion clips keep their timing.
- In the source `fh` clip at its contact sample, the racquet grip equals the
  hitting wrist and its centre is 3.3 cm from the ball centre. The static
  Sharpen contact card comes from this generic Tennis-MoCap motion. It does not
  establish that the stroke is an ideal or Alcaraz-like model. The sampled ACE
  and SweetSpot shorts use stylised 3D reconstructions; the Alcaraz 9-second
  short carries YouTube's AI label. Their useful presentation cue is to show
  the turn, space, racket drop, contact and finish in sequence. Neither channel
  independently validates this dataset. Keep the existing clip illustrative
  and withhold any “perfect form” claim pending coach review of that motion.

## What changes

- Court context for the miss and chosen consequence; close framing and a quiet
  background around the repeated contact. Reduced motion uses context cuts.
- The first miss now visibly ends at the net, consistent with its lesson text.
- After the answer's consequence, Inspect contact holds the original pose and
  offers the selected next-ball contact. One highlight joins the authored hip and
  ball positions. These are relative observations, not measured player thresholds.
- Comparisons are optional, keyboard operable, and reset on navigation/replay.
  No highlight or comparison appears before any answer, including the transfer.
- The automatic close camera remains limited to Contact Clue. High Ball and
  Short Ball zoom only during post-answer inspection. Contact Clue, Forehand Bill, and the selected contact in High Ball and
  Short Ball receive authored frame-alignment edits. The latter two align 23
  shots; the double-bounce branch has no swing to shift. Their racket centres
  are within 5 cm of the ball centre at held contact, checked in the renderer.

The existing lesson includes causal/target assertions; keeping it stable does not
constitute renewed coaching approval. This review evaluates visual understanding,
not whether a simulated result establishes a real player's diagnosis.

## Build evidence

`contact-focus-build.json` is an explicit feature overlay on the historical
migration manifests. Five runtime/data sources and eight generated files are
listed against the frozen baseline hashes. The old fingerprints remain intact;
all other 91 imported inputs and 89 release files stay protected by the original
manifests. Routing is unchanged. The repair helper and documentation sit outside
that historical inventory and are reviewed directly in this PR. This is a
proposed test-baseline update for this exact correction, not a claim that the
modified engine is unchanged.

## Review before a player pilot

Have a tennis coach review the generic contact motion from the turn through the
finish, especially racket-face orientation and how much space the positive
example visibly shows. Then test whether recreational players distinguish the
crowded/net and spaced/long examples without being told the answer.

## Small pilot after review

Use 8–12 recreational players, splitting first exposure between the comparison
and treatment; avoid showing both first, which would contaminate the comparison.
Ask each player to explain what they noticed without quoting the lesson. After
48 hours, use a different, unlabelled example and ask what evidence they would
inspect. Record comprehension, unaided recognition and voluntary continuation;
record prompted returns separately from unprompted returns. Results are
directional at this sample size, not proof of efficacy.

This release does not add a recall system. Use the review/pilot to decide whether
the presentation actually improves comprehension before further expansion.

## Verification

Run `npm run check:build`, `npm test`, the existing browser release suite, and
`node --import ./app_src/verify-runtime.mjs tools/contact-focus-browser.mjs <origin>/`.
The targeted check exercises all three lessons at 375×667, 430×932
(reduced motion) and 1280×900, all 36 choices, first-answer integrity, comparison,
replay, cue saving, on-screen Next and explicit disable/unrelated-lesson boundaries. Screenshots and raw
reports remain ignored local evidence. No physical iPhone/Safari, independent
coach approval, real-player learning or retention result is implied.
