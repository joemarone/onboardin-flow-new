import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function CustomerTable({ onSelect, reload = 0 }) {
  const [rows, setRows] = useState([]);

  async function load() {
    const { data, error } = await supabase
      .from('customers')
      .select(`
        *,
        advisor:advisor_id (name,email),
        support:support_id (name,email)
      `)
      .order('created_at');
    if (error) console.error(error);
    setRows(data || []);
  }

  useEffect(() => { load(); }, [reload]);

  return (
    <section>
      <h2>Customers</h2>
      <table>
        <thead>
          <tr>
            <th>Parent</th><th>Student</th><th>Advisor</th><th>Step</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} onClick={()=>onSelect && onSelect(r)}>
              <td>{r.parent_first_name} {r.parent_last_name}</td>
              <td>{r.student_first_name} {r.student_last_name}</td>
              <td>{r.advisor?.name || '—'}</td>
              <td>{r.step}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}