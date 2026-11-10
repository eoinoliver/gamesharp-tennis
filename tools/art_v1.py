"""v1: first-pass metaphors for all 32 Daily lessons (8 live in editorial_art.V1)."""
from editorial_art import *
from editorial_art import V1 as BASE

def txt(x, y, s, size=9, col=MUTE, w=600, anchor="middle"):
    return (f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{size}" font-weight="{w}" '
            f'fill="{col}" letter-spacing=".5">{s}</text>')

def rect(x, y, w, h, fill, stroke=None, sw=1.6, op=1, rx=0):
    st = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" opacity="{op}"{st}/>'

def slab(x, y, w, h, fill, dx=3):
    """Filled block with the flat print shadow."""
    return rect(x + dx, y + dx, w, h, DEEP) + rect(x, y, w, h, fill)

def half_court(y_net=20, y_base=150):
    """Top-down: their half above, net at the top edge of view."""
    return (rect(22, y_net, 116, y_base - y_net, "none", MUTE, 1.2, .7) +
            line(22, y_net, 138, y_net, THEM, 2.4))

# 1 ------------------------------------------------------------------
def serve_plus_one():
    # The return is a door: short and it swings open; deep and it stays shut.
    def door(open_):
        s = slab(44, 20, 72, 126, MESH)
        if open_:
            s += f'<path d="M50 26 L110 26 L110 146 L50 146 Z" fill="{GOLD}" opacity=".85"/>'
            s += f'<path d="M50 26 L32 18 L32 154 L50 146 Z" fill="#0f2419" stroke="{THEM}" stroke-width="1.6"/>'
            s += path("M80 158 L80 70", INK, 3)
        else:
            s += rect(50, 26, 60, 120, "#0f2419", THEM, 1.6)
            s += f'<circle cx="100" cy="88" r="3" fill="{THEM}"/>'
            s += path("M24 150 C10 -10 150 -10 140 150", GOLD, 2.2, "1 5")
        return s
    return door(True), door(False)

# 6 ------------------------------------------------------------------
def open_court():
    # A running player is a one-way street. Hit against the arrow.
    def sign(x, y):
        return (line(x, y, x, y + 46, MUTE, 3) + slab(x - 28, y - 14, 56, 18, THEM) +
                f'<path d="M{x-20} {y-5} H{x+12}" stroke="{INK}" stroke-width="4"/>'
                f'<path d="M{x+10} {y-11} L{x+20} {y-5} L{x+10} {y+1} Z" fill="{INK}"/>')
    L = (ground() + sign(110, 40) + figure(100, 150, "walk", .34, THEM) +
         path("M70 120 L106 120", THEM, 1.4, "3 3", arrow=False) +
         path("M150 80 Q80 40 26 112", w=2.6))
    R = (ground() + figure(60, 150, "ready", .34, THEM) + path("M20 70 Q90 40 140 116", w=2.6) +
         f'<ellipse cx="128" cy="140" rx="20" ry="5" fill="{GOLD}" opacity=".3"/>')
    return L, R

# 8 ------------------------------------------------------------------
def the_lead():
    # Same depth mark at any score; under pressure, lift to reach it.
    def scene(score, arc):
        return (ground(6, 154, 150) +
                f'<rect x="118" y="146" width="22" height="8" fill="{GOLD}" opacity=".9"/>' +
                slab(14, 18, 54, 28, INK) + txt(41, 38, score, 15, THEM, 800) +
                ball(22, 124) + arc)
    L = scene("5–2", path("M26 120 Q80 70 128 144", w=2.6))
    R = scene("5–4", path("M26 120 Q74 -30 128 144", w=2.6, dash="1 5"))
    return L, R

# 9 ------------------------------------------------------------------
def split_step():
    # Their swing is the skipping rope: jump as it turns, land as it passes.
    def rope(y_top, feet_y, pose, push=False):
        s = (ground() + line(16, 40, 16, 150, MUTE, 2) + line(144, 40, 144, 150, MUTE, 2) +
             f'<path d="M16 44 Q80 {y_top} 144 44" fill="none" stroke="{GOLD}" stroke-width="2.6"/>' +
             figure(80, feet_y, pose, .4))
        if push:
            s += path("M92 146 L128 146", YOU, 2.4)
        return s
    return rope(-6, 136, "ready"), rope(164, 150, "crouch", True)

# 10 -----------------------------------------------------------------
def approach_volley():
    # Depth decides where they get to swing from.
    def scene(land_y, them_y, deep):
        return (half_court() +
                (f'<rect x="22" y="128" width="116" height="22" fill="{GOLD}" opacity=".18"/>' if deep else "") +
                path(f"M80 18 L{90} {land_y}", w=2.4, dash="1 5") + ball(90, land_y, 4) +
                dot_person(70, them_y, THEM, 6) +
                path(f"M70 {them_y-8} L70 {them_y-22}", THEM, 1.6, "2 3") )
    L = scene(140, 160 - 2, True)
    R = scene(92, 104, False)
    return L, R

