const LESSON={
  "title": "First Volley: Build the Point",
  "decisionCount": 2,
  "hook": "Two connected choices. Watch what your first shot creates.",
  "liveIntro": "Your approach brings you in. Their passing shot dips below net height on your forehand side.",
  "livePoint": true,
  "family": "first-volley",
  "edition": "ten-live-v1",
  "branch": "tv1",
  "nodes": {
    "tv1A": {
      "scene": "tv1A",
      "ph": "Live Point",
      "short": "Read",
      "name": "How do you handle this next volley?",
      "sit": "Their next pass comes to your backhand. You have stayed balanced near the net.",
      "q": "How do you handle this next volley?",
      "opts": [
        "Keep the action compact and place it deep",
        "Force a very short angle"
      ],
      "correct": 0,
      "lines": {
        "A": "You keep the racket in front and use depth. The point continues.",
        "B": "The angle lands here, but the moving contact makes that small target demanding."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "A low first volley builds the point. Depth can earn the next ball.",
      "payoff": "A low first volley builds the point. Depth can earn the next ball.",
      "principle": "Low volley, compact action. Build the point, then stay ready.",
      "why": "Split around their hit, lower with the legs and use a compact forward action. A low contact needs clearance. A short floating volley gives the passer time and space; a deep volley can restrict those options without guaranteeing an easy finish.",
      "opening": {
        "scene": "tv1AA",
        "from": 631,
        "to": 631,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "tv1B": {
      "scene": "tv1B",
      "ph": "Live Point",
      "short": "Read",
      "name": "How do you handle this next volley?",
      "sit": "Their earlier pass comes lower and farther to your backhand. You have to adjust.",
      "q": "How do you handle this next volley?",
      "opts": [
        "Keep the action compact and place it deep",
        "Force a very short angle"
      ],
      "correct": 0,
      "lines": {
        "A": "You respect the lower contact and keep the ball playable.",
        "B": "A small target demands more while hurried. A landing does not prove the choice."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "A low first volley builds the point. Depth can earn the next ball.",
      "payoff": "A low first volley builds the point. Depth can earn the next ball.",
      "principle": "Low volley, compact action. Build the point, then stay ready.",
      "why": "Split around their hit, lower with the legs and use a compact forward action. A low contact needs clearance. A short floating volley gives the passer time and space; a deep volley can restrict those options without guaranteeing an easy finish.",
      "opening": {
        "scene": "tv1BA",
        "from": 608,
        "to": 608,
        "label": "Read the reply",
        "after": "Choose from this contact",
        "silent": true,
        "continuous": true
      }
    },
    "tv1": {
      "scene": "tv1",
      "ph": "Live Point",
      "short": "Read",
      "name": "What does this low first volley need?",
      "sit": "Your approach brings you in. Their passing shot dips below net height on your forehand side.",
      "q": "What does this low first volley need?",
      "opts": [
        "Bend and guide with depth through the middle",
        "Float a short volley toward their side"
      ],
      "correct": 0,
      "lines": {
        "A": "Your compact volley gives clearance and depth. Reset for their next hit.",
        "B": "The short float lets them move forward. Stay ready for a harder second volley."
      },
      "noTargets": true,
      "rail": [
        "Watch",
        "Choose",
        "See what changes"
      ],
      "unlock": "Read the next ball",
      "take": "A low first volley builds the point. Depth can earn the next ball.",
      "payoff": "A low first volley builds the point. Depth can earn the next ball.",
      "principle": "Low volley, compact action. Build the point, then stay ready.",
      "why": "Split around their hit, lower with the legs and use a compact forward action. A low contact needs clearance. A short floating volley gives the passer time and space; a deep volley can restrict those options without guaranteeing an easy finish."
    }
  },
  "steps": [],
  "finaleScene": "tv1AA",
  "finaleFull": true,
  "memHTML": "Low volley, compact action. Build the point, then stay ready.",
  "cue": "Low volley, compact action. Build the point, then stay ready.",
  "callbackTags": [
    "volley-height",
    "second-volley"
  ],
  "tomorrow": "A low first volley builds the point. Depth can earn the next ball.",
  "followup": "live-point-volley-opening",
  "transferOf": null,
  "returnPrompt": "A different ball changes the decision. Try the paired point.",
  "learningSignals": [
    "volley-height",
    "second-volley"
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
    "moment": "Tennis Australia’s volley fundamentals emphasise preparation, balance and contact in front. The low volley here uses the repaired shared leg-loading and forward-action motion.",
    "read": "Split around their hit, lower with the legs and use a compact forward action. A low contact needs clearance. A short floating volley gives the passer time and space; a deep volley can restrict those options without guaranteeing an easy finish.",
    "src": "Tennis Australia · Technical and tactical fundamentals",
    "url": "https://www.tennis.com.au/wp-content/uploads/2014/11/Technical-and-Tactical-fundamentals-guidelines_low-res.pdf"
  },
  "drill": {
    "name": "Two-ball read",
    "how": "Approach a deep feed. Have the passer alternate low forehand and backhand passes. Play two volleys, valuing balance and depth before a finish."
  }
};
