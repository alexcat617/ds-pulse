import type { AuditResult } from "./audit/types";

export const OVERLAY_ROOT_ID = "ds-linter-overlay-root";

export type ScanPageMessage = { type: "SCAN_PAGE" };

export type ContentMessage = ScanPageMessage;

export type ScanCompleteMessage = {
  type: "SCAN_COMPLETE";
  result: AuditResult;
};

export type ScanErrorMessage = { type: "SCAN_ERROR"; error: string };

export type ContentResponse = ScanCompleteMessage | ScanErrorMessage;