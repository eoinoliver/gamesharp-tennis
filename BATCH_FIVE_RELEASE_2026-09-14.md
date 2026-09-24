# Batch five — 14 September 2026

## Status

Deployed and publicly verified: eighteen approved lessons from the original 24
briefs; six remain unbuilt. The narrow post-gate branch corrections are included
in the final production release below.
Eighteen lessons are authored from the original 24 briefs; six remain unbuilt.

## Three additions and the reason for selecting them

1. **The Lead That Makes You Smaller** (`protect-pattern`): keep useful depth,
   change direction when the opponent anticipates it, then use height and depth
   when a genuinely deeper incoming ball removes the comfortable attack.
2. **Your Forehand Leaves a Bill** (`forehand-bill`): compare the same contact's
   forehand/backhand body positions and recovery cost; earn the runaround against
   a displaced opponent from inside; reject the extra movement on a wider, deep ball.
3. **Closing Hard Can Open the Pass** (`close-then-balance`): prepare for opponent
   contact rather than pursuing one more stride; close again after reading a float;
   accept a deeper split position when the opponent's contact arrives earlier.

The risk is overlap with Runaround, Split Step and Approach. The new emphasis is
the explicit cost/reward comparison and reversal, not another generic instruction
to use the forehand, split step or add margin. Whether players experience these
as sufficiently distinct remains a learning judgment, not a test result.

## Sources and boundaries

