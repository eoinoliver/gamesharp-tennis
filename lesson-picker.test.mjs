import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8'),source=fs.readFileSync(new URL('./gold-daily-prototypes.js',import.meta.url),'utf8');
test('lesson picker is a separate Home link and exits Daily mode before browsing',()=>{
 assert.match(html,/<a class="gs-lesson-picker" href="\?goldDaily=1">Choose a lesson/);
 const branchStart=source.indexOf("if (action === 'browse-lessons')"),branchEnd=source.indexOf("if (action === 'daily-start')",branchStart);
 assert.ok(branchStart>=0&&branchEnd>branchStart,'the explicit chooser action is missing');
 const branch=source.slice(branchStart,branchEnd);
 const browse=new Function('state','close','renderSelector',"const action='browse-lessons';\n"+branch);
 let rendered=0,closed=0,label='';
 const state={daily:true,practice:null,overlay:{setAttribute:(name,value)=>{assert.equal(name,'aria-label');label=value;}}};
 browse(state,()=>{closed++;},()=>{assert.equal(state.daily,false,'chooser must exit Daily before rendering');rendered++;});
 assert.equal(state.daily,false);assert.equal(rendered,1);assert.equal(closed,0);assert.equal(label,'Choose a lesson');
 state.practice={lessonId:'exact-sharpen-detour'};
 browse(state,()=>{closed++;},()=>{rendered++;});
 assert.equal(closed,1,'a Sharpen detour must return to its origin instead of entering the library');assert.equal(rendered,1);
 assert.match(source,/data-gd-action="browse-lessons">Choose a lesson/);
 assert.match(source,/data-gd-action="list">Choose another lesson/);
 assert.match(source,/if \(!canReviewChallenge\(challenge\)\) return ''/);
});
