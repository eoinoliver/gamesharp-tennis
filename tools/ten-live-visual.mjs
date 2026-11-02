// Inspectable route sheets; normal-speed flow is checked separately.
import{chromium}from'playwright';import{readFileSync,mkdirSync,writeFileSync}from'node:fs';
const base=process.argv[2],rows=JSON.parse(readFileSync('docs/features/ten-live-voice.json')).filter(r=>!process.env.GS_BATCH||r.batch===+process.env.GS_BATCH);
const out='app_src/evidence/ten-live/visual';mkdirSync(out,{recursive:true});const b=await chromium.launch(),p=await b.newPage({viewport:{width:480,height:900}});
for(const row of rows){
 await p.goto(base+'play.html?l='+row.lesson);await p.waitForFunction(()=>window.__test);await p.waitForSelector('#loading',{state:'hidden'});
 const shots=[];
 for(const path of ['AA','AB','BA','BB']){
  const key=row.prefix+'1'+path,frames=await p.evaluate(k=>{const s=SC[k],r=s.info.authoredPoint;return[r.firstHit,r.theirHit,r.nextHit,s.frames-1]},key);
  for(let i=0;i<frames.length;i++){
   await p.evaluate(({key,f})=>{__test.go(key,f);render();},{key,f:frames[i]});
   const file=`${out}/${row.lesson}-${path}-${i}.png`;await p.locator('#stage').screenshot({path:file});shots.push({file,path,frame:frames[i],event:['First contact','Their reply','Next contact','Final flight'][i]});
  }
 }
 writeFileSync(`${out}/${row.lesson}.json`,JSON.stringify(shots));
}
await b.close();
