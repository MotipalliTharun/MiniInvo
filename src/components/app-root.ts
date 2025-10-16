import { LitElement, css, html } from "lit";
import { theme } from "../styles/theme.css";
import "./inventory-app";
import "../components/message-bubble";
import "../components/chat-input";
import { chatStore, type ChatMessage } from "../state/chat";

/* NEW: auth components */
import "../components/login-form";
import "../components/signup-form";
import "../components/logout-button";
import "../components/auth-guard";

type View = "inventory" | "assistant" | "account"; /* NEW */

export class AppRoot extends LitElement {
  static properties = {
    view: { state: true },
    messages: { state: true },
  } as const;

  view: View = "inventory";
  messages: ChatMessage[] = chatStore.messages;

  static styles = [
    theme,
    css`
      :host {
        display: block;
        min-height: 100vh;
        color: #222;
        background: #f5f7fb;
        font-family: "Inter", system-ui, sans-serif;
      }
      header {
        position: sticky;
        top: 0;
        z-index: 2;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.4rem;
        margin: 1rem;
        border-radius: 16px;
        background: #ffffff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
        border: 1px solid #e1e5ee;
      }
      .brand {
        font-weight: 700;
        letter-spacing: 0.2px;
        color: #1e293b;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .muted { color: #64748b; font-weight: 500; }
      .tabs { display: flex; gap: 0.5rem; }
      .tab {
        border: 1px solid #d1d5db;
        background: #f8fafc;
        color: #334155;
        padding: 0.45rem 0.8rem;
        border-radius: 999px;
        cursor: pointer; user-select: none;
        transition: all 0.15s ease;
      }
      .tab:hover { background: #e2e8f0; }
      .tab[aria-selected="true"] {
        background: #2563eb; color: white; border-color: #2563eb;
        box-shadow: 0 0 10px rgba(37, 99, 235, 0.2);
      }
      main {
        display: grid; grid-template-rows: 1fr auto;
        height: calc(100vh - 160px); gap: 1rem; margin: 0 1rem 1rem;
      }
      .panel {
        overflow: auto; padding: 1.2rem; border-radius: 16px;
        background: #ffffff; border: 1px solid #e5e7eb;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      }
      .stack { display: flex; flex-direction: column; gap: 0.8rem; }
      footer { position: sticky; bottom: 0; background: transparent; }
      .row { display: flex; gap: 0.6rem; align-items: center; }
      .pill {
        border: 1px solid #e2e8f0; padding: 0.35rem 0.6rem; border-radius: 999px;
        background: #f1f5f9; color: #475569; font-size: 0.85rem;
      }
      .account-grid { display:grid; gap:1rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
      .card { padding:1rem; border:1px solid #e5e7eb; border-radius:12px; background:#fff; }
    `,
  ];

  private setView(v: View) { if (this.view !== v) this.view = v; }

  private addUserText(text: string) {
    chatStore.add("user", text);
    this.messages = [...chatStore.messages];
    const reply = `You said: “${text}”. When you connect your backend, stream actual AI responses here.`;
    setTimeout(() => {
      chatStore.add("assistant", reply);
      this.messages = [...chatStore.messages];
    }, 300);
  }

  private renderTabs() {
    return html`
      <nav class="tabs" role="tablist" aria-label="Primary">
        <div class="tab" role="tab" aria-selected=${this.view === "inventory"} @click=${() => this.setView("inventory")}>📦 Inventory</div>
        <div class="tab" role="tab" aria-selected=${this.view === "assistant"} @click=${() => this.setView("assistant")}>🤖 Assistant</div>
        <div class="tab" role="tab" aria-selected=${this.view === "account"}   @click=${() => this.setView("account")}>👤 Account</div> <!-- NEW -->
      </nav>
    `;
  }

  private renderInventory() {
    return html`
      <section class="panel card">
        <!-- PROTECTED -->
        <auth-guard>
          <inventory-app></inventory-app>
        </auth-guard>
      </section>
      <footer></footer>
    `;
  }

  private renderAssistant() {
    return html`
      <section class="panel card">
        <div class="stack">
          ${this.messages.map(
            (m) =>
              html`<message-bubble role=${m.role} text=${m.text}></message-bubble>`
          )}
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

  /* NEW: Account view with login/signup + logout */
  private renderAccount() {
    return html`
      <section class="panel">
        <div class="account-grid">
          <div class="card">
            <h3>Sign in</h3>
            <login-form></login-form>
          </div>
          <div class="card">
            <h3>Create account</h3>
            <signup-form></signup-form>
          </div>
          <div class="card">
            <h3>Session</h3>
            <p>If you’re logged in, you can logout below.</p>
            <logout-button></logout-button>
          </div>
        </div>
      </section>
    `;
  }

  render() {
    return html`
      <header>
        <div class="row">
          <span class="brand">
            <span>📊 Inventory AI</span>
            <span class="muted">Dashboard</span>
          </span>
          <span class="pill">Alpha</span>
        </div>
        ${this.renderTabs()}
      </header>

      <main>
        ${this.view === "inventory" ? this.renderInventory()
          : this.view === "assistant" ? this.renderAssistant()
          : this.renderAccount()}
      </main>
    `;
  }
}

customElements.define("app-root", AppRoot);
