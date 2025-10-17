import { LitElement, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { supabase } from "../lib/supabaseClient";

@customElement("signup-form")
export class SignupForm extends LitElement {
  static styles = css`
    :host { display:block }
    .panel {
      border:1px solid #eef2f6; border-radius:16px; background:#fff;
      box-shadow: 0 8px 24px rgba(0,0,0,.06);
      padding: clamp(1rem, 3.2vw, 2rem);
      max-width: 560px;
    }
    h2 { margin:0 0 .3rem 0; font-size:1.6rem; font-weight:900; }
    .sub { color:#6b7280; margin:0 0 1rem 0; }

    form { display:grid; gap:1rem; }
    label { font-size:.9rem; font-weight:700; color:#1e293b }
    input {
      width:100%; padding:.8rem .9rem;
      border:1px solid #e5e7eb; border-radius:12px; background:#fff; color:#1e293b;
    }
    input:focus { outline:none; border-color:#00acc1; box-shadow: 0 0 0 4px rgba(0,188,212,.15); }
    .row { display:flex; gap:.6rem; flex-wrap:wrap; align-items:center }

    .meter{ display:flex; gap:.25rem }
    .bar{ height:6px; flex:1; border-radius:4px; background:#e5e7eb }
    .bar.fill.w{ background:#ef4444 } .bar.fill.o{ background:#f59e0b }
    .bar.fill.g{ background:#10b981 } .bar.fill.s{ background:#06b6d4 }

    .btn {
      appearance:none; border:1px solid #00acc1; background:#00bcd4; color:#fff;
      padding:.85rem 1rem; border-radius:12px; font-weight:900; cursor:pointer;
      transition: background .2s, box-shadow .2s, transform .06s;
    }
    .btn:hover { background:#00acc1; box-shadow:0 0 12px rgba(0,188,212,.35); }
    .btn:active { transform: translateY(1px); }
    .btn[disabled]{ opacity:.65; cursor:not-allowed; }

    .link { appearance:none; background:none; border:0; color:#00bcd4; font-weight:800; cursor:pointer; padding:0; }
    .link:hover { color:#00acc1; }

    .msg { padding:.7rem .85rem; border-radius:12px; border:1px solid transparent; font-size:.92rem }
    .ok  { background:#ecfdf5; border-color:#a7f3d0; color:#065f46 }
    .err { background:#fef2f2; border-color:#fecaca; color:#991b1b }
  `;

  @state() busy = false;
  @state() msg = "";
  @state() ok = false;
  @state() pw = "";
  @state() showPw = false;

  private strength(p: string) {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 4);
  }

  private async onSubmit(e: Event) {
    e.preventDefault();
    this.msg = ""; this.ok = false; this.busy = true;
    const f = new FormData(e.target as HTMLFormElement);
    const name = String(f.get("name") || "").trim();
    const email = String(f.get("email") || "").trim().toLowerCase();
    const password = String(f.get("password") || "");

    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name || null } }
    });
    this.busy = false;

    if (error) { this.msg = `❌ ${error.message}`; this.ok = false; return; }

    this.msg = "✅ Account created. Check your email to confirm, then sign in.";
    this.ok = true;
    (e.target as HTMLFormElement).reset();
    this.pw = "";
    this.dispatchEvent(new CustomEvent("goto-login", { bubbles: true, composed: true }));
  }

  render() {
    const s = this.strength(this.pw);
    return html`
      <section class="panel">
        <h2>Create your account</h2>
        <p class="sub">New users start as <strong>pending</strong>. An admin will set your role.</p>

        ${this.msg ? html`<div class="msg ${this.ok ? "ok" : "err"}">${this.msg}</div>` : nothing}

        <form @submit=${this.onSubmit}>
          <div>
            <label for="name">Full name</label>
            <input id="name" name="name" placeholder="Jane Doe" />
          </div>
          <div>
            <label for="email">Email</label>
            <input id="email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@domain.com" required />
          </div>
          <div>
            <label for="password">Password</label>
            <div style="position:relative">
              <input id="password" name="password" .type=${this.showPw ? "text" : "password"} @input=${(e:any)=>this.pw=e.target.value} placeholder="••••••••" required style="width:100%; padding-right:3.2rem" />
              <button class="link" type="button" style="position:absolute; right:.6rem; top:50%; transform:translateY(-50%)" @click=${()=>this.showPw=!this.showPw}>${this.showPw?"Hide":"Show"}</button>
            </div>
            <div class="meter" style="margin-top:.4rem">
              ${[0,1,2,3].map(i=>html`<div class="bar ${i < s ? "fill " + (["w","o","g","s"][s-1]||"w") : ""}"></div>`)}
            </div>
            <div class="sub" style="font-size:.85rem">Use 8+ chars with upper/lowercase, a number, and a symbol.</div>
          </div>

          <div class="row">
            <button class="btn" ?disabled=${this.busy} type="submit">${this.busy ? "Creating…" : "Create account"}</button>
            <div>
              Already have an account?
              <button type="button" class="link" @click=${() => this.dispatchEvent(new CustomEvent("goto-login", { bubbles: true, composed: true }))}>Sign in</button>
            </div>
          </div>
        </form>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "signup-form": SignupForm }
}
