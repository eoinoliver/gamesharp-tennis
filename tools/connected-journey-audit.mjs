import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const content=require('../livepoint-content.js');
const integration=require('../predict-live-integration.js');
const engine=require('../livepoint-engine.js');
const scene=require('../livepoint-scene.js');
const integrity=require('../livepoint-integrity.js');
const rows=[];
for(const id of content.launchIds){
 const sc=content.scenarios.find(s=>s.id===id),issues=integrity.validate(sc);
 for(const key of ['A','B']){
  const b=sc[key],incoming=b.seq.shots.at(-1).to;
  for(const phase of ['seq','win','mid']){
   const play=b[phase],timeline=engine.compileTimeline(play);
   issues.push(...engine.validateTimeline(timeline,play).map(s=>key+'/'+phase+': '+s));
   for(const side of ['you','opp']){
    const track=scene.track(play,timeline,side);
    for(const shot of timeline.shots.filter(s=>(s.shot.from[1]>150)===(side==='you'))){
     if(!track.some(p=>Math.abs(p.at-shot.contactAt)<1e-8&&Math.hypot(p.p[0]-shot.shot.from[0],p.p[1]-shot.shot.from[1])<.01))issues.push(key+'/'+phase+': '+side+' misses contact '+shot.index);
    }
   }
   if(phase!=='seq'&&Math.hypot(play.shots[0].from[0]-incoming[0],play.shots[0].from[1]-incoming[1])>.1)issues.push(key+'/'+phase+': finish restarts away from the received ball');
  }
 }
 rows.push({id,issues});
}
const report={journeys:integration.LAUNCH_SEQUENCE_IDS.length,liveScenes:rows.length,failures:rows.reduce((n,r)=>n+r.issues.length,0),rows};
console.log(JSON.stringify(report,null,process.argv.includes('--details')?2:0));
if(report.failures)process.exitCode=1;
