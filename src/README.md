# src — modular future

This folder is for the *next* amazing step: splitting `index.html` into proper modules without losing the standalone magic.

Current `index.html` is intentionally 100% self-contained (works `file://` with zero build). That's a feature, not a bug.

When we *do* split:

- `src/app.js` — init, state, persistence
- `src/models/catalog.js` — catalog, health, auto-prune
- `src/chat/engine.js` — streaming, failover, race
- `src/web/tools.js` — web search, studio, audit
- `src/pwa/` — offline, sync
- `src/styles/` — design tokens

Build stays optional: `npm run dev` for HMR, but `index.html` always remains the single-file deploy artifact.

Until then, enjoy the pure HTML power.
