import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { supabase } from "../lib/supabaseClient";
import type { SessionUser } from "../lib/authStore";

type Message = { id: string; channel_id: string; user_id: string; body: string; created_at: string };

@customElement("community-room")
export class CommunityRoom extends LitElement {
  static styles = css`
    :host { display:block }
    .messages { padding: .8rem; display:flex; flex-direction:column; gap:.6rem; overflow:auto; }
    .banner {
      padding:.6rem .8rem; border-bottom:1px solid #eef2f6; color:#475569;
      display:flex; justify-content:space-between; align-items:center;
    }
    .btn {
      appearance:none; border:1px solid #00acc1; background:#00bcd4; color:#fff;
      padding:.5rem .8rem; border-radius:10px; font-weight:900; cursor:pointer;
    }
    .muted { color:#64748b }
  `;

  @property({type:String}) channelId!: string;
  @property({type:Object}) user: SessionUser = null;

  @state() items: Message[] = [];
  @state() loading = true;
  private subscription?: ReturnType<typeof supabase.channel>;

  async updated(changed: Map<string, any>) {
    if (changed.has("channelId")) {
      await this.load();
      this.subscribe();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.subscription?.unsubscribe();
  }

  private async load() {
    this.loading = true;
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("channel_id", this.channelId)
      .order("created_at", { ascending: true })
      .limit(200);
    if (!error) this.items = data || [];
    this.loading = false;
    // scroll last
    await this.updateComplete;
    const scroller = this.renderRoot.querySelector(".messages");
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }

  private subscribe() {
    this.subscription?.unsubscribe();

    this.subscription = supabase
      .channel(`room:${this.channelId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `channel_id=eq.${this.channelId}` },
        (payload: any) => {
          this.items = [...this.items, payload.new as Message];
          // auto-scroll on new
          const scroller = this.renderRoot.querySelector(".messages");
          if (scroller) scroller.scrollTop = scroller.scrollHeight;
        }
      )
      .subscribe();
  }

  private async send(e: CustomEvent<{ text: string }>) {
    const text = (e.detail?.text || "").trim();
    if (!text) return;
    if (!this.user?.id) {
      alert("Please sign in to send messages.");
      return;
    }
    const optimistic: Message = {
      id: crypto.randomUUID(),
      channel_id: this.channelId,
      user_id: this.user.id,
      body: text,
      created_at: new Date().toISOString(),
    };
    this.items = [...this.items, optimistic];

    const { error } = await supabase.from("messages").insert({
      channel_id: this.channelId,
      user_id: this.user.id,
      body: text,
    });
    if (error) {
      // revert if failed
      this.items = this.items.filter((m) => m.id !== optimistic.id);
      alert("Send failed: " + error.message);
    }
  }

  render() {
    return html`
      <div class="banner">
        <span class="muted">${this.loading ? "Loading…" : `${this.items.length} messages`}</span>
        ${this.user ? html`<span class="muted">Signed in as ${this.user.email ?? "user"}</span>` : html`<span class="muted">Read-only (sign in to chat)</span>`}
      </div>

      <div class="messages">
        ${this.items.map(m => html`<community-message .msg=${m} .self=${this.user?.id === m.user_id}></community-message>`)}
      </div>

      <community-input
        ?disabled=${!this.user}
        placeholder=${this.user ? "Message #channel…" : "Sign in to send a message"}
        @send=${(e: CustomEvent) => this.send(e)}
      ></community-input>
    `;
  }
}
declare global { interface HTMLElementTagNameMap { "community-room": CommunityRoom } }
