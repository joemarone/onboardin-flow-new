import { useEffect, useState } from 'react';
import { fetchStaff } from '../lib/api/staff.js';

export default function StaffManager() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetchStaff()
      .then(setStaff)
      .catch(console.error);
  }, []);

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