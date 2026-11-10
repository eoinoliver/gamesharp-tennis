"""v2 — young Ryder: cleverer, more surprising metaphors. Visual puns, objects
standing in for tennis situations. Lessons where v1 was already the wit (fan,
receipt, keeper, mirror, traffic light...) carry over unchanged."""
from art_v1 import *
from art_v1 import V1

RED = "#c4573f"

# 1 the return deals you a card -----------------------------------------
def serve_plus_one():
    def card(face_up):
        s = rect(53, 25, 60, 88, DEEP, rx=6) + rect(50, 22, 60, 88, "#efe7d2" if face_up else "#1f4430", rx=6)
        if face_up:
            s += txt(62, 40, "A", 13, INK, 800) + txt(98, 104, "A", 13, INK, 800)
            s += f'<circle cx="80" cy="66" r="13" fill="{GOLD}" stroke="{INK}" stroke-width="1.6"/>'
            s += f'<path d="M69 60 Q80 70 91 60" fill="none" stroke="#efe7d2" stroke-width="1.6"/>'
        else:
            for i in range(5):
                s += line(56, 32 + i * 16, 104, 46 + i * 16, MESH, 4)
            s += rect(50, 22, 60, 88, "none", THEM, 1.6, rx=6)
        return s
    L = card(True) + path("M80 116 L80 148", GOLD, 2.6)
    R = card(False) + path("M118 120 Q150 70 120 30", MUTE, 1.8, arrow=True) + path("M42 30 Q10 70 40 120", MUTE, 1.8)
    return L, R

# 2 below the tape, a wall. above it, a doormat --------------------------
def short_ball():
    L, _ = V1["short-ball"]()
    R = (ground() + figure(30, G, "stand", .55) + ball(54, 99) +
         f'<path d="M96 150 L150 150 L156 158 L90 158 Z" fill="url(#MESH)" stroke="{THEM}" stroke-width="1.6"/>' +
         path("M60 101 L148 144", w=2.8))
    return L, R

# 3 the line is the eye of a needle --------------------------------------
def the_line():
    def needle(threaded):
        s = (f'<path d="M84 18 L88 18 L90 150 L86 158 L82 150 Z" fill="{THEM}"/>'
             f'<ellipse cx="86" cy="34" rx="2" ry="8" fill="{INK}"/>')
        if threaded:
            s += f'<path d="M20 70 C50 40 70 34 86 34 C110 34 130 40 150 20" fill="none" stroke="{GOLD}" stroke-width="2.4"/>'
        else:
            s += f'<path d="M14 118 C40 80 58 60 70 40 M70 40 C74 48 72 60 62 72" fill="none" stroke="{GOLD}" stroke-width="2.2"/>'
            s += f'<circle cx="34" cy="120" r="24" fill="none" stroke="{GOLD}" stroke-width="3" opacity=".9"/>'
            s += path("M14 146 Q34 120 46 104", GOLD, 2, "1 4", arrow=False)
        return s
    return needle(False), needle(True)

# 4 one jackpot vs the piggy bank ----------------------------------------
def the_winner():
    L = (slab(30, 30, 92, 104, RED) + rect(40, 46, 72, 30, "#efe7d2") +
         "".join(txt(52 + i * 24, 69, "7", 18, INK, 800) for i in range(3)) +
         line(122, 60, 138, 40, THEM, 3) + f'<circle cx="138" cy="38" r="6" fill="{THEM}"/>' +
         rect(48, 94, 56, 8, INK) + ball(76, 122, 6))
    R = (f'<ellipse cx="83" cy="99" rx="46" ry="34" fill="{DEEP}"/>'
         f'<ellipse cx="80" cy="96" rx="46" ry="34" fill="#e7a7a0"/>'
         f'<circle cx="120" cy="92" r="11" fill="#e7a7a0" stroke="{INK}" stroke-width="1"/>'
         f'<circle cx="104" cy="84" r="2.5" fill="{INK}"/>'
         + rect(54, 126, 8, 16, "#e7a7a0") + rect(94, 126, 8, 16, "#e7a7a0") +
         rect(68, 62, 22, 4, INK) +
         "".join(ball(79, y, 4.5) for y in (18, 34, 50)))
    return L, R

