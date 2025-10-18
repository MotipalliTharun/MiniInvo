// src/components/top-nav.ts
import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { authStore } from "../lib/authStore";

/** Allow programmatic routes we navigate to */
type Route = "home" | "about" | "services" | "community" | "account" | "profile";

@customElement("top-nav")
export class TopNav extends LitElement {
  /** Current route (provided by parent) */
  @property({ type: String }) view: Route = "home";

  /** Auth state (provided by parent) */
  @property({ type: Boolean }) authed = false;
  @property({ type: String }) email: string | null = null;

  /** Mobile drawer */
  @state() private open = false;

  static styles = css`
    :host { display:block; }
    header { background:#fff; border-bottom:1px solid #eef2f6; position:sticky; top:0; z-index:50; }
    .bar { max-width:1120px; margin:0 auto; padding:.8rem 1rem;
      display:grid; grid-template-columns:auto 1fr auto; gap:1rem; align-items:center; }
    .brand { display:flex; align-items:center; gap:.6rem; font-weight:900; letter-spacing:-.02em;
      color:#0f172a; font-size:1.05rem; cursor:pointer; }
    .dot { width:10px; height:10px; border-radius:999px; background:#00bcd4; box-shadow:0 0 12px rgba(0,188,212,.45); }

    nav[role="tablist"] { display:flex; gap:.25rem; justify-content:center; align-items:center; }
    .link { appearance:none; border:0; background:transparent; cursor:pointer;
      padding:.55rem .8rem; border-radius:10px; font-weight:800; color:#334155;
      transition: background .15s ease, color .15s ease, box-shadow .15s ease; }
    .link:hover { background:#f3faff; color:#0f172a; }
    .link[aria-selected="true"] { background:#e8fbff; color:#026775; box-shadow:0 0 0 1px #cfeff5 inset; }

    .right { display:flex; gap:.5rem; align-items:center; }
    .btn { appearance:none; border:1px solid #00acc1; background:#00bcd4; color:#fff;
      padding:.55rem .8rem; border-radius:10px; font-weight:900; cursor:pointer;
      transition: background .15s ease, box-shadow .15s ease, transform .06s; }
    .btn:hover { background:#00acc1; box-shadow:0 0 10px rgba(0,188,212,.28); }
    .btn:active { transform: translateY(1px); }
    .ghost { appearance:none; border:1px solid #e5f6fa; background:#e8fbff; color:#026775;
      padding:.55rem .8rem; border-radius:10px; font-weight:900; cursor:pointer; }

    .avatar { width:28px; height:28px; border-radius:999px; background:#f1f5f9; border:1px solid #e5e7eb;
      display:inline-flex; align-items:center; justify-content:center; color:#0f172a; font-size:.85rem; font-weight:900; }

    .hamb { display:none; appearance:none; border:1px solid #e5e7eb; background:#fff; color:#0f172a;
      border-radius:10px; padding:.45rem .6rem; cursor:pointer; }
    .hamb:hover { background:#f8fafc; }

    .sheet { display:none; }
    .sheet.open { display:block; }
    .sheet-bg { position:fixed; inset:0; background:rgba(0,0,0,.2); backdrop-filter:blur(2px); }
    .sheet-panel { position:fixed; top:0; right:0; bottom:0; width:min(84vw,360px);
      background:#fff; border-left:1px solid #eef2f6; box-shadow:0 10px 30px rgba(0,0,0,.15);
      padding:1rem; display:grid; align-content:start; gap:.6rem; }
    .sheet-nav { display:grid; gap:.25rem; }
    .sheet-link { appearance:none; border:0; text-align:left; background:transparent; cursor:pointer;
      padding:.7rem .85rem; border-radius:10px; font-weight:800; color:#334155; }
    .sheet-link:hover { background:#f3faff; color:#0f172a; }
    .sheet-link[aria-selected="true"] { background:#e8fbff; color:#026775; box-shadow:0 0 0 1px #cfeff5 inset; }

    @media (max-width: 960px) { nav[role="tablist"] { display:none; } .hamb { display:inline-flex; } }
  `;

  private go(view: Route, sub?: "login" | "signup") {
    this.open = false;
    this.dispatchEvent(new CustomEvent("navigate", {
      detail: { view, sub },
      bubbles: true,
      composed: true
    }));
  }

