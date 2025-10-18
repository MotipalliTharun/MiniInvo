import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

type Channel = { id: string; slug: string; name: string };

@customElement("community-sidebar")
export class CommunitySidebar extends LitElement {
  static styles = css`
    :host { display:block }
    .item {
      display:flex; align-items:center; gap:.5rem;
      padding:.55rem .8rem; cursor:pointer; border-bottom:1px solid #f8fafc;
    }
    .item:hover { background:#f3faff; }
    .item[selected] { background:#e8fbff; color:#026775; box-shadow: inset 0 0 0 1px #cfeff5; }
    .hash { color:#00bcd4; font-weight:900 }
  `;

  @property({type:Array}) channels: Channel[] = [];
  @property({type:String}) currentId: string | null = null;

  private select(id: string) {
    this.dispatchEvent(new CustomEvent("select-channel", { detail: { id }, bubbles: true, composed: true }));
  }

  render() {
    return html`
      ${this.channels.map(c => html`
        <div class="item" ?selected=${c.id===this.currentId} @click=${() => this.select(c.id)}>
          <span class="hash">#</span> <span>${c.name}</span>
        </div>
      `)}
    `;
  }
}
declare global { interface HTMLElementTagNameMap { "community-sidebar": CommunitySidebar } }
