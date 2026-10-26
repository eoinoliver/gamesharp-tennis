/* GameSharp: brief, optional contact and success cues. No background soundtrack.
   A saved preference is not proof that the browser has allowed playback. */
(function(){
  const KEY="gs_sound", AC=window.AudioContext||window.webkitAudioContext;
  let ctx=null, master=null, noiseBuf=null, enabled=true, last={}, epoch=0;
  const voices=new Set();
  try { enabled=localStorage.getItem(KEY)!=="0"; } catch(e) {}
  const ready=()=>!!(enabled&&!document.hidden&&ctx&&ctx.state==="running");
  function paint(){
    document.querySelectorAll('[data-gs-sound]').forEach(b=>{
      const active=ready(), label=!AC?'Sound unavailable':active?'Mute sound':'Enable sound';
      b.disabled=!AC;b.setAttribute('aria-pressed',String(active));b.setAttribute('aria-label',label);b.title=label;
      b.dataset.soundState=!AC?'unavailable':!enabled?'off':active?'on':'waiting';
      b.innerHTML=`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/>${active?'<path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/>':'<path d="M17 9l5 6M22 9l-5 6"/>'}</svg>`;
    });
  }
  function stop(){
    epoch++;last={};
    if(master){master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setValueAtTime(0,ctx.currentTime);}
    for(const v of [...voices])v.cancel();
  }
  function boot(){
    if(ctx&&ctx.state!=="closed")return ctx;
    if(!AC)return null;
    try{
      ctx=new AC({latencyHint:'interactive'});master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
      noiseBuf=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.25),ctx.sampleRate);
      const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
      ctx.onstatechange=()=>{if(ctx.state!=="running")stop();paint();};
      return ctx;
    }catch(e){ctx=null;return null;}
  }
  function unlock(){
    if(!enabled||document.hidden)return Promise.resolve(false);
    const c=boot();if(!c)return Promise.resolve(false);
    // Safari can be interrupted (screen lock, another app), not just suspended.
    let result;try{result=c.state!=="running"?c.resume():undefined;}catch(e){paint();return Promise.resolve(false);}
    return Promise.resolve(result).then(()=>{
      if(ready()){master.gain.setValueAtTime(.45,c.currentTime);paint();return true;}
      paint();return false;
    },()=>{paint();return false;});
  }
  // End-of-touch and click are needed by browsers that do not unlock on touchstart.
  // Capture runs before app handlers; a sound button owns its own activation.
  for(const event of ['pointerdown','touchend','click','keydown'])window.addEventListener(event,e=>{
    if(e.target.closest?.('[data-gs-sound]'))return;
    unlock();
  },{capture:true,passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(ctx)unlock();paint();});
  window.addEventListener('pagehide',()=>{stop();paint();});
  window.addEventListener('pageshow',()=>{if(ctx)unlock();});
  window.addEventListener('storage',e=>{if(e.key===KEY){enabled=e.newValue!=='0';if(!enabled)stop();paint();}});
  const vol=v=>Math.max(0,Math.min(1,v==null?1:v));
  // Every voice owns its nodes. Muting/navigation cancels even future claps.
  function voice(pan=0,depth=0){
    const nodes=[],sources=[];let count=0,ended=false;
    const node=n=>(nodes.push(n),n), gain=node(ctx.createGain());
    gain.gain.value=1-.35*Math.max(0,Math.min(1,depth));
    const p=node(ctx.createStereoPanner?ctx.createStereoPanner():ctx.createGain());
    if(p.pan)p.pan.value=Math.max(-1,Math.min(1,pan))*.45;
    gain.connect(p);p.connect(master);
    function cleanup(){if(ended)return;ended=true;nodes.forEach(n=>n.disconnect());voices.delete(v);}
    const v={cancel(){for(const s of sources)try{s.stop();}catch(e){}cleanup();}};voices.add(v);
    function source(s,t,dur,amp){
      node(s);sources.push(s);count++;
      const g=node(ctx.createGain());g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0001,amp),t+.002);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
      s.onended=()=>{if(--count===0)cleanup();};s.start(t);s.stop(t+dur+.01);return g;
    }
    return {
      tone(t,f0,f1,dur,amp){const s=ctx.createOscillator();s.frequency.setValueAtTime(f0,t);s.frequency.exponentialRampToValueAtTime(f1,t+dur);const g=source(s,t,dur,amp);s.connect(g);g.connect(gain);},
      noise(t,dur,freq,amp){const s=ctx.createBufferSource();s.buffer=noiseBuf;const g=source(s,t,dur,amp),f=node(ctx.createBiquadFilter());f.type='bandpass';f.frequency.value=freq;f.Q.value=.8;s.connect(f);f.connect(g);g.connect(gain);}
    };
  }
  function allow(kind,gap){
    if(!ready())return false;
    const now=ctx.currentTime;if(now-(last[kind]??-Infinity)<gap)return false;
    last[kind]=now;master.gain.setValueAtTime(.45,now);return true;
  }
  const api=window.GSSfx={
    enabled:()=>enabled,ready,unlock,stop,
    set(value){enabled=!!value;try{localStorage.setItem(KEY,enabled?'1':'0');}catch(e){}if(!enabled)stop();paint();return enabled?unlock():Promise.resolve(false);},
    hit(v,pan,depth){if(!vol(v)||!allow('hit',.12))return;const t=ctx.currentTime,k=vol(v),o=voice(pan,depth);
      o.noise(t,.025,2200,.48*k);o.tone(t,560,420,.045,.17*k);o.tone(t,210,110,.065,.48*k);},
    bounce(v,pan,depth){if(!vol(v)||!allow('bounce',.22))return;const t=ctx.currentTime,k=vol(v),o=voice(pan,depth);
      o.tone(t,180,90,.065,.4*k);o.noise(t,.035,900,.22*k);},
    net(v,pan,depth){if(!vol(v)||!allow('net',.2))return;const t=ctx.currentTime,k=vol(v),o=voice(pan,depth);
      o.tone(t,120,60,.12,.35*k);o.noise(t,.08,380,.3*k);},
    applause(k=.6){if(!vol(k)||!allow('applause',4))return;
      const t=ctx.currentTime,o=voice();
      for(let i=0;i<36;i++){const u=i/36;o.noise(t+.02+u*.72,.035,1100+Math.random()*1700,vol(k)*.16*Math.sin(Math.PI*u));}
    },
    wire(root){
      (root||document).querySelectorAll('[data-gs-sound]').forEach(b=>{b.onclick=e=>{
        e.stopPropagation();const enable=!ready(),started=performance.now();
        const result=api.set(enable),version=epoch;
        if(enable)result.then(ok=>{if(ok&&version===epoch&&performance.now()-started<500)api.hit(.45);});
      };});paint();
    }
  };
})();
