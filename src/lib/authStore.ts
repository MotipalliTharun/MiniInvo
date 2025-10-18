// src/lib/authStore.ts
import { supabase } from "./supabaseClient";

export type Role = "pending" | "viewer" | "author" | "editor" | "admin";
export type SessionUser = { id: string; email: string | null; role: Role } | null;

type Listener = () => void;

class Store {
  user: SessionUser = null;
  ready = false;

  private listeners = new Set<Listener>();
  private inited = false;
  private unsubAuth?: () => void;

  /** Subscribe to auth changes. Returns an unsubscribe. */
  on(cb: Listener) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private emit() {
    for (const cb of this.listeners) cb();
  }

  /** Re-compute current user from Supabase auth + optional profile row. */
  async refresh() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        this.user = null;
        this.ready = true;
        this.emit();
        return;
      }

      const authUser = data.user;

      // Try to fetch a profile row; if it's missing, gracefully fall back.
      // Note: if you want to avoid throwing when no row, use "maybeSingle" (Supabase v2).
      let role: Role = "pending";
      let email: string | null = authUser.email ?? null;

      const { data: profile, error: profErr } = await supabase
        .from("profiles")
        .select("role,email")
        .eq("id", authUser.id)
        .maybeSingle();

      if (!profErr && profile) {
        role = (profile.role ?? "pending") as Role;
        email = profile.email ?? email;
      }

      this.user = { id: authUser.id, email, role };
      this.ready = true;
      this.emit();
    } catch (_e) {
      // On any unexpected failure, fail safe to logged out state
      this.user = null;
      this.ready = true;
      this.emit();
    }
  }

  /** Initialize once; sets up realtime auth listener. Safe to call multiple times. */
  initOnce() {
    if (this.inited) return;
    this.inited = true;

    // Initial load
    void this.refresh();

    // Listen for auth changes (sign in/out, token refresh, etc.)
    const { data } = supabase.auth.onAuthStateChange((_ev) => {
      void this.refresh();
    });
    this.unsubAuth = () => data.subscription.unsubscribe();
  }

  /** Optional: dispose the store (e.g., on hot-reload edge cases). */
  destroy() {
    this.unsubAuth?.();
    this.unsubAuth = undefined;
    this.inited = false;
  }

  /** Helpers (use these in your forms/components) */
  async login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await this.refresh();
  }

  async signup(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // If email confirmation is enabled, user remains null until they confirm.
    await this.refresh();
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    await this.refresh();
  }

  /** Convenience getter */
  get isAuthed() {
    return !!this.user;
  }
}

export const authStore = new Store();
authStore.initOnce();
