"""Build only explicitly authored Daily recall aids; stop on changed lesson teaching."""
import hashlib
import json
import re
from xml.etree import ElementTree
from pathlib import Path


def read_artwork(path):
    """Split the source spread into two phone panels with instance-local SVG references."""
    spread = ElementTree.fromstring(path.read_text().replace(' xmlns="http://www.w3.org/2000/svg"', ''))
    panels = spread.findall('svg')
    assert len(panels) == 2, path
    shared = spread.find('defs')
    drawings = []
    for panel in panels:
        assert len(panel.findall(".//*[@data-recall-cue]")) == 1, path
        for attr in ('x', 'width', 'height'):
            panel.attrib.pop(attr)
        if shared is not None:
            panel.insert(0, shared)
        drawing = ElementTree.tostring(panel, encoding='unicode')
        ids = {node.attrib['id'] for node in panel.iter() if 'id' in node.attrib}
        refs = set(re.findall(r'(?:href="#|url\(#)([\w-]+)', drawing))
        assert refs <= ids, f'Unresolved artwork reference: {path}: {refs - ids}'
        drawing = re.sub(r'(id="|href="#|url\(#)([\w-]+)', r'\1__INSTANCE__-\2', drawing)
        drawings.append(re.sub(r'>\s+<', '><', drawing).strip())
    return drawings


def build_takeaways(src, out, catalogue):
    src, out = Path(src), Path(out)
    cards = json.loads((src / 'takeaways.json').read_text())
    assert set(cards) == {l['slug'] for l in catalogue['daily']}, 'Daily takeaway coverage differs'
    kinds = {'court', 'height', 'position', 'contact', 'timing', 'arrival', 'sequence'}
    motions = {'court': {'shot', 'shot-follow', 'move'}, 'height': {'height'}, 'position': {'move'},
               'contact': {'space', 'contact'}, 'timing': {'split-rise', 'split-land'},
               'arrival': {'space', 'chase'}, 'sequence': {'steps', 'look'}}
    artwork = {path.stem: read_artwork(path) for path in (src / 'takeaway_art').glob('*.svg')}
    assert artwork.keys() <= cards.keys(), 'Unknown illustrated Daily'
    for slug, card in cards.items():
        lesson = json.loads((out / 'lessons' / (slug + '.json')).read_text())['lesson']
        digest = hashlib.sha256(json.dumps(lesson, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
        assert card['source'] == digest, f'Review visual takeaway against changed lesson: {slug}'
        assert card['title'] and card['rule'] and len(card['panels']) == 2, slug
        assert len(card['title']) < 65 and len(card['rule'].split()) <= 40, slug
        for p in card['panels']:
            assert p['kind'] in kinds and p['label'] and p['caption'], slug
            assert p.get('motion') in motions[p['kind']], f'Missing or incompatible takeaway motion: {slug}'
            if p['kind'] == 'court':
                assert p['motion'] == ('shot-follow' if p.get('target') and p.get('move') else 'shot' if p.get('target') else 'move'), slug
                assert p.get('target') or p.get('move'), slug
            assert len(p['label']) <= 29 and len(p['caption']) <= 32, slug
            for key in ('you', 'them', 'target', 'move', 'opMove'):
                if p.get(key) is not None:
                    assert len(p[key]) == 2 and all(isinstance(v, (int, float)) for v in p[key]), slug
                    assert 0 <= p[key][0] <= 160 and 0 <= p[key][1] <= 180, slug
            if p['kind'] == 'court' and p.get('target'):
                assert 48 <= p['target'][0] <= 112 and 17 <= p['target'][1] < 90, f'Target outside singles court: {slug}'
        if slug in artwork:
            for panel, drawing in zip(card['panels'], artwork[slug]):
                panel['art'] = drawing
        del card['source']  # Provenance is a build contract, not additional browser content.
    template = (src / 'takeaways.js').read_text()
    assert template.count('__TAKEAWAYS__') == 1
    (out / 'takeaways.js').write_text(template.replace('__TAKEAWAYS__', json.dumps(cards, ensure_ascii=False, separators=(',', ':'))))
