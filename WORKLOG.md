# GameSharp Tennis shared worklog

## 2026-09-24 — Git migration — Codex owns this task

- Branch: `codex/tennis-git-migration-2026-09-24`, based on GitHub `main`
  `cc765097404aedd8d7412705a2dca2fe4e23ca89`.
- Eoin authorised migration after verified preservation. Production release
  still requires “ship it” for the exact named preview version.
- Canonical directory stays in place. All 214 existing file hashes matched
  immediately after Git initialisation. GitHub-only `tactical-lab.html` is
  retained under `Legacy Versions/GitHub-main-cc76509/`, outside deployment.
- Baseline: 224/224 tests pass; all 30 reviewed dependency hashes match.
  Existing live deployment: `dpl_EBEYezrjLafgyLZcF2RC1JSHK2Px`.
  Vercel Git branch `main`; automatic custom production domains disabled,
  freshly verified through the authenticated API on 24 September.
- Scope: publish the current source and existing history on this task branch,
  document the settled release/handoff procedure, enable exact Git preview
  targets in verification tools, prove Git deployment boundaries and parity.
- Status: in progress. No main push, merge, production release or Desktop
  reconciliation authorised by this log. No second agent writes this checkout.

### Verification checkpoint

- First Git commit `9ab9ffa4905f17f8177187d880ccb1ba9e401245` pushed and
  verified. GitHub `contracts` and `Vercel` checks passed. Preview:
  `dpl_8X7TroxcgHeKDtaisWYBFpgaRzgq`,
  https://gamesharp-tennis-hg0mhfwb8-eoinlynn-5978s-projects.vercel.app .
- 46 static/dependency files retain canonical content. Preview HTML receives
  only Vercel's identified 163-byte Feedback script. All six retired pages,
  query variants, 28 eligible shares and 22 withheld/unknown share probes pass.
- All nine Predict journeys pass at 320×844 and 430×844 (18 runs), including
  both Live branches, Focus, immutable results and exact Playbook destinations.
  No reported document overflow; final browser errors empty. Representative
  screenshot inspection supports this automated walk, not physical-device or
  independent coaching certification.
- The first Git preview exposed `.github/workflows/checks.yml`. Add only
  `.github/` to deployment exclusions. Independent scoped review found all prior
  rules and the other 29 reviewed dependencies unchanged. Update only that
  configuration fingerprint with the review record; verify the new hosted 404
  before presenting the candidate as complete.
- Independent review also moved the domain-assignment/rollback-baseline safety
  check before the merge, so a changed setting cannot release prematurely.
- Court-check browser checks in progress. GitHub browser sign-in is needed to
  create the PR and enforce branch protection. Main remains the unchanged August
  commit, unprotected; no merge or production cutover has occurred.

### Review checkpoint — preparation complete, release awaiting Eoin

- Corrected commit `5978b638edc83351e93f5fc024cb43690878520d`, preview
  `dpl_6ntN9jbaSiki63q1Lvv6LvM8BmHL`,
  https://gamesharp-tennis-7x8zgkv6g-eoinlynn-5978s-projects.vercel.app .
  All 121 HTTP/content/boundary checks pass. `.github/workflows/checks.yml`
  now returns 404. Canonical HTML plus only the identified Vercel Feedback
  suffix is accepted on previews; all other static files match raw hashes.
- All 225 structural tests and required GitHub checks pass. All 15 selected
  additional-court and seven forehand browser cases pass across the initial
  runs and isolated reruns. Earlier navigation/command timeouts are retained in
  evidence; none remain unresolved. All four full court-check paths were
  exercised at 320×740, 430×844 and 1280×844. This is a selected browser suite,
  not a new certification of every device or every visual frame.
- Draft PR: https://github.com/eoinoliver/gamesharp-tennis/pull/1 . GitHub sign-in
  is resolved. Main branch protection is now enabled for everyone, requiring
  pull requests, current branches, and `contracts` (GitHub Actions) and `Vercel`
  checks. Direct pushes, force pushes, deletion and administrator bypass are
  not permitted. Eoin's preview/“ship it” remains the human release approval.
- This checkpoint changes documentation only. Its Git preview must still be
  checked for the correct SHA and unchanged served runtime before Eoin reviews
  it. Final SHA/deployment mapping and full local evidence live in
  `/Users/eoinlynn/Downloads/tennis-git-migration-2026-09-24/` and the PR.
