(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root) root.GSLivePointContent=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const GOLD='#c8a84b', RED='#e07070', GREEN='#5bba6f';

const scenarios = [
  {
    "id": "short_ball",
    "title": "Short Ball",
    "opp": "<b>Counter-puncher</b> — defends deep, feeds off your pace. Patience, then commit.",
    "d1": {
      "sit": "You've pushed the counter-puncher deep. Their tired reply sits up short at your service line — you've stepped in early.",
      "q": "How do you play the short ball?",
      "opts": [
        {
          "lbl": "Drive it hard into the open court",
          "sub": "Take time away — go for the corner",
          "br": "A"
        },
        {
          "lbl": "Approach deep and close the net",
          "sub": "Controlled — pressure them into a pass",
          "br": "B"
        }
      ],
      "court": {
        "youStart": [
          100,
          220
        ],
        "oppStart": [
          100,
          30
        ],
        "shots": [],
        "sitter": [
          100,
          220
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          100,
          220
        ],
        "oppStart": [
          100,
          30
        ],
        "oppEnd": [
          62,
          52
        ],
        "shots": [
          {
            "from": [
              100,
              220
            ],
            "to": [
              44,
              44
            ],
            "bend": 8,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "DRIVE",
            "contactType": "ground"
          },
          {
            "from": [
              44,
              44
            ],
            "to": [
              112,
              208
            ],
            "bend": -16,
            "color": "#e07070",
            "snd": "slice",
            "label": "FLOATER",
            "contactType": "slice"
          }
        ],
        "youEnd": [
          112,
          208
        ]
      },
      "reveal": "Good drive — but a counter-puncher's legs turn your winner into a <b>floated second chance</b>. Now the read: which way are they recovering?",
      "d2": {
        "sit": "Their floater sits up mid-court. They scrambled wide and are now <b>sprinting back toward the middle.</b>",
        "q": "Option off the option — where do you put it?",
        "opts": [
          {
            "lbl": "Behind them — into the corner they left",
            "sub": "Wrong-foot the recovering player",
            "win": true,
            "id": "short_ball:A:preferred"
          },
          {
            "lbl": "Into the open court they're running to",
            "sub": "Hit to the space on the other side",
            "win": false,
            "id": "short_ball:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          112,
          208
        ],
        "oppStart": [
          62,
          52
        ],
        "oppEnd": [
          104,
          40
        ],
        "shots": [
          {
            "from": [
              112,
              208
            ],
            "to": [
              46,
              48
            ],
            "bend": 8,
            "color": "#5bba6f",
            "snd": "pop",
            "payoff": true,
            "label": "BEHIND THEM",
            "intent": "behind",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "You read the runner. They committed their weight to recovering the open court — so the ball <b>behind</b> them makes them stop, reverse and reach. Once that recovery is committed, the wrong-foot can be safer than feeding their run.",
      "mid": {
        "youStart": [
          112,
          208
        ],
        "oppStart": [
          62,
          52
        ],
        "oppEnd": [
          158,
          46
        ],
        "shots": [
          {
            "from": [
              112,
              208
            ],
            "to": [
              158,
              46
            ],
            "bend": -8,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "OPEN COURT",
            "intent": "into_run",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "They got there.",
      "midTxt": "Clean shot — but a counter-puncher was already recovering that way. You hit into their run. The open court is the instinct; <b>behind them</b> was the kill, because their momentum was the thing to exploit."
    },
    "B": {
      "seq": {
        "youStart": [
          100,
          220
        ],
        "youEnd": [
          108,
          178
        ],
        "oppStart": [
          100,
          30
        ],
        "oppEnd": [
          158,
          46
        ],
        "shots": [
          {
            "from": [
              100,
              220
            ],
            "to": [
              158,
              46
            ],
            "bend": -10,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "APPROACH",
            "contactType": "ground"
          },
          {
            "from": [
              158,
              46
            ],
            "to": [
              108,
              178
            ],
            "bend": 12,
            "color": "#e07070",
            "snd": "drive",
            "noBounce": true,
            "label": "DIPPING PASS",
            "contactType": "ground"
          }
        ]
      },
      "reveal": "Deep approach — so their pass has to come <b>up</b>, and it's dipping at your feet. You're at the net now. <b>Low ball, no pace to borrow.</b>",
      "d2": {
        "sit": "You're at the net. Their pass is <b>low and dipping at your feet</b> — below the net cord, no pace on it.",
        "q": "Option off the option — how do you volley it?",
        "opts": [
          {
            "lbl": "Punch it deep and hold your position",
            "sub": "Can't hit down — so reset deep",
            "win": true,
            "id": "short_ball:B:preferred"
          },
          {
            "lbl": "Go for the sharp angle winner",
            "sub": "End it now with a touch angle",
            "win": false,
            "id": "short_ball:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          108,
          178
        ],
        "oppStart": [
          158,
          46
        ],
        "oppEnd": [
          150,
          42
        ],
        "shots": [
          {
            "from": [
              108,
              178
            ],
            "to": [
              158,
              42
            ],
            "bend": -8,
            "color": "#5bba6f",
            "snd": "volley",
            "payoff": true,
            "label": "DEEP VOLLEY",
            "intent": "deep",
            "contactType": "volley"
          }
        ]
      },
      "winTitle": "Net position held.",
      "winTxt": "From below the net you can't hit down — so you don't gamble. The <b>deep</b> volley pins them back, keeps you at net and makes the next contact easier. You have preserved the advantage instead of asking a low ball for an instant winner.",
      "mid": {
        "youStart": [
          108,
          178
        ],
        "oppStart": [
          158,
          46
        ],
        "oppEnd": [
          158,
          46
        ],
        "shots": [
          {
            "from": [
              108,
              178
            ],
            "to": [
              42,
              116
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "volley",
            "label": "ANGLE",
            "intent": "angle",
            "miss": "net",
            "contactType": "volley"
          }
        ]
      },
      "midTitle": "Into the net.",
      "midTxt": "From a ball at your feet the sharp <b>angle</b> has little margin — you must lift it while also finding width. Deep and controlled preserves the net; look for the finish when the next ball rises above the tape."
    }
  },
  {
    "id": "serve_plus_one",
    "title": "Serve +1 Wide",
    "opp": "<b>After the wide serve.</b> The returner has been pulled toward the sideline and their return is short.",
    "d1": {
      "sit": "30–30. Earlier, the returner guarded the middle. Your wide serve has now pulled them toward the sideline; their stretched reply is short. Read this next ball.",
      "q": "Where's your +1?",
      "opts": [
        {
          "lbl": "Drive to the open court",
          "sub": "Take the space the serve just made",
          "br": "A"
        },
        {
          "lbl": "Approach behind a deep +1",
          "sub": "Come to net off the weak reply",
          "br": "B"
        }
      ],
      "court": {
        "youStart": [
          100,
          215
        ],
        "oppStart": [
          42,
          55
        ],
        "shots": [],
        "sitter": [
          100,
          215
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          100,
          215
        ],
        "oppStart": [
          42,
          55
        ],
        "oppEnd": [
          145,
          52
        ],
        "shots": [
          {
            "from": [
              100,
              215
            ],
            "to": [
              158,
              50
            ],
            "bend": 8,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "OPEN COURT",
            "contactType": "ground"
          },
          {
            "from": [
              158,
              50
            ],
            "to": [
              90,
              208
            ],
            "bend": -16,
            "color": "#e07070",
            "snd": "slice",
            "label": "SCRAMBLE",
            "contactType": "slice"
          }
        ],
        "youEnd": [
          90,
          208
        ]
      },
      "reveal": "The wide serve's whole job was to open that court — the +1 just collects the space. They're stranded wide and scrambling, floating it back short.",
      "d2": {
        "sit": "Their scramble floats up short. They lunged wide and are now <b>sprinting back toward the middle.</b>",
        "q": "Finish it — where?",
        "opts": [
          {
            "lbl": "Behind them — into the corner they left",
            "sub": "Wrong-foot the recovery",
            "win": true,
            "id": "serve_plus_one:A:preferred"
          },
          {
            "lbl": "Into the open court they're sprinting to",
            "sub": "Hit the far side",
            "win": false,
            "id": "serve_plus_one:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          90,
          208
        ],
        "oppStart": [
          145,
          52
        ],
        "oppEnd": [
          96,
          44
        ],
        "shots": [
          {
            "from": [
              90,
              208
            ],
            "to": [
              154,
              52
            ],
            "bend": 8,
            "color": "#5bba6f",
            "snd": "pop",
            "payoff": true,
            "label": "BEHIND THEM",
            "intent": "behind",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "They committed their weight back to the middle — so the ball <b>behind</b> them freezes them, then makes them reverse and reach. The serve, the +1 and the wrong-foot are one pattern, not three separate shots.",
      "mid": {
        "youStart": [
          90,
          208
        ],
        "oppStart": [
          145,
          52
        ],
        "oppEnd": [
          42,
          46
        ],
        "shots": [
          {
            "from": [
              90,
              208
            ],
            "to": [
              42,
              46
            ],
            "bend": -8,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "OPEN COURT",
            "intent": "into_run",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "They got there.",
      "midTxt": "Clean — but they were already sprinting that way, so you hit into their run. The kill was behind them, into the <b>open</b> space they'd just left."
    },
    "B": {
      "seq": {
        "youStart": [
          100,
          215
        ],
        "youEnd": [
          92,
          178
        ],
        "oppStart": [
          42,
          55
        ],
        "oppEnd": [
          142,
          50
        ],
        "shots": [
          {
            "from": [
              100,
              215
            ],
            "to": [
              158,
              46
            ],
            "bend": 8,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "APPROACH",
            "contactType": "ground"
          },
          {
            "from": [
              158,
              46
            ],
            "to": [
              92,
              178
            ],
            "bend": 12,
            "color": "#e07070",
            "snd": "drive",
            "noBounce": true,
            "label": "DIPPING PASS",
            "contactType": "ground"
          }
        ]
      },
      "reveal": "Deep approach into the open court — so their pass has to climb, and it's dipping at your feet. You're at the net now: low ball, no pace to borrow.",
      "d2": {
        "sit": "You're at the net. Their pass is <b>low and dipping at your feet</b> — below the net cord.",
        "q": "How do you volley it?",
        "opts": [
          {
            "lbl": "Punch it deep and hold your position",
            "sub": "Can't hit down — reset deep",
            "win": true,
            "id": "serve_plus_one:B:preferred"
          },
          {
            "lbl": "Go for the sharp angle winner",
            "sub": "End it with touch",
            "win": false,
            "id": "serve_plus_one:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          92,
          178
        ],
        "oppStart": [
          142,
          50
        ],
        "oppEnd": [
          134,
          48
        ],
        "shots": [
          {
            "from": [
              92,
              178
            ],
            "to": [
              154,
              44
            ],
            "bend": 6,
            "color": "#5bba6f",
            "snd": "volley",
            "payoff": true,
            "label": "DEEP VOLLEY",
            "intent": "deep",
            "contactType": "volley"
          }
        ]
      },
      "winTitle": "Net position held.",
      "winTxt": "From below the net you can't hit down — so you don't gamble. The <b>deep</b> volley pins them back, keeps you at the net and preserves the advantage the serve created. Placement gives you the better next contact.",
      "mid": {
        "youStart": [
          92,
          178
        ],
        "oppStart": [
          142,
          50
        ],
        "oppEnd": [
          142,
          50
        ],
        "shots": [
          {
            "from": [
              92,
              178
            ],
            "to": [
              156,
              116
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "volley",
            "label": "ANGLE",
            "intent": "angle",
            "miss": "net",
            "contactType": "volley"
          }
        ]
      },
      "midTitle": "Into the net.",
      "midTxt": "From a ball at your feet the sharp <b>angle</b> has little margin — you must lift it while also finding width. Deep and controlled keeps the advantage; attack the angle when contact is above the tape."
    }
  },
  {
    "id": "second_serve",
    "title": "Second-Serve Attack",
    "opp": "<b>Nervous second serve</b> — it floats up high in the box. Your chance to take control.",
    "d1": {
      "sit": "Break point. They push in a tentative second serve that sits up high and slow. You have time and position — this is the ball you wait for.",
      "q": "How do you attack it?",
      "opts": [
        {
          "lbl": "Step in and drive it deep",
          "sub": "Take their time away from the baseline",
          "br": "A"
        },
        {
          "lbl": "Chip and charge the net",
          "sub": "Rush them into a pass",
          "br": "B"
        }
      ],
      "court": {
        "youStart": [
          100,
          238
        ],
        "oppStart": [
          100,
          32
        ],
        "shots": [],
        "sitter": [
          100,
          238
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          100,
          238
        ],
        "youEnd": [
          150,
          205
        ],
        "oppStart": [
          100,
          32
        ],
        "oppEnd": [
          100,
          42
        ],
        "shots": [
          {
            "from": [
              100,
              238
            ],
            "to": [
              156,
              48
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "DRIVE DEEP",
            "contactType": "ground"
          },
          {
            "from": [
              156,
              48
            ],
            "to": [
              150,
              205
            ],
            "bend": -12,
            "color": "#e07070",
            "snd": "slice",
            "label": "BLOCKED SHORT",
            "contactType": "slice"
          }
        ]
      },
      "reveal": "Stepping in stole their time — they could only block it back short on your forehand side. Now you've got a mid-court ball and they're held deep in the court.",
      "d2": {
        "sit": "Their block lands short but stays below comfortable strike height. They're held deep in the court, but this ball still needs margin.",
        "q": "Convert the low short ball — how?",
        "opts": [
          {
            "lbl": "Approach down the line and close",
            "sub": "Follow it to the net",
            "win": true,
            "id": "second_serve:A:preferred"
          },
          {
            "lbl": "Drive flatter into the crosscourt corner",
            "sub": "End it from here",
            "win": false,
            "id": "second_serve:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          150,
          205
        ],
        "youEnd": [
          100,
          152
        ],
        "oppStart": [
          100,
          42
        ],
        "oppEnd": [
          100,
          42
        ],
        "shots": [
          {
            "from": [
              150,
              205
            ],
            "to": [
              154,
              44
            ],
            "bend": 4,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "APPROACH",
            "intent": "deep",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Attack built.",
      "winTxt": "Because the ball stayed low, the percentage attack is a <b>deep</b> approach with margin, followed by a balanced close. The return earned territory, not permission to flatten a low ball at a sideline.",
      "mid": {
        "youStart": [
          150,
          205
        ],
        "oppStart": [
          100,
          42
        ],
        "oppEnd": [
          100,
          42
        ],
        "shots": [
          {
            "from": [
              150,
              205
            ],
            "to": [
              42,
              50
            ],
            "bend": -8,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "FLAT WINNER",
            "intent": "risk",
            "miss": "long",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Just long.",
      "midTxt": "The crosscourt diagonal is long and crosses the lower middle of the net, but flattening a <b>low</b> ball at a sideline still removes your shape and margin. Build the point with a controlled approach; do not confuse court position with a guaranteed winner."
    },
    "B": {
      "seq": {
        "youStart": [
          100,
          238
        ],
        "youEnd": [
          52,
          172
        ],
        "oppStart": [
          100,
          32
        ],
        "oppEnd": [
          148,
          50
        ],
        "shots": [
          {
            "from": [
              100,
              240
            ],
            "to": [
              150,
              50
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "slice",
            "label": "CHIP & CHARGE",
            "contactType": "slice"
          },
          {
            "from": [
              150,
              50
            ],
            "to": [
              52,
              172
            ],
            "bend": 10,
            "color": "#e07070",
            "snd": "drive",
            "noBounce": true,
            "label": "RUSHED PASS",
            "contactType": "ground"
          }
        ]
      },
      "reveal": "The chip is low and deep — they have to pass from below the net, on the run. You've closed in behind it, and their rushed pass floats up a touch high.",
      "d2": {
        "sit": "You're tight to the net. Their rushed pass <b>floats up a touch high</b>, over to your side.",
        "q": "Put the volley away — where?",
        "opts": [
          {
            "lbl": "Punch it into the open court",
            "sub": "Take the space they left",
            "win": true,
            "id": "second_serve:B:preferred"
          },
          {
            "lbl": "Use a drop volley into the short court",
            "sub": "Feather it over the net",
            "win": false,
            "id": "second_serve:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          52,
          172
        ],
        "oppStart": [
          148,
          50
        ],
        "oppEnd": [
          138,
          48
        ],
        "shots": [
          {
            "from": [
              52,
              172
            ],
            "to": [
              44,
              44
            ],
            "bend": -6,
            "color": "#5bba6f",
            "snd": "volley",
            "payoff": true,
            "label": "OPEN COURT",
            "intent": "space",
            "contactType": "volley"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "They're stranded wide from chasing the chip. A firm volley into the <b>open</b> court is the whole point of coming in — take the space, don't get cute. The rushed pass was the gift; the open court is the finish.",
      "mid": {
        "youStart": [
          52,
          172
        ],
        "oppStart": [
          148,
          50
        ],
        "oppEnd": [
          148,
          50
        ],
        "shots": [
          {
            "from": [
              52,
              172
            ],
            "to": [
              104,
              140
            ],
            "bend": 2,
            "color": "#c8a84b",
            "snd": "volley",
            "label": "DROP",
            "intent": "risk",
            "miss": "net",
            "contactType": "volley"
          }
        ]
      },
      "midTitle": "Netted the drop.",
      "midTxt": "A drop volley can work, but here it gives away margin and asks for unnecessary precision. The pass is high and the opponent is stranded wide; the firm volley into the <b>open</b> court uses the clearer target under pressure."
    }
  },
  {
    "id": "beat_moonballer",
    "title": "Beat the Moonballer",
    "opp": "<b>Moonballer</b> — loops the ball and starts behind the baseline. This time the ball lands short enough to move in.",
    "d1": {
      "sit": "This high ball lands short enough to step inside the baseline before it reaches shoulder height. The opponent is behind the far baseline; compare taking time away with changing the length.",
      "q": "How do you take the moonball?",
      "opts": [
        {
          "lbl": "Take it early and drive it, then come in",
          "sub": "Rob them of their reset time",
          "br": "A"
        },
        {
          "lbl": "Disguise a drop shot",
          "sub": "Use the space in front of their baseline position",
          "br": "B"
        }
      ],
      "court": {
        "shots": [],
        "sitter": [
          64,
          240
        ],
        "youStart": [
          64,
          240
        ],
        "oppStart": [
          100,
          8
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          64,
          240
        ],
        "oppStart": [
          100,
          8
        ],
        "oppEnd": [
          150,
          40
        ],
        "shots": [
          {
            "from": [
              64,
              240
            ],
            "to": [
              46,
              50
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "TAKE IT EARLY",
            "contactType": "ground"
          },
          {
            "from": [
              46,
              50
            ],
            "to": [
              110,
              200
            ],
            "bend": -14,
            "color": "#e07070",
            "snd": "slice",
            "label": "SHORT LOB",
            "noBounce": true,
            "contactType": "slice"
          }
        ],
        "youEnd": [
          110,
          200
        ]
      },
      "reveal": "Taking it on the rise stole the time they live on — backed up that far, they could only throw up a <b>short, weak lob</b>. It's dropping around your service line and you're already moving in.",
      "d2": {
        "sit": "Their defensive lob sits up short, around your service line. You've closed in — this is an overhead, and they're scrambled deep on one side.",
        "q": "Put the overhead away — how?",
        "opts": [
          {
            "lbl": "Angle it short into the open court",
            "sub": "Make them chase, don't out-muscle them",
            "win": true,
            "id": "beat_moonballer:A:preferred"
          },
          {
            "lbl": "Crush it flat down the line",
            "sub": "Go for the clean winner",
            "win": false,
            "id": "beat_moonballer:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          110,
          200
        ],
        "oppStart": [
          150,
          40
        ],
        "oppEnd": [
          150,
          40
        ],
        "shots": [
          {
            "from": [
              110,
              200
            ],
            "to": [
              42,
              110
            ],
            "bend": 4,
            "color": "#5bba6f",
            "snd": "pop",
            "payoff": true,
            "label": "SHORT ANGLE",
            "intent": "angle",
            "contactType": "smash"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "The short overhead angle reaches the open court in this example. The useful read is the defender’s deep position on one side—not a rule that moonballers cannot cover an angle.",
      "mid": {
        "youStart": [
          110,
          200
        ],
        "oppStart": [
          150,
          40
        ],
        "oppEnd": [
          150,
          40
        ],
        "shots": [
          {
            "from": [
              110,
              200
            ],
            "to": [
              156,
              46
            ],
            "bend": -6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "FLAT & DEEP",
            "intent": "risk",
            "miss": "wide",
            "contactType": "smash"
          }
        ]
      },
      "midTitle": "Just wide.",
      "midTxt": "This flat overhead misses in the example. That does not establish a fifty-fifty success rate. With the defender deep on one side, the short angle offers a different placement problem; choose a target you can control."
    },
    "B": {
      "seq": {
        "youStart": [
          64,
          240
        ],
        "oppStart": [
          100,
          8
        ],
        "oppEnd": [
          88,
          142
        ],
        "shots": [
          {
            "from": [
              64,
              240
            ],
            "to": [
              86,
              138
            ],
            "bend": 5,
            "color": "#c8a84b",
            "snd": "tap",
            "label": "DROP SHOT",
            "contactType": "slice"
          },
          {
            "from": [
              86,
              138
            ],
            "to": [
              112,
              182
            ],
            "bend": 8,
            "color": "#e07070",
            "snd": "weak",
            "label": "DESPERATE GET",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          112,
          182
        ]
      },
      "reveal": "They were camped on the back fence — the drop pulls them twenty feet the wrong way. They just get a racket on it and <b>scoop up a weak, high ball</b> to the middle. Now they're stranded at the net.",
      "d2": {
        "sit": "They've scrambled all the way in and popped up a weak reply. They're stuck at the net, leaning to their forehand — the rest of the court is open.",
        "q": "Finish it — where?",
        "opts": [
          {
            "lbl": "Pass into the open court",
            "sub": "Use the space they left",
            "win": true,
            "id": "beat_moonballer:B:preferred"
          },
          {
            "lbl": "Feather another drop shot",
            "sub": "Ask them to cover another short ball",
            "win": false,
            "id": "beat_moonballer:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          112,
          182
        ],
        "oppStart": [
          88,
          142
        ],
        "oppEnd": [
          68,
          142
        ],
        "shots": [
          {
            "from": [
              112,
              182
            ],
            "to": [
              152,
              120
            ],
            "bend": -6,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "OPEN COURT",
            "intent": "space",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "They've charged the net to dig out the drop — so the whole court behind and beside them is <b>open</b>. A firm drive into the space is the reward for pulling them forward. Don't get cute twice; take the room they gave you.",
      "mid": {
        "youStart": [
          112,
          182
        ],
        "oppStart": [
          88,
          142
        ],
        "oppEnd": [
          70,
          142
        ],
        "shots": [
          {
            "from": [
              112,
              182
            ],
            "to": [
              84,
              146
            ],
            "bend": 3,
            "color": "#c8a84b",
            "snd": "tap",
            "label": "SECOND DROP",
            "intent": "risk",
            "contactType": "slice"
          }
        ]
      },
      "midTitle": "Right to them.",
      "midTxt": "A second drop when they're already at the net is a <b>low-percentage</b> gift — you're dropping it into their strike zone. The pass into the open court was the finish; the drop only works when they're pinned deep."
    }
  },
  {
    "id": "big_server",
    "title": "Return the Big Server",
    "opp": "<b>Serve-and-volley off a big first serve</b> — flat down the T, charging the net. You won't out-hit the bomb; the win is what you do with the return.",
    "d1": {
      "sit": "A very fast first serve comes down the T and the server charges behind it. You reach on the stretch with no time for a full swing; they'll be on top of the net in a heartbeat.",
      "q": "How do you handle the serve-and-volley?",
      "opts": [
        {
          "lbl": "Chip it low at their feet",
          "sub": "Make them volley up from their shoelaces",
          "br": "A"
        },
        {
          "lbl": "Lob the return over their shoulder",
          "sub": "Turn the charging server around",
          "br": "B"
        }
      ],
      "court": {
        "shots": [],
        "sitter": [
          96,
          246
        ],
        "youStart": [
          96,
          246
        ],
        "oppStart": [
          100,
          115
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          96,
          246
        ],
        "oppStart": [
          100,
          115
        ],
        "oppEnd": [
          100,
          142
        ],
        "shots": [
          {
            "from": [
              96,
              246
            ],
            "to": [
              100,
              132
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "slice",
            "label": "LOW CHIP",
            "contactType": "slice"
          },
          {
            "from": [
              100,
              132
            ],
            "to": [
              116,
              188
            ],
            "bend": 8,
            "color": "#e07070",
            "snd": "volley",
            "label": "FLOATED VOLLEY",
            "contactType": "volley"
          }
        ],
        "youEnd": [
          116,
          188
        ]
      },
      "reveal": "The low chip did its job — a first volley off the shoelaces has no pace and floats up. They're at the net now, but they gave you a look. This is your passing shot.",
      "d2": {
        "sit": "Their floated volley sits up mid-court. The net-rusher is planted at the net, covering the open court, leaning to their forehand side.",
        "q": "Pass the net-rusher — how?",
        "opts": [
          {
            "lbl": "Drill it straight at their body",
            "sub": "Handcuff the volley",
            "win": true,
            "id": "big_server:A:preferred"
          },
          {
            "lbl": "Thread the pass down the line",
            "sub": "Beat them clean",
            "win": false,
            "id": "big_server:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          116,
          188
        ],
        "oppStart": [
          100,
          142
        ],
        "oppEnd": [
          92,
          140
        ],
        "shots": [
          {
            "from": [
              116,
              188
            ],
            "to": [
              92,
              138
            ],
            "bend": 0,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "BODY JAM",
            "intent": "jam",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "A planted volleyer can cover either corner, but a firm ball at the <b>hip</b> crowds the hands and makes a clean volley difficult. With so little passing lane available, the body target supplies more margin than painting the line.",
      "mid": {
        "youStart": [
          116,
          188
        ],
        "oppStart": [
          100,
          142
        ],
        "oppEnd": [
          92,
          140
        ],
        "shots": [
          {
            "from": [
              116,
              188
            ],
            "to": [
              52,
              120
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "LINE PASS",
            "intent": "risk",
            "miss": "wide",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Just wide.",
      "midTxt": "Threading the line past a set volleyer leaves you almost <b>no margin</b> — a hair wide and the point's theirs. The body jam was the higher-percentage kill. Save the perfect pass for when they've left you real room."
    },
    "B": {
      "seq": {
        "youStart": [
          96,
          246
        ],
        "oppStart": [
          100,
          115
        ],
        "oppEnd": [
          100,
          60
        ],
        "shots": [
          {
            "from": [
              96,
              246
            ],
            "to": [
              100,
              64
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "slice",
            "label": "RETURN LOB",
            "contactType": "slice"
          },
          {
            "from": [
              100,
              64
            ],
            "to": [
              120,
              190
            ],
            "bend": 12,
            "color": "#e07070",
            "snd": "weak",
            "label": "SCRAMBLE BACK",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          120,
          190
        ]
      },
      "reveal": "The lob flips the point — a server sprinting to the net has to stop, reverse and chase it down deep. All they dig out is a weak, short reply, and now <b>you're</b> the one moving in.",
      "d2": {
        "sit": "Their scrambled reply floats up short. They're stranded deep and backpedaling, having had to reverse off their own charge. The open court is in front of you.",
        "q": "Take control — where?",
        "opts": [
          {
            "lbl": "Drive deep into the open court and follow it in",
            "sub": "Take the space, take the net",
            "win": true,
            "id": "big_server:B:preferred"
          },
          {
            "lbl": "Try a second lob",
            "sub": "Repeat the trick",
            "win": false,
            "id": "big_server:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          120,
          190
        ],
        "oppStart": [
          100,
          60
        ],
        "oppEnd": [
          70,
          64
        ],
        "shots": [
          {
            "from": [
              120,
              190
            ],
            "to": [
              150,
              52
            ],
            "bend": -6,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "OPEN COURT",
            "intent": "space",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          112,
          178
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "You already turned them around once — now they're deep and off balance. A firm drive into the <b>open</b> court, following it forward, finishes what the lob started. Take the space you created; don't try to be clever twice.",
      "mid": {
        "youStart": [
          120,
          190
        ],
        "oppStart": [
          100,
          60
        ],
        "oppEnd": [
          112,
          58
        ],
        "shots": [
          {
            "from": [
              120,
              190
            ],
            "to": [
              100,
              60
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "weak",
            "label": "SECOND LOB",
            "intent": "risk",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "They were ready.",
      "midTxt": "The lob worked once because they were charging — deep and set, they read the second one all the way. Going back to it is a <b>low-percentage</b> repeat. The drive into open court was there; the trick only works by surprise."
    }
  },
  {
    "id": "change_direction",
    "title": "Change of Direction",
    "opp": "<b>Grooved crosscourt</b> — they've settled into the diagonal and lean that way to recover, daring you to blink first.",
    "d1": {
      "sit": "You've traded a dozen backhands crosscourt and they've grooved into it — recovering a half-step that way each time. This one lands a touch short, inside your baseline. You can step in.",
      "q": "How do you use the short ball?",
      "opts": [
        {
          "lbl": "Change direction — drive down the line",
          "sub": "Wrong-foot the crosscourt lean",
          "br": "A"
        },
        {
          "lbl": "Stay crosscourt, but sharper and shorter",
          "sub": "Drag them wider first",
          "br": "B"
        }
      ],
      "court": {
        "youStart": [
          64,
          224
        ],
        "oppStart": [
          150,
          40
        ],
        "shots": [],
        "sitter": [
          64,
          224
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          64,
          224
        ],
        "oppStart": [
          150,
          40
        ],
        "oppEnd": [
          60,
          50
        ],
        "shots": [
          {
            "from": [
              64,
              224
            ],
            "to": [
              52,
              46
            ],
            "bend": 4,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "DOWN THE LINE",
            "contactType": "ground"
          },
          {
            "from": [
              52,
              46
            ],
            "to": [
              104,
              196
            ],
            "bend": -12,
            "color": "#e07070",
            "snd": "slice",
            "label": "LATE LUNGE",
            "contactType": "slice"
          }
        ],
        "youEnd": [
          104,
          196
        ]
      },
      "reveal": "They'd loaded to cover another crosscourt — the change of direction sends them the wrong way. Lunging late, all they get back is a weak block floating to the middle.",
      "d2": {
        "sit": "Their block sits up short and central. They lunged to the line side and are now sprinting back across toward the middle. Finish it — where?",
        "q": "Option off the option — where?",
        "opts": [
          {
            "lbl": "Back behind them — into the line corner again",
            "sub": "Double-cross the recovery",
            "win": true,
            "id": "change_direction:A:preferred"
          },
          {
            "lbl": "Into the open crosscourt they're sprinting to",
            "sub": "Hit the big space",
            "win": false,
            "id": "change_direction:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          104,
          196
        ],
        "oppStart": [
          60,
          50
        ],
        "oppEnd": [
          120,
          42
        ],
        "shots": [
          {
            "from": [
              104,
              196
            ],
            "to": [
              48,
              50
            ],
            "bend": 6,
            "color": "#5bba6f",
            "snd": "pop",
            "payoff": true,
            "label": "BEHIND AGAIN",
            "intent": "behind",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "Playing behind the recovery makes the opponent stop and reverse. That change of direction creates the advantage in this example; it does not guarantee they cannot retrieve it.",
      "mid": {
        "youStart": [
          104,
          196
        ],
        "oppStart": [
          60,
          50
        ],
        "oppEnd": [
          120,
          42
        ],
        "shots": [
          {
            "from": [
              104,
              196
            ],
            "to": [
              150,
              46
            ],
            "bend": -6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "CROSSCOURT",
            "intent": "into_run",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "They ran it down.",
      "midTxt": "Clean strike — but they were already sprinting that way, so you hit it straight into their <b>run</b>. When you've wrong-footed someone, the kill is behind them; the open court just feeds their recovery."
    },
    "B": {
      "seq": {
        "youStart": [
          64,
          224
        ],
        "oppStart": [
          150,
          40
        ],
        "oppEnd": [
          174,
          110
        ],
        "shots": [
          {
            "from": [
              64,
              224
            ],
            "to": [
              174,
              110
            ],
            "bend": -8,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "SHARP CROSSCOURT",
            "bounce": [
              160,
              120
            ],
            "contactType": "ground"
          },
          {
            "from": [
              174,
              110
            ],
            "to": [
              92,
              190
            ],
            "bend": 10,
            "color": "#e07070",
            "snd": "slice",
            "label": "STRETCH REPLY",
            "contactType": "slice"
          }
        ],
        "youEnd": [
          92,
          190
        ]
      },
      "reveal": "Instead of forcing it, you tighten the angle and drag them off the court crosscourt. Now they're stretched wide and their reply floats up short — and the whole other side is open.",
      "d2": {
        "sit": "Their stretched reply sits up short. They're stranded out wide and haven't started back yet. Put it away — where?",
        "q": "Option off the option — where?",
        "opts": [
          {
            "lbl": "Short angle into the open court",
            "sub": "Sharpen it away from them",
            "win": true,
            "id": "change_direction:B:preferred"
          },
          {
            "lbl": "Flatten it toward the far sideline",
            "sub": "Use the deeper corner rather than the short angle",
            "win": false,
            "id": "change_direction:B:alternative"
          }
        ]
      },
      "win": {
      "youStart": [
        92,
        190
        ],
        "oppStart": [
          174,
          110
        ],
        "oppEnd": [
          174,
          110
        ],
        "shots": [
          {
            "from": [
              92,
              190
            ],
            "to": [
              46,
              112
            ],
            "bend": 6,
            "color": "#5bba6f",
            "snd": "pop",
            "payoff": true,
            "label": "OPEN ANGLE",
            "intent": "angle",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "Patience opened the court wider than force would have. With them stranded out wide, a short <b>angle</b> into the open side finishes it — they're moving the wrong way and it's nowhere near them. You earned the easy ball by making them run, not by gambling.",
      "mid": {
        "youStart": [
          92,
          190
        ],
        "oppStart": [
          174,
          110
        ],
        "oppEnd": [
          174,
          110
        ],
        "shots": [
          {
            "from": [
              92,
              190
            ],
            "to": [
              54,
              44
            ],
            "bend": -4,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "FLAT & DEEP",
            "intent": "risk",
            "miss": "long",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Long.",
      "midTxt": "The flatter drive lands long in this example. A deep drive is not inherently wrong; compare its clearance and target margin with the short angle available from this contact."
    }
  },
  {
    "id": "passing_shot",
    "title": "Passing Shot",
    "opp": "<b>Attacked and closing</b> — they hit an approach and they're charging the net. You're on the back foot with one ball to get right.",
    "d1": {
      "sit": "They've driven an approach deep and they're closing the net fast. You're behind your baseline with a passing-shot chance — but they're covering the court and coming forward.",
      "q": "How do you pass them?",
      "opts": [
        {
          "lbl": "Dipping pass crosscourt",
          "sub": "Low over the low part of the net, into the open",
          "br": "A"
        },
        {
          "lbl": "Topspin lob over their shoulder",
          "sub": "Send them back the way they came",
          "br": "B"
        }
      ],
      "court": {
        "youStart": [
          150,
          292
        ],
        "oppStart": [
          100,
          120
        ],
        "shots": [],
        "sitter": [
          150,
          292
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          150,
          292
        ],
        "oppStart": [
          100,
          120
        ],
        "oppEnd": [
          62,
          138
        ],
        "shots": [
          {
            "from": [
              150,
              292
            ],
            "to": [
              44,
              130
            ],
            "bend": 10,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "DIPPING PASS",
            "contactType": "ground"
          },
          {
            "from": [
              44,
              130
            ],
            "to": [
              98,
              182
            ],
            "bend": 0,
            "color": "#e07070",
            "snd": "volley",
            "label": "LUNGE VOLLEY",
            "contactType": "volley"
          }
        ],
        "youEnd": [
          98,
          182
        ]
      },
      "reveal": "The dipping pass reaches a low volley. In this example the reply floats short, leaving another passing chance while the volleyer is off to one side.",
      "d2": {
        "sit": "Their weak volley sits up mid-court. They're stranded at the net on the side they lunged to, and the rest of the court is open. Finish the pass — where?",
        "q": "Option off the option — where?",
        "opts": [
          {
            "lbl": "Roll it into the open court",
            "sub": "Away from their momentum",
            "win": true,
            "id": "passing_shot:A:preferred"
          },
          {
            "lbl": "Go right back down the line at them",
            "sub": "Surprise them",
            "win": false,
            "id": "passing_shot:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          98,
          182
        ],
        "oppStart": [
          62,
          138
        ],
        "oppEnd": [
          62,
          138
        ],
        "shots": [
          {
            "from": [
              98,
              182
            ],
            "to": [
              156,
              126
            ],
            "bend": -6,
            "color": "#5bba6f",
            "snd": "pop",
            "payoff": true,
            "label": "OPEN COURT",
            "intent": "space",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "They've lunged to one side to dig out the first pass — so the <b>open</b> court is the whole other half. A firm roll into the space is the easy finish; the first dipping pass did the hard work by pulling them out of position.",
      "mid": {
        "youStart": [
          98,
          182
        ],
        "oppStart": [
          62,
          138
        ],
        "oppEnd": [
          62,
          138
        ],
        "shots": [
          {
            "from": [
              98,
              182
            ],
            "to": [
              64,
              140
            ],
            "bend": 2,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "AT THEM",
            "intent": "risk",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Right at them.",
      "midTxt": "Going back at a net player who's already there hands them the easy volley — a <b>low-percentage</b> gamble when the open court was wide open. Pass into the space they left, not the space they're standing in."
    },
    "B": {
      "seq": {
        "youStart": [
          150,
          292
        ],
        "oppStart": [
          100,
          120
        ],
        "oppEnd": [
          100,
          12
        ],
        "shots": [
          {
            "from": [
              150,
              292
            ],
            "to": [
              104,
              12
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "TOPSPIN LOB",
            "contactType": "ground"
          },
          {
            "from": [
              104,
              12
            ],
            "to": [
              128,
              200
            ],
            "bend": 14,
            "color": "#e07070",
            "snd": "weak",
            "label": "SCRAMBLE BACK",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          128,
          200
        ]
      },
      "reveal": "The topspin lob sails over their shoulder and pins them deep — a net-rusher hates nothing more than having to reverse and chase. They run it down but can only scrape a weak reply back short.",
      "d2": {
        "sit": "Their scrambled reply floats up short. They've been chased all the way to their own baseline and they're backpedaling, out of position. Where do you put it?",
        "q": "Option off the option — where?",
        "opts": [
          {
            "lbl": "Drive it deep into the open corner and follow it in",
            "sub": "Controlled — finish at the net",
            "win": true,
            "id": "passing_shot:B:preferred"
          },
          {
            "lbl": "Drive flatter into the crosscourt corner",
            "sub": "End it in one",
            "win": false,
            "id": "passing_shot:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          128,
          200
        ],
        "oppStart": [
          100,
          12
        ],
        "oppEnd": [
          92,
          86
        ],
        "shots": [
          {
            "from": [
              128,
              200
            ],
            "to": [
              154,
              50
            ],
            "bend": -6,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "DEEP & IN",
            "intent": "deep",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          112,
          176
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "The deep drive uses the open corner after the opponent has chased the lob back. Follow the controlled ball forward and read the next reply; deep placement is pressure, not a guaranteed finish.",
      "mid": {
        "youStart": [
          128,
          200
        ],
        "oppStart": [
          100,
          12
        ],
        "oppEnd": [
          100,
          12
        ],
        "shots": [
          {
            "from": [
              128,
              200
            ],
            "to": [
              44,
              118
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "FLAT WINNER",
            "intent": "risk",
            "miss": "net",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Netted it.",
      "midTxt": "This flat drive misses. The controlled deeper target offers margin and a route forward, but neither choice is an automatic winner. Judge the next contact as well as the apparent opening."
    }
  },
  {
    "id": "defending",
    "title": "Defending",
    "opp": "<b>They've taken control</b> — cracked one into the open court and you're on a dead run. This point is about surviving, not winning.",
    "d1": {
      "sit": "They've ripped a ball into the open court and you're on a full sprint, reaching it outside the singles sideline on the stretch. You're in real trouble and nowhere near recovered.",
      "q": "You're scrambling — what do you hit?",
      "opts": [
        {
          "lbl": "High, deep reset down the middle",
          "sub": "Buy time, take their angle away",
          "br": "A"
        },
        {
          "lbl": "Low, skidding slice — deep and heavy",
          "sub": "Deny them pace to attack",
          "br": "B"
        }
      ],
      "court": {
        "shots": [],
        "sitter": [
          24,
          232
        ],
        "youStart": [
          24,
          232
        ],
        "oppStart": [
          130,
          40
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          24,
          232
        ],
        "oppStart": [
          130,
          40
        ],
        "oppEnd": [
          112,
          44
        ],
        "shots": [
          {
            "from": [
              24,
              232
            ],
            "to": [
              100,
              48
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "HIGH RESET",
            "contactType": "ground"
          },
          {
            "from": [
              100,
              48
            ],
            "to": [
              108,
              192
            ],
            "bend": -10,
            "color": "#e07070",
            "snd": "drive",
            "label": "OVER-PRESS",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          108,
          192
        ]
      },
      "reveal": "The high, deep reset kills their angle and buys the split-second you need to sprint back to the middle. They went for too much on the high ball and left it short — you're back in the point with a look.",
      "d2": {
        "sit": "You've recovered to center. Their over-cooked ball sits up mid-court and they're still recovering from the big swing. Now — where?",
        "q": "Option off the option — where?",
        "opts": [
          {
            "lbl": "Drive into the open court",
            "sub": "Take the space you earned",
            "win": true,
            "id": "defending:A:preferred"
          },
          {
            "lbl": "Drive through the narrower down-the-line target",
            "sub": "Change the lane instead of using the open half",
            "win": false,
            "id": "defending:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          108,
          192
        ],
        "oppStart": [
          112,
          44
        ],
        "oppEnd": [
          70,
          50
        ],
        "shots": [
          {
            "from": [
              108,
              192
            ],
            "to": [
              156,
              50
            ],
            "bend": -6,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "OPEN COURT",
            "intent": "space",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Turned it around.",
      "winTxt": "Defense set up offense. The reset dragged you back into the point; they over-pressed and handed you a mid-court ball, so a drive into the <b>open</b> court finishes it. You didn't need a miracle off the stretch — you needed to survive long enough to get an easy one.",
      "mid": {
        "youStart": [
          108,
          192
        ],
        "oppStart": [
          112,
          44
        ],
        "oppEnd": [
          112,
          44
        ],
        "shots": [
          {
            "from": [
              108,
              192
            ],
            "to": [
              52,
              48
            ],
            "bend": 4,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "LINE WINNER",
            "intent": "risk",
            "miss": "wide",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Just missed.",
      "midTxt": "The narrower line attempt misses here. The larger open-half target asks less of your placement from this recovering position. A single miss does not measure either shot’s success rate."
    },
    "B": {
      "seq": {
        "youStart": [
          24,
          232
        ],
        "oppStart": [
          130,
          40
        ],
        "oppEnd": [
          100,
          40
        ],
        "shots": [
          {
            "from": [
              24,
              232
            ],
            "to": [
              96,
              52
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "slice",
            "label": "DEEP SLICE",
            "contactType": "slice"
          },
          {
            "from": [
              96,
              52
            ],
            "to": [
              172,
              206
            ],
            "bend": 12,
            "color": "#e07070",
            "snd": "drive",
            "label": "WRONG-FOOTED",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          172,
          206
        ]
      },
      "reveal": "The slice stays low and deep, but a good player steps around it and drives it back the other way — and you're still recovering from the first sprint. You chase it down on the forehand side, but you're stretched and off-balance all over again.",
      "d2": {
        "sit": "You've run down the second ball on the forehand wing, but you're stretched wide and not set. They're waiting in the middle, ready to pounce. What now?",
        "q": "Option off the option — where?",
        "opts": [
          {
            "lbl": "Reset again — high, deep, buy another beat",
            "sub": "You're not in position to attack yet",
            "win": true,
            "id": "defending:B:preferred"
          },
          {
            "lbl": "Drive down the line from the stretched contact",
            "sub": "End the scramble now",
            "win": false,
            "id": "defending:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          172,
          206
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          100,
          40
        ],
        "shots": [
          {
            "from": [
              172,
              206
            ],
            "to": [
              100,
              52
            ],
            "bend": 0,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "RESET AGAIN",
            "intent": "reset",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Still in it.",
      "winTxt": "Two good defensive balls beat one miracle. You're not in position, so you <b>reset</b> again — high, deep, neutral, right down the middle — and make them build the point from scratch. Stay in the rally and the winner comes later, from balance instead of from a full stretch.",
      "mid": {
        "youStart": [
          172,
          206
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          100,
          40
        ],
        "shots": [
          {
            "from": [
              172,
              206
            ],
            "to": [
              46,
              46
            ],
            "bend": 4,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "STRETCH WINNER",
            "intent": "risk",
            "miss": "wide",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Off the frame.",
      "midTxt": "The down-the-line counter misses in this example. With balance still limited, height and depth offer another recovery interval; a successful counter would not make every stretched ball an attacking opportunity."
    }
  },
  {
    "id": "break_point_down",
    "title": "Break Point Down",
    "opp": "<b>Break point down.</b> The returner is dialled in and set for your biggest serve. Use placement to shape the reply, then be ready to play the +1.",
    "d1": {
      "sit": "15–40, first serve. This returner has blocked your faster serves deep. Test placement, then judge the return you actually receive.",
      "q": "How do you serve it?",
      "opts": [
        {
          "lbl": "Jam the body",
          "sub": "Handcuff them — no room to swing",
          "br": "A"
        },
        {
          "lbl": "Serve out wide",
          "sub": "Drag them off the court",
          "br": "B"
        }
      ],
      "court": {
        "shots": [],
        "sitter": [
          118,
          292
        ],
        "youStart": [
          118,
          292
        ],
        "oppStart": [
          58,
          12
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          118,
          292
        ],
        "oppStart": [
          58,
          12
        ],
        "oppEnd": [
          90,
          40
        ],
        "shots": [
          {
            "from": [
              118,
              292
            ],
            "to": [
              58,
              12
            ],
            "bend": -6,
            "color": "#c8a84b",
            "snd": "serve",
            "label": "BODY SERVE",
            "bounce": [
              70,
              104
            ],
            "contactType": "serve",
            "serveNumber": 1
          },
          {
            "from": [
              58,
              12
            ],
            "to": [
              104,
              202
            ],
            "bend": 8,
            "color": "#e07070",
            "snd": "weak",
            "label": "JAMMED RETURN",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          104,
          202
        ]
      },
      "reveal": "The body serve handcuffs them — no room to extend, so the return floats back short and central. You're inside the baseline with the whole court in front of you.",
      "d2": {
        "sit": "Their jammed return sits up short and central. They're stuck near the middle, recovering. Where's your +1?",
        "q": "Put the +1 away — where?",
        "opts": [
          {
            "lbl": "Drive into the open corner",
            "sub": "Take the space — two-shot point",
            "win": true,
            "id": "break_point_down:A:preferred"
          },
          {
            "lbl": "Drive flatter through the middle",
            "sub": "End it with pace",
            "win": false,
            "id": "break_point_down:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          104,
          202
        ],
        "oppStart": [
          90,
          40
        ],
        "oppEnd": [
          100,
          120
        ],
        "shots": [
          {
            "from": [
              104,
              202
            ],
            "to": [
              156,
              50
            ],
            "bend": -6,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "OPEN COURT",
            "intent": "space",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point saved.",
      "winTxt": "The serve did the hard work — the jam took away their swing, so the +1 is a free hit into the <b>open</b> court. On break point you don't need an ace; you need a serve that hands you an easy next ball. Placement beats power against a returner set for pace.",
      "mid": {
        "youStart": [
          104,
          202
        ],
        "oppStart": [
          90,
          40
        ],
        "oppEnd": [
          100,
          120
        ],
        "shots": [
          {
            "from": [
              104,
              202
            ],
            "to": [
              100,
              46
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "FLAT WINNER",
            "intent": "risk",
            "miss": "long",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Just long.",
      "midTxt": "The central flat drive misses here. The serve created a short return, not a won point. Use the available corner with margin and remain ready for a reply."
    },
    "B": {
      "seq": {
        "youStart": [
          118,
          292
        ],
        "oppStart": [
          58,
          12
        ],
        "oppEnd": [
          42,
          50
        ],
        "shots": [
          {
            "from": [
              118,
              292
            ],
            "to": [
              26,
              38
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "serve",
            "label": "WIDE SERVE",
            "bounce": [
              40,
              108
            ],
            "contactType": "serve",
            "serveNumber": 1
          },
          {
            "from": [
              26,
              38
            ],
            "to": [
              112,
              198
            ],
            "bend": -10,
            "color": "#e07070",
            "snd": "slice",
            "label": "STRETCH RETURN",
            "contactType": "slice"
          }
        ],
        "youEnd": [
          112,
          198
        ]
      },
      "reveal": "The wide serve drags them off the court to reach it — their stretched return floats back short, and now there's a huge hole where they were standing.",
      "d2": {
        "sit": "Their stretched return sits up short. They're stranded out wide and sprinting back toward the middle. Where's your +1?",
        "q": "Finish it — where?",
        "opts": [
          {
            "lbl": "Behind them — into the corner they left",
            "sub": "Wrong-foot the recovery",
            "win": true,
            "id": "break_point_down:B:preferred"
          },
          {
            "lbl": "Into the open court they're sprinting to",
            "sub": "Hit the big space",
            "win": false,
            "id": "break_point_down:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          112,
          198
        ],
        "oppStart": [
          42,
          50
        ],
        "oppEnd": [
          112,
          44
        ],
        "shots": [
          {
            "from": [
              112,
              198
            ],
            "to": [
              42,
              54
            ],
            "bend": 6,
            "color": "#5bba6f",
            "snd": "pop",
            "payoff": true,
            "label": "BEHIND THEM",
            "intent": "behind",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point saved.",
      "winTxt": "They committed everything to sprinting back to the middle — so the ball <b>behind</b> them freezes them and makes them reverse. The wide serve opened the court; the wrong-foot closes it. The serve and the +1 are one pattern, not two shots.",
      "mid": {
        "youStart": [
          112,
          198
        ],
        "oppStart": [
          42,
          50
        ],
        "oppEnd": [
          150,
          50
        ],
        "shots": [
          {
            "from": [
              112,
              198
            ],
            "to": [
              152,
              58
            ],
            "bend": -6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "OPEN COURT",
            "intent": "into_run",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "They ran it down.",
      "midTxt": "Clean strike — but they were already sprinting that way, so you hit it straight into their <b>run</b>. When the serve has pulled them wide, the kill is behind them, into the space they abandoned — not the space they're covering."
    }
  },
  {
    "id": "serving_for_set",
    "title": "Serving for the Set",
    "opp": "<b>Serving for the set.</b> Your heart rate's up and they know it. The temptation is to change what's working — the discipline is to trust it.",
    "d1": {
      "sit": "First serve, serving for the set. Your usual ad-court target has drawn short returns today. Keep that plan available, but let the next return decide your +1.",
      "q": "How do you play it?",
      "opts": [
        {
          "lbl": "Trust the pattern — serve your spot, step in",
          "sub": "Do what got you here",
          "br": "A"
        },
        {
          "lbl": "Use a flatter first serve with more pace",
          "sub": "Test pace instead of the familiar location",
          "br": "B"
        }
      ],
      "court": {
        "shots": [],
        "youStart": [
          72,
          292
        ],
        "oppStart": [
          140,
          12
        ],
        "sitter": [
          72,
          292
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          72,
          292
        ],
        "oppStart": [
          140,
          12
        ],
        "oppEnd": [
          140,
          30
        ],
        "shots": [
          {
            "from": [
              72,
              292
            ],
            "to": [
              154,
              18
            ],
            "bend": 4,
            "color": "#c8a84b",
            "snd": "serve",
            "label": "SERVE + STEP IN",
            "bounce": [
              140,
              100
            ],
            "contactType": "serve",
            "serveNumber": 1
          },
          {
            "from": [
              154,
              18
            ],
            "to": [
              104,
              200
            ],
            "bend": 8,
            "color": "#e07070",
            "snd": "weak",
            "label": "WEAK RETURN",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          104,
          200
        ]
      },
      "reveal": "Exactly what you've done all day — the serve to your spot, a step inside the baseline, a weak return floating up. You've hit this +1 a hundred times.",
      "d2": {
        "sit": "Their weak return sits up short. They're recovering to the middle. Play the +1 you've drilled — where?",
        "q": "Where's the +1?",
        "opts": [
          {
            "lbl": "Drive into the open court",
            "sub": "The shot you trust",
            "win": true,
            "id": "serving_for_set:A:preferred"
          },
          {
            "lbl": "Use a tighter target near the sideline",
            "sub": "Trade target width for earlier placement",
            "win": false,
            "id": "serving_for_set:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          104,
          200
        ],
        "oppStart": [
          140,
          30
        ],
        "oppEnd": [
          100,
          120
        ],
        "shots": [
          {
            "from": [
              104,
              200
            ],
          "to": [
            46,
            52
            ],
            "bend": -6,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "OPEN COURT",
            "intent": "space",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Pressure point won.",
      "winTxt": "The big point is exactly when you trust the pattern, not abandon it. A drive into the <b>open</b> court is the shot you've made all day — high margin, large target. Nerves make you want to do more; the discipline is to repeat the pattern that earned the lead.",
      "mid": {
        "youStart": [
          104,
          200
        ],
        "oppStart": [
          140,
          30
        ],
        "oppEnd": [
          100,
          120
        ],
        "shots": [
          {
            "from": [
              104,
              200
            ],
            "to": [
              34,
              80
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "SIDELINE",
            "intent": "risk",
            "miss": "wide",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Just wide.",
      "midTxt": "On the biggest point you reached for a <b>low-percentage</b> line you hadn't hit all match. The open court was the shot you trust; the sideline was the nerves talking. Do what got you here — the moment is not the time to invent."
    },
    "B": {
      "seq": {
        "youStart": [
          72,
          292
        ],
        "oppStart": [
          140,
          12
        ],
        "oppEnd": [
          130,
          28
        ],
        "shots": [
          {
            "from": [
              72,
              292
            ],
            "to": [
              134,
              18
            ],
            "bend": 2,
            "color": "#c8a84b",
            "snd": "serve",
            "label": "FLATTENED BOMB",
            "bounce": [
              128,
              100
            ],
            "contactType": "serve",
            "serveNumber": 1
          },
          {
            "from": [
              134,
              18
            ],
            "to": [
              108,
              292
            ],
            "bend": -6,
            "color": "#e07070",
            "snd": "drive",
            "label": "DEEP BLOCK",
            "contactType": "slice"
          }
        ],
        "youEnd": [
          108,
          292
        ]
      },
      "reveal": "The flat bomb is a fine serve — but flat means a good returner blocks your own pace back, deep and heavy. You're pushed behind the baseline, not stepping in. You went for more and got less control.",
      "d2": {
        "sit": "Their block comes back deep and heavy. You're pushed back behind the baseline, on the stretch — not the easy +1 you'd have had. What now?",
        "q": "What's the play?",
        "opts": [
          {
            "lbl": "Reset deep and neutral, rebuild",
            "sub": "You're not in control — get back to even",
            "win": true,
            "id": "serving_for_set:B:preferred"
          },
          {
            "lbl": "Drive down the line while moving back",
            "sub": "End the point you started",
            "win": false,
            "id": "serving_for_set:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          108,
          292
        ],
        "oppStart": [
          130,
          28
        ],
        "oppEnd": [
          95,
          120
        ],
        "shots": [
          {
            "from": [
              108,
              292
            ],
            "to": [
              100,
              52
            ],
            "bend": 0,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "RESET DEEP",
            "intent": "reset",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Back to even.",
      "winTxt": "Going bigger cost you the easy +1 — so don't compound it. A deep, <b>neutral</b> reset down the middle gets you back to even and lets you win the point from balance. The lesson of the set point: the serve you trust hands you control; the bomb gambles it.",
      "mid": {
        "youStart": [
          108,
          292
        ],
        "oppStart": [
          130,
          28
        ],
        "oppEnd": [
          95,
          120
        ],
        "shots": [
          {
            "from": [
              108,
              292
            ],
            "to": [
              52,
              48
            ],
            "bend": 4,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "FORCED WINNER",
            "intent": "risk",
            "miss": "long",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Forced it long.",
      "midTxt": "The attempted counter misses from the deeper, stretched position. This return has changed the job: use depth to rebuild rather than treating the first-serve plan as permission to attack every next ball."
    }
  },
  {
    "id": "second_serve_big",
    "title": "Second Serve, Big Point",
    "opp": "<b>Second serve on a big point.</b> A common pressure leak is abandoning the spin and target you trust. A tentative dink invites attack; a flat gamble removes needed margin.",
    "d1": {
      "sit": "Second serve, break point on the line. This right-handed returner has struggled when kick pushes the backhand contact above the strike zone. A cautious dink invites attack; a flat gamble risks the double fault.",
      "q": "How do you hit it?",
      "opts": [
        {
          "lbl": "Heavy kick up to the backhand",
          "sub": "High and safe — awkward to attack",
          "br": "A"
        },
        {
          "lbl": "Flatten it and charge in",
          "sub": "Take the initiative, surprise them",
          "br": "B"
        }
      ],
      "court": {
        "youStart": [
          72,
          292
        ],
        "oppStart": [
          140,
          12
        ],
        "shots": [],
        "sitter": [
          72,
          292
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          72,
          292
        ],
        "oppStart": [
          140,
          12
        ],
        "oppEnd": [
          140,
          12
        ],
        "shots": [
          {
            "from": [
              72,
              292
            ],
            "bounce": [
              140,
              100
            ],
            "to": [
              154,
              12
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "serve",
            "contactType": "serve",
            "serveNumber": 2,
            "label": "KICK SECOND SERVE"
          },
          {
            "from": [
              154,
              12
            ],
            "to": [
              100,
              196
            ],
            "bend": 6,
            "color": "#e07070",
            "snd": "weak",
            "label": "HIGH BLOCK",
            "contactType": "slice"
          }
        ],
        "youEnd": [
          100,
          196
        ]
      },
      "reveal": "In this matchup the kick jumps above their comfortable backhand strike zone, so the return arrives high and short. You have turned a trusted second serve into an attacking ball without removing its margin.",
      "d2": {
        "sit": "Their high block sits up short and central. They're pinned back, recovering. Attack it — where?",
        "q": "Where's the +1?",
        "opts": [
          {
            "lbl": "Drive it into the open corner",
            "sub": "Take the space you built",
            "win": true,
            "id": "second_serve_big:A:preferred"
          },
          {
            "lbl": "Drive through the narrower down-the-line target",
            "sub": "Use the narrower line target",
            "win": false,
            "id": "second_serve_big:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          100,
          196
        ],
        "oppStart": [
          140,
          12
        ],
        "oppEnd": [
          140,
          12
        ],
        "shots": [
          {
            "from": [
              100,
              196
            ],
            "to": [
              46,
              52
            ],
            "bend": 6,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "OPEN COURT",
            "intent": "space",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Break point saved.",
      "winTxt": "Against this returner, the trusted kick to the backhand preserves net clearance and disrupts contact. The short reply leaves a controlled drive into the <b>open</b> court. The target is matchup evidence, not a universal rule.",
      "mid": {
        "youStart": [
          100,
          196
        ],
        "oppStart": [
          140,
          12
        ],
        "oppEnd": [
          140,
          12
        ],
        "shots": [
          {
            "from": [
              100,
              196
            ],
            "to": [
              34,
              48
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "LINE WINNER",
            "intent": "risk",
            "miss": "wide",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Just wide.",
      "midTxt": "You built a free ball and reached for the paint — a <b>low-percentage</b> line winner when the open court was begging. The kick did the work; don't undo it. The statement is winning the point, not finding the line."
    },
    "B": {
      "seq": {
        "youStart": [
          72,
          292
        ],
        "youEnd": [
          104,
          224
        ],
        "oppStart": [
          140,
          12
        ],
        "oppEnd": [
          140,
          18
        ],
        "shots": [
          {
            "from": [
              72,
              292
            ],
            "bounce": [
              132,
              100
            ],
            "to": [
              140,
              18
            ],
            "bend": 4,
            "color": "#c8a84b",
            "snd": "serve",
            "contactType": "serve",
            "serveNumber": 2,
            "label": "FLAT SECOND SERVE"
          },
          {
            "from": [
              140,
              18
            ],
            "to": [
              104,
              224
            ],
            "bend": 10,
            "color": "#e07070",
            "snd": "drive",
            "noBounce": true,
            "label": "DRIVE AT YOUR FEET",
            "contactType": "ground"
          }
        ]
      },
      "reveal": "This flat second serve lands in their comfortable strike zone. They step in and drive the return low as you charge. You reach it around the service line, before you can establish a strong net position.",
      "d2": {
        "sit": "You're around the service line with their return dipping at your feet. You must handle this low contact before closing farther. What's the play?",
        "q": "How do you handle it?",
        "opts": [
          {
            "lbl": "Block it deep and get back to neutral",
            "sub": "Survive the trap, take away their angle",
            "win": true,
            "id": "second_serve_big:B:preferred"
          },
          {
            "lbl": "Swing a low-volley winner",
            "sub": "Use a faster counter instead of depth",
            "win": false,
            "id": "second_serve_big:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          104,
          224
        ],
        "oppStart": [
          140,
          18
        ],
        "oppEnd": [
          120,
          18
        ],
        "shots": [
          {
            "from": [
              104,
              224
            ],
            "to": [
              100,
              54
            ],
            "bend": 0,
            "color": "#5bba6f",
            "snd": "volley",
            "contactType": "volley",
            "payoff": true,
            "label": "DEEP BLOCK",
            "intent": "deep"
          }
        ]
      },
      "winTitle": "Survived it.",
      "winTxt": "This return catches you low around the service line. A compact volley <b>deep</b> and central gives you time to recover your position. Judge the low contact in front of you; a flat serve does not inevitably produce this reply.",
      "mid": {
        "youStart": [
          104,
          224
        ],
        "oppStart": [
          140,
          18
        ],
        "oppEnd": [
          140,
          18
        ],
        "shots": [
          {
            "from": [
              104,
              224
            ],
            "to": [
              52,
              60
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "volley",
            "contactType": "volley",
            "label": "SWING VOLLEY",
            "intent": "risk",
            "miss": "long"
          }
        ]
      },
      "midTitle": "Sailed long.",
      "midTxt": "This low swinging volley sails long. From below the tape, adding pace while lifting the ball reduces your margin. A compact block gives you a better chance to recover before attacking again."
    }
  },
  {
    "id": "inside_out_forehand",
    "title": "The Inside-Out Forehand",
    "opp": "<b>Grinding to your backhand.</b> They keep feeding the backhand corner, content to rally. There's a ball here to run around and take over with the forehand — if you dare leave the backhand corner open.",
    "d1": {
      "sit": "They've parked another ball in your backhand corner, expecting a neutral backhand back. But it sits up just enough — you could run around it and crack an inside-out forehand.",
      "q": "Do you run around the backhand?",
      "opts": [
        {
          "lbl": "Run around it — inside-out forehand",
          "sub": "Take control, dictate with the weapon",
          "br": "A"
        },
        {
          "lbl": "Stay solid — steady backhand crosscourt",
          "sub": "Don't open the court, keep grinding",
          "br": "B"
        }
      ],
      "court": {
        "shots": [],
        "sitter": [
          55,
          256
        ],
        "youStart": [
          55,
          256
        ],
        "oppStart": [
          100,
          40
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          55,
          256
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          150,
          52
        ],
        "shots": [
          {
            "from": [
              58,
              256
            ],
            "to": [
              150,
              50
            ],
            "bend": -8,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "INSIDE-OUT FH",
            "contactType": "ground"
          },
          {
            "from": [
              150,
              50
            ],
            "to": [
              95,
              198
            ],
            "bend": 10,
            "color": "#e07070",
            "snd": "slice",
            "label": "SCRAMBLE",
            "contactType": "slice"
          }
        ],
        "youEnd": [
          95,
          198
        ]
      },
      "reveal": "Running around the backhand turns a neutral rally into your point — the inside-out forehand drives them into the far corner. They scramble it back short, and now the whole court is yours to direct.",
      "d2": {
        "sit": "Their scramble floats up short. They're stranded in the corner you drove them to, sprinting back across. Finish it — where?",
        "q": "Which target fits this reply?",
        "opts": [
          {
            "lbl": "Play behind the recovery",
            "sub": "Wrong-foot the recovery",
            "win": true,
            "id": "inside_out_forehand:A:preferred"
          },
          {
            "lbl": "Into the open court they're sprinting to",
            "sub": "Hit the big space",
            "win": false,
            "id": "inside_out_forehand:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          95,
          198
        ],
        "oppStart": [
          150,
          52
        ],
        "oppEnd": [
          100,
          44
        ],
        "shots": [
          {
            "from": [
              95,
              198
            ],
            "to": [
              152,
              56
            ],
            "bend": -4,
            "color": "#5bba6f",
            "snd": "pop",
            "payoff": true,
            "label": "BEHIND THEM",
            "intent": "behind",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "The inside-out forehand moved the opponent into the corner. Their recovery then opened the space <b>behind</b> them. Read that movement before choosing the next target; this central contact is not an inside-in forehand down the line.",
      "mid": {
        "youStart": [
          95,
          198
        ],
        "oppStart": [
          150,
          52
        ],
        "oppEnd": [
          52,
          60
        ],
        "shots": [
          {
            "from": [
              95,
              198
            ],
            "to": [
              50,
              58
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "OPEN COURT",
            "intent": "into_run",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "They ran it down.",
      "midTxt": "Good ball — but they'd already committed that way, so it went straight into their <b>run</b>. The forehand did the hard work of moving them; wasting it into the space they're covering lets them off the hook. Behind them was the finish."
    },
    "B": {
      "seq": {
        "youStart": [
          55,
          256
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          130,
          50
        ],
        "shots": [
          {
            "from": [
              58,
              256
            ],
            "to": [
              150,
              52
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "STEADY BACKHAND",
            "contactType": "ground"
          },
          {
            "from": [
              150,
              52
            ],
            "to": [
              92,
              190
            ],
            "bend": -8,
            "color": "#e07070",
            "snd": "slice",
            "label": "SHORTER REPLY",
            "contactType": "slice"
          }
        ],
        "youEnd": [
          92,
          190
        ]
      },
      "reveal": "The steady backhand keeps the rally honest and denies them anything to attack. Grind long enough and they blink — this reply lands shorter and softer. The ball you were waiting for.",
      "d2": {
        "sit": "Their reply finally sits up short and central. You've earned a clean look — but only if you take it. What now?",
        "q": "What do you do with it?",
        "opts": [
          {
            "lbl": "Step in and drive it into the open court",
            "sub": "Cash in the patience",
            "win": true,
            "id": "inside_out_forehand:B:preferred"
          },
          {
            "lbl": "Play it safe — another steady rally ball",
            "sub": "Wait for something even better",
            "win": false,
            "id": "inside_out_forehand:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          92,
          190
        ],
        "oppStart": [
          130,
          50
        ],
        "oppEnd": [
          100,
          50
        ],
        "shots": [
          {
            "from": [
              92,
              190
            ],
            "to": [
              46,
              52
            ],
            "bend": -6,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "OPEN COURT",
            "intent": "space",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "Patience only pays if you cash it in. The short ball is the reward for grinding — step in and drive the <b>open</b> court. Waiting is a weapon until the ball to attack arrives; then hesitation just hands the initiative back.",
      "mid": {
        "youStart": [
          92,
          190
        ],
        "oppStart": [
          130,
          50
        ],
        "oppEnd": [
          70,
          50
        ],
        "shots": [
          {
            "from": [
              92,
              190
            ],
            "to": [
              100,
              54
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "ANOTHER RALLY BALL",
            "intent": "reset",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Chance gone.",
      "midTxt": "You had the ball you'd worked for and patted back another <b>neutral</b> rally ball — handing them a free reset. Over-patience is a decision too: the point you built dissolves. When the short ball comes, the waiting is over."
    }
  },
  {
    "id": "high_ball_backhand",
    "title": "High Ball to the Backhand",
    "opp": "<b>Heavy topspin to your backhand.</b> They're loading spin that kicks high to your weakest wing. Let it play you and you're stuck defending shoulder-high balls all day.",
    "d1": {
      "sit": "You read a heavy topspin ball early as it rises toward shoulder height on your backhand. You have enough time either to create space for a low slice or step in and meet it before the kick peaks.",
      "q": "How do you handle the high backhand?",
      "opts": [
        {
          "lbl": "Slice it back low and deep",
          "sub": "Neutralise the height, deny them pace",
          "br": "A"
        },
        {
          "lbl": "Step in and take it early",
          "sub": "Drive it before it kicks up",
          "br": "B"
        }
      ],
      "court": {
        "youStart": [
          55,
          258
        ],
        "oppStart": [
          100,
          40
        ],
        "shots": [],
        "sitter": [
          58,
          258
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          55,
          258
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          100,
          44
        ],
        "shots": [
          {
            "from": [
              58,
              276
            ],
            "to": [
              62,
              52
            ],
            "bend": 2,
            "color": "#c8a84b",
            "snd": "slice",
            "label": "LOW SLICE",
            "contactType": "slice"
          },
          {
            "from": [
              62,
              52
            ],
            "to": [
              152,
              276
            ],
            "bend": -10,
            "color": "#e07070",
            "snd": "drive",
            "label": "THEY ATTACK",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          152,
          276
        ]
      },
      "reveal": "The slice lowers the contact and keeps you in the rally, but this one lands short enough for the opponent to step in and drive. You're pushed wide and back on defense: height neutralised, initiative conceded on the landing depth.",
      "d2": {
        "sit": "Their drive has pushed you wide to the forehand corner, stretched and off balance. What now?",
        "q": "What's the play?",
        "opts": [
          {
            "lbl": "High, deep reset down the middle",
            "sub": "Buy time, get back to neutral",
            "win": true,
            "id": "high_ball_backhand:A:preferred"
          },
          {
            "lbl": "Drive down the line from the stretched contact",
            "sub": "End the scramble",
            "win": false,
            "id": "high_ball_backhand:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          152,
          276
        ],
        "oppStart": [
          100,
          44
        ],
        "oppEnd": [
          100,
          44
        ],
        "shots": [
          {
            "from": [
              152,
              276
            ],
            "to": [
              100,
              52
            ],
            "bend": 0,
            "color": "#5bba6f",
            "snd": "slice",
            "payoff": true,
            "label": "RESET DEEP",
            "intent": "reset",
            "contactType": "slice"
          }
        ]
      },
      "winTitle": "Neutralised.",
      "winTxt": "You chose the slice, so you chose to defend — now don't compound it. A high, deep, <b>neutral</b> reset resets the rally and takes their pace away. The slice buys time by design; the follow-up has to respect that, not gamble it away.",
      "mid": {
        "youStart": [
          152,
          276
        ],
        "oppStart": [
          100,
          44
        ],
        "oppEnd": [
          100,
          44
        ],
        "shots": [
          {
            "from": [
              152,
              276
            ],
            "to": [
              50,
              56
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "STRETCH WINNER",
            "intent": "risk",
            "miss": "wide",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Just wide.",
      "midTxt": "The counter misses from the stretched contact. The previous slice does not dictate the next shot; your current balance and available time are the reason to consider another reset."
    },
    "B": {
      "seq": {
        "youStart": [
          55,
          258
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          130,
          58
        ],
        "shots": [
          {
            "from": [
              58,
              230
            ],
            "to": [
              150,
              48
            ],
            "bend": -8,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "DRIVE ON THE RISE",
            "contactType": "ground"
          },
          {
            "from": [
              150,
              48
            ],
            "to": [
              98,
              196
            ],
            "bend": 10,
            "color": "#e07070",
            "snd": "slice",
            "label": "RUSHED REPLY",
            "contactType": "slice"
          }
        ],
        "youEnd": [
          98,
          196
        ]
      },
      "reveal": "Meeting it before the kick peaks turns an awkward ball into a controlled strike. The deep drive reduces their recovery time, and the rushed reply lands short. Now you're dictating off your own backhand.",
      "d2": {
        "sit": "Their rushed reply sits up short. They're stranded in the corner and the whole other side is open. Finish it — where?",
        "q": "Which target fits this reply?",
        "opts": [
          {
            "lbl": "Drive it into the open court",
            "sub": "Take the space you built",
            "win": true,
            "id": "high_ball_backhand:B:preferred"
          },
          {
            "lbl": "Flatten it toward the corner line",
            "sub": "Chase pace and the sideline",
            "win": false,
            "id": "high_ball_backhand:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          98,
          196
        ],
        "oppStart": [
          130,
          58
        ],
        "oppEnd": [
          130,
          58
        ],
        "shots": [
          {
            "from": [
              98,
              196
            ],
            "to": [
              46,
              52
            ],
            "bend": 6,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "OPEN COURT",
            "intent": "space",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "Taking the high ball early flipped the rally — they're stranded in the corner and the whole <b>open</b> court is yours. A drive into the space finishes what the early contact started. The lesson of the high backhand: take the height away and you take control.",
      "mid": {
        "youStart": [
          98,
          196
        ],
        "oppStart": [
          130,
          58
        ],
        "oppEnd": [
          130,
          58
        ],
        "shots": [
          {
            "from": [
              98,
              196
            ],
            "to": [
              44,
              48
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "FLAT LINE",
            "intent": "risk",
            "miss": "long",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Just long.",
      "midTxt": "The flatter corner attempt goes long here. The early contact created space; preserve usable target margin when using it. The animation illustrates an outcome, not a measured error rate."
    }
  },
  {
    "id": "rally_tolerance",
    "title": "Rally Tolerance",
    "opp": "<b>A patient baseliner.</b> They give you nothing loose and wait for you to over-press. The trap is impatience — going for a winner off a ball that isn't there yet.",
    "d1": {
      "sit": "A long neutral rally. The ball you've just got is fine — deep-ish, medium pace — but it's not a clear attacking ball. Your legs are tired and the temptation is to end it now.",
      "q": "Do you pull the trigger?",
      "opts": [
        {
          "lbl": "Go for it — drive a winner now",
          "sub": "End the grind",
          "br": "A"
        },
        {
          "lbl": "One more heavy ball, stay patient",
          "sub": "Wait for the real opening",
          "br": "B"
        }
      ],
      "court": {
        "youStart": [
          100,
          276
        ],
        "oppStart": [
          100,
          40
        ],
        "shots": [],
        "sitter": [
          100,
          276
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          100,
          276
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          55,
          52
        ],
        "shots": [
          {
            "from": [
              100,
              276
            ],
            "to": [
              52,
              50
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "EARLY WINNER",
            "contactType": "ground"
          },
          {
            "from": [
              52,
              50
            ],
            "to": [
              170,
              280
            ],
            "bend": -10,
            "color": "#e07070",
            "snd": "drive",
            "label": "COUNTERED",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          170,
          280
        ]
      },
      "reveal": "The ball wasn't there — driving a winner off a neutral, deep ball means hitting from defense disguised as offense. They were balanced, read it, and countered into the space you vacated. Now you're the one scrambling.",
      "d2": {
        "sit": "Their counter has pushed you wide and deep — you forced the point and it flipped. What now?",
        "q": "What's the play?",
        "opts": [
          {
            "lbl": "Reset high and deep, get back to neutral",
            "sub": "Undo the damage, stay in the point",
            "win": true,
            "id": "rally_tolerance:A:preferred"
          },
          {
            "lbl": "Drive down the line from the wide contact",
            "sub": "Try to reverse the attack immediately",
            "win": false,
            "id": "rally_tolerance:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          170,
          280
        ],
        "oppStart": [
          55,
          52
        ],
        "oppEnd": [
          100,
          44
        ],
        "shots": [
          {
            "from": [
              170,
              280
            ],
            "to": [
              100,
              54
            ],
            "bend": 0,
            "color": "#5bba6f",
            "snd": "slice",
            "payoff": true,
            "label": "RESET DEEP",
            "intent": "reset",
            "contactType": "slice"
          }
        ]
      },
      "winTitle": "Recovered.",
      "winTxt": "Forcing the point put you on defense — so stop forcing. A high, deep <b>neutral</b> reset climbs you back to even. The discipline of tolerance isn't passivity; it's declining the ball that isn't there yet. Reset and wait for the real one.",
      "mid": {
        "youStart": [
          170,
          280
        ],
        "oppStart": [
          55,
          52
        ],
        "oppEnd": [
          100,
          44
        ],
        "shots": [
          {
            "from": [
              170,
              280
            ],
            "to": [
              50,
              56
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "SECOND WINNER",
            "intent": "risk",
            "miss": "wide",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Just wide.",
      "midTxt": "This second attacking attempt misses while you are still recovering. The score does not improve the incoming ball. A high, deep reset gives you another chance to organise the point."
    },
    "B": {
      "seq": {
        "youStart": [
          100,
          276
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          80,
          50
        ],
        "shots": [
          {
            "from": [
              100,
              276
            ],
            "to": [
              100,
              48
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "HEAVY BALL",
            "contactType": "ground"
          },
          {
            "from": [
              100,
              48
            ],
            "to": [
              96,
              192
            ],
            "bend": 6,
            "color": "#e07070",
            "snd": "slice",
            "label": "SHORT REPLY",
            "contactType": "slice"
          }
        ],
        "youEnd": [
          96,
          192
        ]
      },
      "reveal": "The heavy deep ball draws a shorter central reply in this example. Depth still carries execution risk. Read this new ball rather than assuming patience always produces an opening.",
      "d2": {
        "sit": "Their reply finally sits up short. This is the ball you waited for — a real attacking ball, not a hopeful one. Finish it — where?",
        "q": "Which target fits this reply?",
        "opts": [
          {
            "lbl": "Step in and drive the open corner",
            "sub": "Now the winner is on",
            "win": true,
            "id": "rally_tolerance:B:preferred"
          },
          {
            "lbl": "Keep grinding — one more safe ball",
            "sub": "Wait for something even better",
            "win": false,
            "id": "rally_tolerance:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          96,
          192
        ],
        "oppStart": [
          80,
          50
        ],
        "oppEnd": [
          80,
          50
        ],
        "shots": [
          {
            "from": [
              96,
              192
            ],
            "to": [
              156,
              52
            ],
            "bend": -6,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "OPEN COURT",
            "intent": "space",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "Patience earned the ball impatience gambled on. Now it's a real short ball — step in and drive the <b>open</b> court with margin. Tolerance is a weapon that sets up the winner; the trick is telling the ball that's there from the ball that isn't.",
      "mid": {
        "youStart": [
          96,
          192
        ],
        "oppStart": [
          80,
          50
        ],
        "oppEnd": [
          80,
          50
        ],
        "shots": [
          {
            "from": [
              96,
              192
            ],
            "to": [
              100,
              54
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "ANOTHER RALLY BALL",
            "intent": "reset",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Chance gone.",
      "midTxt": "You waited for the perfect ball and passed on the very good one — over-patience hands back a <b>neutral</b> reset you earned. Tolerance wins the rally; hesitation loses the point you built. When the real ball comes, take it."
    }
  },
  {
    "id": "defend_drop",
    "title": "Defend the Drop Shot",
    "opp": "<b>They dropped it and followed it in.</b> You have sprinted forward and reached the ball low near the net. They are closing from the other side; choose the reply from where you are now.",
    "d1": {
      "sit": "They've dropped it short and charged the net behind it. You read it early enough to reach low at the net cord and get the racket under the ball, with them looming over it.",
      "q": "You've sprinted to the drop — what do you hit?",
      "opts": [
        {
          "lbl": "Dink it crosscourt into the open",
          "sub": "Angle it away, make them lunge",
          "br": "A"
        },
        {
          "lbl": "Loft a lob over them",
          "sub": "They've crowded the net — send them back",
          "br": "B"
        }
      ],
      "court": {
        "shots": [],
        "sitter": [
          100,
          175
        ],
        "youStart": [
          100,
          175
        ],
        "oppStart": [
          100,
          140
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          100,
          175
        ],
        "youEnd": [
          70,
          182
        ],
        "oppStart": [
          100,
          140
        ],
        "oppEnd": [
          152,
          138
        ],
        "shots": [
          {
            "from": [
              100,
              175
            ],
            "to": [
              150,
              134
            ],
            "bend": 8,
            "color": "#c8a84b",
            "snd": "tap",
            "label": "DINK CROSSCOURT",
            "contactType": "slice"
          },
          {
            "from": [
              150,
              134
            ],
            "to": [
              70,
              182
            ],
            "bend": -6,
            "color": "#e07070",
            "snd": "volley",
            "label": "REFLEX VOLLEY",
            "contactType": "volley"
          }
        ]
      },
      "reveal": "You scramble to the drop and flick it crosscourt — but a net-jammed opponent has quick hands and reflex-volleys it back. They're stranded wide now, though, and you've got a look at the open court.",
      "d2": {
        "sit": "Their reflex volley floats back to your left. They've lunged wide to reach your dink and can't recover. Finish it — where?",
        "q": "Where's the pass?",
        "opts": [
          {
            "lbl": "Into the open court they left",
            "sub": "Away from their momentum",
            "win": true,
            "id": "defend_drop:A:preferred"
          },
          {
            "lbl": "Right back at them at the net",
            "sub": "Surprise them",
            "win": false,
            "id": "defend_drop:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          70,
          182
        ],
        "oppStart": [
          152,
          138
        ],
        "oppEnd": [
          152,
          138
        ],
        "shots": [
          {
            "from": [
              70,
              182
            ],
            "to": [
              46,
              126
            ],
            "bend": -6,
            "color": "#5bba6f",
            "snd": "pop",
            "payoff": true,
            "label": "OPEN COURT",
            "intent": "space",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "Scrambling to a drop isn't a lost point — reach it and the point resets. They lunged wide to volley your dink, so the <b>open</b> court is the whole other side. Reading a net-jammed opponent: once you've moved them, the space they leave is the answer.",
      "mid": {
        "youStart": [
          70,
          182
        ],
        "oppStart": [
          152,
          138
        ],
        "oppEnd": [
          152,
          138
        ],
        "shots": [
          {
            "from": [
              70,
              182
            ],
            "to": [
              150,
              136
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "AT THEM",
            "intent": "risk",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Right at them.",
      "midTxt": "Going back at a net player who's set is a <b>low-percentage</b> gamble — quick hands eat that ball. The open court was begging; you passed it up for a surprise that surprised nobody. Pass into the space they left, not the space they're standing in."
    },
    "B": {
      "seq": {
        "youStart": [
          100,
          175
        ],
        "youEnd": [
          120,
          196
        ],
        "oppStart": [
          100,
          140
        ],
        "oppEnd": [
          100,
          64
        ],
        "shots": [
          {
            "from": [
              100,
              175
            ],
            "to": [
              104,
              66
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "LOB OVER THEM",
            "contactType": "ground"
          },
          {
            "from": [
              104,
              66
            ],
            "to": [
              120,
              196
            ],
            "bend": 12,
            "color": "#e07070",
            "snd": "weak",
            "label": "SCRAMBLE BACK",
            "contactType": "ground"
          }
        ]
      },
      "reveal": "They crowded the net behind the drop — so the lob is deadly. They have to stop, reverse and chase it down deep, with no time to set a smash. All they scrape back is a weak, short reply, and now you're the one moving in.",
      "d2": {
        "sit": "Their scrambled reply floats up short. You've flipped it — they're pinned deep now, backpedaling. Where do you put it?",
        "q": "Finish it — where?",
        "opts": [
          {
            "lbl": "Drive it deep into the open corner",
            "sub": "Finish while they're pinned deep",
            "win": true,
            "id": "defend_drop:B:preferred"
          },
          {
            "lbl": "Drive flatter into the crosscourt corner",
            "sub": "End it in one",
            "win": false,
            "id": "defend_drop:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          120,
          196
        ],
        "oppStart": [
          100,
          64
        ],
        "oppEnd": [
          100,
          64
        ],
        "shots": [
          {
            "from": [
              120,
              196
            ],
            "to": [
              154,
              50
            ],
            "bend": -6,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "DEEP & IN",
            "intent": "deep",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "Because you arrived early enough to get under the ball and they crowded the net, the lob uses the space behind them. Once they are pinned deep, a controlled drive into the <b>open</b> corner completes the reversal.",
      "mid": {
        "youStart": [
          120,
          196
        ],
        "oppStart": [
          100,
          64
        ],
        "oppEnd": [
          100,
          64
        ],
        "shots": [
          {
            "from": [
              120,
              196
            ],
            "to": [
              44,
              50
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "FLAT WINNER",
            "intent": "risk",
            "miss": "long",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Just long.",
      "midTxt": "The flat drive misses in this example. Your lob changed the opponent’s position; it did not guarantee the finish. Read the short reply and use a target with enough margin."
    }
  },
  {
    "id": "bring_them_in",
    "title": "Bring Them In",
    "opp": "<b>Deep-camping baseliner.</b> They hold a deep baseline position and hit everything back with interest. They're comfortable deep — so make them uncomfortable at the net.",
    "d1": {
      "sit": "You've traded heavy groundstrokes and they're camped deep near the baseline, loving the long rally. This ball sits up at your service line — short enough to change the pattern completely.",
      "q": "How do you change it up?",
      "opts": [
        {
          "lbl": "Push them back, then bring them in",
          "sub": "Drive deep first, set up the trap",
          "br": "A"
        },
        {
          "lbl": "Out-grind them — heavy ball deep",
          "sub": "Beat them at their own game",
          "br": "B"
        }
      ],
      "court": {
        "shots": [],
        "sitter": [
          100,
          220
        ],
        "youStart": [
          100,
          220
        ],
        "oppStart": [
          100,
          8
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          100,
          220
        ],
        "oppStart": [
          100,
          8
        ],
        "oppEnd": [
          100,
          8
        ],
        "shots": [
          {
            "from": [
              100,
              220
            ],
            "to": [
              100,
              8
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "DEEP DRIVE",
            "contactType": "ground"
          },
          {
            "from": [
              100,
              8
            ],
            "to": [
              104,
              198
            ],
            "bend": 6,
            "color": "#e07070",
            "snd": "weak",
            "label": "SHORT REPLY",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          104,
          198
        ]
      },
      "reveal": "Your deep drive keeps their contact near the baseline, and the reply floats up short. They have not moved forward. This is the moment to test the distance between that deep position and the forecourt.",
      "d2": {
        "sit": "Their reply sits up short inside your service line. They remain deep and have not started forward. Which change of length tests that position?",
        "q": "Finish it — where?",
        "opts": [
          {
            "lbl": "Drop short into the space in front",
            "sub": "Make the deep defender move forward",
            "win": true,
            "id": "bring_them_in:A:preferred"
          },
          {
            "lbl": "Drive it deep into the corner",
            "sub": "Use the backcourt instead of changing length",
            "win": false,
            "id": "bring_them_in:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          104,
          198
        ],
        "oppStart": [
          100,
          8
        ],
        "oppEnd": [
          100,
          8
        ],
        "shots": [
          {
            "from": [
              104,
              198
            ],
            "to": [
              92,
              132
            ],
            "bend": 6,
            "color": "#5bba6f",
            "snd": "tap",
            "payoff": true,
            "label": "DROP SHOT",
            "intent": "drop",
            "contactType": "slice"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "Held near the baseline, they must cover almost the entire forecourt to reach the <b>drop</b>. The previous deep ball created that distance; the drop is the change of geometry, not a trick used without setup.",
      "mid": {
        "youStart": [
          104,
          198
        ],
        "oppStart": [
          100,
          8
        ],
        "oppEnd": [
          140,
          44
        ],
        "shots": [
          {
            "from": [
              104,
              198
            ],
            "to": [
              150,
              46
            ],
            "bend": -6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "DEEP CORNER",
            "intent": "into_run",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "They ran it down.",
      "midTxt": "The defender retrieves the deep drive in this example. The question asked which change of length tests their position: the short court is the unused <b>space</b>. A deep drive can still work, but it does not ask them to come forward."
    },
    "B": {
      "seq": {
        "youStart": [
          100,
          220
        ],
        "oppStart": [
          100,
          8
        ],
        "oppEnd": [
          100,
          8
        ],
        "shots": [
          {
            "from": [
              100,
              220
            ],
            "to": [
              100,
              8
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "HEAVY DEEP",
            "contactType": "ground"
          },
          {
            "from": [
              100,
              8
            ],
            "to": [
              100,
              205
            ],
            "bend": 0,
            "color": "#e07070",
            "snd": "drive",
            "label": "HEAVY REPLY",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          100,
          205
        ]
      },
      "reveal": "You match them deep, heavy for heavy — but this is their game. They've hit a thousand of these. The rally resets to neutral and this reply lands a little shorter. You're grinding a grinder; someone has to change it.",
      "d2": {
        "sit": "Their reply lands a touch short. You've out-lasted one exchange — but they're still deep and comfortable. What now?",
        "q": "What's the play?",
        "opts": [
          {
            "lbl": "Short angle to drag them forward and wide",
            "sub": "Change the shape — make them move",
            "win": true,
            "id": "bring_them_in:B:preferred"
          },
          {
            "lbl": "Another heavy ball down the middle",
            "sub": "Keep grinding, out-last them",
            "win": false,
            "id": "bring_them_in:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          100,
          205
        ],
        "oppStart": [
          100,
          8
        ],
        "oppEnd": [
          100,
          8
        ],
        "shots": [
          {
            "from": [
              100,
              205
            ],
            "to": [
              46,
              116
            ],
            "bend": 6,
            "color": "#5bba6f",
            "snd": "pop",
            "payoff": true,
            "label": "SHORT ANGLE",
            "intent": "angle",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "Grinding a grinder plays into their hands — so change the shape. A short <b>angle</b> drags them forward and wide, out of the deep comfort zone they hate to leave. You don't out-last a backboard; you make it move.",
      "mid": {
        "youStart": [
          100,
          205
        ],
        "oppStart": [
          100,
          8
        ],
        "oppEnd": [
          100,
          8
        ],
        "shots": [
          {
            "from": [
              100,
              205
            ],
            "to": [
              100,
              54
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "HEAVY BALL",
            "intent": "reset",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Stalemate.",
      "midTxt": "Another heavy <b>neutral</b> ball down the middle is exactly what they want — you're trading blows with a backboard and hoping they blink first. Hope isn't a tactic. Change the pattern; make them play a ball they don't like."
    }
  },
  {
    "id": "approach_selection",
    "title": "Approach-Shot Selection",
    "opp": "<b>A short ball on your backhand side.</b> The opponent is recovering on that same side. Your approach target changes the passing lane you leave.",
    "d1": {
      "sit": "A short ball floats near your ad-court singles sideline while the opponent recovers on that side. You want to attack the net, but your target determines the passing lane you leave.",
      "q": "How do you approach?",
      "opts": [
        {
          "lbl": "Approach down the line",
          "sub": "Cut off their angle, cover from one side",
          "br": "A"
        },
        {
          "lbl": "Approach crosscourt",
          "sub": "Bigger target, safer over the net",
          "br": "B"
        }
      ],
      "court": {
        "youStart": [
          64,
          214
        ],
        "oppStart": [
          64,
          40
        ],
        "shots": [],
        "sitter": [
          64,
          214
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          64,
          214
        ],
        "youEnd": [
          66,
          178
        ],
        "oppStart": [
          64,
          40
        ],
        "oppEnd": [
          58,
          46
        ],
        "shots": [
          {
            "from": [
              64,
              214
            ],
            "to": [
              56,
              46
            ],
            "bend": 2,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "APPROACH DTL",
            "contactType": "ground"
          },
          {
            "from": [
              56,
              46
            ],
            "to": [
              66,
              178
            ],
            "bend": 8,
            "color": "#e07070",
            "snd": "drive",
            "noBounce": true,
            "label": "DIPPING PASS",
            "contactType": "ground"
          }
        ]
      },
      "reveal": "From this sideline position, the down-the-line approach keeps you behind the ball and limits the opponent's easiest crosscourt pass. Their reply dips at your feet, but you are balanced and covering from the correct side.",
      "d2": {
        "sit": "You're at the net, well-positioned by the approach. Their pass dips low at your feet, below the net cord. Volley it — how?",
        "q": "How do you volley?",
        "opts": [
          {
            "lbl": "Punch it deep and hold your position",
            "sub": "Can't hit down — reset deep, stay at net",
            "win": true,
            "id": "approach_selection:A:preferred"
          },
          {
            "lbl": "Go for the sharp-angle winner",
            "sub": "End it now with touch",
            "win": false,
            "id": "approach_selection:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          66,
          178
        ],
        "oppStart": [
          58,
          46
        ],
        "oppEnd": [
          58,
          46
        ],
        "shots": [
          {
            "from": [
              66,
              178
            ],
            "to": [
              60,
              44
            ],
            "bend": 0,
            "color": "#5bba6f",
            "snd": "volley",
            "payoff": true,
            "label": "DEEP VOLLEY",
            "intent": "deep",
            "contactType": "volley"
          }
        ]
      },
      "winTitle": "Net position held.",
      "winTxt": "The down-the-line approach did its job — you're in position, so from below the net you don't gamble. Punch it <b>deep</b>, keep them pinned and preserve the net. The correct target has improved the next ball; it has not magically ended the point.",
      "mid": {
        "youStart": [
          66,
          178
        ],
        "oppStart": [
          58,
          46
        ],
        "oppEnd": [
          58,
          46
        ],
        "shots": [
          {
            "from": [
              66,
              178
            ],
            "to": [
              30,
              120
            ],
            "bend": 4,
            "color": "#c8a84b",
            "snd": "volley",
            "label": "ANGLE VOLLEY",
            "intent": "risk",
            "miss": "net",
            "contactType": "volley"
          }
        ]
      },
      "midTitle": "Into the net.",
      "midTxt": "From below the net cord the sharp angle has little margin — you must lift it and find width at once. The approach put you in balance; a <b>deep, controlled</b> volley preserves that advantage."
    },
    "B": {
      "seq": {
        "youStart": [
          64,
          214
        ],
        "youEnd": [
          158,
          182
        ],
        "oppStart": [
          64,
          40
        ],
        "oppEnd": [
          150,
          52
        ],
        "shots": [
          {
            "from": [
              64,
              214
            ],
            "to": [
              150,
              50
            ],
            "bend": -6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "APPROACH CC",
            "contactType": "ground"
          },
          {
            "from": [
              150,
              50
            ],
            "to": [
              158,
              182
            ],
            "bend": -2,
            "color": "#e07070",
            "snd": "drive",
            "noBounce": true,
            "label": "PASS DOWN THE LINE",
            "contactType": "ground"
          }
        ]
      },
      "reveal": "Crosscourt feels safer over the net — but it opens the line, and you follow the ball toward the middle. They step in and rip the pass down the line you just vacated. Now you're lunging, out of position.",
      "d2": {
        "sit": "You're stretched wide, lunging at their down-the-line pass — the hole the crosscourt approach opened. Best you can do is get a racket on it. What now?",
        "q": "What's the play?",
        "opts": [
          {
            "lbl": "Block it back deep and recover",
            "sub": "Survive, reset the point",
            "win": true,
            "id": "approach_selection:B:preferred"
          },
          {
            "lbl": "Redirect the stretched volley at an angle",
            "sub": "Change direction instead of rebuilding depth",
            "win": false,
            "id": "approach_selection:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          158,
          182
        ],
        "oppStart": [
          150,
          52
        ],
        "oppEnd": [
          150,
          52
        ],
        "shots": [
          {
            "from": [
              158,
              182
            ],
            "to": [
              100,
              48
            ],
            "bend": 0,
            "color": "#5bba6f",
            "snd": "volley",
            "contactType": "volley",
            "payoff": true,
            "label": "BLOCK DEEP",
            "intent": "deep"
          }
        ]
      },
      "winTitle": "Survived it.",
      "winTxt": "The crosscourt approach left the line open and put you here — so don't compound it. A block <b>deep</b> and central buys time to recover the net position you gave up. The lesson: approach down the line to cut the pass off; crosscourt hands them the target.",
      "mid": {
        "youStart": [
          158,
          182
        ],
        "oppStart": [
          150,
          52
        ],
        "oppEnd": [
          150,
          52
        ],
        "shots": [
          {
            "from": [
              158,
              182
            ],
            "to": [
              150,
              60
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "volley",
            "contactType": "volley",
            "label": "REFLEX WINNER",
            "intent": "risk",
            "miss": "wide"
          }
        ]
      },
      "midTitle": "Just wide.",
      "midTxt": "The angled redirection misses from the stretched volley. A deeper block offers recovery time from this contact. This example does not mean every crosscourt approach fails; read the available pass and your coverage."
    }
  },
  {
    "id": "counter_net_rusher",
    "title": "Counter the Net-Rusher",
    "opp": "<b>Relentless net-rusher.</b> They attack the net at every chance and cover the corners like a wall. Try to thread them and the margins vanish — the answer isn't a better pass, it's a different one.",
    "d1": {
      "sit": "They've chipped an approach and charged in, tight to the net and set, covering both corners. You've got a passing shot — but the angles are all covered. Where do you go?",
      "q": "How do you pass a set volleyer?",
      "opts": [
        {
          "lbl": "Jam it straight at the body",
          "sub": "Take their reach away",
          "br": "A"
        },
        {
          "lbl": "Thread the pass down the line",
          "sub": "Beat them into the corner",
          "br": "B"
        }
      ],
      "court": {
        "shots": [],
        "sitter": [
          100,
          220
        ],
        "youStart": [
          100,
          220
        ],
        "oppStart": [
          100,
          138
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          100,
          220
        ],
        "oppStart": [
          100,
          138
        ],
        "oppEnd": [
          92,
          140
        ],
        "shots": [
          {
            "from": [
              100,
              220
            ],
            "to": [
              100,
              140
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "BODY DRILL",
            "contactType": "ground"
          },
          {
            "from": [
              100,
              140
            ],
            "to": [
              92,
              192
            ],
            "bend": 6,
            "color": "#e07070",
            "snd": "volley",
            "label": "JAMMED POP-UP",
            "contactType": "volley"
          }
        ],
        "youEnd": [
          92,
          192
        ]
      },
      "reveal": "Drilled at the body, the set volleyer has less room to organise the hands than when reaching toward a corner. The hip target jams this volley and produces a weak pop-up. You've used margin to create the easier second pass.",
      "d2": {
        "sit": "Their jammed volley pops up short and central. They're stuck at the net, off balance from the body shot. Put it away — where?",
        "q": "Finish it — where?",
        "opts": [
          {
            "lbl": "Roll it into the open court",
            "sub": "Now the space is there",
            "win": true,
            "id": "counter_net_rusher:A:preferred"
          },
          {
            "lbl": "Drill the body again",
            "sub": "It worked once",
            "win": false,
            "id": "counter_net_rusher:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          92,
          192
        ],
        "oppStart": [
          92,
          140
        ],
        "oppEnd": [
          92,
          140
        ],
        "shots": [
          {
            "from": [
              92,
              192
            ],
            "to": [
              152,
              128
            ],
            "bend": -6,
            "color": "#5bba6f",
            "snd": "pop",
            "payoff": true,
            "label": "OPEN COURT",
            "intent": "space",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point won.",
      "winTxt": "The body jam did the hard work — now they've popped it up and the <b>open</b> court is wide. Roll it into the space with margin. The body is the answer to a tight volleyer; the open court is the answer once you've knocked them off balance.",
      "mid": {
        "youStart": [
          92,
          192
        ],
        "oppStart": [
          92,
          140
        ],
        "oppEnd": [
          92,
          140
        ],
        "shots": [
          {
            "from": [
              92,
              192
            ],
            "to": [
              94,
              138
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "BODY AGAIN",
            "intent": "risk",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Right at them.",
      "midTxt": "The body worked because it surprised a set volleyer — do it again and they're ready, hands set, and they punch it away. A <b>low-percentage</b> repeat. Once you've popped them up, the open court is the finish; save the jam for when they're tight."
    },
    "B": {
      "seq": {
        "youStart": [
          100,
          220
        ],
        "oppStart": [
          100,
          138
        ],
        "oppEnd": [
          70,
          136
        ],
        "shots": [
          {
            "from": [
              100,
              220
            ],
            "to": [
              64,
              124
            ],
            "bend": -4,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "LINE PASS",
            "contactType": "ground"
          },
          {
            "from": [
              64,
              124
            ],
            "to": [
              130,
              196
            ],
            "bend": 10,
            "color": "#e07070",
            "snd": "volley",
            "label": "REFLEX VOLLEY",
            "contactType": "volley"
          }
        ],
        "youEnd": [
          130,
          196
        ]
      },
      "reveal": "The volleyer reaches the down-the-line attempt and redirects crosscourt. You now have to recover wide. The narrower lane was covered on this point; no numerical success rate is implied.",
      "d2": {
        "sit": "Their reflex volley pulls you wide and you're lunging, out of position. What now?",
        "q": "What's the play?",
        "opts": [
          {
            "lbl": "Block it deep and reset",
            "sub": "Survive, get back in the point",
            "win": true,
            "id": "counter_net_rusher:B:preferred"
          },
          {
            "lbl": "Redirect sharply from the stretched contact",
            "sub": "Rip it back",
            "win": false,
            "id": "counter_net_rusher:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          130,
          196
        ],
        "oppStart": [
          70,
          136
        ],
        "oppEnd": [
          70,
          136
        ],
        "shots": [
          {
            "from": [
              130,
              196
            ],
            "to": [
              100,
              50
            ],
            "bend": 0,
            "color": "#5bba6f",
            "snd": "slice",
            "payoff": true,
            "label": "BLOCK DEEP",
            "intent": "deep",
            "contactType": "slice"
          }
        ]
      },
      "winTitle": "Survived it.",
      "winTxt": "Threading a set volleyer left you exposed — so don't gamble again. A block <b>deep</b> and central buys time to recover. The lesson stands: when they're tight to the net covering the corners, the body beats the line; the fine pass is the low-percentage option.",
      "mid": {
        "youStart": [
          130,
          196
        ],
        "oppStart": [
          70,
          136
        ],
        "oppEnd": [
          70,
          136
        ],
        "shots": [
          {
            "from": [
              130,
              196
            ],
            "to": [
              46,
              54
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "STRETCH WINNER",
            "intent": "risk",
            "miss": "wide",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Just wide.",
      "midTxt": "The sharper counter misses while you are stretched. A deeper block asks the opponent to play another ball while you recover. The body target was an earlier option, not a universal passing rule."
    }
  },
  {
    "id": "two_breaks_up",
    "title": "Two Breaks Up",
    "opp": "<b>You're two breaks up.</b> The finish line is in sight and your brain quietly switches from 'win it' to 'don't lose it.' That switch is how leads evaporate.",
    "d1": {
      "sit": "Two breaks up, cruising. A short ball floats up — the exact ball you've drilled all match. But the scoreboard whispers: play safe, protect the lead, don't miss.",
      "q": "How do you play the short ball?",
      "opts": [
        {
          "lbl": "Attack it — keep doing what's working",
          "sub": "Close the door",
          "br": "A"
        },
        {
          "lbl": "Play safe — just get it back deep",
          "sub": "Reduce pace and retain a central target",
          "br": "B"
        }
      ],
      "court": {
        "shots": [],
        "sitter": [
          100,
          220
        ],
        "youStart": [
          100,
          220
        ],
        "oppStart": [
          100,
          40
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          100,
          220
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          60,
          52
        ],
        "shots": [
          {
            "from": [
              100,
              220
            ],
            "to": [
              52,
              50
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "STAY AGGRESSIVE",
            "flightSeconds": 0.56,
            "contactType": "ground"
          },
          {
            "from": [
              52,
              50
            ],
            "to": [
              104,
              196
            ],
            "bend": 8,
            "color": "#e07070",
            "snd": "weak",
            "label": "WEAK REPLY",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          104,
          196
        ]
      },
      "reveal": "You keep doing what built the lead — attacking the short ball, taking time away. They scramble a weak reply back. The lead didn't make you passive; it made you finish.",
      "d2": {
        "sit": "Their weak reply sits up short. They're stranded in the corner, scrambling. Close it out — where?",
        "q": "Finish it — where?",
        "opts": [
          {
            "lbl": "Drive it into the open court",
            "sub": "Shut the door",
            "win": true,
            "id": "two_breaks_up:A:preferred"
          },
          {
            "lbl": "Return a central rally ball with less pace",
            "sub": "Don't miss with the lead",
            "win": false,
            "id": "two_breaks_up:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          104,
          196
        ],
        "oppStart": [
          60,
          52
        ],
        "oppEnd": [
          60,
          52
        ],
        "shots": [
          {
            "from": [
              104,
              196
            ],
            "to": [
              156,
              52
            ],
            "bend": -6,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "OPEN COURT",
            "intent": "space",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Point closed.",
      "winTxt": "Two breaks up is exactly when to keep attacking — a drive into the <b>open</b> court finishes the point the way you built the whole lead. Leads evaporate when you switch from playing to win to playing not to lose. Keep your foot down.",
      "mid": {
        "youStart": [
          104,
          196
        ],
        "oppStart": [
          60,
          52
        ],
        "oppEnd": [
          60,
          52
        ],
        "shots": [
          {
            "from": [
              104,
              196
            ],
            "to": [
              100,
              54
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "SAFE BALL",
            "intent": "reset",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Let them off.",
      "midTxt": "You had them stranded and patted a <b>neutral</b> ball back — the scoreboard made you tentative. Passive tennis with a lead invites the comeback: you hand them a free ball and a foothold. Protect the lead by extending it, not by shrinking."
    },
    "B": {
      "seq": {
        "youStart": [
          100,
          220
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          100,
          40
        ],
        "shots": [
          {
            "from": [
              100,
              220
            ],
            "to": [
              100,
              54
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "weak",
            "label": "SAFE BALL",
            "flightSeconds": 0.86,
            "contactType": "ground"
          },
          {
            "from": [
              100,
              54
            ],
            "to": [
              150,
              206
            ],
            "bend": -8,
            "color": "#e07070",
            "snd": "drive",
            "label": "THEY POUNCE",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          150,
          206
        ]
      },
      "reveal": "Playing safe with a lead feels responsible — but a passive ball is a gift. They step in on the pace-less ball and drive it into the corner. Now you're the one defending, and the momentum just shifted.",
      "d2": {
        "sit": "Your safe ball got attacked and you're pushed wide, defending. What now?",
        "q": "What's the play?",
        "opts": [
          {
            "lbl": "Reset deep and neutral, steady the ship",
            "sub": "Get back to even, refocus",
            "win": true,
            "id": "two_breaks_up:B:preferred"
          },
          {
            "lbl": "Counter down the line from the wide position",
            "sub": "Grab the point back",
            "win": false,
            "id": "two_breaks_up:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          150,
          206
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          100,
          44
        ],
        "shots": [
          {
            "from": [
              150,
              206
            ],
            "to": [
              100,
              54
            ],
            "bend": 0,
            "color": "#5bba6f",
            "snd": "slice",
            "payoff": true,
            "label": "RESET DEEP",
            "intent": "reset",
            "contactType": "slice"
          }
        ]
      },
      "winTitle": "Steadied it.",
      "winTxt": "The passive ball put you here — so stop the bleeding with a <b>neutral</b> reset and get back to even. Then go back to attacking; the lead is still yours if you stop feeding them. Protecting a lead means playing your game, not backing off it.",
      "mid": {
        "youStart": [
          150,
          206
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          100,
          44
        ],
        "shots": [
          {
            "from": [
              150,
              206
            ],
            "to": [
              50,
              56
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "PANIC WINNER",
            "intent": "risk",
            "miss": "wide",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Just wide.",
      "midTxt": "The counter misses from the wide defensive position. The central ball was attacked in this example; it is not proof that every slower ball is passive. Read the contact you now have and rebuild if needed."
    }
  },
  {
    "id": "serving_to_stay",
    "title": "Serving to Stay in the Set",
    "opp": "<b>Serving to stay in the set.</b> Down 4–5, one bad game ends it. The instinct is to play safe and hope — but tentative serving is exactly what they're waiting for.",
    "d1": {
      "sit": "Second serve at 4–5, love–15. Your usual spin serve reaches their backhand high; the softer central serve leaves a comfortable contact. Which intention do you take to the ad-court point?",
      "q": "How do you serve under the gun?",
      "opts": [
        {
          "lbl": "Commit — serve your spot with intent",
          "sub": "Play to win the point",
          "br": "A"
        },
        {
          "lbl": "Take pace off — just get it in",
          "sub": "Safety first, avoid the double",
          "br": "B"
        }
      ],
      "court": {
        "shots": [],
        "sitter": [
          72,
          292
        ],
        "youStart": [
          72,
          292
        ],
        "oppStart": [
          140,
          12
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          72,
          292
        ],
        "oppStart": [
          140,
          12
        ],
        "oppEnd": [
          140,
          30
        ],
        "shots": [
          {
            "from": [
              72,
              292
            ],
            "to": [
              154,
              18
            ],
            "bend": 4,
            "color": "#c8a84b",
            "snd": "serve",
            "label": "SERVE WITH INTENT",
            "bounce": [
              140,
              100
            ],
            "contactType": "serve",
            "serveNumber": 2
          },
          {
            "from": [
              154,
              18
            ],
            "to": [
              104,
              200
            ],
            "bend": 8,
            "color": "#e07070",
            "snd": "weak",
            "label": "WEAK RETURN",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          104,
          200
        ]
      },
      "reveal": "Committing to the serve — placement and intent — denies them the free ball they're hunting. The return floats back weak. Pressure handled by playing to win the point, not to avoid losing it.",
      "d2": {
        "sit": "Their weak return sits up short. They're recovering. Play the +1 — where?",
        "q": "Where's the +1?",
        "opts": [
          {
            "lbl": "Drive it into the open court",
            "sub": "Commit to the finish",
            "win": true,
            "id": "serving_to_stay:A:preferred"
          },
          {
            "lbl": "Guide the next ball centrally with less pace",
            "sub": "Just don't miss",
            "win": false,
            "id": "serving_to_stay:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          104,
          200
        ],
        "oppStart": [
          140,
          30
        ],
        "oppEnd": [
          100,
          120
        ],
        "shots": [
          {
            "from": [
              104,
              200
            ],
            "to": [
              46,
              52
            ],
            "bend": -6,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "OPEN COURT",
            "intent": "space",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Pressure point won.",
      "winTxt": "Under match pressure you committed, and a controlled drive into the <b>open</b> court wins this point. Tentative serving gives the returner a first strike; a trusted target plus a clear +1 keeps the initiative. Intent, not hope.",
      "mid": {
        "youStart": [
          104,
          200
        ],
        "oppStart": [
          140,
          30
        ],
        "oppEnd": [
          100,
          120
        ],
        "shots": [
          {
            "from": [
              104,
              200
            ],
            "to": [
              100,
              54
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "STEERED SAFE",
            "intent": "reset",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Handed it back.",
      "midTxt": "You built the free ball then steered a <b>neutral</b> one back, afraid to miss — and gave a returner smelling the set another life. Tentative on the ball you set up is the choke. Commit to the finish; that's what holds serve when it matters."
    },
    "B": {
      "seq": {
        "youStart": [
          72,
          292
        ],
        "oppStart": [
          140,
          12
        ],
        "oppEnd": [
          115,
          50
        ],
        "shots": [
          {
            "from": [
              72,
              292
            ],
            "to": [
              122,
              54
            ],
            "bend": 2,
            "color": "#c8a84b",
            "snd": "serve",
            "label": "SAFE SERVE",
            "bounce": [
              115,
              120
            ],
            "contactType": "serve",
            "serveNumber": 2
          },
          {
            "from": [
              122,
              54
            ],
            "to": [
              150,
              276
            ],
            "bend": -8,
            "color": "#e07070",
            "snd": "drive",
            "label": "TEED OFF",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          150,
          276
        ]
      },
      "reveal": "Taking pace off to be safe hands a returner exactly what they want — a sitting serve. They step in and tee off, driving the return into the corner. Playing not to lose walked you straight into losing.",
      "d2": {
        "sit": "They crushed your safe serve and you're scrambling wide, on defense in the game you can't drop. What now?",
        "q": "What's the play?",
        "opts": [
          {
            "lbl": "Reset deep, stay in the game",
            "sub": "Survive the point, refocus",
            "win": true,
            "id": "serving_to_stay:B:preferred"
          },
          {
            "lbl": "Counter down the line before recovering",
            "sub": "Big winner, right now",
            "win": false,
            "id": "serving_to_stay:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          150,
          276
        ],
        "oppStart": [
          115,
          50
        ],
        "oppEnd": [
          100,
          44
        ],
        "shots": [
          {
            "from": [
              150,
              276
            ],
            "to": [
              100,
              54
            ],
            "bend": 0,
            "color": "#5bba6f",
            "snd": "slice",
            "payoff": true,
            "label": "RESET DEEP",
            "intent": "reset",
            "contactType": "slice"
          }
        ]
      },
      "winTitle": "Stayed alive.",
      "winTxt": "The safe serve created this — so don't compound it. A deep <b>neutral</b> reset keeps you in the point and the game. Then serve the next one with intent. Under pressure, play to win the point; safety-first serving is the real gamble.",
      "mid": {
        "youStart": [
          150,
          276
        ],
        "oppStart": [
          115,
          50
        ],
        "oppEnd": [
          100,
          44
        ],
        "shots": [
          {
            "from": [
              150,
              276
            ],
            "to": [
              50,
              56
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "GO FOR BROKE",
            "intent": "risk",
            "miss": "wide",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Just wide.",
      "midTxt": "The attempted counter misses while you are scrambling. A softer serve can be useful, but this one allowed the returner to attack. Reset from the actual reply instead of forcing the original plan."
    }
  },
  {
    "id": "tiebreak_first",
    "title": "Tiebreak: First Point",
    "opp": "<b>First point of the tiebreak.</b> It matters, but it is still one point. Start with the highest-trust pattern instead of manufacturing something special for the score.",
    "d1": {
      "sit": "First point of the breaker, a neutral rally. Nerves whisper: hit something big and seize the moment. But the ball is still neutral and both players are balanced.",
      "q": "How do you play the first point?",
      "opts": [
        {
          "lbl": "Play it solid — make them earn it",
          "sub": "Set the tone with consistency",
          "br": "A"
        },
        {
          "lbl": "Force an early winner",
          "sub": "Treat point one as a special case",
          "br": "B"
        }
      ],
      "court": {
        "shots": [],
        "sitter": [
          100,
          256
        ],
        "youStart": [
          100,
          256
        ],
        "oppStart": [
          100,
          40
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          100,
          256
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          80,
          50
        ],
        "shots": [
          {
            "from": [
              100,
              256
            ],
            "to": [
              100,
              48
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "SOLID + DEEP",
            "contactType": "ground"
          },
          {
            "from": [
              100,
              48
            ],
            "to": [
              96,
              194
            ],
            "bend": 6,
            "color": "#e07070",
            "snd": "weak",
            "label": "THEY BLINK",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          96,
          194
        ]
      },
      "reveal": "The deep rally ball is followed by a short reply in this example. We cannot infer nerves from that one ball. What matters now is the changed depth and the opening it creates.",
      "d2": {
        "sit": "Their tentative reply sits up short. Consistency has drawn the error out of them — the real ball has arrived. Finish it — where?",
        "q": "Which target fits this reply?",
        "opts": [
          {
            "lbl": "Now drive the open court",
            "sub": "Cash the pressure in",
            "win": true,
            "id": "tiebreak_first:A:preferred"
          },
          {
            "lbl": "Drive flatter toward the corner line",
            "sub": "Use the narrower line target",
            "win": false,
            "id": "tiebreak_first:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          96,
          194
        ],
        "oppStart": [
          80,
          50
        ],
        "oppEnd": [
          80,
          50
        ],
        "shots": [
          {
            "from": [
              96,
              194
            ],
            "to": [
              156,
              52
            ],
            "bend": -6,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "OPEN COURT",
            "intent": "space",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Opening point won.",
      "winTxt": "The neutral ball did not justify a gamble. Depth made them blink; the short reply then justified a committed drive into the <b>open</b> court. The score did not create the attack ball—the rally did.",
      "mid": {
        "youStart": [
          96,
          194
        ],
        "oppStart": [
          80,
          50
        ],
        "oppEnd": [
          80,
          50
        ],
        "shots": [
          {
            "from": [
              96,
              194
            ],
            "to": [
              46,
              48
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "SPECTACULAR",
            "intent": "risk",
            "miss": "long",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Just long.",
      "midTxt": "You drew the short reply, then handed the point back by chasing a low-margin line nobody required. The steady ball had already done the work; use the large open target when the attack ball arrives."
    },
    "B": {
      "seq": {
        "youStart": [
          100,
          256
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          55,
          52
        ],
        "shots": [
          {
            "from": [
              100,
              256
            ],
            "to": [
              52,
              50
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "EARLY GAMBLE",
            "contactType": "ground"
          },
          {
            "from": [
              52,
              50
            ],
            "to": [
              150,
              208
            ],
            "bend": -10,
            "color": "#e07070",
            "snd": "drive",
            "label": "COUNTERED",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          150,
          208
        ]
      },
      "reveal": "Going big off a neutral ball is a gamble while the opponent is balanced. They read it and counter into the open court; you are scrambling before the opening point has even been decided.",
      "d2": {
        "sit": "Your gamble got countered and you're scrambling wide, already chasing in the breaker. What now?",
        "q": "What's the play?",
        "opts": [
          {
            "lbl": "Reset and steady — it's only point one",
            "sub": "Stop the bleeding, refocus",
            "win": true,
            "id": "tiebreak_first:B:preferred"
          },
          {
            "lbl": "Counter down the line from the stretched contact",
            "sub": "Win it back immediately",
            "win": false,
            "id": "tiebreak_first:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          150,
          208
        ],
        "oppStart": [
          55,
          52
        ],
        "oppEnd": [
          100,
          44
        ],
        "shots": [
          {
            "from": [
              150,
              208
            ],
            "to": [
              100,
              54
            ],
            "bend": 0,
            "color": "#5bba6f",
            "snd": "slice",
            "payoff": true,
            "label": "RESET DEEP",
            "intent": "reset",
            "contactType": "slice"
          }
        ]
      },
      "winTitle": "Steadied.",
      "winTxt": "One loose point isn't the breaker — so reset with a deep <b>neutral</b> ball and steady the arm. The tone you set now is 'I don't panic.' Chase every early point back with another gamble and a tiebreak spirals; one solid ball stops it.",
      "mid": {
        "youStart": [
          150,
          208
        ],
        "oppStart": [
          55,
          52
        ],
        "oppEnd": [
          100,
          44
        ],
        "shots": [
          {
            "from": [
              150,
              208
            ],
            "to": [
              50,
              56
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "GAMBLE AGAIN",
            "intent": "risk",
            "miss": "wide",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Just wide.",
      "midTxt": "The second swing from an off-balance contact lost this opening point. Reset: in this seven-point tiebreak you need at least seven points and a two-point lead, not one spectacular opening shot."
    }
  },
  {
    "id": "return_match_point",
    "title": "Return, Match Point Down",
    "opp": "<b>Match point down, returning.</b> A big first serve leaves little time. The task is not a heroic swing; it is a compact, committed return with enough depth to deny an automatic +1.",
    "d1": {
      "sit": "Match point against you, returning a big first serve. A compact block can be aggressive when it is firm and deep; simply guiding the ball short and central hands the server an easy first strike.",
      "q": "Which return gives you the best chance?",
      "opts": [
        {
          "lbl": "Compact and firm, deep through the middle",
          "sub": "Use their pace and remove the first angle",
          "br": "A"
        },
        {
          "lbl": "Guide it back short and central",
          "sub": "Prioritise contact without depth",
          "br": "B"
        }
      ],
      "court": {
        "shots": [],
        "sitter": [
          100,
          264
        ],
        "youStart": [
          100,
          264
        ],
        "oppStart": [
          100,
          40
        ]
      }
    },
    "A": {
      "seq": {
        "youStart": [
          100,
          264
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          100,
          40
        ],
        "shots": [
          {
            "from": [
              100,
              264
            ],
            "to": [
              100,
              58
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "COMPACT + DEEP",
            "contactType": "ground"
          },
          {
            "from": [
              100,
              58
            ],
            "to": [
              104,
              198
            ],
            "bend": 8,
            "color": "#e07070",
            "snd": "weak",
            "label": "SHORT REPLY",
            "contactType": "ground"
          }
        ],
        "youEnd": [
          104,
          198
        ]
      },
      "reveal": "The compact, deep return uses the serve's pace and takes away the server's easiest angle. Their first ball lands short enough to attack. You have made them play under match-point pressure without over-swinging.",
      "d2": {
        "sit": "Their reply sits up short. The server who was one point from the match has handed you a real attacking ball. Take it — where?",
        "q": "Where's the shot?",
        "opts": [
          {
            "lbl": "Drive it into the open court",
            "sub": "Use the space the short ball exposed",
            "win": true,
            "id": "return_match_point:A:preferred"
          },
          {
            "lbl": "Play safe now — you're back in it",
            "sub": "Don't blow the reprieve",
            "win": false,
            "id": "return_match_point:A:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          104,
          198
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          100,
          120
        ],
        "shots": [
          {
            "from": [
              104,
              198
            ],
            "to": [
              156,
              52
            ],
            "bend": -6,
            "color": "#5bba6f",
            "snd": "drive",
            "payoff": true,
            "label": "OPEN COURT",
            "intent": "space",
            "contactType": "ground"
          }
        ]
      },
      "winTitle": "Match point erased.",
      "winTxt": "The return was compact, not passive: depth removed the easy +1 and created a playable short ball. Now a committed drive into the <b>open</b> court erases match point. Commitment is ball quality, not swing size.",
      "mid": {
        "youStart": [
          104,
          198
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          100,
          120
        ],
        "shots": [
          {
            "from": [
              104,
              198
            ],
            "to": [
              100,
              54
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "PLAY SAFE",
            "intent": "reset",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Reprieve wasted.",
      "midTxt": "The deep return created a genuine short ball, but the neutral reply handed the initiative back. Finish what the compact return started: attack the large open target when the ball quality supports it."
    },
    "B": {
      "seq": {
        "youStart": [
          100,
          264
        ],
        "youEnd": [
          150,
          206
        ],
        "oppStart": [
          100,
          40
        ],
        "oppEnd": [
          100,
          120
        ],
        "shots": [
          {
            "from": [
              100,
              264
            ],
            "to": [
              100,
              120
            ],
            "bend": 0,
            "color": "#c8a84b",
            "snd": "weak",
            "label": "SHORT BLOCK",
            "contactType": "slice"
          },
          {
            "from": [
              100,
              120
            ],
            "to": [
              150,
              206
            ],
            "bend": -8,
            "color": "#e07070",
            "snd": "drive",
            "label": "FIRST STRIKE",
            "contactType": "ground"
          }
        ]
      },
      "reveal": "The guided block lands short and central, so the server steps inside the court and drives into the corner. The problem is not that you blocked; it is that the return lacked depth and target intent.",
      "d2": {
        "sit": "Your short block was attacked and you're scrambling, still match point down. What's the highest-margin way to make them play again?",
        "q": "What's the play?",
        "opts": [
          {
            "lbl": "High, deep reset — live one more ball",
            "sub": "Survive, make them hit again",
            "win": true,
            "id": "return_match_point:B:preferred"
          },
          {
            "lbl": "Drive flatter through the narrower line",
            "sub": "Try to change defence into attack immediately",
            "win": false,
            "id": "return_match_point:B:alternative"
          }
        ]
      },
      "win": {
        "youStart": [
          150,
          206
        ],
        "oppStart": [
          100,
          120
        ],
        "oppEnd": [
          100,
          44
        ],
        "shots": [
          {
            "from": [
              150,
              206
            ],
            "to": [
              100,
              52
            ],
            "bend": 0,
            "color": "#5bba6f",
            "snd": "slice",
            "payoff": true,
            "label": "DEEP LOB",
            "intent": "deep",
            "contactType": "slice"
          }
        ]
      },
      "winTitle": "Still alive.",
      "winTxt": "From full stretch, a high <b>deep</b> reset gives you recovery time and makes the server play another ball under match-point pressure. You have not won yet, but you have replaced panic with a repeatable defensive choice.",
      "mid": {
        "youStart": [
          150,
          206
        ],
        "oppStart": [
          100,
          120
        ],
        "oppEnd": [
          100,
          44
        ],
        "shots": [
          {
            "from": [
              150,
              206
            ],
            "to": [
              52,
              56
            ],
            "bend": 6,
            "color": "#c8a84b",
            "snd": "drive",
            "label": "WILD SWING",
            "intent": "risk",
            "miss": "long",
            "contactType": "ground"
          }
        ]
      },
      "midTitle": "Long — match over.",
      "midTxt": "A wild swing off a full-stretch scramble removes the little margin you still have. The short block created the emergency; the bail-out swing ends it. Return with depth first, and defend with height when balance is gone."
    }
  }
];

  // Launch eligibility is explicit. A newly authored scenario remains
  // unavailable until its ID is deliberately added after content + visual QA.
  const launchIds=Object.freeze([
    'short_ball','serve_plus_one','second_serve','beat_moonballer','big_server',
    'change_direction','passing_shot','defending','break_point_down','serving_for_set',
    'second_serve_big','inside_out_forehand','high_ball_backhand','rally_tolerance','defend_drop',
    'bring_them_in','approach_selection','counter_net_rusher','two_breaks_up','serving_to_stay',
    'tiebreak_first','return_match_point'
  ]);
  const targets=Object.freeze({
    short_ball:'decision-making',
    serve_plus_one:'serve-return',
    second_serve:'serve-return',
    beat_moonballer:'movement',
    big_server:'serve-return',
    change_direction:'decision-making',
    passing_shot:'net-play',
    defending:'movement',
    break_point_down:'serve-return',
    serving_for_set:'mental-game',
    second_serve_big:'serve-return',
    inside_out_forehand:'forehand',
    high_ball_backhand:'backhand',
    rally_tolerance:'mental-game',
    defend_drop:'movement',
    bring_them_in:'decision-making',
    approach_selection:'net-play',
    counter_net_rusher:'net-play',
    two_breaks_up:'mental-game',
    serving_to_stay:'mental-game',
    tiebreak_first:'mental-game',
    return_match_point:'serve-return'
  });
  return Object.freeze({
    authoredIntegrityVersion:1,
    continuityReviewedIds:launchIds,
    version:'2026-09-21-trust-repair-5',
    scenarios:Object.freeze(scenarios),
    launchIds,
    targets
  });
});
