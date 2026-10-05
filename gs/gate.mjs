// Truth gate for a 3D lesson page: node gate.mjs <page.html>
import { chromium } from 'playwright';
const page=process.argv[2];
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1100,height:900}}); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
await p.goto(/^https?:/.test(page)?page:'file://'+page); await p.waitForFunction(()=>window.__test,null,{timeout:20000}); await p.waitForTimeout(600);
const r=await p.evaluate(()=>{
  const fails=[], notes=[]; window.__camOverride=null;
  const cls=k=>{const ms=SC[k].marks, m=ms[ms.length-1]; if(!m) return 'none';
    return m.kind==='land'?'won':m.kind==='rally'?'neutral':m.kind==='contact'?'observed':(m.kind==='reply'||m.kind==='out'||m.kind==='net')?'lost':'?';};
  const L=(s,n,what)=>{if(s&&s.length>n) fails.push(`text too long (${s.length}>${n}): ${what}: "${s}"`);};
  (LESSON.branch?Object.values(LESSON.nodes):LESSON.steps).forEach((S,i)=>{   // a branching point: check every node
    L(S.unlock,28,`step ${i+1} unlock`); L(S.take,75,`step ${i+1} take`);
    for(const X of 'ABCD'){L(S.lines[X],80,`step ${i+1} ${X} line`);
      if(S.reveal||(LESSON.branch&&'ABCD'.indexOf(X)>=S.opts.length)) continue; const k=S.scene+X; if(!SC[k]){fails.push('missing scene '+k);continue;}
      const c=cls(k); notes.push(`${k}: ${c}${'ABCD'.indexOf(X)===S.correct?' (correct)':''}`);
      const good='ABCD'.indexOf(X)===S.correct||(S.alsoOk||[]).includes('ABCD'.indexOf(X));
      if(good&&(c==='lost'||c==='out')) fails.push(`correct answer ${k} ends as a LOST point`);
      if('ABCD'.indexOf(X)!==S.correct&&c==='won') notes.push(`  note: wrong answer ${k} ends as a won point`);
      if(c==='neutral'){const segs=SC[k].actors, last=a=>Math.max(...(segs[a]||[]).filter(s=>!s.hold).map(s=>s.start+CL[s.clip].contactFrame));
        if(last('you')<last('opp')) fails.push(`${k}: neutral ending but the last shot is theirs`);}}});
  // motion + visibility
  cam=(typeof LESSON!=='undefined'&&LESSON.cam0&&LESSON.cam0.c)?{...LESSON.cam0.c}:{az:-90,el:24,d:31,fov:31,tgt:[0,-1.7,0]}; buildBasis();
  for(const k of Object.keys(SC)){const sc=SC[k];
    for(const who of ['you','opp']){let prev=null,mx=0,mxg=0,away=999,awg=0,off=0;
      for(let g=0;g<sc.frames;g++){const a=actorAt(sc,who,g); if(!a) continue; const h=a.pose[I.hips];
        if(prev){const v=Math.hypot(h[0]-prev[0],h[1]-prev[1])*100; if(v>mx){mx=v;mxg=g;}} prev=h;
        const f=facingOf(a.pose)*180/Math.PI, aw=who==='you'?-90:90, o=Math.abs(((f-aw+540)%360)-180); if(g>90&&o<away){away=o;awg=g;}
        if(who==='you'){const q=P(a.pose[I.hips]); if(!q||q.s[0]<0||q.s[0]>VW||q.s[1]<0||q.s[1]>VH) off++;}}
      if(mx>12.5) fails.push(`${k} ${who}: glides at ${mx.toFixed(1)} m/s (frame ${mxg})`);
      if(away<15) fails.push(`${k} ${who}: faces away from the court (${away.toFixed(0)}° at frame ${awg})`);
      if(off>0) fails.push(`${k}: you are off-screen in Broadcast for ${off} frames`);}}
  return {fails,notes};});
// phone framing: both players on screen in the default phone camera
{const q=await b.newPage({viewport:{width:390,height:844}}); await q.goto(/^https?:/.test(page)?page:'file://'+page); await q.waitForFunction(()=>window.__test,null,{timeout:20000}); await q.waitForTimeout(400);
 const pf=await q.evaluate(()=>{const out=[]; camI=window.__camDefault??0; window.__camOverride=null; showTargets=null; answered=true;   // check the playback camera, not a question-time view
  for(const k of Object.keys(SC)){const sc=SC[k]; let worst=1e9,wg=0;
    for(let g=0;g<sc.frames;g+=3){const y=actorAt(sc,'you',g); if(!y) continue; scene=k; t=g; setCamera(y); buildBasis();
      for(const who of (LESSON.closeUp?['you']:['you','opp'])){const a=actorAt(sc,who,g); if(!a) continue;   // a close-up lesson frames you, not them
        for(const pt of [a.pose[I.hips],add(a.pose[I.head],[0,0,0.42])]){const s=P(pt); if(!s) continue;
          const m=Math.min(s.s[0],VW-s.s[0],s.s[1],VH-s.s[1]); if(m<worst){worst=m;wg=g;}}}}
    if(worst<20) out.push(`${k}: a player is cut off on a phone (frame ${wg})`);}
  return out;}); r.fails.push(...pf); await q.close();}
console.log(r.notes.join('\n')); if(errs.length) r.fails.push('page errors: '+errs.join(' | '));
console.log(r.fails.length?'\nGATE FAILED:\n- '+r.fails.join('\n- '):'\nGATE PASSED');
await b.close(); process.exit(r.fails.length?1:0);
