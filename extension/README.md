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

## FEAT-02 behavior

- Side panel shows compliance placeholder `--%` and **Scan Current Page**.
- Content script counts **visible DOM elements** on the active tab and returns the count via `chrome.tabs.sendMessage`.
- Token rules live in `public/tokens.json` (copied from `demo-app/tokens.json`); audit UI lands in FEAT-03.