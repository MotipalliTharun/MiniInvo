import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ui-input')
export class UIInput extends LitElement {
  static styles = css`
    label { font-size:.9rem; font-weight:600; color: var(--text); display:block; margin-bottom:.4rem }
    .wrap { position:relative }
    input {
      width:100%; padding:.7rem .9rem; border-radius: var(--r-md);
      border:1px solid var(--border); background: var(--panel); color: var(--text);
    }
    .hint { font-size:.85rem; color: var(--muted); margin-top:.35rem }
    .right { position:absolute; right:.5rem; top:50%; transform: translateY(-50%); color: var(--muted) }
  `;
  @property({ type: String }) label = '';
  @property({ type: String }) type: string = 'text';
  @property({ type: String }) name = '';
  @property({ type: String }) placeholder = '';
  @property({ type: String }) hint = '';
  @property({ type: Boolean }) required = false;

  private onInput(e: Event) {
    this.dispatchEvent(new CustomEvent('input-changed', { detail: { value: (e.target as HTMLInputElement).value }}));
  }

  render() {
    return html`
      ${this.label ? html`<label>${this.label}</label>` : null}
      <div class="wrap">
        <input name=${this.name} type=${this.type} placeholder=${this.placeholder} ?required=${this.required} @input=${this.onInput} />
        <slot name="right" class="right"></slot>
      </div>
      ${this.hint ? html`<div class="hint">${this.hint}</div>` : null}
    `;
  }
}
declare global { interface HTMLElementTagNameMap { 'ui-input': UIInput } }
