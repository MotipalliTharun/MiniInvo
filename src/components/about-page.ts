import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("about-page")
export class AboutPage extends LitElement {
  static styles = css`
    :host { display:block }
    .hero {
      background: linear-gradient(180deg, #f3faff, #ffffff);
      padding: clamp(1rem, 4vw, 2rem);
      border: 1px solid #eef2f6; border-radius: 16px;
    }
    .h1 { margin:0 0 .4rem 0; font-weight:900; letter-spacing:-.02em; font-size: clamp(1.6rem, 3vw, 2.2rem); }
    .sub { color:#6b7280; max-width: 65ch }
    .grid { display:grid; gap:1rem; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); margin-top:1rem }
    .card { border:1px solid #eef2f6; border-radius: 12px; padding: 1rem; background: #fff; }
    .k { font-weight:800; color:#0f172a }
    .v { color:#475569 }
    .tag { display:inline-flex; align-items:center; gap:.5rem; border:1px solid #d9f3f8; background:#e8fbff;
           padding:.3rem .6rem; border-radius:999px; font-weight:800; color:#026775; font-size:.8rem; }
  `;

  @property({type:String}) brand = "Inventory Blog";
  @property({type:String}) mission = "Help small businesses understand stock levels, publish helpful content, and make smarter inventory decisions with a friendly, fast experience.";

  render() {
    return html`
      <section class="hero">
        <span class="tag">About us</span>
        <h1 class="h1">${this.brand}</h1>
        <p class="sub">${this.mission}</p>

        <div class="grid">
          <div class="card">
            <div class="k">Our story</div>
            <div class="v">We started as a tiny tool to track what’s in stock and turned into a blog-first platform that teaches, inspires, and helps you act.</div>
          </div>
          <div class="card">
            <div class="k">Principles</div>
            <div class="v">Clarity over clutter. Speed over complexity. Respect for users’ time and privacy.</div>
          </div>
          <div class="card">
            <div class="k">What’s next</div>
            <div class="v">Role-based publishing, better product analytics, and AI assistance for creating and managing content.</div>
          </div>
        </div>
      </section>
    `;
  }
}
declare global { interface HTMLElementTagNameMap { "about-page": AboutPage } }
