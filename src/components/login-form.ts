import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { supabase } from '../lib/supabaseClient';

@customElement('login-form')
export class LoginForm extends LitElement {
  static styles = css`
    form { display:grid; gap:.75rem; max-width:360px }
    input,button { padding:.6rem .8rem; border:1px solid #ddd; border-radius:.5rem }
    button{ cursor:pointer }
    .msg{ font-size:.9rem }
  `;
  @state() msg=''; @state() busy=false;

  private async onSubmit(e: Event) {
    e.preventDefault(); this.msg=''; this.busy=true;
    const fd = new FormData(e.target as HTMLFormElement);
    const email = String(fd.get('email')||'').trim();
    const password = String(fd.get('password')||'').trim();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    this.busy=false;
    this.msg = error ? error.message : '✅ Logged in.';
    if (!error) this.dispatchEvent(new CustomEvent('logged-in', { bubbles:true, composed:true }));
  }

  render() {
    return html`
      <form @submit=${this.onSubmit}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button ?disabled=${this.busy} type="submit">${this.busy?'Signing in…':'Sign in'}</button>
        <div class="msg">${this.msg}</div>
      </form>`;
  }
}
declare global { interface HTMLElementTagNameMap { 'login-form': LoginForm; } }
