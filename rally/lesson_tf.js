const LESSON={
  "title": "Pass in Two",
  "decisionCount": 2,
  "hook": "Two connected choices. Watch what your first shot creates.",
  "liveIntro": "They are coming in and covering the obvious passing lane. Your contact is low behind the baseline.",
  "livePoint": true,
  "family": "passing-read",
  "edition": "ten-live-v1",
  "branch": "tf1",
  "nodes": {
    "tf1A": {
      "scene": "tf1A",
      "ph": "Live Point",
      "short": "Read",
      "name": "Choose from the volley they actually play.",
      "sit": "The low volley lands shorter through the middle. They are still near the centre of the net.",
      "q": "Choose from the volley they actually play.",
      "opts": [
        "Use the shorter contact to pass into space",
        "Lift with depth to regain time"
      ],
      "correct": 0,
      "lines": {
        "A": "You use the shorter ball to pass left of their coverage. Stay ready.",
        "B": "A sound way to reset. The shorter volley also offered a passing opportunity."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Build the pass in two balls. Read the volley before choosing again.",
      "payoff": "Build the pass in two balls. Read the volley before choosing again.",
      "principle": "Make the first volley difficult. Read it before you pass.",
      "why": "A dipping ball can force the net player to volley upward and create a more playable next ball. The sideline is not forbidden, but forcing it from low contact gives little margin. Neither reply is guaranteed: watch the actual volley before choosing again.",
      "alsoOk": [
        1
      ],
      "opening": {
        "scene": "tf1AA",
        "from": 402,
        "to": 402,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "tf1B": {
      "scene": "tf1B",
      "ph": "Live Point",
      "short": "Read",
      "name": "Choose from the volley they actually play.",
      "sit": "Their firmer volley is deep to your backhand. The passing opportunity has become harder.",
      "q": "Choose from the volley they actually play.",
      "opts": [
        "Use the shorter contact to pass into space",
        "Lift with depth to regain time"
      ],
      "correct": 1,
      "lines": {
        "A": "This pass lands, but the deeper contact gives you less room to force it.",
        "B": "You adapt to the deeper volley and buy time."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Build the pass in two balls. Read the volley before choosing again.",
      "payoff": "Build the pass in two balls. Read the volley before choosing again.",
      "principle": "Make the first volley difficult. Read it before you pass.",
      "why": "A dipping ball can force the net player to volley upward and create a more playable next ball. The sideline is not forbidden, but forcing it from low contact gives little margin. Neither reply is guaranteed: watch the actual volley before choosing again.",
      "opening": {
        "scene": "tf1BA",
        "from": 392,
        "to": 392,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "tf1": {
      "scene": "tf1",
      "ph": "Live Point",
      "short": "Read",
      "name": "Can you make their first volley difficult?",
      "sit": "They are coming in and covering the obvious passing lane. Your contact is low behind the baseline.",
      "q": "Can you make their first volley difficult?",
      "opts": [
        "Dip the ball toward their feet",
        "Force the visible sideline pass"
      ],
      "correct": 0,
      "lines": {
        "A": "They have to volley below the net. Read where that volley actually goes.",
        "B": "They reach your pass above the net and send the volley deeper. You must adjust."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Build the pass in two balls. Read the volley before choosing again.",
      "payoff": "Build the pass in two balls. Read the volley before choosing again.",
      "principle": "Make the first volley difficult. Read it before you pass.",
      "why": "A dipping ball can force the net player to volley upward and create a more playable next ball. The sideline is not forbidden, but forcing it from low contact gives little margin. Neither reply is guaranteed: watch the actual volley before choosing again."
    }
  },
  "steps": [],
  "finaleScene": "tf1AA",
  "finaleFull": true,
  "memHTML": "Make the first volley difficult. Read it before you pass.",
  "cue": "Make the first volley difficult. Read it before you pass.",
  "callbackTags": [
    "first-pass-height",
    "volley-read"
  ],
  "tomorrow": "Build the pass in two balls. Read the volley before choosing again.",
  "followup": "live-point-over-head",
  "transferOf": null,
  "returnPrompt": "A different ball changes the decision. Try the paired point.",
  "learningSignals": [
    "first-pass-height",
    "volley-read"
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
    "moment": "Tennis Australia describes defending, neutralising and attacking as different tactical situations. This point uses a low first ball to try to improve the next passing opportunity.",
    "read": "A dipping ball can force the net player to volley upward and create a more playable next ball. The sideline is not forbidden, but forcing it from low contact gives little margin. Neither reply is guaranteed: watch the actual volley before choosing again.",
    "src": "Tennis Australia · Technical and tactical fundamentals",
    "url": "https://www.tennis.com.au/wp-content/uploads/2014/11/Technical-and-Tactical-fundamentals-guidelines_low-res.pdf"
  },
  "drill": {
    "name": "Two-ball read",
    "how": "Start with a partner approaching. Play a low first pass, then call the actual volley’s depth before selecting the second shot. Change the volley direction each time."
  }
};
