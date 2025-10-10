import { LitElement, css, html, nothing } from "lit";

// No @customElement decorator—define manually at the bottom.
export class MessageBubble extends LitElement {
  static properties = {
    role: { type: String, reflect: true }, // "user" | "assistant"
    text: { type: String },
  } as const;

  role: "user" | "assistant" = "assistant";
  text = "";

  static styles = css`
    :host {
      display: block;
      font-family: Inter, system-ui, sans-serif;
    }

    .bubble {
      max-width: 72ch;
      padding: 0.75rem 0.95rem;
      border-radius: 14px;
      line-height: 1.45;
      word-wrap: break-word;
      white-space: pre-wrap;
      border: 1px solid #e5e7eb;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      font-size: 0.95rem;
    }

    /* Assistant bubble: soft blue background */
    .assistant {
      background: #f1f5ff;
      border-color: #c7d2fe;
      color: #1e3a8a; /* blue-900 */
    }

    /* User bubble: light gray background */
    .user {
      background: #f8fafc;
      border-color: #e2e8f0;
      color: #0f172a; /* slate-900 */
      align-self: flex-end;
    }

    .meta {
      font-size: 0.75rem;
      color: #64748b;
      margin: 0.25rem 0 0 0.35rem;
    }

    .wrapper {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 0.5rem;
    }
    :host([role="user"]) .wrapper {
      justify-content: flex-end;
    }
  `;

  render() {
    return html`
      <div class="wrapper">
        <div class="bubble ${this.role === "user" ? "user" : "assistant"}">
          ${this.text || nothing}
        </div>
      </div>
    `;
  }
}

customElements.define("message-bubble", MessageBubble);
