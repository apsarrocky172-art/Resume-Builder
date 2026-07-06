import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Database] Missing Supabase URL or Key in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const connectDB = async () => {
  console.log('[Database] Supabase Client Initialized.');
};