# 12 -----------------------------------------------------------------
def high_ball():
    # Find the floor where the bounce is playable.
    def scene(you_x, meet, step):
        s = (ground() + f'<rect x="6" y="88" width="148" height="26" fill="{GOLD}" opacity=".16"/>' +
             path("M150 20 Q120 40 100 150 Q80 -10 6 150", THEM, 1.6, "2 4", arrow=False) +
             ball(*meet) + figure(you_x, 150, "ready", .34) + step)
        return s
    L = scene(70, (88, 104), path("M46 150 L60 150", YOU, 2.4))
    R = scene(22, (18, 100), path("M44 150 L30 150", YOU, 2.4))
    return L, R

# 13 -----------------------------------------------------------------
def second_serve():
    # Their comfortable zone is a box. Kick over it, or move away from it.
    def scene(box_y, ball_xy, shot):
        return (ground() + figure(46, 150, "stand", .5, THEM) +
                rect(58, box_y, 46, 34, GOLD, None, op=.2) + rect(58, box_y, 46, 34, "none", GOLD, 1.4) +
                shot + ball(*ball_xy))
    L = scene(78, (88, 52), path("M150 120 Q120 30 92 48", w=2.4))
    R = scene(46, (140, 110), path("M150 40 Q148 80 142 104", w=2.4))
    return L, R

# 14 -----------------------------------------------------------------
def contact_clue():
    # Elbow room: is the ball jammed into you, or is there space?
    def scene(ball_x, magnify):
        s = (ground() + figure(56, 150, "stand", .62) + ball(ball_x, 94, 6))
        s += line(70, 70, 70, 120, MUTE, 1, "2 3") + line(ball_x, 70, ball_x, 120, MUTE, 1, "2 3")
        if magnify:
            s += (f'<circle cx="124" cy="40" r="15" fill="none" stroke="{THEM}" stroke-width="3"/>'
                  + line(135, 51, 148, 64, THEM, 4) + f'<circle cx="124" cy="40" r="4" fill="{GOLD}"/>')
        return s
    return scene(78, False), scene(112, True)

# 16 -----------------------------------------------------------------
def net_rusher():
    # How close did they get? Under them, or over them.
    def scene(them_x, shot):
        return (ground() + rect(118, 112, 5, 38, THEM) + rect(116, 108, 9, 5, THEM) +
                figure(them_x, 150, "ready", .42, THEM, flip=True) + ball(18, 116) + shot)
    L = scene(78, path("M22 112 Q60 82 76 146", w=2.4))
    R = scene(104, path("M22 112 Q70 -40 150 140", w=2.4, dash="1 5"))
    return L, R

# 17 -----------------------------------------------------------------
def pass_where():
    # The net player is a keeper. Shoot the post they leave.
    def goal(keeper_x, shot):
        return (rect(16, 24, 128, 4, THEM) + rect(16, 24, 4, 50, THEM) + rect(140, 24, 4, 50, THEM) +
                rect(20, 28, 120, 46, "url(#MESH)") + figure(keeper_x, 76, "guard", .3, THEM) + shot +
                figure(80, 158, "stand", .3))
    L = goal(118, path("M84 116 L38 54", w=2.6))
    R = goal(42, path("M84 116 L126 54", w=2.6))
    return L, R

# 18 -----------------------------------------------------------------
def late_culprit():
    # The magnifying glass finds the culprit: contact beside the hip.
    def scene(ball_xy, culprit):
        bx, by = ball_xy
        s = ground() + figure(58, 150, "stand", .62) + ball(bx, by, 5)
        col = "#b5513a" if culprit else GOLD
        s += f'<circle cx="{bx}" cy="{by}" r="19" fill="none" stroke="{col}" stroke-width="3"/>'
        s += line(bx + 13, by + 13, bx + 26, by + 26, col, 5)
        return s
    return scene((60, 104), True), scene((112, 92), False)

# 19 -----------------------------------------------------------------
def moonballer():
    # Take the moonball on the way up; follow a short reply in.
    def scene(meet, you_x, extra=""):
        return (ground() + path("M150 30 Q120 30 110 150 Q90 -60 10 150", THEM, 1.4, "2 4", arrow=False) +
                ball(*meet) + figure(you_x, 150, "ready", .34) + extra)
    L = scene((96, 108), 82, path("M60 150 L74 150", YOU, 2.4))
    R = (ground() + rect(150, 112, 4, 38, THEM) + ball(110, 140) +
         figure(70, 150, "walk", .36) + path("M84 140 L132 140", YOU, 2.4) + path("M24 80 Q60 60 100 84", MUTE, 1.2, "2 4", arrow=False))
    return L, R

