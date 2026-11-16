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

## Behavior (FEAT-03)

- **Scan Current Page** runs the audit engine in `lib/audit/` against `public/tokens.json`.
- Side panel shows **compliance %** and a violation list (Expected vs Actual).
- Overlays and highlight toggle land in FEAT-04.