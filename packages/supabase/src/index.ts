import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

export * from './database.types';

export const createClient = (url: string, anonKey: string) => {
  if (!url || !anonKey) {
    throw new Error('Supabase URL and Anon Key must be provided');
  }
  return createSupabaseClient<Database>(url, anonKey);
};

export const createServiceClient = (url: string, serviceRoleKey: string) => {
  if (!url || !serviceRoleKey) {
    throw new Error('Supabase URL and Service Role Key must be provided');
  }
  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
