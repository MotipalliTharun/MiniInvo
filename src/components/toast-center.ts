import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

type Toast = { id:number; text:string; tone:'ok'|'err'|'info'; };

@customElement('toast-center')
export class ToastCenter extends LitElement {
  static styles = css`
    :host { position: fixed; inset: auto 0 1rem 0; display:grid; place-items:center; pointer-events:none }
    .toast { pointer-events:auto; margin:.4rem; padding:.7rem 1rem; border-radius: var(--r-md);
      border:1px solid var(--border); background: var(--panel); box-shadow: var(--elev-2); }
    .ok{ border-color:#a7f3d0; background:#ecfdf5; }
    .err{ border-color:#fecaca; background:#fef2f2; }
  `;
  @state() items: Toast[] = [];
  show(text:string, tone:Toast['tone']='info', ms=2500) {
    const id = Date.now();
    this.items = [...this.items, { id, text, tone }];
    setTimeout(() => this.items = this.items.filter(t => t.id !== id), ms);
  }
  render(){ return html`${this.items.map(t=>html`<div class="toast ${t.tone}">${t.text}</div>`)}`; }
}
declare global { interface HTMLElementTagNameMap { 'toast-center': ToastCenter } }
