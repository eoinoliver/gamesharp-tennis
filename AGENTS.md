# GameSharp Tennis — Mandatory Builder Contract

Read `PRODUCT_CONTRACT.md`, `CONTENT_CONTRACT.md`, and `RELEASE_PROTOCOL.md`
before changing this project. They are release requirements, not suggestions.

Also read the durable [project alignment and history](../gamesharp-tennis-alignment/PROJECT_ALIGNMENT.md)
at the start of a new task. It records the latest user decisions, superseded
approaches, dated implementation state and open defects. Recommendations in that
record are not additional user-approved scope. Recheck dated state before relying
on it; current user instructions take precedence.

## Canonical source

This directory is the only authorised source:

`/Users/eoinlynn/Downloads/gamesharp-tennis-integration`

Do not deploy a Desktop copy, a legacy file, `/tmp` preview copy, or an exported
HTML file. Do not copy older code into `index.html` without proving it meets the
current contracts.

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
  previews may run from this canonical directory; hosted review previews must
  come from its pushed branch. CLI inspection and promotion remain supported.
- Tennis: verify automatic production-domain assignment is disabled and record
  the last-good deployment **before merging**. Merge approved content, then verify
  the Git-triggered staged **production**
  build while automatic domain assignment stays disabled, then promote that
  exact production deployment without rebuilding. Do not promote an ordinary
  preview as a substitute. Follow `RELEASE_PROTOCOL.md` and verify live.
- Handoff only after committing, pushing and verifying the remote SHA. Record
  the branch, commit, checks, preview, remaining work and next owner in WORKLOG.
  Claude may publish via GitHub web; Codex handles larger pushes when needed.
- Confidential configuration belongs only in the approved encrypted backup,
  never Git. Preserve raw assets through the agreed versioned backup.
- No deletion or Desktop-folder archiving until the separate reconciliation
  has been reviewed. A backup alone does not prove reconciliation.

## Prohibited release behaviours

- No `null` continuation inside a launch-eligible Predict journey.
- No legacy animation fallback for launch-eligible content.
- No random question-to-animation pairing.
- No global UI enhancer may make an unapproved visual customer-visible.
- No silent fallback from missing content to a different tennis concept.
- No production promotion except the exact verified staged production artifact,
  built from the content Eoin reviewed and approved.
