import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma client. In development, Next.js hot-reloads modules and
 * would otherwise create many connections; caching the client avoids that.
 * The client lazily connects, so a missing DATABASE_URL only throws when a
 * query actually runs — the app can still build and render without one.
 */
function createClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your environment before using the database."
    );
  }
  return new PrismaClient();
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}