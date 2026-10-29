/* GameSharp: real recorded, optional contact and success cues. No background soundtrack.
   A saved preference is not proof that the browser has allowed playback. */
(function(){
  const KEY="gs_sound", AC=window.AudioContext||window.webkitAudioContext;
  let ctx=null, master=null, enabled=true, last={}, session=null, previousSession=null;
  const rewards=['applause-1','applause-2','applause-3'];
  const core=['contact-1','contact-2','bounce'];
  const voices=new Set(), buffers={}, pending={}, files=[...core,...rewards];
  const REWARD_KEY='gs_reward_last';
  const VOICE_KEY='gs_voice', courtVoices={
  "live-space-11": "You made room, then read the ball. Take that to court.",
  "live-space-10": "You made room. Let the ball choose the shot.",
  "live-space-01": "Good shot selection. Make room a little sooner.",
  "live-space-00": "Make room before you swing. Then read the ball.",
  "live-serve-11": "Recover, then read the return. Your serve is only the start.",
  "live-serve-10": "You were ready. Let the return shape your next shot.",
  "live-serve-01": "You read the return. Recover before you guess.",
  "live-serve-00": "Recover before you guess. Read the return before attacking.",
  "live-time-used": "You bought time and used it. Keep reading the next ball.",
  "live-time-watched": "You bought time. Start moving while it travels.",
  "live-early-recovery": "You recovered early. More height could buy more time.",
  "live-recover-sooner": "Your reply gave you less time. Start recovering sooner.",
  "live-point-buy-time": "Buy yourself time. Use it to recover.",
  "live-point-other-wing": "Buy yourself time. Use it to recover.",
  "serve-plus-one": "Plan the next ball. Read the return.",
  "short-ball": "Check the height. Choose the shot.",
  "the-line": "Get balanced. Then earn the line.",
  "the-winner": "Judge the choice. Not just the winner.",
  "recovery": "Read their options. Recover to cover them.",
  "open-court": "Watch their movement. Choose the space.",
  "forehand-bill": "Choose the shot. Cover the recovery.",
  "the-lead": "Keep your depth. Read the opponent.",
  "split-step": "Watch their hit. Time your landing.",
  "approach-volley": "Approach with depth. Follow your shot.",
  "middle-return": "Under pressure? Return deep through the middle.",
  "high-ball": "Read the depth. Find your contact.",
  "second-serve": "Read the receiver. Make contact awkward.",
  "contact-clue": "Check your spacing. Then choose the fix.",
  "running-around": "Earn the forehand. Cover its cost.",
  "net-rusher": "Read their position. Feet or over.",
  "pass-where-they-arent": "See what they cover. Pass the gap.",
  "late-is-the-culprit": "Turn early. Meet it in front.",
  "the-moonballer": "When you can, step in. Take their time.",
  "the-pusher": "Read their depth. Change the pattern.",
  "pulled-wide": "Late and wide? Buy time first.",
  "serve-away-from-the-lean": "Read the lean. Serve away from it.",
  "the-big-hitter": "Buy yourself time. Change their contact height.",
  "the-lefty": "Find their backhand. Adjust your patterns.",
  "find-your-return-spot": "Read the serve. Choose your starting spot.",
  "answer-the-drop": "Get there. Look up before choosing.",
  "attack-the-backhand": "Move them first. Then find the backhand.",
  "down-the-line": "Check their position. Choose the open side.",
  "rushed-out-wide": "Stretched out wide? Go deep through the middle.",
  "earned-attack": "See the opening. Check your arrival.",
  "earned-defence": "Need time? Add height and depth.",
  "earned-net": "Arrive first. Then decide whether to follow.",
  "predict-the-point": "Open the court. Read the next reply.",
  "predict-second-serve": "Find their backhand. Watch their recovery.",
  "saturday-point-1": "Serve to open it. Earn the finish.",
  "saturday-point-2": "Keep your depth. Build the next ball.",
  "saturday-point-3": "Step in when ready. Leave contact space.",
  "saturday-point-4": "Buy time when stretched. Bring them forward.",
  "saturday-point-5": "Change their contact height. Take their time.",
  "midweek-point-1": "Buy time when wide. Attack the opening.",
  "play-the-point": "Your shot shapes their reply. Read it."
};
  const voiceAliases={'live-point-make-room':'live-space-00','live-point-short-low':'live-space-00','live-point-serve-see':'live-serve-00','live-point-return-deep':'live-serve-00'};
  const voiceLoads={};let liveVoiceFamily=false;
  let voiceSlug=null, voiceEnabled=true, voiceError=false,
      voicePending=false, voiceGeneration=0, voiceListener=null;
  try{voiceEnabled=localStorage.getItem(VOICE_KEY)!=='0';}catch(e){}
  const speaking=()=>[...voices].some(v=>v.kind==='voice');
  const paintVoice=()=>voiceListener?.();
  function stopVoice(){
    voiceGeneration++;voicePending=false;
    for(const v of [...voices])if(v.kind==='voice')v.cancel();
    paintVoice();
  }
  function loadVoice(c,manual=false){
    if(!c||!voiceSlug||(!voiceEnabled&&!manual)||!enabled)return Promise.resolve(false);
    const key='voice-'+voiceSlug;
    if(buffers[key])return Promise.resolve(true);
    if(voiceLoads[key])return voiceLoads[key];
    voiceError=false;
    voiceLoads[key]=(async()=>{
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
      try{
        const r=await fetch(`audio/${key}.mp3?v=${version}`,{signal:controller.signal});
        if(!r.ok)throw Error('Voice unavailable');
        const b=await c.decodeAudioData(await r.arrayBuffer());
        if(!b.length||!Number.isFinite(b.duration)||b.duration>5)throw Error('Invalid voice');
        buffers[key]=b;return true;
      }catch(e){if(key==='voice-'+voiceSlug)voiceError=true;return false;}
      finally{clearTimeout(timer);}
    })().finally(()=>{delete voiceLoads[key];paintVoice();});
    return voiceLoads[key];
  }
  let previousReward=null;
  try{previousReward=localStorage.getItem(REWARD_KEY);}catch(e){}
  let loading=null, loadError=false, contact=0;
  const version=encodeURIComponent(window.GS_VERSION||'local');
  try { enabled=localStorage.getItem(KEY)!=="0"; } catch(e) {}
  const contextReady=()=>!!(enabled&&!document.hidden&&ctx&&ctx.state==='running');
  const ready=()=>contextReady()&&core.some(k=>buffers[k]);
  // Load after a permitted gesture; respect saved mute. Never queue missed contacts.
  function load(c){
    if(core.every(k=>buffers[k])){rewards.forEach(k=>loadSample(c,k));return Promise.resolve();}
    if(loading)return loading;
    loadError=false;
    rewards.forEach(k=>loadSample(c,k));
    loading=Promise.all(core.map(k=>loadSample(c,k))).then(()=>{loadError=!core.some(k=>buffers[k]);}).finally(()=>{loading=null;paint();});
    paint();return loading;
  }
  function loadSample(c,k){
    if(buffers[k])return Promise.resolve(true);
    if(pending[k])return pending[k];
    pending[k]=(async()=>{
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
      try{
        const reward=rewards.includes(k);
        const r=await fetch(`audio/${k}.${reward?'mp3':'wav'}?v=${version}`,{signal:controller.signal});
        if(!r.ok)throw Error('Audio unavailable');
        const b=await c.decodeAudioData(await r.arrayBuffer());
        if(!b.length||!Number.isFinite(b.duration)||b.duration>(reward?6:1))throw Error('Invalid audio');
        buffers[k]=b;return true;
      }catch(e){return false;}finally{clearTimeout(timer);}
    })().finally(()=>{delete pending[k];paint();});
    return pending[k];
  }
  function paint(){
    document.querySelectorAll('[data-gs-sound]').forEach(b=>{
      const active=ready(), label=!AC?'Sound unavailable':enabled&&loading?'Loading sound — tap to cancel':loadError&&enabled?'Retry sound':active?'Mute sound':'Enable sound';
      b.disabled=!AC;b.setAttribute('aria-pressed',String(active));b.setAttribute('aria-label',label);b.title=label;
      b.dataset.soundState=!AC?'unavailable':!enabled?'off':loading?'loading':loadError?'error':active?'on':'waiting';
      b.innerHTML=`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/>${active?'<path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/>':'<path d="M17 9l5 6M22 9l-5 6"/>'}</svg>`;
    });
  }
  function stop(){
    stopVoice();
    last={};
    if(master){master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setValueAtTime(0,ctx.currentTime);}
    for(const v of [...voices])v.cancel();
  }
  // Web Audio's default ambient session can be silent on iPhone/iPad even
  // while AudioContext is running. Playback is requested only when sound is enabled and a gesture unlocks it;
  // it can pause other media; saved mute always prevents acquiring it.
  function acquireSession(){
    try{
      const s=window.navigator?.audioSession;
      if(s&&!session){const previous=s.type;s.type='playback';session=s;previousSession=previous;}
    }catch(e){} // Older browsers still use their normal Web Audio route.
  }
  function releaseSession(){
    if(!session)return;
    try{if(session.type==='playback')session.type=previousSession;}catch(e){}
    session=null;previousSession=null;
  }
  function deactivate(){stop();releaseSession();}
  function boot(){
    if(ctx&&ctx.state!=="closed")return ctx;
    if(!AC)return null;
    try{
      ctx=new AC({latencyHint:'interactive'});master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
      ctx.onstatechange=()=>{if(ctx.state!=="running")stop();paint();};
      return ctx;
    }catch(e){ctx=null;return null;}
  }
  function unlock(){
    if(!enabled||document.hidden)return Promise.resolve(false);
    acquireSession();
    const c=boot();if(!c){releaseSession();return Promise.resolve(false);}
    // Safari can be interrupted (screen lock, another app), not just suspended.
    let result;try{result=c.state!=="running"?c.resume():undefined;}catch(e){releaseSession();paint();return Promise.resolve(false);}
    const resumed=Promise.resolve(result).then(()=>{
      if(c===ctx&&contextReady()){master.gain.setValueAtTime(.65,c.currentTime);loadVoice(c);return true;}
      return false;
    });
    return Promise.all([resumed,load(c)]).then(([running])=>{
      if(running&&c===ctx&&contextReady()){paint();paintVoice();return ready()||!!voiceSlug;}
      releaseSession();paint();return false;
    },()=>{releaseSession();paint();return false;});
  }
  // End-of-touch and click are needed by browsers that do not unlock on touchstart.
  // Capture runs before app handlers; a sound button owns its own activation.
  for(const event of ['pointerdown','touchend','click','keydown'])window.addEventListener(event,e=>{
    if(e.target.closest?.('[data-gs-sound],a[href]'))return; // Navigation should not start a download as the page unloads.
    unlock();
  },{capture:true,passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)deactivate();else if(ctx)unlock();paint();});
  window.addEventListener('pagehide',()=>{deactivate();paint();});
  window.addEventListener('pageshow',()=>{if(ctx)unlock();});
  window.addEventListener('storage',e=>{if(e.key===KEY){enabled=e.newValue==='1';if(!enabled)deactivate();paint();paintVoice();}
    if(e.key===VOICE_KEY){voiceEnabled=e.newValue==='1';if(!voiceEnabled)stopVoice();paintVoice();}});
  const vol=v=>Math.max(0,Math.min(1,v==null?1:v));
  // The recording contains its own transient and fade; preserve both.
  function play(key,level,pan=0,depth=0){
    if(!buffers[key]||!contextReady())return;
    const source=ctx.createBufferSource(),gain=ctx.createGain();
    const p=ctx.createStereoPanner?ctx.createStereoPanner():ctx.createGain();
    source.buffer=buffers[key];
    gain.gain.value=level*(1-.35*Math.max(0,Math.min(1,depth)));
    if(p.pan)p.pan.value=Math.max(-1,Math.min(1,pan))*.45;
    source.connect(gain);gain.connect(p);p.connect(master);
    let ended=false;
    const cleanup=()=>{if(ended)return;ended=true;source.disconnect();gain.disconnect();p.disconnect();voices.delete(v);if(v.kind==='voice')paintVoice();};
    const v={kind:key.startsWith('voice-')?'voice':rewards.includes(key)?'reward':'contact',cancel(){try{source.stop();}catch(e){}cleanup();}};
    voices.add(v);source.onended=cleanup;source.start(ctx.currentTime);
  }
  function allow(kind,gap){
    if(!ready()||speaking()||voicePending)return false;
    const now=ctx.currentTime;if(now-(last[kind]??-Infinity)<gap)return false;
    last[kind]=now;master.gain.setValueAtTime(.65,now);return true;
  }
  const api=window.GSSfx={
    enabled:()=>enabled,ready,unlock,stop,
    configureVoice(slug){if(voiceSlug!==slug)stopVoice();liveVoiceFamily=Object.hasOwn(voiceAliases,slug)||['live-point-buy-time','live-point-other-wing'].includes(slug);const asset=voiceAliases[slug]||slug;voiceSlug=Object.hasOwn(courtVoices,asset)?asset:null;},
    configureLiveVoice(time,recovery,authoredAsset){
      if(!liveVoiceFamily)return;
      const key=authoredAsset||'live-'+(time?(recovery?'time-used':'time-watched'):(recovery?'early-recovery':'recover-sooner'));
      if(!Object.hasOwn(courtVoices,key))return;
      if(voiceSlug!==key)stopVoice();voiceSlug=key;voiceError=false;
      if(contextReady())loadVoice(ctx);
    },
    voiceInfo:()=>voiceSlug?{text:courtVoices[voiceSlug],asset:voiceSlug}:null,
    voiceState:()=>({enabled:voiceEnabled,playing:speaking(),pending:voicePending,error:voiceError,available:!!AC,generation:voiceGeneration}),
    onVoiceChange(fn){voiceListener=fn;paintVoice();},
    setVoice(value){voiceEnabled=!!value;try{localStorage.setItem(VOICE_KEY,voiceEnabled?'1':'0');}catch(e){}if(!voiceEnabled)stopVoice();paintVoice();},
    stopVoice,
    // Automatic completions never wait for a download or resume and never play late.
    completeVoice(manual=false){
      if(!voiceSlug||(!voiceEnabled&&!manual)||!contextReady()||voicePending||!buffers['voice-'+voiceSlug])return false;
      stop();master.gain.setValueAtTime(.65,ctx.currentTime);play('voice-'+voiceSlug,1);paintVoice();return true;
    },
    async hearVoice(){
      if(!voiceSlug||!AC)return false;
      if(voicePending||speaking()){stopVoice();return false;}
      const unlocking=api.set(true),request=++voiceGeneration;voicePending=true;paintVoice();
      const ok=await unlocking;
      const loaded=ok&&await loadVoice(ctx,true);
      if(request!==voiceGeneration)return false;
      voicePending=false;
      if(loaded&&contextReady())return api.completeVoice(true);
      paintVoice();return false;
    },
    stopContacts(){for(const v of [...voices])if(v.kind==='contact')v.cancel();},
    set(value){enabled=!!value;try{localStorage.setItem(KEY,enabled?'1':'0');}catch(e){}if(!enabled)deactivate();paint();return enabled?unlock():Promise.resolve(false);},
    hit(v,pan,depth){const choices=['contact-1','contact-2'].filter(k=>buffers[k]);if(!choices.length||!vol(v)||!allow('hit',.12))return;play(choices[contact++%choices.length],vol(v),pan,depth);},
    bounce(v,pan,depth){if(!vol(v)||!allow('bounce',.22))return;play('bounce',vol(v)*.65,pan,depth);},
    // No authentic net sample yet. Silence is preferable to the old electronic buzz.
    net(){},
    applause(k=.6){
      // One completed-challenge reward, never overlapping or queued for later.
      if(!vol(k)||speaking()||voicePending||[...voices].some(v=>v.kind==='reward')||!allow('applause',6))return;
      // Read again so another tab's last reward is respected. Storage failure
      // still rotates within this page; muted/missed rewards never advance it.
      try{previousReward=localStorage.getItem(REWARD_KEY)||previousReward;}catch(e){}
      const choices=rewards.filter(k=>buffers[k]);if(!choices.length)return;
      const key=choices[(choices.indexOf(previousReward)+1)%choices.length];
      play(key,vol(k)*.9);previousReward=key;
      try{localStorage.setItem(REWARD_KEY,key);}catch(e){}
    },
    wire(root){
      (root||document).querySelectorAll('[data-gs-sound]').forEach(b=>{b.onclick=e=>{
        e.stopPropagation();const enable=!(ready()||(enabled&&loading));
        api.set(enable); // Only visible court events make ball sounds; toggling is silent.
      };});paint();
    }
  };
})();
