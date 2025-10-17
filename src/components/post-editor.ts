
import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { supabase } from '../lib/supabaseClient';

@customElement('post-editor')
export class PostEditor extends LitElement {
  static styles = css`
    .row { display:grid; gap:.6rem }
    input, textarea, select {
      width:100%; padding:.7rem .9rem; border:1px solid #e5e7eb; border-radius:12px; background:#fff;
      font: inherit;
    }
    .actions { display:flex; gap:.6rem; flex-wrap:wrap }
    button { padding:.7rem .9rem; border:1px solid #e5e7eb; border-radius:10px; background:#fff; cursor:pointer }
  `;

  @property({ type: String }) postId?: string;
  @state() title = ''; @state() slug = ''; @state() content = ''; @state() status:'draft'|'published'='draft';
  @state() loading = false;

  async connectedCallback() {
    super.connectedCallback();
    if (this.postId) await this.load();
  }

  async load() {
    const { data } = await supabase.from('posts').select('*').eq('id', this.postId).single();
    if (data) { this.title = data.title; this.slug = data.slug ?? ''; this.content = data.content; this.status = data.status; }
  }

  private collect() {
    return { title: this.title.trim(), slug: (this.slug || this.title.toLowerCase().replace(/\s+/g,'-')).slice(0,120), content: this.content, status: this.status };
  }

  async save() {
    this.loading = true;
    const body = this.collect();
    if (this.postId) {
      body['updated_at'] = new Date().toISOString() as any;
      const { error } = await supabase.from('posts').update(body).eq('id', this.postId);
      if (error) alert(error.message);
    } else {
      const { error: e2 } = await supabase.from('posts').insert(body as any);
      if (e2) alert(e2.message);
    }
    this.loading = false;
    this.dispatchEvent(new CustomEvent('saved', { bubbles:true, composed:true }));
  }

  render() {
    return html`
      <div class="row">
        <input placeholder="Title" .value=${this.title} @input=${(e: any) => this.title = e.target.value} />
        <input placeholder="Slug (optional)" .value=${this.slug} @input=${(e: any) => this.slug = e.target.value} />
        <select .value=${this.status} @change=${(e:any)=>this.status = e.target.value}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <textarea rows="10" placeholder="Write your post…" .value=${this.content} @input=${(e:any)=>this.content = e.target.value}></textarea>
        <div class="actions">
          <button @click=${() => this.status='draft'} ?disabled=${this.loading}>Save draft</button>
          <button @click=${() => { this.status='published'; this.save(); }} ?disabled=${this.loading}>Publish</button>
          <button @click=${this.save} ?disabled=${this.loading}>Save</button>
        </div>
      </div>
    `;
  }
}
declare global { interface HTMLElementTagNameMap { 'post-editor': PostEditor } }

