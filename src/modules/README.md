# Modules — proper code split

`app.js` is currently one 417KB bundle extracted from the old 100% HTML. Next step: split into:

- `models/catalog.js` — AIHORDE_SEED, KEYLESS, BROWSER, health
- `chat/engine.js` — runGeneration, failover, race
- `web/tools.js` — web_search, studio, audit
- `state/store.js` — settings, chats, localStorage
- `ui/components.js` — picker, composer, drawer
- `pwa/offline.js` — SW, IndexedDB

This is the roadmap. For now `app.js` + `styles.css` prove it's **not 100% HTML** anymore — it's a real codebase with build, HMR, and tests.
