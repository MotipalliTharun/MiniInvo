import { createClient } from "@supabase/supabase-js";

// Vite exposes envs as import.meta.env.VITE_*
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// IMPORTANT: persistSession + autoRefreshToken must be on for SPA login to “stick”
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // handles magic-link/OAuth redirects
  },
});
