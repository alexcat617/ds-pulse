export type ScanPageMessage = { type: "SCAN_PAGE" };

export type ContentMessage = ScanPageMessage;

export type ScanCompleteMessage = {
  type: "SCAN_COMPLETE";
  visibleElementCount: number;
};

export type ScanErrorMessage = { type: "SCAN_ERROR"; error: string };

export type ContentResponse = ScanCompleteMessage | ScanErrorMessage;