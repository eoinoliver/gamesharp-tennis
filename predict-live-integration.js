(function(root,factory){
  const engine=(root&&root.GSLivePointEngine)||(typeof require==='function'?require('./livepoint-engine.js'):null);
  const content=(root&&root.GSLivePointContent)||(typeof require==='function'?require('./livepoint-content.js'):null);
  const api=factory(root,engine,content);
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root) root.GSPredictLive=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root,engine,content){
  'use strict';

  const STORE_KEY='gs_learning_evidence_v1';
  const STORE_VERSION=1;
  const AREA_LABELS=Object.freeze({
    mindset:'Mental Game',decisions:'Decision Making',serve_return:'Serve & Return',
    forehand:'Forehand',backhand:'Backhand',net:'Net Play',movement:'Movement'
  });

  // One sequence contract is the only source for the learning identity, replay,
  // natural sound, progression evidence and Sharpen destination. A sequence is
  // not eligible to render unless this contract and its timeline validate.
  const CONTRACTS=Object.freeze({
    seq_001:Object.freeze({
      sequenceId:'seq_001',
      conceptId:'serve-wide-open-court',
      title:'Wide serve, then own the open court',
      insight:'The wide serve is the first move, not the finish. Read the stretched return, then take the space it created.',
      replayCue:'Pull them wide. Read the reply. Strike the space.',
      primaryArea:'serve_return',
      secondaryArea:'decisions',
      sharpenRegion:'serve_return',
      tags:Object.freeze(['serve-pattern','plus-one','open-court','early-read']),
      decisionAnchors:Object.freeze(['Down the line through the large open half','Step in early and drive into the open forehand corner','Slice deep into the open backhand half and follow it to net']),
      source:'direct',
      play:Object.freeze({
        mode:'singles',
        youStart:Object.freeze([145,292]),
        oppStart:Object.freeze([74,36]),
        youWaypoints:Object.freeze([[145,292],[150,204],[100,205],[150,195],[135,180]]),
        oppWaypoints:Object.freeze([[74,36],[42,42],[158,54],[45,55]]),
        shots:Object.freeze([
          Object.freeze({actor:'you',from:[145,292],bounce:[42,112],to:[42,42],snd:'serve',label:'Wide serve'}),
          Object.freeze({actor:'opp',from:[42,42],to:[150,204],snd:'slice',label:'Stretched block return'}),
          Object.freeze({actor:'you',from:[150,204],to:[158,54],snd:'ground',label:'Plus-one down the line into the open court'}),
          Object.freeze({actor:'opp',from:[158,54],to:[100,205],snd:'slice',label:'High defensive float'}),
          Object.freeze({actor:'you',from:[100,205],to:[45,55],snd:'ground',label:'Early drive into the open forehand corner'}),
          Object.freeze({actor:'opp',from:[45,55],to:[150,195],snd:'slice',label:'Weak short chip'}),
          Object.freeze({actor:'you',from:[150,195],to:[155,55],snd:'slice',label:'Deep slice approach to the backhand'}),
          Object.freeze({actor:'opp',from:[155,55],to:[135,180],snd:'ground',label:'Passing attempt'}),
          Object.freeze({actor:'you',from:[135,180],to:[45,60],snd:'volley',label:'Deep finishing volley',payoff:true})
        ])
      })
    }),
    seq_002:Object.freeze({
      sequenceId:'seq_002',conceptId:'attack-weak-second-serve',title:'Step in, target the weakness, close forward',
      insight:'A slower, higher second serve gives you time and position. Step in from balance, use the weakness you have observed, then close only after the reply lands short.',
      replayCue:'Read the bounce. Step in. Close only on short.',primaryArea:'serve_return',secondaryArea:'net',sharpenRegion:'serve_return',
      tags:Object.freeze(['return-position','second-serve','approach','volley']),source:'direct',
      decisionAnchors:Object.freeze(['Step in and drive deep to the backhand wing that has broken down today','Approach down the line behind it and close in balance','Controlled angle volley crosscourt']),
      play:Object.freeze({mode:'singles',youStart:[72,292],oppStart:[135,8],youWaypoints:[[72,292],[72,260],[150,205],[150,178]],oppWaypoints:[[135,8],[150,40],[154,54]],shots:Object.freeze([
        Object.freeze({actor:'opp',from:[135,8],bounce:[72,188],to:[72,260],snd:'serve',contactType:'serve',serveNumber:2,label:'Soft second serve'}),
        Object.freeze({actor:'you',from:[72,260],to:[150,40],snd:'ground',label:'Step-in return to the backhand'}),
        Object.freeze({actor:'opp',from:[150,40],to:[150,205],snd:'slice',label:'Short defensive slice'}),
        Object.freeze({actor:'you',from:[150,205],to:[154,54],snd:'ground',label:'Down-the-line approach'}),
        Object.freeze({actor:'opp',from:[154,54],to:[150,178],snd:'ground',label:'Rushed passing attempt'}),
        Object.freeze({actor:'you',from:[150,178],to:[46,116],snd:'volley',label:'Angled volley into the open court',payoff:true})
      ])})
    }),
    seq_003:Object.freeze({
      sequenceId:'seq_003',conceptId:'pull-pusher-forward',title:'Change the court the pusher wants',
      insight:'Do not try to outlast their favourite pattern. Pull them forward, play behind their movement, then recover the lob without panic.',
      replayCue:'Bring them in. Play behind them. Turn for the lob.',primaryArea:'decisions',secondaryArea:'movement',sharpenRegion:'decisions',
      tags:Object.freeze(['opponent-type','drop-shot','approach','overhead']),source:'direct',
      decisionAnchors:Object.freeze(['Use a controlled drop shot to bring them forward','Drive deep behind them and follow the ball to the net','Turn early, track it with crossover steps, let it bounce, then attack only if balanced']),
      play:Object.freeze({mode:'singles',youStart:[96,236],oppStart:[100,8],youWaypoints:[[96,236],[104,194],[110,270]],oppWaypoints:[[100,8],[92,118],[44,54]],shots:Object.freeze([
        Object.freeze({actor:'opp',from:[100,8],to:[96,236],snd:'ground',label:'Safe looping rally ball'}),
        Object.freeze({actor:'you',from:[96,236],to:[92,118],snd:'slice',label:'Drop shot into the forecourt'}),
        Object.freeze({actor:'opp',from:[92,118],to:[104,194],snd:'slice',label:'Scrambled pop-up'}),
        Object.freeze({actor:'you',from:[104,194],to:[44,54],snd:'ground',label:'Deep drive behind their forward movement'}),
        Object.freeze({actor:'opp',from:[44,54],to:[110,270],snd:'ground',label:'High defensive lob that clears you',forceBounce:true}),
        Object.freeze({actor:'you',from:[110,270],to:[160,48],snd:'smash',label:'Turn, set, controlled bounce-smash',payoff:true})
      ])})
    }),
    seq_004:Object.freeze({
      sequenceId:'seq_004',conceptId:'take-moonball-early',title:'Take height before it takes your court',
      insight:'Depth decides. This ball lands short enough to step in and take on the rise; a deeper moonball would demand space, balance and a different response.',
      replayCue:'Read short. Step in. Take it on the rise.',primaryArea:'backhand',secondaryArea:'movement',sharpenRegion:'backhand',
      tags:Object.freeze(['high-ball','backhand','early-contact','overhead']),source:'direct',
      decisionAnchors:Object.freeze(['Step in and take it on the rise before it reaches shoulder height','Approach deep to the backhand half and close behind it','Placed overhead into the open court']),
      play:Object.freeze({mode:'singles',youStart:[76,214],oppStart:[92,42],youWaypoints:[[76,214],[104,198],[108,210]],oppWaypoints:[[92,42],[148,52],[158,56]],shots:Object.freeze([
        Object.freeze({actor:'opp',from:[92,42],to:[76,214],snd:'ground',label:'Heavy moonball to the backhand'}),
        Object.freeze({actor:'you',from:[76,214],to:[148,52],snd:'ground',direction:'crosscourt',label:'Early crosscourt drive on the rise before shoulder height'}),
        Object.freeze({actor:'opp',from:[148,52],to:[104,198],snd:'ground',label:'Shorter topspin reply'}),
        Object.freeze({actor:'you',from:[104,198],to:[158,56],snd:'ground',label:'Deep approach to the backhand'}),
        Object.freeze({actor:'opp',from:[158,56],to:[108,210],snd:'ground',label:'Short defensive lob'}),
        Object.freeze({actor:'you',from:[108,210],to:[46,52],snd:'smash',label:'Controlled overhead to open court',payoff:true})
      ])})
    }),
    seq_005:Object.freeze({
      sequenceId:'seq_005',conceptId:'close-set-with-process',title:'Close the set with the pattern you trust',
      insight:'Set point does not require a special shot. Choose the trusted serve, play the normal rally ball, then attack a genuine opening.',
      replayCue:'Choose early. Trust the pattern. Attack the right ball.',primaryArea:'mindset',secondaryArea:'decisions',sharpenRegion:'mindset',
      tags:Object.freeze(['pressure','trusted-pattern','set-point','controlled-attack']),source:'direct',
      decisionAnchors:Object.freeze(['Commit to the trusted body serve with your normal routine','Play the trusted heavy crosscourt ball to the weaker side with margin','Attack the large open court with normal shape and target margin']),
      play:Object.freeze({mode:'singles',youStart:[104,276],oppStart:[100,34],youWaypoints:[[104,276],[142,248],[96,216]],oppWaypoints:[[100,34],[72,115],[158,54]],shots:Object.freeze([
        Object.freeze({actor:'you',from:[104,276],bounce:[72,115],to:[72,42],snd:'serve',label:'Trusted high-percentage serve'}),
        Object.freeze({actor:'opp',from:[72,42],to:[142,248],snd:'ground',label:'Deep crosscourt return'}),
        Object.freeze({actor:'you',from:[142,248],to:[158,54],snd:'ground',label:'Normal heavy ball to the weaker side'}),
        Object.freeze({actor:'opp',from:[158,54],to:[96,216],snd:'ground',label:'Mid-depth defensive reply'}),
        Object.freeze({actor:'you',from:[96,216],to:[45,58],snd:'ground',label:'Controlled attack to open court',payoff:true})
      ])})
    }),
    seq_006:Object.freeze({
      sequenceId:'seq_006',conceptId:'neutralise-big-serve',title:'Buy time, neutralise, earn the attack',
      insight:'Against real pace, the return is not the finish. Create reaction time, block deep, then wait for the first ball you can own.',
      replayCue:'Give ground. Block deep. Earn the opening.',primaryArea:'serve_return',secondaryArea:'movement',sharpenRegion:'serve_return',
      tags:Object.freeze(['big-server','return-position','neutralise','first-attack']),source:'new',
      decisionAnchors:Object.freeze(['Give yourself 1–1.5 metres more space and use a compact block','Drive a solid crosscourt ball — start building the rally','Step in and drive with margin into the open half']),
      play:Object.freeze({mode:'singles',youStart:[100,288],oppStart:[100,30],youWaypoints:[[100,288],[100,196],[74,248],[108,208]],oppWaypoints:[[100,30],[158,50],[48,52]],shots:Object.freeze([
        Object.freeze({actor:'opp',from:[100,30],bounce:[100,196],to:[100,270],snd:'serve',label:'Fast T serve'}),
        Object.freeze({actor:'you',from:[100,270],to:[158,50],snd:'slice',label:'Compact deep block to the backhand'}),
        Object.freeze({actor:'opp',from:[158,50],to:[74,248],snd:'ground',label:'Heavy plus-one down the middle'}),
        Object.freeze({actor:'you',from:[74,248],to:[48,52],snd:'ground',label:'Deep crosscourt neutral ball'}),
        Object.freeze({actor:'opp',from:[48,52],to:[108,208],snd:'ground',label:'Shorter rally reply'}),
        Object.freeze({actor:'you',from:[108,208],to:[158,58],snd:'ground',label:'Early drive into the open court',payoff:true})
      ])})
    }),
    seq_007:Object.freeze({
      sequenceId:'seq_007',conceptId:'t-serve-poach',title:'Make the return predictable, then poach',
      insight:'A planned poach is built on an observed return pattern. Signal first, repeat the serve that shaped the lane, then cross as the returner commits.',
      replayCue:'Signal. Repeat the read. Move on returner commitment.',primaryArea:'net',secondaryArea:'serve_return',sharpenRegion:'net',
      tags:Object.freeze(['doubles','poach','t-serve','partner-movement']),source:'new',
      decisionAnchors:Object.freeze(['T serve — it has been producing the crosscourt block','As the returner commits to the swing','Firm through the open middle gap, away from both rackets']),
      play:Object.freeze({mode:'doubles',youStart:[138,276],oppStart:[62,34],partnerStart:[62,202],netOppStart:[138,96],youWaypoints:[[138,276]],oppWaypoints:[[62,34]],shots:Object.freeze([
        Object.freeze({actor:'you',from:[138,276],bounce:[96,112],to:[62,42],snd:'serve',label:'T serve repeats the observed return pattern'}),
        Object.freeze({actor:'opp',from:[62,42],to:[112,174],snd:'slice',label:'Returner commits to the familiar crosscourt block'}),
        Object.freeze({actor:'partner',from:[112,174],to:[105,60],snd:'volley',label:'Partner crosses on commitment and volleys through the gap',payoff:true})
      ])})
    }),
    seq_008:Object.freeze({
      sequenceId:'seq_008',conceptId:'defend-recover-rebuild',title:'Use height and depth to get home',
      insight:'When you are outside the court, the best shot is the one that restores position. High and deep buys the recovery; patience earns the next attack.',
      replayCue:'Buy time. Recover. Rebuild. Then strike.',primaryArea:'movement',secondaryArea:'decisions',sharpenRegion:'movement',
      tags:Object.freeze(['defense','recovery','high-deep','transition']),source:'direct',
      requiresOutsideSingles:true,
      decisionAnchors:Object.freeze(['Send a high, deep crosscourt ball through the long diagonal','Rebuild with a deep rally ball through the reliable crosscourt lane','Take it early and drive with margin into the open half']),
      play:Object.freeze({mode:'singles',youStart:[178,242],oppStart:[48,54],youWaypoints:[[178,242],[100,242],[112,206]],oppWaypoints:[[48,54],[42,42],[142,48]],shots:Object.freeze([
        Object.freeze({actor:'opp',from:[48,54],to:[178,242],snd:'ground',label:'Attack pulls you outside the sideline'}),
        Object.freeze({actor:'you',from:[178,242],to:[42,42],snd:'ground',label:'High deep crosscourt recovery ball'}),
        Object.freeze({actor:'opp',from:[42,42],to:[100,242],snd:'ground',label:'Neutral reply after your recovery'}),
        Object.freeze({actor:'you',from:[100,242],to:[142,48],snd:'ground',label:'Deep rally ball rebuilds neutral'}),
        Object.freeze({actor:'opp',from:[142,48],to:[112,206],snd:'ground',label:'Shorter ball finally arrives'}),
        Object.freeze({actor:'you',from:[112,206],to:[158,58],snd:'ground',label:'Early drive with margin to the open half',payoff:true})
      ])})
    }),
    seq_009:Object.freeze({
      sequenceId:'seq_009',conceptId:'approach-line-close-net',title:'Approach down the line, then own the angle',
      insight:'From this short, balanced ball, the line narrows the pass. Move with the approach, consolidate the knee-high volley, then use the opening you create.',
      replayCue:'Approach the line. Close behind it. Volley the space.',primaryArea:'net',secondaryArea:'movement',sharpenRegion:'net',
      tags:Object.freeze(['approach','down-the-line','net-position','volley']),source:'direct',
      decisionAnchors:Object.freeze(['Deep down the line — narrows their passing angle','Firm, deep volley through the open half — keep it below their strike zone','Crisp angle volley to the open court — controlled and decisive']),
      play:Object.freeze({mode:'singles',youStart:[50,200],oppStart:[100,44],youWaypoints:[[50,200],[100,178],[110,170]],oppWaypoints:[[100,44],[42,54],[155,70]],shots:Object.freeze([
        Object.freeze({actor:'opp',from:[100,44],to:[50,200],snd:'slice',label:'Short ball inside the service line'}),
        Object.freeze({actor:'you',from:[50,200],to:[42,54],snd:'ground',label:'Deep down-the-line approach'}),
        Object.freeze({actor:'opp',from:[42,54],to:[100,178],snd:'ground',label:'Crosscourt pass toward the central net position'}),
        Object.freeze({actor:'you',from:[100,178],to:[155,70],snd:'volley',label:'Firm deep first volley through the open half'}),
        Object.freeze({actor:'opp',from:[155,70],to:[110,170],snd:'ground',label:'Floating defensive reply'}),
        Object.freeze({actor:'you',from:[110,170],to:[42,116],snd:'volley',label:'Crisp angle volley to open court',payoff:true})
      ])})
    }),
    seq_010:Object.freeze({
      sequenceId:'seq_010',conceptId:'t-serve-plus-one',title:'Use the return you have observed',
      insight:'This returner has repeatedly blocked the T serve centrally. Pre-plan from that evidence, confirm the return, then use their recovery before closing on the short ball.',
      replayCue:'Serve T. Confirm the block. Play behind recovery.',primaryArea:'serve_return',secondaryArea:'forehand',sharpenRegion:'serve_return',
      tags:Object.freeze(['t-serve','plus-one','inside-out-forehand','approach']),source:'new',
      decisionAnchors:Object.freeze(['Inside-out forehand with depth and margin into the backhand half','Take it early and play behind their outward recovery into the backhand corner','Approach through the open forehand half and close behind the ball']),
      play:Object.freeze({mode:'singles',youStart:[105,292],oppStart:[100,34],youWaypoints:[[105,292],[100,216],[100,216],[96,194],[150,178]],oppWaypoints:[[100,34],[100,42],[160,52],[158,54],[42,55]],motionCues:Object.freeze([{key:'outward-recovery',actor:'opp',atShot:4,position:[122,52]}]),shots:Object.freeze([
        Object.freeze({actor:'you',from:[105,292],bounce:[96,110],to:[100,42],snd:'serve',label:'T serve tests the observed return lane'}),
        Object.freeze({actor:'opp',from:[100,42],to:[100,216],snd:'slice',label:'Observed central block'}),
        Object.freeze({actor:'you',from:[100,216],to:[160,52],snd:'ground',label:'Inside-out forehand with margin'}),
        Object.freeze({actor:'opp',from:[160,52],to:[100,216],snd:'ground',label:'High defensive float'}),
        Object.freeze({actor:'you',from:[100,216],to:[158,54],snd:'ground',label:'Early drive behind the recovery'}),
        Object.freeze({actor:'opp',from:[158,54],to:[96,194],snd:'slice',label:'Weak short reply'}),
        Object.freeze({actor:'you',from:[96,194],to:[42,55],snd:'ground',label:'Approach through the open forehand half'}),
        Object.freeze({actor:'opp',from:[42,55],to:[150,178],snd:'ground',label:'Last passing attempt'}),
        Object.freeze({actor:'you',from:[150,178],to:[50,62],snd:'volley',label:'Clean finishing volley',payoff:true})
      ])})
    }),
    seq_011:Object.freeze({
      sequenceId:'seq_011',conceptId:'tiebreak-percentage-pattern',title:'Play the tiebreak pattern, not the occasion',
      insight:'Pressure does not improve a low-percentage idea. Use the serve and rally ball you trust, then attack only when the court truly changes.',
      replayCue:'Trusted serve. Best rally ball. Earn the net.',primaryArea:'mindset',secondaryArea:'decisions',sharpenRegion:'mindset',
      tags:Object.freeze(['tiebreak','pressure','percentage-tennis','mini-break']),source:'adapted',
      decisionAnchors:Object.freeze(['Use the trusted serve to their backhand with the same full motion and routine','Commit to the trusted heavy rally ball into their weaker side through a generous target','Drive a controlled approach down the line and close behind its path']),
      play:Object.freeze({mode:'singles',youStart:[106,276],oppStart:[100,34],youWaypoints:[[106,276],[72,236],[94,204],[146,226]],oppWaypoints:[[100,34],[150,116],[154,52],[42,60]],shots:Object.freeze([
        Object.freeze({actor:'you',from:[106,276],bounce:[150,116],to:[150,42],snd:'serve',label:'Highest-percentage serve to the backhand'}),
        Object.freeze({actor:'opp',from:[150,42],to:[72,236],snd:'ground',label:'Neutral return to the forehand'}),
        Object.freeze({actor:'you',from:[72,236],to:[154,52],snd:'ground',label:'Best rally ball to the weaker side'}),
        Object.freeze({actor:'opp',from:[154,52],to:[94,204],snd:'ground',label:'Short reply creates the opening'}),
        Object.freeze({actor:'you',from:[94,204],to:[42,60],snd:'ground',label:'Controlled down-the-line approach'}),
        Object.freeze({actor:'opp',from:[42,60],to:[146,226],snd:'ground',label:'Passing attempt under pressure'}),
        Object.freeze({actor:'you',from:[146,226],to:[48,62],snd:'volley',label:'Simple volley for the mini-break',payoff:true})
      ])})
    }),
    seq_012:Object.freeze({
      sequenceId:'seq_012',conceptId:'two-pass-then-drive-volley',title:'Pass with geometry, then finish the float',
      insight:'The first pass stretches the net player. The second uses the space that movement creates. A chest-high float calls for a controlled drive volley—not an overhead.',
      replayCue:'Stretch crosscourt. Change the line. Finish the float.',primaryArea:'decisions',secondaryArea:'net',sharpenRegion:'decisions',
      tags:Object.freeze(['passing-shot','crosscourt','change-direction','drive-volley']),source:'direct',
      decisionAnchors:Object.freeze(['Deep crosscourt — high margin, forces them to stretch','Change direction — drive down the line to the open court','Step in and drive the high volley through the open court']),
      play:Object.freeze({mode:'singles',youStart:[96,235],oppStart:[100,44],youWaypoints:[[96,235],[100,210],[98,196]],oppWaypoints:[[100,44],[45,65],[160,58]],shots:Object.freeze([
        Object.freeze({actor:'opp',from:[100,44],to:[96,235],snd:'ground',label:'Opponent approaches behind a deep ball'}),
        Object.freeze({actor:'you',from:[96,235],to:[45,65],snd:'ground',label:'Deep crosscourt passing shot'}),
        Object.freeze({actor:'opp',from:[45,65],to:[100,210],snd:'volley',label:'Low defensive half-volley'}),
        Object.freeze({actor:'you',from:[100,210],to:[160,58],snd:'ground',label:'Change direction down the line'}),
        Object.freeze({actor:'opp',from:[160,58],to:[98,196],snd:'volley',label:'Slow chest-high float',noBounce:true}),
        Object.freeze({actor:'you',from:[98,196],to:[45,52],snd:'volley',label:'Controlled drive volley to the open court',payoff:true})
      ])})
    }),
    seq_013:Object.freeze({
      sequenceId:'seq_013',conceptId:'short-ball-approach-volley',title:'Recognise short, approach the line, finish the angle',
      insight:'A short ball gives you position, not a free winner. Read the recovery path, approach behind the ball, consolidate the low volley, then use the angle only when the contact rises.',
      replayCue:'Read short. Approach behind it. Earn the finishing angle.',primaryArea:'net',secondaryArea:'decisions',sharpenRegion:'net',
      tags:Object.freeze(['short-ball','approach','net-position','angle-volley']),source:'direct',
      decisionAnchors:Object.freeze(['Approach down the line behind the ball and close in balance','Volley firm and deep through the open half, then continue closing','Use a controlled angle volley into the open court']),
      play:Object.freeze({mode:'singles',youStart:[150,200],oppStart:[100,44],youWaypoints:[[150,200],[100,178],[92,170]],oppWaypoints:[[100,44],[158,54],[44,68]],shots:Object.freeze([
        Object.freeze({actor:'opp',from:[100,44],to:[150,200],snd:'slice',label:'Short ball lands inside the service line'}),
        Object.freeze({actor:'you',from:[150,200],to:[158,54],snd:'ground',label:'Deep down-the-line approach'}),
        Object.freeze({actor:'opp',from:[158,54],to:[100,178],snd:'ground',label:'Crosscourt pass toward the central net position'}),
        Object.freeze({actor:'you',from:[100,178],to:[44,68],snd:'volley',label:'Firm deep first volley through the open half'}),
        Object.freeze({actor:'opp',from:[44,68],to:[92,170],snd:'ground',label:'Defensive floated reply'}),
        Object.freeze({actor:'you',from:[92,170],to:[158,116],snd:'volley',label:'Clean angle volley to open court',payoff:true})
      ])})
    }),
    seq_014:Object.freeze({
      sequenceId:'seq_014',conceptId:'body-serve-jam-plus-one',title:'Jam the hip, then close the cramped reply',
      insight:'A body serve can reduce swing space when the returner shades wide. Test the hip, read the actual return, then move forward only if the reply lands short.',
      replayCue:'Test the hip. Read the reply. Close only on short.',primaryArea:'serve_return',secondaryArea:'net',sharpenRegion:'serve_return',
      tags:Object.freeze(['body-serve','jam','plus-one','volley']),source:'new',
      decisionAnchors:Object.freeze(['Body serve — through the legal service box toward the hip','Approach down the line behind the short ball and follow to net','Firm and deep through the open half — keep the contact simple']),
      play:Object.freeze({mode:'singles',youStart:[100,276],oppStart:[100,34],youWaypoints:[[100,276],[98,202],[152,224]],oppWaypoints:[[100,34],[100,112],[42,56]],shots:Object.freeze([
        Object.freeze({actor:'you',from:[100,276],bounce:[100,112],to:[100,42],snd:'serve',label:'Body serve lands, then reaches the hip'}),
        Object.freeze({actor:'opp',from:[100,42],to:[98,202],snd:'slice',label:'Jammed short return'}),
        Object.freeze({actor:'you',from:[98,202],to:[42,56],snd:'ground',label:'Down-the-line approach'}),
        Object.freeze({actor:'opp',from:[42,56],to:[152,224],snd:'ground',label:'Desperate passing attempt'}),
        Object.freeze({actor:'you',from:[152,224],to:[45,64],snd:'volley',label:'Firm deep volley through the open half',payoff:true})
      ])})
    }),
    seq_015:Object.freeze({
      sequenceId:'seq_015',conceptId:'earn-change-direction',title:'Earn the change before you take it',
      insight:'Direction changes are strongest from balance and inside the court. Keep building crosscourt until a shorter ball gives you the line.',
      replayCue:'Build crosscourt. See short. Change with conviction.',primaryArea:'decisions',secondaryArea:'movement',sharpenRegion:'decisions',
      tags:Object.freeze(['rally-pattern','change-direction','balance','approach']),source:'direct',
      decisionAnchors:Object.freeze(['No — build crosscourt again and look for shorter depth','Drive down the line with net clearance and a safe sideline margin','Approach down the line behind the ball and close in balance']),
      play:Object.freeze({mode:'singles',youStart:[70,292],oppStart:[142,48],youWaypoints:[[70,292],[60,210],[146,178]],oppWaypoints:[[142,48],[150,50],[48,58],[44,62]],shots:Object.freeze([
        Object.freeze({actor:'opp',from:[142,48],to:[70,292],snd:'ground',label:'Heavy crosscourt rally ball'}),
        Object.freeze({actor:'you',from:[70,292],to:[150,50],snd:'ground',label:'Another heavy crosscourt ball'}),
        Object.freeze({actor:'opp',from:[150,50],to:[60,210],snd:'ground',label:'Shorter ball lands inside the baseline'}),
        Object.freeze({actor:'you',from:[60,210],to:[48,58],snd:'ground',label:'Decisive change down the line'}),
        Object.freeze({actor:'opp',from:[48,58],to:[48,198],snd:'slice',label:'Weak defensive slice'}),
        Object.freeze({actor:'you',from:[48,198],to:[44,62],snd:'ground',label:'Down-the-line approach'}),
        Object.freeze({actor:'opp',from:[44,62],to:[146,178],snd:'ground',label:'Passing attempt'}),
        Object.freeze({actor:'you',from:[146,178],to:[154,66],snd:'volley',label:'Volley into the open court',payoff:true})
      ])})
    }),
    seq_016:Object.freeze({
      sequenceId:'seq_016',conceptId:'drop-lob-close',title:'Bring them forward, then use the space behind',
      insight:'From a balanced contact, the drop shot can change a deep opponent’s position. If their momentum continues forward, the lob uses the space behind; the next ball still has to be read.',
      replayCue:'Read deep. Bring them in. Use the space behind.',primaryArea:'decisions',secondaryArea:'net',sharpenRegion:'decisions',
      tags:Object.freeze(['drop-shot','topspin-lob','court-space','close-net']),source:'new',
      decisionAnchors:Object.freeze(['Use a controlled drop shot to test the short court','Topspin lob with depth over the moving player','Use a controlled approach and close behind it']),
      play:Object.freeze({mode:'singles',youStart:[96,238],oppStart:[100,40],youWaypoints:[[96,238],[100,198],[90,210],[145,228]],oppWaypoints:[[100,40],[100,118],[155,20],[45,58]],shots:Object.freeze([
        Object.freeze({actor:'opp',from:[100,40],to:[96,238],snd:'ground',label:'Deep rally ball from behind the baseline'}),
        Object.freeze({actor:'you',from:[96,238],to:[100,118],snd:'slice',label:'Drop shot pulls them forward'}),
        Object.freeze({actor:'opp',from:[100,118],to:[100,198],snd:'slice',label:'Scrambled short pop-up'}),
        Object.freeze({actor:'you',from:[100,198],to:[155,20],snd:'ground',label:'Topspin lob into the space behind'}),
        Object.freeze({actor:'opp',from:[155,20],to:[90,210],snd:'ground',label:'Defensive retrieval from the corner'}),
        Object.freeze({actor:'you',from:[90,210],to:[45,58],snd:'ground',label:'Clean approach into the open court'}),
        Object.freeze({actor:'opp',from:[45,58],to:[145,228],snd:'ground',label:'Last passing attempt'}),
        Object.freeze({actor:'you',from:[145,228],to:[155,62],snd:'volley',label:'Simple volley into the open court',payoff:true})
      ])})
    }),
    seq_017:Object.freeze({
      sequenceId:'seq_017',conceptId:'defend-recover-rebuild',variantOf:'seq_008',title:'Recover before you try to reverse the point',
      insight:'A stretched ball is not your attack. Send it high and deep if the contact allows, recover while it travels, rebuild neutral, and strike only after balance returns.',
      replayCue:'High and deep. Sprint home. Rebuild before attack.',primaryArea:'movement',secondaryArea:'decisions',sharpenRegion:'movement',
      tags:Object.freeze(['defense','recovery','high-deep','transition']),source:'adapted',
      requiresOutsideSingles:true,
      decisionAnchors:Object.freeze(['Use a high, deep crosscourt ball through the longest recovery lane','Rebuild with a solid deep rally ball and wait for the contact to improve','Take it early and drive with margin into the open half']),
      play:Object.freeze({mode:'singles',youStart:[170,244],oppStart:[44,52],youWaypoints:[[170,244],[102,246],[108,210]],oppWaypoints:[[44,52],[46,42],[146,50]],shots:Object.freeze([
        Object.freeze({actor:'opp',from:[44,52],to:[170,244],snd:'ground',label:'Wide attack stretches you off court'}),
        Object.freeze({actor:'you',from:[170,244],to:[46,42],snd:'ground',label:'High deep crosscourt recovery ball'}),
        Object.freeze({actor:'opp',from:[46,42],to:[102,246],snd:'ground',label:'Deep neutral reply'}),
        Object.freeze({actor:'you',from:[102,246],to:[146,50],snd:'ground',label:'Solid deep rally ball after recovery'}),
        Object.freeze({actor:'opp',from:[146,50],to:[108,210],snd:'ground',label:'Mid-depth ball creates the chance'}),
        Object.freeze({actor:'you',from:[108,210],to:[158,58],snd:'ground',label:'Early drive with margin to the open half',payoff:true})
      ])})
    }),
    seq_018:Object.freeze({
      sequenceId:'seq_018',conceptId:'open-then-attack-backhand',title:'Open the forehand side, then attack the backhand',
      insight:'When a player leans to protect a weaker backhand, move them toward the forehand side first. Read the recovery, then use the backhand space only if it opens.',
      replayCue:'Read the lean. Move them first. Attack the space that opens.',primaryArea:'forehand',secondaryArea:'decisions',sharpenRegion:'forehand',
      tags:Object.freeze(['forehand-pattern','weak-wing','inside-in','approach']),source:'direct',
      decisionAnchors:Object.freeze(['Send a controlled forehand wide to move them away from the backhand side','Drive the forehand into the exposed backhand corner with margin','Approach down the line behind the short ball and close the net']),
      play:Object.freeze({mode:'singles',youStart:[110,238],oppStart:[100,44],youWaypoints:[[110,238],[62,232],[96,198],[45,230]],oppWaypoints:[[100,44],[45,48],[160,52],[158,58]],shots:Object.freeze([
        Object.freeze({actor:'opp',from:[100,44],to:[110,238],snd:'ground',label:'Neutral rally ball to the forehand'}),
        Object.freeze({actor:'you',from:[110,238],to:[45,48],snd:'ground',label:'Wide forehand opens the court'}),
        Object.freeze({actor:'opp',from:[45,48],to:[62,232],snd:'ground',label:'Expected crosscourt recovery'}),
        Object.freeze({actor:'you',from:[62,232],to:[160,52],snd:'ground',label:'Forehand into the exposed backhand corner'}),
        Object.freeze({actor:'opp',from:[160,52],to:[96,198],snd:'slice',label:'Weak defensive block'}),
        Object.freeze({actor:'you',from:[96,198],to:[158,58],snd:'ground',label:'Approach behind the same corner'}),
        Object.freeze({actor:'opp',from:[158,58],to:[45,230],snd:'ground',label:'Passing attempt from the backhand'}),
        Object.freeze({actor:'you',from:[45,230],to:[50,65],snd:'volley',label:'Volley into the open court',payoff:true})
      ])})
    }),
    seq_019:Object.freeze({
      sequenceId:'seq_019',conceptId:'break-big-server-pattern',title:'Survive the serve pattern, then take away its advantage',
      insight:'Against a big serve, first improve the contact and put the return deep. Survive the plus-one, then attack only when pace, depth and court position genuinely change.',
      replayCue:'Create space. Block deep. Survive, then read the opening.',primaryArea:'serve_return',secondaryArea:'decisions',sharpenRegion:'serve_return',
      tags:Object.freeze(['big-server','block-return','defense','pattern-disruption']),source:'adapted',
      decisionAnchors:Object.freeze(['Give yourself about a metre more space and use a compact block deep','Defend deep crosscourt through the longer lane and make the server play again','Use the shorter pace and your improved position to drive with margin into the open half']),
      play:Object.freeze({mode:'singles',youStart:[80,288],oppStart:[100,30],youWaypoints:[[80,288],[80,196],[42,248],[98,220]],oppWaypoints:[[100,30],[158,48],[45,52]],shots:Object.freeze([
        Object.freeze({actor:'opp',from:[100,30],bounce:[80,196],to:[80,270],snd:'serve',label:'Big first serve'}),
        Object.freeze({actor:'you',from:[80,270],to:[158,48],snd:'slice',label:'Deep compact chip to the backhand'}),
        Object.freeze({actor:'opp',from:[158,48],to:[42,248],snd:'ground',label:'Heavy forehand plus-one'}),
        Object.freeze({actor:'you',from:[42,248],to:[45,52],snd:'ground',label:'Deep crosscourt defense'}),
        Object.freeze({actor:'opp',from:[45,52],to:[98,220],snd:'ground',label:'Shorter reply after lateral recovery'}),
        Object.freeze({actor:'you',from:[98,220],to:[158,60],snd:'ground',label:'Step-in drive with margin to the open half',payoff:true})
      ])})
    }),
    seq_020:Object.freeze({
      sequenceId:'seq_020',conceptId:'return-low-vs-serve-volley',title:'Make the first volley rise, then use the space behind',
      insight:'Against serve-and-volley, a return at the feet can limit the first volley. If the volley rises and the player keeps closing, the space behind becomes the next read.',
      replayCue:'Return low. Read the close. Use the space behind.',primaryArea:'serve_return',secondaryArea:'net',sharpenRegion:'serve_return',
      tags:Object.freeze(['serve-volley','low-return','half-volley','topspin-lob']),source:'direct',
      decisionAnchors:Object.freeze(["Return low at the incoming player’s feet",'Use a topspin lob with depth over the closing shoulder','Approach through the open court and close behind the ball']),
      play:Object.freeze({mode:'singles',youStart:[68,292],oppStart:[135,8],youWaypoints:[[68,292],[68,190],[96,190],[92,210],[148,178]],oppWaypoints:[[135,8],[100,82],[155,20],[42,58]],motionCues:Object.freeze([{key:'continued-close',actor:'opp',atShot:3,position:[100,130]}]),shots:Object.freeze([
        Object.freeze({actor:'opp',from:[135,8],bounce:[68,190],to:[68,260],snd:'serve',label:'Serve followed immediately to net'}),
        Object.freeze({actor:'you',from:[68,260],to:[100,82],snd:'slice',forceBounce:true,label:'Low return at the incoming feet'}),
        Object.freeze({actor:'opp',from:[100,82],to:[96,190],snd:'volley',label:'Difficult half-volley pops up'}),
        Object.freeze({actor:'you',from:[96,190],to:[155,20],snd:'ground',label:'Topspin lob over the crowded shoulder'}),
        Object.freeze({actor:'opp',from:[155,20],to:[92,210],snd:'ground',label:'Defensive chase from the baseline'}),
        Object.freeze({actor:'you',from:[92,210],to:[42,58],snd:'ground',label:'Approach the now-open net'}),
        Object.freeze({actor:'opp',from:[42,58],to:[148,178],snd:'ground',label:'Final passing attempt'}),
        Object.freeze({actor:'you',from:[148,178],to:[155,62],snd:'volley',label:'Clean volley to open court',payoff:true})
      ])})
    })
  });

  // Predict asks the read, Live Point proves its consequence and the Playbook
  // remembers the pattern. These links are deliberately explicit: a nearby
  // topic is not good enough. When no faithful two-branch Live Point exists,
  // the sequence keeps its validated replay instead of borrowing a mismatch.
  const CONNECTIONS=Object.freeze({
    seq_001:Object.freeze({livePointId:'serve_plus_one',playbookId:'wide_serve',bridge:'Same pattern under 30–all pressure: the wide serve creates a short reply, and the next ball must use the space.',condition:'If the return lands neutral rather than stretched, rebuild the point before forcing the open court.'}),
    seq_002:Object.freeze({livePointId:'second_serve',playbookId:'net_approach',bridge:'Same pressure point: attack a sitting second serve, then let the reply decide whether you have earned the net.',condition:'If the serve kicks above your strike zone or pins you, create space instead of stepping in blindly.'}),
    seq_003:Object.freeze({livePointId:'bring_them_in',playbookId:'drop_lob',bridge:'Transfer the depth read: first push the deep defender back one step farther, then use the short court they concede.',condition:'If the opponent is already inside the baseline, the short ball no longer changes their court position.'}),
    seq_004:Object.freeze({livePointId:'high_ball_backhand',playbookId:'high_ball_backhand',bridge:'Compare both high-backhand answers: take the ball early when depth and balance permit it, or accept the reset when they do not.',condition:'If the moonball lands deep and removes your time, buy space; early contact is earned by depth and balance.'}),
    seq_005:Object.freeze({livePointId:'serving_for_set',playbookId:null,condition:'If the trusted pattern has broken down today, keep the large target but change the pattern before the point.'}),
    seq_006:Object.freeze({livePointId:'big_server',playbookId:null,condition:'If added return depth opens too much angle or worsens contact, move back in smaller increments.'}),
    seq_007:Object.freeze({livePointId:null,playbookId:'poach',condition:'If the returner changes the lane or your serve misses its intended location, the net player must abort the poach.'}),
    seq_008:Object.freeze({livePointId:'defending',playbookId:null,condition:'If the stretched contact cannot create depth, use height and a central target before attempting the long diagonal.'}),
    seq_009:Object.freeze({livePointId:'approach_selection',playbookId:'net_approach',bridge:'Same geometry in motion: choose the approach lane, then solve the first volley that choice creates.',condition:'If contact is late or below net height, improve the ball first rather than treating short depth as automatic permission.'}),
    seq_010:Object.freeze({livePointId:'serve_plus_one',playbookId:'serve_plus_one',bridge:'Transfer the serve-plus-one read to a wide serve: confirm the return, then use the space instead of pre-committing.',condition:'If the familiar central block does not appear, confirm the new return before committing to the plus-one.'}),
    seq_011:Object.freeze({livePointId:'tiebreak_first',playbookId:null,condition:'If your trusted pattern has failed repeatedly in this match, pressure is not a reason to repeat it unchanged.'}),
    seq_012:Object.freeze({livePointId:'passing_shot',playbookId:null,condition:'If the first passing contact sits up and the volleyer is balanced, add margin before searching for the clean line.'}),
    seq_013:Object.freeze({livePointId:'short_ball',playbookId:'short_ball',bridge:'Same short-ball problem: compare the drive and approach paths, then read the reply before choosing the finish.',condition:'If the short ball stays low or catches you late, build the advantage before closing the net.'}),
    seq_014:Object.freeze({livePointId:null,playbookId:'body_serve',condition:'If the body serve misses the hip and gives the returner room, read the reply instead of pre-committing to the jam.'}),
    seq_015:Object.freeze({livePointId:'change_direction',playbookId:'down_the_line',bridge:'Same direction-change trigger: decide what the shorter ball has actually earned, then use the recovery it creates.',condition:'If you are not balanced at contact, preserve the crosscourt margin and earn the change again.'}),
    seq_016:Object.freeze({livePointId:'bring_them_in',playbookId:'drop_lob',condition:'If the opponent is already moving forward, the drop shot feeds their position rather than changing it.'}),
    seq_017:Object.freeze({livePointId:'defending',playbookId:null,condition:'If the defensive ball lands short, recovery time disappears; height without depth is not a reset.'}),
    seq_018:Object.freeze({livePointId:'inside_out_forehand',playbookId:'inside_out',condition:'If the opponent is not leaning to protect the backhand, move them before attacking a space that is not yet open.'}),
    seq_019:Object.freeze({livePointId:'big_server',playbookId:null,condition:'If extra space degrades your return contact, adjust by serve shape rather than retreating by rule.'}),
    seq_020:Object.freeze({livePointId:'passing_shot',playbookId:'pass_or_lob',bridge:'Transfer the net-rusher read: after the player closes, compare the dipping pass with the lob and solve the reply each creates.',condition:'If the server stays back, the low return remains useful but the space behind the closing player no longer exists.'})
  });
  const PLAYBOOK_IDS=Object.freeze(['wide_serve','body_serve','serve_plus_one','down_the_line','inside_out','short_ball','short_angle_finish','net_approach','serve_volley','poach','drop_lob','moonball_approach','high_ball_backhand','pass_or_lob']);
  // Recovery launch set. These are the only Predict journeys allowed to reach a
  // customer until every remaining sequence has both an exact Live Point and an
  // exact Playbook destination. This list mirrors LAUNCH_MANIFEST.json and is
  // checked by the release contract tests.
  const LAUNCH_SEQUENCE_IDS=Object.freeze([
    'seq_001','seq_002','seq_003','seq_004','seq_009','seq_010',
    'seq_013','seq_015','seq_020'
  ]);

  let audio=null;
  let labelTimers=[];

  function esc(value){return String(value==null?'':value).replace(/[&<>\"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[ch]));}
  function today(){
    const d=new Date();
    return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  }
  function loadStore(){
    try{
      const parsed=JSON.parse(localStorage.getItem(STORE_KEY)||'null');
      if(parsed&&parsed.version===STORE_VERSION&&parsed.concepts){parsed.questions=parsed.questions||{};return parsed;}
    }catch(e){}
    return {version:STORE_VERSION,concepts:{},questions:{}};
  }
  function saveStore(store){try{localStorage.setItem(STORE_KEY,JSON.stringify(store));}catch(e){}}
  function contract(sequenceId){return CONTRACTS[sequenceId]||null;}
  function connection(sequenceId){return CONNECTIONS[sequenceId]||null;}
  function launchPlaybookIds(){
    return [...new Set(LAUNCH_SEQUENCE_IDS.map(id=>CONNECTIONS[id]&&CONNECTIONS[id].playbookId).filter(Boolean))];
  }
  function sequenceForPlaybook(playbookId,preferredSequenceId){
    if(preferredSequenceId&&isLaunchEligible(preferredSequenceId)&&CONNECTIONS[preferredSequenceId].playbookId===playbookId)return preferredSequenceId;
    return LAUNCH_SEQUENCE_IDS.find(id=>isLaunchEligible(id)&&CONNECTIONS[id].playbookId===playbookId)||null;
  }
  const PLAYBOOK_PRESENTATION=Object.freeze({
    wide_serve:Object.freeze({title:'Wide Serve + Open Court',tagline:'Move the returner wide, read the actual reply, then use the space.'}),
    serve_plus_one:Object.freeze({title:'Serve +1: Read the Recovery',tagline:'Test the familiar return, confirm it, then play behind the recovery.'}),
    down_the_line:Object.freeze({title:'Down-the-Line Redirect',tagline:'Build the rally until a shorter ball and balance earn the change.'}),
    short_ball:Object.freeze({title:'Attack the Short Ball',tagline:'Use the transition ball, then let the next contact decide the finish.'}),
    net_approach:Object.freeze({title:'Build the Net Approach',tagline:'Follow a suitable approach and read the first volley you actually receive.'}),
    drop_lob:Object.freeze({title:'Bring Them Forward, Read the Reply',tagline:'Change the deep defender’s court. Keep reading after they reach the short ball.'}),
    high_ball_backhand:Object.freeze({title:'Take the High Backhand Early',tagline:'Read depth first: step in only when time and balance support the contact.'}),
    pass_or_lob:Object.freeze({title:'Pass or Lob the Net-Rusher',tagline:'Make the first volley difficult, then use the space the closing player leaves.'})
  });
  function playbookPresentation(id){return Object.prototype.hasOwnProperty.call(PLAYBOOK_PRESENTATION,id)?PLAYBOOK_PRESENTATION[id]:null;}
  function isLaunchEligible(sequenceId){
    if(!LAUNCH_SEQUENCE_IDS.includes(sequenceId))return false;
    const c=contract(sequenceId),link=connection(sequenceId);
    const liveIds=new Set(content&&Array.isArray(content.scenarios)?content.scenarios.map(item=>item.id):[]);
    return !!(c&&link&&link.livePointId&&liveIds.has(link.livePointId)&&link.playbookId&&PLAYBOOK_IDS.includes(link.playbookId)&&!validateContract(c).length);
  }
  function timelineFor(c){return engine&&c?engine.compileTimeline(c.play,{mode:'full',start:.42}):null;}
  function validateContract(c){
    const errors=[];
    if(!c) return ['missing contract'];
    const required=['sequenceId','conceptId','title','insight','replayCue','primaryArea','sharpenRegion','tags','decisionAnchors','play'];
    required.forEach(key=>{if(!c[key]||(Array.isArray(c[key])&&!c[key].length))errors.push(c.sequenceId+': missing '+key);});
    if(c.decisionAnchors&&(
      !Array.isArray(c.decisionAnchors)||
      c.decisionAnchors.length!==3||
      c.decisionAnchors.some(value=>typeof value!=='string'||!value.trim())
    ))errors.push(c.sequenceId+': decision anchors must contain exactly three non-empty choices');
    if(c.primaryArea&&!AREA_LABELS[c.primaryArea]) errors.push(c.sequenceId+': unknown primary area');
    if(c.secondaryArea&&!AREA_LABELS[c.secondaryArea]) errors.push(c.sequenceId+': unknown secondary area');
    if(c.sharpenRegion&&!AREA_LABELS[c.sharpenRegion]) errors.push(c.sequenceId+': unknown Sharpen region');
    if(!['direct','adapted','new'].includes(c.source)) errors.push(c.sequenceId+': invalid source classification');
    if(c.play&&c.play.mode==='doubles'&&(!c.play.partnerStart||!c.play.netOppStart))errors.push(c.sequenceId+': doubles replay needs all four starting roles');
    if(c.requiresOutsideSingles&&c.play){
      const start=c.play.youStart;
      const outside=Array.isArray(start)&&(start[0]<34||start[0]>166);
      if(!outside)errors.push(c.sequenceId+': learning claim requires YOU to start outside the singles sideline');
      const firstArrival=c.play.shots&&c.play.shots[0]&&c.play.shots[0].to;
      if(!Array.isArray(firstArrival)||!outside||Math.hypot(firstArrival[0]-start[0],firstArrival[1]-start[1])>.01){
        errors.push(c.sequenceId+': wide attack must arrive at the authored outside-singles start position');
      }
    }
    if(!engine) errors.push(c.sequenceId+': timeline engine unavailable');
    else{
      const timeline=timelineFor(c);
      engine.validateTimeline(timeline,c.play).forEach(message=>errors.push(c.sequenceId+': '+message));
      const cues=c.play.motionCues||[],required={seq_010:'outward-recovery',seq_020:'continued-close'}[c.sequenceId];
      if(required&&!cues.some(cue=>cue.key===required))errors.push(c.sequenceId+': missing decisive movement '+required);
      cues.forEach(cue=>{
        if(!['you','opp'].includes(cue.actor)||!Number.isInteger(cue.atShot)||!timeline.shots[cue.atShot]||!Array.isArray(cue.position)||cue.position.length!==2||!cue.position.every(Number.isFinite))errors.push(c.sequenceId+': invalid movement event');
        else if(cue.key==='outward-recovery'&&!(cue.actor==='opp'&&cue.atShot===4&&cue.position[0]<c.play.shots[3].from[0]-20&&cue.position[0]<c.play.shots[5].from[0]-20))errors.push(c.sequenceId+': recovery must visibly leave and reverse toward the corner');
        else if(cue.key==='continued-close'&&!(cue.actor==='opp'&&cue.atShot===3&&cue.position[1]>c.play.shots[2].from[1]+20&&cue.position[1]<150))errors.push(c.sequenceId+': continued close must move toward the net');
      });
    }
    return errors;
  }
  function validateAll(){
    const errors=[];
    Object.values(CONTRACTS).forEach(c=>errors.push(...validateContract(c)));
    const liveIds=new Set(content&&Array.isArray(content.scenarios)?content.scenarios.map(item=>item.id):[]);
    Object.keys(CONTRACTS).forEach(sequenceId=>{
      const link=connection(sequenceId);
      if(!link){errors.push(sequenceId+': missing Predict → Live Point → Playbook connection');return;}
      if(!link.condition||typeof link.condition!=='string')errors.push(sequenceId+': missing conditional coaching boundary');
      if(link.livePointId&&!liveIds.has(link.livePointId))errors.push(sequenceId+': linked Live Point does not exist: '+link.livePointId);
      if(link.playbookId&&!PLAYBOOK_IDS.includes(link.playbookId))errors.push(sequenceId+': linked Playbook pattern does not exist: '+link.playbookId);
      if(LAUNCH_SEQUENCE_IDS.includes(sequenceId)){
        if(!link.bridge||typeof link.bridge!=='string'||link.bridge.length<55)errors.push(sequenceId+': launch journey is missing a clear Live Point bridge');
        if(!link.livePointId)errors.push(sequenceId+': launch journey is missing its exact Live Point');
        if(!link.playbookId)errors.push(sequenceId+': launch journey is missing its exact Playbook pattern');
      }
    });
    LAUNCH_SEQUENCE_IDS.forEach(sequenceId=>{
      if(!CONTRACTS[sequenceId])errors.push(sequenceId+': launch manifest references a missing Predict contract');
      if(!isLaunchEligible(sequenceId))errors.push(sequenceId+': launch journey is not end-to-end eligible');
    });
    const byConcept={};
    Object.values(CONTRACTS).forEach(c=>(byConcept[c.conceptId]||(byConcept[c.conceptId]=[])).push(c));
    Object.entries(byConcept).forEach(([conceptId,items])=>{
      if(items.length<2)return;
      const canonical=items.filter(c=>!c.variantOf);
      if(canonical.length!==1){errors.push(conceptId+': repeated concept needs exactly one canonical sequence');return;}
      const base=canonical[0],baseTags=[...base.tags].sort().join('|');
      items.filter(c=>c!==base).forEach(c=>{
        if(c.variantOf!==base.sequenceId)errors.push(c.sequenceId+': variant must point to '+base.sequenceId);
        if(c.primaryArea!==base.primaryArea||c.sharpenRegion!==base.sharpenRegion)errors.push(c.sequenceId+': variant learning route drift');
        if([...c.tags].sort().join('|')!==baseTags)errors.push(c.sequenceId+': variant tag drift');
      });
    });
    return errors;
  }

  function evidenceStage(item){
    if(!item) return 'Not started';
    if(item.retainedAt) return 'Recalled later';
    if(item.counterAt) return 'Counter solved';
    if(item.readAt) return 'Read correctly';
    return 'Seen';
  }
  function evidenceLevel(item){
    if(!item)return 0;
    if(item.retainedAt)return 4;
    if(item.counterAt)return 3;
    if(item.readAt)return 2;
    return item.seenAt?1:0;
  }
  function recordCompletion(sequenceId,score,total){
    const c=contract(sequenceId); if(!c) return null;
    const store=loadStore(), key=c.conceptId, day=today();
    const item=store.concepts[key]||{conceptId:key,sequenceId,primaryArea:c.primaryArea,days:[],bestScore:0,total:Number(total)||3};
    const priorDay=item.days.length&&item.days[0]!==day;
    item.sequenceId=sequenceId; item.primaryArea=c.primaryArea; item.total=Number(total)||item.total||3;
    item.bestScore=Math.max(Number(item.bestScore)||0,Number(score)||0);
    item.lastScore=Number(score)||0; item.lastSeenAt=new Date().toISOString();
    item.days=[day,...(item.days||[]).filter(x=>x!==day)].slice(0,30);
    if(!item.seenAt)item.seenAt=item.lastSeenAt;
    if(item.lastScore>=Math.ceil(item.total*2/3)){
      if(!item.readAt)item.readAt=item.lastSeenAt;
      if(priorDay)item.retainedAt=item.lastSeenAt;
    }
    store.concepts[key]=item; saveStore(store); return item;
  }
  function recordConnected(sequenceId){
    const c=contract(sequenceId); if(!c) return null;
    const store=loadStore(), key=c.conceptId;
    const item=store.concepts[key]||{conceptId:key,sequenceId,primaryArea:c.primaryArea,days:[],bestScore:0,total:3,seenAt:new Date().toISOString()};
    item.replayedAt=new Date().toISOString(); store.concepts[key]=item; saveStore(store); return item;
  }
  function recordLivePoint(sequenceId,scenarioId,ok){
    const c=contract(sequenceId),link=connection(sequenceId);
    if(!c||!link||!link.livePointId||link.livePointId!==scenarioId)return null;
    const store=loadStore(),key=c.conceptId,now=new Date().toISOString();
    const item=store.concepts[key]||{conceptId:key,sequenceId,primaryArea:c.primaryArea,days:[],bestScore:0,total:3,seenAt:now};
    item.livePointAt=now;item.lastLivePointId=scenarioId;item.lastLivePointCorrect=!!ok;
    if(ok&&!item.counterAt)item.counterAt=now;
    store.concepts[key]=item;saveStore(store);return item;
  }
  function playbookProgress(playbookId){
    if(!PLAYBOOK_IDS.includes(playbookId))return null;
    const store=loadStore();
    const sequenceIds=LAUNCH_SEQUENCE_IDS.filter(id=>CONNECTIONS[id].playbookId===playbookId);
    const rows=sequenceIds.map(id=>{
      const c=contract(id),item=c&&store.concepts[c.conceptId];
      return {sequenceId:id,item:item||null,level:evidenceLevel(item)};
    });
    const level=rows.reduce((best,row)=>Math.max(best,row.level),0);
    const next=rows.slice().sort((a,b)=>a.level-b.level||a.sequenceId.localeCompare(b.sequenceId))[0]||null;
    return Object.freeze({
      playbookId,sequenceIds:Object.freeze(sequenceIds),level,label:['Not started','Seen','Read correctly','Counter solved','Recalled later'][level],
      nextSequenceId:next&&next.sequenceId,nextLevel:next?next.level:0,
      seen:rows.filter(row=>row.level>=1).length,read:rows.filter(row=>row.level>=2).length,
      counters:rows.filter(row=>row.level>=3).length,retained:rows.filter(row=>row.level>=4).length
    });
  }
  function playbookSummary(ids){
    const list=(ids||PLAYBOOK_IDS).map(playbookProgress).filter(Boolean);
    return Object.freeze({total:list.length,started:list.filter(x=>x.level>=1).length,read:list.filter(x=>x.level>=2).length,counters:list.filter(x=>x.level>=3).length,retained:list.filter(x=>x.level>=4).length});
  }
  function areaFromQuestion(q){
    if(!q)return null;
    const text=[q.tags,q.module,q.skill_target,q.pillar].filter(Boolean).join(' ').toLowerCase();
    if(/forehand/.test(text))return'forehand';
    if(/backhand/.test(text))return'backhand';
    if(/serve|return/.test(text))return'serve_return';
    if(/net.?play|volley|approach|doubles|poach/.test(text))return'net';
    if(/movement|footwork|position|balance|recovery/.test(text))return'movement';
    if(/mental|pressure|confidence|reset|mindset|focus|emotion/.test(text))return'mindset';
    if(/game.?iq|win more|decision|tactic|pattern|court.?geometry|reading/.test(text))return'decisions';
    return null;
  }
  function recordQuestion(q,ok,source){
    const area=areaFromQuestion(q),id=q&&q.id;if(!area||!id)return null;
    const store=loadStore(),day=today(),key=String(id),now=new Date().toISOString();
    const item=store.questions[key]||{questionId:key,primaryArea:area,days:[],source:source||'module'};
    const priorDay=(item.days||[]).length&&item.days[0]!==day;
    item.primaryArea=area;item.source=source||item.source||'module';item.lastSeenAt=now;item.lastCorrect=!!ok;
    item.days=[day,...(item.days||[]).filter(x=>x!==day)].slice(0,30);
    if(!item.seenAt)item.seenAt=now;
    if(ok){if(!item.readAt)item.readAt=now;if(priorDay)item.retainedAt=now;}
    store.questions[key]=item;saveStore(store);return item;
  }

  function ensureStyles(){
    if(typeof document==='undefined'||document.getElementById('gs-predict-live-styles'))return;
    const style=document.createElement('style'); style.id='gs-predict-live-styles';
    style.textContent=`
      .gspl{margin:8px 0 18px}.gspl-kicker{font:800 9px/1.2 'DM Sans',sans-serif;letter-spacing:1.8px;text-transform:uppercase;color:#c8a84b;margin-bottom:8px}.gspl-title{font:700 18px/1.25 'DM Sans',sans-serif;color:#fff}.gspl-insight{font:400 14px/1.55 'DM Sans',sans-serif;color:rgba(255,255,255,.72);margin-top:7px}.gspl-condition{margin-top:12px;padding:11px 12px;border-left:2px solid rgba(200,168,75,.58);background:rgba(200,168,75,.055);color:rgba(255,255,255,.62);font:500 12px/1.48 'DM Sans',sans-serif}.gspl-condition b{display:block;margin-bottom:3px;color:#c8a84b;font-size:9px;letter-spacing:1.4px;text-transform:uppercase}.gspl-stage{position:relative;margin-top:14px;border-radius:18px;overflow:hidden;background:radial-gradient(circle at 50% 38%,#174f25,#07180d 72%);border:1px solid rgba(116,216,136,.22);box-shadow:0 18px 42px rgba(0,0,0,.25)}.gspl-court{width:min(100%,320px);aspect-ratio:2/3;max-height:480px;margin:auto}.gspl-court svg{width:100%;height:100%;display:block}.gspl-live-label{position:relative;min-height:42px;display:flex;align-items:center;justify-content:center;margin:0 12px 12px;padding:8px 12px;border:1px solid rgba(116,216,136,.32);border-radius:12px;background:rgba(3,14,7,.88);color:#fff;font:700 12px/1.3 'DM Sans',sans-serif;text-align:center}.gspl-controls{display:grid;grid-template-columns:1fr auto;gap:9px;margin-top:10px}.gspl-play,.gspl-sound,.gspl-sharpen,.gspl-live{min-height:48px;border-radius:14px;font:800 12px/1 'DM Sans',sans-serif;letter-spacing:.2px;cursor:pointer}.gspl-live{width:100%;margin-top:14px;border:0;background:linear-gradient(180deg,#6bc37e,#4aa962);color:#071008;box-shadow:0 10px 24px rgba(74,169,98,.18)}.gspl-play{border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.045);color:#fff;padding:0 18px}.gspl-sound{width:48px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);color:#fff}.gspl-sharpen{width:100%;margin-top:9px;border:1px solid rgba(116,216,136,.28);background:rgba(116,216,136,.08);color:#8ee39d;padding:0 16px}.gspl-evidence{margin-top:9px;color:rgba(255,255,255,.46);font:600 10px/1.4 'DM Sans',sans-serif}.gspl-error{padding:18px;color:rgba(255,255,255,.64);font:600 12px/1.5 'DM Sans',sans-serif;text-align:center}.gspl-profile-card{margin:0 0 22px;padding:16px 18px;border:1px solid rgba(116,216,136,.17);border-radius:16px;background:rgba(116,216,136,.05)}.gspl-profile-head{display:flex;justify-content:space-between;gap:12px;align-items:baseline}.gspl-profile-title{font:800 16px/1.2 'DM Sans',sans-serif;color:#fff}.gspl-profile-meta{font:700 10px/1.2 'DM Sans',sans-serif;color:#8ee39d}.gspl-profile-copy{margin-top:6px;color:rgba(255,255,255,.52);font:400 12px/1.45 'DM Sans',sans-serif}.gspl-area-list{display:grid;gap:11px;margin-top:14px}.gspl-area-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:5px 12px;align-items:center}.gspl-area-name{color:rgba(255,255,255,.82);font:700 12px/1.2 'DM Sans',sans-serif}.gspl-area-state{color:rgba(255,255,255,.48);font:600 10px/1.2 'DM Sans',sans-serif}.gspl-stage-track{grid-column:1/-1;display:grid;grid-template-columns:repeat(4,1fr);gap:4px}.gspl-stage-pip{height:3px;border-radius:4px;background:rgba(255,255,255,.10)}.gspl-stage-pip.on{background:#74d888}.gspl-stage-pip.connected{background:#c8a84b}
      .gspl-replay{margin-top:10px;border-top:1px solid rgba(255,255,255,.08)}.gspl-replay summary{min-height:46px;display:flex;align-items:center;justify-content:space-between;color:rgba(255,255,255,.68);font:700 11px/1.2 'DM Sans',sans-serif;cursor:pointer;list-style:none}.gspl-replay summary::-webkit-details-marker{display:none}.gspl-replay summary:after{content:'＋';color:#c8a84b;font-size:16px}.gspl-replay[open] summary:after{content:'−'}.gspl-live-status{display:block;margin-top:7px;color:#8ee39d;font:700 10px/1.3 'DM Sans',sans-serif}
      .gspl-playbook{margin:0}.gspl-playbook .gspl-stage{margin-top:0}.gspl-playbook .gspl-controls{margin:10px 12px 12px}.gspl-playbook .gspl-court{max-height:420px}.gspl-playbook-note{padding:0 14px 13px;color:rgba(255,255,255,.58);font:600 11px/1.45 'DM Sans',sans-serif}
      @media(max-width:390px){.gspl-court{max-height:420px}.gspl-title{font-size:16px}}
      @media(prefers-reduced-motion:reduce){.gspl *{animation:none!important;transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function actorTrack(c,timeline,actor,start){
      const contacts=timeline.shots.filter(item=>item.shot.actor===actor).map(item=>({at:item.contactAt,p:item.shot.from}));
      (c.play.motionCues||[]).filter(cue=>cue.actor===actor).forEach(cue=>contacts.push({at:timeline.shots[cue.atShot].contactAt,p:cue.position,key:cue.key}));
      contacts.sort((a,b)=>a.at-b.at);
      const first=start||c.play[actor+'Start']||(contacts[0]&&contacts[0].p)||[100,150],points=[{at:0,p:first}];
      contacts.forEach(contact=>{
        const prior=points[points.length-1],distance=Math.hypot(contact.p[0]-prior.p[0],contact.p[1]-prior.p[1]);
        const travel=Math.min(.85,Math.max(.28,distance/75));
        const moveAt=Math.max(prior.at,contact.at-travel);
        if(moveAt>prior.at+.001)points.push({at:moveAt,p:prior.p});
        if(contact.at>points[points.length-1].at+.001)points.push(contact);
        else points[points.length-1]={at:contact.at,p:contact.p};
      });
      if(points[points.length-1].at<timeline.total)points.push({at:timeline.total,p:points[points.length-1].p});
      return points;
  }
  function courtSvg(c,timeline,reduced){
    function marker(actor,label,color,start){
      const points=actorTrack(c,timeline,actor,start),first=points[0].p;
      const final=points[points.length-1].p;
      if(reduced)return`<g transform="translate(${final[0]} ${final[1]})"><circle r="5" fill="${color}" stroke="#fff" stroke-width="1"/><text y="-8" text-anchor="middle" fill="rgba(255,255,255,.76)" font-size="6" font-family="DM Sans,sans-serif">${label}</text></g>`;
      const values=points.map(x=>x.p.join(' ')).join(';'),keyTimes=points.map(x=>Math.max(0,Math.min(1,x.at/timeline.total)).toFixed(4)).join(';');
      return`<g transform="translate(${first[0]} ${first[1]})"><animateTransform attributeName="transform" type="translate" values="${values}" keyTimes="${keyTimes}" dur="${timeline.total}s" fill="freeze" calcMode="linear"/><circle r="5" fill="${color}" stroke="#fff" stroke-width="1"/><text y="-8" text-anchor="middle" fill="rgba(255,255,255,.76)" font-size="6" font-family="DM Sans,sans-serif">${label}</text></g>`;
    }
    const paths=timeline.shots.map((item,i)=>{
      const shot=item.shot,from=shot.from,to=shot.to,bounce=item.landing;
      const curve=(a,b,offset)=>`M ${a[0]} ${a[1]} Q ${(a[0]+b[0])/2+offset} ${(a[1]+b[1])/2} ${b[0]} ${b[1]}`;
      const d1=curve(from,bounce||to,i%2?7:-7),d2=bounce?curve(bounce,to,i%2?-4:4):'';
      const d=bounce?d1+' '+d2.replace(/^M[^Q]+/,''):d1;
      const color=shot.payoff?'#75df8a':shot.actor==='you'?'#d7b650':'#ee7777';
      const moving=(path,begin,duration)=>`<circle r="3.6" fill="#e8f25a" stroke="#fff" stroke-width=".7" opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.86;1" begin="${begin}s" dur="${duration}s" fill="freeze"/><animateMotion path="${path}" begin="${begin}s" dur="${duration}s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".22 .65 .32 1"/></circle>`;
      let balls='';
      if(!reduced&&bounce){
        const before=(item.bounceAt-item.contactAt).toFixed(3),after=(item.arrivalAt-item.bounceAt).toFixed(3);
        balls=moving(d1,item.contactAt,before)+moving(d2,item.bounceAt,after);
      }else if(!reduced)balls=moving(d1,item.contactAt,item.flightDuration);
      return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${shot.payoff?2.5:1.5}" stroke-linecap="round" opacity="${reduced?(shot.payoff?.82:.18):0}"/>${balls}`;
    }).join('');
    const final=timeline.shots[timeline.shots.length-1].shot.to;
    const players=marker('you','YOU','#d7b650',c.play.youStart)+marker('opp','OPP','#ee7777',c.play.oppStart)+(c.play.mode==='doubles'?marker('partner','PARTNER','#75df8a',c.play.partnerStart)+`<g transform="translate(${c.play.netOppStart[0]} ${c.play.netOppStart[1]})"><circle r="4.5" fill="#ef9a9a" stroke="#fff" stroke-width="1"/><text y="-8" text-anchor="middle" fill="rgba(255,255,255,.68)" font-size="5.5" font-family="DM Sans,sans-serif">NET OPP</text></g>`:'');
    return `<svg viewBox="0 0 200 300" role="img" aria-label="Illustrative full-point replay: ${esc(c.replayCue)}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="gsplGrass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#174d25"/><stop offset="1" stop-color="#092612"/></linearGradient></defs>
      <rect x="0" y="0" width="200" height="300" fill="url(#gsplGrass)"/>
      <g fill="none" stroke="rgba(231,239,224,.72)" stroke-width="1.5"><rect x="20" y="10" width="160" height="280"/><line x1="20" y1="150" x2="180" y2="150" stroke-width="3"/><line x1="34" y1="80" x2="166" y2="80"/><line x1="34" y1="220" x2="166" y2="220"/><line x1="34" y1="10" x2="34" y2="290"/><line x1="166" y1="10" x2="166" y2="290"/><line x1="100" y1="80" x2="100" y2="220"/></g>
      <g stroke="rgba(255,255,255,.28)" stroke-width=".55"><line x1="20" y1="146" x2="180" y2="146"/><line x1="20" y1="154" x2="180" y2="154"/></g>
      ${paths}${players}<circle cx="${final[0]}" cy="${final[1]}" r="7" fill="none" stroke="#75df8a" stroke-width="2" opacity="${reduced?.9:0}">${reduced?'':`<animate attributeName="opacity" from="0" to="1" begin="${(timeline.total-.34).toFixed(2)}s" dur=".18s" fill="freeze"/><animate attributeName="r" values="3;8;6" begin="${(timeline.total-.34).toFixed(2)}s" dur=".42s" fill="freeze"/>`}</circle>
    </svg>`;
  }

  function resultMarkup(sequenceId){
    const c=contract(sequenceId); if(!c)return'';
    if(!isLaunchEligible(sequenceId))return`<section class="gspl"><div class="gspl-error">This pattern is being rebuilt and is not available in this release.</div></section>`;
    const errors=validateContract(c);
    if(errors.length)return`<section class="gspl"><div class="gspl-error">Whole-point replay held back: its learning contract did not validate.</div></section>`;
    const link=connection(sequenceId);
    const item=loadStore().concepts[c.conceptId];
    const poster=courtSvg(c,timelineFor(c),true);
    const liveCta=`<button class="gspl-live" type="button" onclick="gsOpenPredictLivePoint('${esc(sequenceId)}')">Continue to Live Point →</button><span class="gspl-live-status" id="gsplLiveStatus-${esc(sequenceId)}">${item&&item.livePointAt?(item.lastLivePointCorrect?'Counter solved · replay or compare the other line':'Counter seen · solve it again when ready'):'Play the consequence, compare the other line, then keep the pattern.'}</span>`;
    return `<section class="gspl" aria-labelledby="gsplTitle-${esc(sequenceId)}">
      <div class="gspl-kicker">Connect the calls</div><div class="gspl-title" id="gsplTitle-${esc(sequenceId)}">The point is not over</div>
      <div class="gspl-insight">${esc(c.insight)}</div>
      <div class="gspl-condition"><b>Next: test the read</b>${esc(link.bridge)}</div>
      <div class="gspl-condition"><b>What changes the call</b>${esc(link&&link.condition||'The best answer changes when contact quality, balance or opponent position changes.')}</div>
      ${liveCta}
      <details class="gspl-replay"><summary>Watch the whole point</summary><div class="gspl-stage" aria-label="Whole point: ${esc(c.title)}"><div class="gspl-court" id="gsplCourt-${esc(sequenceId)}">${poster}</div><div class="gspl-live-label" id="gsplLabel-${esc(sequenceId)}" aria-live="polite">${esc(c.replayCue)}</div></div><div class="gspl-controls"><button class="gspl-play" type="button" onclick="GSPredictLive.play('${esc(sequenceId)}')">▶ Play the whole point</button><button class="gspl-sound" type="button" aria-label="Toggle natural court sound" onclick="GSPredictLive.toggleSound(this)">♪</button></div></details>
      <button class="gspl-sharpen" type="button" onclick="GSPredictLive.openSharpen('${esc(sequenceId)}')">Sharpen ${esc(AREA_LABELS[c.primaryArea])} →</button>
      <div class="gspl-evidence" id="gsplEvidence-${esc(sequenceId)}">Progress: ${esc(evidenceStage(item))}. Seen → read correctly → counter solved → recalled later. No claim of stroke mastery.</div>
    </section>`;
  }

  function playbookMarkup(playbookId,preferredSequenceId){
    ensureStyles();
    const sequenceId=sequenceForPlaybook(playbookId,preferredSequenceId),c=contract(sequenceId);
    if(!sequenceId||!c||!isLaunchEligible(sequenceId))return'';
    const timeline=timelineFor(c),reduced=!!(root.matchMedia&&root.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const instanceId='pb-'+playbookId+'-'+sequenceId;
    const poster=courtSvg(c,timeline,true);
    return `<div class="gspl gspl-playbook" data-sequence-id="${esc(sequenceId)}">
      <div class="gspl-stage" aria-label="Court-map pattern: ${esc(c.title)}"><div class="gspl-court" id="gsplCourt-${esc(instanceId)}">${poster}</div><div class="gspl-live-label" id="gsplLabel-${esc(instanceId)}" aria-live="polite">${esc(reduced?c.insight:c.replayCue)}</div></div>
      <div class="gspl-controls"><button class="gspl-play" type="button" onclick="GSPredictLive.play('${esc(sequenceId)}','${esc(instanceId)}',true)">▶ Replay the pattern</button><button class="gspl-sound" type="button" aria-label="Toggle natural court sound" onclick="GSPredictLive.toggleSound(this)">♪</button></div>
      <div class="gspl-playbook-note">${esc(c.insight)}</div>
    </div>`;
  }

  function refreshEvidence(sequenceId){
    const c=contract(sequenceId);if(!c||typeof document==='undefined')return null;
    const item=loadStore().concepts[c.conceptId]||null,stage=evidenceStage(item);
    const evidence=document.getElementById('gsplEvidence-'+sequenceId);
    if(evidence)evidence.textContent='Progress: '+stage+'. Seen → read correctly → counter solved → recalled later. No claim of stroke mastery.';
    const live=document.getElementById('gsplLiveStatus-'+sequenceId);
    if(live&&item&&item.livePointAt)live.textContent=item.lastLivePointCorrect?'Counter solved · replay or compare the other line':'Counter seen · solve it again when ready';
    return item;
  }

  function clearTimers(){labelTimers.forEach(clearTimeout);labelTimers=[];}
  function play(sequenceId,instanceId,withSound){
    ensureStyles(); const c=contract(sequenceId),key=instanceId||sequenceId,host=typeof document!=='undefined'&&document.getElementById('gsplCourt-'+key),label=typeof document!=='undefined'&&document.getElementById('gsplLabel-'+key);
    if(!c||!host||!engine)return false;
    const timeline=timelineFor(c),errors=validateContract(c); if(errors.length){host.innerHTML='<div class="gspl-error">Replay unavailable until its contract passes validation.</div>';return false;}
    const reduced=!!(root.matchMedia&&root.matchMedia('(prefers-reduced-motion: reduce)').matches);
    clearTimers(); if(audio)audio.stop();
    host.innerHTML=courtSvg(c,timeline,reduced);
    if(label)label.textContent=reduced?c.insight:c.replayCue;
    if(!reduced){
      if(withSound!==false){
        if(!audio)audio=engine.createAudioEngine({storageKey:'gs_sound_on'});
        audio.schedule(timeline);
      }
      timeline.shots.forEach(item=>labelTimers.push(setTimeout(()=>{if(label)label.textContent=item.shot.label;},Math.max(0,item.contactAt*1000))));
      labelTimers.push(setTimeout(()=>{if(label)label.textContent=c.insight;},timeline.total*1000));
    }
    const item=recordConnected(sequenceId),evidence=typeof document!=='undefined'&&document.getElementById('gsplEvidence-'+sequenceId);
    if(evidence)evidence.textContent='Progress: '+evidenceStage(item)+'. Seen → read correctly → counter solved → recalled later. No claim of stroke mastery.';
    try{if(typeof root.trackEvent==='function')root.trackEvent('predict_live_replayed',{id:sequenceId,concept:c.conceptId});}catch(e){}
    return true;
  }
  function toggleSound(button){
    if(!audio)audio=engine&&engine.createAudioEngine({storageKey:'gs_sound_on'});
    const enabled=audio?audio.toggle():false;
    if(button){button.textContent=enabled?'♪':'×';button.setAttribute('aria-label',enabled?'Mute natural court sound':'Turn on natural court sound');}
    try{if(typeof root.gsSyncSoundChips==='function')root.gsSyncSoundChips();}catch(e){}
    return enabled;
  }
  function openSharpen(sequenceId){
    const c=contract(sequenceId);if(!c)return false;
    const coach=root.GameSharpPainCoach;
    if(coach&&typeof coach.openRegion==='function'){
      coach.openRegion(c.sharpenRegion,'predict-live');
      try{if(typeof root.trackEvent==='function')root.trackEvent('predict_live_sharpen_clicked',{id:sequenceId,region:c.sharpenRegion});}catch(e){}
      return true;
    }
    if(coach&&typeof coach.open==='function'){coach.open('sharpen');return true;}
    return false;
  }
  function profileMarkup(){
    const store=loadStore(),concepts=Object.values(store.concepts||{}),questions=Object.values(store.questions||{});if(!concepts.length&&!questions.length)return'';
    const rows=Object.entries(AREA_LABELS).map(([area,label])=>{
      const c=concepts.filter(x=>x.primaryArea===area),q=questions.filter(x=>x.primaryArea===area),all=[...c,...q];
      const seen=all.length,read=all.filter(x=>x.readAt).length,counters=c.filter(x=>x.counterAt).length,retained=all.filter(x=>x.retainedAt).length;
      const stage=retained?4:counters?3:read?2:seen?1:0;
      const state=stage===4?'Recalled later':stage===3?'Counter solved':stage===2?'Reads building':stage===1?'Explored':'Start here';
      const pips=[1,2,3,4].map(n=>`<span class="gspl-stage-pip${stage>=n?' on':''}${n===3&&stage>=3?' connected':''}"></span>`).join('');
      return `<div class="gspl-area-row"><span class="gspl-area-name">${esc(label)}</span><span class="gspl-area-state">${state}${seen?' · '+seen+' read'+(seen===1?'':'s'):''}</span><span class="gspl-stage-track" aria-label="${esc(label)} evidence stage: ${state}">${pips}</span></div>`;
    }).join('');
    const counters=concepts.filter(x=>x.counterAt).length,retained=[...concepts,...questions].filter(x=>x.retainedAt).length;
    return `<div class="phub-section"><div class="phub-section-eyebrow">Decision evidence—not a claim of stroke mastery</div><div class="phub-section-title">Your learning trail</div><div class="gspl-profile-card"><div class="gspl-profile-head"><span class="gspl-profile-title">${concepts.length} pattern${concepts.length===1?'':'s'} · ${questions.length} question read${questions.length===1?'':'s'}</span><span class="gspl-profile-meta">${counters} counter${counters===1?'':'s'} solved${retained?' · '+retained+' recalled':''}</span></div><div class="gspl-profile-copy">Seen → read correctly → counter solved in Live Point → recalled on a later day. Progress reflects decisions, not physical stroke mastery.</div><div class="gspl-area-list">${rows}</div></div></div>`;
  }

  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureStyles,{once:true});else ensureStyles();
    const errors=validateAll();document.documentElement.dataset.gsPredictLiveContract=errors.length?'fail':'ok';
    if(errors.length)console.error('[GAMESHARP PREDICT LIVE] Contract failed',errors);
  }
  return Object.freeze({CONTRACTS,CONNECTIONS,PLAYBOOK_IDS,LAUNCH_SEQUENCE_IDS,AREA_LABELS,contract,connection,isLaunchEligible,launchPlaybookIds,sequenceForPlaybook,playbookPresentation,actorTrack,timelineFor,validateContract,validateAll,recordCompletion,recordConnected,recordLivePoint,playbookProgress,playbookSummary,areaFromQuestion,recordQuestion,resultMarkup,playbookMarkup,refreshEvidence,play,toggleSound,openSharpen,profileMarkup,evidenceStage});
});
