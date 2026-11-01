# Sharpen stroke clarity — 2 November 2026

Eoin prioritised believable, clear tennis movement before more content. This
is a bounded correction to the current illustrations, using the existing SVG
figure and motion data. No Blender pipeline, new raw capture or video import.

## Changes

- Serve: the ball stays in the tossing hand, releases during its upward motion,
  follows a continuous arc to the existing contact and continues down court.
  Camera framing includes the toss and feet. The serve court placement follows
  the lesson's existing offset. The old October PR #30 supplied the starting
  ball/court approach; its stale figure and foot code were not imported.
- Slice: retain the high preparation and contact, replace the topspin-like wrap
  with forward extension and a controlled recovery. The free arm counterbalances.
- Three volley variants: compact set, short follow-through and ready recovery;
  keep the racket face visible and stable. Preserve captured body movement.
- Five two-handed backhand variants: place the supporting hand on the handle,
  retain the source hitting path, and show more preparation in Sharpen.
- Regenerate the stroke-card images using the same corrected shared clips.
  Clarify backhand and volley cues to match the illustration.

All nine adapted clips preserve the source contact point, contact frame and
clip duration, so existing lesson ball tracks and decisions stay aligned.
The captured foot-direction supplement is unchanged. The synthetic Sharpen
ball is separate from the lessons' authored ball paths; those paths are intact.

## Reference cross-check

Tennis Australia, *Technical and Tactical Fundamentals* (2013), printed pages
34 (two-handed backhand), 36 (slice), 37–38 (volleys), 43 (serve):
https://www.tennis.com.au/wp-content/uploads/2014/11/Technical-and-Tactical-fundamentals-guidelines_low-res.pdf

The checks are practical: coordinated hands; high-to-low slice with extension
and separation of the arms; compact volley with controlled follow-through;
visible toss, overhead contact and recovery. These are authored illustrations,
not a claim of exact biomechanics or independent coaching approval.

Existing motion provenance remains Tennis-MoCap, pinned in
THIRD_PARTY_NOTICES.md and rally/foot_directions.json. The prior ACE Tennis Lab,
SweetSpot and legacy capture investigations remain reference context; this
change does not claim fresh video analysis or introduce their media.

## Verification

`tools/sharpen-stroke-source.py` checks contact/timing, unchanged limb lengths,
connected backhand support and compact volley finishes against frozen inputs.
`tools/sharpen-stroke-browser.mjs` checks all seven Sharpen strokes at 375, 430
and 1280 pixels, ball continuity/contact, serve crop, loaded stills, stroke
selection, normal playback and reduced motion. It saves visual evidence.
The existing stroke-integrity multi-angle checks and complete 47-journey browser
suite remain required. Screenshots and automated checks are not physical-phone
or coach validation. Release identities and final outcomes go in the worklog.
