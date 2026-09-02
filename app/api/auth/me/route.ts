import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { getSession } from "@/lib/auth/session";
import { UnauthorizedError } from "@/lib/errors";

/**
 * GET /api/auth/me — the current signed-in user profile, or 401.
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) throw new UnauthorizedError();

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });
    if (!user) throw new UnauthorizedError();

    return ok({ user });
  } catch (e) {
    return fail(e);
  }
}