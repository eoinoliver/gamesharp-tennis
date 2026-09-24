(function(root,factory){const C=typeof module==='object'&&module.exports?require('./gold-daily-construction.js'):root.GoldDailyConstruction;const api=factory(C);if(typeof module==='object'&&module.exports)module.exports=api;else root.GoldDailyReturnTime=api;})(typeof globalThis==='object'?globalThis:this,function(C){
  'use strict';
  const {project,poly,mix,athlete}=C,kind='return_time',SCALE=1.2,PAIR=3.3;
  const freeze=o=>{Object.values(o).forEach(v=>{if(v&&typeof v==='object')freeze(v);});return Object.freeze(o);};
  const schedules=freeze([
    {read:{total:6.3,questionAt:5.9,cueAt:[.3,1.4,5.55]},answer:{total:9.4,questionAt:0,inkAt:4.35,correctionAt:4.7,correctionInkAt:9.05,cueAt:[0,0,0]}},
    {read:{total:7.4,questionAt:7,cueAt:[.3,1.7,6.5]},answer:{total:14.6,questionAt:0,inkAt:6.9,correctionAt:7.4,correctionInkAt:14.3,cueAt:[0,0,0]}},
    {read:{total:3.5,questionAt:3.1,cueAt:[.3,1.7,2.8]},answer:{total:6.65,questionAt:0,inkAt:3,correctionAt:3.35,correctionInkAt:6.35,cueAt:[0,0,0]}}
  ]);
  const timelines=freeze({return_time:schedules[1]}),kinds=Object.freeze([kind]);
  const rows=freeze([
    {situation:'You wait behind the baseline. Watch the contact available farther forward.',question:'What would test the unused time here?',options:['Move forward; keep useful pace and depth','Stay back; drive towards a wider target','Move back; add height through the middle','Stay back; shorten the return landing depth'],correct:0,unlock:'Take time before adding pace',payoff:'The earlier contact brings this return back sooner at the same useful pace.',principle:'Position can change arrival time before you add return speed.',why:'The same serve offers a reachable forward contact. Keeping pace and target tests its timing benefit; a difficult contact could remove that option.',cues:['1 SERVICE BOUNCE','2 PLAYER START','3 TWO CONTACTS']},
    {situation:'Watch two returns from contact to landing. Compare their arrival clocks.',question:'Why does Return A arrive first here?',options:['The earlier strike saves more than pace recovers','Return A travels faster after racket contact','Return A uses a nearer landing target','Return B starts from a different serve'],correct:0,unlock:'Count the whole journey',payoff:'Extra pace does not recover all the time lost before this later contact.',principle:'Contact time and return flight together determine arrival.',why:'Return B travels faster, but starts later on the same serve towards the same target. Enough extra pace could reverse this comparison.',cues:['1 SERVE LEAVES','2 RACKET CONTACT','3 LANDING CLOCK']},
    {situation:'Your first reachable forward contact is above shoulder height. Watch the continuing ball.',question:'Which response preserves a useful return here?',options:['Keep moving forward and shorten the swing','Hold the baseline and drive the return faster','Give ground and meet the descending ball','Move farther forward and block through the middle'],correct:2,unlock:'Early must still be useful',payoff:'Giving ground reaches a lower, descending ball with time to set.',principle:'Choose a usable contact, not early contact at any cost.',why:'From this start, the low rising ball passes before you can reach it. Another starting position could make that early interception useful.',cues:['1 RECEIVER START','2 FLIGHT CLIMBS','3 SAME TRAJECTORY']}
  ]);
  const clamp=n=>Math.max(0,Math.min(1,n)),g=9.81;
  function flight(a,b,duration,t){if(t<=0)return a.slice();if(t>=duration)return b.slice();const u=clamp(t/duration),p=mix(a,b,u);p[2]+=.5*g*duration*duration*u*(1-u);return p;}
  // Metres and physical seconds. Display runs at 1 / SCALE speed. These are
  // authored ball flights and travel limits, not measured player biomechanics.
  function model(requestedKind,scene,choice,variant=0){
    if(requestedKind!==kind||!rows[scene]||!(choice==null||Number.isInteger(choice)&&choice>=0&&choice<4))throw new Error('Unknown return-time state');
    const hit=.15,bounceAt=1.07,start=[1.2,12.3,2.65],deep=scene===2;
    const bounce=deep?[-1.5,-5.9,0]:[-1.5,-3.3,0],duration=bounceAt-hit;
    const preVz=(0-start[2]+.5*g*duration*duration)/duration;
    const velocity=deep?[-.2,-9,7]:[(bounce[0]-start[0])/duration*.72,(bounce[1]-start[1])/duration*.72,-(preVz-g*duration)*.65];
    let earliest=.38;if(deep){let lo=0,hi=.5;for(let i=0;i<36;i++){const q=(lo+hi)/2,needed=Math.hypot(.05-.2*q,6.2-9*q),available=3*(.59+q);if(needed>available)lo=q;else hi=q;}earliest=hi;}
    let post=scene===1?(variant===0?.28:.66):deep?[.46,(12.5-5.9-.4)/9,1.19,earliest][choice==null?3:choice]:choice==null?.76:[.46,.76,.84,.76][choice];
    const initial=deep?[-1,-12.5,0]:[-1.7,scene===1?-10.5:-12.7,0];
    const contactAt=bounceAt+post,receiver=[bounce[0]+velocity[0]*post,bounce[1]+velocity[1]*post,velocity[2]*post-.5*g*post*post];
    const receiverFoot=[receiver[0]+.55,receiver[1]-.4,0],moveAt=.4,setBefore=.08,maxSpeed=deep?3:4;
    let target=[1.7,9.5,0],returnDuration=scene===1?(variant===0?.95:.78):0;
    if(scene===0){if(choice===1)target=[3.5,9.5,0];if(choice===2)target=[0,9.5,0];if(choice===3)target=[1.7,6.8,0];returnDuration=choice===2?1.55:Math.hypot(target[0]-receiver[0],target[1]-receiver[1])/22;}
    const end=contactAt+returnDuration,observationEnd=deep?bounceAt+1.19:end;
    return {kind,scene,choice,variant,hit,bounceAt,start,bounce,velocity,initial,contactAt,receiver,receiverFoot,moveAt,setBefore,maxSpeed,target,returnDuration,end,observationEnd,post};
  }
  function incoming(m,t){if(t<=m.bounceAt)return flight(m.start,m.bounce,m.bounceAt-m.hit,t-m.hit);const q=Math.max(0,t-m.bounceAt);return [m.bounce[0]+m.velocity[0]*q,m.bounce[1]+m.velocity[1]*q,m.velocity[2]*q-.5*g*q*q];}
  function sample(m,time,observation=false){
    const t=Math.max(0,Math.min(time,observation?m.observationEnd:m.end));
    const ball=observation||t<=m.contactAt||!m.returnDuration?incoming(m,t):flight(m.receiver,m.target,m.returnDuration,t-m.contactAt);
    let far=mix(m.initial,m.receiverFoot,(t-m.moveAt)/(m.contactAt-m.moveAt-m.setBefore));
    if(observation){const earliest=model(kind,2,3);far=mix(m.initial,earliest.receiverFoot,(t-m.moveAt)/(earliest.contactAt-m.moveAt-earliest.setBefore));}
    const near=mix([.65,12.7,0],[0,12.3,0],(t-.45)/1.1);
    const phase=t<m.hit?'Before serve':t<m.bounceAt?'Serve travelling':observation?(t<m.bounceAt+.38?'Ball climbing · receiver moving':'Ball continues without a return'):t<m.contactAt?'After the bounce':!m.returnDuration?'Contact sample':t<=m.contactAt+.02?'Return contact':t<m.end?'Return travelling':'Return lands';
    return {ball,far,near,phase,t,descending:t>m.bounceAt&&m.velocity[2]-g*(t-m.bounceAt)<0};
  }
  function metrics(m){return {contact:m.contactAt-m.hit,arrival:m.end-m.hit,height:m.receiver[2],depth:m.receiver[1],flight:m.returnDuration,horizontalReturnSpeed:m.returnDuration?Math.hypot(m.target[0]-m.receiver[0],m.target[1]-m.receiver[1])/m.returnDuration:0,travelSpeed:Math.hypot(m.receiverFoot[0]-m.initial[0],m.receiverFoot[1]-m.initial[1])/(m.contactAt-m.moveAt-m.setBefore)};}
  function requiredSpeed(m,post){const ball=incoming(m,m.bounceAt+post),foot=[ball[0]+.55,ball[1]-.4,0],available=m.bounceAt+post-m.moveAt-m.setBefore;return available>0?Math.hypot(foot[0]-m.initial[0],foot[1]-m.initial[1])/available:Infinity;}
  const ring=(point,colour,r=6)=>{const p=project(point);return `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="none" stroke="${colour}" stroke-width="2"/>`;};
  const text=(x,y,value,size=12)=>`<text x="${x}" y="${y}" fill="#dce4ce" font-size="${size}">${value}</text>`;
  function heightStrip(m,s,observation){
    const sx=y=>80+(-y-6)*27,sy=z=>422-z*19,points=[];
    for(let q=m.bounceAt;q<=Math.min(s.t,observation?m.observationEnd:m.contactAt);q+=.015){const p=incoming(m,q);points.push(sx(p[1])+','+sy(p[2]));}
    if(s.t>=m.bounceAt)points.push(sx(s.ball[1])+','+sy(s.ball[2]));
    return `<rect x="10" y="357" width="460" height="82" rx="7" fill="#193522"/>
    ${text(18,371,'Side view · height above the court',11)}<path d="M76 422H446 M76 392.55H446" stroke="#839779" stroke-dasharray="3 3"/>${text(18,394,'Shoulder',10)}${text(18,425,'Court',10)}
    <polyline points="${points.join(' ')}" fill="none" stroke="#dae46a" stroke-width="1.8"/>
    ${s.t>=m.bounceAt?`<circle cx="${sx(s.ball[1])}" cy="${sy(s.ball[2])}" r="4" fill="#e3ed76"/>`:''}
    <path d="M${sx(m.initial[1]+.4)} 417v10" stroke="#9caebc"/><path d="M${sx(s.far[1]+.4)} 417v10" stroke="#e0e6da" stroke-width="3"/>${text(18,449,observation?'Same ball · no return struck':`Contact ${m.receiver[2].toFixed(2)} m · ${s.descending?'descending':'high contact'}`,11)}`;
  }
  function svg(m,time,observation=false){
    const s=sample(m,time,observation),p=project(s.ball),shadow=project([s.ball[0],s.ball[1],0]),atContact=!observation&&s.t>=m.contactAt;
    const trail=[];for(let q=m.hit;q<s.t;q+=.03)trail.push(sample(m,q,observation).ball);trail.push(s.ball);
    const shoulder=1.55,early=m.scene===2?model(kind,2,3):null,late=m.scene===2?model(kind,2,2):null;
    const earlySeen=observation&&s.t>=early.contactAt,lateSeen=observation&&s.t>=late.contactAt;
    const lowPost=.2,lowBall=observation&&s.t>=m.bounceAt+lowPost?incoming(m,m.bounceAt+lowPost):null;
    const lowFoot=lowBall?mix(m.initial,early.receiverFoot,(m.bounceAt+lowPost-m.moveAt)/(early.contactAt-m.moveAt-m.setBefore)):null;
    let evidence='';
      if(m.scene===2){
      const at=observation?early.receiverFoot:m.receiverFoot;
      if(atContact||earlySeen)evidence+=`<polyline points="${poly([[at[0]-.5,at[1]+.4,shoulder],[at[0]+.5,at[1]+.4,shoulder]])}" stroke="#c5cce0" stroke-dasharray="3 3"/>`;
      if(lowBall)evidence+=ring(lowBall,'#a9b7a2',4)+`<g opacity=".28">${athlete(lowFoot,'THEN','#bfcbd7',null)}<polyline points="${poly([[lowBall[0],lowBall[1],0],lowFoot])}" stroke="#bfcbd7" stroke-dasharray="2 3" fill="none"/></g>`;
      if(earlySeen)evidence+=ring(early.receiver,'#c7d4e7',7);
      if(lateSeen)evidence+=ring(late.receiver,'#c7d4e7',7);
    }
    const contact=atContact?m.receiver:earlySeen?early.receiver:null;
    const summary=m.scene===2?(observation?(lateSeen?`Forward window ${early.receiver[2].toFixed(2)} m · later window ${late.receiver[2].toFixed(2)} m`:'Same ball · starting position shown'):atContact?`Contact ${m.receiver[2].toFixed(2)} m · ${s.descending?'descending':'near the top / rising'}`:'Read height against the shoulder bar'):
      s.t>=m.end?`Contact ${(m.contactAt-m.hit).toFixed(2)} s · landing ${(m.end-m.hit).toFixed(2)} s`:s.t>=m.contactAt?`Contact ${(m.contactAt-m.hit).toFixed(2)} s · return in flight`:'Clock begins at serve strike';
    return `<svg viewBox="0 0 480 450" role="img" aria-label="${s.phase}. Original return timing and reachable-contact example."><rect width="480" height="450" rx="12" fill="#10291a"/><g transform="translate(0 70)"><polygon points="${poly([[-4.115,-11.885,0],[4.115,-11.885,0],[4.115,11.885,0],[-4.115,11.885,0]])}" fill="#244b32" stroke="#abbca2"/><g stroke="#abbca2" fill="none"><polyline points="${poly([[-4.115,-6.4,0],[4.115,-6.4,0]])}"/><polyline points="${poly([[-4.115,6.4,0],[4.115,6.4,0]])}"/><polyline points="${poly([[0,-6.4,0],[0,6.4,0]])}"/></g><polygon points="${poly([[-4.115,0,0],[-4.115,0,1.07],[0,0,.914],[4.115,0,1.07],[4.115,0,0]])}" fill="#d8ddc7" fill-opacity=".13" stroke="#d8ddc7"/>
    <g opacity=".25">${athlete(m.initial,'START','#bfcbd7',null)}</g><polyline points="${poly([m.initial,s.far])}" stroke="#bfcbd7" stroke-dasharray="3 4" fill="none"/>
    ${evidence}${athlete(s.far,'YOU','#bfcbd7',contact)}${athlete(s.near,'SERVER','#e8dfbf',s.t<=m.hit?m.start:null)}
    <polyline points="${poly(trail)}" fill="none" stroke="#dae46a" stroke-opacity=".55" stroke-width="2"/>
    ${s.t>=m.bounceAt?ring(m.bounce,'#dae46a',5):''}${atContact?ring(m.receiver,'#7bddf2',7):''}${!observation&&m.returnDuration&&s.t>=m.end?ring(m.target,'#eebc77',7):''}
    <ellipse cx="${shadow[0]}" cy="${shadow[1]}" rx="4" ry="2" fill="#07170a"/><path d="M ${p[0]} ${p[1]} L ${shadow[0]} ${shadow[1]}" stroke="#dae46a" stroke-opacity=".4" stroke-dasharray="2 3"/><circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#e3ed76"/></g>
    ${m.scene===2?heightStrip(m,s,observation):text(16,391,s.phase)+text(16,411,summary)+text(16,432,'Illustrative clocks · no guaranteed next ball',11)}</svg>`;
  }
  function timelineFor(step,answered){return schedules[step.visual.scene][answered?'answer':'read'];}
  function frame(m,seconds,title,reduced,observation=false,limit){const end=limit==null?(observation?m.observationEnd:m.end):limit;return `<div class="gd-sequence-frame" data-return-choice="${m.choice}"><div class="gd-sequence-caption">${title}</div>${svg(m,reduced?end:Math.min(end,Math.max(0,seconds)/SCALE),observation)}</div>`;}
  function pair(scene,choice,seconds,reduced,title){
    const a=model(kind,scene,choice,0),b=model(kind,scene,choice,1);
    if(reduced)return frame(a,0,title+' · Return A',true)+frame(b,0,title+' · Return B',true)+'<div class="gd-sequence-caption">Return A: contact 1.20 s · landing 2.15 s<br>Return B: contact 1.58 s · landing 2.36 s</div>';
    let html=seconds<PAIR?frame(a,seconds,title+' · Return A',false):frame(b,seconds-PAIR,title+' · Return B',false);
    if(seconds>=PAIR)html+=`<div class="gd-sequence-caption">Return A: contact 1.20 s · landing 2.15 s${seconds>=PAIR+b.end*SCALE?' · Return B: contact 1.58 s · landing 2.36 s':''}</div>`;
    return html;
  }
  function render(step,selected,seconds,reduced){
    const scene=step.visual.scene;
    if(selected==null){
      if(scene===1)return pair(scene,null,seconds,reduced,'Compare the observed returns');
      if(scene===2)return frame(model(kind,scene,null),seconds,'Your start · one continuing ball',reduced,true);
      const original=model(kind,0,null),early=model(kind,0,0);
      if(reduced)return frame(original,0,'Your usual return',true)+frame(early,0,'Same serve · forward contact window',true,false,early.contactAt);
      return seconds<3.7?frame(original,seconds,'Your usual return',false):frame(early,seconds-3.7,'Same serve · forward contact window',false,false,early.contactAt);
    }
    const timeline=timelineFor(step,true),own='Your choice '+String.fromCharCode(65+selected),better='Compare '+String.fromCharCode(65+step.correct)+' · same situation';
    const choiceFrame=(choice,t,title)=>scene===1?pair(scene,choice,t,reduced,title):frame(model(kind,scene,choice),t,title,reduced);
    if(selected!==step.correct){if(reduced)return choiceFrame(selected,0,own)+choiceFrame(step.correct,0,better);if(seconds>=timeline.correctionAt)return choiceFrame(step.correct,seconds-timeline.correctionAt,better);}
    return choiceFrame(selected,seconds,own);
  }
  function events(step,selected){
    const scene=step.visual.scene,one=(m,offset=0,contact=true)=>[{at:offset+m.hit*SCALE,kind:'contact',audio:'serve',volume:.32},{at:offset+m.bounceAt*SCALE,kind:'court',audio:'bounce',volume:.2},...(contact?[{at:offset+m.contactAt*SCALE,kind:'contact',audio:'ground',volume:.3}]:[]),...(contact&&m.returnDuration?[{at:offset+m.end*SCALE,kind:'court',audio:'bounce',volume:.2}]:[])];
    const sequence=(choice,offset=0)=>scene===1?one(model(kind,scene,choice,0),offset).concat(one(model(kind,scene,choice,1),offset+PAIR)):one(model(kind,scene,choice),offset);
    if(selected==null){if(scene===0)return one(model(kind,0,null)).concat(one(model(kind,0,0),3.7,false));if(scene===2)return one(model(kind,2,null),0,false);return sequence(null);}
    return sequence(selected).concat(selected!==step.correct?sequence(step.correct,timelineFor(step,true).correctionAt):[]);
  }
  function audit(step){
    const errors=[],scene=step.visual.scene;
    if(step.visual.kind!==kind||!rows[scene]||step.correct!==rows[scene].correct)return ['Unbound return-time decision'];
    for(let choice=0;choice<4;choice++)for(const variant of scene===1?[0,1]:[0]){
      const m=model(kind,scene,choice,variant),v=metrics(m);
      if(!(m.hit<m.bounceAt&&m.bounceAt<m.contactAt&&m.contactAt<=m.end))errors.push('Invalid return event order');
      if(m.bounce[0]*m.start[0]>=0||Math.abs(m.bounce[0])>=4.115||m.bounce[1]>=0||m.bounce[1]<=-6.4)errors.push('Serve misses diagonal service box');
      if(v.travelSpeed>m.maxSpeed)errors.push('Receiver exceeds authored travel limit');
      let previous=sample(m,m.hit).ball;
      for(let t=m.hit+.005;t<=m.end;t+=.005){const p=sample(m,t).ball;if(!p.every(Number.isFinite)||p[2]<-.001)errors.push('Invalid ball state');if(p[1]*previous[1]<0&&p[2]<1.08)errors.push('Net clearance failure');previous=p;}
    }
    if(scene===2){const m=model(kind,2,2);for(let q=.001;q<7/g;q+=.002){const p=incoming(m,m.bounceAt+q);if(p[2]<=1.6&&requiredSpeed(m,q)<=m.maxSpeed)errors.push('Early low interception is reachable');}if(m.receiver[2]>1.6||7-g*m.post>=0)errors.push('Retreat did not reach a lower descending contact');}
    return [...new Set(errors)];
  }
  function lessons(spines){const s=spines.byId.return_second_serve_steal_time;return [{id:s.prototypeId,slug:s.slug,lessonSpineId:s.id,reviewOnly:true,attentionPolicy:'evidence-first',title:s.title,memory:s.memory,insight:s.painHook,takeItToCourt:s.tomorrowAction,proInsight:s.proInsight,steps:rows.map((r,i)=>({...r,phase:['See · Notice the time','Contrast · Compare arrival','Transfer · Check the contact'][i],decisionLens:s.prototypeDecisionLenses[i],transfer:i===2,options:r.options.map((value,j)=>({id:String.fromCharCode(65+j),text:value})),visual:{kind,scene:i,label:s.title,description:'Original illustrative serve and return clocks; contact positions obey the same authored movement limit. No spin or stroke diagnosis.',cues:r.cues,answerCues:i===2?['1 SERVE BOUNCES','2 PLAYER MOVES','3 HEIGHT SHOWN']:['1 SERVE BOUNCES','2 RETURN CONTACT','3 RETURN LANDING']}}))}];}
  return Object.freeze({kinds,timelines,timelineFor,model,sample,incoming,metrics,requiredSpeed,svg,render,events,audit,lessons});
});
