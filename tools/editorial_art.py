"""Editorial takeaway art: one visual metaphor per Daily lesson, drawn in two states.

Each lesson's two takeaway panels keep their authored condition/action labels.
This kit only supplies the drawing for each panel (160x164 viewBox, transparent),
so the metaphor has to read without words. Output: app_src/takeaway-art/<slug>.json
holding the two panel SVG bodies, plus a review sheet.

Palette follows takeaways.css: YOU = mint, THEM = cream, ball/decision = gold.
"""
import json, math, os, sys

W, H, G = 160, 164, 150          # panel size and ground line
YOU, THEM, GOLD = "#a3d2b2", "#e5e9db", "#ddc36d"
INK, MUTE, DEEP = "#10271b", "#7e9f89", "#06110b"
MESH = "#3d5e4a"

# ---------------------------------------------------------------- primitives

def ball(x, y, r=4.5, fill=GOLD):
    return f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{fill}" stroke="{INK}" stroke-width="1.2"/>'

def path(d, stroke=GOLD, w=2.2, dash=None, arrow=True, op=1):
    da = f' stroke-dasharray="{dash}"' if dash else ""
    m = ' marker-end="url(#ARR)"' if arrow else ""
    return (f'<path d="{d}" fill="none" stroke="{stroke}" stroke-width="{w}" '
            f'stroke-linecap="round" stroke-linejoin="round" opacity="{op}"{da}{m}/>')

def line(x1, y1, x2, y2, stroke=MUTE, w=1.2, dash=None, op=1):
    da = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{w}" opacity="{op}"{da}/>'

def ground(x1=6, x2=154, y=G):
    return line(x1, y, x2, y, MUTE, 1.2, op=.7)

def shadowed(shape_fn, dx=3, dy=3):
    """Flat print-style offset shadow behind a filled shape."""
    return shape_fn(DEEP, dx, dy) + shape_fn(None, 0, 0)

# Figures are authored at ~115px tall with feet at (0,0), then scaled.
POSES = {
    "stand": dict(head=(-3, -115), torso=((-2, -102), (1, -59)),
                  limbs=["M-4 -60 L-9 -30 L-12 0", "M5 -60 L16 -30 L20 0",
                         "M-5 -96 L-22 -78", "M3 -97 L20 -92 L28 -90"],
                  racket=(38, -90, 75)),
    "crouch": dict(head=(-11, -91), torso=((-8, -80), (0, -46)),
                   limbs=["M-8 -48 L-16 -25 L-11 0", "M3 -47 L21 -28 L19 0",
                          "M-5 -74 L-19 -56", "M-3 -74 L13 -50 L23 -40"],
                   racket=(31, -31, -35)),
    "ready": dict(head=(0, -108), torso=((0, -96), (0, -56)),
                  limbs=["M-3 -56 L-14 -28 L-16 0", "M3 -56 L14 -28 L16 0",
                         "M-2 -90 L-14 -70 L0 -64", "M2 -90 L12 -70 L0 -64"],
                  racket=(0, -54, 0)),
    "walk": dict(head=(0, -113), torso=((0, -100), (0, -58)),
                 limbs=["M-2 -58 L-10 -29 L-15 0", "M2 -58 L9 -29 L15 0",
                        "M-2 -94 L-12 -72", "M2 -94 L13 -72"], racket=None),
    "pole": dict(head=(0, -113), torso=((0, -100), (0, -58)),
                 limbs=["M-2 -58 L-6 -29 L-6 0", "M2 -58 L6 -29 L6 0",
                        "M-2 -94 L-20 -86", "M2 -94 L20 -86", "M-56 -88 L56 -88"],
                 racket=None),
    "stumble": dict(head=(14, -98), torso=((10, -88), (0, -50)),
                    limbs=["M-2 -50 L-18 -30 L-24 -6", "M2 -50 L14 -26 L22 0",
                           "M8 -82 L-12 -96", "M10 -82 L30 -70"], racket=None),
    "guard": dict(head=(0, -113), torso=((0, -100), (0, -58)),
                  limbs=["M-3 -58 L-16 -29 L-20 0", "M3 -58 L16 -29 L20 0",
                         "M-2 -94 L-26 -84", "M2 -94 L26 -84"], racket=None),
}

