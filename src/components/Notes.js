import { useEffect, useState } from 'react';
import { fetchNotes, insertNote } from '../lib/api/notes.js';

export default function Notes({ customerId }) {
  const [notes, setNotes] = useState([]);
  const [body, setBody] = useState('');

  async function load() {
    try {
      const data = await fetchNotes(customerId);
      setNotes(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function addNote() {
    if (!body.trim()) return;
    try {
      await insertNote({ customer_id: customerId, body });
      setBody('');
      load();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { if (customerId) load(); }, [customerId]);

  return (
    <div>
      <h4>Notes</h4>
      <div>
        <textarea value={body} onChange={e => setBody(e.target.value)} />
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