  private async signout() {
    // Optimistic UI
    this.authed = false;
    this.email = null;
    this.requestUpdate();

    // Notify parent immediately + route home
    this.dispatchEvent(new CustomEvent("signed-out", { bubbles: true, composed: true }));
    this.go("home");

    try { await authStore.logout(); } catch (e) { console.error("Logout failed:", e); }
  }

  private login()  { this.go("account", "login"); }
  private signup() { this.go("account", "signup"); }

  private onKeyNav(e: KeyboardEvent) {
    const order: Route[] = ["home", "about", "services", "community"];
    const idx = order.indexOf(this.view);
    if (idx === -1) return;
    if (e.key === "ArrowRight") {
      const to = order[(idx + 1) % order.length];
      this.go(to);
      (this.renderRoot.querySelector(`[data-k="${to}"]`) as HTMLElement)?.focus();
    } else if (e.key === "ArrowLeft") {
      const to = order[(idx - 1 + order.length) % order.length];
      this.go(to);
      (this.renderRoot.querySelector(`[data-k="${to}"]`) as HTMLElement)?.focus();
    }
  }

  render() {
    const initials = (this.email?.[0] ?? "U").toUpperCase();

    return html`
      <header>
        <div class="bar">
          <div class="brand" @click=${() => this.go("home")} aria-label="Cluesstack">
            <span class="dot" aria-hidden="true"></span>
            <span>Cluesstack</span>
          </div>

          <nav role="tablist" aria-label="Primary">
            ${(["home","about","services","community"] as Route[]).map(v => html`
              <button
                class="link"
                role="tab"
                data-k=${v}
                aria-selected=${this.view === v}
                @click=${() => this.go(v)}
                @keydown=${(e:KeyboardEvent) => this.onKeyNav(e)}
              >${v[0].toUpperCase() + v.slice(1)}</button>
            `)}
          </nav>

          <div class="right">
            ${this.authed ? html`
              <button class="ghost" title="Profile" @click=${() => this.go("profile")}>
                <span class="avatar" style="margin-right:.4rem">${initials}</span> Profile
              </button>
              <button class="btn" @click=${() => this.signout()}>Logout</button>
            ` : html`
              <button class="ghost" @click=${() => this.signup()}>Sign up</button>
              <button class="btn"   @click=${() => this.login()}>Login</button>
            `}
            <button class="hamb" aria-label="Menu" @click=${() => (this.open = true)}>☰</button>
          </div>
        </div>

        <div class="sheet ${this.open ? "open" : ""}" @click=${(e:MouseEvent) => {
          if ((e.target as HTMLElement).classList.contains("sheet-bg")) this.open = false;
        }}>
          ${this.open ? html`
            <div class="sheet-bg"></div>
            <div class="sheet-panel" role="dialog" aria-label="Navigation menu">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div class="brand"><span class="dot"></span><span>Cluesstack</span></div>
                <button class="hamb" aria-label="Close menu" @click=${() => (this.open = false)}>✕</button>
              </div>

              <div class="sheet-nav" role="tablist" aria-label="Primary (mobile)">
                ${(["home","about","services","community"] as Route[]).map(v => html`
                  <button class="sheet-link"
                          role="tab"
                          aria-selected=${this.view === v}
                          @click=${() => this.go(v)}>${v[0].toUpperCase()+v.slice(1)}</button>
                `)}
              </div>

              <div style="border-top:1px solid #eef2f6; margin:.4rem 0; padding-top:.6rem"></div>

              ${this.authed ? html`
                <div style="display:flex; align-items:center; gap:.6rem">
                  <span class="avatar">${initials}</span>
                  <span style="font-weight:700; color:#0f172a">${this.email ?? "User"}</span>
                </div>
                <button class="btn" style="margin-top:.6rem; width:100%" @click=${() => this.signout()}>Logout</button>
              ` : html`
                <div style="display:grid; gap:.4rem">
                  <button class="btn"   @click=${() => this.login()}>Login</button>
                  <button class="ghost" @click=${() => this.signup()}>Sign up</button>
                </div>
              `}
            </div>
          ` : null}
        </div>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "top-nav": TopNav }
}
