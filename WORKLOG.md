# GameSharp Tennis shared worklog

## 2026-10-05 — option A migration — Codex owns this task

- Eoin instructed rebuild of PR #1 around Claude's option A comments.
- The live 3D app becomes canonical here; the previous 2D candidate is preserved
  at `legacy-2d-2026-09-21` (`72df275faec1513f59a0e23bad5599c8ac823ddd`).
- Import from private lab release branch; no lab or Desktop asset moves.
- Runtime unchanged: exact 81-file rebuild, version `e5cb1a5c10`.
- GitHub main remains unchanged; no merge/promotion authorized by this task.
- Claude independently reviews the revised PR. Eoin's “ship it” remains the gate;
  Codex owns the eventual merge, production verification and rollback.
- Local release checks passed: analytics 10/10, app flow 33 assertions, layout
  9/9, payoff 21/21, Pusher 18 assertions across two phone sizes, scene gates
  23/23. Home/Sharpen visually inspected; cards load, no page errors/overflow.
- All 214 live HTTP checks passed. Git Preview revealed copied CLI config
  exposure; the hosted builder now publishes exactly 80 public app files.
  Preview Feedback suffix is recorded and matched exactly by deployment ID.
- Initial option A GitHub contracts and Vercel checks passed. The corrected
  final Git candidate is awaiting hosted verification and Claude's independent
  review. Exact SHA/Preview/check outcomes are recorded on PR #1.
- Release proof and public audit scope are in `docs/migration/OPTION-A.md`.

## Historical September migration log (superseded)

The following records describe the abandoned 2D candidate. Production claims,
canonical local paths and “next” steps below are historical, not current rules.


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
