# Git workflow — DS Pulse

**Goal:** `main` holds the latest merged feature. All work happens on branches and lands through pull requests (PRs).

**Repo:** [alexcat617/ds-pulse](https://github.com/alexcat617/ds-pulse)

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Last merged features only |
| `feat/feat-XX-<name>` | One branch per FEAT (see [FEATURES.md](../FEATURES.md)) |
| `docs/<topic>` | Docs-only |
| `fix/<topic>` | Small fixes |

Always branch from an up-to-date `main`:

```bash
git switch main
git pull
git switch -c feat/feat-03-audit-engine
```

## Chrome test (before each extension PR)

1. Open `demo-app/index.html` in Chrome (file URL or static server).
2. `cd extension && npm install && npm run dev`
3. `chrome://extensions` → Developer mode → **Load unpacked** → `.output/chrome-mv3-dev` (or build output WXT prints).
4. Open the demo tab → extension icon → side panel → **Scan Current Page**.
5. FEAT-02: expect a positive visible element count.
6. FEAT-03+: expect **7 violations** and compliance score; FEAT-04: test highlight toggle and row click scroll.

## Merge checklist (per FEAT)

1. Feature acceptance criteria in `features/FEAT-XX-*.md` pass.
2. Extension FEATs: `npm run test`, `npm run typecheck`, `npm run build` green in `extension/`.
3. [FEATURES.md](../FEATURES.md) status + Changelog updated.

## Protect `main` (optional, on GitHub)

**Settings → Branches →** require PR before merge; block force pushes to `main`.