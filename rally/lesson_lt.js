const LESSON={
  "title": "Other Wing. Same Read?",
  "decisionCount": 2,
  "hook": "Two decisions. Watch how your reply and recovery shape the next ball.",
  "livePoint": true,
  "branch": "lt1",
  "nodes": {
    "lt1A": {
      "scene": "lt1A",
      "ph": "Live Point",
      "short": "Read",
      "name": "When do you recover?",
      "sit": "Your higher crosscourt reply is on its way.",
      "q": "When do you recover?",
      "opts": [
        "Watch their direction, then recover",
        "Recover now; split as they hit"
      ],
      "correct": 1,
      "lines": {
        "A": "You watched the shot. They hit while you were still wide.",
        "B": "You used the flight time to move back towards coverage."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next situation",
      "take": "Start recovering during your shot. Read their hit to adjust.",
      "payoff": "Start recovering during your shot. Read their hit to adjust.",
      "principle": "Your reply buys time. Your movement puts it to work.",
      "why": "Move towards a position that covers their available angles while your ball travels. Time your split around their contact, then respond to what they actually hit. The higher reply gives you more time to do this.",
      "continuation": true
    },
    "lt1B": {
      "scene": "lt1B",
      "ph": "Live Point",
      "short": "Read",
      "name": "When do you recover?",
      "sit": "Your flatter reply through the middle is on its way.",
      "q": "When do you recover?",
      "opts": [
        "Watch their direction, then recover",
        "Recover now; split as they hit"
      ],
      "correct": 1,
      "lines": {
        "A": "You watched the shot. They hit while you were still wide.",
        "B": "You used the flight time to move back towards coverage."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next situation",
      "take": "Start recovering during your shot. Read their hit to adjust.",
      "payoff": "Start recovering during your shot. Read their hit to adjust.",
      "principle": "Your reply buys time. Your movement puts it to work.",
      "why": "Move towards a position that covers their available angles while your ball travels. Time your split around their contact, then respond to what they actually hit. This quicker reply leaves less recovery time; starting promptly still helps.",
      "continuation": true
    },
    "lt1": {
      "scene": "lt1",
      "ph": "Live Point",
      "short": "Read",
      "name": "Which reply fits your position?",
      "sit": "Their ball pulls you wide on the backhand side.",
      "q": "Which reply fits your position?",
      "opts": [
        "Lift high and deep crosscourt",
        "Drive flatter through the middle"
      ],
      "correct": 0,
      "lines": {
        "A": "More flight time. Now decide how to use it.",
        "B": "It stays in play, but gets there sooner. Your recovery time is tighter."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next situation",
      "take": "When stretched, choose a reply that gives you time to recover.",
      "payoff": "When stretched, choose a reply that gives you time to recover.",
      "principle": "Your reply buys time. Your movement puts it to work.",
      "why": "Here you are wide with a low contact. Height and depth crosscourt offer margin and extra flight time. The flatter middle reply remains playable in this example, but leaves less time to regain position. The useful comparison is time and position, not whether one illustrated shot wins."
    }
  },
  "steps": [],
  "finaleScene": "lt1AA",
  "finaleFull": true,
  "memHTML": "Buy yourself time. <span>Use it to recover.</span>",
  "cue": "Buy yourself time. Use it to recover.",
  "callbackTags": [
    "movement_read",
    "recovery_time"
  ],
  "tomorrow": "On your next wide ball, choose the time you need, then start recovering while your reply travels.",
  "redoLabel": "Try another route through this point",
  "followup": null,
  "transferOf": "live-point-buy-time",
  "pro": {
    "player": "Carlos Alcaraz",
    "label": "Alcaraz · Defence creates options",
    "moment": "Craig O’Shannessy’s Winning on Defense overview highlights changes of speed, spin and height, with Alcaraz among the players analysed.",
    "read": "Your next point: judge the reply and the recovery together. A higher ball can buy time; moving while it travels turns that time into a better starting position. Keep reading the opponent—neither choice guarantees the next reply.",
    "src": "Craig O’Shannessy · Winning on Defense · public overview",
    "url": "https://braingametennis.com/webinar-73-winning-on-defense/"
  },
  "drill": {
    "name": "Use the flight",
    "how": "With a partner, start from a comfortable wide feed. Try a higher reply and a flatter one, then notice where you are when they hit. Judge your available time and position, not just the point result."
  },
  "family": "recovery-time",
  "learningSignals": [
    "reply",
    "recovery"
  ]
};
