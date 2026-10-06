const LESSON={
 "title": "Saturday Point #2",
 "hook": "A return game at 5–2, built from five of your lessons. Two choices each shot: the one you want to hit, and the one that wins.",
 "memHTML": "Return deep. <span>Keep the depth. Finish at the net.</span>",
 "tomorrow": "In your next match, when you're ahead, check that your balls aren't getting shorter. Keep them deep.",
 "cam0": {
  "follow": true
 },
 "finaleScene": "sb5A",
 "finaleFull": true,
 "flow": true,
 "redoLabel": "Play the point again",
 "uses": [
  {
   "step": 1,
   "lesson": "middle-return"
  },
  {
   "step": 2,
   "lesson": "the-lead"
  },
  {
   "step": 3,
   "lesson": "recovery"
  },
  {
   "step": 4,
   "lesson": "approach-volley"
  },
  {
   "step": 5,
   "lesson": "split-step"
  }
 ],
 "steps": [
  {
   "ph": "Shot 1 · Your return",
   "short": "Return",
   "name": "Their big serve",
   "scene": "sb1",
   "sit": "You lead 5–2. Their serve: a big first serve, wide to your forehand.",
   "q": "Where does your return go?",
   "opts": [
    "Deep through the middle",
    "At the far sideline"
   ],
   "correct": 0,
   "payoff": "Deep through the middle takes the angle away from their next ball.",
   "principle": "Against a big serve, deep through the middle takes their weapon away.",
   "why": "Off their best serve, the sideline is a low-percentage target and it goes wide. Deep through the middle gives them no angle for their +1.",
   "rail": [
    "1 Big serve",
    "2 Your return",
    "3 Their +1"
   ],
   "cues": {
    "ball": "BIG SERVE",
    "you": "RETURNER",
    "opp": "SERVER"
   },
   "unlock": "Return deep",
   "take": "Big serve coming? Deep through the middle.",
   "lines": {
    "A": "Right: deep through the middle. Their +1 has no angle.",
    "B": "Going for the line off their best serve: wide."
   }
  },
  {
   "ph": "Shot 2 · Ahead",
   "short": "Ahead",
   "name": "Keep the depth",
   "scene": "sb2",
   "sit": "Their +1 pushes you into your backhand corner.",
   "q": "Your backhand from the corner?",
   "opts": [
    "Shorter and safer, crosscourt",
    "Deep crosscourt, like before"
   ],
   "correct": 1,
   "payoff": "The depth that built the lead keeps them back.",
   "principle": "Ahead? Keep the depth that built the lead.",
   "why": "Leading makes the safe, shorter ball feel smart, but it lets them step in and take over. Deep crosscourt keeps them where they've been all set.",
   "rail": [
    "1 You lead",
    "2 Backhand corner",
    "3 Your depth"
   ],
   "cues": {
    "ball": "THEIR +1",
    "you": "5–2 UP",
    "opp": "SERVER"
   },
   "unlock": "Keep the depth",
   "take": "Ahead? Don't get shorter.",
   "lines": {
    "A": "Shorter lets them step in and take over. You're stretched.",
    "B": "Right: deep crosscourt keeps them back and pulls them wide."
   }
  },
  {
   "ph": "Shot 3 · Your recovery",
   "short": "Recover",
   "name": "Where to go",
   "scene": "sb3",
   "sit": "Your deep crosscourt pulls them wide.",
   "q": "Where do you recover to?",
   "opts": [
    "Shade toward their crosscourt",
    "Back to the centre mark"
   ],
   "correct": 0,
   "payoff": "Your shot moved their best reply, so the middle moved too.",
   "principle": "Recover to their angles, not the centre mark.",
   "why": "Pulled wide, their percentage reply is crosscourt. Shading toward it gets you there in time to change direction; the centre mark leaves you stretched.",
   "rail": [
    "1 They're wide",
    "2 Their angle",
    "3 Your spot"
   ],
   "cues": {
    "ball": "YOUR CROSSCOURT",
    "you": "RECOVER",
    "opp": "PULLED WIDE"
   },
   "unlock": "Recover to their angles",
   "take": "Pulled them wide? Shade toward their crosscourt.",
   "lines": {
    "A": "Right: in time for their crosscourt, and you change direction.",
    "B": "The centre leaves their crosscourt open. You're stretched."
   }
  },
  {
   "ph": "Shot 4 · The approach",
   "short": "Approach",
   "name": "Their short slice",
   "scene": "sb4",
   "sit": "Stretched again, they can only slice it back short.",
   "q": "How do you approach?",
   "opts": [
    "Short, to the middle",
    "Deep through the middle"
   ],
   "correct": 1,
   "payoff": "A deep approach keeps them back and builds a high volley.",
   "principle": "A deep approach builds an easy volley.",
   "why": "A short approach gives them time and a target for the pass. Deep keeps them behind the baseline, and their pass comes to you higher and slower.",
   "rail": [
    "1 Short slice",
    "2 Your approach",
    "3 Close in"
   ],
   "cues": {
    "ball": "SHORT SLICE",
    "you": "MOVE IN",
    "opp": "STRETCHED"
   },
   "unlock": "Approach deep",
   "take": "Coming in? Approach deep.",
   "lines": {
    "A": "Short gives them time and a target. Passed.",
    "B": "Right: deep keeps them back. Close in."
   }
  },
  {
   "ph": "Shot 5 · Your split",
   "short": "Split",
   "name": "Their pass",
   "scene": "sb5",
   "sit": "You're closing in. They're winding up for the pass.",
   "q": "When should your split step land?",
   "opts": [
    "As they hit the pass",
    "Early, so you're ready and waiting"
   ],
   "correct": 0,
   "payoff": "Landing as they hit lets you push the moment the pass appears.",
   "principle": "Land for their hit, not before it or after it.",
   "why": "Land as they hit and you push off the moment the pass can be read: 0.21 s to spare at the volley. Land early and you settle, then push late: 0.09 s, less than half the time.",
   "rail": [
    "1 Closing in",
    "2 Their swing",
    "3 Your split"
   ],
   "cues": {
    "ball": "YOUR APPROACH",
    "you": "CLOSING",
    "opp": "PASSING"
   },
   "unlock": "Land on their hit",
   "take": "At the net? Land your split as they hit.",
   "lines": {
    "A": "Right: you push as the pass appears. Set, and you put it away.",
    "B": "Early, you settle and push late: 0.09 s to spare instead of 0.21."
   },
   "noTargets": true
  }
 ]
};
