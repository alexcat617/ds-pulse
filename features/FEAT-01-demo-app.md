# FEAT-01: Apex UI demo app

| Field | Value |
|-------|-------|
| ID | FEAT-01 |
| Wave | A |
| Depends on | FEAT-00 |
| Maps to | Gemini Prompt 1 |

## Outcome

`demo-app/` with tokens, CSS, and a SaaS metrics dashboard containing **7 intentional violations**.

## Token source (`demo-app/tokens.json`)

- **colors:** primary `#4F46E5`, primaryHover `#4338CA`, surface `#FFFFFF`, background `#F8FAFC`, textPrimary `#0F172A`, textSecondary `#64748B`, border `#E2E8F0`, success `#10B981`, danger `#EF4444`
- **fontSizes:** `12px`, `14px`, `16px`, `24px`
- **borderRadii:** `6px`, `12px`
- **allowedComponents:** `.ds-btn`, `.ds-card`, `.ds-input`, `.ds-badge`

## Requirements

| ID | Requirement |
|----|-------------|
| REQ-01-01 | `ds.css` exposes tokens as CSS variables; styles for four component classes |
| REQ-01-02 | `index.html` realistic single-page SaaS metrics dashboard |
| REQ-01-03 | Exactly 7 violations (color, typography, radius, component) |
| REQ-01-04 | HTML comment **at bottom** of `index.html` listing all 7 |

## Acceptance criteria

- Visual QA in Chrome: dashboard looks credible; each listed violation is visible.
- No `spacing` token audit required (violations align with FEAT-03 rules).