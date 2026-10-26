# Readiness decisions — live release, 26 October 2026

Project: `eoinoliver/gamesharp-tennis` / Vercel `gamesharp-tennis`.

Released three beta lessons, nine pre-shot decisions. The catalogue now contains
32 Daily, two Predict and seven Play the Point lessons (41 total). Existing order
is preserved; the three new Daily lessons are appended. All nine new decisions
were inspected; none were withheld from this scoped batch. Physical-device audio,
learning efficacy and on-court transfer remain unverified.

- [Have You Earned the Attack?](https://www.gamesharptennis.com/play.html?l=earned-attack)
- [Defence Can Change Before You Hit](https://www.gamesharptennis.com/play.html?l=earned-defence)
- [Have You Earned the Net?](https://www.gamesharptennis.com/play.html?l=earned-net)

## Identity and authorization

- PR: https://github.com/eoinoliver/gamesharp-tennis/pull/37
- Reviewed head: `9a9212ba0c310f8401ed776557dd61fb8fceb67c`.
- Main merge: `9d2dd6b06e7a30cac7456052dfbd4afe2be30ae7`.
- Identical reviewed/merged tree: `8a9f029e2431884f02b329c3604754173cc404dc`.
- App version: `84d191a175`.
- Preview: `dpl_BnZVv4Akk92Ve66UkpQZVXq2Hwr1`,
  https://gamesharp-tennis-f76hg1kx4-eoinlynn-5978s-projects.vercel.app.
- Promoted exact Git Production: `dpl_7vts2VCT5XRUiXjCkmSVsDVQdJJR`,
  https://gamesharp-tennis-iedk7dh5v-eoinlynn-5978s-projects.vercel.app.
- User's current full-autonomy, proceed and build/deploy instructions authorize
  this scoped beta work. Older per-preview permission requirements were
  superseded for this request; release validation safeguards were preserved.

## Verification

- 22 unit tests and exact build parity passed: 100 release files, 99 public
  assets and 103 checked source/test inputs. The authoring generator reproduces
  its outputs without a diff. Historical fingerprints were not rewritten.
- Focused readiness suite: 397 assertions in Chromium and 397 in WebKit. Four
  viewport sizes (375, 430, 820 and 1280 pixels); tablet uses reduced motion.
  All 18 offered choices, withheld pre-answer evidence, paired ball/opponent and
  camera equality, visible arrival-speed difference, comparisons, immutable
  first scores, explanations, cue saves and continuation checked.
- Full local suite passed: 80 sensory/navigation assertions, app flow, layout,
  payoffs, Pusher, all 41 scene gates and 325 contact-inspection assertions.
- GitHub contracts passed in 13m16s:
  https://github.com/eoinoliver/gamesharp-tennis/actions/runs/40303174050.
- Personal visual inspection covered all nine new phone question scenes. All
  three Preview journeys completed through transfer and cue saving. The staged
  attack journey completed 3/3, comparison, cue save and actual next navigation.
- Preview, staged Production and live each passed **241/241** hosted checks,
  covering every public asset hash, routes, headers and exclusions. No retries
  were required. Preview's exact Vercel Feedback suffix is the only permitted
  platform HTML normalization.
- Vercel Resources UI reported 99 static assets on both Preview and Production.
  Effective project/runtime settings, configuration, regions, Node version and
  137 environment key names matched. Zero configured project environment
  variables; no functions or crons. The static builder has no application env
  inputs. Git identities/target URLs differ as expected.
- Both live Chromium and WebKit completed all three lessons at 3/3, compared
  arrivals, saved all three cues and followed the real next-challenge link.
  Each intercepted 24 PostHog requests and recorded zero page errors.
- The www alias identifies the promoted deployment; apex redirects to www while
  preserving the lesson query. Post-deployment error-log scan returned no rows.
  Static client errors are covered separately by browser checks, not log absence.

## Rollback and follow-up

Last-good Production, verified before merge and unchanged before promotion:
`dpl_4AKS7YatmaePvodgydUJVxRuTAbx`, version `a6403a2a21`, main
`5e5c6aef3213233bcfa91aa1c75b03ac614258d4`,
https://gamesharp-tennis-32svsci1b-eoinlynn-5978s-projects.vercel.app.
Automatic custom-domain assignment remained off through verification. No rollback
was needed. This documentation-only branch must not be promoted.

Before expanding, separate independent recognition on a fresh situation from
completion and cue saves. A safer accepted answer does not prove the user saw
an available attacking option. See `readiness-decisions.md` for the content and
evaluation limits. New scenes illustrate arrival and starting position; they do
not certify stroke biomechanics or claim to teach the whole movement cycle.
