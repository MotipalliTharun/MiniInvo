import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { supabase } from '../lib/supabaseClient';

@customElement('signup-form')
export class SignupForm extends LitElement {
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
    const { error } = await supabase.auth.signUp({ email, password });
    this.busy=false;
    this.msg = error ? error.message : '✅ Check your email to confirm your account.';
    if (!error) (e.target as HTMLFormElement).reset();
  }

  render() {
    return html`
      <form @submit=${this.onSubmit}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" minlength="6" placeholder="Password (min 6 chars)" required />
        <button ?disabled=${this.busy} type="submit">${this.busy?'Creating…':'Create account'}</button>
        <div class="msg">${this.msg}</div>
      </form>`;
  }
}
declare global { interface HTMLElementTagNameMap { 'signup-form': SignupForm; } }
