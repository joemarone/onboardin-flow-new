import { supabase } from '../../supabaseClient.js';

export async function fetchStaff() {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('created_at');
  if (error) throw error;
  return data || [];
}
