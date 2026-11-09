# Daily-led GameSharp — 9 November 2026

Eoin agreed to Daily Challenge as the consistent front door, Live Point as an
optional related experience, Sharpen for match preparation, and retaining the
best Predict activities without another top-level product name. He authorised
implementation with “agreed. proceed”. Current feature approval supersedes the
migration-era bare-entry auto-start requirement; explicit legacy auto-entry URLs
remain supported. All release checks and Git/staged-production safeguards remain.

## Experience

- Bare and Home visits show one featured challenge and an explicit action.
- The same local calendar date selects the same lesson regardless of progress or
  ability. `app_src/daily_plan.json` fixes the 32-item rotation from 9 November.
  It repeats after 32 dates; there is no claim that every selection is new content.
  A previously completed lesson is labelled a revisit. Completion uses its last
  played date, so a historic completion cannot claim today's challenge is done.
- First scores, best scores, browser identity, streaks, cue storage and the
  personal unplayed queue are preserved. Other activities still count for a
  streak; they do not mark the featured challenge complete.
- Completing a challenge is a valid stopping point. Its professional story is
  visible after the court cue. Optional related practice follows with an explicit
  bridge; it does not become a second completion requirement.
- Seventeen Daily lessons and both existing anticipation activities have reviewed
  links to existing base Live Points. Fifteen Daily lessons remain unpaired.
  No related link bypasses a later-day variation gate or substitutes a generic
  point when the lesson does not fit. All nineteen connections are listed in the
  plan and retain the original decision/scene/voice data.
- Completed Home repeats the approved spoken cue, without starting audio.
- Shared challenge URLs identify the exact lesson and contain no answer or score.
  A link shared yesterday still opens the same activity. Native share cancellation
  and clipboard failure are reported honestly; no automatic message is sent.
- Foreground date changes refresh Home; cross-tab progress updates are reflected.
- Explore offers Challenges (32 Daily + two anticipation activities), Live Points
  (16 connected singles + seven longer points), and Doubles (six).
  Existing `kind=predict` and `kind=patterns` links remain supported as aliases.
  All 63 activity URLs and stored slug identities remain intact. Predict display
  titles omit the format prefix; the authored lessons and internal engine remain.
- Home keeps separate routes for saved cues, partner preparation and Reset.
  Unfinished/updated points and due later-day reads remain available below Daily.

## Scope and verification

No new activity is enabled or withheld. All 63 protected lesson/scene contracts
remain unchanged. No stroke, camera, ball flight, choices, correct answers,
professional story or recorded voice asset is edited by this feature.

The explicit build overlay freezes every previous fingerprint. New checks cover
calendar selection, revisits, immutable scores, personal-queue independence,
exact sharing, missing mappings, storage failure and the real completion path.
Existing UI expectations change only where this approved hierarchy changes them;
legacy entry, sound, privacy, technique and coaching checks remain in place.

Featured view/start/completion, related-point clicks and share intent/success
use the existing production-host-restricted analytics. These are observation
signals, not evidence of retention or on-court improvement. A two-week club-player
trial should measure later-day returns and remembered/applied cues. No coach
sign-off or physical-device certification is implied by automated browser checks.
