import { z } from "zod";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, hashIp } from "@/lib/guards";
import { UnauthorizedError } from "@/lib/errors";
import { readJson, validationErrorFromZod } from "@/lib/util";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

/** POST /api/auth/login — authenticate and start a session. */
export async function POST(req: Request) {
  try {
    await rateLimit([hashIp(clientIp(req))], { limit: 15, windowSeconds: 300, prefix: "login" });

    const body = await readJson(req);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return fail(validationErrorFromZod(parsed.error, "Invalid credentials"));
    }

    const { email, password } = parsed.data;
    const user = await db.user.findUnique({ where: { email } });

    // Always run a verify against the real hash (or a dummy one) to keep
    // timing uniform for unknown emails.
    const okPassword = user
      ? await verifyPassword(password, user.passwordHash)
      : await verifyPassword(password, "$argon2id$v=19$m=19456,t=2,p=1$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

    if (!user || !okPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    await createSession({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return ok({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    return fail(e);
  }
}