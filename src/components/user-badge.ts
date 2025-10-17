import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { authStore } from '../state/auth';

@customElement('user-badge')
export class UserBadge extends LitElement {
  static styles = css`
    .wrap { display:flex; gap:.6rem; align-items:center; }
    .dot { width:8px; height:8px; border-radius:999px; background:#10b981; }
    .dot.guest { background:#f59e0b; }
    button { padding:.45rem .75rem; border:1px solid #e2e8f0; border-radius:10px; background:#f8fafc; cursor:pointer }
  `;

  @state() email: string | null = null;
  @state() ready = false;

  private off?: () => void;

  connectedCallback() {
    super.connectedCallback();
    this.sync();
    this.off = authStore.on('change', () => this.sync());
  }
  disconnectedCallback() {
    this.off?.();
    super.disconnectedCallback();
  }
  private sync() {
    this.email = authStore.user?.email ?? null;
    this.ready = authStore.ready;
    this.requestUpdate();
  }

  render() {
    if (!this.ready) return html`<span>…</span>`;
    if (!this.email) {
      return html`<span class="wrap"><span class="dot guest"></span><span>Guest</span></span>`;
    }
    return html`
      <div class="wrap">
        <span class="dot"></span>
        <span>${this.email}</span>
        <button @click=${() => authStore.signOut()}>Log out</button>
      </div>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'user-badge': UserBadge } }
