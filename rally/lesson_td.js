const LESSON={
  "title": "Reach the Drop",
  "decisionCount": 2,
  "hook": "Two connected choices. Watch what your first shot creates.",
  "liveIntro": "You read the drop late from behind the baseline. You reach it low, still moving forward.",
  "specificFeedback": true,
  "livePoint": true,
  "family": "drop-arrival",
  "edition": "ten-live-v1",
  "branch": "td1",
  "nodes": {
    "td1A": {
      "scene": "td1A",
      "ph": "Live Point",
      "short": "Read",
      "name": "You reached it. What does this next contact need?",
      "sit": "They reply to your backhand as you regain a balanced net position.",
      "q": "You reached it. What does this next contact need?",
      "opts": [
        "Compact placement with depth",
        "Place a short angled reply"
      ],
      "correct": 0,
      "lines": {
        "A": "You regain control with a compact volley and a generous target.",
        "B": "The small angle lands, but adds difficulty while you are finding balance."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Reaching a drop shot is only the first job. Your balance shapes the reply.",
      "payoff": "Reaching a drop shot is only the first job. Your balance shapes the reply.",
      "principle": "Reach the ball, then find balance. Keep the next shot playable.",
      "why": "A late pickup below the net needs clearance and a manageable target. The illustration shows a playable recovery, not a miracle winner. After the pickup, organise your feet and racket for the actual passing shot.",
      "opening": {
        "scene": "td1AA",
        "from": 441,
        "to": 441,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "td1B": {
      "scene": "td1B",
      "ph": "Live Point",
      "short": "Read",
      "name": "You reached it. What does this next contact need?",
      "sit": "They reach the shorter pickup and pass wider to your backhand. You are still correcting.",
      "q": "You reached it. What does this next contact need?",
      "opts": [
        "Compact placement with depth",
        "Place a short angled reply"
      ],
      "correct": 0,
      "lines": {
        "A": "You adjust to the wider pass and keep the next ball playable.",
        "B": "The wider contact makes that short target even more demanding."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Reaching a drop shot is only the first job. Your balance shapes the reply.",
      "payoff": "Reaching a drop shot is only the first job. Your balance shapes the reply.",
      "principle": "Reach the ball, then find balance. Keep the next shot playable.",
      "why": "A late pickup below the net needs clearance and a manageable target. The illustration shows a playable recovery, not a miracle winner. After the pickup, organise your feet and racket for the actual passing shot.",
      "opening": {
        "scene": "td1BA",
        "from": 418,
        "to": 418,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "td1": {
      "scene": "td1",
      "ph": "Live Point",
      "short": "Read",
      "name": "What is realistic from this late pickup?",
      "sit": "You read the drop late from behind the baseline. You reach it low, still moving forward.",
      "q": "What is realistic from this late pickup?",
      "opts": [
        "Lift deep through the middle and find balance",
        "Place a short angled reply"
      ],
      "correct": 0,
      "lines": {
        "A": "You lift the low ball and send them back. Find balance for their reply.",
        "B": "It lands here, but leaves a short ball and little margin. Watch them move in."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Reaching a drop shot is only the first job. Your balance shapes the reply.",
      "payoff": "Reaching a drop shot is only the first job. Your balance shapes the reply.",
      "principle": "Reach the ball, then find balance. Keep the next shot playable.",
      "why": "A late pickup below the net needs clearance and a manageable target. The illustration shows a playable recovery, not a miracle winner. After the pickup, organise your feet and racket for the actual passing shot."
    }
  },
  "steps": [],
  "finaleScene": "td1AA",
  "finaleFull": true,
  "memHTML": "Reach the ball, then find balance. Keep the next shot playable.",
  "cue": "Reach the ball, then find balance. Keep the next shot playable.",
  "callbackTags": [
    "drop-pickup",
    "balance-recovery"
  ],
  "tomorrow": "Reaching a drop shot is only the first job. Your balance shapes the reply.",
  "followup": "live-point-arrive-options",
  "transferOf": null,
  "returnPrompt": "A different ball changes the decision. Try the paired point.",
  "learningSignals": [
    "drop-pickup",
    "balance-recovery"
  ],
  "liveFeedback": {
    "summaries": {
      "11": "Both choices fitted the contact and court you had. Keep reading as the point changes.",
      "10": "The first choice fitted. The next ball needed a fresh decision.",
      "01": "You adapted on the second ball. Compare what the first choice cost.",
      "00": "Compare the first choice, then read the next contact again. A landing alone does not prove a sound decision."
    }
  },
  "comparison": {
    "own": "Watch your first choice",
    "other": "Change only the first choice",
    "ownLabel": "Your first choice",
    "summary": "Compare what your first choice creates.",
    "intro": "Hold the incoming situation fixed. Change the first shot and watch the reply."
  },
  "completionIntro": "Your first choice changed the next ball. Read each contact afresh.",
  "redoLabel": "Try another route through this point",
  "pro": {
    "player": "Coaching fundamentals",
    "label": "Read the contact and court",
    "moment": "Tennis Australia’s movement and tactical fundamentals connect balance and court position to shot selection. A low, moving contact changes what is sensible even when an empty corner is visible.",
    "read": "A late pickup below the net needs clearance and a manageable target. The illustration shows a playable recovery, not a miracle winner. After the pickup, organise your feet and racket for the actual passing shot.",
    "src": "Tennis Australia · Technical and tactical fundamentals",
    "url": "https://www.tennis.com.au/wp-content/uploads/2014/11/Technical-and-Tactical-fundamentals-guidelines_low-res.pdf"
  },
  "drill": {
    "name": "Two-ball read",
    "how": "Begin deep. Have a partner disguise an occasional drop shot, then play a pass after your pickup. Judge the pickup height and how quickly you regain balance."
  }
};
