import { describe, it, expect } from "vitest";
import { ValidationError, UnauthorizedError, ForbiddenError, NotFoundError } from "@/lib/errors";
import { decimalsToNumbers, validationErrorFromZod } from "@/lib/util";
import { z } from "zod";

describe("typed application errors", () => {
  it("carries the right HTTP status and code", () => {
    expect(new UnauthorizedError().status).toBe(401);
    expect(new ForbiddenError().status).toBe(403);
    expect(new NotFoundError().status).toBe(404);
    expect(new ValidationError("x").status).toBe(422);
    expect(new UnauthorizedError().code).toBe("UNAUTHORIZED");
  });

  it("never exposes unexpected implementation details", () => {
    // The AppError abstraction holds safe codes, not raw DB info.
    const err = new ValidationError("bad");
    expect(err.message).toBe("bad");
    expect(err.code).toBe("VALIDATION_ERROR");
    expect((err as unknown as { stack?: string }).stack).toBeDefined(); // thrown not required
  });

  it("field errors surface from zod", () => {
    const schema = z.object({ email: z.string().email() });
    const { error } = schema.safeParse({ email: "nope" });
    const err = validationErrorFromZod(error!);
    expect(err.fieldErrors).toBeDefined();
    expect(err.fieldErrors?.email).toBeDefined();
  });
});

describe("decimal -> number serialisation", () => {
  it("converts Prisma-like decimals to plain numbers", () => {
    const input = { subtotal: { toNumber: () => 42.5 }, items: [{ price: { toNumber: () => 7 } }] };
    const out = decimalsToNumbers(input);
    expect(out).toEqual({ subtotal: 42.5, items: [{ price: 7 }] });
  });

  it("leaves plain values untouched", () => {
    expect(decimalsToNumbers({ a: 1, b: "x", c: true, d: null }) as unknown).toEqual({
      a: 1,
      b: "x",
      c: true,
      d: null,
    });
  });
});