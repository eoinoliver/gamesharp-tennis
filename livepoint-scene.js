(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.GSLivePointScene=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const project=p=>{const t=(p[1]-10)/280;return [150+(p[0]-100)/80*(54+t*84),18+t*164];};
  const curve=(a,b,bend=0)=>`M ${a[0]} ${a[1]} Q ${(a[0]+b[0])/2+bend} ${(a[1]+b[1])/2-4} ${b[0]} ${b[1]}`;
  function track(play,timeline,side){
    const near=side==='you', fallback=near?[100,270]:[100,30];
    const start=play[side+'Start']||(play[side+'Waypoints']||[])[0]||fallback;
    const points=[{at:0,p:start}];
    const first=timeline.shots[0];
    if(first&&timeline.shots.length===1&&['behind','into_run'].includes(first.shot.intent)&&(first.shot.from[1]>150)!==near&&play[side+'End']){
      points.push({at:first.contactAt,p:play[side+'End']});
    }
    timeline.shots.forEach((item,i)=>{
      const s=item.shot;
      if((s.from[1]>150)!==near)return;
      const last=points[points.length-1];
      const previous=timeline.shots[i-1];
      const begin=Math.max(last.at,previous?previous.contactAt:0);
      if(begin>last.at)points.push({at:begin,p:last.p});
      points.push({at:item.contactAt,p:s.from});
    });
    // Preserve the same recovery evidence when the two decisions are joined.
    if(play.handoff&&side==='opp'){
      const next=timeline.shots[play.handoff.shotIndex],previous=timeline.shots[play.handoff.shotIndex-1];
      if(next&&previous&&play.handoff.oppStart){
        points.push({at:previous.arrivalAt,p:play.handoff.oppStart});
        if(['behind','into_run'].includes(next.shot.intent)&&play.oppEnd)points.push({at:next.contactAt,p:play.oppEnd});
      }
      points.sort((a,b)=>a.at-b.at);
    }
    // The receiver must also reach the final incoming ball before decision two.
    const final=timeline.shots[timeline.shots.length-1];
    if(final&&!final.shot.miss&&!final.shot.payoff&&(final.shot.to[1]>150)===near){
      const last=points[points.length-1],begin=Math.max(last.at,final.contactAt);
      if(begin>last.at)points.push({at:begin,p:last.p});
      points.push({at:final.arrivalAt,p:final.shot.to});
    }else if(play[side+'End']){
      points.push({at:timeline.total,p:play[side+'End']});
    }
    const clean=[];points.forEach(x=>{if(clean.length&&x.at<=clean[clean.length-1].at)clean[clean.length-1]=x;else clean.push(x);});
    if(clean[clean.length-1].at<timeline.total)clean.push({at:timeline.total,p:clean[clean.length-1].p});
    return clean;
  }
  function render(play,timeline,reduced){
    const p=project,finalShot=timeline.shots[timeline.shots.length-1];
    const line=(a,b,extra='')=>`<path d="M ${p(a).join(' ')} L ${p(b).join(' ')}" ${extra}/>`;
    let out='<svg viewBox="0 0 300 200" class="ms-svg" role="img" aria-label="Tennis scene: ball flight, bounce and player contacts share one timeline" xmlns="http://www.w3.org/2000/svg">';
    out+='<path d="M96 18 L204 18 L288 182 L12 182 Z" fill="#174b24" stroke="#aec9af" stroke-width="1.2"/>';
    out+='<g fill="none" stroke="#aec9af" stroke-opacity=".65" stroke-width="1">';
    out+=line([33,10],[33,290])+line([167,10],[167,290])+line([33,80],[167,80])+line([33,220],[167,220])+line([100,80],[100,220]);
    out+=line([20,150],[180,150],'stroke-width="2.5"')+'</g>';
    timeline.shots.forEach((item,i)=>{
      const s=item.shot,a=p(s.from);let target=s.to,landing=item.landing;
      if(s.miss==='long'){target=[s.to[0],s.from[1]>150?0:300];landing=target;}
      if(s.miss==='wide'){target=[s.to[0]<100?20:180,s.to[1]];landing=target;}
      if(s.miss==='net'){const f=(150-s.from[1])/(s.to[1]-s.from[1]);target=[s.from[0]+(s.to[0]-s.from[0])*f,150];landing=null;}
      const b=p(target),bounce=landing&&p(landing),col=s.miss?'#e8734a':s.color||'#c8a84b';
      // An out shot ends at its landing. A legal rally/serve continues from the
      // authored bounce to receiver contact; both segments use the audio clock.
      const continuation=bounce&&!s.miss;
      const segments=continuation?[
        {d:curve(a,bounce,s.bend||0),at:item.contactAt,duration:item.bounceAt-item.contactAt},
        {d:curve(bounce,b,0),at:item.bounceAt,duration:item.arrivalAt-item.bounceAt}
      ]:[{d:curve(a,b,s.bend||0),at:item.contactAt,duration:(s.miss&&item.bounceAt?item.bounceAt:item.arrivalAt)-item.contactAt}];
      segments.forEach(segment=>{
        out+=`<path data-lp-flight="${i}" d="${segment.d}" fill="none" stroke="${col}" stroke-width="2" opacity="${reduced?.65:0}">${reduced?'':`<animate attributeName="opacity" values="0;.8;.45" keyTimes="0;.05;1" begin="${segment.at}s" dur="${segment.duration}s" fill="freeze"/>`}</path>`;
        if(!reduced)out+=`<circle r="3" fill="#e8f25a" stroke="#fff" stroke-width=".6" opacity="0"><animate attributeName="opacity" values="1;1;0" keyTimes="0;.98;1" begin="${segment.at}s" dur="${segment.duration}s" fill="freeze"/><animateMotion path="${segment.d}" begin="${segment.at}s" dur="${segment.duration}s" fill="freeze" calcMode="linear"/></circle>`;
      });
      if(bounce)out+=`<circle data-lp-bounce="${i}" cx="${bounce[0]}" cy="${bounce[1]}" r="3.5" fill="none" stroke="${col}" opacity="${reduced?.65:0}">${reduced?'':`<set attributeName="opacity" to=".7" begin="${item.bounceAt}s"/>`}</circle>`;
      const label=s.miss?'OUTCOME: '+s.miss.toUpperCase():s.label||item.contactType;
      const at=s.miss&&item.bounceAt?item.bounceAt:item.arrivalAt;
      out+=`<text x="150" y="194" text-anchor="middle" fill="${col}" font-size="6.5" font-weight="700" opacity="${reduced?(item===finalShot?1:0):0}">${esc(label)}${reduced?'':`<set attributeName="opacity" to="1" begin="${at}s"/>${i<timeline.shots.length-1?`<set attributeName="opacity" to="0" begin="${timeline.shots[i+1].arrivalAt}s"/>`:''}`}</text>`;
    });
    ['you','opp'].forEach(side=>{
      const points=track(play,timeline,side),pos=p(points[reduced?points.length-1:0].p),col=side==='you'?'#c8a84b':'#e07070';
      out+=`<g data-lp-player="${side}" transform="translate(${pos.join(' ')})">${reduced||points.length<2?'':`<animateTransform attributeName="transform" type="translate" values="${points.map(x=>p(x.p).join(' ')).join(';')}" keyTimes="${points.map(x=>(x.at/timeline.total).toFixed(5)).join(';')}" dur="${timeline.total}s" fill="freeze" calcMode="linear"/>`}<circle r="5" fill="${col}" stroke="#fff" stroke-width="1"/><text y="-8" text-anchor="middle" fill="#fff" font-size="5.5">${side==='you'?'YOU':'OPP'}</text></g>`;
    });
    if(play.sitter){const s=p(play.sitter);out+=`<circle cx="${s[0]}" cy="${s[1]}" r="3" fill="#e8f25a"/>`;}
    return out+'</svg>';
  }
  return Object.freeze({render,track,project});
});
