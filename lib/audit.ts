import { db } from "@/lib/db";
import type { UserRole } from "@prisma/client";

/**
 * Audit logging. Best-effort: never throw when the DB is unavailable.
 */
export async function auditLog(args: {
  actorId?: string | null;
  actorRole?: UserRole | null;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
  ip?: string | null;
}) {
  try {
    await db.auditLog.create({
      data: {
        actorId: args.actorId,
        actorRole: args.actorRole,
        action: args.action,
        entity: args.entity,
        entityId: args.entityId,
        metadata: args.metadata as object | undefined,
        ip: args.ip,
      },
    });
  } catch {
    // Audit should never break the primary operation.
  }
}