import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import fs from 'node:fs';
const E=createRequire(import.meta.url)('./.proofs/second-serve/evidence.js');
test('second-serve proof: all authored flights are legal, reachable, continuous and clear the net',()=>{
 for(let c=0;c<2;c++)for(let b=0;b<2;b++){
  const m=E.model(c,b);assert(m.bounce[0]<0&&m.bounce[0]>-4.115&&m.bounce[1]>-6.4&&m.bounce[1]<0);
  assert(m.receiver[2]>.7&&m.receiver[2]<1.3);assert(m.receiver[0]<m.receiverFoot[0],'far right-hander forehand side');
  assert(Math.hypot(m.receiverFoot[0]-m.initial[0],m.receiverFoot[1]-m.initial[1])/(m.contactAt-m.hit-.12)<4.5,'reachable average movement');
  let prior=E.sample(m,0).ball;for(let t=.002;t<m.end;t+=.002){const p=E.sample(m,t).ball;assert(p.every(Number.isFinite));assert(p[2]>=0);assert(Math.hypot(...p.map((x,i)=>x-prior[i]))<.15,'continuous flight');if(p[1]*prior[1]<0)assert(p[2]>1.08,'net clearance');prior=p;}
  for(const t of [m.bounceAt,m.contactAt])assert(Math.hypot(...E.sample(m,t-.00001).ball.map((x,i)=>x-E.sample(m,t+.00001).ball[i]))<.01,'event continuity');
  assert(!/NaN|undefined/.test(E.svg(m,m.end)));assert(!/<text\b/.test(E.svg(m,m.end,false)));
 }
});
test('second-serve proof: legal serves differ in contact depth, not merely labels',()=>{const a=E.model(0,0),b=E.model(0,1);assert.equal(a.contactAt,b.contactAt);assert.equal(a.receiver[2],b.receiver[2]);assert(a.receiver[1]>-11.885);assert(b.receiver[1]<-11.885);assert(b.receiver[1]<a.receiver[1]-3);});
test('second-serve proof: identical incoming ball and target, genuinely faster late return but earlier arrival from early contact',()=>{const a=E.model(1,0),b=E.model(1,1);for(let t=0;t<a.contactAt;t+=.02)assert.deepEqual(E.sample(a,t).ball,E.sample(b,t).ball);assert.deepEqual(a.target,b.target);assert(E.metrics(b).horizontalReturnSpeed>E.metrics(a).horizontalReturnSpeed);assert(a.end<b.end);assert(b.contactAt>a.contactAt);});
test('second-serve proof remains isolated from live lessons, scoring and release',()=>{const html=fs.readFileSync(new URL('./.proofs/second-serve/index.html',import.meta.url),'utf8');assert(!/localStorage|sessionStorage|fetch\(|gold-daily-prototypes.js/.test(html));assert(fs.readFileSync(new URL('./.vercelignore',import.meta.url),'utf8').includes('.proofs/'));});
