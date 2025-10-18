import { LitElement, css, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { supabase } from "../lib/supabaseClient";
import type { SessionUser } from "../lib/authStore";

type Channel = { id: string; slug: string; name: string };

@customElement("community-hub")
export class CommunityHub extends LitElement {
  static styles = css`
    :host { display:block; color:#0f172a }
    .wrap { display:grid; grid-template-columns: 260px 1fr 260px; gap:1rem; }
    @media (max-width: 1100px) { .wrap { grid-template-columns: 220px 1fr; } .members { display:none; } }
    .panel { background:#fff; border:1px solid #eef2f6; border-radius:16px; overflow:hidden }
    .sidebar { display:grid; align-content:start }
    .room { display:grid; grid-template-rows: 1fr auto; min-height: 60vh }
    .members { padding: .8rem }
    .title { padding:.8rem 1rem; border-bottom:1px solid #eef2f6; font-weight:900; letter-spacing:-.02em }
  `;

  @property({type:Object}) user: SessionUser = null; // pass from app if you want
  @state() channels: Channel[] = [];
  @state() current: Channel | null = null;

  async firstUpdated() {
    const { data } = await supabase.from("channels").select("*").order("name");
    this.channels = data || [];
    this.current = this.channels[0] || null;
  }

  private onSelect(e: CustomEvent) {
    const id = e.detail.id as string;
    this.current = this.channels.find(c => c.id === id) ?? null;
  }

  render() {
    return html`
      <div class="wrap">
        <div class="panel sidebar">
          <div class="title">Channels</div>
          <community-sidebar
            .channels=${this.channels}
            .currentId=${this.current?.id ?? null}
            @select-channel=${this.onSelect}>
          </community-sidebar>
        </div>

        <div class="panel room">
          ${this.current ? html`
            <div class="title"># ${this.current.name}</div>
            <community-room
              .channelId=${this.current.id}
              .user=${this.user}
            ></community-room>
          ` : html`<div style="padding:1rem">No channel selected.</div>`}
        </div>

        <div class="panel members">
          <div class="title">Members</div>
          <!-- Static list for now; you can wire memberships later -->
          <div style="padding:.8rem; display:grid; gap:.4rem; color:#475569">
            <div>👤 Admin</div>
            <div>👤 Moderator</div>
            <div>👤 Member</div>
          </div>
        </div>
      </div>
    `;
  }
}
declare global { interface HTMLElementTagNameMap { "community-hub": CommunityHub } }
