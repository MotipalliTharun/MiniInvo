import { supabase } from '../lib/supabaseClient';

export type SessionUser = { id: string; email: string | null } | null;

class AuthStore extends EventTarget {
  user: SessionUser = null;
  ready = false;
  #unsub?: () => void;

  constructor() {
    super();
    this.init();
  }

  async init() {
    await this.refresh();
    const { data } = supabase.auth.onAuthStateChange(async () => {
      await this.refresh();
    });
    this.#unsub = () => data.subscription.unsubscribe();
  }

  async refresh() {
    const { data, error } = await supabase.auth.getUser();
    this.user = error ? null : (data.user ? { id: data.user.id, email: data.user.email ?? null } : null);
    this.ready = true;
    this.dispatchEvent(new Event('change'));
  }

  async signOut() {
    await supabase.auth.signOut();
  }

  on(type: 'change', cb: () => void) {
    this.addEventListener(type, cb);
    return () => this.removeEventListener(type, cb);
  }
}

export const authStore = new AuthStore();
