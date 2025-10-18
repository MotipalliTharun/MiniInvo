import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("top-nav")
export class TopNav extends LitElement {
  @property({ type: Boolean }) authed = false;
  @property({ type: String }) role: string | null = null;
  @property({ type: String }) view: string = "home";
  @property({ type: String }) email: string | null = null;

  static styles = css`
    :host { display:block; }
    header {
      background: #ffffff;
      border-bottom: 1px solid #eef2f6;
      position: sticky; top: 0; z-index: 20;
    }
    .bar {
      max-width: 1120px; margin: 0 auto; padding: .8rem 1rem;
      display: grid; grid-template-columns: auto 1fr auto; gap: 1rem; align-items: center;
    }
    .brand { font-weight: 900; letter-spacing: -.02em; font-size: 1.1rem; }
    nav { display:flex; gap:.6rem; flex-wrap: wrap; }
    button.link {
      appearance: none; background: transparent; border: 0; cursor: pointer;
      padding: .5rem .7rem; border-radius: 10px; font-weight: 700; color: #334155;
      transition: background .15s ease, color .15s ease;
    }
    button.link[aria-current="page"] { color: #0f172a; background: #f3faff; }
    button.link:hover { background: #f3faff; color: #0f172a; }

    .right { display:flex; align-items:center; gap:.5rem; }
    .pill {
      border: 1px solid #e5f6fa; background: #e8fbff; color:#026775;
      padding: .3rem .6rem; border-radius: 999px; font-size: .82rem; font-weight: 800;
    }
    .btn {
      appearance:none; border:1px solid #00acc1; background:#00bcd4; color:#fff;
      padding:.6rem .8rem; border-radius:10px; font-weight:800; cursor:pointer;
      transition: background .2s, box-shadow .2s;
    }
    .btn:hover { background:#00acc1; box-shadow:0 0 10px rgba(0,188,212,.3); }
    .avatar {
      display:inline-flex; align-items:center; justify-content:center;
      width: 32px; height: 32px; border-radius: 999px; background:#f1f5f9; border:1px solid #e5e7eb;
      font-size: .9rem; color:#0f172a; font-weight:900;
    }
  `;

  private go(view: string) {
    this.dispatchEvent(new CustomEvent("navigate", { detail: { view }, bubbles: true, composed: true }));
  }
  private signout() {
    this.dispatchEvent(new CustomEvent("signout", { bubbles: true, composed: true }));
  }

  render() {
    const initials = this.email?.[0]?.toUpperCase() ?? "U";
    return html`
      <header>
        <div class="bar">
          <div class="brand">Clues Stack AI </div>

          <nav aria-label="Primary">
<button class="link" aria-current=${this.view==="home"?"page":"false"} @click=${() => this.go("home")}>Home</button>
<button class="link" aria-current=${this.view==="blog"?"page":"false"} @click=${() => this.go("blog")}>Blog</button>
<button class="link" aria-current=${this.view==="about"?"page":"false"} @click=${() => this.go("about")}>About</button>
<button class="link" aria-current=${this.view==="contact"?"page":"false"} @click=${() => this.go("contact")}>Contact</button>
${this.authed ? html`
  <button class="link" aria-current=${this.view==="profile"?"page":"false"} @click=${() => this.go("profile")}>User details</button>
`: null}

          </nav>

          <div class="right">
            ${this.authed
              ? html`
                  <span class="pill">${this.role ?? "user"}</span>
                  <span class="avatar" title=${this.email ?? ""}>${initials}</span>
                  <button class="btn" @click=${this.signout}>Logout</button>
                `
              : html`
                  <button class="btn" @click=${() => this.go("account")}>Login</button>
                `}
          </div>
        </div>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "top-nav": TopNav }
}
