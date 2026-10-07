const LESSON={
 "title": "Saturday Point #5: The Big Hitter",
 "hook": "Break point on their serve, against someone who hits big but hides a backhand. Five of your lessons, one point. Two choices each shot: the tempting one, and the one that wins.",
 "memHTML": "Give them nothing to hit. <span>Then take their time.</span>",
 "tomorrow": "Next time you play a big hitter, stand back for the serve, keep your ball out of their strike zone, and step in when they go high.",
 "cam0": {
  "follow": true
 },
 "finaleScene": "se5B",
 "finaleFull": true,
 "flow": true,
 "redoLabel": "Play the point again",
 "uses": [
  {
   "step": 1,
   "lesson": "find-your-return-spot"
  },
  {
   "step": 2,
   "lesson": "the-big-hitter"
  },
  {
   "step": 3,
   "lesson": "attack-the-backhand"
  },
  {
   "step": 4,
   "lesson": "the-moonballer"
  },
  {
   "step": 5,
   "lesson": "answer-the-drop"
  }
 ],
 "steps": [
  {
   "ph": "Shot 1 · The return",
   "short": "Return",
   "name": "Their big first serve",
   "scene": "se1",
   "sit": "30–40, break point. Their big first serve is coming down the T.",
   "q": "Where do you stand to return it?",
   "opts": [
    "Your usual spot on the baseline",
    "Two steps back"
   ],
   "correct": 1,
   "payoff": "Two steps back buys the time for a deep return. It pushes them back.",
   "principle": "Back for the big first serve.",
   "why": "On the baseline you're only just in time, so the return lands short and they step in. Two steps back gives you the most time, and a deep return pushes them back.",
   "rail": [
    "1 Their serve",
    "2 Your spot",
    "3 Your return"
   ],
   "cues": {
    "ball": "BIG FIRST SERVE",
    "you": "30–40",
    "opp": "BIG SERVER"
   },
   "unlock": "Back for the big one",
   "take": "Big first serve? Two steps back.",
   "lines": {
    "A": "Only just in time: it lands short, and they step in.",
    "B": "Right: set early. Deep, and they're pushed back."
   }
  },
  {
   "ph": "Shot 2 · Their strike zone",
   "short": "Zone",
   "name": "Nothing to hit",
   "scene": "se2",
   "sit": "Pushed back, they send a rally ball to your backhand. They love it waist high.",
   "q": "What's your reply?",
   "opts": [
    "High and heavy crosscourt",
    "Flat through the middle"
   ],
   "correct": 0,
   "payoff": "It reaches them above the shoulder, so all they have is a rally ball.",
   "principle": "Keep your ball out of their strike zone.",
   "why": "Flat through the middle reaches them waist high, right in their zone, and they hit their big ball. High and heavy reaches them above the shoulder, and they can only rally it back, to their weaker backhand side.",
   "rail": [
    "1 Their ball",
    "2 Your reply",
    "3 Their height"
   ],
   "cues": {
    "ball": "RALLY BALL",
    "you": "BACKHAND",
    "opp": "LOVES WAIST HIGH"
   },
   "unlock": "Out of their zone",
   "take": "Big hitter? High and heavy, not flat.",
   "lines": {
    "A": "Right: above the shoulder. A rally ball back.",
    "B": "Waist high, their zone. Their big ball has you stretched."
   }
  },
  {
   "ph": "Shot 3 · The long way",
   "short": "Long way",
   "name": "They guard the backhand",
   "scene": "se3",
   "sit": "They know the backhand is weak and lean toward it before you hit.",
   "q": "Where does this ball go?",
   "opts": [
    "Harder into the backhand",
    "Wide to the forehand"
   ],
   "correct": 1,
   "payoff": "Pulled off it, they reach it at a stretch and loop it back high to buy time.",
   "principle": "If they guard the weak side, move them off it first.",
   "why": "They're already leaning there, so the backhand just comes back. Wide to the forehand stretches them away from it, and all they can do is a high, heavy ball to buy time.",
   "rail": [
    "1 Their lean",
    "2 Your ball",
    "3 Their reply"
   ],
   "cues": {
    "ball": "THEIR RALLY BALL",
    "you": "FOREHAND",
    "opp": "LEANS TO BACKHAND"
   },
   "unlock": "Other side first",
   "take": "They guard the backhand? Go wide first.",
   "lines": {
    "A": "They were waiting for it. It comes straight back.",
    "B": "Right: stretched wide. They loop it back high."
   }
  },
  {
   "ph": "Shot 4 · Their high ball",
   "short": "High ball",
   "name": "Take their time",
   "scene": "se4",
   "sit": "Their high, heavy ball is coming. They're scrambling back from the forehand corner.",
   "q": "What do you do?",
   "opts": [
    "Step in and take it early",
    "Back up and let it come down"
   ],
   "correct": 0,
   "payoff": "Taken early into the open backhand corner, they're rushed. It lands short.",
   "principle": "Against a high ball, step in and take their time.",
   "why": "Backing up, it's still climbing when you meet it: above the shoulder, floated back, and they're back in the rally. Stepping in takes it early, on the rise, into the backhand corner they've left. Rushed, their reply lands short.",
   "rail": [
    "1 Their high ball",
    "2 Your move",
    "3 Their reply"
   ],
   "cues": {
    "ball": "HIGH AND HEAVY",
    "you": "YOUR FOREHAND",
    "opp": "RECOVERING"
   },
   "unlock": "Step in",
   "take": "High ball? Step in and take their time.",
   "lines": {
    "A": "Right: early, into the backhand. Rushed, it lands short.",
    "B": "Above the shoulder, floated back. Their rally again."
   }
  },
  {
   "ph": "Shot 5 · Your approach",
   "short": "Approach",
   "name": "They stay back",
   "scene": "se5",
   "sit": "Their short ball. You get there in time, and they stay back on the baseline.",
   "q": "Where does your approach go?",
   "opts": [
    "Deep into the corner",
    "Deep through the middle"
   ],
   "correct": 1,
   "payoff": "Through the middle there's no angle to pass. High volley, put away.",
   "principle": "If they stay back, there's no winner yet. Go deep and central, then volley.",
   "why": "From the baseline they have time to run down the corner and pass you. Deep through the middle gives them no angle: their pass comes to you chest high, and you volley it away.",
   "rail": [
    "1 Their short ball",
    "2 They stay back",
    "3 Your approach"
   ],
   "cues": {
    "ball": "SHORT BALL",
    "you": "SPRINT IN",
    "opp": "STAYS BACK"
   },
   "unlock": "Break of serve",
   "take": "They stay back? Deep middle, then volley.",
   "lines": {
    "A": "They run it down from the baseline. Passed.",
    "B": "Right: no angle. High volley, put away. Break."
   }
  }
 ]
};
