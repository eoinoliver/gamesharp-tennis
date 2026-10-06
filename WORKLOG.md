# GameSharp Tennis shared worklog

## 2026-10-05 — option A migration — Codex owns this task

- Eoin instructed rebuild of PR #1 around Claude's option A comments.
- The live 3D app becomes canonical here; the previous 2D candidate is preserved
  at `legacy-2d-2026-09-21` (`72df275faec1513f59a0e23bad5599c8ac823ddd`).
- Import from private lab release branch; no lab or Desktop asset moves.
- Runtime unchanged: exact 81-file rebuild, version `e5cb1a5c10`.
- GitHub main remains unchanged; no merge/promotion authorized by this task.
- Eoin's “ship it” remains the gate; Codex owns the eventual merge, production
  verification and rollback. Cross-agent review is optional under the revised
  operating agreement below.
- Local release checks passed: analytics 10/10, app flow 33 assertions, layout
  9/9, payoff 21/21, Pusher 18 assertions across two phone sizes, scene gates
  23/23. Home/Sharpen visually inspected; cards load, no page errors/overflow.
- All 214 live HTTP checks passed. Git Preview revealed copied CLI config
  exposure; the hosted builder now publishes exactly 80 public app files.
  Preview Feedback suffix is recorded and matched exactly by deployment ID.
- Initial option A GitHub contracts and Vercel checks passed. The corrected
  candidate subsequently passed all 222 hosted checks and required Git checks.
  Exact SHA/Preview/check outcomes are recorded on PR #1.
- Release proof and public audit scope are in `docs/migration/OPTION-A.md`.

## 2026-10-05 — remove cross-agent delivery dependency

- Eoin clarified that either agent must be able to deliver independently.
- Supersedes mandatory other-agent review: cross-agent review is optional unless
  Eoin explicitly requests it. PR comments remain the communication record.
- Eoin's exact-version “ship it” remains mandatory. The builder owns merge,
  production verification and rollback without a handoff to the other agent.
- Updated AGENTS, CLAUDE entry point, alignment, product/release contracts and
  migration notes consistently. Documentation only; runtime/build/CI unchanged.
- No merge or production release performed.

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

## 5 Oct 2026 — Welcome brand moment (Claude)

- Branch `claude/welcome-2026-10-05` from main `931308e`. Claude builds and owns this task end to end (AGENTS.md independent delivery; cross-agent review only if Eoin asks).
- Change: `app_src/play_host.html` only (plus rebuilt `app/`). Auto-started visits get a welcome over the loading lesson: GAMESHARP / TENNIS; the ball comes in from the right (as in the V5 Home intro) with two bounces, hits the crooked P, which snaps straight; the wordmark sharpens, gold glint, "See clearer. Think sharper.", dissolve at 1.6 s. Full once per day (`gs_welcome_day`), 0.6 s short version otherwise, static under reduced motion, tap/key skips, holds the final frame if the lesson is slow. First-visit caption moved after it. Event `welcome_seen`. Home and in-app lesson opens unchanged.
- Baseline: approved feature work, so `docs/migration/live-app-sha256.json` (app/catalog.js, index.html, play.html) and `imported-source-sha256.json` (play_host.html, gs/app_flow.mjs) updated to the new hashes. No other entries changed.
- Checks: `npm run check:build`, `npm test` 10/10, `npm run test:browser` 27/27 (app_flow with 8 new welcome checks, layout 9/9, payoff, Pusher, 23 gates).
- Eoin said "go ahead and ship it" (5 Oct) after seeing the frames and recording of this exact welcome.

## 5 Oct 2026 — Compact done-today card (Claude)

- Branch `claude/home-done-compact-2026-10-05` from main `398c664`. Eoin: make the Home "Done today" banner far smaller. `app_src/index.html` only: label row now carries the countdown ("Next in 8h 10m"), title is just "Day one done." / "N-day streak.", tomorrow's lesson on one line, buttons 44 px. Dropped the filler "See you tomorrow." and "Keep the streak going." Card height 236 → 142 px at 390x844 and 375x667. Today's-challenge card unchanged.
- Baseline hashes updated for app_src/index.html, app/catalog.js, app/index.html, app/play.html (version string only).
- Checks: `npm test` 10/10, `npm run test:browser` 27/27.

