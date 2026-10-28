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

## Completion reactions — 27 October 2026

Three additional CC0 recordings, selected by the user: Small crowd cheering by
misjoc (https://freesound.org/people/misjoc/sounds/400590/), Applause by
KentVideoProduction (https://freesound.org/people/KentVideoProduction/sounds/199277/),
and small crowd cheering by HowardV
(https://freesound.org/people/HowardV/sounds/264377/).
License: https://creativecommons.org/publicdomain/zero/1.0/.
Trimmed, faded and level matched; original pitch preserved. Source and output
hashes, exact processing and reuse verification are recorded in
`docs/features/natural-completion-sources.json`. These are general audience
recordings, not recordings of the on-screen tennis point.

## Stroke integrity supplement — 28 October 2026

`rally/foot_directions.json` recovers ankle end-site directions from the pinned
Tennis-MoCap revision above for 20 shared clips. Each record includes the raw
source SHA-256, source frame, fit error and authored clip fingerprint. The
neutral ready stance is authored; the drop-shot fallback remains illustrative.
The offline recovery scripts require separately obtained BVH inputs and NumPy.
No raw dataset or reference video is included in the app or this repository.

`rally/stroke_integrity.py` makes explicit geometric adaptations to the three
volley grips/arms and the slice's supporting arm. These derived poses retain the
same attribution and share-alike license. They are illustrations, not newly
captured or professionally certified strokes. The ball contact positions are
preserved; the adaptation and its limits are recorded in the feature evidence.
