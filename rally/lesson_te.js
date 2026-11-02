const LESSON={
  "title": "Arrive With Options",
  "decisionCount": 2,
  "hook": "Two connected choices. Watch what your first shot creates.",
  "liveIntro": "You spot the drop early. You arrive higher and more balanced, while they remain deep near the middle.",
  "livePoint": true,
  "family": "drop-arrival",
  "edition": "ten-live-v1",
  "branch": "te1",
  "nodes": {
    "te1A": {
      "scene": "te1A",
      "ph": "Live Point",
      "short": "Read",
      "name": "What does the passing shot offer now?",
      "sit": "They move forward and stretch across. Their pass comes higher through the middle.",
      "q": "What does the passing shot offer now?",
      "opts": [
        "Keep a compact volley with controlled depth",
        "Place a shorter volley into the open side"
      ],
      "correct": 1,
      "lines": {
        "A": "A sound controlled volley. The higher ball also offered the shorter placement.",
        "B": "You use the higher ball and open side. Keep covering until the point ends."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Earlier arrival creates options. Placement still depends on their position.",
      "payoff": "Earlier arrival creates options. Placement still depends on their position.",
      "principle": "Early arrival creates options. Place the ball, then stay ready.",
      "why": "Compared with the late pickup, earlier movement lets you contact the ball higher and closer to the net. With the opponent still deep, controlled shorter placement can make them move. It is not a winner by definition: organise for the pass they actually reach.",
      "alsoOk": [
        0
      ],
      "opening": {
        "scene": "te1AA",
        "from": 419,
        "to": 419,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "te1B": {
      "scene": "te1B",
      "ph": "Live Point",
      "short": "Read",
      "name": "What does the passing shot offer now?",
      "sit": "Their comfortable contact sends the pass wider to your forehand. Adjust before volleying.",
      "q": "What does the passing shot offer now?",
      "opts": [
        "Keep a compact volley with controlled depth",
        "Place a shorter volley into the open side"
      ],
      "correct": 0,
      "lines": {
        "A": "You adjust to the wider contact and keep a generous target.",
        "B": "The placement lands here, but the wider contact makes it less forgiving."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Earlier arrival creates options. Placement still depends on their position.",
      "payoff": "Earlier arrival creates options. Placement still depends on their position.",
      "principle": "Early arrival creates options. Place the ball, then stay ready.",
      "why": "Compared with the late pickup, earlier movement lets you contact the ball higher and closer to the net. With the opponent still deep, controlled shorter placement can make them move. It is not a winner by definition: organise for the pass they actually reach.",
      "opening": {
        "scene": "te1BA",
        "from": 380,
        "to": 380,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "te1": {
      "scene": "te1",
      "ph": "Live Point",
      "short": "Read",
      "name": "What has arriving early made available?",
      "sit": "You spot the drop early. You arrive higher and more balanced, while they remain deep near the middle.",
      "q": "What has arriving early made available?",
      "opts": [
        "Place it shorter and away from their position",
        "Send it deep back toward them"
      ],
      "correct": 0,
      "lines": {
        "A": "Your placement brings them forward and across. Stay ready for their pass.",
        "B": "They meet your deep pickup near their waiting position. Read the firmer pass."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Earlier arrival creates options. Placement still depends on their position.",
      "payoff": "Earlier arrival creates options. Placement still depends on their position.",
      "principle": "Early arrival creates options. Place the ball, then stay ready.",
      "why": "Compared with the late pickup, earlier movement lets you contact the ball higher and closer to the net. With the opponent still deep, controlled shorter placement can make them move. It is not a winner by definition: organise for the pass they actually reach."
    }
  },
  "steps": [],
  "finaleScene": "te1AA",
  "finaleFull": true,
  "memHTML": "Early arrival creates options. Place the ball, then stay ready.",
  "cue": "Early arrival creates options. Place the ball, then stay ready.",
  "callbackTags": [
    "early-drop-read",
    "placement-follow-up"
  ],
  "tomorrow": "Earlier arrival creates options. Placement still depends on their position.",
  "followup": null,
  "transferOf": "live-point-reach-drop",
  "returnPrompt": null,
  "learningSignals": [
    "early-drop-read",
    "placement-follow-up"
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
    "moment": "Tennis Australia connects movement, balance and available space to tactical decisions. This changed drop-shot situation shows why the same pickup target is not right for every arrival.",
    "read": "Compared with the late pickup, earlier movement lets you contact the ball higher and closer to the net. With the opponent still deep, controlled shorter placement can make them move. It is not a winner by definition: organise for the pass they actually reach.",
    "src": "Tennis Australia · Technical and tactical fundamentals",
    "url": "https://www.tennis.com.au/wp-content/uploads/2014/11/Technical-and-Tactical-fundamentals-guidelines_low-res.pdf"
  },
  "drill": {
    "name": "Two-ball read",
    "how": "Alternate a disguised drop with an obvious one. Let the receiver call “reach” or “options”, place the pickup, then play the real passing shot and next volley."
  }
};
