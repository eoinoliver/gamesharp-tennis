# Serve and volley correction — 2 November 2026

The user rejected the previous live serve and volley illustrations. Passing
continuity/layout checks had not demonstrated technically convincing movement.

## Findings and resulting behavior

- Serve played 95 capture frames before release; start-to-release is now 25
  frames (0.25 seconds). Release is at frame 80, while the hand is rising near
  head height, instead of frame 96. The source body/contact stay unchanged.
  Lesson fallback toss logic used a maximum-hand-height release (frame 133),
  while many scenes embedded another toss beginning at frame 73. Both now use
  the shared release metadata, joining each untouched authored contact and
  outgoing flight. This removes separate, inconsistent toss implementations.
- The old flight cleared the local net by only approximately 5 cm; the new
  illustrative flight clears by approximately 28 cm and lands in the opposite
  service box. Draw the far service court, and keep playback going through the
  bounce so the outcome is visible. Show the full toss and both feet.
- Volleys previously moved the racket around a nearly upright/receding
  forehand body and a late backhand step. The three shared derivatives now
  coordinate split, knee loading, shoulder turn, opposite-foot step, forward
  weight transfer and a short descending punch. The racket keeps moving at
  contact, and the player recovers to a balanced ready position.
- Sharpen's main forehand volley uses the above-net fvhi clip. The lowfv
  derivative retains its low contact and deeper knee bend in existing lessons.
  Place both Sharpen volleys near the net instead of on the baseline.
- Update stroke cards/stills to match. Regenerated backgrounds include the far
  court; other stroke movement is unchanged.

This is an illustrative correction using the existing renderer and motion
data, without a Blender pipeline or new content. Shared clips preserve contact
centres/balls, contact frames, durations and limb lengths. Existing authored
lesson ball paths remain unchanged. Volley body and foot movement is now
explicitly authored rather than described as captured. Existing licensing stays.

## Reference and review criteria

Tennis Australia, Technical and Tactical Fundamentals (2013), printed pages
37–38: loaded legs, shoulder turn, opposite-leg step, stable wrist, contact in
front while the body moves forward, target-directed follow-through and balanced
recovery. Printed page 43: rising tossing arm, release around eye level,
coordinated throwing rhythm and high contact.

Local reference:
tennis-australia-technical-fundamentals.pdf.
https://www.tennis.com.au/wp-content/uploads/2014/11/Technical-and-Tactical-fundamentals-guidelines_low-res.pdf

Visual evidence must cover preparation, contact, follow-through and recovery
from both sides, including the actual mobile Sharpen view. These are builder
judgments; the release does not claim coach certification or physical-device QA.

## Regression checks

The source check protects original contacts, timing and limbs and measures
knee loading, opposite-foot progression, body drive, continuous forward racket
speed through contact and descending punch. The browser check now explicitly
requires prompt toss, meaningful net clearance, a visible bounce inside the
correct service box and time to read it, alongside all seven responsive views,
contact alignment, cards, choices and reduced motion. The full existing
catalogue/release suite remains required.
