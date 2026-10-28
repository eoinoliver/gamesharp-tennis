"""The app's lesson catalogue: daily order, slug, data prefix, card line.
Order is the daily order for a new player. Predict the Point is its own mode, not part of the daily run."""
DAILY = [
    ('serve-plus-one', 'serve', 'Read the reply your serve creates, then use the space.'),
    ('short-ball', 'short', 'Short isn\'t enough. Height, balance and their position earn the attack.'),
    ('the-line', 'line', 'The open line is tempting. When is it actually on?'),
    ('the-winner', 'winner', 'One winner proves little. Compare the margin in each choice.'),
    ('recovery', 'rc', 'Where you recover decides whether you reach their reply.'),
    ('open-court', 'fs', 'Play the defender’s movement, not the empty space.'),
    ('forehand-bill', 'fb', 'A run-around forehand has to pay for the way back.'),
    ('the-lead', 'pp', 'Ahead? Keep the depth that built the lead.'),
    ('split-step', 'ss', 'Land for their hit, not before it.'),
    ('approach-volley', 'av', 'A deep approach builds an easy volley.'),
    ('middle-return', 'mr', 'Deep through the middle takes the server’s weapon away.'),
    ('high-ball', 'hb', 'Find the contact, not the height.'),
    ('second-serve', 'sq', 'In is only the beginning.'),
    ('contact-clue', 'cp', 'Check the space at contact first.'),
    ('running-around', 'ra', 'Earn the forehand. Cover its cost.'),
    ('net-rusher', 'nr', 'They come in. Where they stop decides: at their feet, or over them.'),   # legacy content (authored volley rule)
    ('pass-where-they-arent', 'pa', 'At the net they cover one side. Pass the side they left.'),   # legacy content (authored volley rule)
    ('late-is-the-culprit', 'lc', 'A repeated miss is a clue. Check the contact before changing the swing.'),   # legacy technique culprit (contact timing on the captured swing)
    ('the-moonballer', 'mb', 'They loop it high and deep. Take their time, then take the net.'),   # opponents (legacy)
    ('the-pusher', 'pu', 'They get everything back. Stop out-waiting them: change the game.'),   # opponents (legacy)
    ('pulled-wide', 'pw', 'Off the court? Buy time first, unless you got there early.'),   # legacy content (authored replies)
    ('serve-away-from-the-lean', 'le', 'The returner leans to cover one serve. Serve the side they left.'),   # legacy seq_014, re-derived by physics (5 Oct)
    ('the-big-hitter', 'bg', 'Their ball comes fast and heavy. Win back your time; keep it out of their zone.'),   # opponents (5 Oct; documented strike-zone rule)
    ('the-lefty', 'lf', 'Your usual patterns land on a lefty\'s forehand. Turn them round.'),   # opponents (5 Oct; mirrored player, documented wing rule)
    ('find-your-return-spot', 'rs', 'Back for the big first serve. In for the kick second serve.'),   # batch 1 (6 Oct)
    ('answer-the-drop', 'ad', 'You got to their drop. Where they go decides your answer.'),   # batch 1 (6 Oct)
    ('attack-the-backhand', 'ab', 'Their backhand is weak and they know it. Move them off it first.'),   # batch 1 (6 Oct; documented wing rule)
    ('down-the-line', 'dl', 'The line is about where they are, not how brave you are.'),   # batch 2 (7 Oct; opponent_model, ten tries)
    ('rushed-out-wide', 'dm', 'Pulled wide? Compare the margin and recovery time each reply gives you.'),   # batch 2 (7 Oct; opponent_model, ten tries)
    ('earned-attack', 'ea', 'Read your arrival before taking the opening.'),
    ('earned-defence', 'ed', 'Your arrival changes the choices a wide ball offers.'),
    ('earned-net', 'en', 'Arrive, read the ball, then decide whether to follow.'),
]
PREDICT = [
    ('predict-the-point', 'pt', 'Call the serve, the +1 and the finish. Then compare with a worked example.'),
    ('predict-second-serve', 'ps', 'Call the return, the approach and the volley. Then compare with a worked example.'),
]

# Play the Point (5 Oct 2026): one branching point; your calls decide what happens next. Its own mode, like Predict.
PLAY = [
    ('live-point-buy-time', 'lp', 'Your reply buys time. Your movement puts it to work.'),
    ('live-point-other-wing', 'lt', 'A new point on the other wing. Read it afresh.'),
    ('saturday-point-1', 'sa', 'One point, built from five of your lessons. Each shot: the one you want to hit, or the one that wins.'),   # weekend point (6 Oct)
    ('saturday-point-2', 'sb', 'A return game at 5-2, built from five more of your lessons. Each shot: the tempting one, or the one that wins.'),
    ('saturday-point-3', 'sc', 'Your serve at 30-40, built from five more of your lessons. Each shot: the tempting one, or the one that wins.'),
    ('saturday-point-4', 'sd', 'One point against a pusher, built from five more of your lessons. Each shot: the tempting one, or the one that wins.'),
    ('saturday-point-5', 'se', 'Break point against a big hitter, built from five more of your lessons. Each shot: the tempting one, or the one that wins.'),
    ('midweek-point-1', 'ma', 'Three shots from three of your lessons. A quick top-up between Saturdays.'),   # 8 Oct: little and often
    ('play-the-point', 'bp', 'Three shots, your calls. Each choice decides what happens next.'),
]

# Flavours: one per lesson, for the taster row on Home and the "more / fewer like this" feedback (30 Sep 2026).
FLAVOURS = [
    ('tactics', 'Court tactics', ['serve-plus-one', 'short-ball', 'the-line', 'the-winner', 'recovery', 'open-court', 'forehand-bill',
                                  'the-lead', 'middle-return', 'high-ball', 'second-serve', 'running-around', 'pulled-wide',
                                  'serve-away-from-the-lean', 'find-your-return-spot', 'attack-the-backhand', 'down-the-line', 'rushed-out-wide', 'earned-attack', 'earned-defence', 'earned-net']),
    ('opponents', 'Opponents', ['the-moonballer', 'the-pusher', 'net-rusher', 'the-big-hitter', 'the-lefty']),
    ('net', 'Net play', ['approach-volley', 'pass-where-they-arent', 'split-step', 'answer-the-drop']),
    ('technique', 'Technique', ['late-is-the-culprit', 'contact-clue']),
    ('predict', 'Predict the Point', ['predict-the-point', 'predict-second-serve']),
    ('play', 'Play the Point', ['live-point-buy-time', 'live-point-other-wing', 'saturday-point-1', 'saturday-point-2', 'saturday-point-3', 'saturday-point-4', 'saturday-point-5', 'midweek-point-1', 'play-the-point']),   # has its own card on Home: not in the taster row
]
