import { LitElement, css, html, nothing } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { supabase } from "../lib/supabaseClient";

@customElement("contact-form")
export class ContactForm extends LitElement {
  static styles = css`
    :host { display:block }
    .wrap { display:grid; gap:1rem; }
    .panel { border:1px solid #eef2f6; background:#fff; border-radius:16px; padding:clamp(1rem,3vw,1.25rem); }
    form { display:grid; gap:.8rem; max-width: 640px; }
    label { font-weight:700; color:#0f172a; font-size:.95rem }
    input, textarea {
      width:100%; padding:.8rem .9rem; border:1px solid #e5e7eb; border-radius:12px;
      background:#fff; color:#0f172a;
    }
    input:focus, textarea:focus { outline:none; border-color:#00acc1; box-shadow:0 0 0 4px rgba(0,188,212,.15); }
    .row { display:flex; gap:.6rem; align-items:center; flex-wrap:wrap }
    .btn {
      appearance:none; border:1px solid #00acc1; background:#00bcd4; color:#fff;
      padding:.8rem 1rem; border-radius:12px; font-weight:900; cursor:pointer;
      transition: background .2s, box-shadow .2s, transform .06s;
    }
    .btn:hover { background:#00acc1; box-shadow:0 0 12px rgba(0,188,212,.35); }
    .btn:active { transform: translateY(1px); }
    .btn[disabled]{ opacity:.65; cursor:not-allowed }

    .msg { padding:.7rem .85rem; border-radius:12px; border:1px solid transparent; font-size:.92rem }
    .ok  { background:#ecfdf5; border-color:#a7f3d0; color:#065f46 }
    .err { background:#fef2f2; border-color:#fecaca; color:#991b1b }

    .socials { display:flex; gap:.6rem; flex-wrap:wrap }
    .chip { border:1px solid #e5e7eb; background:#fff; border-radius:999px; padding:.45rem .7rem; }
    a { text-decoration:none; color:#026775; font-weight:800 }
    a:hover { color:#00acc1; }
  `;

  @property({type:String}) email = "hello@example.com";
  @property({type:Object}) socials: Record<string, string> = {
    X: "https://x.com/yourhandle",
    LinkedIn: "https://www.linkedin.com/company/yourbrand",
    GitHub: "https://github.com/yourorg",
  };

  @state() busy = false;
  @state() msg = "";
  @state() ok = false;

  private validEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  private async submit(e: Event) {
    e.preventDefault();
    this.msg = ""; this.ok = false;
    const f = new FormData(e.target as HTMLFormElement);
    const name = String(f.get("name")||"").trim();
    const email = String(f.get("email")||"").trim().toLowerCase();
    const message = String(f.get("message")||"").trim();
    if (!name || !this.validEmail(email) || !message) {
      this.msg = "Please fill in your name, a valid email, and a message."; this.ok = false; return;
    }
    this.busy = true;
    const { error } = await supabase.from("contact_messages").insert({ name, email, message });
    this.busy = false;
    if (error) { this.msg = `❌ ${error.message}`; this.ok = false; return; }
    (e.target as HTMLFormElement).reset();
    this.msg = "✅ Thanks! We’ve received your message.";
    this.ok = true;
  }

  render() {
    return html`
      <div class="wrap">
        <div class="panel">
          ${this.msg ? html`<div class="msg ${this.ok ? "ok" : "err"}">${this.msg}</div>` : nothing}
          <form @submit=${(e:Event)=>this.submit(e)}>
            <div>
              <label for="name">Your name</label>
              <input id="name" name="name" placeholder="Jane Doe" />
            </div>
            <div>
              <label for="email">Email</label>
              <input id="email" name="email" type="email" inputmode="email" placeholder="you@domain.com" />
            </div>
            <div>
              <label for="message">Message</label>
              <textarea id="message" name="message" rows="6" placeholder="How can we help?"></textarea>
            </div>
            <div class="row">
              <button class="btn" ?disabled=${this.busy} type="submit">${this.busy ? "Sending…" : "Send message"}</button>
              <a class="chip" href="mailto:${this.email}">or email us: ${this.email}</a>
            </div>
          </form>
        </div>

        <div class="panel">
          <strong>Connect</strong>
          <div class="socials" style="margin-top:.6rem">
            ${Object.entries(this.socials).map(([k,v]) => html`<a class="chip" href=${v} rel="noopener" target="_blank">${k}</a>`)}
          </div>
        </div>
      </div>
    `;
  }
}
declare global { interface HTMLElementTagNameMap { "contact-form": ContactForm } }
