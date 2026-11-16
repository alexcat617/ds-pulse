# Git workflow — DS Pulse

**Goal:** Keep **`main`** as the stable line (what’s merged and deployable). Do new work on **branches**, open a **PR (pull request)** on GitHub, and **merge there** when checks and your Chrome test pass.

**Repo:** [alexcat617/ds-pulse](https://github.com/alexcat617/ds-pulse)

| Term | Plain meaning |
|------|----------------|
| **Branch** | A line of work; `main` is the official merged line |
| **PR** | Proposal to merge your branch into `main`; review + CI run here |
| **Merge** | On GitHub — combines the PR into `main` (you click **Merge**) |
| **origin** | Name of the GitHub remote |

---

## Branches

| Branch pattern | Purpose |
|----------------|---------|
| `main` | Latest **merged** features only |
| `feat/feat-XX-<name>` | One feature per FEAT (see [FEATURES.md](../FEATURES.md)) |
| `fix/<topic>` | Bugfixes (e.g. scan / UI) |
| `docs/<topic>` | Docs-only |

### Start a new FEAT (in Cursor terminal, repo root)

```powershell
git switch main
git pull
git switch -c feat/feat-05-component-variants
```

**Risk:** `git pull` on `main` only downloads GitHub updates; it does not delete your work.

---

## Your merge workflow (GitHub)

Recommended for this project:

1. **Cursor:** branch → commit → `git push -u origin HEAD`
2. **GitHub:** open the PR → wait for **PR check** (Actions) → review **Files changed**
3. **You:** click **Merge pull request** on GitHub (agent does **not** merge unless you ask)
4. **Cursor:** `git switch main` → `git pull`

Optional: **Settings → Branches →** require PR + approvals on `main` so nothing merges without your click.

---

## Chrome test (before you merge an extension PR)

Use this after `demo-app` or `extension/` changes.

### 1. Serve the demo (repo root)

```powershell
cd demo-app
npx --yes serve . -l 3000
```

Open **http://localhost:3000** in Chrome (Apex Metrics). Keep this terminal open.

### 2. Build the extension (reliable for testing)

```powershell
cd extension
npm install
npm run build
```

Prefer **`npm run build`** → load **`extension\.output\chrome-mv3`**.  
(`npm run dev` is for active coding; reload the extension on `chrome://extensions` if you use dev output.)

### 3. Load or reload in Chrome

1. **chrome://extensions** → Developer mode **on**
2. **Load unpacked** → select **`extension\.output\chrome-mv3`**
3. After each rebuild: click **Reload** on the DS Pulse card

### 4. Scan

1. Focus the **localhost:3000** tab
2. Open DS Pulse (puzzle icon → pin → side panel)
3. **Scan Current Page**

### What to expect by feature

| After merge | Check |
|-------------|--------|
| FEAT-02 | Positive **visible element count**; compliance still `--%` |
| FEAT-03+ | **Compliance %** + violation list (~**7** on demo; see `index.html` comment) |
| FEAT-04 | **Highlight all**; row click scrolls + pulse; **Clear** removes boxes |
| FEAT-05 | **Sync** → semantic Expected e.g. `primary backgroundColor → colors.primary`; **Apply** (secondary) passes; unstyled search still **Component** + palette **borderColor** |

Refresh the demo tab after reloading the extension if scan fails with a connection error.

---

## Merge checklist (per PR)

**In Cursor (before you open the PR):**

1. Acceptance criteria in `features/FEAT-XX-*.md` pass (Chrome test above).
2. For extension changes:

   ```powershell
   cd extension
   npm run test
   npm run typecheck
   npm run build
   ```

3. `demo-app/tokens.json` and `extension/public/tokens.json` stay in sync when tokens change (FEAT-05+ also uses bundled tokens in the content script — still keep both files aligned).

**On GitHub:**

4. PR check workflow green ([`.github/workflows/pr-check.yml`](../.github/workflows/pr-check.yml)).
5. You merge the PR.

**After merge:**

6. Update [FEATURES.md](../FEATURES.md) status (`done`) + Changelog if not already in the PR.

---

## Related docs

| Doc | Use |
|-----|-----|
| [PROJECT-SUMMARY-AND-WORKFLOW.md](PROJECT-SUMMARY-AND-WORKFLOW.md) | What we built, tokens vs components, designer workflow |
| [BUILD-PROMPTS.md](BUILD-PROMPTS.md) | Copy/paste prompts per FEAT for Cursor |
| [FEATURES.md](../FEATURES.md) | Status table and waves |