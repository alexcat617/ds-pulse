import { runAudit } from "../lib/audit/engine";
import type { AuditNodeInput, AuditResult, TokenRuleset } from "../lib/audit/types";
import {
  countVisibleElements,
  isElementVisible,
  shouldAuditElement,
  shouldSkipTag,
} from "../lib/dom/visibility";
import {
  OVERLAY_ROOT_ID,
  emptyAuditResult,
  type ContentMessage,
  type ContentResponse,
} from "../lib/messages";
import { OverlayRenderer } from "../lib/overlay/renderer";

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
  map: Map<string, HTMLElement>;
} {
  nodeCounter = 0;
  const nodes: AuditNodeInput[] = [];
  const map = new Map<string, HTMLElement>();
  const root = document.body;
  if (!root) return { nodes, map };

  for (const el of Array.from(root.querySelectorAll("*"))) {
    if (shouldSkipTag(el.tagName)) continue;
    if (isInOverlayTree(el)) continue;
    if (!isElementVisible(el)) continue;
    if (!shouldAuditElement(el)) continue;
    if (!(el instanceof HTMLElement)) continue;

    const style = window.getComputedStyle(el);
    const nodeId = stampNodeId(el);
    map.set(nodeId, el);
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

  return { nodes, map };
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
    const overlay = new OverlayRenderer();
    let lastNodeMap = new Map<string, HTMLElement>();
    let lastResult: AuditResult | null = null;

    chrome.runtime.onMessage.addListener(
      (message: ContentMessage, _sender, sendResponse) => {
        if (message.type === "CLEAR_OVERLAYS") {
          overlay.clear();
          const result = emptyAuditResult();
          result.visibleElementCount = countVisibleElements(document.body);
          sendResponse({ type: "SCAN_COMPLETE", result });
          return true;
        }

        if (message.type === "SET_HIGHLIGHT_ALL") {
          if (message.result) lastResult = message.result;
          const violations = lastResult?.violations ?? [];
          overlay.setNodeMap(lastNodeMap);
          overlay.setViolations(violations);
          overlay.setHighlightAll(message.enabled);
          sendResponse({
            type: "SCAN_COMPLETE",
            result: lastResult ?? emptyAuditResult(),
          });
          return true;
        }

        if (message.type === "FOCUS_VIOLATION") {
          const el = lastNodeMap.get(message.nodeId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            overlay.setNodeMap(lastNodeMap);
            overlay.setViolations(lastResult?.violations ?? []);
            overlay.setHighlightAll(false);
            overlay.setPulse(message.nodeId);
            window.setTimeout(() => overlay.setPulse(message.nodeId), 400);
            window.setTimeout(() => overlay.setPulse(message.nodeId), 800);
          }
          sendResponse({
            type: "SCAN_COMPLETE",
            result: lastResult ?? emptyAuditResult(),
          });
          return true;
        }

        if (message.type === "SCAN_PAGE") {
          void (async () => {
            try {
              overlay.clear();
              const rules = await loadRuleset();
              const { nodes, map } = collectAuditNodes();
              lastNodeMap = map;
              const result = runAudit(nodes, rules);
              result.visibleElementCount = countVisibleElements(document.body);
              lastResult = result;
              overlay.setNodeMap(map);
              overlay.setViolations(result.violations);
              sendResponse({ type: "SCAN_COMPLETE", result });
            } catch (err) {
              sendResponse({
                type: "SCAN_ERROR",
                error: err instanceof Error ? err.message : "Scan failed",
              });
            }
          })();
          return true;
        }

        return false;
      },
    );
  },
});