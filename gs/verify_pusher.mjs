// Usage: node verify_pusher.mjs <url of the Pusher lesson>   e.g. http://localhost:8000/play.html?l=pusher
// Plays all three steps choosing the drop options, then checks the wrap-up. Exits 1 on any failure.
import { chromium } from "playwright";
const url = process.argv[2]; if (!url) { console.error("usage: node verify_pusher.mjs <url>"); process.exit(2); }
const fail = []; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail.push(m); };
for (const vp of [{ width: 390, height: 844 }, { width: 375, height: 667 }]) {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: vp });
  const errs = []; pg.on("pageerror", e => errs.push(String(e)));
  await pg.goto(url); await pg.waitForTimeout(1500);
  ok(await pg.evaluate(() => typeof CL !== "undefined" && !!CL.drop), `${vp.width}: drop clip loaded`);
  await pg.evaluate(() => { window.__speed = 6; });
  const want = [188, 327, 157];
  for (const [i, pick] of [1, 2, 1].entries()) {
    await pg.waitForFunction(() => document.querySelectorAll("#askOpts .opt:not(:disabled)").length > 0, null, { timeout: 60000 });
    ok(Math.round(await pg.evaluate(() => t)) === want[i], `${vp.width}: step ${i + 1} freezes at ${want[i]}`);
    await pg.locator("#askOpts .opt").nth(pick).click();
    await pg.waitForSelector("#next", { timeout: 60000 }); await pg.waitForTimeout(300); await pg.click("#next");
  }
  await pg.waitForSelector("#wrapup:not([hidden])", { timeout: 30000 });
  ok(await pg.locator("details.pay").count() === 3, `${vp.width}: 3 payoff toggles (Pro Lens, The stroke, Do this)`);
  ok(await pg.locator("details.pay[open]").count() === 1 && await pg.locator("details.pay[data-k=pro][open]").count() === 1, `${vp.width}: Pro Lens open, the other toggles closed`);
  ok(await pg.locator(".strip img").count() === 6, `${vp.width}: 6 stroke freeze-frames`);
  await pg.locator("#saveCue").click();
  ok(await pg.evaluate(() => JSON.parse(localStorage.getItem("gs_my_game") || "[]").length === 1), `${vp.width}: cue saved to gs_my_game`);
  ok(errs.length === 0, `${vp.width}: no page errors ${errs.join(" | ")}`);
  await b.close();
}
process.exit(fail.length ? 1 : 0);
