# Mobile sharing and personal practice

Review-only follow-up to PR 85. All 63 activities, existing coaching, engine,
audio, silent Home motion and the three primary Home routes are preserved.

## Sharing

Every activity has an in-play Share control and a completion action outside
collapsed panels. Native share titles/messages identify GameSharp Tennis and the
activity type; teaching titles are omitted from outgoing invitations when they
could reveal the answer. The copy-link dialog uses the green/gold wordmark and
actual court card. Native share-sheet colours remain OS-controlled. Social
metadata titles include the brand. Native share cancellation and clipboard
failure are explicit.
The existing six editable doubles plans remain proposed plans, not evidence of
partner agreement. No messages are sent by the app without the user's share tap.

Stable `/s/<slug>.html` invitations contain server-rendered Open Graph/Twitter
metadata and an actual scene image, then immediately open the exact lesson.
The opening question supplies the invitation; no answers, scores or sender ID
are carried. The existing `play.html?l=...` routes remain valid. There is no
account gate. JavaScript-disabled visitors receive an exact link and explanation.
Images are code-rendered from each unchanged lesson's first decision; scene/frame
provenance is in `share-preview-frames.json`. They are not stock court images.
Social apps decide how/when to display and cache cards; browser tests cannot
prove physical WhatsApp, iMessage, Instagram or X presentation.

## Personal practice

My Game reads existing stored completions automatically. First/last dates and
completion counts are factual browser records. Earlier content editions remain
separately visible. Saved cues stay intentional. A completed activity can supply
a cue for the existing next-hit focus and short on-court reflection.

A later-day result is shown only for the original unexposed, completed later-day
attempt, retaining its actual score after retries. Trying a cue on court is
labelled as the player's own report. No mastery score or tennis improvement
claim is inferred. An authored next variation is offered after the original's
local calendar date; otherwise an explicitly related point may be suggested.
The communal Daily remains calendar-based and independent of this personal queue.
The old promise that the variation appears on Home is corrected to My Game.

An optional 2/3/5/7-day weekly goal counts unique days with completed activity,
including wrong answers. Monday starts the local week. No goal is the default;
missing a day leaves history intact. Foreground/date and cross-tab progress
updates refresh the personal view. Existing consecutive-day counts are retained.

The optional calendar reminder exports an RFC 5545 event with selected local
weekdays, floating local time and an alarm. The player must import it. GameSharp
neither requests push permission nor claims notifications have been enabled.

Progress, cues, focus and goals remain browser-local. This change does not add
accounts, cloud sync, reminders sent by GameSharp or partner-response tracking.
The UI explains that clearing browser data removes the history.

## Verification

New unit checks cover weekly boundaries, wrong answers, existing data, retries,
first delayed evidence, self-report, old editions, storage failures and calendar
validation. The new browser suite checks all 63 social metadata pages, direct
recipient routes and in-play sharing; completes seven distinct journey formats;
then exercises history, goal persistence, a court reflection and a calendar
file. Existing completion/share expectations are updated only for the new URL.
The feature is a scoped overlay after the frozen Home clarity fingerprints.
