# iOS sound routing repair — 26 October 2026

## Failure and evidence

Eoin reports no sound on both iPhone and iPad in Chrome after sensory release
`ff689b8dae` (PR #33). That release's automated checks did not establish physical
speaker output. The earlier audit remains evidence of cue selection, not a
successful mobile-audio repair.

WebKit [issue 237322, comment 6](https://bugs.webkit.org/show_bug.cgi?id=237322#c6)
documents Web Audio's ambient route being muted by silent mode, and explicit
`navigator.audioSession.type = "playback"` since iOS 17.
[Issue 251532](https://bugs.webkit.org/show_bug.cgi?id=251532#c6) also records
this workaround. The shipped code never requested playback. This is a verified
missing code path and a likely explanation, not proof of the user's exact cause.

## Repair

- Request playback before creating/resuming the audio context, only after an
  explicit sound opt-in (or a previously saved opt-in on a subsequent gesture).
- First visits and unavailable storage default to silence. Unrelated first-visit
  touches cannot take over device audio. Explicit enable still works in memory.
- Restore the previous session type on mute, background, navigation, cross-tab
  mute or activation failure. Do not overwrite a different session owner.
- Feature-detect and catch session API failures so unsupported browsers retain
  their normal Web Audio behavior; older iOS silent-mode bypass is not promised.
- Allow the enable confirmation after a slower successful resume; the prior
  500ms cutoff could discard it. Mute/background still cancel the confirmation.
- Keep all existing contact, net and success cues and their sparse scheduling.

Playback may interrupt other media, which is why explicit opt-in matters; see
[MDN AudioSession.type](https://developer.mozilla.org/en-US/docs/Web/API/AudioSession/type).
No microphone permission, recording session, hidden looping media or extra
background audio is introduced.

## Verification boundary

22 unit tests cover prior lifecycle behavior, default silence, playback selection
before context creation, session restoration, rejected/unsupported API paths and
other session owners. Browser tests check the complete daily/Predict/next journey
and all 38 lessons' cue schedules; offline rendering verifies generated samples.
Results and exact release identity are recorded on the PR after completion.

Physical iPhone/iPad Chrome listening remains unverified. Confirm the short
contact after enabling, then lesson contacts and success feedback; repeat after
app switching, with silent mode on/off, and verify mute. Browser state alone is
not accepted as proof that the user's speakers produced sound.
