/* Authored recall aids. These are schematic cues, not measured ball trajectories. */
window.GSTakeaways=(()=>{
  const cards=__TAKEAWAYS__;
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
      if(p.move)body+=arrow(p.you,p.move,'tk-move')+`<circle cx="${p.move[0]}" cy="${p.move[1]}" r="6" class="tk-future"/>`;
      body+=dot(p.them,'tk-opponent')+dot(p.you,'tk-you');
      body+=`<text x="${Math.min(132,Math.max(28,p.them[0]))}" y="${p.them[1]<20?p.them[1]+17:p.them[1]-11}" class="tk-person-label">THEM</text><text x="${Math.min(132,Math.max(28,p.you[0]))}" y="${Math.min(184,p.you[1]+16)}" class="tk-person-label">YOU</text>`;
      if(p.lefty)body+='<text x="52" y="9" class="tk-side-label">BH</text><text x="108" y="9" class="tk-side-label">FH</text>';
    }else if(p.kind==='height'){
      body='<path class="tk-ground" d="M12 153H148"/><path class="tk-net" d="M95 92V153 M91 92H100"/><path class="tk-net-mesh" d="M97 96V153"/>';
      const y=p.slice?117:p.low?125:p.high?42:77;
      const path=p.slice?'M26 117 Q72 38 141 124':p.low?'M26 125 Q70 40 142 122':p.high?'M26 98 Q70 0 142 93':p.kick?'M26 76 Q81 15 124 150 Q132 127 143 95':'M26 77 Q81 68 141 116';
      body+=`<path class="tk-reference" d="M12 92H87"/><path class="tk-ball-path" d="${path}" marker-end="url(#${id}-ball)"/>`+dot([26,p.kick?76:p.high?98:y],'tk-ball',6);
      body+='<text x="96" y="176" class="tk-person-label">NET</text>';
    }else if(p.kind==='position'){
      body='<path class="tk-court" d="M26 96H134 M26 30V166 M134 30V166"/><text x="80" y="88" class="tk-person-label">BASELINE</text>';
      const to=p.position==='in'?[80,52]:[80,152];
      body+=dot([80,110],'tk-you',7)+arrow([80,110],to,'tk-move')+`<circle cx="${to[0]}" cy="${to[1]}" r="8" class="tk-future"/>`;
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
    return `<figure class="lesson-takeaway${home?' takeaway-home':''}" data-takeaway="${esc(slug)}" aria-label="Visual takeaway: ${esc(c.title)}">${home?`<div class="takeaway-eyebrow">Take this onto court</div><h1 class="takeaway-title">${esc(c.title)}</h1>`:''}<div class="takeaway-pair">${c.panels.map((p,i)=>`<div class="takeaway-panel"><p class="takeaway-condition">${esc(p.label)}</p>${drawing(p,prefix+'-'+i)}<p class="takeaway-action">${esc(p.caption)}</p></div>`).join('')}</div><figcaption class="takeaway-rule${home?' daily-cue':''}">${esc(c.rule)}</figcaption></figure>`;
  }
  return {render};
})();
