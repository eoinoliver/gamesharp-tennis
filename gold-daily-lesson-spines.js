(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GameSharpGoldLessonSpines = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VERSION = '2026-09-14.lesson-spines.17';
  const VALID_MECHANICS = Object.freeze(['daily', 'fix_the_culprit', 'live_point']);
  const VALID_SHARPEN_TARGETS = Object.freeze([
    'mindset', 'forehand', 'backhand', 'serve_return', 'net', 'movement', 'decisions'
  ]);

  // Eight editorial lanes feed the seven existing Sharpen destinations. Serve and
  // Return stay editorially distinct, but both route to the existing combined door.
  const themes = [
    { id: 'mental_game', label: 'Mental Game', sharpenTarget: 'mindset' },
    { id: 'forehand', label: 'Forehand', sharpenTarget: 'forehand' },
    { id: 'backhand', label: 'Backhand', sharpenTarget: 'backhand' },
    { id: 'serve', label: 'Serve', sharpenTarget: 'serve_return' },
    { id: 'return', label: 'Return', sharpenTarget: 'serve_return' },
    { id: 'net_play', label: 'Net Play', sharpenTarget: 'net' },
    { id: 'movement_footwork', label: 'Movement & Footwork', sharpenTarget: 'movement' },
    { id: 'decision_making', label: 'Decision Making', sharpenTarget: 'decisions' }
  ];

  function researchRequired(playerCandidate, evidenceQuestion) {
    return {
      status: 'research_required',
      playerCandidate: playerCandidate,
      evidenceQuestion: evidenceQuestion
    };
  }

  const spines = [
    // MENTAL GAME
    {
      id: 'mental_lead_shrinks_game', theme: 'mental_game', sharpenTarget: 'mindset', status: 'prototype',
      prototypeId:'gold_protect_pattern_v1',slug:'protect-pattern',prototypeDecisionLenses:['preserve-depth','opponent-adjustment','defensive-contact'],memory:'Protect the pattern, not the score.',
      title: 'The Lead That Makes You Smaller',
      painHook: 'You get ahead, protect the score, and stop playing the tennis that built the lead.',
      beforeBelief: 'Protecting a lead means removing aggression and avoiding every risk.',
      afterSight: 'Protect a useful construction; change it when the ball or opponent changes.',
      tomorrowAction: 'Next time you lead, change your pattern for the ball or opponent—not the score.',
      coreTruth: 'Pressure should change margin before it changes identity.',
      boundary: 'A genuinely failing pattern should change; the scoreboard alone is not evidence that it failed.',
      decisionCues: ['earlier construction', 'target margin', 'landing depth'],
      mechanic: 'daily',
      visualContract: { kind: 'score_pressure', mustShow: ['same starting contact', 'changed target', 'changed recovery consequence'] },
      proInsight:{status:'source_locked',player:'Roger Federer',documentedMoment:'Federer needed five match points to close Nadal out at Wimbledon in 2019, crediting his commitment to an aggressive game plan.',gameSharpRead:'Keep a useful intention; adapt to actual evidence.',claimType:'sourced_paraphrase',endorsement:false,source:{publisher:'ATP Tour',title:'Federer Beats Nadal, Sets Sights On Ninth Wimbledon Title',published:'12 July 2019',url:'https://www.atptour.com/en/news/federer-nadal-semifinal-wimbledon-2019-friday'},evidenceBoundary:'Federer described retaining his attacking plan. GameSharp’s targets and rallies are applications, not reconstructions or proof of his inner state.'},
      playbookTarget: 'pressure_keep_the_pattern'
    },
    {
      id: 'mental_miss_steals_next_point', theme: 'mental_game', sharpenTarget: 'mindset', status: 'prototype',
      courtExperimentId: 'next-point-reset-check-v1',
      prototypeId: 'gold_miss_two_points_v1', slug: 'two-points',
      title: 'The Miss That Steals Two Points',
      painHook: 'One miss changes your next target, tempo or commitment before you notice it.',
      beforeBelief: 'The fastest recovery is to fix the missed stroke immediately.',
      afterSight: 'Reset the next decision first; diagnose technique only when the pattern repeats.',
      tomorrowAction: 'Next time you miss, name the next ball’s job before changing your swing.',
      coreTruth: 'The costly part of one error is often the decision it contaminates next.',
      boundary: 'Repeated identical misses can justify diagnosis after the point, but not an emotional mid-rally rebuild.',
      decisionCues: ['post-miss tempo', 'next target size', 'repeat evidence'],
      prototypeDecisionLenses: ['contamination', 'reset', 'transfer'],
      mechanic: 'daily',
      memory: 'One miss gets one point.',
      visualContract: { kind: 'two_point_sequence', mustShow: ['original miss', 'changed next decision', 'reset alternative'] },
      proInsight: {
        status: 'source_locked',
        player: 'Andy Murray',
        documentedMoment: 'At Wimbledon in 2008, Murray explained that towelling down gave him time to catch his breath and prepare for the next point.',
        gameSharpRead: 'Feel the miss. Do not lend it the next ball.',
        claimType: 'sourced_paraphrase',
        endorsement: false,
        source: {
          publisher: 'ASAP Sports · Wimbledon interview',
          title: 'Andy Murray post-match interview · 24 June 2008',
          published: '24 June 2008',
          url: 'https://www.asapsports.com/show_interview.php?id=50380'
        }
      },
      playbookTarget: 'reset_the_next_decision'
    },
    {
      id: 'mental_confidence_needs_job', theme: 'mental_game', sharpenTarget: 'mindset', status: 'spine',
      title: 'Confidence Needs a Job',
      painHook: 'You wait to feel confident, then make a new decision on every ball.',
      beforeBelief: 'Commitment arrives only after confidence returns.',
      afterSight: 'A clear, repeatable job can create the commitment you were waiting to feel.',
      tomorrowAction: 'Next time confidence drops, choose one high-margin two-ball pattern.',
      coreTruth: 'Tactical clarity can reduce the uncertainty that feels like lost confidence.',
      boundary: 'A plan cannot erase fear or repair technique; it can remove unnecessary choices.',
      decisionCues: ['number of choices', 'repeatable pattern', 'commitment through target'],
      mechanic: 'daily',
      visualContract: { kind: 'pattern_choice', mustShow: ['unclear options', 'two-ball pattern', 'repeatable target'] },
      proInsight: researchRequired('Andy Murray', 'Find authoritative analysis showing Murray using clear return or rally patterns to solve pressure rather than chasing confidence.'),
      playbookTarget: 'clarity_before_confidence'
    },

    // FOREHAND
    {
      id: 'forehand_contact_upstream', theme: 'forehand', sharpenTarget: 'forehand', status: 'prototype',
      prototypeId: 'gold_contact_point_v1', slug: 'contact',
      title: 'Two Misses. One Clue.',
      painHook: 'You chase each miss with a new swing fix while the same contact clue survives.',
      beforeBelief: 'A wide miss and a short miss automatically need different swing fixes.',
      afterSight: 'Different outcomes can share the same observable body-ball clue.',
      tomorrowAction: 'Next time your forehand feels rushed, notice whether the ball repeatedly crowds your hitting side at contact.',
      coreTruth: 'Read the body-ball relationship before rebuilding the stroke.',
      boundary: 'Crowded contact is a clue, not a diagnosis; confirm it across several comparable forehands.',
      decisionCues: ['ball outcome', 'body-ball gap', 'repeat evidence'],
      prototypeDecisionLenses: ['observation', 'contrast', 'transfer'],
      mechanic: 'fix_the_culprit',
      courtExperimentId: 'forehand-space-check-v1',
      memory: 'Two misses. One useful clue.',
      visualContract: { kind: 'contact', mustShow: ['moving forehand', 'held contact frame', 'same-camera crowded versus usable space'] },
      proInsight: {
        status: 'source_locked',
        player: 'Andre Agassi',
        documentedMoment: 'Coach Andy Zodin singles out Agassi’s non-hitting arm: its preparation helps establish body-ball distance for a consistent contact point.',
        gameSharpRead: 'Notice the space before the swing.',
        claimType: 'sourced_paraphrase',
        endorsement: false,
        source: {
          publisher: 'Essential Tennis · Andy Zodin',
          title: 'Should you really be copying what the pros do on TV? · Agassi spacing discussion',
          published: 'Podcast 106 · archive',
          url: 'https://www.essentialtennis.com/podcast-106-should-you-really-be-copying-what-the-pros-do-on-tv/'
        }
      },
      playbookTarget: 'contact_before_swing_fix'
    },
    {
      id: 'forehand_high_ball_opposites', theme: 'forehand', sharpenTarget: 'forehand', status: 'prototype',
      prototypeId: 'gold_high_ball_v1', slug: 'high-ball',
      prototypeDecisionLenses: ['available-window','late-arrival','existing-space'],
      memory: 'Find the contact, not the height.',
      title: 'One High Ball. Two Opposite Answers.',
      painHook: 'You retreat from every high forehand—or step into every one—and donate court.',
      beforeBelief: 'Bounce height determines whether to move forward or back.',
      afterSight: 'Landing depth and available time decide whether to steal time or buy it.',
      tomorrowAction: 'Next time a ball climbs, notice its depth and your position before adjusting.',
      coreTruth: 'High is an outcome; depth is the first movement cue.',
      boundary: 'Skill and early recognition can widen the on-the-rise option, but do not make it universal.',
      decisionCues: ['landing depth', 'time to contact', 'comfortable strike zone'],
      mechanic: 'daily',
      visualContract: { kind: 'high_ball_contrast', mustShow: ['short rising ball', 'deep rising ball', 'opposite footwork'] },
      proInsight: {
        status:'source_locked',player:'Iga Swiatek',
        documentedMoment:'Swiatek personally chose high-moonball and court-positioning drills for her TopCourt class: awkward rally balls belong in a champion’s practice too.',
        gameSharpRead:'Practise finding space, not just surviving height.',
        claimType:'sourced_paraphrase',endorsement:false,
        source:{publisher:'WTA',title:'TopCourt: The secrets to Swiatek’s explosive game',published:'13 August 2021',url:'https://www.wtatennis.com/news/2214387/topcourt-the-secrets-to-swiateks-explosive-game'},
        evidenceBoundary:'The WTA class description supports the chosen training topics, not GameSharp’s three movement decisions. The underlying class was not accessed.'
      },
      playbookTarget: 'read_depth_before_height'
    },
    {
      id: 'forehand_inside_out_recovery_bill', theme: 'forehand', sharpenTarget: 'forehand', status: 'prototype',
      prototypeId:'gold_forehand_bill_v1',slug:'forehand-bill',prototypeDecisionLenses:['recovery-cost','earned-runaround','depth-and-width'],memory:'Your shot includes the recovery.',
      title: 'Your Forehand Leaves a Bill',
      painHook: 'You run around the backhand, hit a strong forehand, then lose the exposed court.',
      beforeBelief: 'A stronger forehand automatically makes running around worthwhile.',
      afterSight: 'The forehand must create enough damage to repay the recovery space it opens.',
      tomorrowAction: 'Next time you run around, judge the shot and recovery as one decision.',
      coreTruth: 'Court position is part of shot quality, not an afterthought.',
      boundary: 'A weaker forehand or balanced opponent increases the cost of leaving the backhand corner.',
      decisionCues: ['contact position', 'opponent balance', 'exposed recovery distance'],
      mechanic: 'live_point',
      visualContract: { kind: 'inside_out_consequence', mustShow: ['run-around position', 'two opponent replies', 'recovery distance'] },
      proInsight:{status:'source_locked',player:'Jim Courier',documentedMoment:'Courier built his game around the runaround forehand; coach Jim McLennan highlights how that weapon could also leave him awkwardly positioned.',gameSharpRead:'Count the space your favourite shot leaves behind.',claimType:'sourced_paraphrase',endorsement:false,source:{publisher:'TennisOne · Jim McLennan',title:'Court Positioning · Jim Courier’s forehand trade-off',published:'Undated coaching archive',url:'https://tennisone.tennisplayer.net/club/lessons/jm/positioning/court.php'},evidenceBoundary:'Published coaching analysis supports the trade-off; embedded Flash footage was not reviewed. Distances and replies are GameSharp schematics.'},
      playbookTarget: 'inside_out_with_recovery'
    },

    // BACKHAND
    {
      id: 'backhand_line_must_be_earned', theme: 'backhand', sharpenTarget: 'backhand', status: 'prototype',
      prototypeId: 'gold_direction_change_v1', slug: 'line',
      dailyConnection: { sequenceId: 'seq_015', livePointId: 'change_direction', playbookId: 'down_the_line', bridge: 'Read a new rally: build crosscourt until balance and a shorter ball earn the line.' },
      title: 'The Line Must Be Earned',
      painHook: 'The open line tempts you from a low or stretched backhand—and exposes the whole court.',
      beforeBelief: 'Open space makes down the line the aggressive answer.',
      afterSight: 'The incoming ball and your balance must earn the direction change.',
      tomorrowAction: 'Next time the line opens, check contact height and balance before taking it.',
      coreTruth: 'Changing direction shortens the court and demands cleaner contact.',
      boundary: 'A higher, shorter ball from balance can earn the line even when crosscourt remains safer.',
      decisionCues: ['contact height', 'player balance', 'recovery exposure'],
      prototypeDecisionLenses: ['constraint', 'permission', 'transfer'],
      mechanic: 'live_point',
      memory: 'Open space is not permission.',
      visualContract: { kind: 'direction_change', mustShow: ['incoming crosscourt ball', 'contact condition', 'both reply lanes'] },
      proInsight: {
        status: 'source_locked',
        player: 'Roger Federer',
        documentedMoment: 'In the 2017 Australian Open final, Federer turned Nadal’s all-out forehand down the line into a forehand reply through the open court.',
        gameSharpRead: 'The line can open the reply behind you.',
        claimType: 'sourced_paraphrase',
        endorsement: false,
        source: {
          publisher: 'ATP Tour',
          title: 'How It Happened: Federer Beats Nadal For Australian Open Title',
          published: '29 January 2017',
          url: 'https://www.atptour.com/en/news/federer-nadal-australian-open-2017-final'
        }
      },
      playbookTarget: 'earn_the_backhand_line'
    },
    {
      id: 'backhand_high_ball_depth', theme: 'backhand', sharpenTarget: 'backhand', status: 'spine',
      title: 'The High Backhand Is a Depth Problem',
      painHook: 'You use one answer for every high backhand and get trapped at the wrong distance.',
      beforeBelief: 'High backhands always require retreating or taking the ball early.',
      afterSight: 'Depth, trajectory and time determine which of those opposite answers is available.',
      tomorrowAction: 'Next time the backhand rises, read landing depth before adjusting your strike zone.',
      coreTruth: 'The same height can demand opposite movement because it arrived from different depth.',
      boundary: 'Grip, strength and surface change the comfortable window, not the need to read depth.',
      decisionCues: ['landing depth', 'trajectory shape', 'available time'],
      mechanic: 'daily',
      visualContract: { kind: 'backhand_depth_contrast', mustShow: ['same bounce height', 'different landing depth', 'opposite contact windows'] },
      proInsight: researchRequired('Novak Djokovic', 'Find authoritative analysis of Djokovic’s positioning against short versus deep high backhands.'),
      playbookTarget: 'backhand_depth_before_height'
    },
    {
      id: 'backhand_runaround_is_pattern', theme: 'backhand', sharpenTarget: 'backhand', status: 'prototype',
      prototypeId: 'gold_runaround_pattern_v1', slug: 'runaround',
      prototypeDecisionLenses: ['permission', 'constraint', 'transfer'],
      memory: 'Earn the forehand. Cover its cost.',
      title: 'Running Around Is Not Hiding',
      painHook: 'You keep proving the weaker backhand when the rally is offering a better pattern.',
      beforeBelief: 'Running around a backhand means the backhand has failed.',
      afterSight: 'A planned forehand can change the matchup when time and recovery space support it.',
      tomorrowAction: 'Next time a neutral backhand arrives, notice whether time exists to change the matchup.',
      coreTruth: 'A stroke can support a pattern without taking the final ball.',
      boundary: 'Running around without time or damage merely creates a larger court to defend.',
      decisionCues: ['available time', 'forehand damage', 'recovery cost'],
      mechanic: 'live_point',
      visualContract: { kind: 'court_read', mustShow: ['backhand option', 'run-around path', 'resulting court exposure'] },
      proInsight: {
        status: 'source_locked', player: 'Ashleigh Barty',
        documentedMoment: 'Barty’s coach Craig Tyzzer described her slice setting up her forehand weapon: the backhand helped build the attack rather than merely survive.',
        gameSharpRead: 'Your other wing can build your weapon.',
        claimType: 'sourced_paraphrase', endorsement: false,
        source: { publisher: 'WTA · Craig Tyzzer interview', title: 'Coaches Corner: Breaking down the Barty backhand slice', published: '28 January 2022', url: 'https://www.wtatennis.com/news/2465400/coaches-corner-bartys-best-is-yet-to-come-tyzzer' }
      },
      playbookTarget: 'backhand_to_forehand_pattern'
    },

    // SERVE
    {
      id: 'serve_plus_one_is_unit', theme: 'serve', sharpenTarget: 'serve_return', status: 'prototype',
      prototypeId: 'gold_serve_plus_one_v1', slug: 'serve-plus-one',
      dailyConnection: { sequenceId: 'seq_001', livePointId: 'serve_plus_one', playbookId: 'wide_serve', bridge: 'Read a wide-serve pattern, then compare the next-ball choices in Live Point.' },
      title: 'The Serve Writes the Next Question',
      painHook: 'You chase a better serve while wasting the predictable ball it already creates.',
      beforeBelief: 'Serve quality is measured by aces, speed or whether the return lands in.',
      afterSight: 'The serve and first ball form one decision when the return pattern is predictable.',
      tomorrowAction: 'Next time you serve, name the likely reply—then let the real ball decide.',
      coreTruth: 'A serve earns value by shaping the next contact, not only by ending the point.',
      boundary: 'Do not pre-commit blindly; the actual return always overrides the planned first ball.',
      decisionCues: ['serve location', 'returner position', 'likely return lane'],
      prototypeDecisionLenses: ['prediction', 'confirmation', 'adaptation'],
      mechanic: 'live_point',
      memory: 'The serve asks. The return answers.',
      visualContract: { kind: 'serve_plus_one', mustShow: ['serve target', 'return lane', 'first-ball target'] },
      proInsight: {
        status: 'source_locked',
        player: 'Pete Sampras',
        documentedMoment: 'In the 1999 Wimbledon final, Sampras served wide to Agassi’s forehand, then steered the first volley into the open Ad court the serve had created.',
        gameSharpRead: 'The serve wins space before the next swing.',
        claimType: 'sourced_paraphrase',
        endorsement: false,
        source: {
          publisher: 'ATP Tour',
          title: 'Pete Sampras: My Perfect Day… Remembering 1999 Wimbledon',
          published: '12 July 2020',
          url: 'https://www.atptour.com/en/news/sampras-1999-wimbledon-atp-heritage-feature'
        }
      },
      playbookTarget: 'serve_plus_one'
    },
    {
      id: 'serve_body_target_adapts', theme: 'serve', sharpenTarget: 'serve_return', status: 'prototype',
      prototypeId: 'gold_serve_adaptation_v1', slug: 'serve-adaptation',
      prototypeDecisionLenses: ['repeat', 'adjust', 'transfer'],
      memory: 'Read the returner, not the spot.',
      title: 'Every Serve Teaches the Returner',
      painHook: 'The same serve can crowd one starting position and leave another plenty of room.',
      beforeBelief: 'A target that worked remains the same target all match.',
      afterSight: 'Every successful serve supplies evidence about the returner’s next adjustment.',
      tomorrowAction: 'Next time you serve, compare the returner’s position and contact spacing.',
      coreTruth: 'A body target depends on the returner’s position, not just the service box.',
      boundary: 'Stay with a pattern while it still creates the promised ball; change on evidence, not boredom.',
      decisionCues: ['returner starting position', 'contact spacing', 'previous return direction'],
      mechanic: 'daily',
      visualContract: { kind: 'serve_adjustment', mustShow: ['first body serve', 'returner adjustment', 'next serve options'] },
      proInsight: {status:'source_locked',player:'Andy Murray',documentedMoment:'At Wimbledon in 2022, Murray answered Duckworth’s retreating return position with an underarm serve. The surprise responded to a visible change, not a whim.',gameSharpRead:'Change the target when the returner changes the opportunity.',claimType:'sourced_paraphrase',endorsement:false,source:{publisher:'Sky Sports · Murray post-match explanation',title:'Andy Murray fights back to beat James Duckworth in Wimbledon first round',published:'28 June 2022',url:'https://www.skysports.com/tennis/news/32498/12641093/andy-murray-fights-back-to-beat-james-duckworth-in-wimbledon-first-round'}},
      playbookTarget: 'serve_pattern_conversation'
    },
    {
      id: 'serve_safe_second_serve_risk', theme: 'serve', sharpenTarget: 'serve_return', status: 'prototype',
      prototypeId:'gold_serve_quality_v1',slug:'serve-quality',prototypeDecisionLenses:['contact-depth','receiving-shape','receiver-reversal'],memory:'In is only the beginning.',
      title: 'The Safe Second Serve Trap',
      painHook: 'Your second serve lands in but gives the receiver room to attack.',
      beforeBelief: 'A second serve landing in has done its whole job.',
      afterSight: 'Assess the receiving contact as well as the legal bounce.',
      tomorrowAction: 'Next time you serve second, notice where and how the receiver meets it.',
      coreTruth: 'Legal deliveries can create different receiving contacts without establishing comparative execution risk.',
      boundary: 'Height and depth are not universal solutions; receiver ability and reliable execution can change the choice.',
      decisionCues: ['legal landing', 'receiving contact depth', 'height and lateral reach'],
      mechanic: 'daily',
      visualContract: { kind: 'serve_quality', mustShow: ['legal service bounces', 'actual receiving contacts', 'receiver-dependent reversal'] },
      proInsight:{status:'source_locked',player:'Jannik Sinner',documentedMoment:'Sinner often sends second serves into the returner’s body. Alcaraz often lifts them toward the backhand. Two champions make the receiver solve different problems.',gameSharpRead:'Judge your second serve by the contact it gives back.',claimType:'sourced_paraphrase',endorsement:false,source:{publisher:'ATP Tour',title:'Here’s why Alcaraz & Sinner are second-serve standouts',published:'7 August 2024',url:'https://www.atptour.com/en/news/alcaraz-sinner-infosys-atp-beyond-the-numbers-july-2024'},evidenceBoundary:'Original ATP analysis supports contrasting patterns, not these authored trajectories, a racket-speed diagnosis, serve-in rates or guaranteed outcomes.'},
      playbookTarget: 'second_serve_with_intent'
    },

    // RETURN
    {
      id: 'return_position_is_dial', theme: 'return', sharpenTarget: 'serve_return', status: 'prototype',
      courtExperimentId: 'return-position-check-v1',
      prototypeId: 'gold_return_position_v1', slug: 'return-position',
      dailyConnection: { sequenceId: 'seq_002', livePointId: 'second_serve', playbookId: 'net_approach', bridge: 'Transfer the second-serve read: step in only when pace, bounce and balance allow it.' },
      title: 'Giving Ground Can Take Control',
      painHook: 'You stand close to look aggressive, get jammed, and never make a real return decision.',
      beforeBelief: 'Closer return position is always more aggressive and therefore better.',
      afterSight: 'Return position is a dial that trades time, height and court position.',
      tomorrowAction: 'Next time a first serve jams you, test one deliberate step deeper.',
      coreTruth: 'Buying reaction time can create a more attacking next contact.',
      boundary: 'Against a weaker or predictable serve, stepping in may be the better end of the same dial.',
      decisionCues: ['serve pace', 'time to contact', 'court position'],
      prototypeDecisionLenses: ['constraint', 'tradeoff', 'transfer'],
      mechanic: 'daily',
      memory: 'Return position is a dial.',
      visualContract: { kind: 'return_position', mustShow: ['same serve', 'two starting positions', 'different arrival times'], doesNotShow: ['body spacing', 'contact height', 'return quality'] },
      proInsight: {
        status: 'source_locked',
        player: 'Daniil Medvedev',
        documentedMoment: 'ATP data showed Medvedev could stand six metres deep, buy time against first serves and still return with exceptional depth.',
        gameSharpRead: 'Giving ground can give the strike back to you.',
        claimType: 'sourced_paraphrase',
        endorsement: false,
        source: {
          publisher: 'ATP Tour',
          title: 'The Hidden Benefit Of Medvedev’s Deep Return Stance',
          published: '16 August 2023',
          url: 'https://www.atptour.com/en/news/medvedev-infosys-beyond-the-numbers-august-2023'
        }
      },
      playbookTarget: 'return_position_dial'
    },
    {
      id: 'return_second_serve_steal_time', theme: 'return', sharpenTarget: 'serve_return', status: 'prototype',
      prototypeId:'gold_return_time_v1',slug:'return-time',prototypeDecisionLenses:['contact-time','pace-comparison','usable-contact'],memory:'Take time before you add pace.',
      title: 'The Second Serve You Let Escape',
      painHook: 'A manageable second serve arrives, but waiting gives the server more time.',
      beforeBelief: 'Attacking a second serve means swinging harder at a smaller target.',
      afterSight: 'Contact time and outgoing pace jointly determine when a useful return arrives.',
      tomorrowAction: 'Next time a second serve allows it, test balanced earlier contact with margin.',
      coreTruth: 'Earlier usable contact can bring a return back sooner without increasing its outgoing pace.',
      boundary: 'High bounce alone does not prescribe retreat; actual reach, balance and contact height determine usable options.',
      decisionCues: ['serve height', 'starting position', 'contact balance'],
      mechanic: 'daily',
      visualContract: { kind: 'return_time', mustShow: ['same serve on one clock', 'actual return arrivals', 'reachable contact boundary'] },
      proInsight:{status:'source_locked',player:'Andre Agassi',documentedMoment:'Agassi took Grosjean’s second serve early and followed it forward in Melbourne. He also warned that Grosjean handled pace brilliantly: the surprise mattered.',gameSharpRead:'Take useful time when the contact lets you stay balanced.',claimType:'sourced_paraphrase',endorsement:false,source:{publisher:'ASAP Sports',title:'Andre Agassi Australian Open interview',published:'21 January 2003',url:'https://www.asapsports.com/show_interview.php?id=198'},evidenceBoundary:'Agassi describes this early second-serve choice and surprise rationale. The timing comparison and contact boundaries are original GameSharp examples, not measured reconstructions.'},
      playbookTarget: 'steal_second_serve_time'
    },
    {
      id: 'return_middle_removes_plus_one', theme: 'return', sharpenTarget: 'serve_return', status: 'prototype',
      prototypeId: 'gold_middle_return_v1', slug: 'middle-return',
      prototypeDecisionLenses: ['neutralise', 'depth', 'transfer'],
      memory: 'Middle needs depth, not just direction.',
      title: 'The Return That Shrinks Serve +1',
      painHook: 'You chase the open corner, miss returns, and let the server start every pattern comfortably.',
      beforeBelief: 'The most aggressive return target is the open court.',
      afterSight: 'A deep middle return can remove angles and make the server’s first ball less certain.',
      tomorrowAction: 'Next time a server controls serve-plus-one, test depth through the middle.',
      coreTruth: 'Neutralising available angles can be more disruptive than finding an immediate angle.',
      boundary: 'A weak serve and balanced return contact can earn a wider attacking target.',
      decisionCues: ['return balance', 'server recovery', 'available angles'],
      mechanic: 'live_point',
      visualContract: { kind: 'court_read', mustShow: ['wide return lane', 'middle return lane', 'server first-ball options'] },
      proInsight: {
        status: 'source_locked', player: 'Alex de Minaur',
        documentedMoment: 'De Minaur sent most first-serve returns through the middle in 2024, reducing sideline risk and denying the server an immediate attacking angle.',
        gameSharpRead: 'An unglamorous target can take their weapon away.',
        claimType: 'sourced_paraphrase', endorsement: false,
        source: { publisher: 'ATP Tour · Craig O’Shannessy', title: 'The superpower behind De Minaur’s surge', published: '23 December 2024', url: 'https://www.atptour.com/en/news/de-minaur-infosys-atp-beyond-the-numbers-december-2024' }
      },
      playbookTarget: 'deep_middle_return'
    },

    // NET PLAY
    {
      id: 'net_short_ball_permission', theme: 'net_play', sharpenTarget: 'net', status: 'prototype',
      prototypeId: 'gold_short_ball_attack_v1', slug: 'short-ball',
      dailyConnection: { sequenceId: 'seq_013', livePointId: 'short_ball', playbookId: 'short_ball', bridge: 'Follow a short ball through the approach and volley. Let each contact earn the next attack.' },
      title: 'The Short Ball Is Not Permission',
      painHook: 'You attack because the ball landed short—then arrive stretched or get passed.',
      beforeBelief: 'A short ball should automatically be attacked.',
      afterSight: 'Short invites the decision; height, balance and opponent position earn the attack.',
      tomorrowAction: 'Next time a ball lands short, check your balance and the opponent’s position before deciding to attack.',
      coreTruth: 'Location offers the chance; contact quality decides whether the chance is real.',
      boundary: 'Personal skill and score can change acceptable risk, but cannot erase poor balance.',
      decisionCues: ['ball height', 'player balance', 'opponent recovery'],
      prototypeDecisionLenses: ['constraint', 'opportunity', 'transfer'],
      mechanic: 'daily',
      memory: 'The attack begins one ball earlier.',
      visualContract: { kind: 'shortBall', mustShow: ['contact height', 'player balance', 'opponent recovery position'] },
      proInsight: {
        status: 'source_locked',
        player: 'Rafael Nadal',
        documentedMoment: 'Nadal’s short-ball attack starts before he moves forward: the heavy forehand creates space, so the short reply arrives into a court already under pressure.',
        gameSharpRead: 'The attack begins before the short ball.',
        claimType: 'sourced_paraphrase',
        endorsement: false,
        source: {
          publisher: 'ATP Tour',
          title: 'Nadal Wins Historic 10th Monte-Carlo Title',
          published: '23 April 2017',
          url: 'https://www.atptour.com/en/news/nadal-ramos-vinolas-monte-carlo-2017-final'
        }
      },
      playbookTarget: 'short_ball_permission_test'
    },
    {
      id: 'net_volley_started_at_baseline', theme: 'net_play', sharpenTarget: 'net', status: 'prototype',
      courtExperimentId: 'approach-volley-check-v1',
      prototypeId: 'gold_approach_volley_v1', slug: 'approach-volley',
      prototypeDecisionLenses: ['construction', 'depth', 'transfer'],
      memory: 'Your approach builds the volley.',
      title: 'Your Approach Shapes Your First Volley',
      painHook: 'Before blaming your hands, inspect the first volley your approach gives you.',
      beforeBelief: 'A missed first volley is mainly a hand or racket problem.',
      afterSight: 'Approach quality and position determine how difficult the first volley becomes.',
      tomorrowAction: 'Next time you approach, compare their contact position with your first-volley height.',
      coreTruth: 'The first volley inherits the time and geometry created by the approach.',
      boundary: 'A sound approach can still be followed by a genuine volley execution error.',
      decisionCues: ['approach height', 'approach depth', 'opponent contact balance'],
      mechanic: 'daily',
      visualContract: { kind: 'approach_to_volley', mustShow: ['approach contact', 'opponent reply quality', 'first-volley difficulty'] },
      proInsight: {status:'source_locked',player:'Roger Federer',documentedMoment:'Federer’s approach kept Murray behind the baseline in their 2012 Dubai final; Mike Crooks’s analysis shows Federer following the ball forward into his first volley.',gameSharpRead:'Your first volley inherits the approach.',claimType:'sourced_paraphrase',endorsement:false,source:{publisher:'Mike Crooks · Tennis Iceland archive',title:'Tactical Movement – Part 2 (Federer–Murray analysis)',published:'Undated analysis · 2012 match',url:'https://tennis.is/wp-content/uploads/2014/01/Federer_Murray_footwork_movement.pdf'}},
      playbookTarget: 'approach_builds_the_volley'
    },
    {
      id: 'net_close_without_opening_pass', theme: 'net_play', sharpenTarget: 'net', status: 'prototype',
      prototypeId:'gold_close_then_balance_v1',slug:'close-then-balance',prototypeDecisionLenses:['contact-deadline','floating-reply','earlier-contact'],memory:'Close, read, then move again.',
      title: 'Closing Hard Can Open the Pass',
      painHook: 'You sprint toward the net, lose the split step, and make one passing lane larger.',
      beforeBelief: 'The closer you get to the net, the better your position becomes.',
      afterSight: 'Close while the ball permits, then arrive balanced as the opponent reveals the pass.',
      tomorrowAction: 'Next time you approach, prioritise a timed split step over one extra stride.',
      coreTruth: 'Distance helps only while balance and reaction remain available.',
      boundary: 'A floating defensive reply can justify closing further before the opponent contacts.',
      decisionCues: ['opponent contact time', 'split-step timing', 'passing angle'],
      mechanic: 'live_point',
      visualContract: { kind: 'net_close_timing', mustShow: ['approach path', 'split-step moment', 'two passing lanes'] },
      proInsight:{status:'source_locked',player:'Martina Navratilova',documentedMoment:'Navratilova’s serve-and-volley lesson pairs an explosive but controlled advance with a split step: getting forward is only part of being ready.',gameSharpRead:'Move in with purpose; keep a response available.',claimType:'sourced_paraphrase',endorsement:false,source:{publisher:'Tennis.com · Navratilova instruction',title:'Navratilova gives keys to serving and volleying',published:'1 January 2020',url:'https://www.tennis.com/news/articles/navratilova-gives-keys-to-serving-and-volleying'},evidenceBoundary:'Published instruction lists controlled advance and split step, not GameSharp’s exact offsets. Schematic timing comparison, not a biomechanical prescription.'},
      playbookTarget: 'close_then_balance'
    },

    // MOVEMENT & FOOTWORK
    {
      id: 'movement_recovery_probability', theme: 'movement_footwork', sharpenTarget: 'movement', status: 'prototype',
      prototypeId: 'gold_recovery_position_v1', slug: 'recovery',
      title: 'The Centre Is Not the Plan',
      painHook: 'You recover to the centre—and still get caught covering the wrong court.',
      beforeBelief: 'Good recovery means returning to the geometric centre after every shot.',
      afterSight: 'The useful centre moves with the reply your shot makes likely, then evidence refines it.',
      tomorrowAction: 'Next time you recover, name the likely reply before choosing the spot.',
      coreTruth: 'Geometry sets a percentage starting point; shot quality, balance and evidence adjust it.',
      boundary: 'Opponent tendency, score, speed and your balance can move the default without abolishing geometry.',
      decisionCues: ['shot quality', 'opponent balance', 'repeated tendency'],
      prototypeDecisionLenses: ['geometry', 'balance', 'tendency'],
      mechanic: 'daily',
      memory: 'Recover to probability, then evidence.',
      visualContract: { kind: 'recovery', mustShow: ['authored shot path', 'all four recovery positions', 'opponent tendency only when earned'] },
      proInsight: {
        status: 'source_locked',
        player: 'Novak Djokovic',
        documentedMoment: 'Against most players, a great shot earns control. Against Djokovic, it often comes back deep because his movement begins with reading the next ball early.',
        gameSharpRead: 'Recovery begins before the opponent swings.',
        claimType: 'sourced_paraphrase',
        endorsement: false,
        source: {
          publisher: 'ATP Tour',
          title: 'The Magical Movement Of Novak Djokovic',
          published: '14 November 2023',
          url: 'https://www.atptour.com/en/news/djokovic-nitto-atp-finals-2023-movement-feature'
        }
      },
      playbookTarget: 'recovery_to_probability'
    },
    {
      id: 'movement_racket_reports_feet', theme: 'movement_footwork', sharpenTarget: 'movement', status: 'spine',
      title: 'Your Racket Is Reporting Your Feet',
      painHook: 'You keep changing the stroke while late, crowded or stretched contact keeps returning.',
      beforeBelief: 'A ball-flight error identifies the racket movement that caused it.',
      afterSight: 'The racket may be reporting where the feet arrived and whether balance ever formed.',
      tomorrowAction: 'Next time one stroke breaks down, notice spacing and balance before mechanics.',
      coreTruth: 'Time, space and balance are inputs to the swing, not separate from it.',
      boundary: 'Consistent spacing with the same miss can shift suspicion back toward mechanics.',
      decisionCues: ['arrival timing', 'body-ball spacing', 'balance at contact'],
      mechanic: 'fix_the_culprit',
      visualContract: { kind: 'spacing_diagnosis', mustShow: ['same swing family', 'different foot arrival', 'contact consequence'] },
      proInsight: researchRequired('Coco Gauff', 'Find authoritative coaching evidence about footwork or spacing changing forehand contact without turning it into a claim about a flaw.'),
      playbookTarget: 'feet_before_racket'
    },
    {
      id: 'movement_split_step_timing', theme: 'movement_footwork', sharpenTarget: 'movement', status: 'prototype',
      prototypeId: 'gold_split_step_timing_v1', slug: 'split-step',
      title: 'A Perfect Split Step Can Be Late',
      painHook: 'Your split step looks correct, yet the first move still begins after the ball is gone.',
      beforeBelief: 'Doing a split step is enough; its timing is secondary.',
      afterSight: 'Landing around opponent contact lets direction trigger the first committed move.',
      tomorrowAction: 'Next time you rally, sync your split to their strike and land ready to push as direction appears.',
      coreTruth: 'The split step is a timing event, not a pose.',
      boundary: 'Distance, opponent swing and ball speed alter the exact rhythm, not the contact relationship.',
      decisionCues: ['opponent contact', 'landing moment', 'first-direction step'],
      prototypeDecisionLenses: ['observation', 'timing', 'transfer'],
      mechanic: 'daily',
      memory: 'Land for the hit.',
      visualContract: { kind: 'split_step_timeline', mustShow: ['opponent contact frame', 'early landing', 'late landing'] },
      proInsight: {
        status: 'source_locked',
        player: 'Bianca Andreescu',
        documentedMoment: 'WTA highlighted Bianca Andreescu’s split step, alongside her drop shot, as a key to the creativity that powered her breakthrough.',
        gameSharpRead: 'Sync to the strike; land ready as direction appears.',
        claimType: 'sourced_paraphrase',
        endorsement: false,
        source: {
          publisher: 'WTA',
          title: 'TopCourt: Drop shot and split step key to Bianca Andreescu’s success',
          published: '12 October 2021',
          url: 'https://www.wtatennis.com/news/2287408/topcourt-drop-shot-and-split-step-key-to-bianca-andreescus-success'
        }
      },
      playbookTarget: 'split_on_contact'
    },

    // DECISION MAKING
    {
      id: 'decision_winner_can_be_wrong', theme: 'decision_making', sharpenTarget: 'decisions', status: 'prototype',
      prototypeId: 'gold_winner_wrong_shot_v1', slug: 'winner',
      title: 'The Winner Can Be the Wrong Shot',
      painHook: 'A low-percentage winner teaches you to repeat the choice that will usually cost you.',
      beforeBelief: 'Winning the point proves the decision was good.',
      afterSight: 'Judge the decision by evidence, margin and repeatability before judging the result.',
      tomorrowAction: 'Next time a risky winner lands, ask whether you would choose it ten times.',
      coreTruth: 'Outcome is one sample; decision quality is the repeatable process behind it.',
      boundary: 'Score and opponent can justify greater risk, but the reason must precede the outcome.',
      decisionCues: ['incoming ball class', 'target margin', 'repeatability'],
      prototypeDecisionLenses: ['outcome', 'repeatability', 'transfer'],
      mechanic: 'daily',
      memory: 'Judge the choice before the result.',
      visualContract: { kind: 'outcome_vs_decision', mustShow: ['same incoming ball', 'risky winner', 'repeatable alternative'] },
      proInsight: {
        status: 'source_locked',
        player: 'Carlos Alcaraz',
        documentedMoment: 'Ferrero described Alcaraz working toward consistency: one brilliant day is not enough when elite opponents keep demanding a high level.',
        gameSharpRead: 'Applause judges the outcome. Champions judge the choice.',
        claimType: 'sourced_paraphrase',
        endorsement: false,
        source: {
          publisher: 'ATP Tour',
          title: 'Ferrero on Alcaraz: Carlos is starting to focus more on himself',
          published: '4 June 2025',
          url: 'https://www.atptour.com/en/news/alcaraz-ferrero-focus-roland-garros-2025'
        }
      },
      playbookTarget: 'judge_choice_before_result'
    },
    {
      id: 'decision_one_point_is_noise', theme: 'decision_making', sharpenTarget: 'decisions', status: 'prototype',
      prototypeId:'gold_pattern_clue_v1',slug:'pattern-clue',prototypeDecisionLenses:['retain-conditions','compare-conditions','changed-contact'],memory:'Keep the conditions with the clue.',
      title: 'One Point Is a Clue',
      painHook: 'One surprise reply makes you abandon sound positioning and start guessing.',
      beforeBelief: 'A single successful surprise demands an immediate tactical overhaul.',
      afterSight: 'Attach the contact conditions to a reply before transferring its pattern to another situation.',
      tomorrowAction: 'Next time a reply surprises you, remember the contact that produced it.',
      coreTruth: 'Patterns should update probability, not replace observation with certainty.',
      boundary: 'A glaring physical limitation or obvious formation can justify an immediate response.',
      decisionCues: ['approach depth', 'receiver contact conditions', 'comparable replies'],
      mechanic: 'daily',
      visualContract: { kind: 'pattern_conditions', mustShow: ['deep stretched backhand lob', 'unlike balanced contact', 'new contact without leaked reply'] },
      proInsight:{status:'source_locked',player:'Roger Federer',documentedMoment:'In Miami, Federer explained that he anticipated replies from the shot he had played—not certainty about his opponent—and could still be wrong.',gameSharpRead:'Keep the incoming shot attached to the reply you remember.',claimType:'sourced_paraphrase',endorsement:false,source:{publisher:'ASAP Sports',title:'Roger Federer Miami interview',published:'26 March 2005',url:'https://www.asapsports.com/show_interview.php?id=21341'},evidenceBoundary:'Federer explicitly describes anticipation off his preceding shot, with uncertainty. GameSharp’s lob history and comparison method are authored illustrations, not his match reconstruction or a fixed-count rule.'},
      playbookTarget: 'evidence_before_adjustment'
    },
    {
      id: 'decision_open_court_not_open', theme: 'decision_making', sharpenTarget: 'decisions', status: 'prototype',
      prototypeId: 'gold_future_space_v1', slug: 'future-space',
      prototypeDecisionLenses: ['momentum', 'reversal', 'transfer'],
      memory: 'Play movement, not the photograph.',
      title: 'The Open Court Is Not Always Open',
      painHook: 'You hit toward empty space just as the opponent is already arriving there.',
      beforeBelief: 'The best target is wherever the opponent is not standing now.',
      afterSight: 'Read where their movement commits them, not only where the court looks empty.',
      tomorrowAction: 'Next time an opponent sprints, notice whether playing behind them becomes available.',
      coreTruth: 'Useful space is about the opponent’s next position, not a frozen picture.',
      boundary: 'Playing behind is strongest after genuine commitment; an unbalanced guess can reopen the other court.',
      decisionCues: ['movement direction', 'commitment level', 'contact balance'],
      mechanic: 'live_point',
      visualContract: { kind: 'court_read', mustShow: ['current empty space', 'opponent movement vector', 'behind-the-runner option'] },
      proInsight: {
        status: 'source_locked', player: 'Jelena Jankovic',
        documentedMoment: 'At Indian Wells, Jankovic’s coach Chip Brooks urged her to hit behind Kleybanova: running into the open court was helping her opponent attack.',
        gameSharpRead: 'Make their recovery part of your target.',
        claimType: 'sourced_paraphrase', endorsement: false,
        source: { publisher: 'Tennis Server · Vince Barr match report', title: 'Jankovic, Stosur, Ljubicic & Nadal All Advance At Indian Wells', published: '18 March 2010', url: 'https://www.tennisserver.com/photofeed/2010/100318-bnp_paribas_open.shtml' }
      },
      playbookTarget: 'play_the_future_space'
    }
  ];

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.freeze(value);
    Object.keys(value).forEach(function (key) { deepFreeze(value[key]); });
    return value;
  }

  function wordCount(value) {
    return String(value || '').replace(/[·—–]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  }

  function tokenSet(value) {
    return new Set(String(value || '').toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(function (word) { return word.length > 3; }));
  }

  function overlap(left, right) {
    const a = tokenSet(left), b = tokenSet(right);
    const intersection = Array.from(a).filter(function (word) { return b.has(word); }).length;
    const union = new Set(Array.from(a).concat(Array.from(b))).size;
    return union ? intersection / union : 1;
  }

  function audit() {
    const errors = [];
    const themeIds = new Set();
    const spineIds = new Set();
    const prototypeIds = new Set();
    const themeMap = new Map();
    if (themes.length !== 8) errors.push('The editorial system must contain exactly eight themes.');
    themes.forEach(function (theme) {
      if (!theme.id || themeIds.has(theme.id)) errors.push('Every editorial theme needs a unique ID.');
      themeIds.add(theme.id);
      themeMap.set(theme.id, theme);
      if (VALID_SHARPEN_TARGETS.indexOf(theme.sharpenTarget) === -1) errors.push(theme.id + ': invalid Sharpen destination.');
    });
    if (spines.length !== 24) errors.push('The lesson bank must contain exactly twenty-four spines.');
    spines.forEach(function (spine) {
      const prefix = spine.id || 'unknown_spine';
      if (!spine.id || spineIds.has(spine.id)) errors.push('Every lesson spine needs a unique ID.');
      spineIds.add(spine.id);
      const theme = themeMap.get(spine.theme);
      if (!theme) errors.push(prefix + ': unknown editorial theme.');
      if (theme && spine.sharpenTarget !== theme.sharpenTarget) errors.push(prefix + ': Sharpen route has drifted from its editorial theme.');
      if (!['prototype', 'spine'].includes(spine.status)) errors.push(prefix + ': invalid build status.');
      if (!spine.title || wordCount(spine.title) > 8) errors.push(prefix + ': title must stay memorable and mobile concise.');
      if (!spine.painHook || wordCount(spine.painHook) > 18) errors.push(prefix + ': pain hook is missing or bloated.');
      if (!spine.beforeBelief || wordCount(spine.beforeBelief) > 18) errors.push(prefix + ': before-belief is missing or bloated.');
      if (!spine.afterSight || wordCount(spine.afterSight) > 20) errors.push(prefix + ': after-sight is missing or bloated.');
      if (overlap(spine.beforeBelief, spine.afterSight) > 0.72) errors.push(prefix + ': belief shift is a paraphrase, not an aha.');
      if (!/^Next time/i.test(spine.tomorrowAction || '') || wordCount(spine.tomorrowAction) > 22) errors.push(prefix + ': tomorrow action must be short and begin “Next time”.');
      if (!spine.coreTruth || !spine.boundary) errors.push(prefix + ': tennis truth needs both a principle and a boundary.');
      if (!Array.isArray(spine.decisionCues) || spine.decisionCues.length !== 3 || new Set(spine.decisionCues).size !== 3) errors.push(prefix + ': exactly three distinct decision cues are required.');
      if (VALID_MECHANICS.indexOf(spine.mechanic) === -1) errors.push(prefix + ': invalid recommended mechanic.');
      if (!spine.visualContract || !spine.visualContract.kind || !Array.isArray(spine.visualContract.mustShow) || spine.visualContract.mustShow.length !== 3) errors.push(prefix + ': incomplete visual truth contract.');
      if (!spine.playbookTarget) errors.push(prefix + ': missing proposed Playbook destination.');
      const pro = spine.proInsight || {};
      if (spine.status === 'prototype') {
        if (!spine.prototypeId || prototypeIds.has(spine.prototypeId)) errors.push(prefix + ': prototype binding is missing or duplicated.');
        prototypeIds.add(spine.prototypeId);
        if (!Array.isArray(spine.prototypeDecisionLenses) || spine.prototypeDecisionLenses.length !== 3 || new Set(spine.prototypeDecisionLenses).size !== 3) errors.push(prefix + ': prototype needs three ordered, distinct decision lenses.');
        if (!spine.memory || wordCount(spine.memory) > 7) errors.push(prefix + ': prototype memory line is missing or too long.');
        if (pro.status !== 'source_locked' || !pro.player || !pro.documentedMoment || !pro.gameSharpRead || !pro.source) errors.push(prefix + ': prototype Pro Insight is not source-locked.');
        if (pro.claimType !== 'sourced_paraphrase' || pro.endorsement !== false) errors.push(prefix + ': prototype claim boundary is incomplete.');
        if (/[“”"]/.test(pro.documentedMoment || '')) errors.push(prefix + ': unverified direct quotation is forbidden.');
        if (!/^https:\/\//.test(pro.source && pro.source.url || '')) errors.push(prefix + ': source URL is missing or insecure.');
      } else {
        if (pro.status !== 'research_required' || !pro.playerCandidate || !pro.evidenceQuestion) errors.push(prefix + ': future story needs an explicit research brief.');
        if ('documentedMoment' in pro || 'gameSharpRead' in pro || 'source' in pro) errors.push(prefix + ': unverified future stories must be structurally non-renderable.');
      }
    });
    themes.forEach(function (theme) {
      const count = spines.filter(function (spine) { return spine.theme === theme.id; }).length;
      if (count !== 3) errors.push(theme.id + ': expected exactly three lesson spines, found ' + count + '.');
    });
    if (prototypeIds.size !== 21) errors.push('Exactly twenty-one validated lesson spines must be bound.');
    return Object.freeze({
      ok: errors.length === 0,
      errors: Object.freeze(errors),
      counts: Object.freeze({
        themes: themes.length,
        spines: spines.length,
        prototypes: prototypeIds.size,
        sourceLocked: spines.filter(function (spine) { return spine.proInsight.status === 'source_locked'; }).length,
        researchRequired: spines.filter(function (spine) { return spine.proInsight.status === 'research_required'; }).length
      })
    });
  }

  deepFreeze(themes);
  deepFreeze(spines);
  const byId = Object.freeze(spines.reduce(function (map, spine) { map[spine.id] = spine; return map; }, {}));
  const report = audit();

  return Object.freeze({
    version: VERSION,
    themes: themes,
    spines: spines,
    byId: byId,
    validMechanics: VALID_MECHANICS,
    audit: audit,
    integrity: report
  });
});
