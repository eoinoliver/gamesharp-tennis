const LESSON={
 "title": "Saturday Point #3",
 "hook": "Your serve at 30–40, built from five more of your lessons. Two choices each shot: the one you want to hit, and the one that wins.",
 "memHTML": "Serve it up high. <span>Step in, make space, keep it low.</span>",
 "tomorrow": "In your next match, on a second serve, aim deep with kick, then look for their high, short reply and step in.",
 "cam0": {
  "follow": true
 },
 "finaleScene": "sc5B",
 "finaleFull": true,
 "flow": true,
 "redoLabel": "Play the point again",
 "uses": [
  {
   "step": 1,
   "lesson": "second-serve"
  },
  {
   "step": 2,
   "lesson": "high-ball"
  },
  {
   "step": 3,
   "lesson": "running-around"
  },
  {
   "step": 4,
   "lesson": "contact-clue"
  },
  {
   "step": 5,
   "lesson": "net-rusher"
  }
 ],
 "steps": [
  {
   "ph": "Shot 1 · Your second serve",
   "short": "Serve",
   "name": "Break point down",
   "scene": "sc1",
   "sit": "30–40. You missed your first serve.",
   "q": "Where does your second serve go?",
   "opts": [
    "Safe, into the middle of the box",
    "Deep, with kick"
   ],
   "correct": 1,
   "payoff": "Deep with kick reaches them above the shoulder.",
   "principle": "In is only the beginning. Judge a second serve by the contact it gives them.",
   "why": "The safe serve lands in but sits up at chest height, so they step in and attack. Deep with kick climbs above their shoulder and their return is weak.",
   "rail": [
    "1 Second serve",
    "2 Their contact",
    "3 Their return"
   ],
   "cues": {
    "ball": "SECOND SERVE",
    "you": "30–40",
    "opp": "RECEIVER"
   },
   "unlock": "Serve it up high",
   "take": "Second serve? Deep with kick.",
   "lines": {
    "A": "It sits up chest high. They step in and attack; you're stretched.",
    "B": "Right: it climbs above their shoulder."
   }
  },
  {
   "ph": "Shot 2 · Their high return",
   "short": "High ball",
   "name": "High and short",
   "scene": "sc2",
   "sit": "Their return floats back high and short.",
   "q": "How do you take it?",
   "opts": [
    "Move in and take it early",
    "Stay back and take it at the top"
   ],
   "correct": 0,
   "payoff": "Moving in meets it at your waist, before it climbs.",
   "principle": "A short high ball can be met early. Take it before it climbs.",
   "why": "Staying back, it reaches you above the shoulder and you can only float it back. Moving in, you meet it at waist height and drive it deep.",
   "rail": [
    "1 High return",
    "2 Your move",
    "3 Your contact"
   ],
   "cues": {
    "ball": "HIGH, SHORT",
    "you": "READ IT",
    "opp": "RECEIVER"
   },
   "unlock": "Take it early",
   "take": "High and short? Move in and take it early.",
   "lines": {
    "A": "Right: waist high, and you drive it deep.",
    "B": "Above your shoulder: you float it back, and you're stretched."
   }
  },
  {
   "ph": "Shot 3 · Their slice",
   "short": "Run around",
   "name": "Low and slow",
   "scene": "sc3",
   "sit": "They slice it back low and slow, into your backhand half.",
   "q": "Backhand, or run around it?",
   "opts": [
    "Play the backhand",
    "Run around for the forehand"
   ],
   "correct": 1,
   "payoff": "The slow slice buys the time to set up your bigger weapon.",
   "principle": "Use the bigger weapon when you have time to set it up.",
   "why": "A low, slow slice gives you time. The backhand only keeps the rally neutral; running around puts your forehand on a ball you can attack.",
   "rail": [
    "1 Their slice",
    "2 Time",
    "3 Your weapon"
   ],
   "cues": {
    "ball": "LOW SLICE",
    "you": "YOUR CHOICE",
    "opp": "RECOVERING"
   },
   "unlock": "Earn the forehand",
   "take": "Slow slice to your backhand? Run around it.",
   "lines": {
    "A": "Safe, but it's just a neutral rally ball. You're in time.",
    "B": "Right: there's time to get round it."
   }
  },
  {
   "ph": "Shot 4 · Your last steps",
   "short": "Space",
   "name": "Getting round it",
   "scene": "sc4",
   "sit": "You're getting round it for the forehand.",
   "q": "Your last steps before contact?",
   "opts": [
    "Small steps, to leave space",
    "One big step to the ball"
   ],
   "correct": 0,
   "payoff": "Space at contact is what lets you swing through.",
   "principle": "Check the space at contact first.",
   "why": "One big step lands you on top of the ball: crowded, the swing comes off short and slow, and they attack it. Small steps leave room to drive it deep.",
   "rail": [
    "1 Running round",
    "2 Last steps",
    "3 Contact"
   ],
   "cues": {
    "ball": "THEIR SLICE",
    "you": "GETTING ROUND",
    "opp": "WAITING"
   },
   "unlock": "Make space",
   "take": "Last steps? Small ones. Leave space.",
   "lines": {
    "A": "Right: space to swing. Deep crosscourt, and they chip and charge.",
    "B": "Crowded: it comes off short and slow, and they attack it."
   }
  },
  {
   "ph": "Shot 5 · Your pass",
   "short": "Pass",
   "name": "They come in",
   "scene": "sc5",
   "sit": "They chip it and come in, stopping around the service line.",
   "q": "How do you pass them?",
   "opts": [
    "Topspin lob over them",
    "Dip it at their feet"
   ],
   "correct": 1,
   "payoff": "At the service line, a ball at their feet makes them volley up.",
   "principle": "Read where they stop. At the service line: their feet.",
   "why": "Stopping at the service line, they have time to cover a lob and put it away. A dipping ball at their feet makes them volley up, and you pass the floater.",
   "rail": [
    "1 They charge",
    "2 Where they stop",
    "3 Your pass"
   ],
   "cues": {
    "ball": "THEIR CHIP",
    "you": "PASSER",
    "opp": "AT THE SERVICE LINE"
   },
   "unlock": "Feet, or over them",
   "take": "Net rusher at the service line? Their feet.",
   "lines": {
    "A": "From the service line they get to the lob and volley it away.",
    "B": "Right: they volley up, and you pass them."
   }
  }
 ]
};
