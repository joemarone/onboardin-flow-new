import { useEffect, useState } from 'react';
import { fetchStaff, insertCustomer } from '../lib/api/index.js';

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
    fetchStaff()
      .then(data => {
        setAdvisors(data.filter(s => s.role === 'advisor'));
        setSupports(data.filter(s => s.role === 'support'));
      })
      .catch(console.error);
  }, []);

  function setField(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    const payload = { ...form, start_date: form.start_date || null };
    try {
      await insertCustomer(payload);
      if (onCreated) onCreated();
      setForm({
        parent_first_name: '', parent_last_name: '', parent_email: '',
        student_first_name: '', student_last_name: '',
        start_date: '', transfer: false, advisor_id: null, support_id: null
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={submit}>
      <h3>Add Parent/Student</h3>
      <input placeholder="Parent First" value={form.parent_first_name} onChange={e=>setField('parent_first_name', e.target.value)} />
      <input placeholder="Parent Last"  value={form.parent_last_name}  onChange={e=>setField('parent_last_name', e.target.value)} />
      <input placeholder="Parent Email" value={form.parent_email}      onChange={e=>setField('parent_email', e.target.value)} />
      <input placeholder="Student First" value={form.student_first_name} onChange={e=>setField('student_first_name', e.target.value)} />
      <input placeholder="Student Last"  value={form.student_last_name}  onChange={e=>setField('student_last_name', e.target.value)} />
      <input placeholder="Start Date (YYYY-MM-DD)" value={form.start_date} onChange={e=>setField('start_date', e.target.value)} />
      <label>
        <input type="checkbox" checked={form.transfer} onChange={e=>setField('transfer', e.target.checked)} />
        Transfer?
      </label>
      <select value={form.advisor_id || ''} onChange={e=>setField('advisor_id', e.target.value ? Number(e.target.value) : null)}>
        <option value=''>Select Advisor</option>
        {advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
      <select value={form.support_id || ''} onChange={e=>setField('support_id', e.target.value ? Number(e.target.value) : null)}>
        <option value=''>Select Support</option>
        {supports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <button type="submit">Add</button>
    </form>
  );
}