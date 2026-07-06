import { createClient } from '@supabase/supabase-js';

/**
 * Browser client — uses anon key, respects RLS.
 * Use in client components and hooks.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Server client — uses service role key, bypasses RLS.
 * Use ONLY in API routes and server components.
 */
export function createServerSupabase() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
