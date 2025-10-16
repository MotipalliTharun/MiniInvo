import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AuthController } from '../lib/authController';

@customElement('auth-guard')
export class AuthGuard extends LitElement {
  static styles = css`:host{display:block}`;
  private auth = new AuthController(this);

  render() {
    if (!this.auth.ready) return html`<p>Loading…</p>`;
    if (!this.auth.user) return html`<p>You must be signed in to view this page.</p>`;
    return html`<slot></slot>`;
  }
}
declare global { interface HTMLElementTagNameMap { 'auth-guard': AuthGuard; } }
