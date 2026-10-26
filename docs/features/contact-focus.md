# Contact Clue visual-focus review — 26 October 2026

Review treatment: `play.html?l=contact-clue&contactFocus=1`.
Comparison: `play.html?l=contact-clue` on the same deployment.

One existing lesson, not a new lesson or diagnostic product. Catalogue, source
lesson, clips, scene coordinates, timings, questions, choices, explanations,
outcomes, cue, scoring and persistence are unchanged. The treatment is restricted
to the exact Contact Clue slug and requires the explicit query parameter.

## What changes

- Court context for the miss and chosen consequence; close framing and a quiet
  background around the repeated contact. Reduced motion uses context cuts.
- After the answer's consequence, Inspect contact holds the original pose and
  offers the selected next-ball contact. One highlight joins the authored hip and
  ball positions. These are relative observations, not measured player thresholds.
- Comparisons are optional, keyboard operable, and reset on navigation/replay.
  No highlight or comparison appears before any answer, including the transfer.
- Normal Contact Clue and the other 37 experiences do not enable the treatment.

The existing lesson includes causal/target assertions; keeping it stable does not
constitute renewed coaching approval. This review evaluates visual understanding,
not whether a simulated result establishes a real player's diagnosis.

## Build evidence

`contact-focus-build.json` is an explicit feature overlay on the historical
migration manifests. Only one runtime source and four generated files differ.
The old fingerprints are preserved, with their original hashes checked before
applying the candidate hashes. All other 95 imported inputs and all 93 other
release files remain protected by the original manifests. Routing is unchanged.
New test/documentation files are outside that historical inventory and reviewed
directly in this PR. This is a proposed test-baseline update for this exact
feature, not a claim that the modified engine is unchanged.

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
