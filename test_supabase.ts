import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve('/Volumes/SEAGATE HARD DISK/Club-Management/.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function test() {
  const { data, error } = await supabase
    .from('events')
    .select('*, clubs(name, logo_url)')
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Supabase Error:', JSON.stringify(error, null, 2));
  } else {
    console.log('Success, data length:', data?.length);
  }
}

test();
