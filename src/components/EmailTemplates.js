import { useEffect, useState } from 'react';
import { fetchEmailTemplates, updateEmailTemplate } from '../lib/api/emailTemplates.js';
import RichTextEditor from './RichTextEditor';

export default function EmailTemplates() {
  const [templates, setTemplates] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchEmailTemplates()
      .then(setTemplates)
      .catch(console.error);
  }, []);

  const startEdit = t => {
    setEditing({ ...t });
  };

  async function save() {
    try {
      await updateEmailTemplate(editing.id, { subject: editing.subject, body: editing.body });
      setTemplates(ts => ts.map(t => t.id === editing.id ? editing : t));
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
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
