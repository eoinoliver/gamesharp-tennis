const LESSON={
 "title": "Saturday Point #4: The Pusher",
 "hook": "Your serve at 30–15 against someone who gets everything back. Five of your lessons, one point. Two choices each shot: the tempting one, and the one that wins.",
 "memHTML": "Pay no bills. <span>Then bring them forward.</span>",
 "tomorrow": "Next time you play a pusher, don't try to out-hit them. Stay in the rally, then use the drop to bring them in.",
 "cam0": {
  "follow": true
 },
 "finaleScene": "sd5A",
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
   "lesson": "down-the-line"
  },
  {
   "step": 5,
   "lesson": "the-pusher"
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
   "why": "The ball is already wide. Running around puts you further over, and a pusher gets it back into the corner you left, so you only just reach it. The backhand keeps you closer for their next ball. It's close: the forehand lands more often, so both are fine here.",
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
    "B": "Also fine: you only just reach their angle, but the forehand lands every time."
   },
   "noTargets": true,
   "alsoOk": [
    1
   ]
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
   "ph": "Shot 4 · Down the line",
   "short": "Line",
   "name": "They're still getting back",
   "scene": "sd4",
   "sit": "Their loop lands short. You step in, and they're still getting back from the corner.",
   "q": "Where does it go?",
   "opts": [
    "Crosscourt, back to them",
    "Down the line"
   ],
   "correct": 1,
   "payoff": "Down the line goes away from them. At full stretch, all they can do is float it back deep.",
   "principle": "Change direction when they're still on their way back.",
   "why": "They're still recovering from the corner, so crosscourt goes straight back to them and they rally. Down the line is 4.1 m/s away for them: they can only float it back, and you're set early. It lands 9 in 10 either way.",
   "rail": [
    "1 Their loop",
    "2 Your ball",
    "3 Their reply"
   ],
   "cues": {
    "ball": "SHORT LOOP",
    "you": "STEP IN",
    "opp": "RECOVERING"
   },
   "unlock": "Line when they're off it",
   "take": "They're still getting back? Down the line.",
   "lines": {
    "A": "Straight back to them. Back in the rally.",
    "B": "Right: away from them. They can only float it back."
   }
  },
  {
   "ph": "Shot 5 · The drop",
   "short": "Drop",
   "name": "They wait deep",
   "scene": "sd5",
   "sit": "They float it back and wait two metres behind their baseline.",
   "q": "How do you change the game?",
   "opts": [
    "A drop shot",
    "Harder, to the corner"
   ],
   "correct": 0,
   "payoff": "From that deep, the drop makes them sprint, and all they can do is pop it up.",
   "principle": "Pushers are comfortable at the back. Bring them forward.",
   "why": "A pusher waits deep for the next ball. Harder to the corner just comes back. The drop, as slow as it can be (40 km/h), makes them run 5.1 m/s: they reach it at full stretch and can only pop it up, and you pass the side they left.",
   "rail": [
    "1 Their float",
    "2 They wait deep",
    "3 Your answer"
   ],
   "cues": {
    "ball": "THEIR LOOP",
    "you": "STEP IN",
    "opp": "2 M BEHIND"
   },
   "unlock": "Bring them forward",
   "take": "Pusher camped deep? Drop shot.",
   "lines": {
    "A": "Right: they reach it at full stretch and pop it up. You pass the side they left.",
    "B": "Harder to the corner: they get it back."
   }
  }
 ]
};
