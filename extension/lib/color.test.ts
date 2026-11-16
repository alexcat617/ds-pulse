import { describe, expect, it } from "vitest";
import { normalizeColorToHex } from "./color";

describe("normalizeColorToHex", () => {
  it("normalizes rgb and hex", () => {
    expect(normalizeColorToHex("rgb(79, 70, 229)")).toBe("#4F46E5");
    expect(normalizeColorToHex("#3b82f6")).toBe("#3B82F6");
    expect(normalizeColorToHex("#fff")).toBe("#FFFFFF");
  });

  it("returns null for transparent", () => {
    expect(normalizeColorToHex("transparent")).toBeNull();
    expect(normalizeColorToHex("rgba(0,0,0,0)")).toBeNull();
  });
});