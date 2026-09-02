import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/health
 * Lightweight liveness probe. Tries a trivial DB check so the readiness state
 * is honest, but degrades gracefully when DATABASE_URL is not configured.
 */
export async function GET() {
  let dbConnected = false;

  try {
    await db.$queryRaw`SELECT 1`;
    dbConnected = true;
  } catch {
    dbConnected = false;
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        status: dbConnected ? "ok" : "degraded",
        database: dbConnected ? "connected" : "unavailable",
        timestamp: new Date().toISOString(),
      },
    },
    { status: dbConnected ? 200 : 503 }
  );
}