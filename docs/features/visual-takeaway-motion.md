# Brief motion in two visual takeaways

This extends PR87's authored static summaries. The first two eligible lessons
are `short-ball` (height) and `recovery` (court position). The other 30 Daily
summaries and all 31 non-Daily endings retain their existing presentation.

The diagrams play one 2.6-second sequence when at least 85% of their pair enters
the usable viewport. The low-contact ball path precedes the higher-contact path;
the two recovery examples likewise move in sequence. Text does not animate.
No sound, control, repeat timer or storage write is added. Fonts finish loading
before movement begins. The existing lesson completion flow mounts the same
controller as completed Home.

Recovery now rests with the solid player dot at the recovery destination and a
hollow marker at the starting position. This prevents an apparent jump backwards
when the sequence ends. The final geometry is also the reduced-motion/no-observer
fallback. Ball-path overlays are removed at settlement, leaving the full original
static comparison.

The controller remembers completed playback within the current page visit.
Scrolling back or repainting Home does not restart it; a new page visit can play
once again. Scrolling entirely away, backgrounding, page exit, or switching on
reduced motion settles the figure and cancels its animation frame. A summary
that has not been seen waits until visible. Reduced-motion users see the finished
static diagrams immediately. Missing IntersectionObserver retains static content.

`tools/takeaway-motion-browser.mjs` exercises visible sequencing, duration,
stationary text, final player positions, no practice-history writes, offscreen
entry/exit, remount, preference changes, visibility, reduced-motion and observer
fallback, exact eligibility, and actual three-answer completions in Chromium and
WebKit. Existing static-takeaway and Daily/Home checks remain in CI. Phone-width
browser checks are not physical-iPhone testing or evidence of improved learning.

No teaching text, source lesson hashes, scene, audio, Singles/Doubles navigation,
Daily schedule or user progress contract changes. The motion build overlay
extends the frozen static-summary fingerprints without rewriting them.
