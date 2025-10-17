import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('landing-hero')
export class LandingHero extends LitElement {
  static styles = css`
    .wrap { display:grid; gap:1rem; place-items:center; text-align:center; padding:3rem 1rem; }
    h1 { font-size: clamp(1.6rem, 3vw, 2.4rem); margin:0 }
    p { color:#475569; max-width:50ch }
    .cta { display:flex; gap:.6rem; flex-wrap:wrap; justify-content:center; }
    a, button { padding:.75rem 1.1rem; border-radius:999px; border:1px solid #e2e8f0; background:#111827; color:white; cursor:pointer; text-decoration:none }
    .ghost { background:white; color:#111827 }
  `;
  render() {
    return html`
      <div class="wrap">
        <h1>📦 Inventory AI</h1>
        <p>Track stock, chat with your data, and automate reorders. Create an account to get started.</p>
        <div class="cta">
          <a href="#" @click=${(e:Event)=>{e.preventDefault(); this.toAccount();}}>Create account</a>
          <button class="ghost" @click=${this.toAccount}>Sign in</button>
        </div>
      </div>
    `;
  }
  private toAccount = () =>
    this.dispatchEvent(new CustomEvent('go-account', { bubbles:true, composed:true }));
}

declare global { interface HTMLElementTagNameMap { 'landing-hero': LandingHero } }
