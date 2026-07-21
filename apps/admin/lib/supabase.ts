import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { Database } from '@repo/supabase';
import { cookies } from 'next/headers';
import { createServiceClient } from '@repo/supabase';

// Use placeholders during build time to prevent evaluation failures
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Client Component helper (for Login page client checks/auth actions)
export const createClient = () => {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey) as any;
};

// Standard Server Component / Action helper (auth-governed RLS client)
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
        } catch (error) {}
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {}
      },
    },
  }) as any;
};

// privileged Server-only client that bypasses RLS
export const createAdminServiceClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
  return createServiceClient(supabaseUrl, serviceRoleKey) as any;
};
