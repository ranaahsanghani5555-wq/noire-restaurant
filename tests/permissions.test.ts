import { describe, it, expect } from "vitest";
import { hasRole, hasPermission, isStaffOrAbove } from "@/lib/auth/permissions";

describe("RBAC role hierarchy", () => {
  it("ADMIN ranks above everyone", () => {
    expect(hasRole("ADMIN", "CUSTOMER")).toBe(true);
    expect(hasRole("ADMIN", "STAFF")).toBe(true);
    expect(hasRole("ADMIN", "MANAGER")).toBe(true);
    expect(hasRole("ADMIN", "ADMIN")).toBe(true);
  });

  it("CUSTOMER ranks below everyone", () => {
    expect(hasRole("CUSTOMER", "STAFF")).toBe(false);
    expect(hasRole("CUSTOMER", "MANAGER")).toBe(false);
    expect(hasRole("CUSTOMER", "ADMIN")).toBe(false);
  });

  it("MANAGER outranks STAFF but not ADMIN", () => {
    expect(hasRole("MANAGER", "STAFF")).toBe(true);
    expect(hasRole("MANAGER", "MANAGER")).toBe(true);
    expect(hasRole("MANAGER", "ADMIN")).toBe(false);
  });

  it("isStaffOrAbove only for staff+", () => {
    expect(isStaffOrAbove("STAFF")).toBe(true);
    expect(isStaffOrAbove("MANAGER")).toBe(true);
    expect(isStaffOrAbove("ADMIN")).toBe(true);
    expect(isStaffOrAbove("CUSTOMER")).toBe(false);
  });
});

describe("RBAC permissions", () => {
  it("customers manage only themselves", () => {
    expect(hasPermission("CUSTOMER", "self:read")).toBe(true);
    expect(hasPermission("CUSTOMER", "reservation:self")).toBe(true);
    expect(hasPermission("CUSTOMER", "menu:write")).toBe(false);
    expect(hasPermission("CUSTOMER", "audit:read")).toBe(false);
  });

  it("staff read and update reservations/orders", () => {
    expect(hasPermission("STAFF", "reservation:read")).toBe(true);
    expect(hasPermission("STAFF", "orders:update")).toBe(true);
    expect(hasPermission("STAFF", "menu:write")).toBe(false);
  });

  it("managers manage content but not settings/users/audit", () => {
    expect(hasPermission("MANAGER", "menu:write")).toBe(true);
    expect(hasPermission("MANAGER", "gallery:write")).toBe(true);
    expect(hasPermission("MANAGER", "testimonials:write")).toBe(true);
    expect(hasPermission("MANAGER", "customers:read")).toBe(true);
    expect(hasPermission("MANAGER", "settings:write")).toBe(false);
    expect(hasPermission("MANAGER", "users:manage")).toBe(false);
    expect(hasPermission("MANAGER", "audit:read")).toBe(false);
  });

  it("admin has every permission", () => {
    expect(hasPermission("ADMIN", "settings:write")).toBe(true);
    expect(hasPermission("ADMIN", "audit:read")).toBe(true);
    expect(hasPermission("ADMIN", "users:manage")).toBe(true);
    expect(hasPermission("ADMIN", "dashboard:read")).toBe(true);
  });
});