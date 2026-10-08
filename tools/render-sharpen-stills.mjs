// Renders Sharpen's stroke pictures (app_src/sharpen/<stroke>_<0|1|2>.jpg) from the same figure, kit and ball as the
// Sharpen athlete (app/athlete.js), so the stills and the animation always agree. Run after `python3 app_src/build.py`:
//   node tools/render-sharpen-stills.mjs
// 8 Oct 2026 (Eoin: "the serve in Sharpen omits the visible ball in the toss"). The old stills were hand-rendered once,
// in the old kit, with no ball in the serve's trophy or contact pictures.
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'app_src/sharpen');
const SIZE = 300;
// stroke -> phase frames, relative to the clip's contact frame ('trophy' = the hitting elbow at its highest before the racquet drops, about the toss's peak)
const PHASES = { fh: [-30, 0, 40], bh: [-30, 0, 40], slice: [-30, 0, 40], drop: [-30, 0, 40],
                 serve: ['trophy', 0, 40], fv: [-15, 0, 20], bv: [-15, 0, 20] };
// a wider, side-on camera than the animation's: the whole body, the racquet path and the ball all in the square
const CAM = JSON.parse(process.env.STILLS_CAM || '{"el":8,"d":10.5,"fov":30}');
const SIDE = { fh: 0, drop: 0, fv: 0, serve: 0, bh: 180, slice: 180, bv: 180 };   // side-on, from the hitting side
const ONLY = process.env.STILLS_ONLY ? process.env.STILLS_ONLY.split(',') : null;
const CLIPS = { fh: 'fh', bh: 'bh', slice: 'bhSlice', serve: 'serveT', fv: 'lowfv', bv: 'bv', drop: 'drop' };

let src = fs.readFileSync(path.join(ROOT, 'app/athlete.js'), 'utf8');
src = src.replace('VW=520; VH=360;', `VW=${SIZE}; VH=${SIZE};`);
src = src.replace('window.GSAthlete={', 'window.__R={draw,load,ballAt,cam,buildBasis,I};window.GSAthlete={');
if (!src.includes('window.__R=')) throw new Error('athlete.js changed shape: update the patch');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE }, deviceScaleFactor: 1 });
await page.route('http://gs.invalid/**', r => {
  const u = new URL(r.request().url());
  if (!u.pathname.startsWith('/clips/')) return r.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><html><body></body></html>' });
  const f = path.join(ROOT, 'app/clips', path.basename(new URL(r.request().url()).pathname));
  r.fulfill({ status: 200, contentType: 'application/json', body: fs.readFileSync(f) });
});
await page.goto('http://gs.invalid/');   // served by the route above (an origin for the clip fetches); the content is set below
await page.setContent(`<!doctype html><html><body style="margin:0;background:radial-gradient(circle at 50% 35%,#163f22,#0a2412)"><div id="st" style="width:${SIZE}px;height:${SIZE}px"></div></body></html>`);
await page.addScriptTag({ content: 'window.GS_VERSION="";' + src });
for (const [k, ph] of Object.entries(PHASES)) {
  if (ONLY && !ONLY.includes(k)) continue;
  for (let i = 0; i < 3; i++) {
    await page.evaluate(async ([k, p, size, CAM, AZ]) => {
      const R = window.__R, c = await R.load(k), cf = c.contactFrame;
      let f = cf + (typeof p === 'number' ? p : 0);
      if (p === 'trophy') { let bz = -1; for (let g = 1; g < cf - 15; g++) { const z = c.frames[g - 1][R.I.elbowR][2]; if (z > bz) { bz = z; f = g; } } }
      const h = c.frames[Math.round(f) - 1][R.I.hips];   // framed on the player in this picture
      Object.assign(R.cam, CAM, { az: CAM.az ?? AZ }, k === 'serve' ? { d: 14 } : {}); R.cam.tgt = [h[0], h[1] + 0.4, k === 'serve' ? 1.45 : 1.05]; R.buildBasis();   // the serve: further back, the toss and the feet both in
      const st = document.getElementById('st'); st.innerHTML = '';
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', `0 0 ${size} ${size}`); svg.setAttribute('width', size); svg.setAttribute('height', size);
      st.appendChild(svg); R.draw(svg, k, c, f);
    }, [k, ph[i], SIZE, CAM, SIDE[k]]);
    await page.locator('#st').screenshot({ path: path.join(OUT, `${k}_${i}.jpg`), type: 'jpeg', quality: 86 });
    console.log('wrote', `${k}_${i}.jpg`);
  }
}
await browser.close();
