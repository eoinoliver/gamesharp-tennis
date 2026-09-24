# Sharpen beta redesign — 14 September 2026

## Scope and decision

The user chose quality-led consolidation at 21 Daily lessons and authorised a
radical reduction of Sharpen's catalogue/cognitive burden. The approved player
illustration and seven area hotspots remain. No new lesson, Predict link,
diagnostic content, subscription, account or backend was added.

Sharpen now offers two or three recognisable situations per area, then opens one
exact approved lesson directly. Nineteen concern routes reuse seventeen existing
lessons. The other four remain in Choose a Lesson; they were not forced into
Sharpen to claim complete coverage. All twenty-one Daily lessons can hand off
their exact court cue to Sharpen.

The legacy sixty-six-prescription Sharpen runtime, symptom-based causal claims,
question-bank recommendations and unavailable content-launch fallbacks are no
longer used by this flow. Legacy storage is retained, not migrated into new
completion, court-practice or improvement claims. Unmatched concerns have an
honest observation/coach route, not a substitute lesson.

## One teaching source and truthful progress

- `gamesharp-sharpen-paths.js` owns only short invitations and exact lesson IDs.
  Approved geometry, evidence, questions, explanations, boundaries, named-player
  payoff, memory and on-court action remain in the existing canonical lessons.
- Static previews borrow the unanswered first scene, with animation, answer
  labels, global IDs and interactive controls removed. Contact uses a neutral
  text tile because its actual renderer owns a singleton stage.
- `openPractice` is an unscored, one-return bridge. It suspends/restores Daily
  state and never awards Daily credit or changes the Daily checkpoint.
- Completing all three decisions records exposure. Saving a cue, reporting a
  court trial and reporting an observation are separate actions. None establishes
  physical mastery or verified improvement.
- The separate `gamesharp_sharpen_v2` store retains one focus. Failed storage
  switches to memory without stale-disk rereads; the UI says “Kept for this visit.”
  Corrupt or mismatched saved routes are withheld without deleting their records.
- Daily-linked cue Back/Exit restores Daily. Explicit bottom/sidebar navigation
  releases that return context and honours the chosen destination.

## Corrections found during review

Do not erase these failures or describe the first green check as proof of quality:

1. Incomplete replay initially returned to the area instead of its exact cue.
2. Pre-completion exit controls initially used completed-payoff wording.
3. A decorative rem-sized arrow overflowed its fixed track at 200% text.
4. The inherited failed-image menu overflowed its illustration container.
5. Daily's return hook survived an explicit Explore navigation and hijacked Home.
6. A malformed saved region could crash Back navigation.
7. Failed durable storage initially retained “Saved for next session” success copy.
8. A capture-phase microtask could check native Exit before its target handler had
   closed Sharpen. Scripted DOM clicks masked this event-order defect; native
   mouse/keyboard regression checks were added.

Each received a scoped correction and regression check. Healthy illustration and
hotspot geometry remain unchanged. The twenty-one lesson definitions are identical
to the pre-redesign snapshot as serialized data; shared bridge/navigation code is
the only lesson-engine change.

## Verification evidence

- 139 automated tests pass, none skipped. The trust audit and connected-journey
  audit pass. The existing legacy warning remains 366/549 answer-length tells;
  that bank is not exposed by the new Sharpen flow.
- 57 exact concern openings across 320, 430 and 1280px. All seventeen distinct
  destinations completed at 430px, returning exact canonical memory/court cues.
- Normal-motion Contact and Serve Quality inspected in the actual lesson, with
  card/Focus and correct/incorrect choices. All nineteen decorative previews
  remain static with normal motion enabled.
- Saved cue, refresh, explicit court trial and feedback, keyboard cycle/Escape,
  200% text, missing path/state assets, failed illustration and blocked storage.
- Both a completed Daily and an existing partial Daily retain their checkpoint,
  history and credit through Sharpen practice. The partial Daily still resumes.
- All nine eligible Predict → Live Point → Playbook journeys freshly completed
  at 320 and 430px, including both Live Point lines, Focus and exact Playbook.
- Final full 430px Sharpen run after runtime corrections passes all ten groups;
  targeted corrupted-route, quota-copy and persistent-navigation checks supplement
  that reusable matrix. No application runtime errors in the verified paths.
- Six native-input cases pass at 430px: Exit, Back, Escape, completed replay/Exit,
  Home and Explore/Home. The first four restore Daily; explicit tabs go Home.
  All preserve Daily history/credit. Native evidence: `gs-sharpen-native-hQXcJD`.

Reusable checks: `tools/sharpen-beta-browser.mjs`,
`tools/sharpen-native-return-browser.mjs`,
`tools/connected-journey-browser.mjs`, the Sharpen paths/state tests, the player
contract and `gold-daily-sharpen-bridge.test.mjs`.

Temporary visual evidence (not durable user data): `gs-sharpen-beta-Q9IUtF`
(full 320/430/1280 matrix), `gs-sharpen-beta-QfkNu1` (fallback bounds),
`gs-sharpen-beta-rx51qQ` (normal-motion/edge cases), `gs-sharpen-beta-nF155c`
(partial Daily), `gs-sharpen-beta-Z5TEbO` (final 430px matrix), and
`gs-connected-review-Zqd3gJ` (eighteen connected journeys), under macOS temporary
storage. Release/deployment receipt is recorded in
`../gamesharp-tennis-alignment/PROJECT_ALIGNMENT.md`.

## Release identity and limits

Canonical source: `/Users/eoinlynn/Downloads/gamesharp-tennis-integration`.
Sharpen `2026-09-14.sharpen-beta.1`; paths `2026-09-14.sharpen-paths.1`;
engine `2026-09-14.gold-daily.32`; Gold loader `20260914-gold-daily-62`;
Sharpen loader `20260914-sharpen-beta-1`.

Twenty-one lessons, nine eligible Predict journeys, eleven withheld Predict IDs,
eight Playbook patterns and four exact Daily/Predict links are unchanged.
The eleven withheld IDs lack the required end-to-end launch approval; this
Sharpen change neither approves them nor routes users into them.
Published calendars remain unchanged through 4 November. Fix the Culprit has not
been rehabilitated as a diagnostic offering, and the remaining three lesson briefs
remain deferred. No cross-device sync or continuous server monitoring was added.

This is an implementation and model-led visual/semantic review, not independent
coach sign-off or evidence of learning/retention. Physical-device touch, Safari,
VoiceOver and real-player comprehension still require beta observation. The next
high-value test is whether players can recognise their situation, understand the
distinction and recall the cue without assistance—not whether more catalogue
entries can be generated.
