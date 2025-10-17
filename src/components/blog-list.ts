import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { supabase } from '../lib/supabaseClient';

@customElement('blog-list')
export class BlogList extends LitElement {
  static styles = css`
    .item { padding:.8rem 0; border-bottom:1px solid #f1f3f5 }
    .item:last-child { border-bottom:0 }
    .title { font-weight:800 }
    .meta { color:#6b7280; font-size:.9rem }
  `;
  @state() rows: any[] = [];

  async connectedCallback() {
    super.connectedCallback();
    const { data } = await supabase.from('posts').select('id,title,slug,published_at').eq('status','published').order('published_at',{ascending:false}).limit(20);
    this.rows = data ?? [];
  }

  render() {
    return html`${this.rows.map(p => html`
      <div class="item">
        <div class="title">${p.title}</div>
        <div class="meta">${new Date(p.published_at ?? p.created_at).toLocaleDateString()}</div>
      </div>
    `)}`;
  }
}
declare global { interface HTMLElementTagNameMap { 'blog-list': BlogList } }
