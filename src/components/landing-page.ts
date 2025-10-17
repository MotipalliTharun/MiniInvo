// src/components/landing-page.ts
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("landing-page")
export class LandingPage extends LitElement {
  @property({ type: Boolean }) authed = false;

  static styles = css`
    :host {
      display: block;
      color: var(--text, #1e293b);
    }

    /* Page layout */
    .wrap {
      max-width: 1120px;
      margin: 0 auto;
      padding: 1.25rem;
    }

    /* Hero */
    .hero {
      background: linear-gradient(180deg, #f3faff 0%, #ffffff 60%);
      border: 1px solid var(--border, #e5e7eb);
      border-radius: 18px;
      padding: clamp(1rem, 3vw, 2rem);
      box-shadow: var(--elev-1, 0 8px 24px rgba(0,0,0,.06));
    }
    .hero-grid {
      display: grid;
      gap: 1.25rem;
      grid-template-columns: 1.2fr 1fr;
    }
    @media (max-width: 960px) {
      .hero-grid { grid-template-columns: 1fr; }
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: .5rem;
      padding: .35rem .6rem;
      border-radius: 999px;
      border: 1px solid #eaf7fb;
      background: #effbfe;
      color: #036b7f;
      font-weight: 700;
      letter-spacing: .2px;
      font-size: .82rem;
    }

    h1 {
      font-size: clamp(1.8rem, 3.6vw, 3rem);
      line-height: 1.1;
      margin: .6rem 0 .3rem;
      font-weight: 900;
      letter-spacing: -0.02em;
    }

    .sub {
      color: var(--muted, #6b7280);
      font-size: clamp(1rem, 1.2vw, 1.15rem);
      max-width: 54ch;
    }

    .cta-row {
      display: flex;
      gap: .6rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    .btn {
      appearance: none;
      border: 1px solid var(--brand-600, #00acc1);
      background: var(--brand, #00bcd4);
      color: #fff;
      padding: .8rem 1rem;
      border-radius: 12px;
      font-weight: 800;
      cursor: pointer;
      transition: box-shadow .2s ease, transform .06s ease, background .2s ease;
    }
    .btn:hover { background: var(--brand-600, #00acc1); box-shadow: 0 0 12px rgba(0,188,212,.35); }
    .btn:active { transform: translateY(1px); }

    .btn-ghost {
      background: #fff;
      color: var(--text, #1e293b);
      border: 1px solid #e5e7eb;
    }
    .btn-ghost:hover { background: #f8feff; border-color: #d9f3f8; }

    .hero-card {
      background: #fff;
      border: 1px solid #eef2f6;
      border-radius: 14px;
      padding: 1rem;
      box-shadow: 0 8px 24px rgba(0,0,0,.05);
    }
    .mini-kpis {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: .75rem;
    }
    .kpi {
      background: #ffffff;
      border: 1px solid #f1f3f5;
      border-radius: 12px;
      padding: .7rem .8rem;
    }
    .kpi .v { font-weight: 900; font-size: 1.15rem; }
    .kpi .k { font-size: .85rem; color: var(--muted, #6b7280); }

    /* Logo strip */
    .logos {
      margin: 1.25rem 0;
      padding: .9rem;
      border: 1px solid #f1f3f5;
      border-radius: 12px;
      background: #fff;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 1rem;
      align-items: center;
      justify-items: center;
    }
    @media (max-width: 900px) { .logos { grid-template-columns: repeat(3, 1fr); } }
    .logo {
      height: 28px;
      opacity: .7;
      filter: saturate(.2);
      background: #f8fafc;
      border: 1px solid #eef2f7;
      border-radius: 8px;
      width: 100%;
      display: grid; place-items: center;
      color: #8aa3b3;
      font-weight: 700; letter-spacing: .08em;
    }

    /* “One click, clear next steps” style features */
    .features {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 960px) { .features { grid-template-columns: 1fr; } }
    .f-card {
      background: #fff;
      border: 1px solid #eef2f6;
      border-radius: 14px;
      padding: 1rem;
      box-shadow: 0 6px 16px rgba(0,0,0,.04);
    }
    .f-head {
      display: flex; align-items: center; gap: .6rem; margin-bottom: .4rem;
      font-weight: 800;
    }
    .f-icon {
      height: 36px; width: 36px; border-radius: 10px;
      display: grid; place-items: center;
      background: #e6fbff; color: #007a88; font-size: 1.1rem;
      border: 1px solid #ccf6fb;
    }
    .f-text { color: var(--muted, #6b7280); }

    /* How it works */
    .steps {
      background: linear-gradient(180deg, #f7fdff 0%, #ffffff 100%);
      border: 1px solid #eaf7fb;
      border-radius: 16px;
      padding: 1rem;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: .8rem;
    }
    @media (max-width: 960px) { .steps { grid-template-columns: 1fr; } }
    .step {
      background: #fff; border: 1px solid #eef2f6; border-radius: 14px; padding: 1rem;
    }
    .n {
      display:inline-grid; place-items:center;
      height: 28px; width: 28px; border-radius: 999px;
      background: #e6fbff; color:#007a88; border:1px solid #ccf6fb;
      font-weight: 800; margin-right: .5rem;
    }

    /* Proof / testimonial */
    .proof {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 1rem;
      align-items: center;
    }
    @media (max-width: 960px) { .proof { grid-template-columns: 1fr; } }
    blockquote {
      background: #fff;
      border: 1px solid #eef2f6;
      border-radius: 14px;
      padding: 1rem;
      font-size: 1.05rem;
      box-shadow: 0 8px 20px rgba(0,0,0,.05);
    }
    cite { display:block; margin-top:.5rem; color: var(--muted, #6b7280) }

    /* Integrations */
    .integrations {
      background:#fff; border:1px solid #eef2f6; border-radius:14px; padding:1rem;
    }
    .erp-grid {
      display:grid; gap:.6rem; grid-template-columns: repeat(6, 1fr);
    }
    @media (max-width: 900px) { .erp-grid { grid-template-columns: repeat(3, 1fr); } }
    .erp {
      background:#f8fafc; border:1px solid #eef2f7; border-radius:10px;
      padding:.7rem; text-align:center; font-weight:700; color:#78909c;
    }

    /* Final CTA */
    .final-cta {
      display:grid; gap:.6rem; align-items:center; justify-items:center; text-align:center;
      background: linear-gradient(180deg, #e8fbff 0%, #ffffff 85%);
      border: 1px solid #d9f3f8; border-radius: 16px; padding: 1.2rem;
    }
    .final-cta .title { font-weight:900; font-size: clamp(1.3rem, 2.2vw, 1.8rem); }
  `;

