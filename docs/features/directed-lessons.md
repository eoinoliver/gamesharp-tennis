# Directed Daily pilot

Two existing journeys: The Winner (`wn1` opening, `wn2` choice) and Short Ball
(`sb3` choice). The other 61 journeys have no directed treatment. No lesson JSON,
clip, option ordering, correct-answer rule, progress event or audio asset changes.

The pilot adapts the local showcase's editorial pattern into the shared engine:
- Establish the situation with a sweeping camera.
- Show the deciding detail: line margin, or contact height against the net.
- Settle into the existing question and option layout.
- Play the selected route in full, rewind to its first contact and play the
  preferred alternative (or the contrasting shot if the first choice was best).
- Animate the existing ten landing samples for each option and retain their
  counts beside the feedback. These are authored visual samples, not measured
  probabilities or new trials. About retains the educational explanation.

Comparison is sequential from the same contact, keeping the court legible on a
phone. It cannot replace or score the first answer. Normal feedback, Inspect
contact, Try another, saved cues, recap, professional context and Home remain.

Every sequence has a keyboard-accessible skip. Stage tap and playback control
pause both held evidence and motion. Background tabs stop the director clock.
`gs_directed_v1_<slug>` stores only the viewed sequence names locally. On a repeat
visit, openings go straight to the decision and answers play the chosen route
without the automatic comparison. Watch scene / Rewind & compare remain available.
Reduced motion uses those short paths with static camera views. Storage denial
is tolerated; skip remains available. The director uses the existing sound/mute
controls, and reverse playback is silent.

Source: `rally/directed.js`, `rally/directed.css`, small engine lifecycle hooks and
build inclusion. The untracked showcase is read-only reference, not deployment
source. Deployment remains the Git build of `app/`.
