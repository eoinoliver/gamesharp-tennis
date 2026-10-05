const LESSON={
 "title": "The Moonballer: Take Their Time",
 "hook": "Their high, heavy balls push you back, and you end up playing their game.",
 "memHTML": "Don't play their game. <span>Take their time.</span>",
 "tomorrow": "Next time you play a moonballer, count how often you step in instead of backing up.",
 "drill": {
  "name": "Two steps in",
  "how": "Your partner loops high balls. Start each one on the baseline and take it before it climbs above your shoulder. Backing up behind the baseline loses the point."
 },
 "cue": "Step in. Take their time.",
 "callbackTags": [
  "vs_moonballer"
 ],
 "finaleScene": "mb2C",
 "authored": true,
 "cam0": {
  "c": {
   "az": -90,
   "el": 24,
   "d": 37,
   "fov": 32,
   "tgt": [
    0,
    -4.4,
    0
   ]
  },
  "phone": {
   "az": -90,
   "el": 26,
   "d": 49,
   "fov": 22.5,
   "tgt": [
    0,
    -4,
    0
   ]
  }
 },
 "startBehind": true,
 "steps": [
  {
   "ph": "See · Their pattern",
   "short": "See",
   "name": "Another moonball",
   "scene": "mb1",
   "sit": "Another high, heavy ball comes to your forehand. At the baseline it will kick above your shoulder.",
   "q": "Where do you take it?",
   "opts": [
    "Back up and loop it back",
    "Step in, take it on the rise",
    "Stay on the baseline, hit it high",
    "Back up, go for the winner"
   ],
   "correct": 1,
   "payoff": "You took their time. Rushed, their next ball landed short.",
   "principle": "Against a moonballer, move in, not back.",
   "why": "Backing up lets them run the rally from behind your baseline. Stepping in meets it at waist height, early, and they have less time to set up the next one.",
   "rail": [
    "1 Their moonball",
    "2 It kicks high",
    "3 Your move"
   ],
   "cues": {
    "ball": "MOONBALL",
    "you": "ON THE BASELINE",
    "opp": "DEEP"
   },
   "unlock": "Move in, not back",
   "take": "Moonballer? Step in early. Taking their time is the point.",
   "lines": {
    "A": "Four metres back, you loop it back — same rally, on their terms.",
    "B": "Taken early and deep — rushed, their reply lands short.",
    "C": "Shoulder high on the baseline — it floats back, same rally.",
    "D": "Flat from above your shoulder, way back — it sails long."
   }
  },
  {
   "ph": "Then · Their short ball",
   "short": "Then",
   "name": "The short ball",
   "scene": "mb2",
   "sit": "Rushed, they float one short. It lands inside your service line and sits up.",
   "q": "What now?",
   "opts": [
    "Drive it deep, stay back",
    "Slice it deep, stay back",
    "Approach deep, close in",
    "Loop it back high"
   ],
   "correct": 2,
   "payoff": "You came in behind it. Their answer was a lob, and you put it away.",
   "principle": "A moonballer is strongest at the back, weakest with you at the net.",
   "why": "From the back they can loop all day. With you at the net they have to pass or lob, and a lob from that deep lands short enough to smash.",
   "rail": [
    "1 Rushed",
    "2 A short ball",
    "3 Your move"
   ],
   "cues": {
    "ball": "SHORT BALL",
    "you": "INSIDE THE BASELINE",
    "opp": "DEEP"
   },
   "unlock": "Take the net",
   "take": "Short ball from a moonballer? Approach and close in.",
   "lines": {
    "A": "Deep, but you stay back — they're back to their game.",
    "B": "Low and deep, but you stay back — back to their game.",
    "C": "You close in; their lob lands short and you put it away.",
    "D": "Looped high — exactly the ball they want."
   }
  },
  {
   "ph": "Contrast · The deep lob",
   "short": "Contrast",
   "name": "They lob you deep",
   "scene": "mb3",
   "sit": "You're at the net again. This time their lob is deep and high, over your head.",
   "q": "How do you play it?",
   "opts": [
    "Leave it, it's going long",
    "Let it bounce, lob it back",
    "Smash it in the air, backing up",
    "Let it bounce, then smash"
   ],
   "correct": 3,
   "payoff": "You let it bounce, got behind it and stayed on top of the point.",
   "principle": "Short lob: smash it. Deep lob: let it bounce first.",
   "why": "Backing up under a deep, high lob is the classic mishit. Let it bounce, get behind it, and hit the overhead with your weight going forward.",
   "rail": [
    "1 You're at the net",
    "2 A deep lob",
    "3 Your move"
   ],
   "cues": {
    "ball": "DEEP LOB",
    "you": "AT THE NET",
    "opp": "DEEP"
   },
   "unlock": "Deep lob? Let it bounce",
   "take": "Short lob, smash it. Deep lob, let it bounce, then smash.",
   "lines": {
    "A": "It drops in — their point.",
    "B": "Safe, but a high ball back hands them their game.",
    "C": "Backing up under it — mishit, long.",
    "D": "Behind the bounce, overhead — you stay on top of the point."
   }
  }
 ]
};
