
import { supabase } from '../../supabaseClient.js';

export async function fetchEmailTemplates() {
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .order('key');
  if (error) throw error;
  return data || [];
}

export async function updateEmailTemplate(id, values) {
  const { data, error } = await supabase
    .from('email_templates')
    .update(values)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
