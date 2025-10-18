import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("community-input")
export class CommunityInput extends LitElement {
  static styles = css`
    :host { display:block; border-top:1px solid #eef2f6; }
    .wrap { padding:.6rem; display:grid; gap:.5rem; }
    .row { display:flex; gap:.5rem; align-items:center; }
    .input {
      flex:1; border:1px solid #e5e7eb; background:#fff; border-radius:12px;
      display:flex; align-items:center; padding:.2rem .3rem;
    }
    textarea {
      width:100%; border:0; outline:none; resize:none; min-height:42px; max-height:160px;
      padding:.6rem .7rem; font: inherit; color:#0f172a;
    }
    .btn {
      appearance:none; border:1px solid #00acc1; background:#00bcd4; color:#fff;
      padding:.6rem .9rem; border-radius:10px; font-weight:900; cursor:pointer;
    }
    .chip { border:1px solid #e5f6fa; background:#f7fdff; color:#026775; padding:.35rem .55rem; border-radius:999px; cursor:pointer; }
    .chip:hover { background:#e8fbff }
  `;

  @property({type:Boolean}) disabled = false;
  @property({type:String}) placeholder = "Message…";
  @state() text = "";

  private emit() {
    const t = this.text.trim();
    if (!t) return;
    this.dispatchEvent(new CustomEvent("send", { detail: { text: t }, bubbles: true, composed: true }));
    this.text = "";
  }

  private addClue(kind: string) {
    const map: Record<string,string> = {
      summarize: "[Clue] Suggest a daily digest structure for my workflow.",
      debug:     "[Clue] Help debug a failing Slack step.",
      improve:   "[Clue] Propose improvements to my Sheets append.",
    };
    this.text = (this.text + " " + (map[kind] || "")).trim();
    this.requestUpdate();
  }

  private addStack(kind: string) {
    const map: Record<string,string> = {
      email: "[Stack] +Email digest",
      slack: "[Stack] +Slack post",
      sheet: "[Stack] +Sheets append",
    };
    this.text = (this.text + " " + (map[kind] || "")).trim();
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="wrap">
        <div class="row" aria-label="Signature Moves">
          <span class="chip" @click=${() => this.addClue("summarize")}>Clue: summarize</span>
          <span class="chip" @click=${() => this.addClue("debug")}>Clue: debug</span>
          <span class="chip" @click=${() => this.addClue("improve")}>Clue: improve</span>
          <span class="chip" @click=${() => this.addStack("email")}>Stack: Email</span>
          <span class="chip" @click=${() => this.addStack("slack")}>Stack: Slack</span>
          <span class="chip" @click=${() => this.addStack("sheet")}>Stack: Sheets</span>
        </div>
        <div class="row">
          <div class="input">
            <textarea
              .value=${this.text}
              placeholder=${this.placeholder}
              ?disabled=${this.disabled}
              @input=${(e:any)=>this.text=e.target.value}
              @keydown=${(e:KeyboardEvent) => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); this.emit(); } }}
            ></textarea>
          </div>
          <button class="btn" ?disabled=${this.disabled} @click=${this.emit}>Send</button>
        </div>
      </div>
    `;
  }
}
declare global { interface HTMLElementTagNameMap { "community-input": CommunityInput } }
