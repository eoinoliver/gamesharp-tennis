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
legacy audio files are included. Sound uses Web Audio synthesis in `sfx.js`.
`config.js` contains the existing public PostHog capture key, not a management
secret; it is already served live and is restricted to approved production hosts.

The Sharpen JPEGs are existing stylized app illustrations/renders, not the
Desktop pose-trial video or old player-pose PNGs. Keep this distinction and the
motion-source license under independent review before public cutover. Detailed
lab creation history remains in the private source repository; do not publish
that whole repository as migration evidence.
