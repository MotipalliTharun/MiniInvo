import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { authStore } from '../state/auth';

@customElement('signup-form')
export class SignupForm extends LitElement {
  static styles = css`
    :host { display:block }
    form { display:grid; gap:.8rem }
    label { font-weight:700; color:#0f172a }
    input {
      width:100%; padding:.8rem .9rem; border:1px solid #e5e7eb; border-radius:12px;
      background:#fff; color:#0f172a;
    }
    input:focus { outline:none; border-color:#00acc1; box-shadow:0 0 0 4px rgba(0,188,212,.15) }
    .row { display:flex; gap:.6rem; align-items:center; flex-wrap:wrap }
    .btn {
      border:1px solid #00acc1; background:#00bcd4; color:#fff;
      padding:.7rem 1rem; border-radius:12px; font-weight:900; cursor:pointer;
    }
    .link { background:none; border:0; color:#026775; cursor:pointer; font-weight:800; }
    .msg { padding:.6rem .8rem; border-radius:10px; font-size:.9rem }
    .err { background:#fef2f2; border:1px solid #fecaca; color:#991b1b }
    .ok  { background:#ecfdf5; border:1px solid #a7f3d0; color:#065f46 }
  `;

  @state() busy = false;
  @state() errorMsg = '';
  @state() okMsg = '';

  private async submit(e: Event) {
    e.preventDefault();
    this.errorMsg = ''; this.okMsg = '';
    const f = new FormData(e.target as HTMLFormElement);
    const email = String(f.get('email') || '').trim().toLowerCase();
    const password = String(f.get('password') || '');

    if (!email || !password) {
      this.errorMsg = 'Please enter email and password.';
      return;
    }

    this.busy = true;
    try {
      await authStore.signup(email, password);
      // If confirm-email is enabled, user must verify email:
      this.okMsg = 'Account created. Check your email to confirm, then sign in.';
      // Auto-swap to login so the user can sign in after confirming
      setTimeout(() => {
        this.dispatchEvent(new CustomEvent('goto-login', { bubbles: true, composed: true }));
      }, 800);
    } catch (err: any) {
      this.errorMsg = err?.message || 'Sign up failed.';
    } finally {
      this.busy = false;
    }
  }

  render() {
    return html`
      ${this.errorMsg ? html`<div class="msg err">${this.errorMsg}</div>` : nothing}
      ${this.okMsg ? html`<div class="msg ok">${this.okMsg}</div>` : nothing}
      <form @submit=${(e:Event)=>this.submit(e)}>
        <div>
          <label for="email">Email</label>
          <input id="email" name="email" type="email" inputmode="email" placeholder="you@domain.com" />
        </div>
        <div>
          <label for="password">Password</label>
          <input id="password" name="password" type="password" placeholder="••••••••" />
        </div>
        <div class="row">
          <button class="btn" ?disabled=${this.busy} type="submit">${this.busy ? 'Creating…' : 'Create account'}</button>
          <button class="link" type="button" @click=${() => this.dispatchEvent(new CustomEvent('goto-login', {bubbles:true,composed:true}))}>Back to sign in</button>
        </div>
      </form>
    `;
  }
}
declare global { interface HTMLElementTagNameMap { 'signup-form': SignupForm } }
