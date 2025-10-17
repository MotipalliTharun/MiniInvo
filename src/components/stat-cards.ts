import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('stat-cards')
export class StatCards extends LitElement {
  static styles = css`
    .grid{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}
    .card{padding:1rem;border:1px solid #e5e7eb;border-radius:12px;background:#fff}
    .k{font-size:.85rem;color:#64748b}
    .v{font-size:1.4rem;font-weight:700}
  `;
  @property({type:Array}) items: Array<{k:string,v:string}> = [];
  render(){ return html`
    <div class="grid">
      ${this.items.map(i => html`<div class="card"><div class="k">${i.k}</div><div class="v">${i.v}</div></div>`)}
    </div>
  `;}
}
declare global { interface HTMLElementTagNameMap { 'stat-cards': StatCards } }
