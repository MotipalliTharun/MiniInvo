import type { InventoryQuery, Paged, Product } from "./types";
import { fetchInventory, aiRestockSuggestion } from "./api.mock";

export class InventoryStore {
  data: Paged<Product> = { items: [], total: 0, page: 1, pageSize: 20 };
  loading = false;
  lastQuery: InventoryQuery = { page: 1, pageSize: 20, sort: "updatedAt", dir: "desc" };
  aiNote: string | null = null;

  async search(patch: Partial<InventoryQuery> = {}) {
    this.loading = true;
    this.lastQuery = { ...this.lastQuery, ...patch, page: patch.page ?? 1 };
    try {
      this.data = await fetchInventory(this.lastQuery);
    } finally {
      this.loading = false;
    }
  }

  async suggest() {
    const sample = this.data.items.slice(0, 12);
    this.aiNote = await aiRestockSuggestion(sample);
  }
}

export const inventoryStore = new InventoryStore();
