# Codex handoff: editorial takeaways v3

**Status:** design only. Eoin has NOT approved wiring this into the app. Do not
change `app/`, `app_src/` or `rally/` for this until he says so.

**Look at it:** open `design/editorial-takeaways/v3-gallery.html` in a browser
(self-contained; 390px wide shows it as on a phone). All 32 Daily lessons.

**What it is:** one picture per lesson in two states, replacing only the drawing
inside each existing takeaway panel. Titles, rules and panel labels stay exactly
as authored in `app_src/takeaways.json`. Rule for every pair: the two panels are
the same picture with ONE thing changed, and that change is the lesson's condition.

**Files**
- `v3/<slug>.json` — the two panel SVGs per lesson (`panels[0]`, `panels[1]`),
  plus the takeaway `source` hash so stale art is detectable after a rule edit.
- `v1/`, `v2/` — earlier passes, kept for comparison only.
- `tools/editorial_art.py`, `tools/art_v3.py` — the drawing code;
  `python3 tools/editorial_review.py . v3 /tmp/v3.html` regenerates the review.
- `docs/features/editorial-takeaways-brief.md` — per-lesson decisions.

**Known weak spots:** the-lefty, find-your-return-spot, earned-defence (need the
words); the-moonballer, earned-net (change two things, breaking the rule).

**Useful review from Codex:** (1) any picture that implies coaching beyond its
authored rule; (2) whether each reads at 390px without its caption; (3) how you'd
integrate alongside your PR87 takeaway motion when Eoin approves — proposal only.
