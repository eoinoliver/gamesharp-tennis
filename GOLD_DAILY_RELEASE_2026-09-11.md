# Gold pilot release — 11 September 2026

Scope: publish the reviewed nine-prototype pilot (27 decisions). Zero Gold lessons enter the main Daily. Fifteen of the 24 lesson spines remain research briefs. Existing main-app eligibility remains nine Predict journeys, eleven withheld Predict IDs, twenty approved supporting Reads and twenty-two Live Points.

The user explicitly instructed “fix and deploy”, then “proceed”. Canonical deployment directory: `/Users/eoinlynn/Downloads/gamesharp-tennis-integration`, linked Vercel project `gamesharp-tennis`.

## Final repair

Contact now uses coach Andy Zodin’s specific discussion of Agassi’s non-hitting arm and body-ball distance in Essential Tennis Podcast 106. The previous early-striking story did not establish spacing. The source supports the observation, not a causal diagnosis of the two illustrated misses. Canonical source and human review sheet agree.

## Evidence

- 33/33 automated test files passed after the repair; trust audit: zero errors, one unchanged legacy warning (366/549 answer-length tells).
- Existing final normal-motion coverage is recorded in `GOLD_DAILY_PILOT_REVIEW_2026-09-10.md`: all 27 correct at 320×740 and all 27 incorrect at 430×932. Runtime JS/CSS are byte-identical to that candidate; this release changes Contact source copy and the loader token.
- Additional actual Chromium reduced-motion run: all nine journeys/27 correct decisions, each decision opened and closed in Focus View, each completion 3/3, at 320×740. Contact’s settled comparison was visually inspected. No document overflow.
- Additional actual Chromium failed-media run: aborted `**/livepoint-audio/**` requests, all nine journeys/27 incorrect decisions completed 0/3 at 430×932. This run exercised rapid selection and pointer-down skip to settled evidence. No uncaught runtime errors. Expected failed network requests occurred.
- Restored media: sound toggle saved 0/1 correctly and showed mute/unmute; replay scheduled five decoded court audio buffers for Serve evidence. First start before decoding can remain silent; replay after decoding played scheduled buffers. Physical speaker listening was not performed.
- Refresh, pilot exit, Home/profile/Daily navigation, replay and normal desktop presentation at 1280×900 checked. Serve desktop screenshot showed readable evidence and choices without overflow.
- Existing manifest eligibility and exact destination bindings passed the contract suite. The unchanged main Predict/Live Point corpus was not manually walked again in this narrow source-copy pass; its dated approval evidence remains in the manifest. This is a pilot release, not a fresh whole-app certification.

## Artifact identity

Loader `20260911-gold-daily-48`; engine `2026-09-10.gold-daily.19`; spines `2026-09-11.lesson-spines.9`.

| File | SHA-256 |
|---|---|
| index.html | dda324b7a10a57bb98b5f642f5ce6238ba180ad59073567e4fd205669d8933b8 |
| gold-daily-prototypes.js | d36874400e03cb2f166ac7f6f2fce02807373b45e1706e60b046cad652e78df2 |
| gold-daily-prototypes.css | da2b21938925758db3e1e4d653450c8053e000cf202de484ed7b88ac9cf3168d |
| gold-daily-lesson-spines.js | 7849a9e2307d3b23b574af5e7d7a7294db511eaebf12e7b2473970e3aa0335eb |

Physical iPhone audio, independent coach review and real-player learning/retention remain unverified. Main-Daily calendar/progress/cross-module integration and the separately recorded legacy routing issues remain outside this pilot release.

## Deployment and public verification

Production deployment `dpl_AQD1hKg9m2VLDAuwJF1WS3nRyvJj` reached READY and was aliased to `https://www.gamesharptennis.com`. Immutable deployment URL: `https://gamesharp-tennis-3z2xlb3z4-eoinlynn-5978s-projects.vercel.app`. Static build completed in 390ms; no Git commit exists in this canonical directory.

Public homepage, prototype engine and lesson-spine bytes match the SHA-256 values above. Homepage returned HTTP 200 from Sydney with `cache-control: public, max-age=0, must-revalidate`. Public pilot menu exposes all nine prototypes. Personally completed Contact’s three decisions in normal motion at 390×844, reached 3/3 and inspected the revised Agassi/Andy Zodin story and source control. No uncaught browser errors were reported. Vercel’s deployment-scoped error scan returned no logs; that is not independent long-term monitoring. Drains were not inspected.

Public pilot: `https://www.gamesharptennis.com/?goldDaily=1`. The main Daily remains unchanged. This post-deployment entry is a local release record; runtime files were not edited after verification.
