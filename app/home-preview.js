/* A silent invitation, using the same scene as today's challenge. */
window.GSHomePreview={mount(figure){
 if(!figure)return null;
 const video=figure.querySelector('video'),poster=figure.querySelector('img'),button=figure.querySelector('button');
 const motion=matchMedia('(prefers-reduced-motion: reduce)'),events=[];
 let wanted=!motion.matches&&!navigator.connection?.saveData,finished=false,failed=false,disposed=false,pending=false;
 const rect=figure.getBoundingClientRect();let inView=rect.bottom>0&&rect.top<innerHeight;
 const listen=(el,type,fn)=>{el.addEventListener(type,fn);events.push(()=>el.removeEventListener(type,fn));};
 const paint=()=>{
  const playing=!video.paused&&!video.ended;
  figure.dataset.preview=failed?'unavailable':finished?'ended':playing?'playing':'paused';
  button.setAttribute('aria-label',finished?'Replay court preview':playing?'Pause court preview':'Play court preview');
  button.title=button.getAttribute('aria-label');
  button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+(playing?'<path d="M9 6v12M15 6v12"/>':finished?'<path d="M5 10a7 7 0 1 1 0 5M5 4v6h6"/>':'<path d="m9 6 9 6-9 6Z"/>')+'</svg>';
 };
 const play=async()=>{
  if(disposed||failed||pending||!wanted||!inView||document.hidden)return;
  pending=true;video.muted=true;
  if(!video.getAttribute('src'))video.src=video.dataset.src;
  try{await video.play();if(disposed||!wanted||!inView||document.hidden)video.pause();}
  catch(e){if(!disposed&&e.name!=='AbortError'){wanted=false;paint();}}
  finally{pending=false;}
 };
 const sync=()=>{if(!wanted||!inView||document.hidden)video.pause();else void play();};
 listen(button,'click',()=>{
  if(failed)return;
  if(!video.paused){wanted=false;video.pause();}
  else{if(finished){video.currentTime=0;finished=false;}wanted=true;void play();}
  paint();
 });
 listen(video,'playing',()=>{figure.classList.add('preview-ready');paint();});
 listen(video,'pause',paint);
 listen(video,'ended',()=>{wanted=false;finished=true;paint();});
 listen(video,'error',()=>{failed=true;wanted=false;video.pause();figure.classList.remove('preview-ready');button.hidden=true;if(poster.complete&&!poster.naturalWidth)figure.hidden=true;paint();});
 listen(poster,'error',()=>{if(failed||!video.getAttribute('src'))figure.hidden=true;});
 listen(document,'visibilitychange',sync);
 listen(motion,'change',()=>{if(motion.matches){wanted=false;video.pause();paint();}});
 const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();},{threshold:.15});observer.observe(figure);
 video.muted=true;paint();void play();
 return {stop(){disposed=true;wanted=false;observer.disconnect();events.forEach(off=>off());video.pause();video.removeAttribute('src');video.load();}};
}};
