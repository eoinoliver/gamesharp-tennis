# Shared coaching-card release — 13 September 2026

The user loved the Runaround trial and explicitly authorised applying it to all.
The shared renderStep now always uses setup → evidence → question/four answers,
with readable title and N of 3. No per-lesson opt-in or old duplicate setup path.
The approved Runaround CSS is unchanged except its scope comment. Content was
reviewed and retained: a public/local source comparison proved everything outside
renderStep and VERSION byte-identical to the preceding production engine.

Inventory unchanged: 12/24 playable lessons, 12 research briefs. Predict remains
9 eligible / 11 withheld. Four exact Daily continuations remain; eight absent by
design. No new lessons, Sharpen renovation, geometry, timing, scoring, calendar,
audio or history changes. Focus retains the prior approved presentation.

## Verification

- 60 automated tests pass; obsolete context-after-visual assertion replaced with
  setup-before-evidence, accessible context, no duplicated setup and N-of-3 rules.
- Trust audit zero errors; unchanged legacy 366/549 length-tell warning.
- 36 complete Home → lesson → result → Sharpen → Daily paths: all 12 at
  320x844 normal/correct, 430x844 reduced/wrong, 1280x844 reduced/correct.
  All 108 decisions checked for hierarchy, progress, four >=44px targets and
  horizontal overflow. Per-decision read/answer screenshots and per-lesson Focus.
  Credit, completion and exact continuation availability checked for all lessons.
  Evidence: `/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-daily-loop-FNovp4`.
- Personally inspected every visual family at small width, plus Contact contrast,
  large-phone comparison/timing scenes, desktop and Focus representatives.
  Short 320x568 Contact card inspected separately; scrolling remains intentional.
  Prior Runaround enlarged-text evidence applies to identical typography/styles.
- Refresh/resume, immutable replay, stale-tab/midnight, storage-unavailable,
  desktop Focus and catalogue/Home separation passed. Evidence:
  `/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-daily-edges-pghtqL`.
- Unchanged connected tennis/audio/source evidence retained from previous releases;
  no claim of another independent coach or physical-iPhone audio review.

## Release status

Engine `2026-09-13.gold-daily.24`, loader `20260913-gold-daily-54`.
Production READY: `dpl_CisQbjC5qe8mnC4sGRMcdFqP6Tfk` at
https://www.gamesharptennis.com/. Canonical static HTML/JS, build 252ms; no Git
commit because the workspace is not a repository. Existing Vercel login worked.

Public 390x844 Home/Serve Daily → Predict seq_001 → both Live Point branches →
exact Playbook → Daily passed, zero failed paths. Evidence:
`/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-connected-review-eEalLc`.
Four affected public files byte-identical to the reviewed candidate:

| File | SHA256 |
|---|---|
| index.html | 47ba2abbbd0519b032e2e560069c826a3e2af2c0025089fac11c1e5bacfdd564 |
| gold-daily-prototypes.js | af634ee73284868e318c7122c2397b34c3cec91a6d40c0cd2016e729ed0424f0 |
| gold-daily-prototypes.css | 6971371d2d9e85dba46e261df49ffefad065b1878c971d5fcb2e6f936672c9c3 |
| LAUNCH_MANIFEST.json | 0de509a3174e97e1301f80471f049d6e2eeb9bcddd32ffee43f367ebd68a2d6e |

Only documentation was updated after publishing; runtime remained unchanged.
No measured learning/retention claim. Production server logs/drains and ongoing
monitoring are not part of this layout verification.
