# GameSharp Tennis — Git build and release protocol

## Build and review

The canonical repo is `eoinoliver/gamesharp-tennis`; production branch is `main`.
Use a task branch and `WORKLOG.md` claim. Fetch and inspect other local work first.
No direct main pushes. Read `AGENTS.md` for the independent-agent review loop.

Prerequisites: Node 24, Python 3.12, `npm ci`, then
`npx playwright install chromium` (CI uses `--with-deps`). The inspection,
promotion and rollback CLI is pinned: `npx --yes vercel@59.16.0`. An authenticated
installation of that exact version may also be used; the npm cache is not a
required dependency. Never commit auth configuration or private credentials.

1. `npm run check:build` rebuilds from source and proves all 81 release files
   match the recorded live-source artifact and all imported inputs remain intact.
   Migration fingerprints are frozen; future approved feature work must replace
   this migration baseline through an explicitly reviewed test update.
2. `npm test` checks production/preview analytics boundaries and progress events.
3. Serve `app/` locally: `python3 -m http.server 8765 --directory app`.
   Run `npm run test:browser -- http://127.0.0.1:8765/` for app flow, layout,
   payoff, Pusher and every registered lesson's scene gate. Local screenshots/logs
   are ignored evidence, not source. Inspect Home, lesson and Sharpen on mobile
   and desktop, including image load, sound and reduced motion.
4. Push the branch. GitHub `contracts` and Vercel checks must pass. Git builds
   execute `python3 tools/build-hosted.py` and serve only the 80 public files in `app/`; the hosted builder removes `app/vercel.json`
   and root `vercel.json`
   copies the live redirects/headers with build-only settings added.
5. Map the exact full Git SHA to its unique Git Preview URL. Run
   `python3 tools/verify-migration-host.py <URL> --manifest docs/migration/live-app-sha256.json --report <local-report.json> --deployment-id <exact-preview-id>`.
   For protected previews append `--authenticated` and set `GS_VERCEL_CLI` to
   the authenticated pinned CLI entry point. The verifier records raw hashes and permits only the exact Vercel Feedback
   suffix for that deployment ID on Preview HTML. Inspect the Preview's routing,
   assets and complete user paths; do not describe a hash manifest as proof of
   browser or coaching correctness.
6. The other agent independently reviews the PR and records commit/verdict and
   findings there. The builder resolves and replies there. Present the exact
   candidate to Eoin; **“ship it” is required before merge and production release**.

## Cutover after “ship it”

1. Before merge, verify PR head still equals the reviewed SHA, required checks
   pass, Vercel project is `gamesharp-tennis` / `prj_SHIw7K0JxhCtoQQgh1zVHlR3r2Pe`,
   Git repo is `eoinoliver/gamesharp-tennis`, branch is `main`, root directory has
   no conflicting override, and **Auto-assign Custom Production Domains is off**.
   Recheck live deployment identity and availability of the exact rollback target.
   Changed live baseline, source or settings require reconciliation before merge.
2. Merge through GitHub. Record that the merge Git tree equals the reviewed tree.
   Content changes/conflict resolutions need a fresh preview, review and approval.
3. Identify the Git-triggered **Production** deployment by exact merge SHA and
   wait for Ready/Staged. Keep custom-domain assignment disabled.
4. Verify the staged production artifact's entire public file manifest, redirects,
   headers, exclusions and required user paths. Compare Preview and Production
   output inventory, effective routing/runtime settings and build/runtime inputs.
   Record explained differences and unavailable proof; current settings and
   sampled HTTP responses are not complete deployment-inventory proof.
   This release is static: unexpected serverless functions are a failure.
5. Unexplained differences, incomplete inventories or unverifiable inputs stop
   automatic promotion. Resolve them or present the exact staged Production URL
   and limitations for Eoin's explicit approval of that artifact. Preview approval
   alone does not waive a gap; direct artifact approval is a different release
   basis, not proof of equivalence, and cannot excuse failed release checks.
6. Promote that exact verified/approved staged Production deployment without
   rebuilding. Do not use ordinary Preview promotion as a substitute. Verify
   `www.gamesharptennis.com`, apex redirect, catalogue version, asset hashes,
   routes and a complete live path. Intercept test analytics in live browser QA.
7. The builder records merge SHA, deployment ID, checks and production status on
   the PR and through a follow-up log branch. Documentation-only builds are not
   automatically promoted. After cutover, production source uploads from the
   private lab or any laptop are prohibited; main supplies Git builds only.

## Rollback

Before promotion, failed staged verification means stop and leave live serving.
After promotion, a verified regression requires the builder to restore the
recorded last-good **Production** deployment using Instant Rollback or pinned
`vercel rollback <recorded-production-id-or-url>`, then verify the custom domain,
asset identity and a complete path. Report reason and restored deployment on PR.
Do not rebuild old source or rewrite Git history as a rollback.

Baseline on 5 October: `dpl_EjCtSiEP2ufRa4npUoQBbssJ16Cj`,
https://gamesharp-tennis-gzlepvjdl-eoinlynn-5978s-projects.vercel.app,
version `e5cb1a5c10`. Recheck it before cutover. The earlier September 2D deployment
is historical and must not be used as this migration's rollback target.
