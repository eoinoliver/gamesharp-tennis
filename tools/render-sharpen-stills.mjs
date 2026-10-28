// Regenerate teaching stills from the same renderer and derived clips as the app.
// Run after npm run build, then rebuild to include the new image fingerprints.
import {chromium} from 'playwright';
import {readFileSync} from 'node:fs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:300,height:285},reducedMotion:'reduce'});
await p.setContent('<style>html,body{margin:0;background:#0b3016}svg{display:block;width:300px;height:285px}</style><svg id="still" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 399"></svg>');
let source=readFileSync('app/athlete.js','utf8');
source=source.replace('window.GSAthlete={mount',`window.__still=(k,c,f)=>{c.joints.forEach((n,i)=>I[n]=i);VW=420;VH=399;CYF=.56;cam={az:['bh','slice','bv'].includes(k)?-120:-65,el:13,d:k==='serve'?6.7:5.2,fov:35,tgt:[0,.15,k==='serve'?1.35:1.02]};buildBasis();draw(document.getElementById('still'),k,c,f);};window.GSAthlete={mount`);
await p.addScriptTag({content:source});
for(const [key,clip,offsets]of [['bh','bh',[-32,0,35]],['slice','bhSlice',[-25,0,35]],['fv','lowfv',[-24,0,16]],['bv','bv',[-24,0,16]],['fh','fh',[-50,0,35]],['serve','serveT',[-65,0,30]],['drop','drop',[-45,0,25]]]){
 const c=JSON.parse(readFileSync(`app/clips/${clip}.json`));
 for(let i=0;i<offsets.length;i++){
  await p.evaluate(({key,c,f})=>__still(key,c,f),{key,c,f:c.contactFrame+offsets[i]});
  await p.locator('#still').screenshot({path:`app_src/sharpen/${key}_${i}.jpg`,type:'jpeg',quality:92});
 }
}
await b.close();console.log('Rendered 21 Sharpen stills from the shared clip/figure implementation.');