- [ATP's Federer–Nadal Wimbledon 2019 report](https://www.atptour.com/en/news/federer-nadal-semifinal-wimbledon-2019-friday)
  supports the five match points and Federer's commitment to an attacking plan.
  Our target shapes and rally situations are original applications, not a match
  reconstruction or an inference about a player's internal feelings.
- [Jim McLennan's Court Positioning](https://tennisone.tennisplayer.net/club/lessons/jm/positioning/court.php)
  explicitly discusses Courier's forehand and awkward positioning. Indexed article
  text was inspected; direct opening failed and old Flash footage was not reviewed.
  Our metre distances are schematic examples, not measurements of Courier.
- [Navratilova's serve-and-volley instruction](https://www.tennis.com/news/articles/navratilova-gives-keys-to-serving-and-volleying)
  lists controlled forward movement and split step. Our contact/landing offsets
  are illustrative timing comparisons, not Navratilova's prescribed milliseconds.

No quotations, affiliation, endorsement or independent coach approval is claimed.
The full nine decisions and 36 choices are canonically authored in
`gold-daily-tradeoffs.js`; the professional facts, interpretation and court cues
are bound by stable IDs in `gold-daily-lesson-spines.js`.

## Implementation and review corrections

- One metre-based court, shared projection/actor/arc helpers and one event clock.
  The old construction models are unchanged; only their existing drawing helpers
  were exported for reuse. The prior fifteen lesson definitions compare exactly
  with the pre-edit snapshot.
- Real target depth, receiver position, forehand/backhand body offset and recovery
  distance change by choice. Dashed lanes show possibilities, not hit replies.
- Net alternatives change the actual close/landing/response clocks. A small timing
  strip retains the contact-versus-landing comparison in reduced motion; faint
  starting actors retain the positions that explain the movement.
- Incoming depth is animated before transfer. The Mental transfer stops before
  the outgoing shot so it cannot demonstrate the correct answer before selection.
  The net float read retains the first split position rather than pre-playing the
  correct forward move. Cue wording no longer uniquely echoes the correct answer.
- Initial net-clearance defects were corrected. Ball/audio events are aligned;
  possible replies and held incoming samples do not emit fictional racket impacts.
- Wrong choices retain their own construction before comparison. Feedback waits
  until that comparison settles; reduced motion presents both completed alternatives.

## Integration boundary

All three are intended for free selection as soon as released. Published nine,
twelve and fifteen-day calendars remain intact through 17 October. The new
eighteen-day rotation begins 18 October; new lessons first appear on 18, 20 and
22 October. Checkpoint and credit storage keys remain unchanged.

No extra Predict destination is invented. All three reach their exact existing
Sharpen area and return; four earlier Daily/Predict connections remain. Nine
eligible Predict journeys, eleven withheld Predict IDs and eight Playbook patterns
retain their prior status. Broad Sharpen renovation is outside this batch.

## Final local evidence

- 82 automated tests pass, including five new model/branch/timing tests and the
  expanded calendar/manifest assertions. Trust audit passes with the unchanged
  warning: 366/549 legacy questions have answer-length tells.
- Initial 430px run: all 36 alternatives and three final payoffs completed.
  Screenshots: system temporary directory `gs-construction-YRIr0q`.
- Corrected 320/430/1280 review: `gs-construction-DQpaJP`, passed. All 36 choices
  at 430; normal wrong-answer journeys at 320; desktop at 1280; card and Focus.
- Mental/Net normal-motion rerun: `gs-construction-80sx3v`, passed.
- Final position and float-framing corrections: `gs-tradeoffs-final-Ygi926`, passed.
  Mid-flight captures, normal comparisons and 844×390 two-panel Focus inspected.
  Model tests now sample all alternatives for ball-path clipping as well as net
  clearance. The example's high float had initially left the frame; now corrected.
- Nine dated Home → three decisions → credit → exact Sharpen → return paths at
  320, 430 and 1280: `gs-batch-three-wWUhHM`, all passed.
- All 18 chooser destinations and practice completion with saved Daily preserved:
  `gs-picker-YGWS0a`, passed at all three widths.
- Refresh, immutable first answers, stale tab, midnight, unavailable storage and
  desktop Focus: `gs-daily-edges-F2sBa6`, passed.
- Eight missing required assets withhold. Optional audio failure does not prevent
  completion. No captured browser runtime errors. Sound event wiring is checked;
  this is not a claim of listening quality on a physical iPhone.

Physical iPhone listening, independent coach review, target-player comprehension,
retention and server monitoring are not established by this release.

## Deployment ledger

Initial production deployment `dpl_BDf4W9ZYjAU1tGBbL1gBVT4hzmKj` was READY
(565ms static build). All ten runtime/homepage/manifest files matched locally;
all three new public dated paths and the 18-lesson chooser passed at 430px
(`gs-batch-three-yHBwoZ`, `gs-picker-fjdspd`).

Before final closeout, an option-by-option source review found that added pace
still shared the unchanged flight clock and early lane commitment moved only
after contact. Those were real branch-fidelity defects, not test failures.
They are now corrected and guarded by explicit timing/position assertions.
All four affected branches passed normal-motion and landscape comparison checks
in `gs-tradeoffs-final-topqgf`. Small-screen element measurements also confirmed
the heading and progress remain within the viewport. The corrected artifact is
deployed. The original fifteen lesson definitions remain unchanged.

## Final deploy result

- URL: https://www.gamesharptennis.com/
- Target: production
- Status: READY, publicly verified
- Deployment: `dpl_3bnqpG9GFYTMJmBqPHDkpYzqPb4S`
- Deployment URL: https://gamesharp-tennis-g0ijr9ayz-eoinlynn-5978s-projects.vercel.app
- Commit: none; canonical folder is not a Git repository
- Framework: static site
- Build duration: 387ms
- Engine: `2026-09-14.gold-daily.30`; loader: `20260914-gold-daily-60`
- Loop: `2026-09-14.daily-loop.4`; spines: `2026-09-14.lesson-spines.14`

All ten homepage/runtime/manifest files byte-match the verified canonical files.
Homepage cache policy: `public, max-age=0, must-revalidate`. All three corrected
public dated lesson paths completed at 430px, including single credit and exact
Sharpen return (`gs-batch-three-vPZdEv`). Public Home chooser, all 18 destinations,
full practice and preserved partial Daily passed (`gs-picker-tzBWJm`). No captured
runtime browser errors. Existing Vercel authentication worked; no new login.

Post-deploy observability: browser error scan clean for the stated paths. Server
error logs, drains and ongoing monitoring were not audited for this static release.
Prior unaffected Predict/Live Point/Playbook evidence is retained; this batch did
not freshly re-audit all nine of those journeys or repair the legacy content bank.
