/* Authored recall aids. These are schematic cues, not measured ball trajectories. */
window.GSTakeaways=(()=>{
  const cards=__TAKEAWAYS__;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dot=(p,cls,r=5)=>`<circle cx="${p[0]}" cy="${p[1]}" r="${r}" class="${cls}"/>`;
  function drawing(p,id){
    if(p.art)return p.art.replaceAll('__INSTANCE__',id);
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
    return `<figure class="lesson-takeaway${home?' takeaway-home':''}" data-takeaway="${esc(slug)}" data-takeaway-motion="authored" aria-label="Visual takeaway: ${esc(c.title)}">${home?`<div class="takeaway-eyebrow">Take this onto court</div><h1 class="takeaway-title">${esc(c.title)}</h1>`:''}<div class="takeaway-pair">${c.panels.map((p,i)=>`<div class="takeaway-panel" data-panel-motion="${p.art ? 'emphasis' : p.motion}"><p class="takeaway-condition">${esc(p.label)}</p>${drawing(p,prefix+'-'+i)}<p class="takeaway-action">${esc(p.caption)}</p></div>`).join('')}</div><figcaption class="takeaway-rule${home?' daily-cue':''}">${esc(c.rule)}</figcaption></figure>`;
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
        if(p.art){
          const cue=svg.querySelector('[data-recall-cue]');
          cue.dataset.tkAnimated='';
          return {
            paint(t){cue.style.opacity=String(1-.5*Math.sin(Math.PI*t));},
            restore(){cue.style.removeProperty('opacity');cue.removeAttribute('style');delete cue.dataset.tkAnimated;}
          };
        }
        if(['height','shot','shot-follow'].includes(p.motion)){
          trace(svg.querySelector('.tk-ball-path'),{travel:true});
        }
        if(p.motion==='move'||p.motion==='shot-follow'){
          const from=p.kind==='position'?[80,110]:p.you,to=p.kind==='position'?[80,p.position==='in'?52:152]:p.move;
          translate(svg.querySelector('.tk-you'),from[0]-to[0],from[1]-to[1],p.motion==='shot-follow'?t=>(t-.18)/.72:t=>t);
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
