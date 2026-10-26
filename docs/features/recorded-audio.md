# Recorded tennis audio — 26 October 2026

The user rejected the synthetic racket, bounce and success sounds and explicitly
requested free internet recordings. The shared player now uses real CC0 audio:
two forehand contacts and a grass bounce by jamesdrake89, plus small-crowd applause
by Nox_Sound. Exact sources, license checks, preview hashes and transformations
are in recorded-audio-sources.json and THIRD_PARTY_NOTICES.md.

Four self-hosted mono PCM WAVs total 118,364 bytes. Contact is 170 ms, bounce 100 ms,
applause 900 ms. Impact onsets are within 5 ms of the sample start; no synthetic
pitch layers, random detuning or oscillator fallback. The artificial net effect
is removed without substituting a ball bounce for a net strike. The existing
selected-contact schedule, quieter feed/bounce, deduplicated applause, silent
automatic wrap-up and neutral Predict choices remain intact. No lesson, scene,
question, payoff, score or progress rules changed; all 41 lessons remain eligible.

Recordings load and decode after opt-in. No audio context or asset request is
created on an ordinary first visit. The control shows loading/cancel or retry
when appropriate; ready requires running audio and all four decoded recordings.
Unavailable contacts are dropped, never queued. Muting, backgrounding, page exit
and cross-tab mute cancel active sound. Existing iOS playback routing and gesture
resume remain. A ten-second fetch timeout avoids an indefinitely loading control.

Validation before hosted review: 25 unit tests; 85 sensory/navigation assertions
each in Chromium and WebKit across all 41 lessons, including real buffer playback,
cold/missing assets, cancellation and recovery. Offline rendering of the actual
recordings has nonzero bounded output, no clipping and zero signal after one
second in both engines. Individual recording peaks are at most 0.85. Build parity:
104 release files / 103 public files / 109 source and test inputs. A sixth explicit
hash overlay preserves all historical release fingerprints.

The quality judgement supported here is provenance and signal/timing quality,
not a claimed human listening panel. Physical iPhone/iPad speaker playback and
perceived quality on those devices are unverified. WebKit automation does not
prove those. The supplied recordings are derived from Freesound HQ MP3 previews,
not lossless original masters. Full browser release and hosted checks are recorded
on the PR and in the release follow-up.

Rollback baseline: b245169ce4, dpl_HjYv1V6KiX36tBKRWgzYCrPCyXzX,
Git main 0d456f91a289c13a57f0b75a2d6b50a1d27d659b. Standing user instructions
("full autonomy", stop asking, deploy all live) authorize this repair and its
release; Git builds, staged verification and exact-artifact promotion still apply.