- Status: pushed/review preparation complete; **not merged or deployed**.
  Codex retains Tennis ownership. Next: Eoin reviews the exact final preview
  and says “ship it”; then the recorded pre-merge safety check, staged Git
  production verification, promotion of that same deployment and live check.
  No Desktop archiving, deletion, Golf or PropPocket migration has occurred.


## 25 September 2026 — approved unlisted 3D beta

- Owner: Codex; branch `codex/tennis-unlisted-3d-beta-2026-09-25`, based on
  reviewed migration candidate `1ca9212538afef8dc3a496c144967dd3d89209b6`.
- Eoin explicitly approves publishing the five supplied, checksummed static
  pages under `/beta/`, unlinked from Home. Preserve source pages unchanged.
- This is an authorised pre-cutover CLI Production stage → verify → promote
  release. It does not merge migration PR #1 or complete the Git cutover.
- Verify manifest after copy, noindex, relative navigation, main-app audit
  boundaries, staged HTTP hashes and mobile browser interactions on all pages.
  Physical-phone testing is not available from this Mac session.
- Main application files/configuration remain unchanged. Skip the optional
  response header: every supplied page already has noindex,nofollow.
- Rollback baseline remains `dpl_EBEYezrjLafgyLZcF2RC1JSHK2Px`; confirm before
  promotion. Main-app static/function comparisons support the scoped release;
  do not claim complete platform/runtime equivalence from HTTP samples.
- Status: preparation started; not yet staged or promoted.

### Pre-stage checks

- All five SHA256SUMS match after copy; embedded scripts parse. Every page has
  noindex,nofollow; relative menu/back links resolve. No automatic external
  resources other than Google Fonts, and no storage/analytics calls found.
- Existing CI scopes named main-app HTML, so no audit exclusions or page edits
  are needed. All 225 tests, trust/connected/share audits and all 30 existing
  reviewed fingerprints pass. Every previously tracked file other than this log
  is unchanged, including main index.html, api/share.js and Vercel config.
- Evidence: `/Users/eoinlynn/Downloads/tennis-beta-3d-release-2026-09-25/`.

### Published and verified — 25 September 2026, 04:55 UTC

- Eoin's explicitly approved beta is live at
  https://www.gamesharptennis.com/beta/ . Menu and four lesson pages retain the
  exact supplied SHA-256 hashes and noindex,nofollow. No Home link was added.
- Released source: `d9c107f0802a53f9b07897d04afa73bdbd6a6d8d` on this branch.
  Staged Production deployment `dpl_5gv8gtyKMthe23yDpsf2gNVubCZ6` was verified
  and then promoted without rebuilding. Vercel reports this same ID as current
  Production, READY/PROMOTED; automatic custom-domain assignment remains off.
  Prior deployment `dpl_EBEYezrjLafgyLZcF2RC1JSHK2Px` remains the rollback.
- All 69 staged and all 69 unauthenticated public HTTP checks pass. Public beta
  bytes match the approved originals, existing checked static app bytes and four
  sampled share responses match the recorded previous live responses. The apex
  beta URL resolves to the www beta. Twelve source/retired-path probes return 404.
- All four lessons completed at 390px; menu, narrow 320px, controls, navigation
  and selected landscape views passed. Serve's Live Point and alternate finish
  passed. No observed console errors or horizontal overflow. These are Chromium
  mobile viewport checks, not a physical-phone test.
- Uploaded source comparison: five beta additions, no removals, 57 unchanged
  prior source files including the function and dependencies. Two prior source
  files differ: the previously reviewed `.vercelignore` exclusion and
  `TRUST_REPAIR_EVIDENCE.json` record. All 64 uploaded source identifiers match
  canonical file hashes. No other app-source change was introduced here.
- Complete generated function-bundle identity is not established: Vercel reports
  5,024 versus 4,992 bytes, a different digest and managed layer 1_51_6 versus
  1_51_5. Those observations do not prove the cause of the difference. Source and
  sampled responses match; no claim of full runtime equivalence is made.
- **Git migration remains pending.** Main is still `cc76509`, and draft PR #1
  remains unmerged. Candidate `1ca9212` omits this now-live beta: integrate this
  branch's beta into a fresh migration candidate and review it before cutover.
  Do not release the old candidate as though it contains `/beta/`.
