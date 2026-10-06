const LESSON={
 "title": "Saturday Point #4: The Pusher",
 "hook": "Your serve at 30–15 against someone who gets everything back. Five of your lessons, one point. Two choices each shot: the tempting one, and the one that wins.",
 "memHTML": "Pay no bills. <span>Then bring them forward.</span>",
 "tomorrow": "Next time you play a pusher, don't try to out-hit them. Stay in the rally, then use the drop to bring them in.",
 "cam0": {
  "follow": true
 },
 "finaleScene": "sd5B",
 "finaleFull": true,
 "flow": true,
 "redoLabel": "Play the point again",
 "uses": [
  {
   "step": 1,
   "lesson": "serve-away-from-the-lean"
  },
  {
   "step": 2,
   "lesson": "forehand-bill"
  },
  {
   "step": 3,
   "lesson": "pulled-wide"
  },
  {
   "step": 4,
   "lesson": "the-pusher"
  },
  {
   "step": 5,
   "lesson": "pass-where-they-arent"
  }
 ],
 "steps": [
  {
   "ph": "Shot 1 · Your serve",
   "short": "Serve",
   "name": "They shade wide",
   "scene": "sd1",
   "sit": "30–15. The returner has shaded wide to cover your wide serve.",
   "q": "Where does your first serve go?",
   "opts": [
    "Out wide",
    "Down the T"
   ],
   "correct": 1,
   "payoff": "Away from the lean, they can only block it.",
   "principle": "Serve away from the lean.",
   "why": "They're already standing where the wide serve goes, so they're in time. The T is the long way round from there, and all they can do is block it.",
   "rail": [
    "1 They lean",
    "2 Your serve",
    "3 Their block"
   ],
   "cues": {
    "ball": "FIRST SERVE",
    "you": "30–15",
    "opp": "SHADES WIDE"
   },
   "unlock": "Serve away from the lean",
   "take": "Shading wide? Serve the T.",
   "lines": {
    "A": "Into their lean: they're in time, and it comes back deep.",
    "B": "Right: it rushes them. A block, wide to your backhand."
   }
  },
  {
   "ph": "Shot 2 · Their block",
   "short": "Run around?",
   "name": "Wide to your backhand",
   "scene": "sd2",
   "sit": "Their block lands wide in your backhand corner.",
   "q": "Backhand, or run around it?",
   "opts": [
    "Backhand crosscourt",
    "Run around, inside-out forehand"
   ],
   "correct": 0,
   "payoff": "From this far over, running around leaves a bill you can't pay.",
   "principle": "Running around costs a recovery. This ball doesn't pay it back.",
   "why": "The ball is already wide. Running around puts you even further over, and a pusher always gets it back into the corner you left.",
   "rail": [
    "1 Wide block",
    "2 Your choice",
    "3 The bill"
   ],
   "cues": {
    "ball": "WIDE BLOCK",
    "you": "BACKHAND CORNER",
    "opp": "PUSHER"
   },
   "unlock": "Check the bill",
   "take": "Wide to your backhand? Hit the backhand.",
   "lines": {
    "A": "Right: it keeps you close enough to cover their next ball.",
    "B": "Your forehand corner is wide open. Their angle leaves you stretched."
   },
   "noTargets": true
  },
  {
   "ph": "Shot 3 · Pulled wide",
   "short": "Wide",
   "name": "Their angled ball",
   "scene": "sd3",
   "sit": "They angle it into your forehand corner. You reach it outside the sideline.",
   "q": "From out here, what do you hit?",
   "opts": [
    "High and deep, crosscourt",
    "Flat, down the line"
   ],
   "correct": 0,
   "payoff": "High and deep buys the time to get back.",
   "principle": "When you're off the court, the next job is getting back.",
   "why": "From outside the sideline the flat line is a low-margin ball, and a pusher still gets it back into your empty court. High and deep gives you the time to recover.",
   "rail": [
    "1 Pulled wide",
    "2 Your ball",
    "3 Get back"
   ],
   "cues": {
    "ball": "THEIR ANGLE",
    "you": "OUTSIDE THE LINE",
    "opp": "PUSHER"
   },
   "unlock": "Buy time first",
   "take": "Pulled wide? High and deep, then get back.",
   "lines": {
    "A": "Right: you're back in time, and they can only loop it back.",
    "B": "They run it down. You're only just in time, with 63 cm over the net."
   }
  },
  {
   "ph": "Shot 4 · Bring them in",
   "short": "Drop",
   "name": "They wait deep",
   "scene": "sd4",
   "sit": "They loop it back and wait two metres behind their baseline.",
   "q": "How do you change the game?",
   "opts": [
    "A drop shot",
    "Harder, to the corner"
   ],
   "correct": 0,
   "payoff": "From that deep, the drop makes them sprint, and all they can do is pop it up.",
   "principle": "Pushers are comfortable at the back. Bring them forward.",
   "why": "Harder to the corner is exactly what a pusher wants to run down. From two metres behind the baseline the drop is a full sprint, and they can only pop it up.",
   "rail": [
    "1 Their loop",
    "2 They wait deep",
    "3 Your drop"
   ],
   "cues": {
    "ball": "THEIR LOOP",
    "you": "STEP IN",
    "opp": "2 M BEHIND"
   },
   "unlock": "Bring them forward",
   "take": "Pusher camped deep? Drop shot.",
   "lines": {
    "A": "Right: they reach it at full stretch and pop it up.",
    "B": "That's what they like. They get it back, and you're back in the rally."
   }
  },
  {
   "ph": "Shot 5 · Your pass",
   "short": "Pass",
   "name": "Stuck at the net",
   "scene": "sd5",
   "sit": "They're stuck at the net, still over on the side of your drop.",
   "q": "Where does your pass go?",
   "opts": [
    "The side they're covering",
    "The side they've left"
   ],
   "correct": 1,
   "payoff": "The pass goes to the side they've left.",
   "principle": "Check which side they're covering before you pick the pass.",
   "why": "They're still on the side they ran to for the drop, so that side is covered. The other side is empty.",
   "rail": [
    "1 Pop-up",
    "2 They're at the net",
    "3 Your pass"
   ],
   "cues": {
    "ball": "THEIR POP-UP",
    "you": "PASSER",
    "opp": "STUCK AT THE NET"
   },
   "unlock": "Pass where they aren't",
   "take": "They're at the net? Pass the side they left.",
   "lines": {
    "A": "Straight to where they're standing. Volleyed away.",
    "B": "Right: the side they left. Passed."
   }
  }
 ]
};
