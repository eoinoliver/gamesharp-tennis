(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.HighBallEvidence=api;})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  const G=9.81,VX=4.4,VZ=6.3,BOUNCE=1,END=BOUNCE+2*VZ/G;
  const freeze=o=>{Object.values(o).forEach(v=>{if(v&&typeof v==='object')freeze(v)});return Object.freeze(o)};
  const scenes=freeze([
    {id:'short',title:'A shorter bounce',setup:'A slower ball lands short. You are balanced and have time to move.',bounce:7,start:11.4,ready:.05,targets:{forward:8.12,hold:11.4,back:13.5},best:'forward',note:'Stepping in reaches a comfortable height earlier, without surrendering court.'},
    {id:'deep',title:'A deeper bounce',setup:'The next ball lands deep. Your recovery leaves you late for the rising contact.',bounce:10.8,start:13.6,ready:1.28,targets:{forward:11.92,hold:13.6,back:15.83},best:'back',note:'Here the early window has passed. Giving ground creates a later, lower contact.'},
    {id:'space',title:'You already have space',setup:'You start farther back. This high bounce now reaches your comfortable strike zone.',bounce:9.7,start:14.65,ready:.05,targets:{forward:13,hold:14.65,back:16},best:'hold',note:'Your starting position already provides the space. More retreat adds no benefit.'}
  ]);
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  // Metres: depth increases away from the net; z is height above the court.
  function ball(scene,t){t=clamp(t,0,END);const u=t-BOUNCE;return {depth:scene.bounce+VX*u,lateral:0,z:Math.max(0,u<0?2.6+2.305*t-G*t*t/2:VZ*u-G*u*u/2)}}
  function player(scene,t,action){const target=action==='midway'?(scene.id==='space'?14:9.7):action==='side'?scene.start:action?scene.targets[action]:scene.start;if(!Number.isFinite(target))throw Error('Unknown movement');const travel=clamp((t-scene.ready)*3.4,0,Math.abs(target-scene.start));return {depth:scene.start+Math.sign(target-scene.start)*travel,lateral:.55+(scene.id==='deep'?.9*(1-clamp(t/scene.ready,0,1)):0)+(action==='side'?1.1:0)*clamp((t-scene.ready)*2,0,1),z:0}}
  // First opportunity at the player's forward contact plane, not a guaranteed hit.
  function contact(scene,action){
    let lo=BOUNCE,hi=END;const gap=t=>ball(scene,t).depth+.35-player(scene,t,action).depth;
    if(gap(lo)>0||gap(hi)<0)return null;
    for(let i=0;i<50;i++){const mid=(lo+hi)/2;if(gap(mid)<0)lo=mid;else hi=mid;}
    const t=(lo+hi)/2,b=ball(scene,t);return {t,...b,comfortable:b.z>=.85&&b.z<=1.5};
  }
  function project(depth,lateral,z){return {x:32+23*depth+5*lateral,y:235-1.5*depth+8*lateral-57*z}}
  const point=p=>{const s=project(p.depth,p.lateral,p.z);return s.x.toFixed(2)+','+s.y.toFixed(2)};
  const poly=pts=>pts.map(p=>point({depth:p[0],lateral:p[1],z:p[2]||0})).join(' ');
  function svg(scene,t,action,captions=true){
    const b=ball(scene,t),p=player(scene,t,action),bp=project(b.depth,0,b.z),shadow=project(b.depth,0,0),pp=project(p.depth,p.lateral,0);
    const pts=[];for(let q=0;q<=t;q+=.025)pts.push(point(ball(scene,q)));pts.push(point(b));
    const bounce=project(scene.bounce,0,0),base=project(11.885,4.115,0);
    const labels=captions?`<g fill="#c8cdbf" font-size="10"><text x="18" y="282">NET</text><text x="${base.x-21}" y="${base.y+21}">BASELINE</text><text x="468" y="282" text-anchor="end">BEHIND COURT</text></g>`:'';
    // Athlete is an orientation/height reference, not a technique demonstration.
    const gait=action&&t>scene.ready&&Math.abs(p.depth-player(scene,Math.max(0,t-.02),action).depth)>.001?Math.sin(t*25)*5:0;
    return `<svg viewBox="0 0 480 295" role="img" aria-label="Side-oblique view of the near court. The ball travels from the net toward the baseline and rear court. Its shadow marks ground position; the player shows body height.">
      <defs><linearGradient id="court" x2="0" y2="1"><stop stop-color="#1d492a"/><stop offset="1" stop-color="#12331d"/></linearGradient></defs>
      <rect width="480" height="295" rx="14" fill="#0e2417"/>
      <polygon points="${poly([[0,-4.115],[17.5,-4.115],[17.5,4.115],[0,4.115]])}" fill="url(#court)"/>
      <g stroke="#a7b99e" stroke-width="1.3" fill="none"><polyline points="${poly([[0,-4.115],[11.885,-4.115],[11.885,4.115],[0,4.115]])}"/>
      <polyline points="${poly([[6.4,-4.115],[6.4,4.115]])}" opacity=".45"/>
      <polyline points="${poly([[0,0],[6.4,0]])}" opacity=".45"/></g>
      <polygon points="${poly([[0,-4.115],[0,-4.115,1.07],[0,0,.914],[0,4.115,1.07],[0,4.115]])}" fill="#b7c5b0" fill-opacity=".12" stroke="#c3cdbb"/>
      ${labels}
      <polyline points="${pts.join(' ')}" fill="none" stroke="#d3e267" stroke-opacity=".32" stroke-width="2"/>
      ${t>=BOUNCE?`<ellipse cx="${bounce.x}" cy="${bounce.y}" rx="7" ry="2.5" fill="none" stroke="#d3e267"/>`:''}
      <g transform="translate(${pp.x},${pp.y})">
        <ellipse cy="1" rx="15" ry="4" fill="#020b05" opacity=".55"/>
        <rect x="-18" y="-85.5" width="27" height="37" rx="6" fill="#d8e6d0" fill-opacity=".07" stroke="#d8e6d0" stroke-opacity=".24" stroke-dasharray="3 4"/>
        <g stroke="#dddcca" stroke-width="5" stroke-linecap="round" fill="none">
          <path d="M 0 -45 L -6 -73 L -4 -89 M 0 -45 L ${-9-gait} -20 L ${-13-gait} 0 M 0 -45 L ${9+gait} -20 L ${15+gait} 0"/>
          <path d="M -6 -73 L -17 -61 L -20 -68 M -5 -73 L 6 -62 L -15 -62" stroke-width="4"/>
        </g><circle cx="-4" cy="-98" r="7" fill="#dddcca"/>
        <path d="M -15 -62 L -26 -68" stroke="#c8a84b" stroke-width="2"/>
        <ellipse cx="-30" cy="-72" rx="6" ry="9" transform="rotate(-30 -30 -72)" fill="none" stroke="#c8a84b" stroke-width="2"/>
        ${captions?'<text y="19" text-anchor="middle" fill="#deddd0" font-size="10">YOU</text>':''}
      </g>
      <ellipse cx="${shadow.x}" cy="${shadow.y}" rx="5" ry="2" fill="#030b05" opacity=".7"/>
      <line x1="${bp.x}" y1="${bp.y}" x2="${shadow.x}" y2="${shadow.y}" stroke="#d3e267" stroke-opacity=".18" stroke-dasharray="2 4"/>
      <circle cx="${bp.x}" cy="${bp.y}" r="4.5" fill="#d3e267" stroke="#eff6b7" stroke-width="1"/>
    </svg>`;
  }
  const actions=freeze([['hold','forward','back','midway'],['forward','hold','side','back'],['hold','back','forward','midway']]);
  function lesson(spine){return {
    id:spine.prototypeId,slug:spine.slug,lessonSpineId:spine.id,reviewOnly:false,attentionPolicy:'evidence-first',
    title:spine.title,memory:spine.memory,insight:spine.painHook,takeItToCourt:spine.tomorrowAction,proInsight:spine.proInsight,
    steps:[
      {phase:'See · Use the available time',decisionLens:'available-window',situation:scenes[0].setup,
       question:'Where should you meet this ball?',options:['Stay back and wait for its drop','Move forward into a comfortable contact','Move back to let the bounce fall','Move partway in and meet it higher'],correct:1,
       unlock:'Use the earlier window',payoff:'Moving forward uses the time without letting the ball dictate your contact.',
       principle:'Depth and readiness make the earlier contact available.',why:'Waiting is possible, but gives away time and court here. A deeper or faster ball could remove the earlier window.',
       notes:['Waiting works, but stepping in uses the available time and court.','','That retreat misses this ball before its second bounce.','Stopping partway leaves the ball higher than this player’s preferred range.']},
      {phase:'Contrast · The early window has passed',decisionLens:'late-arrival',situation:'The next ball lands deep. You are still recovering as it bounces.',
       question:'Which movement preserves a usable contact?',options:['Move forward to take the bounce earlier','Hold ground and strike above shoulder height','Move sideways while keeping the same depth','Create space behind the rising bounce'],correct:3,
       unlock:'Make room for the drop',payoff:'Giving ground restores space when the earlier contact is already gone.',
       principle:'The same height asks a different question when you arrive late.',why:'Advancing now meets a high ball; moving sideways does not solve depth. Earlier preparation could make the rising contact available.',
       notes:['The earlier low window passes before you can reach it.','Holding depth leaves this contact above shoulder height.','Sideways movement leaves the depth problem unchanged.','']},
      {phase:'Transfer · Read your starting position',transfer:true,decisionLens:'existing-space',situation:'You start farther behind the baseline. Another high ball comes through the court.',
       question:'What adjustment does this ball need?',options:['Hold depth and make small spacing steps','Retreat farther before starting the swing','Advance quickly to shorten the rally','Move in slightly and take it higher'],correct:0,
       unlock:'You already have the space',payoff:'You already have the space; another retreat would give away more court.',
       principle:'Read your position as well as the bounce.',why:'Holding depth retains a usable height without losing more court. A deeper bounce or less preparation time would change the decision.',
       notes:['','This extra retreat misses the ball before its second bounce.','Advancing trades an available lower contact for a higher one.','Even that smaller advance makes the contact higher than it needs to be.']}
    ].map((s,i)=>({...s,options:s.options.map((text,j)=>({id:String.fromCharCode(65+j),text})),visual:{kind:'high_ball_contrast',scene:i,label:scenes[i].title,description:'Side-oblique near court: landing depth, ball height, shadow and player-relative spacing share one clock. The contact sample is not a completed stroke.',cues:i===0?['1 SHORTER BOUNCE','2 PLAYER SET','3 BALL CLIMBS']:i===1?['1 DEEPER BOUNCE','2 RECOVERING','3 BALL CLIMBS']:['1 BEHIND BASELINE','2 BOUNCE LOCATION','3 BALL DROPS'],actions:actions[i]}}))
  }}
  function render(step,selected,seconds,reduced){
    const s=scenes[step.visual.scene],wrong=selected!=null&&selected!==step.correct;
    const frame=(choice,elapsed,title)=>{
      const action=choice==null?null:actions[step.visual.scene][choice],end=action?(contact(s,action)?.t||END):s.id==='space'?contact(s,'hold').t:1.65;
      const t=reduced?end:Math.min(end,Math.max(0,elapsed)/1.8);
      const suffix=action&&t>=end?(contact(s,action)?' · height at this depth':' · second bounce, no contact'):'';
      return '<div class="gd-high-frame"><div class="gd-high-caption">'+title+suffix+'</div>'+svg(s,t,action)+'</div>';
    };
    if(selected==null)return frame(null,seconds,'Band: preferred height · lateral reach not modeled');
    const own='Your choice '+String.fromCharCode(65+selected);
    if(wrong&&reduced)return frame(selected,0,own)+frame(step.correct,0,'Compare '+String.fromCharCode(65+step.correct)+' · same ball');
    return wrong&&seconds>=4.4?frame(step.correct,seconds-4.4,'Compare '+String.fromCharCode(65+step.correct)+' · same ball'):frame(selected,seconds,own);
  }
  function audit(step){
    const v=step&&step.visual,i=v&&v.scene,s=scenes[i];
    if(!s||!Number.isInteger(i)||JSON.stringify(v.actions)!==JSON.stringify(actions[i]))return ['Missing or mismatched High Ball movement evidence'];
    if(actions[i][step.correct]!==s.best)return ['High Ball answer does not match the authored contact window'];
    if(!contact(s,s.best)?.comfortable)return ['High Ball best movement has no usable contact'];
    return [];
  }
  return Object.freeze({scenes,ball,player,contact,project,svg,actions,lesson,render,audit,bounceAt:BOUNCE,end:END,readEnd:1.65});
});