## 5 Oct 2026 — Sharpen athlete (Claude)

- Branch `claude/sharpen-athlete-2026-10-05` from main `b243705`. Eoin: bring the athlete back in Sharpen with the labels of all the strokes.
- The static hero picture on the Sharpen map becomes the lesson engine's own figure (rally/core.js + figure.js, wrapped by build.py into `app/athlete.js` with `app_src/athlete.js`, loaded only when Sharpen opens) playing each stroke's real lesson clip: forehand (fh), backhand (bh), slice (bhSlice), serve (serveT), forehand volley (lowfv), backhand volley (bv), drop shot (drop), on a court with the ball and the racquet path through contact, slowed near contact. Cycles through the strokes; a row of stroke labels highlights the one playing; tapping a label loops that stroke and opens its stroke card (freeze-frames, cues, grip) below. Clips load one ahead. Reduced motion: the contact frame, still. The hero picture shows until the figure is ready. Problem tiles unchanged. Event `sharpen_stroke {stroke}`.
- Fingerprints: added `app/athlete.js`; updated app/catalog.js, index.html, play.html, sharpen.js and app_src/build.py, index.html, sharpen.js. Release file count is now 82 (81 public).
- Checks: `npm run check:build` PASS (82 files), `npm test` 10/10, `npm run test:browser` 27/27. Inspected at 390x844 (cycle through all 7, label tap → serve + card), reduced motion (static), 1440x900.
- Same branch, Home declutter (Eoin, iPhone screenshot: "still far too busy"): (1) header chips no longer add the notch inset a second time (`.gs-main` already pads it; on iPhone the streak chip and profile fell onto the headline); (2) Home is one card: Sharpen teaser and "Your lessons" removed from Home (Sharpen and Explore have their own tabs; Sharpen still lists played lessons); (3) the tagline is hidden once today's lesson is done; (4) `#main` height now reserves the bottom nav so the card sits just above it. Checked with a simulated 59/34 px notch at 390x844, 430x932, 375x667: chips on the wordmark row, card 14 px above the nav. `npm test` 10/10, `npm run test:browser` 27/27.

## 5 Oct 2026 — Lesson 22: Serve Away From the Lean (Claude)

- Branch `claude/lesson-lean-2026-10-05` from main `74348a8`. Authored in gamesharp-lab (branch `claude/lesson-lean-2026-10-05`, commit fa65a5d: rally/le_scenes.py); imported here: rally/le_data.json, lesson_le.js, order.json (le1-3 display order).
- Physics: re-derived legacy seq_014 (Body Serve). The model shows the body serve gives the returner the most time; serving away from their lean wins every step (deuce lean T -> wide ace; deuce shade wide -> T blocked; ad protect backhand -> T to forehand blocked). One authored mapping from the returner's spare time to the kind of return, documented in le_scenes.py and consistent with the second-serve lesson's height rule.
- App: DAILY lesson 22 (tactics flavour); Sharpen Serve zone "My first serve keeps coming back". Pro Lens: ATP Tour / Golden Set Analytics for TDI (Dec 2022), claims limited to the article.
- Fingerprints: new app/lessons/serve-away-from-the-lean.json; updated catalog.py, sharpen.js, order.json and the rebuilt app files.
- Checks: `npm test` 10/10; `npm run test:browser` 28/28 (24 gates incl. the new lesson, payoff incl. the new lesson); inspected all 3 steps + wrap at 390x844 and 375x667 (no overflow, no errors).

## 5 Oct 2026 — Play the Point in the app (Claude)

