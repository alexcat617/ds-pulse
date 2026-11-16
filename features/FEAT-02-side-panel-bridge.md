# FEAT-02: Extension shell + side panel bridge

| Field | Value |
|-------|-------|
| ID | FEAT-02 |
| Wave | B |
| Depends on | FEAT-01 |
| Maps to | Gemini Prompt 2 |

## Outcome

WXT MV3 extension with side panel; **Scan Current Page** returns **visible DOM element count** only.

## Requirements

| ID | Requirement |
|----|-------------|
| REQ-02-01 | `extension/` WXT + TypeScript; `sidePanel` permission |
| REQ-02-02 | Side panel: scan button + score placeholder `--%` |
| REQ-02-03 | Content script counts visible elements; messaging via `chrome.tabs.sendMessage` |
| REQ-02-04 | `extension/public/tokens.json` copied from `demo-app/tokens.json` |

## Out of scope

Audit engine, violations, overlays (FEAT-03/04).

## Acceptance criteria

- `npm run dev` loads unpacked in Chrome.
- Scan on demo tab shows positive count (not compliance %).