/**
 * RANDOMLY — Supabase client configuration
 *
 * Initialises the Supabase client using environment variables.
 * Throws a clear configuration error if credentials are missing.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing VITE_SUPABASE_URL environment variable. ' +
    'Please create a .env file with VITE_SUPABASE_URL set to your Supabase project URL.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_ANON_KEY environment variable. ' +
    'Please create a .env file with VITE_SUPABASE_ANON_KEY set to your Supabase anon key.'
  );
}

/**
 * The Supabase client instance.
 * Uses the anonymous (public) key — never exposes service-role keys.
 *
 * Using 'any' for the database type to avoid schema sync issues.
 * The favorites table operations use basic CRUD that works with any schema.
 */
export const supabase = createClient<any>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);