# 5 their racket is a lighthouse; stay in the beam -----------------------
def recovery():
    def scene(tx, bl, br, yx, yy):
        mid = (bl + br) / 2
        return (f'<path d="M{tx} 30 L{bl} 150 L{br} 150 Z" fill="{GOLD}" opacity=".2"/>' +
                rect(tx - 7, 12, 14, 22, "#efe7d2") + rect(tx - 7, 18, 14, 4, RED) + rect(tx - 9, 8, 18, 5, INK) +
                f'<circle cx="{tx}" cy="26" r="4" fill="{GOLD}"/>' + ground() +
                f'<path d="M{yx-14} {yy} q14 -8 28 0 l-4 6 h-20 z" fill="{YOU}"/>' + line(yx, yy - 2, yx, yy - 22, YOU, 2) +
                f'<path d="M{yx} {yy-22} l12 12 h-12 z" fill="{YOU}"/>')
    return scene(146, 14, 126, 70, 146), scene(80, 16, 144, 80, 152)

# 6 a running player is a train: hit behind it ----------------------------
def open_court():
    def train(x, moving):
        s = ground(0, 160, 132) + line(0, 136, 160, 136, MUTE, 1.2)
        for i in range(3):
            cx = x + i * 30
            s += slab(cx, 104, 26, 26, THEM if i else YOU.replace("a3d2b2", "e5e9db"))
            s += f'<circle cx="{cx+6}" cy="132" r="4" fill="{INK}"/><circle cx="{cx+20}" cy="132" r="4" fill="{INK}"/>'
        if moving:
            s += "".join(line(x - 18, 108 + i * 8, x - 4, 108 + i * 8, THEM, 1.4, op=.5) for i in range(3))
        return s
    L = train(70, True) + path("M140 30 Q80 20 30 96", w=2.6)
    R = train(10, False) + slab(4, 86, 4, 18, MUTE) + path("M40 30 Q110 20 140 96", w=2.6)
    return L, R

# 9 their swing is the starting pistol -----------------------------------
def split_step():
    def pistol(fired):
        s = (f'<path d="M100 26 h40 v10 h-28 l-6 16 h-10 z" fill="{THEM}"/>')
        if fired:
            s += f'<circle cx="148" cy="22" r="7" fill="#efe7d2" opacity=".55"/><circle cx="154" cy="14" r="4" fill="#efe7d2" opacity=".4"/>'
        return s
    L = pistol(True) + ground() + figure(60, 136, "ready", .42) + line(50, 144, 70, 144, MUTE, 1, "2 2")
    R = pistol(True) + ground() + figure(60, 150, "crouch", .46) + path("M74 146 L132 146", YOU, 2.6)
    return L, R

# 10 the approach is a break shot: drive their ball to the cushion -------
def approach_volley():
    def table(obj_y):
        return (slab(20, 12, 120, 140, "#1d5a3a") + rect(20, 12, 120, 140, "none", "#8a6a3a", 6) +
                f'<circle cx="80" cy="{obj_y}" r="8" fill="{THEM}" stroke="{INK}" stroke-width="1.6"/>' +
                f'<circle cx="80" cy="140" r="7" fill="#efe7d2" stroke="{INK}" stroke-width="1.6"/>' +
                path(f"M80 132 L80 {obj_y + 12}", GOLD, 2.2, "2 3"))
    L = table(24) + path("M80 22 L80 14", MUTE, 1.4, arrow=False)
    R = table(84)
    return L, R

# 12 the playable contact is a shelf -------------------------------------
def high_ball():
    def scene(you_x, bx, by, step):
        return (ground() + rect(6, 96, 148, 3, "#8a6a3a") + line(30, 99, 38, 110, "#8a6a3a", 2) +
                line(130, 99, 122, 110, "#8a6a3a", 2) +
                path("M150 24 Q122 40 108 150 Q88 -20 10 150", THEM, 1.4, "2 4", arrow=False) +
                ball(bx, by - 5) + figure(you_x, 150, "ready", .34) + step)
    return (scene(72, 98, 96, path("M46 150 L62 150", YOU, 2.4)),
            scene(22, 22, 96, path("M44 150 L30 150", YOU, 2.4)))

