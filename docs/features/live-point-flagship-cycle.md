# Live Point flagship cycle — 29 October 2026

This release completes the first learning cycle using two existing, reviewed authored points. There are still 43 eligible journeys: 32 Daily, 2 Predict and 9 Play. No new motion or unreviewed scenario is introduced. The proposed six-play pilot is a subsequent content gate, not six plays claimed by this release.

## Learner experience

A player makes up to four connected decisions in Buy Time. Use It. The committed point replays before the written payoff. Four short Frank endings reflect the actual first reply and recovery choices; they do not declare the whole point won or all later choices correct. The existing neutral recording remains the initial/default voice asset and is not substituted for a failed route-specific ending. Automatic narration never waits for a late download; manual playback can retry.

The prominent turning-point block offers the chosen recovery and a one-change comparison. Both use the same reply, opponent and ball trajectory, fixed camera, and hold 18 frames after opponent contact. The on-court marker shows position at that contact. Only recovery timing changes. Controls beneath the court permit repeated inspection and an explicit return to the cue. Inspection is silent, emits exposure only after reaching the evidence freeze, and cannot rescore the attempt.

A completion-only challenge button shares the point identifier, with no user identifier, answer, route or score. A recipient starts independently with a neutral title. Native share cancellation is respected; unsupported sharing offers a selectable/copyable URL. No message is sent by the app without the user's share action. No sender/recipient attribution or claim of referral conversion is made.

The other-wing point is available on Home from the next local calendar day after the original completion. Beta users may try it early as practice. Unfinished points remain reachable. Return feedback judges both the reply and recovery, not just the first answer. A fresh later-day label requires the first attempt, a prior original completion, and no earlier exposure. An earlier look, same-day completion or retry is labelled practice. Progress remains local to the browser; it is not synchronised between devices and cannot prove on-court learning transfer.

## Repeatable production unit

`rally/live_point_families.json` declares the first family, its source scenes, variants, learning signals and comparison invariants. `rally/build_live_point.py` consumes that declaration. Shared clips and the single playback timeline remain authoritative for movement, ball contact, sound and freezes. No Cartesian-product branch generator or arbitrary visual reskins are introduced.

For each additional family, author these together:

1. One recognisable coaching problem and evidence visible before commitment.
2. Only consequential branches, with genuinely equivalent states allowed to rejoin.
3. A comparison that changes one decision and explicitly preserves its controls.
4. A changed-context transfer point with different perceptual evidence and answer ordering.
5. Two short, truthful spoken sentences, a useful court cue and existing deeper coaching.
6. All-route continuity, audio, small-screen and semantic review before eligibility.

The next two proposed families are contact space and recovery after serve. Their existing lesson assets are candidates for inspection, not approval or proof that the point sequences can be stitched coherently. Each needs its own authored routes and controlled comparison. Do not expand to six merely by mirroring the first family.

Record authoring, animation adaptation, coaching review and validation time separately for the next two families. Build runtime is not a measure of editorial production cost. No sustainable weekly cadence is claimed until those two units are completed and reviewed.

## Evidence and release gates

Source tests cover both-decision transfer feedback, exposure/retry classification, private challenge links, all four voice mappings and stale voice-download isolation. Browser checks cover every first-two-choice combination in both plays, the fixed comparison, playback/payoff order, share cancellation/fallback and small-screen controls. Existing route, stroke integrity, sensory and full catalogue suites remain required.

Track comparison completion, share intent versus actual native/copy completion, and the two decisions in a first later-day attempt. These are different events; a copy is not evidence of a recipient, and a later-day read is not evidence of improved match results. Decide the next content investment from actual returns, changed-context choices and qualitative beta feedback. No claim of viral demand or measured retention is made.

Current autonomous deploy authorization applies. Preserve immutable historical build manifests, exact Git CI/Preview verification, staged Production comparison and rollback. Baseline: app a9d9eec67d / dpl_8SiBXt32r6MDvWViUkcKtMzHTJLA. Physical-device audio and independent coaching certification remain unverified.
