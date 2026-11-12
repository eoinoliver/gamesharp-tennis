const LESSON={
  "title": "Over Their Head",
  "decisionCount": 2,
  "hook": "Two connected choices. Watch what your first shot creates.",
  "liveIntro": "They have moved closer to the net. You are behind the baseline as the ball arrives.",
  "specificFeedback": true,
  "livePoint": true,
  "family": "passing-read",
  "edition": "ten-live-v1",
  "branch": "tb1",
  "nodes": {
    "tb1A": {
      "scene": "tb1A",
      "ph": "Live Point",
      "short": "Read",
      "name": "What does the next ball give you?",
      "sit": "Their volley is deeper to your backhand. They still cover the net.",
      "q": "What does the next ball give you?",
      "opts": [
        "Use controlled depth into the open court",
        "Lift with depth and recover"
      ],
      "correct": 1,
      "lines": {
        "A": "The space looks inviting, but the deep contact makes forcing it demanding.",
        "B": "You give yourself another recovery window from the deeper volley."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Their net position changes the space. Recover while the lob travels.",
      "payoff": "Their net position changes the space. Recover while the lob travels.",
      "principle": "Read how close they stand. Use the space above them.",
      "why": "A player close to the net can cover many passing angles but leaves space behind. A deep lob is available when your contact supports lift. It is not an automatic winner: this opponent chases it down, and the next ball decides your next action.",
      "opening": {
        "scene": "tb1AA",
        "from": 362,
        "to": 362,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "tb1B": {
      "scene": "tb1B",
      "ph": "Live Point",
      "short": "Read",
      "name": "What does the next ball give you?",
      "sit": "They chase behind the baseline and send a shorter reply. You have recovered with time.",
      "q": "What does the next ball give you?",
      "opts": [
        "Use controlled depth into the open court",
        "Lift with depth and recover"
      ],
      "correct": 0,
      "lines": {
        "A": "You use the shorter reply with a generous target. The point continues.",
        "B": "A sound reset. The shorter reply also gave you time to apply pressure."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Their net position changes the space. Recover while the lob travels.",
      "payoff": "Their net position changes the space. Recover while the lob travels.",
      "principle": "Read how close they stand. Use the space above them.",
      "why": "A player close to the net can cover many passing angles but leaves space behind. A deep lob is available when your contact supports lift. It is not an automatic winner: this opponent chases it down, and the next ball decides your next action.",
      "alsoOk": [
        1
      ],
      "opening": {
        "scene": "tb1BA",
        "from": 580,
        "to": 580,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "tb1": {
      "scene": "tb1",
      "ph": "Live Point",
      "short": "Read",
      "name": "Where is the larger space now?",
      "sit": "They have moved closer to the net. You are behind the baseline as the ball arrives.",
      "q": "Where is the larger space now?",
      "opts": [
        "Drive the pass crosscourt",
        "Lift a deep lob over their reach"
      ],
      "correct": 1,
      "lines": {
        "A": "They intercept above the net. Read their volley and find room for the next shot.",
        "B": "The lob clears their reach and sends them back. Recover while they chase it."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Their net position changes the space. Recover while the lob travels.",
      "payoff": "Their net position changes the space. Recover while the lob travels.",
      "principle": "Read how close they stand. Use the space above them.",
      "why": "A player close to the net can cover many passing angles but leaves space behind. A deep lob is available when your contact supports lift. It is not an automatic winner: this opponent chases it down, and the next ball decides your next action."
    }
  },
  "steps": [],
  "finaleScene": "tb1AA",
  "finaleFull": true,
  "memHTML": "Read how close they stand. Use the space above them.",
  "cue": "Read how close they stand. Use the space above them.",
  "callbackTags": [
    "net-distance",
    "lob-follow-up"
  ],
  "tomorrow": "Their net position changes the space. Recover while the lob travels.",
  "followup": null,
  "transferOf": "live-point-pass-two",
  "returnPrompt": null,
  "learningSignals": [
    "net-distance",
    "lob-follow-up"
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
    "intro": "Hold the incoming situation fixed. Change the first shot and watch the reply.",
    "camera": {
      "c": {
        "az": -90,
        "el": 24,
        "d": 34,
        "fov": 40,
        "tgt": [
          0,
          -2,
          1.7
        ]
      },
      "phone": {
        "az": -90,
        "el": 27,
        "d": 42,
        "fov": 28,
        "tgt": [
          0,
          -2,
          1.8
        ]
      }
    }
  },
  "completionIntro": "Your first choice changed the next ball. Read each contact afresh.",
  "redoLabel": "Try another route through this point",
  "pro": {
    "player": "Coaching fundamentals",
    "label": "Read the contact and court",
    "moment": "Tennis Australia’s tactical situations connect shot selection to opponent position and available space. This example contrasts a net player’s close position with the previous lower-volley situation.",
    "read": "A player close to the net can cover many passing angles but leaves space behind. A deep lob is available when your contact supports lift. It is not an automatic winner: this opponent chases it down, and the next ball decides your next action.",
    "src": "Tennis Australia · Technical and tactical fundamentals",
    "url": "https://www.tennis.com.au/wp-content/uploads/2014/11/Technical-and-Tactical-fundamentals-guidelines_low-res.pdf"
  },
  "drill": {
    "name": "Two-ball read",
    "how": "Have a partner vary how close they stand to the net. Choose feet or lob from the position, then continue with whichever reply they reach."
  },
  "frameHeight": 8,
  "cam0": {
    "c": {
      "az": -90,
      "el": 24,
      "d": 34,
      "fov": 40,
      "tgt": [
        0,
        -2,
        1.7
      ]
    },
    "phone": {
      "az": -90,
      "el": 27,
      "d": 42,
      "fov": 28,
      "tgt": [
        0,
        -2,
        1.8
      ]
    }
  }
};
