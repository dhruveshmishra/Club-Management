import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { Database } from '@repo/supabase';
import { cookies } from 'next/headers';

// Use placeholders during build time to prevent evaluation failures
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Client Component helper
export const createClient = () => {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey) as any;
};

// Server Component / Server Action / Route Handler helper
export const createServerSideClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // This can be ignored if called from Server Components
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // This can be ignored if called from Server Components
        }
      },
    },
  }) as any;
};
