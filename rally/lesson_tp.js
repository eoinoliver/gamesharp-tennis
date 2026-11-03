const LESSON={
  "title": "Return Under Pressure",
  "decisionCount": 2,
  "hook": "Two connected choices. Watch what your first shot creates.",
  "liveIntro": "A fast serve is coming into your backhand. Your preparation window is small.",
  "specificFeedback": true,
  "livePoint": true,
  "family": "return-pressure",
  "edition": "ten-live-v1",
  "branch": "tp1",
  "nodes": {
    "tp1A": {
      "scene": "tp1A",
      "ph": "Live Point",
      "short": "Read",
      "name": "What fits the reply you actually receive?",
      "sit": "They reply to your backhand with depth. You have recovered into range.",
      "q": "What fits the reply you actually receive?",
      "opts": [
        "Height and depth through the middle",
        "Change direction toward the sideline"
      ],
      "correct": 0,
      "lines": {
        "A": "You keep a broad target and time to recover. Still in play.",
        "B": "It lands in this illustration, but the narrow target gives away margin."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Read the serve’s pace, then read the next ball afresh.",
      "payoff": "Read the serve’s pace, then read the next ball afresh.",
      "principle": "Read the pace. Give your return room, then recover.",
      "why": "A fast serve rewards compact preparation and a generous target. These are two possible replies, not guaranteed outcomes. Read the depth and your balance again before changing direction.",
      "opening": {
        "scene": "tp1AA",
        "from": 548,
        "to": 548,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "tp1B": {
      "scene": "tp1B",
      "ph": "Live Point",
      "short": "Read",
      "name": "What fits the reply you actually receive?",
      "sit": "Their earlier contact sends you wide to the forehand. You are still adjusting.",
      "q": "What fits the reply you actually receive?",
      "opts": [
        "Height and depth through the middle",
        "Change direction toward the sideline"
      ],
      "correct": 0,
      "lines": {
        "A": "You buy recovery time from the wider contact. Still in play.",
        "B": "This one lands, but forcing the line while adjusting adds risk."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Read the serve’s pace, then read the next ball afresh.",
      "payoff": "Read the serve’s pace, then read the next ball afresh.",
      "principle": "Read the pace. Give your return room, then recover.",
      "why": "A fast serve rewards compact preparation and a generous target. These are two possible replies, not guaranteed outcomes. Read the depth and your balance again before changing direction.",
      "opening": {
        "scene": "tp1BA",
        "from": 506,
        "to": 506,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "tp1": {
      "scene": "tp1",
      "ph": "Live Point",
      "short": "Read",
      "name": "What does this serve give you time for?",
      "sit": "A fast serve is coming into your backhand. Your preparation window is small.",
      "q": "What does this serve give you time for?",
      "opts": [
        "Compact return with depth through the middle",
        "Aim close to the sideline"
      ],
      "correct": 0,
      "lines": {
        "A": "Your deeper return keeps their next contact behind the baseline. Read the reply.",
        "B": "The narrow return lands shorter here. They step in and send you wide."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Read the serve’s pace, then read the next ball afresh.",
      "payoff": "Read the serve’s pace, then read the next ball afresh.",
      "principle": "Read the pace. Give your return room, then recover.",
      "why": "A fast serve rewards compact preparation and a generous target. These are two possible replies, not guaranteed outcomes. Read the depth and your balance again before changing direction."
    }
  },
  "steps": [],
  "finaleScene": "tp1AA",
  "finaleFull": true,
  "memHTML": "Read the pace. Give your return room, then recover.",
  "cue": "Read the pace. Give your return room, then recover.",
  "callbackTags": [
    "serve-pace",
    "reply-margin"
  ],
  "tomorrow": "Read the serve’s pace, then read the next ball afresh.",
  "followup": "live-point-return-time",
  "transferOf": null,
  "returnPrompt": "A different ball changes the decision. Try the paired point.",
  "learningSignals": [
    "serve-pace",
    "reply-margin"
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
    "moment": "A compact block is useful when serve speed removes time; a fuller return becomes available when time permits.",
    "read": "A fast serve rewards compact preparation and a generous target. These are two possible replies, not guaranteed outcomes. Read the depth and your balance again before changing direction.",
    "src": "LTA · Return of serve",
    "url": "https://www.lta.org.uk/advantage-home/content/simple-steps-to-improving-your-return-of-serve/"
  },
  "drill": {
    "name": "Two-ball read",
    "how": "Alternate faster and slower serves to the same wing. Call “compact” or “time” before the return, then play one more ball."
  }
};
