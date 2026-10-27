# Completion voice across the catalogue

Live release: [exact deployment and verification record](completion-voice-catalogue-release.json).

This release expands the approved Frank / 0.95 completion direction from three
lessons to all 41 existing journeys: 32 Daily, two Predict and seven Play.
It adds 38 recordings and retains the three live recordings byte for byte.
No new lessons, question narration or spoken slogans are introduced.

Each ending is two brief sentences grounded in its authored choices. The exact
scripts and editorial rationale are in `completion-voice-catalogue.json`;
recording task identities, original and mastered hashes, durations, loudness and
provenance are in `completion-voice-sources.json`. The new files total 1.76 MB,
but only the current lesson's voice loads, following the sound-unlocking gesture.
The new files range from 1.9 to 3.4 seconds. Gain adjustment preserves timing and
pitch. The original files are retained outside the deployment.

Voice remains on by default, with explicit voice opt-outs and master mute
respected. Automatic narration follows the final motion, once per completion;
point replays are silent of narration, and Hear court cue provides an intentional
replay. A missing or late download never starts belated speech. A perfect score
uses applause only with automatic voice off. Court cues do not claim a perfect
score or on-court improvement. Professional insight, drills, original saved cues,
question feedback and fresh-lesson navigation remain available.

Predict has its own ending renderer. It now shares voice controls, speaks after
all three reads and the final point, and does not repeat completion analytics or
narration when replaying the same point. Starting the lesson again permits a new
completion. Other modes retain their existing completion flow.

Validation includes exact script/asset mapping and hash tests, real answer paths
through all 41 journeys, imperfect scores, autoplay timing, no applause overlap,
manual replay, opt-out, original score and saved cue preservation, and mobile
ending screenshots. The existing full release suite remains required. Chromium
and WebKit tests establish browser behavior, not physical iPhone/iPad audibility.
The new recordings still need human listening feedback for pronunciation and
naturalness; no perceptual or retention benefit is asserted from signal tests.

Release follows the Git preview, staged Production, exact manifest/inventory,
configuration comparison and live verification workflow. The current user's
full-autonomy and live-deployment instructions apply; no laptop upload is used.
