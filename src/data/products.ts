export type Product = {
  id: string;
  name: string;
  slug: string;
  status: "sold_out" | "coming_soon" | "available";
  category: "tee" | "bag" | "hoodie" | "slides" | string;
  price?: string;
  variants?: Array<{ id: string; color: string; media: string[] }>;
  media?: string[];
};

// NOTE: Media paths intentionally match the client spec exactly.
// A resolver in the UI maps these to real public paths.
export const products: Product[] = [
  // Buyable raffle product (uses /public/mainProduct.png)
  {
    id: "raffle",
    name: "A Valuable Shirt",
    slug: "1-of-1-raffle-tee",
    status: "available",
    category: "tee",
    media: ["/GoldRushCollection.png"],
    variants: [
      { id: "raffle-blk", color: "Black", media: ["/mainProduct-black.png"] },
      { id: "raffle-wht", color: "White", media: ["/mainProduct-white.png"] },
    ],
  },
  // Coming soon products in positions 2 and 3
  {
    "id": "p6",
    "name": "Most Valuable Box Logo Hoodie",
    "slug": "most-valuable-box-logo-hoodie",
    "status": "coming_soon",
    "category": "hoodie",
    "price": "$1000",
    "media": ["/media/6Most Valuable box Logo Hoodie1.jpeg"]
  },
  {
    "id": "p7",
    "name": "MV Traditional Hoodie",
    "slug": "mv-traditional-hoodie",
    "status": "coming_soon",
    "category": "hoodie",
    "price": "$1000",
    "media": ["/Hoodie.png"]
  },
  // Rest of the products
  {
    "id": "p1b",
    "name": "Box Logo Tee - Black",
    "slug": "a-valuable-shirt-black",
    "status": "sold_out",
    "category": "tee",
    "price": "$250",
    "media": ["/media/1A Valuable Shirt-b1.png", "/media/2A Valuable Shirt-b2.png"]
  },
  {
    "id": "p1w",
    "name": "Box Logo Tee - White",
    "slug": "a-valuable-shirt-white",
    "status": "sold_out",
    "category": "tee",
    "price": "$250",
    "media": ["/media/1A Valuable Shirt-w1.png", "/media/2A Valuable Shirt2.png"]
  },
  {
    id: "p3",
    name: "Members Only Tee",
    slug: "members-only-tee-black",
    status: "sold_out",
    category: "tee",
    price: "$250",
    // default media (black) if no variant selected
    media: ["/media/3A Valuable Shirt-memb1.jpeg"],
    variants: [
      { id: "p3b", color: "Black", media: ["/media/3A Valuable Shirt-memb1.jpeg"] },
      { id: "p3w", color: "White", media: ["/media/3A Valuable Shirt-memw1.jpeg"] },
    ],
  },
  {
    "id": "p4",
    "name": "MV Camo Backpack",
    "slug": "mv-camo-backpack",
    "status": "sold_out",
    "category": "bag",
    "price": "$300",
    "media": ["/media/4MV camo backpack1.png", "/media/4MV camo backpack2.jpeg"]
  },
  {
    "id": "p5",
    "name": "MV Camo Duffel",
    "slug": "mv-camo-duffel",
    "status": "sold_out",
    "category": "bag",
    "price": "$1200",
    "media": ["/media/5MV camo Duffel.jpeg"]
  },
  {
    "id": "p8",
    "name": "MV Camo Slides",
    "slug": "mv-camo-slides",
    "status": "sold_out",
    "category": "slides",
    "price": "$150",
    "media": ["/media/8MV camo slides.MOV"]
  },
  {
    "id": "p9",
    "name": "MV Reversible Shorts",
    "slug": "mv-reversible-shorts",
    "status": "sold_out",
    "category": "shorts",
    "price": "$150",
    "media": ["/MV Reversible Shorts-f.png", "/MV Reversible Shorts-b.png"]
  }
];