# 13 their comfort zone is an armchair -----------------------------------
def second_serve():
    def chair(x, y):
        return (slab(x, y, 46, 14, "#8a4a3a") + rect(x, y - 30, 10, 30, "#8a4a3a") + rect(x + 36, y - 16, 10, 16, "#8a4a3a") +
                rect(x + 2, y + 14, 4, 10, "#5a2e24") + rect(x + 40, y + 14, 4, 10, "#5a2e24"))
    L = ground() + chair(70, 116) + path("M10 60 Q60 160 100 40", w=2.4) + ball(100, 38)
    R = ground() + chair(70, 52) + path("M10 60 Q20 130 32 140", w=2.4) + ball(34, 142)
    return L, R

# 14 a cramped contact is a phone box ------------------------------------
def contact_clue():
    def booth(w):
        x = 80 - w / 2
        return (slab(x, 22, w, 128, "#a33a2e") + rect(x + 6, 32, w - 12, 112, "#0f2419") +
                figure(x + 22, 144, "stand", .46) + ball(x + w - 18, 92, 5))
    L = booth(54)
    R = booth(112) + path("M118 70 L156 40", GOLD, 1.4, "2 3")
    return L, R

# 16 the net-rusher is a castle --------------------------------------------
def net_rusher():
    def castle(guard_on_wall):
        s = (rect(98, 70, 56, 80, MESH) + "".join(rect(98 + i * 14, 62, 8, 10, MESH) for i in range(4)) +
             f'<path d="M110 150 v-26 a10 10 0 0 1 20 0 v26 z" fill="{DEEP}"/>' +
             f'<path d="M60 150 Q80 142 98 150" fill="#2a6a8a" opacity=".6"/>' + ground())
        if guard_on_wall:
            s += figure(126, 62, "guard", .24, THEM)
        else:
            s += figure(84, 150, "ready", .3, THEM)
        return s
    L = castle(False) + ball(14, 110) + path("M18 106 Q56 80 74 146", w=2.4)
    R = castle(True) + ball(14, 110) + path("M18 106 Q80 -50 158 60", w=2.4, dash="1 5")
    return L, R

# 18 late contact: the chalk outline at the scene --------------------------
def late_culprit():
    def scene(bx, by, crime):
        s = ground()
        s += figure(60, 150, "stand", .62, MUTE if crime else YOU)
        if crime:
            s += f'<circle cx="{bx}" cy="{by}" r="8" fill="none" stroke="#efe7d2" stroke-width="1.6" stroke-dasharray="3 2"/>'
            s += rect(20, 60, 120, 6, GOLD) + "".join(rect(28 + i * 26, 60, 12, 6, INK) for i in range(5))
        else:
            s += ball(bx, by, 5)
        return s
    return scene(62, 106, True), scene(112, 92, False)

# 19 the moonball is a hot-air balloon: catch the basket before it lifts --
def moonballer():
    def balloon(x, y, s=1):
        return (f'<ellipse cx="{x}" cy="{y}" rx="{18*s}" ry="{22*s}" fill="{GOLD}" stroke="{INK}" stroke-width="1.4"/>'
                + line(x - 8 * s, y + 18 * s, x - 5 * s, y + 30 * s, THEM, 1) + line(x + 8 * s, y + 18 * s, x + 5 * s, y + 30 * s, THEM, 1)
                + rect(x - 6 * s, y + 30 * s, 12 * s, 8 * s, "#8a6a3a"))
    L = ground() + balloon(104, 86) + path("M104 70 L104 40", MUTE, 1.4, "2 3") + figure(76, 150, "walk", .4) + path("M54 146 L70 146", YOU, 2.4)
    R = ground() + balloon(120, 118, .8) + figure(60, 150, "walk", .4) + path("M76 146 L104 146", YOU, 2.4)
    return L, R

