import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';const require=createRequire(import.meta.url),E=require('./gold-daily-serve-quality.js'),C=require('./gold-daily-construction.js');
const step=i=>({visual:{kind:'serve_quality',scene:i},correct:E.rows[i].correct});
test('serve-quality contact examples have legal service geometry, continuous flight and reachable receiving feet',()=>{for(let i=0;i<3;i++){assert.deepEqual(E.audit(step(i)),[]);for(let c=0;c<(i===0?2:4);c++){const m=E.model('serve_quality',i,c);assert.equal(E.sample(m,m.bounceAt).ball[2],0);assert.deepEqual(E.sample(m,m.receive).ball,m.receiver);for(let t=0;t<m.end;t+=.02){const p=E.sample(m,t),[x,y]=C.project(p.ball);assert(p.ball.every(Number.isFinite));assert(x>=4&&x<=476&&y+32>=4&&y+32<=386,'Visible ball');}assert(!/NaN|undefined/.test(E.svg(m,m.end)));}}});
test('serve quality keeps first comparison height/time/wing constant but changes contact depth',()=>{const a=E.model('serve_quality',0,0),b=E.model('serve_quality',0,1);assert.equal(a.receiver[2],b.receiver[2]);assert.equal(a.receive,b.receive);assert.deepEqual(a.far,b.far);assert(a.receiver[1]>-11.885&&b.receiver[1]<-11.885);assert(a.spacing>0&&b.spacing>0);});
test('serve quality changes actual depth, height, pace and reach, including the high-backhand reversal',()=>{const a=[0,1,2,3].map(c=>E.model('serve_quality',1,c));assert(a[1].receive>a[2].receive);assert.deepEqual(a[1].bounce,a[2].bounce);assert(a[3].receiver[2]>a[0].receiver[2]);assert(a[3].receiver[1]<-11.885);const b=[0,1,2,3].map(c=>E.model('serve_quality',2,c));assert(b[0].spacing<0&&b[1].spacing>0);assert(b[1].spacing>1);assert(b[0].receiver[2]>b[1].receiver[2]);assert(b[3].receive>b[0].receive);assert(b.every(m=>JSON.stringify(m.far)===JSON.stringify(b[0].far)));});
test('serve quality preserves observation questions and audio without inventing a return strike',()=>{for(let i=0;i<3;i++){const s=step(i);for(const selected of [null,0,1,2,3]){const tl=E.timelineFor(s,selected!=null),events=E.events(s,selected);assert(events.every(e=>e.at<=tl.total));assert(events.every(e=>['serve','bounce'].includes(e.audio)));for(const reduced of [false,true])assert(!/NaN|undefined/.test(E.render(s,selected,tl.total,reduced)));}assert(E.audit({...s,correct:(s.correct+1)%4}).length);}});
test('reduced serve comparisons retain four neutral contact insets and model-derived facts',()=>{
  for(const scene of [1,2]){
    const s=step(scene),html=E.render(s,null,10.1,true);
    assert.equal((html.match(/class="gd-serve-contact-card"/g)||[]).length,4);
    assert.equal((html.match(/viewBox="25 -18 220 154"/g)||[]).length,4);
    assert(!html.includes('gd-sequence-frame'));
    assert(!/correct|best|winner/.test(html));
    for(let c=0;c<4;c++){
      const m=E.model('serve_quality',scene,c);
      assert(html.includes(m.receiver[2].toFixed(2)+' m high'));
      assert(html.includes(Math.abs(m.receiver[1]).toFixed(1)+' m from net'));
      assert(html.includes('Side gap '+Math.abs(m.spacing).toFixed(2)+' m'));
      assert(html.includes((m.receive-m.hit).toFixed(2)+' s after serve'));
      const [x,y]=C.project(m.receiver),[fx,fy]=C.project(m.receiverFoot);
      assert(x>=31&&x<=239&&y>=-12&&y<=130,'Contact is inside the shared crop');
      assert(fx-11>=25&&fx+11<=245&&fy-64>=-18&&fy+3<=136,'Body fits the shared crop');
    }
    assert(!E.render(s,null,10.1,false).includes('gd-serve-contact-grid'));
    assert(!E.render(s,s.correct,5.8,true).includes('gd-serve-contact-grid'));
  }
});
