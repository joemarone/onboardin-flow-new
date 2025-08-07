import React from 'react';

export default function CustomerTable({ customers = [], onSelect }) {
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
          {customers.map(r => (
            <tr key={r.id} onClick={() => onSelect && onSelect(r)}>
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