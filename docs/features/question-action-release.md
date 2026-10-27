# Question action and restrained sound — release 27 October 2026

Live: https://www.gamesharptennis.com/play.html?l=second-serve

## Released behavior

Applause occurs once at a perfect challenge finish, with visual feedback retained
per answer. Contact sounds require visible outgoing ball frames and stop at
freezes. Repeated incoming-ball lead-ins and sound activation are silent.

All 135 question nodes across 41 lessons have observable action: 95 authored
intervals, nine explicit examples, nine pre-serve preparations, and 22 labelled
incoming-ball replays. The Safe Second Serve Trap now shows the receiver's
response before the choice. Predict shows each premise while retaining neutral
feedback until completion. Deep return positions remain fully visible in the
optional desktop Broadcast camera.

## Exact release

- Implementation PR: https://github.com/eoinoliver/gamesharp-tennis/pull/43
- Reviewed candidate: `6607e37dbd1b80b382df2a208261942f9d0e72c6`
- Merge: `8523581c254df43a285f122351631e1d96344f31`
- Matching candidate/merge tree: `532e6cabfb4954e5e0d362a76cf4771485091924`
- App version: `39c56de12c`
- Git Preview: `dpl_2edfBNqGZ93S1qvU1nGH1Z9e48Hn`
  https://gamesharp-tennis-dxfcuvwcn-eoinlynn-5978s-projects.vercel.app
- Git Production, verified staged and then promoted without rebuilding:
  `dpl_H21kYcCmruKt9HjmvdLzPiJjrrX8`
  https://gamesharp-tennis-7gcjg4crl-eoinlynn-5978s-projects.vercel.app

Current user instructions grant full autonomy and live deployment, superseding
the older exact-version approval gate. PR, Git build, staged verification,
configuration/inventory comparison, and rollback safeguards were retained.
Automatic custom-domain assignment remains disabled.

## Validation

- Final CI passed: https://github.com/eoinoliver/gamesharp-tennis/actions/runs/40446792839
  Includes 27 unit tests, 839 question-action assertions, 445 readiness checks,
  86 sensory checks, app flow, layouts, payoff, Pusher, all 41 scene gates, and
  325 contact-inspection checks.
- Final local question-action checks: 839 assertions in each of Chromium and
  WebKit; sensory checks: 86 in each engine.
- Exact build parity: 104 release files, 103 public assets, 115 checked inputs.
  The seventh explicit build overlay retains historical fingerprints.
- Preview, staged Production, and live: 245/245 hosted checks each.
- Preview and staged Resources inventories: 103 static assets each, no functions.
  Effective project/build/runtime/routing settings and 136 environment-key names
  match; zero configured project environment variables.
- Preview and staged browser journeys passed for Second Serve, Serve Plus One,
  and Predict. Live direct-network journeys passed for all three in Chromium
  and WebKit, with no page errors. Checks cover fresh audio download/decoding,
  freeze silence, completion reward, saved cue, next challenge and mute retention.
  Test analytics were intercepted.
- Public www alias points to the released deployment; apex redirects to www.
- Personal visual review covered new examples and affected framing. Automated
  browser evidence does not establish physical iPhone/iPad listening or coaching
  validation; those remain unverified. No lesson was added or withheld.

## Rollback

Previous live deployment `dpl_6JGuduEib2zQqWyXwpcz1C7fmXrQ`, app `2dd4194def`,
was verified Ready immediately before promotion and retained as the rollback
reference. No rollback was needed. This documentation-only follow-up must not
be promoted as a new app release.