- Lab handoff separately pushed `claude/3d-prototypes-2026-09-24` to private
  `eoinoliver/gamesharp-lab`, tip `35500c731fb44b010d65ee7a9c52a6b0aa8b2a4b`.
  Fresh clone verified 387/387 manifest entries, 388 tracked files and Git fsck.
  Its main and canonical checkout are unchanged; transfer bundles remain.
- This completion entry is documentation only; it does not change the released
  source SHA or cause another Production deployment. No deletion or archiving.

## 25 September 2026 — beta menu navigation repair

- Owner: Codex; branch `codex/tennis-beta-navigation-fix-2026-09-25`.
- Eoin reports every lesson fails from the menu. Reproduced: `/beta` serves the
  menu without redirecting to `/beta/`, so its four bare filename links resolve
  to the site root and return 404. Previous checks used the trailing slash and
  missed this ordinary entry route.
- Repair only the four menu destinations to `/beta/<lesson>.html`. Lesson pages,
  main app, noindex, Vercel config and reviewed fingerprints remain unchanged.
  This corrects navigation for the already approved beta; it is not Git cutover.
- Verify actual clicks and back navigation from `/beta`, `/beta/` and
  `/beta/index.html` on the staged Production build and live after promotion.
  Preserve existing app byte checks and record the exact deployment/commit.
- Rollback baseline: `dpl_5gv8gtyKMthe23yDpsf2gNVubCZ6`; recheck before promotion.
  Originals and prior deployment evidence remain. Status: fix prepared.

### Navigation repair published and verified

- Source `be3ddcb0e14ae725d1c8ce1f2853995aca12e7a8`; staged Production
  `dpl_Bqmjy3UZtLxUJ9UvSmn6xqY2RAAp` verified and promoted without rebuilding.
- All 225 tests and trust audit pass. All 70 staged and 70 public HTTP checks
  pass. On both staged and live builds, all 12 actual menu → lesson → back paths
  pass from `/beta`, `/beta/` and `/beta/index.html` at 390px. No observed console
  or page errors. These are browser viewport checks, not a physical-phone test.
- Only the four menu links differ from the approved transferred pages. All four
  lessons retain their original hashes; Home, main app and configuration remain
  unchanged. Corrected menu SHA-256:
  `e63151dfa9084fe1b6a79cebad343596cb89f76f5a67dee5156c9d71a2934976`.
- Future copies from Claude's source must retain these fixed destinations. Git
  migration is still pending and must include both the beta and this repair.
- Evidence: `/Users/eoinlynn/Downloads/tennis-beta-navigation-fix-2026-09-25/`.
  This completion entry changes documentation only; no additional promotion.

## 26 September 2026 — approved unlisted 3D beta v2 release

- Owner: Codex; branch `codex/tennis-beta-v2-release-2026-09-26` based on the
  verified live beta/navigation line `21ec80e`. The separate Short Ball review
  remains on its own preserved branch and is not part of this release.
- Eoin explicitly approved updating live `/beta` with the five v2 HTML files in
  `~/Projects/gamesharp-beta-3d`, following BETA_HANDOFF.md v2 and the same release
  routine. All five source SHA-256 values match the handoff and SHA256SUMS.
- Copied the four lessons byte-for-byte. Retained the four established menu href
  corrections (`/beta/<lesson>.html`); the supplied relative hrefs would restore
  the known slashless `/beta` 404 bug. No lesson content was edited.
- V2 adopts the Daily lesson layout, reorders Short Ball with the trap first and
  omits Serve +1's Live Point pending its own layout pass, as approved in v2.
- This is the existing pre-cutover stage–verify–promote route, not Git migration.
  Main remains `cc76509`. No main push/merge or cutover is included.
- Rollback baseline freshly confirmed: Production
  `dpl_Bqmjy3UZtLxUJ9UvSmn6xqY2RAAp`, source `be3ddcb`, READY;
  `https://gamesharp-tennis-p48y95rm7-eoinlynn-5978s-projects.vercel.app`.
  Automatic custom production-domain assignment remains disabled.
- Evidence: `/Users/eoinlynn/Downloads/tennis-beta-v2-release-2026-09-26/`.
  Status: verifying approved files, main-app preservation and staged journeys.
- Initial staged build `dpl_5N585D2DWTkW94q5mRHjGUjVBHYr` passed 83 HTTP checks,
  but independent native browser checks on Serve and Short Ball found a replay
  dead end: Replay during the chosen consequence replaced its feedback callback
  with null, leaving no Next button or enabled choices. It was not promoted.
