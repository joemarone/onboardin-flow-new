import { supabase } from '../../supabaseClient.js';

export async function fetchCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select(`
      *,
      advisor:advisor_id (name, email),
      support:support_id (name, email)
    `)
    .order('created_at');
  if (error) throw error;
  return data || [];
}

export async function insertCustomer(payload) {
  const { data, error } = await supabase
    .from('customers')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCustomerStep(id, updates) {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
