# GameSharp Tennis — current project alignment

## Decision and scope — 5 October 2026

Eoin chose option A on migration PR #1: the live 3D app is GameSharp Tennis.
GitHub `eoinoliver/gamesharp-tennis` main becomes its canonical source after
review and approved cutover. Preserve the 2D app as history at
`legacy-2d-2026-09-21`; do not deploy it over the 3D product.

Migration source: private `gamesharp-lab`, branch `codex/release-2026-10-05`,
commit `c3fdb63` (full source identity in `docs/migration/OPTION-A.md`). The
release app is built from `app_src/` and the selected `rally/` inputs. This
migration changes infrastructure and documentation, not product behavior.

Live baseline checked on 5 October:
- deployment `dpl_EjCtSiEP2ufRa4npUoQBbssJ16Cj`;
- unique URL https://gamesharp-tennis-gzlepvjdl-eoinlynn-5978s-projects.vercel.app;
- app version `e5cb1a5c10`;
- 21 Daily lessons and two Predict lessons; 22 clips; 81 release files.

Recheck live identity before cutover; dated state is not a release authorization.
After cutover, GitHub main alone supplies production builds. Lab work stays in
`gamesharp-lab` and reaches the product through reviewed PRs in this repo.

## Durable operating agreement

Either Claude or Codex independently owns delivery end-to-end; neither needs
operations or approval from the other. Cross-agent review is optional unless
Eoin explicitly requests it; findings and replies go directly on GitHub. Eoin
says “ship it” for the exact version. The builder then owns merge, production
verification and rollback. This supersedes the earlier mandatory other-agent
review rule. See `AGENTS.md` and `RELEASE_PROTOCOL.md` for the operative rules.

## Historical material and separate decisions

The 2D contracts, September release evidence and local alignment history are
historical at the legacy tag. They do not establish current live state or impose
2D engine requirements on the 3D product. The lab's takeover and Home handovers
are dated historical records; the imported release and fresh verification take
precedence. No external local alignment directory is required to operate here.

Desktop `Blender Tennis/` and `pose-trial-2026-09-21/` remain untouched. Their
proposed private lab home needs Eoin's separate go. Do not import source video,
raw motion-capture datasets, Blender binaries or experimental media into this
public repository. Golf, PropPocket and Desktop retirement are outside this PR.

## Current beta — 27 October 2026

PR 53 is live: app 61678680f2, Production dpl_3E59DLbVYCHzGhaoZc3YhzMz5qqX, merge 72018a03b2fc42526e5bab74d5d0a8f8ec855ea3. All 41 existing journeys have a short lesson-specific Frank completion ending. Voice defaults on, with saved voice opt-outs and master mute respected. Narration follows final motion; point replay retains navigation and does not repeat narration. Deeper coaching and saved cues remain. PR 51's fresh-lesson queue remains browser-local. Current user full-autonomy/deploy-live directions supersede older per-version permission wording while retaining all Git and verification safeguards. See docs/features/completion-voice-catalogue-release.json; the prior release is preserved in docs/features/fresh-challenges-release.json.

## Movement-led Live Point — 27 October 2026

PR 55 is live: app bcaab23b1a, merge e80d1adc9b44ea41a63d8356fec3e578d099d4cb, Production dpl_9rfGigZibdqHUfpTW24UMLgsHUCt. Two new journeys (43 total) connect a reply choice to recovery timing, with eight authored routes that stop with the point still in play. Returning players can find the unplayed original on Home; the changed-wing variation becomes eligible from the next local calendar day after completing it. First responses survive retries; history remains browser-local. Both share the short Frank cue “Buy yourself time. Use it to recover.” The next product gate is later-day recognition and beta feedback before catalogue expansion. Release evidence and limits are in docs/features/live-point-release.json. Rollback remains 61678680f2 / dpl_3E59DLbVYCHzGhaoZc3YhzMz5qqX. Automatic domain assignment remains off.


## Flagship Live Point learning cycle — 29 October 2026

PR 61 is live: app 8c1c840652, merge f0131705b6e18ff9b3b42cfba269e5fd1bb5a3f8, Production dpl_EHAWMdXkhUa3APEZXyAxi3u1BEXb. The existing two Live Points now replay before their payoff, compare recovery with the same ball/opponent/camera, use four choice-specific Frank endings, offer private challenge links, retain unfinished points on Home and distinguish a first fresh later-day read from practice. The catalogue remains 43 journeys; no new motion or point family is claimed.

All Git CI suites passed. Preview: 297 hosted checks, exact 155-file inventory, all 43 WebKit voice journeys, 27 mobile regressions and 144 flagship checks including all four voice variants. Staged Production matches the reviewed Git tree, complete output inventory and effective runtime/build configuration; no functions or middleware. Live: 297 hosted checks, 144 WebKit flagship checks and four Chromium journeys. Browser checks do not establish physical iPhone/iPad listening or coaching certification. The next gate is two genuinely contrasting content families, honest later-day evidence and measured production effort. See docs/features/live-point-flagship-release.json. Rollback: a9d9eec67d / dpl_8SiBXt32r6MDvWViUkcKtMzHTJLA. Automatic production-domain assignment is verified off.
