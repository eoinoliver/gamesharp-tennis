const LESSON={
 "title": "The Winner Can Be the Wrong Shot",
 "hook": "A low-percentage winner teaches you to repeat the choice that will usually cost you.",
 "memHTML": "Judge the choice <span>before the result.</span>",
 "tomorrow": "Next time a risky winner lands, ask whether you would choose it ten times.",
 "pro": {
  "player": "Carlos Alcaraz",
  "label": "Ferrero on Alcaraz, 2025",
  "moment": "Juan Carlos Ferrero, then his coach: \"He knows that he has to work on his consistency. I've told him so many times and that's what we're doing.\"",
  "read": "Applause judges the outcome. Champions judge the choice.",
  "src": "ATP Tour, Roland Garros 2025",
  "url": "https://www.atptour.com/en/news/alcaraz-ferrero-focus-roland-garros-2025"
 },
 "drill": {
  "name": "The ten-ball test",
  "how": "Pick a target and hit 10 balls at it from the same feed. Fewer than 7 in? It's too ambitious for a match. Move it a metre inside the line and go again."
 },
 "cue": "Would I choose it ten times?",
 "callbackTags": [
  "risk_choice"
 ],
 "finaleScene": "wn2A",
 "tenTries": true,
 "steps": [
  {
   "ph": "See · Separate result from choice",
   "short": "See",
   "name": "The line winner",
   "scene": "wn1",
   "reveal": true,
   "sit": "Off a low, neutral ball, you go down the line and clip the paint. Winner.",
   "q": "What does that one winner tell you?",
   "opts": [
    "The target was safe enough",
    "The line was the only shot",
    "That it went in — this time",
    "The ball deserved full pace"
   ],
   "correct": 2,
   "payoff": "One winner only proves that one ball went in.",
   "principle": "Judge the choice by what you knew before you hit it, not by where it landed.",
   "why": "Clipping the line feels like proof. It isn't: from this ball the same shot misses often, and the ten tries show it.",
   "rail": [
    "1 Low neutral ball",
    "2 Line clip",
    "3 Winner"
   ],
   "cues": null,
   "unlock": "It went in. Once.",
   "take": "Would you choose it ten times? Judge the choice, not the applause.",
   "lines": {
    "A": "One winner can't show the margin — here are ten tries of the same shot.",
    "B": "Nothing forced the line — the big crosscourt was there too.",
    "C": "Right — this one landed. Ten tries show how often it would.",
    "D": "A low ball rarely earns full pace — look at the misses."
   }
  },
  {
   "ph": "Deepen · Judge before impact",
   "short": "Judge",
   "name": "Same ball, ten tries",
   "scene": "wn2",
   "sit": "Same ball again. Choose before you see where it lands.",
   "q": "Which shot would you pick ten times?",
   "opts": [
    "Crosscourt, big window",
    "Flat through the low ball",
    "Deep down the line again",
    "Short drop, they're set"
   ],
   "correct": 0,
   "payoff": "The bigger target leaves room for the small misses everyone makes.",
   "principle": "Pick the shot that still works when you hit it slightly wrong.",
   "why": "From the same ball, the crosscourt window gives you more net and more court with the same balance. Ten tries show what one winner hides.",
   "rail": [
    "1 Same ball",
    "2 Result hidden",
    "3 Compare windows"
   ],
   "cues": {
    "ball": "LOW",
    "you": "BALANCED",
    "opp": "NEUTRAL"
   },
   "unlock": "Bigger window, more margin",
   "take": "Same ball: pick the target that lands ten times out of ten.",
   "lines": {
    "A": "The big crosscourt window lands every time — rally on.",
    "B": "Flat from a low ball — half of them miss.",
    "C": "The line again — 4 in 10 land. It misses more often than it wins.",
    "D": "It lands, but short and slow — they run it down."
   }
  },
  {
   "ph": "Transfer · Earn more risk",
   "short": "Transfer",
   "name": "The high short ball",
   "scene": "wn3",
   "sit": "Now the ball is high and short. You're set, and they're pulled wide.",
   "q": "What does this ball earn?",
   "opts": [
    "Loop it deep and rebuild",
    "Hard, straight at them",
    "Open court, well inside",
    "Open court, right on the line"
   ],
   "correct": 2,
   "payoff": "This time the risk was earned before you hit it.",
   "principle": "Risk is right when the ball, your balance and the space all support it.",
   "why": "High contact, set feet and open court change the odds. The score can't make those things true.",
   "rail": [
    "1 High ball",
    "2 You set",
    "3 Open court"
   ],
   "cues": {
    "ball": "WAIST-HIGH",
    "you": "SET",
    "opp": "STRETCHED"
   },
   "unlock": "This ball earns aggression",
   "take": "High, set, open court: attack — with margin.",
   "lines": {
    "A": "Safe, but you'd earned more — chance missed.",
    "B": "Hard at them — they're on it, and the ball comes straight back.",
    "C": "Open court, well inside the lines — they can't get there.",
    "D": "Right on the line — too many land wide."
   }
  }
 ]
};
