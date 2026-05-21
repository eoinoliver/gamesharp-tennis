# GameSharp Tennis — Claude Instructions

## Project
Single-file HTML PWA for tennis decision training. Live at **gamesharptennis.com**.

## Files
- `~/Desktop/gamesharp-tennis/index.html` — the entire app (HTML + CSS + JS, ~4700 lines)
- `/tmp/gamesharp/index.html` — preview server copy (must stay in sync)
- Preview server: `python3 -m http.server 7432 --directory /tmp/gamesharp` → http://localhost:7432

## Git / Deploy
- Repo: https://github.com/eoinoliver/gamesharp-tennis
- Vercel auto-deploys on push to `main` → gamesharptennis.com
- **Always commit and push at the end of every session** without being asked.
- Keep `.DS_Store` out of commits.

## Architecture
- **Single file** — never split into multiple files
- **QBANK** — 370+ questions, each with id, pillar, module, format, difficulty, tier, visual, techAnim
- **TECH_ANIMS** — animation library, each entry has svg, init(params,cbs), conseqAnim(ok), captions, hasMistakeToggle
- **Play a Point** — `buildPlayAPoint(pillar, module, pool?)` builds 3–5 linked decision bundles with anti-repeat logic
- **Anti-repeat** — `gamesharp_seen` localStorage key (ids, modules, hooks, skills)
- **Five screens** — homeScreen, onboardScreen, profileScreen, quizScreen, scoreScreen — all toggled via `showScreen(id)`

## Key Functions
- `startQuiz(pillar, module)` — starts a Play a Point session
- `startDailyChallenge()` — daily mode, routes through buildPlayAPoint
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
1. Edit `~/Desktop/gamesharp-tennis/index.html`
2. `cp ~/Desktop/gamesharp-tennis/index.html /tmp/gamesharp/index.html` to sync preview
3. Test in preview (serverId from launch.json: `gamesharp` on port 7432)
4. Commit and push at session end
