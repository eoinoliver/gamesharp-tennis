# GameSharp Tennis — Fault Mirror Coach-Review Sheet

**Purpose:** Hand this to a credentialed coach. It lists every flagged claim in the 52-fault
library so a coach can sign off (or correct) efficiently, rather than reading the whole app.

**Status:** Forensic audit by Claude, cross-checked against published coaching/biomechanics
sources (NOT a credentialed coach). Corrections below have been **IMPLEMENTED** (2026-06,
cache v113). This sharpens and de-risks the content; it does **not** replace a coach sign-off.
Until a coach signs off, keep "source of truth" / authoritative claims **off** this content.

**Sources consulted:**
- Overhead/serve "no wrist snap" (downward orientation = shoulder internal rotation + pronation):
  Feel Tennis (serve-wrist-snap), My Tennis Expert (overhead).
- Pronation as a *natural result* of a loose arm, not a conscious cue (Dr. Groppel):
  Feel Tennis (serve-pronation-clarified), Essential Tennis (myth-busted-serve-pronation-2.0).
- Forehand: error is *falling back / weight retreating*, not the back foot; open stance is
  legitimate (forward-to-forward, not back-to-forward): Feel Tennis (unit-turn),
  TennisOne (hitting off the back foot).

---

## ✅ IMPLEMENTED (cache v113)

| # | Fault | What changed |
|---|-------|--------------|
| R1 | Overhead lean-back (`DTC_EXTRA_FAULTS.overhead[1]`) | "snap slightly down and through" → **"contact up and in front — exactly like your serve; the high contact angles it down on its own, no downward wrist snap."** Cue retitled to match. |
| A1 | Serve low-contact long (`DTC_EXTRA_FAULTS.serve[1]`) | Reworded to name the mechanism (full-stretch downward angle vs. low/flat face pointing out → carries long) so it no longer appears to contradict the base serve fault (low/cramped → net). |
| A2 | Forehand falling-back (`DTC_EXTRA_FAULTS.forehand[2]` + `FAULT_SPEC.backFoot`) | "off the back foot" → **"weight drifts backward / you fall away; open stance is fine — finish weight up and into the court."** Motion label `'off the back foot'` → `'weight falling back'`. Cue retitled. |
| A3 | Serve pronation (`DTC_EXTRA_FAULTS.serve[0]`) | Reframed pronation as a **natural result of a loose arm**, not a conscious action; explicitly warns against consciously rolling the forearm or forcing a wrist snap. |
| A4 | Second-serve cluster (`NEW_CATS.secondServe`) | **No change — retained by design.** On review the four form a defensible 2×2 (decel / flat-no-spin × gets-attacked / double-faults); the consequences genuinely differ for the player. Noted for the coach to confirm, not an error. |

Verified after edit: all `<script>` blocks parse (0 syntax errors); no remaining "snap down"
or mis-framed "off the back foot" in the 52 (the one surviving "off your back foot" is the
back-pedal/jam fault, where being jammed onto the heels is the correct diagnosis).

---

### Original pre-audit detail (retained for the coach)

**Scale:** 52 faults total.
- 8 base faults — `DTC_THEMES[i].questions[3]` (one per stroke theme)
- 24 stroke variations — `DTC_EXTRA_FAULTS` (forehand/serve/oneHand/twoHand/ret/volley/overhead/slice × 3)
- 20 new-category faults — `NEW_CATS` (secondServe/approach/defensive/lowBall/spacing × 4)

**Triage legend:**
- 🔴 **RED** — likely wrong or potentially harmful; fix before relying on it.
- 🟠 **AMBER** — contested, oversimplified, or coach-dependent; confirm the framing.
- 🟢 **GREEN** — mainstream-correct as written (bulk of the library; not listed individually).

---

## 🔴 RED — fix candidates (coach to confirm)

### R1. Overhead: "snap slightly down and through"
- **Where:** `DTC_EXTRA_FAULTS.overhead[1]` (`sym:'flies long', fault:'leaning back', fix:'stay over it'`).
- **Text:** *"Stay over it, contact it in front, and snap slightly down and through."*
- **Concern:** "Snap **down**" contradicts modern teaching (and contradicts this app's own
  serve fault below, which says serve power comes from the legs + **forearm pronation up**,
  *"never a forced wrist flick"*). The overhead is mechanically a serve: hit **up** at
  extension with pronation; the ball goes down from spin + the downward *angle of a high
  contact*, not from an active downward wrist snap. Cueing "snap down" risks decelerated/
  netted smashes and shoulder strain in amateurs.
- **Suggested fix (coach to approve):** *"Stay over it, contact it up and in front, and let
  the forearm pronate through — same as your serve. The height sends it down, not a wrist snap."*
- **Coach question:** Is "snap down/through" acceptable shorthand, or should the overhead cue
  mirror the serve (hit up + pronate)?

---

## 🟠 AMBER — confirm the framing

### A1. Serve: low-contact outcome is described two opposite ways
- **Where A:** `DTC_THEMES[1].questions[3]` (base serve) — toss drops lower / contact cramped →
  *"serve gets cramped and **dives into the net**."*
