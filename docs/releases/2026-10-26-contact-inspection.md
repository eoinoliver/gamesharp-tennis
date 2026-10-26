# Contact inspection release — 26 October 2026

## Release identity

- User authorization: “lets build more of these and deploy all live”, 26 October.
  This authorized the scoped batch and production release after verification,
  superseding the older exact-preview approval gate for this request.
- Product PR: https://github.com/eoinoliver/gamesharp-tennis/pull/31
- Reviewed head: `c779a342b0a7cd1368bc8465a1a8cd6e3276c6af`.
- Merge: `af4658d274876033d4e377807554ec21ce3d9458`.
- Both Git trees: `b2b579c0df025fc0c47d2696136baf13f122d7bb`.
- App version: `7e1177842f`.
- Preview: `dpl_AYU4VLUh5KZFHEKGUZAvqvc93Ahd`,
  https://gamesharp-tennis-qeriw1qx1-eoinlynn-5978s-projects.vercel.app.
- Promoted Production: `dpl_9GR4jXBMpN8CNGRDKGYoeuCCnGsY`,
  https://gamesharp-tennis-3gh4oco9x-eoinlynn-5978s-projects.vercel.app.
- Live: https://www.gamesharptennis.com.
- Rollback: `dpl_2RGbuRfaujjuwdyq1yrJ1YCndi2n`,
  https://gamesharp-tennis-r6x28sb1n-eoinlynn-5978s-projects.vercel.app.

## Scope

Three existing lessons have inspection in normal play: Contact Clue, High Ball,
and Short Ball. The catalogue remains 38 lessons; the other 35 keep their
presentation. The original net/long contradiction is corrected. Selected-shot
contact timing is aligned in Contact Clue, nine Forehand Bill openings, eleven
High Ball choices and twelve Short Ball choices. Later continuations retain
their timing. Backhand inspection uses its hitting-side camera; the double-bounce
choice explicitly has no contact. First answers, scores and cue saving persist.

The generic motion remains illustrative. No independent coaching approval,
physical-device result, learning improvement or retention effect is claimed.

## Verification and release

- `npm run check:build`: 97 exact files, 96 checked inputs, 96 hosted public files.
- Analytics tests: 10 passed.
- GitHub contracts on the reviewed head: run `40261945218`, success. Includes
  full app flow/layout/payoff checks, all 38 scene gates and focused inspection.
- Final local focused suite: 325 passed, nine full journeys, all 36 options,
  375×667, 430×932 reduced motion and 1280×900. No page errors.
- Visual inspection caught a backhand occlusion missed by structural tests;
  corrected before the final candidate. Final hosted Short Ball journey and
  staged-production High Ball journey completed and saved their cues.
- Preview, staged Production and live: 238/238 HTTP checks each. All 96 asset
  hashes match. Preview HTML alone has the documented Vercel toolbar suffix;
  staged Production has none.
- Vercel Resources: 96 static assets in Preview and staged Production. No
  functions or middleware. Same build/install/output/Node settings; staged
  runtime configuration exactly matches repository vercel.json. Static builder
  does not consume environment values to generate the app.
- Auto-assignment was verified off before merge. The Git-triggered staged
  production build was checked before promoting that exact deployment.
- Live www alias confirmed on the promoted deployment; apex 307 to www confirmed.
- Post-promotion error-log query (15-minute window): zero returned entries.
  This is an immediate scan, not ongoing monitoring.

Local raw reports and screenshots are ignored evidence under app_src/evidence
and /tmp. This record contains no credentials or private source assets.

## Live journey result

Fresh-browser walkthroughs on www completed all three lessons with 3/3 scores,
used inspection and comparison, returned to the selected result, and saved each
cue. All three saved successfully; no page errors. PostHog requests were
intercepted during these live QA journeys to avoid polluting user analytics.
