const LESSON={
 "title": "Answer the Drop",
 "hook": "They drop-shot you. You get there. Now where they go decides your answer, and the counter-drop is usually the trap.",
 "memHTML": "Get there, look up, <span>then go deep.</span>",
 "tomorrow": "Next time you're drop-shotted, look up as you reach it: are they coming in, holding, or backing off?",
 "drill": {
  "name": "Drop and read",
  "how": "Your partner feeds a drop, then either holds mid-court, follows it in or backs off. Sprint in, look up, and answer: deep behind them if they stay or come in, deep through the middle if they back off."
 },
 "cue": "Get there, look up, go deep.",
 "callbackTags": [
  "answer_drop"
 ],
 "finaleScene": "ad1C",
 "steps": [
  {
   "ph": "See · They hold",
   "short": "See",
   "name": "They stay mid-court",
   "scene": "ad1",
   "sit": "They drop-shot you and stay mid-court, where they hit it. You get there in time.",
   "q": "What's your answer?",
   "opts": [
    "A counter-drop",
    "Deep through the middle",
    "Deep into the corner",
    "A short angle"
   ],
   "correct": 2,
   "payoff": "From mid-court they can't get back to the deep corner.",
   "principle": "If they stay, go deep behind them.",
   "why": "They're stuck mid-court, so the deep corner is behind them and out of reach. The counter-drop from behind your service line sits up for them; the short angle is right where they are.",
   "rail": [
    "1 Their drop",
    "2 You get there",
    "3 Your answer"
   ],
   "cues": {
    "ball": "THEIR DROP",
    "you": "SPRINT IN",
    "opp": "HOLDS MID-COURT"
   },
   "unlock": "Look up",
   "take": "They stay mid-court? Deep behind them.",
   "lines": {
    "A": "From back here it sits up for them. At your feet.",
    "B": "Deep middle comes straight back. You volley it back.",
    "C": "Right: deep behind them. They can't get back to it.",
    "D": "Short angle is right where they are. Passed."
   }
  },
  {
   "ph": "Contrast · They back off",
   "short": "Contrast",
   "name": "They retreat",
   "scene": "ad2",
   "sit": "Same drop. This time they back off to the baseline as you run in.",
   "q": "What's your answer now?",
   "opts": [
    "Deep into the corner",
    "A counter-drop",
    "A short angle",
    "Deep through the middle"
   ],
   "correct": 3,
   "payoff": "They're back and balanced: no winner here. Reset deep through the middle.",
   "principle": "If they back off, there's no winner. Keep it deep and central.",
   "why": "From the baseline they have time to run down the corner and pass you. The counter-drop catches them coming in. Deep through the middle gives them no angle, and you volley again.",
   "rail": [
    "1 Their drop",
    "2 They back off",
    "3 Your answer"
   ],
   "cues": {
    "ball": "THEIR DROP",
    "you": "SPRINT IN",
    "opp": "BACKS OFF"
   },
   "unlock": "No winner? Reset",
   "take": "They back off? Deep through the middle.",
   "lines": {
    "A": "From the baseline they run it down and pass you.",
    "B": "They're on it in time: it's at your feet.",
    "C": "They get there and pass you.",
    "D": "Right: no angle for them. You're still in the point."
   }
  },
  {
   "ph": "Transfer · They come in",
   "short": "Transfer",
   "name": "They follow it in",
   "scene": "ad3",
   "sit": "This time they follow their drop in toward the net.",
   "q": "What's your answer?",
   "opts": [
    "Deep through the middle",
    "A short angle",
    "A counter-drop",
    "Deep into the corner"
   ],
   "correct": 0,
   "alsoOk": [
    3
   ],
   "payoff": "Coming forward, they can't turn and chase a deep ball.",
   "principle": "If they come in, go deep behind them. Not the counter-drop.",
   "why": "Moving forward, they can't get back for anything deep. The counter-drop is the trap: from behind your service line it doesn't stay low enough, and they're already there.",
   "rail": [
    "1 Their drop",
    "2 They come in",
    "3 Your answer"
   ],
   "cues": {
    "ball": "THEIR DROP",
    "you": "SPRINT IN",
    "opp": "COMING IN"
   },
   "unlock": "Deep behind them",
   "take": "They follow it in? Go deep.",
   "lines": {
    "A": "Right: deep, and they can't get back. Winner.",
    "B": "They're coming in anyway. Passed.",
    "C": "The trap: they're already there. At your feet.",
    "D": "Deep into the corner works too. Winner."
   }
  }
 ]
};
