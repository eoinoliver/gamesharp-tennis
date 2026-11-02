/* Home uses the same captured player, court projection and ball as Sharpen.
   One complete serve, a visible landing, then a quiet reset of the whole scene. */
(function(){
let loading;
window.GSCine=function(stage){
  let stopped=false, player;
  const ready=window.GSAthlete?Promise.resolve():loading||(loading=new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src='athlete.js?v='+(window.GS_VERSION||'');
    script.onload=resolve;script.onerror=()=>{loading=null;reject(new Error('Court unavailable'));};document.head.appendChild(script);
  }));
  ready.then(()=>{if(stopped||!stage.isConnected)return;
    player=GSAthlete.mount(stage,{order:['serve'],start:'serve',home:true});
  }).catch(()=>{stage.classList.add('court-unavailable');});
  return {stop(){stopped=true;player?.stop();}};
};
})();
