# High Ball visual proof — 13 September 2026

Local review: http://127.0.0.1:8766/.proofs/high-ball/

This is an unscored movement/contact proof, not a thirteenth playable lesson.
Production remains the twelve-lesson release documented in
COACHING_ALL_RELEASE_2026-09-13.md. No calendar, history or runtime lesson changes.
The new .vercelignore excludes .proofs/ from deployment.

## What is proved

Three scenes share a continuous ball-flight model and one renderer in card and
Focus. Shorter bounce permits stepping in; late recovery behind a deeper bounce
favours giving ground; existing space makes holding depth sufficient. Movement
choices replay the same ball, changing the player position rather than inventing
a different ball outcome. Holding back on the shorter ball remains a viable but
later contact, not an impossible answer. Labels can be removed for visual review.

The side-oblique view exposes bounce depth, vertical height, ground shadow and a
player-relative contact band. This is illustrative geometry, not calibrated match
tracking. The contact sample does not animate a stroke or claim a successful shot;
the reference band is not a universal technique prescription. Three movement
controls are diagnostic controls, not the authored four-choice lesson interface.

## Verification

- 63 automated tests pass, including three new proof contracts.
- Launch trust audit: zero errors; existing legacy length-tell warning unchanged.
- Browser checks: all three scenes and nine movement comparisons at 320, 430 and
  1280 pixels; reduced motion at 430; no horizontal overflow or invalid SVG.
- Card/Focus SVG equality, unlabelled rendering, Escape/inert restoration and
  landscape Focus bounds pass. Browser script checks runtime errors.
- Native browser interactions and visual screenshots inspected separately from
  deterministic frame-seeking checks. These do not establish learning efficacy.

Screenshots: /var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-high-ball-2BODWO

Reproduce: GS_BROWSER_BIN=/Users/eoinlynn/.npm/_npx/6de2aa2fded2970c/node_modules/.bin/agent-browser node .proofs/high-ball/verify.mjs

## Next boundary

Technical proof is ready for review. Integrate the full authored High Ball
decisions and consequences before calling it a lesson; then implement Approach
and Serve Adaptation using NEXT_THREE_LESSON_OUTLINES_2026-09-13.md. Retain source
qualification and validate complete journeys before publishing the batch.
