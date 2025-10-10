
# 5) Index HTML
cat > index.html <<'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, viewport-fit=cover"
    />
    <title>Lit Chat</title>
    <link rel="icon" href="/favicon.svg" />
    <meta name="theme-color" content="#0b1020" />
  </head>
  <body>
    <app-root></app-root>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
EOF

# 6) Public assets
cat > public/favicon.svg <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
  <defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#7cf" /><stop offset="1" stop-color="#90f"/></linearGradient></defs>
  <rect rx="28" width="128" height="128" fill="#0b1020"/>
  <g transform="translate(20,22)">
    <rect width="88" height="60" rx="12" fill="url(#g)"/>
    <rect x="10" y="70" width="68" height="12" rx="6" fill="#203055"/>
    <circle cx="74" cy="76" r="6" fill="#54f2"/>
  </g>
</svg>
EOF

# 7) Global styles
cat > src/styles/theme.css.ts <<'EOF'
export const theme = `
  :host, :root {
    --bg: #0b1020;
    --panel: #121832;
    --panel-2: #11192e;
    --text: #e6e9f5;
    --muted: #9aa4bf;
    --primary: #7cc6ff;
    --accent: #90a0ff;
    --danger: #ff6b6b;

    --radius: 16px;
    --shadow: 0 10px 30px rgba(0,0,0,.35);
    --border: 1px solid rgba(255,255,255,.06);
  }

  * { box-sizing: border-box; }

  html, body {
    height: 100%;
    margin: 0;
    background: radial-gradient(1200px 800px at 80% -20%, #1a2350 0%, transparent 60%) var(--bg);
    color: var(--text);
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  }

  .card {
    background: linear-gradient(180deg, #141b36 0%, #0f1530 100%);
    border: var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }

  .glow {
    box-shadow: 0 0 40px #7cc6ff33, inset 0 0 0 1px #7cc6ff22;
  }

  .row { display:flex; gap:.75rem; align-items:center; }
  .col { display:flex; flex-direction:column; gap:.75rem; }
`;
EOF

# 8) Simple in-memory state for messages
cat > src/state/chat.ts <<'EOF'
export type ChatRole = "user" | "assistant" | "system";
export interface ChatMessage { id: string; role: ChatRole; text: string; time: number; }

export class ChatStore {
  #messages: ChatMessage[] = [
    { id: crypto.randomUUID(), role: "assistant", text: "Hi! I’m your AI health companion. How can I help today?", time: Date.now() }
  ];
  get messages() { return this.#messages; }

  add(role: ChatRole, text: string) {
    const m: ChatMessage = { id: crypto.randomUUID(), role, text: text.trim(), time: Date.now() };
    if (m.text.length) this.#messages = [...this.#messages, m];
    return m;
  }
}
export const chatStore = new ChatStore();
EOF

# 9) Message bubble component
cat > src/components/message-bubble.ts <<'EOF'
import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("message-bubble")
export class MessageBubble extends LitElement {
  @property({type: String}) role: "user" | "assistant" = "assistant";
  @property({type: String}) text = "";

  static styles = css`
    :host { display:block; }
    .bubble {
      max-width: 72ch;
      padding: .75rem .9rem;
      border-radius: 14px;
      line-height: 1.45;
      border: 1px solid rgba(255,255,255,.06);
      backdrop-filter: blur(6px);
      word-wrap: break-word;
      white-space: pre-wrap;
    }
    .assistant {
      background: linear-gradient(180deg, #141b36 0%, #0f1530 100%);
      box-shadow: 0 6px 22px rgba(16,22,48,.35);
    }
    .user {
      background: linear-gradient(180deg, #153b2a 0%, #0f2e23 100%);
      border-color: rgba(127,255,212,.15);
      box-shadow: 0 6px 22px rgba(0,0,0,.35);
    }
    .meta {
      font-size: .75rem;
      color: #9aa4bf;
      margin: .25rem 0 0 .35rem;
    }
  `;

  render() {
    return html`
      <div class="bubble ${this.role==='user' ? 'user' : 'assistant'}">${this.text || nothing}</div>
    `;
  }
}
declare global { interface HTMLElementTagNameMap { "message-bubble": MessageBubble; } }
EOF

# 10) Chat input (text, mic, image)
cat > src/components/chat-input.ts <<'EOF'
import { LitElement, css, html } from "lit";
import { customElement, query } from "lit/decorators.js";

@customElement("chat-input")
export class ChatInput extends LitElement {
  static styles = css`
    .wrap {
      display: grid;
      grid-template-columns: 1fr auto auto auto;
      gap: .5rem;
      padding: .75rem;
      border-radius: 16px;
      background: #0f1530;
      border: 1px solid rgba(255,255,255,.06);
      box-shadow: 0 10px 30px rgba(0,0,0,.35);
      align-items: center;
    }
    textarea {
      resize: vertical;
      min-height: 44px;
      max-height: 180px;
      width: 100%;
      border: none;
      outline: none;
      color: #e6e9f5;
      background: transparent;
      font: inherit;
      line-height: 1.35;
      padding: .5rem .6rem;
    }
    button, label[role="button"] {
      border: 1px solid rgba(255,255,255,.08);
      background: linear-gradient(180deg, #1a2550 0%, #141c3f 100%);
      border-radius: 12px;
      padding: .55rem .7rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: .4rem;
      user-select: none;
    }
    button:hover, label[role="button"]:hover { filter: brightness(1.08); }
    input[type="file"] { display:none; }
    .hint { color:#9aa4bf; font-size:.8rem; margin-top:.4rem; }
  `;

