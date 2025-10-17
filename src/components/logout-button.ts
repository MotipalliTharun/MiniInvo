// src/components/logout-button.ts
import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { supabase } from "../lib/supabaseClient";

@customElement("logout-button")
export class LogoutButton extends LitElement {
  static styles = css`
    button {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      background: var(--primary, #00bcd4);
      color: #fff;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
      width: 100%;
    }

    button:hover {
      background: var(--accent, #00acc1);
      box-shadow: 0 0 12px rgba(0, 188, 212, 0.4);
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;

  @state() loading = false;

  private async handleLogout() {
    this.loading = true;
    const { error } = await supabase.auth.signOut();
    this.loading = false;

    if (error) {
      console.error("Logout failed:", error.message);
      alert("Logout failed: " + error.message);
      return;
    }

    // Emit event for parent components (app-root) to react
    this.dispatchEvent(new CustomEvent("logged-out", { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <button @click=${this.handleLogout} ?disabled=${this.loading}>
        ${this.loading ? "Signing out..." : "Sign out"}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "logout-button": LogoutButton;
  }
}
