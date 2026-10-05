const LESSON={
 "title": "The Line Must Be Earned",
 "hook": "The open line tempts you from a low or stretched ball, and leaves your whole court open.",
 "memHTML": "Open space is <span>not permission.</span>",
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
 "tomorrow": "Next time the line opens, check contact height and balance before taking it.",
 "pro": {
  "player": "Roger Federer",
  "label": "Federer v Nadal, Australian Open 2017 final",
  "moment": "Second set, 30/40: Nadal went all-out on a forehand down the line, and Federer flicked a forehand back into the open court to break.",
  "read": "The line can open the reply behind you.",
  "src": "ATP Tour, match report",
  "url": "https://www.atptour.com/en/news/federer-nadal-australian-open-2017-final"
 },
 "drill": {
  "name": "Crosscourt until earned",
  "how": "Rally crosscourt. You may change to the line only off a waist-high ball you're balanced for. A line attempt from a low or stretched ball loses the point, in or out."
 },
 "cue": "Heavy crosscourt until I earn the line.",
 "callbackTags": [
  "line_choice"
 ],
 "finaleScene": "ln2B",
 "steps": [
  {
   "ph": "See · Read the contact",
   "short": "See",
   "name": "Low and stretched",
   "scene": "ln1",
   "sit": "The line is open, but the low ball pulls you wide near the sideline.",
   "q": "Is this the ball to go down the line?",
   "opts": [
    "Yes: drive it deep down the line",
    "Float it through the middle",
    "No: crosscourt, lots of net",
    "Short crosscourt, then come in"
   ],
   "correct": 2,
   "payoff": "The court was open. Your contact wasn't.",
   "principle": "Low and stretched hasn't earned the line.",
   "why": "Crosscourt gives you more court, a lower net and time to recover. The line asks a difficult ball to do even more.",
   "rail": [
    "1 Low ball",
    "2 Stretched",
    "3 Long way home"
   ],
   "cues": {
    "ball": "LOW",
    "you": "STRETCHED",
    "opp": "LINE OPEN"
   },
   "unlock": "The line is not free",
   "take": "Low and stretched? Crosscourt first — the line can wait.",
   "lines": {
    "A": "Low, stretched and flat at the line — a fraction off, and it's wide.",
    "B": "Short through the middle — they step in and hit where you're not.",
    "C": "Crosscourt gives you net, court and time — you're back in the rally.",
    "D": "Short and soft, then forward — they pass you."
   }
  },
  {
   "ph": "Contrast · Earn the line",
   "short": "Contrast",
   "name": "Waist-high and balanced",
   "scene": "ln2",
   "sit": "The next crosscourt lands shorter. You meet it waist-high and balanced.",
   "q": "What's on now?",
   "opts": [
    "Deep crosscourt again",
    "Down the line, well inside it",
    "A drop shot, then come in",
    "High through the middle"
   ],
   "correct": 1,
   "payoff": "Now the line is on — not compulsory.",
   "principle": "Height and balance earn the line. Judgement still picks the target.",
   "why": "The shorter ball lets you set up and hit it at a comfortable height. Keep a margin: down the line gives you less court.",
   "rail": [
    "1 Waist-high",
    "2 Balanced",
    "3 Base secure"
   ],
   "cues": {
    "ball": "WAIST-HIGH",
    "you": "BALANCED",
    "opp": "LINE OPEN"
   },
   "unlock": "Now the line is earned",
   "take": "Waist-high and balanced: the line is on — take it with margin.",
   "lines": {
    "A": "Safe, but the line was on — the rally just goes on.",
    "B": "Down the line, well inside it — they scramble, and the reply is yours.",
    "C": "A drop from the back of the court — they run it down and pass you.",
    "D": "High through the middle gives them back their time."
   }
  },
  {
   "ph": "Transfer · Change wings",
   "short": "Transfer",
   "name": "Low forehand, on the move",
   "scene": "ln3",
   "sit": "A deep forehand stays low. You reach it near the sideline, on the move.",
   "q": "Which reply protects this ball?",
   "opts": [
    "Down the line, behind them",
    "Short crosscourt, stay back",
    "High through the middle, then in",
    "Deep crosscourt, then recover"
   ],
   "correct": 3,
   "payoff": "Different wing, same problem: low and moving hasn't earned the line.",
   "principle": "Whether the line is on depends on the ball, not the wing.",
   "why": "The forehand may feel stronger, but a low ball on the move still costs control. Crosscourt gives you net, court and time.",
   "rail": [
    "1 Low ball",
    "2 Moving",
    "3 Long way home"
   ],
   "cues": {
    "ball": "LOW",
    "you": "MOVING",
    "opp": "LINE OPEN"
   },
   "unlock": "The wing doesn’t decide",
   "take": "Low and on the move? Either wing — crosscourt, then recover.",
   "lines": {
    "A": "They get there and go crosscourt — into the court you left.",
    "B": "Short crosscourt sits up — they step in and punish it.",
    "C": "High through the middle, then forward — they pass you.",
    "D": "Crosscourt buys the time to get back — you're back in the rally."
   }
  }
 ]
};
