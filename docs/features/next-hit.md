# One next-hit focus and purposeful Sharpen paths

Approved implementation scope: Eoin's 4 November “proceed” on the legacy reuse
review. No legacy runtime or content imported. All 57 existing activities and
all scenes, sound, clips, grading and authored teaching remain unchanged.

## Player journey

My Game can select one saved cue as the active next-hit focus. The browser-local
record retains the chosen lesson, edition, cue and drill. A small Home reminder
links back; Not yet hides that reminder without removing the intention. Opening
or returning to the app never claims a court session. The player must choose
“I’ve played since choosing this” before opportunity, attempted use and usefulness
questions. Not arising, not trying and uncertainty are valid neutral responses.
A completed reflection is explicitly the player's own report, not a score or
proof of improvement. Keep starts a fresh intention; switch/finish preserve saved
cues. Recent completed/replaced focus records remain browser-local (maximum 30).

Writes are read back before acknowledgement. Each action rereads the stored
record and checks its identity; stale tabs cannot act on a replacement focus.
Corrupt or unreadable data is not overwritten. Failure leaves the current view
and requests reload/check rather than asserting a save. Changed/missing lesson
guidance is flagged; the original selection is not silently rewritten. Current
cue adoption is an explicit choice. No court reflection alters quiz progress,
streak, first-attempt records or transfer evidence. The two optional analytics
events carry a lesson/edition and categorical self-report, with the existing
production-host boundary and no free-text field.

Three existing symptom groups gain authored purpose labels and a continuation:
- Forehand direction: the-line → live-point-line-tempting → live-point-line-opens.
- Serve: serve-plus-one → live-point-serve-see → live-point-return-deep.
- Net: approach-volley → live-point-volley-build → live-point-volley-opening.

The extra earned-net activity remains reachable. Steps are optional. Before the
later-day opportunity, the variation is folded under an explicit “practice”
action; it remains available. It never counts as a fresh delayed read after an
early exposure. Close and completion return links preserve the originating
symptom or My Game, including after a reload. Unknown or unrelated path query
parameters do not supply arbitrary navigation destinations.

## Verification

Isolated state tests cover persistence, neutral responses, explicit sessions,
failed writes, stale tabs, corrupt data, changed/missing guidance, and later-day
eligibility. The focused browser suite exercises 320/390/1440 widths, the full
focus cycle, failure feedback, and all nine path destinations. Existing release
suites remain required. Exact build overlays preserve earlier fingerprints.
No independent coaching validation, physical-device test or learning outcome is
claimed. This feature introduces no new advice, animation or activity eligibility.
