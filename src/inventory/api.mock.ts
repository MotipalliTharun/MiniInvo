import type { InventoryQuery, Paged, Product } from "./types";

// seed mock products
const categories = ["Beverages", "Snacks", "Supplements", "Medical", "Misc"];
const products: Product[] = Array.from({ length: 120 }).map((_, i) => ({
  id: `p_${i + 1}`,
  sku: `SKU-${(10000 + i).toString(36).toUpperCase()}`,
  name: `Item ${i + 1}`,
  category: categories[i % categories.length],
  qty: Math.floor(Math.random() * 250),
  reorderLevel: 30,
  price: +(Math.random() * 90 + 10).toFixed(2),
  updatedAt: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30),
  location: `Aisle ${1 + (i % 10)}-Bin ${1 + (i % 5)}`,
  tags: i % 7 === 0 ? ["featured"] : undefined,
}));

export async function fetchInventory(q: InventoryQuery): Promise<Paged<Product>> {
  const {
    q: search = "",
    category,
    lowStockOnly,
    sort = "updatedAt",
    dir = "desc",
    page = 1,
    pageSize = 20,
  } = q || {};

  let filtered = products.slice();
  const needle = search.trim().toLowerCase();
  if (needle) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(needle) ||
      p.sku.toLowerCase().includes(needle) ||
      p.category.toLowerCase().includes(needle)
    );
  }
  if (category) filtered = filtered.filter(p => p.category === category);
  if (lowStockOnly) filtered = filtered.filter(p => p.qty <= p.reorderLevel);

  filtered.sort((a, b) => {
    const k = sort;
    const av = a[k]; const bv = b[k];
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return dir === "asc" ? cmp : -cmp;
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  await new Promise(r => setTimeout(r, 120)); // tiny latency
  return { items, total, page, pageSize };
}

// Placeholder AI suggestion—replace with your backend call later.
export async function aiRestockSuggestion(sample: Product[]): Promise<string> {
  const low = sample.filter(p => p.qty <= p.reorderLevel);
  if (!low.length) return "All items look healthy. No restock needed now.";
  const names = low.slice(0, 5).map(p => `${p.name} (qty ${p.qty})`).join(", ");
  return `Consider reordering: ${names}${low.length > 5 ? " …" : ""}. Target 2× reorder level for a 2-week buffer.`;
}
