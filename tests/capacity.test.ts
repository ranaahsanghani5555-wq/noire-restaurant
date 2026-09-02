import { describe, it, expect } from "vitest";
import { canFit } from "@/lib/services/reservations";

describe("seat-capacity engine", () => {
  it("fits a party in a single sufficient table", () => {
    const free = [{ capacity: 2 }, { capacity: 4 }, { capacity: 6 }];
    expect(canFit(free, 4)).toBe(true);
    expect(canFit(free, 6)).toBe(true);
  });

  it("rejects a party larger than any combo", () => {
    const free = [{ capacity: 2 }, { capacity: 4 }];
    expect(canFit(free, 7)).toBe(false);
  });

  it("rejects with no free tables", () => {
    expect(canFit([], 1)).toBe(false);
  });

  it("seats a party by combining tables", () => {
    const free = [{ capacity: 2 }, { capacity: 2 }, { capacity: 4 }];
    expect(canFit(free, 8)).toBe(true);
    expect(canFit(free, 9)).toBe(false);
  });

  it("handles zero guests as trivially seatable", () => {
    expect(canFit([], 0)).toBe(true);
  });
});