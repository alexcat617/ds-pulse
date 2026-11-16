# Project Spec: Design System Linter ("DS Pulse")

## Overview

Portfolio project: automated design system governance in the browser.

1. **`demo-app/`** — Mock SaaS dashboard (**Apex UI**) with 7 planted violations.
2. **`extension/`** — Manifest V3 Chrome extension (WXT + TypeScript): side panel, DOM audit, overlays.

Build is phased via [FEATURES.md](../FEATURES.md).

## Apex UI tokens (source: `demo-app/tokens.json`)

| Key | Values |
|-----|--------|
| colors | primary `#4F46E5`, primaryHover `#4338CA`, surface `#FFFFFF`, background `#F8FAFC`, textPrimary `#0F172A`, textSecondary `#64748B`, border `#E2E8F0`, success `#10B981`, danger `#EF4444` |
| fontSizes | `12px`, `14px`, `16px`, `24px` |
| borderRadii | `6px`, `12px` |
| allowedComponents | `.ds-btn`, `.ds-card`, `.ds-input`, `.ds-badge` |

Copy to `extension/public/tokens.json` when building the extension.

## Technical constraints

- **Manifest V3 only** — `chrome.sidePanel`, `chrome.scripting`, `chrome.runtime.sendMessage`.
- **Shadow DOM** — overlays in `#ds-linter-overlay-root`; scanner skips this subtree.
- **Color normalization** — RGB/RGBA → uppercase 6-digit hex before token compare.
- **Clean architecture** — audit engine in `extension/lib/audit/` (pure TypeScript).

## Repo structure

```
demo-app/     tokens.json, ds.css, index.html
extension/    WXT entrypoints, lib/audit/, public/tokens.json
features/     FEAT-XX specs
docs/         PROJECT-SPEC, GIT-WORKFLOW, BUILD-PROMPTS
```