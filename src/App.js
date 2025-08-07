import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient.js';
import ParentForm from './components/ParentForm';
import CustomerTable from './components/CustomerTable';
import StepControls from './components/StepControls';
import Notes from './components/Notes';
import EmailLogs from './components/EmailLogs';
import EmailTemplates from './components/EmailTemplates';
import StaffManager from './components/StaffManager';

export default function App() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;
    async function checkConnection() {
      const { error } = await supabase
        .from('customers')
        .select('id', { count: 'exact', head: true });
      if (error) {
        console.error('Database connection error:', error.message);
      } else {
        console.log('Database connection established');
      }
    }
    checkConnection();
  }, []);

  const refresh = () => setReloadFlag(r => r + 1);

  const handleStepUpdate = updated => {
    setSelectedCustomer(updated);
    refresh();
  };

  return (
    <div className="App">
      <h1>Onboarding Flow</h1>
      <ParentForm onCreated={refresh} />
      <CustomerTable reload={reloadFlag} onSelect={setSelectedCustomer} />
      {selectedCustomer && (
        <div>
          <h3>
            {selectedCustomer.parent_first_name} {selectedCustomer.parent_last_name}
          </h3>
          <StepControls customer={selectedCustomer} onUpdated={handleStepUpdate} />
          <Notes customerId={selectedCustomer.id} />
          <EmailLogs customerId={selectedCustomer.id} />
        </div>
      )}
      <EmailTemplates />
      <StaffManager />
    </div>
  );
}