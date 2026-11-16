import { countVisibleElements } from "../lib/dom/visibility";
import type { ContentMessage, ContentResponse } from "../lib/messages";

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_idle",
  main() {
    chrome.runtime.onMessage.addListener(
      (message: ContentMessage, _sender, sendResponse) => {
        if (message.type !== "SCAN_PAGE") return false;

        try {
          const root = document.body;
          const visibleElementCount = root ? countVisibleElements(root) : 0;
          const response: ContentResponse = {
            type: "SCAN_COMPLETE",
            visibleElementCount,
          };
          sendResponse(response);
        } catch (err) {
          sendResponse({
            type: "SCAN_ERROR",
            error: err instanceof Error ? err.message : "Scan failed",
          });
        }
        return true;
      },
    );
  },
});