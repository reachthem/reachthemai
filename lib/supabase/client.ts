import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SPASassClient {
  getSupabaseClient: () => SupabaseClient;
  logout: () => Promise<void>;
}

let cachedClient: SPASassClient | null = null;

export async function createSPASassClientAuthenticated(): Promise<SPASassClient> {
  if (cachedClient) {
    return cachedClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const client = createClient(supabaseUrl, supabaseAnonKey);

  cachedClient = {
    getSupabaseClient: () => client,
    logout: async () => {
      await client.auth.signOut();
    },
  };

  return cachedClient;
}
