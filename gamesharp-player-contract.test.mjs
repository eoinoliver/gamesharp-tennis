import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

// Default to the repo this test lives in. Pointing at a copy elsewhere means
// the gate validates an artifact we do not ship.
const root = process.argv[2] || path.dirname(fileURLToPath(import.meta.url));
const js = fs.readFileSync(`${root}/gamesharp-pain-coach.js`, 'utf8');
const css = fs.readFileSync(`${root}/gamesharp-pain-coach.css`, 'utf8');
const htmlPath = fs.existsSync(`${root}/gamesharp-tennis-index-working.html`)
  ? `${root}/gamesharp-tennis-index-working.html`
  : `${root}/index.html`;
const html = fs.readFileSync(htmlPath, 'utf8');

const requiredRegions = ['mindset', 'forehand', 'backhand', 'serve_return', 'net', 'movement', 'decisions'];
for (const id of requiredRegions) {
  assert.match(js, new RegExp(`(?:^|\\n)\\s*${id}:\\{`), `missing region: ${id}`);
}

assert.match(js, /const PLAYER_REGIONS=\{/, 'single player-region source is missing');
assert.match(js, /auditPlayerRegions\(\)/, 'player contract audit is not executed');
assert.match(js, /playerRegions:PLAYER_REGIONS/, 'runtime player contract is not exposed');
assert.match(js, /h\.x<0\|\|h\.x>100\|\|h\.y<0\|\|h\.y>100/, 'percentage coordinate validation is missing');
assert.match(js, /forehand navigation must remain outside the viewer-left silhouette/, 'front-facing forehand orientation contract is missing');
assert.match(js, /backhand navigation must remain outside the viewer-right silhouette/, 'front-facing backhand orientation contract is missing');
assert.match(js, /duplicate hotspot name/, 'unique hotspot accessibility-name contract is missing');
assert.match(js, /missing directional cue/, 'directional-line contract is missing');
assert.match(js, /mental game must remain above the head/, 'head-clearance contract is missing');
assert.match(js, /serve & return navigation must remain outside the ready-position hands/, 'hands-and-grip protection contract is missing');
assert.match(js, /net-play navigation must remain outside the forehand silhouette/, 'net-play silhouette contract is missing');
assert.match(js, /movement navigation must remain outside the hips and thighs/, 'movement silhouette contract is missing');
assert.match(js, /decision-making navigation must remain offset from the upper chest/, 'upper-chest protection contract is missing');
assert.match(js, /footwork cue must remain centred below the feet/, 'footwork cue contract is missing');
assert.match(js, /stroke-side labels must stack below their hotspots on narrow phones/, 'narrow-phone stroke-label contract is missing');
assert.match(js, /viewer-left labels require a clear vertical lane/, 'viewer-left label separation contract is missing');
assert.match(js, /viewer-right upper labels require a clear vertical lane/, 'viewer-right upper label separation contract is missing');
assert.match(js, /viewer-right lower labels require a clear vertical lane/, 'viewer-right lower label separation contract is missing');
assert.match(js, /if\(!reachable\.has\(id\)\)errors\.push\('unreachable route '/, 'route reachability validation is missing');
assert.match(js, /playerRegion:state\.playerRegion,playerIssue:state\.playerIssue/, 'player context is not persisted');
assert.match(js, /playerRegion:state\.playerRegion,playerIssue:state\.playerIssue,result:/, 'player context is not carried into recommended content');
assert.match(js, /state\.playerRegion=ctx\.playerRegion;state\.playerIssue=ctx\.playerIssue/, 'recommended-content return does not restore player context');
assert.match(js, /typeof File==='function'/, 'share-card fallback is not guarded for older devices');
assert.match(js, /classList\.add\('image-failed'\)/, 'failed player image has no fallback state');
assert.match(js, /e\.key==='Enter'\|\|e\.key===' '/, 'explicit keyboard activation is missing');
assert.match(js, /settleHotspotLabels/, 'responsive label-collision avoidance is missing');
assert.match(js, /--label-nudge-x/, 'label collision nudges are not applied');
assert.match(js, /gspc-hotspot-line/, 'directional cue markup is missing');
assert.match(js, /const directPlayer=source==='sharpen'/, 'Sharpen does not explicitly bypass stale draft and prescription state');
assert.match(js, /What do you want to sharpen\?/, 'Sharpen should use positive framing');
assert.match(js, /Start with what’s hurting your game most\./, 'Sharpen should pair positive direction with pain-based relevance');
assert.doesNotMatch(js, /<h1[^>]*>What[’']s hurting your game\?<\/h1>/i, 'Pain framing must not replace the positive headline');
assert.doesNotMatch(js, /mountSharpen|collapseSharpenDoors|updateSharpenEntry/, 'retired Sharpen lobby logic remains reachable');
assert.match(css, /left:var\(--x\);top:var\(--y\)/, 'hotspots are not percentage positioned');
assert.match(css, /--size:40px/, 'hotspots were not reduced by approximately 15–20%');
assert.match(css, /--hit-size:48px/, 'reduced visual hotspots do not retain an accessible touch target');
assert.match(css, /gspcPulse\{[^}]*translate\(-50%,-50%\)/, 'pulse animation can displace its centred marker');
assert.match(css, /--size:39px/, 'small-phone hotspot sizing is missing');
assert.match(css, /\.gspc-hotspot-line\{/, 'directional cue styling is missing');
assert.match(css, /--label-nudge-x:0px/, 'label collision variables are missing');
assert.match(css, /min-height:48px/, 'accessible touch target baseline is missing');
assert.match(css, /prefers-reduced-motion:reduce/, 'reduced motion is not respected');
assert.match(css, /gspc-hotspot\.dimmed/, 'unselected-region dimming is missing');
assert.match(css, /gspcFootworkShuttle/, 'intermittent footwork movement cue is missing');
assert.match(html, /gamesharp-pain-coach\.css/, 'working HTML is not linked to feature styles');
assert.match(html, /gamesharp-pain-coach\.js/, 'working HTML is not linked to feature logic');
assert.equal((html.match(/onclick="GameSharpPainCoach\.open\('sharpen'\)"/g) || []).length, 2, 'desktop and mobile Sharpen navigation must open the illustrated player directly');
// Explore tab (2026-06 restructure): the full library is now a primary destination — opened from both nav bars,
// with Player Profile living inside it. initLearnHub() is reachable from desktop nav, mobile nav, and the
// Profile-detail back button (← Explore); Profile no longer hosts a Browse Everything link.
assert.equal((html.match(/onclick="initLearnHub\(\)"/g) || []).length, 3, 'the library (Explore tab) must open from both nav bars and be the return target from Profile');
assert.match(html, /<span class="gs-nav-label">Explore<\/span>/, 'desktop nav is missing the Explore tab');
assert.match(html, /<span>Explore<\/span>/, 'mobile nav is missing the Explore tab');
assert.match(html, /<div class="hub-title">Browse Everything<\/div>/, 'Explore tab is missing the Browse Everything library');
assert.match(html, /state\.screen = 'profileLibrary';[\s\S]*?updateBottomNav\('profileScreen'\)/, 'Explore library does not retain its nav-highlight state');
assert.match(html, /class="hub-back" onclick="initHome\(\)">← Home/, 'Explore library back does not return Home');
assert.match(html, /class="hub-card" onclick="showProfileHub\(\)">/, 'Player Profile card is missing from the Explore library');
assert.match(html, /class="phub-back" onclick="initLearnHub\(\)">← Explore/, 'Profile does not return to the Explore library');
assert.doesNotMatch(html, /<div class="phub-section-title">Browse Everything<\/div>/, 'Profile must not still host a Browse Everything link (it is the Explore tab now)');
assert.doesNotMatch(css, /gspc-sharpen-entry|gspc-browse/, 'retired Sharpen lobby styling remains');
assert.ok(fs.existsSync(`${root}/GS-tennis-player-pose.png`), 'approved player asset is missing');

// ── Structural guards (2026-08) — lock the fixes for the persistent-nav era so the
// same bug-classes cannot silently return. Each maps to a real defect we hit. ──

// A) Overlay-superimposed-on-nav leak. The Pain Coach overlay is deliberately inset
// above the persistent tab bar (bottom:var(--gs-nav-h)) so the tabs stay tappable —
// which is exactly what lets a nav tap navigate underneath it. showScreen (the single
// navigation choke point) MUST dismiss transient overlays, and that dismissal MUST
// close the Pain Coach. If a future overlay adopts the same nav-exposing inset it must
// be added to dismissTransientOverlays, or this contract is a lie.
assert.match(css, /\.gspc-overlay\{[^}]*bottom:var\(--gs-nav-h/, 'Pain Coach overlay must inset above the persistent nav (bottom:var(--gs-nav-h))');
// Tight: the dismiss CALL must appear inside showScreen's body BEFORE the screen swap
// ([^{}] keeps us in the top level of the function, so a nearby definition can't satisfy it).
assert.match(html, /function showScreen\([^)]*\)\s*\{[^{}]{0,500}dismissTransientOverlays\(\);[^{}]{0,200}querySelectorAll\('\.screen'\)/, 'showScreen must call dismissTransientOverlays() before switching screens');
assert.match(html, /function dismissTransientOverlays\(\)\s*\{[\s\S]{0,320}GameSharpPainCoach\.close\(\)/, 'dismissTransientOverlays must call GameSharpPainCoach.close()');

// B) Content hidden behind the persistent nav. A shared nav-height variable must exist
// and the focused-flow bottom controls (the quiz Next button) must reserve it.
assert.match(html, /:root\{--gs-nav-h:calc\(68px \+ env\(safe-area-inset-bottom\)\)/, 'nav-height custom property (--gs-nav-h) must be defined');
// The bar's OWN box must be as tall as --gs-nav-h reserves. With box-sizing:border-box the
// safe-area padding lives INSIDE the height, so a bare height:68px makes the bar 68px total
// while the overlay reserves 68px+safe-area — opening a safe-area-sized gap on notched phones
// through which the fixed home court background shows. Height must include the same safe-area.
assert.match(html, /\.gs-bottom-nav\{[^}]*height:calc\(68px \+ env\(safe-area-inset-bottom\)\)/, 'bottom nav height must include the safe-area inset so it matches --gs-nav-h (border-box), or home content shows through the gap above it');
assert.match(html, /\.next-btn\.show\{bottom:calc\(8px \+ var\(--gs-nav-h\)\)/, 'sticky Next button must clear the nav while scrolling');
assert.match(html, /\.next-btn\{[^}]*margin:8px 20px calc\(12px \+ var\(--gs-nav-h\)\)/, 'Next button rest position must clear the nav');

// C) The tab bar is persistent on every page — updateBottomNav must never re-hide it.
assert.doesNotMatch(html, /function updateBottomNav[\s\S]{0,300}nav\.style\.display\s*=\s*'none'/, 'updateBottomNav must not hide the persistent tab bar');

// D) Brand casing. Every user-visible brand token is all-caps GAMESHARP; only code
// identifiers (GameSharpPainCoach, GameSharpFocusView) and asset filenames
// (…-Tennis-Insight) keep the camel-case form, so each must be followed by a letter/-.
assert.doesNotMatch(html, /GameSharp(?![A-Za-z-])/, 'brand must be all-caps GAMESHARP everywhere it is user-visible');

// E) Focus View must FLATTEN tactical courts (2026-08). The Read-the-Game consequence court
// (.seq-court-wrap) and the legend court (.leg-anim-wrap) bake a bottom-pinned rotateX camera
// tilt for the in-flow card. When expanded to Focus View that tilt strands the court at the
// bottom with a tall empty green panel above (the dead-space bug). Focus View must reset their
// SVG to fill the frame flat, and its aspect logic must cover them — or the void returns.
assert.match(html, /\.gs-focus-stage>\.seq-court-wrap>svg[\s\S]{0,360}transform:none!important/, 'Focus View must flatten the Read-the-Game (.seq-court-wrap) court SVG — no camera tilt / dead space');
assert.match(html, /\.gs-focus-stage>\.leg-anim-wrap>svg[\s\S]{0,360}transform:none!important/, 'Focus View must flatten the legend (.leg-anim-wrap) court SVG — no camera tilt / dead space');
assert.match(html, /el\.matches\('\.ta-court-wrap,\.seq-court-wrap,\.leg-anim-wrap'\)/, 'Focus View aspect logic must size seq/leg courts to their SVG viewBox (no dead space)');

console.log('GameSharp player structural contract: PASS');
