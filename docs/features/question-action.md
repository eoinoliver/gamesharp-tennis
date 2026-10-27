# Question action and restrained sound — 27 October 2026

The user liked the real recordings but reported repetitive applause, contact
sounds after action froze, and missing action in The Safe Second Serve Trap.
This release keeps all 41 lessons eligible and audits all 135 questions, including
all branch nodes. No lessons withheld; no new motion assets or coaching claims.

## Behavior

- Applause occurs once at perfect challenge completion (all first answers right),
  including Predict after its full review. Individual right answers retain visual
  feedback. Replays and better-option demonstrations cannot add applause or erase
  a miss. Starting a new attempt can earn a new completion reward.
- Racket sounds require an outgoing ball, and two outgoing frames must fit before
  the playback stop. Held incoming endpoints and out-of-range contact metadata
  cannot produce a phantom hit. Freeze/pause cancels contact tails, independently
  of completion applause. Sound activation/retry is silent. Lead-in repeats are
  silent. Opt-in, mute, iOS session routing and the four CC0 recordings remain.
- Nine previously tiny setup intervals now show an explicitly labelled example:
  two second-serve receiver responses, three return-position serves, two incoming
  big balls, and two opening return-position decisions in continuing challenges.
  Their choices start a new attempt; copy identifies that where needed. Examples
  use their own lesson's existing authored scenes, with no substitute clips.
- Nine pre-serve questions show preparation and stop before racket contact, so
  the serve target remains a decision. Twenty-two continuing questions replay
  the incoming ball for 160 frames with a replay caption, then freeze. The other
  95 questions retain their authored action intervals.
- Predict animates each stated premise before its choice, with no correctness
  feedback until all three answers and the point review. Replay repeats the
  current premise. Choice gates wait for both action and situation text.

## Audit and validation

Catalogue audit measures actual ball/player travel and exercises rendered RAF
playback, held frames, choice availability and sound calls for every question.
All 135 contain visible action and settle at a stable, silent decision frame.
All 202 scenes classified as holding an incoming endpoint omit that phantom
contact. This is a playback audit, not certification of tennis technique.

Personally inspected start/middle/freeze screenshots for all nine new examples
and both Predict lessons, all changed setup/continuation end states on phone,
and the second-serve example on desktop. The receiver's attack, incoming serve
and ball cues are present; the caption stays clear of the sound control. No new
answer/outcome labels were added before commitment. Existing scene labels remain.

27 unit tests pass, including silent sound toggles and contact-tail cancellation
that preserves completion applause. Browser tests cover a 2/3 attempt after a
better-option demonstration, a perfect attempt, replay deduplication, both Predict
lessons, actual decoded audio and offline waveform bounds. Chromium and WebKit
results and full release checks are recorded on the PR. Physical iPhone/iPad
speaker testing and human audio audition remain unverified.

A seventh explicit build overlay preserves every prior release fingerprint.
The output remains 104 release / 103 public files. No audio bytes change.

## Catalogue coverage

| Lesson | Questions/nodes | Examples | Pre-serve | Lead-in repeats | Authored interval |
| --- | ---: | ---: | ---: | ---: | ---: |
| serve-plus-one | 3 | 0 | 0 | 0 | 3 |
| short-ball | 3 | 0 | 0 | 0 | 3 |
| the-line | 3 | 0 | 0 | 0 | 3 |
| the-winner | 3 | 0 | 0 | 0 | 3 |
| recovery | 3 | 0 | 0 | 0 | 3 |
| open-court | 3 | 0 | 0 | 0 | 3 |
| forehand-bill | 3 | 0 | 0 | 0 | 3 |
| the-lead | 3 | 0 | 0 | 0 | 3 |
| split-step | 3 | 0 | 0 | 0 | 3 |
| approach-volley | 3 | 0 | 0 | 0 | 3 |
| middle-return | 3 | 0 | 0 | 0 | 3 |
| high-ball | 3 | 0 | 0 | 0 | 3 |
| second-serve | 3 | 2 | 0 | 0 | 1 |
| contact-clue | 3 | 0 | 0 | 0 | 3 |
| running-around | 3 | 0 | 0 | 0 | 3 |
| net-rusher | 3 | 0 | 0 | 0 | 3 |
| pass-where-they-arent | 3 | 0 | 0 | 0 | 3 |
| late-is-the-culprit | 3 | 0 | 0 | 0 | 3 |
| the-moonballer | 3 | 0 | 0 | 0 | 3 |
| the-pusher | 3 | 0 | 0 | 0 | 3 |
| pulled-wide | 3 | 0 | 0 | 0 | 3 |
| serve-away-from-the-lean | 3 | 0 | 3 | 0 | 0 |
| the-big-hitter | 3 | 2 | 0 | 0 | 1 |
| the-lefty | 3 | 0 | 1 | 0 | 2 |
| find-your-return-spot | 3 | 3 | 0 | 0 | 0 |
| answer-the-drop | 3 | 0 | 0 | 0 | 3 |
| attack-the-backhand | 3 | 0 | 0 | 0 | 3 |
| down-the-line | 3 | 0 | 0 | 0 | 3 |
| rushed-out-wide | 3 | 0 | 0 | 0 | 3 |
| earned-attack | 3 | 0 | 0 | 0 | 3 |
| earned-defence | 3 | 0 | 0 | 0 | 3 |
| earned-net | 3 | 0 | 0 | 0 | 3 |
| predict-the-point | 3 | 0 | 1 | 0 | 2 |
| predict-second-serve | 3 | 0 | 0 | 0 | 3 |
| saturday-point-1 | 5 | 0 | 1 | 4 | 0 |
| saturday-point-2 | 5 | 0 | 0 | 4 | 1 |
| saturday-point-3 | 5 | 0 | 1 | 4 | 0 |
| saturday-point-4 | 5 | 0 | 1 | 4 | 0 |
| saturday-point-5 | 5 | 1 | 0 | 4 | 0 |
| midweek-point-1 | 3 | 1 | 0 | 2 | 0 |
| play-the-point | 5 | 0 | 1 | 0 | 4 |

## Release basis

Standing user instructions (full autonomy, stop asking, deploy all live) authorize
this change and release. They supersede the older local exact-version approval
gate; Git PR, required checks, exact staged Production verification and promotion
remain required. Baseline: main 6f8b3e3cb5010708e84e163c16ad7f925534a316,
app 2dd4194def, rollback dpl_6JGuduEib2zQqWyXwpcz1C7fmXrQ.
Candidate version is recorded on the PR. Hosted/live evidence follows on the PR and release record.

The full gate exposed a real optional desktop Broadcast crop in Find Your Return
Spot: deep return positions could leave the frame. Its camera now pulls back to
include both players with at least 27 projection pixels of head/hip margin. The
desktop gate now uses the renderer's actual camera and resets the question-view
projection; previously a stale projection could hide the crop, and lessons whose
Broadcast is a follow camera were incorrectly checked with a fixed camera.
