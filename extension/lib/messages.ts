import type { AuditResult } from "./audit/types";

export const OVERLAY_ROOT_ID = "ds-linter-overlay-root";

export type ScanPageMessage = { type: "SCAN_PAGE" };
export type ClearOverlaysMessage = { type: "CLEAR_OVERLAYS" };
export type SetHighlightAllMessage = {
  type: "SET_HIGHLIGHT_ALL";
  enabled: boolean;
  result?: AuditResult;
};
export type FocusViolationMessage = {
  type: "FOCUS_VIOLATION";
  nodeId: string;
  violationId: string;
};

export type ContentMessage =
  | ScanPageMessage
  | ClearOverlaysMessage
  | SetHighlightAllMessage
  | FocusViolationMessage;

export type ScanCompleteMessage = {
  type: "SCAN_COMPLETE";
  result: AuditResult;
};

export type ScanErrorMessage = { type: "SCAN_ERROR"; error: string };

export type ContentResponse = ScanCompleteMessage | ScanErrorMessage;

const emptyResult = (): AuditResult => ({
  nodesScanned: 0,
  compliantNodes: 0,
  compliancePercent: 100,
  violations: [],
  visibleElementCount: 0,
});

export function emptyAuditResult(): AuditResult {
  return emptyResult();
}