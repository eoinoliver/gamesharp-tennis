const LESSON={
  "title": "Short Can Be Low.",
  "decisionCount": 2,
  "hook": "Two connected decisions. Prepare, read the ball, choose.",
  "liveIntro": "A short ball is coming to your backhand. There is space ahead of you.",
  "livePoint": true,
  "family": "contact-space",
  "edition": "six-play-v1",
  "branch": "ll1",
  "nodes": {
    "ll1A": {
      "scene": "ll1A",
      "ph": "Live Point",
      "short": "Read",
      "name": "Does short mean you can drive down?",
      "sit": "You arrive hurried. The ball is still below net height.",
      "q": "Does short mean you can drive down?",
      "opts": [
        "Drive flat and hard at the space",
        "Lift with margin, then follow the ball"
      ],
      "correct": 1,
      "lines": {
        "A": "The flat attempt finds the net. Low contact needed clearance.",
        "B": "The lifted reply clears the net. Follow it and read their next ball."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Early arrival helps your balance. Contact height still shapes the shot.",
      "payoff": "Early arrival helps your balance. Contact height still shapes the shot.",
      "principle": "Get there early. Low still needs lift.",
      "why": "Closing the distance early gives you time to adjust, but the ball remains below the net. The flat attempt shown hits the net; that is an illustration of the clearance problem, not a prediction that every hard shot misses. Lift first, then assess whether to follow.",
      "opening": {
        "scene": "ll1AA",
        "from": 55,
        "to": 192,
        "label": "Your preparation · replay",
        "after": "Read this contact",
        "silent": true
      }
    },
    "ll1B": {
      "scene": "ll1B",
      "ph": "Live Point",
      "short": "Read",
      "name": "Does short mean you can drive down?",
      "sit": "You arrive with more time. The ball is still below net height.",
      "q": "Does short mean you can drive down?",
      "opts": [
        "Drive flat and hard at the space",
        "Lift with margin, then follow the ball"
      ],
      "correct": 1,
      "lines": {
        "A": "Early arrival did not raise the ball. This flat attempt finds the net.",
        "B": "You read the low contact and leave clearance. The point continues."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Early arrival helps your balance. Contact height still shapes the shot.",
      "payoff": "Early arrival helps your balance. Contact height still shapes the shot.",
      "principle": "Get there early. Low still needs lift.",
      "why": "Closing the distance early gives you time to adjust, but the ball remains below the net. The flat attempt shown hits the net; that is an illustration of the clearance problem, not a prediction that every hard shot misses. Lift first, then assess whether to follow.",
      "opening": {
        "scene": "ll1BA",
        "from": 55,
        "to": 192,
        "label": "Your preparation · replay",
        "after": "Read this contact",
        "silent": true
      }
    },
    "ll1": {
      "scene": "ll1",
      "ph": "Live Point",
      "short": "Read",
      "name": "How do you prepare for the short ball?",
      "sit": "A short ball is coming to your backhand. There is space ahead of you.",
      "q": "How do you prepare for the short ball?",
      "opts": [
        "Wait for the bounce, then hurry forward",
        "Move forward now; shorten the last steps"
      ],
      "correct": 1,
      "lines": {
        "A": "You leave yourself a hurried approach to a low contact.",
        "B": "You close the distance early and leave time to adjust."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Early arrival helps your balance. Contact height still shapes the shot.",
      "payoff": "Early arrival helps your balance. Contact height still shapes the shot.",
      "principle": "Get there early. Low still needs lift.",
      "why": "Closing the distance early gives you time to adjust, but the ball remains below the net. The flat attempt shown hits the net; that is an illustration of the clearance problem, not a prediction that every hard shot misses. Lift first, then assess whether to follow."
    }
  },
  "steps": [],
  "finaleScene": "ll1AA",
  "finaleFull": true,
  "memHTML": "Get there early. Low still needs lift.",
  "cue": "Get there early. Low still needs lift.",
  "callbackTags": [
    "movement_read",
    "contact-space"
  ],
  "tomorrow": "Get there early. Low still needs lift.",
  "followup": null,
  "transferOf": "live-point-make-room",
  "returnPrompt": null,
  "learningSignals": [
    "preparation",
    "contact-read"
  ],
  "liveFeedback": {
    "summaries": {
      "11": "You moved early and respected the low contact.",
      "10": "You moved early, but the low ball still needed clearance.",
      "01": "You arrived hurried, then correctly gave the low ball clearance.",
      "00": "The wait cost preparation time. The flat attempt then found the net."
    }
  },
  "liveVoices": {
    "11": "live-space-11",
    "10": "live-space-10",
    "01": "live-space-01",
    "00": "live-space-00"
  },
  "comparison": {
    "own": "Watch your preparation",
    "other": "Change only preparation",
    "intro": "Watch the same ball twice. Change only your preparation."
  },
  "redoLabel": "Try another route through this point",
  "pro": {
    "player": "Matt Smith · LTA coach",
    "label": "Coach’s lens · Prepare, then decide",
    "moment": "LTA coach Matt Smith describes closing distance with larger steps, making smaller adjustments near contact, and recovering after a shot.",
    "read": "Our application: move early enough to leave adjustment time. Then read the contact height and your balance; early arrival alone does not earn an attack.",
    "src": "LTA · Improve your tennis footwork · Matt Smith",
    "url": "https://www.lta.org.uk/play/tennis-tips-and-techniques/improve-your-tennis-footwork-on-court-with-these-simple-tips/"
  },
  "drill": {
    "name": "Prepare, then call it",
    "how": "Ask a partner to vary the height of a comfortable short feed. Move early, adjust, then call “lift” or “drive” before contact. Judge the read and balance, not a winner."
  }
};
