import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('side-nav')
export class SideNav extends LitElement {
  static styles = css`
    nav {
      position: sticky; top: 1rem;
      display:grid; gap:.4rem; padding:.6rem;
      background: var(--panel);
      border:1px solid var(--border);
      border-radius: var(--r-lg);
      box-shadow: var(--elev-1);
      min-width: 200px;
    }
    button {
      all: unset; padding:.55rem .7rem; border-radius: .6rem; cursor:pointer;
      color: var(--text);
    }
    button[selected] { background: rgba(37,99,235,.1); }
    .section { font-size:.75rem; color: var(--muted); padding:.2rem .4rem; margin-top:.4rem }
  `;
  @property({ type: String }) view: string = 'inventory';
  render() {
    return html`
      <nav>
        <div class="section">Main</div>
        <button ?selected=${this.view==='inventory'} @click=${() => this.dispatch('inventory')}>📦 Inventory</button>
        <button ?selected=${this.view==='assistant'} @click=${() => this.dispatch('assistant')}>🤖 Assistant</button>
        <button ?selected=${this.view==='account'}   @click=${() => this.dispatch('account')}>👤 Account</button>
      </nav>
    `;
  }
  private dispatch(view: string) { this.dispatchEvent(new CustomEvent('go', { detail: { view }, bubbles:true, composed:true })); }
}
declare global { interface HTMLElementTagNameMap { 'side-nav': SideNav } }
