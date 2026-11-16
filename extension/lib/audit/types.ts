export type RuleCategory = "Color" | "Typography" | "Radius" | "Component";

export interface VariantStyleTokens {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
}

export interface ButtonVariantSpec {
  matchAnyClass: string[];
  default: VariantStyleTokens;
}

export interface ButtonComponentSpec {
  baseClass: string;
  fallbackVariant: string;
  variants: Record<string, ButtonVariantSpec>;
}

export interface ComponentSpecs {
  button?: ButtonComponentSpec;
}

export interface TokenRuleset {
  name: string;
  colors: Record<string, string>;
  fontSizes: string[];
  borderRadii: string[];
  allowedComponents: string[];
  components?: ComponentSpecs;
}

export interface AuditNodeInput {
  nodeId: string;
  tagName: string;
  classNames: string[];
  computed: {
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
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