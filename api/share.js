// Per-point / per-play link unfurls. Crawlers (iMessage, WhatsApp, X, Slack)
// don't run JS, so the static app can only ever unfurl one generic card. This
// function serves a tiny HTML shell whose OG tags describe the SPECIFIC shared
// scenario, then instantly forwards humans into the app deep link.
// Routed via vercel.json:  /s/:id -> ?id=,  /play/:pid -> ?play=
// Zero dependencies; share-data.json is regenerated from QBANK when content changes.
const data = require('../share-data.json');

const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

module.exports = (req, res) => {
  const { id = '', play = '' } = req.query || {};
  const HOST = 'https://www.gamesharptennis.com';
  let title, desc, dest;
  if (play && data.play[play]) {
    const p = data.play[play];
    title = p.t + ' — GAMESHARP Tennis';
    desc  = p.g || 'Watch the pattern move, then drill it.';
    dest  = '/?play=' + encodeURIComponent(play);
  } else if (id && data.q[id]) {
    const q = data.q[id];
    title = q.t;
    desc  = 'Make the call — ' + (q.m ? q.m + ' · ' : '') + 'GAMESHARP Tennis';
    dest  = '/?p=' + encodeURIComponent(id);
  } else {
    // Unknown id: fall back to the homepage (still unfurls the hero card).
    title = 'GAMESHARP Tennis — See the game differently';
    desc  = 'Decision training that sharpens how you read every point.';
    dest  = '/';
  }
  const url = HOST + (req.url || '/');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  res.status(200).send(`<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<title>${esc(title)}</title>
<meta property="og:type" content="website">
<meta property="og:site_name" content="GAMESHARP">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${HOST}/og-image.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${HOST}/og-image.jpg">
<meta http-equiv="refresh" content="0;url=${esc(dest)}">
</head><body style="background:#0d1a0f">
<script>location.replace(${JSON.stringify(dest)});</script>
<noscript><a href="${esc(dest)}" style="color:#c8a84b">Open GAMESHARP</a></noscript>
</body></html>`);
};
