import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function EmailTemplates() {
  const [templates, setTemplates] = useState([]);

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

  return (
    <section>
      <h2>Email Templates</h2>
      <ul>
        {templates.map(t => (
          <li key={t.id}>
            <strong>{t.key}</strong> — {t.subject}
          </li>
        ))}
      </ul>
    </section>
  );
}
