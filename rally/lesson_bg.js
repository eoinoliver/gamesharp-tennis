const LESSON={
 "title": "The Big Hitter: Time for You, Not Them",
 "hook": "Their ball arrives fast and heavy. Win back your time, and keep the ball out of their favourite height.",
 "memHTML": "Take a step back. <span>Keep it out of their zone.</span>",
 "tomorrow": "Next time someone hits big, take one step back before the rally starts and notice how much time it gives you.",
 "pro": {
  "player": "Corentin Moutet",
  "label": "Moutet's slice against bigger hitters",
  "moment": "The ATP Tour's TopCourt piece with Moutet shows how he keeps his backhand slice low and angling away to neutralise bigger hitters, turning a game of power into a game of chess.",
  "read": "Pace needs a ball at the right height. Don't give it to them.",
  "src": "ATP Tour, TopCourt (Dec 2022)",
  "url": "https://www.atptour.com/en/news/topcourt-corentin-moutet-december-2022"
 },
 "drill": {
  "name": "Out of the zone",
  "how": "Your partner feeds hard, deep balls. Start one big step behind the baseline. Score a point for every reply that reaches them below the knee or above the shoulder, and lose one for every ball that sits at their waist."
 },
 "cue": "Step back. Keep it out of their zone.",
 "callbackTags": [
  "big_hitter"
 ],
 "finaleScene": "bg3B",
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
 "startBehind": true,
 "steps": [
  {
   "ph": "See · Your time",
   "short": "See",
   "name": "Their big ball",
   "scene": "bg1",
   "sit": "They hit big. Their crosscourt forehand is coming into your backhand corner at 125 km/h.",
   "q": "Where do you wait for it?",
   "opts": [
    "Well behind the baseline",
    "On the baseline, as usual",
    "One big step back",
    "A step inside the baseline"
   ],
   "correct": 2,
   "payoff": "One big step back gives you about twice the time of your usual spot.",
   "principle": "Against pace, buy time with your feet first.",
   "why": "Their ball covers the court so fast that your usual spot leaves a third of a second. One big step back lets it slow and drop, so you meet it with time to spare. Much further back, you have to come forward again.",
   "rail": [
    "1 Big ball",
    "2 Your spot",
    "3 Your time"
   ],
   "cues": {
    "ball": "125 KM/H",
    "you": "WHERE DO YOU WAIT?",
    "opp": "BIG HITTER"
   },
   "unlock": "Buy time with your feet",
   "take": "Facing a big hitter? Start one big step back.",
   "lines": {
    "A": "Way back, you have to come forward to meet it: 0.4 s to spare.",
    "B": "Your usual spot: only a third of a second to spare.",
    "C": "Right: one big step back gives you 0.6 s, about twice as long.",
    "D": "Inside the baseline, their pace rushes you: 0.1 s to spare."
   }
  },
  {
   "ph": "Contrast · Their zone",
   "short": "Contrast",
   "name": "What you send back",
   "scene": "bg2",
   "sit": "You're set, a step back. Their best shots come from a ball at waist to chest height.",
   "q": "Which reply keeps their next ball small?",
   "opts": [
    "Low slice, crosscourt",
    "Deep through the middle",
    "Flat and hard, crosscourt",
    "Deep and heavy, crosscourt"
   ],
   "correct": 0,
   "payoff": "Below their waist, they can't swing big.",
   "principle": "Pace needs the right height. Don't give it to them.",
   "why": "Deep through the middle and the heavy crosscourt both reach them waist high, their favourite height, and the big ball comes back. The low slice stays below their waist and takes long enough to get there that you're ready again. Flat and hard lands 9 in 10, the slice every time.",
   "rail": [
    "1 You're set",
    "2 Their zone",
    "3 Your reply"
   ],
   "cues": {
    "ball": "YOUR REPLY",
    "you": "SET, A STEP BACK",
    "opp": "WAITS AT WAIST HEIGHT"
   },
   "unlock": "Keep it out of their zone",
   "take": "Big hitter? Keep it out of their zone.",
   "lines": {
    "A": "Right: the slice stays below their waist. Rally pace back; you're in time.",
    "B": "Deep middle sits at their waist: their big ball, and you're stretched.",
    "C": "Flat lands 9 in 10, 62 cm over the net. The slice lands every time.",
    "D": "The heavy ball reaches them waist high: big ball back, just in time."
   }
  },
  {
   "ph": "Transfer · Your forehand",
   "short": "Transfer",
   "name": "Now to your forehand",
   "scene": "bg3",
   "sit": "Their big inside-out forehand is coming to your forehand. Choose where you wait and what you hit.",
   "q": "What's your plan?",
   "opts": [
    "Baseline, deep and heavy",
    "Step back, high over their shoulder",
    "Step inside, flat and hard",
    "Step back, deep through the middle"
   ],
   "correct": 1,
   "payoff": "Time first, then keep it out of their zone, this time over the top.",
   "principle": "Low or high: anything but their waist.",
   "why": "Stepping inside leaves you rushed, and a rushed ball lands short, where they step in and swing big. From a step back, a high ball reaches them above the shoulder, and their reply comes back at rally pace.",
   "rail": [
    "1 Big ball",
    "2 Your spot",
    "3 Your reply"
   ],
   "cues": {
    "ball": "125 KM/H",
    "you": "YOUR PLAN?",
    "opp": "BIG HITTER"
   },
   "unlock": "Same rule, other wing",
   "take": "Low slice or high ball: anything but their waist.",
   "lines": {
    "A": "Heavy and deep still reaches their waist: big ball back, just in time.",
    "B": "Right: time first, then over their shoulder. Rally pace back; you're in time.",
    "C": "Inside the baseline you're rushed; it lands short and their big ball wins.",
    "D": "Deep middle sits at their waist: their big ball, and you're stretched."
   }
  }
 ]
};
