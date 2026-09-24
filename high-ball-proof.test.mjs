import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import fs from 'node:fs';
const E=createRequire(import.meta.url)('./gold-daily-high-ball.js');
test('high-ball proof has continuous depth and zero-height bounce on one flight clock',()=>{
 for(const s of E.scenes){assert.equal(E.ball(s,1).z,0);assert.ok(E.ball(s,1-1e-6).z<.00001);assert.ok(E.ball(s,1+1e-6).z<.00001);assert.ok(Math.abs(E.ball(s,1+1e-6).depth-E.ball(s,1-1e-6).depth)<.00001);assert.equal(E.ball(s,E.end).z,0);for(let t=0;t<E.end;t+=.01){const b=E.ball(s,t);assert.ok(b.z>=0);const p=E.project(b.depth,0,b.z);assert.ok(p.x>=0&&p.x<=480&&p.y>=0&&p.y<=295)}}
});
test('same high flight earns forward, back and hold under different starting conditions',()=>{
 for(const s of E.scenes){const c=E.contact(s,s.best);assert.ok(c&&c.comfortable,s.id);assert.ok(Math.abs(c.depth+.35-E.player(s,c.t,s.best).depth)<1e-8);}
 assert.ok(E.contact(E.scenes[0],'hold').t>E.contact(E.scenes[0],'forward').t);
 assert.equal(E.contact(E.scenes[1],'forward').comfortable,false);assert.equal(E.contact(E.scenes[1],'hold').comfortable,false);
 assert.equal(E.contact(E.scenes[2],'forward').comfortable,false);assert.equal(E.contact(E.scenes[2],'back'),null);
});
test('every choice has finite same-scene SVG; optional labels carry no physical evidence',()=>{
 for(const s of E.scenes)for(const a of [null,'forward','hold','back']){const t=a?(E.contact(s,a)?.t||E.end):E.readEnd;for(const labels of [false,true]){const svg=E.svg(s,t,a,labels);assert.doesNotMatch(svg,/NaN|undefined/);assert.match(svg,/viewBox="0 0 480 295"/);if(!labels)assert.doesNotMatch(svg,/<text /);}}
 assert.ok(Object.isFrozen(E.scenes[0].targets));assert.match(fs.readFileSync(new URL('./.vercelignore',import.meta.url),'utf8'),/^\.proofs\//m);
});