# 20 the pusher is a chess piece that won't move ---------------------------
def the_pusher():
    def pawn(x, y, col=THEM):
        return (f'<circle cx="{x}" cy="{y-30}" r="9" fill="{col}"/>'
                f'<path d="M{x-8} {y-22} L{x+8} {y-22} L{x+12} {y-4} L{x-12} {y-4} Z" fill="{col}"/>' +
                rect(x - 15, y - 5, 30, 6, col))
    def board():
        return "".join(rect(20 + (i % 4) * 30, 14 + (i // 4) * 34, 30, 34, "#163322" if (i + i // 4) % 2 else "#1f4430") for i in range(16))
    L = board() + pawn(80, 140) + f'<path d="M80 108 Q80 40 80 34" fill="none" stroke="{GOLD}" stroke-width="1.6"/>' + path("M80 100 L80 70", GOLD, 2.2)
    R = board() + pawn(80, 150) + pawn(80, 50, YOU) + path("M80 54 L80 96", YOU, 2.4)
    return L, R

# 22 the returner draws a curtain over one window --------------------------
def serve_lean():
    def scene(cover_left, shot):
        s = (rect(14, 28, 132, 52, MESH) + rect(24, 34, 46, 40, "#0f2419", THEM, 1.4) +
             rect(90, 34, 46, 40, "#0f2419", THEM, 1.4) + txt(47, 24, "WIDE", 8, MUTE) + txt(113, 24, "T", 8, MUTE))
        cx = 24 if cover_left else 90
        s += f'<path d="M{cx} 34 h46 v40 q-12 -6 -23 0 q-11 6 -23 0 z" fill="#a33a2e"/>'
        return s + shot + ball(80, 150, 4)
    L = scene(False, path("M80 146 L48 78", w=2.6))
    R = scene(True, path("M80 146 L112 78", w=2.6))
    return L, R

# 23 the big hitter is a cannon: under it or over it -----------------------
def big_hitter():
    def cannon():
        return (f'<path d="M150 96 L100 84 L100 106 L150 114 Z" fill="{THEM}"/>' +
                f'<circle cx="104" cy="96" r="14" fill="{MESH}" stroke="{INK}" stroke-width="2"/>' +
                f'<circle cx="128" cy="124" r="14" fill="#8a6a3a"/><circle cx="128" cy="124" r="4" fill="{INK}"/>' +
                f'<ellipse cx="96" cy="95" rx="3" ry="9" fill="{INK}"/>' + ground())
    L = cannon() + path("M6 120 Q50 152 96 148", w=2.4) + ball(98, 147)
    R = cannon() + path("M6 120 Q50 -20 120 50", w=2.4) + ball(122, 52)
    return L, R

# 27 the backhand has a guard dog: throw the stick the other way first -----
def attack_the_backhand():
    def dog(x, y):
        return (f'<ellipse cx="{x}" cy="{y}" rx="13" ry="7" fill="{THEM}"/><circle cx="{x+13}" cy="{y-6}" r="6" fill="{THEM}"/>' +
                line(x - 9, y + 4, x - 9, y + 14, THEM, 3) + line(x + 9, y + 4, x + 9, y + 14, THEM, 3) +
                line(x - 13, y - 2, x - 20, y - 8, THEM, 2.4))
    def wall(open_bh):
        return (rect(8, 30, 144, 34, MESH) +
                rect(20, 34, 34, 30, DEEP if open_bh else "#0f2419", THEM, 1.6) + rect(106, 34, 34, 30, "#0f2419", THEM, 1.6) +
                txt(37, 26, "BH", 9, GOLD, 700) + txt(123, 26, "FH", 9, "#b3c7b9", 700))
    L = wall(False) + dog(36, 80) + path("M80 150 Q110 110 124 74", w=2.4) + figure(80, 160, "ready", .26)
    R = wall(True) + dog(118, 80) + path("M80 150 Q50 110 38 70", w=2.6) + figure(80, 160, "ready", .26)
    return L, R

V2 = dict(V1)
V2.update({
    "serve-plus-one": serve_plus_one, "short-ball": short_ball, "the-line": the_line,
    "the-winner": the_winner, "recovery": recovery, "open-court": open_court,
    "split-step": split_step, "approach-volley": approach_volley, "high-ball": high_ball,
    "second-serve": second_serve, "contact-clue": contact_clue, "net-rusher": net_rusher,
    "late-is-the-culprit": late_culprit, "the-moonballer": moonballer, "the-pusher": the_pusher,
    "serve-away-from-the-lean": serve_lean, "the-big-hitter": big_hitter,
    "attack-the-backhand": attack_the_backhand,
})
CHANGED = sorted(set(V2) - set(k for k in V1 if V2[k] is V1[k]))
