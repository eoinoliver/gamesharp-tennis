const LESSON={
 "title": "Saturday Point #1",
 "hook": "One point on your serve, built from this week's lessons. Two choices each shot: the one you want to hit, and the one that wins.",
 "memHTML": "Serve to open it. <span>Earn the finish.</span>",
 "tomorrow": "In your next match, play this pattern once on purpose: serve wide, hit into the open court, then look behind them.",
 "cam0": {
  "follow": true
 },
 "finaleScene": "sa5B",
 "finaleFull": true,
 "redoLabel": "Play the point again",
 "uses": [
  {
   "step": 1,
   "lesson": "serve-plus-one"
  },
  {
   "step": 2,
   "lesson": "serve-plus-one"
  },
  {
   "step": 3,
   "lesson": "short-ball"
  },
  {
   "step": 4,
   "lesson": "short-ball"
  },
  {
   "step": 5,
   "lesson": "the-line"
  },
  {
   "step": 5,
   "lesson": "the-winner"
  }
 ],
 "steps": [
  {
   "ph": "Shot 1 · Your serve",
   "short": "Serve",
   "name": "They guard the middle",
   "scene": "sa1",
   "sit": "30-30, deuce court. The returner stands close to the middle to protect their backhand.",
   "q": "Where do you serve?",
   "opts": [
    "Down the T, for the ace",
    "Wide, to pull them off the court"
   ],
   "correct": 1,
   "payoff": "Wide drags them off the court. They can only block it back.",
   "principle": "The serve asks the question. Ask one that opens the court.",
   "why": "Standing in the middle, they cover the T easily. Wide makes them reach outside the sideline, so the return is a block and the court behind it is open.",
   "rail": [
    "1 Your serve",
    "2 Their return",
    "3 Open court"
   ],
   "cues": {
    "ball": "YOUR SERVE",
    "you": "SERVER",
    "opp": "GUARDING THE MIDDLE"
   },
   "unlock": "Serve to open it",
   "take": "Returner in the middle? Serve wide.",
   "lines": {
    "A": "Short, but they're still in the middle. Nothing is open.",
    "B": "Right: off the court. They block it short, and the court is open."
   }
  },
  {
   "ph": "Shot 2 · Read their return",
   "short": "Read",
   "name": "Pulled wide",
   "scene": "sa2",
   "sit": "Your wide serve has them reaching outside the sideline.",
   "q": "Where does their return go?",
   "opts": [
    "Short, through the middle",
    "Deep, into your backhand"
   ],
   "correct": 0,
   "payoff": "Stretched that far, all they can do is block it short.",
   "principle": "Where you serve decides what they can send back.",
   "why": "At full stretch they can't swing. A blocked return through the middle is all that's left, so you can start moving in before they hit it.",
   "rail": [
    "1 They stretch",
    "2 They block",
    "3 You move in"
   ],
   "cues": {
    "ball": "WIDE SERVE",
    "you": "READ IT",
    "opp": "STRETCHED"
   },
   "unlock": "Read it early",
   "take": "Pulled them wide? Expect the short block and move in.",
   "lines": {
    "A": "Right: a block, short through the middle. You're moving in early.",
    "B": "Not from out there. Stretched, they can only block it short."
   }
  },
  {
   "ph": "Shot 3 · Your +1",
   "short": "+1",
   "name": "The short ball",
   "scene": "sa3",
   "sit": "Their blocked return sits up short. They're still out wide, scrambling back.",
   "q": "Where does your +1 go?",
   "opts": [
    "A drop shot, they're deep",
    "Into the open court"
   ],
   "correct": 1,
   "payoff": "Their position earned the attack. The open court makes them sprint.",
   "principle": "Short is an invitation. Their position decides if you accept.",
   "why": "They're stranded wide, so the open court is the attack their position gave you. The drop gives them a short run straight at the ball.",
   "rail": [
    "1 Short ball",
    "2 They scramble",
    "3 Open court"
   ],
   "cues": {
    "ball": "SHORT BALL",
    "you": "STEP IN",
    "opp": "STRANDED WIDE"
   },
   "unlock": "Accept the invitation",
   "take": "They're stranded wide? Hit the +1 into the open court.",
   "lines": {
    "A": "They run it down and punish it. You're stretched.",
    "B": "Right: they sprint, and only just reach it. You're set early."
   }
  },
  {
   "ph": "Shot 4 · Read their reply",
   "short": "Read",
   "name": "At full sprint",
   "scene": "sa4",
   "sit": "They reach your +1 at a full sprint.",
   "q": "What comes back?",
   "opts": [
    "A high float, to buy time",
    "A hard pass down the line"
   ],
   "correct": 0,
   "payoff": "A player at full stretch buys time with height. Get ready for the float.",
   "principle": "Height and depth buy back the time a stretch took.",
   "why": "At a full sprint they can't hit through the ball. The only safe answer is a high float, the same one you learned in The Short Ball, from their side.",
   "rail": [
    "1 They sprint",
    "2 They float",
    "3 You're set"
   ],
   "cues": {
    "ball": "YOUR +1",
    "you": "READ IT",
    "opp": "FULL SPRINT"
   },
   "unlock": "Read the float",
   "take": "They're sprinting? Expect the float and get set.",
   "lines": {
    "A": "Right: a high float. You're set early with time to choose.",
    "B": "Not at a full sprint. All they can do is float it."
   }
  },
  {
   "ph": "Shot 5 · The finish",
   "short": "Finish",
   "name": "Their float",
   "scene": "sa5",
   "sit": "Their float sits up. You're set. They're still racing back toward the middle.",
   "q": "Where does your finish go?",
   "opts": [
    "Deep through the middle, safe",
    "Behind them, down the line"
   ],
   "correct": 1,
   "payoff": "The ball, your balance and the space all said yes. Behind them, they can't turn.",
   "principle": "Risk is right when the ball, your balance and the space all support it.",
   "why": "A high ball, a set player and an opponent running the other way earn the line. The safe middle ball runs straight into them and hands the point back.",
   "rail": [
    "1 Float",
    "2 You're set",
    "3 Your finish"
   ],
   "cues": {
    "ball": "THEIR FLOAT",
    "you": "SET",
    "opp": "RACING BACK"
   },
   "unlock": "Earn the finish",
   "take": "Set, and they're running back? Go behind them.",
   "lines": {
    "A": "It runs straight into them. Back to even; you're only just in time.",
    "B": "Right: behind them, and they can't turn. Winner."
   }
  }
 ]
};
