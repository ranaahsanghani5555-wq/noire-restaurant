import { requireRole } from "@/lib/auth/permissions";

/**
 * Shared guards/helpers for admin route handlers.
 */

/** Require ADMIN role (admin backend routes). */
export async function requireAdmin() {
  return requireRole("ADMIN");
}

/** Require MANAGER-or-above for management routes. */
export async function requireManager() {
  return requireRole("MANAGER");
}

/** Require STAFF-or-above for operational routes. */
export async function requireStaff() {
  return requireRole("STAFF");
}

/** Extract a paginated {page,limit} and compute skip/take. */
export function paginate(page = 1, limit = 20) {
  return { skip: (page - 1) * limit, take: limit };
}