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