def figure(x, y, pose="stand", s=0.5, col=YOU, flip=False):
    p = POSES[pose]
    sx = -s if flip else s
    t = f'translate({x} {y}) scale({sx:.3f} {s:.3f})'
    out = [f'<g transform="{t}" stroke="{col}" stroke-linecap="round" stroke-linejoin="round" fill="none">']
    (a, b), (c, d) = p["torso"]
    out.append(f'<path d="M{a} {b} L{c} {d}" stroke-width="13"/>')
    for l in p["limbs"]:
        out.append(f'<path d="{l}" stroke-width="{3 if "M-52" in l else 7}"/>')
    if p["racket"]:
        rx, ry, rot = p["racket"]
        out.append(f'<ellipse cx="{rx}" cy="{ry}" rx="7" ry="11" transform="rotate({rot} {rx} {ry})" stroke-width="3"/>')
    hx, hy = p["head"]
    out.append(f'<circle cx="{hx}" cy="{hy}" r="9" fill="{col}" stroke="none"/>')
    out.append('</g>')
    return "".join(out)

def dot_person(x, y, col=THEM, r=5):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{col}" stroke="{INK}" stroke-width="1.6"/>'

# ---------------------------------------------------------------- lessons
# Each returns (left_body, right_body). Concept notes live in the brief.

def short_ball():
    # Below the tape the net is a wall; above it, a kerb.
    L = (ground() +
         f'<rect x="104" y="40" width="16" height="110" fill="{DEEP}"/>'
         f'<rect x="99" y="34" width="16" height="116" fill="url(#MESH)"/>'
         f'<rect x="97" y="30" width="20" height="6" fill="{THEM}"/>' +
         figure(34, G, "crouch", .55) + ball(52, 128) +
         path("M55 124 C64 -6 118 -18 146 112", dash="1 5"))
    R = (ground() +
         f'<rect x="128" y="133" width="12" height="17" fill="{DEEP}"/>'
         f'<rect x="125" y="130" width="12" height="20" fill="url(#MESH)"/>'
         f'<rect x="124" y="127" width="14" height="4" fill="{THEM}"/>' +
         figure(32, G, "stand", .55) + ball(56, 99) +
         path("M62 101 L150 140", w=2.8))
    return L, R

def the_line():
    # Crosscourt is the bridge; the line is a tightrope you only walk when balanced.
    def scene(walker):
        s = (f'<rect x="0" y="96" width="28" height="68" fill="{MESH}"/>'
             f'<rect x="132" y="96" width="28" height="68" fill="{MESH}"/>'
             # bridge (wide, safe)
             f'<rect x="28" y="96" width="104" height="9" fill="{GOLD}" opacity=".9"/>'
             + line(40, 105, 40, 116, GOLD, 2) + line(120, 105, 120, 116, GOLD, 2) +
             # rope (narrow, high, sagging)
             line(18, 30, 18, 96, THEM, 3) + line(142, 30, 142, 96, THEM, 3) +
             f'<path d="M18 32 Q80 44 142 32" fill="none" stroke="{THEM}" stroke-width="1.6"/>')
        return s + walker
    L = scene(figure(72, 96, "stumble", .42))
    R = scene(figure(80, 38, "pole", .3))
    return L, R

def the_winner():
    # One dart in the bull proves nothing; trust the target that keeps landing.
    def board(cx=80, cy=78):
        rings = "".join(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{f}" stroke="{INK}" stroke-width="1"/>'
                        for r, f in ((54, "#163322"), (40, "#1f4430"), (26, "#2a5a40"), (12, "#163322"), (4, GOLD)))
        return f'<circle cx="{cx+3}" cy="{cy+3}" r="54" fill="{DEEP}"/>' + rings
    def dart(x, y, col=THEM, op=1, k=1):
        return (f'<g opacity="{op}"><line x1="{x}" y1="{y}" x2="{x+11*k}" y2="{y-11*k}" stroke="{col}" stroke-width="{2.2*k}" stroke-linecap="round"/>'
                f'<path d="M{x+9*k} {y-13*k} l{6*k} {-2*k} l{-2*k} {6*k} z" fill="{col}"/></g>')
    misses = [(14, 30), (140, 22), (148, 120), (10, 128), (128, 148), (30, 150), (150, 70), (6, 82)]
    L = board() + "".join(dart(x, y, THEM, .35) for x, y in misses) + dart(80, 78, GOLD, 1, 1.7)
    hits = [(66, 66), (88, 64), (74, 92), (94, 86), (60, 82), (82, 98), (70, 74), (92, 72), (78, 60), (66, 96)]
    R = board() + "".join(dart(x, y, THEM) for x, y in hits)
    return L, R

