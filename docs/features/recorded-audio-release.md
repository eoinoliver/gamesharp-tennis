# Recorded sound release — 26 October 2026

Replaces the shared synthetic contact/bounce/applause effects with four individually
sourced CC0 recordings. Two real forehand contacts, a soft grass bounce, and a
900 ms small-crowd applause cut total 118,364 bytes. Removes the artificial net
buzz without adding an unrelated substitute. Selective timing, silent automatic
wrap-up, neutral Predict choices, iOS playback routing and opt-in/mute persist.
Audio assets load only after opt-in; loading can be cancelled, failures retried,
and contacts cannot play late after downloading. All 41 lessons remain eligible.

Candidate app 2dd4194def, PR #41, commit
32fa3b7baa89ae37802c87d90e9997eac51fc947.
Preview dpl_EBb8AtXhA1iDP2wEzqpLaA85ni17,
https://gamesharp-tennis-d5fag1tjv-eoinlynn-5978s-projects.vercel.app.

Validation: 25 unit tests; 85 sensory/navigation checks in each of Chromium and
WebKit, including actual decoded buffers, cold/missing assets, cancellation,
retry and bounded nonzero offline rendering. All samples finish within one second;
no oscillator or noise synthesis remains. 104 exact release files, 103 public,
109 source/test fingerprints; historical baselines stay intact. Preview has
245/245 HTTP/hash/routing/header/exclusion checks and 103 static assets in Vercel
Resources. Two complete preview journeys save cues and continue to the next
lesson with recorded contact/applause and persistent mute. Protected preview
journeys use authenticated Vercel CLI transport only for the exact deployment
origin; security settings are unchanged. Chrome activation/answer/mute inspected.

Sources and adaptations are recorded in recorded-audio-sources.json and
THIRD_PARTY_NOTICES.md. Public HQ MP3 previews were trimmed, filtered, faded,
peak balanced and converted to PCM WAV; lossless master quality is not claimed.
This validates sources, timing and signal, not a human listening panel or
physical iPhone/iPad speaker sound. Those physical-device listening checks remain
unverified. Return rate and learning efficacy are not inferred from this change.

Previous live/rollback: dpl_HjYv1V6KiX36tBKRWgzYCrPCyXzX, b245169ce4,
main 0d456f91a289c13a57f0b75a2d6b50a1d27d659b. Standing user full-autonomy
and deploy-live instructions authorize this release with the Git/staged checks
retained. Documentation-only follow-up builds are not promoted.

Full local release suite and GitHub run 40313902379 passed: all 41 scene gates,
445 readiness and 325 Contact Clue checks, app flow, mobile/desktop layout, payoff
and Pusher checks. Pre-merge guard confirmed clean exact candidate, green checks,
unchanged main/live, correct Git project, automatic domain assignment off, and a
Ready Production rollback. PR #41 merged as
6f8b3e3cb5010708e84e163c16ad7f925534a316; Git tree
b44ecc2a7b1fbf6050bafafbf815fb0580bcc428 exactly equals the reviewed candidate.

Production dpl_6JGuduEib2zQqWyXwpcz1C7fmXrQ,
https://gamesharp-tennis-mdado6kkk-eoinlynn-5978s-projects.vercel.app,
was Ready/Staged at the exact merge SHA. All 245 production checks and two full
recorded-audio journeys passed before promotion. Resources shows 103 static
assets, matching preview. Project/build/runtime/routing settings, 136 build and
runtime environment-key inventories match; zero project environment variables,
no functions or cron jobs. Fresh pre-promotion guards passed. The exact artifact
was promoted successfully; www points to its deployment ID and apex resolves to
www. All 245 live checks and direct Chromium journeys pass. Live QA intercepted
23 analytics requests rather than submitting test activity to production.

Direct live WebKit journeys also passed with recorded contacts/applause, saved
cues, next lessons and mute persistence; 23 analytics requests intercepted and
zero page errors. The first WebKit smoke run checked the URL before navigation
finished: its wait used the old page's already-true __test hook. The ignored QA
script now waits for the expected URL alongside the tap, then for the new page;
the targeted rerun passes. No application code or artifact was changed. Runtime
error query returned no entries (a static-site log check, not client proof).
No rollback was required. Physical iPhone/iPad listening remains unverified.
