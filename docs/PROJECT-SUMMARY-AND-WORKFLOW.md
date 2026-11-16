# DS Pulse — what we built, where it goes, how designers use it

**Audience:** designers who prototype in code, PMs reviewing UI quality, engineers pairing on a design system.

**Related:** [PROJECT-SPEC.md](PROJECT-SPEC.md) (technical constraints), [FEATURES.md](../FEATURES.md) (delivery phases), [GIT-WORKFLOW.md](GIT-WORKFLOW.md) (Chrome test steps).

---

## 1. What this project is

**DS Pulse** is a browser-based **design system linter**: a Chrome extension that scans a real page, compares visible UI against a **token file** (colors, type scale, radii, component classes), and shows **compliance %**, a **violation list**, and **on-page highlights**.

It is built as a **portfolio / prototype**, not a shipped SaaS product. The repo has two halves:

| Part | Role |
|------|------|
| **`demo-app/`** | “Apex UI” — a credible SaaS dashboard with **7 intentional violations** for demos and tests |
| **`extension/`** | Manifest V3 extension (WXT + TypeScript): side panel UI, audit engine, shadow-DOM overlays |

**Source of truth for rules:** `demo-app/tokens.json`, copied to `extension/public/tokens.json` when the extension is built.

**Live repo:** [github.com/alexcat617/ds-pulse](https://github.com/alexcat617/ds-pulse)

---

## 2. What we built (delivery waves)

Work was shipped in four features (FEAT-00–04) plus a small fix PR for scan reliability and side-panel styling.

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

- **Primary / secondary** button variants (`.ds-btn--primary`, `.ds-btn--secondary`; plain `.ds-btn` → primary).
- Violations cite **variant + token**, e.g. `primary backgroundColor → colors.primary (#4F46E5)`.

### What you can do today (demo flow)

1. Serve the demo (`demo-app`) and open it in Chrome.
2. Load the unpacked extension from `extension/.output/chrome-mv3` (after `npm run build`).
3. **Scan Current Page** → score + violations.
4. Toggle **Highlight all violations** → boxes on the page.
5. Click a violation row → scroll to element and pulse.

---

## 3. How the linter thinks (as built)

Understanding these limits explains both **false positives** and **vague copy** in the UI.

### Token rules (from `tokens.json`)

- **Colors:** flat list of approved hex values (primary, surface, text, etc.).
- **Typography:** allowed `font-size` values only.
- **Radius:** allowed `border-radius` values only.
- **Components:** `<button>` must use class `ds-btn`; `<input>` must use `ds-input`; plus audit of headings, paragraphs, spans, links, and anything with a `ds-*` class.

### Color checks are palette-wide, not semantic

The engine asks: *“Is this computed color one of the token hex values?”*  
It does **not** ask: *“Should this **primary** button use `colors.primary`?”*

So **Expected** often shows **“Approved token color”** — meaning *any* token color would pass, not *which* token is correct for that control. That is **intentionally simple** for the prototype; see [section 5](#5-making-this-robust-for-a-mature-design-system).

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
   Use token variables (e.g. Apex’s `ds.css` pattern) and **allowed component classes** (`ds-btn`, `ds-card`, …).

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

| Today | Mature direction |
|-------|------------------|
| `Expected: Approved token color` | `Expected: colors.primary (#4F46E5) for .ds-btn background` |
| Any palette hex OK on any element | **Role bindings**: button primary/secondary/ghost, text default/muted, surface/card |
| One rule for all `<button>` | Rules keyed off **class variants** (e.g. `.ds-btn--secondary`) |

**Implementation sketch:** extend `tokens.json` with a `rules` or `components` section (per-variant allowed tokens per CSS property), or import Style Dictionary / Tokens Studio output.

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
demo-app/tokens.json  ──copy──►  extension/public/tokens.json
                                         │
                                         ▼
              Content script: DOM walk → audit engine (lib/audit/)
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
            Side panel (score + list)              Overlay (shadow DOM)
```

- **Audit engine:** pure TypeScript; unit-tested with fixtures mirroring the demo’s 7 violations.
- **Messages:** `chrome.tabs.sendMessage` between side panel and content script.
- **Build:** WXT (`npm run build` → `.output/chrome-mv3`).

---

## 7. Quick links

| Task | Doc / command |
|------|----------------|
| Chrome test checklist | [GIT-WORKFLOW.md](GIT-WORKFLOW.md) |
| Token list | [PROJECT-SPEC.md](PROJECT-SPEC.md) |
| Violation checklist (demo) | Comment at bottom of `demo-app/index.html` |
| Build extension | `cd extension && npm run build` |

---

*Last aligned with repo state: FEAT-00–04 on `main`, scan/token bundle fix merged (PR #7). Update this doc when tokens or audit rules change materially.*