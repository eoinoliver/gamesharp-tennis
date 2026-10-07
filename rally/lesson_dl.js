const LESSON={
 "title": "When to Go Down the Line",
 "hook": "The line isn't much riskier than crosscourt. What makes it right or wrong is where they are.",
 "memHTML": "Line when they're off it. <span>Crosscourt when they're on it.</span>",
 "tomorrow": "Before you change direction, check where they are: still recovering, go line; already covering it, go crosscourt.",
 "pro": {
  "player": "Novak Djokovic",
  "label": "Djokovic picks his moment for the line",
  "moment": "Late in the 2022 Nitto ATP Finals final against Casper Ruud, Djokovic's backhand opened up, changing direction down the line, and he made just one error in his last 25 backhands.",
  "read": "The line is a weapon when you pick the moment for it.",
  "src": "ATP Tour, Craig O'Shannessy, Brain Game (Nov 2022)",
  "url": "https://www.atptour.com/en/news/djokovic-ruud-turin-2022-final-brain-game"
 },
 "drill": {
  "name": "Line or cross",
  "how": "Rally crosscourt. On any short ball, glance at your partner: if they're still getting back to the middle, go down the line; if they've moved across early, go crosscourt behind them."
 },
 "cue": "Where are they? Then where does it go.",
 "callbackTags": [
  "change_direction"
 ],
 "tenTries": true,
 "finaleScene": "dl1C",
 "steps": [
  {
   "ph": "See · Short and set",
   "short": "See",
   "name": "They're still recovering",
   "scene": "dl1",
   "sit": "Their crosscourt lands short. You step in, set, and they're still getting back to the middle.",
   "q": "Where does it go?",
   "opts": [
    "High crosscourt",
    "Deep middle",
    "Down the line",
    "Flat crosscourt"
   ],
   "correct": 2,
   "payoff": "Down the line, they're stretched and you're set early for the next ball.",
   "principle": "Change direction when they're still on their way back.",
   "why": "Down the line stretches them (2.7 m/s to get there), so all they have is a safe ball, and you're set early. It lands 8 in 10. Deep through the middle is about as good: it lands every time and they can only rally it. The flat crosscourt stretches them most, but only 5 in 10 land.",
   "rail": [
    "1 Their short ball",
    "2 Your shot",
    "3 Their reply"
   ],
   "cues": {
    "ball": "SHORT BALL",
    "you": "SET",
    "opp": "RECOVERING"
   },
   "unlock": "Line when they're off it",
   "take": "Short, and they're recovering? Down the line.",
   "lines": {
    "A": "Safe, but they're set. Back in the rally.",
    "B": "Also fine: lands every time, and they can only rally it.",
    "C": "Right: they're stretched, and you're set early.",
    "D": "Stretches them most, but only 5 in 10 land."
   },
   "alsoOk": [
    1
   ]
  },
  {
   "ph": "Contrast · They cheat",
   "short": "Contrast",
   "name": "They're covering the line",
   "scene": "dl2",
   "sit": "Same short ball. This time they've started moving toward the line before you hit.",
   "q": "Where now?",
   "opts": [
    "Down the line",
    "Deep middle",
    "Flat crosscourt",
    "High crosscourt"
   ],
   "correct": 3,
   "payoff": "Crosscourt goes behind them. At full stretch, all they have is a defensive ball.",
   "principle": "If they're covering the line, go crosscourt.",
   "why": "They're already moving to the line, so the line goes to them. Crosscourt goes behind them: they reach it at full stretch and can only defend, and it lands 9 in 10. The flat crosscourt wins outright here, but only 5 in 10 land.",
   "rail": [
    "1 Their short ball",
    "2 They move early",
    "3 Your shot"
   ],
   "cues": {
    "ball": "SHORT BALL",
    "you": "SET",
    "opp": "COVERS THE LINE"
   },
   "unlock": "Cross when they cover it",
   "take": "They're covering the line? Crosscourt, behind them.",
   "lines": {
    "A": "Straight to where they're going. Back in the rally.",
    "B": "Safe, but no pressure.",
    "C": "A winner this time, but only 5 in 10 land.",
    "D": "Right: behind them. All they have is a defensive ball."
   }
  },
  {
   "ph": "Transfer · Backhand side",
   "short": "Transfer",
   "name": "The same on your backhand",
   "scene": "dl3",
   "sit": "Their crosscourt backhand lands short to your backhand. They're still on their way back to the middle.",
   "q": "Where does it go?",
   "opts": [
    "Deep middle",
    "Down the line",
    "High crosscourt",
    "Flat crosscourt"
   ],
   "correct": 1,
   "payoff": "Down the line, they're stretched again. You're set for the next ball.",
   "principle": "Same rule on the backhand: line while they're still recovering.",
   "why": "Down the line goes away from where they're heading, so they're stretched, and it lands 9 in 10. Crosscourt lands every time, but they're set. The middle goes right to them and leaves you only just in time.",
   "rail": [
    "1 Their short ball",
    "2 Your backhand",
    "3 Their reply"
   ],
   "cues": {
    "ball": "SHORT BALL",
    "you": "BACKHAND",
    "opp": "RECOVERING"
   },
   "unlock": "Same on both sides",
   "take": "Backhand too: line while they're recovering.",
   "lines": {
    "A": "Right at them. You're only just in time.",
    "B": "Right: they're still on the way back. Stretched.",
    "C": "Lands every time, but they're set.",
    "D": "Only 7 in 10 land."
   }
  }
 ]
};
