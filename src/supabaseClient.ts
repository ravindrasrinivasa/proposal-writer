import { createClient } from "@supabase/supabase-js";

// We check both VITE_ and NEXT_PUBLIC_ prefixes for robustness across frameworks
const supabaseUrl = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || ((import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL as string);
const supabaseAnonKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || ((import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase credentials not found. Proposal Generator is initialized in Demo Local Mode. " +
    "To connect real databases, add VITE_SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and " +
    "VITE_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) to your env or secrets settings."
  );
}
