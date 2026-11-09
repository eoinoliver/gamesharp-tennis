/* The first Share screen belongs to GameSharp. Native sharing is an explicit second action. */
(function(){
'use strict';
let panel;
const A=window.GSApp;
function ensurePanel(){
 if(panel)return panel;
 panel=document.createElement('dialog');panel.id='quickSharePanel';panel.setAttribute('aria-labelledby','quickShareTitle');
 panel.innerHTML='<button type="button" id="quickShareClose" aria-label="Close sharing"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button><div class="share-brand" aria-label="GameSharp Tennis"><span aria-hidden="true">GAME<strong>SHARP</strong></span><small aria-hidden="true">TENNIS</small></div><img class="share-scene" width="1200" height="630" alt=""><h2 id="quickShareTitle"></h2><p class="share-invitation"></p><label id="quickShareLabel" for="quickShareLink"></label><div id="quickShareField"></div><div class="quick-share-actions"><button type="button" id="quickShareCopy" autofocus>Copy link</button><button type="button" id="quickShareNative" aria-describedby="quickShareNativeHint">Share via another app</button></div><p id="quickShareNativeHint">Opens your device’s share menu.</p><p id="quickShareStatus" role="status"></p>';
 document.body.append(panel);panel.querySelector('#quickShareClose').onclick=()=>panel.close();
 return panel;
}
function open(slug,options={}){
 const L=A.bySlug(slug);if(!L)return false;
 const plan=typeof options.plan==='string';if(plan&&!options.plan.trim())return false;
 const p=ensurePanel(),link=A.shareUrl(slug),title='GameSharp Tennis · '+A.activityLabel(L).split(' · ')[0];
 const message=plan?`GameSharp Tennis · Proposed plan for our next doubles match\n${options.plan.trim()}\nDiscuss after playing: ${link}`:null;
 const payload=plan?{title:'GameSharp Tennis · Our doubles plan',text:message}:{title,text:title+'\n'+(L.doubles?'Make your calls, then compare with your partner.':'Watch the point. Make your call.'),url:link};
 const copyText=message||link,field=document.createElement(plan?'textarea':'input');field.id='quickShareLink';field.readOnly=true;field.value=copyText;if(plan)field.rows=4;
 p.querySelector('#quickShareField').replaceChildren(field);
 p.querySelector('#quickShareLabel').textContent=plan?'Your proposed plan and point link':'Link to this activity';
 p.querySelector('#quickShareTitle').textContent=plan?'Your proposed doubles plan':A.displayTitle(L);
 p.querySelector('.share-invitation').textContent=plan?'Share your proposal. Agree the plan together.':'Let them make their own call.';
 const scene=p.querySelector('.share-scene');scene.src='share/'+slug+'.jpg?v='+A.VER;scene.alt='The opening situation for '+A.displayTitle(L);
 const copy=p.querySelector('#quickShareCopy'),native=p.querySelector('#quickShareNative'),status=p.querySelector('#quickShareStatus');
 copy.textContent=plan?'Copy proposed plan':'Copy link';copy.disabled=false;native.disabled=false;native.hidden=typeof navigator.share!=='function';p.querySelector('#quickShareNativeHint').hidden=native.hidden;
 status.textContent=plan?'This is a proposal, not confirmation of your partner’s agreement.':'Your answers and scores stay private.';
 const say=text=>{status.textContent=text;options.onStatus?.(text);};
 copy.onclick=async()=>{try{await navigator.clipboard.writeText(copyText);say(plan?'Proposed plan copied. Agree it together before playing.':'Link copied.');options.onShared?.('copy');}catch(e){field.focus();field.select();say(plan?'Select and copy your proposed plan above.':'Select and copy the link above.');}};
 native.onclick=async()=>{
  if(typeof navigator.share!=='function'){say('Use Copy link to share this activity.');return;}
  native.disabled=true;copy.disabled=true;
  try{await navigator.share(payload);say(plan?'Proposed plan shared. Agree it together before playing.':'Challenge shared.');options.onShared?.('native');p.close();}
  catch(e){say(e.name==='AbortError'?'Share cancelled.':plan?'Sharing unavailable. Copy your proposed plan instead.':'Sharing unavailable. Copy the link instead.');}
  finally{native.disabled=false;copy.disabled=false;}
 };
 if(!p.open)p.showModal();
 return true;
}
window.GSShare={open};
})();
