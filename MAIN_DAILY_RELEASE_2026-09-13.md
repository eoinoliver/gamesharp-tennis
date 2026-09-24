# Main Daily replacement — 13 September 2026

## Authorised outcome

The user approved replacing the old Daily with the nine Gold lessons, not another
pilot phase. Today’s Challenge now opens the one-insight/three-decision format.
The competing Home preview link is removed. Predict remains the secondary Home
entry. The catalogue query remains a review tool, not a competing Home choice.

All normal `startDailyChallenge` and `runStandardDaily` paths use the new format.
The old recovery builder remains in source for rollback; unavailable new assets
never cause a silent fallback to it. `?goldDaily=today` remains a direct alias.

## Progress contract

- Existing legacy completion dates, totals and streak are preserved in place.
- `gs_gold_daily_loop_v1` preserves pilot/lesson checkpoints and original answers.
  It does not retroactively confer main-Daily credit for earlier pilot activity.
- `gs_main_daily_history_v1` records first main-format results separately.
- A completed three-decision main lesson earns at most one credit per date.
  An already-completed old Daily on that date retains its credit; the new format
  records its own lesson result without adding a second day or completion count.
- Replays preserve first main answers and do not increase the total or streak.
- Web Locks serialize simultaneous completions in supporting browsers; the
  existing storage checks also guard sequential/repeat requests.
- Midnight completion stays attached to the lesson's starting date. It cannot
  move a newer streak date backwards. Home refreshes its displayed streak and
  current lesson; returning to the visible page refreshes the calendar title.
- Storage failure is explicitly reported; no cross-device sync or physical
  mastery is claimed. Earlier history is not deleted or relabelled.

## Verification and exact scope

- 55/55 tests. Includes active-main routing, legacy-credit preservation,
  partial-completion rejection, duplicate/replay credit, concurrent completion
  locking, midnight and both visible Home streak counters. Existing recovery
  tests also remain as rollback-source regression checks, not a claim that the
  active Daily still has four questions.
- Trust audit: zero errors; unchanged legacy debt of 366/549 answer-length tells.
- All nine lessons from the Home button at 320×844 and 430×844: 18 full runs,
  correct/incorrect choices, card and Focus, main completion credit, exact Sharpen
  region and return. Normal motion at 320; reduced motion at 430.
- Four exact continuations at both widths: eight full Gold Daily → Predict → both
  Live Point branches → exact visible Playbook → Daily return paths.
- Final edge pass: refresh/resume, immutable main history and counts, idle-tab
  midnight, mid-lesson midnight, blocked storage, desktop complete lesson and
  Focus at 1280×844, catalogue separation and default Home entry.
- Required-asset failure checks: stylesheet, lesson engine, main adapter, calendar
  and spines each withheld safely. Fresh browser profiles were required to avoid
  invalid cached-script test results. Normal-motion completion with sound on and
  optional audio blocked passed without captured runtime errors.
- Lesson definitions, authored geometry, evidence timings, professional stories,
  and the four existing connected-point mappings were not rewritten.

Evidence:

- `/private/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-daily-loop-6Vr9EI`
- `/private/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-connected-review-9yQIc7`
- `/private/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-daily-edges-CWEwse`
- `/tmp/gs-main-home-visible.png`

## Release boundary

Nine lessons promoted. Fifteen remaining curriculum items are still research
briefs. Four lessons have exact Predict continuations; five intentionally do not.
Sharpen region navigation is verified; its legacy prescriptions were not renovated
or comprehensively reapproved. Independent coaching review, physical iPhone
listening and measured learning/retention remain unproven.

The connected-point release/version stays unchanged because its runtime content
did not change. The new main release is identified by loader
`20260913-gold-daily-50`, lesson engine `2026-09-13.gold-daily.21` and main adapter
`2026-09-13.main-daily.1`. The manifest's `daily` record describes the promotion.

## Deployment

Deployed and publicly verified. Canonical source:
`/Users/eoinlynn/Downloads/gamesharp-tennis-integration`.

- URL: https://www.gamesharptennis.com/
- Target: production; status: READY.
- Deployment: `dpl_AGVTtSeFzTXNGzRs7iwuoX6BUfN4`.
- Deployment URL: https://gamesharp-tennis-lwafmuzbi-eoinlynn-5978s-projects.vercel.app
- Framework: static HTML/JavaScript; remote build: 208ms.
- Commit: not applicable (canonical folder is not a Git repository).
- Existing authenticated account: `eoinlynn-5978`; no new login.
- Seven public runtime/manifest files matched the reviewed candidate byte-for-byte.
- Public 390×844: real Home button → three-decision Serve completion → Predict →
  both Live Point branches → exact wide_serve Playbook → Daily → Home. Home showed
  completed/replay, streak 1, no competing preview entry. No captured runtime errors.
- Public evidence: `/private/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-connected-review-WGxe5T`
  and `/tmp/gs-main-production-home.png`.
- Observability: bounded browser/file verification; continuous monitoring and
  drains were not configured or audited. No full production-log audit is claimed.

Reviewed SHA-256 values:

| File | SHA-256 |
|---|---|
| index.html | 35c1e219a6ff0d0dc83e5f06fa601f3f7bfe88f896b5098aa488238ea5726cda |
| gold-daily-prototypes.js | 75b6285f190fa8d47ca8ac9ccd50fc4dc82f3940e0f2a539a6f5657a55a61676 |
| gold-daily-main.js | bf0c32618ab939eabab7389b572603d0cfcd529e399ba5709c8c167053634f5c |
| gold-daily-loop.js | 737132876919ebbde53bee725d0075b02d0704239f1db093d7cadf0feade907b |
| gold-daily-lesson-spines.js | 6f8390d54e32025cff64bc600c8d8d2ae60da5b7daddbe28439e01cb3be2e351 |
| gold-daily-prototypes.css | bfbd9f315b0952d69698aaf77131eca143be4b554a70c5c7a8a8424b84ff3304 |
| LAUNCH_MANIFEST.json | bcc85150d9c0995f9c00d1a099da9c5a7b38648505b82e8457d736f9e75f3bbc |

Release documentation and the browser tool's explicit Home-entry verification
were updated locally after publication. Runtime files did not change afterward.

## Next bounded work

Author the next three lessons against genuine curriculum gaps, keeping this main
experience stable. When expanding the calendar, introduce a dated schedule version;
never change the old rotation in a way that reinterprets past completion dates.
No broad legacy or Sharpen renovation is part of this release.
