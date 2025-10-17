import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ui-button')
export class UIButton extends LitElement {
  static styles = css`
    :host { display:inline-block }
    button {
      all: unset;
      display:inline-flex; align-items:center; justify-content:center; gap:.5rem;
      padding:.7rem 1rem; border-radius: var(--r-md);
      background: var(--brand); color: #fff; cursor: pointer;
      border: 1px solid var(--brand-700);
      box-shadow: var(--elev-1);
      transition: transform .06s ease, box-shadow .2s ease, background .2s ease;
    }
    button:hover { background: var(--brand-600); }
    button:active { transform: translateY(1px); }
    button[variant="ghost"] {
      background: transparent; color: var(--text);
      border: 1px solid var(--border);
    }
    button[variant="danger"] {
      background: var(--err); border-color: #b91c1c;
    }
    button[disabled] { opacity:.6; cursor:not-allowed; }
  `;
  @property({ type: String }) variant: 'solid'|'ghost'|'danger' = 'solid';
  @property({ type: Boolean, reflect: true }) disabled = false;

  render() { return html`<button ?disabled=${this.disabled} variant=${this.variant}><slot></slot></button>`; }
}
declare global { interface HTMLElementTagNameMap { 'ui-button': UIButton } }
