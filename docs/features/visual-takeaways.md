# Visual Daily takeaways

Completing a Daily previously left Home with a short spoken cue. That cue could
name the topic without preserving the condition that changes the decision.
The completion view and completed Home now share an authored visual summary.

## Scope and presentation

All 32 lessons in `daily_plan.json` have a reviewed entry in
`app_src/takeaways.json`. Each combines two labelled cues with one short
conditional explanation. The seven schematic drawing types cover court
position, height, starting position, contact spacing, split-step timing,
controlled arrival and a movement/observation sequence. They are recall aids,
not measured trajectories, technique models or substituted scene recordings.

The visual appears only after completion. Home uses its lesson-specific heading;
the lesson ending retains its existing spoken court cue above the visual.
Professional context, Frank/Lara audio, saving, sharing and continuation remain
in their existing flow. No extra button, autoplay or competing action is added.
Singles/Doubles labels and the Daily schedule are unchanged.

The other 31 activities retain their current endings. Unknown slugs render no
generic diagram. If the visual module fails, Home retains the authored textual
cue and the lesson ending retains its existing cue and controls. There is no
claim that app practice outperforms on-court practice.

## Authorship and build boundary

Each entry records a SHA-256 of its complete generated lesson object. A change
to teaching or professional context fails the build until the corresponding
visual is reviewed and its source hash explicitly updated. The builder also
requires exactly the current 32 Daily slugs and bounds court targets inside the
singles court. Source hashes are not sent to the browser.

Generated `takeaways.js` and `takeaways.css` are part of the application version.
The explicit build overlay extends the existing frozen fingerprint chain; it
does not refresh any earlier baseline. Existing lesson JSON, engine, scenes,
audio and preview/share media remain byte-identical.

## Verification

`tools/takeaway-browser.mjs` checks every Daily in a small mobile viewport,
including completion with imperfect answers, correct lesson matching, readable
labels, no horizontal overflow, no competing controls, unchanged Singles/Doubles
and no reveal on an unplayed day or next rotation. Five representative lessons
also exercise actual three-answer completion, voice cue coherence, pro context,
saving, sharing, return to Home and persistence. A blocked module exercises the
plain-text fallback. The same paths run in Chromium and WebKit.

All 32 rendered figures need personal visual/content review in addition to the
automated checks. Browser emulation is not physical-iPhone testing, and technical
checks do not establish improved recall or on-court performance. Those require
player feedback. Future summaries should preserve the actual decision condition
and may use a different visual when a comparison would be misleading.
