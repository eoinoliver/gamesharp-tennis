(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.GSLivePointIntegrity=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const point=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite);
  const same=(a,b)=>point(a)&&point(b)&&Math.hypot(a[0]-b[0],a[1]-b[1])<.01;
  const types=new Set(['ground','serve','slice','volley','smash']);
  function validate(s){
    const errors=[],check=(ok,msg)=>{if(!ok)errors.push(msg);};
    if(!s?.d1?.court)return ['Missing explicit opening'];
    for(const side of ['you','opp'])check(point(s.d1.court[side+'Start']),'Opening needs '+side+' position');
    for(const key of ['A','B']){
      const b=s[key];if(!b?.seq?.shots?.length){errors.push(key+' missing sequence');continue;}
      for(const side of ['you','opp'])check(same(s.d1.court[side+'Start'],b.seq[side+'Start']),key+' opening/sequence '+side+' discontinuity');
      const incoming=b.seq.shots.at(-1).to;
      check(same(b.seq.youEnd,incoming),key+' player must reach the incoming contact');
      check(point(b.seq.oppEnd),key+' decision needs opponent position');
      for(const phase of ['seq','win','mid']){
        const play=b[phase];if(!play?.shots?.length){errors.push(key+'/'+phase+' missing shots');continue;}
        if(phase!=='seq'){
          check(same(play.shots[0].from,incoming),key+'/'+phase+' finish contact differs from incoming ball');
          check(same(play.youStart,b.seq.youEnd)&&same(play.oppStart,b.seq.oppEnd),key+'/'+phase+' actor handoff differs');
        }
        play.shots.forEach((shot,i)=>{
          check(types.has(shot.contactType),key+'/'+phase+'/'+i+' needs explicit contactType');
          check(point(shot.from)&&point(shot.to),key+'/'+phase+'/'+i+' needs contact coordinates');
          if(i)check(same(shot.from,play.shots[i-1].to),key+'/'+phase+'/'+i+' detached contact');
          if(shot.contactType==='serve'){
            check([1,2].includes(shot.serveNumber),'Serve needs first/second identity');
            check(point(shot.bounce),'Serve needs explicit bounce');
            if(point(shot.from)&&point(shot.bounce)){
              const near=shot.from[1]>150,b=shot.bounce;
              check(near?shot.from[1]>=290:shot.from[1]<=10,'Serve origin must be behind baseline');
              check(b[0]>33&&b[0]<167&&(near?b[1]>=80&&b[1]<150:b[1]>150&&b[1]<=220),'Serve bounce outside service court');
              check((shot.from[0]-100)*(b[0]-100)<0,'Serve bounce must be diagonal');
            }
          }
        });
      }
      check(b.d2?.opts?.length===2&&b.d2.opts.filter(o=>o.win).length===1,key+' needs two options and one keyed read');
      check(b.d2?.opts?.every(o=>typeof o.id==='string')&&new Set(b.d2.opts.map(o=>o.id)).size===2,key+' needs stable choice IDs');
    }
    return errors;
  }
  function assemble(s,key,phase){
    const errors=validate(s);if(errors.length)throw new Error('Invalid Live Point: '+errors.join('; '));
    const seq=s[key].seq,finish=s[key][phase];
    // Concatenate the authored events verbatim. Never silently relocate a shot.
    return {shots:[...seq.shots,...finish.shots],youStart:seq.youStart,oppStart:seq.oppStart,
      youEnd:finish.youEnd,oppEnd:finish.oppEnd,
      handoff:{shotIndex:seq.shots.length,oppStart:finish.oppStart},isWin:phase==='win'};
  }
  function choiceOrder(options,identity,seed){
    let hash=2166136261;for(const c of String(seed)+'|'+identity)hash=Math.imul(hash^c.charCodeAt(0),16777619);
    return hash&1?[1,0]:[0,1];
  }
  return Object.freeze({validate,assemble,choiceOrder,same});
});