def recovery():
    # Their racket throws a spotlight of possible replies. Stand in its middle.
    def scene(them_x, beam_l, beam_r, you_x, you_y):
        mid = (beam_l + beam_r) / 2
        return (line(10, 146, 150, 146, MUTE, 1.2, op=.7) +
                line(80, 140, 80, 152, MUTE, 1.6) +
                f'<path d="M{them_x} 26 L{beam_l} 146 L{beam_r} 146 Z" fill="{GOLD}" opacity=".18"/>' +
                path(f"M{them_x} 26 L{beam_l} 146", GOLD, 1, arrow=False, op=.7) +
                path(f"M{them_x} 26 L{beam_r} 146", GOLD, 1, arrow=False, op=.7) +
                line(mid, 34, mid, 146, GOLD, 1, "2 4", .6) +
                dot_person(them_x, 22, THEM, 6) +
                figure(you_x, you_y, "ready", .34))
    L = scene(146, 12, 124, 68, 140)
    R = scene(80, 18, 142, 80, 158)
    return L, R

def forehand_bill():
    # The runaround forehand arrives with a bill: the recovery you owe.
    def receipt(x, y, w, h, rows, tick):
        d = f'M{x} {y} h{w} v{h}' + "".join(f" l{-w/8:.1f} 5 l{-w/8:.1f} -5" for _ in range(4)) + ' Z'
        body = (f'<path d="{d}" fill="{DEEP}" transform="translate(3 3)"/>'
                f'<path d="{d}" fill="#efe7d2"/>')
        for i in range(rows):
            yy = y + 14 + i * 9
            body += line(x + 8, yy, x + w - 22, yy, "#8a8370", 2.4)
            body += line(x + w - 16, yy, x + w - 8, yy, "#8a8370", 2.4)
        ty = y + 14 + rows * 9 + 4
        body += line(x + 8, ty, x + w - 8, ty, INK, 1.2)
        body += line(x + w - 24, ty + 8, x + w - 8, ty + 8, INK, 3.4)
        return body + tick
    # left: deep ball, ready opponent: the bill runs off the page
    L = receipt(36, -4, 88, 150, 13,
                f'<g transform="rotate(-14 80 92)"><rect x="40" y="78" width="80" height="26" fill="none" stroke="#b5513a" stroke-width="3"/>'
                f'<path d="M50 84 L110 98 M110 84 L50 98" stroke="#b5513a" stroke-width="3"/></g>')
    # right: short ball, stranded opponent: small bill, worth paying
    R = receipt(46, 56, 68, 52, 3,
                f'<path d="M66 132 l10 10 l20 -24" fill="none" stroke="{GOLD}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>')
    return L, R

def middle_return():
    # The server's next angles open like a fan. Deep middle folds it shut.
    def fan(cx, cy, spread, ribs, r=118):
        out = ""
        a0 = math.pi / 2 - spread / 2
        pts = []
        for i in range(ribs + 1):
            a = a0 + spread * i / ribs
            x, y = cx + r * math.cos(a), cy + r * math.sin(a)
            pts.append((x, y))
            out += line(cx, cy, round(x, 1), round(y, 1), INK, 1.4)
        poly = " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
        return (f'<polygon points="{cx},{cy} {poly}" fill="{GOLD}" opacity=".92"/>' + out +
                f'<circle cx="{cx}" cy="{cy}" r="4" fill="{INK}"/>')
    L = (line(14, 150, 146, 150, MUTE, 1.2, op=.7) + fan(80, 22, 0.32, 3) +
         dot_person(80, 16, THEM, 6) + ball(80, 48, 4))
    R = (line(14, 150, 146, 150, MUTE, 1.2, op=.7) + fan(80, 52, 1.9, 9, 96) +
         dot_person(80, 46, THEM, 6) + path("M80 22 L80 38", MUTE, 1.6, "2 3") + ball(80, 66, 4))
    return L, R

