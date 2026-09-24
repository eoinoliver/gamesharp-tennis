(function(root,factory){const C=typeof module==='object'&&module.exports?require('./gold-daily-construction.js'):root.GoldDailyConstruction;const api=factory(C);if(typeof module==='object'&&module.exports)module.exports=api;else root.GoldDailyPatterns=api;})(typeof globalThis==='object'?globalThis:this,function(C){
  'use strict';
  const {project,poly,arc,mix,athlete}=C,kind='pattern_conditions',kinds=[kind],gap=2.55,correctionAt=3.4;
  const freeze=o=>{Object.values(o).forEach(v=>{if(v&&typeof v==='object')freeze(v);});return Object.freeze(o);};
  const answer={total:6.85,questionAt:0,inkAt:3.05,correctionAt,correctionInkAt:6.55,cueAt:[0,0,0]};
  const sceneTimelines=freeze([
    {read:{total:3.5,questionAt:3.05,cueAt:[.72,1.25,2.55]},answer:{...answer}},
    {read:{total:10.75,questionAt:10.25,cueAt:[1.25,6.4,9.0]},answer:{...answer}},
    {read:{total:2.55,questionAt:2.1,cueAt:[.72,1.25,1.8]},answer:{...answer}}
  ]);
  const timelines=freeze({[kind]:sceneTimelines[1]});
  const rows=[
    {situation:'Their lob sends you backwards. Replay the approach that came before it.',question:'What would test this clue?',options:['Track their lobs across the whole match','Compare replies from that deep backhand stretch','Track replies whenever you reach the net','Compare replies from every backhand they play'],correct:1,unlock:'Keep the contact with the clue',payoff:'The lob is useful evidence when you keep the contact conditions attached.',principle:'One reply starts a question; comparable contacts help answer it.',why:'The surprise came from a particular contact. Comparing that situation tests the clue; pooling every lob, approach or backhand mixes different opportunities.',cues:['1 BOUNCE','2 CONTACT','3 OBSERVED FLIGHT']},
    {situation:'The next approaches bring several replies. Watch where each contact happens.',question:'Which pattern has the clearest support?',options:['Lobs whenever you move inside the court','Lobs from their backhand at any depth','Lobs from those deep, stretched backhand contacts','Passes when you approach their backhand side'],correct:2,unlock:'Compare the contacts',payoff:'The repeated lob belongs to this contact situation, not every approach.',principle:'A pattern is more useful when you know the situation that produced it.',why:'Comparable stretched backhands produced lobs; the balanced backhand pass belongs to a different situation. Prepare for the observed option without predicting the next reply.',cues:['1 OPENING STRIKE','2 LATER STRIKES','3 OTHER APPROACH']},
    {situation:'Your next approach lands shorter. Their forehand meets it just behind the service line.',question:'How should you prepare now?',options:['Retreat early to cover the expected lob','Keep closing to smother the next reply','Shade crosscourt before their racket meets ball','Set for either reply and read contact'],correct:3,unlock:'Start a new observation',payoff:'Those earlier lobs do not establish a preference from this new contact.',principle:'Changed conditions can remove a pattern’s relevance without proving it wrong.',why:'The earlier evidence came from stretched backhands; this balanced forehand creates different options. Set your feet and read its flight before choosing a passing or lob response.',cues:['1 BOUNCE','2 PLAYER ARRIVES','3 STRIKE POSITION']}
  ];
  const history=freeze([
    {id:'h1',x:2.95,depth:-12.4,height:.5,wing:'backhand',reply:'lob',nearNet:true},
    {id:'h2',x:3.08,depth:-12.6,height:.54,wing:'backhand',reply:'lob',nearNet:true},
    {id:'h3',x:2.86,depth:-12.3,height:.48,wing:'backhand',reply:'lob',nearNet:true},
    {id:'h4',x:2.05,depth:-7.35,height:1.05,wing:'backhand',reply:'drive',nearNet:true}
  ]);
  // Future comparison contexts show contacts only. No later reply is invented.
  const contexts=freeze([history[0],history[3],{id:'c3',x:-2.65,depth:-12.3,height:1,wing:'forehand',nearNet:true},{id:'c4',x:-1.6,depth:-10.1,height:.95,wing:'forehand',nearNet:false}]);
  function grouping(scene,choice){
    if(scene===0)return [
      {ids:[0,1,2,3],feature:'contact',replay:3},
      {ids:[0],feature:'contact',replay:0},
      {ids:[0,1,2],feature:'net',replay:2},
      {ids:[0,1],feature:'wing',replay:1}
    ][choice];
    return [
      {ids:[0,1,2,3],feature:'net',replay:0},
      {ids:[0,1,2,3],feature:'wing',replay:3},
      {ids:[0,1,2],feature:'contact',replay:2},
      {ids:[3],feature:'reply',replay:3}
    ][choice];
  }
  function model(visualKind,scene,choice=null,record=0){
    if(visualKind!==kind||!rows[scene]||choice!=null&&(!Number.isInteger(choice)||choice<0||choice>3))throw Error('Unbound pattern scene');
    const spec=scene===2?{id:'transfer',x:-2.15,depth:-7.25,height:1.05,wing:'forehand',nearNet:true}:scene===0&&choice!=null?contexts[record]:history[record];
    const low=spec.height<.7,hit=.1,bounceAt=.7,receive=1.2,end=scene===2||scene===0&&choice!=null?receive:2.4;
    const start=[2.5,spec.nearNet?7.2:11.2,1.05],near=[1.95,spec.nearNet?7.6:11.6,0],far=[.4,-11,0];
    const receiver=[spec.x,spec.depth,spec.height],receiverFoot=[spec.x+(spec.wing==='forehand'?.55:low?-.9:-.55),spec.depth-.4,0];
    const bounce=[spec.x-.12,spec.depth+1.9,0],split=[1.85,spec.nearNet?4.3:12,0];
    const reply=scene===2||scene===0&&choice!=null?null:spec.reply;
    const replyEnd=reply==='lob'?[2.05,10.5,0]:[-2.9,9.8,0];
    const destinations=[[1.85,7.2,0],[1.85,2.4,0],[-1.7,4.3,0],split];
    return {kind:visualKind,scene,choice,record,spec,start,near,far,bounce,receiver,receiverFoot,split,reply,replyEnd,hit,bounceAt,receive,end,low,destination:scene===2&&choice!=null?destinations[choice]:split};
  }
  function sample(m,t){
    t=Math.max(0,Math.min(t,m.end));
    const ball=t<=m.bounceAt?arc(m.start,m.bounce,(t-m.hit)/(m.bounceAt-m.hit),1.5):t<=m.receive?arc(m.bounce,m.receiver,(t-m.bounceAt)/(m.receive-m.bounceAt),.12):arc(m.receiver,m.replyEnd,(t-m.receive)/(m.end-m.receive),m.reply==='lob'?4:1.25);
    const far=mix(m.far,m.receiverFoot,(t-m.hit)/(m.receive-m.hit));
    let near=mix(m.near,m.split,(t-m.hit)/(m.receive-m.hit));
    if(m.scene===2){
      const prior=mix(m.near,m.split,(.58-m.hit)/(m.receive-m.hit));
      if(t>=.58)near=mix(prior,m.destination,(t-.58)/(m.receive-.58));
      if(m.choice==null)near=mix(m.near,[1.85,5.9,0],(t-m.hit)/(m.receive-m.hit));
      if(m.choice===3)near[2]=.1*Math.max(0,1-Math.abs(t-(m.receive-.12))/.15);
    }else if(m.reply==='lob'&&t>m.receive+.18)near=mix(m.split,[2,7.4,0],(t-m.receive-.18)/(m.end-m.receive-.18));
    return {ball,near,far,phase:t<m.hit?'Your contact':t<m.bounceAt?'Ball travelling':t<m.receive?'After the bounce':m.reply?t<m.end?(m.reply==='lob'?'Lob travelling':'Drive travelling'):'Observed reply · point not resolved':'Contact held · reply unknown'};
  }
  function court(){return `<polygon points="${poly([[-4.115,-11.885,0],[4.115,-11.885,0],[4.115,11.885,0],[-4.115,11.885,0]])}" fill="#244b32" stroke="#afbea4"/><g fill="none" stroke="#afbea4"><path d="M${poly([[-4.115,-6.4,0],[4.115,-6.4,0]])}"/><path d="M${poly([[-4.115,6.4,0],[4.115,6.4,0]])}"/><path d="M${poly([[0,-6.4,0],[0,6.4,0]])}"/></g><polygon points="${poly([[-4.115,0,0],[-4.115,0,1.07],[0,0,.914],[4.115,0,1.07],[4.115,0,0]])}" fill="#cdd8c5" fill-opacity=".13" stroke="#d8ddc7"/>`;}
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function snapshots(specs,shown,group=null,showReplies=true,repliesShown=shown){
    // Four roomy contact samples, not four active courts/balls. The baseline and
    // feet carry depth; racket-side and height survive reduced motion.
    return specs.map((spec,i)=>{
      if(i>=shown)return '';
      const x=12+(i%2)*230,y=360+Math.floor(i/2)*88,selected=!group||group.ids.includes(i),deep=spec.depth< -11.885;
      const fx=x+128,fy=y+(deep?33:66),bx=fx+(spec.wing==='backhand'?(spec.height<.7?28:18):-18),by=fy-spec.height*25;
      const highlight=group&&selected,feature=group?.feature;
      const point=feature==='net'?[x+55,y+(spec.nearNet?20:59)]:feature==='reply'?[x+194,y+36]:[bx,by];
      const response=showReplies&&i<repliesShown?spec.reply==='lob'?`<path data-observed-reply="lob" d="M${x+173} ${y+49}Q${x+190} ${y-4} ${x+207} ${y+49}" fill="none" stroke="#c8d2bc" stroke-width="2"/>`:`<path data-observed-reply="drive" d="M${x+173} ${y+39}L${x+207} ${y+23}" stroke="#c8d2bc" stroke-width="2"/>`:'';
      return `<g data-contact-snapshot="${spec.id}" data-included="${selected}" data-depth="${deep?'behind':'inside'}" opacity="${selected?1:.27}"><rect x="${x}" y="${y}" width="222" height="79" rx="8" fill="#172f20" stroke="${highlight?'#d5e887':'#4a6450'}" stroke-width="${highlight?2:1}"/><text x="${x+12}" y="${y+26}" font-size="20" fill="#d8e2cd">${i+1}</text><path d="M${x+80} ${y+48}H${x+158}" stroke="#aaba9f" stroke-dasharray="4 3"/><path d="M${fx-5} ${fy}L${fx} ${fy-13}L${fx+5} ${fy}M${fx} ${fy-13}V${fy-25}M${fx} ${fy-19}L${bx} ${by}" stroke="#bfcbd7" stroke-width="2.5" fill="none"/><circle cx="${fx}" cy="${fy-29}" r="4" fill="#bfcbd7"/><circle cx="${bx}" cy="${by}" r="4" fill="none" stroke="#76d0e5" stroke-width="2"/><path d="M${x+55} ${y+65}V${y+9}M${x+51} ${y+35}H${x+66}" stroke="#536c55"/><rect x="${x+52}" y="${y+(spec.nearNet?16:55)}" width="7" height="7" fill="#e8dfbf"/>${response}${highlight?`<circle data-feature="${feature}" cx="${point[0]}" cy="${point[1]}" r="${feature==='wing'?26:feature==='reply'?24:13}" fill="none" stroke="#d5e887" stroke-width="2"/>`:''}</g>`;
    }).join('');
  }
  function svg(m,t,{specs=null,shown=0,group=null,showReplies=true,repliesShown=shown,labels=true,lanes=false}={}){
    const s=sample(m,t),p=project(s.ball),sh=project([s.ball[0],s.ball[1],0]),trail=[];
    for(let q=m.hit;q<Math.min(t,m.end);q+=.025)trail.push(sample(m,q).ball);trail.push(s.ball);
    const at=t>=m.receive,height=specs?548:360;
    const rays=lanes&&at?[-3.5,3.5].map(x=>`<polyline points="${poly([m.receiver,[x,9,0]])}" fill="none" stroke="#aebaca" stroke-dasharray="4 5" opacity=".65"/>`).join(''):'';
    const over=m.reply==='lob'&&t>m.receive?`<path d="M${poly([[1.6,4.3,2.7],[2.3,4.3,2.7]])}" fill="none" stroke="#e5dfc1" stroke-dasharray="3 3"/>`:'';
    let html=`<svg data-pattern-scene="${m.scene}" data-pattern-record="${m.record}" viewBox="0 0 480 ${height}" role="img" aria-label="${esc(s.phase)}. Original contact evidence; no predicted winner."><rect width="480" height="${height}" rx="12" fill="#10291a"/><g transform="translate(0 30)">${court()}${rays}<g opacity=".2">${athlete(m.far,'','#bfcbd7')}${athlete(m.near,'','#e8dfbf')}</g>${athlete(s.far,labels?'THEM':'','#bfcbd7',at?m.receiver:null)}${athlete(s.near,labels?'YOU':'','#e8dfbf',t<=m.hit?m.start:null)}${over}<polyline points="${poly(trail)}" fill="none" stroke="#dce76a" stroke-opacity=".5" stroke-width="2"/>${t>=m.bounceAt?`<ellipse cx="${project(m.bounce)[0]}" cy="${project(m.bounce)[1]}" rx="7" ry="3" fill="none" stroke="#dce76a"/>`:''}${at?`<circle cx="${project(m.receiver)[0]}" cy="${project(m.receiver)[1]}" r="7" fill="none" stroke="#76d0e5" stroke-width="2"/>`:''}<ellipse cx="${sh[0]}" cy="${sh[1]}" rx="4" ry="2" fill="#08150c"/><path d="M${p[0]} ${p[1]}L${sh[0]} ${sh[1]}" stroke="#dce76a" stroke-dasharray="2 3" opacity=".5"/><circle data-active-ball="true" cx="${p[0]}" cy="${p[1]}" r="4" fill="#e3ed76"/></g><text x="16" y="330" font-size="14" fill="#d8e2cd">${esc(s.phase)}</text><text x="16" y="350" font-size="12" fill="#b7c6b0">${specs?'Contact snapshots below · dashed line = baseline':'Both players right-handed · schematic evidence'}</text>${specs?snapshots(specs,shown,group,showReplies,repliesShown):''}</svg>`;
    return labels?html:html.replace(/<text\b[^>]*>[\s\S]*?<\/text>/g,'');
  }
  function readFrame(step,seconds,reduced){
    const scene=step.visual.scene;
    if(scene===1){const record=reduced?3:Math.min(3,Math.floor(seconds/gap)),local=reduced?2.4:Math.min(2.4,seconds-record*gap),shown=reduced?4:Math.min(4,record+(local>=1.2?1:0));return {m:model(kind,scene,null,record),t:local,specs:history,shown,repliesShown:reduced?4:record+(local>=2.4?1:0),title:reduced?'Four earlier approaches · retained contacts':'Earlier approach '+(record+1)+' of 4'};}
    const m=model(kind,scene,null);return {m,t:reduced?m.end:Math.min(seconds,m.end),specs:scene===2?history:null,shown:scene===2?4:0,title:scene===2?'New approach · reply remains unknown':'Replay the surprise and its contact'};
  }
  function selectedFrame(step,choice,seconds,reduced){
    const scene=step.visual.scene,g=scene<2?grouping(scene,choice):null,m=model(kind,scene,choice,g?g.replay:0);
    return {m,t:reduced?m.end:Math.min(seconds,m.end),specs:scene===0?contexts:history,shown:4,group:g,showReplies:scene!==0,lanes:scene===2,title:scene===0?'Your comparison scope · future replies unknown':scene===1?'Your read · highlighted evidence':'Your preparation · reply remains unknown'};
  }
  function render(step,selected,seconds,reduced){
    seconds=Math.max(0,seconds);
    const draw=(f,title)=>`<div class="gd-sequence-frame"><div class="gd-sequence-caption">${esc(title||f.title)}</div>${svg(f.m,f.t,f)}</div>`;
    if(selected==null)return draw(readFrame(step,seconds,reduced));
    const own=selectedFrame(step,selected,seconds,reduced);
    if(selected!==step.correct){const corrected=selectedFrame(step,step.correct,Math.max(0,seconds-correctionAt),reduced);if(reduced)return draw(own)+draw(corrected,'Compare the better read · same evidence');if(seconds>=correctionAt)return draw(corrected,'Compare the better read · same evidence');}
    return draw(own);
  }
  function events(step,selected){
    const scene=step.visual.scene;
    const one=(choice,record=0,offset=0)=>{const m=model(kind,scene,choice,record);return [{at:m.hit+offset,kind:'contact',audio:'ground',volume:.26},{at:m.bounceAt+offset,kind:'court',audio:'bounce',volume:.18},...(m.reply?[{at:m.receive+offset,kind:'contact',audio:'ground',volume:.26},{at:m.end+offset,kind:'court',audio:'bounce',volume:.16}]:[])];};
    if(selected==null)return scene===1?history.flatMap((_,i)=>one(null,i,i*gap)):one(null);
    const own=one(selected,scene<2?grouping(scene,selected).replay:0);
    return selected!==step.correct?own.concat(one(step.correct,scene<2?grouping(scene,step.correct).replay:0,correctionAt)):own;
  }
  const timelineFor=(step,answered)=>sceneTimelines[step.visual.scene][answered?'answer':'read'];
  function audit(step){
    const scene=step.visual?.scene,errors=[];if(step.visual?.kind!==kind||!rows[scene]||step.correct!==rows[scene].correct)return ['Unbound pattern decision'];
    for(const choice of [null,0,1,2,3])for(const record of scene<2?[0,1,2,3]:[0]){
      const m=model(kind,scene,choice,record);if(!(m.hit<m.bounceAt&&m.bounceAt<m.receive&&m.receive<=m.end))errors.push('Event order');
      if(Math.abs(m.bounce[0])>4.115||m.bounce[1]<=-11.885||m.bounce[1]>=0)errors.push('Illegal approach bounce');
      if(Math.hypot(m.receiverFoot[0]-m.far[0],m.receiverFoot[1]-m.far[1])/(m.receive-m.hit)>4.5)errors.push('Unreachable contact');
      if((m.receiver[0]-m.receiverFoot[0])*(m.spec.wing==='backhand'?1:-1)<=0)errors.push('Wrong wing');
      let previous=sample(m,0).ball;for(let t=.005;t<m.end;t+=.005){const p=sample(m,t).ball;if(!p.every(Number.isFinite)||p[2]<0)errors.push('Invalid ball');if(p[1]*previous[1]<0&&p[2]<1.08)errors.push('Net clearance');previous=p;}
    }
    for(const answered of [false,true]){const v=timelineFor(step,answered);if(!answered&&(v.cueAt.some((t,i)=>i&&t-v.cueAt[i-1]<.5)||v.questionAt-v.cueAt[2]<.25))errors.push('Cue pacing');for(const c of answered?[0,1,2,3]:[null])if(events(step,c).some(e=>e.at>v.total))errors.push('Event beyond timeline');}
    return [...new Set(errors)];
  }
  function lessons(spines){const s=spines.byId.decision_one_point_is_noise;if(!s)throw Error('Missing pattern spine');return [{id:s.prototypeId,slug:s.slug,lessonSpineId:s.id,reviewOnly:true,attentionPolicy:'evidence-first',title:s.title,memory:s.memory,insight:s.painHook,takeItToCourt:s.tomorrowAction,proInsight:s.proInsight,steps:rows.map((r,i)=>({...r,phase:['See · Keep the clue','Contrast · Compare the conditions','Transfer · Read the new contact'][i],decisionLens:s.prototypeDecisionLenses[i],transfer:i===2,options:r.options.map((text,j)=>({id:String.fromCharCode(65+j),text})),visual:{kind,scene:i,label:s.title,description:'Sequential original contact histories with observable height, depth and racket side; selected groups preserve their conditions and transfer stops before the reply.',cues:r.cues,answerCues:['1 BALL LEAVES','2 STRIKE LOCATION','3 COMPARE THE READ']}}))}];}
  return Object.freeze({kinds,timelines,timelineFor,sceneTimelines,history,contexts,grouping,model,sample,svg,render,events,audit,lessons});
});
