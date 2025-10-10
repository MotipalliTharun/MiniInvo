import { LitElement, css, html } from "lit";

export class InvSearch extends LitElement {
  static properties = {
    q: { type: String },
    category: { type: String },
    lowStockOnly: { type: Boolean, attribute: "low-stock-only", reflect: true },
  } as const;

  q = "";
  category = "";
  lowStockOnly = false;

  static styles = css`
    :host {
      display: block;
      color: #1f2937; /* slate-800 */
      font-family: Inter, system-ui, sans-serif;
    }

    .bar {
      display: flex;
      gap: .6rem;
      align-items: center;
      flex-wrap: wrap;
    }

    input[type="text"],
    select {
      background: #ffffff;
      color: #0f172a;                 /* slate-900 */
      border: 1px solid #cbd5e1;      /* slate-300 */
      border-radius: 12px;
      padding: .55rem .65rem;
      min-width: 14rem;
      outline: none;
      transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;
    }
    input[type="text"]::placeholder { color: #94a3b8; } /* slate-400 */
    input[type="text"]:focus,
    select:focus {
      border-color: #2563eb;          /* blue-600 */
      box-shadow: 0 0 0 3px rgba(37,99,235,.15);
      background: #ffffff;
    }

    /* Toggle (Low stock only) */
    .toggle {
      display: inline-flex;
      gap: .5rem;
      align-items: center;
      cursor: pointer;
      user-select: none;
      padding: .35rem .55rem;
      border-radius: 999px;
      border: 1px solid #e2e8f0;      /* gray-200 */
      background: #f8fafc;            /* slate-50 */
      color: #334155;                 /* slate-700 */
      transition: background 120ms ease, border-color 120ms ease;
    }
    .toggle:hover { background: #e2e8f0; }

    .toggle input[type="checkbox"] {
      appearance: none;
      width: 36px;
      height: 20px;
      border-radius: 999px;
      border: 1px solid #cbd5e1;      /* slate-300 */
      background: #e2e8f0;            /* slate-200 */
      position: relative;
      outline: none;
      transition: background 120ms ease, border-color 120ms ease;
    }
    .toggle input[type="checkbox"]::after {
      content: "";
      position: absolute;
      top: 2px; left: 2px;
      width: 16px; height: 16px; border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 1px 2px rgba(0,0,0,.15);
      transition: transform 120ms ease;
    }
    .toggle input[type="checkbox"]:checked {
      background: #2563eb;            /* blue-600 */
      border-color: #2563eb;
    }
    .toggle input[type="checkbox"]:checked::after {
      transform: translateX(16px);
    }

    button {
      border: 1px solid #2563eb;      /* blue-600 */
      background: #2563eb;
      color: #ffffff;
      border-radius: 12px;
      padding: .55rem .85rem;
      cursor: pointer;
      font-weight: 600;
      transition: filter 120ms ease, transform 40ms ease;
    }
    button:hover { filter: brightness(1.05); }
    button:active { transform: translateY(1px); }
  `;

  private emitChange() {
    this.dispatchEvent(new CustomEvent("change-query", {
      detail: {
        q: this.q,
        category: this.category || undefined,
        lowStockOnly: this.lowStockOnly
      },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="bar" role="search" aria-label="Inventory search">
        <input
          type="text"
          placeholder="Search (name, SKU, category)"
          .value=${this.q}
          @input=${(e: Event) => { this.q = (e.target as HTMLInputElement).value; this.emitChange(); }}
          aria-label="Search text"
        />

        <select
          .value=${this.category}
          @change=${(e: Event) => { this.category = (e.target as HTMLSelectElement).value; this.emitChange(); }}
          aria-label="Category"
        >
          <option value="">All categories</option>
          <option>Beverages</option>
          <option>Snacks</option>
          <option>Supplements</option>
          <option>Medical</option>
          <option>Misc</option>
        </select>

        <label class="toggle" aria-label="Low stock only">
          <input
            type="checkbox"
            .checked=${this.lowStockOnly}
            @change=${(e: Event) => { this.lowStockOnly = (e.target as HTMLInputElement).checked; this.emitChange(); }}
            role="switch"
            aria-checked=${String(this.lowStockOnly)}
          />
          Low stock only
        </label>

        <button @click=${() => this.emitChange()} aria-label="Apply filters">Apply</button>
      </div>
    `;
  }
}
customElements.define("inv-search", InvSearch);
