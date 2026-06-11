# Read The Game (Predict the Point) — Continuity QA

Forensic audit of the linked-sequence content. Method: extracted all 19 sequences,
and for every step compared **correct-answer text → ball target geometry →
consequence → the next step's premise**, flagging any disagreement.

## Coordinate convention (as authored)
Top-down court, you at the bottom (high y), opponent at top (low y), net in the middle.
- x ≈ 35 → screen LEFT  → authored as the opponent's **backhand**
- x ≈ 220 → screen RIGHT → authored as the opponent's **forehand / deuce**
- x ≈ 124 → middle

## ✅ Fixed
- **seq_006 (Return Pressure) step 3** — option read "drive to their open **backhand**
  corner," but the opponent was pinned *at* their backhand corner (x35); the open court
  is x220. Changed to **"drive to the open court"** (matches the consequence + geometry).
- **seq_019 (Playing the Big Server)** — you block the return to their **backhand**, then
  step 2 had them hitting a "big **forehand** +1" with no explanation (the contradiction).
  Made the run-around explicit: *"the big server steps around it and drives a heavy
  forehand"* — coherent and realistic for a forehand-dominant server.

## ✓ Checked, NOT a bug
- **seq_011 (Tiebreak Discipline)** — "back to **your** forehand" is the *player's* wing
  (the ball returning to you), not the opponent's. Coherent. Left as-is.

## ✅ RESOLVED — handedness anchor (was the 🔴 systemic finding)
Added **"THEIR FH" / "THEIR BH" wing labels** to the court (right-handed opponent:
forehand left, backhand right — consistent with the deuce/ad geometry the app already
gets right), and **mirrored the play in the renderer** (`buildSeqCourtAnim`, `_mx = 250-x`)
so the authored "backhand→left" coordinates now *render* on the right, under the BH label.
One renderer change fixes every step — verified: all 9 wing-named correct answers now land
on the correctly-labelled side (0 mismatches). Text + ball + label now agree app-wide.

**Follow-up (small):** the ~6 `deuce`/`ad` court references in *situation* text are
mirror-sensitive and may now sit on the opposite side from the label. Lower-stakes
(scene-setting, not the taught instruction) — flagged for a quick text pass.

---
### Original systemic finding (kept for the record)

The convention labels **screen-left (x35) as the opponent's backhand**. But for a
**right-handed opponent viewed from behind you, screen-left is their FOREHAND** (they face
you, so their hands mirror). So "hit to their backhand" sends the ball to the *forehand*
side of the screen — which is almost certainly why the animation read as "forehand" to you.

It's *internally* consistent (always x35 = "backhand"), so within the app text+ball+follow-up
now agree. But it may not match real-world handedness, which risks mis-teaching.

**Recommended fix (a focused next pass):**
1. **Anchor it visually** — label the opponent's forehand/backhand wings on the court
   animation (or show their racket hand). Then "to their backhand" is unambiguous and
   self-correcting regardless of which coordinate maps to which wing. *(Preferred — cheap,
   removes all ambiguity, and makes every sequence teach correctly.)*
2. Or pick the convention (assume RH opponent → screen-left = forehand), then re-validate
   and flip wing labels across all sequences to match. *(Bigger, riskier.)*

## QA checklist (run on every sequence / new content)
- [ ] Ball path correct (target coordinate matches the named direction)
- [ ] Court positioning correct (you / opp coordinates make sense for the situation)
- [ ] Handedness correct (which screen side = which wing — per the anchor above)
- [ ] Text matches animation (the words describe what the ball visibly does)
- [ ] Explanation matches outcome (whyRight + consequence describe the same result)
- [ ] Next step logically follows the previous (the new premise = the prior consequence)

## Scope note
This pass caught the **hard contradictions** (text vs geometry, step-to-step wing breaks).
The **handedness anchor** above is the one systemic item left — it touches all 11
"backhand"-naming sequences and the court renderer, so it's a deliberate decision + one
clean validation pass, not a blind edit.
