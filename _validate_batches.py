import json, glob, os

VOCAB = set("""access ad-court adaptation adjustment advantage aesthetics aggression alcaraz
alignment all-court altitude analysis analytics anger angles anticipation
anxiety approach approach-shot attack attack-threshold australian-formation
awareness backhand bad-day balance ball-behaviour ball-machine balls baseline
baseliner basic basics best-of-five big-hitter big-server blocked
blocked-practice body body-language body-serve bounce break break-point
break-points breath breathing calm changeover cheat-position chip-return
choking clay clay-to-hard closing club club-tennis clutch coaching
code-violation coin-toss comeback comebacks communication compact-swing
competition competitive-drills conditions confidence consistency constraints
contact contact-height contact-point cool-down correction counterpuncher court
court-geometry court-position cramp crosscourt crossover cue debate decision
decision-making defense defensive defensive-baseliner deliberate depth deuce
development direction-change disguise distance djokovic dominant-wing
double-fault doubles drop-shot dynamic-movement efficiency emotion
endurance equipment error error-management errors execution experience
fake-poach fast-court fatigue federer feedback feet final-set finish
first-ball first-point first-serve first-step fitness flat-hitter focus
foot-fault footwork forehand formation game-iq game-plan geometry goals grass
great-matches growth half-volley har-tru heat height high-ball hindrance
history hot-streak humidity hydration impatient improvement
in-match-adjustment indoor injury inside-out kick kinetic-chain knock-up
kyrgios lead leading learning lefty legacy let level line-call lob
lob-return long low-ball low-return management margin match match-iq
match-point match-review mechanics medical-timeout mental mental-game mid-match
middle mindset mini-break miss momentum moonball movement nadal nerves net
net-play net-player net-position net-rusher net-touch neutral next-point night
nutrition on-the-run one-handed open-court opponent out-calls over-the-net
overhead pace partner passivity patience pattern pattern-recognition patterns
percentage physical placement planning playing-up poach point-construction
position positioning power practice pre-match preparation pressure process
professional psychology pusher quality racket racket-abuse rally
rally-tolerance random readiness recovery redirect reset resilience retriever
return returner revenge rhythm-change rivalries rookie routine rules safety
scheduling science score score-awareness scoreboard scoring scouting
second-serve second-serve-pressure self-officiated senior sequencing serve
serve-and-volley serve-order serve-pattern serve-plus-one serve-read
serve-reading serve-rotation serve-volley service-order session-design set
set-point sets short-ball shot-selection signals simplicity skill-development
sleep slice slice-serve sliding slow-court slow-start social-media
solo-practice spacing spin spin-direction split-step stability stamina stance
streaky strength strings structure sun surface swing-path t-serve tactical
tactician tactics target targeting targets technique tempo tennis-math
tension tiebreak time-management time-pressure timing topspin toss transfer
transition two-handed two-handed-backhand uncertainty underdog unit-turn
variation video visual visual-tracking volley warm-up weakness weaknesses
weapon wet wide wimbledon wind wta""".split())

VALID_ANIM = {
 "court_serve_zones","court_wide_serve_open","court_body_serve_jam","court_rally_pattern",
 "court_return_pos","court_doubles_formation","court_pressure_score","court_tiebreak_order",
 "court_geometry_cc_dtl","court_lob_vs_pass","court_moonball_response","court_net_approach",
 "court_short_ball_attack","short_ball_attack","moonball_counter","passing_shot",
 "ball_trajectory","ball_bounce_height","swing_path","footwork_split_step","contact_zone",
 "t_serve_plus_one","wide_serve_plus_one","body_serve_plus_one",
}

PILLARS={"Technique","Win More","Game IQ","Mental","Debate"}
DIFFS={"Club","Competitor","Tactician"}
FORMATS={"Scenario","MCQ","Debate"}
TIERS={"Free","Pro"}

files = sorted(glob.glob("QBANK_BATCH_*_v1.json"))
allids=[]
problems=0
for f in files:
    d=json.load(open(f))
    for q in d:
        qid=q.get("id","?")
        allids.append(qid)
        # tags
        for t in [x.strip() for x in q.get("tags","").split(",") if x.strip()]:
            if t not in VOCAB:
                print(f"  [TAG] {f} {qid}: '{t}' not in vocab"); problems+=1
        # anim
        for k in ("techAnim","visual"):
            v=q.get(k)
            if v and v not in VALID_ANIM:
                print(f"  [ANIM] {f} {qid}: {k}='{v}' invalid"); problems+=1
        # enums
        if q.get("pillar") not in PILLARS: print(f"  [PILLAR] {f} {qid}: {q.get('pillar')}"); problems+=1
        if q.get("difficulty") not in DIFFS: print(f"  [DIFF] {f} {qid}: {q.get('difficulty')}"); problems+=1
        if q.get("format") not in FORMATS: print(f"  [FMT] {f} {qid}: {q.get('format')}"); problems+=1
        if q.get("tier") not in TIERS: print(f"  [TIER] {f} {qid}: {q.get('tier')}"); problems+=1
        # golden formula fields
        for fld in ("why_right","pro_insight","common_pitfall","action_tip","question"):
            if not q.get(fld): print(f"  [MISSING] {f} {qid}: {fld}"); problems+=1

# duplicate ids
dupes=set([x for x in allids if allids.count(x)>1])
if dupes: print("  [DUP IDS]", dupes); problems+=len(dupes)

print(f"\nTotal questions: {len(allids)}  | ID range: {min(allids)}..{max(allids)}")
print(f"Problems: {problems}")
