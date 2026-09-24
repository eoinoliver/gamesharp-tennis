# Gold Daily calendar pilot — 12–13 September 2026

## Scope and boundary

User authorised implementing the smallest daily loop around the existing nine,
then reiterated “proceed” on 13 September. Main Daily is **not replaced**.
The scheduled pilot is `?goldDaily=today`; the nine-lesson catalogue remains
`?goldDaily=1` and now links to it.

- Nine stable lessons rotate by civil local date, starting 12 September with
  Line. The nine-day repetition is disclosed. No random filler or extra lessons.
- One browser-local store, `gs_gold_daily_loop_v1`, keeps up to 90 days of
  checkpoints and completion. Refresh resumes; first answers cannot be rewritten
  by replay or a conflicting tab. Replay is labelled practice.
- An overnight idle tab shows the new title before launch. A lesson completed
  across midnight remains attached to its starting date.
- Blocked/corrupt storage falls back to page-memory progress with an explicit
  warning. This is not cross-device persistence or retention measurement.
- Exact optional connections reside on canonical lesson spines: Line → seq_015;
  Serve → seq_001; Short Ball → seq_013; Return → seq_002. Live Point and Playbook
  IDs are checked against the reviewed integration before offering the link.
  Five lessons intentionally have no Predict substitute.
- All nine offer their canonical Sharpen region. Region entry and return were
  checked; legacy prescriptions have **not** received renewed content approval.
  No Sharpen redesign or on-court-practice claim was added.
- The existing nine lesson definitions, including authored animation data,
  compared byte-for-byte equal to the public pilot on 12 September. Added CSS is
  confined to the calendar and new disclosure controls. No lesson expansion.

## Verification

- 46/46 structural tests; trust audit: zero errors, one existing warning for
  366/549 legacy answer-length tells.
- Nine lessons, 27 decisions at each of 320×844 and 430×844: complete correct and
  incorrect runs, matching Sharpen regions, return to Daily, persisted completion.
  Original matrix included normal motion at 320 and reduced motion at 430.
  Final shell/source-binding matrix repeated all 18 paths with reduced motion.
- Four Daily continuations at both widths: all eight Predict → Live Point paths,
  both Live Point branches, first-result immutability, visibly correct Playbook
  cards and return to Daily. Fixtures establish prior Daily completion; separate
  daily matrix walks the real completion UI.
- Browser edge checks: reload/resume, immutable replay, idle-tab midnight,
  mid-lesson midnight, blocked storage, catalogue isolation, unchanged main entry.
- Desktop 1280×844: calendar, complete lesson, Focus and result inspected.
- Existing renderer/content evidence is reused for unchanged lesson stages.
  Not a new independent coaching approval or a physical iPhone audio test.

Evidence directories:

- `/private/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-daily-loop-EWqumH`
- `/private/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-daily-loop-jlIYj5`
- `/private/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-connected-review-nSbq1E`
- `/private/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-daily-edges-dPH4gj`

Reusable checks: `tools/gold-daily-loop-browser.mjs`,
`tools/gold-daily-loop-edge-browser.mjs`, and the `daily` mode of
`tools/connected-journey-browser.mjs`. `GS_BROWSER_BIN` selects an installed CLI,
avoiding repeated package-manager/network setup.

## Candidate identity

Loader `20260912-gold-daily-49`; renderer `2026-09-12.gold-daily.20`;
spines `2026-09-12.lesson-spines.10`; calendar `2026-09-12.daily-loop.1`.

SHA-256:

| File | SHA-256 |
|---|---|
| index.html | c8df81fe84b9dd531c0dd3f6bbedb75b33cecff27d03cc61bb7e4a0e5cb3055b |
| gold-daily-prototypes.js | 1ac74afa479413ea9fe99bf823c20507960d20de99f4f19c53eedffad9906ead |
| gold-daily-prototypes.css | bfbd9f315b0952d69698aaf77131eca143be4b554a70c5c7a8a8424b84ff3304 |
| gold-daily-lesson-spines.js | 6f8390d54e32025cff64bc600c8d8d2ae60da5b7daddbe28439e01cb3be2e351 |
| gold-daily-loop.js | 737132876919ebbde53bee725d0075b02d0704239f1db093d7cadf0feade907b |
| LAUNCH_MANIFEST.json | 60eb94ae54e786df0302eaa02d6fa6f21a91ed7cc3121c6e1f6d62212cefe504 |

## Deployment

Final optional-media check passed on 13 September: normal-motion Serve lesson,
sound preference on, audio route aborted, all three decisions completed and
saved to the correct day; no captured runtime errors.
The 12 September run was interrupted by an approval-service usage limit; it did
not deploy this candidate.

Deployed and verified on 13 September 2026:

- URL: https://www.gamesharptennis.com/?goldDaily=today
- Target: production; status: READY.
- Deployment: `dpl_iRK5wb7MUDFR6G242MCM5aRxZ98S`.
- Deployment URL: https://gamesharp-tennis-qoii74djb-eoinlynn-5978s-projects.vercel.app
- Framework: existing static HTML/JavaScript; remote build 240ms.
- Commit: not applicable; canonical directory is not a Git repository. Reviewed
  artifact identity is the six SHA-256 values above.
- Existing authentication: `eoinlynn-5978`; no fresh login required.
- All six public files above matched the local candidate byte-for-byte.
- Public 390×844 journey: actual three-decision Serve Daily completion → seq_001
  → both Live Point branches → visible wide_serve Playbook → Daily return PASS.
  Evidence: `/private/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-connected-review-UWFAHW`.
- Post-deployment monitoring: bounded browser/file checks only. No claim of
  continuous monitoring, configured drains or a full production-log audit.

This release record was updated locally after publication; runtime files were
not edited after their final review. The `daily-full` browser-tool option was
added locally for the post-deployment real-completion walk.

## Still unproven

Independent coach review, physical iPhone listening, target-player comprehension,
unprompted return and durable learning. Nine built lessons and 15 research briefs
remain the inventory. Zero main-Daily promotions. Next product decision is informed
by a real pilot trial, not by treating automated checks as learning evidence.
