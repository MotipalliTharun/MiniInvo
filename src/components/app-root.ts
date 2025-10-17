import { LitElement, css, html } from "lit";
import { theme } from "../styles/theme.css";

/* Existing app bits */
import "./inventory-app";
import "../components/message-bubble";
import "../components/chat-input";
import { chatStore, type ChatMessage } from "../state/chat";

/* Auth store */
import { authStore } from "../lib/authStore";

/* Shared UI + pages */
import "../components/top-nav";
import "../components/side-nav";
import "../components/toast-center";
import "../components/user-badge";
import "../components/landing-page";

/* Blog SaaS components */
import "../components/blog-list";
import "../components/post-editor";
import "../components/admin-users";
import "../components/auth-guard";

/* Auth forms + logout */
import "../components/login-form";
import "../components/signup-form";
import "../components/logout-button";

type View =
  | "home"
  | "blog"
  | "contact"
  | "profile"
  | "write"
  | "admin"
  | "assistant"
  | "inventory"
  | "account";

type AccountView = "login" | "signup";

export class AppRoot extends LitElement {
  static properties = {
    view: { state: true },
    messages: { state: true },
    ready: { state: true },
    authed: { state: true },
    role: { state: true },
    email: { state: true },
    accountView: { state: true },
    navOpen: { state: true },
  } as const;

  view: View = (localStorage.getItem("view") as View) || "home";
  messages: ChatMessage[] = chatStore.messages;

  ready = false;
  authed = false;
  role: "pending" | "viewer" | "author" | "editor" | "admin" | null = null;
  email: string | null = null;

  accountView: AccountView = "login";
  navOpen = localStorage.getItem("navOpen") !== "false"; // default open

