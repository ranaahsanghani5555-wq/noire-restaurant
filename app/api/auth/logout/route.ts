import { ok, fail } from "@/lib/api-response";
import { destroySession } from "@/lib/auth/session";

/** POST /api/auth/logout — clear the session cookie. */
export async function POST() {
  try {
    await destroySession();
    return ok({ message: "Signed out" });
  } catch (e) {
    return fail(e);
  }
}