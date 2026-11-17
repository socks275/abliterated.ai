# abliterated.ai — Unlimited Abliterated AI Runner

**100% standalone `index.html` — zero build, zero API keys, runs `file://`**

> Abliterated + Non-Abliterated • Auto-Race ⚡ Fastest GPU • Sticky Failover • Live Web • Web Studio • Offline ONNX • Security Audit

![Zero Keys](https://img.shields.io/badge/Zero_API_Keys-f59e0b?style=flat) ![Standalone](https://img.shields.io/badge/Standalone-HTML-10b981) ![File Protocol](https://img.shields.io/badge/file%3A%2F%2F-ready-38bdf8)

**Live:** `https://socks275.github.io/abliterated.ai/` → serves `index.html` (GitHub Pages)
**Download:** Open `index.html` or click **Download HTML** in app — double-click anywhere, no server.

## Quick Start

1. Open `index.html` locally (`file://`) or visit GitHub Pages.
2. Pick model: **⚡ Fastest Abliterated — Auto-Race** (default) or **⚡ Fastest Non-Abliterated — Auto-Race**.
3. Chat, search live web, clone/edit sites in Web Studio, run offline with No-WiFi toggle.

## Models (verified live 2026-11-17, `Origin: null` CORS OK)

- **Abliterated (AI Horde, `0000000000`, 512 cap):** L3-8B-Stheno (6w), Gemma-4-E4B-Heretic (vision), Cydonia-24B, Lumimaid-8B, Magnum-12B, Hauhau-Aggressive + live-synced workers every 60s.
- **Non-Abliterated (keyless):** Pollinations `openai` (GPT-OSS 20B), LLM7 turbo: `gpt-oss:120b`, `gpt-oss:20b`, `DeepSeek-V4-Flash-0731` (400K), `glm-5.3-flash` (1M), `gemma4:31b`, `codestral-latest`, `mimo-v2.6-flash`, `gemma-3-27b` + Horde standard (Qwen3-1.7B, Llama-3.2-1B 4w, Qwen3.5-4B/9B).
- **Offline HTML ONNX (<500 MB):** SmolLM2-135M, SmolLM2-360M-Heretic, Qwen2.5-0.5B-Abliterated-v3, Qwen2.5-0.5B-Instruct — WebGPU/WASM + IndexedDB, no tab freeze.
- **Local:** Ollama `:11434` / LM Studio `:1234` / llama.cpp `:8081` auto-detected.

All show `Text only` vs `Text + Vision` badges, grouped Abliterated / Non-Abliterated, sticky failover never switches online → browser download.

## Features

- **Auto-Race:** Staggered 0/550/3800ms (<2 req/s), aborts losers on first token, learns TTFT EWMA, queues bail at 25s.
- **Faster:** <30ms startup to prompt, 20 FPS streaming, 13s Horde timeout, CF bloat removed, preconnects.
- **Web Engine:** Bing Web+News+DDG+Wikipedia+HN, 4-tier fetch (defuddle→urltomarkdown→jina→allorigins), Wikipedia API fast-path.
- **Web Studio:** Live split preview, clone any URL, AI patch/write, undo/redo, save/popout, publish to GitHub Pages/Netlify/Webhook.
- **Security Audit:** Passive OWASP — headers, cookies, CORS, SRI, XSS/secrets, `security.txt`/`robots.txt` — with fixes, never exploitative.
- **Offline:** No-WiFi toggle, Hugging Face cache, mirror failover, local folder import, diagnostics.

## Files

- `index.html` — **main app** (GitHub Pages + standalone download). Improved SEO/OG/PWA, preconnects, 9700 lines, zero externals.
- `standalone` download via in-app **Download HTML** button produces `abliteration-runner.html` / portable `__PORTABLE_STATE__`.


## Beyond single-file HTML — now amazing ✨

This repo is **not just** `index.html` anymore. It's a full PWA + backend + deploy stack that *still* runs `file://` with zero build:

| File | Why it's amazing |
|------|------------------|
| `manifest.json` + `icons/` | Installable PWA, offline home-screen app, shortcuts |
| `sw.js` | Cache-first offline, network-first APIs, survives no-WiFi |
| `server/proxy.js` | Local CORS proxy for Ollama/Horde/HF when hosted |
| `vite.config.js` + `package.json` | `npm run dev` HMR, `npm run build` → `dist/`, `npm run dev:all` |
| `.github/workflows/deploy.yml` | Auto Pages deploy + checks |
| `src/README.md` | Future modular split without losing standalone magic |
| `icons/icon.svg` → PNGs | Real icons, not data-URI |

**Install:** Open on Chrome/Edge → prompt → *Install App* button (top bar) → standalone offline PWA.
**Dev:** `npm i && npm run dev:all` — Vite on :5173 proxied to :8787.
**Still standalone:** `index.html` alone still works `file://` — extra files just make it better when hosted.

## Dev

No build step. Edit `index.html`, commit, push. Static checks + failover unit tests run on load (see console `window.__ablitStaticChecks`).

## License

MIT — use, fork, self-host. No tracking, no keys.
