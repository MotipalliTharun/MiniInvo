import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("landing-cluesstack-pro")
export class LandingCluesstackPro extends LitElement {
  static styles = css`
    :host { display:block; color:#0f172a }
    .hero {
      background: linear-gradient(180deg, #f3faff 0%, #ffffff 65%);
      border: 1px solid #eef2f6; border-radius: 16px;
      padding: clamp(1rem, 4vw, 2rem);
    }
    .brand { font-weight:900; letter-spacing:-.02em; font-size:clamp(1.6rem,3vw,2.2rem); margin:0 }
    .sub { color:#475569; max-width:72ch; margin:.4rem 0 0 0 }
    .row { display:flex; gap:.6rem; flex-wrap:wrap; margin-top: 1rem }
    .btn {
      appearance:none; border:1px solid #00acc1; background:#00bcd4; color:#fff;
      padding:.85rem 1rem; border-radius:12px; font-weight:900; cursor:pointer;
      transition: background .2s, box-shadow .2s, transform .06s;
    }
    .btn:hover { background:#00acc1; box-shadow:0 0 12px rgba(0,188,212,.35); }
    .btn:active { transform: translateY(1px); }
    .btn.secondary { background:#fff; color:#026775; border-color:#cfeff5 }

    .section { margin-top:1.2rem; padding: clamp(1rem, 4vw, 1.4rem); border:1px solid #eef2f6; border-radius:16px; background:#fff; }
    .h2 { margin:0 0 .4rem 0; font-weight:900; letter-spacing:-.02em; font-size: clamp(1.2rem,2.4vw,1.6rem) }
    .muted { color:#64748b }
    .grid { display:grid; gap:1rem; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
    .card { border:1px solid #eef2f6; border-radius:12px; background:#fff; padding:1rem }
    .k { font-weight:800 }
    .v { color:#475569 }

    .list { display:grid; gap:.5rem }
    .item { display:flex; gap:.6rem; align-items:flex-start }
    .dot { width:10px; height:10px; border-radius:999px; background:#00bcd4; margin-top:.5rem }

    .pill { border:1px solid #e5f6fa; background:#e8fbff; color:#026775; padding:.25rem .55rem; border-radius:999px; font-size:.78rem; font-weight:800 }

    .cta-bar {
      margin-top:1rem; border:1px dashed #cfeff5; background:#f7fdff; border-radius:12px; padding:.8rem 1rem;
      display:flex; gap:.6rem; align-items:center; flex-wrap:wrap
    }

    .section-split { display:grid; gap:1rem; grid-template-columns: 1.2fr .8fr; }
    @media (max-width: 1024px) { .section-split { grid-template-columns: 1fr; } }

    .chip { border:1px solid #e5e7eb; border-radius:999px; padding:.35rem .6rem; background:#fff }
    .tag { display:inline-flex; align-items:center; gap:.4rem; border:1px solid #d9f3f8; background:#e8fbff; padding:.25rem .55rem; border-radius:999px; font-weight:800; color:#026775; font-size:.8rem }

    .tiles { display:grid; grid-template-columns: repeat(12, 1fr); gap: 8px }
    .tile {
      border:1px solid #e5f6fa; background:#f7fdff; border-radius:10px; padding:.6rem;
      font-weight:800; color:#026775; text-align:center;
    }
    .tiles .tile:nth-child(1){ grid-column: span 5; }
    .tiles .tile:nth-child(2){ grid-column: span 7; }
    .tiles .tile:nth-child(3){ grid-column: span 4; }
    .tiles .tile:nth-child(4){ grid-column: span 8; }
  `;

  @property({type:Boolean}) authed = false;

  private go(view: string) {
    this.dispatchEvent(new CustomEvent("go", { detail:{ view }, bubbles:true, composed:true }));
  }

