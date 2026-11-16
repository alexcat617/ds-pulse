import type { ContentMessage, ContentResponse } from "../../lib/messages";

const complianceEl = document.getElementById("compliance");
const metaEl = document.getElementById("meta");
const scanBtn = document.getElementById("scan-btn");

function setMeta(text: string): void {
  if (metaEl) metaEl.textContent = text;
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
  try {
    const tabId = await getActiveTabId();
    const response = await sendToTab(tabId, { type: "SCAN_PAGE" });
    if (response.type === "SCAN_ERROR") {
      setMeta(response.error);
      return;
    }
    if (complianceEl) complianceEl.textContent = "--%";
    setMeta(`${response.visibleElementCount} visible DOM elements`);
  } catch (err) {
    setMeta(err instanceof Error ? err.message : "Scan failed");
  }
}

scanBtn?.addEventListener("click", () => void runScan());