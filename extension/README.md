# DS Pulse extension

Manifest V3 Chrome extension (WXT + TypeScript) with a **side panel** UI.

## Commands

```bash
npm install
npm run dev      # unpacked dev build → .output/chrome-mv3-dev
npm run build    # production build
npm run test
npm run typecheck
```

Load **`.output/chrome-mv3-dev`** via `chrome://extensions` → **Load unpacked** (Developer mode on).

## Behavior

- **Scan Current Page** → audit in `lib/audit/` vs `public/tokens.json`; side panel shows compliance **%** and violation list.
- **Highlight all violations** draws red boxes in a closed shadow root (`#ds-linter-overlay-root`); boxes track scroll/resize.
- Click a violation row → scroll to element and pulse highlight; **Clear** removes overlays.