- Branch `claude/play-the-point-2026-10-05`, stacked on the lesson-22 branch. The lab's branching prototype (rally/bp_scenes.py, make_bp.py; bp_data.json rebuilt on the Mac byte-identical with the current clips) becomes the app's first Play the Point: one point on your serve, up to three decisions, each choice played out by physics and deciding the next situation (only wide serve -> open corner -> behind them ends in a winner; other paths end back to even or still your point).
- App: catalog PLAY group + 'play' flavour; build.py and app.js know the group; Explore features it at the top; Home's done card offers "Play the Point" in Replay's slot (replay stays in Sharpen / Explore); event `play_point_open {from:"home"}`; tools/browser-checks.mjs gates the play group too.
- Fingerprints: new app/lessons/play-the-point.json; updated app.js, build.py, catalog.py, index.html and the rebuilt app files.
- Checks: `npm test` 10/10; `npm run test:browser` 29/29 (25 gates incl. every branch node). Played the best path (B,B,C -> winner) and a short path (A,C -> back to even) at 390x844: no overflow, events logged, no errors.

- 5 Oct (Claude, branch claude/ptp-replay-label-2026-10-05): Eoin found "Play another point" replays the same point (there is only one so far). Relabelled to "Same point, different calls" (end-of-point button and the Explore card). npm test 10/10, test:browser 29/29.

## 5 Oct 2026 — Opponent lessons 23-24: The Big Hitter, The Lefty (Claude)

