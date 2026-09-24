# GameSharp Tennis — Builder Entry Point

Read `AGENTS.md`, `PRODUCT_CONTRACT.md`, `CONTENT_CONTRACT.md`, and
`RELEASE_PROTOCOL.md` before making changes. Those files supersede every older
instruction in this document.

Start new work with the [shared alignment record](../gamesharp-tennis-alignment/PROJECT_ALIGNMENT.md)
as required by `AGENTS.md`. It separates agreed direction from dated state and
recommendations; a local prototype, public review pilot and main-product release
are different statuses.

## Project
Static PWA for tennis decision training. Live at **gamesharptennis.com**.

## Files
- `/Users/eoinlynn/Downloads/gamesharp-tennis-integration` — the only canonical source.
- Local preview directly from the canonical directory. Hosted previews build
  from its pushed GitHub task branch. Do not maintain a second source copy.

## Git / Deploy
- Follow the branch, ownership, handoff and exact-version “ship it” rules in
  `AGENTS.md`. Commit/push/log before switching agents; never push to main.
- Production requires “ship it” after the named commit/deployment has passed
  `RELEASE_PROTOCOL.md` and been shown as a preview. GitHub supplies Vercel's
  source; only verified staged production builds may be promoted.
- Keep `.DS_Store` out of commits.

## Architecture
- `index.html` is the shell. Point IQ, Live Point and Sharpen already have
  companion files. Do not add another renderer or parallel content source when
  an approved engine can own the behavior.
- **QBANK** — 549 questions, each with id, pillar, module, format, difficulty, tier, visual, techAnim
- **TECH_ANIMS** — animation library, each entry has svg, init(params,cbs), conseqAnim(ok), captions, hasMistakeToggle
- **Play a Point** — `buildPlayAPoint(pillar, module, pool?)` builds 3–5 linked decision bundles with anti-repeat logic
- **Anti-repeat** — `gamesharp_seen` localStorage key (ids, modules, hooks, skills)
- **Five screens** — homeScreen, onboardScreen, profileScreen, quizScreen, scoreScreen — all toggled via `showScreen(id)`

## Release gates
Run the complete local contract suite from this canonical directory before any
preview is described as ready:
```
node --test *.test.mjs
node tools/launch-trust-audit.js index.html
```
- **launch-trust-audit** enforces question integrity: four distinct options, a
  real correct answer, teaching present, no self-disqualifying absolutes
  ("always", "automatically", "every time"), and no unattributed statistics.
- It also **ratchets the length tell** — the count of questions whose correct
  answer is 12+ characters longer than every distractor. Lower
  `LENGTH_TELL_BASELINE` as editorial work improves the bank; the gate fails if
  it rises. This is the bank's largest known content debt.

## Key Functions
- `startQuiz(pillar, module)` — starts a Play a Point session
- `startDailyChallenge()` — current recovery Daily entry; inspect its trusted
  four-item builder rather than assuming it shares the legacy module path
- `loadQ()` — renders current question with point header + format badge
- `pickAnswer(letter)` — handles answer, triggers consequence anim + pro lens
- `mountTechAnim(key)` — mounts a TECH_ANIMS entry into #techAnimBox
- `buildPlayAPoint(pillar, module, pool?)` — anti-repeat bundle builder
- `showScreen(id)` — hides all .screen elements, shows target

## Style Rules
- Dark tennis theme: `--dark: #0d1a0f`, `--gold: #c8a84b`, `--correct: #4caf50`, `--wrong: #e05252`
- Font: DM Sans
- Mobile-first, 375px base width
- No emoji in commits unless already in the codebase

## Workflow
1. Work only in the canonical directory.
2. Quarantine anything that does not satisfy the current launch manifest.
3. Test the exact files in place and personally inspect the complete journey.
4. Push the task branch and show the Git preview with project and exact commit.
   Eoin's “ship it” authorises the release routine for that reviewed version.
