import { supabase } from "./supabaseClient";

export type Role = "pending" | "viewer" | "author" | "editor" | "admin";
export type SessionUser = { id: string; email: string | null; role: Role } | null;

class Store {
  user: SessionUser = null;
  ready = false;
  listeners = new Set<() => void>();

  on(cb: () => void) { this.listeners.add(cb); return () => this.listeners.delete(cb); }
  emit() { for (const cb of this.listeners) cb(); }

  async refresh() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      this.user = null;
      this.ready = true;
      this.emit();
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role,email")
      .eq("id", data.user.id)
      .single();

    this.user = {
      id: data.user.id,
      email: profile?.email ?? data.user.email ?? null,
      role: (profile?.role ?? "pending") as Role,
    };
    this.ready = true;
    this.emit();
  }

  initOnce() {
    if ((window as any).__auth_inited) return;
    (window as any).__auth_inited = true;

    // initial read
    this.refresh();

    // live updates
    supabase.auth.onAuthStateChange((_ev, _session) => {
      this.refresh();
    });
  }
}

export const authStore = new Store();
authStore.initOnce();
