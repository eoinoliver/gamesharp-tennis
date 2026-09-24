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
- Tennis: merge approved content, verify the Git-triggered staged **production**
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
