export type SKU = string;

export interface Product {
  id: string;
  sku: SKU;
  name: string;
  category: string;
  qty: number;
  reorderLevel: number;
  price: number;       // per unit
  updatedAt: number;   // epoch ms
  location?: string;   // warehouse/bin
  tags?: string[];
}

export interface InventoryQuery {
  q?: string;              // free-text (name, sku, category)
  category?: string;
  lowStockOnly?: boolean;
  sort?: "name" | "qty" | "updatedAt" | "price";
  dir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