  render() {
    return html`
      <!-- HERO -->
      <section class="hero">
        <span class="pill">Enterprise-ready • Simple by design</span>
        <h1 class="brand">Cluesstack — the community for automation workflows</h1>
        <p class="sub">Join other developers and small teams to build, share, and run practical automations. Browse community templates, create your own workflows, and compare “signature moves” for chat: <strong>Clues</strong> (guided hints) and <strong>Stack</strong> (stackable actions).</p>
        <div class="row">
          <button class="btn" @click=${() => this.go(this.authed ? "workflows" : "account")}>${this.authed ? "Go to Workflows" : "Get started free"}</button>
          <button class="btn secondary" @click=${() => this.go("community")}>Explore community</button>
          <button class="btn secondary" @click=${() => this.go("templates")}>Browse templates</button>
        </div>
        <div class="cta-bar">
          <span class="chip">No code required</span>
          <span class="chip">SSO/OAuth</span>
          <span class="chip">Role-based access</span>
          <span class="chip">Free tier</span>
        </div>
      </section>

      <!-- COMMUNITY -->
      <section class="section">
        <div class="section-split">
          <div>
            <h2 class="h2">Community for Developers</h2>
            <p class="muted">Share your workflows, fork others, and vote on the best “signature moves” for Clues & Stack. Learn from real use cases, not theory.</p>
            <div class="grid" style="margin-top:.6rem">
              <div class="card">
                <div class="k">Showcase</div>
                <div class="v">Publish your workflow with docs, inputs, and run examples.</div>
              </div>
              <div class="card">
                <div class="k">Fork & remix</div>
                <div class="v">Clone a community flow, change steps, and re-share.</div>
              </div>
              <div class="card">
                <div class="k">Reputation</div>
                <div class="v">Earn kudos for helpful templates and clean docs.</div>
              </div>
              <div class="card">
                <div class="k">Discussions</div>
                <div class="v">Threaded help, change logs, and version tags.</div>
              </div>
            </div>
            <div class="row" style="margin-top:.8rem">
              <button class="btn" @click=${() => this.go("community")}>Join the community</button>
              <button class="btn secondary" @click=${() => this.go("signup")}>Create account</button>
            </div>
          </div>
          <div>
            <span class="tag">Signature Moves</span>
            <h3 class="h2" style="margin-top:.4rem">Chat Signature Moves: <em>Clues</em> & <em>Stack</em></h3>
            <div class="list">
              <div class="item"><div class="dot"></div><div><strong>Clues</strong> — guided hints in chat that reveal the best next step for a workflow (ex: “Looks like you want a daily digest”).</div></div>
              <div class="item"><div class="dot"></div><div><strong>Stack</strong> — quick-add actions you can stack inline (ex: “+Post to Slack”, “+Append to Sheet”).</div></div>
              <div class="item"><div class="dot"></div><div><strong>Playbooks</strong> — save your Clues+Stack sequence as a reusable pattern for your team.</div></div>
            </div>
            <div class="tiles" style="margin-top:.8rem">
              <div class="tile">+ Clue: summarize</div>
              <div class="tile">+ Stack: Email digest</div>
              <div class="tile">+ Stack: Slack post</div>
              <div class="tile">+ Stack: Sheets append</div>
            </div>
          </div>
        </div>
      </section>

      <!-- WORKFLOWS -->
      <section class="section">
        <h2 class="h2">Workflows</h2>
        <p class="muted">Trigger → steps → test → enable. Use Clues & Stack to compose powerful flows, then share them with the community.</p>
        <div class="grid" style="margin-top:.6rem">
          <div class="card"><div class="k">Triggers</div><div class="v">Schedule, webhook, or app event (Gmail, Slack, Sheets, Notion).</div></div>
          <div class="card"><div class="k">Steps</div><div class="v">Email, Slack post, HTTP request, Sheets append, and more.</div></div>
          <div class="card"><div class="k">Runs</div><div class="v">View logs, inputs/outputs, and re-run failures.</div></div>
          <div class="card"><div class="k">Roles</div><div class="v">Viewer, Author, Admin — control who can run or edit.</div></div>
        </div>
        <div class="row" style="margin-top:.8rem">
          <button class="btn" @click=${() => this.go(this.authed ? "workflows" : "account")}>${this.authed ? "Open my workflows" : "Sign in to build"}</button>
          <button class="btn secondary" @click=${() => this.go("templates")}>Explore templates</button>
        </div>
      </section>

      <!-- ABOUT -->
      <section class="section">
        <h2 class="h2">About Cluesstack</h2>
        <p class="muted">We believe powerful automation should be accessible and legible. Clues (guided hints) and Stack (stackable actions) make building reliable workflows feel obvious, not intimidating.</p>
        <div class="grid" style="margin-top:.6rem">
          <div class="card"><div class="k">Principles</div><div class="v">Clarity over clutter. Defaults over decisions. Respect time & privacy.</div></div>
          <div class="card"><div class="k">Security</div><div class="v">SSO, OAuth, encrypted tokens, and least-privilege policies.</div></div>
          <div class="card"><div class="k">Roadmap</div><div class="v">Versioned templates, org workspaces, usage analytics.</div></div>
        </div>
      </section>

      <!-- SERVICES -->
      <section class="section">
        <h2 class="h2">Services</h2>
        <div class="grid" style="margin-top:.6rem">
          <div class="card">
            <div class="k">Starter</div>
            <div class="v">Perfect for individuals. 2 active workflows, 100 runs/mo.</div>
          </div>
          <div class="card">
            <div class="k">Team</div>
            <div class="v">Small teams & side projects. 10 workflows, role-based access.</div>
          </div>
          <div class="card">
            <div class="k">Enterprise</div>
            <div class="v">SSO/SAML, SCIM, audit logs, custom limits, priority support.</div>
          </div>
        </div>
        <div class="row" style="margin-top:.8rem">
          <button class="btn" @click=${() => this.go("pricing")}>See pricing</button>
          <button class="btn secondary" @click=${() => this.go("contact")}>Contact sales</button>
        </div>
      </section>
    `;
  }
}
declare global { interface HTMLElementTagNameMap { "landing-cluesstack-pro": LandingCluesstackPro } }
