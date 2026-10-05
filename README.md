# GameSharp Tennis

The live 3D lesson app. GitHub main is canonical after migration PR #1 is approved
and cut over; the previous 2D app is preserved at `legacy-2d-2026-09-21`.

Start with `AGENTS.md`, `PROJECT_ALIGNMENT.md` and `RELEASE_PROTOCOL.md`.

```sh
npm ci
npm run check:build
npm test
npx playwright install chromium
python3 -m http.server 8765 --directory app
# In another terminal:
npm run test:browser -- http://127.0.0.1:8765/
```

`app_src/` is shell source, `rally/` holds the shared 3D engine and authored
lesson inputs, `app/` is reproducible output, and `gs/` holds imported release
checks. Vercel publishes only `app/`; repository source and docs stay private to
hosting even though this Git repository is public. See `THIRD_PARTY_NOTICES.md`
for imported motion data attribution and license.
