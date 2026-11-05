# Lara alongside Frank

Eoin rejected the restrained first audition round, requested more energy, chose
Lara's expressive second audition, and explicitly authorised integration.
The approved reference is task `3f9ce796-de4b-45b7-94f6-eef1d9b81017`:
Lara, eleven_v3, speed 1.05. New cues preserve the existing teaching words with
energetic delivery; the three Reset prompts use encouraging delivery.

The complete 74-cue catalogue is available with either coach. There are 73 new
recordings: the two original movement variants have identical words and reuse
one recording. All source MP3s are retained unchanged, with provenance and exact
fingerprints in `lara-voice-sources.json`. Frank recordings are untouched.

The Coach selector appears on Home, Explore and Sharpen, and beside the lesson
completion voice controls. `gs_coach` stores `frank` or `lara` locally. Existing
players keep Frank until they choose Lara. The preference is shared by lesson
endings, route-specific Live Point endings, doubles and Reset. A failed storage
write is described as applying to this page only. Unknown values fall back to
Frank without rewriting unrelated data.

Changing coach stops current speech and invalidates a pending manual request.
It never unmutes, enables automatic speech or speaks on its own. A missing Lara
recording produces the normal unavailable/retry state; it never substitutes
Frank. Existing final-motion timing and silent point replay remain. Reset's
master mute and voice toggle now notify one another on the same page; changing
coach mid-routine stops the old recording and uses the new coach on the next step.

Verification covers preference/storage behavior, stale requests, missing audio,
all 74 browser-decoded assets, coach switching, cross-tab updates, Reset opt-outs,
responsive controls, and the existing 63 complete journeys with each voice.
Passing asset and browser checks does not establish independent listening or
physical-device validation. Eoin approved the audition; the individual generated
cues retain that separate listening limitation.
