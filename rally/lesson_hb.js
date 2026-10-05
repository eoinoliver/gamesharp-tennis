const LESSON={
 "title": "One High Ball. Two Opposite Answers.",
 "hook": "You retreat from every high forehand—or step into every one—and donate court.",
 "memHTML": "Find the contact, <span>not the height.</span>",
 "tomorrow": "Next time a ball climbs, notice its depth and your position before adjusting.",
 "pro": {
  "player": "Iga Swiatek",
  "label": "What Swiatek chose to teach",
  "moment": "For her TopCourt class, Swiatek chose drills for \"handling high moon balls\" and \"getting in excellent court positioning\".",
  "read": "Champions practise the awkward ball, not just the clean one.",
  "src": "WTA, TopCourt feature",
  "url": "https://www.wtatennis.com/news/2214387/topcourt-the-secrets-to-swiateks-explosive-game"
 },
 "drill": {
  "name": "In or back",
  "how": "Your partner feeds high balls, some short, some deep. Call \"in\" or \"back\" before the bounce, then play it. A wrong call loses the point."
 },
 "cue": "Find the contact, not the height.",
 "callbackTags": [
  "high_ball"
 ],
 "finaleScene": "hb2A",
 "cam0": {
  "c": {
   "az": -90,
   "el": 24,
   "d": 34,
   "fov": 31,
   "tgt": [
    0,
    -3.2,
    0
   ]
  },
  "phone": {
   "az": -90,
   "el": 26,
   "d": 46,
   "fov": 21.5,
   "tgt": [
    0,
    -2.8,
    0
   ]
  }
 },
 "steps": [
  {
   "ph": "See · Use the available time",
   "short": "See",
   "name": "A shorter high ball",
   "scene": "hb1",
   "sit": "A slower, high ball lands short. You're balanced, with time to move.",
   "q": "Where do you meet this ball?",
   "opts": [
    "Stay where you are and wait",
    "Back up and let it drop",
    "Move in and take it early",
    "Move in halfway, meet it high"
   ],
   "correct": 2,
   "payoff": "Stepping in uses your time before the ball climbs.",
   "principle": "A short high ball can be met early. Take it before it climbs.",
   "why": "Waiting lets it climb above your shoulder. Backing up works, but gives them time and court. Moving in meets it at waist height.",
   "rail": [
    "1 Shorter bounce",
    "2 You're set",
    "3 Ball climbs"
   ],
   "cues": {
    "ball": "SLOW & HIGH",
    "you": "SET",
    "opp": "HEAVY TOPSPIN"
   },
   "unlock": "Take it before it climbs",
   "take": "Short and high? Step in and take it before it climbs.",
   "alsoOk": [
    1
   ],
   "lines": {
    "A": "Waiting, it's above your shoulder — you float it, they attack.",
    "B": "Backing up works — waist high — but they get time and hit harder.",
    "C": "Stepping in, you take it waist high — they run for it; you're in time.",
    "D": "Halfway in, it's shoulder high — you float it, they attack."
   }
  },
  {
   "ph": "Contrast · The early window has passed",
   "short": "Contrast",
   "name": "A deeper high ball",
   "scene": "hb2",
   "sit": "The next high ball lands deeper, while you're still getting back.",
   "q": "Where do you meet this one?",
   "opts": [
    "Back up and let it drop",
    "Hold your ground, hit it high",
    "Move sideways, same depth",
    "Move in and take it early"
   ],
   "correct": 0,
   "payoff": "The early chance has gone. Back up and let it come down.",
   "principle": "Same height, different answer when you arrive late.",
   "why": "You can't get in early enough, so moving in meets it high. Backing up gives it time to drop to chest height.",
   "rail": [
    "1 Deeper bounce",
    "2 You're recovering",
    "3 Ball climbs"
   ],
   "cues": {
    "ball": "DEEPER",
    "you": "RECOVERING",
    "opp": "HEAVY TOPSPIN"
   },
   "unlock": "Make room for the drop",
   "take": "Late on a high ball? Back up and let it drop to chest height.",
   "lines": {
    "A": "Backing up, it drops to chest high — a deep drive; you're in time.",
    "B": "Holding, it's above your shoulder — you float it, they attack.",
    "C": "Sideways doesn't change depth — above your shoulder, they attack.",
    "D": "Too late to take it early — it's shoulder high, they attack."
   }
  },
  {
   "ph": "Transfer · Read your starting position",
   "short": "Transfer",
   "name": "Already well back",
   "scene": "hb3",
   "sit": "You're already well behind the baseline. The same deep ball comes.",
   "q": "Where do you meet it?",
   "opts": [
    "Back up even further",
    "Stay put, small steps",
    "Move in quickly",
    "One step in, take it higher"
   ],
   "correct": 1,
   "payoff": "You already have the space. Stay and let it come down.",
   "principle": "Read where you're standing, not just the bounce.",
   "why": "From here, holding your spot meets it at chest height. Backing up further gives away court; moving in meets it higher.",
   "rail": [
    "1 Well behind",
    "2 Same bounce",
    "3 Ball drops"
   ],
   "cues": {
    "ball": "DEEPER",
    "you": "WELL BACK",
    "opp": "HEAVY TOPSPIN"
   },
   "unlock": "You already have the space",
   "take": "Already deep? Hold your spot — the ball comes down to you.",
   "lines": {
    "A": "Too far back — it bounces twice before you get there.",
    "B": "Holding, it drops to chest high — a deep drive; you're in time.",
    "C": "Moving in, it's above your shoulder — you float it, they attack.",
    "D": "One step in makes it shoulder high — you loop it, only just in time."
   }
  }
 ]
};
