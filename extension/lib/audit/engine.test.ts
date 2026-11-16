import { describe, expect, it } from "vitest";
import { runAudit } from "./engine";
import type { AuditNodeInput, TokenRuleset } from "./types";

const apexRules: TokenRuleset = {
  name: "Apex UI",
  colors: {
    primary: "#4F46E5",
    primaryHover: "#4338CA",
    surface: "#FFFFFF",
    background: "#F8FAFC",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    border: "#E2E8F0",
    success: "#10B981",
    danger: "#EF4444",
  },
  fontSizes: ["12px", "14px", "16px", "24px"],
  borderRadii: ["6px", "12px"],
  allowedComponents: [".ds-btn", ".ds-card", ".ds-input", ".ds-badge"],
};

/** Mirrors the 7 planted violations in demo-app/index.html (computed style snapshot). */
const demoViolations: AuditNodeInput[] = [
  {
    nodeId: "v1",
    tagName: "BUTTON",
    classNames: ["ds-btn", "btn-drift"],
    computed: {
      backgroundColor: "rgb(59, 130, 246)",
      color: "rgb(255, 255, 255)",
      fontSize: "14px",
      borderRadius: "6px",
    },
  },
  {
    nodeId: "v2",
    tagName: "P",
    classNames: ["layout__subtitle", "subtitle-drift"],
    computed: {
      color: "rgb(100, 116, 139)",
      fontSize: "13px",
    },
  },
  {
    nodeId: "v3",
    tagName: "ARTICLE",
    classNames: ["ds-card", "card-drift"],
    computed: {
      backgroundColor: "rgb(255, 255, 255)",
      borderRadius: "20px",
    },
  },
  {
    nodeId: "v4",
    tagName: "BUTTON",
    classNames: [],
    computed: { fontSize: "14px", color: "rgb(15, 23, 42)" },
  },
  {
    nodeId: "v5",
    tagName: "INPUT",
    classNames: [],
    computed: {
      fontSize: "14px",
      color: "rgb(15, 23, 42)",
      borderRadius: "6px",
    },
  },
  {
    nodeId: "v6",
    tagName: "P",
    classNames: ["delta-drift"],
    computed: { color: "rgb(59, 130, 246)", fontSize: "14px" },
  },
  {
    nodeId: "v7",
    tagName: "SPAN",
    classNames: ["ds-badge", "badge-drift"],
    computed: {
      backgroundColor: "rgb(254, 240, 138)",
      color: "rgb(79, 70, 229)",
      fontSize: "12px",
      borderRadius: "6px",
    },
  },
];

describe("runAudit", () => {
  it("finds exactly 7 violations on demo fixtures", () => {
    const result = runAudit(demoViolations, apexRules);
    expect(result.violations).toHaveLength(7);
    const categories = result.violations.map((v) => v.ruleCategory);
    expect(categories.filter((c) => c === "Color")).toHaveLength(3);
    expect(categories.filter((c) => c === "Typography")).toHaveLength(1);
    expect(categories.filter((c) => c === "Radius")).toHaveLength(1);
    expect(categories.filter((c) => c === "Component")).toHaveLength(2);
  });

  it("computes compliance from compliant nodes", () => {
    const nodes: AuditNodeInput[] = [
      {
        nodeId: "ok",
        tagName: "P",
        classNames: [],
        computed: { fontSize: "14px", color: "rgb(15, 23, 42)" },
      },
      ...demoViolations.slice(0, 1),
    ];
    const result = runAudit(nodes, apexRules);
    expect(result.nodesScanned).toBe(2);
    expect(result.compliantNodes).toBe(1);
    expect(result.compliancePercent).toBe(50);
  });
});