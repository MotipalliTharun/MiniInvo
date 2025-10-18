import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { authStore } from '../state/auth';

@customElement('logout-button')
export class LogoutButton extends LitElement {
  static styles = css`
    :host { display:inline-block }
    .btn {
      border:1px solid #00acc1; background:#00bcd4; color:#fff;
      padding:.6rem .9rem; border-radius:10px; font-weight:900; cursor:pointer;
    }
  `;

  @state() busy = false;
  @state() err = '';

  private async signout() {
    this.err = '';
    this.busy = true;
    try {
      await authStore.logout();
      this.dispatchEvent(new CustomEvent('logged-out', { bubbles: true, composed: true }));
    } catch (e: any) {
      this.err = e?.message || 'Logout failed.';
    } finally {
      this.busy = false;
    }
  }

  render() {
    return html`
      <button class="btn" ?disabled=${this.busy} @click=${() => this.signout()}>
        ${this.busy ? 'Signing out…' : 'Logout'}
      </button>
      ${this.err ? html`<div style="color:#b91c1c; font-size:.9rem; margin-top:.4rem">${this.err}</div>` : ''}
    `;
  }
}
declare global { interface HTMLElementTagNameMap { 'logout-button': LogoutButton } }
