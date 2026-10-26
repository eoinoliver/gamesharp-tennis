# Contact Clue truth and visual-focus review — 26 October 2026

Review treatment: `play.html?l=contact-clue&contactFocus=1`.
Comparison: `play.html?l=contact-clue` on the same deployment.

One existing lesson, not a new lesson or diagnostic product. The treatment is
restricted to the exact Contact Clue slug and requires the explicit query
parameter. The lesson's questions, choices, explanations, outcomes, cue, scoring
and persistence are unchanged; its broken first-miss path and contact timing are
corrected below.

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
- The opt-in camera treatment remains limited to Contact Clue. Only Contact Clue
  and the existing Forehand Bill lesson receive authored frame-alignment edits.

The existing lesson includes causal/target assertions; keeping it stable does not
constitute renewed coaching approval. This review evaluates visual understanding,
not whether a simulated result establishes a real player's diagnosis.

## Build evidence

`contact-focus-build.json` is an explicit feature overlay on the historical
migration manifests. Three runtime/data sources and six generated files are
listed against the frozen baseline hashes. The old fingerprints remain intact;
all other 93 imported inputs and 91 release files stay protected by the original
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

Do not add a recall system or expand this presentation across lessons before
the review/pilot establishes that the distinction became clearer.

## Verification

Run `npm run check:build`, `npm test`, the existing browser release suite, and
`node --import ./app_src/verify-runtime.mjs tools/contact-focus-browser.mjs <origin>/`.
The targeted check exercises three complete journeys at 375×667, 430×932
(reduced motion) and 1280×900, all 12 choices, first-answer integrity, comparison,
replay, cue saving, on-screen Next and opt-in boundaries. Screenshots and raw
reports remain ignored local evidence. No physical iPhone/Safari, independent
coach approval, real-player learning or retention result is implied.
