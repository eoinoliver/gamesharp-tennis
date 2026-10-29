const LESSON={
  "title": "Make Room. Use It.",
  "decisionCount": 2,
  "hook": "Two connected decisions. Prepare, read the ball, choose.",
  "liveIntro": "Their ball is coming to your backhand side. You have time to move around it.",
  "livePoint": true,
  "family": "contact-space",
  "edition": "six-play-v1",
  "branch": "ls1",
  "nodes": {
    "ls1A": {
      "scene": "ls1A",
      "ph": "Live Point",
      "short": "Read",
      "name": "Which reply fits this preparation?",
      "sit": "You arrived early. They remain on the left; the right side is open.",
      "q": "Which reply fits this preparation?",
      "opts": [
        "Controlled forehand into the open side",
        "Lift deep through the middle"
      ],
      "correct": 0,
      "lines": {
        "A": "You use the space you earned. Keep recovering; the point continues.",
        "B": "A sound reset with margin. The open side was also available."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Your feet create preparation time. The open court does not create it.",
      "payoff": "Your feet create preparation time. The open court does not create it.",
      "principle": "Make room early. Choose from the contact you have.",
      "why": "Moving early leaves time for smaller adjustment steps and a balanced contact. A successful illustrated landing does not make a rushed attack the best decision. With time, the open side is available; a deeper middle reset remains valid.",
      "alsoOk": [
        1
      ],
      "opening": {
        "scene": "ls1AA",
        "from": 90,
        "to": 199,
        "label": "Your preparation · replay",
        "after": "Read this contact",
        "silent": true
      }
    },
    "ls1B": {
      "scene": "ls1B",
      "ph": "Live Point",
      "short": "Read",
      "name": "Which reply fits this preparation?",
      "sit": "You reach the ball late. The open side is there, but your preparation is hurried.",
      "q": "Which reply fits this preparation?",
      "opts": [
        "Controlled forehand into the open side",
        "Lift deep through the middle"
      ],
      "correct": 1,
      "lines": {
        "A": "It lands in this example. The rushed attack is the risk.",
        "B": "You choose margin while hurried. Start recovering as it travels."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Your feet create preparation time. The open court does not create it.",
      "payoff": "Your feet create preparation time. The open court does not create it.",
      "principle": "Make room early. Choose from the contact you have.",
      "why": "Moving early leaves time for smaller adjustment steps and a balanced contact. A successful illustrated landing does not make a rushed attack the best decision. With time, the open side is available; a deeper middle reset remains valid.",
      "opening": {
        "scene": "ls1BA",
        "from": 90,
        "to": 199,
        "label": "Your preparation · replay",
        "after": "Read this contact",
        "silent": true
      }
    },
    "ls1": {
      "scene": "ls1",
      "ph": "Live Point",
      "short": "Read",
      "name": "When do you make room for the forehand?",
      "sit": "Their ball is coming to your backhand side. You have time to move around it.",
      "q": "When do you make room for the forehand?",
      "opts": [
        "Move now; adjust into contact space",
        "Hold the middle a little longer"
      ],
      "correct": 0,
      "lines": {
        "A": "You make room before the ball arrives. Now read the opening.",
        "B": "You still reach it, but leave less time to organise the forehand."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Your feet create preparation time. The open court does not create it.",
      "payoff": "Your feet create preparation time. The open court does not create it.",
      "principle": "Make room early. Choose from the contact you have.",
      "why": "Moving early leaves time for smaller adjustment steps and a balanced contact. A successful illustrated landing does not make a rushed attack the best decision. With time, the open side is available; a deeper middle reset remains valid."
    }
  },
  "steps": [],
  "finaleScene": "ls1AA",
  "finaleFull": true,
  "memHTML": "Make room early. Choose from the contact you have.",
  "cue": "Make room early. Choose from the contact you have.",
  "callbackTags": [
    "movement_read",
    "contact-space"
  ],
  "tomorrow": "The next point is shorter and lower. Does early arrival still earn a drive?",
  "followup": "live-point-short-low",
  "transferOf": null,
  "returnPrompt": "The next point is shorter and lower. Does early arrival still earn a drive?",
  "learningSignals": [
    "preparation",
    "contact-read"
  ],
  "liveFeedback": {
    "summaries": {
      "11": "You made room and chose a reply that fits your preparation.",
      "10": "You made room. Check the ball and your balance before choosing.",
      "01": "You left less preparation time, then chose a reply with margin.",
      "00": "The wait squeezed your preparation. The open side still carried risk."
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
