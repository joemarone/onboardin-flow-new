import { useEffect, useState } from 'react';
import { Users, Clock, User, Mail, CheckCircle } from 'lucide-react';
import CustomerTable from './components/CustomerTable';
import ParentForm from './components/ParentForm';
import Notes from './components/Notes';
import EmailLogs from './components/EmailLogs';
import EmailTemplates from './components/EmailTemplates';
import StaffManager from './components/StaffManager';
import StepControls from './components/StepControls';
import { fetchCustomers } from './lib/api/customers.js';

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);

  const loadCustomers = async () => {
    try {
      const data = await fetchCustomers();
      setCustomers(data);
      if (selected) {
        const fresh = data.find(c => c.id === selected.id);
        if (fresh) setSelected(fresh);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadCustomers(); }, []);

  const stepCount = step => customers.filter(c => c.step === step).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900">
                Alpha Anywhere - Customer Onboarding
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Step 1: Convert</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stepCount('step_1_convert')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <User className="h-8 w-8 text-yellow-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Step 2: Process</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stepCount('step_2_process')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Step 3: Support</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stepCount('step_3_support')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stepCount('completed')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <CustomerTable customers={customers} onSelect={setSelected} />
            </div>
          </div>
          <div className="space-y-6">
            <ParentForm onCreated={loadCustomers} />
            {selected && (
              <>
                <StepControls customer={selected} onUpdated={loadCustomers} />
                <Notes customerId={selected.id} />
                <EmailLogs customerId={selected.id} />
              </>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmailTemplates />
          <StaffManager />
        </div>
      </div>
    </div>
  );
}