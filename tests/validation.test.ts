import { describe, it, expect } from "vitest";
import { reservationSchema, newsletterSchema, createOrderSchema } from "@/lib/validation";

describe("reservation validation", () => {
  it("accepts a valid reservation", () => {
    const out = reservationSchema.parse({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "Ada@Example.COM",
      phone: "555",
      date: "2026-12-10",
      time: "7:00 PM",
      guests: "2",
      occasion: "Anniversary",
    });
    expect(out.email).toBe("ada@example.com"); // normalized
    expect(out.guests).toBe(2); // coerced string -> number
  });

  it("rejects a bad date", () => {
    expect(() =>
      reservationSchema.parse({
        firstName: "Ada",
        lastName: "Lovelace",
        email: "a@b.com",
        date: "10/12/2026",
        time: "7:00 PM",
        guests: 2,
      })
    ).toThrow();
  });

  it("rejects an invalid email", () => {
    expect(() =>
      reservationSchema.parse({
        firstName: "Ada",
        lastName: "Lovelace",
        email: "not-an-email",
        date: "2026-12-10",
        time: "7:00 PM",
        guests: 2,
      })
    ).toThrow();
  });

  it("rejects missing required fields", () => {
    expect(() => reservationSchema.parse({ guests: 2 })).toThrow();
  });
});

describe("newsletter validation", () => {
  it("accepts and normalizes an email", () => {
    expect(newsletterSchema.parse({ email: " User@Example.com " }).email).toBe("user@example.com");
  });
  it("rejects an invalid email", () => {
    expect(() => newsletterSchema.parse({ email: "nope" })).toThrow();
  });
});

describe("order validation", () => {
  it("accepts a valid order", () => {
    const out = createOrderSchema.parse({
      fulfillment: "DELIVERY",
      items: [{ itemId: "x", quantity: 2 }],
    });
    expect(out.items[0].quantity).toBe(2);
  });
  it("rejects an empty order", () => {
    expect(() => createOrderSchema.parse({ fulfillment: "PICKUP", items: [] })).toThrow();
  });
  it("rejects excessive quantity", () => {
    expect(() =>
      createOrderSchema.parse({ fulfillment: "PICKUP", items: [{ itemId: "x", quantity: 999 }] })
    ).toThrow();
  });
});