"""Static, crawler-readable invitations that open the exact activity in one step."""
import html, json
from pathlib import Path


def build_share_pages(src, out, cat):
    src, out = Path(src), Path(out)
    records = json.loads((src.parent/'docs/features/share-preview-frames.json').read_text())['captures']
    cards = {c['slug']: c for c in records}
    lessons = cat['daily'] + cat['predict'] + cat['play']
    assert set(cards) == {l['slug'] for l in lessons}, 'Share preview coverage must be exact'
    destination = out/'s'
    destination.mkdir()
    for lesson in lessons:
        slug = lesson['slug']
        card = cards[slug]
        title = 'GameSharp Tennis · ' + card['question']
        description = card['situation'] + ' Watch the point. Make your own call.'
        link = f'https://www.gamesharptennis.com/s/{slug}.html'
        image = f'https://www.gamesharptennis.com/share/{slug}.jpg'
        assert (src/'share'/f'{slug}.jpg').is_file(), 'Missing actual scene: '+slug
        kind = 'daily' if lesson in cat['daily'] else 'point'
        target = f'/play.html?l={slug}&challenge={kind}&via=share'
        esc = html.escape
        page = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title><meta name="description" content="{esc(description)}">
<link rel="canonical" href="{link}"><meta property="og:type" content="website"><meta property="og:site_name" content="GameSharp Tennis">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(description)}">
<meta property="og:url" content="{link}"><meta property="og:image" content="{image}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="{esc(card['question'])} — the actual GameSharp court situation">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{esc(title)}"><meta name="twitter:description" content="{esc(description)}"><meta name="twitter:image" content="{image}">
<meta name="theme-color" content="#071810"><script>location.replace({json.dumps(target)});</script>
<style>body{{max-width:700px;margin:0 auto;padding:32px 24px;background:#071810;color:#f4f1e8;font:18px/1.5 system-ui}}img{{width:100%;height:auto}}a{{display:inline-block;padding:16px 24px;background:#d0b65b;color:#071810;border-radius:8px;font-weight:700}}p{{color:#bdcec1}}</style></head>
<body><p>GAMESHARP TENNIS</p><img src="/share/{slug}.jpg" width="1200" height="630" alt="{esc(card['question'])}"><h1>{esc(card['question'])}</h1><p>{esc(description)}</p><a href="{esc(target)}">Play this situation →</a><noscript><p>Enable JavaScript to play the interactive point.</p></noscript></body></html>
'''
        (destination/f'{slug}.html').write_text(page)