- Corrected only the shared playback blocks in all four lessons: preserve pending
  feedback on Replay, cancel stale delayed callbacks when starting another run,
  and disable choices until an unanswered replay reaches its decision freeze.
  Eoin was informed during release work. This is a documented repair to make the
  approved v2 usable, not a change to its layout, tennis content or scene data.
- Source checksums remain recorded in approved-files.json; final served checksums
  are separately recorded in release-files.json and playback-repair.json. A
  normalised-source comparison proves all content outside run/tick/replay is
  byte-identical to the supplied four lessons. Main reviewed fingerprints remain
  unchanged. Re-staging and repeating the affected browser checks before promotion.

### V2 published and verified — 26 September 2026

- Live: https://www.gamesharptennis.com/beta/ . The menu and all four v2 lessons
  are published, retain noindex,nofollow, and remain unlinked from Home.
  Serve +1's Live Point is intentionally absent from this supplied v2 release.
- Released source: `0fab1c4c8ab628a03056cc3b9f81277525d5c42c` on
  `codex/tennis-beta-v2-release-2026-09-26`, pushed and remote SHA verified.
  Exact staged Production artifact:
  https://gamesharp-tennis-b8wo82nf1-eoinlynn-5978s-projects.vercel.app
  (`dpl_BtDqBy2jTgRduVfEvZVfnCNPHT29`). Verified before promotion and promoted
  without rebuilding. The production API confirms this ID as current and
  READY/PROMOTED; automatic custom-domain assignment remains disabled.
- All 83 staged and all 83 unauthenticated public HTTP checks pass: seven beta
  routes (four lessons and three menu entry forms), 47 existing app static
  routes, 25 excluded routes returning 404, and four sampled share routes.
  Beta bytes match the recorded final release hashes. Existing checked static
  bytes and sampled share responses match the recorded pre-release baseline.
  This does not establish complete generated function-bundle equivalence.
- All four lessons completed their three decisions on the corrected staged
  artifact. Serve B/B/B and Short Ball D/B/B completed with 3/3; Line and Winner
  deliberately included a wrong first answer, an alternate demo and a 2/3
  finish. Replay during a chosen consequence and its 220ms completion gap was
  retested successfully on Serve and Short Ball. Camera, pause/resume, Why,
  fullscreen, restart and back navigation were exercised. Initial narrow and
  desktop checks of unchanged layout blocks are identified separately in the
  evidence, rather than claimed as reruns of every check after the repair.
- On the public deployment, Winner completed all three decisions, including
  wrong-answer/demo behavior, with the first answer preserved. All 12 actual
  menu-to-lesson-and-back paths passed from `/beta`, `/beta/` and
  `/beta/index.html`. The public browser report contains 23 passing checks,
  including 390px, narrow 320px and 1100px views, with no reported page errors.
  These are Chromium viewport checks, not physical-phone or Safari testing.
  Supplied v2 uses ordinary vertical scrolling on smaller screens.
- All 225 structural tests pass; trust audit has zero errors and its existing
  length-tell warning. Connected/share audits and all 30 previously reviewed
  fingerprints pass. Only the five beta pages and WORKLOG differ from the
  prior live source line; main application/configuration are unchanged.
- Rollback retained: `dpl_Bqmjy3UZtLxUJ9UvSmn6xqY2RAAp`,
  https://gamesharp-tennis-p48y95rm7-eoinlynn-5978s-projects.vercel.app .
  Original v2 files remain intact. The exact playback patch and a Claude handoff
  are retained in the evidence folder for future generation of these pages.
- Git migration remains pending. Remote main is still
  `cc765097404aedd8d7412705a2dca2fe4e23ca89`; no main merge/push occurred.
  A future migration candidate must include this live v2 and its two repairs.
  The separate Short Ball review prototype remains excluded and preserved.
- Completion record owner: Codex, documentation branch
  `codex/tennis-beta-v2-release-log-2026-09-26`. This entry changes documentation
  only and does not create another Production deployment. No deletion or
  archiving occurred. No work remains for this approved v2 publication.
  Evidence: `/Users/eoinlynn/Downloads/tennis-beta-v2-release-2026-09-26/`.


## 27 September 2026 — approved unlisted beta v3

- Owner: Codex; branch `codex/tennis-beta-v3-release-2026-09-27`, based on
  verified live v2 and its completion log (`3b347f4`). Eoin explicitly approves
  copying and publishing all five v3 files using the existing pre-cutover
  Production stage → verify → promote routine. Git migration is not included.
