import { z } from "zod";
import { db } from "@/lib/db";
import { created, fail } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, hashIp } from "@/lib/guards";
import { ConflictError, ValidationError } from "@/lib/errors";
import { readJson, validationErrorFromZod } from "@/lib/util";
import { hashPassword, isStrongEnough, PASSWORD_MIN_LENGTH } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

const bodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(PASSWORD_MIN_LENGTH),
  phone: z.string().trim().optional(),
});

/** POST /api/auth/register — create an account and sign the user in. */
export async function POST(req: Request) {
  try {
    await rateLimit([hashIp(clientIp(req))], { limit: 10, windowSeconds: 300, prefix: "register" });

    const body = await readJson(req);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return fail(validationErrorFromZod(parsed.error, "Invalid registration data"));
    }
    if (!isStrongEnough(parsed.data.password)) {
      throw new ValidationError(
        "Password must include upper & lowercase letters and a number",
        { password: "Password must include upper & lowercase letters and a number" }
      );
    }

    const { name, email, password, phone } = parsed.data;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) throw new ConflictError("An account with that email already exists");

    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: { name, email, passwordHash, phone, role: "CUSTOMER" },
    });

    await createSession({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return created({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    return fail(e);
  }
}