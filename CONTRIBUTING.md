# Contributing to abliterated.ai

Thanks for making it amazing beyond single-file HTML!

## Quick start

```bash
npm install
npm run dev        # vite + proxy
npm run proxy      # CORS proxy on :8787 (optional, for file://)
npm run check      # 18/18 + 4/4 static checks
```

`index.html` is still the **source of truth** — it runs `file://` with zero build.
`manifest.json` + `sw.js` + `icons/` make it a real PWA when hosted.

## What to add (not just HTML)

- **PWA goodness:** `manifest.json`, `sw.js`, icons, offline caching — done ✅
- **Backend:** `server/proxy.js` for local Ollama/HF mirror when hosting
- **Deploy:** `.github/workflows/deploy.yml` → GitHub Pages
- **Future split:** `src/` modules (see `src/README.md`)

## PR rules

- Keep `index.html` runnable via `file://` (no external `script[src]`).
- Run `node scripts/check.js` before pushing.
- Static checks must pass: zero externals, 25 models, offline fallback.

MIT — fork, self-host, go offline.
