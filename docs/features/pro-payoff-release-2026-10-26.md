# Professional payoff repair — 26 October 2026

The three new movement lessons had no `pro` content and ended with a generic take-home. This release adds open, sourced Pro Lens endings to earned-attack, earned-defence and earned-net. Each connects the professional insight to a next-point decision.

## Source and editorial review

- Attack: Mike Crooks, *Tactical Movement — Part 2*, point 1 (Dubai 2012 Federer–Murray final). Federer remains inside the baseline after his forcing serve, then makes room with three shuffle steps. Application: check your own room to use the opening.
- Defence: Craig O’Shannessy, *Winning on Defense*, public overview. It names Alcaraz, Sinner and Djokovic and identifies speed, spin and height as defensive tools. Application: choose flight time according to your arrival; reassess if your position improves. No claim to have watched the paid webinar, and no time-dependent statistics reproduced.
- Net: Crooks, same point. Federer’s approach pins Murray deep, Federer follows its line with two running steps and plays the first volley inside the service box. Application: judge the approach by the next ball it sets up.

Sources: https://tennis.is/wp-content/uploads/2014/01/Federer_Murray_footwork_movement.pdf and https://braingametennis.com/webinar-73-winning-on-defense/ . Next-point applications are GameSharp’s teaching interpretation, not player quotations or motion reconstructions.

## Scope and validation

The canonical generator retains the new professional insights. Removing only the new `pro` object makes each generated lesson semantically identical to the prior release, including every scene, option, score rule and saved cue. All other lesson assets and engine/audio are unchanged. Catalogue remains 32 Daily + 2 Predict + 7 Play = 41.

Historical fingerprints preserved with readiness-pro-build.json. Build parity: 100 release / 99 public files, 103 checked inputs. 22 unit tests; 445 focused checks each in Chromium and WebKit. All three phone endings personally inspected plus WebKit and desktop samples. The new checks require an open Pro Lens, linked source and next-point bridge on every responsive viewport.

Candidate: 963bd48c2d7de6e20964a242033cdece64dc3941, app b245169ce4, PR #39.
Preview: dpl_5LvqJkWq18TfKd7k27nLxHgpZfid, https://gamesharp-tennis-o487on38a-eoinlynn-5978s-projects.vercel.app. All 241 hosted checks passed; Resources UI reports 99 static assets. Attack completed manually in Chrome with open Pro Lens and cue saved.

Rollback baseline: dpl_7vts2VCT5XRUiXjCkmSVsDVQdJJR, version 84d191a175. Current full-autonomy and deploy-live instructions cover the repair; standard Git/verification safeguards retained.

Learning recall, actual on-court transfer and return rate remain unmeasured. Browser checks do not constitute physical iPhone/iPad testing.

## Release

GitHub contracts passed: https://github.com/eoinoliver/gamesharp-tennis/actions/runs/40309219604 . Full local suite also passed, including all 41 scene gates and 325 contact checks.

Merge: `0d456f91a289c13a57f0b75a2d6b50a1d27d659b`. Merge and reviewed candidate share tree `c84f4a136638f639c8ec648e4d29b05575a86f49`.

Git-triggered Production: `dpl_HjYv1V6KiX36tBKRWgzYCrPCyXzX`, https://gamesharp-tennis-blumbjr0m-eoinlynn-5978s-projects.vercel.app . Staged checks passed 241/241. All three staged browser journeys passed via authenticated CLI transport: open Pro Lens/source/application, 3/3, saved cue, next challenge, zero page errors. Resources UI confirms 99 static assets. Effective project settings, runtime configuration, routes, regions, Node version and 136 environment-key names match preview. No configured project environment variables; no functions or crons.

Fresh guards verified the exact staged Production commit, unchanged rollback baseline and disabled automatic custom-domain assignment. Promoted that exact artifact without a rebuild. www alias points to the new Production; apex 307 preserves the lesson query.

Live checks passed 241/241. Direct live Chromium and WebKit journeys each completed all three lessons, verified the open sourced insight, saved every cue and followed the next challenge. Both reported zero page errors; 24 test analytics requests intercepted per browser. All hosted stages passed without retries. No Vercel error-log rows returned (static app; not independent proof of client correctness). No rollback required.

This follow-up branch is documentation only and must not be promoted.
