# iOS audio repair release — 26 October 2026

User report: sound remained silent on iPhone and iPad in Chrome after PR #33.
Implementation and diagnosis boundary: [iOS repair](ios-audio-repair.md).

## Identity and authorization

- Project gamesharp-tennis / prj_SHIw7K0JxhCtoQQgh1zVHlR3r2Pe.
- [PR #35](https://github.com/eoinoliver/gamesharp-tennis/pull/35).
- Reviewed e84c4ff1ae0e6e79357b1257808819b133b1da4b.
- Merged main 5e5c6aef3213233bcfa91aa1c75b03ac614258d4.
- Both Git trees: 0486c7926782eddded381ca63921dd637775eec6.
- Version a6403a2a21.
- Eoin's current full-autonomy and deploy-live instructions authorized this
  scoped beta repair; exact Git artifact and rollback safeguards were retained.

## Builds and promotion

Preview dpl_464mLwkNTrbKXtN3YDdfvv2VgEqe:
https://gamesharp-tennis-le3wcpovx-eoinlynn-5978s-projects.vercel.app

Git Production dpl_4AKS7YatmaePvodgydUJVxRuTAbx:
https://gamesharp-tennis-32svsci1b-eoinlynn-5978s-projects.vercel.app

Verified Production while READY/STAGED, then promoted that exact artifact without
rebuilding. Live alias verified to that deployment. Automatic custom-domain
assignment was false before merge and before promotion. Correct repository/main,
no root override, zero configured project env vars. Preview/staged effective
settings, runtime metadata, regions, Node version and 137 platform environment
key names matched. Platform target/URL/Git values vary by deployment; static
build source does not consume them, and full output hashes establish parity.
Both Resources inventories contained 96 static assets and no functions.

## Validation

- Exact build: 97 release files / 96 public outputs. All previous fingerprints
  remain frozen; ios-audio-build.json explicitly lists the changed hashes.
- 22 unit tests passed, covering activation, explicit opt-in, session ownership,
  interruption, rejection, unsupported API, storage failure, mute and background.
- Chromium and WebKit each passed 77 sensory/navigation assertions across 38
  lessons / 433 scenes, with nonzero/unclipped finite offline synth waveforms.
- Full local app flow, nine layouts, payoff/Pusher, all 38 scene gates and 325
  contact checks passed.
- [GitHub contracts 40293440859](https://github.com/eoinoliver/gamesharp-tennis/actions/runs/40293440859) passed.
- Hosted preview, staged and live: all 238 checks passed, including all public
  hashes, redirects, headers and private-file exclusions. Staged initially
  passed 230; eight SSO/CLI authentication transport failures passed on targeted
  retry at lower concurrency. Initial and retry reports retained locally.
- Manual preview and staged paths completed 3/3, cue save, next challenge and
  mute after reload. A native browser automation page stalled; reload and normal
  browser click controls recovered it and the complete path then passed.
- Live Chromium and WebKit each completed sound enable, 3/3, cue save, one-day
  streak, next challenge and mute persistence. WebKit asserted real playback
  session selection and release. Zero page errors; 12 production analytics
  requests intercepted per run. Live version a6403a2a21 in both.
- Immediate Vercel error-level log scan returned no entries; this is not a
  continuing client-side monitoring claim.

## Rollback and remaining uncertainty

Recorded last-good production (no rollback needed):
- dpl_6VqPxzYRBU1Ajnzsb6m1vzHTfNks
- https://gamesharp-tennis-jn72dq38m-eoinlynn-5978s-projects.vercel.app
- main d06c1ddd4991e9d40ac16579ca595dd894b7479c; version ff689b8dae.

Physical iPhone/iPad Chrome listening is still unverified. The repair addresses
a documented iOS ambient/silent-mode failure; API state and desktop WebKit cannot
certify device speaker output. User hearing the enable contact and lesson cues
is required before calling their report resolved. Older unsupported iOS routing
and volume/output-route issues remain outside the verified claim.
