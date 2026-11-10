"""Build a mobile-width review page for one editorial set using the live takeaways.css.
Usage: python3 tools/editorial_review.py <repo> <set: v1|v2|v3> <out.html> [slug ...]
"""
import html, importlib, json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import editorial_art as ea

def card(c, panels, slug):
    ps = "".join(
        f'<div class="takeaway-panel"><p class="takeaway-condition">{html.escape(p["label"])}</p>{svg}'
        f'<p class="takeaway-action">{html.escape(p["caption"])}</p></div>'
        for p, svg in zip(c["panels"], panels))
    return (f'<section class="lesson-takeaway"><div class="slug">{slug}</div>'
            f'<h2 class="takeaway-title">{html.escape(c["title"])}</h2><div class="takeaway-pair">{ps}</div></section>')

def main(repo, set_name, out, only=None):
    lessons = importlib.import_module(f"art_{set_name}").__dict__[set_name.upper()]
    cards, built = ea.build(repo, set_name, lessons)
    order = [s for s in json.load(open(os.path.join(repo, "app_src", "takeaways.json"))) if s in built]
    css = open(os.path.join(repo, "app_src", "takeaways.css")).read()
    body = "".join(card(cards[s], built[s], s) for s in (only or order))
    page = (f'<!doctype html><meta charset="utf-8"><style>{css}'
            'body{margin:0;background:#0b1a12;padding:6px 22px;width:346px;font-family:"DM Sans",system-ui,sans-serif}'
            '.slug{font:600 10px monospace;color:#5d7a66;margin:0 0 4px}.takeaway-title{font-size:22px!important;margin-bottom:12px!important}'
            '.lesson-takeaway{margin:14px 0 18px!important}.tk-editorial{height:150px}</style>' + body)
    open(out, "w").write(page)
    return len(built)

if __name__ == "__main__":
    print(main(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4:] or None))
