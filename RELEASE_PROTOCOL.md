# GameSharp Tennis — Release Protocol

## Source and preview

- Canonical source: `/Users/eoinlynn/Downloads/gamesharp-tennis-integration`.
- Local previews run directly from this directory. Hosted previews build from
  its pushed GitHub task branch; identify the exact commit and deployment URL.
- Production may receive only approved content in a verified staged production
  artifact. The ordinary preview build and production build are distinct.
- `Legacy Versions/`, prototype HTML files and other working copies are never
  deployment sources.

## Required release evidence

Before presenting a candidate as ready:

1. Run every structural contract test and the trust audit.
2. Validate `LAUNCH_MANIFEST.json`; every surfaced item must be approved and
   every approved journey must have complete destinations.
3. Personally complete every launch-eligible Predict journey through Live Point
   and its Playbook destination on representative small and large mobile views.
4. Inspect every eligible animation in card and Focus View.
5. Run a desktop coherence pass for overflow, geometry, navigation and readable
   hierarchy.
6. Check refresh, repeat play, back navigation, reduced motion, sound off/on and
   failed optional media.
7. Re-test after the final correction.

## Reporting

Report:

- exact eligible journey count;
- exact withheld item count and reasons;
- viewports and complete paths tested;
- known limitations;
- preview path or URL;
- accurate production status: unchanged, deployment pending, or deployed and verified.

Do not use “complete,” “all good” or “production ready” without this evidence.

## Deployment

The settled 24 September workflow in `AGENTS.md` supersedes the earlier standing
deployment permission. Eoin's “ship it” approves the named reviewed version and
this release routine. Migration approval alone does not approve production.

1. Fetch and inspect local changes, create a task branch, then claim WORKLOG.
   Push the branch, verify the remote SHA, inspect its Git-triggered preview and
   present project, full commit SHA and exact deployment URL for review.
2. **Before merging**, confirm Vercel project `gamesharp-tennis` still builds
   GitHub `eoinoliver/gamesharp-tennis`, production branch `main`, with
   **Auto-assign Custom Production Domains disabled**. Record the current live
   deployment and verify the last-good rollback target is available. Stop before
   merging if any of these checks fail.
3. After “ship it”, merge the approved branch through GitHub. Never push directly
   to `main`. Confirm the merge has the reviewed content; conflict resolution or
   any changed content requires a fresh preview and approval.
4. Wait for the merge's Git-triggered **production** build to become Ready/Staged.
   Verify its exact Git SHA, reviewed runtime bytes, share function, retired and
   private-source route exclusions, and the required journeys on its unique URL.
   Use the production environment, not a preview promoted with a rebuild.
5. Promote that same verified staged production deployment, without rebuilding.
   Verify the custom domain's release token, runtime hashes, route exclusions and
   at least one complete live path. Record commit, deployment ID and checks.
6. Add completion evidence through a follow-up log branch. Do not promote a new
   build merely because documentation was merged; record main/live differences.

After cutover, all Vercel source builds come from GitHub; no laptop source uploads.
The existing authenticated CLI may inspect or promote deployments. Do not ask for
a fresh login unless authentication fails. Before cutover, the existing approved
stage–verify–promote route remains available if separately needed.

Run the court-check verifiers against an explicitly confirmed Tennis deployment:
`GS_REVIEW_ORIGIN=https://<exact-tennis-deployment-host> node tools/court-check-browser.mjs https://<exact-tennis-deployment-host>/`
and equivalently `tools/forehand-check-browser.mjs`. This only permits the test
target; it never releases review-only lessons on remote hosts.

Keep `TRUST_REPAIR_EVIDENCE.json` fingerprints intact unless the actual changed
dependency has received a documented scoped re-review. Never refresh hashes to
force a pass. During this migration the runtime remains
byte-identical. The one reviewed `.github/` exclusion addition is recorded in
`configurationReviews`; verify it and all existing exclusions on the Git deployment.

## Rollback

Record the last verified production deployment before every release. Before
promotion, a failed staged check means stop and leave the current production
deployment serving. No rollback or domain reassignment is needed at that point.

If the approved release causes a verified regression after promotion, restore
the recorded last-good **production** deployment using Vercel Instant Rollback
or `vercel rollback <recorded-production-url-or-id>`, then verify the custom domain
and one complete path. Report the reason and the actual restored deployment.
Do not rebuild the older GitHub main or push a history rewrite as a rollback.

Migration baseline: `dpl_EBEYezrjLafgyLZcF2RC1JSHK2Px`,
`https://gamesharp-tennis-rm1ho12zo-eoinlynn-5978s-projects.vercel.app`,
release `2026-09-21-trust-repair-5`. Recheck availability/current live identity
at cutover; this dated baseline is not permission to replace unrelated releases.

Use reusable scripts for repetitive checks, compact pass/fail output and targeted
screenshots. Human inspection of tennis meaning remains necessary. A failed
check must be resolved or explicitly withheld before shipping the affected path.
