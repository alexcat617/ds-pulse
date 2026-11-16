# FEAT-00: Foundation

| Field | Value |
|-------|-------|
| ID | FEAT-00 |
| Wave | A |
| Depends on | — |
| Blocks | FEAT-01–04 |

## Outcome

Public GitHub repository with spec, feature index, git workflow, and build prompts. `main` is the stable line for merged work.

## Requirements

| ID | Requirement |
|----|-------------|
| REQ-00-01 | Root `README.md`, `SPEC.md`, `FEATURES.md`, `.gitignore` |
| REQ-00-02 | `docs/PROJECT-SPEC.md`, `docs/GIT-WORKFLOW.md`, `docs/BUILD-PROMPTS.md` |
| REQ-00-03 | `features/FEAT-00` through `FEAT-04` stub files |
| REQ-00-04 | Git repo on `main`; public remote on GitHub |

## Acceptance criteria

- Clone from GitHub succeeds.
- FEATURES.md lists FEAT-00–04 with branch naming.
- README explains opening this folder in Cursor (not 3d-gallery).

## Build handoff

Branch `feat/feat-00-foundation` → PR → `main`. Extension code lands in FEAT-02.