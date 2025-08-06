import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import RichTextEditor from './RichTextEditor';

export default function EmailTemplates() {
  const [templates, setTemplates] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('key');
      if (error) console.error(error);
      setTemplates(data || []);
    })();
  }, []);

  const startEdit = t => {
    setEditing({ ...t });
  };

  async function save() {
    const { error } = await supabase
      .from('email_templates')
      .update({ subject: editing.subject, body: editing.body })
      .eq('id', editing.id);
    if (error) return console.error(error);
    setTemplates(ts => ts.map(t => t.id === editing.id ? editing : t));
    setEditing(null);
  }

  return (
    <section>
      <h2>Email Templates</h2>
      {editing ? (
        <div>
          <div><strong>{editing.key}</strong></div>
          <input
            value={editing.subject}
            onChange={e => setEditing({ ...editing, subject: e.target.value })}
          />
          <RichTextEditor
            value={editing.body || ''}
            onChange={body => setEditing({ ...editing, body })}
          />
          <button onClick={save}>Save</button>
          <button onClick={() => setEditing(null)}>Cancel</button>
        </div>
      ) : (
        <ul>
          {templates.map(t => (
            <li key={t.id} onClick={() => startEdit(t)}>
              <strong>{t.key}</strong> — {t.subject}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}