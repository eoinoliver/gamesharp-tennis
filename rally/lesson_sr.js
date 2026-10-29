const LESSON={
  "title": "The Return Pushes Back.",
  "decisionCount": 2,
  "hook": "Two connected decisions. Prepare, read the ball, choose.",
  "liveIntro": "Your wide serve is travelling. The returner can still change the next ball.",
  "livePoint": true,
  "family": "serve-readiness",
  "edition": "six-play-v1",
  "branch": "sr1",
  "nodes": {
    "sr1A": {
      "scene": "sr1A",
      "ph": "Live Point",
      "short": "Read",
      "name": "Does this return still invite the angle?",
      "sit": "The return drives you behind the baseline. You are still adjusting.",
      "q": "Does this return still invite the angle?",
      "opts": [
        "Force a sharp angle from behind the baseline",
        "Give yourself height and depth through the middle"
      ],
      "correct": 1,
      "lines": {
        "A": "The sharp angle goes wide in this example. The return removed the opening.",
        "B": "Depth and height give margin from this deeper contact. Keep recovering."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Being ready helps you adapt. It does not make every return attackable.",
      "payoff": "Being ready helps you adapt. It does not make every return attackable.",
      "principle": "Read the return you get. Change the plan when it changes.",
      "why": "This return is deeper than the short-return point and moves your contact behind the baseline. Being ready helps you respond; it does not make a low-margin angle the right choice. Height and depth through the middle offer space and time to recover.",
      "opening": {
        "scene": "sr1AA",
        "from": 230,
        "to": 385,
        "label": "Your preparation · replay",
        "after": "Read this contact",
        "silent": true
      }
    },
    "sr1B": {
      "scene": "sr1B",
      "ph": "Live Point",
      "short": "Read",
      "name": "Does this return still invite the angle?",
      "sit": "You recover early, but their deeper return still pushes you back.",
      "q": "Does this return still invite the angle?",
      "opts": [
        "Force a sharp angle from behind the baseline",
        "Give yourself height and depth through the middle"
      ],
      "correct": 1,
      "lines": {
        "A": "Getting ready early did not make this angle easy. It goes wide here.",
        "B": "You change the plan to fit the deeper return. The point continues."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Being ready helps you adapt. It does not make every return attackable.",
      "payoff": "Being ready helps you adapt. It does not make every return attackable.",
      "principle": "Read the return you get. Change the plan when it changes.",
      "why": "This return is deeper than the short-return point and moves your contact behind the baseline. Being ready helps you respond; it does not make a low-margin angle the right choice. Height and depth through the middle offer space and time to recover.",
      "opening": {
        "scene": "sr1BA",
        "from": 230,
        "to": 385,
        "label": "Your preparation · replay",
        "after": "Read this contact",
        "silent": true
      }
    },
    "sr1": {
      "scene": "sr1",
      "ph": "Live Point",
      "short": "Read",
      "name": "What do you do after serving?",
      "sit": "Your wide serve is travelling. The returner can still change the next ball.",
      "q": "What do you do after serving?",
      "opts": [
        "Lean into the forehand plan before the return",
        "Recover balanced, then respond to their hit"
      ],
      "correct": 1,
      "lines": {
        "A": "You guess before seeing the return. Watch what comes back.",
        "B": "You recover with options available, then read the return."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "Being ready helps you adapt. It does not make every return attackable.",
      "payoff": "Being ready helps you adapt. It does not make every return attackable.",
      "principle": "Read the return you get. Change the plan when it changes.",
      "why": "This return is deeper than the short-return point and moves your contact behind the baseline. Being ready helps you respond; it does not make a low-margin angle the right choice. Height and depth through the middle offer space and time to recover."
    }
  },
  "steps": [],
  "finaleScene": "sr1AA",
  "finaleFull": true,
  "memHTML": "Read the return you get. Change the plan when it changes.",
  "cue": "Read the return you get. Change the plan when it changes.",
  "callbackTags": [
    "movement_read",
    "serve-readiness"
  ],
  "tomorrow": "Read the return you get. Change the plan when it changes.",
  "followup": null,
  "transferOf": "live-point-serve-see",
  "returnPrompt": null,
  "learningSignals": [
    "serve-recovery",
    "return-read"
  ],
  "liveFeedback": {
    "summaries": {
      "11": "You recovered early and changed the plan for the deeper return.",
      "10": "You recovered, but forced the angle from a deeper contact.",
      "01": "You corrected your position and adapted to the deeper return.",
      "00": "The early guess cost preparation. The forced angle then went wide."
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