# 20 -----------------------------------------------------------------
def the_pusher():
    # The pusher is a statue on the baseline. Make the statue move.
    def statue(y):
        return (slab(66, y + 32, 28, 12, MESH) + figure(80, y + 32, "guard", .26, THEM))
    L = (half_court() + statue(110) + path("M80 30 Q80 40 100 40", GOLD, 2, arrow=False) +
         ball(102, 40, 4) + path("M80 108 L80 62", THEM, 1.6, "2 3"))
    R = (half_court() + statue(110) + path("M96 18 L104 136", w=2.4) + ball(104, 136, 4) +
         figure(80, 32, "walk", .26) + path("M80 22 L80 4", YOU, 1.8, arrow=False))
    return L, R

# 21 -----------------------------------------------------------------
def pulled_wide():
    # Height is hang time. Spend it running back.
    L = (ground() + figure(20, 150, "stumble", .38) +
         path("M30 124 Q90 -60 152 150", w=2.4, dash="1 5") +
         f'<path d="M78 16 Q94 0 110 16 Z" fill="{THEM}"/>' + line(80, 16, 92, 34, THEM, 1) +
         line(108, 16, 96, 34, THEM, 1) + ball(94, 36, 4))
    R = (ground() + path("M10 40 Q90 -60 152 150", GOLD, 1.4, "1 5", arrow=False) +
         figure(94, 150, "walk", .38) + path("M30 144 L76 144", YOU, 2.4) +
         f'<rect x="72" y="146" width="40" height="8" fill="{MESH}"/>')
    return L, R

# 22 -----------------------------------------------------------------
def serve_lean():
    # The returner stands in front of one window. Serve through the other.
    def scene(them_x, shot):
        return (rect(14, 28, 132, 40, MESH) +
                rect(24, 34, 46, 30, "#0f2419", THEM, 1.4) + rect(90, 34, 46, 30, "#0f2419", THEM, 1.4) +
                txt(47, 24, "WIDE", 8, MUTE) + txt(113, 24, "T", 8, MUTE) +
                figure(them_x, 98, "ready", .26, THEM) + shot + ball(80, 150, 4))
    L = scene(113, path("M80 146 L48 66", w=2.6))
    R = scene(47, path("M80 146 L112 66", w=2.6))
    return L, R

# 23 -----------------------------------------------------------------
def big_hitter():
    # Their power lives in a box. Keep the ball out of it.
    def scene(ball_y, shot):
        return (ground() + figure(110, 150, "stand", .5, THEM, flip=True) +
                rect(48, 70, 46, 48, GOLD, None, op=.18) + rect(48, 70, 46, 48, "none", GOLD, 1.4) +
                shot + ball(70, ball_y))
    L = scene(136, path("M6 110 Q40 132 64 136", w=2.4))
    R = scene(40, path("M6 110 Q30 10 64 40", w=2.4))
    return L, R

# 24 -----------------------------------------------------------------
def the_lefty():
    # A mirror: the backhand you expect has swapped sides.
    def scene(shot):
        s = (rect(78, 14, 4, 140, THEM) +
             figure(40, 140, "stand", .4, MUTE, flip=True) + figure(120, 140, "stand", .4, THEM) +
             txt(20, 30, "BH", 9, MUTE) + txt(140, 30, "BH", 9, GOLD))
        return s + shot
    L = scene(path("M140 40 L150 70", GOLD, 2, arrow=False) + f'<circle cx="140" cy="66" r="20" fill="none" stroke="{GOLD}" stroke-width="2"/>')
    R = scene(path("M150 150 Q120 130 104 102", w=2.4) + txt(102, 92, "FH", 9, "#b5513a"))
    return L, R

# 25 -----------------------------------------------------------------
def return_spot():
    # The serve sets the dial: back for power, in for kick.
    def dial(pos):
        y = {"back": 128, "in": 52}[pos]
        return (rect(74, 30, 12, 112, MESH, rx=6) + line(60, 82, 100, 82, THEM, 2) +
                txt(110, 85, "BASELINE", 7, MUTE, anchor="start") +
                f'<circle cx="80" cy="{y}" r="11" fill="{YOU}" stroke="{INK}" stroke-width="2"/>' +
                path(f"M80 {82 + (14 if pos=='back' else -14)} L80 {y + (-14 if pos=='back' else 14)}", YOU, 2))
    return dial("back"), dial("in")

# 26 -----------------------------------------------------------------
def answer_drop():
    # First arrive. Then lift your eyes.
    L = (ground() + rect(118, 112, 5, 38, THEM) + ball(106, 146, 4) +
         figure(86, 150, "crouch", .44) + path("M20 140 L58 140", YOU, 2.4))
    R = (ground() + rect(118, 112, 5, 38, THEM) + figure(86, 150, "stand", .44) +
         path("M90 98 L150 60", GOLD, 1.6, "2 4") + dot_person(150, 56, THEM, 5))
    return L, R

