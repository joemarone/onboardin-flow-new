import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';

export default function ParentForm({ onCreated }) {
  const [form, setForm] = useState({
    parent_first_name: '',
    parent_last_name: '',
    parent_email: '',
    student_first_name: '',
    student_last_name: '',
    start_date: '',
    transfer: false,
    advisor_id: null,
    support_id: null
  });

  const [advisors, setAdvisors] = useState([]);
  const [supports, setSupports] = useState([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('id, name, role');
      if (error) return console.error(error);
      setAdvisors((data || []).filter(s => s.role === 'advisor'));
      setSupports((data || []).filter(s => s.role === 'support'));
    })();
  }, []);

  function set(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    const payload = { ...form, start_date: form.start_date || null };
    const { error } = await supabase.from('customers').insert([payload]);
    if (error) return console.error(error);
    if (onCreated) onCreated();
    setForm({
      parent_first_name: '', parent_last_name: '', parent_email: '',
      student_first_name: '', student_last_name: '',
      start_date: '', transfer: false, advisor_id: null, support_id: null
    });
  }

  return (
    <form onSubmit={submit}>
      <h3>Add Parent/Student</h3>
      <input placeholder="Parent First" value={form.parent_first_name} onChange={e=>set('parent_first_name', e.target.value)} />
      <input placeholder="Parent Last"  value={form.parent_last_name}  onChange={e=>set('parent_last_name', e.target.value)} />
      <input placeholder="Parent Email" value={form.parent_email}      onChange={e=>set('parent_email', e.target.value)} />
      <input placeholder="Student First" value={form.student_first_name} onChange={e=>set('student_first_name', e.target.value)} />
      <input placeholder="Student Last"  value={form.student_last_name}  onChange={e=>set('student_last_name', e.target.value)} />
      <input placeholder="Start Date (YYYY-MM-DD)" value={form.start_date} onChange={e=>set('start_date', e.target.value)} />
      <label>
        <input type="checkbox" checked={form.transfer} onChange={e=>set('transfer', e.target.checked)} />
        Transfer?
      </label>
      <select value={form.advisor_id || ''} onChange={e=>set('advisor_id', e.target.value ? Number(e.target.value) : null)}>
        <option value=''>Select Advisor</option>
        {advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
      <select value={form.support_id || ''} onChange={e=>set('support_id', e.target.value ? Number(e.target.value) : null)}>
        <option value=''>Select Support</option>
        {supports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <button type="submit">Add</button>
    </form>
  );
}