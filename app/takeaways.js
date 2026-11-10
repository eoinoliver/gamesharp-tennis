/* Authored recall aids. These are schematic cues, not measured ball trajectories. */
window.GSTakeaways=(()=>{
  const cards={"serve-plus-one":{"title":"Read the return you get.","rule":"Your serve creates a chance. The return decides whether you attack or rebuild.","panels":[{"label":"Short return","caption":"Use the open court","kind":"court","you":[91,135],"them":[145,28],"target":[55,38],"motion":"shot"},{"label":"Deep return","caption":"Reset with height & depth","kind":"court","you":[84,170],"them":[126,28],"target":[80,32],"motion":"shot"}]},"short-ball":{"title":"Height changes the attack.","rule":"Low and balanced, with them deep: lift the approach. Higher contact and open court let you attack with margin.","panels":[{"label":"Low contact","caption":"Lift the approach","kind":"height","low":true,"motion":"height"},{"label":"Higher + set","caption":"Attack with margin","kind":"height","low":false,"motion":"height"}]},"the-line":{"title":"Earn the change of direction.","rule":"Low and late: play crosscourt and recover. Take the line when you are balanced at a comfortable contact height.","panels":[{"label":"Low + late","caption":"Crosscourt first","kind":"court","you":[133,170],"them":[62,28],"target":[53,36],"motion":"shot"},{"label":"Balanced + set","caption":"The line is available","kind":"court","you":[112,132],"them":[54,28],"target":[110,38],"motion":"shot"}]},"the-winner":{"title":"Would you choose it again?","rule":"One winner does not settle the choice. Pick a target you would trust repeatedly from that position.","panels":[{"label":"One winner","caption":"A result, not a verdict","kind":"court","you":[111,155],"them":[80,27],"target":[111,20],"tight":true,"motion":"shot"},{"label":"Same low ball","caption":"Leave room for error","kind":"court","you":[111,155],"them":[80,27],"target":[62,40],"area":true,"motion":"shot"}]},"recovery":{"title":"Cover their next options.","rule":"Recover for the angles your shot leaves them. A shorter ball or a strong pattern can change your spot.","panels":[{"label":"You pull them wide","caption":"Shade towards their angles","kind":"court","you":[68,165],"them":[139,28],"target":null,"move":[96,165],"fan":true,"motion":"move"},{"label":"They are balanced","caption":"Recover deeper, nearer centre","kind":"court","you":[101,151],"them":[80,34],"target":null,"move":[80,173],"fan":true,"motion":"move"}]},"open-court":{"title":"Read the run before the space.","rule":"With a comfortable ball, make a running opponent turn. If they stop and set, use the space they have left.","panels":[{"label":"They are running","caption":"Play behind the run","kind":"court","you":[99,134],"them":[86,29],"target":[49,37],"opMove":[121,29],"motion":"shot"},{"label":"They have stopped","caption":"Use the open court","kind":"court","you":[99,134],"them":[50,29],"target":[109,37],"motion":"shot"}]},"forehand-bill":{"title":"Include the recovery cost.","rule":"A runaround needs time and a useful opening. Against a deep ball and a ready opponent, keep the backhand.","panels":[{"label":"Deep + ready opponent","caption":"Hold the backhand","kind":"court","you":[51,170],"them":[80,28],"target":[80,37],"motion":"shot"},{"label":"Shorter + stranded","caption":"Use the forehand","kind":"court","you":[45,136],"them":[45,28],"target":[108,37],"motion":"shot"}]},"the-lead":{"title":"Keep the depth that got you ahead.","rule":"Let the ball and their position change your plan. Leading on the scoreboard is not a reason to land shorter.","panels":[{"label":"5–2 ahead","caption":"Keep depth and margin","kind":"court","you":[106,157],"them":[55,28],"target":[55,39],"area":true,"motion":"shot"},{"label":"Pushed back at 5–4","caption":"Lift deep and rebuild","kind":"court","you":[86,174],"them":[80,28],"target":[80,36],"motion":"shot"}]},"split-step":{"title":"Time your landing to their hit.","rule":"Watch their strike. Land ready to push as the direction becomes readable; adjust to a quicker swing.","panels":[{"label":"Watch their strike","caption":"Begin the split","kind":"timing","phase":0,"motion":"split-rise"},{"label":"Read the direction","caption":"Land, then push","kind":"timing","phase":1,"motion":"split-land"}]},"approach-volley":{"title":"The approach shapes the volley.","rule":"Use depth to push their contact back, then follow your approach. Read their position before choosing the direction.","panels":[{"label":"Deep approach","caption":"Push their contact back","kind":"court","you":[101,128],"them":[106,20],"target":[107,30],"move":[100,110],"motion":"shot-follow"},{"label":"Short approach","caption":"They can contact further in","kind":"court","you":[101,128],"them":[102,56],"target":[105,64],"move":[100,110],"motion":"shot-follow"}]},"middle-return":{"title":"Through the middle—and deep.","rule":"Under pressure from a first serve, block deep through the middle. A soft second serve can offer more.","panels":[{"label":"Under pressure","caption":"Block deep middle","kind":"court","you":[141,166],"them":[82,24],"target":[80,33],"area":true,"motion":"shot"},{"label":"Middle but short","caption":"The server can step in","kind":"court","you":[141,166],"them":[82,54],"target":[80,64],"tight":true,"motion":"shot"}]},"high-ball":{"title":"Find a playable contact.","rule":"Read depth and your starting position. Step in when you have time; retreat when rushed; hold if you are already deep.","panels":[{"label":"Short + time","caption":"Step in","kind":"position","position":"in","motion":"move"},{"label":"Deep + rushed","caption":"Create space","kind":"position","position":"back","motion":"move"}]},"second-serve":{"title":"Watch their contact, not just “in”.","rule":"Depth and kick can make the return harder. If they handle the high ball comfortably, change the location.","panels":[{"label":"They step in","caption":"Add depth & kick","kind":"height","low":false,"kick":true,"motion":"height"},{"label":"They like it high","caption":"Change the location","kind":"court","you":[66,162],"them":[85,23],"target":[107,65],"motion":"shot"}]},"contact-clue":{"title":"Check the space before the swing.","rule":"A cramped contact is a useful clue. If the spacing is already clear, leave it alone and check the target.","panels":[{"label":"Cramped at contact","caption":"Create space","kind":"contact","space":false,"motion":"space"},{"label":"Space is clear","caption":"Check another cause","kind":"contact","space":true,"motion":"space"}]},"running-around":{"title":"The forehand needs time.","rule":"Use a reply that buys time to get around the ball. If the next ball skids deep, keep the backhand.","panels":[{"label":"Time to get around","caption":"Use the forehand","kind":"court","you":[48,141],"them":[50,28],"target":[107,37],"motion":"shot"},{"label":"Deep + still moving","caption":"Backhand deep across","kind":"court","you":[48,170],"them":[50,28],"target":[106,37],"motion":"shot"}]},"net-rusher":{"title":"How close did they get?","rule":"Read their distance from the net on either wing: dip to the feet near the service line; lob when they crowd the net.","panels":[{"label":"Near the service line","caption":"Dip to their feet","kind":"court","you":[98,159],"them":[81,55],"target":[81,61],"motion":"shot"},{"label":"Crowding the net","caption":"Lob over them","kind":"height","high":true,"motion":"height"}]},"pass-where-they-arent":{"title":"Pass the side they leave.","rule":"Look at the net player before you swing. Their coverage decides which passing lane is available.","panels":[{"label":"They cover the line","caption":"Pass crosscourt","kind":"court","you":[108,157],"them":[108,76],"target":[51,34],"motion":"shot"},{"label":"They shade crosscourt","caption":"Pass down the line","kind":"court","you":[108,157],"them":[59,76],"target":[110,34],"motion":"shot"}]},"late-is-the-culprit":{"title":"Prepare to meet it in front.","rule":"Use the held contact to check timing. Against more pace, turn early and shorten the preparation.","panels":[{"label":"Beside the hip","caption":"Late in this example","kind":"contact","space":true,"late":true,"motion":"contact"},{"label":"Prepared earlier","caption":"Meet it in front","kind":"contact","space":true,"front":true,"motion":"contact"}]},"the-moonballer":{"title":"Take time away when you can.","rule":"Step in early on the rising ball. Use the short reply to come forward; let a deep lob bounce rather than forcing the overhead.","panels":[{"label":"High rally ball","caption":"Step in early","kind":"position","position":"in","motion":"move"},{"label":"The reply is short","caption":"Approach and follow","kind":"court","you":[104,127],"them":[80,25],"target":[107,34],"move":[101,107],"motion":"shot-follow"}]},"the-pusher":{"title":"Make them change position.","rule":"On a short, workable ball, use where they stand: draw a deep defender forward, or approach against one on the baseline.","panels":[{"label":"They stay deep","caption":"Draw them forward","kind":"court","you":[103,132],"them":[80,5],"target":[53,75],"motion":"shot"},{"label":"They hold the baseline","caption":"Approach deep","kind":"court","you":[103,132],"them":[80,20],"target":[109,33],"move":[100,108],"motion":"shot-follow"}]},"pulled-wide":{"title":"Buy time—and use it.","rule":"Low, late and wide: lift deep to give yourself time to recover. An earlier arrival can create a different choice.","panels":[{"label":"Low + late + wide","caption":"Lift high and deep","kind":"court","you":[142,171],"them":[80,29],"target":[53,35],"motion":"shot"},{"label":"While the ball travels","caption":"Recover into the court","kind":"court","you":[142,171],"them":[80,29],"target":null,"move":[83,164],"motion":"move"}]},"serve-away-from-the-lean":{"title":"Notice what they leave open.","rule":"Check the returner before the toss. When they move to protect one serve, reconsider the space they have left.","panels":[{"label":"They guard the T","caption":"Serve wide","kind":"court","you":[66,163],"them":[85,20],"target":[110,66],"motion":"shot"},{"label":"They move out wide","caption":"Use the T","kind":"court","you":[66,163],"them":[135,20],"target":[83,66],"motion":"shot"}]},"the-big-hitter":{"title":"Change their contact zone.","rule":"Start a step back to give yourself time. Use low slice or height to move the ball out of their comfortable hitting zone.","panels":[{"label":"Below their strike zone","caption":"Low slice","kind":"height","low":true,"slice":true,"motion":"height"},{"label":"Above their strike zone","caption":"Height and depth","kind":"height","low":false,"high":true,"motion":"height"}]},"the-lefty":{"title":"Locate the backhand again.","rule":"From your side of the net, a left-hander’s backhand is on your left. Familiar right-hander patterns need checking.","panels":[{"label":"Left-handed opponent","caption":"Backhand on your left","kind":"court","you":[80,162],"them":[80,26],"target":[57,35],"lefty":true,"motion":"shot"},{"label":"Inside-out forehand","caption":"May feed their forehand","kind":"court","you":[48,147],"them":[80,26],"target":[108,35],"lefty":true,"motion":"shot"}]},"find-your-return-spot":{"title":"Let the serve set your position.","rule":"Move back for the big first serve; step in on the slower kick. A repeated big-point pattern can justify a small adjustment.","panels":[{"label":"Big first serve","caption":"Start further back","kind":"position","position":"back","motion":"move"},{"label":"Slower kick","caption":"Step in","kind":"position","position":"in","motion":"move"}]},"answer-the-drop":{"title":"Arrive, then look up.","rule":"Reach the drop under control and read where they went. In these situations, a deep reply gives you a way back into the point.","panels":[{"label":"Get there","caption":"Arrive under control","kind":"sequence","symbol":"feet","motion":"steps"},{"label":"Look up","caption":"Read them before replying","kind":"sequence","symbol":"eye","motion":"look"}]},"attack-the-backhand":{"title":"Move the guard before the target.","rule":"If they lean to protect the backhand, go to the other side first. Use the backhand space when they leave it.","panels":[{"label":"They guard the backhand","caption":"Move them the other way","kind":"court","you":[104,148],"them":[57,27],"target":[110,36],"motion":"shot"},{"label":"They have moved across","caption":"Now use the backhand","kind":"court","you":[104,148],"them":[133,27],"target":[52,36],"motion":"shot"}]},"down-the-line":{"title":"Check who is covering the line.","rule":"From a short ball and a balanced position, use the line while they recover. If they cover it early, go behind them crosscourt.","panels":[{"label":"They are still recovering","caption":"Use the line","kind":"court","you":[109,131],"them":[66,29],"target":[109,34],"opMove":[83,29],"motion":"shot"},{"label":"They cover the line","caption":"Go behind, crosscourt","kind":"court","you":[109,131],"them":[109,29],"target":[53,34],"motion":"shot"}]},"rushed-out-wide":{"title":"Give the reply a bigger target.","rule":"When pulled wide in these points, play deep through the middle. Get back before looking for a sharper angle.","panels":[{"label":"Forehand side","caption":"Deep middle","kind":"court","you":[143,169],"them":[80,27],"target":[80,34],"area":true,"motion":"shot"},{"label":"Backhand side","caption":"Deep middle","kind":"court","you":[17,169],"them":[80,27],"target":[80,34],"area":true,"motion":"shot"}]},"earned-attack":{"title":"An opening needs a ready player.","rule":"Check your arrival before attacking the space. If you are still chasing, leave margin and give yourself time to recover.","panels":[{"label":"Arrived with room","caption":"Use the opening","kind":"arrival","ready":true,"motion":"space"},{"label":"Still chasing","caption":"Margin, then recover","kind":"arrival","ready":false,"motion":"chase"}]},"earned-defence":{"title":"How much time do you need?","rule":"If you are still travelling out, buy recovery time with height and depth. Earlier arrival can make another reply available.","panels":[{"label":"Still travelling out","caption":"Buy recovery time","kind":"court","you":[142,172],"them":[80,27],"target":[56,35],"move":[93,168],"motion":"shot-follow"},{"label":"Earlier arrival","caption":"Read the opening again","kind":"court","you":[119,150],"them":[119,27],"target":[55,35],"motion":"shot"}]},"earned-net":{"title":"Reaching it does not earn the net.","rule":"A controlled arrival and a deep opponent can support an approach. If you are still chasing, make the reply manageable first.","panels":[{"label":"Controlled arrival","caption":"Consider the approach","kind":"arrival","ready":true,"motion":"space"},{"label":"Still reaching","caption":"Manage the reply first","kind":"arrival","ready":false,"motion":"chase"}]}};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dot=(p,cls,r=5)=>`<circle cx="${p[0]}" cy="${p[1]}" r="${r}" class="${cls}"/>`;
  function drawing(p,id){
    const arrow=(from,to,cls='tk-ball-path')=>`<path class="${cls}" d="M${from} L${to}" marker-end="url(#${id}-${cls==='tk-move'?'move':'ball'})"/>`;
    let body='';
    if(p.kind==='court'){
      body='<path class="tk-court" d="M36 17H124V163H36Z M48 17V163 M112 17V163 M48 56H112 M48 124H112 M80 56V124"/><path class="tk-net" d="M30 90H130"/>';
      if(p.fan)body+=`<path class="tk-options" d="M48 159 L${p.them} L112 159"/>`;
      if(p.target){
        if(p.area)body+=`<rect class="tk-target-area" x="${Math.max(49,p.target[0]-12)}" y="${Math.max(23,p.target[1]-9)}" width="24" height="18" rx="4"/>`;
        body+=arrow(p.you,p.target,'tk-ball-path')+dot(p.target,'tk-ball',3.5);
      }
      if(p.opMove)body+=arrow(p.them,p.opMove,'tk-move');
      if(p.move)body+=arrow(p.you,p.move,'tk-move')+`<circle cx="${p.you[0]}" cy="${p.you[1]}" r="6" class="tk-future"/>`;
      const you=p.move||p.you;
      const sideLabel=p.move&&Math.abs(p.you[0]-you[0])<20&&p.you[1]-you[1]>10;
      const label=sideLabel?[you[0]-22,you[1]+3]:[Math.min(132,Math.max(28,you[0])),Math.min(184,you[1]+16)];
      body+=dot(p.them,'tk-opponent')+dot(you,'tk-you');
      body+=`<text x="${Math.min(132,Math.max(28,p.them[0]))}" y="${p.them[1]<20?p.them[1]+17:p.them[1]-11}" class="tk-person-label">THEM</text><text x="${label[0]}" y="${label[1]}" class="tk-person-label">YOU</text>`;
      if(p.lefty)body+='<text x="52" y="9" class="tk-side-label">BH</text><text x="108" y="9" class="tk-side-label">FH</text>';
    }else if(p.kind==='height'){
      body='<path class="tk-ground" d="M12 153H148"/><path class="tk-net" d="M95 92V153 M91 92H100"/><path class="tk-net-mesh" d="M97 96V153"/>';
      const y=p.slice?117:p.low?125:p.high?42:77;
      const path=p.slice?'M26 117 Q72 38 141 124':p.low?'M26 125 Q70 40 142 122':p.high?'M26 98 Q70 0 142 93':p.kick?'M26 76 Q81 15 124 150 Q132 127 143 95':'M26 77 Q81 60 141 116';
      body+=`<path class="tk-reference" d="M12 92H87"/><path class="tk-ball-path" d="${path}" marker-end="url(#${id}-ball)"/>`+dot([26,p.kick?76:p.high?98:y],'tk-ball',6);
      body+='<text x="96" y="176" class="tk-person-label">NET</text>';
    }else if(p.kind==='position'){
      body='<path class="tk-court" d="M26 96H134 M26 30V166 M134 30V166"/><text x="113" y="88" class="tk-person-label">BASELINE</text>';
      const to=p.position==='in'?[80,52]:[80,152];
      body+=dot(to,'tk-you',7)+arrow([80,110],to,'tk-move')+'<circle cx="80" cy="110" r="8" class="tk-future"/>';
      body+=dot([107,p.position==='in'?37:53],'tk-ball',5);
    }else if(p.kind==='contact'){
      // A top-down spacing cue: the short bar marks the player's shoulder line.
      body='<ellipse class="tk-body" cx="58" cy="114" rx="19" ry="13"/><circle class="tk-you" cx="58" cy="111" r="6"/><path class="tk-court" d="M40 114H76"/>';
      const ball=p.late?[89,124]:p.front?[104,72]:p.space?[118,87]:[83,104];
      body+=`<path class="tk-racket" d="M73 108L${ball[0]-9} ${ball[1]+6}"/><ellipse class="tk-racket" cx="${ball[0]-4}" cy="${ball[1]+2}" rx="6" ry="10" transform="rotate(35 ${ball[0]-4} ${ball[1]+2})"/>`+dot(ball,'tk-ball',5);
      body+=`<path class="tk-space" d="M62 145H${ball[0]} M62 141V149 M${ball[0]} 141V149"/><text x="80" y="30" class="tk-person-label">TOWARDS THE NET ↑</text>`;
      if(p.front)body+=arrow([89,124],[100,78],'tk-move');
    }else if(p.kind==='timing'){
      body='<path class="tk-ground" d="M19 151H141"/>';
      if(p.phase===0){body+='<path class="tk-foot" d="M51 119Q43 122 43 135H62V122ZM99 119Q107 122 107 135H88V122Z"/><path class="tk-move" d="M80 124V100"/>';body+=dot([80,49],'tk-ball',6)+'<path class="tk-reference" d="M65 49H43 M95 49H117"/>';}
      else{body+='<path class="tk-foot" d="M51 135Q43 138 43 150H62V138ZM99 135Q107 138 107 150H88V138Z"/>';body+=arrow([82,112],[119,81],'tk-move')+dot([118,48],'tk-ball',6);}
    }else if(p.kind==='arrival'){
      body='<path class="tk-ground" d="M16 154H145"/>';
      if(p.ready){body+='<path class="tk-foot" d="M48 134L42 153H64L66 138ZM96 134L94 153H116L112 138Z"/>';body+=dot([121,87],'tk-ball',6)+'<path class="tk-space" d="M65 98H108 M65 94V102 M108 94V102"/>';}
      else{body+='<path class="tk-foot" d="M36 138L29 153H53L55 141ZM102 126L100 146L121 139L116 126Z"/>';body+=arrow([53,110],[103,100],'tk-move')+dot([136,91],'tk-ball',6);}
    }else if(p.kind==='sequence'){
      if(p.symbol==='eye')body='<path class="tk-eye" d="M22 96Q80 35 138 96Q80 155 22 96Z"/><circle class="tk-eye" cx="80" cy="96" r="20"/><circle class="tk-ball" cx="80" cy="96" r="7"/>';
      else body='<path class="tk-foot" d="M48 92Q37 94 38 130L58 136L65 99ZM101 59Q89 61 91 97L111 103L118 66Z"/><path class="tk-move" d="M33 69L67 35"/>';
    }
    return `<svg class="tk-drawing" viewBox="${p.kind==='height'&&!p.high?'0 36 160 150':'0 0 160 186'}" aria-hidden="true" focusable="false"><defs><marker id="${id}-ball" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L8 4L0 8Z" fill="#ddc36d"/></marker><marker id="${id}-move" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L8 4L0 8Z" fill="#98c9aa"/></marker></defs>${body}</svg>`;
  }
  function render(slug,{home=false}={}){
    const c=cards[slug];if(!c)return '';
    const prefix=`tk-${home?'home':'lesson'}-${slug}`;
    return `<figure class="lesson-takeaway${home?' takeaway-home':''}" data-takeaway="${esc(slug)}" data-takeaway-motion="authored" aria-label="Visual takeaway: ${esc(c.title)}">${home?`<div class="takeaway-eyebrow">Take this onto court</div><h1 class="takeaway-title">${esc(c.title)}</h1>`:''}<div class="takeaway-pair">${c.panels.map((p,i)=>`<div class="takeaway-panel" data-panel-motion="${p.motion}"><p class="takeaway-condition">${esc(p.label)}</p>${drawing(p,prefix+'-'+i)}<p class="takeaway-action">${esc(p.caption)}</p></div>`).join('')}</div><figcaption class="takeaway-rule${home?' daily-cue':''}">${esc(c.rule)}</figcaption></figure>`;
  }
  // Motion is a progressive enhancement. The rendered SVG is always the complete
  // readable takeaway, including the recovery destination, without this controller.
  const seen=new Set(),reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  let dispose=()=>{};
  function mount(root){
    dispose();
    const figures=[...root.querySelectorAll('[data-takeaway-motion]')];
    if(!figures.length)return;
    let frame=0,observer,active=null;
    const pending=new Set();
    const key=f=>(f.classList.contains('takeaway-home')?'home:':'lesson:')+f.dataset.takeaway;
    function settle(f){
      if(active?.figure===f){cancelAnimationFrame(frame);active.parts.forEach(p=>p.restore());active=null;}
      f.dataset.motionState='settled';pending.delete(f);
      observer?.unobserve(f.querySelector('.takeaway-pair'));
    }
    function stop(){for(const f of pending)settle(f);observer?.disconnect();}
    function visible(){
      if(document.hidden){if(active)settle(active.figure);}
      else for(const f of pending){const pair=f.querySelector('.takeaway-pair');observer?.unobserve(pair);observer?.observe(pair);}
    }
    function preference(){if(reduce.matches){for(const f of pending)seen.add(key(f));stop();}}
    function start(f){
      if(document.hidden)return;
      if(document.fonts?.status==='loading'){
        document.fonts.ready.then(()=>{if(f.isConnected&&pending.has(f)){const pair=f.querySelector('.takeaway-pair');observer?.unobserve(pair);observer?.observe(pair);}});return;
      }
      if(reduce.matches||seen.has(key(f))){settle(f);return;}
      if(active)settle(active.figure);
      seen.add(key(f));f.dataset.motionState='playing';
      const panels=cards[f.dataset.takeaway].panels;
      const parts=[...f.querySelectorAll('.tk-drawing')].map((svg,i)=>{
        const p=panels[i],paints=[],restores=[];
        const clamp=t=>Math.max(0,Math.min(1,t));
        function translate(actor,dx,dy,progress=t=>t){
          const original=actor.getAttribute('transform');
          actor.dataset.tkAnimated='';
          paints.push(t=>{const q=clamp(progress(t)),ease=q*q*(3-2*q);actor.setAttribute('transform',`translate(${dx*(1-ease)} ${dy*(1-ease)})`);});
          restores.push(()=>{if(original===null)actor.removeAttribute('transform');else actor.setAttribute('transform',original);delete actor.dataset.tkAnimated;});
        }
        function trace(path,{travel=false,progress=t=>t}={}){
          const ink=path.cloneNode(false),length=path.getTotalLength(),oldOpacity=path.style.opacity;
          ink.dataset.tkTransient='';ink.classList.add('tk-motion-trace');ink.removeAttribute('marker-end');
          ink.style.strokeDasharray=String(length);ink.style.strokeDashoffset=String(length);
          svg.append(ink);
          const origin=travel?svg.querySelector('.tk-ball'):null,oldOrigin=origin?.style.opacity;
          let ball;
          if(origin){ball=origin.cloneNode(false);ball.dataset.tkTransient='';ball.classList.add('tk-travel-ball');ball.setAttribute('r','4.5');svg.append(ball);}
          paints.push(t=>{
            const q=clamp(progress(t)),moving=q>0&&q<1;
            path.style.opacity=moving?'.25':oldOpacity;
            ink.style.strokeDashoffset=String(length*(1-q));ink.style.opacity=moving?'1':'0';
            if(ball){const pt=path.getPointAtLength(length*q);ball.setAttribute('cx',pt.x);ball.setAttribute('cy',pt.y);ball.style.opacity=moving?'1':'0';origin.style.opacity=moving?'.45':oldOrigin;}
          });
          restores.push(()=>{ink.remove();ball?.remove();path.style.opacity=oldOpacity;if(origin)origin.style.opacity=oldOrigin;});
        }
        if(['height','shot','shot-follow'].includes(p.motion)){
          trace(svg.querySelector('.tk-ball-path'),{travel:true,progress:p.motion==='shot-follow'?t=>t/.65:t=>t});
        }
        if(p.motion==='move'||p.motion==='shot-follow'){
          const from=p.kind==='position'?[80,110]:p.you,to=p.kind==='position'?[80,p.position==='in'?52:152]:p.move;
          translate(svg.querySelector('.tk-you'),from[0]-to[0],from[1]-to[1],p.motion==='shot-follow'?t=>(t-.65)/.35:t=>t);
        }else if(p.motion==='space'){
          trace(svg.querySelector('.tk-space'));
        }else if(p.motion==='contact'){
          // Highlight the contact location without inventing a swing or moving the racket.
          const ball=svg.querySelector('.tk-ball'),ring=document.createElementNS('http://www.w3.org/2000/svg','circle'),length=2*Math.PI*10;
          for(const a of ['cx','cy'])ring.setAttribute(a,ball.getAttribute(a));
          ring.setAttribute('r','10');ring.setAttribute('class','tk-contact-highlight');ring.dataset.tkTransient='';
          ring.style.strokeDasharray=String(length);svg.append(ring);
          paints.push(t=>{ring.style.strokeDashoffset=String(length*(1-t));ring.style.opacity=t>0&&t<1?'1':'0';});
          restores.push(()=>ring.remove());
        }else if(p.motion==='split-rise'||p.motion==='split-land'){
          translate(svg.querySelector('.tk-foot'),0,p.motion==='split-rise'?12:-12,p.motion==='split-land'?t=>t/.6:t=>t);
          if(p.motion==='split-land')trace(svg.querySelector('.tk-move'),{progress:t=>(t-.6)/.4});
        }else if(p.motion==='chase'||p.motion==='steps'){
          trace(svg.querySelector('.tk-move'));
        }else if(p.motion==='look'){
          trace(svg.querySelector('path.tk-eye'));
        }
        return {paint(t){paints.forEach(fn=>fn(t));},restore(){restores.forEach(fn=>fn());}};
      });
      parts.forEach(p=>p.paint(0));active={figure:f,parts};
      const began=performance.now();
      function tick(now){
        if(!f.isConnected||document.hidden||reduce.matches){settle(f);return;}
        const elapsed=now-began;
        parts.forEach((p,i)=>p.paint(Math.max(0,Math.min(1,(elapsed-180-i*1200)/900))));
        if(elapsed>=2600){settle(f);return;}
        frame=requestAnimationFrame(tick);
      }
      frame=requestAnimationFrame(tick);
    }
    if(!reduce.matches&&typeof window.IntersectionObserver==='function'){
      observer=new IntersectionObserver(entries=>{
        for(const e of entries){const f=e.target.closest('.lesson-takeaway');
          if(e.isIntersecting&&e.intersectionRatio>=.85&&f.dataset.motionState==='waiting')start(f);
          else if(!e.isIntersecting&&f.dataset.motionState==='playing')settle(f);
        }
      },{threshold:[0,.85],rootMargin:'0px 0px -80px 0px'});
    }
    for(const f of figures){
      if(!observer||seen.has(key(f))){f.dataset.motionState='settled';continue;}
      f.dataset.motionState='waiting';pending.add(f);observer.observe(f.querySelector('.takeaway-pair'));
    }
    document.addEventListener('visibilitychange',visible);
    window.addEventListener('pagehide',stop);
    reduce.addEventListener('change',preference);
    dispose=()=>{stop();document.removeEventListener('visibilitychange',visible);window.removeEventListener('pagehide',stop);reduce.removeEventListener('change',preference);};
  }
  return {render,mount};
})();
