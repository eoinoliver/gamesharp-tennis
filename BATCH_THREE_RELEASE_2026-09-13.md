# Three-lesson expansion — 13 September 2026

## Authorised scope and inventory

The user approved the recommended next three-lesson batch. Twelve of the original
24 spines are now authored, source-bound and approved for this release; twelve
remain research briefs. This is not a new animation platform, Sharpen renovation,
or expansion of the eligible Predict library.

| Lesson | Stable ID | Learning contrast | First scheduled date |
|---|---|---|---|
| Running Around Is Not Hiding | gold_runaround_pattern_v1 | Time permits the forehand; depth removes it; pressure must repay recovery | 2026-09-21 |
| The Return That Shrinks Serve +1 | gold_middle_return_v1 | Deep middle neutralises; short middle does not; a softer serve can earn width | 2026-09-23 |
| The Open Court Is Not Always Open | gold_future_space_v1 | Movement favours playing behind; a stationary defender reverses the target; opposite-wing transfer | 2026-09-25 |

The three review routes are `?goldDaily=runaround`, `?goldDaily=middle-return`, and
`?goldDaily=future-space`. The ordinary Home remains unchanged: one Daily door,
Predict secondary. Each new lesson reaches its exact existing Sharpen region and
returns to Daily. None invents a Predict/Live Point/Playbook substitution. Four
of twelve lessons have the existing exact Predict continuation; eight do not.

## Calendar and history

The first published nine-day cycle from 12–20 September stays intact, including
tomorrow promises. A dated twelve-day cycle begins on 21 September, interleaving
the three additions with the original nine. `lessonFor(date)` selects the schedule
version; a later expansion must append a schedule, not rewrite old dates.
Existing checkpoint keys, main history, completion credit and first answers are
unchanged. No remote storage or retention tracking was added.

## Editorial evidence

The initial candidate names were changed when stronger, lesson-specific sources
were found. These are paraphrases, not invented player quotations or endorsements.

