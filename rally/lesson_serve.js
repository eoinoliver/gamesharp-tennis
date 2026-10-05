const LESSON={
 "tomorrow": "Next time you serve, name the return you expect, then play the one you actually get.",
 "pro": {
  "player": "Pete Sampras",
  "label": "Sampras v Agassi, Wimbledon 1999 final",
  "moment": "A point from the final: the serve struck out wide to Agassi's forehand, the first volley steered into the open Ad court the serve had created.",
  "read": "The serve wins the space before the next swing.",
  "src": "ATP Tour, Heritage feature",
  "url": "https://www.atptour.com/en/news/sampras-1999-wimbledon-atp-heritage-feature"
 },
 "drill": {
  "name": "Serve and hit the space",
  "how": "Serve 10 to each side. Before each serve, say where the return will go. The point only counts if your next shot goes into the space your serve opened."
 },
 "cue": "Serve the question. Hit the space.",
 "callbackTags": [
  "serve_plus_one"
 ],
 "steps": [
  {
   "ph": "See · Spot the pattern",
   "short": "See",
   "name": "Watch both replies",
   "scene": "daily1",
   "unlock": "Short middle, twice",
   "take": "Two short replies? Expect a third — but keep watching.",
   "sit": "Your wide serves have pulled this returner off the court twice. Watch both returns.",
   "q": "Which return should you expect next?",
   "opts": [
    "Deep into your backhand corner",
    "Sharp into your forehand corner",
    "Deep, straight at your feet",
    "Short, through the middle"
   ],
   "correct": 3,
   "payoff": "Two short middle returns: expect a third, but keep watching the ball.",
   "principle": "Where you serve decides how much time they have, and what they can send back.",
   "why": "Pulled wide, the returner is stretched and can only block it back through the middle. Two in a row is a pattern to be ready for, not a promise.",
   "reveal": true,
   "pattern": true,
   "cues": null,
   "rail": [
    "1 Slice wide",
    "2 Stretched",
    "3 Watch landing"
   ],
   "lines": {
    "A": "Neither went deep — both came back short through the middle.",
    "B": "From that far out, neither was angled — both came back short and central.",
    "C": "Both landed short, not deep at your feet.",
    "D": "Both came back short through the middle."
   }
  },
  {
   "ph": "Decide · Use the space",
   "short": "Decide",
   "name": "Your first ball",
   "scene": "daily2",
   "unlock": "Use the space",
   "take": "Wide serve, they're still out wide? Hit into the open court.",
   "sit": "You serve wide again. They're still stranded out wide, and the return lands short in the middle.",
   "q": "Where does your first ball go?",
   "opts": [
    "Hard, back to their side",
    "Deep through the middle",
    "Into the open court",
    "A drop near their sideline"
   ],
   "correct": 2,
   "payoff": "They hadn't started back yet, so the open court was too far for them.",
   "principle": "The serve opened the court. Hit into it while they're still stuck out wide.",
   "why": "They're still where your serve left them, not yet running back, so the open court is out of reach. If they were already sprinting back, behind them would be the better ball.",
   "rail": [
    "1 Slice wide",
    "2 Short return",
    "3 Space created"
   ],
   "lines": {
    "A": "Back to their side — they haven't moved, and they punish it.",
    "B": "Deep but central — they get back into the point.",
    "C": "Into the open court — they can't get across. Point won.",
    "D": "The drop sits up — they run it down and punish it."
   }
  },
  {
   "ph": "Transfer · When the pattern breaks",
   "short": "Transfer",
   "name": "The deep return",
   "scene": "daily3",
   "unlock": "The return has the final say",
   "take": "Pinned deep? Reset high and deep, then rebuild.",
   "sit": "Same wide serve, but this return is deep and pushes you back on your heels.",
   "q": "The return beat your plan. What now?",
   "opts": [
    "High through the middle",
    "Sharp crosscourt, go for it",
    "Hard and deep down the line",
    "Short slice, then come in"
   ],
   "correct": 0,
   "payoff": "You planned the open court. The return took it away, so reset first.",
   "principle": "Plan your next ball before you serve, then let the return have the final say.",
   "why": "A deep return takes your time and balance. Playing the planned shot anyway turns their good return into your error. Buy time now; the pattern will come back.",
   "rail": [
    "1 Same slice",
    "2 Pinned back",
    "3 Contact near baseline"
   ],
   "lines": {
    "A": "High and deep buys time — you're back in the rally.",
    "B": "Sharp from off-balance — a fraction off, and it's wide.",
    "C": "Hard from deep and off-balance — it sails long.",
    "D": "Short, and you're coming in from deep — they pass you."
   }
  }
 ],
 "title": "The Serve Writes the Next Question",
 "hook": "Your serve decides what comes back. Read the reply, then use the space.",
 "memHTML": "The serve asks. <span>The return answers.</span>",
 "finaleScene": "daily2B"
};
