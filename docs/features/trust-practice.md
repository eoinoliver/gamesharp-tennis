# Trust and connected practice — 3 November 2026

The audit found misleading save/completion claims and a disconnected practice
journey. This release makes storage and feedback acknowledgements truthful and
connects existing content to an accessible saved-practice collection.

## Changed behaviour

- Cue writes require a successful browser-storage write/read-back. Failure keeps
  the action available and explains that nothing was saved. Existing malformed
  cue data is preserved rather than silently replaced. Progress writes also
  verify persistence. After a failed progress write, that page retains its new
  state in memory, displays a warning at completion, and cannot overwrite newer
  saved state from another tab. Reloading can lose that unsaved progress.
- My Game is a top-level entry within Sharpen. Every valid saved cue is available,
  including legacy records beyond twelve. Known lessons resolve to the current
  teaching and drill, with a notice when the saved cue wording has changed.
  Each known cue links back to its original activity. Storage remains local to
  the browser; no account or cross-device sync is implied.
- All 32 Daily challenges and all 16 Live Points appear in the seven existing
  Sharpen areas. Counts mean played, not mastery. Explore groups all 57 activities
  into Live Points (16), Daily (32), Predict (2), and longer Play the Point (7).
  Filters retain direct access, meaningful activity labels and decision counts.
- Daily exhaustion names its scope and counts remaining activities. Completing
  the 32 Daily challenges and eight primary Live Points leaves 17 activities;
  it no longer claims the entire app is complete.
- Save is alongside the court cue. The paired later-day read and optional beta
  question are visible. There is one comparison entry, then the existing two
  comparison alternatives. First responses and scores stay immutable.
- Feedback sends the optional comment with the usefulness answer. Only a
  successful production HTTP response produces an acknowledgement; errors keep
  the comment and retry action. Preview explicitly says it does not send.
  Production analytics stay restricted to the two approved HTTPS domains.
- The ten newer points use the authored explanations for the two committed
  choices in their completion summary. Leading option wording is neutralised;
  answer ordering, grading and all point geometry remain unchanged.

## Teaching corrections and provenance

Forehand Bill's drill now asks players to recover towards the likely reply angles
while their ball travels, rather than touch the centre mark unconditionally.
The unsupported Courier attribution and broken TLS source have been replaced by
LTA coach Matt Smith's footwork fundamentals:
https://www.lta.org.uk/play/tennis-tips-and-techniques/improve-your-tennis-footwork-on-court-with-these-simple-tips/
The source supports movement, adjustment steps, balance and recovery. Applying
those fundamentals to this run-around scenario remains GameSharp's teaching
judgement, not an endorsement by LTA or a claim about Courier.

Answer the Drop's cue now matches its existing recorded voice: “Get there. Look
up before choosing.” Its drill distinguishes low/stretched contact from early,
balanced, higher contact with the opponent deep. Existing authored low pickup
scenarios retain their scenario-specific answers. Saturday, approach and return
cards no longer promise the winning shot, an easy volley or removal of a weapon.
The low-volley coaching reference no longer exposes internal repair terminology.

## Verification boundaries

The source guard compares all ten newer point datasets to main 18ef19f, removing
only the human-readable comparison label before hashing. Grading and option
counts are checked separately. Forty routes and all 57 activities are retained;
zero new activities are introduced or withheld. Existing serve/volley motion,
clips, sourced sound, voice assets and reduced-motion behaviour are unchanged.

New isolated tests cover failed writes, stale-tab protection, cue retries,
malformed storage, fourteen legacy cues, updated teaching, remaining counts,
and rejected/successful feedback responses. The dedicated browser journey covers
320/390/1280 px, all content groups, complete cue/drill/replay navigation,
quota failure, exhaustion and isolated mocked production acknowledgements.
The existing release suites continue to cover motion, routes, learning, sound
and shell behaviour. Exact run outcomes and deployed identity belong in the
release record, not inferred from compilation.

No independent coaching certification, physical-device test, cross-device save,
or evidence of improved on-court performance is claimed.
