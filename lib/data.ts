export interface Dish {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  featured?: boolean;
  dietary?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  dishIds: string[];
}

export interface Testimonial {
  id: string;
  quote: string;
  guest: string;
  source?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: "food" | "dining-room" | "kitchen" | "bar" | "moments";
}

export interface Chef {
  name: string;
  role: string;
  bio: string;
  quote: string;
  portrait: string;
}

export interface RestaurantHours {
  day: string;
  hours: string;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  address: {
    street: string;
    city: string;
  };
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  hours: RestaurantHours[];
}

const u = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const dishes: Dish[] = [
  {
    id: "octopus",
    name: "Charred Octopus",
    category: "starters",
    description: "Smoked paprika, preserved lemon, fennel",
    price: 18,
    image: u("photo-1555939594-58d7cb561ad1", 900),
    featured: true,
    dietary: ["GF"],
  },
  {
    id: "burrata",
    name: "Burrata",
    category: "starters",
    description: "Heirloom tomato, basil oil, sourdough",
    price: 16,
    image: u("photo-1572695157366-5e585ab2b69f", 900),
    dietary: ["V"],
  },
  {
    id: "scallops",
    name: "Seared Scallops",
    category: "starters",
    description: "Brown butter, caper, sea herbs",
    price: 22,
    image: u("photo-1504674900247-0877df9cc836", 900),
  },
  {
    id: "tartare",
    name: "Beef Tartare",
    category: "starters",
    description: "Cured yolk, grainy mustard, sourdough",
    price: 19,
    image: u("photo-1600891964092-4316c288032e", 900),
    dietary: ["GF"],
  },
  {
    id: "soup",
    name: "Soup of the Season",
    category: "starters",
    description: "Market vegetables, herb oil",
    price: 14,
    image: u("photo-1547592166-23ac45744acd", 900),
    dietary: ["V", "VG"],
  },
  {
    id: "focaccia",
    name: "Sourdough Focaccia",
    category: "starters",
    description: "Burnt garlic butter, flake salt",
    price: 9,
    image: u("photo-1586444248902-2f64eddc13df", 900),
    dietary: ["V"],
  },
  {
    id: "risotto",
    name: "Truffle Risotto",
    category: "mains",
    description: "Wild mushrooms, parmesan, black truffle",
    price: 32,
    image: u("photo-1476124369491-e7addf5db371", 900),
    featured: true,
    dietary: ["V"],
  },
  {
    id: "ribeye",
    name: "Dry-Aged Ribeye",
    category: "mains",
    description: "Roasted shallot, pepper jus, pommes purée",
    price: 48,
    image: u("photo-1544025162-d76694265947", 900),
    featured: true,
    dietary: ["GF"],
  },
  {
    id: "salmon",
    name: "Miso-Glazed Salmon",
    category: "mains",
    description: "Braised greens, sesame, ginger beurre blanc",
    price: 36,
    image: u("photo-1467003909585-2f8a72700288", 900),
    dietary: ["GF"],
  },
  {
    id: "chicken",
    name: "Roast Chicken",
    category: "mains",
    description: "Herb de Provence, charred lemon, its own jus",
    price: 34,
    image: u("photo-1610057099431-d73a1c9d2f2f", 900),
    dietary: ["GF"],
  },
  {
    id: "lamb",
    name: "Lamb Rack",
    category: "mains",
    description: "Honey glaze, rosemary, smoked aubergine",
    price: 42,
    image: u("photo-1558030006-450675393462", 900),
    dietary: ["GF"],
  },
  {
    id: "cavatelli",
    name: "Cavatelli",
    category: "mains",
    description: "Slow ragù, grana, basil",
    price: 28,
    image: u("photo-1473093295043-cdd812d0e601", 900),
  },
  {
    id: "halibut",
    name: "Pan-Roasted Halibut",
    category: "mains",
    description: "Clam broth, leeks, dill",
    price: 38,
    image: u("photo-1519708227418-c8fd9a32b7a2", 900),
    dietary: ["GF"],
  },
  {
    id: "filet",
    name: "Porcini Crusted Filet",
    category: "mains",
    description: "Truffle jus, asparagus, pommes soufflées",
    price: 52,
    image: u("photo-1603360946369-dc9bb6258143", 900),
    dietary: ["GF"],
  },
  {
    id: "choc-tart",
    name: "Dark Chocolate Tart",
    category: "desserts",
    description: "Sea salt, vanilla crème fraîche",
    price: 14,
    image: u("photo-1551024506-0bccd828d307", 900),
    featured: true,
    dietary: ["V"],
  },
  {
    id: "creme-brulee",
    name: "Vanilla Crème Brûlée",
    category: "desserts",
    description: "Salted caramel, shortbread",
    price: 12,
    image: u("photo-1551024506-0bccd828d307", 900),
    dietary: ["V"],
  },
  {
    id: "apple-tarte",
    name: "Apple Tarte Tatin",
    category: "desserts",
    description: "Calvados, crème anglaise",
    price: 13,
    image: u("photo-1568572933382-74d440642117", 900),
    dietary: ["V"],
  },
  {
    id: "cheese",
    name: "Cheese Plate",
    category: "desserts",
    description: "Seasonal selections, honeycomb, nuts",
    price: 16,
    image: u("photo-1546833999-b9f581a1996d", 900),
    dietary: ["V"],
  },
  {
    id: "sorbet",
    name: "Citrus Sorbet",
    category: "desserts",
    description: "Verbena, olive oil",
    price: 10,
    image: u("photo-1488900128323-21503983a07e", 900),
    dietary: ["V", "VG", "GF"],
  },
  {
    id: "course-i",
    name: "Chilled Tomato Consommé",
    category: "tasting",
    description: "Basil, fennel pollen, olive oil",
    price: 0,
    image: u("photo-1547592180-85f173990554", 900),
    dietary: ["V", "GF"],
  },
  {
    id: "course-ii",
    name: "King Salmon",
    category: "tasting",
    description: "Daikon, charred scallion, yuzu",
    price: 0,
    image: u("photo-1546069901-ba9599a7e63c", 900),
  },
  {
    id: "course-iii",
    name: "Butter-Poached Lobster",
    category: "tasting",
    description: "Champagne sauce, fennel, caviar",
    price: 0,
    image: u("photo-1559339352-11d035aa65de", 900),
  },
  {
    id: "course-iv",
    name: "Aged Beef",
    category: "tasting",
    description: "Marrow, sauce périgourdine, wilted greens",
    price: 0,
    image: u("photo-1555939594-58d7cb561ad1", 900),
    dietary: ["GF"],
  },
  {
    id: "course-v",
    name: "Dark Chocolate, Coffee & Malt",
    category: "tasting",
    description: "Theatre of texture — the last note of the evening",
    price: 0,
    image: u("photo-1519671482749-fd09be7ccebf", 900),
    dietary: ["V"],
  },
  {
    id: "negroni",
    name: "Noir(é) Negroni",
    category: "drinks",
    description: "London dry gin, campari, sweet vermouth",
    price: 16,
    image: u("photo-1470337458703-46ad1756a187", 900),
  },
  {
    id: "old-fashioned",
    name: "Smoked Old Fashioned",
    category: "drinks",
    description: "Rye, black walnut bitters, burnt sugar",
    price: 18,
    image: u("photo-1536935338788-846bb9981813", 900),
  },
  {
    id: "spritz",
    name: "Le Suprême Spritz",
    category: "drinks",
    description: "Elderflower, prosecco, soda water",
    price: 15,
    image: u("photo-1551538827-9c037cb4f32a", 900),
  },
  {
    id: "vino",
    name: "Sommelier's Selection",
    category: "drinks",
    description: "A rotating glass from our cellar — ask your sommelier",
    price: 14,
    image: u("photo-1506377247377-2a5b3b417ebb", 900),
  },
  {
    id: "amaro",
    name: "House Amaro",
    category: "drinks",
    description: "Espresso, grappa, cracked hazelnut",
    price: 13,
    image: u("photo-1514362545857-3bc16c4c7d1b", 900),
  },
  {
    id: "zeroproof",
    name: "Zero-Proof Tonic",
    category: "drinks",
    description: "House citrus cordial, rosemary, soda",
    price: 8,
    image: u("photo-1497534446932-c925b458314e", 900),
    dietary: ["V", "VG"],
  },
];

