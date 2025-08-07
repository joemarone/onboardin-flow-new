import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';

export default function EmailLogs({ customerId }) {
  const [logs, setLogs] = useState([]);

  async function load() {
    const { data, error } = await supabase
      .from('email_logs')
      .select(`id, template, to_email, sent_at, sender:sent_by (name, email)`)
      .eq('customer_id', customerId)
      .order('sent_at', { ascending: false });
    if (error) console.error(error);
    setLogs(data || []);
  }

  useEffect(() => { if (customerId) load(); }, [customerId]);

  return (
    <div>
      <h4>Email Sends</h4>
      <ul>
        {logs.map(l => (
          <li key={l.id}>
            {l.template} → {l.to_email} @ {new Date(l.sent_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}