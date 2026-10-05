import {spawn} from 'node:child_process';
import {readFileSync} from 'node:fs';
const base=process.argv[2];
if(!base || !base.endsWith('/')) throw Error('Supply the exact app origin with trailing /');
const catalog=JSON.parse(readFileSync('app/catalog.js','utf8').match(/GS_CATALOG=(.*);\n/)[1]);
const tasks=[['gs/app_flow.mjs',base],['app_src/lesson-layout-regression.mjs',base],['gs/payoff_check.mjs',base],['gs/verify_pusher.mjs',base+'play.html?l=the-pusher'],...catalog.daily.concat(catalog.predict).map(l=>['gs/gate.mjs',base+'play.html?l='+l.slug])];
for(const args of tasks){
 console.log('CHECK',args.join(' '));
 const code=await new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,['--import','./app_src/verify-runtime.mjs',...args],{stdio:'inherit'});
  child.on('error',reject);child.on('exit',resolve);
 });
 if(code!==0)process.exit(code||1);
}
