const LESSON={
  "title": "First Volley: Use the Opening",
  "decisionCount": 2,
  "hook": "Two connected choices. Watch what your first shot creates.",
  "liveIntro": "Your approach moves them wide. This backhand volley is above the net, with the opposite side open.",
  "livePoint": true,
  "family": "first-volley",
  "edition": "ten-live-v1",
  "branch": "th1",
  "nodes": {
    "th1A": {
      "scene": "th1A",
      "ph": "Live Point",
      "short": "Read",
      "name": "What has the first volley actually earned?",
      "sit": "Their pass comes wider to your forehand. Recover into the next volley.",
      "q": "What has the first volley actually earned?",
      "opts": [
        "Place the next volley with controlled depth",
        "Try a sharp finishing angle"
      ],
      "correct": 0,
      "lines": {
        "A": "You adjust and keep a generous target for the wider ball.",
        "B": "This angle lands, but the wider contact leaves less room to force it."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "A higher volley offers options. Read the next pass before choosing again.",
      "payoff": "A higher volley offers options. Read the next pass before choosing again.",
      "principle": "Use the height and space. Place it, then stay ready.",
      "why": "Compared with the low first volley, this ball arrives above the net and the opponent is displaced. A compact forward action can use the open side. Do not assume a winner: recover and split for the return they actually produce.",
      "opening": {
        "scene": "th1AA",
        "from": 634,
        "to": 634,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "th1B": {
      "scene": "th1B",
      "ph": "Live Point",
      "short": "Read",
      "name": "What has the first volley actually earned?",
      "sit": "Their stretched reply comes higher through the middle. Stay organised for the forehand volley.",
      "q": "What has the first volley actually earned?",
      "opts": [
        "Place the next volley with controlled depth",
        "Try a sharp finishing angle"
      ],
      "correct": 1,
      "lines": {
        "A": "A sound controlled placement. The higher contact also offered the shorter angle.",
        "B": "You use the higher contact and open side. Stay ready until the point is over."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "A higher volley offers options. Read the next pass before choosing again.",
      "payoff": "A higher volley offers options. Read the next pass before choosing again.",
      "principle": "Use the height and space. Place it, then stay ready.",
      "why": "Compared with the low first volley, this ball arrives above the net and the opponent is displaced. A compact forward action can use the open side. Do not assume a winner: recover and split for the return they actually produce.",
      "alsoOk": [
        0
      ],
      "opening": {
        "scene": "th1BA",
        "from": 697,
        "to": 697,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "th1": {
      "scene": "th1",
      "ph": "Live Point",
      "short": "Read",
      "name": "What does the higher contact offer?",
      "sit": "Your approach moves them wide. This backhand volley is above the net, with the opposite side open.",
      "q": "What does the higher contact offer?",
      "opts": [
        "Send it back toward the waiting passer",
        "Place the volley into the open side"
      ],
      "correct": 1,
      "lines": {
        "A": "You send it toward their side. They get a more comfortable passing attempt.",
        "B": "You use the height and space. They still get a racket to your compact volley."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "A higher volley offers options. Read the next pass before choosing again.",
      "payoff": "A higher volley offers options. Read the next pass before choosing again.",
      "principle": "Use the height and space. Place it, then stay ready.",
      "why": "Compared with the low first volley, this ball arrives above the net and the opponent is displaced. A compact forward action can use the open side. Do not assume a winner: recover and split for the return they actually produce."
    }
  },
  "steps": [],
  "finaleScene": "th1AA",
  "finaleFull": true,
  "memHTML": "Use the height and space. Place it, then stay ready.",
  "cue": "Use the height and space. Place it, then stay ready.",
  "callbackTags": [
    "volley-opportunity",
    "next-volley-read"
  ],
  "tomorrow": "A higher volley offers options. Read the next pass before choosing again.",
  "followup": null,
  "transferOf": "live-point-volley-build",
  "returnPrompt": null,
  "learningSignals": [
    "volley-opportunity",
    "next-volley-read"
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
    "moment": "Volley fundamentals combine a stable racket, coordinated footwork and contact in front. The opportunity changes with contact height and opponent position, not with a bigger backswing.",
    "read": "Compared with the low first volley, this ball arrives above the net and the opponent is displaced. A compact forward action can use the open side. Do not assume a winner: recover and split for the return they actually produce.",
    "src": "Tennis Australia · Technical and tactical fundamentals",
    "url": "https://www.tennis.com.au/wp-content/uploads/2014/11/Technical-and-Tactical-fundamentals-guidelines_low-res.pdf"
  },
  "drill": {
    "name": "Two-ball read",
    "how": "Have a partner feed one low volley and one above the net, while changing sides. Call “build” or “place” from the contact and court, then play a second volley."
  }
};
