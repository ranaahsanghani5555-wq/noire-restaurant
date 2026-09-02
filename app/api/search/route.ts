import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";

/**
 * GET /api/search?q=...
 * Free-text search across active menu items and a curated set of site pages,
 * matching the shape lib/api.ts exposes to the frontend.
 */
const PAGE_CORPUS = [
  {
    title: "The Menu",
    href: "/menu",
    excerpt: "Seasonal dishes, cocktails and our five-course tasting menu.",
    keywords: "menu food seasonal tasting dishes dinner food reservations",
  },
  {
    title: "Reserve a Table",
    href: "/reservations",
    excerpt: "Request a table for dinner, a birthday, an anniversary or a business meal.",
    keywords: "reserve reservation booking table dinner night out",
  },
  {
    title: "Our Story",
    href: "/about",
    excerpt: "How NOIRÉ began — a philosophy of seasons, craft and hospitality.",
    keywords: "story about philosophy chef hospitality kitchen history",
  },
  {
    title: "The Gallery",
    href: "/gallery",
    excerpt: "Photography from the dining room, the kitchen, the bar and the table.",
    keywords: "gallery photos images dining room kitchen bar",
  },
  {
    title: "Private Dining",
    href: "/private-dining",
    excerpt: "Intimate rooms for corporate dinners, weddings and celebrations.",
    keywords: "private dining events weddings celebrations corporate parties groups",
  },
  {
    title: "Contact",
    href: "/contact",
    excerpt: "Address, phone, opening hours and directions to the restaurant.",
    keywords: "contact address phone email hours location directions",
  },
  {
    title: "Customer Account",
    href: "/login",
    excerpt: "Sign in to your NOIRÉ account, or create one.",
    keywords: "login account sign in profile",
  },
];

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
    if (!q) return ok({ dishes: [], pages: [] });

    const [dishes, pages] = await Promise.all([
      db.menuItem.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        include: { category: true },
        take: 20,
      }),
      Promise.resolve(
        PAGE_CORPUS.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q) ||
            p.keywords.toLowerCase().includes(q)
        ).map(({ title, href, excerpt }) => ({ title, href, excerpt }))
      ),
    ]);

    return ok({
      dishes: dishes.map((d) => ({
        id: d.id,
        name: d.name,
        description: d.description,
        price: d.price.toNumber(),
        image: d.image,
        category: d.category.slug,
        dietary: d.dietary,
      })),
      pages,
    });
  } catch (e) {
    return fail(e);
  }
}