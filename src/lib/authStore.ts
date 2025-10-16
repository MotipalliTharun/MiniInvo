import { supabase } from './supabaseClient';
import type { ReactiveController, ReactiveControllerHost } from 'lit';

export type SessionUser = { id: string; email: string | null } | null;

export class AuthController implements ReactiveController {
  host: ReactiveControllerHost;
  user: SessionUser = null;
  ready = false;
  unsubscribe?: () => void;

  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);
  }

  async hostConnected() {
    await this.refresh();
    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      await this.refresh();
    });
    this.unsubscribe = () => sub.subscription.unsubscribe();
  }

  hostDisconnected() {
    this.unsubscribe?.();
  }

  async refresh() {
    const { data, error } = await supabase.auth.getUser();
    this.user = error
      ? null
      : (data.user
          ? { id: data.user.id, email: data.user.email ?? null } // ✅ fix here
          : null);
    this.ready = true;
    this.host.requestUpdate();
  }

  async logout() {
    await supabase.auth.signOut();
  }
}
