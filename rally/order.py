"""Display order of each step's options (content audit, 29 Sep 2026).

The scene builders keep their original letters (so they rebuild unchanged); order.json maps each step's
displayed letters to the built ones, e.g. "ln1": "ACBD" means shown A = built A, shown B = built C, ...
build.py and build_lesson.py apply it when they read <prefix>_data.json. The lesson texts are written in
the displayed order."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ORDER = json.load(open(os.path.join(HERE, 'order.json')))

def apply(D):
    sc = D['scenes']
    for step, perm in ORDER.items():
        old = {X: sc.get(step + X) for X in 'ABCD'}
        if any(v is None for v in old.values()): continue
        for i, X in enumerate('ABCD'): sc[step + X] = old[perm[i]]
    return D
