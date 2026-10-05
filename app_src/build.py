"""Build the GameSharp app (one shared engine, one clip library, per-lesson data) into ../app.
python3 app_src/build.py   (run from the repo root)

Inputs: rally/lesson_body.html (the engine template), rally/core.js, rally/figure.js, rally/lesson_<p>.js,
rally/<p>_data.json (the gated scene data), app_src/* (the shell)."""
import json, hashlib, os, re, shutil, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R, SRC, OUT = os.path.join(ROOT, 'rally'), os.path.join(ROOT, 'app_src'), os.path.join(ROOT, 'app')
sys.path.insert(0, SRC)
from catalog import DAILY, PREDICT, PLAY, FLAVOURS
FLAV = {slug: key for key, _, slugs in FLAVOURS for slug in slugs}
sys.path.insert(0, R)
from order import apply as apply_order   # displayed option order per step (content audit)

def lesson_obj(p):
    js = os.path.join(R, 'lesson_%s.js' % p)
    out = subprocess.check_output(['node', '-e', "const fs=require('fs');process.stdout.write(JSON.stringify(new Function(fs.readFileSync(process.argv[1],'utf8')+';return LESSON;')()))", js])
    return json.loads(out)

if os.path.isdir(OUT): shutil.rmtree(OUT)
for d in ('', 'engine', 'lessons', 'clips', 'icons'): os.makedirs(os.path.join(OUT, d), exist_ok=True)
dump = lambda o: json.dumps(o, separators=(',', ':'), ensure_ascii=False)

# ---------- lessons + shared clips ----------
clips, cat = {}, {'daily': [], 'predict': [], 'play': []}
for group, rows in (('daily', DAILY), ('predict', PREDICT), ('play', PLAY)):
    for slug, p, line in rows:
        L = lesson_obj(p)
        D = apply_order(json.load(open(os.path.join(R, p + '_data.json'))))
        for k, v in D['clips'].items():
            s = dump(v)
            assert clips.setdefault(k, s) == s, 'clip %s differs between lessons' % k
        open(os.path.join(OUT, 'lessons', slug + '.json'), 'w').write(dump({'lesson': L, 'scenes': D['scenes']}))
        _sit = re.sub(r'<[^>]+>', '', (L.get('steps') or [{}])[0].get('sit', '') or '')   # Home teaser: the first situation line
        cat[group].append({'slug': slug, 'title': L['title'], 'line': line, 'sit': _sit, 'clips': sorted(D['clips']), 'flavour': FLAV[slug]})
for k, s in clips.items(): open(os.path.join(OUT, 'clips', k + '.json'), 'w').write(s)
cat['flavours'] = [{'key': k, 'name': n, 'lessons': sl} for k, n, sl in FLAVOURS]
assert set(FLAV) == {r[0] for r in DAILY + PREDICT + PLAY}, 'every lesson needs one flavour'

# ---------- engine (core + figure + the lesson runtime, data and lesson supplied by the page) ----------
body = open(os.path.join(R, 'lesson_body.html')).read()
m = re.search(r'<script>\nconst DATA=__DATA__;\n</script>\n<script>\n__CORE__\n__FIGURE__\n</script>\n<script>\n(.*)</script>\s*$', body, re.S)
assert m, 'template layout changed'
runtime = m.group(1)
assert runtime.count('__LESSON__') == 1
runtime = runtime.replace('__LESSON__', '/* LESSON is supplied by the page */')
engine = ('/* GameSharp engine: shared by every lesson. Built from rally/lesson_body.html, core.js, figure.js. */\n'
          + open(os.path.join(R, 'core.js')).read() + '\n' + open(os.path.join(R, 'figure.js')).read() + '\n' + runtime)
open(os.path.join(OUT, 'engine', 'engine.js'), 'w').write(engine)
# Sharpen athlete: the same figure + projection, wrapped in one closure with its own small runtime
open(os.path.join(OUT, 'athlete.js'), 'w').write('/* GameSharp Sharpen athlete. Built from rally/core.js, figure.js and app_src/athlete.js. */\n(function(){\n'
    + open(os.path.join(R, 'core.js')).read() + '\n' + open(os.path.join(R, 'figure.js')).read() + '\n' + open(os.path.join(SRC, 'athlete.js')).read() + '\n})();\n')

# ---------- version (content hash) ----------
h = hashlib.sha256()
for dp, _, fs in sorted(os.walk(OUT)):
    for f in sorted(fs): h.update(open(os.path.join(dp, f), 'rb').read())
for f in ('app.js', 'index.html', 'play_host.html', 'sharpen.js', 'sfx.js', 'cine.js', 'athlete.js'): h.update(open(os.path.join(SRC, f), 'rb').read())
for f in sorted(os.listdir(os.path.join(SRC, 'sharpen'))): h.update(open(os.path.join(SRC, 'sharpen', f), 'rb').read())
VER = h.hexdigest()[:10]
open(os.path.join(OUT, 'catalog.js'), 'w').write('window.GS_CATALOG=%s;\nwindow.GS_VERSION="%s";\n' % (dump(cat), VER))

# ---------- player page: the template's markup and styles, then the loader ----------
head = body[:m.start()]
head = head.replace('<title>__TITLE__</title>', '<title>GameSharp Tennis</title>', 1)
assert '__' not in re.sub(r'<style>.*?</style>', '', head, flags=re.S), 'unfilled placeholder in markup'
host = open(os.path.join(SRC, 'play_host.html')).read().replace('__VER__', VER)
play = '<!doctype html>\n<html lang="en">\n<head>\n' + head.replace('<div class="shell">', '</head>\n<body>\n<div class="shell">', 1) + host + '\n</body>\n</html>\n'
open(os.path.join(OUT, 'play.html'), 'w').write(play)

# ---------- shell ----------
idx = open(os.path.join(SRC, 'index.html')).read()
for f in ('config.js', 'catalog.js', 'app.js', 'sharpen.js', 'sfx.js', 'cine.js'): idx = idx.replace('src="%s"' % f, 'src="%s?v=%s"' % (f, VER))
open(os.path.join(OUT, 'index.html'), 'w').write(idx)
shutil.copy(os.path.join(SRC, 'app.js'), OUT)
shutil.copy(os.path.join(SRC, 'sharpen.js'), OUT)
shutil.copy(os.path.join(SRC, 'sfx.js'), OUT)
shutil.copy(os.path.join(SRC, 'cine.js'), OUT)
os.makedirs(os.path.join(OUT, 'sharpen'), exist_ok=True)
for f in sorted(os.listdir(os.path.join(SRC, 'sharpen'))): shutil.copy(os.path.join(SRC, 'sharpen', f), os.path.join(OUT, 'sharpen', f))
shutil.copy(os.path.join(SRC, 'config.js'), OUT)
shutil.copy(os.path.join(SRC, 'vercel.json'), OUT)
open(os.path.join(OUT, 'manifest.webmanifest'), 'w').write(dump({
    'name': 'GameSharp Tennis', 'short_name': 'GameSharp', 'start_url': './', 'scope': './', 'display': 'standalone',
    'background_color': '#111111', 'theme_color': '#111111',
    'icons': [{'src': 'icons/icon-192.png', 'sizes': '192x192', 'type': 'image/png'},
              {'src': 'icons/icon-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'any maskable'}]}))
for n in (180, 192, 512): shutil.copy(os.path.join(SRC, 'icons', 'icon-%d.png' % n), os.path.join(OUT, 'icons'))

tot = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(OUT) for f in fs)
print('app', VER, 'lessons', len(DAILY) + len(PREDICT) + len(PLAY), 'clips', len(clips), 'total KB', tot // 1000)
