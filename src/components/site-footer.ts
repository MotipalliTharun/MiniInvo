import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("site-footer")
export class SiteFooter extends LitElement {
  static styles = css`
    :host { display:block; }
    footer {
      margin-top:1rem; border-top:1px solid #eef2f6; background:#fff;
    }
    .bar {
      max-width: 1120px; margin: 0 auto; padding: 1rem;
      display:flex; justify-content:space-between; gap:.8rem; flex-wrap:wrap; color:#475569;
    }
    a { color:#026775; font-weight:800; text-decoration:none }
    a:hover { color:#00acc1; }
    .row { display:flex; gap:.6rem; flex-wrap:wrap }
  `;
  render() {
    return html`
      <footer>
        <div class="bar">
          <div>© ${new Date().getFullYear()} Cluesstack</div>
          <div class="row">
            <a href="https://x.com/yourhandle" target="_blank" rel="noopener">X</a>
            <a href="https://www.linkedin.com/company/yourbrand" target="_blank" rel="noopener">LinkedIn</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </footer>
    `;
  }
}
declare global { interface HTMLElementTagNameMap { "site-footer": SiteFooter } }
