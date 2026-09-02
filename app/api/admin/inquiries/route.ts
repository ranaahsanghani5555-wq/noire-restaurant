import { z } from "zod";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { requireManager, paginate } from "@/lib/admin";
import { readJson, validationErrorFromZod } from "@/lib/util";

const querySchema = z.object({
  type: z.enum(["PRIVATE_DINING", "CONTACT"]).default("PRIVATE_DINING"),
  status: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/** GET /api/admin/inquiries?type=&status= — private-dining or contact messages. */
export async function GET(req: Request) {
  try {
    await requireManager();
    const url = new URL(req.url);
    const parsed = querySchema.safeParse({
      type: url.searchParams.get("type") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: url.searchParams.get("page") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
    });
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const { type, status, page, limit } = parsed.data;
    const { skip, take } = paginate(page, limit);

    if (type === "CONTACT") {
      const where = status ? { status: status as never } : {};
      const [total, messages] = await Promise.all([
        db.contactMessage.count({ where }),
        db.contactMessage.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
      ]);
      return ok({ type, messages, total }, { meta: { page, limit, total } });
    }

    const where = status ? { status: status as never } : {};
    const [total, inquiries] = await Promise.all([
      db.privateDiningInquiry.count({ where }),
      db.privateDiningInquiry.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
    ]);
    return ok({ type, inquiries, total }, { meta: { page, limit, total } });
  } catch (e) {
    return fail(e);
  }
}

const updateSchema = z.object({
  type: z.enum(["PRIVATE_DINING", "CONTACT"]),
  id: z.string().min(1),
  status: z.string().min(1),
});

/** PATCH /api/admin/inquiries — update the status of an inquiry/contact. */
export async function PATCH(req: Request) {
  try {
    await requireManager();
    const body = await readJson(req);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const { type, id, status } = parsed.data;
    if (type === "CONTACT") {
      await db.contactMessage.update({ where: { id }, data: { status: status as never } });
    } else {
      await db.privateDiningInquiry.update({ where: { id }, data: { status: status as never } });
    }
    return ok({ message: "Status updated" });
  } catch (e) {
    return fail(e);
  }
}