import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const root=path.dirname(new URL(import.meta.url).pathname);
const htmlPath=['livepoint-prototype.html','livepoint-prototype-working.html'].map(name=>path.join(root,name)).find(fs.existsSync);
if(!htmlPath) throw new Error('Live Point HTML not found');
const engine=require(path.join(root,'livepoint-engine.js'));
const html=fs.readFileSync(htmlPath,'utf8');
const content=require(path.join(root,'livepoint-content.js'));
const integrity=require(path.join(root,'livepoint-integrity.js'));
const failures=[];
const check=(ok,msg)=>{if(!ok)failures.push(msg);};

check(!/createOscillator|createBuffer\s*\(|Math\.random\(\)\*2-1|SND\.(?:point|weak)|function\s+(?:tone|crowd|strike)\s*\(/.test(html),'synthesized/result tone code has returned');
check(/<script src="livepoint-engine\.js\?v=[^"?]+"><\/script>/.test(html),'validated timeline engine is not loaded');
check(/buildMultiShotSVG\(play,timeline\)/.test(html)&&/buildFullPointSVG\(fp,timeline\)/.test(html),'renderers are not timeline-driven');
check(!/fpShotTime|stepDur=|i\*1\.25|i\*1\.15/.test(html),'an independent visual/audio clock has returned');
check(/LP_AUDIO\.schedule\(timeline\)/.test(html),'natural audio is not scheduled from the canonical timeline');
check(/createAudioEngine\(\{storageKey:'gs_sound_on'\}\)/.test(html),'Live Point sound preference has drifted from the main app');
check(/await lpEnsureAudio\(\);[\s\S]{0,100}fn\(/.test(html),'animation can begin before iPhone audio is unlocked and decoded');
check(/LP_AUDIO\.preview\(\)/.test(html),'sound control has no natural on-device confirmation');
check(/id="lpOtherLine">Play the other line/.test(html),'Daily embed lost the alternate scenario path');
check(/exploreBranch=guidedScoredResult\.branch==='A'\?'B':'A'/.test(html),'alternate-line control does not force the unplayed branch');
check(html.indexOf('id="lpOtherLine"')<html.indexOf('id="lpComplete"'),'alternate scenario is buried after completion');
check(/firstGuidedResult=isGuided&&!guidedScoredResult/.test(html)&&/if\(!isGuided\|\|firstGuidedResult\)lpPost\('gs-livepoint-result'/.test(html),'comparison can rewrite the first guided result');
check(/function lpTransitionTop/.test(html)&&!/scrollIntoView/.test(html),'Live Point has competing scroll owners');
check(/btns\[i\]\.classList\.add\('chosen'\);/.test(html)&&!/btns\[i\]\.classList\.add\('chosen','good'\)/.test(html),'the first Live Point line is falsely presented as correct before the point is finished');
check(/\.q:focus,\.result-title:focus\{outline:2px solid rgba\(200,168,75,\.72\)/.test(html),'programmatic Live Point focus exposes an unbranded browser outline');

check(/<script src="livepoint-content\.js\?v=[^"?]+"><\/script>/.test(html),'shared Live Point content is not loaded');
const scenarios=(content&&content.scenarios)||[];
check(scenarios.length===22,'expected 22 scenarios, found '+scenarios.length);
check(Array.isArray(content.launchIds)&&content.launchIds.length===22,'launch eligibility is not an explicit 22-ID allowlist');
check(JSON.stringify(content.launchIds)===JSON.stringify(scenarios.map(s=>s.id)),'content bank and approved Live Point allowlist have drifted');
const targetValues=new Set(['serve-return','backhand','forehand','net-play','mental-game','movement','decision-making']);
check(Object.keys(content.targets||{}).length===scenarios.length,'every Live Point must have one explicit Sharpen target');
scenarios.forEach(sc=>check(targetValues.has(content.targets&&content.targets[sc.id]),sc.id+': invalid or missing Sharpen target'));
check(content.targets&&content.targets.inside_out_forehand==='forehand','inside-out forehand must never be misrouted to Backhand');

const textKeys=new Set(['id','title','opp','sit','q','lbl','sub','reveal','winTitle','winTxt','midTitle','midTxt']);
const text=[];
function collectText(value,key){
  if(typeof value==='string'&&textKeys.has(key)) text.push([key,value]);
  else if(value&&typeof value==='object') Object.entries(value).forEach(([k,v])=>collectText(v,k));
}
collectText(scenarios,'');
const textHash=crypto.createHash('sha256').update(JSON.stringify(text)).digest('hex');
const approvedTextBlob=text.map(([,value])=>value).join(' ');
check(!/(?:net's higher|court's shorter|mini-break|Djokovic built a career|safe return only delays|most-choked|wins or loses this — before|highest-percentage answer|twenty-five feet|nobody volleys)/i.test(approvedTextBlob),'a known misleading tennis claim has returned');
const byId=Object.fromEntries(scenarios.map(scenario=>[scenario.id,scenario]));
check(byId.return_match_point?.d1?.opts?.[0]?.lbl==='Compact and firm, deep through the middle','match-point return has reverted to the reckless full-swing lesson');
check(byId.tiebreak_first?.A?.winTitle==='Opening point won.','opening tiebreak point is again being mislabelled as a mini-break');
check(byId.approach_selection?.A?.winTitle==='Net position held.','a deep first volley is again being presented as an immediate point winner');
check(byId.serving_for_set?.A?.winTitle==='Pressure point won.'&&byId.serving_to_stay?.A?.winTitle==='Pressure point won.','one pressure point is again being presented as an entire game or set');
// Text fingerprints detect drift, not correctness. Independent scene checks below
// replace the old frozen-text assertion; dated visual review remains a release gate.

function assemble(sc,branch,finish){
  return integrity.assemble(sc,branch,finish);
}
function crossesNet(shot){return (shot.from[1]<150&&shot.to[1]>150)||(shot.from[1]>150&&shot.to[1]<150);}
function validateTennisShot(shot,where){
  check(Array.isArray(shot.from)&&Array.isArray(shot.to),where+': missing coordinates');
  if(!shot.from||!shot.to)return;
  check(shot.from[1]!==150&&shot.to[1]!==150,where+': contact/landing placed on the net');
  check(crossesNet(shot),where+': ball does not cross the net');
  const type=engine.classifyShot(shot),label=String(shot.label||'');
  if(type==='serve'){
    const landing=shot.bounce||shot.to;
    const fromNear=shot.from[1]>220, landsFar=landing[1]>=80&&landing[1]<150;
    const fromFar=shot.from[1]<80, landsNear=landing[1]>150&&landing[1]<=220;
    check((fromNear&&landsFar)||(fromFar&&landsNear),where+': serve does not land in the correct service box');
  }
  if(/drop|dink/i.test(label)){
    const correctForecourt=shot.from[1]>150?(shot.to[1]>=80&&shot.to[1]<150):(shot.to[1]>150&&shot.to[1]<=220);
    check(correctForecourt,where+': drop shot is not just over the net');
  }
  if(shot.lineHit===true){
    const [x,y]=shot.to,nearLine=[33,167].some(v=>Math.abs(x-v)<=6)||[10,80,220,290].some(v=>Math.abs(y-v)<=6);
    check(nearLine,where+': claimed line hit does not meet a court line');
  }
}

const batches=[];
for(let start=0;start<scenarios.length;start+=5)batches.push(scenarios.slice(start,start+5));
batches.forEach((batch,batchIndex)=>{
  const before=failures.length;
  batch.forEach(sc=>{
    integrity.validate(sc).forEach(e=>failures.push(sc.id+': '+e));
    ['A','B'].forEach(branch=>{
      const b=sc[branch]; check(!!b,sc.id+'/'+branch+': branch missing'); if(!b)return;
      check(b.d2.opts.length===2,sc.id+'/'+branch+': decision must have two options');
      check(b.d2.opts.filter(o=>o.win).length===1,sc.id+'/'+branch+': decision must have exactly one best line');
      for(const [name,play] of Object.entries({seq:b.seq,win:b.win,mid:b.mid})){
        (play.shots||[]).forEach((shot,i)=>validateTennisShot(shot,sc.id+'/'+branch+'/'+name+'/'+i));
        const timeline=engine.compileTimeline(play,{mode:'multi'});
        engine.validateTimeline(timeline,play).forEach(e=>failures.push(sc.id+'/'+branch+'/'+name+': '+e));
      }
      for(const finish of ['win','mid']){
        const full=assemble(sc,branch,finish),timeline=engine.compileTimeline(full,{mode:'full'});
        engine.validateTimeline(timeline,full).forEach(e=>failures.push(sc.id+'/'+branch+'/'+finish+'/full: '+e));
      }
    });
  });
  const count=failures.length-before;
  console.log(`Batch ${batchIndex+1}: ${batch.map(s=>s.id).join(', ')} — ${count?'QUARANTINED ('+count+')':'PASS'}`);
});

const manifest=JSON.parse(fs.readFileSync(path.join(root,'livepoint-audio','SOURCES.json'),'utf8'));
check(manifest.sources.length===7&&manifest.sources.every(s=>s.license==='CC0'),'audio provenance is missing or not CC0');
for(const [type,files] of Object.entries(engine.AUDIO_LIBRARY)){
  check(files.length>0,type+': no natural audio assigned');
  files.forEach(file=>{const p=path.join(root,file);check(fs.existsSync(p),file+': missing');if(fs.existsSync(p))check(fs.statSync(p).size>2500,file+': file is implausibly small');});
}

if(failures.length){console.error('\nCONTRACT FAILED\n- '+failures.join('\n- '));process.exit(1);}
console.log(`\nCONTRACT PASS — ${scenarios.length} source scenes, ${text.length} text fields (not coaching approval), ${engine.AUDIO_TYPES.length} natural audio event types.`);