export const menuCategories: MenuCategory[] = [
  {
    id: "dinner",
    name: "Dinner",
    description: "A la carte — the evening, built your way.",
    dishIds: [
      "octopus",
      "burrata",
      "scallops",
      "tartare",
      "risotto",
      "ribeye",
      "salmon",
      "chicken",
      "lamb",
      "cavatelli",
      "halibut",
      "filet",
    ],
  },
  {
    id: "starters",
    name: "Starters",
    description: "Small plates to begin the meal.",
    dishIds: ["octopus", "burrata", "scallops", "tartare", "soup", "focaccia"],
  },
  {
    id: "mains",
    name: "Mains",
    description: "The heart of the table.",
    dishIds: [
      "risotto",
      "ribeye",
      "salmon",
      "chicken",
      "lamb",
      "cavatelli",
      "halibut",
      "filet",
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "The last, sweet note.",
    dishIds: ["choc-tart", "creme-brulee", "apple-tarte", "cheese", "sorbet"],
  },
  {
    id: "tasting",
    name: "Tasting Menu",
    description: "Five courses. One story. Paired wines optional.",
    dishIds: ["course-i", "course-ii", "course-iii", "course-iv", "course-v"],
  },
  {
    id: "drinks",
    name: "Drinks",
    description: "Cocktails, cellar picks and quiet classics.",
    dishIds: ["negroni", "old-fashioned", "spritz", "vino", "amaro", "zeroproof"],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Every course felt intentional. Beautiful food, exceptional service and an atmosphere we didn't want to leave.",
    guest: "Alexandra M.",
  },
  {
    id: "t2",
    quote:
      "The room glows. The cooking is precise without being precious — the truffle risotto alone is worth the journey.",
    guest: "Daniel R.",
    source: "The City Table Review",
  },
  {
    id: "t3",
    quote:
      "We came for our anniversary and were treated like regulars from the first pour. A rare kind of place.",
    guest: "Priya & Sam K.",
  },
  {
    id: "t4",
    quote:
      "Theatre in a tasting menu. Each plate is composed like a still life — and tastes even better than it looks.",
    guest: "Jonas W.",
    source: "Evening Standard Weekly",
  },
  {
    id: "t5",
    quote:
      "Quietly the best meal we've had in years. Perfectly paced, perfectly poured, perfectly lit.",
    guest: "Elena M.",
  },
];

export const galleryImages: GalleryImage[] = [
  // Dining Room
  {
    id: "dining-01",
    src: u("photo-1517248135467-4c7edcad34c4", 1200),
    alt: "The main dining room at NOIRÉ lit by warm pendant lights",
    category: "dining-room",
  },
  {
    id: "dining-02",
    src: u("photo-1555126634-323283e090fa", 1200),
    alt: "Low light over empty tables before evening service",
    category: "dining-room",
  },
  {
    id: "dining-03",
    src: u("photo-1519671482749-fd09be7ccebf", 1200),
    alt: "Candlelit banquet tables prepared for an evening of guests",
    category: "dining-room",
  },
  {
    id: "dining-04",
    src: u("photo-1550966871-3ed3cdb5ed0c", 1200),
    alt: "An intimate corner table dressed with linens and glassware",
    category: "dining-room",
  },
  {
    id: "dining-05",
    src: u("photo-1544148103-0773bf10d330", 1200),
    alt: "Guests toasting at a corner table under amber light",
    category: "dining-room",
  },

  // Food
  {
    id: "food-01",
    src: u("photo-1424847651672-bf20a4b0982b", 1200),
    alt: "A darkly plated dish finished with micro herbs",
    category: "food",
  },
  {
    id: "food-02",
    src: u("photo-1578985545062-69928b1d9587", 1200),
    alt: "A dark chocolate cake with a glossy finish",
    category: "food",
  },
  {
    id: "food-03",
    src: u("photo-1544025162-d76694265947", 1200),
    alt: "A dry-aged steak finished over open flame",
    category: "food",
  },
  {
    id: "food-04",
    src: u("photo-1551024506-0bccd828d307", 1200),
    alt: "A dark chocolate tart dusted with sea salt",
    category: "food",
  },
  {
    id: "food-05",
    src: u("photo-1473093295043-cdd812d0e601", 1200),
    alt: "Pasta being plated for a guest",
    category: "food",
  },
  {
    id: "food-06",
    src: u("photo-1476224203421-9ac39bcb3327", 1200),
    alt: "A plated entrée with seasonal vegetables and jus",
    category: "food",
  },
  {
    id: "food-07",
    src: u("photo-1600891964092-4316c288032e", 1200),
    alt: "A composed starter arranged on a ceramic plate",
    category: "food",
  },

  // Kitchen
  {
    id: "kitchen-01",
    src: u("photo-1577219491135-ce391730fb2c", 1200),
    alt: "The chef plating a course with quiet precision",
    category: "kitchen",
  },
  {
    id: "kitchen-02",
    src: u("photo-1559339352-11d035aa65de", 1200),
    alt: "The kitchen line during evening service",
    category: "kitchen",
  },
  {
    id: "kitchen-03",
    src: u("photo-1583394293214-28ded15ee548", 1200),
    alt: "Flames rising behind a chef at the pass",
    category: "kitchen",
  },
  {
    id: "kitchen-04",
    src: u("photo-1556911220-bff31c812dba", 1200),
    alt: "A chef plating with tweezers at the counter",
    category: "kitchen",
  },

  // Bar
  {
    id: "bar-01",
    src: u("photo-1537633552985-df8429e8048b", 1200),
    alt: "Wine being poured at an intimate table",
    category: "bar",
  },
  {
    id: "bar-02",
    src: u("photo-1470337458703-46ad1756a187", 1200),
    alt: "A craft cocktail resting on the bar",
    category: "bar",
  },
  {
    id: "bar-03",
    src: u("photo-1514362545857-3bc16c4c7d1b", 1200),
    alt: "The bartender preparing signature serves",
    category: "bar",
  },
  {
    id: "bar-04",
    src: u("photo-1552566626-52f8b828add9", 1200),
    alt: "A glass of wine lifted against a discreet bar backdrop",
    category: "bar",
  },

  // Moments
  {
    id: "moment-01",
    src: u("photo-1414235077428-338989a2e8c0", 1200),
    alt: "A candlelit table set for dinner with wine",
    category: "moments",
  },
  {
    id: "moment-02",
    src: u("photo-1519167758481-83f550bb49b3", 1200),
    alt: "A long table dressed for a private celebration",
    category: "moments",
  },
  {
    id: "moment-03",
    src: u("photo-1551632811-561732d1e306", 1200),
    alt: "Soft evening light through the window of the dining room",
    category: "moments",
  },
  {
    id: "moment-04",
    src: u("photo-1466978913421-dad2ebd01d17", 1200),
    alt: "Friends gathered over food and wine on a long evening",
    category: "moments",
  },
];

export const chef: Chef = {
  name: "Chef Matteo Laurent",
  role: "Chef & Co-Founder",
  bio: "Trained in Lyon and London, Matteo Laurent returned home with a single conviction: that a great restaurant is built on seasons, patience and people. At NOIRÉ he leads a small brigade that cooks close to the market — letting produce, not habit, decide the menu each week.",
  quote: "Cooking is a memory you can taste. We cook to be remembered.",
  portrait: u("photo-1577219491135-ce391730fb2c", 1200),
};

export const restaurantInfo: RestaurantInfo = {
  name: "NOIRÉ",
  tagline: "An evening worth remembering.",
  address: {
    street: "18 Mercer Street",
    city: "Downtown",
  },
  phone: "+1 (000) 555-0148",
  email: "hello@noire.example",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  hours: [
    { day: "Tuesday – Thursday", hours: "5:30 PM – 10:00 PM" },
    { day: "Friday – Saturday", hours: "5:30 PM – 11:00 PM" },
    { day: "Sunday", hours: "5:30 PM – 9:30 PM" },
    { day: "Monday", hours: "Closed" },
  ],
};

export function getDishById(id: string): Dish | undefined {
  return dishes.find((d) => d.id === id);
}

export function getCategoryDishes(categoryId: string): Dish[] {
  const category = menuCategories.find((c) => c.id === categoryId);
  if (!category) return [];
  return category.dishIds
    .map((id) => getDishById(id))
    .filter((d): d is Dish => Boolean(d));
}

export const featuredDishes: Dish[] = dishes.filter((d) => d.featured);

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Our Story", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Private Dining", href: "/private-dining" },
  { label: "Contact", href: "/contact" },
];