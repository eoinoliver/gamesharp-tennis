const LESSON={
 "title": "Play the Point",
 "hook": "Three shots, your calls. Each choice decides what happens next.",
 "memHTML": "Serve to open it. <span>Hit behind them to finish it.</span>",
 "tomorrow": "Before your next service game, plan two shots: serve wide, then hit into the open court.",
 "branch": "bp1",
 "nodes": {
  "bp1": {
   "ph": "Shot 1 · Your serve",
   "short": "Serve",
   "name": "Your serve",
   "scene": "bp1",
   "sit": "Your serve. They're standing guard in the middle, ready for it.",
   "q": "Where do you serve?",
   "opts": [
    "Down the T, into the middle",
    "Wide, towards the sideline"
   ],
   "correct": 1,
   "lines": {
    "A": "They stay central and hit a deep return. Your point to play, but no opening yet.",
    "B": "It pulls them off the court. They block it back short: the court is open."
   },
   "payoff": "The wide serve pulled them off the court and set up your next shot.",
   "principle": "Serve to open the court, not just to start the point.",
   "why": "A serve down the T keeps the returner in the middle, where every shot is easy to cover. A wide serve moves them before the rally starts.",
   "rail": [
    "1 Your serve",
    "2 Their return",
    "3 Your next ball"
   ],
   "unlock": "Serve to open the court",
   "take": "Serve to open the court, not just to start the point."
  },
  "bp1A": {
   "ph": "Shot 2 · Your next ball",
   "short": "Next ball",
   "name": "After a deep return",
   "scene": "bp2A",
   "sit": "Their return comes back deep. They're back in the middle and set.",
   "q": "Where does your next ball go?",
   "opts": [
    "Deep through the middle",
    "Into the open corner",
    "Back to where they are"
   ],
   "correct": 1,
   "lines": {
    "A": "It lands in their strike zone. They hit through it. Back to even.",
    "B": "They have to run for it and can only float it back. You're set early.",
    "C": "It goes where they already are. They take a full swing. Back to even."
   },
   "payoff": "Even from a deep return, the open corner made them run and float it back.",
   "principle": "Make them move before you try to finish.",
   "why": "A ball to the middle, or back to them, lets them swing from balance. The open corner makes them hit on the run, and running players float it back.",
   "rail": [
    "1 Their return",
    "2 Your next ball",
    "3 Their reply"
   ],
   "unlock": "Make them run first",
   "take": "Hit your next ball where they aren't, before trying to finish."
  },
  "bp1B": {
   "ph": "Shot 2 · Your next ball",
   "short": "Next ball",
   "name": "After a short return",
   "scene": "bp2B",
   "sit": "Their blocked return lands short. They're still out wide, scrambling back.",
   "q": "Where does your next ball go?",
   "opts": [
    "Deep through the middle",
    "Into the open corner",
    "Back to where they are"
   ],
   "correct": 1,
   "lines": {
    "A": "It lands where they're heading. They get there and hit it hard. Back to even.",
    "B": "The court is empty. They reach it at a full sprint and can only float it back.",
    "C": "It goes back to the side they're on. They take a full swing. Back to even."
   },
   "payoff": "Your serve opened the court and your next ball went straight into it.",
   "principle": "The serve opens the court; the next ball uses it.",
   "why": "They're still out wide from the serve. Into the open corner, they have the whole court to run and only a float to hit.",
   "rail": [
    "1 Their short return",
    "2 Your next ball",
    "3 Their reply"
   ],
   "unlock": "Hit the open court",
   "take": "After a wide serve, the next ball goes into the open court."
  },
  "bp2AB": {
   "ph": "Shot 3 · The finish",
   "short": "Finish",
   "name": "Their float",
   "scene": "bp3AB",
   "sit": "Their float sits up. They're sprinting back towards the middle.",
   "q": "Where do you finish?",
   "opts": [
    "Where they're running to",
    "Deep down the middle",
    "Behind them, into the corner"
   ],
   "correct": 2,
   "alsoOk": [
    0
   ],
   "lines": {
    "A": "They get there and chip it back. Still your point, but not finished.",
    "B": "It meets them on the way back. Back to even.",
    "C": "They turn back and chip it. Still yours, but a T serve never opened enough."
   },
   "payoff": "You kept control, but after a T serve they were never far enough off the court for a winner.",
   "principle": "Hit behind a recovering player.",
   "why": "They're sprinting back to the middle. Hitting where they're going lets them arrive and play; hitting behind them makes them stop, turn and go back, and nobody does that in time.",
   "rail": [
    "1 Their float",
    "2 They recover",
    "3 Your finish"
   ],
   "unlock": "Hit behind them",
   "take": "When they're sprinting back, hit behind them."
  },
  "bp2BB": {
   "ph": "Shot 3 · The finish",
   "short": "Finish",
   "name": "Their float",
   "scene": "bp3BB",
   "sit": "Their float sits up. They're sprinting back towards the middle.",
   "q": "Where do you finish?",
   "opts": [
    "Where they're running to",
    "Deep down the middle",
    "Behind them, into the corner"
   ],
   "correct": 2,
   "lines": {
    "A": "Into their run. They get there and chip it back. Still your point, not finished.",
    "B": "It meets them on the way back. Back to even.",
    "C": "They're running the other way and can't turn in time. Winner."
   },
   "payoff": "Serve wide, open corner, behind them: you built that winner in three shots.",
   "principle": "Hit behind a recovering player.",
   "why": "They're sprinting back to the middle. Hitting where they're going lets them arrive and play; hitting behind them makes them stop, turn and go back, and nobody does that in time.",
   "rail": [
    "1 Their float",
    "2 They recover",
    "3 Your finish"
   ],
   "unlock": "Hit behind them",
   "take": "When they're sprinting back, hit behind them."
  }
 },
 "steps": [],
 "finaleScene": "bp1B",
 "finaleFull": true,
 "redoLabel": "Play another point"
};
