import { runAudit } from "../lib/audit/engine";
import type { AuditNodeInput, TokenRuleset } from "../lib/audit/types";
import {
  countVisibleElements,
  isElementVisible,
  shouldAuditElement,
  shouldSkipTag,
} from "../lib/dom/visibility";
import { OVERLAY_ROOT_ID, type ContentMessage, type ContentResponse } from "../lib/messages";

let nodeCounter = 0;

function stampNodeId(el: HTMLElement): string {
  const existing = el.getAttribute("data-ds-pulse-id");
  if (existing) return existing;
  nodeCounter += 1;
  const id = `dsp-${nodeCounter}`;
  el.setAttribute("data-ds-pulse-id", id);
  return id;
}

function isInOverlayTree(el: Element): boolean {
  return Boolean(el.closest(`#${OVERLAY_ROOT_ID}`));
}

function collectAuditNodes(): {
  nodes: AuditNodeInput[];
} {
  nodeCounter = 0;
  const nodes: AuditNodeInput[] = [];
  const root = document.body;
  if (!root) return { nodes };

  for (const el of Array.from(root.querySelectorAll("*"))) {
    if (shouldSkipTag(el.tagName)) continue;
    if (isInOverlayTree(el)) continue;
    if (!isElementVisible(el)) continue;
    if (!shouldAuditElement(el)) continue;
    if (!(el instanceof HTMLElement)) continue;

    const style = window.getComputedStyle(el);
    const nodeId = stampNodeId(el);
    nodes.push({
      nodeId,
      tagName: el.tagName,
      classNames: Array.from(el.classList),
      computed: {
        color: style.color,
        backgroundColor: style.backgroundColor,
        fontSize: style.fontSize,
        borderRadius: style.borderRadius,
      },
    });
  }

  return { nodes };
}

async function loadRuleset(): Promise<TokenRuleset> {
  const url = chrome.runtime.getURL("/tokens.json");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load tokens.json (${res.status})`);
  return (await res.json()) as TokenRuleset;
}

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_idle",
  main() {
    chrome.runtime.onMessage.addListener(
      (message: ContentMessage, _sender, sendResponse) => {
        if (message.type !== "SCAN_PAGE") return false;

        void (async () => {
          try {
            const rules = await loadRuleset();
            const { nodes } = collectAuditNodes();
            const result = runAudit(nodes, rules);
            result.visibleElementCount = countVisibleElements(document.body);
            sendResponse({ type: "SCAN_COMPLETE", result } satisfies ContentResponse);
          } catch (err) {
            sendResponse({
              type: "SCAN_ERROR",
              error: err instanceof Error ? err.message : "Scan failed",
            });
          }
        })();

        return true;
      },
    );
  },
});