- Branch `claude/opponents-2026-10-05`, stacked on `claude/ptp-replay-label-2026-10-05` (PR #10). Authored in gamesharp-lab `claude/opponents-2026-10-05` (8b62442: rally/bg_scenes.py, lf_scenes.py, rally_build.LEFTY).
- The Big Hitter: step 1 physics (where you wait vs a 125 km/h ball: stepped in 0.12 s, baseline 0.33, one big step back 0.61, way back 0.40); steps 2-3 a documented strike-zone rule (big only from waist-to-chest, unstretched, or a short ball). Pro Lens: ATP Tour TopCourt with Corentin Moutet (Dec 2022), paraphrased.
- The Lefty: left-handed opponent. Engine (rally/lesson_body.html): segments marked `mirror` are mirrored side to side, left/right joints relabelled, racquet in the left hand; no effect on any other lesson (no mirror flags). Documented wing rule (set forehand = attack). Pro Lens: Eng & Kovacs, ITF Coaching & Sport Science Review 63 (2014), paraphrased.
- Catalog: DAILY 23-24 (opponents flavour); Sharpen Match play: "Big hitters rush me", "Lefties throw me".
- Checks: `npm test` 10/10; gates pass for both new lessons; played both through at 390x844 and 375x667 (no overflow, no errors); lefty hand verified numerically (racquet on the left wrist). The full local browser suite stalled on this Mac this evening at the Predict replay step, and the unchanged main build stalled at the same step (environmental: idle-Mac timer throttling); GitHub `contracts` CI runs the full suite as the gate.

## 6 Oct 2026 — Saturday Point #1: lessons and points reinforce each other (Claude)

- Branch `claude/saturday-point-2026-10-06` from main `d696c0b`. Eoin's direction: daily lessons and the point should reinforce each other; two options per shot (the tempting one and the right one), no full tree; weekly cadence; no hard gate (playable any time, missed lessons flagged); Predict folds into the point as "read" shots.
- Saturday Point #1 (prefix sa, authored in gamesharp-lab `claude/opponents-2026-10-05`): one point on your serve built from five lessons (1, 2, 3, 4 and 6; shot 4 is an Open Court read), five shots, two options each, two of them reads. A wrong pick plays out its consequence; the point always continues on the best line; finale replays the whole point; score "N of 5 read right".
- Engine: the step count is the lesson's own (`NS()` = steps.length; every existing lesson has 3). Gate: counts each step's real options.
- App: catalog `play` group leads with the weekend point (catalog entries carry `uses`); lesson wrap-ups name the point they feed ("This lesson shows up in Saturday Point #1"); the point's wrap-up lists the lessons behind it with ✓ / "Not played yet" links; Home's done card offers "Saturday Point"; Explore features "This week's point" with lessons-played progress; older points (Play the Point) stay in the Explore list.
- Checks: `npm test` 10/10; gates pass on saturday-point-1, play-the-point, predict-the-point, the-lefty, short-ball; played the point through (wrong pick on shot 3) at 390x844: 5 shots, 2 options each, no overflow, no errors; lesson 1 wrap shows the point link. Full browser suite via GitHub `contracts` CI.

## 5-6 Oct 2026 — Release record (Claude)
- Welcome (PR #3): merge `398c664`, staged `dpl_5N7BsweVFo4AbbFDt5HRqx5wqdTh` 222/222, promoted without rebuild, version `e21b32b33f`.
- Compact Done today card (PR #5): merge `b243705`, staged `dpl_FvAtR7PcH2bcErYAxzWAjbbc6rn6` 222/222, promoted, version `8dd8f75d1f`.
- Sharpen athlete + decluttered Home (PR #6): merge `74348a8`, staged `dpl_D7bZXHVNK7Mbs7bZaQ2VrRk72GuJ` 223/223, promoted, version `741c471d73`.
- Lesson 22 + Play the Point (PR #9): merge `a4802e3`, staged `dpl_3crDVdwJfFGK9su1QL1CzQFXJtkC` 225/225, promoted, version `43ef05ec2d`.
- The Big Hitter + The Lefty + Play the Point label (PR #11): CI green; merge `d696c0b`, staged `dpl_7QGYatwH5FNUBDKbG1r4xRgW2PtZ` 227/227, promoted, version `b58edc8d7d`.
- Saturday Point #1 (PR #12): CI green; merge `88e1f21` (Eoin "ship it"). Vercel created no production deployment for that merge (no Vercel status on the commit after 12 min; Vercel status page operational). On Eoin's choice, this log PR's merge carries the release: its main build is the Saturday Point release.

- 6 Oct (Claude, branch claude/saturday-point-flow-2026-10-06): Eoin played Saturday Point #1 live and found the layers inconsistent: answers replayed past the next question (shot 2's read was answered on screen before it was asked; after shot 3 an extra ball of yours down the middle appeared), and each step re-played the run-up. Fix in the point's data only: a right answer (and either guess on a read) is cut exactly at the next question's frame; each step starts from there (from = freeze - 2); wrong answers still play their full consequence. Copy no longer gives away the next read; situations for shots 2-5 say only what's new. Measured: answers end at frames 278/442/559/715, next steps start at the same frames, ask after 0.9-1.5 s. Gate passes; npm test 10/10.

## 6 Oct 2026 — Points flow (Claude)
- Branch `claude/points-flow-2026-10-06`. Eoin approved removing the stop-start in points: `LESSON.flow` (set on Saturday Point #1): a right answer shows its one line for 1.8 s and goes straight to the next shot (no panel, no Next tap); a miss still stops with the full panel; the last shot keeps its panel and "Take it to court". Ordinary lessons (no flag) unchanged. All-correct run: 5 shots, 1 tap, ~27 s to the last question. Gates (saturday-point-1, serve-plus-one, play-the-point) and app_flow pass.

## 6 Oct 2026 — Saturday Point #2 (Claude)
- Branch `claude/saturday-point-2-2026-10-06`, stacked on `claude/points-flow-2026-10-06`. Authored in gamesharp-lab (36ffe6c, rally/sb_scenes.py).
- A return game at 5-2 from the five lessons no point had used: Middle Return (deep middle vs the far sideline: wide), The Lead (keep the depth vs shorter and safer: they step in), Recovery (shade to their crosscourt vs the centre mark: computed reach, in time vs stretched), Approach Volley (deep vs short: passed), Split Step (a read: land as they hit; text gives the computed times 0.21 s vs 0.09 s, since an early or late split can't be drawn cleanly here). Finish: volley into the open court, put away. Continuous-point rules; flow on.
- App: catalog play group adds saturday-point-2; Explore and Home feature "this week's point" = the first weekend point you haven't played (else the newest); the others stay in the Explore list.
- Checks: gate passes; flow run 5 shots, 1 tap, no errors; featuring verified (#1 for a new player, #2 once #1 is played); `npm test` 10/10.
