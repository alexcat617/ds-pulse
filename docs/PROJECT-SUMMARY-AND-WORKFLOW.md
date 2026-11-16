# DS Pulse — what we built, where it goes, how designers use it

**Audience:** designers who prototype in code, PMs reviewing UI quality, engineers pairing on a design system.

**Related:** [PROJECT-SPEC.md](PROJECT-SPEC.md) (technical constraints), [FEATURES.md](../FEATURES.md) (delivery phases), [GIT-WORKFLOW.md](GIT-WORKFLOW.md) (Chrome test steps).

---

## 1. What this project is

**DS Pulse** is a browser-based **design system linter**: a Chrome extension that scans a real page, compares visible UI against a **token file** (primitives + optional **component recipes**), and shows **compliance %**, a **violation list**, and **on-page highlights**.

It is built as a **portfolio / prototype**, not a shipped SaaS product. The repo has two halves:

| Part | Role |
|------|------|
| **`demo-app/`** | “Apex UI” — a credible SaaS dashboard with **7 intentional violations** for demos and tests |
| **`extension/`** | Manifest V3 extension (WXT + TypeScript): side panel UI, audit engine, shadow-DOM overlays |

**Source of truth for rules:** `demo-app/tokens.json`, copied to `extension/public/tokens.json` when the extension is built.

