const LESSON={
 "title": "Serve Away From the Lean",
 "hook": "The returner leans to cover one serve. The lean tells you where to serve.",
 "memHTML": "Read the lean. <span>Serve away from it.</span>",
 "tomorrow": "Next time you serve, glance at where the returner is standing before you toss.",
 "pro": {
  "player": "ATP second serves",
  "label": "Serving to the forehand corner",
  "moment": "ATP players win 51 per cent of second-serve points served to the forehand corner and 49 per cent to the backhand corner. On the deuce side, well-placed second serves to the forehand corner win 8.5 per cent more points than well-placed serves to the backhand.",
  "read": "The corner they protect isn't always the one to serve at.",
  "src": "ATP Tour, Golden Set Analytics for Tennis Data Innovations (Dec 2022)",
  "url": "https://www.atptour.com/en/news/players-find-success-serving-to-forehand"
 },
 "drill": {
  "name": "Serve away from the lean",
  "how": "The returner takes a clear lean before each serve, wide or toward the T. Serve away from it. Score a point for every return they only block or don't reach; then let them lean late and see if you still read it."
 },
 "cue": "Read the lean. Serve away from it.",
 "callbackTags": [
  "serve_placement"
 ],
 "finaleScene": "le1A",
 "cam0": {
  "c": {
   "az": 90,
   "el": 22,
   "d": 30,
   "fov": 36,
   "tgt": [
    0,
    1.5,
    0.3
   ]
  },
  "phone": {
   "az": 90,
   "el": 24,
   "d": 40,
   "fov": 24,
   "tgt": [
    0,
    1.8,
    0.3
   ]
  }
 },
 "steps": [
  {
   "ph": "See · Read the lean",
   "short": "See",
   "name": "They lean toward the T",
   "scene": "le1",
   "sit": "First serve from the deuce side. The returner has moved toward the T to protect their backhand.",
   "q": "Which first serve makes their return hardest?",
   "opts": [
    "Fast, out wide",
    "Fast, down the T",
    "Fast, at their body",
    "Slower, at their body"
   ],
   "correct": 0,
   "payoff": "Leaning toward the T leaves the wide serve too far away.",
   "principle": "Where they lean is where they're ready. Serve to the side they left.",
   "why": "They read your serve a quarter of a second after you hit it, then have to get beside the ball. Out wide is the furthest from where they're leaning, and they can't get there.",
   "rail": [
    "1 They lean",
    "2 Toward the T",
    "3 Your serve"
   ],
   "cues": {
    "ball": "FIRST SERVE",
    "you": "SERVER",
    "opp": "LEANS TO THE T"
   },
   "unlock": "Read the lean",
   "take": "Returner leaning one way? Serve the other.",
   "lines": {
    "A": "Right: they're leaning toward the T, and wide is out of reach. An ace.",
    "B": "Down the T is where they're leaning: they're in time.",
    "C": "At the body they just step aside: set, they attack, and you're stretched.",
    "D": "Slower at the body gives them even longer: they attack, and you're stretched."
   }
  },
  {
   "ph": "Contrast · They adjust",
   "short": "Contrast",
   "name": "Now they shade wide",
   "scene": "le2",
   "sit": "After that ace they've shaded wide to stop it happening again.",
   "q": "Which first serve now?",
   "opts": [
    "Fast, at their body",
    "Slower, out wide",
    "Fast, down the T",
    "Fast, out wide"
   ],
   "correct": 2,
   "payoff": "They covered the wide serve, so the T is now the long way round.",
   "principle": "The lean moves, so the target moves.",
   "why": "Shading wide takes away the ace, but it opens the T. They can only block it, and the slow return gives you time on your next ball.",
   "rail": [
    "1 After the ace",
    "2 They shade wide",
    "3 Your serve"
   ],
   "cues": {
    "ball": "FIRST SERVE",
    "you": "SERVER",
    "opp": "SHADES WIDE"
   },
   "unlock": "Follow the lean",
   "take": "They moved to stop it? Serve where they moved from.",
   "lines": {
    "A": "At the body they just step aside: set, they attack, and you're stretched.",
    "B": "Slower, out wide, into their lean: they attack, and you're stretched.",
    "C": "Right: they shaded wide, so the T rushes them. Blocked; you're set early.",
    "D": "Wide is exactly what they're covering now: they're in time."
   }
  },
  {
   "ph": "Transfer · The other side",
   "short": "Transfer",
   "name": "Ad side, protecting the backhand",
   "scene": "le3",
   "sit": "Now the ad side. This returner stands wide to protect their backhand.",
   "q": "Which first serve makes their return hardest?",
   "opts": [
    "Slower, out wide",
    "Fast, down the T",
    "Fast, out wide",
    "Fast, at their body"
   ],
   "correct": 1,
   "payoff": "Away from the lean beats aiming at the weaker wing.",
   "principle": "Serve the space they gave up, even if it's their forehand.",
   "why": "Out wide goes to their backhand, but that's the side they're protecting. Down the T reaches their forehand, but it's the long way from where they stand, and they can only block it.",
   "rail": [
    "1 Ad side",
    "2 Protects backhand",
    "3 Your serve"
   ],
   "cues": {
    "ball": "FIRST SERVE",
    "you": "SERVER",
    "opp": "PROTECTS BACKHAND"
   },
   "unlock": "Same rule, other side",
   "take": "Protecting the backhand? The T to the forehand is open.",
   "lines": {
    "A": "Slower, to the backhand they're protecting: they attack, and you're stretched.",
    "B": "Right: the T, away from the lean. Blocked; you're set early.",
    "C": "Out wide to the backhand is what they're covering: they're in time.",
    "D": "At the body they just step aside: set, they attack, and you're stretched."
   }
  }
 ]
};
