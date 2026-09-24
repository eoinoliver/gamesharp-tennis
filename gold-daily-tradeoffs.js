(function(root,factory){const court=typeof module==='object'&&module.exports?require('./gold-daily-construction.js'):root.GoldDailyConstruction;const api=factory(court);if(typeof module==='object'&&module.exports)module.exports=api;else root.GoldDailyTradeoffs=api;})(typeof globalThis==='object'?globalThis:this,function(court){
  'use strict';
  const {project,poly,arc,mix,athlete}=court;
  const kinds=['score_pressure','inside_out_consequence','net_close_timing'];
  const timelines=Object.freeze(Object.fromEntries(kinds.map(kind=>[kind,Object.freeze({read:Object.freeze({total:5.7,questionAt:5.3,cueAt:Object.freeze([1.95,3.0,4.7])}),answer:Object.freeze({total:8.4,questionAt:0,inkAt:3.85,correctionAt:4.2,correctionInkAt:8.05,cueAt:Object.freeze([0,0,0])})})])));
  const rows={
    score_pressure:[
      {situation:'You lead 5–2. Compare your earlier rally ball with the latest one.',question:'Which adjustment protects the useful pattern?',options:['Keep the shorter landing and add pace','Restore depth into the broad crosscourt area','Attack down the line near the corner','Float short through the central channel'],correct:1,unlock:'Protect the construction',payoff:'The broad, deeper ball moves their contact back without demanding a sideline.',principle:'A bigger margin need not mean donating a shorter ball.',why:'The latest landing let them step in; the score did not change the available court. Keep useful depth unless the ball or opponent gives a reason to change.',cues:['1 EARLIER CONTACT BACK','2 SCORE NOW 5–2','3 LATEST CONTACT INSIDE']},
      {situation:'Still leading, you see them waiting in your crosscourt lane before your comfortable contact.',question:'Which adjustment uses the new evidence?',options:['Repeat deep toward their waiting position','Shorten the ball into their waiting lane','Drive into the broad down-the-line area','Aim closer to the crosscourt sideline'],correct:2,unlock:'Loyal is not rigid',payoff:'The generous line target moves the waiting opponent across instead of feeding their position.',principle:'Protect the intention, not a direction the opponent now covers.',why:'The opponent changed, so changing direction has a reason beyond the score. This balanced contact supports the switch; a low or stretched ball may not.',cues:['1 EARLIER CROSSCOURT','2 SAME LEAD','3 OPPONENT WAITING THERE']},
      {situation:'At 5–4, this ball pushes you back. Their position is central.',question:'What preserves a workable next ball?',options:['Drive firmly down the near sideline','Play short crosscourt and move forward','Attack the far corner with extra pace','Lift deep centrally and recover behind it'],correct:3,unlock:'Read this ball first',payoff:'Height and depth buy recovery time from this deeper contact.',principle:'Commitment can mean rebuilding the rally rather than forcing the old attack.',why:'The incoming depth changed your available contact, not merely your feelings about the score. A shorter, comfortable ball could restore the attacking pattern.',cues:['1 BOUNCE NEAR BASELINE','2 CONTACT FURTHER BACK','3 OPPONENT CENTRAL']}
    ],
    inside_out_consequence:[
      {situation:'Watch your runaround forehand. Their balanced contact leaves two possible reply lanes.',question:'On this ball, which construction costs less?',options:['Run around and drive inside out','Play the backhand deep across court','Run around and drive down the line','Run around and land short across court'],correct:1,unlock:'Count the next distance',payoff:'The backhand keeps you nearer the recovery position before their balanced reply.',principle:'A stronger wing does not automatically repay the court you leave.',why:'This deep ball offers little displacement against a ready opponent. The forehand can work, but its extra recovery cost needs a compensating advantage.',cues:['1 CONTACT WIDE LEFT','2 RECEIVER SET','3 TWO REPLY LANES']},
      {situation:'Now the ball is shorter. You arrive inside while they are stranded left.',question:'Which construction earns the extra movement?',options:['Use the forehand deep inside out','Play the backhand toward their waiting side','Run around and hit toward their position','Use a short central forehand and recover'],correct:0,unlock:'The cost can be worth it',payoff:'The inside-out forehand makes this opponent travel while your recovery starts from inside.',principle:'Running around earns its place when the contact creates a real positional advantage.',why:'This is not a ban on forehands from the backhand side. Earlier contact and an opponent across the court change the trade-off; a good reply remains possible.',cues:['1 CONTACT FURTHER FORWARD','2 RECEIVER FAR LEFT','3 SPACE ACROSS FROM THEM']},
      {situation:'A deep ball arrives wider. Your opponent is central and ready again.',question:'Which choice best preserves your recovery?',options:['Run around and accelerate down the line','Run around and angle short across court','Lift the backhand deep through the middle','Run around and drive deep across court'],correct:2,unlock:'Do not pay twice',payoff:'The lifted backhand adds flight time without taking another step outside for a forehand.',principle:'When depth and width remove time, protect space before upgrading your wing.',why:'A central deep ball reduces the immediate angle while you recover. A short central ball would not do the same job, and an earlier arrival could change the choice.',cues:['1 WIDER INCOMING BALL','2 YOU BEHIND BASELINE','3 RECEIVER READY AGAIN']}
    ],
    net_close_timing:[
      {situation:'Your approach is deep. Watch your feet when they strike the pass.',question:'What improves your readiness for either side?',options:['Carry the forward stride through their contact','Choose the line and move there early','Split earlier and wait flat-footed there','Time the split around their contact'],correct:3,unlock:'Arrive ready, not merely closer',payoff:'The timed landing releases a sideways response while the extra stride is still finishing.',principle:'Forward distance helps only when you can respond to the pass.',why:'The example changes the footwork, not the approach. It does not guarantee a volley; read the first flight and push toward the actual pass.',cues:['1 APPROACH LANDS DEEP','2 THEIR RACKET CONTACT','3 YOUR STRIDE CONTINUES']},
      {situation:'You split on their contact. The reply now floats slowly above the net.',question:'What should you do with this time?',options:['Stay at the first split-step position','Move forward beneath the floating reply','Retreat toward the service line again','Move sideways before reading its landing'],correct:1,unlock:'Balance is not a parking place',payoff:'After reading the float, moving in brings your contact closer to the net.',principle:'Split to read the reply, then use the time it actually gives.',why:'The slow flight permits another forward move. A firm low pass would leave less time; do not treat the first split position as a permanent destination.',cues:['1 TIMED LANDING','2 BALL CLIMBS','3 SLOW FLIGHT CONTINUES']},
      {situation:'From the other side, their earlier contact leaves you farther from the net.',question:'Which priority fits the shorter approach time?',options:['Balance for contact from this deeper position','Reach the previous distance before splitting','Commit toward the open sideline before contact','Use another stride before reacting sideways'],correct:0,unlock:'The clock beats the landmark',payoff:'Preparing deeper makes the response available sooner than chasing the previous stopping point.',principle:'Opponent contact sets the preparation deadline, not a fixed court position.',why:'A quicker opponent contact can leave you farther back at the split. Close again if the reply permits; the diagram shows one possible pass, not a guaranteed interception.',cues:['1 OTHER APPROACH SIDE','2 EARLIER OPPONENT CONTACT','3 YOU STILL FURTHER BACK']}
    ]
  };
  // All coordinates in metres, near side positive y. No simulated point score,
  // win probability or inferred emotion. The two dashed rays are possible replies.
  function model(kind,scene,choice,previous=false){
    const net=kind==='net_close_timing',bill=kind==='inside_out_consequence';
    let start=[2.2,11.1,1],near=[1.65,11.5,0],far=[0,-12,0],bounce=[-2.3,-9.8,0],receive=1.9,hit=.15,bounceAt=1.3,end=3.6;
    let lift=1.8,action='',targetWidth=1.8,stopAt=1.9,splitAt=1.9;
    if(kind==='score_pressure'){
      if(scene===0){bounce=previous?[-2.3,-9.8,0]:choice==null?[-2.3,-4.4,0]:[[-2.3,-4.4,0],[-2.3,-9.8,0],[3.8,-11.3,0],[0,-4.2,0]][choice];targetWidth=choice===2?.4:1.8;}
      if(scene===1){far=previous?[0,-12,0]:[-2.6,-12,0];bounce=choice==null||previous?[-2.3,-9.8,0]:[[-2.3,-9.8,0],[-2.3,-4.4,0],[2.7,-9.8,0],[-3.8,-11.3,0]][choice];targetWidth=choice===3?.4:1.8;}
      if(scene===2){start=[2.8,13,1];near=[2.25,13.4,0];bounce=choice==null?[0,-9.6,0]:[[3.8,-11.3,0],[-2.8,-4.2,0],[-3.8,-11.3,0],[0,-9.6,0]][choice];lift=choice===3||choice==null?2:1.8;receive=choice===3||choice==null?2.6:1.9;bounceAt=receive-.6;}
    }else if(bill){
      const fh=choice==null||!(scene===0&&choice===1||scene===1&&choice===1||scene===2&&choice===2);
      start=[scene===2?-3.7:-3,scene===1?8.4:scene===2?13:12.2,1];near=[start[0]+(fh?-.6:.6),start[1]+.4,0];
      far=scene===1?[-3,-11.6,0]:scene===2?[0,-11.9,0]:[1.8,-11.9,0];
      bounce=scene===0?[[2.5,-9.6,0],[2.5,-9.6,0],[-2.7,-9.6,0],[3,-4,0]][choice==null?0:choice]:scene===1?[[2.6,-10,0],[-2.6,-9.6,0],[-2.6,-9.6,0],[0,-4,0]][choice==null?0:choice]:[[-2.9,-9.5,0],[3,-4,0],[0,-9.6,0],[2.6,-9.6,0]][choice==null?3:choice];
      if(scene===2&&(choice===2)){lift=2;receive=2.6;bounceAt=2;}
      action=fh?'Forehand · runaround position':'Backhand · keep court position';
    }else if(net){
      const sign=scene===2?-1:1;
      start=[sign*2.5,6.8,1.05];near=[sign*2,7.2,0];far=[sign*2.2,-11.7,0];bounce=[sign*2.6,-10,0];
      receive=scene===2?1.35:1.9;bounceAt=receive-.5;
      const c=choice==null?(scene===0?0:scene===1?1:1):choice;
      stopAt=scene===0?[2.55,1.85,1.45,1.9][c]:scene===1?1.9:[1.35,2.1,1.35,2.05][c];
      splitAt=scene===0?[2.55,1.85,1.2,1.9][c]:scene===1?1.9:[1.35,2.1,1.35,2.05][c];
      action='Close, prepare, then respond';
    }
    if(kind==='score_pressure'&&((scene===0&&choice===0)||(scene===2&&choice===2))){receive=1.55;bounceAt=1.05;}
    const receiver=[bounce[0],bounce[1]-1.55,1],receiverFoot=[receiver[0]+.55,receiver[1]-.4,0];
    const recover=[bill?-.4:0,12.2,0],replyEnds=[[-3.6,10.5,0],[3.6,10.5,0]];
    return {kind,scene,choice,start,near,far,bounce,receiver,receiverFoot,hit,bounceAt,receive,end,lift,action,targetWidth,stopAt,splitAt,recover,replyEnds};
  }
  function sample(m,t){
    if(t<0){const origin=[m.far[0]-.55,m.far[1]+.4,1],bounce=[m.start[0]*.94,m.start[1]-1.6,0];return {ball:t<-.55?arc(origin,bounce,(t+1.4)/.85,1.6):arc(bounce,m.start,(t+.55)/.55,.2),near:mix([m.near[0]*.45,11.5,0],m.near,(t+1.4)/1.4),far:m.far,phase:t<-.55?'Incoming ball':'Incoming bounce · arriving behind it',split:0};}
    let ball=t<=m.bounceAt?arc(m.start,m.bounce,(t-m.hit)/(m.bounceAt-m.hit),m.lift):arc(m.bounce,m.receiver,(t-m.bounceAt)/(m.receive-m.bounceAt),.2);
    let near=mix(m.near,m.recover,(t-m.hit)/3.5),far=mix(m.far,m.receiverFoot,(t-m.hit)/(m.receive-m.hit)),phase=t<m.hit?'Your contact':t<m.bounceAt?'Ball travelling':t<m.receive?'After the bounce':'Their contact · possible replies';
    let split=0;
    if(m.kind==='net_close_timing'){
      const sign=m.scene===2?-1:1,closeY=7.2-1.65*Math.max(0,Math.min(t,m.stopAt)-m.hit);
      near=[sign*1.9,closeY,0];
      const chosen=m.choice==null?(m.scene===0?0:m.scene===1?1:1):m.choice;
      if((m.scene===0&&chosen===1)||(m.scene===2&&chosen===2))near[0]=mix([sign*1.9],[sign*3.4],(t-.45)/(m.receive-.45))[0];
      split=Math.max(0,1-Math.abs(t-(m.splitAt-.10))/.16);near[2]=split*.12;
      if(t>m.receive){
        const float=m.scene===1,endY=float?1.7:4,pass=[sign*-.5,endY,float?1.65:.85];
        ball=arc(m.receiver,pass,(t-m.receive)/(m.end-m.receive),float?1.4:.6);
        const c=m.choice==null?(m.scene===0?0:m.scene===1?1:1):m.choice;
        const reaction=Math.max(m.receive+.15,m.stopAt+.1),u=Math.max(0,t-reaction)/(m.end-reaction);
        let destination=float?c===0?[sign*1.9,4.31,0]:c===1?[pass[0]-.55,2.1,0]:c===2?[sign*1.9,6.4,0]:[sign*3.4,4.31,0]:[pass[0]-.55,4.4,0];
        if((m.scene===0&&c===1)||(m.scene===2&&c===2))destination=[sign*3.4,4.4,0];
        // Slow the lateral response after an unfinished stride; do not silently
        // grant every alternative the same arrival at the pass.
        const available=Math.min(1,Math.max(0,t-reaction)/1.6);
        near=mix(near,destination,float?u:available);
        phase=float?'Floating reply · time to move again':t<m.stopAt?'Pass leaves · forward stride finishing':'Pass travelling · lateral response';
      }
    }
    return {ball,near,far,phase,split};
  }
  function svg(m,t){
    const s=sample(m,t),p=project(s.ball),shadow=project([s.ball[0],s.ball[1],0]);
    const path=[];for(let q=t<0?-1.4:m.hit;q<t;q+=.04)path.push(sample(m,q).ball);path.push(s.ball);
    const net=m.kind==='net_close_timing',bill=m.kind==='inside_out_consequence',atContact=t>=m.receive;
    const lanes=atContact?m.replyEnds.map(end=>'<polyline points="'+poly([m.receiver,end])+'" stroke="#b2bdce" stroke-width="1.2" stroke-dasharray="5 5" fill="none"/>').join(''):'';
    const half=m.targetWidth/2,target=[[m.bounce[0]-half,m.bounce[1]-.45,0],[m.bounce[0]+half,m.bounce[1]-.45,0],[m.bounce[0]+half,m.bounce[1]+.45,0],[m.bounce[0]-half,m.bounce[1]+.45,0]];
    const zone=m.kind==='score_pressure'?'<polygon points="'+poly(target)+'" fill="#cfdbab" fill-opacity=".12" stroke="#cfdbab" stroke-dasharray="3 3"/>':'';
    const footer=bill?m.action:net?'Schematic timing · no guaranteed interception':'Schematic target choice · no inferred emotion';
    const ghosts=t>m.hit?'<g opacity=".3">'+athlete(m.far,'START','#bfcbd7',null)+athlete(m.near,'START','#e8dfbf',m.start)+'</g><polyline points="'+poly([m.far,s.far])+'" stroke="#bfcbd7" stroke-dasharray="2 4" fill="none"/>':'';
    const clockX=at=>120+at*70;
    const timing=net?'<g fill="#d6dec9" font-size="10"><text x="18" y="302">Their contact</text><text x="18" y="317">Your split lands</text><path d="M120 299H320 M120 314H320" stroke="#6f856e"/><circle cx="'+clockX(m.receive)+'" cy="299" r="3" fill="#bfcbd7"/><circle cx="'+clockX(m.splitAt)+'" cy="314" r="3" fill="#e8dfbf"/><path d="M'+clockX(Math.min(2.8,Math.max(0,t)))+' 293v26" stroke="#dae46a"/>'+((t>=m.receive)?'<text x="330" y="309">Same clock</text>':'')+'</g>':'';
    return '<svg viewBox="0 0 480 350" role="img" aria-label="'+footer+'. '+s.phase+'"><rect width="480" height="350" rx="12" fill="#10291a"/><polygon points="'+poly([[-4.115,-11.885,0],[4.115,-11.885,0],[4.115,11.885,0],[-4.115,11.885,0]])+'" fill="#244b32" stroke="#abbca2"/><g stroke="#abbca2" fill="none"><polyline points="'+poly([[-4.115,-6.4,0],[4.115,-6.4,0]])+'"/><polyline points="'+poly([[-4.115,6.4,0],[4.115,6.4,0]])+'"/><polyline points="'+poly([[0,-6.4,0],[0,6.4,0]])+'"/></g><polygon points="'+poly([[-4.115,0,0],[-4.115,0,1.07],[0,0,.914],[4.115,0,1.07],[4.115,0,0]])+'" fill="#d8ddc7" fill-opacity=".13" stroke="#d8ddc7"/>'+zone+lanes+
      ghosts+athlete(s.far,'THEM','#bfcbd7',atContact&&(!net||t<=m.receive+.05)?m.receiver:null)+athlete(s.near,'YOU','#e8dfbf',t>=0&&t<=m.hit?m.start:null)+
      '<polyline points="'+poly(path)+'" fill="none" stroke="#dce76a" stroke-opacity=".5" stroke-width="2"/><ellipse cx="'+shadow[0]+'" cy="'+shadow[1]+'" rx="4" ry="2" fill="#07170a"/><path d="M '+p.join(' ')+' L '+shadow.join(' ')+'" stroke="#dae46a" stroke-dasharray="2 3"/><circle cx="'+p[0]+'" cy="'+p[1]+'" r="4" fill="#e3ed76"/>'+
      (bill&&atContact?'<polyline points="'+poly([m.near,s.near])+'" stroke="#e8dfbf" stroke-dasharray="3 3" fill="none"/><text x="18" y="316" fill="#dce3cb" font-size="11">Recovery travelled: '+Math.hypot(s.near[0]-m.near[0],s.near[1]-m.near[1]).toFixed(1)+' m · illustrative</text>':'')+
      timing+'<text x="18" y="332" fill="#c6d2bf" font-size="11">'+s.phase+'</text><text x="18" y="346" fill="#aebea8" font-size="10">'+footer+'</text></svg>';
  }
  function render(step,selected,seconds,reduced){
    const kind=step.visual.kind,scene=step.visual.scene;
    const frame=(choice,t,title,previous=false)=>{const m=model(kind,scene,choice,previous);return '<div class="gd-sequence-frame"><div class="gd-sequence-caption">'+title+'</div>'+svg(m,reduced?m.end:Math.min(m.end,t))+'</div>';};
    if(selected==null){
      if(kind==='net_close_timing'&&scene===1)return frame(0,seconds,'After your split · read the floating ball');
      if(scene===2&&kind==='score_pressure'){const m=model(kind,scene,null);return '<div class="gd-sequence-frame"><div class="gd-sequence-caption">Incoming ball · read depth and arrival</div>'+svg(m,reduced?-.001:Math.min(-.001,seconds-1.4))+'</div>';}
      if(scene===2&&kind!=='net_close_timing'){const m=model(kind,scene,null);const incoming='<div class="gd-sequence-frame"><div class="gd-sequence-caption">Incoming ball · read depth and arrival</div>'+svg(m,reduced?-.01:seconds-1.4)+'</div>';if(reduced)return incoming+frame(null,0,'Then read the available court');if(seconds<1.4)return incoming;return frame(null,seconds-1.4,kind==='inside_out_consequence'?'Example attempt · judge the starting position':'Now read the available court');}
      if(kind==='score_pressure'&&scene<2){if(reduced)return frame(null,0,'Earlier rally · 4–2',true)+frame(null,0,'Latest rally · 5–2');return seconds<2.6?frame(null,seconds,'Earlier rally · 4–2',true):frame(null,seconds-2.6,'Latest rally · 5–2');}
      return frame(null,seconds,kind==='score_pressure'?'New incoming depth · 5–4':kind==='inside_out_consequence'?'Example attempt · compare shot and recovery':'Watch the approach, contact and feet');
    }
    const own='Your choice '+String.fromCharCode(65+selected)+' · illustrative construction',compare='Compare '+String.fromCharCode(65+step.correct)+' · same starting situation';
    if(selected!==step.correct){if(reduced)return frame(selected,0,own)+frame(step.correct,0,compare);if(seconds>=4.2)return frame(step.correct,seconds-4.2,compare);}
    return frame(selected,seconds,own);
  }
  function events(step,selected){const one=(choice,offset=0,previous=false)=>{const m=model(step.visual.kind,step.visual.scene,choice,previous);return [{at:m.hit+offset,kind:'contact',audio:'ground',volume:.3},{at:m.bounceAt+offset,kind:'court',audio:'bounce',volume:.2},...(m.kind==='net_close_timing'?[{at:m.receive+offset,kind:'contact',audio:'ground',volume:.3}]:[])];};if(selected==null&&step.visual.scene===2&&step.visual.kind==='score_pressure')return [{at:.85,kind:'court',audio:'bounce',volume:.2}];if(selected==null&&step.visual.scene===2&&step.visual.kind!=='net_close_timing')return [{at:.85,kind:'court',audio:'bounce',volume:.2}].concat(one(null,1.4));if(selected==null)return step.visual.kind==='score_pressure'&&step.visual.scene<2?one(null,0,true).concat(one(null,2.6)):one(null);return one(selected).concat(selected!==step.correct?one(step.correct,4.2):[]);}
  function audit(step){const errors=[],kind=step.visual.kind,scene=step.visual.scene;if(!rows[kind]?.[scene]||step.correct!==rows[kind][scene].correct)return ['Unbound trade-off decision'];for(let c=0;c<4;c++){const m=model(kind,scene,c);if(!(m.hit<m.bounceAt&&m.bounceAt<m.receive&&m.receive<m.end))errors.push('Invalid event order');if(Math.abs(m.bounce[0])>=4.115||m.bounce[1]>=0||m.bounce[1]<=-11.885)errors.push('Illegal landing');let prior=sample(m,m.hit).ball;for(let t=m.hit+.005;t<=m.end;t+=.005){const p=sample(m,t).ball;if(p[1]*prior[1]<0&&p[2]<1.08)errors.push('Net clearance failure');prior=p;}if(Math.hypot(m.receiverFoot[0]-m.far[0],m.receiverFoot[1]-m.far[1])/(m.receive-m.hit)>7)errors.push('Unreachable opponent contact');}return [...new Set(errors)];}
  const bindings=['mental_lead_shrinks_game','forehand_inside_out_recovery_bill','net_close_without_opening_pass'];
  function lessons(spines){return bindings.map((id,index)=>{const s=spines.byId[id];return {id:s.prototypeId,slug:s.slug,lessonSpineId:s.id,reviewOnly:true,attentionPolicy:'evidence-first',title:s.title,memory:s.memory,insight:s.painHook,takeItToCourt:s.tomorrowAction,proInsight:s.proInsight,steps:rows[kinds[index]].map((r,i)=>({...r,phase:['See · Notice the cost','Contrast · Change the evidence','Transfer · Read the new situation'][i],decisionLens:s.prototypeDecisionLenses[i],transfer:i===2,options:r.options.map((text,j)=>({id:String.fromCharCode(65+j),text})),visual:{kind:kinds[index],scene:i,label:s.title,description:'Original metre-based schematic: authored landing, opponent position and movement timing; dashed rays show possible replies, not predicted results.',cues:r.cues,answerCues:['1 YOUR CONTACT','2 BALL BOUNCES','3 NEXT CONTACT AND MOVEMENT']}}))};});}
  return Object.freeze({kinds,timelines,model,sample,render,events,audit,lessons});
});
