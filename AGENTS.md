# GameSharp Tennis — Mandatory Builder Contract

Read `PRODUCT_CONTRACT.md`, `CONTENT_CONTRACT.md`, and `RELEASE_PROTOCOL.md`
before changing this project. They are release requirements, not suggestions.

Read `PROJECT_ALIGNMENT.md` for current decisions and dated state. Current user
instructions take precedence. Historical handovers are background, not release
permission.

## Canonical source

GitHub `eoinoliver/gamesharp-tennis` **main** is the canonical production source
after this migration is merged. Any local clone is only a working copy. During
review, the named PR commit is the candidate; the recorded live deployment stays
production until Eoin approves cutover.

The product is the 3D app. Build with `npm run build`; editable shell source is
`app_src/`, engine and authored lesson inputs are `rally/`, generated output is
`app/`. Git builds publish only `app/` using root `vercel.json`. No lab, Desktop,
legacy tag, exported HTML or standalone experimental page is a deployment source.
The private `gamesharp-lab` remains experimental after cutover; no production CLI
uploads from it. The 2D app is historical at `legacy-2d-2026-09-21`.

## Working defaults

- Mobile is the launch surface. Desktop must remain coherent and usable.
- Protect customer trust before breadth. Quarantine weak content; never fill a
  slot with a nearby or generic substitute.
- A user-facing journey is complete only when its question, answers, teaching,
  animation, Live Point, Playbook destination, navigation, sound and state agree.
- Personally inspect every newly eligible journey. Automated tests support that
  inspection; they cannot replace tennis, learning or visual judgement.
- Do not change unrelated screens or logic.
- Do not describe work as complete from compilation, passing tests or one happy
  path. Report exact eligible, withheld and unverified counts.
- The settled 24 September workflow below supersedes the 11 September standing
  deployment authorisation. Migration approval permits preparation; production
  release requires Eoin's “ship it” for the exact reviewed version.

## Shared Git and release workflow — 24 September 2026

### Build → independent review → “ship it” → merge → production verification

This loop applies to every PR and must be followed in fresh Claude and Codex
sessions. The repository and GitHub PR are the durable record; do not rely on
chat history, agent memory, or Eoin relaying messages between agents.

1. **Build:** Either Claude or Codex may build a change end-to-end, owning the
   task branch, implementation, checks, PR and exact review preview.
2. **Independent review:** The agent that did **not** build the change reviews
   the PR independently: Claude reviews Codex's work; Codex reviews Claude's.
   Check the diff, required checks, preview and release implications against
   the project contracts. Record the reviewed commit SHA and verdict on the PR.
3. **Resolve on GitHub:** Put review findings and comments directly on the
   GitHub PR. The builder reads them there, fixes them and replies there; Eoin
   does not need to relay findings between agents. Have the independent reviewer
   recheck affected work before presenting the final version for approval.
4. **Human gate:** Eoin's explicit **“ship it”** is required before merge or
   production release and approves only the exact reviewed version. Independent
   review, passing checks, migration approval and agent agreement do not replace
   this gate. Record approval and its exact version on the PR.
5. **Builder owns release:** After “ship it”, the builder owns the merge,
   production verification and rollback if required, following
   `RELEASE_PROTOCOL.md`. Verify the staged production artifact before promotion
   and the live domain afterward. If a verified regression requires rollback,
   restore and verify the recorded last-good production deployment. Record the
   merge commit, deployment identity, verification results and any rollback on
   the PR and in the repository's release record.

### Git and deployment rules

- One responsible agent per project task. Fetch first and inspect local work;
  never pull/reset over another agent's uncommitted changes. Create a task branch
  before claiming it in `WORKLOG.md`.
- Every change, including logs and documentation, goes through a branch and a
  reviewed merge. Never push directly to `main`.
- Build/check the canonical source, push the branch, verify the remote commit,
  and present the **project, full commit SHA and exact deployment URL**.
- “Ship it” approves that reviewed version and the agreed merge/release routine.
  Changed content, including conflict resolutions, needs a fresh preview and
  approval. Do not silently add edits to the approved version.
- Vercel builds from GitHub. No laptop source uploads after cutover. Local
  previews run from a fresh build of this checkout; hosted review previews must
  come from its pushed branch. CLI inspection and promotion remain supported.
- Tennis: verify automatic production-domain assignment is disabled and record
  the last-good deployment **before merging**. Merge approved content, then verify
  the Git-triggered staged **production**
  build while automatic domain assignment stays disabled, then promote that
  exact production deployment without rebuilding. Do not promote an ordinary
  preview as a substitute. Follow `RELEASE_PROTOCOL.md` and verify live.
- Handoff only after committing, pushing and verifying the remote SHA. Record
  the branch, commit, checks, preview, remaining work and next owner in WORKLOG.
  Either agent owns its assigned task end-to-end.
- Confidential configuration belongs only in the approved encrypted backup,
  never Git. Preserve raw assets through the agreed versioned backup.
- No deletion or Desktop-folder archiving until the separate reconciliation
  has been reviewed. A backup alone does not prove reconciliation.

## Release boundaries

- Preserve the approved 3D lesson catalogue, routing, analytics host restrictions,
  visual content and local progress semantics during this migration.
- Run the build parity check, analytics tests and browser checks in
  `RELEASE_PROTOCOL.md`; passing checks do not replace independent review.
- Never refresh migration fingerprints to hide differences from live.
- Never claim coaching validation or physical-device testing from browser checks.
- No source, evidence, credentials or lab experiments may appear in deployment.
- Do not move or retire the Desktop Blender/pose work without Eoin's separate go.
- No production promotion except the exact verified staged production artifact
  built from the content Eoin reviewed and approved.
