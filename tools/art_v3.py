"""v3 — old Ryder: the simplest picture that carries the insight.

Rule for every lesson: the two panels are the SAME picture with ONE thing changed,
and that change is the lesson's condition. No court unless the court is the point;
no figure unless the body is the point; nothing decorative. Where v1 or v2 already
met the rule it is kept, otherwise the strongest idea is stripped back here."""
from art_v2 import *
from art_v2 import V2

def big_ball(x, y, r=7):
    return ball(x, y, r)

# 1 the return is a door: open or shut -----------------------------------
def serve_plus_one():
    def door(open_):
        s = slab(40, 14, 80, 136, MESH)
        if open_:
            s += f'<path d="M48 22 L112 22 L112 150 L48 150 Z" fill="{GOLD}"/>'
            s += f'<path d="M48 22 L28 12 L28 160 L48 150 Z" fill="#0f2419" stroke="{THEM}" stroke-width="1.8"/>'
        else:
            s += rect(48, 22, 64, 128, "#0f2419", THEM, 1.8) + f'<circle cx="102" cy="90" r="3.5" fill="{THEM}"/>'
        return s
    return door(True), door(False)

# 2 the net changes size -----------------------------------------------------
def short_ball():
    def scene(net_top, ball_y, shot):
        return (ground(6, 154) +
                f'<rect x="83" y="{net_top+4}" width="14" height="{150-net_top-4}" fill="{DEEP}"/>'
                f'<rect x="79" y="{net_top}" width="14" height="{150-net_top}" fill="url(#MESH)"/>'
                f'<rect x="77" y="{net_top-4}" width="18" height="6" fill="{THEM}"/>' + big_ball(22, ball_y) + shot)
    L = scene(36, 128, path("M28 122 C40 -10 120 -10 146 140", w=2.6, dash="1 5"))
    R = scene(134, 64, path("M30 66 L148 140", w=3))
    return L, R

# 3 the thread: a hoop when you're off balance, the needle when you're set --
def the_line():
    def scene(needle):
        s = path("M6 120 C40 120 50 70 80 70 C110 70 120 70 154 70", GOLD, 2.6, arrow=False)
        if needle:
            s += (f'<path d="M78 8 L82 8 L84 150 L80 160 L76 150 Z" fill="{THEM}"/>'
                  f'<ellipse cx="80" cy="70" rx="2.2" ry="9" fill="{INK}"/>' +
                  path("M6 120 C40 120 50 70 80 70 C110 70 120 70 154 70", GOLD, 2.6, arrow=False))
        else:
            s += f'<circle cx="80" cy="70" r="34" fill="none" stroke="{THEM}" stroke-width="7"/>'
            s += path("M6 120 C40 120 50 70 80 70 C110 70 120 70 154 70", GOLD, 2.6, arrow=False)
        return s
    return scene(False), scene(True)

# 4 one dart in the bull, or ten in the board --------------------------------
def the_winner():
    def board():
        return (f'<circle cx="83" cy="85" r="60" fill="{DEEP}"/>' +
                "".join(f'<circle cx="80" cy="82" r="{r}" fill="{f}" stroke="{INK}" stroke-width="1"/>'
                        for r, f in ((60, "#163322"), (44, "#1f4430"), (28, "#2a5a40"), (6, GOLD))))
    def dart(x, y, col=THEM, op=1):
        return (f'<g opacity="{op}"><line x1="{x}" y1="{y}" x2="{x+12}" y2="{y-12}" stroke="{col}" stroke-width="2.6" stroke-linecap="round"/>'
                f'<path d="M{x+10} {y-14} l7 -2 l-2 7 z" fill="{col}"/></g>')
    misses = [(8, 20), (146, 16), (150, 146), (6, 150), (150, 80), (4, 84), (70, 160), (112, 154), (30, 6)]
    L = board() + "".join(dart(x, y, THEM, .3) for x, y in misses) + dart(80, 82, GOLD)
    hits = [(66, 70), (90, 66), (74, 96), (96, 90), (60, 86), (84, 104), (70, 78), (94, 76), (80, 60), (68, 100)]
    R = board() + "".join(dart(x, y) for x, y in hits)
    return L, R

