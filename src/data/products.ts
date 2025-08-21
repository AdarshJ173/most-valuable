export type Product = {
  id: string;
  name: string;
  slug: string;
  status: "sold_out" | "coming_soon" | "available";
  category: "tee" | "bag" | "hoodie" | "slides" | string;
  variants?: Array<{ id: string; color: string; media: string[] }>;
  media?: string[];
};

// NOTE: Media paths intentionally match the client spec exactly.
// A resolver in the UI maps these to real public paths.
export const products: Product[] = [
  // Buyable raffle product (uses /public/mainProduct.png)
  {
    id: "raffle",
    name: "1-of-1 Raffle Tee",
    slug: "1-of-1-raffle-tee",
    status: "available",
    category: "tee",
    media: ["/mainProduct.png"],
  },
  // Coming soon products in positions 2 and 3
  {
    "id": "p6",
    "name": "Most Valuable Box Logo Hoodie",
    "slug": "most-valuable-box-logo-hoodie",
    "status": "coming_soon",
    "category": "hoodie",
    "media": ["/media/6Most Valuable box Logo Hoodie1.jpeg"]
  },
  {
    "id": "p7",
    "name": "MV Traditional Hoodie",
    "slug": "mv-traditional-hoodie",
    "status": "coming_soon",
    "category": "hoodie",
    "media": ["/media/7MV traditional Hoodie .jpeg"]
  },
  // Rest of the products
  {
    "id": "p1",
    "name": "A Valuable Shirt",
    "slug": "a-valuable-shirt",
    "status": "sold_out",
    "category": "tee",
    "variants": [
      { "id": "p1-blk", "color": "Black", "media": ["/media/1A Valuable Shirt-b1.png"] },
      { "id": "p1-wht", "color": "White", "media": ["/media/1A Valuable Shirt-w1.png"] }
    ]
  },
  {
    "id": "p2",
    "name": "Most Valuable Box Logo Tee",
    "slug": "most-valuable-box-logo-tee",
    "status": "sold_out",
    "category": "tee",
    "variants": [
      { "id": "p2-blk", "color": "Black", "media": ["/media/2A Valuable Shirt-b2.png"] },
      { "id": "p2-wht", "color": "White", "media": ["/media/2A Valuable Shirt2.png"] }
    ]
  },
  {
    "id": "p3",
    "name": "Members Only Tee",
    "slug": "members-only-tee",
    "status": "sold_out",
    "category": "tee",
    "variants": [
      { "id": "p3-blk", "color": "Black", "media": ["/media/3A Valuable Shirt-memb1.jpeg"] },
      { "id": "p3-wht", "color": "White", "media": ["/media/3A Valuable Shirt-memw1.jpeg"] }
    ]
  },
  {
    "id": "p4",
    "name": "MV Camo Backpack",
    "slug": "mv-camo-backpack",
    "status": "sold_out",
    "category": "bag",
    "media": ["/media/4MV camo backpack1.png", "/media/4MV camo backpack2.jpeg"]
  },
  {
    "id": "p5",
    "name": "MV Camo Duffel",
    "slug": "mv-camo-duffel",
    "status": "sold_out",
    "category": "bag",
    "media": ["/media/5MV camo Duffel.jpeg"]
  },
  {
    "id": "p8",
    "name": "MV Camo Slides",
    "slug": "mv-camo-slides",
    "status": "sold_out",
    "category": "slides",
    "media": ["/media/8MV camo slides.MOV"]
  }
];
