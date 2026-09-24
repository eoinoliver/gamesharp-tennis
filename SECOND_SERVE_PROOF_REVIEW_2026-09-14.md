# Second-serve local proof — 14 September 2026

## Status and scope

Production is unchanged: **18/24 built lessons; six research briefs remain**.
The next three have nine complete editorial decision drafts in
[the batch outline](NEXT_THREE_LESSON_OUTLINES_2026-09-14.md), not nine implemented
interactions. Their runtime spine status, catalogue, chooser, dated schedules,
scoring and source-lock fields are unchanged. No deployment was attempted.

The isolated [local proof](http://127.0.0.1:8766/.proofs/second-serve/) imports the
existing construction module's court projection and drawing helpers without
changing that module. Its own model/page/verifier live under `.proofs/second-serve/`,
which `.vercelignore` excludes. It does not load the app, write storage, award
credit, play audio or expose a new live lesson. This is a comparison workbench,
not the final question-and-four-choice presentation.

## What it demonstrates

| Comparison | Branch A | Branch B | Supported distinction |
|---|---|---|---|
| Two legal serves | Contact 8.43 m from net | Contact 12.02 m from net | A legal bounce alone does not describe the receiver's opportunity. |
| Same serve, same return target | Contact 1.20 s; landing 2.15 s | Contact 1.58 s; landing 2.36 s | The genuinely faster later return still arrives later in this example. |

Serve comparison contacts share height 1.153 m and elapsed time 1.34 seconds.
Depth and initial flight velocity differ; this is NOT an equal-pace comparison.
Both right-handed receivers use the same forehand wing and starting position.

Return average horizontal speeds are approximately 17.53 versus 27.38 m/s.
Outgoing flight lasts 0.95 versus 0.78 seconds. Early contact does not shorten
both timed segments here; it saves more before contact than the later pace gains.
The server follows the same recovery clock, but this proof does not claim an
unrecovered server, a weak next shot or a winner.

These numbers are authored illustrative values, not measured professional data.
Flight uses gravity with a fixed illustrative bounce response, without drag,
spin, racket biomechanics, execution probability or a learned player model.
Animation runs at half speed, stated on the page; displayed seconds use model time.

## Verification and corrections

- All **86 structural tests pass**, including four new proof tests. Trust audit
  passes with its unchanged 366/549 legacy answer-length warning.
- Model checks cover finite/continuous flight, diagonal service-box legality,
  net clearance, reachable average player movement, forehand orientation,
  equal incoming return flights/targets, genuine pace differences and arrival order.
- Both cases and all four branches inspected at 320, 430 and 1280 pixels.
  430 reduced motion, card/Focus equality, labels off, 44 px touch targets,
  storage preservation, keyboard modal containment and focus restoration checked.
- Source review found that Focus omitted the visible timing evidence and title.
  These now follow the same clock and show observed comparison values.
- Screenshot review found clipped title/result text in landscape Focus after
  those additions. The frame now reserves their height, and the check tests every
  modal child, not just the court. Final 844×390 and 320px Focus images inspected.
- Editorial review replaced Serve decision 1's rule-based giveaway options with
  four comparable contact observations. Return decision 2's setup no longer
  announces the serve/target/pace facts before the visual comparison.
- Normal motion completed for all four branches in a direct fresh-browser check.
  Several longer reusable-checker attempts timed out after many viewport/media
  changes; one cleanup call also timed out. The leftover owned session was then
  closed explicitly. Do not erase these attempts or infer their root cause.
  The verifier now reloads a fresh page before normal-motion checks, observes
  timers in the page, and the page script no longer shadows native window.close.
- **Final complete reusable verifier passes**, including all three widths, four
  branches, labels off, reduced motion, Focus, every landscape modal child,
  storage preservation and all four normal-motion runs. Its browser closed cleanly.
  An independent fresh-session check additionally passed all four branches with
  labels on and again with labels off: 221–344 real RAF frames per branch, no
  early payoff, no page errors, successful cleanup. No single timeout root cause
  is asserted from those successful rechecks.
- Draft copy check: nine situations, nine questions and 36 choices; maximum
  situation 19 words, question eight words. Each question's four options have
  equal word counts (seven or eight). This removes a wording-length tell, not
  the need for editorial review of plausibility.

Final still-image evidence:
`/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-second-5PT77J`.
The landscape correction was also visually inspected in `gs-second-LC35Z2`.
Earlier evidence folders `gs-second-zLfFND` and `gs-second-vMn6Ov` include the
pre-correction landscape state. They are temporary review evidence, not release artifacts.

## What remains unproven

1. Return's boundary: why a low early interception is unreachable from the
   shown starting position, rather than “high serve means move back”.
2. Serve's higher/deeper contrast and reversal against a receiver comfortable
   with height. Do not infer these from the first same-height proof.
3. Pattern lesson's readable contact-history comparison and transfer. The
   candidate Agassi/Becker story still needs original-source verification or a
   replacement; its secondary reproduction is not release approval.
4. All 36 full choice branches, production sound, final coaching-card pacing,
   lesson navigation, future calendar integration and complete release journeys.
5. Independent coach sign-off, physical-phone behaviour and actual learning or
   retention. Automated model checks cannot settle those judgments.

The next useful work is these boundary/history scenes and the remaining source
gate, followed by integration of a complete batch. Do not promote three partial
lessons or add unrelated Predict/Playbook/Sharpen scope to make the count grow.
