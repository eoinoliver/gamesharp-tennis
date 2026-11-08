# Professional context — 8 November 2026

The audit found generic repeated introductions and two material scope problems:
Medvedev's return-depth statistic used the wrong denominator/comparison group,
and the Nadal–Medvedev drop-shot takeaway made position the sole cause of the result.
The new cards use accurate paraphrases, visible attribution types and a separate
“Your next point” application. They do not imply player endorsement.

## Authorship and coverage

`app_src/pro_insights.json` is the authoritative editorial registry, keyed by all
63 catalogue slugs. `app_src/build.py` assigns it after reading the scene lesson,
so regenerating an authored scene cannot restore an obsolete professional card.
The older inline `pro` fields in `rally/lesson_*.js` and their generators are
historical inputs, not published context. Edit the registry for professional copy.
The registry itself is not deployed; only the selected card travels in lesson JSON.

- 53 sourced cards, including four newly added connections: Attack the Backhand,
  the two Predict activities and Play the Point.
- All six doubles cards now use the Bryan brothers, Louis Cayer or Wayne Bryan.
  Cayer's positioning principle is explicitly separate from GameSharp's lob
  ownership example. The fake-poach source is a counterexample, not a claim that
  the current animation recreates Wayne Bryan's drill.
- Partner Reset uses Mattek-Sands / Jamie Murray's discussion of errors and
  communication. Federer and Abramowicz remain in the other two routines.
- Ferrero's specific repeatability contrast replaces the generic consistency
  excerpt. Barty/Tyzzer is retained; Borges moves to net-entry context; Annacone
  supplies approach/volley connections. Analyst and research sources are labelled.
- Ten entries have no dedicated professional card: six composite points and four
  source gaps (High Ball, Answer the Drop, Late Is the Culprit, The Moonballer).
  The useful take-home remains. Iga's class announcement is not used as evidence
  for an instruction it does not contain. No lesson eligibility was added or removed.

The split-step cue and drill now use the already-approved spoken cue's timing
language. The third explanation says “around their contact” rather than “on”.
Scenes, correct answers, routing, animation, voice assets, coach preferences,
partner sharing and stored progress are unchanged.

## Evidence and boundaries

The 8 November audit checked publisher text, source PDFs and live/local lesson
identity. Some ATP and Tennisplayer pages were verified from publisher-indexed
text after direct automated retrieval failed. Public summaries of paid courses
and webinars are labelled as summaries; the complete videos were not reviewed.
Source URLs, dates and actual speakers are carried in each card. All new prose
is an attributed paraphrase, not a newly manufactured quotation.

`tools/pro-insight-source.py` checks all 63 protected scene/decision contracts,
registry coverage and explicit fallbacks. `tools/pro-insight-browser.mjs` checks
all 63 completion views at phone and desktop sizes, including attribution, source
links, fallback teaching and saved-cue controls. The two Predict lessons use their own completion renderer, reached by actual
choices and playback at both widths; the other 122 checks are renderer fixtures,
not complete user journeys. Predict retains its three read reviews and court cue. The existing journey and release suites
remain required. These checks do not constitute external coaching validation.

## Promotional media

The two Ferrero singles films and the doubles partner film are revised outside
the app deployment, using recorded app footage and Lara narration. The approved
brand cadence is reused. The Barty film remains the approved version. The share
pack includes captions, source credits and smaller MP4s. Professional stories are
editorial references; there is no professional footage, voice cloning or endorsement.

This branch prepares a review candidate. It does not promote production.