  @query("textarea") private _ta!: HTMLTextAreaElement;
  private _recording = false;

  private toggleRecord() {
    this._recording = !this._recording;
    this.dispatchEvent(new CustomEvent("record-toggle", { detail: { recording: this._recording }}));
    this.requestUpdate();
  }

  private submit() {
    const value = (this._ta?.value ?? "").trim();
    if (!value) return;
    this.dispatchEvent(new CustomEvent("send", { detail: { text: value }}));
    this._ta.value = "";
  }

  private onKey(e: KeyboardEvent) {
    if ((e.key === "Enter" && !e.shiftKey)) {
      e.preventDefault();
      this.submit();
    }
  }

  render() {
    return html`
      <div class="wrap">
        <textarea placeholder="Ask anything about your health… (Shift+Enter = newline)" @keydown=${this.onKey}></textarea>

        <label role="button" title="Attach image">
          <input type="file" accept="image/*" @change=${(e: Event) => this.dispatchEvent(new CustomEvent("attach", { detail: { files: (e.target as HTMLInputElement).files }}))} />
          📷
        </label>

        <button title=${this._recording ? "Stop recording" : "Record voice"} @click=${this.toggleRecord}>
          ${this._recording ? "⏹" : "🎙"}
        </button>

        <button title="Send message" @click=${this.submit}>➤</button>
      </div>
      <div class="hint">We’ll add real AI + audio handling in the backend step—UI is wired and evented.</div>
    `;
  }
}
declare global { interface HTMLElementTagNameMap { "chat-input": ChatInput; } }
EOF

# 11) App shell
cat > src/components/app-root.ts <<'EOF'
import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { theme } from "../styles/theme.css";
import "../components/message-bubble";
import "../components/chat-input";
import { chatStore, type ChatMessage } from "../state/chat";

@customElement("app-root")
export class AppRoot extends LitElement {
  static styles = [
    css`${theme}`,
    css`
      :host { display:block; min-height:100dvh; }
      header {
        position: sticky; top: 0; z-index: 2;
        display:flex; justify-content:space-between; align-items:center;
        padding: .9rem 1.1rem; margin: .9rem;
        border-radius: 16px; border: var(--border);
        background: linear-gradient(180deg, rgba(26,34,80,.6), rgba(15,21,48,.6));
        backdrop-filter: blur(10px);
      }
      .brand { font-weight: 700; letter-spacing: .2px; }
      .pill {
        border: var(--border); padding:.4rem .6rem; border-radius:999px; color:var(--muted);
      }
      main {
        display:grid; grid-template-rows: 1fr auto;
        height: calc(100dvh - 140px);
        gap: 1rem; margin: 0 1rem 1rem;
      }
      .scroll {
        overflow: auto; padding: 1rem; border-radius: 16px;
        border: var(--border); background: linear-gradient(180deg, #0f1530, #0b1128);
      }
      .stack { display:flex; flex-direction:column; gap: .9rem; }
      footer { position: sticky; bottom: 0; background: transparent; }
      .row { display:flex; gap:.5rem; align-items:center; }
      .spacer { flex:1; }
    `
  ];

  @state() private messages: ChatMessage[] = chatStore.messages;

  private addUserText(text: string) {
    chatStore.add("user", text);
    this.messages = [...chatStore.messages];
    // Simulated AI echo (replace with real backend call)
    const reply = `You said: “${text}”. When you connect your backend, stream actual AI responses here.`;
    setTimeout(() => {
      chatStore.add("assistant", reply);
      this.messages = [...chatStore.messages];
    }, 200);
  }

  render() {
    return html`
      <header class="card glow">
        <div class="row">
          <span class="brand">💬 Lit Chat</span>
          <span class="pill">Alpha</span>
        </div>
        <div class="row">
          <span class="pill">Latency: ~200ms (mock)</span>
        </div>
      </header>

      <main>
        <section class="scroll card">
          <div class="stack">
            ${this.messages.map(m => html`<message-bubble role=${m.role} text=${m.text}></message-bubble>`)}
          </div>
        </section>

        <footer>
          <chat-input
            @send=${(e: CustomEvent) => this.addUserText(e.detail.text)}
            @attach=${(e: CustomEvent) => console.log("files:", e.detail.files)}
            @record-toggle=${(e: CustomEvent) => console.log("recording:", e.detail.recording)}
          ></chat-input>
        </footer>
      </main>
    `;
  }
}
declare global { interface HTMLElementTagNameMap { "app-root": AppRoot; } }
EOF

# 12) Entry point
cat > src/main.ts <<'EOF'
import "./components/app-root";
EOF

# 13) tsconfig – keep defaults, add lib for DOM
jq '.compilerOptions = (.compilerOptions + {lib: ["ES2020","DOM","DOM.Iterable"]})' tsconfig.json > tsconfig.tmp.json 2>/dev/null || cp tsconfig.json tsconfig.tmp.json
mv tsconfig.tmp.json tsconfig.json

# 14) NPM scripts & metadata
npm pkg set scripts.dev="vite" scripts.build="vite build" scripts.preview="vite preview" > /dev/null

# 15) Helpful README
cat > README.md <<'EOF'
# Lit Chat (Vite + TypeScript)

A clean, enterprise-ready Lit front end with a chat UI scaffold.

## Quick start
```bash
npm install
npm run dev
# open http://localhost:5173
