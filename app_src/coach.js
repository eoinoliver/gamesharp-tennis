/* One browser-local coach choice for lessons and Reset. Choosing never unmutes. */
(function(){
  const KEY='gs_coach', names={frank:'Frank',lara:'Lara'}, listeners=new Set();
  const valid=value=>Object.hasOwn(names,value)?value:'frank';
  let selected='frank',saved=true;
  try{selected=valid(localStorage.getItem(KEY));}catch{saved=false;}
  function paint(){
    document.querySelectorAll('[data-gs-coach]').forEach(select=>{select.value=selected;});
    document.querySelectorAll('[data-gs-coach-status]').forEach(status=>{
      status.textContent=saved?'':'For this page only. Browser storage is unavailable.';
    });
  }
  function change(value){
    const next=valid(value),changed=next!==selected;selected=next;paint();
    if(changed)listeners.forEach(fn=>fn(selected));
  }
  const api=window.GSCoach={
    current:()=>selected,
    name:()=>names[selected],
    asset:slug=>'voice-'+(selected==='lara'?'lara-':'')+slug,
    url:slug=>`audio/${api.asset(slug)}.mp3?v=${encodeURIComponent(window.GS_VERSION||'local')}`,
    set(value){
      if(!Object.hasOwn(names,value))return false;
      try{localStorage.setItem(KEY,value);saved=localStorage.getItem(KEY)===value;}catch{saved=false;}
      change(value);return saved;
    },
    onChange(fn){listeners.add(fn);return()=>listeners.delete(fn);},
    wire(root=document){
      root.querySelectorAll('[data-gs-coach-control]').forEach(box=>{
        if(!box.querySelector('[data-gs-coach]'))box.innerHTML='<label class="gs-coach-choice">Coach <select data-gs-coach aria-label="Coach voice"><option value="frank">Frank · measured</option><option value="lara">Lara · energetic</option></select></label><span class="gs-coach-status" data-gs-coach-status role="status"></span>';
        box.querySelector('[data-gs-coach]').onchange=e=>api.set(e.target.value);
      });paint();
    }
  };
  window.addEventListener('storage',e=>{if(e.key===KEY||e.key===null){saved=true;change(e.key===null?null:e.newValue);}});
  window.addEventListener('pageshow',()=>{try{const value=localStorage.getItem(KEY);saved=true;change(value);}catch{saved=false;paint();}});
})();