# 5 their spotlight, and you in the middle of it ----------------------------
def recovery():
    def scene(tx, bl, br, yx):
        return (f'<path d="M{tx} 18 L{bl} 150 L{br} 150 Z" fill="{GOLD}" opacity=".22"/>' +
                f'<circle cx="{tx}" cy="16" r="6" fill="{THEM}"/>' + ground() +
                f'<circle cx="{yx}" cy="146" r="8" fill="{YOU}" stroke="{INK}" stroke-width="2"/>')
    return scene(150, 10, 130, 70), scene(80, 16, 144, 80)

# 6 footprints: still running, or stopped ----------------------------------
def open_court():
    def foot(x, y, rot=0, col=THEM):
        return f'<ellipse cx="{x}" cy="{y}" rx="7" ry="4" fill="{col}" transform="rotate({rot} {x} {y})"/>'
    L = ("".join(foot(20 + i * 22, 110 + (i % 2) * 14, 0, THEM) for i in range(5)) +
         "".join(line(4, 108 + i * 8, 14, 108 + i * 8, THEM, 1.4, op=.4) for i in range(3)) +
         path("M150 40 Q70 20 30 84", w=2.8))
    R = ("".join(foot(20 + i * 22, 110 + (i % 2) * 14, 0, THEM) for i in range(3)) +
         foot(86, 108, 90) + foot(100, 108, 90) +
         path("M70 40 Q130 30 146 96", w=2.8) +
         f'<ellipse cx="144" cy="110" rx="14" ry="5" fill="{GOLD}" opacity=".35"/>')
    return L, R

# 7 the bill: long or short ---------------------------------------------------
def forehand_bill():
    def receipt(h):
        x, w, y = 44, 72, 150 - h
        d = f'M{x} {y} h{w} v{h}' + "".join(f" l{-w/8:.1f} 5 l{-w/8:.1f} -5" for _ in range(4)) + ' Z'
        s = f'<path d="{d}" fill="{DEEP}" transform="translate(3 3)"/><path d="{d}" fill="#efe7d2"/>'
        rows = int((h - 26) / 9)
        for i in range(rows):
            yy = y + 12 + i * 9
            s += line(x + 8, yy, x + w - 22, yy, "#8a8370", 2.4) + line(x + w - 16, yy, x + w - 8, yy, "#8a8370", 2.4)
        s += line(x + w - 26, y + h - 8, x + w - 8, y + h - 8, INK, 3.6)
        return s
    return receipt(150), receipt(46)

# 9 their strike is the starting gun: feet in the air, then planted ---------
def split_step():
    def shoe(x, y, col=YOU):
        return (f'<g transform="translate({x} {y}) scale(1.8)"><path d="M0 0 h20 q6 0 6 -6 h-14 l-6 -6 h-6 z" '
                f'fill="{col}" stroke="{INK}" stroke-width="1"/></g>')
    gun = (f'<path d="M96 22 h44 v10 h-30 l-6 16 h-10 z" fill="{THEM}"/>'
           f'<circle cx="148" cy="20" r="7" fill="#efe7d2" opacity=".55"/>')
    L = gun + ground() + shoe(30, 112) + shoe(84, 112) + f'<ellipse cx="80" cy="152" rx="54" ry="4" fill="{DEEP}"/>'
    R = gun + ground() + shoe(30, 150) + shoe(84, 150) + path("M100 120 L150 120", YOU, 3)
    return L, R

# 12 the shelf: meet it there, stepping in or stepping back -------------------
def high_ball():
    def scene(meet_x, step):
        return (rect(6, 96, 148, 3, "#8a6a3a") + ground() +
                path("M154 24 Q124 40 112 150 Q92 -20 10 150", THEM, 1.4, "2 4", arrow=False) +
                big_ball(meet_x, 90, 7) + step)
    return (scene(100, path("M60 150 L90 150", YOU, 3)),
            scene(22, path("M60 150 L30 150", YOU, 3)))

