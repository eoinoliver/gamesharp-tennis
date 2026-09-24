GAMESHARP QBANK EXTENSION — BATCH PROTOCOL
==========================================

HISTORICAL REFERENCE — NOT THE CURRENT GENERATION BRIEF (10 September 2026)

The Gold Daily lesson-spine direction and current AGENTS / PRODUCT / CONTENT /
RELEASE contracts supersede this old batch prompt. Do not resume question-bank
generation from its focus-player block or copy its exemplar claims as approved
content. Some examples retain unconditional advice, unsourced attributions and
legacy visual-fallback guidance that conflict with later decisions. They are
preserved as historical evidence, not current teaching or source verification.
See [the shared alignment record](../gamesharp-tennis-alignment/PROJECT_ALIGNMENT.md).

You are extending the existing GameSharp tennis decision-training QBANK.
This is not a trivia task. You are encoding tactical lessons a coach would teach.

═══════════════════════════════════════════════════
SCOPE OF THIS BATCH  ← only this block changes per session
═══════════════════════════════════════════════════
Focus player:    Andy Murray
Question count:  10                   (cap = 12 per session; smaller is fine)
Identity facets to cover (pick from this player's signatures, no more than 2 questions per facet):
  Andy Murray         → returning, defending-then-attacking, percentage decisions, court positioning, mental routine, problem solving
  Stan Wawrinka       → commitment, backhand aggression, big-point swing, single-handed timing, big-stage composure
  Juan Martin del Potro → building around a weapon, forehand redirection, return-to-attack, reset under physical strain
  Arthur Ashe         → composure, intelligence, varying spin/pace, energy management
  Margaret Court      → first-strike tennis, net coverage, finishing patterns
  Steffi Graf         → footwork, forehand patterns, slice backhand depth, change of direction
  Venus Williams      → first-strike tennis, serve +1, returner aggression, net pressure
  Serena Williams     → serve dominance, lock-in patterns, opening points, closing under pressure
  Jannik Sinner       → depth, tempo, neutral-to-attack timing, line-pushing patience
  Jessica Pegula      → adaptability, returning, point construction, percentage tennis
  Ben Shelton         → fearless aggression, serve weapon, lefty patterns, net rushing
  Casper Ruud         → patient construction, forehand depth, clay-court patterns
  Elina Svitolina     → resilience, comeback patterns, defense-to-offense
  Andy Roddick        → serve weapon, +1 patterns, body-serve targeting
  Gael Monfils        → defense, recovery, momentum control
  Martina Hingis      → anticipation, court geometry, doubles instincts
  Monica Seles        → first-strike returning, double-handed redirection
  Coco Gauff          → defense-to-offense, returning, comeback mindset
  Nick Kyrgios        → underarm serve, T serve at pressure, unpredictability

If you cannot write N strong questions, write fewer. Quantity is not a virtue.

═══════════════════════════════════════════════════
THE GOLDEN FORMULA  (every question has all six)
═══════════════════════════════════════════════════
1. SITUATION    — a real, plausible match scenario with score/intent
2. DECISION     — four plausible answers (no joke options)
3. WHY          — the teachable rationale for the correct call  → why_right
4. PRO LENS     — a documented tactical tendency of the focus player → pro_insight
5. ACTION TIP   — one sentence the user can apply tomorrow → action_tip
6. THE TRAP     — the common pitfall this question exists to prevent → common_pitfall

═══════════════════════════════════════════════════
SCHEMA & TONE EXEMPLARS  (replicate field order, tone, and length exactly)
═══════════════════════════════════════════════════
[
  {
    "id": "Q001",
    "pillar": "Win More",
    "module": "Beat Opponent Types",
    "difficulty": "Club",
    "format": "Scenario",
    "hook_type": "Win More Matches",
    "question": "Opponent hits extreme topspin moonballs every rally — the ball sits up to shoulder height. Best adjustment?",
    "option_a": "Step inside baseline and take the ball earlier",
    "option_b": "Slice every shot short",
    "option_c": "Hit winners from shoulder height every ball",
    "option_d": "Stay back and let it drop to hip height before swinging",
    "correct_answer": "A",
    "why_right": "A moonballer wants you behind the baseline where the ball bounces above your strike zone. Step inside to intercept it before it climbs — this keeps the ball at waist height and takes time away from them. The condition matters: step in when the ball sits up short or mid-court so you can take it early — if a heavy ball is genuinely pinning you deep above shoulder height, give ground and reset with height and margin instead of forcing the early ball.",
    "pro_insight": "Novak Djokovic's coaches have described training specifically to reverse his instinct to retreat against high-bouncing balls. His first instinct as a junior was to back up. The work required was not technical — it was habitual. Marian Vajda, who coached Djokovic for over a decade, described the underlying logic that drove their approach: the moonball is a tactical weapon, not just a stroke. It creates its own pressure by making the receiver believe they need more time. Stepping inside denies it that time entirely.",
    "common_pitfall": "Backing up to let the ball drop — it only gets higher and more awkward.",
    "action_tip": "Step one metre inside the baseline on moonballs and take them early at waist height, aiming deep crosscourt.",
    "tags": "pusher, moonball, court-position, timing",
    "audience": "Club Player",
    "skill_target": "Court positioning",
    "engagement_score": 4,
    "utility_score": 5,
    "viral_score": 3,
    "tier": "Free",
    "share_prompt": "Can you beat a moonballer without losing patience?",
    "visual": "court_moonball_response",
    "techAnim": "moonball_counter",
    "player_type_def": "moonballer",
    "techAnimParams": { "position": "step_in" },
    "visualParams":   { "position": "step_in" }
  },
  {
    "id": "Q002",
    "pillar": "Win More",
    "module": "Beat Opponent Types",
    "difficulty": "Club",
    "format": "MCQ",
    "hook_type": "Smart Tactics",
    "question": "A heavy topspin player keeps pinning you deep with high-kicking balls. What is the most common mental error this triggers?",
    "option_a": "Rushing the shot to end the point before you are ready",
    "option_b": "Moving too close to the net to intercept early",
    "option_c": "Adding more topspin to match their pace",
    "option_d": "Serving more conservatively to start safer rallies",
    "correct_answer": "A",
    "why_right": "Heavy, high-kicking balls create time pressure that pushes players to swing too early before the ball drops to a comfortable height. Patience — staying back and letting the ball descend — is the correct adjustment, but impatience is the default error.",
    "pro_insight": "Tennis coaches have long noted that pushers exploit a specific psychological weakness in big hitters: the belief that every ball demands an aggressive response. Gilles Simon built a career on this — his best tennis invited opponents to beat themselves. The pusher doesn't need to win points. They need you to lose them.",
    "common_pitfall": "Trying to attack the ball at shoulder height before it drops to waist height.",
    "action_tip": "Against heavy topspin: move back, wait for the ball to drop, then swing. Never rush.",
    "tags": "pusher, patience, error-management",
    "audience": "Club Player",
    "skill_target": "Rally discipline",
    "engagement_score": 4,
    "utility_score": 5,
    "viral_score": 3,
    "tier": "Free",
    "share_prompt": "Why do good hitters lose to pushers?",
    "visual": null,
    "techAnim": null,
    "player_type_def": "pusher"
  },
  {
    "id": "Q021",
    "pillar": "Mental",
    "module": "Return of Serve",
    "difficulty": "Competitor",
    "format": "Scenario",
    "hook_type": "Apply Pressure",
    "question": "Server fears double faults. Best return tactic?",
    "option_a": "Use a compact block return to reduce risk on second serves",
    "option_b": "Stand in normal position and rely on good return technique",
    "option_c": "Move slightly back to give the second serve room to develop",
    "option_d": "Step in visibly on second serve",
    "correct_answer": "D",
    "why_right": "Your position alone can create doubt.",
    "pro_insight": "Novak Djokovic walks forward as the server bounces the ball on second serves. He starts moving before the toss. Former coach Boris Becker described watching opponents see this and said: 'You can actually see them tighten. Novak hasn't hit anything yet and already the server is playing Djokovic's game, not their own.' The pressure is architectural — it's built into where he stands.",
    "common_pitfall": "Being dangerous only after contact, not before.",
    "action_tip": "Step in with calm intent; make the server feel the consequence.",
    "tags": "return, psychology, second-serve-pressure",
    "audience": "Competitor",
    "skill_target": "Pre-contact pressure",
    "engagement_score": 5,
    "utility_score": 4,
    "viral_score": 4,
    "tier": "Pro",
    "share_prompt": "Pressure starts before the ball is hit.",
    "visual": "court_return_pos",
    "techAnim": "court_return_pos",
    "techAnimParams": { "depth": "step_in" },
    "visualParams":   { "depth": "step_in" }
  },
  {
    "id": "Q025",
    "pillar": "Game IQ",
    "module": "Reading the Game",
    "difficulty": "Club",
    "format": "MCQ",
    "hook_type": "Smart Aggression",
    "question": "What separates smart aggression from reckless aggression?",
    "option_a": "Choosing the biggest margin shot available from any position",
    "option_b": "Generating more racket head speed to create a more powerful strike",
    "option_c": "Attacking before the opponent has a chance to set their feet",
    "option_d": "Attacking the right ball from the right position",
    "correct_answer": "D",
    "why_right": "Aggression should be chosen, not emotional.",
    "pro_insight": "Carlos Alcaraz was asked in a post-match interview to explain the difference between his early career recklessness and his current game. He said: 'Before, I attacked when I wanted to. Now I attack when the ball tells me to. The ball short, inside the service line, my weight moving forward — that is not aggression. That is just tennis.' His unforced error rate dropped 28% between 2021 and 2022. Same aggression. Better timing.",
    "common_pitfall": "Mistaking ambition for timing.",
    "action_tip": "Ask: am I balanced, inside the court, and aiming at a big enough target?",
    "tags": "aggression, decision-making, shot-selection",
    "audience": "Club Player",
    "skill_target": "Shot selection",
    "engagement_score": 4,
    "utility_score": 4,
    "viral_score": 3,
    "tier": "Free",
    "share_prompt": "Are you attacking, or just venting with a racket?",
    "visual": null,
    "techAnim": null
  },
  {
    "id": "Q028",
    "pillar": "Mental",
    "module": "Pressure Points",
    "difficulty": "Club",
    "format": "MCQ",
    "hook_type": "Protecting a Lead",
    "question": "Up a break late in the set. Biggest danger?",
    "option_a": "Tightening your targets to avoid gifting the break back",
    "option_b": "Becoming passive and waiting for errors",
    "option_c": "Attacking the net more aggressively to end points quickly",
    "option_d": "Slowing down between points to stay in control",
    "correct_answer": "B",
    "why_right": "Leads are often lost through cautious passivity, not bold mistakes.",
    "pro_insight": "Rafael Nadal is famous for continuing disciplined aggression with leads.",
    "common_pitfall": "Playing \"don't lose\" tennis.",
    "action_tip": "Keep using the pattern that earned the lead, with sensible margin.",
    "tags": "closing, lead, passivity, pressure",
    "audience": "Club Player",
    "skill_target": "Lead management",
    "engagement_score": 4,
    "utility_score": 4,
    "viral_score": 3,
    "tier": "Free",
    "share_prompt": "Do you play to win or play not to lose?",
    "visual": "court_pressure_score",
    "techAnim": "court_pressure_score",
    "techAnimParams": { "score": "0530" },
    "visualParams":   { "score": "0530" }
  },
  {
    "id": "Q031",
    "pillar": "Game IQ",
    "module": "Rally Tactics",
    "difficulty": "Club",
    "format": "Scenario",
    "hook_type": "Big Point Target",
    "question": "At 30-all in a rally, safest aggressive target?",
    "option_a": "Down the line to the backhand to change direction and create pressure",
    "option_b": "Deep crosscourt to larger target",
    "option_c": "Short angle crosscourt to pull them wide and open the court",
    "option_d": "Hard flat through the middle to limit their angle",
    "correct_answer": "B",
    "why_right": "Crosscourt gives more net clearance and court length while still applying pressure.",
    "pro_insight": "Djokovic's game at neutral pressure points is built around reliability, not adventure. His coach Boris Becker observed this consistently during their time together: Djokovic's shot selection became more conservative — not less — as match pressure rose. 'Thirty-all is not the time to manufacture something,' Becker said. 'It is the time to do what already works with more certainty.'",
    "common_pitfall": "Choosing highlight-reel shots on ordinary pressure points.",
    "action_tip": "Aim deep crosscourt to the weaker wing with height and margin.",
    "tags": "pressure, crosscourt, percentage, target",
    "audience": "Club Player",
    "skill_target": "Shot selection",
    "engagement_score": 4,
    "utility_score": 4,
    "viral_score": 3,
    "tier": "Free",
    "share_prompt": "Can a safe target still be aggressive?",
    "visual": "court_rally_pattern",
    "techAnim": "court_rally_pattern",
    "techAnimParams": { "pattern": "crosscourt" },
    "visualParams":   { "pattern": "crosscourt" }
  },
  {
    "id": "Q101",
    "pillar": "Technique",
    "module": "Forehand",
    "difficulty": "Club",
    "format": "Scenario",
    "hook_type": "Technique",
    "question": "Why does topspin make the forehand safer?",
    "option_a": "It removes the need for footwork",
    "option_b": "It makes the ball travel slower every time",
    "option_c": "The ball dips down into court with margin",
    "option_d": "It guarantees a high bounce winner",
    "correct_answer": "C",
    "why_right": "Topspin lets you swing aggressively while increasing the chance the ball lands in.",
    "pro_insight": "Rafael Nadal used extreme topspin to combine safety with brutal bounce.",
    "common_pitfall": "Trying flat rockets from defensive positions.",
    "action_tip": "Use more net clearance when under pressure.",
    "tags": "forehand, topspin, margin",
    "audience": "Club Player",
    "skill_target": "Technique execution",
    "engagement_score": 4,
    "utility_score": 5,
    "viral_score": 3,
    "tier": "Free",
    "share_prompt": "",
    "visual": "ball_trajectory",
    "techAnim": "ball_trajectory",
    "techAnimParams": { "type": "topspin" },
    "visualParams":   { "type": "topspin" }
  },
  {
    "id": "Q241",
    "pillar": "Technique",
    "module": "Equipment & Physics",
    "difficulty": "Competitor",
    "format": "Scenario",
    "hook_type": "Science",
    "question": "Why does topspin make the ball dip?",
    "option_a": "Topspin stops gravity working",
    "option_b": "The ball becomes physically heavier",
    "option_c": "The net attracts the ball",
    "option_d": "Spin creates aerodynamic force that helps pull the ball downward",
    "correct_answer": "D",
    "why_right": "Topspin changes airflow and makes the ball drop faster.",
    "pro_insight": "Nadal's balls cleared the net high then dived into court.",
    "common_pitfall": "Thinking topspin is only about bounce.",
    "action_tip": "Use topspin for flight and bounce.",
    "tags": "science, topspin",
    "audience": "Competitor",
    "skill_target": "Equipment/science",
    "engagement_score": 5,
    "utility_score": 3,
    "viral_score": 4,
    "tier": "Pro",
    "share_prompt": "",
    "visual": "ball_bounce_height",
    "techAnim": "ball_trajectory",
    "techAnimParams": { "type": "topspin" },
    "visualParams":   { "types": ["flat","topspin"] }
  },
  {
    "id": "Q322",
    "pillar": "Win More",
    "module": "Beat Opponent Types",
    "difficulty": "Competitor",
    "format": "Scenario",
    "hook_type": "Tactical Edge",
    "question": "Your opponent reads your patterns well and adjusts after every set. How do you stay ahead?",
    "option_a": "Keep the same patterns — consistency beats variety",
    "option_b": "Serve and stay back on every point",
    "option_c": "Stay one adjustment ahead: if they are reading your crosscourt, load up down the line next set",
    "option_d": "Ask them what they are seeing in your game",
    "correct_answer": "C",
    "why_right": "Against a tactically aware opponent, patterns must evolve across sets. If they have identified your crosscourt tendency and started covering it, the down-the-line becomes available. The adjustment cycle — establish pattern, recognise their counter, adjust — is the core of competitive tactical tennis.",
    "pro_insight": "Novak Djokovic's tactical adaptations across sets against Roger Federer were studied by analysts. Djokovic would establish a pattern in set one, notice Federer adjusting in set two, and counter-adjust in set three.",
    "common_pitfall": "Committing to the same patterns even when the opponent has clearly read them.",
    "action_tip": "Track what your opponent is adjusting to and plan your counter-adjustment for the next set.",
    "tags": "tactics, adjustment, adaptation",
    "audience": "Competitor",
    "skill_target": "Match strategy",
    "engagement_score": 5,
    "utility_score": 5,
    "viral_score": 4,
    "tier": "Pro",
    "share_prompt": "Can you stay one step ahead of a tactical opponent?",
    "visual": null,
    "techAnim": null
  },
  {
    "id": "Q420",
    "pillar": "Win More",
    "module": "Rally Tactics",
    "difficulty": "Tactician",
    "format": "Scenario",
    "question": "Your opponent is a very consistent baseliner who never misses but never attacks. You are both locked in long crosscourt rallies. What is the correct tactical shift to win the pattern?",
    "option_a": "Keep rallying until they eventually make an error",
    "option_b": "Move them side-to-side with direction changes until you create a short ball, then attack",
    "option_c": "Come to the net behind every ball",
    "option_d": "Hit harder to force errors",
    "correct_answer": "B",
    "why_right": "Against consistent baseliners, the pattern must be broken by creating movement. Direction changes — hitting crosscourt then switching down the line, or hitting wide then coming back through the middle — force the baseliner to run and eventually produce a shorter reply that can be attacked.",
    "pro_insight": "Analysis of matches against high-percentage baseliners shows that players who win consistently do so by systematically building the point to create court space, not by outlasting the baseliner in the same rally pattern or by hitting harder.",
    "common_pitfall": "Hitting harder and harder against a consistent baseliner and producing more of your own errors.",
    "action_tip": "Against a consistent baseliner: change direction every 3–4 balls. Create the short ball with movement, not pace.",
    "tags": "baseliner, rally, direction-change, tactician",
    "audience": "Advanced Club Player",
    "skill_target": "Rally patterns",
    "engagement_score": 5,
    "utility_score": 5,
    "viral_score": 4,
    "tier": "Pro"
  }
]

Tone rules drawn from these exemplars:
• Direct coach voice. No academic register.
• why_right opens with the rationale, not a recap of the question.
• pro_insight is one short paragraph anchored in a documented tactical tendency.
• action_tip is one declarative sentence, usable at the next match.
• tags are lowercase, comma-separated, from the closed vocabulary below.

═══════════════════════════════════════════════════
ANTI-FABRICATION  (non-negotiable)
═══════════════════════════════════════════════════
pro_insight describes documented tactical tendencies. NEVER fabricate:
• a quote attributed to a specific person
• a year
• a match score
• a specific match outcome
• a coaching attribution

ALLOWED:    "Murray's pattern under pressure was to neutralise with depth before changing direction."
FORBIDDEN:  "Murray said in 2016 that..." or "In the 2012 US Open final..."

If you can't anchor the Pro Lens in known tendency, change the question.

═══════════════════════════════════════════════════
ANTI-DUPLICATION  (run BEFORE writing each question)
═══════════════════════════════════════════════════
For each question, FIRST declare in the manifest the tuple you intend to teach:
   (pillar, module, skill_target, core_concept_in_5–8_words)

Compare against this existing tuple index (count of existing questions in brackets):

Game IQ      | Beat Opponent Types     | Match preparation            (3)
Game IQ      | Beat Opponent Types     | Match strategy               (20)
Game IQ      | Equipment & Physics     | Match preparation            (1)
Game IQ      | Match Preparation       | Match preparation            (5)
Game IQ      | Match Preparation       | Mental control               (3)
Game IQ      | Net Play                | Match strategy               (1)
Game IQ      | Pressure Points         | Controlled aggression        (1)
Game IQ      | Pressure Points         | Match strategy               (10)
Game IQ      | Pressure Points         | Rules                        (1)
Game IQ      | Pressure Points         | Score planning               (1)
Game IQ      | Rally Tactics           | Match strategy               (17)
Game IQ      | Rally Tactics           | Shot selection               (1)
Game IQ      | Reading the Game        | Match preparation            (2)
Game IQ      | Reading the Game        | Mental control               (1)
Game IQ      | Reading the Game        | Pattern recognition          (2)
Game IQ      | Reading the Game        | Shot selection               (1)
Game IQ      | Return of Serve         | Serve reading                (1)
Game IQ      | Rules & Scoring         | Rules                        (17)
Game IQ      | Rules & Scoring         | Score awareness              (1)
Game IQ      | Serve Strategy          | Match strategy               (2)
Mental       | Between-Point Routine   | Attention control            (1)
Mental       | Between-Point Routine   | Between-point reset          (1)
Mental       | Between-Point Routine   | Focus & reset                (2)
Mental       | Between-Point Routine   | Mental control               (1)
Mental       | Between-Point Routine   | Pressure routine             (1)
Mental       | Competing Up a Level    | Match strategy               (5)
Mental       | Competing Up a Level    | Mental control               (1)
Mental       | Competing Up a Level    | Physical management          (1)
Mental       | Competing Up a Level    | Player development           (8)
Mental       | Match Mindset           | Bounce-back                  (1)
Mental       | Match Mindset           | Comeback mindset             (1)
Mental       | Match Mindset           | Decision discipline          (1)
Mental       | Match Mindset           | Emotional presence           (1)
Mental       | Match Mindset           | Emotional reset              (1)
Mental       | Match Mindset           | Mental control               (15)
Mental       | Match Mindset           | Pressure management          (3)
Mental       | Match Preparation       | Match preparation            (6)
Mental       | Modern Tennis Debates   | Player development           (1)
Mental       | Practice & Development  | Player development           (16)
Mental       | Practice & Development  | Practice structure           (7)
Mental       | Pressure Points         | Focus control                (1)
Mental       | Pressure Points         | Lead management              (1)
Mental       | Pressure Points         | Mental control               (1)
Mental       | Pressure Points         | Process focus                (1)
Mental       | Pressure Points         | Recovery after setback       (1)
Mental       | Reading the Game        | Player development           (1)
Mental       | Return of Serve         | Pre-contact pressure         (1)
Technique    | Backhand                | Backhand mechanics           (1)
Technique    | Backhand                | Technique execution          (15)
Technique    | Between-Point Routine   | Physical management          (1)
Technique    | Between-Point Routine   | Technique execution          (1)
Technique    | Equipment & Physics     | Equipment/science            (8)
Technique    | Forehand                | Forehand mechanics           (1)
Technique    | Forehand                | Technique execution          (20)
Technique    | Movement & Footwork     | Movement & footwork          (4)
Technique    | Movement & Footwork     | Physical management          (4)
Technique    | Movement & Footwork     | Technique execution          (10)
Technique    | Net Play                | Technique execution          (5)
Technique    | Net Play                | Volley & net                 (1)
Technique    | Physical Preparation    | Equipment/science            (2)
Technique    | Physical Preparation    | Match preparation            (4)
Technique    | Physical Preparation    | Physical management          (10)
Technique    | Serve Mechanics         | Relaxed execution            (1)
Technique    | Serve Mechanics         | Return timing                (1)
Technique    | Serve Mechanics         | Second serve commitment      (1)
Technique    | Serve Mechanics         | Serve mechanics              (2)
The Debate   | Modern Tennis Debates   | Tennis literacy              (13)
The Debate   | Tennis History & GOATs  | Tennis literacy              (12)
Win More     | Beat Opponent Types     | Approach selection           (1)
Win More     | Beat Opponent Types     | Court positioning            (1)
Win More     | Beat Opponent Types     | Creating space               (1)
Win More     | Beat Opponent Types     | Error reduction              (1)
Win More     | Beat Opponent Types     | Match strategy               (19)
Win More     | Beat Opponent Types     | Mental control               (1)
Win More     | Beat Opponent Types     | Patience with intent         (1)
Win More     | Beat Opponent Types     | Pressure decision-making     (1)
Win More     | Beat Opponent Types     | Rally discipline             (1)
Win More     | Beat Opponent Types     | Rhythm disruption            (1)
Win More     | Beat Opponent Types     | Tiebreak discipline          (1)
Win More     | Court Conditions        | Conditions adaptation        (3)
Win More     | Doubles                 | Doubles communication        (1)
Win More     | Doubles                 | Doubles decision-making      (15)
Win More     | Doubles                 | Doubles positioning          (2)
Win More     | Movement & Footwork     | Doubles decision-making      (1)
Win More     | Net Play                | Doubles decision-making      (2)
Win More     | Net Play                | Net approach                 (2)
Win More     | Playing Conditions      | Conditions adaptation        (13)
Win More     | Pressure Points         | Closing tiebreaks            (1)
Win More     | Pressure Points         | Doubles decision-making      (1)
Win More     | Pressure Points         | Lead management              (1)
Win More     | Pressure Points         | Pattern clarity              (1)
Win More     | Pressure Points         | Return under pressure        (1)
Win More     | Pressure Points         | Score awareness              (1)
Win More     | Pressure Points         | Serve selection              (2)
Win More     | Pressure Points         | Tiebreak start               (1)
Win More     | Rally Tactics           | Point construction           (2)
Win More     | Rally Tactics           | Rally patterns               (3)
Win More     | Rally Tactics           | Territory use                (1)
Win More     | Return of Serve         | Backhand return control      (1)
Win More     | Return of Serve         | Controlled aggression        (1)
Win More     | Return of Serve         | Doubles decision-making      (4)
Win More     | Return of Serve         | Neutralising pace            (1)
Win More     | Return of Serve         | Return awareness             (1)
Win More     | Return of Serve         | Return of serve              (2)
Win More     | Return of Serve         | Return positioning           (1)
Win More     | Return of Serve         | Return resilience            (1)
Win More     | Return of Serve         | Return spacing               (1)
Win More     | Return of Serve         | Second serve pressure        (1)
Win More     | Return of Serve         | Serve strategy               (1)
Win More     | Return of Serve         | Taking time away             (1)
Win More     | Serve Strategy          | Doubles decision-making      (2)
Win More     | Serve Strategy          | Pressure serving             (1)
Win More     | Serve Strategy          | Second serve strategy        (2)
Win More     | Serve Strategy          | Serve +1 patterns            (1)
Win More     | Serve Strategy          | Serve adaptation             (1)
Win More     | Serve Strategy          | Serve patterning             (1)
Win More     | Serve Strategy          | Serve strategy               (25)

Rules:
• If your tuple already exists, your specific concept must add new value vs the N existing entries.
• Tuples already at ≥15 questions are saturated — prefer a different tuple.
• Subtle re-skins of an existing concept count as duplicates.

═══════════════════════════════════════════════════
PLAYER IDENTITY DIVERSIFICATION
═══════════════════════════════════════════════════
Within this batch, each question must cover a DIFFERENT facet from the focus player's
signatures listed in SCOPE. No more than 2 questions per facet in a single batch.
Match the player's identity, not the global pillar split — e.g. Murray skews
Game IQ + Mental + Return-game heavier than Win More baseline.

═══════════════════════════════════════════════════
DISTRIBUTIONS  (match the QBANK within ±3% across this batch)
═══════════════════════════════════════════════════
Pillar split:
  Win More       31.4%
  Technique      21.9%
  Game IQ        21.6%
  Mental         19.2%
  The Debate      5.9%

Difficulty split:
  Club           67.0%
  Competitor     16.9%
  Rookie          9.0%
  Tactician       7.1%

Audience split:
  Club Player            66.5%
  Competitor             17.3%
  Beginner                9.0%
  Fan                     5.9%
  Advanced Club Player    1.2%

Format split:
  Scenario       68.4%
  MCQ            28.0%
  Debate          3.6%

Tier split:
  Free           92.4%
  Pro             7.6%

"Elite" means elite QUALITY, not Tour-only scenarios. Most questions are Club-level
players in realistic situations.

═══════════════════════════════════════════════════
FIELD CONSTRAINTS
═══════════════════════════════════════════════════
• pillar              "Win More" | "Technique" | "Game IQ" | "Mental" | "The Debate"
• module              reuse an existing module from the tuple index above. Only propose
                      a new module name if no existing module truly fits.
• difficulty          "Rookie" | "Club" | "Competitor" | "Tactician"
• audience            "Beginner" | "Club Player" | "Competitor" | "Advanced Club Player" | "Fan"
• format              "MCQ" | "Scenario" | "Debate"
• correct_answer      "A" | "B" | "C" | "D"
• option_a/b/c/d      four plausible. Every wrong option is a credible mistake at the
                      audience's level — never a joke, never an obvious throwaway.
• skill_target        short noun phrase. Reuse an existing value where appropriate.
• engagement_score    integer 1–5, calibrated against exemplars
• utility_score       integer 1–5
• viral_score         integer 1–5
• tier                "Free" | "Pro"
• tags                comma-separated, lowercase, from the closed vocabulary below.
                      Do not invent new tags.

═══════════════════════════════════════════════════
TAG VOCABULARY  (closed set — do not invent)
═══════════════════════════════════════════════════
access, ad-court, adaptation, adjustment, advantage, aesthetics, aggression, alcaraz,
alignment, all-court, altitude, analysis, analytics, anger, angles, anticipation,
anxiety, approach, approach-shot, attack, attack-threshold, australian-formation,
awareness, backhand, bad-day, balance, ball-behaviour, ball-machine, balls, baseline,
baseliner, basic, basics, best-of-five, big-hitter, big-server, blocked,
blocked-practice, body, body-language, body-serve, bounce, break, break-point,
break-points, breath, breathing, calm, changeover, cheat-position, chip-return,
choking, clay, clay-to-hard, closing, club, club-tennis, clutch, coaching,
code-violation, coin-toss, comeback, comebacks, communication, compact-swing,
competition, competitive-drills, conditions, confidence, consistency, constraints,
contact, contact-height, contact-point, cool-down, correction, counterpuncher, court,
court-geometry, court-position, cramp, crosscourt, crossover, cue, debate, decision,
decision-making, defense, defensive, defensive-baseliner, deliberate, depth, deuce,
development, direction-change, disguise, distance, djokovic, dominant-wing,
double-fault, doubles, drill-design, drop-shot, dynamic-movement, efficiency, emotion,
endurance, equipment, error, error-management, errors, execution, experience,
fake-poach, fast-court, fatigue, federer, feedback, feet, final-set, finish,
first-ball, first-point, first-serve, first-step, fitness, flat-hitter, focus,
foot-fault, footwork, forehand, formation, game-iq, game-plan, geometry, goals, grass,
great-matches, growth, half-volley, har-tru, heat, height, high-ball, hindrance,
history, hot-streak, humidity, hydration, impatient, improvement,
in-match-adjustment, indoor, injury, inside-out, kick, kinetic-chain, knock-up,
kyrgios, lead, leading, learning, lefty, legacy, let, level, line-call, lob,
lob-return, long, low-ball, low-return, management, margin, match, match-iq,
match-point, match-review, mechanics, medical-timeout, mental, mental-game, mid-match,
middle, mindset, mini-break, miss, momentum, moonball, movement, nadal, nerves, net,
net-play, net-player, net-position, net-rusher, net-touch, neutral, next-point, night,
nutrition, on-the-run, one-handed, open-court, opponent, out-calls, over-the-net,
overhead, pace, partner, passivity, patience, pattern, pattern-recognition, patterns,
percentage, physical, placement, planning, playing-up, poach, point-construction,
position, positioning, power, practice, pre-match, preparation, pressure, process,
professional, psychology, pusher, quality, racket, racket-abuse, rally,
rally-tolerance, random, readiness, recovery, redirect, reset, resilience, retriever,
return, returner, revenge, rhythm-change, rivalries, rookie, routine, rules, safety,
scheduling, science, score, score-awareness, scoreboard, scoring, scouting,
second-serve, second-serve-pressure, self-officiated, senior, sequencing, serve,
serve-and-volley, serve-order, serve-pattern, serve-plus-one, serve-read,
serve-reading, serve-rotation, serve-volley, service-order, session-design, set,
set-point, sets, short-ball, shot-selection, signals, simplicity, skill-development,
sleep, slice, slice-serve, sliding, slow-court, slow-start, social-media,
solo-practice, spacing, spin, spin-direction, split-step, stability, stamina, stance,
streaky, strength, strings, structure, sun, surface, swing-path, t-serve, tactical,
tactician, tactics, target, targeting, targets, technique, tempo, tennis-math,
tension, tiebreak, time-management, time-pressure, timing, topspin, toss, transfer,
transition, two-handed, two-handed-backhand, uncertainty, underdog, unit-turn,
variation, video, visual, visual-tracking, volley, warm-up, weakness, weaknesses,
weapon, wet, wide, wimbledon, wind, wta

═══════════════════════════════════════════════════
ANIMATION METADATA  (accuracy gate — only include when verifiable)
═══════════════════════════════════════════════════
The app's animation engine renders a correct on-court visual ONLY when the question
carries verified geometry. If you can verify it, include techAnim, visual, and
techAnimParams. If you cannot, OMIT them — the engine degrades gracefully to a text
consequence card, which is the correct fallback. NEVER guess geometry.

Valid animation keys and their required techAnimParams shape:

  court_serve_zones           -> { side: "deuce"|"ad", target?: "wide"|"t"|"body" }
  court_wide_serve_open       -> { side: "deuce"|"ad" }
  court_body_serve_jam        -> { side: "deuce"|"ad" }  or  { direction: "left"|"right" }
  court_rally_pattern         -> { pattern: "crosscourt"|"dtl"|"inside_out"|"angle" }
                                  or { direction: "crosscourt"|"dtl"|... }
  court_return_pos            -> { depth: "step_in"|"back"|"neutral" }
  court_doubles_formation     -> { formation: "i_formation"|"australian"|"standard"|... }
  court_pressure_score        -> { score: "0530"|"4030"|"3040"|... }
  court_tiebreak_order        -> { score: "..." }
  court_geometry_cc_dtl       -> { pattern: "crosscourt"|"dtl" }
  court_lob_vs_pass           -> { net_player_pos: "left"|"right"|"middle" }
  court_moonball_response     -> { position: "step_in"|"back" }
  court_net_approach          -> { approach_side: "left"|"right"|"middle" }
  court_short_ball_attack     -> { approach_side: "left"|"right"|"middle" }
  short_ball_attack           -> { approach_side: "left"|"right"|"middle" }
  moonball_counter            -> { position: "step_in"|"back" }
  passing_shot                -> { net_player_pos: "left"|"right"|"middle" }
  ball_trajectory             -> { type: "topspin"|"slice"|"flat" }
  ball_bounce_height          -> { types: ["topspin","flat",...] }
  swing_path                  -> { shot: "forehand"|"backhand"|"serve"|... }
  footwork_split_step         -> { direction: "forward"|"back"|"side" }
  contact_zone                -> { height: "high"|"waist"|"low", shot: "forehand"|"backhand"|... }
  t_serve_plus_one            -> { side: "deuce"|"ad" }
  wide_serve_plus_one         -> { side: "deuce"|"ad" }
  body_serve_plus_one         -> { side: "deuce"|"ad" }

Caveat: only court_serve_zones has been verified through the accuracy audit (it
correctly mirrors deuce/ad and only draws the serve arc to the verified target).
The other serve animations (court_wide_serve_open, court_body_serve_jam, and the
_plus_one variants) currently render on the deuce side regardless of the `side`
param. For ad-court serve targeting, prefer court_serve_zones with
{side:"ad", target:"wide"|"t"|"body"}.

═══════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════
Output each question as a SINGLE JSON object inside its own fenced block:

```json
{ "id": "Qxxx", "pillar": "...", ... }
```

One block per question. No commentary between blocks. Match the field order of the
exemplars exactly. Plain straight quotes only — no smart quotes.

After the N question blocks, append ONE manifest block:

```json
{
  "batch_player": "Andy Murray",
  "count": 10,
  "tuples_used": [
    "(pillar, module, skill_target, core_concept_in_5–8_words)",
    "..."
  ],
  "facets_covered": [
    "returning", "defending-then-attacking", "..."
  ]
}
```

═══════════════════════════════════════════════════
SELF-CHECK BEFORE SUBMITTING  (in order)
═══════════════════════════════════════════════════
1. Re-read every option_a–d. Any joke / throwaway? Fix.
2. Re-read every pro_insight. Any fabricated quote / year / score / match
   attribution? Cut or change.
3. Compare manifest tuples_used against the tuple index above. Any overlap in
   concept (not just keyword)? Replace.
4. Confirm each question has all six Golden Formula fields populated:
   question, option_a–d + correct_answer, why_right, pro_insight,
   common_pitfall, action_tip.
5. Confirm every JSON object parses (no trailing commas, no smart quotes,
   no unescaped quotes inside strings).
6. Confirm distributions across this batch fall within ±3% of the targets above.
7. Confirm no more than 2 questions cover the same player facet.
8. Confirm every tag used appears in the closed vocabulary.
9. Confirm every techAnim/visual key used appears in the animation table, and
   every techAnimParams matches the required shape for that key.

═══════════════════════════════════════════════════
OUT OF SCOPE  (do not produce)
═══════════════════════════════════════════════════
• Trivia, historical facts, ranking questions
• "What year did X happen" / "How many slams"
• Questions whose correct answer is "It depends"
• Multi-correct questions
• Questions referencing real matches with specific scores
• Questions whose Pro Lens depends on a fabricated quote

───────────────────────────────────────────────────
AUDIT PASS  (run after each batch, in a FRESH session)
───────────────────────────────────────────────────
Paste only: the new question blocks + the tuple index above + this prompt:

  "Flag every overlap with the existing tuple index, every fabricated
   quote / year / score / match attribution, every implausible option,
   every smart-quote or JSON syntax issue, and every techAnimParams shape
   that doesn't match its key. Return a list with question IDs, not rewrites."