def running_around():
    # The runaround forehand is paid for in time. Check the glass.
    def glass(sand_top):
        g = (f'<path d="M57 22 h52 l-22 52 l22 52 h-52 l22 -52 z" fill="{DEEP}" transform="translate(3 3)"/>'
             f'<path d="M54 18 h52 l-22 54 l22 54 h-52 l22 -54 z" fill="#163322" stroke="{THEM}" stroke-width="2.4" stroke-linejoin="round"/>'
             f'<rect x="48" y="12" width="64" height="7" fill="{THEM}"/><rect x="48" y="125" width="64" height="7" fill="{THEM}"/>')
        if sand_top:
            g += f'<path d="M60 28 h40 l-18 42 h-4 z" fill="{GOLD}"/><path d="M71 124 l9 -14 l9 14 z" fill="{GOLD}"/>'
            g += line(80, 72, 80, 110, GOLD, 1.4)
        else:
            g += f'<path d="M58 124 Q80 86 102 124 z" fill="{GOLD}"/>'
        return g
    L = glass(True) + ground(20, 140, 150) + figure(128, 150, "walk", .26)
    R = glass(False) + ground(20, 140, 150) + figure(128, 150, "stumble", .26)
    return L, R

def attack_the_backhand():
    # The backhand is a door with a guard on it. Move the guard first.
    def wall(guard_x, door_open, shot):
        s = (f'<rect x="8" y="30" width="144" height="34" fill="{MESH}"/>'
             f'<rect x="20" y="34" width="34" height="30" fill="{DEEP if door_open else "#0f2419"}" stroke="{THEM}" stroke-width="1.6"/>'
             f'<rect x="106" y="34" width="34" height="30" fill="#0f2419" stroke="{THEM}" stroke-width="1.6"/>'
             f'<text x="37" y="26" text-anchor="middle" font-size="9" font-weight="700" fill="{GOLD}" letter-spacing=".6">BH</text>'
             f'<text x="123" y="26" text-anchor="middle" font-size="9" font-weight="700" fill="#b3c7b9" letter-spacing=".6">FH</text>')
        s += figure(guard_x, 96, "guard", .28, THEM)
        s += figure(80, 158, "ready", .28)
        return s + shot
    L = wall(37, False, path("M88 116 Q110 92 122 70", w=2.4))
    R = wall(123, True, path("M74 116 Q50 90 38 70", w=2.6) +
             path("M50 98 Q86 92 112 98", MUTE, 1.4, "2 3"))
    return L, R

LESSONS = {
    "short-ball": short_ball, "the-line": the_line, "the-winner": the_winner,
    "recovery": recovery, "forehand-bill": forehand_bill, "middle-return": middle_return,
    "running-around": running_around, "attack-the-backhand": attack_the_backhand,
}

# ---------------------------------------------------------------- output

def defs(uid):
    return (f'<defs><marker id="{uid}-ARR" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto">'
            f'<path d="M0 0 L10 5 L0 10 z" fill="{GOLD}"/></marker>'
            f'<pattern id="{uid}-MESH" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#0f2419"/>'
            f'<path d="M0 0 L6 6 M6 0 L0 6" stroke="{MESH}" stroke-width=".9"/></pattern></defs>')

def panel_svg(slug, i, body):
    uid = f"ed-{slug}-{i}"
    body = body.replace("url(#ARR)", f"url(#{uid}-ARR)").replace("url(#MESH)", f"url(#{uid}-MESH)")
    return (f'<svg class="tk-drawing tk-editorial" viewBox="0 0 {W} {H}" aria-hidden="true" '
            f'font-family="DM Sans, system-ui, sans-serif">{defs(uid)}{body}</svg>')

def main(repo):
    out_dir = os.path.join(repo, "app_src", "takeaway-art")
    os.makedirs(out_dir, exist_ok=True)
    cards = json.load(open(os.path.join(repo, "app_src", "takeaways.json")))
    built = {}
    for slug, fn in LESSONS.items():
        L, R = fn()
        built[slug] = [panel_svg(slug, 0, L), panel_svg(slug, 1, R)]
        with open(os.path.join(out_dir, f"{slug}.json"), "w") as f:
            json.dump({"slug": slug, "source": cards[slug]["source"], "panels": built[slug]}, f, indent=1)
    return cards, built

if __name__ == "__main__":
    main(sys.argv[1])