# 15 the hourglass, nothing else -------------------------------------------
def running_around():
    def glass(full):
        g = (f'<path d="M51 16 h64 l-28 64 l28 64 h-64 l28 -64 z" fill="{DEEP}" transform="translate(3 3)"/>'
             f'<path d="M48 12 h64 l-28 66 l28 66 h-64 l28 -66 z" fill="#163322" stroke="{THEM}" stroke-width="2.6" stroke-linejoin="round"/>'
             f'<rect x="40" y="6" width="80" height="8" fill="{THEM}"/><rect x="40" y="142" width="80" height="8" fill="{THEM}"/>')
        if full:
            g += f'<path d="M54 22 h52 l-23 52 h-6 z" fill="{GOLD}"/>' + line(80, 78, 80, 136, GOLD, 1.6)
            g += f'<path d="M70 142 l10 -10 l10 10 z" fill="{GOLD}"/>'
        else:
            g += f'<path d="M52 142 Q80 96 108 142 z" fill="{GOLD}"/>'
        return g
    return glass(True), glass(False)

# 18 the same swing; only the ball moves --------------------------------------
def late_culprit():
    def scene(bx, by):
        return (ground() + figure(58, 150, "stand", .62) +
                f'<circle cx="112" cy="92" r="15" fill="none" stroke="{GOLD}" stroke-width="2" stroke-dasharray="3 3"/>' +
                big_ball(bx, by, 6))
    return scene(60, 106), scene(112, 92)

# 21 height is hang time: the same arc, spent two ways -----------------------
def pulled_wide():
    arc = path("M16 130 Q86 -70 156 150", GOLD, 2.2, "1 5", arrow=False)
    L = ground() + arc + big_ball(16, 130) + figure(16, 150, "stumble", .3)
    R = ground() + arc + big_ball(86, 32) + figure(70, 150, "walk", .3) + path("M30 144 L58 144", YOU, 2.6)
    return L, R

# 26 arrive, then look -------------------------------------------------------
def answer_drop():
    def eye(open_):
        s = f'<path d="M20 82 Q80 30 140 82 Q80 134 20 82 Z" fill="{"#efe7d2" if open_ else "#163322"}" stroke="{THEM}" stroke-width="3"/>'
        if open_:
            s += f'<circle cx="80" cy="82" r="20" fill="{MESH}"/><circle cx="80" cy="82" r="9" fill="{INK}"/>'
            s += f'<circle cx="86" cy="76" r="4" fill="#efe7d2"/>'
        else:
            s += f'<path d="M20 82 Q80 112 140 82" fill="none" stroke="{THEM}" stroke-width="3"/>'
            s += "".join(line(40 + i * 20, 96 + (2 if i in (1, 2) else 0), 36 + i * 20, 108, THEM, 2) for i in range(5))
        return s
    planted = (ground(20, 140) + f'<g transform="translate(36 150) scale(3.4)"><path d="M0 0 h20 q6 0 6 -6 h-14 l-6 -6 h-6 z" '
               f'fill="{YOU}" stroke="{INK}" stroke-width=".6"/></g>' +
               "".join(line(24 - i * 6, 132 + i * 6, 4 - i * 6, 132 + i * 6, MUTE, 1.6) for i in range(3)))
    return planted, eye(True)

V3 = dict(V2)
V3.update({
    "serve-plus-one": serve_plus_one, "short-ball": short_ball, "the-line": the_line,
    "the-winner": the_winner, "recovery": recovery, "open-court": open_court,
    "forehand-bill": forehand_bill, "split-step": split_step, "high-ball": high_ball,
    "running-around": running_around, "late-is-the-culprit": late_culprit,
    "pulled-wide": pulled_wide, "answer-the-drop": answer_drop,
})
