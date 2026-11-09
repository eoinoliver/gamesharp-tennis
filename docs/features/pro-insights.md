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
Source URLs, dates and actual speakers are carried in each card. Narrative is original attributed paraphrase. Short verbatim excerpts are checked
against their named speaker and source; no quotations are manufactured.

`tools/pro-insight-source.py` checks all 63 protected scene/decision contracts,
registry coverage and explicit fallbacks. `tools/pro-insight-browser.mjs` checks
all 63 completion views at phone and desktop sizes, including attribution, source
links, fallback teaching and saved-cue controls. The two Predict lessons use their own completion renderer, reached by actual
choices and playback at both widths; the other 122 checks are renderer fixtures,
not complete user journeys. Predict retains its three read reviews and court cue. The existing journey and release suites
remain required. These checks do not constitute external coaching validation.

## Promotional media

The two Ferrero singles films, the doubles partner film and the Barty film are
being refreshed outside the app deployment with the stronger editorial context.
Compatible approved Lara recordings and the approved brand cadence are reused.
The share pack includes captions, source credits and smaller MP4s. Professional stories are
editorial references; there is no professional footage, voice cloning or endorsement.

This branch prepares a review candidate. It does not promote production.

## Editorial pass: stories that stick

Eoin clarified the editorial bar on 8 November: choose the quote, example or
reported anecdote a strong tennis editor would use to make the decision stick.
Journalism, interviews and podcasts are welcome; this is not a research journal.
A professional name must help explain the actual lesson, not decorate it.

All 53 sourced cards and all three Reset stories were revisited in 19 batches
of at most three items, with a fresh build and mobile/desktop rendering check
before moving to the next batch. The ten explicit fallbacks remain unchanged.
The word count of each lesson card remains below 110 words for story plus action.

Highlights of the new selection:

- Roddick describing the preparation tell Federer exploited on his return;
  Serena attacking a soft second serve while facing match point in 2022.
- Rafter explaining Chang's difficult low first pass; Murray's 2015 Davis Cup
  winning lob; Tommy Paul staying alive after a net-cord volley in 2025.
- Federer on the unfamiliarity of Nadal's left-handed game; Mayotte explaining
  the split step and movement as part of the shot, replacing research abstracts.
- Keys' shoelaces description of Barty's slice, Ferrero's specific contrast
  between a dazzling Alcaraz win and the errors the same aggression can bring.
- Six distinct doubles applications from the Bryans, Wayne Bryan and Cayer:
  signals, holding the line, the fake poach, middle coverage and two lob decisions.
- Mattek-Sands on Murray's visible disappointment; Abramowicz's personal story
  about repeating Shiffrin's low-expectations/high-standards idea to Świątek.

Good existing connections are retained and edited rather than replaced for
novelty: de Minaur through the middle, Medvedev returning deep from deep,
Djokovic disrupting Ruud's pattern, Janković's reported on-court coaching,
Sampras building the next shot, and Nadal changing the space against Medvedev.
Public summaries remain identified in source credits where relevant. The cards
separate the reported moment from GameSharp's own practical application.

The `pro-insight-build.json` candidate hashes track this unmerged PR revision.
Its baseline hashes and protected lesson/scene fingerprints remain frozen.
No additional lesson, scene, choice, voice recording, progress or sharing change
is introduced by this editorial pass. Broader PR 81 still includes its earlier
Predict payoff and split-step wording corrections.

## Sampras chronology correction — 9 November 2026

The Predict wide-serve card now places the diving volley in the second set of
the 1999 Wimbledon final. The first-set 0–40 escape was a separate game.
The wide serve, first volley and passing reply remain supported by the
[ATP account](https://www.atptour.com/en/news/sampras-1999-wimbledon-atp-heritage-feature);
the [contemporary AP report](https://www.cbsnews.com/news/sampras-wins-sixth-wimbledon/)
corroborates the second-set timing. The lesson still asks players to read the
reply after serving. No scene, choice, cue, narration or eligibility changes.

Eoin authorised correcting this known error, rerunning release checks and
deploying the reviewed editorial update on 9 November. The six later proposed
replacement cards remain editorial candidates and are excluded from this release.
