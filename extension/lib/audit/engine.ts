import { normalizeColorToHex } from "../color";
import type {
  AuditNodeInput,
  AuditResult,
  ButtonComponentSpec,
  RuleCategory,
  TokenRuleset,
  VariantStyleTokens,
  Violation,
} from "./types";

function paletteColors(rules: TokenRuleset): Set<string> {
  return new Set(
    Object.values(rules.colors).map((c) => c.toUpperCase()),
  );
}

let violationCounter = 0;

function nextViolationId(nodeId: string, category: RuleCategory): string {
  violationCounter += 1;
  return `${nodeId}-${category}-${violationCounter}`;
}

export function resetViolationCounter(): void {
  violationCounter = 0;
}

function normalizeRadius(radius: string): string {
  const first = radius.split(/\s+/)[0] ?? radius;
  return first;
}

function resolveTokenHex(
  rules: TokenRuleset,
  tokenKey: string,
): string | null {
  const raw = rules.colors[tokenKey];
  if (!raw) return null;
  return normalizeColorToHex(raw);
}

function resolveButtonVariant(
  classNames: string[],
  spec: ButtonComponentSpec,
): string {
  if (spec.variants.secondary?.matchAnyClass.some((c) => classNames.includes(c))) {
    return "secondary";
  }
  if (spec.variants.primary?.matchAnyClass.some((c) => classNames.includes(c))) {
    return "primary";
  }
  return spec.fallbackVariant;
}

function auditButtonVariant(
  node: AuditNodeInput,
  rules: TokenRuleset,
  spec: ButtonComponentSpec,
): Violation[] {
  if (!node.classNames.includes(spec.baseClass)) return [];

  const variantName = resolveButtonVariant(node.classNames, spec);
  const variant = spec.variants[variantName];
  if (!variant) return [];

  const violations: Violation[] = [];
  const props = Object.keys(variant.default) as (keyof VariantStyleTokens)[];

  for (const prop of props) {
    const tokenKey = variant.default[prop];
    if (!tokenKey) continue;

    const expectedHex = resolveTokenHex(rules, tokenKey);
    if (!expectedHex) continue;

    const raw = node.computed[prop];
    if (!raw) continue;

    const actualHex = normalizeColorToHex(raw);
    if (!actualHex) continue;

    if (actualHex === expectedHex) continue;

    violations.push({
      id: nextViolationId(node.nodeId, "Color"),
      tagName: node.tagName,
      ruleCategory: "Color",
      expected: `${variantName} ${prop} → colors.${tokenKey} (${expectedHex})`,
      actual: `${prop}: ${actualHex}`,
      nodeId: node.nodeId,
    });
  }

  return violations;
}

function usesSemanticButton(node: AuditNodeInput, rules: TokenRuleset): boolean {
  const spec = rules.components?.button;
  if (!spec) return false;
  return node.tagName === "BUTTON" && node.classNames.includes(spec.baseClass);
}

function auditGenericColors(
  node: AuditNodeInput,
  colors: Set<string>,
  skipProps: Set<string>,
): Violation[] {
  const violations: Violation[] = [];

  for (const prop of ["backgroundColor", "color", "borderColor"] as const) {
    if (skipProps.has(prop)) continue;
    const raw = node.computed[prop];
    if (!raw) continue;
    const hex = normalizeColorToHex(raw);
    if (!hex || colors.has(hex)) continue;
    violations.push({
      id: nextViolationId(node.nodeId, "Color"),
      tagName: node.tagName,
      ruleCategory: "Color",
      expected: "Approved token color",
      actual: `${prop}: ${hex}`,
      nodeId: node.nodeId,
    });
  }

  return violations;
}

function auditNode(
  node: AuditNodeInput,
  rules: TokenRuleset,
  colors: Set<string>,
): Violation[] {
  const violations: Violation[] = [];
  const fonts = new Set(rules.fontSizes);
  const radii = new Set(rules.borderRadii);

  const buttonSpec = rules.components?.button;
  const semanticButton = usesSemanticButton(node, rules);

  if (semanticButton && buttonSpec) {
    violations.push(...auditButtonVariant(node, rules, buttonSpec));
    const variant = buttonSpec.variants[resolveButtonVariant(node.classNames, buttonSpec)];
    const auditedProps = new Set(
      Object.keys(variant?.default ?? {}) as Array<keyof VariantStyleTokens>,
    );
    violations.push(...auditGenericColors(node, colors, auditedProps));
  } else {
    violations.push(...auditGenericColors(node, colors, new Set()));
  }

  const fontSize = node.computed.fontSize;
  if (fontSize && !fonts.has(fontSize)) {
    violations.push({
      id: nextViolationId(node.nodeId, "Typography"),
      tagName: node.tagName,
      ruleCategory: "Typography",
      expected: rules.fontSizes.join(", "),
      actual: fontSize,
      nodeId: node.nodeId,
    });
  }

  const radius = node.computed.borderRadius;
  if (radius) {
    const normalized = normalizeRadius(radius);
    if (normalized !== "0px" && !radii.has(normalized)) {
      violations.push({
        id: nextViolationId(node.nodeId, "Radius"),
        tagName: node.tagName,
        ruleCategory: "Radius",
        expected: rules.borderRadii.join(", "),
        actual: normalized,
        nodeId: node.nodeId,
      });
    }
  }

  if (node.tagName === "BUTTON" && !node.classNames.includes("ds-btn")) {
    violations.push({
      id: nextViolationId(node.nodeId, "Component"),
      tagName: node.tagName,
      ruleCategory: "Component",
      expected: ".ds-btn",
      actual: `classes: ${node.classNames.join(" ") || "(none)"}`,
      nodeId: node.nodeId,
    });
  }

  if (node.tagName === "INPUT" && !node.classNames.includes("ds-input")) {
    violations.push({
      id: nextViolationId(node.nodeId, "Component"),
      tagName: node.tagName,
      ruleCategory: "Component",
      expected: ".ds-input",
      actual: `classes: ${node.classNames.join(" ") || "(none)"}`,
      nodeId: node.nodeId,
    });
  }

  return violations;
}

export function runAudit(
  nodes: AuditNodeInput[],
  rules: TokenRuleset,
): AuditResult {
  resetViolationCounter();
  const colors = paletteColors(rules);
  const violations: Violation[] = [];
  for (const node of nodes) {
    violations.push(...auditNode(node, rules, colors));
  }

  const nodesScanned = nodes.length;
  const nonCompliant = new Set(violations.map((v) => v.nodeId));
  const compliantNodes = nodesScanned - nonCompliant.size;
  const compliancePercent =
    nodesScanned === 0
      ? 100
      : Math.round((compliantNodes / nodesScanned) * 100);

  return {
    nodesScanned,
    compliantNodes,
    compliancePercent,
    violations,
    visibleElementCount: 0,
  };
}