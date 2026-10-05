"""The app's lesson catalogue: daily order, slug, data prefix, card line.
Order is the daily order for a new player. Predict the Point is its own mode, not part of the daily run."""
DAILY = [
    ('serve-plus-one', 'serve', 'Read the reply your serve creates, then use the space.'),
    ('short-ball', 'short', 'Short isn\'t enough. Height, balance and their position earn the attack.'),
    ('the-line', 'line', 'The open line is tempting. When is it actually on?'),
    ('the-winner', 'winner', 'One winner proves little. See the same shot hit ten times.'),
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
    ('late-is-the-culprit', 'lc', 'Same miss, same side? It tells you when you hit it.'),   # legacy technique culprit (contact timing on the captured swing)
    ('the-moonballer', 'mb', 'They loop it high and deep. Take their time, then take the net.'),   # opponents (legacy)
    ('the-pusher', 'pu', 'They get everything back. Stop out-waiting them: change the game.'),   # opponents (legacy)
    ('pulled-wide', 'pw', 'Off the court? Buy time first, unless you got there early.'),   # legacy content (authored replies)
    ('serve-away-from-the-lean', 'le', 'The returner leans to cover one serve. Serve the side they left.'),   # legacy seq_014, re-derived by physics (5 Oct)
    ('the-big-hitter', 'bg', 'Their ball comes fast and heavy. Win back your time; keep it out of their zone.'),   # opponents (5 Oct; documented strike-zone rule)
    ('the-lefty', 'lf', 'Your usual patterns land on a lefty\'s forehand. Turn them round.'),   # opponents (5 Oct; mirrored player, documented wing rule)
]
PREDICT = [
    ('predict-the-point', 'pt', 'Call the serve, the +1 and the finish. Then watch your point.'),
    ('predict-second-serve', 'ps', 'Call the return, the approach and the volley. Then watch your point.'),
]

# Play the Point (5 Oct 2026): one branching point; your calls decide what happens next. Its own mode, like Predict.
PLAY = [
    ('play-the-point', 'bp', 'Three shots, your calls. Each choice decides what happens next.'),
]

# Flavours: one per lesson, for the taster row on Home and the "more / fewer like this" feedback (30 Sep 2026).
FLAVOURS = [
    ('tactics', 'Court tactics', ['serve-plus-one', 'short-ball', 'the-line', 'the-winner', 'recovery', 'open-court', 'forehand-bill',
                                  'the-lead', 'middle-return', 'high-ball', 'second-serve', 'running-around', 'pulled-wide',
                                  'serve-away-from-the-lean']),
    ('opponents', 'Opponents', ['the-moonballer', 'the-pusher', 'net-rusher', 'the-big-hitter', 'the-lefty']),
    ('net', 'Net play', ['approach-volley', 'pass-where-they-arent', 'split-step']),
    ('technique', 'Technique', ['late-is-the-culprit', 'contact-clue']),
    ('predict', 'Predict the Point', ['predict-the-point', 'predict-second-serve']),
    ('play', 'Play the Point', ['play-the-point']),   # has its own card on Home: not in the taster row
]
