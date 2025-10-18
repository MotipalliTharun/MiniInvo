// src/state/auth.ts (or src/lib/authStore.ts — keep the import path consistent across your app)
import { supabase } from "../lib/supabaseClient";

export type SessionUser =
  | { id: string; email: string | null; role?: "user" | "admin" }
  | null;

type Listener = () => void;

class AuthStore {
  user: SessionUser = null;
  ready = false;

  private listeners = new Set<Listener>();
  private unsubAuth?: () => void;

  constructor() {
    void this.init();
  }

  /** One-time init: load current user and subscribe to auth changes */
  private async init() {
    await this.refresh();
    const { data } = supabase.auth.onAuthStateChange(() => {
      void this.refresh();
    });
    this.unsubAuth = () => data.subscription.unsubscribe();
  }

  /** Get latest user (auth) and notify listeners */
  async refresh() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      this.user = null;
    } else {
      this.user = {
        id: data.user.id,
        email: data.user.email ?? null,
        // role is optional; you can enrich this from 'profiles' later if needed
      };
    }
    this.ready = true;
    this.emit();
  }

  /** Subscribe to store changes. Returns an unsubscribe function. */
  on(cb: Listener) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private emit() {
    for (const cb of this.listeners) cb();
  }

  /** Auth helpers */
  async login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await this.refresh();
  }

  async signup(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // If email confirmation is enabled, user remains null until confirmed.
    await this.refresh();
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    await this.refresh();
  }

  /** Optional: call if you need to fully dispose (e.g., hot module edge cases) */
  destroy() {
    this.unsubAuth?.();
    this.unsubAuth = undefined;
    this.listeners.clear();
  }

  /** Convenience getter */
  get isAuthed() {
    return !!this.user;
  }
}

export const authStore = new AuthStore();
