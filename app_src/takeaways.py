"""Build only explicitly authored Daily recall aids; stop on changed lesson teaching."""
import hashlib
import json
from pathlib import Path


def build_takeaways(src, out, catalogue):
    src, out = Path(src), Path(out)
    cards = json.loads((src / 'takeaways.json').read_text())
    assert set(cards) == {l['slug'] for l in catalogue['daily']}, 'Daily takeaway coverage differs'
    kinds = {'court', 'height', 'position', 'contact', 'timing', 'arrival', 'sequence'}
    for slug, card in cards.items():
        lesson = json.loads((out / 'lessons' / (slug + '.json')).read_text())['lesson']
        digest = hashlib.sha256(json.dumps(lesson, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
        assert card['source'] == digest, f'Review visual takeaway against changed lesson: {slug}'
        assert card['title'] and card['rule'] and len(card['panels']) == 2, slug
        assert len(card['title']) < 65 and len(card['rule'].split()) <= 40, slug
        for p in card['panels']:
            assert p['kind'] in kinds and p['label'] and p['caption'], slug
            assert len(p['label']) <= 29 and len(p['caption']) <= 32, slug
            for key in ('you', 'them', 'target', 'move', 'opMove'):
                if p.get(key) is not None:
                    assert len(p[key]) == 2 and all(isinstance(v, (int, float)) for v in p[key]), slug
                    assert 0 <= p[key][0] <= 160 and 0 <= p[key][1] <= 180, slug
            if p['kind'] == 'court' and p.get('target'):
                assert 48 <= p['target'][0] <= 112 and 17 <= p['target'][1] < 90, f'Target outside singles court: {slug}'
        del card['source']  # Provenance is a build contract, not additional browser content.
    template = (src / 'takeaways.js').read_text()
    assert template.count('__TAKEAWAYS__') == 1
    (out / 'takeaways.js').write_text(template.replace('__TAKEAWAYS__', json.dumps(cards, ensure_ascii=False, separators=(',', ':'))))
