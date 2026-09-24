import json

MAP = {
 "match-strategy":"tactics","tactical-adjustment":"adjustment","problem-solving":"tactical",
 "serve-placement":"placement","pattern-play":"pattern","change-of-pace":"pace",
 "disruption":"rhythm-change","composure":"calm","between-point-routine":"routine",
 "match-planning":"planning","weakness-targeting":"weakness","setup":"sequencing",
 "reach":"net-position","volley-position":"net-position","first-volley":"volley",
 "beat-opponent-types":"opponent","volley-technique":"technique","first-strike":"first-ball",
 "commitment-mindset":"mindset","open-stance":"stance","wrong-foot":"direction-change",
 "serving-for-match":"closing","defense-to-offense":"transition","court-coverage":"movement",
 "grass-court":"grass","flat-drive":"flat-hitter","longevity":"experience",
 "poaching":"poach","neutralize":"neutral","reset-routine":"reset",
}

files = ["QBANK_BATCH_SERENA_v1.json","QBANK_BATCH_VENUS_v1.json",
         "QBANK_BATCH_ASHE_v1.json","QBANK_BATCH_COURT_v1.json","QBANK_BATCH_GRAF_v1.json"]

for f in files:
    d=json.load(open(f))
    for q in d:
        # fix pillar typo
        if q.get("pillar")=="The Debate": q["pillar"]="Debate"
        # fix tags
        tags=[t.strip() for t in q.get("tags","").split(",") if t.strip()]
        new=[]
        for t in tags:
            r=MAP.get(t,t)
            if r not in new: new.append(r)   # dedupe
        q["tags"]=", ".join(new)
    json.dump(d, open(f,"w"), indent=2, ensure_ascii=False)
    print("fixed", f)
