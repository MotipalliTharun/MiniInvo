import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { supabase } from '../lib/supabaseClient';
import type { Role } from '../lib/authStore';

@customElement('admin-users')
export class AdminUsers extends LitElement {
  static styles = css`
    table { width:100%; border-collapse: collapse; }
    th, td { padding:.6rem .5rem; border-bottom: 1px solid #eef2f6; }
    select { padding:.45rem .6rem; border:1px solid #e5e7eb; border-radius:8px; background:#fff }
    .row { display:flex; gap:.5rem; align-items:center }
    .save { padding:.45rem .7rem; border:1px solid #e5e7eb; border-radius:8px; cursor:pointer; background:#fff }
  `;
  @state() rows: Array<{id:string; email:string; full_name:string|null; role:Role}> = [];
  @state() saving: Record<string, boolean> = {};

  async connectedCallback() {
    super.connectedCallback();
    await this.load();
  }

  async load() {
    const { data } = await supabase.from('profiles').select('id,email,full_name,role').order('created_at',{ascending:false});
    this.rows = (data ?? []) as any;
  }

  async setRole(id: string, role: Role) {
    this.saving = { ...this.saving, [id]: true };
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
    this.saving = { ...this.saving, [id]: false };
    if (error) alert(error.message);
    await this.load();
    this.dispatchEvent(new CustomEvent('toast', { detail: { text: 'Role updated', tone:'ok' }, bubbles:true, composed:true }));
  }

  render() {
    return html`
      <h3 style="margin:0 0 .5rem 0;">Users & Roles</h3>
      <table>
        <thead><tr><th>Email</th><th>Name</th><th>Role</th><th></th></tr></thead>
        <tbody>
          ${this.rows.map(r => html`
            <tr>
              <td>${r.email}</td>
              <td>${r.full_name ?? ''}</td>
              <td>
                <div class="row">
                  <select .value=${r.role} @change=${(e:Event)=>this.setRole(r.id, (e.target as HTMLSelectElement).value as Role)}>
                    ${['pending','viewer','author','editor','admin'].map(opt => html`<option value=${opt}>${opt}</option>`)}
                  </select>
                  ${this.saving[r.id] ? html`<span>Saving…</span>` : null}
                </div>
              </td>
              <td></td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }
}
declare global { interface HTMLElementTagNameMap { 'admin-users': AdminUsers } }
