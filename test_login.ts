import { createServerClient } from '@supabase/ssr';
import { loginAction } from './apps/web/app/actions/auth';
// Wait, loginAction uses headers/cookies from next, it won't work in a script
