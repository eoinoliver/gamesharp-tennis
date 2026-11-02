const LESSON={
  "title": "Now the Line Opens",
  "decisionCount": 2,
  "hook": "Two connected choices. Watch what your first shot creates.",
  "liveIntro": "This ball is shorter. You have time to set on the backhand, and they are recovering toward the crosscourt side.",
  "livePoint": true,
  "family": "direction-change",
  "edition": "ten-live-v1",
  "branch": "to1",
  "nodes": {
    "to1A": {
      "scene": "to1A",
      "ph": "Live Point",
      "short": "Read",
      "name": "What does their reply permit now?",
      "sit": "They stretch to the line and send a shorter reply toward the middle.",
      "q": "What does their reply permit now?",
      "opts": [
        "Use controlled depth into the space",
        "Lift through the middle to regain time"
      ],
      "correct": 0,
      "lines": {
        "A": "You move forward and use the space with a generous target.",
        "B": "A sound reset. You also had a shorter ball to work with."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "The line changes with your contact. Read what makes it available.",
      "payoff": "The line changes with your contact. Read what makes it available.",
      "principle": "Use the opening you earn. Cover the reply it creates.",
      "why": "Compared with the stretched wide ball, this contact is closer, higher and better organised. The opponent is also away from the line. Controlled depth can use that opening; the next reply still needs a fresh read.",
      "alsoOk": [
        1
      ],
      "opening": {
        "scene": "to1AA",
        "from": 505,
        "to": 505,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "to1B": {
      "scene": "to1B",
      "ph": "Live Point",
      "short": "Read",
      "name": "What does their reply permit now?",
      "sit": "They step into your short ball and send you back out to the backhand.",
      "q": "What does their reply permit now?",
      "opts": [
        "Use controlled depth into the space",
        "Lift through the middle to regain time"
      ],
      "correct": 1,
      "lines": {
        "A": "The space is there, but the deeper contact makes pressing less comfortable.",
        "B": "You adapt to the deeper ball and regain recovery time."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "The line changes with your contact. Read what makes it available.",
      "payoff": "The line changes with your contact. Read what makes it available.",
      "principle": "Use the opening you earn. Cover the reply it creates.",
      "why": "Compared with the stretched wide ball, this contact is closer, higher and better organised. The opponent is also away from the line. Controlled depth can use that opening; the next reply still needs a fresh read.",
      "opening": {
        "scene": "to1BA",
        "from": 470,
        "to": 470,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "to1": {
      "scene": "to1",
      "ph": "Live Point",
      "short": "Read",
      "name": "What has changed from the stretched wide ball?",
      "sit": "This ball is shorter. You have time to set on the backhand, and they are recovering toward the crosscourt side.",
      "q": "What has changed from the stretched wide ball?",
      "opts": [
        "Use controlled depth down the open line",
        "Float short toward their recovery"
      ],
      "correct": 0,
      "lines": {
        "A": "Your balanced contact lets you use the line with margin. Watch how they defend.",
        "B": "The shorter float gives them time to step in. Read their deeper reply."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "The line changes with your contact. Read what makes it available.",
      "payoff": "The line changes with your contact. Read what makes it available.",
      "principle": "Use the opening you earn. Cover the reply it creates.",
      "why": "Compared with the stretched wide ball, this contact is closer, higher and better organised. The opponent is also away from the line. Controlled depth can use that opening; the next reply still needs a fresh read."
    }
  },
  "steps": [],
  "finaleScene": "to1AA",
  "finaleFull": true,
  "memHTML": "Use the opening you earn. Cover the reply it creates.",
  "cue": "Use the opening you earn. Cover the reply it creates.",
  "callbackTags": [
    "direction-opportunity",
    "follow-up-read"
  ],
  "tomorrow": "The line changes with your contact. Read what makes it available.",
  "followup": null,
  "transferOf": "live-point-line-tempting",
  "returnPrompt": null,
  "learningSignals": [
    "direction-opportunity",
    "follow-up-read"
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
    "moment": "Tennis Australia links positioning and balance to choosing and recovering from a shot. This changed situation applies the same principle without making “always crosscourt” a rule.",
    "read": "Compared with the stretched wide ball, this contact is closer, higher and better organised. The opponent is also away from the line. Controlled depth can use that opening; the next reply still needs a fresh read.",
    "src": "Tennis Australia · Technical and tactical fundamentals",
    "url": "https://www.tennis.com.au/wp-content/uploads/2014/11/Technical-and-Tactical-fundamentals-guidelines_low-res.pdf"
  },
  "drill": {
    "name": "Two-ball read",
    "how": "Alternate a deep wide backhand feed and a shorter one. Recover toward the crosscourt side as feeder. Let the receiver call the opening, then play your actual reply."
  }
};
