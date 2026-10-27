# Natural completion sound

The user selected audition 3, 5 and 6 and approved restrained, varied completion
rewards. Replace the rushed 0.9-second reaction with those exact mastered
excerpts: 4.5, 4.5 and 3.8 seconds, with gentle tails. No pitch changes or new
synthetic sound. Retain one reward at a perfect completed challenge and visual
feedback on individual answers.

## Playback contract

- Cycle through the three clips, storing the last actually started reward.
  Continue across lesson navigation; no immediate repeat when storage works.
  If storage is blocked, rotation still works within the current page.
- Drop unready, muted, zero-volume and background rewards; never queue them.
- Suppress a reward while another reward is active, and retain a six-second
  cooldown. Mute, page hide and navigation stop all audio. Freezing court action
  stops only contacts, so the completion's decay survives a scene freeze.
- Six assets load only after the existing explicit sound opt-in: three existing
  contact/bounce WAVs and three small reward MP3s. Reward buffers may be up to
  six seconds; contact limits remain one second. No third-party runtime requests.
- Retain the old applause.wav for earlier cached shells, but never request it
  from the new sound engine. All four earlier recordings are unchanged.
- Outdoor alternatives were researched. Do not label the selected indoor club
  and hall recordings as outdoor tennis sound. Honor the actual selected clips.

## Voice pilot — historical initial status

Current status: three optional Frank endings are live in the beta. See
[the release record](completion-voice-release.json). The following records the
initial blocked attempt and earlier script ideas, not the current deployment.

The connected voice provider returned reauthentication required on the first
request. No audio was generated and no voice control or device TTS fallback is
shipped. Resume with one calm consistent voice and explicit speech opt-in.
Every line must be visible as text and tied to a real lesson/event; never overlay
speech and applause, or imply quiz performance proves on-court improvement.

Initial scripts for later recording/content review:
- Short Ball: “The short ball isn't always the easy ball.” Pair with the existing
  cue “High: go. Low: lift and come in.”
- Perfect challenge: “Three good decisions. Take that cue onto court.” Only
  when three first answers are accepted correct.
- “Two in a row” requires actual streak state. Do not ship it as random praise.

## Verification and release

Check real decoded MP3s, finite natural tails, matched playback, rotation across
full lesson completions and navigation, no answer-level rewards, first-visit
opt-in, interruption/mute/background, cold loading and retry. Run required CI,
Git preview and staged/live verification under standing user autonomy and
deploy-live instructions. Browser checks do not certify physical-device listening.
