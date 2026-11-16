# FEAT-04: Interactive on-page overlays

| Field | Value |
|-------|-------|
| ID | FEAT-04 |
| Wave | C |
| Depends on | FEAT-03 |
| Maps to | Gemini Prompt 4 |

## Outcome

Shadow DOM overlays; highlight all; click violation to scroll and pulse; sync on scroll/resize.

## Requirements

| ID | Requirement |
|----|-------------|
| REQ-04-01 | `#ds-linter-overlay-root` on `body`, closed shadow, `pointer-events: none` |
| REQ-04-02 | Red bounding boxes + pill labels from `getBoundingClientRect()` |
| REQ-04-03 | **Highlight all violations** toggle in side panel |
| REQ-04-04 | Click row → `scrollIntoView({ behavior: 'smooth', block: 'center' })` + pulse |
| REQ-04-05 | Reposition on `scroll` and `resize` (rAF throttle) |

## Acceptance criteria

- All 7 demo violations highlight.
- Row click targets correct element; boxes track after scroll/resize.