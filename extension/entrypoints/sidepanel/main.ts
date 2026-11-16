import type { AuditResult } from "../../lib/audit/types";
import type { ContentMessage, ContentResponse } from "../../lib/messages";

const complianceEl = document.getElementById("compliance");
const metaEl = document.getElementById("meta");
const listEl = document.getElementById("violations");
const scanBtn = document.getElementById("scan-btn");

function setMeta(text: string): void {
  if (metaEl) metaEl.textContent = text;
}

function renderResult(result: AuditResult): void {
  if (complianceEl) complianceEl.textContent = `${result.compliancePercent}%`;
  setMeta(
    `${result.violations.length} violation(s) · ${result.nodesScanned} nodes audited · ${result.visibleElementCount} visible elements`,
  );

  if (!listEl) return;
  listEl.innerHTML = "";
  for (const v of result.violations) {
    const li = document.createElement("li");
    li.dataset.violationId = v.id;
    li.dataset.nodeId = v.nodeId;
    li.innerHTML = `<strong>${v.ruleCategory}</strong> &lt;${v.tagName.toLowerCase()}&gt;<br><span class="pair"><span>Expected</span> ${escapeHtml(v.expected)}</span><br><span class="pair"><span>Actual</span> ${escapeHtml(v.actual)}</span>`;
    listEl.appendChild(li);
  }
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function getActiveTabId(): Promise<number> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error("No active tab");
  return tab.id;
}

async function sendToTab(
  tabId: number,
  message: ContentMessage,
): Promise<ContentResponse> {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response: ContentResponse) => {
      const err = chrome.runtime.lastError;
      if (err) {
        reject(new Error(err.message));
        return;
      }
      if (!response) {
        reject(new Error("No response from content script"));
        return;
      }
      resolve(response);
    });
  });
}

async function runScan(): Promise<void> {
  setMeta("Scanning…");
  if (listEl) listEl.innerHTML = "";
  try {
    const tabId = await getActiveTabId();
    const response = await sendToTab(tabId, { type: "SCAN_PAGE" });
    if (response.type === "SCAN_ERROR") {
      setMeta(response.error);
      return;
    }
    renderResult(response.result);
  } catch (err) {
    setMeta(err instanceof Error ? err.message : "Scan failed");
  }
}

scanBtn?.addEventListener("click", () => void runScan());