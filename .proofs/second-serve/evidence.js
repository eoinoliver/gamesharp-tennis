(function(root,factory){const api=factory(typeof module==='object'?require('../../gold-daily-construction.js'):root.GoldDailyConstruction);if(typeof module==='object'&&module.exports)module.exports=api;else root.SecondServeEvidence=api;})(globalThis,function(C){
  'use strict';
  // Original, authored comparisons. Gravity-based flights with a fixed illustrative
  // bounce response; no drag/spin model, technique diagnosis or predicted winner.
  const g=9.81,hit=.15,bounceAt=1.07,start=[1.2,12.3,2.65];
  const clamp=n=>Math.max(0,Math.min(1,n));
  function flight(a,b,duration,t){const u=clamp(t/duration),p=C.mix(a,b,u);p[2]+=.5*g*duration*duration*u*(1-u);return p;}
  function model(caseId,branch){
    const timing=caseId===1,bounce=[-1.5,!timing&&branch===1?-6:-3.3,0],post=timing?(branch===0?.28:.66):.42;
    const d=bounceAt-hit,vz=(0-start[2]+.5*g*d*d)/d,up=-(vz-g*d)*.65;
    const velocity=[(bounce[0]-start[0])/d*.72,(bounce[1]-start[1])/d*.72,up];
    const receiver=[bounce[0]+velocity[0]*post,bounce[1]+velocity[1]*post,up*post-.5*g*post*post];
    const receiverFoot=[receiver[0]+.55,receiver[1]-.4,0],initial=[-1.7,timing?-10.5:-12.6,0];
    const contactAt=bounceAt+post,returnDuration=timing?(branch===0?.95:.78):0;
    const target=[1.7,9.5,0],end=contactAt+returnDuration;
    return {caseId,branch,start,bounce,velocity,receiver,receiverFoot,initial,contactAt,returnDuration,target,end,hit,bounceAt};
  }
  const cases=[
    {title:'Both are in. What contact follows?',setup:'Two second serves land legally. Compare where this returner can meet each ball at the same height.',branches:['Shorter landing','Deeper landing'],cues:['SERVE LEAVES','LEGAL BOUNCE','RETURN CONTACT'],note:'The shorter serve gives this returner a contact inside the baseline. Both serves are legal; that alone does not describe the opportunity they give away.'},
    {title:'Earlier contact or a faster return?',setup:'Replay the same second serve. Both returns reach the same target; one is struck earlier, the other travels faster.',branches:['Earlier contact','Later, faster return'],cues:['SAME SERVE','RETURN CONTACT','RETURN LANDING'],note:'In this authored comparison, the earlier return reaches the same target first—even though the later return travels faster. Earlier is not always better: balance, contact quality and the actual serve still matter.'}
  ];
  function sample(m,t){
    t=Math.max(0,Math.min(t,m.end));let ball;
    if(t<=m.bounceAt)ball=flight(m.start,m.bounce,m.bounceAt-m.hit,t-m.hit);
    else if(t<=m.contactAt){const q=t-m.bounceAt;ball=[m.bounce[0]+m.velocity[0]*q,m.bounce[1]+m.velocity[1]*q,m.velocity[2]*q-.5*g*q*q];}
    else ball=flight(m.receiver,m.target,m.returnDuration,t-m.contactAt);
    const far=C.mix(m.initial,m.receiverFoot,(t-m.hit-.12)/(m.contactAt-m.hit-.12));
    const near=C.mix([.65,12.7,0],[0,12.3,0],(t-.45)/1.1);
    return {ball,far,near,phase:t<m.hit?'Before serve':t<m.bounceAt?'Serve travelling':t<m.contactAt?'After the bounce':m.caseId===0?'Return contact':t<m.end?'Return travelling':'Return lands'};
  }
  const mark=(point,colour,r=5)=>{const [x,y]=C.project(point);return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r/2}" fill="none" stroke="${colour}" stroke-width="2"/>`;};
  function svg(m,t,labels=true){
    const s=sample(m,t),trail=[];for(let q=m.hit;q<Math.min(t,m.end);q+=.025)trail.push(sample(m,q).ball);trail.push(s.ball);
    const p=C.project(s.ball),sh=C.project([s.ball[0],s.ball[1],0]);
    const contactSeen=t>=m.contactAt,returnSeen=m.caseId===1&&t>=m.end;
    const caption=(x,y,text)=>labels?`<text x="${x}" y="${y}" fill="#e0e6d2" font-size="12">${text}</text>`:'';
    return `<svg viewBox="0 0 480 390" role="img" aria-label="${cases[m.caseId].branches[m.branch]}. ${s.phase}. Original illustrative sequence, not a predicted result."><rect width="480" height="390" rx="12" fill="#10291a"/><g transform="translate(0 32)"><polygon points="${C.poly([[-4.115,-11.885,0],[4.115,-11.885,0],[4.115,11.885,0],[-4.115,11.885,0]])}" fill="#244b32" stroke="#abbca2"/>
    <g stroke="#abbca2" fill="none"><polyline points="${C.poly([[-4.115,-6.4,0],[4.115,-6.4,0]])}"/><polyline points="${C.poly([[-4.115,6.4,0],[4.115,6.4,0]])}"/><polyline points="${C.poly([[0,-6.4,0],[0,6.4,0]])}"/></g>
    <polygon points="${C.poly([[-4.115,0,0],[-4.115,0,1.07],[0,0,.914],[4.115,0,1.07],[4.115,0,0]])}" fill="#d8ddc7" fill-opacity=".13" stroke="#d8ddc7"/>
    <g opacity=".2">${C.athlete(m.initial,'','#bfcbd7')}</g>
    ${C.athlete(s.far,labels?'RETURNER':'','#bfcbd7',contactSeen?m.receiver:null)}${C.athlete(s.near,labels?'SERVER':'','#e8dfbf',t<=m.hit?m.start:null)}
    <polyline points="${C.poly(trail)}" fill="none" stroke="#dae46a" stroke-opacity=".55" stroke-width="2"/>
    ${t>=m.bounceAt?mark(m.bounce,'#dae46a',6):''}
    ${contactSeen?`<circle cx="${C.project(m.receiver)[0]}" cy="${C.project(m.receiver)[1]}" r="7" fill="none" stroke="#7bddf2" stroke-width="2"/>`:''}
    ${returnSeen?mark(m.target,'#eebc77',8):''}
    <ellipse cx="${sh[0]}" cy="${sh[1]}" rx="4" ry="2" fill="#07170a"/><path d="M ${p[0]} ${p[1]} L ${sh[0]} ${sh[1]}" stroke="#dae46a" stroke-opacity=".4" stroke-dasharray="2 3"/><circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#e3ed76"/>
    ${caption(16,325,s.phase)}${caption(16,344,'Both players right-handed · illustrative flight')}
    </g></svg>`.replace(labels?/$^/:/<text\b[^>]*>[\s\S]*?<\/text>/g,'');
  }
  function events(m){return m.caseId===0?[m.hit,m.bounceAt,m.contactAt]:[m.hit,m.contactAt,m.end];}
  function metrics(m){return {contact:m.contactAt-m.hit,arrival:m.end-m.hit,height:m.receiver[2],depth:m.receiver[1],horizontalReturnSpeed:m.returnDuration?Math.hypot(m.target[0]-m.receiver[0],m.target[1]-m.receiver[1])/m.returnDuration:0};}
  return {cases,model,sample,svg,events,metrics,flight};
});
