const LESSON={
  "title": "The Line Is Tempting",
  "decisionCount": 2,
  "hook": "Two connected choices. Watch what your first shot creates.",
  "liveIntro": "You are pulled wide and behind the baseline on your backhand. The opposite sideline looks inviting.",
  "specificFeedback": true,
  "livePoint": true,
  "family": "direction-change",
  "edition": "ten-live-v1",
  "branch": "tl1",
  "nodes": {
    "tl1A": {
      "scene": "tl1A",
      "ph": "Live Point",
      "short": "Read",
      "name": "Choose from this contact, not the last one.",
      "sit": "You used the extra flight time. Their reply now comes to your forehand.",
      "q": "Choose from this contact, not the last one.",
      "opts": [
        "Lift deep through the middle",
        "Press into the open side"
      ],
      "correct": 0,
      "lines": {
        "A": "You restore depth and cover the next angles. Still in play.",
        "B": "You have room for controlled pressure here. Recover again after contact."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "An empty corner is only an opportunity if your contact supports the shot.",
      "payoff": "An empty corner is only an opportunity if your contact supports the shot.",
      "principle": "Balance before direction. Give yourself room to recover.",
      "why": "A wide, low contact behind the baseline makes a direction change more demanding and leaves court to cover. Higher crosscourt play can buy recovery time. Judge the next shot from the new ball and balance, not from whether the previous attempt happened to land.",
      "alsoOk": [
        1
      ],
      "opening": {
        "scene": "tl1AA",
        "from": 526,
        "to": 526,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "tl1B": {
      "scene": "tl1B",
      "ph": "Live Point",
      "short": "Read",
      "name": "Choose from this contact, not the last one.",
      "sit": "Their crosscourt reply sends you a long way to the forehand. You are hurried.",
      "q": "Choose from this contact, not the last one.",
      "opts": [
        "Lift deep through the middle",
        "Press into the open side"
      ],
      "correct": 0,
      "lines": {
        "A": "The higher reply gives you another recovery window.",
        "B": "It lands here, but pressing while hurried leaves little margin."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "An empty corner is only an opportunity if your contact supports the shot.",
      "payoff": "An empty corner is only an opportunity if your contact supports the shot.",
      "principle": "Balance before direction. Give yourself room to recover.",
      "why": "A wide, low contact behind the baseline makes a direction change more demanding and leaves court to cover. Higher crosscourt play can buy recovery time. Judge the next shot from the new ball and balance, not from whether the previous attempt happened to land.",
      "opening": {
        "scene": "tl1BA",
        "from": 453,
        "to": 453,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "tl1": {
      "scene": "tl1",
      "ph": "Live Point",
      "short": "Read",
      "name": "Does this contact support changing direction?",
      "sit": "You are pulled wide and behind the baseline on your backhand. The opposite sideline looks inviting.",
      "q": "Does this contact support changing direction?",
      "opts": [
        "Lift crosscourt with room",
        "Drive close to the line"
      ],
      "correct": 0,
      "lines": {
        "A": "The higher crosscourt ball gives you time to cover. Read their next direction.",
        "B": "You change direction while stretched. Their reply takes you across the court."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "An empty corner is only an opportunity if your contact supports the shot.",
      "payoff": "An empty corner is only an opportunity if your contact supports the shot.",
      "principle": "Balance before direction. Give yourself room to recover.",
      "why": "A wide, low contact behind the baseline makes a direction change more demanding and leaves court to cover. Higher crosscourt play can buy recovery time. Judge the next shot from the new ball and balance, not from whether the previous attempt happened to land."
    }
  },
  "steps": [],
  "finaleScene": "tl1AA",
  "finaleFull": true,
  "memHTML": "Balance before direction. Give yourself room to recover.",
  "cue": "Balance before direction. Give yourself room to recover.",
  "callbackTags": [
    "direction-margin",
    "recovery-read"
  ],
  "tomorrow": "An empty corner is only an opportunity if your contact supports the shot.",
  "followup": "live-point-line-opens",
  "transferOf": null,
  "returnPrompt": "A different ball changes the decision. Try the paired point.",
  "learningSignals": [
    "direction-margin",
    "recovery-read"
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
    "moment": "Technical and tactical fundamentals connect shot selection with balance, court position and recovery. The point applies those principles to a stretched direction change.",
    "read": "A wide, low contact behind the baseline makes a direction change more demanding and leaves court to cover. Higher crosscourt play can buy recovery time. Judge the next shot from the new ball and balance, not from whether the previous attempt happened to land.",
    "src": "Tennis Australia · Technical and tactical fundamentals",
    "url": "https://www.tennis.com.au/wp-content/uploads/2014/11/Technical-and-Tactical-fundamentals-guidelines_low-res.pdf"
  },
  "drill": {
    "name": "Two-ball read",
    "how": "Alternate a wide deep feed and a shorter central feed. Call “hold” or “change” before contact; recover and play the next ball."
  }
};
