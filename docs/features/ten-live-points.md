# Ten connected Live Points

User-authorised scope: ten points in gated batches of 3, 3, 3, 1. Preserve the
existing 47 journeys, shared renderer, first attempts and voice preferences.
Each point has two committed decisions, four routes, a controlled first-choice
comparison, a short neutral Frank cue, sourced coaching context and a drill.

The first choice changes the opponent's contact, the return ball and the next
decision. No duplicate lead-in plays between committed decisions. Outcomes are
labelled as still in play: illustrated landings do not prove a winning tactic.
Multiple defensible choices are accepted where the contact supports them.

## Authoring evidence

`rally/build_live_ten.py` is the reproducible authoring source. It uses licensed
incoming action and the shared repaired motion clips. After the first contact,
explicit gravity/bounce trajectories create authored possible continuations.
The final eight incoming samples ease to the exact stringbed contact to reconcile
the source's one-frame outgoing sample offset. Source datasets and raw clips
remain unchanged. This is an illustration, not motion capture of an entire rally.

Controlled comparison holds the initial ball, player preparation and camera
fixed. The changed first shot and resulting opponent response are then shown.
The comparison freezes relative to each opponent contact, not at a misleading
shared timestamp. Opponents recover to neutral coverage before seeing the final
choice; they cannot anticipate its target.

## Batch gates

1. Return Under Pressure; Return With Time; The Line Is Tempting.
2. Now the Line Opens; First Volley: Build the Point; First Volley: Use the Opening.
3. Pass in Two; Over Their Head; Reach the Drop.
4. Arrive With Options.

Before advancing: every route in mobile Chromium/WebKit and desktop Chromium;
ball contact, net and bounce checks; incoming and actor continuity; saved path,
score, comparison, cue and real audio playback; route-sheet visual inspection
and normal-speed use. Full build parity, regression CI and exact hosted release
verification follow completion of the four batches. Physical-device listening
and independent coaching validation are not claimed.

### Batch 1 checkpoint

Passed 12 unique routes at 390px Chromium and WebKit, plus 1280px Chromium
(443 assertions); 63 unit tests; independent net/bounce/continuity checks.
Personally inspected all 12 route sheets and normal-speed AA, BA, BA journeys.
All 24 authored new strike contacts coincide with the stringbed within 0.01 mm
in the renderer; this establishes contact alignment, not coaching certification.
Fixed opponent anticipation before the second choice. Three short recordings
are installed with provenance and levels. Batch 2 may begin.
