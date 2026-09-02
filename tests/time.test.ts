import { describe, it, expect } from "vitest";
import { normalizeTime } from "@/lib/services/reservations";

describe("time normalisation", () => {
  it("keeps 24h times", () => {
    expect(normalizeTime("18:30")).toBe("18:30");
    expect(normalizeTime("09:05")).toBe("09:05");
  });

  it("converts 12h to 24h", () => {
    expect(normalizeTime("7:00 PM")).toBe("19:00");
    expect(normalizeTime("12:00 PM")).toBe("12:00");
    expect(normalizeTime("12:00 AM")).toBe("00:00");
    expect(normalizeTime("07:30 AM")).toBe("07:30");
  });

  it("pads single-digit hours", () => {
    expect(normalizeTime("6 PM")).toBe("18:00");
    expect(normalizeTime("5:30 PM")).toBe("17:30");
  });

  it("throws on malformed input", () => {
    expect(() => normalizeTime("not-a-time")).toThrow();
    expect(() => normalizeTime("25:00")).toThrow();
  });
});