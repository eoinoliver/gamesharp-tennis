"""Build a mobile-width review page of editorial takeaway cards using the live takeaways.css."""
import html, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import editorial_art as ea

def card(c, panels):
    ps = "".join(
        f'<div class="takeaway-panel"><p class="takeaway-condition">{html.escape(p["label"])}</p>{svg}'
        f'<p class="takeaway-action">{html.escape(p["caption"])}</p></div>'
        for p, svg in zip(c["panels"], panels))
    return (f'<section class="lesson-takeaway"><div class="takeaway-eyebrow">Take this onto court</div>'
            f'<h2 class="takeaway-title">{html.escape(c["title"])}</h2><div class="takeaway-pair">{ps}</div>'
            f'<p class="takeaway-rule">{html.escape(c["rule"])}</p></section>')

def main(repo, out, only=None):
    cards, built = ea.main(repo)
    css = open(os.path.join(repo, "app_src", "takeaways.css")).read()
    slugs = only or list(built)
    body = "".join(f'<div class="slug">{s}</div>' + card(cards[s], built[s]) for s in slugs)
    page = (f'<!doctype html><meta charset="utf-8"><style>{css}'
            'body{margin:0;background:#0b1a12;padding:18px 22px;width:346px;font-family:"DM Sans",system-ui,sans-serif}'
            '.slug{font:600 10px monospace;color:#5d7a66;margin-top:26px}.tk-editorial{height:164px}</style>' + body)
    open(out, "w").write(page)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3:] or None)
