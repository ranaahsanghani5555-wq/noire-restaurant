import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, isStrongEnough } from "@/lib/auth/password";

describe("password hashing (argon2id)", () => {
  it("hashes and verifies a password", async () => {
    const hash = await hashPassword("CorrectHorse123!");
    expect(hash.startsWith("$argon2id$")).toBe(true);
    expect(hash).not.toContain("CorrectHorse123!");
    expect(await verifyPassword("CorrectHorse123!", hash)).toBe(true);
  });

  it("rejects the wrong password", async () => {
    const hash = await hashPassword("CorrectHorse123!");
    expect(await verifyPassword("WrongPass!", hash)).toBe(false);
  });

  it("returns false for a malformed hash", async () => {
    expect(await verifyPassword("anything", "not-a-hash")).toBe(false);
  });

  it("is unique for identical inputs", async () => {
    const a = await hashPassword("SamePass123!");
    const b = await hashPassword("SamePass123!");
    expect(a).not.toEqual(b); // random salt
  });
});

describe("password strength policy", () => {
  it("accepts a strong password", () => {
    expect(isStrongEnough("Passw0rd!")).toBe(true);
  });
  it("rejects too-short", () => {
    expect(isStrongEnough("A1b!")).toBe(false);
  });
  it("rejects missing number", () => {
    expect(isStrongEnough("Password!")).toBe(false);
  });
  it("rejects missing uppercase", () => {
    expect(isStrongEnough("password1!")).toBe(false);
  });
  it("rejects missing lowercase", () => {
    expect(isStrongEnough("PASSWORD1!")).toBe(false);
  });
});