- [WTA interview with Craig Tyzzer](https://www.wtatennis.com/news/2465400/coaches-corner-bartys-best-is-yet-to-come-tyzzer): Barty's slice sets up her forehand. Supports two-wing construction; does not independently validate every authored recovery geometry.
- [ATP analysis of De Minaur](https://www.atptour.com/en/news/de-minaur-infosys-atp-beyond-the-numbers-december-2024): middle first-serve returns reduce sideline risk and immediate angles. Does not establish a universal return prescription or guarantee neutrality.
- [Contemporaneous Jankovic match report](https://www.tennisserver.com/photofeed/2010/100318-bnp_paribas_open.shtml): Chip Brooks explicitly recommended hitting behind Kleybanova instead of feeding her run into open court. Reported coaching exchange; not a claim every such shot wins.

The scenes are authored teaching examples, not reconstructions of these matches.
Possible reply lanes are dashed and labelled as possibilities; no unplayed winner
or opponent contact is invented. Coaching application remains GameSharp analysis.

## Verification

- 60/60 automated tests pass. New tests exercise all 36 new choice scenes in normal
  and reduced motion; all nine setup states; bounce alignment; service-box geometry;
  visible braking reversal; sound-event times; malformed-scene rejection; and old
  checkpoint survival under dated expansion.
- Trust audit: zero errors, one unchanged warning for 366/549 legacy length tells.
- All three new Home → three decisions → result → exact Sharpen → Daily journeys
  completed at 320×844 (wrong choices, normal motion), 430×844 (correct choices,
  reduced motion), and 1280×844. Nine complete runs. Card and Focus inspected.
- All three completed at 390×844 with sound enabled and optional audio blocked.
- After the final braking-path correction, the affected lesson completed again
  at 320, 430 and 1280, including incorrect/reduced-motion comparison. Actual SVG
  transforms were checked to move right, brake, then left. Final landscape Focus
  checked at 844×390, and the final reply-legend spacing inspected at 320×844.
- Existing refresh/resume, immutable replay credit, stale-tab/mid-lesson midnight,
  unavailable storage, desktop completion and catalogue/main separation passed.
- Existing Serve Daily → Predict seq_001 → both Live Point branches → exact
  wide_serve Playbook → Daily return passed at 390×844. Other unchanged connected
  journeys retain the prior release's evidence; they were not all re-audited here.
- Original nine challenge definitions compared byte-for-byte with the pre-release
  public engine and match. Their existing source, geometry and question data were
  not rewritten. Shared shell changes are limited to the new scene's feedback.
- Recorded audio assets decoded and the audio context ran after a native browser
  click. Timing is covered by executable tests; no physical-iPhone listening claim.

Findings corrected during review: overlapping explanation/payoff, undeclared
sideways bounce kinks, a caption without an actual braking reversal, the missing
forward movement on a net-recovery alternative, and cramped landscape sizing.
The connected test also required replacing its obsolete index-to-date arithmetic
with the versioned calendar; its initial failure was a test-date mismatch, not a
new application route substitution. Earlier failing runs are not release evidence.

Evidence directories (under `/private/var/folders/bn/vxt5zbw10jq22n8pg5g1dyvc0000gn/T/`):

- `gs-batch-three-WA6Ltg`: final full nine-run matrix before the scoped brake-turn/legend correction.
- `gs-batch-three-G75xeO`: three affected-lesson reruns after brake-turn correction.
- `gs-batch-three-Xj11bB`: three optional-audio-failure journeys.
- `gs-daily-edges-XFbVLU`: persistence/navigation/desktop regression.
- `gs-connected-review-DqkJiQ`: existing connected journey regression.
- `/tmp/gs-final-motion-landscape.png` and `/tmp/gs-release-ready-caption.png`: final scoped visual checks.

## Release identity and limitations

Loader `20260913-gold-daily-52`; lesson engine `2026-09-13.gold-daily.22`;
spines `2026-09-13.lesson-spines.11`; calendar `2026-09-13.daily-loop.2`.
Main credit adapter and connected-point runtime versions remain unchanged.

Independent coach review, player comprehension, physical-device listening and
real next-day return remain unproven. No broad legacy Sharpen content approval,
continuous monitoring, production runtime-log scan or drains configuration is
claimed. Static-client browser checks are the production verification scope.

## Deployment

Deployed and publicly verified from the canonical source.

- URL: https://www.gamesharptennis.com/
- Target: production; status: READY.
- Deployment: `dpl_DoB1GNH4G3P3J9NuDUMnzhvJLGF5`.
- Unique URL: https://gamesharp-tennis-85oc1a142-eoinlynn-5978s-projects.vercel.app
- Framework: static HTML/JavaScript; build duration: 315ms.
- Commit: not applicable; canonical directory is not a Git repository.
- Existing CLI authentication succeeded; no new login requested.

Public `?goldDaily=runaround` completed through all three correct decisions and the
Barty payoff at 390×844, with no horizontal overflow or captured runtime errors.
Public Home Daily (test date 13 September) → Serve → Predict seq_001 → both Live
Point branches → exact wide_serve Playbook → Daily passed at 390×844. Evidence:
`gs-connected-review-MrfNAt` in the evidence root above and
`/tmp/gs-batch-public-result.png`. No real user's local storage was used.

All seven runtime/manifest files match the local reviewed candidate byte-for-byte:

| File | SHA-256 |
|---|---|
| index.html | 65e8da1c61f35f98f18203e0d744da785dc2218687f796f6936548071be7e354 |
| gold-daily-prototypes.js | d71bec9f51e208a23664902ab784bca3b6759fe3a280bf171623e12f039d2fc8 |
| gold-daily-prototypes.css | a03455cb2ca7f8393c5c79335df7db3f61b91e5f41e6499134658511915b8fff |
| gold-daily-lesson-spines.js | c8bf3227183f235a4531efba16011f9680cbff99e0ba11c6aae5e6e348a59813 |
| gold-daily-loop.js | 9229ac40e87ff346a585886626e2d5d33d468fccf5b5718e40f0e05b49e27345 |
| gold-daily-main.js | bf0c32618ab939eabab7389b572603d0cfcd529e399ba5709c8c167053634f5c |
| LAUNCH_MANIFEST.json | 0c963a489e9f29efc5bdf8c6e31bb421f6d255cabd33d305b942607e966849a5 |

Post-deploy observability: browser runtime check clean on the exercised paths;
server error-log scan and drains configuration not inspected. No continuous
monitor was created. Post-deployment edits update this record and shared alignment
only, not the verified runtime artifacts.
