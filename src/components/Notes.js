import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';

export default function Notes({ customerId }) {
  const [notes, setNotes] = useState([]);
  const [body, setBody] = useState('');

  async function load() {
    const { data, error } = await supabase
      .from('notes')
      .select(`id, body, created_at, author:author_id (name, email)`)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    setNotes(data || []);
  }

  async function addNote() {
    if (!body.trim()) return;
    const { error } = await supabase
      .from('notes')
      .insert([{ customer_id: customerId, author_id: null, body }]);
    if (error) return console.error(error);
    setBody('');
    load();
  }

  useEffect(() => { if (customerId) load(); }, [customerId]);

  return (
    <div>
      <h4>Notes</h4>
      <div>
        <textarea value={body} onChange={e=>setBody(e.target.value)} />
        <button onClick={addNote}>Add</button>
      </div>
      <ul>
        {notes.map(n => (
          <li key={n.id}>
            {n.body} — {new Date(n.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}