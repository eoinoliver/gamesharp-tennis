# GameSharp Tennis — current project alignment

## Decision and scope — 5 October 2026

Eoin chose option A on migration PR #1: the live 3D app is GameSharp Tennis.
GitHub `eoinoliver/gamesharp-tennis` main becomes its canonical source after
review and approved cutover. Preserve the 2D app as history at
`legacy-2d-2026-09-21`; do not deploy it over the 3D product.

Migration source: private `gamesharp-lab`, branch `codex/release-2026-10-05`,
commit `c3fdb63` (full source identity in `docs/migration/OPTION-A.md`). The
release app is built from `app_src/` and the selected `rally/` inputs. This
migration changes infrastructure and documentation, not product behavior.

Live baseline checked on 5 October:
- deployment `dpl_EjCtSiEP2ufRa4npUoQBbssJ16Cj`;
- unique URL https://gamesharp-tennis-gzlepvjdl-eoinlynn-5978s-projects.vercel.app;
- app version `e5cb1a5c10`;
- 21 Daily lessons and two Predict lessons; 22 clips; 81 release files.

Recheck live identity before cutover; dated state is not a release authorization.
After cutover, GitHub main alone supplies production builds. Lab work stays in
`gamesharp-lab` and reaches the product through reviewed PRs in this repo.

## Durable operating agreement

Either Claude or Codex builds end-to-end. The other independently reviews and
posts findings on GitHub. Eoin says “ship it” for the exact version. The builder
then owns merge, production verification and rollback. See `AGENTS.md` and
`RELEASE_PROTOCOL.md` for the operative rules.

## Historical material and separate decisions

The 2D contracts, September release evidence and local alignment history are
historical at the legacy tag. They do not establish current live state or impose
2D engine requirements on the 3D product. The lab's takeover and Home handovers
are dated historical records; the imported release and fresh verification take
precedence. No external local alignment directory is required to operate here.

Desktop `Blender Tennis/` and `pose-trial-2026-09-21/` remain untouched. Their
proposed private lab home needs Eoin's separate go. Do not import source video,
raw motion-capture datasets, Blender binaries or experimental media into this
public repository. Golf, PropPocket and Desktop retirement are outside this PR.
