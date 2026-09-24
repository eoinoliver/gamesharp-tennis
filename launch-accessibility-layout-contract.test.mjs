import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');

test('desktop collapsed home has one reachable in-flow layout', () => {
  assert.match(html, /@media\(min-width:1367px\)[\s\S]*?#homeScreen\.gs-home-hero-collapsed \.gs-daily-v52,[\s\S]*?position:relative!important;[\s\S]*?transform:none!important;/);
  assert.match(html, /#homeScreen\.gs-home-hero-collapsed \.gs-hero-panel[\s\S]*?display:none!important;/);
  assert.match(html, /if\(window\.innerWidth > 1366\)[\s\S]*?home\.classList\.add\('gs-home-hero-collapsed'\)/);
  assert.match(html, /#homeScreen\.gs-home-hero-collapsed \.home-court-legacy-geometry\{display:none!important;\}/);
  assert.match(html, /#homeScreen\.gs-home-hero-collapsed \.gs-unified-home-court\{display:none!important;\}/);
  assert.match(html, /#homeScreen\.gs-home-hero-collapsed \.gs-real-home-court img\{[\s\S]*?object-fit:cover!important;/);
});

test('daily and Predict choices are native buttons at their factories', () => {
  assert.match(html, /document\.createElement\('button'\); el\.type = 'button'; el\.className = 'opt opt-enter'/);
  assert.doesNotMatch(html, /document\.createElement\('div'\); el\.className = 'opt opt-enter'/);
  assert.match(html, /<button type="button" class="seq-opt seq-tell-opt"/);
  assert.match(html, /<button type="button" class="seq-opt" id="seqOpt/);
  assert.doesNotMatch(html, /<div class="seq-opt(?:\s|\")/);
});

test('global navigation exposes native controls and current-page state', () => {
  assert.match(html, /<nav class="gs-bottom-nav"[^>]*aria-label="Primary navigation"/);
  assert.equal((html.match(/<button type="button" class="gs-bnav-item/g) || []).length, 3);
  assert.match(html, /aria-current','page'/);
});

test('answer outcomes are announced and locked accessibly', () => {
  assert.match(html, /id="gsA11yStatus"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(html, /function gsAnnounce\(message\)/);
  assert.match(html, /gsAnnounce\(ok \? 'Correct\./);
  assert.match(html, /el\.disabled = true;[\s\S]*?el\.setAttribute\('aria-disabled','true'\)/);
});

test('focus is visibly preserved for every repaired interaction primitive', () => {
  assert.match(html, /button\.opt:focus-visible/);
  assert.match(html, /button\.seq-opt:focus-visible/);
  assert.match(html, /\.gs-bnav-item:focus-visible/);
  assert.match(html, /\[role="button"\]:focus-visible/);
});

test('legacy and future clickable navigation is upgraded at one systemic choke point', () => {
  assert.match(html, /function gsUpgradeInteractiveSemantics\(root = document\)/);
  assert.match(html, /const selector = '\[onclick\]:not\(button\):not\(a\):not\(input\):not\(select\):not\(textarea\)'/);
  assert.match(html, /event\.key !== 'Enter' && event\.key !== ' '/);
  assert.match(html, /new MutationObserver\(records =>/);
});

test('Daily Live Point resets both the frame journey and its covered parent', () => {
  assert.match(html, /function startDailyLivePoint\(\) \{[\s\S]*?gsScrollTop\(\);[\s\S]*?_gsDailyLiveOutcome = null;/);
});

test('every home photograph fails closed without a browser broken-image glyph', () => {
  assert.match(html, /querySelectorAll\('\.gs-hero-img,\.gs-real-home-court img'\)/);
  assert.match(html, /#homeScreen\.gs-home-hero-image-failed \.gs-hero-img,[\s\S]*?#homeScreen\.gs-home-hero-image-failed \.gs-real-home-court img\{visibility:hidden;\}/);
});

test('text-only reads retain their authored concept and cannot inherit a generic ball flight', () => {
  assert.doesNotMatch(html, /id="ballArc"|function arcAnim\(|arcAnim\(/);
  assert.match(html, /if \(!animReleased\) \{[\s\S]*?classList\.contains\('ta-concept'\)[\s\S]*?clearTechAnim\(\)/);
});

test('Predict remains readable on desktop without a raw programmatic focus ring', () => {
  assert.match(html, /#seqContent:focus\{outline:none;\}/);
  assert.match(html, /@media\(min-width:768px\)\{[\s\S]*?#sequenceScreen #seqContent\{width:min\(760px,100%\);margin-inline:auto;\}/);
});

console.log('Launch accessibility + layout contract: PASS');
