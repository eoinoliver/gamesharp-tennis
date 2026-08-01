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
assert.match(js, /forehand must sit on viewer-left for a front-facing right-hander/, 'front-facing forehand orientation contract is missing');
assert.match(js, /backhand must sit on viewer-right for a front-facing right-hander/, 'front-facing backhand orientation contract is missing');
assert.match(js, /duplicate hotspot name/, 'unique hotspot accessibility-name contract is missing');
assert.match(js, /footwork must have a distinct accessible moving cue between the feet/, 'footwork cue contract is missing');
assert.match(js, /stroke-side labels must stack below their hotspots on narrow phones/, 'narrow-phone stroke-label contract is missing');
assert.match(js, /serve label zone must remain clear of forehand/, 'forehand/serve vertical separation contract is missing');
assert.match(js, /net-play label zone must remain clear of backhand/, 'backhand/net-play vertical separation contract is missing');
assert.match(js, /if\(!reachable\.has\(id\)\)errors\.push\('unreachable route '/, 'route reachability validation is missing');
assert.match(js, /playerRegion:state\.playerRegion,playerIssue:state\.playerIssue/, 'player context is not persisted');
assert.match(js, /playerRegion:state\.playerRegion,playerIssue:state\.playerIssue,result:/, 'player context is not carried into recommended content');
assert.match(js, /state\.playerRegion=ctx\.playerRegion;state\.playerIssue=ctx\.playerIssue/, 'recommended-content return does not restore player context');
assert.match(js, /typeof File==='function'/, 'share-card fallback is not guarded for older devices');
assert.match(js, /classList\.add\('image-failed'\)/, 'failed player image has no fallback state');
assert.match(js, /e\.key==='Enter'\|\|e\.key===' '/, 'explicit keyboard activation is missing');
assert.match(css, /left:var\(--x\);top:var\(--y\)/, 'hotspots are not percentage positioned');
assert.match(css, /min-height:48px/, 'accessible touch target baseline is missing');
assert.match(css, /prefers-reduced-motion:reduce/, 'reduced motion is not respected');
assert.match(css, /gspc-hotspot\.dimmed/, 'unselected-region dimming is missing');
assert.match(css, /gspcFootworkShuttle/, 'intermittent footwork movement cue is missing');
assert.match(html, /gamesharp-pain-coach\.css/, 'working HTML is not linked to feature styles');
assert.match(html, /gamesharp-pain-coach\.js/, 'working HTML is not linked to feature logic');
assert.ok(fs.existsSync(`${root}/GS-tennis-player-pose.png`), 'approved player asset is missing');

console.log('GameSharp player structural contract: PASS');
