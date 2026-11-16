# FEAT-05: Button component variants (semantic audit)

| Field | Value |
|-------|-------|
| ID | FEAT-05 |
| Wave | D |
| Depends on | FEAT-03 |
| Maps to | Product maturity — tokens vs components |

## Outcome

Button **variants** (`primary`, `secondary`) with **semantic** color expectations in violations (e.g. `colors.primary`), not only “approved token color.” Plain `.ds-btn` resolves to **primary** (fallback).

## Requirements

| ID | Requirement |
|----|-------------|
| REQ-05-01 | `tokens.json` `components.button` with `variants` and `fallbackVariant` |
| REQ-05-02 | Demo CSS/HTML: `.ds-btn--primary`, `.ds-btn--secondary` on Apex dashboard |
| REQ-05-03 | Engine: audit `ds-btn` against variant token bindings (default state only) |
| REQ-05-04 | Violation `expected` names token + variant + property |
| REQ-05-05 | Vitest for variant pass/fail; demo fixture count unchanged where possible |

## Out of scope

Hover/focus states, non-button components, token pipeline.

## Acceptance criteria

- Scan demo: Sync (drift) shows **primary** `backgroundColor` expectation with token name.
- Apply (`secondary`) passes when styles match tokens.
- Non-button checks unchanged (7 planted violations story preserved on full page scan).

## Build handoff

Branch `feat/feat-05-component-variants` → PR → `main`.