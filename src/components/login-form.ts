import { LitElement, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { supabase } from "../lib/supabaseClient";

@customElement("login-form")
export class LoginForm extends LitElement {
  static styles = css`
    :host { display:block }
    .shell {
      display:grid; gap:0; grid-template-columns: 1fr min(420px, 90vw);
      min-height: 540px; border:1px solid #eef2f6; border-radius:16px; background:#fff;
      box-shadow: 0 8px 24px rgba(0,0,0,.06); overflow:hidden;
    }
    @media (max-width: 980px){ .shell { grid-template-columns: 1fr; min-height: unset; } }

    /* Left brand panel (inspired by Webflow login) */
    .brand {
      background: linear-gradient(180deg, #f3faff 0%, #ffffff 70%);
      padding: clamp(1.25rem, 3vw, 2rem);
      display:grid; align-content:center; gap:1rem;
    }
    .tag {
      display:inline-flex; align-items:center; gap:.5rem;
      border:1px solid #d9f3f8; background:#e8fbff; padding:.35rem .6rem; border-radius:999px;
      font-weight:800; color:#026775; letter-spacing:.2px; font-size:.8rem;
    }
    .h1 {
      font-weight:900; letter-spacing:-.02em;
      font-size:clamp(1.6rem, 3.2vw, 2.2rem); line-height:1.1; margin:0;
    }
    .sub { color:#6b7280; max-width: 48ch; }

    /* Right form panel */
    .panel { padding: clamp(1rem, 3.2vw, 2rem); display:grid; align-content:center; }
    form { display:grid; gap:1rem; }
    label { font-size:.9rem; font-weight:700; color:#1e293b }
    .input {
      display:grid; gap:.35rem;
    }
    input {
      width:100%; padding:.8rem .9rem;
      border:1px solid #e5e7eb; border-radius:12px; background:#fff; color:#1e293b;
      transition: box-shadow .2s, border-color .2s;
    }
    input:focus { outline:none; border-color:#00acc1; box-shadow: 0 0 0 4px rgba(0,188,212,.15); }
    .hint { font-size:.85rem; color:#6b7280; }

    .actions { display:flex; justify-content:space-between; align-items:center; gap:.75rem; flex-wrap:wrap; }
    .link {
      appearance:none; background:none; border:0; color:#00bcd4; font-weight:800; cursor:pointer; padding:0;
    }
    .link:hover { color:#00acc1; }

    .btn {
      appearance:none; border:1px solid #00acc1; background:#00bcd4; color:#fff;
      padding:.85rem 1rem; border-radius:12px; font-weight:900; cursor:pointer;
      transition: background .2s, box-shadow .2s, transform .06s;
    }
    .btn:hover { background:#00acc1; box-shadow:0 0 12px rgba(0,188,212,.35); }
    .btn:active { transform: translateY(1px); }
    .btn[disabled] { opacity:.65; cursor:not-allowed; }

    .oauth { display:grid; gap:.45rem; }
    .oauth-btn {
      border:1px solid #e5e7eb; background:#fff; padding:.75rem 1rem; border-radius:12px; cursor:pointer;
      display:flex; align-items:center; gap:.6rem; justify-content:center; font-weight:700;
      transition: box-shadow .2s, transform .06s;
    }
    .oauth-btn:hover { box-shadow: 0 6px 16px rgba(0,0,0,.06); }
    .oauth-btn:active { transform: translateY(1px); }

    .msg { padding:.7rem .85rem; border-radius:12px; border:1px solid transparent; font-size:.92rem }
    .ok  { background:#ecfdf5; border-color:#a7f3d0; color:#065f46 }
    .err { background:#fef2f2; border-color:#fecaca; color:#991b1b }
    .caps { color:#b45309; background:#fffbeb; border-color:#fde68a }

    .row { display:flex; gap:.5rem; align-items:center; }

    .divider { display:grid; grid-template-columns: 1fr auto 1fr; align-items:center; gap:.6rem; color:#9aa3af; font-size:.85rem; }
    .divider::before, .divider::after { content:""; height:1px; background:#eef2f6; display:block; }
  `;

  @state() busy = false;
  @state() msg = "";
  @state() ok = false;
  @state() showPw = false;
  @state() caps = false;

  private onKey(e: KeyboardEvent) {
    // Detect CapsLock for better UX
    if (e.getModifierState && e.key.length === 1) {
      this.caps = e.getModifierState("CapsLock");
    }
  }

  private validEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  private async signInPassword(e: Event) {
    e.preventDefault();
    this.msg = "";
    this.ok = false;
    this.busy = true;
    

    const f = new FormData(e.target as HTMLFormElement);
    const email = String(f.get("email") || "").trim().toLowerCase();
    const password = String(f.get("password") || "");

    if (!this.validEmail(email)) {
      this.busy = false;
      this.msg = "Please enter a valid email address.";
      this.ok = false;
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    this.busy = false;

    if (error) {
      this.msg = `❌ ${error.message}`;
      this.ok = false;
      return;
    }
    this.msg = "✅ Signed in successfully.";
    this.ok = true;
    this.dispatchEvent(new CustomEvent("logged-in", { bubbles: true, composed: true }));
  }

  private async signInWithGoogle() {
    this.busy = true;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/account/callback" },
    });
    this.busy = false;
    if (error) { this.msg = `❌ ${error.message}`; this.ok = false; }
  }

  private async sendMagicLink() {
    const email = (this.renderRoot.querySelector('input[name="email"]') as HTMLInputElement)?.value.trim().toLowerCase();
    if (!this.validEmail(email)) { this.msg = "Please enter a valid email first."; this.ok = false; return; }
    this.busy = true; this.msg = "";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/account/callback" }
    });
    this.busy = false;
    if (error) { this.msg = `❌ ${error.message}`; this.ok = false; return; }
    this.msg = "✅ Magic link sent. Check your email.";
    this.ok = true;
  }

  private gotoSignup() {
    this.dispatchEvent(new CustomEvent("goto-signup", { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <section class="shell">
        <div class="brand">
          <span class="tag">Welcome back</span>
          <h1 class="h1">Sign in to publish and manage your blog.</h1>
          <p class="sub">Author, edit, and approve posts with role-based access. Your session stays secure with Supabase Auth.</p>
        </div>

        <div class="panel">
          ${this.msg ? html`<div class="msg ${this.ok ? "ok" : "err"}">${this.msg}</div>` : nothing}
          ${this.caps ? html`<div class="msg caps">Caps Lock is ON — passwords are case sensitive.</div>` : nothing}

          <form @submit=${this.signInPassword} @keydown=${this.onKey}>
            <div class="input">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@domain.com" required />
            </div>
            <div class="input">
              <label for="password">Password</label>
              <div class="row" style="position:relative; width:100%">
                <input id="password" name="password" .type=${this.showPw ? "text" : "password"} autocomplete="current-password" placeholder="••••••••" required style="width:100%; padding-right:3.2rem" />
                <button type="button" class="link" style="position:absolute; right:.6rem" @click=${() => (this.showPw = !this.showPw)}>${this.showPw ? "Hide" : "Show"}</button>
              </div>
              <div class="hint">Use at least 8 characters.</div>
            </div>

            <div class="actions">
              <button class="btn" ?disabled=${this.busy} type="submit">
                ${this.busy ? "Signing in…" : "Sign in"}
              </button>
              <button type="button" class="link" @click=${this.sendMagicLink}>Email a magic link</button>
            </div>

            <div class="divider">or</div>

            <div class="oauth">
              <button type="button" class="oauth-btn" @click=${this.signInWithGoogle} ?disabled=${this.busy}>
                <span>🔐</span> Continue with Google
              </button>
            </div>

            <div class="actions" style="margin-top:.6rem">
              <span>Don’t have an account?</span>
              <button type="button" class="link" @click=${this.gotoSignup}>Create one</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "login-form": LoginForm }
}
