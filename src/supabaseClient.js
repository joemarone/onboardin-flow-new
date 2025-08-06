import { createClient } from '@supabase/supabase-js';

// These come from your Supabase project settings → API
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'http://localhost';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'public-anon-key';

console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key (first 10 chars):', supabaseAnonKey?.substring(0, 10));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