- All five source files passed `shasum -a 256 -c SHA256SUMS` before copying.
  V3 adds the 2×2 choices, compact phone layout, ball-ending change, running
  poses, end-screen attribution and dedicated play/pause/fullscreen controls.
- Retained two previously shipped repairs omitted by the supplied v3: four
  `/beta/`-absolute menu destinations and callback-safe run/tick/replay blocks.
  Eoin was informed. All other supplied v3 content is unchanged. Original
  source remains intact; source and release hashes are separately recorded.
- Rollback: `dpl_BtDqBy2jTgRduVfEvZVfnCNPHT29`, source
  `0fab1c4c8ab628a03056cc3b9f81277525d5c42c`,
  https://gamesharp-tennis-b8wo82nf1-eoinlynn-5978s-projects.vercel.app .
  Fresh project inspection confirms this is current Production and automatic
  custom-domain assignment remains disabled. Remote main is still `cc76509`.
- Check all four staged lessons at 390×664: 2×2 choices, final ball disappearance,
  play/pause and camera in normal/fullscreen views, and Next reachable without
  scrolling. Native phone hardware is unavailable; browser viewport verification
  will be clearly distinguished from physical-phone testing. Keep noindex and
  no Home link, main-app byte checks and known private-route exclusions.
- Evidence: `/Users/eoinlynn/Downloads/tennis-beta-v3-release-2026-09-27/`.
  Status: copied and preserving prior fixes; not yet staged or promoted.

### V3 published and verified — 27 September 2026

- Live: https://www.gamesharptennis.com/beta/ . All five pages retain
  noindex,nofollow; no Home link was added. All original v3 source checksums
  verified before copying. The supplied folder remains intact.
- Released source `88a412f1b8be826ff73a7b1299974bbd273205e6` on
  `codex/tennis-beta-v3-release-2026-09-27` is pushed and remote-verified.
  Production artifact `dpl_Fe2ubNLwWfKTbaf6T4BiCsmLTCAR`:
  https://gamesharp-tennis-j9yuc4mnh-eoinlynn-5978s-projects.vercel.app .
  Staged using `deploy --prod --skip-domain`, verified, then promoted without
  rebuilding. The production API confirms this exact ID as READY/PROMOTED;
  automatic production-domain assignment remains disabled.
- All four staged lessons completed all three decisions at 390×664: Serve BBB,
  Short Ball DBB, Line BBB and Winner BAC (deliberately including a wrong answer
  and a better-option demo). Every tested decision showed a 2×2 option grid;
  every tested feedback's Next button was inside the viewport with scrollY=0.
  The lowest tested Next edge was 648px within the 664px viewport. Play/pause
  and camera worked in normal and fullscreen views, and the question returned
  automatically to normal view. Final balls disappeared with outcome markings
  remaining. Replay recovery, Why, selected wrong/demo/retry paths and desktop
  coherence passed; first recorded answers stayed intact while exploring.
- All 83 staged and 83 public HTTP checks pass. All beta bytes match the recorded
  delivered hashes; 47 checked existing app static routes and four sampled
  share responses match the pre-release live baseline. Twenty-five excluded
  routes return 404. This does not prove complete generated-function identity.
- Public verification completed Winner's three decisions and all 12 actual
  menu → lesson → back paths from `/beta`, `/beta/` and `/beta/index.html`.
  All 22 public browser checks passed with no page errors. All 225 structural
  tests, required audits and 30 reviewed fingerprints pass; the trust audit's
  existing length-tell warning is unchanged.
- Deployment error-level logs returned two Node DEP0169 `url.parse()`
  deprecation warnings on sampled share requests; their 200 and deliberately
  withheld 404 responses were expected and verified. No warning repair was
  included in this beta-only change. Continuous monitoring/drains were not
  assessed; the log query is a bounded observation, not ongoing monitoring.
- Limits: Chromium at phone-sized viewports, not a physical phone or Safari.
  Physical-phone checking remains outstanding. Minor clipping of a court cue
  in Short Ball's Side camera remains; the full cue is readable in the rail.
  The 390×664 no-scroll result covers the tested decision/feedback paths,
  not expanded Why text, end-screen content or every device/font setting.
