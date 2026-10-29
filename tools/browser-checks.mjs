import {spawn} from 'node:child_process';
import {readFileSync} from 'node:fs';
const base=process.argv[2];
if(!base || !base.endsWith('/')) throw Error('Supply the exact app origin with trailing /');
const catalog=JSON.parse(readFileSync('app/catalog.js','utf8').match(/GS_CATALOG=(.*);\n/)[1]);
const tasks=[['tools/six-play-browser.mjs',base],['tools/flagship-browser.mjs',base],['tools/mobile-learning-browser.mjs',base],['tools/stroke-integrity-browser.mjs',base],['tools/lesson-recap-browser.mjs',base],['tools/live-point-browser.mjs',base],['tools/voice-catalogue-browser.mjs',base],['tools/voice-browser.mjs',base],['tools/question-action-browser.mjs',base],['tools/readiness-browser.mjs',base],['tools/sensory-browser.mjs',base],['gs/app_flow.mjs',base],['app_src/lesson-layout-regression.mjs',base],['gs/payoff_check.mjs',base],['gs/verify_pusher.mjs',base+'play.html?l=the-pusher'],...catalog.daily.concat(catalog.predict,catalog.play||[]).map(l=>['gs/gate.mjs',base+'play.html?l='+l.slug])];
// The opt-in comparison preserves first scores and withholds annotations until commitment.
tasks.push(['tools/contact-focus-browser.mjs',base]);
const groups={
 'tools/six-play-browser.mjs':'learning',
 'tools/flagship-browser.mjs':'learning',
 'tools/stroke-integrity-browser.mjs':'routes','tools/live-point-browser.mjs':'routes','gs/gate.mjs':'routes','tools/contact-focus-browser.mjs':'routes',
 'tools/mobile-learning-browser.mjs':'learning','tools/lesson-recap-browser.mjs':'learning','tools/question-action-browser.mjs':'learning',
 'tools/voice-catalogue-browser.mjs':'sound','tools/voice-browser.mjs':'sound','tools/sensory-browser.mjs':'sound',
 'tools/readiness-browser.mjs':'shell','gs/app_flow.mjs':'shell','app_src/lesson-layout-regression.mjs':'shell','gs/payoff_check.mjs':'shell','gs/verify_pusher.mjs':'shell'
};
const suite=process.env.GS_BROWSER_SUITE||'all';
if(!['all',...new Set(Object.values(groups))].includes(suite))throw Error('Unknown browser suite: '+suite);
if(tasks.some(([file])=>!groups[file]))throw Error('Every release check must belong to exactly one suite');
// Run cheap per-lesson contracts before the longer complete journeys.
tasks.sort((a,b)=>Number(b[0]==='gs/gate.mjs')-Number(a[0]==='gs/gate.mjs'));
const selected=tasks.filter(([file])=>suite==='all'||groups[file]===suite);
console.log('Release checks:',selected.length,'of',tasks.length,'suite',suite);
for(const args of selected){
 console.log('CHECK',args.join(' '));
 const code=await new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,['--import','./app_src/verify-runtime.mjs',...args],{stdio:'inherit'});
  child.on('error',reject);child.on('exit',resolve);
 });
 if(code!==0)process.exit(code||1);
}
