import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function StepControls({ customer, onUpdated }) {
  const [c, setC] = useState(customer);

  useEffect(() => { setC(customer); }, [customer]);

  function set(k, v) { setC(prev => ({ ...prev, [k]: v })); }

  async function save() {
    const updates = {
      step1_converted: c.step1_converted,
      step1_using_esa: c.step1_using_esa,
      step2_consent:   c.step2_consent,
      step2_payment:   c.step2_payment,
      step:            c.step
    };
    const { error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', c.id);
    if (error) return console.error(error);
    if (onUpdated) onUpdated({ ...c, ...updates });
  }

  return (
    <div>
      <h4>Workflow</h4>
      <label><input type="checkbox" checked={!!c.step1_converted} onChange={e=>set('step1_converted', e.target.checked)} /> Step 1: Converted</label>
      <label><input type="checkbox" checked={!!c.step1_using_esa} onChange={e=>set('step1_using_esa', e.target.checked)} /> Using ESA?</label>
      <label><input type="checkbox" checked={!!c.step2_consent} onChange={e=>set('step2_consent', e.target.checked)} /> Consent complete</label>
      <label><input type="checkbox" checked={!!c.step2_payment} onChange={e=>set('step2_payment', e.target.checked)} /> Payment complete</label>
      <div>
        <select value={c.step} onChange={e=>set('step', e.target.value)}>
          <option value="step_1_convert">Step 1</option>
          <option value="step_2_process">Step 2</option>
          <option value="step_3_support">Step 3</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <button onClick={save}>Save</button>
    </div>
  );
}