import { LitElement, css, html } from "lit";
import { createRef, ref } from "lit/directives/ref.js";

// No decorators—define the element at the bottom.
export class ChatInput extends LitElement {
  static styles = css`
    :host {
      display:block;
      color:#1f2937; /* slate-800 */
      font-family: Inter, system-ui, sans-serif;
    }

    .wrap {
      display: grid;
      grid-template-columns: 1fr auto auto auto;
      gap: .5rem;
      padding: .75rem;
      border-radius: 16px;
      background: #ffffff;
      border: 1px solid #e5e7eb;       /* gray-200 */
      box-shadow: 0 2px 10px rgba(0,0,0,.05);
      align-items: center;
    }

    textarea {
      resize: vertical;
      min-height: 44px;
      max-height: 180px;
      width: 100%;
      border: 1px solid #cbd5e1;       /* slate-300 */
      outline: none;
      color: #0f172a;                  /* slate-900 */
      background: #f8fafc;             /* slate-50 */
      font: inherit;
      line-height: 1.45;
      padding: .55rem .65rem;
      border-radius: 12px;
      transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;
    }
    textarea::placeholder { color:#94a3b8; } /* slate-400 */
    textarea:focus {
      border-color:#2563eb;            /* blue-600 */
      box-shadow: 0 0 0 3px rgba(37,99,235,.15);
      background:#ffffff;
    }

    button, label[role="button"] {
      border: 1px solid #cbd5e1;       /* slate-300 */
      background: #f8fafc;
      color: #334155;                   /* slate-700 */
      border-radius: 12px;
      padding: .55rem .7rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: .4rem;
      user-select: none;
      transition: background 120ms ease, border-color 120ms ease, transform 40ms ease;
    }
    button:hover, label[role="button"]:hover {
      background:#e2e8f0;               /* slate-200 */
    }
    button:active, label[role="button"]:active { transform: translateY(1px); }

    /* Primary send button */
    .send {
      border-color:#2563eb;
      background:#2563eb;
      color:#fff;
    }
    .send:hover { filter: brightness(1.05); }

    input[type="file"] { display:none; }

    .hint {
      color:#64748b;                   /* slate-500 */
      font-size:.85rem;
      margin-top:.5rem;
    }
  `;

  // Ref to the textarea (replaces @query)
  private _taRef = createRef<HTMLTextAreaElement>();
  private _recording = false;

  private toggleRecord() {
    this._recording = !this._recording;
    this.dispatchEvent(new CustomEvent("record-toggle", { detail: { recording: this._recording }}));
    this.requestUpdate();
  }

  private submit() {
    const ta = this._taRef.value;
    const value = (ta?.value ?? "").trim();
    if (!value) return;
    this.dispatchEvent(new CustomEvent("send", { detail: { text: value }}));
    if (ta) ta.value = "";
    ta?.focus();
  }

  private onKey(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.submit();
    }
  }

  render() {
    return html`
      <div class="wrap" role="form" aria-label="Chat input">
        <textarea
          ${ref(this._taRef)}
          placeholder="Type a message… (Shift+Enter = newline)"
          @keydown=${this.onKey}
          aria-label="Message"
        ></textarea>

        <label role="button" title="Attach image" aria-label="Attach image">
          <input
            type="file"
            accept="image/*"
            @change=${(e: Event) =>
              this.dispatchEvent(
                new CustomEvent("attach", {
                  detail: { files: (e.target as HTMLInputElement).files },
                  bubbles: true,
                  composed: true,
                })
              )
            }
          />
          📎
        </label>

        <button
          title=${this._recording ? "Stop recording" : "Record voice"}
          aria-pressed=${String(this._recording)}
          @click=${this.toggleRecord}
        >
          ${this._recording ? "⏹" : "🎙"}
        </button>

        <button class="send" title="Send message" aria-label="Send message" @click=${this.submit}>➤</button>
      </div>
      <div class="hint">Voice and image events are emitted; wire them to your backend when ready.</div>
    `;
  }
}

customElements.define("chat-input", ChatInput);
