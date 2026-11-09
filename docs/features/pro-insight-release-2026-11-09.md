# Professional insight release — 9 November 2026

The stronger professional stories and three Reset stories are live at
https://www.gamesharptennis.com. The final copy correction separates Sampras's
second-set diving volley from his earlier first-set 0–40 escape in the 1999
Wimbledon final. The six later replacement-card proposals are not part of this release.

## Approval and source

Eoin said “proceed” after the explicit recommendation to correct Sampras, keep
the reviewed improvements, rerun checks and verify staged production before release.
Current user authorization covers this contained correction and release routine.

- Implementation: https://github.com/eoinoliver/gamesharp-tennis/pull/81
- Reviewed commit: `3228b44cbef8a2cf543ad6f5e6441751952af93f`
- Merge commit: `3f2ea1cb835eccce492f3df21dc0f21b95c75faa`
- Reviewed and merge Git trees are identical: `01ef0dbec0f24b05aecfe6a85c995732d7bb67f4`
- App version: `0f30efc78f`
- Exact preview: https://gamesharp-tennis-88xda2hbp-eoinlynn-5978s-projects.vercel.app
- Preview deployment: `dpl_AsfR9FFEn6tZvUwEwdVd3pzzfdz4`
- Promoted Git-triggered Production build: https://gamesharp-tennis-g57bpxj69-eoinlynn-5978s-projects.vercel.app
- Production deployment: `dpl_FvVGYEukCzkCUYthmD6zWKEaCe1V`
- Last-good rollback: `dpl_BFtyoqStSyHJD9TQxrre7k3s6r2o` (app `a3ea033eb6`)

The project remains `prj_SHIw7K0JxhCtoQQgh1zVHlR3r2Pe`, linked to
`eoinoliver/gamesharp-tennis`, branch `main`. Automatic production-domain
assignment was disabled before merge and remains disabled after release.
The exact staged production deployment was promoted without rebuilding.

## Validation and boundaries

- Full required CI passed: https://github.com/eoinoliver/gamesharp-tennis/actions/runs/42540218426
- 86 unit tests and 63 protected lesson/scene contracts passed.
- Reproducible build: 280 release files, 279 public files, 391 source/test inputs.
- 126 mobile/desktop completion checks: four real Predict journeys and 122 renderer fixtures.
- Corrected Sampras card manually inspected at 390/1280 pixels.
- Preview, staged production and live each passed all 421 file/routing checks.
- Preview, staged production and live each passed 83 UX regression checks in Chromium,
  plus the real Predict completion and corrected story at mobile/desktop sizes.
- Authenticated Vercel Resources views showed only 279 Static Assets for preview
  and staged production, with no functions. Exact paths/hashes verified separately.
- Effective configuration, routing, runtime and build inputs matched, aside from
  expected target/Git identity/Preview Feedback differences. No configured custom
  environment variables. No live log drains configured.
- Public www host, apex redirect, catalogue version and deployment alias verified.
- Post-release request-log error scan returned 0 errors during the observation window.
  This short scan is not ongoing monitoring or proof of no future defects.

All 63 lessons remain eligible: 53 sourced lesson cards (including six distinct
doubles stories), 10 practical fallbacks and three separate Reset stories. No
additional lesson was enabled or withheld. No physical-device certification,
independent coaching sign-off or marketing-conversion claim is made.

## Media and reference library

Four refreshed promotional films were captured from app `553cac9904` on
8 November. The subsequent Sampras correction appears in none of those films;
footage and approved Lara audio remain valid. The review hub distinguishes the
film capture version from this live release. No social posting was performed.

The local reference library marks the chronology correction resolved and retains
the previous review-build identity as history. The six proposed replacement cards
remain editorial candidates, not silently added release content.

Local evidence: `/Users/eoinlynn/Documents/Codex/2026-11-02/rev/work/pro-insight-release-2026-11-09`.
Promo hub: `/Users/eoinlynn/Documents/Codex/2026-11-02/rev/outputs/gamesharp-stories-that-stick-2026-11-08/index.html`.
This is a documentation-only follow-up; its build must not be separately promoted.
