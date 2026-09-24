(function (root, factory) {
  const lessonSpines = typeof module === 'object' && module.exports
    ? require('./gold-daily-lesson-spines.js')
    : root && root.GameSharpGoldLessonSpines;
  const dailyLoop = typeof module === 'object' && module.exports ? require('./gold-daily-loop.js') : root && root.GameSharpGoldDailyLoop;
  const highBall = typeof module === 'object' && module.exports ? require('./gold-daily-high-ball.js') : root && root.HighBallEvidence;
  const construction = typeof module === 'object' && module.exports ? require('./gold-daily-construction.js') : root && root.GoldDailyConstruction;
  const tradeoffs = typeof module === 'object' && module.exports ? require('./gold-daily-tradeoffs.js') : root && root.GoldDailyTradeoffs;
  const returnTime = typeof module === 'object' && module.exports ? require('./gold-daily-return-time.js') : root && root.GoldDailyReturnTime;
  const serveQuality = typeof module === 'object' && module.exports ? require('./gold-daily-serve-quality.js') : root && root.GoldDailyServeQuality;
  const patterns = typeof module === 'object' && module.exports ? require('./gold-daily-patterns.js') : root && root.GoldDailyPatterns;
  const api = factory(root || {}, lessonSpines, dailyLoop, highBall, construction, tradeoffs, returnTime, serveQuality, patterns);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GameSharpGoldDaily = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root, lessonSpines, dailyLoop, highBall, construction, tradeoffs, returnTime, serveQuality, patterns) {
  'use strict';

  const VERSION = '2026-09-21.gold-daily.35';
  const lessonExtensions = [returnTime, serveQuality, patterns].filter(Boolean);
  function extensionFor(step) { return step && step.visual && lessonExtensions.find(function(module){return module.kinds.includes(step.visual.kind);}); }
  const EDITORIAL_DISCLOSURE = 'Independent GameSharp analysis · no player endorsement or affiliation.';
  const REQUIRED_EVENTS = Object.freeze([
    'challenge_started',
    'interaction_1_answered',
    'interaction_2_answered',
    'interaction_3_answered',
    'challenge_completed',
    'next_daily_challenge_started'
  ]);

  // One timing source drives each visual trace, cue reveal and recorded court
  // sound. Times are seconds from the start of a scene; nothing decorative is
  // allowed to invent its own independent clock.
  const EVIDENCE_TIMELINES = Object.freeze({
    ...(construction ? construction.timelines : {}),
    ...(tradeoffs ? tradeoffs.timelines : {}),
    ...Object.assign({}, ...lessonExtensions.map(function(module){return module.timelines;})),
    high_ball_contrast: Object.freeze({
      read: Object.freeze({total:4.50,questionAt:4.1,cueAt:Object.freeze([.35,1.85,3.40])}),
      answer: Object.freeze({total:8.95,questionAt:0,inkAt:4.15,correctionAt:4.4,correctionInkAt:8.55,cueAt:Object.freeze([0,0,0])})
    }),
    court_read: Object.freeze({
      read: Object.freeze({ total: 3.20, contactAt: .10, bounceAt: .76, flight: 1.24, movementAt: .18, movement: 1.16, questionAt: 2.78, cueAt: Object.freeze([.30, 1.40, 2.18]) }),
      answer: Object.freeze({ total: 4.30, contactAt: .20, flight: .88, bounceAt: 1.08, movementAt: .04, movement: .16, correctionAt: 2.22, questionAt: 0, inkAt: 1.70, correctionInkAt: 3.92, cueAt: Object.freeze([0, 0, 0]) })
    }),
    recovery: Object.freeze({
      read: Object.freeze({ total: 2.10, contactAt: .10, flight: .78, bounceAt: .60, movementAt: .42, movement: .42, questionAt: 1.74, cueAt: Object.freeze([.18, .72, 1.26]) }),
      answer: Object.freeze({ total: 1.60, movementAt: .10, movement: .52, correctionAt: .76, questionAt: 0, inkAt: .72, correctionInkAt: 1.34, cueAt: Object.freeze([0, 0, 0]) })
    }),
    shortBall: Object.freeze({
      read: Object.freeze({ total: 2.18, contactAt: .10, flight: .74, bounceAt: .58, movementAt: .34, movement: .46, questionAt: 1.82, cueAt: Object.freeze([.18, .76, 1.32]) }),
      answer: Object.freeze({ total: 1.65, contactAt: .08, flight: .55, bounceAt: .46, movementAt: .15, movement: .42, correctionAt: .72, questionAt: 0, inkAt: .78, correctionInkAt: 1.34, cueAt: Object.freeze([0, 0, 0]) })
    }),
    contact: Object.freeze({
      read: Object.freeze({ total: 3.90, contactAt: 1.05, movementAt: .18, movement: .34, questionAt: 3.48, cueAt: Object.freeze([.18, 1.12, 2.94]) }),
      answer: Object.freeze({ total: 3.55, contactAt: 1.05, movementAt: .18, movement: .34, correctionAt: 2.92, questionAt: 0, inkAt: 3.14, correctionInkAt: 3.14, cueAt: Object.freeze([0, 0, 0]) })
    }),
    direction_change: Object.freeze({
      read: Object.freeze({ total: 3.15, contactAt: .12, flight: 1.10, bounceAt: .66, movementAt: .46, movement: .78, questionAt: 2.72, cueAt: Object.freeze([.92, 1.55, 2.18]) }),
      answer: Object.freeze({ total: 2.65, contactAt: .12, flight: .78, bounceAt: .55, movementAt: .12, movement: .72, correctionAt: 1.25, questionAt: 0, inkAt: 1.08, correctionInkAt: 2.18, cueAt: Object.freeze([0, 0, 0]) })
    }),
    serve_plus_one: Object.freeze({
      read: Object.freeze({ total: 3.55, serveAt: .10, serveFlight: 1.05, serveBounceAt: .68, returnAt: 1.45, returnFlight: 1.00, returnBounceAt: 1.98, movementAt: 1.45, movement: .72, questionAt: 3.02, cueAt: Object.freeze([.32, 1.52, 2.42]) }),
      answer: Object.freeze({ total: 4.25, serveAt: .08, serveFlight: .98, serveBounceAt: .62, returnAt: 1.36, returnFlight: .90, returnBounceAt: 1.88, movementAt: 1.36, movement: .70, plusOneAt: 2.48, plusOneFlight: .78, plusOneBounceAt: 2.98, correctionAt: 3.10, questionAt: 0, returnInkAt: 2.40, plusOneInkAt: 3.42, correctionInkAt: 4.05, cueAt: Object.freeze([0, 0, 0]) })
    }),
    return_position: Object.freeze({
      read: Object.freeze({ total: 3.12, serveAt: .12, serveFlight: 1.16, serveBounceAt: .66, contactAt: 1.38, returnFlight: .70, returnBounceAt: 1.78, movementAt: .30, movement: .46, questionAt: 2.70, cueAt: Object.freeze([.28, 1.30, 2.06]) }),
      answer: Object.freeze({ total: 3.18, serveAt: .10, serveFlight: 1.10, serveBounceAt: .62, contactAt: 1.34, returnFlight: .66, returnBounceAt: 1.72, movementAt: .24, movement: .44, correctionAt: 2.18, questionAt: 0, inkAt: 2.48, correctionInkAt: 2.88, cueAt: Object.freeze([0, 0, 0]) })
    }),
    split_step_timeline: Object.freeze({
      read: Object.freeze({ total: 3.24, loadAt: .22, contactAt: 1.12, flight: 1.00, bounceAt: 1.72, movementAt: .18, movement: .54, questionAt: 2.82, cueAt: Object.freeze([.24, 1.30, 2.18]) }),
      answer: Object.freeze({ total: 4.32, loadAt: .16, contactAt: .88, flight: .92, bounceAt: 1.42, movementAt: .16, movement: .50, correctionAt: 2.12, questionAt: 0, inkAt: 2.08, correctionInkAt: 4.02, cueAt: Object.freeze([0, 0, 0]) })
    }),
    outcome_vs_decision: Object.freeze({
      read: Object.freeze({ total: 3.08, contactAt: .86, flight: .70, bounceAt: 1.56, outcomeAt: 1.68, movementAt: .22, movement: .42, questionAt: 2.66, cueAt: Object.freeze([.88, 1.48, 2.10]) }),
      answer: Object.freeze({ total: 2.82, contactAt: .14, flight: .88, bounceAt: .64, outcomeAt: 1.20, movementAt: .18, movement: .40, correctionAt: 1.48, questionAt: 0, inkAt: 2.16, correctionInkAt: 2.54, cueAt: Object.freeze([0, 0, 0]) })
    }),
    two_point_sequence: Object.freeze({
      read: Object.freeze({ total: 3.60, firstAt: .14, firstFlight: .78, secondAt: 1.34, secondFlight: .82, secondBounceAt: 2.16, responseAt: 2.32, movementAt: 1.18, movement: .42, questionAt: 3.18, cueAt: Object.freeze([.96, 1.60, 2.62]) }),
      answer: Object.freeze({ total: 3.60, firstAt: .10, firstFlight: .70, secondAt: 1.14, secondFlight: .74, secondBounceAt: 1.88, responseAt: 2.04, movementAt: 1.00, movement: .40, correctionAt: 2.22, questionAt: 0, inkAt: 3.10, correctionInkAt: 3.30, cueAt: Object.freeze([0, 0, 0]) })
    })
  });
  const ATTENTION_POLICY = 'evidence-first';
  const NATURAL_AUDIO_TYPES = Object.freeze(['serve', 'ground', 'slice', 'bounce', 'shoe']);

  function boundSpine(id) {
    return lessonSpines && lessonSpines.byId && lessonSpines.byId[id] || null;
  }

  const RECOVERY_SPINE = boundSpine('movement_recovery_probability');
  const SHORT_BALL_SPINE = boundSpine('net_short_ball_permission');
  const CONTACT_SPINE = boundSpine('forehand_contact_upstream');
  const DIRECTION_CHANGE_SPINE = boundSpine('backhand_line_must_be_earned');
  const SERVE_PLUS_ONE_SPINE = boundSpine('serve_plus_one_is_unit');
  const MENTAL_RESET_SPINE = boundSpine('mental_miss_steals_next_point');
  const RETURN_POSITION_SPINE = boundSpine('return_position_is_dial');
  const SPLIT_STEP_SPINE = boundSpine('movement_split_step_timing');
  const DECISION_QUALITY_SPINE = boundSpine('decision_winner_can_be_wrong');

  // Camera is behind the near-baseline server. A right-handed deuce-court
  // slice begins screen-right, lands in the far-left service box and exits
  // the bounce farther screen-left. These facts travel as one contract so a
  // later visual edit cannot flip only one part of the tennis geometry.
  const RIGHT_HANDED_DEUCE_SLICE = Object.freeze({
    handedness: 'right',
    courtSide: 'deuce',
    spin: 'slice',
    camera: 'server-behind',
    screenExit: 'left',
    server: Object.freeze([178, 152]),
    bounce: Object.freeze([52, 64]),
    returner: Object.freeze([34, 20]),
    path: Object.freeze([
      Object.freeze([178, 152]),
      Object.freeze([136, 113]),
      Object.freeze([52, 64]),
      Object.freeze([43, 44]),
      Object.freeze([34, 20])
    ])
  });

  const challenges = [
    {
      id: 'gold_recovery_position_v1',
      slug: 'recovery',
      lessonSpineId: 'movement_recovery_probability',
      attentionPolicy: ATTENTION_POLICY,
      title: RECOVERY_SPINE && RECOVERY_SPINE.title,
      memory: RECOVERY_SPINE && RECOVERY_SPINE.memory,
      insight: RECOVERY_SPINE && RECOVERY_SPINE.painHook,
      takeItToCourt: RECOVERY_SPINE && RECOVERY_SPINE.tomorrowAction,
      proInsight: RECOVERY_SPINE && RECOVERY_SPINE.proInsight,
      steps: [
        {
          phase: 'See · Find the default',
          decisionLens: 'geometry',
          situation: 'Your deep crosscourt forehand pushes them outside the sideline; you finish balanced.',
          question: 'Best percentage starting position?',
          options: [
            { id: 'A', text: 'Left of centre, behind the baseline' },
            { id: 'B', text: 'Right of centre, behind the baseline' },
            { id: 'C', text: 'Dead centre, step inside the court' },
            { id: 'D', text: 'Hold the forehand sideline and advance' }
          ],
          correct: 1,
          unlock: 'The default moves',
          payoff: 'Best default: shade right while remaining balanced behind the baseline.',
          principle: 'Your shot changed the likely reply angles, so the useful centre moved too.',
          why: 'Their widest, safest reply remains crosscourt, so the percentage starting point shifts with that angle. It is a default, not a fixed coordinate.',
          visual: {
            kind: 'recovery',
            label: 'Deep crosscourt forehand',
            cues: ['1 DEEP & WIDE', '2 OPPONENT OUTSIDE', '3 YOU FINISH SET'],
            description: 'Top-down singles court. Your shot travels from the near forehand side to an opponent pulled wide on the far side; four recovery positions are marked.',
            player: [188, 146], opponent: [38, 23], shot: [[188, 141], [122, 79], [38, 23]],
            targets: [[97, 160], [148, 160], [124, 135], [185, 123]]
          }
        },
        {
          phase: 'Contrast · Add balance',
          decisionLens: 'balance',
          situation: 'Your shorter ball leaves them balanced; you are still regaining your base.',
          question: 'How should you adjust?',
          options: [
            { id: 'A', text: 'Keep the aggressive rightward shade' },
            { id: 'B', text: 'Move forward and take away time' },
            { id: 'C', text: 'Recover nearer centre and give ground' },
            { id: 'D', text: 'Stay wide and protect crosscourt only' }
          ],
          correct: 2,
          unlock: 'Balance changes the call',
          payoff: 'Recover nearer centre and give yourself more time.',
          principle: 'Shot quality and your balance override the earlier aggressive recovery position.',
          why: 'A balanced opponent with time can use both sides; you also need time to regain your base. Recover deeper until the picture improves.',
          visual: {
            kind: 'recovery',
            label: 'Shorter, slower forehand',
            cues: ['1 SHORTER BALL', '2 OPPONENT SET', '3 YOU RECOVERING'],
            description: 'Top-down singles court. Your shorter ball reaches a balanced opponent near the middle inside the far baseline; four recovery positions are marked.',
            player: [188, 146], opponent: [106, 39], shot: [[188, 141], [150, 91], [106, 39]],
            targets: [[150, 148], [125, 116], [124, 160], [188, 148]]
          }
        },
        {
          phase: 'Transfer · Add evidence',
          transfer: true,
          decisionLens: 'tendency',
          situation: 'You repeat the deep ball; they have redirected down the line four times.',
          question: 'What does that evidence earn?',
          options: [
            { id: 'A', text: 'Keep exactly the original recovery shade' },
            { id: 'B', text: 'Nudge toward the line and stay balanced' },
            { id: 'C', text: 'Shade far left to cover the line' },
            { id: 'D', text: 'Charge forward and cut off the reply' }
          ],
          correct: 1,
          unlock: 'The pattern earns a nudge',
          payoff: 'Respect the pattern with a measured nudge toward the line.',
          principle: 'Geometry sets the default; repeated evidence can adjust it without replacing it.',
          why: 'Do not abandon the larger crosscourt space for a guess. Shift by a step; score, speed and your own balance can change how much.',
          visual: {
            kind: 'recovery',
            label: 'Deep ball plus a proven tendency',
            cues: ['1 CROSSCOURT ANGLE', '2 4× LINE REPLIES', '3 YOU STAY SET'],
            description: 'Top-down singles court. Your deep crosscourt forehand pulls the opponent wide. Their repeated down-the-line reply is shown, with four possible recovery adjustments.',
            player: [188, 146], opponent: [38, 23], shot: [[188, 141], [122, 79], [38, 23]],
            tendency: [[38, 23], [40, 76], [46, 146]], tendencyLabel: '4× DOWN THE LINE',
            targets: [[148, 160], [126, 160], [72, 160], [125, 119]]
          }
        }
      ]
    },
    {
      id: 'gold_short_ball_attack_v1',
      slug: 'short-ball',
      lessonSpineId: 'net_short_ball_permission',
      attentionPolicy: ATTENTION_POLICY,
      title: SHORT_BALL_SPINE && SHORT_BALL_SPINE.title,
      memory: SHORT_BALL_SPINE && SHORT_BALL_SPINE.memory,
      insight: SHORT_BALL_SPINE && SHORT_BALL_SPINE.painHook,
      takeItToCourt: SHORT_BALL_SPINE && SHORT_BALL_SPINE.tomorrowAction,
      proInsight: SHORT_BALL_SPINE && SHORT_BALL_SPINE.proInsight,
      steps: [
        {
          phase: 'See · Decide',
          decisionLens: 'opportunity',
          situation: 'The ball sits waist-high; you are set and your opponent is stranded.',
          question: 'What has this ball earned?',
          options: [
            { id: 'A', text: 'Drive firmly at them and close' },
            { id: 'B', text: 'Drive with margin into open court, then close' },
            { id: 'C', text: 'Flatten hard toward the nearest sideline' },
            { id: 'D', text: 'Loop deep through the middle and reset' }
          ],
          correct: 1,
          unlock: 'Attack earned',
          payoff: 'Attack: your height and balance let you control the open court.',
          principle: 'The short bounce invited you forward; the full cue set earned aggression.',
          why: 'Use a generous target and close behind the shot rather than demanding a winner. Short alone never made the decision.',
          visual: {
            kind: 'shortBall',
            label: 'High · balanced · opponent displaced',
            cues: ['1 WAIST-HIGH', '2 YOU SET', '3 OPPONENT STRANDED'],
            description: 'Top-down singles court. You meet a waist-high short ball near the service line while the opponent is beyond the far right sideline.',
            player: [110, 116], ball: [111, 105], opponent: [218, 28], incoming: [[218, 28], [170, 66], [111, 105]],
            ballLabel: 'WAIST-HIGH', playerState: 'SET', opponentState: 'DISPLACED',
            paths: [[[111,105],[174,47],[205,28]], [[111,105],[78,65],[54,27]], [[111,105],[76,65],[41,28]], [[111,105],[119,61],[125,28]]]
          }
        },
        {
          phase: 'Contrast',
          decisionLens: 'constraint',
          situation: 'This one stays below your knee; you reach it stretched and late.',
          question: 'What is the percentage response?',
          options: [
            { id: 'A', text: 'Flatten it hard down the line' },
            { id: 'B', text: 'Roll a short angle crosscourt' },
            { id: 'C', text: 'Lift softly through the middle and recover' },
            { id: 'D', text: 'Lift deep crosscourt and recover your base' }
          ],
          correct: 3,
          unlock: 'Rebuild first',
          payoff: 'Rebuild: low contact and poor balance make acceleration unreliable.',
          principle: 'Height and depth buy back the time your stretched position has taken away.',
          why: 'A balanced opponent already covers both sides. Forcing a winner compounds your defensive position instead of solving it.',
          visual: {
            kind: 'shortBall',
            label: 'Low · stretched · opponent set',
            cues: ['1 BELOW KNEE', '2 YOU STRETCHED', '3 OPPONENT SET'],
            description: 'Top-down singles court. You reach a low short ball outside the near left singles line; the opponent is balanced near the far centre.',
            player: [30, 113], ball: [42, 105], opponent: [125, 26], incoming: [[125,26],[86,67],[42,105]],
            ballLabel: 'LOW', playerState: 'STRETCHED', opponentState: 'SET',
            paths: [[[42,105],[42,63],[44,27]], [[42,105],[79,79],[96,70]], [[42,105],[86,80],[125,70]], [[42,105],[95,66],[160,27]]]
          }
        },
        {
          phase: 'Transfer',
          transfer: true,
          decisionLens: 'transfer',
          situation: 'Your heavy ball earns a short slice; you arrive balanced while they remain deep.',
          question: 'What level of attack is earned?',
          options: [
            { id: 'A', text: 'Flatten hard into the open corner' },
            { id: 'B', text: 'Lift a controlled approach and close behind it' },
            { id: 'C', text: 'Reset high through the middle and retreat' },
            { id: 'D', text: 'Carve low crosscourt but remain behind' }
          ],
          correct: 1,
          unlock: 'Attack, not finish',
          payoff: 'Controlled attack: balance earns the approach, but low contact limits the finish.',
          principle: 'You combined mixed cues instead of treating short as a binary command.',
          why: 'The earlier heavy ball created territory. Low contact asks for lift and margin; their deep position still supports moving forward.',
          visual: {
            kind: 'shortBall',
            label: 'Low · stable · opponent deep',
            cues: ['1 LOW CONTACT', '2 YOU STABLE', '3 OPPONENT DEEP'],
            description: 'Top-down singles court. You meet a low short slice in balance while the opponent remains deep and wide on the far right.',
            player: [103, 116], ball: [105, 104], opponent: [214, 28], incoming: [[214,28],[159,66],[105,104]],
            ballLabel: 'LOW', playerState: 'STABLE', opponentState: 'DEEP',
            paths: [[[105,104],[76,60],[43,22]], [[105,104],[84,65],[58,30]], [[105,104],[118,65],[125,28]], [[105,104],[116,80],[128,74]]]
          }
        }
      ]
    },
    {
      id: 'gold_contact_point_v1',
      slug: 'contact',
      lessonSpineId: 'forehand_contact_upstream',
      attentionPolicy: ATTENTION_POLICY,
      title: CONTACT_SPINE && CONTACT_SPINE.title,
      memory: CONTACT_SPINE && CONTACT_SPINE.memory,
      insight: CONTACT_SPINE && CONTACT_SPINE.painHook,
      takeItToCourt: CONTACT_SPINE && CONTACT_SPINE.tomorrowAction,
      proInsight: CONTACT_SPINE && CONTACT_SPINE.proInsight,
      steps: [
        {
          phase: 'See · Read the frame',
          decisionLens: 'observation',
          situation: 'The forehand misses wide. Freeze the moment of contact.',
          question: 'Which detail is actually visible?',
          options: [
            { id: 'A', text: 'The player leans backward at contact' },
            { id: 'B', text: 'The racket drops far below the ball' },
            { id: 'C', text: 'The ball is unusually close to the body' },
            { id: 'D', text: 'The feet cross before the forward swing' }
          ],
          correct: 2,
          unlock: 'Crowded at contact',
          payoff: 'The visible clue is crowded contact—not its cause.',
          principle: 'Check the body-ball relationship before rebuilding the swing.',
          why: 'A single frame cannot prove why contact became crowded. Repeated examples can tell you whether spacing is worth investigating.',
          evidence: {
            observed: 'The ball is unusually close to the player at contact.',
            inference: 'The contact may be crowded, but this frame cannot establish why.',
            courtCheck: 'Watch several comparable forehands for the same body-ball relationship.'
          },
          visual: {
            kind: 'contact', label: 'Forehand contact in motion',
            cues: ['1 MISS WIDE', '2 HOLD CONTACT', '3 READ PLAYER SHAPE'],
            previewDescription: 'A forehand motion pauses at contact so the visible relationship between player, racket and ball can be judged.',
            description: 'The forehand pauses with the ball crowded close to the body. After the decision, the same camera compares that frame with more usable hitting space.',
            focusCue: 'Watch the space between the ball and the player at contact.',
            motion: { stroke: 'forehand', fault: 'jammed', outcome: 'wide', reveal: 'fix-then-compare', contactFrame: 0.61, previewMode: 'miss', showOutcome: true }
          }
        },
        {
          phase: 'Contrast · Isolate the change',
          decisionLens: 'contrast',
          situation: 'Same camera and ball; now watch the reference forehand.',
          question: 'What changed from the first forehand?',
          options: [
            { id: 'A', text: 'The ball sits farther from the player’s body' },
            { id: 'B', text: 'The player leans farther away from the ball' },
            { id: 'C', text: 'The feet cross before the forward swing' },
            { id: 'D', text: 'The racket stops closer to the shoulder' }
          ],
          correct: 0,
          unlock: 'More usable space',
          payoff: 'The reference creates visibly more hitting space.',
          principle: 'The comparison isolates spacing; it does not diagnose what created it.',
          why: 'The camera, ball and player stay matched. Only the contact relationship changes, so that is the distinction this example can defend.',
          evidence: {
            observed: 'The reference frame places the ball farther from the player’s body.',
            inference: 'The larger gap may offer more usable space through contact.',
            courtCheck: 'Compare the body-ball gap without assuming what created it.'
          },
          visual: {
            kind: 'contact', label: 'Forehand spacing comparison',
            cues: ['1 SAME CAMERA', '2 SAME BALL', '3 COMPARE SPACING'],
            previewDescription: 'A second forehand plays into the same held contact frame so its body-ball spacing can be compared with the first example.',
            description: 'The same camera compares the crowded frame with a reference frame that leaves more usable space between the ball and the player.',
            focusCue: 'Compare the space between the ball and the player.',
            motion: { stroke: 'forehand', fault: 'jammed', outcome: 'wide', reveal: 'fix-then-compare', contactFrame: 0.61, previewMode: 'fix', showOutcome: false }
          }
        },
        {
          phase: 'Transfer',
          transfer: true,
          decisionLens: 'transfer',
          situation: 'A different forehand now lands short instead of wide.',
          question: 'Which earlier clue appears again?',
          options: [
            { id: 'A', text: 'The swing finishes high above the shoulder' },
            { id: 'B', text: 'The ball again crowds the player’s body' },
            { id: 'C', text: 'The player leans backward after contact' },
            { id: 'D', text: 'The feet cross before the forward swing' }
          ],
          correct: 1,
          unlock: 'One clue · two misses',
          payoff: 'The outcome changed—but the contact clue did not.',
          principle: 'Different misses can share one observable upstream clue.',
          why: 'This still does not prove one cause. It gives you a specific relationship to observe across several comfortable forehands.',
          evidence: {
            observed: 'The ball lands short while the contact frame remains crowded.',
            inference: 'Different outcomes may share the same body-ball clue.',
            courtCheck: 'Check whether that relationship repeats before changing technique.'
          },
          visual: {
            kind: 'contact', label: 'New outcome, same contact clue',
            cues: ['1 LANDS SHORT', '2 HOLD CONTACT', '3 REPEAT THE CHECK'],
            previewDescription: 'A forehand produces a different outcome and pauses at contact so the body-ball spacing can be judged.',
            description: 'The ball lands short while the held frame preserves the same crowded body-ball relationship. The comparison then shows more usable space.',
            focusCue: 'Ignore the landing first. Watch the body-ball gap at contact.',
            motion: { stroke: 'forehand', fault: 'jammed', outcome: 'short', reveal: 'fix-then-compare', contactFrame: 0.61, previewMode: 'miss', showOutcome: true }
          }
        }
      ]
    },
    {
      id: 'gold_direction_change_v1',
      slug: 'line',
      lessonSpineId: 'backhand_line_must_be_earned',
      attentionPolicy: ATTENTION_POLICY,
      title: DIRECTION_CHANGE_SPINE && DIRECTION_CHANGE_SPINE.title,
      memory: DIRECTION_CHANGE_SPINE && DIRECTION_CHANGE_SPINE.memory,
      insight: DIRECTION_CHANGE_SPINE && DIRECTION_CHANGE_SPINE.painHook,
      takeItToCourt: DIRECTION_CHANGE_SPINE && DIRECTION_CHANGE_SPINE.tomorrowAction,
      proInsight: DIRECTION_CHANGE_SPINE && DIRECTION_CHANGE_SPINE.proInsight,
      steps: [
        {
          phase: 'See · Read the contact',
          decisionLens: 'constraint',
          situation: 'The line is open; the low ball pulls you wide near the sideline.',
          question: 'Has this contact earned the line?',
          options: [
            { id: 'A', text: 'Drive hard down the open line' },
            { id: 'B', text: 'Roll deep crosscourt with net margin' },
            { id: 'C', text: 'Float short through the middle' },
            { id: 'D', text: 'Carve short crosscourt and follow forward' }
          ],
          correct: 1,
          unlock: 'The line is not free',
          payoff: 'The court was open, but your contact was not.',
          principle: 'Low, stretched contact has not earned the direction change.',
          why: 'Crosscourt gives you more court, a lower net and recovery time. The visible line asks a difficult contact to do even more.',
          visual: {
            kind: 'direction_change',
            label: 'Low backhand · stretched wide',
            cues: ['1 LOW BALL', '2 STRETCHED', '3 LONG WAY HOME'],
            description: 'Top-down singles court. A crosscourt ball pulls the player wide to a low backhand; four reply paths and the exposed recovery distance are visible.',
            player: [47, 139], opponent: [204, 22], ball: [47, 132], incoming: [[204,22],[148,57],[86,105],[47,132]],
            ballLabel: 'LOW', playerState: 'STRETCHED', exposure: [191, 146], exposureLabel: 'LONG WAY HOME',
            paths: [[[47,132],[49,73],[50,24]], [[47,132],[111,73],[198,24]], [[47,132],[88,90],[125,68]], [[47,132],[120,89],[190,69]]]
          }
        },
        {
          phase: 'Contrast · Earn the line',
          decisionLens: 'permission',
          situation: 'The next crosscourt ball lands shorter; you meet it waist-high and balanced.',
          question: 'Which option is newly available?',
          options: [
            { id: 'A', text: 'Roll deep crosscourt and reset position' },
            { id: 'B', text: 'Drive down the line with margin' },
            { id: 'C', text: 'Drop short and move behind it' },
            { id: 'D', text: 'Lift high through middle and recover' }
          ],
          correct: 1,
          unlock: 'Now the line is earned',
          payoff: 'Now the line is available—not compulsory.',
          principle: 'Height and balance create permission; they do not remove judgment.',
          why: 'Shorter depth gives you time to set and meet the ball above the danger zone. Margin still matters because changing direction shortens the court.',
          visual: {
            kind: 'direction_change',
            label: 'Waist-high backhand · balanced',
            cues: ['1 WAIST-HIGH', '2 BALANCED', '3 BASE SECURE'],
            description: 'Top-down singles court. A shorter crosscourt ball reaches a balanced backhand inside the baseline; four reply paths show the available targets.',
            player: [68, 117], opponent: [198, 23], ball: [70, 110], incoming: [[198,23],[145,58],[96,91],[70,110]],
            ballLabel: 'WAIST-HIGH', playerState: 'BALANCED', exposure: [170, 145], exposureLabel: 'BASE SECURE',
            paths: [[[70,110],[127,69],[195,25]], [[70,110],[62,69],[52,25]], [[70,110],[85,88],[98,72]], [[70,110],[101,67],[125,27]]]
          }
        },
        {
          phase: 'Transfer · Change wings',
          transfer: true,
          decisionLens: 'transfer',
          situation: 'A deep forehand stays low; you reach it near the sideline while moving.',
          question: 'Which reply protects this contact?',
          options: [
            { id: 'A', text: 'Drive down the line behind their recovery' },
            { id: 'B', text: 'Roll deep crosscourt and regain your base' },
            { id: 'C', text: 'Lift high through the middle and advance' },
            { id: 'D', text: 'Carve short crosscourt and hold position' }
          ],
          correct: 1,
          unlock: 'The wing does not decide',
          payoff: 'Different wing, same constraint: movement has not earned the line.',
          principle: 'Direction change depends on contact quality, not which wing receives the ball.',
          why: 'The forehand may feel stronger, but low moving contact still reduces control. Crosscourt supplies net clearance, court length and recovery time.',
          visual: {
            kind: 'direction_change',
            label: 'Low forehand · moving wide',
            cues: ['1 LOW BALL', '2 MOVING', '3 LONG WAY HOME'],
            description: 'Top-down singles court. A deep crosscourt ball pulls the player wide to a moving forehand; four reply paths test the same contact rule on a new wing.',
            player: [203, 139], opponent: [46, 22], ball: [202, 132], incoming: [[46,22],[103,57],[166,105],[202,132]],
            ballLabel: 'LOW', playerState: 'MOVING', exposure: [59, 146], exposureLabel: 'LONG WAY HOME',
            paths: [[[202,132],[201,73],[200,24]], [[202,132],[139,73],[50,24]], [[202,132],[164,75],[125,30]], [[202,132],[130,89],[60,69]]]
          }
        }
      ]
    },
    {
      id: 'gold_serve_plus_one_v1',
      slug: 'serve-plus-one',
      lessonSpineId: 'serve_plus_one_is_unit',
      attentionPolicy: ATTENTION_POLICY,
      title: SERVE_PLUS_ONE_SPINE && SERVE_PLUS_ONE_SPINE.title,
      screenTitle: 'Serve + First Ball',
      memory: SERVE_PLUS_ONE_SPINE && SERVE_PLUS_ONE_SPINE.memory,
      insight: SERVE_PLUS_ONE_SPINE && SERVE_PLUS_ONE_SPINE.painHook,
      takeItToCourt: SERVE_PLUS_ONE_SPINE && SERVE_PLUS_ONE_SPINE.tomorrowAction,
      proInsight: SERVE_PLUS_ONE_SPINE && SERVE_PLUS_ONE_SPINE.proInsight,
      steps: [
        {
          phase: 'See · Spot the pattern',
          decisionLens: 'prediction',
          situation: 'Your last two wide serves pulled this returner outside the court. Watch both replies.',
          question: 'What return should you be ready for next?',
          options: [
            { id: 'A', text: 'A deep return into your backhand corner' },
            { id: 'B', text: 'A shorter return through the middle' },
            { id: 'C', text: 'A sharp return into your forehand corner' },
            { id: 'D', text: 'A deep return straight at your feet' }
          ],
          correct: 1,
          unlock: 'The serve shapes a reply',
          payoff: 'The pattern suggests short middle—not a guaranteed ball.',
          principle: 'Serve location changes the returner’s time, reach and likely reply lanes.',
          why: 'Two repeated replies earn preparation, not pre-commitment. Be ready to use that pattern while continuing to read the contact.',
          visual: {
            kind: 'serve_plus_one',
            label: 'Wide serve · repeated reply',
            cues: ['1 SLICE WIDE', '2 STRETCHED', '3 WATCH LANDING'],
            answerCues: ['1 SLICE WIDE', '2 STRETCHED', '3 SHORT MIDDLE ×2'],
            description: 'Top-down singles court from behind a right-handed deuce-court server. The slice lands in the far-left service box, exits screen-left and pulls the returner outside the singles sideline. One live and one ghosted return then show two short-middle replies; answer targets remain hidden until selection.',
            serveContract: RIGHT_HANDED_DEUCE_SLICE,
            choiceRole: 'return', server: RIGHT_HANDED_DEUCE_SLICE.server, returner: RIGHT_HANDED_DEUCE_SLICE.returner, contact: [125, 124],
            serve: RIGHT_HANDED_DEUCE_SLICE.path, serveBounce: RIGHT_HANDED_DEUCE_SLICE.bounce,
            returnPath: [RIGHT_HANDED_DEUCE_SLICE.returner,[72,59],[114,102],[125,124]], returnBounce: [114,102],
            evidencePaths: [[[36,20],[78,62],[128,104],[132,121]]],
            hideTargetsBeforeAnswer: true,
            serveLabel: 'SLICE WIDE', returnLabel: 'WATCH LANDING', answeredReturnLabel: 'SHORT MIDDLE ×2', playerState: 'READY', returnerState: 'STRETCHED',
            paths: [[RIGHT_HANDED_DEUCE_SLICE.returner,[60,68],[55,148]], [RIGHT_HANDED_DEUCE_SLICE.returner,[78,69],[125,124]], [RIGHT_HANDED_DEUCE_SLICE.returner,[124,70],[195,145]], [RIGHT_HANDED_DEUCE_SLICE.returner,[108,75],[178,149]]]
          }
        },
        {
          phase: 'Decide · Use the space',
          decisionLens: 'confirmation',
          situation: 'You serve wide again; their stretched return lands short through the middle.',
          question: 'Where should your first ball go?',
          options: [
            { id: 'A', text: 'Drive firmly back behind the returner' },
            { id: 'B', text: 'Drive with margin into the open court' },
            { id: 'C', text: 'Lift deep through middle and hold baseline' },
            { id: 'D', text: 'Drop short toward the returner’s sideline' }
          ],
          correct: 1,
          unlock: 'The plus-one collects space',
          payoff: 'The serve opened the court; the plus-one collects it.',
          principle: 'Serve placement creates value when the next ball uses the space.',
          why: 'Their stretched return leaves them outside the court and the reply short. Use margin into the opposite side; the serve did the hard work.',
          visual: {
            kind: 'serve_plus_one',
            label: 'Wide serve · short reply',
            cues: ['1 SLICE WIDE', '2 SHORT RETURN', '3 SPACE CREATED'],
            description: 'Top-down singles court from behind a right-handed deuce-court server. The slice lands in the far-left service box and exits screen-left before the stretched returner sends a short middle reply to a balanced server; four plus-one targets are visible.',
            serveContract: RIGHT_HANDED_DEUCE_SLICE,
            choiceRole: 'plusOne', server: RIGHT_HANDED_DEUCE_SLICE.server, returner: RIGHT_HANDED_DEUCE_SLICE.returner, contact: [125, 124],
            serve: RIGHT_HANDED_DEUCE_SLICE.path, serveBounce: RIGHT_HANDED_DEUCE_SLICE.bounce,
            returnPath: [RIGHT_HANDED_DEUCE_SLICE.returner,[72,59],[114,102],[125,124]], returnBounce: [114,102], evidencePaths: [],
            serveLabel: 'SLICE WIDE', returnLabel: 'SHORT RETURN', playerState: 'SET', returnerState: 'STRETCHED',
            paths: [[[125,124],[90,70],[48,25]], [[125,124],[160,68],[195,25]], [[125,124],[125,68],[125,27]], [[125,124],[91,91],[62,70]]]
          }
        },
        {
          phase: 'Transfer · When the pattern breaks',
          transfer: true,
          decisionLens: 'adaptation',
          situation: 'Same serve plan; their return pins you deep and catches you off-balance.',
          question: 'Attack—or reset the point?',
          options: [
            { id: 'A', text: 'Force a sharp crosscourt forehand immediately' },
            { id: 'B', text: 'Lift deep through middle and recover' },
            { id: 'C', text: 'Redirect hard toward the nearest sideline' },
            { id: 'D', text: 'Slice short and continue moving forward' }
          ],
          correct: 1,
          unlock: 'The actual ball decides',
          payoff: 'The plan shaped your readiness; the actual return changed the shot.',
          principle: 'Prepare the pattern, then let the ball received make the final call.',
          why: 'The wide serve still created a pattern, but this return removed time and balance. Neutralise first; planning matters only while the evidence supports it.',
          visual: {
            kind: 'serve_plus_one',
            label: 'Wide serve · deep reply',
            cues: ['1 SAME SLICE', '2 PINNED BACK', '3 CONTACT NEAR BASELINE'],
            description: 'Top-down singles court from behind a right-handed deuce-court server. The same slice lands in the far-left service box and exits screen-left, but the deeper, faster return catches the server off-balance; four first-ball targets test adaptation.',
            serveContract: RIGHT_HANDED_DEUCE_SLICE,
            choiceRole: 'plusOne', server: RIGHT_HANDED_DEUCE_SLICE.server, returner: RIGHT_HANDED_DEUCE_SLICE.returner, contact: [151, 150],
            serve: RIGHT_HANDED_DEUCE_SLICE.path, serveBounce: RIGHT_HANDED_DEUCE_SLICE.bounce,
            returnPath: [RIGHT_HANDED_DEUCE_SLICE.returner,[82,69],[142,137],[151,150]], returnBounce: [142,137], evidencePaths: [],
            serveLabel: 'SLICE WIDE', returnLabel: 'DEEP RETURN', playerState: 'OFF-BALANCE', returnerState: 'STRETCHED',
            paths: [[[151,150],[105,78],[50,25]], [[151,150],[137,76],[125,25]], [[151,150],[178,77],[202,25]], [[151,150],[110,97],[72,70]]]
          }
        }
      ]
    },
    {
      id: 'gold_miss_two_points_v1',
      slug: 'two-points',
      lessonSpineId: 'mental_miss_steals_next_point',
      attentionPolicy: ATTENTION_POLICY,
      title: MENTAL_RESET_SPINE && MENTAL_RESET_SPINE.title,
      memory: MENTAL_RESET_SPINE && MENTAL_RESET_SPINE.memory,
      insight: MENTAL_RESET_SPINE && MENTAL_RESET_SPINE.painHook,
      takeItToCourt: MENTAL_RESET_SPINE && MENTAL_RESET_SPINE.tomorrowAction,
      proInsight: MENTAL_RESET_SPINE && MENTAL_RESET_SPINE.proInsight,
      steps: [
        {
          phase: 'See · Follow the damage',
          decisionLens: 'contamination',
          situation: 'After missing wide, you choose a shorter target for the next neutral forehand.',
          question: 'What changed on the next point?',
          options: [
            { id: 'A', text: 'Your opponent’s strongest recovery lane' },
            { id: 'B', text: 'A shorter placement invites them inside baseline' },
            { id: 'C', text: 'The forehand technique used before it' },
            { id: 'D', text: 'Your ability to defend the baseline' }
          ],
          correct: 1,
          unlock: 'One miss changed the next choice',
          payoff: 'The shorter target brings the opponent forward; it does not diagnose your stroke.',
          principle: 'Keep the next decision tied to the ball, not just the previous result.',
          why: 'The next ball is neutral, but the shorter target gives the opponent space to step in. One miss alone cannot explain your mechanics.',
          visual: {
            kind: 'two_point_sequence', mode: 'rally', label: 'Two points · one carry-over',
            cues: ['1 FIRST BALL WIDE', '2 NEXT TARGET SHORT', '3 OPPONENT STEPS IN'],
            description: 'Two compact courts play in sequence. A forehand misses wide in point one; the next chosen target sits inside the service box and the opponent steps forward to attack.',
            firstPath: [[53,145],[70,104],[102,44],[113,17]], firstLanding: [113,17], firstOutcome: 'MISS WIDE',
            secondPath: [[53,145],[61,112],[64,70]], secondLanding: [64,70], secondOutcome: 'SHORT TARGET',
            targetWindow: [64,70,22,14],
            responsePath: [[64,58],[70,82],[66,116]], responseLanding: [66,116], responseOutcome: 'ATTACKED'
          }
        },
        {
          phase: 'Decide · Protect the next ball',
          decisionLens: 'reset',
          situation: 'Same miss; before the next point, you choose one clear ball job.',
          question: 'Which target fits this neutral ball?',
          options: [
            { id: 'A', text: 'Steer softly until confidence returns' },
            { id: 'B', text: 'Attack the nearest line immediately' },
            { id: 'C', text: 'Rebuild the forehand during the rally' },
            { id: 'D', text: 'Drive deep crosscourt with generous margin' }
          ],
          correct: 3,
          unlock: 'Give the next ball a job',
          payoff: 'The deep crosscourt plan restores margin and intent—not a guaranteed successful shot.',
          principle: 'Reset the playable job first; investigate mechanics after repeated comparable evidence.',
          why: 'For this neutral ball, a generous crosscourt target offers court length and margin. Choose the job before the swing; the next result remains unknown.',
          visual: {
            kind: 'two_point_sequence', mode: 'reset', label: 'Miss · reset · committed ball',
            cues: ['1 MISS ENDS', '2 NEUTRAL BALL NEXT', '3 CHOOSE A TARGET'],
            description: 'The first forehand misses wide. The second court shows preparation for a neutral ball. After selection a dashed plan and target appear, not a successfully landed future shot.',
            firstPath: [[53,145],[70,104],[102,44],[113,17]], firstLanding: [113,17], firstOutcome: 'MISS WIDE',
            secondPath: [[53,145],[67,101],[82,28]], secondLanding: [82,28], secondOutcome: 'NEXT RESULT UNKNOWN',
            player: [30,140], targetWindow: [82,28,24,20],
            choiceTargets: [[64,70,22,14],[23,20,8,8],null,[82,28,24,20]],
            choiceLabels: ['SHORT SAFETY PLAN','LINE ATTACK PLAN','NO TARGET SELECTED','DEEP CROSSCOURT PLAN'],
            incomingPlan: [[82,22],[63,84],[38,135]]
          }
        },
        {
          phase: 'Transfer · Change the error',
          transfer: true,
          decisionLens: 'transfer',
          situation: 'After a double fault, watch how you prepare for the next point.',
          question: 'What is the best next-point response?',
          options: [
            { id: 'A', text: 'Keep the quick tempo; aim farther inside' },
            { id: 'B', text: 'Pause to rehearse a different serve motion' },
            { id: 'C', text: 'Choose target, breathe, then serve' },
            { id: 'D', text: 'Target the centre with a softer swing' }
          ],
          correct: 2,
          unlock: 'Reset travels across strokes',
          payoff: 'Reset the next serve’s job and tempo before changing technique.',
          principle: 'Protect the next decision from the previous result, whatever the stroke.',
          why: 'A double fault is painful but still one event. Restore routine and target first; repeated serve evidence can guide later diagnosis.',
          visual: {
            kind: 'two_point_sequence', mode: 'serve', label: 'Double fault · next preparation',
            cues: ['1 SECOND SERVE LONG', '2 USUAL PREPARATION', '3 NEXT PREPARATION'],
            answerCues: ['1 PREVIOUS POINT ENDS', '2 RESTORE ROUTINE', '3 READY · RESULT UNKNOWN'],
            description: 'The previous second serve lands long. Next-point preparation contrasts the usual target, exhale and toss routine with a skipped routine. The reset ends ready to serve, with no future result shown.',
            firstPath: [[78,156],[65,108],[45,60],[37,30]], firstLanding: [37,30], firstOutcome: '2ND SERVE LONG', firstServer: [78,156],
            player: [42,156], routineBefore: ['TARGET','EXHALE','TOSS'], routineObserved: ['TOSS'],
            resetRoutine: ['TARGET','EXHALE','READY'], resetTarget: [77,62,24,22], resetOutcome: 'READY · RESULT UNKNOWN'
          }
        }
      ]
    },
    {
      id: 'gold_return_position_v1',
      slug: 'return-position',
      lessonSpineId: 'return_position_is_dial',
      attentionPolicy: ATTENTION_POLICY,
      title: RETURN_POSITION_SPINE && RETURN_POSITION_SPINE.title,
      memory: RETURN_POSITION_SPINE && RETURN_POSITION_SPINE.memory,
      insight: RETURN_POSITION_SPINE && RETURN_POSITION_SPINE.painHook,
      takeItToCourt: RETURN_POSITION_SPINE && RETURN_POSITION_SPINE.tomorrowAction,
      proInsight: RETURN_POSITION_SPINE && RETURN_POSITION_SPINE.proInsight,
      steps: [
        {
          phase: 'See · Find the constraint',
          decisionLens: 'constraint',
          situation: 'Fast body serves have been rushing your contact. Compare your starting depth.',
          question: 'Which adjustment should you test first?',
          options: [
            { id: 'A', text: 'Take one deliberate step deeper' },
            { id: 'B', text: 'Move closer and shorten further' },
            { id: 'C', text: 'Shift wider without changing depth' },
            { id: 'D', text: 'Hold position and swing faster' }
          ],
          correct: 0,
          unlock: 'Trade ground for time',
          payoff: 'One step deeper gives this serve farther to travel before contact.',
          principle: 'Return position trades territory for time; the next return tests whether it helps.',
          why: 'A measured step back gives the same serve farther to travel. Test whether that extra time helps your actual return; this court map does not show body spacing or prove better contact.',
          visual: {
            kind: 'return_position', mode: 'choice', label: 'Fast serve · current starting depth',
            cues: ['1 FAST BODY SERVE', '2 CURRENT CONTACT', '3 RETURN PATH'],
            description: 'Top-down court showing arrival time at the current and deeper positions. Rushed contact is the supplied situation, not a visible diagnosis of body spacing or return quality.',
            server: [112,6], serve: [[112,6],[126,51],[127,82],[128,105],[128,139]], referenceServe: [[112,6],[126,51],[127,82],[128,105],[128,157]], serveBounce: [128,105],
            start: [128,148], referenceStart: [128,164], contact: [128,139], referenceContact: [128,157],
            returnPath: [[128,139],[116,111],[108,82]], referenceReturnPath: [[128,157],[125,108],[123,34]],
            choiceStarts: [[128,164],[128,132],[184,148],[128,148]], showChoiceMarkers: false, playerState: 'CURRENT DEPTH', referenceState: 'DEEPER CONTACT'
          }
        },
        {
          phase: 'Deepen · Read the trade',
          decisionLens: 'tradeoff',
          situation: 'Compare the same serve from close and deeper starting positions.',
          question: 'What did the extra depth buy?',
          options: [
            { id: 'A', text: 'More pace without changing the contact' },
            { id: 'B', text: 'More travel time before contact' },
            { id: 'C', text: 'A higher bounce and shorter court' },
            { id: 'D', text: 'A wider angle before the bounce' }
          ],
          correct: 1,
          unlock: 'Aggression can begin deeper',
          payoff: 'The deeper contact arrives later on the same serve.',
          principle: 'Aggression is the quality of the strike, not proximity to the baseline.',
          why: 'The same serve takes longer to reach the deeper position, which concedes court. This schematic shows arrival time, not a guaranteed better strike.',
          visual: {
            kind: 'return_position', mode: 'compare', label: 'Same serve · two starting positions',
            cues: ['1 SAME SERVE', '2 ONE STEP BACK', '3 CONTACT ARRIVAL'],
            description: 'Top-down court. The same fast body serve is overlaid against close and deeper return positions, showing different arrival times without changing the serve. Body spacing and return quality are not modeled.',
            server: [112,6], serve: [[112,6],[126,51],[127,82],[128,105],[128,139]], referenceServe: [[112,6],[126,51],[127,82],[128,105],[128,157]], serveBounce: [128,105],
            start: [128,148], referenceStart: [128,164], contact: [128,139], referenceContact: [128,157],
            returnPath: [[128,139],[116,111],[108,82]], referenceReturnPath: [[128,157],[126,111],[124,34]],
            playerState: 'CLOSE · CROWDED', referenceState: 'DEEPER CONTACT'
          }
        },
        {
          phase: 'Transfer · Turn the dial',
          transfer: true,
          decisionLens: 'transfer',
          situation: 'A slower second serve arrives while you wait well back. Compare the forward contact.',
          question: 'Where should the dial move now?',
          options: [
            { id: 'A', text: 'Another step back for extra time' },
            { id: 'B', text: 'Hold depth and loop the return' },
            { id: 'C', text: 'Step forward and take time away' },
            { id: 'D', text: 'Shift wider and protect the line' }
          ],
          correct: 2,
          unlock: 'The dial turns both ways',
          payoff: 'The slower serve earns a forward move and earlier contact.',
          principle: 'Return position should answer the serve received, not become an identity.',
          why: 'The weaker serve supplies time without giving ground. Moving forward can pressure the server, provided height and balance support the contact.',
          visual: {
            kind: 'return_position', mode: 'choice', label: 'Slower second serve · space ahead', servePaceRatio: .72,
            cues: ['1 SLOWER SECOND SERVE', '2 LATER CONTACT', '3 SPACE IN FRONT'],
            description: 'Top-down court. A slower second serve reaches a returner standing deep before a forward reference position reveals the available pressure.',
            server: [112,6], serve: [[112,6],[127,51],[131,82],[134,105],[135,154]], referenceServe: [[112,6],[127,51],[131,82],[134,105],[135,130]], serveBounce: [134,105],
            start: [135,164], referenceStart: [135,139], contact: [135,154], referenceContact: [135,130],
            returnPath: [[135,154],[132,110],[127,62]], referenceReturnPath: [[135,130],[128,83],[120,27]],
            choiceStarts: [[135,168],[135,164],[135,139],[187,164]], showChoiceMarkers: false, playerState: 'CURRENT DEPTH', referenceState: 'STEP IN'
          }
        }
      ]
    },
    {
      id: 'gold_split_step_timing_v1',
      slug: 'split-step',
      lessonSpineId: 'movement_split_step_timing',
      attentionPolicy: ATTENTION_POLICY,
      title: SPLIT_STEP_SPINE && SPLIT_STEP_SPINE.title,
      memory: SPLIT_STEP_SPINE && SPLIT_STEP_SPINE.memory,
      insight: SPLIT_STEP_SPINE && SPLIT_STEP_SPINE.painHook,
      takeItToCourt: SPLIT_STEP_SPINE && SPLIT_STEP_SPINE.tomorrowAction,
      proInsight: SPLIT_STEP_SPINE && SPLIT_STEP_SPINE.proInsight,
      steps: [
        {
          phase: 'See · Read the beat',
          decisionLens: 'observation',
          situation: 'You reach your recovery spot. Watch the next split and first move.',
          question: 'Where does the useful rhythm break?',
          options: [
            { id: 'A', text: 'There is a pause from landing to the strike' },
            { id: 'B', text: 'The split carries you away from the next ball' },
            { id: 'C', text: 'The first push begins while both feet are airborne' },
            { id: 'D', text: 'You recover laterally after the opponent has struck' }
          ],
          correct: 0,
          unlock: 'The landing beat matters',
          payoff: 'You landed before the useful cue, then had to start again.',
          principle: 'The landing should prepare the first move as the shot becomes readable.',
          why: 'Here the early landing leaves both feet settled before useful direction information arrives. A landing just after contact can feed the next step; exact timing varies.',
          visual: {
            kind: 'split_step_timeline', label: 'Watch the feet and racket',
            cues: ['1 RACKET PREPARES', '2 FEET AND CONTACT', '3 FIRST MOVE'],
            answerCues: ['1 SAME SHOT', '2 LAND AFTER THE HIT', '3 PUSH TOWARD THE BALL'],
            description: 'Top-down court and synchronized timing strip. The returner lands before opponent contact, settles, then starts toward the ball after a visible delay.',
            opponent: [125,24], player: [125,145], ballPath: [[131,28],[146,65],[180,110],[196,143]], ballBounce: [180,110],
            moveTarget: [190,145], opponentContactOffset: 0, hopDuration: .30,
            landingOffset: -.48, firstStepDelay: .48, referenceOffset: .15, referenceFirstStepDelay: .25, timingState: 'EARLY'
          }
        },
        {
          phase: 'Deepen · Align the cue',
          decisionLens: 'timing',
          situation: 'Same starting spot and same shot. Watch what changes this time.',
          question: 'What has removed the pause?',
          options: [
            { id: 'A', text: 'More width between the feet at landing' },
            { id: 'B', text: 'A quicker push from the same early landing' },
            { id: 'C', text: 'Less time between landing and the opponent’s strike' },
            { id: 'D', text: 'A recovery spot closer to the incoming ball' }
          ],
          correct: 2,
          unlock: 'Land ready for the read',
          payoff: 'You land just after the hit, then push as the ball becomes readable.',
          principle: 'Connect the landing to early ball flight, without a settled pause.',
          why: 'In this example, the landing follows the strike and feeds the first push as direction becomes readable. The useful relationship matters more than one fixed timing for everyone.',
          visual: {
            kind: 'split_step_timeline', label: 'Same shot · another split',
            cues: ['1 RACKET PREPARES', '2 FEET AND CONTACT', '3 FIRST MOVE'],
            description: 'The same shot travels right from the same opponent preparation. The player lands shortly after contact and moves without the previous pause; starting spot, landing width and ball path are unchanged.',
            opponent: [125,24], player: [125,145], ballPath: [[131,28],[146,65],[180,110],[196,143]], ballBounce: [180,110],
            moveTarget: [190,145], opponentContactOffset: 0, hopDuration: .30,
            landingOffset: .15, firstStepDelay: .25, referenceOffset: .15, referenceFirstStepDelay: .25, timingState: 'READY'
          }
        },
        {
          phase: 'Transfer · Change the tempo',
          transfer: true,
          decisionLens: 'transfer',
          situation: 'The opponent shortens the swing and changes direction. You keep the previous rhythm.',
          question: 'What would you test on the next ball?',
          options: [
            { id: 'A', text: 'Begin the same split a little sooner' },
            { id: 'B', text: 'Make the split smaller from the same start' },
            { id: 'C', text: 'Keep the split and push harder after landing' },
            { id: 'D', text: 'Wait for the ball’s direction, then split' }
          ],
          correct: 0,
          unlock: 'Rhythm adapts, relationship stays',
          payoff: 'Start sooner so the landing catches the early flight, then push.',
          principle: 'Adjust to the opponent’s rhythm while keeping direction open until the shot is readable.',
          why: 'This quicker preparation makes your previous rhythm late. Moving this split earlier restores a ready landing; it is not a rule to jump before every opponent swing.',
          visual: {
            kind: 'split_step_timeline', label: 'The opponent takes less time',
            cues: ['1 SHORTER SWING', '2 FEET AND CONTACT', '3 FIRST MOVE'],
            answerCues: ['1 SAME QUICK SWING', '2 LAND AFTER THE HIT', '3 PUSH FROM THE LANDING'],
            description: 'The opponent completes a visibly quicker racket preparation and sends the ball left. Your unchanged landing and first-move clock now follow the strike. Answer replays show the chosen adjustment and, if needed, a fresh shot with the split begun sooner.',
            opponent: [125,24], player: [125,145], ballPath: [[131,28],[108,67],[75,111],[57,143]], ballBounce: [75,111],
            moveTarget: [62,145], opponentContactOffset: -.38, hopDuration: .30,
            landingOffset: .53, firstStepDelay: .63, referenceOffset: .15, referenceFirstStepDelay: .25, timingState: 'LATE',
            choiceTimings: [
              { landingOffset: .15, firstStepDelay: .25, hopDuration: .30 },
              { landingOffset: .41, firstStepDelay: .51, hopDuration: .18 },
              { landingOffset: .53, firstStepDelay: .55, hopDuration: .30, movementDuration: .34 },
              { landingOffset: .66, firstStepDelay: .76, hopDuration: .30 }
            ]
          }
        }
      ]
    },
    {
      id: 'gold_winner_wrong_shot_v1',
      slug: 'winner',
      lessonSpineId: 'decision_winner_can_be_wrong',
      attentionPolicy: ATTENTION_POLICY,
      title: DECISION_QUALITY_SPINE && DECISION_QUALITY_SPINE.title,
      memory: DECISION_QUALITY_SPINE && DECISION_QUALITY_SPINE.memory,
      insight: DECISION_QUALITY_SPINE && DECISION_QUALITY_SPINE.painHook,
      takeItToCourt: DECISION_QUALITY_SPINE && DECISION_QUALITY_SPINE.tomorrowAction,
      proInsight: DECISION_QUALITY_SPINE && DECISION_QUALITY_SPINE.proInsight,
      steps: [
        {
          phase: 'See · Separate result from choice',
          decisionLens: 'outcome',
          situation: 'Off a low neutral ball, your line clips the paint for a winner.',
          question: 'What does that winner prove?',
          options: [
            { id: 'A', text: 'Your target had enough safety margin' },
            { id: 'B', text: 'This single execution found the court' },
            { id: 'C', text: 'Their recovery made the line compulsory' },
            { id: 'D', text: 'The incoming ball justified full acceleration' }
          ],
          correct: 1,
          unlock: 'Result is one sample',
          payoff: 'One winner proves only that this execution landed.',
          principle: 'Decision quality includes evidence, margin and repeatability—not only outcome.',
          why: 'A line clip can win spectacularly without making the target repeatable. Judge what you knew before contact, not the applause after it.',
          visual: {
            kind: 'outcome_vs_decision', mode: 'result', label: 'Low neutral ball · line winner',
            cues: ['1 LOW NEUTRAL BALL', '2 LINE CLIP', '3 WINNER'],
            description: 'Top-down court. A low neutral ball reaches a balanced player whose down-the-line reply barely clips a small target for a winner.',
            player: [61,142], opponent: [132,24], contact: [61,134], incoming: [[132,24],[96,72],[61,134]],
            riskyPath: [[61,134],[51,77],[42,19]], repeatablePath: [[61,134],[105,75],[154,29]],
            riskyTarget: [42,19,4,10], repeatableTarget: [154,29,34,22], ballClass: 'LOW · NEUTRAL', playerState: 'BALANCED', outcome: 'WINNER', showOutcome: true
          }
        },
        {
          phase: 'Deepen · Judge before impact',
          decisionLens: 'repeatability',
          situation: 'Replay the same ball before knowing whether either shot lands.',
          question: 'Which plan offers more usable margin?',
          options: [
            { id: 'A', text: 'Repeat the narrow down-the-line target' },
            { id: 'B', text: 'Flatten the ball through low contact' },
            { id: 'C', text: 'Use the larger deep crosscourt window' },
            { id: 'D', text: 'Drop short while they stay balanced' }
          ],
          correct: 2,
          unlock: 'Compare the target windows',
          payoff: 'The larger target leaves more room for placement error.',
          principle: 'Judge the choice using information available before the ball leaves.',
          why: 'Both shots may land or miss once. The larger crosscourt window uses the same balance with more net clearance and court length.',
          visual: {
            kind: 'outcome_vs_decision', mode: 'compare', label: 'Same ball · two target windows',
            cues: ['1 SAME BALL', '2 RESULT HIDDEN', '3 COMPARE WINDOWS'],
            description: 'Top-down court. The identical low neutral ball and player position are held while a narrow line target is compared with a larger crosscourt window; outcomes stay hidden.',
            player: [61,142], opponent: [132,24], contact: [61,134], incoming: [[132,24],[96,72],[61,134]],
            riskyPath: [[61,134],[51,77],[42,19]], repeatablePath: [[61,134],[105,75],[154,29]],
            riskyTarget: [42,19,4,10], repeatableTarget: [154,29,34,22], ballClass: 'LOW · NEUTRAL', playerState: 'BALANCED', outcome: 'HIDDEN', showOutcome: false
          }
        },
        {
          phase: 'Transfer · Earn more risk',
          transfer: true,
          decisionLens: 'transfer',
          situation: 'The next ball brings you forward. Read the contact and the defender.',
          question: 'Which shot fits this new picture?',
          options: [
            { id: 'A', text: 'Loop centrally and rebuild the rally' },
            { id: 'B', text: 'Drive hard back toward the defender' },
            { id: 'C', text: 'Attack open court with clear margin' },
            { id: 'D', text: 'Chase open court right beside the sideline' }
          ],
          correct: 2,
          unlock: 'This ball earns aggression',
          payoff: 'Permission existed before the aggressive shot was struck.',
          principle: 'Risk becomes sound when ball quality, balance and space support it.',
          why: 'High contact, stable feet and exposed court improve the attacking equation. Score can influence risk, but it cannot manufacture those cues.',
          visual: {
            kind: 'outcome_vs_decision', mode: 'permission', label: 'High short ball · open court',
            cues: ['1 HIGH BALL', '2 YOU SET', '3 OPEN COURT'],
            description: 'Top-down court. A high short ball reaches a balanced player while the opponent starts wide; a generous attacking target fills the open court.',
            player: [91,113], opponent: [207,24], contact: [91,105], incoming: [[207,24],[148,62],[91,105]],
            riskyPath: [[91,105],[63,65],[42,20]], repeatablePath: [[91,105],[77,65],[59,29]],
            choicePaths: [[[91,105],[108,64],[125,30]],[[91,105],[150,66],[202,30]],[[91,105],[77,65],[59,29]],[[91,105],[63,65],[42,20]]],
            riskyTarget: [42,20,10,8], repeatableTarget: [59,29,36,24], ballClass: 'HIGH · SHORT', playerState: 'SET', outcome: 'ATTACK EARNED', showOutcome: false
          }
        }
      ]
    }
  ];

  // Authored batch: shared court primitives, never shared tennis answers. Paths
  // end at the first bounce; dashed reply lanes are possibilities, not outcomes.
  function courtChoice(player, target, receiver, replyEnds, note, recoverTo, opponentVia) {
    return { player: player, target: target, receiver: receiver, replyEnds: replyEnds, note: note, recoverTo: recoverTo || null, opponentVia: opponentVia || null };
  }
  function courtStep(data) {
    data.options = data.options.map(function (text, i) { return { id: String.fromCharCode(65 + i), text: text }; });
    data.visual.kind = 'court_read';
    return data;
  }
  function courtLesson(spineId, steps) {
    const spine = boundSpine(spineId);
    return { id: spine.prototypeId, slug: spine.slug, lessonSpineId: spineId, attentionPolicy: ATTENTION_POLICY,
      title: spine.title, memory: spine.memory, insight: spine.painHook, takeItToCourt: spine.tomorrowAction,
      proInsight: spine.proInsight, steps: steps.map(courtStep) };
  }
  challenges.push(courtLesson('backhand_runaround_is_pattern', [
    {
      phase: 'See · Build with both wings', decisionLens: 'permission',
      situation: 'Your slice buys time. Your forehand is your stronger attacking shot.',
      question: 'How should you use that extra time?',
      options: ['Stay back and slice centrally again', 'Circle early and drive the forehand crosscourt', 'Circle early and attempt a drop shot', 'Drive the backhand straight down the line'], correct: 1,
      shotAudio: ['slice','ground','slice','ground'],
      unlock: 'The backhand built the forehand', payoff: 'The slower reply gives you time to arrive outside the ball.',
      principle: 'Use the stronger wing when time and a forcing target repay the extra movement.',
      why: 'The deep crosscourt forehand can move the defender away from your exposed side. Running around a rushed ball would change that calculation.',
      visual: { mode: 'runaround', label: 'Right-handed player · slower reply',
        cues: ['1 SLOWER REPLY', '2 ROOM TO CIRCLE', '3 DEFENDER LEFT'],
        description: 'Right-handed near player. A slower ball bounces in the backhand half. Space left of the ball permits a forehand; the defender waits in the far-left half.',
        incoming: [[74,22],[64,115],[62,138]], bounce: [64,115], playerStart: [94,148], player: [76,146], opponentStart: [74,22], opponent: [74,22],
        ballLabel: 'SLOW · WAIST HEIGHT', alternatives: [[48,146]],
        choices: [courtChoice([76,146],[125,40],[125,22],[[60,137],[192,137]],'Central slice gives the defender time.'), courtChoice([48,146],[185,30],[196,17],[[90,140],[177,138]],'Deep forehand moves them away from your exposed side.'), courtChoice([48,146],[94,72],[94,58],[[50,128],[197,128]],'Short touch asks for precision from the baseline.'), courtChoice([76,146],[56,28],[56,18],[[65,138],[193,137]],'The line leaves a broad crosscourt reply.')]
      }
    },
    {
      phase: 'Contrast · Remove the extra step', decisionLens: 'constraint',
      situation: 'The next reply skids deeper. Your forehand is still stronger, but time has changed.',
      question: 'Which response protects this contact?',
      options: ['Circle wider and force a deep forehand', 'Block the backhand short through centre', 'Use the backhand deep across court', 'Redirect the backhand toward the near sideline'], correct: 2,
      unlock: 'The ball removes the run-around', payoff: 'The backhand reaches this ball without the extra circle.',
      principle: 'A favourite stroke does not create the time needed to reach it.',
      why: 'Depth compresses the setup while your feet are still travelling. A deep crosscourt backhand retains space; chasing the forehand invites a crowded strike.',
      visual: { mode: 'runaround', label: 'Same player · deeper reply',
        cues: ['1 DEEP BOUNCE', '2 FEET TRAVELLING', '3 DEFENDER SET'],
        description: 'The incoming ball now bounces near the baseline. The right-handed near player moves left to a backhand contact; a further circle would require crossing the ball’s path.',
        incoming: [[100,22],[63,144],[60,152]], bounce: [63,144], playerStart: [110,153], player: [74,160], opponentStart: [100,22], opponent: [100,22], ballLabel: 'DEEP · LOW', alternatives: [[46,160]],
        choices: [courtChoice([56,160],[166,59],[175,48],[[54,132],[196,130]],'Rushed circle leaves a cramped forehand and short target.'),courtChoice([74,160],[125,72],[125,57],[[51,129],[199,128]],'Short centre lets the defender step inside.'),courtChoice([74,160],[178,29],[187,18],[[87,140],[185,139]],'Backhand depth keeps the reply in the backcourt.'),courtChoice([74,160],[42,28],[49,18],[[66,138],[198,131]],'The narrow line adds risk while you are moving.')]
      }
    },
    {
      phase: 'Transfer · Pay the recovery bill', decisionLens: 'transfer', transfer: true,
      situation: 'You circled successfully, but your forehand lands short. Read what the defender now owns.',
      question: 'Keeping the forehand: what needs to change?',
      options: ['Keep the circle; drive deeper and recover across', 'Circle farther to make the forehand bigger', 'Keep this target and recover toward the net', 'Slice deep through middle and regain your base'], correct: 0,
      shotAudio: ['ground','ground','ground','slice'],
      unlock: 'Reaching it was only half', payoff: 'A short forehand gives the defender time to use the court you left.',
      principle: 'Running around must earn pressure, not merely turn a backhand into a forehand.',
      why: 'You reached the shot, but the defender now contacts inside the court. Keep the construction only when your forehand quality justifies the recovery it creates.',
      visual: { mode: 'runaround', label: 'Run-around reached · short result',
        cues: ['1 FOREHAND REACHED', '2 SHORT LANDING', '3 DEFENDER INSIDE'],
        description: 'A right-handed player stands left of the ball after running around. Their previous forehand has landed short across court; the defender has stepped inside with two reply lanes.',
        incoming: [[185,43],[90,116],[62,138]], bounce:[90,116], playerStart:[92,146],player:[48,146],opponentStart:[195,19],opponent:[185,43],ballLabel:'YOUR LAST SHOT LANDED SHORT',alternatives:[], priorShot:[[62,138],[177,60]],
        choices:[courtChoice([48,146],[182,29],[194,17],[[92,139],[181,140]],'Deeper pressure narrows their comfortable replies.',[111,153]),courtChoice([35,146],[177,60],[185,43],[[54,130],[199,129]],'Extra court exposure remains behind the short ball.'),courtChoice([48,146],[177,60],[185,43],[[52,126],[199,127]],'Moving forward does not remove their passing lanes.',[83,106]),courtChoice([76,146],[125,42],[125,25],[[62,139],[193,139]],'A slice is a credible alternative construction, not the forehand adjustment asked here.',[125,153])]
      }
    }
  ]));
  challenges.push(courtLesson('return_middle_removes_plus_one', [
    {
      phase:'See · Take away the angle',decisionLens:'neutralise',situation:'A firm first serve pulls you wide. The server stays back for serve-plus-one.',
      question:'Which target best reduces their next angle?',
      options:['Drive toward the far singles sideline','Guide a short return through centre','Block deep through the middle window','Float a short crosscourt return away'],correct:2,
      unlock:'Middle can be disruptive',payoff:'Depth through centre keeps the server back without gifting a wide contact.',
      principle:'On a stretched return, reducing their options can matter more than finding empty court.',
      why:'The deep central target offers sideline margin and less immediate angle. This is a neutralising choice, not a promise that the server cannot attack.',
      visual:{mode:'middle-return',label:'First serve · returner stretched',cues:['1 FIRM FIRST SERVE','2 YOU WIDE','3 SERVER BACK'],description:'Far-left server serves diagonally into the near-right service box. The near returner is pulled wide; the server recovers near centre close to the baseline.',incoming:[[112,8],[182,110],[207,144]],bounce:[182,110],playerStart:[169,153],player:[193,151],opponentStart:[112,8],opponent:[125,17],ballLabel:'STRETCHED · FIRST SERVE',alternatives:[],
      choices:[courtChoice([193,151],[43,27],[50,18],[[52,140],[196,125]],'Sideline precision is costly from this stretched contact.'),courtChoice([193,151],[125,66],[125,49],[[51,126],[199,126]],'Short middle lets the server step in.'),courtChoice([193,151],[125,28],[125,15],[[74,144],[176,144]],'Deep middle keeps the next contact central and back.'),courtChoice([193,151],[68,70],[60,54],[[51,133],[199,115]],'Short width offers a sharper next angle.')]}
    },
    {
      phase:'Contrast · Direction is not enough',decisionLens:'depth',situation:'Both returns go centrally. One lands near the service line; the other reaches deep.',
      question:'Which difference changes the server’s next ball?',
      options:['The deeper bounce keeps their contact back','The central route limits their sideways reach','The shorter bounce makes them move farther','The return speed matters more than landing'],correct:0,
      unlock:'Depth completes the middle target',payoff:'The shorter return lets the server contact inside the baseline.',
      principle:'Middle removes width; depth must still protect against a comfortable step-in attack.',
      why:'Direction alone is not the lesson. Compare the server’s contact positions: a short middle ball can be attacked even though it cleared both sidelines safely.',
      visual:{mode:'middle-return',label:'Same serve · compare return depth',cues:['1 SAME FIRST SERVE','2 TWO LANDINGS','3 SERVER RECOVERING'],description:'The same diagonal first serve reaches the wide returner. Neutral outlines mark a short middle landing and a deep middle landing; the answer compares the server’s resulting positions.',incoming:[[112,8],[182,110],[207,144]],bounce:[182,110],playerStart:[169,153],player:[193,151],opponentStart:[112,8],opponent:[125,17],ballLabel:'COMPARE THE TWO MIDDLE WINDOWS',alternatives:[],windows:[[125,28],[125,66]],
      choices:[courtChoice([193,151],[125,28],[125,15],[[74,144],[176,144]],'Deep landing holds their contact near the baseline.'),courtChoice([193,151],[125,66],[125,49],[[51,126],[199,126]],'Central alone still leaves a step-in attack.'),courtChoice([193,151],[125,66],[125,49],[[51,126],[199,126]],'Moving forward can improve their attack.'),courtChoice([193,151],[125,66],[125,49],[[51,126],[199,126]],'Pace does not erase the short landing.')]}
    },
    {
      phase:'Transfer · Let the serve change the job',decisionLens:'transfer',transfer:true,situation:'A softer second serve sits up. You arrive early; the server has recovered left.',
      question:'Which return makes use of this change?',
      options:['Block centrally as on the first serve','Guide short toward the recovering server','Aim hard directly along the singles line','Drive into the vacant half with margin'],correct:3,
      unlock:'Now you can create the angle',payoff:'Time and balance let you attack a generous window away from the server.',
      principle:'A neutralising default should yield when the new ball earns a better attacking option.',
      why:'You are no longer stretched by pace, and the server is offset. Use the available space with margin; the painted sideline adds unnecessary risk.',
      visual:{mode:'middle-return',label:'Second serve · you inside and set',cues:['1 SOFTER SECOND SERVE','2 YOU INSIDE','3 SERVER LEFT'],description:'The server is far left. A slower diagonal second serve bounces in the near-right box; the balanced returner meets it inside the baseline, with a large far-right target available.',incoming:[[112,8],[158,103],[168,127]],bounce:[158,103],playerStart:[158,148],player:[154,135],opponentStart:[112,8],opponent:[91,18],ballLabel:'SITS UP · WAIST HEIGHT',alternatives:[],
      choices:[courtChoice([154,135],[125,28],[125,16],[[73,141],[177,141]],'Deep middle remains playable but gives up the opening.'),courtChoice([154,135],[87,65],[87,49],[[52,129],[197,128]],'Short toward the server gives them the first attack.'),courtChoice([154,135],[208,28],[210,18],[[92,140],[191,136]],'The same opening is available without chasing the paint.'),courtChoice([154,135],[183,30],[197,19],[[97,140],[184,139]],'A generous target moves them across the court.')]}
    }
  ]));
  challenges.push(courtLesson('decision_open_court_not_open', [
    {
      phase:'See · Watch the recovery',decisionLens:'momentum',situation:'You have a comfortable short forehand. Watch the defender recover before choosing your target.',question:'Which target makes them change direction?',
      options:['Drive toward the currently empty right half','Drive back into the left half','Loop high through the central lane','Drop short into the central lane'],correct:1,
      shotAudio:['ground','ground','ground','slice'],
      unlock:'Empty space was already closing',payoff:'Playing left makes the right-moving defender brake and turn.',principle:'Movement can make a smaller-looking opening more useful than the largest empty area.',
      why:'The defender is already committed toward the right half. With a balanced contact, playing behind challenges that momentum; it does not guarantee a winner.',
      visual:{mode:'future-space',label:'Defender travelling right',cues:['1 COMFORTABLE BALL','2 DEFENDER TRAVELLING','3 YOU SET'],description:'The near right-handed player is balanced on a short forehand. The far defender recovers from left toward centre and is still travelling right at the decision contact.',incoming:[[65,24],[164,102],[181,115]],bounce:[164,102],playerStart:[159,137],player:[167,123],opponentStart:[65,24],opponent:[113,24],momentum:[151,24],ballLabel:'WAIST HEIGHT · BALANCED',alternatives:[],
      choices:[courtChoice([167,123],[188,32],[164,24],[[75,138],[186,138]],'The right-hand target meets their existing run.'),courtChoice([167,123],[67,32],[95,24],[[68,140],[164,140]],'Their rightward momentum must be reversed.',null,[132,24]),courtChoice([167,123],[125,30],[132,24],[[68,140],[182,140]],'A central loop gives them time to settle.'),courtChoice([167,123],[125,72],[133,53],[[54,123],[197,124]],'Central touch asks them to run forward instead.')]}
    },
    {
      phase:'Contrast · Remove the commitment',decisionLens:'reversal',situation:'The same short ball arrives, but the defender stays left and sets their feet.',question:'Which target now creates the clearest stretch?',
      options:['Repeat the left target behind them','Drop centrally in front of them','Drive across into the right-hand window','Loop centrally to restart the rally'],correct:2,
      shotAudio:['ground','slice','ground','ground'],
      unlock:'No run to play behind',payoff:'The stationary defender must now cover the vacant right half.',principle:'Playing behind needs actual movement; yesterday’s successful target is not today’s instruction.',
      why:'They have not committed across court. The generous right target now makes them travel farther; sending the ball left would feed their set position.',
      visual:{mode:'future-space',label:'Same ball · defender stays left',cues:['1 SAME BALL','2 DEFENDER HOLDS','3 YOU SET'],description:'The same near forehand contact is available, but the defender remains stationary on the far-left side. The far-right half is genuinely vacant.',incoming:[[65,24],[164,102],[181,115]],bounce:[164,102],playerStart:[159,137],player:[167,123],opponentStart:[65,24],opponent:[65,24],momentum:[65,24],ballLabel:'WAIST HEIGHT · BALANCED',alternatives:[],
      choices:[courtChoice([167,123],[67,32],[67,24],[[55,141],[190,128]],'Left now feeds their ready position.'),courtChoice([167,123],[125,72],[108,53],[[51,124],[198,126]],'Central touch allows a forward interception.'),courtChoice([167,123],[188,32],[137,24],[[86,140],[183,139]],'The open half now makes them travel across.'),courtChoice([167,123],[125,30],[125,24],[[69,141],[184,141]],'A central loop gives away the available stretch.')]}
    },
    {
      phase:'Transfer · Reverse the picture',decisionLens:'transfer',transfer:true,situation:'Now the ball reaches your backhand. Read the defender’s new movement before choosing.',question:'Which drive works against their current momentum?',
      options:['Send your backhand behind their run','Drive down the line toward the left','Drive firmly into the central window','Loop high toward the left-hand corner'],correct:0,
      unlock:'Same read, opposite side',payoff:'The right-hand target makes this left-moving defender turn back.',principle:'Transfer the movement read, not a memorised left or right target.',
      why:'The camera has not changed: you now strike a backhand while the defender travels left. A crosscourt drive to the right plays behind that movement.',
      visual:{mode:'future-space',label:'Backhand contact · defender travelling left',cues:['1 NEW WING','2 DEFENDER TRAVELLING','3 YOU SET'],description:'Right-handed near player has a balanced backhand on the left. The far defender moves from right toward centre and continues left; playing crosscourt right challenges that momentum.',incoming:[[189,24],[86,103],[69,116]],bounce:[86,103],playerStart:[96,139],player:[83,124],opponentStart:[189,24],opponent:[142,24],momentum:[103,24],ballLabel:'BACKHAND · WAIST HEIGHT',alternatives:[],
      choices:[courtChoice([83,124],[183,32],[162,24],[[85,141],[185,140]],'Their leftward run now requires a turn back right.',null,[124,24]),courtChoice([83,124],[62,32],[93,24],[[62,138],[180,138]],'Left meets the direction they already travel.'),courtChoice([83,124],[125,30],[125,24],[[68,141],[183,141]],'Central placement gives them less direction to change.'),courtChoice([83,124],[62,32],[71,24],[[62,140],[187,135]],'A loop gives them extra time to finish recovering.')]}
    }
  ]));

  // Locally reviewed next-batch lesson; deliberately absent from the calendar.
  if (highBall) challenges.push(highBall.lesson(boundSpine('forehand_high_ball_opposites')));
  if (construction) challenges.push(...construction.lessons(lessonSpines).map(function(lesson){return {...lesson,reviewOnly:false};}));
  if (tradeoffs) challenges.push(...tradeoffs.lessons(lessonSpines).map(function(lesson){return {...lesson,reviewOnly:false};}));
  lessonExtensions.forEach(function(module){challenges.push(...module.lessons(lessonSpines).map(function(lesson){return {...lesson,reviewOnly:false};}));});

  // Begin the short-ball lesson with the painful misread, not the easy success.
  // The original authored states remain intact; only their teaching order changes.
  const shortBallChallenge = challenges.find(function (challenge) { return challenge.lessonSpineId === 'net_short_ball_permission'; });
  if (shortBallChallenge && shortBallChallenge.steps.length === 3) {
    const attackEarned = shortBallChallenge.steps[0];
    const attackTrap = shortBallChallenge.steps[1];
    attackTrap.phase = 'See · Resist the trap';
    attackEarned.phase = 'Contrast · Earn the attack';
    shortBallChallenge.steps = [attackTrap, attackEarned, shortBallChallenge.steps[2]];
  }

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.freeze(value);
    Object.keys(value).forEach(function (key) { deepFreeze(value[key]); });
    return value;
  }
  deepFreeze(challenges);

  function sentenceCount(text) {
    return (String(text).match(/[.!?](?:\s|$)/g) || []).length;
  }

  function wordCount(text) {
    return String(text || '').replace(/[·—–]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  }

  function meaningfulTokens(text) {
    const ignored = new Set(['into', 'stay', 'test', 'more', 'same', 'this', 'that', 'with', 'from', 'have', 'your', 'them']);
    return String(text || '').toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(function (token) {
      return token.length > 3 && !ignored.has(token);
    });
  }

  function textOverlap(left, right) {
    const a = new Set(meaningfulTokens(left));
    const b = new Set(meaningfulTokens(right));
    const intersection = Array.from(a).filter(function (token) { return b.has(token); }).length;
    const union = new Set(Array.from(a).concat(Array.from(b))).size;
    return union ? intersection / union : 1;
  }

  function prefersReducedMotion() {
    return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function timelineFor(step, answered) {
    const module = extensionFor(step);
    if (module && module.timelineFor) return module.timelineFor(step, answered);
    const family = step && step.visual && EVIDENCE_TIMELINES[step.visual.kind];
    const base = family && family[answered ? 'answer' : 'read'];
    if (!base) return base;
    if (step.visual.kind === 'return_position') {
      const ratio = step.visual.servePaceRatio || 1;
      const t = Object.assign({}, base, { serveBounceAt: base.serveAt + (base.serveBounceAt-base.serveAt)/ratio });
      t.contactAt = returnArrival(step,t,false);
      t.serveFlight = t.contactAt-t.serveAt;
      t.returnBounceAt = t.contactAt+(base.returnBounceAt-base.contactAt);
      const lastContact = Math.max(t.contactAt,returnArrival(step,t,true));
      if (answered) {
        t.inkAt = Math.max(base.inkAt,lastContact+.35);
        t.correctionAt = lastContact;
        t.correctionInkAt = t.inkAt+.4;
        t.total = t.correctionInkAt+.3;
      } else {
        const secondCue = Math.max(base.cueAt[0]+.5,t.contactAt);
        t.cueAt = [base.cueAt[0],secondCue,Math.max(secondCue+.5,lastContact+.2,t.contactAt+t.returnFlight+.1)];
        t.questionAt = t.cueAt[2]+.5;
        t.total = t.questionAt+.42;
      }
      return t;
    }
    if (step.visual.kind === 'serve_plus_one' && answered) {
      const t = Object.assign({},base),choiceIsReturn=step.visual.choiceRole==='return';
      // Choice paths end at their landing targets, not at an unshown later contact.
      if (choiceIsReturn) t.returnBounceAt=t.returnAt+t.returnFlight;
      t.plusOneBounceAt=t.plusOneAt+t.plusOneFlight;
      const choiceEnd=choiceIsReturn?t.returnBounceAt:t.plusOneBounceAt;
      t.correctionAt=choiceEnd+.22;
      t.correctionInkAt=t.correctionAt+(choiceIsReturn?t.returnFlight:t.plusOneFlight)+.22;
      t.total=t.correctionInkAt+.3;
      return t;
    }
    return base;
  }

  function isPacedEvidence(step) {
    return !!(step && step.visual && EVIDENCE_TIMELINES[step.visual.kind]);
  }

  function payoffAtFor(step, timeline) {
    if (!timeline) return 0;
    const answeredWrong = state.selectedIndex != null && state.selectedIndex !== step.correct;
    if (answeredWrong && timeline.correctionInkAt != null) return timeline.correctionInkAt;
    if (step.visual.kind === 'serve_plus_one') {
      return step.visual.choiceRole === 'return' ? timeline.returnInkAt : timeline.plusOneInkAt;
    }
    return timeline.inkAt == null ? 0 : timeline.inkAt;
  }

  function validateEvidenceTimelines() {
    const errors = [];
    Object.keys(EVIDENCE_TIMELINES).forEach(function (kind) {
      ['read', 'answer'].forEach(function (mode) {
        const timeline = EVIDENCE_TIMELINES[kind][mode];
        const prefix = kind + ' ' + mode;
        if (!timeline || !Number.isFinite(timeline.total) || timeline.total <= 0) errors.push(prefix + ': invalid total time.');
        if (!Array.isArray(timeline.cueAt) || timeline.cueAt.length !== 3) errors.push(prefix + ': exactly three cue times are required.');
        if ((timeline.cueAt || []).some(function (at, index, list) { return !Number.isFinite(at) || at < 0 || at > timeline.total || (index && at < list[index - 1]); })) errors.push(prefix + ': cue order is invalid.');
        ['contactAt', 'bounceAt', 'movementAt', 'movement', 'correctionAt', 'questionAt', 'inkAt', 'returnInkAt', 'plusOneInkAt', 'correctionInkAt', 'flight', 'serveAt', 'serveFlight', 'serveBounceAt', 'returnAt', 'returnFlight', 'returnBounceAt', 'plusOneAt', 'plusOneFlight', 'plusOneBounceAt', 'loadAt', 'outcomeAt', 'firstAt', 'firstFlight', 'secondAt', 'secondFlight', 'secondBounceAt', 'responseAt'].forEach(function (key) {
          if (timeline[key] != null && (!Number.isFinite(timeline[key]) || timeline[key] < 0 || timeline[key] > timeline.total)) errors.push(prefix + ': invalid ' + key + '.');
        });
        if (timeline.bounceAt != null && (timeline.contactAt == null || timeline.bounceAt <= timeline.contactAt)) errors.push(prefix + ': bounce must follow contact.');
        if (timeline.correctionAt != null && timeline.movementAt != null && timeline.correctionAt <= timeline.movementAt) errors.push(prefix + ': correction must follow the selected consequence.');
        if (timeline.contactAt != null && timeline.flight != null && timeline.contactAt + timeline.flight > timeline.total + .001) errors.push(prefix + ': visual flight exceeds its scene clock.');
        if (timeline.movementAt != null && timeline.movement != null && timeline.movementAt + timeline.movement > timeline.total + .001) errors.push(prefix + ': player movement exceeds its scene clock.');
        if (kind === 'recovery' && timeline.correctionAt != null && timeline.movement != null && timeline.correctionAt + timeline.movement > timeline.total + .001) errors.push(prefix + ': recovery correction exceeds its scene clock.');
        if ((kind === 'shortBall' || kind === 'direction_change') && timeline.correctionAt != null && timeline.flight != null && timeline.correctionAt + timeline.flight > timeline.total + .001) errors.push(prefix + ': shot correction exceeds its scene clock.');
        if (kind === 'serve_plus_one') {
          [['serveAt', 'serveFlight', 'serveBounceAt'], ['returnAt', 'returnFlight', 'returnBounceAt'], ['plusOneAt', 'plusOneFlight', 'plusOneBounceAt']].forEach(function (keys) {
            const at = timeline[keys[0]], duration = timeline[keys[1]], bounce = timeline[keys[2]];
            if (at == null && duration == null && bounce == null) return;
            if (at == null || duration == null || at + duration > timeline.total + .001) errors.push(prefix + ': invalid ' + keys[0].replace('At', '') + ' flight clock.');
            if (bounce != null && (bounce <= at || bounce > at + duration)) errors.push(prefix + ': invalid ' + keys[2] + '.');
          });
          if (timeline.returnAt != null && timeline.serveAt != null && timeline.returnAt <= timeline.serveAt) errors.push(prefix + ': return contact must follow the serve.');
          if (timeline.returnAt != null && timeline.serveAt != null && timeline.serveFlight != null && timeline.returnAt - (timeline.serveAt + timeline.serveFlight) < .25) errors.push(prefix + ': serve bounce and return contact need a distinct visual beat.');
          if (timeline.plusOneAt != null && timeline.returnAt != null && timeline.plusOneAt <= timeline.returnAt) errors.push(prefix + ': first-ball contact must follow the return.');
          if (timeline.correctionAt != null && timeline.plusOneFlight != null && timeline.correctionAt + timeline.plusOneFlight > timeline.total + .001) errors.push(prefix + ': first-ball correction exceeds its scene clock.');
          if (timeline.correctionAt != null && timeline.returnFlight != null && timeline.correctionAt + timeline.returnFlight > timeline.total + .001) errors.push(prefix + ': return correction exceeds its scene clock.');
        }
        if (kind === 'return_position') {
          if (timeline.serveAt == null || timeline.serveFlight == null || timeline.serveBounceAt == null || timeline.contactAt == null || timeline.returnFlight == null) errors.push(prefix + ': return-position clock is incomplete.');
          if (timeline.serveAt + timeline.serveFlight > timeline.total + .001) errors.push(prefix + ': return-position serve exceeds its scene clock.');
          if (timeline.serveBounceAt <= timeline.serveAt || timeline.serveBounceAt >= timeline.contactAt) errors.push(prefix + ': return-position bounce must precede return contact.');
        }
        if (kind === 'split_step_timeline') {
          if (timeline.loadAt == null || timeline.contactAt == null || timeline.bounceAt == null || timeline.flight == null) errors.push(prefix + ': split-step clock is incomplete.');
          if (timeline.loadAt >= timeline.contactAt || timeline.bounceAt <= timeline.contactAt) errors.push(prefix + ': split-step load, contact and bounce order is invalid.');
        }
        if (kind === 'outcome_vs_decision' && (timeline.contactAt == null || timeline.outcomeAt == null || timeline.outcomeAt <= timeline.contactAt)) errors.push(prefix + ': outcome must follow the decision contact.');
        if (kind === 'two_point_sequence') {
          if (timeline.firstAt == null || timeline.secondAt == null || timeline.firstFlight == null || timeline.secondFlight == null) errors.push(prefix + ': two-point clock is incomplete.');
          if (timeline.secondAt <= timeline.firstAt + timeline.firstFlight) errors.push(prefix + ': point two begins before point one has finished.');
          if (timeline.secondBounceAt <= timeline.secondAt || timeline.secondBounceAt > timeline.secondAt + timeline.secondFlight) errors.push(prefix + ': point-two bounce is detached from its shot.');
        }
        if (mode === 'read') {
          const cues = timeline.cueAt || [];
          if (cues.some(function (at, index) { return index > 0 && at - cues[index - 1] < .50; })) errors.push(prefix + ': evidence beats are too compressed to read separately.');
          if (timeline.questionAt == null || timeline.questionAt - cues[cues.length - 1] < .45) errors.push(prefix + ': the decision arrives before the final evidence beat can land.');
          if (timeline.total - timeline.questionAt < .35) errors.push(prefix + ': the decision state has no settling time.');
        }
      });
    });
    return errors;
  }

  function auditCourtRead(v) {
    const errors=[], isPoint=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite);
    if(!v || !['runaround','middle-return','future-space'].includes(v.mode)) return ['Unknown court-read mode'];
    const coords=['playerStart','player','opponentStart','opponent','bounce'];
    if(coords.some(k=>!isPoint(v[k])) || !Array.isArray(v.incoming) || v.incoming.length<3 || !v.incoming.every(isPoint)) return ['Missing authored setup coordinates'];
    const split=splitPathAtBounce(v.incoming,v.bounce);
    if(!split) errors.push('Incoming bounce must lie on the authored path');
    else {
      const a=split.flight[0],b=v.bounce,c=split.exit[split.exit.length-1],u=[b[0]-a[0],b[1]-a[1]],w=[c[0]-b[0],c[1]-b[1]];
      const cosine=(u[0]*w[0]+u[1]*w[1])/(Math.hypot(...u)*Math.hypot(...w));
      if(!Number.isFinite(cosine)||cosine<.985) errors.push('Undeclared sideways turn at bounce');
    }
    if(v.bounce[0]<40||v.bounce[0]>210||v.bounce[1]<=85||v.bounce[1]>156) errors.push('Setup bounce must be in near singles court');
    if(v.mode==='middle-return'&&(v.incoming[0][0]>=125||v.incoming[0][1]>=14||v.bounce[0]<=125||v.bounce[1]>120)) errors.push('Far deuce serve must land in diagonal near-right service box');
    if(v.mode==='future-space'&&(!isPoint(v.momentum)||(v.opponent[0]-v.opponentStart[0])*(v.momentum[0]-v.opponent[0])<0)) errors.push('Momentum must continue the observed direction');
    if(!Array.isArray(v.choices)||v.choices.length!==4) return errors.concat('Four authored choice consequences required');
    const contact=v.incoming[v.incoming.length-1];
    v.choices.forEach(c=>{
      if(!c||!isPoint(c.player)||!isPoint(c.target)||!isPoint(c.receiver)||!Array.isArray(c.replyEnds)||c.replyEnds.length!==2||!c.replyEnds.every(isPoint)||!c.note) {errors.push('Incomplete choice consequence');return;}
      if(c.target[0]<40||c.target[0]>210||c.target[1]<14||c.target[1]>=85) errors.push('Shot target must stay in far singles court');
      if(c.player[1]<=85||c.receiver[1]>=85||Math.hypot(c.player[0]-contact[0],c.player[1]-contact[1])>30) errors.push('Choice detached from contact or opponent court');
      if(c.recoverTo&&(!isPoint(c.recoverTo)||c.recoverTo[1]<=85)) errors.push('Invalid near-player recovery');
      if(c.opponentVia&&(!isPoint(c.opponentVia)||c.opponentVia[1]>=85||(c.opponentVia[0]-v.opponent[0])*(c.receiver[0]-c.opponentVia[0])>=0)) errors.push('Authored braking path must reverse direction');
    });
    return errors;
  }

  function audit() {
    const errors = [];
    const ids = new Set();
    const proPlayers = new Set();
    const proSources = new Set();
    if (!lessonSpines || !lessonSpines.integrity || !lessonSpines.integrity.ok) {
      errors.push('Canonical lesson-spine contract is missing or invalid.');
    }
    validateEvidenceTimelines().forEach(function (error) { errors.push('Evidence timeline ' + error); });
    if (challenges.length !== 21 || lessonExtensions.length !== 3) errors.push('The validated bank must contain twenty-one lessons and all three new evidence modules.');
    const usedKinds = new Set(challenges.flatMap(function (challenge) { return challenge.steps.map(function (step) { return step.visual && step.visual.kind; }); }));
    usedKinds.forEach(function (kind) {
      if (!EVIDENCE_TIMELINES[kind]) errors.push(kind + ': missing evidence timeline; rendering is withheld.');
      if (!VISUAL_RENDERERS[kind]) errors.push(kind + ': missing validated renderer; rendering is withheld.');
    });
    challenges.forEach(function (challenge) {
      if (!challenge.id || ids.has(challenge.id)) errors.push('Every challenge needs a unique stable ID.');
      ids.add(challenge.id);
      if (challenge.attentionPolicy !== ATTENTION_POLICY) errors.push(challenge.id + ': every prototype must explicitly use the evidence-first attention policy.');
      const spine = lessonSpines && lessonSpines.byId && lessonSpines.byId[challenge.lessonSpineId];
      if (!spine || spine.status !== 'prototype' || spine.prototypeId !== challenge.id) {
        errors.push(challenge.id + ': canonical lesson-spine binding is missing or points elsewhere.');
      } else {
        if (challenge.title !== spine.title || challenge.memory !== spine.memory || challenge.insight !== spine.painHook || challenge.takeItToCourt !== spine.tomorrowAction) {
          errors.push(challenge.id + ': user-facing lesson language has drifted from its canonical spine.');
        }
        if (challenge.proInsight !== spine.proInsight) errors.push(challenge.id + ': Pro Insight is not sourced from the canonical lesson spine.');
        if (!challenge.steps.every(function (step) { return step.visual && step.visual.kind === spine.visualContract.kind; })) {
          errors.push(challenge.id + ': rendered visual family has drifted from its canonical lesson spine.');
        }
        if (challenge.steps.map(function (step) { return step.decisionLens; }).join('|') !== spine.prototypeDecisionLenses.join('|')) {
          errors.push(challenge.id + ': decision sequence has drifted from its canonical lesson spine.');
        }
      }
      if (!challenge.title || !challenge.memory || !challenge.insight) errors.push(challenge.id + ': missing title, memory line or insight.');
      if (!/^Next time/i.test(challenge.takeItToCourt || '')) errors.push(challenge.id + ': court cue must begin “Next time”.');
      const pro = challenge.proInsight;
      if (!pro || !pro.player || !pro.documentedMoment || !pro.gameSharpRead || !pro.source) {
        errors.push(challenge.id + ': missing named, sourced Pro Insight.');
      } else {
        const surname = pro.player.trim().split(/\s+/).pop().toLowerCase();
        proPlayers.add(pro.player + '|' + pro.documentedMoment);
        proSources.add(pro.source.url);
        if (pro.player.trim().split(/\s+/).length < 2) errors.push(challenge.id + ': Pro Insight must name the player, not use a generic champion label.');
        if (wordCount(pro.documentedMoment) < 16 || wordCount(pro.documentedMoment) > 30) errors.push(challenge.id + ': documented Pro moment must use sixteen to thirty words.');
        if (wordCount(pro.gameSharpRead) > 12) errors.push(challenge.id + ': GameSharp interpretation exceeds twelve words.');
        if (pro.claimType !== 'sourced_paraphrase') errors.push(challenge.id + ': prototype Pro Insights must be explicitly classified as sourced paraphrases.');
        if (pro.endorsement !== false) errors.push(challenge.id + ': Pro Insight must explicitly record that no endorsement exists.');
        if (/[“”"]/.test(pro.documentedMoment)) errors.push(challenge.id + ': unverified direct quotation is structurally forbidden.');
        if (pro.documentedMoment.toLowerCase().indexOf(surname) === -1) errors.push(challenge.id + ': sourced moment does not identify its named player.');
        if (!pro.source.publisher || !pro.source.title || !pro.source.published || !/^https:\/\//.test(pro.source.url || '')) errors.push(challenge.id + ': Pro Insight provenance is incomplete or non-secure.');
        if ((pro.source.title || '').toLowerCase().indexOf(surname) === -1) errors.push(challenge.id + ': source title does not match its named player.');
        const resultWords = wordCount(challenge.memory) + wordCount(pro.documentedMoment) + wordCount(pro.gameSharpRead) + wordCount(challenge.takeItToCourt);
        if (resultWords > 60) errors.push(challenge.id + ': final human payoff exceeds the mobile reading budget.');
      }
      if (!Array.isArray(challenge.steps) || challenge.steps.length !== 3) errors.push(challenge.id + ': must have exactly three interactions.');
      const questions = new Set();
      const situations = new Set();
      (challenge.steps || []).forEach(function (step, stepIndex) {
        const prefix = challenge.id + ' step ' + (stepIndex + 1);
        if (!step.phase || !step.situation || !step.question || !step.unlock || !step.payoff || !step.principle || !step.why) errors.push(prefix + ': incomplete authored content.');
        if (!step.decisionLens) errors.push(prefix + ': missing decision lens.');
        if (!step.visual || !step.visual.kind || !step.visual.description) errors.push(prefix + ': missing authored visual state.');
        if (!isPacedEvidence(step)) errors.push(prefix + ': every prototype interaction needs an authored evidence-first timeline.');
        if (!step.visual || !Array.isArray(step.visual.cues) || step.visual.cues.length !== 3) errors.push(prefix + ': visual must carry exactly three observable cues.');
        if (step.visual && step.visual.answerCues && (!Array.isArray(step.visual.answerCues) || step.visual.answerCues.length !== 3)) errors.push(prefix + ': answer cues must preserve the three-beat evidence rail.');
        if (isPacedEvidence(step)) {
          const rails = [step.visual.cues].concat(step.visual.answerCues ? [step.visual.answerCues] : []);
          rails.forEach(function (rail) {
            if (!rail.every(function (cue, cueIndex) { return new RegExp('^' + (cueIndex + 1) + '\\s').test(cue); })) errors.push(prefix + ': paced evidence cues must expose their order.');
            if (/contact height|your balance|court exposed|serve target|returner$|reply$/i.test(rail.join('|'))) errors.push(prefix + ': paced evidence cues must show observed states, not generic categories.');
          });
        }
        if (!Array.isArray(step.options) || step.options.length !== 4) errors.push(prefix + ': needs exactly four choices.');
        if (!Number.isInteger(step.correct) || step.correct < 0 || step.correct > 3) errors.push(prefix + ': invalid answer key.');
        if (wordCount(step.situation) > 14) errors.push(prefix + ': context line exceeds fourteen words.');
        if (wordCount(step.question) > 8) errors.push(prefix + ': decision prompt exceeds eight words.');
        if ((step.options || []).some(function (option) { const n = wordCount(option.text); return n < 4 || n > 10; })) errors.push(prefix + ': every choice must use four to ten words.');
        if ((step.options || []).some(function (option) { return /\b(?:always|never|definitely|regardless|anyway|simply)\b|much more|stop your feet/i.test(option.text); })) errors.push(prefix + ': a distractor telegraphs itself with absolute or self-defeating language.');
        if (sentenceCount(step.payoff) > 1 || wordCount(step.payoff) > 16) errors.push(prefix + ': visible payoff must be one sentence of sixteen words or fewer.');
        if (wordCount(step.unlock) > 6) errors.push(prefix + ': insight unlock exceeds six words.');
        if (sentenceCount(step.principle) > 1 || wordCount(step.principle) > 18) errors.push(prefix + ': visible principle must be one sentence of eighteen words or fewer.');
        if (sentenceCount(step.why) > 2 || wordCount(step.why) > 34) errors.push(prefix + ': optional Why exceeds two concise sentences.');
        const visibleWords = wordCount(step.situation) + wordCount(step.question) + (step.options || []).reduce(function (sum, option) { return sum + wordCount(option.text); }, 0) + wordCount(step.payoff) + wordCount(step.principle);
        if (visibleWords > 78) errors.push(prefix + ': visible reading load exceeds the muscle-without-bloat budget.');
        const cueTokens = new Set(meaningfulTokens((step.visual.cues || []).join(' ') + ' ' + (step.visual.symptom || '')));
        meaningfulTokens((step.options || [])[step.correct] && step.options[step.correct].text).forEach(function (token) {
          const mirroredByDistractor = (step.options || []).some(function (option, optionIndex) {
            return optionIndex !== step.correct && meaningfulTokens(option.text).indexOf(token) !== -1;
          });
          if (cueTokens.has(token) && !mirroredByDistractor) errors.push(prefix + ': visual uniquely mirrors the correct answer token “' + token + '”.');
        });
        if (questions.has(step.question)) errors.push(prefix + ': repeated question.');
        if (situations.has(step.situation)) errors.push(prefix + ': repeated situation.');
        questions.add(step.question);
        situations.add(step.situation);
        const optionIds = new Set((step.options || []).map(function (option) { return option.id; }));
        if (optionIds.size !== 4) errors.push(prefix + ': choice IDs must be unique.');
        if(step.visual && step.visual.kind==='high_ball_contrast') highBall.audit(step).forEach(function(error){errors.push(prefix+': '+error);});
        if(step.visual && ['approach_to_volley','serve_adjustment'].includes(step.visual.kind)) construction.audit(step).forEach(function(error){errors.push(prefix+': '+error);});
        if(step.visual && tradeoffs && tradeoffs.kinds.includes(step.visual.kind)) tradeoffs.audit(step).forEach(function(error){errors.push(prefix+': '+error);});
        const extension = extensionFor(step);
        if(extension) {
          extension.audit(step).forEach(function(error){errors.push(prefix+': '+error);});
          [false,true].forEach(function(answered){
            const t=timelineFor(step,answered),tag=prefix+(answered?' answer':' read');
            if(!t||!Number.isFinite(t.total)||t.total<=0||!Array.isArray(t.cueAt)||t.cueAt.length!==3){errors.push(tag+': invalid per-scene timeline');return;}
            if(t.cueAt.some(function(n,i,a){return !Number.isFinite(n)||n<0||n>t.total||(i&&n<a[i-1]);}))errors.push(tag+': invalid cue ordering');
            if(!answered&&(t.cueAt.some(function(n,i,a){return i&&n-a[i-1]<.5;})||t.questionAt<t.cueAt[2]+.25||t.questionAt>t.total))errors.push(tag+': evidence-first spacing or settling beat missing');
            if(answered&&(!Number.isFinite(t.inkAt)||!Number.isFinite(t.correctionAt)||!Number.isFinite(t.correctionInkAt)||t.inkAt>t.correctionAt||t.correctionAt>=t.correctionInkAt||t.correctionInkAt>t.total))errors.push(tag+': invalid consequence/correction order');
            [null,0,1,2,3].filter(function(choice){return answered?choice!=null:choice==null;}).forEach(function(choice){if(extension.events(step,choice).some(function(e){return !Number.isFinite(e.at)||e.at<0||e.at>t.total;}))errors.push(tag+': sound exceeds authored timeline');});
          });
        }
        if(step.visual && step.visual.kind==='court_read') {
          auditCourtRead(step.visual).forEach(function(error){errors.push(prefix+': '+error);});
          step.options.forEach(function(option,i){if(/\brecover\b|\bregain\b/i.test(option.text)&&!step.visual.choices[i].recoverTo)errors.push(prefix+': promised recovery is missing from choice '+option.id);});
        }
        if (step.visual && step.visual.kind === 'recovery') {
          if (!Array.isArray(step.visual.targets) || step.visual.targets.length !== 4) {
            errors.push(prefix + ': recovery visual must map all four choices.');
          } else {
            (step.options || []).forEach(function (option, optionIndex) {
              const target = step.visual.targets[optionIndex];
              if (/behind the baseline|give ground/i.test(option.text) && (!target || target[1] <= 156)) errors.push(prefix + ': recovery words and rendered baseline position contradict each other.');
            });
          }
        }
        if (step.visual && step.visual.kind === 'shortBall') {
          if (!Array.isArray(step.visual.paths) || step.visual.paths.length !== 4) {
            errors.push(prefix + ': shot visual must map all four choices.');
          } else {
            (step.options || []).forEach(function (option, optionIndex) {
              const path = step.visual.paths[optionIndex] || [];
              const start = path[0] || [];
              const landing = path[path.length - 1] || [];
              if (!(landing[0] >= 40 && landing[0] <= 210 && landing[1] >= 14 && landing[1] < 85)) errors.push(prefix + ': a shot path lands outside the far singles court.');
              if (/through (the )?middle/i.test(option.text) && Math.abs(landing[0] - 125) > 15) errors.push(prefix + ': a middle target renders outside the middle lane.');
              if (/down the line/i.test(option.text) && start[0] < 70 && !(landing[0] >= 40 && landing[0] <= 60)) errors.push(prefix + ': a down-the-line target renders outside its singles lane.');
            });
          }
        }
        if (step.visual && step.visual.kind === 'contact') {
          const motion = step.visual.motion;
          if (!step.visual.focusCue || !step.visual.previewDescription) errors.push(prefix + ': contact motion must tell every player where to look without revealing the answer.');
          if (!motion || motion.stroke !== 'forehand' || !motion.fault || !['wide', 'short'].includes(motion.outcome) || motion.reveal !== 'fix-then-compare' || motion.contactFrame !== 0.61) errors.push(prefix + ': contact diagnosis lacks the validated motion and outcome contract.');
          if (!step.evidence || !step.evidence.observed || !step.evidence.inference || !step.evidence.courtCheck) errors.push(prefix + ': contact teaching must separate observation, inference and the next court check.');
          if (step.evidence && /cause|culprit|because|proves?|definitely|late timing/i.test(step.evidence.observed || '')) errors.push(prefix + ': observed contact evidence makes a causal claim the motion cannot prove.');
          if (step.evidence && !/may|might|can|worth|hypothesis/i.test(step.evidence.inference || '')) errors.push(prefix + ': contact inference must visibly preserve uncertainty.');
          if (step.evidence && !/watch|observe|check|notice|compare/i.test(step.evidence.courtCheck || '')) errors.push(prefix + ': contact evidence needs a concrete next observation.');
          if (motion && !['miss', 'fix'].includes(motion.previewMode)) errors.push(prefix + ': contact preview mode must be an authored miss or reference frame.');
          if (motion && typeof motion.showOutcome !== 'boolean') errors.push(prefix + ': contact outcome visibility must be explicit.');
          if ('observed' in step.visual || 'reference' in step.visual || 'body' in step.visual) errors.push(prefix + ': static contact diagrams are forbidden.');
        }
        if (step.visual && step.visual.kind === 'direction_change') {
          const visual = step.visual;
          if (!Array.isArray(visual.incoming) || visual.incoming.length < 3 || !Array.isArray(visual.paths) || visual.paths.length !== 4) {
            errors.push(prefix + ': direction-change evidence needs one incoming ball and four authored replies.');
          } else {
            const contact = point(visual.ball);
            (step.options || []).forEach(function (option, optionIndex) {
              const path = visual.paths[optionIndex] || [];
              const start = point(path[0] || []), landing = point(path[path.length - 1] || []);
              if (Math.abs(start.x - contact.x) > 1 || Math.abs(start.y - contact.y) > 1) errors.push(prefix + ': reply ' + option.id + ' does not begin at the authored contact.');
              if (!(landing.x >= 40 && landing.x <= 210 && landing.y >= 14 && landing.y < 85)) errors.push(prefix + ': reply ' + option.id + ' lands outside the far singles court.');
              if (/through (the )?middle|through middle/i.test(option.text) && Math.abs(landing.x - 125) > 15) errors.push(prefix + ': a middle reply renders outside the middle lane.');
              if (/down the (?:open )?line/i.test(option.text)) {
                if (start.x < 125 && landing.x > 75) errors.push(prefix + ': a left-side line reply crosses away from its singles lane.');
                if (start.x > 125 && landing.x < 175) errors.push(prefix + ': a right-side line reply crosses away from its singles lane.');
              }
              if (/crosscourt/i.test(option.text)) {
                if (start.x < 125 && landing.x <= 125) errors.push(prefix + ': a left-side crosscourt reply does not cross the court.');
                if (start.x > 125 && landing.x >= 125) errors.push(prefix + ': a right-side crosscourt reply does not cross the court.');
              }
            });
          }
          if (!visual.ballLabel || !visual.playerState || !visual.exposure || !visual.exposureLabel) errors.push(prefix + ': direction change must show contact, balance and recovery exposure.');
        }
        if (step.visual && step.visual.kind === 'serve_plus_one') {
          const visual = step.visual;
          const serve = visual.serve || [], reply = visual.returnPath || [], paths = visual.paths || [];
          const contract = visual.serveContract || {};
          const server = point(visual.server || []), returner = point(visual.returner || []), contact = point(visual.contact || []);
          const serveStart = point(serve[0] || []), serveEnd = point(serve[serve.length - 1] || []), serveBounce = point(visual.serveBounce || []);
          const replyStart = point(reply[0] || []), replyEnd = point(reply[reply.length - 1] || []), replyBounce = point(visual.returnBounce || []);
          const bounceIndex = serve.findIndex(function (candidate) {
            const candidatePoint = point(candidate || []);
            return Math.abs(candidatePoint.x - serveBounce.x) <= 1 && Math.abs(candidatePoint.y - serveBounce.y) <= 1;
          });
          if (!['return', 'plusOne'].includes(visual.choiceRole) || serve.length < 4 || reply.length < 4 || paths.length !== 4) errors.push(prefix + ': serve-plus-one evidence needs a complete serve, return and four choices.');
          if (contract.handedness !== 'right' || contract.courtSide !== 'deuce' || contract.spin !== 'slice' || contract.camera !== 'server-behind' || contract.screenExit !== 'left') errors.push(prefix + ': serve handedness, court side, spin and camera contract has drifted.');
          if (Math.abs(serveStart.x - server.x) > 1 || Math.abs(serveStart.y - server.y) > 1 || Math.abs(serveEnd.x - returner.x) > 1 || Math.abs(serveEnd.y - returner.y) > 1) errors.push(prefix + ': serve path is detached from server or returner.');
          if (!(server.x > 125 && server.x < 210)) errors.push(prefix + ': right-handed deuce-court server must begin screen-right of the centre mark.');
          if (!(serveBounce.x >= 40 && serveBounce.x < 125 && serveBounce.y > 50 && serveBounce.y < 85)) errors.push(prefix + ': deuce-court slice must bounce in the far-left service box.');
          if (!(returner.x >= 25 && returner.x < 40)) errors.push(prefix + ': wide slice must pull the far returner just outside the screen-left singles sideline.');
          if (bounceIndex <= 0 || bounceIndex >= serve.length - 1) errors.push(prefix + ': the authored serve bounce must split flight from post-bounce skid.');
          else {
            const exit = serve.slice(bounceIndex);
            if (serveEnd.x > serveBounce.x - 8) errors.push(prefix + ': right-handed deuce-court slice does not exit the bounce far enough screen-left.');
            if (exit.some(function (candidate, index) { return index > 0 && Number(candidate[0]) >= Number(exit[index - 1][0]); })) errors.push(prefix + ': post-bounce slice path reverses or stalls instead of continuing screen-left.');
          }
          if (Math.abs(replyStart.x - returner.x) > 1 || Math.abs(replyStart.y - returner.y) > 1 || Math.abs(replyEnd.x - contact.x) > 1 || Math.abs(replyEnd.y - contact.y) > 1) errors.push(prefix + ': return path is detached from returner or first-ball contact.');
          if (!(replyBounce.x >= 40 && replyBounce.x <= 210 && replyBounce.y > 85 && replyBounce.y <= 156)) errors.push(prefix + ': return bounce is outside the near singles court.');
          (step.options || []).forEach(function (option, optionIndex) {
            const path = paths[optionIndex] || [];
            const start = point(path[0] || []), landing = point(path[path.length - 1] || []);
            const expectedStart = visual.choiceRole === 'return' ? returner : contact;
            const expectedNearSide = visual.choiceRole === 'return';
            if (Math.abs(start.x - expectedStart.x) > 1 || Math.abs(start.y - expectedStart.y) > 1) errors.push(prefix + ': choice ' + option.id + ' is detached from its authored strike point.');
            if (!(landing.x >= 40 && landing.x <= 210 && (expectedNearSide ? landing.y > 85 && landing.y <= 156 : landing.y >= 14 && landing.y < 85))) errors.push(prefix + ': choice ' + option.id + ' lands outside the correct singles half.');
            if (/middle/i.test(option.text) && Math.abs(landing.x - 125) > 18) errors.push(prefix + ': a middle choice renders outside the middle lane.');
            if (/crosscourt/i.test(option.text) && ((start.x < 125 && landing.x <= 125) || (start.x > 125 && landing.x >= 125))) errors.push(prefix + ': a crosscourt choice does not cross the court.');
            if (/open court/i.test(option.text) && returner.x < 125 && landing.x <= 125) errors.push(prefix + ': open-court choice renders back toward the displaced returner.');
          });
          if (!visual.serveLabel || !visual.returnLabel || !visual.playerState || !visual.returnerState) errors.push(prefix + ': serve-plus-one visual cues are incomplete.');
          if (visual.choiceRole === 'return') {
            const observedLanding = replyEnd;
            const leaksChoice = paths.some(function (path) {
              const choiceLanding = point(path[path.length - 1] || []);
              return Math.hypot(choiceLanding.x - observedLanding.x, choiceLanding.y - observedLanding.y) < 10;
            });
            if (leaksChoice && visual.hideTargetsBeforeAnswer !== true) errors.push(prefix + ': observed return overlaps an answer target, so pre-answer targets must be withheld.');
          }
        }
        if (step.visual && step.visual.kind === 'return_position') {
          const visual = step.visual;
          const serve = visual.serve || [], referenceServe = visual.referenceServe || [];
          const server = point(visual.server || []), contact = point(visual.contact || []), referenceContact = point(visual.referenceContact || []), bounce = point(visual.serveBounce || []);
          const bounceIndex = serve.findIndex(function (candidate) { return Number(candidate[0]) === bounce.x && Number(candidate[1]) === bounce.y; });
          const referenceBounceIndex = referenceServe.findIndex(function (candidate) { return Number(candidate[0]) === bounce.x && Number(candidate[1]) === bounce.y; });
          if (!['choice', 'compare'].includes(visual.mode) || serve.length < 5 || referenceServe.length < 5) errors.push(prefix + ': return position needs current and reference serve evidence.');
          if (point(serve[0] || []).x !== server.x || point(serve[0] || []).y !== server.y || point(referenceServe[0] || []).x !== server.x || point(referenceServe[0] || []).y !== server.y) errors.push(prefix + ': return-position serves must begin at the same server.');
          if (point(serve[serve.length - 1] || []).x !== contact.x || point(serve[serve.length - 1] || []).y !== contact.y) errors.push(prefix + ': current serve must end at current return contact.');
          if (point(referenceServe[referenceServe.length - 1] || []).x !== referenceContact.x || point(referenceServe[referenceServe.length - 1] || []).y !== referenceContact.y) errors.push(prefix + ': reference serve must end at reference return contact.');
          if (bounceIndex < 2 || referenceBounceIndex !== bounceIndex || !(bounce.x >= 40 && bounce.x <= 210 && bounce.y > 85 && bounce.y < 120)) errors.push(prefix + ': both serves must share one legal near-side service-box bounce.');
          if (bounceIndex >= 0 && JSON.stringify(serve.slice(0, bounceIndex + 1)) !== JSON.stringify(referenceServe.slice(0, referenceBounceIndex + 1))) errors.push(prefix + ': return-position comparison changed the serve before the bounce.');
          if (!Array.isArray(visual.returnPath) || !Array.isArray(visual.referenceReturnPath) || point(visual.returnPath[0] || []).y !== contact.y || point(visual.referenceReturnPath[0] || []).y !== referenceContact.y) errors.push(prefix + ': return paths are detached from their authored contacts.');
          if (visual.mode === 'choice' && (!Array.isArray(visual.choiceStarts) || visual.choiceStarts.length !== 4)) errors.push(prefix + ': return-position choice must map all four starting positions.');
          if (!visual.playerState || !visual.referenceState) errors.push(prefix + ': return-position comparison needs both visible player states.');
        }
        if (step.visual && step.visual.kind === 'split_step_timeline') {
          const visual = step.visual;
          const ballPath = visual.ballPath || [];
          if (ballPath.length < 4 || JSON.stringify(ballPath[0]) !== JSON.stringify(visual.opponent) && Math.hypot(Number(ballPath[0] && ballPath[0][0]) - Number(visual.opponent && visual.opponent[0]), Number(ballPath[0] && ballPath[0][1]) - Number(visual.opponent && visual.opponent[1])) > 8) errors.push(prefix + ': split-step ball must leave the opponent’s strike zone.');
          if (!Number.isFinite(visual.landingOffset) || visual.landingOffset < -.65 || visual.landingOffset > .65 || !Number.isFinite(visual.firstStepDelay) || visual.firstStepDelay < 0) errors.push(prefix + ': split-step timing offsets are invalid.');
          if (!Number.isFinite(visual.opponentContactOffset) || visual.opponentContactOffset > 0 || visual.opponentContactOffset < -.45) errors.push(prefix + ': split-step opponent tempo must be explicitly authored.');
          if (!Number.isFinite(visual.hopDuration) || visual.hopDuration < .12 || visual.hopDuration > .5) errors.push(prefix + ': split-step hop duration is invalid.');
          if (!Number.isFinite(visual.referenceOffset) || visual.referenceOffset <= 0 || visual.referenceOffset > .25 || !Number.isFinite(visual.referenceFirstStepDelay) || visual.referenceFirstStepDelay <= visual.referenceOffset) errors.push(prefix + ': split-step reference must land shortly after contact and push after landing.');
          if (!Array.isArray(visual.moveTarget) || !Array.isArray(visual.ballBounce) || !visual.timingState) errors.push(prefix + ': split-step movement evidence is incomplete.');
          if (visual.moveTarget && ballPath.length && ((visual.moveTarget[0] < 125) !== (ballPath[ballPath.length - 1][0] < 125))) errors.push(prefix + ': first step moves away from the authored ball direction.');
          if (!splitPathAtBounce(ballPath, visual.ballBounce)) errors.push(prefix + ': split-step bounce must be an interior authored path point.');
          if (step.transfer && (!Array.isArray(visual.choiceTimings) || visual.choiceTimings.length !== 4)) errors.push(prefix + ': split-step transfer needs an explicit consequence for each adjustment.');
          if (Array.isArray(visual.choiceTimings)) {
            visual.choiceTimings.forEach(function (timing) {
              if (!timing || !Number.isFinite(timing.landingOffset) || !Number.isFinite(timing.firstStepDelay) || !Number.isFinite(timing.hopDuration) || timing.hopDuration < .12 || timing.hopDuration > .5 || timing.firstStepDelay < timing.landingOffset) errors.push(prefix + ': selected split-step timing is incomplete or moves before landing.');
            });
            const correctTiming = visual.choiceTimings[step.correct];
            if (!correctTiming || correctTiming.landingOffset !== visual.referenceOffset || correctTiming.firstStepDelay !== visual.referenceFirstStepDelay) errors.push(prefix + ': correct split-step choice must use the authored reference landing and push.');
          }
          [null, 0, 1, 2, 3].forEach(function (choice) {
            const timeline = timelineFor(step, choice != null);
            const scenes = splitStepScenes(step, choice, timeline);
            scenes.forEach(function (scene, sceneIndex) {
              const nextScene = scenes[sceneIndex + 1];
              if (![scene.contactAt, scene.landingAt, scene.moveAt, scene.takeoffAt, scene.endAt].every(Number.isFinite) || scene.takeoffAt < scene.startAt || scene.landingAt <= scene.takeoffAt || scene.moveAt < scene.landingAt || scene.contactAt <= scene.loadAt || scene.bounceAt <= scene.contactAt || scene.bounceAt >= scene.contactAt + scene.flight || scene.endAt > timeline.total) errors.push(prefix + ': split-step scene events fall outside their authored clock.');
              if (nextScene && scene.endAt >= nextScene.startAt) errors.push(prefix + ': corrected split-step shot overlaps the selected consequence.');
            });
            if (choice != null) {
              const payoffAt = choice === step.correct ? timeline.inkAt : timeline.correctionInkAt;
              if (payoffAt < scenes[scenes.length - 1].endAt) errors.push(prefix + ': split-step payoff precedes the completed reference shot.');
            }
          });
        }
        if (step.visual && step.visual.kind === 'outcome_vs_decision') {
          const visual = step.visual;
          const contact = point(visual.contact || []), incoming = visual.incoming || [], risky = visual.riskyPath || [], repeatable = visual.repeatablePath || [];
          if (!['result', 'compare', 'permission'].includes(visual.mode) || incoming.length < 3 || risky.length < 3 || repeatable.length < 3) errors.push(prefix + ': decision-quality visual needs one incoming ball and two authored choices.');
          if (incoming.length && (Math.abs(point(incoming[incoming.length - 1]).x - contact.x) > 1 || Math.abs(point(incoming[incoming.length - 1]).y - contact.y) > 1)) errors.push(prefix + ': incoming ball is detached from decision contact.');
          [risky, repeatable].forEach(function (path) { if (path.length && (Math.abs(point(path[0]).x - contact.x) > 1 || Math.abs(point(path[0]).y - contact.y) > 1)) errors.push(prefix + ': compared choice is detached from decision contact.'); });
          [visual.riskyTarget, visual.repeatableTarget].forEach(function (target) { if (!Array.isArray(target) || target.length !== 4 || target[0] < 40 || target[0] > 210 || target[1] < 14 || target[1] >= 85) errors.push(prefix + ': target window leaves the far singles court.'); });
          if (risky.length && visual.riskyTarget && (Math.abs(point(risky[risky.length - 1]).x - visual.riskyTarget[0]) > 1 || Math.abs(point(risky[risky.length - 1]).y - visual.riskyTarget[1]) > 1)) errors.push(prefix + ': risky path is detached from its target window.');
          if (repeatable.length && visual.repeatableTarget && (Math.abs(point(repeatable[repeatable.length - 1]).x - visual.repeatableTarget[0]) > 1 || Math.abs(point(repeatable[repeatable.length - 1]).y - visual.repeatableTarget[1]) > 1)) errors.push(prefix + ': repeatable path is detached from its target window.');
          if (typeof visual.showOutcome !== 'boolean' || !visual.ballClass || !visual.playerState) errors.push(prefix + ': decision-quality evidence state is incomplete.');
        }
        if (step.visual && step.visual.kind === 'two_point_sequence') {
          const visual = step.visual;
          if (!['rally', 'reset', 'serve'].includes(visual.mode) || !Array.isArray(visual.firstPath) || visual.firstPath.length < 3) errors.push(prefix + ': two-point sequence needs a complete original event.');
          if (!visual.firstOutcome || JSON.stringify((visual.firstPath || []).slice(-1)[0]) !== JSON.stringify(visual.firstLanding)) errors.push(prefix + ': original outcome is detached from its path.');
          if (visual.mode !== 'serve' && (!Array.isArray(visual.secondPath) || visual.secondPath.length < 3 || !visual.secondOutcome || JSON.stringify(visual.secondPath.slice(-1)[0]) !== JSON.stringify(visual.secondLanding))) errors.push(prefix + ': next ball or target plan is incomplete.');
          if (visual.responsePath && JSON.stringify(visual.responsePath[visual.responsePath.length - 1]) !== JSON.stringify(visual.responseLanding)) errors.push(prefix + ': opponent response is detached from its outcome.');
          if (visual.mode === 'reset' && (!Array.isArray(visual.choiceTargets) || visual.choiceTargets.length !== 4 || !Array.isArray(visual.choiceLabels) || visual.choiceLabels.length !== 4)) errors.push(prefix + ': reset decision needs four authored target plans.');
          if (visual.mode === 'serve') {
            const target = visual.resetTarget || [];
            const first=visual.firstServer||[],next=visual.player||[],left=next[0]<60?60:19,right=next[0]<60?101:60;
            if (!Array.isArray(visual.routineBefore) || !Array.isArray(visual.routineObserved) || !Array.isArray(visual.resetRoutine) || visual.resetRoutine.length !== 3 || !/RESULT UNKNOWN/.test(visual.resetOutcome || '')) errors.push(prefix + ': serve reset must show preparation with an unknown result.');
            if (visual.secondPath || visual.secondLanding || visual.resetPath || visual.resetLanding) errors.push(prefix + ': serve reset must not manufacture a future serve result.');
            if (visual.firstLanding && visual.firstLanding[0] >= 19 && visual.firstLanding[0] <= 60 && visual.firstLanding[1] >= 43 && visual.firstLanding[1] <= 80) errors.push(prefix + ': previous double fault lands in its service box.');
            if (!(first[1]>=152&&next[1]>=152&&(first[0]-60)*(next[0]-60)<0)) errors.push(prefix+': consecutive points need opposite serving sides behind the baseline.');
            if (target.length !== 4 || target[0] - target[2]/2 < left || target[0] + target[2]/2 > right || target[1] - target[3]/2 < 43 || target[1] + target[3]/2 > 80) errors.push(prefix + ': reset target must fit inside the diagonal service box.');
          }
        }
      });
      if (!challenge.steps || !challenge.steps[2] || challenge.steps[2].transfer !== true) errors.push(challenge.id + ': interaction three must be authored as transfer.');
      if (challenge.steps && challenge.steps.length === 3) {
        const deepen = challenge.steps[1];
        const transfer = challenge.steps[2];
        const deepenAnswer = deepen.options && deepen.options[deepen.correct] && deepen.options[deepen.correct].text;
        const transferAnswer = transfer.options && transfer.options[transfer.correct] && transfer.options[transfer.correct].text;
        if (textOverlap(deepenAnswer, transferAnswer) >= 0.58) errors.push(challenge.id + ': transfer repeats the previous solution instead of requiring a new cue combination.');
        if (transfer.visual && transfer.visual.kind === 'contact' && /late contact|crowded contact|contact is still/i.test(transfer.situation || '')) errors.push(challenge.id + ': transfer context reveals the diagnosis before the player reads the motion.');
      }
    });
    if (proPlayers.size !== challenges.length) errors.push('Each prototype must carry a distinct professional story.');
    if (proSources.size !== challenges.length) errors.push('Each professional story must carry its own directly relevant source.');
    const recovery = challenges.find(function (challenge) { return challenge.slug === 'recovery'; });
    if (!recovery || recovery.steps.map(function (step) { return step.decisionLens; }).join('|') !== 'geometry|balance|tendency') errors.push('Recovery must layer geometry, balance and opponent tendency in that order.');
    if (!recovery || !Array.isArray(recovery.steps[2].visual.tendency) || !recovery.steps[2].visual.tendencyLabel) errors.push('Recovery transfer must render the observed opponent tendency.');
    const shortBall = challenges.find(function (challenge) { return challenge.slug === 'short-ball'; });
    if (shortBall && shortBall.steps.length === 3) {
      const opportunity = shortBall.steps[1].visual;
      const transfer = shortBall.steps[2].visual;
      const changedStates = ['ballLabel', 'playerState', 'opponentState'].filter(function (key) { return opportunity[key] !== transfer[key]; }).length;
      if (changedStates < 2) errors.push('Short-ball transfer must combine materially different cues from the preceding attack state.');
    }
    const contact = challenges.find(function (challenge) { return challenge.slug === 'contact'; });
    if (contact && contact.steps.length === 3) {
      if (contact.steps[0].visual.motion.outcome === contact.steps[2].visual.motion.outcome) errors.push('Contact transfer must visibly change ball outcome while preserving the observable contact clue.');
      if (!contact.steps.every(function (step) { return step.visual.motion.fault === 'jammed'; })) errors.push('Contact prototype must preserve one observable crowded-spacing clue across all three decisions.');
      if (contact.steps[1].visual.motion.previewMode !== 'fix') errors.push('Contact contrast must show the reference spacing before the player answers.');
      if (contact.steps[0].visual.motion.previewMode !== 'miss' || contact.steps[2].visual.motion.previewMode !== 'miss') errors.push('Contact observation and transfer must show the crowded frame before the player answers.');
    }
    const directionChange = challenges.find(function (challenge) { return challenge.slug === 'line'; });
    if (!directionChange || directionChange.steps.map(function (step) { return step.decisionLens; }).join('|') !== 'constraint|permission|transfer') errors.push('Direction change must layer constraint, permission and transfer in that order.');
    if (!directionChange || directionChange.steps[0].visual.player[0] >= 125 || directionChange.steps[2].visual.player[0] <= 125) errors.push('Direction-change transfer must change from backhand-side evidence to forehand-side evidence.');
    const servePlusOne = challenges.find(function (challenge) { return challenge.slug === 'serve-plus-one'; });
    if (!servePlusOne || servePlusOne.steps.map(function (step) { return step.decisionLens; }).join('|') !== 'prediction|confirmation|adaptation') errors.push('Serve plus one must layer prediction, confirmation and adaptation in that order.');
    if (servePlusOne && servePlusOne.steps.length === 3) {
      if (!servePlusOne.steps.every(function (step) { return JSON.stringify(step.visual.serve) === JSON.stringify(servePlusOne.steps[0].visual.serve); })) errors.push('Serve-plus-one transfer must preserve the same serve before changing the received ball.');
      if (servePlusOne.steps[0].visual.choiceRole !== 'return' || servePlusOne.steps.slice(1).some(function (step) { return step.visual.choiceRole !== 'plusOne'; })) errors.push('Serve plus one must read the return before asking for first-ball choices.');
      if (!Array.isArray(servePlusOne.steps[0].visual.evidencePaths) || servePlusOne.steps[0].visual.evidencePaths.length !== 1) errors.push('Serve prediction must show one live and one ghosted reply—exactly two observations without visual clutter.');
      if (servePlusOne.steps[0].visual.hideTargetsBeforeAnswer !== true) errors.push('Serve prediction must withhold choice targets until selection so the animation cannot disclose its answer.');
      if (servePlusOne.steps[2].visual.returnBounce[1] <= servePlusOne.steps[1].visual.returnBounce[1] + 20) errors.push('Serve transfer must visibly replace the short reply with a materially deeper return.');
    }
    const mentalReset = challenges.find(function (challenge) { return challenge.slug === 'two-points'; });
    if (!mentalReset || mentalReset.steps.map(function (step) { return step.decisionLens; }).join('|') !== 'contamination|reset|transfer') errors.push('Mental reset must expose contamination, reset and cross-stroke transfer in order.');
    if (!mentalReset || mentalReset.steps[0].visual.mode !== 'rally' || mentalReset.steps[2].visual.mode !== 'serve') errors.push('Mental reset transfer must move from a rally miss to a serve miss.');
    const returnPosition = challenges.find(function (challenge) { return challenge.slug === 'return-position'; });
    if (!returnPosition || returnPosition.steps.map(function (step) { return step.decisionLens; }).join('|') !== 'constraint|tradeoff|transfer') errors.push('Return position must teach constraint, trade-off and reversal in order.');
    if (!returnPosition || returnPosition.steps[0].visual.referenceStart[1] <= 156 || returnPosition.steps[2].visual.referenceStart[1] >= 156) errors.push('Return-position transfer must visibly turn the dial back inside the baseline.');
    const splitStep = challenges.find(function (challenge) { return challenge.slug === 'split-step'; });
    if (!splitStep || splitStep.steps.map(function (step) { return step.decisionLens; }).join('|') !== 'observation|timing|transfer') errors.push('Split-step timing must move from observation to alignment to tempo transfer.');
    if (!splitStep || !(splitStep.steps[0].visual.landingOffset < 0 && splitStep.steps[1].visual.landingOffset === splitStep.steps[1].visual.referenceOffset && splitStep.steps[2].visual.landingOffset > splitStep.steps[2].visual.referenceOffset)) errors.push('Split-step sequence must visibly contain early, ready and late landings.');
    if (splitStep) {
      const ready = splitStep.steps[1].visual, fast = splitStep.steps[2].visual;
      if (ready.opponentContactOffset !== 0 || fast.opponentContactOffset > -.30) errors.push('Split-step transfer must show a materially quicker opponent strike.');
      if (Math.abs(ready.landingOffset - fast.opponentContactOffset - fast.landingOffset) > .001 || Math.abs(ready.firstStepDelay - fast.opponentContactOffset - fast.firstStepDelay) > .001) errors.push('Split-step transfer must preserve the learner’s preceding landing and first-move clock.');
      if (JSON.stringify(splitStep.steps[0].visual.ballPath) !== JSON.stringify(ready.ballPath) || JSON.stringify(splitStep.steps[0].visual.player) !== JSON.stringify(ready.player)) errors.push('Split-step timing comparison must preserve the shot and starting spot.');
    }
    const decisionQuality = challenges.find(function (challenge) { return challenge.slug === 'winner'; });
    if (!decisionQuality || decisionQuality.steps.map(function (step) { return step.decisionLens; }).join('|') !== 'outcome|repeatability|transfer') errors.push('Decision quality must separate result, repeatability and earned-risk transfer.');
    if (!decisionQuality || decisionQuality.steps[0].visual.showOutcome !== true || decisionQuality.steps[1].visual.showOutcome !== false || decisionQuality.steps[2].visual.mode !== 'permission') errors.push('Decision quality must hide results before judging repeatability and then transfer to earned aggression.');
    return Object.freeze({
      ok: errors.length === 0,
      errors: Object.freeze(errors),
      counts: Object.freeze({ challenges: challenges.length, interactions: challenges.reduce(function (n, c) { return n + c.steps.length; }, 0) })
    });
  }

  function contactMotionRuntimeAvailable() {
    return typeof faspScene === 'function' && typeof faspStart === 'function' && typeof faspRender === 'function';
  }

  function runtimeAudit() {
    const errors = [];
    if (root.document && !contactMotionRuntimeAvailable()) errors.push('Validated contact-motion renderer is unavailable; static fallback is forbidden.');
    if (root.document && !(root.GSLivePointEngine && typeof root.GSLivePointEngine.createAudioEngine === 'function')) errors.push('Validated natural-court audio is unavailable; synthesized fallback is forbidden.');
    return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
  }

  const state = {
    daily: false,
    dailyDate: null,
    dailyReplay: false,
    dailyAnswers: [],
    dailyOrigin: null,
    practice: null,
    dailyHomeDate: null,
    overlay: null,
    challengeIndex: -1,
    stepIndex: 0,
    selectedIndex: null,
    score: 0,
    startedAt: 0,
    answerStartedAt: 0,
    previousFocus: null,
    pageState: [],
    motionRun: 0,
    audio: null,
    focusSubject: null,
    focusParent: null,
    focusNext: null,
    focusReturn: null,
    focusScrollTop: 0
  };

  let dailyStore;
  function getDailyStore() {
    if (!dailyStore) {
      let storage;
      try { storage = root.localStorage; } catch (_) { storage = null; }
      dailyStore = dailyLoop.createStore(storage);
    }
    return dailyStore;
  }

  function dailyCheckpoint(complete) {
    if (!state.daily || state.dailyReplay) return;
    getDailyStore().save(state.dailyDate, {
      lessonId: challenges[state.challengeIndex].id,
      answers: state.dailyAnswers.slice(), step: state.stepIndex, complete: !!complete
    });
  }

  function dailyStart() {
    const key = dailyLoop.dateKey(), id = dailyLoop.lessonFor(key);
    // A tab left open overnight must show the new title before starting it.
    if (state.dailyHomeDate !== key) { dailyHome(); return false; }
    const index = challenges.findIndex(item => item.id === id);
    if (index < 0) return false;
    const saved = getDailyStore().get(key);
    state.dailyDate = key;
    state.dailyReplay = root.GS_GOLD_DAILY_MAIN ? root.GameSharpMainDaily.completed(key) : !!(saved && saved.complete);
    start(index, false);
    if (saved && !saved.complete) {
      state.dailyAnswers = saved.answers.slice();
      state.stepIndex = saved.step;
      state.selectedIndex = saved.answers[saved.step] == null ? null : saved.answers[saved.step];
      state.score = saved.answers.reduce((score, selected, i) => score + Number(selected === challenges[index].steps[i].correct), 0);
      renderStep();
    }
    return true;
  }

  function dailyHome() {
    if (state.focusSubject) closeEvidenceFocus(false);
    state.motionRun += 1;
    stopNaturalAudio();
    state.challengeIndex = -1;
    const key = dailyLoop.dateKey(), id = dailyLoop.lessonFor(key);
    state.dailyHomeDate = key;
    const challenge = challenges.find(item => item.id === id);
    const tomorrow = challenges.find(item => item.id === dailyLoop.lessonFor(dailyLoop.nextDate(key)));
    const saved = getDailyStore().get(key), done = root.GS_GOLD_DAILY_MAIN ? root.GameSharpMainDaily.completed(key) : saved && saved.complete;
    const history = getDailyStore().completed();
    shell().innerHTML = header() + '<main class="gs-gold-daily-calendar">' +
      '<p class="gs-gold-daily-kicker">' + (root.GS_GOLD_DAILY_MAIN ? 'Today’s Challenge' : 'Daily pilot') + ' · ' + escapeHtml(key) + '</p>' +
      '<h1 class="gs-gold-daily-h1" data-gd-focus>' + escapeHtml(challenge.title) + '</h1>' +
      '<p class="gs-gold-daily-lede">' + escapeHtml(done ? challenge.memory : challenge.insight) + '</p>' +
      (done ? '<p>Today’s three decisions are complete. Your first answers are saved; replay is practice.</p><div class="gs-gold-daily-court-cue"><div class="gs-gold-daily-court-cue-label">Take it to court</div><div class="gs-gold-daily-court-cue-copy">' + escapeHtml(challenge.takeItToCourt) + '</div></div>' : '<p>One insight. Three connected decisions.</p>') +
      '<button class="gs-gold-daily-next" type="button" data-gd-action="daily-start">' + (done ? 'Replay today’s lesson' : saved && !saved.complete ? 'Resume today’s lesson →' : 'Start today’s lesson →') + '</button>' +
      '<button class="gs-gold-daily-secondary" type="button" data-gd-action="browse-lessons">Choose a lesson · browse all ' + challenges.filter(canReviewChallenge).length + ' →</button>' +
      (root.GS_GOLD_DAILY_MAIN && !done && root.isDailyDone() ? '<p class="gs-gold-daily-note">Your earlier Daily already earned today’s credit. This new lesson will not count the day twice.</p>' : '') +
      (done ? dailyPracticeHtml(challenge) : '') +
      '<section class="gs-gold-daily-tomorrow"><div class="gs-gold-daily-pro-eyebrow">Tomorrow · after local midnight</div><h2>' + escapeHtml(tomorrow.title) + '</h2><p>' + escapeHtml(tomorrow.insight) + '</p></section>' +
      '<details class="gs-gold-daily-note"><summary>Your lesson history · ' + history.length + ' completed day' + (history.length === 1 ? '' : 's') + '</summary>' +
      (history.length ? history.map(item => '<p>' + escapeHtml(item.date) + ' · ' + (root.GameSharpMainDaily && root.GameSharpMainDaily.completed(item.date) ? 'Daily' : 'Pilot') + ' · ' + escapeHtml(challenges.find(c => c.id === item.lessonId).title) + '</p>').join('') : '<p>No completed days yet.</p>') + '</details>' +
      '<p class="gs-gold-daily-note">' + escapeHtml(dailyLoop.calendarNote(key)) + ' ' + (root.GS_GOLD_DAILY_MAIN ? 'Earlier Daily history and streak are preserved. ' : 'This pilot does not change your main Daily streak or score. ') +
      (getDailyStore().persistent() && (!root.GameSharpMainDaily || root.GameSharpMainDaily.persistent()) ? 'Progress stays in this browser, not across devices.' : 'Saving is unavailable. Progress lasts only while this page stays open.') + '</p></main>';
    focusHeading();
  }

  function dailyPracticeHtml(challenge) {
    const link = dailyLoop.connection(challenge.id, root.GSPredictLive);
    const spine = lessonSpines.byId[challenge.lessonSpineId];
    const coach = root.GameSharpPainCoach;
    const region = coach && coach.playerRegions && coach.playerRegions[spine.sharpenTarget];
    return (link ? '<details class="gs-gold-daily-pro-insight"><summary>Optional · test the read in a point</summary><p>' + escapeHtml(link.bridge) + '</p><p>Predict → Live Point → the exact Playbook pattern.</p><button class="gs-gold-daily-secondary" type="button" data-gd-action="daily-practice" data-gd-id="' + escapeHtml(challenge.id) + '">Try the connected point →</button></details>' : '') +
      (region && typeof coach.openLessonFocus==='function' ? '<details class="gs-gold-daily-note"><summary>Keep this court cue</summary><p>Return to this lesson’s exact cue in Sharpen. This does not record on-court practice.</p><button class="gs-gold-daily-secondary" type="button" data-gd-action="daily-sharpen" data-gd-id="' + escapeHtml(challenge.id) + '">Keep this court cue →</button></details>' : '');
  }

  function dailyPractice(id) {
    if (state.practice) return false;
    const link = dailyLoop.connection(id, root.GSPredictLive);
    if (!link || typeof root.startLinkedSequence !== 'function') return false;
    close();
    state.dailyOrigin = 'practice';
    root.startLinkedSequence(link.sequenceId);
    return true;
  }

  function dailySharpen(id) {
    if (state.practice) return false;
    const challenge = challenges.find(item => item.id === id);
    const spine = challenge && lessonSpines.byId[challenge.lessonSpineId];
    const coach = root.GameSharpPainCoach;
    if (!spine || !coach || typeof coach.openLessonFocus!=='function' || !coach.playerRegions || !coach.playerRegions[spine.sharpenTarget]) return false;
    close();
    state.dailyOrigin = 'sharpen';
    coach.openLessonFocus(id, 'gold-daily');
    return true;
  }

  function openDaily() {
    if (state.practice) return false;
    if (root.GS_GOLD_DAILY_MAIN && (!root.GameSharpMainDaily || !root.GS_GOLD_DAILY_CSS_READY)) return false;
    installDailyReturns();
    state.dailyOrigin = null; return open({ daily: true });
  }

  let dailyReturnsInstalled = false;
  function installDailyReturns() {
    if (dailyReturnsInstalled) return;
    dailyReturnsInstalled = true;
    // Keep existing navigation untouched unless this pilot owns the origin.
    ['initHome', 'goHome'].forEach(name => {
      const original = root[name];
      if (typeof original !== 'function') return;
      root[name] = function () {
        if (state.practice) return close();
        if (state.dailyOrigin) return openDaily();
        return original.apply(this, arguments);
      };
    });
    function afterSharpenClose(event) {
      if (state.practice || state.dailyOrigin !== 'sharpen') return;
      // A persistent tab is an explicit top-level exit, not Sharpen's return
      // control. Release the detour in capture phase, before inline Home/Explore
      // handlers can encounter the inherited Daily navigation wrapper.
      if (event.type === 'click' && event.target.closest('#gsBottomNav .gs-bnav-item, .gs-sidebar .gs-nav-item')) {
        state.dailyOrigin = null;
        return;
      }
      if (event.type === 'click' && !event.target.closest('#gspcOverlay .gspc-close, #gspcOverlay .gspc-back')) return;
      if (event.type === 'keydown' && event.key !== 'Escape') return;
      // Native event dispatch can run a microtask checkpoint between capture
      // and the target's close handler. A new task observes the completed event.
      root.setTimeout(function () {
        if (!state.practice && state.dailyOrigin === 'sharpen' && !root.document.getElementById('gspcOverlay').classList.contains('open')) openDaily();
      }, 0);
    }
    root.document.addEventListener('click', afterSharpenClose, true);
    root.document.addEventListener('keydown', afterSharpenClose, true);
  }

  function audioEngine() {
    if (state.audio) return state.audio;
    try {
      if (root.GSLivePointEngine && typeof root.GSLivePointEngine.createAudioEngine === 'function') {
        state.audio = root.GSLivePointEngine.createAudioEngine({ storageKey: 'gs_sound_on' });
        if (state.audio && typeof state.audio.preload === 'function') state.audio.preload();
      }
    } catch (error) { state.audio = null; }
    return state.audio;
  }

  function unlockNaturalAudio() {
    const audio = audioEngine();
    if (audio && typeof audio.resume === 'function') audio.resume();
  }

  function stopNaturalAudio() {
    const audio = state.audio;
    if (audio && typeof audio.stop === 'function') audio.stop();
  }

  function contactTiming() {
    if (typeof GS_FASP_TIMING !== 'undefined' && GS_FASP_TIMING) {
      return {
        contactAt: GS_FASP_TIMING.contactMs / 1000,
        total: GS_FASP_TIMING.durationMs / 1000,
        compareAt: (GS_FASP_TIMING.durationMs + 70) / 1000
      };
    }
    return { contactAt: 1.05, total: 2.85, compareAt: 2.92 };
  }

  function scheduleNaturalEvidence(step, answered) {
    if (!step || prefersReducedMotion()) return false;
    const audio = audioEngine();
    const timeline = timelineFor(step, answered);
    if (!audio || !timeline || !audio.isEnabled() || !audio.isReady()) {
      if (audio && audio.isEnabled()) audio.resume();
      return false;
    }
    const events = [];
    if (extensionFor(step)) {
      events.push(...extensionFor(step).events(step,answered?state.selectedIndex:null));
    } else if (tradeoffs && tradeoffs.kinds.includes(step.visual.kind)) {
      events.push(...tradeoffs.events(step,answered?state.selectedIndex:null));
    } else if (['approach_to_volley','serve_adjustment'].includes(step.visual.kind)) {
      events.push(...construction.events(step,answered?state.selectedIndex:null));
    } else if (step.visual.kind === 'high_ball_contrast') {
      // The incoming contact is off-screen; no fictional racket impact at a sample.
      events.push({kind:'court',at:1.8,audio:'bounce',volume:.20});
      if(answered && !highBall.contact(highBall.scenes[step.visual.scene],step.visual.actions[state.selectedIndex])) events.push({kind:'court',at:highBall.end*1.8,audio:'bounce',volume:.20});
      if(answered && state.selectedIndex!==step.correct) events.push({kind:'court',at:6.2,audio:'bounce',volume:.20});
    } else if (step.visual.kind === 'court_read') {
      const v=step.visual;
      if (!answered) {
        events.push({kind:'contact',at:timeline.contactAt,audio:v.mode==='middle-return'?'serve':'ground',volume:.42});
        events.push({kind:'court',at:v.priorShot?timeline.contactAt+timeline.flight:timeline.bounceAt,audio:'bounce',volume:.20});
      } else {
        const sounds=step.shotAudio||['ground','ground','ground','ground'];
        events.push({kind:'contact',at:timeline.contactAt,audio:sounds[state.selectedIndex],volume:.42},{kind:'court',at:timeline.contactAt+timeline.flight,audio:'bounce',volume:.20});
        if(state.selectedIndex!==step.correct) events.push({kind:'contact',at:timeline.correctionAt+timeline.contactAt,audio:sounds[step.correct],volume:.42},{kind:'court',at:timeline.correctionAt+timeline.contactAt+timeline.flight,audio:'bounce',volume:.20});
      }
    } else if (step.visual.kind === 'recovery') {
      if (answered) events.push({ kind: 'movement', audio: 'shoe', at: timeline.movementAt, variant: state.stepIndex, volume: .16, pan: 0 });
      else {
        events.push({ kind: 'contact', audio: 'ground', at: timeline.contactAt, variant: state.stepIndex, volume: .48, pan: .16 });
        events.push({ kind: 'court', audio: 'bounce', at: timeline.bounceAt, variant: state.stepIndex, volume: .20, pan: -.18 });
        events.push({ kind: 'movement', audio: 'shoe', at: timeline.movementAt, variant: 0, volume: .12, pan: -.10 });
      }
    } else if (step.visual.kind === 'shortBall') {
      const selectedText = answered && step.options[state.selectedIndex] ? step.options[state.selectedIndex].text : step.situation;
      const strike = /slice|carve/i.test(selectedText) ? 'slice' : 'ground';
      events.push({ kind: 'contact', audio: strike, at: timeline.contactAt, variant: state.stepIndex, volume: .44, pan: answered ? -.08 : .12 });
      events.push({ kind: 'court', audio: 'bounce', at: timeline.bounceAt, variant: state.stepIndex, volume: .19, pan: answered ? -.12 : .08 });
      events.push({ kind: 'movement', audio: 'shoe', at: timeline.movementAt, variant: 0, volume: .11, pan: 0 });
    } else if (step.visual.kind === 'contact') {
      const timing = contactTiming();
      events.push({ kind: 'movement', audio: 'shoe', at: timeline.movementAt, variant: 0, volume: .10, pan: -.04 });
      events.push({ kind: 'contact', audio: 'ground', at: timing.contactAt, variant: state.stepIndex, volume: .48, pan: .10 });
    } else if (step.visual.kind === 'direction_change') {
      events.push({ kind: 'contact', audio: 'ground', at: timeline.contactAt, variant: state.stepIndex, volume: .46, pan: answered ? -.08 : .10 });
      events.push({ kind: 'court', audio: 'bounce', at: timeline.bounceAt, variant: state.stepIndex, volume: .18, pan: answered ? .08 : -.10 });
      if (!answered) events.push({ kind: 'movement', audio: 'shoe', at: timeline.movementAt, variant: 0, volume: .10, pan: 0 });
      if (answered && state.selectedIndex !== step.correct) {
        events.push({ kind: 'correction', audio: 'ground', at: timeline.correctionAt, variant: step.correct, volume: .42, pan: .08 });
        events.push({ kind: 'correction-court', audio: 'bounce', at: timeline.correctionAt + (timeline.bounceAt - timeline.contactAt), variant: step.correct, volume: .16, pan: -.06 });
      }
    } else if (step.visual.kind === 'serve_plus_one') {
      const choiceIsReturn = step.visual.choiceRole === 'return';
      events.push({ kind: 'serve-contact', audio: 'serve', at: timeline.serveAt, variant: state.stepIndex, volume: .52, pan: .14 });
      events.push({ kind: 'serve-bounce', audio: 'bounce', at: timeline.serveBounceAt, variant: state.stepIndex, volume: .18, pan: -.16 });
      events.push({ kind: 'return-contact', audio: 'ground', at: timeline.returnAt, variant: state.stepIndex, volume: .43, pan: -.18 });
      events.push({ kind: 'return-bounce', audio: 'bounce', at: timeline.returnBounceAt, variant: state.stepIndex, volume: .17, pan: .06 });
      if (!answered) events.push({ kind: 'server-recovery', audio: 'shoe', at: timeline.movementAt, variant: 0, volume: .09, pan: .10 });
      if (answered && !choiceIsReturn) {
        events.push({ kind: 'plus-one-contact', audio: 'ground', at: timeline.plusOneAt, variant: state.stepIndex, volume: .48, pan: .08 });
        events.push({ kind: 'plus-one-bounce', audio: 'bounce', at: timeline.plusOneBounceAt, variant: state.stepIndex, volume: .18, pan: -.06 });
      }
      if (answered && state.selectedIndex !== step.correct) {
        const correctionBounceAt = timeline.correctionAt + (choiceIsReturn ? timeline.returnFlight : timeline.plusOneFlight);
        events.push({ kind: 'correction-contact', audio: 'ground', at: timeline.correctionAt, variant: step.correct, volume: .42, pan: .06 });
        events.push({ kind: 'correction-bounce', audio: 'bounce', at: correctionBounceAt, variant: step.correct, volume: .16, pan: -.06 });
      }
    } else if (step.visual.kind === 'return_position') {
      events.push({ kind: 'serve-contact', audio: 'serve', at: timeline.serveAt, variant: state.stepIndex, volume: .52, pan: 0 });
      events.push({ kind: 'serve-bounce', audio: 'bounce', at: timeline.serveBounceAt, variant: state.stepIndex, volume: .18, pan: 0 });
      events.push({ kind: 'return-contact', audio: 'ground', at: timeline.contactAt, variant: state.stepIndex, volume: .43, pan: .02 });
      if (answered || step.visual.mode === 'compare') {
        events.push({ kind: 'reference-contact', audio: 'ground', at: returnArrival(step,timeline,true), variant: state.stepIndex, volume: .32, pan: .02 });
      } else events.push({ kind: 'return-bounce', audio: 'bounce', at: timeline.returnBounceAt, variant: state.stepIndex, volume: .16, pan: -.04 });
    } else if (step.visual.kind === 'split_step_timeline') {
      splitStepScenes(step, answered ? state.selectedIndex : null, timeline).forEach(function (scene) {
        events.push({ kind: scene.role + '-landing', audio: 'shoe', at: scene.landingAt, variant: state.stepIndex, volume: .16, pan: 0 });
        events.push({ kind: scene.role + '-opponent-contact', audio: 'ground', at: scene.contactAt, variant: state.stepIndex, volume: .46, pan: 0 });
        events.push({ kind: scene.role + '-court', audio: 'bounce', at: scene.bounceAt, variant: state.stepIndex, volume: .17, pan: step.visual.moveTarget[0] < 125 ? -.16 : .16 });
      });
    } else if (step.visual.kind === 'outcome_vs_decision') {
      if (!answered) events.push({ kind: 'incoming-contact', audio: 'ground', at: .10, variant: state.stepIndex, volume: .40, pan: .10 });
      if (step.visual.showOutcome || answered && step.visual.mode !== 'compare') {
        events.push({ kind: 'contact', audio: 'ground', at: timeline.contactAt, variant: state.stepIndex, volume: .47, pan: -.10 });
        events.push({ kind: 'court', audio: 'bounce', at: timeline.contactAt + timeline.flight, variant: state.stepIndex, volume: .18, pan: -.15 });
      }
      events.push({ kind: 'movement', audio: 'shoe', at: timeline.movementAt, variant: 0, volume: .09, pan: -.08 });
      if (answered && (step.visual.mode === 'result' || step.visual.mode === 'permission' && state.selectedIndex !== step.correct)) events.push({ kind: 'reference-contact', audio: 'ground', at: timeline.correctionAt, variant: step.correct, volume: .38, pan: .10 });
    } else if (step.visual.kind === 'two_point_sequence') {
      const strike = step.visual.mode === 'serve' ? 'serve' : 'ground';
      events.push({ kind: 'first-contact', audio: strike, at: timeline.firstAt, variant: state.stepIndex, volume: .46, pan: -.18 });
      if (step.visual.mode === 'rally') {
        events.push({ kind: 'second-contact', audio: strike, at: timeline.secondAt, variant: state.stepIndex + 1, volume: .44, pan: .18 });
        events.push({ kind: 'second-bounce', audio: 'bounce', at: timeline.secondBounceAt, variant: state.stepIndex, volume: .16, pan: .14 });
      }
      events.push({ kind: 'between-point-reset', audio: 'shoe', at: timeline.movementAt, variant: state.stepIndex, volume: .10, pan: 0 });
      if (step.visual.responsePath) events.push({ kind: 'opponent-response', audio: 'ground', at: timeline.responseAt, variant: 0, volume: .39, pan: .15 });
    }
    if (events.some(function (event) { return NATURAL_AUDIO_TYPES.indexOf(event.audio) === -1; })) return false;
    stopNaturalAudio();
    audio.schedule({ events: events, shots: [], start: 0, total: step.visual.kind === 'contact' ? contactTiming().total : timeline.total });
    return true;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function emit(name, data) {
    if (REQUIRED_EVENTS.indexOf(name) === -1) return;
    if (typeof root.trackEvent === 'function') {
      const challenge = data && challenges.find(function (item) { return item.id === data.challenge_id; });
      const spine = challenge && lessonSpines && lessonSpines.byId && lessonSpines.byId[challenge.lessonSpineId];
      root.trackEvent(name, Object.assign({
        prototype: !(root.GS_GOLD_DAILY_MAIN && state.daily),
        practice_source: state.practice ? 'sharpen' : '',
        prototype_version: VERSION,
        lesson_spine_id: spine && spine.id || '',
        editorial_theme: spine && spine.theme || '',
        sharpen_target: spine && spine.sharpenTarget || ''
      }, data || {}));
    }
  }

  function elapsedMs() {
    const now = root.performance && typeof root.performance.now === 'function' ? root.performance.now() : Date.now();
    return Math.max(0, Math.round(now - state.answerStartedAt));
  }

  function point(pointValue) {
    return { x: Number(pointValue[0]), y: Number(pointValue[1]) };
  }

  function polyline(points, attrs) {
    return '<polyline points="' + points.map(function (p) { return p[0] + ',' + p[1]; }).join(' ') + '" ' + (attrs || '') + ' />';
  }

  function seconds(value) {
    return Math.max(0, Number(value) || 0).toFixed(2) + 's';
  }

  function pathData(points) {
    return (points || []).map(function (p, index) { return (index ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join(' ');
  }

  // Catmull-Rom converted to cubic Béziers: the ball passes through every
  // authored point without arcade-like polyline corners. A spin-defined bounce
  // is split into separate paths below so smoothing can never erase its exit.
  function smoothPathData(points) {
    if (!Array.isArray(points) || points.length < 3) return pathData(points);
    let d = 'M' + points[0][0] + ' ' + points[0][1];
    for (let index = 0; index < points.length - 1; index += 1) {
      const p0 = point(points[index === 0 ? index : index - 1]);
      const p1 = point(points[index]);
      const p2 = point(points[index + 1]);
      const p3 = point(points[index + 2 < points.length ? index + 2 : index + 1]);
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += ' C' + c1x.toFixed(2) + ' ' + c1y.toFixed(2) + ' ' + c2x.toFixed(2) + ' ' + c2y.toFixed(2) + ' ' + p2.x + ' ' + p2.y;
    }
    return d;
  }

  function splitPathAtBounce(points, bounce) {
    if (!Array.isArray(points) || !Array.isArray(bounce)) return null;
    const index = points.findIndex(function (candidate) {
      return Array.isArray(candidate) && Math.abs(Number(candidate[0]) - Number(bounce[0])) <= 1 && Math.abs(Number(candidate[1]) - Number(bounce[1])) <= 1;
    });
    if (index <= 0 || index >= points.length - 1) return null;
    return { flight: points.slice(0, index + 1), exit: points.slice(index) };
  }

  function tracedPolyline(points, attrs, begin, duration, className) {
    if (prefersReducedMotion() || begin == null || duration == null) return polyline(points, attrs + ' class="' + (className || '') + '"');
    return '<polyline points="' + points.map(function (p) { return p[0] + ',' + p[1]; }).join(' ') + '" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" class="' + (className || '') + '" ' + attrs + '>' +
      '<animate attributeName="stroke-dashoffset" from="1" to="0" begin="' + seconds(begin) + '" dur="' + seconds(duration) + '" fill="freeze" /></polyline>';
  }

  function tracedPath(d, attrs, begin, duration, className) {
    if (prefersReducedMotion() || begin == null || duration == null) return '<path d="' + d + '" class="' + (className || '') + '" ' + attrs + ' />';
    return '<path d="' + d + '" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" class="' + (className || '') + '" ' + attrs + '>' +
      '<animate attributeName="stroke-dashoffset" from="1" to="0" begin="' + seconds(begin) + '" dur="' + seconds(duration) + '" fill="freeze" /></path>';
  }

  function movingToken(d, endPoint, color, begin, duration, radius, className) {
    if (prefersReducedMotion()) return '<circle cx="' + endPoint[0] + '" cy="' + endPoint[1] + '" r="' + (radius || 3.4) + '" fill="' + color + '" class="' + (className || '') + '" />';
    return '<circle cx="0" cy="0" r="' + (radius || 3.4) + '" fill="' + color + '" opacity="0" class="' + (className || '') + '">' +
      '<set attributeName="opacity" to="1" begin="' + seconds(begin) + '" fill="freeze" />' +
      '<animateMotion path="' + d + '" begin="' + seconds(begin) + '" dur="' + seconds(duration) + '" fill="freeze" /></circle>';
  }

  function movingTokenUntil(d, endPoint, color, begin, duration, hideAt, radius, className, showWhenReduced) {
    if (prefersReducedMotion()) return showWhenReduced === false ? '' : '<circle cx="' + endPoint[0] + '" cy="' + endPoint[1] + '" r="' + (radius || 3.4) + '" fill="' + color + '" class="' + (className || '') + '" />';
    return '<circle cx="0" cy="0" r="' + (radius || 3.4) + '" fill="' + color + '" opacity="0" class="' + (className || '') + '">' +
      '<set attributeName="opacity" to="1" begin="' + seconds(begin) + '" fill="freeze" />' +
      '<animateMotion path="' + d + '" begin="' + seconds(begin) + '" dur="' + seconds(duration) + '" fill="freeze" />' +
      '<set attributeName="opacity" to="0" begin="' + seconds(hideAt) + '" fill="freeze" /></circle>';
  }

  function bouncePulse(position, begin) {
    if (prefersReducedMotion()) return '';
    return '<circle cx="' + position[0] + '" cy="' + position[1] + '" r="3.8" fill="none" stroke="#e7cc72" stroke-width="1.4" opacity="0" class="gd-serve-bounce-beat">' +
      '<animate attributeName="r" from="3.8" to="8.2" begin="' + seconds(begin) + '" dur="0.34s" fill="freeze" />' +
      '<animate attributeName="opacity" values="0;1;0" keyTimes="0;0.18;1" begin="' + seconds(begin) + '" dur="0.34s" fill="freeze" /></circle>';
  }

  function courtBase() {
    return [
      '<rect width="250" height="170" rx="12" fill="#0d2e15"/>',
      '<rect x="25" y="14" width="200" height="142" fill="#164c22" stroke="rgba(240,244,228,.62)" stroke-width="1.6"/>',
      '<path d="M40 14V156M210 14V156M25 85H225M40 50H210M40 120H210M125 50V120" fill="none" stroke="rgba(238,243,224,.52)" stroke-width="1.2"/>',
      '<path d="M22 85H228" stroke="rgba(250,252,241,.92)" stroke-width="2.7"/>',
      '<circle cx="125" cy="85" r="2" fill="#f4f5e9" opacity=".9"/>',
      ''
    ].join('');
  }

  function marker(x, y, type, motion) {
    const fill = type === 'you' ? '#d4ad49' : '#e87171';
    const label = type === 'you' ? 'YOU' : 'OPP';
    const labelY = type === 'you' ? y + 13 : y - 9;
    const canMove = motion && !prefersReducedMotion();
    const dx = canMove ? Number(motion.from[0]) - x : 0;
    const dy = canMove ? Number(motion.from[1]) - y : 0;
    const transform = canMove ? ' transform="translate(' + dx + ' ' + dy + ')"' : '';
    const animation = canMove ? '<animateTransform attributeName="transform" type="translate" from="' + dx + ' ' + dy + '" to="0 0" begin="' + seconds(motion.begin) + '" dur="' + seconds(motion.duration) + '" fill="freeze" />' : '';
    return '<g class="gd-court-marker gd-court-marker-' + type + '"' + transform + '>' + animation +
      '<circle cx="' + x + '" cy="' + y + '" r="6.3" fill="' + fill + '" stroke="rgba(255,255,255,.64)" stroke-width="1.2"/>' +
      '<text x="' + x + '" y="' + labelY + '" text-anchor="middle" fill="rgba(255,255,255,.58)" font-size="5.5" font-weight="700">' + label + '</text></g>';
  }

  function recoveryVisual(step, selectedIndex, timeline) {
    const v = step.visual;
    const user = point(v.player), opp = point(v.opponent);
    const answered = selectedIndex != null;
    const shotD = pathData(v.shot);
    let svg = courtBase();
    svg += tracedPolyline(v.shot, 'fill="none" stroke="#d6b34f" stroke-width="2.4" stroke-dasharray="4 3" stroke-linecap="round" opacity=".85"', answered ? null : timeline.contactAt, answered ? null : timeline.flight, 'gd-setup-trace');
    if (!answered) svg += movingToken(shotD, v.shot[v.shot.length - 1], '#dce85e', timeline.contactAt, timeline.flight, 3.5, 'gd-flight-ball');
    if (Array.isArray(v.tendency)) {
      svg += tracedPolyline(v.tendency, 'fill="none" stroke="rgba(232,113,113,.82)" stroke-width="2" stroke-dasharray="3 3" stroke-linecap="round"', answered ? null : .66, answered ? null : .34, 'gd-tendency-trace');
      const tendencyEnd = point(v.tendency[v.tendency.length - 1]);
      svg += '<text x="' + Math.max(43, tendencyEnd.x + 4) + '" y="' + (tendencyEnd.y - 9) + '" text-anchor="start" fill="rgba(232,113,113,.88)" font-size="5.5" font-weight="800">' + escapeHtml(v.tendencyLabel) + '</text>';
    }
    svg += marker(user.x, user.y, 'you') + marker(opp.x, opp.y, 'opp', answered ? null : { from: [125, opp.y], begin: timeline.movementAt, duration: timeline.movement });
    v.targets.forEach(function (coords, index) {
      if (answered && index !== selectedIndex && index !== step.correct) return;
      const p = point(coords);
      const isSelected = selectedIndex === index;
      const isCorrect = answered && index === step.correct;
      const color = isCorrect ? '#59bd70' : (isSelected ? '#e07070' : 'rgba(255,255,255,.56)');
      const delay = answered ? 0 : timeline.questionAt + (index * .045);
      svg += '<g class="gd-choice-target" style="--gd-target-delay:' + seconds(delay) + '"><circle cx="' + p.x + '" cy="' + p.y + '" r="8" fill="rgba(4,15,7,.78)" stroke="' + color + '" stroke-width="' + (isSelected || isCorrect ? 2.2 : 1.1) + '"/>' +
        '<text x="' + p.x + '" y="' + (p.y + 2.3) + '" text-anchor="middle" fill="' + color + '" font-size="6.6" font-weight="800">' + String.fromCharCode(65 + index) + '</text></g>';
    });
    if (answered) {
      const selected = point(v.targets[selectedIndex]);
      const correct = point(v.targets[step.correct]);
      const selectedD = 'M' + user.x + ' ' + (user.y - 2) + ' Q' + ((user.x + selected.x) / 2) + ' ' + (selected.y - 12) + ' ' + selected.x + ' ' + selected.y;
      const correctD = 'M' + user.x + ' ' + (user.y - 2) + ' Q' + ((user.x + correct.x) / 2) + ' ' + (correct.y - 12) + ' ' + correct.x + ' ' + correct.y;
      const chosenCorrectly = selectedIndex === step.correct;
      if (!chosenCorrectly) {
        svg += tracedPath(selectedD, 'fill="none" stroke="#e07070" stroke-width="2.6" stroke-linecap="round" opacity=".88"', timeline.movementAt, timeline.movement, 'gd-selected-consequence');
        svg += movingToken(selectedD, [selected.x, selected.y], '#e07070', timeline.movementAt, timeline.movement, 4, 'gd-recovery-runner');
      }
      const correctAt = chosenCorrectly ? timeline.movementAt : timeline.correctionAt;
      svg += tracedPath(correctD, 'fill="none" stroke="#59bd70" stroke-width="3" stroke-linecap="round"', correctAt, timeline.movement, 'gd-correct-consequence');
      svg += movingToken(correctD, [correct.x, correct.y], '#59bd70', correctAt, timeline.movement, 4, 'gd-recovery-runner');
    }
    return '<svg viewBox="0 0 250 170" role="img" aria-label="' + escapeHtml(v.description) + '">' + svg + '</svg>';
  }

  function shortBallVisual(step, selectedIndex, timeline) {
    const v = step.visual;
    const user = point(v.player), ball = point(v.ball), opp = point(v.opponent);
    const answered = selectedIndex != null;
    const incomingD = pathData(v.incoming);
    let svg = courtBase();
    svg += tracedPolyline(v.incoming, 'fill="none" stroke="rgba(232,214,152,.48)" stroke-width="1.7" stroke-dasharray="3 3" stroke-linecap="round"', answered ? null : timeline.contactAt, answered ? null : timeline.flight, 'gd-setup-trace');
    if (!answered) svg += movingToken(incomingD, v.incoming[v.incoming.length - 1], '#dbe65f', timeline.contactAt, timeline.flight, 3.5, 'gd-flight-ball');
    svg += marker(user.x, user.y, 'you', answered ? null : { from: [125, 146], begin: timeline.movementAt, duration: timeline.movement }) + marker(opp.x, opp.y, 'opp');
    svg += '<circle cx="' + ball.x + '" cy="' + ball.y + '" r="3.2" fill="#dbe65f" stroke="#fff" stroke-width=".8" class="gd-contact-ball"/>';
    svg += '<circle cx="' + ball.x + '" cy="' + ball.y + '" r="10" fill="none" stroke="rgba(219,230,95,.58)" stroke-dasharray="3 2"/>';
    const ballLabelX = ball.x < 70 ? ball.x + 12 : ball.x;
    const ballLabelAnchor = ball.x < 70 ? 'start' : 'middle';
    const playerStateX = user.x < 50 ? 27 : user.x;
    const playerStateAnchor = user.x < 50 ? 'start' : 'middle';
    const opponentStateX = opp.x > 195 ? 222 : opp.x;
    const opponentStateAnchor = opp.x > 195 ? 'end' : 'middle';
    const cueClass = answered ? '' : ' class="gd-svg-cue"';
    svg += '<text x="' + ballLabelX + '" y="' + (ball.y - 8) + '" text-anchor="' + ballLabelAnchor + '" fill="rgba(219,230,95,.88)" font-size="5.2" font-weight="850"' + cueClass + ' style="--gd-cue-delay:' + seconds(timeline.cueAt[0]) + '">' + escapeHtml(v.ballLabel) + '</text>';
    svg += '<text x="' + playerStateX + '" y="' + Math.min(164, user.y + 22) + '" text-anchor="' + playerStateAnchor + '" fill="rgba(255,255,255,.54)" font-size="5" font-weight="800"' + cueClass + ' style="--gd-cue-delay:' + seconds(timeline.cueAt[1]) + '">' + escapeHtml(v.playerState) + '</text>';
    svg += '<text x="' + opponentStateX + '" y="' + (opp.y + 15) + '" text-anchor="' + opponentStateAnchor + '" fill="rgba(255,255,255,.48)" font-size="5" font-weight="800"' + cueClass + ' style="--gd-cue-delay:' + seconds(timeline.cueAt[2]) + '">' + escapeHtml(v.opponentState) + '</text>';
    if (answered) {
      const selectedPath = v.paths[selectedIndex];
      const correctPath = v.paths[step.correct];
      const selectedD = pathData(selectedPath);
      const correctD = pathData(correctPath);
      const chosenCorrectly = selectedIndex === step.correct;
      if (!chosenCorrectly) {
        svg += tracedPolyline(selectedPath, 'fill="none" stroke="#e07070" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity=".82"', timeline.contactAt, timeline.flight, 'gd-selected-consequence');
        svg += movingToken(selectedD, selectedPath[selectedPath.length - 1], '#e07070', timeline.contactAt, timeline.flight, 3.8, 'gd-flight-ball');
      }
      const correctAt = chosenCorrectly ? timeline.contactAt : timeline.correctionAt;
      svg += tracedPolyline(correctPath, 'fill="none" stroke="#59bd70" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"', correctAt, timeline.flight, 'gd-correct-consequence');
      svg += movingToken(correctD, correctPath[correctPath.length - 1], '#59bd70', correctAt, timeline.flight, 3.8, 'gd-flight-ball');
      const end = point(correctPath[correctPath.length - 1]);
      svg += '<circle cx="' + end.x + '" cy="' + end.y + '" r="5" fill="none" stroke="#59bd70" stroke-width="1.5" stroke-dasharray="2 2"/>';
    }
    return '<svg viewBox="0 0 250 170" role="img" aria-label="' + escapeHtml(v.description) + '">' + svg + '</svg>';
  }

  function courtReadVisual(step, selectedIndex, timeline) {
    const v = step.visual, answered = selectedIndex != null;
    const comparisonPanels = [];
    let svg = courtBase();
    const text = function (x, y, copy, color, size) { return '<text x="' + x + '" y="' + y + '" text-anchor="middle" fill="' + (color || '#e9e9d9') + '" font-size="' + (size || 5.4) + '" font-weight="750">' + escapeHtml(copy) + '</text>'; };
    const stroke = function (color) { return 'fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'; };
    const arrows = function (from, to) {
      if (Math.hypot(to[0]-from[0], to[1]-from[1]) < 2) return '';
      const direction = to[0] > from[0] ? 1 : -1;
      return polyline([from,to],stroke('rgba(255,255,255,.62)')) + polyline([[to[0]-direction*5,to[1]-3],to,[to[0]-direction*5,to[1]+3]],stroke('rgba(255,255,255,.62)'));
    };
    if (!answered) {
      const path = v.priorShot || v.incoming;
      if (v.priorShot) {
        svg += tracedPolyline(path,stroke('#dbe65f'),timeline.contactAt,timeline.flight,'gd-setup-trace');
        svg += movingToken(pathData(path),path[path.length-1],'#dbe65f',timeline.contactAt,timeline.flight,3.2,'gd-flight-ball');
        svg += bouncePulse(path[path.length-1],timeline.contactAt+timeline.flight);
      } else {
        // Split at the real bounce. The sound and pulse cannot drift to a
        // point the ball has not reached, or invent another racket contact.
        const split = splitPathAtBounce(path,v.bounce);
        const pre = timeline.bounceAt-timeline.contactAt, post = timeline.contactAt+timeline.flight-timeline.bounceAt;
        svg += tracedPolyline(split.flight,stroke('#dbe65f'),timeline.contactAt,pre,'gd-setup-trace');
        svg += tracedPolyline(split.exit,stroke('#dbe65f'),timeline.bounceAt,post,'gd-setup-trace');
        svg += movingTokenUntil(pathData(split.flight),v.bounce,'#dbe65f',timeline.contactAt,pre,timeline.bounceAt,3.2,'gd-flight-ball',false);
        svg += movingToken(pathData(split.exit),path[path.length-1],'#dbe65f',timeline.bounceAt,post,3.2,'gd-flight-ball');
        svg += bouncePulse(v.bounce,timeline.bounceAt);
      }
      svg += marker(v.player[0],v.player[1],'you',{from:v.playerStart,begin:timeline.movementAt,duration:timeline.movement});
      svg += marker(v.opponent[0],v.opponent[1],'opp',{from:v.opponentStart,begin:timeline.movementAt,duration:timeline.movement});
      // Ghost starting point + arrow preserve movement evidence in reduced motion.
      if (v.momentum) svg += '<g class="gd-svg-cue" style="--gd-cue-delay:1.40s">' + arrows(v.opponentStart,v.opponent) + arrows(v.opponent,v.momentum) + '</g>';
      (v.alternatives || []).forEach(function(p) { svg += '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6.3" fill="none" stroke="rgba(255,255,255,.5)" stroke-dasharray="2 2"/>'; });
      (v.windows || []).forEach(function(p) { svg += '<rect x="'+(p[0]-14)+'" y="'+(p[1]-7)+'" width="28" height="14" rx="3" fill="none" stroke="rgba(255,255,255,.6)"/>'; });
      svg += '<g class="gd-svg-cue" style="--gd-cue-delay:2.18s">'+text(125,180,v.ballLabel)+'</g>';
    } else {
      const correct = selectedIndex === step.correct;
      const scenes = correct ? [{index:selectedIndex,at:0}] : [{index:selectedIndex,at:0},{index:step.correct,at:timeline.correctionAt}];
      scenes.forEach(function(scene,i) {
        const c=v.choices[scene.index], good=scene.index===step.correct, color=good?'#59bd70':'#e07070';
        const start = scene.at + timeline.contactAt, finish = start + timeline.flight;
        const contact=v.incoming[v.incoming.length-1], path=[contact,c.target];
        const visible=prefersReducedMotion();
        // Reduced motion retains both compared scenes, but only one at a time
        // occupies the court in normal motion. No layered, competing rallies.
        const transform='';
        const panelStart = svg.length;
        svg += '<g class="gd-court-read-branch" data-choice="'+scene.index+'"'+transform+' opacity="'+(visible?'1':'0')+'">';
        if(!visible) {
          svg += '<set attributeName="opacity" to="1" begin="'+seconds(scene.at)+'" fill="freeze"/>';
          if(i===0&&!correct) svg += '<set attributeName="opacity" to="0" begin="'+seconds(timeline.correctionAt)+'" fill="freeze"/>';
        }
        if(visible&&!correct) svg += courtBase();
        svg += c.recoverTo ? marker(c.recoverTo[0],c.recoverTo[1],'you',{from:c.player,begin:start+.04,duration:.80}) : marker(c.player[0],c.player[1],'you',{from:v.player,begin:scene.at+.02,duration:.16});
        if(c.opponentVia&&!visible) {
          const first=[v.opponent[0]-c.receiver[0],v.opponent[1]-c.receiver[1]],via=[c.opponentVia[0]-c.receiver[0],c.opponentVia[1]-c.receiver[1]];
          svg += '<g class="gd-brake-turn" transform="translate('+first.join(' ')+')"><animateTransform attributeName="transform" type="translate" values="'+first.join(' ')+';'+via.join(' ')+';0 0" keyTimes="0;.45;1" begin="'+seconds(start)+'" dur="'+seconds(timeline.flight)+'" fill="freeze"/>'+marker(c.receiver[0],c.receiver[1],'opp')+'</g>';
        } else svg += marker(c.receiver[0],c.receiver[1],'opp',{from:v.opponent,begin:start,duration:timeline.flight});
        svg += tracedPolyline(path,stroke(color),start,timeline.flight,good?'gd-correct-consequence':'gd-selected-consequence');
        svg += movingToken(pathData(path),c.target,color,start,timeline.flight,3.4,'gd-flight-ball')+bouncePulse(c.target,finish);
        svg += '<g class="gd-svg-cue" style="--gd-cue-delay:'+seconds(finish)+'">';
        if(v.mode!=='future-space') c.replyEnds.forEach(function(end){svg+=polyline([c.receiver,end],'fill="none" stroke="rgba(255,255,255,.38)" stroke-width="1.1" stroke-dasharray="3 3"');});
        else svg += c.opponentVia ? arrows([c.opponentVia[0],c.opponentVia[1]+12],[c.receiver[0],c.receiver[1]+12])+text((c.opponentVia[0]+c.receiver[0])/2,c.receiver[1]+22,'TURN BACK','#dbe4d2',4.8) : arrows(v.opponent,c.receiver);
        svg += '</g>'+text(125,180,(good?'BETTER READ':'YOUR CHOICE')+' · '+String.fromCharCode(65+scene.index)+(v.mode!=='future-space'?' · POSSIBLE REPLIES DASHED':''),color,v.mode==='future-space'?5.4:4.8);
        svg += '</g>';
        if (visible && !correct) comparisonPanels.push('<div><p>'+(good?'Better read':'Your choice')+' '+String.fromCharCode(65+scene.index)+'</p><svg viewBox="0 0 250 188" role="img" aria-label="'+escapeHtml(v.description)+'">'+svg.slice(panelStart)+'</svg></div>');
      });
    }
    const compare = answered && selectedIndex!==step.correct && prefersReducedMotion();
    if (compare) return '<div class="gd-court-panels">'+comparisonPanels.join('')+'</div>';
    return '<svg viewBox="0 0 250 188" role="img" aria-label="'+escapeHtml(v.description)+'">'+svg+'</svg>';
  }

  function directionChangeVisual(step, selectedIndex, timeline) {
    const v = step.visual;
    const user = point(v.player), opp = point(v.opponent), ball = point(v.ball), exposure = point(v.exposure);
    const answered = selectedIndex != null;
    const incomingD = pathData(v.incoming);
    let svg = courtBase();
    svg += tracedPolyline(v.incoming, 'fill="none" stroke="rgba(232,214,152,.46)" stroke-width="1.8" stroke-dasharray="3 3" stroke-linecap="round" stroke-linejoin="round"', answered ? null : timeline.contactAt, answered ? null : timeline.flight, 'gd-setup-trace');
    if (!answered) svg += movingToken(incomingD, v.incoming[v.incoming.length - 1], '#dbe65f', timeline.contactAt, timeline.flight, 3.5, 'gd-flight-ball');
    svg += marker(user.x, user.y, 'you', answered ? null : { from: [125, 146], begin: timeline.movementAt, duration: timeline.movement });
    svg += marker(opp.x, opp.y, 'opp');
    svg += '<circle cx="' + ball.x + '" cy="' + ball.y + '" r="3.2" fill="#dbe65f" stroke="#fff" stroke-width=".8" class="gd-contact-ball"/>';
    svg += '<circle cx="' + ball.x + '" cy="' + ball.y + '" r="9" fill="none" stroke="rgba(219,230,95,.52)" stroke-dasharray="3 2"/>';
    const cueClass = answered ? '' : ' class="gd-svg-cue"';
    const labelAnchor = user.x < 90 ? 'start' : 'end';
    const labelX = user.x < 90 ? Math.max(42, user.x + 10) : Math.min(208, user.x - 10);
    svg += '<text x="' + labelX + '" y="' + (ball.y - 8) + '" text-anchor="' + labelAnchor + '" fill="rgba(219,230,95,.9)" font-size="5.2" font-weight="850"' + cueClass + ' style="--gd-cue-delay:' + seconds(timeline.cueAt[0]) + '">' + escapeHtml(v.ballLabel) + '</text>';
    svg += '<text x="' + labelX + '" y="' + Math.min(164, user.y + 19) + '" text-anchor="' + labelAnchor + '" fill="rgba(255,255,255,.56)" font-size="5" font-weight="800"' + cueClass + ' style="--gd-cue-delay:' + seconds(timeline.cueAt[1]) + '">' + escapeHtml(v.playerState) + '</text>';
    svg += tracedPath('M' + user.x + ' ' + user.y + ' Q125 164 ' + exposure.x + ' ' + exposure.y, 'fill="none" stroke="rgba(224,112,112,.36)" stroke-width="1.3" stroke-dasharray="2 3"', answered ? null : timeline.cueAt[2], answered ? null : .26, 'gd-exposure-trace');
    svg += '<text x="' + exposure.x + '" y="' + (exposure.y - 7) + '" text-anchor="middle" fill="rgba(232,164,120,.68)" font-size="4.8" font-weight="800"' + cueClass + ' style="--gd-cue-delay:' + seconds(timeline.cueAt[2]) + '">' + escapeHtml(v.exposureLabel) + '</text>';
    v.paths.forEach(function (path, index) {
      if (answered && index !== selectedIndex && index !== step.correct) return;
      const end = point(path[path.length - 1]);
      const isSelected = selectedIndex === index;
      const isCorrect = answered && index === step.correct;
      const color = isCorrect ? '#59bd70' : (isSelected ? '#e07070' : 'rgba(255,255,255,.58)');
      const delay = answered ? 0 : timeline.questionAt + (index * .045);
      svg += '<g class="gd-choice-target" style="--gd-target-delay:' + seconds(delay) + '"><circle cx="' + end.x + '" cy="' + end.y + '" r="7.2" fill="rgba(4,15,7,.8)" stroke="' + color + '" stroke-width="' + (isSelected || isCorrect ? 2 : 1.1) + '"/><text x="' + end.x + '" y="' + (end.y + 2.2) + '" text-anchor="middle" fill="' + color + '" font-size="6.2" font-weight="850">' + String.fromCharCode(65 + index) + '</text></g>';
    });
    if (answered) {
      const selectedPath = v.paths[selectedIndex];
      const correctPath = v.paths[step.correct];
      const selectedD = pathData(selectedPath), correctD = pathData(correctPath);
      const chosenCorrectly = selectedIndex === step.correct;
      if (!chosenCorrectly) {
        svg += tracedPolyline(selectedPath, 'fill="none" stroke="#e07070" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity=".84"', timeline.contactAt, timeline.flight, 'gd-selected-consequence');
        svg += movingToken(selectedD, selectedPath[selectedPath.length - 1], '#e07070', timeline.contactAt, timeline.flight, 3.7, 'gd-flight-ball');
      }
      const correctAt = chosenCorrectly ? timeline.contactAt : timeline.correctionAt;
      svg += tracedPolyline(correctPath, 'fill="none" stroke="#59bd70" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"', correctAt, timeline.flight, 'gd-correct-consequence');
      svg += movingToken(correctD, correctPath[correctPath.length - 1], '#59bd70', correctAt, timeline.flight, 3.8, 'gd-flight-ball');
    }
    return '<svg viewBox="0 0 250 170" role="img" aria-label="' + escapeHtml(v.description) + '">' + svg + '</svg>';
  }

  function servePlusOneVisual(step, selectedIndex, timeline) {
    const v = step.visual;
    const server = point(v.server), returner = point(v.returner), contact = point(v.contact);
    const serveBounce = point(v.serveBounce), returnBounce = point(v.returnBounce);
    const answered = selectedIndex != null;
    const choiceIsReturn = v.choiceRole === 'return';
    const serveSplit = splitPathAtBounce(v.serve, v.serveBounce);
    const serveFlightD = smoothPathData(serveSplit.flight), serveExitD = smoothPathData(serveSplit.exit);
    const serveFlightDuration = timeline.serveBounceAt - timeline.serveAt;
    const serveExitDuration = timeline.serveAt + timeline.serveFlight - timeline.serveBounceAt;
    let svg = '<defs>' +
      '<marker id="gd-serve-arrow" viewBox="0 0 6 6" refX="5.2" refY="3" markerWidth="4.4" markerHeight="4.4" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#d6b34f"/></marker>' +
      '<marker id="gd-return-arrow" viewBox="0 0 6 6" refX="5.2" refY="3" markerWidth="4.1" markerHeight="4.1" orient="auto"><path d="M0 0L6 3L0 6Z" fill="rgba(232,214,152,.82)"/></marker>' +
      '</defs>' + courtBase();
    (v.evidencePaths || []).forEach(function (path) {
      const evidenceAt = answered ? null : timeline.cueAt[2];
      svg += tracedPath(smoothPathData(path), 'fill="none" stroke="rgba(219,230,95,.22)" stroke-width="1.25" stroke-dasharray="2 3" stroke-linecap="round"', evidenceAt, answered ? null : .40, 'gd-pattern-trace');
    });
    svg += tracedPath(serveFlightD, 'fill="none" stroke="#d6b34f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" marker-mid="url(#gd-serve-arrow)"', timeline.serveAt, serveFlightDuration, 'gd-serve-flight');
    svg += movingTokenUntil(serveFlightD, v.serveBounce, '#dce85e', timeline.serveAt, serveFlightDuration, timeline.serveBounceAt, 3.5, 'gd-flight-ball', false);
    svg += tracedPath(serveExitD, 'fill="none" stroke="#e2c45f" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" marker-mid="url(#gd-serve-arrow)"', timeline.serveBounceAt, serveExitDuration, 'gd-serve-skid');
    svg += movingTokenUntil(serveExitD, v.returner, '#dce85e', timeline.serveBounceAt, serveExitDuration, timeline.returnAt, 3.5, 'gd-flight-ball', true);
    svg += '<circle cx="' + serveBounce.x + '" cy="' + serveBounce.y + '" r="4.8" fill="none" stroke="rgba(214,179,79,.65)" stroke-width="1.2" stroke-dasharray="2 2"/>';
    svg += bouncePulse(v.serveBounce, timeline.serveBounceAt);
    if (!choiceIsReturn || !answered) {
      const split=splitPathAtBounce(v.returnPath,v.returnBounce);
      const flightD=smoothPathData(split.flight),exitD=smoothPathData(split.exit);
      const before=timeline.returnBounceAt-timeline.returnAt,after=timeline.returnAt+timeline.returnFlight-timeline.returnBounceAt;
      svg += '<g data-return-event="flight" data-bounce-at="'+timeline.returnBounceAt+'">';
      svg += tracedPath(flightD, 'fill="none" stroke="rgba(232,214,152,.62)" stroke-width="2" stroke-linecap="round" marker-mid="url(#gd-return-arrow)"', timeline.returnAt, before, 'gd-return-trace');
      svg += movingTokenUntil(flightD,v.returnBounce,'#f0d789',timeline.returnAt,before,timeline.returnBounceAt,3.4,'gd-flight-ball',false);
      svg += tracedPath(exitD, 'fill="none" stroke="rgba(232,214,152,.62)" stroke-width="2" stroke-linecap="round"', timeline.returnBounceAt, after, 'gd-return-exit');
      svg += movingTokenUntil(exitD,v.returnPath[v.returnPath.length-1],'#f0d789',timeline.returnBounceAt,after,answered?timeline.plusOneAt:timeline.total,3.4,'gd-flight-ball',true);
      svg += bouncePulse(v.returnBounce,timeline.returnBounceAt)+'</g>';
    }
    svg += marker(contact.x, contact.y, 'you', { from: [server.x, server.y], begin: timeline.movementAt, duration: timeline.movement });
    svg += marker(returner.x, returner.y, 'opp', { from: [125, returner.y], begin: timeline.serveAt, duration: timeline.serveFlight });
    const cueClass = answered ? '' : ' class="gd-svg-cue"';
    svg += '<text x="' + Math.max(42, serveBounce.x + 10) + '" y="' + (serveBounce.y + 2) + '" text-anchor="start" fill="rgba(219,230,95,.86)" font-size="5" font-weight="850"' + cueClass + ' style="--gd-cue-delay:' + seconds(timeline.cueAt[0]) + '">' + escapeHtml(v.serveLabel) + '</text>';
    const returnLabel = answered && v.answeredReturnLabel ? v.answeredReturnLabel : v.returnLabel;
    svg += '<text x="' + returnBounce.x + '" y="' + (returnBounce.y - 7) + '" text-anchor="middle" fill="rgba(240,215,137,.82)" font-size="5" font-weight="850"' + cueClass + ' style="--gd-cue-delay:' + seconds(timeline.cueAt[2]) + '">' + escapeHtml(returnLabel) + '</text>';
    if (!v.hideTargetsBeforeAnswer || answered) {
      v.paths.forEach(function (path, index) {
        if (answered && index !== selectedIndex && index !== step.correct) return;
        const end = point(path[path.length - 1]);
        const isSelected = selectedIndex === index;
        const isCorrect = answered && index === step.correct;
        const color = isCorrect ? '#59bd70' : (isSelected ? '#e07070' : 'rgba(255,255,255,.58)');
        const delay = answered ? 0 : timeline.questionAt + (index * .045);
        svg += '<g class="gd-choice-target" style="--gd-target-delay:' + seconds(delay) + '"><circle cx="' + end.x + '" cy="' + end.y + '" r="7.2" fill="rgba(4,15,7,.8)" stroke="' + color + '" stroke-width="' + (isSelected || isCorrect ? 2 : 1.1) + '"/><text x="' + end.x + '" y="' + (end.y + 2.2) + '" text-anchor="middle" fill="' + color + '" font-size="6.2" font-weight="850">' + String.fromCharCode(65 + index) + '</text></g>';
      });
    }
    if (answered) {
      const selectedPath = v.paths[selectedIndex], correctPath = v.paths[step.correct];
      const selectedD = smoothPathData(selectedPath), correctD = smoothPathData(correctPath);
      const chosenCorrectly = selectedIndex === step.correct;
      const choiceAt = choiceIsReturn ? timeline.returnAt : timeline.plusOneAt;
      const choiceFlight = choiceIsReturn ? timeline.returnFlight : timeline.plusOneFlight;
      if (!chosenCorrectly) {
        svg += tracedPath(selectedD, 'fill="none" stroke="#e07070" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity=".84"', choiceAt, choiceFlight, 'gd-selected-consequence');
        svg += movingToken(selectedD, selectedPath[selectedPath.length - 1], '#e07070', choiceAt, choiceFlight, 3.7, 'gd-flight-ball');
        svg += bouncePulse(selectedPath[selectedPath.length-1],choiceAt+choiceFlight);
      }
      const correctAt = chosenCorrectly ? choiceAt : timeline.correctionAt;
      svg += tracedPath(correctD, 'fill="none" stroke="#59bd70" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"', correctAt, choiceFlight, 'gd-correct-consequence');
      svg += movingToken(correctD, correctPath[correctPath.length - 1], '#59bd70', correctAt, choiceFlight, 3.8, 'gd-flight-ball');
      svg += bouncePulse(correctPath[correctPath.length-1],correctAt+choiceFlight);
    }
    return '<svg viewBox="0 0 250 170" role="img" aria-label="' + escapeHtml(v.description) + '">' + svg + '</svg>';
  }

  // One illustrative post-bounce speed drives all return-position scenes. This is a
  // time/territory comparison, not a body-spacing or return-quality simulation.
  function returnArrival(step, timeline, reference) {
    const v = step.visual, p = reference ? v.referenceContact : v.contact;
    const distance = Math.hypot(p[0]-v.serveBounce[0],p[1]-v.serveBounce[1]);
    const speed = (34/.72)*(v.servePaceRatio || 1);
    return timeline.serveBounceAt + distance/speed;
  }

  // Consumers inspect the same event model used to draw and sound this scene.
  // This deliberately exposes no inferred body spacing, height or return quality.
  function returnEvidence(step) {
    const v=step&&step.visual, point=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite);
    if(!v||v.kind!=='return_position'||![v.serveBounce,v.contact,v.referenceContact].every(point)||
       (v.servePaceRatio!==undefined&&(!Number.isFinite(v.servePaceRatio)||v.servePaceRatio<=0)))return null;
    const t=timelineFor(step,false), distance=p=>Math.hypot(p[0]-v.serveBounce[0],p[1]-v.serveBounce[1]);
    const contactAt=t.contactAt,referenceAt=returnArrival(step,t,true);
    const speed=distance(v.contact)/(contactAt-t.serveBounceAt),referenceSpeed=distance(v.referenceContact)/(referenceAt-t.serveBounceAt);
    if(![contactAt,referenceAt,speed,referenceSpeed].every(Number.isFinite)||speed<=0||referenceSpeed<=0)return null;
    return Object.freeze({contactAt,referenceAt,speed,referenceSpeed,capabilities:Object.freeze(['court-position','arrival-time'])});
  }

  function returnPositionVisual(step, selectedIndex, timeline) {
    const v = step.visual, answered = selectedIndex != null;
    const compare = v.mode === 'compare' || answered;
    const split = splitPathAtBounce(v.serve, v.serveBounce);
    const flight = pathData(split.flight), flightDuration = timeline.serveBounceAt-timeline.serveAt;
    let svg = courtBase() + marker(v.server[0],v.server[1],'opp');
    svg += tracedPath(flight,'fill="none" stroke="#d6b34f" stroke-width="2.5"',timeline.serveAt,flightDuration,'gd-serve-flight');
    svg += movingTokenUntil(flight,v.serveBounce,'#dce85e',timeline.serveAt,flightDuration,timeline.serveBounceAt,3.5,'gd-flight-ball',false);
    svg += bouncePulse(v.serveBounce,timeline.serveBounceAt);
    const positions = compare ? [false,true] : [false];
    positions.forEach(function(reference) {
      const p = reference ? v.referenceContact : v.contact;
      const start = reference ? v.referenceStart : v.start;
      const at = returnArrival(step,timeline,reference);
      const d = pathData([v.serveBounce,p]);
      const color = reference ? '#8cd4ab' : '#d6b34f';
      const role = reference ? 'reference' : 'observed';
      svg += '<g data-return-role="'+role+'" data-arrival="'+at+'">';
      svg += marker(start[0],start[1],'you');
      svg += tracedPath(d,'fill="none" stroke="'+color+'" stroke-width="'+(reference?1.5:2.5)+'"'+(reference?' stroke-dasharray="3 3"':''),timeline.serveBounceAt,at-timeline.serveBounceAt,'gd-'+role+'-serve');
      svg += movingTokenUntil(d,p,color,timeline.serveBounceAt,at-timeline.serveBounceAt,at,3.5,'gd-'+role+'-arrival-ball',true);
      svg += '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="7" fill="none" stroke="'+color+'" class="gd-svg-cue" style="--gd-cue-delay:'+seconds(at)+'"/>';
      const label = compare ? (reference ? 'TEST POSITION' : 'CURRENT POSITION') : v.playerState;
      svg += '<text x="'+(reference?205:45)+'" y="'+(reference?178:178)+'" text-anchor="'+(reference?'end':'start')+'" fill="'+color+'" font-size="7" font-weight="750">'+escapeHtml(label)+'</text></g>';
    });
    if (!compare) {
      svg += tracedPath(smoothPathData(v.returnPath),'fill="none" stroke="rgba(232,214,152,.62)" stroke-width="2"',timeline.contactAt,timeline.returnFlight,'gd-return-trace');
    } else {
      svg += '<text x="125" y="72" text-anchor="middle" fill="#e9e9d9" font-size="7" class="gd-svg-cue" style="--gd-cue-delay:'+seconds(Math.max(returnArrival(step,timeline,true),timeline.contactAt))+'">SAME SERVE · DIFFERENT ARRIVAL</text>';
      if (answered && selectedIndex !== step.correct && v.choiceStarts) {
        const chosen=v.choiceStarts[selectedIndex];
        svg += '<circle cx="'+chosen[0]+'" cy="'+chosen[1]+'" r="9" fill="none" stroke="#e07070" stroke-dasharray="3 2"/>';
        svg += '<text x="125" y="10" text-anchor="middle" fill="#e9b7a8" font-size="7">YOUR PLAN '+String.fromCharCode(65+selectedIndex)+' · POSITION ONLY</text>';
      }
    }
    return '<svg viewBox="0 0 250 188" role="img" aria-label="'+escapeHtml(v.description)+'">'+svg+'</svg>';
  }
  // Every split-step mark, racket swing, ball and shoe contact is derived here.
  // The faster opponent changes the strike clock; the unchanged learner rhythm
  // is preserved by the matching landing offset in the transfer's authored data.
  function splitStepScenes(step, selectedIndex, timeline) {
    const v = step.visual;
    const answered = selectedIndex != null;
    const correct = selectedIndex === step.correct;
    const observed = { landingOffset: v.landingOffset, firstStepDelay: v.firstStepDelay, hopDuration: v.hopDuration };
    const reference = { landingOffset: v.referenceOffset, firstStepDelay: v.referenceFirstStepDelay, hopDuration: v.hopDuration };
    function scene(role, startAt, timing) {
      timing = timing || {};
      const contactAt = startAt + timeline.contactAt + v.opponentContactOffset;
      const landingAt = contactAt + timing.landingOffset;
      const moveAt = contactAt + timing.firstStepDelay;
      const duration = timing.movementDuration || timeline.movement;
      return { role: role, startAt: startAt, loadAt: startAt + timeline.loadAt,
        contactAt: contactAt, bounceAt: startAt + timeline.bounceAt + v.opponentContactOffset,
        landingAt: landingAt, takeoffAt: landingAt - timing.hopDuration,
        hopDuration: timing.hopDuration, moveAt: moveAt, movement: duration,
        flight: timeline.flight, landingOffset: timing.landingOffset,
        endAt: Math.max(contactAt + timeline.flight, moveAt + duration) };
    }
    if (!answered) return [scene('observed', 0, observed)];
    if (correct) return [scene('reference', 0, reference)];
    const selected = v.choiceTimings ? v.choiceTimings[selectedIndex] : observed;
    return [scene('choice', 0, selected), scene('reference', timeline.correctionAt, reference)];
  }

  function splitStepVisual(step, selectedIndex, timeline) {
    const v = step.visual;
    const answered = selectedIndex != null;
    const reduced = prefersReducedMotion();
    const player = point(v.player), opponent = point(v.opponent), target = point(v.moveTarget);
    const scenes = splitStepScenes(step, selectedIndex, timeline);
    const ball = splitPathAtBounce(v.ballPath, v.ballBounce);
    const flightD = smoothPathData(ball.flight), exitD = smoothPathData(ball.exit);
    let svg = courtBase();
    scenes.forEach(function (scene, sceneIndex) {
      if (reduced && sceneIndex < scenes.length - 1) return;
      const color = !answered ? '#d6b34f' : scene.role === 'reference' ? '#74d189' : '#d7aa80';
      const beginsLater = scene.startAt > 0 && !reduced;
      svg += '<g data-gd-split-pass="' + scene.role + '" data-gd-load-at="' + scene.loadAt + '" data-gd-contact-at="' + scene.contactAt + '" data-gd-landing-at="' + scene.landingAt + '" data-gd-first-step-at="' + scene.moveAt + '" data-gd-takeoff-at="' + scene.takeoffAt + '" opacity="' + (beginsLater ? 0 : 1) + '">';
      if (beginsLater) svg += '<set attributeName="opacity" to="1" begin="' + seconds(scene.startAt) + '" fill="freeze"/>';
      if (!reduced && sceneIndex < scenes.length - 1) svg += '<set attributeName="opacity" to="0" begin="' + seconds(scenes[sceneIndex + 1].startAt) + '" fill="freeze"/>';
      svg += marker(opponent.x, opponent.y, 'opp');
      svg += '<g class="gd-split-racket" transform="rotate(' + (reduced ? 0 : -64) + ' ' + opponent.x + ' ' + opponent.y + ')">';
      if (!reduced) svg += '<animateTransform attributeName="transform" type="rotate" from="-64 ' + opponent.x + ' ' + opponent.y + '" to="0 ' + opponent.x + ' ' + opponent.y + '" begin="' + seconds(scene.loadAt) + '" dur="' + seconds(scene.contactAt - scene.loadAt) + '" fill="freeze"/>';
      svg += '<line x1="' + opponent.x + '" y1="' + opponent.y + '" x2="' + v.ballPath[0][0] + '" y2="' + v.ballPath[0][1] + '" stroke="#eee6c9" stroke-width="1.8"/><ellipse cx="' + v.ballPath[0][0] + '" cy="' + v.ballPath[0][1] + '" rx="2.8" ry="4.2" fill="none" stroke="#eee6c9" stroke-width="1.1"/></g>';
      const beforeBounce = scene.bounceAt - scene.contactAt;
      const afterBounce = scene.flight - beforeBounce;
      svg += tracedPath(flightD, 'fill="none" stroke="rgba(232,214,152,.74)" stroke-width="2.2" stroke-linecap="round"', scene.contactAt, beforeBounce, 'gd-setup-trace');
      svg += tracedPath(exitD, 'fill="none" stroke="rgba(232,214,152,.74)" stroke-width="2.2" stroke-linecap="round"', scene.bounceAt, afterBounce, 'gd-setup-trace');
      svg += movingTokenUntil(flightD, v.ballBounce, '#dce85e', scene.contactAt, beforeBounce, scene.bounceAt, 3.5, 'gd-flight-ball', false);
      svg += movingToken(exitD, v.ballPath[v.ballPath.length - 1], '#dce85e', scene.bounceAt, afterBounce, 3.5, 'gd-flight-ball');
      svg += bouncePulse(v.ballBounce, scene.bounceAt);
      const dx = target.x - player.x, dy = target.y - player.y;
      svg += '<g class="gd-split-first-step" transform="translate(' + (reduced ? dx : 0) + ' ' + (reduced ? dy : 0) + ')">';
      if (!reduced) svg += '<animateTransform attributeName="transform" type="translate" from="0 0" to="' + dx + ' ' + dy + '" begin="' + seconds(scene.moveAt) + '" dur="' + seconds(scene.movement) + '" fill="freeze"/>';
      svg += '<g class="gd-split-hop">';
      if (!reduced) svg += '<animateTransform attributeName="transform" type="translate" values="0 0;0 -7;0 0" keyTimes="0;.5;1" begin="' + seconds(scene.takeoffAt) + '" dur="' + seconds(scene.hopDuration) + '" fill="freeze"/>';
      svg += marker(player.x, player.y, 'you');
      svg += '<ellipse cx="' + (player.x - 4) + '" cy="' + (player.y + 6) + '" rx="2.1" ry="1.3" fill="#f2e5be"/><ellipse cx="' + (player.x + 4) + '" cy="' + (player.y + 6) + '" rx="2.1" ry="1.3" fill="#f2e5be"/></g></g>';
      const moveD = 'M' + player.x + ' ' + player.y + ' L' + target.x + ' ' + target.y;
      svg += tracedPath(moveD, 'fill="none" stroke="' + color + '" stroke-width="1.7" stroke-dasharray="3 3" stroke-linecap="round" opacity=".66"', scene.moveAt, scene.movement, 'gd-split-move');
      const landingX = Math.max(48, Math.min(202, 125 + scene.landingOffset * 110));
      svg += '<g class="gd-timing-strip' + (!answered ? ' gd-svg-cue' : '') + '" style="--gd-cue-delay:' + seconds(timeline.cueAt[1]) + '"><line x1="44" y1="176" x2="206" y2="176" stroke="rgba(255,255,255,.22)"/><line x1="125" y1="171" x2="125" y2="181" stroke="rgba(255,255,255,.7)" stroke-width="1.8"/><text x="125" y="168" text-anchor="middle" fill="rgba(255,255,255,.75)" font-size="5.2" font-weight="850">HIT</text><line x1="' + landingX + '" y1="172" x2="' + landingX + '" y2="180" stroke="' + color + '" stroke-width="2.2"/><text x="' + landingX + '" y="185" text-anchor="middle" fill="' + color + '" font-size="5.2" font-weight="850">LAND</text></g>';
      if (answered) svg += '<text x="125" y="9" text-anchor="middle" fill="' + color + '" font-size="5" font-weight="800">' + (scene.role === 'reference' ? 'SAME SHOT · READY TO MOVE' : v.choiceTimings ? 'YOUR ADJUSTMENT' : 'REPLAY THE EVIDENCE') + '</text>';
      svg += '</g>';
    });
    return '<svg viewBox="0 0 250 188" role="img" aria-label="' + escapeHtml(v.description) + '">' + svg + '</svg>';
  }

  function outcomeDecisionVisual(step, selectedIndex, timeline) {
    const v = step.visual;
    const answered = selectedIndex != null;
    const player = point(v.player), opponent = point(v.opponent), contact = point(v.contact);
    const incomingD = smoothPathData(v.incoming);
    const riskyD = smoothPathData(v.riskyPath), repeatableD = smoothPathData(v.repeatablePath);
    const risky = v.riskyTarget, repeatable = v.repeatableTarget;
    const neutral = '#d6b34f';
    const riskColor = answered ? '#e87171' : neutral;
    const referenceColor = answered ? '#59bd70' : '#b8c7dd';
    let svg = '<defs><marker id="gd-decision-arrow" viewBox="0 0 6 6" refX="5.2" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L6 3L0 6Z" fill="rgba(232,214,152,.78)"/></marker></defs>' + courtBase();
    svg += marker(player.x, player.y, 'you') + marker(opponent.x, opponent.y, 'opp');
    svg += tracedPath(incomingD, 'fill="none" stroke="rgba(232,214,152,.48)" stroke-width="1.8" stroke-dasharray="3 3" stroke-linecap="round"', answered ? null : .10, answered ? null : timeline.contactAt-.10, 'gd-setup-trace');
    if (!answered) svg += v.mode === 'result'
      ? movingTokenUntil(incomingD, v.incoming[v.incoming.length - 1], '#dce85e', .10, timeline.contactAt-.10, timeline.contactAt, 3.5, 'gd-incoming-ball', false)
      : movingToken(incomingD, v.incoming[v.incoming.length - 1], '#dce85e', .10, timeline.contactAt-.10, 3.5, 'gd-flight-ball');
    svg += '<circle cx="' + contact.x + '" cy="' + contact.y + '" r="8" fill="none" stroke="rgba(219,230,95,.58)" stroke-dasharray="3 2"/>';
    svg += '<text x="' + Math.min(205, contact.x + 12) + '" y="' + (contact.y - 8) + '" fill="rgba(219,230,95,.86)" font-size="5" font-weight="850" class="gd-svg-cue" style="--gd-cue-delay:' + seconds(timeline.cueAt[0]) + '">' + escapeHtml(v.ballClass) + '</text>';
    if (v.mode !== 'permission' || answered) svg += '<rect x="' + (risky[0] - risky[2] / 2) + '" y="' + (risky[1] - risky[3] / 2) + '" width="' + risky[2] + '" height="' + risky[3] + '" rx="3" fill="none" stroke="' + riskColor + '" stroke-dasharray="2 2"/>';
    if ((v.mode !== 'result' && v.mode !== 'permission') || answered) svg += '<rect x="' + (repeatable[0] - repeatable[2] / 2) + '" y="' + (repeatable[1] - repeatable[3] / 2) + '" width="' + repeatable[2] + '" height="' + repeatable[3] + '" rx="5" fill="none" stroke="' + referenceColor + '" stroke-dasharray="3 2"/>';
    if (v.mode === 'result' || (v.mode === 'permission' && answered)) {
      const points = v.mode === 'permission' ? v.choicePaths[selectedIndex] : v.riskyPath;
      const path = smoothPathData(points);
      const color = v.mode === 'permission' ? (selectedIndex === step.correct ? referenceColor : riskColor) : neutral;
      svg += tracedPath(path, 'fill="none" stroke="' + color + '" stroke-width="2.8" stroke-linecap="round" marker-mid="url(#gd-decision-arrow)"', timeline.contactAt, timeline.flight, 'gd-decision-shot');
      svg += movingToken(path, points[points.length - 1], color, timeline.contactAt, timeline.flight, 3.7, 'gd-flight-ball');
    } else if (v.mode === 'compare') {
      svg += tracedPath(riskyD, 'fill="none" stroke="' + riskColor + '" stroke-width="2" stroke-dasharray="3 3" stroke-linecap="round"', timeline.cueAt[1], .46, 'gd-risky-trace');
      svg += tracedPath(repeatableD, 'fill="none" stroke="' + referenceColor + '" stroke-width="2" stroke-dasharray="3 3" stroke-linecap="round"', timeline.cueAt[2], .50, 'gd-repeatable-trace');
    }
    if (answered && v.mode === 'result') svg += tracedPath(repeatableD, 'fill="none" stroke="#59bd70" stroke-width="2.7" stroke-linecap="round"', timeline.correctionAt, .58, 'gd-correct-consequence');
    if (answered && v.mode === 'permission' && selectedIndex !== step.correct) {
      svg += tracedPath(repeatableD, 'fill="none" stroke="#59bd70" stroke-width="2.7" stroke-linecap="round"', timeline.correctionAt, .58, 'gd-correct-consequence');
      svg += movingToken(repeatableD, v.repeatablePath[v.repeatablePath.length-1], '#59bd70', timeline.correctionAt, .58, 3.7, 'gd-reference-ball');
    }
    if (v.showOutcome && !answered) svg += '<text x="' + risky[0] + '" y="' + (risky[1] + 13) + '" text-anchor="middle" fill="#d6b34f" font-size="6" font-weight="900" class="gd-svg-cue" style="--gd-cue-delay:' + seconds(timeline.outcomeAt) + '">' + escapeHtml(v.outcome) + '</text>';
    return '<svg viewBox="0 0 250 170" role="img" aria-label="' + escapeHtml(v.description) + '">' + svg + '</svg>';
  }

  function miniCourtBase(label) {
    return '<rect width="120" height="160" rx="9" fill="#0d2e15"/><rect x="12" y="8" width="96" height="144" fill="#164c22" stroke="rgba(240,244,228,.54)" stroke-width="1.3"/><path d="M19 8V152M101 8V152M12 80H108M19 43H101M19 117H101M60 43V117" fill="none" stroke="rgba(238,243,224,.42)" stroke-width="1"/><path d="M10 80H110" stroke="rgba(250,252,241,.8)" stroke-width="2"/><text x="60" y="14" text-anchor="middle" fill="rgba(255,255,255,.42)" font-size="5" font-weight="850">' + escapeHtml(label) + '</text>';
  }

  function twoPointPanels(svg, description) {
    const divider = '<g transform="translate(131 4) scale(.93 1)">';
    const at = svg.indexOf(divider);
    const panels = [svg.slice(0,at),svg.slice(at).replace(divider,'<g transform="translate(7 4) scale(.93 1)">')];
    return '<div class="gd-mental-panels">' + panels.map(function(panel) {
      return '<svg viewBox="0 0 125 170" role="img" aria-label="'+escapeHtml(description)+'">'+panel+'</svg>';
    }).join('') + '</div>';
  }

  function twoPointVisual(step, selectedIndex, timeline) {
    const v = step.visual;
    const answered = selectedIndex != null;
    const firstD = smoothPathData(v.firstPath);
    let svg = '<g transform="translate(7 4) scale(.93 1)">' + miniCourtBase('POINT 1');
    const firstPlayer=v.mode==='serve'?v.firstServer:[45,145];
    svg += marker(firstPlayer[0],firstPlayer[1],'you');
    svg += tracedPath(firstD, 'fill="none" stroke="#e87171" stroke-width="2.6" stroke-linecap="round"', timeline.firstAt, timeline.firstFlight, 'gd-first-point');
    svg += movingToken(firstD, v.firstLanding, '#dce85e', timeline.firstAt, timeline.firstFlight, 3.3, 'gd-flight-ball');
    svg += '<text x="60" y="74" text-anchor="middle" fill="rgba(232,113,113,.88)" font-size="6" font-weight="900" class="gd-svg-cue" style="--gd-cue-delay:' + seconds(timeline.cueAt[0]) + '">' + escapeHtml(v.firstOutcome) + '</text></g>';
    svg += '<g transform="translate(131 4) scale(.93 1)">' + miniCourtBase('POINT 2');
    if (v.mode === 'serve' || v.mode === 'reset') {
      const p = point(v.player);
      svg += marker(p.x, p.y, 'you');
      if (v.mode === 'serve') {
        svg += '<text x="60" y="29" text-anchor="middle" fill="#dfd7b7" font-size="5.5">USUAL: ' + escapeHtml(v.routineBefore.join(' · ')) + '</text>';
        const routine = answered ? v.resetRoutine : v.routineObserved;
        routine.forEach(function (label, i) {
          svg += '<text x="60" y="' + (96+i*11) + '" text-anchor="middle" fill="' + (answered ? '#74d189' : '#d6b34f') + '" font-size="7" font-weight="850" class="gd-svg-cue" style="--gd-cue-delay:' + seconds(answered ? timeline.correctionAt + i*.25 : timeline.cueAt[1] + i*.25) + '">' + escapeHtml(label) + '</text>';
        });
        if (!answered) svg += '<text x="60" y="113" text-anchor="middle" fill="#dfd7b7" font-size="5.5" class="gd-svg-cue" style="--gd-cue-delay:' + seconds(timeline.cueAt[2]) + '">NEXT POINT</text>';
      } else {
        svg += '<text x="60" y="64" text-anchor="middle" fill="#dfd7b7" font-size="6">NEUTRAL BALL NEXT</text>';
        const incoming = smoothPathData(v.incomingPlan);
        svg += tracedPath(incoming,'fill="none" stroke="#d6b34f" stroke-width="1.5" stroke-dasharray="3 3"',timeline.secondAt,.70,'gd-next-neutral');
        svg += movingToken(incoming,v.incomingPlan[v.incomingPlan.length-1],'#dce85e',timeline.secondAt,.70,3,'gd-next-neutral-ball');
      }
      const target = v.mode === 'serve' ? v.resetTarget : (answered ? v.choiceTargets[selectedIndex] : null);
      if (answered && (target || v.mode === 'reset')) {
        svg += '<g class="gd-svg-cue" style="--gd-cue-delay:' + seconds(timeline.correctionAt) + '">';
        if (target) svg += '<rect x="' + (target[0]-target[2]/2) + '" y="' + (target[1]-target[3]/2) + '" width="' + target[2] + '" height="' + target[3] + '" rx="3" fill="rgba(214,179,79,.12)" stroke="#d6b34f" stroke-dasharray="3 2"/>';
        if (v.mode === 'reset') {
          if (target) svg += '<path d="M38 135L' + target[0] + ' ' + target[1] + '" stroke="#d6b34f" stroke-width="2" stroke-dasharray="4 3"/>';
          svg += '<text x="60" y="92" text-anchor="middle" fill="#dfd7b7" font-size="5">' + escapeHtml(v.choiceLabels[selectedIndex]) + '</text>';
        }
        svg += '</g>';
        if (v.mode === 'reset' && selectedIndex !== step.correct) {
          const reference = v.choiceTargets[step.correct];
          svg += '<g class="gd-svg-cue" style="--gd-cue-delay:' + seconds(timeline.correctionAt+.65) + '"><rect x="' + (reference[0]-reference[2]/2) + '" y="' + (reference[1]-reference[3]/2) + '" width="' + reference[2] + '" height="' + reference[3] + '" rx="3" fill="rgba(89,189,112,.10)" stroke="#74d189" stroke-dasharray="3 2"/><text x="60" y="104" text-anchor="middle" fill="#74d189" font-size="5">REFERENCE: DEEP CROSSCOURT</text></g>';
        }
        svg += '<text x="60" y="133" text-anchor="middle" fill="#dfd7b7" font-size="5.2" class="gd-svg-cue" style="--gd-cue-delay:' + seconds(timeline.correctionAt+.7) + '">' + escapeHtml(v.resetOutcome || v.secondOutcome) + '</text>';
      }
      svg += '</g>';
      return twoPointPanels(svg, v.description);
    }
    const secondD = smoothPathData(v.secondPath);
    svg += marker(45,145,'you') + marker(64,52,'opp',{from:[64,22],begin:timeline.secondAt,duration:.70});
    if (v.targetWindow) { const t = v.targetWindow; svg += '<rect x="' + (t[0]-t[2]/2) + '" y="' + (t[1]-t[3]/2) + '" width="' + t[2] + '" height="' + t[3] + '" rx="3" fill="rgba(214,179,79,.12)" stroke="#d6b34f" stroke-dasharray="3 2"/>'; }
    const secondColor = v.mode === 'rally' || v.mode === 'serve' ? '#d6b34f' : '#59bd70';
    svg += tracedPath(secondD, 'fill="none" stroke="' + secondColor + '" stroke-width="2.6" stroke-linecap="round"', timeline.secondAt, timeline.secondFlight, 'gd-second-point');
    svg += movingToken(secondD, v.secondLanding, '#dce85e', timeline.secondAt, timeline.secondFlight, 3.3, 'gd-flight-ball');
    svg += '<text x="60" y="74" text-anchor="middle" fill="rgba(232,214,152,.86)" font-size="5.7" font-weight="900" class="gd-svg-cue" style="--gd-cue-delay:' + seconds(timeline.cueAt[1]) + '">' + escapeHtml(v.secondOutcome) + '</text>';
    if (v.responsePath) {
      const exitD = smoothPathData([v.secondLanding,v.responsePath[0]]);
      svg += tracedPath(exitD,'fill="none" stroke="#d6b34f" stroke-width="2.6"',timeline.secondAt+timeline.secondFlight,.16,'gd-short-ball-exit');
      const responseD = smoothPathData(v.responsePath);
      svg += tracedPath(responseD, 'fill="none" stroke="#e87171" stroke-width="2.5" stroke-linecap="round"', timeline.responseAt, .64, 'gd-response-point');
      svg += movingToken(responseD, v.responseLanding, '#e87171', timeline.responseAt, .64, 3.3, 'gd-flight-ball');
      svg += '<text x="60" y="129" text-anchor="middle" fill="rgba(232,113,113,.9)" font-size="5.7" font-weight="900" class="gd-svg-cue" style="--gd-cue-delay:' + seconds(timeline.cueAt[2]) + '">' + escapeHtml(v.responseOutcome) + '</text>';
    }
    svg += '</g>';
    return twoPointPanels(svg, v.description);
  }

  function contactPreviewMode(step) {
    return step && step.visual && step.visual.motion && step.visual.motion.previewMode === 'fix' ? 'fix' : 'miss';
  }

  function configureContactMotion(step) {
    if (!contactMotionRuntimeAvailable()) return false;
    faspScene({
      mstroke: step.visual.motion.stroke,
      march: step.visual.motion.fault,
      moutcome: step.visual.motion.outcome,
      mshowoutcome: step.visual.motion.showOutcome !== false,
      mshowfixoutcome: false,
      _fixLabel: 'Contact point',
      _evidenceLabels: {
        left: 'CROWDED',
        right: 'REFERENCE',
        missStatus: 'CROWDED — LESS ROOM',
        fixStatus: 'REFERENCE — MORE ROOM',
        missAria: 'Crowded spacing',
        fixAria: 'More usable spacing',
        compareAria: 'Synchronized comparison of crowded and more usable contact spacing'
      }
    });
    return true;
  }

  function contactVisual(step, selectedIndex) {
    const v = step.visual;
    configureContactMotion(step);
    const accessibleDescription = selectedIndex == null ? v.previewDescription : v.description;
    return '<div class="gs-gold-daily-contact-motion' + (selectedIndex == null ? ' is-reading' : ' is-revealed') + '" role="group" aria-label="' + escapeHtml(accessibleDescription) + '">' +
      '<div id="faspStage" class="fasp-stage gs-gold-daily-contact-stage" aria-hidden="true"></div>' +
      '<div class="gs-gold-daily-contact-focus"><span aria-hidden="true">◎</span>' + escapeHtml(v.focusCue) + '</div>' +
    '</div>';
  }

  function playContactMotion(step, answered) {
    if (!step || step.visual.kind !== 'contact' || !configureContactMotion(step)) return false;
    const run = ++state.motionRun;
    const timing = contactTiming();
    root.setTimeout(function () {
      if (run !== state.motionRun || !state.overlay || state.overlay.hidden) return;
      faspStart(answered ? 'fix' : contactPreviewMode(step));
      if (answered) {
        if (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          faspRender('compare', step.visual.motion.contactFrame);
          return;
        }
        root.setTimeout(function () {
          if (run !== state.motionRun || !state.overlay || state.overlay.hidden) return;
          if (typeof faspScrub === 'function') faspScrub(step.visual.motion.contactFrame * 100);
          faspRender('compare', step.visual.motion.contactFrame);
        }, timing.compareAt * 1000);
      } else {
        // Show the full authored outcome, then return to the evidence the
        // question asks the player to inspect. Scrub also cancels the RAF.
        root.setTimeout(function () {
          if (run !== state.motionRun || !state.overlay || state.overlay.hidden) return;
          if (typeof faspScrub === 'function') faspScrub(step.visual.motion.contactFrame * 100);
          faspRender(contactPreviewMode(step), step.visual.motion.contactFrame);
        }, timing.compareAt * 1000);
      }
    }, 50);
    return true;
  }

  const VISUAL_RENDERERS = Object.freeze({
    approach_to_volley: function(step,selected){return '<div class="gd-sequence-evidence">'+construction.render(step,selected,0,prefersReducedMotion())+'</div>';},
    serve_adjustment: function(step,selected){return '<div class="gd-sequence-evidence">'+construction.render(step,selected,0,prefersReducedMotion())+'</div>';},
    score_pressure: function(step,selected){return '<div class="gd-sequence-evidence">'+tradeoffs.render(step,selected,0,prefersReducedMotion())+'</div>';},
    return_time: function(step,selected){return '<div class="gd-sequence-evidence">'+returnTime.render(step,selected,0,prefersReducedMotion())+'</div>';},
    serve_quality: function(step,selected){return '<div class="gd-sequence-evidence">'+serveQuality.render(step,selected,0,prefersReducedMotion())+'</div>';},
    pattern_conditions: function(step,selected){return '<div class="gd-sequence-evidence">'+patterns.render(step,selected,0,prefersReducedMotion())+'</div>';},
    inside_out_consequence: function(step,selected){return '<div class="gd-sequence-evidence">'+tradeoffs.render(step,selected,0,prefersReducedMotion())+'</div>';},
    net_close_timing: function(step,selected){return '<div class="gd-sequence-evidence">'+tradeoffs.render(step,selected,0,prefersReducedMotion())+'</div>';},
    high_ball_contrast: function(step,selected){return '<div class="gd-high-evidence">'+highBall.render(step,selected,0,prefersReducedMotion())+'</div>';},
    court_read: courtReadVisual,
    recovery: recoveryVisual,
    shortBall: shortBallVisual,
    contact: contactVisual,
    direction_change: directionChangeVisual,
    serve_plus_one: servePlusOneVisual,
    return_position: returnPositionVisual,
    split_step_timeline: splitStepVisual,
    outcome_vs_decision: outcomeDecisionVisual,
    two_point_sequence: twoPointVisual
  });

  function visualHtml(step) {
    const answered = state.selectedIndex != null;
    const timeline = timelineFor(step, answered);
    const cues = answered && Array.isArray(step.visual.answerCues) ? step.visual.answerCues : step.visual.cues;
    const cueRail = '<div class="gs-gold-daily-cue-rail" aria-hidden="true">' + cues.map(function (cue, index) {
      return '<span class="' + (answered ? 'is-set ' : '') + (index === cues.length - 1 ? 'is-final' : '') + '" style="--gd-cue-delay:' + seconds(timeline.cueAt[index]) + '">' + escapeHtml(cue) + '</span>';
    }).join('') + '</div>';
    const renderer = VISUAL_RENDERERS[step.visual.kind];
    if (!renderer) throw new Error('Withheld: no validated renderer for ' + step.visual.kind + '.');
    const rendered = renderer(step, state.selectedIndex, timeline);
    const mapOnly=['recovery','shortBall','direction_change','serve_plus_one','return_position','outcome_vs_decision','court_read'].includes(step.visual.kind);
    const boundary=mapOnly?'<p class="gd-map-boundary" style="font-size:12px;line-height:1.4;padding:8px 12px;margin:0;color:rgba(240,236,227,.72)">Court-map example · use the stated contact conditions.</p>':'';
    const ink = answered ? '<div class="gs-gold-daily-ink" aria-hidden="true" style="--gd-ink-delay:' + seconds(payoffAtFor(step, timeline)) + '"><span>' + escapeHtml(step.unlock) + '</span></div>' : '';
    return '<div class="gs-gold-daily-visual is-' + escapeHtml(step.visual.kind) + ' ' + (isPacedEvidence(step) ? 'is-paced ' : '') + (answered ? 'is-answered' : 'is-reading') + '">' +
      '<div class="gs-gold-daily-visual-tools">' + cueRail +
        '<button class="gs-gold-daily-visual-expand" type="button" data-gd-action="expand-evidence" aria-label="Expand animation to full screen" aria-haspopup="dialog">&#8599;</button>' +
        '<button class="gs-gold-daily-visual-replay" type="button" data-gd-action="replay-evidence" aria-label="Replay the tennis evidence">↻</button>' +
      '</div>' +
      '<div class="gs-gold-daily-visual-canvas">' + rendered + ink + '</div>'+boundary+'</div>';
  }

  function ensureOverlay() {
    if (!root.document) return null;
    if (state.overlay && state.overlay.isConnected) return state.overlay;
    const overlay = root.document.createElement('section');
    overlay.className = 'gs-gold-daily';
    overlay.hidden = true;
    overlay.setAttribute('aria-label', 'Gold-standard Daily Challenge prototypes');
    overlay.innerHTML = '<div class="gs-gold-daily-shell"></div>' +
      '<div class="gs-gold-daily-sr" aria-live="polite" aria-atomic="true"></div>' +
      '<div class="gs-gold-daily-focus" role="dialog" aria-modal="true" aria-label="Animation Focus View" aria-hidden="true" hidden>' +
        '<header class="gs-gold-daily-focus-head">' +
          '<div class="gs-gold-daily-focus-copy"><span>GAMESHARP FOCUS VIEW</span><strong class="gs-gold-daily-focus-title">Study the evidence</strong></div>' +
          '<button class="gs-gold-daily-focus-close" type="button" data-gd-action="close-focus" aria-label="Close full-screen animation">&#215;</button>' +
        '</header>' +
        '<div class="gs-gold-daily-focus-stage"></div>' +
        '<footer class="gs-gold-daily-focus-foot"><span class="gs-gold-daily-focus-cue">Replay · rotate freely · close to decide</span></footer>' +
      '</div>';
    overlay.addEventListener('pointerdown', onPointerDown, { passive: true });
    overlay.addEventListener('click', onClick);
    root.document.body.appendChild(overlay);
    state.overlay = overlay;
    return overlay;
  }

  function shell() {
    return state.overlay && state.overlay.querySelector('.gs-gold-daily-shell');
  }

  function focusLayer() {
    return state.overlay && state.overlay.querySelector('.gs-gold-daily-focus');
  }

  function setShellFocusInactive(inactive) {
    const host = shell();
    if (!host) return;
    host.inert = inactive;
    if (inactive) host.setAttribute('aria-hidden', 'true');
    else host.removeAttribute('aria-hidden');
  }

  function openEvidenceFocus(control) {
    if (!state.overlay || state.focusSubject) return false;
    const challenge = challenges[state.challengeIndex];
    const step = challenge && challenge.steps[state.stepIndex];
    const visual = shell() && shell().querySelector('.gs-gold-daily-visual');
    const focus = focusLayer();
    const stage = focus && focus.querySelector('.gs-gold-daily-focus-stage');
    if (!step || !visual || !focus || !stage) return false;

    state.focusParent = visual.parentNode;
    state.focusNext = visual.nextSibling;
    state.focusReturn = control || visual;
    state.focusScrollTop = state.overlay.scrollTop;
    state.focusSubject = visual;

    const title = focus.querySelector('.gs-gold-daily-focus-title');
    const cue = focus.querySelector('.gs-gold-daily-focus-cue');
    if (title) title.textContent = (challenge.screenTitle || challenge.title) + ' · ' + step.phase;
    if (cue) cue.textContent = state.selectedIndex == null
      ? 'Replay · rotate freely · close to decide'
      : 'Replay · compare · close to continue';

    visual.classList.add('is-focus-subject');
    stage.appendChild(visual);
    setShellFocusInactive(true);
    state.overlay.classList.add('is-focus-open');
    focus.hidden = false;
    focus.setAttribute('aria-hidden', 'false');

    // The expand tap intentionally ends the in-flow motion. Restart the exact
    // same authored evidence only after its live node is inside Focus View, so
    // portrait, landscape and answer state can never diverge from the decision.
    replayEvidence();
    const closeControl = focus.querySelector('.gs-gold-daily-focus-close');
    if (closeControl) closeControl.focus({ preventScroll: true });
    return true;
  }

  function closeEvidenceFocus(restoreFocus) {
    if (!state.focusSubject) return false;
    finishEvidenceMotion();
    const focus = focusLayer();
    const active = state.focusSubject;
    const parent = state.focusParent;
    const next = state.focusNext;
    const returnTo = state.focusReturn;

    active.classList.remove('is-focus-subject');
    if (parent && parent.isConnected) parent.insertBefore(active, next && next.parentNode === parent ? next : null);
    else active.remove();

    if (focus) {
      focus.hidden = true;
      focus.setAttribute('aria-hidden', 'true');
    }
    setShellFocusInactive(false);
    state.overlay.classList.remove('is-focus-open');
    state.overlay.scrollTop = state.focusScrollTop;
    state.focusSubject = null;
    state.focusParent = null;
    state.focusNext = null;
    state.focusReturn = null;
    state.focusScrollTop = 0;
    if (restoreFocus !== false && returnTo && returnTo.isConnected) returnTo.focus({ preventScroll: true });
    return true;
  }

  function trapFocus(event) {
    const focus = focusLayer();
    if (!state.focusSubject || !focus || event.key !== 'Tab') return false;
    const controls = Array.prototype.filter.call(
      focus.querySelectorAll('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])'),
      function (node) { return node.getClientRects().length > 0; }
    );
    if (!controls.length) return false;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && root.document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return true;
    }
    if (!event.shiftKey && root.document.activeElement === last) {
      event.preventDefault();
      first.focus();
      return true;
    }
    return false;
  }

  function header(backAction) {
    const backLabel = state.practice ? 'Back to Sharpen' : state.daily ? 'Back to today’s lesson' : 'Back to lesson list';
    return '<header class="gs-gold-daily-head">' +
      (backAction ? '<button class="gs-gold-daily-icon" type="button" data-gd-action="' + backAction + '" aria-label="' + escapeHtml(backLabel) + '">&#8592;</button>' : '<span aria-hidden="true"></span>') +
      '<div class="gs-gold-daily-brand">GAME<span>SHARP</span></div>' +
      '<button class="gs-gold-daily-icon" type="button" data-gd-action="close" aria-label="' + (state.practice ? escapeHtml(backLabel) : state.daily ? 'Close Daily Challenge' : 'Close lesson library') + '">&#215;</button>' +
    '</header>';
  }

  function setPageInactive(inactive) {
    if (!root.document) return;
    if (inactive) {
      state.pageState = [];
      Array.prototype.forEach.call(root.document.body.children, function (node) {
        if (node === state.overlay || node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
        state.pageState.push({ node: node, inert: node.inert, aria: node.getAttribute('aria-hidden') });
        node.inert = true;
        node.setAttribute('aria-hidden', 'true');
      });
      root.document.body.dataset.gdPreviousOverflow = root.document.body.style.overflow || '';
      root.document.body.style.overflow = 'hidden';
    } else {
      state.pageState.forEach(function (entry) {
        entry.node.inert = entry.inert;
        if (entry.aria == null) entry.node.removeAttribute('aria-hidden'); else entry.node.setAttribute('aria-hidden', entry.aria);
      });
      state.pageState = [];
      root.document.body.style.overflow = root.document.body.dataset.gdPreviousOverflow || '';
      delete root.document.body.dataset.gdPreviousOverflow;
    }
  }

  function focusHeading() {
    if (!state.overlay) return;
    state.overlay.scrollTop = 0;
    const heading = state.overlay.querySelector('[data-gd-focus]');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  function clearAnnouncement() {
    const live = state.overlay && state.overlay.querySelector('.gs-gold-daily-sr');
    if (live) live.textContent = '';
  }

  function announceEvidencePayoff() {
    if (!state.overlay || state.overlay.hidden || state.selectedIndex == null) return;
    const step = challenges[state.challengeIndex].steps[state.stepIndex];
    const live = state.overlay.querySelector('.gs-gold-daily-sr');
    if (live) live.textContent = (state.selectedIndex === step.correct ? '' : 'See it. ') + step.unlock + '. ' + step.payoff;
  }

  function finishEvidenceMotion() {
    if (!state.overlay || state.challengeIndex < 0) return;
    const visual = state.overlay.querySelector('.gs-gold-daily-visual');
    if (!visual || visual.classList.contains('is-motion-finished')) return;
    const challenge = challenges[state.challengeIndex];
    const authoredStep = challenge && challenge.steps[state.stepIndex];
    const answered = state.selectedIndex != null;
    const timeline = timelineFor(authoredStep, answered);
    state.motionRun += 1;
    visual.classList.add('is-motion-finished');
    const step = state.overlay.querySelector('.gs-gold-daily-step');
    if (step) step.classList.add('is-motion-finished');
    Array.prototype.forEach.call(visual.querySelectorAll('svg'), function (svg) {
      try { if (typeof svg.setCurrentTime === 'function') svg.setCurrentTime((timeline && timeline.total || 0) + .05); } catch (error) {}
    });
    if (authoredStep && authoredStep.visual.kind === 'contact' && configureContactMotion(authoredStep)) {
      if (typeof faspScrub === 'function') faspScrub(authoredStep.visual.motion.contactFrame * 100);
      faspRender(answered ? 'compare' : contactPreviewMode(authoredStep), authoredStep.visual.motion.contactFrame);
    }
    if (authoredStep && authoredStep.visual.kind === 'high_ball_contrast') {
      const host=visual.querySelector('.gd-high-evidence');
      if(host) host.innerHTML=highBall.render(authoredStep,state.selectedIndex,timeline.total,true);
    }
    if (authoredStep && tradeoffs && tradeoffs.kinds.includes(authoredStep.visual.kind)) {
      const host=visual.querySelector('.gd-sequence-evidence');
      if(host)host.innerHTML=tradeoffs.render(authoredStep,state.selectedIndex,timeline.total,true);
    }
    if (extensionFor(authoredStep)) {
      const host=visual.querySelector('.gd-sequence-evidence');
      if(host)host.innerHTML=extensionFor(authoredStep).render(authoredStep,state.selectedIndex,timeline.total,true);
    }
    if (authoredStep && ['approach_to_volley','serve_adjustment'].includes(authoredStep.visual.kind)) {
      const host=visual.querySelector('.gd-sequence-evidence');
      if(host)host.innerHTML=construction.render(authoredStep,state.selectedIndex,timeline.total,true);
    }
    stopNaturalAudio();
    announceEvidencePayoff();
  }

  function onPointerDown() {
    unlockNaturalAudio();
  }

  function open(options) {
    if (state.practice) return false;
    state.daily = !!(options && options.daily && dailyLoop);
    const report = audit();
    const calendarErrors = state.daily && (dailyLoop.order.length !== challenges.filter(c=>!c.reviewOnly).length || dailyLoop.order.some(id => !challenges.some(c => c.id === id && !c.reviewOnly))) ? ['Daily calendar references an unavailable lesson.'] : [];
    const runtimeReport = runtimeAudit();
    const overlay = ensureOverlay();
    if (!overlay) return false;
    overlay.setAttribute('aria-label', state.daily ? 'Daily Challenge' : 'Choose a lesson');
    state.previousFocus = root.document.activeElement;
    audioEngine();
    setPageInactive(true);
    overlay.hidden = false;
    if (!report.ok || !runtimeReport.ok || calendarErrors.length) {
      const failures = report.errors.concat(runtimeReport.errors, calendarErrors);
      shell().innerHTML = header() + '<p class="gs-gold-daily-kicker">Preview withheld</p><h1 class="gs-gold-daily-h1" data-gd-focus>Prototype contract failed</h1><p class="gs-gold-daily-lede">' + escapeHtml(failures.join(' ')) + '</p>';
      focusHeading();
      return false;
    }
    renderSelector();
    return true;
  }

  function close() {
    if (!state.overlay || state.overlay.hidden) return;
    if (state.focusSubject) closeEvidenceFocus(false);
    state.motionRun += 1;
    stopNaturalAudio();
    state.overlay.hidden = true;
    setPageInactive(false);
    state.challengeIndex = -1;
    if (root.GameSharpMainDaily) root.GameSharpMainDaily.refreshHome();
    if (state.previousFocus && typeof state.previousFocus.focus === 'function') state.previousFocus.focus({ preventScroll: true });
    // Consume the return before invoking caller code: Escape, Back and a second
    // close cannot return twice, and no inherited Daily hook runs underneath it.
    const practice = state.practice;
    if (practice) {
      state.practice = null;
      Object.assign(state, practice.dailyState);
      state.dailyOrigin = null;
      try { practice.onReturn({ lessonId: practice.lessonId, completed: practice.completed }); }
      finally {
        if (state.practice) state.practice.priorDailyOrigin = practice.priorDailyOrigin;
        else state.dailyOrigin = practice.priorDailyOrigin;
      }
    }
  }

  function isAvailable(lessonId) {
    const challenge = challenges.find(function(item){return item.id === lessonId && !item.reviewOnly;});
    if (!challenge || !challenge.steps.every(function(step){return typeof VISUAL_RENDERERS[step.visual.kind] === 'function';})) return false;
    if (root.document && root.GS_GOLD_DAILY_MAIN && (!root.GameSharpMainDaily || !root.GS_GOLD_DAILY_CSS_READY)) return false;
    return runtimeAudit().ok;
  }

  function openPractice(lessonId, options) {
    const opts = options || {};
    // Fail before closing a caller's surface or touching the existing Daily.
    if (!root.document || state.practice || typeof opts.onReturn !== 'function' || !isAvailable(lessonId) || !audit().ok) return false;
    const dailyState = {daily:state.daily,dailyDate:state.dailyDate,dailyReplay:state.dailyReplay,dailyAnswers:state.dailyAnswers.slice(),dailyHomeDate:state.dailyHomeDate};
    const priorDailyOrigin = state.dailyOrigin;
    if (state.overlay && !state.overlay.hidden) close();
    state.dailyOrigin = null;
    if (!open()) { Object.assign(state,dailyState); state.dailyOrigin=priorDailyOrigin; return false; }
    state.practice = {lessonId:lessonId,onReturn:opts.onReturn,returnLabel:typeof opts.returnLabel==='string'&&opts.returnLabel.trim()?opts.returnLabel:'Take this to court →',completed:false,priorDailyOrigin:priorDailyOrigin,dailyState:dailyState};
    state.overlay.setAttribute('aria-label','Sharpen practice');
    installDailyReturns();
    return start(challenges.findIndex(function(item){return item.id===lessonId;}),false);
  }

  function preview(lessonId) {
    const challenge = challenges.find(function(item){return item.id===lessonId && !item.reviewOnly;});
    const step = challenge && challenge.steps[0];
    // Contact owns a global faspStage/configuration. A thumbnail must not borrow
    // that singleton from a live/hidden lesson; callers use a neutral text tile.
    if (!step || step.visual.kind==='contact' || !VISUAL_RENDERERS[step.visual.kind]) return '';
    const module = extensionFor(step) || (tradeoffs && tradeoffs.kinds.includes(step.visual.kind) ? tradeoffs : ['approach_to_volley','serve_adjustment'].includes(step.visual.kind) ? construction : step.visual.kind==='high_ball_contrast' ? highBall : null);
    const html = module ? module.render(step,null,0,false) : VISUAL_RENDERERS[step.visual.kind](step,null,timelineFor(step,false));
    const gradientColours = {};
    html.replace(/<linearGradient\b[^>]*id="([^"]+)"[^>]*>[\s\S]*?<stop\b[^>]*stop-color="([^"]+)"/g,function(_,id,colour){gradientColours[id]=colour;return _;});
    // Decorative initial read setup only: no controls, text/answer labels, shared
    // IDs, CSS animation or SMIL clocks are mounted by the consumer.
    const svg = (html.match(/<svg\b[\s\S]*?<\/svg>/g)||[]).join('')
      .replace(/<defs\b[\s\S]*?<\/defs>/g,'')
      .replace(/<text\b[\s\S]*?<\/text>/g,'')
      .replace(/<(?:animate(?:Motion|Transform)?|set)\b[^>]*(?:\/>|>[\s\S]*?<\/(?:animate(?:Motion|Transform)?|set)>)/g,'')
      .replace(/\s(?:id|class|style|role|aria-label|aria-labelledby|aria-describedby|marker-mid)="[^"]*"/g,'')
      .replace(/url\(#([^)]*)\)/g,function(_,id){return gradientColours[id]||'none';})
      .replace(/<svg\b/g,'<svg aria-hidden="true" focusable="false"');
    return svg;
  }

  function renderSelector() {
    if (state.practice) return close();
    if (state.daily) return dailyHome();
    if (state.focusSubject) closeEvidenceFocus(false);
    state.motionRun += 1;
    stopNaturalAudio();
    state.challengeIndex = -1;
    clearAnnouncement();
    const cards = challenges.map(function (challenge, index) {
      if (!canReviewChallenge(challenge)) return '';
      return '<button class="gs-gold-daily-card" type="button" data-gd-action="start" data-gd-index="' + index + '">' +
        '<span><span class="gs-gold-daily-card-num">Lesson ' + (index + 1) + ' · 3 connected decisions</span>' +
        '<span class="gs-gold-daily-card-title">' + escapeHtml(challenge.title) + '</span>' +
        '<span class="gs-gold-daily-card-insight">' + escapeHtml(challenge.insight) + '</span></span>' +
        '<span class="gs-gold-daily-card-arrow" aria-hidden="true">&#8594;</span>' +
      '</button>';
    }).join('');
    shell().innerHTML = header() +
      '<p class="gs-gold-daily-kicker">Play at your own pace</p>' +
      '<h1 class="gs-gold-daily-h1" data-gd-focus>Choose a lesson</h1>' +
      '<p class="gs-gold-daily-lede">Pick any lesson, in any order. One insight, three connected decisions. Come back whenever you like.</p>' +
      '<div class="gs-gold-daily-list">' + cards + '</div>' +
      '<p class="gs-gold-daily-note"><a href="?goldDaily=today">Open today’s Daily Challenge →</a></p>' +
      '<p class="gs-gold-daily-note">Free practice does not replace today’s challenge or change your Daily streak.</p>';
    focusHeading();
  }

  function canReviewChallenge(challenge) {
    return !challenge.reviewOnly || !!(root.location && (['127.0.0.1','localhost','[::1]'].includes(root.location.hostname) || root.location.protocol === 'file:'));
  }

  function start(index, isContinuation) {
    const parsed = Number(index);
    if (!Number.isInteger(parsed) || parsed < 0 || parsed >= challenges.length) return false;
    if (!canReviewChallenge(challenges[parsed])) return false;
    if (state.practice && challenges[parsed].id !== state.practice.lessonId) return false;
    if (state.focusSubject) closeEvidenceFocus(false);
    state.challengeIndex = parsed;
    state.stepIndex = 0;
    state.selectedIndex = null;
    state.score = 0;
    state.startedAt = Date.now();
    state.dailyAnswers = [];
    if (isContinuation) emit('next_daily_challenge_started', { challenge_id: challenges[parsed].id });
    emit('challenge_started', { challenge_id: challenges[parsed].id });
    renderStep();
    return true;
  }

  function progressHtml() {
    return '<div class="gs-gold-daily-progress" aria-label="Decision ' + (state.stepIndex + 1) + ' of 3">' + [0, 1, 2].map(function (index) {
      return '<span class="' + (index < state.stepIndex ? 'is-done' : (index === state.stepIndex ? 'is-current' : '')) + '"></span>';
    }).join('') + '</div>';
  }

  function playEvidenceMotion(step, answered) {
    if (!step) return false;
    if ((extensionFor(step) || ['approach_to_volley','serve_adjustment'].includes(step.visual.kind) || tradeoffs && tradeoffs.kinds.includes(step.visual.kind)) && !prefersReducedMotion()) {
      const run=state.motionRun,selected=state.selectedIndex,started=root.performance.now(),timeline=timelineFor(step,answered);
      const total=answered&&selected===step.correct?timeline.inkAt:timeline.total;
      let previous=-1;
      const tick=function(now){
        if(run!==state.motionRun||!state.overlay||state.overlay.hidden)return;
        const elapsed=Math.min(total,Math.max(0,(now-started)/1000)),host=state.overlay.querySelector('.gd-sequence-evidence');
        if(host&&(elapsed-previous>=1/30||elapsed===total)){host.innerHTML=(extensionFor(step)||(tradeoffs && tradeoffs.kinds.includes(step.visual.kind)?tradeoffs:construction)).render(step,selected,elapsed,false);previous=elapsed;}
        if(elapsed<total)root.requestAnimationFrame(tick);
      };
      root.requestAnimationFrame(tick);
    }
    if (step.visual.kind === 'high_ball_contrast' && !prefersReducedMotion()) {
      const run=state.motionRun, selected=state.selectedIndex, started=root.performance.now();
      const total=answered&&selected===step.correct?4.55:timelineFor(step,answered).total;
      const tick=function(now){
        if(run!==state.motionRun||!state.overlay||state.overlay.hidden)return;
        const host=state.overlay.querySelector('.gd-high-evidence'), elapsed=Math.min(total,Math.max(0,(now-started)/1000));
        if(host)host.innerHTML=highBall.render(step,selected,elapsed,false);
        if(elapsed<total)root.requestAnimationFrame(tick);
      };
      root.requestAnimationFrame(tick);
    }
    const contactPlayed = step.visual.kind === 'contact' ? playContactMotion(step, answered) : false;
    const audioScheduled = scheduleNaturalEvidence(step, answered);
    clearAnnouncement();
    if (answered) {
      const renderedVisual = state.overlay.querySelector('.gs-gold-daily-visual');
      const delay = prefersReducedMotion() ? 0 : payoffAtFor(step, timelineFor(step, true)) * 1000;
      root.setTimeout(function () {
        if (renderedVisual === state.overlay.querySelector('.gs-gold-daily-visual')) announceEvidencePayoff();
      }, delay);
    }
    return contactPlayed || audioScheduled || step.visual.kind !== 'contact';
  }

  function renderStep(renderOptions) {
    const opts = renderOptions || {};
    clearAnnouncement();
    const challenge = challenges[state.challengeIndex];
    const step = challenge.steps[state.stepIndex];
    const answered = state.selectedIndex != null;
    const timeline = timelineFor(step, answered);
    const paced = isPacedEvidence(step);
    const payoffAt = answered ? payoffAtFor(step, timeline) : 0;
    const scrollTop = Number.isFinite(opts.scrollTop) ? opts.scrollTop : 0;
    state.motionRun += 1;
    stopNaturalAudio();
    const options = step.options.map(function (option, index) {
      let statusClass = '';
      if (answered) {
        if (index === step.correct) statusClass = ' is-correct';
        else if (index === state.selectedIndex) statusClass = ' is-wrong';
        else statusClass = ' is-muted';
      }
      return '<button class="gs-gold-daily-option' + statusClass + '" type="button" data-gd-action="answer" data-gd-index="' + index + '"' + (answered ? ' disabled' : '') + '>' +
        '<span class="gs-gold-daily-option-letter">' + escapeHtml(option.id) + '</span><span>' + escapeHtml(option.text) + '</span></button>';
    }).join('');
    const isCorrect = answered && state.selectedIndex === step.correct;
    const whyId = 'gd-why-' + challenge.id + '-' + state.stepIndex;
    const feedback = answered ? '<div class="gs-gold-daily-feedback' + (isCorrect ? '' : ' is-miss') + '">' +
      '<div class="gs-gold-daily-feedback-label">' + (isCorrect ? 'Read confirmed' : 'Correction') + '</div>' +
      '<div class="gs-gold-daily-feedback-copy">' + escapeHtml(!isCorrect && step.notes ? step.notes[state.selectedIndex] : step.visual.kind==='court_read' && !isCorrect ? step.visual.choices[state.selectedIndex].note : step.payoff) + '</div>' +
      '<div class="gs-gold-daily-feedback-principle">' + escapeHtml(step.principle) + '</div>' +
      '<button class="gs-gold-daily-why" type="button" data-gd-action="why" aria-expanded="false" aria-controls="' + whyId + '">Why? <span aria-hidden="true">+</span></button>' +
      '<div class="gs-gold-daily-why-panel" id="' + whyId + '" hidden>' + escapeHtml(step.why) + '</div></div>' +
      '<button class="gs-gold-daily-next" type="button" data-gd-action="next">' + (state.stepIndex === 2 ? 'Take it to court →' : 'Next decision →') + '</button>' : '';
    shell().innerHTML = header('list') + '<main class="gs-gold-daily-step is-guided-coaching' + (paced ? ' is-paced' : '') + (answered ? ' is-answered' : ' is-reading') + '" style="--gd-question-delay:' + seconds(timeline.questionAt) + ';--gd-payoff-delay:' + seconds(payoffAt) + '">' +
      '<div class="gs-gold-daily-step-meta"><div class="gs-gold-daily-step-copy"><span>' + escapeHtml(challenge.screenTitle || challenge.title) + '</span></div><span class="gs-gold-daily-step-count">' + (state.stepIndex + 1) + ' of 3</span></div>' +
      '<p class="gs-gold-daily-coach-setup" id="gd-coach-setup">' + escapeHtml(step.situation) + '</p>' +
      visualHtml(step) +
      '<section class="gs-gold-daily-decision-zone" aria-label="Decision ' + (state.stepIndex + 1) + ' of 3">' +
        '<h1 class="gs-gold-daily-question" data-gd-focus aria-describedby="gd-coach-setup">' + escapeHtml(step.question) + '</h1>' +
        '<div class="gs-gold-daily-options' + (answered ? ' is-answered' : '') + '">' + options + '</div>' + feedback +
      '</section></main>';
    if (opts.preserveScroll && state.overlay) state.overlay.scrollTop = scrollTop;
    playEvidenceMotion(step, answered);
    if (!answered) {
      clearAnnouncement();
      state.answerStartedAt = root.performance && typeof root.performance.now === 'function' ? root.performance.now() : Date.now();
      if (opts.preserveScroll && state.overlay) state.overlay.scrollTop = scrollTop;
      else focusHeading();
    }
  }

  function answer(index) {
    if (state.selectedIndex != null) return false;
    const challenge = challenges[state.challengeIndex];
    const step = challenge && challenge.steps[state.stepIndex];
    const parsed = Number(index);
    if (!step || !Number.isInteger(parsed) || parsed < 0 || parsed > 3) return false;
    const scrollTop = state.overlay ? state.overlay.scrollTop : 0;
    state.selectedIndex = parsed;
    const correct = parsed === step.correct;
    if (correct && !state.practice) state.score += 1;
    if (state.daily) {
      state.dailyAnswers[state.stepIndex] = parsed;
      dailyCheckpoint(false);
    }
    emit('interaction_' + (state.stepIndex + 1) + '_answered', {
      challenge_id: challenge.id,
      interaction: state.stepIndex + 1,
      selected_answer: step.options[parsed].id,
      selected_answer_text: step.options[parsed].text,
      correct: correct,
      time_to_answer_ms: elapsedMs()
    });
    renderStep({ preserveScroll: true, scrollTop: scrollTop });
    return true;
  }

  function next() {
    if (state.selectedIndex == null) return false;
    if (state.stepIndex < 2) {
      state.stepIndex += 1;
      state.selectedIndex = null;
      dailyCheckpoint(false);
      renderStep();
      return true;
    }
    renderResult();
    return true;
  }

  function renderResult() {
    if (state.focusSubject) closeEvidenceFocus(false);
    state.motionRun += 1;
    stopNaturalAudio();
    const challenge = challenges[state.challengeIndex];
    clearAnnouncement();
    if (state.practice && state.stepIndex === 2 && state.selectedIndex != null) state.practice.completed = true;
    dailyCheckpoint(true);
    if (state.daily && root.GS_GOLD_DAILY_MAIN && state.dailyAnswers.length === 3) root.GameSharpMainDaily.complete(state.dailyDate, challenge.id, state.dailyAnswers);
    emit('challenge_completed', {
      challenge_id: challenge.id,
      score: state.practice ? null : state.score,
      interactions: 3,
      duration_ms: Math.max(0, Date.now() - state.startedAt)
    });
    const nextIndex = challenges.findIndex(function(c,i) { return i > state.challengeIndex && canReviewChallenge(c); });
    const pro = challenge.proInsight;
    shell().innerHTML = header('list') + '<main class="gs-gold-daily-result">' +
      (state.practice ? '<div class="gs-gold-daily-score">Three decisions explored · unscored practice</div>' : '<div class="gs-gold-daily-score" aria-label="' + state.score + ' of 3 correct">' + state.score + '/3 calls · one read unlocked</div>') +
      '<p class="gs-gold-daily-kicker">What you can now see</p>' +
      '<h1 data-gd-focus>' + escapeHtml(challenge.memory) + '</h1>' +
      '<section class="gs-gold-daily-pro-insight" aria-labelledby="gd-pro-player">' +
        '<div class="gs-gold-daily-pro-eyebrow">Pro Insight</div>' +
        '<h2 id="gd-pro-player">' + escapeHtml(pro.player) + '</h2>' +
        '<p class="gs-gold-daily-pro-story">' + escapeHtml(pro.documentedMoment) + '</p>' +
        '<div class="gs-gold-daily-pro-read"><span>GameSharp read</span><p>' + escapeHtml(pro.gameSharpRead) + '</p></div>' +
        '<div class="gs-gold-daily-pro-source"><a href="' + escapeHtml(pro.source.url) + '" target="_blank" rel="noopener noreferrer" aria-label="Open source: ' + escapeHtml(pro.source.title) + '">Source · ' + escapeHtml(pro.source.publisher) + ' ↗</a><span>' + escapeHtml(pro.source.published) + '</span></div>' +
        '<p class="gs-gold-daily-pro-disclosure">' + escapeHtml(EDITORIAL_DISCLOSURE) + '</p>' +
      '</section>' +
      '<div class="gs-gold-daily-court-cue"><div class="gs-gold-daily-court-cue-label">Take it to court</div><div class="gs-gold-daily-court-cue-copy">' + escapeHtml(challenge.takeItToCourt) + '</div></div>' +
      '<div class="gs-gold-daily-result-actions">' +
        (state.practice ? '<button class="gs-gold-daily-next" type="button" data-gd-action="list">'+escapeHtml(state.practice.returnLabel)+'</button><button class="gs-gold-daily-secondary" type="button" data-gd-action="restart">Explore this lesson again</button>' : state.daily ? '<p class="gs-gold-daily-note">' + (state.dailyReplay ? 'Practice replay — your first result is unchanged.' : 'Three decisions complete for ' + escapeHtml(state.dailyDate) + '.') + '</p><button class="gs-gold-daily-next" type="button" data-gd-action="list">Back to your Daily →</button>' + dailyPracticeHtml(challenge) :
          '<button class="gs-gold-daily-next" type="button" data-gd-action="list">Choose another lesson →</button>' +
          '<button class="gs-gold-daily-secondary" type="button" data-gd-action="restart">Play this one again</button>') +
      '</div></main>';
    focusHeading();
  }

  function replayEvidence() {
    const challenge = challenges[state.challengeIndex];
    const step = challenge && challenge.steps[state.stepIndex];
    const current = state.overlay && state.overlay.querySelector('.gs-gold-daily-visual');
    if (!step || !current) return false;
    const wasFocused = current === state.focusSubject;
    const scrollTop = state.overlay.scrollTop;
    state.motionRun += 1;
    stopNaturalAudio();
    const stepShell = state.overlay.querySelector('.gs-gold-daily-step');
    if (stepShell) stepShell.classList.remove('is-motion-finished');
    current.outerHTML = visualHtml(step);
    if (wasFocused) {
      const replacement = focusLayer() && focusLayer().querySelector('.gs-gold-daily-focus-stage > .gs-gold-daily-visual');
      if (!replacement) return false;
      replacement.classList.add('is-focus-subject');
      state.focusSubject = replacement;
      state.focusReturn = replacement.querySelector('[data-gd-action="expand-evidence"]') || state.focusReturn;
    }
    state.overlay.scrollTop = scrollTop;
    playEvidenceMotion(step, state.selectedIndex != null);
    return true;
  }

  function onClick(event) {
    const control = event.target.closest('[data-gd-action]');
    if (!control) return;
    const action = control.dataset.gdAction;
    if (action === 'browse-lessons') { if(state.practice){close();return;} state.daily = false; state.overlay.setAttribute('aria-label','Choose a lesson'); renderSelector(); return; }
    if (action === 'daily-start') { dailyStart(); return; }
    if (action === 'daily-practice') { dailyPractice(control.dataset.gdId); return; }
    if (action === 'daily-sharpen') { dailySharpen(control.dataset.gdId); return; }
    if (action === 'close') close();
    else if (action === 'list') renderSelector();
    else if (action === 'start') start(control.dataset.gdIndex, false);
    else if (action === 'start-next') start(control.dataset.gdIndex, true);
    else if (action === 'answer') answer(control.dataset.gdIndex);
    else if (action === 'next') next();
    else if (action === 'expand-evidence') openEvidenceFocus(control);
    else if (action === 'close-focus') closeEvidenceFocus(true);
    else if (action === 'replay-evidence') replayEvidence();
    else if (action === 'why') {
      const whyPanel = root.document.getElementById(control.getAttribute('aria-controls'));
      if (!whyPanel) return;
      const willOpen = control.getAttribute('aria-expanded') !== 'true';
      control.setAttribute('aria-expanded', String(willOpen));
      whyPanel.hidden = !willOpen;
      const symbol = control.querySelector('span');
      if (symbol) symbol.textContent = willOpen ? '−' : '+';
      if (willOpen) whyPanel.scrollIntoView({ behavior: root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
    }
    else if (action === 'restart') start(state.challengeIndex, false);
  }

  function resolveRequestedIndex(value) {
    if (!value || value === '1' || value === 'all') return -1;
    return challenges.findIndex(function (challenge) { return challenge.id === value || challenge.slug === value; });
  }

  function autoOpenFromQuery() {
    if (!root.document || !root.location) return;
    const params = new URLSearchParams(root.location.search || '');
    if (root.GS_GOLD_DAILY_MAIN && (!root.GameSharpMainDaily || !root.GS_GOLD_DAILY_CSS_READY)) return;
    if (!params.has('goldDaily')) return;
    if (params.get('goldDaily') === 'today') {
      installDailyReturns();
      const entry = root.document.querySelector('.gs-daily-pilot-entry');
      if (entry) { entry.href = '?goldDaily=today'; entry.textContent = 'Return to your Daily pilot →'; }
      openDaily(); return;
    }
    const requested = resolveRequestedIndex(params.get('goldDaily'));
    open();
    if (requested >= 0) start(requested, false);
  }

  if (root.document) {
    root.document.addEventListener('keydown', function (event) {
      if (!state.overlay || state.overlay.hidden) return;
      if (state.focusSubject) {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeEvidenceFocus(true);
          return;
        }
        trapFocus(event);
        return;
      }
      if (event.key === 'Escape') close();
    });
    if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', autoOpenFromQuery, { once: true });
    else root.setTimeout(autoOpenFromQuery, 0);
  }

  return Object.freeze({
    version: VERSION,
    returnEvidence: returnEvidence,
    requiredEvents: REQUIRED_EVENTS,
    challenges: challenges,
    audit: audit,
    auditCourtRead: auditCourtRead,
    runtimeAudit: runtimeAudit,
    open: open,
    openDaily: openDaily,
    openPractice: openPractice,
    isAvailable: isAvailable,
    preview: preview,
    autoOpenFromQuery: autoOpenFromQuery,
    close: close,
    start: start
  });
});
