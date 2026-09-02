import { z } from "zod";
import { db } from "@/lib/db";
import { ok, created, fail } from "@/lib/api-response";
import { requireStaff, paginate } from "@/lib/admin";
import { readJson, validationErrorFromZod } from "@/lib/util";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.string().optional(),
  q: z.string().optional(),
});

/** GET /api/admin/reservations?page&limit&status&q — reservations list. */
export async function GET(req: Request) {
  try {
    await requireStaff();
    const url = new URL(req.url);
    const parsed = querySchema.safeParse({
      page: url.searchParams.get("page") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      q: url.searchParams.get("q") ?? undefined,
    });
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const { status, q, page, limit } = parsed.data;
    const where = {
      ...(status ? { status: status as never } : {}),
      ...(q
        ? {
            OR: [
              { guestName: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const { skip, take } = paginate(page, limit);
    const [total, reservations] = await Promise.all([
      db.reservation.count({ where }),
      db.reservation.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take,
        include: { table: true },
      }),
    ]);

    return ok({ reservations, total }, { meta: { page, limit, total } });
  } catch (e) {
    return fail(e);
  }
}

const createSchema = z.object({
  guestName: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().min(1),
  guests: z.coerce.number().int().min(1),
  tableId: z.string().optional(),
  occasion: z.string().optional(),
  specialRequest: z.string().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "SEATED", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
});

/** POST /api/admin/reservations — staff can add a walk-in reservation. */
export async function POST(req: Request) {
  try {
    await requireStaff();
    const body = await readJson(req);
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const startMin = parsed.data.time.split(":").map(Number);
    const duration = 90;
    const end = new Date(0);
    if (startMin[0] !== undefined && startMin[1] !== undefined) {
      end.setHours(startMin[0], startMin[1] + duration, 0, 0);
    }
    const endTime = `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;

    const reservation = await db.reservation.create({
      data: {
        guestName: parsed.data.guestName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        date: new Date(`${parsed.data.date}T00:00:00.000Z`),
        startTime: parsed.data.time,
        endTime,
        partySize: parsed.data.guests,
        tableId: parsed.data.tableId,
        occasion: parsed.data.occasion,
        specialRequest: parsed.data.specialRequest,
        source: "staff",
        status: parsed.data.status ?? "CONFIRMED",
      },
      include: { table: true },
    });

    return created(reservation);
  } catch (e) {
    return fail(e);
  }
}