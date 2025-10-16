import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AuthController } from '../lib/authController';

@customElement('logout-button')
export class LogoutButton extends LitElement {
  private auth = new AuthController(this);
  render() {
    if (!this.auth.user) return html``;
    return html`<button @click=${() => this.auth.logout()}>Log out (${this.auth.user?.email})</button>`;
  }
}
declare global { interface HTMLElementTagNameMap { 'logout-button': LogoutButton; } }
