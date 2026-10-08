const LESSON={
 "title": "Midweek Point #1",
 "hook": "Three shots, three of your lessons, one point. A quick top-up between Saturdays.",
 "memHTML": "Step in. Middle when wide. <span>Line when they're off it.</span>",
 "tomorrow": "In your next match, try just one of these three on purpose, and notice how the point changes.",
 "cam0": {
  "follow": true
 },
 "finaleScene": "ma3A",
 "finaleFull": true,
 "flow": true,
 "tenTries": true,
 "redoLabel": "Play the point again",
 "uses": [
  {
   "step": 1,
   "lesson": "find-your-return-spot"
  },
  {
   "step": 2,
   "lesson": "rushed-out-wide"
  },
  {
   "step": 3,
   "lesson": "down-the-line"
  }
 ],
 "steps": [
  {
   "ph": "Shot 1 · The return",
   "short": "Return",
   "name": "Their kick second serve",
   "scene": "ma1",
   "sit": "15–30. Their second serve is a high, heavy kick.",
   "q": "Where do you stand to return it?",
   "opts": [
    "Step inside the baseline",
    "Two steps back"
   ],
   "correct": 0,
   "payoff": "Taken early, before it climbs: a deep return that pushes them back.",
   "principle": "In for the kick.",
   "why": "Inside the baseline you take the kick before it kicks up, chest high, and send it back deep. Two steps back, it has climbed above your shoulder and you're too late to get there in time.",
   "rail": [
    "1 Their kick",
    "2 Your spot",
    "3 Your return"
   ],
   "cues": {
    "ball": "KICK SERVE",
    "you": "15–30",
    "opp": "SERVER"
   },
   "unlock": "In for the kick",
   "take": "Kick second serve? Step in.",
   "lines": {
    "A": "Right: taken early. Deep, and they're pushed back.",
    "B": "It climbs above your shoulder. Too late."
   }
  },
  {
   "ph": "Shot 2 · Pulled wide",
   "short": "Wide",
   "name": "Into your backhand corner",
   "scene": "ma2",
   "sit": "Their rally ball pulls you into your backhand corner.",
   "q": "What do you hit?",
   "opts": [
    "High, deep through the middle",
    "Flat crosscourt"
   ],
   "correct": 0,
   "payoff": "The deep middle lands every time, and all they have is a rally ball.",
   "principle": "Out wide? Deep through the middle.",
   "why": "The deep middle lands 10 in 10, they can only rally it, and you're in time for their next ball. The flat crosscourt stretches them and buys more time, but only 7 in 10 land.",
   "rail": [
    "1 Their ball",
    "2 You're wide",
    "3 Your shot"
   ],
   "cues": {
    "ball": "RALLY BALL",
    "you": "BACKHAND",
    "opp": "MIDDLE"
   },
   "unlock": "Deep middle",
   "take": "Out wide? Deep middle.",
   "lines": {
    "A": "Right: lands every time. They can only rally it.",
    "B": "More time if it lands, but only 7 in 10 do."
   }
  },
  {
   "ph": "Shot 3 · Line or cross",
   "short": "Line",
   "name": "They're still getting back",
   "scene": "ma3",
   "sit": "Their reply comes back. They're still getting back to the middle.",
   "q": "Where does it go?",
   "opts": [
    "Down the line",
    "Crosscourt"
   ],
   "correct": 0,
   "payoff": "Down the line goes away from where they're heading. They can only rally it.",
   "principle": "Line while they're still recovering.",
   "why": "They're still on their way back, so the line is open: it lands 8 in 10, they can only rally it, and you're in time. Crosscourt goes back toward them, they attack it, and you're only just in time.",
   "rail": [
    "1 Their reply",
    "2 They recover",
    "3 Your shot"
   ],
   "cues": {
    "ball": "THEIR REPLY",
    "you": "SET",
    "opp": "RECOVERING"
   },
   "unlock": "Line when they're off it",
   "take": "They're still getting back? Down the line.",
   "lines": {
    "A": "Right: away from them. They can only rally it.",
    "B": "Back toward them. They attack it."
   }
  }
 ]
};
