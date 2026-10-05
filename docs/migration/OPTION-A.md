# Option A migration — 5 October 2026

Claude's premise objection is accepted: the old 2D migration would replace the
live 3D product. Eoin selected option A. This PR now imports the live 3D release
into `eoinoliver/gamesharp-tennis` and changes only build infrastructure and docs.

Source repository: private `eoinoliver/gamesharp-lab`.
Source branch: `codex/release-2026-10-05`.
Source commit: `c3fdb63ec7ce10829427f02d68fe822e4fb47c8e`.
Live deployment: `dpl_EjCtSiEP2ufRa4npUoQBbssJ16Cj`.
Live version: `e5cb1a5c10`; 21 Daily + 2 Predict lessons, 22 clips.

## Preservation and import boundary

Tag `legacy-2d-2026-09-21` preserves the previous PR tip, including its 2D source,
contracts and review workflow. An additive commit replaces the active tree;
Git history is preserved without force-pushing the PR.

`live-app-sha256.json` records all 81 release input files, including Vercel
configuration. `imported-source-sha256.json` records selected unchanged source,
build and release-test inputs. The build regenerates all 81 files byte-for-byte.
No whole private repository, raw datasets, evidence logs, credentials, historical
screenshots, source videos or Desktop assets are brought into the public tree.
See `THIRD_PARTY_NOTICES.md` for public-source audit and license scope.

## Infrastructure

Root `vercel.json` preserves the live runtime redirects/headers exactly and adds
only explicit build/install/output settings. Vercel serves `app/` only. This
closes the old root-upload exposure problem without importing legacy functions.
The CLI is pinned in `RELEASE_PROTOCOL.md`; Node/test dependencies are reproducible.
`AGENTS.md` defines main as canonical, removes local alignment dependencies and
retains build → other-agent review → Eoin “ship it” → builder release ownership.

The private lab is experimental again after cutover. Its existing AGENTS rule
already says nothing there deploys; no new lab commit or media relocation is
needed for this PR. Do not retire old Desktop work before separate preservation.

## Verification status

Exact rebuild passed locally (81/81 files). All 214 hosted HTTP checks against
the live domain pass, including the 80 publicly served file hashes, redirects
and exclusions. The Vercel uploaded-source inventory has exactly 81 entries; all
SHA-1 identifiers match the imported app. This inventory is uploaded source,
not a separate complete deployed-output inventory. Analytics tests pass 10/10.
Local browser suite passed: 33 app-flow assertions, 9 layout regressions,
21 payoff checks, Pusher at 390x844 and 375x667, and all 23 scene gates. Home and
Sharpen were visually inspected, with loaded stroke images and no page errors
or overflow. Initial option A GitHub contracts passed in Node 24 on Ubuntu;
Vercel Git build passed. Corrected final Preview checks and Claude's independent
verdict belong on PR #1 with exact commit/deployment identity. No independent coaching approval is claimed.
Production remains the baseline above; no merge, promotion or rollback performed.

### Git output correction

The first Git Preview exposed `app/vercel.json` as a static URL (CLI hosting
had treated it as configuration). `tools/build-hosted.py` rebuilds unchanged
source, then removes only that configuration file from hosted output. Root
`vercel.json` retains identical runtime routes/headers. Hosted output is the
80 publicly served live files. The committed 81-file artifact remains intact.

Vercel adds its exact Feedback script suffix to Preview index/play HTML. The
migration verifier records raw hashes and normalizes only that exact suffix on
Preview hosts, never on the live custom domain; all remaining bytes must match.
