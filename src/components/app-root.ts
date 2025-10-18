// src/components/app-root.ts
import { LitElement, css, html } from "lit";
import { theme } from "../styles/theme.css";
import { chatStore, type ChatMessage } from "../state/chat";

import { authStore } from "../lib/authStore";
import type { Role } from "../lib/authStore";

/* Nav + layout */
import "../components/top-nav";
import "../components/toast-center";
import "../components/site-footer";

/* Landing & pages */
import "../components/landing-cluesstack-pro";
import "../components/about-page";
import "../components/contact-form";
import "../components/blog-list";

/* Community */
import "../components/community-hub";

/* Workflows (uncommented because you use them) */
// import "../components/workflow-list";
// import "../components/workflow-builder";

/* Auth */
import "../components/login-form";
import "../components/signup-form";
import "../components/logout-button";

type View =
  | "home"
  | "community"
  | "templates"
  | "about"
  | "services"
  | "contact"
  | "account"
  | "workflows"
  | "workflow-new"
  | "workflow-edit"
  | "profile"
  | "assistant";

type AccountView = "login" | "signup";

export class AppRoot extends LitElement {
  static properties = {
    view: { state: true },
    authed: { state: true },
    ready: { state: true },
    role: { state: true },
    email: { state: true },
    messages: { state: true },
    accountView: { state: true },
    editingWorkflowId: { state: true },
  } as const;

  // Routing / state
  view: View = (localStorage.getItem("view") as View) || "home";
  authed = false;
  ready = false;
  role: Role | null = null;
  email: string | null = null;

  accountView: AccountView = "login";
  editingWorkflowId: string | null = null;

  messages: ChatMessage[] = chatStore.messages;

  private _offAuth?: () => void;

