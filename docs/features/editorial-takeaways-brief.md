# Editorial takeaways — one metaphor per Daily lesson

Claude owns `claude/editorial-takeaways-2026-11-10`. Eoin asked for the 32 Daily
lesson summaries illustrated like an Economist editorial illustration (Brett
Ryder register), then for two further passes: a "young Ryder" pass to make them
cleverer, and an "old Ryder" pass to make them simpler and more impactful.

**Not wired into the app.** Eoin: "don't wire it into the app until I say so."
Art lives in `design/editorial-takeaways/{v1,v2,v3}/<slug>.json`, which the app
build does not read. Live app, lessons, audio and Codex's takeaway motion are unchanged.

Each card keeps its authored condition/action labels, title and rule from
`app_src/takeaways.json`; only the drawing inside each panel would change.
Regenerate and review with:

    python3 tools/editorial_review.py . v3 /tmp/v3.html   # then open at 390px width

## The three passes

- **v1 — first pass.** A metaphor for each lesson, often with a court and figures
  explaining it. Literal in places (return-spot slider, approach-volley court).
- **v2 — young Ryder.** Swap literal scenes for visual puns: a slot machine against a
  piggy bank, a needle's eye, a castle, a cannon, a guard dog, an armchair, a phone
  box, chess, a hot-air balloon, a lighthouse, a train, a starting pistol, crime-scene
  tape. 18 lessons changed; the rest were already the wit and carry over.
  Cleverer, but busier: several panels change two or three things at once.
- **v3 — old Ryder.** One rule: *the two panels are the same picture with one thing
  changed, and that change is the lesson's condition.* Strip courts, figures and
  props that aren't the point. 13 lessons redrawn; 19 already met the rule (from v1 or v2).

## v3 decisions

| Lesson | v3 picture (the one change) | From |
|---|---|---|
| serve-plus-one | Door: open / shut | v1 stripped (cards read as gambling, not "rebuild") |
| short-ball | Net: wall-height / kerb-height | v1 stripped of figures |
| the-line | Thread through a hoop / through a needle | v2 sharpened |
| the-winner | One dart in the bull with ghost misses / ten in the board | v1 (slot vs piggy bank was two objects) |
| recovery | Their spotlight; your dot in its middle | v1 stripped |
| open-court | Footprints still running / stopped | new |
| forehand-bill | Receipt: long / short | v1 stripped |
| the-lead | Same depth mark; flat / lifted arc | v1 |
| split-step | Their swing as a starting gun; shoes in the air / planted and pushing | v2 stripped |
| approach-volley | Break shot: their ball to the cushion / mid-table | v2 |
| middle-return | Their angles as a fan: shut / open | v1 |
| high-ball | Same bounce, same shelf; step in / step back | v2 stripped |
| second-serve | Their armchair: kicked over / armchair high, go elsewhere | v2 |
| contact-clue | Phone box: cramped / roomy | v2 |
| running-around | Hourglass: full / empty | v1 stripped |
| net-rusher | Castle: at the gate (feet) / on the wall (over) | v2 |
| pass-where-they-arent | Keeper: shoot the post they leave | v1 |
| late-is-the-culprit | Same body, same target ring; ball beside the hip / in front | new |
| the-moonballer | Balloon: take it rising / walk up to it | v2 |
| the-pusher | Pawn: drawn forward / you advance on it | v2 |
| pulled-wide | Same high arc: ball just struck / ball at apex while you run back | new |
| serve-away-from-the-lean | Curtain over one window; serve the other | v2 |
| the-big-hitter | Cannon: under it / over it | v2 |
| the-lefty | Mirror | v1 (weakest in set; candidate for rethink) |
| find-your-return-spot | Dial back / in | v1 (literal; candidate for rethink) |
| answer-the-drop | Planted shoe, then an open eye | new |
| attack-the-backhand | Guard dog on the backhand door / chasing the other way | v2 |
| down-the-line | Traffic light green / red | v1 |
| rushed-out-wide | Big target from both wings | v1 |
| earned-attack | Open goal: on your feet / still sliding | v1 |
| earned-defence | Meter: feed it time / time already on it | v1 (ambiguous; candidate) |
| earned-net | Flag planted at the summit / left at the bottom | v1 |

## Known weak spots (v3)

the-lefty, find-your-return-spot and earned-defence still need words to land.
the-moonballer and earned-net change two things between panels, breaking the rule.
None makes a coaching claim beyond its authored rule.

## Integration plan (on hold until Eoin says so)

`build.py` would read the chosen set when present and `takeaways.js` would render
it in place of the schematic; lessons without art keep the schematic. Build parity
fingerprints change by design and need a reviewed test update per RELEASE_PROTOCOL.
No release without Eoin's "ship it".
