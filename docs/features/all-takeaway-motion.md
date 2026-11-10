# Purposeful motion in every Daily takeaway

This extends the reviewed static summaries and the first two motion examples in
PR87 to all 32 Daily summaries, with an authored motion on each of their 64
panels. The same figure appears on completed Home and at lesson completion.
The 31 non-Daily activities do not acquire a generic or substituted summary.

Motion follows the visual teaching already present: a shot traces its path;
approach/recovery follows the shot where appropriate; a player moves to the
chosen starting position; spacing or contact receives a short outline emphasis;
feet rise or land for split-step timing; a directional cue or eye outline draws
attention to arriving and looking up. Rackets do not acquire invented swings.
Moving players finish at the destination, with a hollow starting marker. The
higher-contact schematic path has a little more clearance over the drawn net.

Each pair plays once in a 2.6-second sequence, left then right. Text stays still.
The existing visible-entry, font-ready, offscreen, page visibility and reduced-
motion handling is retained. All temporary SVG overlays and transforms are
removed on settlement or interruption. Missing browser observation support
leaves the complete static takeaway. There is no repeat loop, sound or new
progress write. These are schematic recall aids, not measured trajectories.

Each panel declares a compatible motion in `takeaways.json`; the builder rejects
missing or incompatible declarations. Existing source lesson hashes still guard
against teaching changes that have not been reviewed. Coaching text, scenes,
voices, saved progress, Daily scheduling and navigation remain unchanged.

The browser motion suite checks all 32 summaries at phone width, all seven visual
formats at small-phone and desktop widths, and every summary with reduced motion.
It checks actual moving SVG geometry, order, duration, text stability, settled
positions, cleanup, remount and history. Representative real lesson completions
verify the completion surface, coaching and Home navigation. Both Chromium and
WebKit run locally; CI and the exact Git preview receive the browser suite too.

Visual review covers all 32 summaries at both panel phases and the final frame.
Local, high-resolution four-and-a-half-second clips let Eoin review every summary
without Vercel access. This is browser validation and visual review, not physical-
iPhone testing, independent coach certification or evidence of learning efficacy.

The new explicit build overlay extends the frozen two-example fingerprints;
previous review artifacts and manifests remain unchanged. Production release is
separate from this implementation and review scope.
