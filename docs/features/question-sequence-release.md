# Question sequencing release — 27 October 2026

Each question now plays its opening first, then types its situation text, then
reveals and enables the question and choices. Both Daily (including branches)
and Predict use this order. Reserved text space prevents a jump as reading
begins. During the opening, unseen setup and choices are also withheld from
assistive technology. Replay and Back cancel the previous sentence; pausing
motion does not start reading. Existing post-answer teaching remains intact.

Candidate app `adaf396f61`; PR #47.
Candidate commit `95a23565edafa33cd765cc7ff9fca009e945c157`.
Preview `dpl_B3sLuM8GqGssv5sFNiFodtqhcu1z`:
https://gamesharp-tennis-nd8fdbpam-eoinlynn-5978s-projects.vercel.app

Local checks: 30 unit tests; 1,389 action/sequence assertions across all 135
questions in all 41 lessons in each of Chromium and WebKit. Full real UI
journeys cover second-serve, serve-plus-one and Predict with frame-sampled
sequence checks, cue save, next challenge, mute persistence and natural reward
rotation. Mobile and desktop screenshots inspected. Physical iPhone/iPad testing
is not claimed.

Previous production/rollback: `dpl_G9TH2BbFKvoDNgyGFUPdnEAiRVk5`, version
`953ecc8011`. Release follows standing user autonomy and deploy-live instructions;
Git/staged artifact and rollback safeguards remain in force.

Full CI run 40455177800 passed, including build parity, all unit tests, readiness,
sensory/navigation, app flow, layout, payoff, Pusher, all 41 scene gates and 325
contact checks. Preview passed 248/248 hosted checks and three complete journeys.

Merge `7fec4ae8d982ca33168b1381bb3ed2ed291c8ba1` has the exact candidate tree
`2f3f23dcbf1f65cc3806d565ae5f814819586c54`.
Git-triggered staged Production: `dpl_6cmgiFL3bhovR3QdTyd6vxfVAWoa`:
https://gamesharp-tennis-n6awyqz4i-eoinlynn-5978s-projects.vercel.app

Preview and Production Resources UI both report 106 static assets and no
function category. Deployment metadata matches project settings, effective
routes/configuration, resource configuration, regions, Node version and build/
runtime environment-key inventories. No configured project environment variables;
platform-generated secret values were not retrieved. The static build does not
consume environment variables, and all served bytes are checked. Full-file
HTTP verification supplies content proof; Resources supplies the output count.
Automatic custom-domain assignment remains disabled.

Staged Production passed 248/248 hosted checks and the three complete Chromium
journeys, including sequence monitoring. Fresh pre-promotion checks confirmed the
unchanged prior live deployment, ready rollback, exact merge SHA and unchanged
project/environment configuration. Promoted this exact Production deployment;
no rebuild or laptop upload. Public domain identity and apex redirect verified;
public hosted checks pass 248/248. App version is `adaf396f61`.

Direct live second-serve, serve-plus-one and Predict journeys pass in Chromium
and WebKit. Each observes all three reading phases after motion, with no early
words/choices, no page errors, correct completion, cue save and next-challenge
behavior. Contact audio remains aligned; reward rotation and mute persistence
pass. Each browser intercepted 28 analytics requests. No rollback required.

No lessons were added or withheld: all 41 existing lessons / 135 authored
questions remain eligible. This verifies presentation behavior, not new coaching
validation or physical iPhone/iPad behavior. This record is documentation-only;
do not promote its build.
