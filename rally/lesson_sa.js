const LESSON={
 "title": "Saturday Point #1",
 "hook": "One point on your serve, built from five of your lessons. Two choices each shot: the one you want to hit, and the one that wins.",
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
   "lesson": "open-court"
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
   "payoff": "Wide drags them off the court.",
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
    "B": "Right: they have to reach outside the sideline for it."
   }
  },
  {
   "ph": "Shot 2 · Read their return",
   "short": "Read",
   "name": "Pulled wide",
   "scene": "sa2",
   "sit": "They're reaching for it outside the sideline.",
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
    "A": "Right: stretched that far, all they can do is block it short.",
    "B": "Not from out there. Stretched, they can only block it short."
   }
  },
  {
   "ph": "Shot 3 · Your +1",
   "short": "+1",
   "name": "The short ball",
   "scene": "sa3",
   "sit": "It's short, and they're still out wide.",
   "q": "Where does your +1 go?",
   "opts": [
    "A drop shot, they're deep",
    "Into the open court"
   ],
   "correct": 1,
   "payoff": "Their position earned the attack.",
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
    "B": "Right: the open court makes them sprint for it."
   }
  },
  {
   "ph": "Shot 4 · Read their reply",
   "short": "Read",
   "name": "They race back",
   "scene": "sa4",
   "sit": "They're sprinting for it.",
   "q": "Where will the space be for your finish?",
   "opts": [
    "The corner they just hit from",
    "The open side they're racing to"
   ],
   "correct": 0,
   "payoff": "They're running toward the open side. The corner they left stays empty.",
   "principle": "When a player is moving, the empty space is where they're arriving.",
   "why": "The open side looks empty, but that's where they're running, so by the time your ball gets there, so are they. The corner they just hit from stays empty while they race back.",
   "rail": [
    "1 They sprint",
    "2 They float",
    "3 They race back"
   ],
   "cues": {
    "ball": "YOUR +1",
    "you": "READ IT",
    "opp": "RACING BACK"
   },
   "unlock": "Read the run",
   "take": "They're racing back? Hit behind them.",
   "lines": {
    "A": "Right: they're running away from it. That corner stays open.",
    "B": "That's where they're running. By your next ball, they'll be there."
   }
  },
  {
   "ph": "Shot 5 · The finish",
   "short": "Finish",
   "name": "Their float",
   "scene": "sa5",
   "sit": "Their float sits up. You're set.",
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
 ],
 "flow": true
};
