import type { UserRole } from "@prisma/client";
import { getSession } from "@/lib/auth/session";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";

/**
 * Role-based access control.
 * Higher roles implicitly carry the permissions of lower roles.
 */

const ROLE_RANK: Record<UserRole, number> = {
  CUSTOMER: 0,
  STAFF: 1,
  MANAGER: 2,
  ADMIN: 3,
};

/** Permissions granted per role. */
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  CUSTOMER: ["self:read", "self:write", "reservation:self"],
  STAFF: [
    "self:read",
    "self:write",
    "reservation:self",
    "reservation:read",
    "reservation:update",
    "orders:read",
    "orders:update",
  ],
  MANAGER: [
    "self:read",
    "self:write",
    "reservation:self",
    "reservation:read",
    "reservation:update",
    "orders:read",
    "orders:update",
    "menu:write",
    "gallery:write",
    "testimonials:write",
    "tables:write",
    "inquiries:read",
    "inquiries:update",
    "customers:read",
    "dashboard:read",
  ],
  ADMIN: [
    "self:read",
    "self:write",
    "reservation:self",
    "reservation:read",
    "reservation:update",
    "orders:read",
    "orders:update",
    "menu:write",
    "gallery:write",
    "testimonials:write",
    "tables:write",
    "inquiries:read",
    "inquiries:update",
    "customers:read",
    "dashboard:read",
    "settings:write",
    "audit:read",
    "users:manage",
  ],
};

export function hasRole(role: UserRole, minimum: UserRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

export function hasPermission(role: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/** Highest role rank equals ADMIN-level access. */
export function isStaffOrAbove(role: UserRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK.STAFF;
}

/**
 * Require a signed-in user. Throws UnauthorizedError otherwise.
 * Returns the session context.
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return session;
}

/**
 * Require the current user to hold at least `role`. Throws ForbiddenError when
 * they are signed in but lack the role, or UnauthorizedError when signed out.
 */
export async function requireRole(role: UserRole) {
  const session = await requireAuth();
  if (!hasRole(session.role, role)) throw new ForbiddenError();
  return session;
}

/**
 * Require a specific permission. Throws ForbiddenError when not granted.
 */
export async function requirePermission(permission: string) {
  const session = await requireAuth();
  if (!hasPermission(session.role, permission)) throw new ForbiddenError();
  return session;
}