  static styles = [
    theme,
    css`
      :host {
        display: block; min-height: 100vh;
        color: var(--text, #1e293b); background: var(--bg, #fafbfd);
        font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Apple Color Emoji","Segoe UI Emoji";
      }

      .shell { display: grid; grid-template-columns: 240px 1fr; gap: 1rem; padding: 1rem; }
      .shell.no-nav { grid-template-columns: 1fr; }
      @media (max-width: 980px) { .shell { grid-template-columns: 1fr; } }

      main {
        min-height: calc(100vh - 160px);
        display: grid; grid-template-rows: 1fr auto; gap: 1rem;
      }

      .panel {
        overflow: auto; padding: 1.2rem; border-radius: 16px;
        background: #fff; border: 1px solid #f1f3f5; box-shadow: 0 2px 6px rgba(0,0,0,.04);
      }
      .card { padding: 1rem; border: 1px solid #f1f3f5; border-radius: 12px; background: #fff; }
      .stack { display:flex; flex-direction:column; gap:.8rem; }
      footer { position: sticky; bottom: 0; background: transparent; }

      .account-grid {
        display:grid; gap:1rem; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      }

      .drawer { display: none; }
      @media (max-width: 980px) { .drawer { display: block; } }
      .drawer.hidden { display: none; }
      .drawer-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.2); backdrop-filter: blur(2px); z-index: 30; }
      .drawer-panel {
        position: fixed; z-index: 31; top: 0; bottom: 0; left: 0;
        width: 78vw; max-width: 320px; background: #fff; border-right: 1px solid #f1f3f5; box-shadow: 0 14px 40px rgba(0,0,0,0.12);
        padding: .6rem;
      }
      aside.desktop { position: sticky; top: 1rem; height: calc(100vh - 2rem); }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    this.syncAuth();
    authStore.on(() => this.syncAuth());

    this._keydown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "m" && this.authed) this.toggleNav();
    };
    window.addEventListener("keydown", this._keydown);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydown);
  }
  private _keydown!: (e: KeyboardEvent) => void;

  private toast(text: string, tone: "ok" | "err" | "info" = "info") {
    (this.renderRoot.querySelector("toast-center") as any)?.show?.(text, tone);
  }

  private syncAuth() {
    // pull from authStore
    // @ts-ignore
    this.ready = authStore.ready ?? true;
    // @ts-ignore
    const u = authStore.user ?? null;
    this.authed = !!u;
    this.role = u?.role ?? null;
    this.email = u?.email ?? null;

    if (!this.authed) {
      this.navOpen = false;
      localStorage.setItem("navOpen", "false");
    } else if (localStorage.getItem("navOpen") === null) {
      this.navOpen = true;
    }

    if (this.ready) {
      if (this.authed && this.view === "home") this.setView("blog");
      if (!this.authed && ["write","admin","inventory","assistant","profile"].includes(this.view)) {
        this.setView("home");
      }
    }
    this.requestUpdate();
  }

  private setView(v: View) {
    if (this.view !== v) {
      this.view = v;
      localStorage.setItem("view", v);
      if (window.matchMedia("(max-width: 980px)").matches) this.closeNav();
    }
  }

  private toggleNav() { if (this.authed) { this.navOpen = !this.navOpen; localStorage.setItem("navOpen", String(this.navOpen)); } }
  private closeNav()  { this.navOpen = false; localStorage.setItem("navOpen", "false"); }

  private addUserText(text: string) {
    chatStore.add("user", text);
    this.messages = [...chatStore.messages];
    setTimeout(() => {
      chatStore.add("assistant", `You said: “${text}”. Hook this to your backend to stream real responses.`);
      this.messages = [...chatStore.messages];
    }, 300);
  }

  /* NAV + LOGOUT INTERACTIVITY */
  private onNavigate(e: CustomEvent<{ view: View }>) { this.setView(e.detail.view); }
  private onSignout() { this.handleLoggedOut(); }

  private handleLoggedOut() {
    this.authed = false;
    this.role = null;
    this.email = null;
    this.setView("home");
    this.closeNav();
    this.toast("Signed out successfully", "info");
    this.requestUpdate();
  }

  /* Views */

  private renderHome() {
    return html`
      <section class="panel card">
        <landing-page
          .authed=${this.authed}
          @go-account=${() => { this.accountView = "login"; this.setView("account"); }}
          @go-dashboard=${() => this.setView("blog")}
        ></landing-page>
      </section>
    `;
  }

  private renderBlog() {
    return html`
      <section class="panel card">
        <h3 style="margin:0 0 .5rem 0;">Latest posts</h3>
        <blog-list></blog-list>
      </section>
    `;
  }

  private renderContact() {
    return html`
      <section class="panel card">
        <h3 style="margin-top:0">Contact</h3>
        <p class="muted">We’d love to hear from you. Fill the form and we’ll get back.</p>
        <form style="display:grid; gap:.8rem; max-width:560px">
          <input placeholder="Your name" style="padding:.8rem .9rem; border:1px solid #e5e7eb; border-radius:12px" />
          <input placeholder="Your email" type="email" style="padding:.8rem .9rem; border:1px solid #e5e7eb; border-radius:12px" />
          <textarea rows="5" placeholder="Message" style="padding:.8rem .9rem; border:1px solid #e5e7eb; border-radius:12px"></textarea>
          <button type="button" style="justify-self:start; padding:.75rem 1rem; border:1px solid #00acc1; background:#00bcd4; color:#fff; border-radius:12px; font-weight:900">Send</button>
        </form>
      </section>
    `;
  }

  private renderProfile() {
    return html`
      <auth-guard .allow=${['viewer','author','editor','admin'] as any}>
        <section class="panel card">
          <h3 style="margin:0 0 .5rem 0;">User details</h3>
          <div class="stack">
            <div><strong>Email:</strong> ${this.email ?? "—"}</div>
            <div><strong>Role:</strong> ${this.role ?? "—"}</div>
            <div class="card" style="display:grid; gap:.6rem">
              <p class="muted" style="margin:0">Manage your session</p>
              <logout-button @logged-out=${this.handleLoggedOut}></logout-button>
            </div>
          </div>
        </section>
      </auth-guard>
    `;
  }

  private renderWrite() {
    return html`
      <auth-guard .allow=${['author','editor','admin'] as any}>
        <section class="panel card">
          <h3 style="margin:0 0 .5rem 0;">Write a post</h3>
          <post-editor @saved=${() => this.toast("Saved", "ok")}></post-editor>
        </section>
      </auth-guard>
    `;
  }

  private renderAdmin() {
    return html`
      <auth-guard .allow=${['admin'] as any}>
        <section class="panel card">
          <h3 style="margin:0 0 .5rem 0;">Users & Roles</h3>
          <admin-users @toast=${(e: CustomEvent) => this.toast(e.detail.text, e.detail.tone)}></admin-users>
        </section>
      </auth-guard>
    `;
  }

  private renderAssistant() {
    return html`
      <section class="panel card">
        <div class="stack">
          ${this.messages.map((m) => html`<message-bubble role=${m.role} text=${m.text}></message-bubble>`)}
        </div>
      </section>
      <footer>
        <chat-input
          @send=${(e: CustomEvent) => this.addUserText(e.detail.text)}
          @attach=${(e: CustomEvent) => console.log("files:", e.detail.files)}
          @record-toggle=${(e: CustomEvent) => console.log("recording:", e.detail.recording)}
        ></chat-input>
      </footer>
    `;
  }

  private renderInventory() {
    return html`
      <section class="panel card">
        <h3 style="margin:0 0 .5rem 0;">Sample dashboard</h3>
        <inventory-app></inventory-app>
      </section>
      <footer></footer>
    `;
  }

  private renderAccount() {
    const sessionCard = html`
      <div class="card">
        <h3 style="margin-top:0">Session</h3>
        <p class="muted">${this.authed
          ? html`Signed in as <strong>${this.email ?? "user"}</strong>. You can sign out below.`
          : "Not signed in."}
        </p>
        <logout-button @logged-out=${this.handleLoggedOut}></logout-button>
      </div>
    `;

    return html`
      <section class="panel">
        <div class="account-grid">
          ${this.authed
            ? html`${sessionCard}`
            : this.accountView === "login"
            ? html`
                <div class="card">
                  <h3 style="margin-top:0">Sign in</h3>
                  <p class="muted">Access author/editor/admin tools.</p>
                  <login-form
                    @logged-in=${() => this.setView("blog")}
                    @goto-signup=${() => { this.accountView = "signup"; this.requestUpdate(); }}>
                  </login-form>
                </div>
                ${sessionCard}
              `
            : html`
                <div class="card">
                  <h3 style="margin-top:0">Create account</h3>
                  <p class="muted">New users start as <strong>pending</strong>. An admin will set your role.</p>
                  <signup-form
                    @goto-login=${() => { this.accountView = "login"; this.requestUpdate(); }}>
                  </signup-form>
                </div>
                ${sessionCard}
              `}
        </div>
      </section>
    `;
  }

  render() {
    const showDesktopAside =
      this.authed && this.navOpen && !window.matchMedia("(max-width: 980px)").matches;

    const canWrite = this.authed && ["author", "editor", "admin"].includes(this.role ?? "pending");
    const isAdmin  = this.authed && this.role === "admin";

    return html`
      <top-nav
        .authed=${this.authed}
        .role=${this.role}
        .view=${this.view}
        .email=${this.email}
        @navigate=${(e: CustomEvent) => this.onNavigate(e as any)}
        @signout=${this.onSignout}
      ></top-nav>

      ${this.authed
        ? html`
            <div class="drawer ${this.navOpen ? "" : "hidden"}">
              <div class="drawer-backdrop" @click=${this.closeNav}></div>
              <div class="drawer-panel" role="dialog" aria-label="Navigation">
                <side-nav
                  .view=${this.view}
                  .canWrite=${canWrite}
                  .isAdmin=${isAdmin}
                  @go=${(e: CustomEvent) => this.setView((e.detail.view as View) ?? "home")}
                ></side-nav>
              </div>
            </div>
          `
        : null}

      <div class="shell ${showDesktopAside ? "" : "no-nav"}" @go=${(e: CustomEvent) => this.setView(e.detail.view as View)}>
        ${showDesktopAside
          ? html`
              <aside class="desktop">
                <side-nav
                  .view=${this.view}
                  .canWrite=${canWrite}
                  .isAdmin=${isAdmin}
                ></side-nav>
              </aside>
            `
          : null}

        <main>
          ${this.view === "home"      ? this.renderHome()
          : this.view === "blog"      ? this.renderBlog()
          : this.view === "contact"   ? this.renderContact()
          : this.view === "profile"   ? this.renderProfile()
          : this.view === "write"     ? this.renderWrite()
          : this.view === "admin"     ? this.renderAdmin()
          : this.view === "assistant" ? this.renderAssistant()
          : this.view === "inventory" ? (this.authed ? this.renderInventory() : this.renderHome())
          : this.renderAccount()}a
        </main>
      </div>

      <toast-center></toast-center>
    `;
  }
}
customElements.define("app-root", AppRoot);
