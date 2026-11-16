# Build prompts (copy/paste)

Linked to [FEATURES.md](../FEATURES.md). Run **one prompt per branch**; Chrome-test before the next.

## FEAT-01: Mock design system + broken dashboard (Prompt 1)

```text
Build FEAT-01 per features/FEAT-01-demo-app.md and @SPEC.md.
Create demo-app/tokens.json, ds.css, index.html with Apex UI (Gemini token set).
Plant 7 violations; list all 7 in an HTML comment at the bottom of index.html.
```

## FEAT-02: Extension shell + bridge (Prompt 2)

```text
Build FEAT-02 per features/FEAT-02-side-panel-bridge.md.
WXT Manifest V3 TypeScript in extension/; side panel with Scan + --% placeholder.
Content script returns visible DOM element count via chrome.tabs.sendMessage.
Copy demo-app/tokens.json to extension/public/tokens.json.
```

## FEAT-03: Audit engine (Prompt 3)

```text
Build FEAT-03 per features/FEAT-03-audit-engine.md.
Pure TS auditor in extension/lib/audit/; normalize colors to #RRGGBB.
Side panel shows compliance % and Expected vs Actual violation list.
Vitest for color normalization and auditor fixtures.
```

## FEAT-04: Overlays (Prompt 4)

```text
Build FEAT-04 per features/FEAT-04-overlays.md.
#ds-linter-overlay-root closed shadow DOM; highlight all toggle; click row to scrollIntoView + pulse.
Recalculate boxes on scroll and resize.
```

## FEAT-05: Button variant semantic audit (Prompt 5)

```text
Build FEAT-05 per features/FEAT-05-component-variants.md and @SPEC.md.
Extend demo-app/tokens.json with components.button variants (primary, secondary; plain .ds-btn → primary).
Update demo-app ds.css and index.html (.ds-btn--primary, .ds-btn--secondary).
Audit engine: semantic Expected for .ds-btn (e.g. primary backgroundColor → colors.primary).
Copy tokens to extension/public/tokens.json; Vitest for variants.
Open PR; do not merge to main — I merge on GitHub.
Chrome-test per docs/GIT-WORKFLOW.md before opening the PR.
```