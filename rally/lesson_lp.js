const LESSON={
  "title": "Buy Time. Use It.",
  "decisionCount": 4,
  "hook": "Up to four connected decisions. Reply, recover, read the next ball, choose again.",
  "livePoint": true,
  "branch": "lp1",
  "nodes": {
    "lp1A": {
      "scene": "lp1A",
      "ph": "Live Point",
      "short": "Read",
      "name": "When do you recover?",
      "sit": "Your flatter reply through the middle is on its way.",
      "q": "When do you recover?",
      "opts": [
        "Recover now; split as they hit",
        "Watch their direction, then recover"
      ],
      "correct": 0,
      "lines": {
        "A": "You used the flight time to move back towards coverage.",
        "B": "You watched the shot. They hit while you were still wide."
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
    "lp1B": {
      "scene": "lp1B",
      "ph": "Live Point",
      "short": "Read",
      "name": "When do you recover?",
      "sit": "Your higher crosscourt reply is on its way.",
      "q": "When do you recover?",
      "opts": [
        "Recover now; split as they hit",
        "Watch their direction, then recover"
      ],
      "correct": 0,
      "lines": {
        "A": "You used the flight time to move back towards coverage.",
        "B": "You watched the shot. They hit while you were still wide."
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
    "lp1": {
      "scene": "lp1",
      "ph": "Live Point",
      "short": "Read",
      "name": "Which reply fits your position?",
      "sit": "Their ball pulls you wide on the forehand side.",
      "q": "Which reply fits your position?",
      "opts": [
        "Drive flatter through the middle",
        "Lift high and deep crosscourt"
      ],
      "correct": 1,
      "lines": {
        "A": "It stays in play, but gets there sooner. Your recovery time is tighter.",
        "B": "More flight time. Now decide how to use it."
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
    },
    "lp1AA": {
      "scene": "lp1AA",
      "ph": "Live Point",
      "short": "Read",
      "name": "Which side needs your first move?",
      "sit": "Their reply is now coming back. Read this ball, not the gap you expected.",
      "q": "Which side needs your first move?",
      "opts": [
        "Move towards the backhand side",
        "Move towards the forehand side"
      ],
      "correct": 0,
      "lines": {
        "A": "The ball is heading to your backhand.",
        "B": "That first move takes you away from this ball."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next situation",
      "take": "Recover for the available angles. Then move to the ball you see.",
      "payoff": "Recover for the available angles. Then move to the ball you see.",
      "principle": "Your reply buys time. Your movement puts it to work.",
      "why": "Recovery covers possibilities. Once the opponent hits, the visible ball gives you new evidence. A first step the wrong way spends time you may need at contact.",
      "opening": {
        "scene": "lp1AAA",
        "from": 262,
        "to": 305,
        "label": "Their reply · replay",
        "after": "Read its direction",
        "silent": true
      }
    },
    "lp1AAA": {
      "scene": "lp1AAA",
      "ph": "Live Point",
      "short": "Read",
      "name": "What reply fits the time you have?",
      "sit": "You have more time to organise this contact.",
      "q": "What reply fits the time you have?",
      "opts": [
        "Lift with margin through the middle",
        "Drive with controlled depth through the middle"
      ],
      "correct": 1,
      "lines": {
        "A": "Height gives you another recovery window. The point continues.",
        "B": "You use your time to play a firmer reply. Keep recovering."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next situation",
      "take": "Choose again from this contact. Then recover again.",
      "payoff": "Choose again from this contact. Then recover again.",
      "principle": "Your reply buys time. Your movement puts it to work.",
      "why": "The earlier reply, recovery and first move affect your preparation time. When time is tight, height gives margin and another recovery window. With time to organise, a controlled deeper drive is an option; a higher reset is still valid.",
      "alsoOk": [
        0
      ],
      "opening": {
        "scene": "lp1AAAA",
        "from": 305,
        "to": 401,
        "label": "Your movement to the next ball",
        "after": "Choose from this contact",
        "silent": true
      }
    },
    "lp1AAB": {
      "scene": "lp1AAB",
      "ph": "Live Point",
      "short": "Read",
      "name": "What reply fits the time you have?",
      "sit": "You are still moving as this contact approaches.",
      "q": "What reply fits the time you have?",
      "opts": [
        "Lift with margin through the middle",
        "Drive with controlled depth through the middle"
      ],
      "correct": 0,
      "lines": {
        "A": "Height gives you another recovery window. The point continues.",
        "B": "The firmer reply leaves a shorter recovery window. Still in play."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next situation",
      "take": "Choose again from this contact. Then recover again.",
      "payoff": "Choose again from this contact. Then recover again.",
      "principle": "Your reply buys time. Your movement puts it to work.",
      "why": "The earlier reply, recovery and first move affect your preparation time. When time is tight, height gives margin and another recovery window. With time to organise, a controlled deeper drive is an option; a higher reset is still valid.",
      "opening": {
        "scene": "lp1AABA",
        "from": 305,
        "to": 401,
        "label": "Your movement to the next ball",
        "after": "Choose from this contact",
        "silent": true
      }
    },
    "lp1AB": {
      "scene": "lp1AB",
      "ph": "Live Point",
      "short": "Read",
      "name": "Which side needs your first move?",
      "sit": "Their reply is now coming back. Read this ball, not the gap you expected.",
      "q": "Which side needs your first move?",
      "opts": [
        "Move towards the backhand side",
        "Move towards the forehand side"
      ],
      "correct": 0,
      "lines": {
        "A": "The ball is heading to your backhand.",
        "B": "That first move takes you away from this ball."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next situation",
      "take": "Recover for the available angles. Then move to the ball you see.",
      "payoff": "Recover for the available angles. Then move to the ball you see.",
      "principle": "Your reply buys time. Your movement puts it to work.",
      "why": "Recovery covers possibilities. Once the opponent hits, the visible ball gives you new evidence. A first step the wrong way spends time you may need at contact.",
      "opening": {
        "scene": "lp1ABA",
        "from": 262,
        "to": 305,
        "label": "Their reply · replay",
        "after": "Read its direction",
        "silent": true
      }
    },
    "lp1BA": {
      "scene": "lp1BA",
      "ph": "Live Point",
      "short": "Read",
      "name": "Which side needs your first move?",
      "sit": "Their reply is now coming back. Read this ball, not the gap you expected.",
      "q": "Which side needs your first move?",
      "opts": [
        "Move towards the backhand side",
        "Move towards the forehand side"
      ],
      "correct": 1,
      "lines": {
        "A": "That first move takes you away from this ball.",
        "B": "The ball is heading to your forehand."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next situation",
      "take": "Recover for the available angles. Then move to the ball you see.",
      "payoff": "Recover for the available angles. Then move to the ball you see.",
      "principle": "Your reply buys time. Your movement puts it to work.",
      "why": "Recovery covers possibilities. Once the opponent hits, the visible ball gives you new evidence. A first step the wrong way spends time you may need at contact.",
      "opening": {
        "scene": "lp1BAA",
        "from": 309,
        "to": 352,
        "label": "Their reply · replay",
        "after": "Read its direction",
        "silent": true
      }
    },
    "lp1BAA": {
      "scene": "lp1BAA",
      "ph": "Live Point",
      "short": "Read",
      "name": "What reply fits the time you have?",
      "sit": "You have more time to organise this contact.",
      "q": "What reply fits the time you have?",
      "opts": [
        "Lift with margin through the middle",
        "Drive with controlled depth through the middle"
      ],
      "correct": 1,
      "lines": {
        "A": "Height gives you another recovery window. The point continues.",
        "B": "You use your time to play a firmer reply. Keep recovering."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next situation",
      "take": "Choose again from this contact. Then recover again.",
      "payoff": "Choose again from this contact. Then recover again.",
      "principle": "Your reply buys time. Your movement puts it to work.",
      "why": "The earlier reply, recovery and first move affect your preparation time. When time is tight, height gives margin and another recovery window. With time to organise, a controlled deeper drive is an option; a higher reset is still valid.",
      "alsoOk": [
        0
      ],
      "opening": {
        "scene": "lp1BAAA",
        "from": 352,
        "to": 460,
        "label": "Your movement to the next ball",
        "after": "Choose from this contact",
        "silent": true
      }
    },
    "lp1BAB": {
      "scene": "lp1BAB",
      "ph": "Live Point",
      "short": "Read",
      "name": "What reply fits the time you have?",
      "sit": "You have more time to organise this contact.",
      "q": "What reply fits the time you have?",
      "opts": [
        "Lift with margin through the middle",
        "Drive with controlled depth through the middle"
      ],
      "correct": 1,
      "lines": {
        "A": "Height gives you another recovery window. The point continues.",
        "B": "You use your time to play a firmer reply. Keep recovering."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next situation",
      "take": "Choose again from this contact. Then recover again.",
      "payoff": "Choose again from this contact. Then recover again.",
      "principle": "Your reply buys time. Your movement puts it to work.",
      "why": "The earlier reply, recovery and first move affect your preparation time. When time is tight, height gives margin and another recovery window. With time to organise, a controlled deeper drive is an option; a higher reset is still valid.",
      "alsoOk": [
        0
      ],
      "opening": {
        "scene": "lp1BABA",
        "from": 352,
        "to": 460,
        "label": "Your movement to the next ball",
        "after": "Choose from this contact",
        "silent": true
      }
    },
    "lp1BB": {
      "scene": "lp1BB",
      "ph": "Live Point",
      "short": "Read",
      "name": "Which side needs your first move?",
      "sit": "Their reply is now coming back. Read this ball, not the gap you expected.",
      "q": "Which side needs your first move?",
      "opts": [
        "Move towards the backhand side",
        "Move towards the forehand side"
      ],
      "correct": 1,
      "lines": {
        "A": "That first move takes you away from this ball.",
        "B": "The ball is heading to your forehand."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next situation",
      "take": "Recover for the available angles. Then move to the ball you see.",
      "payoff": "Recover for the available angles. Then move to the ball you see.",
      "principle": "Your reply buys time. Your movement puts it to work.",
      "why": "Recovery covers possibilities. Once the opponent hits, the visible ball gives you new evidence. A first step the wrong way spends time you may need at contact.",
      "opening": {
        "scene": "lp1BBA",
        "from": 309,
        "to": 352,
        "label": "Their reply · replay",
        "after": "Read its direction",
        "silent": true
      }
    },
    "lp1BBA": {
      "scene": "lp1BBA",
      "ph": "Live Point",
      "short": "Read",
      "name": "What reply fits the time you have?",
      "sit": "You have more time to organise this contact.",
      "q": "What reply fits the time you have?",
      "opts": [
        "Lift with margin through the middle",
        "Drive with controlled depth through the middle"
      ],
      "correct": 1,
      "lines": {
        "A": "Height gives you another recovery window. The point continues.",
        "B": "You use your time to play a firmer reply. Keep recovering."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next situation",
      "take": "Choose again from this contact. Then recover again.",
      "payoff": "Choose again from this contact. Then recover again.",
      "principle": "Your reply buys time. Your movement puts it to work.",
      "why": "The earlier reply, recovery and first move affect your preparation time. When time is tight, height gives margin and another recovery window. With time to organise, a controlled deeper drive is an option; a higher reset is still valid.",
      "alsoOk": [
        0
      ],
      "opening": {
        "scene": "lp1BBAA",
        "from": 352,
        "to": 460,
        "label": "Your movement to the next ball",
        "after": "Choose from this contact",
        "silent": true
      }
    },
    "lp1BBB": {
      "scene": "lp1BBB",
      "ph": "Live Point",
      "short": "Read",
      "name": "What reply fits the time you have?",
      "sit": "You have more time to organise this contact.",
      "q": "What reply fits the time you have?",
      "opts": [
        "Lift with margin through the middle",
        "Drive with controlled depth through the middle"
      ],
      "correct": 1,
      "lines": {
        "A": "Height gives you another recovery window. The point continues.",
        "B": "You use your time to play a firmer reply. Keep recovering."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next situation",
      "take": "Choose again from this contact. Then recover again.",
      "payoff": "Choose again from this contact. Then recover again.",
      "principle": "Your reply buys time. Your movement puts it to work.",
      "why": "The earlier reply, recovery and first move affect your preparation time. When time is tight, height gives margin and another recovery window. With time to organise, a controlled deeper drive is an option; a higher reset is still valid.",
      "alsoOk": [
        0
      ],
      "opening": {
        "scene": "lp1BBBA",
        "from": 352,
        "to": 460,
        "label": "Your movement to the next ball",
        "after": "Choose from this contact",
        "silent": true
      }
    }
  },
  "steps": [],
  "finaleScene": "lp1AA",
  "finaleFull": true,
  "memHTML": "Buy yourself time. <span>Use it to recover.</span>",
  "cue": "Buy yourself time. Use it to recover.",
  "callbackTags": [
    "movement_read",
    "recovery_time"
  ],
  "tomorrow": "On your next wide ball, choose the time you need, then start recovering while your reply travels.",
  "redoLabel": "Try another route through this point",
  "followup": "live-point-other-wing",
  "transferOf": null,
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
    "recovery",
    "direction",
    "next-reply"
  ],
  "edition": "connected-four-v2"
};
