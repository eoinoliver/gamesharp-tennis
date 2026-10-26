# Imported assets and public-source audit

The production swing/pose data is adapted from **Tennis-MoCap**, maintained by
Juan Diego Pulgarín-Giraldo, with the contributors credited at
https://github.com/jdpulgarin/Tennis-MoCap.
Upstream reference revision: `9af88bb4df4e78b22127719744fdca993ced2733`.
License: Creative Commons Attribution-ShareAlike 3.0 Unported,
https://creativecommons.org/licenses/by-sa/3.0/.

Derived pose/clip data (`rally/*_data.json`, generated `app/clips/*.json`) and
motion-derived Sharpen renders retain that license. GameSharp edits, retimes,
retargets and places motion on court; racquet, running and ball flight are
modelled. The live Explore credit and source/license links remain unchanged.
This notice does not grant rights to unrelated application code or named-player
reference material. Pro Lens source links are retained; no source video is copied.

Migration imports only the 81 live app files and selected source/build/test
inputs. No lab screenshots/evidence, raw BVH dataset, Desktop pose-trial video,
Blender binaries, old pose PNGs, private management credentials, `.vercel/` or
legacy audio files are included. Sound now uses the CC0 recordings listed below (26 October 2026).
`config.js` contains the existing public PostHog capture key, not a management
secret; it is already served live and is restricted to approved production hosts.

The Sharpen JPEGs are existing stylized app illustrations/renders, not the
Desktop pose-trial video or old player-pose PNGs. Keep this distinction and the
motion-source license under independent review before public cutover. Detailed
lab creation history remains in the private source repository; do not publish
that whole repository as migration evidence.

## Recorded sound — 26 October 2026

All four shipped WAV files are adapted from original creators' CC0 1.0 recordings:
https://creativecommons.org/publicdomain/zero/1.0/.

- `contact-1.wav`, `contact-2.wav`: **Tennis Forehand 2**, jamesdrake89,
  https://freesound.org/people/jamesdrake89/sounds/662263/.
- `bounce.wav`: **Tennis Bounce Ball on Grass**, jamesdrake89,
  https://freesound.org/people/jamesdrake89/sounds/662258/.
- `applause.wav`: **Voice_Crowd_Small_Expression_Applause_Stereo**, Nox_Sound,
  https://freesound.org/people/Nox_Sound/sounds/752710/.

Derived from Freesound's public HQ MP3 previews, trimmed, high-pass filtered at
100 Hz, faded, peak balanced and converted to mono 44.1 kHz / 16-bit PCM WAV.
The underlying previews are lossy; these are not copies of the original WAV
masters. Source URLs, source hashes, exact cuts and shipped hashes are in
`docs/features/recorded-audio-sources.json`. No player broadcast audio, music,
synthetic pitch layers or legacy audio files were imported.
