# Runaround guided coaching card — 13 September 2026

User approved option 2, first on Runaround only. This is not approval to extend
the treatment across all twelve lessons. Inventory remains 12/24 playable,
12 research briefs; Predict eligibility remains 9/20 with 11 withheld.

## Change

All three Runaround decisions now read: lesson title and N of 3, readable setup,
authored evidence, question and four choices. The tiny authoring phase is removed
from the card. Opening copy is now “Your slice buys time. Your forehand is your
stronger attacking shot.” / “How should you use that extra time?”
Setup 16px, question 22px, choices 14px with at least 48px targets. Court card is
capped at 340px; Focus remains unchanged. Small-height scrolling is permitted;
content is not hidden to force one-screen fit. Screen-reader question associates
the setup via aria-describedby. Other eleven lessons retain the existing shell.
No geometry, timeline, scoring, persistence, calendar or connection changes.

## Evidence

- 60 automated tests passed; trust audit zero errors, unchanged 366/549 legacy
  length-tell warning. Initial CSS namespace failure corrected, suite rerun green.
- Runaround Home/three decisions/Focus/completion/Sharpen/return passed at
  320x844 (wrong answers), 430x844 (correct/reduced motion), 1280x844 (correct).
  Evidence: `/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-batch-three-aySXKE`.
- Three-decision hierarchy and touch-size checks passed at 320x568, 390x844,
  430x932 and 1280x844. Normal 390/430 phones show all four choices without
  scrolling. 320x568 may scroll. Doubled text remains reachable with no horizontal
  overflow; this is a browser text-size simulation, not a physical-device test.
- Initial native automation Next click did not advance once; fresh manual native
  clicks advanced correctly. Layout-only harness uses DOM clicks; do not present
  those as physical taps. A later browser CDP disconnection interrupted desktop;
  desktop and enlarged-text checks were rerun successfully. Final extra evidence:
  `/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-coaching-mYvbQv`.
- Rendered small-phone contrast/transfer, large-phone opening, answered Focus,
  desktop and enlarged-choice screenshots personally inspected.
- Neighbour Middle Return retains existing shell. Unchanged tennis/source/audio
  evidence remains in the preceding batch release; not a new coaching audit.

## Release

Engine `2026-09-13.gold-daily.23`; loader `20260913-gold-daily-53`.
Production READY: `dpl_GsCrxYBWRQkA8UMCAb32M1nzkrM4`, canonical static HTML/JS,
549ms build, no Git commit (workspace is not a repository).
URL: https://www.gamesharptennis.com/?goldDaily=runaround
All four changed public artifacts byte-identical to the reviewed candidate:

| File | SHA256 |
|---|---|
| index.html | 0cb365b2c1cc78649decb9f02066b8790c96283e8fa4ab97b7ad998511d6a5f7 |
| gold-daily-prototypes.js | 56f1dbd9d679826b8daa112dfb47fbca1132ad4e387d3666a40d5092bb208d13 |
| gold-daily-prototypes.css | 5b79af0d3b2833e08094482762bf872d4a5815553b493753dcfcbb40d80a3d4a |
| LAUNCH_MANIFEST.json | c6003a14ff4b866c8e6658b3c4cf5a75d0a4f52964017ee82824a936a4ac7078 |

Public 390x844 Home/Runaround/three decisions/Focus/completion/credit/Sharpen/return
passed using the explicit 21 September test clock in a disposable profile. No
captured browser errors. Evidence: `/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-batch-three-zM96nt`.
Separate native-click local journey completed all three decisions and Barty result.
No production server-log/drain inspection or continuous monitoring was performed.
Only documentation was updated after deployment; runtime files stayed unchanged.
Independent coaching approval and measured comprehension/retention are still
unproven. User judgment of this layout is the gate before any broader rollout.
