import fs from 'node:fs';
import assert from 'node:assert/strict';

const host=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
const live=fs.readFileSync(new URL('./livepoint-prototype.html',import.meta.url),'utf8');

function block(source,name){
  const start=source.indexOf('function '+name+'(');assert.ok(start>=0,name+' missing');
  const open=source.indexOf('{',start);let depth=0,quote='',escaped=false;
  for(let i=open;i<source.length;i++){
    const c=source[i];
    if(quote){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c===quote)quote='';continue;}
    if(c==='"'||c==="'"||c==='`'){quote=c;continue;}
    if(c==='{')depth++;else if(c==='}'&&--depth===0)return source.slice(start,i+1);
  }
  throw new Error(name+' did not close');
}

const dailyStart=host.indexOf('function runStandardDaily(');
const dailyEnd=host.indexOf('function dtcAllFaults(',dailyStart);
assert.ok(dailyStart>=0&&dailyEnd>dailyStart,'runStandardDaily boundaries missing');
const daily=host.slice(dailyStart,dailyEnd);
const reveal=block(host,'buildProLens');
const formatLabel=block(host,'getFormatLabel');
const predict=block(host,'buildSeqResult');
const liveResult=block(live,'result');
const library=block(host,'initProLensMoments');
const catalogStart=host.indexOf('const GS_PRO_INSIGHTS = Object.freeze({');
const catalogEnd=host.indexOf('const GS_PRO_INSIGHT_IDS',catalogStart);
const catalog=host.slice(catalogStart,catalogEnd);

assert.ok(catalogStart>0&&catalogEnd>catalogStart,'curated player catalog missing');
assert.equal((catalog.match(/Object\.freeze\(\{player:/g)||[]).length,14,'approved catalog count changed without review');
assert.doesNotMatch(catalog,/player:[^,]+,quote:/,'unverified player quotations must not enter the catalog');
const editorialRows=[...catalog.matchAll(/copy:'([^']+)',pearl:'([^']+)'/g)];
assert.equal(editorialRows.length,14,'every player insight needs copy and a pearl');
editorialRows.forEach(([,copy,pearl])=>{
  assert.ok(copy.trim().split(/\s+/).length<=42,'player story exceeds the compact mobile limit');
  assert.ok(pearl.trim().split(/\s+/).length<=13,'pearl is no longer memorable at a glance');
  assert.doesNotMatch(copy,/“|”|"/,'player story looks like an unverified quotation');
});
assert.match(daily,/let proPool = tacPool\.filter\(q => gsProInsightFor\(q\) && canAdd\(q\)\)/,'Daily can still label generic Coach Lens copy as Pro Insight');
assert.match(daily,/proCount !== 1/,'Daily no longer guarantees exactly one full Pro Insight');
assert.match(daily,/selected\.map\(q => \(\{/,'Daily metadata is still written onto shared QBANK objects');
assert.match(formatLabel,/gsProInsightFor\(q\)/,'generic Coach Lens copy can still receive the Pro Insight label');
assert.doesNotMatch(formatLabel,/if \(q\.pro_insight/,'generic Coach Lens copy can still masquerade as named-player evidence');
assert.match(daily,/microInsight: !!\(microEligible && gsDailyMicroInsight\(q\)\)/,'Daily micro-pearl cadence missing');
assert.ok(daily.indexOf('const isVisualAnchor')<daily.indexOf('const microEligible'),'Daily reads visual-anchor state before initialization');
assert.match(reveal,/const playerInsight = gsProInsightFor\(q\)/,'reveal does not derive named evidence from curated catalog');
assert.match(reveal,/!isProInsight && insight/,'generic Coach Lens copy can duplicate the full player story');
assert.match(reveal,/gsRecordProInsight\(q\.id/,'discovered insights are not recorded');
assert.match(predict,/gsSeqPlayCount\(s\.id\) % 2 === 1/,'Predict player insight is not deterministic 50% cadence');
assert.match(host,/GS_SHARPEN_PEARLS/,'Sharpen has no permanent pearl identity');
assert.match(host,/Your Pro Insights/,'Profile lacks discovered insight progress');
assert.match(library,/GSReleasePolicy\?\.proInsightIds/,'Archived Explore collection must follow its current release gate');
assert.doesNotMatch(library,/if \(!gsHasFaithfulAnimation\(linkedQuestion\)\) return/,'text-safe insights can disappear from Explore when no animation exists');
assert.match(host,/classList\.contains\('gs-pro-index-visual'\)\)return/,'editorial insight art can falsely advertise an animation');
assert.match(live,/const LP_PRO_PATTERNS=Object\.freeze/,'Live Point has no approved player pattern map');
assert.match(liveResult,/lpProPattern\(S\(\)\)/,'Live Point result does not render its relevant player pattern');
assert.match(live,/function lpRecordProPattern/,'Live Point discoveries do not feed unified progress');

console.log(JSON.stringify({contract:'pro-insight-presence-v1',fullDaily:1,microDaily:'3/7',predict:'1/2',catalog:14,status:'PASS'},null,2));
