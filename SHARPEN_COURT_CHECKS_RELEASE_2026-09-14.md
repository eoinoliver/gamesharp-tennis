# Sharpen court-check public beta — 14 September 2026

## Authorisation and scope

The user explicitly requested **“deploy all”** after the four-path local review
and notice that independent coach review remained pending. This supersedes the
local-only release restriction for these four checks, not their evidence limits.
It is product-owner approval to publish a source-informed beta, not coach sign-off.

Normal Sharpen navigation now exposes:

- Forehand → My forehand keeps missing.
- Serve & Return → Fast serves rush my return.
- Mental Game → One miss leads to another.
- Net Play → My first volley is always difficult.

No query flag is required. A frozen explicit four-ID release list is separate
from the definition inventory; missing/invalid release metadata or exact content
dependencies withhold the check. Future definitions cannot become public simply
by being added. All four remain `coachApproved:false`, `coachReview:pending`.

The source-informed beta disclosures, uncertain/nonmatching exits, neutral
readings, costs, first-report immutability and explicit court-trial semantics
are retained. No storage schema, key, saved record, Daily credit or history was
migrated. No lesson, animation, calendar, Predict or Playbook content changed.

## Candidate and evidence

Canonical source: `/Users/eoinlynn/Downloads/gamesharp-tennis-integration`.
Local versions: Sharpen `2026-09-14.sharpen-beta.4`, court registry
`2026-09-14.court-checks.2`, spine `.17`, Gold loader 65, Sharpen loader beta-4.
The manifest separately records explicit user release approval and pending coach
review. Historical local-only reports remain historical, not silently rewritten.

The previous four-path review passed 201 automated tests and 52 browser groups;
its protocol/evidence details remain in `SHARPEN_COURT_CHECKS_REVIEW_2026-09-14.md`.
This release additionally tests unflagged/public default availability, exact
four-of-21 routing, release metadata failure, preserved data, native handoffs and
the deployed public artifact. Final run results and deployment details follow.

Inventory stays at 21 Daily lessons, 19 Sharpen concerns across seven areas using
17 lessons, nine eligible Predict journeys, eleven withheld Predict IDs, eight
Playbook patterns and four exact Daily/Predict links. The old broad diagnostic
bank and other quarantined prototypes are not promoted by “all”.

## Remaining limits

No independent coaching validation, measured player comprehension/retention,
on-court effectiveness or physical iPhone/Safari/touch/VoiceOver/audio-device
verification is claimed. Passing code and browser tests does not supply those
forms of evidence. Court reports are self-reports, not diagnoses or mastery.

## Deployment

### Deploy result

- URL: https://www.gamesharptennis.com
- Target: production
- Status: READY, publicly verified
- Deployment: `dpl_Dtn4S34xucp8HSM6PKV9fUdEbLwk`
- Unique URL: https://gamesharp-tennis-l4x7g03b6-eoinlynn-5978s-projects.vercel.app
- Commit: none; canonical directory is not a Git repository
- Framework: static HTML/JavaScript with existing share API
- Build duration: 363ms

Existing Vercel login and project link worked. No fresh login, hosting migration
or new expenditure was required. Previous production deployment retained for
rollback: `dpl_9ByWdWu2k23SDNYSsEqFG8nrRBhD`.

### Final verification

- **203/203 automated tests pass**, none skipped, including 16 targeted runtime
  integration tests and explicit release/manifest consistency checks.
- **26/26 fresh local browser groups pass**, including all four full journeys at
  430px and 1280px, 320px enlarged text/keyboard, exact unflagged four-of-21 routing,
  invalid release metadata, missing dependencies, native return and state checks.
- **18/18 connected journeys pass**: all nine eligible Predict IDs at 320×844
  and 430×844 through both Live Point branches, Focus and exact Playbook handoff.
- **5/5 public browser groups pass**: all four complete 430px journeys on the
  unflagged canonical domain plus exact inventory. Explicit reports, immutable
  results, read-only instructions, back/reopen/reload and Daily isolation pass.
- All **24 public runtime/homepage/manifest files** return 200 and match the frozen
  approved files byte-for-byte. Homepage cache policy remains
  `public, max-age=0, must-revalidate`. Local runtime files are unchanged after upload.
- Trust audit passes with the known unchanged quarantined-bank length warning;
  connected structural audit reports nine journeys and zero failures.

Evidence in the system temporary directory: local `gs-court-check-rjgUlo`,
`gs-forehand-check-T0EKOw`, `gs-court-check-oNG2xc`; connected
`gs-connected-review-fEwb1i`; public `gs-court-check-PCv7AB` and
`gs-forehand-check-X5Bde0`. Screenshots inspected, disposable browsers closed.
The approved runtime snapshot is `/private/tmp/gs-court-approved-release-DFXedu`.
Temporary evidence can be purged by the OS. This post-deploy record is local;
no application or manifest file was modified after the verified upload.

### Post-deploy observability

- Browser runtime errors: none in the tested public journeys.
- Vercel error-level scan for this deployment over the last hour: no logs found.
  This is a bounded query result, not proof of complete logging coverage.
- Drains and continuous monitoring: not newly configured or assessed.
