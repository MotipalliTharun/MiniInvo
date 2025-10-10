import { LitElement, css, html } from "lit";
import { inventoryStore } from "../inventory/store";
import "./inv-search";
import "./inv-table";

export class InventoryApp extends LitElement {
  static properties = {
    _tick: { state: true },
  } as const;

  _tick = 0;

  static styles = css`
    :host {
      display:block;
      color:#1f2937; /* slate-800 */
      font-family: Inter, system-ui, sans-serif;
    }

    .section {
      display:flex;
      flex-direction:column;
      gap: 1rem;
    }

    .toolbar {
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:.75rem;
    }

    .pill {
      border: 1px solid #e2e8f0;     /* gray-200 */
      border-radius: 999px;
      padding: .35rem .65rem;
      color: #475569;                /* slate-600 */
      background: #f1f5f9;           /* slate-100 */
      font-size: .9rem;
    }

    button {
      border: 1px solid #2563eb;     /* blue-600 */
      background: #2563eb;
      color: #fff;
      border-radius: 12px;
      padding: .55rem .9rem;
      cursor: pointer;
      transition: filter 120ms ease, transform 40ms ease;
      font-weight: 600;
    }
    button:hover { filter: brightness(1.05); }
    button:active { transform: translateY(1px); }
    button:disabled {
      opacity: .6;
      cursor: not-allowed;
      filter: none;
    }

    .note {
      color:#0f172a;                 /* slate-900 */
      background:#e0f2fe;            /* sky-100 */
      border:1px solid #bae6fd;      /* sky-200 */
      padding:.6rem .8rem;
      border-radius:12px;
      box-shadow: 0 1px 6px rgba(0,0,0,.04);
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    // Initial load
    inventoryStore.search().then(()=> this._tick++);
  }

  private onQuery(e: CustomEvent) {
    inventoryStore.search({ ...e.detail }).then(()=> this._tick++);
  }
  private onSort(e: CustomEvent) {
    inventoryStore.search({ sort: e.detail.sort, dir: e.detail.dir, page: 1 }).then(()=> this._tick++);
  }
  private onPage(e: CustomEvent) {
    inventoryStore.search({ page: e.detail.page }).then(()=> this._tick++);
  }
  private async aiSuggest() {
    // Optional: brief disable UX if already loading data
    const btn = this.renderRoot?.querySelector<HTMLButtonElement>('button[data-ai]');
    if (btn) btn.disabled = true;
    try {
      await inventoryStore.suggest();
      this._tick++; // re-render to show note
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  render() {
    const s = inventoryStore;
    const q = s.lastQuery;
    return html`
      <section class="section">
        <div class="toolbar">
          <span class="pill">Inventory • ${s.data.total} items</span>
          <button data-ai @click=${this.aiSuggest} ?disabled=${s.loading}>🤖 AI Suggest Restock</button>
        </div>

        <inv-search
          .q=${q.q ?? ""}
          .category=${q.category ?? ""}
          .lowStockOnly=${q.lowStockOnly ?? false}
          @change-query=${this.onQuery}
        ></inv-search>

        ${s.aiNote ? html`<div class="note" aria-live="polite">AI: ${s.aiNote}</div>` : null}

        <inv-table
          .items=${s.data.items}
          .total=${s.data.total}
          .page=${s.data.page}
          .pageSize=${s.data.pageSize}
          .sort=${q.sort ?? "updatedAt"}
          .dir=${q.dir ?? "desc"}
          .loading=${s.loading}
          @change-sort=${this.onSort}
          @change-page=${this.onPage}
        ></inv-table>
      </section>
    `;
  }
}
customElements.define("inventory-app", InventoryApp);
