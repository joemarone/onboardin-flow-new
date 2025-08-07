import { useEffect, useState } from 'react';
import { fetchEmailLogs } from '../lib/api/emailLogs.js';

export default function EmailLogs({ customerId }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!customerId) return;
    fetchEmailLogs(customerId)
      .then(setLogs)
      .catch(console.error);
  }, [customerId]);

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