(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root) root.GSReleasePolicy=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  // Availability is an explicit release decision, not membership in QBANK.
  // Retained recovery reads are not independent coaching approval.
  // User authorised withholding the older Explore collection on 21 September.
  const recoveryReadIds=Object.freeze([
    'Q004','Q007','Q009','Q013','Q015','Q017','Q020','Q025','Q026','Q027',
    'Q028','Q029','Q035','Q038','Q042','Q044','Q047','Q049','Q053','Q054'
  ]);
  const proInsightIds=Object.freeze([]);
  const questionIds=Object.freeze([...new Set([...recoveryReadIds,...proInsightIds])]);
  const playbookIds=Object.freeze(['wide_serve','serve_plus_one','down_the_line','short_ball','net_approach','drop_lob','high_ball_backhand','pass_or_lob']);
  const retiredPages=Object.freeze(['daily.html','daily2.html','faultlab.html','faultmotion.html','fixashot.html','technique.html']);
  const questions=new Set(questionIds),plays=new Set(playbookIds);
  return Object.freeze({version:'2026-09-21.release-boundary.2',recoveryReadIds,proInsightIds,questionIds,playbookIds,retiredPages,
    isQuestionReleased:id=>typeof id==='string'&&questions.has(id),
    isPlaybookReleased:id=>typeof id==='string'&&plays.has(id)
  });
});
