import { supabase } from '../../supabaseClient.js';

export async function fetchEmailLogs(customerId) {
  const { data, error } = await supabase
    .from('email_logs')
    .select(`id, template, to_email, sent_at, sender:sent_by (name, email)`)
    .eq('customer_id', customerId)
    .order('sent_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function insertEmailLog(payload) {
  const { data, error } = await supabase
    .from('email_logs')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}