- **Where B:** `DTC_EXTRA_FAULTS.serve[1]` (`fault:'low contact', badOut:'long'`) — contact too
  low in front of the face → *"the serve **sails long**."*
- **Concern:** Same root cause (contact too low) is given **opposite** ball outcomes (net vs.
  long) without the distinguishing variable. Both are individually defensible (low + cramped
  → net; low + flat with an upward aim → long), but side by side they read as a contradiction
  a sharp user or coach will catch.
- **Suggested fix:** Add the distinguishing cue to each (e.g. "low **and decelerating** → net"
  vs. "low **and flat, aiming up** → long"), or differentiate the two faults more clearly.
- **Coach question:** What's the cleaner single explanation of how contact height drives net
  vs. long on the serve?

### A2. Forehand: "off the back foot" conflated with "weight going backward"
- **Where:** `DTC_EXTRA_FAULTS.forehand[2]` (`fault:'off the back foot', fix:'weight forward'`).
- **Text:** *"You hit off the back foot, weight going backward… Step in and land on your front
  foot at contact."*
- **Concern:** The real fault is **falling away / weight going backward**, not the back foot
  itself. Modern players hit huge forehands off the **back/outside foot** (open stance) with
  weight still driving up and forward. Equating "back foot" with "error" is imprecise and could
  confuse a player with a sound open stance.
- **Suggested fix:** Keep the diagnosis as *falling backward / weight retreating*; drop the
  implication that the back foot is the fault. Front-foot "step in" is one fix, not the only one.
- **Coach question:** Re-word to target weight transfer rather than which foot?

### A3. Serve: cueing conscious "forearm pronation" to amateurs
- **Where:** `DTC_EXTRA_FAULTS.serve[0]` (`fault:'no leg drive', fix:'explode up'`).
- **Text:** *"let the forearm roll the racket over at the top (forearm pronation)… (Don't force
  a wrist 'snap' — that just hurts it.)"*
- **Assessment:** The "no forced wrist snap" guidance is **correct and good**. The open
  question is whether to tell amateurs to **consciously** roll the forearm — many coaches hold
  that pronation should be a *natural result* of a loose arm and leg drive, and that cueing it
  actively causes mis-timing.
- **Coach question:** Cue pronation actively, or cue "loose arm + drive up and let it happen"?

### A4. Second-serve cluster is near-duplicative
- **Where:** `NEW_CATS.secondServe[0..3]` — `ssSitUp` (decel), `ssFlat` (flat/no spin),
  `ssDecel` (decel), `ssLow` (flat/no spin).
- **Assessment:** Not a technique **error** — all four are mainstream-correct (add spin,
  accelerate up, fatter target). But two pairs are effectively the same fault (decel ×2,
  flat/no-spin ×2). This is a **content-quality** flag, not a safety flag: a user cycling the
  daily may feel they're seeing the same fault twice.
- **Coach/product question:** Collapse to 2 distinct second-serve faults, or differentiate the
  duplicates (e.g. one purely *grip/spin-type*, one purely *nerve/decel*)?

---

## 🟢 GREEN — reviewed, mainstream-correct as written (spot-check only)

These read as sound modern teaching; coach can spot-check rather than line-edit:

- **Forehand:** decel-into-net (finish high); arm-only/no kinetic chain (drive from ground).
- **One-hander:** late/level contact (meet it further in front); no leg drive (drive up);
  off-arm collapse (throw the rudder back) — all canonical one-hander cues.
- **Two-hander:** bottom-hand steer / wake the top (non-dominant) hand; block-no-rotation;
  lean-back lift — consistent and correct across base + variations.
- **Return:** big backswing late vs. compact block, split-step on the strike not the toss.
- **Volley:** backswing vs. catch-and-punch from the legs; racket up/ready; firm (not stiff)
  wrist under pace.
- **Slice:** flicky wrist vs. shoulder carve; no follow-through; open-face/stand-up pop-up;
  carve down **and** forward.
- **Low ball:** bend knees not reach; brush up the back (square face) vs. open-face scoop;
  drive through vs. block; head-up/framing.
- **Approach (tactical):** low + deep, slice helps; depth pins; split-step at their contact;
  middle approach off a low/wide ball.
- **Defensive reset (tactical):** high/deep/heavy to the middle; no winners or drops from the
  stretch; lift with margin from deep.
- **Spacing/Jam (movement):** adjustment steps; explosive first step; plant the outside foot;
  don't back-pedal flat-footed.

---

## Coach sign-off checklist

1. [ ] R1 overhead "snap down" — approve fix or keep?
2. [ ] A1 serve low-contact net-vs-long — reconcile the two faults.
3. [ ] A2 forehand "back foot" wording — retarget to weight transfer?
4. [ ] A3 serve pronation — active cue vs. let-it-happen?
5. [ ] A4 second-serve duplicates — collapse or differentiate?
6. [ ] Spot-check the GREEN list above; flag anything to demote.
7. [ ] Confirm the per-fault **animations** (the motion freeze + ball flight) depict each
       fault accurately — this sheet reviews the **text**; the animation is a separate pass.

Once 1–6 are signed off, the text library can carry an authoritative framing. Item 7
(animation accuracy) should be a second, separate coach pass.
