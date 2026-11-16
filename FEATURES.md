# Features: DS Pulse

Delivery layer between [docs/PROJECT-SPEC.md](docs/PROJECT-SPEC.md) and code in `demo-app/` + `extension/`. One file per feature in [`features/`](features/).

| Layer | Doc |
|-------|-----|
| Product | [docs/PROJECT-SPEC.md](docs/PROJECT-SPEC.md) |
| **Build** | **This file + `features/FEAT-XX.md`** |
| Git | [docs/GIT-WORKFLOW.md](docs/GIT-WORKFLOW.md) |
| Prompts | [docs/BUILD-PROMPTS.md](docs/BUILD-PROMPTS.md) |

Work item shape: Outcome → Requirements → Acceptance criteria → Build handoff.

---

## Status

| ID | Feature | Wave | Status | Branch |
|----|---------|------|--------|--------|
| [FEAT-00](features/FEAT-00-foundation.md) | Foundation: repo, docs, workflow | A | `done` | `feat/feat-00-foundation` |
| [FEAT-01](features/FEAT-01-demo-app.md) | Apex UI demo + 7 violations | A | `done` | `feat/feat-01-demo-app` |
| [FEAT-02](features/FEAT-02-side-panel-bridge.md) | Extension shell + DOM count bridge | B | `ready` | `feat/feat-02-side-panel-bridge` |
| [FEAT-03](features/FEAT-03-audit-engine.md) | Auditor, score, violation list | B | `ready` | `feat/feat-03-audit-engine` |
| [FEAT-04](features/FEAT-04-overlays.md) | Shadow overlays + interaction | C | `ready` | `feat/feat-04-overlays` |

**Status values:** `draft` → `ready` → `building` → `done` (merged to `main`)

---

## Build waves

| Wave | Features | Demo outcome |
|------|----------|--------------|
| **A: Target** | FEAT-00 → 01 | Repo on GitHub; demo dashboard with documented drift |
| **B: Linter core** | FEAT-02 → 03 | Chrome extension scans demo; score + violation list |
| **C: Visual proof** | FEAT-04 | On-page highlights, scroll-to-violation, resize sync |

---

## Build handoff contract

1. Work on `feat/feat-XX-<name>` branched from up-to-date `main`, never on `main`.
2. Sources: behavior → `features/FEAT-XX-*.md`; constraints → `docs/PROJECT-SPEC.md`; tokens → `demo-app/tokens.json` copied to `extension/public/tokens.json`.
3. Before finishing the FEAT: for extension FEATs, `cd extension && npm run test && npm run typecheck && npm run build`.
4. Chrome-test per [docs/GIT-WORKFLOW.md](docs/GIT-WORKFLOW.md) before opening a PR.
5. Update this status table + Changelog when merged.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-11-16 | FEAT-00–04 initial delivery |
| 2026-11-16 | FEAT-00 merged to `main`; public repo live |
| 2026-11-16 | FEAT-01 Apex UI demo app (`demo-app/`) |