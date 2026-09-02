import { NextResponse } from "next/server";
import { AppError } from "@/lib/errors";
import { logError } from "@/lib/logging";

/**
 * Consistent REST envelope.
 *   success -> { success:true, data, meta? }
 *   failure -> { success:false, error:{ code, message, fieldErrors? } }
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export function ok<T>(data: T, init?: { meta?: PaginationMeta; status?: number }) {
  return NextResponse.json(
    { success: true as const, data, meta: init?.meta },
    { status: init?.status ?? 200 }
  );
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true as const, data }, { status: 201 });
}

export function fail(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false as const,
        error: {
          code: error.code,
          message: error.message,
          fieldErrors: error.fieldErrors,
        },
      },
      { status: error.status }
    );
  }

  // Unknown error — log server-side, return a safe generic message.
  logError("Unhandled error", error instanceof Error ? error : new Error(String(error)));
  return NextResponse.json(
    {
      success: false as const,
      error: {
        code: "INTERNAL",
        message: "Something went wrong. Please try again.",
      },
    },
    { status: 500 }
  );
}

/**
 * Wrap a route handler so thrown AppErrors become clean responses and
 * unexpected errors are caught, logged, and masked.
 */
export function withErrorHandling(handler: () => Promise<NextResponse>): Promise<NextResponse> {
  return handler().catch(fail);
}