/* All share entry points use the same preview and the same public link. */
(function(){
'use strict';
let panel, opening=0;
const A=window.GSApp;
function ensurePanel(){
 if(panel)return panel;
 panel=document.createElement('dialog');
 panel.id='quickSharePanel';
 panel.setAttribute('aria-labelledby','quickShareTitle');
 panel.innerHTML=`
   <div class="share-brand" aria-label="GameSharp Tennis"><span aria-hidden="true">GAME<strong>SHARP</strong></span><small aria-hidden="true">TENNIS</small></div>
   <button type="button" id="quickShareClose" aria-label="Close sharing"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
   <div class="share-court"><img class="share-scene" width="1200" height="630" alt=""></div>
   <div class="share-body">
     <h2 id="quickShareTitle"></h2>
     <p id="quickSharePlan" hidden></p>
     <div class="quick-share-actions">
       <button type="button" id="quickShareNative">Share</button>
       <button type="button" id="quickShareCopy">Copy link</button>
     </div>
     <p id="quickShareStatus" role="status"></p>
     <div id="quickShareFallback"></div>
   </div>`;
 document.body.append(panel);
 panel.querySelector('#quickShareClose').onclick=()=>panel.close();
 return panel;
}
function open(slug,options={}){
 const L=A.bySlug(slug);if(!L)return false;
 const plan=typeof options.plan==='string';if(plan&&!options.plan.trim())return false;
 const p=ensurePanel(),current=++opening;
 const link=A.shareUrl(slug),title='GameSharp Tennis · '+A.activityLabel(L).split(' · ')[0];
 const message=plan?`GameSharp Tennis · Proposed plan for our next doubles match\n${options.plan.trim()}\nDiscuss after playing: ${link}`:null;
 const payload=plan?{title:'GameSharp Tennis · Our doubles plan',text:message}:{title,text:title+'\n'+(L.doubles?'Make your calls, then compare with your partner.':'Watch the point. Make your call.'),url:link};
 const copyText=message||link, fallback=p.querySelector('#quickShareFallback');
 fallback.replaceChildren();
 p.querySelector('#quickShareTitle').textContent=plan?'Your proposed doubles plan':A.invitation(L).title;
 const proposal=p.querySelector('#quickSharePlan');
 proposal.hidden=!plan;proposal.textContent=plan?options.plan.trim():'';
 const scene=p.querySelector('.share-scene');
 scene.src='share/'+slug+'.jpg?v='+A.VER;scene.alt='The opening situation for '+A.invitation(L).title;
 const copy=p.querySelector('#quickShareCopy'),native=p.querySelector('#quickShareNative'),status=p.querySelector('#quickShareStatus');
 copy.textContent=plan?'Copy plan':'Copy link';
 copy.disabled=false;native.disabled=false;native.hidden=typeof navigator.share!=='function';
 const primary=native.hidden?copy:native;
 native.autofocus=!native.hidden;copy.autofocus=native.hidden;
 status.textContent=plan?'Agree the plan together before playing.':'The link shares the activity. Your answers and score stay out of the link.';
 const say=text=>{status.textContent=text;options.onStatus?.(text);};
 const active=()=>current===opening&&p.open;
 copy.onclick=async()=>{
   try{
     await navigator.clipboard.writeText(copyText);
     if(!active())return;
     fallback.replaceChildren();say(plan?'Proposed plan copied. Agree it together before playing.':'Link copied.');options.onShared?.('copy');
   }catch{
     if(!active())return;
     const field=document.createElement('textarea');
     field.readOnly=true;field.value=copyText;field.rows=plan?4:2;
     field.setAttribute('aria-label',plan?'Proposed plan and activity link':'Activity link');
     fallback.replaceChildren(field);
     say(plan?'Select and copy your proposed plan below.':'Select and copy the link below.');
     field.focus();field.select();
   }
 };
 native.onclick=async()=>{
   native.disabled=true;copy.disabled=true;
   try{
     await navigator.share(payload);
     if(!active())return;
     say(plan?'Proposed plan shared. Agree it together before playing.':'Challenge shared.');
     options.onShared?.('native');p.close();
   }catch(e){
     if(active())say(e.name==='AbortError'?'Share cancelled.':plan?'Sharing unavailable. Copy your proposed plan instead.':'Sharing unavailable. Copy the link instead.');
   }finally{
     if(current===opening){native.disabled=false;copy.disabled=false;}
   }
 };
 if(!p.open)p.showModal();
 primary.focus({preventScroll:true});p.scrollTop=0;
 return true;
}
window.GSShare={open};
})();