- Only four beta lessons and WORKLOG changed against the prior live source;
  the menu already contained the retained absolute links. Main app/configuration
  are unchanged. Git migration remains pending; no main push or merge occurred.
  Rollback retained: `dpl_BtDqBy2jTgRduVfEvZVfnCNPHT29`,
  https://gamesharp-tennis-b8wo82nf1-eoinlynn-5978s-projects.vercel.app .
- The exact prior menu/playback repairs and a Claude handoff are in the evidence
  folder, alongside original and delivered SHA256 manifests. Keep those repairs
  in future generated files. No deletion or archiving occurred.
- Completion record: Codex, branch
  `codex/tennis-beta-v3-release-log-2026-09-27`. This documentation-only record
  does not trigger another Production promotion. Evidence:
  `/Users/eoinlynn/Downloads/tennis-beta-v3-release-2026-09-27/`.


## 27 September 2026 — approved beta v4 and Daily option correction

- Owner: Codex; branch `codex/tennis-beta-v4-release-2026-09-27`, based on
  verified live v3 and its completion log (`285a57b`). Eoin explicitly approves
  publishing the nine supplied v4 files through Production stage → verify →
  promote. All nine original SHA256SUMS entries passed before copying.
- Four new unlisted lessons: Recovery, Open Court, Forehand Bill and The Lead.
  Retain the existing navigation repair across all eight menu links and the
  exact prior callback-safe run/tick/replay blocks in every lesson. The user
  was informed; original source is preserved and delivered hashes are separate.
- Separately apply the exact user-requested main Daily edit: The Lead That
  Makes You Smaller, step1 optionA, “Keep landing it shorter, same pace”.
  Only that string in `gold-daily-tradeoffs.js` changes; answer key, outcomes,
  animation model and other content remain unchanged. Scoped dependency review
  and a browser check of the main lesson are required before promotion.
- Rollback baseline freshly confirmed: `dpl_Fe2ubNLwWfKTbaf6T4BiCsmLTCAR`,
  source `88a412f1b8be826ff73a7b1299974bbd273205e6`,
  https://gamesharp-tennis-j9yuc4mnh-eoinlynn-5978s-projects.vercel.app .
  Automatic custom-domain assignment is disabled. This is not Git migration;
  no main push/merge, deletion or archiving is included.
- Verify all eight lessons at390×664: natural playback, 2×2 decisions and
  Next inside the viewport without scrolling. Browser emulation is available;
  physical-phone testing is not. Preserve noindex and no home-page beta link.
- Evidence: `/Users/eoinlynn/Downloads/tennis-beta-v4-release-2026-09-27/`.
  Status: source copied and main wording corrected; not staged or promoted.


## 27 September 2026 — beta v4 published and verified

- Published all nine beta pages (eight lessons), including Recovery, Open Court,
  Forehand Bill and The Lead. All nine supplied source checksums passed. Kept
  the already-shipped absolute menu links and callback-safe Replay fixes in the
  canonical release; source originals remain unchanged. Exact patch and both
  checksum manifests are in the evidence folder.
- Also published the requested main Daily step 1 option A wording:
  “Keep landing it shorter, same pace”. Independent byte comparison proves this
  is the only change to `gold-daily-tradeoffs.js`; answer B, scene model and all
  other lesson content remain unchanged. Updated only its reviewed dependency
  hash, appended the scoped evidence record, and updated the definitions test
  fingerprint for this approved literal change. The other 29 dependency hashes
  and `coachApproval: false` remain unchanged.
- GameSharp Tennis source commit:
  `435768b643d7ac5d01ae7069aac355c0528bc42e`, pushed and verified on
  `codex/tennis-beta-v4-release-2026-09-27`.
  Production artifact: `dpl_GroqYH7sMh41J7Ez2XKMsXgRb1RK`,
  https://gamesharp-tennis-lmcfg6p63-eoinlynn-5978s-projects.vercel.app .
  Built from the canonical folder with `--prod --skip-domain`, verified while
  READY/STAGED, then promoted unchanged. API confirms READY/PROMOTED serving
  https://www.gamesharptennis.com/beta/ with automatic domain assignment disabled.
- All 225 structural tests and required audits pass. Trust audit has zero errors
  and its unchanged length-tell warning (366 of 549). Connected audit: nine
  journeys, 22 scenes, zero failures. Share audit: 20 questions, eight plays.
- Stage and public each pass 87 HTTP checks: exact candidate beta bytes,
  unchanged app bytes except the two documented main/evidence files, noindex,
  menu destinations, public share probes and 25 excluded routes. Home has no beta
  link. This is a source-derived static inventory and sampled function responses,
  not proof of full generated-function bundle equality.