# 28 -----------------------------------------------------------------
def down_the_line():
    # A traffic light on the line.
    def light(on):
        cols = {"green": ("#2b3b30", "#2b3b30", "#7fd19b"), "red": ("#d0644b", "#2b3b30", "#2b3b30")}[on]
        s = slab(58, 18, 44, 104, INK) + line(80, 122, 80, 150, MUTE, 4) + ground(40, 120)
        for i, c in enumerate(cols):
            s += f'<circle cx="80" cy="{38 + i*32}" r="11" fill="{c}"/>'
        return s
    L = light("green") + path("M126 150 L126 40", GOLD, 2.4)
    R = light("red") + path("M126 150 L126 96", MUTE, 1.6, "2 3", arrow=False) + path("M126 150 L20 40", GOLD, 2.4)
    return L, R

# 29 -----------------------------------------------------------------
def rushed_wide():
    # From wide, aim at the big board.
    def scene(from_x):
        return (f'<circle cx="83" cy="53" r="38" fill="{DEEP}"/><circle cx="80" cy="50" r="38" fill="{GOLD}"/>'
                f'<circle cx="80" cy="50" r="22" fill="none" stroke="{INK}" stroke-width="2"/>'
                f'<circle cx="{150 if from_x<80 else 10}" cy="40" r="5" fill="none" stroke="{MUTE}" stroke-width="1.4"/>' +
                figure(from_x, 150, "stumble", .36, flip=from_x > 80) +
                path(f"M{from_x + (12 if from_x<80 else -12)} 116 L80 64", INK if False else THEM, 2.4))
    return scene(24), scene(136)

# 30 -----------------------------------------------------------------
def earned_attack():
    # An open goal needs someone on their feet.
    def scene(pose, x, shot):
        return (rect(110, 60, 4, 90, THEM) + rect(110, 58, 44, 4, THEM) + rect(114, 62, 40, 88, GOLD, op=.15) +
                ground() + figure(x, 150, pose, .42) + shot)
    L = scene("stand", 50, path("M66 108 L134 110", w=2.8))
    R = scene("stumble", 46, path("M60 120 Q90 20 140 140", w=2.2, dash="1 5"))
    return L, R

# 31 -----------------------------------------------------------------
def earned_defence():
    # Height and depth feed the meter: time to get back.
    def meter(fill_h, extra):
        return (line(80, 92, 80, 150, MUTE, 4) + ground(40, 120) + slab(56, 20, 48, 72, INK) +
                rect(64, 30, 32, 40, "#0f2419") + rect(64, 70 - fill_h, 32, fill_h, GOLD) + extra)
    L = meter(36, path("M20 60 Q34 -10 58 40", w=2.2, dash="1 5") + ball(18, 64, 4))
    R = meter(14, figure(132, 150, "ready", .3) + path("M128 104 Q140 90 150 96", MUTE, 1.4, "2 3"))
    return L, R

# 32 -----------------------------------------------------------------
def earned_net():
    # Reaching the ball isn't reaching the summit. Plant the flag when you can.
    def scene(flag_x, pose, you_x):
        hill = f'<path d="M0 150 L80 46 L160 150 Z" fill="{MESH}"/>'
        flag = (line(flag_x, 150 if flag_x < 80 else 46, flag_x, (150 if flag_x < 80 else 46) - 34, THEM, 2) +
                f'<path d="M{flag_x} {(150 if flag_x < 80 else 46) - 34} l18 6 l-18 6 z" fill="{GOLD}"/>')
        return hill + ground() + flag + figure(you_x, 150 if pose != "stand" else 46, pose, .3)
    L = scene(80, "stand", 70)
    R = scene(28, "stumble", 46)
    return L, R

V1 = dict(BASE)
V1.update({
    "serve-plus-one": serve_plus_one, "open-court": open_court, "the-lead": the_lead,
    "split-step": split_step, "approach-volley": approach_volley, "high-ball": high_ball,
    "second-serve": second_serve, "contact-clue": contact_clue, "net-rusher": net_rusher,
    "pass-where-they-arent": pass_where, "late-is-the-culprit": late_culprit,
    "the-moonballer": moonballer, "the-pusher": the_pusher, "pulled-wide": pulled_wide,
    "serve-away-from-the-lean": serve_lean, "the-big-hitter": big_hitter, "the-lefty": the_lefty,
    "find-your-return-spot": return_spot, "answer-the-drop": answer_drop,
    "down-the-line": down_the_line, "rushed-out-wide": rushed_wide, "earned-attack": earned_attack,
    "earned-defence": earned_defence, "earned-net": earned_net,
})
