(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GoldDailyConstruction=api;})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  // Original, illustrative rallies. Positions are metres; the far player faces
  // positive y. Both players remain right-handed when the service court changes.
  const clamp=n=>Math.max(0,Math.min(1,n));
  const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*clamp(t));
  const arc=(a,b,t,lift)=>{const u=clamp(t),p=mix(a,b,u);p[2]+=4*lift*u*(1-u);return p;};
  const freeze=o=>{Object.values(o).forEach(v=>{if(v&&typeof v==='object')freeze(v);});return Object.freeze(o);};
  const timelines=freeze({
    approach_to_volley:{read:{total:3.9,questionAt:3.5,cueAt:[1.25,1.8,3.0]},answer:{total:7.3,questionAt:0,inkAt:3.2,correctionAt:3.75,correctionInkAt:6.95,cueAt:[0,0,0]}},
    serve_adjustment:{read:{total:5.7,questionAt:5.3,cueAt:[2.0,3.8,4.75]},answer:{total:6.2,questionAt:0,inkAt:2.55,correctionAt:3.2,correctionInkAt:5.85,cueAt:[0,0,0]}}
  });
  const approachChoices=[['middle','angle','deep-line','float'],['close','deep-line','pace','angle'],['line','short-line','middle','deep-cross']];
  const serveChoices=[['repeat','T','wide','slow'],['harder','slow','new-body','away'],['wide','repeat','inward','slow']];
  function approach(scene,choice){
    const action=approachChoices[scene][choice],left=scene===2,sign=left?-1:1;
    const start=[sign*2.65,6.8,1.05],near=[sign*2.1,7.3,0],far=[left?-3:scene===1?-.5:-2.4,-11.1,0];
    const deep=action==='deep-line'||action==='deep-cross'||action==='line';
    const x=action==='deep-cross'?2.75:['deep-line','line','short-line','close','pace'].includes(action)?sign*2.75:action==='angle'?-3.25:0;
    const bounce=[x,deep?-10.5:action==='angle'?-4.5:action==='float'?-5:-3.4,0];
    const receiver=[x,bounce[1]-1.6,1];
    const receiverFoot=[x+.5,receiver[1]-.4,0];
    const volley=[sign*.8,action==='close'?1.8:deep?2.7:3.7,deep?1.18:.55];
    const volleyFoot=[volley[0]-.5,volley[1]+.4,0];
    // Close along the approach's line, then respond to this particular pass.
    // Do not pre-move toward a volley whose direction is not yet known.
    const splitY=4,along=(splitY-start[1])/(bounce[1]-start[1]);
    const split=[start[0]+(bounce[0]-start[0])*along-sign*.5,splitY,0];
    const times=action==='pace'?[.15,.9,1.2,2.55]:[.15,1.2,1.65,2.9];
    return {kind:'approach_to_volley',scene,action,start,near,far,bounce,receiver,receiverFoot,volley,volleyFoot,split,times,deep};
  }
  function serve(scene,choice,previous=false){
    const action=choice==null?'repeat':serveChoices[scene][choice],sign=scene===2?-1:1;
    const start=[sign*1.5,12.3,2.6],near=[sign*1.5,12.8,0];
    const body=scene===1&&!previous?-1.1:-2.2;
    let target=-2.5;
    if(action==='new-body')target=-1.35;
    if(action==='wide'||action==='away')target=-3.8;
    if(action==='T'||action==='inward')target=-.65;
    let endBody=body;
    if(action==='slow')endBody=body+.7;
    // A player can make a spacing step; never draw an unreachable racket arm.
    if(target-endBody>1.05)endBody=target-1.05;
    if(target-endBody< -1.05)endBody=target+1.05;
    const contact=[sign*target,-11.7,.95],far=[sign*body,-12.1,0],receiverFoot=[sign*endBody,-12.1,0];
    const bounceY=-5.2,u=(bounceY-start[1])/(contact[1]-start[1]);
    const bounce=[start[0]+(contact[0]-start[0])*u,bounceY,0];
    const times=action==='slow'?[.15,1.3,2.1]:action==='harder'?[.15,.95,1.7]:[.15,1.15,1.95];
    return {kind:'serve_adjustment',scene,action,start,near,far,bounce,receiver:contact,receiverFoot,times,spacing:Math.abs(contact[0]-receiverFoot[0])};
  }
  function sample(m,t){
    const [hit,bounce,receive,volley]=m.times;
    let ball=t<=bounce?arc(m.start,m.bounce,(t-hit)/(bounce-hit),m.kind==='serve_adjustment'?.55:m.action==='float'?1.8:1.05):arc(m.bounce,m.receiver,(t-bounce)/(receive-bounce),.22);
    let near=m.near,far=mix(m.far,m.receiverFoot,(t-hit)/(receive-hit));
    if(m.kind==='approach_to_volley'){
      near=t<=receive?mix(m.near,m.split,(t-hit)/(receive-hit)):mix(m.split,m.volleyFoot,(t-receive)/(volley-receive));
      if(t>receive)ball=arc(m.receiver,m.volley,(t-receive)/(volley-receive),.55);
    }
    return {ball,near,far,phase:t<hit?'Ready':t<bounce?'Ball travelling':t<receive?'After the bounce':m.kind==='approach_to_volley'?(t<volley?'Pass travelling':'First volley · no bounce'):'Return contact · spacing sample'};
  }
  const project=p=>[240+28*p[0]+4*p[1],175+9*p[1]-40*p[2]];
  const xy=p=>project(p).map(n=>n.toFixed(2)).join(',');
  const poly=p=>p.map(xy).join(' ');
  function athlete(foot,label,colour,contact){
    const [x,y]=project(foot),r=contact?project(contact):[x+(label==='YOU'?12:-12),y-37];
    return `<g stroke="${colour}" stroke-linecap="round" fill="none"><ellipse cx="${x}" cy="${y+2}" rx="11" ry="3" stroke="none" fill="#08150c"/><path d="M ${x-7} ${y} L ${x-4} ${y-17} L ${x} ${y-29} L ${x-1} ${y-49} M ${x} ${y-29} L ${x+5} ${y-15} L ${x+10} ${y}" stroke-width="4"/><circle cx="${x-1}" cy="${y-59}" r="5" fill="${colour}" stroke="none"/><path d="M ${x-1} ${y-46} L ${x+3} ${y-35} L ${r[0]} ${r[1]}" stroke-width="3"/><ellipse cx="${r[0]}" cy="${r[1]}" rx="4" ry="7" stroke="#dfbc68" stroke-width="1.5"/><text x="${x}" y="${y+16}" text-anchor="middle" fill="${colour}" stroke="none" font-size="10">${label}</text></g>`;
  }
  function svg(m,t){
    const s=sample(m,t),p=project(s.ball),shadow=project([s.ball[0],s.ball[1],0]);
    const trail=[];for(let q=m.times[0];q<t;q+=.035)trail.push(sample(m,q).ball);trail.push(s.ball);
    const approachKind=m.kind==='approach_to_volley',last=m.times[m.times.length-1],atEnd=t>=last;
    const nearContact=t<=m.times[0]?m.start:approachKind&&atEnd?m.volley:null;
    const farContact=t>=m.times[2]&&(!approachKind||t<=m.times[2]+.06)?m.receiver:null;
    const [bx,by]=project(m.bounce);
    const reference=approachKind&&atEnd?`<polyline points="${poly([[m.volley[0]-.65,m.volley[1],.914],[m.volley[0]+.65,m.volley[1],.914]])}" stroke="#f0ddd0" stroke-dasharray="3 3"/><text x="18" y="323" fill="#e1e1cf" font-size="11">Dashed bar: net height at your contact depth</text>`:'';
    return `<svg viewBox="0 0 480 350" role="img" aria-label="${approachKind?'Approach, opponent contact and first volley':'Serve landing and right-handed returner spacing'}. ${s.phase}. Original illustrative sequence, not a predicted result."><rect width="480" height="350" rx="12" fill="#10291a"/><polygon points="${poly([[-4.115,-11.885,0],[4.115,-11.885,0],[4.115,11.885,0],[-4.115,11.885,0]])}" fill="#244b32" stroke="#abbca2" stroke-width="1.2"/><g stroke="#abbca2" fill="none" stroke-width="1"><polyline points="${poly([[-4.115,-6.4,0],[4.115,-6.4,0]])}"/><polyline points="${poly([[-4.115,6.4,0],[4.115,6.4,0]])}"/><polyline points="${poly([[0,-6.4,0],[0,6.4,0]])}"/></g><polygon points="${poly([[-4.115,0,0],[-4.115,0,1.07],[0,0,.914],[4.115,0,1.07],[4.115,0,0]])}" fill="#d8ddc7" fill-opacity=".13" stroke="#d8ddc7" stroke-width="1"/>
    ${athlete(s.far,'THEM','#bfcbd7',farContact)}${athlete(s.near,'YOU','#e8dfbf',nearContact)}
    <polyline points="${poly(trail)}" fill="none" stroke="#dae46a" stroke-opacity=".45" stroke-width="2"/>
    ${t>=m.times[1]?`<ellipse cx="${bx}" cy="${by}" rx="6" ry="2.5" fill="none" stroke="#dae46a"/>`:''}
    <ellipse cx="${shadow[0]}" cy="${shadow[1]}" rx="4" ry="2" fill="#07170a"/><path d="M ${p[0]} ${p[1]} L ${shadow[0]} ${shadow[1]}" stroke="#dae46a" stroke-opacity=".35" stroke-dasharray="2 3"/><circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#e3ed76"/>
    ${reference}<text x="18" y="342" fill="#b9c5b2" font-size="10">${s.phase}</text><text x="462" y="342" fill="#b9c5b2" font-size="10" text-anchor="end">Both players right-handed</text></svg>`;
  }
  function model(step,choice,previous){return step.visual.kind==='approach_to_volley'?approach(step.visual.scene,choice):serve(step.visual.scene,choice,previous);}
  function render(step,selected,seconds,reduced){
    const isApproach=step.visual.kind==='approach_to_volley',scene=step.visual.scene;
    const frame=(choice,time,title,previous=false,ready=false)=>{
      const m=model(step,choice,previous),end=m.times[m.times.length-1];
      return '<div class="gd-sequence-frame"><div class="gd-sequence-caption">'+title+'</div>'+svg(m,ready?0:reduced?end:Math.min(end,time))+'</div>';
    };
    if(selected==null){
      if(isApproach)return frame(scene===1?0:step.correct,seconds,scene===1?'Watch one approach through to the volley':'Read the starting positions',false,scene!==1);
      if(reduced)return frame(null,0,'Previous serve',true)+frame(null,0,'Latest serve · same landing');
      if(scene===1&&seconds>=2.15&&seconds<2.6){
        const m=serve(scene,null),previous=serve(scene,null,true);
        m.far=mix(previous.far,m.far,(seconds-2.15)/.45);
        return '<div class="gd-sequence-frame"><div class="gd-sequence-caption">Between serves · watch the receiver</div>'+svg(m,0)+'</div>';
      }
      return seconds<2.6?frame(null,seconds,'Previous serve',true):frame(null,seconds-2.6,'Latest serve · same landing');
    }
    const own='Your choice '+String.fromCharCode(65+selected)+' · '+(isApproach?'one plausible reply':'contact spacing, not point outcome');
    const compare='Compare '+String.fromCharCode(65+step.correct)+' · same starting situation';
    if(selected!==step.correct){
      if(reduced)return frame(selected,0,own)+frame(step.correct,0,compare);
      const correction=timelines[step.visual.kind].answer.correctionAt;
      if(seconds>=correction)return frame(step.correct,seconds-correction,compare);
    }
    return frame(selected,seconds,own);
  }
  function events(step,selected){
    const isApproach=step.visual.kind==='approach_to_volley';
    const one=(choice,offset=0,previous=false)=>{const m=model(step,choice,previous);return m.times.map((at,i)=>({kind:i===1?'court':'contact',audio:i===1?'bounce':!isApproach&&i===0?'serve':'ground',at:at+offset,volume:i===1?.2:.35}));};
    if(selected==null)return isApproach?(step.visual.scene===1?one(0):[]):one(null,0,true).concat(one(null,2.6));
    return one(selected).concat(selected!==step.correct?one(step.correct,timelines[step.visual.kind].answer.correctionAt):[]);
  }
  function audit(step){
    const errors=[],kind=step.visual.kind,scene=step.visual.scene,choices=kind==='approach_to_volley'?approachChoices:serveChoices;
    if(!choices[scene]||JSON.stringify(step.visual.actions)!==JSON.stringify(choices[scene]))return ['Unbound construction evidence'];
    const correct=kind==='approach_to_volley'?[2,1,3]:[0,2,1];
    if(step.correct!==correct[scene])errors.push('Answer key does not match the authored construction');
    for(let i=0;i<4;i++){
      const m=model(step,i),[hit,bounce,receive]=m.times;
      if(!(hit<bounce&&bounce<receive))errors.push('Invalid contact order');
      if(Math.abs(m.bounce[0])>=4.115||m.bounce[1]>=0||m.bounce[1]<=-11.885)errors.push('Illegal landing');
      if(kind==='serve_adjustment'&&(m.bounce[1]<-6.4||m.bounce[0]*m.start[0]>=0))errors.push('Serve misses diagonal service box');
      // Sample the net crossing of every flight; volley is intercepted before
      // any near-court bounce, rather than disguised as a groundstroke.
      let prior=sample(m,hit).ball;
      for(let t=hit+.005;t<=m.times.at(-1);t+=.005){const p=sample(m,t).ball;if(p[1]*prior[1]<0&&p[2]<1.08)errors.push('Flight clips net');prior=p;}
      if(kind==='approach_to_volley'&&m.volley[2]<=0)errors.push('Volley has become a bounce');
      if(Math.hypot(m.receiverFoot[0]-m.far[0],m.receiverFoot[1]-m.far[1])/(receive-hit)>7)errors.push('Receiver cannot reach this contact');
    }
    return [...new Set(errors)];
  }
  function lesson(spine,rows){return {id:spine.prototypeId,slug:spine.slug,lessonSpineId:spine.id,reviewOnly:true,attentionPolicy:'evidence-first',title:spine.title,memory:spine.memory,insight:spine.painHook,takeItToCourt:spine.tomorrowAction,proInsight:spine.proInsight,steps:rows.map((r,i)=>({...r,phase:['See · Read the opportunity','Contrast · Read what changed','Transfer · Test the rule'][i],decisionLens:spine.prototypeDecisionLenses[i],transfer:i===2,options:r.options.map((text,j)=>({id:String.fromCharCode(65+j),text})),visual:{kind:spine.visualContract.kind,scene:i,label:spine.title,description:'One shared court and clock bind landing, player position and contact. Original illustrative sequence; no guaranteed outcome.',cues:r.cues,answerCues:spine.visualContract.kind==='approach_to_volley'?['1 APPROACH CONTACT','2 RECEIVER CONTACT','3 FIRST VOLLEY']:['1 SERVE LEAVES','2 SERVICE BOUNCE','3 RETURN CONTACT'],actions:(spine.visualContract.kind==='approach_to_volley'?approachChoices:serveChoices)[i]}}))};}
  function lessons(spines){return [lesson(spines.byId.net_volley_started_at_baseline,[
    {situation:'You are balanced on a short forehand. Their recovery leaves the line available.',question:'Which approach best prepares your first volley?',options:['Drive short through the middle and follow','Angle short across court and follow','Drive deep down the line and follow','Float centrally and close behind it'],correct:2,unlock:'Build the next contact',payoff:'The deeper approach keeps their contact back while you move into position.',principle:'Approach depth can improve the first volley without guaranteeing it.',why:'Shorter landings let this receiver contact inside the court. A deep approach still needs a balanced split step and can meet a good pass.',cues:['1 SHORT FOREHAND','2 OPPONENT LEFT','3 BASELINE DISTANCE']},
    {situation:'Your approach follows the line but lands short. Watch the first volley it creates.',question:'What change improves this construction?',options:['Keep the landing and close another stride','Add depth while keeping useful margin','Keep the landing and add more pace','Keep the length and use a sharper angle'],correct:1,unlock:'Inspect the approach first',payoff:'The deeper landing moves their contact back before the pass begins.',principle:'Closing harder does not erase the opportunity a short approach gives them.',why:'The observed short approach permits an earlier, lower pass. Depth changes that starting situation; it does not prove that every volley error starts at the baseline.',cues:['1 APPROACH BOUNCES','2 CONTACT INSIDE','3 VOLLEY BELOW TAPE']},
    {situation:'Now approach from your backhand side. Their position covers your usual line.',question:'Which construction fits this new opening?',options:['Drive deep down the line and follow','Play short down the line and close','Drive short through the central lane','Play deep across and follow its direction'],correct:3,unlock:'Follow the actual opening',payoff:'The crosscourt approach makes this positioned opponent travel before playing the pass.',principle:'Use depth and opponent position, not a fixed down-the-line rule.',why:'Here the receiver already covers the line. Deep crosscourt makes them move, but you must follow its direction and prepare for either passing lane.',cues:['1 BACKHAND SIDE','2 OPPONENT LEFT','3 FAR COURT SPACE']}
  ]),lesson(spines.byId.serve_body_target_adapts,[
    {situation:'Two firm first serves reached the same spot. Watch the returner’s contact spacing.',question:'How can you repeat this pressure?',options:['Repeat the firm serve through this lane','Move the same pace toward the T','Use the wider service box with pace','Slow the serve through the central lane'],correct:0,unlock:'Keep useful pressure',payoff:'The same lane still reaches close to the returner’s body.',principle:'Repeat a pattern while the observed spacing still supports it.',why:'Changing location is possible, not necessary. A slower ball gives this returner time to make room; these scenes compare spacing, not guaranteed return quality.',cues:['1 FIRST CONTACT','2 SAME LANDING','3 SECOND CONTACT']},
    {situation:'The returner has shifted sideways. Your unchanged serve now leaves room for the swing.',question:'Which target restores the intended pressure?',options:['Keep the original lane and serve harder','Repeat the original lane with less pace','Shift toward the returner’s new body line','Move the target away from their body'],correct:2,unlock:'The body target moved',payoff:'Shifting the lane restores closer spacing against the returner’s new position.',principle:'A court location is not a body target independently of the player.',why:'More pace does not move the original lane toward their new body position. Read the adjustment before choosing whether to follow it or exploit another opening.',cues:['1 EARLIER CONTACT','2 PLAYER SHIFTS','3 MORE SWING SPACE']},
    {situation:'From the other service court, two contacts stay close. Their starting position is unchanged.',question:'What does the latest evidence favour?',options:['Use the wider serve to open court','Repeat the same pace through this lane','Bring the target closer to the T','Slow the ball through the same lane'],correct:1,unlock:'No adjustment needed yet',payoff:'Their unchanged position leaves the current serve close to the body.',principle:'Change on evidence, not because a pattern has been repeated.',why:'Switching service courts does not itself require changing the intention. Here the right-handed returner remains cramped on the backhand side; another position could reverse that read.',cues:['1 OTHER SERVICE COURT','2 SAME POSITION','3 BALL BESIDE TORSO']}
  ])];}
  return Object.freeze({timelines,approach,serve,sample,project,render,events,audit,lessons,athlete,poly,arc,mix});
});
