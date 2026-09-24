// Generated public unfurls contain only explicitly released content.
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const release=require('../gamesharp-release-policy.js');
const integration=require('../predict-live-integration.js');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const bank=JSON.parse(html.match(/const QBANK = (\[[^\n]+\]);/)[1]);
// Public cards and unfurls use the same presentation record, never the retired catalog.
const q=Object.fromEntries(release.questionIds.map(id=>{
  const row=bank.find(x=>x.id===id);if(!row)throw new Error('Missing released question '+id);
  return [id,{t:row.question,m:row.module||''}];
}));
const play=Object.fromEntries(release.playbookIds.map(id=>{
  const row=integration.playbookPresentation(id);if(!row)throw new Error('Missing released play '+id);
  return [id,{t:row.title,g:row.tagline||row.goal||''}];
}));
const output=JSON.stringify({q,play},null,2)+'\n';
const target=new URL('../share-data.json',import.meta.url);
if(process.argv.includes('--check')){
  if(fs.readFileSync(target,'utf8')!==output)throw new Error('share-data.json is stale; run node tools/build-share-data.mjs');
}else fs.writeFileSync(target,output);
console.log(JSON.stringify({questions:Object.keys(q).length,plays:Object.keys(play).length,status:'PASS'}));
