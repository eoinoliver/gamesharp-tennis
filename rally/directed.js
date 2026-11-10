/* Directed pilot: shared scene data, first-answer scoring and normal lesson navigation.
   The showcase supplies the editorial pattern; authored landing samples are not resimulated. */
window.GSDirected=(()=>{
  const slug=new URLSearchParams(location.search).get('l');
  if(!['the-winner','short-ball'].includes(slug))return null;
  const prefix=slug==='short-ball'?'sb3':'wn2',height=prefix==='sb3';
  const palette=['#6fd6c4','#f0a35e','#c8a84b','#b9a3f0'];
  const storeKey='gs_directed_v1_'+slug;
  const seen=new Set();try{for(const k of JSON.parse(localStorage.getItem(storeKey)||'[]'))seen.add(k);}catch{}
  const remember=k=>{seen.add(k);try{localStorage.setItem(storeKey,JSON.stringify([...seen]));}catch{}};
  const cap=document.createElement('div');cap.id='directedCaption';cap.className='directed-cap';cap.hidden=true;cap.setAttribute('role','status');
  cap.innerHTML='<small></small><strong></strong><p></p>';$('stage').appendChild(cap);
  const dock=document.createElement('div');dock.id='directedDock';dock.className='directed-dock';dock.hidden=true;
  dock.innerHTML='<span>Watch the point</span><button type="button" id="skipDirected">Skip to decision →</button>';$('viewer').appendChild(dock);
  let film=null,shot=null,elapsed=0,last=null,paused=false,queue=[],sequence=[],finish=null,board=false,eye=null,framing=null,rewatch=null;
  const contact=k=>contactsOf(SC[k],'you').find(f=>f>=SC[k].info.freeze-2);
  const at=()=>SC[prefix+'C'].info.youContact;
  const net=x=>.914+(1.07-.914)*Math.min(1,Math.abs(x)/6.4)**2;
  const frame=(key,f)=>{scene=key;t=f;stopAt=f;onStop=null;setPlaying(false);};
  function cancel(){
    film=null;shot=null;queue=[];sequence=[];finish=null;board=false;eye=null;framing=null;last=null;
    clearTimeout(stopTimer);stopTimer=null;pendingStop=null;stopGeneration++;onStop=null;
    window.__pc=null;cap.hidden=dock.hidden=true;$('viewer').classList.remove('directing');
    if(rewatch){rewatch.remove();rewatch=null;}
  }
  function caption(s){cap.children[0].textContent=s.eye||'';cap.children[1].textContent=s.title||'';cap.children[2].textContent=s.copy||'';}
  function next(){
    if(!film)return;
    shot=queue.shift();elapsed=0;last=null;
    if(!shot){const cb=finish;cancel();cb?.();return;}
    $('viewer').dataset.directedPhase=shot.kind;caption(shot);dock.firstElementChild.textContent=shot.kind==='rewind'?'Same contact · another choice':'Watch the point';
    if(shot.play){run(shot.key,shot.from,shot.to,next);}
    else {frame(shot.key,shot.from);$('playIcon').innerHTML=PAUSE_I;$('playBtn').setAttribute('aria-label','Pause');}
  }
  function start(stages,cb,label){
    cancel();clearContactInspection();questionCaption();showDots=false;showTargets=null;
    film=true;paused=false;sequence=stages.slice();queue=stages.slice();finish=cb;cap.hidden=dock.hidden=false;
    $('viewer').classList.add('directing');$('skipDirected').textContent=label;next();
  }
  function skip(){if(!film)return false;const cb=finish;cancel();setPlaying(false);cb?.();return true;}
  $('skipDirected').onclick=e=>{e.stopPropagation();skip();};
  function pause(){if(!film)return false;paused=!paused;if(shot.play)setPlaying(!paused);$('playIcon').innerHTML=paused?PLAY_I:PAUSE_I;$('playBtn').setAttribute('aria-label',paused?'Play':'Pause');dock.firstElementChild.textContent=paused?'Paused · tap court to resume':'Watch the point';last=null;return true;}
  function tick(ts){
    if(!film)return;
    if(document.hidden||paused){last=null;return;}
    const dt=last==null?0:Math.min(50,ts-last)*(window.__speed||1);last=ts;elapsed+=dt;
    if(!shot.play){
      if(shot.kind==='rewind')t=lerp(shot.from,shot.to,smooth(0,shot.ms,elapsed));
      if(elapsed>=shot.ms)next();
    }
  }
  function restoreQuestion(S,cb){
    const q=questionRange(S);frame(q.scene,q.to);showDots=false;
    remember('intro:'+S.scene);questionCaption(q.after);cb();
    rewatch=document.createElement('button');rewatch.className='directed-rewatch';rewatch.id='watchDirected';rewatch.textContent=height?'Watch the height again':'Watch the scene again';
    rewatch.onclick=()=>{stageSit(S.sit);paintAsk(S);question(S,()=>{showTargets=S.reveal?null:S.scene;typeSit(S.sit,enableAsk);},true);stageInView();};$('ask').before(rewatch);
  }
  function question(S,cb,force=false){
    if(S.scene!==prefix&&!(slug==='the-winner'&&S.scene==='wn1'))return false;
    const q=questionRange(S),end=()=>restoreQuestion(S,cb);
    if(!force&&(CALM_MOTION||seen.has('intro:'+S.scene))){end();return true;}
    if(S.scene==='wn1'){
      start([{kind:'opening',key:'wn1',from:62,to:298,play:true,eye:'A low ball. A narrow target.',title:'You go for the line.'},
        {kind:'line',key:'wn1',from:298,ms:1800,eye:'Winner',title:'Would you choose it again?',copy:'In by '+Math.round(SC.wn1.info.shot.courtMargin*100)+' cm.'}],end,'Skip to decision →');
    }else if(height){
      const key=prefix+'A';start([
        {kind:'opening',key,from:62,to:257,play:true,eye:'A short ball. They’re still deep.',title:'A free point?'},
        {kind:'net',key,from:257,ms:1100,eye:'Into the tape',title:'Read the height.'},
        {kind:'rewind',key,from:257,to:contact(key)-1,ms:850,eye:'Rewind',title:'Before you swing.'},
        {kind:'height',key:prefix+'C',from:contact(prefix+'C')-1,ms:2600,eye:'The deciding detail',title:'Below the tape.',copy:'Contact '+Math.round(at()[2]*100)+' cm. Tape '+Math.round(net(at()[0])*100)+' cm.'}
      ],end,'Skip to decision →');
    }else start([{kind:'sweep',key:q.scene,from:q.from,to:q.to,play:true,eye:'Same ball',title:'Choose before the result.'}],end,'Skip to decision →');
    return true;
  }
  function alternative(S,X){return LETTERS[S.correct]!==X?LETTERS[S.correct]:(height?'A':'C');}
  function finishAnswer(S,X,cb){
    const key=S.scene+X;frame(key,contact(key)-1);remember('answer:'+S.scene);board=true;eye=null;showDots=false;cb();
  }
  function answer(i,X,demo,cb,force=false,only=null){
    const S=LESSON.steps[i];if(S.scene!==prefix)return false;
    const key=S.scene+X,alt=alternative(S,X),other=S.scene+alt;
    const end=()=>finishAnswer(S,X,cb);
    if(!force&&(CALM_MOTION||seen.has('answer:'+S.scene)||demo)){
      start([{kind:'wide',key,from:SC[key].info.freeze,to:SC[key].frames-1,play:true,eye:'Your shot',title:S.opts[LETTERS.indexOf(X)]}],end,'Skip to feedback →');return true;
    }
    const route=(k,label)=>({kind:'wide',key:k,from:contact(k)-1,to:SC[k].frames-1,play:true,eye:label,title:S.opts[LETTERS.indexOf(k.slice(-1))]});
    const stages=only?[route(only,only===key?'Your choice':'Compare the alternative')]:[
      route(key,'Your choice · follow the consequence'),
      {kind:'wide',key,from:SC[key].frames-1,ms:1300,eye:'What it earns',title:height&&X==='C'?'Approach. Then volley.':endLabel(key),copy:S.lines[X]},
      {kind:'rewind',key,from:SC[key].frames-1,to:contact(key)-1,ms:1000,eye:'Rewind',title:'Same contact. Another choice.'},
      route(other,'Compare · '+S.opts[LETTERS.indexOf(alt)]),
      {kind:'samples',key,from:contact(key)-1,ms:3200,eye:'Same ball · ten tries per shot',title:'Compare the margin.'}
    ];
    start(stages,end,'Skip to feedback →');stageInView();return true;
  }
  function feedback(i,X){
    const S=LESSON.steps[i];if(S.scene!==prefix)return;
    board=true;
    const b=document.createElement('div');b.className='directed-board';b.id='directedBoard';
    b.innerHTML='<p>Ten tries · balls in court</p>'+[...LETTERS].map((Y,j)=>{const d=dotsOf(prefix+Y),n=d.filter(x=>x[2]).length;
      return `<div class="directed-row" style="--sample:${palette[j]}"><span>${S.opts[j]}${Y===ans[i]?'<small>Your first choice</small>':''}</span><span class="directed-pips" aria-hidden="true">${d.map((_,k)=>'<i class="'+(k<n?'in':'')+'"></i>').join('')}</span><b>${n}/${d.length}</b></div>`;
    }).join('')+'<div class="directed-compare"><button id="directedOwn">Replay your shot</button><button id="directedOther">Rewind & compare</button></div>';
    $('verdict').querySelector('.fb').appendChild(b);
    $('directedOwn').onclick=()=>{const original=ans[i]||X;answer(i,original,true,()=>{board=true;},true,prefix+original);};
    $('directedOther').onclick=()=>answer(i,ans[i]||X,true,()=>{board=true;},true);
  }
  function replay(){
    if(film){const stages=sequence.slice(),cb=finish,label=$('skipDirected').textContent;start(stages,cb,label);return true;}
    if(board&&LESSON.steps[step]?.scene===prefix){const X=chosen||ans[step];return answer(step,X,true,()=>{board=true;},true,prefix+X);}
    return false;
  }
  function desired(){
    const kind=shot?.kind||'samples',h=actorAt(SC[scene],'you',t).pose[I.hips],u=smooth(0,1800,elapsed);
    if(kind==='height')return {az:-24,el:9,d:14,fov:40,tgt:[at()[0],-2.8,.7]};
    if(kind==='line')return {az:-177,el:9,d:9,fov:40,tgt:[-3.9,11.1,.55]};
    if(kind==='net')return {az:-100,el:9,d:8,fov:40,tgt:[2.5,0,.65]};
    if(kind==='opening')return {az:lerp(-115,-83,u),el:12,d:15,fov:40,tgt:[h[0]*.6,h[1]+4,.8]};
    return {az:CALM_MOTION?-90:kind==='wide'?-90:lerp(-110,-72,u),el:kind==='wide'?29:39,d:32,fov:40,tgt:[0,0,0]};
  }
  function camera(){
    if(!film&&!board)return false;
    const c=desired();if(!eye||CALM_MOTION)eye=c;
    else if(!paused){for(const k of ['az','el','d','fov'])eye[k]=lerp(eye[k],c[k],.09);eye.tgt=lerp3(eye.tgt,c.tgt,.09);}
    cam={...eye,tgt:[...eye.tgt]};return true;
  }
  function fit(){
    if(!film&&!board)return false;
    const kind=shot?.kind,sc=SC[scene],you=actorAt(sc,'you',t),p=at();let points;
    if(kind==='height')points=you.pose.concat([[p[0],0,0],[p[0],0,1.8],[p[0],p[1],0]]);
    else if(kind==='line')points=[[-4.5,9.5,0],[-3.5,13,0],[-4,11,2]];
    else if(kind==='net')points=[[1.3,0,0],[3.8,0,0],[2.5,0,1.7]];
    else if(kind==='opening')points=you.pose.concat([you.rq.centre,add(you.rq.centre,[.5,0,.5]),add(you.rq.centre,[-.5,0,-.5]),add(you.pose[I.head],[0,0,.3]),[0,5,1]]);
    else points=[[-5.4,-13.4,0],[5.4,-13.4,0],[-5.4,13,0],[5.4,13,0],[0,-12,2],[0,12,2]];
    if(board||kind==='samples')points.push(...[...LETTERS].flatMap(X=>dotsOf(prefix+X).map(([x,y])=>[x,y<1?-.15:y,.02])));
    if(kind==='wide')points.push(...you.pose,...actorAt(sc,'opp',t).pose);
    const q=points.map(toCam).filter(q=>q.z>ZNEAR),us=q.map(q=>q.x/q.z),vs=q.map(q=>q.y/q.z);
    const u0=Math.min(...us),u1=Math.max(...us),v0=Math.min(...vs),v1=Math.max(...vs);
    const top=film?Math.max(120,cap.getBoundingClientRect().height*VW/$('stage').clientWidth+28):32,bottom=45;
    const f=Math.min((VW-(kind==='height'||kind==='opening'?180:90))/(u1-u0),(VH-top-bottom)/(v1-v0)),x=VW/2-f*(u0+u1)/2,y=top+(VH-top-bottom)/2+f*(v0+v1)/2;
    if(!framing||CALM_MOTION||!film)framing=[f,x,y];else if(!paused)framing=framing.map((v,i)=>lerp(v,[f,x,y][i],.15));
    FOCAL=framing[0];window.__pc=framing.slice(1);return true;
  }
  function evidenceLabel(frag,p,text,col,dy){
    const q=P(p);if(!q)return;
    const label=el_('text',{x:clamp(q.s[0],110,VW-110),y:clamp(q.s[1]+dy,40,VH-30),'text-anchor':'middle',fill:col,'font-family':'Bebas Neue, Impact, sans-serif','font-size':32,stroke:'#07130b','stroke-width':3,'paint-order':'stroke'});label.textContent=text;frag.appendChild(label);
  }
  function draw(frag){
    if(!film&&!board)return;
    const kind=shot?.kind;
    if(kind==='height'){
      const p=at(),nh=net(p[0]);seg(frag,[p[0],p[1],0],p,'#e8f27a',4,1);seg(frag,[p[0],0,0],[p[0],0,nh],'#f08a8a',4,1);
      seg(frag,p,[p[0],0,p[2]],'#e8f27a',2,.7);
      evidenceLabel(frag,[p[0],p[1],0],'CONTACT '+Math.round(p[2]*100)+' CM','#e8f27a',26);
      evidenceLabel(frag,[p[0],0,nh],'TAPE '+Math.round(nh*100)+' CM','#f08a8a',-18);
    }
    if(kind==='line')label(frag,[-4,11.13,0],'IN BY '+Math.round(SC.wn1.info.shot.courtMargin*100)+' CM','#e3cd83',22,1,22);
    if(kind!=='samples'&&!board)return;
    const p=at();[...LETTERS].forEach((X,j)=>{
      const dots=dotsOf(prefix+X);dots.forEach(([x,y,ok],k)=>{
        const u=board?1:clamp((elapsed-k*130-j*70)/1300,0,1);if(!u)return;
        const end=[x,y<1?-.15:y,.02],peak=y<1?.25:Math.max(.8,SC[prefix+X].info.shot.netMarginCm/100+.4);
        let prev=p;for(let n=1;n<=Math.ceil(u*18);n++){
          const v=Math.min(u,n/18),q=[lerp(p[0],end[0],v),lerp(p[1],end[1],v),lerp(p[2],.02,v)+4*peak*v*(1-v)];
          seg(frag,prev,q,palette[j],1.3,board?.14:.38);prev=q;
        }
        if(u<1){const q=P(prev);if(q)frag.appendChild(el_('circle',{cx:q.s[0],cy:q.s[1],r:4,fill:palette[j]}));}
        else ring(frag,end,.18,.15,ok?palette[j]:'#e07070',1.5,.9,ok?palette[j]:'none');
      });
    });
  }
  return {question,answer,feedback,cancel,skip,pause,tick,camera,fit,draw,replay,get active(){return !!film;},get board(){return board;},get state(){return {active:!!film,phase:shot?.kind,board,paused,seen:[...seen]};}};
})();