**Live repo:** [github.com/alexcat617/ds-pulse](https://github.com/alexcat617/ds-pulse)

---

## 2. What we built (delivery waves)

Work shipped in **FEAT-00–05** plus a fix PR for scan reliability and side-panel styling (see [FEATURES.md](../FEATURES.md) for merge status).

### Wave A — Target experience

| Delivered | Meaning |
|-----------|---------|
| FEAT-00 | Repo, specs, git workflow, feature index |
| FEAT-01 | Demo dashboard + CSS tokens + planted violations (documented in an HTML comment) |

### Wave B — Linter core

| Delivered | Meaning |
|-----------|---------|
| FEAT-02 | Extension shell, side panel, content-script bridge |
| FEAT-03 | Pure TypeScript **audit engine**, compliance score, **Expected vs Actual** list |

### Wave C — Visual proof

| Delivered | Meaning |
|-----------|---------|
| FEAT-04 | Red **bounding boxes** in a closed shadow root, **Highlight all**, row click → scroll + pulse, sync on scroll/resize |

### Post-launch fix

- Tokens **bundled** in the content script (avoids “Failed to fetch” when loading rules).
- Side panel **dark-mode** styling so secondary actions (e.g. **Clear**) stay readable.

### Wave D — Semantic components (FEAT-05)

| Delivered | Meaning |
|-----------|---------|
| FEAT-05 | **Button variants** in `tokens.json` (`components.button`): **primary** and **secondary** recipes |
| Demo | **Upgrade** / **Sync** use `.ds-btn--primary`; **Apply** uses `.ds-btn--secondary`; CSS split by variant |
| Audit | For `.ds-btn` buttons, **Expected** names variant + token, e.g. `primary backgroundColor → colors.primary (#4F46E5)` |
| Fallback | Any `.ds-btn` **without** `--secondary` resolves to **primary** (including legacy plain `.ds-btn`) |

PR: [FEAT-05 component variants](https://github.com/alexcat617/ds-pulse/pull/8) — merge to land on `main`.

### What you can do today (demo flow)

1. Serve the demo (`demo-app`) and open it in Chrome.
2. Load the unpacked extension from `extension/.output/chrome-mv3` (after `npm run build`).
3. **Scan Current Page** → score + violations.
4. Toggle **Highlight all violations** → boxes on the page.
5. Click a violation row → scroll to element and pulse.

---

## 3. How the linter thinks (as built)

Understanding **tokens vs components** and the **two audit modes** explains what you see in the side panel.

### Tokens vs components (in this repo)

| | **Tokens** (`colors`, `fontSizes`, …) | **Components** (`components.button`, class rules) |
|---|--------------------------------------|---------------------------------------------------|
| **What** | Approved **values** (hex, px, …) | **Recipes** — which tokens belong on which control / variant |
| **Example** | `primary: #4F46E5`, `border: #E2E8F0` | Primary button: bg → `primary`, text → `surface` |
| **FEAT-03** | Flat allow-list for color, type, radius | “`<button>` needs `.ds-btn`” |
| **FEAT-05** | Same primitives, referenced by name in recipes | **Primary / secondary** bindings for `.ds-btn` |

### Layer 1 — Global token rules (most elements)

- **Colors** (`color`, `backgroundColor`, **`borderColor`** on audited nodes): value must be **some** token hex, unless a semantic component rule applies to that property.
- **Typography:** `font-size` must be on the scale.
- **Radius:** `border-radius` must be on the scale.
- **Class gates:** raw `<button>` / `<input>` must have `.ds-btn` / `.ds-input`; other tags with `ds-*` classes are audited too.

For failures here, **Expected** is often **“Approved token color”** (or a comma list for type/radius).

**Example:** unstyled search `<input>` (no `.ds-input`) → **Component** (missing class) **and** **Color** (browser default border e.g. `#767676` not in the palette). That border check is **not** semantic input styling — it is palette-wide.

### Layer 2 — Button variant rules (`.ds-btn` only)

When an element has **`ds-btn`**, the engine loads `components.button` from `tokens.json`:

| Variant | How it’s detected | Default bindings (FEAT-05) |
|---------|-------------------|----------------------------|
| **primary** | `ds-btn--primary`, or plain `ds-btn` (fallback) | `backgroundColor` → `primary`, `color` → `surface` |
| **secondary** | `ds-btn--secondary` | `backgroundColor` → `surface`, `color` → `textPrimary`, `borderColor` → `border` |

Mismatch → **Expected** like: `primary backgroundColor → colors.primary (#4F46E5)`.

Those properties are checked **semantically**; they are **not** double-checked with the generic palette message for the same CSS property.

**Demo:** **Sync data** (primary + drift CSS) shows semantic primary background failure; **Apply** (secondary, compliant) should pass variant checks.

### What is still not semantic

- **Inputs, badges, cards** — palette + class only (no `components.input` yet).
- **Hover / focus** — snapshot only; `primaryHover` is in tokens but not enforced on `:hover`.
- See [section 5](#5-making-this-robust-for-a-mature-design-system) for the rest of the maturity path.

### Snapshot, not full state coverage

Auditing uses **computed styles on the element as rendered now**. It does **not** automatically test `:hover`, `:focus`, or responsive breakpoints unless the element is actually in that state on screen.

### Overlays are non-interactive

The overlay root uses `pointer-events: none` so highlights do not block clicking the real page.

---

## 4. Designers who prototype in code — product workflow

This section is how you **use** DS Pulse (or a future version) while building UI, not how to code the extension.

### Mental model

| Traditional DS | DS Pulse angle |
|----------------|----------------|
| Figma libraries + design reviews | **Running UI in the browser** is the artifact under test |
| “Does this match the spec?” | **Automated diff** against `tokens.json` + component class rules |
| Spot-check in critique | **Scan** before PR / handoff; violations are shareable |

### Suggested workflow (lightweight)

1. **Start from tokens**  
   Copy or extend `demo-app/tokens.json` (or your product’s token JSON). Treat it as the contract the linter enforces.

2. **Prototype in HTML/CSS or your app**  
   Use token variables (e.g. Apex’s `ds.css` pattern), **component classes** (`ds-btn`, `ds-input`, …), and **variant modifiers** where defined (`ds-btn--primary`, `ds-btn--secondary`).

3. **Run the app locally**  
   Same origin you’ll scan (e.g. `http://localhost:3000` or your Vite/Next dev URL).

4. **Scan before you share**  
   Open the side panel → **Scan Current Page**. Fix or consciously accept each violation.

5. **Use highlights for critique**  
   **Highlight all** in a design review; click rows to walk stakeholders through drift on the **real** layout (not a static screenshot).

6. **Document intentional drift**  
   If something is wrong on purpose, note it (like the demo’s HTML comment checklist). Mature teams map that to exceptions in rules or a waive list.

7. **Sync tokens when they change**  
   When design updates tokens, update `tokens.json` and rebuild/reload the extension so the linter and product stay aligned.

### Good habits for code-first designers

- **Name components with DS classes** early (`.ds-btn` not raw `<button>`) so component rules help you.
- **Avoid one-off hex** in prototypes; use CSS variables tied to tokens.
- **Scan the page you care about** (the extension uses the **active tab**).
- **Refresh the tab** after reloading the extension so content scripts inject cleanly.

### Where this fits in a team process

| Stage | DS Pulse role |
|-------|----------------|
| Exploratory prototype | Optional; learn token set |
| Feature branch / PR | Scan key screens; target compliance trend |
| Design QA | Highlight-all walkthrough with PM/eng |
| Design system release | Bump `tokens.json`; re-scan reference apps |

It does **not** replace accessibility audits, content review, or Figma–code parity tools — it focuses on **token and component-class drift**.

---

## 5. Making this robust for a mature design system

The current build is a **v1 portfolio demo**. Below is a practical roadmap from “palette linter” to something teams could depend on.

### 5.1 Richer “Expected” and semantic rules

| Status | Area |
|--------|------|
| **Done (FEAT-05)** | Button **primary / secondary** in `tokens.json` → semantic Expected lines |
| **Still generic** | Non-button elements; unstyled native controls; missing DS classes |
| **Next** | `components.input`, `components.badge`, ghost/danger button variants, hover states |

**Implementation sketch for more components:** repeat the FEAT-05 pattern in `components.*` with `matchAnyClass` + `default` token bindings, or import Style Dictionary / Tokens Studio output.

### 5.2 States and interaction

- Audit **:hover** / **:focus-visible** via forced state in the content script or a small Playwright harness.
- Map `primaryHover` and similar tokens to **state-specific** expectations.
- Optional: only flag hover drift when the class indicates an interactive control.

### 5.3 Spacing, motion, elevation

Apex tokens today cover color, type, radius, and component **names** only. Mature systems add:

- Spacing scale (`4px` grid)
- Shadow / elevation tokens
- Duration and easing for motion

Each needs explicit audit rules (computed margin/padding, `box-shadow`, `transition-duration`).

### 5.4 Fewer false positives

| Issue | Mitigation |
|-------|------------|
| Unstyled native controls (`#F0F0F0` buttons) | Component rule already flags missing `.ds-btn`; tighten color rule to “only audit elements that claim DS classes” or ignore browser defaults when component violation exists |
| `#FFFFFF` text on buttons | Already allowed via `surface` in palette; semantic rules clarify intent |
| Badge tints not in JSON | Expand tokens or allow derived aliases in the token file |

### 5.5 Token pipeline and environments

- **Single source:** Figma Variables → Tokens Studio → `tokens.json` (no manual copy).
- **Versioned rulesets:** “Apex UI v2” JSON; extension picks ruleset by meta tag or data attribute on the page.
- **CI:** Headless scan in GitHub Actions on PRs (demo app or Storybook URLs).

### 5.6 Beyond this repo stack

| Direction | Benefit |
|-----------|---------|
| **Storybook** addon | Scan isolated stories; better coverage than one dashboard |
| **Nearest-token suggestion** | “Actual `#3B82F6` → closest `primary` ΔE …” |
| **Export report** | JSON/CSV for Jira/LINEAR tickets |
| **Cross-browser** | Firefox/Safari builds (today: Chrome MV3) |
| **Figma** | Compare code scan vs selected frame (separate integration) |

### 5.7 Governance

- **Exceptions:** `data-ds-pulse-ignore` or allowlist file with owner + expiry.
- **Severity:** warning vs error (color vs missing `ds-btn`).
- **Ownership:** design system team owns `tokens.json`; product teams consume via package or sync.

---

## 6. Architecture reference (for handoff)

```
demo-app/tokens.json  ──bundled──►  content script (lib/audit/)
     │                                      │
     │  colors, fontSizes, borderRadii      │  DOM walk + variant resolve
     │  components.button.variants          ▼
     └──────────────────────────►  violations → side panel + overlays
```

- **Audit engine:** pure TypeScript; unit-tested with fixtures mirroring the demo’s 7 violations + secondary button pass case.
- **Messages:** `chrome.tabs.sendMessage` between side panel and content script.
- **Build:** WXT (`npm run build` → `.output/chrome-mv3`).

---

## 7. Quick links

| Task | Doc / command |
|------|----------------|
| Chrome test checklist | [GIT-WORKFLOW.md](GIT-WORKFLOW.md) |
| Token list | [PROJECT-SPEC.md](PROJECT-SPEC.md) |
| Violation checklist (demo) | Comment at bottom of `demo-app/index.html` |
| Button variants spec | [FEAT-05](../features/FEAT-05-component-variants.md) |
| Build extension | `cd extension && npm run build` |

---

*Last aligned with repo state: FEAT-00–04 on `main`; FEAT-05 on branch / [PR #8](https://github.com/alexcat617/ds-pulse/pull/8); scan/token bundle fix (PR #7). Update when FEAT-05 merges or rules change materially.*