import { PrismaClient, Prisma } from "@prisma/client";
import { hashPassword } from "@/lib/auth/password";

/**
 * NOIRÉ seed script.
 * Populates restaurant settings, hours, tables, the full menu (mirroring the
 * frontend's original showcase dataset), gallery, testimonials, and an ADMIN
 * account + a demo customer.
 *
 * Runs with:  npx prisma db seed   (after you configure DATABASE_URL)
 * Seed users come from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD (see .env.example).
 */

const prisma = new PrismaClient();

const u = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

async function main() {
  console.log("[seed] Starting NOIRÉ seed...");

  // ── Restaurant settings ────────────────────────────────────────────────
  await prisma.restaurantSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      name: "NOIRÉ",
      tagline: "An evening worth remembering.",
      addressLine: "18 Mercer Street",
      city: "Downtown",
      phone: "+1 (000) 555-0148",
      email: "hello@noire.example",
      timezone: "America/New_York",
      currency: "USD",
      taxRate: new Prisma.Decimal("0.08"),
      serviceFee: new Prisma.Decimal("0.00"),
      deliveryFee: new Prisma.Decimal("0.00"),
      reservationDurationMin: 90,
      reservationBufferMin: 15,
      minPartySize: 1,
      maxPartySize: 12,
    },
    update: {},
  });

  // ── Opening hours ──────────────────────────────────────────────────────
  const hours = [
    { dayOfWeek: 1, openTime: "17:30", closeTime: "22:00", isOpen: true }, // Tue
    { dayOfWeek: 2, openTime: "17:30", closeTime: "22:00", isOpen: true }, // Wed
    { dayOfWeek: 3, openTime: "17:30", closeTime: "22:00", isOpen: true }, // Thu
    { dayOfWeek: 4, openTime: "17:30", closeTime: "23:00", isOpen: true }, // Fri
    { dayOfWeek: 5, openTime: "17:30", closeTime: "23:00", isOpen: true }, // Sat
    { dayOfWeek: 6, openTime: "17:30", closeTime: "21:30", isOpen: true }, // Sun
    { dayOfWeek: 0, openTime: "00:00", closeTime: "00:00", isOpen: false }, // Mon closed
  ];

  await prisma.openingHours.deleteMany({});
  await prisma.openingHours.createMany({ data: hours });

  // ── Dining tables ──────────────────────────────────────────────────────
  await prisma.diningTable.deleteMany({});
  const tables = [
    { name: "T1", capacity: 2, location: "Window" },
    { name: "T2", capacity: 2, location: "Window" },
    { name: "T3", capacity: 2, location: "Main Room" },
    { name: "T4", capacity: 4, location: "Main Room" },
    { name: "T5", capacity: 4, location: "Main Room" },
    { name: "T6", capacity: 4, location: "Terrace" },
    { name: "T7", capacity: 6, location: "Main Room" },
    { name: "T8", capacity: 6, location: "Private Corner" },
    { name: "T9", capacity: 8, location: "Private Dining" },
    { name: "T10", capacity: 10, location: "Private Dining" },
  ];
  await prisma.diningTable.createMany({ data: tables });

  // ── Menu categories & items (mirror the original showcase dataset) ─────
  await prisma.menuCategory.deleteMany({});
  await prisma.menuItem.deleteMany({});

  const categoryIds: Record<string, string> = {};
  const categories = [
    { name: "Dinner", slug: "dinner", description: "A la carte — the evening, built your way.", sortOrder: 0 },
    { name: "Starters", slug: "starters", description: "Small plates to begin the meal.", sortOrder: 1 },
    { name: "Mains", slug: "mains", description: "The heart of the table.", sortOrder: 2 },
    { name: "Desserts", slug: "desserts", description: "The last, sweet note.", sortOrder: 3 },
    { name: "Tasting Menu", slug: "tasting", description: "Five courses. One story. Paired wines optional.", sortOrder: 4 },
    { name: "Drinks", slug: "drinks", description: "Cocktails, cellar picks and quiet classics.", sortOrder: 5 },
  ];

  for (const c of categories) {
    const created = await prisma.menuCategory.create({ data: c });
    categoryIds[c.slug] = created.id;
  }

  const dishes: {
    category: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    image: string;
    featured?: boolean;
    dietary?: string[];
  }[] = [
    { category: "starters", name: "Charred Octopus", slug: "octopus", description: "Smoked paprika, preserved lemon, fennel", price: 18, image: u("photo-1555939594-58d7cb561ad1", 900), featured: true, dietary: ["GF"] },
    { category: "starters", name: "Burrata", slug: "burrata", description: "Heirloom tomato, basil oil, sourdough", price: 16, image: u("photo-1572695157366-5e585ab2b69f", 900), dietary: ["V"] },
    { category: "starters", name: "Seared Scallops", slug: "scallops", description: "Brown butter, caper, sea herbs", price: 22, image: u("photo-1504674900247-0877df9cc836", 900) },
    { category: "starters", name: "Beef Tartare", slug: "tartare", description: "Cured yolk, grainy mustard, sourdough", price: 19, image: u("photo-1600891964092-4316c288032e", 900), dietary: ["GF"] },
    { category: "starters", name: "Soup of the Season", slug: "soup", description: "Market vegetables, herb oil", price: 14, image: u("photo-1547592166-23ac45744acd", 900), dietary: ["V", "VG"] },
    { category: "starters", name: "Sourdough Focaccia", slug: "focaccia", description: "Burnt garlic butter, flake salt", price: 9, image: u("photo-1586444248902-2f64eddc13df", 900), dietary: ["V"] },
    { category: "mains", name: "Truffle Risotto", slug: "risotto", description: "Wild mushrooms, parmesan, black truffle", price: 32, image: u("photo-1476124369491-e7addf5db371", 900), featured: true, dietary: ["V"] },
    { category: "mains", name: "Dry-Aged Ribeye", slug: "ribeye", description: "Roasted shallot, pepper jus, pommes purée", price: 48, image: u("photo-1544025162-d76694265947", 900), featured: true, dietary: ["GF"] },
    { category: "mains", name: "Miso-Glazed Salmon", slug: "salmon", description: "Braised greens, sesame, ginger beurre blanc", price: 36, image: u("photo-1467003909585-2f8a72700288", 900), dietary: ["GF"] },
    { category: "mains", name: "Roast Chicken", slug: "chicken", description: "Herb de Provence, charred lemon, its own jus", price: 34, image: u("photo-1610057099431-d73a1c9d2f2f", 900), dietary: ["GF"] },
    { category: "mains", name: "Lamb Rack", slug: "lamb", description: "Honey glaze, rosemary, smoked aubergine", price: 42, image: u("photo-1558030006-450675393462", 900), dietary: ["GF"] },
    { category: "mains", name: "Cavatelli", slug: "cavatelli", description: "Slow ragù, grana, basil", price: 28, image: u("photo-1473093295043-cdd812d0e601", 900) },
    { category: "mains", name: "Pan-Roasted Halibut", slug: "halibut", description: "Clam broth, leeks, dill", price: 38, image: u("photo-1519708227418-c8fd9a32b7a2", 900), dietary: ["GF"] },
    { category: "mains", name: "Porcini Crusted Filet", slug: "filet", description: "Truffle jus, asparagus, pommes soufflées", price: 52, image: u("photo-1603360946369-dc9bb6258143", 900), dietary: ["GF"] },
    { category: "desserts", name: "Dark Chocolate Tart", slug: "choc-tart", description: "Sea salt, vanilla crème fraîche", price: 14, image: u("photo-1551024506-0bccd828d307", 900), featured: true, dietary: ["V"] },
    { category: "desserts", name: "Vanilla Crème Brûlée", slug: "creme-brulee", description: "Salted caramel, shortbread", price: 12, image: u("photo-1551024506-0bccd828d307", 900), dietary: ["V"] },
    { category: "desserts", name: "Apple Tarte Tatin", slug: "apple-tarte", description: "Calvados, crème anglaise", price: 13, image: u("photo-1568572933382-74d440642117", 900), dietary: ["V"] },
    { category: "desserts", name: "Cheese Plate", slug: "cheese", description: "Seasonal selections, honeycomb, nuts", price: 16, image: u("photo-1546833999-b9f581a1996d", 900), dietary: ["V"] },
    { category: "desserts", name: "Citrus Sorbet", slug: "sorbet", description: "Verbena, olive oil", price: 10, image: u("photo-1488900128323-21503983a07e", 900), dietary: ["V", "VG", "GF"] },
    { category: "tasting", name: "Chilled Tomato Consommé", slug: "course-i", description: "Basil, fennel pollen, olive oil", price: 0, image: u("photo-1547592180-85f173990554", 900), dietary: ["V", "GF"] },
    { category: "tasting", name: "King Salmon", slug: "course-ii", description: "Daikon, charred scallion, yuzu", price: 0, image: u("photo-1546069901-ba9599a7e63c", 900) },
    { category: "tasting", name: "Butter-Poached Lobster", slug: "course-iii", description: "Champagne sauce, fennel, caviar", price: 0, image: u("photo-1559339352-11d035aa65de", 900) },
    { category: "tasting", name: "Aged Beef", slug: "course-iv", description: "Marrow, sauce périgourdine, wilted greens", price: 0, image: u("photo-1555939594-58d7cb561ad1", 900), dietary: ["GF"] },
    { category: "tasting", name: "Dark Chocolate, Coffee & Malt", slug: "course-v", description: "Theatre of texture — the last note of the evening", price: 0, image: u("photo-1519671482749-fd09be7ccebf", 900), dietary: ["V"] },
    { category: "drinks", name: "Noir(é) Negroni", slug: "negroni", description: "London dry gin, campari, sweet vermouth", price: 16, image: u("photo-1470337458703-46ad1756a187", 900) },
    { category: "drinks", name: "Smoked Old Fashioned", slug: "old-fashioned", description: "Rye, black walnut bitters, burnt sugar", price: 18, image: u("photo-1536935338788-846bb9981813", 900) },
    { category: "drinks", name: "Le Suprême Spritz", slug: "spritz", description: "Elderflower, prosecco, soda water", price: 15, image: u("photo-1551538827-9c037cb4f32a", 900) },
    { category: "drinks", name: "Sommelier's Selection", slug: "vino", description: "A rotating glass from our cellar — ask your sommelier", price: 14, image: u("photo-1506377247377-2a5b3b417ebb", 900) },
    { category: "drinks", name: "House Amaro", slug: "amaro", description: "Espresso, grappa, cracked hazelnut", price: 13, image: u("photo-1514362545857-3bc16c4c7d1b", 900) },
    { category: "drinks", name: "Zero-Proof Tonic", slug: "zeroproof", description: "House citrus cordial, rosemary, soda", price: 8, image: u("photo-1497534446932-c925b458314e", 900), dietary: ["V", "VG"] },
  ];

  for (const d of dishes) {
    await prisma.menuItem.create({
      data: {
        categoryId: categoryIds[d.category],
        name: d.name,
        slug: d.slug,
        description: d.description,
        price: new Prisma.Decimal(d.price.toFixed(2)),
        image: d.image,
        dietary: d.dietary ?? [],
        featured: d.featured ?? false,
        available: true,
        isActive: true,
      },
    });
  }

  // ── Gallery ────────────────────────────────────────────────────────────
  await prisma.galleryImage.deleteMany({});
  const gallery = [
    { title: "The main dining room at NOIRÉ", imageUrl: u("photo-1517248135467-4c7edcad34c4", 1200), altText: "The main dining room at NOIRÉ lit by warm pendant lights", category: "DINING" as const },
    { title: "Low light over empty tables", imageUrl: u("photo-1555126634-323283e090fa", 1200), altText: "Low light over empty tables before evening service", category: "DINING" as const },
    { title: "Candlelit banquet tables", imageUrl: u("photo-1519671482749-fd09be7ccebf", 1200), altText: "Candlelit banquet tables prepared for an evening of guests", category: "DINING" as const },
    { title: "Intimate corner table", imageUrl: u("photo-1550966871-3ed3cdb5ed0c", 1200), altText: "An intimate corner table dressed with linens and glassware", category: "DINING" as const },
    { title: "Guests toasting", imageUrl: u("photo-1544148103-0773bf10d330", 1200), altText: "Guests toasting at a corner table under amber light", category: "DINING" as const },
    { title: "Darkly plated dish", imageUrl: u("photo-1424847651672-bf20a4b0982b", 1200), altText: "A darkly plated dish finished with micro herbs", category: "FOOD" as const },
    { title: "Dark chocolate cake", imageUrl: u("photo-1578985545062-69928b1d9587", 1200), altText: "A dark chocolate cake with a glossy finish", category: "FOOD" as const },
    { title: "Dry-aged steak", imageUrl: u("photo-1544025162-d76694265947", 1200), altText: "A dry-aged steak finished over open flame", category: "FOOD" as const },
    { title: "Dark chocolate tart", imageUrl: u("photo-1551024506-0bccd828d307", 1200), altText: "A dark chocolate tart dusted with sea salt", category: "FOOD" as const },
    { title: "Pasta being plated", imageUrl: u("photo-1473093295043-cdd812d0e601", 1200), altText: "Pasta being plated for a guest", category: "FOOD" as const },
    { title: "Entrée with seasonal vegetables", imageUrl: u("photo-1476224203421-9ac39bcb3327", 1200), altText: "A plated entrée with seasonal vegetables and jus", category: "FOOD" as const },
    { title: "Composed starter", imageUrl: u("photo-1600891964092-4316c288032e", 1200), altText: "A composed starter arranged on a ceramic plate", category: "FOOD" as const },
    { title: "Chef plating a course", imageUrl: u("photo-1577219491135-ce391730fb2c", 1200), altText: "The chef plating a course with quiet precision", category: "KITCHEN" as const },
    { title: "Kitchen line at service", imageUrl: u("photo-1559339352-11d035aa65de", 1200), altText: "The kitchen line during evening service", category: "KITCHEN" as const },
    { title: "Flames behind a chef", imageUrl: u("photo-1583394293214-28ded15ee548", 1200), altText: "Flames rising behind a chef at the pass", category: "KITCHEN" as const },
    { title: "Plating with tweezers", imageUrl: u("photo-1556911220-bff31c812dba", 1200), altText: "A chef plating with tweezers at the counter", category: "KITCHEN" as const },
    { title: "Wine poured at a table", imageUrl: u("photo-1537633552985-df8429e8048b", 1200), altText: "Wine being poured at an intimate table", category: "BAR" as const },
    { title: "Craft cocktail on the bar", imageUrl: u("photo-1470337458703-46ad1756a187", 1200), altText: "A craft cocktail resting on the bar", category: "BAR" as const },
    { title: "Bartender preparing serves", imageUrl: u("photo-1514362545857-3bc16c4c7d1b", 1200), altText: "The bartender preparing signature serves", category: "BAR" as const },
    { title: "Glass of wine", imageUrl: u("photo-1552566626-52f8b828add9", 1200), altText: "A glass of wine lifted against a discreet bar backdrop", category: "BAR" as const },
    { title: "Candlelit table for dinner", imageUrl: u("photo-1414235077428-338989a2e8c0", 1200), altText: "A candlelit table set for dinner with wine", category: "MOMENTS" as const },
    { title: "Long table for a celebration", imageUrl: u("photo-1519167758481-83f550bb49b3", 1200), altText: "A long table dressed for a private celebration", category: "MOMENTS" as const },
    { title: "Soft evening light", imageUrl: u("photo-1551632811-561732d1e306", 1200), altText: "Soft evening light through the window of the dining room", category: "MOMENTS" as const },
    { title: "Friends gathered over wine", imageUrl: u("photo-1466978913421-dad2ebd01d17", 1200), altText: "Friends gathered over food and wine on a long evening", category: "MOMENTS" as const },
  ];
  for (let i = 0; i < gallery.length; i++) {
    const g = gallery[i];
    await prisma.galleryImage.create({ data: { ...g, sortOrder: i } });
  }

  // ── Testimonials ───────────────────────────────────────────────────────
  await prisma.testimonial.deleteMany({});
  const testimonials = [
    { customerName: "Alexandra M.", quote: "Every course felt intentional. Beautiful food, exceptional service and an atmosphere we didn't want to leave.", rating: 5 },
    { customerName: "Daniel R.", quote: "The room glows. The cooking is precise without being precious — the truffle risotto alone is worth the journey.", rating: 5 },
    { customerName: "Priya & Sam K.", quote: "We came for our anniversary and were treated like regulars from the first pour. A rare kind of place.", rating: 5 },
    { customerName: "Jonas W.", quote: "Theatre in a tasting menu. Each plate is composed like a still life — and tastes even better than it looks.", rating: 5 },
    { customerName: "Elena M.", quote: "Quietly the best meal we've had in years. Perfectly paced, perfectly poured, perfectly lit.", rating: 5 },
  ];
  await prisma.testimonial.createMany({ data: testimonials });

  // ── Users ──────────────────────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@noire.example";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const adminHash = await hashPassword(adminPassword);
  await prisma.user.upsert({
    where: { email: adminEmail },
    create: { name: "NOIRÉ Admin", email: adminEmail, passwordHash: adminHash, role: "ADMIN" },
    update: { role: "ADMIN" },
  });

  const demoEmail = "guest@noire.example";
  const demoHash = await hashPassword("Guest123!");
  await prisma.user.upsert({
    where: { email: demoEmail },
    create: { name: "Guest Diner", email: demoEmail, passwordHash: demoHash, role: "CUSTOMER" },
    update: {},
  });

  console.log("[seed] Done.");
  console.log(`[seed] Admin:    ${adminEmail}`);
  console.log(`[seed] Customer: ${demoEmail}  (Guest123!)`);
}

main()
  .catch((e) => {
    console.error("[seed] Failed:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());