/* =========================================================
   CONTENT.JS
   This is the ONLY file you should need to touch to change
   what the shop sells. Everything below is plain data —
   no logic lives here.

   To swap a product photo later (e.g. from GitHub), just
   replace the "image" URL for that product.
   ========================================================= */

// ---- 1. Business details (shown in header, footer, receipts) ----
const BUSINESS = {
  name: "MeBaca",
  tagline: "Stories passed down, page by page.",
  about:
    "MeBaca has been a family bookshop for three generations. We stock the books we grew up loving, alongside new voices we think you'll love too.",
  contact: {
    phone: "+60 12-345 6789",
    email: "hello@mebaca.shop",
    address: "12 Jalan Buku, George Town, Penang",
  },
  hours: "Mon–Sat, 10am–7pm",
};

// ---- 2. Payment methods offered at checkout ----
const PAYMENT_METHODS = ["Cash on pickup/delivery", "Bank Transfer", "Card on Pickup"];

// ---- 3. Categories ----
// "id" must be unique and lowercase — it's used to filter products.
const CATEGORIES = [
  { id: "fiction", name: "Fiction" },
  { id: "nonfiction", name: "Non-Fiction" },
  { id: "childrens", name: "Children's" },
  { id: "local", name: "Local Authors" },
  { id: "stationery", name: "Stationery" },
];

// ---- 4. Products ----
// "category" must match one of the CATEGORY ids above.
// "image" is a placeholder for now — swap these for real photo
// links later.
const PRODUCTS = [
  {
    id: "p01",
    name: "The Quiet Harbour",
    category: "fiction",
    price: 32.9,
    description: "A slow-burning novel about a fishing town and the family that stayed.",
    image: "https://placehold.co/400x520/EAF4FB/1F2A38?text=The+Quiet+Harbour",
  },
  {
    id: "p02",
    name: "Paper Moons",
    category: "fiction",
    price: 28.5,
    description: "Three sisters, one inheritance, and a house full of secrets.",
    image: "https://placehold.co/400x520/EAF4FB/1F2A38?text=Paper+Moons",
  },
  {
    id: "p03",
    name: "Letters I Never Sent",
    category: "fiction",
    price: 24.0,
    description: "An epistolary novel told entirely through unopened envelopes.",
    image: "https://placehold.co/400x520/EAF4FB/1F2A38?text=Letters+I+Never+Sent",
  },
  {
    id: "p04",
    name: "How Cities Breathe",
    category: "nonfiction",
    price: 39.9,
    description: "An urban planner's field notes on what makes a street feel alive.",
    image: "logo/Lumina Ai Logo (final)-01.png",
  },
  {
    id: "p05",
    name: "The Home Cook's Atlas",
    category: "nonfiction",
    price: 45.0,
    description: "A world map told through 80 family recipes, with photos from each kitchen.",
    image: "https://placehold.co/400x520/EAF4FB/1F2A38?text=The+Home+Cook%27s+Atlas",
  },
  {
    id: "p06",
    name: "Small Machines, Big Ideas",
    category: "nonfiction",
    price: 34.5,
    description: "A friendly history of everyday inventions and the people behind them.",
    image: "https://placehold.co/400x520/EAF4FB/1F2A38?text=Small+Machines",
  },
  {
    id: "p07",
    name: "The Bear Who Borrowed the Moon",
    category: "childrens",
    price: 18.9,
    description: "A bedtime story about a bear who returns what he borrows — eventually.",
    image: "https://placehold.co/400x520/EAF4FB/1F2A38?text=The+Bear+%26+the+Moon",
  },
  {
    id: "p08",
    name: "Ten Tiny Dragons",
    category: "childrens",
    price: 16.9,
    description: "A counting book starring ten dragons who really don't want to nap.",
    image: "https://placehold.co/400x520/EAF4FB/1F2A38?text=Ten+Tiny+Dragons",
  },
  {
    id: "p09",
    name: "My First Alphabet of Penang",
    category: "childrens",
    price: 15.0,
    description: "A local A-to-Z picture book of foods, streets, and festivals.",
    image: "https://placehold.co/400x520/EAF4FB/1F2A38?text=Alphabet+of+Penang",
  },
  {
    id: "p10",
    name: "Monsoon Diaries",
    category: "local",
    price: 27.0,
    description: "Short stories from a Penang-based writer, set during six rainy seasons.",
    image: "https://placehold.co/400x520/EAF4FB/1F2A38?text=Monsoon+Diaries",
  },
  {
    id: "p11",
    name: "Nasi Lemak at Midnight",
    category: "local",
    price: 25.9,
    description: "A debut poetry collection about food, homesickness, and coming home.",
    image: "https://placehold.co/400x520/EAF4FB/1F2A38?text=Nasi+Lemak+at+Midnight",
  },
  {
    id: "p12",
    name: "Grandmother's Shophouse",
    category: "local",
    price: 30.0,
    description: "A graphic memoir about growing up above a family trading business.",
    image: "https://placehold.co/400x520/EAF4FB/1F2A38?text=Grandmother%27s+Shophouse",
  },
  {
    id: "p13",
    name: "MeBaca Fountain Pen",
    category: "stationery",
    price: 22.0,
    description: "Our house fountain pen, medium nib, in navy or sky blue.",
    image: "https://placehold.co/400x520/EAF4FB/1F2A38?text=MeBaca+Fountain+Pen",
  },
  {
    id: "p14",
    name: "Reader's Notebook",
    category: "stationery",
    price: 14.5,
    description: "A dot-grid notebook with a page for every book you finish this year.",
    image: "https://placehold.co/400x520/EAF4FB/1F2A38?text=Reader%27s+Notebook",
  },
  {
    id: "p15",
    name: "Brass Bookmark Set",
    category: "stationery",
    price: 9.9,
    description: "Three engraved brass bookmarks, packaged in a linen pouch.",
    image: "https://placehold.co/400x520/EAF4FB/1F2A38?text=Brass+Bookmark+Set",
  },
];
