# Gold Daily pilot — implementation review, 10 September 2026

## Status and direction

Nine local reviewable prototypes, 27 decisions. Five earlier prototypes plus four additions: Mental Reset, Return Position, Split Step and Decision Quality. The 24-spine bank contains 15 further research briefs, not 15 finished lessons. No Gold lesson has been promoted into the main Daily by this change. No deployment was performed.

The user confirmed that Gold should ultimately replace the existing Daily. The intended product has three complementary areas: Daily (one insight, three connected decisions); Predict → Live Point → Playbook (reading and applying a point); Sharpen (targeted improvement, renovation later). They should reinforce the same concepts without forcing every visit through all three. Shared pacing, controls, evidence and feedback rules do not mean using an identical animation for incompatible tennis problems.

This is a local pilot review, **not a production release sign-off or evidence of learning efficacy**. Existing launch eligibility, scheduling, scores, streaks, user history and downstream route integrations are unchanged.

## Implemented changes

- Mental: replaced an inferred psychological/technical diagnosis with an observable shorter target and next-point routine. Target-choice feedback shows a plan, not a guaranteed landed shot. Choosing a mechanics rebuild explicitly has no target, rather than inventing one. The double-fault transfer ends with target/exhale/readiness and an unknown next result. Removed nonexistent reset-serve strike/bounce sounds. Added player positions, opponent movement and neutral-ball preparation evidence.
- Mental source: replaced a broad career-resilience tribute with Murray's own Wimbledon interview about pausing, catching his breath and preparing for the next point. Target selection remains GameSharp's application, not a claimed Murray prescription.
- Split: the transfer opponent actually contacts .38 seconds sooner, while the learner's original takeoff, landing and push remain on the previous clock. Corrected examples land .15 seconds after contact and push at +.25, an illustrative relationship rather than a universal exact timestamp. Wrong adjustments get an authored scene followed by a fresh corrected shot. Racket, feet, ball, bounce and recorded-court audio share the same scene clock.
- Return: preserved the same-serve/shared-bounce comparison and reversed the position adjustment for the slower second serve. Corrected the server to start behind the far baseline on the diagonal side, preserved deep-return labels within the canvas, and showed the selected starting position before the reference on incorrect choices.
- Winner: neutral colours before selection; no pre-played successful attack in transfer. The third question now requires a shot decision, with four corresponding paths, rather than repeating height/balance/space labels. Incoming flight precedes the outgoing shot, and its token hands off at contact. The claimed line clip now actually touches the singles line. Removed an unsupported superlative from the Ferrero story.
- Existing Contact: visual inspection caught the completed animation resting on follow-through while its question asks about contact. Kept the approved 2.85-second physical motion and geometry, then returned to the authored contact frame. Cancelling/skipping now cancels the underlying animation loop so it cannot overwrite the held frame. The read attention window is 3.90 seconds, with the decision gaining emphasis after the final contact cue; this is intentionally longer than the physical motion.
- Shared focus view: corrected a landscape height calculation that clipped the Split timing strip. Return uses its taller evidence aspect ratio in focus view too.

## Verification actually performed

- Final automated suite: **33/33 passing** (32 existing checks plus one new additions regression file). The new regression exercises all 15 Split read/answer states with exact audio clocks, fresh corrected scenes and reduced-motion static rendering; process-only Mental outcomes; neutral Winner evidence; line contact; legal Return server/diagonal geometry; and Contact cancellation/hold guards.
- Final browser candidate (`20260910-gold-daily-47`): all **27 correct-answer decisions at 320×740** and all **27 incorrect-answer decisions at 430×932**, including completion and result scores. Every decision had four initial choices; no horizontal document overflow or captured browser warnings/errors.
- Personally inspected representative rendered evidence from all nine families, including Contact's completed held frame, Mental's no-target correction, Return's selected/deeper positions, and Split's timing strip. Exercised replay/expansion/close during the review. Contact, Mental and Split were inspected in focus view; Split was rotated to 740×320.
- Rechecked the exact landscape defect after the final correction: SVG bottom 272.74px, containing visual bottom 273.74px; no clipping. The full HIT/LAND strip was visible.
- Early/rapid choices remain operable; automated UI walkthroughs exercised them. No autoplay lock was added.
- Trust audit: zero errors; the existing **366/549 answer-length-tell warning** remains recorded legacy debt, unchanged by this work.

## Limits and remaining gates

1. Contact's Agassi professional story is authentic in broad timing/pressure terms, but is still less directly aligned to lateral body-ball spacing than the lesson requires. Its renderer is improved; this does **not** close that editorial issue. Do not describe all five prior lessons as unconditionally approved.
2. The Andreescu WTA feature supports the professional association, not a precise landing timestamp. The timing boundary is independently documented in the spine review with primary research and frame analysis. Do not attribute the .15-second illustration to Andreescu.
3. No physical-phone audio listening, OS-level reduced-motion browser pass, failed-media injection, independent coach review, or target-player recall/retention study was performed in this pass. Pure reduced-motion/audio tests are not a substitute for those experiences.
4. The Gold calendar, concept progress and precise links into Playbook/Sharpen remain unimplemented. The three-area vision is approved direction, not a claim that the current product already has that integration.
5. Legacy routing, eligibility leaks, old public paths and source-control/release concerns from the alignment audit remain open. This user-directed pass prioritised the Gold pilot and did not silently expand into renovating those systems.

Confidence: high that the shared architecture is the right direction and these specific defects are corrected; moderate that the whole pilot meets the desired delight/comprehension bar without player evidence. Scale only after story alignment and the remaining experience checks, not because the lesson count increased.

## Exact local runtime candidate

- Engine: `2026-09-10.gold-daily.19`
- Spines: `2026-09-10.lesson-spines.8`
- Loader: `20260910-gold-daily-47`
- `index.html`: `feaec3723edcd378856a9895c8d958bee9fea27e8314fc66a6d1410ab39e378b`
- `gold-daily-prototypes.js`: `d36874400e03cb2f166ac7f6f2fce02807373b45e1706e60b046cad652e78df2`
- `gold-daily-prototypes.css`: `da2b21938925758db3e1e4d653450c8053e000cf202de484ed7b88ac9cf3168d`
- `gold-daily-lesson-spines.js`: `88fcc86d2e835601d9017ab359293b708bd9934de1b149b284fe2af9da749a74`

Local preview: `http://127.0.0.1:8766/index.html?goldDaily=1&review=47` while the canonical-directory preview server is running.
