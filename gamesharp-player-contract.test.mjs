import fs from 'node:fs';
import assert from 'node:assert/strict';

const root = process.argv[2] || '/Users/eoinlynn/Downloads';
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
assert.equal((html.match(/onclick="initLearnHub\(\)"/g) || []).length, 1, 'the full library must be reachable only from Profile');
assert.match(html, /<div class="phub-section-title">Browse Everything<\/div>/, 'Profile is missing Browse Everything');
assert.match(html, /state\.screen = 'profileLibrary';[\s\S]*?updateBottomNav\('profileScreen'\)/, 'Profile library does not retain Profile navigation state');
assert.match(html, /class="hub-back" onclick="showProfileHub\(\)">← Profile/, 'Profile library does not return to Profile');
assert.doesNotMatch(css, /gspc-sharpen-entry|gspc-browse/, 'retired Sharpen lobby styling remains');
assert.ok(fs.existsSync(`${root}/GS-tennis-player-pose.png`), 'approved player asset is missing');

console.log('GameSharp player structural contract: PASS');
