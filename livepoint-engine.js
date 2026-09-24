(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root) root.GSLivePointEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const AUDIO_LIBRARY=Object.freeze({
    ground:['livepoint-audio/ground-1.mp3','livepoint-audio/ground-2.mp3','livepoint-audio/ground-3.mp3'],
    serve:['livepoint-audio/serve-1.mp3','livepoint-audio/serve-2.mp3'],
    slice:['livepoint-audio/slice-1.mp3','livepoint-audio/slice-2.mp3'],
    volley:['livepoint-audio/volley-1.mp3'],
    smash:['livepoint-audio/smash-1.mp3'],
    bounce:['livepoint-audio/bounce-1.mp3','livepoint-audio/bounce-2.mp3'],
    line:['livepoint-audio/bounce-2.mp3'],
    out:['livepoint-audio/bounce-1.mp3'],
    shoe:['livepoint-audio/shoe-1.mp3']
  });
  const AUDIO_TYPES=Object.freeze(Object.keys(AUDIO_LIBRARY));
  const CONTACT_TYPES=Object.freeze(['ground','serve','slice','volley','smash']);

  function words(shot){ return String((shot&&shot.label)||'')+' '+String((shot&&shot.snd)||''); }
  function classifyShot(shot){
    if(shot&&CONTACT_TYPES.includes(shot.contactType)) return shot.contactType;
    if(shot&&CONTACT_TYPES.includes(shot.snd)) return shot.snd;
    const w=words(shot);
    if(/smash|overhead|bomb/i.test(w)) return 'smash';
    if(/\bserve(?:s|d|r|rs|ing)?\b|\bkick(?:ed|ing)?\b/i.test(w)) return 'serve';
    if(/slice|chip|block|drop|dink/i.test(w)) return 'slice';
    if(/volley|half.?volley|poach/i.test(w)) return 'volley';
    return 'ground';
  }
  function flightDuration(shot,type){
    if(shot&&Object.prototype.hasOwnProperty.call(shot,'flightSeconds'))return shot.flightSeconds;
    const w=words(shot);
    if(type==='serve'&&Array.isArray(shot&&shot.bounce)) return .64;
    if(/lob|moonball/i.test(w)) return .92;
    if(/drop|dink/i.test(w)) return .74;
    if(type==='serve'||type==='smash') return .50;
    if(type==='volley') return .42;
    if(type==='slice') return .70;
    if(/heavy|drive|line|winner/i.test(w)) return .56;
    return .62;
  }
  function terminalType(shot,nextShot){
    if(shot&&shot.miss==='net') return 'net';
    if(shot&&shot.miss==='long') return 'out';
    if(shot&&shot.miss==='wide') return 'out';
    if(shot&&shot.lineHit===true) return 'line';
    if(shot&&shot.forceBounce===true) return 'bounce';
    if(shot&&shot.noBounce===true) return 'air';
    if(nextShot&&['volley','smash'].includes(classifyShot(nextShot))) return 'air';
    return 'bounce';
  }
  // For a rally ball, `to` is the receiver's contact point, not the landing.
  // Derive a landing inside the receiver's half so the visual flight, bounce
  // sound and next contact happen in the same believable order. Serves and
  // specially authored shots may still provide an exact `bounce` coordinate.
  function derivedBounce(shot){
    if(Array.isArray(shot&&shot.bounce)) return shot.bounce;
    const from=shot&&shot.from,to=shot&&shot.to;
    if(!Array.isArray(from)||!Array.isArray(to)) return null;
    const towardFar=to[1]<150;
    const y=towardFar?Math.min(142,Math.max(18,to[1]+18)):Math.max(158,Math.min(282,to[1]-18));
    const x=Math.max(22,Math.min(178,from[0]+(to[0]-from[0])*.82));
    return [Number(x.toFixed(2)),Number(y.toFixed(2))];
  }
  function movementDistance(play){
    const pairs=[['youStart','youEnd'],['oppStart','oppEnd']];
    const direct=pairs.reduce((sum,p)=>{
      const a=play&&play[p[0]],b=play&&play[p[1]];
      return sum+(a&&b?Math.hypot(b[0]-a[0],b[1]-a[1]):0);
    },0);
    const waypointDistance=['youWaypoints','oppWaypoints'].reduce((sum,key)=>{
      const points=(play&&play[key])||[];
      return sum+points.slice(1).reduce((n,p,i)=>n+Math.hypot(p[0]-points[i][0],p[1]-points[i][1]),0);
    },0);
    return direct+waypointDistance;
  }
  function contactVolume(shot,type){
    const w=words(shot);
    if(type==='serve'||type==='smash') return .88;
    if(/weak|safe|block|stretch|scramble/i.test(w)) return .52;
    if(type==='slice') return .64;
    if(type==='volley') return .72;
    return .78;
  }
  function compileTimeline(play,options){
    const opts=options||{}, shots=(play&&play.shots)||[];
    const start=Number.isFinite(opts.start)?opts.start:(opts.mode==='full'?.40:.30);
    const compiled=[]; let contactAt=start;
    shots.forEach((shot,index)=>{
      const contactType=classifyShot(shot), flight=flightDuration(shot,contactType);
      const arrivalAt=contactAt+flight, terminal=terminalType(shot,shots[index+1]);
      const landing=['bounce','line','out'].includes(terminal)?derivedBounce(shot):null;
      const bounceAt=landing?contactAt+(flight*.68):null;
      compiled.push(Object.freeze({index,shot,contactType,contactAt,flightDuration:flight,arrivalAt,bounceAt,landing,terminal}));
      contactAt=arrivalAt+(contactType==='volley'?.14:.17);
    });
    const events=[];
    compiled.forEach((s)=>{
      const from=s.shot.from||[100,150],to=s.shot.to||[100,150];
      events.push(Object.freeze({kind:'contact',audio:s.contactType,at:s.contactAt,shotIndex:s.index,variant:s.index,volume:contactVolume(s.shot,s.contactType),pan:Math.max(-.55,Math.min(.55,(from[0]-100)/150))}));
      if(['bounce','line','out'].includes(s.terminal)){
        const landing=s.landing||to;
        events.push(Object.freeze({kind:'court',audio:s.terminal,at:s.bounceAt,shotIndex:s.index,variant:s.index,volume:s.terminal==='line'?.46:s.terminal==='out'?.25:.34,pan:Math.max(-.55,Math.min(.55,(landing[0]-100)/150))}));
      }
    });
    if(movementDistance(play)>28&&compiled.length){
      events.push(Object.freeze({kind:'movement',audio:'shoe',at:Math.max(.05,compiled[0].contactAt-.16),shotIndex:0,variant:0,volume:.24}));
    }
    events.sort((a,b)=>a.at-b.at||a.kind.localeCompare(b.kind));
    const total=compiled.length?compiled[compiled.length-1].arrivalAt+.34:start+.10;
    return Object.freeze({mode:opts.mode||'multi',start,shots:Object.freeze(compiled),events:Object.freeze(events),total});
  }
  function validateTimeline(timeline,play){
    const errors=[], source=(play&&play.shots)||[];
    const chk=(ok,msg)=>{if(!ok)errors.push(msg);};
    chk(timeline&&Array.isArray(timeline.shots)&&Array.isArray(timeline.events),'timeline structure missing');
    if(!timeline||!Array.isArray(timeline.shots)||!Array.isArray(timeline.events)) return errors;
    chk(timeline.shots.length===source.length,'timeline/shot count mismatch');
    let last=-Infinity;
    timeline.shots.forEach((s,i)=>{
      chk(s.index===i,'shot '+i+' index mismatch');
      chk(CONTACT_TYPES.includes(s.contactType),'shot '+i+' has invalid contact audio');
      chk(Number.isFinite(s.flightDuration)&&s.flightDuration>=.2&&s.flightDuration<=4,'shot '+i+' has invalid flight duration');
      chk(s.contactAt>=0&&s.arrivalAt>s.contactAt,'shot '+i+' has invalid timing');
      chk(s.contactAt>last,'shot '+i+' is not strictly later than prior contact');
      chk(Math.abs((s.arrivalAt-s.contactAt)-s.flightDuration)<1e-9,'shot '+i+' visual/audio duration drift');
      const from=s.shot&&s.shot.from,to=s.shot&&s.shot.to,bounce=s.landing;
      chk(Array.isArray(from)&&Array.isArray(to),'shot '+i+' has no court coordinates');
      if(Array.isArray(from)&&Array.isArray(to)){
        chk(from[0]>=12&&from[0]<=188&&from[1]>=8&&from[1]<=292&&to[0]>=12&&to[0]<=188&&to[1]>=8&&to[1]<=292,'shot '+i+' is outside the court model');
        if(bounce){
          chk(Array.isArray(bounce)&&bounce.length===2,'shot '+i+' has invalid bounce coordinates');
          if(Array.isArray(bounce))chk(bounce[0]>=12&&bounce[0]<=188&&bounce[1]>=8&&bounce[1]<=292,'shot '+i+' bounce is outside the court model');
        }
        chk(from[1]!==150&&to[1]!==150,'shot '+i+' contact/landing is placed on the net');
        chk((from[1]<150&&to[1]>150)||(from[1]>150&&to[1]<150),'shot '+i+' does not cross the net');
        if(i){ const prev=timeline.shots[i-1].shot.to; chk(Math.hypot(from[0]-prev[0],from[1]-prev[1])<26,'shot '+i+' teleports before contact'); }
        if(s.contactType==='serve'){
          const landing=bounce||to;
          const legal=(from[1]>220&&landing[1]>=80&&landing[1]<150)||(from[1]<80&&landing[1]>150&&landing[1]<=220);
          chk(legal,'shot '+i+' serve misses the correct service box');
          if(s.shot.serveNumber){
            chk([1,2].includes(s.shot.serveNumber),'shot '+i+' has invalid serve number');
            chk(Array.isArray(s.shot.bounce),'shot '+i+' serve needs an authored bounce');
            chk(from[1]>=290||from[1]<=10,'shot '+i+' server must start behind the baseline');
            chk((from[0]-100)*(landing[0]-100)<0,'shot '+i+' serve must cross into the diagonal service box');
          }
        }
        if(/drop|dink/i.test(words(s.shot))){
          const landing=bounce||to;
          const forecourt=from[1]>150?(landing[1]>=80&&landing[1]<150):(landing[1]>150&&landing[1]<=220);
          chk(forecourt,'shot '+i+' drop shot is not just over the net');
        }
        if(s.shot.lineHit===true){
          const onLine=[33,167].some(v=>Math.abs(to[0]-v)<=6)||[10,80,220,290].some(v=>Math.abs(to[1]-v)<=6);
          chk(onLine,'shot '+i+' claims a line hit away from a court line');
        }
      }
      last=s.contactAt;
      const contacts=timeline.events.filter(e=>e.kind==='contact'&&e.shotIndex===i);
      chk(contacts.length===1,'shot '+i+' must have exactly one contact sound');
      if(contacts[0]) chk(Math.abs(contacts[0].at-s.contactAt)<1e-9,'shot '+i+' contact is out of sync');
      const courts=timeline.events.filter(e=>e.kind==='court'&&e.shotIndex===i);
      const expectsCourt=['bounce','line','out'].includes(s.terminal);
      chk(courts.length===(expectsCourt?1:0),'shot '+i+' terminal event mismatch');
      if(courts[0]) chk(Math.abs(courts[0].at-s.bounceAt)<1e-9,'shot '+i+' bounce is out of sync');
    });
    timeline.events.forEach((e,i)=>{
      chk(AUDIO_TYPES.includes(e.audio),'event '+i+' references missing natural audio');
      if(i) chk(e.at>=timeline.events[i-1].at,'event order is not monotonic');
    });
    chk(Number.isFinite(timeline.total)&&timeline.total>=timeline.start,'invalid total duration');
    return errors;
  }

  function createAudioEngine(options){
    const opts=options||{}, base=opts.base||'', storageKey=opts.storageKey||'gs-livepoint-sound';
    const buffers=new Map(), sources=new Set(), timers=new Set(), fallbacks=new Map();
    let ctx=null, master=null, enabled=true, preloadPromise=null, unlocked=false;
    try{ const stored=localStorage.getItem(storageKey);enabled=stored!=='off'&&stored!=='0'; }catch(e){}
    function context(){
      if(ctx||typeof window==='undefined') return ctx;
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC) return null;
      ctx=new AC(); master=ctx.createGain(); master.gain.value=.82; master.connect(ctx.destination); return ctx;
    }
    function allPaths(){ return [...new Set(Object.values(AUDIO_LIBRARY).flat())]; }
    function preload(){
      if(preloadPromise) return preloadPromise;
      const c=context();
      if(!c||typeof fetch!=='function') return Promise.resolve(false);
      preloadPromise=Promise.all(allPaths().map(async path=>{
        try{ const res=await fetch(base+path); if(!res.ok) throw new Error(String(res.status)); buffers.set(path,await c.decodeAudioData(await res.arrayBuffer())); return true; }
        catch(e){
          if(typeof Audio!=='undefined'){ const a=new Audio(base+path); a.preload='auto'; fallbacks.set(path,a); }
          return false;
        }
      })).then(results=>results.some(Boolean));
      return preloadPromise;
    }
    async function resume(){
      if(!enabled) return false;
      const c=context();
      if(!c) return false;
      try{
        if(c.state==='suspended') await c.resume();
        // Prime Web Audio inside the user's gesture. iOS otherwise rejects a later
        // HTMLAudio fallback even when the visible animation has already started.
        if(!unlocked){
          const silent=c.createBuffer(1,1,c.sampleRate),src=c.createBufferSource();
          src.buffer=silent;src.connect(master);src.start();unlocked=true;
        }
        const loaded=await preload();
        return c.state==='running'&&!!loaded;
      }catch(e){ return false; }
    }
    function stop(){
      timers.forEach(clearTimeout); timers.clear();
      sources.forEach(s=>{try{s.stop();}catch(e){}}); sources.clear();
    }
    function play(event,when){
      if(!enabled) return;
      const list=AUDIO_LIBRARY[event.audio]; if(!list||!list.length) return;
      const path=list[Math.abs(event.variant||0)%list.length], c=context();
      const volume=event.volume==null?(event.kind==='court'?.34:event.kind==='movement'?.24:.78):event.volume;
      const pan=Math.max(-.55,Math.min(.55,Number(event.pan)||0));
      if(c&&buffers.has(path)){
        const src=c.createBufferSource(), gain=c.createGain(); src.buffer=buffers.get(path); gain.gain.value=volume;
        if(c.createStereoPanner){ const p=c.createStereoPanner(); p.pan.value=pan; src.connect(gain); gain.connect(p); p.connect(master); }
        else { src.connect(gain); gain.connect(master); }
        sources.add(src); src.onended=()=>sources.delete(src); src.start(when); return;
      }
      const delay=Math.max(0,((when||0)-(c?c.currentTime:0))*1000);
      const timer=setTimeout(()=>{
        timers.delete(timer); if(!enabled||typeof Audio==='undefined') return;
        const a=(fallbacks.get(path)||new Audio(base+path)).cloneNode(); a.volume=volume; a.play().catch(()=>{});
      },delay); timers.add(timer);
    }
    function schedule(timeline){
      stop(); if(!enabled||!timeline) return false;
      const c=context(), baseTime=c?c.currentTime:0;
      timeline.events.forEach(e=>play(e,c?baseTime+e.at:e.at));
      return true;
    }
    function setEnabled(next){ enabled=!!next; try{localStorage.setItem(storageKey,storageKey==='gs_sound_on'?(enabled?'1':'0'):(enabled?'on':'off'));}catch(e){} if(!enabled)stop(); else resume(); return enabled; }
    function toggle(){return setEnabled(!enabled);}
    function isEnabled(){return enabled;}
    function isReady(){const c=context();return !!(enabled&&c&&c.state==='running'&&buffers.size);}
    function preview(){
      if(!isReady()) return false;
      const c=context();play({audio:'ground',kind:'contact',variant:0,volume:.7,pan:0},c.currentTime+.015);return true;
    }
    return Object.freeze({preload,resume,stop,schedule,setEnabled,toggle,isEnabled,isReady,preview});
  }

  return Object.freeze({AUDIO_LIBRARY,AUDIO_TYPES,CONTACT_TYPES,classifyShot,flightDuration,terminalType,compileTimeline,validateTimeline,createAudioEngine});
});
