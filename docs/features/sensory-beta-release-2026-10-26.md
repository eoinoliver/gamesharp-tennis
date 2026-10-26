# Sensory and beta continuation release — 26 October 2026

Live: https://www.gamesharptennis.com/play.html?l=contact-clue

- Change: PR #33, https://github.com/eoinoliver/gamesharp-tennis/pull/33
- Reviewed head: `451cd0fcdc82aa7c45c253e24637561a8232de48`.
- Main merge: `d06c1ddd4991e9d40ac16579ca595dd894b7479c`.
- Reviewed and merged tree: `c1d318057e75381608027fae02816985c46c32f8`.
- Version: `ff689b8dae`.
- Project: `gamesharp-tennis` / `prj_SHIw7K0JxhCtoQQgh1zVHlR3r2Pe`.
- Team: `team_FbcFTSxz1dTyY33hXlXd1S6D`.
- Preview: `dpl_D7R6wYcMyFHh1siZn2B9Yo9yGc29`,
  https://gamesharp-tennis-c5ei3lsnv-eoinlynn-5978s-projects.vercel.app.
- Promoted Git Production: `dpl_6VqPxzYRBU1Ajnzsb6m1vzHTfNks`,
  https://gamesharp-tennis-jn72dq38m-eoinlynn-5978s-projects.vercel.app.
- Last-good rollback: `dpl_9GR4jXBMpN8CNGRDKGYoeuCCnGsY`,
  https://gamesharp-tennis-3gh4oco9x-eoinlynn-5978s-projects.vercel.app,
  main `af4658d274876033d4e377807554ec21ce3d9458`.

## Authorization and sequence

The user requested continued beta work, full autonomy and deployment live, then
requested the app-wide sensory audit and fixes. The scoped changes were tested
on the named review commit, merged through GitHub, verified as a staged Git
Production deployment and promoted without rebuilding. Auto-assignment was
verified off before merge; the expected Git repository, main branch, project,
team and unchanged last-good deployment were confirmed. No laptop upload.

## Verification

- GitHub contracts run `40264698948` passed on the reviewed head:
  https://github.com/eoinoliver/gamesharp-tennis/actions/runs/40264698948.
- Exact build parity: 97 release files, 96 public assets; unchanged migration
  fingerprints and chained explicit feature overlays.
- 18 unit tests passed, covering analytics boundaries and sound lifecycle.
- Chromium and WebKit each passed 76 focused assertions: initial touch,
  activation state, mute/navigation, natural-speed contact, correct decisions,
  repeat suppression, both Predict journeys, cue save, next challenge,
  catalogue exhaustion, quiet shell/welcome and all 38 lessons / 433 scenes.
- Actual synth rendered offline: all four effects nonzero, unclipped, silent
  after one second. Not a physical speaker/headphone or perceptual test.
- Complete local and GitHub browser regression: app flow, nine layout checks,
  payoff, Pusher, all 38 scene gates and 325 contact-inspection assertions passed.
- Preview, staged Production and live domain each passed 238/238 hosted checks,
  including all public asset hashes, redirects, headers and private exclusions.
- Preview and Production resource UIs each reported exactly 96 static assets.
  Full manifests accounted for all of them. No functions or middleware were
  introduced. Effective project settings and routing/function metadata matched.
  All 137 automatic environment key names matched; zero configured project
  environment variables. Expected system values differ with Git branch/SHA,
  URL and deployment target; this static build reads no environment variables.
- Manual hosted Preview and staged Production journeys: enable sound, three
  correct Contact Clue decisions, cue save and next link to a loaded, playable
  Serve Plus One question.
- After promotion the www alias resolved to the exact verified Production ID.
  A live 390px mobile-browser journey confirmed version ff689b8dae, 3/3 saved,
  one-day streak, cue save, next challenge loaded, activation there and mute
  persisted after reload. Zero page errors; 12 analytics requests intercepted.
- Fifteen-minute Vercel error scan returned no entries. This static deployment's
  scan is not ongoing client-side monitoring or evidence about every device.

## Scope and remaining uncertainty

All 38 catalogue lessons remain available. No lesson content, animation data,
answer ordering, scoring storage or catalogue membership changes. The audit and
sound policy are in [sensory-beta-audit.md](sensory-beta-audit.md).

Sound-event selection across 433 scene branches reduced 3,207 candidate events
to 1,447. Visual markers remain unchanged. Home, welcome and automatic finale
are quiet; deliberate replay has contact cues. Daily praise is once per correct
committed step. Predict never hints at answers through audio and gives one brief
accent for a perfect completed point. Mute cancels active and scheduled voices.

Physical iPhone Safari / Android Chrome listening, silent-switch/output-route
behaviour, subjective applause quality, coaching validity and retention impact
are not established by these checks. The next meaningful validation is physical
speaker/headphone listening and a small beta check of cue recall/use and next-day
return. No claim that sound alone improves learning or retention.

Local ignored evidence: `app_src/evidence/sensory/`,
`app_src/evidence/sensory-live/`, `app_src/evidence/contact-focus/`.
This record-only branch does not require promotion of another deployment.
