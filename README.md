# DS Pulse — Design System Linter

Portfolio project demonstrating **automated design system governance in the browser**.

| Part | Purpose |
|------|---------|
| [`demo-app/`](demo-app/) | Mock SaaS dashboard (**Apex UI**) with 7 planted violations |
| [`extension/`](extension/) | Manifest V3 Chrome extension (WXT + TypeScript) |

| Doc | Purpose |
|-----|---------|
| [SPEC.md](SPEC.md) | Spec index for Cursor |
| [FEATURES.md](FEATURES.md) | FEAT status, waves, handoff contract |
| [docs/GIT-WORKFLOW.md](docs/GIT-WORKFLOW.md) | Branches + Chrome test steps |

## Open this project in Cursor

**File → Open Folder** → `ds-pulse` (sibling of `3d-gallery`, not inside it).

## Quick start

### Demo app

Open [`demo-app/index.html`](demo-app/index.html) in Chrome.

### Extension

```bash
cd extension
npm install
npm run dev
```

Load unpacked from `.output/chrome-mv3-dev` in `chrome://extensions`, open the demo tab, use the side panel **Scan Current Page**.