# FEAT-03: DOM audit engine + scoring

| Field | Value |
|-------|-------|
| ID | FEAT-03 |
| Wave | B |
| Depends on | FEAT-02 |
| Maps to | Gemini Prompt 3 |

## Outcome

Pure TS auditor; side panel shows **compliance %** and violation list with **Expected vs Actual**.

## Requirements

| ID | Requirement |
|----|-------------|
| REQ-03-01 | Traverse visible elements; skip overlay root, hidden, script/style |
| REQ-03-02 | Audit tags: button, input, h1–h3, p, span, a, `.ds-*` |
| REQ-03-03 | Rules: color/bg, font-size, border-radius, component classes |
| REQ-03-04 | Score: `compliantNodes / totalAuditedNodes * 100` |
| REQ-03-05 | Violation: `id`, `tagName`, `ruleCategory`, expected, actual, element ref for overlays |
| REQ-03-06 | Vitest for color normalization + auditor |

## Acceptance criteria

- Scan `demo-app/index.html` → **7 violations** matching bottom comment.
- Side panel renders score and list; no overlays required yet.