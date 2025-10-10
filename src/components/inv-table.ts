import { LitElement, css, html, nothing } from "lit";
import type { Product } from "../inventory/types";

export class InvTable extends LitElement {
  static properties = {
    items: { type: Array },
    total: { type: Number },
    page: { type: Number },
    pageSize: { type: Number },
    sort: { type: String },
    dir: { type: String },
    loading: { type: Boolean, reflect: true },
  } as const;

  items: Product[] = [];
  total = 0;
  page = 1;
  pageSize = 20;
  sort: "name"|"qty"|"updatedAt"|"price" = "updatedAt";
  dir: "asc"|"desc" = "desc";
  loading = false;

 static styles = css`
    :host {
      display: block;
      color: #1f2937; /* slate-800 */
      font-family: Inter, system-ui, sans-serif;
    }

    .wrap {
      border: 1px solid #e5e7eb;         /* gray-200 */
      border-radius: 16px;
      overflow: clip;
      background: #ffffff;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    thead th {
      position: sticky; top: 0; z-index: 1;
      background: #f8fafc;               /* slate-50 */
      color: #334155;                    /* slate-700 */
      font-weight: 600;
      text-align: left;
      padding: 0.7rem 0.9rem;
      border-bottom: 1px solid #e5e7eb;
      user-select: none;
      cursor: pointer;
    }

    thead th:hover {
      background: #eef2f7;               /* slightly darker */
    }

    tbody td {
      padding: 0.65rem 0.9rem;
      border-bottom: 1px solid #eef2f7;
      vertical-align: middle;
      color: #1f2937;
    }

    tbody tr:hover td {
      background: #f9fafb;               /* gray-50 */
    }

    .sku {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      color: #475569;                    /* slate-600 */
      font-size: 0.95rem;
    }

    .badge {
      padding: 0.18rem 0.5rem;
      border-radius: 999px;
      font-size: 0.75rem;
      border: 1px solid #e2e8f0;
      background: #f1f5f9;
      color: #334155;
      display: inline-block;
      margin-left: .4rem;
    }

    .low {
      border-color: #fecaca;             /* red-200 */
      background: #fee2e2;               /* red-100 */
      color: #b91c1c;                    /* red-700 */
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.7rem 0.9rem;
      background: #ffffff;
    }

    .muted {
      color: #64748b;                    /* slate-500 */
      font-size: 0.9rem;
    }

    .pager button {
      border: 1px solid #cbd5e1;         /* slate-300 */
      background: #f8fafc;
      color: #334155;
      border-radius: 10px;
      padding: 0.4rem 0.7rem;
      cursor: pointer;
      transition: background 120ms ease;
      margin-left: .4rem;
    }
    .pager button:hover { background: #e2e8f0; }
    .pager button:disabled {
      opacity: .45;
      cursor: not-allowed;
      background: #f1f5f9;
    }

    .spinner {
      display: inline-flex;
      align-items: center;
      gap: .5rem;
      color: #334155;
    }
    .dot {
      width: 8px; height: 8px; border-radius: 999px;
      background: #2563eb;               /* blue-600 */
      animation: pulse 1s infinite ease-in-out;
    }
    .dot:nth-child(2) { animation-delay: .15s; }
    .dot:nth-child(3) { animation-delay: .3s; }
    @keyframes pulse {
      0%, 100% { opacity: .3; transform: translateY(0); }
      50% { opacity: 1; transform: translateY(-2px); }
    }

    .empty {
      text-align: center;
      color: #64748b;
      padding: 1.2rem;
    }
  `;
  private sortBy(k: "name"|"qty"|"updatedAt"|"price") {
    const dir = this.sort === k && this.dir === "asc" ? "desc" : "asc";
    this.dispatchEvent(new CustomEvent("change-sort", { detail: { sort: k, dir }, bubbles:true, composed:true }));
  }
  private setPage(p: number) {
    if (p < 1) return;
    const totalPages = Math.max(1, Math.ceil(this.total / this.pageSize));
    if (p > totalPages) return;
    this.dispatchEvent(new CustomEvent("change-page", { detail: { page: p }, bubbles:true, composed:true }));
  }

  render() {
    return html`
      <div class="wrap">
        <table>
          <thead>
            <tr>
              <th @click=${()=>this.sortBy("name")}>Product ${this.sort==="name" ? (this.dir==="asc"?"▲":"▼") : nothing}</th>
              <th>SKU</th>
              <th @click=${()=>this.sortBy("qty")}>Qty ${this.sort==="qty" ? (this.dir==="asc"?"▲":"▼") : nothing}</th>
              <th>Reorder</th>
              <th @click=${()=>this.sortBy("price")}>Price ${this.sort==="price" ? (this.dir==="asc"?"▲":"▼") : nothing}</th>
              <th>Category</th>
              <th @click=${()=>this.sortBy("updatedAt")}>Updated ${this.sort==="updatedAt" ? (this.dir==="asc"?"▲":"▼") : nothing}</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            ${this.items.map(p => html`
              <tr>
                <td>${p.name}</td>
                <td>${p.sku}</td>
                <td>
                  ${p.qty}
                  ${p.qty <= p.reorderLevel ? html`<span class="badge low">Low</span>` : nothing}
                </td>
                <td>${p.reorderLevel}</td>
                <td>$${p.price.toFixed(2)}</td>
                <td>${p.category}</td>
                <td>${new Date(p.updatedAt).toLocaleDateString()}</td>
                <td>${p.location ?? "-"}</td>
              </tr>
            `)}
          </tbody>
        </table>
        <div class="footer">
          <div>${this.total} items • page ${this.page} of ${Math.max(1, Math.ceil(this.total / this.pageSize))}</div>
          <div>
            <button @click=${()=>this.setPage(this.page-1)}>Prev</button>
            <button @click=${()=>this.setPage(this.page+1)}>Next</button>
          </div>
          ${this.loading ? html`<div class="spinner">Loading…</div>` : html`<div></div>`}
        </div>
      </div>
    `;
  }
}
customElements.define("inv-table", InvTable);
