export type RuleCategory = "Color" | "Typography" | "Radius" | "Component";

export interface TokenRuleset {
  name: string;
  colors: Record<string, string>;
  fontSizes: string[];
  borderRadii: string[];
  allowedComponents: string[];
}

export interface AuditNodeInput {
  nodeId: string;
  tagName: string;
  classNames: string[];
  computed: {
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    borderRadius?: string;
  };
}

export interface Violation {
  id: string;
  tagName: string;
  ruleCategory: RuleCategory;
  expected: string;
  actual: string;
  nodeId: string;
}

export interface AuditResult {
  nodesScanned: number;
  compliantNodes: number;
  compliancePercent: number;
  violations: Violation[];
  visibleElementCount: number;
}