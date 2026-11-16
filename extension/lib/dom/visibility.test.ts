import { describe, expect, it } from "vitest";
import { shouldSkipTag } from "./visibility";

describe("visibility helpers", () => {
  it("skips non-rendered tags", () => {
    expect(shouldSkipTag("SCRIPT")).toBe(true);
    expect(shouldSkipTag("STYLE")).toBe(true);
    expect(shouldSkipTag("DIV")).toBe(false);
  });
});