  static styles = [
    theme,
    css`
      :host {
        display: block;
        min-height: 100vh;
        color: #0f172a;
        background: #f6f8fb;
        font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial,
          "Apple Color Emoji", "Segoe UI Emoji";
      }
      .shell {
        padding: 1rem;
        max-width: 1120px;
        margin: 0 auto;
      }
      .panel {
        overflow: auto;
        padding: 1.2rem;
        border-radius: 16px;
        background: #fff;
        border: 1px solid #f1f3f5;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      }
      .grid {
        display: grid;
        gap: 1rem;
      }
      .account-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      }
      .card {
        padding: 1rem;
        border: 1px solid #eef2f6;
        border-radius: 12px;
        background: #fff;
      }
      .muted {
        color: #64748b;
      }
      .btn {
        appearance: none;
        border: 1px solid #00acc1;
        background: #00bcd4;
        color: #fff;
        padding: 0.8rem 1rem;
        border-radius: 12px;
        font-weight: 900;
        cursor: pointer;
      }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    this.syncAuth();
    // subscribe; keep an unsubscribe to avoid leaks on HMR / disconnect
    this._offAuth = authStore.on(() => this.syncAuth());
  }

  disconnectedCallback(): void {
    this._offAuth?.();
    super.disconnectedCallback();
  }

  private syncAuth() {
    this.ready = (authStore as any).ready ?? true;
    const u = (authStore as any).user ?? null;

    this.authed = !!u;
    this.role = (u?.role as Role) ?? "pending";
    this.email = u?.email ?? null;

    // Gate private routes
    if (
      !this.authed &&
      ["workflows", "workflow-new", "workflow-edit", "profile"].includes(
        this.view
      )
    ) {
      this.setView("account");
      this.accountView = "login";
    }
    this.requestUpdate();
  }

  private setView(v: View) {
    if (this.view !== v) {
      this.view = v;
      localStorage.setItem("view", v);
      this.requestUpdate();
    }
  }

  /* ---------- Views ---------- */

  private renderHome() {
    return html`
      <div class="panel">
        <landing-cluesstack-pro
          .authed=${this.authed}
          @go=${(e: CustomEvent) => this.setView(e.detail.view as View)}
        ></landing-cluesstack-pro>
    </div>`;
  }

  private renderCommunity() {
    return html`
      <div class="panel">
        <community-hub .user=${(authStore as any).user}></community-hub>
      </div>
    `;
  }

  private renderTemplates() {
    return html`
      <div class="panel grid">
        <h3 style="margin:0">Templates</h3>
        <div class="card">Gmail → Slack incident alert</div>
        <div class="card">Typeform → Google Sheets append</div>
        <div class="card">CRON → Email weekly digest</div>
        <button
          class="btn"
          @click=${() => this.setView(this.authed ? "workflow-new" : "account")}
        >
          Use a template
        </button>
      </div>
    `;
  }

  private renderAbout() {
    return html`
      <div class="panel">
        <about-page
          brand="Cluesstack"
          mission="Make automation accessible and legible with Clues & Stack — guided hints and stackable actions that help teams get repeatable results fast."
        ></about-page>
      </div>
    `;
  }

  private renderServices() {
    return html`
      <div class="panel grid">
        <h3 style="margin:0">Services</h3>
        <div class="card">
          <strong>Starter</strong>
          <div class="muted">Individuals. 2 workflows, 100 runs/mo.</div>
        </div>
        <div class="card">
          <strong>Team</strong>
          <div class="muted">10 workflows, role-based access.</div>
        </div>
        <div class="card">
          <strong>Enterprise</strong>
          <div class="muted">SSO/SAML, SCIM, audit logs, priority SLA.</div>
        </div>
        <button class="btn" @click=${() => this.setView("contact")}>
          Contact sales
        </button>
      </div>
    `;
  }

  private renderContact() {
    return html`
      <div class="panel grid">
        <h3 style="margin:0">Contact</h3>
        <p class="muted">We’d love to hear from you.</p>
        <contact-form email="hello@cluesstack.com"></contact-form>
      </div>
    `;
  }

  private renderAccount() {
    return html`
      <div class="panel account-grid">
        ${this.accountView === "login"
          ? html`
              <div class="card">
                <h3 style="margin:0 0 .4rem 0">Sign in</h3>
                <p class="muted">Access Workflows and the Community.</p>
                <login-form
                  @logged-in=${() => this.setView("workflows")}
                  @goto-signup=${() => {
                    this.accountView = "signup";
                    this.requestUpdate();
                  }}
                ></login-form>
              </div>
            `
          : html`
              <div class="card">
                <h3 style="margin:0 0 .4rem 0">Create account</h3>
                <p class="muted">Start free. No credit card required.</p>
                <signup-form
                  @goto-login=${() => {
                    this.accountView = "login";
                    this.requestUpdate();
                  }}
                ></signup-form>
              </div>
            `}
        <div class="card">
          <h3 style="margin:0 0 .4rem 0">Why create an account?</h3>
          <ul class="muted">
            <li>Build and run workflows</li>
            <li>Fork and publish templates</li>
            <li>Vote & discuss in community</li>
          </ul>
        </div>
      </div>
    `;
  }

  private renderWorkflows() {
    return html`
      <div class="panel grid">
        <h3 style="margin:0">My Workflows</h3>
        <workflow-list
          @go=${(e: CustomEvent) => this.setView(e.detail.view as View)}
          @open-workflow=${(e: CustomEvent) => {
            this.editingWorkflowId = e.detail.id;
            this.setView("workflow-edit");
          }}
        ></workflow-list>
        <button class="btn" @click=${() => this.setView("workflow-new")}>
          New workflow
        </button>
      </div>
    `;
  }

  private renderWorkflowNew() {
    return html`
      <div class="panel grid">
        <h3 style="margin:0">Create a Workflow</h3>
        <workflow-builder
          @saved=${() =>
            (this as any).renderRoot
              ?.querySelector("toast-center")
              ?.show?.("Saved", "ok")}
        ></workflow-builder>
      </div>
    `;
  }

  private renderWorkflowEdit() {
    return html`
      <div class="panel grid">
        <h3 style="margin:0">Edit Workflow</h3>
        <workflow-builder
          .workflowId=${this.editingWorkflowId}
          @saved=${() =>
            (this as any).renderRoot
              ?.querySelector("toast-center")
              ?.show?.("Saved", "ok")}
        ></workflow-builder>
      </div>
    `;
  }

  private renderProfile() {
    return html`
      <div class="panel grid">
        <h3 style="margin:0">User</h3>
        <div class="card"><strong>Email:</strong> ${this.email ?? "—"}</div>
        <div class="card"><strong>Role:</strong> ${this.role ?? "—"}</div>
        <div class="card">
          <logout-button
            @logged-out=${() => this.setView("home")}
          ></logout-button>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <top-nav
        .authed=${this.authed}
        .role=${this.role}
        .email=${this.email}
        .view=${this.view}
        @navigate=${(e: CustomEvent) => this.setView(e.detail.view as View)}
        @signout=${() => this.setView("home")}
      ></top-nav>

      <div
        class="shell"
        @go=${(e: CustomEvent) => this.setView(e.detail.view as View)}
      >
        ${this.view === "home"
          ? this.renderHome()
          : this.view === "community"
          ? this.renderCommunity()
          : this.view === "templates"
          ? this.renderTemplates()
          : this.view === "about"
          ? this.renderAbout()
          : this.view === "services"
          ? this.renderServices()
          : this.view === "contact"
          ? this.renderContact()
          : this.view === "account"
          ? this.renderAccount()
          : this.view === "workflows"
          ? this.authed
            ? this.renderWorkflows()
            : this.renderAccount()
          : this.view === "workflow-new"
          ? this.authed
            ? this.renderWorkflowNew()
            : this.renderAccount()
          : this.view === "workflow-edit"
          ? this.authed
            ? this.renderWorkflowEdit()
            : this.renderAccount()
          : this.view === "profile"
          ? this.authed
            ? this.renderProfile()
            : this.renderAccount()
          : this.renderHome()}
      </div>

      <toast-center></toast-center>
      <site-footer></site-footer>
    `;
  }
}

customElements.define("app-root", AppRoot);
