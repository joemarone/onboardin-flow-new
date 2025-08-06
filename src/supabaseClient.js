import { createClient } from '@supabase/supabase-js';
console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key (first 10 chars):', supabaseAnonKey?.substring(0, 10));

// These come from your Supabase project settings → API
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
