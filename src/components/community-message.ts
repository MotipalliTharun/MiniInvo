import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("community-message")
export class CommunityMessage extends LitElement {
  static styles = css`
    :host { display:block }
    .row { display:flex; gap:.6rem; align-items:flex-start }
    .me .bubble { background:#e8fbff; border-color:#cfeff5 }
    .bubble {
      border:1px solid #eef2f6; background:#fff; border-radius:12px; padding:.55rem .7rem;
      max-width: 70%;
    }
    .meta { font-size:.78rem; color:#94a3b8; }
    .avatar {
      width:28px; height:28px; border-radius:999px; background:#f1f5f9; border:1px solid #e5e7eb;
      display:inline-flex; align-items:center; justify-content:center; font-weight:900; color:#0f172a;
    }
  `;
  @property({type:Object}) msg!: { body: string; created_at: string; user_id: string };
  @property({type:Boolean}) self = false;

  render() {
    const initials = (this.msg.user_id || "U").slice(0,2).toUpperCase();
    const when = new Date(this.msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return html`
      <div class="row ${this.self ? "me" : ""}">
        <span class="avatar" title=${this.msg.user_id}>${initials}</span>
        <div class="bubble">
          <div>${this.msg.body}</div>
          <div class="meta">${when}</div>
        </div>
      </div>
    `;
  }
}
declare global { interface HTMLElementTagNameMap { "community-message": CommunityMessage } }
