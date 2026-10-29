const LESSON={
  "title": "Serve. Then See.",
  "decisionCount": 2,
  "hook": "Two connected decisions. Prepare, read the ball, choose.",
  "liveIntro": "Your wide serve is on its way. The returner has not struck it yet.",
  "livePoint": true,
  "family": "serve-readiness",
  "edition": "six-play-v1",
  "branch": "sv1",
  "nodes": {
    "sv1A": {
      "scene": "sv1A",
      "ph": "Live Point",
      "short": "Read",
      "name": "What does this return offer?",
      "sit": "The return lands short. You have time to move in and organise.",
      "q": "What does this return offer?",
      "opts": [
        "Controlled pressure into the open side",
        "Depth through the middle with margin"
      ],
      "correct": 0,
      "lines": {
        "A": "You step into the short reply and use the opening. Keep playing.",
        "B": "Depth through the middle is sound. You also had room to apply pressure."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "The serve starts the pattern. The return decides your next shot.",
      "payoff": "The serve starts the pattern. The return decides your next shot.",
      "principle": "Recover after the serve. Read the return before attacking.",
      "why": "Recover after the serve so you can respond to the return you see. A short reply and organised contact can offer controlled pressure. Guessing before the return adds a correction if the ball arrives elsewhere. A deep middle reply remains a sound option.",
      "alsoOk": [
        1
      ],
      "opening": {
        "scene": "sv1AA",
        "from": 230,
        "to": 395,
        "label": "Your preparation · replay",
        "after": "Read this contact",
        "silent": true
      }
    },
    "sv1B": {
      "scene": "sv1B",
      "ph": "Live Point",
      "short": "Read",
      "name": "What does this return offer?",
      "sit": "The return lands short. Your early guess leaves you adjusting again.",
      "q": "What does this return offer?",
      "opts": [
        "Controlled pressure into the open side",
        "Depth through the middle with margin"
      ],
      "correct": 1,
      "lines": {
        "A": "It lands here, but you force a direction change while adjusting.",
        "B": "You choose a larger target while adjusting. The point continues."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "The serve starts the pattern. The return decides your next shot.",
      "payoff": "The serve starts the pattern. The return decides your next shot.",
      "principle": "Recover after the serve. Read the return before attacking.",
      "why": "Recover after the serve so you can respond to the return you see. A short reply and organised contact can offer controlled pressure. Guessing before the return adds a correction if the ball arrives elsewhere. A deep middle reply remains a sound option.",
      "opening": {
        "scene": "sv1BA",
        "from": 230,
        "to": 395,
        "label": "Your preparation · replay",
        "after": "Read this contact",
        "silent": true
      }
    },
    "sv1": {
      "scene": "sv1",
      "ph": "Live Point",
      "short": "Read",
      "name": "Where do you get ready for the return?",
      "sit": "Your wide serve is on its way. The returner has not struck it yet.",
      "q": "Where do you get ready for the return?",
      "opts": [
        "Recover balanced; keep both wings available",
        "Commit to the forehand before they hit"
      ],
      "correct": 0,
      "lines": {
        "A": "You recover to read either wing. Now watch the actual return.",
        "B": "You commit before their hit. The return still has to be read."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "The serve starts the pattern. The return decides your next shot.",
      "payoff": "The serve starts the pattern. The return decides your next shot.",
      "principle": "Recover after the serve. Read the return before attacking.",
      "why": "Recover after the serve so you can respond to the return you see. A short reply and organised contact can offer controlled pressure. Guessing before the return adds a correction if the ball arrives elsewhere. A deep middle reply remains a sound option."
    }
  },
  "steps": [],
  "finaleScene": "sv1AA",
  "finaleFull": true,
  "memHTML": "Recover after the serve. Read the return before attacking.",
  "cue": "Recover after the serve. Read the return before attacking.",
  "callbackTags": [
    "movement_read",
    "serve-readiness"
  ],
  "tomorrow": "The next return comes deeper. Read what it permits before using the same plan.",
  "followup": "live-point-return-deep",
  "transferOf": null,
  "returnPrompt": "The next return comes deeper. Read what it permits before using the same plan.",
  "learningSignals": [
    "serve-recovery",
    "return-read"
  ],
  "liveFeedback": {
    "summaries": {
      "11": "You recovered, read the short return and chose from an organised contact.",
      "10": "You recovered. Let the actual return guide the next shot.",
      "01": "You corrected the early guess and chose a larger target.",
      "00": "You guessed early, then pressed the angle while still adjusting."
    }
  },
  "liveVoices": {
    "11": "live-serve-11",
    "10": "live-serve-10",
    "01": "live-serve-01",
    "00": "live-serve-00"
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
    "read": "Our application: recover after the serve with room to respond. Read the actual return before deciding how much pressure it permits.",
    "src": "LTA · Improve your tennis footwork · Matt Smith",
    "url": "https://www.lta.org.uk/play/tennis-tips-and-techniques/improve-your-tennis-footwork-on-court-with-these-simple-tips/"
  },
  "drill": {
    "name": "Prepare, then call it",
    "how": "Have a partner alternate shorter and deeper returns. Recover after serving, then say “pressure” or “margin” from the return you see. Keep the rally going."
  }
};
