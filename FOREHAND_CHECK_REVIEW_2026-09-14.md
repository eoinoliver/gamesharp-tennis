# Forehand error-solving prototype — local review, 14 September 2026

## Status and scope

Implemented locally after the user authorised one complete forehand-error journey
inside Sharpen. **Not deployed. Independent coach review is pending.** The existing
production release remains `dpl_9ByWdWu2k23SDNYSsEqFG8nrRBhD`.

Preview: http://127.0.0.1:8766/index.html?forehandCheck=1
Select Sharpen → Forehand → My forehand keeps missing.
The flag works only on loopback hostnames, not a public host or production query.
Normal local URLs retain the released Sharpen flow.

One local experiment, zero new lessons. The 21 lesson definitions are unchanged
as serialized data when evaluated with the prior versus current spine. The new
spine field only binds `forehand-space-check-v1` to `gold_contact_point_v1`.
The approved illustration, seven hotspots, 19 concern routes, 17 concern lesson
destinations, nine eligible Predict journeys, eleven withheld Predict IDs, eight
Playbook patterns and four exact Daily/Predict links remain unchanged.
One additional court experiment is withheld from production pending review.

## What the prototype does

1. A plain-language forehand concern opens the actual approved Contact lesson.
   Its three decisions, body-space comparison, payoff and court cue are reused.
2. After completion, one recognition choice asks whether repeated crowding feels
   familiar. Uncertain and nonmatching answers do not prescribe a correction.
3. A matching answer offers ten usual forehands and ten with one adjustment-step
   cue, after warm-up, with similar comfortable feeds, target and intended pace.
   All net/out misses count. No deliberately bad baseline, forced reach or grip/
   swing change is requested. The actual cue and critical limits stay visible.
4. Saving a plan saves the corresponding court focus, not a physical trial.
5. Only an explicit submitted court report records the counts, perceived room and
   whether conditions were comparable. Uncertain conditions are inconclusive.
   It may mark the matching saved Contact cue as tried, explicitly as self-report;
   it does not infer feedback, mastery, causal diagnosis or measured improvement.
6. The first comparison is immutable. The player can reread the full experiment
   after reporting, without overwriting it. This is not a retest/history dashboard.

Experiment storage has its own versioned key. Missing, malformed, coerced or
out-of-range values cannot create a result. Blocked storage and quota failure
retain this visit's state with truthful nonpersistent copy. Saving, replay and
reports never alter Daily checkpoints, credit, streak or completion history.

## Evidence and its limits

The content module records primary-source principles from USTA contact-spacing
guidance, the USTA Southern stroke-consistency table and Nick Bollettieri's
adjustment-step teaching. Source links and the original-adaptation boundary are
available in the prototype. The exact two-group protocol, cue and interpretation
are GameSharp's source-informed adaptation, not a USTA-validated intervention.
Structural audit always returns `coachApproved:false` while review is pending.

No coach has independently reviewed this exact experiment. No real-player
comprehension, adherence, on-court outcome or retention evidence was collected.
Ten usual balls followed by ten cue balls is not a controlled causal study; order,
warm-up, natural variation and self-report remain limitations. A favorable report
therefore says only that the signal is worth rechecking.

## Verification

- **163/163 automated tests pass**, none skipped. New coverage includes all 726
  valid count/observation combinations, strict validation, storage failures,
  immutable reporting, exact lesson binding and actual runtime handlers.
- Runtime tests reject five public hostnames even with the flag, accept only the
  three explicit loopback hostnames, and withhold the experiment when a required
  module, canonical spine binding, lesson or Gold CSS readiness is missing.
- Trust audit passes with the unchanged editorial warning: 366/549 legacy
  question-bank items have answer-length tells. No such legacy bank is activated.
- Connected-journey structural audit: nine journeys, zero failures. The existing
  Predict/Live Point browser audit was not rerun as part of this local prototype;
  its prior production review remains historical evidence, not a new claim.
- **16 browser-check groups pass**: full 320/430/1280 journeys; explicit required
  selections; plan/report separation; immutable report/reload/read-only plan;
  uncertain/no-match paths; inconclusive report; native Back/Exit/Escape and exact
  Daily return; saved partial Daily; same-session switch to another lesson; 200%
  text and keyboard; both missing modules; normal URL; blocked experiment storage;
  real coordinate-targeted wheel access to collapsed and expanded source notes at
  320/430px. The final 430px full report path was rerun after the saved-focus guard.
- Main agent personally completed the full normal-motion 430px entry, Contact,
  recognition, saved-plan, explicit form and result path using native controls;
  inspected its screenshots plus 320px, desktop and enlarged-text evidence.
- Browser runtime errors were checked. No deployment, physical iPhone/Safari,
  VoiceOver, listening test, external coach approval or actual tennis trial is
  claimed. All entered reports were disposable test fixtures, not user history.

Browser evidence lives in temporary directories:

- `gs-forehand-check-v9GVvj`: nine unaffected groups; initial form failures retained.
- `gs-forehand-check-HaHOii`: five corrected native form/result groups, all passing.
- `gs-forehand-check-trxp0S`: final 430px full path plus both coordinate-wheel cases.
- `/private/tmp/gs-forehand-owner-*.png`: main-agent visual review sequence.

The initial form failures were a verifier reference parser selecting an option
instead of its combobox. The parser was corrected and affected cases rerun;
they are not concealed or claimed as app failures.

The CLI's separate mouse-move/wheel calls emitted wheel events at (0,0), over the
fixed header. That could not verify nested scrolling. A coordinate-targeted CDP
wheel helper now sends genuine trusted input inside the scroller: 320px moved
0→580 before source expansion (1222 after); 430px moved 0→298 (814 after).
The summary and last expanded source link were visible inside the scroll viewport.
No app change was made to compensate for the test tool's pointer limitation.

## Corrections made during review

- Rendered the actual shared adjustment cue; its first integration had omitted it.
- Exposed the no-forced-distance/no-swing-change limits beside the experiment.
- Scoped the Contact transition by exact lesson ID and reset the path flag; Back
  followed by another lesson can no longer inherit the Contact experiment.
- Included form controls in the dialog focus trap.
- Kept the experiment readable after reporting, with no result overwrite route.
- Allowed uncertain comparison conditions without inventing a positive answer.
- Separated source-authored principles from approval of this original protocol.

Local versions: Sharpen `2026-09-14.sharpen-beta.2`, spines
`2026-09-14.lesson-spines.16`, Gold loader `20260914-gold-daily-63`, Sharpen loader
`20260914-sharpen-beta-2`, experiment assets `20260914-forehand-check-1`.
The Gold engine remains `.32`; no approved lesson timing or geometry changed.

## Next decision

Review this one flow with a coach and a target player before expanding it to other
errors. Confirm whether the player recognises the clue, can perform the experiment
without extra explanation, and understands an inconclusive result. An unanswered
request for review arrangements is not permission to label this coach-approved
or remove its local-only gate.
