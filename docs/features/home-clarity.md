# Home clarity — 9 November 2026

Eoin found the previous mobile Home a cognitive blur. This revision makes the
daily invitation dominant and removes the directory of competing practice and
preparation cards from Home. The green/gold identity runs through one continuous surface. Eoin rejected the
pale panel in the first preview. The revised design uses a larger question, a
real court scene and one gold action; singles/doubles are quiet text links.

- All 32 daily invitations have short situation-led headlines and an actual
  still and silent motion preview from their own first decision or lead-in. `home-preview-frames.json`
  records the source scene/frame; `tools/render-home-stills.mjs` regenerates them
  using the existing renderer. Instructional text labels are omitted from the Home
images only; players, ball, court and the actual lessons remain unchanged.
Contact Clue uses its opening rally rather than
  its cropped contact inspection. These are previews, not additional evidence
  or replacement lesson animations.
- Home offers Play / Continue / Replay according to existing saved state. A
  historical completion does not complete today's occurrence. Today's completion
  becomes a compact spoken court cue, replay/share, and its mapped optional point.
- Sound, Frank/Lara, and narration live in a keyboard-operable header disclosure.
  Master mute remains authoritative. Selecting a coach does not start speech.
- My Game remains in the header; its gold dot denotes an active saved match cue.
  Optional player level is edited there instead of interrupting a completion.
- The personal challenge queue and recommended/resumed singles point are at the
  top of their Explore filters. Reset and partner preparation remain in Sharpen.
  No lesson, source, coach recording, route, progress record or eligible mapping
  has been deleted. The disclosure about analytics is available under About your
  data, with its original wording.

The intentionally changed expectations in older browser checks concern only
Home presentation, settings access, and relocated entry points. Historical build
fingerprints remain frozen; `home-clarity-build.json` enumerates this revision.

Verification covers all 32 dates at 320px, fresh/revisit/completed states,
keyboard access, mute persistence, image and storage failures, all 63 catalogue
entries, real challenge completion/sharing and preserved saved-cue/Reset journeys.
Chromium and WebKit checks are browser automation, not physical-device testing or
independent user research. This revision does not claim measured retention gains.

The remaining product question is whether new players start the challenge without
hesitating and returning players can find saved cues and Reset. A short observed
trial with club players should test that before further Home expansion.

Home motion autoplays once on arrival, at the lesson's real 100-frame/second
timing, then holds the decision frame. `home-motion-frames.json` records the
32 exact source ranges. MP4s contain no audio track, use inline playback and
are loaded only for the current Daily. A 44px pause/replay control remains
available. Reduced-motion and Save-Data preferences keep the still and explicit
Play; browser autoplay rejection also falls back to Play. Hidden/offscreen
previews pause; deliberate pause and completion are never overridden by scroll.
Failed media leaves the existing still and primary challenge action usable.
Today's completed cue stays compact, without reintroducing the court preview.

Sharpen now opens with the stroke animation and its existing controls/reference
frames. What needs work, My Game, Reset and the eight practice areas follow.
Only their reading order and section hierarchy change; no destination or
technique content is removed. Home retains its daily invitation and two routes.
The initial frame-by-frame breakdown is collapsed beneath the animation, so
practice choices follow sooner; opening the card or choosing a stroke still
reveals the same reference frames and cues.
