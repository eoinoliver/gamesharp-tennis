/* Describe the evidence available at the decision, never an unplayed option.
   Positions use the renderer's poses at questionRange().to. Editorial notes
   describe already-shown replays; they contain no recommended answer. */
window.GSSceneEvidence=(()=>{
  const slug=new URLSearchParams(location.search).get('l');
  const observed={
    'contact-clue':{
      cp1:'In the held forehand contact, your hitting arm is tucked close to your body, with the elbow bent.',
      cp2:'In the held forehand contact, your hitting arm has space away from your body.',
      cp3:'In the held forehand contact, your hitting arm is tucked close to your body again.'
    },
    'late-is-the-culprit':{
      lc1:'In the held forehand contact, the ball is beside and slightly behind your hitting-side hip.',
      lc2:'The faster forehand is held with the ball beside and slightly behind your hitting-side hip again.',
      lc3:'In the held backhand contact, the ball is beside and slightly behind your hip.'
    },
    'second-serve':{sq1:'In the two serves just shown, the receiver meets the first ball around chest height and the second above shoulder height.'},
    'serve-plus-one':{daily1:'In both returns just shown, the receiver reaches outside the sideline. The return lands short, towards the middle.'},
    'the-winner':{wn1:'The shot just shown starts from a low contact and lands on the down-the-line edge of the court.'}
  };
  function position(p){
    const x=p[0],y=Math.abs(p[1]);
    const side=Math.abs(x)<1?'near the middle':Math.abs(x)>4.115?`outside the ${x<0?'left':'right'} singles sideline`:`on the ${x<0?'left':'right'} half`;
    const depth=y>12.4?'behind the baseline':y>11?'near the baseline':y>6.8?'between the service line and baseline':y>5.7?'near the service line':y>2.3?'inside the service box':'close to the net';
    return `${side}, ${depth}`;
  }
  function movement(a,b){
    const dx=b[0]-a[0],dy=Math.abs(b[1])-Math.abs(a[1]),parts=[];
    if(Math.abs(dx)>.35)parts.push(dx>0?'right':'left');
    if(Math.abs(dy)>.35)parts.push(dy>0?'away from the net':'towards the net');
    return parts.length?`; moving ${parts.join(' and ')}`:'';
  }
  function describe(S){
    const q=questionRange(S),sc=SC[q.scene],end=q.to;
    // Held continuations have already shown the parent's last movement.
    const from=Math.max(q.from===end?0:q.from,end-40);
    const parts=[];
    if(observed[slug]?.[S.scene])parts.push(observed[slug][S.scene]);
    if(sc.info.readiness){
      const r=sc.info.readiness;
      parts.push(r.arrive<=end?'You have arrived at the ball and finished moving into your preparation position.':'You are still moving into your preparation position as the ball approaches.');
    }
    const timing=sc.info.timing;
    if(S.reveal&&timing&&[timing.land,timing.contact,timing.push].every(f=>f>=q.from&&f<=end)){
      parts.push(timing.land<timing.contact?'In the replay, your split step lands before their hit. There is a pause before you push off.':'In the replay, your split step lands just after their hit, followed by your first move.');
    }
    parts.push('At the pause, looking from your baseline:');
    for(const [name,label] of [['you','You are'],['opp','Your opponent is'],['partner','Your partner is'],['oppPartner','Their partner is']]){
      const now=actorAt(sc,name,end),before=actorAt(sc,name,from);
      if(now)parts.push(`${label} ${position(now.pose[I.hips])}${before?movement(before.pose[I.hips],now.pose[I.hips]):''}.`);
    }
    const ball=ballAt(sc,end),before=ballAt(sc,Math.max(q.from,end-8));
    if(ball){
      const z=ball[2],height=z<.15?'close to the ground':z<.9?'low, below net height':z<1.25?'around waist height':z<1.55?'around chest height':z<1.9?'around shoulder height':'above head height';
      const travel=before&&Math.abs(ball[1]-before[1])>.1?(ball[1]>before[1]?' towards their end':' towards your end'):'';
      parts.push(`The ball is ${height}${travel?', travelling'+travel:''}.`);
    }
    return parts.join(' ');
  }
  let row=null;
  function clear(){row?.remove();row=null;$('svg').setAttribute('aria-label','3D replay of the point');}
  function playing(){clear();}
  function show(S,rewatch){
    row?.remove();row=document.createElement('div');row.className='scene-tools';row.id='sceneTools';
    const details=document.createElement('details');details.id='sceneDescription';
    const summary=document.createElement('summary');summary.textContent='Scene description';
    const p=document.createElement('p');p.textContent=describe(S);p.id='sceneDescriptionText';
    details.append(summary,p);rewatch.before(row);row.append(details,rewatch);
    // The image has the same description even while the optional disclosure is closed.
    $('svg').setAttribute('aria-label',p.textContent);
  }
  function feedback(S,X,first){
    const identity=`Viewing option ${X}. First answer ${first}.`;
    $('svg').setAttribute('aria-label',S.reveal?`${identity} ${describe(S)}`:`${identity} ${S.lines[X]}`);
  }
  return {describe,show,clear,playing,feedback};
})();
