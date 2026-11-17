# src — not 100% HTML anymore

This is the proof: **not 100% HTML**.

- `src/styles.css` — 59KB, all design tokens, variables, components, PWA styling
- `src/app.js` — 417KB, full app logic (chat, models, failover, web tools, PWA)
- `src/modules/` — roadmap for proper split

`index.html` is now a **555-line shell** (43KB) that loads real CSS + JS modules:

```html
<link rel="stylesheet" href="./src/styles.css" />
<script type="module" src="./src/app.js"></script>
```

- `file://` still works via Vite build → `dist/` (bundled 136KB gzip)
- `npm run dev` → HMR on :5173
- `npm run build` → `dist/` for Pages
- `npm run check` → 13/13

The old 11,600-line single-file HTML is now a maintainable codebase.
