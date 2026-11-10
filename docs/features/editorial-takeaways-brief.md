# Editorial takeaways — one metaphor per Daily lesson

Claude owns `claude/editorial-takeaways-2026-11-10`. Eoin asked for lesson summaries
illustrated like an Economist editorial illustration (Brett Ryder-style), not
geometry. Each card keeps its authored condition/action labels, title and rule
from `app_src/takeaways.json`; only the drawing in each panel changes.

**Grammar:** one metaphor, two states. Both panels show the same object, changed by
the condition. The drawing must read without its caption. YOU = mint, THEM = cream,
the decision = gold. No new coaching claims: the metaphor must say exactly what
the authored rule says, and no more.

**Gate per lesson:** (1) reads without words, (2) matches the rule, including its
exception, (3) no metaphor repeated in the set. Fail any → redraw or keep Codex's schematic.

Status: ✅ drawn (batch 1) · ✏️ concept only · ⚠️ concept at risk

| # | Lesson | Metaphor | Left state → Right state | Status |
|---|---|---|---|---|
| 1 | serve-plus-one | Door the return opens | Short return: door swings open → deep return: door shut, knock again | ✏️ |
| 2 | short-ball | The net changes size | Low contact: net is a wall → high contact: net is a kerb | ✅ |
| 3 | the-line | Bridge vs tightrope | Low + late: stumbling, take the bridge → balanced: walk the rope | ✅ |
| 4 | the-winner | Darts | One lucky bull, nine ghost misses → tight cluster you'd repeat | ✅ |
| 5 | recovery | Their spotlight | Pulled wide: skewed beam, shade across → balanced: centred beam, deeper | ✅ |
| 6 | open-court | One-way street | Running: hit against the arrow (behind) → stopped: no sign, use the space | ✏️ |
| 7 | forehand-bill | The bill | Deep + ready: receipt off the page, voided → stranded: small bill, paid | ✅ |
| 8 | the-lead | Plimsoll line on a hull | 2–2 ball lands on the mark → 5–2 same mark (ghost shorter landing crossed) | ✏️ |
| 9 | split-step | Skipping rope | Landing before the rope arrives → landing as their swing passes | ✏️ |
| 10 | approach-volley | Ramp / step | Deep approach: the volley arrives chest-high → short: at your shoelaces | ⚠️ risks a new claim; check rule wording |
| 11 | middle-return | Folding fan of their angles | Deep middle: fan shut → short middle: server steps in, fan opens | ✅ |
| 12 | high-ball | Lift to the right floor | Time: step in, take it on the way up → rushed: step back to the floor | ✏️ |
| 13 | second-serve | Their strike zone | Ball in their comfort box → kicked above the box | ✏️ |
| 14 | contact-clue | Elbow room | Cramped middle seat → clear seat, look at the target | ✏️ |
| 15 | running-around | Hourglass | Sand to spare: run around → empty glass: backhand | ✅ |
| 16 | net-rusher | Castle gate vs battlements | At the gate (service line): to the feet → on the walls: lob over | ✏️ |
| 17 | pass-where-they-arent | Goalkeeper | Keeper covers one post → shoot the other | ✏️ |
| 18 | late-is-the-culprit | Magnifying glass on contact | Contact behind the hip (the clue) → contact in front | ✏️ |
| 19 | the-moonballer | Escalator | Step on early, take it rising → deep lob: let it come down | ✏️ |
| 20 | the-pusher | The piece that never moves | Deep defender: pull it forward (drop) → on baseline: march on it (approach) | ✏️ |
| 21 | pulled-wide | Parachute | Low, late, wide: open the chute (height + depth) → early: no chute needed | ⚠️ overlaps 31 |
| 22 | serve-away-from-the-lean | Seesaw / leaning door | Leaning one way leaves the other side open | ⚠️ overlaps 27 |
| 23 | the-big-hitter | Their hitting box | Fed into the box → under it (slice) or over it (height) | ✏️ |
| 24 | the-lefty | Mirror | Your usual pattern hits the mirror image | ✏️ |
| 25 | find-your-return-spot | Dial / slider | Big first serve: back → kick: in | ✏️ |
| 26 | answer-the-drop | Periscope / head up | Arrive head down → arrive and look up | ✏️ |
| 27 | attack-the-backhand | Guard on the door | Guard on BH: go the other door → guard moved: BH door open | ✅ |
| 28 | down-the-line | Traffic light on the line | Red when they cover early → green while they recover | ✏️ |
| 29 | rushed-out-wide | Target size | From wide: the big board (deep middle), not the tiny bull | ⚠️ overlaps 4 |
| 30 | earned-attack | Open goal, you on the floor | Still chasing: margin → ready: attack | ✏️ |
| 31 | earned-defence | Parking meter | Still travelling: feed it height + depth → arrived early: other choices | ✏️ |
| 32 | earned-net | Summit flag | Reached it ≠ planted the flag; controlled + deep opponent: plant | ✏️ |

## Integration plan (not yet built)

- `tools/editorial_art.py` writes `app_src/takeaway-art/<slug>.json` with two panel
  SVGs and the takeaway's `source` hash, so stale art is detectable after a rule edit.
- Next: `build.py` reads the art when present; `takeaways.js` renders it in place of
  the schematic for that panel; lessons without art keep the schematic. Codex's
  per-panel motion stays on schematic panels; editorial panels get one restrained
  reveal under the same reduced-motion rules.
- Build parity fingerprints change by design; that needs an explicitly reviewed
  test update per RELEASE_PROTOCOL. No release without Eoin's “ship it”.
