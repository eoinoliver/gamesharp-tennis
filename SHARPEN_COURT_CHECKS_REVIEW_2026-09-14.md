# Four local Sharpen court checks — 14 September 2026

## Decision and status

The user liked the forehand journey and authorised the recommended next three:
fast serves rushing the return, a miss disrupting the next decision, and an
approach creating a difficult first volley. Build these on one shared flow, not
four independent implementations or a larger diagnostic catalogue.

**Local review only. Not deployed.** Four experiments, zero new lessons, zero
new production-eligible experiments. Independent coach review is pending for
all four. Design acceptance of forehand does not validate any intervention.

Preview: http://127.0.0.1:8766/index.html?sharpenChecks=1 → Sharpen.
The old `?forehandCheck=1` still exposes forehand only. Both flags fail closed
outside loopback; an unflagged local visit retains released Sharpen behaviour.

| Area / concern | Exact existing lesson | Court observation |
| --- | --- | --- |
| Forehand / My forehand keeps missing | `gold_contact_point_v1` | Original ten usual / ten cue comparison; all net/out misses, room and conditions |
| Serve & Return / Fast serves rush my return | `gold_return_position_v1` | Three pairs total: felt time, extra misses/shorter returns, conditions |
| Mental Game / One miss leads to another | `gold_miss_two_points_v1` | Natural opportunity, routine actually used, clear intention—not point wins |
| Net Play / My first volley is always difficult | `gold_approach_volley_v1` | Three pairs total: receiver contact, volley height, approach misses and conditions |

## Structure and truth boundaries

Each existing three-decision lesson leads to one recognition choice: match,
uncertain, or no match. Only a match offers a bounded court check. Observation-only
and nonmatch exits remain honest. Setup, cue, limits, sources, report fields and
interpretation are supplied by one frozen registry with exact canonical audits.

The shared host separates lesson completion, saving a plan, opening the report,
explicit submission and neutral interpretation. A first report cannot be
overwritten; its instructions remain readable. No-opportunity and unattempted
mental resets do not mark the routine practiced. Known costs remain explicit even
when another observation is uncertain. A trial is self-report, never a diagnosis,
verified practice, physical mastery, causal proof or lasting improvement.

Forehand's module, protocol, interpreter, key and existing records are unchanged.
The three new checks use `gamesharp_court_checks_v1`, keyed by exact experiment,
lesson and definition version. Drafts and saved observations cannot cross paths.
Corrupt records are isolated, duplicate reports rejected, and unavailable storage
falls back honestly to visit memory. There is no migration or Daily credit write.

## Verification

- **201/201 automated tests**, no failures or skips. Includes 15 runtime
  integration checks, 18 shared-store checks and 11 registry checks covering 922
  valid report combinations. Counts are assertions/tests, not players or practice.
- **52 distinct browser groups pass:** original forehand 16 + new checks 36.
  All three additions completed at 320/430/1280px in reduced motion; native form
  and navigation input, reload, first-report immutability, exact Daily returns,
  partial Daily, same-session record/draft isolation, uncertainty/nonmatch,
  missing modules, blocked/quota storage, 200% text and keyboard were exercised.
- Final content received a fresh 10-group pass: both inconclusive comparisons,
  both known-cost/uncertain-contact reports and six mobile source-scroll cases.
  Scrolling used coordinate-targeted native wheel events, not scrollTop as proof.
- Main reviewer walked the normal-motion 430px Approach Volley lesson into its
  new recognition, plan and report, and personally inspected representative
  Return/Mental/Volley narrow, mobile and desktop screenshots.
- Trust audit passes with the unchanged quarantined-bank warning: 366/549
  questions have a length tell. Connected structural audit: nine journeys,
  zero failures. This is not a fresh full browser audit of Predict.
- All **21 approved lesson definitions are unchanged as serialized data**;
  the Gold animation/lesson engine is byte-for-byte unchanged from the baseline.
  In particular, the native return event-ordering fix remains untouched.

Browser evidence in the system temporary directory:
`gs-forehand-check-6wRPcR`, `gs-court-check-4dVlAf`,
`gs-court-check-5dhjrt`, `gs-court-check-m3B0jm`,
and final `gs-court-check-GBQPjn`. Disposable test profiles only; synthetic reports
are not actual player data. Temporary evidence may be purged by the OS.

Review corrected ambiguous pair counting (three total, not one plus three),
mental non-attempt interpretation priority, and known costs being hidden behind
uncertainty. Initial integration harness assumptions were updated to the shared
schema and actual browser registry. A browser assertion falsely matched “proved”
inside “improved” in a disclaimer; it was corrected and the case rerun. No
unresolved software or layout defect was found in the tested paths.

## Evidence and remaining uncertainty

Primary sources inform principles, not these exact practice protocols:

- [ATP return-depth analysis](https://www.atptour.com/en/news/medvedev-infosys-beyond-the-numbers-august-2023): elite observational time/position trade, not a recreational depth prescription.
- [USTA first/second-serve returns](https://www.usta.com/en/home/improve/tips-and-instruction/national/tennis-strategy--returning-first-and-second-serves.html): different return intentions; the lesson narrows forward movement to a suitable slower serve.
- [USTA between-point focus](https://www.usta.com/en/home/improve/tips-and-instruction/national/how-to-stay-focused-during-a-match.html): recover, refocus and prepare around a clear plan; not proof this check prevents errors.
- [Mike Crooks movement analysis](https://tennis.is/wp-content/uploads/2014/01/Federer_Murray_footwork_movement.pdf): a connected approach/receiver/first-volley view of particular elite points, not a universal depth rule.

Forehand source boundaries remain in `FOREHAND_CHECK_REVIEW_2026-09-14.md`.
No independent coach sign-off, measured player comprehension/retention, real
on-court effectiveness, physical iPhone/Safari/touch/VoiceOver or listening review
was obtained in this batch. These are the material remaining review needs.

## Versions and unchanged inventory

Local: Sharpen `.3`, court registry `.1`, spine `.17`, Gold loader 64,
Sharpen loader beta-3. Shared store schema 1; original forehand schema unchanged.
19 concerns across seven areas still reuse 17 lessons. All 21 Daily lessons remain
selectable. Nine eligible Predict journeys, eleven withheld IDs, eight Playbook
patterns and four exact Daily/Predict links are unchanged, as is the published
calendar through 4 November and the 21-lesson cycle from 5 November.

Production remains `dpl_9ByWdWu2k23SDNYSsEqFG8nrRBhD`, Sharpen `.1`, recorded in
`SHARPEN_BETA_RELEASE_2026-09-14.md`. No Vercel operation was performed here.
Next: review these four local journeys for comprehension and coaching suitability
before authorising production or extending error-solving coverage.
