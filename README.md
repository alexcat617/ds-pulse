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
| [docs/GIT-WORKFLOW.md](docs/GIT-WORKFLOW.md) | Branches, PRs, Chrome test before merge |
| [docs/PROJECT-SUMMARY-AND-WORKFLOW.md](docs/PROJECT-SUMMARY-AND-WORKFLOW.md) | What we built + designer workflow |

## Open this project in Cursor

**File → Open Folder** → `ds-pulse` (sibling of `3d-gallery`, not inside it).

## Quick start

### Demo app

```bash
cd demo-app
npx --yes serve . -l 3000
```

Open **http://localhost:3000** in Chrome.

### Extension

```bash
cd extension
npm install
npm run build
```

Load unpacked from **`.output/chrome-mv3`** at `chrome://extensions`, open the demo tab, side panel → **Scan Current Page**.

Full steps: [docs/GIT-WORKFLOW.md](docs/GIT-WORKFLOW.md).