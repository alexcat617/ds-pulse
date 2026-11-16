import { normalizeColorToHex } from "../color";
import type {
  AuditNodeInput,
  AuditResult,
  RuleCategory,
  TokenRuleset,
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

function auditNode(
  node: AuditNodeInput,
  rules: TokenRuleset,
  colors: Set<string>,
): Violation[] {
  const violations: Violation[] = [];
  const fonts = new Set(rules.fontSizes);
  const radii = new Set(rules.borderRadii);

  for (const prop of ["backgroundColor", "color"] as const) {
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