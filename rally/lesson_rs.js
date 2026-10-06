const LESSON={
 "title": "Find Your Return Spot",
 "hook": "Where you stand decides how much time you get. Against a big first serve and a kick second serve, the answer is opposite.",
 "memHTML": "Back for the big one. <span>In for the kick.</span>",
 "tomorrow": "Next match: two steps back for their first serve, and step in for the second. Notice how much more time the first gives you.",
 "pro": {
  "player": "Daniil Medvedev",
  "label": "Medvedev's deep return position",
  "moment": "Medvedev returns first serves from six metres or more behind the baseline, and still lands 43% of his first-serve returns closer to the baseline than the service line, tied third on tour in the 2023 tracking.",
  "read": "Depth buys time against pace. Time buys a deep return.",
  "src": "ATP Tour, Craig O'Shannessy, Infosys ATP Return Tracker (Aug 2023)",
  "url": "https://www.atptour.com/en/news/medvedev-infosys-beyond-the-numbers-august-2023"
 },
 "drill": {
  "name": "Two spots",
  "how": "Your partner alternates big first serves and kick second serves. Return the first from two steps back and the second from inside the baseline. Score a point for every return that lands past the service line."
 },
 "cue": "Back for the big one. In for the kick.",
 "callbackTags": [
  "return_position"
 ],
 "finaleScene": "rs1B",
 "startBehind": true,
 "steps": [
  {
   "ph": "See · The big serve",
   "short": "See",
   "name": "Their first serve",
   "scene": "rs1",
   "sit": "They hit a big first serve, around 185 km/h, down the T.",
   "q": "Where do you stand to return it?",
   "opts": [
    "On the baseline",
    "Two steps behind it",
    "A step inside it",
    "Well back, three steps"
   ],
   "correct": 1,
   "payoff": "Two steps back gives the most time, and the deep return pushes them back.",
   "principle": "Against pace, buy time with where you stand.",
   "why": "Two steps back, the ball has slowed and you're set early, so you can send it deep. On or inside the baseline you're only in time, and it comes back short. Much further back, it drops and you have to come forward again.",
   "rail": [
    "1 Big serve",
    "2 Your spot",
    "3 Your return"
   ],
   "cues": {
    "ball": "185 KM/H",
    "you": "RETURNER",
    "opp": "BIG SERVER"
   },
   "unlock": "Buy time",
   "take": "Big first serve? Two steps back.",
   "lines": {
    "A": "From the baseline it's back in play, short. They step in.",
    "B": "Right: set early. A deep return, and they're pushed back.",
    "C": "Inside the baseline you're rushed. Back in play; they step in.",
    "D": "Too far back: it drops, you come forward, and they step in."
   }
  },
  {
   "ph": "Contrast · The kick serve",
   "short": "Contrast",
   "name": "Their second serve",
   "scene": "rs2",
   "sit": "Now a second serve: a slower kick that climbs after it bounces.",
   "q": "Where do you stand now?",
   "opts": [
    "A step inside the baseline",
    "Two steps behind it",
    "On the baseline",
    "Well back, three steps"
   ],
   "correct": 0,
   "payoff": "Step in and take the kick before it climbs.",
   "principle": "Same returner, opposite answer: in for the kick.",
   "why": "The kick climbs after the bounce. Stepping in, you meet it chest high and drive it deep. From the baseline it's shoulder high and you can only loop it. From two steps back it's past you.",
   "rail": [
    "1 Kick serve",
    "2 Your spot",
    "3 Your contact"
   ],
   "cues": {
    "ball": "KICK SERVE",
    "you": "RETURNER",
    "opp": "SECOND SERVE"
   },
   "unlock": "In for the kick",
   "take": "Kick second serve? Step in.",
   "lines": {
    "A": "Right: chest high, before it climbs. Deep, and they're pushed back.",
    "B": "From back there the kick is past you. Too late.",
    "C": "Shoulder high on the baseline: you loop it, and they step in.",
    "D": "Way back, it's gone before you get there."
   }
  },
  {
   "ph": "Transfer · Their pattern",
   "short": "Transfer",
   "name": "Wide, every big point",
   "scene": "rs3",
   "sit": "On every big point they go to the same serve: big and wide.",
   "q": "Where do you stand?",
   "opts": [
    "Central, as usual",
    "One step toward the wide serve",
    "Two steps toward the wide serve",
    "A step toward the T"
   ],
   "correct": 2,
   "payoff": "Against a pattern, shade toward it: two steps gets it back in play.",
   "principle": "Read their pattern and shade to it. It gives them the T, so shade only for a real pattern.",
   "why": "Their wide serve is the hardest to reach. From the middle it's past you; one step only gets a rushed block. Two steps toward it gets it back, though it leaves the T open if they change.",
   "rail": [
    "1 Their pattern",
    "2 Your spot",
    "3 Your return"
   ],
   "cues": {
    "ball": "BIG AND WIDE",
    "you": "RETURNER",
    "opp": "BIG POINT"
   },
   "unlock": "Shade to the pattern",
   "take": "Same serve on every big point? Shade toward it.",
   "lines": {
    "A": "From the middle their best wide serve is past you.",
    "B": "One step isn't enough: rushed, a short block, and they step in.",
    "C": "Right: two steps over gets it back in play.",
    "D": "Shading the wrong way: it's past you."
   }
  }
 ]
};
