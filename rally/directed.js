/* Catalogue direction: original scenes, saved first answers and format-aware review. */
window.GSDirected=(()=>{
  const slug=new URLSearchParams(location.search).get('l');
  const prefix=slug==='short-ball'?'sb3':slug==='the-winner'?'wn2':null,height=slug==='short-ball';
  const standard=['#f0a35e','#b9a3f0','#6fd6c4','#c8a84b'];
  const pilot=S=>!!prefix&&S.scene===prefix;
  const coloursFor=key=>slug==='the-winner'&&key==='wn2'?['#6fd6c4','#f0a35e','#c8a84b','#b9a3f0']:standard;
  const cues=height?['Below the tape','Caught mid-court','Builds a volley','Little net clearance']:
    ['Room for error','Little net clearance','Narrow target','They can run it down'];
  function optionColour(key,X){return coloursFor(key)[LETTERS.indexOf(X)]||null;}
  function colourChoices(S){
    [...$('askOpts').children].forEach((b,j)=>{
      b.classList.add('directed-choice');
      b.style.setProperty('--choice',coloursFor(S.scene)[j].slice(1).match(/../g).map(v=>parseInt(v,16)).join(','));
    });
  }
  const revealed=new Set();
  const dailyOpening=DailyFilms.sequence(slug);
  const dailyLesson=Boolean(dailyOpening||prefix);
  const introKey=S=>dailyOpening&&S===LESSON.steps[0]?'film:1:'+S.scene:'intro:'+S.scene;
  const storeKey='gs_directed_v1_'+slug;
  const seen=new Set();try{for(const k of JSON.parse(localStorage.getItem(storeKey)||'[]'))seen.add(k);}catch{}
  const remember=k=>{seen.add(k);try{localStorage.setItem(storeKey,JSON.stringify([...seen]));}catch{}};
  const cap=document.createElement('div');cap.id='directedCaption';cap.className='directed-cap';cap.hidden=true;cap.setAttribute('role','status');
  cap.innerHTML='<small></small><strong></strong><p></p>';$('stage').appendChild(cap);
  const dock=document.createElement('div');dock.id='directedDock';dock.className='directed-dock';dock.hidden=true;
  dock.innerHTML='<span>Watch the point</span><button type="button" id="skipDirected">Skip to decision →</button>';$('viewer').appendChild(dock);
  let skipCallback=null,film=null,shot=null,elapsed=0,last=null,paused=false,queue=[],sequence=[],finish=null,board=false,eye=null,framing=null,rewatch=null;
  const contact=k=>contactsOf(SC[k],'you').find(f=>f>=SC[k].info.freeze-2)??SC[k].info.freeze;
  const at=()=>SC[prefix+'C'].info.youContact;
  const net=x=>.914+(1.07-.914)*Math.min(1,Math.abs(x)/6.4)**2;
  const frame=(key,f)=>{scene=key;t=f;stopAt=f;onStop=null;setPlaying(false);};
  function cancel(){
    skipCallback=null;film=null;shot=null;queue=[];sequence=[];finish=null;board=false;eye=null;framing=null;last=null;
    clearTimeout(stopTimer);stopTimer=null;pendingStop=null;stopGeneration++;onStop=null;
    window.__pc=null;cap.hidden=dock.hidden=true;$('viewer').classList.remove('directing');
    if(rewatch){rewatch.remove();rewatch=null;}
    window.GSSceneEvidence?.clear();
  }
  function caption(s){cap.children[0].textContent=s.eye||'';cap.children[1].textContent=s.title||'';cap.children[2].textContent=s.copy||'';}
  function next(){
    if(!film)return;
    shot=queue.shift();elapsed=0;last=null;
    if(!shot){const cb=finish;cancel();cb?.();return;}
    if(shot.edit){eye=null;framing=null;}
    $('viewer').dataset.directedPhase=shot.kind;caption(shot);dock.firstElementChild.textContent=shot.kind==='rewind'?'Same contact · another choice':'Watch the point';
    if(shot.play){run(shot.key,shot.from,shot.to,next,!!shot.silent);}
    else {frame(shot.key,shot.from);$('playIcon').innerHTML=PAUSE_I;$('playBtn').setAttribute('aria-label','Pause');}
  }
  function start(stages,cb,label){
    cancel();clearContactInspection();questionCaption();showDots=false;showTargets=null;
    film=true;paused=false;sequence=stages.slice();queue=stages.slice();finish=cb;cap.hidden=dock.hidden=false;
    $('viewer').classList.add('directing');$('skipDirected').textContent=label;next();
  }
  function offerSkip(cb,label){skipCallback=cb;dock.hidden=false;dock.firstElementChild.textContent='Watch the point';$('skipDirected').textContent=label;}
  function skip(){if(skipCallback){const cb=skipCallback;cancel();cb();return true;}if(!film)return false;const cb=finish;cancel();setPlaying(false);cb?.();return true;}
  $('skipDirected').onclick=e=>{e.stopPropagation();skip();};
  function pause(){if(!film)return false;paused=!paused;if(shot.play)setPlaying(!paused);$('playIcon').innerHTML=paused?PLAY_I:PAUSE_I;$('playBtn').setAttribute('aria-label',paused?'Play':'Pause');dock.firstElementChild.textContent=paused?'Paused · tap court to resume':'Watch the point';last=null;return true;}
  function tick(ts){
    if(!film)return;
    if(document.hidden||paused){last=null;return;}
    const dt=last==null?0:Math.min(50,ts-last)*(window.__speed||1);last=ts;elapsed+=dt;
    if(shot.cut && t>=shot.cut.at){
      // A change of camera within the running clip preserves ball, audio and time.
      shot={...shot,...shot.cut,cut:null};eye=null;framing=null;
      $('viewer').dataset.directedPhase=shot.kind;caption(shot);
    }
    if(!shot.play){
      if(shot.kind==='rewind')t=lerp(shot.from,shot.to,smooth(0,shot.ms,elapsed));
      if(elapsed>=shot.ms)next();
    }
  }
  function restoreQuestion(S,cb){
    const q=questionRange(S);silentPlayback=!!q.silent;frame(q.scene,q.to);showDots=false;
    remember(introKey(S));questionCaption(q.after);render();cb();
    rewatch?.remove();rewatch=document.createElement('button');rewatch.className='directed-rewatch';rewatch.id='watchDirected';rewatch.textContent=pilot(S)&&height?'Watch the height again':'Watch the scene again';
    rewatch.onclick=()=>{stageSit(S.sit);paintAsk(S);question(S,()=>{showTargets=S.reveal||S.noTargets?null:S.scene;typeSit(S.sit,enableAsk);},true);stageInView();};$('ask').before(rewatch);GSSceneEvidence.show(S,rewatch);
  }
  function question(S,cb,force=false){

    const q=questionRange(S),end=()=>restoreQuestion(S,cb);
    if(q.from===q.to||!force&&(CALM_MOTION||seen.has(introKey(S)))){end();return true;}
    if(S.scene==='wn1'){
      start([{kind:'opening',key:'wn1',from:62,to:298,play:true,eye:'A low ball. A narrow target.',title:'You go for the line.'},
        {kind:'line',key:'wn1',from:298,ms:1800,eye:'Winner',title:'Would you choose it again?',copy:'In by '+Math.round(SC.wn1.info.shot.courtMargin*100)+' cm.'}],end,'Skip to decision →');
    }else if(pilot(S)&&height){
      const key=prefix+'A',hit=contact(key)-1;start([
        {kind:'opening',key,from:62,to:hit,play:true,eye:'A short ball. They’re still deep.',title:'A free point?'},
        {kind:'height',key,from:hit,ms:1800,eye:'The deciding detail',title:'Below the tape.',copy:'Contact '+Math.round(at()[2]*100)+' cm. Tape '+Math.round(net(at()[0])*100)+' cm.'},
        {kind:'net',key,from:hit,to:257,play:true,eye:'The shot',title:'Watch the clearance.'}
      ],end,'Skip to decision →');
    }else if(dailyOpening&&S===LESSON.steps[0]){
      start(dailyOpening,end,'Skip to decision →');
    }else start([{kind:'sweep',key:q.scene,from:q.from,to:q.to,play:true,silent:q.silent,eye:q.label||'Read the situation',title:S.name||'Your next decision',native:!!(LESSON.predict||LESSON.readinessLesson||CONTACT_FOCUS||q.type==='held-continuation')}],end,'Skip to decision →');
    return true;
  }
  function alternative(S,X){return LETTERS[S.correct]!==X?LETTERS[S.correct]:pilot(S)?(height?'A':'C'):LETTERS[(S.correct+1)%S.opts.length];}
  function finishAnswer(S,X,cb){
    const key=S.reveal?S.scene:S.scene+X;frame(key,S.reveal?questionRange(S).to:pilot(S)?contact(key)-1:SC[key].frames-1);remember('answer:'+S.scene);board=true;eye=null;showDots=!!S.reveal;cb();
  }
  const viewing=(X,first)=>X===first?'Your first choice '+X:'Alternative '+X;
  function answer(i,X,demo,cb,force=false,only=null){
    const S=LESSON.steps[i];
    if(!pilot(S))return generalAnswer(S,X,demo,cb,force,only);
    const key=S.scene+X,alt=alternative(S,X),other=S.scene+alt;
    const end=()=>finishAnswer(S,X,cb);
    if(!force){
      start([{kind:'wide',key,from:SC[key].info.freeze,to:SC[key].frames-1,play:true,eye:viewing(X,ans[i]),title:S.opts[LETTERS.indexOf(X)]}],end,'Skip to feedback →');return true;
    }
    const route=(k,label)=>({kind:'wide',key:k,from:contact(k)-1,to:SC[k].frames-1,play:true,eye:label,title:S.opts[LETTERS.indexOf(k.slice(-1))]});
    const stages=only?[route(only,viewing(only.slice(-1),ans[i]))]:[
      route(key,viewing(X,ans[step])+' · follow the consequence'),
      {kind:'wide',key,from:SC[key].frames-1,ms:1300,eye:'What it earns',title:height&&X==='C'?'Approach. Then volley.':endLabel(key),copy:S.lines[X]},
      {kind:'rewind',key,from:SC[key].frames-1,to:contact(key)-1,ms:1000,eye:'Rewind',title:'Same contact. Another choice.'},
      route(other,'Compare · '+S.opts[LETTERS.indexOf(alt)])
    ];
    start(stages,end,'Skip to feedback →');stageInView();return true;
  }
  // Observation questions have one authored scene, not one outcome per answer.
  // Connected routes compare at the saved decision, never by changing the branch.
  function generalAnswer(S,X,demo,cb,force,only){
    const key=S.reveal?S.scene:S.scene+X,sc=SC[key],q=questionRange(S);
    const end=()=>finishAnswer(S,X,cb);
    if(S.reveal){
      if(LESSON.readinessLesson&&force){cancel();replayArrival(S.scene);return true;}
      showDots=true;revealPattern=!!S.pattern;
      if(!force){end();return true;}
      start([{kind:'evidence',key,from:q.from,to:q.to,play:true,silent:q.silent,native:true,eye:'Replay the evidence',title:S.unlock}],end,'Skip to feedback →');return true;
    }
    const route=(k,label)=>({kind:'wide',key:k,from:SC[k].info.freeze,to:SC[k].frames-1,play:true,eye:label,title:S.opts[LETTERS.indexOf(k.slice(-1))]});
    const short=!force&&(dailyLesson||CALM_MOTION||seen.has('answer:'+S.scene)||demo);
    let stages=only?[route(only,viewing(only.slice(-1),ans[step]))]:[route(key,viewing(X,ans[step])+' · follow the consequence')];
    if(!short&&!only){
      stages.push(
        {kind:'rewind',key,from:sc.frames-1,to:sc.info.freeze,ms:850,eye:'Rewind',title:'Same moment. Another choice.'},
        detail(S,key),
        route(S.scene+alternative(S,X),'Compare the alternative'));
    }
    start(stages,end,'Skip to feedback →');stageInView();return true;
  }
  function detail(S,key){
    const sc=SC[key],info=sc.info;
    // Contact inspection already has a lens authored for these lessons. Else,
    // retain the full spatial relationship: recovery, opponent or pair coverage.
    const contactLessons=['contact-clue','late-is-the-culprit'];
    const heightLessons=['high-ball','short-ball','live-point-short-low','live-point-volley-build','live-point-volley-opening'];
    const coverageLessons=['recovery','forehand-bill','pulled-wide','rushed-out-wide','live-point-buy-time','live-point-other-wing'];
    const focus=contactLessons.includes(slug)?'contact':heightLessons.includes(slug)?'height':LESSON.doubles?'pair':coverageLessons.includes(slug)?'coverage':'opponent';
    const hit=contactsOf(sc,'you').find(f=>f>=info.freeze-2);
    const f=['contact','height'].includes(focus)?hit??info.freeze:info.liveRecovery?.theirHit??info.authoredPoint?.theirHit??info.freeze;
    return {kind:'evidence',key,from:f,ms:1800,eye:'The deciding detail',title:({contact:'Space at contact',height:'Contact height',pair:'Read both pairs',coverage:'Read the coverage',opponent:'Read their position'})[focus],copy:S.take,focus};
  }

  function feedback(i,X){
    const S=LESSON.steps[i];
    board=true;
    const pulse=!revealed.has(i);revealed.add(i);
    const recommended=LETTERS[S.correct];
    let expanded=false;
    [...$('askOpts').children].forEach((b,j)=>{
      const Y=LETTERS[j],note=pilot(S)?cues[j]:'',first=Y===ans[i],pick=Y===recommended;
      b.className='opt directed-option'+(pulse?' reveal-choice':'');b.disabled=false;
      b.innerHTML=`<span class="l">${Y}</span><span>${S.opts[j]}${note?`<small class="directed-note">${note}</small>`:''}<span class="directed-meta">${pick?'<small class="directed-pick" aria-label="GS recommended choice">GS <span aria-hidden="true">✓</span></small>':''}${first?'<small class="directed-first">Your first choice</small>':''}</span></span>`;
      b.setAttribute('aria-label',`Review option ${Y}: ${S.opts[j]}.${note?' '+note+'.':''}${pick?' GS recommended choice.':''}${first?' Your first choice.':''}`);
      b.setAttribute('aria-pressed',String(Y===X));b.onclick=()=>choose(i,Y,true);
    });
    colourChoices(S);
    const b=document.createElement('div');b.className='directed-review';b.id='directedReview';
    b.innerHTML=`<div class="directed-compare"><button id="exploreDirected" aria-expanded="false" aria-controls="askOpts">${S.reveal?'Explore other answers':'Explore other shots'}</button><button id="directedOther">${S.reveal?'Replay the evidence':'Rewind & compare'}</button></div>`;
    const identity=document.createElement('p');identity.className='directed-identity';identity.id='directedIdentity';
    identity.textContent=`Viewing ${X} · First answer ${ans[i]||X}`;
    $('verdict').querySelector('.fbh').after(identity);
    GSSceneEvidence.feedback(S,X,ans[i]||X);
    $('verdict').appendChild(b);
    if($('tryOther'))$('tryOther').hidden=true;
    $('directedOther').onclick=()=>answer(i,X,true,()=>{board=true;},true);
    function showChoices(){
      [...$('askOpts').children].forEach((tile,j)=>tile.classList.toggle('hide',!expanded&&LETTERS[j]!==X&&LETTERS[j]!==recommended));
      $('askOpts').classList.toggle('directed-single',!expanded&&X===recommended);
      $('exploreDirected').setAttribute('aria-expanded',String(expanded));
      $('exploreDirected').textContent=expanded?'Show fewer':S.reveal?'Explore other answers':'Explore other shots';
    }
    $('exploreDirected').onclick=()=>{expanded=!expanded;showChoices();tallView();};
    if(S.opts.length===2&&X!==recommended)$('exploreDirected').hidden=true;
    if(LESSON.readinessLesson)$('directedOther').hidden=true;
    showChoices();
  }
  function replay(){
    if(film){const stages=sequence.slice(),cb=finish,label=$('skipDirected').textContent;start(stages,cb,label);return true;}
    if(board&&LESSON.steps[step]){const S=LESSON.steps[step],X=chosen||ans[step];return answer(step,X,true,()=>{board=true;},true,S.reveal?S.scene:S.scene+X);}
    if(!done&&rewatch){rewatch.click();return true;}
    return false;
  }
  function predictReview(root){
    root.querySelectorAll('.review').forEach((row,i)=>{
      const S=LESSON.steps[i],first=ans[i],pick=LETTERS[S.correct];let viewed=first,expanded=false;
      const original=row.querySelector('.ra'),explanation=original.nextElementSibling;original.remove();
      row.querySelector('p b')?.remove();
      const box=document.createElement('div');box.className='opts';box.id='predictOptions'+i;
      const identity=document.createElement('p');identity.className='directed-identity';
      const tools=document.createElement('div');tools.className='directed-compare';
      const explore=document.createElement('button');explore.textContent='Explore other shots';explore.setAttribute('aria-controls',box.id);
      const compare=document.createElement('button');compare.textContent='Rewind & compare';
      tools.append(explore,compare);
      function paint(){
        identity.textContent=`Viewing ${viewed} · First answer ${first}`;
        box.replaceChildren();box.classList.toggle('directed-single',!expanded&&viewed===pick);explanation.textContent=S.lines[viewed];
        explore.setAttribute('aria-expanded',String(expanded));explore.textContent=expanded?'Show fewer':'Explore other shots';
        S.opts.forEach((text,j)=>{
          const X=LETTERS[j],b=document.createElement('button');b.className='opt directed-choice directed-option';
          b.style.setProperty('--choice',coloursFor(S.scene)[j].slice(1).match(/../g).map(v=>parseInt(v,16)).join(','));
          b.classList.toggle('hide',!expanded&&X!==viewed&&X!==pick);b.setAttribute('aria-pressed',String(X===viewed));
          b.innerHTML=`<span class="l">${X}</span><span>${text}<span class="directed-meta">${X===pick?'<small class="directed-pick" aria-label="GS recommended choice">GS <span aria-hidden="true">✓</span></small>':''}${X===first?'<small class="directed-first">Your first choice</small>':''}</span></span>`;
          b.onclick=()=>{viewed=X;expanded=false;paint();play(false);};box.appendChild(b);
        });
      }
      function play(compare){
        const key=S.scene+viewed,other=S.scene+alternative(S,viewed);
        const route=(k,label)=>({kind:'wide',key:k,from:SC[k].info.freeze,to:SC[k].frames-1,play:true,eye:label,title:S.opts[LETTERS.indexOf(k.slice(-1))]});
        const stages=[route(key,'Read '+(i+1)+' · '+viewing(viewed,first))];
        if(compare)stages.push({kind:'rewind',key,from:SC[key].frames-1,to:SC[key].info.freeze,ms:850,eye:'Rewind',title:'Same moment. Another choice.'},route(other,'Compare the alternative'));
        start(stages,()=>{frame(key,SC[key].frames-1);questionCaption('Your court cue');GSSceneEvidence.feedback(S,viewed,first);},'Back to review →');stageInView();
      }
      row.querySelector('[data-watch]')?.remove();
      row.querySelector('.rq').after(box,identity);row.append(tools);explore.onclick=()=>{expanded=!expanded;paint();};compare.onclick=()=>play(true);paint();
    });
  }
  // Camera, framing and overlay use the same sampled pose for this frame.
  let lastEdit,lastFrame,lastView;
  function dailyView(){
    if(lastEdit!==shot||lastFrame!==t){
      lastEdit=shot;lastFrame=t;lastView=DailyFilms.composition(shot,SC[scene],t);
    }
    return lastView;
  }
  function desired(){
    if(shot?.edit)return dailyView().camera;
    const kind=shot?.kind||'wide',h=actorAt(SC[scene],'you',t).pose[I.hips],u=smooth(0,1800,elapsed);
    if(kind==='evidence'&&['contact','height'].includes(shot.focus)){const b=ballAt(SC[scene],t)||h;return {az:-40,el:15,d:7,fov:38,tgt:[b[0],b[1],1]};}
    if(kind==='evidence')return {az:-90,el:35,d:32,fov:40,tgt:[0,0,0]};
    if(kind==='height')return {az:-24,el:9,d:14,fov:40,tgt:[at()[0],-2.8,.7]};
    if(kind==='line')return {az:-177,el:9,d:9,fov:40,tgt:[-3.9,11.1,.55]};
    if(kind==='net')return {az:-100,el:9,d:8,fov:40,tgt:[2.5,0,.65]};
    if(kind==='opening')return {az:lerp(-115,-83,u),el:12,d:15,fov:40,tgt:[h[0]*.6,h[1]+4,.8]};
    return {az:CALM_MOTION?-90:kind==='wide'?-90:lerp(-110,-72,u),el:kind==='wide'?29:39,d:32,fov:40,tgt:[0,0,0]};
  }
  // Readiness pairs share the actual arrival camera. Only the lead-in sweeps;
  // the close-up then follows the same action to the decision.
  function nativeView(){
    return shot?.native || (LESSON.readinessLesson && (shot?.kind==='sweep'||shot?.kind==='dailyDetail') &&
      t>=SC[scene].info.readiness.start);
  }
  function camera(){
    if(nativeView()||!film&&(!board||!pilot(LESSON.steps[step]||{})))return false;
    const c=desired();if(!eye||CALM_MOTION||shot?.kind==='dailyHold')eye=c;
    else if(!paused){for(const k of ['az','el','d','fov'])eye[k]=lerp(eye[k],c[k],.09);eye.tgt=lerp3(eye.tgt,c.tgt,.09);}
    cam={...eye,tgt:[...eye.tgt]};return true;
  }
  function fit(){
    if(nativeView()||!film&&(!board||!pilot(LESSON.steps[step]||{})))return false;
    const kind=shot?.kind,sc=SC[scene],you=actorAt(sc,'you',t),p=kind==='height'?at():null;let points;
    if(shot?.edit)points=dailyView().points;
    else if(kind==='height')points=you.pose.concat([[p[0],0,0],[p[0],0,1.8],[p[0],p[1],0]]);
    else if(kind==='evidence'&&['contact','height'].includes(shot.focus))points=you.pose.concat([add(you.pose[I.head],[0,0,.4]),you.rq.centre,ballAt(sc,t)||you.rq.centre]);
    else if(kind==='line')points=[[-4.5,9.5,0],[-3.5,13,0],[-4,11,2]];
    else if(kind==='net')points=[[1.3,0,0],[3.8,0,0],[2.5,0,1.7]];
    else if(kind==='opening')points=you.pose.concat([you.rq.centre,add(you.rq.centre,[.5,0,.5]),add(you.rq.centre,[-.5,0,-.5]),add(you.pose[I.head],[0,0,.3]),[0,5,1]]);
    else points=[[-5.4,-13.4,0],[5.4,-13.4,0],[-5.4,13,0],[5.4,13,0],[0,-12,2],[0,12,2]];
    if(kind==='wide'||kind==='sweep'||kind==='evidence'&&!['contact','height'].includes(shot.focus))for(const who of Object.keys(sc.actors)){const a=actorAt(sc,who,t);if(a)points.push(...a.pose,a.rq.centre,add(a.pose[I.head],[0,0,.4]));}
    const ball=ballAt(sc,t);if(ball&&!shot?.edit&&!['height','line','net','opening'].includes(kind))points.push(ball);
    const q=points.map(toCam).filter(q=>q.z>ZNEAR),us=q.map(q=>q.x/q.z),vs=q.map(q=>q.y/q.z);
    const u0=Math.min(...us),u1=Math.max(...us),v0=Math.min(...vs),v1=Math.max(...vs);
    const top=film?Math.max(120,cap.getBoundingClientRect().height*VW/$('stage').clientWidth+28):32,bottom=45;
    const f=Math.min((VW-(kind==='height'||kind==='opening'||shot?.edit?180:90))/(u1-u0),(VH-top-bottom)/(v1-v0)),x=VW/2-f*(u0+u1)/2,y=top+(VH-top-bottom)/2+f*(v0+v1)/2;
    if(!framing||CALM_MOTION||!film||shot?.kind==='dailyHold')framing=[f,x,y];else if(!paused)framing=framing.map((v,i)=>lerp(v,[f,x,y][i],.15));
    FOCAL=framing[0];window.__pc=framing.slice(1);return true;
  }
  function evidenceLabel(frag,p,text,col,dy){
    const q=P(p);if(!q)return;
    const label=el_('text',{x:clamp(q.s[0],110,VW-110),y:clamp(q.s[1]+dy,40,VH-30),'text-anchor':'middle',fill:col,'font-family':'Bebas Neue, Impact, sans-serif','font-size':32,stroke:'#07130b','stroke-width':3,'paint-order':'stroke'});label.textContent=text;frag.appendChild(label);
  }
  function draw(frag){
    if(!film&&!board)return;
    const kind=shot?.kind;
    if(shot?.edit){
      const view=dailyView();
      DailyFilms.draw(frag,view);
      if(kind==='dailyHold'){
        const label=slug==='second-serve'?Math.round(view.b[2]*100)+' CM':shot.edit.mark;
        evidenceLabel(frag,view.b,label,'#f4d478',-26);
      }
    }
    if(kind==='height'){
      const p=at(),nh=net(p[0]);seg(frag,[p[0],p[1],0],p,'#e8f27a',4,1);seg(frag,[p[0],0,0],[p[0],0,nh],'#f08a8a',4,1);
      seg(frag,p,[p[0],0,p[2]],'#e8f27a',2,.7);
      evidenceLabel(frag,[p[0],p[1],0],'CONTACT '+Math.round(p[2]*100)+' CM','#e8f27a',26);
      evidenceLabel(frag,[p[0],0,nh],'TAPE '+Math.round(nh*100)+' CM','#f08a8a',-18);
    }
    if(kind==='evidence'&&!shot.native){
      const sc=SC[scene],you=actorAt(sc,'you',t),ball=ballAt(sc,t),col='#e3cd83';
      if(['contact','height'].includes(shot.focus)&&ball){
        const a=shot.focus==='contact'?you.pose[I.hipR]:[ball[0],ball[1],0];
        seg(frag,a,ball,col,3,.9);
        for(const p of [a,ball]){const q=P(p);if(q)frag.appendChild(el_('circle',{cx:q.s[0],cy:q.s[1],r:12,fill:'none',stroke:col,'stroke-width':2.5}));}
      }else{
        const who=shot.focus==='pair'?Object.keys(sc.actors):shot.focus==='coverage'?['you','opp']:['opp'];
        for(const name of who){const a=actorAt(sc,name,t);if(a){const h=a.pose[I.hips];ring(frag,[h[0],h[1],.02],.65,.65,col,2,.9);}}
      }
    }
    if(kind==='line')label(frag,[-4,11.13,0],'IN BY '+Math.round(SC.wn1.info.shot.courtMargin*100)+' CM','#e3cd83',22,1,22);
  }
  return {question,answer,feedback,predictReview,offerSkip,cancel,skip,pause,tick,camera,fit,draw,replay,optionColour,colourChoices,get active(){return !!film;},get dailyCloseUp(){return !!shot?.edit;},get board(){return board&&pilot(LESSON.steps[step]||{});},get state(){return {active:!!film,phase:shot?.kind,board,paused,seen:[...seen]};}};
})();
