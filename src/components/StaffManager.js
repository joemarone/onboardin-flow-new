import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';

export default function StaffManager() {
  const [staff, setStaff] = useState([]);

  async function load() {
    const { data, error } = await supabase.from('staff').select('*').order('created_at');
    if (error) console.error(error);
    setStaff(data || []);
  }

  useEffect(() => { load(); }, []);

  return (
    <section>
      <h2>Staff</h2>
      <ul>
        {staff.map(s => (
          <li key={s.id}>{s.name} — {s.email} ({s.role})</li>
        ))}
      </ul>
      {/* TODO: add add/edit/delete UI */}
    </section>
  );
}
