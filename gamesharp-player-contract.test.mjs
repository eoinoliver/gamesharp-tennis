import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { createRequire } from 'node:module';

// Default to the repo this test lives in. Pointing at a copy elsewhere means
// the gate validates an artifact we do not ship.
const root = process.argv[2] || path.dirname(fileURLToPath(import.meta.url));
const js = fs.readFileSync(`${root}/gamesharp-pain-coach.js`, 'utf8');
const css = fs.readFileSync(`${root}/gamesharp-pain-coach.css`, 'utf8');
const htmlPath = `${root}/index.html`;
const html = fs.readFileSync(htmlPath, 'utf8');
const require = createRequire(import.meta.url);
const player = require(path.resolve(root,'gamesharp-pain-coach.js'));
const paths = require(path.resolve(root,'gamesharp-sharpen-paths.js'));
const gold = require(path.resolve(root,'gold-daily-prototypes.js'));
const spines = require(path.resolve(root,'gold-daily-lesson-spines.js'));

const requiredRegions = ['mindset', 'forehand', 'backhand', 'serve_return', 'net', 'movement', 'decisions'];
for (const id of requiredRegions) {
  assert.ok(player.playerRegions[id], `missing region: ${id}`);
}
assert.deepEqual(Object.keys(player.playerRegions).sort(),requiredRegions.slice().sort(),'player has an unexpected duplicate or substitute area');
assert.equal(typeof player.auditPlayerRegions,'function','geometry audit is not exposed');
assert.deepEqual(player.auditPlayerRegions(),[],'the actual player-region geometry fails its audit');

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
assert.match(js, /movement must have exactly one hotspot/, 'duplicate Movement hotspot guard is missing');
assert.match(js, /decision-making navigation must remain offset from the upper chest/, 'upper-chest protection contract is missing');
assert.match(js, /movement hotspot must shuttle visibly between the stance anchors/, 'moving Movement cue contract is missing');
assert.match(js, /stroke-side labels must stack below their hotspots on narrow phones/, 'narrow-phone stroke-label contract is missing');
assert.match(js, /viewer-left labels require a clear vertical lane/, 'viewer-left label separation contract is missing');
assert.match(js, /viewer-right upper labels require a clear vertical lane/, 'viewer-right upper label separation contract is missing');
assert.doesNotMatch(js, /viewer-right lower labels require a clear vertical lane/, 'retired side-mounted Movement lane contract remains');
assert.equal(paths.audit(gold,spines).ok,true,'concerns must bind exact approved lessons and canonical cues');
for(const region of requiredRegions){
  const local=paths.paths.filter(p=>p.region===region);
  assert.ok(local.length>=2&&local.length<=3,`${region}: require 2–3 supported concerns, not a catalogue or a dead end`);
  assert.equal(new Set(local.map(p=>p.lessonId)).size,local.length,`${region}: duplicate lesson destinations`);
  assert.ok(local.every(p=>p.previewStep===0),'concern previews must use the canonical first scene');
}
assert.doesNotMatch(js,/\b(?:QBANK|ASSETS|ROUTES|startQuiz|startLinkedSequence|openFixAShot|launchRecommendedContent|classifyUnknown)\b/,'new Sharpen must not revive the old bank, diagnosis funnel or substitute route engine');
assert.match(js,/engine\.openPractice\(id,\{/,'Sharpen must enter the engine-owned exact-ID practice API');
assert.match(js,/const origin=\{\.\.\.state\}/,'practice must capture the complete navigation origin');
assert.match(js,/result\.lessonId===id&&result\.completed/,'only exact completed practice may mark Seen');
assert.match(js,/<button\b[^>]*class="gspc-hotspot/,'hotspots must be native keyboard-operable buttons');
assert.match(js,/<button type="button" class="gspc-situation" data-path=/,'concerns must be native buttons, not clickable wrappers');
assert.match(js,/querySelectorAll\('\[data-player-region\]'\)[\s\S]{0,150}addEventListener\('click'/,'native hotspot activation must dispatch its own exact region');
assert.match(js,/e\.key==='Escape'[\s\S]{0,70}close\(\)/,'the modal must retain Escape dismissal');
assert.match(js,/e\.shiftKey&&document\.activeElement===first[\s\S]{0,160}document\.activeElement===last/,'the modal must retain both directions of keyboard focus containment');
assert.match(js,/navigator\.share\(\{title:'GAMESHARP · My court cue',text\}\)/,'text sharing must use the canonical court-cue text');
assert.match(js,/navigator\.clipboard\.writeText\(text\)/,'text sharing needs a guarded clipboard fallback');
assert.doesNotMatch(js,/new File\(|createElement\('canvas'\)|loadFocusFigure|buildFocusCard/,'the removed share-image generator must not remain in the new runtime');
assert.match(js, /classList\.add\('image-failed'\)/, 'failed player image has no fallback state');
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
assert.equal(player.playerRegions.movement.hotspots.length,1,'Movement must never expose a second hotspot');
const movement=player.playerRegions.movement.hotspots[0];
assert.deepEqual([movement.x,movement.y,movement.displayLabel,movement.motion],[50,88,'Movement','footwork'],'Movement must have one moving hotspot between the feet');
assert.ok(movement.ariaLabel,'Movement must retain an explicit accessible name');
const saveFocusBody=(js.match(/function saveFocus\(\)\{([^\n]*)\}/)||[])[1]||'';
assert.ok(saveFocusBody, 'saveFocus handler is missing');
assert.doesNotMatch(saveFocusBody,/\b(?:close|goHome|initHome|showScreen)\s*\(/,'saving a focus must never navigate away');
assert.match(saveFocusBody,/Saved for next session/,'saving a focus needs an in-place confirmation');
assert.match(html, /gamesharp-pain-coach\.css/, 'working HTML is not linked to feature styles');
assert.match(html, /gamesharp-pain-coach\.js/, 'working HTML is not linked to feature logic');
for(const dependency of ['gamesharp-sharpen-paths.js','gamesharp-sharpen-state.js']){
  const position=html.indexOf('src="'+dependency+'?v=20260914-sharpen-beta-4"');
  assert.ok(position>=0&&position<html.indexOf('src="gamesharp-pain-coach.js?v=20260914-sharpen-beta-4"'),`${dependency} must load before the new Sharpen runtime`);
}
assert.ok(html.indexOf('href="gamesharp-sharpen-beta.css?v=20260914-sharpen-beta-4"')>html.indexOf('href="gamesharp-pain-coach.css?v=20260914-sharpen-beta-4"'),'beta styles must follow the retained player geometry stylesheet');
assert.match(html,/20260921-gold-daily-67/,'Sharpen must load the Gold practice/preview bridge and bound experiment spine release');
for(const dependency of ['gamesharp-court-checks.js','gamesharp-court-check-state.js']){
  const position=html.indexOf('src="'+dependency+'?v=20260921-court-checks-3"');
  assert.ok(position>=0&&position<html.indexOf('src="gamesharp-pain-coach.js?v=20260914-sharpen-beta-4"'),'shared check dependencies are present and precede their host');
}
assert.equal((html.match(/onclick="GameSharpPainCoach\.open\('sharpen'\)"/g) || []).length, 2, 'desktop and mobile Sharpen navigation must open the illustrated player directly');
// Explore remains a primary destination from both nav bars, but the recovery
// release exposes only manually bounded learning surfaces. The broad question
// bank stays quarantined until it has the same end-to-end review as the launch spine.
assert.equal((html.match(/class="gs-(?:nav-item|bnav-item)" onclick="initLearnHub\(\)"/g) || []).length, 2, 'the library (Explore tab) must open from both nav bars');
assert.match(html, /<span class="gs-nav-label">Explore<\/span>/, 'desktop nav is missing the Explore tab');
assert.match(html, /<span>Explore<\/span>/, 'mobile nav is missing the Explore tab');
assert.match(html, /<div class="hub-title">Explore GAMESHARP<\/div>/, 'Explore tab is missing its curated library');
assert.doesNotMatch(html, /<div class="hub-section-title">The 5 Pillars<\/div>/, 'Explore exposes the unreviewed five-pillar question bank');
assert.match(html, /The Playbook and your learning trail\. Sourced insights live inside each Daily lesson\./, 'Explore does not explain its bounded launch scope');
assert.match(html, /state\.screen = 'profileLibrary';[\s\S]*?updateBottomNav\('profileScreen'\)/, 'Explore library does not retain its nav-highlight state');
assert.match(html, /class="hub-back" onclick="initHome\(\)">← Home/, 'Explore library back does not return Home');
assert.match(html, /class="hub-card" onclick="showProfileHub\('explore'\)">/, 'Player Profile card is missing from the Explore library');
assert.match(html, /resolvedOrigin==='explore'\?'initLearnHub\(\)'\:'initHome\(\)'/, 'Profile does not preserve its true entry origin');
assert.doesNotMatch(html, /<div class="phub-section-title">Browse Everything<\/div>/, 'Profile must not duplicate the curated Explore destination');
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
assert.match(html, /#quizScreen\.quiz-answered \.next-btn\.show\{[^}]*position:relative;[^}]*margin-bottom:calc\(18px \+ var\(--gs-nav-h\)\)/, 'answered-flow Next button must remain in document flow and clear the nav');
assert.match(html, /#quizScreen \.next-btn\{[^}]*margin:8px 20px calc\(12px \+ var\(--gs-nav-h\)\)/, 'Next button rest position must clear the nav');

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
// The court frame (#seqCourtWrap = .ta-court-wrap) is a Focus target on EVERY Read-the-Game
// step, but on read/text steps it is EMPTY — expanding it opened an empty green panel. Both
// the trigger (enhance) and the opener (openFocus) must skip a court wrapper that holds no SVG.
assert.equal((html.match(/\.matches\('\.ta-court-wrap,\.seq-court-wrap,\.leg-anim-wrap'\)&&!el\.querySelector\('svg'\)\)return/g) || []).length, 2, 'Focus View must skip EMPTY court frames in both enhance() and openFocus() (no SVG → no expand), or read/text steps open to an empty panel');

// Exercise the real Sharpen handlers with only visual shell operations stubbed.
// A green source regex alone cannot prove exact return or truthful practice state.
function runtime(){
  const calls={opened:[],closed:0,shown:0,rendered:0,seen:[],saved:[],practiced:[],feedback:[],shared:[],copied:[]};
  const store={read:()=>({focus:null,seen:{}}),persistent:()=>true,recordSeen:(...args)=>calls.seen.push(args),saveFocus:(...args)=>calls.saved.push(args),markPracticed:(...args)=>calls.practiced.push(args),feedback:(...args)=>calls.feedback.push(args)};
  const context={console,Date,GameSharpGoldLessonSpines:spines,GameSharpSharpenPaths:paths,GS_GOLD_DAILY_CSS_READY:true,
    GameSharpGoldDaily:{challenges:gold.challenges,audit:()=>({ok:true}),isAvailable:id=>gold.challenges.some(c=>c.id===id&&!c.reviewOnly),openPractice:(id,options)=>{calls.opened.push({id,options});return true;}},
    GameSharpSharpenState:{createStore:()=>store},localStorage:{},document:{readyState:'loading',addEventListener(){}},navigator:{share:async value=>calls.shared.push(value)},__calls:calls};
  context.window=context;
  const expose=`root.__playerTest={launchLesson,launchPath,pathsFor,validSavedFocus,shareFocus,saveFocus,getState:()=>({...state}),setState:value=>{state={...value};}};
    close=()=>{root.__calls.closed++;};show=()=>{root.__calls.shown++;};render=renderFocus=()=>{root.__calls.rendered++;};`;
  vm.runInNewContext(js.replace("if(document.readyState==='loading')",expose+"\nif(document.readyState==='loading')"),context);
  return {api:context.__playerTest,context,calls};
}
const example=paths.paths.find(p=>p.region==='forehand');
{
  const {api,context}=runtime();
  const saved={lessonId:example.lessonId,region:example.region,pathId:example.id,savedAt:'2026-09-14T00:00:00.000Z',practicedAt:null,feedback:null};
  assert.equal(api.validSavedFocus(saved),saved,'an approved path must retain its exact saved focus');
  for(const path of paths.paths){
    const focus={...saved,lessonId:path.lessonId,region:path.region,pathId:path.id};
    assert.equal(api.validSavedFocus(focus),focus,`${path.id}: all approved concern bindings must remain restorable`);
  }
  for(const lesson of gold.challenges.filter(c=>!c.reviewOnly)){
    const focus={...saved,lessonId:lesson.id,region:spines.byId[lesson.lessonSpineId].sharpenTarget,pathId:null};
    assert.equal(api.validSavedFocus(focus),focus,`${lesson.id}: exact Daily cues need no concern-path substitution`);
  }
  const mismatchedLesson=gold.challenges.find(c=>!c.reviewOnly&&c.id!==example.lessonId).id;
  const otherRegion=requiredRegions.find(region=>region!==example.region);
  const invalid=[
    null,
    {...saved,region:'retired-region'},
    {...saved,region:'__proto__'},
    {...saved,region:'constructor'},
    {...saved,lessonId:'retired-lesson'},
    {...saved,pathId:'retired-path'},
    {...saved,region:otherRegion},
    {...saved,lessonId:mismatchedLesson},
    {...saved,pathId:null,region:otherRegion}
  ];
  for(const focus of invalid){
    const before=JSON.stringify(focus);
    assert.equal(api.validSavedFocus(focus),null,`reject invalid saved binding: ${before}`);
    assert.equal(JSON.stringify(focus),before,'withholding a stale focus must not rewrite or invent stored history');
  }
  context.GameSharpGoldDaily.isAvailable=()=>false;
  assert.equal(api.validSavedFocus(saved),null,'an unavailable approved lesson must withhold its saved cue');
}
for(const stage of ['region','focus']){
  const {api,calls}=runtime(),origin={stage,playerRegion:example.region,playerIssue:example.id,lessonId:example.lessonId,source:'gold-daily',contextualEntry:true};
  api.setState(origin);assert.equal(api.launchLesson(example.lessonId),true);
  assert.equal(calls.opened.length,1);assert.equal(calls.opened[0].id,example.lessonId,'launch must use the chosen lesson, not an index or fallback');
  assert.equal(typeof calls.opened[0].options.onReturn,'function');
  assert.equal(calls.seen.length+calls.saved.length+calls.practiced.length+calls.feedback.length,0,'opening a lesson must not mark it learned, saved, practised or improved');
  calls.opened[0].options.onReturn({lessonId:example.lessonId,completed:false});
  assert.deepEqual({...api.getState()},origin,'incomplete practice must restore the exact region/focus origin');
  assert.equal(calls.shown,1);assert.equal(calls.seen.length+calls.saved.length+calls.practiced.length+calls.feedback.length,0);
}
{
  const {api,calls}=runtime();api.setState({stage:'region',playerRegion:example.region,playerIssue:example.id,lessonId:example.lessonId,source:'sharpen',contextualEntry:false});
  api.launchLesson(example.lessonId);calls.opened[0].options.onReturn({lessonId:example.lessonId,completed:true});
  assert.equal(api.getState().stage,'focus');assert.equal(api.getState().lessonId,example.lessonId);assert.equal(calls.seen[0][0],example.lessonId);
  assert.equal(calls.saved.length+calls.practiced.length+calls.feedback.length,0,'a completed lesson is Seen, not saved focus, on-court practice or improvement');
  api.saveFocus();assert.equal(calls.saved.length,1);assert.deepEqual({...calls.saved[0][0]},{lessonId:example.lessonId,region:example.region,pathId:example.id});
  assert.equal(calls.closed,1,'saving must stay in place after the original launch closed Sharpen');
}
{
  const {api,calls}=runtime();api.setState({stage:'region',playerRegion:example.region,playerIssue:example.id,lessonId:example.lessonId,source:'sharpen'});
  assert.equal(api.launchLesson('missing-exact-id'),false);assert.equal(api.launchPath('missing-concern'),false);assert.equal(calls.opened.length,0,'unavailable content must not substitute a nearby lesson');
  api.launchLesson(example.lessonId);calls.opened[0].options.onReturn({lessonId:'other-lesson',completed:true});assert.equal(calls.seen.length,0,'another lesson completion cannot mark this concern Seen');
}
for(const dependency of ['GameSharpSharpenPaths','GameSharpSharpenState','GameSharpGoldDaily','GameSharpGoldLessonSpines']){
  const {api,context,calls}=runtime();delete context[dependency];
  assert.equal(api.pathsFor('forehand').length,0,`${dependency}: missing dependency must withhold cards`);assert.equal(calls.opened.length,0);
}
for(const method of ['share','clipboard','unavailable']){
  const {api,context,calls}=runtime();api.setState({stage:'focus',playerRegion:example.region,playerIssue:example.id,lessonId:example.lessonId,source:'sharpen'});
  if(method!=='share')delete context.navigator.share;
  if(method==='clipboard')context.navigator.clipboard={writeText:async value=>calls.copied.push(value)};
  await api.shareFocus();
  const lesson=gold.challenges.find(c=>c.id===example.lessonId),text=method==='share'?calls.shared[0].text:method==='clipboard'?calls.copied[0]:null;
  if(text){assert.ok(text.includes(lesson.memory));assert.ok(text.includes(lesson.takeItToCourt));assert.ok(text.endsWith('?goldDaily='+encodeURIComponent(lesson.slug)));}
  assert.equal(api.getState().lessonId,example.lessonId);assert.equal(calls.closed,0,'sharing never abandons the current focus');
  assert.equal(calls.seen.length+calls.saved.length+calls.practiced.length+calls.feedback.length,0,'sharing must not invent learning or practice progress');
}

console.log('GameSharp player structural contract: PASS');
