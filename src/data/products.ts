export type Product = {
  id: string;
  name: string;
  slug: string;
  status: "sold_out" | "coming_soon" | "available";
  category: "tee" | "bag" | "hoodie" | string;
  price?: string;
  description?: string;
  variants?: Array<{ id: string; color: string; media: string[] }>;
  media?: string[];
};

export const products: Product[] = [
  // Version 2.0 Collection
  {
    id: "mv-v2-tee-1",
    name: "A Valuable Shirt - Black",
    slug: "a-valuable-shirt-black",
    status: "available",
    category: "tee",
    price: "$65",
    description: "Premium heavyweight cotton tee from the Version 2.0 collection. Featuring a refined fit and signature branding in Black.",
    media: ["/new-tshirts/3EA5AC2B-D465-4476-B4CB-D4FB7FE655E4.jpeg"]
  },
  {
    id: "mv-v2-tee-3",
    name: "A Valuable Shirt - Gold",
    slug: "a-valuable-shirt-gold",
    status: "available",
    category: "tee",
    price: "$65",
    description: "Premium heavyweight cotton tee from the Version 2.0 collection. Featuring a refined fit and signature branding in Gold.",
    media: ["/new-tshirts/80691A88-B2C9-48AB-BC3D-2F488BB5709E.jpeg"]
  },
  {
    id: "mv-v2-tee-4",
    name: "A Valuable Shirt - Red",
    slug: "a-valuable-shirt-red",
    status: "available",
    category: "tee",
    price: "$65",
    description: "Premium heavyweight cotton tee from the Version 2.0 collection. Featuring a refined fit and signature branding in Red.",
    media: ["/new-tshirts/A87CD522-D362-48C7-A9D3-97763FD59405.jpeg"]
  },
  {
    id: "mv-v2-tee-5",
    name: "A Valuable Shirt - White",
    slug: "a-valuable-shirt-white",
    status: "available",
    category: "tee",
    price: "$65",
    description: "Premium heavyweight cotton tee from the Version 2.0 collection. Featuring a refined fit and signature branding in White.",
    media: ["/new-tshirts/E52AF589-FFDE-4D29-9F0C-3FB4CC7464FC.jpeg"]
  },

  // Coming Soon Products
  {
    "id": "cs1",
    "name": "MV Track Pants",
    "slug": "mv-track-pants",
    "status": "coming_soon",
    "category": "pants",
    "media": ["/Coming Soon/0F20297A-5779-4056-8133-DAAB1DBF3582.jpeg"]
  },
  {
    "id": "cs2",
    "name": "A Valuable Pillow",
    "slug": "a-valuable-pillow",
    "status": "coming_soon",
    "category": "home",
    "media": ["/Coming Soon/524427C4-666D-47BB-933D-A8F3B52A4CD1.png"]
  },
  {
    "id": "cs3",
    "name": "Valuable Glasses",
    "slug": "valuable-glasses",
    "status": "coming_soon",
    "category": "accessories",
    "media": ["/Coming Soon/60FDA3FE-A017-4C7A-91E7-17D1CB040313.jpeg"]
  },
  {
    "id": "cs4",
    "name": "A Valuable Beanbag",
    "slug": "a-valuable-beanbag",
    "status": "coming_soon",
    "category": "home",
    "media": ["/Coming Soon/705FF280-F144-486E-BB41-671B313F606A.jpeg"]
  },
  {
    "id": "cs5",
    "name": "MV Track Pants",
    "slug": "mv-track-pants-2",
    "status": "coming_soon",
    "category": "pants",
    "media": ["/Coming Soon/CF2BAE50-F485-43C3-8AE4-D638F71275F6.jpeg"]
  },
  {
    "id": "cs6",
    "name": "A Valuable Jacket",
    "slug": "a-valuable-jacket",
    "status": "coming_soon",
    "category": "jacket",
    "media": ["/Coming Soon/D6437BC8-D0C1-4CBC-8651-366AB706D6C8.png"]
  },

  // Sold Out Products (The Vault)
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
  }
];
