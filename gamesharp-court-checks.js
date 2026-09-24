(function (root, factory) {
  const forehand = typeof module === 'object' && module.exports ? require('./gamesharp-forehand-check.js') : root && root.GameSharpForehandCheck;
  const api = factory(forehand, root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GameSharpCourtChecks = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (forehand, root) {
  'use strict';

  const version = '2026-09-21.court-checks.3';
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  function freeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }
  const boolOptions = [['true', 'Yes, similar enough to compare'], ['false', 'No—or I’m not sure']];
  const disclosure = 'Source-informed beta practice idea. Independent coach review is pending. This is an observation, not a diagnosis or a guaranteed fix.';
  const common = {version:1, status:'provisional_beta', coachReview:'pending', coachApproved:false, storage:'shared', disclosure};
  const countOptions = Array.from({length:11}, (_, i) => [String(i), String(i)]);

  // The accepted forehand content remains owned by its original module. The
  // registry supplies a presentation adapter; it does not rewrite the protocol,
  // interpretation, evidence audit, storage identity or existing saved records.
  function adaptForehand() {
    if (!forehand || !forehand.definition || typeof forehand.audit !== 'function' || typeof forehand.interpret !== 'function') return null;
    const f = forehand.definition;
    return Object.assign({}, f, {
      coachApproved:false, storage:'forehand', region:'forehand', pathId:'forehand_crowded_contact',
      label:'My forehand keeps missing', invitation:'See how different misses can share one contact clue.', cta:'Try a 20-ball court check →',
      recognition:{
        title:'Does that contact feel familiar?', lead:'Think of several similar forehands—not just one miss. The example does not diagnose your stroke.',
        yes:{label:'Yes, the ball often crowds me', detail:'Explore one small adjustment on court.'},
        unsure:{label:'I’m not sure yet', detail:'Check the contact before changing anything.', title:'Find out before changing your swing.', lead:'At your next hit, ask a partner or coach to watch ten comfortable forehands.', body:'Does the ball repeatedly crowd your hitting side at contact? Keep your usual swing while they watch. No stroke change is prescribed here.'},
        no:{label:'No, I already have comfortable room', detail:'Don’t force a spacing fix that may not fit.', title:'Then don’t force extra space.', lead:'A miss can have several causes. This spacing experiment may not address yours.', body:'Ask a coach to compare several similar misses and successful forehands. Bring the situation and the misses—not an assumed fault. No stroke change is prescribed here.'}
      },
      plan:{title:f.shortTitle, lead:'A practice experiment—not a promise to fix your forehand.', setup:f.setup, blocks:[
        {number:'10', label:'forehands', title:'1 · Your usual approach', body:f.usualBlock},
        {number:'10', label:'forehands', title:'2 · One cue', body:f.cueBlock, cue:f.cue}
      ], counting:f.counting, boundary:f.limits[0] + ' ' + f.limits[1]},
      report:{title:'What happened on court?', lead:'Record your first comparison. A lesson replay does not count as this experiment.', cta:'I’ve tried both groups—record what happened', countLegend:'Misses out of ten', countHint:'Count every net or out ball—not just your original miss.', fields:[
        {name:'beforeMisses', label:'Usual approach', type:'count', options:countOptions, min:0, max:10},
        {name:'afterMisses', label:'With the cue', type:'count', options:countOptions, min:0, max:10},
        {name:'spacing', label:'How did contact feel?', type:'enum', options:[['more-room','More comfortable room'],['same','About the same'],['unsure','I’m not sure']]},
        {name:'comparable', label:'Were feed, target and hitting pace similar?', type:'boolean', options:boolOptions}
      ], hint:'Your report is not a technique score. Nothing is recorded until you save.'}
    });
  }

  const returnCheck = Object.assign({}, common, {
    id:'return-position-check-v1', lessonId:'gold_return_position_v1', spineId:'return_position_is_dial', region:'serve_return', pathId:'serve_return_crowded',
    label:'Fast serves rush my return', invitation:'See what one step back can buy—and when the dial should turn forward.', cta:'Try a return-position check →',
    recognition:{
      title:'Is a fast serve taking your time away?', lead:'Think of repeated fast first serves. Standing deeper is a test, not a permanent answer.',
      yes:{label:'Yes, fast serves repeatedly rush me', detail:'Compare two starts against similar serves.'},
      unsure:{label:'I’m not sure which serves rush me', detail:'Notice the serve before moving your start.', title:'First, notice when the rush happens.', lead:'At your next return practice, keep your usual starting position.', body:'Ask a partner or coach to help notice whether the rushed returns follow fast first serves or slower serves. If it is unclear, keep observing; no position change is prescribed here.'},
      no:{label:'No, I have time but the return still misses', detail:'A deeper start may not address that problem.', title:'Extra time may not be the missing piece.', lead:'This lesson does not diagnose your return technique.', body:'Ask a coach to compare several similar returns and the actual contact. Do not move farther back just because a return missed. A slower serve may instead allow a balanced earlier contact.'}
    },
    plan:{title:'Turn the return dial once', lead:'Compare the time you feel—not the points you win.',
      setup:'Warm up with a partner who can repeat a manageable fast first serve to the same broad lane. Leave safe space behind you. Use the same generous return target and intended pace.',
      blocks:[
        {number:'1', label:'pair', title:'Usual start, then one step back', body:'Return one legal serve from your usual start. Return a similar serve from one comfortable step deeper. Change the start before the serve, not by retreating during it.', cue:'Next time a first serve jams you, test one deliberate step deeper.'},
        {number:'3', label:'pairs total', title:'Look for a repeatable trade', body:'Repeat that pair twice more—three pairs in total, with six return attempts against comparable legal serves. After each pair, notice time at contact, net/out misses and whether the return lands shorter. Do not count a clearly different serve as a comparison.'}
      ], counting:'More time is not a free win: notice extra misses or shorter returns as well. Mixed observations can be recorded as “not sure”.',
      boundary:'Do not copy a professional’s extreme depth or keep backing up. Stop if space or comfort is limited. A slower serve can reverse the choice; this is not a rule for every return.'},
    report:{title:'What changed from the deeper start?', lead:'Report the three pairs you tried, not the lesson result.', cta:'I’ve tried the pairs—record what happened', fields:[
      {name:'contact', label:'Compared with your usual start, time at contact felt…', summaryLabel:'Time at contact', type:'enum', options:[['more-time','Less rushed'],['same','About the same'],['less-time','More rushed'],['unsure','Mixed—or I’m not sure']]},
      {name:'cost', label:'Did you notice a cost from deeper?', summaryLabel:'Trade-off', type:'enum', options:[['none-noticed','No extra misses or shorter returns noticed'],['more-misses','More net or out misses'],['shorter-returns','Shorter returns'],['both','Both more misses and shorter returns'],['unsure','Mixed—or I’m not sure']]},
      {name:'comparable', label:'Were serves, return target and intended pace similar?', summaryLabel:'Conditions', type:'boolean', options:boolOptions}
    ], hint:'This records your observations, not measured reaction time or a technique score.'},
    sources:[{
      id:'atp-medvedev-return-depth', publisher:'ATP Tour', author:'Craig O’Shannessy', title:'The Hidden Benefit Of Medvedev’s Deep Return Stance',
      url:'https://www.atptour.com/en/news/medvedev-infosys-beyond-the-numbers-august-2023', verifiedOn:'2026-09-14',
      supports:'Analysis of Medvedev’s first-serve returning describes how deeper positioning buys time while conceding court.',
      boundary:'Elite observational analysis, not evidence that a recreational player should copy his distance or that this six-return practice is effective.'
    },{
      id:'usta-first-second-return', publisher:'USTA', title:'Tennis strategy: Returning first and second serves',
      url:'https://www.usta.com/en/home/improve/tips-and-instruction/national/tennis-strategy--returning-first-and-second-serves.html', verifiedOn:'2026-09-14',
      supports:'First-serve return margin and a different attacking intention on second serves.',
      boundary:'The lesson narrows the forward move to a slower serve that permits balanced contact. Neither this source nor the lesson validates this practice protocol.'
    }],
    limits:['Use a manageable practice serve, not added speed to manufacture failure.', 'The same serve cannot be reproduced perfectly. Changed conditions or unclear observations are inconclusive.', 'Time felt at contact is self-report; the lesson schematic does not measure improved body spacing.', 'Three pairs cannot establish a cause, a best permanent position or lasting match improvement.'],
    adaptation:'GameSharp’s three alternating pairs, one-step limit, cost check and interpretation are an original beta adaptation of the lesson’s time-versus-position distinction. They are not an ATP, USTA or independently coach-validated protocol.'
  });

  const mentalCheck = Object.assign({}, common, {
    id:'next-point-reset-check-v1', lessonId:'gold_miss_two_points_v1', spineId:'mental_miss_steals_next_point', region:'mindset', pathId:'mindset_after_miss',
    label:'One miss leads to another', invitation:'Watch whether the last miss changes your next decision.', cta:'Try a next-point reset check →',
    recognition:{
      title:'Does one miss change your next decision?', lead:'Two misses alone do not prove a mental cause. Look for a change in your plan or preparation.',
      yes:{label:'Yes, I rush or abandon my next-ball plan', detail:'Try one clear job before the next point.'},
      unsure:{label:'I’m not sure what changes', detail:'Notice your next preparation, not just the score.', title:'Notice the decision after the miss.', lead:'During your next practice points, leave your normal routine alone.', body:'After a natural miss, notice whether you skip your preparation or choose a different target only because of the miss. A changed incoming ball can justify a changed plan. No reset problem is assumed.'},
      no:{label:'No, I keep my plan but still miss', detail:'Do not call every repeated miss a mental fault.', title:'Then this may be a different problem.', lead:'A clear plan does not guarantee a successful stroke.', body:'Keep decisions responsive to the actual ball. If comparable misses repeat, ask a coach to watch them rather than blaming your mindset or rebuilding your swing during a point.'}
    },
    plan:{title:'Give the next ball one job', lead:'The check is whether you restore a clear intention—not whether you win.',
      setup:'Try this during normal practice points. Wait for a natural miss; do not deliberately miss to create a test. Use your usual between-point pause and keep play moving.',
      blocks:[
        {number:'1', label:'pause', title:'Let the previous point finish', body:'In your normal pause, breathe and choose one useful job for the upcoming point. Do not rehearse a new swing.', cue:'Next time you miss, name the next ball’s job before changing your swing.'},
        {number:'1', label:'point', title:'Take the job into the next point', body:'Choose a simple intention such as a generous crosscourt target when the ball permits it. Adapt if the incoming ball changes. Afterwards, notice whether your intention was clear—not whether the shot went in.'}
      ], boundary:'This is not a promise to remove frustration or prevent another miss. The actual ball can change the job. If no natural opportunity occurs, report that; do not manufacture one.'},
    report:{title:'What happened after the miss?', lead:'Record one practice opportunity. A point result is not a reset score.', cta:'I’ve taken this to court—record what happened', fields:[
      {name:'opportunity', label:'What opportunity did you have?', summaryLabel:'Opportunity', type:'enum', options:[['comparable-ball','A natural miss, then a ball that allowed my intended job'],['different-ball','A natural miss, but the next ball changed the job'],['no-miss','No natural post-miss opportunity'],['unsure','I’m not sure']]},
      {name:'routine', label:'Did you use the pause and name a next-ball job?', summaryLabel:'Routine', type:'enum', options:[['used','Yes'],['not-used','No'],['unsure','I’m not sure—or no opportunity']]},
      {name:'intention', label:'As the next point began, was your intention clear?', summaryLabel:'Intention', type:'enum', options:[['clear','Clear'],['unclear','Unclear'],['unsure','I’m not sure—or no opportunity']]}
    ], hint:'A clear intention can be followed by a miss. This check does not record point wins, infer confidence or diagnose technique.'},
    sources:[{
      id:'usta-between-point-focus', publisher:'USTA', author:'Dr. Larry Lauer', title:'Maintain Focus & Concentration During a Match',
      url:'https://www.usta.com/en/home/improve/tips-and-instruction/national/how-to-stay-focused-during-a-match.html', verifiedOn:'2026-09-14',
      supports:'Between-point routines include recovery, refocusing on the upcoming point and preparation around a clear game plan.',
      boundary:'General coaching guidance, not evidence that this one-point observation prevents errors or proves psychological change.'
    }],
    limits:['Do not create an error to start the check or delay normal play.', 'A job is an intention, not a fixed shot to force against every incoming ball.', 'Repeated similar misses may deserve separate technical observation; they are not automatically a mindset fault.', 'One self-report does not establish a new habit, emotional control, mental health or lasting improvement.'],
    adaptation:'GameSharp simplifies the sourced between-point routine to one natural post-miss opportunity and three process observations. This exact beta check and its interpretation are an original adaptation, not an independently coach-validated protocol.'
  });

  const volleyCheck = Object.assign({}, common, {
    id:'approach-volley-check-v1', lessonId:'gold_approach_volley_v1', spineId:'net_volley_started_at_baseline', region:'net', pathId:'net_first_volley',
    label:'My first volley is always difficult', invitation:'Look one shot earlier: their contact, then your first volley.', cta:'Try an approach-to-volley check →',
    recognition:{
      title:'Do they step in before your low first volley?', lead:'A difficult volley can start with the approach—but it can also have another cause.',
      yes:{label:'Yes, my approach lets them contact inside court', detail:'Compare depth without changing your volley technique.'},
      unsure:{label:'I’m not sure where they make contact', detail:'Watch the shot before the volley first.', title:'Watch their contact before changing your volley.', lead:'Ask a partner or coach to watch your next few ordinary approach points.', body:'Where do they contact your approach, and how high is your first volley? Note both, including approaches that miss or produce no volley. Do not assume your hands—or your approach—are the fault.'},
      no:{label:'No, they stay back and my volley is still difficult', detail:'Approach depth may not be the missing piece.', title:'Do not force a deeper approach as the fix.', lead:'A sound approach can still meet a good pass or a genuine execution problem.', body:'Ask a coach to observe the full sequence, including your movement and volley contact. This lesson does not diagnose your volley mechanics or prescribe a grip change.'}
    },
    plan:{title:'See the volley your approach builds', lead:'Compare the construction—not just whether you put the volley away.',
      setup:'Warm up with a partner. Use a comfortable short-ball feed that leaves you balanced. Keep one broad approach lane safely inside the lines, similar intended pace and a manageable reply into a broad volley area.',
      blocks:[
        {number:'1', label:'pair', title:'Usual approach, then a deeper target', body:'Play one approach and first volley as usual. From a similar feed, aim the next approach deeper in the same broad lane, with margin. Your partner uses the same reply intention but moves to the actual ball; do not stage a weak pass.', cue:'Next time you approach, compare their contact position with your first-volley height.'},
        {number:'3', label:'pairs total', title:'Notice both contacts—and the cost', body:'Repeat that pair twice more—three pairs in total, with six approach attempts. Notice where your partner contacts the approach, then your first-volley height. Include every approach miss; if no volley occurs, note that rather than counting it as an easy volley.'}
      ], counting:'Do not trade approach consistency for a nicer-looking volley. Keep the volley stroke unchanged; extra pace and harder closing are not the test.',
      boundary:'Only use a balanced, comfortable approach. Do not force a deep shot from a poor ball or aim at the baseline. A deeper reply contact does not guarantee an easier volley or remove a real volley execution error.'},
    report:{title:'What did the deeper approach create?', lead:'Compare the paired sequences. Mixed or missing evidence is useful to record.', cta:'I’ve tried the sequences—record what happened', fields:[
      {name:'opponentContact', label:'With the deeper approach, their contact was…', summaryLabel:'Their contact', type:'enum', options:[['deeper','Farther back'],['same','About the same'],['further-forward','Farther forward'],['unsure','Mixed—or I’m not sure']]},
      {name:'volleyHeight', label:'Your first-volley contact was…', summaryLabel:'Volley height', type:'enum', options:[['higher','Higher'],['same','About the same height'],['lower','Lower'],['no-volley','No usable volley comparison'],['unsure','Mixed—or I’m not sure']]},
      {name:'approachCost', label:'Did the deeper target bring more approach misses?', summaryLabel:'Approach misses', type:'enum', options:[['none-noticed','No extra net or out misses noticed'],['more-misses','Yes, more net or out misses'],['unsure','Mixed—or I’m not sure']]},
      {name:'comparable', label:'Were feeds, lane, pace and reply intention similar?', summaryLabel:'Conditions', type:'boolean', options:boolOptions}
    ], hint:'Height is an observation, not a volley-quality score. A winner or missed pass does not substitute for a volley comparison.'},
    sources:[{
      id:'crooks-approach-movement', publisher:'Mike Crooks · Tennis Iceland archive', author:'Mike Crooks', title:'Tactical Movement – Part 2',
      url:'https://tennis.is/wp-content/uploads/2014/01/Federer_Murray_footwork_movement.pdf', verifiedOn:'2026-09-14',
      supports:'An analysis of Federer–Murray links an approach that holds the receiver behind the baseline with Federer’s movement into the first volley.',
      boundary:'Analysis of particular elite points, not proof that depth universally creates a higher volley or validation of this paired practice.'
    }],
    limits:['Do not deliberately shorten or weaken the usual approach to make the comparison look better.', 'Keep the broad direction fixed in this check; matches require reading the opponent, not always approaching down the line.', 'Include approach misses and absent volleys. A higher volley alone cannot establish a better overall construction.', 'Different feeds or reply intentions, small samples and observer uncertainty limit what this check can tell you.'],
    adaptation:'GameSharp’s three alternating approach pairs, broad target, partner reply constraint and qualitative report are an original beta adaptation. The source and lesson inform the connected view; neither validates this protocol or diagnoses an individual volley error.'
  });

  // Explicit user release approval is separate from independent coaching review.
  // Adding another definition cannot silently make another check public.
  const release = freeze({status:'user_authorized_beta', approvedOn:'2026-09-14', experimentIds:[
    'forehand-space-check-v1', 'return-position-check-v1',
    'next-point-reset-check-v1', 'approach-volley-check-v1'
  ]});
  const definitions = freeze([adaptForehand(), returnCheck, mentalCheck, volleyCheck].filter(Boolean));
  const indexBy = key => freeze(Object.fromEntries(definitions.map(d => [d[key], d])));
  const byId = indexBy('id'), byLessonId = indexBy('lessonId'), byPathId = indexBy('pathId');
  function get(id) { return typeof id === 'string' && own(byId, id) ? byId[id] : null; }

  function validateReport(id, payload) {
    const d = get(id);
    if (!d || !payload || typeof payload !== 'object' || Array.isArray(payload)) return false;
    const fields = d.report.fields;
    if (Object.keys(payload).some(key => key !== 'reportedAt' && !fields.some(field => field.name === key))) return false;
    return fields.every(field => {
      if (!own(payload, field.name)) return false;
      const value = payload[field.name];
      if (field.type === 'count') return Number.isInteger(value) && value >= field.min && value <= field.max;
      if (field.type === 'boolean') return typeof value === 'boolean';
      return typeof value === 'string' && field.options.some(option => option[0] === value);
    });
  }
  function summaries(d, payload) {
    if (d.storage === 'forehand') return [
      {label:'Usual approach', value:payload.beforeMisses + ' / 10 misses'},
      {label:'With the cue', value:payload.afterMisses + ' / 10 misses'}
    ];
    return d.report.fields.map(field => ({label:field.summaryLabel || field.label, value:field.type === 'count' ? payload[field.name] + ' / ' + field.max : field.options.find(option => option[0] === String(payload[field.name]))[1]}));
  }
  function didPractice(id, payload) {
    if (!validateReport(id, payload)) return false;
    if (id === mentalCheck.id) return payload.routine === 'used' && ['comparable-ball','different-ball'].includes(payload.opportunity);
    return true;
  }
  function result(d, payload, title, body, next) { return freeze({title, body, next, summaries:d && validateReport(d.id, payload) ? summaries(d, payload) : []}); }

  function interpret(id, payload) {
    const d = get(id);
    if (!d || !validateReport(id, payload)) return result(null, payload, 'Observation incomplete', 'The required observations are missing or invalid.', 'Only record what you noticed on court. There is no result to infer yet.');
    const finish = (title, body, next) => result(d, payload, title, body, next);
    if (d.storage === 'forehand') {
      const reading = forehand.interpret(payload);
      return finish(reading.title, reading.body, reading.next);
    }
    if (id === returnCheck.id) {
      if (!payload.comparable) return finish('The return comparison is inconclusive', 'Different serves, targets or intended pace can explain what changed.', 'Recheck only with similar manageable serves. Do not keep moving deeper on unclear evidence.');
      if (['more-misses','shorter-returns','both'].includes(payload.cost)) return finish('There was a cost to weigh', 'You noticed extra misses, shorter returns, or both. Any extra time does not by itself make this the better start.', 'Do not automatically keep moving back. Review the whole return with a coach, and let the serve determine the position.');
      if (payload.contact === 'unsure' || payload.cost === 'unsure') return finish('The return trade is still unclear', 'Your observations were mixed or uncertain. That does not establish a useful position change.', 'Ask a partner or coach to watch another small comparison. Keep time and return quality in view.');
      if (payload.contact === 'more-time') return finish('Less rushed is a signal to recheck', 'You felt more time and noticed no extra return cost in this brief check. That is not proof of a best position or better match results.', 'Try it another day against comparable fast serves. Keep the dial flexible when pace, height or court space changes.');
      return finish('Deeper did not feel less rushed', 'This check does not support one step deeper as the answer to the rush you felt.', 'Do not force more depth. Revisit the actual return contact with a coach instead of assuming a cause.');
    }
    if (id === mentalCheck.id) {
      if (payload.opportunity === 'no-miss') return finish('No natural opportunity this time', 'Taking the plan to court is not the same as having a post-miss chance to try it.', 'Keep it available for a future natural miss. Do not manufacture an error or record this as a tested reset.');
      if (payload.routine === 'not-used') return finish('The routine was not tried this time', 'Even if your intention was clear, this opportunity did not test the planned pause and job.', 'Try it at the next natural opportunity without judging yourself or rebuilding your swing.');
      if (payload.opportunity === 'unsure' || payload.routine === 'unsure' || payload.intention === 'unsure') return finish('The reset observation is unclear', 'The report does not show whether the routine restored a clear intention.', 'Next time, notice just the pause and the job before the point. Uncertainty is not failure.');
      if (payload.opportunity === 'different-ball') return finish('The next ball changed the job', 'A changed incoming ball can require a different decision. Sticking to the original shot is not the goal.', 'Keep the preparation, then adapt to the ball you actually receive. This report cannot judge the routine by that point’s result.');
      if (payload.intention === 'clear') return finish('You reported a clear next-ball job', 'You used the pause and began with a clear intention. This is a process observation, not proof that the routine prevented a miss.', 'Revisit it on another day. A useful job can still be followed by an error; the ball and the next decision remain the focus.');
      return finish('The job was still unclear', 'You tried the routine, but did not report a clear intention. That does not diagnose a mental fault.', 'Make the next job simpler and relevant to the ball. If choosing it remains difficult, work through an example with a coach.');
    }
    if (!payload.comparable) return finish('The approach comparison is inconclusive', 'Different feeds, lane, intended pace or reply intention can change the volley independently of approach depth.', 'Recheck similar comfortable sequences. Do not force a deeper target on a poor approach ball.');
    if (payload.approachCost === 'more-misses') return finish('The deeper target had a cost', 'Extra approach misses matter even if the volleys that followed looked more comfortable.', 'Do not chase depth at the expense of usable margin. Review the full construction before keeping the change.');
    if (payload.volleyHeight === 'no-volley') return finish('There was no usable volley comparison', 'A missed approach, missed pass or absent volley does not show an easier first volley.', 'Keep those outcomes in the picture. Ask a partner or coach to help observe a comparable full sequence.');
    if (payload.opponentContact === 'unsure' || payload.volleyHeight === 'unsure' || payload.approachCost === 'unsure') return finish('The two contacts are still unclear', 'Mixed or uncertain observations do not establish a helpful approach-to-volley change.', 'Watch the receiver’s contact and your first-volley height together. Do not diagnose your hands from the result.');
    if (payload.opponentContact === 'deeper' && payload.volleyHeight === 'higher') return finish('You noticed a connected change', 'The receiver contacted farther back and your volley was higher, with no extra approach misses noticed. This small check does not prove cause or that every higher volley is easier.', 'Recheck another day. Keep the opponent, your movement and the actual volley in view—not just approach depth.');
    return finish('The volley did not follow a simple rule', 'These observations do not show the lesson’s farther-back-contact and higher-volley pattern together.', 'A deeper approach is not a guaranteed fix. Ask a coach to inspect the full sequence before blaming the approach or your volley mechanics.');
  }

  const visualBindings = {
    'return-position-check-v1':{kind:'return_position', theme:'return', lenses:['constraint','tradeoff','transfer'], mustShow:['same serve','two starting positions','different arrival times']},
    'next-point-reset-check-v1':{kind:'two_point_sequence', theme:'mental_game', lenses:['contamination','reset','transfer'], mustShow:['original miss','changed next decision','reset alternative']},
    'approach-volley-check-v1':{kind:'approach_to_volley', theme:'net_play', lenses:['construction','depth','transfer'], mustShow:['approach contact','opponent reply quality','first-volley difficulty']}
  };
  const nonempty = value => typeof value === 'string' && value.trim().length > 0;
  const point = value => Array.isArray(value) && value.length === 2 && value.every(Number.isFinite);
  const path = value => Array.isArray(value) && value.length >= 2 && value.every(point);
  function audit(definition, lesson, spine) {
    const errors = [], d = definition && get(definition.id);
    if (!d || d !== definition) return freeze({ok:false, errors:['Exact registered court-check definition is unavailable.'], coachReview:'pending', coachApproved:false});
    if (d.storage === 'forehand') return forehand.audit(lesson, spine);
    const spec = visualBindings[d.id];
    if (!lesson || lesson.id !== d.lessonId || lesson.lessonSpineId !== d.spineId) errors.push('Exact approved lesson is unavailable.');
    if (!spine || spine.id !== d.spineId || spine.prototypeId !== d.lessonId || spine.status !== 'prototype' || spine.courtExperimentId !== d.id || spine.theme !== spec.theme || spine.sharpenTarget !== d.region) errors.push('Exact built spine and court-experiment binding are unavailable.');
    if (!lesson || !spine || !nonempty(lesson.memory) || lesson.memory !== spine.memory || !nonempty(lesson.takeItToCourt) || lesson.takeItToCourt !== spine.tomorrowAction) errors.push('The canonical lesson memory or court cue has drifted.');
    if (!lesson || !spine || !lesson.proInsight || !spine.proInsight || lesson.proInsight.status !== 'source_locked' || spine.proInsight.status !== 'source_locked' || !lesson.proInsight.source || !nonempty(lesson.proInsight.source.url) || JSON.stringify(lesson.proInsight) !== JSON.stringify(spine.proInsight)) errors.push('The canonical lesson source is unavailable or inconsistent.');
    if (!spine || !spine.visualContract || spine.visualContract.kind !== spec.kind || !Array.isArray(spine.visualContract.mustShow) || !spec.mustShow.every(item => spine.visualContract.mustShow.includes(item))) errors.push('The concrete visual evidence contract is unavailable.');
    const steps = lesson && lesson.steps;
    const validSteps = Array.isArray(steps) && steps.length === 3 && [0,1,2].every(i => {
      const step = steps[i], v = step && step.visual;
      return step && step.decisionLens === spec.lenses[i] && v && v.kind === spec.kind;
    });
    if (!validSteps) errors.push('The exact three connected visual decisions are unavailable.');
    else if (d.id === returnCheck.id) {
      const renderer = typeof module === 'object' && module.exports ? require('./gold-daily-prototypes.js') : root && root.GameSharpGoldDaily;
      const evidence = steps.map(step=>renderer && typeof renderer.returnEvidence==='function' ? renderer.returnEvidence(step) : null);
      if(evidence.some(e=>!e||e.capabilities.join('|')!=='court-position|arrival-time'||Math.abs(e.speed-e.referenceSpeed)>.001)||
         (evidence.every(Boolean)&&!(Math.abs(evidence[0].speed-evidence[1].speed)<.001&&evidence[2].speed<evidence[0].speed&&
           evidence[0].referenceAt>evidence[0].contactAt&&evidence[2].referenceAt<evidence[2].contactAt)))errors.push('The renderer does not demonstrate the required same-speed depth and slower-serve arrival comparison.');
      if (steps.some((step, i) => {
        const v = step.visual;
        return v.mode !== ['choice','compare','choice'][i] || !path(v.serve) || !path(v.referenceServe) || !point(v.start) || !point(v.referenceStart) || !point(v.contact) || !point(v.referenceContact) || v.start[1] === v.referenceStart[1] || v.contact[1] === v.referenceContact[1];
      }) || JSON.stringify(steps[1].visual.serve.slice(0,-1)) !== JSON.stringify(steps[1].visual.referenceServe.slice(0,-1)) || !(steps[0].visual.referenceStart[1] > steps[0].visual.start[1]) || !(steps[2].visual.referenceStart[1] < steps[2].visual.start[1])) errors.push('The same-serve depth comparison and slower-serve reversal are unavailable.');
    } else if (d.id === mentalCheck.id) {
      if (steps.some((step, i) => step.visual.mode !== ['rally','reset','serve'][i] || !path(step.visual.firstPath)) || !path(steps[0].visual.responsePath) || !Array.isArray(steps[1].visual.choiceTargets) || steps[1].visual.choiceTargets.length !== 4 || steps[1].visual.secondOutcome !== 'NEXT RESULT UNKNOWN' || !Array.isArray(steps[2].visual.routineBefore) || !Array.isArray(steps[2].visual.routineObserved) || steps[2].visual.routineObserved.length >= steps[2].visual.routineBefore.length || steps[2].visual.resetOutcome !== 'READY · RESULT UNKNOWN') errors.push('The post-miss contrast and result-unknown reset are unavailable.');
    } else {
      const actions = [['middle','angle','deep-line','float'],['close','deep-line','pace','angle'],['line','short-line','middle','deep-cross']];
      if (steps.some((step, i) => step.visual.scene !== i || JSON.stringify(step.visual.actions) !== JSON.stringify(actions[i]) || step.correct !== [2,1,3][i])) errors.push('The approach-depth contrast and opponent-position transfer are unavailable.');
    }
    return freeze({ok:errors.length === 0, errors, coachReview:'pending', coachApproved:false});
  }

  return Object.freeze({version, release, definitions, byId, byLessonId, byPathId, audit, validateReport, interpret, didPractice});
});