- Phone-sized Chromium at 390 × 664: all eight staged lessons completed all
  three decisions; four choices in 2 × 2; Next reachable at scrollY 0. Normal and
  fullscreen play/pause/camera, automatic return, Replay, and disappearance of
  the final ball passed. New lessons include wrong choice/correct demonstration;
  Recovery's alternative C is accepted without overwriting the first answer.
  Four new desktop openings are coherent at 1100 × 900.
- Stage and public each passed all 24 menu → lesson → back paths across /beta,
  /beta/ and /beta/index.html. Public beta The Lead completed B/C/D for 3 of 3.
  Main Daily completed A/C/D both staged and live, proving A is rejected and B
  highlighted; stage also verified B is accepted after restarting. Zero page
  errors in the sampled browser journeys. Screenshots were visually inspected.
- Limits: no physical phone or Safari test. No-scroll evidence covers the tested
  decision/feedback paths, not every viewport, enlarged text or expanded Why
  panel. No independent physics or coaching approval is claimed. A transient
  immediate fullscreen-exit text repaint in screenshots was rechecked after
  settling; complete text rendered normally. One case-sensitive harness assertion
  was corrected and rerun; no product change was needed.
- Bounded error-level log query returned four Node DEP0169 `url.parse()`
  deprecation warnings on share requests with expected 200/404 responses; the
  same warning class existed before this release. No warning repair is included.
  Continuous monitoring/drains were not assessed.
- Rollback retained: `dpl_Fe2ubNLwWfKTbaf6T4BiCsmLTCAR`,
  https://gamesharp-tennis-j9yuc4mnh-eoinlynn-5978s-projects.vercel.app .
  Git migration remains pending; no main push or merge, deletion, or archiving.
  The earlier read-only content snapshot remains pinned to v3 and was not changed.
- Completion record: Codex on `codex/tennis-beta-v4-release-log-2026-09-27`.
  This documentation-only branch is pushed separately; it causes no new promotion.
  Evidence: `/Users/eoinlynn/Downloads/tennis-beta-v4-release-2026-09-27/`.


## 27 September 2026 — approved beta v5 release claim

- Owner: Codex; branch `codex/tennis-beta-v5-release-2026-09-27`, based on
  verified live v4 plus completion log `7c436158f57adb497eed552386bf3c4bb052521d`.
  Eoin explicitly approved eleven beta files via Production stage → verify → promote.
- All eleven supplied SHA256SUMS pass. Copy all eleven files; add Split Step and
  Approach Volley. Retain ten absolute menu destinations and prior callback-safe
  run/tick/Replay repair, preserving the new pages' noTargets behavior. The other
  eight released lesson pages remain byte-identical to live v4. Originals untouched.
- Main Daily option A is already “Keep landing it shorter, same pace”; no further
  main-app edit is needed. Only menu, two new beta pages and this log should differ.
- Fresh rollback baseline: `dpl_GroqYH7sMh41J7Ez2XKMsXgRb1RK`, source
  `435768b643d7ac5d01ae7069aac355c0528bc42e`,
  https://gamesharp-tennis-lmcfg6p63-eoinlynn-5978s-projects.vercel.app .
  Auto-assign Custom Production Domains remains disabled. No main push/merge.
- Verify all ten complete lessons at390×664,2×2 choices and Next without scrolling.
  Browser emulation only; physical phone/Safari unavailable. Keep noindex/unlisted.
- Evidence: `/Users/eoinlynn/Downloads/tennis-beta-v5-release-2026-09-27/`.
  Status: copied; not staged or promoted.


## 27 September 2026 — beta v5 published and verified

- Published eleven beta files (menu plus ten lessons), adding A Perfect Split
  Step Can Be Late and Your Approach Shapes Your First Volley. All eleven supplied
  source checksums passed before copying. The existing eight released lessons
  and every main-app file remain unchanged from v4. Main Daily step 1 option A
  already reads “Keep landing it shorter, same pace”; no further edit was needed.
- Retained ten absolute menu links and the callback-safe run/tick/Replay fixes.
  The new pages retain their supplied `noTargets` guard; independent normalized
  comparison proves no other source differences. Source originals are untouched.
  Both checksum manifests and the precise repair patch are in the evidence folder.
