# Connected journeys — bounded repair, 11 September 2026

Status: deployed to production and publicly verified.

## Scope and findings

Nine eligible Predict journeys connect to eight Live Point scenes and eight
Playbook patterns. The reported second-serve case (`second_serve_big`) was also
repaired. Eleven other Predict sequences remain withheld. No Gold lesson was
added, changed or promoted into the main Daily; Sharpen was not renovated.

The failures were not just wording mistakes:

- Live Point drew a direct flight while its event clock described a bounce.
- Player movement did not reliably arrive at the authored ball contact.
- All 32 finishes across the eight connected scenes had a different authored
  start from the final incoming contact; full-point assembly concealed this by
  replacing that coordinate, while the separate decision animation still jumped.
- The own-second-serve scene lacked an explicit serve bounce/serve identity;
  the flat option could be classified as a groundstroke. It now serves from
  behind the baseline into the diagonal box, then continues to the receiver.
- Several Predict paths labelled down-the-line travelled diagonally; some
  volleys were shown behind the service line. Reviewed geometry now matches
  those labels. The returner's backhand is the far player's right-hand screen side.
- Narrow Focus View could lose its title/clip its close control. Optional audio
  startup could wait indefinitely. Missing exact IDs could silently substitute
  another available journey.

## Implementation

`livepoint-scene.js` renders flight, bounce, contacts and recovery from the
existing event timeline. Card and Focus View call the same renderer. Winning
shots no longer automatically pull the opponent to the winner's target.
The full-point replay preserves the recovery between its two decisions.

Nine scenes now have an explicit continuity-review set; runtime validation
withholds a finish that starts away from the incoming contact. Typed contact
metadata takes priority over descriptive labels. Tests include a deliberately
invalid service box, exact phase boundaries, actor contact positions, line
geometry, volley depth, reduced motion and a missing-ID fallback attempt.

The old per-question diagram function is dormant in the active Predict flow.
No changes to that dormant renderer or its geometry were retained. This release
does not consolidate all legacy engines or certify the full library's coaching.

## Evidence

- 39/39 Node tests passed; launch trust audit passed with its existing editorial
  debt warning: 366 of 549 legacy questions have length-tell risk.
- Final candidate: 18 complete mobile UI walks, all nine journeys at 320×844
  and 430×844. Both Live Point branches and both outcomes were exercised;
  comparison did not overwrite the first result. No recorded horizontal overflow.
- Desktop: `seq_002` and `seq_009` completed at 1280×844; card and Focus layout
  inspected. Shared-renderer panels inspected all four finishes of all 22 scenes
  for visual regression, not a fresh editorial approval of the other 13 scenes.
- Own second serve: normal sound-on path reached decoded audio ready; reduced
  motion contained no running SVG animations; blocked audio reported unavailable
  while the reply control remained usable. No captured JavaScript runtime errors.
- Invalid explicit Live Point ID produced an unavailable view with zero choices.
- All nine exact Playbook cards were separately confirmed at the viewport centre
  after smooth scrolling settled, at both 320px and 430px. Merely finding the card
  in the DOM is not sufficient; the reusable harness now checks visible focus too.
- Repeated journey runs exercised returning to the same exact scene. Public
  artifact equality and one full production path must still be checked after deploy.

Final mobile evidence directory:
`/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-connected-review-zkpy5P`

Desktop evidence directory:
`/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-connected-review-N8ErET`

Reusable checks: `tools/connected-journey-audit.mjs` and
`tools/connected-journey-browser.mjs`. The latter uses isolated browser state;
sound-on checks remain separate because synthetic clicks do not reliably unlock
Web Audio. An early harness timeout and an asynchronous-control race were fixed;
those failed diagnostic runs are not counted as release passes.

## Limits and next boundary

The remaining 13 Live Point scenes did not receive a new full coaching audit.
Physical iPhone speaker/listening quality, independent professional-coach review,
and learning/next-day retention remain unverified. The nine Gold prototypes remain
the user-approved direction and are not yet the integrated main Daily.

Standing deployment permission is recorded in AGENTS.md, RELEASE_PROTOCOL.md and
the alignment record. The linked `gamesharp-tennis` project and existing
`eoinlynn-5978` CLI login were confirmed without requesting a new login.

Release token: `2026-09-11-connected-journeys-4`.

Verified runtime SHA-256 values:

| File | SHA-256 |
| --- | --- |
| index.html | 7fd347891422f6cf2db2015e9ae9223b18dc477abe302fc0fc32ef4b497e3fb9 |
| livepoint-prototype.html | a42280bc09bf000cce4f3931683a9cae4ef983a0c6732f629c892029cebab6d3 |
| livepoint-engine.js | ab43098416a670ceda4578f759bda609b394b0e22526b879b0933a3886940900 |
| livepoint-content.js | 1910da23c15cd70df84baa9e1b32e5f7377fa39e2c34fb91eca3e571bb8be679 |
| livepoint-scene.js | 15290096b816da64f400d98535fe53feacdc5353e3c1060f94b2a4586ca858cd |
| predict-live-integration.js | 21f7e42d379e961b9b5886557e96cc6704ff6bbf3a984ed1cd05058852458523 |
| LAUNCH_MANIFEST.json | 93d158332b32c15c0e189cb34c663d763e24e9997cd1a50912eed234ff38b2b8 |

Gold files remain identical to the earlier pilot release:

| File | SHA-256 |
| --- | --- |
| gold-daily-prototypes.js | d36874400e03cb2f166ac7f6f2fce02807373b45e1706e60b046cad652e78df2 |
| gold-daily-prototypes.css | da2b21938925758db3e1e4d653450c8053e000cf202de484ed7b88ac9cf3168d |
| gold-daily-lesson-spines.js | 7849a9e2307d3b23b574af5e7d7a7294db511eaebf12e7b2473970e3aa0335eb |

## Production verification

Deployment `dpl_A3sXEKziWXCYY8CydajQRNGnZsyw` reached READY and was aliased to
https://www.gamesharptennis.com. Immutable deployment:
https://gamesharp-tennis-3hcc9d2cc-eoinlynn-5978s-projects.vercel.app.

Target: production. Framework: static HTML/JavaScript. Build: 440ms. No Git
commit exists in this canonical directory. The existing Vercel login deployed
successfully without user re-authentication.

All seven runtime/manifest files above and all three unchanged Gold files returned
200 and matched local SHA-256 values. Homepage and Live Point HTML returned
`public, max-age=0, must-revalidate`. Public `seq_002` completed at 390×844:
three Predict decisions, both Live Point branches, immutable first result,
and the correct Playbook card visibly in view after scrolling settled.
Production browser evidence:
`/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/gs-connected-review-lyKOJp`.

This post-deployment entry is a local record; runtime files were not changed
after public verification. No new monitoring service or log drain was configured;
the browser checks are not continuous production monitoring.
