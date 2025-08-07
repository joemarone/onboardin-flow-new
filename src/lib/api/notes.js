import { supabase } from '../../supabaseClient.js';

export async function fetchNotes(customerId) {
  const { data, error } = await supabase
    .from('notes')
    .select(`id, body, created_at, author:author_id (name, email)`)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function insertNote({ customer_id, author_id = null, body }) {
  const { data, error } = await supabase
    .from('notes')
    .insert([{ customer_id, author_id, body }])
    .select()
    .single();
  if (error) throw error;
  return data;
}