- GameSharp Tennis source commit:
  `50c36938924f03f4a538e34d4b4c5c31ead0b483`, pushed and remote-verified on
  `codex/tennis-beta-v5-release-2026-09-27`.
  Production artifact: `dpl_6dad5RNABjMgbaHiChLonvbFNtvL`,
  https://gamesharp-tennis-28cr86bvz-eoinlynn-5978s-projects.vercel.app .
  Built from canonical with `--prod --skip-domain`, verified READY/STAGED, then
  promoted unchanged. API confirms READY/PROMOTED on the public domain and
  automatic custom-domain assignment remains disabled.
- All 225 structural tests and required audits pass. Trust: zero errors, unchanged
  length-tell warning (366 of 549). Connected: nine journeys, 22 scenes, zero
  failures. Share: 20 questions/eight plays. All reviewed fingerprints unchanged.
- Stage and public each pass 89 HTTP checks: exact candidate beta bytes,
  byte-identical main app, noindex, menu destinations, share probes and 25 excluded
  routes. No home-page beta link. This source-derived static inventory plus sampled
  function responses does not prove generated-function bundle equality.
- All ten staged lessons completed their three decisions natively in Chromium
  at 390 × 664: every question is 2 × 2, every pre-click Next is visible at
  scrollY 0. Existing eight pages additionally pass normal pause/resume; prior
  v4 fullscreen/Replay edge coverage is retained for their unchanged bytes.
- Two new lessons: 24 additional browser checks cover complete phone journeys,
  wrong answer/correct demonstration and interrupted Replay (Split Step decision
  3; Approach Volley decision 1), normal/fullscreen controls and automatic return.
  Split Step's first two reveal decisions work without false target markers.
  Desktop openings/grid/controls checked at 1100 × 900; screenshots inspected.
- Stage and public each pass all 30 actual menu → lesson → back paths from
  /beta, /beta/ and /beta/index.html. Public Approach Volley completes C/B/D for
  3 of 3 without credentials. No page errors in the sampled browser journeys.
- Limits: phone-sized Chromium, not a physical phone or Safari. No-scroll checks
  cover tested decisions/feedback, not all devices, enlarged text or expanded Why.
  Scene/syntax integrity is checked; no independent physics/coaching approval
  is claimed. Main-app release eligibility and existing withheld items are unchanged.
- Bounded error-level log scan returned two existing-class DEP0169 url.parse()
  deprecation warnings on share probes with expected 200/404 responses. No warning
  repair is included; continuous monitoring/drains were not assessed.
- Rollback retained: `dpl_GroqYH7sMh41J7Ez2XKMsXgRb1RK`,
  https://gamesharp-tennis-lmcfg6p63-eoinlynn-5978s-projects.vercel.app .
  Git migration remains pending. No main push/merge, deletion or archiving.
  The earlier read-only content snapshot remains unchanged and pinned to v3.
- Completion record: Codex, `codex/tennis-beta-v5-release-log-2026-09-27`.
  Documentation is pushed separately and does not trigger another promotion.
  Evidence: `/Users/eoinlynn/Downloads/tennis-beta-v5-release-2026-09-27/`.


## 27 September 2026 — approved beta v6 release claim

- Owner: Codex; branch `codex/tennis-beta-v6-release-2026-09-27`, based on
  verified live v5 and completion log `4c017eb9a1ca87dd6451e672af2347a3d7fb8980`.
  Eoin explicitly approved twelve beta files through Production stage → verify → promote.
- All twelve source checksums pass. Copy all twelve files; add Middle Return
  (The Return That Shrinks Serve +1). Retain eleven absolute menu links and the
  existing callback-safe run/tick/Replay repair, preserving source noTargets guards.
  Prior ten released lesson pages remain byte-identical to v5; originals untouched.
- Only menu, new middle-return.html and this log change. Main app unchanged.
- Fresh rollback: `dpl_6dad5RNABjMgbaHiChLonvbFNtvL`, source
  `50c36938924f03f4a538e34d4b4c5c31ead0b483`,
  https://gamesharp-tennis-28cr86bvz-eoinlynn-5978s-projects.vercel.app .
  Automatic production-domain assignment remains disabled; no main push/merge.
- Verify all eleven lessons at390×664,2×2 decisions and Next without scrolling.
  Chromium emulation only; physical phone/Safari unavailable. Keep noindex/unlisted.
- Evidence: `/Users/eoinlynn/Downloads/tennis-beta-v6-release-2026-09-27/`.
  Status: copied; not staged or promoted.