  private goAccount() {
    this.dispatchEvent(new CustomEvent("go-account", { bubbles: true, composed: true }));
  }
  private goDashboard() {
    this.dispatchEvent(new CustomEvent("go-dashboard", { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="wrap">
        <!-- HERO -->
        <section class="hero">
          <div class="hero-grid">
            <div>
              <span class="eyebrow">Inventory AI — clear next steps</span>
              <h1>Stop guessing. Let AI surface risks, opportunities, and the next best action.</h1>
              <p class="sub">
                One click to see stock-outs before they happen, rebalance excess,
                and turn ERP data into daily, actionable recommendations.
              </p>
              <div class="cta-row">
                ${this.authed
                  ? html`<button class="btn" @click=${this.goDashboard}>Open dashboard</button>`
                  : html`<button class="btn" @click=${this.goAccount}>Start free</button>`}
                <button class="btn btn-ghost" @click=${this.goAccount}>Book a demo</button>
              </div>
            </div>

            <div class="hero-card">
              <div class="mini-kpis">
                <div class="kpi">
                  <div class="v">↑ 97%</div>
                  <div class="k">Target fill rate</div>
                </div>
                <div class="kpi">
                  <div class="v">-22%</div>
                  <div class="k">Excess inventory</div>
                </div>
                <div class="kpi">
                  <div class="v">×3</div>
                  <div class="k">Faster ordering</div>
                </div>
              </div>
              <p style="margin:.8rem 0 0;color:#6b7280;font-size:.9rem">
                Drive higher service levels while reducing working capital with policy-driven reordering and AI recommendations.
              </p>
            </div>
          </div>
        </section>

        <!-- LOGO STRIP -->
        <section class="logos" aria-label="Trusted by">
          ${["Netsuite","Sage","Acumatica","Dynamics","SAP B1","Cin7"].map(n => html`<div class="logo">${n}</div>`)}
        </section>

        <!-- FEATURES -->
        <section class="features" aria-label="Key capabilities">
          ${[
            {i:"🧭", t:"One-click guidance", d:"See prioritized issues every morning with clear next steps across locations and suppliers."},
            {i:"📈", t:"Predictive forecasting", d:"Blend AI + time series to anticipate demand shifts and seasonality with confidence."},
            {i:"🔄", t:"Policy-driven ordering", d:"Auto-create purchase orders aligned to service targets and lead-time variability."},
          ].map(f => html`
            <article class="f-card">
              <div class="f-head"><span class="f-icon">${f.i}</span> ${f.t}</div>
              <div class="f-text">${f.d}</div>
            </article>
          `)}
        </section>

        <div style="height:1rem"></div>

        <!-- HOW IT WORKS -->
        <section class="steps" aria-label="How it works">
          ${[
            {n:1, t:"Connect your ERP", d:"Read items, history, suppliers, and locations securely."},
            {n:2, t:"Train & tune", d:"Calibrate policies, classes, and lead times per item/location."},
            {n:3, t:"Act daily", d:"Review AI suggestions, approve POs, and track KPIs."},
          ].map(s => html`
            <div class="step">
              <div style="display:flex;align-items:center;font-weight:900"><span class="n">${s.n}</span>${s.t}</div>
              <div class="f-text" style="margin-top:.4rem">${s.d}</div>
            </div>
          `)}
        </section>

        <div style="height:1rem"></div>

        <!-- PROOF -->
        <section class="proof" aria-label="Customer proof">
          <blockquote>
            “We cut excess by double digits and lifted our fill rate without growing stock. The daily AI briefing is now our team’s morning ritual.”
            <cite>— Ops Director, Mid-market Distributor</cite>
          </blockquote>
          <div class="integrations">
            <strong>Works with your stack</strong>
            <div class="erp-grid" style="margin-top:.6rem">
              ${["NetSuite","Sage","Acumatica","Dynamics 365","SAP B1","Cin7 Core"].map(e => html`<div class="erp">${e}</div>`)}
            </div>
          </div>
        </section>

        <div style="height:1rem"></div>

        <!-- FINAL CTA -->
        <section class="final-cta">
          <div class="title">Ready to make inventory decisions with confidence?</div>
          <div style="display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center">
            ${this.authed
              ? html`<button class="btn" @click=${this.goDashboard}>Open dashboard</button>`
              : html`<button class="btn" @click=${this.goAccount}>Start free</button>`}
            <button class="btn btn-ghost" @click=${this.goAccount}>Talk to us</button>
          </div>
          <div style="font-size:.9rem;color:#6b7280">No credit card required. Setup in days, not months.</div>
        </section>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "landing-page": LandingPage; }
}
